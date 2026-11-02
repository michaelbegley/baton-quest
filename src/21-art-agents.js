    // ---------- 21-art-agents.js: C1, C2 and C3 (16 by 20, 6 frames each; ART, builder 3) ----------
    // Round pale blue-white heads with dot eyes, white shirts with a small window in their own colour on the chest, dark trousers, shoes in their colour.
    // C1: a blue knitted beanie with a white bobble. C2: a green cap with a peak. C3: pink hair in a bun with a white band. Facing right; the engine flips them.
    // Frames (QUEST-API.md part 8): 0-1 idle (the second breathing, a blink), 2-3 cheer (arms up; the second a hop), 4-5 trapped (wrapped in sticky notes
    // and a ticket, wriggling). The colours are the agents' own (ARCADE-API.md, Q.COL).
    Q.art.AGENT = { idle: [0, 1], cheer: [2, 3], trapped: [4, 5] };
    Q.art.agentPal = function (own) {   // the letters every agent shares, plus its own colour (C main, B shade, L pale, q deep)
      var p = Q.art.pal({
        a: '#e8f0ff', A: '#b6c8ec', w: '#ffffff',                // the head: pale blue-white, its shade, a light
        W: '#f7f9fd', x: '#c5cde0', h: '#e8f0ff',                // the shirt and its shade, the hands
        p: '#39414f', P: '#525c6e', r: '#e8577a',                // the trousers, a mouth
        Y: '#ffd23f', O: '#e0a21c', V: '#fff2a8',                // sticky notes
        T: '#9fd0ff', U: '#4f8fd6'                              // a ticket and its stripe
      });
      for (var c in own) if (Object.prototype.hasOwnProperty.call(own, c)) p[c] = own[c];
      return p;
    };
    Q.art.def('c1', 16, 20, Q.art.agentPal({ C: '#3f7fd9', B: '#2a5cb5', L: '#bcd4f6', q: '#14294d' }), [
      // frames 0-2: idle, idle (breathing), cheer
      [
        '.......kk....... ................ .......kk.......',
        '......kwwk...... .......kk....... ......kwwk......',
        '....kkkwxkkk.... ......kwwk...... ....kkkwxkkk....',
        '...kLLCCCCCCk... ....kkkwxkkk.... ...kLLCCCCCCk...',
        '..kLCCBCCBCCBk.. ...kLLCCCCCCk... ..kLCCBCCBCCBk..',
        '..kqBqBqBqBqBk.. ..kLCCBCCBCCBk.. ..kqBqBqBqBqBk..',
        '..kwaaaaaaaaak.. ..kqBqBqBqBqBk.. ..kwaaaaaaaaak..',
        '..kaaaaakaakAk.. ..kwaaaaaaaaak.. kkkaaaaakaakAkkk',
        '...kaaaaaaaAk... ..kaaaaaaaaaAk.. khkkaaaaakkAkkhk',
        '....kAaaaaAk.... ...kaaakkakkk... kxxkkAaaarAkkxxk',
        '.....kkkkkk..... ....kAaaaaAk.... .kxxkkkkkkkkxxk.',
        '....kWWWWWWk.... ....kkkkkkkk.... ..kxxkWWWWkxxk..',
        '...kWWWCCCCWk... ...kWWWCCCCWk... ...kkWWCCCCWk...',
        '..kxkWWCLLCkxk.. ..kxkWWCLLCkxk.. ....kWWCLLCk....',
        '..khkWWCCCCkhk.. ..khkWWCCCCkhk.. ....kWWCCCCk....',
        '...kkxxxxxxkk... ...kkxxxxxxkk... ...kkxxxxxxkk...',
        '....kpppppPk.... ....kpppppPk.... ....kpppppPk....',
        '....kppkkpPk.... ....kppkkpPk.... ....kppkkpPk....',
        '...kCCk.kCCk.... ...kCCk.kCCk.... ...kCCk.kCCk....',
        '...kkkk.kkkkk... ...kkkk.kkkkk... ...kkkk.kkkkk...'
      ],
      // frames 3-5: cheer (a hop), trapped, trapped (wriggling)
      [
        '......kwwk...... ................ ................',
        '....kkkwxkkk.... .......kk....... ........kk......',
        '...kLLCCCCCCk... ......kwwk...... .......kwwk.....',
        '..kLCCBCCBCCBk.. ....kkkwxkkk.... .....kkkwxkkk...',
        '..kqBqBqBqBqBk.. ...kLLCCCCCCk... ....kLLCCCCCCk..',
        '..kwaaaaaaaaak.. ..kLCCBCCBCCBk.. ...kLCCBCCBCCBk.',
        'kkkaaaaakaakAkkk ..kqBqBqBqBqBk.. ...kqBqBqBqBqBk.',
        'khkkaaaaakkAkkhk ..kwaaaaaaaaak.. ...kwaaaaaaaaak.',
        'kxxkkAaaarAkkxxk ..kaaaaakaakAk.. ...kaaaaakaakAk.',
        '.kxxkkkkkkkkxxk. ...kaaaakaakk... ....kaaaakaakk..',
        '..kxxkWWWWkxxk.. ..kkkkkaaakkkk.. ...kkkkkaakkkk..',
        '...kkWWCCCCWk... ..kVVVYkkkVVYk.. ...kVVVYkkVVYk..',
        '....kWWCLLCk.... ..kYYYYkVkYYOk.. ..kkYYYYkVYYOk..',
        '....kWWCCCCk.... .kkYYYOkYkYOkk.. ..kVYYYOkYYOkk..',
        '...kkxxxxxxkk... .kTTkOkkYYkkkk.. ..kTTkOkYYkkkk..',
        '....kpppppPk.... .kUTTTkkkkTTTTk. .kUTTTkkkkTTTTk.',
        '....kppkkpPk.... ..kkUTTTTTTUTUk. .kkkUTTTTTTUTUk.',
        '...kCCk.kCCk.... ...kVVYkkUkkkk.. ...kVVYkkUkkkk..',
        '...kkkk.kkkkk... ...kYYOkkYYk.... ...kYYOkkkYYk...',
        '................ ...kkkkkkkkkk... ...kkkkkkkkkk...'
      ]
    ]);
    Q.art.def('c2', 16, 20, Q.art.agentPal({ C: '#46b06a', B: '#2f8a4f', L: '#bfe8cd', q: '#123d24' }), [
      // frames 0-2: idle, idle (breathing), cheer
      [
        '................ ................ ................',
        '.......kk....... ................ .......kk.......',
        '.....kkCCkk..... .......kk....... .....kkCCkk.....',
        '....kLLCCCCk.... .....kkCCkk..... ....kLLCCCCk....',
        '...kLCCCCCCCkkk. ....kLLCCCCk.... ...kLCCCCCCCkkk.',
        '..kBBBBBBBBBCCCk ...kLCCCCCCCkkk. ..kBBBBBBBBBCCCk',
        '..kwaaaaaaaaaBBk ..kBBBBBBBBBCCCk ..kwaaaaaaaaaBBk',
        '..kaaaaakaakAk.. ..kwaaaaaaaaaBBk kkkaaaaakaakAkkk',
        '...kaaaaaaaAk... ..kaaaaaaaaaAk.. khkkaaaaakkAkkhk',
        '....kAaaaaAk.... ...kaaakkakkk... kxxkkAaaarAkkxxk',
        '.....kkkkkk..... ....kAaaaaAk.... .kxxkkkkkkkkxxk.',
        '....kWWWWWWk.... ....kkkkkkkk.... ..kxxkWWWWkxxk..',
        '...kWWWCCCCWk... ...kWWWCCCCWk... ...kkWWCCCCWk...',
        '..kxkWWCLLCkxk.. ..kxkWWCLLCkxk.. ....kWWCLLCk....',
        '..khkWWCCCCkhk.. ..khkWWCCCCkhk.. ....kWWCCCCk....',
        '...kkxxxxxxkk... ...kkxxxxxxkk... ...kkxxxxxxkk...',
        '....kpppppPk.... ....kpppppPk.... ....kpppppPk....',
        '....kppkkpPk.... ....kppkkpPk.... ....kppkkpPk....',
        '...kCCk.kCCk.... ...kCCk.kCCk.... ...kCCk.kCCk....',
        '...kkkk.kkkkk... ...kkkk.kkkkk... ...kkkk.kkkkk...'
      ],
      // frames 3-5: cheer (a hop), trapped, trapped (wriggling)
      [
        '.......kk....... ................ ................',
        '.....kkCCkk..... ................ ................',
        '....kLLCCCCk.... .......kk....... ........kk......',
        '...kLCCCCCCCkkk. .....kkCCkk..... ......kkCCkk....',
        '..kBBBBBBBBBCCCk ....kLLCCCCk.... .....kLLCCCCk...',
        '..kwaaaaaaaaaBBk ...kLCCCCCCCkkk. ....kLCCCCCCCkkk',
        'kkkaaaaakaakAkkk ..kBBBBBBBBBCCCk ...kBBBBBBBBBCCC',
        'khkkaaaaakkAkkhk ..kwaaaaaaaaaBBk ...kwaaaaaaaaaBB',
        'kxxkkAaaarAkkxxk ..kaaaaakaakAk.. ...kaaaaakaakAk.',
        '.kxxkkkkkkkkxxk. ...kaaaakaakk... ....kaaaakaakk..',
        '..kxxkWWWWkxxk.. ..kkkkkaaakkkk.. ...kkkkkaakkkk..',
        '...kkWWCCCCWk... ..kVVVYkkkVVYk.. ...kVVVYkkVVYk..',
        '....kWWCLLCk.... ..kYYYYkVkYYOk.. ..kkYYYYkVYYOk..',
        '....kWWCCCCk.... .kkYYYOkYkYOkk.. ..kVYYYOkYYOkk..',
        '...kkxxxxxxkk... .kTTkOkkYYkkkk.. ..kTTkOkYYkkkk..',
        '....kpppppPk.... .kUTTTkkkkTTTTk. .kUTTTkkkkTTTTk.',
        '....kppkkpPk.... ..kkUTTTTTTUTUk. .kkkUTTTTTTUTUk.',
        '...kCCk.kCCk.... ...kVVYkkUkkkk.. ...kVVYkkUkkkk..',
        '...kkkk.kkkkk... ...kYYOkkYYk.... ...kYYOkkkYYk...',
        '................ ...kkkkkkkkkk... ...kkkkkkkkkk...'
      ]
    ]);
    Q.art.def('c3', 16, 20, Q.art.agentPal({ C: '#ee7fb0', B: '#c2488a', L: '#fbd3e3', q: '#4f1d36' }), [
      // frames 0-2: idle, idle (breathing), cheer
      [
        '.kkkk........... ................ .kkkk...........',
        'kLLCCk.......... .kkkk........... kLLCCk..........',
        'kLCCBk..kkkkk... kLLCCk.......... kLCCBk..kkkkk...',
        'kCBBBkkkLCCCCk.. kLCCBk..kkkkk... kCBBBkkkLCCCCk..',
        '.kwwwkLCCCCCCBk. kCBBBkkkLCCCCk.. .kwwwkLCCCCCCBk.',
        '..kCCCCCCCCCCBk. .kwwwkLCCCCCCBk. ..kCCCCCCCCCCBk.',
        '..kCCaaaaaaaak.. ..kCCCCCCCCCCBk. ..kCCaaaaaaaak..',
        '..kCaaaakaakAk.. ..kCCaaaaaaaak.. kkkCaaaakaakAkkk',
        '...kaaaaaaaAk... ..kCaaaaaaaaAk.. khkkaaaaakkAkkhk',
        '....kAaaaaAk.... ...kaaakkakkk... kxxkkAaaarAkkxxk',
        '.....kkkkkk..... ....kAaaaaAk.... .kxxkkkkkkkkxxk.',
        '....kWWWWWWk.... ....kkkkkkkk.... ..kxxkWWWWkxxk..',
        '...kWWWCCCCWk... ...kWWWCCCCWk... ...kkWWCCCCWk...',
        '..kxkWWCLLCkxk.. ..kxkWWCLLCkxk.. ....kWWCLLCk....',
        '..khkWWCCCCkhk.. ..khkWWCCCCkhk.. ....kWWCCCCk....',
        '...kkxxxxxxkk... ...kkxxxxxxkk... ...kkxxxxxxkk...',
        '....kpppppPk.... ....kpppppPk.... ....kpppppPk....',
        '....kppkkpPk.... ....kppkkpPk.... ....kppkkpPk....',
        '...kCCk.kCCk.... ...kCCk.kCCk.... ...kCCk.kCCk....',
        '...kkkk.kkkkk... ...kkkk.kkkkk... ...kkkk.kkkkk...'
      ],
      // frames 3-5: cheer (a hop), trapped, trapped (wriggling)
      [
        'kLLCCk.......... ................ ................',
        'kLCCBk..kkkkk... .kkkk........... ..kkkk..........',
        'kCBBBkkkLCCCCk.. kLLCCk.......... .kLLCCk.........',
        '.kwwwkLCCCCCCBk. kLCCBk..kkkkk... .kLCCBk..kkkkk..',
        '..kCCCCCCCCCCBk. kCBBBkkkLCCCCk.. .kCBBBkkkLCCCCk.',
        '..kCCaaaaaaaak.. .kwwwkLCCCCCCBk. ..kwwwkLCCCCCCBk',
        'kkkCaaaakaakAkkk ..kCCCCCCCCCCBk. ...kCCCCCCCCCCBk',
        'khkkaaaaakkAkkhk ..kCCaaaaaaaak.. ...kCCaaaaaaaak.',
        'kxxkkAaaarAkkxxk ..kCaaaakaakAk.. ...kCaaaakaakAk.',
        '.kxxkkkkkkkkxxk. ...kaaaakaakk... ....kaaaakaakk..',
        '..kxxkWWWWkxxk.. ..kkkkkaaakkkk.. ...kkkkkaakkkk..',
        '...kkWWCCCCWk... ..kVVVYkkkVVYk.. ...kVVVYkkVVYk..',
        '....kWWCLLCk.... ..kYYYYkVkYYOk.. ..kkYYYYkVYYOk..',
        '....kWWCCCCk.... .kkYYYOkYkYOkk.. ..kVYYYOkYYOkk..',
        '...kkxxxxxxkk... .kTTkOkkYYkkkk.. ..kTTkOkYYkkkk..',
        '....kpppppPk.... .kUTTTkkkkTTTTk. .kUTTTkkkkTTTTk.',
        '....kppkkpPk.... ..kkUTTTTTTUTUk. .kkkUTTTTTTUTUk.',
        '...kCCk.kCCk.... ...kVVYkkUkkkk.. ...kVVYkkUkkkk..',
        '...kkkk.kkkkk... ...kYYOkkYYk.... ...kYYOkkkYYk...',
        '................ ...kkkkkkkkkk... ...kkkkkkkkkk...'
      ]
    ]);
