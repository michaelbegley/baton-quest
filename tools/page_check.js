// The page check: node tools/page_check.js   (BQ_ROOT=DIR for another copy)
// index.html: the version line matches every script's ?v=; nothing on load asks a host other than the page's own (fonts are ours since 122);
// MENU opens the game's SYSTEM screen and Esc closes it; the title draws. manual.html: loads clean, asks no outside host, and no page's
// content spills over its page, on a computer (1280 by 800) and a phone (390 by 844). Pictures in tools/out/page-*.png.
'use strict';
const fs = require('fs'), path = require('path');
const T = require('./bqtest');
(async () => {
  const html = fs.readFileSync(path.join(T.ROOT, 'index.html'), 'utf8');
  const line = (html.match(/version ([0-9]+(?:\.[0-9]+)?)<\/p>/) || [])[1];
  const vs = (html.match(/\?v=[0-9.]+/g) || []).map((s) => s.slice(3));
  const t = await T.start({ name: 'page' });
  t.ok(line && vs.length === 6 && vs.every((v) => v === line), 'the version line (' + line + ') matches all six ?v= (' + vs.join(', ') + ')', { line, vs });
  const outside = [];
  t.page.on('request', (r) => { const u = new URL(r.url()); if (!/^(127\.0\.0\.1|localhost)$/.test(u.hostname) && u.protocol !== 'data:' && u.protocol !== 'blob:') outside.push(r.url()); });
  await t.page.reload(); await t.page.waitForFunction(() => window.NFX && NFX.arcade && NFX.arcade.run && NFX.arcade.run()); await t.wait(2000);
  t.ok(outside.length === 0, 'the game page asks no outside host on load', outside.slice(0, 5));
  await t.shot('page-title');
  await t.page.click('#helpBtn'); await t.wait(600);
  let b = await t.eval(() => window.BQ_BRIDGE.state());
  t.ok(b.sys === true, 'MENU opens the game\'s SYSTEM screen', b);
  await t.press('Escape'); await t.wait(400); b = await t.eval(() => window.BQ_BRIDGE.state());
  t.ok(b.sys === false, 'Esc closes it', b);
  // the booklet, on a computer and a phone
  for (const vp of [{ width: 1280, height: 800, name: 'computer' }, { width: 390, height: 844, name: 'phone' }]) {
    const ctx = await t.browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: vp.name === 'phone', isMobile: vp.name === 'phone' });
    const pg = await ctx.newPage(), errs = [], out2 = [];
    pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    pg.on('request', (r) => { const u = new URL(r.url()); if (!/^(127\.0\.0\.1|localhost)$/.test(u.hostname) && u.protocol !== 'data:' && u.protocol !== 'blob:') out2.push(r.url()); });
    await pg.goto(t.base + 'manual.html'); await pg.waitForTimeout(2500);
    if (process.env.BQ_SPILL_TEST) await pg.evaluate(() => { const p = document.createElement('p'); p.textContent = 'SPILL '.repeat(900); document.querySelectorAll('section.page')[7].appendChild(p); });   // proves the check sees a spill
    // every page drawn in turn (only the leaves beside the open pages are drawn): turn with the page's own Next button and measure the faces
    // that show; a spill is any element inside a page reaching below its face (the face clips it, so the reader loses it)
    const r = [], seen = {};
    for (let k = 0; k < 40; k++) {
      const got = await pg.evaluate(() => [].map.call(document.querySelectorAll('.leaf:not(.far) .face'), (f) => {
        const s = f.querySelector('section.page'); if (!s || s.classList.contains('blank')) return null;
        const fb = f.getBoundingClientRect(); if (fb.height < 10) return null;
        let worst = 0; [].forEach.call(s.querySelectorAll('*'), (el) => { if (el.classList.contains('folio') || el.closest('.folio')) return; const b = el.getBoundingClientRect(); if (b.height > 0 && b.bottom - fb.bottom > worst) worst = b.bottom - fb.bottom; });
        return { i: [].indexOf.call(document.querySelectorAll('section.page'), s), label: s.getAttribute('data-label'), spill: Math.round(worst) };
      }).filter(Boolean));
      got.forEach((g) => { if (!(g.i in seen) || g.spill > seen[g.i].spill) seen[g.i] = g; });
      const more = await pg.evaluate(() => { const b = document.getElementById('next'); if (!b || b.disabled) return false; b.click(); return true; });
      if (!more) break;
      await pg.waitForTimeout(900);
    }
    Object.keys(seen).forEach((k) => r.push(seen[k]));
    const spills = r.filter((p) => p.spill > 1);
    t.ok(r.length >= 20, 'the booklet (' + vp.name + '): ' + r.length + ' pages measured', r.length);
    t.ok(spills.length === 0, 'the booklet (' + vp.name + '): no page spills over', spills.slice(0, 5));
    t.ok(errs.length === 0, 'the booklet (' + vp.name + ') loads with no errors', errs.slice(0, 3));
    t.ok(out2.length === 0, 'the booklet (' + vp.name + ') asks no outside host', out2.slice(0, 3));
    await pg.screenshot({ path: path.join(T.OUT, 'page-manual-' + vp.name + '.png') });
    await ctx.close();
  }
  await t.done();
})().catch((e) => { console.error('page check crashed:', e); process.exitCode = 2; });
