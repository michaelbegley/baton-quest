    // ---------- 85-root-r1.js: THE ROOT FOLDER, root-1 OLD MAIL (world 1's tiles and mechanics; the ROOT builder, builder 12) ----------
    // The first mail the 9F computer ever got, as THE INBOX was at the very start and at its hardest: the first belt, which never stopped (with him, under
    // two chutes of letters, a flag and a SPAM in it, then a gap of 7), a belt running against him under a low roof with three FLAGGED in it (against a belt
    // he is slow enough for a flag to catch him: dash), three one-tile pillars over a pit (a SPAM on the first and last, which he stomps as he lands, and a
    // chute over the middle one; no flag on a pillar, where it would rise under him with nowhere to stand clear), the first OUT OF OFFICE drifting above, and
    // the first mailbox, sealed: the only way into the last hall (a belt against him, two flags, a SPAM) is a lid of two pound blocks in its roof, over the
    // open hall, so a pound on either half drops him in and no column is left standing as a wall. World 1 drives it as its own levels do (Q.w1.enter and
    // Q.w1.update: the belts and the chutes); pace is world 1's own (how quick its enemies and chutes are; w1-3 is 1.15). Its E goes on to root-2.
    Q.defLevel('root-1', {
      world: 1, name: 'OLD MAIL', root: true, next: 'root-2', music: 'root', bg: 'root-inbox',
      legend: { s: 'spam', f: 'flag', u: 'unsub', g: 'ooo' },
      pace: 1.3, sky: 0,
      signs: [
        'WELCOME TO YOUR NEW INBOX! YOU HAVE 1 MESSAGE.',
        'THIS BELT RUNS BACKWARD. DASH PAST THE FLAGS.',
        'THE FIRST OUT OF OFFICE. STILL OUT.',
        'NEWSLETTER #1. 0 SUBSCRIBERS. SENT ANYWAY.',
        'THE FIRST MAILBOX. OPEN IT WITH A FIRM HAND.',
        'SUBJECT: TEST 2 (PLEASE IGNORE TEST 1)'
      ],
      memos: [],
      onEnter: function (Q) { if (Q.w1 && Q.w1.enter) Q.w1.enter(Q); },
      update: function (dt, Q) { if (Q.w1 && Q.w1.update) Q.w1.update(dt, Q); },
      map: [
        '#                J       J                                            J                                  #',
        '#                J       J                                            J                                  #',
        '#                J       J                                            J                                  #',
        '#                J       J                                            J                                  #',
        '#                J       J                                            J                                  #',
        '#                V       V          N                    N            V                                  #',
        '#                                                                                                        #',
        '#                                                                   o                  o h!o   o o Ou    #',
        '#I                 oo           o o o     UUUUUUUUUUUUUUUUUUU                         UUUUUUUUPPUUUUUUUUU#',
        '#I      oo   o o       o                h UUUUUUUUUUUUUUUUUUU   o   g   o   o         UUUUUUUU           #',
        '#I                                          o   oo   oo   o                          UUUUUUUUU    o o    #',
        '#IS K  !  L          f      s          ! k    f    f    f     !   s       s   K ! YF UUUUUUUUU ! f sf  EB#',
        '############>>>>>>>>>>>>>>>>>>>       ####<<<<<<<<<<<<<<<<<<<##   U   U   U   ##################<<<<<<<###',
        '###############################       #########################   U   U   U   ############################',
        '###############################       #########################   U   U   U   ############################',
        '###############################       #########################   U   U   U   ############################'
      ]
    });
