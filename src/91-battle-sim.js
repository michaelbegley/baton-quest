    // ---------- 91-battle-sim.js: BATTLE MODE's arena grid and one conductor's moves (B16; BATTLE.md) ----------
    // Each device runs this for its own conductor (phase 2): BT.sim(c, inp, dt, ar) moves one conductor by one input frame through the arena, by
    // Q.HERO's numbers and the adventure's own moves (run, jump with coyote time and a buffer, the swing, the charged note, and the borrowed dash, hover
    // and pound). It makes intents (c.swingT and c.swingId, c.wantNote, c.poundLand) for the host's rules (92) and never decides a hit itself.
    // An input frame is { h, p }: held and pressed bits, BT.BIT (left 1, right 2, up 4, down 8, a 16, b 32, start 64, c 128).
    BT.BIT = { left: 1, right: 2, up: 4, down: 8, a: 16, b: 32, start: 64, c: 128 };
    BT.KEYS = ['left', 'right', 'up', 'down', 'a', 'b', 'start', 'c'];
    BT.N.FLY_ACC = 260;   // px/s per s of steering while a knock still carries him faster than a run (the adventure's air control would undo a knock at once)
    var btArenas = {};
    function btPick(a, b) { return Object.prototype.hasOwnProperty.call(Q.SPRITE, a) ? a : b; }
    BT.arenaOf = function (id) {   // an arena's grid, built once: solid and thin cells, what each cell draws, the four starts, and the look its background reads
      if (btArenas[id]) return btArenas[id];
      var def = BT.arenaDef(id), map = def.map, th = map.length, tw = 0, wd = Q.TILEDEF[def.world] || {}, x, y, ch, i, t, ar;
      for (y = 0; y < th; y++) tw = Math.max(tw, map[y].length);
      ar = { id: def.id, def: def, world: def.world, tw: tw, th: th, solid: [], thin: [], art: [], spawns: [] };
      for (y = 0; y < th; y++) for (x = 0; x < tw; x++) {
        ch = map[y].charAt(x) || ' '; i = y * tw + x; ar.solid[i] = 0; ar.thin[i] = 0; ar.art[i] = null;
        if (ch === 'S') ar.spawns.push({ tx: x, ty: y });
        else if (ch === '#') { ar.solid[i] = 1; ar.art[i] = { spr: btPick('t' + def.world + '-solid', 't0-solid'), auto: true }; }
        else if (ch === '=') { ar.thin[i] = 1; ar.art[i] = { spr: btPick('t' + def.world + '-oneway', 't0-oneway') }; }
        else if (ch !== ' ' && ch !== '.') {
          t = Object.prototype.hasOwnProperty.call(wd, ch) ? wd[ch] : null;
          if (!t) { Q.warn('BATTLE: arena ' + def.id + ' has "' + ch + '", not a tile of world ' + def.world); continue; }
          if (t.solid) ar.solid[i] = 1; else if (t.oneWay) ar.thin[i] = 1;
          ar.art[i] = { spr: t.art, frame: t.frame | 0, fps: +t.fps || 0 };
        }
      }
      ar.tops = [];   // every top a conductor can stand on (solid or thin, nothing solid above): the CPUs' stepping stones (94)
      for (y = 1; y < th; y++) for (x = 0; x < tw; x++) { i = y * tw + x; if ((ar.solid[i] || ar.thin[i]) && !ar.solid[i - tw]) ar.tops.push({ tx: x, ty: y, x: x * 16 + 8, y: y * 16 }); }
      ar.look = BT.copy(def.look || {}); ar.look.id = 'battle-' + def.id; ar.look.world = def.world; ar.look.tw = tw; ar.look.th = th; ar.look.bg = def.bg;
      btArenas[id] = ar;
      return ar;
    };
    function btSolid(ar, tx, ty) { return tx >= 0 && ty >= 0 && tx < ar.tw && ty < ar.th && ar.solid[ty * ar.tw + tx] === 1; }   // open past every edge: falling off is the point
    function btThin(ar, tx, ty) { return tx >= 0 && ty >= 0 && tx < ar.tw && ty < ar.th && ar.thin[ty * ar.tw + tx] === 1; }
    BT.solidAt = btSolid; BT.thinAt = btThin;
    function btMoveX(ar, e, dx) {   // as Q.move (51-engine-tiles.js): X first, stopped by what it hits
      var T = 16, ty0 = Math.floor(e.y / T), ty1 = Math.floor((e.y + e.h - 0.01) / T), tx, ty, a, b;
      if (dx > 0) {
        a = Math.floor((e.x + e.w - 0.01) / T) + 1; b = Math.floor((e.x + e.w + dx - 0.01) / T);
        for (tx = a; tx <= b; tx++) for (ty = ty0; ty <= ty1; ty++) if (btSolid(ar, tx, ty)) { e.x = tx * T - e.w; e.wallR = true; e.vx = 0; return; }
      } else {
        a = Math.floor(e.x / T) - 1; b = Math.floor((e.x + dx) / T);
        for (tx = a; tx >= b; tx--) for (ty = ty0; ty <= ty1; ty++) if (btSolid(ar, tx, ty)) { e.x = (tx + 1) * T; e.wallL = true; e.vx = 0; return; }
      }
      e.x += dx;
    }
    function btMoveY(ar, e, dy) {   // then Y; a thin platform holds a body falling onto it unless e.drop
      var T = 16, tx0 = Math.floor(e.x / T), tx1 = Math.floor((e.x + e.w - 0.01) / T), tx, ty, a, b;
      if (dy > 0) {
        a = Math.floor((e.y + e.h - 0.01) / T) + 1; b = Math.floor((e.y + e.h + dy - 0.01) / T);
        for (ty = a; ty <= b; ty++) for (tx = tx0; tx <= tx1; tx++) if (btSolid(ar, tx, ty) || (!e.drop && btThin(ar, tx, ty))) { e.y = ty * T - e.h; e.ground = true; e.vy = 0; return; }
      } else {
        a = Math.floor(e.y / T) - 1; b = Math.floor((e.y + dy) / T);
        for (ty = a; ty >= b; ty--) for (tx = tx0; tx <= tx1; tx++) if (btSolid(ar, tx, ty)) { e.y = (ty + 1) * T; e.ceil = true; e.vy = 0; return; }
      }
      e.y += dy;
    }
    BT.move = function (ar, e, dt) {
      e.ground = false; e.wallL = false; e.wallR = false; e.ceil = false;
      var dx = (e.vx || 0) * dt, dy = (e.vy || 0) * dt;
      if (dx) btMoveX(ar, e, dx);
      if (dy) btMoveY(ar, e, dy);
    };
    function btOnThin(ar, c) {   // standing on a thin platform with nothing solid under his feet
      var ty = Math.floor((c.y + c.h + 1) / 16), x0 = Math.floor(c.x / 16), x1 = Math.floor((c.x + c.w - 0.01) / 16), thin = false, tx;
      for (tx = x0; tx <= x1; tx++) { if (btSolid(ar, tx, ty)) return false; if (btThin(ar, tx, ty)) thin = true; }
      return thin;
    }
    BT.groundNear = function (ar, c, d) {   // solid or thin ground within d px under his feet
      var tx, ty, x0 = Math.floor(c.x / 16), x1 = Math.floor((c.x + c.w - 0.01) / 16);
      for (ty = Math.floor((c.y + c.h) / 16); ty <= Math.floor((c.y + c.h + d) / 16); ty++) for (tx = x0; tx <= x1; tx++) if (btSolid(ar, tx, ty) || btThin(ar, tx, ty)) return true;
      return false;
    };
    BT.newC = function (slot, x, y) {   // one conductor: a plain object (no functions, no links), so a match can be copied, sent or replayed
      var H = Q.HERO;
      return { i: slot, x: x, y: y, w: H.W, h: H.H, vx: 0, vy: 0, face: x < 160 ? 1 : -1, ground: false, wallL: false, wallR: false, ceil: false,
        drop: false, dropT: 0, coyote: 0, buffer: 0, swingT: 0, swingId: 0, swingBuf: 0, chargeT: 0, charged: false, wasB: false, throwT: 0,
        rhythm: H.RHYTHM, rhythmMax: H.RHYTHM, rhythmT: 0, dashing: false, dashT: 0, dashDir: 1, dashCool: 0, dashBuf: 0, airDash: true, tapDir: 0, tapT: -9, now: 0,
        hovering: false, hoverT: 0, airHover: true, pounding: false, poundT: 0, poundId: 0, poundLand: false, lagT: 0, flying: false,
        stun: 0, grace: 0, safe: 0, wob: 0, hp: 3, out: false, outT: 0, gone: false, lastBy: -1, lastT: 99,
        buff: { dash: 0, hover: 0, pound: 0, baton: 0, metro: 0 }, wantNote: false, frame: 0, animT: 0, runT: 0, landT: 0, fallV: 0, cheer: false, fx: [],
        jN: 0, nN: 0, pL: 0, bk: 0 };   // B18, online: jumps, notes thrown and pound landings counted (a lost message never loses one), and times back in (bk)
    };
    function btFx(c, k, a, b) { if (c.fx.length < 24) c.fx.push([k, a, b]); }   // for the screen only: a sound ('s', id) or dust ('d', x, y)
    function btDash(c, k) {
      var H = Q.HERO;
      c.dashing = true; c.dashT = H.DASH_T; c.dashDir = k; c.face = k; c.tapDir = 0; c.hovering = false; c.dashCool = H.DASH_COOL; c.flying = false;
      if (!c.ground) c.airDash = false;
      btFx(c, 's', 'dash'); btFx(c, 'd', c.x + c.w / 2 - k * 5, c.y + c.h);
    }
