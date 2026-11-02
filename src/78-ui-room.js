    // ---------- 78-ui-room.js: the Ninth Floor office, for the intro and the ending (UI, builder 5) ----------
    // 'u5-room' (320 by 128, built once): frame 0 at night, frame 1 in the morning: the wall, a long window on the city, the door with its cat flap, the clock,
    // the 9F badge, three empty chairs, the boss's desk with the little cream 9F computer. Q.ui.office has the places and the pieces drawn on top each frame.
    (function () {
      var U = Q.ui, O = U.office = { SX: [40, 100, 160], AY: 93, HX: 206, HY: 108, SCR: { x: 261, y: 87, w: 20, h: 14 }, AG: ['c1', 'c2', 'c3'] };
      var PAL = [
        { wall: '#222947', wall2: '#1b2140', trim: '#3b2a24', sky: U.grad('#060a1e', '#1b2a5a', 7), city: '#0f1730', lit: '#c9a640', moon: '#efe6c8', floor: '#2b2f45', door: '#4a2e1e', clockH: [11, 50] },
        { wall: '#e6d6b8', wall2: '#d8c6a4', trim: '#7a4a2a', sky: U.grad('#8fcaf5', '#ffe3b8', 7), city: '#93a6c6', lit: '#fff6dd', moon: '#ffd23f', floor: '#5d6789', door: '#7a4a2a', clockH: [9, 0] }
      ];
      function f(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
      function disc(g, cx, cy, r, c) { for (var dy = -r; dy <= r; dy++) { var w = Math.floor(Math.sqrt(r * r - dy * dy) + 0.5); f(g, cx - w, cy + dy, w * 2 + 1, 1, c); } }
      function hand(g, cx, cy, a, len, c) { for (var i = 0; i <= len; i++) f(g, Math.round(cx + Math.sin(a) * i), Math.round(cy - Math.cos(a) * i), 1, 1, c); }
      function room(g, fr) {
        var p = PAL[fr], i, x, y, bw, bh, seed = 3;
        function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
        f(g, 0, 0, 320, 128, p.wall); for (y = 0; y < 124; y += 4) f(g, 0, y, 320, 1, p.wall2);   // a quiet striped wallpaper
        f(g, 32, 14, 192, 60, '#1d1d24'); f(g, 33, 15, 190, 58, p.trim);                         // the window frame
        for (i = 0; i < 7; i++) f(g, 35, 17 + i * 8, 186, 8, p.sky[i]);
        if (fr === 0) { for (i = 0; i < 30; i++) f(g, 36 + Math.floor(rnd() * 184), 18 + Math.floor(rnd() * 26), 1, 1, rnd() > 0.5 ? '#ffffff' : '#7f8ab8'); disc(g, 196, 30, 6, p.moon); disc(g, 198, 28, 5, p.sky[1]); }
        else { disc(g, 74, 34, 8, '#ffe9a0'); disc(g, 74, 34, 6, p.moon); }
        seed = 7; x = 35;
        while (x < 221) {   // the city: blocks of buildings (the same skyline night and morning), windows lit at night
          bw = 10 + Math.floor(rnd() * 16); bh = 10 + Math.floor(rnd() * 22); if (x + bw > 221) bw = 221 - x;
          f(g, x, 73 - bh, bw, bh, p.city);
          for (y = 73 - bh + 3; y < 70; y += 4) for (i = x + 2; i < x + bw - 2; i += 3) if ((i * 73 + y * 151) % 17 > (fr ? 14 : 8)) f(g, i, y, 1, 2, p.lit);
          x += bw + 1;
        }
        f(g, 127, 15, 2, 58, p.trim); f(g, 33, 43, 190, 2, p.trim);   // the window's cross bars
        f(g, 30, 74, 196, 3, '#1d1d24'); f(g, 31, 74, 194, 2, fr ? '#a86f43' : '#5e3a22');   // the sill
        f(g, 6, 56, 24, 72, '#1d1d24'); f(g, 7, 57, 22, 71, p.door); f(g, 9, 60, 18, 26, fr ? '#8a5a38' : '#55351f'); f(g, 9, 90, 18, 24, fr ? '#8a5a38' : '#55351f');
        f(g, 24, 92, 2, 3, '#ffd23f');                                                         // the knob
        f(g, 11, 115, 12, 10, '#1d1d24'); f(g, 12, 116, 10, 8, fr ? '#5e3a22' : '#2e1d12'); f(g, 12, 116, 10, 1, '#9a9fb4');   // the cat flap
        disc(g, 262, 34, 10, '#1d1d24'); disc(g, 262, 34, 9, '#f6efe2'); disc(g, 262, 34, 1, '#1d1d24');   // the clock
        for (i = 0; i < 12; i++) f(g, Math.round(262 + Math.sin(i * Math.PI / 6) * 7), Math.round(34 - Math.cos(i * Math.PI / 6) * 7), 1, 1, '#5d6378');
        hand(g, 262, 34, (p.clockH[0] % 12 + p.clockH[1] / 60) * Math.PI / 6, 4, '#1d1d24'); hand(g, 262, 34, p.clockH[1] * Math.PI / 30, 7, '#1d1d24');
        for (i = 0; i < 3; i++) {   // three high-backed office chairs, behind whoever sits there; their tops show over a head
          x = O.SX[i] + 1;
          f(g, x, 87, 14, 24, '#1d1d24'); f(g, x + 1, 88, 12, 22, '#3a3e56'); f(g, x + 2, 89, 10, 13, '#4b5070'); f(g, x + 2, 89, 10, 1, '#636a8f');
          f(g, x + 1, 103, 12, 1, '#2b2e40'); f(g, x + 6, 108, 2, 3, '#1d1d24');
          f(g, x, 87, 1, 1, p.wall); f(g, x + 13, 87, 1, 1, p.wall); f(g, x + 1, 88, 1, 1, '#1d1d24'); f(g, x + 12, 88, 1, 1, '#1d1d24');
        }
        f(g, 0, 124, 320, 4, p.trim); f(g, 0, 124, 320, 1, '#1d1d24');   // the baseboard
        f(g, 230, 108, 86, 20, '#1d1d24'); f(g, 231, 108, 84, 2, '#c08552'); f(g, 231, 110, 84, 2, '#7a4a2a');   // the boss's desk
        f(g, 233, 112, 80, 15, '#4a2d1a'); f(g, 236, 115, 34, 9, '#5e3a22'); f(g, 276, 115, 34, 9, '#5e3a22'); f(g, 251, 118, 4, 2, '#ffd23f'); f(g, 291, 118, 4, 2, '#ffd23f');
        f(g, 255, 81, 32, 28, '#1d1d24'); f(g, 256, 82, 30, 26, '#f6efe2'); f(g, 256, 82, 30, 1, '#ffffff'); f(g, 284, 83, 2, 25, '#d6ccb8');   // the 9F computer
        f(g, 259, 85, 24, 18, '#a89e8c'); f(g, 260, 86, 22, 16, '#1d1d24');                     // its screen's bezel
        f(g, 258, 104, 26, 1, '#d6ccb8'); disc(g, 263, 106, 1, '#ff8a1e'); f(g, 272, 106, 9, 1, '#5d6378');   // its chin: the orange 9F dot, a slot
        f(g, 258, 109, 26, 2, '#1d1d24'); f(g, 259, 109, 24, 1, '#c3c7d4');                     // its keyboard
        disc(g, 300, 34, 7, '#1d1d24'); disc(g, 300, 34, 6, '#ff8a1e');                         // the 9F badge on the wall (its letters are drawn each frame)
      }
      Q.defSprite('u5-room', { w: 320, h: 128, n: 2, draw: room });
      O.back = function (g, fr) {   // the room and its floor
        Q.spr(g, 'u5-room', fr, 0, 0);
        f(g, 0, 128, 320, 72, PAL[fr].floor); f(g, 0, 128, 320, 1, fr ? '#7a84a8' : '#3d4260');
        U.text('9F', 295, 31, '#ffffff');
      };
      O.agentCol = { c1: ['#14294d', '#bcd4f6'], c2: ['#123d24', '#bfe8cd'], c3: ['#4f1d36', '#fbd3e3'] };
      O.monitor = function (g, i, on, t) {   // a monitor's screen: lines of work scrolling in the agent's colours, or dark
        var x = O.SX[i] + 16, y = 98, c = O.agentCol[O.AG[i]], k;
        if (!on) { f(g, x, y, 14, 9, '#0d1018'); return; }
        f(g, x, y, 14, 9, c[0]);
        for (k = 0; k < 3; k++) f(g, x + 1, y + 1 + k * 3, 3 + ((Math.floor(t * 6) + k * 5 + i * 3) % 9), 1, c[1]);
      };
      O.hands = function (g, i, t) { var x = O.SX[i]; f(g, x + 4 + (Math.floor(t * 9) % 2) * 2, 107, 2, 1, '#e8f0ff'); f(g, x + 10 - (Math.floor(t * 9 + 1) % 2) * 2, 107, 2, 1, '#e8f0ff'); };
      O.steam = function (g, i, t, col) {   // a warm mug: three wisps rising
        for (var k = 0; k < 3; k++) { var a = (t * 0.9 + k / 3) % 1; f(g, O.SX[i] - 5 + Math.round(Math.sin((t + k) * 3) * 1.2), 103 - Math.round(a * 9), 1, 1, col || '#c3c7d4'); }
      };
      O.screen = function (g, kind, t) {   // the 9F computer's screen: 'calm', 'flicker', 'creep', 'green', 'quiet', 'white', 'later'
        var s = O.SCR, c;
        if (kind === 'flicker') { c = ['#ffffff', '#2ec4b6', '#0b0c10', '#6fae3c', '#1d2a55'][Math.floor(t * 17) % 5]; f(g, s.x, s.y, s.w, s.h, c); for (var k = 0; k < s.h; k += 2) f(g, s.x, s.y + k, s.w, 1, '#0b0c10'); return; }
        if (kind === 'creep' || kind === 'green') {
          f(g, s.x, s.y, s.w, s.h, '#0f2a17');
          if (kind === 'creep') { g.save(); g.beginPath(); g.rect(s.x, s.y, s.w, s.h); g.clip(); Q.spr(g, 'face-creep', Math.floor(t * 1.5) % 4 === 0 ? 1 : 0, s.x + 2, s.y - 1); g.restore(); }
          else for (var j = 0; j < 6; j++) f(g, s.x + ((j * 7 + Math.floor(t * 8)) % s.w), s.y + ((j * 5) % s.h), 2, 2, j % 2 ? '#ffd23f' : '#ff9ec6');
          return;
        }
        if (kind === 'white') { f(g, s.x, s.y, s.w, s.h, '#ffffff'); return; }
        if (kind === 'quiet') { f(g, s.x, s.y, s.w, s.h, '#0b0c10'); f(g, s.x + 1, s.y + s.h - 2, s.w - 2, 1, '#13301c'); return; }
        if (kind === 'later') { f(g, s.x, s.y, s.w, s.h, '#e9f7f4'); f(g, s.x + 2, s.y + 2, 16, 2, '#2e3142'); f(g, s.x + 6, s.y + 7, 8, 5, '#ffd23f'); f(g, s.x + 9, s.y + 6, 2, 1, '#e0443a'); return; }
        f(g, s.x, s.y, s.w, s.h, '#13224a'); if (Math.floor(t * 2) % 2) f(g, s.x + 2, s.y + s.h - 4, 3, 1, '#6dfc9a');   // calm: a prompt waiting
      };
      O.path = function (i) {   // a vine from the 9F screen down the boss's desk, along the floor and up to agent i
        var x = O.SX[i];
        return [[268, 101], [268, 109], [240, 110], [236, 126], [x + 30, 126], [x + 24, 112], [x + 10, 106]];
      };
      O.vine = function (g, i, part, t) {   // draws that vine grown to part (0 to 1), green with sticky notes on it
        var p = O.path(i), len = 0, k, d = [], want, s = 0, a, b, sl, u, px, py, n = 0;
        for (k = 1; k < p.length; k++) { a = p[k - 1]; b = p[k]; d.push(Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]))); len += d[k - 1]; }
        want = len * Q.clamp(part, 0, 1);
        for (k = 1; k < p.length && s < want; k++) {
          a = p[k - 1]; b = p[k]; sl = d[k - 1];
          for (u = 0; u <= sl && s + u <= want; u += 1) {
            px = Math.round(a[0] + (b[0] - a[0]) * u / sl + Math.sin((s + u) * 0.35 + t * 3) * 1.2); py = Math.round(a[1] + (b[1] - a[1]) * u / sl);
            f(g, px, py, 2, 2, '#2f6b2a'); f(g, px, py, 1, 1, '#6fae3c');
            if ((++n) % 9 === 0) Q.spr(g, 'u5-stick', (n / 9) % 2, px - 2, py - 3);
          }
          s += sl;
        }
      };
    })();
