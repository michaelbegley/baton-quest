    // ---------- 92-battle-host.js: BATTLE MODE's rules, the host's (B16; BATTLE.md) ----------
    // BT.host(M, dt), after every conductor has moved: the notes, swing and pound hits, knockback and WOBBLE, falls and hearts, coming back, the power-ups.
    // BT.hostRound(M), after the events are applied: the round and the match. Every decision is an event pushed to M.ev and carried out by BT.apply (93).
    // In phase 1 the one device does all of it; in phase 2 only the host decides, and each device applies the events it is sent.
    function btLive(c) { return !c.out && !c.gone; }
    function btCanHit(v) { return !v.out && !v.gone && !(v.safe > 0) && !(v.grace > 0); }
    BT.cOf = function (M, slot) { for (var i = 0; i < M.cs.length; i++) if (M.cs[i].i === slot) return M.cs[i]; return null; };
    BT.swingBox = function (c) { var w = c.buff.baton > 0 ? BT.N.BIG_W : Q.HERO.SWING_W; return { x: c.face > 0 ? c.x + c.w - 4 : c.x + 4 - w, y: c.y - 2, w: w, h: Q.HERO.SWING_H }; };
    BT.knock = function (M, v, fromX, how, big) {   // a hit's knock: away from fromX, harder with the victim's WOBBLE (SmashWiki's base plus growth)
      var N = BT.N, add = (how === 'meteor' ? 2 : 1) + (big ? 1 : 0), wob, sp, dir;
      if (M.ot) add *= N.OT_K;
      wob = Math.min(N.WOB_MAX, v.wob + add);
      sp = (N.KB_BASE + N.KB_GROW * wob) * (big ? N.BIG_K : 1) * (how === 'meteor' ? N.POUND_KB : 1);
      dir = v.x + v.w / 2 < fromX ? -1 : v.x + v.w / 2 > fromX ? 1 : (v.face > 0 ? -1 : 1);
      if (how === 'meteor') return { wob: wob - v.wob, kvx: dir * sp * 0.25, kvy: sp * 0.7, stun: N.STUN + N.STUN_GROW * wob };
      if (how === 'shock') return { wob: wob - v.wob, kvx: dir * sp * 0.45, kvy: -(sp * 0.8 + N.KB_LIFT), stun: N.STUN + N.STUN_GROW * wob };
      return { wob: wob - v.wob, kvx: dir * sp, kvy: -(sp * N.KB_UP + N.KB_LIFT), stun: N.STUN + N.STUN_GROW * wob };
    };
    function btHit(M, v, by, how, fromX, big) {
      var k = BT.knock(M, v, fromX, how, big);
      M.ev.push({ k: 'hit', who: v.i, by: by, how: how, kvx: k.kvx, kvy: k.kvy, stun: k.stun, wob: k.wob, x: v.x + v.w / 2, y: v.y + 5 });
      v.grace = BT.N.GRACE;   // the host's own guard until the event is applied: never two hits from one swing in one step
    }
    function btBackSpot(M, ar, v) {   // back from above the start farthest from everyone still in
      var best = ar.spawns[0], bd = -1, i, j, s, d, o, x;
      for (i = 0; i < ar.spawns.length; i++) {
        s = ar.spawns[i]; x = s.tx * 16 + 3; d = 9999;
        for (j = 0; j < M.cs.length; j++) { o = M.cs[j]; if (o !== v && btLive(o)) d = Math.min(d, Math.abs(o.x - x)); }
        if (d > bd) { bd = d; best = s; }
      }
      return { x: best.tx * 16 + 3, y: -28 };
    }
    function btItemPick(M) {
      var tot = 0, i, r, id;
      for (i = 0; i < BT.ITEM_IDS.length; i++) tot += BT.ITEMS[BT.ITEM_IDS[i]].w;
      r = BT.rand(M, 'rs') * tot;
      for (i = 0; i < BT.ITEM_IDS.length; i++) { id = BT.ITEM_IDS[i]; r -= BT.ITEMS[id].w; if (r < 0) return id; }
      return BT.ITEM_IDS[0];
    }
    BT.host = function (M, dt) {
      var N = BT.N, H = Q.HERO, ar = BT.arenaOf(M.arena), cs = M.cs, aw = ar.tw * 16, i, j, a, v, n, b, it, on, side;
      for (i = 0; i < cs.length; i++) {   // a note let go: the host makes it, from the baton's tip
        a = cs[i];
        if (a.wantNote && btLive(a)) M.ev.push({ k: 'note', id: ++M.noteId, by: a.i, x: a.face > 0 ? a.x + a.w : a.x - 8, y: a.y + 1, vx: a.face * H.NOTE_V, big: a.buff.baton > 0 });
      }
      for (j = 0; j < M.notes.length; j++) {   // the notes: straight on; the first other conductor one touches is hit; a wall or its time ends it
        n = M.notes[j]; if (n.dead) continue;
        n.t += dt; n.x += n.vx * dt;
        if (n.t >= H.NOTE_T || BT.solidAt(ar, Math.floor((n.x + 4) / 16), Math.floor((n.y + 4) / 16)) || n.x < -24 || n.x > aw + 24) { n.dead = true; M.ev.push({ k: 'noteEnd', id: n.id, x: n.x + 4, y: n.y + 4 }); continue; }
        for (i = 0; i < cs.length; i++) {
          v = cs[i]; if (v.i === n.by || !btCanHit(v) || !Q.overlap(n, v)) continue;
          btHit(M, v, n.by, 'note', n.x + 4 - n.vx, n.big); n.dead = true; M.ev.push({ k: 'noteEnd', id: n.id, x: n.x + 4, y: n.y + 4 });
          break;
        }
      }
      for (i = 0; i < cs.length; i++) {   // swings, in their first SWING_HIT s; FIRM HAND falling onto someone, and its landing's shake
        a = cs[i]; if (!btLive(a)) continue;
        if (a.swingT > H.SWING_T - N.SWING_HIT) {
          b = BT.swingBox(a);
          for (j = 0; j < cs.length; j++) { v = cs[j]; if (v !== a && btCanHit(v) && Q.overlap(b, v)) btHit(M, v, a.i, 'baton', a.x + a.w / 2, a.buff.baton > 0); }
        }
        if (a.pounding && a.poundT <= 0) for (j = 0; j < cs.length; j++) { v = cs[j]; if (v !== a && btCanHit(v) && Q.overlap(a, v)) btHit(M, v, a.i, 'meteor', a.x + a.w / 2, false); }
        if (a.poundLand) {
          M.ev.push({ k: 'shake', who: a.i, x: a.x + a.w / 2, y: a.y + a.h });
          for (j = 0; j < cs.length; j++) {
            v = cs[j];
            if (v !== a && btCanHit(v) && v.ground && Math.abs(v.x + v.w / 2 - (a.x + a.w / 2)) <= N.POUND_SHOCK + v.w / 2 && Math.abs(v.y + v.h - (a.y + a.h)) <= 12) btHit(M, v, a.i, 'shock', a.x + a.w / 2, false);
          }
        }
      }
      for (i = 0; i < cs.length; i++) {   // falls: off the bottom, or far past a side (a knock-off for the last hitter within KO_T)
        v = cs[i];
        if (v.hold) continue;   // online (B18): a guest's conductor the host only guesses at (it has not yet heard back about a knock) is never judged to fall on the guess
        if (btLive(v) && (v.y > ar.th * 16 + N.FALL_Y || v.x < -N.SIDE_X || v.x > aw + N.SIDE_X)) M.ev.push({ k: 'fall', who: v.i, by: v.lastT <= N.KO_T ? v.lastBy : -1, x: Math.round(v.x + v.w / 2) });
        else if (btLive(v) && v.y < N.TOP_Y) v.vy = Math.max(v.vy, 0);
      }
      for (i = 0; i < cs.length; i++) {   // back in after OUT_T, from above a start, blinking
        v = cs[i];
        if (v.out && !v.gone) { v.outT -= dt; if (v.outT <= 0) { b = btBackSpot(M, ar, v); M.ev.push({ k: 'back', who: v.i, x: b.x, y: b.y }); v.outT = 99; } }
      }
      if (!M.rules.items) return;
      M.itemT -= dt;   // power-ups: one drifts in now and then from a side, at most ITEM_MAX at once
      if (M.itemT <= 0) {
        M.itemT = N.ITEM_T0 + BT.rand(M, 'rs') * (N.ITEM_T1 - N.ITEM_T0);
        for (on = 0, j = 0; j < M.items.length; j++) if (!M.items[j].dead) on++;
        if (on < N.ITEM_MAX) {
          side = BT.rand(M, 'rs') < 0.5 ? 1 : -1;
          M.ev.push({ k: 'itemIn', id: ++M.itemId, kind: btItemPick(M), x: side > 0 ? -16 : aw + 2, y0: 40 + Math.floor(BT.rand(M, 'rs') * 76), vx: side * N.ITEM_V * (0.85 + BT.rand(M, 'rs') * 0.3), ph: BT.rand(M, 'rs') * 6.28 });
        }
      }
      for (j = 0; j < M.items.length; j++) {
        it = M.items[j]; if (it.dead) continue;
        it.t += dt; it.x += it.vx * dt; it.y = it.y0 + Math.sin(it.t * 2.2 + it.ph) * N.ITEM_BOB;
        if (it.x < -28 || it.x > aw + 28) { it.dead = true; M.ev.push({ k: 'itemOut', id: it.id }); continue; }
        for (i = 0; i < cs.length; i++) { v = cs[i]; if (btLive(v) && Q.overlap(it, v)) { it.dead = true; M.ev.push({ k: 'item', who: v.i, id: it.id, kind: it.kind, x: it.x + 7, y: it.y + 7 }); break; } }
      }
    };
    BT.hostRound = function (M) {   // one left ends the round (none left: a draw); a conductor with the wins needed ends the match; OVERTIME after OVER_T
      var N = BT.N, i, live = 0, last = -1, need, best = -1, bw = -1, c;
      if (M.phase === 'fight') {
        if (!M.ot && M.roundT >= N.OVER_T) BT.emit(M, { k: 'ot' });
        for (i = 0; i < M.cs.length; i++) { c = M.cs[i]; if (!c.gone) { live++; last = c.i; } }
        if (live <= 1) BT.emit(M, { k: 'round', winner: live === 1 ? last : -1 });
      } else if (M.phase === 'end' && M.phaseT >= N.END_T) {
        need = Math.floor(M.rules.rounds / 2) + 1;
        for (i = 0; i < 4; i++) if (M.wins[i] > bw) { bw = M.wins[i]; best = i; }
        if (bw >= need) BT.emit(M, { k: 'over', winner: best });
        else BT.emit(M, { k: 'next' });
      }
    };
    BT.emit = function (M, e) { M.ev.push(e); BT.apply(M, e); };   // a decision made after the step's events: applied at once
