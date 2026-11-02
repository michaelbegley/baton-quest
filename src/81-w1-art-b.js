    // ---------- 81-w1-art-b.js: WORLD 1, THE INBOX: the decoration (builder 6) ----------
    // Not solid; drawn with the tiles, behind everyone. Darker and quieter than the ground, so it reads as the place, not as a step.
    function w1R2(g, col, x, y, w, h) { g.fillStyle = Q.w1.C[col] || col; g.fillRect(x, y, w, h); }

    // pigeonholes: a walnut frame of four cubbies, some with letters in them (they tile into a wall)
    Q.defSprite('w1-pigeon', { w: 16, h: 16, n: 1, draw: function (g) {
      w1R2(g, 'L', 0, 0, 16, 16); w1R2(g, 'l', 0, 0, 16, 1); w1R2(g, 'l', 0, 0, 1, 16); w1R2(g, 'l', 8, 0, 1, 16); w1R2(g, 'l', 0, 8, 16, 1);
      var cub = [1, 1, 9, 1, 1, 9, 9, 9], i;
      for (i = 0; i < 8; i += 2) { w1R2(g, 'M', cub[i], cub[i + 1], 6, 6); w1R2(g, 'k', cub[i], cub[i + 1], 6, 1); }
      w1R2(g, 'E', 2, 4, 4, 3); w1R2(g, 'd', 2, 6, 4, 1);
      w1R2(g, 'e', 10, 12, 3, 3); w1R2(g, 'E', 13, 13, 1, 2);
      w1R2(g, 'R', 11, 3, 1, 4); w1R2(g, 'r', 12, 3, 2, 2);
    } });
    // a stack of envelopes with a red rubber band (stack them for a tower)
    Q.defSprite('w1-stack', { w: 16, h: 16, n: 1, draw: function (g) {
      var xs = [2, 1, 3, 2, 1], i, x, y;
      for (i = 0; i < 5; i++) {
        x = xs[i]; y = 1 + i * 3;
        w1R2(g, 'D', x, y, 13, 3); w1R2(g, i % 2 ? 'd' : 'E', x + 1, y, 11, 2); w1R2(g, 'D', x + 1, y + 2, 11, 1);
      }
      w1R2(g, 'R', 7, 1, 2, 15); w1R2(g, 'r', 7, 1, 1, 15);
    } });
    // a floor lamp of the lobby; its glow breathes
    Q.defSprite('w1-lamp', { w: 16, h: 16, n: 2, draw: function (g, f) {
      if (f) { w1R2(g, 'Y', 2, 2, 1, 2); w1R2(g, 'Y', 13, 2, 1, 2); w1R2(g, 'Y', 5, 7, 1, 1); w1R2(g, 'Y', 10, 7, 1, 1); }
      w1R2(g, 'k', 4, 0, 8, 6); w1R2(g, 'y', 5, 1, 6, 4); w1R2(g, 'c', 5, 1, 2, 1); w1R2(g, 'Y', 5, 4, 6, 1);
      w1R2(g, 'k', 7, 6, 2, 9); w1R2(g, 'S', 7, 6, 1, 9);
      w1R2(g, 'k', 4, 14, 8, 2); w1R2(g, 'g', 5, 14, 6, 1);
    } });
    // a red flag on a pole, flapping
    Q.defSprite('w1-flagpole', { w: 16, h: 16, n: 2, draw: function (g, f) {
      w1R2(g, 'k', 3, 0, 3, 16); w1R2(g, 's', 4, 0, 1, 16); w1R2(g, 'k', 2, 14, 5, 2);
      if (f) { w1R2(g, 'k', 5, 1, 9, 7); w1R2(g, 'r', 5, 2, 8, 5); w1R2(g, 'p', 5, 2, 8, 1); w1R2(g, 'k', 11, 4, 2, 1); w1R2(g, 'R', 9, 6, 4, 1); }
      else { w1R2(g, 'k', 5, 2, 10, 6); w1R2(g, 'r', 5, 3, 9, 4); w1R2(g, 'p', 5, 3, 9, 1); w1R2(g, 'k', 12, 5, 3, 1); w1R2(g, 'R', 8, 6, 6, 1); }
    } });
    // a blue mailbox with its red flag up
    Q.defSprite('w1-mailbox', { w: 16, h: 16, n: 1, draw: function (g) {
      w1R2(g, 'k', 3, 3, 10, 12); w1R2(g, 'k', 2, 4, 12, 10); w1R2(g, 'b', 3, 4, 10, 10); w1R2(g, 'n', 3, 4, 10, 2); w1R2(g, 'n', 3, 4, 2, 9);
      w1R2(g, 'B', 3, 12, 10, 1); w1R2(g, 'k', 5, 7, 6, 2); w1R2(g, 'w', 6, 7, 4, 1);
      w1R2(g, 'k', 4, 14, 2, 2); w1R2(g, 'k', 10, 14, 2, 2);
      w1R2(g, 'k', 13, 1, 2, 7); w1R2(g, 'S', 13, 2, 1, 6); w1R2(g, 'k', 13, 1, 3, 3); w1R2(g, 'r', 14, 1, 1, 2);
    } });
    // an unread badge: a red circle with its count, glowing
    Q.defSprite('w1-badge', { w: 16, h: 16, n: 2, draw: function (g, f) {
      if (f) { w1R2(g, 'R', 4, 1, 8, 14); w1R2(g, 'R', 1, 4, 14, 8); w1R2(g, 'R', 2, 2, 12, 12); }
      w1R2(g, 'k', 5, 2, 6, 12); w1R2(g, 'k', 2, 5, 12, 6); w1R2(g, 'k', 3, 3, 10, 10);
      w1R2(g, 'r', 5, 3, 6, 10); w1R2(g, 'r', 3, 5, 10, 6); w1R2(g, 'r', 4, 4, 8, 8);
      w1R2(g, 'p', 5, 3, 4, 1); w1R2(g, 'p', 4, 4, 2, 1); w1R2(g, 'p', 3, 5, 1, 2);
      Q.w1.tiny(g, '9', 6, 6, 'w'); w1R2(g, 'w', 10, 7, 1, 3); w1R2(g, 'w', 9, 8, 3, 1);
    } });
    // letters piled loose on the floor
    Q.defSprite('w1-pile', { w: 16, h: 16, n: 1, draw: function (g) {
      w1R2(g, 'k', 0, 13, 7, 3); w1R2(g, 'e', 1, 13, 5, 2);
      w1R2(g, 'k', 5, 11, 7, 4); w1R2(g, 'w', 6, 11, 5, 3); w1R2(g, 'n', 7, 12, 3, 1);
      w1R2(g, 'k', 10, 12, 6, 4); w1R2(g, 'e', 11, 12, 4, 3); w1R2(g, 'r', 13, 13, 1, 1);
      w1R2(g, 'k', 3, 9, 6, 3); w1R2(g, 'w', 4, 9, 4, 2); w1R2(g, 'E', 4, 11, 4, 1);
    } });
    // a PRIZE banner that nobody won (two tiles: [ and ])
    Q.defSprite('w1-prize', { w: 16, h: 16, n: 2, draw: function (g, f) {
      g.translate(-f * 16, 0);
      w1R2(g, 'S', 1, 0, 1, 4); w1R2(g, 'S', 30, 0, 1, 4);
      w1R2(g, 'k', 0, 3, 32, 11); w1R2(g, 'r', 1, 4, 30, 8); w1R2(g, 'p', 1, 4, 30, 1); w1R2(g, 'R', 1, 11, 30, 1);
      w1R2(g, 'k', 2, 14, 3, 2); w1R2(g, 'k', 27, 14, 3, 2);
      Q.w1.tiny(g, 'PRIZE', 7, 6, 'y');
      w1R2(g, 'y', 3, 6, 1, 1); w1R2(g, 'y', 28, 6, 1, 1);
    } });
    // a WIN pennant on a string, swinging
    Q.defSprite('w1-win', { w: 16, h: 16, n: 2, draw: function (g, f) {
      var dx = f ? 1 : 0, r;
      w1R2(g, 'S', 0, 1, 16, 1);
      for (r = 0; r < 11; r++) { var half = 7 - Math.floor(r * 0.65); if (half < 1) half = 1; w1R2(g, r === 10 ? 'k' : 'y', 8 - half + dx, 2 + r, half * 2, 1); }
      w1R2(g, 'k', 1 + dx, 2, 14, 1); w1R2(g, 'Y', 2 + dx, 8, 12, 1);
      Q.w1.tiny(g, 'WIN', 3 + dx, 3, 'r');
    } });
    // the secret door to THE SPAM FOLDER (D): a pile of letters under a chute, one envelope standing up whose red stamp blinks slowly (the one
    // tell), and a faint glint on its corner once in a while (10 frames at 4 a second: the glint is frame 9)
    Q.defSprite('w1-secret', { w: 16, h: 16, n: 10, draw: function (g, n) {
      var f = n >= 5 ? 1 : 0;
      w1R2(g, 'k', 0, 13, 7, 3); w1R2(g, 'e', 1, 13, 5, 2);
      w1R2(g, 'k', 9, 12, 7, 4); w1R2(g, 'w', 10, 12, 5, 3); w1R2(g, 'n', 11, 13, 3, 1);
      w1R2(g, 'k', 4, 4, 9, 11); w1R2(g, 'w', 5, 5, 7, 9); w1R2(g, 'E', 5, 5, 1, 1); w1R2(g, 'E', 6, 6, 1, 1); w1R2(g, 'E', 11, 5, 1, 1); w1R2(g, 'E', 10, 6, 1, 1);
      w1R2(g, 'E', 7, 7, 3, 1); w1R2(g, 'e', 5, 13, 7, 1);
      w1R2(g, f ? 'p' : 'R', 8, 9, 3, 3); w1R2(g, f ? 'w' : 'r', 9, 10, 1, 1);
      if (n === 9) { w1R2(g, 'w', 12, 2, 1, 3); w1R2(g, 'w', 11, 3, 3, 1); }
    } });
