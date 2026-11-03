    // ---------- 96-battle-menus-c.js: BATTLE MODE's arena select ('barena') and results ('bresults') (B16; BATTLE.md) ----------
    // Arena select: the four arenas (one a world) and RANDOM, each shown as a picture of the arena itself; left and right choose, A fights, B: the players.
    // Results: the winner cheering, each conductor's rounds won, knock-offs, falls and hits; REMATCH (the same players and arena), NEW ARENA, BACK (the players).
    (function () {
      var U = Q.ui, AR = { sel: 0, t: 0 }, prev = {};
      function choices() { var l = [], i; for (i = 0; i < BT.ARENAS.length; i++) l.push(BT.ARENAS[i].id); l.push('random'); return l; }
      function preview(id) {   // the arena drawn once at full size (its background at its first moment, its tiles), shown at half size
        var cv = prev[id], c;
        if (cv) return cv;
        cv = prev[id] = Q.canvas(320, 208); c = cv.getContext('2d');
        BT.at320(function () { try { BT.drawArena(c, BT.arenaOf(id), 0, 0, 0); } catch (er) { BT.err('arena picture ' + id, er); } });   // as a 320 screen draws it
        return cv;
      }
      Q.defScene('barena', {
        enter: function () {
          var l = choices(), i;
          U.entered(); BT.padClear(); AR.t = 0;
          AR.sel = Math.max(0, l.indexOf(BT.S.arena));
          for (i = 0; i < BT.ARENAS.length; i++) preview(BT.ARENAS[i].id);   // before this scene's first picture: a background may write on the screen itself
        },
        update: function (dt) {
          var k = BT.keys(), B = BT.BIT, l = choices();
          AR.t += dt;
          if (k & B.left) { AR.sel = (AR.sel + l.length - 1) % l.length; Q.sfx('move'); }
          if (k & B.right) { AR.sel = (AR.sel + 1) % l.length; Q.sfx('move'); }
          BT.S.arena = l[AR.sel];
          if (k & B.b) { Q.sfx('back'); Q.go('bplayers'); return; }
          if (k & (B.a | B.start)) { Q.sfx('select'); Q.go('battle', { setup: BT.setupNow() }); }
        },
        draw: function (g) {
          var l = choices(), id = l[AR.sel], d = id === 'random' ? null : BT.arenaDef(id), i, x, s, on;
          BT.backdrop(g, AR.t); BT.head(g, 'ARENA');
          U.box(g, 76, 30, 168, 112, '#ffd23f', '#0b0c10');
          if (d) g.drawImage(preview(id), 0, 0, 320, 208, 80, 34, 160, 104);
          else { U.fill(g, 80, 34, 160, 104, '#151a36'); BT.big('?', 66, '#ffd23f', 5); for (i = 0; i < 4; i++) g.drawImage(preview(BT.ARENAS[i].id), 0, 0, 320, 208, 84 + i * 38, 112, 34, 22); }
          if (Math.floor(AR.t * 2.5) % 3) { U.text('<', 62, 82, '#ffd23f', 2); U.text('>', 248, 82, '#ffd23f', 2); }
          s = d ? d.name : 'RANDOM'; BT.big(s, 148, '#ffffff', 2);
          s = d ? d.place + ', WORLD ' + d.world : 'ANY OF THE FOUR'; U.text(s, 160 - (U.width(s) >> 1), 166, '#8f9ac8');
          for (i = 0; i < l.length; i++) { x = 160 - l.length * 6 + i * 12; on = i === AR.sel; U.fill(g, x, 177, 8, 4, on ? '#ffd23f' : '#3c4160'); }
          BT.foot('LEFT AND RIGHT: CHOOSE   A: FIGHT   B: BACK');
          U.drawTalk(g);
        },
        leave: function () {},
        sides: BT.sides
      });
      BT.arenaAt = function () { var l = choices(); return { sel: AR.sel, id: l[AR.sel], list: l }; };
      // ---------- the results ----------
      var RE = { M: null, setup: null, sel: 0, t: 0, order: [], online: '' }, BTN = ['REMATCH', 'NEW ARENA', 'BACK'];
      function leave(what) {
        var st;
        Q.sfx(what === 'BACK' ? 'back' : 'select');
        if (RE.online === 'host') {   // online (B18): the host's choice is everyone's
          if (what === 'REMATCH') { if (RE.M) BT.S.arena = RE.M.arena; BT.hostStart(); Q.go('bfight'); }
          else { BT.hostLobby(); Q.go('blobby', { row: what === 'NEW ARENA' ? 3 : 4 }); }
          return;
        }
        if (RE.online === 'guest') { BT.guestClose(''); Q.music('map'); Q.go('bsplash'); return; }
        if (what === 'REMATCH') { st = BT.setupNow(); st.arena = RE.setup ? RE.setup.arena : st.arena; st.slots = RE.setup ? RE.setup.slots : st.slots; Q.go('battle', { setup: st }); }
        else if (what === 'NEW ARENA') { Q.music('map'); Q.go('barena'); }
        else { Q.music('map'); Q.go('bplayers'); }
      }
      Q.defScene('bresults', {
        enter: function (opts) {
          var M = opts && opts.M, i;
          U.entered(); BT.padClear(); RE.t = 0; RE.sel = 0; RE.M = M || null; RE.setup = opts && opts.setup || null; RE.order = []; RE.online = opts && (opts.online === 'host' || opts.online === 'guest') ? opts.online : '';
          if (M) { for (i = 0; i < M.cs.length; i++) RE.order.push(M.cs[i]); RE.order.sort(function (a, b) { return M.wins[b.i] - M.wins[a.i] || M.stats[b.i].kos - M.stats[a.i].kos || a.i - b.i; }); }
          Q.music('rescue');
        },
        update: function (dt) {
          var k = BT.keys(), B = BT.BIT, G = BT.NG;
          RE.t += dt;
          if (RE.t > 0.6 && Math.floor(RE.t / 1.4) !== Math.floor((RE.t - dt) / 1.4) && RE.M && RE.M.winner >= 0) BT.fx('confetti', 48, 40, '#ffd23f', 24);
          BT.fxStep(dt);
          if (RE.online === 'host') { BT.hostPoll(); if (!BT.NH.on) { Q.go('bnote', { why: BT.NH.why || 'start' }); return; } }
          if (RE.online === 'guest') {   // a guest waits for the host: a rematch, the lobby, or the game closed
            BT.guestPoll(dt);
            if (!G.on) { Q.go('bnote', { why: G.why || 'host' }); return; }
            if (G.st === 'play' && G.M && G.M !== RE.M) { Q.go('bfight'); return; }
            if (G.st === 'seat') { Q.go('blobby'); return; }
            if (k & B.b) leave('LEAVE');
            return;
          }
          if (k & B.left) { RE.sel = (RE.sel + BTN.length - 1) % BTN.length; Q.sfx('move'); }
          if (k & B.right) { RE.sel = (RE.sel + 1) % BTN.length; Q.sfx('move'); }
          if (k & B.b) { leave('BACK'); return; }
          if (k & (B.a | B.start)) leave(BTN[RE.sel]);
        },
        draw: function (g) {
          var M = RE.M, w = M && M.winner >= 0 ? BT.cOf(M, M.winner) : null, col = w ? BT.COLS[w.col] : null, i, c, y, s, x, cl;
          BT.backdrop(g, RE.t);
          BT.big(w ? BT.NAMES[w.name] + ' WINS!' : 'NO WINNER', 8, col ? col.light : '#f6efe2', 2);
          if (w) { U.fill(g, 14, 104, 72, 4, '#7a4a2a'); U.sprite(g, BT.spr(w.col), Math.floor(RE.t * 3) % 2 ? 17 : 0, 26, 44, 3); }
          x = 96; cl = [['WINS', 110], ['KOS', 138], ['FALLS', 168], ['HITS', 201]]; for (i = 0; i < cl.length; i++) U.text(cl[i][0], x + cl[i][1] - (U.width(cl[i][0]) >> 1), 32, '#8f9ac8');
          for (i = 0; M && i < RE.order.length; i++) {
            c = RE.order[i]; y = 46 + i * 20; cl = BT.COLS[c.col] || BT.COLS[0];
            U.box(g, x, y - 4, 218, 17, i === 0 && w ? '#ffd23f' : '#3c4160', '#151a36');
            g.fillStyle = cl.main; g.fillRect(x + 4, y, 6, 8);
            U.text(BT.tagOf(c) + ' ' + BT.NAMES[c.name], x + 14, y + 1, cl.light);
            s = M.stats[c.i];
            U.text(String(M.wins[c.i]), x + 110 - (U.width(String(M.wins[c.i])) >> 1), y + 1, '#ffd23f'); U.text(String(s.kos), x + 138 - (U.width(String(s.kos)) >> 1), y + 1, '#f6efe2'); U.text(String(s.falls), x + 168 - (U.width(String(s.falls)) >> 1), y + 1, '#f6efe2'); U.text(String(s.hits), x + 201 - (U.width(String(s.hits)) >> 1), y + 1, '#f6efe2');
          }
          if (M) { s = BT.arenaDef(M.arena).name + '   ' + M.rounds.length + (M.rounds.length === 1 ? ' ROUND' : ' ROUNDS'); U.text(s, 160 - (U.width(s) >> 1), 132, '#6b7186'); }
          if (RE.online === 'guest') { if (Math.floor(RE.t * 2) % 2) { s = 'WAITING FOR THE HOST'; U.text(s, 160 - (U.width(s) >> 1), 152, '#ffd23f'); } }
          else for (i = 0; i < BTN.length; i++) U.item(BTN[i], 70 + i * 90, 152, i === RE.sel, false, 'center');
          BT.drawFxOnly(g);
          BT.foot(RE.online === 'guest' ? 'THE HOST CHOOSES WHAT IS NEXT   B: LEAVE' : RE.online === 'host' ? 'LEFT AND RIGHT: CHOOSE   A: GO (FOR EVERYONE)' : 'LEFT AND RIGHT: CHOOSE   A: GO   B: BACK');
          U.drawTalk(g);
        },
        leave: function () { BT.fxClear(); },
        sides: BT.sides
      });
      BT.resultsAt = function () { var M = RE.M; return M ? { sel: RE.sel, winner: M.winner, wins: M.wins.slice(), rounds: M.rounds.slice(), order: RE.order.map(function (c) { return c.i; }) } : null; };
    })();
