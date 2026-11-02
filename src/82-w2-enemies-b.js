    // ---------- 82-w2-enemies-b.js: WORLD 2's enemies, part two: TIMEOUT and PING (builder 7) ----------
    // TIMEOUT (pop TIMED OUT): ticks along a step at a time like a second hand; when the conductor comes near it RINGS (its tell: bells shaking,
    // mouth open) and hops at him. Its touch costs no heart: it freezes him for 0.6 s (Q.P.frozen), with a tick, a tock and frost on him.
    // PING (pop PONG): a packet ball that hops back and forth, across a gap when there is one in reach, else over a few tiles of floor.
    Q.w2 = Q.w2 || {};
    var W2_CLOCK = { STEP: 0.55, STEPV: 46, STEPT: 0.14, SEE: 76, RING: 0.6, HOPV: 250, HOPX: 105, FREEZE: 0.6, COOL: 1.8, RANGE: 64, REST: 0.8 };
    Q.w2.CLOCK = W2_CLOCK;
    function w2Floor(Q, x, y) { var tx = Math.floor(x / 16), ty = Math.floor(y / 16); return Q.solid(x, y) || Q.tile(tx, ty) === '='; }
    Q.defEnemy('timeout', {
      name: 'TIMEOUT', w: 12, h: 12, hp: 2, xp: 2, tokens: 1, touch: 0, sprite: 'timeout', gravity: 900, solid: true, col: '#7fd3f0',
      init: function (e) { var D = e.data; D.hx = e.x; D.cool = 0; D.tick = 0; D.ticks = 0; D.frost = 0; e.st = 'walk'; e.face = Math.floor(e.x / 16) % 2 ? -1 : 1; },
      update: function (e, dt, Q) {
        var D = e.data, C = W2_CLOCK, P = Q.P, dx, fx;
        D.cool -= dt;
        if (D.frost > 0) {   // frost on him while he is frozen (particles draw over him)
          D.frost -= dt; D.fz = ((D.fz || 0) + 7) % 13;
          if (P && P.frozen > 0 && D.fz % 2) Q.fx('dust', P.x + (D.fz % 11), P.y + 2 + (D.fz * 3) % 12, { n: 1, col: D.fz % 3 ? '#d4f4ff' : '#ffffff' });
        }
        if (P && !P.dead && D.cool <= 0 && !(P.frozen > 0) && !(P.hurtT > 0) && Q.overlap(e, P)) {   // its touch: a freeze
          P.frozen = C.FREEZE; P.vx = 0; P.dashing = false; D.frost = C.FREEZE; D.cool = C.COOL;
          Q.sfx('freeze'); Q.fx('text', P.x + P.w / 2, P.y - 8, { text: 'PLEASE WAIT', col: '#bfefff' }); Q.fx('spark', P.x + P.w / 2, P.y + 4, { n: 4, col: '#d4f4ff' });
          e.vx = (e.x + e.w / 2 < P.x + P.w / 2 ? -1 : 1) * 70; e.st = 'rest';
        }
        dx = P ? P.x + P.w / 2 - (e.x + e.w / 2) : 999;
        if (e.st === 'walk') {
          D.tick += dt;
          if (D.tick >= C.STEP) { D.tick -= C.STEP; D.ticks++; if (Q.near(e, 110)) Q.sfx('tick'); }
          fx = e.face > 0 ? e.x + e.w + 2 : e.x - 2;
          if (e.ground && (e.wallL || e.wallR || !w2Floor(Q, fx, e.y + e.h + 4) || (e.x - D.hx) * e.face > C.RANGE)) { e.face = -e.face; D.tick = 0; }
          e.vx = D.tick < C.STEPT ? e.face * C.STEPV : 0;
          if (P && !P.dead && D.cool <= 0 && e.ground && Math.abs(dx) < C.SEE && Math.abs(P.y + P.h - (e.y + e.h)) < 30) { e.st = 'ring'; e.face = dx < 0 ? -1 : 1; Q.sfx('charge'); }
        } else if (e.st === 'ring') {
          e.vx = 0;
          if (e.stT >= C.RING) { e.vy = -C.HOPV; e.vx = e.face * C.HOPX; e.st = 'hop'; Q.sfx('spring'); }
        } else if (e.st === 'hop') {
          if (e.ground && e.stT > 0.1) { e.st = 'rest'; e.vx = 0; Q.fx('dust', e.x + e.w / 2, e.y + e.h, { n: 2 }); }
        } else {
          if (e.ground) e.vx = Q.approach(e.vx, 0, 400 * dt);
          if (e.stT >= C.REST) e.st = 'walk';
        }
        e.frame = e.st === 'ring' ? 2 : e.st === 'hop' ? 3 : D.ticks % 2;
      },
      die: function (e, Q) { Q.w2.pop(e, Q, 'TIMED OUT', '#bfefff'); },
      draw: function (e, g, Q) {
        var P = Q.P, sh = e.st === 'ring' ? (Math.floor(e.t * 30) % 2 ? 1 : -1) : 0, x = Math.round(e.x - 1 - Q.cam.x) + sh, y = Math.round(e.y + e.h - 14 - Q.cam.y);
        if (!(e.hurtT > 0 && Math.floor(e.hurtT * 30) % 2 === 0)) Q.spr(g, 'timeout', e.frame, x, y, e.face < 0);
        if (e.st === 'ring') { g.fillStyle = '#ffd23f'; g.fillRect(x - 2, y + 1, 1, 2); g.fillRect(x + 15, y + 1, 1, 2); g.fillRect(x - 3, y + 4, 1, 1); g.fillRect(x + 16, y + 4, 1, 1); }
      },
      drawTop: function (e, g, Q) {   // after the conductor is drawn: the block of ice over him while this clock's freeze lasts
        var P = Q.P;
        if (P && e.data.frost > 0 && P.frozen > 0) Q.spr(g, 'w2-frost', Math.floor(e.t * 8) % 2, Math.round(P.x) - 6 - Q.cam.x, Math.round(P.y) + P.h - 24 - Q.cam.y, false);
      }
    });

    function w2PingSpan(e, Q, tx, ty, dir) {   // how far a ping hops from (tx, ty) going dir: across the first gap in reach, or 0
      var k, onFloor = true, gap = false, so = function (x, y) { return w2Floor(Q, x * 16 + 8, y * 16 + 8); };
      for (k = 1; k <= 9; k++) {
        if (Q.solid((tx + k * dir) * 16 + 8, ty * 16 + 8)) return 0;
        if (!so(tx + k * dir, ty + 1)) { gap = true; onFloor = false; }
        else if (gap && !onFloor) return so(tx + (k + 1) * dir, ty + 1) && !Q.solid((tx + (k + 1) * dir) * 16 + 8, ty * 16 + 8) ? k + 1 : k;
      }
      return 0;
    }
    function w2PingFlat(Q, tx, ty, dir) {   // a few tiles of floor to hop along, going dir
      var k; for (k = 1; k <= 3; k++) if (Q.solid((tx + k * dir) * 16 + 8, ty * 16 + 8) || !w2Floor(Q, (tx + k * dir) * 16 + 8, (ty + 1) * 16 + 8)) break;
      return k - 1;
    }
    Q.defEnemy('ping', {
      name: 'PING', w: 10, h: 10, hp: 1, xp: 1, tokens: 0, touch: 1, sprite: 'ping', gravity: 0, solid: false, stomp: true, col: '#39e27a',
      init: function (e, Q) {
        var D = e.data, tx = Math.floor((e.x + e.w / 2) / 16), ty = Math.floor((e.y + e.h / 2) / 16), dir = 1, n = w2PingSpan(e, Q, tx, ty, 1);
        if (!n) { n = w2PingSpan(e, Q, tx, ty, -1); if (n) dir = -1; }
        if (!n) { n = w2PingFlat(Q, tx, ty, 1); if (n < 2) { var m = w2PingFlat(Q, tx, ty, -1); if (m > n) { n = m; dir = -1; } } }
        n = Math.max(n, 1);
        D.ax = tx * 16 + 3; D.bx = (tx + n * dir) * 16 + 3; D.y0 = (ty + 1) * 16 - e.h;
        D.T = 0.55 + n * 16 / 220; D.H = 18 + n * 4; D.s = (tx % 3) / 3; D.leg = 0; D.rings = []; D.squash = 0;
        e.x = D.ax; e.y = D.y0;
      },
      update: function (e, dt, Q) {
        var D = e.data, i;
        D.s += dt / D.T;
        if (D.s >= 1) { D.s -= 1; D.leg = 1 - D.leg; D.squash = 0.1; D.rings.push(D.leg ? D.bx + 5 : D.ax + 5, D.y0 + e.h, 0); if (D.rings.length > 9) D.rings.splice(0, 3); }
        if (D.squash > 0) D.squash -= dt;
        for (i = 0; i < D.rings.length; i += 3) D.rings[i + 2] += dt;
        while (D.rings.length && D.rings[2] > 0.4) D.rings.splice(0, 3);
        e.x = D.leg ? Q.lerp(D.bx, D.ax, D.s) : Q.lerp(D.ax, D.bx, D.s); e.y = D.y0 - D.H * 4 * D.s * (1 - D.s); e.vx = 0; e.vy = 0;
        e.face = (D.bx > D.ax) === !D.leg ? 1 : -1;
        e.frame = D.squash > 0 ? 1 : (D.s > 0.12 && D.s < 0.3) || (D.s > 0.7 && D.s < 0.88) ? 2 : 0;
      },
      die: function (e, Q) { Q.w2.pop(e, Q, 'PONG', '#b8ffd2'); },
      draw: function (e, g, Q) {
        var D = e.data, i, k, r, a, cx = Q.cam.x, cy = Q.cam.y;
        for (i = 0; i < D.rings.length; i += 3) {   // a ring where it bounced: checking whether you are there
          r = 3 + D.rings[i + 2] * 40; g.fillStyle = 'rgba(57,226,122,' + (0.6 - D.rings[i + 2] * 1.4).toFixed(2) + ')';
          for (k = 0; k < 10; k++) { a = k / 10 * 6.283; g.fillRect(Math.round(D.rings[i] + Math.cos(a) * r - cx), Math.round(D.rings[i + 1] - 2 + Math.sin(a) * r * 0.45 - cy), 1, 1); }
        }
        if (e.hurtT > 0 && Math.floor(e.hurtT * 30) % 2 === 0) return;
        Q.spr(g, 'ping', e.frame, Math.round(e.x - 1 - cx), Math.round(e.y + e.h - 12 - cy), e.face < 0);
      }
    });
