    // ---------- 72-ui-front-boot.js (B17 FRONT END, 2 Nov): BOOT, the 9F POCKET splash, the first screen of the title scene (72-ui-title.js) ----------
    // Only when the game has just been opened. A screen warming up (a line of light that opens out), the office's round 9F badge, POCKET typed beside it,
    // then the title. Any button skips it at once; by itself it ends at 1.8 s. The title song starts with it (its first bars are the conductor's two baton
    // taps); on a page, the first press is the one a browser waits for before any sound (MDN's autoplay guide), and the song then starts from its top.
    (function () {
      var U = Q.ui, FE = U.fe || (U.fe = { ph: {} }), END = 1.8, WORD = 'POCKET';
      function bg(g, w, cx) {   // the dark of a screen just switched on, its faint scan lines, and the line of light opening (w wide; the line's middle at cx, as long as the whole screen)
        var t = FE.pt, p, h, y, L = FE.realW || 320;
        U.fill(g, 0, 0, w, 200, '#000000');
        if (t < 0.16) { p = t / 0.16; h = Math.max(1, Math.round(L * p)); U.fill(g, cx - (h >> 2), 97, h >> 1, 6, '#2a3060'); U.fill(g, cx - (h >> 1), 99, h, 2, '#f6efe2'); return false; }
        h = t < 0.3 ? Math.max(2, Math.round(200 * (t - 0.16) / 0.14)) : 200;
        y = 100 - (h >> 1);
        U.fill(g, 0, y, w, h, '#0b0c10');
        for (p = y + 1; p < y + h; p += 3) U.fill(g, 0, p, w, 1, '#0e1016');   // scan lines, barely there
        if (h < 200) { U.fill(g, 0, y, w, 1, '#f6efe2'); U.fill(g, 0, y + h - 1, w, 1, '#f6efe2'); return false; }
        return true;
      }
      function badge(g, cx, cy, r, lit) {   // the round orange 9F badge, big: an ink rim, bands of orange lit from the top left, the 9F with its shadow (lit: all of it pale, for the shine)
        var dy, hw, i, c;
        for (dy = -r - 2; dy <= r + 2; dy++) { hw = Math.floor(Math.sqrt(Math.max(0, (r + 2) * (r + 2) - dy * dy)) + 0.5); U.fill(g, cx - hw, cy + dy, hw * 2, 1, '#1d1d24'); }
        for (dy = -r; dy <= r; dy++) {
          hw = Math.floor(Math.sqrt(Math.max(0, r * r - dy * dy)) + 0.5);
          c = lit ? '#ffe2bd' : dy < -r * 0.45 ? '#ffa64d' : dy < r * 0.35 ? '#ff8a1e' : '#e0701a';
          U.fill(g, cx - hw, cy + dy, hw * 2, 1, c);
        }
        for (i = 0; i < 5 && r > 8; i++) U.fill(g, cx - r + 5 + i, cy - r + 6 - i, 1, 1, '#ffd9a8');   // a glint on its rim
        if (r >= 16) { if (!lit) U.text('9F', cx + 1, cy - 9, '#9a4710', 3, 'center'); U.text('9F', cx, cy - 10, '#ffffff', 3, 'center'); }
      }
      FE.ph.boot = {
        enter: function () { Q.music('title'); },
        update: function () {
          FE.realW = Q.W;   // the screen's own width (inside the column Q.W reads 320)
          if (FE.anyPress() || FE.pt >= END) FE.to('title', 'drop');
        },
        draw: function (g) {
          var t = FE.pt, r, n, x0 = 80, cy = 92, bx = x0 + 22, px = x0 + 56, k, sx, i;
          if (!bg(g, 320, 160)) return;
          r = t < 0.3 ? 0 : Math.min(20, Math.round((t - 0.3) / 0.12 * 20));   // the badge pops out to its size
          if (r > 0) badge(g, bx, cy, r);
          n = Q.clamp(Math.floor((t - 0.42) / 0.06) + 1, 0, WORD.length);   // POCKET typed, a letter at a time
          if (n > 0) { U.text(WORD.slice(0, n), px + 2, cy - 8, '#3c4680', 3); U.text(WORD.slice(0, n), px, cy - 10, '#e2d6bf', 3); }   // a deeper cream, so the shine's white shows on it
          if (n > 0 && n < WORD.length && Math.floor(t * 12) % 2) U.fill(g, px + n * 18, cy - 10, 15, 21, '#2ec4b6');   // its cursor
          if (t >= 0.85 && t < 1.25 && n >= WORD.length) {   // a shine across badge and word: both drawn again in light, seen through a slanted band
            sx = x0 - 30 + Math.round((t - 0.85) / 0.4 * 200);
            g.save(); g.beginPath(); for (i = 0; i < 46; i += 2) g.rect(sx + ((46 - i) >> 1), cy - 23 + i, 7, 2); g.clip();
            badge(g, bx, cy, 20, true); U.text(WORD, px, cy - 10, '#ffffff', 3);
            g.restore();
          }
          if (t >= 0.6) U.text('ANY BUTTON: SKIP', 314, 188, '#3c4268', 1, 'right');
          k = t > END - 0.3 ? Q.clamp((t - (END - 0.3)) / 0.3, 0, 1) : 0;   // the last 0.3 s fade to black
          if (k > 0) { g.globalAlpha = k; U.fill(g, 0, 0, 320, 200, '#000000'); g.globalAlpha = 1; }
        },
        sides: function (g) {   // a wide screen: the same dark and its scan lines, and the line of light, across the whole width
          var t = FE.pt, k;
          bg(g, Q.W, Q.W >> 1);
          k = t > END - 0.3 ? Q.clamp((t - (END - 0.3)) / 0.3, 0, 1) : 0;
          if (k > 0) { g.globalAlpha = k; U.fill(g, 0, 0, Q.W, 200, '#000000'); g.globalAlpha = 1; }
        }
      };
    })();
