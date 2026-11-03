    // ---------- 90-battle-art.js: BATTLE MODE's look (B16, lab/battle; BATTLE.md): the four conductors' colours, palette swaps of ART's own 'hero' ----------
    // The same 18 frames as 'hero' and 'hero-l' (QUEST-API part 8); only the shirt's three letters (D light, d main, e shade) take the player's colour,
    // so the face (the >_ prompt), the white bow tie and the baton stay the conductor's own. Ids: 'bt-hero-0' to 'bt-hero-3', each with its '-l' twin.
    var BT = Q.battle = Q.battle || {};
    BT.COLS = [   // our own four: a name for the menus, then light, main and shade
      { name: 'ORANGE', light: '#ffb066', main: '#ff8a1e', shade: '#b4560a' },
      { name: 'TEAL', light: '#8fe8de', main: '#2ec4b6', shade: '#167a72' },
      { name: 'BERRY', light: '#f592aa', main: '#e0446a', shade: '#922443' },
      { name: 'VIOLET', light: '#c6b0f7', main: '#9068e6', shade: '#573ba2' }
    ];
    (function () {
      var base = Q.art && Q.art.heroPal, hero = Q.SPRITE.hero, left = Q.SPRITE['hero-l'], i, k, p, c;
      if (!base || !hero || !hero.frames) { Q.warn('BATTLE: no hero sprite to colour'); return; }
      for (i = 0; i < BT.COLS.length; i++) {
        c = BT.COLS[i]; p = {};
        for (k in base) if (Object.prototype.hasOwnProperty.call(base, k)) p[k] = base[k];
        p.D = c.light; p.d = c.main; p.e = c.shade;
        Q.defSprite('bt-hero-' + i, { w: 16, h: 20, n: hero.frames.length, pal: p, frames: hero.frames });
        if (left && left.frames) Q.defSprite('bt-hero-' + i + '-l', { w: 16, h: 20, n: left.frames.length, pal: p, frames: left.frames });
      }
    })();
    BT.spr = function (col) { return 'bt-hero-' + (col | 0); };
