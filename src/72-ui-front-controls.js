    // ---------- 72-ui-front-controls.js (B17 FRONT END, 2 Nov): OPTIONS' CONTROLS page, in the title scene (72-ui-title.js) ----------
    // Three tabs, KEYS, TOUCH and CONTROLLER (left and right, or A, walk them; B back to OPTIONS), each with a small drawing of our own (a keyboard,
    // the 9F POCKET handheld, a controller) whose buttons wear the colours of what they do, and the list beside it. The keys are the page's and the
    // office's (Space, Z or K jump; X or J the baton; C or L dash; Enter or P pause); a controller's are the page's (bottom: jump; right: baton; left, top
    // or a bumper: dash; Start). Esc and a controller's Back are the runtime's: back to the 9F desktop.
    (function () {
      var U = Q.ui, FE = U.fe || (U.fe = { ph: {} });
      var TABS = ['KEYS', 'TOUCH', 'CONTROLLER'], CA = '#ffd23f', CB = '#ff8a1e', CC = '#2ec4b6', CS = '#6fa8ec', CM = '#f6efe2';   // A, B, C, Start, move
      var ROWS = {
        KEYS: [['MOVE', 'ARROWS OR W A S D', CM], ['JUMP', 'SPACE, Z OR K', CA], ['BATON', 'X OR J', CB], ['NOTE', 'HOLD X, THEN LET GO', CB], ['DASH', 'C OR L', CC],
          ['DROP', 'DOWN, ON A THIN SHELF', CM], ['DOOR', 'UP, AT A DOOR', CM], ['PAUSE', 'ENTER OR P', CS]],
        TOUCH: [['MOVE', 'THE D-PAD: SLIDE A THUMB', CM], ['JUMP', 'A', CA], ['BATON', 'B', CB], ['NOTE', 'HOLD B, THEN LET GO', CB], ['DASH', 'C', CC], ['PAUSE', 'START', CS]],
        CONTROLLER: [['MOVE', 'D-PAD OR LEFT STICK', CM], ['JUMP', 'THE BOTTOM BUTTON', CA], ['BATON', 'THE RIGHT BUTTON', CB], ['NOTE', 'HOLD IT, THEN LET GO', CB],
          ['DASH', 'LEFT OR TOP, A BUMPER', CC], ['PAUSE', 'START', CS]]
      };
      function f(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
      function key(g, x, y, w, c) { f(g, x, y, w, 7, '#0b0c10'); f(g, x + 1, y, w - 2, 6, c || '#5d6378'); f(g, x + 1, y, w - 2, 1, c ? '#ffffff' : '#7f8ab8'); }
      function keyboard(g, x, y) {   // 90 by 44: four rows of keys, the ones the game uses lit
        var i, lit = { Q0: 0, W: CM, A: CM, S: CM, D: CM, Z: CA, K: CA, X: CB, J: CB, C: CC, L: CC, P: CS }, r1 = 'QWERTYUIOP', r2 = 'ASDFGHJKL', r3 = 'ZXCVBNM';
        f(g, x, y, 90, 44, '#1d1d24'); f(g, x + 1, y + 1, 88, 42, '#3a3d52'); f(g, x + 1, y + 1, 88, 1, '#4e5270');
        for (i = 0; i < 10; i++) key(g, x + 4 + i * 8, y + 4, 7, lit[r1.charAt(i)] || '');
        for (i = 0; i < 9; i++) key(g, x + 6 + i * 8, y + 12, 7, lit[r2.charAt(i)] || '');
        key(g, x + 78, y + 12, 9, CS);   // ENTER
        for (i = 0; i < 7; i++) key(g, x + 9 + i * 8, y + 20, 7, lit[r3.charAt(i)] || '');
        key(g, x + 22, y + 28, 40, CA);   // SPACE
        key(g, x + 74, y + 20, 7, CM); key(g, x + 66, y + 28, 7, CM); key(g, x + 74, y + 28, 7, CM); key(g, x + 82, y + 28, 7, CM);   // the arrows
      }
      function disc(g, cx, cy, r, c, hi) { var dy, hw; for (dy = -r; dy <= r; dy++) { hw = Math.floor(Math.sqrt(r * r - dy * dy) + 0.5); f(g, cx - hw, cy + dy, hw * 2 + 1, 1, dy < 0 && hi ? hi : c); } }
      function cross(g, x, y, c) { f(g, x + 4, y, 5, 13, '#0b0c10'); f(g, x, y + 4, 13, 5, '#0b0c10'); f(g, x + 5, y + 1, 3, 11, c); f(g, x + 1, y + 5, 11, 3, c); }
      function pocket(g, x, y) {   // the 9F POCKET, upright, 52 by 80: the screen, the badge, the D-pad, A, B, C and START
        f(g, x + 1, y, 50, 80, '#1d1d24'); f(g, x, y + 1, 52, 78, '#1d1d24');
        f(g, x + 2, y + 1, 48, 77, '#f6efe2'); f(g, x + 1, y + 2, 50, 75, '#f6efe2'); f(g, x + 2, y + 70, 48, 7, '#e2d6bf');
        f(g, x + 6, y + 5, 40, 30, '#2a2d3a'); f(g, x + 9, y + 8, 34, 22, '#0f2a33');
        f(g, x + 12, y + 12, 12, 3, '#ffd23f'); f(g, x + 12, y + 17, 18, 3, '#2ec4b6'); f(g, x + 12, y + 23, 6, 4, '#f6efe2');   // a tiny title on its screen
        disc(g, x + 9, y + 40, 2, '#ff8a1e');
        cross(g, x + 5, y + 46, CM);
        disc(g, x + 42, y + 49, 4, CA, '#fff0b0'); disc(g, x + 33, y + 55, 4, CB, '#ffb36a'); disc(g, x + 42, y + 60, 3, CC, '#8ff0e6');
        f(g, x + 19, y + 66, 14, 4, '#0b0c10'); f(g, x + 20, y + 66, 12, 3, CS);   // START
      }
      function pad(g, x, y) {   // a controller, 92 by 46: its grips, the D-pad, the left stick, four face buttons, the bumpers and Start
        f(g, x + 6, y, 22, 5, '#0b0c10'); f(g, x + 7, y + 1, 20, 3, CC); f(g, x + 64, y, 22, 5, '#0b0c10'); f(g, x + 65, y + 1, 20, 3, CC);   // the bumpers (dash)
        f(g, x + 2, y + 4, 88, 26, '#1d1d24'); f(g, x, y + 8, 92, 22, '#1d1d24'); f(g, x + 2, y + 28, 24, 16, '#1d1d24'); f(g, x + 66, y + 28, 24, 16, '#1d1d24');
        f(g, x + 3, y + 5, 86, 24, '#5d6378'); f(g, x + 1, y + 9, 90, 20, '#5d6378'); f(g, x + 3, y + 28, 22, 15, '#5d6378'); f(g, x + 67, y + 28, 22, 15, '#5d6378');
        f(g, x + 3, y + 5, 86, 2, '#7f8ab8');
        cross(g, x + 8, y + 10, CM);
        disc(g, x + 30, y + 26, 5, '#0b0c10'); disc(g, x + 30, y + 26, 3, '#3a3d52', '#4e5270');   // the left stick
        disc(g, x + 72, y + 25, 3, CA, '#fff0b0'); disc(g, x + 79, y + 18, 3, CB, '#ffb36a'); disc(g, x + 65, y + 18, 3, CC, '#8ff0e6'); disc(g, x + 72, y + 11, 3, CC, '#8ff0e6');
        f(g, x + 43, y + 14, 8, 3, '#0b0c10'); f(g, x + 44, y + 14, 6, 2, CS);   // START
      }
      FE.ph.controls = {
        enter: function (sel) { FE.tab = typeof sel === 'number' ? Q.clamp(sel, 0, 2) : 0; },
        update: function () {
          if (FE.press('b')) { U.mk.snd('back'); FE.to('options', 'CONTROLS'); return; }
          if (FE.press('left')) { FE.tab = (FE.tab + 2) % 3; U.mk.snd('tab'); }
          else if (FE.press('right') || FE.press('a') || FE.press('c')) { FE.tab = (FE.tab + 1) % 3; U.mk.snd('tab'); }
        },
        draw: function (g) {   // B20: in the menu kit's window, its tabs on the kit's tab bar (the open one with the focus: the yellow bar)
          var i, name = TABS[FE.tab], rows = ROWS[name], y;
          U.mk.window(g, 6, 3, 308, 174, 'CONTROLS', 'fe-controls', function () {
            U.mk.tabs(g, 14, 22, 292, TABS, FE.tab, true);
            if (name === 'KEYS') keyboard(g, 12, 66); else if (name === 'TOUCH') pocket(g, 30, 48); else pad(g, 10, 64);
            for (i = 0; i < rows.length; i++) {
              y = 42 + i * 15;
              U.fill(g, 112, y + 1, 3, 3, rows[i][2]);
              U.text(rows[i][0], 120, y, rows[i][2] === CM ? '#c3c7d4' : rows[i][2]);
              U.text(rows[i][1], 160, y, '#f6efe2');
            }
            U.text(name === 'TOUCH' ? 'ON A PHONE OR TABLET: THE 9F POCKET' : name === 'KEYS' ? 'ESC: BACK TO THE 9F DESKTOP' : 'BACK: TO THE 9F DESKTOP', 160, 164, U.mk.C.dim, 1, 'center');
          });
          FE.foot('LEFT, RIGHT OR C: KEYS, TOUCH, CONTROLLER', 'B: BACK');
        }
      };
    })();
