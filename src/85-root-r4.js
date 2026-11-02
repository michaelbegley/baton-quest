    // ---------- 85-root-r4.js: THE ROOT FOLDER, root-4 OLD TICKETS (world 4's tiles and mechanics; the ROOT builder, builder 12) ----------
    // The first tickets ever filed, in a short, neat stack, as THE BACKLOG was at the very start and at its hardest: three thick floors of tickets, each passed
    // through by a pound stack two wide and four deep that opens into the open floor below (so pounding through only one column never walls him in), and
    // each of the upper two ended by a wall too tall to jump, so the stack is the only way down. Floor 0:
    // TICKETs hopping, a stack of three standing on the floor (jump it or pound it flat), a strip of spikes with a MEETING INVITE standing beyond it, which
    // pulls him toward them while he stands; he jumps the strip, lands clear of it and declines it with the baton (an invite over the strip would block the
    // only jump, and one high enough to clear it is out of its own pull). Floor 1: two such strips and invites, an URGENT that charges, a ticket, another
    // standing stack, then the second stack, an INVITE beside it. Floor 2: NICE TO HAVE notes in a hollow, buds that grow into vines as he nears
    // (they grow back: regrow is world 4's own), a ticket, an URGENT, a last standing stack by the door. World 4 drives it as its own levels do (Q.w4.enter
    // and Q.w4.tick: the vines). Its E goes on to root-5.
    Q.defLevel('root-4', {
      world: 4, name: 'OLD TICKETS', root: true, next: 'root-5', music: 'root', bg: 'root-backlog',
      legend: { t: 'ticket', i: 'invite', u: 'urgent', n: 'nice' },
      regrow: 5,
      signs: [
        'TICKET #3: ORDER MORE COFFEE. (DONE. COLD.)',
        'THE FIRST STACK. ONE POUND GOES ALL THE WAY.',
        'TICKET #4: NAME THE CAT. (WON\'T FIX.)',
        'AN INVITE PULLS ONLY WHILE YOU STAND. JUMP.',
        'PRIORITY: LOW. URGENCY: LOW. BLISS.',
        'TICKET #2 IS UPSTAIRS. IT STILL WOBBLES.'
      ],
      memos: [],
      onEnter: function (Q) { if (Q.w4 && Q.w4.enter) Q.w4.enter(Q); },
      update: function (dt, Q) { if (Q.w4 && Q.w4.tick) Q.w4.tick(dt, Q); },
      map: [
        '#                                                                                                      #',
        '#                                                                                                      #',
        '#             o                #                                                                       #',
        '#        o o  P                #                                                                       #',
        '#:            P   o o        h #                                                                       #',
        '# S K ! *  t  Pt       i !     #                                                                       #',
        '##################^^#######PP###                                                                       #',
        '###########################PP###                                      #                                #',
        '###########################PP###                                      #                                #',
        '###########################PP###                    o               i #                                #',
        '#                                  o o o            P   o o o  h      #                                #',
        '#  o o o                                            P                 #                                #',
        '#O                            k !         i   u !   P        i  t     #                                #',
        '#####################################^^^################^^^#######PP###                                #',
        '##################################################################PP###                                #',
        '##################################################################PP###                                #',
        '##################################################################PP###                          o     #',
        '#                                                                                       o o      P     #',
        '#         o o                                                                o o o o  G          P     #',
        '#   O                                                                K !  []          G   t   u  P ! E,#',
        '############################################################################ n  n   ####################',
        '########################################################################################################',
        '########################################################################################################'
      ]
    });
