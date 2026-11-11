// SCOPE CREEP's two phase lines (B31, version 126): node tools/creep_lines.js [--old=125.js] [--build=FILE] [--keys=FILE]
// SCOPE CREEP says 'w4-phase2' (it calls a meeting) at two thirds of its health and 'w4-phase3' (the agents join in) at one third. Version 124's GAME
// MODES turn story talk off (engQuiet), but 84-w4-boss.js said these two with Q.say, so they showed in a HIGH SCORE or SPEED RUN run; 126 says them
// through Q.sayStory (55-engine-level.js), which keeps quiet in a run. This check plays the fight in node with tools/replay.js's harness, three ways:
//   the adventure (a fresh file, every move, LV 10, warped to THE ROOT TICKET), a SPEED RUN of WORLD 4 and a HIGH SCORE run (each sent on to its SCOPE
//   CREEP stage by the modes' own check hooks, then LV 10), each with god mode on, then the keys in tools/creep_lines-keys.txt (B31's route maker drove
//   the fight on these same set-ups and recorded what it pressed: swings at the eyes on the floor, then at the root ticket while it is paused; A
//   through any text box), until a little after the fight passes one third of SCOPE CREEP's health (both phase changes done).
// It checks: in the adventure both lines show (the text box's script, read through the Compass cheat's look at the text box), and the whole fight is
// the same, frame by frame, in the old build (default: 125's js/game.js from git) as in this one; in each run no text box ever shows. The control:
// the old build's runs do show a line (so this check can see the fault it guards against).
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const { copy } = require('./replay.js');
const ROOT = path.join(__dirname, '..');
const KEYS = ['left', 'right', 'up', 'down', 'a', 'b', 'start', 'c'], CH = 'lrudabsc';
function recorded(file) {   // { adventure: [[held]...], speed: [...], score: [...] }
  const out = {}; let cur = null;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = /^== (\S+)/.exec(line);
    if (m) { cur = out[m[1]] = []; continue; }
    if (!cur || line[0] === '#') continue;
    for (const tok of line.trim().split(/\s+/)) { if (!tok) continue; const t = /^([lrudabsc_]+)(\d+)$/.exec(tok); const k = t[1] === '_' ? [] : t[1].split('').map((c) => KEYS[CH.indexOf(c)]); for (let i = 0; i < +t[2]; i++) cur.push(k); }
  }
  return out;
}
function setup(G, how) {   // the route maker recorded the keys after exactly this
  for (let i = 0; i < 60; i++) G.step([]);
  G.cheat('fresh'); G.cheat('give', 'all');
  if (how === 'adventure') { G.cheat('xp', 400); G.cheat('warp', 'w4-boss'); return 'warp w4-boss'; }
  const ok = how === 'speed' ? G.cheat('mode', 'start', 'speed', 'w4') : G.cheat('mode', 'start', 'score', 'all');
  let m = G.cheat('mode', 'state'), n = 0;
  while (ok && m.on && m.stage !== 'w4-boss' && n++ < 20) { G.cheat('mode', 'stage'); m = G.cheat('mode', 'state'); }
  G.cheat('xp', 400);
  return how + ' run, stage ' + (m.i + 1) + ' of ' + m.n + ' (' + m.stage + ')';
}
function fight(code, how, keys) {   // { phase2, phase3, talks: [{ f, id }], frames, states, errors, setup, last }
  const G = copy(code, 126), out = { phase2: -1, phase3: -1, talks: [], frames: 0, states: [], errors: G.errors, setup: '' };
  G.open(); out.setup = setup(G, how); G.cheat('god', true);
  let st = null;
  for (let f = 0; f < keys.length; f++) {
    st = JSON.parse(G.step(keys[f]).st);
    out.states.push(JSON.stringify(st));
    if (st.talking) { const look = G.cheat('compass', 'look'), id = look && look.talk ? look.talk.id : '?'; if (!out.talks.length || out.talks[out.talks.length - 1].id !== id) out.talks.push({ f, id }); }
    const b = st.boss;
    if (b && b.id === 'creep') { if (out.phase2 < 0 && b.hp <= b.maxHp * 2 / 3) out.phase2 = f; if (out.phase3 < 0 && b.hp <= b.maxHp / 3) out.phase3 = f; }
    out.frames = f + 1;
  }
  out.last = st || {};
  return out;
}
function main() {
  const opt = {}; process.argv.slice(2).forEach((a) => { const m = /^--(\w+)=(.*)$/.exec(a); if (m) opt[m[1]] = m[2]; });
  const code = fs.readFileSync(opt.build || path.join(ROOT, 'js', 'game.js'), 'utf8');
  const old = opt.old ? fs.readFileSync(opt.old, 'utf8') : cp.execSync('git show cf90e0d:js/game.js', { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26 });
  let bad = 0, n = 0; const say = (ok, what) => { n++; if (!ok) bad++; console.log((ok ? 'ok   ' : 'FAIL ') + what); };
  const K = recorded(opt.keys || path.join(__dirname, 'creep_lines-keys.txt')), ids = (r) => r.talks.map((t) => t.id + '@' + t.f).join(' ') || 'none';
  // the adventure: both lines, and the same fight as before
  const a = fight(code, 'adventure', K.adventure), a0 = fight(old, 'adventure', K.adventure);
  say(a.phase2 >= 0 && a.phase3 >= 0, 'adventure: SCOPE CREEP passes two thirds (frame ' + a.phase2 + ') and one third (frame ' + a.phase3 + ') of its health');
  const t2 = a.talks.find((t) => t.id === 'w4-phase2'), t3 = a.talks.find((t) => t.id === 'w4-phase3');
  say(!!t2 && t2.f - a.phase2 >= 0 && t2.f - a.phase2 <= 3, 'adventure: its w4-phase2 line shows as it passes two thirds (' + (t2 ? 'frame ' + t2.f : 'NOT SEEN') + ')');
  say(!!t3 && t3.f - a.phase3 >= 0 && t3.f - a.phase3 <= 3, 'adventure: its w4-phase3 line shows as it passes one third (' + (t3 ? 'frame ' + t3.f : 'NOT SEEN') + ')');
  let diff = -1; for (let i = 0; i < Math.max(a.states.length, a0.states.length); i++) if (a.states[i] !== a0.states[i]) { diff = i; break; }
  say(diff < 0, 'adventure: the same state every frame as the old build (' + a.states.length + ' frames' + (diff < 0 ? '' : ', FIRST DIFFERENCE at frame ' + diff) + '); its text boxes: ' + ids(a) + ' (old: ' + ids(a0) + ')');
  say(!a.errors.length && !a.last.errors, 'adventure: no game errors');
  // the runs: no text box at all, though both phase changes happened
  for (const how of ['speed', 'score']) {
    const r = fight(code, how, K[how]), r0 = fight(old, how, K[how]);
    say(r.phase2 >= 0 && r.phase3 >= 0, how + ': ' + r.setup + '; SCOPE CREEP passes two thirds (frame ' + r.phase2 + ') and one third (frame ' + r.phase3 + ')');
    say(r.talks.length === 0, how + ': no text box shows in the whole fight (' + ids(r) + ')');
    say(r0.talks.some((t) => /^w4-phase[23]$/.test(t.id)), how + ' control: the old build shows ' + ids(r0) + ' in the same run');
    say(!r.errors.length && !r.last.errors, how + ': no game errors');
  }
  console.log('\nRESULT creep_lines: ' + (n - bad) + ' of ' + n + ' as expected');
  process.exitCode = bad ? 1 : 0;
}
if (require.main === module) main();
module.exports = { fight, setup, recorded };
