    // ---------- 85-root-r5.js: THE ROOT FOLDER, root-5 README.TXT, and README.TXT itself, the entity readme (the ROOT builder, builder 12) ----------
    // The calm last room: world 0's own tiles (the computer's, no world's mechanics), the background root (ART's), no enemies, a short walk with a low step
    // and an old shelf to README.TXT, which stands on plain floor (ART's sprite readme has its walnut desk drawn in: frame 0 shut, frame 1 open). Standing at
    // it, a small arrow blinks over it; Up opens it (frame 1), plays the sound readme, and Q.say('root-readme') reads it, then Q.rootDone() (the ENGINE's:
    // it emits root, saves, plays root-won and goes back to the map). No E: README ends it. It ignores the baton and notes (a desk), and touching it is
    // harmless. Until ART's sprite is there, the def draws a plain stand-in desk.
    var ROOT_READ = { REACH: 3 };
    function rootReadAt(e, P) {   // he stands at it: on the ground, his body over the desk or touching its sides, his feet on its floor
      return !!P && !P.dead && P.ground && P.x + P.w > e.x - ROOT_READ.REACH && P.x < e.x + e.w + ROOT_READ.REACH && Math.abs(P.y + P.h - (e.y + e.h)) < 8;
    }
    function rootReadStandIn(g, x, y, open) {   // a walnut desk with a cream folder on it, or open: a page of writing
      g.fillStyle = '#1d1d24'; g.fillRect(x, y + 10, 16, 3); g.fillRect(x + 1, y + 13, 3, 3); g.fillRect(x + 12, y + 13, 3, 3);
      g.fillStyle = '#7a4a2a'; g.fillRect(x + 1, y + 11, 14, 1); g.fillRect(x + 2, y + 13, 1, 3); g.fillRect(x + 13, y + 13, 1, 3);
      g.fillStyle = '#1d1d24';
      if (open) { g.fillRect(x + 4, y + 1, 8, 9); g.fillStyle = '#ffffff'; g.fillRect(x + 5, y + 2, 6, 7); g.fillStyle = '#2f7de1'; g.fillRect(x + 6, y + 3, 4, 1); g.fillRect(x + 6, y + 5, 3, 1); g.fillRect(x + 6, y + 7, 4, 1); }
      else { g.fillRect(x + 2, y + 5, 12, 5); g.fillStyle = '#e2c78e'; g.fillRect(x + 3, y + 6, 10, 3); g.fillStyle = '#f6efe2'; g.fillRect(x + 6, y + 7, 4, 1); }
    }
    function rootReadArrow(g, x, y) {   // Up reads it: a small yellow arrow on a dark backing
      g.fillStyle = '#1d1d24'; g.fillRect(x - 3, y - 1, 8, 4); g.fillRect(x - 1, y - 3, 4, 2); g.fillRect(x, y + 3, 2, 3);
      g.fillStyle = '#ffd23f'; g.fillRect(x - 2, y, 6, 2); g.fillRect(x, y - 2, 2, 2); g.fillRect(x, y + 2, 2, 3);
    }
    Q.defEnemy('readme', {
      name: 'README.TXT', w: 16, h: 16, hp: 1, xp: 0, tokens: 0, touch: 0, gravity: 0, solid: false, stun: false, always: true,
      init: function (e) { e.face = 1; e.frame = 0; e.data.open = false; e.data.at = false; e.data.reads = 0; },
      hit: function () { return false; },
      update: function (e, dt, Q) {
        var d = e.data, P = Q.P;
        e.vx = 0; e.vy = 0;
        d.at = rootReadAt(e, P);
        if (d.at && !Q.talking() && (Q.press ? Q.press('up') : !!(Q.api && Q.api.pressed('up')))) {
          d.open = true; d.reads++; e.frame = 1; P.vx = 0;
          Q.sfx(Q.SFX.readme ? 'readme' : 'memo');
          Q.say('root-readme', function () { Q.rootDone(); });
        }
        e.frame = d.open ? 1 : 0;
      },
      draw: function (e, g, Q) {
        var x = Math.round(e.x - Q.cam.x), y = Math.round(e.y - Q.cam.y), d = e.data;
        if (Q.SPRITE.readme) Q.spr(g, 'readme', e.frame, x, y, false); else rootReadStandIn(g, x, y, d.open);
        if (d.at && !d.open && !Q.talking() && Math.floor(Q.t * 3) % 3 !== 2) rootReadArrow(g, x + 7, y - 9);
      }
    });

    Q.defLevel('root-5', {
      world: 0, name: 'README.TXT', root: true, music: 'root', bg: 'root',
      legend: { r: 'readme' },
      signs: ['PLEASE READ ME.'],
      memos: [],
      map: [
        '#                                          #',
        '#                                          #',
        '#                                          #',
        '#                                          #',
        '#                                          #',
        '#              o o o                       #',
        '#              =====                       #',
        '#                                          #',
        '#      o o o           o o o               #',
        '# S K        #########           !   r     #',
        '############################################',
        '############################################',
        '############################################'
      ]
    });
