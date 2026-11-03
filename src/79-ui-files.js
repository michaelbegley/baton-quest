    // ---------- 79-ui-files.js (UI, the director's, 2 Nov): the file screen, three files like the old cartridges (QUEST-API 14.10 item 10) ----------
    // From the title's menu, FILE n (B17's front end, 2 Nov: B comes back to the menu on FILE). Each file: its hearts, LV, worlds cleared, gold stars and time played, or NEW GAME. A on a file plays it (a used one
    // carries on where it was saved, an empty one starts the intro); ERASE A FILE, then a file, then YES empties it (NO is the default). B: back.
    (function () {
      var U = Q.ui, FS = { sel: 0, erase: false, ask: false, askSel: 0, leave: '', fade: 0, t: 0, opt: null };
      var SKY = U.grad('#090d26', '#1d2858', 19), CX = 24, CW = 272, CH = 40;
      function cardY(i) { return 25 + i * 44; }
      function backup() { return !FS.erase && !!(U.host && U.host.has() && U.host.can('saveFile')); }   // B20: BACK UP OR MOVE THEM, only where the page offers its saves (78-ui-system.js)
      function rows() { return FS.erase ? 4 : backup() ? 5 : 4; }
      U.anySave = function () { var f = Q.files ? Q.files() : [], i; for (i = 0; i < f.length; i++) if (!f[i].empty) return true; return false; };
      U.filesAt = function () { return { sel: FS.sel, erase: FS.erase, ask: FS.ask, files: Q.files ? Q.files() : [] }; };   // for checks
      function leave(what) { FS.leave = what; FS.fade = 0; U.mk.snd('pick'); }
      function go() {
        var what = FS.leave; FS.leave = '';
        if (what === 'start') {   // a new game in this file: the player's settings come along from the file before
          Q.newGame(); if (FS.opt && Q.SAVE) Q.SAVE.opt = FS.opt; U.applyOpt();
          if (Q.scene === 'files') Q.go('intro');
        } else { U.applyOpt(); Q.continueGame(); if (Q.scene === 'files') Q.go('map'); }   // a used file carries on with its own settings (its MUSIC level at once: B17)
      }
      function card(g, f, i) {   // B20: a kit window; its FILE label is the picked bar (red while erasing), its brackets yellow (or red) when picked
        var y = cardY(i), on = i === FS.sel && !FS.ask, k, x = CX + 64, K = U.mk, C = K.C, red = FS.erase;
        K.frame(g, CX, y, CW, CH, on ? { accent: red ? C.red : C.yel } : { accent: C.hi, fill: '#0e1324' });
        if (on) K.bar(g, CX + 3, y + 6, 54, red ? { col: C.red, tab: C.redD } : null);
        U.item('FILE ' + f.n, CX + 16, y + 6, on, false, null, 1, 'bar');
        U.sprite(g, U.hero(), on && !f.empty && Math.floor(FS.t * 2) % 2 ? 9 : 8, CX + 22, y + 17, 1);
        if (f.empty) { U.text('NEW GAME', x, y + 14, on ? C.cream : C.dim, 2); return; }
        for (k = 0; k < f.hearts; k++) U.text('~', x + k * 8, y + 8, '#ff5a7a');
        U.text('LV ' + f.lv, x + 76, y + 8, C.cream);
        if (f.won) U.text('ALL DONE', CX + CW - 9, y + 8, C.yel, 1, 'right');
        U.text('WORLDS ' + f.worlds + '/4', x, y + 24, C.help);
        U.starIcon(g, x + 84, y + 21, f.stars > 0); U.text(f.stars + '/' + U.starIds().length, x + 99, y + 24, f.stars > 0 ? C.yel : C.muted);
        U.text(U.clock(f.time), CX + CW - 9, y + 24, C.muted, 1, 'right');   // its play time (B19, part 20)
        if (f.code) {   // a file where a cheat code was typed: an orange star before its time and a CODES stamp on the top row (B19's, like an old cartridge's sticker)
          if (U.watchMark) U.watchMark(CX + CW - 16 - U.width(U.clock(f.time)), y + 24);
          U.text('CODES', f.won ? CX + CW - 17 - U.width('ALL DONE') : CX + CW - 9, y + 8, '#ff8a1e', 1, 'right');
        }
      }
      Q.defScene('files', {
        enter: function (opts) {
          U.entered(); U.cancel(); U.clearToasts();
          FS.erase = false; FS.ask = false; FS.leave = ''; FS.fade = 0; FS.t = 0;
          FS.sel = opts && opts.back === 'backup' && backup() ? 4 : Q.fileNow ? Q.fileNow() - 1 : 0;   // back from the SYSTEM screen's saves: on BACK UP
          FS.opt = Q.SAVE && Q.SAVE.opt ? Q.SAVE.opt : null;
          Q.music('title');
        },
        update: function (dt) {
          var f, list;
          FS.t += dt;
          if (FS.leave) { FS.fade += dt / 0.45; if (FS.fade >= 1) go(); return; }
          if (Q.talking()) return;
          if (FS.ask) {   // ERASE FILE n? NO is the default
            if (U.press('left') || U.press('right') || U.press('up') || U.press('down')) { FS.askSel = 1 - FS.askSel; U.mk.snd('move'); }
            if (U.press('b')) { FS.ask = false; U.mk.snd('back'); return; }
            if (U.press('a') || U.press('start')) {
              FS.ask = false;
              if (FS.askSel) { Q.eraseFile(FS.sel + 1); FS.erase = false; Q.sfx('hit'); } else U.mk.snd('back');
            }
            return;
          }
          FS.sel = U.menuMove(Math.min(FS.sel, rows() - 1), rows());
          if (U.press('b')) { if (FS.erase) { FS.erase = false; U.mk.snd('back'); } else { U.mk.snd('back'); Q.go('title', { back: 'FILE' }); } return; }   // back to the title's menu, on FILE (B17)
          if (U.press('a') || U.press('start')) {
            if (FS.sel === 3) { FS.erase = !FS.erase; FS.sel = FS.erase ? 0 : 3; U.mk.snd('pick'); return; }
            if (FS.sel === 4) { U.mk.snd('pick'); U.host.open({ back: 'files', tab: 'saves', item: 'backup' }); return; }   // B20: the page's backups, on the SYSTEM screen's SAVES tab
            list = Q.files(); f = list[FS.sel];
            if (FS.erase) { if (f.empty) U.mk.snd('no'); else { FS.ask = true; FS.askSel = 0; U.mk.snd('open'); } return; }
            if (Q.SAVE && Q.SAVE.opt) FS.opt = Q.SAVE.opt;
            Q.useFile(f.n); leave(f.empty ? 'start' : 'continue');
          }
        },
        draw: function (g) {
          var list = Q.files ? Q.files() : [], i;
          var K = U.mk, C = K.C, low = FS.erase ? ['CANCEL'] : backup() ? ['ERASE A FILE', 'BACK UP OR MOVE THEM'] : ['ERASE A FILE'], j, y, on, by, f0 = list[FS.sel];
          U.bands(g, SKY, 0, 11);
          U.text(FS.erase ? 'ERASE WHICH FILE?' : 'CHOOSE A FILE', 160, 6, FS.erase ? '#ff8a8a' : C.cream, 2, 'center');
          for (i = 0; i < list.length; i++) card(g, list[i], i);
          for (j = 0; j < low.length; j++) {   // ERASE A FILE (CANCEL while erasing), then BACK UP OR MOVE THEM on a page
            y = 158 + j * 10; on = FS.sel === 3 + j && !FS.ask;
            if (on) { by = K.barY('files-low', y); K.bar(g, 160 - 66, by, 132); }
            U.item(low[j], 160, y, on, false, 'center', 1, 'bar');
          }
          if (by !== undefined && by !== 158 + (FS.sel - 3) * 10) K.glideInk(g, 160 - 66, by - 2, 132, K.ROW, 156, 158 + low.length * 10,   // gliding: as the menu kit's lists
            function () { for (j = 0; j < low.length; j++) if (3 + j !== FS.sel) U.text(low[j], 160, 158 + j * 10, C.ink, 1, 'center'); },
            function () { U.text(low[FS.sel - 3], 160, 158 + (FS.sel - 3) * 10, C.cream, 1, 'center'); });
          K.foot(g, FS.ask ? '' : FS.sel < 3 ? (FS.erase ? 'WHICH ONE?' : f0 && f0.empty ? 'A NEW GAME IN THIS FILE' : 'ON FROM ITS LAST SAVE') : FS.sel === 3 ? (FS.erase ? 'NOTHING IS ERASED' : 'EMPTY ONE OF THE FILES') : 'TO A FILE OR A CODE',
            FS.erase ? 'A: ERASE IT  B: CANCEL' : 'A: PLAY  B: BACK');
          if (FS.ask) K.ask(g, 'files-ask', 'ERASE', ['ERASE FILE ' + (FS.sel + 1) + '?', 'IT CANNOT BE UNDONE.'], ['NO', 'YES'], FS.askSel, { danger: true });
          if (FS.leave) { g.globalAlpha = Q.clamp(FS.fade, 0, 1); U.fill(g, 0, 0, 320, 200, '#000000'); g.globalAlpha = 1; }
          U.drawTalk(g);
        },
        leave: function () {}
      });
    })();
