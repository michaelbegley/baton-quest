    // ---------- 69-engine-test.js (ENGINE): the engine's own test level, test enemy, lift and boss (ids 'eng-'), so the engine runs before the worlds land ----------
    // Not in any world: reach them with cheat.warp('eng-test') or cheat.warp('eng-arena').
    function engTestPaint(c, w, h, body, dark, f, eyes) {   // a little outlined blob for the test art
      c.fillStyle = '#1d1d24'; c.fillRect(1, 0, w - 2, h - 1); c.fillRect(0, 1, w, h - 3);
      c.fillStyle = body; c.fillRect(1, 1, w - 2, h - 3); c.fillStyle = dark; c.fillRect(1, h - 5, w - 2, 2);
      if (eyes) { c.fillStyle = '#ffffff'; c.fillRect(2, 3, 3, 3); c.fillRect(w - 6, 3, 3, 3); c.fillStyle = '#1d1d24'; c.fillRect(3 + (f ? 1 : 0), 4, 1, 1); c.fillRect(w - 5 + (f ? 1 : 0), 4, 1, 1); }
    }
    Q.defSprite('eng-walker', { w: 12, h: 12, n: 2, draw: function (c, f) {
      engTestPaint(c, 12, 11, '#e0604e', '#a03a30', f, true);
      c.fillStyle = '#1d1d24'; c.fillRect(f ? 2 : 3, 10, 3, 2); c.fillRect(f ? 7 : 6, 10, 3, 2);
    } });
    Q.defSprite('eng-lift', { w: 32, h: 8, n: 1, draw: function (c) {
      c.fillStyle = '#1d1d24'; c.fillRect(0, 0, 32, 8); c.fillStyle = '#2ec4b6'; c.fillRect(1, 1, 30, 5); c.fillStyle = '#9ff0e6'; c.fillRect(1, 1, 30, 1);
      c.fillStyle = '#1b7f76'; for (var i = 3; i < 30; i += 6) c.fillRect(i, 3, 2, 2);
    } });
    Q.defSprite('eng-boss', { w: 32, h: 24, n: 2, draw: function (c, f) {
      engTestPaint(c, 32, 24 - f, '#8a5ad8', '#5a3496', f, false);
      c.fillStyle = '#ffffff'; c.fillRect(7, 6, 6, 6); c.fillRect(19, 6, 6, 6); c.fillStyle = '#1d1d24'; c.fillRect(9 + f, 8, 2, 3); c.fillRect(21 + f, 8, 2, 3);
      c.fillStyle = '#ffd23f'; c.fillRect(11, 15, 10, 2);
    } });
    Q.defSprite('face-eng-boss', { w: 16, h: 16, n: 1, draw: function (c) { engTestPaint(c, 16, 16, '#8a5ad8', '#5a3496', 0, true); } });

    Q.defEnemy('eng-walker', {   // walks, turns at walls and ledges
      name: 'TEST WALKER', w: 12, h: 11, hp: 2, xp: 4, tokens: 2, touch: 1, sprite: 'eng-walker', col: '#e0604e',
      update: function (e) {
        if (e.wallL) e.face = 1; else if (e.wallR) e.face = -1;
        else if (e.ground && !Q.solid(e.face > 0 ? e.x + e.w + 1 : e.x - 1, e.y + e.h + 2)) e.face = -e.face;
        e.vx = e.face * 30; e.frame = Math.floor(e.t * 4) % 2;
      }
    });
    Q.defEnemy('eng-lift', {   // a lift that carries the conductor 80 px to the right and back
      name: 'TEST LIFT', w: 32, h: 8, hp: 1, touch: 0, gravity: 0, solid: false, platform: true, sprite: 'eng-lift',
      init: function (e) { e.data.x0 = e.x; e.face = 1; },
      update: function (e) { if (e.x > e.data.x0 + 80) e.face = -1; else if (e.x < e.data.x0) e.face = 1; e.vx = e.face * 40; }
    });
    Q.defBoss('eng-boss', {   // hops at the conductor every 1.6 s
      name: 'TEST BOSS', w: 30, h: 22, hp: 6, xp: 20, tokens: 5, touch: 1, sprite: 'eng-boss', face: 'face-eng-boss', intro: 'eng-in', outro: 'eng-out', col: '#8a5ad8',
      update: function (e) {
        var P = Q.P;
        if (e.ground) { e.vx = 0; if (e.stT > 1.6 && P) { e.st = e.st === 'a' ? 'b' : 'a'; e.face = P.x < e.x ? -1 : 1; e.vy = -300; e.vx = e.face * 90; } }
        e.frame = e.ground ? 0 : 1;
      }
    });
    Q.defScript('eng-in', [{ who: 'boss', text: 'THE ENGINE TEST BOSS. SIX HITS AND I GO.' }]);
    Q.defScript('eng-out', [{ who: 'none', text: 'THE TEST BOSS IS BEATEN.' }]);
    Q.defMemo('eng-m1', { title: 'TEST MEMO', text: 'THE ENGINE TEST MEMO. NOTHING TO SEE HERE.' });

    Q.defLevel('eng-test', {
      world: 0, name: 'ENGINE TEST', legend: { a: 'eng-walker', b: 'eng-lift' }, signs: ['ENGINE TEST: A JUMPS, B SWINGS.', 'UP AT THE DOOR TO GO IN.'], memos: ['eng-m1'],
      next: 'eng-arena',
      map: [
        '                                                                               #',
        '                                                                               #',
        '                                                                               #',
        '                                                                               #',
        '                                                                               #',
        '                                                                               #',
        '                                                                               #',
        '                                                                               #',
        '                             oo                                                #',
        '                            ====                                ###            #',
        '                                        PPP                     ###            #',
        '  S  !  oo  X  K          a        ^^   PPP  m h @ k  b         ###   ! E      #',
        '##################   #################################      ####################',
        '##################   #################################      ####################'
      ]
    });
    Q.defLevel('eng-arena', {
      world: 0, name: 'ENGINE TEST ARENA', boss: 'eng-boss', agent: 'c1', ability: 'dash',
      map: [
        '#                      #',
        '#                      #',
        '#                      #',
        '#                      #',
        '#                      #',
        '#                      #',
        '#                      #',
        '#       =====          #',
        '#                      #',
        '#                      #',
        '# S R             Z    #',
        '########################',
        '########################'
      ]
    });
    Q.defLevel('eng-flat', {   // for measuring: a long flat floor, a ledge 3 tiles up (columns 70 to 79) to walk off, a thin shelf and a column of pound blocks
      world: 0, name: 'ENGINE FLAT',
      map: [
        '                                                                                                    ',
        '                                                                                                    ',
        '                                                                                                    ',
        '                                                                                                    ',
        '                                                                                                    ',
        '                                                                                                    ',
        '                                                                                                    ',
        '                              =====                                                     P           ',
        '                                                                      ##########        P           ',
        '                                                                      ##########        P           ',
        '  S                                                                   ##########        P           ',
        '####################################################################################################',
        '####################################################################################################'
      ]
    });
    Q.defLevel('eng-tall', {   // for the camera: 40 rows of thin shelves going up, a door at the top
      world: 0, name: 'ENGINE TALL',
      map: [
        '#                  #',
        '#        E         #',
        '#       ####       #',
        '#                  #',
        '# ======           #',
        '#                  #',
        '#                  #',
        '#           ====== #',
        '#                  #',
        '#                  #',
        '# ======           #',
        '#                  #',
        '#                  #',
        '#           ====== #',
        '#                  #',
        '#                  #',
        '# ======           #',
        '#                  #',
        '#                  #',
        '#           ====== #',
        '#                  #',
        '#                  #',
        '# ======           #',
        '#                  #',
        '#                  #',
        '#           ====== #',
        '#                  #',
        '#                  #',
        '# ======           #',
        '#                  #',
        '#                  #',
        '#           ====== #',
        '#                  #',
        '#                  #',
        '# ======           #',
        '#                  #',
        '#                  #',
        '#  S               #',
        '####################',
        '####################'
      ]
    });
    Q.defSprite('eng-arrow', { w: 4, h: 4, n: 1, draw: function (c) { c.fillStyle = '#ff0000'; c.fillRect(0, 0, 4, 4); } });     // for the twin check: red,
    Q.defSprite('eng-arrow-l', { w: 4, h: 4, n: 1, draw: function (c) { c.fillStyle = '#0000ff'; c.fillRect(0, 0, 4, 4); } });   // and its facing-left twin blue
    Q.defLevel('eng-sec', {   // a secret door (D at column 16) to eng-bonus, with a crate, an enemy and a quiet checkpoint to keep as they were
      world: 0, name: 'ENGINE SECRET', legend: { a: 'eng-walker' }, secret: 'eng-bonus',
      map: [
        '..............................',
        '..............................',
        '..............................',
        '..............................',
        '..............................',
        '..............................',
        '..............................',
        '..............................',
        '..............................',
        '..............................',
        '.S...X...a..k...D.........E...',
        '##############################',
        '##############################'
      ]
    });
    Q.defLevel('eng-bonus', {   // its bonus level: a few tokens, and the E that brings him back to the D
      world: 0, name: 'ENGINE BONUS', bonus: true,
      map: [
        '....................',
        '....................',
        '....................',
        '....................',
        '....................',
        '....................',
        '....................',
        '....................',
        '....................',
        '....................',
        '.S..oooo.......E....',
        '####################',
        '####################'
      ]
    });
    Q.defEnemy('eng-top', { name: 'TEST TOP', w: 8, h: 8, hp: 1, touch: 0, gravity: 0, solid: false, nohit: true,   // for the check of drawTop: a green bar over him
      drawTop: function (e, g, Q) { var P = Q.P; if (!P) return; g.fillStyle = '#00ff00'; g.fillRect(Math.round(P.x - Q.cam.x), Math.round(P.y - Q.cam.y) + 4, 10, 2); } });
