    // ---------- 55-engine-level-b.js (ENGINE): the 'level' scene itself and its drawing; small stand-ins for the HUD and the toast until the UI's land ----------
    var ENG_SKY = { 0: '#20262a', 1: '#16213d', 2: '#101519', 3: '#5f9fd6', 4: '#24142f' };
    var engToastLite = { text: '', t: 0 };
    function engPlainBg(g) {   // no background painter for this level: a plain sky by the world, with two faint bands that move a little
      var c = ENG_SKY[Q.level.world] || ENG_SKY[0], i, x;
      g.fillStyle = c; g.fillRect(0, 0, Q.W, Q.H);
      g.fillStyle = 'rgba(255,255,255,0.05)';
      for (i = 0; i < 4; i++) { x = Math.round(((i * 97 - Q.cam.x * 0.25) % 400 + 400) % 400) - 40; g.fillRect(x, 70 + (i % 2) * 30 - Math.round(Q.cam.y * 0.1), 60, 24); }
      g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(0, 150 - Math.round(Q.cam.y * 0.2), Q.W, 60);
    }
    function engDrawDark(g, lv) {   // a dark level: only a ring of light round the conductor
      var P = Q.P, c;
      if (!P) return;
      if (!engDarkCv) {
        engDarkCv = Q.canvas(640, 400); c = engDarkCv.getContext('2d');
        c.fillStyle = '#05060a'; c.fillRect(0, 0, 640, 400);
        c.globalCompositeOperation = 'destination-out';
        var gr = c.createRadialGradient(320, 200, 30, 320, 200, 92); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = gr; c.fillRect(0, 0, 640, 400); c.globalCompositeOperation = 'source-over';
      }
      g.globalAlpha = typeof lv.dark === 'number' ? Q.clamp(lv.dark, 0, 1) : 0.88;
      g.drawImage(engDarkCv, Math.round(P.x + P.w / 2 - Q.cam.x) - 320, Math.round(P.y + P.h / 2 - Q.cam.y) - 200);
      g.globalAlpha = 1;
    }
    function engHudLite(g) {   // only until the UI's Q.ui.hud lands: hearts, rhythm, tokens, LV, the boss's bar
      var P = Q.P, s = engSave(), a = Q.api, i;
      g.fillStyle = 'rgba(11,12,16,0.8)'; g.fillRect(0, 0, Q.W, 14);
      if (P) {
        for (i = 0; i < P.maxHp; i++) a.text('~', 4 + i * 8, 4, i < P.hp ? '#ff5a7a' : '#4a3a44');
        for (i = 0; i < P.rhythmMax; i++) { g.fillStyle = i < P.rhythm ? '#ffd23f' : '#4a4636'; g.fillRect(74 + i * 6, 5, 4, 5); }
      }
      if (engOwn(Q.SPRITE, 'token')) { Q.spr(g, 'token', 0, 104, 3); a.text(String(s.tokens), 115, 4, '#ffd23f'); } else a.text('TOKENS ' + s.tokens, 104, 4, '#ffd23f'); a.text('LV ' + s.lv, 150, 4, '#f6efe2');
      if (Q.boss) { g.fillStyle = '#3a1418'; g.fillRect(214, 5, 100, 5); g.fillStyle = '#ff5a5a'; g.fillRect(214, 5, Math.round(100 * Math.max(0, Q.boss.hp) / Math.max(1, Q.boss.maxHp)), 5); }
    }
    function engToastSet(text, secs) { engToastLite.text = String(text || ''); engToastLite.t = +secs > 0 ? +secs : 2; }
    function engDrawToastLite(g) {
      if (!(engToastLite.t > 0) || !engToastLite.text) return;
      engToastLite.t -= Q.DT;
      var w = Math.min(316, Q.api.width(engToastLite.text) + 10);
      g.fillStyle = '#1d1d24'; g.fillRect(160 - w / 2, 18, w, 13); g.fillStyle = '#ffd23f'; g.fillRect(160 - w / 2, 18, w, 1);
      Q.api.text(engToastLite.text.slice(0, 52), 160, 21, '#f6efe2', 1, 'center');
    }
    function engDrawBubble(g) {   // a sign's words in a speech bubble above it while he is near: cream, a dark outline, a tail down to the sign
      if (!(engBub.a > 0) || !engBub.text) return;
      var a = Q.api, lines = Q.wrap(engBub.text, 26).slice(0, 4), w = 0, i, h, x, y, sx, sy, tx;
      for (i = 0; i < lines.length; i++) w = Math.max(w, a.width(lines[i]));
      w += 10; h = lines.length * 9 + 6;
      sx = Math.round(engBub.tx * 16 + 8 - Q.cam.x); sy = Math.round(engBub.ty * 16 - Q.cam.y);
      x = Math.round(Q.clamp(sx - w / 2, 2, Q.W - w - 2)); y = Math.max(Q.HUD + 2, sy - h - 6);
      tx = Math.round(Q.clamp(sx, x + 5, x + w - 6));
      g.globalAlpha = engBub.a;
      g.fillStyle = '#1d1d24'; g.fillRect(x - 1, y - 1, w + 2, h + 2); g.fillRect(tx - 3, y + h, 7, 2); g.fillRect(tx - 2, y + h + 2, 5, 1); g.fillRect(tx - 1, y + h + 3, 3, 1);
      g.fillStyle = '#f6efe2'; g.fillRect(x, y, w, h); g.fillRect(tx - 2, y + h, 5, 1); g.fillRect(tx - 1, y + h + 1, 3, 1); g.fillRect(tx, y + h + 2, 1, 1);
      for (i = 0; i < lines.length; i++) a.text(lines[i], x + Math.round(w / 2), y + 4 + i * 9, '#1d1d24', 1, 'center');
      g.globalAlpha = 1;
    }
    function engDrawUi(g) {   // QUEST-API part 13, item 1: the HUD, then the text box and toasts, on every frame
      if (Q.ui.hud === engCore.hud) engHudLite(g); else { try { Q.ui.hud(g, Q); } catch (er) { engErr('draw', 'hud', er); } }
      if (Q.ui.drawTalk === engCore.talk) engDrawToastLite(g); else { try { Q.ui.drawTalk(g, Q); } catch (er2) { engErr('draw', 'text box', er2); } }
    }
    function engLevelDraw(g) {
      var lv = Q.level, bg;
      if (!lv) { g.fillStyle = '#0b0c10'; g.fillRect(0, 0, Q.W, Q.H); engDrawUi(g); return; }
      bg = lv.bg && engOwn(Q.BG, lv.bg) ? Q.BG[lv.bg] : null;
      if (bg) { try { bg(g, Q.cam.x, Q.cam.y, Q.t, Q); } catch (er) { engErr('draw', 'background ' + lv.bg, er); bg = null; } }
      if (!bg) engPlainBg(g);
      engDrawTiles(g, engDoorOpen);
      engDrawEnts(g);
      engDrawHero(g);
      engDrawTops(g);
      engDrawFx(g);
      if (lv.dark) engDrawDark(g, lv);
      engDrawFlash(g);
      engDrawBubble(g);
      if (engDoor) { g.globalAlpha = Math.min(1, engDoor.t / 0.45); g.fillStyle = '#000000'; g.fillRect(0, 0, Q.W, Q.H); g.globalAlpha = 1; }
      engDrawUi(g);
    }

    Q.defScene('level', {
      enter: function (opts) {
        opts = opts || {};
        if ((opts.resume || !opts.level) && Q.level && Q.P) return;   // back from the pause menu: carry on where it was
        if (!engLoadLevel(opts.level || engFirstLevel(), opts)) engLoadLevel(engFirstLevel(), {});
      },
      update: function (dt) { engLevelStep(dt); },
      draw: function (g) { engLevelDraw(g); },
      leave: function () {}   // the pause menu draws the level under itself, so leaving keeps everything
    });
