    // ---------- 35-audio-songs-d.js: SCOPE CREEP's third part, VEND-9's shop, the rescue, the end and game over (AUDIO, builder 4): our own tunes ----------
    function auType(a, b, c) { return Q.au.rep(a + ' ' + b + ' ' + c + ' ' + b, 4) + ' |'; }   // C1's quick even sixteenths on a chord (a voice with sub: 2)
    function auHold(n) { return ' ' + n + '! - - - - - - - |'; }                                // C3's one firm note a bar
    var AU_REST16 = ' . . . . . . . . . . . . . . . . |';

    // FINAL3, the agents join (call Q.music('final3') when the third part starts: it takes over at the next bar, at the same place): D major now, the same
    // march, with C1 typing a shield of sixteenths up high, C2's quick runs and long pauses, C3 holding one firm note a bar, and the conductor's tick on the off-beats.
    Q.defSong('final3', { bpm: 138, join: 'final', vol: 0.87, voices: [
      { wave: 'square', vol: 0.02, gate: 0.75, notes:
        'D5 - A4 - . . . . | D5 - A4 - B4 - . . | D5 - A4 - B4 - C#5 - | D5 A4 B4 C#5 D5 E5 F#5 G5 |' +
        ' A5 - - - G5 - F#5 E5 | F#5 - - - D5 - - - | Bb4 - D5 - F5 - Bb5 - | A5 - - - A4>A5 - - - |' +
        ' D5 - - - B4 - G4 - | E5 - - - C#5 - A4 - | C#5 - - - A4 - F#4 - | D5 - F#5 - A5 - D6 - |' +
        ' D6 - - - B5 - G5 - | E5 - G5 - A5 - C#6 - | D6 - - - A5 - F#5 - | E5 - - - C#5 - A4 - |' },
      { wave: 'triangle', vol: 0.036, gate: 0.6, notes:
        auPah('D3', 'F#3', 'A2') + auPah('D3', 'F#3', 'D3') + auPah('D3', 'F#3', 'D3') + auPah('D3', 'F#3', 'A2') +
        auPah('A2', 'C#3', 'E2') + auPah('D3', 'F#3', 'A2') + auPah('Bb2', 'D3', 'F2') + auPah('A2', 'C#3', 'E2') +
        auPah('G2', 'B2', 'D3') + auPah('A2', 'C#3', 'E2') + auPah('F#2', 'A2', 'C#3') + auPah('D3', 'F#3', 'A2') +
        auPah('G2', 'B2', 'D3') + auPah('A2', 'C#3', 'E2') + auPah('D3', 'F#3', 'A2') + auPah('A2', 'C#3', 'E2') },
      { drum: true, vol: 0.9, notes: ' x t s t k t s t |' + Q.au.rep('k t s t k t s t |', 6) + ' k s s s k s s s |' + ' x t s t k t s t |' + Q.au.rep('k t s t k t s t |', 6) + ' k s k s k s s! s! |' },
      { wave: 'square', vol: 0.011, gate: 0.5, sub: 2, notes:   // C1
        auType('D6', 'A5', 'F#5') + auType('D6', 'A5', 'F#5') + auType('D6', 'A5', 'F#5') + auType('D6', 'A5', 'F#5') +
        auType('C#6', 'G5', 'E5') + auType('D6', 'A5', 'F#5') + auType('D6', 'Bb5', 'F5') + auType('C#6', 'A5', 'E5') +
        auType('D6', 'B5', 'G5') + auType('C#6', 'A5', 'E5') + auType('C#6', 'A5', 'F#5') + auType('D6', 'A5', 'F#5') +
        auType('D6', 'B5', 'G5') + auType('C#6', 'G5', 'E5') + auType('D6', 'A5', 'F#5') + auType('C#6', 'G5', 'E5') },
      { wave: 'triangle', vol: 0.02, gate: 0.6, sub: 2, notes:   // C2
        ' A5 B5 C#6 D6 E6 F#6 - - - - . . . . . . |' + AU_REST16 + AU_REST16 + ' F#6 E6 D6 C#6 B5 A5 - - - - . . . . . . |' +
        ' E5 F#5 G5 A5 B5 C#6 - - - - . . . . . . |' + AU_REST16 + AU_REST16 + ' . . . . . . . . E6 D6 C#6 B5 A5 - - - |' +
        ' B5 C#6 D6 E6 F#6 G6 - - - - . . . . . . |' + AU_REST16 + AU_REST16 + ' D6 E6 F#6 G6 A6 - - - . . . . . . . . |' +
        ' G6 F#6 E6 D6 C#6 B5 - - - - . . . . . . |' + AU_REST16 + AU_REST16 + ' A5 B5 C#6 D6 E6 - - - . . . . . . . . |' },
      { wave: 'triangle', vol: 0.026, gate: 0.95, notes:   // C3
        auHold('D4') + auHold('D4') + auHold('D4') + auHold('D4') + auHold('C#4') + auHold('D4') + auHold('D4') + auHold('C#4') +
        auHold('D4') + auHold('C#4') + auHold('C#4') + auHold('D4') + auHold('D4') + auHold('C#4') + auHold('D4') + auHold('C#4') }
    ] });

    // SHOP, VEND-9: B flat major, 100 bpm, swung, a lounge jingle: sevenths over a walking bass, soft chords on the off-beats, brushes, and a clunk to finish.
    Q.defSong('shop', { bpm: 100, swing: 0.3, vol: 1.02, voices: [
      { wave: 'triangle', vol: 0.03, gate: 0.7, notes:
        'D5 - F5 - A5 - - F5 | G5 - - - F5 - D5 - | Eb5 - G5 - Bb5 - - G5 | A5 - - - . . F5 G5 |' +
        ' F5 - - - A5 - C6 - | B5 - - - G5 - F5 - | Eb5 - D5 - C5 - A4 - | Bb4 - - - . . . . |' },
      { wave: 'triangle', vol: 0.034, gate: 0.75, notes:
        'Bb2 - C3 - D3 - F3 - | G2 - A2 - Bb2 - D3 - | C3 - G2 - Eb3 - C3 - | F2 - A2 - C3 - Eb3 - |' +
        ' D3 - C3 - A2 - F2 - | G2 - B2 - D3 - F3 - | C3 - G2 - F2 - A2 - | Bb2 - F2 - G2 - A2 - |' },
      { wave: 'sine', vol: 0.016, gate: 0.35, notes:
        '. D4 . . . A4 . . | . Bb3 . . . F4 . . | . Eb4 . . . Bb3 . . | . A3 . . . Eb4 . . |' +
        ' . F4 . . . C4 . . | . B3 . . . F4 . . | . Eb4 . . . A3 . . | . D4 . . . G4 . . |' },
      { drum: true, vol: 0.6, notes: Q.au.rep('k_ . h . t_ . h . |', 7) + ' k_ . h . k! . . . |' }
    ] });

    // RESCUE (once, about five seconds): C major, 140 bpm: the conductor's two taps and a leap, a climb, a held high C.
    Q.defSong('rescue', { bpm: 140, loop: false, vol: 0.86, voices: [
      { wave: 'square', vol: 0.022, gate: 0.8, notes: 'G4 . G4 . C5 - E5 - | G5 - E5 - G5 A5 B5 - | C6 - - - - - - - |' },
      { wave: 'triangle', vol: 0.024, gate: 0.8, notes: 'E4 . E4 . G4 - C5 - | E5 - C5 - E5 F5 G5 - | E5 - - - - - - - |' },
      { wave: 'triangle', vol: 0.034, gate: 0.8, notes: 'C3 - - - G2 - - - | C3 - - - G2 - - - | C3 - - - - - - - |' },
      { drum: true, vol: 0.8, notes: 'k . s . k . s . | k . s . k s s s | x! . . . . . . . |' }
    ] });

    // END: E flat major, 84 bpm, warm: the conductor's motif again, slow and gentle, over soft broken chords (the ending and the credits).
    Q.defSong('end', { bpm: 84, vol: 0.97, voices: [
      { wave: 'triangle', vol: 0.032, gate: 0.9, notes:
        'Bb4 . Bb4 . Eb5 - - D5 | D5 - C5 - Bb4 - F4 - | G4 . G4 . C5 - - Bb4 | Ab4 - F4 - Eb4 - - - |' +
        ' Bb4 . Bb4 . Eb5 - F5 - | Ab5 - F5 - Eb5 - C5 - | Ab4 - - C5 Eb5 - - - | D5 - - - . . Eb5 F5 |' +
        ' G5 - - - Eb5 - C5 - | D5 - - - F5 - Bb5 - | Bb5 - - Ab5 G5 - D5 - | Eb5 - - - . . Eb5 F5 |' +
        ' Ab5 - - - Eb5 - C5 - | F5 - - - D5 - Bb4 - | Eb5 . Eb5 . Bb4 . G4 . | Eb4 - - - . . . . |' },
      { wave: 'triangle', vol: 0.03, gate: 0.9, notes:
        'Eb3 - - - Bb2 - - - | D3 - - - Bb2 - - - | C3 - - - G2 - - - | Ab2 - - - Eb3 - - - |' +
        ' G2 - - - Bb2 - - - | Ab2 - - - C3 - - - | F2 - - - C3 - - - | Bb2 - - - F2 - - - |' +
        ' C3 - - - G2 - - - | Bb2 - - - F2 - - - | G2 - - - D3 - - - | C3 - - - G2 - - - |' +
        ' Ab2 - - - Eb3 - - - | Bb2 - - - F2 - - - | Eb3 - - - Bb2 - - - | Eb3 - - - . . . . |' },
      { wave: 'sine', vol: 0.014, gate: 0.5, notes:
        auRun('Eb4', 'G4', 'Bb4') + auRun('D4', 'F4', 'Bb4') + auRun('C4', 'Eb4', 'G4') + auRun('C4', 'Eb4', 'Ab4') +
        auRun('Eb4', 'G4', 'Bb4') + auRun('C4', 'Eb4', 'Ab4') + auRun('Eb4', 'F4', 'Ab4') + auRun('D4', 'F4', 'Ab4') +
        auRun('C4', 'Eb4', 'G4') + auRun('D4', 'F4', 'Bb4') + auRun('D4', 'G4', 'Bb4') + auRun('C4', 'Eb4', 'G4') +
        auRun('C4', 'Eb4', 'Ab4') + auRun('D4', 'F4', 'Bb4') + auRun('Eb4', 'G4', 'Bb4') + auRun('Eb4', 'G4', 'Bb4') },
      { drum: true, vol: 0.5, notes: Q.au.rep('k_ . . . t_ . . . |', 16) }
    ] });

    // OVER (once, under three seconds): A minor, 92 bpm, a short sigh: two steps down and a slide, home to A.
    Q.defSong('over', { bpm: 92, loop: false, vol: 1.01, voices: [
      { wave: 'triangle', vol: 0.03, gate: 0.95, notes: 'E5 - D5 - C5>A4 - - - |' },
      { wave: 'sine', vol: 0.018, gate: 0.95, notes: 'C5 - B4 - A4>E4 - - - |' },
      { wave: 'triangle', vol: 0.03, gate: 0.95, notes: 'A2 - E2 - A2 - - - |' }
    ] });
