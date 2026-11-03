# Baton Quest

A small platforming RPG. SCOPE CREEP, a tangle of just one more thing, has wrapped the three agents C1, C2 and C3 in sticky notes and pulled them into the 9F computer. The conductor jumps in after them with a baton: four worlds (the Inbox, the Server Room, the Cloud and the Backlog), three levels and a boss in each, and more after the credits.

**Play it:** https://michaelbegley.github.io/baton-quest/

On a computer it fills the window (on very wide screens the sides glow with the game's colours). On a phone or tablet it is the 9F POCKET, a handheld of our own that fills the screen: upright, or turned sideways for a bigger picture. A controller works on both. On a phone, "Add to Home Screen" opens it full screen.

MENU (top right on a computer) has the settings: VIEW (auto, full window or handheld), PIXELS (sharp whole-number steps, or fill), SIDE GLOW, BUTTONS (small, medium, large) and VIBRATION. They stay in your browser.

## Controls

| | Keyboard | Phone | Controller |
|---|---|---|---|
| Move | Arrow keys or W A S D | D-pad | D-pad or left stick |
| Jump (A) | Space or Z | A | Bottom button |
| Baton (B), hold for a note | X | B | Right button |
| Dash (C) | C | C | Left or top button, or a bumper |
| Drop through a thin shelf | Down | Down | Down |
| Open a door | Up | Up | Up |
| Pause | Enter | START | Start |

## Saves

The game saves at the coffee mugs, in your own browser, in one of three files. Updates to this page keep your saves.

## Building

The game is written in plain JavaScript in `src/` (one part per file, joined in name order). `python3 tools/build.py` joins them into `js/game.js`. `js/runtime.js` is the little computer the game runs on, and `js/pocket.js` is the handheld around it (keys, touch, controller, sound).

Made with Claude.
