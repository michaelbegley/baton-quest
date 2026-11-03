    // ---------- 75-ui-codex-codes.js: the codex's CODES page (UI and ENGINE, the director's, 2 Nov; QUEST-API.md part 19) ----------
    // The eight cheat codes as a collection. Beating each boss for the first time teaches one (THE INBOX: TALL ORDER, THE SERVER ROOM: LIGHT WORKLOAD,
    // THE CLOUD: WORK FROM HOME, THE BACKLOG: PETTY CASH), and a code typed in on the CODES screen is known from then on. The file keeps them (Q.SAVE.codes);
    // a file from before this page learns the codes of the bosses it has already beaten, quietly. The page opens once one code is known; the rest read ???.
    (function () {
      var U = Q.ui, SEC = U.codexSec || (U.codexSec = {}), ORD = U.codexOrder;
      var TEACH = { 'w1-boss': 'tall', 'w2-boss': 'light', 'w3-boss': 'wfh', 'w4-boss': 'cash' };
      function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
      var ROWS = ['tall', 'light', 'wfh', 'cash', 'green', 'floors', 'toolkit', 'finish'], FROM = { tall: 1, light: 2, wfh: 3, cash: 4 };   // the bosses' four first, in their order
      function ids() { var out = [], id, i; for (i = 0; i < ROWS.length; i++) if (own(Q.CHEAT, ROWS[i])) out.push(ROWS[i]); for (id in Q.CHEAT) if (own(Q.CHEAT, id) && out.indexOf(id) < 0) out.push(id); return out; }
      function codesOf(s, door) {   // the file's known codes; a file from before this page learns, once, the codes of the bosses it beat (but the one at this door)
        var b; if (!s) return {};
        if (!s.codes || typeof s.codes !== 'object') {
          s.codes = {};
          for (b in TEACH) if (own(TEACH, b) && b !== door && s.cleared && s.cleared[b] && own(Q.CHEAT, TEACH[b])) s.codes[TEACH[b]] = true;
        }
        return s.codes;
      }
      function known() { return codesOf(Q.SAVE); }
      function count() { var k = known(), l = ids(), n = 0, i; for (i = 0; i < l.length; i++) if (k[l[i]]) n++; return n; }
      function said(id) { return String(Q.CHEAT[id].code || '').toUpperCase(); }   // its eight presses, in words
      U.codesKnown = function () { var k = known(), l = ids(), out = [], i; for (i = 0; i < l.length; i++) if (k[l[i]]) out.push(l[i]); return out; };   // for checks
      Q.knowCode = function (id, quiet, door) {   // a code is known from now on; true when it is new
        var k = codesOf(Q.SAVE, door); if (!id || !own(Q.CHEAT, id) || k[id]) return false;
        k[id] = true;
        if (!quiet) Q.toast('NEW CODE: ' + Q.CHEAT[id].name + '! IT IS IN THE CODEX.', 4);
        return true;
      };
      Q.on('level', function (d) {   // an arena's door: its boss was beaten and its rescue is done
        var id = d && TEACH[d.id];
        if (id && !(Q.encoreOn && Q.encoreOn()) && Q.knowCode(id, false, d.id)) Q.saveGame();
      });
      var typed = Q.code;
      Q.code = function (list) {   // a code typed in on the CODES screen: known from now on, done or not
        var r = typed.apply(this, arguments);
        if (r && r.id && Q.knowCode(r.id, true)) Q.saveGame();
        return r;
      };
      if (ORD && ORD.indexOf('codes') < 0) ORD.splice(ORD.indexOf('stars') + 1, 0, 'codes');   // its tab after STARS
      SEC.codes = {
        name: 'CODES',
        open: function () { return count() > 0; },
        col: function () { return '#ff8a1e'; },
        rows: function () { return ids().length; },
        title: function () { return 'TYPE THEM IN: PAUSE, THEN CODES'; },
        count: function () { return 'KNOWN ' + count() + '/' + ids().length; },
        hint: function () { return 'LEFT/RIGHT: PAGE   UP/DOWN: CHOOSE   B: BACK'; },
        tab: function (g, x, y) { U.fill(g, x + 5, y + 1, 3, 11, '#ff8a1e'); U.fill(g, x + 1, y + 5, 11, 3, '#ff8a1e'); U.fill(g, x + 6, y + 6, 1, 1, '#14161f'); },   // a small cross of a D-pad
        draw: function (g, sub, sel) {
          var l = ids(), k = known(), i, id, y, on, pick = null, c;
          for (i = 0; i < l.length; i++) {
            id = l[i]; y = 47 + i * 12; on = sel === i;
            if (on) { U.fill(g, 14, y - 2, 292, 11, '#262838'); pick = id; }
            if (k[id]) {
              U.text(Q.CHEAT[id].name, 22, y, on ? '#ffd23f' : '#f6efe2');
              U.text(said(id), 298, y, on ? '#ffd23f' : '#8f9ac8', 1, 'right');
            } else U.text('???', 22, y, '#5d6378');
          }
          U.fill(g, 14, 147, 292, 1, '#2a2c3a');
          if (!pick) return;
          if (!k[pick]) { U.text(FROM[pick] ? 'THE BOSS OF ' + U.worldName(FROM[pick]) + ' KNOWS THIS ONE.' : 'NOT KNOWN YET. IT IS OUT THERE SOMEWHERE.', 160, 156, '#6f778c', 1, 'center'); return; }
          c = Q.CHEAT[pick];
          U.text(c.what || c.name, 160, 154, '#c3c7d4', 1, 'center');
          if (!c.once) U.text(Q.cheatOn && Q.cheatOn(pick) ? 'THIS FILE: ON (TYPE IT AGAIN FOR OFF)' : 'THIS FILE: OFF', 160, 164, Q.cheatOn && Q.cheatOn(pick) ? '#7bd35a' : '#6f778c', 1, 'center');
        }
      };
    })();
