    // ---------- 84-w4-world.js: WORLD 4, THE BACKLOG (B9): the world, its vines, SCOPE CREEP's eyes in the walls ----------
    // The finale: no agent or ability of its own (the conductor has all three by now).
    Q.defWorld(4, { name: 'THE BACKLOG', levels: ['w4-1', 'w4-2', 'w4-3'], boss: 'w4-boss', color: '#9a6ad6', music: 'w4' });

    // ---------- the vines: a bud (G) grows into a vine (V) when he comes near (0.35 s of swelling first); the baton, a note or a pound cuts a vine.
    // A level with regrow: N turns a cut vine back into a bud after N seconds, so it grows again if he lingers. ----------
    var w4V = { spots: [], regrow: 0 };
    function w4Enter(Q) {
      var L = Q.level || {}, i, b = Q.findTiles('G'), v = Q.findTiles('V');
      w4V.spots = []; w4V.regrow = +L.regrow || 0;
      for (i = 0; i < b.length; i++) w4V.spots.push({ tx: b[i].tx, ty: b[i].ty, st: 'bud', t: 0 });
      for (i = 0; i < v.length; i++) w4V.spots.push({ tx: v[i].tx, ty: v[i].ty, st: 'vine', t: 0 });
    }
    function w4Blocked(tx, ty) {   // someone stands in this tile: a vine must not grow into them
      var box = { x: tx * 16 + 1, y: ty * 16 + 1, w: 14, h: 14 }, i, e;
      if (Q.P && Q.overlap(Q.P, box)) return true;
      for (i = 0; i < Q.ents.length; i++) { e = Q.ents[i]; if (!e.dead && e.solid && !e.def.boss && Q.overlap(e, box)) return true; }
      return false;
    }
    function w4Leaves(tx, ty, n) { Q.fx('debris', tx * 16 + 8, ty * 16 + 8, { col: '#4caf4f', n: n || 6 }); }
    function w4Tick(dt, Q) {
      var P = Q.P, i, s, ch, dx, dy, near;
      if (!P) return;
      for (i = 0; i < w4V.spots.length; i++) {
        s = w4V.spots[i]; ch = Q.tile(s.tx, s.ty); s.t += dt;
        dx = P.x + P.w / 2 - (s.tx * 16 + 8); dy = P.y + P.h / 2 - (s.ty * 16 + 8);
        near = Math.abs(dx) < 56 && Math.abs(dy) < 40;
        if (s.st === 'bud') {
          if (ch !== 'G') { s.st = 'gone'; continue; }
          if (near) { s.st = 'grow'; s.t = 0; Q.sfx('spring'); }
        } else if (s.st === 'grow') {
          if (Math.floor(s.t * 20) % 2) Q.fx('dust', s.tx * 16 + 8, s.ty * 16 + 14, { n: 1 });
          if (s.t > 0.35 && !w4Blocked(s.tx, s.ty)) { Q.setTile(s.tx, s.ty, 'V'); s.st = 'vine'; s.t = 0; w4Leaves(s.tx, s.ty, 4); Q.sfx('firm'); }
        } else if (s.st === 'vine') {
          if (ch !== 'V') { s.st = 'cut'; s.t = 0; w4Leaves(s.tx, s.ty, 8); }
        } else if (s.st === 'cut') {
          if (w4V.regrow > 0 && s.t > w4V.regrow && Q.tile(s.tx, s.ty) === ' ' && !w4Blocked(s.tx, s.ty)) { Q.setTile(s.tx, s.ty, 'G'); s.st = 'bud'; s.t = 0; w4Leaves(s.tx, s.ty, 2); }
        }
      }
    }
    Q.w4.enter = w4Enter; Q.w4.tick = w4Tick; Q.w4.vines = w4V;

    // ---------- SCOPE CREEP's eyes, set in the walls of the tower: they follow him, blink now and then, and shut tight when hit ----------
    Q.defEnemy('w4eye', {
      name: 'AN EYE', w: 16, h: 16, hp: 999, xp: 0, tokens: 0, touch: 0, sprite: 'w4-eye', gravity: 0, solid: false, stun: false,
      init: function (e) {   // it takes the place of a wall tile: put the wall back behind it
        var tx = Math.floor((e.x + 8) / 16), ty = Math.floor((e.y + 8) / 16);
        e.x = tx * 16; e.y = ty * 16; Q.setTile(tx, ty, '#'); e.data.blink = 1 + Q.rand() * 4; e.data.shut = 0;
      },
      update: function (e, dt) {
        var d = e.data; e.vx = 0; e.vy = 0;
        d.blink -= dt; if (d.blink < -0.15) d.blink = 2 + Q.rand() * 4;
        if (d.shut > 0) d.shut -= dt;
        e.frame = d.shut > 0 ? 2 : d.blink < 0 ? 1 : 0;
      },
      hit: function (e) { if (e.data.shut <= 0) { e.data.shut = 1.4; Q.fx('text', e.x + 8, e.y - 4, { text: 'NOTED' }); } return false; },
      draw: function (e, g) {
        var x = Math.round(e.x - Q.cam.x), y = Math.round(e.y - Q.cam.y), P = Q.P, px = 0, py = 0;
        Q.spr(g, 'w4-eye', e.frame, x, y);
        if (e.frame === 0 && P) {   // the pupil looks at him
          px = Q.clamp(Math.round((P.x + P.w / 2 - (e.x + 8)) / 40), -2, 2); py = Q.clamp(Math.round((P.y + P.h / 2 - (e.y + 8)) / 60), -1, 1);
          g.fillStyle = '#1d1d24'; g.fillRect(x + 6 + px, y + 6 + py, 4, 4); g.fillStyle = '#ffffff'; g.fillRect(x + 6 + px, y + 6 + py, 1, 1);
        }
      }
    });
