    // ---------- 56-engine-flow.js (ENGINE): the save, XP and LV, tokens, flags, abilities, and the flow: Q.go, levels, worlds, the map ----------
    // Q.SAVE is the live record (QUEST-API part 13, item 5): set at start from api.load() or fresh, changed by Q.xp, Q.tokens, Q.flag, Q.learn and the
    // engine, written by Q.saveGame(). The conductor's hearts, power and rhythm live on Q.P in a level and come from Q.SAVE when one starts.
    var ENG_LEAVE = { title: 1, map: 1, intro: 1, end: 1, credits: 1, shop: 1, encore: 1 };   // scenes that close the level (pause, codex and over keep it)
    function engFresh() {
      return { v: 1, cleared: {}, at: '', ck: null, hp: Q.HERO.HEARTS, maxHp: Q.HERO.HEARTS, power: 1, rhythmMax: Q.HERO.RHYTHM, lv: 1, xp: 0, tokens: 0,
               abilities: [], saved: [], memos: {}, flags: {}, shop: {}, met: {}, seed: 1, time: 0, falls: 0, won: false,   // met: every kind of enemy beaten (part 13, 23)
               stats: {}, stars: {}, best: {}, encore: 0, cheats: {} };   // part 14: counts, gold stars, best seconds by level, THE ENCORE's best (0: none yet); the codes switched on (14.10 item 11)
    }
    function engFix(s) {   // a loaded save, made whole (a missing or odd field takes its fresh value)
      var f = engFresh(), k;
      if (!s || typeof s !== 'object' || s.v !== 1) return f;
      for (k in f) if (engOwn(f, k)) {
        if (!engOwn(s, k)) s[k] = f[k];
        else if (Array.isArray(f[k]) && !Array.isArray(s[k])) s[k] = f[k];
        else if (f[k] !== null && typeof f[k] !== typeof s[k]) s[k] = f[k];
        else if (f[k] !== null && typeof f[k] === 'object' && (!s[k] || Array.isArray(s[k]) !== Array.isArray(f[k]))) s[k] = f[k];
      }
      if (s.ck !== null && !(Array.isArray(s.ck) && s.ck.length === 2)) s.ck = null;
      s.maxHp = Q.clamp(s.maxHp | 0, 1, Q.HERO.HEARTS_MAX); s.hp = Q.clamp(s.hp | 0, 1, s.maxHp); s.lv = Q.clamp(s.lv | 0, 1, Q.LV.length);
      s.power = Math.max(1, s.power | 0); s.rhythmMax = Math.max(1, s.rhythmMax | 0); s.tokens = Math.max(0, s.tokens | 0); s.xp = Math.max(0, s.xp | 0);
      while (s.lv < Q.LV.length && s.xp >= Q.LV[s.lv]) {   // part 13, 24: Q.LV may change; an LV the XP now earns is given with its gains (none taken away)
        s.lv++; if (Q.LV_HEART[s.lv]) s.maxHp = Math.min(Q.HERO.HEARTS_MAX, s.maxHp + Q.LV_HEART[s.lv]); if (Q.LV_POWER[s.lv]) s.power += Q.LV_POWER[s.lv];
      }
      return s;
    }
    function engSave() { return Q.SAVE || (Q.SAVE = engFresh()); }

    Q.xp = function (n) {   // XP, and each LV up: a fanfare, a heart at LV 2, 4, 7 and 10, a point of baton power at LV 3, 6 and 9
      var s = engSave(), P = Q.P, up = 0, what = '';
      n = +n || 0;
      if (!n) return s.xp;
      s.xp = Math.max(0, s.xp + n);
      while (s.lv < Q.LV.length && s.xp >= Q.LV[s.lv]) {
        s.lv++; up++; Q.emit('lvup', { lv: s.lv });
        if (Q.LV_HEART[s.lv] && s.maxHp < Q.HERO.HEARTS_MAX) { s.maxHp = Math.min(Q.HERO.HEARTS_MAX, s.maxHp + Q.LV_HEART[s.lv]); what = ': ONE MORE HEART'; if (P) { P.maxHp = s.maxHp; P.hp = Math.min(P.maxHp, P.hp + 1); } }
        if (Q.LV_POWER[s.lv]) { s.power += Q.LV_POWER[s.lv]; what = ': BATON POWER +' + Q.LV_POWER[s.lv]; if (P) P.power = s.power; }
      }
      if (up) {   // part 13, item 12: an LV up never stops play (a toast, the sound, a sparkle, his cheer frame)
        Q.sfx('lvup');
        if (P && Q.scene === 'level') {
          Q.fx('text', P.x + P.w / 2, P.y - 10, { text: 'LV ' + s.lv + '!', col: '#ffd23f', life: 1.4 });
          if (what) Q.fx('text', P.x + P.w / 2, P.y - 1, { text: what.slice(2), col: '#f6efe2', life: 1.4 });
          Q.fx('spark', P.x + P.w / 2, P.y + 2, { n: 10, col: '#ffd23f' }); Q.fx('spark', P.x + P.w / 2, P.y + 2, { n: 6, col: '#ffffff' });
          P.cheerT = 0.5;
        }
        if (!engQuiet) Q.toast((engOwn(Q.SCRIPT, 'lvup') && Q.SCRIPT.lvup[0] && Q.SCRIPT.lvup[0].text) || 'LV UP! LV ' + s.lv, 3);
      }
      return s.xp;
    };
    Q.tokens = function (n) { var s = engSave(); s.tokens = Math.max(0, s.tokens + (+n || 0)); return s.tokens; };
    Q.flag = function (name, value) { var s = engSave(); if (value === undefined) return s.flags[name]; s.flags[name] = value; return value; };
    Q.has = function (ab) { return engSave().abilities.indexOf(ab) >= 0; };
    Q.learn = function (ab) {   // an ability: kept in the save, a sound and a toast ("LEARNED QUICK KEYS")
      var s = engSave();
      if (!ab || s.abilities.indexOf(ab) >= 0) return false;
      s.abilities.push(ab); Q.emit('learn', { ability: ab });
      Q.sfx('learn'); if (!engQuiet) Q.toast('LEARNED ' + (Q.ABILITY[ab] ? Q.ABILITY[ab].name : String(ab).toUpperCase()), 3);
      return true;
    };
    Q.cleared = function (id) { return !!engSave().cleared[id]; };
    Q.unlocked = function (n) {   // world 1 always; world n once world n-1's boss is beaten (or any level of world n is cleared)
      var w = Q.WORLD[n - 1], i, me = Q.WORLD[n];
      if (n <= 1 || engCheatOn('floors')) return true;   // EVERY FLOOR (59-engine-cheats.js)
      if (Q.cleared((w && w.boss) || 'w' + (n - 1) + '-boss')) return true;
      if (me && me.levels) for (i = 0; i < me.levels.length; i++) if (Q.cleared(me.levels[i])) return true;
      return false;
    };
    Q.saveGame = function () { var s = engSave(); engSyncSave(); try { Q.api.save(s); } catch (e) { return false; } return true; };

    Q.go = function (id, opts) {   // to a scene: the old one's leave, then the new one's enter(opts)
      var sc = engOwn(Q.SCENE, id) ? Q.SCENE[id] : null, old = engOwn(Q.SCENE, Q.scene) ? Q.SCENE[Q.scene] : null;
      if (!sc) { engWarnOnce('no scene ' + id); return false; }
      if (old && old.leave) { try { old.leave(Q); } catch (er) { engErr('leave', 'scene ' + Q.scene, er); } }
      if (ENG_LEAVE[id]) engLeaveLevel();
      Q.scene = id;
      if (sc.enter) { try { sc.enter(opts || {}, Q); } catch (er2) { engErr('enter', 'scene ' + id, er2); } }
      return true;
    };
    function engLeaveLevel() { if (engEnc) engEncoreQuit(); engSyncSave(); engStash = null; Q.P = null; Q.level = null; Q.ents = []; Q.boss = null; engArena = null; engDoor = null; engMap = null; engInfo = null; engSpots = null; }
    function engFirstLevel() {   // world 1's first level, else any real level, else the engine's own test level
      var w = Q.WORLD[1], id;
      if (w && w.levels && engOwn(Q.LEVEL, w.levels[0])) return w.levels[0];
      if (engOwn(Q.LEVEL, 'w1-1')) return 'w1-1';
      for (id in Q.LEVEL) if (engOwn(Q.LEVEL, id) && id.indexOf('eng-') !== 0) return id;
      return engOwn(Q.LEVEL, 'eng-test') ? 'eng-test' : '';
    }

    Q.newGame = function () { Q.SAVE = engFresh(); Q.SAVE.seed = 1 + Math.floor(Math.random() * 2147483646); Q.rand = engSeed('quest'); return true; };   // its own seed, kept in the save   // part 13, item 3: a fresh save; the UI goes on to the intro
    Q.continueGame = function () {   // into the level of the last save point, else the map, else the first level not cleared
      var s = engSave(), w, i, n;
      if (s.at && s.at !== 'map' && engOwn(Q.LEVEL, s.at)) return Q.startLevel(s.at, { ck: s.ck });
      if (engOwn(Q.SCENE, 'map')) return Q.go('map');
      for (n = 1; n <= 4; n++) { w = Q.WORLD[n]; if (w && w.levels) for (i = 0; i < w.levels.length; i++) if (!Q.cleared(w.levels[i]) && engOwn(Q.LEVEL, w.levels[i])) return Q.startLevel(w.levels[i]); }
      return Q.startLevel(engFirstLevel());
    };
    Q.startWorld = function (n) { var w = Q.WORLD[n]; return Q.startLevel(w && w.levels && w.levels[0] ? w.levels[0] : 'w' + n + '-1'); };
    Q.startLevel = function (id, opts) {
      if (!engOwn(Q.LEVEL, id)) { engWarnOnce('no level ' + id); return false; }
      engSave();
      return Q.go('level', { level: id, ck: opts && opts.ck ? opts.ck : null, retry: !!(opts && opts.retry) });
    };
    Q.levelDone = function () {   // the door, or a beaten boss: the next level, the boss arena after a world's last level, the map after the boss
      var lv = Q.level, s = engSave(), w, next = '', i, wn;
      if (!lv) return false;
      if (engEnc && lv.boss) return engEncoreNext();   // a boss of THE ENCORE (59)
      if (lv.root) return engRootNext();   // a room of THE ROOT FOLDER: on to its next, clearing nothing (59)
      if (lv.bonus) return engLeaveBonus();   // a bonus level's E: back to its secret door, clearing nothing (57)
      s.cleared[lv.id] = true; s.ck = null; engSyncSave();
      Q.emit('level', { id: lv.id, t: engClk.t, hits: engClk.hits, falls: engClk.falls });   // part 14.1: at its door (an arena: when its rescue is done, timed until its boss was beaten)
      if (!lv.boss && engOwn(Q.SFX, 'clear')) Q.sfx('clear');   // in at a door
      w = Q.WORLD[lv.world] || null; wn = lv.world;
      if (lv.next) next = lv.next;
      else if (w && w.levels && !lv.boss) {
        i = w.levels.indexOf(lv.id);
        if (i >= 0 && i < w.levels.length - 1) next = w.levels[i + 1];
        else if (i === w.levels.length - 1 && w.boss) next = w.boss;
      }
      if (next && engOwn(Q.LEVEL, next)) { s.at = next; Q.saveGame(); return Q.startLevel(next); }
      if (lv.boss || (w && w.boss === lv.id)) {   // a world is done
        if (wn >= 4 && s.won) { s.at = 'map'; Q.saveGame(); if (Q.go('map')) { Q.toast('THE BACKLOG STAYS TRIMMED', 3); return true; } return Q.go('title'); }   // beaten again: the map (the director, 02:30)
        if (wn >= 4) { s.won = true; s.at = 'map'; Q.saveGame(); Q.api.jot('THE BACKLOG IS TRIMMED: THE END'); Q.emit('end'); return Q.go('end') || Q.go('credits') || Q.go('title') || Q.startLevel(engFirstLevel()); }
        s.at = 'map'; Q.saveGame(); Q.api.jot('CLEARED ' + (w && w.name ? w.name : 'WORLD ' + wn));
        return Q.go('map') || Q.startWorld(wn + 1) || Q.go('title');
      }
      s.at = 'map'; Q.saveGame();
      return Q.go('map') || Q.go('title') || Q.startLevel(lv.id);
    };
