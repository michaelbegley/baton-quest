    // ---------- 57-engine-secret.js (ENGINE): secret doors (QUEST-API part 13, item 26) ----------
    // A D in the map is a secret door (non-solid). Up at it, in a level with a `secret` (a level id): that bonus level starts, and the level he left is kept
    // as it was (its tiles, its entities, his checkpoint there). In a level with bonus: true, its E brings him back to that secret door with all of it
    // as he left it; it clears nothing, sets Q.SAVE.flags['bonus-' + id] = true and plays 'secret'. (Come into a bonus level some other way, a warp or a
    // continue, and its E starts the level whose secret door leads to it, at that door.)
    var engStash = null;
    function engEnterSecret(at) {
      var lv = Q.level, s = engSave(), id = lv && lv.secret, P = Q.P, hp = P ? P.hp : s.maxHp, rh = P ? P.rhythm : s.rhythmMax;
      if (!id || !engOwn(Q.LEVEL, id)) return false;
      engStash = { level: lv, map: engMap, info: engInfo, tw: engTW, th: engTH, world: engWorld, ti: engTI, spots: engSpots, signs: engSignIdx,
                   ents: Q.ents, boss: Q.boss, arena: engArena, at: s.at, ck: s.ck, door: at, rand: Q.rand, clk: engClk };   // its clock waits (58)
      if (!Q.startLevel(id)) { engStash = null; return false; }
      if (Q.P && Q.level && Q.level.id === id) { Q.P.hp = Math.max(1, Math.min(Q.P.maxHp, hp)); Q.P.rhythm = Math.min(Q.P.rhythmMax, rh); }   // his hearts go with him
      return true;
    }
    function engLeaveBonus() {   // Q.levelDone in a bonus level
      var lv = Q.level, s = engSave(), st = engStash, P = Q.P, hp = P ? P.hp : s.maxHp, w, pid = '', k, d;
      s.flags['bonus-' + lv.id] = true;
      if (engOwn(Q.SFX, 'secret')) Q.sfx('secret');
      Q.emit('secret', { id: lv.id });
      if (!st) {
        for (k in Q.LEVEL) if (engOwn(Q.LEVEL, k) && Q.LEVEL[k].secret === lv.id) { pid = k; break; }
        if (!pid || !Q.startLevel(pid)) { Q.saveGame(); return Q.go('map') || Q.go('title'); }
        d = Q.findTiles('D')[0];
        if (d && Q.P) { Q.P.x = d.tx * 16 + 3; Q.P.y = d.ty * 16 + 16 - Q.P.h; Q.P.safeX = Q.P.x; Q.P.safeY = Q.P.y; engCamSnap(); }
        Q.saveGame(); return true;
      }
      engStash = null; engGen++;
      engMap = st.map; engInfo = st.info; engTW = st.tw; engTH = st.th; engWorld = st.world; engTI = st.ti; engSpots = st.spots; engSignIdx = st.signs;
      Q.level = st.level; Q.ents = st.ents; Q.boss = st.boss; engArena = st.arena; Q.rand = st.rand; engClk = st.clk || engClk; engClk.stop = false; engSignAt = -1;
      s.at = st.at; s.ck = st.ck;
      engFxClear(); engDoor = null; engDoorOpen = -1; engHitStop = 0; engDeadGone = false;
      Q.P = engMakeHero(st.door.tx * 16 + 3, st.door.ty * 16 + 16 - Q.HERO.H); Q.P.hp = Math.max(1, Math.min(Q.P.maxHp, hp));
      engCamSnap();
      w = Q.WORLD[Q.level.world] || null;
      Q.music(Q.level.music || (w && w.music) || (Q.level.world ? 'w' + Q.level.world : null));
      Q.toast('SECRET FOUND!', 2.4);
      Q.saveGame();
      return true;
    }
