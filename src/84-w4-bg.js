    // ---------- 84-w4-bg.js: THE BACKLOG's backgrounds (B9): a dark purple sky with far sticky notes for stars, far towers of tickets,
    // mid piles that sink away as you climb (the sky opens as you rise), and near vines hanging from the dark. A few rectangles per layer, no per-pixel work.
    // Variants: 'backlog' (the pile), 'backlog-stairs' (warmer), 'backlog-tower' (the climb), 'backlog-root' (the top: open sky).
    function w4Hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
    function w4Mod(a, n) { return ((a % n) + n) % n; }
    var W4SKY = [
      ['#140c24', '#1a1030', '#21143c', '#2a1a48', '#331f56', '#3b2560'],    // the pile
      ['#160c22', '#1f102e', '#2a153a', '#361b46', '#432152', '#4f285c'],    // the stairs: a little warmer
      ['#100a1e', '#150d28', '#1b1132', '#22153e', '#2a1a48', '#331f54'],    // the tower: darker
      ['#1d1236', '#2a1a4a', '#3a2460', '#4c3076', '#5e3d88', '#714b96']     // the root: the sky opens
    ];
    var W4STAR = ['#6d5a92', '#8a7a4a', '#8a5a78', '#5a6a9a'];
    function w4Bg(v) {
      return function (g, camX, camY, t, Q) {
        var W = 320, H = 200, i, x, y, w, h, k, sky = W4SKY[v], L = Q.level, lvH = L && L.th ? L.th * 16 : 208;
        var rise = Q.clamp((lvH - 200 - camY) / 600, 0, 1);   // 0 at the bottom of a level, 1 when 600 px up: the piles sink, the sky opens
        // the sky: six bands
        for (i = 0; i < 6; i++) { g.fillStyle = sky[i]; g.fillRect(0, Math.floor(i * H / 6), W, Math.ceil(H / 6) + 1); }
        if (v === 2 && rise > 0.5) { g.fillStyle = 'rgba(120,80,170,' + ((rise - 0.5) * 0.3).toFixed(3) + ')'; g.fillRect(0, 0, W, 70); }
        // far sticky notes for stars, a few twinkling
        for (i = 0; i < 36; i++) {
          x = w4Mod(w4Hash(i) * 640 - camX * 0.04, W); y = w4Mod(w4Hash(i + 99) * 400 - camY * 0.04, H);
          k = (i + Math.floor(t * 0.7)) % 9 === 0 ? 3 : 2;
          g.fillStyle = W4STAR[i & 3]; g.fillRect(Math.floor(x), Math.floor(y), k, k);
        }
        // a big pale sticky note for a moon, with LATER on it
        x = Math.floor(236 - camX * 0.02); y = Math.floor(30 - camY * 0.02);
        if (v !== 2 || rise > 0.3) {
          g.fillStyle = '#5d5378'; g.fillRect(x, y, 30, 30); g.fillStyle = '#7a6f96'; g.fillRect(x, y, 30, 4);
          g.fillStyle = '#4a4262'; g.fillRect(x + 24, y + 24, 6, 6); g.fillStyle = '#2a1f42'; g.fillRect(x + 24, y + 24, 1, 6); g.fillRect(x + 24, y + 24, 6, 1);
          w4MicroText(g, 'LATER', x + 5, y + 13, '#3b2f58');
        }
        // far towers of tickets (repeat every 260 px; bands of 12 px, each a little askew)
        var fx = camX * 0.12, fy = camY * 0.12;
        for (i = Math.floor(fx / 260) - 1; i <= Math.floor((fx + W) / 260) + 1; i++) {
          var cx = i * 260 + 130 + w4Hash(i) * 60 - fx, tw = 70 + w4Hash(i + 7) * 40, top = v === 3 ? 70 + w4Hash(i + 3) * 40 : -12;
          var b0 = Math.floor((top + fy) / 12);
          for (k = b0; k * 12 - fy < H; k++) {
            y = k * 12 - fy; var jx = (w4Hash(i * 31 + k) - 0.5) * 10, jw = (w4Hash(i * 17 + k) - 0.5) * 12;
            g.fillStyle = (k & 1) ? '#2a1c46' : '#2f2050'; g.fillRect(Math.floor(cx - tw / 2 + jx), Math.floor(y), Math.floor(tw + jw), 11);
            g.fillStyle = '#3a2a5e'; g.fillRect(Math.floor(cx - tw / 2 + jx), Math.floor(y), Math.floor(tw + jw), 1);
            g.fillStyle = '#231840'; g.fillRect(Math.floor(cx - tw / 2 + jx), Math.floor(y + 4), 2, 4); g.fillRect(Math.floor(cx + tw / 2 + jx + jw) - 2, Math.floor(y + 4), 2, 4);   // a ticket's notches
            g.fillRect(Math.floor(cx + tw / 2 + jx + jw) - 14, Math.floor(y + 2), 1, 8);   // the stub's line
            if (w4Hash(i * 5 + k) > 0.82) { g.fillStyle = (k & 1) ? '#6a5a3a' : '#6a3a5a'; g.fillRect(Math.floor(cx + jx - 10 + w4Hash(k) * 20), Math.floor(y + 2), 7, 7); }
          }
        }
        // mid piles of tickets and notes, standing on the level's floor: they sink out of sight as you climb
        var mx = camX * 0.3, base = H + 30 + rise * 220 - (v === 3 ? 0 : 0);
        for (i = Math.floor(mx / 140) - 1; i <= Math.floor((mx + W) / 140) + 1; i++) {
          x = i * 140 + w4Hash(i + 50) * 50 - mx; w = 46 + w4Hash(i + 51) * 30; h = 60 + w4Hash(i + 52) * 70;
          if (base - h > H) continue;
          for (k = 0; k * 10 < h; k++) {
            y = base - (k + 1) * 10; var j2 = (w4Hash(i * 13 + k) - 0.5) * 8, ww = w - k * 2;
            g.fillStyle = (k % 3 === 0) ? '#46336c' : (k % 3 === 1 ? '#3e2d62' : '#4a3a52');
            g.fillRect(Math.floor(x + j2 + k), Math.floor(y), Math.floor(ww), 9);
            if (w4Hash(i * 7 + k) > 0.7) { g.fillStyle = (k & 1) ? '#7a6a3a' : '#7a4466'; g.fillRect(Math.floor(x + j2 + k + ww * 0.6), Math.floor(y + 1), 6, 6); }
          }
          if (w4Hash(i + 60) > 0.55) {   // a LATER sign stuck in the pile: a board with three lines of writing
            y = base - h - 14; g.fillStyle = '#2a1e3e'; g.fillRect(Math.floor(x + w / 2), Math.floor(y + 8), 2, 10);
            g.fillStyle = '#5a4a72'; g.fillRect(Math.floor(x + w / 2 - 10), Math.floor(y), 22, 10);
            g.fillStyle = '#8a5a6a'; g.fillRect(Math.floor(x + w / 2 - 7), Math.floor(y + 3), 16, 1); g.fillRect(Math.floor(x + w / 2 - 7), Math.floor(y + 6), 11, 1);
          }
        }
        // near vines hanging from the dark, swaying
        var nx = camX * 0.55, ny = camY * 0.55;
        for (i = Math.floor(nx / 170) - 1; i <= Math.floor((nx + W) / 170) + 1; i++) {
          x = i * 170 + w4Hash(i + 80) * 90 - nx; var len = 70 + w4Hash(i + 81) * 70, y0 = v === 3 ? -10 : -10 - w4Mod(ny, 20) * 0;
          for (k = 0; k * 8 < len; k++) {
            var sx = Math.sin(t * 1.1 + i + k * 0.5) * (1 + k * 0.25);
            g.fillStyle = (k & 1) ? '#173a26' : '#1f4a2e'; g.fillRect(Math.floor(x + sx), Math.floor(y0 + k * 8), 3, 9);
            if (k % 3 === 1) { g.fillStyle = '#2a6a3a'; g.fillRect(Math.floor(x + sx + ((k & 2) ? 3 : -3)), Math.floor(y0 + k * 8 + 3), 3, 2); }
          }
        }
      };
    }
    Q.defBg('backlog', w4Bg(0));
    Q.defBg('backlog-stairs', w4Bg(1));
    Q.defBg('backlog-tower', w4Bg(2));
    Q.defBg('backlog-root', w4Bg(3));
