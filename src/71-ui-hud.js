    // ---------- 71-ui-hud.js: the HUD, over the level in the top 16 pixels (UI, builder 5) ----------
    // Q.ui.hud(g, Q): hearts (up to 8), the RHYTHM notes, tokens, LV with a thin XP bar, the abilities learned; while Q.boss is set, its name and health bar
    // take the place of the tokens and the LV. A dark band, so it reads over any background. It also draws the toast (under the band) if drawTalk has not yet.
    // Q.ui.stat(): the numbers the HUD and the menus show (QUEST-API.md part 13, 5: the body from Q.P, falling back to Q.SAVE; the rest from Q.SAVE).
    (function () {
      var U = Q.ui, H = { at: -1, tok: null, tokT: 0, lv: null, lvT: 0, boss: null, hp: 0, trail: 0, hitT: 0 };
      var ABIL0 = ['dash', 'hover', 'pound'];
      function moves() { return Q.MOVES || ABIL0; }   // every move in its order: the three, then PUSHBACK and FOLLOW UP (B21, 52-engine-moves.js)
      function num(v, d) { return typeof v === 'number' && isFinite(v) ? v : d; }
      U.num = num;
      U.lvOf = function (xp) { var lv = 1; for (var i = 1; i < Q.LV.length; i++) if (xp >= Q.LV[i]) lv = i + 1; return lv; };
      U.memoCount = function (S, world) {   // memos found (of 24), or of one world's 6
        var n = 0, m = (S || Q.SAVE || {}).memos || {}, re = world ? new RegExp('^m' + world + '-[1-3][ab]$') : /^m[1-4]-[1-3][ab]$/;
        for (var k in m) if (Object.prototype.hasOwnProperty.call(m, k) && m[k] && re.test(k)) n++;
        return n;
      };
      U.learned = function (a) {
        var list = (Q.SAVE && Q.SAVE.abilities) || [];
        for (var i = 0; i < list.length; i++) if (list[i] === a) return true;
        return !!Q.has(a);
      };
      U.saved = function (c) { var list = (Q.SAVE && Q.SAVE.saved) || []; for (var i = 0; i < list.length; i++) if (list[i] === c) return true; return false; };
      U.stat = Q.ui.stat = function () {
        var S = Q.SAVE || {}, P = Q.P || {}, maxHp = num(P.maxHp, num(S.maxHp, Q.HERO.HEARTS)), xp = num(S.xp, 0), lv = num(S.lv, U.lvOf(xp));
        var lo = Q.LV[lv - 1] || 0, hi = Q.LV[lv], rmax = num(P.rhythmMax, num(S.rhythmMax, Q.HERO.RHYTHM));
        return {
          hp: Q.clamp(num(P.hp, num(S.hp, maxHp)), 0, maxHp), maxHp: maxHp, power: num(P.power, num(S.power, 1)),
          rhythm: Q.clamp(num(P.rhythm, rmax), 0, rmax), rhythmMax: rmax, tokens: num(S.tokens, 0), xp: xp, lv: lv,
          next: hi === undefined ? 0 : Math.max(0, hi - xp), part: hi === undefined ? 1 : Q.clamp((xp - lo) / Math.max(1, hi - lo), 0, 1),
          memos: U.memoCount(S), time: num(S.time, 0), falls: num(S.falls, 0)
        };
      };
      U.iconCount = function () { var n = 0, ab = moves(); for (var i = 0; i < ab.length; i++) if (U.learned(ab[i])) n++; return n; };
      U.icons = function (g, x, y, gap) {   // the abilities learned, as small icons from x to the right
        var n = 0, ab = moves();
        for (var i = 0; i < ab.length; i++) if (U.learned(ab[i])) { Q.spr(g, 'ic-' + ab[i], 0, x + n * gap, y); n++; }
      };
      function bookkeep(s, now) {   // once a frame: flashes when the tokens or the LV change, the boss bar's trail
        var dt = H.at < 0 ? 0 : Q.clamp(now - H.at, 0, 0.05), b = Q.boss, hp, max;
        H.at = now;
        if (H.tok !== null && s.tokens !== H.tok) H.tokT = 0.3; H.tok = s.tokens; H.tokT = Math.max(0, H.tokT - dt);
        if (H.lv !== null && s.lv !== H.lv) H.lvT = 1.2; H.lv = s.lv; H.lvT = Math.max(0, H.lvT - dt);
        if (!b) { H.boss = null; return; }
        max = Math.max(1, num(b.maxHp, num(b.def && b.def.hp, 1))); hp = Q.clamp(num(b.hp, 0), 0, max);
        if (H.boss !== b) { H.boss = b; H.hp = hp; H.trail = hp; H.hitT = 0; }
        if (hp < H.hp) H.hitT = 0.15;
        H.hp = hp; H.hitT = Math.max(0, H.hitT - dt);
        H.trail = hp >= H.trail ? hp : Math.max(hp, H.trail - max * 0.5 * dt);
      }
      function bossBar(g, x, w, now) {
        var b = Q.boss, max = Math.max(1, num(b.maxHp, num(b.def && b.def.hp, 1))), name = String((b.def && b.def.name) || 'THE BOSS');
        U.text(name, x, 2, '#ffc9c4');
        U.fill(g, x, 10, w, 5, '#000000'); U.fill(g, x + 1, 11, w - 2, 3, '#3a1c22');
        var fw = Math.round((w - 2) * H.trail / max), hw = Math.round((w - 2) * H.hp / max);
        if (fw > 0) U.fill(g, x + 1, 11, fw, 3, '#ffd9b0');
        if (hw > 0) { U.fill(g, x + 1, 11, hw, 3, H.hitT > 0 ? '#ffffff' : '#e0443a'); U.fill(g, x + 1, 11, hw, 1, H.hitT > 0 ? '#ffffff' : '#ff8a7a'); }
      }
      U.hudBand = function () {   // where the HUD's items go: the whole screen up to 16:9 (Q.HUDW), centred on a wider one, so they never sit at the far edges of a 32:9 screen
        var w = Math.min(Q.W, Q.HUDW || 356);
        return { x: (Q.W - w) >> 1, w: w };
      };
      Q.ui.hud = function (g) {
        var s = U.stat(), now = U.now(), i, x, hearts, full, y, iw, hb = U.hudBand(), L = hb.x, R = hb.x + hb.w;   // L and R: the band's sides (0 and 320 on a 320 screen)
        bookkeep(s, now);
        if (Q.level && Q.level.world) U.lastWorld = Q.level.world;   // the map stands him by the world he was last in (the level is gone when the map opens)
        if (Q.level) U.lastStop = Q.level.root ? 'root' : typeof Q.encoreOn === 'function' && Q.encoreOn() ? 'encore' : '';   // or by THE ROOT FOLDER, or THE ENCORE's stage
        U.fill(g, 0, 0, Q.W, 15, '#121318'); U.fill(g, 0, 15, Q.W, 1, '#3a3d52');   // the dark band spans the whole screen
        hearts = Q.clamp(Math.round(s.maxHp), 1, 8);
        for (i = 0; i < hearts; i++) {
          full = i < Math.round(s.hp); y = 4;
          if (full && s.hp <= 1 && Math.floor(now * 4) % 2) y = 3;   // the last heart beats
          Q.spr(g, 'ui-heart', full ? 0 : 1, L + 4 + i * 9, y);
        }
        x = L + 8 + hearts * 9;
        for (i = 0; i < Q.clamp(Math.round(s.rhythmMax), 0, 6); i++) Q.spr(g, 'ui-note', i < Math.floor(s.rhythm + 0.001) ? 0 : 1, x + i * 7, 4);
        iw = U.iconCount() * 13 - 1;
        if (iw > 0) U.icons(g, R - 4 - iw, 2, 13); else iw = 0;
        if (Q.boss) { bossBar(g, L + 118, R - 4 - (iw ? iw + 6 : 0) - (L + 118), now); }
        else {
          Q.spr(g, 'token', H.tokT > 0 ? Math.floor(now * 16) % 4 : 0, L + 120, 4);
          U.text(String(Math.floor(s.tokens)), L + 131, 5, H.tokT > 0 ? '#ffd23f' : '#f6efe2');
          U.text('LV', L + 166, 5, '#8a8fa3'); U.text(String(s.lv), L + 179, 5, H.lvT > 0 && Math.floor(now * 8) % 2 ? '#ffd23f' : '#ffffff');
          x = L + 179 + U.width(String(s.lv)) + 5;
          U.fill(g, x, 6, 38, 5, '#000000'); U.fill(g, x + 1, 7, 36, 3, '#2a2c3a');
          if (s.part > 0) { U.fill(g, x + 1, 7, Math.max(1, Math.round(36 * s.part)), 3, '#2ec4b6'); U.fill(g, x + 1, 7, Math.max(1, Math.round(36 * s.part)), 1, '#8ff0e6'); }
        }
        if (U.card) U.card(g);   // a level's card (79-ui-card.js), when one has just started
        U.tick(); U.drawToast(g);
      };
    })();
