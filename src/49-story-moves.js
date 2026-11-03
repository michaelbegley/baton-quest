    // ---------- 49-story-moves.js (STORY's words, B21 MOVES, 2 Nov): learning PUSHBACK and FOLLOW UP, and every move's line in the codex (QUEST-API.md part 23) ----------
    // learn-walljump plays after w4-won in THE ROOT TICKET (the engine's LEARNED PUSHBACK toast first); learn-doublejump when he touches THE FOLLOW-UP, the
    // unread email at the top of the shaft behind SPAM TOWER. Q.story.moves: one line per move for the codex's MOVES page (92 or fewer: two lines of 46).
    Q.defScript('learn-walljump', [
      { who: 'facil', text: 'YOU JUST SAID NO TO ONE MORE THING. THAT IS CALLED PUSHBACK, AND IT TURNS OUT WALLS TAKE IT TOO.' },
      { who: 'facil', text: 'IN THE AIR, HOLD INTO A WALL TO SLIDE DOWN IT, THEN A TO KICK OFF. TWO WALLS FACE TO FACE? KICK BETWEEN THEM, ALL THE WAY UP.' },
      { who: 'facil', text: 'ONE MORE THING, AND I DO SEE THE IRONY: AN EMAIL IS STUCK UP A SHAFT BEHIND SPAM TOWER. NO RUSH. IT HAS WAITED THIS LONG.' }
    ]);
    Q.defScript('learn-doublejump', [
      { who: 'none', text: 'AN UNREAD EMAIL, STUCK BEHIND THE TOWER SINCE FOREVER. SUBJECT: JUST FOLLOWING UP. THE WHOLE MESSAGE: JUMP AGAIN.' },
      { who: 'facil', text: 'FOLLOW UP: IN THE AIR, PRESS A ONCE MORE FOR ONE MORE JUMP. LANDING, OR A KICK OFF A WALL, GIVES IT BACK.' },
      { who: 'hero', text: '> FOLLOWING UP.' }
    ]);
    Q.story = Q.story || {};
    Q.story.moves = {
      dash: 'FROM C1. A BURST SIDEWAYS: ANY TIME ON THE GROUND, ONCE IN THE AIR UNTIL HE LANDS.',
      hover: 'FROM C2. HOLD A WHILE FALLING AND HE STOPS IN THE AIR, DRIFTING, TO THINK A WHILE.',
      pound: 'FROM C3. DOWN AND B IN THE AIR: STRAIGHT DOWN, THROUGH BLOCKS, AND THE FLOOR SHAKES.',
      walljump: 'FOR TELLING SCOPE CREEP NO. SLIDE DOWN A WALL, KICK OFF IT. BETWEEN TWO WALLS: UP.',
      doublejump: 'FROM AN EMAIL BEHIND SPAM TOWER. ONE MORE JUMP IN THE AIR, BACK ON LANDING OR A KICK.'
    };
