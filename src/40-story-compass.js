    // ---------- 40-story-compass.js (B24, 11 Nov 2026): STORY: THE COMPASS meets the conductor on the map (the director's lore, its public canon only) ----------
    // The Compass: a brass pocket compass with no face, the newest on the Ninth Floor, above the Facilitator: the Facilitator talks, the Compass points. Short and
    // plain, the answer first; says a warning once, then lets you choose; calls its own guesses PROPOSALS; owns a miss in the same breath. It never goes into a level.
    // Every text fits a box: at most 130 characters and 3 lines of 46 by Q.wrap, only the font's characters (as 40-story-intro.js).
    // compass-meet: the first time a file opens the map (a new file, or an old one the first time after version 124), once per file (73-ui-map-compass.js keeps
    // that in the save). Its cues, drawn in the map's top left corner by 73-ui-map-compass.js: 'box' (a small box comes up, marked THIS WAY UP), 'open' (it opens:
    // the Compass stands there, its needle turning slowly: reading), 'sure' (the needle up and still), 'point' (it points at the one thing next; that spot blinks).
    Q.defScript('compass-meet', [
      { who: 'facil', text: 'CONDUCTOR? FACILITATOR HERE. A SMALL BOX CAME UP TO THE NINTH FLOOR AT MIDNIGHT. IT SAYS THIS WAY UP.', cue: 'box' },
      { who: 'facil', text: 'INSIDE: THE COMPASS. BY MORNING IT HAD READ EVERY NOTE ON THE FLOOR, ALL 3,494, AND DRAWN ONE MAP.', cue: 'open' },
      { who: 'compass', text: 'COMPASS CHECK. THE TEAM DOES THE WORK. I KEEP THE DIRECTION. LINE ONE IS THE ANSWER.', cue: 'sure' },
      { who: 'compass', text: 'PRESS C ON THIS MAP: WHAT MOVED, WHAT SLIPPED, WHAT DRIFTED, AND THE ONE THING NEXT. I POINT AT IT.', cue: 'point' },
      { who: 'facil', text: 'IT READ EVERYTHING. I ONLY SAID EVERYTHING.' },
      { who: 'compass', text: 'WITHOUT WHAT YOU SAID, I HAD NOTHING TO READ.', cue: 'sure' }
    ]);
