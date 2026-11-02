    // ---------- 83-w3-bg.js: WORLD 3, THE CLOUD (builder 8): the 'cloud' background ----------
    // Layers, back to front: the sky in bands, the sun (in THE LOOP it is a loading ring), far clouds, near clouds, a sea of cloud tops along the bottom, and
    // each level's extra: files rising like seeds (w3-1), the bucket's far wall (w3-2), rain and sheet lightning (w3-3). A level picks its look with w3sky.
    Q.w3 = Q.w3 || {};
    Q.w3.SKY = {
      day: ['#3d8fdc', '#4a99e1', '#58a4e7', '#67b0ec', '#77bcf1', '#89c8f4', '#9dd3f6', '#b3def8'],
      wind: ['#3a93d6', '#45a0dc', '#52abe1', '#60b6e6', '#70c1ea', '#82cbee', '#96d5f1', '#acdff4'],
      storm: ['#1c2640', '#222d4a', '#293554', '#303d5e', '#384668', '#414f71', '#4a597a', '#556384'],
      loop: ['#3b86d6', '#4b95dd', '#5ca4e3', '#6fb3e8', '#86c1ea', '#a3cfe6', '#c6dcd8', '#ecdcb8']
    };
    // the big shapes, drawn once: frames 0 and 1 a large and a small fair cloud, 2 and 3 the same in storm colours
    function w3BgPuff(g, f) {
      var big = f % 2 === 0, dark = f >= 2, lo = dark ? '#3a4766' : '#c9def1', hi = dark ? '#4d5b7c' : '#dcebf8', top = dark ? '#5d6c8e' : '#e6f2fb';
      var d = big ? [[24, 28, 14], [46, 22, 18], [70, 25, 15], [88, 30, 10], [12, 32, 9]] : [[16, 22, 9], [32, 18, 12], [48, 22, 9]];
      var i, w = big ? 112 : 64;
      for (i = 0; i < d.length; i++) w3Disc(g, lo, d[i][0] + 2, d[i][1] + 2, d[i][2]);
      for (i = 0; i < d.length; i++) w3Disc(g, hi, d[i][0], d[i][1], d[i][2]);
      for (i = 0; i < d.length; i++) w3Disc(g, top, d[i][0] - 2, d[i][1] - 3, Math.max(3, d[i][2] - 6));
      g.fillStyle = lo; g.fillRect(6, big ? 36 : 28, w - 12, 4);
    }
    Q.defSprite('w3-bgpuff', { w: 112, h: 40, n: 4, draw: w3BgPuff });
    Q.defSprite('w3-bgsea', { w: 160, h: 40, n: 2, draw: function (g, f) {   // a strip of cloud tops that repeats every 160 px
      var lo = f ? '#33405e' : '#bdd6ee', hi = f ? '#45547a' : '#d3e6f6', i, xs = [0, 22, 46, 70, 96, 120, 142, 160], rs = [14, 11, 16, 12, 15, 10, 13, 14];
      for (i = 0; i < xs.length; i++) w3Disc(g, lo, xs[i], 22 + (i % 2) * 3, rs[i]);
      g.fillStyle = lo; g.fillRect(0, 24, 160, 16);
      for (i = 0; i < xs.length; i++) w3Disc(g, hi, xs[i] - 2, 20 + (i % 2) * 3, rs[i] - 5);
    } });
    var w3Far = [[0, 30, 0], [170, 58, 1], [300, 22, 0], [410, 70, 1]];          // x, y, frame: every 520 px
    var w3Near = [[40, 104, 0], [250, 120, 1], [360, 96, 0]];                     // every 460 px
    var w3Seed = [];
    (function () { var s = 7, i; function r() { s = (s * 16807) % 2147483647; return s / 2147483647; } for (i = 0; i < 40; i++) w3Seed.push([r(), r(), r()]); })();

    function w3BgSun(g, t, kind, camX) {
      var C = Q.w3.C, x = 258 - Math.round(camX * 0.01) % 8, y = 42, i, a;
      if (kind === 'loop') { x = 26; y = 40; }   // THE LOOP: top left, clear of the ring's track (pale arrows would vanish on it)
      if (kind === 'storm') return;
      w3Disc(g, 'rgba(255,240,170,0.35)', x, y, 19);
      w3Disc(g, C.y, x, y, 13); w3Disc(g, '#ffe680', x - 2, y - 2, 9); w3Disc(g, '#fff6c8', x - 4, y - 4, 4);
      if (kind === 'loop') {   // the sun of THE LOOP is a loading ring
        for (i = 0; i < 12; i++) {
          a = i / 12 * Math.PI * 2; var lit = (i + Math.floor(t * 10)) % 12;
          g.fillStyle = lit < 4 ? C.w : lit < 8 ? '#ffe680' : 'rgba(255,230,140,0.45)';
          g.fillRect(Math.round(x + Math.cos(a) * 22) - 1, Math.round(y + Math.sin(a) * 22) - 1, 3, 3);
        }
      } else {
        for (i = 0; i < 8; i++) {
          a = i / 8 * Math.PI * 2 + t * 0.15;
          g.fillStyle = '#ffe680'; g.fillRect(Math.round(x + Math.cos(a) * 19) - 1, Math.round(y + Math.sin(a) * 19) - 1, 2, 2);
          g.fillRect(Math.round(x + Math.cos(a) * 23) - 1, Math.round(y + Math.sin(a) * 23) - 1, 2, 2);
        }
      }
    }
    function w3BgRow(g, list, period, px, py, camX, camY, drift, frameAdd) {
      var i, x, y, off = camX * px + drift;
      for (i = 0; i < list.length; i++) {
        x = list[i][0] - off; x = ((x % period) + period) % period - 112;
        y = list[i][1] - Math.round(camY * py);
        if (x < Q.W) Q.spr(g, 'w3-bgpuff', list[i][2] + frameAdd, x, y);
        if (x + period < Q.W) Q.spr(g, 'w3-bgpuff', list[i][2] + frameAdd, x + period, y);
      }
    }
    Q.defBg('cloud', function (g, camX, camY, t, Q) {
      var kind = (Q.level && Q.level.w3sky) || 'day', sky = Q.w3.SKY[kind] || Q.w3.SKY.day, i, x, y, dark = kind === 'storm' ? 2 : 0;
      for (i = 0; i < 8; i++) { g.fillStyle = sky[i]; g.fillRect(0, i * 25, Q.W, 25); }
      if (kind === 'storm') {   // sheet lightning far away: two quick flashes every few seconds
        var ph = t % 6.3;
        if (ph < 0.08 || (ph > 0.16 && ph < 0.22)) { g.fillStyle = 'rgba(200,214,255,0.22)'; g.fillRect(0, 0, Q.W, Q.H); }
      }
      w3BgSun(g, t, kind, camX);
      w3BgRow(g, w3Far, 520, 0.12, 0.05, camX, camY, kind === 'wind' ? t * 14 : t * 2, dark);
      if (kind === 'day') {   // files rising like seeds
        for (i = 0; i < 10; i++) {
          x = Math.round(((w3Seed[i][0] * 360 - camX * 0.2) % 360 + 360) % 360) - 20; y = Math.round(((w3Seed[i][1] * 230 - t * (8 + w3Seed[i][2] * 8)) % 230 + 230) % 230) - 15;
          g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(x, y, 3, 4); g.fillStyle = 'rgba(46,196,182,0.7)'; g.fillRect(x + 1, y - 2, 1, 1);
        }
      }
      w3BgRow(g, w3Near, 460, 0.3, 0.12, camX, camY, kind === 'wind' ? t * 30 : t * 4, dark);
      if (kind === 'wind' && Q.level && Q.level.w3pail) {   // inside the bucket: its far wall, ribbed, under its rim
        var pw = Q.level.w3pail, top = Math.round(pw.y - camY * 0.55 - 20), x0 = Math.round(pw.x0 - camX * 0.55), x1 = Math.round(pw.x1 - camX * 0.55);
        if (top < Q.H && x1 > 0 && x0 < Q.W) {
          g.fillStyle = '#2d5f9c'; g.fillRect(Math.max(0, x0), Math.max(0, top), Math.min(Q.W, x1) - Math.max(0, x0), Q.H - Math.max(0, top));
          g.fillStyle = '#3a6fae'; for (i = x0 + 12; i < x1; i += 28) if (i > -4 && i < Q.W) g.fillRect(i, Math.max(0, top + 8), 3, Q.H);
          g.fillStyle = '#6fa3df'; g.fillRect(Math.max(0, x0), top, Math.min(Q.W, x1) - Math.max(0, x0), 5); g.fillStyle = '#1d1d24'; g.fillRect(Math.max(0, x0), top + 5, Math.min(Q.W, x1) - Math.max(0, x0), 1);
        }
      }
      y = 168 - Math.round(camY * 0.2); x = -(Math.round(camX * 0.45) % 160);
      for (i = 0; i < 4; i++) Q.spr(g, 'w3-bgsea', dark ? 1 : 0, x + i * 160, y);
      g.fillStyle = dark ? '#33405e' : '#bdd6ee'; if (y + 40 < Q.H) g.fillRect(0, y + 40, Q.W, Q.H - y - 40);
      if (kind === 'storm') {   // rain
        g.fillStyle = 'rgba(170,190,230,0.45)';
        for (i = 0; i < 40; i++) {
          x = Math.round(((w3Seed[i][0] * 340 + t * 50 - camX * 0.6) % 340 + 340) % 340) - 10; y = Math.round(((w3Seed[i][1] * 220 + t * (260 + w3Seed[i][2] * 80)) % 220)) - 10;
          g.fillRect(x, y, 1, 4); g.fillRect(x - 1, y + 4, 1, 2);
        }
      }
    });
