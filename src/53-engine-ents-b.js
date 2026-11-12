    // ---------- 53-engine-ents-b.js (ENGINE): the ready entities: 'shot', 'pickup', 'cat', 'note' (the conductor's) and 'agent' (trapped in a boss arena) ----------
    ENG_READY.shot = {   // Q.spawn('shot', x, y, { vx, vy, sprite, w, h, touch, life, gravity, solid }): gone at a wall, at the end of its life, or on touching him
      name: 'SHOT', hp: 1, gravity: 0, shot: true,
      init: function (e) {
        var o = e.o; e.w = o.w || 6; e.h = o.h || 6; e.gravity = +o.gravity || 0; e.touch = o.touch !== undefined ? o.touch : 1;
        e.life = o.life > 0 ? o.life : 3; e.sprite = o.sprite || ''; e.solid = o.solid !== false; e.temp = true; e.face = e.vx < 0 ? -1 : 1;
      },
      update: function (e, dt) {
        e.life -= dt; e.frame = Math.floor(e.t * 8);
        if (e.life <= 0 || e.wallL || e.wallR || e.ground || e.ceil) { Q.fx('dust', e.x + e.w / 2, e.y + e.h / 2, { n: 2 }); Q.remove(e); }
      },
      draw: function (e, g) {
        if (e.sprite && engOwn(Q.SPRITE, e.sprite)) { engDrawDefault(g, e); return; }
        var x = Math.round(e.x - Q.cam.x), y = Math.round(e.y - Q.cam.y);
        g.fillStyle = '#1d1d24'; g.fillRect(x, y + 1, e.w, e.h - 2); g.fillRect(x + 1, y, e.w - 2, e.h);
        g.fillStyle = Math.floor(e.t * 10) % 2 ? '#ff8a1e' : '#ffd23f'; g.fillRect(x + 1, y + 1, e.w - 2, e.h - 2);
      }
    };

    var ENG_PICK = { token: { spr: 'token', w: 8, h: 8 }, bigtoken: { spr: 'bigtoken', w: 12, h: 12 }, heart: { spr: 'heart', w: 8, h: 8 }, memo: { spr: 'memo', w: 8, h: 10 } };
    ENG_READY.pickup = {   // a pickup of kind token, bigtoken or heart (and the engine's memo): spawned with a speed it pops out, falls, and goes after 10 s
      name: 'PICKUP', nohit: true, touch: 0, gravity: 0,
      init: function (e) {
        var k = engOwn(ENG_PICK, e.o.kind) ? e.o.kind : 'token', p = ENG_PICK[k];
        e.kind = k; e.w = p.w; e.h = p.h; e.sprite = p.spr; e.touch = 0; e.bob = Q.rand() * 6;
        if (e.o.vx || e.o.vy) { e.gravity = 600; e.bounce = 0.45; e.temp = true; e.life = 10; } else e.gravity = 0;
      },
      update: function (e, dt) {
        if (e.life) { e.life -= dt; if (e.life <= 0) Q.remove(e); if (e.ground) e.vx = Q.approach(e.vx, 0, 240 * dt); }
        e.frame = Math.floor(e.t * 8 + e.bob);
      },
      got: function (e, P) {
        var s = engSave(), cx = e.x + e.w / 2, cy = e.y + e.h / 2, m;
        if (e.life && e.t < 0.3) return;
        if (e.kind === 'heart') { if (P.hp >= P.maxHp) return; P.hp++; Q.sfx('heart'); Q.fx('text', cx, cy - 6, { text: '~', col: '#ff6b8a' }); Q.emit('pickup', { kind: 'heart', n: 0 }); }
        else if (e.kind === 'memo') {
          if (e.o.memo) s.memos[e.o.memo] = true;
          m = e.o.memo && Q.MEMO[e.o.memo];
          Q.sfx(e.o.memo && /b$/.test(e.o.memo) && engOwn(Q.SFX, 'secret') ? 'secret' : 'memo'); Q.toast('MEMO FOUND' + (m && m.title ? ': ' + m.title : ''), 2.6);
          Q.emit('memo', { id: e.o.memo || '' });
        } else { Q.tokens(e.kind === 'bigtoken' ? 5 : 1); Q.sfx('token'); if (e.kind === 'bigtoken') Q.fx('text', cx, cy - 6, { text: '+5', col: '#ffd23f' }); Q.emit('pickup', { kind: e.kind, n: e.kind === 'bigtoken' ? 5 : 1 }); }
        Q.fx('spark', cx, cy, { n: e.kind === 'token' ? 3 : 6 });
        Q.remove(e);
      },
      draw: function (e, g) {
        if (e.life && e.life < 2 && Math.floor(e.life * 10) % 2) return;   // about to go: blinking
        var s = engSheet(e.sprite), dy = e.gravity ? 0 : Math.round(Math.sin(Q.t * 3 + e.bob) * 1.5);
        if (!s) { Q.spr(g, e.sprite, 0, e.x - Q.cam.x, e.y - Q.cam.y + dy); return; }
        engBlit(g, s, e.frame, e.x + (e.w - s.w) / 2 - Q.cam.x, e.y + e.h - s.h - Q.cam.y + dy, false, false);
      }
    };

    ENG_READY.cat = {   // the office cat: touching it plays cat-N, gives a big token and sets the flag catN (once)
      name: 'THE CAT', w: 14, h: 10, nohit: true, touch: 0,
      init: function (e) { e.found = !!Q.flag('cat' + engWorld); e.home = e.x; e.face = -1; e.sprite = 'cat'; },
      update: function (e) {
        if (e.st === 'idle' && e.stT > 3.5) { e.st = 'walk'; e.face = e.x > e.home ? -1 : 1; }
        if (e.st === 'walk') { e.vx = e.face * 16; if (e.stT > 0.8 || e.wallL || e.wallR) e.st = 'idle'; } else e.vx = 0;
        e.frame = e.st === 'walk' ? 2 + Math.floor(e.t * 6) % 2 : (e.t % 3.2 < 0.16 ? 1 : 0);   // a quick blink every 3.2 s (2 Nov: a blink half the time read as a flicker)
      },
      got: function (e) {
        if (e.found) return;
        var id = 'cat-' + engWorld, n = 0, k;
        e.found = true; Q.flag('cat' + engWorld, true);
        for (k = 1; k <= 4; k++) if (Q.flag('cat' + k)) n++;
        Q.emit('cat', { n: n });   // n: how many of the four cats he has found
        Q.spawn('pickup', e.x + 1, e.y - 12, { kind: 'bigtoken', vy: -150 });
        Q.fx('confetti', e.x + e.w / 2, e.y); Q.sfx('meow'); if (engOwn(Q.SFX, 'secret')) Q.sfx('secret');
        if (Q.SCRIPT[id]) Q.sayStory(id); else Q.toast('MRRP.', 2);   // version 127: story talk, quiet in a HIGH SCORE or SPEED RUN run (55's Q.sayStory)
        Q.saveGame();
      }
    };

    ENG_READY.note = {   // the conductor's note: straight ahead at NOTE_V for NOTE_T; the first enemy it touches takes his power; it breaks a crate
      name: 'NOTE', w: 8, h: 8, friend: true, nohit: true, touch: 0, gravity: 0,
      init: function (e) { e.dmg = e.o.dmg || 1; e.life = e.o.life || Q.HERO.NOTE_T; e.face = e.vx < 0 ? -1 : 1; e.temp = true; e.sprite = 'note'; },
      update: function (e, dt) {
        e.life -= dt; e.frame = Math.floor(e.t * 10);
        if (e.wallL || e.wallR) engBreakTile(Math.floor((e.face > 0 ? e.x + e.w + 1 : e.x - 1) / 16), Math.floor((e.y + e.h / 2) / 16), 'note');
        if (e.life <= 0 || e.wallL || e.wallR) { Q.fx('spark', e.x + e.w / 2, e.y + e.h / 2, { n: 3 }); Q.remove(e); }
      }
    };

    ENG_READY.agent = {   // C1, C2 or C3 in a boss arena: in sticky notes (frames 4 and 5) until freed, then cheering (2 and 3), then idle (0 and 1)
      name: 'AGENT', w: 10, h: 14, nohit: true, touch: 0,
      init: function (e) { e.sprite = e.o.who || 'c1'; e.face = -1; e.frame = 4; },   // in its sticky notes from the first picture (ART's review)
      update: function (e) { e.frame = !e.free ? 4 + Math.floor(e.t * 2) % 2 : e.cheer ? 2 + Math.floor(e.t * 4) % 2 : Math.floor(e.t * 1.6) % 2; }
    };
