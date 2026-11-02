    // ---------- 49-story-bestiary.js: STORY (builder 2): the codex's BESTIARY (QUEST-API.md part 13, item 23) ----------
    // Q.story.bestiary[enemyId] = { world (1 to 4), name (20 or fewer, the same as its def's name), line (92 or fewer: two lines of 46 by Q.wrap), boss (true
    // for the four bosses) }: every creature and boss a player meets, in world order. Not the parts: the Hydra's heads, the mailbox, falling letters, vents,
    // the cooled rack, the sky, the cloud platforms, SCOPE CREEP's eyes, vines, notes and requests. Entries show once met (the engine's Q.SAVE.met), so a
    // boss's line may tell how it ended. SPARK and RATE LIMITER are nohit (never beaten): the engine marks them met when he first touches or meets one.
    // This file loads after 48-story-bank.js (which makes Q.story) and before 49-story-extras.js.
    Q.story = Q.story || {};
    Q.story.bestiary = {
      spam: { world: 1, name: 'SPAM', line: 'A BOUNCING ENVELOPE, VERY PLEASED WITH ITSELF. YOU HAVE WON NOTHING. AGAIN.' },
      unsub: { world: 1, name: 'UNSUB BOT', line: 'A LITTLE ROBOT WITH ONE JOB: UNSUBSCRIBING. IT HAS UNSUBSCRIBED FROM ITSELF TWICE.' },
      ooo: { world: 1, name: 'OUT OF OFFICE', line: 'AN AUTO-REPLY LEFT ON YEARS AGO. IT ANSWERS EVERYTHING AND IS NEVER REALLY THERE.' },
      flag: { world: 1, name: 'FLAGGED', line: 'A RED FLAG THAT POPS UP OUT OF THE FLOOR. EVERYTHING IS URGENT, SO NOTHING IS.' },
      hydra: { world: 1, boss: true, name: 'THE REPLY-ALL HYDRA', line: 'ONE EMAIL, AND EVERYONE REPLIED. EVERY HEAD IS ONE MORE PERSON WHO HIT REPLY-ALL. RE: RE:' },

      bug: { world: 2, name: 'BUG', line: 'A BEETLE ON THE WALLS. NOBODY KNOWS WHO LET THE FIRST ONE IN. IT SAYS IT IS A FEATURE.' },
      timeout: { world: 2, name: 'TIMEOUT', line: 'A CLOCK THAT TOOK TOO LONG AND TAKES IT OUT ON YOU: ONE TOUCH AND YOU FREEZE. PLEASE WAIT.' },
      ping: { world: 2, name: 'PING', line: 'A PACKET THAT BOUNCES BACK AND FORTH, CHECKING IF YOU ARE THERE. YOU ARE. IT CHECKS AGAIN.' },
      spark: { world: 2, name: 'SPARK', line: 'A LOOSE CONNECTION RUNNING ALONG THE CABLES. NOT EVIL, JUST LOOSE. DO NOT HUG THE CABLES.' },
      overheat: { world: 2, boss: true, name: 'THE OVERHEAT', line: 'RACK 7: BUILT FOR ONE JOB, HANDED 400, NEVER GIVEN A BREAK. IT TAKES BREAKS NOW. GOOD.' },

      spinner: { world: 3, name: 'LOADING SPINNER', line: 'A RING THAT SPINS AND THROWS DOTS. IT PROMISED IT WAS ALMOST DONE. IT WAS NOT.' },
      limiter: { world: 3, name: 'RATE LIMITER', line: 'A GATE THAT SHUTS ON THE BEAT: TOO MANY REQUESTS. KEEP TIME AND WALK STRAIGHT THROUGH.' },
      miss: { world: 3, name: 'CACHE MISS', line: 'A GHOST THAT SHOULD HAVE BEEN THERE, WASN\'T, THEN WAS. HIT ONE AND IT IS A CACHE HIT.' },
      push: { world: 3, name: 'PUSH NOTIFICATION', line: 'A LITTLE BELL WITH A RED BADGE. DING! IT NEEDS YOUR ATTENTION RIGHT NOW. IT ALWAYS DOES.' },
      loop: { world: 3, boss: true, name: 'THE INFINITE LOOP', line: 'ONE LET\'S CIRCLE BACK, CIRCLING FOREVER. ALWAYS ALMOST DONE. NOW ACTUALLY DONE.' },

      ticket: { world: 4, name: 'TICKET', line: 'A HOPPING TICKET WITH BIG EYES. ALL IT WANTS IS TO BE PICKED UP AND DONE. ONE DAY.' },
      urgent: { world: 4, name: 'URGENT', line: 'LOW PRIORITY, HIGH URGENCY. IT CHARGES THE MOMENT IT SEES YOU, THEN FORGETS WHY.' },
      nice: { world: 4, name: 'NICE TO HAVE', line: 'TINY STICKY NOTES THAT MULTIPLY WHEN NOBODY SAYS NO. EACH ONE WANTS TO BE A BIG ONE.' },
      invite: { world: 4, name: 'MEETING INVITE', line: 'A CALENDAR PAGE THAT PULLS YOU IN. THIS MEETING COULD HAVE BEEN AN EMAIL. DECLINE IT.' },
      creep: { world: 4, boss: true, name: 'SCOPE CREEP', line: 'TICKET #1, GROWN ONE MORE THING AT A TIME. TRIMMED BACK NOW, AND QUITE HAPPY UNDER LATER.' }
    };
