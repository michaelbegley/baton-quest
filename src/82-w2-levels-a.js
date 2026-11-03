    // ---------- 82-w2-levels-a.js: WORLD 2's first two levels, THE COLD AISLE and CABLE CANYON (builder 7) ----------
    // Maps: QUEST-API.md part 5; this world's own tiles are listed in 82-w2-world.js. The maps are made with a small script (B7's map kit) and pasted here.
    Q.w2 = Q.w2 || {};
    Q.w2.LEGEND = { b: 'bug', t: 'timeout', p: 'ping', s: 'spark' };
    Q.defLevel('w2-1', {
      world: 2, name: 'THE COLD AISLE', bg: 'server', w2look: 'cold', legend: { b: 'bug', t: 'timeout', p: 'ping', s: 'spark', y: 'movetoken', w: 'movebig' }, music: 'w2',   // B21: world 2's legend and the tokens for the new moves (59-engine-moves.js)
      secret: 'w2-bonus',   // the rack with its door ajar (D, column 128) leads to COLD STORAGE
      signs: ['THE COLD AISLE. PLEASE CLOSE THE DOOR.', 'BUGS ON THE WALL ARE NORMAL. SADLY.', 'TIMEOUTS FREEZE YOU. DON\'T HUG THEM.', 'QUICK KEYS: JUMP, THEN PRESS C.'],
      memos: ['m2-1a', 'm2-1b'],
      onEnter: function (Q) { Q.w2.enter(Q); },
      update: function (dt, Q) { Q.w2.step(dt, Q); },
      map: [
        '############################################################################################################################################################################',
        '#    L          L          L          L          L          L          L          L          L          L          L          L          L          L          L           #',
        '#                                                                                                                     m                                                    #',
        '#                                                                                                                     HH                                                   #',
        '#           N ywy                   N                       N                       N                       N         HH        N                       N                  #',
        '#                                                                o       o o b !       oOh                         o  HH                                                   #',
        '# BBB     BBB     BBB     BBB     BBB     BBB     BBB     BBB   ====HHHHHHHHHHHHH BBB  HHHBBB     BBB     BBB     === HHb BBB     BBB     BBB     BBB     BBB     BBB      #',
        '# BBB     BBB     BBB T   BBB     BBB     BBB  T  BBB     BBB     BBHHHHHHHHHHHHH BBB  HHHBBB   T BBB     BBB     BBB HH  BBB T   BBB     BbB     BBB     BBB    TBBB      #',
        '# BBB     BBB o   BBB     BBB     BBB     mBB     BBB     BBB  o  BBHHHHHHHHHHHHH BBB     BBb     BBB     BBB    oBBBbHH  BBB     BBB HHHHHHHHHHHHHBB     BBB     BBB      #',
        '# BBB     BBBo o  BBB     BBB    oBBB    HHHB     BBB     BBB ====BBHHHHHHHHHHHHH BBB     BBHH    BBB     BBB   ===BB HH  BBB     BBB HHHHHHHHHHHHHBB     BBB h   BBB      #',
        '# BBB     BBB     BBB     BBB  bHHHBB    HHHb     BBB     BBB     BBHHHHHHHHHHHHH BBB     BBHH    BBB     BBB     BBB HH  BBB     BBB    bBBB     BBB     BHH     Boo      #',
        '# BSB !   KBB     HHB     bBB!  HHHBBX  HHHHB     BBB k   !BB     tBHHHHHHHHHHHHH BBB     BBBo   XXBB   K BBB     BBB HH  BBoo  D BBX     BBt  o  BBB k   HHH   b BBB   E  #',
        '#CCCCCCCCCCCCCCCCCCCCCCCCC##CCC##CCC##CCC##CCC##CC  CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC   CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC#',
        '##################################################  #######################################################   ##############################################################',
        '##################################################  #######################################################   ##############################################################'
      ]
    });
    Q.defLevel('w2-2', {
      world: 2, name: 'CABLE CANYON', bg: 'server', w2look: 'canyon', legend: Q.w2.LEGEND, music: 'w2',
      signs: ['A WIDE GAP. PRESS C TO DASH.', 'JUMP, THEN DASH. ONE DASH PER JUMP.', 'SPARKS RUN ALONG THE CABLES. WAIT.', 'THE WIDEST GAP: DASH AT THE TOP OF A JUMP.'],
      memos: ['m2-2a', 'm2-2b'],
      onEnter: function (Q) { Q.w2.enter(Q); },
      update: function (dt, Q) { Q.w2.step(dt, Q); },
      map: [
        '#                                                                                                                                         |                                                      #',
        '#                                                                                                                              o@o        s                                                      #',
        '#                                                                                                                              AAA      o |                                                      #',
        '#                                                                                                                                      ---+                                                      #',
        '#                                                                      |                                                               HHH                                                       #',
        '#      N                               N                    N          |                           N                          N      o HHH              N                           N            #',
        '#                                                                      |                   |                                        ===HHH                                                       #',
        '#  BB             BB         BB                      BB            o o |   BB              |BB          BB                  BB         HHH  BB               BB                           BB     #',
        '#  BB             BB         BB                      BB          +-----+   BB              |BB          BB            T     BB     o  bHHH  BB               BB                           BBT    #',
        '#  BB             BB         BB              oo      BB          |HHHHH    BB              |BB     oo   mB                  BB    ===  HHH  BB               BB                           BB     #',
        '#  BB       o o o BB  o o o  BB    o                 BB          |HHHHH    BB      o    o  |BB          HH      oo          BB         HHH  BB               BB        o        oo        Bh     #',
        '# SBBK   !        B!         BB          p         k BB!  --s----+HHHHH    BB       ---s---+BBK p       HH !      O         Bk         HHH  BB               Bk         p                 BB  E p#',
        '############     #####      #####     #####      #################################=========######      ######              #########################   ###########     ###     ###     ###########',
        '############     #####  o   #####    b#####      #################################         ######      ######         b  H ######################### o  o  m######     ###     ###     ###########',
        '#################################     #####      #################################         ######      ######       ##############################################     ###     ###     ###########',
        '#################################     #####      #################################         ######      ######       ##############################################     ###     ###     ###########'
      ]
    });
