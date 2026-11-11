// THE COMPASS's checks that need no browser: node tools/compass_logic.js   (BQ_ROOT=DIR for another copy; tools/compass_check.js runs it first)
// Loads the built game (js/game.js) in node as tools/lint.js does, reaching Q through its one 'var Q = {};' line, and checks:
//   1. the words: the first scene on the map (6 lines at most, the Facilitator first, then the Compass saying what it does), the ending's Compass line right
//      after SCOPE CREEP's last ask, the credits line right after THE FACILITATOR; every text at most 130 letters and 3 lines of 46 by Q.wrap, a credits
//      line at most 32, only the font's letters (read from js/runtime.js); its name and its 12 by 12 icon for the text box, as the Facilitator's.
//   2. the COMPASS CHECK's four lines and target for three prepared files (FRESH, MID, DONE), worked out by hand from the save and the levels, then a second
//      check, a level cleared, DRIFTED said once and then YOUR CALL; every ONE THING NEXT the game can give; 3000 random saves: each line fits its room in
//      the panel (35 letters a line, SLIPPED 2 lines, ONE THING NEXT 2 lines of 42), only the font's letters, a target the map has.
//   3. its record: a new game's, and how a level, a secret level and a gold star move it; the drift mark (the corner compass's wobble).
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = process.env.BQ_ROOT ? path.resolve(process.env.BQ_ROOT) : path.join(__dirname, '..');

