    // ---------- 96-battle-menus-b.js: BATTLE MODE's player select ('bplayers') and rules ('brules') (B16; BATTLE.md) ----------
    // Player select: four slots, each WHO (slot 1: PLAYER or CPU; slots 2 to 4: CPU, PLAYER n on controller n, or OFF), COLOUR (never two alike), NAME (our
    // own list, never two alike). The device's arrows move round the grid and A changes a cell; a second controller's A joins its own slot as a player (its
    // left and right change its colour, up and down its name, B gives the slot back to a CPU). RULES above, NEXT below (two conductors at least). B: GAME MODES.
    (function () {
      var U = Q.ui, PL = { row: 1, col: 0, t: 0, warn: 0 }, ROWS = 5;
      function on(i) { return BT.S.slots[i].on; }
      function count() { var n = 0, i; for (i = 0; i < 4; i++) if (on(i)) n++; return n; }
      function free(i, key, from, step, n) {   // the next value of a slot's key that no other slot on has
        var v = from, k, j, used;
        for (k = 0; k < n; k++) {
          v = (v + step + n) % n; used = false;
          for (j = 0; j < 4; j++) if (j !== i && on(j) && BT.S.slots[j][key] === v) used = true;
          if (!used) return v;
        }
        return from;
      }
      function recolour(i, step) {   // the next colour; when all four are taken, it swaps with the slot that has that colour
        var s = BT.S.slots[i], want = (s.col + step + 4) % 4, j, v = free(i, 'col', s.col, step, 4);
        if (v !== s.col) { s.col = v; return; }
        for (j = 0; j < 4; j++) if (j !== i && on(j) && BT.S.slots[j].col === want) { BT.S.slots[j].col = s.col; s.col = want; return; }
      }
      function tidy(i) { var s = BT.S.slots[i]; s.col = free(i, 'col', s.col, 0, 4); s.name = free(i, 'name', s.name, 0, BT.NAMES.length); }   // a slot just turned on keeps clear of the others
      BT.whoText = function (i) { var s = BT.S.slots[i]; return !s.on ? 'OFF' : s.who === 'cpu' ? 'CPU' : 'PLAYER ' + (i + 1); };
      BT.setWho = function (i, who) {   // for the menus and for checks: 'human', 'cpu' or 'off'
        var s = BT.S.slots[i];
        if (who === 'off') { if (i === 0) return false; s.on = false; return true; }
        if (who === 'human' && i > 0 && !BT.padsOn()) return false;
        s.who = who; s.pad = i + 1; if (!s.on) { s.on = true; tidy(i); }
        return true;
      };
      function cycleWho(i) {
        var s = BT.S.slots[i], order = i === 0 ? ['human', 'cpu'] : BT.padsOn() && (BT.padOn(i + 1) || s.who === 'human') ? ['cpu', 'human', 'off'] : ['cpu', 'off'], now = !s.on ? 'off' : s.who, k = order.indexOf(now);   // PLAYER n only with controller n plugged in (B18)
        BT.setWho(i, order[(k + 1) % order.length]);
      }
      function change(i, row) {
        var s = BT.S.slots[i];
        if (row === 1) cycleWho(i);
        else if (!s.on) { Q.sfx('nope'); return; }
        else if (row === 2) recolour(i, 1);
        else s.name = free(i, 'name', s.name, 1, BT.NAMES.length);
        Q.sfx('move');
      }
      function next() { if (count() < 2) { Q.sfx('nope'); PL.warn = 1.6; return; } Q.sfx('select'); Q.go('barena'); }
      function pads() {   // extra controllers: A joins (or, already in, nothing), left and right a colour, up and down a name, B leaves to a CPU
        var n, i, s, p, B = BT.BIT;
        if (!BT.padsOn()) return;
        for (n = 2; n <= 4; n++) {
          p = BT.keysBy[n]; i = n - 1; s = BT.S.slots[i];
          if (!p) continue;
          if (p & B.a && !(s.on && s.who === 'human')) { BT.setWho(i, 'human'); Q.sfx('select'); }
          else if (s.on && s.who === 'human') {
            if (p & B.b) { s.who = 'cpu'; Q.sfx('back'); }
            if (p & (B.left | B.right)) { recolour(i, p & B.left ? -1 : 1); Q.sfx('move'); }
            if (p & (B.up | B.down)) { s.name = free(i, 'name', s.name, p & B.up ? -1 : 1, BT.NAMES.length); Q.sfx('move'); }
          }
        }
      }
      Q.defScene('bplayers', {
        enter: function () { U.entered(); BT.padClear(); PL.t = 0; PL.warn = 0; Q.music('map'); },
        update: function (dt) {
          var k = BT.keysDev(), B = BT.BIT;
          PL.t += dt; if (PL.warn > 0) PL.warn -= dt;
          pads();
          if (k & B.up) { PL.row = Math.max(0, PL.row - 1); Q.sfx('move'); }
          if (k & B.down) { PL.row = Math.min(ROWS - 1, PL.row + 1); Q.sfx('move'); }
          if (k & (B.left | B.right) && PL.row >= 1 && PL.row <= 3) { PL.col = (PL.col + (k & B.left ? 3 : 1)) % 4; Q.sfx('move'); }
          if (k & B.b) { Q.sfx('back'); Q.go('modes'); return; }
          if (k & B.start) { next(); return; }
          if (k & B.a) { if (PL.row === 0) { Q.sfx('select'); Q.go('brules'); } else if (PL.row === 4) next(); else change(PL.col, PL.row); }
        },
        draw: function (g) {
          var i, s, x, y, cx, col, sel, f, r, txt, hint;
          BT.backdrop(g, PL.t); BT.head(g, 'PLAYERS');
          r = BT.S.rules; txt = 'BEST OF ' + r.rounds + '  ' + r.hearts + ' HEARTS  ITEMS ' + (r.items ? 'ON' : 'OFF') + '  CPU ' + BT.CPU[r.cpu];
          U.box(g, 8, 30, 304, 15, PL.row === 0 ? '#ffd23f' : '#3c4160', '#151a36'); U.text('RULES: ' + txt, 160 - (U.width('RULES: ' + txt) >> 1), 34, PL.row === 0 ? '#ffd23f' : '#c3c7d4');
          for (i = 0; i < 4; i++) {
            s = BT.S.slots[i]; x = 8 + i * 77; cx = x + 36; col = BT.COLS[s.col] || BT.COLS[0];
            U.box(g, x, 50, 72, 110, s.on ? col.main : '#3c4160', s.on ? '#1a1e38' : '#12152a');
            U.text(String(i + 1), x + 5, 55, s.on ? col.light : '#5d6378');
            if (s.on) { f = s.who === 'cpu' ? Math.floor(PL.t * 1.6 + i) % 2 : Math.floor(PL.t * 6) % 4 === 0 ? 17 : Math.floor(PL.t * 1.6) % 2; U.sprite(g, BT.spr(s.col), f, cx - 16, 58, 2, i >= 2); }
            else { g.globalAlpha = 0.25; U.sprite(g, BT.spr(s.col), 0, cx - 16, 58, 2, i >= 2); g.globalAlpha = 1; }
            for (y = 1; y <= 3; y++) {
              sel = PL.row === y && PL.col === i;
              txt = y === 1 ? BT.whoText(i) : !s.on ? '' : y === 2 ? col.name : BT.NAMES[s.name];
              if (sel) U.box(g, x + 3, 89 + y * 16, 66, 14, '#ffd23f', '#24284a');
              if (y === 2 && s.on) { g.fillStyle = col.main; g.fillRect(x + 8, 93 + y * 16, 6, 6); }
              U.text(txt, cx - (U.width(txt) >> 1) + (y === 2 ? 4 : 0), 93 + y * 16, sel ? '#ffd23f' : y === 1 ? (s.on ? '#ffffff' : '#5d6378') : '#c3c7d4');
            }
          }
          sel = PL.row === 4; U.box(g, 96, 164, 128, 17, sel ? '#ffd23f' : '#3c4160', sel ? '#24284a' : '#151a36');
          U.text('NEXT: ARENA >', 160 - (U.width('NEXT: ARENA >') >> 1), 169, sel ? '#ffd23f' : '#f6efe2');
          hint = PL.warn > 0 ? 'TWO CONDUCTORS AT LEAST' : BT.padsOn() ? 'A ON ANOTHER CONTROLLER JOINS   B: BACK' : 'ARROWS   A: CHANGE   START: NEXT   B: BACK';
          BT.foot(hint);
          U.drawTalk(g);
        },
        leave: function () {},
        sides: BT.sides
      });
      BT.playersAt = function () { return { row: PL.row, col: PL.col, slots: BT.S.slots.map(function (s, i) { return { who: BT.whoText(i), col: s.col, name: BT.NAMES[s.name] }; }) }; };
      // ---------- the rules ----------
      var RU = { sel: 0, t: 0, back: 'bplayers' }, RROWS = ['ROUNDS', 'HEARTS', 'ITEMS', 'CPU LEVEL', 'DONE'];   // back: the screen it came from (the online lobby too, B18)
      function val(i) { var r = BT.S.rules; return i === 0 ? 'BEST OF ' + r.rounds : i === 1 ? String(r.hearts) : i === 2 ? (r.items ? 'ON' : 'OFF') : i === 3 ? BT.CPU[r.cpu] : ''; }
      var SAY = ['WIN MORE THAN HALF TO WIN THE MATCH', 'EACH, EVERY ROUND. A FALL COSTS ONE', 'POWER-UPS FLOAT IN NOW AND THEN', 'HOW SHARP THE CPUS ARE', 'BACK TO THE PLAYERS'];
      function turn(i, d) {
        var r = BT.S.rules, k;
        if (i === 0) { k = BT.ROUNDS.indexOf(r.rounds); r.rounds = BT.ROUNDS[(k + d + BT.ROUNDS.length) % BT.ROUNDS.length]; }
        else if (i === 1) r.hearts = Q.clamp(r.hearts + d, 1, 5);
        else if (i === 2) r.items = !r.items;
        else if (i === 3) r.cpu = (r.cpu + d + 3) % 3;
        else return;
        Q.sfx('move');
      }
      Q.defScene('brules', {
        enter: function (opts) { U.entered(); BT.padClear(); RU.t = 0; RU.sel = 0; RU.back = opts && opts.back === 'blobby' ? 'blobby' : 'bplayers'; },
        update: function (dt) {
          var k = BT.keys(), B = BT.BIT;
          RU.t += dt;
          if (RU.back === 'blobby' && BT.hostPoll) BT.hostPoll();   // an online host keeps answering while he sets the rules
          if (k & B.up) { RU.sel = (RU.sel + RROWS.length - 1) % RROWS.length; Q.sfx('move'); }
          if (k & B.down) { RU.sel = (RU.sel + 1) % RROWS.length; Q.sfx('move'); }
          if (k & B.left) turn(RU.sel, -1);
          if (k & B.right) turn(RU.sel, 1);
          if (k & B.b || (k & (B.a | B.start) && RU.sel === 4)) { Q.sfx('back'); Q.go(RU.back === 'blobby' && BT.NH && BT.NH.on ? 'blobby' : 'bplayers'); return; }
          if (k & B.a && RU.sel < 4) turn(RU.sel, 1);
        },
        draw: function (g) {
          var i, y, on, v;
          BT.backdrop(g, RU.t); BT.head(g, 'RULES');
          for (i = 0; i < RROWS.length; i++) {
            y = 33 + i * 30; on = i === RU.sel;
            U.box(g, 40, y, 240, 27, on ? '#ffd23f' : '#3c4160', on ? '#24284a' : '#151a36');
            U.text(RROWS[i], 50, y + 5, on ? '#ffd23f' : '#ffffff');
            v = val(i);
            if (v) { U.text((on ? '< ' : '') + v + (on ? ' >' : ''), 270 - U.width((on ? '< ' : '') + v + (on ? ' >' : '')), y + 5, on ? '#ffd23f' : '#c3c7d4'); }
            U.text(SAY[i], 50, y + 16, '#6b7186');
          }
          BT.foot('LEFT AND RIGHT: CHANGE   B: BACK');
          U.drawTalk(g);
        },
        leave: function () {},
        sides: BT.sides
      });
      BT.rulesAt = function () { return { sel: RU.sel, rules: BT.copy(BT.S.rules) }; };
    })();
    BT.padOn = function (n) { var p = BT.pad(n); return !!(p && p.on); };   // controller n is plugged in (B18)
    BT.keysDev = function () { var U = Q.ui, f = 0, k, n; for (k = 0; k < 8; k++) if (U.press(BT.KEYS[k])) f |= BT.BIT[BT.KEYS[k]]; if (BT.padsOn()) for (n = 2; n <= 4; n++) BT.keysBy[n] = BT.readPad(n).p; return f; };   // the device's presses only (the extra controllers' go to BT.keysBy)
