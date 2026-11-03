    // ---------- 76-ui-credits.js: the credits (UI, builder 5) ----------
    // The 'credits' lines roll up, one entry a line (every who 'none'): 'BATON QUEST' shows as the lettering, a line with a comma is a name and its part in
    // two colours, short lines are big. Hold A or B to roll faster, Start to skip on. Then the numbers: time played, tokens, memos found, falls. Then THE END
    // (the script's last line: THE END big, the rest under it), then A (or a while) to the title. The 'end' song carries on.
    (function () {
      var U = Q.ui, CR = { t: 0, y: 0, rows: [], total: 0, phase: 'roll', pt: 0, end: 'THE END', rest: '' }, PO = {};
      var SKY = U.grad('#070a18', '#18224a', 20), SSTARS = [];   // SSTARS: a wide screen's side stars (made once, their own seed)
      (function () { var s = 41, i; function r() { s = (s * 16807) % 2147483647; return s / 2147483647; } for (i = 0; i < 66; i++) SSTARS.push([Math.floor(r() * Q.WMAX), Math.floor(r() * 200), i]); })();
      function layout(lines) {   // each line's look and the room it takes
        var rows = [], i, s, c;
        for (i = 0; i < lines.length; i++) {
          s = String(lines[i].text || '').toUpperCase(); c = s.indexOf(', ');
          if (s === 'BATON QUEST') rows.push({ kind: 'logo', s: s, h: 40 });
          else if (c > 0) rows.push({ kind: 'role', a: s.slice(0, c + 1), b: s.slice(c + 2), h: 18 });
          else if (s.length <= 9) rows.push({ kind: 'head', s: s, h: 30 });
          else if (s.length <= 25) rows.push({ kind: 'big', s: s, h: 28 });
          else rows.push({ kind: 'small', s: s, h: 18 });
        }
        return rows;
      }
      function drawRow(g, r, y) {
        var w, x;
        if (r.kind === 'logo') { Q.spr(g, 'u5-logo-s', 0, 160 - ((Q.SPRITE['u5-logo-s'] ? Q.SPRITE['u5-logo-s'].w : 158) >> 1), y); return; }   // the small logo (77-ui-front-logo.js, B17), centred by its own width
        if (r.kind === 'role') { w = U.width(r.a) + 6 + U.width(r.b); x = 160 - (w >> 1); U.text(r.a, x, y, '#f6efe2'); U.text(r.b, x + U.width(r.a) + 6, y, '#8ff0e6'); return; }
        if (r.kind === 'head') { U.text(r.s, 160, y + 8, '#ffd23f', 2, 'center'); return; }
        if (r.kind === 'big') { U.text(r.s, 160, y, '#f6efe2', 2, 'center'); return; }
        U.text(r.s, 160, y, '#c3c7d4', 1, 'center');
      }
      U.creditsAt = function () { return CR.phase; };   // for checks: 'roll', 'stats', 'end' or 'post'
      // ---- after the credits, the 'postcredits' script: the Ninth Floor at night, two boxes still taped shut in a corner (C4's yellow, C5's purple; only
      // the boxes are ever seen). Its cues: 'boxes', 'hum' (the yellow one hums and wobbles once, the purple one blips a light back), 'cat' (it curls up on both).
      function postStart() {
        CR.phase = 'post'; CR.pt = 0; PO = { t: 0, humT: -1, catT: -1, said: false, out: 0, fade: 0 };
        Q.say('postcredits', function () { PO.said = true; }, function (i, line) {
          var c = String(line.cue || '');
          if (c === 'hum' && PO.humT < 0) { PO.humT = 0; Q.sfx('still'); }
          if (c === 'cat' && PO.catT < 0) PO.catT = 0;
        });
      }
      function postStep(dt) {
        var was;
        PO.t += dt; PO.fade = Math.min(1, PO.fade + dt / 0.6);
        if (PO.humT >= 0) { was = PO.humT; PO.humT += dt; if (was < 0.9 && PO.humT >= 0.9) Q.sfx('tick'); }
        if (PO.catT >= 0) { was = PO.catT; PO.catT += dt; if (was < 2.4 && PO.catT >= 2.4) Q.sfx('meow'); }
        U.tick();
        if (U.press('start')) { U.cancel(); PO.said = true; }
        if (PO.said && !Q.talking()) { PO.out += dt / 0.8; if (PO.out >= 1) { U.cancel(); Q.go('title'); } }
      }
      function tbox(g, x, y, body, dark, tape, wob) {   // a box, taped shut, 15 by 13
        x += wob;
        U.fill(g, x, y, 15, 13, '#1d1d24'); U.fill(g, x + 1, y + 1, 13, 11, body); U.fill(g, x + 1, y + 9, 13, 3, dark);
        U.fill(g, x + 6, y + 1, 3, 11, tape); U.fill(g, x + 1, y + 1, 13, 1, tape);
      }
      function postDraw(g) {
        var O = U.office, t = PO.t, i, wob = PO.humT >= 0 && PO.humT < 0.6 ? (Math.floor(PO.humT * 20) % 2 ? 1 : -1) : 0, c, u, cx, cy, fr;
        O.back(g, 0);
        for (i = 0; i < 3; i++) { Q.spr(g, 'u5-desk', 0, O.SX[i] - 10, 96); O.monitor(g, i, false, t); }   // everyone has gone home: dark screens, empty chairs
        O.screen(g, 'quiet', t);
        tbox(g, 197, 114, '#ffd23f', '#c9a020', '#fff1a8', wob);
        tbox(g, 214, 114, '#8a5cc7', '#5e3a96', '#c9b0ee', 0);
        if (PO.humT >= 0.9 && PO.humT < 2.2 && Math.floor(PO.humT * 6) % 2) U.fill(g, 220, 122, 3, 2, '#8ff0e6');   // the purple one blips back
        if (PO.catT >= 0) {   // in by the cat flap, along the floor, up onto the boxes, and curled up there
          c = PO.catT;
          if (c < 1.9) { cx = Q.lerp(12, 188, c / 1.9); cy = 116; fr = 2 + Math.floor(c * 8) % 2; }
          else if (c < 2.4) { u = (c - 1.9) / 0.5; cx = Q.lerp(188, 206, u); cy = Q.lerp(116, 102, u) - Math.sin(u * Math.PI) * 10; fr = 2; }
          else { cx = 206; cy = 102; fr = Math.floor(c * 0.8) % 2; }
          Q.spr(g, 'cat', fr, Math.round(cx), Math.round(cy));
        }
        if (PO.fade < 1) { g.globalAlpha = 1 - PO.fade; U.fill(g, 0, 0, 320, 200, '#000000'); g.globalAlpha = 1; }
        if (PO.out > 0) { g.globalAlpha = Q.clamp(PO.out, 0, 1); U.fill(g, 0, 0, 320, 200, '#000000'); g.globalAlpha = 1; }
        U.drawTalk(g);
      }
      function next() { CR.phase = CR.phase === 'roll' ? 'stats' : 'end'; CR.pt = 0; Q.sfx(CR.phase === 'end' ? 'save' : 'select'); }
      Q.defScene('credits', {
        enter: function () { U.entered();
          var lines = (Q.SCRIPT.credits || []).slice(), last = lines.length ? String(lines.pop().text || '') : 'THE END';
          CR.rows = layout(lines); CR.total = 0;
          for (var i = 0; i < CR.rows.length; i++) CR.total += CR.rows[i].h;
          last = last.toUpperCase();
          if (last.indexOf('THE END') === 0) { CR.end = 'THE END'; CR.rest = last.slice(7).replace(/^[.!]?\s*/, ''); } else { CR.end = 'THE END'; CR.rest = last; }
          CR.t = 0; CR.y = 0; CR.pt = 0; CR.phase = CR.rows.length ? 'roll' : 'stats';
          U.cancel(); Q.music('end');
        },
        update: function (dt) {
          CR.t += dt; CR.pt += dt;
          if (CR.phase === 'roll') {
            CR.y += dt * (U.held('a') || U.held('b') ? 80 : 20);
            if (CR.y > 200 + CR.total + 10 || U.press('start')) next();
            return;
          }
          if (CR.phase === 'stats') { if ((CR.pt > 4.5) || U.press('start') || (CR.pt > 0.6 && U.press('a'))) next(); return; }
          if (CR.phase === 'post') { postStep(dt); return; }
          if ((CR.pt > 1 && (U.press('a') || U.press('start'))) || CR.pt > 25) { Q.sfx('select'); if (Q.SCRIPT.postcredits && Q.SCRIPT.postcredits.length) postStart(); else Q.go('title'); }
        },
        draw: function (g) {
          var t = CR.t, i, y, s, r, k, list;
          U.bands(g, SKY, 0, 10);
          for (i = 0; i < 30; i++) U.fill(g, (i * 71) % 320, (i * 43 + 7) % 200, 1, 1, Math.sin(t * 2 + i) > 0.5 ? '#ffffff' : '#4a5488');
          if (CR.phase !== 'roll') g.globalAlpha = 0.35;   // the drift stays well back behind the numbers
          for (i = 0; i < 8; i++) Q.spr(g, i % 3 === 0 ? 'u5-env' : i % 3 === 1 ? 'u5-tix' : 'u5-note', 0, (i * 41 + 13) % 300, Math.round(200 - ((t * (6 + i) + i * 37) % 214)));
          g.globalAlpha = 1;
          if (CR.phase === 'roll') {
            y = 186 - CR.y;
            for (i = 0; i < CR.rows.length; i++) { r = CR.rows[i]; if (y > -40 && y < 190) drawRow(g, r, Math.round(y)); y += r.h; }
            U.fill(g, 0, 186, 320, 14, SKY[SKY.length - 1]); U.fill(g, 0, 186, 320, 1, '#2a3878');   // a band at the foot that the lines rise out of
            U.text('HOLD A: FASTER   START: SKIP', 160, 190, '#5d6a9e', 1, 'center');
            return;
          }
          if (CR.phase === 'post') { postDraw(g); return; }
          s = U.stat();
          list = [['TIME PLAYED', U.clock(s.time)], ['TOKENS', String(Math.floor(s.tokens))], ['MEMOS FOUND', s.memos + ' OF 24'], ['FALLS', String(s.falls)]];
          if (CR.phase === 'stats') {
            U.text('THE NUMBERS', 160, 40, '#ffd23f', 2, 'center');
            for (i = 0; i < list.length; i++) {
              k = Q.clamp((CR.pt - 0.4 - i * 0.5) / 0.3, 0, 1); if (k <= 0) continue;
              y = 76 + i * 22;
              U.text(list[i][0], 150, y, '#8a93a8', 1, 'right');
              U.text(list[i][1], 170, y - 4, '#f6efe2', 2);
            }
            return;
          }
          U.bigWord(g, CR.end, 160 - (U.bigWidth(CR.end, 4) >> 1), 66, 4, U.WARM, U.WARM_SIDE);
          if (CR.rest) U.text(CR.rest, 160, 112, '#8ff0e6', 1, 'center');
          U.text('MEMOS ' + s.memos + '/24   TIME ' + U.clock(s.time), 160, 138, '#5d6a9e', 1, 'center');
          if (CR.pt > 1 && Math.floor(t * 2) % 2) U.text(Q.SCRIPT.postcredits && Q.SCRIPT.postcredits.length ? 'A: ONE MORE THING' : 'A: TITLE', 160, 176, '#c3c7d4', 1, 'center');   // A goes to the postcredits first
        },
        sides: function (g) {   // a wide screen's sides (the engine clips to them): the night sky with stars of its own, the roll's band at the foot; after it, the office carried out to the edges
          var t = CR.t, i, d;
          if (CR.phase === 'post') { if (Q.edges) Q.edges(g); return; }
          U.bands(g, SKY, 0, 10, Q.W);
          for (i = 0; i < SSTARS.length; i++) { d = SSTARS[i]; U.fill(g, d[0], d[1], 1, 1, Math.sin(t * 2 + d[2] * 1.3) > 0.5 ? '#ffffff' : '#4a5488'); }
          if (CR.phase === 'roll') { U.fill(g, 0, 186, Q.W, 14, SKY[SKY.length - 1]); U.fill(g, 0, 186, Q.W, 1, '#2a3878'); }
        }
      });
    })();
