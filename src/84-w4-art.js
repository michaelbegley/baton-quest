    // ---------- 84-w4-art.js: WORLD 4, THE BACKLOG: the palette, SCOPE CREEP's face, the tiles (B9) ----------
    // Sticky yellow, pink, ticket blue, a dark purple sky, vine green. Everything here is data: sprites are built by the engine at start.
    Q.w4 = Q.w4 || {};
    function w4Palette() {   // hoisted: any of my files may call it at load time, in any order
      return Q.w4PAL || (Q.w4PAL = {
      k: '#1d1d24', K: '#2a2238',                       // outline, deep shadow
      y: '#ffd23f', Y: '#d9a521', u: '#fff09a',         // sticky yellow, its shadow, its light
      p: '#f58fbf', P: '#c85d92', q: '#ffc3dd',         // sticky pink
      b: '#4f93e0', B: '#2c5fa8', c: '#a8cdf5',         // ticket blue
      w: '#f2f5fb', W: '#c9cfdc',                       // ticket paper
      g: '#4caf4f', G: '#2e7a3a', j: '#1f5229', l: '#93d46a',   // vine green
      r: '#e8483f', R: '#a82b2b',                       // red (URGENT, the pins)
      o: '#ff8a1e',                                     // the office orange
      n: '#b07a45', N: '#7f5430', m: '#d9a46a',         // cardboard
      v: '#3b2560', V: '#241640', x: '#6a4c9c',         // purple
      s: '#d4d8e2', S: '#8a8fa0',                       // pin silver
      e: '#fff7d6', t: '#2ec4b6',                       // eye glow, teal
      d: '#42559a', D: '#2f3c78', f: '#7486c9', i: '#b4abd0', I: '#8a80ab'   // the packed tickets of the ground
      });
    }

    // SCOPE CREEP's face for the text box (16 by 16): a tangle of vines, sticky notes for hair, two ticket eyes. Frame 1 talks (the text box swaps 0 and 1 while typing).
    Q.defSprite('face-creep', { w: 16, h: 16, pal: w4Palette(), frames: [[
      '.l.kyyyyk.kppppk',
      'lgkyuuyyYkpqqppP',
      '.kkyuyyyYkpqpppP',
      '.kgkYYYYkgkPPPPk',
      'kglgggglggglgggk',
      'kglkkkkkgkkkkkgk',
      'kgkbcwwwkcwwwbkG',
      'kgkbwkkwkwkkwbkG',
      'kgkbwkkwkwkkwbkG',
      'kGkBBBBBkBBBBBkG',
      'kgGkkkkkgkkkkkGk',
      'lkglgGggggggGgkl',
      '.kgkkGgggggGkkk.',
      '.kgGgkkkkkkkgGk.',
      '..kGgggkqPkgGk..',
      '...kkGgkpPkkk...'
    ], [
      '.l.kyyyyk.kppppk',
      'lgkyuuyyYkpqqppP',
      '.kkyuyyyYkpqpppP',
      '.kgkYYYYkgkPPPPk',
      'kglgggglggglgggk',
      'kglkkkkkgkkkkkgk',
      'kgkbcwwwkcwwwbkG',
      'kgkbwkkwkwkkwbkG',
      'kgkbwkkwkwkkwbkG',
      'kGkBBBBBkBBBBBkG',
      'kgGkkkkkgkkkkkGk',
      'lkglgGggggggGgkl',
      '.kgkkkkkkkkkkkk.',
      '.kgGkKKKqPKKkGk.',
      '..kGgkkkpPkkgk..',
      '...kkGgggggkkk..'
    ]] });

    // ---------- the tiles: packed tickets with vine moss on top, a sticky-note shelf, upturned pins, a LATER box, a strapped bale ----------
    Q.defSprite('t4-solid', { w: 16, h: 16, pal: w4Palette(), frames: [[
      '.l...lg....gl..l',
      'lglgllgglgglggll',
      'gGgggGgggGgggGgg',
      'GjGGjGjGGjGGjGjG',
      'KjKKKjKKKKjKKKjK',
      'iiiiiiiiiiiiKiii',
      'iIIIiIIiIIiiKiIi',
      'iiiiiiiiiiiiKiii',
      'IIIIIIIIIIIIIIII',
      'KKKKKKKKKKKKKKKK',
      'fffDffffffffffff',
      'dddDdddddddddddd',
      'dddDddiddddddddd',
      'dddDdddddddddddd',
      'DDDDDDDDDDDDDDDD',
      'KKKKKKKKKKKKKKKK'
    ], [
      'fffffffDffffffff',
      'dddddddDdddddddd',
      'didddddDddddiddd',
      'DDDDDDDDDDDDDDDD',
      'KKKKKKKKKKKKKKKK',
      'iiiiiiiiiiiiKiii',
      'iIIIiIIiIIiiKiIi',
      'iiiiiiiiiiiiKiii',
      'IIIIIIIIIIIIIIII',
      'KKKKKKKKKKKKKKKK',
      'fffDffffffffffff',
      'dddDdddddddddddd',
      'dddDddiddddddddd',
      'dddDdddddddddddd',
      'DDDDDDDDDDDDDDDD',
      'KKKKKKKKKKKKKKKK'
    ]] });
    Q.defSprite('t4-oneway', { w: 16, h: 16, pal: w4Palette(), frames: [[
      '.kkkkkkkkkkkkkk.',
      'kuuuuuurruuuuuyk',
      'kyyyyyyRRyyyyyYk',
      'kyyyyyyyyyyyyYYk',
      'kYYYYYYYYYYYYYkk',
      '.kkkkkkkkkkkkkk.',
      '................', '................', '................', '................', '................',
      '................', '................', '................', '................', '................'
    ]] });
    Q.defSprite('t4-spike', { w: 16, h: 16, pal: w4Palette(), frames: [[   // upturned pushpins: 2-pixel needles with a dark outline (ART's review)
      '................', '................', '................', '................',
      '..kk...kk...kk..',
      '.kssk.kssk.kssk.',
      '.ksSk.ksSk.ksSk.',
      '.ksSk.ksSk.ksSk.',
      '.ksSk.ksSk.ksSk.',
      '.kSSk.kSSk.kSSk.',
      '.kSSk.kSSk.kSSk.',
      'krrrRkpppPkyyyYk',
      'krrrRkpppPkyyyYk',
      'kRRRRkPPPPkYYYYk',
      '.kkkk.kkkk.kkkk.',
      '................'
    ]] });
    Q.defSprite('t4-crate', { w: 16, h: 16, pal: w4Palette(), frames: [[
      'kkkkkkkkkkkkkkkk',
      'kmmmmmmmmmmmmmnk',
      'knnnnnnnnnnnnnNk',
      'kNNNNNNNNNNNNNNk',
      'kkkkkkkkkkkkkkkk',
      'kmnnnnnnnnnnnnNk',
      'knnnkkkkkkkknnNk',
      'knnnkwwwwwwknnNk',
      'knnnkwrrrrwknnNk',
      'knnnkwwwwwwknnNk',
      'knnnkkkkkkkknnNk',
      'knnnnnnnnnnnnnNk',
      'knnnnnkkkknnnnNk',
      'knnnnnnnnnnnnnNk',
      'kNNNNNNNNNNNNNNk',
      'kkkkkkkkkkkkkkkk'
    ]] });
    Q.defSprite('t4-pound', { w: 16, h: 16, pal: w4Palette(), frames: [[
      'kkkkkkkkkkkkkkkk',
      'kxxxxxxxxxxxxxvk',
      'kxvvvvvvvvvvvvVk',
      'ksssssssssssssSk',
      'kxvvvvyyyyvvvvVk',
      'kxvvvvyyyyvvvvVk',
      'kxvvvvyyyyvvvvVk',
      'kxvyyyyyyyyyyvVk',
      'kxvvyyyyyyyyvvVk',
      'kxvvvyyyyyyvvvVk',
      'kxvvvvyyyyvvvvVk',
      'kxvvvvvyyvvvvvVk',
      'ksssssssssssssSk',
      'kxvvvvvvvvvvvvVk',
      'kVVVVVVVVVVVVVVk',
      'kkkkkkkkkkkkkkkk'
    ]] });
