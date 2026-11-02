    // ---------- 82-w2-chars.js: WORLD 2's enemy sprites: BUG, TIMEOUT, PING, SPARK, and the frost on a frozen conductor (builder 7) ----------
    // Palette sprites (QUEST-API.md part 6). Light from the top left, a dark outline k. The BUG crawls on floors, walls and ceilings, so its two
    // walking frames are turned four ways here, once, when the file loads (data only).
    Q.w2 = Q.w2 || {};
    var w2BugPal = { k: '#1d1d24', g: '#2f9e5c', G: '#7fe0a0', d: '#1d6b3c', y: '#ffd23f', h: '#59626f', H: '#8a93a3', w: '#ffffff', r: '#ff4d4d' };
    var W2_BUG = [[   // facing right on a floor; the body is rows 3 to 11, feet on row 11
      '............',
      '............',
      '............',
      '.........k..',
      '...kkkkk..k.',
      '..kGGGgdkkHk',
      '.kGGyyggkHwk',
      '.kGygggykhkk',
      '.kgyggyggkk.',
      '.kdddddddk..',
      '..k.k.k.k...',
      '.k.k.k.k....'
    ], [
      '............',
      '............',
      '............',
      '..........k.',
      '...kkkkk.k..',
      '..kGGGgdkkHk',
      '.kGGyyggkHwk',
      '.kGygggykhkk',
      '.kgyggyggkk.',
      '.kdddddddk..',
      '..k.k.k.k...',
      '..k.k.k.k...'
    ]];
    function w2Turn(fr, how) {   // a square frame turned: 'cw' (a quarter turn clockwise), 'ccw', 'half', or 'mirror' (left to right)
      var n = fr.length, out = [], r, c, s;
      for (r = 0; r < n; r++) {
        s = '';
        for (c = 0; c < n; c++) s += how === 'cw' ? fr[n - 1 - c].charAt(r) : how === 'ccw' ? fr[c].charAt(n - 1 - r) : how === 'half' ? fr[n - 1 - r].charAt(n - 1 - c) : fr[r].charAt(n - 1 - c);
        out.push(s);
      }
      return out;
    }
    // frames: 2 a pose, walking. Pose 0 a floor (facing right; flip for left), 1 a ceiling (feet up, facing left; flip for right),
    // 2 a wall on its left going down, 3 the same going up, 4 a wall on its right going up, 5 the same going down
    Q.w2.bugFrames = (function () {
      var out = [], i, f, m;
      for (i = 0; i < 6; i++) for (f = 0; f < 2; f++) {
        m = W2_BUG[f];
        out.push(i === 0 ? m : i === 1 ? w2Turn(m, 'half') : i === 2 ? w2Turn(m, 'cw') : i === 3 ? w2Turn(w2Turn(m, 'mirror'), 'cw') : i === 4 ? w2Turn(m, 'ccw') : w2Turn(w2Turn(m, 'mirror'), 'ccw'));
      }
      return out;
    })();
    Q.defSprite('bug', { w: 12, h: 12, pal: w2BugPal, frames: Q.w2.bugFrames });

    var w2ClockPal = { k: '#1d1d24', b: '#7fd3f0', B: '#3a8fb8', c: '#d4f4ff', w: '#ffffff', f: '#bfdfe8', s: '#d0d8e2', S: '#7c8694', r: '#e8402a', y: '#ffd23f' };
    Q.defSprite('timeout', { w: 14, h: 14, pal: w2ClockPal, frames: [[   // 0-1 ticking along, 2 ringing (about to hop), 3 the hop
      '.kk........kk.',
      'kssk......kssk',
      'kSsskkkkkkssSk',
      '.kkkcbbbbbkkk.',
      '..kcbbbbbbbBk.',
      '.kcbwwwkwwwbBk',
      '.kbwkwwkwwkwBk',
      '.kbwwwwkwwwwBk',
      '.kbwwwwwwwwwBk',
      '.kbwfwwwwwfwBk',
      '..kBbffffffBk.',
      '...kkBBBBBkk..',
      '...kk....kk...',
      '..kkk...kkk...'
    ], [
      '.kk........kk.',
      'kssk......kssk',
      'kSsskkkkkkssSk',
      '.kkkcbbbbbkkk.',
      '..kcbbbbbbbBk.',
      '.kcbwwwkwwwbBk',
      '.kbwkwwkwwkwBk',
      '.kbwwwwkkkwwBk',
      '.kbwwwwwwwwwBk',
      '.kbwfwwwwwfwBk',
      '..kBbffffffBk.',
      '...kkBBBBBkk..',
      '....kk..kk....',
      '...kkk..kkk...'
    ], [
      'kk.y......y.kk',
      'ssk.y....y.kss',
      'Sssk.kkkk.kssS',
      'kkkkcbbbbbkkkk',
      '..kcbbbbbbbBk.',
      '.kcbwkwwwkwbBk',
      '.kbwkkwwkkwwBk',
      '.kbwwwrrwwwwBk',
      '.kbwwrwwrwwwBk',
      '.kbwfwrrwwfwBk',
      '..kBbffffffBk.',
      '...kkBBBBBkk..',
      '...kk....kk...',
      '..kkk...kkk...'
    ], [
      '..kk......kk..',
      '.kssk....kssk.',
      '.kSsskkkkssSk.',
      '..kkcbbbbbkk..',
      '..kcbbbbbbbBk.',
      '.kcbwwkwwkwbBk',
      '.kbwwkwwkwwwBk',
      '.kbwwwwkwwwwBk',
      '.kbwwwwkwwwwBk',
      '.kbwfwwwwwfwBk',
      '..kBbffffffBk.',
      '...kkBBBBBkk..',
      '..kkk....kkk..',
      '..............'
    ]] });

    var w2PingPal = { k: '#1d1d24', g: '#39e27a', G: '#b8ffd2', d: '#1e7a45', w: '#ffffff' };
    Q.defSprite('ping', { w: 12, h: 12, pal: w2PingPal, frames: [[   // 0 round, 1 squashed on a bounce, 2 stretched in flight
      '....kkkk....',
      '..kkGGggkk..',
      '.kGwGggggdk.',
      '.kGwgggggdk.',
      'kGggkggkggdk',
      'kgggkggkggdk',
      'kggggggggddk',
      'kggggkkgggdk',
      '.kggggggddk.',
      '.kdggggdddk.',
      '..kkddddkk..',
      '....kkkk....'
    ], [
      '............',
      '............',
      '............',
      '...kkkkkk...',
      '.kkGGgggggk.',
      'kGwGgkggkgdk',
      'kGggggggggdk',
      'kgggggkkggdk',
      'kgggggggggdk',
      '.kddggggddk.',
      '..kkddddkk..',
      '....kkkk....'
    ], [
      '.....kk.....',
      '....kGgk....',
      '...kGwggk...',
      '..kGwgggdk..',
      '..kgkggkdk..',
      '..kgkggkdk..',
      '..kggggggk..',
      '..kgggkggk..',
      '..kggggddk..',
      '...kdgddk...',
      '....kddk....',
      '.....kk.....'
    ]] });

    var w2SparkPal = { y: '#ffd23f', w: '#fff7d6', o: '#ff8a1e', t: '#8ff0e6', Y: '#ffe98a' };
    Q.defSprite('spark', { w: 10, h: 10, pal: w2SparkPal, frames: [[
      '....o.....',
      '..y.Y..o..',
      '...Ywy....',
      '.oYwwwYt..',
      '..ywwwwYy.',
      '.tYwwwy...',
      '...yYwY.o.',
      '..o..y....',
      '......t...',
      '..........'
    ], [
      '......y...',
      '.t...Y....',
      '..yYwY..o.',
      '...wwwY...',
      'oYwwwwwYy.',
      '...Ywwwy..',
      '..yY.wY...',
      '.o....y.t.',
      '....o.....',
      '..........'
    ], [
      '..o.......',
      '...y..t...',
      '.y.YwY.y..',
      '..Ywwwy...',
      '.yYwwwwYo.',
      '..ywwwY...',
      '.t.YwyYy..',
      '....y...o.',
      '...o......',
      '..........'
    ]] });

    Q.defSprite('w2-frost', { w: 22, h: 26, n: 2, draw: function (g, f) {   // a block of ice over a frozen conductor (a TIMEOUT's drawTop; he shows through it)
      var R = Q.w2.R;
      R(g, 'rgba(150,220,255,0.30)', 1, 4, 20, 22); R(g, 'rgba(220,250,255,0.55)', 1, 4, 20, 1); R(g, 'rgba(220,250,255,0.55)', 1, 4, 1, 22);
      R(g, 'rgba(90,170,220,0.6)', 20, 5, 1, 21); R(g, 'rgba(90,170,220,0.6)', 2, 25, 19, 1);
      R(g, '#e2fcff', 3, 2 + f, 1, 2); R(g, '#e2fcff', 17, 1 + f, 1, 3); R(g, '#ffffff', 10, 0, 1, 1); R(g, '#ffffff', 0, 12 + f * 2, 1, 1); R(g, '#ffffff', 21, 9 - f, 1, 1);
      R(g, '#bfefff', 5, 6, 2, 1); R(g, '#bfefff', 15, 7, 2, 1); R(g, '#bfefff', 2, 18, 1, 2); R(g, '#bfefff', 19, 15, 1, 2);
    } });
