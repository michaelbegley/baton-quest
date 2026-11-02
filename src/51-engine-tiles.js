    // ---------- 51-engine-tiles.js (ENGINE): a level's map, Q.tile, Q.setTile, Q.solid, Q.findTiles, Q.move, and drawing the tiles ----------
    // A map character is read as: a base character (QUEST-API part 5), else the world's Q.defTile table (then world 0's), else the level's legend (an enemy).
    // Placed things (S Z R @ o O h m and the legend's enemies) leave the map when it loads; Q.findTiles still finds where they were.
    // Signs and memos are counted column by column: left to right, and top to bottom within a column.
    var engTW = 0, engTH = 0, engMap = null, engInfo = null, engTI = {}, engWorld = 0, engSpots = null;
    var ENG_BASE = {
      '#': { solid: true, art: 'solid', auto: true, col: '#6b5a48' },
      '=': { oneWay: true, art: 'oneway', col: '#d8c08a' },
      '^': { hurt: 1, spike: true, art: 'spike', col: '#dfe3ea' },
      'X': { solid: true, breakBy: 'baton', art: 'crate', col: '#a8703e', drop: true },
      'P': { solid: true, breakBy: 'pound', art: 'pound', col: '#8a8a9c' },
      'E': { obj: 'door' }, 'K': { obj: 'mug', save: true }, 'k': { check: true }, '!': { obj: 'sign', sign: true }, 'D': { obj: 'secret', secret: true }
    };
    var ENG_PLACED = { S: 1, Z: 1, R: 1, '@': 1, o: 1, O: 1, h: 1, m: 1 };
    function engOwn(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
    function engPick(a, b) { return engOwn(Q.SPRITE, a) ? a : engOwn(Q.SPRITE, b) ? b : null; }

    function engResolve(ch) {   // what a character is in this level's world (one shared object per character)
      if (engOwn(engTI, ch)) return engTI[ch];
      var t = null, b = ENG_BASE[ch], wd = Q.TILEDEF[engWorld], zd = Q.TILEDEF[0], d = null, k;
      if (ch === ' ' || ch === '.') t = null;
      else if (b) {
        t = {}; for (k in b) t[k] = b[k];
        if (t.art) t.spr = engPick('t' + engWorld + '-' + t.art, 't0-' + t.art);
        if (t.secret) { d = engOwn(wd, ch) ? wd[ch] : engOwn(zd, ch) ? zd[ch] : null; if (d && d.art && engOwn(Q.SPRITE, d.art)) { t.spr = d.art; t.frame = d.frame | 0; t.fps = +d.fps || 0; } }   // part 13, 26
      } else {
        d = engOwn(wd, ch) ? wd[ch] : engOwn(zd, ch) ? zd[ch] : null;
        if (d) t = { solid: !!d.solid, oneWay: !d.solid && !!d.oneWay, hurt: d.hurt ? (+d.hurt > 0 ? +d.hurt : 1) : 0, breakBy: d.breakBy || null,
                     spr: d.art && engOwn(Q.SPRITE, d.art) ? d.art : null, frame: d.frame | 0, fps: +d.fps || 0, col: d.solid ? '#6b5a48' : d.oneWay ? '#d8c08a' : null, def: d };
      }
      if (t) { t.sheet = t.spr ? engSheet(t.spr) : null; t.frame = t.frame | 0; }
      engTI[ch] = t;
      return t;
    }

    function engLoadMap(lv, id) {   // the live map for a level: engMap (characters) and engInfo (what each one is)
      var map = lv.map && lv.map.length ? lv.map : ['                    ', '  S              E  ', '####################'];
      var th = map.length, tw = 0, x, y, ch, i, t, legend = lv.legend || {}, sp;
      for (y = 0; y < th; y++) tw = Math.max(tw, String(map[y]).length);
      engTW = tw; engTH = th; engWorld = lv.world || 0; engTI = {};
      engMap = new Array(tw * th); engInfo = new Array(tw * th);
      sp = engSpots = { start: null, boss: null, agent: null, checks: [], signs: [], doors: [], put: [], was: {} };
      for (x = 0; x < tw; x++) for (y = 0; y < th; y++) {
        ch = String(map[y]).charAt(x) || ' '; i = y * tw + x;
        if (ENG_PLACED[ch]) {
          (sp.was[ch] || (sp.was[ch] = [])).push({ tx: x, ty: y });
          if (ch === 'S') { if (!sp.start) sp.start = { tx: x, ty: y }; }
          else if (ch === 'Z') sp.boss = { tx: x, ty: y };
          else if (ch === 'R') sp.agent = { tx: x, ty: y };
          else sp.put.push({ ch: ch, tx: x, ty: y });
          ch = ' ';
        }
        t = engResolve(ch);
        if (!t && ch !== ' ' && ch !== '.') {
          (sp.was[ch] || (sp.was[ch] = [])).push({ tx: x, ty: y });
          if (engOwn(legend, ch)) sp.put.push({ ch: ch, tx: x, ty: y, enemy: legend[ch] });
          else engWarnOnce('level ' + id + ': "' + ch + '" is not a tile of world ' + engWorld + ' or in the legend');
          ch = ' ';
        }
        if (ch === '!') sp.signs.push({ tx: x, ty: y });
        if (ch === 'K' || ch === 'k') sp.checks.push({ tx: x, ty: y, save: ch === 'K' });
        if (ch === 'E') sp.doors.push({ tx: x, ty: y });
        engMap[i] = ch; engInfo[i] = t;
      }
    }

    Q.tile = function (tx, ty) {
      tx = Math.floor(tx); ty = Math.floor(ty);
      if (!engMap || tx < 0 || ty < 0 || tx >= engTW || ty >= engTH) return ' ';
      return engMap[ty * engTW + tx];
    };
    Q.setTile = function (tx, ty, ch) {
      tx = Math.floor(tx); ty = Math.floor(ty);
      if (!engMap || tx < 0 || ty < 0 || tx >= engTW || ty >= engTH) return false;
      ch = String(ch === undefined || ch === null ? ' ' : ch).charAt(0) || ' ';
      var i = ty * engTW + tx; engMap[i] = ch; engInfo[i] = engResolve(ch);
      return true;
    };
    function engSolidT(tx, ty) {   // a solid tile; the level's sides are walls, below it is open, above it is as its top row
      if (!engInfo) return false;
      if (tx < 0 || tx >= engTW) return true;
      if (ty >= engTH) return false;
      if (ty < 0) ty = 0;
      var t = engInfo[ty * engTW + tx]; return !!(t && t.solid);
    }
    function engOneWayT(tx, ty) {
      if (!engInfo || tx < 0 || tx >= engTW || ty < 0 || ty >= engTH) return false;
      var t = engInfo[ty * engTW + tx]; return !!(t && t.oneWay);
    }
    function engInfoT(tx, ty) { return !engInfo || tx < 0 || tx >= engTW || ty < 0 || ty >= engTH ? null : engInfo[ty * engTW + tx]; }
    Q.solid = function (px, py) { return engSolidT(Math.floor(px / 16), Math.floor(py / 16)); };
    Q.findTiles = function (ch) {
      var out = [], i, k;
      if (!engMap) return out;
      if (engSpots && engSpots.was[ch]) { for (k = 0; k < engSpots.was[ch].length; k++) out.push({ tx: engSpots.was[ch][k].tx, ty: engSpots.was[ch][k].ty }); return out; }
      for (i = 0; i < engMap.length; i++) if (engMap[i] === ch) out.push({ tx: i % engTW, ty: Math.floor(i / engTW) });
      return out;
    };

    // ---------- Q.move: X then Y against the tiles. It stops the body on what it hits (vx = 0 at a wall, vy = 0 on the ground or a ceiling),
    // or turns it back by e.bounce (0 to 1) if set; thin platforms hold a body falling onto them unless e.drop. ----------
    function engStopX(e) { e.vx = e.bounce ? -e.vx * e.bounce : 0; }
    function engStopY(e) { e.vy = e.bounce && Math.abs(e.vy) > 40 ? -e.vy * e.bounce : 0; }
    function engMoveX(e, dx) {
      var T = 16, ty0 = Math.floor(e.y / T), ty1 = Math.floor((e.y + e.h - 0.01) / T), tx, ty, a, b;
      if (dx > 0) {
        a = Math.floor((e.x + e.w - 0.01) / T) + 1; b = Math.floor((e.x + e.w + dx - 0.01) / T);
        for (tx = a; tx <= b; tx++) for (ty = ty0; ty <= ty1; ty++) if (engSolidT(tx, ty)) { e.x = tx * T - e.w; e.wallR = true; engStopX(e); return; }
      } else {
        a = Math.floor(e.x / T) - 1; b = Math.floor((e.x + dx) / T);
        for (tx = a; tx >= b; tx--) for (ty = ty0; ty <= ty1; ty++) if (engSolidT(tx, ty)) { e.x = (tx + 1) * T; e.wallL = true; engStopX(e); return; }
      }
      e.x += dx;
    }
    function engMoveY(e, dy) {
      var T = 16, tx0 = Math.floor(e.x / T), tx1 = Math.floor((e.x + e.w - 0.01) / T), tx, ty, a, b;
      if (dy > 0) {
        a = Math.floor((e.y + e.h - 0.01) / T) + 1; b = Math.floor((e.y + e.h + dy - 0.01) / T);
        for (ty = a; ty <= b && ty < engTH; ty++) for (tx = tx0; tx <= tx1; tx++) {
          if (engSolidT(tx, ty) || (!e.drop && engOneWayT(tx, ty))) { e.y = ty * T - e.h; e.ground = true; engStopY(e); return; }
        }
      } else {
        a = Math.floor(e.y / T) - 1; b = Math.floor((e.y + dy) / T);
        for (ty = a; ty >= b; ty--) for (tx = tx0; tx <= tx1; tx++) if (engSolidT(tx, ty)) { e.y = (ty + 1) * T; e.ceil = true; engStopY(e); return; }
      }
      e.y += dy;
    }
    Q.move = function (e, dt) {
      e.ground = false; e.wallL = false; e.wallR = false; e.ceil = false;
      var dx = (e.vx || 0) * dt, dy = (e.vy || 0) * dt;
      if (!engInfo) { e.x += dx; e.y += dy; return; }
      if (dx) engMoveX(e, dx);
      if (dy) engMoveY(e, dy);
    };

    function engBreakTile(tx, ty, how) {   // a crate (the baton, a note or a pound) or a pound block (a pound only)
      var t = engInfoT(tx, ty);
      if (!t || !t.breakBy || (t.breakBy === 'pound' && how !== 'pound')) return false;
      Q.setTile(tx, ty, ' ');
      var cx = tx * 16 + 8, cy = ty * 16 + 8;
      Q.fx('debris', cx, cy, { col: t.col }); Q.fx('dust', cx, cy + 6); Q.sfx('break'); Q.shake(1, 0.08);
      if (t.drop && Q.rand() < 0.35) Q.spawn('pickup', cx - 4, cy - 4, { kind: 'token', vx: (Q.rand() - 0.5) * 60, vy: -170 });
      return true;
    }
    function engBreakBox(b, how) {   // every breakable tile a box touches
      var n = 0, tx, ty;
      for (ty = Math.floor(b.y / 16); ty <= Math.floor((b.y + b.h - 0.01) / 16); ty++)
        for (tx = Math.floor(b.x / 16); tx <= Math.floor((b.x + b.w - 0.01) / 16); tx++) if (engBreakTile(tx, ty, how)) n++;
      return n;
    }

    // ---------- drawing: only the tiles on screen, each with its world's sprite (t<N>-, then t0-, then plain colour) ----------
    function engDrawPlain(g, t, x, y) {
      g.fillStyle = t.col;
      if (t.oneWay) { g.fillRect(x, y, 16, 4); g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x, y + 3, 16, 1); }
      else if (t.spike) { for (var k = 0; k < 4; k++) { g.fillRect(x + k * 4 + 1, y + 10, 2, 6); g.fillRect(x + k * 4 + 1 + 0.5, y + 8, 1, 2); } }
      else {
        g.fillRect(x, y, 16, 16); g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(x, y, 16, 2); g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x, y + 14, 16, 2);
        if (t.breakBy) { g.fillStyle = 'rgba(0,0,0,0.35)'; for (var j = 2; j < 14; j++) { g.fillRect(x + j, y + j, 1, 1); g.fillRect(x + 15 - j, y + j, 1, 1); } }
      }
    }
    function engDrawTiles(g, doorOpen) {
      if (!engInfo) return;
      var T = 16, cx = Q.cam.x, cy = Q.cam.y, now = Q.t;
      var x0 = Math.max(0, Math.floor(cx / T)), x1 = Math.min(engTW - 1, Math.floor((cx + Q.W - 1) / T));
      var y0 = Math.max(0, Math.floor(cy / T)), y1 = Math.min(engTH - 1, Math.floor((cy + Q.H - 1) / T) + 1), tx, ty, i, t, f, sx, sy, up;
      for (ty = y0; ty <= y1; ty++) {
        sy = ty * T - cy; i = ty * engTW + x0;
        for (tx = x0; tx <= x1; tx++, i++) {
          t = engInfo[i]; if (!t) continue;
          sx = tx * T - cx;
          if (t.obj) {
            if (t.obj === 'door') Q.spr(g, 'door', doorOpen === i ? 1 : 0, sx, sy - 8);
            else if (t.obj === 'mug') Q.spr(g, 'mug', Math.floor(now * 3), sx, sy);
            else if (t.obj === 'secret') {   // the world's own secret door, else a faint door in the wall
              if (t.sheet) engBlit(g, t.sheet, t.fps ? t.frame + Math.floor(now * t.fps) : t.frame, sx, sy + 16 - t.sheet.h, false, false);
              else { g.globalAlpha = 0.28; Q.spr(g, 'door', 0, sx, sy - 8); g.globalAlpha = 1; }
            }
            else Q.spr(g, 'sign', 0, sx, sy);
            continue;
          }
          if (t.sheet) {
            if (t.auto) { up = ty > 0 ? engInfo[i - engTW] : null; f = up && up.solid ? 1 : 0; }
            else f = t.fps ? t.frame + Math.floor(now * t.fps) : t.frame;
            engBlit(g, t.sheet, f, sx, sy, false, false);
          } else if (t.col) engDrawPlain(g, t, sx, sy);
        }
      }
    }
