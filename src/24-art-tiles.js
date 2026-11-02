    // ---------- 24-art-tiles.js: the base tiles, world 0 (ART, builder 3) ----------
    // Plain and neutral: each world draws its own t<N>- tiles, and these show wherever one is missing. 16 by 16, made to sit side by side with no seams:
    // only the open top of a solid block has an outline. t0-solid: frame 0 when open above (a light cap), frame 1 under another solid; their brick courses
    // alternate (A B A B) so a stack of them reads as one wall. t0-spike: spikes in the bottom half only (the half that hurts).
    Q.art.def('t0-solid', 16, 16, Q.art.pal({ T: '#c3c9d6', t: '#9aa2b6', H: '#7d869e', B: '#646c84', b: '#525970', l: '#3a3f52' }), [
      [
        'kkkkkkkkkkkkkkkk lHHHHHHHlHHHHHHH',
        'TTTTTTTTTTTTTTTT lBBBBBBBlBBBBBBB',
        'tTttttTtttttTttt lbbbbbbblbbbbbbb',
        'llllllllllllllll llllllllllllllll',
        'HHHHlHHHHHHHlHHH HHHHlHHHHHHHlHHH',
        'BBBBlBBBBBBBlBBB BBBBlBBBBBBBlBBB',
        'bbbblbbbbbbblbbb bbbblbbbbbbblbbb',
        'llllllllllllllll llllllllllllllll',
        'lHHHHHHHlHHHHHHH lHHHHHHHlHHHHHHH',
        'lBBBBBBBlBBBBBBB lBBBBBBBlBBBBBBB',
        'lbbbbbbblbbbbbbb lbbbbbbblbbbbbbb',
        'llllllllllllllll llllllllllllllll',
        'HHHHlHHHHHHHlHHH HHHHlHHHHHHHlHHH',
        'BBBBlBBBBBBBlBBB BBBBlBBBBBBBlBBB',
        'bbbblbbbbbbblbbb bbbblbbbbbbblbbb',
        'llllllllllllllll llllllllllllllll'
      ]
    ]);
    // t0-oneway: a thin girder to stand on (jump up through it, Down and A to drop), with two small brackets under it.
    Q.art.def('t0-oneway', 16, 16, Q.art.pal({ T: '#d8dce6', t: '#a9b0c2', b: '#6f7690', r: '#eef0f5' }), [
      [
        'kkkkkkkkkkkkkkkk',
        'TTTTTTTTTTTTTTTT',
        'ttrtttttttrttttt',
        'bbbbbbbbbbbbbbbb',
        'kkkkkkkkkkkkkkkk',
        '..kbk......kbk..',
        '...kk.......kk..',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................'
      ]
    ]);
    // t0-spike: two steel spikes, light on their left faces, standing in the bottom half of the tile.
    Q.art.def('t0-spike', 16, 16, Q.art.pal({ W: '#eef1f6', x: '#b4bbcc', s: '#7a8199', b: '#4a5068' }), [
      [
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
        '...kk.......kk..',
        '..kWsk.....kWsk.',
        '..kWsk.....kWsk.',
        '.kWxssk...kWxssk',
        '.kWxssk...kWxssk',
        'kWWxsssk.kWWxssk',
        'kWxxsssskWxxsssk',
        'bbbbbbbbbbbbbbbb'
      ]
    ]);
    // t0-crate: a wooden crate with a brace and nails (the baton or a ground pound breaks it).
    Q.art.def('t0-crate', 16, 16, Q.art.pal({ L: '#c08a58', F: '#9c6640', d: '#6a4024', n: '#3a3540' }), [
      [
        'kkkkkkkkkkkkkkkk',
        'kLLLLLLLLLLLLLLk',
        'kLnFFFFFFFFFFndk',
        'kLFkkkkkkkkkkFdk',
        'kLFkFFFFFFLLkFdk',
        'kLFkFFFFFLLdkFdk',
        'kLFkFFFFLLdFkFdk',
        'kLFkFFFLLdFFkFdk',
        'kLFkFFLLdFFFkFdk',
        'kLFkFLLdFFFFkFdk',
        'kLFkLLdFFFFFkFdk',
        'kLFkLdFFFFFFkFdk',
        'kLFkkkkkkkkkkFdk',
        'kLnFFFFFFFFFFndk',
        'kddddddddddddddk',
        'kkkkkkkkkkkkkkkk'
      ]
    ]);
    // t0-pound: a heavy riveted block with a crack and an arrow pointing down: only FIRM HAND (a ground pound) breaks it.
    Q.art.def('t0-pound', 16, 16, Q.art.pal({ H: '#a7a2c0', M: '#7f7a9c', s: '#5e5a78', r: '#d6d2e6', w: '#e9e6f4', c: '#3a3550' }), [
      [
        'kkkkkkkkkkkkkkkk',
        'kHHHHHHHHHHHHHHk',
        'kHrMMMMMMMMMMrsk',
        'kHMMMMMwwMMMMMsk',
        'kHMMMMMwwMMMMMsk',
        'kHMMMMMwwMMMMMsk',
        'kHMMMwwwwwwMMMsk',
        'kHMMMMwwwwMMMMsk',
        'kHMMMMMwwMMMMMsk',
        'kHMMMMMMMMMMMMsk',
        'kHMcMMMMMMMMMcsk',
        'kHMMccMMMMMccMsk',
        'kHMMMMccMccMMMsk',
        'kHrMMMMMcMMMMrsk',
        'kssssssssssssssk',
        'kkkkkkkkkkkkkkkk'
      ]
    ]);
