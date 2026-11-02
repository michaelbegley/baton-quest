    // ---------- 82-w2-world.js: WORLD 2, THE SERVER ROOM: the world, its own tiles, the fans' updrafts and the cables SPARKs run along (builder 7) ----------
    // Tiles (QUEST-API.md part 5: capitals, digits and marks the base set leaves free):
    //   H a rack (solid, lights blinking)   A the one warm server (solid; the cat sleeps on it)   U Rack 7's body (solid; the boss draws over it)
    //   C a cold-air floor grille (solid)   V a hot floor grille (solid)   F a fan (solid): an updraft rises from it to the first solid tile, at most 8 tiles
    //   G and J fans that switch on and off in turn (solid; J runs half a cycle behind G; while running they show as G on, W about to stop, I off)
    //   B a rack further back, N a network switch, L a ceiling light, T a wall monitor, Q the recess in Rack 7 where C2 is taped (all not solid)
//   D the secret door to COLD STORAGE (a rack with its door ajar), Y a shelf of backup tapes, M icicles (not solid)
    //   - | + cables (not solid): SPARKs run along them; a + is a junction where they may turn
    Q.w2 = Q.w2 || {};
    Q.defTile(2, 'H', { solid: true, art: 't2-rack', fps: 3 });
    Q.defTile(2, 'A', { solid: true, art: 't2-warm', fps: 2 });
    Q.defTile(2, 'U', { solid: true, art: 't2-rack', frame: 2, fps: 2 });
    Q.defTile(2, 'C', { solid: true, art: 't2-cold', fps: 2 });
    Q.defTile(2, 'V', { solid: true, art: 't2-hot', fps: 3 });
    // updraft (data only, for the QA lint; the lift itself is Q.w2.step below): the column's height in tiles; rise: its speed (px/s);
    // cycle: [on, about to stop, off] seconds, and the half of the cycle the fan starts in (G 0: on; J 1: off)
    Q.defTile(2, 'F', { solid: true, art: 't2-fan', fps: 12, updraft: 8, rise: 190 });
    Q.defTile(2, 'G', { solid: true, art: 't2-fan', fps: 12, updraft: 8, rise: 190, cycle: [2.8, 0.7, 1.5], phase: 0 });
    Q.defTile(2, 'W', { solid: true, art: 't2-fanwarn', fps: 12, updraft: 8, rise: 190 });
    Q.defTile(2, 'I', { solid: true, art: 't2-fanoff' });
    Q.defTile(2, 'J', { solid: true, art: 't2-fanoff', updraft: 8, rise: 190, cycle: [2.8, 0.7, 1.5], phase: 1 });
    Q.defTile(2, 'B', { art: 't2-brack', fps: 2 });
    Q.defTile(2, 'N', { art: 't2-switch', fps: 4 });
    Q.defTile(2, 'L', { art: 't2-lamp' });
    Q.defTile(2, 'T', { art: 't2-mon', fps: 1 });
    Q.defTile(2, 'Q', { art: 't2-recess' });
    Q.defTile(2, 'D', { art: 't2-secret', fps: 4 });   // the secret door (QUEST-API part 13, item 26): a rack's door left ajar in the cold aisle
    Q.defTile(2, 'Y', { art: 't2-tape' });             // COLD STORAGE: shelves of old backup tapes
    Q.defTile(2, 'M', { art: 't2-icicle' });           // COLD STORAGE: icicles under the ceiling
    Q.defTile(2, '-', { art: 't2-cable-h' });
    Q.defTile(2, '|', { art: 't2-cable-v' });
    Q.defTile(2, '+', { art: 't2-cable-x', fps: 2 });

    Q.defWorld(2, { name: 'THE SERVER ROOM', levels: ['w2-1', 'w2-2', 'w2-3'], boss: 'w2-boss', agent: 'c2', ability: 'hover', color: '#2ec4b6', music: 'w2' });

    // ---------- the fans: each step he is in a column, his speed is pulled toward rising (fading out at the column's top, so he floats there) ----------
    var W2_FAN = { MAX: 8, RISE: 190, LIFT: 2700, FADE: 24, CYCLE: 5, ON: 2.8, WARN: 0.7 };   // tiles; px/s; px/s per second; px; seconds
    Q.w2.FAN = W2_FAN;
    function w2IsFan(ch) { return ch === 'F' || ch === 'G' || ch === 'J' || ch === 'W' || ch === 'I'; }
    Q.w2.enter = function (Q) {   // a level of this world starts (or starts again): find its fans
      var L = Q.level, st = { lv: L, fans: [], t: 0 }, tx, ty, n, ch, i;
      Q.w2.st = st;
      if (!L || !L.map) return st;
      for (ty = 0; ty < L.map.length; ty++) for (tx = 0; tx < L.map[ty].length; tx++) {
        ch = L.map[ty].charAt(tx);
        if (!w2IsFan(ch)) continue;
        st.fans.push({ tx: tx, ty: ty, x0: tx * 16, x1: tx * 16 + 16, top: 0, bot: ty * 16, cyc: ch === 'G' ? 0 : ch === 'J' ? 1 : ch === 'I' ? -2 : -1, on: ch !== 'I', state: '' });
        w2FanTop(st.fans[st.fans.length - 1]);
      }
      for (i = 0; i < st.fans.length; i++) w2FanState(st.fans[i], 0);
      return st;
    };
    function w2FanTop(f) {   // the column rises to the first solid tile above (a box left on a fan blocks it until it is broken), at most MAX tiles
      for (var n = 0; n < W2_FAN.MAX && f.ty - n - 1 >= 0 && !Q.solid(f.tx * 16 + 8, (f.ty - n - 1) * 16 + 8); n++) {}
      f.top = (f.ty - n) * 16;
    }
    function w2FanState(f, t) {   // a switching fan's state at time t, put into the map as G (on), W (about to stop) or I (off)
      if (f.cyc < 0) { f.on = f.cyc === -1; return; }   // -1: always on (F, or a W put in a map); -2: an I put in a map, a dead fan, off as it is drawn
      var p = (t + f.cyc * W2_FAN.CYCLE / 2) % W2_FAN.CYCLE, s = p < W2_FAN.ON ? 'G' : p < W2_FAN.ON + W2_FAN.WARN ? 'W' : 'I';
      f.on = s !== 'I';
      if (Q.tile(f.tx, f.ty) !== s) Q.setTile(f.tx, f.ty, s);
      if (s !== f.state) { if (s === 'G' && f.state === 'I' && Math.abs(f.tx * 16 - Q.cam.x - 160) < 200 && Math.abs(f.ty * 16 - Q.cam.y - 100) < 140) Q.sfx('fan'); f.state = s; }
    }
    Q.w2.inAir = function (x, y, w, h) {   // the fan column a box is in (null if none)
      var st = Q.w2.st, i, f, ov;
      if (!st) return null;
      for (i = 0; i < st.fans.length; i++) {
        f = st.fans[i]; if (!f.on) continue;
        ov = Math.min(x + w, f.x1) - Math.max(x, f.x0);
        if (ov >= 3 && f.top < f.bot && y + h > f.top - 2 && y < f.bot) return f;
      }
      return null;
    };
    Q.w2.step = function (dt, Q) {   // a level's update: the switching fans, then the lift on the conductor
      var st = Q.w2.st, P = Q.P, i, f, d, target;
      if (!st || st.lv !== Q.level) st = Q.w2.enter(Q);
      st.t += dt; st.reT = (st.reT || 0) - dt;
      for (i = 0; i < st.fans.length; i++) { w2FanState(st.fans[i], st.t); if (st.reT <= 0) w2FanTop(st.fans[i]); }
      if (st.reT <= 0) st.reT = 0.2;
      if (!P || P.dead || P.dashing) return;
      f = Q.w2.inAir(P.x, P.y, P.w, P.h);
      st.sfxT = (st.sfxT || 0) - dt;
      if (!f) { st.inT = 0; return; }
      d = P.y + P.h - f.top;                                       // how far his feet are below the column's top
      target = -W2_FAN.RISE * Q.clamp(d / W2_FAN.FADE, 0, 1);
      if (P.vy > target) P.vy = Math.max(target, P.vy - W2_FAN.LIFT * dt);
      if (!st.inT && st.sfxT <= 0) { Q.sfx('fan'); st.sfxT = 0.5; }
      st.inT = (st.inT || 0) + dt;
    };
    var W2_STREAK = ['rgba(200,250,245,0.1)', 'rgba(200,250,245,0.2)', 'rgba(200,250,245,0.3)', 'rgba(200,250,245,0.4)', 'rgba(200,250,245,0.5)', 'rgba(200,250,245,0.55)'];
    Q.w2.drawAir = function (g, camX, camY, t, Q) {   // from the background: streaks rising in every running fan's column
      var st = Q.w2.st, i, f, k, x, y, h, len, a;
      if (!st || st.lv !== Q.level) return;
      for (i = 0; i < st.fans.length; i++) {
        f = st.fans[i]; if (!f.on) continue;
        x = f.x0 - camX; if (x < -16 || x > 320) continue;
        h = f.bot - f.top; if (h <= 0 || f.top - camY > 200 || f.bot - camY < 0) continue;
        g.fillStyle = f.state === 'W' ? 'rgba(255,90,70,0.06)' : 'rgba(143,240,230,0.07)'; g.fillRect(Math.round(x + 1), Math.round(f.top - camY), 14, h);
        for (k = 0; k < 7; k++) {
          len = 4 + (k % 3) * 2; y = f.bot - ((t * (110 + k * 9) + k * 37 + f.tx * 13) % h) - len;
          a = Math.floor(Q.clamp((y - f.top) / 40, 0, 1) * 6);
          if (a <= 0) continue;
          g.fillStyle = W2_STREAK[Math.min(5, a)];
          g.fillRect(Math.round(x + 2 + ((k * 5 + f.tx) % 12)), Math.round(y - camY), 1, len);
        }
      }
    };

    // ---------- the cables: which way a SPARK may go from a tile ----------
    var W2_DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];   // right, down, left, up
    Q.w2.DIRS = W2_DIRS;
    function w2Opens(ch, d) {   // does a cable tile open toward direction d?
      if (ch === '+') return true;
      if (ch === '-') return d === 0 || d === 2;
      if (ch === '|') return d === 1 || d === 3;
      return false;
    }
    Q.w2.cableLink = function (tx, ty, d) {   // can a spark go from tile (tx, ty) in direction d?
      var a = Q.tile(tx, ty), b = Q.tile(tx + W2_DIRS[d][0], ty + W2_DIRS[d][1]);
      return w2Opens(a, d) && w2Opens(b, (d + 2) % 4);
    };
    Q.w2.isCable = function (ch) { return ch === '-' || ch === '|' || ch === '+'; };
