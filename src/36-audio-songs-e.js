    // ---------- 36-audio-songs-e.js: a boss theme for each of worlds 1 to 3 (AUDIO, builder 14): THE BATON's minor face in each world's colour, 8-bit big band ----------
    // One family, built on 'boss' (34-audio-songs-c.js): the minor theme and the riff leaning 3 + 3 + 2. Joined pairs (the same join name and as many bars) switch at
    // the next bar line, at the same bar, each at its own tempo.
    function auLean3(chords, lo, hi, hot) {   // the hum leaning 3 + 3 + 2 on each chord's root, one note a swung eighth (hot: its leaning notes an octave up)
      var L = auMidi(lo), H = auMidi(hi), prev = Math.round((L + H) / 2);
      return String(chords).split(/\s+/).filter(function (x) { return x && x !== '|'; }).map(function (bar) {
        var rs = bar.split('.').map(function (c) { var r = auNear(auChord(c).r, prev, L, H); prev = r; return [auName(r), auName(hot ? r + 12 : r)]; }), a = rs[0], b = rs[rs.length - 1];
        return ' ' + [a[1] + '!', a[0] + '_', a[0], b[1] + '!', b[0] + '_', b[0], b[1] + '!', b[0] + '_'].join(' ') + ' |';
      }).join('');
    }
    function auEcho(s) {   // the lead's taps copied onto the off-beats an octave down (everyone on CC): a bar opening 'X . X .' echoes as '. X_ . X_'
      return String(s).split('|').filter(function (b) { return /\S/.test(b); }).map(function (b) {
        var t = b.split(/\s+/).filter(function (x) { return !!x; }), n = auMidi(t[0]);
        if (n === null || t[0] !== t[2] || t[1] !== '.' || t[3] !== '.') return ' . . . . . . . . |';
        return ' . ' + auName(n - 12) + '_ . ' + auName(n - 12) + '_ . . . . |';
      }).join('');
    }

    // BOSS-HYDRA, THE REPLY-ALL HYDRA: C minor, 160 bpm, swung 0.28, bouncy, papery and a little pompous. THE BATON's minor face hopping (staccato), every tap
    // echoed an octave down on the off-beat (everyone on CC), then B as a pompous fanfare (accented); a nasal sawtooth answers every second bar with RE: RE: (two
    // notes a fourth apart, the motif's own leap), and twice (reply-all) at each half's end; the riff under it; paper plays the ride; the kit marches in two.
    var AU_HYD_LEAD = AU_BATON_MA + AU_BATON_MB.replace(/(^\s*|\| )(\S+) \. (\S+) \. (\S+)/g, '$1$2! . $3! . $4!');   // B: the taps and the leap accented
    var AU_HYD_RE = ' . . . . . . . . | . . . . . . G4 C5 | . . . . . . . . | . . . . . . D5 G5 | . . . . . . . . | . . . . . . Eb5 Ab5 | . . . . . . . . | . . . . G4 C5 G4 C5 |' +
      ' . . . . . . . . | . . . . . . C5 F5 | . . . . . . . . | . . . . . . A4 D5 | . . . . . . . . | . . . . . . D5 G5 | . . . . . . . . | . . . . G4 C5 G4 C5 |';
    var AU_HYD_KIT = ' x . s . k . s . |' + AU_R(' k . s . k . s . |', 6) + ' k . s s_ k s s! s! |';
    Q.defSong('boss-hydra', { bpm: 160, swing: 0.28, vol: 1.27, voices: [
      { wave: 'square', vol: 0.02, gate: 0.5, notes: AU_HYD_LEAD },
      { wave: 'square', vol: 0.011, gate: 0.4, notes: auEcho(AU_HYD_LEAD) },
      { wave: 'sawtooth', vol: 0.011, gate: 0.5, notes: AU_HYD_RE },
      { wave: 'triangle', vol: 0.027, gate: 0.45, notes: auRiffs(AU_BATON_MCH, 'C2', 'C4') },
      { drum: true, vol: 0.75, notes: AU_R(' p . p p_ p . p p_ |', 16) },
      { drum: true, vol: 0.78, notes: AU_HYD_KIT + AU_HYD_KIT }
    ] });

    // BOSS-OVERHEAT, THE OVERHEAT: A minor, 120 bpm, swung 0.35, a slow burn: the hum leaning 3 + 3 + 2 on the triangle (the riff as a hum), THE BATON's minor
    // face held long above it, a cool note a bar under it, the racks' lights blinking high. BOSS-OVERHEAT2, its last phase (joined: Q.music('boss-overheat2')
    // takes over at the next bar line, at the same bar): hotter and faster, 138 bpm, the hum leaping an octave on its leaning notes, the tune cut short and pushed,
    // a sawtooth buzzing an octave under it, the lights blinking twice as often, the kit busier.
    var AU_HEAT_LEAD = AU_SH(AU_BATON_MA + AU_BATON_MB, -3), AU_HEAT_CH = auChords(AU_BATON_MCH, -3);
    Q.defSong('boss-overheat', { bpm: 120, swing: 0.35, join: 'overheat', vol: 1.22, voices: [
      { wave: 'square', vol: 0.018, gate: 0.95, notes: AU_HEAT_LEAD },
      { wave: 'triangle', vol: 0.027, gate: 0.5, notes: auLean3(AU_HEAT_CH, 'E2', 'D3') },
      { wave: 'square', vol: 0.009, gate: 0.95, notes: auGuide(AU_HEAT_CH, ' X - - - - - - - |', 'C4', 'B4') },
      { wave: 'triangle', vol: 0.013, gate: 0.35, notes: auGuide(AU_HEAT_CH, ' . . . X . . . . | . . . . . . X . | . X . . . . . . | . . . . . X . . |', 'E6', 'D7') },
      { drum: true, vol: 0.55, notes: AU_R(AU_RIDE, 16) },
      { drum: true, vol: 0.8, notes: AU_R(' k . . . k . t_ . |', 7) + ' k . s_ s k . s s! |' + AU_R(' k . . . k . t_ . |', 7) + ' k . s_ s k s s! s! |' }
    ] });
    Q.defSong('boss-overheat2', { bpm: 138, swing: 0.32, join: 'overheat', vol: 1.27, voices: [
      { wave: 'square', vol: 0.021, gate: 0.6, notes: AU_HEAT_LEAD },
      { wave: 'sawtooth', vol: 0.01, gate: 0.6, notes: AU_SH(AU_HEAT_LEAD, -12) },
      { wave: 'triangle', vol: 0.027, gate: 0.5, notes: auLean3(AU_HEAT_CH, 'E2', 'D3', true) },
      { wave: 'triangle', vol: 0.013, gate: 0.35, notes: auGuide(AU_HEAT_CH, ' . X . X . . X . | . . X . . X . X |', 'E6', 'D7') },
      { drum: true, vol: 0.6, notes: AU_R(AU_RIDE, 16) },
      { drum: true, vol: 0.78, notes: AU_R(' k . s_ k k . s k_ |', 7) + ' k s s s k s s! s! |' + AU_R(' k . s_ k k . s k_ |', 7) + ' k s s s k s s! s! |' }
    ] });

    // BOSS-LOOP, THE INFINITE LOOP: 128 bpm, swung 0.33, airy and dizzy: one two-bar phrase (THE BATON's motif on A, leaping to D, then a lift through the raised
    // fourth, G#) played four times, each time a major third higher (D, F#, A#, then D an octave up), so after three climbs it is home again, higher, and the
    // loop starts over below; the riff under it, soft running chords above, a breath of wind at each climb. BOSS-LOOP2: the same in double time, 256 bpm, nearly
    // straight (joined: Q.music('boss-loop2') takes over at the next bar line, at the same bar).
    var AU_LOOP_PHRASE = ' A3 . A3 . D4 - - E4 | F#4 - D4 - E4 F#4 G#4 - |';
    var AU_LOOP_LEAD = AU_LOOP_PHRASE + AU_SH(AU_LOOP_PHRASE, 4) + AU_SH(AU_LOOP_PHRASE, 8) + AU_SH(AU_LOOP_PHRASE, 12);
    var AU_LOOP_BASS = auRiff('D2', 'D3') + auRiff('D2', 'D3') + auRiff('F#2', 'F#3') + auRiff('F#2', 'F#3') + auRiff('A#2', 'A#3') + auRiff('A#2', 'A#3') + auRiff('D3', 'D4') + auRiff('D3', 'D4');
    var AU_LOOP_ARP = auRun('D5', 'F#5', 'A5') + auRun('E5', 'G#5', 'B5') + auRun('F#5', 'A#5', 'C#6') + auRun('G#5', 'C6', 'D#6') +
      auRun('A#4', 'D5', 'F5') + auRun('C5', 'E5', 'G5') + auRun('D5', 'F#5', 'A5') + auRun('E5', 'G#5', 'B5');
    var AU_LOOP_KIT = AU_R(' k w . . s . . . | k . . s_ s . . k_ |', 4);
    Q.defSong('boss-loop', { bpm: 128, swing: 0.33, join: 'loop', vol: 1.22, voices: [
      { wave: 'square', vol: 0.019, gate: 0.8, notes: AU_LOOP_LEAD },
      { wave: 'triangle', vol: 0.028, gate: 0.45, notes: AU_LOOP_BASS },
      { wave: 'square', vol: 0.007, gate: 0.45, notes: AU_LOOP_ARP },
      { drum: true, vol: 0.6, notes: AU_R(AU_RIDE, 8) },
      { drum: true, vol: 0.8, notes: AU_LOOP_KIT }
    ] });
    Q.defSong('boss-loop2', { bpm: 256, swing: 0.12, join: 'loop', vol: 1.17, voices: [
      { wave: 'square', vol: 0.019, gate: 0.8, notes: AU_LOOP_LEAD },
      { wave: 'triangle', vol: 0.028, gate: 0.45, notes: AU_LOOP_BASS },
      { wave: 'square', vol: 0.007, gate: 0.45, notes: AU_LOOP_ARP },
      { drum: true, vol: 0.6, notes: AU_R(AU_RIDE, 8) },
      { drum: true, vol: 0.8, notes: AU_LOOP_KIT }
    ] });
