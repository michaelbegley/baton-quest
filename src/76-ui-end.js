    // ---------- 76-ui-end.js: game over and the ending (UI, builder 5) ----------
    // 'over': a kind game over: BACK IN A BEAT, the conductor with a coffee, the 'over' script, then CONTINUE (opts.retry, from the engine: back to the last
    // checkpoint with full hearts; without it Q.continueGame()) or TITLE. The 'over' tune, once.
    // 'end': the Ninth Floor in the morning: C1, C2 and C3 typing at their desks, the conductor keeping time, SCOPE CREEP one small ticket pinned under LATER
    // on the 9F screen. Driven by the 'ending' script and its cues: 'morning', 'ticket' (a close look at the 9F screen), 'cat' (the cat comes in by the
    // cat flap and sits on a desk in front of the work), 'baton' (the conductor raises its baton; the keys click in time). Then 'credits'. The 'end' song.
    (function () {
      var U = Q.ui, OV = { t: 0, opts: null, menu: false, sel: 0, cheer: false }, EN = {}, O = null;
      Q.defScene('over', {
        enter: function (opts) { U.entered();
          OV.t = 0; OV.opts = opts || {}; OV.menu = false; OV.sel = 0; OV.cheer = false;
          U.cancel(); U.clearToasts(true); Q.music('over');   // no MEMO FOUND over BACK IN A BEAT (QA round 2); a GOLD STAR's toast stays (the star BACK IN A BEAT is won here)
          Q.say('over', function () { OV.menu = true; }, function (i, line) { if (line.who === 'hero') OV.cheer = true; });
        },
        update: function (dt) {
          OV.t += dt;
          if (U.runLater()) return;
          U.tick();
          if (!OV.menu || Q.talking()) return;
          OV.sel = U.menuMove(OV.sel, 2);
          if (U.press('a') || U.press('start')) {
            Q.sfx('select');
            if (OV.sel === 1) {   // the title: saved with full hearts (nothing is lost)
              if (Q.P) Q.P.hp = Q.P.maxHp;
              if (Q.SAVE) Q.SAVE.hp = Q.SAVE.maxHp;
              Q.saveGame(); Q.go('title'); return;
            }
            U.later(function () {   // next frame, so the level never reads this press as a jump
              if (OV.opts && typeof OV.opts.retry === 'function') OV.opts.retry(); else Q.continueGame();
              if (Q.scene === 'over') Q.go('title');   // nothing took us on: the title rather than a stuck screen
            });
          }
        },
        draw: function (g) {
          var t = OV.t, i;
          U.bands(g, OVSKY, 0, 10);
          for (i = 0; i < 24; i++) U.fill(g, (i * 53 + Math.floor(t * (4 + i % 3))) % 320, (i * 37) % 120, 1, 1, i % 4 ? '#3a4470' : '#6f7ab0');
          U.text('OUT OF HEARTS', 160, 22, '#8a93a8', 1, 'center');
          U.text('BACK IN A BEAT', 160, 36, '#f6efe2', 3, 'center');
          U.text('NOTHING IS LOST.', 160, 66, '#8ff0e6', 1, 'center');
          U.fill(g, 112, 124, 96, 4, '#1d1d24'); U.fill(g, 113, 124, 94, 2, '#7a4a2a');   // a little shelf to sit by
          U.sprite(g, U.hero(), OV.cheer ? 17 : t < 0.8 ? 16 : Math.floor(t * 1.5) % 2, 128, 84, 2);
          U.sprite(g, 'mug', Math.floor(t * 3) % 2, 170, 92, 2);
          if (OV.menu && !Q.talking()) {
            U.box(g, 80, 142, 160, 50, '#2ec4b6', '#12141c');
            U.item('CONTINUE', 160, 151, OV.sel === 0, false, 'center', 2);
            U.item('TITLE', 160, 173, OV.sel === 1, false, 'center');
          }
          U.drawTalk(g);
        },
        sides: function (g) {   // a wide screen's sides (the engine clips to them): the sky, and the middle's drifting stars carried on every 320 px, so they cross the seams unbroken
          var t = OV.t, i, x;
          U.bands(g, OVSKY, 0, 10, Q.W);
          for (i = 0; i < 24; i++) { x = (i * 53 + Math.floor(t * (4 + i % 3))) % 320; U.fill(g, Q.OX + x - 320, (i * 37) % 120, 1, 1, i % 4 ? '#3a4470' : '#6f7ab0'); U.fill(g, Q.OX + x + 320, (i * 37) % 120, 1, 1, i % 4 ? '#3a4470' : '#6f7ab0'); }
        }
      });
      var OVSKY = U.grad('#0a0d1c', '#1c2547', 20);

      // ---- the ending ----
      var ORDER = ['morning', 'ticket', 'cat', 'baton'];
      function rank(b) { return ORDER.indexOf(b); }
      function setBeat(b) {
        if (rank(b) < 0) return;
        if (b === 'cat' && EN.catT < 0) EN.catT = 0;
        if (b === 'baton' && EN.batonT < 0) EN.batonT = 0;
        if (rank(b) > rank(EN.beat)) { EN.beat = b; EN.bt = 0; }
        EN.close = b === 'ticket';
      }
      function cueTable(lines) {
        var n = lines.length, has = false, i, tab = [];
        for (i = 0; i < n; i++) { if (lines[i].cue) has = true; tab.push(lines[i].cue || ''); }
        if (!has && n) { tab[0] = 'morning'; tab[Math.round(n * 0.45)] = 'ticket'; tab[Math.round(n * 0.75)] = 'cat'; tab[Math.max(0, n - 2)] = 'baton'; }
        return tab;
      }
      function catPos(t) {   // in by the cat flap, along the floor, a hop onto C1's desk, and sit in front of the work
        if (t < 1.6) return { x: Q.lerp(12, 40, t / 1.6), y: 116, f: 2 + Math.floor(t * 8) % 2, flip: false };
        if (t < 2.1) { var u = (t - 1.6) / 0.5; return { x: Q.lerp(40, 54, u), y: Q.lerp(116, 98, u) - Math.sin(u * Math.PI) * 10, f: 2, flip: false }; }
        return { x: 54, y: 98, f: Math.floor(t * 1.2) % 2, flip: false };
      }
      U.closeUp = function (g, t, who) {   // the 9F screen, close: LATER, and under it one small ticket, NICE TO HAVE, with two little eyes
        var wig = who === 'creep' ? (Math.floor(t * 8) % 2) : 0, look = Math.floor(t * 0.7) % 3 - 1, blink = Math.floor(t * 2.3) % 7 === 0 || who === 'c3';
        U.box(g, 44, 18, 232, 120, '#d6ccb8', '#f6efe2');
        U.box(g, 54, 26, 212, 96, '#1d1d24', '#e9f7f4');
        U.bigWord(g, 'LATER', 109, 34, 3, ['#8a93b8', '#6f7896', '#5a6383'], '#2e3142');
        for (var i = 0; i < 12; i++) U.fill(g, 66 + i * 16, 64, 9, 1, '#b8c4cc');
        U.fill(g, 118, 76 + wig, 84, 34, '#1d1d24'); U.fill(g, 119, 77 + wig, 82, 32, '#ffd23f'); U.fill(g, 119, 77 + wig, 82, 3, '#fff1a8');
        U.fill(g, 158, 72, 5, 5, '#1d1d24'); U.fill(g, 159, 72, 3, 3, '#e0443a'); U.fill(g, 159, 72, 1, 1, '#ff9a8a');   // the pin
        U.text('NICE TO HAVE', 160, 96 + wig, '#5a3a10', 1, 'center');
        if (blink) { U.fill(g, 149, 86 + wig, 6, 1, '#1d1d24'); U.fill(g, 165, 86 + wig, 6, 1, '#1d1d24'); }
        else { U.fill(g, 148, 82 + wig, 8, 7, '#1d1d24'); U.fill(g, 164, 82 + wig, 8, 7, '#1d1d24'); U.fill(g, 149, 83 + wig, 6, 5, '#ffffff'); U.fill(g, 165, 83 + wig, 6, 5, '#ffffff'); U.fill(g, 151 + look, 84 + wig, 2, 3, '#1d1d24'); U.fill(g, 167 + look, 84 + wig, 2, 3, '#1d1d24'); }
        U.fill(g, 151, 124, 18, 1, '#a89e8c'); U.fill(g, 154, 126, 4, 3, '#ff8a1e');   // the computer's chin, its orange dot
      };
      Q.defScene('end', {
        enter: function () { U.entered();
          var lines = Q.SCRIPT.ending || [];
          O = U.office;
          EN = { t: 0, bt: 0, beat: 'morning', close: false, catT: -1, batonT: -1, said: false, started: false, who: 'none', out: 0, cues: cueTable(lines), script: lines.length > 0 };
          U.cancel(); U.clearToasts(true); Q.music('end');   // the star SHIPPED IT is won as the ending starts: its toast stays
        },
        update: function (dt) {
          O = U.office;
          EN.t += dt; EN.bt += dt;
          if (EN.catT >= 0) { var was = EN.catT; EN.catT += dt; if (was < 2.1 && EN.catT >= 2.1) Q.sfx('meow'); }
          if (EN.batonT >= 0) EN.batonT += dt;
          if (!EN.started && EN.t > 1.0) {
            EN.started = true;
            if (EN.script) Q.say('ending', function () { EN.said = true; }, function (i, line) { EN.who = String(line.who || 'none'); if (EN.cues[i]) setBeat(EN.cues[i]); });
            else EN.said = true;
          }
          U.tick();
          if (U.press('start')) { U.cancel(); EN.said = true; }
          if (EN.said && !Q.talking()) { EN.out += dt / 0.8; if (EN.out >= 1) { U.cancel(); Q.go('credits'); } }
        },
        draw: function (g) {
          var t = EN.t, i, b = U.beat('end'), beatN = Math.floor(t / b), inTime = EN.batonT >= 0, fr, c;
          O = U.office;
          O.back(g, 1);
          for (i = 0; i < 3; i++) Q.spr(g, O.AG[i], inTime ? beatN % 2 : Math.floor(t * 5 + i) % 2, O.SX[i], O.AY);
          for (i = 0; i < 3; i++) Q.spr(g, 'u5-desk', 0, O.SX[i] - 10, 96);
          for (i = 0; i < 3; i++) { O.monitor(g, i, true, inTime ? beatN * 0.17 : t); O.hands(g, i, inTime ? beatN * 0.5 + i * 0.5 : t + i * 0.3); O.steam(g, i, t + i * 0.7, '#ffffff'); }
          O.screen(g, 'later', t);
          if (EN.catT >= 0) { c = catPos(EN.catT); Q.spr(g, 'cat', c.f, Math.round(c.x), Math.round(c.y), c.flip); }
          fr = EN.batonT >= 0 && EN.batonT < 0.7 ? 17 : beatN % 2 ? 9 : 8;
          U.sprite(g, U.hero(), fr, O.HX, O.HY, 1, true);
          if (EN.close) U.closeUp(g, t, EN.who);
          if (EN.out > 0) { g.globalAlpha = Q.clamp(EN.out, 0, 1); U.fill(g, 0, 0, 320, 200, '#000000'); g.globalAlpha = 1; }
          U.drawTalk(g);
        }
      });
    })();
