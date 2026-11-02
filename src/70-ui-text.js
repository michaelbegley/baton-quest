    // ---------- 70-ui-text.js: the text box, the toast and the UI's small kit (UI, builder 5) ----------
    // Q.say(id, done): a script in the box at the bottom: 3 lines of 46 letters a box, the speaker's portrait and name, the letters typing in (Q.sfx('type')
    // now and then); A or B shows the rest at once, then the next box; a small arrow when more is coming. A missing script calls done at once.
    // Q.talking(): a box is up (the engine pauses play). Q.toast(text, secs): a small box at the top, under the HUD.
    // Q.ui.drawTalk(g, Q) draws both and moves them on by the clock, once a frame: call it at the end of every draw (twice in a frame is harmless).
    (function () {
      var U = Q.ui;
      // ---- the kit every UI scene uses ----
      U.now = function () { return Q.api && Q.api.t ? Q.api.t() : Q.t; };
      U.hero = function () {   // the conductor's sprite: gold bow tie once bought and switched on (part 13, 25; opt.bowtie is 'gold' or 'white'), when ART's sprite is in
        var v = Q.SAVE;
        return v && v.shop && v.shop.bowtie && !(v.opt && v.opt.bowtie === 'white') && Q.SPRITE['hero-gold'] ? 'hero-gold' : 'hero';
      };
      U.place = function () { return Q.scene === 'level' && Q.level ? 'L:' + Q.level.id : 'S:' + Q.scene; };   // where a talk or a toast belongs
      var edgeAt = {};
      U.press = function (n) {   // a button that went down this frame, given out once a frame (the engine runs up to four steps in one frame)
        var a = Q.api, t; if (!a) return false;
        t = a.t();
        if (U.enterAt === t) return false;   // a scene entered this frame reads no press of it: the press that brought it here is spent (part 13, 28)
        if (typeof Q.press === 'function') return !!Q.press(n);   // the engine's one record of presses, shared by everyone, once it is in
        if (!a.pressed(n) || edgeAt[n] === t) return false;
        edgeAt[n] = t; return true;
      };
      U.entered = function () { U.enterAt = U.now(); };   // every UI scene's enter calls it
      var LATER = { fn: null, at: -1 };
      U.later = function (fn) { LATER.fn = fn; LATER.at = U.now(); };   // a press that leads into the level: go there next frame, so the level never reads that press again
      U.runLater = function () {   // a scene's update starts with it: true while a move is waiting (or has just been made)
        if (!LATER.fn) return false;
        if (U.now() === LATER.at) return true;
        var f = LATER.fn; LATER.fn = null; f(); return true;
      };
      U.held = function (n) { return !!(Q.api && Q.api.held(n)); };
      // ---- the runtime's own font, drawn fast: each letter api.text makes is copied once into a sheet, then a letter is one drawImage ----
      var CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?:;-+/\'"()=%*#<>_&@$[]~', QMARK = CH.indexOf('?'), FONT = { white: null, tint: {}, tried: false };
      function fontBuild() {   // once, outside any clip: the letters drawn by api.text at the top left of the screen, copied off, the pixels put back
        var g = Q.g, cv = g && g.canvas, a, i, saved;
        FONT.tried = true;
        if (!cv || !Q.api || typeof Q.canvas !== 'function') return;
        try {
          a = Q.canvas(192, 16); saved = g.getImageData(0, 0, 192, 16);
          g.save(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, 192, 16);
          for (i = 0; i < CH.length; i++) Q.api.text(CH.charAt(i), (i % 32) * 6, Math.floor(i / 32) * 8, '#ffffff');
          g.restore();
          a.getContext('2d').drawImage(cv, 0, 0, 192, 16, 0, 0, 192, 16);
          g.putImageData(saved, 0, 0);
          FONT.white = a;
        } catch (e) { FONT.white = null; }
      }
      function tint(col) {   // the sheet in one colour, made the first time that colour is asked for
        var c = FONT.tint[col], x;
        if (c) return c;
        c = Q.canvas(192, 16); x = c.getContext('2d');
        x.drawImage(FONT.white, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, 192, 16);
        FONT.tint[col] = c; return c;
      }
      U.textOn = function (g, s, x, y, col, k, align) {   // the font into any 2D context (the screen, or a page drawn once); the same letters as api.text
        var img = tint(col || '#ffffff'), i, c, n, w;
        s = String(s).toUpperCase(); k = k || 1; w = s.length * 6 * k - k;
        if (align === 'center') x -= Math.floor(w / 2); else if (align === 'right') x -= w;
        x = Math.round(x); y = Math.round(y);
        for (i = 0; i < s.length; i++) {
          c = s.charAt(i); if (c === ' ') continue;
          n = CH.indexOf(c); if (n < 0) n = QMARK;
          g.drawImage(img, (n % 32) * 6, Math.floor(n / 32) * 8, 5, 7, x + i * 6 * k, y, 5 * k, 7 * k);
        }
      };
      U.fontReady = function () { return !!FONT.white; };
      var TC = { map: {}, n: 0 };
      function textImage(s, col) {   // a whole string in one colour, drawn once and kept (up to 400; then the store starts again)
        var key = col + '|' + s, c = TC.map[key];
        if (c) return c;
        if (TC.n >= 400) { TC.map = {}; TC.n = 0; }
        c = Q.canvas(Math.max(1, s.length * 6 - 1), 7);
        U.textOn(c.getContext('2d'), s, 0, 0, col);
        TC.map[key] = c; TC.n++;
        return c;
      }
      U.text = function (s, x, y, col, k, align) {   // like api.text (the same letters), as one drawImage of the string drawn once
        if (!FONT.white || !Q.g) { if (Q.api) Q.api.text(s, x, y, col, k, align); return; }
        s = String(s).toUpperCase(); k = k || 1;
        if (!s.length) return;
        var img = textImage(s, col || '#ffffff'), w = s.length * 6 * k - k;
        if (align === 'center') x -= Math.floor(w / 2); else if (align === 'right') x -= w;
        Q.g.drawImage(img, Math.round(x), Math.round(y), img.width * k, 7 * k);
      };
      U.width = function (s, k) { k = k || 1; return String(s).length * 6 * k - k; };
      U.fill = function (g, x, y, w, h, col) { g.fillStyle = col; g.fillRect(x, y, w, h); };
      U.box = function (g, x, y, w, h, edge, fill) {   // a framed box with cut corners: a dark outline, a line of edge colour, the fill
        g.fillStyle = '#0b0c10'; g.fillRect(x + 1, y, w - 2, h); g.fillRect(x, y + 1, w, h - 2);
        g.fillStyle = edge; g.fillRect(x + 2, y + 1, w - 4, h - 2); g.fillRect(x + 1, y + 2, w - 2, h - 4);
        g.fillStyle = fill || '#1d1d24'; g.fillRect(x + 2, y + 2, w - 4, h - 4);
      };
      U.grad = function (a, b, n) {   // n colours from a to b (made when a file loads, so a sky costs no work a frame)
        var out = [], i, k, c, A = [parseInt(a.substr(1, 2), 16), parseInt(a.substr(3, 2), 16), parseInt(a.substr(5, 2), 16)];
        var B = [parseInt(b.substr(1, 2), 16), parseInt(b.substr(3, 2), 16), parseInt(b.substr(5, 2), 16)];
        for (i = 0; i < n; i++) {
          k = n > 1 ? i / (n - 1) : 0; c = '#';
          for (var j = 0; j < 3; j++) { var v = Math.round(A[j] + (B[j] - A[j]) * k); c += (v < 16 ? '0' : '') + v.toString(16); }
          out.push(c);
        }
        return out;
      };
      U.bands = function (g, cols, y0, h) {   // paints the colours as bands from y0 down, h pixels each
        for (var i = 0; i < cols.length; i++) { g.fillStyle = cols[i]; g.fillRect(0, y0 + i * h, 320, h); }
      };
      U.frames = function (id) { var d = Q.SPRITE[id]; return d ? (d.frames ? d.frames.length : d.n || 1) : 0; };
      U.sprite = function (g, id, frame, x, y, k, flip) {   // a sprite at k times its size (k 1: just Q.spr)
        if (!k || k === 1) { Q.spr(g, id, frame, Math.round(x), Math.round(y), flip); return; }
        g.save(); g.translate(Math.round(x), Math.round(y)); g.scale(k, k); Q.spr(g, id, frame, 0, 0, flip); g.restore();
      };
      U.arrow = function (g, x, y, col, up) {   // a small 5 by 3 arrow, pointing down (or up)
        g.fillStyle = col;
        if (up) { g.fillRect(x + 2, y, 1, 1); g.fillRect(x + 1, y + 1, 3, 1); g.fillRect(x, y + 2, 5, 1); }
        else { g.fillRect(x, y, 5, 1); g.fillRect(x + 1, y + 1, 3, 1); g.fillRect(x + 2, y + 2, 1, 1); }
      };
      U.menuMove = function (sel, n) {   // up and down through n items, round and round
        if (U.press('up')) { sel = (sel + n - 1) % n; Q.sfx('move'); }
        if (U.press('down')) { sel = (sel + 1) % n; Q.sfx('move'); }
        return sel;
      };
      U.item = function (s, x, y, on, off, align, k) {   // a menu item: the chosen one in yellow with the conductor's prompt before it
        k = k || 1;
        var col = off ? '#5d6378' : on ? '#ffd23f' : '#f6efe2';
        var x0 = align === 'center' ? x - (U.width(s, k) >> 1) : x;
        U.text(s, x0, y, col, k);
        if (on && Math.floor(U.now() * 2.5) % 3) U.text('>', x0 - 9 * k, y, '#ffd23f', k);
      };

      // ---- who speaks: the colours of the box and the name, the portrait, the typing (letters a second; the pause after a full stop) ----
      var WHO = {
        hero:  { edge: '#f6efe2', name: '#ffffff', spr: 'hero', cps: 40, stop: 0.2 },
        c1:    { edge: '#3f7fd9', name: '#bcd4f6', spr: 'c1', cps: 75, stop: 0.06 },
        c2:    { edge: '#46b06a', name: '#bfe8cd', spr: 'c2', cps: 60, stop: 0.3 },
        c3:    { edge: '#ee7fb0', name: '#fbd3e3', spr: 'c3', cps: 24, stop: 0.32 },
        facil: { edge: '#2ec4b6', name: '#c9f7f2', spr: 'facil', cps: 46, stop: 0.16 },
        creep: { edge: '#6fae3c', name: '#ffd23f', spr: 'face-creep', cps: 34, stop: 0.22 },
        vend:  { edge: '#ff8a1e', name: '#ffd9b0', spr: 'face-vend', cps: 55, stop: 0.12 },
        cat:   { edge: '#9aa3ad', name: '#e2e6ea', spr: 'cat', cps: 28, stop: 0.25 },
        boss:  { edge: '#e0443a', name: '#ffc9c4', spr: '', cps: 38, stop: 0.2 },
        none:  { edge: '#5d6378', name: '#ffffff', spr: '', cps: 42, stop: 0.18 }
      };
      U.WHO = WHO;
      function bossDef() {   // the boss now, or the one this arena is for (its intro talks before it appears)
        if (Q.boss && Q.boss.def) return { def: Q.boss.def, id: Q.boss.id };
        var id = Q.level && Q.level.boss; return id && Q.ENEMY[id] ? { def: Q.ENEMY[id], id: id } : null;
      }
      U.whoName = function (w) {
        if (w === 'boss') { var b = bossDef(); return b && b.def.name ? String(b.def.name) : 'THE BOSS'; }
        return Q.WHO[w] !== undefined ? Q.WHO[w] : String(w || '').toUpperCase();
      };
      U.whoFace = function (w) {
        if (w === 'boss') { var b = bossDef(); return b ? b.def.face || 'face-' + b.id : ''; }
        if (w === 'hero') return U.hero();
        return WHO[w] ? WHO[w].spr : '';
      };

      // ---- the text box ----
      var T = { cur: null, queue: [], shown: 0, acc: 0, need: 0, openT: -9, tickAt: -1, sfxAt: -9, who: 'none', name: '', face: '' }, warned = {};
      function pagesOf(text) {   // a line of a script, wrapped into boxes of 3 lines of 46 letters
        var lines = Q.wrap(String(text === undefined || text === null ? '' : text), 46), pages = [], i, p;
        for (i = 0; i < lines.length; i++) if (lines[i].length > 46) { lines.splice(i + 1, 0, lines[i].slice(46)); lines[i] = lines[i].slice(0, 46); }
        for (p = 0; p < lines.length; p += 3) {
          var pl = lines.slice(p, p + 3), n = 0;
          for (i = 0; i < pl.length; i++) n += pl[i].length;
          pages.push({ lines: pl, len: n });
        }
        if (!pages.length) pages.push({ lines: [], len: 0 });
        return pages;
      }
      function startLine(i) {
        var c = T.cur, line = c.lines[i] || {}, w = String(line.who || 'none').toLowerCase();
        c.i = i; c.p = 0; c.pages = pagesOf(line.text);
        T.who = WHO[w] ? w : 'none'; T.name = w === 'none' ? '' : U.whoName(w); T.face = U.whoFace(w);
        T.shown = 0; T.acc = 0; T.need = 0; T.top = lowHero();
        if (c.onLine) c.onLine(i, line);
      }
      function open(e) { T.cur = e; T.openT = U.now(); startLine(0); }
      function close() {
        var c = T.cur; T.cur = null;
        for (var k = 0; k < c.dones.length; k++) c.dones[k]();
        if (!T.cur && T.queue.length) open(T.queue.shift());
      }
      function nextBox() {
        var c = T.cur;
        if (c.p + 1 < c.pages.length) { c.p++; T.shown = 0; T.acc = 0; T.need = 0; return; }
        if (c.i + 1 < c.lines.length) { startLine(c.i + 1); return; }
        close();
      }
      function talkInput() {
        if (!T.cur) return;
        var a = U.press('a'), b = U.press('b');   // while a box is up, A and B are its own
        if (U.now() - T.openT < 0.12 || !(a || b)) return;   // a box that has just opened lets a bounce go by
        var pg = T.cur.pages[T.cur.p];
        if (T.shown < pg.len) { T.shown = pg.len; return; }
        nextBox();
      }
      function typeStep(dt) {
        if (!T.cur) return;
        var pg = T.cur.pages[T.cur.p], sp = WHO[T.who], flat, ch, typed = false;
        if (T.shown >= pg.len) return;
        flat = pg.lines.join('');
        T.acc += dt * (U.textFast() ? 2.5 : 1);   // the pause menu's TEXT: FAST types about 2.5 times quicker (pauses too)
        while (T.shown < pg.len && T.acc >= T.need) {
          T.acc -= T.need; ch = flat.charAt(T.shown); T.shown++;
          T.need = 1 / sp.cps;
          if (ch === '.' || ch === '!' || ch === '?') T.need += sp.stop; else if (ch === ',' || ch === ';' || ch === ':') T.need += sp.stop / 2;
          if (ch !== ' ') typed = true;
        }
        if (typed && U.now() - T.sfxAt > 0.07) { T.sfxAt = U.now(); Q.sfx(Q.SFX['type-' + T.who] ? 'type-' + T.who : 'type'); }   // each speaker's own blip, when AUDIO has one
      }
      Q.say = function (id, done, onLine) {
        var lines = Q.SCRIPT[id];
        if (!lines || !lines.length) {
          if (!lines && !warned[id]) { warned[id] = true; Q.warn('Q.say: no script ' + id); }
          if (done) done(); return false;
        }
        return U.talk(lines, done, onLine, id);
      };
      U.talk = function (lines, done, onLine, id) {   // Q.say with the lines in hand (the map says one line at a time); a second say waits its turn
        var e = { id: id || '', lines: lines, dones: done ? [done] : [], onLine: onLine || null, i: 0, p: 0, pages: [], at: U.place() }, k;
        if (!lines || !lines.length) { if (done) done(); return false; }
        if (T.cur) {
          if (id && T.cur.id === id) { if (done) T.cur.dones.push(done); return true; }
          for (k = 0; k < T.queue.length; k++) if (id && T.queue[k].id === id) { if (done) T.queue[k].dones.push(done); return true; }
          T.queue.push(e); return true;
        }
        open(e); return true;
      };
      Q.talking = function () { return !!T.cur; };
      U.textFast = function () { return !!(Q.SAVE && Q.SAVE.opt && Q.SAVE.opt.text === 'fast'); };
      U.typed = function () { return T.cur ? T.shown : -1; };   // for checks: the letters of this box typed so far
      U.talkAt = function () { return T.cur ? { id: T.cur.id, i: T.cur.i, n: T.cur.lines.length, who: T.who, top: !!T.top } : null; };
      U.cancel = function () { T.cur = null; T.queue = []; };   // drops every box without calling done (a skipped cutscene, a fresh title)

      // ---- drawing the box: a name plate on its top edge, the portrait at the left, 3 lines of 46 letters ----
      var BX = 2, BY = 150, BW = 316, BH = 46, TOPY = 24;   // the box at the bottom, or at the top under the HUD when he stands low
      function drawFace(g, id, x, y, st, typing) {
        U.box(g, x, y, 24, 24, st.edge, '#33364a');
        if (!id) return;
        var d = Q.SPRITE[id], sw = d ? d.w : 16, sh = d ? d.h : 16, n = U.frames(id), fr = 0, px, py;
        if (n > 1 && (typing || id === 'facil')) fr = Math.floor(U.now() * (typing ? 7 : 3)) % 2;
        px = x + ((24 - sw) >> 1);
        if (id === 'facil' || id.indexOf('face-') === 0) py = y + ((24 - sh) >> 1);   // a bubble or a face: in the middle
        else if (sh <= 20) py = y + 22 - sh;   // someone standing: feet on the frame's floor
        else py = y + 2;   // too tall: its top shows
        g.save(); g.beginPath(); g.rect(x + 2, y + 2, 20, 20); g.clip(); Q.spr(g, id, fr, px, py); g.restore();
      }
      function pageImage(pg) {   // a box's lines drawn once into a canvas of their own; each frame shows only the letters typed so far
        if (pg.cv || !FONT.white) return pg.cv || null;
        var c = Q.canvas(276, 29), x = c.getContext('2d');
        for (var j = 0; j < pg.lines.length; j++) U.textOn(x, pg.lines[j], 0, j * 11, '#f6efe2');
        pg.cv = c; return c;
      }
      function lowHero() {   // in a level, his feet in the bottom 60 px of the screen: the box goes to the top so it never hides him (part 13, 22)
        var P = Q.P; if (Q.scene !== 'level' || !P || !Q.cam) return false;
        return P.y + P.h - Q.cam.y > Q.H - 60;
      }
      function drawBox(g) {
        var c = T.cur, st = WHO[T.who] || WHO.none, pg = c.pages[c.p], now = U.now(), typing = T.shown < pg.len, face = T.face || (T.who !== 'none' ? '?' : '');
        var by = T.top ? TOPY : BY, left = T.shown, x0 = BX + 35, j, s, n, x, y, curX = -1, curY = 0, img = pageImage(pg);
        U.box(g, BX, by, BW, BH, st.edge, '#1d1d24');
        if (face) drawFace(g, face === '?' ? '' : face, BX + 5, by + 10, st, typing);
        if (T.name) { var tw = U.width(T.name) + 10; U.box(g, BX + 5, by - 7, tw, 13, st.edge, '#1d1d24'); U.text(T.name, BX + 10, by - 4, st.name); }
        for (j = 0; j < pg.lines.length; j++) {
          s = pg.lines[j]; n = Math.max(0, Math.min(s.length, left)); left -= s.length;
          x = face ? x0 : 160 - (U.width(s) >> 1); y = by + 7 + j * 11;
          if (n > 0) { if (img) g.drawImage(img, 0, j * 11, n * 6, 7, x, y, n * 6, 7); else U.text(s.slice(0, n), x, y, '#f6efe2'); }
          if (n < s.length && curX < 0) { curX = x + n * 6; curY = y; }
        }
        if (T.who === 'hero' && pg.lines.length) {   // the conductor types at a prompt: a cursor after its words
          if (curX < 0) { s = pg.lines[pg.lines.length - 1]; curX = (face ? x0 : 160 - (U.width(s) >> 1)) + s.length * 6 + 1; curY = by + 7 + (pg.lines.length - 1) * 11; }
          if (typing || Math.floor(now * 3) % 2) U.text('_', curX, curY, '#f6efe2');
        }
        if (!typing) {
          if (c.p + 1 < c.pages.length || c.i + 1 < c.lines.length || T.queue.length) U.arrow(g, BX + BW - 12, by + BH - 8 + (Math.floor(now * 4) % 2), '#ffd23f');
          else if (Math.floor(now * 3) % 2) U.fill(g, BX + BW - 11, by + BH - 8, 3, 3, '#ffd23f');
        }
      }

      // ---- the toast: one at a time, at the top under the HUD; a new one waits its turn behind the one showing, and the same text again keeps it up ----
      // ENGINE's GOLD STAR: <NAME> toasts (part 14.2) have the star at their left, show in the order won, and are never dropped by a door or a scene change.
      var TO = { cur: null, q: [], drawnAt: -1 };
      function toastOf(text, secs) {
        var star = /^GOLD STAR/i.test(text), lines = Q.wrap(text, star ? 45 : 48), w = 0;   // a gold star's toast (ENGINE's, part 14.2) has the star at its left
        for (var i = 0; i < lines.length; i++) w = Math.max(w, U.width(lines[i]));
        return { text: text, lines: lines.slice(0, 4), w: w, left: secs, age: 0, at: star ? '*' : U.place(), star: star };   // a star's toast belongs everywhere: ENGINE wins most stars just before a door or a scene change
      }
      Q.toast = function (text, secs) {
        text = String(text === undefined || text === null ? '' : text); if (!text) return;
        secs = +secs > 0 ? +secs : 2.2;
        if (TO.cur && TO.cur.text === text) { if (secs > TO.cur.left) TO.cur.left = secs; return; }
        for (var k = 0; k < TO.q.length; k++) if (TO.q[k].text === text) { if (secs > TO.q[k].left) TO.q[k].left = secs; return; }
        var e = toastOf(text, secs);
        if (e.star && TO.cur && TO.cur.star) {   // a star while a star shows waits its turn: the stars come in the order they were won (ALL last)
          k = 0; while (k < TO.q.length && TO.q[k].star) k++;
          TO.q.splice(k, 0, e); if (TO.q.length > 6) TO.q.length = 6; return;
        }
        if (TO.cur && TO.cur.left > 0.3) { TO.cur.age = 0; TO.q.unshift(TO.cur); }   // the one showing steps back and comes again after
        TO.cur = e;
        if (TO.q.length > 4) TO.q.length = 4;
      };
      function toastStep(dt) {
        var c = TO.cur; if (!c) return;
        c.age += dt; c.left -= dt;
        if (c.left > 0) return;
        TO.cur = null;
        while (TO.q.length && !TO.cur) { var e = TO.q.shift(); if (e.left >= 0.3) TO.cur = e; }   // a sign left behind (a short one) is dropped
      }
      function drawToast(g) {
        var c = TO.cur, now = U.now(); if (!c || TO.drawnAt === now) return;
        TO.drawnAt = now;
        var n = c.lines.length, sw = c.star ? 16 : 0, h = Math.max(n * 9 + 7, sw), w = c.w + 14 + sw, x = 160 - (w >> 1), k = Math.min(1, c.age / 0.12, Math.max(0, c.left) / 0.12), i, cx;
        var base = T.cur && T.top ? TOPY + BH + 4 : 18, y = Math.round(base - (1 - k) * (h + 4));
        if (!c.cv && FONT.white) {   // its lines drawn once
          c.cv = Q.canvas(c.w, n * 9); cx = c.cv.getContext('2d');
          for (i = 0; i < n; i++) U.textOn(cx, c.lines[i], (c.w - U.width(c.lines[i])) >> 1, i * 9, '#f6efe2');
        }
        g.save(); g.beginPath(); g.rect(0, base - 2, 320, 202 - base); g.clip();
        U.box(g, x, y, w, h, '#ffd23f', c.star ? '#2a2210' : '#1d1d24');
        if (c.star && U.starIcon) U.starIcon(g, x + 5, y + ((h - 12) >> 1), true);
        if (c.cv) g.drawImage(c.cv, x + 7 + sw, y + ((h - n * 9 + 2) >> 1)); else for (i = 0; i < n; i++) U.text(c.lines[i], 160 + (sw >> 1), y + 4 + i * 9, '#f6efe2', 1, 'center');
        g.restore();
      }
      U.drawToast = drawToast;
      U.toastNow = function () { return TO.cur ? TO.cur.text : ''; };
      U.clearToasts = function (keepStars) {   // keepStars: the gold stars' toasts stay (a game over or the ending clears the rest)
        var k;
        if (TO.cur && !(keepStars && TO.cur.star)) TO.cur = null;
        for (k = TO.q.length - 1; k >= 0; k--) if (!(keepStars && TO.q[k].star)) TO.q.splice(k, 1);
        if (!TO.cur && TO.q.length) TO.cur = TO.q.shift();
      };

      // ---- the clock: whoever calls first in a frame moves the box and the toast on by that frame's time ----
      U.tick = function () {
        var now = U.now(); if (now === T.tickAt) return;
        var dt = now - T.tickAt; T.tickAt = now;
        if (!FONT.tried) fontBuild();
        if (!(dt > 0)) dt = 0; if (dt > 0.05) dt = 0.05;
        if (Q.scene !== 'pause' && Q.scene !== 'codex') {   // a talk or a toast belongs to the level or scene it came in: a new one clears it (ART, WORLD 4)
          var at = U.place(), k;
          if (T.cur && T.cur.at !== at) T.cur = null;
          for (k = T.queue.length - 1; k >= 0; k--) if (T.queue[k].at !== at) T.queue.splice(k, 1);
          if (!T.cur && T.queue.length) open(T.queue.shift());
          if (TO.cur && TO.cur.at !== at && TO.cur.at !== '*') TO.cur = null;
          for (k = TO.q.length - 1; k >= 0; k--) if (TO.q[k].at !== at && TO.q[k].at !== '*') TO.q.splice(k, 1);
          if (!TO.cur && TO.q.length) TO.cur = TO.q.shift();
        }
        talkInput(); typeStep(dt); toastStep(dt);
      };
      U.drawTalk = Q.ui.drawTalk = function (g) {
        U.tick();
        drawToast(g);
        if (T.cur) drawBox(g);
      };
      Q.ui.talkStep = U.tick;
    })();
