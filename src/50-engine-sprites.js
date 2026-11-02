    // ---------- 50-engine-sprites.js (ENGINE): Q.spr and the sprite sheets ----------
    // Every Q.SPRITE is built once into a small canvas at start: row 0 as drawn, row 1 mirrored, rows 2 and 3 the same in white (for hit flashes).
    // Art faces right; flip draws it facing left. An unknown id draws a magenta box and never throws. A sprite defined late is built on first use.
    var engSheets = {}, engDoc = null, engWarned = {};
    var engCore = { toast: Q.toast, hud: Q.ui.hud, talk: Q.ui.drawTalk, say: Q.say, talking: Q.talking };   // the contract's stand-ins: to tell when a part has landed

    function engWarnOnce(s) { if (engWarned[s]) return; engWarned[s] = true; Q.warn(s); }

    Q.canvas = function (w, h) {   // a small offscreen canvas (the one DOM touch allowed), for sheets and for anyone pre-drawing a detailed layer once at start
      if (!engDoc) engDoc = Q.api.g.canvas.ownerDocument;
      var cv = engDoc.createElement('canvas');
      cv.width = Math.max(1, Math.ceil(w)); cv.height = Math.max(1, Math.ceil(h));
      cv.getContext('2d').imageSmoothingEnabled = false;
      return cv;
    };

    function engPaint(c, d, f, w, h, id) {   // a palette frame, a run of one colour at a time
      var rows = d.frames && d.frames[f], pal = d.pal || {}, y, x, x0, ch, row;
      if (!rows) return;
      for (y = 0; y < h && y < rows.length; y++) {
        row = String(rows[y]); x = 0;
        while (x < w && x < row.length) {
          ch = row.charAt(x);
          if (ch === '.' || ch === ' ') { x++; continue; }
          x0 = x;
          while (x < w && x < row.length && row.charAt(x) === ch) x++;
          if (!pal[ch]) engWarnOnce('sprite ' + id + ' has no colour for "' + ch + '"');
          c.fillStyle = pal[ch] || '#ff00ff';
          c.fillRect(x0, y, x - x0, 1);
        }
      }
    }

    function engBuildSprite(id) {
      var d = Object.prototype.hasOwnProperty.call(Q.SPRITE, id) ? Q.SPRITE[id] : null, s = false;
      if (d && Q.api) {
        try {
          var w = Math.max(1, d.w | 0), h = Math.max(1, d.h | 0), n = d.draw ? Math.max(1, d.n | 0) : Math.max(1, (d.frames && d.frames.length) | 0);
          var cv = Q.canvas(w * n, h * 4), c = cv.getContext('2d'), f;
          for (f = 0; f < n; f++) {
            c.save(); c.translate(f * w, 0); c.beginPath(); c.rect(0, 0, w, h); c.clip();
            if (d.draw) {
              try { d.draw(c, f); } catch (er) { engWarnOnce('ERROR sprite ' + id + ' frame ' + f + ': ' + er.message); c.fillStyle = '#ff00ff'; c.fillRect(0, 0, w, h); }
            } else engPaint(c, d, f, w, h, id);
            c.restore();
          }
          c.save(); c.translate(w * n, h); c.scale(-1, 1); c.drawImage(cv, 0, 0, w * n, h, 0, 0, w * n, h); c.restore();   // row 1: mirrored (frame f lands at n-1-f)
          c.drawImage(cv, 0, 0, w * n, h * 2, 0, h * 2, w * n, h * 2);                                                       // rows 2 and 3: a copy, then white
          c.globalCompositeOperation = 'source-atop'; c.fillStyle = '#ffffff'; c.fillRect(0, h * 2, w * n, h * 2); c.globalCompositeOperation = 'source-over';
          s = { cv: cv, w: w, h: h, n: n };
        } catch (e) { engWarnOnce('ERROR sprite ' + id + ': ' + e.message); s = false; }
      } else if (!d) engWarnOnce('no sprite ' + id);
      engSheets[id] = s;
      return s;
    }

    function engSheet(id) { var s = engSheets[id]; return s === undefined ? engBuildSprite(id) : s; }
    var engTwins = {};
    function engTwin(id) {   // part 13, item 19: a sprite's own facing-left twin (id + '-l'), drawn unflipped in place of the mirror, or false
      var t = engTwins[id];
      if (t === undefined) t = engTwins[id] = Object.prototype.hasOwnProperty.call(Q.SPRITE, id + '-l') ? engSheet(id + '-l') : false;
      return t;
    }
    function engSize(id) { var s = engSheet(id); return s ? s : null; }   // { w, h, n } or null

    function engBlit(g, s, f, x, y, flip, white, dw, dh) {
      f = (f | 0) % s.n; if (f < 0) f += s.n;
      g.drawImage(s.cv, (flip ? s.n - 1 - f : f) * s.w, ((flip ? 1 : 0) + (white ? 2 : 0)) * s.h, s.w, s.h, Math.round(x), Math.round(y), dw || s.w, dh || s.h);
    }

    Q.spr = function (g, id, frame, x, y, flip) {
      var s = flip ? engTwin(id) : false;
      if (s) { engBlit(g, s, frame, x, y, false, false); return; }
      s = engSheets[id];
      if (s === undefined) s = engBuildSprite(id);
      if (!s) { g.fillStyle = '#ff00ff'; g.fillRect(Math.round(x), Math.round(y), 8, 8); return; }
      engBlit(g, s, frame, x, y, flip, false);
    };
    // the engine's own extras: in white (a hit flash), and stretched about the bottom centre (squash and stretch); both use a facing-left twin too
    function engSprWhite(g, id, frame, x, y, flip) {
      var t = flip ? engTwin(id) : false, s = t || engSheet(id);
      if (s) engBlit(g, s, frame, x, y, flip && !t, true); else Q.spr(g, id, frame, x, y, flip);
    }
    function engSprSquash(g, id, frame, x, y, flip, kx, ky, white) {
      var t = flip ? engTwin(id) : false, s = t || engSheet(id); if (!s) { Q.spr(g, id, frame, x, y, flip); return; }
      if (t) flip = false;
      var dw = Math.round(s.w * kx), dh = Math.round(s.h * ky);
      engBlit(g, s, frame, x + (s.w - dw) / 2, y + (s.h - dh), flip, white, dw, dh);
    }

    function engBuildAll() {   // at start: every sprite there is, once
      var n = 0;
      for (var id in Q.SPRITE) if (Object.prototype.hasOwnProperty.call(Q.SPRITE, id) && engSheets[id] === undefined) { engBuildSprite(id); n++; }
      return n;
    }
