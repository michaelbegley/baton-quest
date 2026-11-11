// GAME MODES' ways in (version 125, B29): node tools/modes_ways.js   (BQ_ROOT=DIR to check another copy of the page)
// The two other ways in, each in its own fresh browser: a controller (the Gamepad API, a test pad as tools/phone_check.js makes it: A 0, B 1, START 9,
// the D-pad 12 to 15) on a computer, and the phone's own buttons and D-pad (touches, at 390 by 844). Each drives both modes from the title: a run
// started, played, paused, quit or finished, the results, RECORDS, the initials and the TOP 5, and the three files byte for byte afterwards.
'use strict';
const T = require('./bqtest');
const { strip, kit } = require('./modes_kit');
const PAD = () => { window.__pad = { connected: true, id: 'test pad', index: 0, mapping: 'standard', axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) };
  navigator.getGamepads = () => (window.__pad.connected ? [window.__pad] : [null]); };
const BTN = { a: 0, b: 1, start: 9, up: 12, down: 13, left: 14, right: 15 };

async function drive(t, h, press, hold, way) {   // the same walk for each way in; press(name) taps a button, hold(name, ms) holds one
  let u, m, s;
  for (let i = 0; i < 8; i++) { u = await h.ui(); if (u.title && u.title.phase === 'menu') break; await press('a'); await t.wait(200); }
  const items = u.title.items, gm = items.indexOf('GAME MODES');
  for (let i = 0; i < (gm - u.title.sel + items.length) % items.length; i++) await press('down');
  await press('a'); u = await h.at('modes', 2000);
  t.ok(u && u.scene === 'modes', way + ': the title to GAME MODES');
  const S0 = await h.store();
  await press('down'); u = await h.ui(); t.ok(u.modes.id === 'score', way + ': DOWN, HIGH SCORE', u.modes);
  await press('a'); await h.at('hscore', 1500); await press('a'); m = await h.running('score');
  t.ok(!!m, way + ': A, A: a HIGH SCORE run');
  const x0 = (await t.state()).x; await hold('right', 1000); s = await t.state();
  t.ok(s.x > x0 + 20, way + ': RIGHT held: he runs', { x0, x: s.x });
  await press('start'); u = await h.at('mpause', 1500); t.ok(!!u, way + ': START: the run\'s pause');
  await press('down'); await press('down'); await press('a'); await press('right'); await press('a');
  u = await h.at('modes', 2500); t.ok(u && (await h.md()).on === '', way + ': QUIT, YES: GAME MODES, nothing kept', u && u.scene);
  await press('down'); await press('a'); await h.at('srun', 1500); await press('a'); m = await h.running('speed');
  t.ok(!!m && m.route === 'w1', way + ': DOWN, A, A: SPEED RUN on WORLD 1');
  await press('start'); await h.at('mpause', 1500); await press('b'); u = await h.at('level', 1500);
  t.ok(!!u, way + ': START, then B: back to the run');
  for (let i = 0; i < 3; i++) { await t.wait(200); await t.cheat('mode', 'stage'); }
  await t.wait(400); await t.cheat('beatBoss'); u = await h.at('sres', 8000);
  await h.until(async () => (await h.ui()).sres.counted, 2000);
  await press('right'); await press('a'); u = await h.at('srec', 1500); await press('right'); const tab = (await h.ui()).srec.route;
  await press('b'); await press('b'); u = await h.at('modes', 1500);
  t.ok(tab === 'w2' && !!u, way + ': the results, RECORDS, its next tab, back to GAME MODES', { tab });
  await t.cheat('mode', 'start', 'score', 'all'); await t.wait(300); await t.cheat('mode', 'hit'); await h.overs(3); await h.at('hres', 4000);
  await h.until(async () => { const v = await h.ui(); return v.hres && v.hres.counted ? v : null; }, 2500);
  await press('up'); await press('right'); await press('up'); await press('up'); await press('start');
  u = await h.ui(); const R = await h.rec();
  t.ok(u.hres.ph === 'table' && R.score.top[0].n === 'BCA', way + ': the initials B C A by UP, RIGHT, UP UP, START; the TOP 5', R.score.top);
  await press('right'); await press('a'); u = await h.at('modes', 1500);
  const S1 = await h.store(); s = await t.state();
  t.ok(!!u, way + ': AGAIN or GAME MODES: RIGHT, A: back on GAME MODES', u && u.scene);
  if (S0 === null) t.ok(strip(S1) === '{"files3":1,"cur":0,"files":[null,null,null]}', way + ': a new browser (nothing stored before): the records stored beside three empty files, none made', strip(S1));
  else t.ok(strip(S1) === strip(S0), way + ': the three files byte for byte as at GAME MODES');
  t.ok(!s.errors && s.warns === 0, way + ': no errors, no warnings', { errors: s.errors, warns: s.warns });
}

(async () => {
  // ---- a controller on a computer ----
  let t = await T.start({ name: 'modes ways: controller', init: PAD });
  let h = kit(t);
  await t.wait(2500);
  const pad = async (n, ms) => { await t.eval((b) => { window.__pad.buttons[b].pressed = true; window.__pad.buttons[b].value = 1; }, BTN[n]); await t.wait(ms || 140);
    await t.eval((b) => { window.__pad.buttons[b].pressed = false; window.__pad.buttons[b].value = 0; }, BTN[n]); await t.wait(220); };
  await drive(t, h, (n) => pad(n), (n, ms) => pad(n, ms), 'controller');
  const f1 = await t.done();

  // ---- the phone: its touch buttons and its D-pad, at 390 by 844 ----
  t = await T.start({ name: 'modes ways: phone', context: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true } });
  h = kit(t);
  await t.wait(2500);
  const cdp = await t.page.context().newCDPSession(t.page);
  const spot = async (n) => {   // where to touch for a button: a face button's middle, or the D-pad's arm
    if (!/^(up|down|left|right)$/.test(n)) { const b = await t.page.locator('#pocket [data-k="' + n + '"]').boundingBox(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }
    const d = await t.page.locator('#dpad').boundingBox(), cx = d.x + d.width / 2, cy = d.y + d.height / 2, r = d.width * 0.36;
    return { x: cx + (n === 'left' ? -r : n === 'right' ? r : 0), y: cy + (n === 'up' ? -r : n === 'down' ? r : 0) };
  };
  const touch = async (n, ms) => { const p = await spot(n); await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y }] }); await t.wait(ms || 110);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await t.wait(230); };
  const cls = await t.eval(() => document.body.className);
  t.ok(/\bpocket\b/.test(cls), 'phone: the handheld look, with its buttons', cls);
  await drive(t, h, (n) => touch(n), (n, ms) => touch(n, ms), 'phone');
  const f2 = await t.done();
  process.exitCode = f1 || f2 ? 1 : 0;
})().catch((e) => { console.error('modes ways crashed:', e); process.exitCode = 2; });
