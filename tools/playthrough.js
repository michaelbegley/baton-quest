// Baton Quest's playthrough check (B31, version 126; B32, version 127: the rest): node tools/playthrough.js [--build=FILE] [--routes=FILE] [--rest=FILE|none] [--pics [--root=DIR]]
// Plays the adventure from a fresh file (an empty store) with nothing but keys pressed frame by frame: the recorded routes in tools/playthrough-routes.txt,
// fed in through tools/replay.js's harness (the real runtime, a canvas that draws nothing, a seeded Math.random, fixed frames of 1/60 s). No cheat is
// called: no warp, no god mode, no beatBoss. The title's NEW GAME, the intro, every level, the bosses, the texts and the map are all played by the keys.
// For each level it notes the frame it loaded and the frame it was finished (cleared, or for a secret level, left by its E), the moves he had there,
// and his hearts and falls. It checks each level is finished in story order with only its world's moves (world 1 none; then dash, hover, pound, one a
// world). A control runs first: the same routes with every jump taken out of 1-1 must not finish 1-1 (the check can see a failure).
// The rest (version 127): the same file goes on, with the keys in tools/playthrough-rest.txt (a second file, so the story's routes and lines stay as they
// were; made by B32's route maker, scratch, as B31's), from the ending to: (1) THE FOLLOW-UP in SPAM TOWER (w1-3, reached through w1-1 and w1-2 from the
// map), touched at the top of the shaft that only PUSHBACK climbs: FOLLOW UP learned; (2) THE ENCORE won (the four bosses back to back from its stop on
// the map, to its results); (3) THE ROOT FOLDER finished (open once the game is won with SECRETS 4/4: its five rooms in order, README.TXT read in the last,
// the map). Each is checked in the state, and at the end in the file the game saved (FOLLOW UP known, THE ENCORE's best time, the flag root). Its control:
// the same keys with every A taken out of its SPAM TOWER segment must not learn FOLLOW UP.
// The routes were made with B31's route maker (scratch), which drives the conductor with a copy of his physics and records the keys it pressed. A level
// that changes will put its route out of step: this check then says which level it stopped in, and the route is made again.
// --pics: the same keys again in a browser (Playwright, as the other browser checks: one at a time), with a picture of each level's end in
// tools/out/playthrough-ID.png (a door's level as he goes in at it, a boss as its move is learned), and its level checked there too; and of the rest:
// each of its segments' last frame and its three ends (tools/out/playthrough-rest-NAME.png), checked against the screen node saw at that frame.
'use strict';
const fs = require('fs'), path = require('path');
const { copy } = require('./replay.js');
const ROOT = path.join(__dirname, '..');
const KEYS = ['left', 'right', 'up', 'down', 'a', 'b', 'start', 'c'], CH = 'lrudabsc';
const STORY = ['w1-1', 'w1-2', 'w1-bonus', 'w1-3', 'w1-boss', 'w2-1', 'w2-bonus', 'w2-2', 'w2-3', 'w2-boss', 'w3-1', 'w3-bonus', 'w3-2', 'w3-3', 'w3-boss',
  'w4-1', 'w4-bonus', 'w4-2', 'w4-3', 'w4-boss'];   // the 20, in the order the story meets them (a secret level inside the level whose door leads to it: 1-2, 2-1, 3-1, 4-1)
