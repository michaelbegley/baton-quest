    // ---------- 97-modes-speed.js (B27 GAME MODES, 11 Nov): SPEED RUN: its routes and rules, its records, the route screen ('srun') and RECORDS ('srec') ----------
    // A route: one world's three levels and its boss (WORLD 1 to 4), or all 16 back to back (ALL 16), on one clock (97-modes.js: falls, game overs and secret
    // rooms count; the pause, a text box and a door's fade do not). A game over goes straight back to the last checkpoint with full hearts, the clock running on.
    // Each route starts the conductor where the story has him at that world: WORLD 1 and ALL 16 at LV 1 with no moves (ALL 16 learns them from the bosses,
    // as the story does), WORLD 2 at LV 3 with QUICK KEYS, WORLD 3 at LV 5 with PAUSE TO THINK too, WORLD 4 at LV 7 with FIRM HAND too.
    // Par: the sum of its stages' Q.PAR. Medals on Trackmania's ladder with our par as its bronze (our par is the bot's time x 1.5, as its bronze is the
    // author time x 1.5): SILVER at par x 1.2 / 1.5 and GOLD at par x 1.06 / 1.5, rounded up to whole seconds, each at or under. Records for each route:
    // best (the personal best), split (that run's time at each stage's end, to race against), seg (each stage's best segment from any finished run), medal
    // (the best won) and runs (finished). Only a finished run is recorded.
    (function () {
      var U = Q.ui, ROUTES = [
        { id: 'w1', n: 1, lv: 1, moves: [] }, { id: 'w2', n: 2, lv: 3, moves: ['dash'] }, { id: 'w3', n: 3, lv: 5, moves: ['dash', 'hover'] },
        { id: 'w4', n: 4, lv: 7, moves: ['dash', 'hover', 'pound'] }, { id: 'all', n: 0, lv: 1, moves: [] }
      ];
      var HELP = { w1: 'THREE LEVELS AND THE BOSS, ONE CLOCK', w2: 'THREE LEVELS AND THE BOSS, ONE CLOCK', w3: 'THREE LEVELS AND THE BOSS, ONE CLOCK',
        w4: 'THREE LEVELS AND THE BOSS, ONE CLOCK', all: 'ALL 16 STAGES BACK TO BACK', rec: 'BEST TIMES, SPLITS AND MEDALS' };
      function r3(v) { return Math.round((+v || 0) * 1000) / 1000; }
      function worldName(n) { var w = Q.WORLD[n]; return w && w.name ? String(w.name).toUpperCase() : 'WORLD ' + n; }
      function medals(par) { return { gold: Math.ceil(par * 1.06 / 1.5 - 1e-9), silver: Math.ceil(par * 1.2 / 1.5 - 1e-9), bronze: par }; }
      function medalOf(t, M) { return t <= M.gold ? 3 : t <= M.silver ? 2 : t <= M.bronze ? 1 : 0; }
      function route(id) {
        var r = null, i, out, p = 0;
        for (i = 0; i < ROUTES.length; i++) if (ROUTES[i].id === id) r = ROUTES[i];
        if (!r) return null;
        out = { id: r.id, n: r.n, name: r.n ? 'WORLD ' + r.n : 'ALL 16', title: r.n ? worldName(r.n) : 'THE WHOLE ADVENTURE', stages: U.parLevels(r.n || 0), kit: { lv: r.lv, moves: r.moves.slice() } };
        for (i = 0; i < out.stages.length; i++) p += U.par(out.stages[i]);
        out.par = p; out.medals = medals(p);
        return out;
      }
      function recRead(id) { var e = Q.mode.rec().speed[id]; return e || { best: 0, split: [], seg: [], medal: 0, runs: 0 }; }   // to show (makes nothing)
      function recOf(id) { var sp = Q.mode.rec().speed; if (!sp[id]) sp[id] = { best: 0, split: [], seg: [], medal: 0, runs: 0 }; return sp[id]; }
      U.mdSpeed = { route: route, rec: recRead, medalOf: medalOf, ids: function () { return ROUTES.map(function (r) { return r.id; }); } };

      Q.mode.kind('speed', {
        results: 'sres', route: route,
        begin: function (R) { var e = recRead(R.route.id); R.st = { pb: e.best > 0 ? e.split.slice() : [], seg: e.seg.slice(), delta: null, gold: [] }; },
        toast: function (R) { return 'SPEED RUN: ' + R.route.name + '. GO!'; },
        stage: function (R, i) {   // a split: against the best run's, gold when it is a best segment (a first run shows its segment)
          var S = R.st, t = R.split[i], seg = r3(t - (i ? R.split[i - 1] : 0)), pb = S.pb[i], best = S.seg[i], gold = best > 0 && seg < best;
          S.gold[i] = gold;
          S.delta = { s: pb > 0 ? U.mdDelta(r3(t) - pb) : U.mdTime(seg), col: pb > 0 ? (gold ? '#ffd23f' : r3(t) <= pb ? '#46e08a' : '#ff6b6b') : '#e8f0ff', at: U.now() };
          if (i + 1 < R.route.stages.length) Q.sfx(gold ? 'secret' : 'tick');
        },
        over: function () { Q.toast('BACK TO THE CHECKPOINT. THE CLOCK RUNS ON.', 2); return ''; },
        finish: function (R) {   // the records: best segments from this run, the best and its splits when it is one, the best medal; and what the results show
          var e = recOf(R.route.id), n = R.route.stages.length, t = r3(R.t), M = R.route.medals, medal = medalOf(t, M), prev = e.best, prevSplit = e.split.slice(), gold = [], i, seg, nb;
          e.runs++;
          while (e.seg.length < n) e.seg.push(0);
          for (i = 0; i < n; i++) { seg = r3(R.split[i] - (i ? R.split[i - 1] : 0)); gold[i] = !(e.seg[i] > 0) || seg < e.seg[i]; if (gold[i]) e.seg[i] = seg; }
          nb = !(prev > 0) || t < prev;
          if (nb) { e.best = t; e.split = R.split.map(r3); }
          if (medal > e.medal) e.medal = medal;
          return { route: R.route.id, name: R.route.name, title: R.route.title, stages: R.route.stages.slice(), t: t, par: R.route.par, medals: M, medal: medal,
            newBest: nb, first: e.runs === 1, prev: prev, prevSplit: prevSplit, split: R.split.map(r3), gold: gold };
        },
        info: function (R) {   // the pause's right window
          var e = recRead(R.route.id), M = R.route.medals, rows = [], i, pb;
          rows.push(['STAGE', (R.i + 1) + '/' + R.route.stages.length + '  ' + U.mdLabel(R.route.stages[R.i])]);
          rows.push(['', U.mdFit(U.mdName(R.route.stages[R.i]), 30), '#c3c7d4']);
          rows.push(['TIME', U.mdTime(R.t), '#ffffff']);
          rows.push(['BEST', e.best > 0 ? U.mdTime(e.best) : 'NONE YET']);
          rows.push(['PAR', U.mss(R.route.par)]);
          rows.push(['GOLD, SILVER', U.mss(M.gold) + ', ' + U.mss(M.silver)]);
          for (i = Math.max(0, R.split.length - 5); i < R.split.length; i++) {
            pb = R.st.pb[i];
            rows.push([U.mdLabel(R.route.stages[i]), U.mdTime(R.split[i]) + (pb > 0 ? '  ' + U.mdDelta(r3(R.split[i]) - pb) : ''), pb > 0 ? (r3(R.split[i]) <= pb ? '#46e08a' : '#ff6b6b') : null]);
          }
          return { title: 'SPEED RUN: ' + R.route.name, rows: rows };
        },
        state: function (R) { return { pb: R.st.pb.slice(), delta: R.st.delta ? R.st.delta.s : '', par: R.route.par, medals: R.route.medals }; }
      });

      // ---------- 'srun': the routes at the left, the picked one's stages, par, medals, best and start at the right ----------
      var SR = { sel: 0, t: 0 }, ROWS = ['w1', 'w2', 'w3', 'w4', 'all', 'rec'];
      U.srunAt = function () { return { sel: SR.sel, row: ROWS[SR.sel] }; };   // for checks
      Q.defScene('srun', {
        enter: function (o) { U.entered(); U.cancel(); U.clearToasts(); SR.t = 0; if (o && o.sel >= 0) SR.sel = Q.clamp(o.sel | 0, 0, ROWS.length - 1); Q.music('title'); },
        update: function (dt) {
          var id;
          SR.t += dt;
          if (U.runLater()) return;
          if (U.press('b')) { U.mk.snd('back'); Q.go('modes'); return; }
          SR.sel = U.menuMove(SR.sel, ROWS.length);
          if (U.press('a') || U.press('start')) {
            id = ROWS[SR.sel]; U.mk.snd('pick');
            if (id === 'rec') { Q.go('srec', { route: 'w1' }); return; }
            U.later(function () { if (!Q.mode.start('speed', id)) Q.go('srun'); });   // next frame, so the first stage never reads this press
          }
        },
        draw: function (g) {
          var K = U.mk, C = K.C, rows = [], i, id, e, pick = ROWS[SR.sel], R = route(pick === 'rec' ? 'all' : pick), pe = recRead(R.id);
          U.mdBack(g, SR.t, 'SPEED RUN');
          for (i = 0; i < ROWS.length; i++) {
            id = ROWS[i];
            if (id === 'rec') { rows.push({ label: 'RECORDS' }); continue; }
            e = recRead(id);
            rows.push({ label: route(id).name, count: e.best > 0 ? U.mdTime(e.best, true) : '-:--', medal: e.medal, draw: e.medal ? medalRow : null });
          }
          K.window(g, 6, 32, 130, 21 + rows.length * 12 + 2, 'ROUTES', 'srun-list', function () { K.list(g, 6, 51, 130, rows, SR.sel, 'srun-list', { row: 12, pad: 12, right: 7 }); });
          function medalRow(g2, x, y, on) { var r = rows[(y - 51) / 12 | 0]; if (r) U.mdMedal(g2, 136 - 7 - U.width(r.count) - 12, y - 2, r.medal); }
          K.window(g, 140, 32, 174, 144, pick === 'rec' ? 'RECORDS' : R.title, 'srun-info', function () { info(g, R, pe, pick === 'rec'); }, { noLight: true });
          K.foot(g, HELP[pick] || '', pick === 'rec' ? 'A: OPEN  B: BACK' : 'A: GO  B: BACK');
          U.drawTalk(g);
        },
        sides: function (g) { U.mdSides(g); }
      });
      function info(g, R, e, rec) {   // the right window: the route's stages, its par and medals, the best, and how he starts
        var C = U.mk.C, x = 146, r = 308, y = 51, i, M = R.medals, names = ['GOLD', 'SILVER', 'BRONZE'], lim = [M.gold, M.silver, M.bronze], m, ab;
        if (rec) {
          for (i = 0; i < ROUTES.length; i++) { m = recRead(ROUTES[i].id); U.text(route(ROUTES[i].id).name, x, y + i * 12, C.cream); U.mdMedal(g, 250, y - 2 + i * 12, m.medal); U.text(m.runs + (m.runs === 1 ? ' RUN' : ' RUNS'), r, y + i * 12, C.muted, 1, 'right'); }
          U.text('EACH ROUTE: ITS BEST, ITS', x, 124, C.help); U.text('SPLITS, ITS BEST SEGMENTS', x, 134, C.help); U.text('AND THE SUM OF THEM.', x, 144, C.help);
          return;
        }
        if (R.n) for (i = 0; i < R.stages.length; i++) { U.text(U.mdLabel(R.stages[i]), x, y + i * 10, U.worldCol ? U.worldCol(R.n) : C.teal); U.text(U.mdFit(U.mdName(R.stages[i]), 20), x + 40, y + i * 10, C.help); }
        else { U.text('ALL 16 STAGES, BACK TO BACK:', x, y, C.help); U.text('1-1 TO 4-BOSS. THE MOVES COME', x, y + 10, C.help); U.text('FROM THE BOSSES, AS IN THE STORY.', x, y + 20, C.help); }
        y = 95; U.fill(g, x, y - 4, r - x, 1, C.hi);
        U.text('PAR', x, y, C.muted); U.text(U.mss(R.par), r, y, C.cream, 1, 'right');
        for (i = 0; i < 3; i++) {
          U.mdMedal(g, x, y + 9 + i * 11, 3 - i);
          U.text(names[i], x + 13, y + 11 + i * 11, e.medal === 3 - i ? '#ffd23f' : C.help);
          U.text('AT ' + U.mss(lim[i]) + ' OR UNDER', r, y + 11 + i * 11, e.medal >= 3 - i ? '#ffd23f' : C.muted, 1, 'right');
        }
        y = 141; U.fill(g, x, y - 4, r - x, 1, C.hi);
        U.text('YOUR BEST', x, y, C.muted); U.text(e.best > 0 ? U.mdTime(e.best) : 'NO RUN YET', r, y, e.best > 0 ? C.yel : C.dim, 1, 'right');
        U.text('START: LV ' + R.kit.lv, x, y + 13, C.muted);
        for (i = 0; i < R.kit.moves.length; i++) { ab = R.kit.moves[i]; Q.spr(g, 'ic-' + ab, 0, r - 12 - (R.kit.moves.length - 1 - i) * 14, y + 10); }
        if (!R.kit.moves.length) U.text('NO MOVES YET', r, y + 13, C.dim, 1, 'right');
      }

      // ---------- 'srec': RECORDS, a route a tab: its best and medal, its splits and segments, each stage's best segment and their sum ----------
      var RC = { r: 0, t: 0 }, RIDS = ['w1', 'w2', 'w3', 'w4', 'all'];
      U.srecAt = function () { return { route: RIDS[RC.r] }; };   // for checks
      Q.defScene('srec', {
        enter: function (o) { U.entered(); RC.t = 0; if (o && o.route && RIDS.indexOf(o.route) >= 0) RC.r = RIDS.indexOf(o.route); },
        update: function (dt) {
          RC.t += dt;
          if (U.runLater()) return;
          if (U.press('b') || U.press('a')) { U.mk.snd('back'); Q.go('srun', { sel: 5 }); return; }
          if (U.press('left')) { RC.r = (RC.r + RIDS.length - 1) % RIDS.length; U.mk.snd('tab'); }
          if (U.press('right')) { RC.r = (RC.r + 1) % RIDS.length; U.mk.snd('tab'); }
        },
        draw: function (g) {
          var K = U.mk, R = route(RIDS[RC.r]);
          U.mdBack(g, RC.t, 'BEST TIMES');
          K.tabs(g, 6, 31, 308, ['WORLD 1', 'WORLD 2', 'WORLD 3', 'WORLD 4', 'ALL 16'], RC.r, false);
          K.window(g, 6, 46, 308, 131, R.title, 'srec-' + R.id, function () { table(g, R, recRead(R.id)); }, { noLight: true });
          K.foot(g, 'LEFT AND RIGHT: ROUTE', 'B: BACK');
          U.drawTalk(g);
        },
        sides: function (g) { U.mdSides(g); }
      });
      function table(g, R, e) {
        var C = U.mk.C, n = R.stages.length, sob = 0, all = true, i, x, y, col, seg, two = n > 8;
        for (i = 0; i < n; i++) { if (e.seg[i] > 0) sob += e.seg[i]; else all = false; }
        U.mdMedal(g, 14, 63, e.medal);
        U.text('BEST', 28, 66, C.muted); U.text(e.best > 0 ? U.mdTime(e.best) : '-:--.--', 58, 63, e.best > 0 ? '#ffffff' : C.dim, 2);
        U.text(e.medal ? U.mdMedalName(e.medal) : 'NO MEDAL YET', 306, 63, e.medal ? '#ffd23f' : C.dim, 1, 'right');
        U.text(e.runs + (e.runs === 1 ? ' RUN FINISHED' : ' RUNS FINISHED'), 306, 72, C.muted, 1, 'right');
        U.text('SUM OF BEST SEGMENTS ' + (all && sob > 0 ? U.mdTime(sob) : '-'), 14, 84, all && sob > 0 ? '#ffd23f' : C.muted);
        U.text('PAR ' + U.mss(R.par), 306, 84, C.muted, 1, 'right');
        U.fill(g, 12, 93, 296, 1, C.hi);
        if (two) { for (i = 0; i < 2; i++) { U.text('SPLIT', 106 + i * 148, 97, C.dim, 1, 'right'); U.text('BEST SEG', 154 + i * 148, 97, C.dim, 1, 'right'); } }
        else { U.text('YOUR BEST RUN', 14, 97, C.dim); U.text('SPLIT', 206, 97, C.dim, 1, 'right'); U.text('SEGMENT', 256, 97, C.dim, 1, 'right'); U.text('BEST SEG', 306, 97, C.dim, 1, 'right'); }
        for (i = 0; i < n; i++) {
          x = two ? (i < 8 ? 14 : 162) : 14; y = 108 + (two ? i % 8 : i) * (two ? 8 : 12);
          seg = e.split[i] > 0 ? e.split[i] - (i ? e.split[i - 1] || 0 : 0) : 0; col = e.seg[i] > 0 && seg > 0 && Math.abs(seg - e.seg[i]) < 0.002 ? '#ffd23f' : C.cream;
          U.text(U.mdLabel(R.stages[i]), x, y, U.worldCol ? U.worldCol(Q.LEVEL[R.stages[i]] ? Q.LEVEL[R.stages[i]].world : 1) : C.teal);
          if (two) { U.text(e.split[i] > 0 ? U.mdTime(e.split[i]) : '-', x + 92, y, C.cream, 1, 'right'); U.text(e.seg[i] > 0 ? U.mdTime(e.seg[i]) : '-', x + 140, y, '#ffd23f', 1, 'right'); continue; }
          U.text(U.mdFit(U.mdName(R.stages[i]), 17), x + 40, y, C.help);
          U.text(e.split[i] > 0 ? U.mdTime(e.split[i]) : '-', 206, y, C.cream, 1, 'right');
          U.text(seg > 0 ? U.mdTime(seg) : '-', 256, y, col, 1, 'right');
          U.text(e.seg[i] > 0 ? U.mdTime(e.seg[i]) : '-', 306, y, '#ffd23f', 1, 'right');
        }
      }
    })();
