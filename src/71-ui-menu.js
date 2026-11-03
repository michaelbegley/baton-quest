    // ---------- 71-ui-menu.js (B20 MENUS, 2 Nov): the menu kit, one look for every menu (PROMPT WINDOW: $S/b20/MENUS.md) ----------
    // A window is the conductor's own terminal: an ink outline, dark glass with faint scan lines, teal corner brackets, a title strip with his >_ prompt
    // and the orange 9F light. The picked line is a solid yellow bar with ink letters and a steady > that taps on the title song's beat; it glides to a
    // new line in 0.08 s. A window warms up from a line to its height in 0.12 s the first frame it is drawn again, its rows sliding in from the right
    // (deeper) or the left (back). Every move is only drawn: a press acts at once. Sounds: U.mk.snd('move' | 'value' | 'tab' | 'pick' | 'back' | 'no').
    // Rows are drawn with U.item(label, x, y, on, off, align, k, 'bar'), so a check that wraps U.item still sees every row and the picked one.
    (function () {
      var U = Q.ui, MK = U.mk = {};
      var C = MK.C = { ink: '#0b0c10', glass: '#11162a', scan: '#141a31', edge: '#232c52', hi: '#2a3460', teal: '#2ec4b6', strip: '#1b2342', cream: '#f6efe2',
        muted: '#8f9ac8', dim: '#6c7396', yel: '#ffd23f', yelD: '#c99a12', ora: '#ff8a1e', foot: '#0b0f1e', help: '#c3c7d4', red: '#ff5a5a', redD: '#7a1f24' };
      var SND = { move: 'move', value: 'tick', tab: 'tick', pick: 'select', back: 'back', no: 'nope', open: 'select' };
      MK.ROW = 11; MK.OPEN_T = 0.12; MK.GLIDE_T = 0.08; MK.dir = 1;
      function fill(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
      MK.fill = fill;
      MK.snd = function (kind) { if (kind === 'back') MK.dir = -1; else if (kind === 'pick' || kind === 'open') MK.dir = 1; Q.sfx(SND[kind] || kind); };
      MK.tap = function () { var b = U.beat ? U.beat('title') : 0.43, t = U.now() % b; return t < 0.12; };   // the cursor's tap on the beat (no blink)
      // ---- each window remembers when it was last drawn: drawn again after a gap, it warms up again ----
      var WIN = {};
      function openOf(key) {
        var now = U.now(), w = WIN[key];
        if (!w) w = WIN[key] = { at: -9, t0: now, dir: 1 };
        if (now - w.at > 0.09 || now < w.at) { w.t0 = now; w.dir = MK.dir; }   // not drawn last frame: it opens again (the way it came: deeper or back)
        w.at = now;
        return Q.clamp((now - w.t0) / MK.OPEN_T, 0, 1);
      }
      MK.opening = function (key) { var w = WIN[key]; return w ? Q.clamp((U.now() - w.t0) / MK.OPEN_T, 0, 1) : 1; };
      MK.reopen = function (key) { var w = WIN[key]; if (w) w.at = -9; };
      function ease(k) { return 1 - (1 - k) * (1 - k); }
      // ---- the frame: outline, glass, scan lines, brackets, the title strip; draw(inner) fills it, clipped to the part that has opened ----
      MK.frame = function (g, x, y, w, h, o) {
        o = o || {};
        var br = o.accent || C.teal, j;
        g.globalAlpha = 0.45; fill(g, x + 2, y + 2, w, h, '#000000'); g.globalAlpha = 1;
        fill(g, x, y, w, h, C.ink); fill(g, x + 1, y + 1, w - 2, h - 2, o.edge || C.edge); fill(g, x + 2, y + 2, w - 4, h - 4, o.fill || C.glass);
        for (j = y + 4; j < y + h - 2; j += 3) fill(g, x + 2, j, w - 4, 1, C.scan);
        fill(g, x + 2, y + 2, w - 4, 1, C.hi);
        if (h >= 8 && w >= 16) {
          fill(g, x, y, 7, 1, br); fill(g, x, y, 1, 7, br); fill(g, x + w - 7, y, 7, 1, br); fill(g, x + w - 1, y, 1, 7, br);
          fill(g, x, y + h - 1, 7, 1, br); fill(g, x, y + h - 7, 1, 7, br); fill(g, x + w - 7, y + h - 1, 7, 1, br); fill(g, x + w - 1, y + h - 7, 1, 7, br);
        }
      };
      MK.strip = function (g, x, y, w, title, o) {   // the title strip: >_ and the name, the 9F light at the right
        o = o || {};
        fill(g, x + 3, y + 3, w - 6, 11, o.strip || C.strip);
        U.text('>_', x + 7, y + 5, o.accent || C.teal); U.text(title, x + 22, y + 5, C.cream);
        if (!o.noLight) { fill(g, x + w - 12, y + 6, 5, 5, o.light || C.ora); fill(g, x + w - 12, y + 6, 2, 1, '#ffc27a'); }
      };
      MK.window = function (g, x, y, w, h, title, key, draw, o) {   // a whole window; returns { x, y, w, h, top } where its rows start
        o = o || {};
        var k = openOf(key), e = ease(k), hh = k >= 1 ? h : Math.max(3, Math.round(h * e)), yy = y + ((h - hh) >> 1), st = WIN[key], dx = k >= 1 ? 0 : Math.round((1 - e) * 8) * (st.dir < 0 ? -1 : 1);
        var inner = { x: x, y: y, w: w, h: h, top: y + (title ? 19 : 6), k: k };
        MK.frame(g, x, yy, w, hh, o);
        if (hh < 12) { fill(g, x + 2, yy + (hh >> 1), w - 4, 1, o.accent || C.teal); return inner; }   // a line of light, opening
        g.save(); g.beginPath(); g.rect(x + 2, yy + 2, w - 4, hh - 4); g.clip();
        if (title) MK.strip(g, x, y, w, title, o);
        if (draw) { g.translate(dx, 0); try { draw(inner); } finally { g.translate(-dx, 0); } }
        g.restore();
        return inner;
      };
      // ---- the picked bar: it glides from the line it was on (per list) ----
      var GL = {};
      MK.barY = function (key, y) {
        var s = GL[key], now = U.now();
        if (!s || now - s.at > 0.09) { s = GL[key] = { from: y, to: y, t0: now, at: now }; }
        if (s.to !== y) { s.from = s.cur === undefined ? s.to : s.cur; s.to = y; s.t0 = now; }
        s.at = now; s.cur = Math.round(Q.lerp(s.from, s.to, ease(Q.clamp((now - s.t0) / MK.GLIDE_T, 0, 1))));
        return s.cur;
      };
      MK.bar = function (g, x, y, w, o) {   // the yellow bar under a picked line (a row tall, from 2 above the letters; its foot a darker line)
        o = o || {};
        var h = o.h || MK.ROW;
        fill(g, x, y - 2, w, h, o.col || C.yel); fill(g, x, y - 2, 2, h, o.tab || C.yelD); fill(g, x, y + h - 3, w, 1, o.tab || C.yelD);
      };
      // ---- while a bar glides (0.08 s): the letters it passes over in ink, the picked line's that it has not reached yet in cream (cream on yellow, or ink on the glass, would vanish) ----
      function clipDo(g, rects, fn) { var i; g.save(); g.beginPath(); for (i = 0; i < rects.length; i++) if (rects[i][2] > 0 && rects[i][3] > 0) g.rect(rects[i][0], rects[i][1], rects[i][2], rects[i][3]); g.clip(); try { fn(); } finally { g.restore(); } }
      MK.glideInk = function (g, bx, bt, bw, bh, top, bottom, under, picked) { clipDo(g, [[bx, bt, bw, bh]], under); clipDo(g, [[bx, top, bw, bt - top], [bx, bt + bh, bw, bottom - bt - bh]], picked); };
      // ---- a list of rows: { label, value, off, count, note, hot }; values right, '< FULL >' on the picked one ----
      MK.list = function (g, x, y, w, rows, sel, key, o) {
        o = o || {};
        var i, r, ry, on, v, rh = o.row || MK.ROW, by, lx = x + (o.pad || 14), vx = x + w - (o.right || 9);
        function valueOf(r, on) { return r.value ? (on && o.arrows !== false && !r.off ? '< ' + r.value + ' >' : r.value) : r.count || ''; }
        function plain(i, col, on) { var r = rows[i], ry = y + i * rh, v = valueOf(r, on); if (on) U.text('>', lx - 9, ry, col); U.text(r.label, lx, ry, col); if (v) U.text(v, vx, ry, col, 1, 'right'); }
        if (sel >= 0 && sel < rows.length && !o.noBar) { by = MK.barY(key, y + sel * rh); MK.bar(g, x + 3, by, w - 6, o.danger ? { col: C.red, tab: C.redD, h: rh } : { h: rh }); }
        for (i = 0; i < rows.length; i++) {
          r = rows[i]; ry = y + i * rh; on = i === sel && !o.noBar;
          U.item(r.label, lx, ry, on, !!r.off && !on, null, 1, 'bar');
          v = valueOf(r, on);
          if (r.value) U.text(v, vx, ry, on ? C.ink : r.off ? C.dim : (r.vcol || C.muted), 1, 'right');
          else if (r.count) U.text(v, vx, ry, on ? C.ink : C.muted, 1, 'right');
          if (r.draw) r.draw(g, lx, ry, on);
        }
        if (by !== undefined && by !== y + sel * rh) MK.glideInk(g, x + 3, by - 2, w - 6, rh, y - 2, y + rows.length * rh,
          function () { for (i = 0; i < rows.length; i++) if (i !== sel) plain(i, C.ink, false); }, function () { plain(sel, rows[sel].off ? C.dim : C.cream, true); });
      };
      MK.help = function (g, x, y, w, text, col) {   // the picked row's words, under the list, in at most two lines
        var lines = Q.wrap(String(text || ''), Math.max(8, Math.floor((w - 16) / 6))), i;
        fill(g, x + 6, y, w - 12, 1, C.hi);
        for (i = 0; i < lines.length && i < 2; i++) U.text(lines[i], x + 8, y + 4 + i * 9, col || C.help);
      };
      MK.footRoom = function (right) { return 308 - (right ? U.width(right) + 8 : 0); };   // the room for the words at the left of the foot band, beside the buttons at the right
      MK.foot = function (g, left, right) {   // the band at the foot of every menu screen: what the picked thing does at the left (cut to fit), the buttons at the right
        var room = MK.footRoom(right), s = String(left || '');
        fill(g, 0, 179, 320, 15, C.foot); fill(g, 0, 179, 320, 1, C.hi);
        while (s && U.width(s) > room) s = s.lastIndexOf(' ') > 0 ? s.slice(0, s.lastIndexOf(' ')) : '';   // too long: whole words only
        if (s) U.text(s, 6, 183, C.help);
        if (right) U.text(right, 314, 183, C.teal, 1, 'right');
      };
      MK.tabs = function (g, x, y, w, names, cur, focus) {   // a tab bar: the open tab raised with a yellow edge; with the focus on the bar, the open tab is the yellow bar itself
        var n = names.length, tw = Math.floor((w - (n - 1) * 4) / n), i, tx, on;
        for (i = 0; i < n; i++) {
          tx = x + i * (tw + 4); on = i === cur;
          if (on && focus) { MK.bar(g, tx, y + 2, tw); U.item(names[i], tx + (tw >> 1), y + 2, true, false, 'center', 1, 'bar'); continue; }
          fill(g, tx, y - 1, tw, 12, on ? C.hi : C.strip); if (on) fill(g, tx, y + 10, tw, 1, C.yel);
          U.text(names[i], tx + (tw >> 1), y + 2, on ? C.yel : C.muted, 1, 'center');
        }
      };
      // ---- a question: a small window in the middle, its words, and a row of choices (NO first, the default); danger: red brackets ----
      MK.ask = function (g, key, title, lines, choices, sel, o) {
        o = o || {};
        var i, w = 0, cw, x, y, h, cx, acc = o.danger ? C.red : C.yel;
        lines = lines || [];
        for (i = 0; i < lines.length; i++) w = Math.max(w, U.width(lines[i]));
        w = Q.clamp(Math.max(w, U.width(title) + 30, choices.length * 64) + 24, 150, 300); h = 30 + lines.length * 10 + 22; x = 160 - (w >> 1); y = o.y || Math.max(30, 100 - (h >> 1));
        g.globalAlpha = 0.5; fill(g, 0, 0, 320, 200, '#05060a'); g.globalAlpha = 1;
        MK.window(g, x, y, w, h, title, key, function () {
          for (i = 0; i < lines.length; i++) U.text(lines[i], 160, y + 22 + i * 10, i ? C.help : C.cream, 1, 'center');
          cw = Math.floor((w - 24) / choices.length);
          for (i = 0; i < choices.length; i++) {
            cx = x + 12 + i * cw;
            if (i === sel) MK.bar(g, cx + 4, y + h - 15, cw - 8, o.danger && i > 0 ? { col: C.red, tab: C.redD } : null);
            U.item(choices[i], cx + (cw >> 1), y + h - 15, i === sel, false, 'center', 1, 'bar');
          }
        }, { accent: acc, light: o.danger ? C.red : C.ora });
      };
      MK.line = function (g, s, x, y, col) { U.text(s, x, y, col || C.help); };
    })();
