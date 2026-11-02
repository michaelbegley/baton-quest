    // ---------- 22-art-items-b.js: the save point, the exit door and the sign (ART, builder 3) ----------
    // mug (16 by 16, 2 frames): the save point, a coffee mug with an orange band on a little walnut desk, steam rising (the engine cycles the frames).
    Q.art.def('mug', 16, 16, Q.art.pal({ s: '#eef3f8', S: '#9fb0c2', M: '#5a3622', W: '#ffffff', x: '#c9cfdb', O: '#ff8a1e', o: '#c2620e',
                                         L: '#b07a4f', T: '#7a4a2a', t: '#55321b' }), [
      [
        '......S...S..... .......S...S....',
        '.......s...s.... ......s...s.....',
        '......s...s..... .......s...s....',
        '.......s...s.... ......s...s.....',
        '....kkkkkkkk.... ....kkkkkkkk....',
        '....kMMMMMMk.... ....kMMMMMMk....',
        '....kWWWWWxkkk.. ....kWWWWWxkkk..',
        '....kOOOOOok.k.. ....kOOOOOok.k..',
        '....kOWOOOok.k.. ....kOWOOOok.k..',
        '....kWWWWWxkkk.. ....kWWWWWxkkk..',
        '....kxWWWxxk.... ....kxWWWxxk....',
        '.kkkkkkkkkkkkkk. .kkkkkkkkkkkkkk.',
        'kLLLLLLLLLLLLLLk kLLLLLLLLLLLLLLk',
        'kTTTTTTTTTTTTTTk kTTTTTTTTTTTTTTk',
        '.ktk........ktk. .ktk........ktk.',
        '.kkk........kkk. .kkk........kkk.'
      ]
    ]);
    // door (16 by 24, 2 frames: shut, open): an office door in a walnut frame, a small window, a brass handle, and a small green EXIT light above.
    // The engine draws it 8 pixels up from its tile, so the bottom 16 rows stand on the tile.
    Q.art.def('door', 16, 24, Q.art.pal({ g: '#1f9e52', G: '#5fe08f', w: '#ffffff', f: '#9c6640', F: '#7a4a2a', r: '#4f2e19',
                                          l: '#e08850', D: '#c9652f', d: '#8f421c', b: '#a9d8f0', B: '#e6f6ff', y: '#ffd23f', Y: '#fff4bf' }), [
      [
        '.kkkkkkkkkkkkkk. .kkkkkkkkkkkkkk.',
        '.kwwgwgwgwgwwwk. .kwwGwGwGwGwwwk.',
        '.kwggwgwgwggwgk. .kwGGwGwGwGGwGk.',
        '.kwwggwggwggwgk. .kwwGGwGGwGGwGk.',
        '.kwggwgwgwggwgk. .kwGGwGwGwGGwGk.',
        '.kwwgwgwgwggwgk. .kwwGwGwGwGGwGk.',
        '.kkkkkkkkkkkkkk. .kkkkkkkkkkkkkk.',
        'kkkkkkkkkkkkkkkk kkkkkkkkkkkkkkkk',
        'kffffffffffffFrk kffffffffffffFrk',
        'kfkkkkkkkkkkkkrk kfkkkkkkkkkkkkrk',
        'kfklllllllllDkrk kfkkYYYYYYYYYkrk',
        'kfklDbbbbbbDdkrk kfkdkYwwwwwwYkrk',
        'kfklDbBbbbbDdkrk kfkdkYwwwwwwYkrk',
        'kfklDbbbbbbDdkrk kfkdkYwwwwwwYkrk',
        'kfklDDDDDDDDdkrk kfkdkYwwwwwwYkrk',
        'kfklDDDDDDDDdkrk kfkdkYwwwwwwYkrk',
        'kfklDDDDDDDDdkrk kfkdkYwwwwwwYkrk',
        'kfklDDDDDDDyYkrk kfkdkYwwwwwwYkrk',
        'kfklDDDDDDDykkrk kfkdkYYwwwwwYkrk',
        'kfklDDDDDDDDdkrk kfkdkYYwwwwwYkrk',
        'kfklDDDDDDDDdkrk kfkdkYYYwwwwYkrk',
        'kfklDDDDDDDDdkrk kfkdkYYYYwwYYkrk',
        'kfkddddddddddkrk kfkdkYYYYYYYYkrk',
        'kkkkkkkkkkkkkkkk kkkkkkkkkkkkkkkk'
      ]
    ]);
    // sign (16 by 16): a little notice board on a post, an orange ! and lines of writing (its text shows while he stands at it).
    Q.art.def('sign', 16, 16, Q.art.pal({ w: '#f6efe2', x: '#d2c4aa', o: '#ff8a1e', b: '#5a6078', f: '#9c6640', r: '#5a361e' }), [
      [
        '................',
        '.kkkkkkkkkkkkkk.',
        '.kwwwwwwwwwwwwk.',
        '.kwoowwwwwwwwxk.',
        '.kwoowbbbbbbwxk.',
        '.kwoowwwwwwwwxk.',
        '.kwoowbbbbwwwxk.',
        '.kwwwwwwwwwwwxk.',
        '.kwoowbbbbbwwxk.',
        '.kxxxxxxxxxxxxk.',
        '.kkkkkkkkkkkkkk.',
        '......kffk......',
        '......kfrk......',
        '......kfrk......',
        '.....kkfrkk.....',
        '....kkrrrrkk....'
      ]
    ]);
