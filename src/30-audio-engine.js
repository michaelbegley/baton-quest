    // ---------- 30-audio-engine.js: Baton Quest's sound engine (AUDIO, builder 4) ----------
    // Every sound and song in the game is our own, made with api.tone and api.noise and nothing else. With the office's sound off, api.audio() is null: then
    // Q.sfx and Q.music do nothing and Q.audioFrame costs one call. Notes are scheduled at most Q.au.LOOK (0.2 s) ahead by the audio clock, so a slow frame
    // never stutters the beat and a stop is quick (what is already scheduled, a fifth of a second at most, plays out). While a text box is up (Q.talking(), read
    // safely), the music goes down to half over 0.3 s and comes back the same way after (Q.au.DUCK, Q.au.RAMP). While THE ENCORE is on (Q.encoreOn(), the engine's,
    // read safely), 'encore' plays through all four fights: any other song asked for is let go, and Q.music(null) still stops it (QUEST-API.md part 14.10, 3).
    //
    // THE SONG FORMAT: Q.defSong(id, song), song = {
    //   bpm: 120,        beats a minute
    //   div: 2,          steps a beat: 2, each step an eighth (the default); 4, a sixteenth; 3, triplets
    //   bar: 8,          steps a bar (default div * 4; 6 with div 2 is 3/4). A '|' in a voice marks a bar, and Q.au.check() counts every bar.
    //   loop: true,      false: plays once (a jingle), then nothing until the next Q.music
    //   from: 0,         the step a loop goes back to: the steps before it are an intro, played once
    //   swing: 0,        0 to 0.4: every second step comes that part of a step late (a lounge feel)
    //   vol: 1,          the whole song's level (times Q.au.MUSIC)
    //   join: 'final',   songs with the same join name and as many bars take over from each other at the next bar line, at the same bar (each at its own tempo)
    //   parts: 8,        a song in parts (one a world, 8 bars each here): started while a level of world n (1 to 4) is loaded, it starts at part n's first bar
    //                    (Q.music(id, true), started over, always starts at bar 1)
    // In the codex (HOLD MUSIC, Q.scene 'codex'): no join and THE ENCORE's rule left out, and a finished jingle asked for again plays again. The jukebox asks with
    // Q.music(id, true), so every song plays whole from its top; the scene's own song put back after (Q.music(id)) comes back as its scene plays it.
    //   voices: [...]    two to six voices: { notes, wave, vol, gate, oct, sub, max }, or a drum voice { drum: true, notes, vol }
    // }
    // A voice: wave 'square' (the default), 'triangle', 'sine' or 'sawtooth'; vol its volume (music sits under the sounds: 0.01 to 0.04); gate the part of
    // its length a note sounds (default 0.85); oct moves it by octaves; sub 2 (or 3, 4) plays that many of its tokens a step (a voice twice as quick); max
    // the longest a note rings (default 1.2 s). A voice shorter than the song repeats under it. The tone's own envelope plucks each note: long notes fade.
    // The notes: one token a step, spaces between.
    //   C4 F#3 Bb5  a note (letter, # or b, octave; A4 is 440 Hz)    -  the note before holds one more step    .  a rest    |  a bar line (not a step)
    //   C4>G4       a note sliding to G4 over its length              C5!  louder     C5_  softer
    // Drum tokens (a drum voice's vol is a level: 1 is the kit as made): k kick, s snare, h hat, o open hat, t tick, c clap, x crash, p paper, b blip, w wind.
    // For example, a song of one bar: bpm 120, a square voice with notes 'C4 E4 G4 - C5 . . . |' and a triangle voice (vol 0.035) with 'C2 - - - G2 - - - |'.
    // Helpers for writing songs: Q.au.rep('A2 A2 E3 A2', 4) repeats a run; Q.au.shift('C4 E4 G4', 2) moves a run up two semitones.

    Q.au = {
      MUSIC: 1.25,       // the music's level (set by the office mix check: clear over the room at the boss's desk; every sound still stands above the loudest song)
      LOOK: 0.2,         // seconds of music scheduled ahead (never more than 0.25)
      s: null,           // the song being scheduled (parsed), or null
      id: null,          // the song id asked for last (kept after a jingle ends, so asking again keeps quiet; in the codex's jukebox it plays again)
      t0: 0,             // the audio-clock time of step 0 of this pass (below 0 when a song started at a later part early in the clock's life)
      live: false,       // t0 is set on the audio clock (false: the song starts at the next frame with the sound on)
      pos: 0,            // the next tick to schedule (a step is T ticks: T is 1 unless a voice has sub)
      next: null, nextPos: -1,   // a joined song waiting for its bar
      DUCK: 0.5, RAMP: 0.3,      // while a text box is up (Q.talking()) the music goes down to DUCK of its level, over RAMP seconds, and back up after
      PAUSE: 0.7,                // under the pause menu (Q.scene 'pause') it goes down to PAUSE the same way
      dk: { from: 1, to: 1, t0: -1 },   // the ducking now: from one level to another, starting at t0 on the audio clock
      last: {}, burst: 0, burstT: -1, warned: {}, noteN: 0, typeN: 0, c2n: 0, c2at: -9,
      GAP: { type: 0.045, fan: 0.3, hover: 0.25, charge: 0.25, land: 0.07, token: 0.03, move: 0.04, tick: 0.05, zap: 0.08, gate: 0.08 }   // the least time between two of the same sound
    };
    var AU_STEP = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
    var AU_NAME = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    function auWarn(s) { if (Q.au.warned[s]) return; Q.au.warned[s] = 1; Q.warn(s); }
    function auSemi(tk) {   // 'C4', 'F#3', 'Bb5' as semitones from A4, or null if it is not a note
      var m = /^([A-G])([#b]?)([0-8])$/.exec(tk);
      if (!m) return null;
      return AU_STEP[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (+m[3] - 4) * 12;
    }
    function auFreq(tk) { var n = auSemi(tk); return n === null ? 0 : 440 * Math.pow(2, n / 12); }
    Q.au.freq = auFreq;
    Q.au.rep = function (s, n) { var out = '', i; for (i = 0; i < n; i++) out += ' ' + s; return out; };
    Q.au.shift = function (s, by) {   // every note in a run moved by semitones (accents and slides kept)
      return String(s).split(/\s+/).map(function (tk) {
        if (!tk) return tk;
        var end = '', ch = tk.charAt(tk.length - 1);
        if (ch === '!' || ch === '_') { end = ch; tk = tk.slice(0, -1); }
        return tk.split('>').map(function (nt) {
          var n = auSemi(nt); if (n === null) return nt;
          n += by + 57;   // 57: A4 counted from C0
          return AU_NAME[((n % 12) + 12) % 12] + Math.floor(n / 12);
        }).join('>') + end;
      }).join(' ');
    };

    // ---------- the drum kit: our own, all tone and noise (v the level, at seconds from now) ----------
    var AU_DRUM = {
      k: function (api, v, at) { api.tone(150, 48, 0.11, 'triangle', 0.045 * v, at); api.noise(0.012, 1400, 900, 'bandpass', 1, 0.012 * v, at); },
      s: function (api, v, at) { api.noise(0.09, 2000, 900, 'bandpass', 0.8, 0.03 * v, at); api.tone(240, 170, 0.04, 'triangle', 0.018 * v, at); },
      h: function (api, v, at) { api.noise(0.025, 8000, 7000, 'highpass', 0.7, 0.012 * v, at); },
      o: function (api, v, at) { api.noise(0.14, 7500, 6000, 'highpass', 0.7, 0.011 * v, at); },
      t: function (api, v, at) { api.noise(0.018, 3200, 2800, 'bandpass', 5, 0.02 * v, at); },
      c: function (api, v, at) { api.noise(0.05, 1500, 1100, 'bandpass', 1.6, 0.024 * v, at); api.noise(0.07, 1400, 1000, 'bandpass', 1.6, 0.02 * v, at + 0.012); },
      x: function (api, v, at) { api.noise(0.7, 6500, 3000, 'highpass', 0.5, 0.014 * v, at); },
      p: function (api, v, at) { api.noise(0.05, 2200, 4200, 'bandpass', 0.9, 0.016 * v, at); },
      b: function (api, v, at) { api.tone(1760, 1760, 0.03, 'sine', 0.012 * v, at); },
      w: function (api, v, at) { api.noise(0.9, 350, 1400, 'bandpass', 0.6, 0.01 * v, at); }
    };
    Q.au.DRUM = AU_DRUM;

    // ---------- reading a song: each voice's tokens into one event (or null) a token; once, the first time it plays ----------
    function auVoice(v, p, who, bad) {
      var toks = String(v.notes || '').split(/\s+/), ev = [], bars = [], n = 0, last = null, mul = Math.pow(2, v.oct || 0), ruled = false, i, tk, acc, ch, sl, f0, f1;
      var sub = v.sub > 1 ? Math.floor(v.sub) : 1;
      for (i = 0; i < toks.length; i++) {
        tk = toks[i]; if (!tk) continue;
        if (tk === '|') { ruled = true; if (n) bars.push(n); n = 0; continue; }
        n++;
        if (tk === '-') { ev.push(null); if (last) last.n++; continue; }
        last = null;
        if (tk === '.') { ev.push(null); continue; }
        acc = 1; ch = tk.charAt(tk.length - 1);
        if (ch === '!') { acc = 1.35; tk = tk.slice(0, -1); } else if (ch === '_') { acc = 0.6; tk = tk.slice(0, -1); }
        if (v.drum) { if (AU_DRUM[tk]) ev.push({ d: AU_DRUM[tk], a: acc }); else { ev.push(null); bad.push(who + ': no drum ' + tk); } continue; }
        sl = tk.indexOf('>'); f0 = auFreq(sl < 0 ? tk : tk.slice(0, sl)); f1 = sl < 0 ? f0 : auFreq(tk.slice(sl + 1));
        if (!f0 || !f1) { ev.push(null); bad.push(who + ': not a note ' + tk); continue; }
        last = { f0: f0 * mul, f1: f1 * mul, n: 1, a: acc }; ev.push(last);
      }
      if (n) bars.push(n);
      if (ruled) for (i = 0; i < bars.length; i++) if (bars[i] !== p.bar * sub) { bad.push(who + ': bar ' + (i + 1) + ' has ' + bars[i] + ' steps, not ' + p.bar * sub); break; }
      if (ev.length % sub) bad.push(who + ': ' + ev.length + ' tokens do not fill whole steps');
      return { ev: ev, n: ev.length, sub: sub, drum: !!v.drum, wave: v.wave || 'square', vol: v.vol === undefined ? (v.drum ? 1 : 0.02) : v.vol, gate: v.gate || 0.85, max: v.max || 1.2 };
    }
    function auParse(id) {
      var song = Q.SONG[id], bad, p, i, v, vs;
      if (!song) return null;
      if (song._p) return song._p;
      bad = [];
      p = { id: id, bpm: song.bpm > 0 ? song.bpm : 120, div: song.div > 0 ? song.div : 2, loop: song.loop !== false, from: song.from || 0, swing: Q.clamp(song.swing || 0, 0, 0.45),
            vol: song.vol === undefined ? 1 : song.vol, join: song.join || '', parts: song.parts > 0 ? Math.floor(song.parts) : 0, voices: [], len: 0, bad: bad };
      p.bar = song.bar > 0 ? song.bar : p.div * 4; p.st = 60 / p.bpm / p.div;
      vs = song.voices || [];
      for (i = 0; i < vs.length; i++) { v = auVoice(vs[i], p, id + ' voice ' + (i + 1), bad); if (v.n) { p.voices.push(v); p.len = Math.max(p.len, Math.ceil(v.n / v.sub)); } }
      if (!p.len) { bad.push(id + ': no notes'); p.len = 1; }
      if (p.from >= p.len) { bad.push(id + ': from is past the end'); p.from = 0; }
      p.T = 1; for (i = 0; i < p.voices.length; i++) p.T = auLcm(p.T, p.voices[i].sub);   // the scheduler counts ticks: a step cut in T, so a quick voice's half-steps
      p.tt = p.st / p.T;                                                                 // are scheduled on their own and never more than LOOK ahead
      p.swing = Math.min(p.swing, 0.95 / p.T);
      for (i = 0; i < bad.length; i++) auWarn(bad[i]);
      song._p = p; return p;
    }
    function auLcm(a, b) { var x = a, y = b, t; while (y) { t = y; y = x % y; x = t; } return a / x * b; }
    Q.au.parse = auParse;

    // ---------- playing: the clock, one step, the scheduler ----------
    function auCtx() {   // the audio context while the sound is on and running, else null (read from Q.api each time: the engine sets it at start)
      var api = Q.api, c = null;
      if (!api || !api.audio) return null;
      try { c = api.audio(); } catch (e) { return null; }
      if (!c || (c.state && c.state !== 'running')) return null;
      AU_W.rate = c.sampleRate || 0;
      return c;
    }
    // Every note starts halfway between two samples. The runtime sets a note's gain from its start time, and a gain was 1 before that; a noise whose first sample
    // came out before its gain's first event let that one sample through at full level: a click of up to 0.95 (measured by the loudness check, even with the start
    // exactly on a sample, where rounding decides the order). The runtime now starts every gain at 0.0001 (arcade-core.js, 2 Nov); this stays as a second guard. The audio clock sits on a sample, so an 'at' of a whole number of samples and a half puts the start
    // between two samples: the noise's first sample and the gain's first event then fall on the same next sample, the gain already low. auApi() is Q.api with that
    // (all else is Q.api's own).
    var AU_W = { api: null, w: null, rate: 0 };
    function auSnap(at) { var r = AU_W.rate; at = at || 0; return r > 0 ? (Math.floor(at * r + 1e-6) + 0.5) / r : at; }   // (the tiny 1e-6 of a sample: a time exactly on a sample always rounds the same way)
    function auApi() {
      var api = Q.api;
      if (!api) return null;
      if (AU_W.api !== api) {
        AU_W.api = api; AU_W.w = Object.create(api);
        AU_W.w.tone = function (f0, f1, len, type, vol, at) { api.tone(f0, f1, len, type, vol, auSnap(at)); };
        AU_W.w.noise = function (len, f0, f1, type, q, vol, at) { api.noise(len, f0, f1, type, q, vol, auSnap(at)); };
      }
      return AU_W.w;
    }
    function auTalking() { try { return !!(Q.talking && Q.talking()); } catch (e) { return false; } }   // read safely: the UI's, and it may be missing
    var AU_ENCORE = 'encore';
    function auEncoreOn() { try { return !!(Q.encoreOn && Q.encoreOn()); } catch (e) { return false; } }   // THE ENCORE is on (the engine's, read safely)
    function auDuckAt(A, t) {   // the music's ducking at a time on the audio clock (1: full)
      var d = A.dk, k;
      if (d.from === d.to) return d.to;
      k = (t - d.t0) / A.RAMP;
      return k <= 0 ? d.from : k >= 1 ? d.to : d.from + (d.to - d.from) * k;
    }
    Q.au.duckAt = function (t) { return auDuckAt(Q.au, t); };
    function auStep(api, c, p, tick, abs, duck) {   // every voice's note that falls on this tick of a song, at the time abs on the audio clock
      var k = Q.au.MUSIC * p.vol * duck, i, v, e, every, at;
      if (!(k > 0)) return;
      for (i = 0; i < p.voices.length; i++) {
        v = p.voices[i]; every = p.T / v.sub;
        if (tick % every) continue;
        e = v.ev[(tick / every) % v.n]; if (!e) continue;
        at = Math.max(0, auSnap(abs) - c.currentTime);   // its own time put between two samples (the same whatever the frame), then the clock read again just before
        if (v.drum) e.d(api, v.vol * e.a * k, at);
        else api.tone(e.f0, e.f1, Math.min(e.n * p.st / v.sub * v.gate, v.max), v.wave, v.vol * e.a * k, at);
      }
    }
    function auSwap(A, p) {   // a joined song takes over on a bar line, at the same bar of the tune, at its own tempo from there
      var old = A.s, b = A.pos / (old.bar * old.T), tb = A.t0 + A.pos * old.tt;
      A.s = p; A.next = null; A.pos = b * p.bar * p.T;
      if (p.st !== old.st) A.t0 = tb - b * p.bar * p.st;   // the same tempo keeps t0 exactly
    }
    function auAdvance(A) {   // on to the next tick: the loop, the end of a jingle, a joined song taking over at its bar
      var p = A.s;
      A.pos++;
      if (A.pos >= p.len * p.T) {
        if (!p.loop) { A.s = null; A.next = null; return; }
        A.t0 += (p.len - p.from) * p.st; A.pos = p.from * p.T;
      }
      if (A.next && A.pos === A.nextPos) auSwap(A, A.next);
    }
    Q.audioFrame = function () {   // every frame: schedule what falls in the next LOOK seconds by the audio clock (dt is not used: the clock keeps the beat)
      var A = Q.au, c = auCtx(), now, end, at, p, body, want, guard = 0;
      if (c) {   // a text box opened or closed: the ducking turns from where it is now toward its new level
        now = c.currentTime; want = auTalking() ? A.DUCK : 1;
        if (Q.scene === 'pause' && A.PAUSE < want) want = A.PAUSE;   // under the pause menu too (the lower of the two wins)
        if (want !== A.dk.to) { A.dk.from = auDuckAt(A, now); A.dk.to = want; A.dk.t0 = now; }
      }
      if (!A.s) return;
      if (!c) { A.live = false; A.pos = 0; A.next = null; if (!A.s.loop) A.s = null; return; }   // the sound went off: a loop starts again when it is back; a jingle is let go
      end = now + Math.min(A.LOOK, 0.25);
      if (!A.live) { A.live = true; A.t0 = now + 0.05; A.pos = 0; }
      p = A.s; at = A.t0 + A.pos * p.tt;
      if (now - at > 1 && p.loop && A.pos >= p.from * p.T) { body = (p.len - p.from) * p.st; A.t0 += Math.floor((now - at) / body) * body; }   // a long stall: whole passes skipped at once
      while (A.s && guard++ < 1024) {
        p = A.s; at = A.t0 + A.pos * p.tt + ((Math.floor(A.pos / p.T) & 1) ? p.swing * p.st : 0);
        if (at >= end) break;
        if (at > now - 0.03) auStep(auApi(), c, p, A.pos, at, auDuckAt(A, at));   // a step already gone by is skipped, never played late in a burst
        auAdvance(A);
      }
    };
    Q.music = function (id, again) {   // a song by id; null stops; the same id again keeps playing (again: true starts it over)
      var A = Q.au, old = A.s, jb = Q.scene === 'codex', p, c, now, at, beat, k, lv;   // jb: HOLD MUSIC, the codex's jukebox
      if (!id) id = null;
      if (id && id !== AU_ENCORE && !jb && auEncoreOn()) return;   // THE ENCORE: its song plays through all four fights, any other asked for in it is let go
      if (id === A.id && !again && !(jb && id && !A.s)) return;   // in the jukebox, a jingle that has finished plays again
      A.id = id;
      p = id ? auParse(id) : null;
      if (id && !p) auWarn('no song ' + id);
      if (old && p && A.live && !again && !jb && p.join && p.join === old.join && p.len / p.bar === old.len / old.bar && p.from / p.bar === old.from / old.bar) {   // the same tune (as many bars): the next bar line, the same bar
        if (p === old) { A.next = null; return; }
        beat = old.bar * old.T; k = Math.ceil(A.pos / beat) * beat; if (k >= old.len * old.T) k = old.from * old.T;   // the next bar line, in the old song's ticks
        if (k === A.pos) auSwap(A, p); else { A.next = p; A.nextPos = k; }
        return;
      }
      A.next = null;
      if (!p) { A.s = null; return; }
      c = auCtx();
      if (!c) { A.s = p.loop ? p : null; A.live = false; A.pos = 0; return; }   // the sound is off: a loop waits for it; a jingle is let go
      now = c.currentTime; at = now + 0.05;
      if (old && A.live) {   // on the old song's next beat after what it has already scheduled (that short tail is the fade)
        at = A.t0 + A.pos * old.tt; beat = 60 / old.bpm;
        k = A.t0 + Math.ceil(A.pos * old.tt / beat - 1e-6) * beat;
        if (k - now <= 0.6) at = k;
      }
      A.s = p; A.t0 = Math.max(at, now + 0.03); A.pos = 0; A.live = true;
      lv = Q.level;
      if (p.parts && !again && lv && lv.world >= 1) {   // a song in parts starts at its level's world's part (THE ENCORE's fights, THE ROOT FOLDER's rooms), on the same beat
        k = (lv.world - 1) * p.parts * p.bar;
        if (k < p.len) { A.pos = k * p.T; A.t0 -= k * p.st; }
      }
    };
    Q.audioStop = function () {   // the game closed: nothing more is scheduled (the last fifth of a second plays out)
      var A = Q.au;
      A.s = null; A.id = null; A.next = null; A.live = false; A.pos = 0; A.last = {}; A.burst = 0; A.burstT = -1; A.noteN = 0; A.typeN = 0; A.c2n = 0; A.c2at = -9;
      A.dk.from = 1; A.dk.to = 1; A.dk.t0 = -1;
    };
    Q.sfx = function (id) {   // a sound by id: the same sound twice in a moment plays once, and a pile of sounds in one moment plays its first six
      var A = Q.au, c = auCtx(), f, now, last;
      if (!c) return;
      f = Q.SFX[id];
      if (!f) { auWarn('no sound ' + id); return; }
      now = c.currentTime; last = A.last[id];
      if (last !== undefined && now >= last && now - last < (A.GAP[id] || (id.indexOf('type') === 0 ? A.GAP.type : 0.035))) return;   // every voice's blip keeps type's gap
      if (now - A.burstT > 0.05 || now < A.burstT) { A.burstT = now; A.burst = 0; }
      if (++A.burst > 6) return;
      A.last[id] = now;
      try { f(auApi(), Q); } catch (e) { auWarn('sound ' + id + ': ' + e.message); }
    };

    // ---------- for checks and the lint ----------
    Q.au.state = function () { var A = Q.au; return { id: A.id, on: !!A.s, song: A.s ? A.s.id : null, pos: A.pos, t0: A.t0, next: A.next ? A.next.id : null, live: A.live, encore: auEncoreOn() }; };
    Q.au.check = function () {   // every song read and counted: a list of what is wrong (empty when all is well)
      var bad = [], id, p, i, n;
      for (id in Q.SONG) if (Object.prototype.hasOwnProperty.call(Q.SONG, id)) {
        p = auParse(id); bad = bad.concat(p.bad); n = 0;
        if (p.voices.length < 2 || p.voices.length > 6) bad.push(id + ': ' + p.voices.length + ' voices (2 to 6)');
        for (i = 0; i < p.voices.length; i++) { if (!p.voices[i].drum) n++; if (!p.voices[i].drum && p.voices[i].vol > 0.045) bad.push(id + ' voice ' + (i + 1) + ' is too loud for music'); }
        if (!n) bad.push(id + ': only drums');
        if (p.parts && p.len < 4 * p.parts * p.bar) bad.push(id + ': ' + p.len / p.bar + ' bars is not four parts of ' + p.parts);
      }
      return bad;
    };
