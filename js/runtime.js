  // ---------- the 9F computer's runtime: what its games run on (version 113; the same file runs the builders' test page) ----------
  // A game draws into a screen of 320 by 200 pixels and reads six buttons; the runtime gives it our own pixel font, our own sounds, a save of its own in this browser, and
  // a line in the logbook for its big moments. It knows nothing of the office: the office's own part (or the test page) makes the runtime, feeds it keys, taps and the
  // controller, shows its screen and closes it.
  function makeArcade(o) {   // o: { canvas, audio: function () -> an AudioContext or null, keep: function (key, value), jot: function (text), close: function () }
    var W = 320, H = 200, cv = o.canvas, g = cv.getContext('2d'), games = [], cur = null, curGame = null, life = 0, pick = 0, jotAt = {};
    cv.width = W; cv.height = H; g.imageSmoothingEnabled = false;
    var NAMES = ['left', 'right', 'up', 'down', 'a', 'b', 'start', 'c'], held = {}, was = {}, tapped = {}, edge = {};
    NAMES.forEach(function (n) { held[n] = false; was[n] = false; tapped[n] = false; edge[n] = false; });
    function setKey(n, on) { if (!(n in held)) return; if (on && !held[n]) tapped[n] = true; held[n] = on; }   // a tap shorter than a frame still counts (version 105's lesson)
    function release() { NAMES.forEach(function (n) { held[n] = false; }); }
    // ---------- our own pixel font: 5 by 7, capitals, numbers and the usual marks; small letters are drawn as capitals ----------
    var GL = {
      'A': '0e11111f111111', 'B': '1e11111e11111e', 'C': '0e11101010110e', 'D': '1e11111111111e', 'E': '1f10101e10101f', 'F': '1f10101e101010', 'G': '0e11101711110f',
      'H': '1111111f111111', 'I': '0e04040404040e', 'J': '0702020202120c', 'K': '11121418141211', 'L': '1010101010101f', 'M': '111b1515111111', 'N': '11111915131111',
      'O': '0e11111111110e', 'P': '1e11111e101010', 'Q': '0e111111151 20d', 'R': '1e11111e141211', 'S': '0f10100e01011e', 'T': '1f040404040404', 'U': '1111111111110e',
      'V': '1111111111 0a04', 'W': '11111115151 50a', 'X': '11110a040a1111', 'Y': '11110a04040404', 'Z': '1f01020408101f',
      '0': '0e11131519110e', '1': '040c040404040e', '2': '0e11010204081f', '3': '1f02040201110e', '4': '02060a121f0202', '5': '1f101e0101110e', '6': '0608101e11110e',
      '7': '1f010204080808', '8': '0e11110e11110e', '9': '0e11110f01020c', ' ': '00000000000000', '.': '00000000000c0c', ',': '000000000c0408', '!': '04040404040004',
      '?': '0e110102040004', ':': '000c0c000c0c00', ';': '000c0c000c0408', '-': '0000001f000000', '+': '0004041f040400', '/': '01010204081010', "'": '04040800000000',
      '"': '0a0a0000000000', '(': '02040808080402', ')': '08040202020408', '=': '00001f001f0000', '%': '18190204081303', '*': '0004150e150400', '#': '0a0a1f0a1f0a0a',
      '<': '02040810080402', '>': '08040201020408', '_': '0000000000001f', '&': '0c121408151 20d', '@': '0e111715171 00e', '$': '040f140e051e04', '[': '0e08080808080e',
      ']': '0e02020202020e', '~': '000a1f1f0e0400'   // ~ draws a heart
    };
    var BITS = {}; Object.keys(GL).forEach(function (c) { var s = GL[c].replace(/ /g, ''), r = []; for (var i = 0; i < 7; i++) r.push(parseInt(s.substr(i * 2, 2), 16) || 0); BITS[c] = r; });
    function width(s, k) { return String(s).length * 6 * (k || 1) - (k || 1); }
    function text(s, x, y, col, k, align) {   // align: 'left' (the default), 'center' or 'right' of x
      s = String(s).toUpperCase(); k = k || 1; if (align === 'center') x -= Math.floor(width(s, k) / 2); else if (align === 'right') x -= width(s, k);
      g.fillStyle = col || '#ffffff';
      for (var i = 0; i < s.length; i++) { var b = BITS[s.charAt(i)] || BITS['?']; for (var r = 0; r < 7; r++) { var row = b[r]; if (!row) continue; for (var c = 0; c < 5; c++) if (row & (16 >> c)) g.fillRect(x + (i * 6 + c) * k, y + r * k, k, k); } }
    }
    // ---------- our own sounds, made in the page (silent with the office's sound off) ----------
    function ac() { try { return o.audio ? o.audio() : null; } catch (e) { return null; } }
    function tone(f0, f1, len, type, vol, at) {   // a note from f0 to f1 hertz, len seconds long, at seconds from now
      var c = ac(); if (!c) return;
      try { var t = c.currentTime + (at || 0), osc = c.createOscillator(), v = c.createGain(); v.gain.value = 0.0001; osc.type = type || 'square'; osc.frequency.setValueAtTime(Math.max(20, f0), t); osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1 || f0), t + len);   // the gain starts quiet (02:20: AUDIO measured a click from a gain node's default of 1 before its first event; 02:27: this note first sat mid-line and swallowed the frequency calls, caught by builder 11)
        v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol || 0.05), t + Math.min(0.02, len / 4)); v.gain.exponentialRampToValueAtTime(0.0001, t + len);
        osc.connect(v); v.connect(c.destination); osc.start(t); osc.stop(t + len + 0.02); } catch (e) {}
    }
    function noise(len, f0, f1, type, q, vol, at) {   // a breath of noise through a filter swept from f0 to f1
      var c = ac(); if (!c) return;
      try { var t = c.currentTime + (at || 0), n = Math.floor(c.sampleRate * len), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0); for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
        var src = c.createBufferSource(), f = c.createBiquadFilter(), v = c.createGain(); v.gain.value = 0.0001; src.buffer = buf; f.type = type || 'bandpass'; f.Q.value = q || 1; f.frequency.setValueAtTime(Math.max(20, f0), t); f.frequency.exponentialRampToValueAtTime(Math.max(20, f1 || f0), t + len * 0.9);
        v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol || 0.05), t + Math.min(0.03, len / 4)); v.gain.exponentialRampToValueAtTime(0.0001, t + len);
        src.connect(f); f.connect(v); v.connect(c.destination); src.start(t); src.stop(t + len + 0.02); } catch (e) {}
    }
    // ---------- a save of each game's own, in this browser ----------
    function save(id, obj) { try { o.keep('arcade-' + id, JSON.stringify(obj)); } catch (e) {} }
    function load(id) { try { var s = o.keep('arcade-' + id); return s ? JSON.parse(s) : null; } catch (e) { return null; } }
    function rand(seed) { var s = (seed >>> 0) || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }   // the same numbers for the same seed
    // ---------- the games ----------
    function add(game) { if (!game || !game.id || !game.start) return false; for (var i = 0; i < games.length; i++) if (games[i].id === game.id) return false; games.push(game); return true; }
    function api(game) {
      var t = 0, me = {
        W: W, H: H, g: g, held: function (n) { return !!held[n]; }, pressed: function (n) { return !!edge[n]; }, any: function () { return NAMES.some(function (n) { return edge[n]; }); },
        text: text, width: width, tone: tone, noise: noise, audio: ac, soundOn: function () { return !!ac(); },
        save: function (obj) { save(game.id, obj); }, load: function () { return load(game.id); },
        jot: function (s) { var now = life; if (jotAt[game.id] !== undefined && now - jotAt[game.id] < 2) return; jotAt[game.id] = now; if (o.jot) o.jot(game.name + ': ' + String(s).slice(0, 100)); },   // only its big moments, two seconds apart at least
        exit: function () { stop(); }, rand: rand, t: function () { return t; }, _tick: function (dt) { t += dt; }
      };
      return me;
    }
    function open(id) {   // start a game by its id; no id: the desktop
      stop(); if (!id) return true;
      for (var i = 0; i < games.length; i++) if (games[i].id === id) { curGame = games[i]; var a = api(curGame); cur = { game: curGame, api: a, run: curGame.start(a) || {} }; if (o.jot) o.jot('opened ' + curGame.name + ' on the 9F computer'); return true; }
      return false;
    }
    function stop() { if (cur) { try { if (cur.run.stop) cur.run.stop(); } catch (e) { setTimeout(function () { throw e; }); } } cur = null; curGame = null; release(); }
    // ---------- the desktop: 9F OS, our own ----------
    function desktop(dt) {
      g.fillStyle = '#123b3f'; g.fillRect(0, 0, W, H);
      for (var y = 0; y < H; y += 8) { g.fillStyle = (y / 8) % 2 ? '#14423f' : '#123b3f'; g.fillRect(0, y, W, 8); }   // a quiet striped wallpaper
      g.fillStyle = '#0b2427'; g.fillRect(0, 0, W, 14); text('9F OS', 6, 4, '#ff8a1e'); var d = new Date(), hh = d.getHours(), mm = d.getMinutes(); text((hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm, W - 6, 4, '#e6f2ef', 1, 'right');
      if (!games.length) { text('NO GAMES YET', W / 2, H / 2 - 4, '#e6f2ef', 1, 'center'); return; }
      if (edge.left) pick = (pick + games.length - 1) % games.length; if (edge.right) pick = (pick + 1) % games.length;
      if (edge.up) pick = Math.max(0, pick - 4); if (edge.down) pick = Math.min(games.length - 1, pick + 4);
      for (var i = 0; i < games.length; i++) {
        var gx = 20 + (i % 4) * 76, gy = 30 + Math.floor(i / 4) * 70, on = i === pick;
        if (on) { g.fillStyle = 'rgba(255,138,30,0.25)'; g.fillRect(gx - 4, gy - 4, 64, 60); g.fillStyle = '#ff8a1e'; g.fillRect(gx - 4, gy - 4, 64, 1); g.fillRect(gx - 4, gy + 55, 64, 1); g.fillRect(gx - 4, gy - 4, 1, 60); g.fillRect(gx + 59, gy - 4, 1, 60); }
        g.fillStyle = '#0b2427'; g.fillRect(gx + 12, gy, 32, 32);
        try { if (games[i].icon) games[i].icon(g, gx + 12, gy, 32); } catch (e) {}
        var nm = String(games[i].name).toUpperCase(), words = nm.split(' '), l1 = '', l2 = '';
        words.forEach(function (w) { if ((l1 + ' ' + w).trim().length <= 10 && !l2) l1 = (l1 + ' ' + w).trim(); else l2 = (l2 + ' ' + w).trim(); });
        text(l1, gx + 28, gy + 37, on ? '#ffffff' : '#bcd3ce', 1, 'center'); if (l2) text(l2.slice(0, 10), gx + 28, gy + 46, on ? '#ffffff' : '#bcd3ce', 1, 'center');
      }
      text('ARROWS PICK  -  A OPENS  -  ESC STANDS UP', W / 2, H - 12, '#7fa8a1', 1, 'center');
      if (edge.a || edge.start) open(games[pick].id);
    }
    function frame(dt) {   // one frame: the buttons' edges, then the game or the desktop
      dt = Math.max(0, Math.min(dt || 0, 0.05)); life += dt;
      NAMES.forEach(function (n) { edge[n] = tapped[n] || (held[n] && !was[n]); was[n] = held[n]; tapped[n] = false; });
      if (cur) { cur.api._tick(dt); try { if (cur.run.frame) cur.run.frame(dt); } catch (e) { var bad = cur; stop(); setTimeout(function () { throw e; }); g.fillStyle = '#300'; g.fillRect(0, 0, W, H); text('THAT GAME STOPPED: ' + (bad && bad.game.name), W / 2, H / 2, '#fff', 1, 'center'); } }
      else desktop(dt);
    }
    function back() { if (cur) { stop(); return true; } if (o.close) o.close(); return false; }   // Esc: out of a game to the desktop, or up from the desk
    return { add: add, open: open, stop: stop, back: back, frame: frame, setKey: setKey, release: release, games: games, current: function () { return cur ? cur.game.id : ''; },
             run: function () { return cur ? cur.run : null; }, text: text, width: width, W: W, H: H, g: g, canvas: cv, held: held, pick: function (i) { if (i !== undefined) pick = i; return pick; } };
  }
