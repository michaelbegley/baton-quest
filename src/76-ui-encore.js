    // ---------- 76-ui-encore.js: THE ENCORE's results (UI, builder 5; QUEST-API.md part 14.4, 14.10 item 1) ----------
    // ENGINE's Q.go('encore', { t, best, hits }) after the last of the four fights: a stage with its curtains and a spotlight, the big word ENCORE, the time
    // counting up, the best (FIRST ENCORE! or NEW BEST! when it is), the hearts lost and a line; the conductor takes a bow while C1, C2 and C3 cheer, and
    // confetti falls. A, B or Start goes on to the map (the scene's own way on). The song that is playing (AUDIO's encore) plays on.
    // The line is STORY's when Q.story.encore has it (first, best, clean, done), else our own.
    (function () {
      var U = Q.ui, EC = { t: 0, o: null, first: false, best: false, counted: false, bg: null };
      var LINES = { first: 'ALL FOUR, BACK TO BACK. TAKE A BOW.', best: 'A NEW BEST TIME. THE CROWD WANTS ONE MORE.',
                    clean: 'BARELY A SCRATCH. THAT IS HOW TO CLOSE A SHOW.', done: 'FOUR BOSSES, ONE CLOCK, NO OVERTIME PAY.' };
      var COUNT = 0.9, WALL = U.grad('#140b1c', '#2d1838', 19), CONF = ['#ffd23f', '#2ec4b6', '#ee7fb0', '#6fb8ff', '#ffffff'];
      function line() {
        var k = EC.first ? 'first' : EC.best ? 'best' : EC.o.hits <= 3 ? 'clean' : 'done', s = Q.story && Q.story.encore;
        return s && s[k] ? String(s[k]).toUpperCase() : LINES[k];
      }
      U.encoreAt = function () { return EC.o ? { t: EC.o.t, best: EC.o.best, hits: EC.o.hits, first: EC.first, newBest: EC.best, line: line(), counted: EC.counted } : null; };   // for checks
      function stage(g) {   // the backdrop, drawn once: the back wall, the floor, the curtains and the valance
        var y, x, w, k;
        U.bands(g, WALL, 0, 8);
        U.fill(g, 0, 150, 320, 14, '#7a4a2a'); U.fill(g, 0, 150, 320, 1, '#a86f43'); U.fill(g, 0, 164, 320, 36, '#120a16'); U.fill(g, 0, 164, 320, 2, '#3a2218');
        for (x = 12; x < 320; x += 26) U.fill(g, x, 151, 1, 13, '#5e3a22');
        for (y = 0; y < 166; y += 2) {   // the curtains, gathered in a little at the height of the stage
          w = Math.round(26 + 10 * Math.abs(y - 112) / 112);
          for (k = 0; k < w; k += 6) {
            U.fill(g, k, y, Math.min(6, w - k), 2, (k / 6) % 2 ? '#c8384c' : '#a8243a');
            U.fill(g, 320 - k - Math.min(6, w - k), y, Math.min(6, w - k), 2, (k / 6) % 2 ? '#c8384c' : '#a8243a');
          }
          U.fill(g, w, y, 1, 2, '#5a1020'); U.fill(g, 319 - w, y, 1, 2, '#5a1020');
        }
        U.fill(g, 0, 0, 320, 12, '#a8243a');
        for (x = 0; x < 320; x += 16) { U.fill(g, x + 2, 12, 12, 2, '#a8243a'); U.fill(g, x + 4, 14, 8, 1, '#a8243a'); }   // the valance's scallops
        U.fill(g, 0, 11, 320, 1, '#ffd23f'); U.fill(g, 0, 3, 320, 1, '#c8384c');
      }
      Q.defScene('encore', {
        enter: function (opts) { U.entered();
          var o = opts || {}, t = +o.t, b = +o.best;
          EC.o = { t: t > 0 ? t : 0, best: b > 0 ? b : U.encoreBest(), hits: Math.max(0, +o.hits || 0) };
          EC.first = Q.stat('encore') <= 1 && EC.o.t > 0;   // ENGINE counts each encore finished (this one is in already)
          EC.best = !EC.first && EC.o.t > 0 && EC.o.best > 0 && EC.o.t <= EC.o.best + 0.001;
          EC.t = 0; EC.counted = false;
          U.cancel();
        },
        update: function (dt) {
          EC.t += dt;
          U.tick();
          if (!EC.counted && EC.t >= COUNT) { EC.counted = true; Q.sfx(EC.first || EC.best ? 'lvup' : 'select'); }
          if (Q.talking() || EC.t < 0.4) return;
          if (U.press('a') || U.press('b') || U.press('start')) {
            if (!EC.counted) { EC.t = COUNT; return; }   // the count is skipped first
            Q.sfx('select'); U.lastStop = 'encore'; Q.go('map');   // by THE ENCORE's stage, even when no level of it was drawn (a check opens these results straight)
          }
        },
        draw: function (g) {
          var t = EC.t, o = EC.o || { t: 0, best: 0, hits: 0 }, k = Q.clamp(t / COUNT, 0, 1), i, x, y, w, beat = Math.floor(t * 2.2), badge;
          if (!EC.bg && typeof Q.canvas === 'function') { EC.bg = Q.canvas(320, 200); stage(EC.bg.getContext('2d')); }
          if (EC.bg) g.drawImage(EC.bg, 0, 0); else stage(g);
          g.globalAlpha = 0.11;   // the spotlight on the conductor
          for (y = 14; y < 152; y += 2) { w = Math.round(8 + (y - 14) * 0.34); U.fill(g, 160 - w, y, w * 2, 2, '#fff4bf'); }
          g.globalAlpha = 1;
          U.bigWord(g, 'ENCORE', 160 - (U.bigWidth('ENCORE', 3) >> 1), 19, 3, U.WARM, U.WARM_SIDE);
          U.box(g, 76, 50, 168, 60, '#ffd23f', '#170f1d');
          U.text('TIME', 86, 58, '#c9b0ee'); U.text(o.t ? U.mss(o.t * k) : '-:--', 234, 55, '#ffffff', 2, 'right');
          U.text('BEST', 86, 76, '#c9b0ee'); U.text(o.best ? U.mss(o.best) : '-:--', 234, 76, '#ffd23f', 1, 'right');
          U.text('HEARTS LOST', 86, 88, '#c9b0ee'); U.text(String(Math.round(o.hits * k)), 234, 88, '#f6efe2', 1, 'right');
          badge = EC.first ? 'FIRST ENCORE!' : EC.best ? 'NEW BEST!' : '';
          if (badge && EC.counted && Math.floor(t * 3) % 3) U.text(badge, 160, 99, '#ffd23f', 1, 'center');
          for (i = 0; i < 3; i++) Q.spr(g, ['c1', 'c2', 'c3'][i], 2 + (beat + i) % 2, [102, 194, 214][i], 132, i > 0);   // cheering, facing him
          U.sprite(g, U.hero(), beat % 4 === 0 ? 17 : beat % 2 ? 9 : 8, 144, 112, 2);
          for (i = 0; i < 26; i++) {   // confetti, once the time is in
            if (!EC.counted) break;
            x = (i * 53 + Math.sin(t * 1.3 + i) * 10 + 400) % 280 + 20; y = ((t - COUNT) * (24 + i % 5 * 6) + i * 17) % 170;
            U.fill(g, Math.round(x), Math.round(y), 2, i % 3 ? 2 : 1, CONF[i % CONF.length]);
          }
          U.text(line(), 160, 172, '#f6efe2', 1, 'center');
          if (EC.counted && !Q.talking() && Math.floor(t * 2) % 2) U.text('A: BACK TO THE MAP', 160, 187, '#c9b0ee', 1, 'center');
          U.drawTalk(g);
        },
        sides: function (g) {   // a wide screen's sides (the engine clips to them): the curtains carried on in folds of 6 from the seams, the valance across, the dark floor
          var ox = Q.OX, r = ox + 320, x, k;
          for (x = ox - 6; x > -6; x -= 6) { k = Math.round((ox - 6 - x) / 6); U.fill(g, x, 0, 6, 166, k % 2 ? '#a8243a' : '#c8384c'); }
          for (x = r; x < Q.W; x += 6) { k = Math.round((x - r) / 6); U.fill(g, x, 0, 6, 166, k % 2 ? '#a8243a' : '#c8384c'); }
          U.fill(g, 0, 166, Q.W, 34, '#120a16');
          U.fill(g, 0, 0, Q.W, 12, '#a8243a');
          for (x = ox % 16 - 16; x < Q.W; x += 16) { U.fill(g, x + 2, 12, 12, 2, '#a8243a'); U.fill(g, x + 4, 14, 8, 1, '#a8243a'); }   // the valance's scallops, in step with the middle's
          U.fill(g, 0, 11, Q.W, 1, '#ffd23f'); U.fill(g, 0, 3, Q.W, 1, '#c8384c');
        }
      });
    })();
