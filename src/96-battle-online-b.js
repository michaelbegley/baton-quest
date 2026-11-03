    // ---------- 96-battle-online-b.js: BATTLE MODE online, the fight ('bfight') and the lobby's picture (B18; ONLINE.md) ----------
    // The fight on either side: the host steps the match for everyone (BT.hostStep), a guest steps its own conductor and draws the rest (BT.guestStep). It
    // never stops for one player: START opens a small menu over it (RESUME, LEAVE, asking first) while his conductor stands. The host leaving, or closing the
    // game, takes every guest to a message; a guest leaving becomes a CPU. The match over: the results (96-battle-menus-c, with the online buttons).
    (function () {
      var U = Q.ui, NF = { menu: null, overT: 0, cue: '' };
      function role() { return BT.NH.on ? 'host' : BT.NG.on ? 'guest' : ''; }
      function cue(M) {   // the round's start, its READY and its GO, each heard once (as 96-battle-fight.js)
        var c = M.phase === 'ready' ? (M.phaseT < 1.1 ? 'round' : 'ready') + M.round : M.phase === 'fight' && M.roundT < 0.7 ? 'go' + M.round : '';
        if (c && c !== NF.cue) { NF.cue = c; Q.sfx(c.indexOf('round') === 0 ? 'card' : c.indexOf('ready') === 0 ? 'tick' : 'zap'); }
      }
      function leaveNow() { if (BT.NH.on) BT.hostClose('closed'); else BT.guestClose(''); Q.music('map'); Q.go('bsplash'); }
      function menuStep() {   // the device's own buttons only; the match goes on underneath
        var P = NF.menu, U2 = Q.ui;
        if (P.ask) {
          if (U2.press('left') || U2.press('right') || U2.press('up') || U2.press('down')) { P.askSel = 1 - P.askSel; Q.sfx('move'); }
          if (U2.press('b')) { P.ask = false; Q.sfx('back'); return; }
          if (U2.press('a') || U2.press('start')) { P.ask = false; if (P.askSel) { Q.sfx('select'); leaveNow(); } else Q.sfx('back'); }
          return;
        }
        if (U2.press('up') || U2.press('down')) { P.sel = 1 - P.sel; Q.sfx('move'); }
        if (U2.press('b') || U2.press('start')) { NF.menu = null; Q.sfx('back'); return; }
        if (U2.press('a')) { if (P.sel === 0) { NF.menu = null; Q.sfx('back'); } else { P.ask = true; P.askSel = 0; Q.sfx('select'); } }
      }
      Q.defScene('bfight', {
        wide: true,
        enter: function () {
          var M = BT.NH.on ? BT.NH.M : BT.NG.M;
          U.entered(); U.cancel(); U.clearToasts(); BT.padClear(); NF.menu = null; NF.overT = 0; NF.cue = ''; NF.M = M; BT.fxClear();
          if (M) Q.music(BT.arenaDef(M.arena).music || 'boss');
        },
        update: function (dt) {
          var r = role(), M, G = BT.NG;
          if (r === 'host') { BT.hostPoll(); if (!BT.NH.on) { Q.go('bnote', { why: BT.NH.why || 'start' }); return; } M = BT.NH.M; }
          else if (r === 'guest') {
            BT.guestPoll(dt);
            if (!G.on) { Q.go('bnote', { why: G.why || 'host' }); return; }
            if (G.st === 'seat') { Q.go('blobby'); return; }
            M = G.M;
          } else { Q.go('bnote', { why: BT.NH.why || G.why || 'host' }); return; }
          if (!M) return;
          if (M !== NF.M) { NF.M = M; NF.overT = 0; NF.cue = ''; BT.fxClear(); Q.music(BT.arenaDef(M.arena).music || 'boss'); }   // a rematch: a new match in this scene
          BT.fxStep(dt);
          if (NF.menu) menuStep(); else if (Q.ui.press('start') && M.phase !== 'over') { NF.menu = { sel: 0, ask: false, askSel: 0 }; Q.sfx('select'); }
          if (Q.scene !== 'bfight') return;
          if (r === 'host') BT.hostStep(M, dt, !!NF.menu); else BT.guestStep(M, dt, !!NF.menu);
          BT.present(M); cue(M);
          if (M.phase === 'over') {
            NF.overT += dt;
            if (NF.overT > 2.4) { if (r === 'host') BT.hostResults(); else BT.guestResults(); Q.go('bresults', { M: M, online: r }); }
          }
        },
        draw: function (g) {
          var M = BT.NH.on ? BT.NH.M : BT.NG.M;
          if (!M) { g.fillStyle = '#0b0c10'; g.fillRect(0, 0, Q.W, 200); return; }
          BT.drawFight(g, M, Q.t); BT.drawHud(g, M, Q.t); BT.drawWords(g, M);
          if (NF.menu) Q.col(g, drawMenu);
          BT.padLatch();
          U.drawTalk(g);
        },
        leave: function () { BT.fxClear(); }
      });
      function drawMenu(g) {
        var P = NF.menu, i, s = BT.NH.on ? 'CLOSE THE GAME FOR EVERYONE?' : 'LEAVE THIS GAME?', MENU = ['RESUME', BT.NH.on ? 'CLOSE GAME' : 'LEAVE'];
        U.box(g, 96, 52, 128, 82, '#ffd23f', '#1d1d24');
        U.text('ONLINE', 160 - (U.width('ONLINE', 2) >> 1), 60, '#ffffff', 2);
        U.text('THE MATCH GOES ON', 160 - (U.width('THE MATCH GOES ON') >> 1), 78, '#8f9ac8');
        for (i = 0; i < MENU.length; i++) U.item(MENU[i], 160, 94 + i * 16, i === P.sel && !P.ask, false, 'center');
        if (P.ask) {
          U.box(g, 60, 80, 200, 48, '#ff8a6a', '#1d1d24');
          U.text(s, 160 - (U.width(s) >> 1), 90, '#ffffff');
          U.item('NO', 128, 108, P.askSel === 0, false, 'center'); U.item('YES', 192, 108, P.askSel === 1, false, 'center');
        }
      }
      BT.onlineAt = function () { var M = BT.NH.on ? BT.NH.M : BT.NG.M; return { role: role(), menu: NF.menu ? { sel: NF.menu.sel, ask: NF.menu.ask } : null, phase: M ? M.phase : '', round: M ? M.round : 0, wins: M ? M.wins.slice() : [], n: M ? M.cs.length : 0 }; };
      // ---------- the lobby's picture ----------
      BT.drawLobby = function (g, LO, sl, TAG, isHost) {
        var code = BT.NH.on ? BT.NH.code : BT.NG.code, i, s, x, cx, col, on, f, r, txt, sel, G = BT.NG, ru, ar, y;
        BT.backdrop(g, LO.t); BT.head(g, 'ONLINE GAME');
        U.text('CODE', 72, 36, '#8f9ac8');   // B22: the word and six boxes centred on the screen (four were from 110, the word at 74)
        for (i = 0; i < BT.CODEN; i++) { x = 108 + i * 24; U.box(g, x, 29, 20, 21, '#ffd23f', '#24284a'); U.text(code.charAt(i), x + 5, 33, '#ffd23f', 2); }
        s = isHost ? (BT.NH.trouble > 0 ? BT.netWords.trouble : 'C: SHARE THE LINK') : 'YOU ARE IN. THE HOST STARTS THE MATCH.';
        U.text(s, 160 - (U.width(s) >> 1), 54, BT.NH.trouble > 0 && isHost ? '#ff8a6a' : '#8f9ac8');
        for (i = 0; i < 4; i++) {
          s = sl[i] || { on: false, w: 'off', col: i, name: i }; x = 8 + i * 77; cx = x + 36; col = BT.COLS[s.col] || BT.COLS[0];
          sel = isHost && ((LO.row === 0 && i === 0) || (LO.row === 1 && i === LO.col)) || (!isHost && s.w === 'you');
          U.box(g, x, 64, 72, 62, sel ? '#ffd23f' : s.on ? col.main : '#3c4160', s.on ? '#1a1e38' : '#12152a');
          U.text(String(i + 1), x + 5, 68, s.on ? col.light : '#5d6378');
          if (s.on) { f = s.w === 'cpu' ? Math.floor(LO.t * 1.6 + i) % 2 : Math.floor(LO.t * 6) % 4 === 0 && s.w === 'you' ? 17 : Math.floor(LO.t * 1.6) % 2; U.sprite(g, BT.spr(s.col), f, cx - 16, 66, 2, i >= 2); }
          else { g.globalAlpha = 0.25; U.sprite(g, BT.spr(s.col), 0, cx - 16, 66, 2, i >= 2); g.globalAlpha = 1; }
          txt = TAG[s.w] || 'CPU'; U.text(txt, cx - (U.width(txt) >> 1), 106, s.w === 'you' ? '#ffd23f' : s.on ? '#ffffff' : '#5d6378');
          if (s.on) { txt = BT.NAMES[s.name] || '?'; g.fillStyle = col.main; g.fillRect(x + 6, 117, 5, 5); U.text(txt, cx - (U.width(txt) >> 1) + 3, 116, '#c3c7d4'); }
        }
        ru = isHost ? BT.S.rules : G.lob ? G.lob.ru : BT.S.rules; ar = isHost ? BT.S.arena : G.lob ? G.lob.ar : 'random';
        r = 'RULES: BEST OF ' + ru.rounds + '  ' + ru.hearts + ' HEARTS  ITEMS ' + (ru.items ? 'ON' : 'OFF') + '  CPU ' + BT.CPU[ru.cpu];
        on = isHost && LO.row === 2; U.box(g, 8, 131, 304, 15, on ? '#ffd23f' : '#3c4160', '#151a36'); U.text(r, 160 - (U.width(r) >> 1), 135, on ? '#ffd23f' : '#c3c7d4');
        s = 'ARENA: ' + (ar === 'random' ? 'RANDOM' : BT.arenaDef(ar).name); if (isHost && LO.row === 3) s = '< ' + s + ' >';
        on = isHost && LO.row === 3; U.box(g, 8, 149, 304, 15, on ? '#ffd23f' : '#3c4160', '#151a36'); U.text(s, 160 - (U.width(s) >> 1), 153, on ? '#ffd23f' : '#c3c7d4');
        if (isHost) {
          on = LO.row === 4; U.box(g, 96, 167, 128, 16, on ? '#ffd23f' : '#3c4160', on ? '#24284a' : '#151a36');
          s = 'START THE MATCH >'; U.text(s, 160 - (U.width(s) >> 1), 172, on ? '#ffd23f' : '#f6efe2');
        } else if (Math.floor(LO.t * 2) % 2) { s = 'WAITING FOR THE HOST'; U.text(s, 160 - (U.width(s) >> 1), 172, '#ffd23f'); }
        y = 0;
        if (LO.warn > 0) s = 'TWO CONDUCTORS AT LEAST';
        else if (isHost && LO.rm >= 0) s = 'LEFT/RIGHT: NO OR YES  A: CHOOSE  B: NO';   // B22: the REMOVE question is up
        else if (isHost) s = LO.row === 0 ? 'LEFT/RIGHT: YOUR COLOUR  A: YOUR NAME  B: CLOSE' : LO.row === 1 ? (sl[LO.col] && sl[LO.col].w === 'net' ? 'LEFT/RIGHT: A SLOT  A: REMOVE  B: CLOSE' : 'LEFT/RIGHT: A SLOT  A: CPU OR OFF  B: CLOSE') : 'FRIENDS JOIN WITH THE CODE   B: CLOSE';
        else s = 'LEFT/RIGHT: COLOUR  UP/DOWN: NAME  B: LEAVE';
        BT.foot(s);
        if (LO.ask) {
          s = isHost ? 'CLOSE THIS GAME?' : 'LEAVE THIS GAME?';
          U.box(g, 60, 76, 200, 48, '#ff8a6a', '#1d1d24'); U.text(s, 160 - (U.width(s) >> 1), 86, '#ffffff');
          U.item('NO', 128, 104, LO.askSel === 0, false, 'center'); U.item('YES', 192, 104, LO.askSel === 1, false, 'center');
        }
      };
      BT.drawRemove = function (g, LO) {   // B22: REMOVE <NAME>? over the host's lobby, in the menu kit's look (B20's U.mk.ask): NO first, YES on a red bar
        var s = BT.NH.slots[LO.rm], nm = s ? BT.NAMES[s.name] || '?' : '?';
        U.mk.ask(g, 'blobby-rm', 'REMOVE', ['REMOVE ' + nm + ' FROM THIS GAME?', nm + ' IS TURNED AWAY IF THEY TRY AGAIN.'], ['NO', 'YES'], LO.rmSel, { danger: true });
      };
    })();
