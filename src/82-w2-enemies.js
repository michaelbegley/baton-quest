    // ---------- 82-w2-enemies.js: WORLD 2's enemies: BUG and SPARK here, TIMEOUT and PING in 82-w2-enemies-b.js (builder 7) ----------
    // LORE.md: a BUG insists it is a feature (pop FIXED); a SPARK is a loose connection running along the cables and cannot be beaten, only avoided.
    Q.w2 = Q.w2 || {};
    function w2Pop(e, Q, fallback, col) {   // the little word an enemy leaves when it is beaten (STORY's bank, with our own fallback)
      var w = (Q.story && Q.story.pop && Q.story.pop[e.id]) || fallback;
      Q.fx('text', e.x + e.w / 2, e.y - 4, { text: w, col: col || '#ffffff' });
    }
    Q.w2.pop = w2Pop;

    // ---------- BUG: crawls round the outline of the solid tiles (floors, walls, ceilings, over corners), never more than 5 tiles from home ----------
    // Its contact point (cx, cy) is on the surface; n is the side the surface faces (an index into Q.w2.DIRS: 0 right, 1 down, 2 left, 3 up), d the way it goes.
    var W2_BUG = { SPEED: 26, LEASH: 80 };
    function w2BugPlace(e) {
      var D = e.data;
      if (D.n === 3) { e.x = D.cx - 5; e.y = D.cy - 10; } else if (D.n === 1) { e.x = D.cx - 5; e.y = D.cy; }
      else if (D.n === 0) { e.x = D.cx; e.y = D.cy - 5; } else { e.x = D.cx - 10; e.y = D.cy - 5; }
    }
    function w2BugAttach(e, Q, tx, ty) {   // cling to whatever is next to the cell (tx, ty): a floor first, then a wall, then a ceiling
      var D = e.data, so = function (x, y) { return Q.solid(x * 16 + 8, y * 16 + 8); };
      D.fall = false; e.gravity = 0; e.solid = false; e.vx = 0; e.vy = 0;
      if (so(tx, ty + 1)) { D.n = 3; D.cx = tx * 16 + 8; D.cy = (ty + 1) * 16; D.d = D.d === 0 || D.d === 2 ? D.d : (tx % 2 ? 2 : 0); }
      else if (so(tx - 1, ty)) { D.n = 0; D.cx = tx * 16; D.cy = ty * 16 + 8; D.d = 3; }
      else if (so(tx + 1, ty)) { D.n = 2; D.cx = (tx + 1) * 16; D.cy = ty * 16 + 8; D.d = 1; }
      else if (so(tx, ty - 1)) { D.n = 1; D.cx = tx * 16 + 8; D.cy = ty * 16; D.d = 2; }
      else { D.fall = true; e.gravity = 900; e.solid = true; return; }
      w2BugPlace(e);
    }
    Q.defEnemy('bug', {
      name: 'BUG', w: 10, h: 10, hp: 2, xp: 1, tokens: 0, touch: 1, sprite: 'bug', gravity: 0, solid: false, stomp: true, col: '#7fe0a0',
      init: function (e, Q) {
        var tx = Math.floor((e.x + e.w / 2) / 16), ty = Math.floor((e.y + e.h / 2) / 16);
        e.data.d = -1; w2BugAttach(e, Q, tx, ty);
        e.data.hx = e.x + e.w / 2; e.data.hy = e.y + e.h / 2; e.data.back = 0;
      },
      update: function (e, dt, Q) {
        var D = e.data, DI = Q.w2.DIRS, rem = W2_BUG.SPEED * dt, dx, dy, nx, ny, pos, next, dist, guard = 0, cxm, cym;
        if (D.fall) {   // landed: cling to the cell it stands over (2 Nov: perched on a corner, the cell under its middle was empty and it never let go of falling)
          if (e.ground) { var fy = Math.floor((e.y + e.h / 2) / 16), fc = Math.floor((e.x + e.w / 2) / 16), fa = Math.floor((e.x + 1) / 16), fb = Math.floor((e.x + e.w - 1) / 16);
            w2BugAttach(e, Q, Q.solid(fc * 16 + 8, (fy + 1) * 16 + 8) ? fc : Q.solid(fa * 16 + 8, (fy + 1) * 16 + 8) ? fa : fb, fy); }
          return;
        }
        D.back -= dt;
        if (D.back <= 0) {   // too far from home: turn back
          cxm = e.x + e.w / 2 - D.hx; cym = e.y + e.h / 2 - D.hy;
          if (cxm * cxm + cym * cym > W2_BUG.LEASH * W2_BUG.LEASH) { D.d = (D.d + 2) % 4; D.back = 1.2; }
        }
        while (rem > 0.0001 && guard++ < 6) {
          dx = DI[D.d][0]; dy = DI[D.d][1]; nx = DI[D.n][0]; ny = DI[D.n][1];
          pos = dx ? D.cx : D.cy;
          next = (dx + dy) > 0 ? (Math.floor(pos / 16) + 1) * 16 : (Math.ceil(pos / 16) - 1) * 16;
          dist = Math.abs(next - pos);
          if (dist > rem) { D.cx += dx * rem; D.cy += dy * rem; rem = 0; break; }
          D.cx += dx * dist; D.cy += dy * dist; rem -= dist;
          if (Q.solid(D.cx + dx * 8 + nx * 8, D.cy + dy * 8 + ny * 8)) { var od = D.d; D.d = D.n; D.n = (od + 2) % 4; }          // a wall ahead: climb it
          else if (!Q.solid(D.cx + dx * 8 - nx * 8, D.cy + dy * 8 - ny * 8)) { var od2 = D.d; D.d = (D.n + 2) % 4; D.n = od2; }   // the edge: over it
        }
        dx = DI[D.d][0]; dy = DI[D.d][1]; nx = DI[D.n][0]; ny = DI[D.n][1];
        if (!Q.solid(D.cx + dx * 2 - nx * 4, D.cy + dy * 2 - ny * 4) && !Q.solid(D.cx - dx * 2 - nx * 4, D.cy - dy * 2 - ny * 4)) {   // what it was on is gone (a crate broke): fall, only when both sides of its foot are empty (2 Nov: one look ahead dropped it off every corner)
          D.fall = true; e.gravity = 900; e.solid = true; e.vy = 0; D.n = 3; return;
        }
        w2BugPlace(e); e.vx = 0; e.vy = 0;
        e.face = D.d === 2 ? -1 : 1;
      },
      die: function (e, Q) { w2Pop(e, Q, 'FIXED', '#7fe0a0'); },
      draw: function (e, g, Q) {
        var D = e.data, w = Math.floor(e.t * 7) % 2, pose = 0, flip = false, sx, sy;
        if (D.fall) { pose = 0; sx = e.x + e.w / 2 - 6; sy = e.y + e.h - 12; }
        else if (D.n === 3) { pose = 0; flip = D.d === 2; sx = D.cx - 6; sy = D.cy - 12; }
        else if (D.n === 1) { pose = 1; flip = D.d === 0; sx = D.cx - 6; sy = D.cy; }
        else if (D.n === 0) { pose = D.d === 1 ? 2 : 3; sx = D.cx; sy = D.cy - 6; }
        else { pose = D.d === 3 ? 4 : 5; sx = D.cx - 12; sy = D.cy - 6; }
        if (e.hurtT > 0 && Math.floor(e.hurtT * 30) % 2 === 0) return;
        Q.spr(g, 'bug', pose * 2 + w, Math.round(sx - Q.cam.x), Math.round(sy - Q.cam.y), flip);
      }
    });

    // ---------- SPARK: runs along cable tiles (- | +), straight on where it can, turning at corners, back at a dead end. It cannot be beaten. ----------
    var W2_SPARK = { SPEED: 62 };
    function w2SparkPick(e, Q, rev) {   // at a tile's centre: straight on if the cable goes on, else a turn, else back
      var D = e.data, L = Q.w2.cableLink, c = [D.d, (D.d + (D.turn ? 1 : 3)) % 4, (D.d + (D.turn ? 3 : 1)) % 4, (D.d + 2) % 4], i;
      if (rev) c = [(D.d + 2) % 4];
      for (i = 0; i < c.length; i++) if (L(D.tx, D.ty, c[i])) { D.d = c[i]; return true; }
      return false;
    }
    Q.defEnemy('spark', {
      name: 'SPARK', w: 8, h: 8, hp: 1, xp: 0, tokens: 0, touch: 1, sprite: 'spark', gravity: 0, solid: false, nohit: true, col: '#ffd23f',
      init: function (e, Q) {
        var D = e.data, tx = Math.floor((e.x + e.w / 2) / 16), ty = Math.floor((e.y + e.h / 2) / 16), isC = Q.w2.isCable, i, h, v;
        if (!isC(Q.tile(tx, ty))) {   // it sits on a cable: put the cable back where the map had the spark's letter
          h = isC(Q.tile(tx - 1, ty)) || isC(Q.tile(tx + 1, ty)); v = isC(Q.tile(tx, ty - 1)) || isC(Q.tile(tx, ty + 1));
          if (h || v) Q.setTile(tx, ty, h && v ? '+' : h ? '-' : '|');
        }
        D.tx = tx; D.ty = ty; D.p = 0; D.turn = tx % 2 === 0; D.d = tx % 2 ? 2 : 0; D.trail = []; D.zapT = 0;
        if (!w2SparkPick(e, Q)) { for (i = 0; i < 4 && !Q.w2.cableLink(tx, ty, D.d); i++) D.d = (D.d + 1) % 4; }
        e.x = tx * 16 + 4; e.y = ty * 16 + 4;
      },
      hit: function () { return false; },
      update: function (e, dt, Q) {
        var D = e.data, DI = Q.w2.DIRS, guard = 0, P = Q.P;
        D.p += W2_SPARK.SPEED * dt;
        while (D.p >= 16 && guard++ < 3) {
          if (!Q.w2.cableLink(D.tx, D.ty, D.d)) { D.p = 0; if (!w2SparkPick(e, Q)) break; continue; }
          D.tx += DI[D.d][0]; D.ty += DI[D.d][1]; D.p -= 16;
          if (!w2SparkPick(e, Q)) w2SparkPick(e, Q, true);
        }
        if (!Q.w2.cableLink(D.tx, D.ty, D.d)) D.p = 0;
        e.x = D.tx * 16 + 4 + DI[D.d][0] * D.p; e.y = D.ty * 16 + 4 + DI[D.d][1] * D.p; e.vx = 0; e.vy = 0;
        D.trail.unshift(e.x + 4, e.y + 4); if (D.trail.length > 12) D.trail.length = 12;
        D.zapT -= dt;
        if (D.zapT <= 0) { D.zapT = 0.5 + Q.rand() * 0.6; Q.fx('spark', e.x + 4, e.y + 4, { n: 1 }); if (P && Q.near(e, 72)) Q.sfx('zap'); }
        e.frame = Math.floor(e.t * 14) % 3;
      },
      draw: function (e, g, Q) {
        var D = e.data, i, cx = Q.cam.x, cy = Q.cam.y;
        for (i = 2; i < D.trail.length; i += 2) { g.fillStyle = i < 6 ? 'rgba(255,210,63,0.55)' : 'rgba(255,138,30,0.3)'; g.fillRect(Math.round(D.trail[i] - cx) - 1, Math.round(D.trail[i + 1] - cy) - 1, 2, 2); }
        Q.spr(g, 'spark', e.frame, Math.round(e.x - 1 - cx), Math.round(e.y - 1 - cy), false);
      }
    });
