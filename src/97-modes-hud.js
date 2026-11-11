    // ---------- 97-modes-hud.js (B27 GAME MODES, 11 Nov): what a run shows: its plate over the level, its own pause, and the small kit its screens share ----------
    // The plate: the bottom right of the screen (any width), drawn after the HUD so a text box covers it. SPEED RUN: the stage (1-2  2/4) over the run's
    // clock (m:ss.c, twice the size), and for 3 s after a split its difference from the best run's (green ahead, red behind, gold for a best segment).
    // HIGH SCORE: the multiplier, the combo's progress to the next and the tries left, over the score (seven figures, twice the size); a gain floats above.
    // 'mpause' (a run's START): the level under a veil, RESUME, RESTART and QUIT (both ask first; QUIT keeps nothing of the run), and the run so far.
    // Screens share: U.mdTime, U.mdDelta, U.mdScore, U.mdLabel, U.mdMedal, U.mdBack (the battle menus' night sky and header) and U.mdSides (a wide screen).
    (function () {
      var U = Q.ui, MDM = { col: ['#3c4160', '#c77b3a', '#c9d3e3', '#ffd23f'], hi: ['#5d6378', '#f3b17a', '#ffffff', '#fff3c4'], name: ['NO MEDAL', 'BRONZE', 'SILVER', 'GOLD'] }, warned = false;
      U.mdTime = function (secs, tenths) {   // m:ss.cc (tenths: m:ss.c); from an hour, h:mm:ss.cc. Cut, not rounded, as a stopwatch reads
        var c = Math.floor(Math.max(0, +secs || 0) * 100 + 1e-6), h = Math.floor(c / 360000), m = Math.floor(c / 6000) % 60, s = Math.floor(c / 100) % 60, f = c % 100;
        return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s < 10 ? '0' : '') + s + (tenths ? '.' + Math.floor(f / 10) : '.' + (f < 10 ? '0' : '') + f);
      };
      U.mdDelta = function (d) {   // a split against the best: -1.23 ahead, +0.85 behind; from a minute, m:ss.cc
        var a = Math.abs(+d || 0), c = Math.floor(a * 100 + 1e-6), sg = d < 0 ? '-' : '+';
        return c < 6000 ? sg + Math.floor(c / 100) + '.' + (c % 100 < 10 ? '0' : '') + (c % 100) : sg + U.mdTime(a);
      };
      U.mdScore = function (n) { var s = String(Math.max(0, Math.min(9999999, Math.floor(+n || 0)))); while (s.length < 7) s = '0' + s; return s; };
      U.mdLabel = function (id) {   // a stage's number: 1-2, or 1-BOSS
        var L = engOwn(Q.LEVEL, id) ? Q.LEVEL[id] : null, w = L ? Q.WORLD[L.world] : null, i;
        if (!L) return String(id || '').toUpperCase();
        if (L.boss || (w && w.boss === id)) return L.world + '-BOSS';
        i = w && w.levels ? w.levels.indexOf(id) : -1;
        return L.world + '-' + (i >= 0 ? i + 1 : '?');
      };
      U.mdName = function (id) { var L = engOwn(Q.LEVEL, id) ? Q.LEVEL[id] : null; return L && L.name ? String(L.name).toUpperCase() : String(id || '').toUpperCase(); };
      U.mdFit = function (s, n) { var l; s = String(s || ''); if (s.length <= n) return s; l = Q.wrap(s, n); return l.length && l[0].length <= n ? l[0] : s.slice(0, n); };   // whole words in n letters
      U.mdMedalName = function (m) { return MDM.name[m | 0] || ''; };
      U.mdMedalCol = function (m) { return MDM.col[m | 0] || MDM.col[0]; };
      U.mdMedal = function (g, x, y, m) {   // a 9 by 11 medal: its ribbon (red and blue), then the disc in its metal with a shine; none: a dim empty one
        var r = [3, 5, 7, 7, 7, 5, 3], i, c = MDM.col[m | 0] || MDM.col[0];
        U.fill(g, x + 1, y, 3, 3, '#0b0c10'); U.fill(g, x + 5, y, 3, 3, '#0b0c10');
        U.fill(g, x + 2, y, 1, 3, m ? '#e0443a' : '#2a2c3a'); U.fill(g, x + 6, y, 1, 3, m ? '#2f7de1' : '#2a2c3a');
        for (i = 0; i < 7; i++) U.fill(g, x + ((9 - r[i]) >> 1) - 1, y + 3 + i, r[i] + 2, 1, '#0b0c10');
        U.fill(g, x + 3, y + 2, 3, 1, '#0b0c10'); U.fill(g, x + 3, y + 10, 3, 1, '#0b0c10');
        for (i = 0; i < 7; i++) U.fill(g, x + ((9 - r[i]) >> 1), y + 3 + i, r[i], 1, c);
        if (m) { U.fill(g, x + 3, y + 4, 2, 1, MDM.hi[m]); U.fill(g, x + 2, y + 5, 1, 2, MDM.hi[m]); }
      };
      U.mdBack = function (g, t, title) { BT.backdrop(g, t); if (title) BT.head(g, title); };   // GAME MODES' own night sky, its header in big letters
      U.mdSides = function (g) {   // a wide screen's sides: the same sky and stars, the kit's foot band carried out
        var C = U.mk.C;
        BT.sides(g); U.fill(g, 0, 179, Q.W, 15, C.foot); U.fill(g, 0, 179, Q.W, 1, C.hi); U.fill(g, 0, 194, Q.W, 6, BT.SKY[BT.SKY.length - 1]);
      };
      U.mdChoices = function (g, x, y, w, list, sel) {   // a row of choices, the picked one on the kit's yellow bar (as the kit's questions draw theirs)
        var K = U.mk, cw = Math.floor(w / list.length), i;
        if (sel >= 0) K.bar(g, x + sel * cw + 3, y, cw - 6);
        for (i = 0; i < list.length; i++) U.item(list[i], x + i * cw + (cw >> 1), y, i === sel, false, 'center', 1, 'bar');
      };

      // ---------- the plate ----------
      function box(g, x, y, w, h, edge) { U.fill(g, x, y, w, h, edge || '#3a3d52'); U.fill(g, x + 1, y + 1, w - 2, h - 2, '#121318'); }
      function speedPlate(g, R) {
        var tm = U.mdTime(R.t, true), lab = U.mdLabel(R.route.stages[R.i]) + '  ' + (R.i + 1) + '/' + R.route.stages.length, d = R.st.delta, now = U.now();
        var w = Math.max(U.width(tm, 2), U.width(lab)) + 8, h = 29, x = Q.W - 2 - w, y = 198 - h, dw;
        box(g, x, y, w, h);
        U.text(lab, x + 4, y + 3, '#8f9ac8'); U.text(tm, x + 4, y + 12, R.live ? '#e8f0ff' : '#ffd23f', 2);
        if (d && now - d.at < 3) {   // the split just taken, on a tab above the plate
          dw = U.width(d.s) + 8; box(g, Q.W - 2 - dw, y - 10, dw, 11, d.col);
          U.text(d.s, Q.W - 2 - dw + 4, y - 8, d.col);
        }
      }
      function scorePlate(g, R) {
        var S = R.st, sc = U.mdScore(S.score), mul = 'X' + S.mult, w = U.width(sc, 2) + 8, h = 29, x = Q.W - 2 - w, y = 198 - h, i, pip = S.combo % 5, tr = 'TRIES ' + S.tries, gw;
        box(g, x, y, w, h, S.mult > 1 ? '#c99a12' : '#3a3d52');
        U.text(mul, x + 4, y + 3, S.mult > 1 ? '#ffd23f' : '#8f9ac8');
        for (i = 0; i < 4; i++) U.fill(g, x + 6 + U.width(mul) + i * 5, y + 5, 3, 3, S.mult >= 5 ? '#ffd23f' : i < pip ? '#2ec4b6' : '#2a2c3a');   // kills toward the next multiplier
        U.text(tr, x + w - 4, y + 3, '#c3c7d4', 1, 'right');
        U.text(sc, x + 4, y + 12, '#e8f0ff', 2);
        if (S.gain && U.now() - S.gain.at < 0.9) { gw = U.width('+' + S.gain.n); U.text('+' + S.gain.n, Q.W - 4 - gw, y - 9 - Math.round((U.now() - S.gain.at) * 6), '#ffd23f'); }
      }
      var hud0 = Q.ui.hud;
      Q.ui.hud = function (g) {   // the HUD as it was, then a run's plate
        var r = hud0.apply(this, arguments), R = Q.mode && Q.mode.run();
        if (R) { try { if (R.kind === 'speed') speedPlate(g, R); else scorePlate(g, R); } catch (e) { if (!warned) { warned = true; Q.warn('modes plate: ' + e); } } }
        return r;
      };

      // ---------- the run's pause ----------
      var MP = { sel: 0, ask: '', askSel: 0 }, LIST = ['RESUME', 'RESTART', 'QUIT'];
      var HELP = { RESUME: 'BACK TO THE RUN', RESTART: 'FROM THE FIRST STAGE AGAIN', QUIT: 'TO GAME MODES. NOT RECORDED' };
      function resume() { U.mk.snd('back'); U.later(function () { Q.go('level', { resume: true }); }); }   // next frame: the level never sees this press
      Q.defScene('mpause', {
        wide: true,
        enter: function () { U.entered(); MP.sel = 0; MP.ask = ''; U.mk.snd('open'); },
        update: function () {
          var R = Q.mode.run();
          if (U.runLater()) return;
          if (!R) { Q.go('modes'); return; }   // nothing to go back to
          if (MP.ask) {
            if (U.press('left') || U.press('right') || U.press('up') || U.press('down')) { MP.askSel = 1 - MP.askSel; U.mk.snd('move'); }
            if (U.press('b')) { MP.ask = ''; U.mk.snd('back'); return; }
            if (U.press('a') || U.press('start')) {
              if (!MP.askSel) { MP.ask = ''; U.mk.snd('back'); return; }
              U.mk.snd('pick');
              if (MP.ask === 'RESTART') U.later(function () { Q.mode.restart(); }); else Q.mode.quit();
              MP.ask = '';
            }
            return;
          }
          if (U.press('start') || U.press('b')) { resume(); return; }
          MP.sel = U.menuMove(MP.sel, LIST.length);
          if (U.press('a')) { if (MP.sel === 0) resume(); else { MP.ask = LIST[MP.sel]; MP.askSel = 0; U.mk.snd('open'); } }
        },
        draw: function (g) {
          var C = U.mk.C;
          U.under(g, 'level');
          U.fill(g, 0, 0, Q.W, 27, C.foot); U.fill(g, 0, 27, Q.W, 1, C.hi); U.fill(g, 0, 179, Q.W, 21, C.foot); U.fill(g, 0, 179, Q.W, 1, C.hi);
          Q.col(g, menu);
        }
      });
      function menu(g) {   // the kit's windows in the centred column: the menu at the left, the run so far at the right
        var K = U.mk, C = K.C, R = Q.mode.run(), rows = [], i, info, y;
        if (!R) return;
        for (i = 0; i < LIST.length; i++) rows.push({ label: LIST[i] });
        U.text('PAUSED', 160, 7, C.cream, 2, 'center');
        K.window(g, 2, 30, 118, 21 + LIST.length * 12 + 2, 'MENU', 'mpause-menu', function () { K.list(g, 2, 49, 118, rows, MP.ask ? -1 : MP.sel, 'mpause-menu', { row: 12, pad: 12, right: 7 }); });
        info = R.K.info ? R.K.info(R) : { title: '', rows: [] };
        K.window(g, 123, 30, 195, 146, info.title, 'mpause-info', function () {
          for (i = 0; i < info.rows.length && i < 13; i++) {
            y = 49 + i * 10;
            if (info.rows[i][0]) U.text(info.rows[i][0], 129, y, C.muted);
            if (info.rows[i][1]) U.text(info.rows[i][1], 312, y, info.rows[i][2] || C.cream, 1, 'right');
          }
        }, { noLight: true });
        K.foot(g, MP.ask ? '' : HELP[LIST[MP.sel]], MP.ask ? 'A: CHOOSE  B: NO' : 'A: CHOOSE  B: BACK');
        if (MP.ask === 'RESTART') K.ask(g, 'mpause-ask', 'RESTART', ['START THIS RUN AGAIN?', 'THE CLOCK GOES BACK TO 0.'], ['NO', 'YES'], MP.askSel);
        else if (MP.ask) K.ask(g, 'mpause-ask', 'QUIT', ['QUIT THIS RUN?', 'IT WILL NOT BE RECORDED.'], ['NO', 'YES'], MP.askSel, { danger: true });
      }
    })();
