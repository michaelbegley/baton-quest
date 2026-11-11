// Helpers for the GAME MODES checks and pictures (version 125, B29): the page's keys, reads of the game's screens, the stored bundle without its records,
// three files to play with, and the way from the title to GAME MODES. Used by modes_check_b.js, modes_ways.js and modes_pics.js (modes_check.js has its own).
'use strict';
const crypto = require('crypto');
const KEY = 'nf-arcade-quest';
const K = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'KeyZ', b: 'KeyX', start: 'Enter', c: 'KeyC' };
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
function strip(s) {   // the stored text without its modes (always its last key): the three files and cur, as stored
  const o = JSON.parse(s); if (!o || !o.modes) return s;
  const tail = ',"modes":' + JSON.stringify(o.modes) + '}';
  return s.endsWith(tail) ? s.slice(0, s.length - tail.length) + '}' : 'MODES NOT LAST: ' + s;
}
function kit(t) {   // the helpers, bound to one bqtest session t
  const h = {};
  h.key = async (n, times) => { const k = times === undefined ? 1 : times; for (let i = 0; i < k; i++) await t.press(K[n]); };
  h.hold = async (n, ms) => { await t.page.keyboard.down(K[n]); await t.wait(ms); await t.page.keyboard.up(K[n]); await t.wait(120); };
  h.ui = () => t.cheat('mode', 'ui'); h.md = () => t.cheat('mode', 'state'); h.rec = () => t.cheat('mode', 'rec');
  h.store = () => t.eval((k) => localStorage.getItem(k), KEY);
  h.put = (text) => t.eval(([k, v]) => localStorage.setItem(k, v), [KEY, text]);
  h.until = async (fn, ms) => { const end = Date.now() + (ms || 5000); let v; while (Date.now() < end) { v = await fn(); if (v) return v; await t.wait(100); } return fn(); };
  h.at = (scene, ms) => h.until(async () => { const u = await h.ui(); return u.scene === scene ? u : null; }, ms);
  h.running = (kind, ms) => h.until(async () => { const m = await h.md(); return m.on === kind ? m : null; }, ms || 3000);
  h.reload = async (path) => {   // the page again (or another path on the same server: the same storage), the game up, its title in
    if (path) await t.page.goto(t.base + path); else await t.page.reload();
    await t.page.waitForFunction(() => window.NFX && NFX.arcade && NFX.arcade.run && NFX.arcade.run() && NFX.arcade.run().state, null, { timeout: 15000 });
    await t.wait(2200);
  };
  h.rise = async () => {   // a jump on the spot by the A key held 0.45 s: how high his feet went, in pixels
    const y0 = (await t.state()).y; let top = y0;
    await t.page.keyboard.down(K.a);
    for (let i = 0; i < 24; i++) { const y = (await t.state()).y; if (y < top) top = y; if (i === 8) await t.page.keyboard.up(K.a); await t.wait(40); }
    await t.page.keyboard.up(K.a); await t.wait(400);
    return Math.round((y0 - top) * 10) / 10;
  };
  h.files3 = async () => {   // FILE 1 played to 1-2 (every move, 120 tokens), FILE 2 a won copy, FILE 3 a copy with LIGHT WORKLOAD on and FAST text; FILE 3 is played
    await t.cheat('fresh'); await t.cheat('give', 'all'); await t.cheat('tokens', 120); await t.cheat('warp', 'w1-2'); await t.wait(400); await t.cheat('save');
    const f1 = JSON.parse(await h.store()).files[0], f2 = JSON.parse(JSON.stringify(f1)), f3 = JSON.parse(JSON.stringify(f1));
    f2.won = true; f2.tokens = 999; f3.tokens = 55; f3.cheats = { light: true }; f3.opt = Object.assign({}, f3.opt || {}, { text: 'fast' });
    await t.cheat('mode', 'go', 'title'); await t.wait(300);   // the title writes nothing
    await h.put(JSON.stringify({ files3: 1, cur: 2, files: [f1, f2, f3] }));
    await h.reload();
    return { f1, f2, f3 };
  };
  h.menu = async () => {   // the title's main menu (past the boot and PRESS START), by A
    let u;
    for (let i = 0; i < 8; i++) { u = await h.ui(); if (u.scene === 'title' && u.title && u.title.phase === 'menu') return u; await h.key('a'); await t.wait(250); }
    return h.ui();
  };
  h.toModes = async () => {   // from the title's menu to GAME MODES, by DOWN and A
    const u = await h.menu(), items = u.title.items, gm = items.indexOf('GAME MODES');
    await h.key('down', (gm - u.title.sel + items.length) % items.length); await h.key('a');
    return h.at('modes', 2000);
  };
  h.pick = async (id) => {   // on GAME MODES, DOWN until a mode is picked (BATTLE, HIGH SCORE, SPEED RUN: battle, score, speed)
    for (let i = 0; i < 4; i++) { const u = await h.ui(); if (u.modes && u.modes.id === id) return true; await h.key('down'); }
    return false;
  };
  h.quickSpeed = async (route, gap) => {   // a SPEED RUN by the cheats: each stage done after gap ms, each boss beaten; ends on its results
    await t.cheat('mode', 'start', 'speed', route); await t.wait(300);
    for (let i = 0; i < 16; i++) {
      const m = await h.md(); if (m.on !== 'speed') break;
      if (/boss$/.test(m.stage)) { await t.wait(gap); await t.cheat('beatBoss'); await h.until(async () => { const v = await h.md(); return v.on !== 'speed' || v.i !== m.i; }, 8000); }
      else { await t.wait(gap); await t.cheat('mode', 'stage'); }
    }
    return h.at('sres', 8000);
  };
  h.overs = async (n) => { for (let i = 0; i < n; i++) { await t.cheat('kill'); await t.wait(1700); } };   // n game overs (each spends a try)
  return h;
}
module.exports = { KEY, K, sha, strip, kit };
