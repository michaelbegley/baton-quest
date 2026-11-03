    // ---------- 52-engine-moves.js (ENGINE, B21 MOVES, 2 Nov): two new moves, each learned once in the game (QUEST-API.md part 23) ----------
    // PUSHBACK (Q.has('walljump')): in the air, falling and held toward a wall, he slides down it at SLIDE_V. A (or a press the jump buffer kept) with a wall
    // within KICK_REACH px of his side kicks him up (KICK_VY, a jump's own: let go early, lower) and away (KICK_VX); for KICK_LOCK he is pushed away whatever
    // is held. A wall is a solid tile of the map that stays put (not a crate, a pound block, a hazard or a tile that comes and goes) along his middle; never
    // the level's sides or anything above its top, never a thin shelf or a moving platform (those are no solid tiles). The wall he last kicked off takes no
    // slide and no kick again until he lands or kicks off another, and he cannot get back over it either (it stands on up to the sky for him until then):
    // one wall alone cannot be climbed, two facing walls can.
    // FOLLOW UP (Q.has('doublejump')): one more jump in the air, a fresh press of A once the coyote time is over: his upward speed is set to DJUMP (not added),
    // A held keeps it rising, as a jump. Refilled on landing and by a kick only (never by a dash, a hover, a stomp, a lift or a hurt). Falling with the ground
    // within 18 px, the press is the landing's buffered jump instead (the hover's own rule). It ends a hover (spent) and a dash (the way a dash ends itself).
    // Neither move makes the old three stronger: a kick refills no dash and no hover, and FOLLOW UP refills nothing. Once he knows either move the level's
    // top is a ceiling (nothing takes him out of a level's edges or top). Research, numbers and sources: the scratchpad's b21/MOVES.md.
    Q.HERO.SLIDE_V = 45; Q.HERO.SLIDE_GRIP = 1800;   // px/s down a wall, and how fast a faster fall is braked to it
    Q.HERO.KICK_REACH = 3; Q.HERO.KICK_VX = 150; Q.HERO.KICK_VY = 300; Q.HERO.KICK_LOCK = 0.16;   // a wall this near still kicks; the kick's speeds; the push's time
    Q.HERO.DJUMP = 260; Q.HERO.DJUMP_POSE = 0.3;   // FOLLOW UP's upward speed (a jump is 300), and how long its pose shows
    Q.ABILITY.walljump = { name: 'PUSHBACK', from: 'secret', how: 'HOLD INTO A WALL, A TO KICK OFF' };
    Q.ABILITY.doublejump = { name: 'FOLLOW UP', from: 'secret', how: 'IN THE AIR, A AGAIN TO JUMP' };   // 31 letters or fewer: the pause's ABILITIES window (U.AB_HOW, B20)
    Q.MOVES = ['dash', 'hover', 'pound', 'walljump', 'doublejump'];   // every move in the order they are shown (the HUD, the pause menu, the codex)

    function engWallTile(tx, ty) {   // a tile he can slide down and kick off: solid, in the map, not breakable, not a hazard, not one that comes and goes
      var t;
      if (!engInfo || tx < 0 || tx >= engTW || ty < 0 || ty >= engTH) return false;
      t = engInfo[ty * engTW + tx];
      return !!t && !!t.solid && !t.breakBy && !t.hurt && !(t.def && t.def.notSafe);
    }
    function engWallAt(P, s, reach) {   // the column of a wall on side s (1 right, -1 left) within reach px of his side, all along his middle (y + 4 to y + h - 4), else -1
      var tx = Math.floor((s > 0 ? P.x + P.w + reach - 0.01 : P.x - reach) / 16), y0 = Math.floor((P.y + 4) / 16), y1 = Math.floor((P.y + P.h - 4) / 16), ty;
      if (P.y + 4 < 0) return -1;   // above the level's top there are no walls
      for (ty = y0; ty <= y1; ty++) if (!engWallTile(tx, ty)) return -1;
      return tx;
    }
    function engWallFree(P, s, tx) { var k = P.kickWall; return !(k && k.s === s && k.tx === tx); }   // not the wall he last kicked off
    Q.wallAt = function (s, reach) { var P = Q.P; return P ? engWallAt(P, s, reach === undefined ? Q.HERO.KICK_REACH : reach) : -1; };   // for checks: a wall beside him now
    Q.wallFree = function (s, tx) { return !!Q.P && engWallFree(Q.P, s, tx); };

    function engSlideSide(P, L, R, free) {   // PUSHBACK's slide: the side of the wall he slides down (1 right, -1 left), else 0
      var s = R && !L ? 1 : L && !R ? -1 : 0, tx;
      if (!s || P.ground || !free || P.dashing || P.pounding || P.hovering || P.kickT > 0 || P.vy < 0 || !Q.has('walljump')) return 0;
      tx = engWallAt(P, s, 1);
      return tx >= 0 && engWallFree(P, s, tx) ? s : 0;
    }
    function engKick(P, s, tx) {   // off the wall on side s: up and away, the push held for KICK_LOCK, FOLLOW UP back
      var H = Q.HERO;
      P.vx = -s * H.KICK_VX; P.vy = -H.KICK_VY; P.jumping = true; P.kickT = H.KICK_LOCK; P.kickDir = -s; P.face = -s; P.kickWall = { s: s, tx: tx };
      P.airJump = true; P.newAir = true; P.buffer = 0; P.coyote = 0; P.hovering = false; P.sliding = 0; P.dashing = false; P.on = null;
      Q.sfx('jump'); Q.fx('dust', s > 0 ? P.x + P.w : P.x, P.y + 7, { n: 3 }); Q.emit('jump', { wall: true });
    }
    function engFollowUp(P) {   // FOLLOW UP: the one jump in the air
      var H = Q.HERO;
      if (P.dashing) { P.dashing = false; P.vx = P.dashDir * H.DASH_END; }   // it ends a dash the way a dash ends itself (no speed kept)
      P.vy = -H.DJUMP; P.jumping = true; P.airJump = false; P.newAir = true; P.hovering = false; P.buffer = 0; P.djT = H.DJUMP_POSE;
      Q.sfx('jump'); Q.fx('dust', P.x + P.w / 2, P.y + P.h, { n: 2 }); Q.emit('jump', { air: true });
    }
    function engAirMoves(P, tA, L, R) {   // in the air, once the ground jump (and the coyote time) had its chance: a kick off a wall near him, else FOLLOW UP
      var H = Q.HERO, pick = R && !L ? 1 : L && !R ? -1 : P.face, i, s, tx;
      if (P.buffer > 0 && Q.has('walljump')) {
        for (i = 0; i < 2; i++) {   // the wall he holds toward (or faces) first, then the other
          s = i ? -pick : pick; tx = engWallAt(P, s, H.KICK_REACH);
          if (tx >= 0 && engWallFree(P, s, tx)) { engKick(P, s, tx); return true; }
        }
      }
      if (tA && P.airJump && P.y >= 0 && Q.has('doublejump') && (P.vy <= 0 || !engGroundNear(P, 18))) { engFollowUp(P); return true; }
      return false;
    }
    function engSlideBrake(P, v0) {   // his speed down a wall this step
      var H = Q.HERO;
      return v0 > H.SLIDE_V ? Q.approach(v0, H.SLIDE_V, H.SLIDE_GRIP * Q.DT) : Math.min(v0 + H.GRAV * Q.DT, H.SLIDE_V);
    }
    function engMovesLanded(P) { P.airJump = true; P.kickWall = null; P.newAir = false; P.kickT = 0; P.sliding = 0; }   // on the ground: both moves ready again
    function engMovesTop(P) {   // once he knows a new move the level's top is a ceiling; and the wall he last kicked off stands on up to the sky until he lands
      var k = P.kickWall, fx;
      if (P.y < 0 && (P.newAir || Q.has('walljump') || Q.has('doublejump'))) { P.y = 0; if (P.vy < 0) P.vy = 0; }
      if (!k) return;
      if (k.s < 0) { fx = (k.tx + 1) * 16; if (P.x < fx) { P.x = fx; if (P.vx < 0) P.vx = 0; P.wallL = true; } }   // a left wall: never back over it
      else { fx = k.tx * 16; if (P.x + P.w > fx) { P.x = fx - P.w; if (P.vx > 0) P.vx = 0; P.wallR = true; } }
    }
    function engSlideFx(P, dt) {   // a little dust where his glove meets the wall, while he slides
      if (!P.sliding) { P.slideFx = 0; return; }
      P.slideFx -= dt;
      if (P.slideFx <= 0) { P.slideFx = 0.09; Q.fx('dust', P.sliding > 0 ? P.x + P.w : P.x, P.y + 5, { n: 1 }); }
    }
