    // ---------- 83-w3-levels-b.js: WORLD 3, THE CLOUD (builder 8): w3-3 THE SYNC STORM and the boss arena, w3-boss THE LOOP ----------
    // w3-3 teaches lightning (a mark flashes, then the bolt lands there) and the SYNC clouds (two versions take turns; at each swap both are there,
    // blinking: hop then), tests them together under the storm, then twists them into one crossing: jump, hover while the next version comes, dash.
    Q.w3 = Q.w3 || {};
    Q.defLevel('w3-3', { world: 3, name: 'THE SYNC STORM', bg: 'cloud', w3sky: 'storm', w3dots: 3,
      legend: { a: 'spinner', c: 'miss', p: 'push' },
      signs: ['SYNC IN PROGRESS. DO NOT UNPLUG THE SKY.', 'WHERE THE MARK FLASHES, LIGHTNING LANDS. MOVE.', 'THIS VERSION OR THAT VERSION? YES.', 'JUMP. HOVER. DASH. IN THAT ORDER.'],
      memos: ['m3-3a', 'm3-3b'],
      w3sync: { period: 4, warn: 0.7 },
      // over the second bridge of SYNC clouds he must wait on each cloud for the swap: there the storm only lands behind him, 5 to 7.5 s apart
      w3storm: [{ a: 12, b: 26, every: 3.0 }, { a: 89, b: 118, every: 6.25, behind: true }, { a: 147, b: 170, every: 2.8 }],
      onEnter: function (Q) { Q.w3.enter(Q); },
      update: function (dt, Q) { Q.w3.tick(dt, Q); },
      map: [
      '                                                                                                                                                                                                        ',
      '                                                                                                                                                                                                        ',
      '                                                                                                                                                                        omo          o o o              ',
      '                                                                                                                                                                        === UU    J           E    T    ',
      '                                                                                                                                                                            UUCCCCCCCCCCCCCCCCCCCCCCCCCC',
      '                                                                                                                                                                            UUVVVVVVVVVVVVVVVVVVVVVVVVVV',
      '                                                                                                                                              o o o                         UUVVVVVVVVVVVVVVVVVVVVVVVVVV',
      '                                                                                                        O                                                                   UUVVVVVVVVVVVVVVVVVVVVVVVVVV',
      '                                                                        c                                                                o o                                UUVVVVVVVVVVVVVVVVVVVVVVVVVV',
      '                                            o                                                 o    o    o    o    o                      222                          p     UUVVVVVVVVVVVVVVVVVVVVVVVVVV',
      '               o  o  o  o         o    o    o    o                    o o o        A                   222                         oo                      o o              UUVVVVVVVVVVVVVVVVVVVVVVVVVV',
      '                                      222       222             c               c  CC             111       111                    11                    c                  UUVVVVVVVVVVVVVVVVVVVVVVVVVV',
      '                    CC           111       111                     XX              VV        222                 222                                                        UUVVVVVVVVVVVVVVVVVVVVVVVVVV',
      '  S  K  ! J  !  a T VV      TJ!                        k  J m      XX       a      VV   K T                             T     !k                    J k       a   h  T      UUVVVVVVVVVVVVVVVVVVVVVVVVVV',
      'CCCCCCCCCCCCCCCCCCCCVVCCCCCCCCC                      CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCVVCCCCCCC                          CCCCCCCCCCC                  CCCCCCCCCCCCCCCCCCCCCCCCCCCVVVVVVVVVVVVVVVVVVVVVVVVVV',
      'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV                      VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV                          VVVVVVVVVVV                  VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV',
      'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV                      VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV                          VVVVVVVVVVV                  VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV',
      'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV                      VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV                          VVVVVVVVVVV                  VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
      ] });

    // w3-boss: THE LOOP. One screen; the floor's top at row 9 so the text box never hides the fight (QUEST-API.md part 13, item 17). The ring track
    // (w3track: its centre, half-width and half-height; lx, rx, sa, sb for the two small loops of phase 3) runs round C3, clear of both side ledges.
    Q.defLevel('w3-boss', { world: 3, name: 'THE LOOP', bg: 'cloud', w3sky: 'loop', boss: 'loop', music: 'boss-loop',
      w3track: { cx: 160, cy: 70, a: 112, b: 38, lx: 96, rx: 224, sa: 46, sb: 28 },   // phase 3's loops pass 11 px from each ledge
      signs: ['THE LOOP. HIT THE GAP WHEN HEAD MEETS TAIL.'], memos: [],
      onEnter: function (Q) { Q.w3.enter(Q); },
      update: function (dt, Q) { Q.w3.tick(dt, Q); },
      map: [
      '                    ',
      ' W                  ',
      '                 W  ',
      '          Z         ',
      '         R          ',
      '==       ==       ==',
      '                    ',
      '==                ==',
      '  Y S !      N Y    ',
      '####################',
      '####################',
      '####################',
      '####################'
      ] });