// ---- the prepared files (also used by tools/compass_check.js): whole saves as the engine writes them (engFresh, 56-engine-flow.js) ----
function base(o) {
  const s = { v: 1, cleared: {}, at: 'map', ck: null, hp: 3, maxHp: 3, power: 1, rhythmMax: 3, lv: 1, xp: 0, tokens: 0, abilities: [], saved: [], memos: {},
    flags: {}, shop: {}, met: {}, seed: 4242, time: 0, falls: 0, won: false, stats: {}, stars: {}, best: {}, encore: 0, cheats: {},
    watch: { run: 777001, split: [0, 0, 0, 0], clear: 0, code: 0 }, opt: {} };
  return Object.assign(s, o || {});
}
function set(list) { const o = {}; list.forEach((k) => { o[k] = true; }); return o; }
const W = [1, 2, 3, 4].map((w) => ['w' + w + '-1', 'w' + w + '-2', 'w' + w + '-3', 'w' + w + '-boss']);
const ALLMEMOS = []; [1, 2, 3, 4].forEach((w) => [1, 2, 3].forEach((l) => ['a', 'b'].forEach((x) => ALLMEMOS.push('m' + w + '-' + l + x))));
const files = {
  // nothing done yet, standing on the map (as after the pause menu's MAP in the first level)
  FRESH: () => base({ time: 95, watch: { run: 777101, split: [0, 0, 0, 0], clear: 0, code: 0 } }),
  // worlds 1 and 2 and 3-1 cleared; a memo left in 1-2, 2-3 and 3-1; the cat found in world 2 only; world 2's secret door found, not world 1's or 3's
  MID: () => base({ cleared: set(W[0].concat(W[1], ['w3-1'])), saved: ['c1', 'c2'], abilities: ['dash', 'hover'], lv: 5, xp: 90, tokens: 64, maxHp: 4, hp: 4, power: 2,
    memos: set(['m1-1a', 'm1-1b', 'm1-2a', 'm1-3a', 'm1-3b', 'm2-1a', 'm2-1b', 'm2-2a', 'm2-2b', 'm2-3a', 'm3-1a']), flags: { cat2: true, 'bonus-w2-bonus': true },
    time: 3125, stars: { onboarded: true, c1: true, c2: true }, watch: { run: 777201, split: [900, 2400, 0, 0], clear: 0, code: 0 } }),
  // world 1 done and 2-1: a memo left in 1-2 and 2-1, world 1's cat, both doors; the next thing low on the map (stop 2), SLIPPED on two lines: the panel docks at the top
  W2: () => base({ cleared: set(W[0].concat(['w2-1'])), saved: ['c1'], abilities: ['dash'], lv: 3, tokens: 30, memos: set(['m1-1a', 'm1-1b', 'm1-2a', 'm1-3a', 'm1-3b', 'm2-1b']),
    time: 1500, stars: { onboarded: true, c1: true }, watch: { run: 777401, split: [900, 0, 0, 0], clear: 0, code: 0 } }),
  // the story done: every level, all three back; a memo in 3-2 and 4-1, the cat in 4-2 and the secret door in 4-1 still to find
  DONE: () => base({ cleared: set([].concat(W[0], W[1], W[2], W[3])), won: true, saved: ['c1', 'c2', 'c3'], abilities: ['dash', 'hover', 'pound'], lv: 9, xp: 300,
    tokens: 210, maxHp: 6, hp: 6, power: 4, memos: set(ALLMEMOS.filter((m) => m !== 'm3-2b' && m !== 'm4-1a')), flags: { cat1: true, cat2: true, cat3: true,
      'bonus-w1-bonus': true, 'bonus-w2-bonus': true, 'bonus-w3-bonus': true }, time: 9300,
    stars: { onboarded: true, c1: true, c2: true, c3: true, shipped: true, 'memos-1': true, 'memos-2': true }, watch: { run: 777301, split: [900, 2400, 4800, 8600], clear: 8600, code: 0 } })
};
// what a COMPASS CHECK on each says the first time (worked out by hand from the save and the level table; the target is a stop on the map)
const EXPECT = {
  FRESH: { moved: 'FIRST CHECK. A CLEAN SLATE.', slipped: 'NOTHING LEFT BEHIND.', drifted: 'FIRST CHECK. MEASURING FROM NOW.', next: '1-1, THE LOBBY OF UNREAD.', at: 1 },
  MID: { moved: 'FIRST CHECK: 9 LEVELS, 11 MEMOS.', slipped: 'MEMOS: 1-2, 2-3, 3-1. THE CAT: 1-3, 3-1. SECRET DOORS: 1-2, 3-1.',
    drifted: 'FIRST CHECK. MEASURING FROM NOW.', next: '3-2, THE WINDY BUCKET.', at: 3 },
  W2: { moved: 'FIRST CHECK: 5 LEVELS, 6 MEMOS.', slipped: 'MEMOS: 1-2, 2-1. THE CAT: 1-3. SECRET DOORS: 1-2, 2-1.', drifted: 'FIRST CHECK. MEASURING FROM NOW.',
    next: '2-2, CABLE CANYON.', at: 2 },
  DONE: { moved: 'FIRST CHECK: 16 LEVELS, 22 MEMOS.', slipped: 'MEMOS: 3-2, 4-1. THE CAT: 4-2. A SECRET DOOR: 4-1.',
    drifted: 'FIRST CHECK. MEASURING FROM NOW.', next: 'THE SECRET DOOR IN 4-1, THE LATER PILE.', at: 4 }
};
const STOPS = { 1: [40, 144], 0: [100, 104], 2: [160, 144], 3: [220, 104], 4: [282, 66], encore: [150, 68], root: [40, 68] };   // 73-ui-map.js's stops
function bundle(save) { return { files3: 1, cur: 0, files: [save, null, null] }; }

// ---- the game in node, and the font's letters ----
function loadGame() {
  const code = fs.readFileSync(path.join(ROOT, 'js', 'game.js'), 'utf8');
  if (code.split('var Q = {};').length !== 2) throw new Error('js/game.js: expected one "var Q = {};"');
  const sb = { NFX: { arcade: { add: () => true } }, Math, JSON };
  vm.runInNewContext(code.replace('var Q = {};', 'var Q = {}; this.__Q = Q;'), sb, { filename: 'game.js', timeout: 10000 });
  return sb.__Q;
}
function fontLetters() {   // the keys of the runtime's GL table (its pixel font), read by evaluating that object literal alone
  const rt = fs.readFileSync(path.join(ROOT, 'js', 'runtime.js'), 'utf8'), a = rt.indexOf('var GL = {'), b = rt.indexOf('};', a), out = {};
  if (a < 0 || b < 0) throw new Error('js/runtime.js: no GL table');
  Object.keys(vm.runInNewContext('(' + rt.slice(a + 'var GL = '.length, b + 1) + ')', {})).forEach((k) => { out[k] = true; });
  return out;
}

