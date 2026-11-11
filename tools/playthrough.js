// Baton Quest's playthrough check (B31, version 126): node tools/playthrough.js [--build=FILE] [--routes=FILE] [--pics [--root=DIR]]
// Plays the adventure from a fresh file (an empty store) with nothing but keys pressed frame by frame: the recorded routes in tools/playthrough-routes.txt,
// fed in through tools/replay.js's harness (the real runtime, a canvas that draws nothing, a seeded Math.random, fixed frames of 1/60 s). No cheat is
// called: no warp, no god mode, no beatBoss. The title's NEW GAME, the intro, every level, the bosses, the texts and the map are all played by the keys.
// For each level it notes the frame it loaded and the frame it was finished (cleared, or for a secret level, left by its E), the moves he had there,
// and his hearts and falls. It checks each level is finished in story order with only its world's moves (world 1 none; then dash, hover, pound, one a
// world). A control runs first: the same routes with every jump taken out of 1-1 must not finish 1-1 (the check can see a failure).
// The routes were made with B31's route maker (scratch), which drives the conductor with a copy of his physics and records the keys it pressed. A level
// that changes will put its route out of step: this check then says which level it stopped in, and the route is made again.
// --pics: the same keys again in a browser (Playwright, as the other browser checks: one at a time), with a picture of each level's end in
// tools/out/playthrough-ID.png (a door's level as he goes in at it, a boss as its move is learned), and its level checked there too.
'use strict';
const fs = require('fs'), path = require('path');
const { copy } = require('./replay.js');
const ROOT = path.join(__dirname, '..');
const KEYS = ['left', 'right', 'up', 'down', 'a', 'b', 'start', 'c'], CH = 'lrudabsc';
const STORY = ['w1-1', 'w1-2', 'w1-bonus', 'w1-3', 'w1-boss', 'w2-1', 'w2-bonus', 'w2-2', 'w2-3', 'w2-boss', 'w3-1', 'w3-bonus', 'w3-2', 'w3-3', 'w3-boss',
  'w4-1', 'w4-bonus', 'w4-2', 'w4-3', 'w4-boss'];   // the 20, in the order the story meets them (a secret level inside the level whose door leads to it: 1-2, 2-1, 3-1, 4-1)
const MOVES = { 1: [], 2: ['dash'], 3: ['dash', 'hover'], 4: ['dash', 'hover', 'pound'] };   // each world's moves from its bosses (QUICK KEYS, PAUSE TO THINK, FIRM HAND)

