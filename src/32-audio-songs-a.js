    // ---------- 32-audio-songs-a.js: THE BATON (the main theme), the helpers every song file uses, the title, the map and world 1 (AUDIO, builder 14) ----------
    // One style for the whole game, 8-bit big band (lab/quest/MUSIC-NOTES.md): two squares (the lead and the section), the triangle walking the bass, a noise kit
    // swinging, a soft sawtooth for the brass, a high triangle for a world's own colour. Every song swings its eighths (its swing: heavier when slow).
    // The conductor's motif runs through the game: one note tapped twice (the baton's two taps), then a leap up a fourth. THE BATON, below, grows from it.
    var AU_R = Q.au.rep, AU_SH = Q.au.shift;
    var AU_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }, AU_NM = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    var AU_MAJ = [0, 2, 4, 5, 7, 9, 11], AU_MIN = [0, 2, 3, 5, 7, 8, 10], AU_HMIN = [0, 2, 3, 5, 7, 8, 11], AU_LYD = [0, 2, 4, 6, 7, 9, 11];   // scales from the key note
    var AU_Q = { '': [0, 4, 7], '6': [0, 4, 7, 9], maj7: [0, 4, 7, 11], '7': [0, 4, 7, 10], m: [0, 3, 7], m6: [0, 3, 7, 9], m7: [0, 3, 7, 10],
      m7b5: [0, 3, 6, 10], dim: [0, 3, 6, 9], aug: [0, 4, 8], sus: [0, 5, 7, 10] };
    function auPcOf(nm) { return AU_PC[nm.charAt(0)] + (nm.charAt(1) === '#' ? 1 : nm.charAt(1) === 'b' ? -1 : 0); }
    function auMidi(nt) { var m = /^([A-G][#b]?)([0-8])$/.exec(nt); return m ? auPcOf(m[1]) + 12 * (+m[2] + 1) : null; }   // a note name as a number (C4 is 60)
    function auName(n) { return AU_NM[((n % 12) + 12) % 12] + (Math.floor(n / 12) - 1); }
    function auMap(s, fn) {   // every note of a run through fn (a number in, a number out); accents, slides, rests, holds and bar lines kept
      return String(s).split(/\s+/).map(function (tk) {
        var end = '', ch = tk.charAt(tk.length - 1);
        if (!tk) return tk;
        if (ch === '!' || ch === '_') { end = ch; tk = tk.slice(0, -1); }
        return tk.split('>').map(function (nt) { var n = auMidi(nt); return n === null ? nt : auName(fn(n)); }).join('>') + end;
      }).join(' ');
    }
    function auDia(s, key, steps, sc) {   // a run moved by steps of a key's scale (a third under it: -2; minor keys use the harmonic minor, AU_HMIN). A note outside
      // the scale (a blue note, a raised sixth) moves by the step of the scale note below it or above it, whichever lands in the scale; else onto the plain one
      var t = auPcOf(key), S = sc || AU_MAJ;
      function inS(m) { return S.indexOf((((m - t) % 12) + 12) % 12) >= 0; }
      function iv(d) { var e = d + steps, oc = Math.floor(e / 7); return S[e - oc * 7] + 12 * oc - S[d]; }   // scale degree d to the one steps away, in semitones
      return auMap(s, function (n) {
        var rel = (((n - t) % 12) + 12) % 12, d = 0, i, lo, up, plain;
        for (i = 0; i < 7; i++) if (S[i] <= rel) d = i;
        lo = n + iv(d);
        if (rel === S[d]) return lo;
        up = n + iv(d + 1 < 7 ? d + 1 : 0); plain = lo - (rel - S[d]);
        if (S[2] === 3) { i = up; up = lo; lo = i; }   // in a minor scale a note outside it is a raised one: try the scale note above it first
        return inS(lo) ? lo : inS(up) ? up : Math.abs(Math.abs(n - plain) - Math.abs(n - lo)) <= 1 ? plain : lo;
      });
    }
    function auChord(c) { var m = /^([A-G][#b]?)(.*)$/.exec(c); return { r: auPcOf(m[1]), iv: AU_Q[m[2]] || AU_Q[''] }; }   // 'Dm7' as its root and its notes
    function auChords(ch, by) {   // chord symbols ('C6 Am7 Dm7.G7') moved by semitones
      return String(ch).replace(/([A-G][#b]?)(m7b5|maj7|m6|m7|dim|aug|sus|m|6|7)?/g, function (all, r, q) { return AU_NM[(((auPcOf(r) + by) % 12) + 12) % 12] + (q || ''); });
    }
    function auNear(pc, ref, lo, hi) {   // the note of a pitch class nearest ref, inside lo to hi
      var best = null, n;
      for (n = lo; n <= hi; n++) if ((((n - pc) % 12) + 12) % 12 === 0 && (best === null || Math.abs(n - ref) < Math.abs(best - ref))) best = n;
      return best === null ? ref : best;
    }
    function auTone(c, from, dir) { var n = from + dir; while (c.iv.indexOf((((n - c.r) % 12) + 12) % 12) < 0) n += dir; return n; }   // the next chord tone up or down
    function auWalk(chords, lo, hi, from, beats, per) {   // a walking bass (MUSIC-NOTES.md A2): the root on beat 1, chord tones toward the next root, a half step into it last
      if (!from) { var w0 = auWalk(chords, lo, hi, auName(Math.round((auMidi(lo) + auMidi(hi)) / 2)), beats, per).split(/\s+/).filter(function (x) { return auMidi(x) !== null; }); from = w0[w0.length - 1]; }   // a loop: start where it ends
      var B = beats || 4, P = per || 2, L = auMidi(lo), H = auMidi(hi), sp = [], out = '', prev = auMidi(from), i, j, k, s, nx, r, tg, dir, ns, cur, ap, fit;
      String(chords).split(/\s+/).forEach(function (bar) {
        if (!bar || bar === '|') return;
        var ps = bar.split('.');
        ps.forEach(function (c, q) { sp.push({ c: auChord(c), b: ps.length === 1 ? B : q ? Math.floor(B / 2) : Math.ceil(B / 2), bar: q === ps.length - 1 }); });
      });
      for (i = 0; i < sp.length; i++) {
        s = sp[i]; nx = sp[(i + 1) % sp.length].c; r = auNear(s.c.r, prev, L, H);
        for (k = 0; k < 2; k++) {   // the next root nearest first; if that walks out of range, the next root in the other octave
          tg = auNear(nx.r, r, L, H); if (tg === r) tg += r - L > H - r ? -12 : 12;   // the same root again: walk to its octave, where there is room
          if (k) tg += tg >= r ? -12 : 12;
          dir = tg >= r ? 1 : -1; ns = [r]; cur = r;
          for (j = 1; j < s.b - 1; j++) { cur = auTone(s.c, cur, dir); ns.push(cur); }
          if (s.b > 1 && B === 2 && P >= 4) ns.push(tg >= r ? r + 7 : r - 5);   // a bass in two (half notes): the root, then its fifth toward the next root, never a long half step
          else if (s.b > 1) { ap = tg > cur ? tg - 1 : tg < cur ? tg + 1 : tg + 7; if (ap === cur) ap = tg + (tg > cur ? 1 : -1); ns.push(ap); }
          fit = ns.every(function (n) { return n >= L && n <= H; });
          if (fit) break;
        }
        for (j = 0; j < ns.length; j++) { while (ns[j] < L) ns[j] += 12; while (ns[j] > H) ns[j] -= 12; out += ' ' + auName(ns[j]) + AU_R('-', P - 1); }
        if (s.bar) out += ' |';
        prev = ns[ns.length - 1];
      }
      return out;
    }
    function auGuide(chords, pat, lo, hi) {   // backgrounds on the guide tones (a chord's third or its sixth or seventh, whichever is nearer the last one), in a rhythm of
      // one or more bars cycled ('X' a hit, 'X!' a loud one, 'X_' a soft one; the second half of a two-chord bar takes the second chord)
      var L = auMidi(lo), H = auMidi(hi), prev = Math.round((L + H) / 2), out = '', pats = String(pat).split('|').map(function (b) { return b.split(/\s+/).filter(function (x) { return !!x; }); }).filter(function (b) { return b.length; });
      String(chords).split(/\s+/).filter(function (x) { return x && x !== '|'; }).forEach(function (bar, bi) {
        var ps = bar.split('.').map(auChord), cells = pats[bi % pats.length], k, c, best, n, iv, acc;
        for (k = 0; k < cells.length; k++) {
          if (cells[k].charAt(0) !== 'X') { out += ' ' + cells[k]; continue; }
          c = ps[ps.length > 1 && k >= cells.length / 2 ? 1 : 0]; acc = cells[k].slice(1); best = null;
          [c.iv[1], c.iv[c.iv.length - 1]].forEach(function (g) { for (n = L; n <= H; n++) if ((((n - c.r - g) % 12) + 12) % 12 === 0 && (best === null || Math.abs(n - prev) < Math.abs(best - prev))) best = n; });
          if (best === null) best = prev;
          prev = best; out += ' ' + auName(best) + acc;
        }
        out += ' |';
      });
      return out;
    }
    function auSome(ch, a, b) { return String(ch).split(/\s+/).filter(function (x) { return !!x; }).slice(a - 1, b).join(' '); }   // chords a to b of a list (one a bar)
    function auCut(s, a, b) { var p = String(s).split('|'), out = '', i; for (i = a - 1; i < b && i < p.length; i++) out += ' ' + p[i].replace(/^\s+|\s+$/g, '') + ' |'; return out; }   // bars a to b

    // THE BATON in C (4/4, swung eighths, 8 steps a bar), MUSIC-NOTES.md part A4: two-bar cells, each the motif (tap, tap, the leap on beat 3) with a blue note
    // leaning into the next bar, then a swinging answer. A: the motif on G, on A, on G. B: moved up a fourth, then home. Under it, its chords.
    var AU_BATON_A =
      ' G4 . G4 . C5 - - Eb5 | E5 - G5 - E5 C5 - . | A4 . A4 . D5 - - E5 | F5 - D5 - B4 D5 - . |' +
      ' G4 . G4 . C5 - - Eb5 | E5 - G5 - A5 G5 E5 C5 | D5 - - Eb5 E5 - D5 - | C5 - - - . . . . |';
    var AU_BATON_B =
      ' C5 . C5 . F5 - - Ab5 | A5 - C6 - A5 F5 - . | B4 . B4 . E5 - - F#5 | G5 - F5 - E5 C#5 - . |' +
      ' A4 . A4 . D5 - - E5 | F5 - D5 - B4 D5 - . | G4 . G4 . C5 - - Eb5 | E5 - G5 - E5 C5 - . |';
    var AU_BATON_CH = 'C6 Am7 Dm7 G7 C6 Am7 Dm7.G7 C6 F6 F6 Em7 A7 Dm7 G7 C6 C6';
    // Its minor face, for the bosses (SCOPE CREEP has the tune now): the same rhythm in C minor, the second chord half-diminished, so bar 3's leap is a tritone.
    var AU_BATON_MA =
      ' G4 . G4 . C5 - - D5 | Eb5 - G5 - Eb5 C5 - . | Ab4 . Ab4 . D5 - - E5 | F5 - D5 - B4 D5 - . |' +
      ' G4 . G4 . C5 - - D5 | Eb5 - G5 - Ab5 G5 Eb5 C5 | F5 - - D5 Eb5 - B4 - | C5 - - - . . . . |';
    var AU_BATON_MB =
      ' C5 . C5 . F5 - - G5 | Ab5 - C6 - Ab5 F5 - . | Bb4 . Bb4 . Eb5 - - F#5 | G5 - F#5 - Eb5 C5 - . |' +
      ' Ab4 . Ab4 . D5 - - E5 | F5 - D5 - B4 D5 - . | G4 . G4 . C5 - - D5 | Eb5 - G5 - Eb5 C5 - . |';
    var AU_BATON_MCH = 'Cm6 Cm6 Dm7b5 G7 Cm6 Abmaj7 Dm7b5.G7 Cm6 Fm6 Fm6 Ebmaj7 D7 Dm7b5 G7 Cm6 Cm6';
    var AU_RIDE = ' r . q r_ r . q r_ |';   // the swing ride: quarters, the skip on the and of 2 and 4, the hat's chick on 2 and 4
    var AU_KA = ' k_ . . . k_ . . s_ |', AU_KB = ' k_ . . s_ k_ . . . |', AU_KF = ' k_ . s_ s . s s s! |', AU_KX = ' x . . . k_ . . . |';   // kicks feathered on 1 and 3, a ghost snare, a fill, a crash

    // TITLE, OVERTURE: G major, 138 bpm, swung 0.32. Once: the conductor taps twice and the band hits the leap (the motif itself, D D G), then a fill. Then THE
    // BATON whole: A with the section a third under the lead (a sax soli) and brass pushing each phrase; B as the shout, the section opened to a sixth under, the
    // brass hitting with every leap and between; the bass walking; the ride swinging, a crash at each half.
    var AU_TI_CH = auChords(AU_BATON_CH, 7), AU_TI_A = AU_SH(AU_BATON_A, -5), AU_TI_B = AU_SH(AU_BATON_B, -5);
    Q.defSong('title', { bpm: 138, swing: 0.32, from: 16, vol: 0.93, voices: [
      { wave: 'square', vol: 0.019, gate: 0.85, notes: ' D5_ . D5_ . G5! - - - | . . . . . . . . |' + AU_TI_A + AU_TI_B },
      { wave: 'square', vol: 0.012, gate: 0.8, notes: ' . . . . D5 - - - | . . . . . . . . |' + auDia(AU_TI_A, 'G', -2) + auDia(AU_TI_B, 'G', -5) },
      { wave: 'sawtooth', vol: 0.009, gate: 0.45, notes: ' . . . . B3! - - - | . . . . . . . . |' +
        auGuide(auSome(AU_TI_CH, 1, 8), ' . . . . . . . . | . . . . . . X_ X |', 'G3', 'F#4') + auGuide(auSome(AU_TI_CH, 9, 16), ' . . . . X . . . | . . . X - . X . |', 'G3', 'F#4') },
      { wave: 'triangle', vol: 0.03, gate: 0.85, notes: ' . . . . G2 - - - | D3 - E3 - F#3 - Ab3 - |' + auWalk(AU_TI_CH, 'E2', 'D4', 'Ab3') },
      { drum: true, vol: 0.7, notes: ' . . . . . . . . | . . . . . . . . |' + AU_R(AU_RIDE, 16) },
      { drum: true, vol: 0.8, notes: ' t! . t! . x . . . | k . . . s_ s_ s s! |' + AU_KX + AU_R(AU_KB + AU_KA, 3) + AU_KF + AU_KX + AU_R(AU_KB + AU_KA, 3) + AU_KF }
    ] });

    // MAP, THE COMMUTE: F major, 112 bpm, swung 0.37, a stroll between worlds. THE BATON simplified and lazier (its answers held, like whistling while walking), the
    // bass walking (literally), a soft rhythm-guitar chop on every beat (the guide tones), and footsteps: a tick on 1 and 3, a brush on 2 and 4.
    var AU_MAP_CH = auChords(AU_BATON_CH, 5);
    var AU_MAP_LEAD =
      ' C4 . C4 . F4 - - - | A4 - - C5 A4 - F4 . | D4 . D4 . G4 - - - | Bb4 - - G4 E4 - - . |' +
      ' C4 . C4 . F4 - - A4 | - C5 D5 C5 A4 - F4 . | G4 - - A4 Bb4 - G4 - | F4 - - - . . . . |' +
      ' F4 . F4 . Bb4 - - - | D5 - - F5 D5 - Bb4 . | E4 . E4 . A4 - - - | C5 - - A4 F#4 - - . |' +
      ' D4 . D4 . G4 - - - | Bb4 - - G4 E4 - - . | C4 . C4 . F4 - - A4 | - G4 F4 D4 C4 - . . |';
    Q.defSong('map', { bpm: 112, swing: 0.37, vol: 1.05, voices: [
      { wave: 'square', vol: 0.018, gate: 0.75, notes: AU_MAP_LEAD },
      { wave: 'square', vol: 0.009, gate: 0.3, notes: auGuide(AU_MAP_CH, ' X_ . X . X_ . X . |', 'A3', 'G4') },
      { wave: 'triangle', vol: 0.032, gate: 0.85, notes: auWalk(AU_MAP_CH, 'C2', 'Bb3') },
      { drum: true, vol: 0.8, notes: AU_R(AU_R(' t_ . u . t_ . u . |', 3) + ' t_ . u . t_ t_ u . |', 4) }
    ] });

    // W1, THE INBOX: C major, 144 bpm, swung 0.32, a bouncy jump swing. THE BATON hopping (staccato), the section replying in the lead's pauses (two quick notes, a
    // reply and a reply-all), then soli in thirds for B; 8 bars of shout in unison (the motif on C, leaping to F, over a blues turn); paper on the backbeat, the ride,
    // a walking bass, and the new-mail ding at the end of each half.
    var AU_W1_CH = AU_BATON_CH + ' C6 C6 F7 F7 C6 A7 Dm7.G7 C6';
    var AU_W1_SHOUT =
      ' C5! . C5! . F5 - E5 C5 | . . Eb5 E5 G5 - E5 . | C5! . C5! . F5 - Eb5 C5 | . . A4 C5 Eb5 - C5 . |' +
      ' G4 . G4 . C5 - - Eb5 | E5 - G5 - E5 C#5 - . | D5 - F5 - B4 - D5 . | C5 - - - . . . . |';
    var AU_W1K = ' k_ . p . k_ . p p_ |';
    Q.defSong('w1', { bpm: 144, swing: 0.32, vol: 1.03, voices: [
      { wave: 'square', vol: 0.02, gate: 0.5, notes: AU_BATON_A + AU_BATON_B + AU_W1_SHOUT },
      { wave: 'square', vol: 0.012, gate: 0.5, notes: auGuide(auSome(AU_W1_CH, 1, 8), ' . . . . . X_ X . | . . . . . . . . |', 'E4', 'D5') + auDia(AU_BATON_B, 'C', -2) + AU_SH(AU_W1_SHOUT, -12) },
      { wave: 'triangle', vol: 0.032, gate: 0.8, notes: auWalk(AU_W1_CH, 'E2', 'D4') },
      { wave: 'triangle', vol: 0.022, gate: 0.6, notes: AU_R(' . . . . . . . . |', 11) + ' . . . . G6 - E6 - |' + AU_R(' . . . . . . . . |', 11) + ' . . . . G6 - E6 - |' },
      { drum: true, vol: 0.7, notes: AU_R(AU_RIDE, 24) },
      { drum: true, vol: 0.8, notes: ' x . p . k_ . p p_ |' + AU_R(AU_W1K, 6) + AU_KF + AU_R(AU_W1K, 7) + AU_KF + ' x . p . k_ . p p_ |' + AU_R(AU_W1K, 6) + ' k_ . s s s s s! s! |' }
    ] });
