    // ---------- 54-engine-fx.js (ENGINE): Q.fx (particles), Q.shake, Q.flash and the camera ----------
    // Q.fx(kind, x, y, opts) in WORLD pixels: 'dust', 'hit', 'spark', 'pop', 'confetti', 'debris', 'text' (opts.text); opts.col and opts.n change the look.
    // A pool of particles made once (the oldest is reused when it is full). Effects draw from a seeded random of their own, so Q.rand stays the game's.
    var ENG_NP = 240, engParts = [], engPartN = 0, engFxR = null;
    var engCamF = { x: 0, y: 0 }, engLook = 0, engCamGY = 0, engShakeA = 0, engShakeT = 0, engShakeMax = 1, engFlashCol = '#ffffff', engFlashT = 0, engFlashMax = 1;
    var ENG_CONF = ['#2ec4b6', '#ff8a1e', '#ffd23f', '#2f7de1', '#ee7fb0', '#46b06a', '#f6efe2'];
    function engR() { return engFxR ? engFxR() : 0.5; }
    function engPart(x, y, vx, vy, life, col, s, gr) {
      var p = engParts[engPartN];
      if (!p) { p = {}; engParts[engPartN] = p; }
      engPartN = (engPartN + 1) % ENG_NP;
      p.on = true; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.life = life; p.max = life; p.col = col; p.s = s; p.g = gr || 0; p.text = ''; p.ring = 0; p.flut = 0;
      return p;
    }
    Q.fx = function (kind, x, y, opts) {
      opts = opts || {};
      var n = opts.n, c = opts.col, i, a, sp, p;
      x = +x || 0; y = +y || 0;
      if (kind === 'dust') { n = n || 4; for (i = 0; i < n; i++) engPart(x + (engR() - 0.5) * 6, y - 1, (engR() - 0.5) * 50, -8 - engR() * 22, 0.3 + engR() * 0.25, c || (i % 2 ? '#ece5d6' : '#c9bfae'), engR() < 0.4 ? 3 : 2, -20); }
      else if (kind === 'hit') {
        n = n || 6;
        for (i = 0; i < n; i++) { a = i / n * 6.283 + engR() * 0.5; sp = 90 + engR() * 60; engPart(x, y, Math.cos(a) * sp, Math.sin(a) * sp, 0.12 + engR() * 0.1, c || (i % 2 ? '#ffffff' : '#ffd23f'), 2, 0); }
        engPart(x, y, 0, 0, 0.12, c || '#ffffff', 1, 0).ring = 1;
      }
      else if (kind === 'spark') { n = n || 5; for (i = 0; i < n; i++) engPart(x, y, (engR() - 0.5) * 120, -40 - engR() * 100, 0.3 + engR() * 0.3, c || (i % 2 ? '#ffd23f' : '#ff8a1e'), engR() < 0.5 ? 2 : 1, 380); }
      else if (kind === 'pop') {
        n = n || 8;
        for (i = 0; i < n; i++) { a = i / n * 6.283; engPart(x, y, Math.cos(a) * 75, Math.sin(a) * 75, 0.28, c || '#f6efe2', 2, 0); }
        engPart(x, y, 0, 0, 0.2, '#ffffff', 1, 0).ring = 2;
      }
      else if (kind === 'confetti') { n = n || 24; for (i = 0; i < n; i++) engPart(x + (engR() - 0.5) * 8, y, (engR() - 0.5) * 170, -90 - engR() * 140, 1.1 + engR() * 0.8, ENG_CONF[i % ENG_CONF.length], 2, 260).flut = 1; }
      else if (kind === 'debris') { n = n || 6; for (i = 0; i < n; i++) engPart(x + (engR() - 0.5) * 10, y + (engR() - 0.5) * 10, (engR() - 0.5) * 150, -60 - engR() * 120, 0.5 + engR() * 0.3, i % 3 ? (c || '#a8703e') : '#1d1d24', engR() < 0.5 ? 3 : 2, 600); }
      else if (kind === 'text') { p = engPart(x, y, 0, -28, opts.life || 0.9, c || '#ffffff', 1, 0); p.text = String(opts.text === undefined ? '' : opts.text); }
      else engPart(x, y, 0, -20, 0.3, c || '#ff00ff', 2, 0);
    };
    Q.shake = function (px, secs) {
      px = +px || 0; secs = +secs || 0.2;
      var now = engShakeT > 0 ? engShakeA * Math.min(1, engShakeT / engShakeMax) : 0;
      if (px >= now) { engShakeA = px; engShakeT = secs; engShakeMax = secs; }
    };
    Q.flash = function (col, secs) { engFlashCol = col || '#ffffff'; engFlashT = engFlashMax = +secs > 0 ? +secs : 0.15; };
    function engFxClear() { for (var i = 0; i < engParts.length; i++) engParts[i].on = false; engShakeT = 0; engFlashT = 0; }
    function engFxStep(dt) {
      var i, p;
      for (i = 0; i < engParts.length; i++) {
        p = engParts[i]; if (!p.on) continue;
        p.life -= dt; if (p.life <= 0) { p.on = false; continue; }
        p.vy += p.g * dt; if (p.flut) { p.vx *= 0.96; if (p.vy > 50) p.vy = 50; }
        p.x += p.vx * dt; p.y += p.vy * dt;
      }
      if (engShakeT > 0) engShakeT -= dt;
      if (engFlashT > 0) engFlashT -= dt;
    }
    function engDrawFx(g) {
      var cx = Q.cam.x, cy = Q.cam.y, i, p, x, y, s, r;
      for (i = 0; i < engParts.length; i++) {
        p = engParts[i]; if (!p.on) continue;
        x = Math.round(p.x - cx); y = Math.round(p.y - cy);
        if (x < -40 || x > Q.W + 40 || y < -20 || y > Q.H + 20) continue;
        g.fillStyle = p.col;
        if (p.text) {   // kept inside the screen's edges
          s = Q.api.width(p.text, 1) >> 1; x = Q.clamp(x, s + 2, Q.W - s - 3); y = Q.clamp(y, Q.HUD + 2, Q.H - 9);
          Q.api.text(p.text, x + 1, y + 1, '#1d1d24', 1, 'center'); Q.api.text(p.text, x, y, p.col, 1, 'center'); continue;
        }
        if (p.ring) {   // a ring (a square outline) that grows
          r = Math.round((1 - p.life / p.max) * (p.ring === 2 ? 12 : 8)) + 2;
          g.fillRect(x - r, y - r, r * 2 + 1, 1); g.fillRect(x - r, y + r, r * 2 + 1, 1); g.fillRect(x - r, y - r, 1, r * 2); g.fillRect(x + r, y - r, 1, r * 2);
          continue;
        }
        s = p.s; if (s > 1 && p.life < p.max * 0.35) s--;
        g.fillRect(x - (s >> 1), y - (s >> 1), s, s);
      }
    }
    function engDrawFlash(g) {
      if (!(engFlashT > 0)) return;
      g.globalAlpha = Math.max(0, Math.min(0.8, 0.8 * engFlashT / engFlashMax)); g.fillStyle = engFlashCol; g.fillRect(0, 0, Q.W, Q.H); g.globalAlpha = 1;
    }

    // ---------- the camera: follows him with a little look-ahead, smoothly, kept inside the level; it moves up or down only when he lands higher or lower,
    // climbs well above where he stood, or falls below it. Q.cam is whole pixels (shake included), so everyone can draw at x - Q.cam.x. ----------
    function engCamStep(dt, snap) {
      var P = Q.P, lw = engTW * 16, lh = engTH * 16, tx, ty, px, py, a;
      if (!P || !engInfo) return;
      if (!P.dead) {
        engLook = snap ? P.face * 24 : Q.approach(engLook, P.face * 24 + Q.clamp(P.vx * 0.1, -16, 16), 80 * dt);
        if (P.ground || snap || P.y > engCamGY) engCamGY = P.y;
        else if (P.y < engCamGY - 48) engCamGY = P.y + 48;
        tx = P.x + P.w / 2 - Q.W / 2 + engLook; ty = engCamGY + P.h - Q.H * 0.62;
        if (snap) { engCamF.x = tx; engCamF.y = ty; }
        else { engCamF.x += (tx - engCamF.x) * Math.min(1, dt * 7); engCamF.y += (ty - engCamF.y) * Math.min(1, dt * (P.vy > 200 ? 10 : 5)); }
        px = P.x - engCamF.x; py = P.y - engCamF.y;   // never out of the view (a dash, a long fall)
        if (px < 40) engCamF.x = P.x - 40; else if (px > Q.W - 40 - P.w) engCamF.x = P.x - (Q.W - 40 - P.w);
        if (py < 34) engCamF.y = P.y - 34; else if (py > Q.H - 28 - P.h) engCamF.y = P.y - (Q.H - 28 - P.h);
      }
      engCamF.x = lw <= Q.W ? (lw - Q.W) / 2 : Q.clamp(engCamF.x, 0, lw - Q.W);
      engCamF.y = lh <= Q.H ? lh - Q.H : Q.clamp(engCamF.y, 0, lh - Q.H);
      Q.cam.x = Math.round(engCamF.x); Q.cam.y = Math.round(engCamF.y);
      if (engShakeT > 0) { a = engShakeA * Math.min(1, engShakeT / engShakeMax); Q.cam.x += Math.round((engR() * 2 - 1) * a); Q.cam.y += Math.round((engR() * 2 - 1) * a); }
    }
    function engCamSnap() { if (Q.P) engCamGY = Q.P.y; engCamStep(0, true); }
