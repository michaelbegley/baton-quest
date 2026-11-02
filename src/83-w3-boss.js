    // ---------- 83-w3-boss.js: WORLD 3, THE CLOUD (builder 8): THE INFINITE LOOP ('loop'), the boss of THE LOOP (w3-boss) ----------
    // A snake of arrows racing round a ring track in the sky, C3 at its centre. Its head chases its tail: the gap opens ("BREAK" flashes there: only then can
    // the head be hurt), closes (the body stretches into a full ring, glowing: it cannot be hurt and throws arrows outward), opens again, a little faster each
    // lap. Phase 2 (two thirds of its hp): faster, and it turns round at every close ("CIRCLING BACK!"). Phase 3 (one third): it forks into two small loops,
    // one each side of C3, taking turns being open. Strike from the floor under the ring (jump) or from the side ledges where the track passes close.
    // A hit dazes it: it stops for 0.45 s and its head is harmless, so the conductor can drop away (measured: without this, every strike cost a heart).
    Q.w3 = Q.w3 || {};
    var W3_PH = {
      1: { w: 0.95, open: 3.0, closing: 0.8, closed: 1.2, opening: 0.6, shots: 6, sv: 66 },
      2: { w: 1.3, open: 2.6, closing: 0.7, closed: 1.0, opening: 0.5, shots: 8, sv: 80, flip: true },
      3: { w: 1.35, open: 2.4, closing: 0.6, closed: 1.6, opening: 0.6, shots: 4, sv: 70 }
    };
    function w3Loop(cx, cy, a, b, n, dir, ang, st, stT) {
      return { cx: cx, cy: cy, a: a, b: b, n: n, dir: dir, ang: ang, w: 1, sp: 2 * Math.PI / (n + 1), st: st || 'closed', stT: stT || 0, laps: 0, flinch: 0,
        hx: cx + a * Math.cos(ang), hy: cy + b * Math.sin(ang) };
    }
    function w3LoopSp(L, k) { var open = 2 * Math.PI * 0.72 / (L.n + 1), shut = 2 * Math.PI / (L.n + 1); return Q.lerp(open, shut, k); }   // 0 open, 1 closed
    function w3LoopAt(L, th, out) { out.x = L.cx + L.a * Math.cos(th); out.y = L.cy + L.b * Math.sin(th); return out; }
    function w3LoopDir(L, th) {   // the frame (0 to 7, 45 degrees each, 0 pointing right) of an arrow at th moving L.dir
      var dx = -L.a * Math.sin(th) * L.dir, dy = L.b * Math.cos(th) * L.dir, f = Math.round(Math.atan2(dy, dx) / (Math.PI / 4));
      return ((f % 8) + 8) % 8;
    }
    var w3P = { x: 0, y: 0 };
    Q.w3.loopStep = function (e, L, dt, ph) {   // one loop: its lap, its gap, its arrows
      var T = W3_PH[ph], P = Q.P, i, th, j, rot;
      if (L.flinch > 0) L.flinch -= dt;
      if (L.daze > 0) { L.daze -= dt; w3LoopAt(L, L.ang, w3P); L.hx = w3P.x; L.hy = w3P.y; return; }   // hit: it stops a moment, harmless, and its gap waits
      L.ang += L.dir * L.w * T.w * dt; L.stT += dt;
      if (L.st === 'open' && L.stT >= T.open) { L.st = 'closing'; L.stT = 0; Q.sfx('charge'); }
      else if (L.st === 'closing' && L.stT >= T.closing) {
        L.st = 'closed'; L.stT = 0; L.laps++; L.w = Math.min(1.3, L.w * 1.06);
        if (T.flip) { L.ang = L.ang - L.dir * L.n * L.sp; L.dir = -L.dir; Q.w3.loopSay(L, 'CIRCLING BACK!'); }
        else Q.w3.loopSay(L, Q.w3.word('shout', 'loop', 'AGAIN! AGAIN!'));
        rot = Q.rand() * Math.PI * 2;
        for (j = 0; j < T.shots; j++) {   // the closed loop overflows: arrows thrown outward
          th = rot + j * Math.PI * 2 / T.shots; w3LoopAt(L, th, w3P);
          var nx = Math.cos(th) / L.a, ny = Math.sin(th) / L.b, nl = Math.sqrt(nx * nx + ny * ny) || 1;
          Q.spawn('loop-dart', w3P.x - 4, w3P.y - 4, { vx: nx / nl * T.sv, vy: ny / nl * T.sv });
        }
        Q.sfx('note');
      }
      else if (L.st === 'closed' && L.stT >= T.closed) { L.st = 'opening'; L.stT = 0; }
      else if (L.st === 'opening' && L.stT >= T.opening) { L.st = 'open'; L.stT = 0; Q.sfx('gate'); }
      L.sp = w3LoopSp(L, L.st === 'closed' ? 1 : L.st === 'closing' ? L.stT / T.closing : L.st === 'opening' ? 1 - L.stT / T.opening : 0);
      w3LoopAt(L, L.ang, w3P); L.hx = w3P.x; L.hy = w3P.y;
      if (P && !P.dead && Q.level && P.hurtT <= 0) {   // touching any arrow of the body hurts (the head is the boss's own box)
        for (i = 0; i < L.n; i++) {
          th = L.ang - L.dir * (i + 1) * L.sp; w3LoopAt(L, th, w3P);
          if (P.x < w3P.x + 5 && P.x + P.w > w3P.x - 5 && P.y < w3P.y + 5 && P.y + P.h > w3P.y - 5) { Q.hurt(1, w3P.x); break; }
        }
      }
    };
    Q.w3.loopSay = function (L, text) { Q.fx('text', L.hx, L.hy - 14, { text: text, col: '#ffd23f', life: 1.2 }); };
    Q.w3.loopTrack = function () { return (Q.level && Q.level.w3track) || { cx: 160, cy: 70, a: 112, b: 38, lx: 96, rx: 224, sa: 46, sb: 28 }; };

    Q.defBoss('loop', { name: 'THE INFINITE LOOP', face: 'face-loop', music: 'boss-loop', intro: 'w3-boss', outro: 'w3-won',
      w: 14, h: 14, hp: 40, xp: 35, tokens: 12, touch: 1, gravity: 0, solid: false, stun: false, col: '#ff8a1e',
      init: function (e) {
        var t = Q.w3.loopTrack();
        e.data.ph = 1; e.data.loops = [w3Loop(t.cx, t.cy, t.a, t.b, 22, 1, -Math.PI / 2, 'closed', -0.6)];
        e.data.vul = null; e.data.say = 0;
        e.x = t.cx - 7; e.y = t.cy - t.b - 7;
      },
      update: function (e, dt) {
        var d = e.data, i, L, P = Q.P, t = Q.w3.loopTrack(), best = null, bd = 1e9;
        e.vx = 0; e.vy = 0;
        if (d.ph === 1 && e.hp <= e.maxHp * 0.66) {   // phase 2: faster, and it turns round at every close
          d.ph = 2; L = d.loops[0]; L.st = 'closing'; L.stT = 0; L.w = 1; Q.sfx('roar'); Q.music('boss-loop2'); Q.flash('#ffffff', 0.12); Q.w3.loopSay(L, Q.w3.word('shout', 'loopfast', 'DOUBLE TIME!'));
        } else if (d.ph === 2 && e.hp <= e.maxHp * 0.33) {   // phase 3: it forks into two small loops, one each side of C3
          d.ph = 3; L = d.loops[0];
          d.loops = [w3Loop(t.lx, t.cy, t.sa, t.sb, 10, 1, 0, 'opening', 0), w3Loop(t.rx, t.cy, t.sa, t.sb, 10, -1, Math.PI, 'closed', -1.2)];
          Q.sfx('roar'); Q.shake(3, 0.3); Q.flash('#ffffff', 0.15);
          Q.fx('pop', t.lx, t.cy); Q.fx('pop', t.rx, t.cy); Q.fx('text', t.cx, t.cy - t.b - 10, { text: 'FORKING! TWO OF ME!', col: '#ffd23f', life: 1.6 });
        }
        for (i = 0; i < d.loops.length; i++) Q.w3.loopStep(e, d.loops[i], dt, d.ph);
        for (i = 0; i < d.loops.length; i++) {   // the open head nearest him is the one that can be hit
          L = d.loops[i]; if (L.st !== 'open') continue;
          var dd = P ? Math.abs(L.hx - P.x) + Math.abs(L.hy - P.y) : 0; if (dd < bd) { bd = dd; best = L; }
        }
        d.vul = best; L = best || d.loops[0];
        e.x = L.hx - 7; e.y = L.hy - 7; e.touch = L.daze > 0 ? 0 : 1;
        if (d.loops.length > 1 && P && P.hurtT <= 0) {   // in phase 3 the other head hurts by touch too
          for (i = 0; i < d.loops.length; i++) { var o = d.loops[i]; if (o !== L && P.x < o.hx + 6 && P.x + P.w > o.hx - 6 && P.y < o.hy + 6 && P.y + P.h > o.hy - 6) Q.hurt(1, o.hx); }
        }
        if (d.say > 0) d.say -= dt;
      },
      hit: function (e, how, n) {
        var d = e.data, L = d.vul;
        if (!L) { Q.fx('spark', e.x + 7, e.y + 7, { n: 3, col: '#ffffff' }); if (d.say <= 0) { d.say = 2.5; Q.fx('text', e.x + 7, e.y - 6, { text: 'NO GAP!', col: '#bcd6ee', life: 0.6 }); } return false; }
        L.flinch = 0.25; L.daze = 0.45; e.touch = 0; Q.shake(2, 0.1);
        if (d.say <= 0 && e.hp - n > 0) { d.say = 2.5; Q.w3.loopSay(L, Q.w3.word('hurt', 'loop', 'OW! OW!')); }
        return true;
      },
      die: function (e) {
        var L = e.data.vul || e.data.loops[0];
        Q.spawn('loop-done', L.hx, L.hy, { n: 8 });
        Q.fx('text', L.hx, L.hy - 16, { text: Q.w3.word('beaten', 'loop', 'I\'M... DONE?'), col: '#ffffff', life: 2 });
      },
      draw: function (e, g) {
        var d = e.data, i, j, L, th, f, sx, sy, cx = Q.cam.x, cy = Q.cam.y, blink = Math.floor(Q.t * 8) % 2 === 0;
        for (i = 0; i < d.loops.length; i++) {
          L = d.loops[i];
          var glow = L.st === 'closed' || (L.st === 'closing' && blink);
          for (j = L.n - 1; j >= 0; j--) {
            th = L.ang - L.dir * (j + 1) * L.sp; w3LoopAt(L, th, w3P); f = w3LoopDir(L, th);
            Q.spr(g, 'loop-seg', f + (glow ? 8 : 0), Math.round(w3P.x - cx) - 6, Math.round(w3P.y - cy) - 6);
          }
          f = w3LoopDir(L, L.ang); sx = Math.round(L.hx - cx); sy = Math.round(L.hy - cy);
          var hot = (L === d.vul && blink) || (L.flinch > 0 && Math.floor(L.flinch * 30) % 2 === 0);
          Q.spr(g, 'loop-head', f + (hot ? 8 : 0), sx - 8 + (L.flinch > 0 ? Math.round(Math.sin(L.flinch * 60) * 2) : 0), sy - 8);
          if (L.st === 'open' && (Q.t * 3) % 1 < 0.7) {   // BREAK, in the middle of the gap
            th = L.ang + L.dir * (2 * Math.PI - L.n * L.sp) / 2; w3LoopAt(L, th, w3P);
            Q.w3.text(g, 'BREAK', Math.round(w3P.x - cx), Math.round(w3P.y - cy) - 3, '#ff8a1e');
          }
        }
      } });

    // beaten: it uncurls into one straight arrow pointing home and goes, thrilled to be finished
    Q.defEnemy('loop-done', { name: 'ONE STRAIGHT ARROW', w: 8, h: 8, hp: 1, xp: 0, tokens: 0, touch: 0, gravity: 0, solid: false, nohit: true, always: true,
      init: function (e) { e.data.n = (e.o && e.o.n) || 8; e.data.x0 = e.x; },
      update: function (e, dt) { e.vy = 0; e.vx = e.t < 0.9 ? 0 : Math.min(260, (e.t - 0.9) * 400); if (e.t > 3) Q.remove(e); },
      draw: function (e, g) {
        var n = e.data.n, k = Math.min(1, e.t / 0.6), i, x = Math.round(e.x - Q.cam.x), y = Math.round(e.y - Q.cam.y);
        for (i = 0; i < n; i++) Q.spr(g, 'loop-seg', 0, x - 6 - Math.round((i + 1) * 10 * k), y - 6 + Math.round(Math.sin(e.t * 9 + i) * 2 * (1 - k)));
        Q.spr(g, 'loop-head', 0, x - 8, y - 8);
      } });
    // the closed loop's overflow: an arrow pops off the ring, hangs a moment pointing where it will go (the tell: it cannot hurt yet), then flies.
    // The baton can swat one.
    Q.defEnemy('loop-dart', { name: 'LOOSE ARROW', w: 8, h: 8, hp: 1, xp: 0, tokens: 0, touch: 0, gravity: 0, solid: true, stun: false,
      init: function (e) { e.data.vx = e.vx; e.data.vy = e.vy; e.vx = 0; e.vy = 0; e.data.f = ((Math.round(Math.atan2(e.data.vy, e.data.vx) / (Math.PI / 4)) % 8) + 8) % 8; e.temp = true; },
      update: function (e) {
        if (e.t < 0.35) { e.vx = 0; e.vy = 0; e.touch = 0; return; }
        e.touch = 1; e.vx = e.data.vx; e.vy = e.data.vy;
        if (e.t > 3.2 || e.wallL || e.wallR || e.ground || e.ceil) { Q.fx('dust', e.x + 4, e.y + 4, { n: 2 }); Q.remove(e); }
      },
      draw: function (e, g) {
        var x = Math.round(e.x + 4 - Q.cam.x) - 6, y = Math.round(e.y + 4 - Q.cam.y) - 6;
        if (e.t < 0.35 && Math.floor(e.t * 20) % 2) return;
        Q.spr(g, 'loop-dart', e.data.f, x, y);
      } });
