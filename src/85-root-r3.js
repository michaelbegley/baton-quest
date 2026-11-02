    // ---------- 85-root-r3.js: THE ROOT FOLDER, root-3 OLD CLOUDS (world 3's tiles and mechanics; the ROOT builder, builder 12) ----------
    // The first uploads (small grey clouds low to the ground, and progress bars), as THE CLOUD was at the very start and at its hardest. Upload arrows (U)
    // give back the dash and the hover, so they chain: three arrows across a pit of 20, each higher than the last, under a gusting headwind (he can bob at an
    // arrow's top and wait for the calm, holding against a gust), then down onto a floating grey cloud. The sync bridge: five clouds that take turns (1 and 2,
    // w3sync's beat) with gaps of 2; a cloud he stands on goes on its beat, so he hops one cloud on at each blink, and the headwind there blows only above the
    // clouds (standing is calm, a high hop is not; a dash always clears it). The last upload: step off the bank into a low arrow, dash onto a sync cloud when
    // it is there, hop onto the other version a step higher, into a tall arrow, a CACHE MISS blinking about, then the last bank with a LOADING SPINNER and the
    // door. World 3 drives it as its own levels do (Q.w3.enter, Q.w3.tick); the w3 fields are world 3's (w3sky, w3wind, w3sync, w3tokens, w3dots). E: root-4.
    Q.defLevel('root-3', {
      world: 3, name: 'OLD CLOUDS', root: true, next: 'root-4', music: 'root', bg: 'root-cloud', w3sky: 'loop', w3dots: 2,
      legend: { a: 'spinner', c: 'miss', p: 'push' },
      signs: [
        'TIME LEFT: ABOUT A MINUTE. (SINCE DAY ONE.)',
        'EVERY ARROW GIVES BACK YOUR DASH AND HOVER.',
        'AT EACH BLINK, HOP ONE CLOUD ON.',
        'NEW FOLDER (2)',
        'FINAL.DOC: THE FIRST FINAL. NOT THE LAST.'
      ],
      memos: [],
      w3sync: { period: 4, warn: 0.7 },
      w3wind: [
        { a: 11, b: 30, top: 1, bot: 11, dir: -1, v: 45, calm: 2.0, warn: 0.9, gust: 1.6 },
        { a: 37, b: 58, top: 3, bot: 6, dir: -1, v: 30, calm: 2.4, warn: 0.9, gust: 1.4, phase: 1.3 }   // above the clouds: standing on one is calm, a high hop is not
      ],
      w3tokens: [[13, 10], [20, 8], [25, 6], [65, 11], [78, 8]],
      onEnter: function (Q) { if (Q.w3 && Q.w3.enter) Q.w3.enter(Q); },
      update: function (dt, Q) { if (Q.w3 && Q.w3.tick) Q.w3.tick(dt, Q); },
      map: [
        '                                                                                                        ',
        '                                                                                                        ',
        '                      p                                                                                 ',
        '                            o                                                    O                      ',
        '                      o  UU                                                                 a           ',
        '                o  UU    UU     h                                       c     UU                        ',
        '                   UU    UU              o   o   o   o   o                  o UU        N     Y !   E Y ',
        '             UU    UU    UU      k !                        K ! h    o        UU    CCCCCCCCCCCCCCCCCCCC',
        '     o o     UU    UU    UU    CCCCCC  11  22  11  22  11  CCCCCC             UU    VVVVVVVVVVVVVVVVVVVV',
        '             UU    UU    UU    VVVVVV                      VVVVVVUU      22   UU    VVVVVVVVVVVVVVVVVVVV',
        '             UU    UU    UU                                VVVVVVUU  11       UU    VVVVVVVVVVVVVVVVVVVV',
        '  S K ! NY!  UU    UU    UU                                VVVVVVUU           UU    VVVVVVVVVVVVVVVVVVVV',
        'CCCCCCCCCCC  UU    UU    UU                                VVVVVVUU           UU    VVVVVVVVVVVVVVVVVVVV',
        'VVVVVVVVVVV  UU    UU    UU                                VVVVVVUU           UU    VVVVVVVVVVVVVVVVVVVV',
        'VVVVVVVVVVV  UU    UU    UU                                VVVVVVUU           UU    VVVVVVVVVVVVVVVVVVVV',
        'VVVVVVVVVVV  UU    UU    UU                                VVVVVVUU           UU    VVVVVVVVVVVVVVVVVVVV'
      ]
    });
