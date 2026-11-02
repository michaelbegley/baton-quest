    // ---------- 22-art-items.js: the shared items (ART, builder 3): facil, note, token, bigtoken, heart, memo ----------
    // The door, the mug, the sign, the cat and VEND-9 are in 22-art-items-b.js and 22-art-items-c.js.
    // facil: the Facilitator's icon, a small glowing speech bubble with three typing dots (never a face or a body). 12 by 12; frame 1 glows brighter.
    Q.art.def('facil', 12, 12, Q.art.pal({ g: '#155f5a', G: '#2ec4b6', H: '#8ff0e6', w: '#ffffff', c: '#d2f4f0', d: '#1f8f86' }), [
      [
        '............ ............',
        '............ ..gggggggg..',
        '..GGGGGGGG.. .gHHHHHHHHg.',
        '.GwwwwwwwwG. gHwwwwwwwwHg',
        '.GwwwwwwwwG. gHwwwwwwwwHg',
        '.GwdwwdwwdG. gHwdwwdwwdHg',
        '.GwwwwwwwcG. gHwwwwwwwcHg',
        '.GcwccccccG. gHcwccccccHg',
        '..GwGGGGGG.. .gHwHHHHHHg.',
        '..GGG....... .gHHgggggg..',
        '..GG........ .gHHg.......',
        '............ .ggg........'
      ]
    ]);
    // note: the musical note the baton throws (8 by 8); frame 1 shimmers.
    Q.art.def('note', 8, 8, Q.art.pal({ y: '#ffd23f', Y: '#fff4bf', o: '#d8961a', w: '#ffffff' }), [
      [
        '...kkk.. ...kkk..',
        '...kYkkk ...kwkkk',
        '...kykYk ...kYkwk',
        '...kykyk ...kykYk',
        '.kkkykkk .kkkykkk',
        'kYYyyk.. kwwYyk..',
        'kyyyok.. kYyyok..',
        '.kkkk... .kkkk...'
      ]
    ]);
    // token: a coin with a small 9, spinning (8 by 8, 4 frames: the face, turning, the edge, turning back).
    Q.art.def('token', 8, 8, Q.art.pal({ y: '#ffd23f', Y: '#fff4bf', o: '#d8961a', b: '#8a5a12' }), [
      [
        '..kkkk.. ..kkkk.. ...kk... ..kkkk..',
        '.kYYYyk. .kYyyok. ..kYok.. .kYyyok.',
        'kYYbbbok .kYbbok. ..kYok.. .kYyyok.',
        'kYybybok .kYbbok. ..kYok.. .kYyyok.',
        'kYybbbok .kYybok. ..kYok.. .kYyyok.',
        'kyyyybok .kyybok. ..kyok.. .kyyook.',
        '.kyoook. .kyook.. ..kyok.. ..kook..',
        '..kkkk.. ..kkkk.. ...kk... ..kkkk..'
      ]
    ]);
    // bigtoken: a big coin, worth five, with a bold 9 and a shine (12 by 12, 4 frames like the token).
    Q.art.def('bigtoken', 12, 12, Q.art.pal({ y: '#ffd23f', Y: '#fff4bf', o: '#d8961a', O: '#b07214', b: '#7a4a0e', w: '#ffffff' }), [
      [
        '....kkkk.... ....kkkk.... .....kk..... ....kkkk....',
        '..kkYYYYkk.. ...kYYyyk... ....kYok.... ...kYyyok...',
        '.kYYyyyyyok. ..kYyyyyok.. ....kYok.... ..kYyyyyok..',
        '.kYybbbbyok. ..kYbbbyok.. ....kYok.... ..kYyyyyok..',
        'kYyyboobyook .kYybyboook. ....kYok.... .kYyyyyyook.',
        'kYyybbbbyook .kYybbbyook. ....kYok.... .kYyyyyyook.',
        'kYyyyyobyook .kYyyybyook. ....kYok.... .kYyyyyyook.',
        'kyyyyyybyook .kyyyybyook. ....kyok.... .kyyyyyyook.',
        '.kyybbbbyOk. ..kybbbyOk.. ....kyok.... ..kyyyyyOk..',
        '.kyyyyyyoOk. ..kyyyyoOk.. ....kyOk.... ..kyyyyoOk..',
        '..kkooooOk.. ...kooOOk... ....kyOk.... ...kooOOk...',
        '....kkkk.... ....kkkk.... .....kk..... ....kkkk....'
      ]
    ]);
    // heart: a heart to pick up (heals one), 8 by 8; frame 1 beats a little brighter.
    Q.art.def('heart', 8, 8, Q.art.pal({ r: '#e8404f', R: '#ff7f8c', W: '#ffd6db', d: '#a8243a' }), [
      [
        '.kk..kk. .kk..kk.',
        'kWRkkRrk kWWkkRRk',
        'kWrrrrdk kWRRRRrk',
        'krrrrrdk kRRRRrdk',
        '.krrrdk. .kRrrdk.',
        '..krdk.. ..krdk..',
        '...kk... ...kk...',
        '........ ........'
      ]
    ]);
    // memo: a folded paper with a dog-eared corner and lines of writing (8 by 10); frame 1 has a glint.
    Q.art.def('memo', 8, 10, Q.art.pal({ w: '#f6efe2', W: '#ffffff', x: '#d8ccb6', c: '#bcae94', b: '#2f7de1', y: '#ffd23f' }), [
      [
        'kkkkkk.. kkkkkk.y',
        'kwwwwkk. kWwwwkk.',
        'kwbbwkck kwbWwkck',
        'kwwwwkkk kwwwWkkk',
        'kwbbbbwk kwbbbWwk',
        'kwwwwwwk kwwwwwWk',
        'kwbbbwwk kwbbbwwk',
        'kwwwwwwk kwwwwwwk',
        'kxxxxxxk kxxxxxxk',
        'kkkkkkkk kkkkkkkk'
      ]
    ]);
