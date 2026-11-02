    // ---------- 82-w2-boss-b.js: THE OVERHEAT, part two: its vents, the floor strips, its drawing, and the cooled rack it leaves (builder 7) ----------
    Q.w2 = Q.w2 || {};
    // A vent is an entity of its own (a target for the baton and notes), drawn by the boss over the rack. States: shut, glow, blast, open, cooled.
    Q.defEnemy('overheat-vent', {
      name: 'VENT', w: 14, h: 14, hp: 99, xp: 0, tokens: 0, touch: 0, gravity: 0, solid: false, always: true, sprite: 'overheat-vent', col: '#ff7a1a',
      init: function (e) { e.st = 'shut'; e.hidden = true; e.data.boss = e.o.boss; e.data.i = e.o.i; e.data.len = Q.w2.OH.VENTS[e.o.i].len * 16; e.data.tg = 1; e.data.tb = 1; e.data.to = 1; },
      hit: function (e, how, n, Q) {
        var B = e.data.boss;
        if ((e.st === 'blast' || e.st === 'open') && B && !B.dead) {
          Q.fx('hit', e.x + 4, e.y + 7, { col: '#8ff0e6' }); Q.fx('dust', e.x + 2, e.y + 12, { n: 4, col: '#d4f4ff' });
          Q.w2.ventCool(e); Q.w2.ohCooled(B, Q, n, how);
        } else { Q.sfx('nope'); Q.fx('spark', e.x + 3, e.y + 7, { n: 2, col: '#8a93a3' }); }
        return false;
      },
      update: function (e, dt, Q) {
        var D = e.data, B = D.boss, P = Q.P, k, jx;
        e.vx = 0; e.vy = 0;
        if (!B || B.dead) { Q.remove(e); return; }
        if (e.st === 'glow') {
          if (e.stT < dt * 1.5) Q.sfx('charge');
          if (Math.floor(e.stT * 20) % 4 === 0) Q.fx('spark', e.x + 2, e.y + 3 + Math.floor(e.stT * 37) % 9, { n: 1, col: '#ff8a1e' });
          if (e.stT >= D.tg) { e.st = 'blast'; Q.sfx('fan'); Q.shake(1.5, D.tb); B.data.heat = Math.min(100, B.data.heat + 4); }
        } else if (e.st === 'blast') {
          k = Q.clamp(e.stT / 0.12, 0, 1); jx = B.data.rx - D.len * k;
          D.jet = { x: jx, y: e.y + 1, w: B.data.rx - jx, h: 12 };
          if (P && !P.dead && Q.overlap(P, D.jet)) Q.hurt(1, B.data.rx + 8);
          if (e.stT >= D.tb) { e.st = 'open'; D.jet = null; }
        } else if (e.st === 'open') {
          if (Math.floor(e.stT * 10) % 5 === 0) Q.fx('dust', e.x + 1, e.y + 4, { n: 1, col: '#8a6a60' });
          if (e.stT >= D.to) e.st = 'shut';
        } else if (e.st === 'cooled') { D.jet = null; if (e.stT >= 0.6) e.st = 'shut'; }
        if (e.st !== 'blast') D.jet = null;
      }
    });
    Q.w2.ventGo = function (v, glow, blast, open) { if (!v || v.dead) return; v.data.tg = glow; v.data.tb = blast; v.data.to = open; v.st = 'glow'; };
    Q.w2.ventShut = function (v) { if (v && !v.dead) { v.st = 'shut'; v.data.jet = null; } };
    Q.w2.ventCool = function (v) { if (v && !v.dead) { v.st = 'cooled'; v.data.jet = null; Q.sfx('freeze'); } };

    // ---------- the floor strips: 3 tiles each from the arena's left wall to the rack ----------
    Q.w2.ohStrips = function (e, Q) {
      var D = e.data, x, n = 0;
      D.strips = []; D.sT = 3.5; D.sweepDir = 1;
      for (x = 16; x + 48 <= D.rx + 1 && n < 8; x += 48, n++) D.strips.push({ x0: x, x1: x + 48, st: 'idle', t: 0, delay: 0, glow: 1, burn: 0.5 });
    };
    function w2StripAt(D, P) { var i; if (!P) return -1; for (i = 0; i < D.strips.length; i++) if (P.x + P.w / 2 >= D.strips[i].x0 && P.x + P.w / 2 < D.strips[i].x1) return i; return -1; }
    function w2StripGo(s, ph, delay) { if (s.st !== 'idle') return; s.st = 'wait'; s.t = 0; s.delay = delay || 0; s.glow = ph.sGlow; s.burn = ph.sBurn; }
    Q.w2.ohStripStep = function (e, dt, Q, ph) {
      var D = e.data, P = Q.P, i, s, me, other, onFloor = P && P.ground && Math.abs(P.y + P.h - D.floor) < 2;
      for (i = 0; i < D.strips.length; i++) {
        s = D.strips[i]; s.t += dt;
        if (s.st === 'wait' && s.t >= s.delay) { s.st = 'glow'; s.t = 0; }
        else if (s.st === 'glow' && s.t >= s.glow) { s.st = 'burn'; s.t = 0; Q.fx('spark', (s.x0 + s.x1) / 2, D.floor - 2, { n: 3, col: '#ffd23f' }); }
        else if (s.st === 'burn') {
          if (onFloor && P.x + P.w > s.x0 + 2 && P.x < s.x1 - 2) Q.hurt(1, (s.x0 + s.x1) / 2);
          if (s.t >= s.burn) { s.st = 'idle'; s.t = 0; }
        }
      }
      if (D.wait > 0 || D.melt || !D.strips.length) return;
      D.sT -= dt; if (D.sT > 0) return;
      D.sT = ph.sEvery;
      me = w2StripAt(D, onFloor ? P : null);
      if (ph.sweep) {   // a wave across the floor, one strip after another
        for (i = 0; i < D.strips.length; i++) w2StripGo(D.strips[D.sweepDir > 0 ? i : D.strips.length - 1 - i], ph, i * 0.32);
        D.sweepDir = -D.sweepDir; return;
      }
      if (me < 0) me = Math.floor(Q.rand() * D.strips.length) % D.strips.length;
      w2StripGo(D.strips[me], ph, 0);
      if (ph.two) { other = (me + 2 + Math.floor(Q.rand() * (D.strips.length - 3))) % D.strips.length; w2StripGo(D.strips[other], ph, 0.2); }
    };

    // ---------- drawing: the strips, the rack, its heat bar, its face, its vents and their jets ----------
    function w2DrawJet(g, j, t, cx, cy) {
      var x, y = Math.round(j.y - cy), x0 = Math.round(j.x - cx), x1 = Math.round(j.x + j.w - cx), w;
      for (x = x0; x < x1; x += 4) {
        w = Math.sin(t * 40 + x * 0.6) * 1.5;
        g.fillStyle = 'rgba(255,122,26,0.55)'; g.fillRect(x, Math.round(y + 1 + w), 4, 10);
        g.fillStyle = x > x1 - 40 ? '#fff3c4' : '#ffd23f'; g.fillRect(x, Math.round(y + 4 + w * 0.6), 4, 4);
      }
      g.fillStyle = 'rgba(255,243,196,0.8)'; g.fillRect(x0, y + 5, 2, 2);
    }
    Q.w2.ohDraw = function (e, g, Q) {
      var D = e.data, cx = Q.cam.x, cy = Q.cam.y, i, s, k, a, x, y, h, heat = D.heat, st, face, col, v, sh, hb;
      for (i = 0; D.strips && i < D.strips.length; i++) {
        s = D.strips[i]; x = Math.round(s.x0 - cx); y = Math.round(D.floor - cy);
        if (s.st === 'glow') {
          a = 0.25 + 0.2 * Math.sin(s.t * 22) + 0.3 * (s.t / s.glow);
          g.fillStyle = 'rgba(255,80,40,' + a.toFixed(2) + ')'; g.fillRect(x, y - 2, 48, 6);
          g.fillStyle = '#ff4d2e'; g.fillRect(x, y, 48, 1);
          for (k = 0; k < 4; k++) { h = Math.round(((s.t * 30 + k * 7) % 10)); g.fillStyle = 'rgba(255,190,120,0.4)'; g.fillRect(x + 5 + k * 11, y - 3 - h, 1, 3); }
        } else if (s.st === 'burn') {
          g.fillStyle = 'rgba(255,170,60,0.9)'; g.fillRect(x, y - 4, 48, 6); g.fillStyle = '#fff3c4'; g.fillRect(x, y - 1, 48, 2);
          for (k = 0; k < 7; k++) { h = 5 + Math.round(5 * Math.abs(Math.sin(Q.t * 17 + k * 1.7))); g.fillStyle = k % 2 ? '#ffd23f' : '#ff7a1a'; g.fillRect(x + 2 + k * 7, y - 4 - h, 3, h); }
        }
      }
      st = heat < 35 ? 1 : heat < 70 ? 2 : 3; sh = D.melt && Math.floor(Q.t * 30) % 2 ? 1 : 0;
      x = Math.round(D.rx - cx) + sh; y = Math.round(D.ry - cy);
      Q.spr(g, 'overheat-rack', st, x, y, false);
      hb = Math.round(64 * Q.clamp(heat / 100, 0, 1));                                          // the heat bar
      g.fillStyle = heat < 50 ? '#ffb02e' : heat < 80 ? '#ff7a1a' : (Math.floor(Q.t * 8) % 2 ? '#fff3c4' : '#ff4d2e');
      g.fillRect(x + 41, y + 29 + 64 - hb, 5, hb);
      for (k = 0; k < 8; k++) { g.fillStyle = Q.w2.hash(k * 13 + Math.floor(Q.t * 5)) > 0.4 ? Q.w2.HEAT[st].a : '#1d1d24'; g.fillRect(x + 27, y + 30 + k * 8, 1, 1); }
      face = D.mood ? D.mood : D.blink < 0 ? 1 : 0; col = heat < 50 ? 0 : heat < 80 ? 1 : 2;
      Q.spr(g, 'overheat-lcd', face + 5 * col, x + 18, y + 5, false);
      for (i = 0; D.vents && i < D.vents.length; i++) {
        v = D.vents[i]; if (!v || v.dead) continue;
        k = v.st === 'glow' ? (Math.floor(v.stT * (v.stT > v.data.tg * 0.6 ? 16 : 8)) % 2 ? 2 : 1) : v.st === 'blast' ? 3 : v.st === 'open' ? 4 : v.st === 'cooled' ? 5 : 0;
        Q.spr(g, 'overheat-vent', k, x - 2, y + Q.w2.OH.VENTS[i].y, false);
        if (v.data.jet) w2DrawJet(g, v.data.jet, Q.t, cx, cy);
      }
    };

    // ---------- after the fight: Rack 7 at room temperature, humming (C2 drawn again on top, since this joins the list after it) ----------
    Q.defEnemy('overheat-cool', {
      name: 'RACK 7', w: 48, h: 96, hp: 1, xp: 0, tokens: 0, touch: 0, gravity: 0, solid: false, always: true, nohit: true,
      init: function (e) { e.data.noteT = 0.6; e.data.notes = []; },
      hit: function () { return false; },
      update: function (e, dt, Q) {   // it hums: a soft note rises every so often
        var N = e.data.notes, i;
        e.vx = 0; e.vy = 0; e.data.noteT -= dt;
        if (e.data.noteT <= 0) { e.data.noteT = 0.9; N.push(e.x + 22 + (N.length * 7) % 16, e.y - 2, 0); if (N.length > 12) N.splice(0, 3); }
        for (i = 0; i < N.length; i += 3) { N[i + 2] += dt; N[i + 1] -= 16 * dt; N[i] += Math.sin(N[i + 2] * 4) * 0.3; }
        while (N.length && N[2] > 1.6) N.splice(0, 3);
      },
      draw: function (e, g, Q) {
        var x = Math.round(e.x - Q.cam.x), y = Math.round(e.y - Q.cam.y), i, a;
        Q.spr(g, 'overheat-rack', 0, x, y, false);
        Q.spr(g, 'overheat-lcd', 4 + 15, x + 18, y + 5, false);
        g.fillStyle = '#2ec4b6'; g.fillRect(x + 41, y + 85, 5, 8);
        for (i = 0; i < 3; i++) Q.spr(g, 'overheat-vent', 0, x - 2, y + Q.w2.OH.VENTS[i].y, false);
        for (i = 0; i < e.data.notes.length; i += 3) {
          g.globalAlpha = Q.clamp(1.6 - e.data.notes[i + 2], 0, 1);
          Q.spr(g, 'note', Math.floor(e.data.notes[i + 2] * 4) % 2, Math.round(e.data.notes[i] - Q.cam.x), Math.round(e.data.notes[i + 1] - Q.cam.y), false);
          g.globalAlpha = 1;
        }
        for (i = 0; i < Q.ents.length; i++) {
          a = Q.ents[i];
          if (a.id === 'agent' && !a.dead) Q.spr(g, a.sprite, a.frame, Math.round(a.x + (a.w - 16) / 2 - Q.cam.x), Math.round(a.y + a.h - 20 - Q.cam.y), a.face < 0);
        }
      }
    });
