// Helpers for Baton Quest's browser checks (Playwright, Chromium). Each check file does:
//   const T = require('./bqtest'); (async () => { const t = await T.start(); ... t.ok(cond, 'what', info); ... await t.done(); })();
// t.page is the Playwright page on index.html, served from the repo root (or BQ_ROOT) over http on a free port, with fresh storage.
// t.state() is the game's state (99-main.js engState); t.cheat(name, ...args) calls the game's cheats (warp, give, god, end, ...);
// t.key(name, ms) holds a runtime key ('left','right','up','down','a','b','c','start') for ms; t.press(code) types a real key on the page;
// t.wait(ms); t.shot(name) saves a picture in tools/out/ (look at it); t.errors is every page error and console error so far.
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = process.env.BQ_ROOT ? path.resolve(process.env.BQ_ROOT) : path.join(__dirname, '..');
const OUT = path.join(__dirname, 'out');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.json': 'application/json', '.mp3': 'audio/mpeg', '.txt': 'text/plain', '.ico': 'image/x-icon' };

function serve(root) {
  return new Promise((res) => {
    const srv = http.createServer((req, rsp) => {
      let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
      const f = path.join(root, path.normalize(p).replace(/^(\.\.[\/\\])+/, ''));
      if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rsp.writeHead(404); rsp.end('no'); return; }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(f).pipe(rsp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

async function start(opts) {
  opts = opts || {};
  fs.mkdirSync(OUT, { recursive: true });
  const srv = await serve(opts.root || ROOT);
  const base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch();
  const ctx = await browser.newContext(Object.assign({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 }, opts.context || {}));
  const page = await ctx.newPage();
  const t = { page, ctx, browser, base, errors: [], pass: 0, fail: 0, name: opts.name || 'check' };
  page.on('pageerror', (e) => t.errors.push('pageerror: ' + String(e && e.stack || e).split('\n').slice(0, 3).join(' | ')));
  page.on('console', (m) => { if (m.type() === 'error') t.errors.push('console: ' + m.text()); });
  if (opts.init) await page.addInitScript(opts.init);
  await page.goto(base + (opts.path || 'index.html') + (opts.query || ''));
  await page.waitForFunction(() => window.NFX && NFX.arcade && NFX.arcade.run && NFX.arcade.run() && NFX.arcade.run().state, null, { timeout: 15000 });
  t.ok = (c, what, info) => { c ? t.pass++ : t.fail++; console.log((c ? 'ok   ' : 'FAIL ') + what + (info !== undefined && !c ? '  ' + JSON.stringify(info).slice(0, 400) : '')); return !!c; };
  t.wait = (ms) => page.waitForTimeout(ms);
  t.state = () => page.evaluate(() => NFX.arcade.run().state());
  t.cheat = (name, ...args) => page.evaluate(([n, a]) => { const c = NFX.arcade.run().cheat; return c && c[n] ? c[n].apply(null, a) : '(no cheat ' + n + ')'; }, [name, args]);
  t.key = async (name, ms) => { await page.evaluate((n) => NFX.arcade.setKey(n, true), name); await page.waitForTimeout(ms || 90); await page.evaluate((n) => NFX.arcade.setKey(n, false), name); await page.waitForTimeout(120); };
  t.press = async (code, ms) => { await page.keyboard.down(code); await page.waitForTimeout(ms || 90); await page.keyboard.up(code); await page.waitForTimeout(150); };
  t.eval = (fn, arg) => page.evaluate(fn, arg);
  t.shot = (name) => page.screenshot({ path: path.join(OUT, name + '.png') });
  t.done = async () => {
    t.ok(t.errors.length === 0, 'no page errors', t.errors.slice(0, 5));
    await browser.close(); srv.close();
    console.log('\nRESULT ' + t.name + ': ' + t.pass + ' passed, ' + t.fail + ' failed');
    process.exitCode = t.fail ? 1 : 0;
    return t.fail;
  };
  return t;
}
module.exports = { start, serve, ROOT, OUT };
