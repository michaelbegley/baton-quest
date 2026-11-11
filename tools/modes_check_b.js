// GAME MODES' check, part 2 (version 125, B29): node tools/modes_check_b.js   (BQ_ROOT=DIR to check another copy of the page)
// HIGH SCORE by the page's keyboard keys (points, the combo and its reset, a stage under par, three tries, the initials by the D-pad keys, the TOP 5),
// the table's order and its five places, the adventure right after a run (its own file, its saves, its stopwatch, LIGHT WORKLOAD, its talk), a reload,
// a backup and a restore (this browser's records stay; a browser with none takes the backup's), BATTLE after a run, and records made odd by hand.
'use strict';
const T = require('./bqtest');
const { sha, strip, kit } = require('./modes_kit');
const XP = { spam: 1, unsub: 2, ooo: 2, flag: 2 };   // world 1's enemies' XP (81-w1-enemies.js): an enemy scores 100 x its XP x the multiplier
(async () => {
  const t = await T.start({ name: 'modes part 2' });
  const h = kit(t);
  await t.wait(2500);
  const F = await h.files3();
  let u = await h.toModes(), s, m, st;
  const S0 = await h.store();
  t.ok(u && u.scene === 'modes', 'FILE 3 played; GAME MODES by keys', u && u.scene);

  // ---- HIGH SCORE by keys: its screen, the run, points, the combo, a hurt, a stage under par, three tries ----
  t.ok(await h.pick('score'), 'DOWN: HIGH SCORE');
  await h.key('a'); u = await h.at('hscore', 1500);
  t.ok(u && u.hscore.row === 'START', 'A: HIGH SCORE\'s screen, START picked', u && u.hscore);
  await h.key('a'); m = await h.running('score'); s = await t.state();
  t.ok(m && m.st.score === 0 && m.st.tries === 3 && m.st.mult === 1 && s.level === 'w1-1' && s.lv === 1 && s.abilities.length === 0, 'A: the run starts at 1-1: a new conductor, 3 tries, no points', { st: m && m.st, lv: s.lv });
  u = await h.until(async () => { const v = await h.ui(); return v.toast === 'HIGH SCORE: THREE TRIES. GO!' ? v : null; }, 1500);
  t.ok(!!u, 'its toast: HIGH SCORE: THREE TRIES. GO!');
  let talked = false; for (let i = 0; i < 6; i++) { if ((await h.ui()).talking) talked = true; await t.wait(150); }
  t.ok(!talked, 'no story talk in a run (1-1\'s first talk does not come)');
  await t.wait(400); const riseRun = await h.rise();
  await h.hold('right', 2000); s = await t.state(); st = (await h.md()).st;
  t.ok(st.parts.token === 10 * s.tokens * 1, 'tokens: 10 points each (' + s.tokens + ' picked up on the way)', { tokens: s.tokens, parts: st.parts });
  let want = st.score, c = 0; const ids = [];   // only the enemies a map places score and add to the combo (a chute's mail does neither)
  for (let k = 1; k <= 5; k++) { const id = await t.cheat('mode', 'hit'); ids.push(id); if (XP[id]) { c++; want += 100 * XP[id] * Math.min(5, 1 + Math.floor(c / 5)); } await t.wait(120); }
  st = (await h.md()).st;
  t.ok(c === 5 && st.score === want && st.combo === 5 && st.mult === 2 && st.kills === 5, 'five enemies with no hurt: 100 x XP each, the fifth at X2 (' + ids.join(' ') + ')', { want, st });
  await t.cheat('mode', 'hurt'); await t.wait(200); const st2 = (await h.md()).st;
  t.ok(st2.combo === 0 && st2.mult === 1 && st2.score === st.score, 'a hurt: the combo and the multiplier back to X1, the points kept', st2);
  const lt = (await t.state()).t; await t.cheat('mode', 'stage'); await t.wait(300); st = (await h.md()).st;
  const tp = Math.floor(45 - lt) * 50;
  t.ok(st.parts.clear === 1000 && Math.abs(st.parts.time - tp) <= 50, '1-1 cleared: 1000, and 50 a second under its par of 45 s (' + st.parts.time + ' for ' + lt + ' s)', st.parts);
  await h.overs(1); st = (await h.md()).st; u = await h.ui();
  t.ok(st.tries === 2 && st.combo === 0 && /2 TRIES LEFT/.test(u.toast), 'a game over spends a try: ' + u.toast, { st, toast: u.toast });
  await h.overs(1); st = (await h.md()).st; u = await h.ui();
  t.ok(st.tries === 1 && /LAST TRY/.test(u.toast), 'another: ' + u.toast, st);
  const score1 = st.score; await h.overs(1);
  u = await h.at('hres', 4000);
  t.ok(u && u.hres.score === score1 && !u.hres.clear && u.hres.at === '1-2', 'the last try spent: GAME OVER, the score, reached 1-2', u && u.hres);
  u = await h.until(async () => { const v = await h.ui(); return v.hres && v.hres.counted ? v : null; }, 2500);
  t.ok(u && u.hres.ph === 'name' && u.hres.rank === 0 && u.hres.name === 'AAA', 'a first score: NEW HIGH SCORE, rank 1, three letters from AAA', u && u.hres);

  // ---- the initials by the D-pad keys: UP and DOWN change a letter, RIGHT and B move, START finishes ----
  await h.key('up'); await h.key('right'); await h.key('up', 2); await h.key('right'); await h.key('down');
  u = await h.ui(); t.ok(u.hres.name === 'BCZ' && u.hres.cur === 2, 'UP, RIGHT, UP UP, RIGHT, DOWN: B C Z', u.hres);
  await h.key('b'); u = await h.ui(); const back = u.hres.cur; await h.key('right');
  await h.key('start'); u = await h.ui(); let R = await h.rec();
  t.ok(back === 1 && u.hres.ph === 'table' && R.score.top[0].n === 'BCZ' && R.score.top[0].s === score1 && R.score.top[0].at === '1-2' && R.score.last === 'BCZ' && R.score.runs === 1,
    'B steps back a letter; START: BCZ into the TOP 5, kept as the next run\'s letters', R.score);
  let S1 = await h.store();
  t.ok(strip(S1) === strip(S0) && JSON.stringify(JSON.parse(S1).modes) === JSON.stringify(R), 'the three files byte for byte as at GAME MODES; the table stored beside them', { at: sha(strip(S0)), now: sha(strip(S1)) });
  await h.key('right'); u = await h.ui(); const sel1 = u.hres.sel; await h.key('left'); await h.key('b'); u = await h.at('hscore', 1500);
  await h.key('down'); await h.key('a'); const top = await h.at('htop', 1500); await h.key('b'); const hs = await h.at('hscore', 1500); await h.key('b'); u = await h.at('modes', 1500);
  t.ok(sel1 === 1 && !!top && hs && hs.hscore.row === 'TOP 5' && !!u, 'RIGHT: GAME MODES; B: HIGH SCORE; TOP 5 and back; B: GAME MODES', { sel1, top: !!top, back: hs && hs.hscore });

  // ---- the table: no points, no place; equal scores go under; five places ----
  async function scoreRun(hits, ups) {   // a run with this many hits at 1-1, then three game overs; its letters BCZ with the first moved up ups times
    await t.cheat('mode', 'start', 'score', 'all'); await t.wait(300);
    for (let k = 0; k < hits; k++) { await t.cheat('mode', 'hit'); await t.wait(80); }
    await h.overs(3); await h.at('hres', 4000);
    const v = await h.until(async () => { const x = await h.ui(); return x.hres && x.hres.counted ? x : null; }, 2500);
    if (v.hres.ph === 'name') { await h.key('up', ups); await h.key('start'); }
    const r = (await h.ui()).hres; await t.cheat('mode', 'go', 'modes'); await t.wait(200); return r;
  }
  let r = await scoreRun(0, 0);
  t.ok(r.score === 0 && r.rank === -1 && (await h.rec()).score.top.length === 1, 'a run with no points: no place in the table', r);
  const names = [];
  for (let k = 1; k <= 4; k++) { r = await scoreRun(1, k); names.push(r.name); }
  R = await h.rec();
  t.ok(R.score.top.map((e) => e.n).join() === 'BCZ,' + names.join() && R.score.top.length === 5, 'four runs with the same points: each under the ones before it (' + names.join(' ') + ')', R.score.top);
  r = await scoreRun(1, 9); R = await h.rec();
  t.ok(r.rank === -1 && R.score.top.map((e) => e.n).join() === 'BCZ,' + names.join(), 'a fifth equal score: the table is full, it goes under, no place', { r, top: R.score.top });
  r = await scoreRun(3, 0); R = await h.rec();
  t.ok(r.rank === 1 && R.score.top.length === 5 && R.score.top[1].s === r.score && R.score.top[4].n === names[2], 'a better one: second place, the last one drops off', R.score.top);
  t.ok(R.score.runs === 8, 'eight runs counted', R.score.runs);
  await t.cheat('mode', 'start', 'score', 'all'); await t.wait(300);   // ALL CLEAR: every stage cleared, each boss beaten, no try spent
  for (let i = 0; i < 16; i++) {
    m = await h.md(); if (m.on !== 'score') break;
    if (/boss$/.test(m.stage)) { await t.wait(300); await t.cheat('beatBoss'); await h.until(async () => { const v = await h.md(); return v.on !== 'score' || v.i !== m.i; }, 8000); }
    else { await t.wait(150); await t.cheat('mode', 'stage'); }
  }
  u = await h.at('hres', 8000); await h.until(async () => { const v = await h.ui(); return v.hres && v.hres.counted ? v : null; }, 2500);
  st = (await h.ui()).hres; await h.key('start'); R = await h.rec(); m = R.score.top[0];
  t.ok(st.clear && st.at === 'CLEAR' && st.rank === 0 && m.clear === 1 && m.at === 'CLEAR' && m.s === st.score, 'ALL CLEAR!: all 16 cleared, first place, CLEAR in the table', { st, top: m });
  t.ok(st.parts.tries === 30000 && st.parts.boss === 118000 && st.parts.clear === 16000 && st.parts.time > 0, 'its parts: 10000 for each of 3 tries left, the four bosses at 1000 x XP (10, 23, 35, 50: 118000), 1000 for each of 16 stages, time under par', st.parts);
  await t.cheat('mode', 'go', 'modes'); await t.wait(200);

  // ---- the adventure right after a run: FILE 3 again, its stopwatch, LIGHT WORKLOAD, its saves; then a run's records never move ----
  await h.key('b'); await h.menu(); u = await h.ui();
  await h.key('up', u.title.sel); await h.key('a');   // CONTINUE (the menu's first)
  s = await h.until(async () => { const v = await t.state(); return v.screen === 'level' ? v : null; }, 3000);
  t.ok(s && s.level === F.f3.at && s.tokens === 55 && (await h.md()).on === '', 'CONTINUE: FILE 3 where it was (' + F.f3.at + ', 55 tokens)', s && { level: s.level, tokens: s.tokens });
  const w0 = (await t.state()).time; await t.wait(1500); const w1 = (await t.state()).time;
  t.ok(w1 > w0, 'its stopwatch runs again (' + w0 + ' to ' + w1 + ' s)', { w0, w1 });
  await t.cheat('warp', 'w1-1');
  u = await h.until(async () => { const v = await h.ui(); return v.talking ? v : null; }, 2000);
  t.ok(!!u, 'its story talk is back: 1-1\'s first talk comes in FILE 3 (in the run it did not)');
  for (let i = 0; i < 40 && (await h.ui()).talking; i++) await h.key('a');
  await t.wait(600); const riseLight = await h.rise();
  t.ok(riseLight > riseRun * 1.3, 'LIGHT WORKLOAD is back in FILE 3: a jump of ' + riseLight + ' px, against ' + riseRun + ' px in the run', { riseLight, riseRun });
  const Rk = JSON.stringify(await h.rec()); await t.cheat('tokens', 7); await t.cheat('save'); await t.wait(200); S1 = await h.store();
  const B1 = JSON.parse(S1), B0 = JSON.parse(S0);
  t.ok(B1.files[2].tokens === 62 && JSON.stringify(B1.files[0]) === JSON.stringify(B0.files[0]) && JSON.stringify(B1.files[1]) === JSON.stringify(B0.files[1]) && JSON.stringify(B1.modes) === Rk,
    'a save in the adventure writes FILE 3 (62 tokens); FILES 1 and 2 as they were; the records kept', { t3: B1.files[2].tokens });

  // ---- a reload: the records come back as they were, and nothing is written as the game opens ----
  await t.cheat('mode', 'go', 'title'); await t.wait(300); const Sr = await h.store();
  await h.reload(); R = await h.rec();
  t.ok(JSON.stringify(R) === Rk && await h.store() === Sr, 'after a reload: the records as they were; nothing written as it opens', R);

  // ---- a backup, then a restore: the files are the backup's, this browser's records stay; a browser with no records takes the backup's ----
  const code0 = await t.eval(() => window.BQ_SAVES.code());
  await h.toModes(); await h.quickSpeed('w2', 150); const R1 = JSON.stringify(await h.rec());
  await t.cheat('mode', 'go', 'title'); await t.cheat('tokens', 5); await t.cheat('save'); await t.wait(200);
  t.ok(JSON.parse(await h.store()).files[2].tokens === 67 && R1 !== Rk, 'after the backup: a SPEED RUN on WORLD 2 recorded, FILE 3 saved with 67 tokens');
  t.ok(await t.eval((c) => window.BQ_SAVES.offer(c), code0), 'the backup offered for a restore');
  const said = await t.eval(() => window.BQ_SAVES.restore()); await t.page.waitForFunction(() => NFX.arcade.run() && NFX.arcade.run().state, null, { timeout: 15000 }); await t.wait(2200);
  const Sb = await t.eval((c) => decodeURIComponent(escape(atob(c.slice(4)))), code0), Sn = await h.store();
  t.ok(/^RESTORED/.test(said) && strip(Sn) === strip(Sb) && JSON.parse(Sn).files[2].tokens === 62, 'RESTORED: the three files are the backup\'s, byte for byte (FILE 3: 62 tokens)', { said });
  t.ok(JSON.stringify(await h.rec()) === R1 && JSON.stringify(JSON.parse(Sn).modes) === R1, 'this browser\'s records stay as they were (the WORLD 2 run kept)');
  await h.put(strip(Sn)); await h.reload();
  const none = await h.rec();
  t.ok(!none.score.top.length && !Object.keys(none.speed).length, 'a browser with no records: empty tables');
  await t.eval((c) => window.BQ_SAVES.offer(c), code0); await t.eval(() => window.BQ_SAVES.restore()); await t.wait(2400);
  t.ok(JSON.stringify(await h.rec()) === Rk, 'a restore there brings the backup\'s records with it');

  // ---- BATTLE after a run ----
  await h.toModes(); await h.quickSpeed('w1', 150); await t.cheat('mode', 'go', 'modes'); await t.wait(200);
  for (let i = 0; i < 3; i++) { if ((await h.ui()).modes.id === 'battle') break; await h.key('up'); }
  await h.key('a'); await h.at('bsplash', 1500); await h.key('a');
  for (let i = 0; i < 6; i++) { u = await h.ui(); if (u.scene === 'battle') break; await h.key('start'); await t.wait(400); }
  await t.wait(3000); u = await h.ui(); s = await t.state();
  t.ok(u.scene === 'battle' && !!u.fight && !s.errors, 'BATTLE after a run: the players, the arena, a fight going', { scene: u.scene, fight: u.fight });

  // ---- records made odd by hand: read without a crash, the odd parts dropped, never guessed ----
  await t.cheat('mode', 'go', 'title'); await t.wait(300);
  const B = JSON.parse(await h.store()); B.modes = { v: 7, speed: { w1: { best: 'x', split: [1, 'a'], seg: null, medal: 9, runs: -3 }, w9: 5 }, score: { top: [{ n: 'toolong', s: 5 }, { n: 'ABC', s: -1 }, 7], last: 'zz', runs: 'q' }, extra: { keep: 1 } };
  await h.put(JSON.stringify(B)); await h.reload(); R = await h.rec();
  t.ok(R.speed.w1.best === 0 && R.speed.w1.split.join() === '1,0' && R.speed.w1.medal === 0 && R.speed.w1.runs === 0 && !R.speed.w9 && R.score.top.length === 1 && R.score.top[0].n === 'AAA' && R.extra.keep === 1,
    'odd records: the odd values dropped (no medal from a 9), a key it does not know kept', R);
  await h.toModes(); await h.pick('speed'); await h.key('a'); await h.at('srun', 1500); await h.key('up'); await h.key('a'); await h.at('srec', 1500);
  for (let i = 0; i < 5; i++) { await h.key('right'); await t.wait(100); }
  await h.key('b'); await h.key('b'); await h.pick('score'); await h.key('a'); await h.at('hscore', 1500); await h.key('down'); await h.key('a'); await h.at('htop', 1500); await t.wait(300);
  s = await t.state(); t.ok(!s.errors && s.warns === 0, 'every screen drawn with them: no errors, no warnings', { errors: s.errors, warns: s.warns });
  await t.done();
})().catch((e) => { console.error('modes check part 2 crashed:', e); process.exitCode = 2; });
