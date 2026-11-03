    // ---------- 52-engine-hero-b.js (ENGINE): the conductor, part two: platforms, the pound's landing, hurt, falling out, his frames and drawing ----------
    function engPlatformLand(P, bottom0) {   // falling onto an entity with e.platform (a cloud, a lift): stand on it; it carries him (53)
      P.on = null;
      if (P.vy < 0 || P.drop) return;
      for (var i = 0; i < Q.ents.length; i++) {
        var e = Q.ents[i];
        if (!e.platform || e.dead || P.x + P.w <= e.x || P.x >= e.x + e.w) continue;
        if (bottom0 <= e.y + 2 && P.y + P.h >= e.y) { P.y = e.y - P.h; P.vy = 0; P.ground = true; P.on = e; return; }
      }
    }
    function engPoundLand(P) {   // the ground shakes: enemies on the ground within POUND_R take damage and are stunned
      var H = Q.HERO, cx = P.x + P.w / 2, by = P.y + P.h, i, e;
      P.pounding = false; P.lagT = 0.12; P.landT = 0.12;
      Q.sfx('pound'); Q.shake(4, 0.3); Q.fx('dust', cx - 6, by, { n: 3 }); Q.fx('dust', cx + 6, by, { n: 3 });
      for (i = 0; i < Q.ents.length; i++) {
        e = Q.ents[i];
        if (e.dead || !engHittable(e) || e.poundId === P.poundId || !e.ground) continue;
        if (Math.abs(e.x + e.w / 2 - cx) <= H.POUND_R + e.w / 2 && Math.abs(e.y + e.h - by) <= 12) {
          e.poundId = P.poundId;
          Q.damage(e, P.power, 'pound');
          if (!e.dead && !e.def.boss && e.def.stun !== false) e.stun = H.POUND_STUN;
        }
      }
    }
    function engHurtTiles(P) {   // spikes hurt in the bottom half of their tile; a world's hurt tiles in the whole tile (less a pixel)
      var tx, ty, t, bx;
      for (ty = Math.floor(P.y / 16); ty <= Math.floor((P.y + P.h - 0.01) / 16); ty++)
        for (tx = Math.floor(P.x / 16); tx <= Math.floor((P.x + P.w - 0.01) / 16); tx++) {
          t = engInfoT(tx, ty); if (!t || !t.hurt) continue;
          bx = t.spike ? { x: tx * 16 + 1, y: ty * 16 + 8, w: 14, h: 8 } : { x: tx * 16 + 1, y: ty * 16 + 1, w: 14, h: 14 };
          if (Q.overlap(P, bx) && Q.hurt(t.hurt, tx * 16 + 8) && t.spike) P.vy = -240;
        }
    }
    function engFallOut(P) {   // out of the bottom of the level: a heart, back to the last safe ground
      var s = engSave(); s.falls = (s.falls || 0) + 1;
      P.x = P.safeX; P.y = P.safeY; P.vx = 0; P.vy = 0; P.dashing = false; P.hovering = false; P.pounding = false; P.on = null; P.knockT = 0; engMovesLanded(P);
      var free = engGod || engCheatOn('wfh');   // WORK FROM HOME: a fall costs no heart either
      if (!free) P.hp = Math.max(0, P.hp - 1);
      Q.emit('fall', { n: free ? 0 : 1 });   // part 14.1 (n: the heart it cost)
      P.hurtT = Q.HERO.HURT_T;
      Q.sfx('hurt'); Q.flash('#ff5a5a', 0.15); engCamSnap();
      if (P.hp <= 0) engDie();
    }
    Q.hurt = function (n, fromX) {   // a heart (n), a knock back away from fromX, then HURT_T of blinking with no more hurt
      var P = Q.P, H = Q.HERO;
      if (!P || P.dead || engGod || engArenaSafe() || engCheatOn('wfh')) return false;   // WORK FROM HOME: nothing hurts
      n = n === undefined || n === null ? 1 : +n;
      if (!(n > 0) || P.hurtT > 0) return false;
      var lost = Math.min(n, P.hp); P.hp = Math.max(0, P.hp - n); P.hurtT = H.HURT_T; P.knockT = 0.22;
      Q.emit('hurt', { n: lost });
      var dir = typeof fromX !== 'number' || isNaN(fromX) ? -P.face : (P.x + P.w / 2 < fromX ? -1 : 1);
      P.vx = dir * H.KNOCK; P.vy = -150; P.ground = false; P.on = null;
      P.dashing = false; P.hovering = false; P.pounding = false; P.charged = false; P.chargeT = 0; P.swingT = 0;
      Q.sfx('hurt'); Q.shake(2, 0.15); Q.fx('hit', P.x + P.w / 2, P.y + 5, { col: '#ff6b6b' });
      engHitStop = Math.max(engHitStop, 0.06);
      if (P.hp <= 0) engDie();
      return true;
    };
    function engDie() { var P = Q.P; if (!P || P.dead) return; P.dead = true; P.deadT = 0; P.vx = 0; P.vy = -240; P.hurtT = 0; Q.music(null); }
    Q.near = function (e, r) {
      var P = Q.P; if (!P || !e || P.dead) return null;
      var dx = P.x + P.w / 2 - (e.x + e.w / 2), dy = P.y + P.h / 2 - (e.y + e.h / 2);
      return dx * dx + dy * dy <= r * r ? P : null;
    };

    function engHeroFrame(P, dt) {   // the 'hero' sprite's frames (QUEST-API part 8)
      var H = Q.HERO, f;
      P.animT += dt;
      if (P.cheerT > 0) P.cheerT -= dt;
      if (P.knockT > 0) f = 16;
      else if (P.cheer || (P.cheerT > 0 && P.ground && P.swingT <= 0)) f = 17;
      else if (P.pounding) f = 15;
      else if (P.dashing) f = 12;
      else if (P.hovering) f = 13 + Math.floor(P.animT * 8) % 2;
      else if (P.throwT > 0) f = 11;
      else if (P.swingT > 0) f = P.swingT > H.SWING_T * 0.55 ? 8 : 9;
      else if (P.sliding) f = 18;   // PUSHBACK: his back to the wall, a glove on it (52-engine-moves.js)
      else if (P.djT > 0 && !P.ground) f = 19;   // FOLLOW UP: knees up, the baton high
      else if (!P.ground) f = P.vy < 0 ? 6 : 7;
      else if (Math.abs(P.vx) > 8) { P.runT += dt * Math.max(0.6, Math.abs(P.vx) / H.RUN); f = 2 + Math.floor(P.runT * 10) % 4; }
      else if (P.charged || P.chargeT > 0.15) f = 10;
      else f = Math.floor(P.animT * 1.6) % 2;
      P.frame = f;
    }
    function engHeroId() {   // part 13, 25: the gold bow tie, bought and not switched off, while ART's 'hero-gold' is there
      var s = Q.SAVE;
      return s && s.shop && s.shop.bowtie && s.opt && s.opt.bowtie !== 'white' && engOwn(Q.SPRITE, 'hero-gold') ? 'hero-gold' : 'hero';
    }
    function engDashGo(P, k) {   // a dash starts: level and fast for DASH_T, a short freeze, a puff, the sound (14.10 item 9)
      var H = Q.HERO;
      P.dashing = true; P.dashT = H.DASH_T; P.dashDir = k; P.face = k; P.tapDir = 0; P.hovering = false; P.dashCool = H.DASH_COOL; P.carryT = 0; P.trailT = 0;
      if (!P.ground) P.airDash = false;
      if (H.DASH_FREEZE > 0) engHitStop = Math.max(engHitStop, H.DASH_FREEZE);
      Q.sfx('dash'); Q.fx('dust', P.x + P.w / 2 - k * 5, P.y + P.h); Q.emit('dash');
    }
    function engTrailStep(P, dt) {   // while dashing, a copy of him every 0.03 s that fades over 0.15 s
      var i;
      if (P.dashing) { P.trailT -= dt; if (P.trailT <= 0) { P.trailT = 0.03; P.trail.push({ x: P.x, y: P.y, f: P.frame, face: P.face, t: 0.15 }); } }
      for (i = P.trail.length - 1; i >= 0; i--) { P.trail[i].t -= dt; if (P.trail[i].t <= 0) P.trail.splice(i, 1); }
    }
    function engDrawHero(g) {
      var P = Q.P; if (!P) return;
      var id = engHeroId(), tr, n;
      for (n = 0; P.trail && n < P.trail.length; n++) {   // the dash's fading copies, behind him
        tr = P.trail[n]; g.globalAlpha = Q.clamp(0.4 * tr.t / 0.15, 0, 0.4);
        Q.spr(g, id, tr.f, Math.round(tr.x) - 3 - Q.cam.x, Math.round(tr.y) + P.h - 20 - Q.cam.y, tr.face < 0);
      }
      g.globalAlpha = 1;
      if (P.hurtT > 0 && !P.dead && Math.floor(P.hurtT * 16) % 2 === 1) return;   // blinking
      var x = Math.round(P.x) - 3 - Q.cam.x, y = Math.round(P.y) + P.h - 20 - Q.cam.y, flip = P.face < 0, k, on, gx, gy;
      var tall = engCheatOn('tall') ? 1.5 : 1;   // TALL ORDER: drawn half again as tall, from his feet (his box is the same)
      if (P.landT > 0) { k = Math.min(1, P.landT / 0.1); engSprSquash(g, id, P.frame, x, y, flip, 1 + 0.25 * k, (1 - 0.2 * k) * tall, false); }
      else if (tall > 1) engSprSquash(g, id, P.frame, x, y, flip, 1, tall, false);
      else Q.spr(g, id, P.frame, x, y, flip);
      if (P.charged || P.chargeT > 0.15) {   // the baton glows: a spark at its tip, brighter when charged
        on = Math.floor(Q.t * 14) % 2; gx = flip ? x - 1 : x + 15; gy = y + 8;
        g.fillStyle = P.charged ? (on ? '#ffffff' : '#ffd23f') : 'rgba(255,210,63,0.6)';
        g.fillRect(gx, gy, 2, 2);
        if (P.charged) { g.fillRect(gx - 2, gy + 0.5, 1, 1); g.fillRect(gx + 3, gy + 0.5, 1, 1); g.fillRect(gx + 0.5, gy - 2, 1, 1); g.fillRect(gx + 0.5, gy + 3, 1, 1); }
      }
      if (P.swingT > Q.HERO.SWING_T - 0.12) {   // a quick white smear where the swing hits
        var b = engSwingBox(P), bx = b.x - Q.cam.x, by = b.y - Q.cam.y, fr = P.face > 0;
        g.fillStyle = 'rgba(255,255,255,0.75)';
        g.fillRect(fr ? bx + 10 : bx + 4, by + 1, 6, 1); g.fillRect(fr ? bx + 14 : bx + 2, by + 3, 3, 3);
        g.fillRect(fr ? bx + 16 : bx + 1, by + 6, 2, 5); g.fillRect(fr ? bx + 14 : bx + 2, by + 11, 3, 2);
      }
    }
    function engFree(P, x, y) {   // his box at x, y touches no solid tile
      var tx, ty;
      for (ty = Math.floor(y / 16); ty <= Math.floor((y + P.h - 0.01) / 16); ty++)
        for (tx = Math.floor(x / 16); tx <= Math.floor((x + P.w - 0.01) / 16); tx++) if (engSolidT(tx, ty)) return false;
      return true;
    }
    function engUnstick(P) {   // a safety net: inside solid tiles or past the level's sides (something set his place), to the nearest free spot, up first
      var lw = engTW * 16, x = Q.clamp(P.x, 0, Math.max(0, lw - P.w)), d, k, nx, ny;
      if (x === P.x && engFree(P, P.x, P.y)) return false;
      for (d = 0; d <= 64; d += 2) for (k = 0; k < 4; k++) {
        nx = x + (k === 1 ? d : k === 2 ? -d : 0); ny = P.y + (k === 0 ? -d : k === 3 ? d : 0);
        if (nx >= 0 && nx + P.w <= lw && engFree(P, nx, ny)) { P.x = nx; P.y = ny; P.on = null; return true; }
      }
      P.x = P.safeX; P.y = P.safeY; P.vx = 0; P.vy = 0; P.on = null;
      return true;
    }
