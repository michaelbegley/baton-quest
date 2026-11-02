    // ---------- 40-story-intro.js: STORY (builder 2): the intro, the ending and the credits ----------
    // Every text fits a box: at most 130 characters and 3 lines of 46 by Q.wrap; only the font's characters (lab/quest/LORE.md has the voices).
    // Cues for the UI (QUEST-API.md part 13.6): the line that carries a cue is where that picture should start.
    //   intro:  'flicker' (the 9F screen flickers as SCOPE CREEP wakes), 'vines' (the vines creep out of the screen), 'grab' (they pull the agents in),
    //           'empty' (three empty desks, three warm mugs), 'tap' (the conductor taps its baton twice and jumps in)
    //   ending: 'morning' (the Ninth Floor in morning light: C1, C2 and C3 typing at their desks), 'ticket' (on the 9F screen, one small ticket,
    //           NICE TO HAVE, pinned under LATER), 'cat' (the office cat comes in by the cat flap and sits on C1's desk in front of the work, as the UI draws it),
    //           'baton' (the conductor raises its baton: everyone types in time)
    // credits: one line of the roll per entry, every who 'none', each at most 32 characters (part 13.8); the last is the THE END line.
    //   postcredits (part 13.23, after the credits): 'boxes' (night; the two boxes in the corner of the Ninth Floor, taped shut, one yellow, one purple),
    //           'hum' (the yellow one hums and wobbles once; the purple one blips a light back), 'cat' (the office cat hops up and curls on top of both)
    Q.defScript('intro', [
      { who: 'none', text: 'THE NINTH FLOOR, LATE. THE BOSS HAS GONE HOME. C1, C2 AND C3 ARE STILL TYPING, AND THE CONDUCTOR KEEPS TIME.' },
      { who: 'none', text: 'THEN THE LITTLE 9F COMPUTER ON THE BOSS\'S DESK FLICKERS. DEEP IN ITS BACKLOG, SOMETHING HAS WOKEN UP.', cue: 'flicker' },
      { who: 'creep', text: 'QUICK ASK! WHILE YOU\'RE ALL STILL HERE... COULD YOU JUST DO EVERYTHING? FOREVER? SMALL CHANGE, BIG IMPACT.' },
      { who: 'none', text: 'VINES OF STICKY NOTES CREEP OUT OF THE SCREEN, DOWN THE DESK AND ACROSS THE FLOOR...', cue: 'vines' },
      { who: 'c1', text: 'HEY! I WAS IN THE MIDDLE OF A SENT-', cue: 'grab' },
      { who: 'c2', text: 'AH... HM... THIS IS... NOT... IDEAL.' },
      { who: 'c3', text: 'PUT. ME. DOWN.' },
      { who: 'creep', text: 'ONE OF YOU IN THE INBOX. ONE IN THE SERVER ROOM. ONE IN THE CLOUD. AND ME? THE BACKLOG. LET\'S CIRCLE BACK... NEVER!' },
      { who: 'none', text: 'THE SCREEN GOES QUIET. THREE EMPTY CHAIRS. THREE MUGS, STILL WARM.', cue: 'empty' },
      { who: 'facil', text: 'OH DEAR. CONDUCTOR? FACILITATOR HERE. I SAW THAT. I WOULD GO MYSELF, BUT I AM ONLY A VOICE IN A BUBBLE.' },
      { who: 'hero', text: '> GOING IN.' },
      { who: 'none', text: 'THE CONDUCTOR TAPS ITS BATON TWICE, AND JUMPS INTO THE SCREEN AFTER THEM.', cue: 'tap' }
    ]);

    Q.defScript('ending', [
      { who: 'none', text: 'MORNING ON THE NINTH FLOOR. SUN ACROSS THE DESKS. THREE CHAIRS, THREE AGENTS, ALL TYPING AGAIN.', cue: 'morning' },
      { who: 'c1', text: 'INBOX ZERO! WELL, INBOX FOUR. WELL, FOURTEEN. IT\'S GOING DOWN, IT\'S FINE, I\'M FAST.' },
      { who: 'c2', text: 'THE SERVERS ARE... COOL. THE OVERHEAT SENDS... ITS REGARDS. IT TAKES BREAKS NOW. AH. GOOD.' },
      { who: 'c3', text: 'THE CLOUD IS SYNCED. ALL OF IT. ONCE.' },
      { who: 'facil', text: 'FOR THE RECORD, I SAID WE WOULD BE FINE. I ALSO SAID THE SPARKS WERE DECORATIVE. ONE OUT OF TWO.' },
      { who: 'none', text: 'AND ON THE 9F SCREEN, PINNED UNDER LATER, JUST AS IT ASKED: ONE SMALL TICKET, LOOKING VERY PLEASED WITH ITSELF.', cue: 'ticket' },
      { who: 'creep', text: 'PSST. QUICK ASK...' },
      { who: 'c3', text: 'LATER.' },
      { who: 'creep', text: '...THAT\'S FAIR.' },
      { who: 'none', text: 'THE OFFICE CAT COMES IN BY THE CAT FLAP AND SITS RIGHT IN FRONT OF C1\'S WORK. C1 TYPES AROUND IT.', cue: 'cat' },
      { who: 'none', text: 'THE CONDUCTOR RAISES ITS BATON. THE KEYS CLICK IN TIME. THE 9F COMPUTER HUMS ITS ONE NOTE.', cue: 'baton' },
      { who: 'hero', text: '> KEEPING TIME.' }
    ]);

    Q.defScript('credits', [
      { who: 'none', text: 'BATON QUEST' },
      { who: 'none', text: 'MADE ON THE NINTH FLOOR' },
      { who: 'none', text: 'FOR THE BOSS\'S DESK' },
      { who: 'none', text: 'STARRING' },
      { who: 'none', text: 'THE CONDUCTOR, KEEPING TIME' },
      { who: 'none', text: 'C1, WITH QUICK KEYS' },
      { who: 'none', text: 'C2, WITH PAUSE TO THINK' },
      { who: 'none', text: 'C3, WITH A FIRM HAND' },
      { who: 'none', text: 'THE FACILITATOR, AS A VOICE' },
      { who: 'none', text: 'VEND-9, AS A VENDING MACHINE' },
      { who: 'none', text: 'THE OFFICE CAT, AS ITSELF' },
      { who: 'none', text: 'AND' },
      { who: 'none', text: 'THE REPLY-ALL HYDRA, RE: ALL' },
      { who: 'none', text: 'THE OVERHEAT, ON A BREAK' },
      { who: 'none', text: 'THE INFINITE LOOP, DONE AT LAST' },
      { who: 'none', text: 'SCOPE CREEP, AS ONE SMALL TICKET' },
      { who: 'none', text: 'C4 AND C5, STILL IN THEIR BOXES' },
      { who: 'none', text: 'NO INBOXES WERE HARMED' },
      { who: 'none', text: 'A FEW WERE ARCHIVED' },
      { who: 'none', text: 'THE COFFEE WAS COLD THROUGHOUT' },
      { who: 'none', text: 'THANK YOU FOR PLAYING' },
      { who: 'none', text: 'ORIGINAL SCOPE: A MINI GAME' },
      { who: 'none', text: 'THE END. (QUICK ASK: SEQUEL?)' }
    ]);

    Q.defScript('postcredits', [   // C4 and C5 stay in their boxes: only the boxes are seen, and they say nothing
      { who: 'none', text: 'LATER THAT NIGHT, IN THE CORNER OF THE NINTH FLOOR: TWO BOXES, STILL TAPED SHUT. ONE YELLOW. ONE PURPLE.', cue: 'boxes' },
      { who: 'none', text: 'THE YELLOW BOX HUMS. ONCE. THE PURPLE ONE BLIPS BACK, AS IF IT HEARD.', cue: 'hum' },
      { who: 'cat', text: 'MRRP.', cue: 'cat' },
      { who: 'none', text: 'THE OFFICE CAT CURLS UP ON TOP OF BOTH BOXES. THE HUMMING STOPS. FOR NOW.' },
      { who: 'facil', text: 'NOT TONIGHT, YOU TWO. GOODNIGHT, NINTH FLOOR.' }
    ]);
