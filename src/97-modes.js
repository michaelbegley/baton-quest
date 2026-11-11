    // ---------- 97-modes.js (B27 GAME MODES, 11 Nov): SPEED RUN and HIGH SCORE's engine: their records, the sandbox a run plays in, and its flow ----------
    // A run replays the adventure's own levels as they are, under rules the run sets when it starts and puts back when it ends:
    //  - a save of its own: Q.SAVE is the run's (a new conductor with the LV and moves its route gives, the mode's own seed so every run meets the same
    //    level, every gold star marked so none is won, the player's settings with the stopwatch off); the file's save is put back, untouched, at the end;
    //  - nothing is written while it runs: Q.api.save (so Q.saveGame) and the runtime's own save do nothing until it ends, so the three files and their
    //    play time stay byte for byte as they were (the stopwatch does not run either); only mdStore writes, and only the records;
    //  - no story talk (engQuiet), a coffee mug is a CHECKPOINT (it saves nothing), and the run's own pause (mpause) and game over (the kind's over).
    // The records live in the stored bundle beside the files, as bundle.modes (59-engine-files.js carries them; js/saves.js keeps this browser's on a
    // restore). A run belongs to one opening of the game (MD.raw): closed and opened again, it is gone and its hooks do nothing.
    // The run's clock counts what a level's own clock counts (58-engine-sprint.js), step by step: a level step with no text box while the level's clock
    // runs. So the pause, a text box, a door's fade and a beaten boss's moment stop it; falls, game overs and secret rooms do not. Research and sources:
    // the scratchpad's b27/RESEARCH.md. The kinds (97-modes-speed.js, 97-modes-score.js) give the routes, the scoring, the results and the records' shape.
    var MD = null, MD_KIND = {}, MD_SEED = 125, mdRecB = null, mdRecO = null;
    function mdOn() { return !!MD && !!engRaw && MD.raw === engRaw; }   // a run of this opening of the game
    function mdNum(v) { v = +v; return v > 0 && isFinite(v) ? Math.round(v * 1000) / 1000 : 0; }
    function mdNums(a, n) { var out = [], i; for (i = 0; i < (n === undefined ? (Array.isArray(a) ? Math.min(a.length, 64) : 0) : n); i++) out.push(Array.isArray(a) ? mdNum(a[i]) : 0); return out; }
    function mdName(s) { s = String(s || '').toUpperCase(); return /^[A-Z]{3}$/.test(s) ? s : 'AAA'; }   // three letters, A to Z

    // ---------- the records: { v, speed: { route: { best, split, seg, medal, runs } }, score: { top: [{ n, s, at, clear }], last, runs } } ----------
    function mdRecFix(r) {   // the records made whole: anything odd is dropped, never guessed; a key it does not know is kept as it is
      var out = {}, k, sp, sc, e, i, t;
      if (r && typeof r === 'object' && !Array.isArray(r)) for (k in r) if (engOwn(r, k)) out[k] = r[k];
      out.v = 1; sp = out.speed && typeof out.speed === 'object' && !Array.isArray(out.speed) ? out.speed : {}; out.speed = {};
      for (k in sp) if (engOwn(sp, k) && sp[k] && typeof sp[k] === 'object') {
        e = sp[k]; out.speed[k] = { best: mdNum(e.best), split: mdNums(e.split), seg: mdNums(e.seg), medal: [1, 2, 3].indexOf(e.medal) >= 0 ? e.medal : 0, runs: Math.max(0, e.runs | 0) };   // B29: an odd medal is none (it was clamped, so 9 read as GOLD)
      }
      sc = out.score && typeof out.score === 'object' && !Array.isArray(out.score) ? out.score : {}; t = [];
      if (Array.isArray(sc.top)) for (i = 0; i < sc.top.length && t.length < 5; i++) {
        e = sc.top[i]; if (!e || typeof e !== 'object' || !(e.s >= 0)) continue;
        t.push({ n: mdName(e.n), s: Math.min(9999999, Math.floor(+e.s)), at: String(e.at || '').toUpperCase().slice(0, 8), clear: e.clear ? 1 : 0 });
      }
      t.sort(function (a, b) { return b.s - a.s; });
      out.score = { top: t, last: mdName(sc.last), runs: Math.max(0, sc.runs | 0) };
      return out;
    }
    function mdRec() {   // the records, read once for each start of the game from the bundle; a browser with none has empty ones, stored only once a run is recorded
      var b = engFilesGet();
      if (mdRecB !== b) { mdRecB = b; mdRecO = mdRecFix(b.modes); if (b.modes) b.modes = mdRecO; }
      return mdRecO;
    }
    function mdStore() {   // the records into the stored bundle: read fresh, only its modes set, written with the runtime's own save (the files are not touched)
      var rec = mdRec(), b = engFilesGet(), raw = null, out, save = MD && MD.raw === engRaw ? MD.rawSave0 : engRaw && engRaw.save;
      b.modes = rec;   // the bundle in memory carries them too, so the adventure's next save keeps them
      if (!engRaw || typeof engRaw.load !== 'function' || typeof save !== 'function') return false;
      try { raw = engRaw.load(); } catch (e) { raw = null; }
      if (raw && raw.files3 && raw.files && raw.files.length === 3) out = raw;
      else out = { files3: 1, cur: b.cur, files: [raw && typeof raw === 'object' ? raw : null, null, null] };   // nothing stored yet, or one save from before version 116 (as FILE 1, as it was)
      out.modes = rec;
      try { save.call(engRaw, out); } catch (e2) { return false; }
      return true;
    }

    // ---------- the sandbox ----------
    function mdKitSave(kit, kind) {   // the run's own save: a new conductor at the route's LV (engFix gives the hearts and power that XP earns, as the story does) with its moves
      var s = engFresh(), id, opt = Q.SAVE && Q.SAVE.opt;
      s.seed = MD_SEED; s.lv = 1; s.xp = Q.LV[Q.clamp((kit.lv | 0) - 1, 0, Q.LV.length - 1)] || 0;
      s = engFix(s); s.hp = s.maxHp;
      s.abilities = (kit.moves || []).slice();
      for (id in Q.STAR) if (engOwn(Q.STAR, id)) s.stars[id] = true;   // no gold star is won in a run (its toast would say one was)
      try { s.opt = opt && typeof opt === 'object' ? JSON.parse(JSON.stringify(opt)) : {}; } catch (e) { s.opt = {}; }
      s.opt.watch = 'off'; s.mode = kind;   // the player's settings (text speed, music), with the stopwatch plate off: the run has its own clock
      return s;
    }
    function mdStart(kind, routeId) {   // a new run from its first stage (false: no such kind or route)
      var K = engOwn(MD_KIND, kind) ? MD_KIND[kind] : null, R = K && K.route ? K.route(routeId) : null;
      if (!K || !R || !R.stages || !R.stages.length || !engRaw || !Q.api) return false;
      if (mdOn()) mdEnd(); else MD = null;
      MD = { raw: engRaw, kind: kind, K: K, route: R, i: 0, t: 0, split: [], live: true, at: -1, st: {}, save0: Q.SAVE, apiSave0: Q.api.save, rawSave0: engRaw.save };
      Q.api.save = function () { return true; };   // the files' save does nothing while the run plays (so Q.saveGame, a coffee mug, a closing game save nothing)
      engRaw.save = function () {};   // nor anything straight to the store (the stopwatch's swKeep, a setting): only mdStore writes, the records alone
      Q.SAVE = mdKitSave(R.kit || {}, kind); Q.rand = engSeed('quest'); engCheatPhysics(); engQuiet = true;
      if (Q.ui.cancel) Q.ui.cancel(); if (Q.ui.clearToasts) Q.ui.clearToasts();
      if (K.begin) K.begin(MD);
      if (!mdStage(0)) { mdEnd(); return false; }
      if (K.toast) Q.toast(K.toast(MD), 1.8);   // B29: the kinds name it toast (it was called as go, so it never showed)
      return true;
    }
    function mdStage(i) { MD.i = i; MD.at = -1; return Q.startLevel(MD.route.stages[i]); }
    function mdStageDone() {   // a stage's door, or its boss beaten (after the arena's moment): its split, then the next stage or the end
      var i = MD.i;
      if (!MD.live || MD.at === i) return true;
      MD.at = i; MD.split[i] = MD.t;
      if (MD.K.stage) MD.K.stage(MD, i);
      if (i + 1 < MD.route.stages.length) return mdStage(i + 1);
      return mdFinish('clear');
    }
    function mdFinish(how) {   // the run is over ('clear': every stage done; 'over': its last try spent): the kind's results and records, stored, then out of the sandbox
      var K = MD.K, res;
      MD.live = false;
      res = K.finish ? K.finish(MD, how) || {} : {};
      mdStore(); mdEnd();
      if (!Q.go(K.results, { r: res })) Q.go('modes');
      return true;
    }
    function mdEnd() {   // out of the sandbox: everything the run set is put back, and the file's save is Q.SAVE again, as it was
      var R = MD;
      MD = null;
      if (!R || R.raw !== engRaw) return;   // a run from an earlier opening: the game has started again since, and nothing of it is left
      engLeaveLevel();   // the run's level closes while its own save is still Q.SAVE (its hearts go there, not to the file)
      Q.api.save = R.apiSave0; engRaw.save = R.rawSave0;
      Q.SAVE = R.save0; engQuiet = false; engCheatPhysics(); Q.rand = engSeed('quest');
      if (Q.ui.cancel) Q.ui.cancel(); if (Q.ui.clearToasts) Q.ui.clearToasts();
    }
    function mdOver(opts) {   // the run's game over: the kind says end (HIGH SCORE's last try) or go on: the engine's retry, at the last checkpoint with full hearts
      var retry = opts && typeof opts.retry === 'function' ? opts.retry : null;
      if (MD.K.over && MD.K.over(MD) === 'end') return mdFinish('over');
      if (retry) retry(); else mdStage(MD.i);
      return true;
    }

    // ---------- the hooks: each does what it did before unless a run of this opening is on ----------
    var mdGo0 = Q.go, mdDone0 = Q.levelDone, mdWatch0 = Q.watchStep, mdToast0 = Q.toast, mdStartLevel0 = Q.startLevel;
    Q.go = function (id, opts) {
      if (mdOn() && MD.live && Q.scene === 'level') {
        if (id === 'pause') id = 'mpause';   // the run's own pause (97-modes-hud.js): RESUME, RESTART, QUIT
        else if (id === 'over') return mdOver(opts);
      }
      return mdGo0.call(this, id, opts);
    };
    Q.levelDone = function () {
      var lv = Q.level;
      if (!mdOn()) return mdDone0.apply(this, arguments);
      if (!lv) return false;
      if (lv.bonus) return engLeaveBonus();   // a secret room's E: back to its door, as in the adventure
      return mdStageDone();
    };
    Q.watchStep = function (scene) {   // the engine's step loop: in a run, the run's clock instead of the file's play time
      if (!mdOn()) return mdWatch0 ? mdWatch0.apply(this, arguments) : undefined;
      engQuiet = true;
      if (MD.live && scene === 'level' && Q.level && !Q.talking() && !engClk.stop) MD.t = Math.round((MD.t + Q.DT) * 3600) / 3600;   // whole steps, as the stopwatch keeps them
      if (MD.K.step) MD.K.step(MD, scene);
    };
    Q.toast = function (text, secs) { if (mdOn() && text === 'GAME SAVED') text = 'CHECKPOINT'; return mdToast0.call(this, text, secs); };   // a mug in a run saves nothing
    Q.startLevel = function (id, opts) {
      var r = mdStartLevel0.apply(this, arguments);
      if (r && mdOn() && MD.live && Q.level && Q.level.id === id && MD.K.load) MD.K.load(MD, id, opts || {});
      return r;
    };

    // ---------- for the screens and the kinds ----------
    Q.mode = {
      kind: function (id, def) { MD_KIND[id] = def; return def; },
      start: mdStart, on: mdOn, rec: mdRec, store: mdStore, name: mdName,
      run: function () { return mdOn() ? MD : null; },
      quit: function () { if (mdOn()) mdEnd(); MD = null; return Q.go('modes'); },   // the pause's QUIT: nothing of the run is kept
      restart: function () { var k = mdOn() ? MD.kind : '', r = mdOn() ? MD.route.id : ''; if (!k) return false; mdEnd(); return mdStart(k, r); },
      route: function (kind, id) { var K = engOwn(MD_KIND, kind) ? MD_KIND[kind] : null; return K && K.route ? K.route(id) : null; },
      clockNow: function () { return mdOn() ? MD.t : 0; }
    };
    Q.modeCheat = function (what, a, b) {   // for checks only (99-main.js's cheat 'mode'): a run started, its state, the records, the door, a stage done at once
      var d;
      if (what === 'start') return mdStart(a, b);
      if (what === 'state') return mdOn() ? { on: MD.kind, route: MD.route.id, i: MD.i, n: MD.route.stages.length, stage: MD.route.stages[MD.i], t: MD.t, live: MD.live,
        split: MD.split.slice(), sandbox: Q.SAVE !== MD.save0, st: MD.K.state ? MD.K.state(MD) : null } : { on: '' };
      if (what === 'rec') return JSON.parse(JSON.stringify(mdRec()));
      if (what === 'door') { d = engSpots && engSpots.doors && engSpots.doors[0]; if (!d || !Q.P) return false; return engCheat.to(d.tx, d.ty); }
      if (what === 'stage') return mdOn() ? mdStageDone() : false;
      if (what === 'hit') {   // the nearest enemy that a swing could beat, beaten (Q.damage, as a swing does): for a score check
        var best = null, bd = 1e9, i, e, dd;
        for (i = 0; i < Q.ents.length; i++) {
          e = Q.ents[i]; if (!e || e.dead || !e.def || !Q.P || engOwn(ENG_READY, e.id) || e.def.boss || e.def.nohit || !(e.hp > 0)) continue;
          dd = Math.abs(e.x - Q.P.x) + Math.abs(e.y - Q.P.y); if (dd < bd) { bd = dd; best = e; }
        }
        return best && Q.damage(best, 99, 'cheat') ? best.id : false;
      }
      if (what === 'hurt') { if (!Q.P) return false; Q.P.hurtT = 0; return Q.hurt(a || 1); }   // B29: a heart lost, as an enemy's touch costs one (the combo's reset), for checks
      if (what === 'ui') {   // B29: what the screens show, read only (each screen's own At), for checks
        var u = Q.ui, f = function (fn) { return typeof fn === 'function' ? fn() : null; };
        return { scene: Q.scene, toast: f(u.toastNow), talking: !!Q.talking(), modes: f(BT.modesAt), srun: f(u.srunAt), srec: f(u.srecAt), sres: f(u.sresAt),
          hscore: f(u.hscoreAt), hres: f(u.hresAt), title: f(u.titleAt), files: f(u.filesAt), players: f(BT.playersAt), arena: f(BT.arenaAt), fight: f(BT.fightAt) };
      }
      if (what === 'end') { if (mdOn()) mdEnd(); MD = null; return true; }
      if (what === 'go') return Q.go(a, b || {});
      return null;
    };
