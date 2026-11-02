    // ---------- 81-w1-art-a.js: WORLD 1, THE INBOX: its palette, a tiny letter set, and its tiles (builder 6) ----------
    // Cream, envelope white, ink blue, flag red, night blue. Tiles are drawn in code once at start (Q.defSprite with draw); light from the top left.
    var W1C = {
      k: '#1d1d24', w: '#fffdf7', e: '#ece5d5', E: '#cfc4ad', c: '#f6efe2', C: '#ddd0b7', d: '#b9a887', D: '#8f7f62',
      n: '#4d74c4', b: '#2b4a8e', B: '#1a2c5a', r: '#d93a3a', R: '#8e1f2a', p: '#f47a68', y: '#ffd23f', Y: '#d9a521',
      s: '#d3d9e4', S: '#99a2b5', g: '#636c86', G: '#3c435a', m: '#24305f', M: '#141b38', t: '#2ec4b6', o: '#ff8a1e',
      a: '#c08a52', A: '#8a5d33', h: '#e2b47c', l: '#7a4a2a', L: '#55331d'
    };
    Q.w1 = Q.w1 || {};
    Q.w1.C = W1C;
    function w1R(g, col, x, y, w, h) { g.fillStyle = W1C[col] || col; g.fillRect(x, y, w, h); }
    // our own tiny letters, 3 by 5 (for labels on tiles: IN, OUT, MAYBE, PRIZE, WIN, the unread counts in the sky)
    var W1_TINY = {
      A: '25755', B: '65656', E: '74647', I: '72227', M: '57755', N: '75555', O: '75557', P: '75744', R: '75765', T: '72222',
      U: '55557', W: '55577', Y: '55222', Z: '71247', '0': '75557', '1': '26227', '2': '71747', '3': '71317', '4': '55711',
      '5': '74717', '6': '74757', '7': '71111', '8': '75757', '9': '75711', '+': '02720', '!': '22202', ',': '00012', 'K': '55655',
      L: '44447', D: '65556', S: '74717', C: '74447', H: '55755', G: '74557', F: '74644', V: '55552', X: '55255', J: '11157', Q: '75573'
    };
    function w1Tiny(g, s, x, y, col) {
      g.fillStyle = W1C[col] || col;
      for (var i = 0; i < s.length; i++) {
        var b = W1_TINY[s.charAt(i)]; if (!b) continue;
        for (var r = 0; r < 5; r++) { var v = parseInt(b.charAt(r), 16); for (var c = 0; c < 3; c++) if (v & (4 >> c)) g.fillRect(x + i * 4 + c, y + r, 1, 1); }
      }
    }
    Q.w1.tiny = w1Tiny;
    Q.w1.tinyW = function (s) { return s.length * 4 - 1; };

    // ---------- the ground: a wall of envelopes laid like bricks; on top (frame 0) a soft floor of envelopes ----------
    function w1Bricks(g, y0) {
      for (var i = 0; i < 4; i++) {
        var y = y0 + i * 4, off = (i % 2) * 4;
        w1R(g, 'C', 0, y, 16, 4); w1R(g, 'e', 0, y, 16, 1); w1R(g, 'd', 0, y + 3, 16, 1);
        for (var x = -off; x < 16; x += 8) { w1R(g, 'd', x + 7, y, 1, 4); w1R(g, 'E', x + 6, y + 1, 1, 2); }
      }
      w1R(g, 'n', 2, y0 + 1, 3, 1); w1R(g, 'r', 12, y0 + 9, 2, 1); w1R(g, 'n', 9, y0 + 13, 3, 1);
    }
    Q.defSprite('t1-solid', { w: 16, h: 16, n: 2, draw: function (g, f) {
      w1Bricks(g, 0);
      if (f) return;
      w1R(g, 'w', 0, 0, 16, 4); w1R(g, 'E', 0, 4, 16, 1); w1R(g, 'd', 0, 5, 16, 1);           // the soft floor: envelopes lying on top
      w1R(g, 'e', 7, 0, 1, 4); w1R(g, 'E', 7, 1, 1, 3); w1R(g, 'e', 15, 1, 1, 3);
      w1R(g, 'e', 1, 1, 2, 1); w1R(g, 'e', 3, 2, 2, 1); w1R(g, 'e', 5, 1, 1, 1);              // a flap's V on the left one
      w1R(g, 'e', 9, 1, 2, 1); w1R(g, 'e', 11, 2, 2, 1); w1R(g, 'e', 13, 1, 1, 1);
      w1R(g, 'r', 4, 3, 2, 1);
    } });
    // a thin tray of the sorting floor: a steel rim, envelopes standing in it, two brackets under it
    Q.defSprite('t1-oneway', { w: 16, h: 16, n: 1, draw: function (g) {
      w1R(g, 'w', 2, 0, 3, 2); w1R(g, 'e', 6, 0, 2, 2); w1R(g, 'w', 10, 0, 4, 2);
      w1R(g, 's', 0, 1, 16, 1); w1R(g, 'S', 0, 2, 16, 2); w1R(g, 'g', 0, 4, 16, 1); w1R(g, 'G', 0, 5, 16, 1);
      w1R(g, 'g', 2, 3, 1, 1); w1R(g, 'g', 6, 3, 1, 1); w1R(g, 'g', 10, 3, 1, 1); w1R(g, 'g', 14, 3, 1, 1);
      w1R(g, 'G', 2, 6, 2, 1); w1R(g, 'G', 2, 7, 1, 1); w1R(g, 'G', 12, 6, 2, 1); w1R(g, 'G', 13, 7, 1, 1);
    } });
    // paper spikes: three chunky spindles, outlined, on red bases (the bottom half hurts; the points start high enough to read first)
    Q.defSprite('t1-spike', { w: 16, h: 16, n: 1, draw: function (g) {
      for (var i = 0; i < 3; i++) {
        var x = 1 + i * 5;
        w1R(g, 'k', x + 1, 4, 2, 1); w1R(g, 'k', x, 5, 4, 8);                       // the outline, pointed
        w1R(g, 's', x + 1, 5, 2, 7); w1R(g, 'w', x + 1, 5, 1, 3); w1R(g, 'S', x + 2, 8, 1, 4);
        w1R(g, 'k', x - 1 < 0 ? 0 : x - 1, 12, x - 1 < 0 ? 5 : 6, 4); w1R(g, 'r', x, 13, 4, 2); w1R(g, 'p', x, 13, 1, 1); w1R(g, 'R', x + 3, 14, 1, 1);
      }
    } });
    // a parcel: cardboard, cream tape, a white label with an address
    Q.defSprite('t1-crate', { w: 16, h: 16, n: 1, draw: function (g) {
      w1R(g, 'k', 0, 0, 16, 16); w1R(g, 'a', 1, 1, 14, 14); w1R(g, 'h', 1, 1, 14, 2); w1R(g, 'A', 1, 13, 14, 2); w1R(g, 'A', 13, 3, 2, 10);
      w1R(g, 'C', 7, 1, 2, 14); w1R(g, 'c', 7, 1, 1, 14);
      w1R(g, 'w', 2, 6, 5, 4); w1R(g, 'n', 3, 7, 3, 1); w1R(g, 'n', 3, 8, 2, 1); w1R(g, 'r', 10, 5, 2, 2);
    } });
    // a pound block: a steel deposit box with rivets and a red band
    Q.defSprite('t1-pound', { w: 16, h: 16, n: 1, draw: function (g) {
      w1R(g, 'k', 0, 0, 16, 16); w1R(g, 'g', 1, 1, 14, 14); w1R(g, 'S', 1, 1, 14, 1); w1R(g, 'S', 1, 1, 1, 14); w1R(g, 'G', 1, 14, 14, 1); w1R(g, 'G', 14, 1, 1, 14);
      w1R(g, 'r', 1, 6, 14, 4); w1R(g, 'p', 1, 6, 14, 1); w1R(g, 'R', 1, 9, 14, 1);
      w1R(g, 's', 3, 3, 1, 1); w1R(g, 's', 12, 3, 1, 1); w1R(g, 's', 3, 12, 1, 1); w1R(g, 's', 12, 12, 1, 1);
    } });

    // ---------- belts of letters: envelopes ride a dark belt over rollers; four frames move them along (left belts run the other way) ----------
    function w1Belt(g, f, dir) {
      var sh = ((dir > 0 ? f : 4 - f) % 4) * 4, x;
      w1R(g, 'k', 0, 0, 16, 1); w1R(g, 'B', 0, 1, 16, 5); w1R(g, 'm', 0, 1, 16, 1);
      for (x = -8 + sh; x < 16; x += 8) { w1R(g, 'w', x + 1, 2, 4, 3); w1R(g, 'e', x + 1, 4, 4, 1); w1R(g, 'n', x + 2, 3, 2, 1); }
      w1R(g, 'k', 0, 6, 16, 1); w1R(g, 'b', 0, 7, 16, 9); w1R(g, 'n', 0, 7, 16, 1); w1R(g, 'B', 0, 15, 16, 1);
      for (x = 0; x < 2; x++) {   // two rollers, their spokes turning
        var cx = 4 + x * 8;
        w1R(g, 'G', cx - 2, 8, 5, 5); w1R(g, 'g', cx - 1, 8, 3, 5); w1R(g, 'g', cx - 2, 9, 5, 3);
        if (f % 2) w1R(g, 's', cx, 9, 1, 3); else w1R(g, 's', cx - 1, 10, 3, 1);
      }
      for (x = -4 + (sh % 8); x < 16; x += 8) { w1R(g, 'y', x, 13, 4, 2); }
    }
    Q.defSprite('w1-belt-r', { w: 16, h: 16, n: 4, draw: function (g, f) { w1Belt(g, f, 1); } });
    Q.defSprite('w1-belt-l', { w: 16, h: 16, n: 4, draw: function (g, f) { w1Belt(g, f, -1); } });

    // ---------- the bins of the sorting floor: IN and OUT (one tile each) and the big MAYBE bin (two by two, drawn whole and cut in four) ----------
    function w1Bin(g, x, y, w, h, label) {
      w1R(g, 'k', x, y, w, h); w1R(g, 'S', x + 1, y + 1, w - 2, h - 2); w1R(g, 's', x + 1, y + 1, w - 2, 1); w1R(g, 'g', x + 1, y + h - 2, w - 2, 1);
      for (var i = x + 3; i < x + w - 2; i += 3) w1R(g, 'g', i, y + 3, 1, h - 5);   // the wire
      w1R(g, 'w', x + 2, y - 2 + 1, 3, 2); w1R(g, 'e', x + w - 6, y - 1, 3, 2);         // letters poking out of the top
      var lw = Q.w1.tinyW(label) + 4, lx = x + ((w - lw) >> 1), ly = y + (h >> 1) - 3;
      w1R(g, 'k', lx - 1, ly - 1, lw + 2, 9); w1R(g, 'c', lx, ly, lw, 7); w1Tiny(g, label, lx + 2, ly + 1, 'b');
    }
    Q.defSprite('w1-bin', { w: 16, h: 16, n: 2, draw: function (g, f) { w1Bin(g, 0, 1, 16, 15, f ? 'OUT' : 'IN'); } });
    Q.defSprite('w1-maybe', { w: 16, h: 16, n: 4, draw: function (g, f) {
      g.translate(-(f % 2) * 16, -(f >> 1) * 16);
      w1Bin(g, 0, 2, 32, 30, 'MAYBE');
      w1R(g, 'r', 22, 4, 6, 3); w1R(g, 'w', 5, 26, 6, 3); w1R(g, 'e', 20, 25, 5, 3);
    } });
    // junk mail, flyers in a stack (the blocks of SPAM TOWER): cream layers with a glossy coloured edge here and there
    Q.defSprite('w1-junk', { w: 16, h: 16, n: 1, draw: function (g) {
      var edge = ['r', 'y', 't', 'n'], i;
      for (i = 0; i < 4; i++) {
        var y = i * 4, off = (i * 5) % 9;
        w1R(g, i % 2 ? 'C' : 'e', 0, y, 16, 4); w1R(g, edge[i], 0, y, 16, 1); w1R(g, 'd', 0, y + 3, 16, 1);
        w1R(g, 'D', off, y + 1, 1, 2); w1R(g, 'w', off + 2, y + 1, 4, 1); w1R(g, edge[(i + 2) % 4], off + 8, y + 2, 2, 1);
      }
    } });
    // a chute for letters, hanging from the ceiling (J is its pipe going up)
    Q.defSprite('w1-chute', { w: 16, h: 16, n: 1, draw: function (g) {
      w1R(g, 'k', 3, 0, 10, 2); w1R(g, 'g', 4, 0, 8, 2);
      w1R(g, 'k', 1, 2, 14, 10); w1R(g, 'S', 2, 2, 12, 9); w1R(g, 's', 2, 2, 12, 1); w1R(g, 'g', 2, 9, 12, 2);
      w1R(g, 'k', 4, 11, 8, 3); w1R(g, 'M', 5, 11, 6, 2); w1R(g, 'w', 6, 12, 4, 1);
      w1R(g, 'y', 4, 5, 8, 2); w1R(g, 'k', 5, 5, 1, 2); w1R(g, 'k', 8, 5, 1, 2); w1R(g, 'k', 11, 5, 1, 2);
    } });
    Q.defSprite('w1-pipe', { w: 16, h: 16, n: 1, draw: function (g) {
      w1R(g, 'k', 3, 0, 10, 16); w1R(g, 'g', 4, 0, 8, 16); w1R(g, 'S', 5, 0, 2, 16); w1R(g, 'G', 10, 0, 2, 16);
      w1R(g, 'k', 3, 7, 10, 1);
    } });
