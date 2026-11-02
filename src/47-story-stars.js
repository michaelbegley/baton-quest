    // ---------- 47-story-stars.js: STORY (builder 2): the words for the 32 gold stars and the names of the songs in HOLD MUSIC (QUEST-API.md part 14.2, 14.5) ----------
    // A star: name (20 or fewer), how (92 or fewer, two lines of 46: the rule, with the rule's own number), won (46 or fewer: the joke, shown once won),
    // secret: true only on afk and root (the codex shows ??? until won). ENGINE writes the rules with Q.defStar; these are only the words.
    (function () {
    var STARS = [   // [id, name, how, won]
      ['onboarded', 'ONBOARDED', 'FINISH 1-1, THE LOBBY OF UNREAD.', 'WELCOME ABOARD. HERE IS YOUR LANYARD.'],
      ['c1', 'C1: DELIVERED', 'BEAT THE REPLY-ALL HYDRA AND FREE C1.', 'C1 IS TYPING YOU A THANK-YOU. IT IS LONG.'],
      ['c2', 'C2: BACK ONLINE', 'COOL DOWN THE OVERHEAT AND FREE C2.', 'C2 IS THINKING OF A THANK-YOU. ANY DAY NOW.'],
      ['c3', 'C3: SYNCED', 'BREAK THE INFINITE LOOP AND FREE C3.', 'C3 SAID THANK YOU. ONCE. IT MEANT IT.'],
      ['shipped', 'SHIPPED IT', 'FINISH THE GAME: TRIM SCOPE CREEP BACK TO ONE SMALL TICKET.', 'SHIPPED ON A FRIDAY. BRAVE.'],
      ['memos-1', 'READ RECEIPTS', 'FIND ALL SIX MEMOS IN THE INBOX.', 'YOU READ THE WHOLE THREAD. EVEN THE +1S.'],
      ['memos-2', 'READ THE LOGS', 'FIND ALL SIX MEMOS IN THE SERVER ROOM.', 'EVERY LOG READ. THE SERVERS FEEL SEEN.'],
      ['memos-3', 'HEAD IN THE CLOUDS', 'FIND ALL SIX MEMOS IN THE CLOUD.', 'ALL SIX, AND NOT ONE PASSWORD RESET.'],
      ['memos-4', 'BACKLOG GROOMER', 'FIND ALL SIX MEMOS IN THE BACKLOG.', 'YOU READ THE BACKLOG. ON PURPOSE. WOW.'],
      ['memos-all', 'FULL TRANSPARENCY', 'FIND ALL 24 MEMOS, SIX IN EACH WORLD.', 'YOU KNOW EVERYTHING NOW. PLEASE BE GENTLE.'],
      ['cat', 'CAT PERSON', 'FIND THE OFFICE CAT. IT HIDES IN EVERY WORLD.', 'THE CAT FOUND YOU. THAT IS HOW IT WORKS.'],
      ['cats', 'HERDED THE CATS', 'FIND THE OFFICE CAT IN ALL FOUR WORLDS.', 'ADD IT TO YOUR SKILLS: HERDS CATS.'],
      ['secrets', 'OFF THE BOOKS', 'FIND AND FINISH ALL FOUR SECRET LEVELS, ONE BEHIND A DOOR IN EACH WORLD.', 'YOU FOUND EVERY DOOR NOBODY WAS USING.'],
      ['clean-level', 'ZERO INCIDENTS', 'FINISH A LEVEL OF WORLD 2, 3 OR 4 WITHOUT TAKING A HIT. SECRET LEVELS DO NOT COUNT.', 'DAYS WITHOUT AN INCIDENT: 1.'],
      ['clean-boss', 'UNTOUCHABLE', 'BEAT A BOSS WITHOUT TAKING A HIT.', 'IT NEVER TOUCHED YOU. IT WANTS A REMATCH.'],
      ['no-fall', 'ZERO DOWNTIME', 'FINISH 3-3, THE SYNC STORM, WITHOUT FALLING OFF ONCE.', 'UPTIME: 100%. THE CLOUD IS IMPRESSED.'],
      ['par', 'ON SCHEDULE', 'FINISH ANY LEVEL AT OR UNDER ITS PAR TIME. SPRINT REVIEW, IN THE CODEX, LISTS EVERY PAR.', 'AHEAD OF SCHEDULE. PLEASE DO NOT TELL ANYONE.'],
      ['par-all', 'SPRINT CHAMPION', 'BEAT PAR ON ALL 16 LEVELS, BOSS FIGHTS TOO.', 'YOUR VELOCITY IS NOW A PLANNING PROBLEM.'],
      ['encore', 'BY POPULAR DEMAND', 'BEAT THE ENCORE: ALL FOUR BOSSES, BACK TO BACK.', 'THE CROWD GOES MILD. IT IS AN OFFICE.'],
      ['encore-clean', 'STANDING OVATION', 'BEAT THE ENCORE TAKING 3 HITS OR FEWER.', 'A STANDING OVATION, FROM ONE CAT.'],
      ['spam', 'SPAM FILTER', 'BEAT 25 SPAM IN ALL. REPLAYS COUNT.', '25 DOWN. 9,999,975 TO GO.'],
      ['dashes', 'RUSH JOB', 'DASH 200 TIMES IN ALL.', 'C1 HAS DASHED 201 TIMES. IT IS NOT A CONTEST.'],
      ['pounds', 'FIRM HANDSHAKE', 'POUND THE GROUND 50 TIMES IN ALL.', 'THE FLOOR HAS FILED A COMPLAINT.'],
      ['tokens', 'LUCKY SEVENS', 'PICK UP 777 TOKENS IN ALL.', 'PETTY CASH: NO LONGER PETTY.'],
      ['bowtie', 'DRESS CODE', 'BUY THE GOLD BOW TIE FROM VEND-9.', 'BUSINESS CASUAL? NO. BUSINESS FABULOUS.'],
      ['coffee', 'CAFFEINATED', 'BUY 5 COFFEES FROM VEND-9 IN ALL.', '5 COFFEES. ALL COLD. ALL WORTH IT.'],
      ['over', 'BACK IN A BEAT', 'RUN OUT OF HEARTS ONCE. IT HAPPENS TO US ALL.', 'FAILING FORWARD. THAT IS WHAT WE CALL IT.'],
      ['afk', 'AWAY FROM KEYBOARD', 'STAND STILL IN A LEVEL FOR A WHOLE MINUTE, TOUCHING NOTHING.', 'YOUR STATUS WENT YELLOW. NOBODY NOTICED.'],
      ['signs', 'READS THE SIGNS', 'STAND AT 50 DIFFERENT SIGNS AND READ THEM.', 'YOU READ THE TERMS AND CONDITIONS TOO?'],
      ['hold', 'PLEASE HOLD', 'PLAY EVERY SONG IN HOLD MUSIC, IN THE CODEX.', 'THE FIRST PERSON EVER TO ENJOY HOLD MUSIC.'],
      ['root', 'ROOT ACCESS', 'FIND THE ROOT FOLDER AND READ ITS FIRST FILE.', 'TICKET #0, READ THE README: DONE. AT LAST.'],
      ['all', 'STAR EMPLOYEE', 'WIN ALL 31 OTHER GOLD STARS.', 'EMPLOYEE OF THE MONTH. EVERY MONTH.']
    ];
    for (var i = 0; i < STARS.length; i++) {
      var s = STARS[i], d = { name: s[1], how: s[2], won: s[3] };
      if (s[0] === 'afk' || s[0] === 'root') d.secret = true;
      Q.defStarText(s[0], d);
    }
    })();

    // HOLD MUSIC (part 14.5) lists every song by these names, in this order: the way the game plays them, then the B-side and the two new ones.
    // A name is 24 or fewer, a note 46 or fewer. From AUDIO's notes on each song (3x-audio-songs-*.js). 'root' never names the root folder: HOLD MUSIC
    // lists it before the folder is found.
    Q.defTrack('title', { name: 'OVERTURE (PRESS START)', note: 'TWO BATON TAPS, THEN THE CONDUCTOR\'S THEME.' });
    Q.defTrack('map', { name: 'THE COMMUTE', note: 'THE MAP. LISTEN FOR THE LITTLE FOOTSTEPS.' });
    Q.defTrack('shop', { name: 'SMOOTH VENDING', note: 'VEND-9\'S LOUNGE JINGLE. IT ENDS WITH A CLUNK.' });
    Q.defTrack('w1', { name: 'UNREAD (99+)', note: 'THE INBOX, WITH A NEW-MAIL DING AT EACH HALF.' });
    Q.defTrack('boss-hydra', { name: 'RE: RE: RE: (REMIX)', note: 'THE REPLY-ALL HYDRA. EVERYONE IS ON CC.' });
    Q.defTrack('rescue', { name: 'THE RESCUE (RADIO EDIT)', note: 'ABOUT FIVE SECONDS. THE SHORTEST HIT WE HAVE.' });
    Q.defTrack('w2', { name: 'THE HUM (EXTENDED MIX)', note: 'THE SERVER ROOM. IT HUMS. IT ALWAYS HUMS.' });
    Q.defTrack('boss-overheat', { name: 'OVERHEAT (WARM-UP)', note: 'THE OVERHEAT, BEFORE IT GETS ANGRY.' });
    Q.defTrack('boss-overheat2', { name: 'OVERHEAT (MELTDOWN MIX)', note: 'THE SAME RACK, AFTER IT GETS ANGRY.' });
    Q.defTrack('w3', { name: 'SOMEONE ELSE\'S COMPUTER', note: 'THE CLOUD. SLOW BELLS AND A LITTLE WIND.' });
    Q.defTrack('boss-loop', { name: 'THE LOOP (AGAIN)', note: 'IT CLIMBS THREE TIMES AND ENDS UP HOME. AGAIN.' });
    Q.defTrack('boss-loop2', { name: 'THE LOOP (AGAIN, FASTER)', note: 'THE SAME, AT 256 BEATS A MINUTE. SORRY.' });
    Q.defTrack('w4', { name: 'DUE FRIDAY', note: 'THE BACKLOG. IT CLIMBS LIKE A DEADLINE.' });
    Q.defTrack('final', { name: 'QUICK ASK (MARCH)', note: 'SCOPE CREEP. IT GETS ONE NOTE LONGER EACH BAR.' });
    Q.defTrack('final2', { name: 'QUICK ASK (FOLLOW-UP)', note: 'THE SAME MARCH, WITH TICKETS PILING UP.' });
    Q.defTrack('final3', { name: 'QUICK ASK (ALL HANDS)', note: 'C1, C2 AND C3 JOIN IN, AND IT TURNS MAJOR.' });
    Q.defTrack('end', { name: 'MORNING ON THE NINTH', note: 'THE ENDING AND THE CREDITS. SLOW AND WARM.' });
    Q.defTrack('over', { name: 'A SHORT SIGH', note: 'THE GAME OVER. UNDER THREE SECONDS. CHIN UP.' });
    Q.defTrack('boss', { name: 'BOSS FIGHT (TEMPLATE)', note: 'THE SONG EVERY BOSS SONG IS BUILT ON.' });
    Q.defTrack('encore', { name: 'ENCORE (BACK TO BACK)', note: 'ALL FOUR BOSSES IN A ROW. NO PRESSURE.' });
    Q.defTrack('root', { name: 'THE OLD DAYS (MEDLEY)', note: 'A QUIET MEDLEY OF ALL FOUR WORLDS.' });
