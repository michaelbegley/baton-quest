    // ---------- 20-art-base.js: ART's helpers (builder 3). The shared sprites are in 20-art-hero.js to 24-art-tiles.js ----------
    // Every shared sprite is a Q.defSprite palette sprite (QUEST-API.md part 6): { w, h, n, pal, frames }, each frame h strings of w characters, '.' see-through.
    // To keep the files short and the animations easy to read, frames are written side by side: a block is h strings, each holding one row of several frames
    // split by one space. Q.art.def checks every row's width and every colour letter, and says what is wrong with Q.warn (the director's checks read Q.WARN).
    // The look (QUEST-BIBLE.md): a dark outline k (#1d1d24) on characters, light from the top left, two or three shades a colour. Sprites face right; the engine flips them.
    Q.art = Q.art || {};
    Q.art.K = '#1d1d24';
    Q.art.pal = function (more) {   // a palette: k is always the outline, plus the sprite's own letters
      var p = { k: Q.art.K };
      for (var c in more) if (Object.prototype.hasOwnProperty.call(more, c)) p[c] = more[c];
      return p;
    };
    Q.art.sheet = function (id, w, h, blocks) {   // blocks of side-by-side frames -> [ frame: [ h strings of w ] ]
      var frames = [];
      for (var b = 0; b < blocks.length; b++) {
        var rows = blocks[b], n = rows.length ? rows[0].split(' ').length : 0, base = frames.length;
        if (rows.length !== h) Q.warn('sprite ' + id + ': block ' + b + ' has ' + rows.length + ' rows, not ' + h);
        for (var f = 0; f < n; f++) frames.push([]);
        for (var r = 0; r < rows.length; r++) {
          var parts = rows[r].split(' ');
          if (parts.length !== n) Q.warn('sprite ' + id + ': block ' + b + ' row ' + r + ' has ' + parts.length + ' frames, not ' + n);
          for (var q = 0; q < n; q++) {
            var s = parts[q] || '';
            if (s.length !== w) Q.warn('sprite ' + id + ': frame ' + (base + q) + ' row ' + r + ' is ' + s.length + ' wide, not ' + w);
            frames[base + q].push(s);
          }
        }
      }
      return frames;
    };
    Q.art.def = function (id, w, h, pal, blocks) {   // define a palette sprite from blocks, checking its letters
      var frames = Q.art.sheet(id, w, h, blocks), bad = {};
      for (var i = 0; i < frames.length; i++) for (var r = 0; r < frames[i].length; r++) for (var c = 0; c < frames[i][r].length; c++) {
        var ch = frames[i][r].charAt(c);
        if (ch !== '.' && !Object.prototype.hasOwnProperty.call(pal, ch) && !bad[ch]) { bad[ch] = true; Q.warn('sprite ' + id + ': the letter ' + ch + ' (frame ' + i + ') is not in its palette'); }
      }
      return Q.defSprite(id, { w: w, h: h, n: frames.length, pal: pal, frames: frames });
    };
    Q.art.flipRows = function (rows) {   // a frame mirrored left to right (for art that is drawn once and used both ways)
      var out = [];
      for (var r = 0; r < rows.length; r++) out.push(rows[r].split('').reverse().join(''));
      return out;
    };
