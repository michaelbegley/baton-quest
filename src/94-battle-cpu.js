    // ---------- 94-battle-cpu.js: BATTLE MODE's CPU conductors (B16; BATTLE.md): fun, not perfect ----------
    // BT.cpu(M, c, dt) gives the same input frame a person makes ({ h, p }, the Command pattern). It thinks only every so often (its level's react time),
    // and between thoughts it acts on what it saw then; it sometimes does the wrong thing on purpose, recovers the simple way, keeps off edges (jumping the
    // gaps it can clear), goes for near power-ups, and picks a target with a little chance in it. The host runs the CPUs (phase 2).
    BT.CPU_LV = [   // EASY, NORMAL, HARD
      { react: 0.42, miss: 0.25, swing: 0.5, note: 0.15, item: 0.5, edge: 0.7, reach: 22 },
      { react: 0.26, miss: 0.1, swing: 0.75, note: 0.3, item: 0.75, edge: 0.9, reach: 25 },
      { react: 0.14, miss: 0.03, swing: 0.92, note: 0.45, item: 0.9, edge: 0.99, reach: 27 }
    ];
    function btCpuGround(ar, px, row0, rows) {   // the first row with ground in px's column, from row0 down rows rows (or -1)
      var tx = Math.floor(px / 16), ty;
      for (ty = Math.max(0, row0); ty < Math.min(ar.th, row0 + rows); ty++) if (BT.solidAt(ar, tx, ty) || BT.thinAt(ar, tx, ty)) return ty;
      return -1;
    }
    function btCpuStageX(ar, px) {   // the middle of the nearest column with ground in the arena's lower part
      var best = 160, bd = 9999, tx, ty, d;
      for (tx = 0; tx < ar.tw; tx++) for (ty = 4; ty < ar.th; ty++) if (BT.solidAt(ar, tx, ty) || BT.thinAt(ar, tx, ty)) { d = Math.abs(tx * 16 + 8 - px); if (d < bd) { bd = d; best = tx * 16 + 8; } break; }
      return best;
    }
    function btCpuSafe(ar, c, dir) {   // is there ground ahead (within 5 rows down) where his next steps land
      var feet = Math.floor((c.y + c.h + 1) / 16), px = dir > 0 ? c.x + c.w + 7 : c.x - 7;
      return btCpuGround(ar, px, feet, 5) >= 0;
    }
    function btCpuGap(ar, c, dir) {   // past an edge: ground again within 4 tiles, at about his height (a running jump clears 4.4 tiles)
      var feet = Math.floor((c.y + c.h + 1) / 16), k, px, g;
      for (k = 1; k <= 4; k++) { px = c.x + c.w / 2 + dir * (k * 16 + 8); g = btCpuGround(ar, px, feet - 2, 4); if (g >= 0) return true; }
      return false;
    }
    function btCpuLive(c) { return !c.out && !c.gone; }
    function btCpuStone(ar, c, gx) {   // a top he can jump up onto (16 to 50 px above his feet) on the way to gx, or null
      var feet = c.y + c.h, cx = c.x + c.w / 2, best = null, bd = 9999, i, t, d;
      for (i = 0; i < ar.tops.length; i++) {
        t = ar.tops[i];
        if (t.y > feet - 14 || t.y < feet - 50 || Math.abs(t.x - cx) > 140) continue;
        d = Math.abs(t.x - gx) + Math.abs(t.x - cx) * 0.6;
        if (d < bd) { bd = d; best = t; }
      }
      return best;
    }
    function btCpuThink(M, c, ai, lv) {
      var r = function () { return BT.rand(M, 'cpuRs'); }, i, o, d, bd = 9999, best = null, live = [], it, cx = c.x + c.w / 2, cy = c.y + c.h / 2, t;
      ai.swingNow = false; ai.flail = false; ai.risky = r() > lv.edge;   // this thought, it may misjudge an edge
      if (r() < lv.miss) {   // a mistake on purpose: wander off somewhere, or swing at the air
        if (r() < 0.5) { ai.mode = 'wander'; ai.gx = 48 + r() * 224; } else { ai.mode = 'chase'; ai.flail = true; }
        return;
      }
      if (M.rules.items && M.items.length) {   // a near power-up, most of the time
        for (i = 0; i < M.items.length; i++) {
          it = M.items[i]; d = Math.abs(it.x + 7 - cx) + Math.abs(it.y + 7 - cy) * 1.5;
          if (M.rules.cpu > 0 && !(c.buff.dash > 0 || c.buff.hover > 0) && btCpuGround(BT.arenaOf(M.arena), it.x + 7, 0, BT.arenaOf(M.arena).th) < 0) continue;   // over a pit: only EASY is that greedy
          if (it.y > 24 && d < 150 && d < bd) { bd = d; best = it; }
        }
        if (best && r() < lv.item) { ai.mode = 'item'; ai.item = best.id; return; }
      }
      for (i = 0; i < M.cs.length; i++) { o = M.cs[i]; if (o !== c && btCpuLive(o)) live.push(o); }
      t = BT.cOf(M, ai.tgt);
      if (ai.tgtT <= 0 || !t || !btCpuLive(t)) {   // mostly the nearest, sometimes another: never always the leader
        best = null; bd = 9999;
        for (i = 0; i < live.length; i++) { d = Math.abs(live[i].x - c.x) + Math.abs(live[i].y - c.y); if (d < bd) { bd = d; best = live[i]; } }
        if (live.length > 1 && r() < 0.3) best = live[Math.floor(r() * live.length) % live.length];
        ai.tgt = best ? best.i : -1; ai.tgtT = 1.5 + r() * 2;
        t = best;
      }
      ai.mode = t ? 'chase' : 'wander';
      if (!t) { ai.gx = 160; return; }
      ai.sx = t.x + t.w / 2; ai.sy = t.y + t.h / 2;   // where it saw the target: it acts on this until it thinks again
      d = ai.sx - cx;
      if (Math.abs(d) < lv.reach + 4 && Math.abs(ai.sy - cy) < 18 && r() < lv.swing) ai.swingNow = true;
      ai.noteNow = Math.abs(ai.sy - cy) < 12 && Math.abs(d) > 56 && Math.abs(d) < 190 && c.rhythm >= 1 && r() < lv.note;
    }
    BT.cpu = function (M, c, dt) {
      var ar = BT.arenaOf(M.arena), lv = BT.CPU_LV[Q.clamp(M.rules.cpu | 0, 0, 2)], ai = c.ai, h = 0, tap = 0, f, cx, cy, gx, gy, dx, dy, dir, it, i, t;
      if (!ai) ai = c.ai = { t: 0, mode: 'wander', tgt: -1, tgtT: 0, gx: 160, sx: 160, sy: 100, item: -1, last: 0, jumpHold: 0, charge: 0, stuckT: 0, lastX: c.x, swingNow: false, noteNow: false, flail: false, risky: false, gapT: 0, gapDir: 1 };
      if (c.out || c.gone || c.stun > 0) { ai.last = 0; ai.charge = 0; return { h: 0, p: 0 }; }
      ai.t -= dt; ai.tgtT -= dt;
      if (ai.t <= 0) { ai.t = lv.react * (0.7 + 0.6 * BT.rand(M, 'cpuRs')); btCpuThink(M, c, ai, lv); }
      cx = c.x + c.w / 2; cy = c.y + c.h / 2;
      if (!c.ground && btCpuGround(ar, cx, Math.floor((c.y + c.h) / 16), ar.th) < 0) {   // over the pit: back to the arena, the simple way
        gx = btCpuStageX(ar, cx); dir = ai.gapT > 0 ? ai.gapDir : gx > cx ? 1 : -1;   // a gap it jumped on purpose: keep going the way it jumped
        ai.gapT -= dt;
        h |= dir > 0 ? BT.BIT.right : BT.BIT.left;
        if (ai.jumpHold > 0) { ai.jumpHold -= dt; if (c.vy < 0) h |= BT.BIT.a; }   // and keep A held while rising: a jump let go of early falls short
        if (c.buff.dash > 0 && c.airDash && !c.dashing && c.vy > -60 && BT.rand(M, 'cpuRs') < lv.edge) tap |= BT.BIT.c;
        if (c.buff.hover > 0 && c.vy > 0) h |= BT.BIT.a;
        else if (c.coyote > 0) tap |= BT.BIT.a;
        return btCpuOut(ai, h, tap, c);
      }
      if (ai.mode === 'item') {
        it = null; for (i = 0; i < M.items.length; i++) if (M.items[i].id === ai.item) it = M.items[i];
        if (!it) ai.mode = 'chase';
        else { gx = it.x + 7 + it.vx * 0.4; gy = it.y + 7; }
      }
      if (ai.mode === 'chase') {
        t = BT.cOf(M, ai.tgt);
        if (!t || !btCpuLive(t)) { ai.mode = 'wander'; ai.gx = 160; }
        else { gx = ai.sx; gy = ai.sy; }
      }
      if (ai.mode === 'wander') { gx = ai.gx; gy = cy; }
      dy = gy - cy; ai.stone = null;
      if (c.ground && dy < -28) { ai.stone = btCpuStone(ar, c, gx); if (ai.stone) gx = ai.stone.x; }   // higher up: by a top it can reach, never at thin air
      dx = gx - cx; dir = dx > 0 ? 1 : -1;
      if (Math.abs(dx) > (ai.mode === 'chase' ? lv.reach - 6 : 6)) {   // along, but never off an edge it cannot jump
        if (btCpuSafe(ar, c, dir)) h |= dir > 0 ? BT.BIT.right : BT.BIT.left;
        else if (c.ground && btCpuGap(ar, c, dir) && BT.rand(M, 'cpuRs') < lv.edge) { h |= dir > 0 ? BT.BIT.right : BT.BIT.left; tap |= BT.BIT.a; ai.jumpHold = 0.35; ai.gapT = 0.9; ai.gapDir = dir; }
        else if (ai.risky) h |= dir > 0 ? BT.BIT.right : BT.BIT.left;   // now and then (once a thought) it misjudges an edge
      } else if (ai.mode === 'chase' && (c.face > 0) !== (dx > 0) && Math.abs(dx) > 2 && btCpuSafe(ar, c, dir)) h |= dx > 0 ? BT.BIT.right : BT.BIT.left;   // turn to face it
      if (ai.stone && Math.abs(ai.stone.x - cx) < (ai.stone.y < c.y + c.h - 24 ? 40 : 18)) { tap |= BT.BIT.a; ai.jumpHold = 0.35; h |= ai.stone.x > cx ? BT.BIT.right : BT.BIT.left; }   // up onto it
      if (c.ground && dy > 28 && Math.abs(dx) < 40 && btCpuGround(ar, c.x + 1, Math.floor((c.y + c.h) / 16) + 1, ar.th) >= 0 && btCpuGround(ar, c.x + c.w - 1, Math.floor((c.y + c.h) / 16) + 1, ar.th) >= 0) tap |= BT.BIT.down;   // down through a thin platform, only onto ground
      if (ai.mode === 'chase') {
        if (ai.swingNow || ai.flail) { tap |= BT.BIT.b; ai.swingNow = false; ai.flail = false; }
        if (ai.noteNow && !ai.charge && (c.face > 0) === (dx > 0)) { ai.charge = Q.HERO.CHARGE_T + 0.06; ai.noteNow = false; tap |= BT.BIT.b; }
        if (c.buff.pound > 0 && !c.ground && Math.abs(dx) < 14 && dy > 16) { h |= BT.BIT.down; tap |= BT.BIT.b; }
      }
      if (ai.charge > 0) { ai.charge -= dt; if (ai.charge > 0) h |= BT.BIT.b; }   // a note: B held until charged, then let go
      if (ai.jumpHold > 0) { ai.jumpHold -= dt; if (c.vy < 0 || tap & BT.BIT.a) h |= BT.BIT.a; }
      if (h & (BT.BIT.left | BT.BIT.right) && c.ground && Math.abs(c.x - ai.lastX) < 0.2) { ai.stuckT += dt; if (ai.stuckT > 0.8) { tap |= BT.BIT.a; ai.jumpHold = 0.3; ai.stuckT = 0; } } else ai.stuckT = 0;
      ai.lastX = c.x;
      f = btCpuOut(ai, h, tap, c);
      return f;
    };
    function btCpuOut(ai, h, tap, c) {   // held bits plus presses: a tapped button must have been up the step before (else it is let go for one step)
      var p = 0, k, bit;
      for (k = 0; k < 8; k++) {
        bit = 1 << k;
        if (tap & bit) { if (ai.last & bit) { h &= ~bit; } else { h |= bit; p |= bit; } }
        else if ((h & bit) && !(ai.last & bit)) p |= bit;
      }
      ai.last = h;
      return { h: h, p: p };
    }
