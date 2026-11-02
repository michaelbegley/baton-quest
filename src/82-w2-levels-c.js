    // ---------- 82-w2-levels-c.js: WORLD 2's secret level, COLD STORAGE, behind the rack door left ajar in THE COLD AISLE (builder 7) ----------
    // Maps: QUEST-API.md part 5; this world's own tiles are listed in 82-w2-world.js. The maps are made with a small script (B7's map kit) and pasted here.
    Q.w2 = Q.w2 || {};
    Q.w2.LEGEND = { b: 'bug', t: 'timeout', p: 'ping', s: 'spark' };
    Q.defLevel('w2-bonus', {
      world: 2, name: 'COLD STORAGE', bg: 'server', w2look: 'cold', legend: Q.w2.LEGEND, music: 'w2',
      bonus: true,   // QUEST-API part 13, item 26: no memos; its door leads back to the rack door in w2-1
      signs: ['THE OLD BACKUPS ARE SLEEPING.', 'LAST RESTORED: NEVER. PLEASE DO NOT WAKE.', 'BACKUP OF THE BACKUP OF THE BACKUP. OF WHAT?'],
      memos: [],
      onEnter: function (Q) { Q.w2.enter(Q); },
      update: function (dt, Q) { Q.w2.step(dt, Q); },
      map: [
        '####################################################################################################',
        '#M  M  M  ML M  M  M  M  M  M  M  YYYYYYM  M LM  M  M  M  M  M  M  M  L  M  M  M  M  M  M  ML M  M #',
        '#                                 YYYYYY        O                                                  #',
        '#                                                              oooo    ooOo                        #',
        '#                        ooo   YYYYYYYY  o  o o  o o  o o !   o    o  o    oh  oooo    YYYYYYYY    #',
        '#    YYYYYYYYY    ooo   o   oooYYYYYYYY ===================HHH              HHo        YYYYYYYY    #',
        '#    YYYYYYYYY   o   ooo     HHYYYYYYYY                    HHH      HH      HH     O ! YYYYYYYY    #',
        '#    YYYYYYYYY oo     HH     HHYYYYYYYY   o    o    o      HHH      HH      HH      HHHYYYYYYYY    #',
        '#    YYYYYYYYY HH     HH     HHYYYYYYYY                    HHH      HH      HH      HHHYYYYYYYY    #',
        '#              HH     HH     HHYYYYYYYY   o    o    o      HHH      HH      HH      HHH            #',
        '# S ! ooooooo  HH     HH     HHoooooooo k                  HHH      HH      HH      HHk ooooooo E  #',
        '#CCCCCCCCCCCCCCCCCFFCCCCCFFCCCCCCCCCCCCCCCFFCCCFFCCCFFCCCCCCCCCCFFCCCCCCFFCCCCCCFFCCCCCCCCCCCCCCCCC#',
        '####################################################################################################',
        '####################################################################################################'
      ]
    });
