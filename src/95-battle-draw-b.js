    // ---------- 95-battle-draw-b.js: BATTLE MODE's HUD, its big words, and each step's events turned into sounds and sparks (B16; BATTLE.md) ----------
    // The HUD: a panel for each conductor along the bottom (his tag and name, his rounds won, his hearts, his WOBBLE pips, what he has borrowed).
    BT.HUD_Y = 180;
    function btPanelX(n, k) { var w = n * 80 - 2; return Math.round((Q.W >> 1) - w / 2) + k * 80; }   // centred on the screen, whatever its width
    BT.drawHud = function (g, M, t) {
      var U = Q.ui, n = M.cs.length, need = Math.floor(M.rules.rounds / 2) + 1, i, j, c, col, px, y = BT.HUD_Y, x, wob, bx, b, tag;
      for (i = 0; i < n; i++) {
        c = M.cs[i]; col = BT.COLS[c.col] || BT.COLS[0]; px = btPanelX(n, i);
        g.fillStyle = 'rgba(11,12,16,0.86)'; g.fillRect(px, y, 78, 20);
        g.fillStyle = c.gone ? '#4a4d5c' : col.main; g.fillRect(px, y, 78, 1); g.fillRect(px, y, 2, 20);
        tag = BT.tagOf(c);
        U.text(tag, px + 5, y + 3, c.gone ? '#5d6378' : col.main);
        U.text(BT.NAMES[c.name] || '?', px + 9 + U.width(tag), y + 3, c.gone ? '#5d6378' : '#f6efe2');
        for (j = 0; j < need; j++) {   // rounds won: small squares at the right
          x = px + 72 - (need - 1 - j) * 6;
          g.fillStyle = '#0b0c10'; g.fillRect(x - 1, y + 3, 6, 6);
          g.fillStyle = M.wins[c.i] > j ? '#ffd23f' : '#3a3d4c'; g.fillRect(x, y + 4, 4, 4);
        }
        if (c.gone) { U.text('OUT', px + 5, y + 12, '#e0446a'); continue; }
        for (j = 0; j < M.rules.hearts; j++) Q.spr(g, 'ui-heart', j < c.hp ? 0 : 1, px + 4 + j * 8, y + 11);
        x = px + 6 + M.rules.hearts * 8; wob = c.wob;
        for (j = 0; j < Math.min(BT.N.WOB_MAX, 12); j++) {   // WOBBLE: a pip for each point, white to red
          g.fillStyle = j < wob ? (j < 3 ? '#f6efe2' : j < 6 ? '#ffd23f' : j < 9 ? '#ff8a1e' : '#ff4a4a') : '#2a2d3a';
          g.fillRect(x + j * 2, y + 12, 1, 6);
        }
        bx = x + 26;
        for (j = 0; j < BT.BUFFS.length; j++) {   // borrowed moves and power-ups still on: a square in the item's colour, blinking as it runs out
          b = BT.BUFFS[j];
          if (!(c.buff[b] > 0) || bx > px + 74) continue;
          if (c.buff[b] < 2 && Math.floor(t * 8) % 2) { bx += 6; continue; }
          g.fillStyle = BT.ITEMS[b].col; g.fillRect(bx, y + 12, 4, 6); bx += 6;
        }
      }
    };
    BT.big = function (s, y, col, k) {   // big words in the middle with a dark edge
      var U = Q.ui, w = U.width(s, k), x = (Q.W >> 1) - (w >> 1), dx, dy;
      for (dy = -1; dy <= 1; dy++) for (dx = -1; dx <= 1; dx++) if (dx || dy) U.text(s, x + dx * k, y + dy * k, '#0b0c10', k);
      U.text(s, x, y, col, k);
    };
    BT.drawWords = function (g, M) {   // ROUND n, READY, GO!, OVERTIME!, the round's winner
      var N = BT.N, w, c;
      if (M.phase === 'ready') {
        if (M.phaseT < 1.1) BT.big('ROUND ' + M.round, 64, '#ffffff', 3);
        else BT.big('READY', 64, '#ffd23f', 3);
        if (M.phaseT < 1.1 && M.round === 1) BT.big(M.rules.hearts + ' HEARTS. LAST ONE STANDING WINS.', 98, '#f6efe2', 1);
      } else if (M.phase === 'fight') {
        if (M.roundT < 0.7) BT.big('GO!', 58, '#ff8a1e', 4);
        if (M.ot && M.roundT - N.OVER_T < 1.6) BT.big('OVERTIME!', 64, '#ff4a4a', 3);
        else if (M.ot && Math.floor(M.roundT * 2) % 2) Q.ui.text('OVERTIME', (Q.W >> 1) - (Q.ui.width('OVERTIME') >> 1), 4, '#ff8a6a');
      } else if (M.phase === 'end' || M.phase === 'over') {
        c = M.roundWinner >= 0 ? BT.cOf(M, M.roundWinner) : null;
        w = c ? BT.NAMES[c.name] + ' WINS' : 'A DRAW';
        BT.big(M.phase === 'over' && c ? w + '!' : w + (c ? ' THE ROUND' : ''), 60, c ? BT.COLS[c.col].light : '#f6efe2', 2);
        BT.big(btScore(M), 84, '#f6efe2', 1);
      }
    };
    function btScore(M) { var s = [], i, c; for (i = 0; i < M.cs.length; i++) { c = M.cs[i]; s.push(BT.NAMES[c.name] + ' ' + M.wins[c.i]); } return s.join('   '); }
    BT.present = function (M) {   // this step's sounds and sparks (each sound once a step: four conductors are loud enough)
      var played = {}, i, j, c, f, e, v, col;
      function snd(id) { if (!played[id]) { played[id] = 1; Q.sfx(id); } }
      for (i = 0; i < M.cs.length; i++) {
        c = M.cs[i];
        for (j = 0; j < c.fx.length; j++) { f = c.fx[j]; if (f[0] === 's') snd(f[1]); else if (f[0] === 'd') BT.fx('dust', f[1], f[2]); }
      }
      for (i = 0; i < M.ev.length; i++) {
        e = M.ev[i]; v = e.who !== undefined ? BT.cOf(M, e.who) : e.k === 'round' && e.winner >= 0 ? BT.cOf(M, e.winner) : null; col = v ? (BT.COLS[v.col] || BT.COLS[0]).main : '#ffffff';
        if (e.k === 'hit') { snd(e.how === 'baton' || e.how === 'note' ? 'hit' : 'bosshit'); BT.fx(e.how === 'meteor' || e.how === 'shock' || e.wob > 1 ? 'big' : 'hit', e.x, e.y, col); if (e.how === 'meteor') BT.shake(3, 0.2); }
        else if (e.k === 'noteEnd') BT.fx('hit', e.x, e.y, '#ffd23f');
        else if (e.k === 'fall') { snd('hurt'); BT.fx('splash', Q.clamp(e.x, 8 - Q.OX, 312 + Q.OX), 0, col); BT.shake(2, 0.2); if (v && v.gone) BT.fx('text', e.x, 150, col, BT.NAMES[v.name] + ' IS OUT'); }
        else if (e.k === 'back') snd('warp');
        else if (e.k === 'itemIn') snd('tick');
        else if (e.k === 'item') { snd(e.kind === 'coffee' ? 'heart' : e.kind === 'baton' ? 'buy' : e.kind === 'metro' ? 'charge' : 'learn'); BT.fx('pop', e.x, e.y, BT.ITEMS[e.kind].col); BT.fx('text', e.x, e.y - 12, '#ffffff', BT.ITEMS[e.kind].name); }
        else if (e.k === 'shake') BT.shake(3, 0.25);
        else if (e.k === 'ot') snd('roar');
        else if (e.k === 'round') { snd('clear'); if (v) BT.fx('confetti', v.x + v.w / 2, v.y, col, 30); }
        else if (e.k === 'next') snd('card');
        else if (e.k === 'over') snd('star');
      }
    };
