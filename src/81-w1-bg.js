    // ---------- 81-w1-bg.js: WORLD 1, THE INBOX: the background 'inbox' (builder 6) ----------
    // A night sky of unread counts with a big 99+ badge for a moon; far off, towers of envelopes; nearer, the sorting machines; letters falling
    // like slow snow. The layers are drawn once into canvases on first use; each frame is a few drawImage calls and the falling letters.
    // The level's sky (world 1's own field) tints it: 0 the lobby, 1 the sorting floor (warm), 2 SPAM TOWER (deeper, redder), 3 the hall (a red
    // storm), 4 THE SPAM FOLDER (junk-mail pink).
    var w1Bg = null;
    function w1Lcg(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
    function w1BgSky() {   // Q.WMAX wide (712): the first 320 as it always was, the rest more of the same sky for a wide screen (stars and counts of its own seed)
      var cv = Q.canvas(Q.WMAX, 200), g = cv.getContext('2d'), bands = ['#0b1128', '#0d142e', '#101834', '#121c3b', '#152042', '#18244a', '#1b2952', '#1f2e5b', '#233364', '#27386c'];
      var i, x, y, r = w1Lcg(91), counts = ['12', '3', '99+', '1K', '7', '404', '58', '2', '640', '31', '9', '1,204', '88', '5', '17', '256'], r2 = w1Lcg(191), xw = Q.WMAX - 320;
      for (i = 0; i < bands.length; i++) {
        g.fillStyle = bands[i]; g.fillRect(0, i * 20, Q.WMAX, 20);
        if (i) for (x = (i % 2); x < Q.WMAX; x += 2) g.fillRect(x, i * 20 - 1, 1, 1);   // a dithered seam between bands
      }
      for (i = 0; i < 40; i++) { g.fillStyle = r() < 0.5 ? '#3a4a86' : '#55669f'; g.fillRect(Math.floor(r() * 320), Math.floor(r() * 150), 1, 1); }
      for (i = 0; i < 49; i++) { g.fillStyle = r2() < 0.5 ? '#3a4a86' : '#55669f'; g.fillRect(320 + Math.floor(r2() * xw), Math.floor(r2() * 150), 1, 1); }   // the wide part's stars
      for (i = 0; i < 20; i++) Q.w1.tiny(g, counts[(i * 7 + 3) % counts.length], 324 + Math.floor(r2() * (xw - 30)), 6 + Math.floor(r2() * 120), i % 3 ? '#3f5194' : '#6274b8');   // and its unread counts
      for (i = 0; i < counts.length; i++) {   // the stars are unread counts
        x = 8 + Math.floor(r() * 290); y = 6 + Math.floor(r() * 120);
        if (x > 216 && x < 290 && y < 72) continue;
        Q.w1.tiny(g, counts[i], x, y, i % 3 ? '#3f5194' : '#6274b8');
      }
      g.fillStyle = '#5a1b26'; g.fillRect(238, 22, 26, 30); g.fillRect(234, 26, 34, 22); g.fillRect(236, 24, 30, 26);   // the moon: a 99+ badge, haloed
      g.fillStyle = '#c8363a'; g.fillRect(241, 24, 20, 26); g.fillRect(237, 28, 28, 18); g.fillRect(239, 26, 24, 22);
      g.fillStyle = '#e2554f'; g.fillRect(241, 24, 12, 2); g.fillRect(239, 26, 4, 4); g.fillRect(237, 28, 2, 8);
      g.fillStyle = '#9a2a32'; g.fillRect(245, 48, 16, 2); g.fillRect(261, 40, 4, 6);
      return cv;
    }
    function w1BgFar() {   // towers of envelopes, a skyline 640 wide that wraps
      var cv = Q.canvas(640, 200), g = cv.getContext('2d'), r = w1Lcg(7), x = 0, w, h, y, k;
      while (x < 640) {
        w = 22 + Math.floor(r() * 30); h = 50 + Math.floor(r() * 110);
        if (x + w > 636) w = 640 - x;
        g.fillStyle = '#18214a'; g.fillRect(x, 200 - h, w, h);
        g.fillStyle = '#1e2856'; for (y = 200 - h + 3; y < 200; y += 4) g.fillRect(x + 1, y, w - 2, 1);
        g.fillStyle = '#141b3d'; g.fillRect(x + w - 2, 200 - h, 2, h);
        for (k = 0; k < 4; k++) { g.fillStyle = r() < 0.5 ? '#2c3a74' : '#344484'; g.fillRect(x + 3 + Math.floor(r() * (w - 8)), 200 - h + 6 + Math.floor(r() * (h - 10)), 3, 2); }
        if (r() < 0.35) { g.fillStyle = '#7a2630'; g.fillRect(x + (w >> 1), 200 - h - 9, 1, 9); g.fillRect(x + (w >> 1) + 1, 200 - h - 9, 5, 3); }
        x += w + 2 + Math.floor(r() * 10);
      }
      return cv;
    }
    function w1BgMid() {   // sorting machines with chutes going up, a long belt, red flags; 640 wide, wraps
      var cv = Q.canvas(640, 200), g = cv.getContext('2d'), r = w1Lcg(33), x = 10, w, h, i;
      g.fillStyle = '#202c5e'; g.fillRect(0, 172, 640, 28);
      g.fillStyle = '#2a3870'; g.fillRect(0, 170, 640, 3);
      for (i = 0; i < 640; i += 16) { g.fillStyle = '#16204a'; g.fillRect(i + 3, 176, 6, 6); g.fillStyle = '#34447e'; g.fillRect(i + 5, 178, 2, 2); }
      while (x < 620) {
        w = 34 + Math.floor(r() * 30); h = 34 + Math.floor(r() * 36);
        g.fillStyle = '#1a2450'; g.fillRect(x - 1, 170 - h - 1, w + 2, h + 1);
        g.fillStyle = '#24316a'; g.fillRect(x, 170 - h, w, h); g.fillStyle = '#2d3c7a'; g.fillRect(x, 170 - h, w, 2);
        g.fillStyle = '#1a2450'; g.fillRect(x + 4, 170 - h + 8, w - 8, 3); g.fillRect(x + 4, 170 - h + 16, 8, 8);
        g.fillStyle = '#c99a2e'; g.fillRect(x + 6, 170 - h + 18, 4, 2);
        i = 170 - h - 24 - Math.floor(r() * 50);   // a chute going up from the machine, ending in a funnel
        g.fillStyle = '#1e2a5a'; g.fillRect(x + (w >> 1) - 3, i, 6, 170 - h - i); g.fillStyle = '#26346c'; g.fillRect(x + (w >> 1) - 2, i, 1, 170 - h - i);
        g.fillStyle = '#1e2a5a'; g.fillRect(x + (w >> 1) - 7, i - 6, 14, 6); g.fillStyle = '#26346c'; g.fillRect(x + (w >> 1) - 7, i - 6, 14, 1);
        if (r() < 0.5) { g.fillStyle = '#8f2c35'; g.fillRect(x + w - 6, 170 - h - 12, 1, 12); g.fillRect(x + w - 5, 170 - h - 12, 6, 4); }
        x += w + 18 + Math.floor(r() * 40);
      }
      return cv;
    }
    var W1_TINT = [null, 'rgba(255,138,30,0.07)', 'rgba(217,58,58,0.08)', 'rgba(150,24,36,0.18)', 'rgba(238,70,140,0.14)'];
    Q.defBg('inbox', function (g, camX, camY, t) {
      if (!w1Bg) w1Bg = { sky: w1BgSky(), far: w1BgFar(), mid: w1BgMid() };
      var lv = Q.level || {}, sky = lv.sky | 0, low = Math.max(0, ((lv.th || 13) * 16 - Q.H) - camY), fx, mx, i, x, y, oy;
      g.drawImage(w1Bg.sky, 0, 0);
      if (sky === 2 || sky === 3) { g.fillStyle = 'rgba(6,6,24,0.28)'; g.fillRect(0, 0, Q.W, Q.H); }
      if (Q.api) Q.api.text('99+', 251, 34, '#fffdf7', 1, 'center');
      fx = ((Math.floor(camX * 0.15) % 640) + 640) % 640; oy = Math.round(low * 0.1);
      g.drawImage(w1Bg.far, -fx, oy); g.drawImage(w1Bg.far, 640 - fx, oy); if (1280 - fx < Q.W) g.drawImage(w1Bg.far, 1280 - fx, oy);   // a third copy only on a wide screen
      mx = ((Math.floor(camX * 0.35) % 640) + 640) % 640; oy = Math.round(low * 0.22);
      g.drawImage(w1Bg.mid, -mx, oy); g.drawImage(w1Bg.mid, 640 - mx, oy); if (1280 - mx < Q.W) g.drawImage(w1Bg.mid, 1280 - mx, oy);
      var snow = Math.round(16 * (Q.W + 10) / 330), span = Q.W + 10;   // 16 letters over 330 px on a 320 screen, as many again for each 330 more
      for (i = 0; i < snow; i++) {   // letters falling like slow snow
        x = (((i * 97 + 13) - camX * 0.3 + Math.sin(t * 0.7 + i) * 6) % span + span) % span - 5;
        y = ((t * (9 + (i % 5) * 3) + i * 41) % 215) - 10;
        g.fillStyle = i % 4 ? '#aeb8d6' : '#e6e9f2'; g.fillRect(Math.round(x), Math.round(y), 3, 2);
        g.fillStyle = '#5d6a96'; g.fillRect(Math.round(x), Math.round(y) + 2, 3, 1);
      }
      if (W1_TINT[sky]) { g.fillStyle = W1_TINT[sky]; if (sky === 4) g.fillRect(0, 0, Q.W, Q.H); else g.fillRect(0, 120, Q.W, 80); }
    });
