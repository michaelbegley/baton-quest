    // ---------- 83-w3-enemies-b.js: WORLD 3, THE CLOUD (builder 8): RATE LIMITER, CACHE MISS and PUSH NOTIFICATION ----------
    Q.w3 = Q.w3 || {};

    // RATE LIMITER: a gate hung under a ceiling (put it in the top tile of a passage three tiles high). Every gate keeps the level's beat (Q.w3.BEAT):
    // open 3 beats (green lamp), a warning beat (yellow, it shudders), it slams to the floor, stays shut (red), rises. It cannot be beaten, only passed on the
    // beat: a conductor who keeps time walks straight through (a swing only clanks off it: NOT YET). Its phase is base - tx * wave (the level's w3gates; by default a run at full speed meets each open).
    function w3GateBars(g, x, y0, y1) {
      var h = y1 - y0, i;
      if (h <= 0) return;
      g.fillStyle = '#1d1d24'; g.fillRect(x + 1, y0, 2, h); g.fillRect(x + 13, y0, 2, h);
      for (i = 0; i < 3; i++) g.fillRect(x + 4 + i * 3, y0, 2, h);
      g.fillStyle = '#7f8fa8'; for (i = 0; i < 3; i++) g.fillRect(x + 4 + i * 3, y0, 1, h);
      g.fillStyle = '#6a7a96'; g.fillRect(x + 2, y0, 1, h); g.fillRect(x + 13, y0, 1, h);
    }
    Q.defEnemy('limiter', { name: 'RATE LIMITER', w: 14, h: 16, hp: 1, xp: 0, tokens: 0, touch: 1, gravity: 0, solid: false, stun: false,
      init: function (e) {
        var h = Q.w3.home(e), d = e.data, k, gw = (Q.level && Q.level.w3gates) || {};
        d.tx = h.tx; d.top = h.ty * 16;
        for (k = 1; k < 12; k++) if (Q.solid(h.tx * 16 + 8, (h.ty + k) * 16 + 8)) break;
        d.floor = (h.ty + k) * 16; d.open = d.top + 16; d.bottom = d.open; d.lamp = 0; d.side = 0; d.told = false;
        d.phase = gw.by && gw.by[h.tx] !== undefined ? gw.by[h.tx] : (gw.base || 0) - h.tx * (gw.wave !== undefined ? gw.wave : 16 / 110);   // by: a phase for one gate, by its column
        e.x = h.tx * 16 + 1; e.y = d.top; e.w = 14; e.h = 16;
      },
      update: function (e, dt) {
        var d = e.data, B = Q.w3.BEAT, cyc = 6 * B, now = Q.w3.st ? Q.w3.st.t : e.t, b = (((now + d.phase) % cyc) + cyc) % cyc / B, P = Q.P, was = d.bottom, side;
        e.vx = 0; e.vy = 0;
        if (b < 3) { d.bottom = d.open; d.lamp = 0; e.st = 'open'; }
        else if (b < 4) { d.bottom = d.open + (Math.floor(b * 8) % 2) * 2; d.lamp = 1; e.st = 'warn'; }
        else if (b < 4.25) { d.bottom = Q.lerp(d.open, d.floor, (b - 4) / 0.25); d.lamp = 2; e.st = 'slam'; }
        else if (b < 5.5) { d.bottom = d.floor; d.lamp = 2; e.st = 'shut'; }
        else { d.bottom = Q.lerp(d.floor, d.open, (b - 5.5) / 0.5); d.lamp = b < 5.8 ? 2 : 1; e.st = 'rise'; }
        d.b = b;
        if (Math.floor(b) !== d.beat) { d.beat = Math.floor(b); if (b < 4 && P && Math.abs(P.x - e.x) < 120 && Math.abs(P.y - e.y) < 80) Q.sfx('tick'); }   // each beat ticks near him
        if (was < d.floor && d.bottom >= d.floor && P && Math.abs(P.x - e.x) < 220) { Q.sfx('gate'); Q.shake(1, 0.08); Q.fx('dust', e.x + 7, d.floor, { n: 3 }); }
        e.y = d.top; e.h = Math.max(8, Math.round(d.bottom - d.top));
        if (P && !P.dead) {   // let through on the beat: a little word the first time he passes it open
          side = P.x + P.w / 2 < e.x + 7 ? -1 : 1;
          if (d.side && side !== d.side && !d.told && (e.st === 'open' || e.st === 'warn') && P.y + P.h > d.top) { d.told = true; Q.w3.pop(e, Q.w3.word('pop', 'limiter', 'LET THROUGH'), '#4fd67a'); }
          d.side = side;
        }
        if (d.clankT > 0) d.clankT -= dt;
      },
      hit: function (e, how) {   // it cannot be beaten: a hit clanks off it (a spark, a clunk, and NOT YET while it is shut), so he learns it opens on the beat
        var d = e.data, P = Q.P, y = P ? Q.clamp(P.y + 6, e.y + 4, e.y + e.h - 4) : e.y + e.h / 2;
        Q.fx('spark', e.x + 7, y, { n: 4, col: '#ffffff' }); Q.sfx('clunk');
        if (!(d.clankT > 0) && e.st !== 'open') { d.clankT = 0.8; Q.fx('text', e.x + 7, y - 10, { text: 'NOT YET', col: '#ffd23f', life: 0.7 }); }
        return false;
      },
      draw: function (e, g) {
        var d = e.data, x = Math.round(e.x - 1 - Q.cam.x), top = Math.round(d.top - Q.cam.y), bot = Math.round(d.bottom - Q.cam.y);
        w3GateBars(g, x, top + 6, bot - 14);
        g.save(); g.beginPath(); g.rect(x, top + 6, 16, Q.H); g.clip();
        Q.spr(g, 'limiter', d.lamp, x, bot - 16);
        g.restore();
        Q.spr(g, 'limiter-top', 0, x, top);
        var b = d.b || 0, lit = b < 3 ? 3 - Math.floor(b) : 0, i;   // the beat, counted down on its housing: three greens go out one a beat, then yellow, then red
        for (i = 0; i < 3; i++) {
          g.fillStyle = i < lit ? (b % 1 < 0.15 ? '#ffffff' : '#4fd67a') : e.st === 'warn' ? (Math.floor(b * 8) % 2 ? '#ffd23f' : '#3a3f52') : e.st === 'open' ? '#2a3344' : '#e2504c';
          g.fillRect(x + 3 + i * 4, top + 2, 2, 3);
        }
      } });

    // CACHE MISS: blinks in and out. Gone, it cannot be seen, touched or hit; then its dotted outline flickers where it will be (the tell), then it is there
    // (it drifts at him and can be hit) and then it blinks out again ("MISS"). A hit that does not finish it makes it blink out at once.
    Q.defEnemy('miss', { name: 'CACHE MISS', w: 12, h: 12, hp: 4, xp: 4, tokens: 1, touch: 0, gravity: 0, solid: false, stomp: true, col: '#c9b6f2',
      init: function (e) { var d = e.data; d.hx = e.x; d.hy = e.y; e.st = 'gone'; d.wait = 0.3 + Q.rand() * 0.8; e.hidden = true; e.touch = 0; },
      update: function (e, dt) {
        var d = e.data, P = Q.P, cx, cy, side, dx, dy, dl;
        e.vx = 0; e.vy = 0;
        if (e.st === 'gone') {
          e.hidden = true; e.touch = 0;
          if (e.stT >= d.wait && P && !P.dead && Math.abs(P.x - d.hx) < 200 && Math.abs(P.y - d.hy) < 130) {
            side = Q.rand() < 0.65 ? P.face : -P.face;
            cx = Q.clamp(P.x + P.w / 2 + side * (40 + Q.rand() * 16), d.hx - 110, d.hx + 110); cy = P.y + P.h / 2 - 10 + (Q.rand() - 0.5) * 12;
            if (Math.abs(cx - (P.x + P.w / 2)) < 30) cx = P.x + P.w / 2 - side * 44;
            e.x = cx - e.w / 2; e.y = cy - e.h / 2; e.st = 'tell'; e.hidden = false; e.frame = 2;
          }
        } else if (e.st === 'tell') {
          e.frame = 2; e.touch = 0; e.hidden = (e.stT * 6) % 1 > 0.7;
          if (e.stT >= 0.7) { e.st = 'here'; e.hidden = false; e.touch = 1; Q.sfx('select'); }
        } else if (e.st === 'here') {
          e.frame = Math.floor(e.t * 4) % 2; e.touch = 1; e.hidden = false;
          if (P) { dx = P.x + P.w / 2 - (e.x + e.w / 2); dy = P.y + P.h / 2 - (e.y + e.h / 2); dl = Math.sqrt(dx * dx + dy * dy) || 1; e.vx = dx / dl * 22; e.vy = dy / dl * 22; e.face = dx < 0 ? -1 : 1; }
          if (e.stT >= 2.4) e.st = 'fade';
        } else {
          e.touch = 0; e.frame = 0; e.hidden = Math.floor(e.stT * 16) % 2 === 1;
          if (e.stT >= 0.3) { Q.w3.pop(e, 'MISS', '#c9b6f2'); e.st = 'gone'; d.wait = 1 + Q.rand() * 0.6; e.hidden = true; }
        }
      },
      hit: function (e, how, n) { if (e.st !== 'here') return false; if (e.hp - n > 0) { e.st = 'fade'; e.touch = 0; Q.w3.pop(e, 'HIT!', '#ffffff'); } return true; },
      die: function (e) { e.hidden = false; Q.w3.pop(e, Q.w3.word('pop', 'miss', 'CACHE HIT!'), '#ffd23f'); } });

    // PUSH NOTIFICATION (world 3's own): a little bell with a red badge. Near him it rings ("DING!", it shakes: the tell), swoops at where he was, then flies home.
    Q.defEnemy('push', { name: 'PUSH NOTIFICATION', w: 12, h: 12, hp: 2, xp: 2, tokens: 1, touch: 1, gravity: 0, solid: false, stomp: true, col: '#ffd23f',
      init: function (e) { e.data.hx = e.x; e.data.hy = e.y; e.data.cool = 0.6; e.st = 'idle'; },
      update: function (e, dt) {
        var d = e.data, P = Q.P, dx, dy, dl;
        if (e.st === 'idle') {
          e.vx = 0; e.vy = 0; e.x = d.hx + Math.sin(e.t * 1.7) * 3; e.y = d.hy + Math.sin(e.t * 3.1) * 2; e.frame = Math.floor(e.t * 3) % 2;
          d.cool -= dt;
          if (d.cool <= 0 && P && !P.dead && Q.near(e, 115) && P.y + P.h > e.y - 4) { e.st = 'ring'; Q.w3.pop(e, 'DING!', '#ffd23f'); Q.sfx('select'); }
        } else if (e.st === 'ring') {
          e.frame = 2; e.vx = 0; e.vy = 0; e.x = d.hx + (Math.floor(e.stT * 30) % 2 ? 1 : -1);
          if (e.stT >= 0.55 && P) {
            dx = P.x + P.w / 2 - (e.x + e.w / 2); dy = P.y + P.h / 2 - (e.y + e.h / 2); dl = Math.sqrt(dx * dx + dy * dy) || 1;
            e.vx = dx / dl * 150; e.vy = dy / dl * 150; e.face = dx < 0 ? -1 : 1; e.st = 'dive';
          }
        } else if (e.st === 'dive') {
          e.frame = 2;
          if (e.stT >= 0.8 || Q.solid(e.x + e.w / 2 + e.vx * 0.06, e.y + e.h / 2 + e.vy * 0.06)) e.st = 'back';
        } else {
          dx = d.hx - e.x; dy = d.hy - e.y; dl = Math.sqrt(dx * dx + dy * dy); e.frame = Math.floor(e.t * 3) % 2;
          if (dl < 3) { e.x = d.hx; e.y = d.hy; e.vx = 0; e.vy = 0; e.st = 'idle'; d.cool = 1.4; } else { e.vx = dx / dl * 55; e.vy = dy / dl * 55; }
        }
      },
      die: function (e) { Q.w3.pop(e, Q.w3.word('pop', 'push', 'DO NOT DISTURB'), '#ffd23f'); } });
