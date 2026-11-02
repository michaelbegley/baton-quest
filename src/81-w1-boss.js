    // ---------- 81-w1-boss.js: WORLD 1, THE INBOX: THE REPLY-ALL HYDRA, its brain (builder 6) ----------
    // A huge mailbox with three envelope heads on long necks of letters. One head at a time rears back with its flap open (the tell; a red marker
    // shows where it will land), bites the floor there, and rests on it, dazed and low enough to hit. A hit head cries "RE:" and pulls back, and
    // the rest speed up. Each head holds a share of the hydra's health: when its share is gone the head droops for good, and the others grow
    // angrier. From half health, letters rain down while a head rests (their shadows show where). With one head left it bites twice in a row.
    // The heads are hit boxes of their own ('hydra-head'); the body draws them all (81-w1-boss-b.js) so they sit in front of their necks.
    var W1H = {
      share: [7, 7, 6],
      anchor: [[26, 26], [40, 24], [54, 26]],          // where each neck leaves the slot, from the mailbox's top left
      home: [[-74, -18], [-36, -30], [0, -22]],          // where each head sways, from the mailbox's top left (the head's middle)
      idle: ['+1', 'PER MY LAST EMAIL', 'PLEASE ADVISE', 'ADDING EVERYONE', 'CC: THE WHOLE FLOOR', 'WHO IS ON THIS?', 'THANKS ALL!'],   // not WRONG THREAD: the outro's
      cries: ['RE:', 'RE: RE:', 'RE: FWD: RE:', 'RE: RE: RE:'],   // a hit head cries one, in turn, at most every 4 s (STORY's read in play)
      angry: ['REPLYING ALL!', 'URGENT! URGENT!'],
      beaten: 'UNSUBSCRIBE ME...',
      left: 26, right: 214                                // where a bite may land (the floor in front of the mailbox)
    };
    Q.w1.H = W1H;
    function w1Pick(list) { return list[Math.floor(Q.rand() * list.length) % list.length]; }
    function w1HydraLive(d) { var n = 0; for (var i = 0; i < d.heads.length; i++) if (d.heads[i].data.st !== 'gone') n++; return n; }
    function w1HydraBusy(d) { for (var i = 0; i < d.heads.length; i++) { var s = d.heads[i].data.st; if (s !== 'sway' && s !== 'gone') return true; } return false; }
    function w1HydraTempo(d) { return Math.min(2.4, 1 + 0.07 * d.hits + 0.3 * d.gone); }
    function w1Shout(d, x, y, text, col, life) {   // a shout over the fight: inside the screen's sides, clear of the HUD for its whole rise
      var half = text.length * 3 + 2; life = life || 0.9;
      x = Q.clamp(x, Q.cam.x + half, Q.cam.x + Q.W - half); y = Math.max(y, Q.cam.y + 24 + 28 * life);
      Q.fx('text', x, y, { text: text, col: col || '#ffffff', life: life }); d.shoutAt = d.clock;
    }

    // the damage, through the engine (never by hand): the body's box stands in for the head for a moment, so the spark and, at the end, the
    // tokens come out where the head is
    function w1HydraHurt(body, h, n, how) {
      var bx = body.x, by = body.y, bw = body.w, bh = body.h;
      body.x = h.x; body.y = h.y; body.w = h.w; body.h = h.h;
      body.data.via = true; Q.damage(body, n, how); body.data.via = false;
      if (!body.dead) { body.x = bx; body.y = by; body.w = bw; body.h = bh; }
    }
    function w1HydraHit(h, how, n) {   // a head's own hit: only while it rests on the floor
      var hd = h.data, body = hd.body, bd, m, re;
      if (!body || body.dead || hd.st !== 'rest' || hd.cool > 0) return false;
      bd = body.data; m = Math.min(n, hd.share); if (m <= 0) return false;
      hd.share -= m; hd.hits++; hd.cool = 0.3; hd.flash = 0.2; bd.hits++;
      if (bd.clock - bd.shoutAt >= 4) { w1Shout(bd, h.x + h.w / 2, h.y - 8, W1H.cries[bd.cry % W1H.cries.length], '#ffd23f'); bd.cry++; Q.sfx('reply'); }
      w1HydraHurt(body, h, m, how);
      if (body.dead) return false;
      hd.fx = h.x; hd.fy = h.y; hd.k = 0; h.touch = 0;
      if (hd.share <= 0) {   // this one is done replying: it droops, and the rest are offended
        hd.st = 'gone'; bd.gone++;
        w1Shout(bd, h.x + h.w / 2, h.y - 18, W1H.angry[bd.gone % 2], '#f47a68', 1.4); Q.sfx('roar'); Q.shake(3, 0.3);
      } else hd.st = 'back';
      bd.idle = Math.max(bd.idle, 0.35);
      return false;
    }
    function w1HydraRain(e, n, spare) {   // letters from above the view onto the floor, each showing its shadow first; never on the dazed head
      var d = e.data, xs = [], tries = 0, x, i, ok, wait = Math.max(0.6, 0.85 / Math.sqrt(w1HydraTempo(d)));
      while (xs.length < n && tries++ < 40) {
        x = W1H.left + Math.floor(Q.rand() * (W1H.right - W1H.left));
        ok = Math.abs(x - spare) >= 30; for (i = 0; i < xs.length; i++) if (Math.abs(xs[i] - x) < 34) ok = false;
        if (ok) xs.push(x);
      }
      for (i = 0; i < xs.length; i++) Q.spawn('w1-mail', xs[i] - 5, Q.cam.y - 12, { wait: wait + i * 0.12, vy: 330, floor: d.floor, always: true });
    }
    function w1HydraAim(e, h) {   // a head's turn: it rears back, flap open; a shout now and then
      var hd = h.data, P = Q.P;
      hd.st = 'aim'; hd.k = 0; hd.fx = h.x; hd.fy = h.y;
      hd.tx = Q.clamp(P ? P.x + P.w / 2 : 120, W1H.left, W1H.right);
      if (Q.rand() < 0.45 && e.data.clock - e.data.shoutAt >= 4) w1Shout(e.data, h.x + h.w / 2, h.y - 8, w1Pick(W1H.idle), '#ffffff', 1.2);
    }

    Q.defBoss('hydra', {
      name: 'THE REPLY-ALL HYDRA', face: 'face-hydra', music: 'boss-hydra', intro: 'w1-boss', outro: 'w1-won',
      w: 80, h: 80, hp: 20, xp: 10, tokens: 10, touch: 1, gravity: 0, solid: false, stun: false, col: '#2b4a8e',
      init: function (e) {
        var d = e.data, i, h, cx, cy;
        d.bx = e.x; d.by = e.y; d.heads = []; d.hits = 0; d.gone = 0; d.idle = 1.2; d.next = 0; d.clock = 0; d.p2 = false; d.cry = 0; d.shoutAt = -9;
        d.floor = Q.w1.floorBelow(e.x - 40, e.y);
        for (i = 0; i < 3; i++) {
          cx = e.x + W1H.home[i][0]; cy = e.y + W1H.home[i][1];
          h = Q.spawn('hydra-head', cx - 9, cy - 5, { body: e, i: i });
          if (h) { h.data.share = W1H.share[i]; d.heads.push(h); }
        }
      },
      update: function (e, dt) {
        var d = e.data, i, h, live, tempo;
        d.clock += dt;
        for (i = 0; i < d.heads.length; i++) w1HydraHead(e, d.heads[i], dt);
        if (!d.p2 && e.hp <= e.maxHp / 2) {   // half health: everyone is added to the thread
          d.p2 = true; Q.sfx('roar'); Q.shake(3, 0.4);
          w1Shout(d, d.bx + 40, d.by - 4, 'ADDING EVERYONE', '#f47a68', 1.6);
        }
        if (w1HydraBusy(d)) return;
        d.idle -= dt; if (d.idle > 0) return;
        live = w1HydraLive(d); tempo = w1HydraTempo(d);
        for (i = 0; i < 3 && live; i++) {
          h = d.heads[(d.next + i) % d.heads.length];
          if (h.data.st === 'gone') continue;
          d.next = (d.next + i + 1) % d.heads.length;
          h.data.extra = live === 1 ? 1 : 0;
          w1HydraAim(e, h);
          break;
        }
        d.idle = Math.max(0.25, 0.9 / tempo);
      },
      hit: function (e) { if (!e.data.via) return false; },   // only through its heads
      die: function (e) {
        var d = e.data, i;
        for (i = 0; i < d.heads.length; i++) { Q.fx('pop', d.heads[i].x + 9, d.heads[i].y + 5); d.heads[i].dead = true; }
        Q.spawn('hydra-rest', d.bx, d.by);
        w1Shout(d, d.bx - 10, d.by + 44, W1H.beaten, '#ffd23f', 2.4);
      },
      draw: function (e, g) { w1HydraDraw(e, g); }
    });
