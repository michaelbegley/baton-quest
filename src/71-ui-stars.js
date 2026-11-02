    // ---------- 71-ui-stars.js: version 116's shared pieces for the UI (UI, builder 5; QUEST-API.md part 14) ----------
    // The gold stars as the UI reads them (ENGINE's rules in Q.STAR, STORY's words in Q.STARTEXT, the won ones in Q.SAVE.stars), the best times and par
    // (Q.SAVE.best, Q.PAR), HOLD MUSIC's list (Q.TRACK, else every song), the star and clock marks (ART's ic-star and ic-clock, or our own), and U.emit.
    // Everything here is read at run time and works with nothing in it: an old save, or a part that is not in yet.
    (function () {
      var U = Q.ui;
      function own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
      U.own = own;
      var ORDER = ['onboarded', 'c1', 'c2', 'c3', 'shipped', 'memos-1', 'memos-2', 'memos-3', 'memos-4', 'memos-all', 'cat', 'cats', 'secrets', 'clean-level',
        'clean-boss', 'no-fall', 'par', 'par-all', 'encore', 'encore-clean', 'spam', 'dashes', 'pounds', 'tokens', 'bowtie', 'coffee', 'over', 'afk', 'signs',
        'hold', 'root', 'all'];   // part 14.2's table, in its order
      U.emit = function (name, data) { if (typeof Q.emit === 'function') Q.emit(name, data || {}); };   // the UI's own events: buy, pause, codex, track
      U.sprOr = function (g, id, frame, x, y, mine) {   // a sprite that may not be in yet: ours (or nothing) in its place, never the magenta box
        if (Q.SPRITE[id]) Q.spr(g, id, frame || 0, Math.round(x), Math.round(y)); else if (mine) mine(g, Math.round(x), Math.round(y));
      };
      // ---- the gold stars ----
      U.starIds = function () {   // the ids ENGINE has rules for (the plan's order first, then any others); the plan's 32 while there are none yet
        var out = [], seen = {}, i, k, any = false;
        for (k in Q.STAR) if (own(Q.STAR, k)) { any = true; break; }
        if (!any) return ORDER.slice();
        for (i = 0; i < ORDER.length; i++) if (own(Q.STAR, ORDER[i])) { out.push(ORDER[i]); seen[ORDER[i]] = 1; }
        for (k in Q.STAR) if (own(Q.STAR, k) && !seen[k]) out.push(k);
        return out;
      };
      U.starText = function (id) {   // STORY's words for a star, or plain ones of our own: { name, how, won, secret }
        var t = own(Q.STARTEXT, id) ? Q.STARTEXT[id] : null;
        return { name: t && t.name ? String(t.name).toUpperCase() : String(id).toUpperCase().replace(/-/g, ' '), how: t && t.how ? String(t.how).toUpperCase() : '',
          won: t && t.won ? String(t.won).toUpperCase() : '', secret: t ? !!t.secret : id === 'afk' || id === 'root' };   // afk and root are the plan's secret two
      };
      U.starWon = function (id, s) { s = s || Q.SAVE; return !!(s && s.stars && typeof s.stars === 'object' && s.stars[id]); };
      U.starCount = function (s) { var ids = U.starIds(), n = 0, i; for (i = 0; i < ids.length; i++) if (U.starWon(ids[i], s)) n++; return { n: n, all: ids.length }; };
      U.starsAll = function () { var c = U.starCount(); return c.all > 0 && c.n >= c.all; };
      U.starNeed = function (id) {   // a counting star's progress { have, need } (have no more than need), or null when its rule has no need
        var r = own(Q.STAR, id) ? Q.STAR[id] : null, need = r ? +r.need : 0, have;
        if (!r || !(need > 0) || !r.stat) return null;
        have = +Q.stat(r.stat); if (!(have > 0)) have = 0;
        return { have: Math.min(Math.floor(have), need), need: need };
      };
      U.starIcon = function (g, x, y, won) {   // a 12 by 12 star: ART's ic-star (frame 0 won, 1 locked), or our own
        var id = Q.SPRITE['ic-star'] ? 'ic-star' : 'u5-star';
        Q.spr(g, id, won ? 0 : Math.min(1, Math.max(0, U.frames(id) - 1)), Math.round(x), Math.round(y));
      };
      U.clockIcon = function (g, x, y, lit) {   // an 8 by 8 stopwatch: ART's ic-clock, or our own; dim when not lit
        var id = Q.SPRITE['ic-clock'] ? 'ic-clock' : 'u5-clock', a = g.globalAlpha;
        if (!lit) g.globalAlpha = a * 0.3;
        Q.spr(g, id, 0, Math.round(x), Math.round(y));
        g.globalAlpha = a;
      };
      // ---- SPRINT REVIEW: best times and par ----
      U.mss = function (secs) {   // seconds as m:ss, rounded up, so a time shown at par is at par (par is whole seconds)
        var s = Math.max(0, Math.ceil((+secs || 0) - 0.001));
        return Math.floor(s / 60) + ':' + (s % 60 < 10 ? '0' : '') + (s % 60);
      };
      U.best = function (id) { var b = Q.SAVE && Q.SAVE.best, v = b && typeof b === 'object' ? +b[id] : 0; return v > 0 ? v : 0; };
      U.par = function (id) { var v = own(Q.PAR, id) ? +Q.PAR[id] : 0; return v > 0 ? v : 0; };
      U.underPar = function (id) { var b = U.best(id), p = U.par(id); return !!(b && p && b <= p); };
      U.parLevels = function (only) {   // the 16 with a par (part 14.3): each world's three levels and its boss fight, in play order (or world only's four); no bonus levels, no rooms
        var out = [], n, w, i;
        for (n = only || 1; n <= (only || 4); n++) {
          w = Q.WORLD[n];
          for (i = 0; i < 3; i++) out.push(w && w.levels && w.levels[i] ? w.levels[i] : 'w' + n + '-' + (i + 1));
          out.push(w && w.boss ? w.boss : 'w' + n + '-boss');
        }
        return out;
      };
      U.encoreBest = function () { var v = Q.SAVE ? +Q.SAVE.encore : 0; return v > 0 ? v : 0; };   // THE ENCORE's best time (ENGINE keeps it)
      // ---- HOLD MUSIC: STORY's tracks in its order (dim when AUDIO has no such song), else every song by its id ----
      U.tracks = function () {
        var out = [], k, t;
        for (k in Q.TRACK) if (own(Q.TRACK, k)) { t = Q.TRACK[k] || {}; out.push({ id: k, name: String(t.name || k).toUpperCase(), note: String(t.note || '').toUpperCase(), has: own(Q.SONG, k) }); }
        if (!out.length) for (k in Q.SONG) if (own(Q.SONG, k)) out.push({ id: k, name: k.toUpperCase(), note: '', has: true });
        return out;
      };
      // ---- our own marks, used only while ART's are missing ----
      Q.defSprite('u5-star', { w: 12, h: 12, n: 2, pal: { k: '#1d1d24', Y: '#fff1a8', y: '#ffd23f', o: '#c98a12', h: '#8a93a8', g: '#5d6378', G: '#3a3e50' }, frames: [
        ['.....k......', '....kYk.....', '....kYk.....', 'kkkkYyykkkk.', 'kYYYyyyyyok.', '.kYyyyyyok..', '..kyyyyyk...', '..kyyyyok...', '.kyyokyyok..', '.kyok.kyok..',
         'kyk.....kok.', 'kk.......kk.'],
        ['.....k......', '....khk.....', '....khk.....', 'kkkkhggkkkk.', 'khhhgggggGk.', '.khgggggGk..', '..kgggggk...', '..kggggGk...', '.kggGkggGk..', '.kgGk.kgGk..',
         'kgk.....kGk.', 'kk.......kk.']
      ] });
      Q.defSprite('u5-clock', { w: 8, h: 8, n: 1, pal: { k: '#1d1d24', y: '#ffd23f', w: '#ffffff', x: '#c3c7d4' }, frames: [
        ['..kyyk..', '..kkkk..', '.kwwwwk.', 'kwwwkwxk', 'kwwwkwxk', 'kwwkkwxk', '.kxxxxk.', '..kkkk..']
      ] });
    })();
