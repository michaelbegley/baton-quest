    // ---------- 81-w1-art-d.js: WORLD 1, THE INBOX: THE REPLY-ALL HYDRA's art (builder 6) ----------
    // A head (20 by 14): 0 its flap shut, 1 its flap thrown open (it is about to bite), 2 the bite (snapped shut, eyes squeezed), 3 dazed on the floor.
    Q.defSprite('hydra-head', { w: 20, h: 14, pal: Q.w1.C, frames: [[
      '....................', '....................', '....................', '....................',
      '.kkkkkkkkkkkkkkkkkk.', '.kwEwwwwwwwwwwwwEwk.', '.kwwEEwwwwwwwwEEwwk.', '.kwwwwEEwwwwEEwwwwk.', '.kwwwwwwEEEEwwwwwwk.',
      '.kwwwwwwwwwkkwwkkwk.', '.kwwwwwwwwwkkwwkkek.', '.kwwwwwwwwwwwwwwwek.', '.keeeeeeeeeeeeeeeek.', '.kkkkkkkkkkkkkkkkkk.'
    ], [
      '.........kk.........', '.......kkEEkk.......', '.....kkEEEEEEkk.....', '...kkEEEEEEEEEEkk...',
      '.kkkkkkkkkkkkkkkkkk.', '.kMwMwMwMwMwMwMwMwk.', '.kMMMMMMMMMMMMMMMMk.', '.kwwwwwwwwwwwwwwwwk.', '.kwwwwwwwwrrwwwrrwk.',
      '.kwwwwwwwwwrkwwkrwk.', '.kwwwwwwwwwwwwwwwek.', '.kwwwwwwwwwwwwwwwek.', '.keeeeeeeeeeeeeeeek.', '.kkkkkkkkkkkkkkkkkk.'
    ], [
      '....................', '....................', '....................', '....................',
      '.kkkkkkkkkkkkkkkkkk.', '.kwEwwwwwwwwwwwwEwk.', '.kwwEEwwwwwwwwEEwwk.', '.kwwwwEEwwwwEEwwwwk.', '.kwwwwwwEEEEwwwwwwk.',
      '.kwwwwwwwwwwwwwwwwk.', '.kwwwwwwwwkkkwkkkek.', '.kwwwwwwwwwwwwwwwek.', '.keeeeeeeeeeeeeeeek.', '.kkkkkkkkkkkkkkkkkk.'
    ], [
      '....................', '....................', '....................', '....................',
      '.kkkkkkkkkkkkkkkkkk.', '.kwEwwwwwwwwwwwwEwk.', '.kwwEEwwwwwwwwEEwwk.', '.kwwwwEEwwwwEEwwwwk.', '.kwwwwwwEEEEwwwwwwk.',
      '.kwwwwwwwwkwkwkwkwk.', '.kwwwwwwwwwkwwwkwwk.', '.kwwwwwwwwkwkwkwkek.', '.keeeeeeeeeeeeeeeek.', '.kkkkkkkkkkkkkkkkkk.'
    ]] });
    // its face for the text box (16 by 16; frame 1 talks)
    Q.defSprite('face-hydra', { w: 16, h: 16, pal: Q.w1.C, frames: [[
      '.......kk.......', '.....kkEEkk.....', '...kkEEEEEEkk...', '.kkEEEEEEEEEEkk.', 'kkkkkkkkkkkkkkkk', 'kMwMwMwMwMwMwMwk', 'kMMMMMMMMMMMMMMk', 'kwwwwwwwwwwwwwwk',
      'kwwrrwwwwwwrrwwk', 'kwwwrkwwwwkrwwwk', 'kwwwwwwwwwwwwwek', 'kwwwwwRRRRwwwwek', 'kwwwwwwwwwwwwwek', 'keeeeeeeeeeeeeek', 'kkkkkkkkkkkkkkkk', '................'
    ], [
      '.......kk.......', '.....kkEEkk.....', '...kkEEEEEEkk...', '.kkEEEEEEEEEEkk.', 'kkkkkkkkkkkkkkkk', 'kwMwMwMwMwMwMwMk', 'kMMMMMMMMMMMMMMk', 'kMMMMMMMMMMMMMMk',
      'kwwrrwwwwwwrrwwk', 'kwwwrkwwwwkrwwwk', 'kwwwwwwwwwwwwwek', 'kwwwwRwwwwRwwwek', 'kwwwwwRRRRwwwwek', 'keeeeeeeeeeeeeek', 'kkkkkkkkkkkkkkkk', '................'
    ]] });

    // ---------- the huge mailbox the necks rise out of (80 by 80): 0 the slot open and stuffed, 1 shut, its plate turned to READ ----------
    function w1R3(g, col, x, y, w, h) { g.fillStyle = Q.w1.C[col] || col; g.fillRect(x, y, w, h); }
    Q.defSprite('hydra-box', { w: 80, h: 80, n: 2, draw: function (g, f) {
      var i;
      w1R3(g, 'k', 61, 2, 4, 36); w1R3(g, 'S', 62, 2, 2, 36);                                   // the flag's pole, behind
      if (!f) { w1R3(g, 'k', 64, 2, 15, 11); w1R3(g, 'r', 65, 3, 13, 9); w1R3(g, 'p', 65, 3, 13, 2); w1R3(g, 'R', 65, 10, 13, 2); }
      w1R3(g, 'k', 10, 10, 60, 6); w1R3(g, 'k', 6, 14, 68, 6); w1R3(g, 'k', 3, 18, 74, 58);    // the outline, a rounded top
      w1R3(g, 'b', 11, 11, 58, 6); w1R3(g, 'b', 7, 15, 66, 6); w1R3(g, 'b', 4, 19, 72, 56);
      w1R3(g, 'n', 11, 11, 40, 2); w1R3(g, 'n', 7, 15, 6, 4); w1R3(g, 'n', 4, 19, 4, 50);       // light from the top left
      w1R3(g, 'B', 70, 19, 6, 56); w1R3(g, 'B', 4, 70, 72, 5);
      for (i = 0; i < 5; i++) w1R3(g, 'B', 12 + i * 14, 52, 8, 1);                               // ribs
      if (!f) {   // the slot, thrown open and stuffed with replies
        w1R3(g, 'k', 14, 20, 52, 12); w1R3(g, 'M', 16, 22, 48, 8);
        w1R3(g, 'w', 18, 21, 6, 3); w1R3(g, 'e', 27, 22, 5, 2); w1R3(g, 'w', 48, 21, 7, 3); w1R3(g, 'e', 57, 22, 5, 2); w1R3(g, 'w', 37, 28, 6, 2);
      } else { w1R3(g, 'k', 14, 24, 52, 4); w1R3(g, 'M', 16, 25, 48, 2); }
      w1R3(g, 'k', 16, 36, 48, 13); w1R3(g, 'c', 17, 37, 46, 11); w1R3(g, 'C', 17, 46, 46, 2);   // the plate
      if (!f) Q.w1.tiny(g, 'REPLY ALL', 22, 40, 'b'); else Q.w1.tiny(g, 'READ', 32, 40, 't');
      w1R3(g, 'k', 10, 74, 12, 6); w1R3(g, 'k', 58, 74, 12, 6); w1R3(g, 'G', 11, 75, 10, 4); w1R3(g, 'G', 59, 75, 10, 4);
      if (f) { w1R3(g, 'k', 64, 24, 11, 15); w1R3(g, 'r', 65, 25, 9, 13); w1R3(g, 'p', 65, 25, 2, 13); w1R3(g, 'R', 65, 35, 9, 3); }   // beaten: its flag down
    } });
    // a neck is a chain of letters: one link (8 by 7)
    Q.defSprite('hydra-link', { w: 8, h: 7, pal: Q.w1.C, frames: [
      ['.kkkkkk.', 'kwwwwwwk', 'kwEwwEwk', 'kwwEEwwk', 'kwwwwwek', 'keeeeeek', '.kkkkkk.'],
      ['.kkkkkk.', 'keeeeeek', 'keEeeEek', 'keeEEeek', 'keeeeeEk', 'kEEEEEEk', '.kkkkkk.']
    ] });
    // a clear tile: solid, drawn as nothing (the wall behind the mailbox)
    Q.defSprite('w1-clear', { w: 16, h: 16, n: 1, draw: function () {} });
