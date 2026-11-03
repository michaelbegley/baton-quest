    // ---------- 59-engine-watch.js (B19 STOPWATCH, 2 Nov): each file's PLAY TIME, its splits, and the mark a typed cheat code leaves (QUEST-API part 20) ----------
    // Q.SAVE.time is the play time in seconds. Every engine step that starts in one of the adventure's scenes (the intro, a level with its talk and story,
    // the map, the shop, game over, THE ENCORE's results) adds Q.DT, kept to whole steps. Nothing else counts: the pause menu and its screens, the title and
    // every menu on it, the file screen, GAME MODES and BATTLE, the ending and the credits (they come after the clear), and no frames at all.
    // Q.SAVE.watch keeps the rest: split, the play time when each floor's boss first fell (four, 0 until then), clear, the play time when the ending started,
    // code, 1 from the first cheat code typed in this file until a new game, and run, this play-through's own number.
    // The clock alone goes into the stored file every 10 s of play and whenever it stops, a split is taken, a code is typed or the game closes (swKeep):
    // what the last save wrote stays exactly as it was, so a continue still starts at the last coffee mug with what that mug saved, and only the clock
    // has moved on. So at most 10 s of play time is lost when the page dies between two saves, and a continue never sets the clock back.
    Q.BETA = true;   // the game is a beta: the stopwatch shows unless OPTIONS turns it off (at 1.0 set false, and it shows only when OPTIONS turns it on)
    var SW_RUN = { intro: 1, level: 1, map: 1, shop: 1, over: 1, encore: 1 };   // the adventure's scenes: a step that starts in one adds to the play time
    var SW_KEEP = 600;   // counted steps between two writes of the clock alone (10 s of play)
    var SW_TEACH = { tall: 'w1-boss', light: 'w2-boss', wfh: 'w3-boss', cash: 'w4-boss' };   // the codes a boss teaches at its door (75-ui-codex-codes.js)
    var swN = 0, swWas = false;
    function swNum(v) { v = +v; return v > 0 && isFinite(v) ? v : 0; }
    function swRun() { return 1 + Math.floor(Math.random() * 2147483646); }
    function swTyped(s) {   // a file from before the stopwatch whose save shows a typed code: a switch on, a known code no boss teaches, or a boss's code known before that boss fell
      var k;
      if (!s || typeof s !== 'object') return false;
      if (s.cheats && typeof s.cheats === 'object') for (k in s.cheats) if (engOwn(s.cheats, k) && s.cheats[k]) return true;
      if (s.codes && typeof s.codes === 'object') for (k in s.codes) if (engOwn(s.codes, k) && s.codes[k] && !(engOwn(SW_TEACH, k) && s.cleared && s.cleared[SW_TEACH[k]])) return true;
      return false;
    }
    function swRec(s) {   // the file's watch record, made whole. A file from before gets one: no splits known, and the mark when its save shows a typed code
      var w, i;
      s = s || Q.SAVE;
      if (!s || typeof s !== 'object') return null;
      w = s.watch;
      if (!w || typeof w !== 'object' || Array.isArray(w)) w = s.watch = { run: swRun(), split: [0, 0, 0, 0], clear: 0, code: swTyped(s) ? 1 : 0 };
      if (!Array.isArray(w.split) || w.split.length !== 4) w.split = [0, 0, 0, 0];
      for (i = 0; i < 4; i++) w.split[i] = swNum(w.split[i]);
      w.clear = swNum(w.clear); w.code = w.code ? 1 : 0;
      if (!(w.run > 0)) w.run = swRun();
      return w;
    }
    function swInfo(s) {   // what any file shows of its clock, read without changing the file
      var w = s && s.watch && typeof s.watch === 'object' && !Array.isArray(s.watch) ? s.watch : null, sp = w && Array.isArray(w.split) ? w.split : [], out = [], i;
      for (i = 0; i < 4; i++) out.push(swNum(sp[i]));
      return { t: swNum(s && s.time), split: out, clear: w ? swNum(w.clear) : 0, code: w ? !!w.code : swTyped(s) };
    }
    function swKeep() {   // the clock alone into the stored file: what the last save wrote, read back fresh, given this file's time and watch record, written again
      var s = Q.SAVE, w = swRec(), raw, f;
      swN = 0;
      if (!s || !w || !engRaw || typeof engRaw.load !== 'function' || typeof engRaw.save !== 'function') return false;
      try { raw = engRaw.load(); } catch (e) { return false; }
      if (!raw || !raw.files3 || !raw.files || raw.files.length !== 3 || (raw.cur | 0) !== engFilesGet().cur) return false;   // nothing of this file stored yet: its first save writes it all
      f = raw.files[raw.cur | 0];
      if (!f || typeof f !== 'object' || !f.watch || f.watch.run !== w.run || swNum(f.time) > swNum(s.time)) return false;   // another play-through's save (a new game not saved yet): left alone
      f.time = s.time; f.watch = { run: w.run, split: w.split.slice(), clear: w.clear, code: w.code };
      try { engRaw.save(raw); } catch (e2) { return false; }
      return true;
    }
    Q.watchStep = function (scene) {   // the engine's step loop, before each step, with the scene that step starts in
      var s = Q.SAVE;
      if (!s || !engOwn(SW_RUN, scene)) { if (swWas) { swWas = false; swKeep(); } return; }   // the clock has just stopped: keep what it counted (nothing is written in BATTLE)
      if (!s.watch) swRec(s);   // a file from before gets its record on its first step of play, so its next save carries it (and the clock can be kept after that)
      s.time = Math.round((swNum(s.time) + Q.DT) * 3600) / 3600;   // whole steps (k/60 s), so a minute of steps reads a whole minute
      swWas = true; swN++;
      if (swN >= SW_KEEP) swKeep();
    };
    Q.watchKeep = function () { var r = false; if (swWas || swN > 0) r = swKeep(); swWas = false; return r; };   // the game is closing (99-main.js stop): only what was counted since the last write (closed in BATTLE, nothing is written)
    Q.watchRuns = function (scene) { return engOwn(SW_RUN, scene === undefined ? Q.scene : scene); };
    Q.watch = function () {   // for the UI and for checks: the play time, the four splits, CLEARED IN, the codes mark, and whether the clock runs in this scene
      var inf = swInfo(Q.SAVE);
      inf.runs = !!Q.SAVE && engOwn(SW_RUN, Q.scene); inf.keepIn = SW_KEEP - swN;
      return inf;
    };
    Q.watchOf = swInfo;
    Q.on('boss', function () {   // a floor's boss falls: its split, the first time only, never in THE ENCORE
      var lv = Q.level, s = Q.SAVE, w = swRec(), n = lv ? lv.world | 0 : 0;
      if (!w || !lv || !lv.boss || n < 1 || n > 4 || (Q.encoreOn && Q.encoreOn()) || w.split[n - 1] > 0) return;
      w.split[n - 1] = swNum(s.time); swKeep();
    });
    Q.on('end', function () {   // the ending starts (its save was written just before): CLEARED IN, the first time only
      var s = Q.SAVE, w = swRec();
      if (!w || w.clear > 0) return;
      w.clear = swNum(s.time); swKeep();
    });
    var swNewGame0 = Q.newGame;
    Q.newGame = function () {   // a new game: the clock at zero, no splits, no mark, a new play-through
      var r = swNewGame0.apply(this, arguments);
      if (Q.SAVE) { Q.SAVE.time = 0; Q.SAVE.watch = { run: swRun(), split: [0, 0, 0, 0], clear: 0, code: 0 }; }
      swN = 0; swWas = false;
      return r;
    };
    var swCode0 = Q.code;
    Q.code = function (list) {   // a cheat code typed in, done or not, switched on or off: this file's times carry the mark from now on
      var want = (list || []).join(' '), hit = false, w = null, id, r;
      for (id in Q.CHEAT) if (engOwn(Q.CHEAT, id) && Q.CHEAT[id].code === want) hit = true;
      if (hit) { w = swRec(); if (w) w.code = 1; }   // before the code's own save, so that save carries the mark
      r = swCode0.apply(this, arguments);
      if (w) swKeep();
      return r;
    };
    var swFiles0 = Q.files;
    Q.files = function () {   // the file screen's list: each used file also has its codes mark and its CLEARED IN
      var out = swFiles0.apply(this, arguments), b = engFilesGet(), i, inf;
      for (i = 0; i < out.length && i < 3; i++) if (out[i] && !out[i].empty) { inf = swInfo(b.files[i]); out[i].code = inf.code; out[i].clear = inf.clear; }
      return out;
    };
