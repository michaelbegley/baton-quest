    // ---------- 52-engine-hero.js (ENGINE): the conductor's moves, by Q.HERO's numbers ----------
    // Run, jump (coyote time, a buffer, a variable height), the swing, the charged note and RHYTHM, QUICK KEYS, PAUSE TO THINK, FIRM HAND, drop-through,
    // hurt, falling out (a heart, back to the last safe ground). Each press is seen once, in the first step of a frame (engTap).
    var engFP = {}, engTaken = {}, engNow = 0, engGod = false, engHitStop = 0;
    function engTap(n) { if (!engFP[n] || engTaken[n]) return false; engTaken[n] = true; return true; }
    Q.press = function (n) { return engTap(n); };   // part 13, 28: a press, at most once in a frame, to whoever asks first (the engine, the UI, a world)
    function engTakeAll() { for (var i = 0; i < ENG_KEYS.length; i++) engTaken[ENG_KEYS[i]] = true; }

    function engMakeHero(px, py) {
      var s = engSave();
      return { x: px, y: py, w: Q.HERO.W, h: Q.HERO.H, vx: 0, vy: 0, face: 1, ground: false, wallL: false, wallR: false, ceil: false,
        hp: s.maxHp, maxHp: s.maxHp, power: s.power, rhythm: s.rhythmMax, rhythmMax: s.rhythmMax, hurtT: 0, frozen: 0, dashing: false, hovering: false, pounding: false,
        coyote: 0, buffer: 0, jumping: false, airDash: true, airHover: true, dashT: 0, dashDir: 1, hoverT: 0, poundT: 0, poundId: 0, lagT: 0,
        swingT: 0, swingId: 0, swingBuf: 0, chargeT: 0, charged: false, throwT: 0, wasB: false, rhythmT: 0, knockT: 0, tapDir: 0, tapT: -9,
        dashBuf: 0, dashCool: 0, carryT: 0, trail: [], trailT: 0,
        airJump: true, kickWall: null, kickT: 0, kickDir: 0, sliding: 0, slideFx: 0, djT: 0, newAir: false,   // PUSHBACK and FOLLOW UP (52-engine-moves.js)
        on: null, dropT: 0, drop: false, safeX: px, safeY: py, landT: 0, animT: 0, runT: 0, frame: 0, dead: false, deadT: 0, cheer: false, cheerT: 0, py: py, fallV: 0 };
    }
    function engFirm(tx, ty) { var t = engInfoT(tx, ty); return !!t && (t.solid || t.oneWay) && !t.breakBy && !t.hurt && !(t.def && t.def.notSafe); }   // notSafe: part 13, 27
    function engGroundNear(P, d) {   // solid or thin ground within d px under his feet
      var tx, ty, x0 = Math.floor(P.x / 16), x1 = Math.floor((P.x + P.w - 0.01) / 16);
      for (ty = Math.floor((P.y + P.h) / 16); ty <= Math.floor((P.y + P.h + d) / 16); ty++)
        for (tx = x0; tx <= x1; tx++) if (engSolidT(tx, ty) || engOneWayT(tx, ty)) return true;
      return false;
    }
    function engOnThin(P) {   // standing on a thin platform (a '=' tile or a platform entity), with no solid tile under him
      if (P.on) return true;
      var ty = Math.floor((P.y + P.h + 1) / 16), x0 = Math.floor(P.x / 16), x1 = Math.floor((P.x + P.w - 0.01) / 16), thin = false, tx;
      for (tx = x0; tx <= x1; tx++) { if (engSolidT(tx, ty)) return false; if (engOneWayT(tx, ty)) thin = true; }
      return thin;
    }
    function engThrow(P) {   // the charged note: one RHYTHM
      if (P.rhythm < 1) { Q.sfx('nope'); Q.fx('dust', P.x + P.w / 2 + P.face * 8, P.y + 4); return; }
      P.rhythm--; P.throwT = 0.16;
      Q.spawn('note', P.face > 0 ? P.x + P.w : P.x - 8, P.y + 1, { vx: P.face * Q.HERO.NOTE_V, life: Q.HERO.NOTE_T, dmg: P.power });
      Q.sfx('note');
    }
    function engSwingBox(P) { var H = Q.HERO; return { x: P.face > 0 ? P.x + P.w - 4 : P.x + 4 - H.SWING_W, y: P.y - 2, w: H.SWING_W, h: H.SWING_H }; }

    function engHeroStep(dt) {
      var P = Q.P, H = Q.HERO, a = Q.api, tx, k, b;
      if (!P) return;
      if (!P.dead) engUnstick(P);
      P.py = P.y;
      if (P.dead) { P.deadT += dt; P.vy = Math.min(P.vy + H.GRAV * dt, H.FALL); P.y += P.vy * dt; P.frame = 16; return; }
      var L = a.held('left'), R = a.held('right'), D = a.held('down'), A = a.held('a'), B = a.held('b');
      var tA = engTap('a'), tB = engTap('b'), tL = engTap('left'), tR = engTap('right'), tC = engTap('c');
      if (P.hurtT > 0) P.hurtT -= dt;
      if (P.frozen > 0) P.frozen -= dt;
      if (P.knockT > 0) P.knockT -= dt;
      if (P.lagT > 0) P.lagT -= dt;
      if (P.throwT > 0) P.throwT -= dt;
      if (P.landT > 0) P.landT -= dt;
      if (P.dropT > 0) P.dropT -= dt;
      if (P.kickT > 0) P.kickT -= dt;
      if (P.djT > 0) P.djT -= dt;
      P.drop = P.dropT > 0;
      if (P.rhythm < P.rhythmMax) { P.rhythmT += dt; if (P.rhythmT >= H.RHYTHM_T) { P.rhythmT -= H.RHYTHM_T; P.rhythm++; } } else P.rhythmT = 0;
      if (tA) P.buffer = H.BUFFER; else if (P.buffer > 0) P.buffer -= dt;
      if (P.ground) P.coyote = H.COYOTE; else if (P.coyote > 0) P.coyote -= dt;
      var free = !(P.frozen > 0) && !(P.knockT > 0) && !(P.lagT > 0);

      // QUICK KEYS: the C button (14.10 item 9), the way he is held or facing; or left or right tapped twice within DASH_TAP. On the ground any time, once in the air per jump
      if (tC) P.dashBuf = H.DASH_BUF; else if (P.dashBuf > 0) P.dashBuf -= dt;   // a press kept a moment, so C just before landing or a cooldown's end still dashes
      if (P.dashCool > 0) P.dashCool -= dt;
      if (P.carryT > 0) P.carryT -= dt;
      if (free && Q.has('dash') && !P.pounding && P.dashBuf > 0 && !P.dashing && !(P.dashCool > 0) && (P.ground || P.airDash)) {
        engDashGo(P, R && !L ? 1 : L && !R ? -1 : P.face); P.dashBuf = 0;
      }
      if (free && (tL || tR) && Q.has('dash') && !P.pounding) {
        k = tL ? -1 : 1;
        if (P.tapDir === k && engNow - P.tapT <= H.DASH_TAP && !P.dashing && (P.ground || P.airDash)) engDashGo(P, k);
        else { P.tapDir = k; P.tapT = engNow; }
      }
      // FIRM HAND: in the air, Down and B
      if (free && tB && D && !P.ground && Q.has('pound') && !P.pounding) {
        P.pounding = true; P.poundT = H.POUND_WAIT; P.poundId++; P.dashing = false; P.hovering = false;
        P.vx = 0; P.vy = 0; P.swingT = 0; P.charged = false; P.chargeT = 0; tB = false; Q.sfx('drop'); Q.emit('pound');
      }
      // the swing (on the press), the charge (B held) and the note (let go when charged)
      if (tB && !P.pounding) P.swingBuf = 0.1; else if (P.swingBuf > 0) P.swingBuf -= dt;
      if (P.swingT > 0) P.swingT -= dt;
      if (free && P.swingBuf > 0 && P.swingT <= 0 && !P.pounding) { P.swingT = H.SWING_T; P.swingId++; P.swingBuf = 0; P.chargeT = 0; P.charged = false; Q.sfx('swing'); }
      if (B && !P.pounding && free) { P.chargeT += dt; if (!P.charged && P.chargeT >= H.CHARGE_T) { P.charged = true; Q.sfx('charge'); } }
      else if (!B) { if (P.charged && P.wasB) engThrow(P); P.charged = false; P.chargeT = 0; }
      P.wasB = B;

      // jump, or Down and A on a thin platform: drop through it; Down alone drops too (2 Nov: the boss pressed Down first)
      if (!P.drop && P.ground && free && !P.pounding && engOnThin(P) && engTap('down')) { P.dropT = 0.22; P.drop = true; P.buffer = 0; P.ground = false; P.coyote = 0; P.on = null; P.vy = 40; }
      if (P.buffer > 0 && (P.ground || P.coyote > 0) && free && !P.pounding) {
        if (D && P.ground && engOnThin(P)) { P.dropT = 0.22; P.drop = true; P.buffer = 0; P.ground = false; P.coyote = 0; P.on = null; P.vy = 40; }
        else {
          if (P.dashing) P.carryT = H.DASH_CARRY;   // a jump out of a dash keeps its speed a little while
          P.vy = -H.JUMP; P.jumping = true; P.ground = false; P.coyote = 0; P.buffer = 0; P.on = null; P.dashing = false;
          Q.sfx('jump'); Q.fx('dust', P.x + P.w / 2, P.y + P.h, { n: 2 }); Q.emit('jump');
        }
      }
      if (P.buffer > 0 && !P.ground && !(P.coyote > 0) && free && !P.pounding) engAirMoves(P, tA, L, R);   // PUSHBACK's kick, else FOLLOW UP (52-engine-moves.js)

      // across
      if (P.dashing) P.vx = P.dashDir * H.DASH_V;
      else if (P.pounding) P.vx = 0;
      else if (!free) P.vx = Q.approach(P.vx, 0, (P.knockT > 0 ? 260 : H.STOP) * dt);
      else {
        k = (R ? 1 : 0) - (L ? 1 : 0);
        if (P.kickT > 0) k = P.kickDir;   // PUSHBACK: pushed away from the wall for KICK_LOCK, whatever is held
        var max = P.hovering ? H.HOVER_RUN : H.RUN;
        if (k) {
          P.face = k;
          if (P.vx * k < 0) P.vx = Q.approach(P.vx, k * max, H.STOP * dt);
          else if (Math.abs(P.vx) > max) P.vx = Q.approach(P.vx, k * max, (P.carryT > 0 || P.kickT > 0 ? H.DASH_SLOW : H.STOP) * dt);   // faster than a run after a dash or a kick: eased off, not cut
          else P.vx = Q.approach(P.vx, k * max, (P.ground ? H.ACC : H.AIRACC) * dt);
        } else P.vx = Q.approach(P.vx, 0, (P.ground ? H.STOP : H.AIRACC) * dt);
      }
      // down: a dash holds him level, a pound waits then drops, a hover drifts, else gravity (A held while rising: GRAV_UP)
      P.sliding = engSlideSide(P, L, R, free); if (P.sliding) P.face = -P.sliding;   // PUSHBACK: down a wall he is held into, facing out
      var wasGround = P.ground, v0 = P.vy, v1 = v0, mid;
      if (P.dashing) { P.dashT -= dt; v1 = 0; mid = 0; }
      else if (P.pounding) { if (P.poundT > 0) { P.poundT -= dt; v1 = 0; } else v1 = H.POUND_V; mid = v1; }
      else if (P.hovering) { P.hoverT -= dt; v1 = H.HOVER_FALL; mid = v1; }
      else if (P.sliding) { v1 = engSlideBrake(P, v0); mid = (v0 + v1) * 0.5; }
      else { v1 = Math.min(v0 + (v0 < 0 && A ? H.GRAV_UP : H.GRAV) * dt, H.FALL); mid = (v0 + v1) * 0.5; }   // the mean speed: exact heights
      P.vy = mid;
      var bottom0 = P.y + P.h;
      Q.move(P, dt);
      if (!P.ground && !P.ceil) P.vy = v1;
      engMovesTop(P);
      if (!P.ground) engPlatformLand(P, bottom0);
      else P.on = null;
      P.fallV = Math.max(P.fallV, v1);
      if (P.dashing && (P.dashT <= 0 || P.wallL || P.wallR)) { P.dashing = false; if (!P.wallL && !P.wallR) { P.vx = P.dashDir * H.DASH_END; P.carryT = H.DASH_CARRY; } }   // it ends at DASH_END and eases to a run
      engTrailStep(P, dt);

      if (P.ground) {
        if (P.pounding && P.poundT <= 0) {   // FIRM HAND lands: break what is under him and keep going, or shake the ground
          k = 0; b = Math.floor((P.y + P.h + 1) / 16);
          for (tx = Math.floor(P.x / 16); tx <= Math.floor((P.x + P.w - 0.01) / 16); tx++) if (engBreakTile(tx, b, 'pound')) k++;
          if (k && !P.on) { P.ground = false; Q.shake(2, 0.12); } else engPoundLand(P);
        } else if (!wasGround) {
          if (P.fallV > 160) { Q.sfx('land'); Q.fx('dust', P.x + P.w / 2, P.y + P.h); P.landT = 0.1; }
        }
        if (P.ground) { P.airDash = true; P.airHover = true; P.jumping = false; P.hovering = false; P.fallV = 0; engMovesLanded(P); }
        if (P.ground && !P.on && !P.pounding) {   // the last safe ground: both feet on firm tiles, no spikes beside him
          b = Math.floor((P.y + P.h + 1) / 16); var lx = Math.floor((P.x + 1) / 16), rx = Math.floor((P.x + P.w - 1) / 16), ry = Math.floor((P.y + P.h - 1) / 16);
          var bad = false; for (tx = lx - 1; tx <= rx + 1; tx++) { var ht = engInfoT(tx, ry); if (ht && ht.hurt) bad = true; }
          if (!bad && engFirm(lx, b) && engFirm(rx, b)) { P.safeX = P.x; P.safeY = P.y; }
        }
      }
      // PAUSE TO THINK: A held while falling, once per jump (not when the ground is just under him: that press is a buffered jump)
      if (P.hovering && (!A || P.ground || P.hoverT <= 0 || !free || P.dashing || P.pounding)) P.hovering = false;
      if (!P.hovering && !P.ground && A && P.vy > 0 && P.airHover && free && !P.dashing && !P.pounding && Q.has('hover') && !engGroundNear(P, 18)) {
        P.hovering = true; P.airHover = false; P.hoverT = H.HOVER_T; P.vy = H.HOVER_FALL; P.vx = Q.clamp(P.vx, -H.HOVER_RUN, H.HOVER_RUN); Q.sfx('hover'); Q.emit('hover');
      }
      // the swing's box, for its first 0.14 s: enemies (once each per swing) and crates
      if (P.swingT > 0 && P.swingT > H.SWING_T - 0.14) { b = engSwingBox(P); engHitBox(b, P.power, 'baton', P.swingId); engBreakBox(b, 'baton'); }
      engSlideFx(P, dt);
      engHurtTiles(P);
      if (P.y > engTH * 16 + 24) engFallOut(P);
      engHeroFrame(P, dt);
    }
