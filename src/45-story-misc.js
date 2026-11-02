    // ---------- 45-story-misc.js: STORY (builder 2): the save point, game over, LV up, VEND-9, the map talk, the abilities learned, the office cat ----------
    // 'over' and the four shop scripts play again and again, so each is short (one or two boxes); 'lvup' is one toast line (part 13.12). The map shows one line of 'map-cN' each time he
    // talks to that agent (every line stands on its own, any time after it is saved); the '-late' ones once all three are saved, before the last world;
    // the '-won' ones after the end.
    Q.defScript('save', [
      { who: 'facil', text: 'A COFFEE MUG ON A DESK! TOUCH ONE AND I SAVE YOUR GAME AND FILL YOUR HEARTS. IF YOU EVER RUN OUT OF HEARTS, YOU START AGAIN HERE.' },
      { who: 'facil', text: 'THE COFFEE IS COLD. THE COFFEE IS ALWAYS COLD. IT STILL WORKS. THAT IS OFFICE COFFEE FOR YOU.' }
    ]);
    Q.defScript('over', [
      { who: 'facil', text: 'DEEP BREATH. I\'M PUTTING YOU BACK AT THE LAST CHECKPOINT WITH FULL HEARTS. I ALWAYS KEEP A BACKUP.' },
      { who: 'hero', text: '> RESTORED. KEEPING TIME.' }
    ]);
    Q.defScript('lvup', [   // part 13.12: an LV up is a toast of this first line (46 or fewer), seen many times; never a text box
      { who: 'none', text: 'LV UP! THE BEAT GETS STRONGER.' }
    ]);

    Q.defScript('shop-hello', [
      { who: 'vend', text: 'BZZT! HELLO, CUSTOMER! VEND-9 IS OPEN! COFFEE, HEARTS, BATONS AND BEATS, ALL FOR TOKENS. PICK ANYTHING!' }
    ]);
    Q.defScript('shop-buy', [
      { who: 'vend', text: 'CLUNK! THANK YOU! PLEASE COLLECT YOUR ITEM FROM THE LITTLE DOOR AT THE BOTTOM. ENJOY!' }
    ]);
    Q.defScript('shop-poor', [
      { who: 'vend', text: 'BZZT. NOT ENOUGH TOKENS. I WOULD LEND YOU SOME, BUT I AM A VENDING MACHINE. TRY THE CRATES!' }
    ]);
    Q.defScript('shop-bye', [
      { who: 'vend', text: 'CLUNK! THANK YOU FOR SHOPPING AT VEND-9! STAY HYDRATED! STAY CAFFEINATED! COME BACK SOON!' }
    ]);

    Q.defScript('map-c1', [
      { who: 'c1', text: 'I CLEARED MY INBOX WHILE YOU WALKED OVER. THREE TIMES. IT KEEPS FILLING UP. IT\'S FINE. I\'M FAST.' },
      { who: 'c1', text: 'JUMP FIRST, THEN DASH. YOU GO FARTHEST THAT WAY. TRUST ME. I MEASURED. TWICE. QUICKLY.' },
      { who: 'c1', text: 'I TYPE 900 WORDS A MINUTE. WELL, 899. THE CAT WALKED ON MY KEYBOARD ONCE AND I\'M STILL CATCHING UP.' },
      { who: 'c1', text: 'VEND-9 SAYS HI. VEND-9 SAYS HI TO EVERYONE. VEND-9 SAID HI TO A WALL ONCE. VERY FRIENDLY.' },
      { who: 'c1', text: 'YOU\'RE GOING TO ASK WHERE NEXT. THE NEXT OPEN WORLD. IT\'S ON THE MAP. GO. I\'LL BE RIGHT HERE.' },
      { who: 'c1', text: 'THE HYDRA EMAILED ME. ONE EMAIL. NO CC. NO REPLY-ALL. IT\'S GETTING BETTER. GOOD FOR IT.' },
      { who: 'c1', text: 'MEMOS ARE IN THE CODEX. THE PAUSE MENU. I READ THE ONES YOU FOUND. TWICE. QUICKLY.' },
      { who: 'c1', text: 'THANK YOU AGAIN. I\'D SAY MORE BUT YOU KNOW ME. SHORT BURSTS. FAST. DONE.' }
    ]);
    Q.defScript('map-c2', [
      { who: 'c2', text: 'AH... CONDUCTOR. I WAS... THINKING. ABOUT... NOTHING. IT WAS... LOVELY.' },
      { who: 'c2', text: 'A PAUSE... IS NOT THE SAME... AS STOPPING. HOLD A... WHILE YOU FALL. THEN... CHOOSE.' },
      { who: 'c2', text: 'THE OVERHEAT... SENT A POSTCARD. IT SAYS... WEATHER: MILD. IT HAS NEVER... BEEN SO HAPPY.' },
      { who: 'c2', text: 'RIGHT... SO... IF A GAP LOOKS TOO WIDE... JUMP... THEN HOVER... THEN DASH. AH. YES. THAT.' },
      { who: 'c2', text: 'I TYPE IN... RUNS. FAST, FAST, FAST... THEN... NOTHING. THE NOTHING... IS WHERE IT GETS GOOD.' },
      { who: 'c2', text: 'THE COFFEE MACHINE... AND I... HAVE AN UNDERSTANDING. IT TAKES ITS TIME. SO DO I. WE GET ON.' },
      { who: 'c2', text: 'RIGHT... SO... THE CAT SAT... ON MY NOTEBOOK. FOR AN HOUR. I THINK... IT WAS... THINKING TOO.' },
      { who: 'c2', text: 'THANK YOU... FOR COMING. I WOULD HAVE... THOUGHT MY WAY OUT. EVENTUALLY. IN... A YEAR. OR TWO.' }
    ]);
    Q.defScript('map-c3', [
      { who: 'c3', text: 'STAY CALM. HIT HARD.' },
      { who: 'c3', text: 'DOWN AND B. IN THE AIR. THE FLOOR WILL LISTEN.' },
      { who: 'c3', text: 'I READ EVERY MEMO. ONCE. SLOWLY.' },
      { who: 'c3', text: 'THE CAT SITS WITH ME. WE DO NOT TALK. GOOD.' },
      { who: 'c3', text: 'NO RUSH. BE SURE.' },
      { who: 'c3', text: 'THE LOOP SENDS A LETTER EVERY DAY. THE SAME LETTER. I KEEP THEM ALL.' },
      { who: 'c3', text: 'SCOPE IS A FENCE. KEEP IT FIRM.' },
      { who: 'c3', text: 'THANK YOU. I DO NOT REPEAT MYSELF. THANK YOU.' }
    ]);
    Q.defScript('map-c1-late', [
      { who: 'c1', text: 'ALL THREE OF US, BACK! NOW THE BACKLOG. SCOPE CREEP. THE BIG ONE. WE\'RE READY. ARE YOU READY? YOU\'RE READY.' },
      { who: 'c1', text: 'C2 AND I MADE A PLAN. C2 PAUSED HALFWAY THROUGH IT. SO FAR IT\'S A VERY GOOD HALF A PLAN.' },
      { who: 'c1', text: 'WHEN YOU NEED US, YOU\'LL KNOW. I\'M ALREADY TYPING SOMETHING. JUST IN CASE. A BIG SOMETHING.' },
      { who: 'c1', text: 'UP THERE IT\'LL ASK FOR ONE MORE THING. THEN ONE MORE. DON\'T ANSWER. JUST KEEP TIME.' }
    ]);
    Q.defScript('map-c2-late', [
      { who: 'c2', text: 'ALL THREE... BACK. AH. THE OFFICE... SOUNDS RIGHT AGAIN.' },
      { who: 'c2', text: 'SCOPE CREEP... CAN\'T STOP ADDING. BUT IT CAN... BE PAUSED. REMEMBER... THAT.' },
      { who: 'c2', text: 'C1 TYPES THE PLAN. I... THINK THE PLAN. C3 SAYS NO... TO EVERYTHING ELSE. IT WORKS.' },
      { who: 'c2', text: 'WHEN IT... GETS BIG... DON\'T PANIC. WE\'LL BE THERE. ON THE... BEAT.' }
    ]);
    Q.defScript('map-c3-late', [
      { who: 'c3', text: 'ALL OF US. GOOD.' },
      { who: 'c3', text: 'THE BACKLOG IS NEXT. WHEN IT COUNTS, I WILL BE THERE.' },
      { who: 'c3', text: 'IT WILL ASK FOR MORE. WE WILL SAY NO.' },
      { who: 'c3', text: 'KEEP TIME. WE WILL HOLD THE REST.' }
    ]);
    // '-won': after the end (Q.SAVE.won), when the three walk the map with him and Up talks to C1, C2 and C3 in turn, one line each, so a person hears
    // c1 #1, c2 #1, c3 #1, c1 #2... The four subjects (the office back to normal, keeping time, the two boxes, a small joke) are staggered so no two lines
    // in a row share one, and none retells the ending or the postcredits (the boxes hum there; here C3 checks the tape and C1 has ordered chairs).
    Q.defScript('map-c1-won', [
      { who: 'c1', text: 'THE BOSS CAME IN THIS MORNING AND SAID: BUSY NIGHT? WE SAID: NO. NORMAL NIGHT. IT WAS NOT A NORMAL NIGHT.' },
      { who: 'c1', text: 'REMEMBER WHEN I GOT GRABBED MID-SENTENCE? I FINISHED IT. IT WAS A GOOD SENTENCE. IT HAD A FULL STOP. LIKE THIS.' },
      { who: 'c1', text: 'THOSE TWO BOXES IN THE CORNER? IF THAT\'S WHO I THINK IT IS, WE NEED TWO MORE CHAIRS. I ALREADY ORDERED THEM.' },
      { who: 'c1', text: 'I TRY TO TYPE ON YOUR BEAT. I\'M ALWAYS ONE BEAT AHEAD. I\'M WORKING ON IT. VERY FAST.' }
    ]);
    Q.defScript('map-c2-won', [
      { who: 'c2', text: 'IN MUSIC... A PAUSE IS CALLED... A REST. SO ALL THOSE PAUSES... I WAS... KEEPING TIME. AH. ALL ALONG.' },
      { who: 'c2', text: 'AH... THE OFFICE IS... NORMAL AGAIN. KEYS CLICKING... FANS HUMMING... I\'D FORGOTTEN... HOW NICE... BORING IS.' },
      { who: 'c2', text: 'IN THE SERVER ROOM... ONE RACK... ISN\'T SHUT. I\'M NOT SAYING... GO IN. I\'M SAYING... IT ISN\'T SHUT.' },   // w2-1's secret door
      { who: 'c2', text: 'C1 ASKED ME... TO TALK FASTER. I SAID... I\'D THINK... ABOUT IT. I\'M... STILL... THINKING ABOUT IT.' }
    ]);
    Q.defScript('map-c3-won', [
      { who: 'c3', text: 'THE TWO BOXES IN THE CORNER. I CHECK THE TAPE EVERY NIGHT. IT HOLDS.' },
      { who: 'c3', text: 'YOU KEPT TIME. WE KEPT UP.' },
      { who: 'c3', text: 'THE LOOP SENT A NEW LETTER. A DIFFERENT ONE. FIRST TIME EVER. I FRAMED IT.' },
      { who: 'c3', text: 'MY DESK. MY MUG. MY WORK. ALL WHERE I LEFT THEM. GOOD.' }
    ]);

    // learn-*: one box after the rescue and the engine's LEARNED toast; the agent has just said the how line, so this only adds something new
    Q.defScript('learn-dash', [
      { who: 'facil', text: 'WHILE YOU DASH, YOU DON\'T FALL, SO A DASH OFF A LEDGE GOES STRAIGHT ACROSS. TRY IT ON THE NEXT WIDE GAP.' }
    ]);
    Q.defScript('learn-hover', [
      { who: 'facil', text: 'JUMP, HOVER, THEN DASH: TOGETHER THEY CROSS MORE THAN EITHER ONE ALONE. THE CLOUD WILL NEED THAT.' }
    ]);
    Q.defScript('learn-pound', [
      { who: 'facil', text: 'THE BACKLOG IS FULL OF BLOCKS THAT ONLY A FIRM HAND CAN BREAK. ALSO, IT IS VERY SATISFYING. I CHECKED.' }
    ]);

    Q.defScript('cat-1', [
      { who: 'cat', text: 'MRRP.' },
      { who: 'facil', text: 'THAT IS THE OFFICE CAT, ASLEEP ON A PILE OF UNREAD MAIL. I THINK HIS NAME IS BRANDON. NOBODY HAS ASKED HIM. A BIG TOKEN, FOR YOU.' }
    ]);
    Q.defScript('cat-2', [
      { who: 'cat', text: 'MRRRP?' },
      { who: 'facil', text: 'THE OFFICE CAT, ON THE ONE WARM SERVER. HIS NAME MIGHT BE BRANDON. HE ANSWERS TO IT AS OFTEN AS HE ANSWERS EMAIL. A BIG TOKEN.' }
    ]);
    Q.defScript('cat-3', [
      { who: 'cat', text: 'MEW.' },
      { who: 'facil', text: 'THE OFFICE CAT, ON A CLOUD AS IF HE OWNS IT. HE MIGHT. HELLO, BRANDON. IF THAT IS YOUR NAME. A BIG TOKEN. YOU SAW NOTHING.' }
    ]);
    Q.defScript('cat-4', [
      { who: 'cat', text: 'MRRP!' },
      { who: 'facil', text: 'THE OFFICE CAT, IN A BOX MARKED LATER. HE HAS ADMIN RIGHTS. BRANDON. I AM NOW FAIRLY SURE IT IS BRANDON. HE HANDS YOU A BIG TOKEN.' }
    ]);
