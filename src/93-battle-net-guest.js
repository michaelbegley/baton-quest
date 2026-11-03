    // ---------- 93-battle-net-guest.js: BATTLE MODE online, a guest's side (B18; ONLINE.md) ----------
    // A guest joins the room of a code, finds its host (the page tells it), says hello until it is seated, mirrors the host's lobby, and starts each match
    // from the setup the host sends. In a match it moves only its own conductor (BT.sim with this device's buttons, at once, never corrected), carries out
    // the host's events in order and once each, and draws everyone else from the host's snapshots BEHIND steps in the past, between the two around that time.
    // It reports its own conductor every GUEST_EVERY steps with the number of the last event it carried out (the host's acknowledgement).
    (function () {
      var G = BT.NG = { on: false, code: '', st: '', you: -1, t: 0, helloT: 0, why: '', lob: null, k: 0, M: null, done: 0, fresh: [], snaps: [], step: 0, off: null, seq: 0, sendT: 0, trouble: 0 };
      BT.guestOpen = function (code) {   // into the room of that code; false if this page cannot
        var n = BT.netApi();
        if (!n || !n.ok() || !BT.codeOk(code) || !n.join(code)) return false;
        G.on = true; G.code = code; G.st = 'find'; G.you = -1; G.t = 0; G.helloT = 0; G.why = ''; G.lob = null; G.k = 0; G.M = null; G.done = 0; G.fresh = []; G.snaps = [];
        G.step = 0; G.off = null; G.seq = 0; G.sendT = 0; G.trouble = 0;
        return true;
      };
      BT.guestClose = function (why) {   // LEAVE, or the game is over for us: say BYE, leave the room; why says what the menu tells him
        var n = BT.netApi();
        if (G.on) { BT.netSend('host', { t: 'bye' }); if (n) n.leave(); }
        G.on = false; G.st = ''; G.why = why || ''; G.M = null;
      };
      function hello() { BT.netSend('host', { t: 'hi', v: BT.NETV, col: BT.S.slots[0].col, name: BT.S.slots[0].name }); }
      function lobby(m) {   // the host's lobby, checked: four slots of our own words and numbers, the rules, the arena
        var sl = [], i, s, w, ru = BT.cleanRules(m.ru), you = BT.nInt(m.you, 1, 3, -1), lk = BT.nInt(m.k, 0, 1e9, -1);
        if (!m.sl || m.sl.length !== 4 || !ru || you < 0 || typeof m.ar !== 'string' || !BT.arenaOk(m.ar) || lk < G.k) return;   // a lobby from before our match is old news
        for (i = 0; i < 4; i++) {
          s = m.sl[i]; w = s && typeof s.w === 'string' && /^(off|cpu|net|host|pad)$/.test(s.w) ? s.w : '';
          if (!w) return;
          sl.push({ on: w !== 'off', w: w, col: BT.nInt(s.c, 0, 3, 0), name: BT.nInt(s.m, 0, BT.NAMES.length - 1, 0) });
        }
        G.lob = { sl: sl, ru: ru, ar: m.ar }; G.you = you;
        if (G.st === 'play' || G.st === 'res' || G.st === 'wait' || G.st === 'busy') G.st = 'seat';   // the host is back in the lobby
      }
      function start(su, k) {   // a new match from the host's setup: this device's slot is ours (its buttons), every other one is drawn from snapshots
        var st = su && su.st, you = BT.nInt(su && su.you, 1, 3, -1), slots = [], i, s, ru, M, c;
        if (!st || you < 0 || !st.slots || st.slots.length !== 4 || typeof st.arena !== 'string' || st.arena === 'random' || !BT.arenaOk(st.arena)) return false;
        ru = BT.cleanRules(st.rules); if (!ru) return false;
        for (i = 0; i < 4; i++) { s = st.slots[i] || {}; slots.push({ on: !!s.on, who: s.who === 'human' ? 'human' : 'cpu', pad: i === you ? 1 : 0, col: BT.nInt(s.col, 0, 3, 0), name: BT.nInt(s.name, 0, BT.NAMES.length - 1, 0) }); }
        if (!slots[you].on) return false;
        M = BT.newMatch({ slots: slots, arena: st.arena, rules: ru, seed: BT.nInt(st.seed, 1, 4294967295, 1) });
        M.k = k; M.role = 'guest';
        for (i = 0; i < M.cs.length; i++) { c = M.cs[i]; c.net = c.i === you ? '' : 'far'; if (c.i === you) { c.who = 'human'; c.pad = 1; } }
        G.M = M; G.k = k; G.you = you; G.done = 0; G.fresh = []; G.snaps = []; G.off = null; G.seq = 0; G.sendT = 0; G.st = 'play';
        return true;
      }
      function apply(M, e) {   // one of the host's events, carried out here (a guest who left is a CPU now: told, and tagged so)
        var c;
        if (e.k === 'left') { c = BT.cOf(M, e.who); if (c) { c.who = 'cpu'; Q.toast(BT.NAMES[c.name] + ' LEFT: A CPU PLAYS ON', 2.4); } }
        else BT.apply(M, e);
        G.fresh.push(e);
      }
      function match(m) {
        var k = BT.nInt(m.k, 1, 1e9, 0), s = BT.nInt(m.s, 0, 1e9, -1), i, e, z, last;
        if (!k || s < 0) return;
        if (k !== G.k && !(m.su && BT.nInt(m.su.k, 1, 1e9, 0) === k && start(m.su, k))) return;   // a match we have not got: wait for its setup
        if (G.off === null || s - G.step > G.off) G.off = s - G.step; else G.off -= 0.05;   // the host's clock: the quickest packets set it, it eases back slowly
        for (i = 0; m.e && i < m.e.length && i < 200; i++) { e = BT.cleanEv(m.e[i]); if (e && e.q === G.done + 1) { apply(G.M, e); G.done++; } }
        if (m.z) {
          z = BT.cleanSnap(m.z); last = G.snaps.length ? G.snaps[G.snaps.length - 1] : null;
          if (z && (!last || z.s > last.s)) { G.snaps.push(z); if (G.snaps.length > BT.NT.SNAPS) G.snaps.shift(); }
        }
      }
      function message(m) {
        var why;
        if (!m || typeof m !== 'object' || typeof m.t !== 'string') return;
        if (m.t === 'seat') { if (BT.nInt(m.you, 1, 3, -1) >= 0) { G.you = BT.nInt(m.you, 1, 3, -1); if (G.st === 'find' || G.st === 'wait' || G.st === 'busy') G.st = 'seat'; } }
        else if (m.t === 'no') { why = m.why === 'full' || m.why === 'old' || m.why === 'busy' || m.why === 'away' ? m.why : ''; if (why === 'busy') G.st = 'busy'; else if (why) BT.guestClose(why); }
        else if (m.t === 'lob') lobby(m);
        else if (m.t === 'm') match(m);
        else if (m.t === 'end') BT.guestClose('end');
      }
      BT.guestPoll = function (dt) {   // every step a guest is online: what came in; hello again now and then until seated; give up on a code with no host
        var l, i, e;
        if (!G.on) return;
        G.t += dt; if (G.trouble > 0) G.trouble--;
        l = BT.netPoll();
        for (i = 0; i < l.length && G.on; i++) {
          e = l[i];
          if (e.k === 'host') { if (G.st === 'find') { G.st = 'wait'; G.helloT = 0; } }
          else if (e.k === 'lost') BT.guestClose(e.msg && (e.msg.why === 'load' || e.msg.why === 'start') ? e.msg.why : 'host');
          else if (e.k === 'trouble') G.trouble = 300;
          else if (e.k === 'msg') message(e.msg);
        }
        if (!G.on) return;
        if (G.st === 'find' && G.t > BT.NT.FIND_T) { BT.guestClose('none'); return; }
        if ((G.st === 'wait' || G.st === 'busy') && --G.helloT <= 0) { G.helloT = G.st === 'busy' ? 2 * BT.NT.HELLO : BT.NT.HELLO; hello(); }
      };
      BT.guestPick = function (col, name) { BT.netSend('host', { t: 'pick', col: col, name: name }); };
      function far(M) {   // everyone else, BEHIND steps in the host's past, between the two snapshots around then (no slide across a respawn)
        var rs = G.step + (G.off || 0) - BT.NT.BEHIND, z0 = null, z1 = null, i, j, s, c, a, b, k, f, n;
        for (j = G.snaps.length - 1; j >= 0; j--) { s = G.snaps[j]; if (s.r !== M.round) continue; if (s.s <= rs) { z0 = s; break; } z1 = s; }
        if (!z0) z0 = z1;
        if (!z0) return;
        for (i = 0; i < M.cs.length; i++) {
          c = M.cs[i]; if (c.net !== 'far') continue;
          a = null; b = null;
          for (j = 0; j < z0.c.length; j++) if (z0.c[j].i === c.i) a = z0.c[j];
          if (z1 && z1 !== z0) for (j = 0; j < z1.c.length; j++) if (z1.c[j].i === c.i) b = z1.c[j];
          if (!a) continue;
          k = b && b.bk === a.bk ? Q.clamp((rs - z0.s) / (z1.s - z0.s), 0, 1) : 0;
          f = b && k >= 0.5 ? b : a;
          c.x = b ? a.x + (b.x - a.x) * k : a.x; c.y = b ? a.y + (b.y - a.y) * k : a.y;
          c.face = f.f; c.frame = f.fr; c.safe = f.sf; c.swingT = f.sw; c.chargeT = f.ch; c.stun = f.st;
          c.charged = !!(f.g & 2); c.dashing = !!(f.g & 4); c.hovering = !!(f.g & 8); c.pounding = !!(f.g & 16); c.ground = !!(f.g & 1);
          c.buff.dash = f.b[0]; c.buff.hover = f.b[1]; c.buff.pound = f.b[2]; c.buff.baton = f.b[3]; c.buff.metro = f.b[4];
          if (f.si !== c.swingId) { if (f.si > c.swingId) c.fx.push(['s', 'swing']); c.swingId = f.si; }
          if (f.jn > c.jN) c.fx.push(['s', 'jump']); c.jN = f.jn;
        }
        for (j = 0; j < z0.n.length; j++) for (i = 0; i < M.notes.length; i++) { n = M.notes[i]; if (n.id === z0.n[j].id && !n.dead && Math.abs(n.x - z0.n[j].x) > 24) { n.x = z0.n[j].x; n.t = z0.n[j].t; } }   // a note far off: put right
      }
      function phase(M) {   // the round's clock as the host has it, from the newest snapshot that reflects exactly the events carried out here
        var z = null, j, age, pt;
        for (j = G.snaps.length - 1; j >= 0; j--) if (G.snaps[j].r === M.round && G.snaps[j].eq === G.done) { z = G.snaps[j]; break; }
        if (!z || (z.ph !== 'ready' && z.ph !== 'fight') || (M.phase !== 'ready' && M.phase !== 'fight')) return;
        age = Math.max(0, G.step + (G.off || 0) - z.s) * Q.DT; pt = z.pt + age;
        if (z.ph !== M.phase || Math.abs(M.phaseT - pt) > 0.1) { M.phase = z.ph; M.phaseT = pt; M.roundT = z.rt + (z.ph === 'fight' ? age : 0); }
      }
      BT.guestStep = function (M, dt, still) {   // one fixed step of a match on a guest; still: his own menu is up (his conductor stands)
        var ar = BT.arenaOf(M.arena), N = BT.N, me = BT.cOf(M, G.you), inp = BT.ZERO, fight, i, j, list, n, it;
        G.step++; M.step++; M.t += dt; M.phaseT += dt;
        M.ev.length = 0; for (i = 0; i < G.fresh.length; i++) M.ev.push(G.fresh[i]); G.fresh.length = 0;
        for (i = 0; i < M.cs.length; i++) M.cs[i].fx.length = 0;
        if (M.phase === 'ready' && M.phaseT >= N.READY_T) { M.phase = 'fight'; M.phaseT = 0; }
        fight = M.phase === 'fight';
        if (fight) M.roundT += dt;
        if (M.phase !== 'over') {
          inp = BT.readDevice(); if (still || !fight) inp = BT.ZERO;
          if (me) { BT.sim(me, inp, dt, ar); if (!me.out && !me.gone && me.y < N.TOP_Y) me.vy = Math.max(me.vy, 0); }
          for (i = 0; i < M.notes.length; i++) { n = M.notes[i]; if (!n.dead) { n.t += dt; n.x += n.vx * dt; } }
          for (i = 0; i < M.items.length; i++) { it = M.items[i]; if (!it.dead) { it.t += dt; it.x += it.vx * dt; it.y = it.y0 + Math.sin(it.t * 2.2 + it.ph) * N.ITEM_BOB; } }
          list = M.notes; for (i = 0, j = 0; i < list.length; i++) if (!list[i].dead) list[j++] = list[i]; list.length = j;
          list = M.items; for (i = 0, j = 0; i < list.length; i++) if (!list[i].dead) list[j++] = list[i]; list.length = j;
        }
        phase(M); far(M);
        if (me && ++G.sendT >= BT.NT.GUEST_EVERY) { G.sendT = 0; BT.netSend('host', { t: 'me', k: M.k, s: ++G.seq, a: G.done, c: BT.packMe(me), h: inp.h | 0 }); }
      };
      BT.guestResults = function () { if (G.st === 'play') G.st = 'res'; };
      BT.guestAt = function () { return { on: G.on, code: G.code, st: G.st, you: G.you, k: G.k, done: G.done, snaps: G.snaps.length, off: G.off, step: G.step, why: G.why, lob: G.lob ? { ar: G.lob.ar, sl: G.lob.sl.map(function (s) { return s.w; }) } : null }; };
    })();
