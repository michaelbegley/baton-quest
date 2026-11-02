    // ---------- 81-w1-enemies.js: WORLD 1, THE INBOX: SPAM, UNSUB BOT, OUT OF OFFICE, FLAGGED and the falling letter (builder 6) ----------
    // Each has a clear tell before it attacks: SPAM squashes before it hops; an UNSUB BOT leans back with its bulb red before it charges; OUT OF
    // OFFICE wakes and shows three dots before its auto-reply; FLAGGED shakes and kicks up dust before it springs out of the floor. The level's
    // pace (world 1's own field) speeds them up a little in later levels. Their pop words are LORE.md's (Q.story's when it is there).
    function w1Floor(px, py) { return Q.solid(px, py) || Q.tile(Math.floor(px / 16), Math.floor(py / 16)) === '='; }
    function w1CanHop(e, dir, dist) {   // a wall in the way, or no floor where the hop lands: turn round instead
      var cx = e.x + e.w / 2, edge = cx + dir * (e.w / 2 + 2);
      if (Q.solid(edge, e.y + 2) || Q.solid(edge, e.y + e.h - 3)) return false;
      return w1Floor(cx + dir * dist, e.y + e.h + 4) && w1Floor(cx + dir * (dist - 8), e.y + e.h + 4);
    }
    function w1CanWalk(e, dir) {
      var fx = dir > 0 ? e.x + e.w + 1 : e.x - 1;
      if (Q.solid(fx, e.y + 2) || Q.solid(fx, e.y + e.h - 3)) return false;
      return w1Floor(fx, e.y + e.h + 4);
    }
    function w1Side(e) { var P = Q.P; return P && P.x + P.w / 2 > e.x + e.w / 2 ? 1 : -1; }

    // ---------- SPAM: a bouncing envelope, so pleased with itself ----------
    Q.defEnemy('spam', {
      name: 'SPAM', w: 12, h: 10, hp: 1, xp: 1, tokens: 1, touch: 1, stomp: true, col: '#fffdf7',
      init: function (e) { e.st = 'sit'; e.data.wait = 0.3 + Q.rand() * 0.6; },
      update: function (e) {
        var pace = Q.w1.pace(), d = e.data;
        if (e.st === 'sit') {
          e.vx = 0; e.frame = e.stT > d.wait ? 1 : 0;   // squashed: about to hop
          if (e.ground && e.stT > d.wait + 0.28 / pace) {
            if (!w1CanHop(e, e.face, 22)) e.face = -e.face;
            if (w1CanHop(e, e.face, 22)) { e.vy = -205; e.vx = e.face * 44 * pace; e.st = 'hop'; }
            d.wait = (0.6 + Q.rand() * 0.5) / pace;
            if (e.st === 'sit') e.st = 'stay';
          }
        } else if (e.st === 'stay') { e.vx = 0; e.frame = 0; if (e.stT > 0.4) e.st = 'sit'; }
        else if (e.st === 'hop') {
          e.frame = 2;
          if (e.wallL || e.wallR) e.vx = 0;
          if (e.ground && e.stT > 0.06) { e.st = 'sit'; e.vx = 0; Q.fx('dust', e.x + e.w / 2, e.y + e.h, { n: 2 }); }
        }
      },
      die: function (e) { Q.w1.say(e, Q.w1.pop('spam')); }
    });

    // ---------- UNSUB BOT: it only knows one job, and does it to everything ----------
    Q.defEnemy('unsub', {
      name: 'UNSUB BOT', w: 12, h: 14, hp: 2, xp: 2, tokens: 1, touch: 1, stomp: true, col: '#d3d9e4',
      init: function (e) { e.st = 'walk'; },
      update: function (e) {
        var pace = Q.w1.pace(), P = Q.P, dx = 999, dy = 999, front;
        if (P) { dx = (P.x + P.w / 2) - (e.x + e.w / 2); dy = Math.abs((P.y + P.h) - (e.y + e.h)); }
        front = (dx > 0 ? 1 : -1) === e.face;
        if (e.st === 'walk') {
          if (!w1CanWalk(e, e.face)) e.face = -e.face;
          e.vx = e.face * 26 * pace; e.frame = Math.floor(e.t * 6) % 2;
          if (front && Math.abs(dx) < 76 && dy < 20 && e.stT > 0.4) { e.st = 'wind'; Q.sfx('zap'); }
          else if (!front && Math.abs(dx) < 44 && dy < 20 && e.stT > 1.2) { e.face = -e.face; e.st = 'look'; }
        } else if (e.st === 'look') { e.vx = 0; e.frame = 0; if (e.stT > 0.3) e.st = 'walk'; }
        else if (e.st === 'wind') { e.vx = 0; e.frame = 2; if (e.stT > 0.5 / Math.sqrt(pace)) e.st = 'lunge'; }   // the tell: it leans back, bulb red
        else if (e.st === 'lunge') {
          e.frame = 3; e.vx = e.face * 135;
          if (!w1CanWalk(e, e.face) || e.stT > 0.36) { e.vx = 0; e.st = 'cool'; }
        } else if (e.st === 'cool') { e.vx = 0; e.frame = 0; if (e.stT > 0.75) e.st = 'walk'; }
        else if (e.st === 'reel') {
          e.frame = 2; e.vx = Q.approach(e.vx, 0, 400 * Q.DT);
          if (e.ground && e.stT > 0.3) { e.face = w1Side(e); e.st = 'cool'; }
        }
      },
      hit: function (e, how, n) {
        if (e.hp - n > 0) {   // not yet: it reels, and asks
          e.st = 'reel'; e.vx = -w1Side(e) * 90; e.vy = -90;
          Q.w1.say(e, 'ARE YOU SURE?');
        }
      },
      die: function (e) { Q.w1.say(e, Q.w1.pop('unsub')); }
    });

    // ---------- OUT OF OFFICE: an auto-reply left on years ago; it drifts, and it answers everything. Asleep it is never really there: faded, and
    // touching it does nothing; awake (its tell, then the reply) it is solid, its touch hurts, and it can be jumped on. Its reply is a springboard. ----------
    Q.defEnemy('ooo', {
      name: 'OUT OF OFFICE', w: 14, h: 13, hp: 2, xp: 2, tokens: 1, touch: 1, gravity: 0, solid: false, col: '#fffdf7',
      init: function (e) {
        var d = e.data; d.x0 = e.x; d.y0 = e.y - 6; d.ph = (e.o.tx || 0) * 0.7; d.cool = 1.2 + Q.rand(); d.range = e.o.range || 40; e.st = 'drift'; e.touch = 0;
      },
      update: function (e, dt) {
        var pace = Q.w1.pace(), d = e.data, P = Q.P, nx, dx, dy, len;
        e.vx = 0; e.vy = 0;
        if (e.st === 'drift') {
          d.ph += dt * 0.9 * pace;
          nx = d.x0 + Math.sin(d.ph) * d.range;
          if (Math.abs(nx - e.x) > 0.01) e.face = nx > e.x ? 1 : -1;
          e.x = nx; e.y = d.y0 + Math.sin(e.t * 2.2) * 3; e.frame = Math.floor(e.t * 3) % 2;
          d.cool -= dt;
          if (d.cool <= 0 && Q.near(e, 120)) e.st = 'tell';
        } else if (e.st === 'tell') {   // it wakes: eyes open, three dots
          e.frame = 2; e.face = w1Side(e);
          if (e.stT > 1.2 && P) {   // awake for 1.2 s before the reply (was 0.6), so there is time to jump on it
            dx = P.x + P.w / 2 - (e.x + e.w / 2); dy = P.y + P.h / 2 - (e.y + 6); len = Math.sqrt(dx * dx + dy * dy) || 1;
            var rp = Q.spawn('shot', e.x + e.w / 2 - 4, e.y + 4, { vx: dx / len * 72, vy: dy / len * 72, sprite: 'w1-reply', w: 8, h: 6, life: 2.4 });
            if (rp) { rp.stomp = true; rp.spring = 380; }   // its reply is a springboard: land on it and it throws him higher than a jump
            Q.w1.say(e, 'AUTO-REPLY', -8); Q.sfx('type');
            e.st = 'after';
          }
        } else if (e.st === 'after') { e.frame = 2; if (e.stT > 0.7) { e.st = 'drift'; d.cool = (2.6 + Q.rand()) / pace; } }
        e.touch = e.st === 'drift' ? 0 : 1; e.stomp = e.st !== 'drift';   // awake, it can be jumped on (2 Nov, the boss's idea); set last, so the frame it wakes counts
      },
      draw: function (e, g) {
        if (e.st === 'drift') g.globalAlpha = 0.6;
        Q.w1.draw(e, g, 'ooo', e.frame);
        g.globalAlpha = 1;
        if (e.st === 'tell') {   // ...
          var x = Math.round(e.x + e.w / 2 - Q.cam.x), y = Math.round(e.y - 6 - Q.cam.y), n = Math.min(3, 1 + Math.floor(e.stT * 5));
          for (var i = 0; i < n; i++) { g.fillStyle = '#1d1d24'; g.fillRect(x - 6 + i * 4, y - 1, 4, 4); g.fillStyle = '#fffdf7'; g.fillRect(x - 5 + i * 4, y, 2, 2); }
        }
      },
      die: function (e) { Q.w1.say(e, Q.w1.pop('ooo')); }
    });

    // ---------- FLAGGED: everything was flagged urgent, so nothing is; it springs out of the floor ----------
    Q.defEnemy('flag', {
      name: 'FLAGGED', w: 10, h: 16, hp: 2, xp: 2, tokens: 1, touch: 0, gravity: 0, solid: false, col: '#d93a3a',
      init: function (e) { e.data.floor = e.y + e.h; e.data.up = 0; e.st = 'hidden'; e.h = 4; e.y = e.data.floor - 4; },
      update: function (e, dt) {
        var d = e.data, P = Q.P, pace = Q.w1.pace();
        e.vx = 0; e.vy = 0;
        if (e.st === 'hidden') {
          d.up = Q.approach(d.up, 0, dt * 5);
          if (P && e.stT > 0.9 && Math.abs((P.x + P.w / 2) - (e.x + e.w / 2)) < 40 && Math.abs((P.y + P.h) - d.floor) < 44) { e.st = 'rumble'; Q.fx('text', e.x + e.w / 2, d.floor - 10, { text: '!', col: '#f47a68' }); }
        } else if (e.st === 'rumble') {   // the tell: the tip shakes, dust rises
          if (Math.floor(e.stT * 16) !== Math.floor((e.stT - dt) * 16)) Q.fx('dust', e.x + e.w / 2, d.floor, { n: 1 });
          if (e.stT > 0.5 / Math.sqrt(pace)) { e.st = 'up'; Q.sfx('spring'); }
        } else if (e.st === 'up') { d.up = Q.approach(d.up, 1, dt * 9); if (e.stT > 1.5) e.st = 'down'; }
        else if (e.st === 'down') { d.up = Q.approach(d.up, 0, dt * 3); if (d.up <= 0) { e.st = 'hidden'; } }
        e.touch = d.up > 0.55 ? 1 : 0;
        e.h = Math.round(4 + 12 * d.up); e.y = d.floor - e.h;
        e.frame = Math.floor(e.t * 5) % 2;
      },
      hit: function (e) { if (e.data.up < 0.55) return false; e.data.up = 1; if (e.st === 'down') e.st = 'up'; },
      draw: function (e, g) {
        var d = e.data, line = Math.round(d.floor - Q.cam.y), sh = e.st === 'rumble' ? (Math.floor(e.t * 30) % 2 ? 1 : -1) : 0;
        if (e.hurtT > 0 && Math.floor(Q.t * 24) % 2) return;
        g.save(); g.beginPath(); g.rect(0, 0, Q.W, line); g.clip();
        Q.spr(g, 'flag', e.frame, Math.round(e.x + e.w / 2 - 7 + sh - Q.cam.x), Math.round(d.floor + Math.round((1 - d.up) * 14) - 18 - Q.cam.y), e.face < 0);
        g.restore();
      },
      die: function (e) { Q.w1.say(e, Q.w1.pop('flag')); }
    });

    // ---------- a falling letter (from a chute, or the Hydra's reply-all rain): its shadow shows where it lands; the baton swats it ----------
    Q.defEnemy('w1-mail', {
      name: 'A LETTER', w: 10, h: 7, hp: 1, xp: 0, tokens: 0, touch: 1, gravity: 0, solid: false, col: '#fffdf7',
      init: function (e) {
        var o = e.o, d = e.data;
        d.wait = o.wait || 0; d.wait0 = d.wait || 1; d.v = o.vy || 300; d.floor = o.floor || Q.w1.floorBelow(e.x + e.w / 2, e.y + e.h);
        e.vy = 0; e.temp = true; if (o.always) e.always = true;
      },
      update: function (e, dt) {
        var d = e.data;
        if (d.wait > 0) { d.wait -= dt; e.vy = 0; } else e.vy = d.v;
        e.frame = Math.floor(e.t * 6) % 2;
        if (e.y + e.h >= d.floor) { Q.fx('dust', e.x + e.w / 2, d.floor, { n: 3 }); Q.fx('debris', e.x + e.w / 2, d.floor - 3, { col: '#ece5d5', n: 3 }); Q.remove(e); }
      },
      draw: function (e, g) {
        var d = e.data, a = d.wait > 0 ? 0.4 + 0.4 * (1 - d.wait / d.wait0) : Q.clamp(0.75 - (d.floor - e.y - e.h) / 400, 0.3, 0.75);
        var sx = Math.round(e.x + e.w / 2 - Q.cam.x), sy = Math.round(d.floor - Q.cam.y);
        g.globalAlpha = a; g.fillStyle = '#0b0c1c'; g.fillRect(sx - 7, sy, 14, 2); g.fillRect(sx - 5, sy + 2, 10, 1); g.globalAlpha = 1;   // on the floor's top face
        if (e.y + e.h > Q.cam.y) Q.spr(g, 'w1-letter', e.frame, Math.round(e.x - Q.cam.x), Math.round(e.y + e.h - 8 - Q.cam.y), false);
      }
    });
