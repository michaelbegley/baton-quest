    // ---------- 73-ui-map-compass-b.js (B24, 11 Nov 2026): THE COMPASS on the map: its corner, its first scene, the C button and the COMPASS CHECK (UI) ----------
    // The map (73-ui-map.js) calls four hooks: U.compassReset() as it enters; U.compassMap(dt) each step while he stands (true: it took the step); U.compassMapDraw
    // (g, t, 0) before the text box and (g, t, 1) after it; and U.compassIsOpen() (the bar at the bottom steps aside while the check is open).
    // The corner: the Compass stands in the map's top left corner (as a compass rose sits in a map's corner), its needle up and still (sure), or wobbling once the
    // play time since anything new passes ten minutes (drift); under it a C key cap: the prompt. C opens the COMPASS CHECK: C on a keyboard (or L), C on the
    // handheld, the left or top button or a bumper on a controller (the map had no use for C: C is the dash, and nobody dashes on a map). B closes it (C, A or Start too).
    // The check: B20's window (71-ui-menu.js) with brass brackets, docked at the top when the spot is low on the map, else at the bottom, so the spot stays in sight
    // (B28: docked at the top, a tall one rises over the HUD's band as far as it must to end above the low stops' chips, their numbers and ticks).
    // Its needle turns slowly (reading) while the four lines come in, then swings to the one thing next, and the spot blinks in yellow brackets. It saves only its record.
    (function () {
      var U = Q.ui, CP = U.cp, K = U.mk, CK = { open: false, t: 0, lines: null, next: null, dock: 'top', meet: null, ang: 0, want: 0, vel: 0, at0: 0, drift: false, driftAt: -9 };
      var CX = 4, CY = 20;   // the corner compass's top left (the glass's middle is 7, 9 from there)
      var TOP = 17, PX = 4, PW = 312, CPX = PX + 6, TX = PX + 46, VX = TX + 48, RX = PX + PW - 6;   // the check: under the HUD at the top, as wide as the map's bar;
      var ROWW = Math.floor((RX - VX + 1) / 6), NEXTW = Math.floor((RX - 4 - TX + 1) / 6);   // its compass, labels, words and right edge: 35 letters a line, 42 in the bar
      var CHIP = 144 - 36 - 12 - 4;   // B28: a docked-top check ends by here, above the low stops' chips (73-ui-map-art.js: 32 by 24, centred 36 above a pad at 144; its tick from 93)
      function now() { return U.now(); }
      function spot(at) {   // a stop's place on the map (the middle of where one stands), or null
        var n = at === 'here' ? (U.mapAt ? U.mapAt().stop : 1) : at, p = n === null || n === undefined || !U.mapSpot ? null : U.mapSpot(n);
        return p && p.shown ? { x: p.x, y: p.y - 10, n: n } : null;
      }
      function aim(gx, gy, p) { return p ? Math.atan2(p.x - gx, -(p.y - gy)) : 0; }   // the needle's angle from a glass at gx, gy to p (0 up, clockwise)
      function turnTo(a, b) { var d = (b - a) % (Math.PI * 2); if (d > Math.PI) d -= Math.PI * 2; if (d < -Math.PI) d += Math.PI * 2; return d; }
      U.compassIsOpen = function () { return CK.open; };
      U.compassReset = function () { CK.open = false; CK.meet = null; };
      // ---- the check: worked out once as it opens; its record then holds what it saw ----
      function check() {
        var s = Q.SAVE, r = CP.rec(true), f = CP.facts(s), dr = CP.drifted(r, s, f), nx = CP.next(s), p;
        CK.lines = { moved: CP.moved(r, f), slipped: CP.slipped(s), drifted: dr.text, next: nx.text };
        CK.next = nx; p = spot(nx.at);
        CK.dock = p && p.y + 10 >= 120 ? 'top' : 'bottom';
        r.seen = { levels: f.levels, memos: f.memos, cats: f.cats, secrets: f.secrets, stars: f.stars, lv: f.lv, won: f.won, saved: f.saved };
        r.at = +s.time || 0;
        if (dr.first) { r.lvN = f.levels; r.lvAt = r.at; r.newN = f.levels + f.secrets + f.stars; r.newAt = r.at; }   // a file from before: measured from now on
        if (dr.drift) r.warned = dr.base;   // said once; the next check says YOUR CALL
        U.compassKeep();
        return true;
      }
      function openCheck() { check(); CK.open = true; CK.t = 0; CK.ang = 0; CK.vel = 0; CK.want = 0; K.reopen('compass'); K.snd('open'); }
      function closeCheck() { CK.open = false; K.snd('back'); }
      // ---- the step: the first scene, then C ----
      U.compassMap = function (dt) {
        var r;
        if (CK.open) {
          CK.t += dt;
          if (CK.t > 0.15 && (U.press('b') || U.press('c') || U.press('a') || U.press('start'))) closeCheck();
          return true;
        }
        r = CP.rec(true);
        if (r && !r.met && Q.SCRIPT['compass-meet']) {   // the first time this file opens the map: once (kept in the record at once, so it never plays twice)
          r.met = 1; U.compassKeep();
          CK.meet = { cue: '', at: now(), lineAt: now() };
          Q.say('compass-meet', function () { CK.meet = null; }, function (i, line) { if (CK.meet) { if (line.cue) { CK.meet.cue = line.cue; CK.meet.at = now(); } CK.meet.lineAt = now(); } });
          return true;
        }
        if (U.press('c')) { openCheck(); return true; }
        return false;
      };
      // ---- the needle: a spring toward where it wants to be (a slow turn while it reads) ----
      function needle(dt, want, reading) {
        if (reading) { CK.ang += dt * 4.2; CK.vel = 4.2; return CK.ang; }
        var d = turnTo(CK.ang, want);
        CK.vel += (d * 90 - CK.vel * 11) * dt; CK.ang += CK.vel * dt;
        return CK.ang;
      }
      // ---- drawing ----
      function keycap(g, x, y) { U.box(g, x, y, 11, 11, '#d9a83a', '#2a2210'); U.text('C', x + 3, y + 2, '#ffe9a0'); }
      function brackets(g, x, y, w, h, col) {
        var a = 5;
        U.fill(g, x, y, a, 1, col); U.fill(g, x, y, 1, a, col); U.fill(g, x + w - a, y, a, 1, col); U.fill(g, x + w - 1, y, 1, a, col);
        U.fill(g, x, y + h - 1, a, 1, col); U.fill(g, x, y + h - a, 1, a, col); U.fill(g, x + w - a, y + h - 1, a, 1, col); U.fill(g, x + w - 1, y + h - a, 1, a, col);
      }
      function marker(g, p, t) {   // the spot it points at: yellow brackets round the stop (its chip or sign and its pad), blinking
        if (!p || Math.floor(t * 3) % 3 === 2) return;
        brackets(g, p.x - 21, p.y - 44, 42, 53, '#1d1d24'); brackets(g, p.x - 20, p.y - 45, 40, 53, '#ffd23f');
      }
      function corner(g, t) {   // the Compass in its corner and the C under it, or its first scene
        var m = CK.meet, a = 0, k, by, p;
        if (m) {
          k = now() - m.at;
          if (m.cue === 'box' || !m.cue) {   // a small box comes up and lands, marked THIS WAY UP
            by = m.cue ? Math.min(CY + 6, -14 + k * 160) : -20;
            if (m.cue && k > 0.25 && k < 0.4) by -= 2;
            Q.spr(g, 'compass-box', 0, CX, Math.round(by));
            return;
          }
          if (m.cue === 'open') {   // it opens; the Compass rises out of it, its needle turning: reading
            if (k < 0.7) { g.globalAlpha = Q.clamp(1 - k / 0.7, 0, 1); Q.spr(g, 'compass-box', 1, CX, CY + 6 + Math.round(k * 10)); g.globalAlpha = 1; }
            Q.art.compass(g, CX, CY + Math.max(0, Math.round(6 - k * 12)), now() * 2.6, 1);
            return;
          }
          if (m.cue === 'point') { p = spot(CP.next(Q.SAVE).at); a = aim(CX + 7.5, CY + 9.5, p); marker(g, p, t); }
          Q.art.compass(g, CX, CY, a + (m.cue === 'point' ? Math.sin(Math.max(0, 0.6 - k) * 18) * Math.max(0, 0.6 - k) * 0.5 : 0), 1);
          return;
        }
        if (now() - CK.driftAt > 1) { CK.drift = CP.drifting(); CK.driftAt = now(); }   // looked at once a second
        Q.art.compass(g, CX, CY, CK.drift ? Math.sin(now() * 9) * 0.45 : 0, 1);
        if (!Q.talking()) keycap(g, CX + 2, CY + 21 + (Math.floor(t * 2) % 2));
      }
      function panel(g, t, dt) {
        var L = CK.lines, rows = [], i, j, h, top, nx, p = spot(CK.next && CK.next.at);
        rows.push(['MOVED', Q.wrap(L.moved, ROWW)], ['SLIPPED', Q.wrap(L.slipped, ROWW).slice(0, 2)], ['DRIFTED', Q.wrap(L.drifted, ROWW)]);
        nx = Q.wrap('ONE THING NEXT  ' + L.next, NEXTW).slice(0, 2);
        for (i = 0, j = 0; i < rows.length; i++) j += rows[i][1].length;
        h = 19 + 3 + j * 10 + 3 + nx.length * 9 + 6 + 5;
        top = CK.top = CK.dock === 'top' ? Math.max(1, Math.min(TOP, CHIP - h)) : 197 - h;   // B28: a tall one rises over the HUD, so the chip it points at stays in sight
        CK.h = h;
        CK.want = aim(CPX + 15, top + 41, p);   // from the middle of its glass at twice its size
        needle(dt, CK.want, CK.t < 0.7);
        if (CK.t >= 0.7) marker(g, p, t);
        K.window(g, PX, top, PW, h, 'COMPASS CHECK', 'compass', function (inner) {
          var yy = inner.top + 3, n = 0;
          U.text('B: CLOSE', PX + PW - 18, top + 5, K.C.muted, 1, 'right');
          Q.art.compass(g, CPX, inner.top + 3, CK.ang, 2);
          for (i = 0; i < rows.length; i++) {
            if (CK.t < 0.12 + i * 0.13) break;   // the lines come in one at a time while it reads
            U.text(rows[i][0], TX, yy, '#e8c46a');
            for (j = 0; j < rows[i][1].length; j++) U.text(rows[i][1][j], VX, yy + j * 10, '#f6efe2');
            yy += rows[i][1].length * 10; n++;
          }
          if (n === rows.length && CK.t >= 0.6) {
            K.bar(g, TX - 4, yy + 5, RX - (TX - 4), { h: nx.length * 9 + 4 });
            for (j = 0; j < nx.length; j++) {   // its label in brown on the bar, the answer in ink
              if (j === 0 && nx[0].indexOf('ONE THING NEXT') === 0) { U.text('ONE THING NEXT', TX, yy + 5, '#7a4a12'); U.text(nx[0].slice(14), TX + 84, yy + 5, '#0b0c10'); }
              else U.text(nx[j], TX, yy + 5 + j * 9, '#0b0c10');
            }
          }
        }, { accent: '#d9a83a' });
      }
      var lastT = -1;
      U.compassMapDraw = function (g, t, layer) {
        var dt = lastT < 0 ? 0 : Q.clamp(now() - lastT, 0, 0.05);
        if (layer === 0) { if (!CK.open) corner(g, t); return; }
        lastT = now();
        if (CK.open && CK.lines) panel(g, t, dt);
      };
      // ---- for checks (99-main.js cheat.compass): its state, and a few moves a check needs ----
      U.compassCheat = function (what) {
        var r = CP.rec(false), p = CK.next ? spot(CK.next.at) : null;
        if (what === 'map') { Q.go('map'); return Q.scene; }
        if (what === 'new') { Q.newGame(); Q.go('map'); return Q.scene; }
        if (what === 'forget') { if (Q.SAVE) delete Q.SAVE.compass; CK.meet = null; return true; }
        if (what === 'open') { if (Q.scene !== 'map' || CK.open || Q.talking()) return false; openCheck(); return true; }
        if (what === 'close') { if (CK.open) closeCheck(); return true; }
        return { scene: Q.scene, open: CK.open, t: Math.round(CK.t * 100) / 100, lines: CK.lines, next: CK.next, spot: p, dock: CK.dock, top: CK.top, bottom: CK.top === undefined ? null : CK.top + CK.h, glass: CK.top === undefined ? null : { x: CPX + 15, y: CK.top + 41 }, angle: Math.round(CK.ang * 1000) / 1000,
          want: Math.round(CK.want * 1000) / 1000, meet: CK.meet ? CK.meet.cue : null, talk: U.talkAt ? U.talkAt() : null, rec: r ? JSON.parse(JSON.stringify(r)) : null,
          drifting: CP.drifting(), stopAt: U.mapAt ? U.mapAt() : null, name: U.whoName('compass'), face: U.whoFace('compass') };
      };
    })();
