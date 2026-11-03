// Baton Quest's saves, for the web page: a backup of all three files (a file to keep, or a text code to paste on another device), restoring one
// (it asks first and keeps what it replaced), and asking the browser to keep the saves (WebKit grants that mostly to a web app on the home screen).
// It adds its own SAVES section and a MANUAL link to the page's MENU. The game keeps its three files in this browser's storage under nf-arcade-quest
// (one bundle: { files3, cur, files: [three saves or null] }); a save from before the three files is one plain save, and the game reads either.
(function () {
  'use strict';
  var KEY = 'nf-arcade-quest', BEFORE = 'nf-arcade-quest-before-restore', CODE = 'BQ1:';
  var $ = function (id) { return document.getElementById(id); };
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function stamp() { var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }; return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()); }
  function toCode(text) { return CODE + btoa(unescape(encodeURIComponent(text))); }
  function fromCode(s) { s = String(s || '').trim(); if (s.indexOf(CODE) === 0) s = decodeURIComponent(escape(atob(s.slice(CODE.length).replace(/\s+/g, '')))); return s; }
  function bundleOf(obj) {   // what a backup holds, as the game's bundle (or null if it is not a Baton Quest save)
    if (!obj || typeof obj !== 'object') return null;
    if (obj.files3 && obj.files && obj.files.length === 3) return obj;
    if (obj.v === 1) return { files3: 1, cur: 0, files: [obj, null, null] };   // one save from before the three files
    return null;
  }
  function used(s) { return !!(s && typeof s === 'object' && (s.v || s.at || s.time > 0)); }
  function describe(b) {
    var out = [], i, s, n, k;
    for (i = 0; i < 3; i++) {
      s = b.files[i];
      if (!used(s)) { out.push('FILE ' + (i + 1) + ': EMPTY'); continue; }
      n = 0; if (s.stars) for (k in s.stars) if (Object.prototype.hasOwnProperty.call(s.stars, k) && s.stars[k]) n++;
      out.push('FILE ' + (i + 1) + ': LV ' + (s.lv || 1) + ', ' + Object.keys(s.cleared || {}).length + ' CLEARED, ' + n + ' STARS');
    }
    return out.join(' · ');
  }
  function msg(t) { var m = $('saveMsg'); if (m) m.textContent = t; }

  // ---------- the MENU's SAVES section and the MANUAL link (added here, so the page's own files stay as they are) ----------
  var card = document.querySelector('#help .card'), how = null, hs = card ? card.querySelectorAll('h2') : [], i;
  for (i = 0; i < hs.length; i++) if (/HOW TO PLAY/.test(hs[i].textContent)) how = hs[i];
  if (!card || !how) return;
  var sec = document.createElement('div');
  sec.innerHTML = '<h2>SAVES</h2>' +
    '<div class="set"><div class="row"><span>BACKUP</span><div class="seg"><button type="button" id="saveOut">SAVE TO A FILE</button><button type="button" id="saveCopy">COPY A CODE</button></div></div>' +
    '<div class="row"><span>RESTORE</span><div class="seg"><button type="button" id="saveIn">FROM A FILE</button><button type="button" id="savePaste">PASTE A CODE</button></div></div>' +
    '<div class="row"><span>KEEP</span><div class="seg"><button type="button" id="saveKeep">KEEP MY SAVES</button></div></div></div>' +
    '<div id="pasteBox" hidden><textarea id="pasteText" rows="3" style="width:100%;font:12px monospace;border-radius:8px;border:1px solid #cfc3aa;padding:6px" aria-label="A save code"></textarea>' +
    '<div class="seg" style="margin:6px 0"><button type="button" id="pasteGo">RESTORE THIS CODE</button></div></div>' +
    '<div id="askBox" hidden><p class="small" id="askText"></p><div class="seg" style="margin-bottom:8px"><button type="button" id="askNo">NO, KEEP MINE</button><button type="button" id="askYes">YES, REPLACE</button></div></div>' +
    '<input type="file" id="saveFile" accept=".json,.txt,application/json,text/plain" hidden>' +
    '<p class="small" id="saveMsg">Your three files live in this browser. A backup keeps them safe if the browser ever clears its data, and moves them to another phone or computer.</p>' +
    '<h2>MANUAL</h2><p class="small"><a href="manual.html">Open the instruction booklet</a>: the story, the cast, the controls, the worlds and a secret or two.</p>';
  card.insertBefore(sec, how);

  // ---------- backup: a file, or a code ----------
  $('saveOut').addEventListener('click', function () {
    var text = read(); if (!text) { msg('NO SAVES YET: play until a coffee mug first.'); return; }
    var name = 'baton-quest-saves-' + stamp() + '.json', blob = new Blob([text], { type: 'application/json' });
    try {
      if (matchMedia('(pointer: coarse)').matches && navigator.canShare && navigator.share && window.File && navigator.canShare({ files: [new File([blob], name, { type: 'application/json' })] })) {
        navigator.share({ files: [new File([blob], name, { type: 'application/json' })], title: 'Baton Quest saves' }).then(function () { msg('SAVED: ' + name); }, function () {}); return;
      }
    } catch (e) {}
    var url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000); msg('SAVED: ' + name + ' (in your downloads).');
  });
  $('saveCopy').addEventListener('click', function () {
    var text = read(); if (!text) { msg('NO SAVES YET: play until a coffee mug first.'); return; }
    var code = toCode(text);
    function shown() { $('pasteBox').hidden = false; $('pasteText').value = code; $('pasteText').select(); }
    try { navigator.clipboard.writeText(code).then(function () { msg('CODE COPIED (' + code.length + ' letters). Paste it somewhere safe, or into PASTE A CODE on another device.'); }, function () { shown(); msg('COPY THE CODE BELOW.'); }); }
    catch (e) { shown(); msg('COPY THE CODE BELOW.'); }
  });

  // ---------- restore: it asks first, keeps what it replaced, then starts the game again from the restored files ----------
  var pending = null;
  function offer(text) {
    var obj = null, b;
    try { obj = JSON.parse(fromCode(text)); } catch (e) { obj = null; }
    b = bundleOf(obj);
    if (!b) { msg('THAT IS NOT A BATON QUEST SAVE.'); return; }
    pending = b; $('askText').textContent = 'REPLACE THE SAVES IN THIS BROWSER WITH: ' + describe(b) + '?'; $('askBox').hidden = false; $('askNo').focus();
  }
  $('saveIn').addEventListener('click', function () { $('saveFile').value = ''; $('saveFile').click(); });
  $('saveFile').addEventListener('change', function () {
    var f = this.files && this.files[0]; if (!f) return;
    var r = new FileReader(); r.onload = function () { offer(String(r.result || '')); }; r.onerror = function () { msg('COULD NOT READ THAT FILE.'); }; r.readAsText(f);
  });
  $('savePaste').addEventListener('click', function () { $('pasteBox').hidden = false; $('pasteText').value = ''; $('pasteText').focus(); });
  $('pasteGo').addEventListener('click', function () { offer($('pasteText').value); });
  $('askNo').addEventListener('click', function () { pending = null; $('askBox').hidden = true; msg('NOTHING CHANGED.'); });
  $('askYes').addEventListener('click', function () {
    if (!pending) return;
    var A = window.NFX && window.NFX.arcade, old = read();
    try { if (A) A.stop(); } catch (e) {}   // first the game saves where it is and closes, so it cannot write over the restored files
    try { if (old) localStorage.setItem(BEFORE, old); localStorage.setItem(KEY, JSON.stringify(pending)); } catch (e) { msg('COULD NOT SAVE IN THIS BROWSER.'); return; }
    pending = null; $('askBox').hidden = true; $('pasteBox').hidden = true;
    try { if (A) A.open('quest'); } catch (e) {}
    msg('RESTORED. The saves it replaced are kept in this browser too, in case.');
  });

  // ---------- keep: ask the browser not to clear the saves ----------
  function keepAsk(quiet) {
    if (!navigator.storage || !navigator.storage.persist) { if (!quiet) msg('THIS BROWSER CANNOT PROMISE IT. A BACKUP IS THE SAFE WAY.'); return; }
    navigator.storage.persisted().then(function (p) { return p || navigator.storage.persist(); }).then(function (ok) {
      if (!quiet) msg(ok ? 'THIS BROWSER WILL KEEP YOUR SAVES.' : 'THIS BROWSER DID NOT PROMISE. ON A PHONE, ADD IT TO THE HOME SCREEN, AND KEEP A BACKUP.');
    }, function () {});
  }
  $('saveKeep').addEventListener('click', function () { keepAsk(false); });
  try { if (navigator.standalone || matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches) keepAsk(true); } catch (e) {}   // a home screen web app: ask quietly at the start
  window.BQ_SAVES = { code: function () { var t = read(); return t ? toCode(t) : ''; }, offer: offer };   // for checks
})();
