    // ---------- 84-w4-tiles.js: WORLD 4's own tiles: vines that block the way, buds that grow into vines, and the dressing of the place (B9) ----------
    Q.defSprite('t4-vine', { w: 16, h: 16, pal: w4Palette(), frames: [[
      '.kGk..kgGk..kGk.',
      'kglGk.kglGkkglGk',
      'kgGjGkkgGjGkgGjk',
      '.kGjgGlgGjgGGjk.',
      '..kjgglggGjjGk..',
      '.kkgglGkkgGjjGk.',
      'kglgGGkyykgGjgGk',
      'kgGGjkkyYkkGgglk',
      'kGjkkkglllkkgjGk',
      '.kk.kgllGgGkkGk.',
      '..kkgGlgGjGkGk..',
      '.kgGjgGGjjGgkpk.',
      'kglgGjkkGjjGgkPk',
      'kgGjjk..kGGjglk.',
      '.kGjk..kkGjGgGk.',
      '..kk..kgk.kkkk..'
    ]] });
    // a bud: where a vine will grow when the conductor comes near (the faint corners show the square it will fill)
    Q.defSprite('t4-bud', { w: 16, h: 16, pal: w4Palette(), frames: [[
      'jj............jj',
      'j..............j',
      '................', '................', '................', '................', '................',
      '.......l........',
      '......lgl.......',
      '.......g..l.....',
      '....l..g.lg.....',
      '....gl.g.g......',
      '.....g.gg.......',
      '......kgGk......',
      'j....kGjGGk....j',
      'jj..kGGjjGGk..jj'
    ], [
      'jj............jj',
      'j..............j',
      '................', '................', '................', '................', '................',
      '........l.......',
      '.......lgl......',
      '...l...g........',
      '...gl..g..l.....',
      '....g..g.lg.....',
      '.....g.gg.......',
      '......kgGk......',
      'j....kGjGGk....j',
      'jj..kGGjjGGk..jj'
    ]] });
    Q.defSprite('t4-pile', { w: 16, h: 16, pal: w4Palette(), frames: [[
      '................', '................', '................', '................', '................', '................', '................',
      '......kkkk......',
      '.....kwwwWk.....',
      '...kkkcbbBkkk...',
      '..kyyykkkkpppk..',
      '.kyuyYkwwwkqpPk.',
      'kkYYYkwwWWkkPPkk',
      'kbbbkkkkkkkkbbbk',
      'kcbbBkyyyYkcbbBk',
      'kkkkkkkkkkkkkkkk'
    ]] });
    Q.defSprite('t4-notes', { w: 16, h: 16, pal: w4Palette(), frames: [[
      '................',
      '..kkkkk.........',
      '..kyuyk.........',
      '..kyyYk...kkkkk.',
      '..kYYYk...kpqpk.',
      '..kkkkk...kpppk.',
      '..........kPPPk.',
      '.....kkkkkkkkkk.',
      '.....kcbbk......',
      '.....kbbBk......',
      '.....kkkkk......',
      '................', '................', '................', '................', '................'
    ]] });
    Q.defSprite('t4-hang', { w: 16, h: 16, pal: w4Palette(), frames: [[
      '.......gk.......',
      '.......Gg.......',
      '......lgG.......',
      '.....lgkG.......',
      '.......gGk......',
      '.......kGg......',
      '........gGl.....',
      '........Ggkl....',
      '.......gG.......',
      '......lgk.......',
      '.....lgGk.......',
      '.......Gg.......',
      '.......gGk......',
      '........gGl.....',
      '.......kGg......',
      '.......gGk......'
    ]] });
    Q.defSprite('t4-tuft', { w: 16, h: 16, pal: w4Palette(), frames: [[
      '................', '................', '................', '................', '................', '................',
      '................', '................', '................', '................', '................',
      '.....l....l.....',
      '..l..gl..lg..l..',
      '..gl.Gg.lgG.lg..',
      '.lgGlgGlgGglgGl.',
      '.jGjjGjjGjGjjGj.'
    ]] });
    // the LATER sign, two tiles wide ('[' then ']'), painted in code with a tiny 3 by 5 font of its own
    var w4Micro = { L: [4, 4, 4, 4, 7], A: [2, 5, 7, 5, 5], T: [7, 2, 2, 2, 2], E: [7, 4, 6, 4, 7], R: [6, 5, 6, 5, 5], N: [5, 7, 7, 7, 5], O: [2, 5, 5, 5, 2], W: [5, 5, 7, 7, 5], X: [5, 5, 2, 5, 5] };
    function w4MicroText(g, s, x, y, col) {   // tiny capitals for signs inside sprites (L A T E R N O W X)
      g.fillStyle = col;
      for (var i = 0; i < s.length; i++) {
        var b = w4Micro[s.charAt(i)]; if (!b) continue;
        for (var r = 0; r < 5; r++) for (var c = 0; c < 3; c++) if (b[r] & (4 >> c)) g.fillRect(x + i * 4 + c, y + r, 1, 1);
      }
    }
    function w4DrawLater(g, ox) {
      var P = w4Palette();
      g.fillStyle = P.N; g.fillRect(ox + 6, 9, 2, 7); g.fillRect(ox + 24, 9, 2, 7);   // posts
      g.fillStyle = P.n; g.fillRect(ox + 6, 9, 1, 7); g.fillRect(ox + 24, 9, 1, 7);
      g.fillStyle = P.k; g.fillRect(ox + 1, 1, 30, 10);                                 // the board
      g.fillStyle = P.w; g.fillRect(ox + 2, 2, 28, 8);
      g.fillStyle = P.W; g.fillRect(ox + 2, 9, 28, 1);
      w4MicroText(g, 'LATER', ox + 7, 3, P.r);
      g.fillStyle = P.p; g.fillRect(ox + 3, 2, 2, 2); g.fillStyle = P.P; g.fillRect(ox + 4, 3, 1, 1);   // a pin
    }
    Q.defSprite('t4-laterL', { w: 16, h: 16, n: 1, draw: function (g) { w4DrawLater(g, 0); } });
    Q.defSprite('t4-laterR', { w: 16, h: 16, n: 1, draw: function (g) { w4DrawLater(g, -16); } });

    // the world's own tiles (QUEST-API.md part 5 leaves capitals, digits and marks free): V a vine (the baton cuts it), G a bud (grows into V), and dressing
    Q.defTile(4, 'V', { solid: true, breakBy: 'baton', art: 't4-vine' });
    Q.defTile(4, 'G', { solid: false, art: 't4-bud', fps: 3 });
    Q.defTile(4, '*', { solid: false, art: 't4-pile' });
    Q.defTile(4, ':', { solid: false, art: 't4-notes' });
    Q.defTile(4, '"', { solid: false, art: 't4-hang' });
    Q.defTile(4, ',', { solid: false, art: 't4-tuft' });
    Q.defTile(4, '[', { solid: false, art: 't4-laterL' });
    Q.defTile(4, ']', { solid: false, art: 't4-laterR' });
