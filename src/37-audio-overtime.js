    // ---------- 37-audio-overtime.js: version 116, THE OVERTIME UPDATE (AUDIO, builder 4): our own tunes and sounds, the format at the top of 30-audio-engine.js ----------
    // ENCORE: the four bosses' themes as one fast medley that loops, through all four fights of THE ENCORE. ROOT: a quiet medley of the four worlds' tunes,
    // for the five rooms of THE ROOT FOLDER. Both are in four parts, one a world (parts: in a level of world n, a start begins at part n, so a fight or a room
    // starts on its own world's tune and the medley goes on round from there). STAR: a gold star's chime. README: README.TXT's soft reveal.
    function auTo16(s, det) {   // a run of eighths written in sixteenths (for a voice with sub: 2), each note as long as before; det: its last sixteenth let go (detached)
      var t = String(s).split(/\s+/).filter(function (x) { return !!x; }), out = [], i, j, nx;
      for (i = 0; i < t.length; i++) {
        if (t[i] === '|') { out.push('|'); continue; }
        if (t[i] === '.') { out.push('.', '.'); continue; }
        for (j = i + 1; j < t.length && t[j] === '|'; j++) {}
        nx = j < t.length ? t[j] : '';
        out.push(t[i], nx === '-' || !det ? '-' : '.');
      }
      return ' ' + out.join(' ');
    }
    function auBars(s, a, b) {   // bars a to b (counted from 1) of a run with bar lines
      var p = String(s).split('|'), out = '', i;
      for (i = a - 1; i < b && i < p.length; i++) out += ' ' + p[i].replace(/^\s+|\s+$/g, '') + ' |';
      return out;
    }
    var AU_R16 = Q.au.rep(' . . . . . . . . . . . . . . . . |', 1);   // a bar of rests in sixteenths
    function auLean(s) {   // a run whose bars lean on their first note: every later note in a bar softer
      return ' ' + String(s).split('|').map(function (bar) { var first = true; return bar.replace(/(^|\s)([A-G][#b]?[0-8](?:>[A-G][#b]?[0-8])?)(?=\s|$)/g, function (m, sp, n) { if (first) { first = false; return sp + n; } return sp + n + '_'; }); }).join('|');
    }
    function auHumLow(r) { return auHum(r).replace(/ ([A-G][#b]?[0-8]) /g, ' $1_ '); }   // the hum held down: only its three leaning notes at full strength

    // ENCORE: 168 bpm (the bosses' own 'boss' tempo, every theme quicker than in its fight), 32 bars in four parts of 8, round and round:
    //   1 THE REPLY-ALL HYDRA, C minor: the hopping figure, then its pompous fanfare, with the RE: RE: replies on a nasal sawtooth
    //   2 THE OVERHEAT, A minor: the long boss figure over the sixteenth hum, the racks' lights blinking; in its second half the hum leaps and a sawtooth buzzes under the tune
    //   3 THE INFINITE LOOP: the phrase that climbs a major third each time round (D, F#, A#, then D higher), over the riff and the arpeggios, a breath of wind at each climb
    //   4 SCOPE CREEP, D minor: the march whose opening grows a note a bar, the tickets piling up in running eighths, C1 typing its shield in the last four bars,
    //     and the boing turned to G at the end, so the medley goes round to the hydra's C minor.
    // The engine asks for it at each fight; while Q.encoreOn() is true, Q.music lets any other song go (a boss's own, SCOPE CREEP's final2 and final3), and a
    // start begins at that fight's boss's part (parts: 8), so after the stop at each beaten boss the next fight opens on its own theme.
    var AU_ENC_LEAD =
      auTo16('G5 . G5 Eb5 . Eb5 C5 . | D5 . D5 Eb5 . Eb5 F5 . | Eb5 . Eb5 C5 . C5 Ab4 . | Bb4 . Bb4 C5 . C5 D5 . |', true) +   // the hop, detached
      auTo16(' Ab5 - - Eb5 Ab5 - C6 - | D6 - - - Bb5 - F5 - | G5 - - D5 G5 - B5 - | D6 - - - B5 . . . |', false) +              // the fanfare, held
      auLean(AU_HEAT_LEAD) +
      auTo16(AU_LOOP_LEAD, false) +
      auTo16(auBars(AU_FINAL_LEAD, 1, 7) + ' G5 - - - G4>G5 - - - |', true);
    var AU_ENC_BASS =
      auTo16(auRiff('C3', 'C4') + auRiff('C3', 'C4') + auRiff('Ab2', 'Ab3') + auRiff('Bb2', 'Bb3') + auRiff('Ab2', 'Ab3') + auRiff('Bb2', 'Bb3') + auRiff('G2', 'G3') + auRiff('G2', 'G3'), true) +
      auHumLow('A2') + auHumLow('A2') + auHumLow('F2') + auHumLow('E2') + auHum('A2', 'A3') + auHum('A2', 'A3') + auHum('D3', 'D4') + auHum('E2', 'E3') +   // cold, then hot
      auTo16(AU_LOOP_BASS, true) +
      auTo16(auBars(AU_FINAL_BASS, 1, 7) + auPah('G2', 'B2', 'D3'), true);
    var AU_ENC_SAW =
      auTo16(' . . . . . . . . | . . . . . . F5 Bb5 | . . . . . . . . | . . . . . . F5 Bb5 | . . . . . . . . | . . . . . . F5 Bb5 | . . . . . . . . | . . . . D5 G5 D5 G5 |', true) +
      Q.au.rep(AU_R16, 4) + auBars(AU_HEAT_LEAD, 5, 8) +
      Q.au.rep(AU_R16, 8) +
      auTo16(Q.au.rep(auRun('D4', 'F4', 'A4'), 4) + auRun('C#4', 'E4', 'G4') + auRun('D4', 'F4', 'A4') + auRun('D4', 'F4', 'Bb4') + auRun('B3', 'D4', 'G4'), true);
    var AU_ENC_HIGH =
      Q.au.rep(AU_R16, 7) + auTo16(' . . . . G6 - D6 - |', true) +
      ' . . . A6 . . . . . . E6 . . . . . | . . . . . . C7 . . . . . . A6 . . | . . . A6 . . . . . . F6 . . . . . | . . . . . . G#6 . . . . . . B6 . . |' +
      ' . . . E6 . . . . . . A6 . . . . . | . . . . . . E6 . . . . . . C7 . . | . . . F#6 . . . . . . A6 . . . . . | . . . . . . G#6 . . . . . . B6 . . |' +
      auTo16(AU_LOOP_ARP, true) +
      Q.au.rep(AU_R16, 4) + auType('C#6', 'A5', 'E5') + auType('D6', 'A5', 'F5') + auType('D6', 'Bb5', 'F5') + auType('D6', 'B5', 'G5');
    var AU_ENC_DRUM =
      auTo16(Q.au.rep('k p s k p k s p |', 7) + ' k p s k s s s! s! |', true) +
      Q.au.rep(' k . h . . . k . s . h . k . h . |', 7) + ' k . s . s . k . s s s s k s s! s! |' +
      auTo16(AU_LOOP_DRUM, true) +
      auTo16(' x h s h k h s h |' + Q.au.rep('k h s h k h s h |', 6) + ' k s k s k s s! s! |', true);
    Q.defSong('encore', { bpm: 168, parts: 8, vol: 1.18, voices: [
      { wave: 'square', vol: 0.019, sub: 2, notes: AU_ENC_LEAD },
      { wave: 'triangle', vol: 0.028, gate: 0.9, sub: 2, notes: AU_ENC_BASS },
      { wave: 'sawtooth', vol: 0.011, sub: 2, notes: AU_ENC_SAW },
      { wave: 'sine', vol: 0.013, gate: 0.6, sub: 2, notes: AU_ENC_HIGH },
      { drum: true, vol: 0.8, sub: 2, notes: AU_ENC_DRUM }
    ] });

    // ROOT: 96 bpm, quiet, a music box in an old folder: 16 bars in four parts of 4, each world's own tune played slowly and softly on a round triangle, a sine
    // music box on the beats, long low notes, a clock's tick and a breath of wind at each part (parts: 4, so a room of world n starts on its world's tune):
    //   1 THE INBOX, C major   2 THE SERVER ROOM, A minor (its raised sixth)   3 THE CLOUD, D major (its raised fourth)   4 THE BACKLOG, E minor, its climb, then home to C.
    function auStrong(s) { return String(s).replace(/(^|\s)([A-G][#b]?[0-8])(?=\s|$)/g, '$1$2!'); }   // every note of a run a little stronger
    function auBox(a, b, c, d) { return ' ' + a + ' - - - ' + b + ' - - - ' + c + ' - - - ' + d + ' - - - |'; }   // a music box: a note a beat (sub: 2)
    function auHalf(a, b) { return ' ' + a + ' - - - - - - - ' + b + ' - - - - - - - |'; }                       // two long notes a bar (sub: 2)
    var AU_ROOT_LEAD =
      auTo16(auStrong('E5 . E5 G5 . E5 . C5 | D5 . D5 F5 . D5 . B4 | C5 . C5 E5 . C5 . A4 | B4 . G4 . A4 B4 C5 D5 |'), false) +   // (its notes stronger: it has the most rests)
      ' A4 - - - - - - - E5 - - - C5 - B4 - | A4 - - - - - - - . . E5 F#5 G5 - F#5 - | A4 - - - - - - - C5 - - - F5 - E5 - | D5 - - - - - - - B4 - - - G4 - - - |' +
      ' A5 - - - - - - - F#5 - - - E5 - - - | G#5 - - - - - - - B5 - - - - - - - | A5 - - - F#5 - - - D5 - - - E5 - - - | F#5 - - - - - - - D5 - - - B4 - - - |' +
      auTo16(Q.au.shift('E4 . G4 . B4 - A4 G4 | F#4 . A4 . C5 - B4 A4 | G4 . B4 . D5 - C5 B4 | A4 . C5 . E5 - D5 C5 |', 12), false);
    var AU_ROOT_BOX =
      auBox('C6', 'E6', 'G6', 'E6') + auBox('B5', 'D6', 'G6', 'D6') + auBox('A5', 'C6', 'E6', 'C6') + auBox('B5', 'D6', 'G6', 'D6') +
      auBox('A5', 'C6', 'E6', 'C6') + auBox('A5', 'C6', 'F#6', 'C6') + auBox('A5', 'C6', 'F6', 'C6') + auBox('B5', 'D6', 'G6', 'D6') +
      auBox('D6', 'F#6', 'A6', 'F#6') + auBox('E6', 'G#6', 'B6', 'G#6') + auBox('B5', 'D6', 'F#6', 'D6') + auBox('G5', 'B5', 'D6', 'B5') +
      auBox('E6', 'G6', 'B6', 'G6') + auBox('F#5', 'A5', 'C6', 'A5') + auBox('G5', 'B5', 'D6', 'B5') + auBox('A5', 'C6', 'E6', 'C6');
    var AU_ROOT_BASS =
      auHalf('C3', 'G2') + auHalf('G2', 'D3') + auHalf('A2', 'E3') + auHalf('G2', 'D3') +
      auHalf('A2', 'E3') + auHalf('A2', 'E3') + auHalf('F2', 'C3') + auHalf('G2', 'D3') +
      auHalf('D3', 'A2') + auHalf('D3', 'E3') + auHalf('B2', 'F#2') + auHalf('G2', 'D3') +
      auHalf('E2', 'B2') + auHalf('F#2', 'A2') + auHalf('G2', 'D3') + auHalf('A2', 'E3');
    Q.defSong('root', { bpm: 96, parts: 4, vol: 1, voices: [
      { wave: 'triangle', vol: 0.03, gate: 0.9, sub: 2, notes: AU_ROOT_LEAD },
      { wave: 'sine', vol: 0.011, gate: 0.7, sub: 2, notes: AU_ROOT_BOX },
      { wave: 'triangle', vol: 0.024, gate: 0.9, sub: 2, notes: AU_ROOT_BASS },
      { drum: true, vol: 0.6, notes: Q.au.rep(' w . h_ . t_ . h_ . |' + Q.au.rep('k_ . h_ . t_ . h_ . |', 3), 4) }
    ] });

    // STAR: a gold star, won during play: bright and short (0.27 s), a fifth leaping up high (A6 to E7) on a soft body, a breath of sparkle; it sits under the music's
    // loudest moments and over its average, so it is heard without covering the tune (a fifth sits well in every world's key).
    Q.defSfx('star', function (api) {
      api.tone(1760, 1760, 0.12, 'sine', 0.03);
      api.tone(880, 880, 0.1, 'triangle', 0.025);
      api.tone(2637.02, 2637.02, 0.2, 'sine', 0.028, 0.07);
      api.noise(0.08, 7000, 9000, 'highpass', 1, 0.02, 0.05);
    });
    // README: README.TXT opening, the first file on the 9F computer: a soft swell of air, then the conductor's motif slowed and hushed (two taps on G, the leap up
    // to C), and a C major chord left ringing (1.24 s).
    Q.defSfx('readme', function (api) {
      api.noise(0.7, 400, 1600, 'bandpass', 0.7, 0.02);
      api.tone(783.99, 783.99, 0.14, 'sine', 0.026, 0.1);
      api.tone(783.99, 783.99, 0.14, 'sine', 0.026, 0.28);
      api.tone(1046.5, 1046.5, 0.75, 'triangle', 0.028, 0.46);
      api.tone(1318.51, 1318.51, 0.6, 'sine', 0.02, 0.6);
      api.tone(1567.98, 1567.98, 0.5, 'sine', 0.02, 0.74);
    });
