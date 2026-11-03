    // ---------- 95-battle-draw.js: BATTLE MODE's picture of a fight (B16; BATTLE.md): the arena, the power-ups, the notes, the conductors, the sparks ----------
    // It only reads the match (M) and draws: the arena fits a 320 screen, so the view is fixed and no camera holds anything. On a wider screen (QUEST-API
    // part 15) the fight is a wide scene: the arena sits in the centred 320 column (Q.OX) and its world's background fills Q.W, with the camera at -Q.OX as
    // the level scene shows a narrow level. The background painter (Q.BG) reads Q.level for its look: for that one call Q.level is the arena's look, then back.
    BT.at320 = function (fn) {   // fn drawn as on a 320 screen (an offscreen picture: Q.W 320 and Q.OX 0 for its length, as inside Q.col, with no shift)
      var w = Q.W, ox = Q.OX;
      Q.W = 320; Q.OX = 0;
      try { fn(); } finally { Q.W = w; Q.OX = ox; }
    };
    BT.err = function (what, er) { Q.warn('ERROR in BATTLE ' + what + ': ' + (er && er.message ? er.message : er)); };
    var btTileCv = {}, btBubble = null, btFxl = [], btShake = { a: 0, t: 0 };
    function btBg(g, ar, t, camX, camY) {
      var bg = Object.prototype.hasOwnProperty.call(Q.BG, ar.def.bg) ? Q.BG[ar.def.bg] : null, keep = Q.level;
      if (!bg) { g.fillStyle = '#20262a'; g.fillRect(0, 0, Q.W, 200); return; }
      Q.level = ar.look;
      try { bg(g, camX || 0, camY || 0, t, Q); } catch (er) { BT.err('background ' + ar.def.bg, er); g.fillStyle = '#20262a'; g.fillRect(0, 0, Q.W, 200); }
      Q.level = keep;
    }
    function btTiles(ar) {   // the arena's still tiles, drawn once into a canvas of their own (the moving ones are drawn each frame)
      var cv = btTileCv[ar.id], c, x, y, i, a, f;
      if (cv) return cv;
      cv = btTileCv[ar.id] = Q.canvas(ar.tw * 16, ar.th * 16); c = cv.getContext('2d');
      for (y = 0; y < ar.th; y++) for (x = 0; x < ar.tw; x++) {
        i = y * ar.tw + x; a = ar.art[i]; if (!a || a.fps) continue;
        f = a.auto ? (y > 0 && ar.solid[i - ar.tw] ? 1 : 0) : a.frame;
        Q.spr(c, a.spr, f, x * 16, y * 16);
      }
      return cv;
    }
    BT.drawArena = function (g, ar, t, ox, oy) {   // the background, then the tiles; ox, oy: where the arena's top left is on the screen (the column's left, a shake)
      var x, y, i, a;
      btBg(g, ar, t, -(ox | 0), -(oy | 0));
      g.drawImage(btTiles(ar), ox | 0, oy | 0);
      for (y = 0; y < ar.th; y++) for (x = 0; x < ar.tw; x++) { a = ar.art[y * ar.tw + x]; if (a && a.fps) Q.spr(g, a.spr, a.frame + Math.floor(t * a.fps), x * 16 + (ox | 0), y * 16 + (oy | 0)); }
    };
    function btBubbleCv() {   // our own bubble a power-up floats in: a pale ring, a faint inside, a shine at the top left
      var c, x, y, d;
      if (btBubble) return btBubble;
      btBubble = Q.canvas(22, 22); c = btBubble.getContext('2d');
      for (y = 0; y < 22; y++) for (x = 0; x < 22; x++) {
        d = Math.sqrt((x - 10.5) * (x - 10.5) + (y - 10.5) * (y - 10.5));
        if (d <= 10.6 && d > 9.4) { c.fillStyle = 'rgba(214,236,255,0.95)'; c.fillRect(x, y, 1, 1); }
        else if (d <= 9.4) { c.fillStyle = 'rgba(150,196,255,0.22)'; c.fillRect(x, y, 1, 1); }
      }
      c.fillStyle = '#ffffff'; c.fillRect(5, 5, 3, 2); c.fillRect(5, 7, 1, 1);
      return btBubble;
    }
    BT.drawItem = function (g, kind, x, y, t) {   // a power-up at its top left (a 14 by 14 box), in its bubble
      var d = BT.ITEMS[kind], s, w, h;
      g.drawImage(btBubbleCv(), Math.round(x) - 4, Math.round(y) - 4);
      if (!d) return;
      if (!d.spr && Q.ui.metronome) { Q.ui.metronome(g, Math.round(x) + 1, Math.round(y), t); return; }
      s = Q.SPRITE[d.spr]; w = s ? s.w : 8; h = s ? s.h : 8;
      Q.spr(g, d.spr, Math.floor(t * 3), Math.round(x + 7 - w / 2), Math.round(y + 7 - h / 2));
    };
    BT.tagOf = function (c) { return c.who === 'cpu' ? 'CPU' : 'P' + (c.i + 1); };
    function btDrawC(g, c, t, ox, oy) {
      var H = Q.HERO, col = BT.COLS[c.col] || BT.COLS[0], x, y, b, bx, by, fr, on, gx, gy;
      if (c.out || c.gone) return;
      x = Math.round(c.x) - 3 + ox; y = Math.round(c.y) + c.h - 20 + oy;
      if (!(c.safe > 0 && Math.floor(c.safe * 14) % 2 === 1)) {   // blinking just after he comes back
        Q.spr(g, BT.spr(c.col), c.frame, x, y, c.face < 0);
        if (c.charged || c.chargeT > 0.15) {   // the baton glows, brighter when charged
          on = Math.floor(t * 14) % 2; gx = c.face < 0 ? x - 1 : x + 15; gy = y + 8;
          g.fillStyle = c.charged ? (on ? '#ffffff' : '#ffd23f') : 'rgba(255,210,63,0.6)'; g.fillRect(gx, gy, 2, 2);
        }
        if (c.buff.baton > 0 && Math.floor(t * 8) % 2) { g.fillStyle = '#ffd23f'; g.fillRect(c.face < 0 ? x - 2 : x + 16, y + 6, 2, 2); }   // BIGGER BATON: its tip sparkles
        if (c.swingT > H.SWING_T - 0.12) {   // the swing's smear, as long as its box
          b = BT.swingBox(c); bx = Math.round(b.x) + ox; by = Math.round(b.y) + oy; fr = c.face > 0;
          g.fillStyle = 'rgba(255,255,255,0.75)';
          g.fillRect(fr ? bx + b.w - 10 : bx + 4, by + 1, 6, 1); g.fillRect(fr ? bx + b.w - 6 : bx + 2, by + 3, 3, 3);
          g.fillRect(fr ? bx + b.w - 4 : bx + 1, by + 6, 2, 5); g.fillRect(fr ? bx + b.w - 6 : bx + 2, by + 11, 3, 2);
        }
      }
      gx = Math.round(c.x + c.w / 2) + ox; gy = Math.max(2, y - 11);   // his pointer; the tag over it is drawn by btDrawTags (stacked clear of the others)
      g.fillStyle = col.main; g.fillRect(gx - 1, gy + 8, 3, 1); g.fillRect(gx, gy + 9, 1, 1);
    }
    function btDrawTags(g, list, ox, oy) {   // who is who: a tag in his colour over his head; tags that would overlap stack upwards, so each stays readable
      var placed = [], i, j, k, c, p, tag, tw, x, y, col, hit;
      for (i = 0; i < list.length; i++) {
        c = list[i]; if (c.out || c.gone) continue;
        tag = BT.tagOf(c); tw = Q.ui.width(tag); col = BT.COLS[c.col] || BT.COLS[0];
        x = Math.round(c.x + c.w / 2) + ox - (tw >> 1); y = Math.max(2, Math.round(c.y) + c.h - 31 + oy);
        for (k = 0; k < 4; k++) {
          hit = false;
          for (j = 0; j < placed.length; j++) { p = placed[j]; if (x < p.x + p.w + 2 && p.x < x + tw + 2 && y < p.y + 9 && p.y < y + 9) { hit = true; break; } }
          if (!hit || y - 9 < 2) break;
          y -= 9;
        }
        placed.push({ x: x, y: y, w: tw });
        Q.ui.text(tag, x + 1, y + 1, '#0b0c10'); Q.ui.text(tag, x, y, c.who === 'cpu' ? col.light : col.main);
      }
    }
    BT.drawFight = function (g, M, t) {   // the whole screen of a fight (the HUD and the words come from 95-battle-draw-b.js)
      var ar = BT.arenaOf(M.arena), ox = Q.OX, oy = 0, i, n, it, c, order = [];   // the arena in the centred column on a wide screen
      if (btShake.t > 0) { ox += Math.round((Math.random() * 2 - 1) * btShake.a); oy = Math.round((Math.random() * 2 - 1) * btShake.a); }
      BT.drawArena(g, ar, t, ox, oy);
      for (i = 0; i < M.items.length; i++) { it = M.items[i]; if (!it.dead) BT.drawItem(g, it.kind, it.x + ox, it.y + oy, t + it.ph); }
      for (i = 0; i < M.notes.length; i++) {
        n = M.notes[i]; if (n.dead) continue;
        if (n.big) { g.fillStyle = 'rgba(255,210,63,0.45)'; g.fillRect(Math.round(n.x) - 1 + ox, Math.round(n.y) - 1 + oy, 10, 10); }
        Q.spr(g, 'note', Math.floor(n.t * 10), Math.round(n.x) + ox, Math.round(n.y) + oy, n.vx < 0);
      }
      for (i = 0; i < M.cs.length; i++) order.push(M.cs[i]);
      order.sort(function (a, b) { return (a.who === 'cpu' ? 0 : 1) - (b.who === 'cpu' ? 0 : 1) || a.i - b.i; });   // people over CPUs
      for (i = 0; i < order.length; i++) { c = order[i]; try { btDrawC(g, c, t, ox, oy); } catch (er) { BT.err('draw of a conductor', er); } }
      btDrawTags(g, order, ox, oy);
      btFxDraw(g, ox, oy);
    };
    // ---------- sparks of the battle's own (the engine's particles belong to its level scene) ----------
    function btPart(x, y, vx, vy, life, col, s, gr, ring, text) {
      var p = btFxl.length < 260 ? {} : btFxl.shift();
      p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.life = life; p.max = life; p.col = col; p.s = s; p.g = gr || 0; p.ring = ring || 0; p.text = text || '';
      btFxl.push(p);
    }
    BT.fx = function (kind, x, y, col, n) {   // 'dust', 'hit', 'big', 'pop', 'confetti', 'splash' (a fall, in his colour), 'text' (n is the words)
      var i, a, sp;
      if (kind === 'dust') for (i = 0; i < (n || 3); i++) btPart(x + (Math.random() - 0.5) * 6, y - 1, (Math.random() - 0.5) * 50, -8 - Math.random() * 22, 0.3 + Math.random() * 0.2, i % 2 ? '#ece5d6' : '#c9bfae', 2, -20);
      else if (kind === 'hit' || kind === 'big') {
        for (i = 0; i < (kind === 'big' ? 10 : 6); i++) { a = i / 6 * 6.283 + Math.random() * 0.5; sp = 90 + Math.random() * 70; btPart(x, y, Math.cos(a) * sp, Math.sin(a) * sp, 0.14 + Math.random() * 0.1, i % 2 ? '#ffffff' : col || '#ffd23f', 2, 0); }
        btPart(x, y, 0, 0, 0.14, '#ffffff', 1, 0, kind === 'big' ? 2 : 1);
      } else if (kind === 'pop') { for (i = 0; i < 8; i++) { a = i / 8 * 6.283; btPart(x, y, Math.cos(a) * 70, Math.sin(a) * 70, 0.28, col || '#f6efe2', 2, 0); } btPart(x, y, 0, 0, 0.2, '#ffffff', 1, 0, 2); }
      else if (kind === 'confetti') for (i = 0; i < (n || 30); i++) btPart(x + (Math.random() - 0.5) * 10, y, (Math.random() - 0.5) * 180, -100 - Math.random() * 140, 1.2 + Math.random() * 0.8, ['#2ec4b6', '#ff8a1e', '#ffd23f', '#e0446a', '#9068e6', '#f6efe2'][i % 6], 2, 260);
      else if (kind === 'splash') for (i = 0; i < 18; i++) btPart(x + (Math.random() - 0.5) * 14, 198, (Math.random() - 0.5) * 60, -160 - Math.random() * 160, 0.6 + Math.random() * 0.3, i % 3 ? col : '#ffffff', 2, 420);
      else if (kind === 'text') btPart(x, y, 0, -26, 0.9, col || '#ffffff', 1, 0, 0, String(n));
    };
    BT.fxStep = function (dt) {
      var i, p;
      for (i = btFxl.length - 1; i >= 0; i--) { p = btFxl[i]; p.life -= dt; if (p.life <= 0) { btFxl.splice(i, 1); continue; } p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
      if (btShake.t > 0) btShake.t -= dt;
    };
    BT.fxClear = function () { btFxl.length = 0; btShake.t = 0; };
    BT.shake = function (a, t) { if (a >= btShake.a || btShake.t <= 0) { btShake.a = a; btShake.t = t; } };
    BT.drawFxOnly = function (g) { btFxDraw(g, 0, 0); };   // the sparks alone (the results' confetti)
    function btFxDraw(g, ox, oy) {
      var i, p, x, y, r, s;
      for (i = 0; i < btFxl.length; i++) {
        p = btFxl[i]; x = Math.round(p.x) + ox; y = Math.round(p.y) + oy;
        if (p.text) { s = Q.ui.width(p.text) >> 1; x = Q.clamp(x, s + 2, Q.W - 2 - s); Q.ui.text(p.text, x - s + 1, y + 1, '#0b0c10'); Q.ui.text(p.text, x - s, y, p.col); continue; }
        g.fillStyle = p.col;
        if (p.ring) { r = Math.round((1 - p.life / p.max) * (p.ring === 2 ? 12 : 8)) + 2; g.fillRect(x - r, y - r, r * 2 + 1, 1); g.fillRect(x - r, y + r, r * 2 + 1, 1); g.fillRect(x - r, y - r, 1, r * 2); g.fillRect(x + r, y - r, 1, r * 2); continue; }
        s = p.s; if (s > 1 && p.life < p.max * 0.35) s--;
        g.fillRect(x - (s >> 1), y - (s >> 1), s, s);
      }
    }
