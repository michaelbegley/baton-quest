    // ---------- 81-w1-art-c.js: WORLD 1, THE INBOX: the enemies' sprites (builder 6) ----------
    // Palette sprites in world 1's colours (Q.w1.C); every one faces right and the engine flips it. Frames are listed in the order the enemy uses them.
    // SPAM (14 by 12): 0 sitting, 1 squashed (it is about to hop), 2 in the air with its flap open.
    Q.defSprite('spam', { w: 14, h: 12, pal: Q.w1.C, frames: [[
      '..............', '.kkkkkkkkkkkk.', 'kwEwwwwwwwwEwk', 'kwwEwwwwwwEwek', 'kwwwEwwwwEwwek', 'kwwwwEEEEwwwek',
      'kwwwwwwwwwwwek', 'kwwwkwwwwkwwek', 'kwwwkwwwwkwrrk', 'kewwwwRRwwwrrk', 'keeeeeeeeeeeek', '.kkkkkkkkkkkk.'
    ], [
      '..............', '..............', '..............', '.kkkkkkkkkkkk.', 'kwEEwwwwwwEEwk', 'kwwwEEEEEEwwek',
      'kwwwwwwwwwwwek', 'kwwkkwwwwkkwek', 'kwwwwwRRwwwrrk', 'keeeeeeeeeerrk', 'keeeeeeeeeeeek', '.kkkkkkkkkkkk.'
    ], [
      '....kkkkkk....', '..kkEEyyEEkk..', '.kEEEEEEEEEEk.', 'kkkkkkkkkkkkkk', 'kwwwwwwwwwwwek', 'kwwwkwwwwkwwek',
      'kwwwkwwwwkwwek', 'kwwwwwwwwwwwek', 'kwwwwwRRwwwrrk', 'kwwwwRwwRwwrrk', 'keeeeeeeeeeeek', '.kkkkkkkkkkkk.'
    ]] });

    // UNSUB BOT (14 by 16): 0 and 1 walking, 2 leaning back with its bulb lit red (about to charge), 3 charging with its red stamp out.
    Q.defSprite('unsub', { w: 14, h: 16, pal: Q.w1.C, frames: [[
      '......k.......', '.....kyk......', '......k.......', '...kkkkkkkk...', '..ksssssssSk..', '..ksBBBBBBSk..', '..ksBBtBBtSk..', '..ksBBBBBBSk..',
      '..kSSSSSSSSk..', '...kkkkkkkk...', '..kwwwwwwwekk.', '..kwrwwrwwekSk', '..kwwrrwwwekk.', '..kwrwwrwwek..', '..kkkkkkkkkk..', '...kk....kk...'
    ], [
      '......k.......', '.....kyk......', '......k.......', '...kkkkkkkk...', '..ksssssssSk..', '..ksBBBBBBSk..', '..ksBBtBBtSk..', '..ksBBBBBBSk..',
      '..kSSSSSSSSk..', '...kkkkkkkk...', '..kwwwwwwwekk.', '..kwrwwrwwekSk', '..kwwrrwwwekk.', '..kwrwwrwwek..', '..kkkkkkkkkk..', '....kk..kk....'
    ], [
      '.....k........', '....krk.......', '.....k........', '..kkkkkkkk....', '.ksssssssSk...', '.ksBBBBBBSk...', '.ksBBrBBrSk...', '.ksBBBBBBSk...',
      '.kSSSSSSSSk...', '...kkkkkkkk...', '..kwwwwwwwek..', '..kwrwwrwwek..', '..kwwrrwwwek..', '..kwrwwrwwek..', '..kkkkkkkkkk..', '..kkk....kkk..'
    ], [
      '.......k......', '......kyk.....', '.......k......', '....kkkkkkkk..', '...ksssssssSk.', '...ksBBBBBBSk.', '...ksBBtBBtSk.', '...ksBBBBBBSk.',
      '...kSSSSSSSSk.', '...kkkkkkkk...', '..kwwwwwwwekkk', '..kwrwwrwwekrk', '..kwwrrwwwekrk', '..kwrwwrwwekkk', '..kkkkkkkkkk..', '..kk......kk..'
    ]] });

    // OUT OF OFFICE (16 by 14): a paper ghost, asleep; 0 and 1 drifting (its hem waves), 2 awake and about to auto-reply.
    Q.defSprite('ooo', { w: 16, h: 14, pal: Q.w1.C, frames: [[
      '....kkkkkkk.....', '...kwwwwwwwkk...', '..kwwwwwwwwEEk..', '..kwwwwwwwwwEk..', '.kwwwwwwwwwwwk..', '.kwwkkkwwkkkwk..', '.kwwwwwwwwwwwk..',
      '.kwwwwwwwwwwwk..', '.kwwwwwkkwwwwk..', '.kwwwwwwwwwwek..', '.keeeeeeeeeeek..', '.kekeeekeeekek..', '..k.kk.k.kk.k...', '................'
    ], [
      '....kkkkkkk.....', '...kwwwwwwwkk...', '..kwwwwwwwwEEk..', '..kwwwwwwwwwEk..', '.kwwwwwwwwwwwk..', '.kwwkkkwwkkkwk..', '.kwwwwwwwwwwwk..',
      '.kwwwwwwwwwwwk..', '.kwwwwwkkwwwwk..', '.kwwwwwwwwwwek..', '.keeeeeeeeeeek..', '.keeekeeekeeek..', '..kk.kk..kk.kk..', '................'
    ], [
      '....kkkkkkk.....', '...kwwwwwwwkk...', '..kwwwwwwwwEEk..', '..kwwwwwwwwwEk..', '.kwwwwwwwwwwwk..', '.kwwwkwwwwkwwk..', '.kwwwkwwwwkwwk..',
      '.kwwwwwwwwwwwk..', '.kwwwwkkkwwwwk..', '.kwwwwkMkwwwek..', '.keeeekkkeeeek..', '.kekeeekeeekek..', '..k.kk.k.kk.k...', '................'
    ]] });

    // FLAGGED (14 by 18): a red flag with eyes on a pole that comes up out of the floor; 0 and 1 flapping.
    Q.defSprite('flag', { w: 14, h: 18, pal: Q.w1.C, frames: [[
      '..kk..........', '.ksSk.........', '..sSkkkkkkkkk.', '..sSkrrrrrrrpk', '..sSkrkwrrkwrk', '..sSkrkkrrkkrk', '..sSkrrrrrrrrk', '..sSkrrkkkkrrk', '..sSkRRRRRRRRk',
      '..sSkkkkkkkkk.', '..sS..........', '..sS..........', '..sS..........', '..sS..........', '..sS..........', '..sS..........', '.kkkk.........', 'kkkkkk........'
    ], [
      '..kk..........', '.ksSk.........', '..sSkkkkkkk...', '..sSkrrrrrrkkk', '..sSkrkwrrkwpk', '..sSkrkkrrkkrk', '..sSkrrrrrrrrk', '..sSkrrkkkkrrk', '..sSkRRRRRRRRk',
      '..sSkkkkkkkkRk', '..sS.......kk.', '..sS..........', '..sS..........', '..sS..........', '..sS..........', '..sS..........', '.kkkk.........', 'kkkkkk........'
    ]] });

    // the shots: OUT OF OFFICE's auto-reply (8 by 6) and a falling letter (10 by 8, fluttering)
    Q.defSprite('w1-reply', { w: 8, h: 6, pal: Q.w1.C, frames: [
      ['kkkkkkkk', 'kwEwwEwk', 'kwwEEwwk', 'kwwwwwek', 'kkkkkkkk', '........'],
      ['kkkkkkkk', 'kwEwwEek', 'kwwEEwek', 'kewwwwek', 'kkkkkkkk', '........']
    ] });
    Q.defSprite('w1-letter', { w: 10, h: 8, pal: Q.w1.C, frames: [
      ['..........', '.kkkkkkkk.', '.kwEwwEwk.', '.kwwEEwwk.', '.kwwwwwek.', '.kkkkkkkk.', '..........', '..........'],
      ['..........', '..kkkkkkkk', '.kwEwwEwk.', '.kwwEEwek.', 'kwwwwwek..', 'kkkkkkkk..', '..........', '..........']
    ] });
