    // ---------- 22-art-compass.js (B24, 11 Nov 2026): THE COMPASS, the newest on the Ninth Floor (ART) ----------
    // A brass pocket compass the size of a desk clock: a glass face over a dark dial, a red-and-white needle, a little ring on top, three short brass feet.
    // No face and no body, like the Facilitator: its needle is its face. Up and still: sure. A wobble: something drifted. A slow spin: reading. Pointing: the one thing next.
    //   face-compass (12 by 12): its icon in the text box, like the Facilitator's 'facil'. Frame 0 the needle up and still; frame 1 a hair off (the box shows 1 and 0
    //     in turn while it types, so the needle twitches as it talks, and stands still and sure when it is done). The name 'face-' only puts it in the middle of the
    //     portrait frame (70-ui-text.js drawFace), as the Facilitator's bubble is; the Compass has no face.
    //   compass-body (15 by 18): the whole thing without its needle. Q.art.compass(g, x, y, ang, k) draws it at k times its size with the needle at ang (radians,
    //     0 up, clockwise), red to ang and white behind; the needle is a line of whole pixels from the middle of the glass, and never leaves the glass.
    //   compass-box (15 by 12): the box it came in, marked THIS WAY UP (frame 0 shut, frame 1 its flaps open), for its first scene on the map.
    (function () {
      var PAL = Q.art.pal({ B: '#ffe9a0', b: '#d9a83a', o: '#9a6a1e', O: '#6e4a12', g: '#24324c', G: '#1a2438', r: '#e0443a', c: '#f6efe2' });
      Q.art.def('face-compass', 12, 12, PAL, [
        [
          '.....kkk.... .....kkk....',
          '....kB.ok... ....kB.ok...',
          '...kkkkkkk.. ...kkkkkkk..',
          '..kBBBbbbok. ..kBBBbbbok.',
          '.kBgggrgggok .kBggggrggok',
          '.kBgggrgggok .kBgggrgggok',
          '.kbgggbgggok .kbgggbgggok',
          '.kbgggcggGok .kbgggcggGok',
          '.kbGggcgGGok .kbGgcggGGok',
          '..kboooooOk. ..kboooooOk.',
          '...kkkkkkk.. ...kkkkkkk..',
          '...oo.o.oo.. ...oo.o.oo..'
        ]
      ]);
      var BODY = [
        '......kkk......',
        '.....kB.ok.....',
        '......kbk......',
        '.....kkkkk.....',
        '...kkBBBbbkk...',
        '..kBBBkkkbbbk..',
        '..kBkkgggkkbk..',
        '.kBBkgggggkbok.',
        '.kBkgggggggkok.',
        '.kbkgggggggkok.',
        '.kbkgggggggkok.',
        '.kbbkgggGGkook.',
        '..kbkkGGGkkok..',
        '..kbookkkoook..',
        '...kkoooookk...',
        '..kbkkkkkkkok..',
        '..kbk.kbk.kok..',
        '..kkk.kkk.kkk..'
      ];
      Q.art.def('compass-body', 15, 18, PAL, [BODY]);
      Q.art.def('compass-box', 15, 12, Q.art.pal({ Y: '#e2b77c', y: '#c8955a', q: '#9a6a3a', t: '#efe2bd' }), [
        [
          'kkkkkkkkkkkkkkk kYk.........kYk',
          'kYYYYYYtYYYYYYk kYYk.......kYYk',
          'kYYYYYYtYYYYYYk .kYYk.....kYYk.',
          'kkkkkkkkkkkkkkk kkkkkkkkkkkkkkk',
          'kyyyyyykyyyyyqk kyyyyyykyyyyyqk',
          'kyyyyykkkyyyyqk kyyyyykkkyyyyqk',
          'kyyyykkkkkyyyqk kyyyykkkkkyyyqk',
          'kyyyyyykyyyyyqk kyyyyyykyyyyyqk',
          'kyyyyyykyyyyyqk kyyyyyykyyyyyqk',
          'kyyyyyyyyyyyyqk kyyyyyyyyyyyyqk',
          'kqqqqqqqqqqqqqk kqqqqqqqqqqqqqk',
          'kkkkkkkkkkkkkkk kkkkkkkkkkkkkkk'
        ]
      ]);
      var CX = 7, CY = 9, LEN = 3, GLASS = {}, y, x, ch;   // the middle of the glass, the needle's half length, and which pixels are glass
      for (y = 0; y < BODY.length; y++) for (x = 0; x < BODY[y].length; x++) { ch = BODY[y].charAt(x); if (ch === 'g' || ch === 'G') GLASS[x + ',' + y] = true; }
      Q.art.COMPASS = { w: 15, h: 18, cx: CX, cy: CY };   // for callers that aim the needle: the glass's middle pixel, from the body's top left
      function dot(g, x0, y0, px, py, k, col) { if (!GLASS[px + ',' + py]) return; g.fillStyle = col; g.fillRect(x0 + px * k, y0 + py * k, k, k); }
      function half(g, x0, y0, ex, ey, k, col) {   // whole pixels from the middle out to ex, ey (a line with no gaps), only on the glass
        var n = Math.max(Math.abs(ex), Math.abs(ey)), i;
        for (i = 1; i <= n; i++) dot(g, x0, y0, CX + Math.floor(ex * i / n + 0.5), CY + Math.floor(ey * i / n + 0.5), k, col);
      }
      Q.art.compass = function (g, x, y, ang, k) {   // the whole compass at x, y (its top left), k times its size (a whole number), the needle at ang
        k = Math.max(1, Math.round(k || 1)); x = Math.round(x); y = Math.round(y);
        if (k === 1) Q.spr(g, 'compass-body', 0, x, y);
        else { g.save(); g.translate(x, y); g.scale(k, k); Q.spr(g, 'compass-body', 0, 0, 0); g.restore(); }
        dot(g, x, y, 5, 7, k, '#8fa6c8');   // a glint on the glass, under the needle
        var a = +ang || 0, ex = Math.floor(Math.sin(a) * LEN + 0.5), ey = Math.floor(-Math.cos(a) * LEN + 0.5);
        half(g, x, y, -ex, -ey, k, '#f6efe2');   // the white half behind
        half(g, x, y, ex, ey, k, '#e0443a');   // the red half, to where it points
        g.fillStyle = '#d9a83a'; g.fillRect(x + CX * k, y + CY * k, k, k);   // the brass pin
      };
    })();
