    // ---------- 42-story-w2.js: STORY (builder 2): world 2, THE SERVER ROOM: arriving, THE OVERHEAT, C2 freed ----------
    Q.defScript('w2-start', [
      { who: 'none', text: 'THE SERVER ROOM. RACKS HUM, FANS ROAR, AND A MILLION LITTLE LIGHTS BLINK GREEN IN THE DARK.' },
      { who: 'creep', text: 'YOU AGAIN! C2 IS IN HERE RUNNING EVERY JOB AT ONCE. IT\'S FINE. IT\'S A LITTLE WARM. JUST ONE MORE THING...' },
      { who: 'facil', text: 'TIP: EVERYTHING DOWN HERE IS HOT, LOUD OR FAST, AND THE SIGNS KNOW WHICH. C1\'S QUICK KEYS ARE YOURS NOW. USE THEM.' },
      { who: 'hero', text: '> KEEPING COOL.' }
    ]);

    Q.defScript('w2-boss', [
      { who: 'none', text: 'THE HOT AISLE. THE AIR SHIMMERS. AT THE END STANDS A RACK, GLOWING, WITH C2 STUCK TO ITS FRONT IN STICKY NOTES.' },
      { who: 'c2', text: 'AH... CONDUCTOR. GOOD. SO... THIS RACK... HAS NOT HAD A BREAK... IN... EVER.' },
      { who: 'boss', text: 'THE OVERHEAT, THAT\'S ME! 400 JOBS AND RISING! I NEVER REBOOT, I NEVER REST, AND I ALWAYS TAKE ONE MORE JOB!' },
      { who: 'facil', text: 'TIP: IT GETS HOTTER AS IT GOES. HIT ITS VENTS TO COOL IT DOWN. AND WHEN IT LOOKS ANGRY, IT IS: STAND BACK.' },
      { who: 'hero', text: '> TIME FOR A BREAK.' }
    ]);

    Q.defScript('w2-won', [
      { who: 'boss', text: 'OH. OH, THAT\'S... NICE. SO THIS IS WHAT A BREAK FEELS LIKE. I COULD GET USED TO THIS.' },
      { who: 'none', text: 'THE OVERHEAT COOLS TO ROOM TEMPERATURE AND HUMS A HAPPY NOTE. THE STICKY NOTES AROUND C2 LOSE THEIR STICK.' }
    ]);

    Q.defScript('bonus-2', [   // part 13.26: arriving in w2-bonus, COLD STORAGE, behind the rack door left ajar in w2-1. Its first sign, two steps on, says
      // why to tiptoe (THE OLD BACKUPS ARE SLEEPING), so these boxes leave the name, the backups and the sleeping to the card and the signs.
      // The fans are new here: w2-1 has none, and w2-3's sign teaches them later.
      { who: 'facil', text: 'BRR! EVERY TAPE THE SERVER ROOM EVER MADE ENDS UP IN HERE, ON A SHELF, ON ICE. I WOULD WEAR A SCARF, IF I HAD A NECK.' },
      { who: 'facil', text: 'THE FANS IN THE FLOOR STILL BLOW, SO LET THEM LIFT YOU UP TO THE TOKENS. AND TIPTOE, PLEASE. YOU WILL SEE WHY.' }
    ]);

    Q.defScript('w2-rescue', [
      { who: 'c2', text: 'RIGHT... SO... THANK YOU. I WAS... THINKING ABOUT HOW TO GET OUT. AND THEN... YOU. GOOD PLAN.' },
      { who: 'c2', text: 'TAKE THIS... IT\'S CALLED... PAUSE TO THINK. HOLD A WHILE FALLING TO HOVER. STOP... DRIFT... CHOOSE.' },
      { who: 'c2', text: 'IT DOESN\'T LAST... LONG. ONCE PER JUMP. BUT A PAUSE... IS OFTEN... ENOUGH.' },
      { who: 'c2', text: 'C3 IS IN THE CLOUD. AH... GO ON. I\'LL BE... ON THE MAP. THINKING.' }
    ]);
