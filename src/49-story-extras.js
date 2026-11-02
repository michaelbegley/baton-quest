    // ---------- 49-story-extras.js: STORY (builder 2): optional words for the UI (QUEST-API.md part 13, item 13) ----------
    // Read them with a fallback; data only, nothing runs at load.
    //   Q.story.shop[item]: VEND-9's words for each thing it sells: { label (at most 14 characters), blurb (at most 46) }. Prices stay in Q.PRICE.
    //   Q.story.world[n]: a one-line blurb for world n on the map (at most 40); it fits before and after that world's agent is saved.
    //   Q.story.tips: 10 title-screen tips to cycle (at most 46 each, no "TIP:" in front: add one if you like): one for each button and ability, a few jokes.
    Q.story = Q.story || {};
    Q.story.shop = {
      coffee: { label: 'COFFEE', blurb: 'ALL YOUR HEARTS, FULL AGAIN! MOSTLY HOT!' },
      heart: { label: 'EXTRA HEART', blurb: 'ONE MORE HEART TO KEEP! ONE PER CUSTOMER!' },
      baton: { label: 'BIGGER BATON', blurb: 'POWER +1. EVERY HIT HITS HARDER! CLUNK!' },
      metronome: { label: 'METRONOME', blurb: 'RHYTHM +1: ONE MORE NOTE TO THROW! TICK!' },
      memofinder: { label: 'MEMO FINDER', blurb: 'THE CODEX WILL SHOW WHERE MEMOS STILL HIDE!' },   // part 13.25
      bowtie: { label: 'GOLD BOW TIE', blurb: 'PURE STYLE! SWITCH IT IN THE PAUSE MENU!' }
    };
    Q.story.world = {
      1: 'ALL THE MAIL EVER SENT. MIND THE SPAM.',
      2: 'WHERE IT ALL RUNS. HOT, LOUD, BLINKY.',
      3: 'SOMEONE ELSE\'S COMPUTER, HIGHER UP.',
      4: 'WHERE EVERY LATER GOES, AND GROWS.'
    };
    Q.story.tips = [
      'A JUMPS. HOLD IT LONGER TO JUMP HIGHER.',
      'B SWINGS THE BATON. KEEP TIME WHILE YOU DO.',
      'HOLD B, THEN LET GO: A NOTE FLIES AHEAD.',
      'START PAUSES. EVEN SCOPE CREEP HAS TO WAIT.',
      'PRESS DOWN TO DROP THROUGH A THIN SHELF.',
      'QUICK KEYS: PRESS C (OR TAP TWICE) TO DASH.',
      'PAUSE TO THINK: HOLD A WHILE FALLING TO HOVER.',
      'FIRM HAND: IN THE AIR, DOWN AND B TO POUND.',
      'A MUG SAVES THE GAME. THE COFFEE IS COLD.',
      'THE OFFICE CAT HIDES IN EVERY WORLD. MRRP.'
    ];
