    // ---------- 91-battle-sim-b.js: BATTLE MODE, one conductor's step (B16): the adventure's moves (52-engine-hero.js) for a conductor of the battle's own ----------
    // What differs from the adventure (BATTLE.md): QUICK KEYS, PAUSE TO THINK and FIRM HAND work only while borrowed (c.buff); while knocked (c.stun) he
    // cannot act; while a knock still carries him (c.flying) he steers at FLY_ACC, not the adventure's full air control; no hearts are lost here.
    BT.sim = function (c, inp, dt, ar) {
      var H = Q.HERO, N = BT.N, h = inp ? inp.h | 0 : 0, p = inp ? inp.p | 0 : 0, i, k, free, max, v0, v1, mid, wasGround, acc;
      var L = !!(h & 1), R = !!(h & 2), D = !!(h & 8), A = !!(h & 16), B = !!(h & 32);
      var tA = !!(p & 16), tB = !!(p & 32), tL = !!(p & 1), tR = !!(p & 2), tD = !!(p & 8), tC = !!(p & 128);
      c.wantNote = false; c.poundLand = false;
      if (c.out || c.gone) return;
      c.now += dt; c.lastT += dt;
      for (i = 0; i < BT.BUFFS.length; i++) { k = BT.BUFFS[i]; if (c.buff[k] > 0) c.buff[k] = Math.max(0, c.buff[k] - dt); }
      if (c.stun > 0) c.stun -= dt;
      if (c.grace > 0) c.grace -= dt;
      if (c.safe > 0) c.safe -= dt;
      if (c.lagT > 0) c.lagT -= dt;
      if (c.throwT > 0) c.throwT -= dt;
      if (c.landT > 0) c.landT -= dt;
      if (c.dropT > 0) c.dropT -= dt;
      c.drop = c.dropT > 0;
      if (c.rhythm < c.rhythmMax) { c.rhythmT += dt * (c.buff.metro > 0 ? N.METRO_K : 1); if (c.rhythmT >= H.RHYTHM_T) { c.rhythmT -= H.RHYTHM_T; c.rhythm++; } } else c.rhythmT = 0;
      if (tA) c.buffer = H.BUFFER; else if (c.buffer > 0) c.buffer -= dt;
      if (c.ground) c.coyote = H.COYOTE; else if (c.coyote > 0) c.coyote -= dt;
      free = !(c.stun > 0) && !(c.lagT > 0);

      // QUICK KEYS (borrowed): C, the way he is held or facing; or left or right tapped twice. On the ground any time, once in the air per jump
      if (tC) c.dashBuf = H.DASH_BUF; else if (c.dashBuf > 0) c.dashBuf -= dt;
      if (c.dashCool > 0) c.dashCool -= dt;
      if (free && c.buff.dash > 0 && !c.pounding && c.dashBuf > 0 && !c.dashing && !(c.dashCool > 0) && (c.ground || c.airDash)) { btDash(c, R && !L ? 1 : L && !R ? -1 : c.face); c.dashBuf = 0; }
      if (free && c.buff.dash > 0 && (tL || tR) && !c.pounding) {
        k = tL ? -1 : 1;
        if (c.tapDir === k && c.now - c.tapT <= H.DASH_TAP && !c.dashing && !(c.dashCool > 0) && (c.ground || c.airDash)) btDash(c, k);
        else { c.tapDir = k; c.tapT = c.now; }
      }
      // FIRM HAND (borrowed): in the air, Down and B: a short stop, then straight down
      if (free && tB && D && !c.ground && c.buff.pound > 0 && !c.pounding) {
        c.pounding = true; c.poundT = H.POUND_WAIT; c.poundId++; c.dashing = false; c.hovering = false; c.flying = false;
        c.vx = 0; c.vy = 0; c.swingT = 0; c.charged = false; c.chargeT = 0; tB = false; btFx(c, 's', 'drop');
      }
      // the swing (on the press), the charge (B held) and the note (let go when charged: one RHYTHM; the host makes the note)
      if (tB && !c.pounding) c.swingBuf = 0.1; else if (c.swingBuf > 0) c.swingBuf -= dt;
      if (c.swingT > 0) c.swingT -= dt;
      if (free && c.swingBuf > 0 && c.swingT <= 0 && !c.pounding) { c.swingT = H.SWING_T; c.swingId++; c.swingBuf = 0; c.chargeT = 0; c.charged = false; btFx(c, 's', 'swing'); }
      if (B && !c.pounding && free) { c.chargeT += dt; if (!c.charged && c.chargeT >= H.CHARGE_T) { c.charged = true; btFx(c, 's', 'charge'); } }
      else if (!B) {
        if (c.charged && c.wasB) { if (c.rhythm >= 1) { c.rhythm--; c.throwT = 0.16; c.wantNote = true; c.nN++; btFx(c, 's', 'note'); } else btFx(c, 's', 'nope'); }
        c.charged = false; c.chargeT = 0;
      }
      c.wasB = B;

      // jump; Down on a thin platform drops through it (Down and A too)
      if (!c.drop && c.ground && free && !c.pounding && tD && btOnThin(ar, c)) { c.dropT = 0.22; c.drop = true; c.buffer = 0; c.ground = false; c.coyote = 0; c.vy = 40; }
      if (c.buffer > 0 && (c.ground || c.coyote > 0) && free && !c.pounding) {
        if (D && c.ground && btOnThin(ar, c)) { c.dropT = 0.22; c.drop = true; c.buffer = 0; c.ground = false; c.coyote = 0; c.vy = 40; }
        else { c.vy = -H.JUMP; c.ground = false; c.coyote = 0; c.buffer = 0; c.dashing = false; c.jN++; btFx(c, 's', 'jump'); btFx(c, 'd', c.x + c.w / 2, c.y + c.h); }
      }

      // across
      if (c.dashing) c.vx = c.dashDir * H.DASH_V;
      else if (c.pounding) c.vx = 0;
      else if (!free) c.vx = Q.approach(c.vx, 0, (c.stun > 0 ? N.DRAG : H.STOP) * dt);
      else {
        k = (R ? 1 : 0) - (L ? 1 : 0); max = c.hovering ? H.HOVER_RUN : H.RUN;
        acc = c.flying ? N.FLY_ACC : 0;
        if (k) {
          c.face = k;
          if (c.vx * k < 0) c.vx = Q.approach(c.vx, k * max, (acc || H.STOP) * dt);
          else if (Math.abs(c.vx) > max) c.vx = Q.approach(c.vx, k * max, (acc || H.DASH_SLOW) * dt);
          else c.vx = Q.approach(c.vx, k * max, (c.ground ? H.ACC : H.AIRACC) * dt);
        } else c.vx = Q.approach(c.vx, 0, (c.ground ? H.STOP : acc || H.AIRACC) * dt);
      }
      // down: a dash holds him level, a pound waits then drops, a hover drifts, else gravity (A held while rising: GRAV_UP, never while knocked)
      wasGround = c.ground; v0 = c.vy;
      if (c.dashing) { c.dashT -= dt; v1 = 0; mid = 0; }
      else if (c.pounding) { if (c.poundT > 0) { c.poundT -= dt; v1 = 0; } else v1 = H.POUND_V; mid = v1; }
      else if (c.hovering) { c.hoverT -= dt; v1 = H.HOVER_FALL; mid = v1; }
      else { v1 = Math.min(v0 + (v0 < 0 && A && !c.flying && !(c.stun > 0) ? H.GRAV_UP : H.GRAV) * dt, Math.max(H.FALL, v0)); mid = (v0 + v1) * 0.5; }   // the mean speed: exact heights
      c.vy = mid;
      BT.move(ar, c, dt);
      if (!c.ground && !c.ceil) c.vy = v1;
      c.fallV = Math.max(c.fallV, v1);
      if (c.dashing && (c.dashT <= 0 || c.wallL || c.wallR)) { c.dashing = false; if (!c.wallL && !c.wallR) c.vx = c.dashDir * H.DASH_END; }
      if (c.ground) {
        if (c.pounding && c.poundT <= 0) {   // FIRM HAND lands: the host's rules shake the ground round him (92)
          c.pounding = false; c.lagT = 0.12; c.landT = 0.12; c.poundLand = true; c.pL++;
          btFx(c, 's', 'pound'); btFx(c, 'd', c.x + c.w / 2 - 6, c.y + c.h); btFx(c, 'd', c.x + c.w / 2 + 6, c.y + c.h);
        } else if (!wasGround && c.fallV > 160) { btFx(c, 's', 'land'); btFx(c, 'd', c.x + c.w / 2, c.y + c.h); c.landT = 0.1; }
        c.airDash = true; c.airHover = true; c.hovering = false; c.fallV = 0; c.flying = false;
      }
      // PAUSE TO THINK (borrowed): A held while falling, once per jump (not just above the ground: that press is a buffered jump)
      if (c.hovering && (!A || c.ground || c.hoverT <= 0 || !free || c.dashing || c.pounding)) c.hovering = false;
      if (!c.hovering && !c.ground && A && c.vy > 0 && c.airHover && free && !c.dashing && !c.pounding && c.buff.hover > 0 && !BT.groundNear(ar, c, 18)) {
        c.hovering = true; c.airHover = false; c.hoverT = H.HOVER_T; c.vy = H.HOVER_FALL; c.vx = Q.clamp(c.vx, -H.HOVER_RUN, H.HOVER_RUN); c.flying = false; btFx(c, 's', 'hover');
      }
      if (c.flying && !(c.stun > 0) && Math.abs(c.vx) <= H.RUN) c.flying = false;
      btFrame(c, dt);
    };
    function btFrame(c, dt) {   // the 'hero' frames (QUEST-API part 8), as the adventure picks them
      var H = Q.HERO, f;
      c.animT += dt;
      if (c.stun > 0) f = 16;
      else if (c.cheer) f = 17;
      else if (c.pounding) f = 15;
      else if (c.dashing) f = 12;
      else if (c.hovering) f = 13 + Math.floor(c.animT * 8) % 2;
      else if (c.throwT > 0) f = 11;
      else if (c.swingT > 0) f = c.swingT > H.SWING_T * 0.55 ? 8 : 9;
      else if (!c.ground) f = c.vy < 0 ? 6 : 7;
      else if (Math.abs(c.vx) > 8) { c.runT += dt * Math.max(0.6, Math.abs(c.vx) / H.RUN); f = 2 + Math.floor(c.runT * 10) % 4; }
      else if (c.charged || c.chargeT > 0.15) f = 10;
      else f = Math.floor(c.animT * 1.6) % 2;
      c.frame = f;
    }
