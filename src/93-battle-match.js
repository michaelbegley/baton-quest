    // ---------- 93-battle-match.js: BATTLE MODE's match (B16; BATTLE.md): the events carried out, a match and its rounds, one fixed step, the input frames ----------
    // A match M is one plain object (numbers, strings, arrays, plain objects): it can be copied, sent and replayed. Its random is its own (M.rs, M.cpuRs).
    BT.ZERO = { h: 0, p: 0 };
    BT.apply = function (M, e) {   // one of the host's decisions, carried out (on every device in phase 2)
      var N = BT.N, v = e.who !== undefined ? BT.cOf(M, e.who) : null, i, k, list;
      M.count[e.k] = (M.count[e.k] || 0) + 1;
      if (e.k === 'note') M.notes.push({ id: e.id, by: e.by, x: e.x, y: e.y, w: 8, h: 8, vx: e.vx, t: 0, big: !!e.big, dead: false });
      else if (e.k === 'noteEnd' || e.k === 'itemOut' || e.k === 'item') {
        list = e.k === 'noteEnd' ? M.notes : M.items;
        for (i = 0; i < list.length; i++) if (list[i].id === e.id) list[i].dead = true;
      }
      if (e.k === 'hit' && v) {
        v.vx = e.kvx; v.vy = e.kvy; v.stun = e.stun; v.grace = N.GRACE; v.wob = Math.min(N.WOB_MAX, v.wob + e.wob); v.flying = true; v.ground = false;
        v.lastBy = e.by; v.lastT = 0; v.dashing = false; v.hovering = false; v.pounding = false; v.charged = false; v.chargeT = 0; v.swingT = 0; v.lagT = 0; v.dropT = 0; v.drop = false;
        if (M.stats[e.by]) M.stats[e.by].hits++;
        M.stats[e.who].took++;
      } else if (e.k === 'fall' && v) {
        v.hp = Math.max(0, v.hp - 1); v.out = true; v.outT = N.OUT_T; v.wob = 0; v.vx = 0; v.vy = 0; v.stun = 0; v.flying = false; v.cheer = false;
        for (i = 0; i < BT.BUFFS.length; i++) v.buff[BT.BUFFS[i]] = 0;
        M.stats[e.who].falls++;
        if (e.by >= 0 && e.by !== e.who && M.stats[e.by]) M.stats[e.by].kos++;
        if (v.hp <= 0) v.gone = true;
      } else if (e.k === 'back' && v) {
        v.out = false; v.x = e.x; v.y = e.y; v.vx = 0; v.vy = 0; v.safe = N.SAFE_T; v.face = e.x < 160 ? 1 : -1; v.rhythm = v.rhythmMax; v.rhythmT = 0; v.bk++;
        v.airDash = true; v.airHover = true; v.swingT = 0; v.charged = false; v.chargeT = 0; v.dashing = false; v.hovering = false; v.pounding = false; v.lastBy = -1; v.lastT = 99;
      } else if (e.k === 'itemIn') M.items.push({ id: e.id, kind: e.kind, x: e.x, y: e.y0, y0: e.y0, w: 14, h: 14, vx: e.vx, t: 0, ph: e.ph, dead: false });
      else if (e.k === 'item' && v) {
        k = e.kind; M.stats[e.who].items++;
        if (k === 'coffee') v.hp = Math.min(M.rules.hearts, v.hp + 1);
        else if (k === 'baton') v.buff.baton = N.BATON_T;
        else if (k === 'metro') { v.rhythm = v.rhythmMax; v.buff.metro = N.METRO_T; }
        else if (k === 'dash' || k === 'hover' || k === 'pound') v.buff[k] = N.BUFF_T;
      } else if (e.k === 'ot') M.ot = true;
      else if (e.k === 'round') {
        M.phase = 'end'; M.phaseT = 0; M.roundWinner = e.winner;
        if (e.winner >= 0) { M.wins[e.winner]++; v = BT.cOf(M, e.winner); if (v) v.cheer = true; }
        M.rounds.push({ winner: e.winner, t: Math.round(M.roundT * 10) / 10 });
      } else if (e.k === 'next') BT.startRound(M);
      else if (e.k === 'over') { M.phase = 'over'; M.phaseT = 0; M.winner = e.winner; }
    };
    BT.newMatch = function (setup) {   // setup: { slots: [4 x { on, who: 'human' | 'cpu', pad, col, name }], arena, rules, seed }
      var M = { v: 1, seed: (setup.seed >>> 0) || 1, rs: 0, cpuRs: 0, step: 0, t: 0, rules: BT.copy(setup.rules || BT.RULES0), arena: setup.arena || BT.ARENAS[0].id,
        round: 0, wins: [0, 0, 0, 0], phase: 'ready', phaseT: 0, roundT: 0, ot: false, winner: -1, roundWinner: -1, rounds: [],
        cs: [], notes: [], items: [], noteId: 0, itemId: 0, itemT: 0, ev: [], count: {}, stats: [] }, i, s, c;
      M.rs = M.seed; M.cpuRs = ((M.seed ^ 0x5bd1e995) >>> 0) || 7;
      for (i = 0; i < 4; i++) {
        M.stats.push({ hits: 0, took: 0, falls: 0, kos: 0, items: 0 });
        s = setup.slots && setup.slots[i]; if (!s || !s.on) continue;
        c = BT.newC(i, 0, 0); c.who = s.who === 'human' ? 'human' : 'cpu'; c.pad = s.pad | 0; c.col = s.col | 0; c.name = s.name | 0;
        M.cs.push(c);
      }
      BT.startRound(M);
      return M;
    };
    BT.SPREAD = { 1: [0], 2: [0, 3], 3: [0, 1, 3], 4: [0, 1, 2, 3] };   // which starts n conductors take (they turn round one place each round)
    BT.startRound = function (M) {
      var ar = BT.arenaOf(M.arena), n = M.cs.length, use = BT.SPREAD[n] || BT.SPREAD[4], i, c, f, sp;
      M.round++; M.phase = 'ready'; M.phaseT = 0; M.roundT = 0; M.ot = false; M.roundWinner = -1; M.notes = []; M.items = [];
      M.itemT = BT.N.ITEM_T0 * 0.6 + BT.rand(M, 'rs') * 3;
      for (i = 0; i < n; i++) {
        c = M.cs[i]; sp = ar.spawns[use[(i + M.round - 1) % use.length] % ar.spawns.length];
        f = BT.newC(c.i, sp.tx * 16 + 3, sp.ty * 16 + 16 - Q.HERO.H);
        f.who = c.who; f.pad = c.pad; f.col = c.col; f.name = c.name; f.hp = M.rules.hearts; f.ground = true; f.net = c.net || '';   // net (B18): '' on this device, 'peer' a guest's (the host), 'far' shown from the host (a guest)
        M.cs[i] = f;
      }
    };
    BT.step = function (M, dt, inp) {   // one fixed step: every conductor moves by its input frame, the host decides, the events are carried out, the round goes on
      var ar = BT.arenaOf(M.arena), i, j, list, fight;
      M.step++; M.t += dt; M.phaseT += dt; M.ev.length = 0;
      for (i = 0; i < M.cs.length; i++) M.cs[i].fx.length = 0;
      if (M.phase === 'over') return;
      if (M.phase === 'ready' && M.phaseT >= BT.N.READY_T) { M.phase = 'fight'; M.phaseT = 0; }
      fight = M.phase === 'fight';
      if (fight) M.roundT += dt;
      for (i = 0; i < M.cs.length; i++) BT.sim(M.cs[i], fight && inp ? inp[i] || BT.ZERO : BT.ZERO, dt, ar);
      if (fight) BT.host(M, dt);
      for (i = 0; i < M.ev.length; i++) BT.apply(M, M.ev[i]);
      list = M.notes; for (i = 0, j = 0; i < list.length; i++) if (!list[i].dead) list[j++] = list[i]; list.length = j;
      list = M.items; for (i = 0, j = 0; i < list.length; i++) if (!list[i].dead) list[j++] = list[i]; list.length = j;
      BT.hostRound(M);
    };
    // ---------- the input frames: slot 1's person on the device's own buttons; the others on the runtime's controller n (BATTLE.md's api.pad proposal); CPUs (94) ----------
    BT.pad = function (n) { var a = Q.api; return a && typeof a.pad === 'function' ? a.pad(n) || null : null; };
    BT.padsOn = function () { var a = Q.api; return !!(a && typeof a.pad === 'function'); };
    var btLatch = { 2: {}, 3: {}, 4: {} }, btLatchAt = { 2: -1, 3: -1, 4: -1 };
    BT.padLatch = function () {   // each step, and each frame in every BATTLE scene's draw (96-battle-online-link.js): a press seen in this frame is kept until a step reads it
      var a = Q.api, t = a && a.t ? a.t() : 0, n, pd, k;
      for (n = 2; n <= 4; n++) {
        if (btLatchAt[n] === t) continue;
        pd = BT.pad(n); if (!pd) continue;
        btLatchAt[n] = t;
        for (k = 0; k < 8; k++) if (pd.pressed(BT.KEYS[k])) btLatch[n][BT.KEYS[k]] = true;
      }
    };
    BT.padClear = function () { for (var n = 2; n <= 4; n++) btLatch[n] = {}; };
    BT.readPad = function (n) {
      var pd = BT.pad(n), f = { h: 0, p: 0 }, k, nm;
      BT.padLatch();
      if (!pd) return f;
      for (k = 0; k < 8; k++) { nm = BT.KEYS[k]; if (pd.held(nm)) f.h |= BT.BIT[nm]; if (btLatch[n][nm]) { f.p |= BT.BIT[nm]; btLatch[n][nm] = false; } }
      return f;
    };
    BT.readDevice = function () {   // the device's own buttons: held from the runtime, presses from the engine's one record (Q.press, QUEST-API part 13 item 28)
      var a = Q.api, f = { h: 0, p: 0 }, k, nm;
      if (!a) return f;
      for (k = 0; k < 8; k++) { nm = BT.KEYS[k]; if (a.held(nm)) f.h |= BT.BIT[nm]; if (Q.press(nm)) f.p |= BT.BIT[nm]; }
      return f;
    };
    BT.inputs = function (M, dt) {   // this step's frame for every conductor, in M.cs order
      var out = [], i, c;
      for (i = 0; i < M.cs.length; i++) {
        c = M.cs[i];
        if (c.net) out.push(BT.ZERO);   // online (B18): a conductor moved on another device takes no input here
        else if (c.who === 'cpu') out.push(BT.cpu(M, c, dt));
        else if (c.pad > 1) out.push(BT.readPad(c.pad));
        else out.push(BT.readDevice());
      }
      return out;
    };
