// Baton Quest on the web, around the 9F computer's runtime (js/runtime.js) and the game (js/game.js).
// Two looks: with a mouse, the game fills the window (whole-number pixel steps when that still fills most of it, MDN's advice for crisp pixel art),
// and with WIDESCREEN AUTO a wide window gets a wider game (200 tall, 320 to 712 wide: more of each level, never stretched), any border lit by a blurred
// copy of the game; on a phone or tablet, the 9F POCKET handheld, filling the screen, always the classic 320 by 200. Every way in feeds the same eight
// buttons (left, right, up, down, a, b, start, c): the keyboard, the touch buttons (the D-pad is one pad a thumb can slide round, diagonals too), the
// mouse on the same buttons, and a controller (the Gamepad API). A button is down while any of them holds it. Settings and saves stay in this browser.
(function () {
  'use strict';
  var cv = document.getElementById('screen'), amb = document.getElementById('amb'), actx = null, soundOn = false, body = document.body;
  var $ = function (id) { return document.getElementById(id); };
  function audio() { return soundOn && actx ? actx : null; }
  function keep(k, v) { try { if (v === undefined) return localStorage.getItem('nf-' + k); localStorage.setItem('nf-' + k, v); } catch (e) {} return null; }
  window.NFX = {};
  var A = window.NFX.arcade = makeArcade({ canvas: cv, audio: audio, keep: keep, jot: function () {}, close: function () { A.open('quest'); } });

  // ---------- settings (kept in this browser) ----------
  var DEF = { view: 'auto', pixels: 'auto', glow: 'on', buttons: 'm', buzz: 'on', wide: 'auto', side: 'plain' }, SET = {};
  try { SET = JSON.parse(localStorage.getItem('bq-settings') || '{}') || {}; } catch (e) { SET = {}; }
  Object.keys(DEF).forEach(function (k) { if (typeof SET[k] !== 'string') SET[k] = DEF[k]; });
  var askView = location.search.match(/[?&]view=(desk|pocket)/); if (askView) SET.view = askView[1];   // a link can ask for one look (handy to show the handheld on a computer)
  function saveSet() { try { localStorage.setItem('bq-settings', JSON.stringify(SET)); } catch (e) {} }
  var touchy = matchMedia('(hover: none) and (pointer: coarse)'), padView = false;   // padView: on a phone or tablet in VIEW AUTO, a controller in use puts the game full screen
  function mode() { return SET.view === 'desk' || SET.view === 'pocket' ? SET.view : (touchy.matches && !padView ? 'pocket' : 'desk'); }
  function apply() {
    var m = mode();
    body.classList.toggle('desk', m === 'desk'); body.classList.toggle('pocket', m === 'pocket'); body.classList.toggle('padview', m === 'desk' && padView);
    body.classList.toggle('noglow', SET.glow === 'off'); body.classList.toggle('sideplain', SET.side !== 'shell');   // sideways: PLAIN (just the screen and the buttons) or HANDHELD
    document.querySelectorAll('#looksw button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-side') === (SET.side === 'shell' ? 'shell' : 'plain'))); });
    document.documentElement.style.setProperty('--btnk', SET.buttons === 's' ? '0.85' : SET.buttons === 'l' ? '1.18' : '1');
    document.querySelectorAll('#settings .seg').forEach(function (g) {
      var k = g.getAttribute('data-set');
      g.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === SET[k])); });
    });
    size();
    if (window.BQ_BRIDGE) window.BQ_BRIDGE.changed();   // B20: the game's SYSTEM screen reads the page's settings again
  }
  function gameW() {   // the game's width: on a computer with WIDESCREEN AUTO, the window's own shape at 200 tall (round(200 x width / height), 320 to 712); else the classic 320
    var w = innerWidth, h = innerHeight;
    if (!body.classList.contains('desk') || SET.wide === 'off' || !A.resize || !(w > 0 && h > 0)) return 320;
    return Math.max(320, Math.min(712, Math.round(200 * w / h)));
  }
  function size() {   // a computer: the screen as big as the window allows, in whole steps of device pixels when that fills at least 90% of it
    var gw = A.resize ? A.resize(gameW()) : 320;   // the runtime widens (or narrows) the game's screen first; the game reads it on its next frame
    if (!body.classList.contains('desk')) { cv.style.width = ''; cv.style.height = ''; return; }
    var w = innerWidth, h = innerHeight, k = Math.min(w / gw, h / 200), dpr = window.devicePixelRatio || 1, kd = Math.floor(k * dpr) / dpr;
    var sharp = SET.pixels === 'sharp' || (SET.pixels === 'auto' && kd >= 1 && kd / k >= 0.9);
    var use = sharp && kd >= 1 ? kd : k, sw = Math.floor(gw * use), sh = Math.floor(200 * use);
    cv.style.width = sw + 'px'; cv.style.height = sh + 'px';
    amb.style.display = gw > 320 && sw >= 0.9 * w && sh >= 0.9 * h ? 'none' : '';   // a wide game that fills the window leaves only thin borders: no glow behind it (measured headless at 5120 by 1440: 21 frames a second with it, 48 without)
  }
  if (touchy.addEventListener) touchy.addEventListener('change', apply);
  $('looksw').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; SET.side = b.getAttribute('data-side'); saveSet(); apply(); });   // the switch at the top right, sideways
  window.addEventListener('resize', size);
  document.querySelectorAll('#settings .seg').forEach(function (g) {
    var k = g.getAttribute('data-set');
    g.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; SET[k] = b.getAttribute('data-v'); saveSet(); apply(); });
  });

  // ---------- one held state for each way in ----------
  var NAMES = ['left', 'right', 'up', 'down', 'a', 'b', 'start', 'c'], SRC = { key: {}, touch: {}, dpad: {}, pad: {} }, down = {};
  function set(src, k, on) {
    SRC[src][k] = !!on;
    var any = !!(SRC.key[k] || SRC.touch[k] || SRC.dpad[k] || SRC.pad[k]);
    if (!!down[k] !== any) { down[k] = any; A.setKey(k, any); }
  }
  function releaseAll(src) { NAMES.forEach(function (k) { set(src, k, false); }); }
  function releaseEverything() { Object.keys(SRC).forEach(releaseAll); document.querySelectorAll('.on').forEach(function (b) { b.classList.remove('on'); }); dpadShow({}); if (typeof releasePads === 'function') releasePads(); }

  // ---------- sound: only after a first touch or key ----------
  var sndBtn = $('snd'), led = $('led');
  function wake() {
    if (actx) return;
    try { actx = new (window.AudioContext || window.webkitAudioContext)(); soundOn = true; } catch (e) { actx = null; }
    showSound();
  }
  function showSound() { sndBtn.setAttribute('aria-pressed', String(soundOn)); sndBtn.title = soundOn ? 'Sound is on' : 'Sound is off'; led.classList.toggle('off', !soundOn); }   // teal when on, struck through when off
  sndBtn.addEventListener('click', function () {
    if (!actx) { wake(); return; }
    soundOn = !soundOn;
    try { if (soundOn) actx.resume(); else actx.suspend(); } catch (e) {}
    showSound();
  });
  function buzz() { if (SET.buzz === 'off') return; try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) {} }

  // ---------- the keyboard (Shift, Ctrl, Alt and the Windows key are never game keys: screenshot keys stay free) ----------
  var KEYS = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
    Space: 'a', KeyZ: 'a', KeyK: 'a', KeyX: 'b', KeyJ: 'b', KeyC: 'c', KeyL: 'c', Enter: 'start', KeyP: 'start' };
  var MODS = { ShiftLeft: 1, ShiftRight: 1, ControlLeft: 1, ControlRight: 1, AltLeft: 1, AltRight: 1, MetaLeft: 1, MetaRight: 1, OSLeft: 1, OSRight: 1 };
  function dlg() { var d = window.BQ_DLG; return d && d.open() ? d : null; }   // B20: a dialog of the page's (its MENU, or a small one in the game's look: js/bridge.js) takes every way in
  window.addEventListener('keydown', function (e) {
    var d = dlg();
    if (d) { if (d.key(e)) e.preventDefault(); return; }   // B20: arrows move between its buttons, Z or K presses, X, J or Esc closes; Enter, Space and Tab do what they always do
    if (!$('help').hidden) { if (e.code === 'Escape') { closeHelp(); e.preventDefault(); } return; }
    wake();
    if (MODS[e.code]) { if (e.code !== 'ShiftLeft' && e.code !== 'ShiftRight') releaseAll('key'); return; }
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.code === 'Escape') { if (window.BQ_BRIDGE && window.BQ_BRIDGE.escape()) { e.preventDefault(); return; } A.back(); e.preventDefault(); return; }   // B20: Esc on the game's SYSTEM screen is its B
    var n = KEYS[e.code]; if (n) { if (!(e.repeat && !SRC.key[n])) set('key', n, true); e.preventDefault(); }   // B20: a key held from a dialog (its repeats) reaches the game only once let go
  });
  window.addEventListener('keyup', function (e) { var n = KEYS[e.code]; if (n) { set('key', n, false); e.preventDefault(); } });
  window.addEventListener('blur', releaseEverything);
  document.addEventListener('visibilitychange', function () { if (document.hidden) releaseEverything(); });

  // ---------- the D-pad: one pad, read from where the thumb is ----------
  var dp = $('dpad'), dpId = null;
  function dpadAt(e) {
    var r = dp.getBoundingClientRect(), x = (e.clientX - (r.left + r.width / 2)) / (r.width / 2), y = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    var len = Math.sqrt(x * x + y * y), on = {};
    if (len > 0.2) { x /= len; y /= len; on.left = x < -0.38; on.right = x > 0.38; on.up = y < -0.38; on.down = y > 0.38; }   // eight ways: a diagonal when both parts are over 0.38
    return on;
  }
  function dpadShow(on) { ['up', 'down', 'left', 'right'].forEach(function (k) { dp.classList.toggle('on-' + k, !!on[k]); }); }
  var dpWas = {};
  function dpadSet(on) {
    var d = dlg();
    if (d) { ['up', 'down', 'left', 'right'].forEach(function (k) { if (on[k] && !dpWas[k]) d.move(k === 'up' || k === 'left' ? -1 : 1); set('dpad', k, false); }); dpWas = on; dpadShow(on); return; }   // B20: in a dialog the D-pad moves between its buttons
    dpWas = on;
    ['up', 'down', 'left', 'right'].forEach(function (k) { set('dpad', k, on[k]); }); dpadShow(on);
  }
  dp.addEventListener('pointerdown', function (e) { e.preventDefault(); wake(); dpId = e.pointerId; try { dp.setPointerCapture(e.pointerId); } catch (x) {} dpadSet(dpadAt(e)); buzz(); });
  dp.addEventListener('pointermove', function (e) { if (e.pointerId !== dpId) return; e.preventDefault(); dpadSet(dpadAt(e)); });
  function dpEnd(e) { if (e.pointerId !== dpId) return; dpId = null; dpadSet({}); }
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { dp.addEventListener(t, dpEnd); });
  dp.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  // ---------- A, B, C and START: each its own button (several fingers at once work) ----------
  Array.prototype.forEach.call(document.querySelectorAll('#pocket [data-k]'), function (b) {
    var k = b.getAttribute('data-k'), ids = {}, inDlg = false;
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); wake(); ids[e.pointerId] = 1; try { b.setPointerCapture(e.pointerId); } catch (x) {} b.classList.add('on'); inDlg = !!dlg(); if (!inDlg) set('touch', k, true); buzz(); });
    function up(e) {
      if (!ids[e.pointerId]) return; delete ids[e.pointerId]; if (Object.keys(ids).length) return; b.classList.remove('on');
      if (inDlg) { var d = dlg(); inDlg = false; if (d && e.type === 'pointerup') { if (k === 'b') d.cancel(); else if (k === 'c') d.move(1); else d.press('touch'); } return; }   // B20: a real tap, so the dialog may open a file picker or the clipboard
      set('touch', k, false);
    }
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { b.addEventListener(t, up); });
    b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });
  cv.addEventListener('pointerdown', function () { wake(); try { cv.focus(); } catch (e) {} });
  document.addEventListener('touchmove', function (e) { if (body.classList.contains('pocket') && !(e.target.closest && e.target.closest('.help'))) e.preventDefault(); }, { passive: false });   // no page scroll or zoom from the buttons
  document.addEventListener('dblclick', function (e) { if (e.target.closest && e.target.closest('#pocket')) e.preventDefault(); });

  // ---------- a controller: bottom A (jump), right B (baton), left, top, bumpers or triggers C (dash), Start, Back (to the 9F desktop) ----------
  // Version 118 (B18): several at once (MDN: each pad's index is unique while it is connected; read getGamepads() every frame). The first one seen is controller 1,
  // the main buttons, as before; each further one takes the lowest free number 2 to 4 and keeps it while it is connected (BATTLE MODE's other players, api.pad(n)).
  var padOn = false, backWas = false, padWas = false, padNum = {};
  function padFull(on) {   // a phone or tablet: a controller takes the game full screen (the handheld steps aside); a touch on the screen brings the handheld back
    if (padView === on || !touchy.matches) return;
    padView = on; releaseEverything(); apply();
    if (on && SET.view === 'auto') note('CONTROLLER READY. TOUCH THE SCREEN FOR THE BUTTONS', 3200);
  }
  function padRead(p) {
    var b = function (n) { var x = p.buttons[n]; return !!(x && (x.pressed || x.value > 0.5)); }, ax = p.axes || [];
    return { left: b(14) || ax[0] < -0.5, right: b(15) || ax[0] > 0.5, up: b(12) || ax[1] < -0.5, down: b(13) || ax[1] > 0.5,
      a: b(0), b: b(1), c: b(2) || b(3) || b(4) || b(5) || b(6) || b(7), start: b(9), back: b(8) };
  }
  function padTaken(n) { for (var k in padNum) if (padNum[k] === n) return true; return false; }
  function pollPad() {
    var ps = null, i, p, id, n, seen = {}, now = {}, main = null, first = false, count = 0, any = false;
    try { ps = navigator.getGamepads ? navigator.getGamepads() : null; } catch (e) { ps = null; }
    for (i = 0; ps && i < ps.length; i++) {
      p = ps[i]; if (!p || !p.connected) continue;
      id = 'i' + (p.index !== undefined && p.index !== null ? p.index : i); seen[id] = p;
      if (!padNum[id]) { for (n = 1; n <= 4 && padTaken(n); n++) {} if (n <= 4) { padNum[id] = n; first = true; if (n > 1 && A.setPadOn) { A.setPadOn(n, true); note('CONTROLLER ' + n + ' READY'); } } }
    }
    for (id in padNum) if (Object.prototype.hasOwnProperty.call(padNum, id) && !seen[id]) {   // unplugged: its number is free again, its buttons let go
      n = padNum[id]; delete padNum[id];
      if (n > 1 && A.setPadOn) { A.setPadOn(n, false); note('CONTROLLER ' + n + ' GONE'); }
    }
    for (id in padNum) if (Object.prototype.hasOwnProperty.call(padNum, id)) {
      count++; now[id] = padRead(seen[id]);
      if (now[id].back || NAMES.some(function (k) { return now[id][k]; })) any = true;
    }
    // a phone or tablet: the first sight of any controller, or a fresh press on any of them, puts the game full screen (padFull lets every button go first,
    // so the keys are set after it); with none left, the handheld again. Browsers show a controller only once it is pressed, so its first sight is a press too.
    if (!count) { padWas = false; padFull(false); } else { if (first || (any && !padWas)) padFull(true); padWas = any; }
    for (id in now) if (Object.prototype.hasOwnProperty.call(now, id)) {
      n = padNum[id];
      if (n === 1) main = now[id];
      else if (A.setPadKey) NAMES.forEach(function (k) { A.setPadKey(n, k, now[id][k]); });
    }
    if (!main) { if (padOn) { padOn = false; releaseAll('pad'); note('CONTROLLER GONE'); } return; }
    if (!padOn) { padOn = true; if (!touchy.matches || SET.view !== 'auto') note('CONTROLLER READY'); }
    var d = dlg();
    if (d) { releaseAll('pad'); padDlg(d, main); NAMES.forEach(function (k) { padHold[k] = !!main[k]; }); backWas = main.back; return; }   // B20: a page dialog takes controller 1 (its D-pad moves, A or Start presses, B closes)
    padDlgWas = main;
    NAMES.forEach(function (k) { if (padHold[k]) { if (main[k]) return; padHold[k] = false; } set('pad', k, main[k]); });   // B20: a button still held from a dialog reaches the game only once let go
    if (main.back && !backWas) A.back(); backWas = main.back;
  }
  var padDlgWas = {}, padHold = {};
  function padDlg(d, now) {   // a press is a change from the poll before (a button held when the dialog opened does nothing)
    ['up', 'down', 'left', 'right', 'a', 'b', 'start', 'c'].forEach(function (k) {
      if (now[k] && !padDlgWas[k]) { if (k === 'up' || k === 'left') d.move(-1); else if (k === 'down' || k === 'right' || k === 'c') d.move(1); else if (k === 'b') d.cancel(); else d.press('pad'); }
    });
    padDlgWas = now;
  }
  function releasePads() { if (A.setPadKey) [2, 3, 4].forEach(function (n) { NAMES.forEach(function (k) { A.setPadKey(n, k, false); }); }); }
  window.addEventListener('gamepadconnected', function () { pollPad(); });
  document.addEventListener('pointerdown', function (e) {   // a touch on the game while a controller has it full screen: the handheld again (the next press on the controller: full screen again)
    if (!padView || e.pointerType !== 'touch' || (e.target.closest && e.target.closest('button, a, .help'))) return;
    padFull(false);
  }, true);

  // ---------- a short note ----------
  var noteT = null;
  function note(t, ms) { var n = $('note'); n.textContent = t; n.classList.add('show'); clearTimeout(noteT); noteT = setTimeout(function () { n.classList.remove('show'); }, ms || 1800); }
  window.POCKET_NOTE = note;   // version 118: js/net.js says LINK COPIED with it

  // ---------- a computer: the toolbar and the key hints fade while the mouse is still ----------
  var idleT = null;
  function awake() { body.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(function () { if ($('help').hidden) body.classList.add('idle'); }, 2600); }
  window.addEventListener('mousemove', awake); window.addEventListener('mousedown', awake); awake();
  setTimeout(function () { body.classList.add('hint-off'); }, 9000);

  // ---------- PHOTO: the screen at four times its size (a wide screen too), as a picture to keep ----------
  function stamp() { var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()); }
  $('shot').addEventListener('click', function () {
    var big = document.createElement('canvas'); big.width = cv.width * 4; big.height = cv.height * 4;
    var g = big.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(cv, 0, 0, big.width, big.height);
    big.toBlob(function (blob) {
      if (!blob) { note('NO PHOTO'); return; }
      var name = 'baton-quest-' + stamp() + '.png';
      try {
        if (touchy.matches && navigator.canShare && navigator.share && window.File && navigator.canShare({ files: [new File([blob], name, { type: 'image/png' })] })) {
          navigator.share({ files: [new File([blob], name, { type: 'image/png' })], title: 'Baton Quest' }).catch(function () {}); return;   // a phone: its own share sheet (save to photos from there)
        }
      } catch (e) {}
      var url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000); note('PHOTO SAVED');
    }, 'image/png');
  });

  // ---------- SHARE: the link, through the phone's share sheet, or copied ----------
  $('share').addEventListener('click', function () {   // while hosting a BATTLE MODE game online (version 118), the link that joins it
    var join = window.BQ_NET && window.BQ_NET.link ? window.BQ_NET.link() : '';
    var url = join || location.href.split('#')[0].split('?')[0], data = { title: 'Baton Quest', text: join ? 'BATTLE MODE: join my game' : 'Play Baton Quest', url: url };
    if (navigator.share && touchy.matches) { navigator.share(data).catch(function () {}); return; }   // a phone or tablet, whichever look: its own share sheet
    try { navigator.clipboard.writeText(url).then(function () { note('LINK COPIED'); }, function () { note(url); }); } catch (e) { note(url); }
  });

  // ---------- FULL: full screen where the browser allows it (not on an iPhone: add it to the home screen there) ----------
  var root = document.documentElement, full = $('full');
  if (root.requestFullscreen || root.webkitRequestFullscreen) full.hidden = false;
  full.addEventListener('click', function () {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
      (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
    } catch (e) {}
  });
  document.addEventListener('fullscreenchange', size);

  // ---------- MENU: the settings and how to play ----------
  function openHelp() { releaseEverything(); $('help').hidden = false; body.classList.remove('idle'); $('helpClose').focus(); }
  function closeHelp() { $('help').hidden = true; try { cv.focus(); } catch (e) {} awake(); }
  $('helpBtn').addEventListener('click', function () { if (window.BQ_BRIDGE && window.BQ_BRIDGE.menu()) return; openHelp(); });   // B20: MENU opens the game's SYSTEM screen first (js/bridge.js); the page's own menu when the game cannot
  $('helpClose').addEventListener('click', closeHelp);
  $('help').addEventListener('click', function (e) { if (e.target === $('help')) closeHelp(); });

  // ---------- the loop (and the side glow: the screen copied small, every few frames, blurred big behind it) ----------
  var last = performance.now(), ag = amb.getContext('2d'), tick = 0, tiny = document.createElement('canvas'), tg;
  tiny.width = 16; tiny.height = 9; tg = tiny.getContext('2d');
  function loop(now) {
    requestAnimationFrame(loop);
    var dt = (now - last) / 1000; last = now;
    pollPad(); A.frame(dt);
    if (window.BQ_BRIDGE) window.BQ_BRIDGE.frame();   // B20: what the game asked the page this frame, done after the frame
    if (body.classList.contains('desk') && SET.glow !== 'off' && amb.style.display !== 'none' && (++tick % 6) === 0) {   // the screen squeezed into 16 by 9 (its middle third stretched across), dimmed
      try {   // 16 by 9, then softened into 96 by 54 with a small blur (cheap at that size), then the browser stretches it smoothly
        tg.drawImage(cv, (cv.width - 240) >> 1, 10, 240, 180, 0, 0, 16, 9);   // the middle of the screen, however wide it is
        ag.filter = 'blur(5px)'; ag.drawImage(tiny, -8, -8, amb.width + 16, amb.height + 16); ag.filter = 'none';
        ag.fillStyle = 'rgba(0, 0, 0, 0.5)'; ag.fillRect(0, 0, amb.width, amb.height);
      } catch (e) {}
    }
  }
  apply();
  requestAnimationFrame(loop);
  window.POCKET_OPEN = function () { A.open('quest'); try { cv.focus(); } catch (e) {} };
  var OK = { view: ['auto', 'desk', 'pocket'], side: ['plain', 'shell'], pixels: ['auto', 'sharp', 'fill'], wide: ['auto', 'off'], glow: ['on', 'off'], buttons: ['s', 'm', 'l'], buzz: ['on', 'off'] };
  window.BQ_PAGE = {   // B20: for js/bridge.js only: the page's own settings (kept in bq-settings, as always), its look, its sound and its menu
    settings: function () { var o = {}; Object.keys(DEF).forEach(function (k) { o[k] = SET[k]; }); return o; },
    set: function (k, v) { if (!OK[k] || OK[k].indexOf(v) < 0) return false; SET[k] = v; saveSet(); apply(); return true; },
    look: function () { return { mode: mode(), touch: touchy.matches, pad: padView, vibrate: !!navigator.vibrate }; },
    sound: function (on) {   // no argument: is it on; true or false: turn it so (a browser starts it only after a tap, a click or a key: the answer says if it runs)
      if (on !== undefined) { if (on && !actx) wake(); else if (actx) { soundOn = !!on; try { if (soundOn) actx.resume(); else actx.suspend(); } catch (e) {} showSound(); } }
      return soundOn && !!actx;
    },
    running: function () { return !!(actx && actx.state === 'running'); },
    openHelp: openHelp, closeHelp: closeHelp, helpOpen: function () { return !$('help').hidden; }, canvas: cv, note: note, release: releaseEverything,
    tap: function (k) { A.setKey(k, true); A.setKey(k, false); }
  };
})();
