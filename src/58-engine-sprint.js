    // ---------- 58-engine-sprint.js (ENGINE): SPRINT REVIEW (QUEST-API part 14.3): each level's clock (seconds of play), Q.SAVE.best and Q.PAR ----------
    // Seconds of play: steps of the level scene with no text box open (the pause is another scene). A level's clock starts when it loads and keeps on
    // through a game over's retry; it stops at the door and when its boss is beaten. hits: hearts lost there (hurts and falls); falls: falls there.
    var engClk = { id: '', t: 0, hits: 0, falls: 0, stop: false }, engIdle = { t: 0, done: false };
    function engClockStart(id, opts) {   // a level loads: a new clock, unless it is the same level again after a game over
      if (!(opts && opts.retry && engClk.id === id)) engClk = { id: id, t: 0, hits: 0, falls: 0, stop: false };
      engClk.stop = false; engIdle = { t: 0, done: false };
    }
    function engClockStep(dt) { if (!engClk.stop) engClk.t += dt; }
    function engIdleStep(dt, P) {   // 'idle', once a level: 60 s of play standing still with no button held
      var i, held = false;
      if (engIdle.done || !P || P.dead) return;
      for (i = 0; i < ENG_KEYS.length && !held; i++) if (Q.api.held(ENG_KEYS[i])) held = true;
      if (held || !P.ground || Math.abs(P.vx) > 1) { engIdle.t = 0; return; }
      engIdle.t += dt;
      if (engIdle.t >= 60) { engIdle.done = true; Q.emit('idle'); }
    }
    Q.on('hurt', function (d) { engClk.hits += d.n | 0; });
    Q.on('fall', function (d) { engClk.falls++; engClk.hits += d.n | 0; });
    Q.on('level', function (d) {   // Q.SAVE.best: each level's lowest seconds of play (kept before the stars hear the same event, so par-all sees it)
      var b = engSave().best, t = Math.round((+d.t || 0) * 100) / 100;
      if (engCheatBlocks()) return;   // no best time with a cheat that changes the play (14.10 item 11)
      if (d.id && t > 0 && !(b[d.id] > 0 && b[d.id] <= t)) b[d.id] = t;
    });
    // Q.PAR (part 14.3): the 12 levels and the 4 boss fights (a fight timed until its boss is beaten): the playtest bot's seconds of play times 1.5, up to
    // the next 5 s (the bot's time follows each)
    Q.PAR['w1-1'] = 45;     // 29.2 s: replayed with tonight's bot in node (the same game and bot, no browser: tests/b1_node_play.js)
    Q.PAR['w1-2'] = 45;     // 30.0 s: replayed in node after its first four belts were turned to push back (2 Nov; was 26.6 s, par 40)
    Q.PAR['w1-3'] = 50;     // 33.0 s: replayed in node
    Q.PAR['w1-boss'] = 65;  // 42.2 s of fight: THE REPLY-ALL HYDRA beaten by play, replayed in node
    Q.PAR['w2-1'] = 45;     // 29.3 s
    Q.PAR['w2-2'] = 45;     // 28.9 s
    Q.PAR['w2-3'] = 95;     // 60.9 s
    Q.PAR['w2-boss'] = 70;  // not measured (my fight bot does not finish THE OVERHEAT): about 33 s hitting every open vent at power 2, read from its numbers; inferred
    Q.PAR['w3-1'] = 65;     // 41.4 s
    Q.PAR['w3-2'] = 65;     // 40.8 s
    Q.PAR['w3-3'] = 100;    // 65.3 s
    Q.PAR['w3-boss'] = 55;  // 36.5 s of fight, THE LOOP beaten by play
    Q.PAR['w4-1'] = 50;     // 31.1 s: replayed in node (the earlier run's 38.8 s was before tonight's bot)
    Q.PAR['w4-2'] = 60;     // 40.0 s
    Q.PAR['w4-3'] = 65;     // 41.8 s
    Q.PAR['w4-boss'] = 50;  // 33 s: SCOPE CREEP beaten by builder 9's bot (mine does not finish it)
