    // ---------- 31-audio-sfx.js: every sound in the game (AUDIO, builder 4): short, quiet (each part 0.02 to 0.06), chiptune, each easy to tell apart ----------
    // Q.sfx(id) plays one (30-audio-engine.js). The ids are QUEST-API.md part 8's, then a few more of our own at the end (meow, roar, reply, shield, still, firm,
    // tick, clunk, warp, drop). Each is api.tone(f0, f1, seconds, wave, volume, at) and api.noise(seconds, f0, f1, filter, q, volume, at) and nothing else.
    var AU_PENTA = [783.99, 880, 1046.5, 1174.66, 1318.51, 1174.66, 1046.5, 880];   // the thrown notes walk up and down G A C D E: throwing makes a little tune
    var AU_LEARN = [587.33, 739.99, 880, 1174.66, 1479.98, 1760];                    // D F# A D F# A
    // the conductor's body
    Q.defSfx('jump', function (api) { api.tone(280, 560, 0.1, 'square', 0.035); });                                         // a rising chirp
    Q.defSfx('land', function (api) { api.tone(130, 70, 0.06, 'triangle', 0.06); api.noise(0.05, 700, 250, 'lowpass', 1, 0.04); });   // a soft thud
    Q.defSfx('swing', function (api) { api.noise(0.12, 800, 3200, 'bandpass', 0.7, 0.06); api.tone(520, 360, 0.06, 'triangle', 0.05); });   // a whoosh
    Q.defSfx('hit', function (api) { api.tone(440, 160, 0.07, 'square', 0.04); api.noise(0.05, 2600, 900, 'bandpass', 1, 0.04); });   // a thwack
    Q.defSfx('kill', function (api) {   // a pop, then a chirp up
      api.noise(0.09, 3500, 700, 'bandpass', 0.8, 0.05); api.tone(660, 1320, 0.06, 'square', 0.035, 0.03); api.tone(990, 1980, 0.09, 'square', 0.03, 0.08);
    });
    Q.defSfx('hurt', function (api) {   // an ouch, falling
      api.tone(600, 170, 0.22, 'sawtooth', 0.04); api.tone(300, 90, 0.2, 'square', 0.025, 0.02); api.noise(0.12, 1500, 400, 'bandpass', 1, 0.03);
    });
    Q.defSfx('charge', function (api) { api.tone(330, 990, 0.2, 'triangle', 0.035); api.tone(495, 1485, 0.2, 'square', 0.02, 0.05); });   // the baton glows: a rising shine
    Q.defSfx('note', function (api, Q) {   // a thrown note: the next note of a little pentatonic walk, with its fifth
      var f = AU_PENTA[Q.au.noteN++ % AU_PENTA.length];
      api.tone(f, f, 0.12, 'square', 0.03); api.tone(f * 1.5, f * 1.5, 0.1, 'triangle', 0.02, 0.03);
    });
    Q.defSfx('dash', function (api) {   // QUICK KEYS: two key taps and a whoosh
      api.noise(0.014, 3600, 3000, 'bandpass', 4, 0.035); api.noise(0.014, 3400, 2800, 'bandpass', 4, 0.03, 0.03);
      api.noise(0.16, 1200, 6000, 'bandpass', 1.2, 0.055, 0.02); api.tone(240, 720, 0.12, 'square', 0.03, 0.02);
    });
    Q.defSfx('hover', function (api) { api.tone(523.25, 587.33, 0.35, 'sine', 0.04); api.tone(784, 740, 0.35, 'triangle', 0.02, 0.06); });   // PAUSE TO THINK: a soft hmm
    Q.defSfx('drop', function (api) { api.tone(1100, 280, 0.14, 'square', 0.025); });   // FIRM HAND starting: the stop in the air, then the dive
    Q.defSfx('pound', function (api) {   // FIRM HAND landing: the big thud that shakes the ground
      api.tone(170, 40, 0.28, 'triangle', 0.06); api.noise(0.3, 900, 90, 'lowpass', 1, 0.05); api.tone(110, 50, 0.22, 'square', 0.025, 0.01);
    });
    // things he finds
    Q.defSfx('token', function (api) {   // ti-ti-ting, quick and high (D F# A)
      api.tone(1174.66, 1174.66, 0.04, 'square', 0.03); api.tone(1479.98, 1479.98, 0.04, 'square', 0.03, 0.035); api.tone(1760, 1760, 0.09, 'triangle', 0.04, 0.07);
    });
    Q.defSfx('heart', function (api) {   // warm and round (C G C)
      api.tone(523.25, 523.25, 0.08, 'triangle', 0.045); api.tone(783.99, 783.99, 0.08, 'triangle', 0.045, 0.07); api.tone(1046.5, 1046.5, 0.18, 'triangle', 0.05, 0.14);
    });
    Q.defSfx('memo', function (api) {   // a page turned, and a small bell
      api.noise(0.09, 1800, 4200, 'bandpass', 1, 0.03); api.tone(880, 880, 0.25, 'sine', 0.045, 0.05); api.tone(1318.51, 1318.51, 0.3, 'sine', 0.03, 0.12);
    });
    Q.defSfx('break', function (api) {   // a crate: a crunch and bits falling
      api.noise(0.16, 3200, 500, 'bandpass', 0.8, 0.05); api.tone(300, 110, 0.1, 'square', 0.03);
      api.noise(0.03, 2500, 2000, 'bandpass', 3, 0.025, 0.07); api.noise(0.03, 1800, 1500, 'bandpass', 3, 0.02, 0.12);
    });
    Q.defSfx('door', function (api) {   // into the exit: a rising swirl
      api.tone(262, 524, 0.22, 'triangle', 0.045); api.tone(392, 784, 0.22, 'square', 0.02, 0.06); api.noise(0.18, 400, 1600, 'bandpass', 1, 0.02);
    });
    Q.defSfx('save', function (api) {   // the coffee mug: a sip and a bright F chord climbing
      api.noise(0.1, 700, 1400, 'bandpass', 4, 0.02); api.tone(698.46, 698.46, 0.1, 'sine', 0.045, 0.06); api.tone(880, 880, 0.1, 'sine', 0.045, 0.14);
      api.tone(1046.5, 1046.5, 0.1, 'sine', 0.045, 0.22); api.tone(1396.91, 1396.91, 0.35, 'sine', 0.05, 0.3);
    });
    Q.defSfx('lvup', function (api) {   // a small fanfare: three quick, then two together, held
      api.tone(659.26, 659.26, 0.07, 'square', 0.035); api.tone(783.99, 783.99, 0.07, 'square', 0.035, 0.08); api.tone(1046.5, 1046.5, 0.07, 'square', 0.035, 0.16);
      api.tone(1046.5, 1046.5, 0.34, 'square', 0.04, 0.27); api.tone(1318.51, 1318.51, 0.34, 'triangle', 0.035, 0.27);
    });
    Q.defSfx('learn', function (api) {   // a new ability: six notes climbing, then a held shine
      for (var k = 0; k < AU_LEARN.length; k++) api.tone(AU_LEARN[k], AU_LEARN[k], 0.16, 'triangle', 0.035, k * 0.055);
      api.tone(1174.66, 1174.66, 0.5, 'sine', 0.04, 0.36); api.tone(1479.98, 1479.98, 0.5, 'sine', 0.03, 0.36);
    });
    // menus and the shop
    Q.defSfx('select', function (api) { api.tone(880, 880, 0.04, 'square', 0.03); api.tone(1318.51, 1318.51, 0.07, 'square', 0.03, 0.04); });   // two blips up
    Q.defSfx('move', function (api) { api.tone(740, 740, 0.045, 'square', 0.04); });                                                         // one small blip
    Q.defSfx('back', function (api) { api.tone(660, 440, 0.08, 'square', 0.03); });                                                       // a step down
    Q.defSfx('buy', function (api) {   // VEND-9: a can drops with a clunk, then the ching
      api.noise(0.08, 500, 150, 'lowpass', 1, 0.05); api.tone(120, 60, 0.1, 'triangle', 0.04);
      api.tone(1046.5, 1046.5, 0.05, 'square', 0.03, 0.12); api.tone(1567.98, 1567.98, 0.14, 'square', 0.03, 0.17);
    });
    Q.defSfx('nope', function (api) { api.tone(196, 185, 0.09, 'square', 0.035); api.tone(156, 147, 0.15, 'square', 0.035, 0.11); });   // two low buzzes
    Q.defSfx('type', function (api, Q) { var f = (Q.au.typeN++ & 1) ? 1180 : 1320; api.tone(f, f, 0.02, 'square', 0.03); });            // the text box typing
    // bosses
    Q.defSfx('bosshit', function (api) {   // heavier than a hit
      api.tone(320, 70, 0.16, 'square', 0.045); api.noise(0.16, 2400, 300, 'bandpass', 0.7, 0.05); api.tone(640, 220, 0.08, 'sawtooth', 0.025);
    });
    Q.defSfx('bossdie', function (api) {   // three bursts, a long fall, a last thump
      api.noise(0.45, 3000, 200, 'bandpass', 0.6, 0.05); api.noise(0.4, 2500, 150, 'bandpass', 0.6, 0.045, 0.3); api.noise(0.5, 2000, 100, 'bandpass', 0.6, 0.04, 0.65);
      api.tone(700, 55, 1.3, 'sawtooth', 0.035); api.tone(120, 40, 0.4, 'triangle', 0.06, 1.0);
    });
    Q.defSfx('roar', function (api) {   // a boss appears or turns: a low growl
      api.tone(110, 65, 0.7, 'sawtooth', 0.04); api.tone(165, 98, 0.7, 'square', 0.02); api.noise(0.7, 700, 150, 'bandpass', 0.7, 0.045);
    });
    Q.defSfx('reply', function (api) { api.tone(700, 640, 0.09, 'sawtooth', 0.045); api.tone(930, 860, 0.12, 'sawtooth', 0.045, 0.09); });   // the hydra's head cries RE:
    // the worlds' things
    Q.defSfx('spring', function (api) { api.tone(180, 760, 0.16, 'square', 0.035); api.tone(360, 1100, 0.14, 'triangle', 0.025, 0.04); });   // a boing
    Q.defSfx('zap', function (api) {   // a spark on a cable
      api.noise(0.12, 5200, 1800, 'bandpass', 2, 0.06); api.tone(1000, 300, 0.1, 'sawtooth', 0.035); api.tone(1400, 500, 0.07, 'square', 0.02, 0.04);
    });
    Q.defSfx('fan', function (api) { api.noise(0.4, 300, 1500, 'bandpass', 0.6, 0.04); api.tone(90, 120, 0.4, 'triangle', 0.025); });   // a gust upward (at most three a second)
    Q.defSfx('gate', function (api) {   // a rate limiter slams shut
      api.tone(220, 120, 0.12, 'square', 0.04); api.noise(0.1, 2600, 1600, 'bandpass', 3, 0.04); api.tone(165, 165, 0.08, 'triangle', 0.03, 0.03);
    });
    Q.defSfx('freeze', function (api) {   // a timeout's touch: tick, tock, and ice
      api.noise(0.02, 3000, 2800, 'bandpass', 5, 0.04); api.noise(0.02, 2200, 2000, 'bandpass', 5, 0.04, 0.12);
      api.tone(2093, 1046.5, 0.35, 'sine', 0.03, 0.05); api.tone(2637, 1318.51, 0.3, 'triangle', 0.02, 0.08);
    });
    // our own extras (not in QUEST-API.md yet): the cat, the agents' help in the last fight, the conductor's beat, VEND-9's thanks, the jump into the computer
    Q.defSfx('meow', function (api) { api.tone(620, 980, 0.09, 'triangle', 0.035); api.tone(980, 560, 0.22, 'triangle', 0.035, 0.09); });   // the office cat
    Q.defSfx('shield', function (api) {   // C1 types a shield: five quick even keys, then a chime
      for (var k = 0; k < 5; k++) api.noise(0.012, 3600 - k * 120, 3000 - k * 120, 'bandpass', 4, 0.03, k * 0.035);
      api.tone(1567.98, 1567.98, 0.3, 'sine', 0.04, 0.2); api.tone(2093, 2093, 0.3, 'sine', 0.025, 0.24);
    });
    Q.defSfx('still', function (api) {   // C2 pauses it: everything slows to a stop
      api.tone(880, 440, 0.25, 'sine', 0.04); api.tone(660, 330, 0.3, 'triangle', 0.025, 0.05); api.noise(0.3, 5000, 1000, 'bandpass', 2, 0.02);
    });
    Q.defSfx('firm', function (api) {   // C3 holds firm: one deep, steady note
      api.tone(98, 98, 0.5, 'triangle', 0.06); api.tone(147, 147, 0.5, 'square', 0.02); api.noise(0.2, 400, 100, 'lowpass', 1, 0.04);
    });
    Q.defSfx('tick', function (api) { api.noise(0.045, 2700, 2500, 'bandpass', 3, 0.06); api.tone(1500, 1400, 0.045, 'triangle', 0.06); });   // the conductor keeps time: a wood tick
    Q.defSfx('clunk', function (api) { api.noise(0.12, 380, 120, 'lowpass', 1, 0.05); api.tone(110, 55, 0.14, 'triangle', 0.05); });   // VEND-9 says thank you
    Q.defSfx('warp', function (api) {   // into the computer: a long rising sweep
      api.tone(180, 1800, 0.6, 'square', 0.025); api.tone(270, 2700, 0.6, 'triangle', 0.02, 0.05); api.noise(0.6, 400, 7000, 'bandpass', 1, 0.025);
    });

    // ---------- three more (for the engine and the UI): a level cleared at the door, a level's title card, a secret found ----------
    Q.defSfx('clear', function (api) {   // the conductor's motif, about 1 s: two baton taps on G, the leap up a fourth to C, then up through E to a held G over C
      api.noise(0.015, 3000, 2600, 'bandpass', 5, 0.03); api.tone(783.99, 783.99, 0.06, 'square', 0.035);
      api.noise(0.015, 3000, 2600, 'bandpass', 5, 0.03, 0.12); api.tone(783.99, 783.99, 0.06, 'square', 0.035, 0.12);
      api.tone(1046.5, 1046.5, 0.16, 'square', 0.04, 0.24); api.tone(1318.51, 1318.51, 0.12, 'square', 0.035, 0.42);
      api.tone(1567.98, 1567.98, 0.45, 'square', 0.035, 0.56); api.tone(1046.5, 1046.5, 0.45, 'triangle', 0.04, 0.56);
    });
    Q.defSfx('card', function (api) {   // a level's title card: a soft whoosh, two sweeps of air overlapping so it swells rather than snaps
      api.noise(0.3, 300, 1500, 'bandpass', 0.4, 0.055); api.noise(0.4, 900, 3600, 'bandpass', 0.35, 0.06, 0.1);
    });
    Q.defSfx('secret', function (api) {   // a hidden memo or the office cat: a small high sparkle (E G# B E running up) with a breath of glitter
      api.tone(1318.51, 1318.51, 0.08, 'triangle', 0.03); api.tone(1661.22, 1661.22, 0.08, 'triangle', 0.03, 0.04);
      api.tone(1975.53, 1975.53, 0.08, 'triangle', 0.03, 0.08); api.tone(2637.02, 2637.02, 0.2, 'sine', 0.03, 0.12);
      api.noise(0.15, 6000, 9000, 'highpass', 1, 0.02, 0.05);
    });

    // ---------- the text box's voices (QUEST-API.md part 13 item 18): each speaker's own blip, every part 0.02 to 0.04, with type's gap ----------
    // The UI plays Q.SFX['type-' + who] ? 'type-' + who : 'type' every few letters; narration ('none') keeps the plain 'type'.
    var AU_C2RUN = [587.33, 659.26, 739.99, 880, 987.77];   // C2 types in runs: D E F# A B, climbing while the run lasts, from the bottom after a pause
    Q.defSfx('type-hero', function (api) { api.tone(988, 988, 0.022, 'square', 0.03); });                                                      // a terminal beep, always the same
    Q.defSfx('type-c1', function (api) { api.noise(0.008, 4200, 3800, 'bandpass', 3, 0.04); api.tone(1568, 1568, 0.014, 'square', 0.034); });   // a crisp key: quick and even
    Q.defSfx('type-c2', function (api, Q) {   // in runs, a little lower
      var c = api.audio(), now = c ? c.currentTime : 0, A = Q.au;
      if (now - A.c2at > 0.15 || now < A.c2at) A.c2n = 0;
      A.c2at = now; api.tone(AU_C2RUN[A.c2n % AU_C2RUN.length], AU_C2RUN[A.c2n % AU_C2RUN.length], 0.02, 'square', 0.029); A.c2n++;
    });
    Q.defSfx('type-c3', function (api) { api.tone(262, 262, 0.045, 'triangle', 0.04); api.tone(131, 131, 0.04, 'square', 0.02); });            // low and firm
    Q.defSfx('type-facil', function (api, Q) { var f = (Q.au.typeN++ & 1) ? 784 : 659.26; api.tone(f, f, 0.04, 'sine', 0.035); });              // soft and warm
    Q.defSfx('type-creep', function (api, Q) { var k = Q.au.typeN++ % 3; api.noise(0.058, 2400 + k * 700, 3800 + k * 500, 'bandpass', 0.4, 0.04); api.noise(0.03, 1300 + k * 300, 2100, 'bandpass', 0.6, 0.03, 0.012); });   // a rustle of paper
    Q.defSfx('type-vend', function (api, Q) { var f = (Q.au.typeN++ & 1) ? 554.37 : 440; api.tone(f, f * 1.06, 0.04, 'sawtooth', 0.04); });     // a cheerful buzz
    Q.defSfx('type-cat', function (api) { api.tone(1500, 2100, 0.025, 'triangle', 0.033); });                                                   // a tiny chirp
    Q.defSfx('type-boss', function (api) { api.tone(150, 115, 0.055, 'sawtooth', 0.04); api.noise(0.035, 600, 300, 'lowpass', 1, 0.04); });     // gruff
