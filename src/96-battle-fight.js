    // ---------- 96-battle-fight.js: BATTLE MODE's fight, the scene 'battle' (B16; BATTLE.md) ----------
    // enter({ setup }) starts a match; each step: every conductor's input frame (93), START from any person opens the pause, BT.step, then the sounds and
    // sparks. The pause: RESUME, RULES (shown), QUIT (asks first, NO chosen at first); B or START in it resumes. The match over: the results (96-battle-menus-b).
    BT.keys = function () {   // the presses for a menu this step: the device's own (Q.ui.press) and every extra controller's
      var U = Q.ui, f = 0, k, n, pf;
      for (k = 0; k < 8; k++) if (U.press(BT.KEYS[k])) f |= BT.BIT[BT.KEYS[k]];
      if (BT.padsOn()) for (n = 2; n <= 4; n++) { pf = BT.readPad(n); f |= pf.p; BT.keysBy[n] = pf.p; }
      return f;
    };
    BT.keysBy = { 2: 0, 3: 0, 4: 0 };
    (function () {
      var U = Q.ui, BF = BT.F = { M: null, setup: null, pause: null, overT: 0, cue: '' };
      var PAUSE = ['RESUME', 'RULES', 'QUIT'];
      function cue(M) {   // the round's start, its READY and its GO, each heard once
        var c = M.phase === 'ready' ? (M.phaseT < 1.1 ? 'round' : 'ready') + M.round : M.phase === 'fight' && M.roundT < 0.7 ? 'go' + M.round : '';
        if (c && c !== BF.cue) { BF.cue = c; Q.sfx(c.indexOf('round') === 0 ? 'card' : c.indexOf('ready') === 0 ? 'tick' : 'zap'); }
      }
      function pauseStep() {
        var P = BF.pause, k = BT.keys(), B = BT.BIT;
        if (P.rules) { if (k & (B.a | B.b | B.start)) { P.rules = false; Q.sfx('back'); } return; }
        if (P.ask) {
          if (k & (B.left | B.right | B.up | B.down)) { P.askSel = 1 - P.askSel; Q.sfx('move'); }
          if (k & B.b) { P.ask = false; Q.sfx('back'); return; }
          if (k & (B.a | B.start)) {
            P.ask = false;
            if (P.askSel) { Q.sfx('select'); BF.pause = null; BF.M = null; Q.music('map'); Q.go('bplayers'); } else Q.sfx('back');
          }
          return;
        }
        if (k & B.up) { P.sel = (P.sel + PAUSE.length - 1) % PAUSE.length; Q.sfx('move'); }
        if (k & B.down) { P.sel = (P.sel + 1) % PAUSE.length; Q.sfx('move'); }
        if (k & (B.b | B.start)) { BF.pause = null; Q.sfx('back'); return; }
        if (k & B.a) {
          if (PAUSE[P.sel] === 'RESUME') { BF.pause = null; Q.sfx('back'); }
          else if (PAUSE[P.sel] === 'RULES') { P.rules = true; Q.sfx('select'); }
          else { P.ask = true; P.askSel = 0; Q.sfx('select'); }
        }
      }
      BT.rulesLines = function (r) {
        return ['BEST OF ' + r.rounds + (r.rounds === 1 ? ': ONE ROUND' : ': FIRST TO ' + (Math.floor(r.rounds / 2) + 1) + ' ROUNDS'), r.hearts + (r.hearts === 1 ? ' HEART' : ' HEARTS') + ' EACH: A FALL COSTS ONE',
          'EACH HIT ADDS WOBBLE: YOU FLY FURTHER', 'ITEMS ' + (r.items ? 'ON: POWER-UPS FLOAT IN' : 'OFF'), 'CPU LEVEL ' + BT.CPU[r.cpu]];
      };
      function drawPause(g) {   // the whole screen dimmed, the menu in the centred column
        g.fillStyle = 'rgba(5,6,10,0.6)'; g.fillRect(0, 0, Q.W, 200);
        Q.col(g, drawPauseIn);
      }
      function drawPauseIn(g) {
        var P = BF.pause, i, y, lines;
        if (P.rules) {
          lines = BT.rulesLines(BF.M.rules);
          U.box(g, 22, 40, 276, 104, '#ffd23f', '#1d1d24'); U.text('THE RULES OF THIS MATCH', 160 - (U.width('THE RULES OF THIS MATCH') >> 1), 50, '#ffd23f');
          for (i = 0; i < lines.length; i++) U.text(lines[i], 160 - (U.width(lines[i]) >> 1), 66 + i * 12, '#f6efe2');
          U.text('A OR B: BACK', 160 - (U.width('A OR B: BACK') >> 1), 130, '#8f9ac8');
          return;
        }
        U.box(g, 96, 46, 128, 98, '#ffd23f', '#1d1d24');
        U.text('PAUSED', 160 - (U.width('PAUSED', 2) >> 1), 56, '#ffffff', 2);
        if (P.by) U.text('BY ' + P.by, 160 - (U.width('BY ' + P.by) >> 1), 74, '#8f9ac8');
        for (i = 0; i < PAUSE.length; i++) { y = 88 + i * 16; U.item(PAUSE[i], 160, y, i === P.sel && !P.ask, false, 'center'); }
        if (P.ask) {
          U.box(g, 70, 76, 180, 48, '#ff8a6a', '#1d1d24');
          U.text('QUIT THIS MATCH?', 160 - (U.width('QUIT THIS MATCH?') >> 1), 86, '#ffffff');
          U.item('NO', 128, 104, P.askSel === 0, false, 'center'); U.item('YES', 192, 104, P.askSel === 1, false, 'center');
        }
      }
      Q.defScene('battle', {
        wide: true,   // it fills a wider screen itself (QUEST-API part 15): the world's background across it, the arena in the middle
        enter: function (opts) {
          U.entered(); U.cancel(); U.clearToasts(); BT.padClear();
          opts = opts || {};
          if (opts.resume && BF.M) return;
          BF.setup = opts.setup || BT.setupNow(); BF.M = BT.newMatch(BF.setup); BF.pause = null; BF.overT = 0; BF.cue = ''; BT.fxClear();
          Q.music(BT.arenaDef(BF.M.arena).music || 'boss');
        },
        update: function (dt) {
          var M = BF.M, inp, i, by = '';
          if (!M) return;
          BT.fxStep(dt);
          if (BF.pause) { pauseStep(); return; }
          inp = BT.inputs(M, dt);
          for (i = 0; i < inp.length; i++) if (M.cs[i].who === 'human' && (inp[i].p & BT.BIT.start)) by = by || BT.tagOf(M.cs[i]);
          if (!by && Q.press('start')) by = 'P1';   // the device's own START pauses even a match of CPUs (when slot 1 is a person, its frame took it above)
          if (by && M.phase !== 'over') { BF.pause = { sel: 0, ask: false, askSel: 0, rules: false, by: by }; Q.sfx('select'); return; }
          BT.step(M, dt, inp);
          BT.present(M);
          cue(M);
          if (M.phase === 'over') { BF.overT += dt; if (BF.overT > 2.4) Q.go('bresults', { M: M, setup: BF.setup }); }
        },
        draw: function (g) {
          var M = BF.M;
          if (!M) { g.fillStyle = '#0b0c10'; g.fillRect(0, 0, Q.W, 200); return; }
          BT.drawFight(g, M, Q.t); BT.drawHud(g, M, Q.t); BT.drawWords(g, M);
          if (BF.pause) drawPause(g);
          BT.padLatch();
          U.drawTalk(g);
        },
        leave: function () { BT.fxClear(); }
      });
      BT.fightAt = function () {   // for checks: where the fight is
        var M = BF.M; if (!M) return null;
        return { phase: M.phase, round: M.round, wins: M.wins.slice(), winner: M.winner, pause: BF.pause ? { sel: BF.pause.sel, ask: BF.pause.ask, rules: BF.pause.rules } : null, n: M.cs.length, t: Math.round(M.roundT * 10) / 10 };
      };
    })();