function run(opt) {
  opt = opt || {};
  const say = opt.quiet ? () => {} : (s) => console.log(s);
  let pass = 0, fail = 0;
  const ok = (c, what, info) => { if (c) pass++; else fail++; say((c ? 'ok   ' : 'FAIL ') + what + (!c && info !== undefined ? '  ' + JSON.stringify(info).slice(0, 400) : '')); return !!c; };
  const Q = loadGame(), U = Q.ui, CP = U.cp, GL = fontLetters();
  const odd = (s) => String(s).toUpperCase().split('').filter((c) => !GL[c]);
  const box = (s) => String(s).length <= 130 && Q.wrap(s, 46).length <= 3 && !odd(s).length;
  ok(Object.keys(GL).length >= 60 && GL.A && GL[','] && GL['~'], 'the font read from js/runtime.js: ' + Object.keys(GL).length + ' letters');

  // 1. the words
  const meet = Q.SCRIPT['compass-meet'] || [];
  ok(meet.length >= 2 && meet.length <= 6, 'the first scene on the map has ' + meet.length + ' lines (at most 6)');
  ok(meet[0] && meet[0].who === 'facil' && meet.some((l) => l.who === 'compass'), 'the Facilitator opens it and the Compass speaks', meet.map((l) => l.who));
  ok(meet.some((l) => l.who === 'compass' && /PRESS C\b/.test(l.text) && /MOVED/.test(l.text) && /SLIPPED/.test(l.text) && /DRIFTED/.test(l.text) && /ONE THING NEXT/.test(l.text)),
    'the Compass says what it does: C, MOVED, SLIPPED, DRIFTED, ONE THING NEXT');
  meet.forEach((l, i) => ok(box(l.text) && (l.who === 'facil' || l.who === 'compass'), 'compass-meet #' + i + ' ' + l.who + ' fits its box (' + l.text.length + ', ' + Q.wrap(l.text, 46).length + ' lines)', { text: l.text, odd: odd(l.text) }));
  const end = Q.SCRIPT.ending || [], lastCreep = end.map((l) => l.who).lastIndexOf('creep');
  ok(lastCreep >= 0 && end[lastCreep + 1] && end[lastCreep + 1].who === 'compass' && box(end[lastCreep + 1].text), 'the ending: a Compass line right after SCOPE CREEP\'s last ask: ' + (end[lastCreep + 1] && end[lastCreep + 1].text));
  ok(end.filter((l) => l.who === 'compass').length === 1, 'the ending has one Compass line');
  const cr = (Q.SCRIPT.credits || []).map((l) => String(l.text)), ci = cr.indexOf('THE COMPASS, POINTING');
  ok(ci > 0 && cr[ci - 1] === 'THE FACILITATOR, AS A VOICE', 'the credits: THE COMPASS, POINTING right after THE FACILITATOR, AS A VOICE', cr.slice(ci - 1, ci + 1));
  ok(cr.every((t) => t.length <= 32 && !odd(t).length), 'every credits line is at most 32 letters, in the font', cr.filter((t) => t.length > 32 || odd(t).length));
  ok(Q.WHO.compass === 'THE COMPASS' && U.whoName('compass') === 'THE COMPASS', 'Q.WHO.compass is THE COMPASS, the text box\'s name');
  const fc = Q.SPRITE['face-compass'], fa = Q.SPRITE.facil;
  ok(U.whoFace('compass') === 'face-compass' && fc && fc.w === 12 && fc.h === 12 && fa && fa.w === 12 && fa.h === 12, 'its text-box icon face-compass is 12 by 12, as the Facilitator\'s facil', fc && [fc.w, fc.h]);
  ok(Q.SPRITE['compass-body'] && Q.SPRITE['compass-box'] && typeof Q.art.compass === 'function', 'its body (with a needle at any angle) and its box are defined');
  ok(!Q.WARN.some((w) => /compass/i.test(String(w))), 'loading gave no warning about the Compass', Q.WARN);

  // 2. the four lines and the target
  const ROWW = 35, NEXTW = 42;
  function lines(s, r) {
    Q.SAVE = s; if (r !== undefined) s.compass = r;
    const rec = CP.rec(true), f = CP.facts(s), dr = CP.drifted(rec, s, f), nx = CP.next(s);
    return { rec, f, dr, moved: CP.moved(rec, f), slipped: CP.slipped(s), drifted: dr.text, next: nx.text, at: nx.at };
  }
  function seen(rec, x) {   // the record as the check leaves it (73-ui-map-compass-b.js check())
    const f = x.f, s = Q.SAVE; rec.seen = { levels: f.levels, memos: f.memos, cats: f.cats, secrets: f.secrets, stars: f.stars, lv: f.lv, won: f.won, saved: f.saved };
    rec.at = +s.time || 0; if (x.dr.first) { rec.lvN = f.levels; rec.lvAt = rec.at; rec.newN = f.levels + f.secrets + f.stars; rec.newAt = rec.at; } if (x.dr.drift) rec.warned = x.dr.base;
  }
  function fits(x) {
    return Q.wrap(x.moved, ROWW).length === 1 && Q.wrap(x.slipped, ROWW).length <= 2 && Q.wrap(x.drifted, ROWW).length === 1 &&
      Q.wrap('ONE THING NEXT  ' + x.next, NEXTW).length <= 2 && ![x.moved, x.slipped, x.drifted, x.next].some((t) => odd(t).length);
  }
  const atOk = (a) => a === null || a === 'here' || Object.prototype.hasOwnProperty.call(STOPS, a);
  Object.keys(files).forEach((name) => {
    const e = EXPECT[name], x = lines(files[name]());
    ['moved', 'slipped', 'drifted', 'next'].forEach((k) => ok(x[k] === e[k], name + ' ' + k.toUpperCase() + ': ' + x[k], { want: e[k] }));
    ok(x.at === e.at, name + ' ONE THING NEXT points at stop ' + JSON.stringify(x.at), { want: e.at });
    ok(fits(x), name + ': each line fits its room in the panel');
    seen(x.rec, x);
    const y = lines(Q.SAVE);
    ok(y.moved === 'NOTHING SINCE THE LAST CHECK.' && y.drifted === 'NOTHING. GOOD.', name + ', checked again: NOTHING SINCE THE LAST CHECK. / NOTHING. GOOD.', [y.moved, y.drifted]);
  });
  // MID: then 3-2 cleared with one of its memos, 200 seconds on (the level's event moves the record as the game's door does)
  let x = lines(files.MID()); seen(x.rec, x);
  Q.SAVE.cleared['w3-2'] = true; Q.SAVE.memos['m3-2a'] = true; Q.SAVE.time += 200; Q.emit('level', { id: 'w3-2', t: 100, hits: 2, falls: 1 });   // over par, with hits: no star
  ok(Q.SAVE.compass.lvN === 10 && Q.SAVE.compass.lvAt === 3325, 'a level cleared moves the record: 10 levels at 3325 s', Q.SAVE.compass);
  x = lines(Q.SAVE);
  ok(x.moved === 'A LEVEL, A MEMO.' && x.drifted === 'NOTHING. GOOD.' && x.next === '3-3, THE SYNC STORM.' && x.at === 3, 'MID after 3-2: A LEVEL, A MEMO. / NOTHING. GOOD. / 3-3', [x.moved, x.drifted, x.next]);
  // DRIFTED: 725 seconds since the last new level, said once, then YOUR CALL
  const dr0 = { v: 1, met: 1, seen: { levels: 9, memos: 11, cats: 1, secrets: 1, stars: 3, lv: 5, won: 0, saved: 'c1c2' }, lvN: 9, lvAt: 2400, newN: 13, newAt: 2400 };
  x = lines(files.MID(), JSON.parse(JSON.stringify(dr0)));
  ok(x.drifted === '12 MIN, NO NEW LEVEL. SAID ONCE.' && CP.drifting(), 'DRIFTED after 725 s: 12 MIN, NO NEW LEVEL. SAID ONCE. (and the corner compass wobbles)', x.drifted);
  seen(x.rec, x); x = lines(Q.SAVE);
  ok(x.drifted === '12 MIN NOW. YOUR CALL.', 'the next check does not say it again: 12 MIN NOW. YOUR CALL.', x.drifted);
  x = lines(files.DONE(), { v: 1, met: 1, lvN: 16, lvAt: 8600, newN: 23, newAt: 2000 });
  ok(x.drifted === '2 H, NOTHING NEW. SAID ONCE.', 'after the story DRIFTED counts anything new (7300 s): 2 H, NOTHING NEW. SAID ONCE.', x.drifted);
  x = lines(files.MID(), { v: 1, met: 1, lvN: 9, lvAt: 3000, newN: 12, newAt: 3000 });
  ok(x.drifted === 'NOTHING. GOOD.' && !CP.drifting(), 'under ten minutes: NOTHING. GOOD., and the needle stays still', x.drifted);

  // every ONE THING NEXT the game can give: each level and boss in turn, each secret door, THE ROOT FOLDER, each gold star
  const par = U.parLevels(), texts = [];
  ok(par.length === 16, 'the 16 levels with a par, in play order');
  par.forEach((id, i) => { const y = lines(base({ cleared: set(par.slice(0, i)) })); texts.push(y.next); ok(y.at === Math.floor(i / 4) + 1 && fits(y), 'next after ' + i + ' levels: ' + y.next + ' (stop ' + y.at + ')'); });
  const allDone = () => base({ cleared: set(par), won: true, saved: ['c1', 'c2', 'c3'], memos: set(ALLMEMOS), flags: { cat1: true, cat2: true, cat3: true, cat4: true } });
  [1, 2, 3, 4].forEach((w) => { const s = allDone(); [1, 2, 3, 4].forEach((v) => { if (v !== w) s.flags['bonus-w' + v + '-bonus'] = true; });
    const y = lines(s); texts.push(y.next); ok(/^THE SECRET DOOR IN [1-4]-[1-3], /.test(y.next) && y.at === w && fits(y), 'the story done, world ' + w + '\'s door left: ' + y.next); });
  let s = allDone(); [1, 2, 3, 4].forEach((v) => { s.flags['bonus-w' + v + '-bonus'] = true; }); Q.SAVE = s;
  const rootOpen = Q.rootOpen(); x = lines(s);
  ok(rootOpen && x.next === 'THE ROOT FOLDER. IT IS OPEN NOW.' && x.at === 'root', 'every door found: THE ROOT FOLDER, its stop', [rootOpen, x.next, x.at]);
  const ids = U.starIds();
  ids.forEach((k) => {
    if (k === 'all') return;
    const t = JSON.parse(JSON.stringify(s)); ids.forEach((j) => { if (j !== k && j !== 'all') t.stars[j] = true; });
    const y = lines(t), st = U.starText(k);
    if (k === 'root') { ok(y.next === 'THE ROOT FOLDER. IT IS OPEN NOW.' && y.at === 'root', 'root\'s star not won: THE ROOT FOLDER is told (the map shows its stop once it is open)', y.next); return; }
    if (st.secret) { ok(y.next === 'ONE SECRET STAR LEFT. THAT ONE IS YOURS TO FIND.' && y.at === null, 'only the secret star ' + k + ' left: it is not told'); return; }
    texts.push(y.next); ok(y.next.indexOf('GOLD STAR: ') === 0 && atOk(y.at) && fits(y), 'gold star ' + k + ': ' + y.next + ' (' + JSON.stringify(y.at) + ')', { lines: Q.wrap('ONE THING NEXT  ' + y.next, NEXTW) });
  });
  const every = JSON.parse(JSON.stringify(s)); ids.forEach((j) => { every.stars[j] = true; });
  x = lines(every); ok(x.next === 'NOTHING. THAT IS EVERY STAR.' && x.at === null, 'every star won: NOTHING. THAT IS EVERY STAR. (the needle stands up)', x.next);

  // 3000 random saves: nothing throws, every line fits its room, every target is a stop
  let R = 12345; const rnd = () => (R = (R * 16807) % 2147483647) / 2147483647, bad = [];
  for (let n = 0; n < 3000; n++) {
    const k = Math.floor(rnd() * 17), won = k === 16 && rnd() < 0.75, t = base({ cleared: set(par.slice(0, k)), won, time: Math.floor(rnd() * 40000), lv: 1 + Math.floor(rnd() * 10) });
    ALLMEMOS.forEach((m) => { if (rnd() < 0.6) t.memos[m] = true; });
    [1, 2, 3, 4].forEach((w) => { if (rnd() < 0.5) t.flags['cat' + w] = true; if (rnd() < (won ? 0.6 : 0.3)) t.flags['bonus-w' + w + '-bonus'] = true; if (w < 4 && k > w * 4 - 1) t.saved.push('c' + w); });
    ids.forEach((j) => { if (rnd() < (won ? 0.7 : 0.2)) t.stars[j] = true; });
    let r;
    if (rnd() < 0.6) { const at = Math.floor(rnd() * (t.time + 1)); r = { v: 1, met: 1, lvN: Math.floor(rnd() * 17), lvAt: at, newN: Math.floor(rnd() * 50), newAt: at };
      if (rnd() < 0.7) r.seen = { levels: Math.floor(rnd() * 17), memos: Math.floor(rnd() * 25), cats: Math.floor(rnd() * 5), secrets: Math.floor(rnd() * 5), stars: Math.floor(rnd() * 33), lv: 1 + Math.floor(rnd() * 10), won: rnd() < 0.5 ? 1 : 0, saved: rnd() < 0.5 ? 'c1' : '' };
      if (rnd() < 0.3) r.warned = at; }
    try { const y = lines(t, r); if (!fits(y) || !atOk(y.at)) bad.push({ n, moved: y.moved, slipped: y.slipped, drifted: y.drifted, next: y.next, at: y.at }); }
    catch (e) { bad.push({ n, threw: String(e && e.stack || e).split('\n').slice(0, 2).join(' | ') }); }
  }
  ok(bad.length === 0, '3000 random saves: every line fits its room and every target is a stop (' + bad.length + ' bad)', bad.slice(0, 3));

  // 3. the record: a new game's, and the events that move it (in node the runtime is not there: its random numbers stand in for api.rand alone)
  if (!Q.api) Q.api = { rand: () => Math.random };
  Q.newGame();
  ok(Q.SAVE.compass && Q.SAVE.compass.lvN === 0 && Q.SAVE.compass.newN === 0 && !Q.SAVE.compass.met, 'a new game starts the record at nothing, not met yet (its first map visit plays the scene)', Q.SAVE.compass);
  Q.SAVE.time = 50; Q.SAVE.flags['bonus-w1-bonus'] = true; Q.emit('secret', { id: 'w1-bonus' });
  ok(Q.SAVE.compass.newN === 1 && Q.SAVE.compass.newAt === 50 && Q.SAVE.compass.lvN === 0, 'a secret level moves "anything new" only', Q.SAVE.compass);
  Q.SAVE.time = 80; Q.SAVE.stars.onboarded = true; Q.emit('star', { id: 'onboarded' });
  ok(Q.SAVE.compass.newN === 2 && Q.SAVE.compass.newAt === 80, 'a gold star moves it too', Q.SAVE.compass);
  say('compass_logic: ' + pass + ' passed, ' + fail + ' failed');
  return { pass, fail, texts };
}
module.exports = { base, set, files, EXPECT, STOPS, bundle, ALLMEMOS, loadGame, fontLetters, run };
if (require.main === module) { try { process.exitCode = run().fail ? 1 : 0; } catch (e) { console.error('compass_logic crashed:', e); process.exitCode = 2; } }
