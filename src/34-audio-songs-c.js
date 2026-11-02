    // ---------- 34-audio-songs-c.js: the bosses' song and SCOPE CREEP's (AUDIO, builder 4): our own tunes, the format at the top of 30-audio-engine.js ----------
    function auRiff(lo, hi) { return ' ' + lo + '! ' + hi + ' ' + lo + ' ' + lo + '! ' + hi + ' ' + lo + ' ' + lo + '! ' + hi + ' |'; }   // eighths leaning 3 + 3 + 2
    function auPah(a, b, c) { return ' ' + a + ' - ' + b + ' - ' + c + ' - ' + b + ' - |'; }   // a march bass: the root, a chord note up, the fifth, up again
    function auRun(a, b, c) { return ' ' + a + ' ' + b + ' ' + c + ' ' + b + ' ' + a + ' ' + b + ' ' + c + ' ' + b + ' |'; }   // running eighths on a chord

    // BOSS (worlds 1 to 3): C minor, 168 bpm, urgent: a riff that leans 3 + 3 + 2, a tune in the same push, then running arpeggios; a held chord note under it.
    Q.defSong('boss', { bpm: 168, vol: 0.99, voices: [
      { wave: 'square', vol: 0.02, gate: 0.7, notes:
        'G5 - - Eb5 - - C5 - | D5 - - Eb5 - - F5 - | Eb5 - - C5 - - Ab4 - | Bb4 - - C5 - - D5 - |' +
        ' G5 - - Eb5 - - C5 - | D5 - - Eb5 - - G5 - | Ab5 - - G5 - - Eb5 - | D5 - - B4 - - G4 - |' +
        ' F5 . Ab5 . C6 . Ab5 . | G5 . F5 . Eb5 . C5 . | Eb5 . G5 . C6 . G5 . | F5 . Eb5 . D5 . C5 . |' +
        ' C5 . Eb5 . Ab5 . Eb5 . | D5 . F5 . Bb5 . F5 . | B4 . D5 . G5 . B5 . | D6 - - - B5 - - - |' },
      { wave: 'triangle', vol: 0.032, gate: 0.5, notes:
        auRiff('C3', 'C4') + auRiff('C3', 'C4') + auRiff('Ab2', 'Ab3') + auRiff('Bb2', 'Bb3') + auRiff('C3', 'C4') + auRiff('C3', 'C4') + auRiff('Ab2', 'Ab3') + auRiff('G2', 'G3') +
        auRiff('F2', 'F3') + auRiff('F2', 'F3') + auRiff('C3', 'C4') + auRiff('C3', 'C4') + auRiff('Ab2', 'Ab3') + auRiff('Bb2', 'Bb3') + auRiff('G2', 'G3') + auRiff('G2', 'G3') },
      { wave: 'triangle', vol: 0.02, gate: 0.95, notes:
        'Eb4 - - - - - - - | Eb4 - - - - - - - | C4 - - - - - - - | D4 - - - - - - - | Eb4 - - - - - - - | Eb4 - - - - - - - | C4 - - - - - - - | B3 - - - - - - - |' +
        ' Ab3 - - - - - - - | Ab3 - - - - - - - | G3 - - - - - - - | G3 - - - - - - - | C4 - - - - - - - | D4 - - - - - - - | B3 - - - - - - - | D4 - - - - - - - |' },
      { drum: true, vol: 0.9, notes: Q.au.rep('k h s k h k s h |', 7) + ' k s s k s s s! s! |' + Q.au.rep('k h s k h k s h |', 7) + ' k s s k s s s! s! |' }
    ] });

    // FINAL, SCOPE CREEP (w4-boss): D minor, 138 bpm, grand and a little silly: a pompous march whose opening grows one note longer every bar ("quick ask...
    // while you're in there... just one more thing"), a slide that goes boing, then a broad tune. Three songs share it, joined (each takes over at the next bar,
    // at the same place): 'final' for the first part, 'final2' adds a counter-line of running eighths (the tickets piling up), and 'final3' (the agents join)
    // turns it to D major and adds three voices: C1's quick even sixteenths up high (the shield), C2's runs with long pauses, C3's one firm note a bar.
    var AU_FINAL_LEAD =
      'D5 - A4 - . . . . | D5 - A4 - Bb4 - . . | D5 - A4 - Bb4 - C5 - | D5 A4 Bb4 C5 D5 E5 F5 G5 |' +
      ' A5 - - - G5 - F5 E5 | F5 - - - D5 - - - | Bb4 - D5 - F5 - Bb5 - | A5 - - - A4>A5 - - - |' +
      ' F5 - - - D5 - Bb4 - | G5 - - - E5 - C5 - | E5 - - - C5 - A4 - | D5 - F5 - A5 - D6 - |' +
      ' D6 - - - Bb5 - G5 - | E5 - G5 - A5 - C#6 - | D6 - - - A5 - F5 - | E5 - - - C#5 - A4 - |';
    var AU_FINAL_BASS =
      auPah('D3', 'F3', 'A2') + auPah('D3', 'F3', 'D3') + auPah('D3', 'F3', 'D3') + auPah('D3', 'F3', 'A2') +
      auPah('A2', 'C#3', 'E2') + auPah('D3', 'F3', 'A2') + auPah('Bb2', 'D3', 'F2') + auPah('A2', 'C#3', 'E2') +
      auPah('Bb2', 'D3', 'F2') + auPah('C3', 'E3', 'G2') + auPah('A2', 'C3', 'E2') + auPah('D3', 'F3', 'A2') +
      auPah('G2', 'Bb2', 'D3') + auPah('A2', 'C#3', 'E2') + auPah('D3', 'F3', 'A2') + auPah('A2', 'C#3', 'E2');
    Q.defSong('final', { bpm: 138, join: 'final', vol: 1.07, voices: [
      { wave: 'square', vol: 0.02, gate: 0.75, notes: AU_FINAL_LEAD },
      { wave: 'triangle', vol: 0.036, gate: 0.6, notes: AU_FINAL_BASS },
      { drum: true, vol: 0.85, notes: ' x h s h k h s h |' + Q.au.rep('k h s h k h s h |', 6) + ' k h s s k s s s |' + ' x h s h k h s h |' + Q.au.rep('k h s h k h s h |', 6) + ' k s k s k s s! s! |' }
    ] });
    Q.defSong('final2', { bpm: 138, join: 'final', vol: 0.99, voices: [
      { wave: 'square', vol: 0.02, gate: 0.75, notes: AU_FINAL_LEAD },
      { wave: 'triangle', vol: 0.036, gate: 0.6, notes: AU_FINAL_BASS },
      { wave: 'square', vol: 0.012, gate: 0.5, notes:
        auRun('D4', 'F4', 'A4') + auRun('D4', 'F4', 'A4') + auRun('D4', 'F4', 'A4') + auRun('D4', 'F4', 'A4') +
        auRun('C#4', 'E4', 'G4') + auRun('D4', 'F4', 'A4') + auRun('D4', 'F4', 'Bb4') + auRun('C#4', 'E4', 'A4') +
        auRun('D4', 'F4', 'Bb4') + auRun('E4', 'G4', 'C5') + auRun('C4', 'E4', 'A4') + auRun('D4', 'F4', 'A4') +
        auRun('D4', 'G4', 'Bb4') + auRun('C#4', 'E4', 'G4') + auRun('D4', 'F4', 'A4') + auRun('C#4', 'E4', 'A4') },
      { drum: true, vol: 0.9, notes: ' x h s h k k s h |' + Q.au.rep('k h s h k k s h |', 6) + ' k s s s k s s s |' + ' x h s h k k s h |' + Q.au.rep('k h s h k k s h |', 6) + ' k s k s k s s! s! |' }
    ] });
