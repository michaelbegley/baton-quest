    // ---------- 84-w4-enemies.js: THE BACKLOG's enemies (B9). Each has a tell before it acts, is fair, and a little funny. ----------
    // TICKET hops toward you (it crouches first). NICE TO HAVE wanders and, left alone, shivers and makes one more of itself.
    // MEETING INVITE rings, then pulls you in for a moment (pull lines show it). URGENT (my own) sees you, flashes "!", then charges and gets dizzy.
    function w4Ground(px, py) { return Q.solid(px, py) || Q.tile(Math.floor(px / 16), Math.floor(py / 16)) === '='; }
    function w4Ledge(e, dir) { return !w4Ground(dir > 0 ? e.x + e.w + 3 : e.x - 3, e.y + e.h + 3); }
    function w4Cx(e) { return e.x + e.w / 2; }
    function w4Pop(e, word) { Q.fx('text', w4Cx(e), e.y - 6, { text: word }); }
    function w4Word(id, dflt) { var s = Q.story && Q.story.pop && Q.story.pop[id]; return s ? (s.length !== undefined && typeof s !== 'string' ? s[0] : s) : dflt; }
    function w4Draw(e, g, id, frame, ox, oy, flip) { Q.spr(g, id, frame, Math.round(e.x - Q.cam.x + ox), Math.round(e.y - Q.cam.y + oy), flip); }
    function w4Set(e, st) { e.st = st; e.data.t = 0; }
    function w4HeroDx(e) { var P = Q.P; return P ? P.x + P.w / 2 - w4Cx(e) : 9999; }
    function w4HeroDy(e) { var P = Q.P; return P ? P.y + P.h / 2 - (e.y + e.h / 2) : 9999; }

    Q.defEnemy('ticket', {
      name: 'TICKET', w: 12, h: 10, hp: 3, xp: 3, tokens: 1, touch: 1, sprite: 'ticket', gravity: 900, stomp: true,
      init: function (e) { w4Set(e, 'wait'); e.data.wait = 0.4 + Q.rand() * 0.8; e.face = Q.rand() < 0.5 ? -1 : 1; },
      update: function (e, dt) {
        var d = e.data, dx = w4HeroDx(e), near = Math.abs(dx) < 120 && Math.abs(w4HeroDy(e)) < 64;
        d.t += dt;
        if (e.st === 'wait') {
          if (e.ground) e.vx = Q.approach(e.vx, 0, 600 * dt);
          e.frame = (Math.floor(e.t * 1.3) % 5 === 4) ? 3 : 0;
          if (e.ground && d.t > d.wait) { if (near) e.face = dx < 0 ? -1 : 1; w4Set(e, 'crouch'); }
        } else if (e.st === 'crouch') {   // the tell: a squash before the hop
          e.frame = 1; e.vx = 0;
          if (d.t > 0.3) {
            var far = !near || w4Ledge(e, e.face) || (e.face > 0 ? e.wallR : e.wallL);
            if (far && !near) e.face = -e.face;
            e.vy = near ? -260 : -150; e.vx = far ? 0 : e.face * (near ? 75 : 30);
            w4Set(e, 'air');
          }
        } else if (e.st === 'air') {
          e.frame = 2;
          if (e.ground && d.t > 0.05) { w4Set(e, 'wait'); d.wait = near ? 0.45 : 1.2 + Q.rand(); Q.fx('dust', w4Cx(e), e.y + e.h); }
        }
      },
      die: function (e) { w4Pop(e, w4Word('ticket', 'DONE!')); },
      draw: function (e, g) { w4Draw(e, g, 'ticket', e.frame, -1, -2, e.face < 0); }
    });

    Q.defEnemy('urgent', {
      name: 'URGENT', w: 12, h: 10, hp: 4, xp: 4, tokens: 1, touch: 1, sprite: 'urgent', gravity: 900, stomp: true,
      init: function (e) { w4Set(e, 'walk'); e.face = Q.rand() < 0.5 ? -1 : 1; },
      update: function (e, dt) {
        var d = e.data, dx = w4HeroDx(e); d.t += dt;
        e.touch = e.st === 'daze' ? 0 : 1;
        if (e.st === 'walk') {
          e.frame = Math.floor(e.t * 5) % 2;
          if (e.ground && (w4Ledge(e, e.face) || (e.face > 0 ? e.wallR : e.wallL))) e.face = -e.face;
          e.vx = e.face * 30;
          if (e.ground && dx * e.face > 0 && Math.abs(dx) < 128 && Math.abs(w4HeroDy(e)) < 24 && d.t > 0.6) {
            w4Set(e, 'tell'); Q.fx('text', w4Cx(e), e.y - 8, { text: '!' }); Q.sfx('zap');
          }
        } else if (e.st === 'tell') {   // it saw you: half a second to get out of the way
          e.frame = 2; e.vx = 0;
          if (d.t > 0.5) w4Set(e, 'charge');
        } else if (e.st === 'charge') {
          e.frame = 2; e.vx = e.face * 190;
          if (Math.floor(d.t * 20) % 2) Q.fx('dust', e.face > 0 ? e.x : e.x + e.w, e.y + e.h);
          if (d.t > 1.1 || (e.face > 0 ? e.wallR : e.wallL) || (e.ground && w4Ledge(e, e.face))) { e.vx = 0; w4Set(e, 'daze'); Q.shake(1, 0.1); }
        } else if (e.st === 'daze') {   // dizzy: harmless for a moment
          e.frame = 3; e.vx = 0;
          if (d.t > 1.3) { w4Set(e, 'walk'); e.face = dx < 0 ? -1 : 1; }
        }
      },
      die: function (e) { w4Pop(e, 'DEPRIORITIZED'); },
      draw: function (e, g) {
        w4Draw(e, g, 'urgent', e.frame, -1, -2, e.face < 0);
        if (e.st === 'daze') { var a = e.t * 6, x = Math.round(w4Cx(e) - Q.cam.x), y = Math.round(e.y - Q.cam.y - 5); g.fillStyle = '#ffd23f'; g.fillRect(x + Math.round(Math.cos(a) * 6), y + Math.round(Math.sin(a) * 2), 2, 2); g.fillRect(x - Math.round(Math.cos(a) * 6), y - Math.round(Math.sin(a) * 2), 2, 2); }
      }
    });

    // NICE TO HAVE: tiny sticky notes. Left alone (while you are near enough to see it), one shivers for 0.8 s, then there are two. At most 8 at once.
    function w4NiceCount() { var n = 0; for (var i = 0; i < Q.ents.length; i++) if (Q.ents[i].id === 'nice' && !Q.ents[i].dead) n++; return n; }
    Q.defEnemy('nice', {
      name: 'NICE TO HAVE', w: 8, h: 8, hp: 1, xp: 1, tokens: 0, touch: 1, sprite: 'nice', gravity: 900, stomp: true,
      init: function (e) {
        var o = e.o || {}; w4Set(e, 'walk');
        e.data.col = o.col !== undefined ? o.col : (Q.rand() < 0.5 ? 0 : 3); e.data.gen = o.gen || 0;
        e.data.split = 4 + Q.rand() * 2.5; e.data.hop = 0.8 + Q.rand(); e.face = o.face || (Q.rand() < 0.5 ? -1 : 1);
        if (o.vx) { e.vx = o.vx; e.vy = o.vy || -160; w4Set(e, 'thrown'); }
      },
      update: function (e, dt) {
        var d = e.data, dx = w4HeroDx(e), seen = Math.abs(dx) < 200 && Math.abs(w4HeroDy(e)) < 120;
        d.t += dt;
        if (e.st === 'thrown') { e.frame = d.col + 1; if (e.ground && d.t > 0.1) { e.vx = 0; w4Set(e, 'walk'); } return; }
        if (e.st === 'walk') {
          e.frame = d.col + (Math.floor(e.t * 4) % 4 === 3 ? 1 : 0);
          if (e.ground && (w4Ledge(e, e.face) || (e.face > 0 ? e.wallR : e.wallL))) e.face = -e.face;
          e.vx = e.ground ? e.face * 22 : e.vx;
          d.hop -= dt; if (d.hop <= 0 && e.ground) { e.vy = -130; d.hop = 1 + Q.rand() * 1.5; }
          if (seen && d.gen < 3) d.split -= dt;
          if (d.split <= 0 && e.ground) { if (w4NiceCount() < 8) w4Set(e, 'shiver'); else d.split = 2; }
        } else if (e.st === 'shiver') {   // the tell: it strains, wider, for 0.8 s
          e.frame = d.col + 2; e.vx = 0;
          if (d.t > 0.8) {
            var kid = Q.spawn('nice', e.x, e.y - 2, { col: d.col ? 0 : 3, gen: d.gen + 1, vx: -e.face * 70, vy: -170, face: -e.face });
            if (kid) Q.fx('text', w4Cx(e), e.y - 6, { text: '+1' });
            Q.sfx('spring'); d.gen++; d.split = 5 + Q.rand() * 2; w4Set(e, 'walk');
          }
        }
      },
      die: function (e) { w4Pop(e, w4Word('nice', 'LATER')); },
      draw: function (e, g) { var sh = e.st === 'shiver' ? (Math.floor(e.t * 30) % 2 ? 1 : -1) : 0; w4Draw(e, g, 'nice', e.frame, -1 + sh, -2, e.face < 0); }
    });

    // MEETING INVITE: a calendar page floating in place. It rings (0.7 s, the tell), then pulls you in for 1.6 s, then rests 1.4 s.
    // The pull moves the conductor (through the tiles, so a wall stops it) toward it at 46 px/s: walking away still wins, standing still does not.
    // It pulls only while he stands on the ground: never in the air over a gap (the engine's bot, 2 Nov).
    var W4_PULL = 46, W4_PULL_R = 104;
    function w4Pull(e, dt) {
      var P = Q.P; if (!P || P.dead || P.dashing || !P.ground) return;
      var dx = w4HeroDx(e); if (Math.abs(dx) < 6) return;
      var b = { x: P.x, y: P.y, w: P.w, h: P.h, vx: (dx > 0 ? -1 : 1) * W4_PULL, vy: 0 };
      Q.move(b, dt); P.x = b.x;
    }
    Q.defEnemy('invite', {
      name: 'MEETING INVITE', w: 14, h: 14, hp: 4, xp: 4, tokens: 1, touch: 1, sprite: 'invite', gravity: 0, solid: false, stomp: false,
      init: function (e) { w4Set(e, 'idle'); e.data.y0 = e.y; e.data.ph = Q.rand() * 6; },
      update: function (e, dt) {
        var d = e.data, dx = w4HeroDx(e), dy = w4HeroDy(e), inR = Math.abs(dx) < W4_PULL_R && Math.abs(dy) < 72;
        d.t += dt; e.vx = 0; e.vy = 0;
        e.y = d.y0 + Math.round(Math.sin(e.t * 2 + d.ph) * 3);
        if (Math.abs(dx) > 4) e.face = dx < 0 ? -1 : 1;
        if (e.st === 'idle') { e.frame = 0; if (inR && d.t > 0.3) { w4Set(e, 'ring'); Q.sfx('tick'); Q.fx('text', w4Cx(e), e.y - 8, { text: 'RSVP?', col: '#ff8a8a' }); } }
        else if (e.st === 'ring') { e.frame = 1; if (Math.floor(d.t * 8) !== Math.floor((d.t - dt) * 8)) Q.sfx('tick'); if (d.t > 0.7) { w4Set(e, 'pull'); Q.sfx('fan'); } }
        else if (e.st === 'pull') { e.frame = 2; if (inR) w4Pull(e, dt); if (d.t > 1.6) w4Set(e, 'rest'); }
        else if (e.st === 'rest') { e.frame = 0; if (d.t > 1.4) w4Set(e, 'idle'); }
      },
      die: function (e) { w4Pop(e, w4Word('invite', 'DECLINED')); },
      draw: function (e, g) {
        var sh = e.st === 'ring' ? (Math.floor(e.t * 24) % 2 ? 2 : -2) : 0, P = Q.P, i, k, x0, y0, x1, y1, f;   // a 2-pixel shake: the pull is coming
        if (e.st === 'pull' && P && P.ground && Math.abs(w4HeroDx(e)) < W4_PULL_R) {   // the pull lines: dashes running from him into the page
          x0 = P.x + P.w / 2 - Q.cam.x; y0 = P.y + P.h / 2 - Q.cam.y; x1 = w4Cx(e) - Q.cam.x; y1 = e.y + e.h / 2 - Q.cam.y;
          for (k = -1; k <= 1; k++) for (i = 0; i < 5; i++) {
            f = (i / 5 + e.t * 1.6) % 1;
            g.fillStyle = k ? '#c85d92' : '#e8483f';
            g.fillRect(Math.round(x0 + (x1 - x0) * f), Math.round(y0 + (y1 - y0) * f + k * 5 * (1 - f)), 3, 1);
          }
        }
        w4Draw(e, g, 'invite', e.frame, -1 + sh, -1, false);
      }
    });
