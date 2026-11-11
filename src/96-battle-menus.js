    // ---------- 96-battle-menus.js: GAME MODES and BATTLE MODE's splash card (B16; BATTLE.md) ----------
    // 'modes' (GAME MODES): BATTLE, HIGH SCORE and SPEED RUN (version 125, B27: all three live; a mode not in yet wears a light red COMING SOON ribbon whose
    // ends fold behind the button, and A on it plays 'nope'); A opens a mode's own screen; B: the title. Its own scene, so a main menu can open it with Q.go('modes').
    // 'bsplash': the card when battle starts; A, START or a short wait: the players; B: GAME MODES. BT.S, the battle's setup, is kept only while the game
    // is open (never in the save: BATTLE MODE writes nothing the adventure keeps).
    BT.S = { slots: [{ on: true, who: 'human', pad: 1, col: 0, name: 0 }, { on: true, who: 'cpu', pad: 2, col: 1, name: 1 }, { on: true, who: 'cpu', pad: 3, col: 2, name: 2 }, { on: true, who: 'cpu', pad: 4, col: 3, name: 3 }],
      arena: 'random', rules: BT.copy(BT.RULES0), seed: 0 };
    BT.setupNow = function () {   // the setup for a new match: the slots as they stand, RANDOM made an arena, a new seed
      var S = BT.S, slots = [], i, a = S.arena;
      for (i = 0; i < 4; i++) slots.push(BT.copy(S.slots[i]));
      if (a === 'random') a = BT.ARENAS[Math.floor(Math.random() * BT.ARENAS.length) % BT.ARENAS.length].id;
      S.seed = ((S.seed || Math.floor(Math.random() * 4294967295)) * 1103515245 + 12345) >>> 0 || 1;
      return { slots: slots, arena: a, rules: BT.copy(S.rules), seed: S.seed };
    };
    BT.SKY = Q.ui.grad('#0b1030', '#26346a', 25);
    BT.backdrop = function (g, t) {   // the battle menus' own night sky, with a slow shimmer of stars
      var i, x, y;
      Q.ui.bands(g, BT.SKY, 0, 8);
      for (i = 0; i < 40; i++) { x = (i * 83 + 17) % 320; y = (i * 47 + 11) % 170; g.fillStyle = Math.sin(t * 2 + i) > 0.6 ? '#ffffff' : '#56609a'; g.fillRect(x, y, 1, 1); }
    };
    BT.sstars = null;
    BT.sides = function (g, Qx) {   // a battle menu's sides on a wide screen (the engine clips to them): the same night sky, stars of their own, the footer band
      var i, d, t = Q.t, W = Q.W, r;
      if (!BT.sstars) { r = Q.api && Q.api.rand ? Q.api.rand(41) : Math.random; BT.sstars = []; for (i = 0; i < 90; i++) BT.sstars.push({ x: Math.floor(r() * Q.WMAX), y: Math.floor(r() * 170), ph: r() * 6.28 }); }
      Q.ui.bands(g, BT.SKY, 0, 8, W);
      for (i = 0; i < BT.sstars.length; i++) { d = BT.sstars[i]; if (d.x >= W) continue; g.fillStyle = Math.sin(t * 2 + d.ph) > 0.6 ? '#ffffff' : '#56609a'; g.fillRect(d.x, d.y, 1, 1); }
      Q.ui.fill(g, 0, 186, W, 14, BT.footCol || '#10173a');
    };
    BT.head = function (g, s) { var U = Q.ui; BT.big(s, 8, '#ffffff', 2); g.fillStyle = '#ffd23f'; g.fillRect(160 - (U.width(s, 2) >> 1), 25, U.width(s, 2), 1); };
    BT.foot = function (s) { var U = Q.ui; BT.footCol = '#10173a'; U.fill(Q.g, 0, 186, 320, 14, '#10173a'); U.text(s, 160 - (U.width(s) >> 1), 190, '#8f9ac8'); };
    BT.ribbon = function (g, x, y, w, h, wig) {   // COMING SOON's back: the ribbon's two tails behind the button, darker red, each cut like a swallowtail
      var by = y + h - 16 + (wig || 0), r, cut;
      g.fillStyle = '#a5383b';
      for (r = 0; r < 10; r++) { cut = r >= 3 && r <= 6 ? 2 : 0; g.fillRect(x - 7 + cut, by + 3 + r, 9 - cut, 1); g.fillRect(x + w - 2, by + 3 + r, 9 - cut, 1); }
    };
    BT.ribbonFront = function (g, x, y, w, h, wig) {
      var U = Q.ui, by = y + h - 16 + (wig || 0), s = 'COMING SOON', sx;
      g.fillStyle = '#7d2629'; g.fillRect(x, by + 1, 3, 13); g.fillRect(x + w - 3, by + 1, 3, 13);   // where it folds round the edge: darker
      g.fillStyle = '#f27f7f'; g.fillRect(x + 3, by, w - 6, 12);
      g.fillStyle = '#ffb3b0'; g.fillRect(x + 3, by, w - 6, 1);
      g.fillStyle = '#d65c5e'; g.fillRect(x + 3, by + 11, w - 6, 1);
      sx = x + (w >> 1) - (U.width(s) >> 1);
      U.text(s, sx + 1, by + 3, '#a5383b'); U.text(s, sx, by + 2, '#ffffff');
    };
    (function () {
      var U = Q.ui, MO = { sel: 0, t: 0, soon: 0, soonAt: -1 };
      var MODES = [   // each mode's own screen (go); version 125 (B27): HIGH SCORE and SPEED RUN are in (97-modes-score.js, 97-modes-speed.js)
        { id: 'battle', name: 'BATTLE', line: 'UP TO 4 CONDUCTORS, ONE ARENA', live: true, go: 'bsplash' },
        { id: 'score', name: 'HIGH SCORE', line: 'POINTS AND COMBOS: A TOP 5', live: true, go: 'hscore' },   // each line 30 letters at most (182 px in its box)
        { id: 'speed', name: 'SPEED RUN', line: 'A WORLD OR ALL 16 ON ONE CLOCK', live: true, go: 'srun' }
      ];
      var BX = 46, BW = 228, BH = 40, BY = [36, 84, 132];
      function icon(g, id, x, y, t) {
        if (id === 'battle') { Q.spr(g, BT.spr(0), Math.floor(t * 3) % 2 ? 8 : 0, x - 2, y + 4); Q.spr(g, BT.spr(2), Math.floor(t * 3 + 1) % 2 ? 8 : 0, x + 12, y + 4, true); }
        else if (id === 'score') U.sprite(g, Q.SPRITE['u5-star'] ? 'u5-star' : 'ic-star', 0, x + 2, y + 2, 2);
        else U.sprite(g, Q.SPRITE['u5-clock'] ? 'u5-clock' : 'ic-clock', 0, x + 2, y + 2, 3);
      }
      Q.defScene('modes', {
        enter: function () { U.entered(); U.cancel(); U.clearToasts(); BT.padClear(); MO.t = 0; MO.soon = 0; Q.music('title'); },
        update: function (dt) {
          var k = BT.keys(), B = BT.BIT;
          MO.t += dt; if (MO.soon > 0) MO.soon -= dt;
          if (k & B.up) { MO.sel = (MO.sel + MODES.length - 1) % MODES.length; Q.sfx('move'); }
          if (k & B.down) { MO.sel = (MO.sel + 1) % MODES.length; Q.sfx('move'); }
          if (k & B.b) { Q.sfx('back'); Q.go('title'); return; }
          if (k & (B.a | B.start)) {
            if (MODES[MO.sel].live) { Q.sfx('select'); Q.go(MODES[MO.sel].go || 'bsplash'); }
            else { Q.sfx('nope'); MO.soon = 1.4; MO.soonAt = MO.sel; }   // not yet: nothing starts
          }
        },
        draw: function (g) {
          var i, m, x = BX, y, on, wig;
          BT.backdrop(g, MO.t); BT.head(g, 'GAME MODES');
          for (i = 0; i < MODES.length; i++) {
            m = MODES[i]; y = BY[i]; on = i === MO.sel; wig = MO.soon > 0 && MO.soonAt === i ? (Math.floor(MO.t * 30) % 2 ? 1 : -1) : 0;
            if (!m.live) BT.ribbon(g, x, y, BW, BH, wig);
            U.box(g, x, y, BW, BH, on ? '#ffd23f' : '#5d6378', on ? '#24284a' : '#1d1d24');
            U.box(g, x + 5, y + 5, 30, 30, on ? '#ffd23f' : '#3c4160', '#0f1226');
            icon(g, m.id, x + 7, y + 7, MO.t);
            U.text(m.name, x + 42, y + 7, m.live ? (on ? '#ffd23f' : '#ffffff') : '#c3c7d4', 2);
            if (m.live) U.text(m.line, x + 42, y + 27, '#8f9ac8');
            if (!m.live) BT.ribbonFront(g, x, y, BW, BH, wig);
            if (on && Math.floor(MO.t * 2.5) % 3) U.text('>', x - 10, y + 16, '#ffd23f');
          }
          if (MO.soon > 0) {   // A on a mode that is not here yet: the footer says so, in the ribbon's red
            BT.footCol = '#7d2629'; U.fill(g, 0, 186, 320, 14, '#7d2629'); U.text(MODES[MO.soonAt].name + ': COMING SOON', 160 - (U.width(MODES[MO.soonAt].name + ': COMING SOON') >> 1), 190, '#ffffff');
          } else BT.foot('UP AND DOWN: CHOOSE   A: PLAY   B: BACK');
          U.drawTalk(g);
        },
        leave: function () {},
        sides: BT.sides
      });
      BT.modesAt = function () { return { sel: MO.sel, id: MODES[MO.sel].id, soon: MO.soon > 0, soonAt: MO.soonAt, modes: MODES.map(function (m) { return m.id + (m.live ? '' : ':soon'); }) }; };
      BT.splashAt = function () { return { sel: SP.sel, ways: SP.net ? WAYS.slice() : ['PLAY HERE'], t: Math.round(SP.t * 10) / 10 }; };   // B18, for checks
      var SP = { t: 0, sel: 0, net: false }, WAYS = ['PLAY HERE', 'HOST ONLINE', 'JOIN ONLINE'];   // B18: the last two only where the page offers online play
      function spGo() {
        var code;
        Q.sfx('select');
        if (SP.sel === 1) { code = BT.hostOpen(); if (code) Q.go('blobby', { row: 4 }); else Q.go('bnote', { why: 'start' }); }
        else if (SP.sel === 2) Q.go('bjoin');
        else Q.go('bplayers');
      }
      Q.defScene('bsplash', {
        enter: function () { U.entered(); BT.padClear(); SP.t = 0; SP.sel = 0; SP.net = !!(BT.netOk && BT.netOk()); Q.music('map'); },
        update: function (dt) {
          var k = BT.keys(), B = BT.BIT;
          SP.t += dt;
          if (k & B.b) { Q.sfx('back'); Q.go('modes'); return; }
          if (SP.net && k & (B.left | B.right)) { SP.sel = (SP.sel + (k & B.left ? 2 : 1)) % 3; Q.sfx('move'); }
          if (k & (B.a | B.start) || (!SP.net && SP.t > 3.2)) spGo();   // with online play to choose from, it waits for a choice
        },
        draw: function (g) {
          var i, x, t = SP.t, f, s;
          BT.backdrop(g, t);
          for (i = 0; i < 6; i++) { g.fillStyle = 'rgba(255,226,150,' + (0.025 + i * 0.012).toFixed(3) + ')'; g.fillRect(60 - i * 6, 96 + i * 9, 200 + i * 12, 54 - i * 9); }   // a soft beam onto the stage
          g.fillStyle = '#1d1d24'; g.fillRect(30, 150, 260, 3); g.fillStyle = '#7a4a2a'; g.fillRect(30, 153, 260, 10); g.fillStyle = '#a86f43'; g.fillRect(30, 153, 260, 2);
          for (i = 0; i < 4; i++) {   // the four conductors, each swinging in turn
            x = 58 + i * 56; f = Math.floor(t * 4) % 4 === i ? 8 + Math.floor(t * 8) % 2 : Math.floor(t * 1.6 + i) % 2;
            U.sprite(g, BT.spr(i), f, x, 110, 2, i >= 2);
          }
          BT.big('BATTLE', 30 + Math.round(Math.sin(t * 2) * 1.5), '#ff8a1e', 5);
          s = 'UP TO FOUR CONDUCTORS. LAST ONE STANDING.'; U.text(s, 160 - (U.width(s) >> 1), 80, '#f6efe2');
          if (SP.net) { for (i = 0; i < 3; i++) U.item(WAYS[i], 58 + i * 102, 170, i === SP.sel, false, 'center'); BT.foot('LEFT AND RIGHT: CHOOSE   A: GO   B: BACK'); }
          else { if (Math.floor(t * 2) % 2) { s = 'PRESS A'; U.text(s, 160 - (U.width(s) >> 1), 172, '#ffd23f'); } BT.foot('A: ON   B: BACK'); }
          U.drawTalk(g);
        },
        leave: function () {},
        sides: BT.sides
      });
    })();
