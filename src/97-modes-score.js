    // ---------- 97-modes-score.js (B27 GAME MODES, 11 Nov): HIGH SCORE: its rules, its start screen ('hscore') and its TOP 5 ('htop') ----------
    // One run through the 16 stages from 1-1, a new conductor (LV 1, no moves; he learns them from the bosses, as in the story), three tries: a game over
    // spends one and goes back to the last checkpoint with full hearts; the last one ends the run. Points (97-modes.js keeps the run, this file the score):
    //   an enemy the level's map places: 100 x its XP (1 at least); the ones chutes and bosses keep making score nothing (no farming);
    //   a token 10, a memo 500; the combo: every enemy beaten without getting hurt adds one, every 5 raise the multiplier (x2 at 5, up to x5 at 20) on
    //   enemies, tokens and memos; a hurt or a fall puts it back to x1, and so does a game over;
    //   each stage cleared 1000, and 50 for every whole second its own clock is under the stage's par (Mario's 50 a second, against our par);
    //   a boss 1000 x its XP; all 16 cleared: 10000 for each try left. Seven figures at most.
    // The table: the five best runs, each { n: three letters, s: score, at: the stage it ended in or CLEAR, clear }; a run with points goes in under any
    // equal score with the last initials used, and the results screen lets them be changed (97-modes-score-b.js). Only an ended run is recorded.
    (function () {
      var U = Q.ui, TRIES = 3;
      function route(id) { return id === 'all' ? { id: 'all', name: 'HIGH SCORE', title: 'ALL 16 STAGES', stages: U.parLevels(0), kit: { lv: 1, moves: [] } } : null; }
      function mult(c) { return Math.min(5, 1 + Math.floor(c / 5)); }
      function live() { var R = Q.mode.run(); return R && R.live && R.kind === 'score' ? R : null; }
      function add(R, part, n) { var S = R.st; n = Math.max(0, Math.floor(n)); if (!n) return; S.score = Math.min(9999999, S.score + n); S.parts[part] = (S.parts[part] || 0) + n; S.gain = { n: n, at: U.now() }; }
      function insert(top, e) { var i = 0; while (i < top.length && top[i].s >= e.s) i++; if (i >= 5) return -1; top.splice(i, 0, e); if (top.length > 5) top.length = 5; return i; }
      U.mdScoreTop = function () { return Q.mode.rec().score; };

      Q.mode.kind('score', {
        results: 'hres', route: route,
        begin: function (R) { R.st = { score: 0, combo: 0, mult: 1, top: 0, kills: 0, tries: TRIES, left: {}, parts: { kill: 0, token: 0, memo: 0, clear: 0, time: 0, boss: 0, tries: 0 }, gain: null }; },
        toast: function () { return 'HIGH SCORE: THREE TRIES. GO!'; },
        load: function (R, id) {   // a stage (or a secret room, or a retry) loads: the enemies its map places, by kind, are the ones that score
          var left = {}, i, p, put = engSpots && engSpots.put ? engSpots.put : [];
          for (i = 0; i < put.length; i++) { p = put[i]; if (p && p.enemy) left[p.enemy] = (left[p.enemy] || 0) + 1; }
          R.st.left[id] = left;
        },
        stage: function (R, i) {   // a stage cleared: 1000, and 50 a second under its par on its own clock
          var id = R.route.stages[i], par = U.par(id), t = engClk.t;
          add(R, 'clear', 1000);
          if (par > 0 && t < par) add(R, 'time', Math.floor(par - t) * 50);
        },
        over: function (R) {
          var S = R.st;
          S.tries--; S.combo = 0; S.mult = 1;
          if (S.tries <= 0) return 'end';
          Q.toast(S.tries === 1 ? 'LAST TRY. THE COMBO STARTS AGAIN.' : S.tries + ' TRIES LEFT. THE COMBO STARTS AGAIN.', 2.2);
          return '';
        },
        finish: function (R, how) {
          var S = R.st, rec = Q.mode.rec().score, clear = how === 'clear', e, rank = -1, k, parts = {};
          if (clear && S.tries > 0) add(R, 'tries', S.tries * 10000);
          rec.runs++;
          e = { n: rec.last, s: S.score, at: clear ? 'CLEAR' : U.mdLabel(R.route.stages[R.i]), clear: clear ? 1 : 0 };
          if (S.score > 0) rank = insert(rec.top, e);
          for (k in S.parts) if (engOwn(S.parts, k)) parts[k] = S.parts[k];
          return { score: S.score, parts: parts, clear: clear, at: e.at, rank: rank, combo: S.top, kills: S.kills, tries: S.tries, name: rec.last, stage: R.i + 1, n: R.route.stages.length };
        },
        info: function (R) {
          var S = R.st, rec = Q.mode.rec().score, rows = [];
          rows.push(['STAGE', (R.i + 1) + '/' + R.route.stages.length + '  ' + U.mdLabel(R.route.stages[R.i])]);
          rows.push(['', U.mdFit(U.mdName(R.route.stages[R.i]), 30), '#c3c7d4']);
          rows.push(['SCORE', U.mdScore(S.score), '#ffffff']);
          rows.push(['MULTIPLIER', 'X' + S.mult, S.mult > 1 ? '#ffd23f' : null]);
          rows.push(['COMBO', S.combo + (S.top ? '  (BEST ' + S.top + ')' : '')]);
          rows.push(['TRIES LEFT', String(S.tries)]);
          rows.push(['ENEMIES BEATEN', String(S.kills)]);
          rows.push(['TOP SCORE', rec.top.length ? rec.top[0].n + ' ' + U.mdScore(rec.top[0].s) : 'NONE YET']);
          return { title: 'HIGH SCORE', rows: rows };
        },
        state: function (R) { var S = R.st; return { score: S.score, combo: S.combo, mult: S.mult, tries: S.tries, kills: S.kills, parts: S.parts, left: S.left[Q.level ? Q.level.id : ''] || null }; }
      });
      Q.on('kill', function (d) {   // an enemy beaten: points only for one its map placed (so many of each kind), with the combo
        var R = live(), lv = Q.level, left, def, S;
        if (!R || !lv || !d) return;
        left = R.st.left[lv.id];
        if (!left || !(left[d.id] > 0)) return;
        left[d.id]--; S = R.st;
        S.combo++; S.kills++; S.mult = mult(S.combo); if (S.combo > S.top) S.top = S.combo;
        def = engOwn(Q.ENEMY, d.id) ? Q.ENEMY[d.id] : null;
        add(R, 'kill', 100 * Math.max(1, def && def.xp > 0 ? def.xp | 0 : 1) * S.mult);
      });
      Q.on('pickup', function (d) { var R = live(); if (R && d && d.n > 0) add(R, 'token', 10 * d.n * R.st.mult); });   // a heart is n 0: no points
      Q.on('memo', function () { var R = live(); if (R) add(R, 'memo', 500 * R.st.mult); });
      function hit(d) { var R = live(); if (R && d && (d.n | 0) > 0) { R.st.combo = 0; R.st.mult = 1; } }
      Q.on('hurt', hit); Q.on('fall', hit);
      Q.on('boss', function (d) { var R = live(), def = d && engOwn(Q.ENEMY, d.id) ? Q.ENEMY[d.id] : null; if (R) add(R, 'boss', 1000 * (def && def.xp > 0 ? def.xp | 0 : 10)); });

      // ---------- 'hscore': START and TOP 5 at the left, the rules at the right ----------
      var HS = { sel: 0, t: 0 }, ROWS = ['START', 'TOP 5'], HELP = { START: 'ALL 16 STAGES, THREE TRIES', 'TOP 5': 'THE FIVE BEST RUNS' };
      var RULES = [['ENEMY', '100 X ITS XP'], ['TOKEN', '10'], ['MEMO', '500'], ['STAGE CLEARED', '1000'], ['UNDER PAR', '50 A SECOND'], ['BOSS', '1000 X ITS XP'],
        ['TRY LEFT AT THE END', '10000']];
      U.hscoreAt = function () { return { sel: HS.sel, row: ROWS[HS.sel] }; };   // for checks
      Q.defScene('hscore', {
        enter: function (o) { U.entered(); U.cancel(); U.clearToasts(); HS.t = 0; if (o && o.sel >= 0) HS.sel = Q.clamp(o.sel | 0, 0, ROWS.length - 1); Q.music('title'); },
        update: function (dt) {
          HS.t += dt;
          if (U.runLater()) return;
          if (U.press('b')) { U.mk.snd('back'); Q.go('modes'); return; }
          HS.sel = U.menuMove(HS.sel, ROWS.length);
          if (U.press('a') || U.press('start')) {
            U.mk.snd('pick');
            if (ROWS[HS.sel] === 'TOP 5') { Q.go('htop'); return; }
            U.later(function () { if (!Q.mode.start('score', 'all')) Q.go('hscore'); });   // next frame, so 1-1 never reads this press
          }
        },
        draw: function (g) {
          var K = U.mk, C = K.C, rec = Q.mode.rec().score, rows = [], i, y, b = rec.top[0];
          U.mdBack(g, HS.t, 'HIGH SCORE');
          for (i = 0; i < ROWS.length; i++) rows.push({ label: ROWS[i] });
          K.window(g, 6, 32, 130, 21 + rows.length * 12 + 2, 'MENU', 'hscore-menu', function () { K.list(g, 6, 51, 130, rows, HS.sel, 'hscore-menu', { row: 12, pad: 12, right: 7 }); });
          K.window(g, 6, 86, 130, 90, 'TO BEAT', 'hscore-best', function () {
            if (!b) { U.text('NO SCORE YET.', 71, 112, C.dim, 1, 'center'); U.text('THE TABLE FILLS', 71, 130, C.help, 1, 'center'); U.text('WITH YOUR RUNS.', 71, 140, C.help, 1, 'center'); return; }
            U.text(b.n, 71, 108, '#ffd23f', 3, 'center'); U.text(U.mdScore(b.s), 71, 136, '#ffffff', 2, 'center');
            U.text(b.clear ? 'ALL CLEAR' : 'REACHED ' + b.at, 71, 156, C.muted, 1, 'center');
          }, { noLight: true });
          K.window(g, 140, 32, 174, 144, 'THE RULES', 'hscore-rules', function () {
            U.text('FROM 1-1 TO 4-BOSS: ALL 16.', 146, 51, C.help); U.text('A NEW CONDUCTOR, 3 TRIES.', 146, 61, C.help);
            for (i = 0; i < RULES.length; i++) { y = 76 + i * 10; U.text(RULES[i][0], 146, y, C.muted); U.text(RULES[i][1], 308, y, C.cream, 1, 'right'); }
            U.fill(g, 146, 147, 162, 1, C.hi);
            U.text('THE COMBO: 5 IN A ROW WITH', 146, 151, '#ffd23f'); U.text('NO HURT: X2. UP TO X5.', 146, 161, '#ffd23f');
          }, { noLight: true });
          K.foot(g, HELP[ROWS[HS.sel]], 'A: CHOOSE  B: BACK');
          U.drawTalk(g);
        },
        sides: function (g) { U.mdSides(g); }
      });

      // ---------- 'htop': TOP 5 ----------
      var HT = { t: 0, back: 'hscore' };
      U.drawTop5 = function (g, x, y, w, hot) {   // the five rows: rank, initials, score, where the run ended; hot: the row to light up (-1: none). Under 200 wide: small letters
        var C = U.mk.C, top = Q.mode.rec().score.top, i, ry, e, on, k = w < 200 ? 1 : 2, rh = k === 2 ? 18 : 17, dy = k === 2 ? -3 : 0, sx = k === 2 ? x + w - 56 : x + w - 42;
        for (i = 0; i < 5; i++) {
          ry = y + i * rh; e = top[i]; on = i === hot;
          if (on) { U.fill(g, x, ry - 4, w, 15, Math.floor(U.now() * 3) % 3 ? '#3a3410' : '#262838'); U.fill(g, x, ry - 4, 2, 15, '#ffd23f'); }
          U.text(String(i + 1), x + 7, ry, i === 0 ? '#ffd23f' : C.muted, 1);
          if (!e) { U.text('---', x + 20, ry + dy + (k === 2 ? 2 : 0), C.dim, k); U.text('-------', sx, ry, C.dim, 1, 'right'); continue; }
          U.text(e.n, x + 20, ry + dy, on ? '#ffd23f' : C.cream, k);
          U.text(U.mdScore(e.s), sx, ry + dy, on ? '#ffd23f' : '#ffffff', k, 'right');
          U.text(e.clear ? 'CLEAR' : e.at, x + w - 3, ry, e.clear ? '#ffd23f' : C.muted, 1, 'right');
        }
      };
      Q.defScene('htop', {
        enter: function (o) { U.entered(); HT.t = 0; HT.back = o && o.back ? o.back : 'hscore'; },
        update: function (dt) { HT.t += dt; if (U.runLater()) return; if (U.press('b') || U.press('a') || U.press('start')) { U.mk.snd('back'); Q.go(HT.back, { sel: 1 }); } },
        draw: function (g) {
          var K = U.mk, C = K.C, rec = Q.mode.rec().score;
          U.mdBack(g, HT.t, 'TOP 5');
          K.window(g, 30, 34, 260, 140, 'HIGH SCORE', 'htop-win', function () {
            U.drawTop5(g, 38, 60, 244, -1);
            U.fill(g, 38, 150, 244, 1, C.hi);
            U.text(rec.runs + (rec.runs === 1 ? ' RUN PLAYED' : ' RUNS PLAYED') + ' IN THIS BROWSER', 160, 157, C.muted, 1, 'center');
          }, { noLight: true });
          K.foot(g, 'KEPT IN THIS BROWSER, BESIDE YOUR FILES', 'B: BACK');
          U.drawTalk(g);
        },
        sides: function (g) { U.mdSides(g); }
      });
    })();
