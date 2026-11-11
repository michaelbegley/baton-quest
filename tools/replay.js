// Baton Quest's replay comparison (B29, version 125): node tools/replay.js OLD.js [NEW.js] [--frames=N] [--only=ID,ID]
// Plays two builds of the game side by side in node, frame by frame, on the same pressed keys, and says the first frame where they differ. Each copy runs
// in its own context with the real runtime (js/runtime.js: its buttons, edges, saves and fonts), a canvas that draws nothing and keeps a hash of every call
// made on it (a canvas drawn into another counts by its own hash, so the order canvases are made in does not matter), a store in memory, and a seeded
// Math.random. Fixed frames of 1/60 s. Compared every frame: the game's state() (99-main.js), and the screen's hash of that frame (except on the title and
// GAME MODES, whose words may change). Played: each level of the adventure from a fresh save with every move and keys from a seeded script, and a
// BATTLE MODE match from the title (the human's keys scripted, three CPUs). Two controls run first: NEW against itself (it must match: the harness is
// steady), and NEW against itself with one key changed (it must differ: the harness can see a difference). NEW defaults to js/game.js.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), RUNTIME = fs.readFileSync(path.join(ROOT, 'js', 'runtime.js'), 'utf8');
const NAMES = ['left', 'right', 'up', 'down', 'a', 'b', 'start', 'c'];
const LEVELS = ['w1-1', 'w1-2', 'w1-3', 'w1-boss', 'w1-bonus', 'w2-1', 'w2-2', 'w2-3', 'w2-boss', 'w2-bonus', 'w3-1', 'w3-2', 'w3-3', 'w3-boss', 'w3-bonus',
  'w4-1', 'w4-2', 'w4-3', 'w4-boss', 'w4-bonus', 'root-1', 'root-2', 'root-3', 'root-4', 'root-5'];
