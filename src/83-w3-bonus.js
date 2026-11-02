    // ---------- 83-w3-bonus.js: WORLD 3, THE CLOUD (builder 8): the secret level w3-bonus FINAL_FINAL_V7, and the world's secret door ----------
    // The cloud keeps every version of every file: FINAL, FINAL_FINAL, FINAL_FINAL_V2... all the way to V7. Behind a little stack of old file versions on
    // UPLOAD MEADOWS' high ridge (QUEST-API.md part 13, item 26): no memos, no enemies, a safe floor all the way, and the best token run in the world.
    Q.w3 = Q.w3 || {};
    Q.defSprite('w3-sdoor', { w: 16, h: 24, n: 2, draw: function (g, f) {   // the secret door: a stack of old file versions, its top page fluttering
      var C = Q.w3.C, i, y, x;
      for (i = 0; i < 4; i++) {
        y = 24 - (i + 1) * 6; x = 2 + (i % 2) + (i === 3 && f ? 1 : 0);
        w3R(g, C.k, x, y, 12, 6); w3R(g, i === 3 ? C.w : C.c, x + 1, y + 1, 10, 4); w3R(g, C.d, x + 2, y + 2, 6, 1); w3R(g, C.l, x + 2, y + 3, 4, 1);
      }
      w3R(g, C.y, 11, 0, 2, 2);
    } });
    Q.defTile(3, 'D', { art: 'w3-sdoor', fps: 2 });
    Q.defLevel('w3-bonus', { world: 3, name: 'FINAL_FINAL_V7', bonus: true, bg: 'cloud', w3sky: 'loop', music: 'w3',
      legend: { d: 'w3drift' },
      signs: ['EVERY VERSION OF EVERY FILE, STILL KEPT.', 'THIS VERSION IS THE REAL ONE. PROBABLY.'],
      memos: [],
      w3sync: { period: 4, warn: 0.7 },
      w3tokens: [[32, 12], [33, 11], [32, 10], [33, 9], [32, 8], [33, 7], [32, 6], [33, 5],   // up the first upload arrow, zigzag
        [92, 12, 'bigtoken'], [93, 9, 'bigtoken'], [92, 6, 'bigtoken'], [93, 3, 'bigtoken']],   // up the last one
      onEnter: function (Q) { Q.w3.enter(Q); },
      update: function (dt, Q) { Q.w3.tick(dt, Q); },
      map: [
      '                                                                                                        ',
      '                                                                                                        ',
      '                                                                                            UU o o E  A ',
      '                                   o o o O o o o oooooooo O o                               UU##########',
      '                                UU===============       =====     oOo     oOo               UU##########',
      '                                UU#                           ooo 222 ooo 222               UU##########',
      '                                UU#                           111     111                   UU##########',
      '        A                       UU#                                                         UU##########',
      '                                UU#                                                         UU##########',
      '    A                           UU#                                                         UU##########',
      '                                UU#                                                         UU##########',
      '            oo    oo    oo      UU#                         o o o o o o o o o    o o o      UU##########',
      '           o  o  o  o  o  o     UU#                                                         UU##########',
      ' YS  ! K                   o o  UU# o o o o o o o o o       k                            !  UU##########',
      '############  ####  ####  ######################################################d      #################',
      '############  ####  ####  ######################################################       #################'
      ] });
