    // ---------- 75-ui-codex-music.js: the codex's HOLD MUSIC page, the jukebox (UI, builder 5; QUEST-API.md part 14.5) ----------
    // After the ending: every song in Q.TRACK by its name, in STORY's order (every song in Q.SONG by its id while there are no tracks). Up and down choose,
    // A plays it from its top (Q.music) and sends the event 'track' { id }; B stops it and goes back, and the scene's own song comes back (the codex's leave).
    // The first time the page opens: the 'hold-music' script (kept in the save as the flag u5-hold-music). A track AUDIO has no song for yet shows dim.
    (function () {
      var U = Q.ui, SEC = U.codexSec || (U.codexSec = {}), MU = { prev: undefined, now: '', heard: false }, ROWS = 9;
      function list() { return U.tracks(); }
      function playedN(n) { var k = Q.stat('tracks') | 0; return Math.max(0, Math.min(n, k)); }
      U.jukebox = function () { return { now: MU.now, prev: MU.prev === undefined ? null : MU.prev }; };   // for checks
      SEC.music = {
        name: 'HOLD MUSIC',
        open: function () { return !!(Q.SAVE && Q.SAVE.won); },
        col: function () { return '#a070e0'; },
        rows: function () { return list().length; },
        title: function () { return 'PLEASE HOLD. YOUR SONG IS IMPORTANT TO US.'; },
        count: function () { var n = list().length; return 'PLAYED ' + playedN(n) + '/' + n; },
        hint: function () { return 'UP/DOWN: CHOOSE   A: PLAY   B: STOP AND BACK'; },
        tab: function (g, x, y) {
          U.sprOr(g, 'ic-note', 0, x + 1, y + 1, function (c, px, py) {   // our own note while ART's icon is missing
            U.fill(c, px + 6, py + 1, 2, 9, '#ffd23f'); U.fill(c, px + 8, py + 1, 3, 2, '#ffd23f'); U.fill(c, px + 3, py + 8, 4, 3, '#ffd23f');
          });
        },
        show: function () {   // the first time: STORY's hold-music lines (once a save; kept when the flag cannot be)
          if (MU.heard || Q.flag('u5-hold-music')) return;
          MU.heard = true;
          if (!Q.SCRIPT['hold-music']) return;
          Q.flag('u5-hold-music', true); Q.saveGame(); Q.say('hold-music');
        },
        a: function (sub, sel) {
          var t = list()[sel];
          if (!t || !t.has) { Q.sfx('nope'); return; }
          if (MU.prev === undefined) MU.prev = Q.au && Q.au.id !== undefined ? Q.au.id : null;   // the scene's own song, to put back after
          MU.now = t.id; Q.music(t.id, true);
          U.emit('track', { id: t.id });
        },
        leave: function () { if (MU.now) { var p = MU.prev; MU.now = ''; MU.prev = undefined; Q.music(p || null); } },
        draw: function (g, sub, sel, t) {
          var l = list(), n = l.length, top = Q.clamp(sel - 4, 0, Math.max(0, n - ROWS)), i, k, y, on, tr, lines;
          if (!n) { U.text('NO SONGS ON HOLD YET.', 160, 92, '#5d6378', 1, 'center'); U.fill(g, 14, 151, 292, 1, '#2a2c3a'); return; }
          for (i = 0; i < ROWS && top + i < n; i++) {
            k = top + i; tr = l[k]; y = 46 + i * 11; on = sel === k;
            if (on) U.fill(g, 14, y - 2, 292, 11, '#262838');
            U.text((k < 9 ? '0' : '') + (k + 1), 18, y, '#5d6378');
            U.item(tr.name, 40, y, on, !tr.has && !on);
            if (tr.id === MU.now) U.sprOr(g, 'ui-note', 0, 294, y - 1 - (Math.floor(t * 4) % 2), function (c, px, py) { U.fill(c, px + 3, py, 1, 6, '#ffd23f'); U.fill(c, px + 1, py + 5, 3, 2, '#ffd23f'); });   // the one playing: a note bobbing
            else if (!tr.has) U.text('COMING SOON', 302, y, '#5d6378', 1, 'right');
          }
          if (top > 0) U.arrow(g, 296, 43, '#8a93a8', true);
          if (top + ROWS < n) U.arrow(g, 296, 146, '#8a93a8');
          U.fill(g, 14, 151, 292, 1, '#2a2c3a');
          tr = l[Math.min(sel, n - 1)];
          if (tr && tr.note) { lines = Q.wrap(tr.note, 46); U.text(lines[0], 160, 156, '#c3c7d4', 1, 'center'); }
          if (U.musicOpt && U.musicOpt() === 'OFF') U.text('MUSIC IS OFF. TURN IT UP IN THE PAUSE MENU.', 160, 167, '#e0443a', 1, 'center');
          else if (MU.now) U.text('NOW PLAYING: ' + nameOf(l, MU.now), 160, 167, '#ffd23f', 1, 'center');
        }
      };
      function nameOf(l, id) { for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i].name; return id.toUpperCase(); }
    })();
