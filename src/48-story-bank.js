    // ---------- 48-story-bank.js: STORY (builder 2): the words bank for the other parts (LORE.md has the same words, with what each is for) ----------
    // Not in the contract, so read it with a fallback: (Q.story && Q.story.shout.hydra) || ['RE:'].  Data only; nothing runs at load.
    //   Q.story.shout[bossId]: a boss's shouts during its fight (each at most 24 characters: a Q.toast or a Q.fx('text') at scale 1).
    //     creep is SCOPE CREEP's first phase; creep2 and creep3 its second and third.
    //   Q.story.hurt[bossId]: when a hit lands.  Q.story.beaten[bossId]: the moment it is beaten.  (24 characters each.)
    //   Q.story.pop[enemyId]: the little word an enemy leaves when it is beaten (at most 16).  Q.story.sign[levelId]: tips for that level's signs (at most 46).
    //   Q.story.pick(list): one of a list, at random (Q.rand), or '' for none.
    Q.story = {
      shout: {
        hydra: ['RE:', 'RE: RE:', 'RE: RE: RE:', '+1', 'PER MY LAST EMAIL', 'PLEASE ADVISE', 'ADDING EVERYONE', 'CC: THE WHOLE FLOOR', 'WHO IS ON THIS?',
          'RE: FWD: RE:', 'THANKS ALL!', 'REPLYING ALL!', 'URGENT! URGENT!'],
        overheat: ['400 JOBS AND RISING!', 'I NEVER REBOOT!', 'ONE MORE JOB!', 'FANS TO MAX!', 'HOTTER!', '200 PERCENT!', 'NO BREAKS!', 'THROTTLING...',
          'RUNNING HOT!', 'MELTDOWN MODE!'],
        loop: ['AGAIN! AGAIN!', 'ONE MORE LAP!', 'CIRCLING BACK!', 'ALMOST DONE!', 'FROM THE TOP!', 'WHERE WAS I? HERE!', 'LAP 9,999!', 'AND AGAIN!',
          'ROUND WE GO!', 'DOUBLE TIME!'],
        creep: ['QUICK ASK!', 'WHILE YOU\'RE IN THERE...', 'JUST ONE MORE THING!', 'SMALL CHANGE, BIG IMPACT', 'CAN WE ALSO...', 'AND ANOTHER THING!'],
        creep2: ['QUICK SYNC!', 'LET\'S CIRCLE BACK!', 'EVERYONE\'S INVITED!', 'THIS IS A HARD STOP!', 'LET\'S TAKE IT OFFLINE!'],
        creep3: ['SCOPE: EXPANDED!', 'BY FRIDAY!', 'I\'M A ROADMAP NOW!', 'NO! NOT A DEADLINE!']
      },
      hurt: {
        hydra: ['RE:'],
        overheat: ['NOT THE VENT!', 'OOH. COOL.', 'OOH. A DRAFT.'],   // not "THAT'S... NICE": its outro opens with it
        loop: ['OW! OW!', 'MY TAIL! MY TAIL!'],
        creep: ['OUCH! NOTED!', 'PARKING THAT!']
      },
      // beaten: the moment before its outro, so never the outro's own punchline (the read-through in play, 2 Nov)
      beaten: { hydra: ['UNSUBSCRIBE ME...'], overheat: ['COOLING... DOWN...'], loop: ['LAST... LAP...?'], creep: ['SCOPE... SHRINKING...'] },
      pop: {
        spam: 'MARKED AS SPAM', unsub: 'UNSUBSCRIBED', ooo: 'BACK MONDAY', flag: 'RESOLVED',
        bug: 'FIXED', timeout: 'TIMED OUT', ping: 'PONG',   // no spark: it cannot be beaten
        spinner: 'LOADED!', limiter: 'LET THROUGH', miss: 'CACHE HIT!', push: 'DO NOT DISTURB',
        ticket: 'DONE!', invite: 'DECLINED', nice: 'LATER', urgent: 'DEPRIORITIZED'
      },
      sign: {
        'w1-1': ['A: JUMP. HOLD IT TO JUMP HIGHER.', 'B: SWING THE BATON.', 'HOLD B, THEN LET GO: THROW A NOTE.', 'NOTES USE RHYTHM. IT FILLS BACK UP.',
          'PRESS DOWN ON A THIN SHELF TO DROP THROUGH.', 'A COFFEE MUG SAVES YOUR GAME.', 'CRATES BREAK. SOME HAVE TOKENS.', 'THE DOOR: PRESS UP TO GO IN.',
          'UNREAD: 99+. DO NOT WORRY ABOUT IT.'],
        'w1-2': ['CAUTION: SORTING IN PROGRESS. FOREVER.', 'TRAYS ARE THIN. PRESS DOWN TO DROP.', 'PLEASE DO NOT UNSUBSCRIBE THE STAFF.'],
        'w1-3': ['SPAM TOWER. YOU HAVE WON A PRIZE! (NO.)', 'CLICK HERE! (THERE IS NOTHING TO CLICK.)', 'OUT OF OFFICE. BACK WHENEVER.'],
        'w1-boss': ['THE REPLY-ALL HALL. MIND THE HEADS.'],
        'w2-1': ['THE COLD AISLE. PLEASE CLOSE THE DOOR.', 'TIMEOUTS FREEZE YOU. DON\'T HUG THEM.', 'BUGS ON THE WALL ARE NORMAL. SADLY.'],
        'w2-2': ['A WIDE GAP. PRESS C TO DASH.', 'JUMP, THEN DASH. ONE DASH PER JUMP.', 'SPARKS RUN ALONG THE CABLES. WAIT.'],
        'w2-3': ['FANS BLOW YOU UP. RIDE THE AIR.', 'DASH FROM FAN TO FAN.', 'IT WORKS ON MY MACHINE.'],
        'w2-boss': ['THE HOT AISLE. HIT THE VENTS TO COOL IT.'],
        'w3-1': ['UPLOAD MEADOWS. PLEASE KEEP OFF THE SKY.', 'ARROWS LIFT YOU. STAND ON THEM.', 'ALMOST DONE... (IT IS NOT.)'],
        'w3-2': ['A LONG WAY DOWN. HOLD A WHILE FALLING.', 'HOVER, THEN DASH, TO CROSS THE BUCKET.', 'GATES SHUT ON THE BEAT. KEEP TIME.'],
        'w3-3': ['SYNC IN PROGRESS. DO NOT UNPLUG THE SKY.', 'THIS VERSION OR THAT VERSION? YES.', 'JUMP. HOVER. DASH. IN THAT ORDER.'],
        'w3-boss': ['THE LOOP. HIT THE GAP WHEN HEAD MEETS TAIL.'],
        'w4-1': ['THE LATER PILE. EVERYTHING HERE IS LATER.', 'TICKET #2: FIX THE WOBBLY DESK. (LATER.)', 'LOW PRIORITY. HIGH URGENCY. GOOD LUCK.'],
        'w4-2': ['THIS BLOCK WON\'T BREAK. JUMP, THEN DOWN + B.', 'SPRINT STAIRS. TWO WEEKS PER STEP.', 'DECLINE ALL MEETINGS. YOUR BATON KNOWS HOW.'],
        'w4-3': ['THE TOWER OF TICKETS. UP IS THE WAY OUT.', 'NICE TO HAVE. NICE TO HAVE. NICE TO HAVE.', 'NEARLY THERE. (THIS SIGN MEANS IT.)'],
        'w4-boss': ['THE ROOT TICKET. KEEP TIME.']
      },
      pick: function (list) { return list && list.length ? list[Math.floor(Q.rand() * list.length) % list.length] : ''; }
    };
