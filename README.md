# Baton Quest

A small platforming RPG. SCOPE CREEP, a tangle of just one more thing, has wrapped the three agents C1, C2 and C3 in sticky notes and pulled them into the 9F computer. The conductor jumps in after them with a baton: four worlds (the Inbox, the Server Room, the Cloud and the Backlog), three levels and a boss in each, and more after the credits.

**Play it:** https://michaelbegley.github.io/baton-quest/

It plays on a phone (upright, or turned sideways for a bigger screen), on a computer, and with a controller. On a phone, "Add to Home Screen" opens it full screen.

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
