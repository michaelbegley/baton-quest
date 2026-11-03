    // ---------- 79-ui-files.js (UI, the director's, 2 Nov): the file screen, three files like the old cartridges (QUEST-API 14.10 item 10) ----------
    // From the title's menu, FILE n (B17's front end, 2 Nov: B comes back to the menu on FILE). Each file: its hearts, LV, worlds cleared, gold stars and time played, or NEW GAME. A on a file plays it (a used one
    // carries on where it was saved, an empty one starts the intro); ERASE A FILE, then a file, then YES empties it (NO is the default). B: back.
    (function () {
      var U = Q.ui, FS = { sel: 0, erase: false, ask: false, askSel: 0, leave: '', fade: 0, t: 0, opt: null };
      var SKY = U.grad('#090d26', '#1d2858', 19), CX = 24, CW = 272, CH = 40;
      function cardY(i) { return 30 + i * 44; }
      U.anySave = function () { var f = Q.files ? Q.files() : [], i; for (i = 0; i < f.length; i++) if (!f[i].empty) return true; return false; };
      U.filesAt = function () { return { sel: FS.sel, erase: FS.erase, ask: FS.ask, files: Q.files ? Q.files() : [] }; };   // for checks
      function leave(what) { FS.leave = what; FS.fade = 0; Q.sfx('select'); }
      function go() {
        var what = FS.leave; FS.leave = '';
        if (what === 'start') {   // a new game in this file: the player's settings come along from the file before
          Q.newGame(); if (FS.opt && Q.SAVE) Q.SAVE.opt = FS.opt; U.applyOpt();
          if (Q.scene === 'files') Q.go('intro');
        } else { U.applyOpt(); Q.continueGame(); if (Q.scene === 'files') Q.go('map'); }   // a used file carries on with its own settings (its MUSIC level at once: B17)
      }
      function card(g, f, i) {
        var y = cardY(i), on = i === FS.sel && !FS.ask, k, x = CX + 64;
        U.box(g, CX, y, CW, CH, on ? (FS.erase ? '#ff5a5a' : '#ffd23f') : '#3c4680', on ? '#1d1d24' : '#141a3a');
        U.text('FILE ' + f.n, CX + 8, y + 7, on ? '#ffd23f' : '#c3c7d4');
        U.sprite(g, U.hero(), on && !f.empty && Math.floor(FS.t * 2) % 2 ? 9 : 8, CX + 14, y + 16, 1);
        if (f.empty) { U.text('NEW GAME', x, y + 14, on ? '#f6efe2' : '#7f8ab8', 2); return; }
        for (k = 0; k < f.hearts; k++) U.text('~', x + k * 8, y + 8, '#ff5a7a');
        U.text('LV ' + f.lv, x + 76, y + 8, '#f6efe2');
        if (f.won) U.text('ALL DONE', CX + CW - 8, y + 8, '#ffd23f', 1, 'right');
        U.text('WORLDS ' + f.worlds + '/4', x, y + 24, '#c3c7d4');
        U.starIcon(g, x + 84, y + 21, f.stars > 0); U.text(f.stars + '/' + U.starIds().length, x + 99, y + 24, f.stars > 0 ? '#ffd23f' : '#7f8ab8');
        U.text(U.clock(f.time), CX + CW - 8, y + 24, '#8f9ac8', 1, 'right');
      }
      Q.defScene('files', {
        enter: function () {
          U.entered(); U.cancel(); U.clearToasts();
          FS.sel = Q.fileNow ? Q.fileNow() - 1 : 0; FS.erase = false; FS.ask = false; FS.leave = ''; FS.fade = 0; FS.t = 0;
          FS.opt = Q.SAVE && Q.SAVE.opt ? Q.SAVE.opt : null;
          Q.music('title');
        },
        update: function (dt) {
          var f, list;
          FS.t += dt;
          if (FS.leave) { FS.fade += dt / 0.45; if (FS.fade >= 1) go(); return; }
          if (Q.talking()) return;
          if (FS.ask) {   // ERASE FILE n? NO is the default
            if (U.press('left') || U.press('right') || U.press('up') || U.press('down')) { FS.askSel = 1 - FS.askSel; Q.sfx('move'); }
            if (U.press('b')) { FS.ask = false; Q.sfx('back'); return; }
            if (U.press('a') || U.press('start')) {
              FS.ask = false;
              if (FS.askSel) { Q.eraseFile(FS.sel + 1); FS.erase = false; Q.sfx('hit'); } else Q.sfx('back');
            }
            return;
          }
          FS.sel = U.menuMove(FS.sel, 4);
          if (U.press('b')) { if (FS.erase) { FS.erase = false; Q.sfx('back'); } else { Q.sfx('back'); Q.go('title', { back: 'FILE' }); } return; }   // back to the title's menu, on FILE (B17)
          if (U.press('a') || U.press('start')) {
            if (FS.sel === 3) { FS.erase = !FS.erase; FS.sel = FS.erase ? 0 : 3; Q.sfx('select'); return; }
            list = Q.files(); f = list[FS.sel];
            if (FS.erase) { if (f.empty) Q.sfx('nope'); else { FS.ask = true; FS.askSel = 0; Q.sfx('select'); } return; }
            if (Q.SAVE && Q.SAVE.opt) FS.opt = Q.SAVE.opt;
            Q.useFile(f.n); leave(f.empty ? 'start' : 'continue');
          }
        },
        draw: function (g) {
          var list = Q.files ? Q.files() : [], i;
          U.bands(g, SKY, 0, 11);
          U.text(FS.erase ? 'ERASE WHICH FILE?' : 'CHOOSE A FILE', 160, 9, FS.erase ? '#ff8a8a' : '#f6efe2', 2, 'center');
          for (i = 0; i < list.length; i++) card(g, list[i], i);
          U.item(FS.erase ? 'CANCEL' : 'ERASE A FILE', 160, 167, FS.sel === 3 && !FS.ask, false, 'center');
          U.text(FS.erase ? 'A: ERASE THAT FILE   B: CANCEL' : 'A: PLAY   B: BACK', 160, 186, '#8f9ac8', 1, 'center');
          if (FS.ask) {
            U.box(g, 56, 70, 208, 62, '#ff5a5a', '#1d1d24');
            U.text('ERASE FILE ' + (FS.sel + 1) + '?', 160, 80, '#ffffff', 1, 'center');
            U.text('IT CANNOT BE UNDONE.', 160, 93, '#c3c7d4', 1, 'center');
            U.item('NO', 128, 113, FS.askSel === 0, false, 'center'); U.item('YES', 192, 113, FS.askSel === 1, false, 'center');
          }
          if (FS.leave) { g.globalAlpha = Q.clamp(FS.fade, 0, 1); U.fill(g, 0, 0, 320, 200, '#000000'); g.globalAlpha = 1; }
          U.drawTalk(g);
        },
        leave: function () {}
      });
    })();
