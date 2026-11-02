    // ---------- 48-story-overtime.js: STORY (builder 2): version 116's scripts (QUEST-API.md part 14.7): THE ENCORE, THE ROOT FOLDER, all the stars, HOLD MUSIC ----------
    // Every line fits a box (130 characters, 3 lines of 46 by Q.wrap) and uses the font only. LORE.md's last part has the root folder's story for its rooms.
    // The canon these lean on: the 9F computer came in a box one Monday (memo m1-1a), the conductor tuned its baton on day one (m2-1a), and TICKET #1 is
    // SCOPE CREEP, which grew because NOBODY EVER SAID DONE (m4-3b). README.TXT is older than all of it: its ticket is TICKET #0.

    // THE ENCORE (part 14.4): the four bosses again, back to back, on one clock. Their own intros and outros are left out, so these carry the encore.
    Q.defScript('encore-start', [   // before the first fight
      { who: 'facil', text: 'THE ENCORE! ALL FOUR BOSSES, BACK TO BACK, ON ONE CLOCK. A HEART BACK BETWEEN FIGHTS. THEY ASKED FOR THIS. ALL FOUR.' },
      { who: 'creep', text: 'IT WAS MY IDEA. IT STARTED SMALL.' },
      { who: 'hero', text: '> TAKE TWO.' }
    ]);
    Q.defScript('encore-next', [   // between fights: it plays three times, so one short box
      { who: 'facil', text: 'ONE HEART BACK, ON THE HOUSE. THE CLOCK IS STILL RUNNING. NEXT!' }
    ]);
    Q.defScript('encore-over', [   // every game over in the encore: that fight again with full hearts, the clock still going
      { who: 'facil', text: 'SAME FIGHT, FULL HEARTS. THE CLOCK KEPT RUNNING, BECAUSE THAT IS ALL A CLOCK KNOWS HOW TO DO.' },
      { who: 'hero', text: '> ANOTHER TAKE.' }
    ]);
    Q.defScript('encore-won', [   // after the last fight, before the 'encore' scene shows the time
      { who: 'facil', text: 'THAT\'S THE ENCORE. ALL FOUR, BACK TO BACK. THE BOSSES WANT YOU TO KNOW THEY WERE GOING EASY ON YOU.' },
      { who: 'creep', text: 'WE WERE NOT. QUICK ASK: SAME TIME TOMORROW?' }
    ]);

    // THE ROOT FOLDER (part 14.6): under all four worlds, the folder they started in. Never hinted at before it opens.
    Q.defScript('root-start', [   // the first arrival in the root folder
      { who: 'none', text: 'BELOW THE INBOX, THE SERVER ROOM, THE CLOUD AND THE BACKLOG: THE FOLDER THEY ALL STARTED IN. IT IS QUIET. IT IS OLD.' },
      { who: 'facil', text: 'THE ROOT FOLDER. I STARTED ON THE 9F COMPUTER\'S SECOND DAY. WHATEVER HAPPENED ON THE FIRST ONE IS DOWN HERE.' },
      { who: 'hero', text: '> GOING DOWN.' }
    ]);
    Q.defScript('root-1', [   // OLD MAIL
      { who: 'facil', text: 'OLD MAIL. THE FIRST EMAILS THIS COMPUTER EVER GOT. MOSTLY THE SAME ONE: TEST. TEST. CAN ANYONE SEE THIS?' },
      { who: 'hero', text: '> YES. I CAN SEE IT.' }
    ]);
    Q.defScript('root-2', [   // OLD RACKS
      { who: 'facil', text: 'OLD RACKS. THE VERY FIRST SERVER IS STILL IN HERE, RUNNING SOMETHING. NOBODY KNOWS WHAT. NOBODY DARES UNPLUG IT.' }
    ]);
    Q.defScript('root-3', [   // OLD CLOUDS
      { who: 'facil', text: 'OLD CLOUDS. THE FIRST THINGS THIS COMPUTER EVER UPLOADED. EVERY SINGLE ONE OF THEM IS STILL AT 99%.' }
    ]);
    Q.defScript('root-4', [   // OLD TICKETS: TICKET #0 is the README's, older than SCOPE CREEP's #1, and it sets up root-5
      { who: 'facil', text: 'OLD TICKETS. AND HERE IS ONE OLDER THAN SCOPE CREEP: TICKET #0. READ THE README. OPEN SINCE THE FIRST DAY.' },
      { who: 'hero', text: '> TAKING IT.' }
    ]);
    // README.TXT, the payoff of the whole post-game: the first file on the 9F computer, which nobody ever read. Its rule three is what TICKET #1 wanted
    // all along (m4-3b: NOBODY EVER SAID DONE), and the conductor's DONE in w4-won kept it without knowing. Rule one is the conductor's own line.
    Q.defScript('root-readme', [
      { who: 'none', text: 'README.TXT. THE FIRST FILE EVER SAVED ON THE 9F COMPUTER, ON ITS VERY FIRST DAY. TIMES OPENED: 0.' },
      { who: 'none', text: 'HELLO, WHOEVER KEEPS TIME IN HERE. THIS IS A SMALL COMPUTER, AND PEOPLE WILL ASK IT FOR A LOT. HERE IS ALL YOU NEED.' },
      { who: 'none', text: 'ONE: KEEP TIME. TWO: LOOK AFTER EACH OTHER. THREE: WHEN A THING IS DONE, SAY DONE. EVERYTHING ELSE CAN WAIT.' },
      { who: 'none', text: 'THAT IS THE WHOLE README. P.S. THE CAT IS STAYING. P.P.S. THE TWO BOXES IN THE CORNER ARE A SURPRISE. NO PEEKING.' },
      { who: 'facil', text: 'RULE THREE. IF ANYONE HAD READ RULE THREE, SCOPE CREEP WOULD STILL BE ONE SMALL TICKET. TO BE FAIR, NOBODY READS THE README.' }
    ]);
    Q.defScript('root-won', [   // Q.rootDone(): the count goes up, and the conductor's line turns out to be rule one
      { who: 'none', text: 'README.TXT. TIMES OPENED: 1.' },
      { who: 'hero', text: '> RULE ONE. KEEPING TIME.' }
    ]);

    // All 32 gold stars (part 14.2): the map plays this once. Overtime is over.
    Q.defScript('stars-all', [
      { who: 'c1', text: 'THAT\'S ALL 32! EVERY GOLD STAR! I\'D HUG YOU, BUT I\'M TYPING. I\'M ALWAYS TYPING.' },
      { who: 'c2', text: 'AH... ALL OF THEM. SO... THE BOARD IS... CLEAR. I\'VE NEVER SEEN... A CLEAR BOARD. IT\'S... BEAUTIFUL.' },
      { who: 'c3', text: 'ALL OF THEM. GOOD WORK.' },
      { who: 'facil', text: 'THAT IS EVERY STAR THERE IS. OVERTIME IS OVER. PLEASE GO HOME AND SLEEP. THE COMPUTER WILL STILL BE HERE TOMORROW.' },
      { who: 'hero', text: '> CLOCKING OUT.' }
    ]);

    // HOLD MUSIC (part 14.5): the first time the codex's jukebox opens. Up and Down choose, A plays, B stops it and goes back.
    Q.defScript('hold-music', [
      { who: 'facil', text: 'THANK YOU FOR HOLDING. YOUR CALL IS IMPORTANT TO US. WHILE YOU WAIT, HERE IS EVERY SONG ON THE 9F COMPUTER.' },
      { who: 'facil', text: 'UP AND DOWN TO CHOOSE, A TO PLAY, B TO HANG UP. THERE IS NO CALL. THERE WAS NEVER A CALL. ENJOY.' }
    ]);
