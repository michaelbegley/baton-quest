    // ---------- 81-w1-levels-b.js: WORLD 1, THE INBOX: w1-3 SPAM TOWER, w1-boss THE REPLY-ALL HALL, w1-bonus THE SPAM FOLDER (builder 6) ----------
    // Maps by QUEST-API.md part 5 (world 1's own tiles are in 81-w1-world.js), made with builder 6's map painter; signs and memos are
    // listed in the order the engine numbers them (by column). The Hydra itself is in 81-w1-boss.js and 81-w1-boss-b.js.

    Q.defLevel('w1-3', {
      world: 1, name: "SPAM TOWER", music: 'w1', bg: 'inbox',
      legend: {'s': 'spam', 'u': 'unsub', 'g': 'ooo', 'f': 'flag'},
      map: [
        '#......................................................................................................................................................#',
        '#......................................................................................................................................................#',
        '#......................................................................................................................................................#',
        '#......................................................................................................................................................#',
        '#......................................................................................................................................................#',
        '#..........................................................................................W.....................W...............[]........W...........#',
        '#......................................................................................o.....[]......o...............................o...............II#',
        '#..................................................U..................................o.............o.o.......o.....................o.o..............II#',
        '#..................................................U....................................................................oo...........................II#',
        '#..................................................U..................o.o......K..!.............u........T.........k....UU.....f.....g........L....E.II#',
        '#..................................................U..............UUUUUUUUUUUUUUUUUUUU..UUUUUUUUUUUU...UUUUUU...UUUUUU......UUUUUUUU...UUUUUUUUUUUUUUUU#',
        '#..................................................U........................UUUUUUUUUU..UUUUUUUUUUUU...UUUUUU...UUUUUU......UUUUUUUU...UUUUUUUUUUUUUUUU#',
        '#..................................................U..........oo............UUUUUUUUUU^^UUUUUUUUUUUU^^^UUUUUU^^^UUUUUU^^^^^^UUUUUUUU^^^UUUUUUUUUUUUUUUU#',
        '#..................................................U......========..........UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U........................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U....................f...UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#............................................UUUUUUU........................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#............................................U.....U........g...............UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#............................................U.....X.........======.........UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#............................................UY@omoX...oo...................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#............................................UUUUUUU=======.................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U........................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U............k..u........UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U........UUUUUUUUUU......UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U........................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U.....................oo.UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U....................====UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U........................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U..............======....UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U........................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U........................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U....UUUUUUUUU...........UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U........................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U..................oo....UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U...............=======..UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U......o..o..............UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................................U...=========............UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#.......................................W...W......U........................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..................................[]..............U............g.....u.....UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..........[]......................................U..............UUUUUUUUU.UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#....................o.......omo...................U........................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#.................o..U.......UUU............................................UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#.................U..U.......UUU........................========............UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '#..S..K.!.....s...U..U...s...UUU..f...!...s....k......!.....ooo.............UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#',
        '########################################################################################################################################################',
        '########################################################################################################################################################',
        '########################################################################################################################################################'
      ],
      signs: [
        "SPAM TOWER. YOU HAVE WON A PRIZE! (NO.)",
        "CLICK HERE! (THERE IS NOTHING TO CLICK.)",
        "TRAYS LET YOU JUMP UP THROUGH THEM.",
        "OUT OF OFFICE. BACK WHENEVER."
      ],
      memos: ['m1-3a', 'm1-3b'],
      pace: 1.15, sky: 2,
      onEnter: function (Q) { if (Q.w1 && Q.w1.enter) Q.w1.enter(Q); },
      update: function (dt, Q) { if (Q.w1 && Q.w1.update) Q.w1.update(dt, Q); }
    });
    Q.defLevel('w1-boss', {
      world: 1, name: "THE REPLY-ALL HALL", bg: 'inbox',
      legend: {},
      map: [
        '####################',
        '#..................#',
        '#.R................#',
        '####...............#',
        '#I............QQQQQ#',
        '#I............QQQQQ#',
        '#I............QQQQQ#',
        '#I.........T..QQQQQ#',
        '#I..S..!...TY.QQZQQ#',
        '####################',
        '####################',
        '####################',
        '####################'
      ],
      signs: [
        "THE REPLY-ALL HALL. MIND THE HEADS."
      ],
      memos: [],
      boss: 'hydra',
      pace: 1, sky: 3,
      onEnter: function (Q) { if (Q.w1 && Q.w1.enter) Q.w1.enter(Q); },
      update: function (dt, Q) { if (Q.w1 && Q.w1.update) Q.w1.update(dt, Q); }
    });
    Q.defLevel('w1-bonus', {
      world: 1, name: "THE SPAM FOLDER", music: 'w1', bg: 'inbox',
      legend: {'s': 'spam'},
      map: [
        '#......................................................................................#',
        '#......................................................................................#',
        '#......................................................................................#',
        '#......................................................................................#',
        '#....................................W.......................o.O.......................#',
        '#.................[].........................................====......................#',
        '#..........[].............................................h............................#',
        '#........................oo....o....oso......O...........====..........................#',
        '#.......................o..o..o.o...UUU....oo.oo......oo...............................#',
        '#............................o...o..UUU...o.....o....====............................T.#',
        '#.S.!...oooooooooooooo..............UUU.............k...............oooosooo...!.Y.E.T.#',
        '#######>>>>>>>>>>>>>>>>##..###...#########.s..s..s#################<<<<<<<<<<###########',
        '#########################..###...#######################################################'
      ],
      signs: [
        "YOU HAVE WON 1,000,000 TOKENS! (SOME OF THEM.)",
        "EMPTIED EVERY 30 DAYS. NOBODY EVER CHECKS."
      ],
      memos: [],
      bonus: true,
      pace: 1, sky: 4,
      onEnter: function (Q) { if (Q.w1 && Q.w1.enter) Q.w1.enter(Q); },
      update: function (dt, Q) { if (Q.w1 && Q.w1.update) Q.w1.update(dt, Q); }
    });
