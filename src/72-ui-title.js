    // ---------- 72-ui-title.js: the title (UI, builder 5) ----------
    // BATON QUEST in big letters of our own, the conductor keeping time on its podium (notes rise from the baton on the beat), a slow drift of envelopes,
    // tickets and notes behind; START, and CONTINUE when there is a save (START over a save asks first; the save's GOLD STARS n/32 beside CONTINUE,
    // part 14.2); a line of controls; the 'title' song.
    // START calls Q.newGame() then goes to 'intro' if the scene did not change; CONTINUE calls Q.continueGame(), else 'map' (QUEST-API.md part 13, 3).
    (function () {
      var U = Q.ui, TI = { t: 0, sel: 0, has: false, ask: false, askSel: 0, leave: '', fade: 0, drift: [], stars: [], notes: [], beatN: -1 };
      var CX = 34, CY = 58, LX = 120, LY = 14, MX = 209;   // the conductor (3 times its size), the lettering, the middle of the menu
      U.stored = function () { var s = null; try { s = Q.api && Q.api.load ? Q.api.load() : null; } catch (e) { s = null; } return s && typeof s === 'object' ? s : null; };   // the stored save, as it is
      U.hasSave = function () { var s = U.stored(); return !!(s && (s.v || s.at || s.cleared)); };
      U.beat = function (song) { var s = Q.SONG[song]; return 60 / (s && s.bpm > 0 ? s.bpm : 100); };
      var SKY = U.grad('#090d26', '#1d2858', 19);
      function seed() {
        var r = Q.api && Q.api.rand ? Q.api.rand(9) : Math.random, i;
        TI.drift = []; TI.stars = []; TI.notes = [];
        for (i = 0; i < 18; i++) TI.drift.push({ x: r() * 340 - 10, y: r() * 200, vx: -(3 + r() * 6), vy: 2 + r() * 5, k: i % 3, ph: r() * 6.28 });
        for (i = 0; i < 44; i++) TI.stars.push({ x: Math.floor(r() * 320), y: Math.floor(r() * 160), ph: r() * 6.28 });
        var r2 = Q.api && Q.api.rand ? Q.api.rand(29) : Math.random; TI.sstars = [];   // a wide screen's side stars: their own seed, so the middle's stay as they were
        for (i = 0; i < 98; i++) TI.sstars.push({ x: Math.floor(r2() * Q.WMAX), y: Math.floor(r2() * 160), ph: r2() * 6.28 });
      }
      function items() {   // THE ENDING once won: see it again; FILE n (the file screen, 79) once any of the three files has a save
        var l = TI.has ? (TI.won ? ['START', 'CONTINUE', 'THE ENDING'] : ['START', 'CONTINUE']) : ['START'];
        if (TI.any) l.push('FILE ' + (Q.fileNow ? Q.fileNow() : 1));
        return l;
      }
      function leave(what) { TI.leave = what; TI.fade = 0; Q.sfx('select'); }
      U.titleAt = function () { return { sel: TI.sel, items: items(), gold: TI.gold }; };   // for checks
      function go() {
        var what = TI.leave; TI.leave = '';
        if (what === 'start') {
          var opt = Q.SAVE && Q.SAVE.opt;   // the player's own settings stay with a new game
          Q.newGame(); if (opt && Q.SAVE) Q.SAVE.opt = opt;
          if (Q.scene === 'title') Q.go('intro');
        }
        else if (what === 'files') Q.go('files');   // the three files (79-ui-files.js)
        else if (what === 'ending') Q.go('end');   // the ending again, then the credits and what comes after them, then back here (the save is not touched)
        else { Q.continueGame(); if (Q.scene === 'title') Q.go('map'); }
      }
      Q.defScene('title', {
        enter: function () { U.entered();
          U.cancel(); U.clearToasts(); U.mapKeep = false; U.lastWorld = 0; U.lastStop = '';
          TI.t = 0; TI.has = U.hasSave(); TI.any = U.anySave ? U.anySave() : false; TI.won = !!(Q.SAVE && Q.SAVE.won); TI.sel = TI.has ? 1 : 0; TI.ask = false; TI.leave = ''; TI.fade = 0; TI.beatN = -1;
          TI.gold = TI.has ? U.starCount(Q.SAVE && Q.SAVE.stars ? Q.SAVE : U.stored()) : null;   // the save's gold stars, for CONTINUE
          seed(); U.applyOpt(); Q.music('title');   // the MUSIC setting from the save, put back at the start
        },
        update: function (dt) {
          var i, d, b = U.beat('title'), n;
          TI.t += dt;
          for (i = 0; i < TI.drift.length; i++) { d = TI.drift[i]; d.x += d.vx * dt; d.y += d.vy * dt; if (d.x < -14) d.x += 340; if (d.y > 204) d.y -= 214; }
          n = Math.floor(TI.t / b);
          if (n !== TI.beatN) { TI.beatN = n; if (n % 2 === 0) TI.notes.push({ x: CX + 42, y: CY + 4, t: 0, k: TI.notes.length % 2 }); }
          for (i = TI.notes.length - 1; i >= 0; i--) { d = TI.notes[i]; d.t += dt; d.y -= 16 * dt; d.x += (5 + 6 * Math.sin(d.t * 4)) * dt; if (d.t > 1.8) TI.notes.splice(i, 1); }
          if (TI.leave) { TI.fade += dt / 0.45; if (TI.fade >= 1) go(); return; }
          if (Q.talking()) return;
          if (TI.ask) {   // START over a save: ask first (NO is the default)
            if (U.press('left') || U.press('right') || U.press('up') || U.press('down')) { TI.askSel = 1 - TI.askSel; Q.sfx('move'); }
            if (U.press('b')) { TI.ask = false; Q.sfx('back'); return; }
            if (U.press('a') || U.press('start')) { TI.ask = false; if (TI.askSel) leave('start'); else Q.sfx('back'); }
            return;
          }
          TI.sel = U.menuMove(TI.sel, items().length);
          if (U.press('a') || U.press('start')) {
            if (items()[TI.sel] === 'CONTINUE') leave('continue');
            else if (String(items()[TI.sel]).indexOf('FILE ') === 0) leave('files');
            else if (items()[TI.sel] === 'THE ENDING') leave('ending');
            else if (TI.has) { TI.ask = true; TI.askSel = 0; Q.sfx('select'); }
            else leave('start');
          }
        },
        draw: function (g) {
          var i, d, y, t = TI.t, list = items(), noteSpr = U.frames('note') ? 'note' : 'u5-note', b = U.beat('title');
          U.bands(g, SKY, 0, 8);
          U.fill(g, 0, 152, 320, 48, '#1a2350'); U.fill(g, 0, 152, 320, 1, '#2a3878');
          for (i = 0; i < TI.stars.length; i++) { d = TI.stars[i]; g.fillStyle = Math.sin(t * 2 + d.ph) > 0.6 ? '#ffffff' : '#5d6a9e'; g.fillRect(d.x, d.y, 1, 1); }
          g.save(); g.beginPath(); g.rect(0, 0, 320, 152); g.clip();   // the drift sinks behind the horizon, clear of the tips and the controls
          for (i = 0; i < TI.drift.length; i++) { d = TI.drift[i]; Q.spr(g, d.k === 0 ? 'u5-env' : d.k === 1 ? 'u5-tix' : 'u5-note', 0, Math.round(d.x), Math.round(d.y + Math.sin(t + d.ph) * 2)); }
          g.restore();
          // the podium and the conductor, keeping time: one stroke a beat
          U.fill(g, CX - 10, CY + 60, 68, 16, '#1d1d24'); U.fill(g, CX - 9, CY + 61, 66, 14, '#7a4a2a'); U.fill(g, CX - 9, CY + 61, 66, 2, '#a86f43'); U.fill(g, CX - 9, CY + 70, 66, 1, '#5e3a22');
          U.sprite(g, U.hero(), TI.leave === 'start' ? 6 : (Math.floor(t / b) % 2 ? 9 : 8), CX, CY, 3);
          for (i = 0; i < TI.notes.length; i++) { d = TI.notes[i]; g.globalAlpha = Q.clamp(1.8 - d.t, 0, 1); Q.spr(g, noteSpr, d.k, Math.round(d.x), Math.round(d.y)); }
          g.globalAlpha = 1;
          Q.spr(g, 'u5-logo', 0, LX, LY + Math.round(Math.sin(t * 1.6) * 1.5));
          for (i = 0; i < list.length; i++) {
            y = list.length > 3 ? 102 + i * 16 : (list.length > 2 ? 112 : 120) + i * (list.length > 2 ? 18 : 20);   // four items (with FILE n) sit higher, clear of the tips
            U.item(list[i], MX, y, i === TI.sel && !TI.ask, false, 'center', 2);
            if (list[i] === 'CONTINUE' && TI.gold) {   // the save's GOLD STARS beside it (part 14.2)
              U.starIcon(g, MX + (U.width('CONTINUE', 2) >> 1) + 6, y + 1, TI.gold.n > 0);
              U.text(TI.gold.n + '/' + TI.gold.all, MX + (U.width('CONTINUE', 2) >> 1) + 20, y + 4, TI.gold.n > 0 ? '#ffd23f' : '#7f8ab8');
            }
          }
          var tips = Q.story && Q.story.tips, tk;   // STORY's tips, one every few seconds (QUEST-API.md part 13, 13)
          if (tips && tips.length && !TI.ask) { tk = (t % 5) / 5; U.text(String(tips[Math.floor(t / 5) % tips.length]), 160, 168, tk < 0.06 || tk > 0.94 ? '#3c4680' : '#7f8ab8', 1, 'center'); }
          U.fill(g, 0, 179, 320, 15, '#10173a');
          U.text('A: JUMP   B: BATON   HOLD B: NOTE   START: PAUSE', 160, 183, '#8f9ac8', 1, 'center');
          U.badge(g, 15, 13, TI.won);
          if (TI.won) {   // the game was finished: our own small mark of it
            if (Math.floor(t * 1.5) % 4 === 0) { U.fill(g, 26, 4, 1, 3, '#fff1a8'); U.fill(g, 25, 5, 3, 1, '#fff1a8'); }
            U.text('THE BACKLOG', 6, 27, '#ffd23f'); U.text('IS TRIMMED', 6, 36, '#ffd23f');
          }
          if (TI.ask) {
            U.box(g, 56, 70, 208, 62, '#ffd23f', '#1d1d24');
            U.text('START A NEW GAME?', 160, 80, '#ffffff', 1, 'center');
            U.text('FILE ' + (Q.fileNow ? Q.fileNow() : 1) + "'S SAVE WILL BE REPLACED.", 160, 93, '#c3c7d4', 1, 'center');
            U.item('NO', 128, 113, TI.askSel === 0, false, 'center'); U.item('YES', 192, 113, TI.askSel === 1, false, 'center');
          }
          if (TI.leave) { g.globalAlpha = Q.clamp(TI.fade, 0, 1); U.fill(g, 0, 0, 320, 200, '#000000'); g.globalAlpha = 1; }
          U.drawTalk(g);
        },
        sides: function (g) {   // a wide screen's sides (the engine clips to them): the sky, stars of their own, the drift carried on from the middle every 340 px, the horizon, the same fade
          var i, k, d, t = TI.t, ox = Q.OX, st = TI.sstars || [];
          U.bands(g, SKY, 0, 8, Q.W);
          U.fill(g, 0, 152, Q.W, 48, '#1a2350'); U.fill(g, 0, 152, Q.W, 1, '#2a3878');
          for (i = 0; i < st.length; i++) { d = st[i]; g.fillStyle = Math.sin(t * 2 + d.ph) > 0.6 ? '#ffffff' : '#5d6a9e'; g.fillRect(d.x, d.y, 1, 1); }
          g.save(); g.beginPath(); g.rect(0, 0, Q.W, 152); g.clip();
          for (i = 0; i < TI.drift.length; i++) { d = TI.drift[i]; for (k = -1; k <= 1; k++) Q.spr(g, d.k === 0 ? 'u5-env' : d.k === 1 ? 'u5-tix' : 'u5-note', 0, ox + Math.round(d.x) + k * 340, Math.round(d.y + Math.sin(t + d.ph) * 2)); }
          g.restore();
          U.fill(g, 0, 179, Q.W, 15, '#10173a');
          if (TI.leave) { g.globalAlpha = Q.clamp(TI.fade, 0, 1); U.fill(g, 0, 0, Q.W, 200, '#000000'); g.globalAlpha = 1; }
        },
        leave: function () { TI.notes = []; }
      });
      U.badge = function (g, cx, cy, gold) {   // the office's own label: 9F, white on a round orange badge (gold once the game is finished)
        var r = [5, 7, 8, 9, 9, 9, 9, 9, 8, 7, 5], i;
        for (i = 0; i < r.length; i++) { U.fill(g, cx - r[i] - 1, cy - 5 + i - 1, r[i] * 2 + 2, 3, '#1d1d24'); }
        for (i = 0; i < r.length; i++) U.fill(g, cx - r[i], cy - 5 + i, r[i] * 2, 1, gold ? (i < 3 ? '#fff1a8' : '#ffd23f') : (i < 3 ? '#ffa64d' : '#ff8a1e'));
        U.text('9F', cx - 5, cy - 3, gold ? '#7a4a10' : '#ffffff');
      };
    })();
