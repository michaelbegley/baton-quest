    // ---------- 83-w3-levels-a.js: WORLD 3, THE CLOUD (builder 8): w3-1 UPLOAD MEADOWS and w3-2 THE WINDY BUCKET ----------
    // w3-1 teaches the upload arrows and the drifting clouds, gently; it needs no ability, and one optional gap (and its island) teaches the hover.
    Q.w3 = Q.w3 || {};
    Q.defLevel('w3-1', { world: 3, name: 'UPLOAD MEADOWS', bg: 'cloud', w3sky: 'day', w3dots: 1, secret: 'w3-bonus',   // a stack of old file versions on the high ridge (a D) leads to FINAL_FINAL_V7
      legend: { a: 'spinner', p: 'push', d: 'w3drift', v: 'w3lift' },
      signs: ['UPLOAD MEADOWS. PLEASE KEEP OFF THE SKY.', 'ARROWS LIFT YOU. STAND ON THEM.', 'CLOUDS DRIFT. HOP ON AND ENJOY THE RIDE.',
        'NEW TRICK: HOLD A WHILE FALLING TO HOVER.', 'ALMOST DONE... (IT IS NOT.)'],
      memos: ['m3-1a', 'm3-1b'],
      onEnter: function (Q) { Q.w3.enter(Q); },
      update: function (dt, Q) { Q.w3.tick(dt, Q); },
      map: [
      '                                                                                                                                                      ',
      '                                                                                                            UU     p   p     @                        ',
      '                                                                                W                           UU Y o oD o O   ===            o   o      ',
      '                                                                                                            UU############                            ',
      '                                                                                                           oUU############                UU  Y  E  Y ',
      '                            UU o Y o                                            p   p          oo           UU############                UU##########',
      ' W                          UU######                                        o                               UU############                UU##########',
      '               W           oUU######  o                                        Y  oo  !       oOmo         oUU############                UU##########',
      '      A                     UU###### ===   oa                                 ##########      ####          UU############                UU##########',
      '                            UU######      ===                   A           o ##########      ####          UU############                UU##########',
      '          ooo    ooo      o UU######                     a                    ##########                   oUU############                UU##########',
      '            Y    ===        UU######                   o o o                  ##########   o o              UU############          ooo   UU##########',
      '          ###               UU######                                          ##########                    UU############                UU##########',
      '  SY K  ! ###        Ya  !  UU######           Y  !            K   m Y        ##########  Y         aYK   h UU############     a !        UU##########',
      '################  ##################         ########d       ############## v ######################################################   ###############',
      '################  ##################         ########        ##############   ######################################################   ###############'
      ] });

    // w3-2 teaches the gusts (a warning, then a push; the streaks show which way), the RATE LIMITER's beat, and the hover: a long way down onto small puffs,
    // then a hole in the bucket that takes a hover and a dash together (a tailwind helps, on its beat).
    Q.defLevel('w3-2', { world: 3, name: 'THE WINDY BUCKET', bg: 'cloud', w3sky: 'wind', w3dots: 2, w3pail: { x0: 480, x1: 2816, y: 128 },
      legend: { a: 'spinner', p: 'push', g: 'limiter' },
      signs: ['GUSTS PUSH YOU. WATCH FOR THE WARNING.', 'A LONG WAY DOWN. HOLD A WHILE FALLING.', 'GATES SHUT ON THE BEAT. KEEP TIME.', 'HOVER, THEN DASH, TO CROSS THE BUCKET.'],
      memos: ['m3-2a', 'm3-2b'],
      w3wind: [
        { a: 9, b: 28, top: 0, bot: 11, dir: -1, v: 65, calm: 2.0, warn: 0.9, gust: 1.6 },
        { a: 80, b: 101, top: 14, bot: 26, dir: -1, v: 55, calm: 1.8, warn: 0.9, gust: 1.8, phase: 0.5 },
        { a: 128, b: 146, top: 10, bot: 26, dir: 1, v: 60, calm: 1.6, warn: 0.8, gust: 2.2 },
        { a: 160, b: 173, top: 4, bot: 23, dir: -1, v: 60, calm: 2.4, warn: 0.9, gust: 1.2, phase: 1.0 }
      ],
      w3gates: { wave: 16 / 110, base: 0, by: { 107: 0, 113: 3 * 60 / 92, 119: 0 } },   // the second corridor: its middle gate three beats off
      onEnter: function (Q) { Q.w3.enter(Q); },
      update: function (dt, Q) { Q.w3.tick(dt, Q); },
      map: [
      '                                                                                                                                                                                              ',
      '                                                                                                                                                                                              ',
      '                                                                                                                                                                                              ',
      '                          p                                                                                                                                                                   ',
      '                                                                                                                                                                                              ',
      '           o o o      o                                                                                                                                                         o o           ',
      '                                                                                                                                                                                              ',
      '  S K ! F      F  a          !                                                                                                                                              UU    F     E  B  ',
      '#####################   ######II                                                                                                                                            UUII##############',
      '#####################   ######LL          W                                                                                                                                 UULL##############',
      '#####################   ######LL A                                                                                                                                        p UULL##############',
      '                              LL                                                                                                                                            UULL              ',
      '                              LL     o                                                                                                                                      UULL              ',
      '                              LL     ==                                                                                                                                     UULL              ',
      '                              LL                                                                                                                                         o  UULL              ',
      '                              LL                                                                                                                                     UU#######LL              ',
      '                              LL             o                                                                                                                       UU#######LL              ',
      '                              LL            ==                                                                                                                       UU#######LL              ',
      '                              LL                                   B                                                B                                                UU#######LL              ',
      '                              LL     O                ##########################          p            ######################                               p        UU#######LL              ',
      '                              LL     ==               ##########################        o o o    m     ######################           o  O  o                      UU#######LL              ',
      '                              LL                          g     g     g     g                   ===        g     g     g                                             UUH     #LL              ',
      '                              LL                                                                                                                                     UUH     #LL              ',
      '                              LL                 kB  !     o     o     o     o    F   a      a     K  N      o     o     o a       ! F            k   a       h  a   UUHo mOo#LL              ',
      '                              LL              #########################################################################################         ##############################LL              ',
      '                              LL              #########################################################################################         ##############################LL              ',
      '                              LL              #########################################################################################         ##############################LL              '
      ] });
