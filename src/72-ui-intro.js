    // ---------- 72-ui-intro.js: the intro (UI, builder 5) ----------
    // The Ninth Floor at night: C1, C2 and C3 typing at their desks, the conductor keeping time. Driven by the 'intro' script and its cues (QUEST-API.md
    // part 13, 6): 'flicker' (the 9F screen flickers), 'vines' (sticky-note vines creep out to the desks), 'grab' (each agent is wrapped and pulled into
    // the screen, C1 first), 'empty' (three empty chairs, three warm mugs), 'tap' (the conductor taps its baton twice and jumps in). A goes on, Start
    // skips; then Q.startLevel('w1-1'). Without cues the pictures are paced by the line count; without the script, by the clock.
    (function () {
      var U = Q.ui, O = null, IN = {}, ORDER = ['office', 'flicker', 'vines', 'grab', 'empty', 'tap'];   // O: the office (78-ui-room.js), read at run time
      var CLOCK = { flicker: 1.5, vines: 3.5, grab: 6, empty: 11.5, tap: 13.5 };   // without a script
      function rank(b) { return ORDER.indexOf(b); }
      function setBeat(b) {
        var i, c;
        if (rank(b) <= rank(IN.beat)) return;   // the pictures only go forward
        IN.beat = b; IN.bt = 0;
        if (b === 'flicker') Q.sfx('zap');
        if (b === 'grab') { IN.gs.c1 = Math.min(IN.gs.c1, IN.t); IN.gs.c2 = Math.min(IN.gs.c2, IN.t + 1.7); IN.gs.c3 = Math.min(IN.gs.c3, IN.t + 3.4); }
        if (b === 'empty' || b === 'tap') for (i = 0; i < 3; i++) { c = O.AG[i]; if (IN.gs[c] > IN.t) IN.gs[c] = IN.t - 2; }   // anyone still here has already gone
        if (b === 'tap') IN.tapT = 0;
      }
      function cueTable(lines) {   // the cue for each line: STORY's own, or spread by the line count
        var n = lines.length, has = false, i, tab = [];
        for (i = 0; i < n; i++) { if (lines[i].cue) has = true; tab.push(lines[i].cue || ''); }
        if (!has && n) { tab[Math.round(n * 0.15)] = 'flicker'; tab[Math.round(n * 0.3)] = 'vines'; tab[Math.round(n * 0.4)] = 'grab'; tab[Math.round(n * 0.7)] = 'empty'; tab[n - 1] = 'tap'; }
        return tab;
      }
      function into() { Q.startLevel('w1-1'); if (Q.scene === 'intro') { Q.startWorld(1); if (Q.scene === 'intro') Q.go('title'); } }   // no w1-1 yet: never a stuck screen
      function finish() { if (IN.over) return; IN.over = true; U.cancel(); into(); }
      Q.defScene('intro', {
        enter: function () { U.entered();
          var lines = Q.SCRIPT.intro || [];
          O = U.office;
          IN = { t: 0, bt: 0, beat: 'office', gs: { c1: 1e9, c2: 1e9, c3: 1e9 }, gone: {}, vg: 0, tapT: -1, said: false, started: false, out: 0, over: false,
                 who: 'none', flashT: -9, script: lines.length > 0, cues: cueTable(lines) };
          U.cancel(); Q.music(null);
        },
        update: function (dt) {
          var i, c, k;
          O = U.office;
          IN.t += dt; IN.bt += dt;
          if (U.runLater() || IN.over) return;
          if (U.press('start')) { Q.sfx('select'); IN.over = true; U.cancel(); U.later(into); return; }   // next frame, so the level never reads this Start
          if (!IN.started && IN.t > 0.8) {
            IN.started = true;
            if (IN.script) Q.say('intro', function () { IN.said = true; setBeat('tap'); }, function (i, line) { IN.who = String(line.who || 'none'); if (IN.cues[i]) setBeat(IN.cues[i]); if (IN.beat === 'grab' && IN.gs[IN.who] !== undefined) IN.gs[IN.who] = Math.min(IN.gs[IN.who], IN.t); });
          }
          if (!IN.script) for (k in CLOCK) if (IN.t >= CLOCK[k]) { setBeat(k); if (k === 'tap') IN.said = true; }
          U.tick();
          if (rank(IN.beat) >= rank('vines')) IN.vg = Math.min(1, IN.vg + dt * (rank(IN.beat) >= rank('grab') ? 2 : 0.4));
          for (i = 0; i < 3; i++) { c = O.AG[i]; if (!IN.gone[c] && IN.t - IN.gs[c] >= 1.6) { IN.gone[c] = true; IN.flashT = IN.t; Q.sfx('zap'); } else if (IN.t - IN.gs[c] >= 0 && IN.t - IN.gs[c] < dt) Q.sfx('freeze'); }
          if (IN.tapT >= 0) {
            var was = IN.tapT; IN.tapT += dt;
            if ((was < 0.4 && IN.tapT >= 0.4) || (was < 0.7 && IN.tapT >= 0.7)) Q.sfx('tick');   // tap, tap
            if (was < 1.0 && IN.tapT >= 1.0) Q.sfx('jump');
            if (was < 1.7 && IN.tapT >= 1.7) { Q.sfx('warp'); IN.flashT = IN.t; }
          }
          if (IN.said && IN.tapT >= 1.9) { IN.out += dt / 0.5; if (IN.out >= 1) finish(); }
        },
        draw: function (g) {
          var t = IN.t, i, c, tau, x, y, s, u, fr, flip, scr, hx, hy;
          O = U.office;
          O.back(g, 0);
          for (i = 0; i < 3; i++) {   // the agents in their chairs (behind the desks)
            c = O.AG[i]; tau = t - IN.gs[c];
            if (tau < 0) Q.spr(g, c, IN.beat === 'office' ? Math.floor(t * 5 + i) % 2 : 0, O.SX[i], O.AY);
            else if (tau < 0.5) Q.spr(g, c, 4 + Math.floor(t * 10) % 2, O.SX[i] + (Math.floor(t * 20) % 2 ? 1 : -1), O.AY);
          }
          for (i = 0; i < 3; i++) Q.spr(g, 'u5-desk', 0, O.SX[i] - 10, 96);
          for (i = 0; i < 3; i++) {
            c = O.AG[i]; tau = t - IN.gs[c];
            O.monitor(g, i, true, IN.beat === 'office' ? t : 0.4 + i);
            if (IN.beat === 'office') O.hands(g, i, t + i * 0.3);
            O.steam(g, i, t + i * 0.7);
            if (IN.vg > 0 && !IN.gone[c] && rank(IN.beat) < rank('empty')) O.vine(g, i, IN.vg * (tau < 0.5 ? 1 : Math.max(0, 1 - (tau - 0.5) / 1.1)), t);
          }
          for (i = 0; i < 3; i++) {   // pulled along into the 9F screen, smaller and smaller
            c = O.AG[i]; tau = t - IN.gs[c];
            if (tau < 0.5 || tau >= 1.6) continue;
            u = (tau - 0.5) / 1.1; u = u * u * (3 - 2 * u); s = 1 - 0.78 * u;
            x = Q.lerp(O.SX[i], 263, u); y = Q.lerp(O.AY, 86, u) - Math.sin(u * Math.PI) * 30;
            U.sprite(g, c, 4 + Math.floor(t * 10) % 2, x + 8 - 8 * s, y + 10 - 10 * s, s);
          }
          scr = IN.beat === 'office' ? 'calm' : IN.beat === 'flicker' && IN.bt < 1.2 && IN.who !== 'creep' ? 'flicker' : rank(IN.beat) >= rank('empty') ? 'quiet' : IN.who === 'creep' ? 'creep' : 'green';
          if (t - IN.flashT < 0.12) scr = 'white';
          O.screen(g, scr, t);
          flip = IN.beat === 'office' || (IN.beat === 'empty' && IN.who !== 'hero');   // he looks at the desks, or at the 9F computer
          fr = IN.beat === 'office' ? (Math.floor(t / U.beat('title')) % 2 ? 9 : 8) : Math.floor(t * 1.5) % 2;
          hx = O.HX; hy = O.HY; s = 1;
          if (IN.tapT >= 0) {
            flip = false; u = IN.tapT;
            fr = u < 0.25 ? 0 : u < 0.4 ? 8 : u < 0.55 ? 9 : u < 0.7 ? 8 : u < 0.85 ? 9 : u < 1 ? 0 : 6;
            if (u >= 1) { u = Math.min(1, (u - 1) / 0.7); hx = Q.lerp(O.HX, 262, u); hy = Q.lerp(O.HY, 84, u) - Math.sin(u * Math.PI) * 34; s = u < 0.7 ? 1 : 1 - (u - 0.7) / 0.3 * 0.8; }
          }
          if (IN.tapT < 1.7) U.sprite(g, U.hero(), fr, hx + 8 - 8 * s, hy + 10 - 10 * s, s, flip);
          if (IN.out > 0) { g.globalAlpha = Q.clamp(IN.out, 0, 1); U.fill(g, 0, 0, 320, 200, '#ffffff'); g.globalAlpha = 1; }
          if (!IN.over) U.drawTalk(g);
          U.text('START: SKIP', 316, 4, '#7f8ab8', 1, 'right');
        }
      });
    })();
