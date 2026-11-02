    // ---------- 75-ui-codex-stars.js: the codex's GOLD STARS pages (UI, builder 5; QUEST-API.md part 14.2) ----------
    // Eight stars a page, in part 14.2's order. A won star: its gold icon, its name, WON; chosen, its won line underneath. A locked one: a dim icon, its name,
    // its progress like 12/25 when its rule counts toward a need; chosen, its how (two lines of 46). A secret one (afk, root): ??? for name and how until won.
    // The words are STORY's (Q.STARTEXT); with none yet, each star's id stands in for its name.
    (function () {
      var U = Q.ui, SEC = U.codexSec || (U.codexSec = {}), PER = 8;
      function ids() { return U.starIds(); }
      SEC.stars = {
        name: 'GOLD STARS',
        col: function () { return '#ffd23f'; },
        pages: function () { return Math.max(1, Math.ceil(ids().length / PER)); },
        rows: function (sub) { return Math.max(1, Math.min(PER, ids().length - sub * PER)); },
        title: function (sub) { var n = ids().length; return 'STARS ' + (sub * PER + 1) + ' TO ' + Math.min(n, sub * PER + PER) + ' OF ' + n; },
        count: function () { var c = U.starCount(); return 'WON ' + c.n + '/' + c.all; },
        hint: function () { return 'LEFT/RIGHT: PAGE   UP/DOWN: CHOOSE   B: BACK'; },
        tab: function (g, x, y) { U.starIcon(g, x + 1, y + 1, true); },
        draw: function (g, sub, sel) {
          var list = ids(), i, id, y, on, won, tx, need, lines, pick = null;
          for (i = 0; i < PER && sub * PER + i < list.length; i++) {
            id = list[sub * PER + i]; tx = U.starText(id); won = U.starWon(id); y = 44 + i * 13; on = sel === i;
            if (on) { U.fill(g, 14, y - 1, 292, 13, '#262838'); pick = { id: id, tx: tx, won: won }; }
            U.starIcon(g, 18, y, won);
            U.item(won || !tx.secret ? tx.name : '???', 40, y + 3, on, !won && !on);
            need = won || tx.secret ? null : U.starNeed(id);
            if (won) U.text('WON', 302, y + 3, '#ffd23f', 1, 'right');
            else if (need) {   // a counting star: how far along, as a number and a thin bar
              U.text(need.have + '/' + need.need, 302, y + 3, on ? '#ffd23f' : '#8a93a8', 1, 'right');
              U.fill(g, 196, y + 5, 52, 3, '#0b0c10'); U.fill(g, 197, y + 6, Math.round(50 * need.have / need.need), 1, '#c9a640');
            }
          }
          U.fill(g, 14, 151, 292, 1, '#2a2c3a');
          if (!pick) return;
          if (pick.won) { U.text(pick.tx.won || 'WON.', 160, 160, '#ffd23f', 1, 'center'); return; }   // the joke, once won
          if (pick.tx.secret) { U.text('???', 160, 160, '#5d6378', 1, 'center'); return; }
          lines = Q.wrap(pick.tx.how || 'NOT WON YET.', 46);
          for (i = 0; i < Math.min(2, lines.length); i++) U.text(lines[i], 160, (lines.length > 1 ? 156 : 160) + i * 10, '#c3c7d4', 1, 'center');
        }
      };
    })();
