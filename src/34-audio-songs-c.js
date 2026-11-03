    // ---------- 34-audio-songs-c.js: the bosses' song and SCOPE CREEP's march (AUDIO, builder 14): THE BATON's minor face, 8-bit big band (MUSIC-NOTES.md) ----------
    // The bosses have the conductor's tune now: every boss theme is THE BATON in minor (32-audio-songs-a.js), each in its world's colour (36-audio-songs-e.js).
    function auRiff(lo, hi) { return ' ' + lo + '! ' + hi + ' ' + lo + ' ' + lo + '! ' + hi + ' ' + lo + ' ' + lo + '! ' + hi + ' |'; }   // eighths leaning 3 + 3 + 2
    function auPah(a, b, c) { return ' ' + a + ' - ' + b + ' - ' + c + ' - ' + b + ' - |'; }   // a march bass: the root, a chord note up, the fifth, up again
    function auRun(a, b, c) { return ' ' + a + ' ' + b + ' ' + c + ' ' + b + ' ' + a + ' ' + b + ' ' + c + ' ' + b + ' |'; }   // running eighths on a chord
    function auRiffs(chords, lo, hi) {   // the 3 + 3 + 2 riff on each chord's root (a two-chord bar changes at its second lean), the leaning notes an octave down
      var L = auMidi(lo), H = auMidi(hi), prev = Math.round((L + H) / 2);
      return String(chords).split(/\s+/).filter(function (x) { return x && x !== '|'; }).map(function (bar) {
        var rs = bar.split('.').map(function (c) { var r = auNear(auChord(c).r, prev, L + 12, H); prev = r; return [auName(r - 12), auName(r)]; }), a = rs[0], b = rs[rs.length - 1];
        return ' ' + [a[0] + '!', a[1], a[0], b[0] + '!', b[1], b[0], b[0] + '!', b[1]].join(' ') + ' |';
      }).join('');
    }
    var AU_SWK = ' k . . s_ k . s_ . |', AU_SWF = ' k . s s_ s . s! s! |';   // the bosses' kit: kicks on 1 and 3 with the riff, ghost snares, a fill

    // BOSS (the template, and the fallback for any arena): C minor, 168 bpm, swung 0.28, urgent. THE BATON's minor face on the lead, the bass on the 3 + 3 + 2
    // riff under every chord, the brass kicking with the riff's leaning notes, the section a third under the lead for B (a soli), the ride and a busy kit.
    var AU_BOSS_CH = AU_BATON_MCH;
    Q.defSong('boss', { bpm: 168, swing: 0.28, vol: 1.11, voices: [
      { wave: 'square', vol: 0.02, gate: 0.7, notes: AU_BATON_MA + AU_BATON_MB },
      { wave: 'square', vol: 0.011, gate: 0.6, notes: auGuide(auSome(AU_BOSS_CH, 1, 8), ' . . . . . X_ X . | . . . . . . . . |', 'Eb4', 'D5') + auDia(AU_BATON_MB, 'C', -2, AU_HMIN) },
      { wave: 'sawtooth', vol: 0.009, gate: 0.4, notes: auGuide(AU_BOSS_CH, ' X! . . X . . X . |', 'G3', 'F4') },
      { wave: 'triangle', vol: 0.03, gate: 0.5, notes: auRiffs(AU_BOSS_CH, 'C2', 'C4') },
      { drum: true, vol: 0.7, notes: AU_R(AU_RIDE, 16) },
      { drum: true, vol: 0.85, notes: AU_KX + AU_R(AU_SWK, 6) + AU_SWF + AU_KX + AU_R(AU_SWK, 6) + AU_SWF }
    ] });

    // FINAL, SCOPE CREEP (w4-boss): D minor, 138 bpm, swung 0.32, a pompous two-beat swing march, grand and a little silly. SCOPE CREEP twists the conductor's
    // motif into a question that never lands (D D G, the leap to the fourth) and it grows one note longer every bar ("quick ask... while you're in there... just one
    // more thing"); then THE BATON's minor face in D answers it, and a slide that goes boing brings it round. Three songs share it, joined (each takes over at the
    // next bar, at the same place): 'final' with the section echoing a third under; 'final2' with a running counter-line (the tickets piling up); and 'final3'
    // (35-audio-songs-d.js), D major, the agents joining. The bass marches in two (the root and a half step into the next), the brass goes oom-pah on 2 and 4.
    var AU_FINAL_LEAD =
      ' D5 . D5 . G5 - - - | D5 . D5 . G5 - A5 - | D5 . D5 . G5 - A5 Bb5 | D5 . D5 . G5 A5 Bb5 C6 |' + AU_SH(auCut(AU_BATON_MA, 1, 4), 2) + AU_SH(auCut(AU_BATON_MB, 1, 4), 2) +
      ' Bb4 . Bb4 . E5 - - F#5 | G5 - E5 - C#5 E5 - . | D5 - - - A4 - F4 - | A4 - - - A4>A5 - - - |';
    var AU_FINAL_CH = 'Gm6 Gm6 Gm6 A7 Dm6 Dm6 Em7b5 A7 Gm6 Gm6 Fmaj7 E7 Em7b5 A7 Dm6 A7';   // the question's bars: G minor's notes over a D in the bass (it never lands)
    var AU_FINAL_PED = ' D2 - - - A2 - - - | D2 - - - A2 - - - | D2 - - - A2 - - - | A2 - - - E2 - - - |';   // the bass holds D under the question, then A
    var AU_FINAL_BASS = AU_FINAL_PED + auWalk(auSome(AU_FINAL_CH, 5, 16), 'D2', 'C4', 'E2', 2, 4);
    var AU_FINAL_OOM = auGuide(AU_FINAL_CH, ' . . X . . . X . |', 'A3', 'G4');   // the brass: oom-pah on 2 and 4
    var AU_FINAL_KIT = ' x . s . k . s . |' + AU_R(' k . s . k . s . |', 6) + ' k . s s_ k . s s! |' + ' x . s . k . s . |' + AU_R(' k . s . k . s . |', 6) + ' k s . s k s s! s! |';
    Q.defSong('final', { bpm: 138, swing: 0.32, join: 'final', vol: 0.98, voices: [
      { wave: 'square', vol: 0.02, gate: 0.75, notes: AU_FINAL_LEAD },
      { wave: 'square', vol: 0.011, gate: 0.7, notes: auDia(AU_FINAL_LEAD, 'D', -2, AU_HMIN) },
      { wave: 'sawtooth', vol: 0.009, gate: 0.4, notes: AU_FINAL_OOM },
      { wave: 'triangle', vol: 0.034, gate: 0.85, notes: AU_FINAL_BASS },
      { drum: true, vol: 0.65, notes: AU_R(AU_RIDE, 16) },
      { drum: true, vol: 0.85, notes: AU_FINAL_KIT }
    ] });
    // FINAL2, its second phase: the same march, the section's echo traded for a counter-line of running swung eighths on the chords (the tickets piling up).
    var AU_FINAL_RUN = AU_R(auRun('D4', 'F4', 'A4'), 4) + auRun('D4', 'F4', 'A4') + auRun('D4', 'F4', 'B4') + auRun('E4', 'G4', 'Bb4') + auRun('E4', 'G4', 'C#5') +
      auRun('D4', 'G4', 'Bb4') + auRun('D4', 'G4', 'Bb4') + auRun('C4', 'F4', 'A4') + auRun('D4', 'G#4', 'B4') + auRun('E4', 'G4', 'Bb4') + auRun('E4', 'G4', 'C#5') + auRun('D4', 'F4', 'A4') + auRun('C#4', 'E4', 'G4');
    Q.defSong('final2', { bpm: 138, swing: 0.32, join: 'final', vol: 0.96, voices: [
      { wave: 'square', vol: 0.02, gate: 0.75, notes: AU_FINAL_LEAD },
      { wave: 'square', vol: 0.011, gate: 0.5, notes: AU_FINAL_RUN },
      { wave: 'sawtooth', vol: 0.009, gate: 0.4, notes: AU_FINAL_OOM },
      { wave: 'triangle', vol: 0.034, gate: 0.85, notes: AU_FINAL_BASS },
      { drum: true, vol: 0.65, notes: AU_R(AU_RIDE, 16) },
      { drum: true, vol: 0.9, notes: AU_FINAL_KIT.replace(/ k \. s \. k \. s \. \|/g, ' k . s k_ k . s . |') }
    ] });
