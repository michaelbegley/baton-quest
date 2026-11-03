    // ---------- 82-w2-bg.js: WORLD 2's background, 'server' (builder 7) ----------
    // Three layers: far racks, nearer racks under a cable tray, and a near layer that changes with the level (Q.level.w2look: 'cold', 'canyon', 'fans', 'hot').
    // The detailed layers are painted once into small canvases the first time they are needed; each frame only blits them and lights a few LEDs.
    Q.w2 = Q.w2 || {};
    Q.w2.bgc = null;
    function w2Hash(i) { var x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }
    Q.w2.hash = w2Hash;
    function w2Canvas(g, w, h) { var c = g.canvas.ownerDocument.createElement('canvas'); c.width = w; c.height = h; var cg = c.getContext('2d'); cg.imageSmoothingEnabled = false; return c; }
    function w2BgFar(g) {   // 256 by 200: distant racks with rows of tiny lights
      var c = w2Canvas(g, 256, 200), q = c.getContext('2d'), i, j, x, w, h, y;
      for (i = 0; i < 11; i++) {
        w = 14 + Math.floor(w2Hash(i) * 7); x = i * 23 + Math.floor(w2Hash(i + 50) * 4); h = 80 + Math.floor(w2Hash(i + 90) * 80); y = 192 - h;
        q.fillStyle = '#121821'; q.fillRect(x, y, w, h); q.fillStyle = '#18202b'; q.fillRect(x, y, w, 1); q.fillRect(x, y, 1, h);
        for (j = y + 4; j < 190; j += 6) { q.fillStyle = '#0e131a'; q.fillRect(x + 1, j + 3, w - 2, 1); if (w2Hash(i * 31 + j) > 0.45) { q.fillStyle = w2Hash(j + i) > 0.8 ? '#2a6f70' : '#1c5a36'; q.fillRect(x + 2 + Math.floor(w2Hash(j * 3 + i) * (w - 5)), j, 1, 1); } }
      }
      q.fillStyle = '#0d1117'; q.fillRect(0, 192, 256, 8);
      return c;
    }
    function w2BgMid(g, leds) {   // 384 by 200: nearer racks, a cable tray along the top with cables hanging in loops
      var c = w2Canvas(g, 384, 200), q = c.getContext('2d'), i, j, x, w, h, y, k, px, py;
      for (i = 0; i < 6; i++) {
        w = 34 + Math.floor(w2Hash(i + 7) * 18); x = 8 + i * 64 + Math.floor(w2Hash(i + 3) * 8); h = 110 + Math.floor(w2Hash(i + 11) * 60); y = 200 - h;
        q.fillStyle = '#151c26'; q.fillRect(x, y, w, h); q.fillStyle = '#1f2834'; q.fillRect(x, y, w, 2); q.fillRect(x, y, 2, h);
        q.fillStyle = '#10161e'; q.fillRect(x + w - 2, y, 2, h);
        for (j = y + 6; j < 198; j += 8) {
          q.fillStyle = '#0f141c'; q.fillRect(x + 3, j + 6, w - 6, 1); q.fillStyle = '#1a2230'; q.fillRect(x + 3, j, w - 6, 1);
          for (k = 0; k < 3; k++) if (w2Hash(i * 97 + j * 5 + k) > 0.35) { px = x + 5 + k * 4; py = j + 2; q.fillStyle = '#1a4d30'; q.fillRect(px, py, 2, 1); if (leds.length < 60) leds.push(px, py); }
        }
      }
      q.fillStyle = '#141a22'; q.fillRect(0, 8, 384, 5); q.fillStyle = '#222b36'; q.fillRect(0, 8, 384, 1);
      for (x = 0; x < 384; x += 48) { q.fillStyle = '#1a2029'; q.fillRect(x + 10, 0, 2, 9); }
      for (i = 0; i < 5; i++) {   // loops of cable hanging from the tray
        var x0 = i * 80 + 6 + Math.floor(w2Hash(i + 40) * 20), span = 40 + Math.floor(w2Hash(i + 44) * 30), sag = 10 + Math.floor(w2Hash(i + 48) * 14);
        for (k = 0; k <= span; k++) { var s = (k / span) * 2 - 1; py = 13 + Math.round(sag * (1 - s * s)); q.fillStyle = i % 2 ? '#4a2a10' : '#2a3039'; q.fillRect((x0 + k) % 384, py, 1, 2); }
      }
      return c;
    }
    function w2BgLoops(g) {   // 320 by 200, for CABLE CANYON: big loops and bundles of cable across the view
      var c = w2Canvas(g, 320, 200), q = c.getContext('2d'), i, k, s, py;
      for (i = 0; i < 4; i++) {
        var x0 = i * 80 - 20, span = 110 + Math.floor(w2Hash(i + 60) * 40), top = 30 + Math.floor(w2Hash(i + 64) * 60), sag = 26 + Math.floor(w2Hash(i + 68) * 30);
        for (k = 0; k <= span; k++) {
          s = (k / span) * 2 - 1; py = top + Math.round(sag * (1 - s * s));
          q.fillStyle = '#1d1209'; q.fillRect((x0 + k + 320) % 320, py - 1, 1, 6);
          q.fillStyle = i % 2 ? '#5c3311' : '#3a2410'; q.fillRect((x0 + k + 320) % 320, py, 1, 3);
          q.fillStyle = '#26303b'; q.fillRect((x0 + k + 320) % 320, py + 3, 1, 1);
        }
      }
      return c;
    }
    function w2Blit(g, img, ox, oy, wrapY) {   // draw a layer tiled across the screen (and down it, when wrapY)
      var w = img.width, h = img.height, x, y, x0 = -(((ox % w) + w) % w), y0 = wrapY ? -(((oy % h) + h) % h) : -oy;
      for (y = y0; y < 200; y += h) { for (x = x0; x < Q.W; x += w) g.drawImage(img, Math.round(x), Math.round(y)); if (!wrapY) break; }   // across the screen's width (320, or wider)
    }
    Q.defBg('server', function (g, camX, camY, t, Q) {
      var look = (Q.level && Q.level.w2look) || 'cold', b = Q.w2.bgc, i, x, y, ox, a, k;
      if (!b) { b = Q.w2.bgc = { leds: [] }; b.far = w2BgFar(g); b.mid = w2BgMid(g, b.leds); b.loops = w2BgLoops(g); }
      var top = look === 'hot' ? '#1a0c0c' : look === 'cold' ? '#0b1316' : '#0b0e13', bot = look === 'hot' ? '#2a120e' : look === 'cold' ? '#0f1c20' : '#121820';
      g.fillStyle = top; g.fillRect(0, 0, Q.W, 200);
      for (i = 0; i < 5; i++) { g.globalAlpha = 0.2 * (i + 1); g.fillStyle = bot; g.fillRect(0, 100 + i * 20, Q.W, 20); }
      g.globalAlpha = 1;
      var tall = look === 'fans';
      w2Blit(g, b.far, camX * 0.12, tall ? camY * 0.12 : camY * 0.05, tall);
      w2Blit(g, b.mid, camX * 0.35, tall ? camY * 0.3 : camY * 0.12, tall);
      ox = -(((camX * 0.35) % 384) + 384) % 384;
      for (i = 0; i < b.leds.length; i += 2) {   // the nearer racks' lights blink, each at its own pace
        if (w2Hash(i * 7 + Math.floor(t * (1 + (i % 3)))) < 0.55) continue;
        x = b.leds[i] + ox; y = b.leds[i + 1] - (tall ? (((camY * 0.3) % 200) + 200) % 200 : Math.round(camY * 0.12));
        g.fillStyle = (i % 10) === 0 ? '#ffb02e' : '#39e27a';
        if (x < 320) g.fillRect(Math.round(x), y, 2, 1); if (x + 384 < 320) g.fillRect(Math.round(x + 384), y, 2, 1);
        if (Q.W > 320) { if (x >= 320 && x < Q.W) g.fillRect(Math.round(x), y, 2, 1); if (x + 384 >= 320 && x + 384 < Q.W) g.fillRect(Math.round(x + 384), y, 2, 1); if (x + 768 < Q.W) g.fillRect(Math.round(x + 768), y, 2, 1); }   // a wide screen's lights
        if (tall && y + 200 < 200) g.fillRect(Math.round(x), y + 200, 2, 1);
      }
      if (look === 'canyon') {
        w2Blit(g, b.loops, camX * 0.55, camY * 0.2, false);
        for (i = 0; i < 4; i++) { g.fillStyle = 'rgba(4,6,9,' + (0.15 + i * 0.12) + ')'; g.fillRect(0, 150 + i * 13, Q.W, 13); }
      } else if (look === 'cold') {
        for (i = 0; i < 3; i++) { g.fillStyle = 'rgba(46,196,182,' + (0.04 + i * 0.03) + ')'; g.fillRect(0, 160 + i * 14, Q.W, 14); }
        var nf = Math.round(16 * (Q.W + 20) / 340), fs = Q.W + 20;   // 16 over 340 px on a 320 screen, more across a wider one
        for (i = 0; i < nf; i++) {   // a little frost in the air
          x = ((w2Hash(i) * fs + t * (6 + i % 5) - camX * 0.5) % fs + fs) % fs - 10; y = ((w2Hash(i + 20) * 210 - t * (4 + i % 3)) % 210 + 210) % 210 - 5;
          g.fillStyle = i % 3 ? 'rgba(226,252,255,0.35)' : 'rgba(143,240,230,0.5)'; g.fillRect(Math.round(x), Math.round(y), 1, 1);
        }
      } else if (look === 'fans') {
        for (i = 0; i < 3; i++) {
          x = ((i * 130 + 40 - camX * 0.3) % 390 + 390) % 390 - 35;
          for (k = x; k < Q.W; k += 390) {   // again every 390 px across a wide screen (on a 320 one only the first)
            g.fillStyle = 'rgba(143,240,230,0.035)'; g.fillRect(Math.round(k), 0, 36, 200);
            for (a = 0; a < 4; a++) { y = ((w2Hash(i * 9 + a) * 220 - t * 70 - camY * 0.3) % 220 + 220) % 220 - 10; g.fillStyle = 'rgba(143,240,230,0.12)'; g.fillRect(Math.round(k + 6 + a * 7), Math.round(y), 1, 9); }
          }
        }
      } else if (look === 'hot') {
        for (i = 0; i < 4; i++) { g.fillStyle = 'rgba(232,64,42,' + (0.05 + i * 0.04) + ')'; g.fillRect(0, 140 + i * 15, Q.W, 15); }
        var ns = Math.round(12 * Q.W / 320);   // 12 on a 320 screen, more across a wider one
        for (i = 0; i < ns; i++) {   // the air shimmers
          y = ((w2Hash(i + 5) * 200 - t * (14 + i % 4) * 2) % 200 + 200) % 200; x = w2Hash(i + 9) * (Q.W - 20) + Math.sin(t * 3 + i) * 4;
          g.fillStyle = 'rgba(255,190,120,' + (0.05 + 0.06 * (y / 200)) + ')'; g.fillRect(Math.round(x), Math.round(y), 10 + (i % 3) * 4, 1);
        }
      }
      if (Q.w2.drawAir) Q.w2.drawAir(g, camX, camY, t, Q);   // the fans' updrafts (82-w2-world.js), behind the tiles
    });
