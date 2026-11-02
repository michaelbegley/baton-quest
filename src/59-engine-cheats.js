    // ---------- 59-engine-cheats.js (ENGINE, the director's, 2 Nov): cheat codes, entered on the pause menu's CODES screen (QUEST-API 14.10 item 11) ----------
    // Eight codes of our own, eight presses each (the arrows, A and B; written in the cheat book in the desk drawer of the office). A one-time code does its
    // thing and is done (EARLY FINISH, PETTY CASH, FULL TOOLKIT); a switch turns on, and the same code again turns it off (EVERY FLOOR, WORK FROM HOME,
    // LIGHT WORKLOAD, TALL ORDER, GREEN SCREEN). Switches are kept in the file's save (Q.SAVE.cheats). While WORK FROM HOME or LIGHT WORKLOAD is on, and in a
    // level finished by EARLY FINISH, no gold star is won and no best time is kept. Q.code tries a list of eight presses, Q.cheatOn says if a switch is on, Q.CHEAT is the list.
    Q.CHEAT = {};
    Q.defCheat = qDef(Q.CHEAT, 'cheat');
    var engCheatLevel = '', engCheatBase = null;
    function engCheatOn(id) { var s = Q.SAVE; return !!(s && s.cheats && s.cheats[id]); }
    function engCheatBlocks() { return engCheatOn('wfh') || engCheatOn('light') || (!!engCheatLevel && !!Q.level && Q.level.id === engCheatLevel); }
    function engCheatPhysics() {   // LIGHT WORKLOAD: the conductor's gravity, from the numbers he started with
      var H = Q.HERO, on = engCheatOn('light');
      if (!engCheatBase) engCheatBase = { GRAV: H.GRAV, GRAV_UP: H.GRAV_UP, FALL: H.FALL };
      H.GRAV = engCheatBase.GRAV * (on ? 0.55 : 1); H.GRAV_UP = engCheatBase.GRAV_UP * (on ? 0.55 : 1); H.FALL = engCheatBase.FALL * (on ? 0.75 : 1);
    }
    function engCheatSay(t) { Q.toast(t, 2.5); }
    Q.cheatOn = function (id) { return engCheatOn(id); };
    Q.code = function (list) {   // eight presses: the cheat they make, done or switched (a toast says which), else { ok: false }
      var want = (list || []).join(' '), id, c, s = engSave(), on;
      for (id in Q.CHEAT) if (engOwn(Q.CHEAT, id) && Q.CHEAT[id].code === want) {
        c = Q.CHEAT[id];
        if (!s.cheats || typeof s.cheats !== 'object') s.cheats = {};
        if (c.once) { on = !!c.go(s, Q); if (on) { Q.saveGame(); engCheatSay(c.done); } else Q.sfx('nope'); return { ok: on, id: id, name: c.name, once: true, said: on ? c.done : c.not }; }
        on = !s.cheats[id]; if (on) s.cheats[id] = true; else delete s.cheats[id];
        if (c.go) c.go(s, Q, on);
        engCheatPhysics(); Q.saveGame(); Q.sfx(on ? 'secret' : 'back');
        return { ok: true, id: id, name: c.name, on: on, said: c.name + (on ? ': ON' : ': OFF') };
      }
      return { ok: false };
    };
    Q.defCheat('floors', { name: 'EVERY FLOOR', code: 'up up right right down down left left', what: 'EVERY WORLD OPEN ON THE MAP' });
    Q.defCheat('finish', { name: 'EARLY FINISH', code: 'right right right right right right right right', once: true, what: 'THIS LEVEL, DONE (NO STAR, NO BEST TIME)',
      done: 'EARLY FINISH. NOBODY SAW A THING.', not: 'NOT HERE. TRY IT IN A LEVEL.',
      go: function () {
        var lv = Q.level;
        if (!lv || lv.root || lv.world < 1 || engEnc || !Q.P || Q.P.dead) return false;
        engCheatLevel = lv.id; Q.go('level', { resume: true });
        if (Q.boss && !Q.boss.dead) engKill(Q.boss, 'cheat'); else Q.levelDone();
        return true;
      } });
    Q.defCheat('cash', { name: 'PETTY CASH', code: 'a a a a b b b b', once: true, what: '250 TOKENS', done: 'PETTY CASH: 250 TOKENS.', not: '',
      go: function () { Q.tokens(250); Q.sfx('token'); return true; } });
    Q.defCheat('toolkit', { name: 'FULL TOOLKIT', code: 'right right a a down b up up', once: true, what: 'QUICK KEYS, PAUSE TO THINK AND FIRM HAND, EARLY',
      done: 'FULL TOOLKIT: ALL THREE MOVES.', not: 'YOU HAVE ALL THREE ALREADY.',
      go: function (s) { var l = ['dash', 'hover', 'pound'], i, n = 0; engQuiet = true; for (i = 0; i < l.length; i++) if (Q.learn(l[i])) n++; engQuiet = false; return n > 0; } });
    Q.defCheat('wfh', { name: 'WORK FROM HOME', code: 'down down down down up up up up', what: 'NOTHING HURTS (NO GOLD STARS WHILE ON)' });
    Q.defCheat('light', { name: 'LIGHT WORKLOAD', code: 'up a up a up a up a', what: 'FLOATY JUMPS (NO GOLD STARS WHILE ON)' });
    Q.defCheat('tall', { name: 'TALL ORDER', code: 'up up up up up up up up', what: 'A TALLER CONDUCTOR' });
    Q.defCheat('green', { name: 'GREEN SCREEN', code: 'down up down up b b b b', what: 'AN OLD GREEN HANDHELD SCREEN' });
    function engGreen(g) {   // GREEN SCREEN: everything in shades of one green, like an old handheld
      g.save(); g.globalCompositeOperation = 'saturation'; g.fillStyle = '#808080'; g.fillRect(0, 0, Q.W, Q.H);
      g.globalCompositeOperation = 'multiply'; g.fillStyle = '#a7c43c'; g.fillRect(0, 0, Q.W, Q.H);
      g.globalCompositeOperation = 'screen'; g.fillStyle = '#0f2a12'; g.fillRect(0, 0, Q.W, Q.H); g.restore();
    }
    var engNewGame0 = Q.newGame;
    Q.newGame = function () { var r = engNewGame0(); engCheatPhysics(); return r; };   // a new game: no switches on, his own gravity
    var engStartLevel0 = Q.startLevel;
    Q.startLevel = function (id, opts) { engCheatLevel = ''; return engStartLevel0(id, opts); };   // EARLY FINISH's no-star mark lasts for its own level only
