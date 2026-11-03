    // ---------- 79-ui-watch.js (B19 STOPWATCH, 2 Nov): the stopwatch in a corner, its OPTIONS setting's value, and the codes mark (QUEST-API part 20) ----------
    // While the game is a beta (Q.BETA, 59-engine-watch.js) the stopwatch is on unless OPTIONS says OFF (Q.SAVE.opt.watch, 'on' or 'off', kept like TEXT).
    // It shows exactly while the clock runs (the intro, a level, the map, the shop, game over, THE ENCORE's results): a hook on drawTalk, which each of those
    // scenes calls last, draws it just before the toast and the text box, so a box covers it and it covers nothing the HUD shows. Its place is the bottom
    // right corner of the scene's own frame: the screen's in a level (at any width), the centred 320 column's in the others, and on the map just above its bar.
    // H:MM:SS in the game's font on a small dark plate, a letter at a time (eleven letters drawn once, not a new picture every second). A file where a cheat
    // code was typed shows an orange star before the time and a CODES tab over the plate. U.watchMark is the same star for the menus.
    (function () {
      var U = Q.ui, WT = { ink: '#e8f0ff', code: '#ff8a1e', plate: '#121318', edge: '#3a3d52', warned: false };
      U.watchOn = function () { var o = Q.SAVE && Q.SAVE.opt, v = o && o.watch; return v === 'on' ? true : v === 'off' ? false : !!Q.BETA; };
      U.watchCode = function (s) {   // this file's codes mark (its record read straight, so a frame makes nothing new; a file from before is read by Q.watchOf)
        var v = s || Q.SAVE, r = v && v.watch, w;
        if (r && typeof r === 'object' && !Array.isArray(r)) return !!r.code;
        w = Q.watchOf ? Q.watchOf(v) : null; return !!(w && w.code);
      };
      U.watchText = function (secs) {   // seconds as H:MM:SS, always with the hours (a stopwatch's face)
        var s = Math.max(0, Math.floor((+secs || 0) + 1e-6)), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, r = s % 60;
        return h + ':' + (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
      };
      U.mono = function (s, x, y, col) { var i; for (i = 0; i < s.length; i++) if (s.charAt(i) !== ' ') U.text(s.charAt(i), x + i * 6, y, col); };   // one letter at a time
      U.watchMark = function (x, y, k) { U.text('*', x, y, WT.code, k || 1); };   // the codes star, before a time in a menu
      U.watchAt = function () {   // where the plate goes in this scene (its frame's right: the screen in a wide scene, else the 320 column), what it reads, and whether it steps aside
        var s = Q.SAVE, code = U.watchCode(), txt = U.watchText(s ? s.time : 0), w = U.width(txt) + (code ? 6 : 0) + 6, y = Q.scene === 'map' ? 147 : 184;
        var sc = Object.prototype.hasOwnProperty.call(Q.SCENE, Q.scene) ? Q.SCENE[Q.scene] : null, r = sc && sc.wide || Q.W <= 320 ? Q.W : Q.OX + 320, x = r - 2 - w, tk = U.talkAt ? U.talkAt() : null;
        return { on: U.watchOn(), runs: !!(Q.watchRuns && Q.watchRuns(Q.scene)), x: x, y: y, w: w, h: 11, r: r, text: (code ? '*' : '') + txt, code: code,
          aside: !!(tk && !tk.top && x < Q.OX + 318) };   // a text box at the bottom over its corner: it steps aside until the box is gone (no sliver peeks past the box)
      };
      function plate(g) {   // the plate at the frame's bottom right: a line of edge colour, the dark fill, the time (a star first, and a CODES tab above, for a file with codes)
        var a = U.watchAt(), x = a.x, y = a.y, edge = a.code ? WT.code : WT.edge;
        if (a.aside) return;
        if (a.code) { U.fill(g, a.r - 37, y - 9, 35, 10, edge); U.fill(g, a.r - 36, y - 8, 33, 9, WT.plate); U.text('CODES', a.r - 34, y - 7, WT.code); }
        U.fill(g, x, y, a.w, 11, edge); U.fill(g, x + 1, y + 1, a.w - 2, 9, WT.plate);
        if (a.code) { U.watchMark(x + 3, y + 2); U.mono(a.text.slice(1), x + 9, y + 2, WT.ink); }
        else U.mono(a.text, x + 3, y + 2, WT.ink);
      }
      var talk0 = U.drawTalk;
      U.drawTalk = Q.ui.drawTalk = function (g) {   // the stopwatch first, then the toast and the box as before
        if (Q.SAVE && U.watchOn() && Q.watchRuns && Q.watchRuns(Q.scene)) {
          try { plate(g); } catch (e) { if (!WT.warned) { WT.warned = true; Q.warn('stopwatch: ' + e); } }
        }
        return talk0.apply(this, arguments);
      };
    })();
