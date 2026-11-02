    // ---------- 82-w2-boss.js: THE OVERHEAT ('overheat'), Rack 7, in THE HOT AISLE (builder 7). Its vents, strips and drawing are in 82-w2-boss-b.js ----------
    // Rack 7 stands at the end of the arena on its 'U' tiles (3 by 6), C2 taped in its recess. It gets hotter all fight (the heat bar on its front).
    // Its vents GLOW (the tell), then BLAST a jet of hot air out to the left, then hang OPEN: a hit on an open vent (baton or note) cools the rack and
    // hurts it. The floor heats in strips: a glow first, then a short burn. Heat at 100: MELTDOWN (the angry face, all vents at once, stand back).
    // Phases by hp (2/3, 1/3): more vents at once, then everything faster. Its own box is the server column only, so it is never hit but by a vent.
    Q.w2 = Q.w2 || {};
    var W2_OH = {
      HP: 24, START: 1.2, COOL: 14, MELT_AT: 100, MELT_TO: 35,
      PH: [
        { glow: 1.0, blast: 0.7, open: 1.5, gap: 0.9, sEvery: 5.0, sGlow: 1.1, sBurn: 0.5, heat: 3.5, two: false, sweep: false },
        { glow: 0.85, blast: 0.7, open: 1.3, gap: 0.7, sEvery: 3.8, sGlow: 0.95, sBurn: 0.5, heat: 5, two: true, sweep: false },
        { glow: 0.6, blast: 0.55, open: 1.1, gap: 0.4, sEvery: 3.4, sGlow: 0.7, sBurn: 0.45, heat: 7, two: true, sweep: true }
      ],
      MELT: { glow: 1.3, blast: 0.9, open: 2.0 },
      VENTS: [{ y: 0, len: 7 }, { y: 32, len: 7 }, { y: 80, len: 8 }],   // rack-local y of each vent (high, middle, low) and its jet's length in tiles
      ORDER: [[2], [1], [0], [2], [0], [1]],                                // phase 1: one vent at a time
      ORDER2: [[2, 0], [1], [2, 1], [0], [1, 0], [2]]                       // phases 2 and 3: two at once, then one
    };
    Q.w2.OH = W2_OH;
    function w2Say(e, Q, list, fallback) {   // a short line over the rack (STORY's words, with ours as the fallback)
      var t = (list && list.length) ? list[Math.floor(Q.rand() * list.length) % list.length] : fallback;
      Q.fx('text', e.data.rx - 40, e.data.ry - 8, { text: t, col: '#ffd23f', life: 1.6 });
    }
    function w2Story(kind) { return Q.story && Q.story[kind] && Q.story[kind].overheat; }
    Q.w2.ohSay = w2Say;

    Q.defBoss('overheat', {
      name: 'THE OVERHEAT', face: 'face-overheat', music: 'boss-overheat', intro: 'w2-boss', outro: 'w2-won',
      w: 32, h: 96, hp: W2_OH.HP, xp: 23, tokens: 10, touch: 0, gravity: 0, solid: false, col: '#ff7a1a',
      init: function (e, Q) {
        var D = e.data, us = Q.findTiles('U'), i, minx = 9999, miny = 9999, maxy = 0;
        for (i = 0; i < us.length; i++) { minx = Math.min(minx, us[i].tx); miny = Math.min(miny, us[i].ty); maxy = Math.max(maxy, us[i].ty); }
        if (!us.length) { minx = Math.floor(e.x / 16); miny = Math.floor(e.y / 16); maxy = miny + 5; }
        D.rx = minx * 16; D.ry = miny * 16; D.floor = (maxy + 1) * 16;            // the rack's top left, and the floor's top
        e.x = D.rx + 16; e.y = D.ry; e.face = -1;
        D.heat = 30; D.phase = 0; D.wait = W2_OH.START; D.order = 0; D.mood = 0; D.moodT = 0; D.blink = 2; D.say = 5; D.melt = 0; D.fromVent = false;
        D.vents = [];
        for (i = 0; i < W2_OH.VENTS.length; i++) D.vents.push(Q.spawn('overheat-vent', D.rx - 6, D.ry + W2_OH.VENTS[i].y + 1, { boss: e, i: i }));
        Q.w2.ohStrips(e, Q);
      },
      hit: function (e, how, n, Q) { if (!e.data.fromVent) return false; },
      update: function (e, dt, Q) {
        var D = e.data, ph, i, v, busy = 0, list, f = e.maxHp > 0 ? e.hp / e.maxHp : 1;
        e.vx = 0; e.vy = 0; e.x = D.rx + 16; e.y = D.ry;
        ph = W2_OH.PH[D.phase];
        if (D.phase < 2 && f <= (D.phase === 0 ? 2 / 3 : 1 / 3)) {   // the next phase: a pause, a shout, hotter
          D.phase++; ph = W2_OH.PH[D.phase]; D.wait = 1.3; D.heat = Math.min(95, D.heat + 15); D.mood = 2; D.moodT = 1.3;
          for (i = 0; i < D.vents.length; i++) Q.w2.ventShut(D.vents[i]);
          Q.shake(3, 0.4); Q.sfx('roar'); w2Say(e, Q, null, D.phase === 1 ? 'FANS TO MAX!' : '200 PERCENT!');
          if (D.phase === 2) Q.music('boss-overheat2');   // the last phase: AUDIO's hotter, faster half (it joins at the next bar)
        }
        if (D.moodT > 0) { D.moodT -= dt; if (D.moodT <= 0) D.mood = 0; }
        D.blink -= dt; if (D.blink <= -0.15) D.blink = 2 + Q.rand() * 2;
        Q.w2.ohStripStep(e, dt, Q, ph);
        if (!D.roared) { D.roared = true; Q.sfx('roar'); }
        if (D.wait > 0) { D.wait -= dt; return; }
        if (D.melt) { Q.w2.ohMeltStep(e, dt, Q); return; }
        D.heat = Math.min(W2_OH.MELT_AT, D.heat + ph.heat * dt);
        D.say -= dt;
        if (D.say <= 0) { D.say = 6 + Q.rand() * 4; w2Say(e, Q, w2Story('shout'), 'HOTTER!'); }
        for (i = 0; i < D.vents.length; i++) if (D.vents[i].st !== 'shut') busy++;
        if (D.heat >= W2_OH.MELT_AT && !busy) { Q.w2.ohMelt(e, Q); return; }
        if (busy) return;
        D.gap = (D.gap || 0) - dt;
        if (D.gap > 0) return;
        list = (ph.two ? W2_OH.ORDER2 : W2_OH.ORDER)[D.order % 6]; D.order++;
        for (i = 0; i < list.length; i++) { v = D.vents[list[i]]; Q.w2.ventGo(v, ph.glow, ph.blast, ph.open); }
        D.gap = ph.gap;
      },
      die: function (e, Q) {
        var D = e.data, i;
        for (i = 0; i < D.vents.length; i++) Q.remove(D.vents[i]);
        D.strips = [];
        Q.fx('text', D.rx - 40, D.ry - 8, { text: ((Q.story && Q.story.beaten && Q.story.beaten.overheat) || ['IS THIS A BREAK?'])[0], col: '#8ff0e6', life: 2.4 });
        Q.spawn('overheat-cool', D.rx, D.ry, {});
      },
      draw: function (e, g, Q) { Q.w2.ohDraw(e, g, Q); }
    });

    Q.w2.ohMelt = function (e, Q) {   // heat at the top: the angry face, a shout, then all three vents together
      var D = e.data, i, M = W2_OH.MELT;
      D.melt = 1; D.meltT = 0; D.mood = 2; D.moodT = M.glow + M.blast;
      for (i = 0; i < D.vents.length; i++) Q.w2.ventGo(D.vents[i], M.glow, M.blast, M.open);
      Q.shake(2, M.glow); w2Say(e, Q, null, 'MELTDOWN MODE!'); Q.sfx('charge');
    };
    Q.w2.ohMeltStep = function (e, dt, Q) {
      var D = e.data, i, busy = 0;
      D.meltT += dt;
      for (i = 0; i < D.vents.length; i++) if (D.vents[i].st !== 'shut') busy++;
      if (!busy && D.meltT > 0.5) { D.melt = 0; D.heat = Math.min(D.heat, W2_OH.MELT_TO); D.gap = 0.8; }
    };
    Q.w2.ohCooled = function (e, Q, n, how) {   // a vent was hit while open: cooler, and hurt
      var D = e.data, r;
      D.heat = Math.max(0, D.heat - W2_OH.COOL); D.mood = 3; D.moodT = 0.5;
      D.fromVent = true; r = Q.damage(e, n, how); D.fromVent = false;
      if (r && !e.dead && Q.t - (D.hurtSaid || -9) >= 2.5) { D.hurtSaid = Q.t; w2Say(e, Q, w2Story('hurt'), 'OOH. COOL.'); }
      return r;
    };
