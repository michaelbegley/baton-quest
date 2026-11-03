    // ---------- 23-art-ui-moves.js (ART, B21 MOVES, 2 Nov): the two new moves' icons and THE FOLLOW-UP, the email that teaches FOLLOW UP (QUEST-API.md part 23) ----------
    // ic-walljump: PUSHBACK, an arrow kicking up and away from a wall, on the office's orange (the conductor's own move, not an agent's colour).
    // ic-doublejump: FOLLOW UP, two jumps up, on the office's teal. followup (12 by 10, 2 frames): a cream envelope, its flap, an orange stamp, a glint.
    Q.art.icon('ic-walljump', { C: '#ff8a1e', L: '#ffc58a', D: '#c45f0a', q: '#5a2a06' },
      ['w..wwww.', 'w...www.', 'w..w.ww.', 'w.w...w.', 'ww......', 'w.......', 'w.......', 'w.......']);
    Q.art.icon('ic-doublejump', { C: '#2ec4b6', L: '#a6efe8', D: '#1d8f85', q: '#0c3f3a' },
      ['...ww...', '..wwww..', '.ww..ww.', '........', '...ww...', '..wwww..', '.ww..ww.', '........']);
    Q.art.def('followup', 12, 10, Q.art.pal({ c: '#f6efe2', m: '#d8cbb0', n: '#a8987a', o: '#ff8a1e', O: '#ffc58a', w: '#ffffff' }), [
      [
        '.kkkkkkkkkk. .kkkkkkkkkk.',
        'kcmccccccmOk kcmwcccccmOk',
        'kccmccccmcok kccmwcccmcok',
        'kcccmccmccck kcccmccmccck',
        'kccccmmcccck kccccmmcccck',
        'kcccccccccck kcccccccccck',
        'kcccccccccck kcccccccccck',
        'kmmmmmmmmmmk kmmmmmmmmmmk',
        'knnnnnnnnnnk knnnnnnnnnnk',
        '.kkkkkkkkkk. .kkkkkkkkkk.'
      ]
    ]);
