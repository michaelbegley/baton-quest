    // ---------- 37-audio-overtime.js: version 116, THE OVERTIME UPDATE (AUDIO, builders 4 and 14): our own tunes and sounds, 8-bit big band (MUSIC-NOTES.md) ----------
    // ENCORE: the four bosses' themes as one fast medley that loops, through all four fights of THE ENCORE. ROOT: a quiet medley of the four worlds' tunes, for the
    // five rooms of THE ROOT FOLDER. Both are in four parts, one a world (parts: in a level of world n, a start begins at part n, so a fight or a room starts on its
    // own world's tune and the medley goes on round from there). Every one of them is THE BATON in a mood. STAR: a gold star's chime. README: README.TXT's reveal.
    function auBox(chords, lo) {   // a music box: each chord's notes one a beat (root, third, fifth, third), from the root nearest lo
      var L = auMidi(lo);
      return String(chords).split(/\s+/).filter(function (x) { return x && x !== '|'; }).map(function (bar) {
        var c = auChord(bar.split('.')[0]), r = auNear(c.r, L, L - 6, L + 6);
        return ' ' + [r, r + c.iv[1], r + c.iv[2], r + c.iv[1]].map(auName).join(' . ') + ' . |';
      }).join('');
    }
    var AU_REST8 = ' . . . . . . . . |';

    // ENCORE: 168 bpm (the bosses' own 'boss' tempo, every theme quicker than in its fight), swung 0.28, 32 bars in four parts of 8, round and round:
    //   1 THE REPLY-ALL HYDRA, C minor: the minor theme hopping, the RE: RE: replies on the nasal sawtooth, the taps echoed up high, paper on the ride
    //   2 THE OVERHEAT, A minor: the minor theme over the leaning hum, the racks' lights; in its second half the hum leaps and a sawtooth buzzes under the tune
    //   3 THE INFINITE LOOP: the phrase that climbs a major third each time round (D, F#, A#, then D higher), over the riff and the running chords, wind at each climb
    //   4 SCOPE CREEP, D minor: the march's growing question, then the theme, the brass oom-pah, C1 typing in the last four bars, and the boing turned to G at the
    //     end, so the medley goes round to the hydra's C minor.
    // The engine asks for it at each fight; while Q.encoreOn() is true, Q.music lets any other song go (a boss's own, SCOPE CREEP's final2 and final3), and a start
    // begins at that fight's boss's part (parts: 8), so after the stop at each beaten boss the next fight opens on its own theme.
    var AU_ENC_FCH = auSome(AU_FINAL_CH, 1, 7) + ' G7';
    var AU_ENC_LEAD = AU_BATON_MA + auCut(AU_HEAT_LEAD, 1, 8) + AU_LOOP_LEAD + auCut(AU_FINAL_LEAD, 1, 7) + ' G5_ - - - G4>G5 - - - |';   // the boing, softly, so the loop's last downbeat stays under the room's loud sounds (b4_mix_test.js)
    var AU_ENC_SAW = auCut(AU_HYD_RE, 1, 8) + AU_R(AU_REST8, 4) + AU_SH(auCut(AU_HEAT_LEAD, 5, 8), -12) + AU_R(AU_REST8, 8) + auGuide(AU_ENC_FCH, ' . . X . . . X . |', 'A3', 'G4');
    var AU_ENC_BASS = auRiffs(auSome(AU_BATON_MCH, 1, 8), 'C2', 'C4') + auLean3(auSome(AU_HEAT_CH, 1, 4), 'E2', 'D3') + auLean3(auSome(AU_HEAT_CH, 5, 8), 'E2', 'D3', true) +
      AU_LOOP_BASS + auCut(AU_FINAL_BASS, 1, 7) + ' G2 - - - D3 - - - |';
    var AU_ENC_HIGH = AU_SH(auEcho(AU_BATON_MA), 24) + auGuide(auSome(AU_HEAT_CH, 1, 8), ' . . . X . . . . | . . . . . . X . | . X . . . . . . | . . . . . X . . |', 'E6', 'D7') +
      AU_LOOP_ARP + AU_R(AU_REST8, 4) + auGuide(auSome(AU_ENC_FCH, 5, 8), ' X X_ X X_ X X_ X X_ |', 'F#5', 'E6');
    var AU_ENC_DRUM = AU_R(' k . p p_ s . p p_ |', 7) + ' k . s s_ k s s! s! |' + AU_R(' k . r r_ k . q t_ |', 7) + ' k . s_ s k s s! s! |' +
      AU_R(' k w r r_ s . q r_ | k . q r_ s . q k_ |', 4) + ' x . s . k . s . |' + AU_R(' k . s . k . s . |', 6) + ' k_ . s_ s k s s s! |';
    Q.defSong('encore', { bpm: 168, swing: 0.28, parts: 8, vol: 1.27, voices: [
      { wave: 'square', vol: 0.019, gate: 0.65, notes: AU_ENC_LEAD },
      { wave: 'triangle', vol: 0.027, gate: 0.6, notes: AU_ENC_BASS },
      { wave: 'sawtooth', vol: 0.01, gate: 0.5, notes: AU_ENC_SAW },
      { wave: 'triangle', vol: 0.013, gate: 0.4, notes: AU_ENC_HIGH },
      { drum: true, vol: 0.8, notes: AU_ENC_DRUM }
    ] });

    // ROOT: 96 bpm, swung 0.40, quiet, a music box in an old folder: 16 bars in four parts of 4 (parts: 4, so a room of world n starts on its world's tune), each
    // world's THE BATON played slowly and softly on a round triangle, a music box on the beats, two long low notes a bar, a clock's tick and a breath of wind:
    //   1 THE INBOX, C major   2 THE SERVER ROOM, A dorian (its raised sixth)   3 THE CLOUD, D with its raised fourth (the waltz's opening, in four)
    //   4 THE BACKLOG, E minor, its climb, then a turn to G, home to C.
    var AU_ROOT_LEAD = auCut(AU_BATON_A, 1, 4) + auCut(AU_W2_TH, 1, 4) +
      ' A4 . A4 . D5 - - - | E5 - F#5 - G#5 - - - | E5 - - - F#5 - - - | D5 - - - . . . . |' +
      ' B4 . B4 . E5 - D5 E5 | C#5 . C#5 . F#5 - E5 F#5 | D5 . D5 . G5 - F#5 G5 | D5 . D5 . G5 - F5 B4 |';
    var AU_ROOT_CH = 'C6 Am7 Dm7 G7 Am6 Am6 Bm7 E7 D6 E E D6 Em7 F#m7 Gmaj7 G7';
    Q.defSong('root', { bpm: 96, swing: 0.4, parts: 4, vol: 1.08, voices: [
      { wave: 'triangle', vol: 0.03, gate: 0.9, notes: AU_ROOT_LEAD },
      { wave: 'square', vol: 0.007, gate: 0.6, notes: auBox(AU_ROOT_CH, 'C6') },
      { wave: 'triangle', vol: 0.024, gate: 0.9, notes: auWalk(AU_ROOT_CH, 'C2', 'Bb3', null, 2, 4) },
      { drum: true, vol: 0.6, notes: AU_R(' w . h_ . t_ . h_ . |' + AU_R(' k_ . h_ . t_ . h_ . |', 3), 4) }
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
