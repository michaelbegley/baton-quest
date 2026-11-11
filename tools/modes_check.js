// GAME MODES' check, part 1 (version 125, B29): node tools/modes_check.js   (BQ_ROOT=DIR to check another copy of the page)
// SPEED RUN in a fresh browser, by the page's own keyboard keys and the game's cheats. Three files are made first (FILE 3, the one played, with LIGHT
// WORKLOAD on). From the title to GAME MODES by keys; WORLD 1 four times (the door, splits, the results, RECORDS, a new best, a slower run, RESTART and
// QUIT from the run's pause), ALL 16 (the moves come from the bosses) and the other routes' starting kits. After every run the stored bundle's three
// files are byte for byte as they were at GAME MODES (only its modes, the records, change), and an explicit save in a run writes nothing.
// Part 2 (tools/modes_check_b.js): HIGH SCORE, a reload, a backup and restore, and the adventure and BATTLE after a run.
'use strict';
const T = require('./bqtest');
const crypto = require('crypto');
const KEY = 'nf-arcade-quest';
const K = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'KeyZ', b: 'KeyX', start: 'Enter', c: 'KeyC' };
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
function strip(s) {   // the stored text without its modes (always its last key): the three files and cur, as stored
  const o = JSON.parse(s); if (!o || !o.modes) return s;
  const tail = ',"modes":' + JSON.stringify(o.modes) + '}';
  return s.endsWith(tail) ? s.slice(0, s.length - tail.length) + '}' : 'MODES NOT LAST: ' + s;
}
const near = (a, b) => Math.abs(a - b) < 0.0025;
(async () => {
  const t = await T.start({ name: 'modes part 1' });
  const key = async (n, times) => { const k = times === undefined ? 1 : times; for (let i = 0; i < k; i++) await t.press(K[n]); };
  const ui = () => t.cheat('mode', 'ui'), md = () => t.cheat('mode', 'state'), rec = () => t.cheat('mode', 'rec');
  const store = () => t.eval((k) => localStorage.getItem(k), KEY);
  const until = async (fn, ms) => { const end = Date.now() + (ms || 5000); let v; while (Date.now() < end) { v = await fn(); if (v) return v; await t.wait(100); } return fn(); };
  const at = (scene, ms) => until(async () => { const u = await ui(); return u.scene === scene ? u : null; }, ms);
  const running = (kind, ms) => until(async () => { const m = await md(); return m.on === kind ? m : null; }, ms || 3000);
  async function rise() {   // a jump on the spot by the A key held 0.45 s: how high his feet went, in pixels
    const y0 = (await t.state()).y; let top = y0;
    await t.page.keyboard.down(K.a);
    for (let i = 0; i < 24; i++) { const y = (await t.state()).y; if (y < top) top = y; if (i === 8) await t.page.keyboard.up(K.a); await t.wait(40); }
    await t.page.keyboard.up(K.a); await t.wait(400);
    return Math.round((y0 - top) * 10) / 10;
  }
  await t.wait(2500);

  // ---- three files: FILE 1 played to 1-2, FILE 2 a won copy, FILE 3 a copy with LIGHT WORKLOAD on and FAST text; FILE 3 is the one played ----
  await t.cheat('fresh'); await t.cheat('give', 'all'); await t.cheat('tokens', 120); await t.cheat('warp', 'w1-2'); await t.wait(400); await t.cheat('save');
  const f1 = JSON.parse(await store()).files[0], f2 = JSON.parse(JSON.stringify(f1)), f3 = JSON.parse(JSON.stringify(f1));
  f2.won = true; f2.tokens = 999; f3.tokens = 55; f3.cheats = { light: true }; f3.opt = Object.assign({}, f3.opt || {}, { text: 'fast' });
  await t.cheat('mode', 'go', 'title'); await t.wait(300);
  await t.eval(([k, v]) => localStorage.setItem(k, v), [KEY, JSON.stringify({ files3: 1, cur: 2, files: [f1, f2, f3] })]);
  await t.page.reload(); await t.page.waitForFunction(() => window.NFX && NFX.arcade && NFX.arcade.run && NFX.arcade.run() && NFX.arcade.run().state, null, { timeout: 15000 });
  await t.wait(2200);
  let s = await t.state(), u, m;
  t.ok(s.tokens === 55 && s.screen === 'title', 'three files stored; FILE 3 (55 tokens, LIGHT WORKLOAD) is the one played', { tokens: s.tokens, screen: s.screen });

  // ---- the title to GAME MODES, by keys ----
  for (let i = 0; i < 8; i++) { u = await ui(); if (u.title && u.title.phase === 'menu') break; await key('a'); await t.wait(250); }
  const items = u.title.items, gm = items.indexOf('GAME MODES');
  t.ok(gm >= 0 && !u.title.soon, 'the title\'s menu has GAME MODES (not COMING SOON)', u.title);
  await key('down', (gm - u.title.sel + items.length) % items.length); await key('a');
  u = await at('modes', 2000);
  t.ok(u && u.modes.modes.join() === 'battle,score,speed', 'A on GAME MODES: BATTLE, HIGH SCORE and SPEED RUN, all three live (no COMING SOON)', u && u.modes);
  const S0 = await store();
  console.log('     the files at GAME MODES: sha256 ' + sha(strip(S0)) + ' (' + strip(S0).length + ' bytes; records: ' + (JSON.parse(S0).modes ? 'yes' : 'none') + ')');

  // ---- SPEED RUN, WORLD 1, by keys: the route screen, the run, its pause, the door, splits, the boss, the results ----
  await key('down', 2); u = await ui();
  t.ok(u.modes.id === 'speed', 'DOWN twice: SPEED RUN', u.modes);
  await key('a'); u = await at('srun', 2000);
  t.ok(u && u.srun.row === 'w1', 'A: SPEED RUN\'s route screen, WORLD 1 picked', u && u.srun);
  await key('a'); m = await running('speed'); s = await t.state();
  t.ok(m && m.route === 'w1' && m.i === 0 && s.screen === 'level' && s.level === 'w1-1' && m.sandbox, 'A: the run starts at 1-1, in a save of its own', { m, level: s.level });
  t.ok(s.lv === 1 && s.abilities.length === 0 && s.tokens === 0 && s.hp === s.maxHp, 'a new conductor: LV 1, no moves, no tokens, full hearts (nothing of FILE 3)', s);
  u = await until(async () => { const v = await ui(); return v.toast === 'SPEED RUN: WORLD 1. GO!' ? v : null; }, 1500);
  t.ok(!!u, 'its toast: SPEED RUN: WORLD 1. GO!');
  await t.wait(500);
  const riseRun = await rise();
  await key('start'); u = await at('mpause', 1500);
  const p1 = (await md()).t; await t.wait(800); const p2 = (await md()).t;
  t.ok(u && p1 === p2 && p1 > 0, 'START: the run\'s own pause, and its clock stands still', { p1, p2 });
  await key('start'); await at('level', 1500); const q1 = (await md()).t; await t.wait(500); const q2 = (await md()).t;
  t.ok(q2 > q1, 'START again: back to the run, the clock running', { q1, q2 });
  const x0 = (await t.state()).x;
  await t.page.keyboard.down(K.right); await t.wait(1500); await t.page.keyboard.up(K.right);
  s = await t.state();
  t.ok(s.x > x0 + 40, 'RIGHT held 1.5 s: he runs', { x0, x: s.x });
  const Sx = await store(); await t.cheat('tokens', 50); await t.cheat('save'); await t.wait(200);
  t.ok(await store() === Sx, 'a save asked for in a run writes nothing (the cheat\'s Q.saveGame)');
  t.ok(await t.cheat('mode', 'door'), 'to 1-1\'s door'); await t.wait(250); await key('up');
  m = await until(async () => { const v = await md(); return v.i === 1 ? v : null; }, 4000);
  t.ok(m && m.split.length === 1 && m.split[0] > 0 && m.stage === 'w1-2', 'UP at the door: 1-1 done, its split taken, on to 1-2', m);
  for (let i = 0; i < 2; i++) { await t.wait(300); await t.cheat('mode', 'stage'); }
  m = await md(); s = await t.state();
  t.ok(m.i === 3 && s.level === 'w1-boss' && m.split.length === 3, 'on to 1-BOSS with three splits', { i: m.i, level: s.level, split: m.split });
  await t.wait(600); t.ok(await t.cheat('beatBoss'), 'THE REPLY-ALL HYDRA beaten');
  u = await at('sres', 8000);
  const r1 = u && u.sres, R1 = await rec(), e1 = R1.speed.w1;
  t.ok(r1 && r1.route === 'w1' && r1.first && r1.newBest && r1.split.length === 4 && r1.t === r1.split[3] && r1.medal === 3, 'the results: WORLD 1, FIRST RUN, four splits, GOLD (par 3:25, gold at 2:25)', r1);
  t.ok(e1 && e1.best === r1.t && e1.runs === 1 && e1.split.join() === r1.split.join() && e1.seg.length === 4 && e1.medal === 3, 'its records: the best, its splits, four best segments, the medal, 1 run', e1);
  let S1 = await store();
  t.ok(strip(S1) === strip(S0), 'after the run: the three files byte for byte as at GAME MODES', { at: sha(strip(S0)), now: sha(strip(S1)) });
  t.ok(JSON.stringify(JSON.parse(S1).modes) === JSON.stringify(R1), 'the records stored beside them (bundle.modes)');

  // ---- the results by keys: RECORDS, its tabs, back to the routes ----
  await until(async () => (await ui()).sres.counted, 2000);
  await key('right'); u = await ui(); t.ok(u.sres.sel === 1, 'RIGHT: RECORDS', u.sres);
  await key('a'); u = await at('srec', 1500); t.ok(u && u.srec.route === 'w1', 'A: RECORDS, on WORLD 1\'s tab', u && u.srec);
  await key('right'); u = await ui(); const tab2 = u.srec.route; await key('left'); u = await ui();
  t.ok(tab2 === 'w2' && u.srec.route === 'w1', 'RIGHT and LEFT change the route\'s tab', { tab2, back: u.srec.route });
  await key('b'); u = await at('srun', 1500); t.ok(u && u.srun.row === 'rec', 'B: the route screen, on RECORDS', u && u.srun);

  // ---- a faster run (a new best), then a slower one (not), from the route screen and AGAIN ----
  await key('up', 5); u = await ui(); t.ok(u.srun.row === 'w1', 'UP five times: WORLD 1', u.srun);
  await key('a'); await running('speed');
  for (let i = 0; i < 3; i++) { await t.wait(150); await t.cheat('mode', 'stage'); }
  await t.wait(400); await t.cheat('beatBoss'); u = await at('sres', 8000);
  const r2 = u.sres, e2 = (await rec()).speed.w1, seg2 = r2.split.map((v, i) => v - (i ? r2.split[i - 1] : 0));
  t.ok(!r2.first && r2.newBest && r2.t < e1.best && e2.best === r2.t && e2.split.join() === r2.split.join() && e2.runs === 2, 'a faster run: NEW BEST, the best and its splits replaced, 2 runs', { r2, e2 });
  t.ok(e2.seg.every((v, i) => near(v, Math.min(e1.seg[i], seg2[i]))), 'each best segment is the faster of the two runs\'', { e1: e1.seg, seg2, e2: e2.seg });
  await until(async () => (await ui()).sres.counted, 2000); await key('a');   // AGAIN
  await running('speed');
  for (let i = 0; i < 3; i++) { await t.wait(1300); await t.cheat('mode', 'stage'); }
  await t.wait(400); await t.cheat('beatBoss'); u = await at('sres', 8000);
  const r3 = u.sres, e3 = (await rec()).speed.w1;
  t.ok(!r3.newBest && r3.t > e2.best && e3.best === e2.best && e3.split.join() === e2.split.join() && e3.runs === 3, 'AGAIN, slower: not a best; the best and its splits stay; 3 runs', { r3, e3 });
  S1 = await store(); t.ok(strip(S1) === strip(S0), 'after three runs: the three files byte for byte as at GAME MODES');

  // ---- the pause's RESTART (NO first, then YES) and QUIT: nothing recorded, nothing written ----
  await until(async () => (await ui()).sres.counted, 2000); await key('a');   // AGAIN
  await running('speed'); await t.wait(900);
  await key('start'); await at('mpause', 1500); await key('down'); await key('a'); await key('a');   // RESTART, then NO (the question's first choice)
  m = await md(); u = await ui();
  t.ok(u.scene === 'mpause' && m.t > 0.5, 'RESTART asks first; NO keeps the run as it was', { scene: u.scene, t: m.t });
  await key('a'); await key('right'); await key('a');   // RESTART, YES
  m = await until(async () => { const v = await md(); return v.on === 'speed' && v.t < 0.4 && (await t.state()).screen === 'level' ? v : null; }, 3000);
  t.ok(m && m.i === 0 && m.split.length === 0, 'YES: the run starts again at 1-1, its clock from 0', m);
  await t.wait(500); await key('start'); await at('mpause', 1500); await key('down', 2); await key('a'); await key('right'); await key('a');   // QUIT, YES
  u = await at('modes', 2500); m = await md();
  t.ok(u && m.on === '', 'QUIT, YES: back to GAME MODES, the run gone', { scene: u && u.scene, m });
  const e4 = (await rec()).speed.w1; S1 = await store();
  t.ok(e4.runs === 3 && e4.best === e3.best && strip(S1) === strip(S0) && JSON.stringify(JSON.parse(S1).modes.speed.w1) === JSON.stringify(e3), 'a quit run is not recorded; the files byte for byte as at GAME MODES', e4);
  s = await t.state();
  t.ok(s.tokens === 55 && s.lv === f3.lv && s.abilities.join() === f3.abilities.join(), 'out of the run, the game holds FILE 3 again (55 tokens, its LV and moves)', s);

  // ---- ALL 16: the moves come from the bosses; then each route's starting kit ----
  await key('a'); await at('srun', 1500); await key('down', 4); u = await ui(); t.ok(u.srun.row === 'all', 'DOWN four times: ALL 16', u.srun);
  await key('a'); await running('speed');
  const learned = [];
  for (let i = 0; i < 16; i++) {
    m = await md(); if (m.i !== i) break;
    if (i % 4 === 3) { await t.wait(300); await t.cheat('beatBoss'); await until(async () => (await md()).i !== i || (await ui()).scene === 'sres', 8000); learned.push((await t.state()).abilities.join('+')); }
    else { await t.wait(150); await t.cheat('mode', 'stage'); }
  }
  u = await at('sres', 8000);
  t.ok(u && u.sres.route === 'all' && u.sres.split.length === 16, 'ALL 16 finished: 16 splits', u && u.sres);
  t.ok(learned.slice(0, 3).join(' / ') === 'dash / dash+hover / dash+hover+pound', 'each boss teaches his move, as in the story', learned);
  const kits = {};
  for (const id of ['w2', 'w3', 'w4']) { await t.cheat('mode', 'start', 'speed', id); await t.wait(300); s = await t.state(); kits[id] = 'LV ' + s.lv + ' ' + s.abilities.join('+'); await t.cheat('mode', 'end'); await t.cheat('mode', 'go', 'modes'); }
  t.ok(kits.w2 === 'LV 3 dash' && kits.w3 === 'LV 5 dash+hover' && kits.w4 === 'LV 7 dash+hover+pound', 'WORLD 2 to 4 start where the story has him', kits);
  S1 = await store(); t.ok(strip(S1) === strip(S0), 'at the end: the three files byte for byte as at GAME MODES', { at: sha(strip(S0)), now: sha(strip(S1)) });
  console.log('     records: ' + JSON.stringify((await rec()).speed.w1) + '; jump in the run ' + riseRun + ' px');
  s = await t.state(); t.ok(!s.errors && s.warns === 0, 'the engine logged no errors or warnings', { errors: s.errors, warns: s.warns });
  await t.done();
})().catch((e) => { console.error('modes check crashed:', e); process.exitCode = 2; });
