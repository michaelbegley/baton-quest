    // ---------- 25-art-overtime.js: version 116, THE OVERTIME UPDATE (ART, builder 3; QUEST-API.md part 14.7) ----------
    // ic-star (12 by 12: 0 a gold star won, 1 a dim one still locked), ic-clock (8 by 8: a stopwatch, a level at or under par), map-encore (16 by 16: a little stage
    // under a spotlight), map-root (16 by 16: an old folder), readme (16 by 16, 2 frames: README.TXT on a small desk, shut and open). The background 'root' is in
    // 25-art-root-bg.js. The office palette, the dark outline, light from the top left.
    Q.art.def('ic-star', 12, 12, Q.art.pal({ U: '#fff1a8', u: '#ffd23f', v: '#c98a12', w: '#ffffff', g: '#6a7088', G: '#4d5268', h: '#3a3e50' }), [
      [
        '.....k...... .....k......',
        '....kUk..... ....kgk.....',
        '....kUk..... ....kgk.....',
        'kkkkUuukkkk. kkkkgGGkkkk.',
        'kUUwUuuuuvk. kggggGGGGhk.',
        '.kUUuuuuvk.. .kggGGGGhk..',
        '..kuuuuuk... ..kGGGGGk...',
        '..kuuuuvk... ..kGGGGhk...',
        '.kuuvkuuvk.. .kGGhkGGhk..',
        '.kuvk.kuvk.. .kGhk.kGhk..',
        'kuk.....kvk. kGk.....khk.',
        'kk.......kk. kk.......kk.'
      ]
    ]);
    Q.art.def('ic-clock', 8, 8, Q.art.pal({ y: '#ffd23f', w: '#ffffff', x: '#c3c7d4', t: '#2ec4b6', T: '#1e8a80' }), [
      [
        '...yy...',
        '..tttt..',
        '.twwkwt.',
        'twwwkwwT',
        'twwwkkwT',
        'twwwwwxT',
        '.TxxxxT.',
        '..TTTT..'
      ]
    ]);
    // map-encore: red drapes (lit on the left of each fold) tied back in gold, a lamp under the valance, a warm cone of light and its pool on a walnut stage.
    Q.art.def('map-encore', 16, 16, Q.art.pal({ R: '#e8404f', r: '#a8243a', q: '#6e1a2c', y: '#ffd23f', n: '#1e2236', g: '#8a92a6', W: '#ffffff',
                                             o: '#4a4636', O: '#a39a72', Y: '#fff4bf', L: '#b07a4f', T: '#7a4a2a', t: '#55321b' }), [
      [
        'kkkkkkkkkkkkkkkk',
        'kRRRRRRRRRRRRRRk',
        'kRrRRrRRrRRrRRrk',
        'kqqqqqgggqqqqqqk',
        'kRrRnnnWnnnnRrRk',
        'kRrRnnoOonnnRrRk',
        'kRrRnnoOOonnRrRk',
        'kyyrnoOOOonnryyk',
        'kRrnnoOOOOonnRrk',
        'kRrnoOOOOOonnRrk',
        'kRrRoOOOOOOonRrk',
        'kRrRTYYYYYYYTRrk',
        'kLLLYYYWWWYYYLLk',
        'kTTTTTTTTTTTTTTk',
        'kttttttttttttttk',
        'kkkkkkkkkkkkkkkk'
      ]
    ]);
    Q.art.def('map-root', 16, 16, Q.art.pal({ H: '#e2c78e', F: '#c4a05e', f: '#9a7a40', d: '#6e5428', p: '#f2ead8', c: '#8a6a3a' }), [
      [
        '................',
        '.kkkkkk.........',
        'kfffffdk........',
        'kffffffdkkkkkkk.',
        'kfffffffffffffdk',
        'kfkkkkkkkkkkkkfk',
        'kkHpppppppppppkk',
        'kHHHHHHHHHHHHFdk',
        'kHFFFFFFFFFFFFdk',
        'kHFFFcccFFFFFFdk',
        'kHFFcFFFcFFFFFdk',
        'kHFFcFFFcFFFFkdk',
        'kHFFFcccFFFFkkdk',
        'kHFFFFFFFFFFkfdk',
        'kdddddddddddddkk',
        '.kkkkkkkkkkkkkk.'
      ]
    ]);
    // readme: README.TXT, the very first file on the 9F computer, on a small walnut desk. Frame 0 shut (a worn manila folder with its label); frame 1 open (a page of
    // writing, lit a little, as he reads it).
    Q.art.def('readme', 16, 16, Q.art.pal({ p: '#f6efe2', P: '#ffffff', x: '#d8ccb6', b: '#2f7de1', d: '#5a6078', H: '#e2c78e', F: '#c4a05e', f: '#9a7a40',
                                            Y: '#fff4bf', L: '#b07a4f', T: '#7a4a2a', t: '#55321b' }), [
      [
        '................ ...Y.......Y....',
        '................ .......Y........',
        '................ ....kkkkkkk.....',
        '...kkkk......... ...YkPPPPPkY....',
        '..kHHHHkkkkkk... ....kPbbbPk.....',
        '..kHHHHHHHHHHk.. ....kPPPPPk.....',
        '..kHFFFFFFFFfk.. ..kkkPbbPPkkkk..',
        '..kHFppppppFfk.. ..kHHPPPPPHHHk..',
        '..kHFpddddpFfk.. ..kHFkkkkkFFfk..',
        '..kHfffffffffk.. ..kHfffffffffk..',
        '.kkkkkkkkkkkkkk. .kkkkkkkkkkkkkk.',
        'kLLLLLLLLLLLLLLk kLLLLLLLLLLLLLLk',
        'kTTTTTTTTTTTTTTk kTTTTTTTTTTTTTTk',
        '.ktk........ktk. .ktk........ktk.',
        '.ktk........ktk. .ktk........ktk.',
        '.kkk........kkk. .kkk........kkk.'
      ]
    ]);
