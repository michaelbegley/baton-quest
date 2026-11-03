    // ---------- 72-ui-front-menus.js (B17 FRONT END, 2 Nov): the title scene's OPTIONS and EXTRAS screens (72-ui-title.js has the scene) ----------
    // OPTIONS: MUSIC (FULL, LOW, OFF: the pause menu's own setting, U.setMusic), TEXT (NORMAL, FAST), BOW TIE (once bought), STOPWATCH (ON, OFF: B19's,
    // 79-ui-watch.js), CONTROLS (the keys, the touch buttons and a controller: 72-ui-front-controls.js). Each setting goes into the current file's save at once
    // (U.setOpt), like the pause menu's.
    // EXTRAS: CODEX, STARS (the codex's GOLD STARS page), CREDITS, then once the game is won THE ENDING and HOLD MUSIC (the codex's jukebox). The codex opened
    // from here comes back here: its B and Start, only while it was opened from EXTRAS, return to the title (a hook on the codex scene, set once).
    // Up and down choose, left and right change a setting, A chooses, B goes back to the main menu.
    (function () {
      var U = Q.ui, FE = U.fe || (U.fe = { ph: {} }), BX = 124, BW = 188, TOP = 106, ROW = 11;
      var MUS = ['FULL', 'LOW', 'OFF'];
      FE.move = function (sel, n) {   // up and down, round and round: one press, one step (FE.press: never in a frame that changed the screen)
        if (FE.press('up')) { sel = (sel + n - 1) % n; Q.sfx('move'); }
        if (FE.press('down')) { sel = (sel + 1) % n; Q.sfx('move'); }
        return sel;
      };
      FE.panel = function (g, title, list, sel, value, count) {   // the right-hand box of a menu screen: its name, then its rows (a value or a count at the right)
        var n = list.length, i, y, on, v;
        U.box(g, BX, TOP, BW, (n + 1) * ROW + 6, '#2ec4b6', '#12141c');
        U.text(title, BX + 10, TOP + 5, '#2ec4b6'); U.fill(g, BX + 8, TOP + 14, BW - 16, 1, '#2a2c3a');
        for (i = 0; i < n; i++) {
          y = TOP + 5 + (i + 1) * ROW; on = i === sel;
          if (on) U.fill(g, BX + 3, y - 2, BW - 6, ROW, '#262838');
          U.item(list[i], BX + 16, y, on);
          v = value ? value(list[i]) : '';
          if (v) { U.text(v, BX + BW - 18, y, on ? '#ffd23f' : '#c3c7d4', 1, 'right'); if (on && Math.floor(U.now() * 2.5) % 3) { U.text('<', BX + BW - 26 - U.width(v), y, '#ffd23f'); U.text('>', BX + BW - 12, y, '#ffd23f'); } }
          else if (count) { v = count(list[i]); if (v) U.text(v, BX + BW - 10, y, on ? '#ffd23f' : '#8a93a8', 1, 'right'); }
        }
      };
      // ---- OPTIONS ----
      function tie() { return !!(Q.SAVE && Q.SAVE.shop && Q.SAVE.shop.bowtie); }
      function optValue(it) {
        if (it === 'MUSIC') return U.musicOpt ? U.musicOpt() : 'FULL';
        if (it === 'TEXT') return U.textFast && U.textFast() ? 'FAST' : 'NORMAL';
        if (it === 'BOW TIE') return U.tieOpt ? U.tieOpt() : 'GOLD';
        if (it === 'STOPWATCH') return U.watchOn && U.watchOn() ? 'ON' : 'OFF';
        return '';
      }
      function change(it, d) {   // one setting one step (d: 1 on, -1 back); into the save at once
        if (it === 'MUSIC' && U.setMusic && U.musicOpt) U.setMusic(MUS[(MUS.indexOf(U.musicOpt()) + (d > 0 ? 1 : 2)) % 3]);
        else if (it === 'TEXT' && U.setOpt) U.setOpt('text', U.textFast() ? 'normal' : 'fast');
        else if (it === 'BOW TIE' && U.setOpt) U.setOpt('bowtie', U.tieOpt() === 'GOLD' ? 'white' : 'gold');
        else if (it === 'STOPWATCH' && U.setOpt && U.watchOn) U.setOpt('watch', U.watchOn() ? 'off' : 'on');
        else return false;
        return true;
      }
      FE.ph.options = {
        items: function () { var l = ['MUSIC', 'TEXT']; if (tie()) l.push('BOW TIE'); if (U.watchOn) l.push('STOPWATCH'); l.push('CONTROLS'); return l; },
        enter: function (sel) { var l = FE.ph.options.items(), i = typeof sel === 'string' ? FE.find(l, sel) : sel; FE.osel = i >= 0 ? i : 0; },
        update: function () {
          var l = FE.ph.options.items(), it;
          if (FE.press('b')) { Q.sfx('back'); FE.to('menu', FE.find(FE.items(), 'OPTIONS')); return; }
          FE.osel = FE.move(Math.min(FE.osel, l.length - 1), l.length);
          it = l[FE.osel];
          if (FE.press('left')) { if (change(it, -1)) Q.sfx('move'); }
          else if (FE.press('right')) { if (change(it, 1)) Q.sfx('move'); }
          if (FE.press('a') || FE.press('start')) {
            if (it === 'CONTROLS') { Q.sfx('select'); FE.to('controls', 0); }
            else if (change(it, 1)) Q.sfx('select');
          }
        },
        draw: function (g) {
          var l = FE.ph.options.items(), it = l[Math.min(FE.osel, l.length - 1)];
          FE.panel(g, 'OPTIONS', l, FE.osel, optValue);
          FE.foot(it === 'MUSIC' ? 'FULL, LOW OR OFF (THE PAUSE MENU TOO)' : it === 'TEXT' ? 'HOW FAST THE TEXT BOX TYPES' : it === 'BOW TIE' ? 'GOLD, OR THE WHITE IT WAS' : it === 'STOPWATCH' ? 'YOUR PLAY TIME, IN A CORNER' : 'THE KEYS, TOUCH AND A CONTROLLER', 'B: BACK');
        }
      };
      // ---- EXTRAS ----
      function won() { return !!(Q.SAVE && Q.SAVE.won); }
      function hook() {   // the codex (75-ui-codex.js) goes back to the pause on B; opened from EXTRAS (its from: 'title'), its B and Start come back here instead (its own file is unchanged)
        var sc = Object.prototype.hasOwnProperty.call(Q.SCENE, 'codex') ? Q.SCENE.codex : null, up0, en0;
        if (!sc || sc.feBack || !sc.update) return;
        up0 = sc.update; en0 = sc.enter; sc.feBack = true;
        sc.enter = function (opts, Qx) { FE.inCodex = !!(opts && opts.from === 'title'); if (en0) return en0.call(sc, opts, Qx); };   // only a codex opened from the title comes back to it
        sc.update = function (dt, Qx) {
          var at;
          if (FE.inCodex && Q.scene === 'codex' && !Q.talking()) {
            at = U.codexAt ? U.codexAt() : null;
            if (!(at && at.read) && (U.press('b') || U.press('start'))) { FE.inCodex = false; Q.sfx('back'); Q.go('title', { ph: 'extras', back: FE.codexItem || 'CODEX' }); return; }
          }
          return up0.call(sc, dt, Qx);
        };
      }
      function codex(sec, item) {
        if (!Object.prototype.hasOwnProperty.call(Q.SCENE, 'codex')) { Q.sfx('nope'); return; }
        hook(); FE.codexItem = item; Q.sfx('select');
        Q.go('codex', { from: 'title' });
        if (sec !== 'memos' && U.codexGo) U.codexGo(sec, 0);   // straight to its page
      }
      FE.ph.extras = {
        items: function () { var l = ['CODEX', 'STARS', 'CREDITS']; if (won()) l.push('THE ENDING', 'HOLD MUSIC'); return l; },
        enter: function (sel) { var l = FE.ph.extras.items(), i = typeof sel === 'string' ? FE.find(l, sel) : sel; FE.xsel = i >= 0 ? i : 0; },
        update: function () {
          var l = FE.ph.extras.items(), it;
          if (FE.press('b')) { Q.sfx('back'); FE.to('menu', FE.find(FE.items(), 'EXTRAS')); return; }
          FE.xsel = FE.move(Math.min(FE.xsel, l.length - 1), l.length);
          if (!(FE.press('a') || FE.press('start'))) return;
          it = l[FE.xsel];
          if (it === 'CODEX') codex('memos', it);
          else if (it === 'STARS') codex('stars', it);
          else if (it === 'HOLD MUSIC') codex('music', it);
          else if (it === 'CREDITS') FE.go('credits');
          else if (it === 'THE ENDING') FE.go('ending');
        },
        draw: function (g) {
          var l = FE.ph.extras.items(), it = l[Math.min(FE.xsel, l.length - 1)], c = U.starCount ? U.starCount() : { n: 0, all: 32 };
          FE.panel(g, 'EXTRAS', l, FE.xsel, null, function (x) {
            if (x === 'CODEX') return 'MEMOS ' + (U.memoCount ? U.memoCount(Q.SAVE) : 0) + '/24';
            if (x === 'STARS') return c.n + '/' + c.all;
            return '';
          });
          FE.foot(it === 'CODEX' ? 'THE MEMOS, THE BESTIARY, THE TIMES' : it === 'STARS' ? 'THE ' + c.all + ' GOLD STARS' : it === 'CREDITS' ? 'WHO MADE IT, AND THE NUMBERS' : it === 'THE ENDING' ? 'SEE THE ENDING AGAIN' : 'EVERY SONG IN THE GAME', 'B: BACK');
        }
      };
    })();
