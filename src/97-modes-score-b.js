    // ---------- 97-modes-score-b.js (B27 GAME MODES, 11 Nov): HIGH SCORE's results ('hres', opened by 97-modes.js with { r: the run's results }) ----------
    // GAME OVER or ALL CLEAR!, the score counting up (0.9 s; a press skips it) with where it came from, how far the run got and its best combo. A run that
    // made the TOP 5 (it is in the table already, under the last initials used) then takes three letters, the arcade way: UP and DOWN change the letter
    // (A to Z, round and round), LEFT and RIGHT move, A goes on to the next letter and from the last one finishes, B steps back, START finishes; they are
    // stored at once and kept as the next run's starting letters. Then the table with that run lit, and AGAIN or GAME MODES; B: the HIGH SCORE screen.
    (function () {
      var U = Q.ui, HR = { t: 0, r: null, ph: 'count', sel: 0, nm: ['A', 'A', 'A'], cur: 0, counted: false }, CH = ['AGAIN', 'GAME MODES'], COUNT = 0.9;
      var ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', PARTS = [['kill', 'ENEMIES'], ['token', 'TOKENS'], ['memo', 'MEMOS'], ['clear', 'STAGES'], ['time', 'UNDER PAR'], ['boss', 'BOSSES'], ['tries', 'TRIES LEFT']];
      U.hresAt = function () { var r = HR.r; return r ? { ph: HR.ph, rank: r.rank, name: HR.nm.join(''), cur: HR.cur, score: r.score, clear: r.clear, at: r.at, sel: HR.sel, counted: HR.counted, parts: JSON.parse(JSON.stringify(r.parts)) } : null; };   // for checks (B29: and the parts)
      function entry() { var r = HR.r, top = Q.mode.rec().score.top, e = r && r.rank >= 0 ? top[r.rank] : null; return e && e.s === r.score ? e : null; }   // the run's row in the table
      function done() {   // the initials are in: into the table and kept for next time, stored at once
        var rec = Q.mode.rec().score, e = entry(), n = Q.mode.name(HR.nm.join(''));
        if (e) e.n = n;
        rec.last = n; Q.mode.store();
        HR.ph = 'table'; HR.sel = 0; U.mk.snd('pick');
      }
      function letter(d) { var i = ABC.indexOf(HR.nm[HR.cur]); HR.nm[HR.cur] = ABC.charAt(((i < 0 ? 0 : i) + d + 26) % 26); Q.sfx('tick'); }
      Q.defScene('hres', {
        enter: function (o) {
          var r = o && o.r && o.r.parts ? o.r : null;
          U.entered(); HR.r = r; HR.t = 0; HR.ph = 'count'; HR.sel = 0; HR.cur = 0; HR.counted = false;
          HR.nm = String(r && r.name ? r.name : 'AAA').split('').slice(0, 3); while (HR.nm.length < 3) HR.nm.push('A');
          Q.music('map');
        },
        update: function (dt) {
          var r = HR.r;
          HR.t += dt;
          if (U.runLater()) return;
          if (!r) { Q.go('hscore'); return; }
          if (!HR.counted && HR.t >= COUNT) { HR.counted = true; Q.sfx(r.rank === 0 ? 'lvup' : 'select'); if (r.rank >= 0 && entry()) HR.ph = 'name'; else HR.ph = 'table'; }
          if (HR.t < 0.3) return;
          if (!HR.counted) { if (U.press('a') || U.press('b') || U.press('start')) HR.t = COUNT; return; }   // the count is skipped first
          if (HR.ph === 'name') {
            if (U.press('up')) letter(1);
            if (U.press('down')) letter(-1);
            if (U.press('left') && HR.cur > 0) { HR.cur--; U.mk.snd('move'); }
            if (U.press('right') && HR.cur < 2) { HR.cur++; U.mk.snd('move'); }
            if (U.press('b') && HR.cur > 0) { HR.cur--; U.mk.snd('back'); }
            if (U.press('start')) { done(); return; }
            if (U.press('a')) { if (HR.cur < 2) { HR.cur++; U.mk.snd('move'); } else done(); }
            return;
          }
          if (U.press('left') || U.press('right')) { HR.sel = 1 - HR.sel; U.mk.snd('move'); }
          if (U.press('b')) { U.mk.snd('back'); Q.go('hscore'); return; }
          if (U.press('a') || U.press('start')) {
            U.mk.snd('pick');
            if (CH[HR.sel] === 'AGAIN') U.later(function () { if (!Q.mode.start('score', 'all')) Q.go('hscore'); });
            else Q.go('modes');
          }
        },
        draw: function (g) {
          var K = U.mk, C = K.C, r = HR.r, k = Q.clamp(HR.t / COUNT, 0, 1), i, y, v;
          U.mdBack(g, HR.t, r && r.clear ? 'ALL CLEAR!' : 'GAME OVER');
          if (!r) { U.drawTalk(g); return; }
          K.window(g, 6, 32, 150, 126, 'SCORE', 'hres-score', function () {
            U.text(U.mdScore(r.score * k), 81, 52, '#ffffff', 2, 'center');
            for (i = 0, y = 72; i < PARTS.length; i++) {
              v = r.parts[PARTS[i][0]] || 0;
              if (PARTS[i][0] === 'tries' && !r.clear) continue;
              U.text(PARTS[i][1] + (PARTS[i][0] === 'kill' ? ' ' + r.kills : ''), 12, y, C.muted); U.text(String(Math.floor(v * k)), 150, y, v ? C.cream : C.dim, 1, 'right');
              y += 9;
            }
            U.fill(g, 10, 140, 142, 1, C.hi);
            U.text(r.clear ? 'ALL 16 CLEARED' : 'REACHED ' + r.at, 12, 145, r.clear ? '#ffd23f' : C.help); U.text('COMBO ' + r.combo, 150, 145, C.help, 1, 'right');
          });
          K.window(g, 160, 32, 154, 126, HR.ph === 'name' ? 'NEW HIGH SCORE' : 'TOP 5', 'hres-' + (HR.ph === 'name' ? 'name' : 'top'), function () {
            if (!HR.counted) { U.text('...', 237, 90, C.dim, 2, 'center'); return; }
            if (HR.ph === 'name') { initials(g); return; }
            U.drawTop5(g, 166, 54, 142, r.rank);
            if (r.rank < 0) U.text(r.score > 0 ? 'NOT IN THE TOP 5 YET' : 'NO POINTS THIS TIME', 237, 145, C.muted, 1, 'center');
          }, { noLight: true, accent: HR.ph === 'name' ? C.yel : null });
          if (HR.ph === 'table' && HR.counted) { U.mdChoices(g, 6, 165, 308, CH, HR.sel); K.foot(g, CH[HR.sel] === 'AGAIN' ? 'ANOTHER RUN FROM 1-1' : 'BACK TO GAME MODES', 'A: CHOOSE  B: BACK'); }
          else if (HR.ph === 'name') K.foot(g, 'THREE LETTERS FOR THE TABLE', 'START: DONE');
          else K.foot(g, '', 'A: SKIP');
          U.drawTalk(g);
        },
        sides: function (g) { U.mdSides(g); }
      });
      function initials(g) {   // RANK n, then the three letters three times their size, the one being set between two blinking arrows
        var C = U.mk.C, r = HR.r, i, x, on = Math.floor(U.now() * 3) % 3 > 0;
        U.text('RANK ' + (r.rank + 1), 237, 52, '#ffd23f', 2, 'center');
        for (i = 0; i < 3; i++) {
          x = 205 + i * 24;
          if (i === HR.cur) { U.fill(g, x - 3, 76, 21, 27, '#262838'); if (on) { U.arrow(g, x + 5, 71, '#ffd23f', true); U.arrow(g, x + 5, 106, '#ffd23f'); } U.fill(g, x - 1, 101, 17, 2, '#ffd23f'); }
          U.text(HR.nm[i], x, 79, i === HR.cur ? '#ffd23f' : '#ffffff', 3);
        }
        U.text('UP, DOWN: THE LETTER', 237, 118, C.help, 1, 'center');
        U.text('LEFT, RIGHT: MOVE', 237, 128, C.help, 1, 'center');
        U.text('A: NEXT   START: DONE', 237, 138, C.muted, 1, 'center');
      }
    })();
