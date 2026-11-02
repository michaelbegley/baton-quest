    // ---------- 75-ui-codex-sprint.js: the codex's SPRINT REVIEW page (UI, builder 5; QUEST-API.md part 14.3) ----------
    // The 16 with a par (each world's three levels and its boss fight) in four blocks, one a world: each row its number, its best time and its par as m:ss,
    // and the clock when the best is at or under par. Up and down walk the 16; the chosen one's name and how it stands go underneath. THE ENCORE's best
    // time, once there is one, on a line of its own. Times are ENGINE's (Q.SAVE.best, Q.PAR, Q.SAVE.encore); with none yet every row reads -:--.
    (function () {
      var U = Q.ui, SEC = U.codexSec || (U.codexSec = {});
      var BX = [16, 162], BY = [44, 93];   // the four blocks: worlds 1 and 2 above, 3 and 4 below
      function label(n, j, id) { return j === 3 ? n + '-BOSS' : (/^w\d-\d$/.test(id) ? id.slice(1) : n + '-' + (j + 1)); }   // 1-2, or 1-BOSS for the fight
      function name(id) { var d = Q.LEVEL[id]; return d && d.name ? String(d.name).toUpperCase() : id.toUpperCase(); }
      function under() { var l = U.parLevels(), n = 0, i; for (i = 0; i < l.length; i++) if (U.underPar(l[i])) n++; return n; }
      SEC.sprint = {
        name: 'SPRINT REVIEW',
        col: function () { return '#2ec4b6'; },
        rows: function () { return U.parLevels().length; },
        title: function () { return "EACH LEVEL'S BEST TIME, THEN ITS PAR"; },
        count: function () { return 'PAR ' + under() + '/' + U.parLevels().length; },
        hint: function () { return 'LEFT/RIGHT: PAGE   UP/DOWN: CHOOSE   B: BACK'; },
        tab: function (g, x, y) { U.clockIcon(g, x + 3, y + 3, true); },
        draw: function (g, sub, sel) {
          var n, j, k, id, x, y, on, b, p, pick = null, e = U.encoreBest(), s, list;
          for (n = 1; n <= 4; n++) {
            x = BX[(n - 1) % 2]; y = BY[n > 2 ? 1 : 0];
            U.text(n + ' ' + U.worldName(n), x + 2, y, U.worldCol(n));
            list = U.parLevels(n);
            for (j = 0; j < list.length; j++) {
              id = list[j]; k = (n - 1) * 4 + j; on = sel === k; b = U.best(id); p = U.par(id);
              y = BY[n > 2 ? 1 : 0] + 11 + j * 9;
              if (on) { U.fill(g, x, y - 1, 142, 9, '#262838'); pick = { id: id, b: b, p: p, n: n, j: j }; }
              U.text(label(n, j, id), x + 4, y, on ? '#ffd23f' : '#c3c7d4');
              U.text(b ? U.mss(b) : '-:--', x + 80, y, b ? (U.underPar(id) ? '#ffd23f' : '#f6efe2') : '#5d6378', 1, 'right');
              U.text(p ? U.mss(p) : '-:--', x + 116, y, '#6f778c', 1, 'right');
              if (U.underPar(id)) U.clockIcon(g, x + 124, y - 1, true);
            }
          }
          if (e || Q.encoreOpen()) U.text('THE ENCORE  ' + (e ? 'BEST ' + U.mss(e) : 'NO TIME YET'), 160, 140, e ? '#ffd23f' : '#5d6378', 1, 'center');
          U.fill(g, 14, 151, 292, 1, '#2a2c3a');
          if (!pick) return;
          U.text(label(pick.n, pick.j, pick.id) + '  ' + name(pick.id), 160, 156, U.worldCol(pick.n), 1, 'center');
          s = 'BEST ' + (pick.b ? U.mss(pick.b) : '-:--') + '   PAR ' + (pick.p ? U.mss(pick.p) : '-:--') + '   ';
          if (!pick.b) s += 'NO TIME YET';
          else if (pick.p && pick.b <= pick.p) s += 'AT OR UNDER PAR';
          else if (pick.p) s += 'OVER BY ' + U.mss(pick.b - pick.p);
          U.text(s.replace(/ +$/, ''), 160, 166, pick.b && pick.p && pick.b <= pick.p ? '#ffd23f' : '#c3c7d4', 1, 'center');
        }
      };
    })();
