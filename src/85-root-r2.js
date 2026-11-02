    // ---------- 85-root-r2.js: THE ROOT FOLDER, root-2 OLD RACKS (world 2's tiles and mechanics; the ROOT builder, builder 12) ----------
    // The first server (one box, very loud, cables in knots, labels on labels), as THE SERVER ROOM was at the very start and at its hardest. A fan gives
    // back no dash and no hover (only landing does, or a stomp), so each fan pit is played the world's own way, two moves to an airtime: in plainly, dash to
    // the second column, hover to the third when it runs, drift onto the ledge beside it (a dead fan is a pillar to land on, and landing gives both back).
    // The first fans: always on, then two that take turns. The rack rows: a corridor three tall with BUGs on its ceiling and floor, a PING hopping along a
    // floor with no gap (so it lands nowhere he must stand), a TIMEOUT. The first cable: standing in a gap of 6 with a SPARK running up and down it. The
    // switching shaft: three fans that take turns (G, J, G) with a cable and a SPARK standing between each two, then the high ledge and the door. World 2
    // drives it as its own levels do (Q.w2.enter, Q.w2.step: the updrafts and the switching fans); w2look is its background's look. E goes on to root-3.
    Q.defLevel('root-2', {
      world: 2, name: 'OLD RACKS', root: true, next: 'root-3', music: 'root', bg: 'root-server', w2look: 'canyon',
      legend: { b: 'bug', t: 'timeout', p: 'ping', s: 'spark' },
      signs: [
        'LABEL: SERVER. SMALLER LABEL: THE GOOD ONE.',
        'THE FIRST FAN. STILL SPINNING. STILL LOUD.',
        'UPTIME: EVERY DAY SINCE THE FIRST ONE.',
        'WAIT FOR THE SPARK TO GO DOWN. THEN JUMP.',
        'THEY TAKE TURNS. RED LIGHT MEANS STOPPING.',
        'IF IT BEEPS TWICE, IT IS SAYING HELLO.'
      ],
      memos: [],
      onEnter: function (Q) { if (Q.w2 && Q.w2.enter) Q.w2.enter(Q); },
      update: function (dt, Q) { if (Q.w2 && Q.w2.step) Q.w2.step(dt, Q); },
      map: [
        '#           HHHHHHHHHHHHHHH                                                  HHHHHHHHHHHHHHHHHHHH      #',
        '#           HHHHHHHHHHHHHHH                                                  HHHHHHHHHHHHHHHHHHHH      #',
        '#            L         L                                                                               #',
        '# +-+           o     o  O                                                      o |  o |  o            #',
        '# | |                            HHHHHHHHHHHHHHHHHH                               |    |               #',
        '# +-++   N                   o   HHHHHHHHHHHHHHHHHH         |                     |    |           L   #',
        '#  T |                           HHHHHHHHHHHHHHHHHH         |                     s    |               #',
        '#    |       o     o        k         b        b            |                     |    |     h  !    E #',
        '#B   + o o                 HHHH     o  o   h o  o           s                     |    |    HHHHHHHHHHH#',
        '#B                         HHHH   !      p   b   t        o | o     o o o   T     |    s    HHHHHHHHHHH#',
        '#B      AA                 HHHHHHHHHHHHHHHHHHHHHHHHHH       |                     |    |    HHHHHHHHHHH#',
        '#BS K ! AA!                HHHHHHHHHHHHHHHHHHHHHHHHHH ! k   |           K !       |    |    HHHHHHHHHHH#',
        '###########  F     G     J HHHHHHHHHHHHHHHHHHHHHHHHHH####   |  ####     #####   G    J    G HHHHHHHHHHH#',
        '###########  H     H     H HHHHHHHHHHHHHHHHHHHHHHHHHH####   |  ####     #####   H    H    H HHHHHHHHHHH#',
        '###########  H     H     H HHHHHHHHHHHHHHHHHHHHHHHHHH####   |  ####     #####   H    H    H HHHHHHHHHHH#',
        '###########  H     H     H HHHHHHHHHHHHHHHHHHHHHHHHHH####   |  ####     #####   H    H    H HHHHHHHHHHH#'
      ]
    });
