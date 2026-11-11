    // ---------- 73-ui-map.js: the map (UI, builder 5) ----------
    // The inside of the 9F computer: a path of gold traces on the board with the four worlds as stops and VEND-9's shop on the way. Locked worlds are grey;
    // the conductor walks the path with left and right (up to the first locked world). The agents saved so far stand by their worlds and talk with Up,
    // one line at a time from map-cN (map-cN-late once all three are saved). A on a world starts it (Q.startWorld), A on the shop opens 'shop', Start opens 'pause'.
    // Version 116 (part 14): after the ending the path goes on along the top of the board to THE ENCORE's stage (map-encore, A: Q.encore()), and, once the
    // ROOT FOLDER is open (Q.rootOpen()), on to it (map-root, A: Q.startLevel('root-1')); never shown before. A world's levels at or under par get ic-clock in
    // the bar, and its chip a clock once all four are. With every gold star won, the map says stars-all once (the save's flag u5-stars-all).
    (function () {
      var U = Q.ui, M = { at: 0, to: 0, u: 0, walk: false, len: 1, t: 0, fade: 0, going: 0, talker: '', saidAll: null }, LINE = {};
      var STOPS = [{ n: 1, x: 40, y: 144 }, { n: 0, x: 100, y: 104 }, { n: 2, x: 160, y: 144 }, { n: 3, x: 220, y: 104 }, { n: 4, x: 282, y: 66 },
        { n: 'encore', x: 150, y: 68, via: [[266, 50], [168, 50]] }, { n: 'root', x: 40, y: 68, via: [[130, 48], [60, 48]] }];   // the two late stops: above world 3's chip and VEND-9
      U.mapKeep = false; U.lastWorld = 0; U.lastStop = '';
      function count() {   // the stops shown: the five, then THE ENCORE, then THE ROOT FOLDER (asked once a frame: ENGINE counts the secrets for it)
        var t = U.now();
        if (M.cAt !== t) { M.cAt = t; M.c = Q.encoreOpen() ? (Q.rootOpen() ? 7 : 6) : 5; }
        return M.c;
      }
      U.mapAt = function () { return { at: M.at, walk: M.walk, stop: STOPS[M.at].n, stops: count() }; };   // for checks: where he stands (stop 0 is the shop)
      U.mapSpot = function (n) { for (var i = 0; i < STOPS.length; i++) if (STOPS[i].n === n) return { x: STOPS[i].x, y: STOPS[i].y, shown: i < count() }; return null; };   // B24: a stop's pad (THE COMPASS points at it)
      function route(a, b) {   // a trace from stop a to stop b: along, a 45 degree turn, along (or b's own way there)
        var dx = b.x - a.x, dy = b.y - a.y, d = Math.abs(dy), m = a.x + dx / 2;
        if (b.via) return [[a.x, a.y]].concat(b.via, [[b.x, b.y]]);
        return [[a.x, a.y], [m - d / 2, a.y], [m + d / 2, b.y], [b.x, b.y]];
      }
      function plen(p) { var n = 0; for (var i = 1; i < p.length; i++) n += Math.sqrt(Math.pow(p[i][0] - p[i - 1][0], 2) + Math.pow(p[i][1] - p[i - 1][1], 2)); return n; }
      function along(p, d) {   // the point d pixels along a trace
        for (var i = 1; i < p.length; i++) {
          var sl = Math.sqrt(Math.pow(p[i][0] - p[i - 1][0], 2) + Math.pow(p[i][1] - p[i - 1][1], 2));
          if (d <= sl || i === p.length - 1) { var k = sl ? Q.clamp(d / sl, 0, 1) : 0; return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * k, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k]; }
          d -= sl;
        }
        return p[0];
      }
      function open(i) { var s = STOPS[i]; return s.n === 0 || typeof s.n === 'string' ? i < count() : !!Q.unlocked(s.n); }
      function reach() { for (var i = 0; i < count(); i++) if (!open(i)) return i; return count() - 1; }   // as far as the first locked world
      function stopOf(n) { for (var i = 0; i < STOPS.length; i++) if (STOPS[i].n === n) return i; return 0; }
      function highest() { var n = 1; for (var k = 2; k <= 4; k++) if (Q.unlocked(k)) n = k; return n; }
      function state(n) { var w = Q.WORLD[n]; return Q.cleared((w && w.boss) || 'w' + n + '-boss') ? 'cleared' : Q.unlocked(n) ? 'open' : 'locked'; }
      function won() { return !!(Q.SAVE && Q.SAVE.won); }   // after the end: every world cleared, the three walk with him
      function agentAt(i) { var n = STOPS[i].n; return !won() && n >= 1 && n <= 3 && U.saved('c' + n) ? 'c' + n : ''; }
      var PARTY = ['c1', 'c2', 'c3'], SIDE = [-1, 1, 1, -1, 1, 1, 1], POFF = [0, 0, 0];   // after the end: a tight trio beside him, on each stop's roomy side
      function partyStep(dt, snap) {   // they trail behind him on the way, and settle on the stop's side when he stops
        var k, dir = M.walk ? (M.to > M.at ? 1 : -1) : 0, want;
        for (k = 0; k < 3; k++) {
          want = (M.walk ? -dir : SIDE[M.at]) * 10 * (k + 1);
          POFF[k] = snap ? want : POFF[k] + (want - POFF[k]) * Math.min(1, dt * 7);
        }
      }
      function allSaved() { return U.saved('c1') && U.saved('c2') && U.saved('c3'); }
      function parAll(n) { var l = U.parLevels(n), i; for (i = 0; i < l.length; i++) if (!U.underPar(l[i])) return false; return l.length > 0; }
      function talk(c) {   // one line from that agent's map script, the next each time
        var id = won() && Q.SCRIPT['map-' + c + '-won'] ? 'map-' + c + '-won' : allSaved() && Q.SCRIPT['map-' + c + '-late'] ? 'map-' + c + '-late' : 'map-' + c, lines = Q.SCRIPT[id];   // after the end: map-cN-won when STORY has it
        if (!lines || !lines.length) { Q.sfx('nope'); return; }
        var k = LINE[id] || 0; LINE[id] = (k + 1) % lines.length;
        M.talker = c; Q.sfx('select');
        U.talk([lines[k]], function () { M.talker = ''; }, null, id + '#' + k);
      }
      function paths(g) {   // the path: gold where it is open, dim where it leads to a locked world; the dark edge first so the gold is never covered
        var i, p, k, d, x, y, lit, pass, ax, ay, bx, by, n;
        for (i = 1; i < count(); i++) {
          p = route(STOPS[i - 1], STOPS[i]); lit = open(i);
          for (pass = 0; pass < 2; pass++) for (k = 1; k < p.length; k++) {
            ax = p[k - 1][0]; ay = p[k - 1][1]; bx = p[k][0]; by = p[k][1]; n = Math.max(Math.abs(bx - ax), Math.abs(by - ay));
            for (d = 0; d <= n; d += lit ? 1 : 3) {
              x = Math.round(ax + (bx - ax) * d / (n || 1)); y = Math.round(ay + (by - ay) * d / (n || 1));
              if (pass === 0) U.fill(g, x - 1, y - 1, lit ? 4 : 3, lit ? 4 : 3, '#1d1d24'); else U.fill(g, x, y, lit ? 2 : 1, lit ? 2 : 1, lit ? '#c9a640' : '#3c5a52');
            }
          }
        }
      }
      function pathImage() {   // the path drawn once into a canvas, again only when a world opens
        var key = '', i;
        if (typeof Q.canvas !== 'function') return null;
        for (i = 1; i < count(); i++) key += open(i) ? '1' : '0';
        if (!M.pim || M.pkey !== key) { M.pim = M.pim || Q.canvas(320, 200); M.pim.getContext('2d').clearRect(0, 0, 320, 200); paths(M.pim.getContext('2d')); M.pkey = key; }
        return M.pim;
      }
      function startWalk(to) { M.to = to; M.u = 0; M.walk = true; M.len = plen(route(STOPS[Math.min(M.at, to)], STOPS[Math.max(M.at, to)])); }
      function into(n) {   // after the fade: a world, THE ENCORE or THE ROOT FOLDER (part 14.10 item 1); still here after it (a part not in): a buzz
        if (n === 'encore') Q.encore(); else if (n === 'root') Q.startLevel('root-1'); else Q.startWorld(n);
        if (Q.scene === 'map') { M.fade = 0; Q.sfx('nope'); }
      }
      Q.defScene('map', {
        enter: function (opts) { U.entered();
          opts = opts || {};
          if (typeof opts.at === 'number') M.at = opts.at;
          else if (opts.world) M.at = stopOf(opts.world);
          else if (opts.shop) M.at = stopOf(0);   // back from VEND-9: in front of it
          else if (!U.mapKeep) M.at = U.lastStop && stopOf(U.lastStop) < count() ? stopOf(U.lastStop) : stopOf(U.lastWorld || highest());   // back from THE ENCORE or a room: by its stop
          U.mapKeep = false; U.lastWorld = 0; U.lastStop = '';
          M.at = Q.clamp(M.at | 0, 0, reach()); M.walk = false; M.fade = 0; M.going = 0; M.talker = '';
          partyStep(0, true);
          if (U.compassReset) U.compassReset();   // B24: THE COMPASS's check starts closed (73-ui-map-compass-b.js)
          Q.music('map');
        },
        update: function (dt) {
          var i, dir = 0;
          M.t += dt;
          partyStep(dt, false);
          if (M.going) { M.fade += dt / 0.35; if (M.fade >= 1) { var n = M.going; M.going = 0; into(n); } return; }
          U.tick();
          if (Q.talking()) return;
          if (!M.walk && M.saidAll !== Q.SAVE && Q.SCRIPT['stars-all'] && !Q.flag('u5-stars-all') && U.starsAll()) {   // every gold star won: its lines, once a save
            M.saidAll = Q.SAVE; Q.flag('u5-stars-all', true); Q.saveGame(); Q.say('stars-all'); return;
          }
          if (M.walk) {
            M.u += dt * 100 / M.len;
            if (M.u >= 1) {
              M.at = M.to; M.walk = false; Q.sfx('move');
              if (U.held('right') && M.at + 1 <= reach()) startWalk(M.at + 1); else if (U.held('left') && M.at > 0) startWalk(M.at - 1);
            }
            return;
          }
          if (U.compassMap && U.compassMap(dt)) return;   // B24: THE COMPASS: its first scene once a file, C for a COMPASS CHECK, and the check while it is open
          if (U.press('right') || U.held('right')) dir = 1; else if (U.press('left') || U.held('left')) dir = -1;
          if (dir > 0 && M.at + 1 <= reach()) { startWalk(M.at + 1); return; }
          if (dir < 0 && M.at > 0) { startWalk(M.at - 1); return; }
          var up = U.press('up');   // asked once: a press is given out once a frame
          if (up && agentAt(M.at)) { talk(agentAt(M.at)); return; }
          if (up && won()) { M.turn = ((M.turn || 0) % 3) + 1; talk('c' + M.turn); return; }   // each of the three in turn, their late lines
          if (U.press('start')) { U.mapKeep = true; Q.sfx('select'); Q.go('pause', { from: 'map' }); return; }
          if (U.press('a')) {
            i = STOPS[M.at].n;
            if (i === 0) { U.mapKeep = true; Q.sfx('select'); Q.go('shop'); }
            else if (open(M.at)) { M.going = i; M.fade = 0; Q.sfx('door'); }
            else { Q.sfx('nope'); Q.toast('LOCKED. CLEAR ' + U.worldName(i - 1) + ' FIRST.', 2.2); }
          }
        },
        draw: function (g) {
          var t = M.t, i, s, p, d, pos, k, c, fr, flip = false, x, y, b = Q.boss;
          Q.spr(g, 'u5-board', 0, 0, 0);
          var pim = pathImage();
          if (pim) g.drawImage(pim, 0, 0); else paths(g);
          for (i = 1; i < count(); i++) {   // data on its way along the open traces
            if (!open(i)) continue;
            p = route(STOPS[i - 1], STOPS[i]);
            for (k = 0; k < 2; k++) { pos = along(p, ((t * 40 + k * plen(p) / 2 + i * 13) % plen(p))); U.fill(g, Math.round(pos[0]), Math.round(pos[1]), 2, 2, '#fff6c8'); }
          }
          for (i = 0; i < count(); i++) {
            s = STOPS[i]; U.pad(g, s.x, s.y, open(i));
            if (s.n === 0) Q.spr(g, 'vend', Math.floor(t * 2) % 2, s.x - 16, s.y - 52);
            else if (typeof s.n === 'string') U.lateStop(g, s.n, s.x, s.y, t, !U.starWon(s.n));   // the stars encore and root share the stops' names
            else {
              U.chip(g, s.n, s.x, s.y - 36, state(s.n), t);
              if (parAll(s.n)) { U.fill(g, s.x - 22, s.y - 53, 10, 10, '#1d1d24'); U.clockIcon(g, s.x - 21, s.y - 52, true); }   // every one of its four at or under par
            }
            c = agentAt(i);
            if (c) {
              Q.spr(g, c, M.talker === c ? 2 + Math.floor(t * 4) % 2 : Math.floor(t * 2 + i) % 2, s.x + 9, s.y - 19, true);
              if (i === M.at && !M.walk && !Q.talking()) U.arrow(g, s.x + 15, s.y - 27 + Math.floor(t * 3) % 2, '#ffd23f');
            }
          }
          if (M.walk) {   // the conductor on his way
            var lo = Math.min(M.at, M.to), hi = Math.max(M.at, M.to); p = route(STOPS[lo], STOPS[hi]);
            pos = along(p, (M.to > M.at ? M.u : 1 - M.u) * M.len); flip = M.to < M.at; fr = 2 + Math.floor(t * 10) % 4;
          } else { pos = [STOPS[M.at].x, STOPS[M.at].y]; fr = Math.floor(t * 2) % 2; }
          if (won()) for (i = 2; i >= 0; i--) {   // the three, by his side wherever he goes (the farthest drawn first), each facing him
            c = PARTY[i];
            Q.spr(g, c, M.talker === c ? 2 + Math.floor(t * 4) % 2 : Math.floor(t * (M.walk ? 6 : 2) + i) % 2, Math.round(pos[0] + POFF[i]) - 8, Math.round(pos[1]) - 20, POFF[i] > 0);
          }
          Q.spr(g, U.hero(), fr, Math.round(pos[0]) - 8, Math.round(pos[1]) - 20, flip);
          Q.boss = null; Q.ui.hud(g, Q); Q.boss = b;
          drawInfo(g, t);
          if (U.compassMapDraw) U.compassMapDraw(g, t, 0);   // B24: THE COMPASS in its corner, with its C
          if (M.going) { g.globalAlpha = Q.clamp(M.fade, 0, 1); U.fill(g, 0, 0, 320, 200, '#000000'); g.globalAlpha = 1; }
          U.drawTalk(g);
          if (U.compassMapDraw) U.compassMapDraw(g, t, 1);   // B24: the COMPASS CHECK, over everything while it is open
        },
        sides: function (g) {   // a wide screen's sides (the engine clips to them): more board, the HUD's band carried across, and the same fade
          U.boardSides(g);
          U.fill(g, 0, 0, Q.W, 15, '#121318'); U.fill(g, 0, 15, Q.W, 1, '#3a3d52');
          if (M.going) { g.globalAlpha = Q.clamp(M.fade, 0, 1); U.fill(g, 0, 0, Q.W, 200, '#000000'); g.globalAlpha = 1; }
        }
      });
      function drawInfo(g, t) {   // the bar at the bottom: where he stands and what he can do there
        if (Q.talking() || (U.compassIsOpen && U.compassIsOpen())) return;   // B24: the bar steps aside while the COMPASS CHECK is open
        var s = STOPS[M.walk ? M.to : M.at], st, hint, blurb = Q.story && Q.story.world && Q.story.world[s.n];
        U.box(g, 4, 160, 312, 37, '#2ec4b6', '#10151d');
        if (s.n === 0) {
          U.text("VEND-9'S SHOP", 10, 165, '#ffd9b0');
          U.text('COFFEE, HEARTS AND MORE, FOR TOKENS.', 10, 175, '#9aa3ad');
          U.text('TOKENS ' + Math.floor((Q.SAVE && Q.SAVE.tokens) || 0), 10, 186, '#ffd23f');
          hint = 'A: SHOP';
        } else if (s.n === 'encore') {   // THE ENCORE: its best time, and its two gold stars
          var e = U.encoreBest();
          U.text('THE ENCORE', 10, 165, '#ffd23f');
          U.text(e ? 'BEST ' + U.mss(e) : 'NO TIME YET', 310, 165, e ? '#ffd23f' : '#8a93a8', 1, 'right');
          U.text(blurb ? String(blurb) : 'ALL FOUR BOSSES AGAIN, BACK TO BACK.', 10, 175, '#9aa3ad');
          U.starIcon(g, 10, 183, U.starWon('encore')); U.starIcon(g, 24, 183, U.starWon('encore-clean'));
          hint = 'A: START';
          if (won() && !M.walk) hint = 'UP: TALK  ' + hint;
        } else if (s.n === 'root') {   // THE ROOT FOLDER
          U.text('THE ROOT FOLDER', 10, 165, '#e2c78e');
          U.text(U.starWon('root') ? 'README READ' : 'OPEN', 310, 165, U.starWon('root') ? '#6fd88f' : '#ffd23f', 1, 'right');
          U.text(blurb ? String(blurb) : 'THE OLDEST FOLDER ON THE 9F COMPUTER.', 10, 175, '#9aa3ad');
          hint = 'A: ENTER';
          if (won() && !M.walk) hint = 'UP: TALK  ' + hint;
        } else {
          st = state(s.n);
          U.text('WORLD ' + s.n + '  ' + U.worldName(s.n), 10, 165, '#ffffff');
          U.text(st === 'cleared' ? 'CLEARED' : st === 'open' ? 'OPEN' : 'LOCKED', 310, 165, st === 'cleared' ? '#6fd88f' : st === 'open' ? '#ffd23f' : '#8a93a8', 1, 'right');
          U.text(st === 'locked' ? 'CLEAR ' + U.worldName(s.n - 1) + ' TO OPEN IT.' : blurb ? String(blurb) : '', 10, 175, '#9aa3ad');
          U.text('MEMOS ' + U.memoCount(Q.SAVE, s.n) + '/6', 10, 186, '#9aa3ad');
          var lv = U.parLevels(s.n), j, any = false;   // SPRINT REVIEW: its four, lit at or under par, once he has a time in one of them
          for (j = 0; j < lv.length; j++) if (U.best(lv[j])) any = true;
          if (any) for (j = 0; j < lv.length; j++) U.clockIcon(g, 72 + j * 10, 185, U.underPar(lv[j]));
          hint = st === 'locked' ? '' : 'A: ENTER';
          if ((agentAt(M.at) || won()) && !M.walk) hint = 'UP: TALK  ' + hint;
        }
        U.text((hint ? hint + '  ' : '') + 'START: MENU', 310, 186, '#c3c7d4', 1, 'right');
      }
    })();
