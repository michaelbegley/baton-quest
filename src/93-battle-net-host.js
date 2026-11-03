    // ---------- 93-battle-net-host.js: BATTLE MODE online, the host's side (B18; ONLINE.md) ----------
    // The host opens a room (its code), seats each guest who says hello in the first free slot (a CPU's or an empty one), keeps the lobby (slots, rules, arena)
    // and sends it to each guest; START begins the match on every device. In the match the host runs the rules for everyone (BT.hostStep): its own people and
    // the CPUs move here; a guest's conductor moves by that guest's reports, and between them by the host's guess (BT.sim with the buttons last reported).
    // From the step the host decides a knock, a respawn or a new round for a guest's conductor until that guest acknowledges the event, the host keeps to its
    // guess (c.hold) and ignores older reports, so a report sent before the guest knew can never undo it. A guest who leaves becomes a CPU (event 'left').
    // B22: in the lobby the host can remove a friend (BT.hostRemove): his seat is a CPU again, he is told 'out', and for the room's life the host turns away
    // his transport id (out) and his room tag (outW: the tag his page sent, given here by js/net.js as a poll event 'tag'), so a reload does not let him in.
    (function () {
      var H = BT.NH = { on: false, code: '', slots: [], guests: {}, away: {}, t: 0, lobT: 0, dirty: false, phase: '', k: 0, M: null, setup: null, seq: 0, log: [], extra: [], why: '', trouble: 0,
        out: {}, outW: {}, tags: {}, tell: {} };
      function key(id) { return 'p:' + id; }
      function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
      function each(fn) { var k; for (k in H.guests) if (own(H.guests, k)) fn(H.guests[k]); }
      function bySlot(i) { var r = null; each(function (g) { if (g.slot === i) r = g; }); return r; }
      function colFree(i, col) { for (var j = 0; j < 4; j++) if (j !== i && H.slots[j].on && H.slots[j].col === col) return false; return true; }
      function nameFree(i, nm) { for (var j = 0; j < 4; j++) if (j !== i && H.slots[j].on && H.slots[j].name === nm) return false; return true; }
      function nextCol(i, from, step) { var v = from, k; for (k = 0; k < 4; k++) { v = (v + step + 4) % 4; if (colFree(i, v)) return v; } return from; }
      function nextName(i, from, step) { var n = BT.NAMES.length, v = from, k; for (k = 0; k < n; k++) { v = (v + step + n) % n; if (nameFree(i, v)) return v; } return from; }
      function tidy(i) { var s = H.slots[i]; if (!colFree(i, s.col)) s.col = nextCol(i, s.col, 1); if (!nameFree(i, s.name)) s.name = nextName(i, s.name, 1); }
      function recolour(i, step) {   // the next free colour; with all four taken, a swap with whoever has the next one (as B16's players screen)
        var s = H.slots[i], want = (s.col + step + 4) % 4, v = nextCol(i, s.col, step), j;
        if (v !== s.col) { s.col = v; return; }
        for (j = 0; j < 4; j++) if (j !== i && H.slots[j].on && H.slots[j].col === want) { H.slots[j].col = s.col; s.col = want; return; }
      }
      BT.hostTidy = tidy; BT.hostRecolour = recolour; BT.hostNextName = nextName;
      BT.hostGuests = function () { var n = 0; each(function () { n++; }); return n; };
      BT.hostGuestAt = function (i) { return !!bySlot(i); };
      BT.hostOpen = function () {   // a room of our own; gives its code ('' if this page cannot)
        var n = BT.netApi(), i, s, code;
        if (!n || !n.ok()) return '';
        code = n.host(); if (!BT.codeOk(code)) { n.leave(); return ''; }
        H.on = true; H.code = code; H.guests = {}; H.away = {}; H.phase = 'lobby'; H.dirty = true; H.M = null; H.why = ''; H.t = 0; H.lobT = 0; H.trouble = 0; H.slots = [];
        H.out = {}; H.outW = {}; H.tags = {}; H.tell = {};   // a new room: nobody is out of it yet
        for (i = 0; i < 4; i++) { s = BT.S.slots[i]; H.slots.push({ on: i === 0 ? true : s.on, who: i === 0 ? 'human' : 'cpu', pad: i === 0 ? 1 : 0, col: s.col, name: s.name, peer: '' }); }
        for (i = 1; i < 4; i++) if (H.slots[i].on) tidy(i);
        return code;
      };
      BT.hostClose = function (why) {   // CLOSE (or the page lost its room): every guest is told, the room is left
        var n = BT.netApi();
        if (H.on) { each(function (g) { BT.netSend(g.id, { t: 'end' }); }); if (n) n.leave(); }
        H.on = false; H.guests = {}; H.phase = ''; H.M = null; H.why = why || ''; H.out = {}; H.outW = {}; H.tags = {}; H.tell = {};
      };
      function isOut(from) { var k = key(from); return own(H.out, k) || (own(H.tags, k) && own(H.outW, H.tags[k])); }   // B22: removed from this room, by his id or by his tag
      BT.hostRemove = function (i) {   // B22, the host's YES to REMOVE in the lobby: that friend is told 'out' and kept out of this room; his seat is a CPU again (as when one leaves)
        var g = bySlot(i), k, s;
        if (!H.on || H.phase !== 'lobby' || !g) return false;
        k = key(g.id); H.out[k] = true; if (own(H.tags, k)) H.outW[H.tags[k]] = true;
        delete H.guests[k]; delete H.away[k];
        s = H.slots[i]; H.slots[i] = { on: true, who: 'cpu', pad: 0, col: s.col, name: s.name, peer: '' }; H.dirty = true;
        H.tell[k] = { id: g.id, n: 1 }; BT.netSend(g.id, { t: 'no', why: 'out' });
        Q.toast(BT.NAMES[s.name] + ' REMOVED: A CPU TAKES THE SEAT', 2.4);
        return true;
      };
      function tellOut() {   // a removed friend still in the room is told again every LOB_EVERY steps (a lost message is mended), OUT_TELL times at most
        var k, o;
        for (k in H.tell) if (own(H.tell, k)) { o = H.tell[k]; if (o.n >= BT.NT.OUT_TELL) delete H.tell[k]; else { o.n++; BT.netSend(o.id, { t: 'no', why: 'out' }); } }
      }
      function freeSlot() { for (var i = 1; i < 4; i++) if (!(H.slots[i].on && H.slots[i].who === 'human')) return i; return -1; }
      function seat(from, m) {   // a hello: the first free slot, its colour and name as asked when no one else has them
        var i = freeSlot(), g;
        if (i < 0) return null;
        g = H.guests[key(from)] = { id: from, slot: i, ack: 0, lastS: -1, rep: null, fresh: false, held: 0, hasK: 0, quiet: 0 };
        H.slots[i] = { on: true, who: 'human', pad: 0, col: BT.nInt(m.col, 0, 3, 0), name: BT.nInt(m.name, 0, BT.NAMES.length - 1, 0), peer: from };
        tidy(i); H.dirty = true; Q.sfx('learn');
        return g;
      }
      function gone(id) {   // a guest left (its BYE, or the page says it is gone): in the lobby its slot is a CPU again; in a match a CPU plays on for it
        var g = own(H.guests, key(id)) ? H.guests[key(id)] : null, s, c;
        if (!g) return;
        delete H.guests[key(id)];
        s = H.slots[g.slot]; H.slots[g.slot] = { on: true, who: 'cpu', pad: 0, col: s.col, name: s.name, peer: '' }; H.dirty = true;
        if (H.M && H.phase === 'match') { c = BT.cOf(H.M, g.slot); if (c) { c.who = 'cpu'; c.net = ''; c.hold = false; c.ai = null; c.pad = g.slot + 1; H.extra.push({ k: 'left', who: g.slot }); } }
        Q.toast(BT.NAMES[s.name] + ' LEFT: A CPU PLAYS ON', 2.4);
      }
      function report(g, m) {   // a guest's own conductor: the newest only, and only for this match
        var M = H.M, s = BT.nInt(m.s, 0, 1e9, -1), a = BT.nInt(m.a, 0, 1e9, -1), k = BT.nInt(m.k, 0, 1e9, -1), c = BT.cleanMe(m.c);
        if (!M || H.phase !== 'match' || k !== M.k || s < 0 || a < 0 || !c) return;
        g.hasK = k;
        if (s <= g.lastS) return;
        g.lastS = s; if (a > g.ack) g.ack = Math.min(a, H.seq);
        g.rep = c; g.held = BT.nInt(m.h, 0, 255, 0); g.fresh = true; g.quiet = 0;
      }
      function message(from, m) {
        var g = own(H.guests, key(from)) ? H.guests[key(from)] : null, s;
        if (!m || typeof m !== 'object' || typeof m.t !== 'string') return;
        if (m.t === 'hi') {
          if (isOut(from)) { BT.netSend(from, { t: 'no', why: 'out' }); return; }   // B22: removed from this room: turned away, whatever he asks
          delete H.away[key(from)];
          if (BT.nInt(m.v, 0, 999, -1) !== BT.NETV) { BT.netSend(from, { t: 'no', why: 'old' }); return; }
          if (!g) {
            if (H.phase !== 'lobby') { BT.netSend(from, { t: 'no', why: 'busy' }); return; }
            g = seat(from, m);
            if (!g) { BT.netSend(from, { t: 'no', why: 'full' }); return; }
          }
          BT.netSend(from, { t: 'seat', v: BT.NETV, you: g.slot }); H.dirty = true;
          return;
        }
        if (!g) { if (m.t === 'me' && own(H.away, key(from))) BT.netSend(from, { t: 'no', why: 'away' }); return; }   // away too long: told again until he hears it
        if (m.t === 'pick' && H.phase === 'lobby') {
          s = H.slots[g.slot];
          if (m.col === 1 || m.col === -1) recolour(g.slot, m.col);
          if (m.name === 1 || m.name === -1) s.name = nextName(g.slot, s.name, m.name);
          H.dirty = true;
        } else if (m.t === 'me') report(g, m);
        else if (m.t === 'bye') gone(from);
      }
      function lobbyOf(g) {   // the lobby as one guest sees it
        var sl = [], i, s;
        for (i = 0; i < 4; i++) { s = H.slots[i]; sl.push({ on: s.on ? 1 : 0, w: !s.on ? 'off' : s.who === 'cpu' ? 'cpu' : s.peer ? 'net' : s.pad === 1 ? 'host' : 'pad', c: s.col, m: s.name }); }
        return { t: 'lob', k: H.k, you: g.slot, sl: sl, ru: BT.copy(BT.S.rules), ar: BT.S.arena };   // k: matches started so far (a guest drops an older lobby)
      }
      function awayCheck() {   // a guest whose game is quiet in a match (a hidden tab, a locked phone: its page still answers the heartbeats): after AWAY steps a CPU plays on
        var ids = [];
        each(function (g) { if (++g.quiet > BT.NT.AWAY) ids.push(g.id); });
        ids.forEach(function (id) { H.away[key(id)] = true; BT.netSend(id, { t: 'no', why: 'away' }); gone(id); });
      }
      BT.hostPoll = function () {   // every step the host is online (lobby, fight, results): what came in, then the lobby out
        var l, i, e, n, c;
        if (!H.on) return;
        H.t++; if (H.trouble > 0) H.trouble--;
        l = BT.netPoll();
        for (i = 0; i < l.length && H.on; i++) {
          e = l[i];
          if (e.k === 'msg') message(e.from, e.msg);
          else if (e.k === 'tag') { if (e.msg && BT.tagOk(e.msg.w)) H.tags[key(e.from)] = e.msg.w; }   // B22: this peer's room tag (js/net.js gives it before his first message)
          else if (e.k === 'leave') { gone(e.from); delete H.tags[key(e.from)]; delete H.tell[key(e.from)]; }
          else if (e.k === 'clash') { if (!BT.hostGuests() && H.phase === 'lobby') { n = BT.netApi(); c = n ? n.host() : ''; if (BT.codeOk(c)) { H.code = c; H.dirty = true; } } }   // another host had our code: a new one
          else if (e.k === 'trouble') H.trouble = 300;
          else if (e.k === 'lost') { BT.hostClose(e.msg && e.msg.why === 'load' ? 'load' : 'start'); return; }
        }
        if (H.phase === 'match') awayCheck();
        if (H.t % BT.NT.LOB_EVERY === 0) tellOut();
        if (H.phase === 'lobby' && (H.dirty || ++H.lobT >= BT.NT.LOB_EVERY)) { H.lobT = 0; H.dirty = false; each(function (g) { BT.netSend(g.id, lobbyOf(g)); }); }
        if (H.phase === 'results' && H.M && H.log.length && H.t % 6 === 0) send(H.M, false);   // the last events, until every guest has them
      };
      BT.hostStart = function () {   // START in the lobby, or REMATCH: a new match on every device
        var slots = [], i, s, st, M, c;
        for (i = 0; i < 4; i++) { s = H.slots[i]; slots.push({ on: s.on, who: s.who, pad: s.peer ? 0 : s.who === 'human' ? s.pad : i + 1, col: s.col, name: s.name, net: s.peer ? 1 : 0 }); }
        st = BT.setupNow(); st.slots = slots;
        M = BT.newMatch(st);
        H.k++; M.k = H.k; M.role = 'host';
        for (i = 0; i < M.cs.length; i++) { c = M.cs[i]; c.net = H.slots[c.i].peer ? 'peer' : ''; c.hold = false; c.lockQ = 0; }
        H.M = M; H.setup = st; H.seq = 0; H.log = []; H.extra = []; H.phase = 'match';
        each(function (g) { g.ack = 0; g.lastS = -1; g.rep = null; g.fresh = false; g.held = 0; g.quiet = 0; });
        return M;
      };
      BT.hostLobby = function () { H.phase = 'lobby'; H.M = null; H.log = []; H.dirty = true; };
      BT.hostResults = function () { H.phase = 'results'; };
      function remote(M, c, g, dt, ar, fight) {   // a guest's conductor: the host's guess (its timers tick as on every device), then that guest's newest report
        var lock = !g || g.ack < (c.lockQ || 0), stale = !g || g.quiet > BT.NT.STALE;   // stale: no report for half a second, so no more running on his last buttons
        BT.sim(c, fight && !lock && !stale ? { h: g.held, p: 0 } : BT.ZERO, dt, ar);
        c.wantNote = false; c.poundLand = false; c.fx.length = 0;
        if (g && g.fresh) { g.fresh = false; if (!lock) { BT.unpackMe(c, g.rep); c.hold = false; } }
      }
      BT.hostStep = function (M, dt, still) {   // one fixed step of a match online (BT.step, with guests' conductors as above); still: the host's own menu is up
        var ar = BT.arenaOf(M.arena), N = BT.N, i, j, c, e, inp, list, fight, s0 = H.seq;
        M.step++; M.t += dt; M.phaseT += dt; M.ev.length = 0;
        for (i = 0; i < M.cs.length; i++) M.cs[i].fx.length = 0;
        if (M.phase !== 'over') {
          if (M.phase === 'ready' && M.phaseT >= N.READY_T) { M.phase = 'fight'; M.phaseT = 0; }
          fight = M.phase === 'fight';
          if (fight) M.roundT += dt;
          inp = BT.inputs(M, dt);
          for (i = 0; i < M.cs.length; i++) {
            c = M.cs[i];
            if (c.net === 'peer') remote(M, c, bySlot(c.i), dt, ar, fight);
            else BT.sim(c, fight && !(still && c.who === 'human' && c.pad <= 1) ? inp[i] || BT.ZERO : BT.ZERO, dt, ar);
          }
          if (fight) BT.host(M, dt);
          for (i = 0; i < M.ev.length; i++) BT.apply(M, M.ev[i]);
          list = M.notes; for (i = 0, j = 0; i < list.length; i++) if (!list[i].dead) list[j++] = list[i]; list.length = j;
          list = M.items; for (i = 0, j = 0; i < list.length; i++) if (!list[i].dead) list[j++] = list[i]; list.length = j;
          BT.hostRound(M);
        }
        while (H.extra.length) M.ev.push(H.extra.shift());   // a guest who left: a CPU here already
        for (i = 0; i < M.ev.length; i++) {   // number this step's events, keep them until every guest has them, and hold a guest's conductor they move
          e = M.ev[i]; e.q = ++H.seq; e.s = M.step; H.log.push(e);
          if (e.k === 'hit' || e.k === 'back') { c = BT.cOf(M, e.who); if (c && c.net === 'peer') { c.lockQ = e.q; c.hold = true; } }
          else if (e.k === 'next') for (j = 0; j < M.cs.length; j++) if (M.cs[j].net === 'peer') { M.cs[j].lockQ = e.q; M.cs[j].hold = true; }
        }
        send(M, H.seq > s0);
      };
      function send(M, news) {   // to each guest: every event it has not acknowledged, a snapshot every third step, the setup until it has this match
        var snap = M.step % BT.NT.SNAP_EVERY === 0, z = null, low = H.seq, j;
        if (!news && M.step % BT.NT.HOST_EVERY !== 0 && H.phase === 'match') return;
        each(function (g) {
          var ev = [], p;
          for (j = 0; j < H.log.length && ev.length < BT.NT.EV_MAX; j++) if (H.log[j].q > g.ack) ev.push(H.log[j]);
          p = { t: 'm', k: M.k, s: M.step, e: ev };
          if (snap) p.z = z || (z = BT.snapOf(M, H.seq));
          if (g.hasK !== M.k) p.su = { k: M.k, you: g.slot, st: H.setup };
          BT.netSend(g.id, p);
          if (g.ack < low) low = g.ack;
        });
        for (j = 0; j < H.log.length && H.log[j].q <= low; j++) {}
        if (j) H.log.splice(0, j);
      }
      BT.hostAt = function () {   // for checks
        var gs = [];
        each(function (g) { gs.push({ slot: g.slot, ack: g.ack, lastS: g.lastS, hasK: g.hasK }); });
        var n = function (o) { var c = 0, k; for (k in o) if (own(o, k)) c++; return c; };
        return { on: H.on, code: H.code, phase: H.phase, k: H.k, seq: H.seq, log: H.log.length, guests: gs, slots: H.slots.map(function (s) { return { on: s.on, who: s.who, pad: s.pad, col: s.col, name: s.name, net: !!s.peer }; }), why: H.why,
          out: n(H.out), outW: n(H.outW), tags: n(H.tags), tell: n(H.tell) };   // B22: how many ids and tags are out of this room, tags known, removed friends still being told
      };
    })();
