    // ---------- 77-ui-art.js: the UI's own pictures (UI, builder 5): the BATON QUEST lettering, the title's drift, an office desk ----------
    // Our own drawing throughout. The lettering is a chunky block alphabet of our own (2-pixel strokes on a 6 by 7 grid), drawn big with an outline and a
    // deep edge, warm for BATON and cool for QUEST. Ids start with 'u5-' so they never meet ART's.
    (function () {
      var U = Q.ui;
      var GLYPH = {
        B: ['#####.', '##..##', '##..##', '#####.', '##..##', '##..##', '#####.'],
        A: ['.####.', '##..##', '##..##', '######', '##..##', '##..##', '##..##'],
        T: ['######', '######', '..##..', '..##..', '..##..', '..##..', '..##..'],
        O: ['.####.', '##..##', '##..##', '##..##', '##..##', '##..##', '.####.'],
        N: ['##..##', '###.##', '######', '##.###', '##..##', '##..##', '##..##'],
        Q: ['.####.', '##..##', '##..##', '##..##', '##.###', '.#####', '....##'],
        U: ['##..##', '##..##', '##..##', '##..##', '##..##', '##..##', '.####.'],
        E: ['######', '##....', '##....', '#####.', '##....', '##....', '######'],
        S: ['.#####', '##....', '##....', '.####.', '....##', '....##', '#####.'],
        H: ['##..##', '##..##', '##..##', '######', '##..##', '##..##', '##..##'],
        D: ['#####.', '##..##', '##..##', '##..##', '##..##', '##..##', '#####.'],
        K: ['##..##', '##.##.', '####..', '###...', '####..', '##.##.', '##..##'],
        F: ['######', '##....', '##....', '#####.', '##....', '##....', '##....'],
        I: ['######', '..##..', '..##..', '..##..', '..##..', '..##..', '######'],
        V: ['##..##', '##..##', '##..##', '##..##', '##..##', '.####.', '..##..'],
        L: ['##....', '##....', '##....', '##....', '##....', '##....', '######'],
        R: ['#####.', '##..##', '##..##', '#####.', '####..', '##.##.', '##..##'],
        C: ['.#####', '##....', '##....', '##....', '##....', '##....', '.#####'],   // version 116: ENCORE
        ' ': ['......', '......', '......', '......', '......', '......', '......']
      };
      U.GLYPH = GLYPH;
      U.bigWidth = function (s, k) { return s.length * 7 * k - k; };
      U.bigWord = function (g, s, x, y, k, face, side) {   // big letters of our own: face = [top, middle, low] colours by row, side = the deep edge under them
        var pass, i, r, c, rows, bx, by, gx, o = k >= 4 ? 2 : 1, d = k >= 4 ? 4 : k >= 3 ? 3 : 2;   // the outline and the depth of the edge grow with the blocks
        for (pass = 0; pass < 4; pass++) for (i = 0; i < s.length; i++) {
          rows = GLYPH[s.charAt(i)]; if (!rows) continue;
          gx = x + i * 7 * k;
          for (r = 0; r < 7; r++) for (c = 0; c < 6; c++) {
            if (rows[r].charAt(c) !== '#') continue;
            bx = gx + c * k; by = y + r * k;
            if (pass === 0) { g.fillStyle = '#1d1d24'; g.fillRect(bx - o, by - o, k + 2 * o, k + 2 * o + d); }
            else if (pass === 1) { g.fillStyle = side; g.fillRect(bx, by + k, k, d); }
            else if (pass === 2) { g.fillStyle = r < 2 ? face[0] : r < 4 ? face[1] : face[2]; g.fillRect(bx, by, k, k); }
            else if (r === 0 || rows[r - 1].charAt(c) !== '#') { g.fillStyle = '#ffffff'; g.fillRect(bx, by, k, 1); }
          }
        }
      };
      var WARM = ['#fff3c4', '#ffd23f', '#ff9a2a'], WARM_SIDE = '#9a4710', COOL = ['#d2fbf6', '#2ec4b6', '#17958b'], COOL_SIDE = '#0b4a47';
      U.WARM = WARM; U.WARM_SIDE = WARM_SIDE; U.COOL = COOL; U.COOL_SIDE = COOL_SIDE;
      Q.defSprite('u5-logo', { w: 178, h: 94, n: 1, draw: function (g) {   // BATON over QUEST, 5-pixel blocks
        U.bigWord(g, 'BATON', 4, 3, 5, WARM, WARM_SIDE);
        U.bigWord(g, 'QUEST', 4, 51, 5, COOL, COOL_SIDE);
      } });
      Q.defSprite('u5-logo-s', { w: 158, h: 22, n: 1, draw: function (g) {   // the same in one line, small (for the credits)
        U.bigWord(g, 'BATON', 2, 2, 2, WARM, WARM_SIDE);
        U.bigWord(g, 'QUEST', 86, 2, 2, COOL, COOL_SIDE);
      } });
      // ---- the title's drift: envelopes, tickets and notes, in soft night colours so they stay behind ----
      Q.defSprite('u5-env', { w: 10, h: 7, pal: { k: '#2c3a63', w: '#9cabcd', f: '#6878a3' }, frames: [[
        'kkkkkkkkkk', 'kwfwwwwfwk', 'kwwfwwfwwk', 'kwwwffwwwk', 'kwwwwwwwwk', 'kwwwwwwwwk', 'kkkkkkkkkk'
      ]] });
      Q.defSprite('u5-tix', { w: 11, h: 6, pal: { k: '#26365f', b: '#5576b8', y: '#93afe6' }, frames: [[
        'kkkkkkkkkkk', 'kbbbbbybbbk', '.bbbbbbbbb.', '.bbbbbybbb.', 'kbbbbbbbbbk', 'kkkkkkkkkkk'
      ]] });
      Q.defSprite('u5-note', { w: 6, h: 9, pal: { k: '#7a6a33', y: '#c7ac52' }, frames: [[
        '...k..', '...kk.', '...k.k', '...k..', '...k..', '.kkk..', 'kyyk..', 'kyyk..', '.kk...'
      ]] });
      Q.defSprite('u5-stick', { w: 5, h: 5, n: 2, draw: function (g, f) {   // a sticky note on a vine: yellow, pink
        g.fillStyle = '#1d1d24'; g.fillRect(0, 0, 5, 5);
        g.fillStyle = f ? '#ff9ec6' : '#ffd23f'; g.fillRect(1, 1, 3, 3);
        g.fillStyle = f ? '#ffd0e3' : '#fff1a8'; g.fillRect(1, 1, 3, 1);
      } });
      // ---- an office desk seen from the front (44 by 32): the monitor at the right, a keyboard, a mug at the left; it hides the legs of whoever sits behind ----
      Q.defSprite('u5-desk', { w: 44, h: 32, n: 1, draw: function (g) {
        function f(x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
        f(24, 0, 18, 13, '#1d1d24'); f(25, 1, 16, 11, '#3a3d52'); f(26, 2, 14, 9, '#0d1018');   // the monitor: its frame and screen
        f(31, 12, 4, 2, '#1d1d24'); f(29, 13, 8, 1, '#1d1d24');                                 // its stand
        f(0, 14, 44, 4, '#1d1d24'); f(1, 14, 42, 1, '#c08552'); f(1, 15, 42, 2, '#8a5532');     // the top
        f(2, 18, 40, 14, '#1d1d24'); f(3, 18, 38, 13, '#5e3a22'); f(3, 18, 38, 1, '#4a2d1a');   // the front panel
        f(6, 21, 32, 1, '#6e4529'); f(6, 27, 32, 1, '#4a2d1a');
        f(12, 12, 12, 2, '#1d1d24'); f(13, 12, 10, 1, '#c3c7d4');                              // the keyboard
        f(3, 8, 6, 6, '#1d1d24'); f(4, 9, 4, 5, '#f6efe2'); f(8, 10, 2, 2, '#1d1d24'); f(4, 9, 4, 1, '#ffffff');   // the mug
      } });
    })();
