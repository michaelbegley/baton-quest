// THE CAT's four lines (B32, version 127): node tools/cat_lines.js [--old=126.js] [--build=FILE]
// Touching an office cat plays cat-N (one for each world). Version 124's GAME MODES turn story talk off (engQuiet), but 53-engine-ents-b.js said cat-N with
// Q.say, so the line showed in a HIGH SCORE or SPEED RUN run; 127 says it through Q.sayStory (55-engine-level.js, as 126 did for SCOPE CREEP's two lines),
// which keeps quiet in a run. This check plays each of the four cats in node with tools/replay.js's harness, three ways: the adventure (a fresh file, every
// move, warped to the cat's level), a SPEED RUN of the cat's world and a HIGH SCORE run (each sent on to the cat's stage by the modes' own check hooks).
// In each it waits for the level to be up with no text box, puts the conductor on the cat's tile (the cheat 'to') and plays 120 frames with no key held.
// It checks: in the adventure the cat's line shows, and every frame is the same in the old build (default: 126's js/game.js from git) as in this one; in
// each run no text box shows. The control: the old build's runs do show the cat's line (so this check can see the fault it guards against).
// The cats' tiles are written here (the levels' '@'); a level that moves its cat fails the adventure's line, and the tile is written again.
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const { copy } = require('./replay.js');
const ROOT = path.join(__dirname, '..');
const CATS = [{ n: 1, level: 'w1-3', tx: 47, ty: 20 }, { n: 2, level: 'w2-2', tx: 128, ty: 1 }, { n: 3, level: 'w3-1', tx: 125, ty: 1 }, { n: 4, level: 'w4-2', tx: 162, ty: 17 }];
function setup(G, how, cat) {   // the level up with no text box (A through any), then onto the cat's tile; returns what was set up, or '' when it could not be
  for (let i = 0; i < 60; i++) G.step([]);
  G.cheat('fresh'); G.cheat('give', 'all');
  if (how === 'adventure') G.cheat('warp', cat.level);
  else {
    const ok = how === 'speed' ? G.cheat('mode', 'start', 'speed', 'w' + cat.n) : G.cheat('mode', 'start', 'score', 'all');
    let m = G.cheat('mode', 'state'), n = 0;
    while (ok && m.on && m.stage !== cat.level && n++ < 20) { G.cheat('mode', 'stage'); m = G.cheat('mode', 'state'); }
    if (!m.on || m.stage !== cat.level) return '';
  }
  let st = null;
  for (let i = 0; i < 1200; i++) { st = JSON.parse(G.step(st && st.talking && i % 2 ? ['a'] : []).st); if (i > 30 && st.screen === 'level' && st.level === cat.level && !st.talking) break; }
  if (!(st.screen === 'level' && st.level === cat.level && !st.talking)) return '';
  G.cheat('to', cat.tx, cat.ty);
  const m = G.cheat('mode', 'state');
  return how === 'adventure' ? 'the adventure, ' + cat.level : how + ' run, stage ' + (m.i + 1) + ' of ' + m.n + ' (' + m.stage + ')';
}
function touch(code, how, cat) {   // { setup, talks: [{ f, id }], states, errors }
  const G = copy(code, 127), out = { talks: [], states: [], errors: G.errors, setup: '' };
  G.open(); out.setup = setup(G, how, cat);
  if (!out.setup) return out;
  for (let f = 0; f < 120; f++) {
    const st = JSON.parse(G.step([]).st);
    out.states.push(JSON.stringify(st));
    if (st.talking) { const look = G.cheat('compass', 'look'), id = look && look.talk ? look.talk.id : '?'; if (!out.talks.length || out.talks[out.talks.length - 1].id !== id) out.talks.push({ f, id }); }
    if (st.errors) out.errors.push('game errors: ' + st.errors);
  }
  return out;
}
function main() {
  const opt = {}; process.argv.slice(2).forEach((a) => { const m = /^--(\w+)=(.*)$/.exec(a); if (m) opt[m[1]] = m[2]; });
  const code = fs.readFileSync(opt.build || path.join(ROOT, 'js', 'game.js'), 'utf8');
  const old = opt.old ? fs.readFileSync(opt.old, 'utf8') : cp.execSync('git show fdbdd4c:js/game.js', { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26 });
  let bad = 0, n = 0; const say = (ok, what) => { n++; if (!ok) bad++; console.log((ok ? 'ok   ' : 'FAIL ') + what); };
  const ids = (r) => r.talks.map((t) => t.id + '@' + t.f).join(' ') || 'none';
  for (const cat of CATS) {
    const line = 'cat-' + cat.n, a = touch(code, 'adventure', cat), a0 = touch(old, 'adventure', cat);
    say(!!a.setup && a.talks.length > 0 && a.talks[0].id === line, line + ', ' + (a.setup || 'NOT SET UP') + ': its line shows as he touches the cat (' + ids(a) + ')');
    let diff = -1; for (let i = 0; i < Math.max(a.states.length, a0.states.length); i++) if (a.states[i] !== a0.states[i]) { diff = i; break; }
    say(!!a.setup && diff < 0, line + ', the adventure: the same state every frame as the old build (' + a.states.length + ' frames' + (diff < 0 ? '' : ', FIRST DIFFERENCE at frame ' + diff) + '; old: ' + ids(a0) + ')');
    for (const how of ['speed', 'score']) {
      const r = touch(code, how, cat), r0 = touch(old, how, cat);
      say(!!r.setup && r.talks.length === 0, line + ', ' + (r.setup || how + ' NOT SET UP') + ': no text box shows (' + ids(r) + ')');
      say(!!r0.setup && r0.talks.some((t) => t.id === line), line + ', ' + how + ' control: the old build shows ' + ids(r0) + ' in the same run');
    }
    say(!a.errors.length && !a0.errors.length, line + ': no game errors' + (a.errors.length ? ' (' + a.errors.slice(0, 2).join(' / ') + ')' : ''));
  }
  console.log('\nRESULT cat_lines: ' + (n - bad) + ' of ' + n + ' as expected');
  process.exitCode = bad ? 1 : 0;
}
if (require.main === module) main();
module.exports = { touch, setup, CATS };