function xorshift(seed) { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function mix(h, s) { for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }
function seedOf(s) { return mix(2166136261, String(s)) || 1; }
const DEF = { fillStyle: '#000000', strokeStyle: '#000000', globalAlpha: 1, globalCompositeOperation: 'source-over', imageSmoothingEnabled: true, font: '10px sans-serif',
  textAlign: 'start', textBaseline: 'alphabetic', lineWidth: 1, filter: 'none', lineCap: 'butt', lineJoin: 'miter', shadowBlur: 0, shadowColor: 'rgba(0, 0, 0, 0)' };

function copy(code, seed) {   // one copy of the game in its own context; returns { step(keys), cheat(name, ...a), state(), open(), errors }
  let ids = 0;
  const errors = [], store = {};
  const doc = { createElement: () => canvas(300, 150) };
  const arg = (v) => (v && typeof v === 'object' ? (v.hash !== undefined ? 'C' + v.hash : v.gid || 'o') : String(v));
  function canvas(w, h) {
    const cv = { width: w, height: h, id: ids++, hash: 2166136261, ownerDocument: doc }, base = Object.assign({ canvas: cv }, DEF), fns = {};
    const ctx = new Proxy(base, {
      get(t, k) {
        if (typeof k === 'symbol' || k in t) return t[k];
        if (fns[k]) return fns[k];
        let f;
        if (k === 'getImageData' || k === 'createImageData') f = (a, b, c, d) => { const W = (k === 'getImageData' ? c : a) | 0, H = (k === 'getImageData' ? d : b) | 0; cv.hash = mix(cv.hash, k + [a, b, c, d].join(',')); return { width: W, height: H, data: new Uint8ClampedArray(Math.max(0, W * H * 4)) }; };
        else if (k === 'measureText') f = (s) => ({ width: String(s).length * 6 });
        else if (k === 'createLinearGradient' || k === 'createRadialGradient' || k === 'createPattern') f = (...a) => { const gr = { gid: 'G' + ids++ }; gr.addColorStop = (o, c) => { cv.hash = mix(cv.hash, gr.gid + 'stop' + o + c); }; cv.hash = mix(cv.hash, k + a.map(arg).join(',')); return gr; };
        else if (k === 'getLineDash') f = () => [];
        else if (k === 'isPointInPath' || k === 'isPointInStroke') f = () => false;
        else f = (...a) => { cv.hash = mix(cv.hash, k + '(' + a.map(arg).join(',')); };
        fns[k] = f; return f;
      },
      set(t, k, v) { t[k] = v; cv.hash = mix(cv.hash, '=' + String(k) + ':' + arg(v)); return true; }
    });
    cv.getContext = () => ctx;
    return cv;
  }
  const screen = canvas(320, 200), M = Object.create(Math);
  M.random = xorshift(seed);
  const sb = { Math: M, JSON, Uint8ClampedArray, setTimeout: (fn) => { try { fn(); } catch (e) { errors.push(String(e && e.stack || e).split('\n').slice(0, 2).join(' | ')); } }, clearTimeout: () => {} };
  sb.__o = { canvas: screen, audio: () => null, keep: (k, v) => { if (v === undefined) return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; store[k] = String(v); return null; }, jot: () => {}, close: () => {} };
  vm.createContext(sb);
  vm.runInContext(RUNTIME + '\nvar NFX = { arcade: makeArcade(__o) };', sb, { filename: 'runtime.js' });
  vm.runInContext(code, sb, { filename: 'game.js' });
  const A = sb.NFX.arcade;
  return {
    errors, store,
    open() { A.open('quest'); },
    run() { return A.run(); },
    step(keys) {   // one frame with these buttons held; its state and the screen's hash of the frame
      for (const n of NAMES) A.setKey(n, keys.indexOf(n) >= 0);
      screen.hash = 2166136261;
      A.frame(1 / 60);
      const r = A.run();
      return { st: r ? JSON.stringify(r.state()) : '', h: screen.hash };
    },
    cheat(name, ...a) { const r = A.run(); return r && r.cheat && r.cheat[name] ? r.cheat[name].apply(null, a) : undefined; }
  };
}
function script(seed, n) {   // n frames of held buttons: chords of 4 to 29 frames, mostly running right and jumping, sometimes the baton, a dash, down, up or a pause
  const r = xorshift(seed), out = []; let hold = [], left = 0;
  for (let f = 0; f < n; f++) {
    if (left <= 0) {
      hold = []; const x = r();
      if (x < 0.68) hold.push('right'); else if (x < 0.82) hold.push('left');
      if (r() < 0.45) hold.push('a');
      if (r() < 0.25) hold.push('b');
      if (r() < 0.1) hold.push('c');
      if (r() < 0.06) hold.push('down');
      if (r() < 0.06) hold.push('up');
      if (r() < 0.02) hold.push('start');
      left = 4 + Math.floor(r() * 26);
    }
    left--; out.push(hold);
  }
  return out;
}
const MENU = [].concat(Array(150).fill([]), [['a']], Array(40).fill([]), [['down']], Array(30).fill([]), [['a']], Array(40).fill([]),   // the boot ends by itself (1.8 s): PRESS START, A: the menu, DOWN: GAME MODES, A
  [['a']], Array(40).fill([]), [['a']], Array(60).fill([]), [['start']], Array(40).fill([]), [['start']], Array(90).fill([]));   // A: BATTLE, A: PLAY HERE, START: the players, START: the arena
function compare(A, B, name, keys, skip) {   // the same keys into both, frame by frame; the first difference, or null
  for (let f = 0; f < keys.length; f++) {
    const kb = typeof skip === 'function' ? skip(f, keys[f]) : keys[f];
    const a = A.step(keys[f]), b = B.step(kb);
    if (a.st !== b.st) return { name, frame: f, what: 'state', a: a.st.slice(0, 500), b: b.st.slice(0, 500) };
    const sc = (JSON.parse(a.st || '{}').screen) || '';
    if (a.h !== b.h && sc !== 'title' && sc !== 'modes') return { name, frame: f, what: 'drawing', screen: sc, a: a.h, b: b.h };
  }
  return null;
}
function segment(oldCode, newCode, name, frames, perturb) {   // a level (or 'battle') in both copies; returns { name, frames, diff, screens, errors }
  const A = copy(oldCode, 125), B = copy(newCode, 125), screens = new Set();
  A.open(); B.open();
  let keys, d = null, n = 0;
  if (name === 'battle') keys = MENU.concat(script(seedOf('battle'), frames));
  else {
    keys = script(seedOf(name), frames);
    const boot = Array(60).fill([]);
    d = compare(A, B, name + ' (boot)', boot); n += boot.length;
    for (const c of [['fresh'], ['give', 'all'], ['warp', name]]) { A.cheat(...c); B.cheat(...c); }
  }
  const tap = perturb ? (f, k) => (f >= perturb && f < perturb + 10 ? (k.indexOf('left') >= 0 ? ['right'] : ['left']) : k) : null;   // 10 frames the other way
  if (!d) {
    for (let f = 0; f < keys.length && !d; f++) {   // one frame at a time, to note the screens seen
      d = compare(A, B, name, [keys[f]], tap ? () => tap(f, keys[f]) : null); n++;
      if (d) d.frame = f;   // the frame in this segment's keys (compare saw one at a time)
      const st = A.run() && A.run().state(); if (st) screens.add(st.screen + (st.level ? ':' + st.level : ''));
    }
  }
  return { name, frames: n, diff: d, screens: Array.from(screens), errors: A.errors.concat(B.errors) };
}

(function main() {
  const args = process.argv.slice(2), opt = {};
  const files = args.filter((a) => !a.startsWith('--'));
  args.filter((a) => a.startsWith('--')).forEach((a) => { const m = a.match(/^--(\w+)=(.*)$/); if (m) opt[m[1]] = m[2]; });
  if (!files[0]) { console.log('usage: node tools/replay.js OLD.js [NEW.js] [--frames=900] [--only=w1-1,battle]'); process.exit(2); }
  const oldCode = fs.readFileSync(files[0], 'utf8'), newCode = fs.readFileSync(files[1] || path.join(ROOT, 'js', 'game.js'), 'utf8');
  const frames = +opt.frames || 900, only = opt.only ? opt.only.split(',') : LEVELS.concat('battle');
  let bad = 0;
  const say = (ok, what) => { if (!ok) bad++; console.log((ok ? 'ok   ' : 'FAIL ') + what); };
  let r = segment(newCode, newCode, 'w1-1', frames);
  say(!r.diff && !r.errors.length, 'control 1: NEW against itself on w1-1, ' + r.frames + ' frames: ' + (r.diff ? 'differs at ' + JSON.stringify(r.diff) : 'the same every frame'));
  const p = Math.floor(frames / 3);
  r = segment(newCode, newCode, 'w1-1', frames, p);
  say(!!r.diff, 'control 2: NEW against itself with 10 frames held the other way from frame ' + p + ': ' + (r.diff ? 'differs at frame ' + r.diff.frame + ' (' + r.diff.what + ')' : 'NOT SEEN'));
  for (const name of only) {
    r = segment(oldCode, newCode, name, name === 'battle' ? Math.max(frames, 2400) : frames);
    const got = name === 'battle' ? r.screens.indexOf('battle') >= 0 : r.screens.some((s) => s.indexOf('level:' + name) === 0);   // it played where it says
    say(!r.diff && !r.errors.length && got, name + ': ' + r.frames + ' frames, ' + (got ? '' : 'NOT PLAYED THERE, ') + (r.diff ? 'DIFFERS: ' + JSON.stringify(r.diff) : 'the same state and drawing every frame') +
      (r.errors.length ? '; errors ' + r.errors.slice(0, 2).join(' / ') : '') + '  [' + r.screens.slice(0, 6).join(' ') + (r.screens.length > 6 ? ' ...' : '') + ']');
  }
  console.log('\nRESULT replay: ' + (only.length + 2 - bad) + ' of ' + (only.length + 2) + ' as expected');
  process.exitCode = bad ? 1 : 0;
})();
