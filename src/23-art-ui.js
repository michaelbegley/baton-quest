    // ---------- 23-art-ui.js: the HUD's heart and note, and the five ability icons (ART, builder 3) ----------
    // The HUD is a dark band (#121318), so an empty heart or note is drawn with a grey rim that shows on it.
    // ui-heart (8 by 8): 0 full, 1 empty.
    Q.art.def('ui-heart', 8, 8, Q.art.pal({ r: '#e8404f', W: '#ffd6db', d: '#a8243a', e: '#5a5f78', n: '#2a2c3a' }), [
      [
        '.kk..kk. .ee..ee.',
        'kWrkkrrk enneenne',
        'kWrrrrdk ennnnnne',
        'krrrrrdk ennnnnne',
        '.krrrdk. .ennnne.',
        '..krdk.. ..enne..',
        '...kk... ...ee...',
        '........ ........'
      ]
    ]);
    // ui-note (6 by 8): one RHYTHM; 0 full, 1 empty.
    Q.art.def('ui-note', 6, 8, Q.art.pal({ y: '#ffd23f', Y: '#fff4bf', o: '#d8961a', e: '#5a5f78', n: '#2a2c3a' }), [
      [
        '...kk. ...ee.',
        '...kYk ...ene',
        '...kyk ...ene',
        '...kyk ...ene',
        '.kkkyk .eeene',
        'kYyyyk ennnne',
        'kyyyok ennnne',
        '.kkkk. .eeee.'
      ]
    ]);
    // The ability icons (12 by 12): a rounded tile in the colour of whoever gives it, a white mark with a shadow.
    // ic-baton: the baton (slate, the conductor's own). ic-note: a note (slate). ic-dash: QUICK KEYS, >> on C1's blue.
    // ic-hover: PAUSE TO THINK, || on C2's green. ic-pound: FIRM HAND, an arrow down onto the ground on C3's pink.
    Q.art.icon = function (id, own, mark) {   // own: { C, L, D, q } the tile's main, light, dark and the mark's shadow; mark: 8 rows of 8 ('w' white, 'y' yellow, 'b' a handle)
      var rows = ['.kkkkkkkkkk.', 'kLLLLLLLLLLk'], r, c, ch, line;
      for (r = 0; r < 8; r++) {
        line = 'kL';
        for (c = 0; c < 8; c++) {
          ch = mark[r].charAt(c);
          if (ch === '.' && r > 0 && c > 0 && mark[r - 1].charAt(c - 1) !== '.' && mark[r - 1].charAt(c - 1) !== 'q') ch = 'q';   // the shadow, down and right
          line += ch === '.' ? 'C' : ch;
        }
        rows.push(line + 'Dk');
      }
      rows.push('kDDDDDDDDDDk'); rows.push('.kkkkkkkkkk.');
      return Q.art.def(id, 12, 12, Q.art.pal({ C: own.C, L: own.L, D: own.D, q: own.q, w: '#ffffff', y: '#ffd23f', b: '#5a3a24' }), [rows]);
    };
    Q.art.icon('ic-baton', { C: '#3b4466', L: '#5d6a96', D: '#2b3150', q: '#1f2438' },
      ['......y.', '.....w.y', '....w...', '...w....', '..w.....', '.b......', 'b.......', '........']);
    Q.art.icon('ic-note', { C: '#3b4466', L: '#5d6a96', D: '#2b3150', q: '#1f2438' },
      ['....yy..', '....yyy.', '....y.yy', '....y...', '.yyyy...', 'yyyyy...', '.yyy....', '........']);
    Q.art.icon('ic-dash', { C: '#3f7fd9', L: '#bcd4f6', D: '#2a5cb5', q: '#14294d' },
      ['........', 'ww..ww..', '.ww..ww.', '..ww..ww', '.ww..ww.', 'ww..ww..', '........', '........']);
    Q.art.icon('ic-hover', { C: '#46b06a', L: '#bfe8cd', D: '#2f8a4f', q: '#123d24' },
      ['........', '.ww..ww.', '.ww..ww.', '.ww..ww.', '.ww..ww.', '.ww..ww.', '........', '........']);
    Q.art.icon('ic-pound', { C: '#ee7fb0', L: '#fbd3e3', D: '#c2488a', q: '#4f1d36' },
      ['...ww...', '...ww...', '.wwwwww.', '..wwww..', '...ww...', 'w......w', 'wwwwwwww', '........']);
    // icon-quest (32 by 32): Baton Quest's icon on the 9F OS desktop (drawn in the registration's icon function), the first thing the boss sees of the game:
    // the conductor's terminal head with its >_, his bow tie, the baton raised to a spark and a note, on an orange tile that stands out on the desktop's dark teal.
    Q.art.def('icon-quest', 32, 32, Q.art.pal({ O: '#ff8a1e', P: '#ffb066', o: '#d46a12', c: '#f6f3ea', m: '#dcd6c8', n: '#a8a090', s: '#07080b', g: '#6dfc9a',
                                                q: '#2a3340', d: '#3b4466', D: '#5d6a96', w: '#ffffff', x: '#c3c7d4', b: '#5a3a24', y: '#ffd23f' }), [
      [
        '..kkkkkkkkkkkkkkkkkkkkkkkkkkkk..',
        '.kPPPPPPPPPPPPPPPPPPPPPPPPPPPPk.',
        'kPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPk',
        'kPPPwwPPPPPPPPPPPPPPPPPPPPPPPyPk',
        'kPPPwPwPPPPPPPPPPPPPPPPPPPPPywyk',
        'kPPPwPPkkkkkkkkkkkkkkkkkPPPPPyPk',
        'kPPPwPkccccccccccccccccnkPPPkwPk',
        'kPwwwPkcmmmmmmmmmmmmmmmnkPPPkwPk',
        'kPwwPPkcmqqsssssssssssmnkPPPkwPk',
        'kOOOOOkcmqssssssssssssmnkOOkwOOk',
        'kOOOOOkcmssggsssssssssmnkOOkwOOk',
        'kOOOOOkcmsssggssssssssmnkOOkwOOk',
        'kOOOOOkcmssssggsssssssmnkOkwOOOk',
        'kOOOOOkcmsssssggssssssmnkOkwOOOk',
        'kOOOOOkcmssssggsssssssmnkkbkOOOk',
        'kOOOOOkcmsssggsssggggsmnkkwwkOOk',
        'kOOOOOkcmssggssssggggsmnkkwwkOOk',
        'kOOOOOkcmsssssssssssssmnkkkkOOOk',
        'kOOOOOkcmmmmmmmmmmmmmmmnkddkOOOk',
        'kOOOOOknnnnnnnnnnnnnnnnnkddkOOOk',
        'kOOOOOOkkkkkkkkkkkkkkkkkddkOOOOk',
        'kOOOOOOkkkkkkkkkkkkkkkkkkkOOOOOk',
        'kOOOOOkDDddwdddddddwddddkOOOOOOk',
        'koooookDDddwwdddddwwddddkooooook',
        'koooookDDddwwwwxwwwwddddkooooook',
        'koooookDDddwxdddddxwddddkooooook',
        'koooookDDddxdddddddxddddkooooook',
        'koooookDDdddddddddddddddkooooook',
        'koooookDDdddddddddddddddkooooook',
        'koooookDDdddddddddddddddkooooook',
        '.kooookDDdddddddddddddddkoooook.',
        '..kkkkkkkkkkkkkkkkkkkkkkkkkkkk..'
      ]
    ]);
    // The shop's own icons for VEND-9's new wares (QUEST-API part 13 item 25), 12 by 12, drawn as things (like the shop's mug and heart):
    // ic-bowtie: the GOLD BOW TIE, gold in three shades with a sparkle. ic-memofinder: the MEMO FINDER, a magnifying glass over a folded memo.
    Q.art.def('ic-bowtie', 12, 12, Q.art.pal({ U: '#fff1a8', u: '#ffd23f', v: '#c98a12', w: '#ffffff' }), [
      [
        '..........w.',
        '.........wUw',
        '..........w.',
        'kkk......kkk',
        'kUUkk..kkuvk',
        'kUuuuvvuuuvk',
        'kUuuuUvuuuvk',
        'kuuuuvvuuvvk',
        'kuvkk..kkvvk',
        'kkk......kkk',
        '............',
        '............'
      ]
    ]);
    Q.art.def('ic-memofinder', 12, 12, Q.art.pal({ w: '#f6efe2', x: '#d8ccb6', c: '#bcae94', b: '#2f7de1', g: '#8a92a6', L: '#bfe3f7', W: '#ffffff', h: '#7a4a2a' }), [
      [
        'kkkkkk......',
        'kwwwwkk.....',
        'kwbbwkck....',
        'kwwwwwwk....',
        'kwbbkkkk....',
        'kwwkgWLLgk..',
        'kwbkgLLLgk..',
        'kwwkgLLLgk..',
        'kxxkkggggk..',
        'kkkkkkkkhk..',
        '........khhk',
        '.........kk.'
      ]
    ]);
