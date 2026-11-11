# Baton Quest (beta)

A small platforming RPG. SCOPE CREEP, a tangle of just one more thing, has wrapped the three agents C1, C2 and C3 in sticky notes and pulled them into the 9F computer. The conductor jumps in after them with a baton: four worlds (the Inbox, the Server Room, the Cloud and the Backlog), three levels and a boss in each, and more after the credits.

**Play it:** https://michaelbegley.github.io/baton-quest/

It is in beta: things will keep changing, and your saves carry over every update.

GAME MODES (on the main menu) has BATTLE: up to four conductors in one arena, last one standing: you and CPUs, up to four controllers on one screen, or friends online (one device hosts; friends join with its 6-letter code or its link; the host can remove anyone from the lobby). HIGH SCORE plays all 16 stages from the start on three tries, with combos up to X5 and a TOP 5 of three-letter names. SPEED RUN races one world, or all 16, on one clock, with splits against your best and a medal against par. Both keep their records in your browser beside your three files, and a run never changes a file.

**The manual:** https://michaelbegley.github.io/baton-quest/manual.html, an instruction booklet of our own that opens and turns like a real one: the story, the cast, the controls, the four floors and a secret or two.

On a computer it fills the window, and on a wide one (16:9 up to 32:9) it shows more of each level instead of stretching it; menus stay in the middle. On a phone or tablet it is the 9F POCKET, a handheld of our own that fills the screen: upright, or turned sideways for a bigger picture. A controller works on both. On a phone, "Add to Home Screen" opens it full screen.

MENU (top right on a computer) has the settings: VIEW (auto, full window or handheld), PIXELS (sharp whole-number steps, or fill), WIDESCREEN (auto, or off for the classic 320 by 200), SIDE GLOW, BUTTONS (small, medium, large) and VIBRATION. They stay in your browser.

## Controls

| | Keyboard | Phone | Controller |
|---|---|---|---|
| Move | Arrow keys or W A S D | D-pad | D-pad or left stick |
| Jump (A) | Space, Z or K | A | Bottom button |
| Baton (B), hold for a note | X or J | B | Right button |
| Dash (C) | C or L | C | Left or top button, or a bumper |
| Drop through a thin shelf | Down | Down | Down |
| Open a door | Up | Up | Up |
| Pause | Enter or P | START | Start |

## Saves

The game saves at the coffee mugs, in your own browser, in one of three files. Updates to this page keep your saves. To be extra safe, MENU, then SAVES: save a backup file or copy a code, and restore it on any phone or computer.

## Building

The game is written in plain JavaScript in `src/` (one part per file, joined in name order). `python3 tools/build.py` joins them into `js/game.js`. `js/runtime.js` is the little computer the game runs on, and `js/pocket.js` is the handheld around it (keys, touch, controller, sound), and `js/saves.js` adds the save backup to the MENU. `manual.html` is the instruction booklet, with its pictures in `manual/`.

Made with Claude.
