    // ---------- 75-ui-pause.js: the pause menu, over the level or the map (UI, builder 5) ----------
    // Q.go('pause', { from: 'level' | 'map' }): the scene it came from is drawn under a dark veil (it does not move on). RESUME (or B, or Start) goes back
    // with { resume: true }; CODEX opens the memos; MAP (from a level) and TITLE ask first, then Q.saveGame() and go (QUEST-API.md part 13, 2).
    // Beside the menu: LV and the XP to the next, hearts, power, rhythm, tokens, memos found of 24, time; under it the abilities learned with their how lines.
    // Version 116 (part 14): STARS n/32 at the right of the header; opening it (not coming back from the codex) sends the event 'pause'.
    (function () {
      var U = Q.ui, PA = { from: 'level', sel: 0, ask: '', askSel: 0, t: 0, warned: false };
      function items() {   // the BOW TIE row once the GOLD BOW TIE is bought (part 13, 25)
        var tie = !!(Q.SAVE && Q.SAVE.shop && Q.SAVE.shop.bowtie), l = ['RESUME', 'CODEX', 'MUSIC', 'TEXT'];
        if (tie) l.push('BOW TIE');
        l.push('CODES');   // the cheat codes (75-ui-codes.js, 14.10 item 11): after the settings, so MAP and TITLE stay last
        if (U.host && U.host.has()) l.push('SYSTEM');   // B20: the page's own settings, saves and manual (78-ui-system.js), only where a page offers them
        if (PA.from !== 'map') l.push('MAP');
        l.push('TITLE');
        return l;
      }
      U.setOpt = function (name, v) {   // a player's setting: into Q.SAVE.opt, and into this file's stored copy at once; nothing else in the store changes
        // (the raw store read fresh, as the stopwatch keeps its clock: Q.api.load() hands back the live save, so writing that stored all of it, tokens and a checkpoint
        // picked up after the last coffee mug included; found by B19, 2 Nov 2026. A file never stored yet keeps the setting at its first save.)
        var s = Q.SAVE, raw = null, f;
        if (!s) return;
        if (!s.opt || typeof s.opt !== 'object') s.opt = {};
        s.opt[name] = v;
        if (!engRaw || typeof engRaw.load !== 'function' || typeof engRaw.save !== 'function') return;
        try { raw = engRaw.load(); } catch (e) { raw = null; }
        if (!raw || !raw.files3 || !raw.files || raw.files.length !== 3 || (raw.cur | 0) !== engFilesGet().cur) return;
        f = raw.files[raw.cur | 0];
        if (!f || typeof f !== 'object') return;
        if (!f.opt || typeof f.opt !== 'object') f.opt = {};
        f.opt[name] = v;
        try { engRaw.save(raw); } catch (e2) {}
      };
      U.pauseFrom = function () { return PA.from; };   // B20: the scene under the pause (the SYSTEM screen draws it too)
      U.AB_HOW = 188;   // B20: the room for an ability's how line in the pause menu's ABILITIES window, in pixels (U.width): 31 letters
      U.tieOpt = function () { return Q.SAVE && Q.SAVE.opt && Q.SAVE.opt.bowtie === 'white' ? 'WHITE' : 'GOLD'; };
      function tieSwap() { U.setOpt('bowtie', U.tieOpt() === 'GOLD' ? 'white' : 'gold'); }
      // ---- the MUSIC row: FULL, LOW or OFF, as 1, 0.5 and 0 times AUDIO's own level (Q.au.MUSIC as it was made); kept in Q.SAVE.opt.music, put back at
      // the title, written into the stored save at once (nothing else in it changes). The office's own sound switch still rules over everything.
      var MUS = ['FULL', 'LOW', 'OFF'], MK = { FULL: 1, LOW: 0.5, OFF: 0 };
      U.musicOpt = function () { var o = Q.SAVE && Q.SAVE.opt, m = o && o.music; return MK[m] !== undefined ? m : 'FULL'; };
      U.applyOpt = function () {
        if (!Q.au || typeof Q.au.MUSIC !== 'number') return;
        if (U.musicBase === undefined) U.musicBase = Q.au.MUSIC;
        Q.au.MUSIC = U.musicBase * MK[U.musicOpt()];
      };
      U.setMusic = function (m) { if (MK[m] === undefined) return; U.setOpt('music', m); U.applyOpt(); };
      function textSwap() { U.setOpt('text', U.textFast() ? 'normal' : 'fast'); }   // TEXT: NORMAL or FAST (the box types about 2.5 times quicker)
      function label(it) { return it === 'MUSIC' ? 'MUSIC: ' + U.musicOpt() : it === 'BOW TIE' ? 'BOW TIE: ' + U.tieOpt() : it === 'TEXT' ? 'TEXT: ' + (U.textFast() ? 'FAST' : 'NORMAL') : it; }
      function resume() { var from = PA.from; U.mk.snd('back'); U.later(function () { Q.go(from, { resume: true }); }); }   // next frame: the level never sees this Start
      U.clock = function (secs) {   // seconds as H:MM:SS, or M:SS under an hour
        var s = Math.max(0, Math.floor(secs || 0)), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, r = s % 60;
        return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (r < 10 ? '0' : '') + r;
      };
      U.under = function (g, from) {   // the scene it came from, drawn still (as the engine draws it: the level at the screen's width, a menu in its column), then a dark veil over the whole screen
        var sc = from && from !== 'pause' && from !== 'codex' ? Q.SCENE[from] : null;
        if (sc && sc.draw) { try { if (Q.drawScene) Q.drawScene(g, from); else sc.draw(g, Q); } catch (e) { if (!PA.warned) { PA.warned = true; Q.warn('pause: drawing ' + from + ' under the menu: ' + e); } } }
        g.globalAlpha = 0.72; U.fill(g, 0, 0, Q.W, 200, '#07080c'); g.globalAlpha = 1;
      };
      function choose(what) {
        if (what === 'RESUME') { resume(); return; }
        if (what === 'CODEX') { U.mk.snd('pick'); Q.go('codex', { from: PA.from }); return; }
        if (what === 'CODES') { U.mk.snd('pick'); Q.go('codes', { from: PA.from }); return; }
        if (what === 'SYSTEM') { U.mk.snd('pick'); U.host.open({ back: 'pause', under: PA.from }); return; }
        if (what === 'MUSIC') { U.setMusic(MUS[(MUS.indexOf(U.musicOpt()) + 1) % 3]); U.mk.snd('value'); return; }
        if (what === 'BOW TIE') { tieSwap(); U.mk.snd('value'); return; }
        if (what === 'TEXT') { textSwap(); U.mk.snd('value'); return; }
        PA.ask = what; PA.askSel = 0; U.mk.snd('open');
      }
      function askDone() {
        var what = PA.ask; PA.ask = '';
        if (!PA.askSel) { U.mk.snd('back'); return; }
        U.mk.snd('pick'); Q.saveGame();
        if (what === 'MAP') Q.go('map'); else Q.go('title');
      }
      Q.defScene('pause', {
        wide: true,   // the scene under it at the screen's width, the veil and the header band across it, the menu in the centred 320 column
        enter: function (opts) { U.entered();
          opts = opts || {};
          PA.from = opts.from || (opts.back ? PA.from : 'level'); PA.ask = ''; PA.t = 0;
          PA.sel = opts.back === 'codex' ? 1 : opts.back === 'codes' || opts.back === 'system' ? Math.max(0, items().indexOf(opts.back.toUpperCase())) : 0;
          if (!opts.back) { U.mk.snd('open'); U.emit('pause', { from: PA.from }); }   // part 14.1: only when it opens, not back from the codex (or the SYSTEM screen)
        },
        update: function (dt) {
          PA.t += dt;
          if (U.runLater()) return;
          if (PA.ask) {
            if (U.press('left') || U.press('right') || U.press('up') || U.press('down')) { PA.askSel = 1 - PA.askSel; U.mk.snd('move'); }
            if (U.press('b')) { PA.ask = ''; U.mk.snd('back'); return; }
            if (U.press('a') || U.press('start')) askDone();
            return;
          }
          if (U.press('start') || U.press('b')) { resume(); return; }
          PA.sel = U.menuMove(PA.sel, items().length);
          if (items()[PA.sel] === 'BOW TIE' && (U.press('left') || U.press('right'))) { tieSwap(); U.mk.snd('value'); }
          if (items()[PA.sel] === 'TEXT' && (U.press('left') || U.press('right'))) { textSwap(); U.mk.snd('value'); }
          if (items()[PA.sel] === 'MUSIC') {
            if (U.press('left')) { U.setMusic(MUS[(MUS.indexOf(U.musicOpt()) + 2) % 3]); U.mk.snd('value'); }
            else if (U.press('right')) { U.setMusic(MUS[(MUS.indexOf(U.musicOpt()) + 1) % 3]); U.mk.snd('value'); }
          }
          if (U.press('a')) choose(items()[PA.sel]);
        },
        draw: function (g) {
          var C = U.mk.C;
          U.under(g, PA.from);
          U.fill(g, 0, 0, Q.W, 27, C.foot); U.fill(g, 0, 27, Q.W, 1, C.hi); U.fill(g, 0, 179, Q.W, 21, C.foot); U.fill(g, 0, 179, Q.W, 1, C.hi);   // the header and the foot bands span the screen, so the HUD under them never shows through
          Q.col(g, pauseMenu);   // B20: the kit's windows in the centred 320 column
        }
      });
      var HELP = { RESUME: 'BACK TO PLAY', CODEX: 'THE MEMOS, BESTIARY AND TIMES', MUSIC: 'FULL, LOW OR OFF', TEXT: 'HOW FAST THE TEXT BOX TYPES',   // each fits beside A: CHOOSE  B: BACK
        'BOW TIE': 'GOLD, OR THE WHITE IT WAS', CODES: 'TYPE A CODE: EIGHT PRESSES', SYSTEM: 'SCREEN, SOUND, SAVES, MANUAL', MAP: 'SAVE, AND OUT TO THE MAP', TITLE: 'SAVE, AND BACK TO THE TITLE' };
      function value(it) { return it === 'MUSIC' ? U.musicOpt() : it === 'BOW TIE' ? U.tieOpt() : it === 'TEXT' ? (U.textFast() ? 'FAST' : 'NORMAL') : ''; }
      function pauseMenu(g) {   // the menu at the left, LV and the numbers at the top right, the abilities under them
          var K = U.mk, C = K.C, s = U.stat(), list = items(), i, x, y, n, ab = ['dash', 'hover', 'pound'], a, any = 0, rows = [], rh = list.length > 9 ? 11 : 12;
          for (i = 0; i < list.length; i++) rows.push({ label: list[i], value: value(list[i]) });
          U.text('PAUSED', 160, 7, C.cream, 2, 'center');
          n = U.starCount();   // GOLD STARS won (part 14.2), at the right of the header
          U.starIcon(g, 312 - U.width('STARS ' + n.n + '/' + n.all) - 15, 8, n.n > 0);
          U.text('STARS ' + n.n + '/' + n.all, 312, 11, n.n > 0 ? C.yel : C.muted, 1, 'right');
          K.window(g, 2, 30, 118, Math.min(146, 21 + list.length * rh + 2), 'MENU', 'pause-menu', function () { K.list(g, 2, 49, 118, rows, PA.ask ? -1 : PA.sel, 'pause-menu', { row: rh, pad: 12, right: 7 }); });
          // the right column 195 wide (123 to 317): an ability's how line fits on one line from 128 when it is U.AB_HOW pixels or less, 31 letters (2 Nov: FIRM HAND's ran over at 190 wide)
          K.window(g, 123, 30, 195, 68, 'LV ' + s.lv, 'pause-lv', function () {
            U.text(s.next ? 'NEXT LV: ' + s.next + ' XP' : 'TOP LV!', 300, 35, C.help, 1, 'right');
            U.fill(g, 129, 49, 183, 4, C.ink); U.fill(g, 130, 50, 181, 2, C.hi); if (s.part > 0) U.fill(g, 130, 50, Math.max(1, Math.round(181 * s.part)), 2, C.teal);
            U.text('HEARTS', 131, 57, C.muted);
            n = Q.clamp(Math.round(s.maxHp), 1, 8);
            for (i = 0; i < n; i++) Q.spr(g, 'ui-heart', i < Math.round(s.hp) ? 0 : 1, 173 + i * 9, 56);
            U.text(Math.round(s.hp) + '/' + n, 310, 57, C.cream, 1, 'right');
            U.text('POWER ' + s.power, 131, 67, C.cream);
            U.text('RHYTHM', 201, 67, C.muted);
            for (i = 0; i < Q.clamp(Math.round(s.rhythmMax), 0, 6); i++) Q.spr(g, 'ui-note', i < Math.floor(s.rhythm + 0.001) ? 0 : 1, 243 + i * 8, 66);
            U.text('TOKENS ' + Math.floor(s.tokens), 131, 77, C.yel);
            U.text('MEMOS ' + s.memos + '/24', 310, 77, C.cream, 1, 'right');
            if (U.watchCode && U.watchCode()) {   // the play time (B19, part 20), a file with codes: an orange star before it and CODES after it (B20: in the LV window)
              U.text('TIME', 131, 87, C.muted); U.watchMark(161, 87); U.text(U.clock(s.time), 167, 87, C.muted); U.text('CODES', 173 + U.width(U.clock(s.time)), 87, '#ff8a1e');
            } else U.text('TIME ' + U.clock(s.time), 131, 87, C.muted);
            U.text('FALLS ' + s.falls, 310, 87, C.muted, 1, 'right');
          }, { noLight: true });
          K.window(g, 123, 102, 195, 74, 'ABILITIES', 'pause-ab', function () {
            for (i = 0; i < ab.length; i++) {
              a = Q.ABILITY[ab[i]]; if (!a || !U.learned(ab[i])) continue;
              y = 121 + any * 18; any++;
              Q.spr(g, 'ic-' + ab[i], 0, 128, y - 3);
              U.text(a.name, 144, y - 1, C.cream); U.text(a.how, 128, y + 8, C.help);
            }
            if (!any) { U.text('NONE YET. SAVE AN AGENT', 220, 128, C.dim, 1, 'center'); U.text('TO LEARN ONE.', 220, 138, C.dim, 1, 'center'); }
            if (any < 3) { U.fill(g, 129, 151, 183, 1, C.hi); U.text('A: JUMP  B: BATON', 220, 155, C.muted, 1, 'center'); U.text('HOLD B, LET GO: A NOTE', 220, 164, C.muted, 1, 'center'); }   // the play controls, while there is room
          }, { noLight: true });
          K.foot(g, PA.ask ? '' : HELP[list[PA.sel]] || '', PA.ask ? 'A: CHOOSE  B: NO' : 'A: CHOOSE  B: BACK');
          if (PA.ask) {
            x = 52; y = 70;
            K.ask(g, 'pause-ask', PA.ask === 'MAP' ? 'TO THE MAP' : 'TO THE TITLE', [PA.ask === 'MAP' ? 'LEAVE THIS LEVEL FOR THE MAP?' : 'QUIT TO THE TITLE?', 'YOUR GAME IS SAVED FIRST.'], ['NO', 'YES'], PA.askSel);
          }
      }
    })();
