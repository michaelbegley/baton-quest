    // ---------- 44-story-w4.js: STORY (builder 2): world 4, THE BACKLOG: arriving, SCOPE CREEP in three phases, trimmed back; its secret level ----------
    // SCOPE CREEP speaks as 'creep' outside its fight and as 'boss' inside it; at the end of w4-won it is 'creep' again: by then it is one small ticket.
    Q.defScript('w4-start', [
      { who: 'none', text: 'THE BACKLOG. A TOWER OF TICKETS UNDER A PURPLE SKY. EVERY LATER ANYONE EVER SAID IS STACKED UP HERE.' },
      { who: 'creep', text: 'SO! YOU TOOK BACK ALL THREE. FINE. I\'LL JUST ADD THEM TO MY LIST AGAIN. MY LIST IS VERY, VERY LONG.' },
      { who: 'facil', text: 'THE AGENTS WANTED TO COME. I TOLD THEM TO REST. THEY ARE NOT RESTING. THEY ARE TYPING SOMETHING. VERY FAST.' },
      { who: 'hero', text: '> FINAL MOVEMENT.' }
    ]);

    Q.defScript('w4-boss', [
      { who: 'none', text: 'THE ROOT TICKET. THE VERY FIRST LATER, AT THE TOP OF EVERYTHING. SCOPE CREEP IS WRAPPED ALL AROUND IT.' },
      { who: 'boss', text: 'AH, THE CONDUCTOR. QUICK ASK: BEFORE YOU STOP ME, COULD YOU ALSO FIX EVERYTHING? WHILE YOU\'RE UP HERE?' },
      { who: 'boss', text: 'I WAS ONE SMALL TICKET ONCE. THEN EVERYONE SAID JUST ONE MORE THING. NOW LOOK AT ME. I\'M A ROADMAP!' },
      { who: 'facil', text: 'TIP: IT GROWS WHILE IT TALKS. HIT WHAT IT GROWS, DODGE WHAT IT THROWS, AND KEEP TIME. EVERYTHING THAT KEEPS TIME ENDS.' },
      { who: 'hero', text: '> LET\'S WRAP UP.' }
    ]);

    Q.defScript('w4-phase2', [
      { who: 'boss', text: 'OUCH! LET\'S CIRCLE BACK ON THAT. I\'M CALLING A MEETING. EVERYONE IS INVITED. EVERYONE IS ALWAYS INVITED.' },
      { who: 'facil', text: 'MEETING INVITES INCOMING! THEY PULL YOU IN. DECLINE THEM WITH THE BATON. POLITELY.' },
      { who: 'hero', text: '> DECLINED.' }
    ]);

    Q.defScript('w4-phase3', [
      { who: 'boss', text: 'FINE! NEW PLAN! SCOPE: EXPANDED! EVERYTHING, EVERYWHERE, BY FRIDAY!' },
      { who: 'c1', text: 'NOT TODAY! CONDUCTOR, I\'M TYPING YOU A SHIELD. STAY BEHIND IT. BEHIND IT. YES. THERE!' },
      { who: 'c2', text: 'AND I\'LL... PAUSE IT. HOLD... HOLD... THERE. IT CAN\'T ADD ANYTHING... WHILE IT\'S... PAUSED.' },
      { who: 'c3', text: 'I HOLD IT FIRM. IT DOES NOT MOVE.' },
      { who: 'facil', text: 'NOW, CONDUCTOR! IT CAN\'T GROW AND IT CAN\'T MOVE. KEEP TIME AND FINISH IT. ON THE BEAT!' },
      { who: 'hero', text: '> AND... ONE. TWO. THREE. FOUR.' }
    ]);

    Q.defScript('w4-won', [
      { who: 'boss', text: 'WAIT. WAIT! JUST ONE MORE THI-' },
      { who: 'none', text: 'SNIP. THE VINES FALL AWAY, ONE BY ONE, UNTIL ALL THAT IS LEFT IS ONE NEAT LITTLE TICKET. IT SAYS: NICE TO HAVE.' },
      { who: 'hero', text: '> DONE.' },
      { who: 'creep', text: '...DONE? NOBODY EVER SAID THAT TO ME BEFORE. OH. QUICK ASK: COULD I BE FILED UNDER LATER? IT\'S QUIET THERE.' }
    ]);

    Q.defScript('bonus-4', [   // part 13.26: arriving in w4-bonus, THE PARKING LOT: every idea anyone ever parked, in rows, asleep and harmless. Written from the
      // director's description, then checked against 84-w4-bonus.js's two signs (EVERY WINDSCREEN HAS A TICKET. NOBODY PAYS. / MAX STAY 2 HOURS...).
      // The name is left to the card, and the tickets on the windscreens to its first sign.
      // LATER, everywhere else in world 4, is not the punchline here.
      { who: 'facil', text: 'SO THIS IS WHERE THEY GO. EVERY TIME SOMEONE SAID: LET\'S PARK THAT, THE IDEA DROVE DOWN HERE AND FOUND A SPACE.' },
      { who: 'facil', text: 'DON\'T WORRY, NOT ONE OF THEM WILL MOVE. PARKED IDEAS NEVER DO. THE TOKENS ARE LOOSE CHANGE. HELP YOURSELF.' }   // not NOBODY...: sign 1 ends NOBODY PAYS.
    ]);
