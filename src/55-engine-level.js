    // ---------- 55-engine-level.js (ENGINE): the 'level' scene: loading a level, its fixed steps, signs, memos, save points, the door, the boss arena ----------
    // Draw order: background, tiles, entities, the conductor, particles, a dark level's shade, flashes, then Q.ui.hud and Q.ui.drawTalk on every frame.
    // Play waits while a box is up. Start opens the pause scene (from the level), and the level scene's enter with resume carries on. No hearts: the over scene, with a retry.
    var engBub = { text: '', tx: 0, ty: 0, a: 0, want: false }, engGen = 0, engDoor = null, engDoorOpen = -1, engSignIdx = {}, engArena = null, engDeadGone = false, engQuiet = false, engDarkCv = null, engSignAt = -1;
    function engSay(id, done) { if (id && engOwn(Q.SCRIPT, id) && !engQuiet) Q.say(id, done); else if (done) done(); }
    function engSeed(s) {   // Q.rand for a level: the same numbers each time it starts, for this game's seed (Q.SAVE.seed)
      var h = 2166136261, i; s = String(s) + ':' + ((Q.SAVE && Q.SAVE.seed) || 1);
      for (i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
      return Q.api.rand(h || 1);
    }
    function engSyncSave() { if (Q.P && Q.SAVE) Q.SAVE.hp = Q.P.hp; }

    function engLoadLevel(id, opts) {
      var def = engOwn(Q.LEVEL, id) ? Q.LEVEL[id] : null, s = engSave(), k, lv, w, at, ck, sp, mi = 0, p, d, e, x, y, inEnc = engEncoreIn(id);
      opts = opts || {};
      if (!def) { engWarnOnce('no level ' + id); return false; }
      if (engEnc && !inEnc) engEncoreQuit();   // any other level ends THE ENCORE (59)
      engGen++;
      if (!def.bonus) engStash = null;   // a level he left by a secret door is kept only while he is in its bonus level
      lv = {}; for (k in def) if (engOwn(def, k)) lv[k] = def[k];
      lv.id = id; lv.world = def.world || 0;
      engLoadMap(def, id);
      lv.tw = engTW; lv.th = engTH; lv.data = {};
      Q.level = lv; Q.ents = []; Q.boss = null; engFxClear();
      engArena = null; engDoor = null; engDoorOpen = -1; engHitStop = 0; engNow = 0; engDeadGone = false; engSignAt = -1; engBub.a = 0; engBub.want = false;
      engClockStart(id, opts);   // its seconds of play (58)
      Q.rand = engSeed(id);
      sp = engSpots; w = Q.WORLD[lv.world] || null;
      engSignIdx = {}; for (k = 0; k < sp.signs.length; k++) engSignIdx[sp.signs[k].ty * engTW + sp.signs[k].tx] = k;
      ck = opts.ck && opts.ck.length === 2 ? [opts.ck[0] | 0, opts.ck[1] | 0] : null;
      if (ck && Q.tile(ck[0], ck[1]) !== 'K' && Q.tile(ck[0], ck[1]) !== 'k') ck = null;   // a checkpoint no longer on the map (the level changed): its S
      at = ck ? { tx: ck[0], ty: ck[1] } : sp.start || { tx: 1, ty: Math.max(0, engTH - 3) };
      if (!sp.start) engWarnOnce('level ' + id + ' has no S');
      Q.P = engMakeHero(at.tx * 16 + 3, at.ty * 16 + 16 - Q.HERO.H);
      if (!inEnc) { s.at = id; s.ck = ck; }   // the encore's fights are never where a continue starts
      for (k = 0; k < sp.put.length; k++) {   // the placed things, column by column
        p = sp.put[k]; x = p.tx * 16; y = p.ty * 16;
        if (p.ch === '@') Q.spawn('cat', x + 1, y + 6);
        else if (p.ch === 'o') Q.spawn('pickup', x + 4, y + 4, { kind: 'token' });
        else if (p.ch === 'O') Q.spawn('pickup', x + 2, y + 2, { kind: 'bigtoken' });
        else if (p.ch === 'h') Q.spawn('pickup', x + 4, y + 4, { kind: 'heart' });
        else if (p.ch === 'm') {
          d = (def.memos || [])[mi++];
          if (!d) engWarnOnce('level ' + id + ': more memos on the map than in its memos list');
          if (!(d && s.memos[d])) Q.spawn('pickup', x + 4, y + 3, { kind: 'memo', memo: d || '' });
        } else if (p.enemy) {
          d = engOwn(Q.ENEMY, p.enemy) ? Q.ENEMY[p.enemy] : null;
          Q.spawn(p.enemy, x + 8 - ((d && d.w) || 12) / 2, y + 16 - ((d && d.h) || 12), { tx: p.tx, ty: p.ty });
        }
      }
      if (def.boss) {   // a boss arena: the boss at Z, the trapped agent at R
        d = engOwn(Q.ENEMY, def.boss) ? Q.ENEMY[def.boss] : null;
        p = sp.boss || { tx: engTW - 4, ty: engTH - 3 };
        e = Q.spawn(def.boss, p.tx * 16 + 8 - ((d && d.w) || 32) / 2, p.ty * 16 + 16 - ((d && d.h) || 32));
        Q.boss = e; Q.sfx('roar');
        engArena = { st: 'intro', t: 0, who: def.agent || (w && w.agent) || '', ability: def.ability || (w && w.ability) || '', agent: null, def: d || {} };
        if (engArena.who && sp.agent && !inEnc) engArena.agent = Q.spawn('agent', sp.agent.tx * 16 + 3, sp.agent.ty * 16 + 2, { who: engArena.who });   // no trapped agent in the encore
      }
      engCamSnap();
      Q.music(inEnc ? 'encore' : def.root ? def.music || 'root' : def.music || (def.boss ? (d && d.music) || 'boss' : (w && w.music) || (lv.world ? 'w' + lv.world : null)));   // world 0 (the engine's tests): quiet
      if (def.onEnter) { try { def.onEnter(Q); } catch (er) { engErr('onEnter', 'level ' + id, er); } }
      if (engArena && inEnc) engEncoreArrive();
      else if (engArena) engSay((d && d.intro) || 'w' + lv.world + '-boss', function () { if (engArena && engArena.st === 'intro') engArena.st = 'fight'; });
      else if (def.root) engRootArrive(id, opts);   // THE ROOT FOLDER's rooms (59)
      else if (w && w.levels && w.levels[0] === id && !Q.flag('arrived' + lv.world)) { Q.flag('arrived' + lv.world, true); engSay('w' + lv.world + '-start'); }
      else if (def.bonus && !Q.flag('arrived-' + id)) { Q.flag('arrived-' + id, true); engSay('bonus-' + lv.world); }   // part 13, 26: a bonus level's first arrival
      return true;
    }

    function engCheck(tx, ty, save) {   // a save point (K: checkpoint, hearts refilled, game saved) or a quiet checkpoint (k)
      var s = engSave(), P = Q.P, same = s.at === Q.level.id && s.ck && s.ck[0] === tx && s.ck[1] === ty;
      if (same && (!save || P.hp >= P.maxHp)) return;
      s.at = Q.level.id; s.ck = [tx, ty];
      if (!save) return;
      P.hp = P.maxHp; Q.saveGame(); Q.sfx('save'); Q.fx('spark', tx * 16 + 8, ty * 16 + 4, { n: 8, col: '#ffd23f' }); Q.emit('save');
      if (!same) Q.toast('GAME SAVED', 1.6);
      if (!Q.flag('sawsave')) { Q.flag('sawsave', true); engSay('save'); }
    }
    function engTriggers() {   // what his body touches: a sign (its text shows while he stands there), a save point, a checkpoint, the door
      var P = Q.P, lv = Q.level, tx, ty, t, sign = -1, door = -1, secret = null, up, stx = 0, sty = 0;
      for (ty = Math.floor(P.y / 16); ty <= Math.floor((P.y + P.h - 0.01) / 16); ty++)
        for (tx = Math.floor((P.x - 12) / 16); tx <= Math.floor((P.x + P.w + 11.99) / 16); tx++) {   // a sign counts from 12 px away; the rest only where he stands
          t = engInfoT(tx, ty); if (!t) continue;
          if (t.sign) { if (sign < 0 || Math.abs(tx * 16 + 8 - P.x - P.w / 2) < Math.abs(stx * 16 + 8 - P.x - P.w / 2)) { sign = engSignIdx[ty * engTW + tx]; stx = tx; sty = ty; } continue; }
          if (tx * 16 + 16 <= P.x || tx * 16 >= P.x + P.w) continue;
          if (t.save || t.check) engCheck(tx, ty, !!t.save);
          else if (t.obj === 'door') door = ty * engTW + tx;
          else if (t.secret) secret = { tx: tx, ty: ty };
        }
      engBub.want = sign >= 0 && !!(lv.signs && lv.signs[sign]) && !Q.talking() && !engArenaSafe();   // not over a box, nor after the boss (STORY, 12)
      if (engBub.want) { engBub.text = String(lv.signs[sign]); engBub.tx = stx; engBub.ty = sty; }
      engBub.a = Q.clamp(engBub.a + (engBub.want ? 6 : -6) * Q.DT, 0, 1);   // its words in a bubble above the sign (2 Nov, the boss's idea; it was a toast at the top)
      if (sign !== engSignAt) { engSignAt = sign; if (sign >= 0) Q.emit('sign', { level: lv.id, i: sign }); }   // each time he comes to stand at one
      engDoorOpen = door;
      up = (door >= 0 || (secret && lv.secret && engOwn(Q.LEVEL, lv.secret))) && engTap('up') && P.ground && !P.dead;
      if (up) { engDoor = { t: 0, done: false, secret: door >= 0 ? null : secret }; P.vx = 0; Q.sfx('door'); engClk.stop = true; }   // the exit, or a secret door (57); the clock stops
    }

    function engBossDown(e) {   // a boss is beaten: the field clears, then the outro, the rescue, the ability, the map
      var i, o;
      if (Q.boss === e) Q.boss = null;
      Q.fx('confetti', e.x + e.w / 2, e.y + e.h / 2, { n: 40 }); Q.flash('#ffffff', 0.35); Q.shake(5, 0.5); engHitStop = 0.25;
      if (!engArena || (engArena.st !== 'fight' && engArena.st !== 'intro')) return;
      engClk.stop = true; Q.emit('boss', { id: e.id, t: engClk.t, hits: engClk.hits });   // the arena's clock stops with the fight
      engArena.st = 'down'; engArena.t = 0;
      for (i = 0; i < Q.ents.length; i++) { o = Q.ents[i]; if (!o.dead && o !== engArena.agent && !o.friend && o.touch > 0) { Q.fx('pop', o.x + o.w / 2, o.y + o.h / 2); o.dead = true; } }
      Q.music(null);
      if (Q.P) { Q.P.hurtT = 0; Q.P.frozen = 0; }
    }
    function engArenaSafe() { return !!engArena && engArena.st !== 'fight' && engArena.st !== 'intro'; }
    function engArenaStep(dt) {
      var A = engArena, lv = Q.level, P = Q.P; if (!A) return;
      A.t += dt;
      if (A.st === 'down' && A.t > 1.3 && engEnc) { engEncoreNext(); return; }   // the encore: no outro, no rescue, the next fight (59)
      if (A.st === 'down' && A.t > 1.3) {
        A.st = 'outro';
        engSay(A.def.outro || 'w' + lv.world + '-won', function () {
          var s = engSave();
          if (!engArena || engArena !== A) return;
          A.st = 'rescue'; Q.music('rescue');
          if (P) { P.cheer = true; P.frozen = 30; P.vx = 0; }
          if (A.agent) { A.agent.free = true; A.agent.cheer = true; Q.fx('confetti', A.agent.x + 5, A.agent.y, { n: 30 }); }
          if (A.who && s.saved.indexOf(A.who) < 0) s.saved.push(A.who);
          engSay(A.who ? 'w' + lv.world + '-rescue' : '', function () {
            if (A.ability && engOwn(Q.ABILITY, A.ability)) { Q.learn(A.ability); engSay('learn-' + A.ability, function () { A.st = 'done'; A.t = 0; }); }
            else { A.st = 'done'; A.t = 0; }
          });
        });
      }
      if (A.st === 'done' && A.t > 0.9) { A.st = 'gone'; if (P) P.frozen = 0; Q.levelDone(); }
    }

    function engLevelStep(dt) {
      var P = Q.P, lv = Q.level, gen = engGen, s = engSave();
      if (!lv || !P) return;
      if (Q.talking()) { engFxStep(dt); return; }   // play waits (its presses are the text box's); particles and flashes run out (STORY, 10)
      if (engTap('start') && !P.dead && !engDoor && engOwn(Q.SCENE, 'pause')) { engSyncSave(); Q.go('pause', { from: 'level' }); return; }
      engClockStep(dt); engEncoreStep(dt);   // seconds of play (58, 59): a step with no text box
      if (engHitStop > 0) { engHitStop -= dt; return; }
      if (!Q.watchStep) s.time = (s.time || 0) + dt;   // the play time is 59-engine-watch.js's now (every adventure step); this old count only without it
      if (engDoor) {
        engDoor.t += dt;
        if (engDoor.t > 0.45 && !engDoor.done) { engDoor.done = true; if (!engDoor.secret) Q.levelDone(); else if (!engEnterSecret(engDoor.secret)) { engDoor = null; engClk.stop = false; } }
        return;
      }
      engNow += dt;
      engHeroStep(dt); if (gen !== engGen || Q.scene !== 'level') return;
      engIdleStep(dt, P);
      if (P.dead) {
        engFxStep(dt);
        if (P.deadT > 1.1 && !engDeadGone) {
          engDeadGone = true; engSyncSave();
          var id = lv.id, ck = s.at === lv.id ? s.ck : null, retry = function () { Q.startLevel(id, { ck: ck, retry: true }); };
          Q.emit('over');
          if (engEnc) { engEncoreOver(); return; }   // the encore's own game over (59)
          if (!Q.go('over', { retry: retry })) retry();
        }
        return;
      }
      engEntsStep(dt); if (gen !== engGen || Q.scene !== 'level') return;
      engTriggers(); if (gen !== engGen || Q.scene !== 'level') return;
      if (lv.update) { try { lv.update(dt, Q); } catch (er) { engErr('update', 'level ' + lv.id, er); } if (gen !== engGen || Q.scene !== 'level') return; }
      engArenaStep(dt); if (gen !== engGen || Q.scene !== 'level') return;
      engFxStep(dt);
      engCamStep(dt);
    }
