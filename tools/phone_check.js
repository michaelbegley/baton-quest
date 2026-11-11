// The phone FULL WINDOW check (miss 8, version 123.1): node tools/phone_check.js   (BQ_ROOT=DIR for another copy)
// Michael, 3 Nov 2026, 05:46 Central, on an iPhone in FULL WINDOW: "there's no way back without connecting a controller". On a touch screen with no
// controller, the SYSTEM screen's VIEW offers no FULL WINDOW; with FULL WINDOW on (from the page's own menu), MENU opens the page's own menu at once
// and a touch on the game says how to get the buttons back; with a controller, MENU opens the SYSTEM screen as before. 12 checks.
'use strict';
const T = require('./bqtest');
const PAD = () => { window.__pad = { connected: false, id: 'test pad', mapping: 'standard', axes: [0, 0, 0, 0], buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })) };
  navigator.getGamepads = () => (window.__pad.connected ? [window.__pad] : [null]); };
(async () => {
  const t = await T.start({ name: 'phone', init: PAD, context: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true } });
  const p = t.page;
  await t.wait(1500);
  const st = () => p.evaluate(() => { let v = ''; try { v = (JSON.parse(localStorage.getItem('bq-settings') || '{}') || {}).view || ''; } catch (e) {}
    const n = document.getElementById('note'), d = document.getElementById('dpad');
    return { cls: document.body.className, view: v, sys: window.BQ_BRIDGE.state().sys, help: !document.getElementById('help').hidden, btn: document.getElementById('helpBtn').textContent.trim(),
      note: n.classList.contains('show') ? n.textContent : '', dpad: getComputedStyle(d).display }; });
  const key = async (code) => { await p.keyboard.down(code); await p.waitForTimeout(90); await p.keyboard.up(code); await p.waitForTimeout(400); };
  const press = async (n) => { await p.evaluate(n => { window.__pad.buttons[n].pressed = true; }, n); await p.waitForTimeout(150); await p.evaluate(n => { window.__pad.buttons[n].pressed = false; }, n); await p.waitForTimeout(250); };
  let s = await st();
  t.ok(/\bpocket\b/.test(s.cls) && s.dpad !== 'none', 'a phone: the handheld, its D-pad shown', s);
  await p.tap('#helpBtn'); await p.waitForTimeout(700); s = await st();
  t.ok(s.sys && s.btn === 'PAGE MENU' && !s.help, 'MENU opens the SYSTEM screen (the button reads PAGE MENU)', s);
  const seen = [];
  for (const k of ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']) { await key(k); const q = await st(); seen.push((q.view || 'unset') + (/\bpocket\b/.test(q.cls) ? '/pocket' : '/' + q.cls)); }
  t.ok(seen.every(x => !/^desk/.test(x) && /\/pocket$/.test(x)), 'Left and Right on VIEW six times: never FULL WINDOW, the handheld every time', seen);
  await p.tap('#helpBtn'); await p.waitForTimeout(500); s = await st();
  t.ok(s.help, 'PAGE MENU: the page\'s own menu', s);
  await p.tap('[data-set="view"] [data-v="desk"]'); await p.waitForTimeout(300); await p.tap('#helpClose'); await p.waitForTimeout(500); s = await st();
  t.ok(s.view === 'desk' && /\bdesk\b/.test(s.cls) && s.dpad === 'none', 'FULL WINDOW from the page\'s menu: the whole window, no D-pad', s);
  await p.reload(); await p.waitForFunction(() => window.NFX && NFX.arcade && NFX.arcade.run && NFX.arcade.run()); await p.waitForTimeout(1800); s = await st();
  t.ok(s.view === 'desk' && /\bdesk\b/.test(s.cls) && !s.sys, 'after a reload: still FULL WINDOW, the SYSTEM screen not up', s);
  await p.tap('#screen'); await p.waitForTimeout(300); s = await st();
  t.ok(/NO BUTTONS IN FULL WINDOW: TAP MENU, THEN VIEW: AUTO/.test(s.note), 'a touch on the game: a note says how to get the buttons back', s);
  await p.tap('#helpBtn'); await p.waitForTimeout(600); s = await st();
  t.ok(s.help && !s.sys, 'MENU: the page\'s own menu at once (nothing could move on the SYSTEM screen)', s);
  await p.tap('[data-set="view"] [data-v="auto"]'); await p.waitForTimeout(300); await p.tap('#helpClose'); await p.waitForTimeout(500); s = await st();
  t.ok(s.view === 'auto' && /\bpocket\b/.test(s.cls) && s.dpad !== 'none' && !s.help, 'AUTO, GOT IT: the handheld and its buttons are back', s);
  await p.tap('#helpBtn'); await p.waitForTimeout(700);
  if ((await st()).sys) { await p.tap('#helpBtn'); await p.waitForTimeout(500); }
  await p.tap('[data-set="view"] [data-v="desk"]'); await p.waitForTimeout(300); await p.tap('#helpClose'); await p.waitForTimeout(400);
  if ((await st()).sys) { await key('Escape'); }
  await p.evaluate(() => { window.__pad.connected = true; window.__pad.buttons[0].pressed = true; window.dispatchEvent(new Event('gamepadconnected')); });
  await p.waitForTimeout(250); await p.evaluate(() => { window.__pad.buttons[0].pressed = false; }); await p.waitForTimeout(500);
  await p.tap('#helpBtn'); await p.waitForTimeout(700); s = await st();
  t.ok(s.sys && !s.help && /\bdesk\b/.test(s.cls), 'a controller in use, FULL WINDOW: MENU opens the SYSTEM screen, as before', s);
  await press(1); await p.waitForTimeout(300); s = await st();
  t.ok(!s.sys, 'the controller\'s B closes it', s);
  await t.done();
})().catch((e) => { console.error('phone check crashed:', e); process.exitCode = 2; });
