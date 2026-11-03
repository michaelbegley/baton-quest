    // ---------- 75-ui-codex-moves.js (UI, B21 MOVES, 2 Nov): the codex's MOVES page (QUEST-API.md part 23) ----------
    // Every move in Q.MOVES with a picture of the conductor in its pose (the hero's own frames: QUICK KEYS 12, PAUSE TO THINK 13, FIRM HAND 15, PUSHBACK 18,
    // FOLLOW UP 19), its name and how line; the one chosen has its codex line (Q.story.moves) at the foot. A move not learned yet reads ???. The page opens once
    // a new move is known (PUSHBACK or FOLLOW UP), so every page list before then is as it was. Its tab comes after SPRINT REVIEW and before HOLD MUSIC:
    // CODES keeps its place after STARS (director_codes_test) and HOLD MUSIC stays the last page.
    (function () {
      var U = Q.ui, SEC = U.codexSec || (U.codexSec = {}), ORD = U.codexOrder;
      var POSE = { dash: 12, hover: 13, pound: 15, walljump: 18, doublejump: 19 };
      function list() { return Q.MOVES || ['dash', 'hover', 'pound']; }
      function known(a) { return !!(U.learned && U.learned(a)); }
      function count() { var l = list(), n = 0, i; for (i = 0; i < l.length; i++) if (known(l[i])) n++; return n; }
      U.movesKnown = function () { var l = list(), out = [], i; for (i = 0; i < l.length; i++) if (known(l[i])) out.push(l[i]); return out; };   // for checks
      if (ORD && ORD.indexOf('moves') < 0) ORD.splice(ORD.indexOf('music') < 0 ? ORD.length : ORD.indexOf('music'), 0, 'moves');   // its tab before HOLD MUSIC
      SEC.moves = {
        name: 'MOVES', pages: function () { return 1; }, rows: function () { return list().length; },
        open: function () { return known('walljump') || known('doublejump'); },
        col: function () { return '#ff8a1e'; }, title: function () { return 'THE CONDUCTOR\'S MOVES'; },
        count: function () { return 'KNOWN ' + count() + '/' + list().length; },
        hint: function () { return 'UP/DOWN: CHOOSE   LEFT/RIGHT: PAGE   B: BACK'; },
        tab: function (g, x, y) { U.sprOr(g, 'ic-walljump', 0, x + 2, y + 2); },
        draw: function (g, sub, sel) {
          var l = list(), i, a, y, on, id = U.hero ? U.hero() : 'hero', txt, lines;
          for (i = 0; i < l.length; i++) {
            a = Q.ABILITY[l[i]] || { name: l[i].toUpperCase(), how: '' }; y = 44 + i * 21; on = sel === i;
            if (on) U.fill(g, 14, y - 1, 292, 21, '#262838');
            U.fill(g, 18, y, 18, 20, '#0b0c10');
            if (known(l[i])) {
              Q.spr(g, id, POSE[l[i]] || 0, 19, y);   // his pose, the whole 16 by 20
              U.item(a.name, 44, y + 2, on); U.text(a.how, 44, y + 11, '#8a93a8');
              Q.spr(g, 'ic-' + l[i], 0, 292, y + 4);
            } else { U.text('?', 24, y + 6, '#5d6378'); U.item('???', 44, y + 6, on, !on); }
          }
          U.fill(g, 14, 151, 292, 1, '#2a2c3a');
          a = l[Math.min(sel, l.length - 1)]; txt = Q.story && Q.story.moves && Q.story.moves[a];
          if (a && known(a) && txt) { lines = Q.wrap(String(txt), 46); for (i = 0; i < Math.min(2, lines.length); i++) U.text(lines[i], 160, 156 + i * 10, '#c3c7d4', 1, 'center'); }
          else if (a) U.text('NOT LEARNED YET.', 160, 160, '#5d6378', 1, 'center');
        }
      };
    })();
