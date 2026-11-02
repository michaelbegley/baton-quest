    // ---------- 84-w4-bonus.js: WORLD 4's secret level, w4-bonus THE PARKING LOT (B9; QUEST-API.md part 13, item 26) ----------
    // Where every idea anyone ever parked is parked, in rows, asleep, a ticket on every windscreen. Behind the open LATER box (D) on w4-1's second pile.
    // No memos, no enemies: a garage on two decks and the best token run in the world, roof to roof. Its E brings him back to the box.
    Q.defTile(4, 'D', { art: 't4-sdoor', fps: 2 });   // the secret door: a LATER box with its flap open
    Q.defTile(4, '1', { solid: true, art: 't4-car-yl', fps: 1 }); Q.defTile(4, '2', { solid: true, art: 't4-car-yr', fps: 1 });   // a parked idea (yellow)
    Q.defTile(4, '3', { solid: true, art: 't4-car-pl', fps: 1 }); Q.defTile(4, '4', { solid: true, art: 't4-car-pr', fps: 1 });   // a parked idea (pink)
    Q.defTile(4, '$', { solid: false, art: 't4-psign' });   // a parking sign
    Q.defLevel('w4-bonus', {
      world: 4, name: 'THE PARKING LOT', bonus: true, music: 'w4', bg: 'backlog-stairs',
      signs: [
        'EVERY WINDSCREEN HAS A TICKET. NOBODY PAYS.',
        'MAX STAY 2 HOURS. SOME HAVE STAYED 2 YEARS.'
      ],
      memos: [],
      onEnter: function (Q) { w4Enter(Q); },
      update: function (dt, Q) { w4Tick(dt, Q); },
      map: [
        '                                                                                                        ',
        '                                                                                                        ',
        '                                                                                                        ',
        '                                            O                                                           ',
        '                                           ====                                                         ',
        '                                 oo    oo    oo    oo    oo    oo                                       ',
        '                                    o     o     o   h o     o     o                                     ',
        '                                 34    12    34    12    34    12                                       ',
        '                              =========================================     O                           ',
        '        oo   oo   oo   oo   oo   ooO  oo   oo   oo   oo                    o o    oo  oo  oo  oo        ',
        '                                  12                                                                    ',
        '  S ! $ 12 o 34 o 12 o 34 o 12$o 34 o 12 o 34 o 12$o 34 o     ! $        o o o    12  34  12  34  $ E   ',
        '##########################################################################      ########################',
        '##########################################################################      ########################',
        '########################################################################################################'
      ]
    });
