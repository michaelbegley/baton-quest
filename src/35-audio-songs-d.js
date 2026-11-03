    // ---------- 35-audio-songs-d.js: SCOPE CREEP's third part, VEND-9's shop, the rescue, the end and game over (AUDIO, builder 14): 8-bit big band ----------
    function auType(a, b, c) { return Q.au.rep(a + ' ' + b + ' ' + c + ' ' + b, 4) + ' |'; }   // a bar of sixteenths on a chord (THE ENCORE's C1, a voice with sub: 2)

    // FINAL3, the agents join (Q.music('final3') when the third part starts: it takes over at the next bar, at the same place): the march turns D major and the
    // conductor's tune is his again: the question (D D G), then THE BATON in D major where 'final' had its minor face. C1 types a shield of quick even notes up
    // high (one key, every eighth), C2 runs up and down with long pauses between, C3 holds one firm note a bar; the kit keeps a note on every beat (the phase 3
    // ring, 84-w4-boss.js, follows this song's clock and its 138 bpm).
    var AU_F3_LEAD =
      ' D5 . D5 . G5 - - - | D5 . D5 . G5 - A5 - | D5 . D5 . G5 - A5 B5 | D5 . D5 . G5 A5 B5 C#6 |' + AU_SH(auCut(AU_BATON_A, 1, 4), 2) + AU_SH(auCut(AU_BATON_B, 1, 4), 2) +
      ' B4 . B4 . E5 - - F#5 | G5 - E5 - C#5 E5 - . | D5 - - - A4 - F#4 - | A4 - - - A4>A5 - - - |';
    var AU_F3_CH = 'G6 G6 G6 A7 D6 Bm7 Em7 A7 G6 G6 F#m7 B7 Em7 A7 D6 A7';   // the question's bars: G's notes over the D pedal
    var AU_F3_C2 = ' A5 B5 C#6 D6 E6 F#6 - . | . . . . . . . . | . . . . . . . . | F#6 E6 D6 C#6 B5 A5 - . | F#5 G5 A5 B5 C#6 D6 - . | . . . . . . . . | . . . . . . . . | . . . . E6 D6 C#6 A5 |' +
      ' B5 C#6 D6 E6 F#6 G6 - . | . . . . . . . . | . . . . . . . . | D#6 E6 F#6 G6 A6 - . . | G6 F#6 E6 D6 C#6 B5 - . | . . . . . . . . | . . . . . . . . | A5 B5 C#6 D6 E6 - . . |';
    Q.defSong('final3', { bpm: 138, swing: 0.32, join: 'final', vol: 0.82, voices: [
      { wave: 'square', vol: 0.02, gate: 0.75, notes: AU_F3_LEAD },
      { wave: 'triangle', vol: 0.034, gate: 0.85, notes: AU_FINAL_PED + auWalk(auSome(AU_F3_CH, 5, 16), 'D2', 'C4', 'E2', 2, 4) },
      { drum: true, vol: 0.85, notes: ' x . q r_ k . q r_ |' + AU_R(' k . q r_ k . q r_ |', 6) + ' k . q s k . s s! |' + ' x . q r_ k . q r_ |' + AU_R(' k . q r_ k . q r_ |', 6) + ' k s q s k s s! s! |' },
      { wave: 'square', vol: 0.009, gate: 0.3, notes: auGuide(AU_F3_CH, ' X X_ X X_ X X_ X X_ |', 'F#5', 'E6') },   // C1
      { wave: 'triangle', vol: 0.02, gate: 0.6, notes: AU_F3_C2 },                                                // C2
      { wave: 'triangle', vol: 0.026, gate: 0.95, notes: auGuide(AU_F3_CH, ' X! - - - - - - - |', 'B3', 'A4') }  // C3
    ] });

    // SHOP, VEND-9: B flat major, 100 bpm, swung 0.40, a lounge. THE BATON's first eight bars as a slow lounge tune on a soft triangle (like vibes), a muted square
    // comping off the beat (beat 1 and the and of 2), the bass walking, brushes; it ends with a clunk.
    var AU_SHOP_CH = auChords(auSome(AU_BATON_CH, 1, 8), -2);
    Q.defSong('shop', { bpm: 100, swing: 0.4, vol: 1.02, voices: [
      { wave: 'triangle', vol: 0.03, gate: 0.85, notes: AU_SH(AU_BATON_A, -2) },
      { wave: 'square', vol: 0.008, gate: 0.45, notes: auGuide(AU_SHOP_CH, ' X_ . . X . . . . |', 'D4', 'C5') },
      { wave: 'triangle', vol: 0.032, gate: 0.85, notes: auWalk(AU_SHOP_CH, 'D2', 'C4') },
      { drum: true, vol: 0.7, notes: AU_R(' u . f . u . f . |', 7) + ' u . f . k! . . . |' }
    ] });

    // RESCUE (once, about five seconds): C major, 140 bpm, swung 0.32: the band's fanfare. The conductor's two taps (on the rim too) and the leap, a climb, and the
    // shout chord held (C, E, G and A, a big band's sixth chord) with a crash.
    var AU_RES_LEAD = ' G4 . G4 . C5 - - E5 | G5 - E5 - G5 A5 B5 - | C6! - - - - - - - |';
    Q.defSong('rescue', { bpm: 140, swing: 0.32, loop: false, vol: 0.84, voices: [
      { wave: 'square', vol: 0.021, gate: 0.8, notes: AU_RES_LEAD },
      { wave: 'square', vol: 0.013, gate: 0.8, notes: auDia(AU_RES_LEAD, 'C', -2) },
      { wave: 'sawtooth', vol: 0.009, gate: 0.6, notes: ' . . . . E4! - - . | . . . . . . . . | G4! - - - - - - - |' },
      { wave: 'triangle', vol: 0.033, gate: 0.8, notes: ' C3 - - - G2 - - - | C3 - E3 - G3 - B2 - | C3 - - - - - - - |' },
      { drum: true, vol: 0.8, notes: ' t! . t! . k . s . | k . s . k s s s! | x! . . . . . . . |' }
    ] });

    // END: E flat major, 84 bpm, swung 0.42, a warm swing ballad for the ending and the credits: THE BATON whole, slow and gentle on a round triangle, the section a
    // third under it on a soft square, soft broken chords, a bass in two, brushes.
    var AU_END_CH = auChords(AU_BATON_CH, 3), AU_END_LEAD = AU_SH(AU_BATON_A + AU_BATON_B, 3);
    Q.defSong('end', { bpm: 84, swing: 0.42, vol: 0.93, voices: [
      { wave: 'triangle', vol: 0.032, gate: 0.9, notes: AU_END_LEAD },
      { wave: 'square', vol: 0.009, gate: 0.85, notes: auDia(AU_END_LEAD, 'Eb', -2) },
      { wave: 'square', vol: 0.005, gate: 0.5, notes: auRoll(AU_END_CH, 'G4', 8) },
      { wave: 'triangle', vol: 0.03, gate: 0.9, notes: auWalk(AU_END_CH, 'Eb2', 'Db4', null, 2, 4) },
      { drum: true, vol: 0.55, notes: AU_R(' u . . . u_ . f . |', 16) }
    ] });

    // OVER (once, under three seconds): A minor, 92 bpm, a short sigh: the two taps, tired, and the leap falls instead (a fifth down, to the A a fourth up would
    // reach) and slides away, home to A.
    Q.defSong('over', { bpm: 92, swing: 0.42, loop: false, vol: 1.27, voices: [
      { wave: 'triangle', vol: 0.03, gate: 0.95, notes: ' E5 . E5 . A4 - A4>A3 - |' },
      { wave: 'square', vol: 0.01, gate: 0.9, notes: ' C5 . C5 . E4 - E4>E3 - |' },
      { wave: 'triangle', vol: 0.03, gate: 0.95, notes: ' A2 - - - - - - - |' },
      { drum: true, vol: 0.6, notes: ' t_ . t_ . . . . . |' }
    ] });
