    // ---------- 33-audio-songs-b.js: worlds 2, 3 and 4 (AUDIO, builder 4): our own tunes, the format at the top of 30-audio-engine.js ----------
    function auPulse(root) { return Q.au.rep(root + '! ' + root + '_ ' + root + ' ' + root + '_', 4) + ' |'; }   // a bar of sixteenths on one note, leaning on each beat
    function auArp(a, b, c, d) { var n = [a, b, c, d], k = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 1], o = [], i; for (i = 0; i < 16; i++) o.push(n[k[i]]); return ' ' + o.join(' ') + ' |'; }
    function auOct(lo, hi) { return Q.au.rep(lo + ' ' + hi, 4) + ' |'; }   // a bar of eighths jumping an octave

    // W2, THE SERVER ROOM: A minor with a cool raised sixth (F#), 112 bpm in sixteenths, a humming pulse: the low hum leans on every beat, the tune holds
    // long notes and sends short bursts, and high blips blink like the racks' lights.
    Q.defSong('w2', { bpm: 112, div: 4, vol: 1.3, voices: [
      { wave: 'square', vol: 0.016, gate: 0.7, notes:
        'A4 - - - - - - - E5 - - - C5 - B4 - | A4 - - - - - - - . . E5 F#5 G5 - F#5 - |' +
        ' A4 - - - - - - - C5 - - - F5 - E5 - | D5 - - - - - - - B4 - - - G4 - - - |' +
        ' E5 - - - - - - - A5 - - - G5 - E5 - | C5 - - - - - - - . . A4 B4 C5 - D5 - |' +
        ' F#5 - - - - - - - A5 - - - F#5 - D5 - | B4 - - - - - - - D5 - - - G#4 - - - |' },
      { wave: 'triangle', vol: 0.027, gate: 0.45, notes: auPulse('A2') + auPulse('A2') + auPulse('F2') + auPulse('G2') + auPulse('A2') + auPulse('A2') + auPulse('D3') + auPulse('E2') },
      { wave: 'sine', vol: 0.012, gate: 0.3, notes:
        '. . . A6 . . . . . . E6 . . . . . | . . . . . . C7 . . . . . . A6 . . | . . . A6 . . . . . . F6 . . . . . | . . . . . . G6 . . . . . . D7 . . |' +
        ' . . . E6 . . . . . . A6 . . . . . | . . . . . . E6 . . . . . . C7 . . | . . . F#6 . . . . . . A6 . . . . . | . . . . . . G#6 . . . . . . B6 . . |' },
      { drum: true, vol: 0.8, notes: Q.au.rep('k . h . . . h . k . h . . t h . |', 8) }
    ] });

    // W3, THE CLOUD: D major with a floating raised fourth (G#), 92 bpm, airy: soft rolling arpeggios up high, a slow bell of a tune, long low notes, a breath of wind.
    Q.defSong('w3', { bpm: 92, div: 4, vol: 0.89, voices: [
      { wave: 'triangle', vol: 0.032, gate: 0.9, notes:
        'A5 - - - - - - - F#5 - - - E5 - - - | G#5 - - - - - - - B5 - - - - - - - | A5 - - - F#5 - - - D5 - - - E5 - - - | F#5 - - - - - - - D5 - - - B4 - - - |' +
        ' A5 - - - - - - - D6 - - - C#6 - - - | B5 - - - - - - - G#5 - - - E5 - - - | F#5 - - - G5 - - - A5 - - - B5 - - - | A5 - - - - - - - E5 - - - C#5 - - - |' },
      { wave: 'sine', vol: 0.017, gate: 0.6, oct: -1, notes:
        auArp('D5', 'F#5', 'A5', 'C#6') + auArp('E5', 'G#5', 'B5', 'D6') + auArp('B4', 'D5', 'F#5', 'A5') + auArp('G4', 'B4', 'D5', 'F#5') +
        auArp('D5', 'F#5', 'A5', 'C#6') + auArp('E5', 'G#5', 'B5', 'D6') + auArp('G4', 'B4', 'D5', 'F#5') + auArp('A4', 'C#5', 'E5', 'A5') },
      { wave: 'triangle', vol: 0.03, gate: 0.9, notes:
        'D3 - - - - - - - A2 - - - - - - - | D3 - - - - - - - . . . . D3 - - - | B2 - - - - - - - F#2 - - - - - - - | G2 - - - - - - - D3 - - - - - - - |' +
        ' D3 - - - - - - - A2 - - - - - - - | D3 - - - - - - - . . . . D3 - - - | G2 - - - - - - - B2 - - - - - - - | A2 - - - - - - - E2 - - - - - - - |' },
      { drum: true, vol: 0.7, notes: Q.au.rep('w . h_ . . . h_ . . . h_ . . . h_ . | . . h_ . . . h_ . . . h_ . . . h_ . |', 4) }
    ] });

    // W4, THE BACKLOG: E minor, 150 bpm, tense and climbing: the bass climbs a step every bar (E F# G A B C D, then B to come back), the tune climbs with it
    // in a figure that repeats one step higher, then hammers repeated notes higher and higher with a tick under it, like a deadline.
    Q.defSong('w4', { bpm: 150, vol: 1.07, voices: [
      { wave: 'square', vol: 0.018, gate: 0.6, notes:
        'E4 . G4 . B4 - A4 G4 | F#4 . A4 . C5 - B4 A4 | G4 . B4 . D5 - C5 B4 | A4 . C5 . E5 - D5 C5 |' +
        ' B4 . D5 . F#5 - E5 D5 | C5 . E5 . G5 - F5 E5 | D5 . F#5 . A5 - G5 F#5 | D#5 . F#5 . A5 - B5 - |' +
        ' E5 . E5 . E5 - D5 E5 | F#5 . F#5 . F#5 - E5 F#5 | G5 . G5 . G5 - F#5 G5 | A5 . A5 . A5 - G5 A5 |' +
        ' B5 . B5 . B5 - A5 B5 | C6 . A5 . G5 . E5 . | F#5 . E5 . D5 . C5 . | A5 - F#5 - D#5 - B4 - |' },
      { wave: 'triangle', vol: 0.035, gate: 0.55, notes:
        auOct('E2', 'E3') + auOct('F#2', 'F#3') + auOct('G2', 'G3') + auOct('A2', 'A3') + auOct('B2', 'B3') + auOct('C3', 'C4') + auOct('D3', 'D4') + auOct('B2', 'B3') +
        auOct('E2', 'E3') + auOct('F#2', 'F#3') + auOct('G2', 'G3') + auOct('A2', 'A3') + auOct('B2', 'B3') + auOct('C3', 'C4') + auOct('D3', 'D4') + auOct('B2', 'B3') },
      { wave: 'square', vol: 0.012, gate: 0.6, notes: Q.au.rep('. . . . . . . . |', 8) +
        ' G4 . G4 . G4 - F#4 G4 | A4 . A4 . A4 - G4 A4 | B4 . B4 . B4 - A4 B4 | C5 . C5 . C5 - B4 C5 | D5 . D5 . D5 - C#5 D5 |' + Q.au.rep('. . . . . . . . |', 3) },
      { drum: true, vol: 0.85, notes: Q.au.rep('k h s h k h s h |', 7) + ' k h s h s s s s |' + Q.au.rep('k t s t k t s t |', 7) + ' k . s s s s s! s! |' }
    ] });
