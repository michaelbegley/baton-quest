    // ---------- 84-w4-bonus-art.js: THE PARKING LOT's art (B9; drawn by B9's bonusart.py): the secret door (a LATER box, its flap open), parked ideas
    // (sticky-note cars asleep with a ticket on the windscreen; two tiles long, yellow or pink, frame 1 a little z) and a parking sign.
    Q.defSprite('t4-sdoor', { w: 16, h: 22, pal: w4Palette(), frames: [
      ['..kmmmNk........', '..kmmmNk........', '.kmmmNk...kkkk..', '.kmmmNk..kcccbk.', 'kmmmNk...kwccbk.', 'kmmmNkkkkkcccbk.', '.kKKKKKKKKKKKKk.', '.kKkkkkkkkkkkKk.', 'kmmmmmmmmmmmmmNk', 'knnnnnnnnnnnnnNk', 'knnnnnnnnnnnnnNk', 'knnnnnnnnnnnnnNk', 'knnnnnnnnnnnnnNk', 'knnnwwwwwwwwnnNk', 'knnnwrrrrrrwnnNk', 'knnnwwwwwwwwnnNk', 'knnnnnnnnnnnnnNk', 'knnnnnnnnnnnnnNk', 'knnnnnnnnnnnnnNk', 'knnnnnnnnnnnnnNk', 'kNNNNNNNNNNNNNNk', '.kkkkkkkkkkkkkk.'],
      ['.kmmmNk.........', 'kmmmNk..........', 'kmmmNk....kkkk..', 'kmmmNk...kcccbk.', 'mmmNk....kwccbk.', 'mmmNkkkkkkcccbk.', 'kkKKKKKKKKKKKKk.', '.kKkkkkkkkkkkKk.', 'kmmmmmmmmmmmmmNk', 'knnnnnnnnnnnnnNk', 'knnnnnnnnnnnnnNk', 'knnnnnnnnnnnnnNk', 'knnnnnnnnnnnnnNk', 'knnnwwwwwwwwnnNk', 'knnnwrrrrrrwnnNk', 'knnnwwwwwwwwnnNk', 'knnnnnnnnnnnnnNk', 'knnnnnnnnnnnnnNk', 'knnnnnnnnnnnnnNk', 'knnnnnnnnnnnnnNk', 'kNNNNNNNNNNNNNNk', '.kkkkkkkkkkkkkk.']
    ] });
    Q.defSprite('t4-car-yl', { w: 16, h: 16, pal: w4Palette(), frames: [
      ['................', '................', '................', '..kkkkkkkkkkkkkk', '.kuuuuuuuuuuuuuu', '.kyyyyyyyyyyyyyy', '.kyyyyyyyyyyyyyy', '.kyyyykkkyyykkky', '.kyyyyyyyyyyyyyy', '.kyyyyyyyyyyyyyy', '.kyyyyyyyKKKyyyy', '.kyyyyyyyyyyyyyy', '.kYYYkkkkkYYYYYY', '..kkkkSsSkkkkkkk', '.....kSSSk......', '.....kkkkk......'],
      ['...............k', '................', '...............k', '..kkkkkkkkkkkkkk', '.kuuuuuuuuuuuuuu', '.kyyyyyyyyyyyyyy', '.kyyyyyyyyyyyyyy', '.kyyyykkkyyykkky', '.kyyyyyyyyyyyyyy', '.kyyyyyyyyyyyyyy', '.kyyyyyyyKKKyyyy', '.kyyyyyyyyyyyyyy', '.kYYYkkkkkYYYYYY', '..kkkkSsSkkkkkkk', '.....kSSSk......', '.....kkkkk......']
    ] });
    Q.defSprite('t4-car-yr', { w: 16, h: 16, pal: w4Palette(), frames: [
      ['....kkkkkkkkk...', '...kuuuuuuuuYk..', '...kyycwrrcyYk..', 'kkkkyycwwwcyYk..', 'uuuuyycccccyYYk.', 'yyyyyyyyyyyyyYk.', 'yyyyyyyyyyyyyYk.', 'yyyyyyyyyyyyyYuk', 'yyyyyyyyyyyyyYk.', 'yyyyyyyyyyyyyYk.', 'yyyyyyyyyyyyyYk.', 'yyyyyyyyyyyyyYk.', 'YYYYYYkkkkkYYYk.', 'kkkkkkkSsSkkkk..', '......kSSSk.....', '......kkkkk.....'],
      ['kk..kkkkkkkkk...', 'k..kuuuuuuuuYk..', 'kk.kyycwrrcyYk..', 'kkkkyycwwwcyYk..', 'uuuuyycccccyYYk.', 'yyyyyyyyyyyyyYk.', 'yyyyyyyyyyyyyYk.', 'yyyyyyyyyyyyyYuk', 'yyyyyyyyyyyyyYk.', 'yyyyyyyyyyyyyYk.', 'yyyyyyyyyyyyyYk.', 'yyyyyyyyyyyyyYk.', 'YYYYYYkkkkkYYYk.', 'kkkkkkkSsSkkkk..', '......kSSSk.....', '......kkkkk.....']
    ] });
    Q.defSprite('t4-car-pl', { w: 16, h: 16, pal: w4Palette(), frames: [
      ['................', '................', '................', '..kkkkkkkkkkkkkk', '.kqqqqqqqqqqqqqq', '.kpppppppppppppp', '.kpppppppppppppp', '.kppppkkkpppkkkp', '.kpppppppppppppp', '.kpppppppppppppp', '.kpppppppKKKpppp', '.kpppppppppppppp', '.kPPPkkkkkPPPPPP', '..kkkkSsSkkkkkkk', '.....kSSSk......', '.....kkkkk......'],
      ['...............k', '................', '...............k', '..kkkkkkkkkkkkkk', '.kqqqqqqqqqqqqqq', '.kpppppppppppppp', '.kpppppppppppppp', '.kppppkkkpppkkkp', '.kpppppppppppppp', '.kpppppppppppppp', '.kpppppppKKKpppp', '.kpppppppppppppp', '.kPPPkkkkkPPPPPP', '..kkkkSsSkkkkkkk', '.....kSSSk......', '.....kkkkk......']
    ] });
    Q.defSprite('t4-car-pr', { w: 16, h: 16, pal: w4Palette(), frames: [
      ['....kkkkkkkkk...', '...kqqqqqqqqPk..', '...kppcwrrcpPk..', 'kkkkppcwwwcpPk..', 'qqqqppcccccpPPk.', 'pppppppppppppPk.', 'pppppppppppppPk.', 'pppppppppppppPyk', 'pppppppppppppPk.', 'pppppppppppppPk.', 'pppppppppppppPk.', 'pppppppppppppPk.', 'PPPPPPkkkkkPPPk.', 'kkkkkkkSsSkkkk..', '......kSSSk.....', '......kkkkk.....'],
      ['kk..kkkkkkkkk...', 'k..kqqqqqqqqPk..', 'kk.kppcwrrcpPk..', 'kkkkppcwwwcpPk..', 'qqqqppcccccpPPk.', 'pppppppppppppPk.', 'pppppppppppppPk.', 'pppppppppppppPyk', 'pppppppppppppPk.', 'pppppppppppppPk.', 'pppppppppppppPk.', 'pppppppppppppPk.', 'PPPPPPkkkkkPPPk.', 'kkkkkkkSsSkkkk..', '......kSSSk.....', '......kkkkk.....']
    ] });
    Q.defSprite('t4-psign', { w: 16, h: 16, pal: w4Palette(), frames: [
      ['...kkkkkkkkkk...', '..kBBBBBBBBBBk..', '..kBbbbbbbbbBk..', '..kBbbwwwbbbBk..', '..kBbbwbbwbbBk..', '..kBbbwwwbbbBk..', '..kBbbwbbbbbBk..', '..kBbbwbbbbbBk..', '..kBbbbbbbbbBk..', '..kBBBBBBBBBBk..', '...kkkksSkkkk...', '......ksSk......', '......ksSk......', '......ksSk......', '......ksSk......', '......ksSk......']
    ] });
