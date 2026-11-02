    // ---------- 84-w4-sprites.js: THE BACKLOG's enemies (B9): TICKET, NICE TO HAVE, MEETING INVITE, and one of my own, URGENT ----------
    // TICKET: 0 stand, 1 crouch (the tell before a hop), 2 in the air, 3 blink. URGENT: 0 to 1 walk, 2 the tell (it saw you), 3 dazed.
    // NICE TO HAVE: 0 to 2 yellow (stand, hop, the shiver before it multiplies), 3 to 5 pink. MEETING INVITE: 0 idle, 1 ringing, 2 pulling.
    Q.defSprite('ticket', { w: 14, h: 12, pal: w4Palette(), frames: [
      ['..............', '..............', '.kkkkkkkkkkkk.', 'kcccccccccBBBk', 'kbwwwbwwwcBBBk', 'kbwkkbwkkbBBBk', '.kwkkbwkkcBBk.', '.kwwwbwwwbBBk.', 'kbbbbkbbbcBBBk', 'kbbbbbbbbbBBBk', 'kBBBBBBBBBKKKk', '.kkkkkkkkkkkk.'],
      ['..............', '..............', '..............', '..............', '..............', 'kkkkkkkkkkkkkk', 'cccccccccccBBB', 'bwwwbwwwbbcBBB', 'kwkkbwkkbbbBBk', 'kwkkkwkkbbcBBk', 'BBBBBBBBBBBKKK', 'kkkkkkkkkkkkkk'],
      ['..kkkkkkkkkk..', '.kcccccccBBBk.', '.kbwwwbwwwBBk.', '.kbwkkbwkkBBk.', '.kbwkkbwkkBBk.', '..kwwwbwwwBk..', '..kbbbkbcBBk..', '.kbbbbbbbBBBk.', '.kbbbbbbcBBBk.', '.kBBBBBBBKKKk.', '..kkkkkkkkkk..', '..............'],
      ['..............', '..............', '.kkkkkkkkkkkk.', 'kcccccccccBBBk', 'kbbbbbbbbcBBBk', 'kbbbbbbbbbBBBk', '.kkkkbkkkcBBk.', '.kbbbbbbbbBBk.', 'kbbbbkbbbcBBBk', 'kbbbbbbbbbBBBk', 'kBBBBBBBBBKKKk', '.kkkkkkkkkkkk.']
    ] });
    Q.defSprite('urgent', { w: 14, h: 12, pal: w4Palette(), frames: [
      ['..............', '..............', '.kkkkkkkkkkkk.', 'kqqqqqqqqqRRRk', 'krwwrrrwwqRyRk', 'krwkkrwkkrRyRk', '.kwkkrwkkqRyk.', '.krrrkrrrrRyk.', 'krrrrrrrrqRRRk', 'krrrrrrrrrRyRk', 'kRRRRRRRRRKKKk', '.kkkkkkkkkkkk.'],
      ['..............', '..............', '..............', '.kkkkkkkkkkkk.', 'kqqqqqqqqqRRRk', 'krwwrrrwwqRyRk', 'krwkkrwkkrRyRk', '.kwkkrwkkqRyk.', '.krrrkrrrrRRk.', 'krrrrrrrrqRyRk', 'kRRRRRRRRRKKKk', '.kkkkkkkkkkkk.'],
      ['..............', 'kkkkkkkkkkkkkk', 'qqqqqqqqqqqRRR', 'rwwwrwwwrrqRuR', 'rwkkrwkkrrrRuR', 'rwkkrwkkrrqRuR', 'krrrkrrrrrrRuk', 'krrrrrrrrrqRuk', 'rrrrrrrrrrrRRR', 'rrrrrrrrrrqRuR', 'RRRRRRRRRRRKKK', 'kkkkkkkkkkkkkk'],
      ['..............', '..............', '..............', '.kkkkkkkkkkkk.', 'kqqqqqqqqqRRRk', 'krkwkrkwkqRYRk', 'krwkwrwkwrRYRk', '.kkwkrkwkqRYk.', '.krrrkrrrrRRk.', 'krrrrrrrrqRYRk', 'kRRRRRRRRRKKKk', '.kkkkkkkkkkkk.']
    ] });
    Q.defSprite('nice', { w: 10, h: 10, pal: w4Palette(), frames: [
      ['.kkkkkkkk.', 'kuuuuuuuuk', 'kyyyyyyyyk', 'kyykyykyyk', 'kyyyyyyyyk', 'kyyykkyyyk', 'kyyyyyyyyk', 'kyyyyyyyYk', 'kyyyyyyYk.', '.kkkkkkk..'],
      ['..........', '..........', '.kkkkkkkk.', 'kuuuuuuuuk', 'kyykyykyyk', 'kyyyyyyyyk', 'kyyykkyyyk', 'kyyyyyyyYk', 'kyyyyyyYk.', '.kkkkkkk..'],
      ['kkkkkkkkkk', 'uuuuuuuuuu', 'yyyyyyyyyy', 'yykyyyykyy', 'yyykyykyyy', 'yyyykkyyyy', 'yyyyyyyyyy', 'yyyyyyyyyY', 'yyyyyyyyYk', 'kkkkkkkkk.'],
      ['.kkkkkkkk.', 'kqqqqqqqqk', 'kppppppppk', 'kppkppkppk', 'kppppppppk', 'kpppkkpppk', 'kppppppppk', 'kpppppppPk', 'kppppppPk.', '.kkkkkkk..'],
      ['..........', '..........', '.kkkkkkkk.', 'kqqqqqqqqk', 'kppkppkppk', 'kppppppppk', 'kpppkkpppk', 'kpppppppPk', 'kppppppPk.', '.kkkkkkk..'],
      ['kkkkkkkkkk', 'qqqqqqqqqq', 'pppppppppp', 'ppkppppkpp', 'pppkppkppp', 'ppppkkpppp', 'pppppppppp', 'pppppppppP', 'ppppppppPk', 'kkkkkkkkk.']
    ] });
    Q.defSprite('invite', { w: 16, h: 16, pal: w4Palette(), frames: [
      ['...kSk....kSk...', '...ksk....ksk...', '.kkkskkkkkkskkk.', 'krrrsrrrrrrsrrrk', 'krrrrwrrrrwrrrrk', 'krrrrkrrrrkrrrrk', 'kRRRRRRRRRRRRRRk', 'kwwwwwwwwwwwwwwk', 'kwwwWwkWwkWwwWwk', 'kwwwWwwkkwWwwWwk', 'kwWWWWWWWWRRRWwk', 'kwwwWwwWwwRwRWwk', 'kwWWWWWWWWRRRWwk', 'kwwwWwwWwwWwwWwk', 'kWWWWWWWWWWWWWWk', '.kkkkkkkkkkkkkk.'],
      ['..kSk....kSk....', '..ksk....ksk....', 'kkkskkkkkkskkk..', 'rrrsrrrrrrsrrrk.', 'rrrwwrrrrwwrrrk.', 'rrrwkrrrrkwrrrk.', 'RRRRRRRRRRRRRRk.', 'wwwwwwwwwwwwwwk.', 'wwwWwkWwkWwwWwk.', 'wwwWwwkkwWwwWwk.', 'wWWWWWWWWRRRWwk.', 'wwwWwwWwwRwRWwk.', 'wWWWWWWWWRRRWwk.', 'wwwWwwWwwWwwWwk.', 'WWWWWWWWWWWWWWk.', 'kkkkkkkkkkkkkk..'],
      ['...kSk....kSk...', '...ksk....ksk...', '.kkkskkkkkkskkk.', 'krrrsrrrrrrsrrrk', 'krrrwwrrrrwwrrrk', 'krrrwkrrrrkwrrrk', 'kRRRRRRRRRRRRRRk', 'kwwwwwwwwwwwwwwk', 'kwwwWwkkkkWwwWwk', 'kwwwWwkKKkWwwWwk', 'kwWWWWkkkkRRRWwk', 'kwwwWwwWwwRwRWwk', 'kwWWWWWWWWRRRWwk', 'kwwwWwwWwwWwwWwk', 'kWWWWWWWWWWWWWWk', '.kkkkkkkkkkkkkk.']
    ] });
    // SCOPE CREEP's eye in a tower wall: 0 open (the pupil is drawn in code, following him), 1 half shut, 2 shut
    Q.defSprite('w4-eye', { w: 16, h: 16, pal: w4Palette(), frames: [
      ['fffffffDffffffff', 'dddddddDdddddddd', 'didddddDddddiddd', 'DDDDDDDDDDDDDDDD', 'KKkkkkkkkkkkkkKK', 'iikeeeeeeeeeekii', 'iIkeeexxxxeeekIi', 'iikkexxxxxxekkii', 'IIkkexxxxxxekkII', 'KKkeeexxxxeeekKK', 'ffkeeeeeeeeeekff', 'ddkkkkkkkkkkkkdd', 'dddDddiddddddddd', 'dddDdddddddddddd', 'DDDDDDDDDDDDDDDD', 'KKKKKKKKKKKKKKKK'],
      ['fffffffDffffffff', 'dddddddDdddddddd', 'didddddDddddiddd', 'DDDDDDDDDDDDDDDD', 'KKkkkkkkkkkkkkKK', 'iikgllllllllgkii', 'iIkggggggggggkIi', 'iikggggggggggkii', 'IIkkkkkkkkkkkkII', 'KKkeeexxxxeeekKK', 'ffkeeeeeeeeeekff', 'ddkkkkkkkkkkkkdd', 'dddDddiddddddddd', 'dddDdddddddddddd', 'DDDDDDDDDDDDDDDD', 'KKKKKKKKKKKKKKKK'],
      ['fffffffDffffffff', 'dddddddDdddddddd', 'didddddDddddiddd', 'DDDDDDDDDDDDDDDD', 'KKkkkkkkkkkkkkKK', 'iikgllllllllgkii', 'iIkggggggggggkIi', 'iikggggggggggkii', 'IIkGGGGGGGGGGkII', 'KKkgkgggggkggkKK', 'ffkggggkgggggkff', 'ddkkkkkkkkkkkkdd', 'dddDddiddddddddd', 'dddDdddddddddddd', 'DDDDDDDDDDDDDDDD', 'KKKKKKKKKKKKKKKK']
    ] });
