    // ---------- 81-w1-boss-b.js: WORLD 1, THE INBOX: THE REPLY-ALL HYDRA, its heads and how it is drawn (builder 6) ----------
    // A head's turn (the body runs it each step): sway -> aim (the tell: flap open, it hangs right over a red marker that follows the conductor,
    // and both hold still 0.4 s before the bite) -> bite (straight down onto the marker, 0.2 s) -> rest (on the floor, dazed, harmless and
    // hittable) -> back -> sway. With one head left: bite, rise, hang over him again, bite ('reaim'), then rest. The marker is exactly where it
    // lands: nothing else on the way down can touch him. A head whose share is gone droops onto the mailbox for good.
    var W1_HANG = 92;   // how high over the floor a head hangs while it aims
    function w1HydraOver(h, hd, dt, lock) {   // over the marker: a quick follow, then exactly above it once it holds
      var want = hd.tx - h.w / 2;
      h.x = lock ? Q.approach(h.x, want, 420 * dt) : h.x + (want - h.x) * Math.min(1, dt * 9);
    }
    function w1HydraHead(e, h, dt) {
      var d = e.data, hd = h.data, P = Q.P, tempo = w1HydraTempo(d), i = hd.i, sp = 1 + (tempo - 1) * 0.6, a, t, hx, hy, aimT, lock;
      hd.k += dt; if (hd.cool > 0) hd.cool -= dt; if (hd.flash > 0) hd.flash -= dt;
      hx = d.bx + W1H.home[i][0] + Math.sin(d.clock * 1.3 * sp + i * 2.1) * 6 - h.w / 2;   // its home, swaying (faster as it gets angry)
      hy = d.by + W1H.home[i][1] + Math.cos(d.clock * 1.7 * sp + i) * 4 - h.h / 2;
      h.vx = 0; h.vy = 0;
      if (hd.st === 'sway') {
        h.x += (hx - h.x) * Math.min(1, dt * 6); h.y += (hy - h.y) * Math.min(1, dt * 6);
        hd.frame = 0; h.touch = 1; if (P) h.face = P.x + P.w / 2 < h.x + h.w / 2 ? -1 : 1;
      } else if (hd.st === 'aim') {
        aimT = Math.max(0.65, 1.05 / tempo); lock = hd.k >= aimT - 0.4;
        if (!lock && P) hd.tx = Q.approach(hd.tx, Q.clamp(P.x + P.w / 2, W1H.left, W1H.right), 60 * Math.min(1.4, tempo) * dt);   // it chases him (well under his walk), then holds 0.4 s
        w1HydraOver(h, hd, dt, lock); h.y += (d.floor - h.h - W1_HANG - h.y) * Math.min(1, dt * 8);
        hd.frame = 1; h.touch = 1; if (P) h.face = P.x + P.w / 2 < h.x + h.w / 2 ? -1 : 1;
        if (hd.k >= aimT) { hd.st = 'bite'; hd.k = 0; h.x = hd.tx - h.w / 2; hd.fy = h.y; Q.sfx('swing'); }
      } else if (hd.st === 'bite') {
        t = Math.min(1, hd.k / 0.2); t = t * t;
        h.x = hd.tx - h.w / 2; h.y = Q.lerp(hd.fy, d.floor - h.h, t); hd.frame = 2; h.touch = 1;
        if (hd.k >= 0.2) {
          Q.shake(2, 0.12); Q.fx('dust', h.x + 3, d.floor); Q.fx('dust', h.x + h.w - 3, d.floor); Q.sfx('land');
          hd.k = 0; hd.fx = h.x; hd.fy = h.y;
          if (hd.extra > 0) { hd.extra--; hd.st = 'reaim'; }
          else { hd.st = 'rest'; if (d.p2) w1HydraRain(e, w1HydraLive(d) === 1 ? 4 : 3, hd.tx); }
        }
      } else if (hd.st === 'reaim') {   // URGENT: up off the floor, over him again, and down
        lock = hd.k >= 0.35;
        if (!lock && P) hd.tx = Q.approach(hd.tx, Q.clamp(P.x + P.w / 2, W1H.left, W1H.right), 70 * dt);
        w1HydraOver(h, hd, dt, lock); h.y += (d.floor - h.h - 62 - h.y) * Math.min(1, dt * 10);
        hd.frame = 1; h.touch = 1; if (P) h.face = P.x + P.w / 2 < h.x + h.w / 2 ? -1 : 1;
        if (hd.k >= 0.75) { hd.st = 'bite'; hd.k = 0; h.x = hd.tx - h.w / 2; hd.fy = h.y; }
      } else if (hd.st === 'rest') {
        hd.frame = 3; h.touch = 0; h.y = d.floor - h.h;
        if (hd.k >= Math.max(d.p2 ? 1.2 : 0.95, (d.p2 ? 1.9 : 1.7) / Math.sqrt(tempo))) { hd.st = 'back'; hd.k = 0; hd.fx = h.x; hd.fy = h.y; }
      } else if (hd.st === 'back') {
        a = Math.min(1, hd.k / 0.45); a = 1 - (1 - a) * (1 - a);
        h.x = Q.lerp(hd.fx, hx, a); h.y = Q.lerp(hd.fy, hy, a); hd.frame = 0; h.touch = 0;
        if (hd.k >= 0.45) hd.st = 'sway';
      } else if (hd.st === 'gone') {   // drooped over the mailbox's top, flap shut, eyes crossed
        a = Math.min(1, hd.k / 0.6);
        h.x = Q.lerp(hd.fx, d.bx + W1H.anchor[i][0] - h.w / 2 + (i - 1) * 8, a); h.y = Q.lerp(hd.fy, d.by + 9 - h.h, a); hd.frame = 3; h.touch = 0;
      }
    }

    Q.defEnemy('hydra-head', {
      name: 'A HEAD OF THE HYDRA', w: 18, h: 10, hp: 99, xp: 0, tokens: 0, touch: 1, gravity: 0, solid: false, always: true, stun: false, col: '#fffdf7',
      init: function (e) {
        var d = e.data; d.body = e.o.body || null; d.i = e.o.i | 0; d.st = 'sway'; d.k = 0; d.hits = 0; d.cool = 0; d.flash = 0; d.frame = 0;
        d.extra = 0; d.tx = 0; d.fx = e.x; d.fy = e.y; d.share = 1;
      },
      hit: function (e, how, n) { return w1HydraHit(e, how, n); },
      draw: function () {}   // the body draws every head, in front of its neck
    });
    // after the fight: the mailbox stays, shut, its plate turned to READ (harmless, so the engine's clear-up leaves it)
    Q.defEnemy('hydra-rest', {
      name: 'THE MAILBOX', w: 80, h: 80, hp: 1, touch: 0, nohit: true, gravity: 0, solid: false, always: true,
      draw: function (e, g) { Q.spr(g, 'hydra-box', 1, Math.round(e.x - Q.cam.x), Math.round(e.y - Q.cam.y)); }
    });

    function w1HydraNeck(g, ax, ay, nx, ny) {   // a chain of letters from the slot up and over to the head
      var px = ax + (nx - ax) * 0.25, py = Math.min(ay, ny) - 14, len = Math.abs(nx - ax) + Math.abs(ny - ay) + Math.abs(py - ay), n = Q.clamp(Math.round(len / 7), 3, 30), j, t, u, x, y;
      for (j = 1; j < n; j++) {
        t = j / n; u = 1 - t;
        x = u * u * ax + 2 * u * t * px + t * t * nx; y = u * u * ay + 2 * u * t * py + t * t * ny;
        Q.spr(g, 'hydra-link', j % 2, Math.round(x - 4 - Q.cam.x), Math.round(y - 3 - Q.cam.y), false);
      }
    }
    function w1HydraDraw(e, g) {
      var d = e.data, i, h, hd, sx, sy, on;
      for (i = 0; i < d.heads.length; i++) {   // the red marker where a head will land: it blinks faster once it holds
        h = d.heads[i]; hd = h.data;
        if (hd.st !== 'aim' && hd.st !== 'reaim') continue;
        on = Math.floor(Q.t * (hd.k > (hd.st === "reaim" ? 0.35 : Math.max(0.65, 1.05 / w1HydraTempo(d)) - 0.4) ? 16 : 6)) % 2;
        sx = Math.round(hd.tx - Q.cam.x); sy = Math.round(d.floor - Q.cam.y);
        g.fillStyle = '#1d1d24'; g.fillRect(sx - 10, sy, 20, 4); g.fillRect(sx - 5, sy - 13, 10, 8);
        g.fillStyle = on ? '#ff6a5a' : '#d93a3a'; g.fillRect(sx - 9, sy + 1, 18, 2);
        g.fillRect(sx - 4, sy - 12, 8, 2); g.fillRect(sx - 3, sy - 10, 6, 2); g.fillRect(sx - 1, sy - 8, 2, 2);
      }
      Q.spr(g, 'hydra-box', 0, Math.round(d.bx - Q.cam.x), Math.round(d.by - Q.cam.y));
      for (i = 0; i < d.heads.length; i++) {
        h = d.heads[i];
        w1HydraNeck(g, d.bx + W1H.anchor[i][0], d.by + W1H.anchor[i][1], h.face < 0 ? h.x + h.w - 4 : h.x + 4, h.y + h.h - 3);
      }
      for (i = 0; i < d.heads.length; i++) {
        h = d.heads[i]; hd = h.data;
        if (hd.flash > 0 && Math.floor(Q.t * 30) % 2) continue;
        Q.spr(g, 'hydra-head', hd.frame, Math.round(h.x - 1 - Q.cam.x), Math.round(h.y - 4 - Q.cam.y), h.face < 0);
      }
    }
