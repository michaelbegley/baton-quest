    // ---------- 33-audio-songs-b.js: worlds 2, 3 and 4 (AUDIO, builder 14): THE BATON in each world's mood, 8-bit big band (MUSIC-NOTES.md) ----------
    function auHumOf(chords, lo, hi) {   // the server room's hum: each chord's root on every swung eighth, leaning on the beats (a two-chord bar: four each)
      var L = auMidi(lo), H = auMidi(hi), prev = Math.round((L + H) / 2);
      return String(chords).split(/\s+/).filter(function (x) { return x && x !== '|'; }).map(function (bar) {
        return bar.split('.').map(function (c, q, all) { var r = auNear(auChord(c).r, prev, L, H), nm = auName(r), k, s = ''; prev = r; for (k = 0; k < 8 / all.length; k++) s += ' ' + nm + (k % 2 ? '_' : ''); return s; }).join('') + ' |';
      }).join('');
    }
    function auRoll(chords, lo, per) {   // soft broken chords rolling up and down, one note a step (per: steps a bar), from the root nearest lo
      var L = auMidi(lo), k = [0, 1, 2, 3, 2, 1, 0, 1];
      return String(chords).split(/\s+/).filter(function (x) { return x && x !== '|'; }).map(function (bar) {
        var c = auChord(bar.split('.')[0]), r = auNear(c.r, L, L - 6, L + 6), tones = [r, r + c.iv[1], r + c.iv[2], r + 12], s = '', i;
        for (i = 0; i < per; i++) s += ' ' + auName(tones[k[i % k.length]]);
        return s + ' |';
      }).join('');
    }

    // W2, THE SERVER ROOM: A dorian (A minor with a cool raised sixth, F#), 112 bpm, swung 0.37, cool and steady. The triangle hums: each chord's root on every
    // swung eighth, never stopping. Over it THE BATON's minor face in A, its sixths raised, so bar 3's leap is a plain fourth again (F# F# B); the section holds one
    // cool note a bar (the guide tones); the rack lights blink high on chord tones; then 8 bars where the hum carries on alone and the motif blinks back, an echo.
    var AU_W2_TH = auMap(AU_SH(AU_BATON_MA + AU_BATON_MB, -3), function (n) { return n % 12 === 5 ? n + 1 : n; });
    var AU_W2_CH = 'Am6 Am6 Bm7 E7 Am6 D7 Bm7.E7 Am6 D7 D7 Cmaj7 B7 Bm7 E7 Am6 Am6', AU_W2_BR = 'Am6 Am6 Fmaj7 G6 Am6 Am6 D7 E7';
    var AU_W2_ECHO = ' E5 . E5 . A5 - - - | . . . . . . . . | C5 . C5 . F5 - - - | . . . . D5 - B4 - | E5 . E5 . A5 - - - | . . . . . . . . | F#5 . F#5 . B5 - - - | G#5 - - - E5 - - - |';
    Q.defSong('w2', { bpm: 112, swing: 0.37, vol: 1.19, voices: [
      { wave: 'square', vol: 0.018, gate: 0.9, notes: AU_W2_TH + AU_W2_ECHO },
      { wave: 'triangle', vol: 0.027, gate: 0.55, notes: auHumOf(AU_W2_CH + ' ' + AU_W2_BR, 'E2', 'D3') },
      { wave: 'square', vol: 0.01, gate: 0.95, notes: auGuide(AU_W2_CH + ' ' + AU_W2_BR, ' X - - - - - - - |', 'C4', 'B4') },
      { wave: 'triangle', vol: 0.014, gate: 0.4, notes: auGuide(AU_W2_CH + ' ' + AU_W2_BR, ' . . . X . . . . | . . . . . . X . | . X . . . . . . | . . . . . X . . |', 'E6', 'D7') },
      { drum: true, vol: 0.5, notes: AU_R(AU_RIDE, 24) },
      { drum: true, vol: 0.7, notes: AU_R(AU_R(' k_ . . . . . t_ . |', 7) + ' k_ . . . t_ . t_ t |', 3) }
    ] });

    // W3, THE CLOUD: D major with a floating raised fourth (G#), a jazz waltz (3/4), 96 bpm, swung 0.40, airy. The motif fits one bar of three: tap, tap, and the
    // leap on beat 3, held into the next bar. Slow bells (a high triangle) sing THE BATON in three; the section chops beats 2 and 3 softly (the waltz's comp);
    // soft broken chords roll up high; the bass plays 1 and 3; brushes, and a breath of wind every eight bars. The second time, the section sings a third under.
    var AU_W3_A =
      ' A4 . A4 . D5 - | - - E5 - F#5 - | G#5 - - - E5 - | F#5 - - - . . | F#4 . F#4 . B4 - | - - C#5 - D5 - | E5 - - - G#4 - | A4 - - - . . |' +
      ' D5 . D5 . G5 - | - - A5 - B5 - | A5 - - - F#5 - | D5 - - - . . | B4 . B4 . E5 - | - - F#5 - G5 - | F#5 - - - E5 - | D5 - - - . . |';
    var AU_W3_A2 = auCut(AU_W3_A, 1, 12) + ' B4 . B4 . E5 - | - - G#5 - A5 - | B5 - - - G#5 - | A5 - - - - - |';
    var AU_W3_CH = 'D6 D6 E D6 Bm7 Bm7 E7 A7 G6 G6 F#m7 Bm7 Em7 A7 D6 D6', AU_W3_CH2 = auSome(AU_W3_CH, 1, 12) + ' Em7 E D6 A7';   // sixths, not sevenths, under the bells' roots
    var AU_W3_BASS = ' D3 - - - A2 - | D3 - - - A2 - | D3 - - - B2 - | D3 - - - A2 - | B2 - - - F#2 - | B2 - - - F#2 - | E2 - - - B2 - | A2 - - - E2 - |' +
      ' G2 - - - D3 - | G2 - - - D3 - | F#2 - - - C#3 - | B2 - - - F#2 - | E2 - - - B2 - | A2 - - - E2 - | D3 - - - A2 - | D3 - - - A2 - |';
    var AU_W3_BASS2 = auCut(AU_W3_BASS, 1, 12) + ' E2 - - - B2 - | D3 - - - B2 - | D3 - - - A2 - | A2 - - - E2 - |';
    var AU_W3_KIT = ' w . f . f_ . |' + AU_R(' u . f . f_ . |', 7);
    Q.defSong('w3', { bpm: 96, bar: 6, swing: 0.4, vol: 0.93, voices: [
      { wave: 'triangle', vol: 0.032, gate: 0.95, max: 1.6, notes: AU_W3_A + AU_W3_A2 },
      { wave: 'square', vol: 0.009, gate: 0.4, notes: auGuide(AU_W3_CH, ' . . X_ . X_ . |', 'A3', 'A4') + auDia(AU_W3_A2, 'D', -2, AU_LYD) },
      { wave: 'square', vol: 0.006, gate: 0.5, notes: auRoll(AU_W3_CH + ' ' + AU_W3_CH2, 'A4', 6) },
      { wave: 'triangle', vol: 0.03, gate: 0.9, notes: AU_W3_BASS + AU_W3_BASS2 },
      { drum: true, vol: 0.7, notes: AU_R(AU_W3_KIT, 4) }
    ] });

    // W4, THE BACKLOG: E minor, 152 bpm, swung 0.30, tense and driving. The bass walks up a step every bar (E F# G A B C D, then B to come back) and the motif
    // climbs with it, a bar a step, each tap on the chord's fifth leaping to its root; then the brass hammers repeated notes higher and higher over a clock's tick
    // (a deadline); then THE BATON's minor face in E, the deadline's own tune, and up again.
    var AU_W4_CLIMB = ' B4 . B4 . E5 - D5 E5 | C#5 . C#5 . F#5 - E5 F#5 | D5 . D5 . G5 - F#5 G5 | E5 . E5 . A5 - G5 A5 | F#5 . F#5 . B5 - A5 B5 | G5 . G5 . C6 - B5 C6 | A5 . A5 . D6 - C6 D6 | B5 - A5 - F#5 - D#5 - |';
    var AU_W4_HAM = ' E5! . E5 . E5 - D5 E5 | F#5! . F#5 . F#5 - E5 F#5 | G5! . G5 . G5 - F#5 G5 | A5! . A5 . A5 - G5 A5 | B5! . B5 . B5 - A5 B5 | C6! . A5 . G5 . E5 . | F#5! . E5 . D5 . C5 . | A5 - F#5 - D#5 - B4 - |';
    var AU_W4_TH = AU_SH(auCut(AU_BATON_MA, 1, 8), 4);
    var AU_W4_CCH = 'Em7 F#m7 Gmaj7 A7 Bm7 Cmaj7 D7 B7', AU_W4_CH = AU_W4_CCH + ' ' + AU_W4_CCH + ' ' + auChords(auSome(AU_BATON_MCH, 1, 8), 4);
    var AU_W4_UP = ' E2 - G2 - B2 - F2 - | F#2 - A2 - C#3 - Ab2 - | G2 - B2 - D3 - G#2 - | A2 - C#3 - E3 - Bb2 - | B2 - D3 - F#3 - Db3 - | C3 - E3 - G3 - C#3 - | D3 - F#3 - A3 - C3 - | B2 - A2 - F#2 - F2 - |';   // the climb, walked up a step a bar
    var AU_W4_JUMP = ' E2 E3 E2 E3 E2 E3 D3 E3 | F#2 F#3 F#2 F#3 F#2 F#3 E3 F#3 | G2 G3 G2 G3 G2 G3 F#3 G3 | A2 A3 A2 A3 A2 A3 G3 A3 | B2 B3 B2 B3 B2 B3 A3 B3 | C3 C4 C3 C4 C3 C4 B3 C4 | D3 D4 D3 D4 D3 D4 C4 D4 | B2 B3 A2 A3 F#2 F#3 F2 F3 |';   // the same climb jumping octaves, driving
    Q.defSong('w4', { bpm: 152, swing: 0.3, vol: 1.01, voices: [
      { wave: 'square', vol: 0.018, gate: 0.6, notes: AU_W4_CLIMB + AU_W4_HAM + AU_W4_TH },
      { wave: 'square', vol: 0.011, gate: 0.5, notes: auGuide(AU_W4_CCH, ' . . . . . X_ X . |', 'E4', 'D5') + auGuide(AU_W4_CCH, ' X! . X . X - . . |', 'D4', 'C5') + auGuide(auSome(AU_W4_CH, 17, 24), ' . . . . . . X_ X |', 'E4', 'D5') },
      { wave: 'sawtooth', vol: 0.009, gate: 0.45, notes: auGuide(AU_W4_CCH, ' . . . . . . . X |', 'G3', 'F4') + auGuide(AU_W4_CCH, ' X! . X . X - . . |', 'G3', 'F4') + auGuide(auSome(AU_W4_CH, 17, 24), ' . . . . X . . . | . . . . . . . X |', 'G3', 'F4') },
      { wave: 'triangle', vol: 0.033, gate: 0.8, notes: AU_W4_UP + AU_W4_JUMP + auWalk(auSome(AU_W4_CH, 17, 24), 'E2', 'D4', 'F2') },
      { drum: true, vol: 0.7, notes: AU_R(AU_RIDE, 8) + AU_R(' t . t t_ t . t t_ |', 8) + AU_R(AU_RIDE, 8) },
      { drum: true, vol: 0.85, notes: AU_KX + AU_R(AU_KB + AU_KA, 3) + AU_KF + ' x . s_ . k . s_ . |' + AU_R(' k . s_ . k . s_ k_ |', 6) + AU_KF + AU_KX + AU_R(AU_KB + AU_KA, 3) + ' k_ . s s s s s! s! |' }
    ] });
