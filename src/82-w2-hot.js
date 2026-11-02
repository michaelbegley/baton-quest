    // ---------- 82-w2-hot.js: THE OVERHEAT's art: its face for the text box, Rack 7's body, its LCD faces, its vents (builder 7) ----------
    // Rack 7 is 48 by 96: a column of vents on its left side (x 0 to 13: a high vent at y 0, a middle one at y 32, a low one at y 80, each 16 tall),
    // and the main column (x 14 to 47): an LCD face at the top, servers below, a heat bar on the right. The behaviour is in 82-w2-boss.js.
    Q.w2 = Q.w2 || {};
    var w2FacePal = { k: '#1d1d24', R: '#ff4d2e', r: '#ff8a1e', g: '#4a5260', s: '#8a93a3', l: '#2a0c06', y: '#ffd23f', w: '#fff3c4', t: '#8ff0e6', G: '#ff4d4d' };
    Q.defSprite('face-overheat', { w: 16, h: 16, pal: w2FacePal, frames: [[
      'kkkkkkkkkkkkkkkk',
      'kRrRRrRRrRRrRRrk',
      'kkkkkkkkkkkkkkkk',
      'kgssssssssssssgk',
      'kgkkkkkkkkkkkkgk',
      'kgkyylllllyylkgt',
      'kgklwyllllwylkkt',
      'kgklyyllllyylkgk',
      'kgkllllllllllkgk',
      'kgkyyyyyyyyyykgk',
      'kgklywywywywlkgk',
      'kgkkkkkkkkkkkkgk',
      'kgGgGgrgGgGgrggk',
      'kgsgsgsgsgsgsggk',
      'kggggggggggggggk',
      'kkkkkkkkkkkkkkkk'
    ], [
      'kkkkkkkkkkkkkkkk',
      'krRRrRRrRRrRRrRk',
      'kkkkkkkkkkkkkkkk',
      'kgssssssssssssgk',
      'kgkkkkkkkkkkkkgk',
      'kgkllllllllllkgk',
      'kgkyyyllllyyykgk',
      'kgkllllllllllkgt',
      'kgkllllllllllkgt',
      'kgkyyyyyyyyyykgk',
      'kgklywywywywlkgk',
      'kgkkkkkkkkkkkkgk',
      'kgrgGgGgrgGgGggk',
      'kgsgsgsgsgsgsggk',
      'kggggggggggggggk',
      'kkkkkkkkkkkkkkkk'
    ]] });

    // Rack 7's body: frame 0 cool (beaten), 1 warm, 2 hot, 3 melting down. Its lights, the heat bar and the face are drawn over it each frame.
    var W2_HEAT = [   // per heat stage: panel, panel light, seam glow, light colours
      { p: '#3a414d', l: '#59626f', s: '#262b33', a: '#39e27a', b: '#1e7a45' },
      { p: '#45403f', l: '#6b5e55', s: '#6e3609', a: '#ffb02e', b: '#39e27a' },
      { p: '#55302a', l: '#7a4436', s: '#b8401a', a: '#ff4d4d', b: '#ffb02e' },
      { p: '#6e2a1c', l: '#9c4a2c', s: '#ff7a1a', a: '#fff3c4', b: '#ff4d4d' }
    ];
    Q.w2.HEAT = W2_HEAT;
    Q.defSprite('overheat-rack', { w: 48, h: 96, n: 4, draw: function (g, f) {
      var R = Q.w2.R, C = Q.w2.C, H = W2_HEAT[f], y, i, vy = [0, 32, 80];
      R(g, C.k, 0, 0, 48, 96); R(g, H.p, 1, 1, 46, 94); R(g, H.l, 1, 1, 46, 1); R(g, H.l, 1, 1, 1, 94);
      R(g, C.r1, 13, 1, 2, 94); R(g, H.s, 14, 1, 1, 94);                                  // the seam between the vents and the servers
      for (i = 0; i < 3; i++) { R(g, C.k, 1, vy[i] + 1, 12, 14); R(g, C.ink, 2, vy[i] + 2, 10, 12); }   // the vents' housings (the vents draw over them)
      for (y = 18; y < 80; y += 4) { R(g, C.r1, 2, y, 11, 2); R(g, H.l, 2, y, 11, 1); }       // louvres between the vents
      R(g, C.k, 15, 2, 32, 24); R(g, C.r2, 16, 3, 30, 22); R(g, H.l, 16, 3, 30, 1);           // the LCD's bezel
      R(g, '#120806', 18, 5, 26, 18);
      for (y = 28; y < 94; y += 8) {                                                        // servers, 8 rows each
        R(g, C.k, 15, y + 7, 25, 1); R(g, H.l, 15, y, 25, 1); R(g, H.p, 15, y + 1, 25, 6);
        R(g, C.r1, 17, y + 2, 2, 3); R(g, C.r1, 30, y + 2, 8, 1); R(g, C.r1, 30, y + 4, 8, 1);
        R(g, H.a, 21, y + 2, 1, 1); R(g, (y >> 3) % 2 ? H.b : H.a, 23, y + 2, 1, 1); R(g, H.b, 25, y + 2, 1, 1);
      }
      R(g, C.k, 40, 27, 7, 68); R(g, C.ink, 41, 28, 5, 66);                                  // the heat bar's slot
      for (y = 34; y < 94; y += 10) R(g, C.r4, 46, y, 1, 1);
      if (f >= 2) { R(g, H.s, 1, 94, 46, 1); R(g, H.s, 46, 1, 1, 94); }                        // hot seams glow
      if (f === 3) { for (y = 6; y < 90; y += 13) R(g, C.hotY, 14, y, 1, 4); }
      R(g, C.r6, 20, 0, 8, 1); R(g, C.r6, 34, 0, 8, 1);
    } });

    // The LCD's faces, 26 by 14: 0 proud, 1 blinking, 2 angry (a meltdown is coming), 3 hurt (a vent cooled), 4 calm (beaten).
    // Each is lit in a heat colour: frame = face + 5 * colour (0 amber, 1 orange, 2 white hot, 3 teal).
    var W2_LCD = [[
      '..........................', '...######........######...', '..#......#......#......#..', '..#..##..#......#..##..#..', '..#..##..#......#..##..#..',
      '..#......#......#......#..', '...######........######...', '..........................', '...####################...', '...#..#..#..#..#..#..#.#...',
      '....#..................#..', '.....##################...', '..........................', '..........................'
    ], [
      '..........................', '..........................', '..........................', '..########......########..', '..........................',
      '..........................', '..........................', '..........................', '...####################...', '...#..#..#..#..#..#..#.#...',
      '....#..................#..', '.....##################...', '..........................', '..........................'
    ], [
      '.#####..............#####.', '...####............####...', '.....###..........###.....', '..#....##........##....#..', '..#..##..#......#..##..#..',
      '..#......#......#......#..', '...######........######...', '..........................', '..#.#.#.#.#.#.#.#.#.#.#...', '...#.#.#.#.#.#.#.#.#.#.#..',
      '..#.#.#.#.#.#.#.#.#.#.#...', '..........................', '..........................', '..........................'
    ], [
      '..........................', '..#.....................#.', '...##................##...', '.....##............##.....', '.......#..........#.......',
      '.....##............##.....', '...##................##...', '..#.....................#.', '..........................', '.......##...##...##.......',
      '......#..#.#..#.#..#......', '.....#....#....#....#.....', '..........................', '..........................'
    ], [
      '..........................', '..........................', '..........................', '..#......#......#......#..', '...#....#........#....#...',
      '....####..........####....', '..........................', '..........................', '.......#..........#.......', '........##########........',
      '..........................', '..........................', '..........................', '..........................'
    ]];
    var W2_LCD_COL = ['#ffb02e', '#ff7a1a', '#fff3c4', '#8ff0e6'];
    Q.defSprite('overheat-lcd', { w: 26, h: 14, n: 20, draw: function (g, f) {
      var face = W2_LCD[f % 5], col = W2_LCD_COL[Math.floor(f / 5)], x, y;
      g.fillStyle = col;
      for (y = 0; y < 14; y++) for (x = 0; x < 26; x++) if (face[y].charAt(x) === '#') g.fillRect(x, y, 1, 1);
    } });

    // A vent, 16 by 16 (drawn over its housing, 2 pixels out from the rack's side): 0 shut, 1 and 2 glowing (it is about to blast),
    // 3 open and blasting, 4 open after the blast (hit it now), 5 just cooled (teal, shut)
    Q.defSprite('overheat-vent', { w: 16, h: 16, n: 6, draw: function (g, f) {
      var R = Q.w2.R, C = Q.w2.C, y, inner = [C.ink, '#5a1a0a', '#a83010', C.hotW, '#7a2410', '#0f3a38'][f];
      var slat = [C.r4, C.r5, C.r5, C.r2, C.r2, C.tealD][f], hi = [C.r6, C.hotO, C.hotY, C.hotY, C.hotO, C.tealL][f];
      R(g, C.k, 0, 0, 16, 16); R(g, inner, 1, 1, 14, 14);
      if (f === 3) { R(g, C.hotY, 1, 3, 14, 10); R(g, C.hotW, 1, 5, 14, 6); }
      for (y = 2; y < 15; y += 3) {
        if (f === 3 || f === 4) { R(g, slat, 12, y, 3, 1); R(g, hi, 12, y, 1, 1); }       // the slats swung open
        else { R(g, slat, 1, y, 14, 2); R(g, hi, 1, y, 14, 1); if (f === 1 || f === 2) R(g, f === 2 ? C.hotY : C.hotO, 2, y + 2, 12, 1); }
      }
      R(g, C.r6, 0, 0, 16, 1); R(g, C.r1, 0, 15, 16, 1);
      if (f === 5) { R(g, C.frost, 3, 1, 2, 1); R(g, C.frost, 10, 1, 3, 1); }
    } });
