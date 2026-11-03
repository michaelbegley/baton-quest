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
  var DEF = { view: 'auto', pixels: 'auto', glow: 'on', buttons: 'm', buzz: 'on', wide: 'auto' }, SET = {};
  try { SET = JSON.parse(localStorage.getItem('bq-settings') || '{}') || {}; } catch (e) { SET = {}; }
  Object.keys(DEF).forEach(function (k) { if (typeof SET[k] !== 'string') SET[k] = DEF[k]; });
  var askView = location.search.match(/[?&]view=(desk|pocket)/); if (askView) SET.view = askView[1];   // a link can ask for one look (handy to show the handheld on a computer)
  function saveSet() { try { localStorage.setItem('bq-settings', JSON.stringify(SET)); } catch (e) {} }
  var touchy = matchMedia('(hover: none) and (pointer: coarse)');
  function mode() { return SET.view === 'desk' || SET.view === 'pocket' ? SET.view : (touchy.matches ? 'pocket' : 'desk'); }
  function apply() {
    var m = mode();
    body.classList.toggle('desk', m === 'desk'); body.classList.toggle('pocket', m === 'pocket');
    body.classList.toggle('noglow', SET.glow === 'off');
    document.documentElement.style.setProperty('--btnk', SET.buttons === 's' ? '0.85' : SET.buttons === 'l' ? '1.18' : '1');
    document.querySelectorAll('#settings .seg').forEach(function (g) {
      var k = g.getAttribute('data-set');
      g.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === SET[k])); });
    });
    size();
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
  function releaseEverything() { Object.keys(SRC).forEach(releaseAll); document.querySelectorAll('.on').forEach(function (b) { b.classList.remove('on'); }); dpadShow({}); }

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
  window.addEventListener('keydown', function (e) {
    if (!$('help').hidden) { if (e.code === 'Escape') { closeHelp(); e.preventDefault(); } return; }
    wake();
    if (MODS[e.code]) { if (e.code !== 'ShiftLeft' && e.code !== 'ShiftRight') releaseAll('key'); return; }
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.code === 'Escape') { A.back(); e.preventDefault(); return; }
    var n = KEYS[e.code]; if (n) { set('key', n, true); e.preventDefault(); }
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
  function dpadSet(on) { ['up', 'down', 'left', 'right'].forEach(function (k) { set('dpad', k, on[k]); }); dpadShow(on); }
  dp.addEventListener('pointerdown', function (e) { e.preventDefault(); wake(); dpId = e.pointerId; try { dp.setPointerCapture(e.pointerId); } catch (x) {} dpadSet(dpadAt(e)); buzz(); });
  dp.addEventListener('pointermove', function (e) { if (e.pointerId !== dpId) return; e.preventDefault(); dpadSet(dpadAt(e)); });
  function dpEnd(e) { if (e.pointerId !== dpId) return; dpId = null; dpadSet({}); }
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { dp.addEventListener(t, dpEnd); });
  dp.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  // ---------- A, B, C and START: each its own button (several fingers at once work) ----------
  Array.prototype.forEach.call(document.querySelectorAll('#pocket [data-k]'), function (b) {
    var k = b.getAttribute('data-k'), ids = {};
    b.addEventListener('pointerdown', function (e) { e.preventDefault(); wake(); ids[e.pointerId] = 1; try { b.setPointerCapture(e.pointerId); } catch (x) {} b.classList.add('on'); set('touch', k, true); buzz(); });
    function up(e) { if (!ids[e.pointerId]) return; delete ids[e.pointerId]; if (Object.keys(ids).length) return; b.classList.remove('on'); set('touch', k, false); }
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { b.addEventListener(t, up); });
    b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });
  cv.addEventListener('pointerdown', function () { wake(); try { cv.focus(); } catch (e) {} });
  document.addEventListener('touchmove', function (e) { if (body.classList.contains('pocket') && !(e.target.closest && e.target.closest('.help'))) e.preventDefault(); }, { passive: false });   // no page scroll or zoom from the buttons
  document.addEventListener('dblclick', function (e) { if (e.target.closest && e.target.closest('#pocket')) e.preventDefault(); });

  // ---------- a controller: bottom A (jump), right B (baton), left, top, bumpers or triggers C (dash), Start, Back (to the 9F desktop) ----------
  var padOn = false, backWas = false;
  function pollPad() {
    var ps = null, p = null, i;
    try { ps = navigator.getGamepads ? navigator.getGamepads() : null; } catch (e) { ps = null; }
    for (i = 0; ps && i < ps.length; i++) if (ps[i] && ps[i].connected) { p = ps[i]; break; }
    if (!p) { if (padOn) { padOn = false; releaseAll('pad'); note('CONTROLLER GONE'); } return; }
    if (!padOn) { padOn = true; note('CONTROLLER READY'); }
    var b = function (n) { var x = p.buttons[n]; return !!(x && (x.pressed || x.value > 0.5)); }, ax = p.axes || [];
    var now = { left: b(14) || ax[0] < -0.5, right: b(15) || ax[0] > 0.5, up: b(12) || ax[1] < -0.5, down: b(13) || ax[1] > 0.5,
      a: b(0), b: b(1), c: b(2) || b(3) || b(4) || b(5) || b(6) || b(7), start: b(9) };
    NAMES.forEach(function (k) { set('pad', k, now[k]); });
    var back = b(8); if (back && !backWas) A.back(); backWas = back;
  }
  window.addEventListener('gamepadconnected', function () { pollPad(); });

  // ---------- a short note ----------
  var noteT = null;
  function note(t) { var n = $('note'); n.textContent = t; n.classList.add('show'); clearTimeout(noteT); noteT = setTimeout(function () { n.classList.remove('show'); }, 1800); }

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
        if (body.classList.contains('pocket') && navigator.canShare && navigator.share && window.File && navigator.canShare({ files: [new File([blob], name, { type: 'image/png' })] })) {
          navigator.share({ files: [new File([blob], name, { type: 'image/png' })], title: 'Baton Quest' }).catch(function () {}); return;   // a phone: its own share sheet (save to photos from there)
        }
      } catch (e) {}
      var url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000); note('PHOTO SAVED');
    }, 'image/png');
  });

  // ---------- SHARE: the link, through the phone's share sheet, or copied ----------
  $('share').addEventListener('click', function () {
    var url = location.href.split('#')[0].split('?')[0], data = { title: 'Baton Quest', text: 'Play Baton Quest', url: url };
    if (navigator.share && body.classList.contains('pocket')) { navigator.share(data).catch(function () {}); return; }
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
  $('helpBtn').addEventListener('click', openHelp);
  $('helpClose').addEventListener('click', closeHelp);
  $('help').addEventListener('click', function (e) { if (e.target === $('help')) closeHelp(); });

  // ---------- the loop (and the side glow: the screen copied small, every few frames, blurred big behind it) ----------
  var last = performance.now(), ag = amb.getContext('2d'), tick = 0, tiny = document.createElement('canvas'), tg;
  tiny.width = 16; tiny.height = 9; tg = tiny.getContext('2d');
  function loop(now) {
    requestAnimationFrame(loop);
    var dt = (now - last) / 1000; last = now;
    pollPad(); A.frame(dt);
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
})();
