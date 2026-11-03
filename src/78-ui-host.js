    // ---------- 78-ui-host.js (B20 MENUS, 2 Nov): the game's half of the page bridge (QUEST-API.md part 22; the runtime's half is in the page's js/runtime.js) ----------
    // The game never touches the page. A page that wants to, gives the runtime a host, and the runtime gives the game api.host: info() (a plain copy of what
    // the page offers: its settings and its actions), send(msg) (a plain message to the page, handled after this frame) and read() (the page's messages since
    // the last read). Without a host (the office, the test page, node) api.host is missing, U.host.has() is false and no page row shows anywhere.
    // Messages from the page: open (its MENU button: show the SYSTEM screen), changed (read info again), reply / wait / note (an action's outcome, or the
    // words to show while the page's own small dialog is up), restore (a backup was read: ask NO or YES). U.hostFrame(dt) reads them once a frame (99-main.js).
    (function () {
      var U = Q.ui, H = U.host = { cache: null, cacheAt: -9, inbox: [] };
      function api() { return Q.api && Q.api.host && typeof Q.api.host.read === 'function' ? Q.api.host : null; }
      H.has = function () { var i = H.info(); return !!(i && i.v >= 1); };
      H.info = function (fresh) {   // the page's offer, read at most once a second unless asked fresh (a 'changed' message asks)
        var a = api(), now = U.now();
        if (!a) return null;
        if (fresh || !H.cache || now - H.cacheAt > 1 || now < H.cacheAt) { try { H.cache = a.info() || null; } catch (e) { H.cache = null; } H.cacheAt = now; }
        return H.cache;
      };
      H.can = function (id) { var i = H.info(), k; if (!i || !i.actions) return false; for (k = 0; k < i.actions.length; k++) if (i.actions[k].id === id) return true; return false; };
      H.send = function (msg) { var a = api(); if (!a) return false; try { return a.send(msg) !== false; } catch (e) { return false; } };
      H.set = function (id, v) {   // a setting changed in the game: the page applies it and keeps it; the copy here changes at once so the screen shows it
        var i = H.info(), k;
        if (i && i.settings) for (k = 0; k < i.settings.length; k++) if (i.settings[k].id === id) i.settings[k].now = v;
        return H.send({ kind: 'set', id: id, v: v });
      };
      H.act = function (id) { return H.send({ kind: 'act', id: id }); };
      H.open = function (o) {   // the SYSTEM screen, from a row (OPTIONS, the pause menu, the file screen) or from the page's MENU
        if (!Object.prototype.hasOwnProperty.call(Q.SCENE, 'system') || !H.has()) return false;
        Q.go('system', o || {}); return true;
      };
      function fromPage(tab) {   // the page's MENU button: the SYSTEM screen over wherever the game is, with the way back to it; or 'cannot' (the page shows its own menu)
        var sc = Q.scene, FE = U.fe, ph, it = '', o = null, l;
        if (sc === 'system') { H.send({ kind: 'opened' }); return; }
        if (sc === 'title' && FE && !FE.leave) {
          ph = FE.phase === 'boot' ? 'title' : FE.phase;
          if (ph === 'menu') { l = FE.items(); it = l[FE.sel] || ''; }
          else if (ph === 'options' && FE.ph.options) { l = FE.ph.options.items(); it = l[FE.osel] || ''; }
          else if (ph === 'extras' && FE.ph.extras) { l = FE.ph.extras.items(); it = l[FE.xsel] || ''; }
          o = { back: 'title', ph: ph, item: it };
        }
        else if ((sc === 'level' || sc === 'map') && !Q.talking()) { Q.go('pause', { from: sc }); if (Q.scene === 'pause') o = { back: 'pause', under: sc }; }
        else if (sc === 'pause') o = { back: 'pause', under: U.pauseFrom ? U.pauseFrom() : 'level' };
        else if (sc === 'files') o = { back: 'files' };
        if (o) { o.tab = tab || ''; o.page = true; if (H.open(o)) return; }
        H.send({ kind: 'cannot' });
      }
      U.hostFrame = function () {   // once a frame (99-main.js, after the steps): the page's messages
        var a = api(), list, i, m;
        if (!a) return;
        try { list = a.read() || []; } catch (e) { list = []; }
        for (i = 0; i < list.length; i++) {
          m = list[i]; if (!m || typeof m !== 'object') continue;
          if (m.kind === 'open') fromPage(m.tab);
          else if (m.kind === 'restore' && Q.scene !== 'system') { fromPage('saves'); if (Q.scene === 'system' && U.sys && U.sys.news) U.sys.news(m); }   // a backup read while the screen was shut: open it to ask
          else if (m.kind === 'changed') H.info(true);
          else if (Q.scene === 'system' && U.sys && U.sys.news) U.sys.news(m);   // reply, wait, note, restore: for the SYSTEM screen
          else if (m.text && (m.kind === 'reply' || m.kind === 'note')) Q.toast(String(m.text), 3);   // it finished after the screen was left: a toast
        }
      };
    })();
