    // ---------- 77-ui-front-logo.js (B17 FRONT END, 2 Nov): the BATON QUEST logo, drawn in code (lab/front/FRONT.md says how it was chosen) ----------
    // Letters of our own: 6 by 7 cells of k pixels, a cell full '#', empty '.', or cut on one corner at 45 degrees ('a' top left, 'b' top right, 'c' bottom
    // left, 'd' bottom right). Each word is slanted (one pixel right every 3 rows up), given a block of depth down and right, a 2-pixel ink outline, and
    // faces in bands (the office's yellow and orange for BATON, its teal for QUEST) with a checkerboard row at each seam, a lit top edge, a shaded bottom edge.
    // The conductor's baton lies between the words, rising to the right, with its spark at the tip. 'u5-logo' (196 by 98): frame 0 the logo, frame 1 its
    // faces in white (the title's shine). 'u5-logo-s' (164 by 30): the same in one line, small, for the credits. U.logoTip says where the spark is.
    (function () {
      var U = Q.ui, F = U.logoKit = {};
      F.GLYPH = {
        B: ['#####b', '##..##', '##..#d', '#####b', '##..##', '##..##', '#####d'],
        A: ['a####b', '##..##', '##..##', '######', '##..##', '##..##', '##..##'],
        T: ['######', 'c####d', '..##..', '..##..', '..##..', '..##..', '..##..'],
        O: ['a####b', '##..##', '##..##', '##..##', '##..##', '##..##', 'c####d'],
        N: ['##..##', '##b.##', '######', '##.c##', '##..##', '##..##', '##..##'],
        Q: ['a####b', '##..##', '##..##', '##..##', '##.b##', 'c#####', '....#d'],
        U: ['##..##', '##..##', '##..##', '##..##', '##..##', '##..##', 'c####d'],
        E: ['a#####', '##....', '##....', '####..', '##....', '##....', 'c#####'],
        S: ['a#####', '##....', '##....', 'c####b', '....##', '....##', '#####d']
      };
      function cell(ch, px, py, k) { var e = k - 1; return ch === '#' ? true : ch === 'a' ? px + py >= e : ch === 'b' ? py >= px : ch === 'c' ? px >= py : ch === 'd' ? px + py <= e : false; }
      F.grid = function (w, h) { var m = [], i; for (i = 0; i < w * h; i++) m.push(0); return { w: w, h: h, m: m }; };
      F.at = function (G, x, y) { return x >= 0 && y >= 0 && x < G.w && y < G.h ? G.m[y * G.w + x] : 0; };
      function put(G, x, y, v) { if (x >= 0 && y >= 0 && x < G.w && y < G.h) G.m[y * G.w + x] = v; }
      F.word = function (G, s, x, y, k, gap, slant, tag) {   // a word into G at (x, y); every pixel of it tagged
        var i, r, c, px, py, rows, gx = x, H = 7 * k, yy, sh;
        for (i = 0; i < s.length; i++) {
          rows = F.GLYPH[s.charAt(i)];
          if (!rows) { gx += 4 * k; continue; }
          for (r = 0; r < 7; r++) for (c = 0; c < 6; c++) for (py = 0; py < k; py++) for (px = 0; px < k; px++) {
            if (!cell(rows[r].charAt(c), px, py, k)) continue;
            yy = r * k + py; sh = slant ? Math.floor((H - 1 - yy) / slant) : 0;
            put(G, gx + c * k + px + sh, y + yy, tag);
          }
          gx += 6 * k + gap;
        }
      };
      F.depth = function (G, tag, ex, ey, n, dep) {   // the pixels the word covers moved 1 to n times by (ex, ey), where nothing is yet: its depth
        var x, y, d, src = G.m.slice();
        for (d = 1; d <= n; d++) for (y = 0; y < G.h; y++) for (x = 0; x < G.w; x++) if (src[y * G.w + x] === tag && !F.at(G, x + ex * d, y + ey * d)) put(G, x + ex * d, y + ey * d, dep);
      };
      F.outline = function (G, r, ol) {   // empty pixels within r of anything (the corners rounded): the outline
        var x, y, dx, dy, src = G.m.slice(), hit, lim = r + (r > 1 ? 1 : 0);
        for (y = 0; y < G.h; y++) for (x = 0; x < G.w; x++) {
          if (src[y * G.w + x]) continue; hit = false;
          for (dy = -r; dy <= r && !hit; dy++) for (dx = -r; dx <= r && !hit; dx++) if (Math.abs(dx) + Math.abs(dy) <= lim && x + dx >= 0 && y + dy >= 0 && x + dx < G.w && y + dy < G.h && src[(y + dy) * G.w + x + dx]) hit = true;
          if (hit) G.m[y * G.w + x] = ol;
        }
      };
      F.line = function (G, x0, y0, x1, y1, r0, r1, tag) {   // a thick straight line, r0 wide at its start to r1 at its end
        var n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)), i, t, cx, cy, r, dx, dy, R;
        for (i = 0; i <= n; i++) {
          t = n ? i / n : 0; cx = x0 + (x1 - x0) * t; cy = y0 + (y1 - y0) * t; r = r0 + (r1 - r0) * t; R = Math.ceil(r);
          for (dy = -R; dy <= R; dy++) for (dx = -R; dx <= R; dx++) if (dx * dx + dy * dy <= r * r + 0.3) put(G, Math.round(cx + dx), Math.round(cy + dy), tag);
        }
      };
      F.disc = function (G, cx, cy, r, tag) { var dx, dy; for (dy = -r; dy <= r; dy++) for (dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r + r * 0.6) put(G, cx + dx, cy + dy, tag); };
      F.paint = function (g, G, look) { var x, y, t, c; for (y = 0; y < G.h; y++) for (x = 0; x < G.w; x++) { t = G.m[y * G.w + x]; if (!t) continue; c = look(x, y, t, G); if (c) { g.fillStyle = c; g.fillRect(x, y, 1, 1); } } };
      F.band = function (bands, row, x) {   // a face's colour by its row inside the word: bands top to bottom, a checkerboard row at each seam
        var i, acc = 0;
        for (i = 0; i < bands.length; i++) { if (row < acc + bands[i][0]) return i > 0 && row === acc && ((x + row) & 1) ? bands[i - 1][1] : bands[i][1]; acc += bands[i][0]; }
        return bands[bands.length - 1][1];
      };
      F.face = function (bands, top, lit, low) { return function (x, y, G) { var me = G.m[y * G.w + x]; return F.at(G, x, y - 1) !== me ? lit : F.at(G, x, y + 1) !== me ? low : F.band(bands, y - top, x); }; };
      F.WARM = [[2, '#fffbe8'], [6, '#fff0b0'], [7, '#ffd23f'], [7, '#ffaa2a'], [7, '#ff8a1e'], [6, '#e8621a']];
      F.COOL = [[2, '#f2fffd'], [6, '#c9f7f1'], [7, '#7fe3d8'], [7, '#2ec4b6'], [7, '#1ba39a'], [6, '#13807a']];
      F.sparkle = function (g, cx, cy, n, c1, c2) {   // a four-point spark, its arms n long, a small cross of light in its middle
        var i;
        g.fillStyle = c2; for (i = 2; i <= n; i++) { g.fillRect(cx - i, cy, 1, 1); g.fillRect(cx + i, cy, 1, 1); g.fillRect(cx, cy - i, 1, 1); g.fillRect(cx, cy + i, 1, 1); }
        if (n > 3) { g.fillRect(cx - 1, cy - 1, 1, 1); g.fillRect(cx + 1, cy - 1, 1, 1); g.fillRect(cx - 1, cy + 1, 1, 1); g.fillRect(cx + 1, cy + 1, 1, 1); }
        g.fillStyle = c1; g.fillRect(cx - 1, cy, 3, 1); g.fillRect(cx, cy - 1, 1, 3);
      };
      F.baton = function (g, w, h, x0, y0, x1, y1, r0, r1, bulb, mask) {   // the baton from its handle (x0, y0) to its tip (x1, y1): outline, shaft and its shade, the walnut bulb
        var B = F.grid(w, h);
        F.line(B, x0, y0, x1, y1, r0, r1, 1); if (bulb) F.disc(B, x0, y0, bulb, 2);
        F.outline(B, 1, 9);
        F.paint(g, B, function (x, y, t, G) {
          if (mask) return t === 1 && F.at(G, x, y - 1) === 9 ? '#ffffff' : '';
          if (t === 9) return '#0b0c10';
          if (t === 2) return F.at(G, x - 1, y - 1) === 9 || F.at(G, x, y - 1) === 9 ? '#b47a4c' : F.at(G, x + 1, y + 1) === 9 ? '#4e2f1a' : '#7a4a2a';
          return F.at(G, x, y + 1) === 9 || F.at(G, x + 1, y + 1) === 9 ? '#bdb29b' : F.at(G, x, y - 1) === 9 ? '#ffffff' : '#f6efe2';
        });
      };
      // the two words, their depth and outline, painted (mask: only the faces, in white)
      F.words = function (g, w, h, a, b, k, gap, dep, ol, mask) {
        var G = F.grid(w, h), fa = F.face(F.WARM, a[1], '#ffffff', '#c24c12'), fb = F.face(F.COOL, b[1], '#ffffff', '#0f6a65');
        F.word(G, 'BATON', a[0], a[1], k, gap, 3, 1); F.word(G, 'QUEST', b[0], b[1], k, gap, 3, 2);
        F.depth(G, 1, 1, 1, dep, 3); F.depth(G, 2, 1, 1, dep, 4);
        F.outline(G, ol, 9);
        F.paint(g, G, function (x, y, t, M) {
          if (mask) return t === 1 || t === 2 ? '#ffffff' : '';
          if (t === 9) return '#0b0c10';
          if (t === 3) return F.at(M, x - 1, y - 1) === 1 ? '#b4521a' : '#7c3410';
          if (t === 4) return F.at(M, x - 1, y - 1) === 2 ? '#0f6c66' : '#083f3b';
          return t === 1 ? fa(x, y, M) : fb(x, y, M);
        });
      };
      var TIP = { x: 188, y: 43 }, TIP_S = { x: 159, y: 24 };
      U.logoTip = function (small) { return small ? TIP_S : TIP; };
      Q.defSprite('u5-logo', { w: 196, h: 98, n: 2, draw: function (g, f) {
        var i, x, y;
        F.words(g, 196, 98, [8, 4], [14, 56], 5, 3, 3, 2, f === 1);
        if (f !== 1) for (i = 0; i < 3; i++) {   // three motion lines along the shaft, above it, from the handle out: the downbeat's swing
          for (x = 18 + i * 10; x < 110 - i * 26; x++) { y = Math.round(54 - 5 - i * 2 - (x - 7) * 11 / 179); g.fillStyle = (x + i) % 9 < 6 ? ['#8ff0e6', '#2ec4b6', '#1b7f78'][i] : '#14224e'; g.fillRect(x, y, 1, 1); }
        }
        F.baton(g, 196, 98, 7, 54, 186, 43, 2.6, 1.1, 5, f === 1);
        if (f !== 1) F.sparkle(g, TIP.x, TIP.y, 7, '#ffffff', '#ffe98a');
      } });
      Q.defSprite('u5-logo-s', { w: 164, h: 30, n: 1, draw: function (g) {   // the credits' small one: BATON QUEST in one line, the baton under it
        F.words(g, 164, 30, [4, 3], [83, 3], 2, 2, 2, 1, false);
        F.baton(g, 164, 30, 4, 25, 157, 24, 1.6, 0.8, 3, false);
        F.sparkle(g, TIP_S.x, TIP_S.y, 4, '#ffffff', '#ffe98a');
      } });
    })();
