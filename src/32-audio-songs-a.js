    // ---------- 32-audio-songs-a.js: the title, the map and world 1 (AUDIO, builder 4): our own tunes, the format at the top of 30-audio-engine.js ----------
    // The conductor's motif runs through the game: one note tapped twice (the baton's two taps), then a leap up a fourth (title, rescue, end).
    var AU_R = Q.au.rep;

    // TITLE: G major, 132 bpm, a bright brave march. Two baton taps and a run up (once), then the conductor's theme (A: the motif; B: wider and singing).
    Q.defSong('title', { bpm: 132, from: 16, vol: 0.91, voices: [
      { wave: 'square', vol: 0.02, gate: 0.8, notes:
        '. . . . . . . . | . . . . G4 A4 B4 C5 |' +
        ' D5 . D5 . G5 - - D5 | F#5 - E5 - D5 - A4 - | B4 . B4 . E5 - - D5 | C5 - B4 - G4 - - - |' +
        ' D5 . D5 . G5 - A5 - | B5 - A5 - G5 - E5 - | F#5 - - E5 D5 - E5 - | F#5 - - - D5 . E5 F#5 |' +
        ' G5 - - - E5 - C5 - | D5 - - - F#5 - A5 - | B5 - - A5 F#5 - D5 - | E5 - - - . . E5 F#5 |' +
        ' G5 - - - E5 - C5 - | A5 - - - F#5 - D5 - | G5 . G5 . D5 . B4 . | G4 - - - G4 A4 B4 C5 |' },
      { wave: 'triangle', vol: 0.035, gate: 0.7, notes:
        '. . . . . . . . | G2 - - - . . . . |' +
        ' G2 - D3 - G2 - D3 - | F#2 - D3 - F#2 - A2 - | E2 - B2 - E2 - B2 - | C3 - G2 - C3 - G2 - |' +
        ' G2 - D3 - G2 - D3 - | A2 - E3 - A2 - E3 - | D3 - A2 - D3 - A2 - | D3 - A2 - F#2 - A2 - |' +
        ' C3 - G2 - C3 - G2 - | D3 - A2 - D3 - A2 - | B2 - F#2 - B2 - F#2 - | E2 - B2 - E2 - B2 - |' +
        ' C3 - G2 - C3 - G2 - | D3 - A2 - D3 - A2 - | G2 - D3 - G2 - B2 - | G2 - D3 - G2 . . . |' },
      { wave: 'square', vol: 0.011, gate: 0.4, notes:
        '. . . . . . . . | . . . . . . . . |' +
        ' . B3 . D4 . B3 . D4 | . A3 . D4 . A3 . D4 | . B3 . E4 . B3 . E4 | . C4 . E4 . C4 . E4 |' +
        ' . B3 . D4 . B3 . D4 | . C4 . E4 . C4 . E4 | . A3 . D4 . A3 . D4 | . A3 . D4 . A3 . D4 |' +
        ' . C4 . E4 . C4 . E4 | . A3 . D4 . A3 . D4 | . B3 . D4 . B3 . D4 | . B3 . E4 . B3 . E4 |' +
        ' . C4 . E4 . C4 . E4 | . A3 . D4 . A3 . D4 | . B3 . D4 . B3 . D4 | . B3 . D4 . . . . |' },
      { drum: true, vol: 0.8, notes: 't! . t! . . . . . | . . . . s_ s_ s s! |' + AU_R('k h s h k h s h |', 15) + ' k h s h k s s s |' }
    ] });

    // MAP: F major, 108 bpm, a stroll between worlds: a friendly tune over a walking bass, soft ticks for footsteps.
    Q.defSong('map', { bpm: 108, vol: 0.98, voices: [
      { wave: 'square', vol: 0.018, gate: 0.7, notes:
        'C5 - A4 C5 F5 - - - | E5 - D5 - A4 - - - | D5 - Bb4 D5 F5 - - - | E5 - - D5 C5 - - - |' +
        ' C5 - A4 C5 F5 - G5 - | A5 - G5 F5 D5 - - - | Bb4 - D5 - G5 - F5 - | E5 - - - C5 - - - |' +
        ' D5 - - F5 Bb5 - A5 - | G5 - - E5 C5 - - - | C5 - E5 - A5 - G5 - | F5 - E5 - D5 - - - |' +
        ' D5 - Bb4 - G4 - Bb4 - | C5 - - - E5 - G5 - | F5 - - - A4 - C5 - | F5 - - - . . A4 Bb4 |' },
      { wave: 'triangle', vol: 0.034, gate: 0.8, notes:
        'F2 - A2 - C3 - A2 - | D3 - A2 - F2 - A2 - | Bb2 - D3 - F3 - D3 - | C3 - E3 - G3 - E3 - |' +
        ' F2 - A2 - C3 - A2 - | D3 - A2 - F2 - A2 - | G2 - Bb2 - D3 - Bb2 - | C3 - G2 - E2 - G2 - |' +
        ' Bb2 - D3 - F3 - D3 - | C3 - E3 - G3 - E3 - | A2 - C3 - E3 - C3 - | D3 - A2 - F2 - A2 - |' +
        ' G2 - Bb2 - D3 - Bb2 - | C3 - E3 - G3 - Bb2 - | F2 - A2 - C3 - A2 - | F2 - C3 - A2 - C3 - |' },
      { drum: true, vol: 0.7, notes: AU_R('k h t h k h t h |', 16) }
    ] });

    // W1, THE INBOX: C major, 144 bpm, bouncy and papery: a hopping staccato tune, octaves bouncing in the bass, paper shuffling on the off-beats,
    // and a little new-mail ding at the end of each half.
    Q.defSong('w1', { bpm: 144, vol: 1.19, voices: [
      { wave: 'square', vol: 0.02, gate: 0.45, notes:
        'E5 . E5 G5 . E5 . C5 | D5 . D5 F5 . D5 . B4 | C5 . C5 E5 . C5 . A4 | B4 . G4 . A4 B4 C5 D5 |' +
        ' E5 . E5 G5 . E5 . C5 | F5 . F5 A5 . F5 . D5 | G5 . E5 . D5 . G4 . | C5 . . . . . . . |' +
        ' C5 . F5 . A5 . G5 F5 | G5 . . . E5 . . . | A4 . D5 . F5 . E5 D5 | E5 . . . D5 . . . |' +
        ' C5 . F5 . A5 . C6 . | B5 . G5 . E5 . G5 . | F5 . E5 . D5 . F5 . | G5 . . . . . D5 . |' },
      { wave: 'triangle', vol: 0.034, gate: 0.5, notes:
        AU_R('C3 C4', 4) + ' |' + AU_R('G2 G3', 4) + ' |' + AU_R('A2 A3', 4) + ' |' + AU_R('G2 G3', 4) + ' |' +
        AU_R('C3 C4', 4) + ' |' + AU_R('F2 F3', 4) + ' |' + AU_R('G2 G3', 4) + ' |' + AU_R('C3 C4', 4) + ' |' +
        AU_R('F2 F3', 4) + ' |' + AU_R('E2 E3', 4) + ' |' + AU_R('D3 D4', 4) + ' |' + AU_R('G2 G3', 4) + ' |' +
        AU_R('F2 F3', 4) + ' |' + AU_R('E2 E3', 4) + ' |' + AU_R('D3 D4', 4) + ' |' + AU_R('G2 G3', 4) + ' |' },
      { drum: true, vol: 0.8, notes: AU_R('k p s p k p s p |', 7) + ' k p s p k k s s |' + AU_R('k p s p k p s p |', 7) + ' k p s p k k s s! |' },
      { wave: 'sine', vol: 0.022, gate: 0.6, notes: AU_R('. . . . . . . . |', 7) + ' . . . . G6 - E6 - |' + AU_R('. . . . . . . . |', 7) + ' . . G6 E6 . . . . |' }
    ] });