const MOVES = { 1: [], 2: ['dash'], 3: ['dash', 'hover'], 4: ['dash', 'hover', 'pound'] };   // each world's moves from its bosses (QUICK KEYS, PAUSE TO THINK, FIRM HAND)
const ROOMS = ['root-1', 'root-2', 'root-3', 'root-4', 'root-5'], ENCORE = ['w1-boss', 'w2-boss', 'w3-boss', 'w4-boss'];

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
function saved(G) {   // the file the game saved last (the store's bundle: its current file), or null
  for (const k in G.store) { try { const j = JSON.parse(G.store[k]); if (j && j.files) return j.files[j.cur] || null; } catch (e) { /* not a bundle */ } }
  return null;
}
function playRest(G, rest, f, onFrame) {   // the rest, in the same copy after the story: its segments' frames, the levels it is in, and its three ends
  const R = { segs: [], levels: [], dj: null, encore: { from: null, fights: [], won: null }, root: { rooms: [], read: null, map: null }, f0: f };
  let st = null, lastLv = '', stars0 = -1;
  for (const s of rest) {
    const seg = { name: s.name, from: f + 1, to: null, end: '' };
    for (const k of s.keys) {
      st = JSON.parse(G.step(k).st || '{}'); f++;
      if (st.god) throw new Error('god mode seen at frame ' + f);
      const here = st.screen === 'level' ? st.level : '';
      if (here && here !== lastLv) R.levels.push({ id: here, from: f, encore: !!st.encore, seg: s.name });
      if (here) { R.levels[R.levels.length - 1].to = f; lastLv = here; } else if (st.screen !== 'pause') lastLv = '';
      if (!R.dj && (st.abilities || []).indexOf('doublejump') >= 0) R.dj = { f, level: here, moves: st.abilities.slice(), seg: s.name };
      if (st.encore && R.encore.from === null) R.encore.from = f;
      if (st.screen === 'encore' && R.encore.won === null) R.encore.won = f;
      if (here === 'root-5' && stars0 < 0) stars0 = st.stars;
      if (here === 'root-5' && R.root.read === null && st.stars > stars0) R.root.read = f;   // README.TXT read: the star root is won with the event root
      if (R.root.read !== null && R.root.map === null && st.screen === 'map') R.root.map = f;
      if (onFrame) onFrame(f, st, k);
    }
    seg.to = f; seg.end = st.screen + (st.level ? ' ' + st.level : ''); R.segs.push(seg);
  }
  R.encore.fights = R.levels.filter((v) => v.encore && ENCORE.indexOf(v.id) >= 0);
  R.root.rooms = R.levels.filter((v) => ROOMS.indexOf(v.id) >= 0);
  R.frames = f - R.f0; R.st = st; R.save = saved(G);
  return R;
}
function play(code, segs, onFrame, rest) {   // the keys into a fresh copy; per level: { id, from, to, moves, hp, falls, world }; then the rest (if given)
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
  const out = { seen: seen.map((id) => byId[id]), frames: f, st, errors: G.errors };
  if (rest && rest.length) out.rest = playRest(G, rest, f, onFrame);
  return out;
}
function restLines(p, say) {   // the rest's checks, from play()'s rest; returns how many of the three ends were reached
  const R = p.rest, S = R.save || {}, lv = (id) => R.levels.filter((v) => v.id === id), fr = (a, b) => 'frames ' + a + ' to ' + b + ' (' + (b - a + 1) + ', ' + ((b - a + 1) / 60).toFixed(1) + ' s)';
  let ends = 0;
  console.log('\nthe rest, in the same file from frame ' + (R.f0 + 1) + ':');
  for (const s of R.segs) console.log('     ' + s.name + ': ' + fr(s.from, s.to) + ', at its end: ' + s.end);
  const w13 = lv('w1-3').find((v) => R.dj && R.dj.f >= v.from && R.dj.f <= v.to), had = R.dj ? R.dj.moves.filter((m) => m !== 'doublejump') : [];
  let ok = !!R.dj && !!w13 && had.indexOf('walljump') >= 0 && !!S.abilities && S.abilities.indexOf('doublejump') >= 0;
  say(ok, '1 THE FOLLOW-UP: ' + (R.dj ? 'FOLLOW UP learned at frame ' + R.dj.f + ' in ' + (R.dj.level || 'NO LEVEL') + (w13 ? ' (in it from frame ' + w13.from + ', ' + w13.seg + ' segment)' : '') +
    ', his moves before it [' + had.join(' ') + ']' : 'FOLLOW UP NOT LEARNED') + '; the saved file knows it: ' + (S.abilities && S.abilities.indexOf('doublejump') >= 0 ? 'yes' : 'NO'));
  if (ok) ends++;
  const E = R.encore, order = E.fights.map((v) => v.id).join(' ');
  ok = E.from !== null && E.won !== null && order === ENCORE.join(' ') && S.encore > 0;
  say(ok, '2 THE ENCORE: started at frame ' + E.from + '; its fights ' + (E.fights.map((v) => v.id + ' ' + v.from + '-' + v.to).join(', ') || 'NONE') + (order === ENCORE.join(' ') ? '' : ' (NOT THE FOUR IN ORDER)') +
    '; its results at frame ' + E.won + '; the saved file\'s best time: ' + (S.encore > 0 ? S.encore + ' s' : 'NONE'));
  if (ok) ends++;
  const T = R.root, rooms = T.rooms.map((v) => v.id).join(' ');
  ok = rooms === ROOMS.join(' ') && T.read !== null && T.map !== null && !!(S.flags && S.flags.root);
  say(ok, '3 THE ROOT FOLDER: ' + (T.rooms.map((v) => v.id + ' ' + v.from + '-' + v.to).join(', ') || 'NO ROOM') + (rooms === ROOMS.join(' ') ? '' : ' (NOT THE FIVE IN ORDER)') +
    '; README.TXT read at frame ' + T.read + ', the map at frame ' + T.map + '; the saved file\'s flag root: ' + (S.flags && S.flags.root ? 'set' : 'NOT SET'));
  if (ok) ends++;
  const stray = R.levels.filter((v) => ['w1-1', 'w1-2', 'w1-3'].concat(ENCORE, ROOMS).indexOf(v.id) < 0);
  say(!stray.length, 'the rest goes into no other level (' + (stray.map((v) => v.id).join(' ') || 'none') + ')');
  console.log('     the rest played ' + R.frames + ' frames (' + (R.frames / 3600).toFixed(1) + ' min of play); at its end: ' + R.st.screen + (R.st.level ? ' ' + R.st.level : '') + '; hearts ' + R.st.hp + ' of ' + R.st.maxHp + ', LV ' + R.st.lv + ', falls in all ' + R.st.falls);
  return ends;
}
async function pictures(segs, seen, out, root, rest) {   // --pics: the same keys in a browser page made as replay.js makes its copy (the real runtime and game, Math.random
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
  const stops = seen.filter((v) => v.to !== null).map((v) => ({ id: v.id, f: /-boss$/.test(v.id) ? v.lastIn : v.tAt })).concat(rest || []).sort((a, b) => a.f - b.f);
  let f = 0, ok = 0;
  for (const s of stops) {
    const st = await page.evaluate(([ks, names]) => { for (const m of ks) { for (let i = 0; i < names.length; i++) NFX.arcade.setKey(names[i], !!(m & (1 << i))); NFX.arcade.frame(1 / 60); } return NFX.arcade.run().state(); }, [all.slice(f, s.f), KEYS]);
    f = s.f;
    const file = path.join(T.OUT, 'playthrough-' + s.id + '.png');
    await page.screenshot({ path: file });
    const same = s.want ? st.screen + ' ' + st.level === s.want : st.screen === 'level' && st.level === s.id;
    if (same) ok++;
    console.log((same ? 'ok   ' : 'FAIL ') + 'picture of ' + (s.what || s.id + (/-boss$/.test(s.id) ? "'s last frame" : ' as he goes in at its door')) + ' (frame ' + f + '): ' + file + (same ? '' : '  (the browser shows ' + st.screen + ' ' + st.level + (s.want ? ', node showed ' + s.want : '') + ')'));
  }
  await browser.close(); srv.close();
  console.log('pictures: ' + ok + ' of ' + stops.length + ' as node had them in the browser too' + (errs.length ? '; page errors: ' + errs.slice(0, 3).join(' | ') : ''));
  return ok === stops.length && !errs.length;
}
function main() {
  const opt = {}; process.argv.slice(2).forEach((a) => { const m = /^--(\w+)(?:=(.*))?$/.exec(a); if (m) opt[m[1]] = m[2] === undefined ? true : m[2]; });
  const code = fs.readFileSync(opt.build || path.join(ROOT, 'js', 'game.js'), 'utf8'), segs = routes(opt.routes || path.join(__dirname, 'playthrough-routes.txt'));
  const restFile = opt.rest === 'none' ? '' : opt.rest || path.join(__dirname, 'playthrough-rest.txt'), rest = restFile && fs.existsSync(restFile) ? routes(restFile) : [];
  let bad = 0; const say = (ok, what) => { if (!ok) bad++; console.log((ok ? 'ok   ' : 'FAIL ') + what); };
  // the control: 1-1 with no A pressed must not be finished
  const cut = segs.map((s) => (s.name === 'w1-1' ? { name: s.name, keys: s.keys.map((k) => k.filter((n) => n !== 'a')) } : s)).slice(0, segs.findIndex((s) => s.name === 'w1-1') + 1);
  const c = play(code, cut), c11 = c.seen.find((v) => v.id === 'w1-1');
  say(!!c11 && c11.to === null, 'control: 1-1 with every jump taken out is not finished (' + (c11 ? (c11.to === null ? 'stopped in it' : 'FINISHED at frame ' + c11.to) : 'never reached') + ')');
  const t0 = Date.now(); let tStory = 0;
  const p = play(code, segs, (f) => { if (f === segs.reduce((n, s) => n + s.keys.length, 0)) tStory = Date.now() - t0; }, rest), done = p.seen.filter((v) => v.to !== null);
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
  console.log('\nplayed ' + p.frames + ' frames (' + (p.frames / 60 / 60).toFixed(1) + ' min of play) in ' + ((tStory || Date.now() - t0) / 1000).toFixed(1) + ' s; ' + done.length + ' of ' + STORY.length + ' levels finished; at the end: ' + p.st.screen + ' ' + (p.st.level || ''));
  let ends = -1;
  if (p.rest) {
    ends = restLines(p, say);
    // the rest's control: every A taken out of its SPAM TOWER segment (no jump, no kick up the shaft) must not learn FOLLOW UP
    const k = rest.findIndex((s) => s.name === 'w1-3'), cutR = rest.slice(0, k + 1).map((s, i) => (i === k ? { name: s.name, keys: s.keys.map((x) => x.filter((n) => n !== 'a')) } : s));
    const c2 = k < 0 ? null : play(code, segs, null, cutR);
    say(!!c2 && !c2.rest.dj, 'control: the rest with every A taken out of its SPAM TOWER segment does not learn FOLLOW UP (' + (!c2 ? 'NO SUCH SEGMENT' : c2.rest.dj ? 'LEARNED at frame ' + c2.rest.dj.f : 'not learned; at its end: ' + c2.rest.st.screen + (c2.rest.st.level ? ' ' + c2.rest.st.level : '')) + ')');
    console.log('the rest: ' + ends + ' of 3 ends reached by keys; ' + (p.frames + p.rest.frames) + ' frames in all (' + ((p.frames + p.rest.frames) / 3600).toFixed(1) + ' min of play) in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
  }
  console.log('RESULT playthrough: ' + (bad ? bad + ' failed' : 'every route played finishes its level' + (ends >= 0 ? '; the rest: ' + ends + ' of 3' : '')));
  process.exitCode = bad ? 1 : 0;
  if (opt.pics) {
    const R = p.rest, stops = [], want = {};
    if (R) {   // the screen node saw at each picture's frame, to check the browser against
      const at = new Set(R.segs.map((s) => s.to).concat([R.dj && R.dj.f, R.encore.won && R.encore.won + 90, R.root.read].filter((x) => x)));
      play(code, segs, (f, st) => { if (at.has(f)) want[f] = st.screen + ' ' + (st.level || ''); }, rest);
      for (const s of R.segs) stops.push({ id: 'rest-' + s.name, f: s.to, what: 'the rest\'s ' + s.name + ': its last frame', want: want[s.to] });
      if (R.dj) stops.push({ id: 'rest-followup', f: R.dj.f, what: 'THE FOLLOW-UP touched (FOLLOW UP learned)', want: want[R.dj.f] });
      if (R.encore.won) stops.push({ id: 'rest-encore-won', f: R.encore.won + 90, what: 'THE ENCORE\'s results', want: want[R.encore.won + 90] });
      if (R.root.read) stops.push({ id: 'rest-readme', f: R.root.read, what: 'README.TXT read', want: want[R.root.read] });
    }
    pictures(segs.concat(rest), p.seen, null, opt.root || ROOT, stops).then((good) => { if (!good) process.exitCode = 1; }).catch((e) => { console.error('pictures crashed:', e); process.exitCode = 2; });
  }
}
if (require.main === module) main();
module.exports = { routes, play, playRest, saved, STORY, MOVES };
