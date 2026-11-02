    // ---------- 22-art-items-c.js: the office cat and VEND-9 (ART, builder 3) ----------
    // cat (16 by 12, 4 frames: 0-1 sit, 2-3 walk): the grey striped office cat of our own, with a teal collar and an orange tag. Facing right.
    Q.art.def('cat', 16, 12, Q.art.pal({ G: '#8e949e', L: '#c2c7cf', d: '#5c626c', p: '#f29bb0', w: '#eef0f3', t: '#2ec4b6', o: '#ff8a1e' }), [
      [
        '..........k...k. ..........k...k. ................ ................',
        '.........kpk.kpk .........kpk.kpk .kk.......k...k. ..........k...k.',
        '.........kLLLLLk .........kLLLLLk kLGk.....kpk.kpk .kk......kpk.kpk',
        '.........kLkLkGk .........kLGLGGk kGk......kLLLLLk kLGk.....kLLLLLk',
        '...kk....kGwpwGk .........kGwpwGk .kdk.....kLkLkGk .kGk.....kLkLkGk',
        '..kLGk...kkGGGkk ..kk.....kkGGGkk ..kGkkkkkkGwpwGk ..kdkkkkkkGwpwGk',
        '..kGk...kGtotGk. .kLGk...kGtotGk. ...kLLLLLLkGGGk. ...kLLLLLLkGGGk.',
        '..kdk..kLGGGGGk. .kGdk..kLGGGGGk. ...kGdGGdGGtotk. ...kGdGGdGGtotk.',
        '..kGk.kLGdGGGGk. ..kGk.kLGdGGGGk. ...kGdGGdGGGGk.. ...kGdGGdGGGGk..',
        '..kGkkLGGdGGwGk. ..kGkkLGGdGGwGk. ...kGkkkGGkkGk.. ...kGGkkkGkkGk..',
        '...kGGGGGGkwkwk. ...kGGGGGGkwkwk. ..kGk..kGk.kGk.. ....kGk.kGk.kGk.',
        '....kkkkkkkkkkk. ....kkkkkkkkkkk. ..kkk..kkk.kkk.. ....kkk.kkk.kkk.'
      ]
    ]);
    // vend (32 by 48, 2 frames): VEND-9, the friendly vending machine between worlds. A teal cabinet under an orange VEND-9 header; behind the glass, its wares
    // (coffee, hearts, a baton, metronomes, a snack); a little screen with a simple face (it is a machine: frame 1 blinks), buttons, a coin slot and a tray.
    Q.art.def('vend', 32, 48, Q.art.pal({ O: '#ff8a1e', P: '#ffb066', o: '#c2620e', w: '#ffffff', T: '#2ec4b6', L: '#7fe3d8', D: '#1e8a80',
                                          g: '#1b2a44', G: '#33507a', m: '#7d8796', n: '#0f1420', M: '#6b3f22', W: '#ffffff', x: '#c9cfdb',
                                          r: '#e8404f', R: '#ff9aa5', h: '#3a2a20', F: '#9c6640', y: '#ffd23f', Y: '#fff4bf', b: '#2f7de1',
                                          s: '#07080b', f: '#6dfc9a' }), [
      [
        '.kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk. .kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.',
        '.kPPPPPPPPPPPPPPPPPPPPPPPPPPPPk. .kPPPPPPPPPPPPPPPPPPPPPPPPPPPPk.',
        '.kOOwOwOwwwOwOOwOwwOOOOOwwwOOOk. .kOOwOwOwwwOwOOwOwwOOOOOwwwOOOk.',
        '.kOOwOwOwOOOwwOwOwOwOOOOwOwOOOk. .kOOwOwOwOOOwwOwOwOwOOOOwOwOOOk.',
        '.kOOwOwOwwOOwOwwOwOwOwwOwwwOOOk. .kOOwOwOwwOOwOwwOwOwOwwOwwwOOOk.',
        '.kOOwOwOwOOOwOOwOwOwOOOOOOwOOOk. .kOOwOwOwOOOwOOwOwOwOOOOOOwOOOk.',
        '.kOOOwOOwwwOwOOwOwwOOOOOwwOOOOk. .kOOOwOOwwwOwOOwOwwOOOOOwwOOOOk.',
        '.kooooooooooooooooooooooooooook. .kooooooooooooooooooooooooooook.',
        '.kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk. .kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.',
        '.kLkkkkkkkkkkkkkkkkkkTTTTTTTTDk. .kLkkkkkkkkkkkkkkkkkkTTTTTTTTDk.',
        '.kLkgggGggggggggggggkkkkkkkkkDk. .kLkggggggggggggggggkkkkkkkkkDk.',
        '.kLkgggGggggggggggggkksssssskDk. .kLkggggggggggggggggkksssssskDk.',
        '.kLkgkkkkgkkkkgkkkkgkksssssskDk. .kLkgkkkkgkkkkgkkkkgkksssssskDk.',
        '.kLkgMMMMgMMMMgMMMMgkksfssfskDk. .kLkgMMMMgMMMMgMMMMgkkffssffkDk.',
        '.kLkgWWWxkWWWxkWWWxkkksssssskDk. .kLkgWWWxkWWWxkWWWxkkksssssskDk.',
        '.kLkgWWWxgWWWxgWWWxgkksfssfskDk. .kLkgWWWxgWWWxgWWWxgkksfssfskDk.',
        '.kLkgkkkkgkkkkgkkkkgkkssffsskDk. .kLkgkkkkgkkkkgkkkkgkkssffsskDk.',
        '.kLkmmmmmmmmmmmmmmmmkksssssskDk. .kLkmmmmmmmmmmmmmmmmkksssssskDk.',
        '.kLkggggggggggggggggkkkkkkkkkDk. .kLkggggggggggggggggkkkkkkkkkDk.',
        '.kLkggggggggggggggggkTTTTTTTTDk. .kLkggggggggggggggggkTTTTTTTTDk.',
        '.kLkgrrgrrgggggrrgrrkTkkkTkkkDk. .kLkgrrgrrgggggrrgrrkTkkkTkkkDk.',
        '.kLkgrRrrrggggwrRrrrkTkykTkrkDk. .kLkgrRrrrggggwrRrrrkTkYkTkrkDk.',
        '.kLkgrrrrrgggwGrrrrrkTkkkTkkkDk. .kLkgrrrrrgggwgrrrrrkTkkkTkkkDk.',
        '.kLkggrrrggghggGrrrgkTTTTTTTTDk. .kLkggrrrggghgggrrrgkTTTTTTTTDk.',
        '.kLkgggrggghgggGgrggkTkkkTkkkDk. .kLkgggrggghgggggrggkTkkkTkkkDk.',
        '.kLkggggggggggggggggkTkwkTkbkDk. .kLkggggggggggggGgggkTkwkTkbkDk.',
        '.kLkmmmmmmmmmmmmmmmmkTkkkTkkkDk. .kLkmmmmmmmmmmmmmmmmkTkkkTkkkDk.',
        '.kLkggggggggggggggggkTTTTTTTTDk. .kLkgggggggggggggGggkTTTTTTTTDk.',
        '.kLkggggggggggggggggkTkkkTkkkDk. .kLkggggggggggggggggkTkkkTkkkDk.',
        '.kLkgggkgggkkkgggkggkTkrkTkykDk. .kLkgggkgggkkkgggkggkTkrkTkykDk.',
        '.kLkggkwkggyYyggkwkgkTkkkTkkkDk. .kLkggkwkggyYyggkwkgkTkkkTkkkDk.',
        '.kLkggFwFggyyyggFwFgkTTTTTTTTDk. .kLkggFwFggyyyggFwFgkTTTTTTTTDk.',
        '.kLkgkFwFkgyYygkFwFkkTkkkkkkTDk. .kLkgkFwFkgyYygkFwFkkTkkkkkkTDk.',
        '.kLkgkkkkkgkkkgkkkkkkTkYYYYkTDk. .kLkgkkkkkgkkkgkkkkkkTkYYYYkTDk.',
        '.kLkgggggggggggggggGkTkkkkkkTDk. .kLkggggggggggggggggkTkkkkkkTDk.',
        '.kLkmmmmmmmmmmmmmmmmkTTTTTTTTDk. .kLkmmmmmmmmmmmmmmmmkTTTTTTTTDk.',
        '.kLkkkkkkkkkkkkkkkkkkTTTTTTTTDk. .kLkkkkkkkkkkkkkkkkkkTTTTTTTTDk.',
        '.kLTkkkkkkkkkkkkkkkkTTTTTTTTTDk. .kLTkkkkkkkkkkkkkkkkTTTTTTTTTDk.',
        '.kLTkmmmmmmmmmmmmmmkTTTTTTTTTDk. .kLTkmmmmmmmmmmmmmmkTTTTTTTTTDk.',
        '.kLTkmmmmmmmmmmmmmmkTTTTTTTTTDk. .kLTkmmmmmmmmmmmmmmkTTTTTTTTTDk.',
        '.kLTknnnnnnnnnnnnnnkTTTTTTTTTDk. .kLTknnnnnnnnnnnnnnkTTTTTTTTTDk.',
        '.kLTknnnnnnnnnnnnnnkTTTTTTTTTDk. .kLTknnnnnnnnnnnnnnkTTTTTTTTTDk.',
        '.kLTkkkkkkkkkkkkkkkkTTTTTTTTTDk. .kLTkkkkkkkkkkkkkkkkTTTTTTTTTDk.',
        '.kDDDDDDDDDDDDDDDDDDDDDDDDDDDDk. .kDDDDDDDDDDDDDDDDDDDDDDDDDDDDk.',
        '.kDDDDDDDDDDDDDDDDDDDDDDDDDDDDk. .kDDDDDDDDDDDDDDDDDDDDDDDDDDDDk.',
        '.kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk. .kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.',
        '...kkkk..................kkkk... ...kkkk..................kkkk...',
        '...kkkk..................kkkk... ...kkkk..................kkkk...'
      ]
    ]);
    // face-vend (16 by 16, 2 frames: frame 1 blinks): VEND-9's portrait for the text box, its little screen in the teal cabinet under a strip of its orange header.
    Q.art.def('face-vend', 16, 16, Q.art.pal({ P: '#ffb066', O: '#ff8a1e', o: '#c2620e', T: '#2ec4b6', L: '#7fe3d8', D: '#1e8a80', s: '#07080b', f: '#6dfc9a',
                                               y: '#ffd23f', Y: '#fff4bf', r: '#e8404f', b: '#2f7de1' }), [
      [
        '.kkkkkkkkkkkkkk. .kkkkkkkkkkkkkk.',
        'kPPPPPPPPPPPPPPk kPPPPPPPPPPPPPPk',
        'kOOOOOOOOOOOOOOk kOOOOOOOOOOOOOOk',
        'kooooooooooooook kooooooooooooook',
        'kLTkkkkkkkkkkTDk kLTkkkkkkkkkkTDk',
        'kLTksssssssskTDk kLTksssssssskTDk',
        'kLTksffssffskTDk kLTksssssssskTDk',
        'kLTksffssffskTDk kLTksffssffskTDk',
        'kLTksssssssskTDk kLTksssssssskTDk',
        'kLTkfssssssfkTDk kLTkfssssssfkTDk',
        'kLTksffffffskTDk kLTksffffffskTDk',
        'kLTksssssssskTDk kLTksssssssskTDk',
        'kLTkkkkkkkkkkTDk kLTkkkkkkkkkkTDk',
        'kLTTyTTrTTbTTTDk kLTTYTTrTTbTTTDk',
        'kDDDDDDDDDDDDDDk kDDDDDDDDDDDDDDk',
        '.kkkkkkkkkkkkkk. .kkkkkkkkkkkkkk.'
      ]
    ]);
