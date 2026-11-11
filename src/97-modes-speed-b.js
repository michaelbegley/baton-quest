    // ---------- 97-modes-speed-b.js (B27 GAME MODES, 11 Nov): SPEED RUN's results ('sres', opened by 97-modes.js with { r: the run's results }) ----------
    // The time counts up (0.9 s; a press skips it), then the medal it won against the route's par, the best (NEW BEST!, FIRST RUN!, or the best and how far
    // off), and the splits: each stage's time at its end with its difference from the best run before this one (green ahead, red behind) and gold for a best
    // segment. AGAIN (the same route, at once), RECORDS (its tab), GAME MODES; B: the route screen.
    (function () {
      var U = Q.ui, RS = { t: 0, r: null, sel: 0, counted: false }, CH = ['AGAIN', 'RECORDS', 'GAME MODES'], COUNT = 0.9;
      var HELP = { AGAIN: 'THE SAME ROUTE, FROM THE TOP', RECORDS: "THIS ROUTE'S BEST TIMES", 'GAME MODES': 'BACK TO GAME MODES' };
      U.sresAt = function () { var r = RS.r; return r ? { route: r.route, t: r.t, medal: r.medal, newBest: r.newBest, first: r.first, sel: RS.sel, counted: RS.counted, split: r.split.slice() } : null; };   // for checks
      Q.defScene('sres', {
        enter: function (o) { U.entered(); RS.r = o && o.r && o.r.split ? o.r : null; RS.t = 0; RS.sel = 0; RS.counted = false; Q.music('map'); },
        update: function (dt) {
          var r = RS.r, id;
          RS.t += dt;
          if (U.runLater()) return;
          if (!r) { Q.go('srun'); return; }
          if (!RS.counted && RS.t >= COUNT) { RS.counted = true; Q.sfx(r.newBest || r.medal >= 3 ? 'lvup' : 'select'); }
          if (RS.t < 0.3) return;
          if (!RS.counted) { if (U.press('a') || U.press('b') || U.press('start')) RS.t = COUNT; return; }   // the count is skipped first
          if (U.press('left')) { RS.sel = (RS.sel + CH.length - 1) % CH.length; U.mk.snd('move'); }
          if (U.press('right')) { RS.sel = (RS.sel + 1) % CH.length; U.mk.snd('move'); }
          if (U.press('b')) { U.mk.snd('back'); Q.go('srun', { sel: Math.max(0, U.mdSpeed.ids().indexOf(r.route)) }); return; }
          if (U.press('a') || U.press('start')) {
            U.mk.snd('pick'); id = r.route;
            if (CH[RS.sel] === 'AGAIN') U.later(function () { if (!Q.mode.start('speed', id)) Q.go('srun'); });
            else if (CH[RS.sel] === 'RECORDS') Q.go('srec', { route: id });
            else Q.go('modes');
          }
        },
        draw: function (g) {
          var K = U.mk, C = K.C, r = RS.r, k = Q.clamp(RS.t / COUNT, 0, 1), y, s, nx;
          U.mdBack(g, RS.t, r ? r.name + ' FINISHED' : 'FINISHED');
          if (!r) { U.drawTalk(g); return; }
          K.window(g, 6, 32, 132, 126, 'TIME', 'sres-time', function () {
            U.text(U.mdTime(r.t * k), 72, 53, '#ffffff', 2, 'center');
            if (!RS.counted) return;
            g.save(); g.translate(14, 74); g.scale(2, 2); U.mdMedal(g, 0, 0, r.medal); g.restore();
            U.text(r.medal ? U.mdMedalName(r.medal) : 'NO MEDAL', 36, r.medal ? 76 : 80, r.medal ? U.mdMedalCol(r.medal) : C.muted, r.medal ? 2 : 1);
            nx = r.medal >= 3 ? '' : r.medal === 2 ? 'GOLD AT ' + U.mss(r.medals.gold) : r.medal === 1 ? 'SILVER AT ' + U.mss(r.medals.silver) : 'BRONZE AT ' + U.mss(r.medals.bronze);
            U.text('PAR ' + U.mss(r.par), 36, 95, C.muted); if (nx) U.text(nx, 12, 106, C.help);
            y = 121; U.fill(g, 10, y - 4, 124, 1, C.hi);
            if (r.first) s = 'FIRST RUN!'; else if (r.newBest) s = 'NEW BEST!'; else s = '';
            if (s) { if (Math.floor(RS.t * 3) % 3) U.text(s, 72, y + 2, '#ffd23f', 1, 'center'); if (!r.first) U.text('WAS ' + U.mdTime(r.prev), 72, y + 13, C.muted, 1, 'center'); }
            else { U.text('BEST ' + U.mdTime(r.prev), 72, y + 2, C.cream, 1, 'center'); U.text(U.mdDelta(r.t - r.prev), 72, y + 13, '#ff6b6b', 1, 'center'); }
          });
          K.window(g, 142, 32, 172, 126, 'SPLITS', 'sres-splits', function () { splits(g, r); }, { noLight: true });
          if (RS.counted) { U.mdChoices(g, 6, 165, 308, CH, RS.sel); K.foot(g, HELP[CH[RS.sel]], 'A: CHOOSE  B: ROUTES'); }
          else K.foot(g, '', 'A: SKIP');
          U.drawTalk(g);
        },
        sides: function (g) { U.mdSides(g); }
      });
      function splits(g, r) {   // each stage's split; against the best before this run (green ahead, red behind); gold: a best segment
        var C = U.mk.C, n = r.split.length, two = n > 8, i, x, y, pb, col, d;
        for (i = 0; i < n; i++) {
          pb = r.prevSplit[i] > 0 ? r.prevSplit[i] : 0; d = pb ? r.split[i] - pb : 0;
          col = r.gold[i] && !r.first ? '#ffd23f' : pb ? (d <= 0 ? '#46e08a' : '#ff6b6b') : C.cream;
          if (two) {
            x = i < 8 ? 148 : 232; y = 51 + (i % 8) * 12;
            U.text(U.mdLabel(r.stages[i]), x, y, C.help); U.text(U.mdTime(r.split[i], true), x + 78, y, col, 1, 'right');
            continue;
          }
          y = 51 + i * 24;
          U.text(U.mdLabel(r.stages[i]), 148, y, C.help); U.text(U.mdFit(U.mdName(r.stages[i]), 20), 186, y, C.dim);
          U.text(U.mdTime(r.split[i]), 262, y + 10, col, 1, 'right');
          if (pb) U.text(U.mdDelta(d), 308, y + 10, col, 1, 'right');
          else if (r.gold[i] && !r.first) U.text('BEST', 308, y + 10, col, 1, 'right');
        }
        if (two) U.text('GOLD: A BEST SEGMENT', 228, 149, C.dim, 1, 'center');
      }
    })();
