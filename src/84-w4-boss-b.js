    // ---------- 84-w4-boss-b.js: SCOPE CREEP's parts (B9): its ticket eyes, the big eye, the root ticket, sweeping vines, falling notes, requests, the end ----------
    // Only the eyes, the big eye and the root ticket can be hurt, and they pass the blow to SCOPE CREEP through Q.damage (so the engine keeps its hp and its death).
    var w4B = { fwd: 0 };   // the fight's state (84-w4-boss.js fills it; reset at each spawn)
    Q.w4.boss = w4B; Q.w4.onBeat = function () { return w4OnBeat(); }; Q.w4.beats = function () { return w4Beats(); };   // for checks
    function w4HitBoss(n, how, mult) { var b = Q.boss; if (!b || b.dead || b.id !== 'creep') return false; w4B.fwd = 1; var r = Q.damage(b, Math.max(1, Math.round(n * mult)), how); w4B.fwd = 0; return r; }
    function w4Spark(e) { Q.fx('spark', e.x + e.w / 2, e.y + e.h / 2, { n: 3 }); }
    function w4Part(id, w, h, frame) { return { name: 'SCOPE CREEP', w: w, h: h, hp: 999, xp: 0, tokens: 0, touch: 0, gravity: 0, solid: false, stun: false, always: true, sprite: id,
      update: function (e, dt) { e.vx = 0; e.vy = 0; if (e.data.hurt > 0) e.data.hurt -= dt; e.frame = frame(e); },
      draw: function (e, g) { if (!e.hidden2) w4Draw(e, g, id, e.frame, Math.round((e.w - Q.SPRITE[id].w) / 2), Math.round((e.h - Q.SPRITE[id].h) / 2), false); } }; }

    // the two ticket eyes: shut while it attacks, open when it is high, glowing when it lies low and tired (hit them then)
    var w4EyeDef = w4Part('creep-eye', 16, 12, function (e) { return e.data.hurt > 0 ? 3 : w4B.open ? 2 : w4B.slam ? 0 : 1; });
    function w4Open() { return w4B.open || w4B.phase === 3; }   // in phase 3 (the agents hold it) every part of it can be hit
    function w4P3(n) { return w4B.phase === 3 ? Math.max(1, Math.floor(n * 0.4)) : n; }   // phase 3: smaller blows off the beat (the root ticket on the beat: three times)
    w4EyeDef.hit = function (e, how, n) {
      if (w4Open()) { w4HitBoss(w4P3(n), how, 1); e.data.hurt = 0.25; } else { w4Spark(e); Q.sfx('nope'); }
      return false;
    };
    Q.defEnemy('creep-eye', w4EyeDef);
    // the big eye of tickets (phase 2 on): it fires requests; open and low, it can be hit; a request knocked back into it hurts
    var w4BigDef = w4Part('creep-bigeye', 24, 18, function (e) { return e.data.hurt > 0 ? 2 : w4B.charge > 0 ? 1 : 0; });
    w4BigDef.hit = function (e, how, n) {
      if (w4Open()) { w4HitBoss(w4P3(n), how, 1); e.data.hurt = 0.25; } else { w4Spark(e); Q.sfx('nope'); }
      return false;
    };
    Q.defEnemy('creep-bigeye', w4BigDef);
    // the root ticket, ticket #1 (phase 3): on the beat, three times the blow
    var w4CoreDef = w4Part('creep-core', 18, 12, function (e) { return w4B.onBeat ? 1 : 0; });
    w4CoreDef.hit = function (e, how, n) {
      var beat = w4OnBeat(), cx = e.x + e.w / 2;
      if (w4HitBoss(w4P3(n), how, beat ? 3 : 1)) {
        e.data.hurt = 0.25;
        if (beat) { Q.fx('text', cx, e.y - 10, { text: 'ON THE BEAT! X3', col: '#ffd23f' }); Q.fx('confetti', cx, e.y, { n: 10 }); Q.shake(3, 0.2); w4B.cheer = 0.9; }
        else Q.fx('text', cx, e.y - 10, { text: 'KEEP TIME...', col: '#bcd4f6' });
      }
      return false;
    };
    Q.defEnemy('creep-core', w4CoreDef);

    // a sweeping vine: its tip pokes out of a wall at floor height (0.8 s, the tell), then a length of vine runs along the floor to the far wall. Jump it.
    Q.defEnemy('creep-vine', {
      name: 'VINE', w: 12, h: 10, hp: 1, touch: 0, gravity: 0, solid: false, nohit: true, always: true, sprite: 'creep-tip',
      init: function (e) { var o = e.o; e.data.dir = o.dir || 1; e.data.v = o.v || 170; e.data.len = 56; w4Set(e, 'poke'); Q.fx('text', o.dir > 0 ? 28 : 292, e.y - 10, { text: '!' }); Q.sfx('zap'); },
      update: function (e, dt) {
        var d = e.data; d.t += dt;
        if (e.st === 'poke') { e.touch = 0; e.vx = 0; if (d.t > 0.8) { w4Set(e, 'go'); e.w = d.len; if (d.dir < 0) e.x -= d.len - 12; Q.sfx('fan'); } }
        else { e.touch = 1; e.vx = d.dir * d.v; if ((d.dir > 0 && e.x > 330) || (d.dir < 0 && e.x + e.w < -10)) Q.remove(e); }
        e.frame = Math.floor(e.t * 8) % 2;
      },
      draw: function (e, g) {
        var d = e.data, x = Math.round(e.x - Q.cam.x), y = Math.round(e.y - Q.cam.y), i, wig;
        if (e.st === 'poke') { wig = Math.round(Math.sin(e.t * 30) * 2); Q.spr(g, 'creep-tip', e.frame, d.dir > 0 ? x - 4 + wig : x + wig, y - 2, d.dir < 0); return; }
        for (i = 0; i < e.w - 8; i += 4) {   // the length of vine, with leaves
          g.fillStyle = (i >> 2) & 1 ? '#2e7a3a' : '#4caf4f'; g.fillRect(x + i, y + 3 + Math.round(Math.sin((e.x + i) * 0.2) * 1), 5, 6);
          if (((i >> 2) % 3) === 1) { g.fillStyle = '#93d46a'; g.fillRect(x + i, y + 1, 3, 2); }
        }
        g.fillStyle = '#1d1d24'; g.fillRect(x, y + 9, e.w - 6, 1);
        Q.spr(g, 'creep-tip', e.frame, d.dir > 0 ? x + e.w - 12 : x, y - 2, d.dir < 0);
      }
    });

    // a falling sticky note: it hangs a moment where it will drop (its shadow on the floor shows where), then flutters down. A swing swats it.
    function w4FloorBelow(x, y) { for (var ty = Math.floor(y / 16); ty < 40; ty++) { var c = Q.tile(Math.floor(x / 16), ty); if (Q.solid(x, ty * 16 + 1) || c === '=') return ty * 16; } return 144; }
    Q.defEnemy('creep-note', {
      name: 'NOTE', w: 10, h: 10, hp: 1, touch: 0, gravity: 0, solid: false, always: true, sprite: 'creep-note',
      init: function (e) { w4Set(e, 'hang'); e.data.x0 = e.x; e.data.col = Q.rand() < 0.5 ? 0 : 1; e.data.floor = w4FloorBelow(e.x + 5, e.y + 12); },
      update: function (e, dt) {
        var d = e.data; d.t += dt; e.frame = d.col;
        if (e.st === 'hang') { e.touch = 0; e.vy = 0; e.x = d.x0 + Math.round(Math.sin(d.t * 40)); if (d.t > 0.6) w4Set(e, 'fall'); return; }
        e.touch = 1; e.vy = 115; e.x = d.x0 + Math.sin(d.t * 5) * 6;
        if (w4Shielded(e) || e.y + e.h >= d.floor) { Q.fx('dust', e.x + 5, e.y + e.h, { n: 2 }); Q.remove(e); }
      },
      hit: function (e) { if (e.st === 'fall') { Q.fx('text', e.x + 5, e.y - 4, { text: 'LATER', col: '#ffd23f' }); w4Spark(e); Q.remove(e); } return false; },
      draw: function (e, g) {
        var x = Math.round(e.x - Q.cam.x), y = Math.round(e.y - Q.cam.y);
        if (e.st === 'hang') { g.fillStyle = 'rgba(29,29,36,' + (0.25 + e.data.t * 0.6).toFixed(2) + ')'; g.fillRect(Math.round(e.data.x0 - Q.cam.x) - 1, Math.round(e.data.floor - Q.cam.y) - 2, 12, 2); }
        Q.spr(g, 'creep-note', e.frame, x, y);
      }
    });

    // a request (phase 2 on): flies at him; knocked back by a note or a swing, it flies into the big eye and hurts SCOPE CREEP
    Q.defEnemy('creep-req', {
      name: 'REQUEST', w: 10, h: 8, hp: 1, touch: 1, gravity: 0, solid: false, always: true, sprite: 'creep-req',
      init: function (e) { e.data.back = false; e.data.life = 4; },
      update: function (e, dt) {
        var d = e.data, b = w4B.bigEye; d.life -= dt; e.frame = Math.floor(e.t * 6) % 2;
        if (d.back) {
          if (b && !b.dead && Q.overlap(e, b)) { w4HitBoss(d.n + 2, 'note', 1); Q.fx('text', b.x + b.w / 2, b.y - 6, { text: 'RETURN TO SENDER', col: '#ffd23f' }); Q.fx('hit', e.x, e.y); Q.remove(e); return; }
        } else if (w4Shielded(e)) { Q.fx('spark', e.x + 5, e.y + 4, { n: 4, col: '#bcd4f6' }); Q.remove(e); return; }
        if (d.life <= 0 || e.x < 8 || e.x > 306 || e.y > 150 || e.y < 6) { Q.fx('dust', e.x + 5, e.y + 4, { n: 1 }); Q.remove(e); }
      },
      hit: function (e, how, n) {
        var b = w4B.bigEye, d = e.data, dx, dy, k;
        if (d.back || !b || b.dead) return false;
        dx = b.x + b.w / 2 - (e.x + 5); dy = b.y + b.h / 2 - (e.y + 4); k = Math.sqrt(dx * dx + dy * dy) || 1;
        d.back = true; d.n = n; d.life = 3; e.touch = 0; e.vx = dx / k * 200; e.vy = dy / k * 200; Q.sfx('note'); Q.fx('spark', e.x + 5, e.y + 4, { n: 4 });
        return false;
      }
    });

    // the end: the vines fall away and what is left is one small ticket, NICE TO HAVE, which floats down and stays (harmless: the engine keeps it)
    Q.defEnemy('creep-end', {
      name: 'NICE TO HAVE', w: 22, h: 14, hp: 1, touch: 0, gravity: 0, solid: false, nohit: true, always: true, sprite: 'creep-small',
      init: function (e) { e.data.y1 = 144 - 14; e.data.cx = e.x + 11; e.data.cy = e.y + 7; },
      update: function (e, dt) {
        var d = e.data; e.vx = 0; e.vy = 0;
        if (e.t < 1.1) { if (Math.floor(e.t * 20) % 3 === 0) Q.fx('debris', d.cx + (Q.rand() - 0.5) * 50, d.cy + (Q.rand() - 0.5) * 30, { col: Q.rand() < 0.5 ? '#4caf4f' : '#ffd23f', n: 2 }); }
        else { if (!d.popped) { d.popped = true; Q.fx('confetti', d.cx, d.cy, { n: 24 }); Q.sfx('learn'); } e.y = Math.min(d.y1, e.y + 30 * dt); e.x = d.cx - 11 + Math.round(Math.sin(e.t * 2) * 3); }
      },
      draw: function (e, g) {   // it shakes apart, shrinks to its own small face, then is one small ticket
        var d = e.data, x = Math.round(d.cx - Q.cam.x), y = Math.round(d.cy - Q.cam.y), j = Math.round(Math.sin(e.t * 70) * 2);
        if (e.t < 0.6) { Q.spr(g, 'creep-head', 1, x - 36 + j, y - 28); return; }
        if (e.t < 1.1) { Q.spr(g, 'face-creep', Math.floor(e.t * 8) % 2, x - 8 + j, y - 8); return; }
        Q.spr(g, 'creep-small', 0, Math.round(e.x - Q.cam.x), Math.round(e.y - Q.cam.y));
      }
    });
