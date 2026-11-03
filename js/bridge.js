// Baton Quest's page bridge, the page's half (B20 MENUS, 2 Nov; QUEST-API.md part 22). The game never touches the page: it sees only the runtime's
// api.host (js/runtime.js), plain messages read once a frame. This file tells the runtime what the page offers (its settings, still kept by js/pocket.js
// in bq-settings; the four backups and KEEP MY SAVES from js/saves.js; THE MANUAL; the page's own menu), does what the game asks after each frame, and,
// where a browser allows something only right after a real tap, click or key press (a file picker, the clipboard, typing a code), shows a small dialog
// in the game's look whose buttons the D-pad, the keys and a controller move between (BQ_DLG: the page's MENU dialog moves the same way).
// The page's MENU button opens the game's SYSTEM screen; while that is up the button reads PAGE MENU and opens the page's own menu, the fallback.
(function () {
  'use strict';
  var A = window.NFX && window.NFX.arcade, P = window.BQ_PAGE, SV = window.BQ_SAVES;
  if (!A || !A.setHost || !P) return;
  var $ = function (id) { return document.getElementById(id); }, sys = false, menuWait = null, dirty = false, btn = $('helpBtn'), run = null;
  var WAIT = 'YOUR BROWSER WANTS A TAP, A CLICK OR A KEY FOR THIS: FINISH IT IN THE BOX ON THE PAGE.';
  function UA() { return navigator.userActivation || null; }
  function active() { var u = UA(); return !!(u && u.isActive); }   // MDN, User activation: isActive is the transient activation a real tap, click or key gives
  function say(m) { A.hostSend(m); }
  function words(t) { return String(t || '').toUpperCase().replace(/[^A-Z0-9 .,!?:;\-+\/'"()=%*#<>_&@$\[\]]/g, ''); }   // only the letters the game's font has
  function reply(id, ok, t) { say({ kind: 'reply', id: id, ok: !!ok, text: words(t) }); }
  // ---------- what the page offers ----------
  function C(list) { return list.map(function (p) { return [p[0], p[1]]; }); }
  function info() {
    var s = P.settings(), L = P.look(), desk = L.mode === 'desk', touch = L.touch;
    return { v: 1, where: L.pad ? 'WITH A CONTROLLER' : desk ? (touch ? 'THE WHOLE SCREEN' : 'ON A COMPUTER') : 'ON THE HANDHELD',
      settings: [
        { id: 'view', name: 'VIEW', now: s.view, choices: C([['auto', 'AUTO'], ['desk', 'FULL WINDOW'], ['pocket', 'HANDHELD']]), note: 'AUTO: THE HANDHELD ON A PHONE OR TABLET, THE WHOLE WINDOW WITH A MOUSE.' },
        { id: 'side', name: 'SIDEWAYS', now: s.side, choices: C([['plain', 'PLAIN'], ['shell', 'HANDHELD']]), note: 'A PHONE ON ITS SIDE: JUST THE SCREEN AND THE BUTTONS, OR THE HANDHELD.', live: touch, why: 'ONLY ON A PHONE OR TABLET, TURNED ON ITS SIDE.' },
        { id: 'pixels', name: 'PIXELS', now: s.pixels, choices: C([['auto', 'AUTO'], ['sharp', 'SHARP'], ['fill', 'FILL']]), note: 'SHARP: WHOLE-NUMBER PIXEL STEPS, CRISP. FILL: AS BIG AS THE WINDOW ALLOWS.', live: desk, why: 'ONLY IN THE WHOLE-WINDOW LOOK (SEE VIEW).' },
        { id: 'wide', name: 'WIDESCREEN', now: s.wide, choices: C([['auto', 'AUTO'], ['off', 'OFF']]), note: 'AUTO: A WIDE WINDOW SHOWS MORE OF EACH LEVEL, UP TO 32:9. OFF: THE CLASSIC 320 BY 200.', live: desk, why: 'THE HANDHELD IS ALWAYS THE CLASSIC 320 BY 200.' },
        { id: 'glow', name: 'SIDE GLOW', now: s.glow, choices: C([['on', 'ON'], ['off', 'OFF']]), note: "A SOFT GLOW OF THE GAME'S OWN LIGHT AT THE SIDES OF THE WINDOW.", live: desk, why: 'ONLY IN THE WHOLE-WINDOW LOOK (SEE VIEW).' },
        { id: 'buttons', name: 'BUTTONS', now: s.buttons, choices: C([['s', 'SMALL'], ['m', 'MEDIUM'], ['l', 'LARGE']]), note: "THE SIZE OF THE HANDHELD'S D-PAD AND BUTTONS.", live: !desk, why: 'ONLY ON THE HANDHELD (SEE VIEW).' },
        { id: 'buzz', name: 'VIBRATION', now: s.buzz, choices: C([['on', 'ON'], ['off', 'OFF']]), note: 'A SHORT BUZZ WHEN A BUTTON IS TOUCHED.', live: touch && L.vibrate, why: 'ONLY ON A PHONE OR TABLET THAT CAN BUZZ.' },
        { id: 'sound', name: 'SOUND', now: P.sound() ? 'on' : 'off', choices: C([['on', 'ON'], ['off', 'OFF']]), note: 'THE MUSIC AND SOUNDS IN THIS TAB. THE SOUND BUTTON DOES IT TOO.' }
      ],
      actions: [
        { id: 'saveFile', name: 'SAVE TO A FILE', group: 'saves', note: 'A BACKUP OF ALL THREE FILES, TO KEEP OR TO MOVE TO ANOTHER DEVICE.' },
        { id: 'copyCode', name: 'COPY A CODE', group: 'saves', note: 'THE SAME BACKUP AS TEXT, TO PASTE ON ANOTHER DEVICE.' },
        { id: 'loadFile', name: 'FROM A FILE', group: 'saves', note: 'RESTORE A BACKUP FILE. IT ASKS FIRST AND KEEPS WHAT IT REPLACES.' },
        { id: 'pasteCode', name: 'PASTE A CODE', group: 'saves', note: 'RESTORE FROM A CODE. IT ASKS FIRST AND KEEPS WHAT IT REPLACES.' },
        { id: 'keep', name: 'KEEP MY SAVES', group: 'saves', note: 'ASK THIS BROWSER NOT TO CLEAR THEM.' },
        { id: 'manual', name: 'THE MANUAL', group: 'more', note: 'THE INSTRUCTION BOOKLET: THE STORY, THE CAST, THE CONTROLS. IT OPENS IN THIS TAB.' },
        { id: 'pageMenu', name: "THE PAGE'S MENU", group: 'more', note: 'THE SAME SETTINGS ON THE PAGE, WITH HOW TO PLAY, ONLINE PLAY AND FEEDBACK.' }
      ] };
  }
  A.setHost({ info: info });
  // ---------- the small dialog, in the game's look (built here, styled in index.html as .bqask) ----------
  var box = document.createElement('div');
  box.className = 'bqask'; box.id = 'bqask'; box.hidden = true; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'bqaskTitle');
  box.innerHTML = '<div class="win"><div class="strip"><b>&gt;_</b><span id="bqaskTitle"></span><i></i></div><p id="bqaskText"></p>' +
    '<textarea id="bqaskCode" rows="3" aria-label="A save code" hidden></textarea><p class="why" id="bqaskWhy" role="status" aria-live="polite"></p><div class="bqrow" id="bqaskBtns"></div></div>';
  document.body.appendChild(box);
  var D = { id: '', buttons: [] }, at = null;   // at: a page dialog's picked stop, kept if a tap elsewhere takes the focus away
  document.addEventListener('focusin', function (e) { var d = cur(); if (d && d.contains(e.target)) at = e.target; });
  function pick(el) { at = el; try { el.focus({ preventScroll: true }); } catch (e) { try { el.focus(); } catch (x) {} } }
  function picked(d) { var el = document.activeElement; return el && el !== document.body && d.contains(el) ? el : at && d.contains(at) ? at : null; }
  function fit() {   // the handheld: the dialog over the screen only, so the D-pad and the buttons (below it, or either side of it) stay free to move in it
    var dp = $('dpad'), bt = document.querySelector('#pocket .btns'), sc, rd, rb;
    box.style.left = box.style.right = box.style.bottom = '';
    if (!document.body.classList.contains('pocket') || !dp || !bt || dp.offsetParent === null) return;
    sc = P.canvas.getBoundingClientRect(); rd = dp.getBoundingClientRect(); rb = bt.getBoundingClientRect();
    if (rd.right <= sc.left + 2 && rb.left >= sc.right - 2) { box.style.left = Math.max(0, rd.right + 4) + 'px'; box.style.right = Math.max(0, innerWidth - rb.left + 4) + 'px'; }   // sideways
    else box.style.bottom = Math.max(0, innerHeight - Math.min(rd.top, rb.top) + 4) + 'px';   // upright: they are under the screen
  }
  window.addEventListener('resize', function () { if (!box.hidden) fit(); });
  function closeAsk(cancelled) {
    if (box.hidden) return;
    box.hidden = true; $('bqaskCode').hidden = true;
    if (cancelled && D.id) reply(D.id, false, 'NOTHING CHANGED.');
    D.id = ''; at = null; try { P.canvas.focus(); } catch (e) {}   // focus back to the game (APG: to what opened it)
  }
  function ask(id, title, text, buttons, code) {   // buttons: [{ t, gate, go }]: gate means it needs a real tap, click or key, which a controller press is not
    var b = $('bqaskBtns'), i, el;
    P.release(); D.id = id; D.buttons = buttons;
    $('bqaskTitle').textContent = title; $('bqaskText').textContent = text; $('bqaskWhy').textContent = '';
    $('bqaskCode').hidden = code === undefined; $('bqaskCode').value = code || ''; $('bqaskCode').readOnly = id === 'copyCode';
    b.innerHTML = '';
    for (i = 0; i < buttons.length; i++) {
      el = document.createElement('button'); el.type = 'button'; el.textContent = buttons[i].t; if (buttons[i].gate) el.setAttribute('data-gate', '1');
      el.addEventListener('click', (function (k) { return function () { buttons[k].go(); }; })(i)); b.appendChild(el);
    }
    box.hidden = false; fit(); say({ kind: 'wait', id: id, text: WAIT });
    pick(b.firstChild || box);   // the first button: the one that does it (APG: focus moves into the dialog)
  }
  function why(t) { var w = $('bqaskWhy'); w.textContent = t; box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); }
  // ---------- moving in a page dialog: this one, or the page's MENU ----------
  function cur() { return !box.hidden ? box : P.helpOpen() ? $('help') : null; }
  function stops(d) { return Array.prototype.filter.call(d.querySelectorAll('button, a[href], textarea'), function (e) { return !e.hidden && !e.closest('[hidden]') && e.offsetParent !== null; }); }
  window.BQ_DLG = {
    open: function () { return !!cur(); },
    move: function (dir) { var d = cur(), l = d ? stops(d) : [], i; if (!l.length) return; i = l.indexOf(picked(d)); i = i < 0 ? 0 : (i + (dir < 0 ? l.length - 1 : 1)) % l.length; pick(l[i]); if (l[i].scrollIntoView) l[i].scrollIntoView({ block: 'nearest' }); },
    press: function (src) {
      var d = cur(), el = d ? picked(d) : null;
      if (!d) return;
      if (!el || el.tagName === 'TEXTAREA') { this.move(1); return; }
      pick(el);
      if (src === 'pad' && el.getAttribute('data-gate') && UA() && !active()) { why('A CONTROLLER PRESS IS NOT ENOUGH FOR YOUR BROWSER HERE: TAP OR CLICK THE BUTTON, OR PRESS ENTER.'); return; }
      el.click();
    },
    cancel: function () { if (!box.hidden) closeAsk(true); else P.closeHelp(); },
    key: function (e) {   // true: done here (the page's keydown then stops it)
      var typing = document.activeElement && document.activeElement.tagName === 'TEXTAREA', c = e.code;
      if (c === 'Escape') { this.cancel(); return true; }
      if (typing) return false;
      if (c === 'ArrowUp' || c === 'ArrowLeft' || c === 'KeyW' || c === 'KeyA') { this.move(-1); return true; }
      if (c === 'ArrowDown' || c === 'ArrowRight' || c === 'KeyS' || c === 'KeyD') { this.move(1); return true; }
      if (c === 'KeyZ' || c === 'KeyK') { this.press('key'); return true; }
      if (c === 'KeyX' || c === 'KeyJ') { this.cancel(); return true; }
      return false;
    }
  };
  // ---------- what the game asks ----------
  function saveFile() {
    if (!SV.any()) { reply('saveFile', false, 'NO SAVES YET: PLAY UNTIL A COFFEE MUG FIRST.'); return; }
    var phone = matchMedia('(pointer: coarse)').matches && navigator.canShare;
    function go() { SV.saveFile(function (ok, t) { closeAsk(false); reply('saveFile', ok, t); }); }
    if (!phone || active()) go();   // a computer downloads it at once; a phone's share sheet needs a real tap first
    else ask('saveFile', 'SAVE A BACKUP', 'YOUR BROWSER SAVES A FILE ONLY RIGHT AFTER A TAP, A CLICK OR A KEY.', [{ t: 'SAVE THE FILE', gate: 1, go: go }, { t: 'CANCEL', go: function () { closeAsk(true); } }]);
  }
  function copyCode() {
    SV.copyCode(function (ok, t, code) {
      if (ok || !code) { reply('copyCode', ok, t); return; }
      ask('copyCode', 'COPY A CODE', 'YOUR BROWSER COPIES ONLY RIGHT AFTER A TAP, A CLICK OR A KEY. COPY IT HERE, OR SELECT IT BY HAND.',
        [{ t: 'COPY', gate: 1, go: function () { SV.copyCode(function (ok2, t2) { if (ok2) { closeAsk(false); reply('copyCode', true, t2); } else { $('bqaskCode').select(); why('SELECT THE CODE AND COPY IT BY HAND.'); } }); } },
         { t: 'DONE', go: function () { closeAsk(false); reply('copyCode', true, 'THE CODE WAS SHOWN ON THE PAGE.'); } }], code);
    });
  }
  function toGame() { var f = function (lines) { say({ kind: 'restore', id: 'restore', lines: ['REPLACE THE SAVES IN THIS BROWSER WITH:'].concat(lines.map(words)) }); return true; }; f.bad = function () { reply('loadFile', false, 'THAT IS NOT A BATON QUEST SAVE.'); }; return f; }
  function loadFile() {
    function go() { closeAsk(false); SV.pick(toGame()); }
    if (active()) go();
    else ask('loadFile', 'FROM A FILE', 'YOUR BROWSER OPENS ITS FILE PICKER ONLY RIGHT AFTER A TAP, A CLICK OR A KEY.', [{ t: 'CHOOSE A FILE', gate: 1, go: go }, { t: 'CANCEL', go: function () { closeAsk(true); } }]);
  }
  function pasteCode() {   // typing needs a box to type in, so this one always shows the dialog
    ask('pasteCode', 'PASTE A CODE', 'PASTE OR TYPE THE CODE BELOW. YOUR BROWSER READS THE CLIPBOARD ONLY RIGHT AFTER A TAP, A CLICK OR A KEY; A CONTROLLER CANNOT TYPE.',
      [{ t: 'PASTE', gate: 1, go: function () { try { navigator.clipboard.readText().then(function (t) { $('bqaskCode').value = t; }, function () { why('YOUR BROWSER DID NOT LET THE PAGE READ IT: PASTE BY HAND.'); }); } catch (e) { why('PASTE BY HAND.'); } } },
       { t: 'RESTORE THIS CODE', go: function () { var t = $('bqaskCode').value; if (!SV.parse(t)) { why('THAT IS NOT A BATON QUEST SAVE.'); return; } closeAsk(false); SV.offer(t, toGame()); } },
       { t: 'CANCEL', go: function () { closeAsk(true); } }], '');
  }
  function act(id) {
    if (id === 'saveFile') saveFile();
    else if (id === 'copyCode') copyCode();
    else if (id === 'loadFile') loadFile();
    else if (id === 'pasteCode') pasteCode();
    else if (id === 'keep') SV.keep(function (ok, t) { reply('keep', ok, t); });
    else if (id === 'restoreYes') { var t = SV.restore(); P.note(t || 'NOTHING TO RESTORE', 3600); }   // the game opens again from the restored files
    else if (id === 'restoreNo') SV.drop();
    else if (id === 'manual') { try { A.stop(); } catch (e) {} location.href = 'manual.html'; }   // the game saves where it is as it closes
    else if (id === 'pageMenu') P.openHelp();
  }
  function setting(id, v) {
    if (id === 'sound') { P.sound(v === 'on'); if (v === 'on' && !P.running()) say({ kind: 'note', text: 'A BROWSER STARTS SOUND ONLY AFTER A TAP, A CLICK OR A KEY.' }); }
    else P.set(id, v);
    dirty = true;   // the game reads the page's settings again (its copy may differ from what the page could do)
  }
  function label() { btn.textContent = sys ? 'PAGE MENU' : 'MENU'; btn.setAttribute('aria-label', sys ? "The page's own menu" : 'Menu: settings, saves and help'); document.body.classList.toggle('sysup', sys); }
  window.BQ_BRIDGE = {
    frame: function () {   // pocket.js calls it after each frame: what the game asked, then one 'changed' if the page's settings or look moved
      var l = A.hostRead(), i, m, r = A.run();
      if (r !== run) { run = r; if (sys) { sys = false; label(); } }   // the game was closed or opened again (a restore, Esc): its SYSTEM screen is not up
      for (i = 0; i < l.length; i++) {
        m = l[i];
        if (m.kind === 'opened') { sys = true; label(); if (menuWait) { clearTimeout(menuWait); menuWait = null; } }
        else if (m.kind === 'shut') { sys = false; label(); }
        else if (m.kind === 'cannot') { if (menuWait) { clearTimeout(menuWait); menuWait = null; P.openHelp(); } }
        else if (m.kind === 'set') setting(String(m.id), String(m.v));
        else if (m.kind === 'act') act(String(m.id));
      }
      if (dirty) { dirty = false; say({ kind: 'changed' }); }
    },
    changed: function () { dirty = true; },
    menu: function () {   // the MENU button: the game's SYSTEM screen, or (while it is up) the page's own menu; true when it was handled here
      if (sys) { closeAsk(true); P.openHelp(); return true; }   // the small dialog, if it is up, steps aside for the page's menu
      if (A.current() !== 'quest' || menuWait) return !!menuWait;
      say({ kind: 'open' }); try { P.canvas.focus(); } catch (e) {}
      menuWait = setTimeout(function () { menuWait = null; P.openHelp(); }, 400);   // a game that does not answer (one without the bridge): the page's own menu
      return true;
    },
    escape: function () { if (!sys) return false; P.tap('b'); return true; },   // Esc on the game's SYSTEM screen is its B (MS Learn: Escape maps to B/Back)
    state: function () { return { sys: sys, ask: box.hidden ? '' : D.id, help: P.helpOpen() }; }   // for checks
  };
  label();
})();
