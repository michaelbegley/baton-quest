    // ---------- 82-w2-art.js: WORLD 2, THE SERVER ROOM: the palette and the tiles' art (builder 7) ----------
    // Dark, rack grey, LED green, cable orange, cool teal (QUEST-BIBLE.md). Every tile here is a sprite painted in code with fillRect, once, at start.
    // The world's own tile characters and what they do are in 82-w2-world.js; the background is in 82-w2-bg.js; enemies and the boss in 82-w2-chars.js on.
    Q.w2 = Q.w2 || {};
    var w2C = Q.w2.C = {
      k: '#1d1d24', ink: '#0b0e13', bg1: '#10151c', bg2: '#161c25', bg3: '#1c2430',
      r0: '#1a1f27', r1: '#262b33', r2: '#2f3540', r3: '#3a414d', r4: '#4a5260', r5: '#59626f', r6: '#6b7484', r7: '#8a93a3', r8: '#b4bcc8',
      led: '#39e27a', ledHi: '#b8ffd2', ledDim: '#1e7a45', amber: '#ffb02e', red: '#ff4d4d', blue: '#5aa9ff',
      cab: '#ff8a1e', cabD: '#b45a10', cabL: '#ffb866', cabDD: '#6e3609',
      teal: '#2ec4b6', tealL: '#8ff0e6', tealD: '#136b63', frost: '#e2fcff',
      hot: '#e8402a', hotD: '#8a1e12', hotO: '#ff7a1a', hotY: '#ffd23f', hotW: '#fff3c4',
      card: '#c8955a', cardD: '#8a5a2e', cardL: '#e8b97a', tape: '#ece2c6', yel: '#ffd23f'
    };
    function w2R(g, c, x, y, w, h) { g.fillStyle = c; g.fillRect(x, y, w, h); }
    function w2Box(g, x, y, w, h, fill, hi, lo) {   // a box with a dark outline, a light top-left edge and a shaded bottom-right edge
      w2R(g, w2C.k, x, y, w, h); w2R(g, fill, x + 1, y + 1, w - 2, h - 2);
      if (hi) { w2R(g, hi, x + 1, y + 1, w - 2, 1); w2R(g, hi, x + 1, y + 1, 1, h - 2); }
      if (lo) { w2R(g, lo, x + 1, y + h - 2, w - 2, 1); w2R(g, lo, x + w - 2, y + 1, 1, h - 2); }
    }
    Q.w2.R = w2R; Q.w2.box = w2Box;

    // ---------- the base tiles in this world's look (QUEST-API.md part 8: t2-solid, t2-oneway, t2-spike, t2-crate, t2-pound) ----------
    Q.defSprite('t2-solid', { w: 16, h: 16, n: 2, draw: function (g, f) {
      var C = w2C, x, y;
      if (f === 0) {   // open above: a raised floor panel, a bright lip, perforated
        w2R(g, C.r3, 0, 0, 16, 16); w2R(g, C.r8, 0, 0, 16, 1); w2R(g, C.r6, 0, 1, 16, 1); w2R(g, C.r5, 0, 2, 16, 1); w2R(g, C.r1, 0, 3, 16, 1);
        for (y = 5; y <= 11; y += 2) for (x = 3 + ((y >> 1) & 1); x <= 12; x += 2) w2R(g, C.r2, x, y, 1, 1);
        w2R(g, C.r4, 0, 4, 1, 11); w2R(g, C.r1, 15, 4, 1, 12); w2R(g, C.r1, 0, 15, 16, 1);
        w2R(g, C.r1, 1, 13, 1, 1); w2R(g, C.r1, 14, 13, 1, 1); w2R(g, C.r5, 1, 5, 1, 1); w2R(g, C.r5, 14, 5, 1, 1);
      } else {         // under another solid: the space under the raised floor, a post and a dim cable
        w2R(g, C.r0, 0, 0, 16, 16); w2R(g, C.r1, 0, 0, 16, 1); w2R(g, C.r1, 0, 0, 1, 16);
        w2R(g, C.r2, 6, 0, 3, 16); w2R(g, C.r3, 6, 0, 1, 16); w2R(g, C.r1, 5, 14, 5, 2);
        w2R(g, C.cabDD, 0, 10, 6, 2); w2R(g, C.cabDD, 9, 11, 7, 2); w2R(g, '#8a4a14', 0, 10, 6, 1); w2R(g, '#8a4a14', 9, 11, 7, 1);
      }
    } });
    Q.defSprite('t2-oneway', { w: 16, h: 16, n: 1, draw: function (g) {   // a cable tray: a steel lip, a mesh, a bundle of orange cable showing
      var C = w2C, x;
      w2R(g, C.k, 0, 0, 16, 7); w2R(g, C.r8, 0, 0, 16, 1); w2R(g, C.r6, 0, 1, 16, 1);
      w2R(g, C.cabD, 1, 2, 14, 2); w2R(g, C.cab, 2, 2, 5, 1); w2R(g, C.cabL, 9, 2, 3, 1); w2R(g, '#8fd06a', 7, 3, 2, 1);
      for (x = 0; x < 16; x += 3) w2R(g, C.r5, x, 2, 1, 3);
      w2R(g, C.r4, 0, 4, 16, 1); w2R(g, C.r2, 0, 5, 16, 1);
      w2R(g, C.r4, 2, 6, 2, 3); w2R(g, C.r4, 12, 6, 2, 3); w2R(g, C.k, 2, 9, 2, 1); w2R(g, C.k, 12, 9, 2, 1);
    } });
    Q.defSprite('t2-spike', { w: 16, h: 16, n: 2, draw: function (g, f) {   // live pins sticking up from a broken connector; their tips crackle
      var C = w2C, i, x;
      w2R(g, C.k, 0, 12, 16, 4); w2R(g, C.r4, 0, 13, 16, 1); w2R(g, C.r2, 0, 14, 16, 1);
      for (i = 0; i < 4; i++) {
        x = 1 + i * 4;
        w2R(g, C.k, x - 1, 9, 5, 3); w2R(g, C.k, x, 7, 3, 2);
        w2R(g, C.r7, x, 9, 3, 3); w2R(g, C.r5, x + 2, 9, 1, 3); w2R(g, C.r8, x + 1, 8, 1, 1);
        w2R(g, (f + i) % 2 ? C.hotW : C.yel, x + 1, 7, 1, 1);
        if ((f + i) % 2) { w2R(g, C.yel, x, 6, 1, 1); w2R(g, C.yel, x + 2, 5, 1, 1); }
      }
    } });
    Q.defSprite('t2-crate', { w: 16, h: 16, n: 1, draw: function (g) {   // a box of spare parts, taped shut, with a teal sticker
      var C = w2C;
      w2Box(g, 0, 1, 16, 15, C.card, C.cardL, C.cardD);
      w2R(g, C.cardL, 1, 2, 14, 2); w2R(g, C.cardD, 1, 4, 14, 1);
      w2R(g, C.tape, 7, 2, 2, 13); w2R(g, '#c9bd9e', 8, 2, 1, 13);
      w2R(g, C.k, 2, 8, 5, 5); w2R(g, C.teal, 3, 9, 3, 3); w2R(g, C.tealD, 3, 11, 3, 1); w2R(g, C.k, 4, 10, 1, 1);
      w2R(g, C.cardD, 10, 9, 4, 1); w2R(g, C.cardD, 10, 11, 3, 1);
    } });
    Q.defSprite('t2-pound', { w: 16, h: 16, n: 1, draw: function (g) {   // a heavy steel block, cracked, a big arrow down: only a firm hand breaks it
      var C = w2C, x, y;
      w2Box(g, 0, 0, 16, 16, C.r2, C.r5, C.k);
      for (x = 1; x < 15; x++) w2R(g, ((x >> 1) % 2) ? C.yel : C.k, x, 1, 1, 2);
      w2R(g, C.yel, 6, 4, 4, 5); w2R(g, C.yel, 4, 9, 8, 1); w2R(g, C.yel, 5, 10, 6, 1); w2R(g, C.yel, 6, 11, 4, 1); w2R(g, C.yel, 7, 12, 2, 1);
      w2R(g, C.hotW, 6, 4, 1, 5); w2R(g, C.cardD, 9, 4, 1, 5);
      for (y = 3; y < 15; y++) { x = y < 7 ? 12 + (y % 2) : y < 11 ? 13 - (y % 2) : 12; w2R(g, C.k, x, y, 1, 1); }
      w2R(g, C.k, 2, 12, 2, 1); w2R(g, C.k, 3, 13, 1, 2);
    } });

    // ---------- the world's own tiles' art (what each does is in 82-w2-world.js) ----------
    var W2_LEDS = [   // which LEDs are lit on each of a rack's four frames: g green, d dim, a amber, o off
      ['gdgo', 'dgga', 'gogd', 'ggdg'], ['dggd', 'gdog', 'ggda', 'dgdg'], ['gogg', 'ggdg', 'dgog', 'gadg'], ['ggdd', 'dgag', 'gdgg', 'ogdg']
    ];
    function w2Led(c) { return c === 'g' ? w2C.led : c === 'd' ? w2C.ledDim : c === 'a' ? w2C.amber : c === 'r' ? w2C.red : '#141820'; }
    function w2RackUnit(g, y, f, u, dark, all) {   // one 1U server, 6 pixels tall, at row y; u picks its pattern
      var C = w2C, body = dark ? C.r1 : C.r3, hi = dark ? C.r2 : C.r5, i, s = W2_LEDS[f % 4][u % 4];
      w2R(g, hi, 2, y, 12, 1); w2R(g, body, 2, y + 1, 12, 5); w2R(g, C.k, 2, y + 6, 12, 1);
      for (i = 0; i < 4; i++) w2R(g, all ? (i === 3 ? C.ledHi : C.led) : (dark && s.charAt(i) === 'g' && (i + u) % 2 ? C.ledDim : w2Led(s.charAt(i))), 3 + i * 2, y + 2, 1, 1);
      if (u % 2) { for (i = 0; i < 3; i++) { w2R(g, C.k, 9 + i * 2, y + 1, 1, 5); } w2R(g, dark ? C.r2 : C.r6, 3, y + 4, 4, 1); }
      else { for (i = 0; i < 5; i++) w2R(g, dark ? C.r0 : C.r2, 9 + i, y + 2 + (i % 2), 1, 3); w2R(g, dark ? C.r2 : C.r4, 3, y + 4, 5, 1); }
    }
    function w2RackFrame(g, dark) {   // the rails either side, with their mounting holes
      var C = w2C, y;
      w2R(g, C.k, 0, 0, 16, 16); w2R(g, dark ? C.r0 : C.r1, 1, 0, 1, 16); w2R(g, dark ? C.r0 : C.r1, 14, 0, 1, 16);
      for (y = 2; y < 16; y += 4) { w2R(g, dark ? C.r1 : C.r4, 1, y, 1, 1); w2R(g, dark ? C.r1 : C.r4, 14, y, 1, 1); }
    }
    Q.defSprite('t2-rack', { w: 16, h: 16, n: 4, draw: function (g, f) {   // a solid rack: two servers a tile, lights blinking
      w2RackFrame(g, false); w2R(g, w2C.r6, 0, 0, 16, 1); w2RackUnit(g, 1, f, 0, false); w2RackUnit(g, 8, f, 1, false); w2R(g, w2C.k, 0, 15, 16, 1);
    } });
    Q.defSprite('t2-brack', { w: 16, h: 16, n: 4, draw: function (g, f) {   // a rack further back (not solid): dark, flat, only a few dim lights
      var C = w2C, s = W2_LEDS[(f + 1) % 4][2], i;
      w2R(g, '#11151b', 0, 0, 16, 16); w2R(g, '#171c24', 2, 1, 12, 6); w2R(g, '#171c24', 2, 9, 12, 6);
      w2R(g, '#0c0f14', 2, 7, 12, 1); w2R(g, '#0c0f14', 0, 0, 1, 16); w2R(g, '#0c0f14', 15, 0, 1, 16);
      for (i = 0; i < 3; i++) { if (s.charAt(i) === 'g') w2R(g, '#1b5233', 3 + i * 2, 3, 1, 1); if (s.charAt(i + 1) === 'g') w2R(g, '#1b5233', 3 + i * 2, 11, 1, 1); }
      if (s.charAt(3) === 'a') w2R(g, '#6b4a14', 11, 3, 1, 1);
    } });
    Q.defSprite('t2-warm', { w: 16, h: 16, n: 2, draw: function (g, f) {   // the one warm server: every light green, a warm glow on its lid
      var C = w2C;
      w2RackFrame(g, false); w2R(g, C.hotO, 0, 0, 16, 1); w2R(g, C.hotY, 3 + f * 4, 0, 4, 1); w2RackUnit(g, 1, 0, 0, false, true); w2RackUnit(g, 8, 0, 1, false, true);
      w2R(g, C.k, 0, 15, 16, 1);
    } });
    Q.defSprite('t2-switch', { w: 16, h: 16, n: 4, draw: function (g, f) {   // a network switch on the wall: a row of ports, each with its light
      var C = w2C, i;
      w2Box(g, 0, 4, 16, 9, C.r2, C.r5, C.r1);
      for (i = 0; i < 6; i++) { w2R(g, C.k, 2 + i * 2, 8, 1, 2); w2R(g, ((i * 7 + f * 3) % 5) < 3 ? C.led : (i === 4 && f === 2 ? C.amber : C.ledDim), 2 + i * 2, 6, 1, 1); }
      w2R(g, C.cab, 3, 13, 1, 3); w2R(g, C.blue, 7, 13, 1, 3); w2R(g, C.cab, 11, 13, 1, 3);
    } });
    Q.defSprite('t2-cable-h', { w: 16, h: 16, n: 1, draw: function (g) {   // a cable strung across (sparks run along it)
      var C = w2C;
      w2R(g, C.k, 0, 6, 16, 5); w2R(g, C.cabL, 0, 7, 16, 1); w2R(g, C.cab, 0, 8, 16, 1); w2R(g, C.cabD, 0, 9, 16, 1);
      w2R(g, C.k, 6, 5, 3, 7); w2R(g, C.r6, 7, 6, 1, 5);
    } });
    Q.defSprite('t2-cable-v', { w: 16, h: 16, n: 1, draw: function (g) {
      var C = w2C;
      w2R(g, C.k, 6, 0, 5, 16); w2R(g, C.cabL, 7, 0, 1, 16); w2R(g, C.cab, 8, 0, 1, 16); w2R(g, C.cabD, 9, 0, 1, 16);
      w2R(g, C.k, 5, 6, 7, 3); w2R(g, C.r6, 6, 7, 5, 1);
    } });
    Q.defSprite('t2-cable-x', { w: 16, h: 16, n: 2, draw: function (g, f) {   // a junction box where cables meet or turn
      var C = w2C;
      w2R(g, C.k, 0, 6, 16, 5); w2R(g, C.cab, 0, 8, 16, 1); w2R(g, C.cabL, 0, 7, 16, 1); w2R(g, C.cabD, 0, 9, 16, 1);
      w2R(g, C.k, 6, 0, 5, 16); w2R(g, C.cab, 8, 0, 1, 16); w2R(g, C.cabL, 7, 0, 1, 16); w2R(g, C.cabD, 9, 0, 1, 16);
      w2Box(g, 3, 3, 11, 11, C.r3, C.r6, C.r1); w2R(g, C.r1, 5, 5, 7, 7); w2R(g, f ? C.led : C.ledDim, 8, 8, 1, 1); w2R(g, C.amber, 5, 5, 1, 1);
    } });
    function w2Fan(g, f, mode) {   // a floor fan, seen from the front: mode 0 on, 1 about to stop (a red light), 2 off
      var C = w2C, b, r, a, x, y, sp = mode === 2 ? 0 : f;
      w2Box(g, 0, 0, 16, 16, C.r2, C.r5, C.r1);
      w2R(g, C.r8, 1, 1, 14, 1); for (x = 1; x < 15; x += 2) w2R(g, mode === 2 ? C.r1 : C.tealD, x, 2, 1, 2);
      if (mode !== 2) { w2R(g, C.tealL, 2 + (f * 3) % 11, 1, 2, 1); w2R(g, C.teal, 9 - (f * 2) % 7, 2, 1, 1); }
      w2R(g, C.k, 3, 5, 10, 10); w2R(g, C.ink, 4, 6, 8, 8); w2R(g, C.r4, 3, 5, 10, 1); w2R(g, C.r1, 3, 14, 10, 1);
      for (b = 0; b < 3; b++) for (r = 1; r <= 4; r++) for (var o = 0; o < 3; o++) {
        a = sp * (Math.PI / 6) + b * (2 * Math.PI / 3) + o * 0.28 + r * 0.12;
        x = Math.round(7.5 + r * Math.cos(a)); y = Math.round(9.5 + r * Math.sin(a));
        if (x >= 4 && x <= 11 && y >= 6 && y <= 13) w2R(g, o === 0 ? C.r8 : r > 2 ? C.r5 : C.r6, x, y, 1, 1);
      }
      w2R(g, C.r8, 7, 9, 2, 2); w2R(g, C.k, 8, 10, 1, 1);
      w2R(g, mode === 1 ? (f % 2 ? C.red : C.hotD) : mode === 2 ? C.hotD : C.led, 13, 12, 1, 1);
    }
    Q.defSprite('t2-fan', { w: 16, h: 16, n: 4, draw: function (g, f) { w2Fan(g, f, 0); } });
    Q.defSprite('t2-fanwarn', { w: 16, h: 16, n: 4, draw: function (g, f) { w2Fan(g, f, 1); } });
    Q.defSprite('t2-fanoff', { w: 16, h: 16, n: 1, draw: function (g) { w2Fan(g, 0, 2); } });
    Q.defSprite('t2-cold', { w: 16, h: 16, n: 2, draw: function (g, f) {   // a cold-air floor grille in the cold aisle, a little frost on it
      var C = w2C, x;
      w2R(g, C.r3, 0, 0, 16, 16); w2R(g, C.frost, 0, 0, 16, 1); w2R(g, C.r6, 0, 1, 16, 1);
      for (x = 1; x < 15; x += 2) { w2R(g, (x + f * 2) % 6 < 2 ? C.tealL : C.teal, x, 2, 1, 3); w2R(g, C.tealD, x + 1, 2, 1, 3); }
      w2R(g, C.r1, 0, 5, 16, 1); w2R(g, C.r4, 0, 6, 1, 9); w2R(g, C.r1, 15, 6, 1, 10); w2R(g, C.r1, 0, 15, 16, 1);
      w2R(g, C.frost, 2 + f * 5, 0, 1, 1); w2R(g, C.frost, 11 - f * 3, 0, 2, 1);
      for (x = 3; x < 13; x += 3) w2R(g, C.r2, x, 9, 2, 1);
    } });
    Q.defSprite('t2-lamp', { w: 16, h: 16, n: 1, draw: function (g) {   // a cold light hanging from the ceiling
      var C = w2C;
      w2R(g, C.r5, 3, 0, 1, 4); w2R(g, C.r5, 12, 0, 1, 4);
      w2R(g, C.k, 1, 4, 14, 4); w2R(g, C.r4, 2, 4, 12, 1); w2R(g, C.frost, 2, 6, 12, 1); w2R(g, C.tealL, 2, 5, 12, 1);
      w2R(g, 'rgba(143,240,230,0.30)', 1, 8, 14, 2); w2R(g, 'rgba(143,240,230,0.14)', 0, 10, 16, 3);
    } });
    Q.defSprite('t2-mon', { w: 16, h: 16, n: 2, draw: function (g, f) {   // a small monitor on the wall: the room's temperature, as a line
      var C = w2C, i, ys = [9, 8, 9, 7, 8, 6, 7, 8, 6, 7];
      w2Box(g, 1, 2, 14, 11, C.ink, C.r4, C.r2); w2R(g, C.tealD, 2, 3, 12, 1);
      for (i = 0; i < 10; i++) w2R(g, C.led, 3 + i, ys[(i + f * 3) % 10], 1, 1);
      w2R(g, C.r4, 7, 13, 2, 2); w2R(g, C.r2, 5, 15, 6, 1);
    } });
    Q.defSprite('t2-hot', { w: 16, h: 16, n: 2, draw: function (g, f) {   // a hot-air floor grille in the hot aisle, glowing
      var C = w2C, x;
      w2R(g, C.r3, 0, 0, 16, 16); w2R(g, C.hotY, 0, 0, 16, 1); w2R(g, C.r6, 0, 1, 16, 1);
      for (x = 1; x < 15; x += 2) { w2R(g, (x + f * 2) % 6 < 2 ? C.hotY : C.hotO, x, 2, 1, 3); w2R(g, C.hotD, x + 1, 2, 1, 3); }
      w2R(g, C.r1, 0, 5, 16, 1); w2R(g, C.r4, 0, 6, 1, 9); w2R(g, C.r1, 15, 6, 1, 10); w2R(g, C.r1, 0, 15, 16, 1);
      for (x = 3; x < 13; x += 3) w2R(g, C.r2, x, 9, 2, 1);
    } });
    Q.defSprite('t2-recess', { w: 16, h: 16, n: 1, draw: function (g) {   // the recess in Rack 7's front where C2 is taped (not solid)
      var C = w2C;
      w2R(g, C.k, 0, 0, 16, 16); w2R(g, C.ink, 1, 1, 14, 14); w2R(g, C.r1, 1, 1, 14, 1);
      w2R(g, C.tape, 1, 3, 4, 2); w2R(g, C.tape, 11, 10, 4, 2); w2R(g, '#ffd23f', 12, 2, 3, 3);
    } });
    // ---------- COLD STORAGE, the secret level: its door in the cold aisle, tape shelves, icicles ----------
    Q.defSprite('t2-secret', { w: 16, h: 32, n: 4, draw: function (g, f) {   // a rack further back with its door left ajar: cold air curls out (the secret door D)
      var C = w2C, y, k;
      w2R(g, C.k, 0, 0, 16, 32); w2R(g, '#141a22', 1, 1, 14, 30); w2R(g, '#1c2430', 1, 1, 14, 1);
      w2R(g, '#0b2a33', 2, 3, 7, 26); w2R(g, '#123f4a', 3, 5, 5, 22); w2R(g, '#1d6b74', 4, 8, 3, 16); w2R(g, '#2ec4b6', 5, 11, 1, 10);   // the cold inside
      w2R(g, C.k, 9, 2, 6, 28); w2R(g, '#232b37', 10, 3, 4, 26); w2R(g, '#2c3644', 10, 3, 4, 1);                                       // the door, swung open
      for (y = 6; y < 27; y += 3) w2R(g, '#171d26', 10, y, 4, 1);
      w2R(g, C.r6, 10, 15, 1, 3); w2R(g, C.ledDim, 12, 5, 1, 1);
      w2R(g, C.frost, 2, 29, 7, 1); w2R(g, '#bfefff', 1, 30, 5, 1);
      for (k = 0; k < 3; k++) {   // mist curling out of the gap, drifting left and up
        var px = 6 - ((f + k * 2) % 4) * 2 - k, py = 22 - k * 6 - ((f + k) % 4) * 2;
        if (px >= 0 && py > 0) { w2R(g, 'rgba(226,252,255,0.45)', px, py, 3, 2); w2R(g, 'rgba(226,252,255,0.25)', px - 1, py - 1, 2, 1); }
      }
    } });
    Q.defSprite('t2-tape', { w: 16, h: 16, n: 2, draw: function (g, f) {   // a shelf of old backup tapes, asleep
      var C = w2C, i, cols = ['#e8e2d0', '#2ec4b6', '#ff8a1e', '#bfd3e6'];
      w2R(g, '#1a2029', 0, 13, 16, 3); w2R(g, '#2a323e', 0, 13, 16, 1); w2R(g, '#0d1116', 0, 15, 16, 1);
      for (i = 0; i < 4; i++) {
        w2R(g, C.k, i * 4, 2 + (i % 2), 4, 11 - (i % 2)); w2R(g, '#2c333d', i * 4 + 1, 3 + (i % 2), 2, 9 - (i % 2));
        w2R(g, cols[(i + f) % 4], i * 4 + 1, 5 + (i % 2), 2, 3); w2R(g, '#11151b', i * 4 + 1, 10, 2, 1);
      }
      w2R(g, C.frost, 0, 2, 3, 1); w2R(g, C.frost, 9, 2, 4, 1);
    } });
    Q.defSprite('t2-icicle', { w: 16, h: 16, n: 1, draw: function (g) {   // frost and icicles under the ceiling
      var C = w2C, L = [7, 4, 9, 5], X = [1, 5, 9, 13], i, y;
      w2R(g, C.frost, 0, 0, 16, 2); w2R(g, '#9fdcf5', 0, 2, 16, 1);
      for (i = 0; i < 4; i++) for (y = 0; y < L[i]; y++) { w2R(g, y < L[i] - 2 ? '#bfefff' : C.frost, X[i] + (y > L[i] / 2 ? 1 : 0), 3 + y, y > L[i] / 2 ? 1 : 2, 1); }
    } });
