    // ---------- 36-audio-songs-e.js: a boss theme for each of worlds 1 to 3 (AUDIO, builder 4): our own tunes, the format at the top of 30-audio-engine.js ----------
    // One family: each is built on 'boss' (34-audio-songs-c.js): its bass riff leaning 3 + 3 + 2, and its opening figure (a falling triad in the same push),
    // each in its world's colour. 'boss' stays the fallback. Joined pairs (the same join name and as many bars) switch at the next bar line, at the same bar.
    function auHum(r, up) {   // a bar of sixteenths on one note, leaning 3 + 3 + 2 (up: the leaning notes an octave higher, hotter)
      var u = up || r;
      return ' ' + [r + '!', r + '_', r, r + '_', r, r + '_', u + '!', r + '_', r, r + '_', r, r + '_', u + '!', r + '_', r, r + '_'].join(' ') + ' |';
    }

    // BOSS-HYDRA, THE REPLY-ALL HYDRA: C minor, 160 bpm, bouncy, papery and a little pompous: the boss figure hopping in repeated staccato notes over the riff,
    // paper on the off-beats, a dotted fanfare in the second half, and a nasal sawtooth answering every second bar with the RE: RE: figure (up a fourth).
    Q.defSong('boss-hydra', { bpm: 160, vol: 1.17, voices: [
      { wave: 'square', vol: 0.02, gate: 0.5, notes:
        'G5 . G5 Eb5 . Eb5 C5 . | D5 . D5 Eb5 . Eb5 F5 . | Eb5 . Eb5 C5 . C5 Ab4 . | Bb4 . Bb4 C5 . C5 D5 . |' +
        ' G5 . G5 Eb5 . Eb5 C5 . | D5 . D5 Eb5 . Eb5 G5 . | Ab5 - - - Eb5 - - - | G5 - - - D5 - B4 - |' +
        ' F5 - - C5 F5 - Ab5 - | C6 - - - Ab5 - F5 - | G5 - - Eb5 G5 - C6 - | Eb6 - - - C6 - G5 - |' +
        ' Ab5 - - Eb5 Ab5 - C6 - | D6 - - - Bb5 - F5 - | G5 - - D5 G5 - B5 - | D6 - - - B5 . . . |' },
      { wave: 'triangle', vol: 0.03, gate: 0.45, notes:
        auRiff('C3', 'C4') + auRiff('C3', 'C4') + auRiff('Ab2', 'Ab3') + auRiff('Bb2', 'Bb3') + auRiff('C3', 'C4') + auRiff('C3', 'C4') + auRiff('Ab2', 'Ab3') + auRiff('G2', 'G3') +
        auRiff('F2', 'F3') + auRiff('F2', 'F3') + auRiff('C3', 'C4') + auRiff('C3', 'C4') + auRiff('Ab2', 'Ab3') + auRiff('Bb2', 'Bb3') + auRiff('G2', 'G3') + auRiff('G2', 'G3') },
      { drum: true, vol: 0.85, notes: Q.au.rep('k p s k p k s p |', 7) + ' k p s k s s s! s! |' + Q.au.rep('k p s k p k s p |', 7) + ' k p s k s s s! s! |' },
      { wave: 'sawtooth', vol: 0.012, gate: 0.5, notes:
        ' . . . . . . . . | . . . . . . F5 Bb5 | . . . . . . . . | . . . . . . F5 Bb5 | . . . . . . . . | . . . . . . G5 C6 | . . . . . . . . | . . . . D5 G5 D5 G5 |' +
        ' . . . . . . . . | . . . . . . F5 Bb5 | . . . . . . . . | . . . . . . G5 C6 | . . . . . . . . | . . . . . . F5 Bb5 | . . . . . . . . | . . . . D5 G5 D5 G5 |' }
    ] });

    // BOSS-OVERHEAT, THE OVERHEAT: A minor, 120 bpm in sixteenths, a heavy humming pulse leaning 3 + 3 + 2 (the riff as a hum), the boss figure held long
    // above it, the racks' lights blinking. BOSS-OVERHEAT2, its last phase (joined: Q.music('boss-overheat2') takes over at the next bar line, at the same bar):
    // hotter and faster, 138 bpm, the hum jumping up an octave on its leaning notes, the tune an octave higher with a sawtooth buzzing under it, busier drums.
    var AU_HEAT_LEAD =
      'E5 - - - - - C5 - - - - - A4 - - - | B4 - - - - - C5 - - - - - D5 - - - | C5 - - - - - A4 - - - - - F4 - - - | G#4 - - - - - B4 - - - - - E5 - - - |' +
      ' E5 - - - - - C5 - - - - - A4 - - - | B4 - - - - - C5 - - - - - E5 - - - | F#5 - - - - - D5 - - - - - A4 - - - | G#5 - - - - - E5 - - - - - B4 - - - |';
    var AU_HEAT_ROOTS = ['A2', 'A2', 'F2', 'E2', 'A2', 'A2', 'D3', 'E2'], AU_HEAT_HIGH = ['A3', 'A3', 'F3', 'E3', 'A3', 'A3', 'D4', 'E3'];
    function auHeatHum(hot) { var s = '', i; for (i = 0; i < 8; i++) s += auHum(AU_HEAT_ROOTS[i], hot ? AU_HEAT_HIGH[i] : null); return s; }
    Q.defSong('boss-overheat', { bpm: 120, div: 4, join: 'overheat', vol: 1.32, voices: [
      { wave: 'square', vol: 0.017, gate: 0.8, notes: AU_HEAT_LEAD },
      { wave: 'triangle', vol: 0.0265, gate: 0.45, notes: auHeatHum(false) },
      { wave: 'sine', vol: 0.012, gate: 0.3, notes:
        ' . . . A6 . . . . . . E6 . . . . . | . . . . . . C7 . . . . . . A6 . . | . . . A6 . . . . . . F6 . . . . . | . . . . . . G#6 . . . . . . B6 . . |' +
        ' . . . E6 . . . . . . A6 . . . . . | . . . . . . E6 . . . . . . C7 . . | . . . F#6 . . . . . . A6 . . . . . | . . . . . . G#6 . . . . . . B6 . . |' },
      { drum: true, vol: 0.8, notes: Q.au.rep('k . h . . . k . s . h . k . h . |', 7) + ' k . s . s . k . s s s s k s s! s! |' }
    ] });
    Q.defSong('boss-overheat2', { bpm: 138, div: 4, join: 'overheat', vol: 1.19, voices: [
      { wave: 'square', vol: 0.015, gate: 0.8, oct: 1, notes: AU_HEAT_LEAD },
      { wave: 'sawtooth', vol: 0.01, gate: 0.8, notes: AU_HEAT_LEAD },
      { wave: 'triangle', vol: 0.029, gate: 0.45, notes: auHeatHum(true) },
      { wave: 'sine', vol: 0.012, gate: 0.3, notes:
        ' . . A6 . . . E6 . . . C7 . . . E6 . | . . C7 . . . A6 . . . E6 . . . A6 . | . . A6 . . . F6 . . . C7 . . . F6 . | . . B6 . . . G#6 . . . E6 . . . G#6 . |' +
        ' . . A6 . . . E6 . . . C7 . . . E6 . | . . C7 . . . A6 . . . E6 . . . A6 . | . . F#6 . . . D7 . . . A6 . . . F#6 . | . . B6 . . . G#6 . . . E6 . . . B6 . |' },
      { drum: true, vol: 0.8, notes: Q.au.rep('k h h h k h k h s h k h k h s h |', 7) + ' k s s s k s k s s s k s s! s! s! s! |' }
    ] });

    // BOSS-LOOP, THE INFINITE LOOP: 128 bpm, airy and dizzy: one two-bar phrase (the boss figure, then a lift through the raised fourth) played four times,
    // each time a major third higher (D, F#, A#, then D an octave up), so after three climbs it is home again, higher, and the loop starts over below: a
    // phrase that loops and climbs every time round, over the riff and soft arpeggios, with a breath of wind at each climb. BOSS-LOOP2: the same in double
    // time, 256 bpm (joined: Q.music('boss-loop2') takes over at the next bar line, at the same bar).
    var AU_LOOP_PHRASE = 'A4 - - F#4 - - D4 - | E4 - - F#4 - - G#4 - |';
    var AU_LOOP_LEAD = AU_LOOP_PHRASE + ' ' + Q.au.shift(AU_LOOP_PHRASE, 4) + ' ' + Q.au.shift(AU_LOOP_PHRASE, 8) + ' ' + Q.au.shift(AU_LOOP_PHRASE, 12);
    var AU_LOOP_BASS = auRiff('D2', 'D3') + auRiff('D2', 'D3') + auRiff('F#2', 'F#3') + auRiff('F#2', 'F#3') + auRiff('A#2', 'A#3') + auRiff('A#2', 'A#3') + auRiff('D3', 'D4') + auRiff('D3', 'D4');
    var AU_LOOP_ARP = auRun('D5', 'F#5', 'A5') + auRun('E5', 'G#5', 'B5') + auRun('F#5', 'A#5', 'C#6') + auRun('G#5', 'C6', 'D#6') +
      auRun('A#4', 'D5', 'F5') + auRun('C5', 'E5', 'G5') + auRun('D5', 'F#5', 'A5') + auRun('E5', 'G#5', 'B5');
    var AU_LOOP_DRUM = Q.au.rep('k w h . s . h . | k . h . s . h k |', 4);
    Q.defSong('boss-loop', { bpm: 128, join: 'loop', vol: 1.15, voices: [
      { wave: 'square', vol: 0.018, gate: 0.8, notes: AU_LOOP_LEAD },
      { wave: 'triangle', vol: 0.03, gate: 0.45, notes: AU_LOOP_BASS },
      { wave: 'sine', vol: 0.015, gate: 0.5, notes: AU_LOOP_ARP },
      { drum: true, vol: 0.75, notes: AU_LOOP_DRUM }
    ] });
    Q.defSong('boss-loop2', { bpm: 256, join: 'loop', vol: 1.13, voices: [
      { wave: 'square', vol: 0.018, gate: 0.8, notes: AU_LOOP_LEAD },
      { wave: 'triangle', vol: 0.03, gate: 0.45, notes: AU_LOOP_BASS },
      { wave: 'sine', vol: 0.015, gate: 0.5, notes: AU_LOOP_ARP },
      { drum: true, vol: 0.75, notes: AU_LOOP_DRUM }
    ] });
