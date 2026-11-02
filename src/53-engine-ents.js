    // ---------- 53-engine-ents.js (ENGINE): entities: Q.spawn, Q.remove, the loop, touching the conductor, Q.damage, drawing ----------
    // Each step, for an entity near the view (or always: bosses, e.always): def.update (not while stunned), then e.gravity, then Q.move (or straight on
    // when solid is false), then touching the conductor. Far from the view an entity waits (a shot, a note or a dropped token there is removed).
    // def.draw(e, g, Q) and the default draw work in screen pixels: x - Q.cam.x, y - Q.cam.y. Art faces right; e.face -1 draws it facing left.
    var ENG_READY = {}, engErrors = 0;
    var engNoDef = { name: '?', w: 12, h: 12, hp: 1, touch: 0, gravity: 0, nohit: true };
    function engErr(where, id, er) { engErrors++; engWarnOnce('ERROR ' + where + ' of ' + id + ': ' + (er && er.message ? er.message : er)); }
    function engHittable(e) { var d = e.def; return !e.dead && !e.friend && !d.nohit && !(e.platform && !d.hit); }

    Q.spawn = function (id, x, y, opts) {
      var def = engOwn(ENG_READY, id) ? ENG_READY[id] : engOwn(Q.ENEMY, id) ? Q.ENEMY[id] : null;
      if (!def) { engWarnOnce('no enemy ' + id); def = engNoDef; }
      opts = opts || {};
      var e = { id: id, def: def, x: +x || 0, y: +y || 0, w: def.w || 12, h: def.h || 12, vx: +opts.vx || 0, vy: +opts.vy || 0,
        face: opts.face === 1 || opts.face === -1 ? opts.face : def.face === 1 ? 1 : -1, hp: def.hp > 0 ? def.hp : 1, maxHp: 1, t: 0, st: 'idle', stT: 0, _st: 'idle',
        ground: false, wallL: false, wallR: false, ceil: false, dead: false, hurtT: 0, stun: 0, frame: 0,
        gravity: def.gravity !== undefined ? def.gravity : 900, solid: def.solid !== false, touch: def.touch !== undefined ? def.touch : 1,
        platform: !!def.platform, o: opts, data: {}, sprite: def.sprite || id, px: 0, py: 0, hitId: 0, poundId: 0,
        friend: !!def.friend, always: !!(def.always || def.boss), bounce: def.bounce || 0, temp: false };
      if (opts.hp > 0) e.hp = opts.hp;
      e.maxHp = e.hp; e.px = e.x; e.py = e.y;
      Q.ents.push(e);   // in the list before init, so what init spawns comes after it (drawn over it)
      if (def.init) { try { def.init(e, Q); } catch (er) { engErr('init', id, er); } }
      e._st = e.st; e.maxHp = Math.max(e.maxHp, e.hp);
      if (def.boss && !Q.boss) Q.boss = e;
      return e;
    };
    Q.remove = function (e) { if (e) e.dead = true; };

    function engEntsStep(dt) {
      var list = Q.ents, P = Q.P, n = list.length, i, j, e, d, ox, oy;
      var x0 = Q.cam.x - 112, x1 = Q.cam.x + Q.W + 112, y0 = Q.cam.y - 112, y1 = Q.cam.y + Q.H + 112;
      for (i = 0; i < n; i++) {
        e = list[i]; if (e.dead) continue;
        d = e.def;
        if (!e.always && (e.x + e.w < x0 || e.x > x1 || e.y + e.h < y0 || e.y > y1)) { if (e.temp) e.dead = true; continue; }
        e.t += dt;
        if (e.st !== e._st) { e._st = e.st; e.stT = 0; }
        e.stT += dt;
        if (e.hurtT > 0) e.hurtT -= dt;
        ox = e.x; oy = e.y;
        if (e.stun > 0) { e.stun -= dt; e.vx = 0; }
        else if (d.update) { try { d.update(e, dt, Q); } catch (er) { engErr('update', e.id, er); } }
        if (e.dead) continue;
        if (e.st !== e._st) { e._st = e.st; e.stT = 0; }
        if (e.gravity) e.vy = Math.min(e.vy + e.gravity * dt, e.maxFall || 600);
        if (e.solid) Q.move(e, dt); else { e.x += e.vx * dt; e.y += e.vy * dt; }
        e.px = ox; e.py = oy;
        if (e.platform) engCarry(e, ox, oy);
        if (e.y > engTH * 16 + 64 && !e.always) { e.dead = true; continue; }
        if (P && !P.dead && Q.scene === 'level') engTouch(e, P);
      }
      for (i = 0, j = 0; i < list.length; i++) if (!list[i].dead) list[j++] = list[i];
      list.length = j;
      if (P && P.on && P.on.dead) P.on = null;
    }

    function engCarry(e, ox, oy) {   // a platform carries the conductor standing on it, and catches him if it rises through his feet
      var P = Q.P; if (!P || P.dead) return;
      var dx = e.x - ox, dy = e.y - oy, pb;
      if (P.on === e) {   // carried through the tiles: a ceiling or a floor in the way stops him, and the platform goes on without him
        if (dx) engMoveX(P, dx);
        pb = e.y - P.h - P.y; P.ceil = false; P.ground = false;
        if (pb) engMoveY(P, pb);
        if (P.ceil || P.ground) P.on = null; else P.ground = true;
        return;
      }
      if (dy < 0 && !P.drop && P.vy >= 0 && P.x + P.w > e.x && P.x < e.x + e.w) {
        pb = P.y + P.h;
        if (pb >= e.y && pb <= oy + 2) { P.y = e.y - P.h; P.vy = 0; P.ground = true; P.on = e; }
      }
    }

    function engTouch(e, P) {
      var d = e.def;
      if (e.friend) { engFriendHits(e); return; }
      if (!Q.overlap(e, P)) return;
      if (d.got) { d.got(e, P); return; }                       // the engine's own: a pickup, the cat
      if (e.platform) return;
      if (P.pounding && P.poundT <= 0 && engHittable(e)) {       // FIRM HAND falls on it
        if (e.poundId !== P.poundId) { e.poundId = P.poundId; Q.damage(e, P.power, 'pound'); if (!e.dead && !d.boss && d.stun !== false) e.stun = Q.HERO.POUND_STUN; }
        return;
      }
      if ((d.stomp || e.stomp) && P.vy > 0 && P.py + P.h <= e.y + 6 && engHittable(e)) {   // landing on it (even one whose touch is harmless)
        Q.damage(e, P.power, 'stomp');
        var bn = e.spring || d.spring || 0;   // a def or an entity may set spring (px/s) for a bigger spring (14.10 item 5; not bounce, which is Q.move's turn-back, 0 to 1)
        P.y = e.y - P.h; P.vy = bn ? -(Q.api.held('a') ? bn : bn * 0.75) : Q.api.held('a') ? -280 : -200; P.jumping = true; P.airDash = true; P.airHover = true;
        return;
      }
      if (e.stun > 0 || !(e.touch > 0) || P.pounding) return;
      Q.hurt(e.touch, e.x + e.w / 2);
      if (d.shot) Q.remove(e);
    }
    function engFriendHits(e) {   // the conductor's note: the first enemy it touches
      var list = Q.ents, i, o;
      for (i = 0; i < list.length; i++) {
        o = list[i];
        if (o === e || !engHittable(o) || !Q.overlap(e, o)) continue;
        Q.damage(o, e.dmg || 1, 'note'); Q.fx('hit', e.x + e.w / 2, e.y + e.h / 2); Q.remove(e);
        return;
      }
    }
    function engHitBox(b, n, how, id) {   // the swing: every enemy in the box, once per swing
      var list = Q.ents, i, e, hit = 0;
      for (i = 0; i < list.length; i++) {
        e = list[i];
        if (e.hitId === id || !engHittable(e) || !Q.overlap(b, e)) continue;
        e.hitId = id;
        if (Q.damage(e, n, how)) hit++;
      }
      return hit;
    }

    Q.damage = function (e, n, how) {   // def.hit first (false: ignored), then n from hp; at 0: XP, tokens as pickups, def.die, a pop
      if (!e || e.dead || !e.def) return false;
      var d = e.def, r;
      n = n === undefined || n === null ? 1 : +n || 0;
      if (d.hit) { try { r = d.hit(e, how, n, Q); } catch (er) { engErr('hit', e.id, er); } if (r === false) return false; }
      else if (d.nohit) return false;
      if (e.dead) return true;
      e.hp -= n; e.hurtT = 0.2;
      Q.sfx(d.boss ? 'bosshit' : 'hit');
      Q.fx('hit', e.x + e.w / 2, e.y + Math.min(e.h / 2, 10));
      engHitStop = Math.max(engHitStop, d.boss ? 0.07 : 0.045);
      if (e.hp <= 0) engKill(e, how);
      return true;
    };
    function engKill(e, how) {
      var d = e.def, cx = e.x + e.w / 2, cy = e.y + e.h / 2, n = d.tokens | 0, k;
      if (e.dead) return;
      e.dead = true; e.hp = 0;
      if (!engOwn(ENG_READY, e.id)) { engSave().met[e.id] = true; Q.emit('kill', { id: e.id, how: how || '' }); }   // for the bestiary (part 13, 23) and the stars (part 14.1)
      if (d.xp) Q.xp(d.xp);
      for (k = 0; n > 0 && k < 12; k++) {
        var big = n >= 5 && n > 6;
        Q.spawn('pickup', cx - 4, cy - 4, { kind: big ? 'bigtoken' : 'token', vx: (Q.rand() - 0.5) * 120, vy: -140 - Q.rand() * 80 });
        n -= big ? 5 : 1;
      }
      if (d.die) { try { d.die(e, Q); } catch (er) { engErr('die', e.id, er); } }
      Q.fx('pop', cx, cy, { col: d.col });
      Q.sfx(d.boss ? 'bossdie' : 'kill');
      if (d.boss) engBossDown(e);
    }

    function engDrawDefault(g, e) {
      var t = e.face < 0 ? engTwin(e.sprite) : false, s = t || engSheet(e.sprite), x, y, white;
      if (!s) { Q.spr(g, e.sprite, 0, e.x - Q.cam.x, e.y - Q.cam.y); return; }
      x = e.x + (e.w - s.w) / 2 - Q.cam.x; y = e.y + e.h - s.h - Q.cam.y;
      white = e.hurtT > 0 && Math.floor(e.hurtT * 30) % 2 === 0;
      engBlit(g, s, e.frame, x, y, e.face < 0 && !t, white);
    }
    function engDrawTops(g) {   // part 13, 27: def.drawTop(e, g, Q), after the conductor is drawn, in screen pixels
      var list = Q.ents, i, e;
      for (i = 0; i < list.length; i++) { e = list[i]; if (!e.dead && e.def.drawTop) { try { e.def.drawTop(e, g, Q); } catch (er) { engErr('drawTop', e.id, er); } } }
    }
    function engDrawEnts(g) {
      var list = Q.ents, cx = Q.cam.x, cy = Q.cam.y, i, e, a, sx, sy;
      for (i = 0; i < list.length; i++) {
        e = list[i]; if (e.dead || e.hidden) continue;
        if (!e.def.boss && (e.x + e.w < cx - 48 || e.x > cx + Q.W + 48 || e.y + e.h < cy - 64 || e.y > cy + Q.H + 48)) continue;
        if (!e.seen && e.def.nohit && e.x + e.w > cx && e.x < cx + Q.W && e.y + e.h > cy && e.y < cy + Q.H) {   // part 13, 23: a creature that cannot be beaten is met on sight
          e.seen = true; if (!engOwn(ENG_READY, e.id) && engOwn(Q.ENEMY, e.id)) engSave().met[e.id] = true;
        }
        if (e.def.draw) { try { e.def.draw(e, g, Q); } catch (er) { engErr('draw', e.id, er); } }
        else engDrawDefault(g, e);
        if (e.stun > 0) {   // stunned: two small stars go round its head
          a = Q.t * 9; sx = e.x + e.w / 2 - cx; sy = e.y - 5 - cy; g.fillStyle = '#ffd23f';
          g.fillRect(Math.round(sx + Math.cos(a) * 5) - 1, Math.round(sy + Math.sin(a) * 2), 2, 2);
          g.fillRect(Math.round(sx - Math.cos(a) * 5) - 1, Math.round(sy - Math.sin(a) * 2), 2, 2);
        }
      }
    }
