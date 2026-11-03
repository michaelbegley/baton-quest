    // ---------- 93-battle-net.js: BATTLE MODE online, what both sides share (B18; ONLINE.md): the numbers, checking what arrives, packing a conductor ----------
    // The network is the page's (js/net.js): the game reaches it only through the runtime's api.net, plain JSON read once a step. One device hosts and runs
    // the match (BT.host, BT.hostRound and the CPUs run there only); each guest moves its own conductor (BT.sim) and shows the others from the host's
    // snapshots, a little in the past (Gambetta, entity interpolation). Each decision of the host is an event with a number, sent again in every packet until
    // the guest says it has it, and carried out once (BT.apply). Nothing that arrives is ever drawn as text: names and colours are numbers into our own lists.
    BT.NETV = 2;   // the messages' version: a hello from another version is told to reload (2, B22: the host's 'no' can say 'out', a removed friend)
    BT.CODEA = 'BCDFGHJKLMNPQRSTVWXZ';   // a code is BT.CODEN of these 20 letters (no vowels, no Y, so no code is a word: Crockford's reason, taken further)
    BT.CODEN = 6;   // B22: 6 letters, 64,000,000 codes (4 before: 160,000), so a stranger cannot guess his way into a lobby
    BT.TAGN = 12;   // B22: a guest's room tag, 12 of the same letters, made by his page (js/net.js) and handed to the host's game as a poll event 'tag'
    BT.NT = { HOST_EVERY: 3, GUEST_EVERY: 2, SNAP_EVERY: 3, BEHIND: 8, HELLO: 30, FIND_T: 25, EV_MAX: 64, LOB_EVERY: 30, SNAPS: 16, STALE: 30, AWAY: 600, OUT_TELL: 20 };   // steps (60 a second), except FIND_T (s) and OUT_TELL (times told, LOB_EVERY apart)
    BT.netApi = function () { var a = Q.api; return a && a.net && typeof a.net.ok === 'function' ? a.net : null; };
    BT.netOk = function () { var n = BT.netApi(); return !!(n && n.ok()); };
    BT.netSend = function (to, m) { var n = BT.netApi(); return !!(n && n.send(to, m)); };
    BT.netPoll = function () { var n = BT.netApi(); return n ? n.poll() : []; };
    function btNum(v, lo, hi) { v = +v; return v === v && v >= lo && v <= hi ? v : NaN; }   // a number from the network in [lo, hi], else NaN (v === v is false only for NaN)
    function btIn(v, lo, hi) { v = btNum(v, lo, hi); return v === v; }
    BT.nNum = btNum;
    BT.nInt = function (v, lo, hi, def) { v = btNum(v, lo, hi); return v === v ? Math.floor(v) : def; };
    function r2(v) { return Math.round(v * 100) / 100; }
    function r3(v) { return Math.round(v * 1000) / 1000; }
    function btLetters(s, n) { var i; if (typeof s !== 'string' || s.length !== n) return false; for (i = 0; i < n; i++) if (BT.CODEA.indexOf(s.charAt(i)) < 0) return false; return true; }
    BT.codeOk = function (c) { return btLetters(String(c || ''), BT.CODEN); };   // a lobby's code: exactly BT.CODEN of BT.CODEA (an old 4-letter one is not)
    BT.tagOk = function (w) { return btLetters(w, BT.TAGN); };   // a room tag from the page, checked on arrival
    // ---------- a conductor, both ways: a guest's report of its own (FLAGS), the host's snapshot of every one ----------
    var FLAGS = ['ground', 'charged', 'dashing', 'hovering', 'pounding', 'flying', 'drop', 'wasB'];
    function btFlags(c) { var f = 0, i; for (i = 0; i < FLAGS.length; i++) if (c[FLAGS[i]]) f |= 1 << i; return f; }
    function btSetFlags(c, f) { for (var i = 0; i < FLAGS.length; i++) c[FLAGS[i]] = !!(f & (1 << i)); }
    BT.packMe = function (c) {   // a guest's own conductor, as its owner moved it
      return { x: r2(c.x), y: r2(c.y), vx: r2(c.vx), vy: r2(c.vy), f: c.face < 0 ? -1 : 1, fr: c.frame | 0, g: btFlags(c), sw: r3(c.swingT), si: c.swingId, ch: r3(c.chargeT),
        rh: c.rhythm | 0, pt: r3(c.poundT), dt: r3(c.dashT), dd: c.dashDir < 0 ? -1 : 1, ht: r3(c.hoverT), st: r3(c.stun), nn: c.nN, pl: c.pL, jn: c.jN };
    };
    var ME = { x: [-3000, 3000], y: [-3000, 3000], vx: [-6000, 6000], vy: [-6000, 6000], fr: [0, 17, 1], g: [0, 255, 1], sw: [-1, 1], si: [0, 1e9, 1], ch: [0, 99], rh: [0, 9, 1],
      pt: [-1, 1], dt: [-1, 1], ht: [-1, 2], st: [-1, 9], nn: [0, 1e6, 1], pl: [0, 1e6, 1], jn: [0, 1e6, 1] };
    BT.cleanMe = function (r) {   // a report checked field by field (null if any is wrong)
      var o = {}, k, v;
      if (!r || typeof r !== 'object') return null;
      for (k in ME) { if (!Object.prototype.hasOwnProperty.call(ME, k)) continue; v = btNum(r[k], ME[k][0], ME[k][1]); if (v !== v) return null; o[k] = ME[k][2] ? Math.floor(v) : v; }
      o.f = r.f < 0 ? -1 : 1; o.dd = r.dd < 0 ? -1 : 1;
      return o;
    };
    BT.unpackMe = function (c, r) {   // the host takes a guest's report: how it moves; the counters become the host's intents (a new swing, a note, a pound's landing)
      c.x = r.x; c.y = r.y; c.vx = r.vx; c.vy = r.vy; c.face = r.f; c.frame = r.fr; btSetFlags(c, r.g); c.chargeT = r.ch; c.rhythm = r.rh; c.poundT = r.pt;
      c.dashT = r.dt; c.dashDir = r.dd; c.hoverT = r.ht; c.stun = r.st;
      if (r.si !== c.swingId) { c.swingId = r.si; c.swingT = r.sw; if (r.sw > 0) c.fx.push(['s', 'swing']); }
      if (r.nn > c.nN) c.wantNote = true;
      if (r.pl > c.pL) c.poundLand = true;
      if (r.jn > c.jN) c.fx.push(['s', 'jump']);
      c.nN = r.nn; c.pL = r.pl; c.jN = r.jn;
    };
    BT.packSnapC = function (c) {   // one conductor in the host's snapshot: what a guest needs to draw him (his hearts and WOBBLE come by events)
      return { i: c.i, x: r2(c.x), y: r2(c.y), f: c.face < 0 ? -1 : 1, fr: c.frame | 0, g: btFlags(c), sf: r3(c.safe), sw: r3(c.swingT), si: c.swingId, ch: r3(c.chargeT), st: r3(c.stun),
        bk: c.bk, jn: c.jN, b: [r2(c.buff.dash), r2(c.buff.hover), r2(c.buff.pound), r2(c.buff.baton), r2(c.buff.metro)] };
    };
    var SC = { i: [0, 3, 1], x: [-3000, 3000], y: [-3000, 3000], fr: [0, 17, 1], g: [0, 255, 1], sf: [-1, 9], sw: [-1, 1], si: [0, 1e9, 1], ch: [0, 99], st: [-1, 9], bk: [0, 1e6, 1], jn: [0, 1e6, 1] };
    BT.cleanSnap = function (z) {   // a snapshot checked: { s, eq, ph, pt, rt, r, c: [...], n: notes, it: items }
      var o, i, j, a, b, k, v, ok;
      if (!z || typeof z !== 'object' || !z.c || !z.c.length || z.c.length > 4) return null;
      o = { s: BT.nInt(z.s, 0, 1e9, -1), eq: BT.nInt(z.eq, 0, 1e9, -1), ph: z.ph === 'ready' || z.ph === 'fight' || z.ph === 'end' || z.ph === 'over' ? z.ph : '', pt: btNum(z.pt, 0, 1e6), rt: btNum(z.rt, 0, 1e6), r: BT.nInt(z.r, 1, 99, -1), c: [], n: [], it: [] };
      if (o.s < 0 || o.eq < 0 || !o.ph || o.pt !== o.pt || o.rt !== o.rt || o.r < 0) return null;
      for (i = 0; i < z.c.length; i++) {
        a = z.c[i]; b = {}; ok = !!a && typeof a === 'object';
        for (k in SC) { if (!ok || !Object.prototype.hasOwnProperty.call(SC, k)) continue; v = btNum(a[k], SC[k][0], SC[k][1]); if (v !== v) ok = false; else b[k] = SC[k][2] ? Math.floor(v) : v; }
        if (!ok || !a.b || a.b.length !== 5) return null;
        b.f = a.f < 0 ? -1 : 1; b.b = [];
        for (j = 0; j < 5; j++) { v = btNum(a.b[j], 0, 99); if (v !== v) return null; b.b.push(v); }
        o.c.push(b);
      }
      for (i = 0; z.n && i < z.n.length && i < 24; i++) { a = z.n[i]; if (a && btIn(a.id, 0, 1e9) && btIn(a.x, -3000, 3000) && btIn(a.t, 0, 99)) o.n.push({ id: Math.floor(a.id), x: +a.x, t: +a.t }); }
      for (i = 0; z.it && i < z.it.length && i < 8; i++) { a = z.it[i]; if (a && btIn(a.id, 0, 1e9) && btIn(a.x, -3000, 3000) && btIn(a.t, 0, 999)) o.it.push({ id: Math.floor(a.id), x: +a.x, t: +a.t }); }
      return o;
    };
    BT.snapOf = function (M, eq) {   // the host's snapshot of the match now (eq: the last event number it reflects)
      var o = { s: M.step, eq: eq, ph: M.phase, pt: r3(M.phaseT), rt: r3(M.roundT), r: M.round, c: [], n: [], it: [] }, i, n, it;
      for (i = 0; i < M.cs.length; i++) o.c.push(BT.packSnapC(M.cs[i]));
      for (i = 0; i < M.notes.length; i++) { n = M.notes[i]; if (!n.dead) o.n.push({ id: n.id, x: r2(n.x), t: r3(n.t) }); }
      for (i = 0; i < M.items.length; i++) { it = M.items[i]; if (!it.dead) o.it.push({ id: it.id, x: r2(it.x), t: r3(it.t) }); }
      return o;
    };
    // ---------- the host's events, checked on arrival: only our own kinds, every field in range ----------
    var EVK = { hit: 1, note: 1, noteEnd: 1, fall: 1, back: 1, itemIn: 1, item: 1, itemOut: 1, shake: 1, ot: 1, round: 1, next: 1, over: 1, left: 1 };
    var EVF = { who: [0, 3, 1], by: [-1, 3, 1], kvx: [-9999, 9999], kvy: [-9999, 9999], stun: [0, 9], wob: [0, 24], x: [-9999, 9999], y: [-9999, 9999], y0: [-9999, 9999],
      vx: [-9999, 9999], ph: [-99, 99], id: [0, 1e9, 1], winner: [-1, 3, 1] };
    var HOW = { baton: 1, note: 1, meteor: 1, shock: 1 };
    BT.cleanEv = function (e) {
      var o, k, v;
      if (!e || typeof e !== 'object' || typeof e.k !== 'string' || !Object.prototype.hasOwnProperty.call(EVK, e.k)) return null;
      o = { k: e.k, q: BT.nInt(e.q, 1, 1e9, 0), s: BT.nInt(e.s, 0, 1e9, 0) };
      if (!o.q) return null;
      for (k in EVF) { if (!Object.prototype.hasOwnProperty.call(EVF, k) || e[k] === undefined) continue; v = btNum(e[k], EVF[k][0], EVF[k][1]); if (v !== v) return null; o[k] = EVF[k][2] ? Math.floor(v) : v; }
      if (e.how !== undefined) { if (typeof e.how !== 'string' || !Object.prototype.hasOwnProperty.call(HOW, e.how)) return null; o.how = e.how; }
      if (e.kind !== undefined) { if (typeof e.kind !== 'string' || !Object.prototype.hasOwnProperty.call(BT.ITEMS, e.kind)) return null; o.kind = e.kind; }
      if (e.big !== undefined) o.big = !!e.big;
      return o;
    };
    BT.cleanRules = function (r) {   // the host's rules, from its lobby
      if (!r || typeof r !== 'object') return null;
      var o = { rounds: BT.nInt(r.rounds, 1, 5, 0), hearts: BT.nInt(r.hearts, 1, 5, 0), items: !!r.items, cpu: BT.nInt(r.cpu, 0, 2, -1) };
      return BT.ROUNDS.indexOf(o.rounds) >= 0 && o.hearts && o.cpu >= 0 ? o : null;
    };
    BT.arenaOk = function (a) { if (a === 'random') return true; for (var i = 0; i < BT.ARENAS.length; i++) if (BT.ARENAS[i].id === a) return true; return false; };
    BT.netWords = {   // what a guest is told when it cannot play (each its own words: nothing that arrives is shown)
      none: 'NO GAME WITH THAT CODE. ASK THE HOST AGAIN.', full: 'THAT GAME IS FULL: FOUR PLAYERS ALREADY.', busy: 'A MATCH IS ON THERE. YOU JOIN WHEN IT ENDS.',
      old: 'THAT GAME IS ON ANOTHER VERSION. BOTH OF YOU: RELOAD THE PAGE.', host: 'THE HOST LEFT THE GAME.', end: 'THE HOST CLOSED THE GAME.',
      load: 'ONLINE PLAY COULD NOT START ON THIS PAGE.', start: 'ONLINE PLAY COULD NOT START ON THIS PAGE.', trouble: 'NO DIRECT LINK: THIS NETWORK MAY BLOCK GAMES.',
      away: 'YOU WERE AWAY TOO LONG: A CPU TOOK YOUR PLACE.', closed: 'YOU CLOSED THE GAME.',
      out: 'THE HOST REMOVED YOU FROM THIS GAME.', link: 'THAT LINK IS OLD: CODES HAVE 6 LETTERS NOW. ASK THE HOST FOR A NEW ONE.'   // B22
    };
