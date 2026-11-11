    // ---------- 84-w4-boss.js: SCOPE CREEP ('creep') at THE ROOT TICKET (B9), in three phases ----------
    // 1 (it adds things): it hangs high and drifts, sweeps vines along the floor, rains sticky notes, then slams down tired, ticket eyes glowing: hit them.
    // 2 (two thirds: 'w4-phase2', song final2, it calls a meeting): a big eye of tickets fires requests (a note or a swing knocks them back into it); invites drop in.
    // 3 (one third: 'w4-phase3', song final3, the agents join in): C1 types a shield to stand behind, C2 pauses it every few seconds (the root ticket droops
    //   into reach), C3 holds it firm (no sweeps, it cannot move); a ring closes on the root ticket with each beat: on the beat, three times the blow.
    // It is never destroyed: the engine's death of a boss clears the field and plays 'w4-won'; what is left is one small ticket, NICE TO HAVE (creep-end).
    var W4_SHOUT = {
      1: ['QUICK ASK!', "WHILE YOU'RE IN THERE...", 'JUST ONE MORE THING!', 'SMALL CHANGE, BIG IMPACT!', 'CAN WE ALSO...', 'AND ANOTHER THING!'],
      2: ['QUICK SYNC!', "LET'S CIRCLE BACK!", "EVERYONE'S INVITED!", 'THIS IS A HARD STOP!', "LET'S TAKE IT OFFLINE!"],
      3: ['SCOPE: EXPANDED!', 'BY FRIDAY!', "I'M A ROADMAP NOW!", 'NO! NOT A DEADLINE!'],
      hurt: ['OUCH! NOTED!', 'PARKING THAT!']
    };
    var W4_UP = 58, W4_LOW = 134, W4_MID = 84, W4_DROOP = 116;
    var W4_SEQ = { 1: ['sweep', 'notes', 'open', 'sweep2', 'notes', 'open'], 2: ['req', 'invites', 'sweep', 'req', 'open', 'sweep2', 'req', 'open'], 3: ['req', 'notes', 'req', 'notes'] };
    var W4_LEN = { rest: 1.2, sweep: 2.6, sweep2: 4.2, notes: 2.4, open: 4.9, req: 2.4, invites: 1.2 };
    var W4_EV = { sweep: [0], sweep2: [0, 1.5], notes: [0, 0.22, 0.44, 0.66, 0.88], req: [0.6, 1.0, 1.4], invites: [0], open: [0.4, 0.75, 4.15] };
    function w4Shout(list) { var B = w4B; if (!list || !list.length || B.shoutT > 0) return; B.shoutT = 2.4; Q.fx('text', B.hx, B.hy - 38, { text: list[Math.floor(Q.rand() * list.length)], col: '#ffd23f' }); }
    function w4Words(kind, key, dflt) { var b = Q.story && Q.story[kind], w = b && b[key]; return w && w.length ? (typeof w === 'string' ? [w] : w) : dflt; }   // STORY's words (48-story-bank.js), with mine to fall back on
    function w4PhaseShout() { var B = w4B; return w4Words('shout', B.phase === 1 ? 'creep' : 'creep' + B.phase, W4_SHOUT[B.phase]); }
    function w4Pick(list) { return list[Math.floor(Q.rand() * list.length)]; }
    function w4Beats() {   // beats since the song began, by the music's own clock when the sound is on, else by game time; and the length of a beat
      var A = Q.au, s = A && A.s, bpm = (s && s.bpm) || (Q.SONG.final3 && Q.SONG.final3.bpm) || 138, c = null;
      try { c = Q.api && Q.api.audio ? Q.api.audio() : null; } catch (er) { c = null; }
      w4B.len = 60 / bpm;
      if (!(c && c.state === 'running' && s && A.t0 >= 0)) return w4B.beatT / w4B.len;
      w4B.lat = Math.min(0.3, (+c.baseLatency || 0) + (+c.outputLatency || 0));   // what he hears comes this late: the ring lands with the heard beat
      return (c.currentTime - w4B.lat - A.t0) / w4B.len;
    }
    function w4OnBeat() { if (w4B.phase !== 3) return false; var b = w4Beats(), f = b - Math.floor(b); return Math.min(f, 1 - f) * w4B.len <= (w4B.p3T > 45 ? 0.16 : 0.11); }   // after 45 s, a wider window
    function w4Shielded(e) {   // C1's shield takes a shot or a note (it holds four, then C1 types it again)
      var S = w4B.shield; if (!S || !S.up || !Q.overlap(e, S)) return false;
      S.hp--; Q.sfx('shield'); if (S.hp <= 0) { S.up = false; S.typing = 0; S.wait = 1.4; Q.fx('text', S.x + S.w / 2, S.y - 8, { text: w4Pick(['RETYPING...', 'TYPING...', 'ONE SEC...']), col: '#bcd4f6' }); }
      return true;
    }
    function w4Clear() { for (var i = 0; i < Q.ents.length; i++) { var o = Q.ents[i]; if (/^creep-(vine|note|req)$/.test(o.id) || o.id === 'invite') { Q.fx('pop', o.x + o.w / 2, o.y + o.h / 2); Q.remove(o); } } }
    function w4Fire(e, act, k) {   // the k-th moment of an action
      var B = w4B, P = Q.P, i, x, xs, dx, dy, d, n;
      if (act === 'sweep' || act === 'sweep2') { B.side = act === 'sweep2' ? (k ? -1 : 1) : -B.side; Q.spawn('creep-vine', B.side > 0 ? 16 : 292, 134, { dir: B.side, v: B.phase === 2 ? 210 : 170 }); if (!k) w4Shout(w4PhaseShout()); }
      else if (act === 'notes') {
        if (!k) { B.xs = []; for (i = 0; i < 5; i++) B.xs.push(32 + ((i * 53 + Math.floor(Q.rand() * 40)) % 248)); w4Shout(w4PhaseShout()); }
        Q.spawn('creep-note', B.xs[k], 20, {});
      } else if (act === 'req') {
        if (!B.bigEye || !P) return;
        x = B.bigEye.x + 12; dx = P.x + P.w / 2 - x; dy = P.y + P.h / 2 - (B.bigEye.y + 9); d = Math.sqrt(dx * dx + dy * dy) || 1;
        Q.spawn('creep-req', x - 5, B.bigEye.y + 14, { vx: dx / d * 95, vy: dy / d * 95 }); Q.sfx('type');
        if (!k) w4Shout(w4PhaseShout());
      } else if (act === 'invites') {
        for (n = 0, i = 0; i < Q.ents.length; i++) if (Q.ents[i].id === 'invite' && !Q.ents[i].dead) n++;
        xs = [64, 248]; for (i = 0; i < 2 && n < 2; i++, n++) { Q.spawn('invite', xs[(i + B.qi) % 2], 72, {}); Q.fx('pop', xs[(i + B.qi) % 2] + 7, 78); }
        w4Shout(w4Words('shout', 'creep2', W4_SHOUT[2]));
      } else if (act === 'open') {
        if (k === 0) { B.slam = true; Q.sfx('drop'); }
        if (k === 1) { B.open = true; B.slam = false; Q.shake(4, 0.3); Q.sfx('pound'); Q.fx('dust', B.hx - 24, 144, { n: 4 }); Q.fx('dust', B.hx + 24, 144, { n: 4 }); w4Shout(["LET'S CIRCLE BACK...", 'NEED A MINUTE...', 'SO MANY ASKS...']); }
        if (k === 2) B.open = false;
      }
    }
    function w4Head(e, dt) {   // where its head goes, and where its eyes and the root ticket sit on it
      var B = w4B, tx, ty, i;
      if (B.phase >= 3) { tx = 160; ty = B.paused ? W4_DROOP : W4_MID + Math.sin(B.t * 2) * 3; }
      else if (B.act === 'open' && B.actT >= 0.4) { tx = B.ox; ty = B.open || B.slam ? W4_LOW : W4_UP; }
      else { tx = 160 + Math.sin(B.t * 0.55) * 64; ty = W4_UP + Math.sin(B.t * 2) * 3; if (B.act === 'open') { tx = B.ox; ty += Math.sin(B.actT * 50) * 2; } }
      B.hx = Q.approach(B.hx, tx, 90 * dt); B.hy = Q.approach(B.hy, ty, (B.slam ? 420 : 150) * dt);
      e.x = B.hx - e.w / 2; e.y = B.hy - e.h / 2; e.touch = B.hy < 100 && !B.paused ? 1 : 0;
      for (i = 0; i < 2; i++) if (B.eyes[i]) { B.eyes[i].x = B.hx + (i ? 20 : -20) - 8; B.eyes[i].y = B.hy - 4 - 6; }
      if (B.bigEye) { B.bigEye.x = B.hx - 12; B.bigEye.y = B.hy - 17; }
      if (B.core) { B.core.x = B.hx - 9; B.core.y = B.hy + 9; }
    }
    function w4Agents(dt) {   // phase 3: the shield, the pause, the hold
      var B = w4B, S = B.shield, A = B.agents, i;
      if (B.phase < 3 || !S) return;
      if (!S.up) { if (S.wait > 0) S.wait -= dt; else { S.typing += dt / 1.2; if (Math.floor(S.typing * 10) !== Math.floor((S.typing - dt / 1.2) * 10)) Q.sfx('type'); if (S.typing >= 1) { S.up = true; S.hp = 4; Q.sfx('shield'); if (Q.rand() < 0.4) Q.fx('text', S.x + S.w / 2, S.y - 8, { text: 'SHIELD UP!', col: '#bcd4f6' }); } } }
      B.pauseT -= dt;
      if (!B.paused && B.pauseT <= 0) { B.paused = true; B.pauseT = 3; Q.sfx('still'); Q.fx('text', 257, 66, { text: w4Pick(['...PAUSED.', '...HOLD...', '...STILL.']), col: '#bfe8cd' }); }
      else if (B.paused && B.pauseT <= 0) { B.paused = false; B.pauseT = 4.5; }
      B.p3T += dt; if (B.p3T > 45 && !B.nudged) { B.nudged = true; Q.toast('WATCH THE RING. HIT AS IT CLOSES.', 4); Q.sfx('select'); }   // the Facilitator's nudge, once
      for (i = 0; i < A.length; i++) if (A[i] && !A[i].dead) A[i].cheer = B.cheer > 0 || (i === 0 && !S.up && S.wait <= 0) || (i === 1 && B.paused) || (i === 2 && B.paused);
    }
    function w4NextPhase(e) {
      var B = w4B, i;
      B.phase++; B.act = 'rest'; B.actT = 0; B.ev = 0; B.qi = -1; B.open = false; B.slam = false; B.charge = 0;
      w4Clear(); Q.sfx('roar'); Q.shake(5, 0.5); Q.flash('#ffffff', 0.15);
      Q.spawn('pickup', B.hx - 4, B.hy + 20, { kind: 'heart', vx: (Q.rand() - 0.5) * 80, vy: -160 });   // a kind heart at each new phase
      if (B.phase === 2) { B.bigEye = Q.spawn('creep-bigeye', B.hx - 12, B.hy - 17, {}); Q.music('final2'); Q.sayStory('w4-phase2'); }   // 126: not in a HIGH SCORE or SPEED RUN run
      if (B.phase === 3) {
        B.core = Q.spawn('creep-core', B.hx - 9, B.hy + 9, {}); Q.music('final3'); B.beatT = 0; B.pauseT = 1.5; B.paused = false;
        B.shield = { x: 44, y: 112, w: 84, h: 8, up: false, hp: 0, typing: 0, wait: 0.3 };
        B.agents = [Q.spawn('agent', 36, 130, { who: 'c1' }), Q.spawn('agent', 252, 82, { who: 'c2' }), Q.spawn('agent', 276, 130, { who: 'c3' })];
        for (i = 0; i < 3; i++) if (B.agents[i]) { B.agents[i].free = true; Q.fx('confetti', B.agents[i].x + 5, B.agents[i].y, { n: 14 }); }
        if (B.agents[0]) B.agents[0].face = 1;
        Q.sfx('warp'); Q.sayStory('w4-phase3');
      }
    }

    Q.defBoss('creep', {
      name: 'SCOPE CREEP', face: 'face-creep', music: 'final', intro: 'w4-boss', outro: 'w4-won',
      w: 64, h: 44, hp: 60, xp: 50, tokens: 0, touch: 1, gravity: 0, solid: false, stun: false, sprite: 'creep-head',
      init: function (e) {
        var B = w4B;
        B.fwd = 0; B.phase = 1; B.act = 'rest'; B.actT = 0; B.ev = 0; B.qi = -1; B.t = 0; B.beatT = 0; B.len = 60 / 138; B.xs = [];
        B.hx = 160; B.hy = W4_UP; B.ox = 160; B.side = 1; B.open = false; B.slam = false; B.charge = 0; B.shoutT = 0; B.cheer = 0;
        B.paused = false; B.pauseT = 0; B.shield = null; B.agents = []; B.bigEye = null; B.core = null; B.onBeat = false; B.p3T = 0; B.nudged = false;
        B.eyes = [Q.spawn('creep-eye', 0, 0, {}), Q.spawn('creep-eye', 0, 0, {})];
        w4Head(e, 0);
      },
      update: function (e, dt) {
        var B = w4B, seq, ev;
        B.t += dt; B.beatT += dt; if (B.shoutT > 0) B.shoutT -= dt; if (B.cheer > 0) B.cheer -= dt; if (B.charge > 0) B.charge -= dt;
        B.onBeat = w4OnBeat();
        if (B.phase < 3 && e.hp <= e.maxHp * (B.phase === 1 ? 2 / 3 : 1 / 3)) { w4NextPhase(e); w4Head(e, dt); return; }
        w4Agents(dt);
        if (!B.paused) {
          B.actT += dt; ev = W4_EV[B.act] || [];
          while (B.ev < ev.length && B.actT >= ev[B.ev]) { w4Fire(e, B.act, B.ev); B.ev++; }
          if (B.act === 'req' && B.actT < 0.6) B.charge = 0.1;
          if (B.actT >= (W4_LEN[B.act] || 1)) {
            seq = W4_SEQ[B.phase]; B.qi = (B.qi + 1) % seq.length; B.act = seq[B.qi]; B.actT = 0; B.ev = 0; B.open = false; B.slam = false;
            if (B.act === 'open') B.ox = Q.clamp(B.hx, 90, 230);
          }
        }
        w4Head(e, dt);
      },
      hit: function (e, how, n) {   // only through its eyes and the root ticket (w4HitBoss); a blow on the vines just glances off
        if (w4B.fwd) { if (e.hp - n > 0 && Q.rand() < 0.3) { w4B.shoutT = 0; w4Shout(w4Words('hurt', 'creep', W4_SHOUT.hurt)); } return true; }
        if (how !== 'pound') Q.fx('spark', w4B.hx, w4B.hy + 10, { n: 2 });
        return false;
      },
      die: function () {
        var B = w4B, i, o;
        Q.fx('text', B.hx, B.hy - 40, { text: w4Pick(w4Words('beaten', 'creep', ['SCOPE... SHRINKING...'])), col: '#ffd23f' });   // the outro says JUST ONE MORE THI- itself
        for (i = 0; i < Q.ents.length; i++) { o = Q.ents[i]; if (/^creep-(eye|bigeye|core)$/.test(o.id)) Q.remove(o); }
        Q.spawn('creep-end', B.hx - 11, B.hy - 7, {});
        for (i = 0; i < B.agents.length; i++) if (B.agents[i]) B.agents[i].cheer = true;
        B.phase = 4; B.shield = null; B.bigEye = null; B.core = null;
      },
      draw: function (e, g) {
        var B = w4B, cx = Q.cam.x, cy = Q.cam.y, hx = Math.round(B.hx - cx), hy = Math.round(B.hy - cy), i, k, x, y, f, b, r, S = B.shield, A = B.agents, api = Q.api;
        var sh = e.hurtT > 0 ? Math.round(Math.sin(e.t * 60) * 2) : 0;
        for (i = 0; i < 7; i++) for (y = 16 - cy; y < hy - 20; y += 6) {   // the vines it hangs from
          g.fillStyle = ((y >> 3) + i) & 1 ? '#2e7a3a' : '#1f5229';
          g.fillRect(Math.round(hx - 31 + i * 10 + Math.sin(B.t * 1.5 + i + y * 0.05) * 2), Math.round(y), 3, 7);
        }
        if (B.phase === 3 && A[2] && !A[2].dead) for (k = 1; k < 10; k++) {   // C3 holds it firm: a pink line from her hand to its root
          g.fillStyle = (k + Math.floor(B.t * 8)) % 2 ? '#ee7fb0' : '#fbd3e3';
          g.fillRect(Math.round(A[2].x + 2 - cx + (hx + 24 - (A[2].x + 2 - cx)) * k / 10), Math.round(A[2].y + 2 - cy + (hy + 14 - (A[2].y + 2 - cy)) * k / 10), 2, 2);
        }
        Q.spr(g, 'creep-head', B.phase >= 3 ? 1 : 0, hx - 36 + sh, hy - 28);
        for (i = 0; i < 2; i++) {
          f = B.eyes[i] && B.eyes[i].data.hurt > 0 ? 3 : B.open ? 2 : B.slam ? 0 : 1; x = hx + (i ? 20 : -20) - 8 + sh;
          if (B.open && Math.floor(B.t * 8) % 2) { g.fillStyle = '#ffd23f'; g.fillRect(x - 2, hy - 12, 20, 16); }   // glowing: hit it now
          Q.spr(g, 'creep-eye', f, x, hy - 10);
        }
        if (B.bigEye) Q.spr(g, 'creep-bigeye', B.bigEye.data.hurt > 0 ? 2 : B.charge > 0 ? 1 : 0, hx - 14 + sh, hy - 19);
        if (B.core) {   // the root ticket, and the ring that closes on it with every beat
          Q.spr(g, 'creep-core', B.onBeat ? 1 : 0, hx - 10, hy + 8);
          b = w4Beats(); f = b - Math.floor(b); r = 5 + 20 * (1 - f);
          for (k = 0; k < 16; k++) { g.fillStyle = '#1d1d24'; g.fillRect(Math.round(hx + Math.cos(k / 16 * 6.283) * r) - 2, Math.round(hy + 15 + Math.sin(k / 16 * 6.283) * r * 0.7) - 2, 4, 4);
            g.fillStyle = B.onBeat ? '#ffffff' : '#ffd23f'; g.fillRect(Math.round(hx + Math.cos(k / 16 * 6.283) * r) - 1, Math.round(hy + 15 + Math.sin(k / 16 * 6.283) * r * 0.7) - 1, 2, 2); }
          for (k = 0; k < 4; k++) { g.fillStyle = k === Math.floor(b) % 4 ? (B.onBeat ? '#ffd23f' : '#ff8a1e') : '#4a3a6a'; g.fillRect(160 - 23 + k * 12 - cx, 188 - cy, 8, B.onBeat && k === Math.floor(b) % 4 ? 8 : 6); }
          if (api) api.text('KEEP TIME', 160 - cx, 176 - cy, '#ffd23f', 1, 'center');
        }
        if (B.paused) { g.fillStyle = '#1d1d24'; g.fillRect(hx - 7, hy - 47, 14, 14); g.fillStyle = '#bfe8cd'; g.fillRect(hx - 5, hy - 45, 3, 10); g.fillRect(hx + 2, hy - 45, 3, 10); }
        if (S && (S.up || S.typing > 0)) {   // C1's shield: a line of typed characters to stand behind
          x = Math.round(S.x - cx); y = Math.round(S.y - cy); k = S.up ? 12 : Math.floor(S.typing * 12);
          g.fillStyle = S.up ? 'rgba(63,127,217,0.45)' : 'rgba(63,127,217,0.2)'; g.fillRect(x, y - 1, S.w, S.h + 2);
          g.fillStyle = '#bcd4f6'; g.fillRect(x, y - 1, S.w, 1); g.fillRect(x, y + S.h, S.w, 1);
          if (api) api.text('> SHIELD UP_'.slice(0, k), x + 4, y, S.up ? '#ffffff' : '#bcd4f6', 1, 'left');
        }
      }
    });
