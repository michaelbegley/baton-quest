    // ---------- 10-core.js: Baton Quest's contract in code (the director's file; ask before changing it) ----------
    // The numbers every part designs for, the registries every part fills when it loads, and safe stand-ins for the runtime functions the other parts make:
    // a missing part never stops the game (no sound, no text box, a magenta box where a sprite is missing). QUEST-API.md says what each one does and who makes it.
    Q.W = 320; Q.H = 200; Q.TILE = 16; Q.DT = 1 / 60; Q.HUD = 16;
    Q.OX = 0; Q.WMAX = 712; Q.HUDW = 356;   // widescreen (WIDESCREEN.md): Q.W follows the runtime's api.W, 320 to 712; Q.OX is the left of the centred 320 column; the HUD keeps to a centred 16:9 band of Q.HUDW at most
    Q.setW = function (w) {   // the screen's width (the engine sets it from api.W at the start of each frame); everything else follows it
      w = Math.round(+w); if (!(w >= 320)) w = 320; if (w > Q.WMAX) w = Q.WMAX;
      Q.W = w; Q.OX = (w - 320) >> 1; return w;
    };
    Q.col = function (g, fn) {   // draws fn(g) in the centred 320 column: inside, Q.W is 320 and x 0 is the column's left (on a 320 screen it only calls fn)
      var w = Q.W, ox = Q.OX;
      if (!(w > 320)) { fn(g); return; }
      g.save(); g.translate(ox, 0); Q.W = 320; Q.OX = 0;
      try { fn(g); } finally { Q.W = w; Q.OX = ox; g.restore(); }
    };
    Q.HERO = {
      W: 10, H: 14, SPR_W: 16, SPR_H: 20,
      RUN: 110, ACC: 1000, AIRACC: 700, STOP: 1400,                       // px/s and px/s per second
      JUMP: 300, GRAV_UP: 820, GRAV: 1500, FALL: 330, COYOTE: 0.1, BUFFER: 0.12,   // A held while rising: GRAV_UP; otherwise GRAV
      SWING_T: 0.22, SWING_W: 20, SWING_H: 16, CHARGE_T: 0.4, NOTE_V: 200, NOTE_T: 1.2, RHYTHM: 3, RHYTHM_T: 2,
      DASH_V: 280, DASH_T: 0.18, DASH_TAP: 0.25,   // back to 0.25 (2 Nov): 0.3 made stray dashes (the root rooms' route bots fell); the C button is the easy dash now
      DASH_BUF: 0.1, DASH_COOL: 0.2, DASH_END: 110, DASH_CARRY: 0, DASH_SLOW: 400, DASH_FREEZE: 0,   // the C button's dash (14.10 item 9, after Celeste's: a press kept 0.1 s, 0.2 s between dashes). It ends at run speed as before: a carry of 160 px/s put two of QA's 411 route moves off their landings (w4-1 overshot a ledge), so it waits with the 8-way unlockable; no freeze either (the level's stop dropped presses made during it)
      HOVER_FALL: 20, HOVER_RUN: 70, HOVER_T: 0.8,
      POUND_WAIT: 0.12, POUND_V: 420, POUND_R: 28, POUND_STUN: 1.5,
      HURT_T: 1.2, KNOCK: 140, HEARTS: 3, HEARTS_MAX: 8
    };
    Q.LV = [0, 10, 30, 55, 85, 125, 170, 215, 270, 340];         // XP to reach LV 1 to 10 (02:00: lowered from 60, 100, 150... so beating three quarters of the enemies reaches LV 3, 5, 7, 9 after worlds 1 to 4, QA round 2)
    Q.LV_HEART = { 2: 1, 4: 1, 7: 1, 10: 1 }; Q.LV_POWER = { 3: 1, 6: 1, 9: 1 };
    Q.PRICE = { coffee: 10, heart: 60, baton: 80, metronome: 50, memofinder: 120, bowtie: 250 };   // memofinder and bowtie added 02:00 (part 13 item 25)
    Q.COL = {
      dark: '#1d1d24', cream: '#f6efe2', teal: '#2ec4b6', orange: '#ff8a1e', yellow: '#ffd23f', blue: '#2f7de1', walnut: '#7a4a2a', white: '#ffffff', ink: '#0b0c10',
      c1: '#3f7fd9', c1d: '#14294d', c1p: '#bcd4f6', c2: '#46b06a', c2d: '#123d24', c2p: '#bfe8cd', c3: '#ee7fb0', c3d: '#4f1d36', c3p: '#fbd3e3', head: '#e8f0ff'
    };
    Q.ABILITY = {
      dash: { name: 'QUICK KEYS', from: 'c1', how: 'PRESS C TO DASH (OR TAP TWICE)' },
      hover: { name: 'PAUSE TO THINK', from: 'c2', how: 'HOLD A WHILE FALLING TO HOVER' },
      pound: { name: 'FIRM HAND', from: 'c3', how: 'IN THE AIR, DOWN AND B TO POUND' }
    };
    Q.WHO = { hero: 'THE CONDUCTOR', c1: 'C1', c2: 'C2', c3: 'C3', facil: 'FACILITATOR', creep: 'SCOPE CREEP', vend: 'VEND-9', cat: 'THE CAT', none: '' };

    // ---------- the registries (filled when the files load; read when the game starts) ----------
    Q.SPRITE = {}; Q.TILEDEF = { 0: {} }; Q.BG = {}; Q.ENEMY = {}; Q.LEVEL = {}; Q.WORLD = {}; Q.SCRIPT = {}; Q.MEMO = {}; Q.SFX = {}; Q.SONG = {}; Q.SCENE = {};
    Q.WARN = [];
    Q.warn = function (s) { if (Q.WARN.length < 80) Q.WARN.push(String(s)); };
    function qDef(table, kind) { return function (id, def) { if (Object.prototype.hasOwnProperty.call(table, id)) Q.warn(kind + ' ' + id + ' is defined twice'); table[id] = def; return def; }; }
    Q.defSprite = qDef(Q.SPRITE, 'sprite'); Q.defBg = qDef(Q.BG, 'background'); Q.defEnemy = qDef(Q.ENEMY, 'enemy'); Q.defLevel = qDef(Q.LEVEL, 'level');
    Q.defWorld = qDef(Q.WORLD, 'world'); Q.defScript = qDef(Q.SCRIPT, 'script'); Q.defMemo = qDef(Q.MEMO, 'memo'); Q.defSfx = qDef(Q.SFX, 'sound');
    Q.defSong = qDef(Q.SONG, 'song'); Q.defScene = qDef(Q.SCENE, 'scene');
    Q.defBoss = function (id, def) { def.boss = true; return Q.defEnemy(id, def); };
    Q.defTile = function (world, ch, def) {
      var t = Q.TILEDEF[world] || (Q.TILEDEF[world] = {});
      if (Object.prototype.hasOwnProperty.call(t, ch)) Q.warn('tile ' + ch + ' in world ' + world + ' is defined twice');
      t[ch] = def; return def;
    };

    // ---------- version 116 (QUEST-API.md part 14): events, gold stars, tracks, par times ----------
    Q.EVENTS = {};
    Q.on = function (name, fn) { (Q.EVENTS[name] || (Q.EVENTS[name] = [])).push(fn); };   // at load only, never inside a scene (so no listener is left behind)
    Q.emit = function (name, data) {   // every listener at once, in load order; a listener's error is caught and never stops play
      var list = Q.EVENTS[name], i;
      if (!list) return;
      for (i = 0; i < list.length; i++) { try { list[i](data || {}, Q); } catch (err) { Q.warn('ERROR in a listener for ' + name + ': ' + err); } }
    };
    Q.STAR = {}; Q.STARTEXT = {}; Q.TRACK = {}; Q.PAR = {};
    Q.defStar = qDef(Q.STAR, 'star'); Q.defStarText = qDef(Q.STARTEXT, 'star text'); Q.defTrack = qDef(Q.TRACK, 'track');

    // ---------- small helpers anyone may use ----------
    Q.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
    Q.lerp = function (a, b, k) { return a + (b - a) * k; };
    Q.approach = function (v, to, step) { return v < to ? Math.min(v + step, to) : Math.max(v - step, to); };
    Q.sign = function (v) { return v > 0 ? 1 : v < 0 ? -1 : 0; };
    Q.overlap = function (a, b) { return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h; };   // two boxes { x, y, w, h }
    Q.wrap = function (s, n) {   // words into lines of at most n characters
      var words = String(s).split(/\s+/), lines = [], cur = '';
      for (var i = 0; i < words.length; i++) {
        if (!words[i]) continue;
        if (!cur) cur = words[i]; else if ((cur + ' ' + words[i]).length <= n) cur += ' ' + words[i]; else { lines.push(cur); cur = words[i]; }
      }
      if (cur) lines.push(cur);
      return lines;
    };

    // ---------- stand-ins for the runtime: each owner's file replaces them (QUEST-API.md, part 7) ----------
    function qNone() {}
    function qNo() { return false; }
    Q.api = null; Q.g = null; Q.t = 0; Q.scene = ''; Q.ents = []; Q.P = null; Q.cam = { x: 0, y: 0 }; Q.level = null; Q.boss = null; Q.SAVE = null;
    Q.go = qNone; Q.spr = function (g, id, frame, x, y) { g.fillStyle = '#ff00ff'; g.fillRect(Math.round(x), Math.round(y), 8, 8); };
    Q.tile = function () { return ' '; }; Q.setTile = qNone; Q.solid = qNo; Q.findTiles = function () { return []; }; Q.move = qNone;
    Q.spawn = function () { return null; }; Q.remove = qNone; Q.hurt = qNone; Q.near = function () { return null; }; Q.has = qNo; Q.learn = qNone;
    Q.damage = qNone; Q.xp = qNone; Q.tokens = qNone; Q.fx = qNone; Q.shake = qNone; Q.flash = qNone; Q.flag = function () { return undefined; }; Q.rand = Math.random;
    Q.newGame = qNone; Q.continueGame = qNone; Q.startWorld = qNone; Q.startLevel = qNone; Q.levelDone = qNone; Q.unlocked = qNo; Q.cleared = qNo; Q.saveGame = qNone;
    Q.say = function (id, done) { if (done) done(); }; Q.talking = qNo; Q.toast = qNone; Q.ui = { hud: qNone, drawTalk: qNone };
    Q.sfx = qNone; Q.music = qNone; Q.audioFrame = qNone; Q.audioStop = qNone;
    Q.star = qNo; Q.stat = function () { return 0; }; Q.encoreOpen = qNo; Q.encore = qNone; Q.rootOpen = qNo; Q.rootDone = qNone;   // version 116 (part 14): ENGINE's
