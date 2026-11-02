    // ---------- 75-ui-codes.js (UI, the director's, 2 Nov): the CODES screen, from the pause menu (QUEST-API 14.10 item 11) ----------
    // Eight boxes fill with each press (the arrows, A and B); the eighth press tries the code (Q.code). A code that works says what it did, a switch says ON
    // or OFF (the same code again turns it off), a wrong one buzzes. Below: the switches this file has on. START goes back to the pause menu.
    (function () {
      var U = Q.ui, CD = { from: 'level', keys: [], msg: '', msgT: 0, col: '#f6efe2', wait: 0 }, NAMES = ['up', 'down', 'left', 'right', 'a', 'b'];
      var SKY = U.grad('#0b0c10', '#1d2858', 19);
      U.codesAt = function () { return { keys: CD.keys.slice(), msg: CD.msg }; };   // for checks
      function glyph(g, k, cx, cy, col) {   // an arrow or a letter, about 9 pixels across, centred on cx, cy
        var i;
        g.fillStyle = col;
        if (k === 'a' || k === 'b') { U.text(k.toUpperCase(), cx - 5, cy - 6, col, 2); return; }
        for (i = 0; i < 5; i++) {
          if (k === 'up') g.fillRect(cx - i, cy - 4 + i, i * 2 + 1, 1);
          if (k === 'down') g.fillRect(cx - i, cy + 4 - i, i * 2 + 1, 1);
          if (k === 'left') g.fillRect(cx - 4 + i, cy - i, 1, i * 2 + 1);
          if (k === 'right') g.fillRect(cx + 4 - i, cy - i, 1, i * 2 + 1);
        }
        if (k === 'up' || k === 'down') g.fillRect(cx - 1, k === 'up' ? cy + 1 : cy - 5, 3, 5); else g.fillRect(k === 'left' ? cx + 1 : cx - 5, cy - 1, 5, 3);
      }
      function say(t, col) { CD.msg = t; CD.col = col; CD.msgT = 2.6; }
      Q.defScene('codes', {
        enter: function (o) { U.entered(); CD.from = (o && o.from) || 'level'; CD.keys = []; CD.msg = ''; CD.msgT = 0; CD.wait = 0; },
        update: function (dt) {
          var i, r;
          if (CD.msgT > 0) CD.msgT -= dt;
          if (CD.wait > 0) { CD.wait -= dt; if (CD.wait <= 0) CD.keys = []; return; }
          if (U.press('start')) { Q.sfx('back'); Q.go('pause', { from: CD.from, back: 'codes' }); return; }
          for (i = 0; i < NAMES.length; i++) if (U.press(NAMES[i]) && CD.keys.length < 8) { CD.keys.push(NAMES[i]); Q.sfx('move'); }
          if (CD.keys.length < 8) return;
          r = Q.code(CD.keys); CD.wait = 0.6;
          if (Q.scene !== 'codes') return;   // EARLY FINISH went back to the level and ended it
          if (!r.ok) { if (r.id) say(r.said || 'NOT NOW.', '#ff8a8a'); else { say('NO SUCH CODE.', '#ff8a8a'); Q.sfx('nope'); } return; }
          say(r.said, r.once || r.on ? '#ffd23f' : '#c3c7d4');
        },
        draw: function (g) {
          var i, x, id, c, y = 128, any = false, on;
          U.bands(g, SKY, 0, 11);
          U.text('ENTER A CODE', 160, 14, '#f6efe2', 2, 'center');
          U.text('THE ARROWS, A AND B. EIGHT PRESSES.', 160, 36, '#8f9ac8', 1, 'center');
          for (i = 0; i < 8; i++) {
            x = 40 + i * 31;
            U.box(g, x, 52, 26, 26, i < CD.keys.length ? '#ffd23f' : '#3c4680', '#1d1d24');
            if (i < CD.keys.length) glyph(g, CD.keys[i], x + 13, 65, '#f6efe2');
            else if (i === CD.keys.length && Math.floor(U.now() * 2) % 2) U.fill(g, x + 8, 70, 10, 2, '#7f8ab8');
          }
          if (CD.msgT > 0 && CD.msg) U.text(CD.msg, 160, 92, CD.col, 1, 'center');
          U.text('SWITCHED ON IN THIS FILE', 160, 112, '#7f8ab8', 1, 'center');
          for (id in Q.CHEAT) if (Object.prototype.hasOwnProperty.call(Q.CHEAT, id)) {
            c = Q.CHEAT[id]; if (c.once) continue;
            on = Q.cheatOn(id); if (!on) continue;
            any = true; U.text(c.name, 160, y, '#ffd23f', 1, 'center'); y += 10;
          }
          if (!any) U.text('NONE', 160, y, '#4a5280', 1, 'center');
          U.text('THE SAME CODE AGAIN SWITCHES IT OFF.   START: BACK', 160, 186, '#8f9ac8', 1, 'center');
        },
        leave: function () {}
      });
    })();
