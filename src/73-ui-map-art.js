    // ---------- 73-ui-map-art.js: the map's pictures (UI, builder 5): the inside of the 9F computer as a circuit board, the world chips, a padlock ----------
    // 'u5-board' (320 by 200, built once): a dark green board with thin traces, chips with pins, little rings and marks. The stops, the path and who stands
    // on it are drawn over it each frame by 73-ui-map.js, with Q.ui.chip (a world's chip: its emblem, grey and locked, or ticked when cleared).
    (function () {
      var U = Q.ui;
      function f(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
      Q.defSprite('u5-board', { w: 320, h: 200, n: 1, draw: function (g) {
        var seed = 11, i, x, y, w, h, k;
        function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
        f(g, 0, 0, 320, 200, '#0b241e');
        for (y = 0; y < 200; y += 10) f(g, 0, y, 320, 1, '#0d2a23');
        for (x = 0; x < 320; x += 10) f(g, x, 0, 1, 200, '#0d2a23');
        for (i = 0; i < 46; i++) {   // thin traces running in straight lines and right angles
          x = Math.floor(rnd() * 32) * 10; y = Math.floor(rnd() * 20) * 10; w = 20 + Math.floor(rnd() * 8) * 10; h = 10 + Math.floor(rnd() * 5) * 10;
          f(g, x, y, w, 1, '#174a3d'); f(g, x + w, y, 1, h, '#174a3d'); f(g, x + w - 1, y + h - 1, 3, 3, '#1f5f4e');
        }
        for (i = 0; i < 9; i++) {   // chips with their pins
          x = 8 + Math.floor(rnd() * 290); y = 20 + Math.floor(rnd() * 150); w = 14 + Math.floor(rnd() * 3) * 6; h = 8 + Math.floor(rnd() * 2) * 4;
          for (k = 2; k < w - 1; k += 3) { f(g, x + k, y - 2, 1, 2, '#8f9aa8'); f(g, x + k, y + h, 1, 2, '#8f9aa8'); }
          f(g, x, y, w, h, '#14171f'); f(g, x, y, w, 1, '#2a2f3d'); f(g, x + 2, y + 2, 2, 2, '#2a2f3d');
        }
        for (i = 0; i < 26; i++) { x = Math.floor(rnd() * 316); y = Math.floor(rnd() * 196); f(g, x, y, 3, 3, '#2e7a62'); f(g, x + 1, y + 1, 1, 1, '#0b241e'); }   // little rings
        for (i = 0; i < 16; i++) { x = Math.floor(rnd() * 300); y = Math.floor(rnd() * 190); f(g, x, y, 4 + Math.floor(rnd() * 8), 1, '#3f7f6b'); }   // marks printed on the board
      } });
      U.WORLDCOL = { 1: '#2f7de1', 2: '#2ec4b6', 3: '#6fb8ff', 4: '#a070e0' };
      U.WORLDNAME = { 1: 'THE INBOX', 2: 'THE SERVER ROOM', 3: 'THE CLOUD', 4: 'THE BACKLOG' };
      U.worldName = function (n) { var w = Q.WORLD[n]; return w && w.name ? String(w.name) : U.WORLDNAME[n] || 'WORLD ' + n; };
      U.worldCol = function (n) { var w = Q.WORLD[n]; return w && typeof w.color === 'string' && w.color.charAt(0) === '#' ? w.color : U.WORLDCOL[n] || '#2ec4b6'; };
      U.lock = function (g, x, y, col) {   // a padlock, 7 by 9
        f(g, x + 1, y, 5, 1, col); f(g, x + 1, y, 1, 4, col); f(g, x + 5, y, 1, 4, col);
        f(g, x, y + 3, 7, 6, col); f(g, x + 3, y + 5, 1, 2, '#1d1d24');
      };
      function emblem(g, n, x, y) {   // each world's sign, in its own look, about 14 by 12, centred on x, y
        if (n === 1) { f(g, x - 7, y - 4, 14, 9, '#1d1d24'); f(g, x - 6, y - 3, 12, 7, '#f6efe2'); f(g, x - 5, y - 3, 2, 1, '#8a93a8'); f(g, x - 3, y - 2, 2, 1, '#8a93a8'); f(g, x - 1, y - 1, 2, 1, '#8a93a8'); f(g, x + 1, y - 2, 2, 1, '#8a93a8'); f(g, x + 3, y - 3, 2, 1, '#8a93a8'); f(g, x + 4, y + 1, 2, 2, '#e0443a'); return; }
        if (n === 2) { f(g, x - 5, y - 6, 10, 13, '#1d1d24'); f(g, x - 4, y - 5, 8, 11, '#5d6378'); for (var i = 0; i < 3; i++) { f(g, x - 3, y - 4 + i * 4, 6, 2, '#2e3142'); f(g, x + 1, y - 4 + i * 4, 1, 1, i === 1 ? '#ff8a1e' : '#6dfc9a'); } return; }
        if (n === 3) { f(g, x - 7, y - 1, 15, 6, '#1d1d24'); f(g, x - 4, y - 4, 7, 4, '#1d1d24'); f(g, x - 6, y, 13, 4, '#ffffff'); f(g, x - 3, y - 3, 5, 4, '#ffffff'); f(g, x + 2, y - 1, 3, 2, '#ffffff'); f(g, x - 6, y + 3, 13, 1, '#cfe6ff'); return; }
        f(g, x - 6, y - 5, 12, 11, '#1d1d24'); f(g, x - 5, y - 4, 10, 4, '#ffd23f'); f(g, x - 5, y + 1, 10, 4, '#ff9ec6'); f(g, x - 4, y - 3, 6, 1, '#9a7a10'); f(g, x - 4, y + 2, 6, 1, '#a04a72');
      }
      U.chip = function (g, n, cx, cy, state, t) {   // a world's chip, 32 by 24, centred on cx, cy: 'open', 'cleared' or 'locked'
        var x = cx - 16, y = cy - 12, col = state === 'locked' ? '#4a5060' : U.worldCol(n), k;
        for (k = 0; k < 4; k++) { f(g, x - 3, y + 4 + k * 5, 3, 2, '#9aa3ad'); f(g, x + 32, y + 4 + k * 5, 3, 2, '#9aa3ad'); }   // its pins
        U.box(g, x, y, 32, 24, col, '#14171f');
        f(g, x + 2, y + 2, 28, 3, col);
        if (state === 'locked') U.lock(g, cx - 3, cy - 3, '#8a93a8'); else emblem(g, n, cx, cy + 2);
        U.text(String(n), x + 3, y + 1, state === 'locked' ? '#14171f' : '#ffffff');
        if (state === 'cleared') { f(g, x + 24, y - 3, 10, 9, '#1d1d24'); f(g, x + 25, y - 2, 8, 7, '#46b06a'); f(g, x + 26, y + 1, 2, 1, '#ffffff'); f(g, x + 27, y + 2, 2, 1, '#ffffff'); f(g, x + 29, y, 1, 2, '#ffffff'); f(g, x + 30, y - 1, 1, 1, '#ffffff'); }
        if (state === 'open' && Math.floor(t * 2) % 2) U.fill(g, x + 1, y + 23, 30, 1, '#ffd23f');   // the one to play next blinks along its foot
      };
      U.lateStop = function (g, n, x, y, t, fresh) {   // version 116: THE ENCORE's stage or THE ROOT FOLDER, ART's 16 by 16 at 2x (32 by 32, as wide as a chip) over its pad
        var id = 'map-' + n, x0 = x - 16, y0 = y - 52;
        if (Q.SPRITE[id]) U.sprite(g, id, Math.floor(t * 2) % Math.max(1, U.frames(id)), x0, y0, 2);
        else if (n === 'encore') {   // our own while ART's is missing: a little stage, its curtains and a light
          U.box(g, x0, y0 + 4, 32, 28, '#ffd23f', '#1e2236'); f(g, x0 + 2, y0 + 6, 28, 4, '#a8243a');
          f(g, x0 + 2, y0 + 10, 6, 18, '#a8243a'); f(g, x0 + 24, y0 + 10, 6, 18, '#a8243a'); f(g, x0 + 12, y0 + 12, 8, 14, '#fff4bf'); f(g, x0 + 2, y0 + 26, 28, 4, '#7a4a2a');
        } else {   // an old folder
          f(g, x0 + 2, y0 + 6, 12, 5, '#1d1d24'); f(g, x0 + 3, y0 + 7, 10, 4, '#9a7a40');
          U.box(g, x0, y0 + 10, 32, 22, '#c4a05e', '#e2c78e'); f(g, x0 + 4, y0 + 14, 24, 1, '#f2ead8');
        }
        if (fresh && Math.floor(t * 2) % 2) f(g, x0 + 2, y - 22, 28, 1, '#ffd23f');   // not done yet (its star not won): its foot blinks, as a world's to play next does
      };
      U.pad = function (g, x, y, lit) {   // where the conductor stands on the path: a round pad on the board
        f(g, x - 7, y - 1, 15, 4, '#1d1d24'); f(g, x - 6, y - 2, 13, 5, '#1d1d24');
        f(g, x - 6, y - 1, 13, 3, lit ? '#c9a640' : '#3c5a52'); f(g, x - 4, y - 1, 9, 1, lit ? '#ffe9a0' : '#557a70');
      };
    })();
