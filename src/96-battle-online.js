    // ---------- 96-battle-online.js: BATTLE MODE online, its menus (B18; ONLINE.md): JOIN A GAME ('bjoin'), the lobby ('blobby'), a message ('bnote') ----------
    // JOIN: four letter wheels (up and down change a letter, left and right move, A joins); a ?join= link fills them and joins at once. The lobby: the code,
    // four slots (YOU, friends, CPUs), the rules, the arena; the host also picks his colour and name, turns empty slots CPU or OFF, and STARTs; a guest picks
    // his own colour (left, right) and name (up, down) and waits. B asks first, then leaves (the host's leaving closes the game for everyone).
    (function () {
      var U = Q.ui, JO = { w: [0, 0, 0, 0], at: 0, t: 0 }, LO = { row: 0, col: 1, t: 0, ask: false, askSel: 0, warn: 0 }, NO = { why: '', t: 0 };
      function wheelsOf(code) { for (var i = 0; i < 4; i++) JO.w[i] = Math.max(0, BT.CODEA.indexOf(code.charAt(i))); }
      function codeOfWheels() { var s = '', i; for (i = 0; i < 4; i++) s += BT.CODEA.charAt(JO.w[i]); return s; }
      BT.joinCode = codeOfWheels;
      function joinNow() { var c = codeOfWheels(); if (!BT.guestOpen(c)) { NO.why = 'start'; Q.go('bnote', { why: 'start' }); return; } Q.sfx('select'); }
      Q.defScene('bjoin', {
        enter: function (opts) {
          U.entered(); U.cancel(); U.clearToasts(); BT.padClear(); JO.t = 0; Q.music('map');
          if (opts && BT.codeOk(opts.code)) { wheelsOf(opts.code); JO.at = 3; if (opts.go) joinNow(); }
        },
        update: function (dt) {
          var k = BT.keys(), B = BT.BIT, G = BT.NG, n = BT.CODEA.length;
          JO.t += dt;
          if (G.on) {
            BT.guestPoll(dt);
            if (G.on && G.st === 'seat') { Q.sfx('learn'); Q.go('blobby'); return; }
            if (!G.on && G.why && G.why !== 'none') { Q.go('bnote', { why: G.why }); return; }
            if (G.on && k & B.b) { BT.guestClose(''); Q.sfx('back'); }
            return;
          }
          if (k & B.b) { Q.sfx('back'); Q.go('bsplash'); return; }
          if (k & B.left) { JO.at = (JO.at + 3) % 4; Q.sfx('move'); }
          if (k & B.right) { JO.at = (JO.at + 1) % 4; Q.sfx('move'); }
          if (k & B.up) { JO.w[JO.at] = (JO.w[JO.at] + 1) % n; Q.sfx('move'); G.why = ''; }
          if (k & B.down) { JO.w[JO.at] = (JO.w[JO.at] + n - 1) % n; Q.sfx('move'); G.why = ''; }
          if (k & (B.a | B.start)) joinNow();
        },
        draw: function (g) {
          var G = BT.NG, i, x, on, s, col, dots = '...'.slice(0, 1 + Math.floor(JO.t * 3) % 3), lines;
          BT.backdrop(g, JO.t); BT.head(g, 'JOIN A GAME');
          s = 'THE HOST\'S CODE'; U.text(s, 160 - (U.width(s) >> 1), 36, '#8f9ac8');
          for (i = 0; i < 4; i++) {
            x = 85 + i * 40; on = i === JO.at && !G.on;
            U.box(g, x, 52, 30, 38, on ? '#ffd23f' : '#3c4160', on ? '#24284a' : '#151a36');
            U.text(BT.CODEA.charAt(JO.w[i]), x + 8, 61, G.on ? '#f6efe2' : on ? '#ffd23f' : '#ffffff', 3);
            if (on && Math.floor(JO.t * 2.5) % 3) { U.arrow(g, x + 13, 46, '#ffd23f', true); U.arrow(g, x + 13, 93, '#ffd23f', false); }
          }
          if (G.on) {
            s = G.st === 'find' ? 'LOOKING FOR THE GAME' + dots : G.st === 'busy' ? BT.netWords.busy : 'FOUND IT. WAITING FOR THE HOST' + dots;
            col = G.st === 'busy' ? '#ffd23f' : '#f6efe2';
            if (G.trouble > 0) { s = BT.netWords.trouble; col = '#ff8a6a'; }
          } else { s = G.why ? BT.netWords[G.why] || '' : 'UP AND DOWN CHANGE A LETTER, A JOINS'; col = G.why ? '#ff8a6a' : '#6b7186'; }
          lines = Q.wrap(s, 46);
          for (i = 0; i < lines.length && i < 2; i++) U.text(lines[i], 160 - (U.width(lines[i]) >> 1), 108 + i * 10, col);
          on = !G.on; U.box(g, 112, 140, 96, 17, on ? '#ffd23f' : '#3c4160', on ? '#24284a' : '#151a36');
          s = G.on ? 'JOINING' + dots : 'JOIN >'; U.text(s, 160 - (U.width(s) >> 1), 145, on ? '#ffd23f' : '#c3c7d4');
          BT.foot(G.on ? 'B: STOP' : 'UP/DOWN: LETTER  LEFT/RIGHT: MOVE  A: JOIN  B: BACK');
          U.drawTalk(g);
        },
        leave: function () {},
        sides: BT.sides
      });
      BT.joinAt = function () { return { code: codeOfWheels(), at: JO.at, guest: BT.guestAt() }; };
      // ---------- the lobby: the host's own, or a guest's mirror of it ----------
      function host() { return BT.NH.on; }
      function slotsNow() {   // [{ on, w: 'you' | 'host' | 'net' | 'pad' | 'cpu' | 'off', col, name }] as this device sees them
        var l = [], i, s, H = BT.NH, G = BT.NG;
        if (host()) for (i = 0; i < 4; i++) { s = H.slots[i]; l.push({ on: s.on, w: i === 0 ? 'you' : !s.on ? 'off' : s.who === 'cpu' ? 'cpu' : s.peer ? 'net' : 'pad', col: s.col, name: s.name }); }
        else if (G.lob) for (i = 0; i < 4; i++) { s = G.lob.sl[i]; l.push({ on: s.on, w: i === G.you ? 'you' : s.w, col: s.col, name: s.name }); }
        return l;
      }
      var TAG = { you: 'YOU', host: 'HOST', net: 'FRIEND', pad: 'HERE', cpu: 'CPU', off: 'OFF' };
      function count() { var n = 0, l = slotsNow(), i; for (i = 0; i < l.length; i++) if (l[i].on) n++; return n; }
      function arenaStep(d) { var l = [], i, k; for (i = 0; i < BT.ARENAS.length; i++) l.push(BT.ARENAS[i].id); l.push('random'); k = l.indexOf(BT.S.arena); BT.S.arena = l[(Math.max(0, k) + d + l.length) % l.length]; BT.NH.dirty = true; Q.sfx('move'); }
      function hostPads() {   // a controller on the host's device: A takes a free slot as a player here, B gives it back to a CPU
        var H = BT.NH, n, i, p, mine, B = BT.BIT;
        if (!BT.padsOn()) return;
        for (n = 2; n <= 4; n++) {
          p = BT.keysBy[n]; if (!p) continue;
          mine = -1; for (i = 1; i < 4; i++) if (H.slots[i].on && H.slots[i].who === 'human' && !H.slots[i].peer && H.slots[i].pad === n) mine = i;
          if (p & B.a && mine < 0) { for (i = 1; i < 4 && mine < 0; i++) if (!(H.slots[i].on && H.slots[i].who === 'human')) mine = i; if (mine > 0) { H.slots[mine] = { on: true, who: 'human', pad: n, col: H.slots[mine].col, name: H.slots[mine].name, peer: '' }; BT.hostTidy(mine); H.dirty = true; Q.sfx('select'); } }
          else if (p & B.b && mine > 0) { H.slots[mine].who = 'cpu'; H.slots[mine].pad = 0; H.dirty = true; Q.sfx('back'); }
          else if (mine > 0 && p & (B.left | B.right)) { BT.hostRecolour(mine, p & B.left ? -1 : 1); H.dirty = true; Q.sfx('move'); }
        }
      }
      function hostUpdate(k) {
        var H = BT.NH, B = BT.BIT, s;
        hostPads();
        if (k & B.up) { LO.row = Math.max(0, LO.row - 1); Q.sfx('move'); }
        if (k & B.down) { LO.row = Math.min(4, LO.row + 1); Q.sfx('move'); }
        if (LO.row === 0 && k & (B.left | B.right)) { BT.hostRecolour(0, k & B.left ? -1 : 1); H.dirty = true; Q.sfx('move'); }
        if (LO.row === 0 && k & B.a) { H.slots[0].name = BT.hostNextName(0, H.slots[0].name, 1); H.dirty = true; Q.sfx('move'); }
        if (LO.row === 1 && k & (B.left | B.right)) { LO.col = 1 + (LO.col - 1 + (k & B.left ? 2 : 1)) % 3; Q.sfx('move'); }
        if (LO.row === 1 && k & B.a) {
          s = H.slots[LO.col];
          if (s.on && s.who === 'human') Q.sfx('nope');
          else { s.on = !s.on; s.who = 'cpu'; if (s.on) BT.hostTidy(LO.col); H.dirty = true; Q.sfx('move'); }
        }
        if (LO.row === 2 && k & B.a) { Q.sfx('select'); Q.go('brules', { back: 'blobby' }); return; }
        if (LO.row === 3 && k & (B.left | B.right)) arenaStep(k & B.left ? -1 : 1);
        if (LO.row === 3 && k & B.a) arenaStep(1);
        if ((LO.row === 4 && k & B.a) || k & B.start) {
          if (count() < 2) { Q.sfx('nope'); LO.warn = 1.6; return; }
          Q.sfx('select'); BT.hostStart(); Q.go('bfight');
        }
        if (k & B.c) { if (BT.netApi() && BT.netApi().share()) Q.sfx('select'); }
      }
      Q.defScene('blobby', {
        enter: function (opts) { U.entered(); U.cancel(); BT.padClear(); LO.t = 0; LO.ask = false; LO.warn = 0; if (opts && opts.row !== undefined) LO.row = opts.row; Q.music('map'); BT.NH.dirty = true; },
        update: function (dt) {
          var k = BT.keysDev(), B = BT.BIT, G = BT.NG;
          LO.t += dt; if (LO.warn > 0) LO.warn -= dt;
          if (host()) { BT.hostPoll(); if (!BT.NH.on) { Q.go('bnote', { why: BT.NH.why || 'start' }); return; } }
          else if (G.on) {
            BT.guestPoll(dt);
            if (!G.on) { Q.go('bnote', { why: G.why || 'host' }); return; }
            if (G.st === 'play') { Q.go('bfight'); return; }
          } else { Q.go('bsplash'); return; }
          if (LO.ask) {
            if (k & (B.left | B.right | B.up | B.down)) { LO.askSel = 1 - LO.askSel; Q.sfx('move'); }
            if (k & B.b) { LO.ask = false; Q.sfx('back'); }
            else if (k & (B.a | B.start)) { LO.ask = false; if (LO.askSel) { Q.sfx('back'); if (host()) BT.hostClose('closed'); else BT.guestClose(''); Q.go('bsplash'); } else Q.sfx('back'); }
            return;
          }
          if (k & B.b) { LO.ask = true; LO.askSel = 0; Q.sfx('select'); return; }
          if (host()) { hostUpdate(k); return; }
          if (k & (B.left | B.right)) { BT.guestPick(k & B.left ? -1 : 1, 0); Q.sfx('move'); }
          if (k & (B.up | B.down)) { BT.guestPick(0, k & B.up ? -1 : 1); Q.sfx('move'); }
        },
        draw: function (g) { BT.drawLobby(g, LO, slotsNow(), TAG, host()); U.drawTalk(g); },
        leave: function () {},
        sides: BT.sides
      });
      BT.lobbyAt = function () { return { row: LO.row, col: LO.col, ask: LO.ask, host: host(), slots: slotsNow().map(function (s) { return s.w; }), arena: host() ? BT.S.arena : BT.NG.lob && BT.NG.lob.ar }; };
      // ---------- a message, then back to the splash ----------
      Q.defScene('bnote', {
        enter: function (opts) { U.entered(); U.cancel(); BT.padClear(); NO.why = opts && opts.why || 'host'; NO.t = 0; Q.music('map'); },
        update: function (dt) { var k = BT.keys(), B = BT.BIT; NO.t += dt; if (NO.t > 0.4 && k & (B.a | B.b | B.start)) { Q.sfx('select'); Q.go('bsplash'); } },
        draw: function (g) {
          var lines = Q.wrap(BT.netWords[NO.why] || BT.netWords.host, 34), i, s;
          BT.backdrop(g, NO.t); BT.head(g, 'ONLINE');
          U.box(g, 40, 62, 240, 24 + lines.length * 11, '#ff8a6a', '#1d1d24');
          for (i = 0; i < lines.length; i++) U.text(lines[i], 160 - (U.width(lines[i]) >> 1), 74 + i * 11, '#ffffff');
          s = 'A: OK'; U.text(s, 160 - (U.width(s) >> 1), 150, Math.floor(NO.t * 2) % 2 ? '#ffd23f' : '#c3c7d4');
          BT.foot('A: BACK TO BATTLE'); U.drawTalk(g);
        },
        leave: function () {},
        sides: BT.sides
      });
      BT.noteAt = function () { return { why: NO.why }; };
    })();
