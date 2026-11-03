    // ---------- 20-art-hero-b.js: 'hero-l', the conductor facing left (ART, builder 3) ----------
    // The engine draws an id + '-l' twin, unflipped, wherever it would flip a sprite. This is 'hero' mirrored, frame for frame, with the screen's glyphs drawn
    // the right way round: the prompt is his face, so >_ reads >_ both ways. The fast screen (charge, dash) reads << facing left, pointing the way he goes;
    // the other moods are the same either way. Written by the same composer as 20-art-hero.js, from the same frames.
    Q.art.def('hero-l', 16, 20, Q.art.heroPal, [
      // frames 0-3: idle, idle (breathing), run, run
      [
        '...kkkkkkkkkk... ................ ................ ..kkkkkkkkkk....',
        '..kmccccccccck.. ...kkkkkkkkkk... ..kkkkkkkkkk.... .kmccccccccck...',
        '..knsssssssmck.. ..kmccccccccck.. .kmccccccccck... .knsssssssmck...',
        '..knsgsssssmck.. ..knsssssssmck.. .knsssssssmck... .knsgsssssmck...',
        '..knssgssssmck.. ..knsgsssssmck.. .knsgsssssmck... .knssgssssmck...',
        '..knsgssggsmck.. ..knssgssssmck.. .knssgssssmck... .knsgssggsmck...',
        '..knsssssssmck.. ..knsgsssssmck.. .knsgssggsmck... .knsssssssmck...',
        '..knnnnnnnnnmk.. ..knsssssssmck.. .knsssssssmck... .knnnnnnnnnmk...',
        '...kkkkkkkkkk... ..knnnnnnnnnmk.. .knnnnnnnnnmk... ..kkkkkkkkkk....',
        'w...kUdddUDk.... ...kkkkkkkkkk... ..kkkkkkkkkk.... w..kUdddUDk.....',
        'kw..kuuvuuDk.... w...kUdddUDk.... w..kUdddUDk..... kw.kuuvuuDk.....',
        '.kwkkvdddvdDk... kw..kuuvuuDk.... kwkduuvuudDk.... .kwkvdddvdDk....',
        '.kbwkdddddDkwk.. .kwkkvdddvdDk... .kwkvdddvkdDk... kbwkedddDkdDk...',
        '..kwkeddddDkwk.. .kbwkdddddDkwk.. kbwkdddddDkwwk.. .kkkeddddkwwk...',
        '...kkkkkkkkkek.. ..kkkkkkkkkkwk.. .kkkkkkkkkkkkkk. ..kkkkkkkkkkek..',
        '.....kpPkpPkdk.. .....kpPkpPkdk.. ...kpppppppPkddk ...kpPkpppPkdk..',
        '.....kpPkpPkk... .....kpPkpPkk... ...kpPkkkkkpPkk. ..kkpPk.kpPkk...',
        '.....kpPkpPk.... .....kpPkpPk.... ..kpPk.....kpPk. ..khkk..kpPk....',
        '....khhhkkhhk... ....khhhkkhhk... .khhk.......khhk ...kkk...khhk...',
        '...kkkkkkkkkk... ...kkkkkkkkkk... kkkk.........kkk .........kkkk...'
      ],
      // frames 4-7: run, run, jump, fall
      [
        '................ ..kkkkkkkkkk.... ...kkkkkkkkkk... ...kkkkkkkkkk...',
        '..kkkkkkkkkk.... .kmccccccccck... ..kmccccccccck.. ..kmccccccccck..',
        '.kmccccccccck... .knsssssssmck... ..knsssssssmck.. ..knsssssssmck..',
        '.knsssssssmck... .knsgsssssmck... w.knsgsssssmck.. ..knsgsssssmck..',
        '.knsgsssssmck... .knssgssssmck... wkknssgssssmck.. ..knssgssssmck..',
        '.knssgssssmck... .knsgssggsmck... wkknsgssggsmck.. ..knsgssggsmck..',
        '.knsgssggsmck... .knsssssssmck... wkknsssssssmck.. wkknsssssssmck..',
        '.knsssssssmck... .knnnnnnnnnmk... kbknnnnnnnnnmk.. wkknnnnnnnnnmkk.',
        '.knnnnnnnnnmk... ..kkkkkkkkkk.... kwwkkkkkkkkkk... kbkkkkkkkkkkkkwk',
        '..kkkkkkkkkk.... w..kUdddUDk..... .kwdkUdddUDk.... kwwkkUdddUDkkkwk',
        'w..kUdddUDk..... kw.kuuvuuDk..... ..kdduuvuudDk... .kddduuvuuDdddk.',
        'kwkduuvuudDk.... .kwkvdddvdDk.... ...kkvdddvkdDk.. ..kkkvdddvDkkk..',
        '.kwkdvdddvDkkk.. .kbwkdddddDk.... ....kedddDkwwk.. ....kdddddDk....',
        'kbwkkdddddDkwwk. ..kkeddddDkwk... ....kedddDkkk... ....keddddDkkk..',
        '.kkkkkkkkkkkkk.. ...kkkkkkkkkek.. ....kkkkkkkkek.. ....kkkkkkkkddk.',
        '.....kpppppPkdk. ...kppPkkpPkdk.. ...kpPkpppPkdk.. .....kpPkpPkkk..',
        '.....kpPkkkpPk.. ...kpPk..kpPk... ..kpPpPk.kpPkk.. ....kpPk.kpPk...',
        '....kpPk...kpPk. ...kpPk...kPhk.. ..khhkk...kpPk.. ....kpPk.kpPk...',
        '...khhk.....khhk ....khhk...kkk.. ..kkkk.....khhk. ....khk...khk...',
        '..kkkk.......kkk ....kkkk........ ............kkk. ....kk.....kk...'
      ],
      // frames 8-11: swing (wind-up), swing (strike), charge (<< on the screen), throw
      [
        '...kkkkkkkkkk... ................ ................ ..kkkkkkkkkk....',
        '..kmccccccccck.. .w.kkkkkkkkkk... ...kkkkkkkkkk... .kmccccccccck...',
        '.wknsssssssmck.. wwkmccccccccck.. ..kmccccccccck.. .knsssssssmck...',
        '.wknsgsssssmck.. w.knsssssssmck.. ..knsssssssmck.. .knsgsssssmck...',
        '.wknssgssssmck.. w.knsgsssssmck.. ..knssgssgsmck.. .knssgssssmck...',
        '.wknsgssggsmck.. wxknssgssssmck.. ..knsgssgssmck.. .knsgssggsmck...',
        '.wknsssssssmck.. wxknsgssggsmck.. Y.knssgssgsmck.. .knsssssssmck...',
        'kbknnnnnnnnnmk.. wxknsssssssmck.. YYknsssssssmck.. wknnnnnnnnnmk...',
        'kwwkkkkkkkkkk... wxknnnnnnnnnmk.. wyknnnnnnnnnmk.. w.kkkkkkkkkk....',
        '.kwdkUdddUDk.... .wxkkkkkkkkkk... Yy.kkkkkkkkkk... kbkkkUdddUDk....',
        '..kdduuvuudDk... .wx.kUdddUDk.... Yky.kUdddUDk.... kwwdduuvuudDk...',
        '...kkvdddvkdDk.. kkkkduuvuudDk... .kbkkuuvuuDk.... .kkkkvdddvkdDk..',
        '....kedddDkwwk.. bwwddvdddvkdDk.. .kwwkvdddvdDk... ....kedddDkwwk..',
        '....kedddDkkk... wkkkkedddDkwwk.. ..kwkdddddDkwk.. ....kedddDkkk...',
        '....kkkkkkkkek.. w...kkkkkkkkek.. ..kkkkkkkkkkwk.. ....kkkkkkkkek..',
        '.....kpPkpPkdk.. .....kpPkpPkdk.. .....kpPkpPkdk.. .....kpPkpPkdk..',
        '....kpPk.kpPk... ....kpPk.kpPk... .....kpPkpPkk... ....kpPk.kpPk...',
        '....kpPk.kpPk... ...kpPk...kpPk.. .....kpPkpPk.... ...kpPk...kpPk..',
        '...khhhk..khhk.. ..khhk.....khhk. ....khhhkkhhk... ..khhk.....khhk.',
        '...kkkkk..kkkk.. .kkkkk.....kkkk. ...kkkkkkkkkk... .kkkkk.....kkkk.'
      ],
      // frames 12-15: dash (<< on the screen), hover, hover, pound
      [
        '................ ...kkkkkkkkkk... ...kkkkkkkkkk... ................',
        '.kkkkkkkkkk..... ..kmccccccccck.. ..kmccccccccck.. ...kkkkkkkkkk...',
        'kmccccccccck.... ..knsssssssmck.. ..knsssssssmck.. ..kmccccccccck..',
        'knsssssssmck.... ..knsssssssmck.. ..knsssssssmck.. ..knsssssssmck..',
        'knssgssgsmck.... ..knsssssssmck.. ..knsssgsssmck.. ..knsgsssssmck..',
        'knsgssgssmck.... ..knsgsgsgsmck.. ..knsgsssgsmck.. ..knssgssssmck..',
        'knssgssgsmck.... ..knsssssssmck.. ..knsssssssmck.. ..knsgssggsmck..',
        'knsssssssmck.... ..knnnnnnnnnmk.. ..knnnnnnnnnmk.. ..knsssssssmck..',
        'knnnnnnnnnmk.... w..kkkkkkkkkk... w..kkkkkkkkkk... ..knnnnnnnnnmk..',
        '.kkkkkkkkkk..... kw..kUdddUDk.... kw..kUdddUDk.... ...kkkkkkkkkk...',
        'kwkUdddUDk...... .kwkkuuvuuDkkkk. .kwkkuuvuuDkkkk. ....kUdddUDk....',
        'bkduuvuudDk..ttt .kwwdvdddvdDdwwk .kwwdvdddvdDdwwk ...kduuvuudDk...',
        'w.kkvdddvdDk.... ..kkkdddddDkkkk. ..kkkdddddDkkkk. ..kPkvdddvdkPk..',
        '...kkedddddDk.tt ....kdddddDk.... ....kdddddDk.... .kPpPkdddDkPpPk.',
        '....kkkkkkkkkk.. ....kkkkkkkek... ....kkkkkkkek... .kpPpkkkkkkppPk.',
        '......kppppPkdkt .....kpPpPkdk... .....kpPpPkdk... .khhkk.ww.kkhhk.',
        '......kpPkkpPk.. .....kpPpPkk.... .....kpPpPkk.... ..kk..kbbk..kk..',
        '......kpPk.kpPk. .....kpPpPk..... .....kpPpPk..... ......kwk.......',
        '.......khhk.khhk .....khkkhk..... .....khkkhk..... ......kwk.......',
        '........kkk..kkk .....kk.kk...... .....kk.kk...... .......w........'
      ],
      // frames 16-17: hurt, cheer
      [
        '....kkkkkkkkkk.. .w..kkkkkkkkkk..',
        '...kmccccccccck. .w.kmccccccccck.',
        '...knsssssssmck. .w.knsssssssmck.',
        '...knsgsssgsmck. kbkknsssssssmck.',
        '...knssgsgssmck. kwwknsgsssgsmck.',
        '...knsgsssgsmck. kdkkngsgsgsgmck.',
        '.wkknsssssssmck. kdkknsssssssmck.',
        'kwkknnnnnnnnnmk. kdkknnnnnnnnnmk.',
        'kdk.kkkkkkkkkkwk kdk.kkkkkkkkkk..',
        '.kdk.kUdddUDkkdk .kdk.kUdddUDk...',
        '..kdkduuvuudDdk. .kdkkduuvuudDk..',
        '...kkkvdddvDkk.. ...kdkvdddvkdDk.',
        '.....kdddddDk... ....kkedddDkwwk.',
        '.....keddddDk... .....kedddDkkk..',
        '.....kkkkkkkek.. .....kkkkkkkkek.',
        '.....kpPkpPkdk.. ....kpPk.kpPkdk.',
        '....kpPk.kpPk... ...kpPk...kpPk..',
        '...kpPk...kpPk.. ...kpPk...kpPk..',
        '..khhk.....khhk. ..khhk.....khhk.',
        '..kkk.......kkk. .kkkkk.....kkkk.'
      ],
      // frames 18-19 (B21 MOVES): PUSHBACK (the wall at his back, on his right), FOLLOW UP (the tuck); mirrored, the screen's >_ kept
      [
        '...kkkkkkkkkk... .w.kkkkkkkkkk...',
        '..kmccccccccck.. .wkmccccccccck..',
        '..knsssssssmckk. .wknsssssssmck..',
        '..knsgsssssmckwk .wknsgsssssmck..',
        '..knssgssssmckwk .bknssgssssmck..',
        '..knsgssggsmckdk kwknsgssggsmck..',
        '..knsssssssmckdk kdknsssssssmck..',
        '..knnnnnnnnnmkdk kdknnnnnnnnnmk..',
        '...kkkkkkkkkkdk. .kdkkkkkkkkkk.wk',
        'w...kUdddUDkdk.. ..kdkUdddUDk.kdk',
        'kw..kuuvuudDk... ...kduuvuudDkdk.',
        '.kwkkvdddvdDk... ....kvdddvdDkk..',
        '.kbwkkdddddDk... ....kkdddddDk...',
        '...kwkeddddDk... ..kpPkkkkkkkkk..',
        '....kkkkkkkkek.. ...kpPpppppppPk.',
        '.....kPpPpPkdk.. ...kpPkkkkkkpPk.',
        '.....kpPkkpPk... ...khhk....khhk.',
        '.....kpPk.kpPk.. ...kkkk....kkkk.',
        '.....khhk..khhk. ................',
        '.....kkkk..kkkk. ................'
      ]
    ]);
    // ---------- 'hero-gold' and 'hero-gold-l': the conductor in the GOLD BOW TIE (VEND-9's, QUEST-API part 13 item 25) ----------
    // The same frames as 'hero' and 'hero-l'; only the bow tie's own letters (U, u, v) are gold, in three shades. The gloves, the baton and the arc stay white.
    Q.art.heroGoldPal = (function () {
      var p = {}, k;
      for (k in Q.art.heroPal) if (Object.prototype.hasOwnProperty.call(Q.art.heroPal, k)) p[k] = Q.art.heroPal[k];
      p.U = '#fff1a8'; p.u = '#ffd23f'; p.v = '#c98a12';
      return p;
    })();
    Q.defSprite('hero-gold', { w: 16, h: 20, n: Q.SPRITE.hero.frames.length, pal: Q.art.heroGoldPal, frames: Q.SPRITE.hero.frames });
    Q.defSprite('hero-gold-l', { w: 16, h: 20, n: Q.SPRITE['hero-l'].frames.length, pal: Q.art.heroGoldPal, frames: Q.SPRITE['hero-l'].frames });
