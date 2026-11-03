    // ---------- 79-ui-card.js: the level cards (UI, builder 5) ----------
    // When a level starts (the HUD sees Q.level's id change), a band slides in across the top third for about 2 s: the world and level number and its name
    // (1-2  THE SORTING FLOOR); on a world's first level a bigger card comes first (WORLD 2 / THE SERVER ROOM). Never over a text box: a card waits while
    // one is up and comes after it (a boss arena's card is dropped if its intro talks first: the intro is its card). Only while the level plays.
    // Version 116 (part 14.3): once he has a best there, the level card shows BEST and PAR as m:ss under the name, gold with a clock when at or under par.
    (function () {
      var U = Q.ui, C = { level: '', list: [], cur: null, t: 0, at: -1, wait: 0, arena: false };
      function number(lv) {   // '1-2', '1-BOSS', or '' for a level in no world
        var w = Q.WORLD[lv.world], i = w && w.levels ? w.levels.indexOf(lv.id) : -1, m = /^w(\d)-(\d)$/.exec(lv.id);
        if (lv.bonus) return 'SECRET:';   // a secret level (part 13, 26): SECRET: THE SPAM FOLDER
        if (lv.root) return '/ROOT/' + (/(\d+)$/.exec(lv.id) || ['', '?'])[1];   // a room of THE ROOT FOLDER (part 14.6; its world is only for its tiles): /ROOT/1  OLD MAIL
        if (!lv.world) return '';
        if (lv.boss || (w && w.boss === lv.id)) return lv.world + '-BOSS';
        return lv.world + '-' + (i >= 0 ? i + 1 : m ? m[2] : '?');
      }
      function check() {
        var lv = Q.level, w, col;
        if (!lv || !lv.id) { C.level = ''; C.list = []; C.cur = null; C.wasBonus = false; return; }
        if (lv.id === C.level) return;
        var fromBonus = C.wasBonus; C.wasBonus = !!lv.bonus;
        C.level = lv.id; C.list = []; C.cur = null; C.wait = 0.35; C.arena = !!(lv.boss || (Q.WORLD[lv.world] && Q.WORLD[lv.world].boss === lv.id));
        if (fromBonus && !lv.bonus) return;   // back out of a secret level into the one he left: no card for that
        w = Q.WORLD[lv.world]; col = lv.root ? '#e2c78e' : lv.world ? U.worldCol(lv.world) : '#2ec4b6';
        if (lv.world && !lv.root && w && w.levels && w.levels[0] === lv.id) C.list.push({ big: true, a: 'WORLD ' + lv.world, b: U.worldName(lv.world), col: col, secs: 2.0 });
        C.list.push({ big: false, a: number(lv), b: String(lv.name || ''), col: col, secs: 2.0, times: times(lv.id) });
      }
      function times(id) {   // SPRINT REVIEW on the card (part 14.3): BEST and PAR as m:ss once he has a best; a clock when it is at or under par
        var b = U.best(id), p = U.par(id);
        return b ? { s: 'BEST ' + U.mss(b) + (p ? '   PAR ' + U.mss(p) : ''), under: U.underPar(id) } : null;
      }
      function tall() {   // a level taller than it is wide (a climb)
        var lv = Q.level, tw = lv && (lv.tw || (lv.map && lv.map[0] && lv.map[0].length)), th = lv && (lv.th || (lv.map && lv.map.length));
        return !!(tw && th && th > tw);
      }
      U.cardY = function () { return C.cur ? C.y : -1; };   // for checks: where the card showing is drawn
      U.cardNow = function () { return C.cur ? (C.cur.big ? 'world' : 'level') + ':' + C.cur.a : ''; };   // for checks
      U.cardTimes = function () { return C.cur && C.cur.times ? C.cur.times.s + (C.cur.times.under ? ' (UNDER PAR)' : '') : ''; };   // for checks
      U.card = function (g) {   // the HUD calls it every frame
        var now = U.now(), dt = C.at < 0 ? 0 : Q.clamp(now - C.at, 0, 0.05), c, off, h, y, wa, wb, x0, e, tw, W = Q.W, cx = Q.W >> 1;   // the band spans the screen, its words at its middle (320 and 160 on a 320 screen)
        C.at = now;
        check();
        if (Q.scene !== 'level' || (!C.cur && !C.list.length)) return;
        if (Q.talking()) { if (C.arena && !C.cur) C.list = []; C.wait = Math.max(C.wait, 0.3); return; }
        if (!C.cur) { C.wait -= dt; if (C.wait > 0) return; C.cur = C.list.shift() || null; C.t = 0; if (!C.cur) return; if (Q.SFX.card) Q.sfx('card'); }   // AUDIO's whoosh, when it is in
        C.t += dt; c = C.cur;
        if (C.t >= c.secs) { C.cur = null; C.wait = 0.15; return; }
        e = C.t < 0.3 ? 1 - C.t / 0.3 : c.secs - C.t < 0.3 ? -(1 - (c.secs - C.t) / 0.3) : 0;   // in from the left, out to the right
        off = e > 0 ? -Math.round(e * e * W) : Math.round(e * e * W);
        g.save(); g.translate(off, 0);
        if (tall()) {   // a climb: a slim band at the very bottom, so the ledges above him are never covered (the times after the name)
          h = 14; y = 186; U.fill(g, 0, y, W, h, '#121318'); U.fill(g, 0, y, W, 1, c.col);
          wa = c.big ? 0 : (c.a ? U.width(c.a) : 0); wb = U.width(c.big ? c.a + ': ' + c.b : c.b); tw = c.times ? U.width(c.times.s) + 12 + (c.times.under ? 11 : 0) : 0;
          x0 = cx - ((wa + (wa ? 6 : 0) + wb + tw) >> 1);
          if (wa) U.text(c.a, x0, y + 4, c.col);
          U.text(c.big ? c.a + ': ' + c.b : c.b, x0 + wa + (wa ? 6 : 0), y + 4, c.big ? c.col : '#f6efe2');
          if (tw) { x0 += wa + (wa ? 6 : 0) + wb + 12; U.text(c.times.s, x0, y + 4, '#9aa3ad'); if (c.times.under) U.clockIcon(g, x0 + U.width(c.times.s) + 3, y + 3, true); }
          g.restore(); C.y = y; return;
        }
        h = c.big ? 48 : c.times ? 36 : 26; y = c.big ? 30 : 38; C.y = y;
        U.fill(g, 0, y, W, h, '#121318'); U.fill(g, 0, y + 2, W, h - 4, '#191b24');
        U.fill(g, 0, y, W, 2, c.col); U.fill(g, 0, y + h - 2, W, 2, c.col);
        if (c.big) { U.text(c.a, cx, y + 7, c.col, 2, 'center'); U.text(c.b, cx, y + 24, '#f6efe2', 3, 'center'); }
        else {
          wa = c.a ? U.width(c.a, 2) : 0; wb = U.width(c.b, 2); x0 = cx - ((wa + (wa ? 12 : 0) + wb) >> 1);
          if (c.a) U.text(c.a, x0, y + 6, c.col, 2);
          U.text(c.b, x0 + wa + (wa ? 12 : 0), y + 6, '#f6efe2', 2);
          if (c.times) {   // BEST and PAR under the name, the clock after them when he made par
            tw = U.width(c.times.s) + (c.times.under ? 11 : 0); x0 = cx - (tw >> 1);
            U.text(c.times.s, x0, y + 25, c.times.under ? '#ffd23f' : '#9aa3ad');
            if (c.times.under) U.clockIcon(g, x0 + U.width(c.times.s) + 3, y + 24, true);
          }
        }
        g.restore();
      };
    })();
