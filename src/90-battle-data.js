    // ---------- 90-battle-data.js: BATTLE MODE's data (B16, lab/battle; BATTLE.md): its numbers, names, power-ups, rules and the four arenas ----------
    // A file only defines when it loads. BATTLE MODE never writes the adventure's save (Q.SAVE), its conductor (Q.P), its level (Q.level), its entities
    // (Q.ents) or its events (Q.emit), so the adventure's saves, gold stars and best times stay as they are. BT is Q.battle (90-battle-art.js makes it).
    BT.N = {
      KB_BASE: 150, KB_GROW: 30, KB_UP: 0.55, KB_LIFT: 80,   // knockback (px/s): base plus growth for each WOBBLE point; up by KB_UP of it plus KB_LIFT
      STUN: 0.16, STUN_GROW: 0.022, GRACE: 0.3, DRAG: 110,   // seconds he cannot act after a hit (and its growth); no new hit for GRACE s; a knock slows by DRAG px/s each s
      WOB_MAX: 12, OUT_T: 1.2, SAFE_T: 2, KO_T: 4,           // the WOBBLE cap; seconds out after a fall; blinking after he comes back; a knock-off counts this long after a hit
      FALL_Y: 36, SIDE_X: 56, TOP_Y: -400,                   // a fall: this far below the arena, or this far past a side (px); a knock this high comes back down
      SWING_HIT: 0.14, BIG_W: 26, BIG_K: 1.25,               // the swing hits in its first 0.14 s (as in the adventure); BIGGER BATON: a longer swing, harder knocks
      POUND_SHOCK: 30, POUND_KB: 1.3,                        // FIRM HAND's landing reaches this far; a pound onto someone knocks this much harder, downwards
      ITEM_T0: 8, ITEM_T1: 14, ITEM_MAX: 2, ITEM_V: 22, ITEM_BOB: 9,   // a power-up every 8 to 14 s, two at most, drifting 22 px/s with a 9 px bob
      BUFF_T: 15, BATON_T: 12, METRO_T: 12, METRO_K: 4,      // borrowed moves last 15 s; BIGGER BATON and METRONOME 12 s (rhythm refills 4 times as fast)
      READY_T: 2.2, END_T: 2.6, OVER_T: 100, OT_K: 2         // ROUND n, READY, GO; the round's winner; OVERTIME after 100 s: WOBBLE grows twice as fast
    };
    BT.NAMES = ['TEMPO', 'FORTE', 'PIANO', 'LARGO', 'PRESTO', 'ADAGIO', 'RONDO', 'CODA', 'TRILL', 'ARIA', 'CHORD', 'VIVACE', 'DOLCE', 'LENTO', 'ALTO', 'BASSO'];   // our own list: music words, no typed names
    BT.RULES0 = { rounds: 3, hearts: 3, items: true, cpu: 1 };   // best of 3, 3 hearts, ITEMS ON, CPU NORMAL
    BT.ROUNDS = [1, 3, 5]; BT.CPU = ['EASY', 'NORMAL', 'HARD'];
    BT.ITEMS = {   // the game's own things (BATTLE.md): spr is the sprite drawn in the bubble ('' : the shop's own metronome drawing)
      coffee: { name: 'COFFEE', spr: 'mug', say: 'A HEART BACK', col: '#f6efe2', w: 1 },
      baton: { name: 'BIGGER BATON', spr: 'ic-baton', say: 'HITS HARDER', col: '#ffd23f', w: 2 },
      metro: { name: 'METRONOME', spr: '', say: 'RHYTHM FULL', col: '#c08552', w: 2 },
      dash: { name: 'QUICK KEYS', spr: 'ic-dash', say: 'C: DASH', col: '#3f7fd9', w: 2 },
      hover: { name: 'PAUSE TO THINK', spr: 'ic-hover', say: 'HOLD A: HOVER', col: '#46b06a', w: 2 },
      pound: { name: 'FIRM HAND', spr: 'ic-pound', say: 'DOWN AND B: POUND', col: '#ee7fb0', w: 2 }
    };
    BT.ITEM_IDS = ['coffee', 'baton', 'metro', 'dash', 'hover', 'pound'];
    BT.BUFFS = ['dash', 'hover', 'pound', 'baton', 'metro'];
    // ---------- the arenas: one a world, 20 by 13 tiles (the whole screen), from that world's own tiles, decorations and background ----------
    // '#' solid (the world's t<N>-solid), '=' thin (t<N>-oneway), 'S' a start (four), other marks: the world's own Q.defTile (read when a match starts).
    BT.ARENAS = [
      { id: 'mail', world: 1, name: 'REPLY ALL', place: 'THE INBOX', bg: 'inbox', look: { sky: 1 }, music: 'boss-hydra',
        map: [
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '      ========      ',
          '   T          T     ',
          '  =====      =====  ',
          '                    ',
          '  LS T S  BS T S L  ',
          '  ################  ',
          '  ################  ',
          '                    '] },
      { id: 'rack', world: 2, name: 'HOT SPARE', place: 'THE SERVER ROOM', bg: 'server', look: { w2look: 'hot' }, music: 'boss-overheat',
        map: [
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '        ====        ',
          '                    ',
          '  ====        ====  ',
          '                    ',
          ' LS  S T    T S  SL ',
          ' ########  ######## ',
          ' ########  ######## ',
          '                    '] },
      { id: 'sky', world: 3, name: 'SYNC OR SWIM', place: 'THE CLOUD', bg: 'cloud', look: { w3sky: 'day' }, music: 'boss-loop',
        map: [
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '   ====      ====   ',
          '                    ',
          '  F             Y   ',
          ' ====    ==    ==== ',
          '                    ',
          '     YS S  S SB     ',
          '     ##########     ',
          '      ########      ',
          '                    '] },
      { id: 'pile', world: 4, name: 'STAND-UP', place: 'THE BACKLOG', bg: 'backlog', look: {}, music: 'encore',
        map: [
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '                    ',
          '       ======       ',
          '                    ',
          '   *          :     ',
          '  ####        ####  ',
          '  ####S S, S S####  ',
          '  ################  ',
          '  ################  ',
          '                    '] }
    ];
    BT.arenaDef = function (id) { for (var i = 0; i < BT.ARENAS.length; i++) if (BT.ARENAS[i].id === id) return BT.ARENAS[i]; return BT.ARENAS[0]; };
    // ---------- a seeded random of the match's own (xorshift; its state is a number in the match, so a match replays the same for the same seed) ----------
    BT.rand = function (o, key) {
      var s = (o[key] >>> 0) || 1;
      s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
      o[key] = s; return s / 4294967296;
    };
    BT.copy = function (o) { var r = {}, k; for (k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r[k] = o[k]; return r; };
