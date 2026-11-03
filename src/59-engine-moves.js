    // ---------- 59-engine-moves.js (ENGINE, B21 MOVES, 2 Nov): where the two new moves are learned (QUEST-API.md part 23) ----------
    // PUSHBACK: at the end of the story, in THE ROOT TICKET (w4-boss has ability: 'walljump'): SCOPE CREEP is told no at last, and the arena's own learn step
    // (55-engine-level.js) teaches it after w4-won, with learn-walljump. Not in THE ENCORE (its fights have no rescue). A file that won before this version
    // learns it the first time it is continued, with its toast.
    // FOLLOW UP: a found thing, THE FOLLOW-UP (the legend's 'followup'), an unread email stuck at the top of a shaft behind SPAM TOWER (w1-3) that only
    // PUSHBACK climbs: touching it teaches FOLLOW UP, with learn-doublejump. Once known it is not there any more. Its def says move and need, so the lint
    // checks it is reached with what it needs and never without (tools/quest_lint_reach.js).
    Q.defEnemy('followup', {
      name: 'THE FOLLOW-UP', w: 10, h: 8, hp: 1, xp: 0, tokens: 0, touch: 0, gravity: 0, solid: false, nohit: true, sprite: 'followup',
      move: 'doublejump', need: 'walljump',   // what it teaches, and the move it takes to reach it
      init: function (e) {
        e.face = 1;
        if (e.o && typeof e.o.tx === 'number') { e.x = e.o.tx * 16 + 3; e.y = e.o.ty * 16 + 4; }   // in the middle of its tile, floating
        e.y0 = e.y;
        if (Q.has('doublejump')) e.dead = true;   // read once: gone for good
      },
      update: function (e) { e.y = e.y0 + Math.round(Math.sin(e.t * 2.4) * 1.5); e.frame = Math.floor(e.t * 3) % 2; e.vx = 0; e.vy = 0; },
      got: function (e) {
        if (e.dead) return;
        e.dead = true;
        Q.fx('confetti', e.x + 5, e.y + 4, { n: 24 }); Q.fx('spark', e.x + 5, e.y + 4, { n: 8, col: '#ffd23f' });
        if (engOwn(Q.SFX, 'secret')) Q.sfx('secret');
        Q.learn('doublejump');
        engSay('learn-doublejump');
        Q.saveGame();
      }
    });
    // The tokens for the new moves: the legend's movetoken (one) and movebig (five), drawn and picked up as the map's o and O, placed where only PUSHBACK
    // or FOLLOW UP reach (the lint checks it: their def's spot). Their bob is their tile's, not Q.rand's, so a level that has them draws the same random
    // numbers as before (its enemies do what they did); a map's o would draw one.
    function engMoveTok(id, kind, w, n) {
      Q.defEnemy(id, {
        name: 'TOKEN', w: w, h: w, hp: 1, xp: 0, tokens: 0, touch: 0, gravity: 0, solid: false, nohit: true, sprite: kind, spot: kind,
        init: function (e) { var o = e.o || {}; if (typeof o.tx === 'number') { e.x = o.tx * 16 + (16 - w) / 2; e.y = o.ty * 16 + (16 - w) / 2; } e.bob = ((o.tx | 0) * 5 + (o.ty | 0) * 3) % 6; },
        update: function (e) { e.frame = Math.floor(e.t * 8 + e.bob); e.vx = 0; e.vy = 0; },
        draw: function (e, g) {   // 53-engine-ents-b.js's pickup, standing
          var s = engSheet(e.sprite), dy = Math.round(Math.sin(Q.t * 3 + e.bob) * 1.5);
          if (!s) { Q.spr(g, e.sprite, 0, e.x - Q.cam.x, e.y - Q.cam.y + dy); return; }
          engBlit(g, s, e.frame, e.x + (e.w - s.w) / 2 - Q.cam.x, e.y + e.h - s.h - Q.cam.y + dy, false, false);
        },
        got: function (e) {
          var cx = e.x + e.w / 2, cy = e.y + e.h / 2;
          if (e.dead) return;
          Q.tokens(n); Q.sfx('token'); if (n > 1) Q.fx('text', cx, cy - 6, { text: '+' + n, col: '#ffd23f' }); Q.emit('pickup', { kind: kind, n: n });
          Q.fx('spark', cx, cy, { n: n > 1 ? 6 : 3 }); Q.remove(e);
        }
      });
    }
    engMoveTok('movetoken', 'token', 8, 1); engMoveTok('movebig', 'bigtoken', 12, 5);
    function engMovesCatchUp() {   // a file that beat SCOPE CREEP before this version: PUSHBACK now, with its toast
      var s = Q.SAVE;
      if (s && s.won && s.abilities && s.abilities.indexOf('walljump') < 0) Q.learn('walljump');
    }
    var engMovesCont0 = Q.continueGame;
    Q.continueGame = function () { engMovesCatchUp(); return engMovesCont0.apply(this, arguments); };
