    // ---------- 83-w3-enemies.js: WORLD 3, THE CLOUD (builder 8): the sky's helper, the drifting clouds, LOADING SPINNER and RATE LIMITER ----------
    Q.w3 = Q.w3 || {};
    Q.w3.home = function (e) {   // the map tile it was placed on (the engine passes tx, ty; else it is worked out from where it stands)
      var o = e.o || {};
      if (o.tx !== undefined && o.ty !== undefined) return { tx: o.tx, ty: o.ty };
      return { tx: Math.floor((e.x + e.w / 2) / 16), ty: Math.floor((e.y + e.h - 1) / 16) };
    };
    Q.w3.text = function (g, s, x, y, col) {   // a short label on a small dark box (one pass of the font: cheap), readable on sky and cloud alike (screen pixels)
      var a = Q.api; if (!a) return;
      var w = a.width(s, 1);
      g.fillStyle = 'rgba(29,29,36,0.85)'; g.fillRect(Math.round(x - w / 2) - 2, y - 2, w + 4, 11);
      a.text(s, x, y, col || '#ffffff', 1, 'center');
    };

    // the sky's helper: one per level, never hit and never touching; it draws the wind's streaks, the gust warnings and the lightning
    Q.defEnemy('w3fx', { name: 'SKY', w: 1, h: 1, hp: 1, xp: 0, tokens: 0, touch: 0, gravity: 0, solid: false, nohit: true, always: true,
      update: function (e) { e.vx = 0; e.vy = 0; e.x = Q.cam.x + Q.W / 2; e.y = Q.cam.y + Q.H / 2; },
      draw: function (e, g) { Q.w3.drawSky(g); } });
    Q.w3.drawSky = function (g) {
      var st = Q.w3.st, P = Q.P, cx = Q.cam.x, cy = Q.cam.y, i, j, z, s, x, y, len, w, top, bot, n, sp, b, k;
      if (!st) return;
      for (i = 0; i < st.wind.length; i++) {
        z = st.wind[i];
        if (z.x1 < cx || z.x0 > cx + Q.W || (z.mode === 'calm' && z.k <= 0)) continue;
        top = Math.max(z.y0, cy + 18); bot = Math.min(z.y1, cy + Q.H); w = z.x1 - z.x0;
        if (bot <= top) continue;
        n = z.k > 0 ? 20 : 8; sp = z.k > 0 ? 320 : 120;
        g.fillStyle = z.k > 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)';
        for (j = 0; j < n; j++) {
          s = w3Seed[(j * 3 + i) % 40]; len = 8 + Math.round(s[2] * (z.k > 0 ? 22 : 10));
          x = z.x0 + ((s[0] * w + st.t * sp * z.dir * (0.7 + s[2] * 0.5)) % w + w) % w; y = top + Math.round(s[1] * (bot - top - 1));
          if (x + len < cx || x > cx + Q.W) continue;
          g.fillRect(Math.round(x - cx), Math.round(y - cy), len, 1);
        }
        if (z.mode === 'warn' && P && (st.t * 4) % 1 < 0.7) {   // the warning: GUST and arrows, at his height, in the part of the zone on screen
          x = Q.clamp(P.x + P.w / 2, Math.max(z.x0, cx) + 30, Math.min(z.x1, cx + Q.W) - 30); y = Q.clamp(P.y - 22, top + 4, bot - 12);
          if (x > z.x0 && x < z.x1) {
            Q.w3.text(g, 'GUST', Math.round(x - cx), Math.round(y - cy), '#ffd23f');
            for (k = 0; k < 2; k++) { var ax = Math.round(x - cx) + z.dir * (20 + k * 6), ay = Math.round(y - cy) + 3; g.fillStyle = '#ffd23f'; g.fillRect(ax, ay - 2, 1, 1); g.fillRect(ax + z.dir, ay - 1, 1, 1); g.fillRect(ax + 2 * z.dir, ay, 1, 1); g.fillRect(ax + z.dir, ay + 1, 1, 1); g.fillRect(ax, ay + 2, 1, 1); }
          }
        }
      }
      for (i = 0; i < st.bolts.length; i++) {
        b = st.bolts[i]; x = b.x - cx; y = b.gy - cy;
        if (b.t < 0.9) {   // the mark flashes, faster as the bolt comes; then a dotted line shows where it will fall
          k = Math.floor(b.t * (b.t > 0.5 ? 16 : 8)) % 2;
          Q.spr(g, 'w3-mark', k, x - 12, y - 8);
          if (b.t > 0.45 && k === 0) { g.fillStyle = 'rgba(255,255,255,0.55)'; for (j = 18; j < y - 10; j += 7) g.fillRect(x, j, 1, 3); }
        } else {
          var fade = b.t >= 1.08, seed = b.seed;
          Q.w3.bolt(g, x, y, seed, fade);
          if (!fade) { g.fillStyle = '#ffffff'; g.fillRect(x - 7, y - 3, 15, 3); g.fillStyle = '#ffd23f'; g.fillRect(x - 10, y - 1, 21, 1); }
        }
      }
    };
    var w3BoltCv = {};
    Q.w3.boltSprite = function (seed) {   // a bolt's shape, drawn once into a small canvas (six shapes, by seed): zigs of 10 px from the impact (bottom middle) up
      var k = seed % 6, cv = w3BoltCv[k], c, py = 255, px = 6, nx, ny, j, i, steps, ya, yb, bx, pass;
      if (cv) return cv;
      cv = w3BoltCv[k] = Q.canvas(13, 256); c = cv.getContext('2d');
      var zig = [];
      for (j = 0; py > 0; j++) { ny = Math.max(0, py - 10); nx = 6 + ((k * 7 + j * 13) % 9) - 4; zig.push([px, py, nx, ny]); px = nx; py = ny; }
      for (pass = 0; pass < 2; pass++) {
        c.fillStyle = pass ? '#ffffff' : '#ffd23f';
        for (i = 0; i < zig.length; i++) {
          steps = Math.abs(zig[i][2] - zig[i][0]) + 1;
          for (j = 0; j < steps; j++) {
            ya = zig[i][1] - Math.round(10 * (j + 1) / steps); yb = zig[i][1] - Math.round(10 * j / steps); bx = zig[i][0] + (steps > 1 ? Math.round((zig[i][2] - zig[i][0]) * j / (steps - 1)) : 0);
            c.fillRect(bx - (pass ? 1 : 2), ya, pass ? 3 : 5, yb - ya + 1);
          }
        }
      }
      return cv;
    };
    Q.w3.bolt = function (g, x, y, seed, fade) {   // from under the HUD (screen y 16) down to y: one blit of the bolt's shape, its bottom at the impact
      var cv = Q.w3.boltSprite(seed), h = Math.min(256, Math.max(0, Math.round(y) - 16));
      if (!h) return;
      if (fade) g.globalAlpha = 0.45;
      g.drawImage(cv, 0, 256 - h, 13, h, Math.round(x) - 6, 16, 13, h);
      if (fade) g.globalAlpha = 1;
    };

    // drifting clouds: thin platforms that carry him. 'w3drift' ferries across: it turns at a solid tile or an unseen stop ('|') in its row (or 12 tiles out).
    // 'w3lift' rises from where it is placed to a stop above (or 6 tiles up) and sinks back. Each rests a moment at the ends.
    Q.w3.stop = function (tx, ty) { var ch = Q.tile(tx, ty); return ch === '|' || Q.solid(tx * 16 + 8, ty * 16 + 8); };
    function w3PuffInit(e, vertical) {   // 48 px wide (three tiles): a ferry starts at its tile and goes right; a lift is centred on its tile
      var h = Q.w3.home(e), k, c;
      e.w = 48; e.h = 8; e.x = h.tx * 16 - (vertical ? 16 : 0); e.y = h.ty * 16; e.platform = true; e.solid = false; e.gravity = 0; e.touch = 0;
      e.data.a = vertical ? e.y : e.x; e.data.b = e.data.a; e.data.wait = 0.4; e.data.dir = vertical ? -1 : 1;
      if (vertical) {
        for (k = 1; k <= 8; k++) { for (c = -1; c <= 1; c++) if (Q.w3.stop(h.tx + c, h.ty - k)) break; if (c <= 1) break; }
        e.data.b = e.y - Math.min(k - 1, 6) * 16;
      } else {
        for (k = 3; k <= 14; k++) { if (Q.w3.stop(h.tx + k, h.ty)) break; }
        e.data.b = e.x + (k - 3) * 16;
        for (k = 1; k <= 12; k++) { if (Q.w3.stop(h.tx - k, h.ty)) break; }
        e.data.a = e.x - (k - 1) * 16;
      }
    }
    function w3PuffMove(e, dt, vertical, v) {
      var d = e.data, pos = vertical ? e.y : e.x, lo = Math.min(d.a, d.b), hi = Math.max(d.a, d.b), want;
      e.vx = 0; e.vy = 0;
      if (d.wait > 0) { d.wait -= dt; return; }
      want = pos + d.dir * v * dt;
      if (want <= lo) { want = lo; d.dir = 1; d.wait = 0.6; } else if (want >= hi) { want = hi; d.dir = -1; d.wait = 0.6; }
      if (vertical) e.vy = (want - e.y) / dt; else e.vx = (want - e.x) / dt;
    }
    function w3PuffDraw(e, g) { Q.spr(g, 'w3-puff', 0, Math.round(e.x - Q.cam.x), Math.round(e.y - Q.cam.y) - 1); }
    Q.defEnemy('w3drift', { name: 'DRIFTING CLOUD', w: 48, h: 8, hp: 1, xp: 0, tokens: 0, touch: 0, gravity: 0, solid: false, platform: true, always: true,
      init: function (e) { w3PuffInit(e, false); }, update: function (e, dt) { w3PuffMove(e, dt, false, 34); }, draw: w3PuffDraw });
    Q.defEnemy('w3lift', { name: 'RISING CLOUD', w: 48, h: 8, hp: 1, xp: 0, tokens: 0, touch: 0, gravity: 0, solid: false, platform: true, always: true,
      init: function (e) { w3PuffInit(e, true); }, update: function (e, dt) { w3PuffMove(e, dt, true, 30); }, draw: w3PuffDraw });

    // LOADING SPINNER: floats and spins; near him it winds up (its dots turn hot, the tell), then throws dots at him. It promised it was almost done.
    Q.defEnemy('spinner', { name: 'LOADING SPINNER', w: 14, h: 14, hp: 3, xp: 3, tokens: 1, touch: 1, gravity: 0, solid: false, stomp: true, col: '#2ec4b6',
      init: function (e) { e.data.hy = e.y; e.data.cool = 1 + Q.rand() * 1.2; e.st = 'spin'; },
      update: function (e, dt) {
        var P = Q.P, d = e.data, n, i, a, ax, ay, sp = 85;
        e.y = d.hy + Math.sin(e.t * 2.2) * 2; e.vy = 0; e.vx = 0;
        if (e.st === 'spin') {
          e.frame = Math.floor(e.t * 10) % 8;
          if (P && Q.near(e, 170)) { d.cool -= dt; if (d.cool <= 0) { e.st = 'wind'; Q.sfx('charge'); } }
        } else if (e.st === 'wind') {
          e.frame = 8 + Math.floor(e.t * 26) % 8;
          if (e.stT >= 0.6) {
            n = (Q.level && Q.level.w3dots) || 1; ax = P.x + P.w / 2 - (e.x + e.w / 2); ay = P.y + P.h / 2 - (e.y + e.h / 2); a = Math.atan2(ay, ax);
            for (i = 0; i < n; i++) {
              var b = a + (i - (n - 1) / 2) * 0.32;
              Q.spawn('shot', e.x + e.w / 2 - 3, e.y + e.h / 2 - 3, { vx: Math.cos(b) * sp, vy: Math.sin(b) * sp, sprite: 'w3-dot', w: 6, h: 6, touch: 1, life: 2.6 });
            }
            Q.sfx('note'); e.st = 'spin'; d.cool = 2.3 + Q.rand() * 0.6;
          }
        }
      },
      hit: function (e, how) { if (e.hp > 1) Q.w3.pop(e, '...', '#bdf0ea'); return true; },
      die: function (e) { Q.w3.pop(e, Q.w3.word('pop', 'spinner', 'LOADED!'), '#ffd23f'); } });
