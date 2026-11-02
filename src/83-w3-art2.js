    // ---------- 83-w3-art2.js: WORLD 3, THE CLOUD (builder 8): the enemies' and THE INFINITE LOOP's sprites ----------
    Q.w3 = Q.w3 || {};
    // a shape drawn pointing right, turned to any angle with a fresh dark outline (so the outline never breaks when it is turned)
    function w3Turn(rows, ang) {
      var n = rows.length, cx = (n - 1) / 2, ca = Math.cos(ang), sa = Math.sin(ang), grid = [], out = [], x, y, sx, sy, dx, dy, r, s, c;
      for (y = 0; y < n; y++) {
        r = [];
        for (x = 0; x < n; x++) { dx = x - cx; dy = y - cx; sx = Math.round(cx + dx * ca + dy * sa); sy = Math.round(cx - dx * sa + dy * ca); r.push(sx >= 0 && sy >= 0 && sx < n && sy < n ? rows[sy].charAt(sx) : '.'); }
        grid.push(r);
      }
      for (y = 0; y < n; y++) {
        s = '';
        for (x = 0; x < n; x++) {
          c = grid[y][x];
          if (c === '.' && ((x > 0 && grid[y][x - 1] !== '.') || (x < n - 1 && grid[y][x + 1] !== '.') || (y > 0 && grid[y - 1][x] !== '.') || (y < n - 1 && grid[y + 1][x] !== '.'))) c = 'k';
          s += c;
        }
        out.push(s);
      }
      return out;
    }
    function w3Paint(g, rows, pal) {
      for (var y = 0; y < rows.length; y++) for (var x = 0; x < rows[y].length; x++) { var ch = rows[y].charAt(x); if (ch !== '.') { g.fillStyle = pal[ch] || '#ff00ff'; g.fillRect(x, y, 1, 1); } }
    }
    // the loop's pieces, pointing right: a thick chevron (a body segment) and an arrowhead (the head)
    var w3Chev = [
      '............', '............', '.yo.........', '.yyoo.......', '..yyooo.....', '...yyoooh...',
      '...yyoooh...', '..ooohhh....', '.oohhh......', '.ohh........', '............', '............'];
    var w3Head = [
      '................', '................', '......yo........', '......yyo.......', '......yyoo......', '.yyyyyyyooo.....', '.yooooooooooh...', '.oooooooooooohh.',
      '.ohhhhhhhhhhhh..', '.hhhhhhhhhhhh...', '......ohhhh.....', '......ohhh......', '......ohh.......', '......hh........', '................', '................'];
    var W3_LOOP = { o: '#ff8a1e', h: '#c85a10', y: '#ffd23f', k: '#1d1d24' };
    var W3_GLOW = { o: '#fff3b0', h: '#ffd23f', y: '#ffffff', k: '#1d1d24' };
    var W3_HOT = { o: '#e2504c', h: '#9e2a2a', y: '#ffffff', k: '#1d1d24' };
    Q.defSprite('loop-seg', { w: 12, h: 12, n: 16, draw: function (g, f) { w3Paint(g, w3Turn(w3Chev, (f % 8) * Math.PI / 4), f < 8 ? W3_LOOP : W3_GLOW); } });
    Q.defSprite('loop-dart', { w: 12, h: 12, n: 8, draw: function (g, f) { w3Paint(g, w3Turn(w3Chev, f * Math.PI / 4), W3_HOT); } });   // a loose arrow: red, so it reads apart from the body
    Q.defSprite('loop-head', { w: 16, h: 16, n: 16, draw: function (g, f) {
      var a = (f % 8) * Math.PI / 4, ca = Math.cos(a), sa = Math.sin(a), i, ex, ey, off = [[1.5, -3], [1.5, 2.5]];
      w3Paint(g, w3Turn(w3Head, a), f < 8 ? W3_LOOP : W3_HOT);
      for (i = 0; i < 2; i++) {   // the eyes, put on after the turn, looking ahead
        ex = Math.round(7.5 + off[i][0] * ca - off[i][1] * sa - 0.5); ey = Math.round(7.5 + off[i][0] * sa + off[i][1] * ca - 0.5);
        g.fillStyle = '#1d1d24'; g.fillRect(ex - 1, ey - 1, 4, 4); g.fillStyle = '#ffffff'; g.fillRect(ex, ey, 2, 2);
        g.fillStyle = '#1d1d24'; g.fillRect(ex + (ca > 0.3 ? 1 : 0), ey + (sa > 0.3 ? 1 : 0), 1, 1);
      }
    } });
    Q.defSprite('loop-shot', { w: 8, h: 8, n: 4, draw: function (g, f) {   // a little spinning arrow ring the loop throws off
      var k = '#1d1d24', pts = [[3, 0], [6, 2], [6, 5], [3, 7], [0, 5], [0, 2]], i, p;
      g.fillStyle = k; g.fillRect(1, 1, 6, 6); g.fillRect(2, 0, 4, 8); g.fillRect(0, 2, 8, 4);
      g.fillStyle = '#ff8a1e'; g.fillRect(2, 1, 4, 6); g.fillRect(1, 2, 6, 4); g.fillStyle = '#1d1d24'; g.fillRect(3, 3, 2, 2);
      for (i = 0; i < 2; i++) { p = pts[(f + i * 3) % 6]; g.fillStyle = '#ffd23f'; g.fillRect(p[0] + (p[0] > 3 ? 0 : 1), p[1] + (p[1] > 3 ? 0 : 1), 1, 1); }
    } });
    Q.defSprite('face-loop', { w: 16, h: 16, n: 2, draw: function (g, f) {   // its face in the text box: a ring arrow with a dizzy, cheerful face inside
      var a, i, x, y, k = '#1d1d24';
      g.fillStyle = '#3b86d6'; g.fillRect(0, 0, 16, 16);
      for (i = 0; i < 40; i++) {
        a = -0.6 + i / 40 * Math.PI * 1.7; x = Math.round(7.5 + Math.cos(a) * 6); y = Math.round(7.5 + Math.sin(a) * 6);
        g.fillStyle = k; g.fillRect(x - 1, y - 1, 3, 3);
      }
      for (i = 0; i < 40; i++) { a = -0.6 + i / 40 * Math.PI * 1.7; x = Math.round(7.5 + Math.cos(a) * 6); y = Math.round(7.5 + Math.sin(a) * 6); g.fillStyle = i < 20 ? '#ffd23f' : '#ff8a1e'; g.fillRect(x, y, 1, 1); }
      g.fillStyle = k; g.fillRect(11, 0, 5, 1); g.fillRect(12, 1, 4, 1); g.fillRect(13, 2, 3, 2); g.fillStyle = '#ff8a1e'; g.fillRect(12, 0, 3, 1); g.fillRect(13, 1, 2, 1); g.fillRect(14, 2, 1, 1);
      g.fillStyle = '#ffffff'; g.fillRect(5, 6, 2, 2); g.fillRect(9, 6, 2, 2);
      g.fillStyle = k;
      if (f) { g.fillRect(5, 6, 1, 1); g.fillRect(6, 7, 1, 1); g.fillRect(9, 7, 1, 1); g.fillRect(10, 6, 1, 1); } else { g.fillRect(6, 7, 1, 1); g.fillRect(10, 7, 1, 1); }
      g.fillRect(6, 10, 4, 1); g.fillRect(5, 9, 1, 1); g.fillRect(10, 9, 1, 1);
    } });

    // LOADING SPINNER: a ring of dots with a bright one going round; frames 8 to 15 are its tell (hot, about to throw)
    Q.defSprite('spinner', { w: 14, h: 14, n: 16, draw: function (g, f) {
      var i, a, b, hot = f >= 8, pos = [], cool = ['#ffffff', '#c8f4ee', '#7fe0d6', '#2ec4b6', '#2a9aa0', '#3a7896', '#486a8a', '#52647e'],
        warm = ['#ffffff', '#fff1a0', '#ffd23f', '#ffb13a', '#ff8a1e', '#e0662a', '#c0503a', '#9a4a44'];
      for (i = 0; i < 8; i++) { a = i / 8 * Math.PI * 2 - Math.PI / 2; pos.push([Math.round(5.5 + Math.cos(a) * 4.6), Math.round(5.5 + Math.sin(a) * 4.6)]); }
      g.fillStyle = '#1d1d24';
      for (i = 0; i < 8; i++) g.fillRect(pos[i][0] - 1, pos[i][1] - 1, 5, 5);
      g.fillRect(5, 5, 4, 4);
      for (i = 0; i < 8; i++) { b = (8 - (((i - f) % 8 + 8) % 8)) % 8; g.fillStyle = (hot ? warm : cool)[b]; g.fillRect(pos[i][0], pos[i][1], 3, 3); if (b === 0) { g.fillStyle = hot ? '#ffd23f' : '#ffffff'; g.fillRect(pos[i][0], pos[i][1], 2, 2); } }
      g.fillStyle = hot ? '#ffd23f' : '#ffffff'; g.fillRect(5, 6, 1, 1); g.fillRect(8, 6, 1, 1);
    } });
    Q.defSprite('w3-dot', { w: 6, h: 6, n: 2, draw: function (g, f) {
      g.fillStyle = '#1d1d24'; g.fillRect(1, 0, 4, 6); g.fillRect(0, 1, 6, 4);
      g.fillStyle = f ? '#ffd23f' : '#ffffff'; g.fillRect(1, 1, 4, 4); g.fillStyle = f ? '#ff8a1e' : '#2ec4b6'; g.fillRect(3, 3, 2, 2);
    } });

    // RATE LIMITER: a gate of bars that slams down from its housing; its foot carries a light (0 green: open, 1 yellow: about to shut, 2 red: shut)
    function w3Bars(g, y0, y1) {
      var C = Q.w3.C, i, x;
      w3R(g, C.k, 1, y0, 2, y1 - y0); w3R(g, C.k, 13, y0, 2, y1 - y0);
      for (i = 0; i < 3; i++) { x = 4 + i * 3; w3R(g, C.k, x, y0, 2, y1 - y0); w3R(g, '#7f8fa8', x, y0, 1, y1 - y0); }
      w3R(g, '#6a7a96', 2, y0, 1, y1 - y0); w3R(g, '#6a7a96', 13, y0, 1, y1 - y0);
    }
    Q.defSprite('limiter-bar', { w: 16, h: 16, n: 1, draw: function (g) { w3Bars(g, 0, 16); } });
    Q.defSprite('limiter-top', { w: 16, h: 8, n: 1, draw: function (g) {
      var C = Q.w3.C; w3R(g, C.k, 0, 0, 16, 8); w3R(g, C.e, 1, 1, 14, 5); w3R(g, '#6a7a96', 1, 1, 14, 1); w3Dots(g, '#9aa8bf', [3, 3, 12, 3]);
    } });
    Q.defSprite('limiter', { w: 16, h: 16, n: 3, draw: function (g, f) {
      var C = Q.w3.C, i, lamp = f === 0 ? '#4fd67a' : f === 1 ? C.y : C.r;
      w3Bars(g, 0, 9);
      w3R(g, C.k, 0, 8, 16, 8); w3R(g, C.y, 1, 9, 14, 6);
      for (i = 0; i < 4; i++) { w3R(g, C.k, 1 + i * 4, 9, 2, 6); }
      w3R(g, C.k, 5, 9, 6, 6); w3R(g, lamp, 6, 10, 4, 4); w3R(g, C.w, 6, 10, 1, 1);
    } });

    // CACHE MISS: the ghost of a page that should have been there; frame 2 is only its dotted outline (where it is about to appear)
    Q.defSprite('miss', { w: 14, h: 14, n: 3, draw: function (g, f) {
      var C = Q.w3.C, x;
      if (f === 2) {   // where it is about to be: a bright dotted page with a question mark
        for (x = 1; x < 13; x += 2) { w3R(g, '#f3edff', x, 0, 1, 1); w3R(g, '#f3edff', x + 1, 12, 1, 1); }
        for (x = 1; x < 13; x += 2) { w3R(g, '#f3edff', 0, x, 1, 1); w3R(g, '#f3edff', 12, x - 1, 1, 1); }
        w3R(g, '#ffd23f', 5, 3, 3, 1); w3R(g, '#ffd23f', 8, 4, 1, 2); w3R(g, '#ffd23f', 6, 6, 2, 1); w3R(g, '#ffd23f', 6, 7, 1, 1); w3R(g, '#ffd23f', 6, 9, 1, 1);
        return;
      }
      w3R(g, C.k, 1, 0, 10, 12); w3R(g, C.k, 0, 1, 13, 11); w3R(g, C.k, 11, 3, 2, 9);
      w3R(g, C.p, 1, 1, 9, 11); w3R(g, C.p, 11, 4, 1, 8); w3R(g, '#e4d9fb', 1, 1, 2, 9);
      w3R(g, C.q, 9, 1, 1, 3); w3R(g, C.q, 10, 3, 2, 1); w3R(g, C.k, 10, 1, 1, 1); w3R(g, C.k, 11, 2, 1, 1);
      for (x = 0; x < 3; x++) { var bx = 1 + x * 4 + (f ? 2 : 0); w3R(g, C.k, bx, 12, 3, 1); w3R(g, C.p, bx, 11, 3, 1); w3R(g, C.k, bx + 1, 13, 1, 1); w3R(g, C.p, bx + 1, 12, 1, 1); }
      w3R(g, C.k, 4, 5, 2, 2); w3R(g, C.k, 8, 5, 2, 2); w3R(g, C.w, 4, 5, 1, 1); w3R(g, C.w, 8, 5, 1, 1);
      w3R(g, C.k, 6, 8, 2, 2); w3R(g, C.q, 6, 8, 1, 1);
    } });

    // PUSH NOTIFICATION (world 3's own extra): a little bell with a red badge; frames 0 and 1 sway, 2 is its tell (ringing)
    Q.defSprite('push', { w: 12, h: 12, n: 3, draw: function (g, f) {
      var C = Q.w3.C, s = f === 1 ? 1 : 0, y;
      w3R(g, C.k, 4 + s, 0, 3, 2);
      for (y = 2; y < 9; y++) { var hw = 2 + Math.floor((y - 2) / 2); w3R(g, C.k, 5 + s - hw - 1, y, hw * 2 + 3, 1); }
      w3R(g, C.k, 0 + s, 9, 12 - s, 2);
      for (y = 3; y < 9; y++) { var iw = 1 + Math.floor((y - 2) / 2); w3R(g, C.y, 5 + s - iw, y, iw * 2 + 1, 1); }
      w3R(g, C.m, 1 + s, 9, 10 - s, 1); w3R(g, C.w, 4 + s, 3, 1, 3);
      w3R(g, C.k, 4 + s, 11, 3, 1); w3R(g, C.o, 5 + s, 10, 1, 1);
      w3R(g, C.k, 7, 0, 5, 5); w3R(g, C.r, 8, 1, 3, 3); w3R(g, C.w, 9, 1, 1, 3);
      if (f === 2) { w3Dots(g, C.k, [0, 3, 0, 5, 11, 6, 11, 8]); }
    } });

    // a drifting cloud you can stand on (a plain puff with an outline: never a face)
    Q.defSprite('w3-puff', { w: 48, h: 14, n: 1, draw: function (g) {
      var C = Q.w3.C, d = [[8, 7, 5], [17, 6, 6], [27, 5, 6], [37, 6, 6], [42, 8, 4]], i;
      for (i = 0; i < d.length; i++) w3Disc(g, C.k, d[i][0], d[i][1], d[i][2] + 1);
      g.fillStyle = C.k; g.fillRect(2, 7, 44, 7);
      for (i = 0; i < d.length; i++) w3Disc(g, C.c, d[i][0], d[i][1], d[i][2]);
      g.fillStyle = C.c; g.fillRect(3, 7, 42, 6);
      g.fillStyle = C.s; g.fillRect(4, 10, 40, 3);
      for (i = 0; i < d.length; i++) w3Disc(g, C.w, d[i][0] - 1, d[i][1] - 1, d[i][2] - 2);
    } });
    // a lightning mark on the ground (it flashes where a bolt will land)
    Q.defSprite('w3-mark', { w: 24, h: 8, n: 2, draw: function (g, f) {
      var c = f ? '#ffffff' : '#ffd23f', k = '#1d1d24';
      g.fillStyle = k; g.fillRect(0, 5, 24, 3); g.fillRect(10, 0, 4, 8); g.fillRect(3, 3, 3, 3); g.fillRect(18, 3, 3, 3);
      g.fillStyle = c; g.fillRect(1, 6, 22, 1); g.fillRect(11, 1, 2, 6); g.fillRect(4, 4, 1, 2); g.fillRect(19, 4, 1, 2);
      g.fillStyle = k; g.fillRect(11, 3, 2, 1);
    } });
