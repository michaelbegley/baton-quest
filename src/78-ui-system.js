    // ---------- 78-ui-system.js (B20 MENUS, 2 Nov): the SYSTEM screen, the page's own settings, saves and manual inside the game (78-ui-host.js is the bridge) ----------
    // Reached from OPTIONS, the pause menu and the file screen (only where a page offers its bridge), and opened by the page's MENU button. Its tabs are what
    // the page offers: SETTINGS (left and right, or A, change one; the page applies it and keeps it where it always has), SAVES and MORE (A asks the page).
    // Up and down move (the tab bar is the first stop; the list wraps round), C goes to the next tab, B goes back the way it came. Where a browser allows
    // something only right after a real tap or key press, the page says so and finishes it in its own small dialog; the line under the list says so plainly.
    // A backup read in is asked about here, NO first. THE MANUAL from a level asks first and saves the game before the page opens the booklet.
    (function () {
      var U = Q.ui, SY = U.sys = { o: {}, tab: 0, sel: 0, status: '', statusAt: -9, tone: 'plain', ask: null, askSel: 0 };
      var NAMES = { settings: 'SETTINGS', saves: 'SAVES', more: 'MORE' }, FOOT = { settings: 'KEPT IN THIS BROWSER', saves: 'YOUR THREE FILES', more: '' };
      function info() { return U.host ? U.host.info() : null; }
      function tabs() {   // SETTINGS when the page has settings, then a tab per group of its actions (saves, more)
        var i = info(), out = [], has = {}, k;
        if (!i) return out;
        if (i.settings && i.settings.length) out.push('settings');
        for (k = 0; i.actions && k < i.actions.length; k++) has[i.actions[k].group || 'more'] = true;
        if (has.saves) out.push('saves');
        if (has.more) out.push('more');
        return out;
      }
      SY.tabs = tabs;
      function choiceName(s) { var c = s.choices || [], k; for (k = 0; k < c.length; k++) if (c[k][0] === s.now) return String(c[k][1]); return String(s.now || '').toUpperCase(); }
      function rowsOf(t) {
        var i = info(), out = [], k, s;
        if (!i) return out;
        if (t === 'settings') for (k = 0; k < i.settings.length; k++) { s = i.settings[k]; out.push({ label: String(s.name).toUpperCase(), value: choiceName(s), off: s.live === false, note: s.live === false && s.why ? s.why : s.note, set: s }); }
        else for (k = 0; i.actions && k < i.actions.length; k++) { s = i.actions[k]; if ((s.group || 'more') === t) out.push({ label: String(s.name).toUpperCase(), note: s.note, act: s }); }
        return out;
      }
      SY.rows = function () { var t = tabs(); return t.length ? rowsOf(t[Math.min(SY.tab, t.length - 1)]) : []; };
      function step(s, d) {   // the next (d 1) or the one before (d -1) of a setting's choices, sent to the page
        var c = s.choices || [], k, i = 0;
        if (!c.length) return false;
        for (k = 0; k < c.length; k++) if (c[k][0] === s.now) i = k;
        i = (i + (d > 0 ? 1 : c.length - 1)) % c.length;
        return U.host.set(s.id, c[i][0]);
      }
      function say(text, tone) { SY.status = String(text || ''); SY.statusAt = U.now(); SY.tone = tone || 'plain'; }
      SY.news = function (m) {   // from the page, through 78-ui-host.js
        if (m.kind === 'restore') { SY.ask = { id: 'restore', title: 'RESTORE', lines: [].concat(m.lines || [m.text || 'REPLACE THE SAVES IN THIS BROWSER?']) }; SY.askSel = 0; U.mk.snd('open'); say('', 'plain'); return; }
        if (m.kind === 'wait') { say(m.text || 'FINISH IT IN THE BOX ON THE PAGE.', 'wait'); return; }
        if (m.kind === 'reply') { say(m.text || (m.ok ? 'DONE.' : 'THAT DID NOT WORK.'), m.ok ? 'ok' : 'bad'); U.mk.snd(m.ok ? 'pick' : 'no'); return; }
        if (m.kind === 'note' && m.text) say(m.text, 'plain');
      };
      SY.at = function () { var t = tabs(); return { tab: t[SY.tab] || '', tabs: t, sel: SY.sel, rows: SY.rows().map(function (r) { return r.label + (r.value ? '=' + r.value : ''); }), status: SY.status, ask: SY.ask ? SY.ask.id : '', o: SY.o }; };   // for checks
      function goBack() {   // the way it came: the pause menu (on SYSTEM), the title (on that screen and row), the file screen
        var o = SY.o;
        U.mk.snd('back');
        if (o.back === 'pause') Q.go('pause', { from: o.under || 'level', back: 'system' });
        else if (o.back === 'files') Q.go('files', { back: o.item || '' });
        else Q.go('title', { ph: o.ph || 'options', back: o.item || 'SYSTEM' });
      }
      function act(r) {
        var a = r.act;
        if (a.id === 'manual' && Q.level && SY.o.back === 'pause') { SY.ask = { id: 'manual', title: 'THE MANUAL', lines: ['THE BOOKLET OPENS IN THIS TAB.', 'YOUR GAME IS SAVED FIRST.'] }; SY.askSel = 0; U.mk.snd('open'); return; }
        U.mk.snd('pick'); say(a.asking || 'ASKING THE PAGE...', 'wait'); U.host.act(a.id);
      }
      function answer(yes) {
        var k = SY.ask; SY.ask = null;
        if (k.id === 'manual') { if (yes) { Q.saveGame(); U.mk.snd('pick'); say('OPENING THE BOOKLET...', 'wait'); U.host.act('manual'); } else U.mk.snd('back'); return; }
        U.mk.snd(yes ? 'pick' : 'back'); U.host.act(yes ? 'restoreYes' : 'restoreNo'); say(yes ? 'RESTORING: THE GAME STARTS AGAIN FROM IT.' : 'NOTHING CHANGED.', yes ? 'wait' : 'plain');
      }
      Q.defScene('system', {
        wide: true,   // the scene it came from at the screen's width under a veil, the window in the centred 320 column
        enter: function (o) {
          var t, k;
          U.entered();
          SY.o = o || {}; SY.ask = null; SY.status = ''; SY.sel = 0;
          if (U.host) U.host.info(true);
          t = tabs(); k = t.indexOf(SY.o.tab); SY.tab = k >= 0 ? k : 0;
          if (U.host) U.host.send({ kind: 'opened' });
        },
        update: function () {
          var t = tabs(), rows, r, n, d;
          if (U.runLater()) return;
          if (!t.length) { goBack(); return; }   // the page offers nothing (any more)
          if (SY.tab >= t.length) SY.tab = 0;
          rows = rowsOf(t[SY.tab]); n = rows.length;
          if (SY.ask) {   // NO is the default; any arrow switches
            if (U.press('left') || U.press('right') || U.press('up') || U.press('down')) { SY.askSel = 1 - SY.askSel; U.mk.snd('move'); }
            if (U.press('b')) { answer(false); return; }
            if (U.press('a') || U.press('start')) answer(SY.askSel === 1);
            return;
          }
          if (U.press('b')) { goBack(); return; }
          if (U.press('c')) { SY.tab = (SY.tab + 1) % t.length; SY.sel = 0; U.mk.snd('tab'); return; }
          if (U.press('up')) { SY.sel = SY.sel <= -1 ? n - 1 : SY.sel - 1; U.mk.snd('move'); }
          else if (U.press('down')) { SY.sel = SY.sel >= n - 1 ? -1 : SY.sel + 1; U.mk.snd('move'); }
          if (SY.sel >= n) SY.sel = n - 1;
          if (SY.sel < 0) {   // on the tab bar: left and right change the tab, A goes into its list
            if (U.press('left')) { SY.tab = (SY.tab + t.length - 1) % t.length; U.mk.snd('tab'); }
            else if (U.press('right')) { SY.tab = (SY.tab + 1) % t.length; U.mk.snd('tab'); }
            if (U.press('a') || U.press('start')) { SY.sel = 0; U.mk.snd('move'); }
            return;
          }
          r = rows[SY.sel]; if (!r) return;
          d = U.press('left') ? -1 : U.press('right') ? 1 : 0;
          if (r.set && d) { if (r.off) U.mk.snd('no'); else if (step(r.set, d)) U.mk.snd('value'); }
          if (U.press('a') || U.press('start')) {
            if (r.set) { if (r.off) U.mk.snd('no'); else if (step(r.set, 1)) U.mk.snd('value'); }
            else if (r.act) act(r);
          }
        },
        draw: function (g) {
          var C = U.mk.C;
          U.under(g, SY.o.back === 'title' ? 'title' : SY.o.back === 'files' ? 'files' : (SY.o.under || 'level'));
          U.fill(g, 0, 179, Q.W, 21, C.foot); U.fill(g, 0, 179, Q.W, 1, C.hi);
          Q.col(g, systemDraw);
          U.drawTalk(g);
        },
        leave: function () { if (U.host) U.host.send({ kind: 'shut' }); }
      });
      function systemDraw(g) {
        var K = U.mk, C = K.C, t = tabs(), names = [], i, rows = SY.rows(), cur, fresh = SY.status && U.now() - SY.statusAt < 9, help, col;
        for (i = 0; i < t.length; i++) names.push(NAMES[t[i]] || String(t[i]).toUpperCase());
        K.window(g, 4, 4, 312, 172, 'SYSTEM', 'sys', function () {
          K.tabs(g, 12, 22, 296, names, SY.tab, SY.sel < 0 && !SY.ask);
          K.list(g, 4, 39, 312, rows, SY.ask || SY.sel < 0 ? -1 : SY.sel, 'sys-' + (t[SY.tab] || ''), { pad: 16, right: 12 });
          cur = SY.sel >= 0 ? rows[SY.sel] : null;
          help = fresh ? SY.status : cur ? cur.note : 'LEFT AND RIGHT: THE TABS. DOWN OR A: INTO THE LIST.';
          col = fresh ? (SY.tone === 'bad' ? '#ff9a9a' : SY.tone === 'ok' ? C.teal : SY.tone === 'wait' ? C.yel : C.help) : C.help;
          K.help(g, 4, 140, 312, help, col);
        });
        K.foot(g, (info() && info().where) || FOOT[t[SY.tab]] || '', 'C: TAB  A: OK  B: BACK');
        if (SY.ask) K.ask(g, 'sys-ask', SY.ask.title, SY.ask.lines, ['NO', 'YES'], SY.askSel, { danger: SY.ask.id !== 'manual' });
      }
    })();
