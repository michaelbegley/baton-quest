    // ---------- 83-w3-world.js: WORLD 3, THE CLOUD (builder 8): the world, and its mechanics ----------
    // Each level of world 3 calls Q.w3.enter(Q) from onEnter and Q.w3.tick(dt, Q) from update. Its def may carry:
    //   w3sky: 'day' | 'wind' | 'storm' | 'loop' (the background's look)
    //   w3wind: [{ a, b, top, bot, dir, v, calm, warn, gust, phase, steady }]  wind zones by tile columns a..b (rows top..bot): calm, then a warning, then a gust
    //   w3storm: [{ a, b, every, behind }]  lightning zones: while he is in one, a mark flashes on the ground ahead of him, then the bolt lands there
    //     (behind: the mark lands 56 to 72 px behind him instead, never on what he stands on: for a bridge of SYNC clouds, where he must wait; a mark that
    //     would fall outside the zone is skipped)
    //   w3tokens: [[tx, ty, kind]]  tokens placed in code (inside upload arrows, where the map has a U)
    //   w3sync: { period, warn }  the SYNC clouds: version A (tiles 1, 3, 7) and version B (2, 4, 8) take turns; at each swap both are there, blinking
    // Upload arrows are tiles: any 'U' he stands in lifts him (83-w3-art.js).
    Q.w3 = Q.w3 || {};
    Q.defWorld(3, { name: 'THE CLOUD', levels: ['w3-1', 'w3-2', 'w3-3'], boss: 'w3-boss', agent: 'c3', ability: 'pound', color: '#6ec3f4', music: 'w3' });
    Q.w3.LIFT_V = 190; Q.w3.LIFT_ACC = 2800; Q.w3.BEAT = 60 / 92;   // the lift's top speed and pull; the gates' beat: the 'w3' song's tempo (92 a minute)
    Q.w3.st = null;
    Q.w3.sx = function (x) { return Math.round(x - Q.cam.x); };
    Q.w3.sy = function (y) { return Math.round(y - Q.cam.y); };
    Q.w3.word = function (table, id, fb) {   // a word from STORY's bank (48-story-bank.js), with a fallback
      var s = Q.story && Q.story[table] && Q.story[table][id];
      if (!s) return fb;
      if (typeof s === 'string') return s;
      return s.length ? s[Math.floor(Q.rand() * s.length) % s.length] : fb;
    };
    Q.w3.pop = function (e, text, col) { Q.fx('text', e.x + e.w / 2, e.y - 4, { text: text, col: col || '#ffffff' }); };

    Q.w3.enter = function (Q) {
      var L = Q.level || {}, st = { lvl: L, t: 0, wind: [], storm: L.w3storm || [], bolts: [], boltT: 1.5, sync: null, fx: null, fxCheck: 0, gustSfx: {} }, i, z, th = (L.th || (L.map ? L.map.length : 13)) * 16;
      Q.w3.st = st;
      for (i = 0; L.w3wind && i < L.w3wind.length; i++) {
        z = L.w3wind[i];
        st.wind.push({ x0: z.a * 16, x1: (z.b + 1) * 16, y0: z.top !== undefined ? z.top * 16 : -64, y1: z.bot !== undefined ? (z.bot + 1) * 16 : th + 64, dir: z.dir || 1, v: z.v || 70,
          calm: z.calm === undefined ? 2.2 : z.calm, warn: z.warn === undefined ? 0.9 : z.warn, gust: z.gust === undefined ? 1.8 : z.gust, phase: z.phase || 0, steady: !!z.steady, mode: 'calm', k: 0 });
      }
      if (L.w3sync) {
        st.sync = { period: L.w3sync.period || 4, warn: L.w3sync.warn || 0.7, a: [], b: [], mode: -1 };
        var A = Q.findTiles('1'), B = Q.findTiles('2');
        for (i = 0; i < A.length; i++) st.sync.a.push(A[i]);
        for (i = 0; i < B.length; i++) st.sync.b.push(B[i]);
        Q.w3.syncSet(st.sync, 0);
      }
      for (i = 0; L.w3tokens && i < L.w3tokens.length; i++) {   // tokens a map cannot hold (inside an upload arrow's column): [tx, ty, kind]
        z = L.w3tokens[i]; Q.spawn('pickup', z[0] * 16 + (z[2] === 'bigtoken' ? 2 : 4), z[1] * 16 + (z[2] === 'bigtoken' ? 2 : 4), { kind: z[2] || 'token' });
      }
      Q.w3.fxSpawn(st);
      return st;
    };
    Q.w3.fxSpawn = function (st) {
      var P = Q.P, e = Q.spawn('w3fx', P ? P.x : 0, P ? P.y - 40 : 0, {});
      st.fx = e;
    };

    // the conductor's box and whether it touches an upload arrow
    Q.w3.inLift = function (P) {
      var tx, ty;
      for (ty = Math.floor(P.y / 16); ty <= Math.floor((P.y + P.h - 0.01) / 16); ty++)
        for (tx = Math.floor(P.x / 16); tx <= Math.floor((P.x + P.w - 0.01) / 16); tx++) if (Q.tile(tx, ty) === 'U') return true;
      return false;
    };
    var w3Push = { x: 0, y: 0, w: 10, h: 14, vx: 0, vy: 0 };
    Q.w3.pushX = function (P, v, dt) {   // the wind moves him across through Q.move, so a wall still stops him
      w3Push.x = P.x; w3Push.y = P.y; w3Push.w = P.w; w3Push.h = P.h; w3Push.vx = v; w3Push.vy = 0;
      Q.move(w3Push, dt);
      P.x = w3Push.x;
    };

    Q.w3.tick = function (dt, Q) {
      var st = Q.w3.st, P = Q.P, i, z, c, cyc, cx, cy, mode, near;
      if (!st || st.lvl !== Q.level) st = Q.w3.enter(Q);
      if (!P) return;
      st.t += dt;
      st.fxCheck -= dt;
      if (!st.fx || st.fx.dead || (st.fxCheck <= 0 && Q.ents.indexOf(st.fx) < 0)) Q.w3.fxSpawn(st);
      if (st.fxCheck <= 0) st.fxCheck = 0.5;
      cx = P.x + P.w / 2; cy = P.y + P.h / 2;
      // upload arrows: a steady pull upward; they also give back the jump's quick keys and pause
      if (!P.dead && Q.w3.inLift(P)) {
        if (P.vy > -Q.w3.LIFT_V) P.vy = Math.max(P.vy - Q.w3.LIFT_ACC * dt, -Q.w3.LIFT_V);
        P.hovering = false; P.ground = false; P.on = null;
        if ('airHover' in P) { P.airHover = true; P.airDash = true; }
        if (!st.inLift) Q.sfx('spring');
        st.inLift = true; st.lifted = (st.lifted || 0) + dt;
      } else st.inLift = false;
      // wind: each zone goes calm, warning, gust (or blows all the time); in a gust he is pushed along
      for (i = 0; i < st.wind.length; i++) {
        z = st.wind[i];
        if (z.steady) mode = 'gust';
        else {
          cyc = z.calm + z.warn + z.gust; c = ((st.t + z.phase) % cyc + cyc) % cyc;
          mode = c < z.calm ? 'calm' : c < z.calm + z.warn ? 'warn' : 'gust';
        }
        near = cx > z.x0 - 200 && cx < z.x1 + 200;
        if (mode === 'warn' && z.mode !== 'warn' && near) Q.sfx('fan');
        z.mode = mode;
        z.k = mode === 'gust' ? Math.min(1, z.k + dt * 5) : Math.max(0, z.k - dt * 4);
        if (z.k > 0 && !P.dead && cx >= z.x0 && cx < z.x1 && cy >= z.y0 && cy < z.y1) Q.w3.pushX(P, z.dir * z.v * z.k, dt);
      }
      // lightning
      Q.w3.stormTick(st, dt, P);
      // the SYNC clouds
      if (st.sync) Q.w3.syncTick(st.sync, st.t);
    };

    Q.w3.groundBelow = function (x, y0) {   // the top of the first solid or thin tile under x, from y0 down (or the bottom of the view)
      var tx = Math.floor(x / 16), ty, ch, t, lim = Math.floor((Q.cam.y + Q.H + 32) / 16);
      for (ty = Math.max(0, Math.floor(y0 / 16)); ty <= lim; ty++) {
        ch = Q.tile(tx, ty);
        if (ch === '#' || ch === '=' || ch === 'X' || ch === 'P' || ch === '1' || ch === '2' || ch === '7' || ch === '8') return ty * 16;
        t = Q.TILEDEF[3] && Q.TILEDEF[3][ch]; if (t && (t.solid || t.oneWay)) return ty * 16;
      }
      return Q.cam.y + Q.H + 16;
    };
    Q.w3.stormTick = function (st, dt, P) {
      var i, z, b, cx = P.x + P.w / 2, inZone = null;
      for (i = 0; i < st.storm.length; i++) { z = st.storm[i]; if (cx >= z.a * 16 && cx < (z.b + 1) * 16) inZone = z; }
      if (inZone && !P.dead) {
        st.boltT -= dt;
        if (st.boltT <= 0) {
          var x = inZone.behind ? cx - 56 - Q.rand() * 16 : cx + Q.clamp(P.vx, -110, 110) * 0.55 + (Q.rand() - 0.5) * 36;
          if (inZone.behind && x < inZone.a * 16 + 8) st.boltT = (inZone.every || 3) * (0.8 + Q.rand() * 0.4);   // nothing of the zone behind him yet
          else {
            x = Q.clamp(x, inZone.a * 16 + 8, (inZone.b + 1) * 16 - 8);
            b = { x: Math.round(x), gy: Q.w3.groundBelow(x, Q.cam.y + 16), t: 0, hit: false, seed: Math.floor(Q.rand() * 1000) };
            st.bolts.push(b);
            st.boltT = (inZone.every || 3) * (0.8 + Q.rand() * 0.4);
            Q.sfx('charge');
          }
        }
      } else st.boltT = Math.max(st.boltT, 1.2);
      for (i = st.bolts.length - 1; i >= 0; i--) {
        b = st.bolts[i]; var was = b.t; b.t += dt;
        if (was < 0.9 && b.t >= 0.9) { Q.sfx('zap'); Q.shake(2, 0.15); Q.fx('spark', b.x, b.gy - 2); Q.fx('dust', b.x, b.gy); }
        if (b.t >= 0.9 && b.t < 1.08 && !b.hit && !P.dead) {
          if (P.x < b.x + 5 && P.x + P.w > b.x - 5 && P.y + P.h > Q.cam.y - 32 && P.y < b.gy + 2) { if (Q.hurt(1, b.x)) b.hit = true; }
        }
        if (b.t > 1.4) st.bolts.splice(i, 1);
      }
    };

    // the SYNC clouds: two versions of the same clouds; one is there while the other is only an outline, then they swap (each blinks first).
    // notSafe (QUEST-API.md part 13, item 27): never his last safe ground, since a version may be only an outline when he comes back to it.
    Q.defTile(3, '1', { oneWay: true, notSafe: true, art: 'w3-synca' });              // version A, there
    Q.defTile(3, '7', { oneWay: true, notSafe: true, art: 'w3-synca-go', fps: 10 });  // version A, there and blinking: the two versions conflict
    Q.defTile(3, '3', { solid: false, notSafe: true, art: 'w3-synca-off' });          // version A, only an outline
    Q.defTile(3, '2', { oneWay: true, notSafe: true, art: 'w3-syncb' });
    Q.defTile(3, '8', { oneWay: true, notSafe: true, art: 'w3-syncb-go', fps: 10 });
    Q.defTile(3, '4', { solid: false, notSafe: true, art: 'w3-syncb-off' });
    Q.w3.syncSet = function (s, mode) {   // mode 0: A there, B an outline; 1 and 3: both there, blinking (the swap: hop now); 2: B there, A an outline
      var aCh = ['1', '7', '3', '7'][mode], bCh = ['4', '8', '2', '8'][mode], i;
      for (i = 0; i < s.a.length; i++) Q.setTile(s.a[i].tx, s.a[i].ty, aCh);
      for (i = 0; i < s.b.length; i++) Q.setTile(s.b[i].tx, s.b[i].ty, bCh);
      s.mode = mode;
    };
    Q.w3.syncTick = function (s, t) {
      var half = s.period / 2, c = t % s.period, mode = c < half - s.warn ? 0 : c < half ? 1 : c < s.period - s.warn ? 2 : 3;
      if (mode !== s.mode) { Q.w3.syncSet(s, mode); Q.sfx(mode === 1 || mode === 3 ? 'type' : 'tick'); }
    };
    function w3SyncArt(g, f, body, deep, lite) {   // f 0: there; 1: there, faded; 2: only an outline; 3: a bright outline
      var x, t, b, c = f === 3 ? lite : body;
      for (x = 0; x < 16; x++) {
        t = w3PuffTop[x]; b = w3PuffBot[x];
        if (f === 0) { w3R(g, body, x, t, 1, b - t); w3R(g, lite, x, t + 1, 1, 2); w3R(g, deep, x, b - 2, 1, 2); w3R(g, '#1d1d24', x, t, 1, 1); w3R(g, '#1d1d24', x, b, 1, 1); }
        else if (f === 1) { w3R(g, lite, x, t, 1, b - t + 1); }
        else if ((x + (f === 3 ? 1 : 0)) % 2 === 0) { w3R(g, c, x, t, 1, 1); w3R(g, c, x, b, 1, 1); }
      }
      if (f >= 2) { w3R(g, c, 0, 4, 1, 2); w3R(g, c, 15, 4, 1, 2); }
    }
    function w3SyncSprites(id, body, deep, lite) {
      Q.defSprite(id, { w: 16, h: 16, n: 1, draw: function (g) { w3SyncArt(g, 0, body, deep, lite); } });
      Q.defSprite(id + '-go', { w: 16, h: 16, n: 2, draw: function (g, f) { w3SyncArt(g, f, body, deep, lite); } });
      Q.defSprite(id + '-off', { w: 16, h: 16, n: 1, draw: function (g) { w3SyncArt(g, 2, body, deep, lite); } });
      Q.defSprite(id + '-on', { w: 16, h: 16, n: 2, draw: function (g, f) { w3SyncArt(g, f + 2, body, deep, lite); } });
    }
    w3SyncSprites('w3-synca', '#7fe0d6', '#3fb3a8', '#d8fbf6');
    w3SyncSprites('w3-syncb', '#f6a6c8', '#d56d9a', '#fde3ef');
