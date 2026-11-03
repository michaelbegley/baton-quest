    // ---------- 20-art-hero.js: the conductor, 'hero' (16 by 20, 20 frames; ART, builder 3; frames 18 and 19: B21 MOVES) ----------
    // A terminal for a head (a light monitor with a black screen and a green >_ prompt), a dark shirt with short tails, a white bow tie, white gloves,
    // dark trousers, and a thin white baton with a dark handle. Facing right; the body (10 by 14) is columns 3 to 12, rows 6 to 19, feet on row 19.
    // Frames (QUEST-API.md part 8): 0-1 idle, 2-5 run, 6 jump, 7 fall, 8-9 swing, 10 charge, 11 throw, 12 dash, 13-14 hover, 15 pound, 16 hurt, 17 cheer;
    // B21 MOVES (2 Nov, QUEST-API.md part 23): 18 PUSHBACK (on a wall at his back, a glove on it), 19 FOLLOW UP (a tuck, the baton thrown up).
    Q.art.HERO = { idle: [0, 1], run: [2, 3, 4, 5], jump: [6], fall: [7], swing: [8, 9], charge: [10], throw: [11], dash: [12], hover: [13, 14], pound: [15], hurt: [16], cheer: [17], walljump: [18], doublejump: [19] };
    Q.art.heroPal = Q.art.pal({
      c: '#f6f3ea', m: '#dcd6c8', n: '#a8a090',            // the monitor: light, main, shade
      s: '#07080b', g: '#6dfc9a', G: '#2f9e5c',            // the screen, the prompt, a dim glow
      D: '#5d6a96', d: '#3b4466', e: '#2b3150',            // the shirt: light, main, shade
      w: '#ffffff', x: '#c3c7d4',                          // white (gloves, baton, the arc) and its shade
      U: '#ffffff', u: '#ffffff', v: '#c3c7d4',            // the bow tie's own letters (white here; gold in hero-gold)
      P: '#5a5f73', p: '#3c4050', h: '#6b7186',            // the trousers, and a shine on the shoes
      b: '#5a3a24', y: '#ffd23f', Y: '#fff4bf', t: '#7fe3d8' // the baton's handle, its glow, a streak
    });
    Q.art.def('hero', 16, 20, Q.art.heroPal, [
      // frames 0-3: idle 0, idle 1 (breathing: a pixel lower, the cursor off), run 2, run 3
      [
        '...kkkkkkkkkk... ................ ................ ....kkkkkkkkkk..',
        '..kcccccccccmk.. ...kkkkkkkkkk... ....kkkkkkkkkk.. ...kcccccccccmk.',
        '..kcmsssssssnk.. ..kcccccccccmk.. ...kcccccccccmk. ...kcmsssssssnk.',
        '..kcmsgsssssnk.. ..kcmsssssssnk.. ...kcmsssssssnk. ...kcmsgsssssnk.',
        '..kcmssgssssnk.. ..kcmsgsssssnk.. ...kcmsgsssssnk. ...kcmssgssssnk.',
        '..kcmsgssggsnk.. ..kcmssgssssnk.. ...kcmssgssssnk. ...kcmsgssggsnk.',
        '..kcmsssssssnk.. ..kcmsgsssssnk.. ...kcmsgssggsnk. ...kcmsssssssnk.',
        '..kmnnnnnnnnnk.. ..kcmsssssssnk.. ...kcmsssssssnk. ...kmnnnnnnnnnk.',
        '...kkkkkkkkkk... ..kmnnnnnnnnnk.. ...kmnnnnnnnnnk. ....kkkkkkkkkk..',
        '....kDUdddUk...w ...kkkkkkkkkk... ....kkkkkkkkkk.. .....kDUdddUk..w',
        '....kDuuvuuk..wk ....kDUdddUk...w .....kDUdddUk..w .....kDuuvuuk.wk',
        '...kDdvdddvkkwk. ....kDuuvuuk..wk ....kDduuvuudkwk ....kDdvdddvkwk.',
        '..kwkDdddddkwbk. ...kDdvdddvkkwk. ...kDdkvdddvkwk. ...kDdkDdddekwbk',
        '..kwkDddddekwk.. ..kwkDdddddkwbk. ..kwwkDdddddkwbk ...kwwkddddekkk.',
        '..kekkkkkkkkk... ..kwkkkkkkkkkk.. .kkkkkkkkkkkkkk. ..kekkkkkkkkkk..',
        '..kdkPpkPpk..... ..kdkPpkPpk..... kddkPpppppppk... ..kdkPpppkPpk...',
        '...kkPpkPpk..... ...kkPpkPpk..... .kkPpkkkkkPpk... ...kkPpk.kPpkk..',
        '....kPpkPpk..... ....kPpkPpk..... .kPpk.....kPpk.. ....kPpk..kkhk..',
        '...khhkkhhhk.... ...khhkkhhhk.... khhk.......khhk. ...khhk...kkk...',
        '...kkkkkkkkkk... ...kkkkkkkkkk... kkk.........kkkk ...kkkk.........'
      ],
      // frames 4-7: run 4, run 5, jump 6, fall 7
      [
        '................ ....kkkkkkkkkk.. ...kkkkkkkkkk... ...kkkkkkkkkk...',
        '....kkkkkkkkkk.. ...kcccccccccmk. ..kcccccccccmk.. ..kcccccccccmk..',
        '...kcccccccccmk. ...kcmsssssssnk. ..kcmsssssssnk.. ..kcmsssssssnk..',
        '...kcmsssssssnk. ...kcmsgsssssnk. ..kcmsgsssssnk.w ..kcmsgsssssnk..',
        '...kcmsgsssssnk. ...kcmssgssssnk. ..kcmssgssssnkkw ..kcmssgssssnk..',
        '...kcmssgssssnk. ...kcmsgssggsnk. ..kcmsgssggsnkkw ..kcmsgssggsnk..',
        '...kcmsgssggsnk. ...kcmsssssssnk. ..kcmsssssssnkkw ..kcmsssssssnkkw',
        '...kcmsssssssnk. ...kmnnnnnnnnnk. ..kmnnnnnnnnnkbk .kkmnnnnnnnnnkkw',
        '...kmnnnnnnnnnk. ....kkkkkkkkkk.. ...kkkkkkkkkkwwk kwkkkkkkkkkkkkbk',
        '....kkkkkkkkkk.. .....kDUdddUk..w ....kDUdddUkdwk. kwkkkDUdddUkkwwk',
        '.....kDUdddUk..w .....kDuuvuuk.wk ...kDduuvuuddk.. .kdddDuuvuudddk.',
        '....kDduuvuudkwk ....kDdvdddvkwk. ..kDdkvdddvkk... ..kkkDvdddvkkk..',
        '..kkkDvdddvdkwk. ....kDdddddkwbk. ..kwwkDdddek.... ....kDdddddk....',
        '.kwwkDdddddkkwbk ...kwkDddddekk.. ...kkkDdddek.... ..kkkDddddek....',
        '..kkkkkkkkkkkkk. ..kekkkkkkkkk... ..kekkkkkkkk.... .kddkkkkkkkk....',
        '.kdkPpppppk..... ..kdkPpkkPppk... ..kdkPpppkPpk... ..kkkPpkPpk.....',
        '..kPpkkkPpk..... ...kPpk..kPpk... ..kkPpk.kPpPpk.. ...kPpk.kPpk....',
        '.kPpk...kPpk.... ..khPk...kPpk... ..kPpk...kkhhk.. ...kPpk.kPpk....',
        'khhk.....khhk... ..kkk...khhk.... .khhk.....kkkk.. ...khk...khk....',
        'kkk.......kkkk.. ........kkkk.... .kkk............ ...kk.....kk....'
      ],
      // frames 8-11: swing 8 (wind-up), swing 9 (strike, a white arc like the engine's smear), charge 10 (the baton glows, its tip at 15,8), throw 11
      [
        '...kkkkkkkkkk... ................ ................ ....kkkkkkkkkk..',
        '..kcccccccccmk.. ...kkkkkkkkkk.w. ...kkkkkkkkkk... ...kcccccccccmk.',
        '..kcmsssssssnkw. ..kcccccccccmkww ..kcccccccccmk.. ...kcmsssssssnk.',
        '..kcmsgsssssnkw. ..kcmsssssssnk.w ..kcmsssssssnk.. ...kcmsgsssssnk.',
        '..kcmssgssssnkw. ..kcmsgsssssnk.w ..kcmsgssgssnk.. ...kcmssgssssnk.',
        '..kcmsgssggsnkw. ..kcmssgssssnkxw ..kcmssgssgsnk.. ...kcmsgssggsnk.',
        '..kcmsssssssnkw. ..kcmsgssggsnkxw ..kcmsgssgssnk.Y ...kcmsssssssnk.',
        '..kmnnnnnnnnnkbk ..kcmsssssssnkxw ..kcmsssssssnkYY ...kmnnnnnnnnnkw',
        '...kkkkkkkkkkwwk ..kmnnnnnnnnnkxw ..kmnnnnnnnnnkyw ....kkkkkkkkkk.w',
        '....kDUdddUkdwk. ...kkkkkkkkkkxw. ...kkkkkkkkkk.yY ....kDUdddUkkkbk',
        '...kDduuvuuddk.. ....kDUdddUk.xw. ....kDUdddUk.ykY ...kDduuvuuddwwk',
        '..kDdkvdddvkk... ...kDduuvuudkkkk ....kDuuvuukkbk. ..kDdkvdddvkkkk.',
        '..kwwkDdddek.... ..kDdkvdddvddwwb ...kDdvdddvkwwk. ..kwwkDdddek....',
        '...kkkDdddek.... ..kwwkDdddekkkkw ..kwkDdddddkwk.. ...kkkDdddek....',
        '..kekkkkkkkk.... ..kekkkkkkkk...w ..kwkkkkkkkkkk.. ..kekkkkkkkk....',
        '..kdkPpkPpk..... ..kdkPpkPpk..... ..kdkPpkPpk..... ..kdkPpkPpk.....',
        '...kPpk.kPpk.... ...kPpk.kPpk.... ...kkPpkPpk..... ...kPpk.kPpk....',
        '...kPpk.kPpk.... ..kPpk...kPpk... ....kPpkPpk..... ..kPpk...kPpk...',
        '..khhk..khhhk... .khhk.....khhk.. ...khhkkhhhk.... .khhk.....khhk..',
        '..kkkk..kkkkk... .kkkk.....kkkkk. ...kkkkkkkkkk... .kkkk.....kkkkk.'
      ],
      // frames 12-15: dash 12 (a streak), hover 13, hover 14 (only the thinking dots move), pound 15
      [
        '................ ...kkkkkkkkkk... ...kkkkkkkkkk... ................',
        '.....kkkkkkkkkk. ..kcccccccccmk.. ..kcccccccccmk.. ...kkkkkkkkkk...',
        '....kcccccccccmk ..kcmsssssssnk.. ..kcmsssssssnk.. ..kcccccccccmk..',
        '....kcmsssssssnk ..kcmsssssssnk.. ..kcmsssssssnk.. ..kcmsssssssnk..',
        '....kcmsgssgssnk ..kcmsssssssnk.. ..kcmsssgsssnk.. ..kcmsgsssssnk..',
        '....kcmssgssgsnk ..kcmsgsgsgsnk.. ..kcmsgsssgsnk.. ..kcmssgssssnk..',
        '....kcmsgssgssnk ..kcmsssssssnk.. ..kcmsssssssnk.. ..kcmsgssggsnk..',
        '....kcmsssssssnk ..kmnnnnnnnnnk.. ..kmnnnnnnnnnk.. ..kcmsssssssnk..',
        '....kmnnnnnnnnnk ...kkkkkkkkkk..w ...kkkkkkkkkk..w ..kmnnnnnnnnnk..',
        '.....kkkkkkkkkk. ....kDUdddUk..wk ....kDUdddUk..wk ...kkkkkkkkkk...',
        '......kDUdddUkwk .kkkkDuuvuukkwk. .kkkkDuuvuukkwk. ....kDUdddUk....',
        'ttt..kDduuvuudkb kwwdDdvdddvdwwk. kwwdDdvdddvdwwk. ...kDduuvuudk...',
        '....kDdvdddvkk.w .kkkkDdddddkkk.. .kkkkDdddddkkk.. ..kPkdvdddvkPk..',
        'tt.kDdddddekk... ....kDdddddk.... ....kDdddddk.... .kPpPkDdddkPpPk.',
        '..kkkkkkkkkk.... ...kekkkkkkk.... ...kekkkkkkk.... .kPppkkkkkkpPpk.',
        'tkdkPppppk...... ...kdkPpPpk..... ...kdkPpPpk..... .khhkk.ww.kkhhk.',
        '..kPpkkPpk...... ....kkPpPpk..... ....kkPpPpk..... ..kk..kbbk..kk..',
        '.kPpk.kPpk...... .....kPpPpk..... .....kPpPpk..... .......kwk......',
        'khhk.khhk....... .....khkkhk..... .....khkkhk..... .......kwk......',
        'kkk..kkk........ ......kk.kk..... ......kk.kk..... ........w.......'
      ],
      // frames 16-17: hurt 16, cheer 17
      [
        '..kkkkkkkkkk.... ..kkkkkkkkkk..w.',
        '.kcccccccccmk... .kcccccccccmk.w.',
        '.kcmsssssssnk... .kcmsssssssnk.w.',
        '.kcmsgsssgsnk... .kcmsssssssnkkbk',
        '.kcmssgsgssnk... .kcmsgsssgsnkwwk',
        '.kcmsgsssgsnk... .kcmgsgsgsgnkkdk',
        '.kcmsssssssnkkw. .kcmsssssssnkkdk',
        '.kmnnnnnnnnnkkwk .kmnnnnnnnnnkkdk',
        'kwkkkkkkkkkk.kdk ..kkkkkkkkkk.kdk',
        'kdkkDUdddUk.kdk. ...kDUdddUk.kdk.',
        '.kdDduuvuudkdk.. ..kDduuvuudkkdk.',
        '..kkDvdddvkkk... .kDdkvdddvkdk...',
        '...kDdddddk..... .kwwkDdddekk....',
        '...kDddddek..... ..kkkDdddek.....',
        '..kekkkkkkk..... .kekkkkkkkk.....',
        '..kdkPpkPpk..... .kdkPpk.kPpk....',
        '...kPpk.kPpk.... ..kPpk...kPpk...',
        '..kPpk...kPpk... ..kPpk...kPpk...',
        '.khhk.....khhk.. .khhk.....khhk..',
        '.kkk.......kkk.. .kkkk.....kkkkk.'
      ],
      // frames 18-19 (B21 MOVES): PUSHBACK 18 (his back to a wall on his left, the left glove up on it, knees bent toward it), FOLLOW UP 19 (the tuck)
      [
        '...kkkkkkkkkk... ...kkkkkkkkkk.w.',
        '..kcccccccccmk.. ..kcccccccccmkw.',
        '.kkcmsssssssnk.. ..kcmsssssssnkw.',
        'kwkcmsgsssssnk.. ..kcmsgsssssnkw.',
        'kwkcmssgssssnk.. ..kcmssgssssnkb.',
        'kdkcmsgssggsnk.. ..kcmsgssggsnkwk',
        'kdkcmsssssssnk.. ..kcmsssssssnkdk',
        'kdkmnnnnnnnnnk.. ..kmnnnnnnnnnkdk',
        '.kdkkkkkkkkkk... kw.kkkkkkkkkkdk.',
        '..kdkDUdddUk...w kdk.kDUdddUkdk..',
        '...kDduuvuuk..wk .kdkDduuvuudk...',
        '...kDdvdddvkkwk. ..kkDdvdddvk....',
        '...kDdddddkkwbk. ...kDdddddkk....',
        '...kDddddekwk... ..kkkkkkkkkPpk..',
        '..kekkkkkkkk.... .kPpppppppPpk...',
        '..kdkPpPpPk..... .kPpkkkkkkPpk...',
        '...kPpkkPpk..... .khhk....khhk...',
        '..kPpk.kPpk..... .kkkk....kkkk...',
        '.khhk..khhk..... ................',
        '.kkkk..kkkk..... ................'
      ]
    ]);
