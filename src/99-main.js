    // ---------- 99-main.js (ENGINE): Baton Quest on the 9F computer: NFX.arcade.add, start, the frame (fixed steps), stop, state() and cheat ----------
    // Presses: the runtime's api.pressed is true for one frame. A frame that runs no step (a fast screen) keeps its presses for the next frame that does;
    // Q.api.pressed then gives them for that whole frame (its steps and its draw), so none is lost; the UI's U.press gives each out once a frame.
    var ENG_KEYS = ['left', 'right', 'up', 'down', 'a', 'b', 'start', 'c'], engAcc = 0, engLatch = {}, engRaw = null, engStarted = false;
    function engWrapApi(api) {
      var w = {}, k;
      for (k in api) w[k] = api[k];
      w.pressed = function (n) { return !!engFP[n] && !engTaken[n]; };   // not a press someone has already taken this frame (part 13, 28)
      w.any = function () { for (var i = 0; i < ENG_KEYS.length; i++) if (engFP[ENG_KEYS[i]] && !engTaken[ENG_KEYS[i]]) return true; return false; };
      w.load = engFileLoad; w.save = engFileSave;   // the current one of the three files (59-engine-files.js, 14.10 item 10)
      return w;
    }
    function engStart(api) {
      engRaw = api; Q.api = engWrapApi(api); Q.g = api.g; Q.t = 0; Q.scene = ''; Q.setW(api.W);   // the screen's width: 320, or wider when the page asks the runtime (WIDESCREEN.md)
      engAcc = 0; engLatch = {}; engFP = {}; engTaken = {}; engGod = false; engQuiet = false; engErrors = 0;
      engEnc = null; engRootEnd = false; engStarQ = []; engStarBusy = false; engClockStart('', null);   // version 116's own (a game closed in the encore opens out of it)
      Q.P = null; Q.level = null; Q.ents = []; Q.boss = null; Q.cam.x = 0; Q.cam.y = 0; engArena = null; engMap = null; engInfo = null;
      engFxR = api.rand(97);
      engBuildAll();
      engFB = null; Q.SAVE = engFix(engFileLoad()); Q.rand = engSeed('quest'); engCheatPhysics();   // the current file (a save from before version 116 is FILE 1) and its codes
      if (engStarsCatchUp()) Q.saveGame();   // a save from before version 116: the stars its past earned, quietly (58)
      if (Q.toast === engCore.toast) Q.toast = engToastSet;
      engStarted = true;
    }
    function engStepScene() {
      var sc = engOwn(Q.SCENE, Q.scene) ? Q.SCENE[Q.scene] : null;
      if (sc && sc.update) { try { sc.update(Q.DT, Q); } catch (er) { engErr('update', 'scene ' + Q.scene, er); } }
    }
    function engWidth() {   // the runtime's api.W, read each frame: a page may widen the screen at any time (a window resized); the camera then snaps to the new view
      var w = Math.round(+engRaw.W);
      if (!(w >= 320)) w = 320; if (w > Q.WMAX) w = Q.WMAX;
      if (w === Q.W) return;
      Q.setW(w);
      if (Q.P && Q.level) engCamSnap();
    }
    function engSides(g, id, sc) {   // a column scene on a wider screen: its own painter for the sides (sc.sides, clipped to them), else its edge columns carried out to the screen's edges
      var ox = Q.OX, r = ox + 320, W = Q.W, H = Q.H;
      if (!(W > 320)) return;
      g.save();
      if (typeof sc.sides === 'function') {
        g.beginPath(); g.rect(0, 0, ox, H); g.rect(r, 0, W - r, H); g.clip();
        try { sc.sides(g, Q); } catch (er) { engErr('draw', 'the sides of ' + id, er); }
      } else engEdges(g);
      g.restore();
    }
    function engEdges(g) {   // the column's first and last pixel columns stretched out over the sides (a wall, a sky in bands, a floor carry on as they are)
      var ox = Q.OX, r = ox + 320, W = Q.W, H = Q.H;
      if (!(W > 320)) return;
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.imageSmoothingEnabled = false;
      if (ox > 0) g.drawImage(g.canvas, ox, 0, 1, H, 0, 0, ox, H);
      if (W > r) g.drawImage(g.canvas, r - 1, 0, 1, H, r, 0, W - r, H);
      g.restore();
    }
    Q.edges = engEdges;
    function engDrawScene(g, id) {   // a scene's draw. A wide one (sc.wide: the level, the pause menu, the codex) fills the screen itself; any other is drawn in the centred 320 column (Q.col), then its sides
      var sc = engOwn(Q.SCENE, id) ? Q.SCENE[id] : null;
      if (!sc || !sc.draw) return false;
      if (sc.wide || !(Q.W > 320)) { sc.draw(g, Q); return true; }
      Q.col(g, function () { sc.draw(g, Q); });
      engSides(g, id, sc);
      return true;
    }
    Q.drawScene = engDrawScene;
    function engFrame(dt) {
      var i, n, steps, k, sc;
      engWidth();
      for (i = 0; i < ENG_KEYS.length; i++) { k = ENG_KEYS[i]; if (engRaw.pressed(k)) engLatch[k] = true; }
      engAcc += dt;
      steps = Math.min(4, Math.floor((engAcc + 1e-6) / Q.DT));
      if (steps > 0) { engFP = engLatch; engLatch = {}; } else engFP = {};
      engTaken = {};
      for (n = 0; n < steps; n++) {   // a step that changes the scene or opens or closes a text box ends this frame's presses for everyone (part 13, 28)
        var sc0 = Q.scene, tk0 = !!Q.talking();
        engAcc -= Q.DT; Q.t += Q.DT; if (Q.watchStep) Q.watchStep(sc0); engStepScene();   // the play time first (59-engine-watch.js): a step counts by the scene it starts in
        if (Q.scene !== sc0 || !!Q.talking() !== tk0) engTakeAll();
      }
      if (engAcc > Q.DT || engAcc < 0) engAcc = 0;   // behind by more than four steps: let it go
      if (Q.ui && Q.ui.hostFrame) { try { Q.ui.hostFrame(dt); } catch (er0) { engErr('hostFrame', 'the page bridge', er0); } }   // B20: the page's messages, once a frame (78-ui-host.js; nothing without a page)
      try { Q.audioFrame(dt); } catch (er) { engErr('audioFrame', 'audio', er); }
      sc = engOwn(Q.SCENE, Q.scene) ? Q.SCENE[Q.scene] : null;
      if (sc && sc.draw) { try { engDrawScene(Q.g, Q.scene); } catch (er2) { engErr('draw', 'scene ' + Q.scene, er2); } if (engCheatOn('green')) engGreen(Q.g); }   // GREEN SCREEN over everything
      else { Q.g.fillStyle = '#0b0c10'; Q.g.fillRect(0, 0, Q.W, Q.H); Q.api.text('BATON QUEST', Q.W >> 1, 96, '#ff8a1e', 1, 'center'); }
    }
    function engState() {
      var P = Q.P, s = engSave(), lv = Q.level, n = 0, k;
      for (k in s.stars) if (engOwn(s.stars, k) && s.stars[k]) n++;
      return { screen: Q.scene, world: lv ? lv.world : 0, level: lv ? lv.id : '', hp: P ? P.hp : s.hp, maxHp: P ? P.maxHp : s.maxHp, xp: s.xp, lv: s.lv, tokens: s.tokens,
        power: P ? P.power : s.power, rhythm: P ? P.rhythm : s.rhythmMax, rhythmMax: P ? P.rhythmMax : s.rhythmMax, abilities: s.abilities.slice(), saved: s.saved.slice(),
        memos: Object.keys(s.memos).length, memoIds: Object.keys(s.memos), x: P ? Math.round(P.x * 100) / 100 : 0, y: P ? Math.round(P.y * 100) / 100 : 0,
        vx: P ? Math.round(P.vx * 100) / 100 : 0, vy: P ? Math.round(P.vy * 100) / 100 : 0, ground: P ? P.ground : false, talking: !!Q.talking(),
        boss: Q.boss ? { id: Q.boss.id, hp: Q.boss.hp, maxHp: Q.boss.maxHp } : null,
        face: P ? P.face : 1, frame: P ? P.frame : 0, dashing: P ? P.dashing : false, hovering: P ? P.hovering : false, pounding: P ? P.pounding : false,
        hurtT: P ? Math.max(0, P.hurtT) : 0, frozen: P ? Math.max(0, P.frozen) : 0, dead: P ? P.dead : false, charged: P ? P.charged : false, swing: P ? P.swingT > 0 : false,
        tx: P ? Math.floor((P.x + P.w / 2) / 16) : 0, ty: P ? Math.floor((P.y + P.h - 1) / 16) : 0, cam: { x: Q.cam.x, y: Q.cam.y }, ents: Q.ents.length,
        at: s.at, ck: s.ck, cleared: Object.keys(s.cleared), arena: engArena ? engArena.st : '', time: Math.round(s.time || 0), falls: s.falls, won: s.won,
        god: engGod, errors: engErrors, warns: Q.WARN.length,
        stars: n, encore: !!engEnc, t: Math.round(engClk.t * 100) / 100 };   // part 14.7: gold stars won, THE ENCORE on, this level's seconds of play
    }
    var engIcon = null;   // 'icon-quest' as a small canvas, or false
    function engIconDraw(g, x, y, s) {
      var d, cv, c, w, h, sm;
      if (engIcon === null) {
        engIcon = false; d = engOwn(Q.SPRITE, 'icon-quest') ? Q.SPRITE['icon-quest'] : null;
        if (d) { try { w = Math.max(1, d.w | 0); h = Math.max(1, d.h | 0); cv = g.canvas.ownerDocument.createElement('canvas'); cv.width = w; cv.height = h;
          c = cv.getContext('2d'); c.imageSmoothingEnabled = false; if (d.draw) d.draw(c, 0); else engPaint(c, d, 0, w, h, 'icon-quest'); engIcon = cv; } catch (e) { engIcon = false; } }
      }
      if (!engIcon) return false;
      sm = g.imageSmoothingEnabled; g.imageSmoothingEnabled = false; g.drawImage(engIcon, 0, 0, engIcon.width, engIcon.height, x, y, s, s); g.imageSmoothingEnabled = sm;
      return true;
    }
    var engCheat = {
      warp: function (id) { engSave(); return Q.startLevel(id); },
      boss: function (n) { var w = Q.WORLD[n]; return engCheat.warp((w && w.boss) || 'w' + n + '-boss'); },
      beatBoss: function () { var b = Q.boss; if (!b || b.dead) return false; engKill(b); return true; },
      give: function (ab) {
        var list = !ab || ab === 'all' ? ['dash', 'hover', 'pound'] : [ab], s = engSave(), i;
        for (i = 0; i < list.length; i++) if (s.abilities.indexOf(list[i]) < 0) s.abilities.push(list[i]);
        return s.abilities.slice();
      },
      save: function () { return Q.saveGame(); },
      end: function () { var s = engSave(); s.won = true; Q.saveGame(); return Q.go('end') || Q.go('credits') || Q.go('title'); },
      god: function (on) { engGod = on !== false; return engGod; },
      tokens: function (n) { return Q.tokens(n === undefined ? 100 : n); },
      xp: function (n) { engQuiet = true; Q.xp(n === undefined ? 10 : n); engQuiet = false; return engSave().lv; },
      heal: function () { var s = engSave(); s.hp = s.maxHp; if (Q.P) { Q.P.hp = Q.P.maxHp; Q.P.dead = false; } return true; },
      // the engine's own, for checks: to a tile (feet on its bottom), to a pixel, lose every heart, a fresh save, Q's warnings
      to: function (tx, ty) { var P = Q.P; if (!P) return false; P.x = tx * 16 + 3; P.y = ty * 16 + 16 - P.h; P.vx = 0; P.vy = 0; P.on = null; engCamSnap(); return true; },
      at: function (x, y) { var P = Q.P; if (!P) return false; P.x = x; P.y = y; P.vx = 0; P.vy = 0; P.on = null; engCamSnap(); return true; },
      kill: function () { if (!Q.P) return false; engGod = false; Q.P.hurtT = 0; return Q.hurt(99); },
      fresh: function () { Q.SAVE = engFresh(); Q.rand = engSeed(Q.level ? Q.level.id : 'quest'); return true; },
      seed: function (n) { engSave().seed = (n >>> 0) || 1; Q.rand = engSeed(Q.level ? Q.level.id : 'quest'); return engSave().seed; },
      warnings: function () { return Q.WARN.slice(); },
      // version 116 (part 14.7): a star won (its toast, sound and event), the game won with all four secrets done, THE ENCORE started, THE ROOT FOLDER's first room
      star: function (id) { return engStarWin(id); },
      won: function () { var s = engSave(), k; s.won = true; for (k in Q.LEVEL) if (engOwn(Q.LEVEL, k) && Q.LEVEL[k].bonus && Q.LEVEL[k].world >= 1) s.flags['bonus-' + k] = true; Q.saveGame(); return Q.encoreOpen() && Q.rootOpen(); },
      encore: function () { if (!Q.encoreOpen()) engCheat.won(); return Q.encore(); },
      root: function () { if (!Q.rootOpen()) engCheat.won(); return Q.startLevel('root-1'); },
      mode: function (what, a, b) { return Q.modeCheat ? Q.modeCheat(what, a, b) : null; }   // version 125 (B27): GAME MODES' runs, for checks (97-modes.js)
    };

    NFX.arcade.add({
      id: 'quest', name: 'Baton Quest',
      icon: function (g, x, y, s) {   // ART's 'icon-quest' (built once, here, on the desktop's first call), else the conductor's head drawn here
        if (engIconDraw(g, x, y, s)) return;
        var u = s / 16;
        function r(a, b, w, h, c) { g.fillStyle = c; g.fillRect(x + a * u, y + b * u, w * u, h * u); }
        r(0, 0, 16, 16, '#123b3f'); r(2, 2, 10, 9, '#1d1d24'); r(3, 3, 8, 7, '#f6f3ea'); r(4, 4, 6, 5, '#07080b');
        r(5, 5, 1, 1, '#6dfc9a'); r(6, 6, 1, 1, '#6dfc9a'); r(5, 7, 1, 1, '#6dfc9a'); r(7, 8, 2, 1, '#6dfc9a');
        r(4, 12, 6, 3, '#3b4466'); r(5, 12, 1, 2, '#ffffff'); r(8, 12, 1, 2, '#ffffff'); r(6, 12, 2, 1, '#ffffff');
        r(12, 6, 1, 1, '#ffffff'); r(11, 7, 1, 1, '#ffffff'); r(10, 8, 1, 1, '#5a3a24'); r(13, 4, 1, 1, '#ffd23f'); r(14, 5, 1, 1, '#ff8a1e');
      },
      start: function (api) {
        engStart(api);
        if (engOwn(Q.SCENE, 'title')) Q.go('title'); else Q.startLevel(engFirstLevel());
        return {
          frame: function (dt) { engFrame(dt); },
          stop: function () { if (Q.level && Q.SAVE) Q.saveGame(); if (Q.watchKeep) Q.watchKeep(); try { Q.audioStop(); } catch (er) { engErr('audioStop', 'audio', er); } },   // the clock is kept even when closed off a level
          state: engState,
          cheat: engCheat
        };
      }
    });
