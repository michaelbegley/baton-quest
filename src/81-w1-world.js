    // ---------- 81-w1-world.js: WORLD 1, THE INBOX: the world, its own tiles and how they work, and helpers for its enemies (builder 6) ----------
    // World 1's own tiles: belts of letters ('>' and '<': solid, they carry the conductor), the bins of the sorting floor ('1' IN, '2' OUT, and the
    // big MAYBE bin, two by two: '3' '4' over '5' '6'; all solid), junk-mail blocks ('U', solid), a clear wall ('Q', solid, drawn as nothing),
    // chutes that drop letters ('V', with 'J' its pipe), and decoration (not solid): pigeonholes I, envelope stacks T, lamps L, red flags F,
    // mailboxes B, unread badges N, letter piles Y, a PRIZE banner [ ], a WIN pennant W. Each world 1 level's onEnter and update call
    // Q.w1.enter and Q.w1.update. The art is in 81-w1-art-a.js to 81-w1-art-d.js, the sky in 81-w1-bg.js.
    Q.w1 = Q.w1 || {};
    Q.defWorld(1, { name: 'THE INBOX', levels: ['w1-1', 'w1-2', 'w1-3'], boss: 'w1-boss', agent: 'c1', ability: 'dash', color: '#d93a3a', music: 'w1' });

    Q.defTile(1, '>', { solid: true, art: 'w1-belt-r', frame: 0, fps: 12 });
    Q.defTile(1, '<', { solid: true, art: 'w1-belt-l', frame: 0, fps: 12 });
    Q.defTile(1, '1', { solid: true, art: 'w1-bin', frame: 0 });
    Q.defTile(1, '2', { solid: true, art: 'w1-bin', frame: 1 });
    Q.defTile(1, '3', { solid: true, art: 'w1-maybe', frame: 0 });
    Q.defTile(1, '4', { solid: true, art: 'w1-maybe', frame: 1 });
    Q.defTile(1, '5', { solid: true, art: 'w1-maybe', frame: 2 });
    Q.defTile(1, '6', { solid: true, art: 'w1-maybe', frame: 3 });
    Q.defTile(1, 'U', { solid: true, art: 'w1-junk', frame: 0 });
    Q.defTile(1, 'V', { solid: false, art: 'w1-chute', frame: 0 });
    Q.defTile(1, 'J', { solid: false, art: 'w1-pipe', frame: 0 });
    Q.defTile(1, 'Q', { solid: true, art: 'w1-clear', frame: 0 });   // a wall drawn as nothing: the block the Hydra's mailbox stands in front of
    Q.defTile(1, 'D', { solid: false, art: 'w1-secret', frame: 0, fps: 4 });   // the secret door to THE SPAM FOLDER (QUEST-API.md part 13 item 26)
    Q.defTile(1, 'I', { solid: false, art: 'w1-pigeon', frame: 0 });
    Q.defTile(1, 'T', { solid: false, art: 'w1-stack', frame: 0 });
    Q.defTile(1, 'L', { solid: false, art: 'w1-lamp', frame: 0, fps: 2 });
    Q.defTile(1, 'F', { solid: false, art: 'w1-flagpole', frame: 0, fps: 3 });
    Q.defTile(1, 'B', { solid: false, art: 'w1-mailbox', frame: 0 });
    Q.defTile(1, 'N', { solid: false, art: 'w1-badge', frame: 0, fps: 2 });
    Q.defTile(1, 'Y', { solid: false, art: 'w1-pile', frame: 0 });
    Q.defTile(1, '[', { solid: false, art: 'w1-prize', frame: 0 });
    Q.defTile(1, ']', { solid: false, art: 'w1-prize', frame: 1 });
    Q.defTile(1, 'W', { solid: false, art: 'w1-win', frame: 0, fps: 3 });

    // ---------- the words (LORE.md; STORY's Q.story bank is read first when it is there) ----------
    var W1_POP = { spam: 'MARKED AS SPAM', unsub: 'UNSUBSCRIBED', ooo: 'BACK MONDAY', flag: 'RESOLVED' };
    Q.w1.pop = function (id) {
      var s = Q.story && Q.story.pop && Q.story.pop[id];
      if (s && typeof s === 'object' && s.length) s = s[0];
      return typeof s === 'string' && s ? s : W1_POP[id] || '';
    };
    Q.w1.say = function (e, s, dy) { if (s) Q.fx('text', e.x + e.w / 2, e.y + (dy || -6), { text: s }); };
    Q.w1.pace = function () { return (Q.level && Q.level.pace) || 1; };

    // ---------- drawing an entity: the engine never moves g by the camera (QUEST-API.md part 13 item 10), so draws subtract Q.cam ----------
    var w1Off = { x: 0, y: 0 };
    Q.w1.off = function () { w1Off.x = Q.cam.x; w1Off.y = Q.cam.y; return w1Off; };   // draw at Math.round(world x - off.x), as the engine does
    // a sprite centred on the body with its bottom on the body's bottom, facing e.face (art faces right); blinking while hurt
    Q.w1.draw = function (e, g, id, frame, dx, dy, flip) {
      var s = Q.SPRITE[id], o = Q.w1.off(g), sw = s ? s.w : 8, sh = s ? s.h : 8;
      if (e.hurtT > 0 && Math.floor(Q.t * 24) % 2) return;
      Q.spr(g, id, frame, Math.round(e.x + e.w / 2 - sw / 2 + (dx || 0) - o.x), Math.round(e.y + e.h - sh + (dy || 0) - o.y), flip === undefined ? e.face < 0 : flip);
    };
    // the first solid pixel row at or below y under x (the floor a falling letter breaks on), or the bottom of the level
    Q.w1.floorBelow = function (x, y) {
      var bottom = Q.level ? Q.level.th * 16 : 400;
      for (var yy = Math.max(0, Math.floor(y / 16) * 16); yy < bottom; yy += 16) if (Q.solid(x, yy + 1)) return yy;
      return bottom;
    };
    Q.w1.ahead = function (e, dir) {   // is there floor in front of e and no wall? (walkers and hoppers turn round otherwise)
      var fx = dir > 0 ? e.x + e.w + 2 : e.x - 2;
      if (Q.solid(fx, e.y + 2) || Q.solid(fx, e.y + e.h - 3)) return false;
      return !!Q.solid(fx, e.y + e.h + 4);
    };

    // ---------- the belts: standing on one, he goes along with it (with it: quick; against it: slow) ----------
    var W1_BELT = 48;
    function w1Belts(dt) {
      var P = Q.P; if (!P || !P.ground || P.dashing) return;
      var fy = Math.floor((P.y + P.h + 1) / 16), a = Q.tile(Math.floor((P.x + 1) / 16), fy), b = Q.tile(Math.floor((P.x + P.w - 1) / 16), fy), dir = 0;
      if (a === '>' || b === '>') dir = 1; else if (a === '<' || b === '<') dir = -1;
      if (!dir) return;
      var dx = dir * W1_BELT * dt, ex = dir > 0 ? P.x + P.w + dx : P.x + dx;
      if (Q.solid(ex, P.y + 2) || Q.solid(ex, P.y + P.h - 2)) return;
      P.x += dx;
    }

    // ---------- the chutes of the sorting floor: each drops a letter now and then; it rattles first, and the letter's shadow shows where ----------
    var W1_CHUTE_T = 2.8;
    function w1Chutes(dt) {
      var list = Q.w1.chutes; if (!list || !list.length) return;
      for (var i = 0; i < list.length; i++) {
        var c = list[i], near = c.x > Q.cam.x - 24 && c.x < Q.cam.x + Q.W + 24 && c.y > Q.cam.y - 8 && c.y < Q.cam.y + Q.H + 8;
        c.t -= dt * Q.w1.pace();
        if (c.t < 0.6 && c.t + dt >= 0.6 && near) Q.fx('dust', c.x, c.y);
        if (c.t > 0) continue;
        c.t += W1_CHUTE_T;
        if (near) Q.spawn('w1-mail', c.x - 5, c.y - 2, { vy: 135 });
      }
    }

    Q.w1.enter = function () {
      var list = Q.findTiles('V') || [], i;
      Q.w1.chutes = [];
      for (i = 0; i < list.length; i++) Q.w1.chutes.push({ x: list[i].tx * 16 + 8, y: list[i].ty * 16 + 14, t: 1.2 + (i % 3) * 0.9 });
      Q.w1.kills = 0;
    };
    Q.w1.update = function (dt) {
      w1Belts(dt);
      w1Chutes(dt);
    };
