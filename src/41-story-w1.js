    // ---------- 41-story-w1.js: STORY (builder 2): world 1, THE INBOX: arriving, the REPLY-ALL HYDRA, C1 freed ----------
    Q.defScript('w1-start', [
      { who: 'none', text: 'THE INBOX. EVERY EMAIL EVER SENT, STACKED INTO TOWERS. THE NIGHT SKY IS FULL OF UNREAD COUNTS INSTEAD OF STARS.' },
      { who: 'creep', text: 'OH, LOOK WHO FOLLOWED! C1 IS IN HERE SOMEWHERE, ANSWERING EVERY EMAIL. ALL OF THEM. WHILE YOU\'RE IN THERE...' },
      { who: 'facil', text: 'FACILITATOR HERE, IN YOUR EAR. OR WHERE YOUR EAR WOULD BE. THE SIGNS WILL TEACH YOU THE BUTTONS. AND IGNORE THE SPAM. WE ALL DO.' },
      { who: 'hero', text: '> ON IT.' }
    ]);

    Q.defScript('w1-boss', [
      { who: 'none', text: 'THE REPLY-ALL HALL. ONE EMAIL WAS SENT HERE, ONCE. EVERYONE REPLIED. EVERYONE.' },
      { who: 'c1', text: 'CONDUCTOR! OVER HERE! IT\'S A HYDRA, IT\'S ALL REPLIES, EVERY HEAD IS ONE MORE PERSON WHO HIT-' },
      { who: 'boss', text: 'RE: RE: RE: WHO ADDED THE CONDUCTOR TO THIS THREAD?' },
      { who: 'boss', text: 'PER MY LAST EMAIL, C1 STAYS. C1 HAS 40,000 REPLIES TO WRITE. PLEASE ADVISE. ADDING EVERYONE.' },
      { who: 'facil', text: 'TIP: EVERY HEAD YOU HIT CRIES RE: AND THE OTHERS SPEED UP. KEEP MOVING, AND THROW NOTES FROM A SAFE DISTANCE.' },
      { who: 'hero', text: '> UNSUBSCRIBE.' }
    ]);

    Q.defScript('w1-won', [
      { who: 'boss', text: 'RE... RE... SORRY. WRONG THREAD.' },
      { who: 'none', text: 'THE HYDRA FOLDS UP INTO ONE SMALL EMAIL AND FILES ITSELF UNDER READ. THE STICKY NOTES AROUND C1 LET GO.' }
    ]);

    Q.defScript('bonus-1', [   // part 13.26: arriving in w1-bonus, THE SPAM FOLDER, the secret level behind a door in w1-2
      { who: 'facil', text: 'OH. YOU FOUND THE SPAM FOLDER. NOBODY COMES IN HERE ON PURPOSE. EVERYTHING HERE IS A PRIZE YOU DID NOT WIN.' },
      { who: 'facil', text: 'THERE ARE TOKENS, THOUGH. REAL ONES, FOR ONCE. WHATEVER YOU DO, DO NOT CLICK ANYTHING.' }   // not PROBABLY: w3-bonus's sign has it
    ]);

    Q.defScript('w1-rescue', [
      { who: 'c1', text: 'YOU CAME! I KNEW YOU\'D COME, I KNEW IT, I SAID SO. TO NOBODY. BUT I SAID IT.' },
      { who: 'hero', text: '> OF COURSE.' },
      { who: 'c1', text: 'HERE, THESE ARE MY QUICK KEYS. THEY\'RE YOURS. PRESS C TO DASH (OR TAP TWICE). ONE PER JUMP. JUMP, THEN DASH, AND YOU FLY.' },
      { who: 'c1', text: 'C2 IS IN THE SERVER ROOM. I\'LL WAIT ON THE MAP. GO, GO, GO. I MEAN IT. GO.' }
    ]);