function routes(file) {   // [{ name, keys: [[held]...] }] from the run-length text
  const out = []; let cur = null;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = /^== (\S+)/.exec(line);
    if (m) { cur = { name: m[1], keys: [] }; out.push(cur); continue; }
    if (!cur || line[0] === '#') continue;
    for (const tok of line.trim().split(/\s+/)) {
      if (!tok) continue;
      const t = /^([lrudabsc_]+)(\d+)$/.exec(tok); if (!t) throw new Error('routes: bad token ' + tok);
      const k = t[1] === '_' ? [] : t[1].split('').map((c) => KEYS[CH.indexOf(c)]);
      for (let i = 0; i < +t[2]; i++) cur.keys.push(k);
    }
  }
  return out;
}
function play(code, segs, onFrame) {   // the keys into a fresh copy; per level: { id, from, to, moves, hp, falls, world }
  const G = copy(code, 125), seen = [], byId = {}, done = {};
  let f = 0, st = null, lastLv = '';
  G.open();
  for (const s of segs) for (const k of s.keys) {
    st = JSON.parse(G.step(k).st || '{}'); f++;
    if (st.god) throw new Error('god mode seen at frame ' + f);
    const here = st.screen === 'level' ? st.level : '';
    if (here && !byId[here]) { byId[here] = { id: here, from: f, to: null, moves: (st.abilities || []).slice(), falls0: st.falls, bonus: /-bonus$/.test(here) }; seen.push(here); }
    if (here && lastLv && here !== lastLv && byId[lastLv].bonus && byId[lastLv].to === null) { const v = byId[lastLv]; v.to = f - 1; v.end = { hp: v.hp1, max: v.max1, falls: st.falls - v.falls0 }; }   // a secret level left by its E
    if (here) { lastLv = here; byId[here].hp1 = st.hp; byId[here].max1 = st.maxHp; byId[here].lastIn = f; if (byId[here].to === null) byId[here].n = (byId[here].n || 0) + 1; }   // n: the frames spent in it; lastIn: its last frame
    if (here && st.t !== byId[here].t1) { byId[here].t1 = st.t; byId[here].tAt = f; }   // tAt: the last frame its clock ran (it stops as he goes in at a door, or as a boss is beaten)
    for (const id of st.cleared || []) if (!done[id]) { done[id] = true; const v = byId[id]; if (v && v.to === null) { v.to = f; v.end = { hp: v.hp1, max: v.max1, falls: st.falls - v.falls0 }; } }   // his hearts as he left it (not the next level's)
    if (onFrame) onFrame(f, st, k);
  }
  return { seen: seen.map((id) => byId[id]), frames: f, st, errors: G.errors };
}
async function pictures(segs, seen, out, root) {   // --pics: the same keys in a browser page made as replay.js makes its copy (the real runtime and game, Math.random
  // seeded the same, frames of 1/60 s), with a real canvas: a picture of each level's last frame in tools/out/playthrough-ID.png; its state is checked there too
  const T = require('./bqtest'), { chromium } = require('playwright'), srv = await T.serve(root), base = 'http://127.0.0.1:' + srv.address().port + '/';
  const browser = await chromium.launch(), page = await (await browser.newContext({ viewport: { width: 960, height: 600 } })).newPage(), errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.setContent('<!doctype html><body style="margin:0;background:#000"><canvas id="c" width="320" height="200" style="display:block;width:960px;height:600px;image-rendering:pixelated"></canvas></body>');
  await page.evaluate(() => { let s = 125; Math.random = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; });   // replay.js: xorshift(125)
  await page.addScriptTag({ url: base + 'js/runtime.js' });
  await page.evaluate(() => { const store = {}; window.NFX = { arcade: makeArcade({ canvas: document.getElementById('c'), audio: () => null, keep: (k, v) => { if (v === undefined) return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; store[k] = String(v); return null; }, jot: () => {}, close: () => {} }) }; });
  await page.addScriptTag({ url: base + 'js/game.js' });
  await page.evaluate(() => NFX.arcade.open('quest'));
  const all = [].concat.apply([], segs.map((s) => s.keys)).map((k) => KEYS.reduce((m, n, i) => m | (k.indexOf(n) >= 0 ? 1 << i : 0), 0));
  // a level left by a door: the frame its clock stopped (he is in at the door; its last frames are the fade to black); a boss: its last frame (the move learned)
  const stops = seen.filter((v) => v.to !== null).map((v) => ({ id: v.id, f: /-boss$/.test(v.id) ? v.lastIn : v.tAt })).sort((a, b) => a.f - b.f);
  let f = 0, ok = 0;
  for (const s of stops) {
    const st = await page.evaluate(([ks, names]) => { for (const m of ks) { for (let i = 0; i < names.length; i++) NFX.arcade.setKey(names[i], !!(m & (1 << i))); NFX.arcade.frame(1 / 60); } return NFX.arcade.run().state(); }, [all.slice(f, s.f), KEYS]);
    f = s.f;
    const file = path.join(T.OUT, 'playthrough-' + s.id + '.png');
    await page.screenshot({ path: file });
    const same = st.screen === 'level' && st.level === s.id;
    if (same) ok++;
    console.log((same ? 'ok   ' : 'FAIL ') + 'picture of ' + s.id + (/-boss$/.test(s.id) ? "'s last frame" : ' as he goes in at its door') + ' (frame ' + f + '): ' + file + (same ? '' : '  (the browser shows ' + st.screen + ' ' + st.level + ')'));
  }
  await browser.close(); srv.close();
  console.log('pictures: ' + ok + ' of ' + stops.length + ' at their level in the browser too' + (errs.length ? '; page errors: ' + errs.slice(0, 3).join(' | ') : ''));
  return ok === stops.length && !errs.length;
}
function main() {
  const opt = {}; process.argv.slice(2).forEach((a) => { const m = /^--(\w+)(?:=(.*))?$/.exec(a); if (m) opt[m[1]] = m[2] === undefined ? true : m[2]; });
  const code = fs.readFileSync(opt.build || path.join(ROOT, 'js', 'game.js'), 'utf8'), segs = routes(opt.routes || path.join(__dirname, 'playthrough-routes.txt'));
  let bad = 0; const say = (ok, what) => { if (!ok) bad++; console.log((ok ? 'ok   ' : 'FAIL ') + what); };
  // the control: 1-1 with no A pressed must not be finished
  const cut = segs.map((s) => (s.name === 'w1-1' ? { name: s.name, keys: s.keys.map((k) => k.filter((n) => n !== 'a')) } : s)).slice(0, segs.findIndex((s) => s.name === 'w1-1') + 1);
  const c = play(code, cut), c11 = c.seen.find((v) => v.id === 'w1-1');
  say(!!c11 && c11.to === null, 'control: 1-1 with every jump taken out is not finished (' + (c11 ? (c11.to === null ? 'stopped in it' : 'FINISHED at frame ' + c11.to) : 'never reached') + ')');
  const t0 = Date.now(), p = play(code, segs), done = p.seen.filter((v) => v.to !== null);
  let order = 0;
  for (const id of STORY) {
    const v = p.seen.find((x) => x.id === id);
    if (!v) { console.log('---- ' + id + ': not reached (no route yet)'); continue; }
    const w = +id[1], n = v.n || 0, extra = v.moves.filter((m) => MOVES[w].indexOf(m) < 0);   // any move his world has not given him yet (a secret's FOLLOW UP too)
    const inOrder = p.seen.indexOf(v) >= order; order = p.seen.indexOf(v);
    say(v.to !== null && !extra.length && inOrder, id + ': ' + (v.to === null ? 'NOT FINISHED' : 'finished') + ', frames ' + v.from + ' to ' + (v.to === null ? '-' : v.to) + ' (' + n + ' frames in it, ' + (n / 60).toFixed(1) + ' s)' +
      ', moves [' + v.moves.join(' ') + ']' + (extra.length ? ' NOT THIS WORLD\'S: ' + extra.join(' ') : '') + (v.end ? ', hearts ' + v.end.hp + ' of ' + v.end.max + (v.end.falls !== undefined ? ', falls ' + v.end.falls : '') : '') + (inOrder ? '' : ', OUT OF ORDER'));
  }
  say(p.errors.length === 0, 'no game errors (' + p.errors.length + ')');
  console.log('\nplayed ' + p.frames + ' frames (' + (p.frames / 60 / 60).toFixed(1) + ' min of play) in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s; ' + done.length + ' of ' + STORY.length + ' levels finished; at the end: ' + p.st.screen + ' ' + (p.st.level || ''));
  console.log('RESULT playthrough: ' + (bad ? bad + ' failed' : 'every route played finishes its level'));
  process.exitCode = bad ? 1 : 0;
  if (opt.pics) pictures(segs, p.seen, null, opt.root || ROOT).then((good) => { if (!good) process.exitCode = 1; }).catch((e) => { console.error('pictures crashed:', e); process.exitCode = 2; });
}
if (require.main === module) main();
module.exports = { routes, play, STORY, MOVES };
