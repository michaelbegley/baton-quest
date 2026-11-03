    // ---------- 72-ui-title.js (B17 FRONT END, 2 Nov; builder 5's title before): the front of the game, one scene and its screens ----------
    // The scene 'title' shows, in turn: BOOT, the 9F POCKET splash, only when the game has just opened (72-ui-front-boot.js; any button skips it);
    // TITLE: the logo drops in and a shine runs across it, the conductor keeps time on his podium, PRESS START blinks; MENU: CONTINUE when a save
    // exists (its GOLD STARS n/32 beside it), NEW GAME, FILE n once any file has a save, GAME MODES, OPTIONS, EXTRAS; OPTIONS, CONTROLS and EXTRAS
    // are in 72-ui-front-menus.js. B goes back one screen. Q.go('title') from anywhere in the game opens the MENU (on CONTINUE, or the item it left by).
    // NEW GAME calls Q.newGame() then goes to 'intro' if the scene did not change; CONTINUE calls Q.continueGame(), else 'map' (QUEST-API.md part 13, 3).
    (function () {
      var U = Q.ui, FE = U.fe || (U.fe = { ph: {} });
      var CX = 34, CY = 58, LX = 118, LY = 4, MX = 216, BX = 124, BW = 188;   // the conductor (3 times his size), the logo, the middle under it, the menu's box
      U.stored = function () { var s = null; try { s = Q.api && Q.api.load ? Q.api.load() : null; } catch (e) { s = null; } return s && typeof s === 'object' ? s : null; };   // the stored save, as it is
      U.hasSave = function () { var s = U.stored(); return !!(s && (s.v || s.at || s.cleared)); };
      U.beat = function (song) { var s = Q.SONG[song]; return 60 / (s && s.bpm > 0 ? s.bpm : 100); };
      FE.SKY = U.grad('#090d26', '#1d2858', 19);
      FE.t = 0; FE.pt = 0; FE.phase = 'menu'; FE.sel = 0; FE.lock = -1; FE.drift = []; FE.stars = []; FE.notes = []; FE.beatN = -1; FE.ret = null; FE.soon = 0;
      function seed() {
        var r = Q.api && Q.api.rand ? Q.api.rand(9) : Math.random, i, r2;
        FE.drift = []; FE.stars = []; FE.notes = [];
        for (i = 0; i < 18; i++) FE.drift.push({ x: r() * 340 - 10, y: r() * 200, vx: -(3 + r() * 6), vy: 2 + r() * 5, k: i % 3, ph: r() * 6.28 });
        for (i = 0; i < 44; i++) FE.stars.push({ x: Math.floor(r() * 320), y: Math.floor(r() * 160), ph: r() * 6.28 });
        r2 = Q.api && Q.api.rand ? Q.api.rand(29) : Math.random; FE.sstars = [];   // a wide screen's side stars: their own seed, so the middle's stay as they were
        for (i = 0; i < 98; i++) FE.sstars.push({ x: Math.floor(r2() * Q.WMAX), y: Math.floor(r2() * 160), ph: r2() * 6.28 });
      }
      FE.MODES = 'modes';   // GAME MODES is BATTLE's scene (lab/battle, B16): COMING SOON until it is in (a name, so the lint does not take it for a missing scene: every Q.go of it waits for FE.modes)
      FE.modes = function () { return Object.prototype.hasOwnProperty.call(Q.SCENE, FE.MODES); };
      FE.items = function () {   // the main menu
        var l = FE.has ? ['CONTINUE', 'NEW GAME'] : ['NEW GAME'];
        if (FE.any) l.push('FILE ' + (Q.fileNow ? Q.fileNow() : 1));   // the file screen, once any of the three files has a save (QUEST-API 14.10 item 10)
        l.push('GAME MODES', 'OPTIONS', 'EXTRAS');
        return l;
      };
      FE.find = function (list, want) { var i; for (i = 0; i < list.length; i++) if (String(list[i]).indexOf(want) === 0) return i; return -1; };
      FE.press = function (n) { return FE.lock !== U.now() && U.press(n); };   // a press, unless this frame already changed the screen (one press, one step: part 13, 28)
      FE.anyPress = function () { var k = ['a', 'b', 'start', 'c', 'up', 'down', 'left', 'right'], i, hit = false; for (i = 0; i < k.length; i++) if (FE.press(k[i])) hit = true; return hit; };
      FE.to = function (phase, sel) {   // to one of the scene's screens
        FE.phase = phase; FE.pt = 0; FE.lock = U.now();
        var p = FE.ph[phase]; if (p && p.enter) p.enter(sel);
      };
      FE.go = function (what) {   // leaving the front: a short fade (the game, the ending, the credits, a file) or at once (another menu scene)
        FE.leave = what; FE.fade = 0; FE.lock = U.now(); Q.sfx('select');
      };
      FE.mark = function (id) {   // a scene that comes back here by itself (the credits, BATTLE's GAME MODES): its leave notes when it left, so a way back set for it is used only on that return
        var sc = Object.prototype.hasOwnProperty.call(Q.SCENE, id) ? Q.SCENE[id] : null, l0;
        if (!sc || sc.feMark) return;
        l0 = sc.leave; sc.feMark = true;
        sc.leave = function (Qx) { FE.left = id; FE.leftAt = U.now(); if (l0) return l0.call(sc, Qx); };
      };
      FE.back = function (ph, item, via) { FE.ret = { ph: ph, item: item, via: via }; FE.mark(via); };   // the way back to this screen and item, once 'via' has come back
      function gone() {
        var what = FE.leave, opt; FE.leave = '';
        if (what === 'start') {
          opt = Q.SAVE && Q.SAVE.opt;   // the player's own settings stay with a new game
          FE.ret = null; Q.newGame(); if (opt && Q.SAVE) Q.SAVE.opt = opt;
          if (Q.scene === 'title') Q.go('intro');
        } else if (what === 'continue') { FE.ret = null; Q.continueGame(); if (Q.scene === 'title') Q.go('map'); }
        else if (what === 'files') Q.go('files');   // the three files (79-ui-files.js); its B comes back here, on FILE
        else if (what === 'ending') { FE.back('extras', 'THE ENDING', 'credits'); Q.go('end'); }   // the ending again, then the credits, then back to EXTRAS (the save is not touched)
        else if (what === 'credits') { FE.back('extras', 'CREDITS', 'credits'); Q.go('credits'); }
      }
      FE.gone = gone;
      U.titleAt = function () {   // for checks: the main menu (sel, items, gold) and where the front is
        var x = FE.ph.extras && FE.ph.extras.items ? FE.ph.extras.items() : [], o = FE.ph.options && FE.ph.options.items ? FE.ph.options.items() : [];
        return { sel: FE.sel, items: FE.items(), gold: FE.gold, phase: FE.phase, ask: !!FE.ask, extras: x, options: o, xsel: FE.xsel, osel: FE.osel, tab: FE.tab, soon: !FE.modes(), leaving: FE.leave || '' };
      };
      // ---- TITLE: the logo drops in, a shine runs across it every few seconds, PRESS START ----
      FE.ph.title = {
        enter: function (how) { if (how === 'drop') { FE.drop = 0; FE.shine = -1; } else FE.drop = Math.max(FE.drop, 0.5); Q.music('title'); },   // 'drop': in from the splash, the logo falls in
        update: function (dt) {
          var was = FE.drop;
          FE.drop += dt;
          if (was < 0.5 && FE.drop >= 0.5) { Q.sfx('land'); FE.shine = 0; FE.quake = 0.18; }
          if (FE.press('start') || FE.press('a')) { Q.sfx('select'); FE.drop = Math.max(FE.drop, 0.5); FE.to('menu', 0); }
        },
        draw: function (g, t) {
          var k = (FE.drop - 0.5) % 1.1, tips = Q.story && Q.story.tips, tk;
          if (FE.drop >= 0.5 && k < 0.75) U.text('PRESS START', MX, 126, '#ffd23f', 2, 'center');   // a slow blink, small on the screen (XAG 118)
          if (tips && tips.length) { tk = (t % 5) / 5; U.text(String(tips[Math.floor(t / 5) % tips.length]), 160, 168, tk < 0.06 || tk > 0.94 ? '#3c4680' : '#7f8ab8', 1, 'center'); }   // STORY's tips (part 13, 13)
          U.mk.foot(g, '', ''); U.text('MADE ON THE NINTH FLOOR', 160, 183, U.mk.C.muted, 1, 'center');
        }
      };
      // ---- MENU ----
      FE.ph.menu = {
        enter: function (sel) { var n = FE.items().length; FE.sel = typeof sel === 'number' ? Q.clamp(sel, 0, n - 1) : 0; FE.ask = false; Q.music('title'); },
        update: function () {
          var list = FE.items(), it;
          if (FE.ask) {   // NEW GAME over a save: ask first (NO is the default)
            if (FE.press('left') || FE.press('right') || FE.press('up') || FE.press('down')) { FE.askSel = 1 - FE.askSel; U.mk.snd('move'); }
            if (FE.press('b')) { FE.ask = false; U.mk.snd('back'); return; }
            if (FE.press('a') || FE.press('start')) { FE.ask = false; if (FE.askSel) FE.go('start'); else U.mk.snd('back'); }
            return;
          }
          if (FE.press('b')) { U.mk.snd('back'); FE.to('title'); return; }   // back to PRESS START (the logo already in place)
          FE.sel = FE.move(Math.min(FE.sel, list.length - 1), list.length);
          if (!(FE.press('a') || FE.press('start'))) return;
          it = list[FE.sel];
          if (it === 'CONTINUE') FE.go('continue');
          else if (it === 'NEW GAME') { if (FE.has) { FE.ask = true; FE.askSel = 0; U.mk.snd('open'); } else FE.go('start'); }
          else if (it.indexOf('FILE ') === 0) FE.go('files');
          else if (it === 'GAME MODES') {
            if (FE.modes()) { U.mk.snd('pick'); FE.back('menu', 'GAME MODES', FE.MODES); Q.go(FE.MODES); }   // BATTLE's own screen; its B comes back here
            else { U.mk.snd('no'); FE.soon = 1.4; }   // COMING SOON: nothing starts
          }
          else if (it === 'OPTIONS') { U.mk.snd('pick'); FE.to('options', 0); }
          else if (it === 'EXTRAS') { U.mk.snd('pick'); FE.to('extras', 0); }
        },
        draw: function (g, t) { FE.drawMenu(g, t); }
      };
      FE.line = function (it) {   // what a menu item does, on the line under the menu
        var n = Q.fileNow ? Q.fileNow() : 1;
        if (it === 'CONTINUE') return 'CARRY ON IN FILE ' + n;
        if (it === 'NEW GAME') return FE.has ? 'START OVER IN FILE ' + n : 'START FILE ' + n + ' FROM THE TOP';
        if (String(it).indexOf('FILE ') === 0) return 'THREE FILES, LIKE OLD CARTRIDGES';
        if (it === 'GAME MODES') return FE.modes() ? 'BATTLE, AND MORE ON THE WAY' : 'COMING SOON';
        if (it === 'OPTIONS') return 'MUSIC, TEXT SPEED, THE CONTROLS';
        if (it === 'EXTRAS') return 'THE CODEX, GOLD STARS, CREDITS';
        return '';
      };
      FE.ribbon = function (g, x, y, r, wig) {   // COMING SOON: a light red band with white letters, from x across the row, folded round the box's right edge (r) with a tail behind
        var s = 'COMING SOON', tx, yy = y + (wig || 0), i;
        g.fillStyle = '#a5383b'; for (i = 0; i < 9; i++) g.fillRect(r + 1, yy + 1 + i, i === 3 || i === 4 || i === 5 ? 4 : 6, 1);   // the tail behind the box, cut like a swallowtail
        g.fillStyle = '#7d2629'; g.fillRect(r - 3, yy, 4, 11);   // where it folds round the edge: darker
        g.fillStyle = '#f27f7f'; g.fillRect(x, yy, r - 3 - x, 11);
        g.fillStyle = '#ffb3b0'; g.fillRect(x, yy, r - 3 - x, 1);
        g.fillStyle = '#d65c5e'; g.fillRect(x, yy + 10, r - 3 - x, 1);
        tx = x + ((r - 3 - x) >> 1) - (U.width(s) >> 1);
        U.text(s, tx + 1, yy + 3, '#a5383b'); U.text(s, tx, yy + 2, '#ffffff');
      };
      FE.drawMenu = function (g) {   // B20: in the menu kit's window (71-ui-menu.js), its foot on the screen's foot band
        var list = FE.items(), n = list.length, i, rows = [], K = U.mk, h = 6 + n * K.ROW + 3, top = 178 - h, soon;
        function stars(gx, y, on) { var s = FE.gold.n + '/' + FE.gold.all; U.starIcon(Q.g, gx - U.width(s) - 15, y - 3, FE.gold.n > 0); U.text(s, gx, y, on ? K.C.ink : FE.gold.n > 0 ? K.C.yel : K.C.muted, 1, 'right'); }
        for (i = 0; i < n; i++) rows.push({ label: list[i], off: list[i] === 'GAME MODES' && !FE.modes(),
          draw: list[i] === 'CONTINUE' && FE.gold ? function (g2, x, y, on) { stars(BX + BW - 9, y, on); } : null });   // the save's GOLD STARS beside CONTINUE (part 14.2)
        K.window(g, BX, top, BW, h, '', 'fe-menu', function () { K.list(g, BX, top + 6, BW, rows, FE.ask ? -1 : FE.sel, 'fe-menu'); });
        for (i = 0; i < n; i++) {   // COMING SOON folds round the window's edge, so it is drawn over it, outside its clip
          soon = list[i] === 'GAME MODES' && !FE.modes();
          if (soon && K.opening('fe-menu') >= 1) FE.ribbon(g, BX + 24 + U.width(list[i]), top + 4 + i * K.ROW, BX + BW, FE.soon > 0 ? (Math.floor(FE.t * 30) % 2 ? 1 : -1) : 0);
        }
        FE.foot(FE.line(list[FE.sel]), 'A: CHOOSE  B: BACK');
        if (FE.ask) K.ask(g, 'fe-ask', 'NEW GAME', ['START A NEW GAME?', 'FILE ' + (Q.fileNow ? Q.fileNow() : 1) + "'S SAVE WILL BE REPLACED."], ['NO', 'YES'], FE.askSel, { danger: true });
      };
      FE.foot = function (left, right) { U.mk.foot(Q.g, left, right); };   // the band at the foot of every menu screen: what the chosen thing does, and the buttons (B20: the kit's)
      // ---- what every screen after the splash stands on: the night and its drift, the podium and the conductor keeping time, the logo ----
      function logo(g, t) {
        var x = LX, y = LY + Math.round(Math.sin(t * 1.6) * 1), p, i, sx, tip = U.logoTip ? U.logoTip() : null, K = U.logoKit;
        if (FE.drop < 0.5) { p = FE.drop / 0.5; y = LY - Math.round((1 - p * p) * 112); }   // it falls into place, faster as it comes
        if (FE.quake > 0) y += Math.floor(FE.quake * 40) % 2 ? 1 : -1;
        Q.spr(g, 'u5-logo', 0, x, y);
        if (FE.shine >= 0 && FE.shine < 0.6 && FE.drop >= 0.5) {   // the shine: the logo's faces (frame 1) seen through a slanted band, left to right in 0.6 s
          sx = Math.round(-60 + FE.shine / 0.6 * 300);
          g.save(); g.beginPath();
          for (i = 0; i < 98; i += 2) g.rect(x + sx + ((98 - i) >> 1), y + i, 9, 2);
          g.clip(); g.globalAlpha = 0.8; Q.spr(g, 'u5-logo', 1, x, y); g.restore();
        }
        if (tip && K && FE.drop >= 0.5 && Math.floor(t * 2.5) % 5 === 0) K.sparkle(g, x + tip.x, y + tip.y, 9, '#ffffff', '#fff6c0');   // the baton's spark twinkles
      }
      function back(g, t) {
        var i, d, noteSpr = U.frames('note') ? 'note' : 'u5-note', b = U.beat('title');
        U.bands(g, FE.SKY, 0, 8);
        U.fill(g, 0, 152, 320, 48, '#1a2350'); U.fill(g, 0, 152, 320, 1, '#2a3878');
        for (i = 0; i < FE.stars.length; i++) { d = FE.stars[i]; g.fillStyle = Math.sin(t * 2 + d.ph) > 0.6 ? '#ffffff' : '#5d6a9e'; g.fillRect(d.x, d.y, 1, 1); }
        g.save(); g.beginPath(); g.rect(0, 0, 320, 152); g.clip();   // the drift sinks behind the horizon
        for (i = 0; i < FE.drift.length; i++) { d = FE.drift[i]; Q.spr(g, d.k === 0 ? 'u5-env' : d.k === 1 ? 'u5-tix' : 'u5-note', 0, Math.round(d.x), Math.round(d.y + Math.sin(t + d.ph) * 2)); }
        g.restore();
        U.fill(g, CX - 10, CY + 60, 68, 16, '#1d1d24'); U.fill(g, CX - 9, CY + 61, 66, 14, '#7a4a2a'); U.fill(g, CX - 9, CY + 61, 66, 2, '#a86f43'); U.fill(g, CX - 9, CY + 70, 66, 1, '#5e3a22');
        U.sprite(g, U.hero(), FE.leave === 'start' ? 6 : (Math.floor(t / b) % 2 ? 9 : 8), CX, CY, 3);   // one stroke a beat of the title song
        for (i = 0; i < FE.notes.length; i++) { d = FE.notes[i]; g.globalAlpha = Q.clamp(1.8 - d.t, 0, 1); Q.spr(g, noteSpr, d.k, Math.round(d.x), Math.round(d.y)); }
        g.globalAlpha = 1;
        logo(g, t);
        U.badge(g, 15, 13, FE.won);
        if (FE.won) {   // the game was finished: our own small mark of it
          if (Math.floor(t * 1.5) % 4 === 0) { U.fill(g, 26, 4, 1, 3, '#fff1a8'); U.fill(g, 25, 5, 3, 1, '#fff1a8'); }
          U.text('THE BACKLOG', 6, 27, '#ffd23f'); U.text('IS TRIMMED', 6, 36, '#ffd23f');
        }
      }
      Q.defScene('title', {
        enter: function (opts) { U.entered();
          var ret, list, i;
          opts = opts || {};
          U.cancel(); U.clearToasts(); U.mapKeep = false; U.lastWorld = 0; U.lastStop = '';
          FE.t = 0; FE.has = U.hasSave(); FE.any = U.anySave ? U.anySave() : false; FE.won = !!(Q.SAVE && Q.SAVE.won);
          FE.gold = FE.has ? U.starCount(Q.SAVE && Q.SAVE.stars ? Q.SAVE : U.stored()) : null;   // the save's gold stars, for CONTINUE
          FE.leave = ''; FE.fade = 0; FE.ask = false; FE.beatN = -1; FE.soon = 0; FE.quake = 0; FE.drop = 0.5; FE.shine = 0; FE.inCodex = false;
          seed(); U.applyOpt();   // the MUSIC setting from the save, put back at the start
          ret = opts.back ? { ph: opts.ph || 'menu', item: String(opts.back) } : FE.ret && FE.left === FE.ret.via && FE.leftAt === U.now() ? FE.ret : null;   // back from where we went (only straight back from it)
          FE.ret = null;
          if (FE.opened !== Q.api) { FE.opened = Q.api; if (FE.ph.boot) { FE.to('boot'); return; } FE.to('title', 'drop'); return; }   // the game has just been opened: the splash, then the title
          if (ret && ret.ph !== 'menu' && ret.ph !== 'boot' && FE.ph[ret.ph]) { FE.to(ret.ph, ret.item); return; }   // back into EXTRAS, or OPTIONS (B20: from its SYSTEM screen), on that row
          list = FE.items(); i = ret ? FE.find(list, ret.item) : -1;
          FE.to('menu', i >= 0 ? i : 0);
        },
        update: function (dt) {
          var i, d, b = U.beat('title'), n, p = FE.ph[FE.phase];
          FE.t += dt; FE.pt += dt;
          if (FE.soon > 0) FE.soon -= dt; if (FE.quake > 0) FE.quake -= dt;
          if (FE.shine >= 0 && FE.drop >= 0.5) { FE.shine += dt; if (FE.shine > 4.5) FE.shine = 0; }
          for (i = 0; i < FE.drift.length; i++) { d = FE.drift[i]; d.x += d.vx * dt; d.y += d.vy * dt; if (d.x < -14) d.x += 340; if (d.y > 204) d.y -= 214; }
          n = Math.floor(FE.t / b);
          if (n !== FE.beatN) { FE.beatN = n; if (n % 2 === 0 && FE.phase !== 'boot') FE.notes.push({ x: CX + 42, y: CY + 4, t: 0, k: FE.notes.length % 2 }); }
          for (i = FE.notes.length - 1; i >= 0; i--) { d = FE.notes[i]; d.t += dt; d.y -= 16 * dt; d.x += (5 + 6 * Math.sin(d.t * 4)) * dt; if (d.t > 1.8) FE.notes.splice(i, 1); }
          if (FE.leave) { FE.fade += dt / 0.45; if (FE.fade >= 1) gone(); return; }
          if (Q.talking()) return;
          if (p && p.update) p.update(dt);
        },
        draw: function (g) {
          var p = FE.ph[FE.phase], t = FE.t;
          if (Q.scene !== 'title') { back(g, t); return; }   // drawn under the codex opened from EXTRAS (its backdrop): the night, the conductor and the logo only
          if (FE.phase !== 'boot') back(g, t);
          if (p && p.draw) p.draw(g, t);
          if (FE.leave) { g.globalAlpha = Q.clamp(FE.fade, 0, 1); U.fill(g, 0, 0, 320, 200, '#000000'); g.globalAlpha = 1; }
          U.drawTalk(g);
        },
        sides: function (g) {   // a wide screen's sides (the engine clips to them): the splash's dark, or the sky, stars of their own, the drift carried on every 340 px, the horizon, the foot band, the fade
          var i, k, d, t = FE.t, ox = Q.OX, st = FE.sstars || [];
          if (FE.phase === 'boot') { if (FE.ph.boot && FE.ph.boot.sides) FE.ph.boot.sides(g); else U.fill(g, 0, 0, Q.W, 200, '#0b0c10'); return; }
          U.bands(g, FE.SKY, 0, 8, Q.W);
          U.fill(g, 0, 152, Q.W, 48, '#1a2350'); U.fill(g, 0, 152, Q.W, 1, '#2a3878');
          for (i = 0; i < st.length; i++) { d = st[i]; g.fillStyle = Math.sin(t * 2 + d.ph) > 0.6 ? '#ffffff' : '#5d6a9e'; g.fillRect(d.x, d.y, 1, 1); }
          g.save(); g.beginPath(); g.rect(0, 0, Q.W, 152); g.clip();
          for (i = 0; i < FE.drift.length; i++) { d = FE.drift[i]; for (k = -1; k <= 1; k++) Q.spr(g, d.k === 0 ? 'u5-env' : d.k === 1 ? 'u5-tix' : 'u5-note', 0, ox + Math.round(d.x) + k * 340, Math.round(d.y + Math.sin(t + d.ph) * 2)); }
          g.restore();
          if (Q.scene === 'title') { U.fill(g, 0, 179, Q.W, 15, U.mk.C.foot); U.fill(g, 0, 179, Q.W, 1, U.mk.C.hi); }   // (under the codex: no foot band) B20: the kit's band
          if (FE.leave) { g.globalAlpha = Q.clamp(FE.fade, 0, 1); U.fill(g, 0, 0, Q.W, 200, '#000000'); g.globalAlpha = 1; }
        },
        leave: function () { FE.notes = []; }
      });
      U.badge = function (g, cx, cy, gold) {   // the office's own label: 9F, white on a round orange badge (gold once the game is finished)
        var r = [5, 7, 8, 9, 9, 9, 9, 9, 8, 7, 5], i;
        for (i = 0; i < r.length; i++) { U.fill(g, cx - r[i] - 1, cy - 5 + i - 1, r[i] * 2 + 2, 3, '#1d1d24'); }
        for (i = 0; i < r.length; i++) U.fill(g, cx - r[i], cy - 5 + i, r[i] * 2, 1, gold ? (i < 3 ? '#fff1a8' : '#ffd23f') : (i < 3 ? '#ffa64d' : '#ff8a1e'));
        U.text('9F', cx - 5, cy - 3, gold ? '#7a4a10' : '#ffffff');
      };
    })();
