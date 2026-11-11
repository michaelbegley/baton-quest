    // ---------- 73-ui-map-compass.js (B24, 11 Nov 2026): THE COMPASS's voice in the text box, its record, and the COMPASS CHECK's four lines (UI) ----------
    // The check is worked out from the save alone: MOVED (what changed since this file's last check), SLIPPED (what was left behind in cleared levels: memos, the
    // cat, a secret door; the save keeps no tokens by level, so it does not tell tokens), DRIFTED (play time since the last new level cleared, or since anything
    // new once the story is done: a level, a secret level or a gold star; NOTHING. GOOD. under ten minutes) and ONE THING NEXT (the next level to clear; after the
    // story the next secret door, THE ROOT FOLDER, then the next gold star), with the stop on the map it points at. The drawing is 73-ui-map-compass-b.js.
    // Its own small record, Q.SAVE.compass: met (1 once its first scene has played), seen (what it saw at the last check), lvN and lvAt (the story levels cleared,
    // and the play time when that last grew), newN and newAt (the same for levels, secret levels and stars together), warned (the time it last said DRIFTED for).
    // U.compassKeep writes that record alone into this file's stored copy, read fresh from the store as U.setOpt and the stopwatch do (never Q.api.load(), which
    // hands back the live save), so a check never saves progress: version 120's lesson. The game's own saves carry the record too, as part of Q.SAVE.
    (function () {
      var U = Q.ui, CP = U.cp = { DRIFT: 600 };   // ten minutes of play
      U.WHO.compass = { edge: '#d9a83a', name: '#ffe9a0', spr: 'face-compass', cps: 38, stop: 0.3 };   // brass; it types steadily and stops at a full stop
      var tickN = 0;
      Q.defSfx('type-compass', function (api) { var f = (tickN++ & 1) ? 1568 : 1175; api.tone(f, f, 0.025, 'triangle', 0.03); });   // a soft tick, like a needle settling
      function own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
      function num(v) { v = +v; return v > 0 && isFinite(v) ? v : 0; }
      CP.rec = function (make) {   // this file's record (made when asked), or null
        var s = Q.SAVE, r;
        if (!s || typeof s !== 'object') return null;
        r = s.compass;
        if (!r || typeof r !== 'object' || Array.isArray(r)) { if (!make) return null; r = s.compass = { v: 1 }; }
        return r;
      };
      U.compassKeep = function () {   // the record alone into the stored copy of this file; nothing else in the store changes
        var s = Q.SAVE, r = CP.rec(false), raw = null, f;
        if (!r || !engRaw || typeof engRaw.load !== 'function' || typeof engRaw.save !== 'function') return false;
        try { raw = engRaw.load(); } catch (e) { raw = null; }
        if (!raw || !raw.files3 || !raw.files || raw.files.length !== 3 || (raw.cur | 0) !== engFilesGet().cur) return false;
        f = raw.files[raw.cur | 0];
        if (!f || typeof f !== 'object') return false;   // nothing of this file stored yet: its first save carries the record
        if (s.watch && f.watch && s.watch.run !== f.watch.run) return false;   // another play-through's save (a new game not saved yet): left alone
        f.compass = JSON.parse(JSON.stringify(r));
        try { engRaw.save(raw); } catch (e2) { return false; }
        return true;
      };
      // ---- what the save says ----
      var CATLV = null;
      function catLevels() {   // each world's level where the office cat hides (an @ in its map), worked out once
        var w, i, L, id, j;
        if (CATLV) return CATLV;
        CATLV = {};
        for (w = 1; w <= 4; w++) for (i = 0; i < 3; i++) {
          id = 'w' + w + '-' + (i + 1); L = own(Q.LEVEL, id) ? Q.LEVEL[id] : null;
          if (L && L.map) for (j = 0; j < L.map.length; j++) if (String(L.map[j]).indexOf('@') >= 0) { CATLV[w] = id; break; }
        }
        return CATLV;
      }
      function secretsFound(s) { var n = 0, k, d, f = s.flags || {}; for (k in Q.LEVEL) if (own(Q.LEVEL, k) && (d = Q.LEVEL[k]) && d.bonus && d.world >= 1 && d.world <= 4 && f['bonus-' + k]) n++; return n; }
      CP.facts = function (s) {   // the counts a check compares
        var f = { levels: 0, memos: U.memoCount(s), cats: 0, secrets: secretsFound(s), stars: U.starCount(s).n, lv: s.lv | 0 || 1, won: s.won ? 1 : 0, saved: '' }, l = U.parLevels(), i, k;
        for (i = 0; i < l.length; i++) if (s.cleared && s.cleared[l[i]]) f.levels++;
        for (k = 1; k <= 4; k++) if (s.flags && s.flags['cat' + k]) f.cats++;
        for (k = 1; k <= 3; k++) if ((s.saved || []).indexOf('c' + k) >= 0) f.saved += 'c' + k;
        return f;
      };
      function bump() {   // a level, a secret level or a star: if it is new, the play time it came at
        var s = Q.SAVE, r = CP.rec(true), f, p;
        if (!r) return;
        f = CP.facts(s); p = f.levels + f.secrets + f.stars;
        if (typeof r.lvN !== 'number') r.lvN = f.levels; else if (f.levels > r.lvN) { r.lvN = f.levels; r.lvAt = num(s.time); }
        if (typeof r.newN !== 'number') r.newN = p; else if (p > r.newN) { r.newN = p; r.newAt = num(s.time); }
      }
      Q.on('level', bump); Q.on('secret', bump); Q.on('star', bump);
      var newGame0 = Q.newGame;
      Q.newGame = function () {   // a new file is measured from its first step
        var r = newGame0.apply(this, arguments);
        if (Q.SAVE) Q.SAVE.compass = { v: 1, lvN: 0, lvAt: 0, newN: 0, newAt: 0 };
        return r;
      };
      // ---- the words ----
      function ref(id) { var m = /^w([1-4])-([1-3])$/.exec(id); return m ? m[1] + '-' + m[2] : String(id).toUpperCase(); }   // 1-2, as the game names its levels
      function lname(id) { var L = own(Q.LEVEL, id) ? Q.LEVEL[id] : null; return L && L.name ? String(L.name).toUpperCase() : ref(id); }
      function many(n, one, more) { return n === 1 ? one : n + ' ' + more; }
      function wrapN(s, w) { return Q.wrap(s, w).length; }
      function fit(head, items, w) {   // head and the items that fit on one line of w, in their order (one too long is passed over), then a full stop
        var s = head + items[0], i;
        for (i = 1; i < items.length; i++) if ((s + ', ' + items[i] + '.').length <= w) s += ', ' + items[i];
        return s + '.';
      }
      function agentsBack(list) { return list.length === 3 ? 'ALL THREE BACK' : list.length === 2 ? list[0] + ' AND ' + list[1] + ' BACK' : list[0] + ' IS BACK'; }
      CP.moved = function (r, f) {
        var seen = r && r.seen, items = [], d, back = [], k;
        if (!seen || typeof seen !== 'object') {
          if (!f.levels && !f.memos && !f.stars) return 'FIRST CHECK. A CLEAN SLATE.';
          if (f.levels) items.push(many(f.levels, 'A LEVEL', 'LEVELS'));
          if (f.memos) items.push(many(f.memos, 'A MEMO', 'MEMOS'));
          if (f.stars) items.push(many(f.stars, 'A GOLD STAR', 'GOLD STARS'));
          return fit('FIRST CHECK: ', items, 35);
        }
        if (f.won && !seen.won) items.push('THE STORY IS DONE');
        for (k = 1; k <= 3; k++) if (f.saved.indexOf('c' + k) >= 0 && String(seen.saved || '').indexOf('c' + k) < 0) back.push('C' + k);
        if (back.length) items.push(agentsBack(back));
        if ((d = f.levels - num(seen.levels)) > 0) items.push(many(d, 'A LEVEL', 'LEVELS'));
        if ((d = f.secrets - num(seen.secrets)) > 0) items.push(many(d, 'A SECRET LEVEL', 'SECRET LEVELS'));
        if ((d = f.memos - num(seen.memos)) > 0) items.push(many(d, 'A MEMO', 'MEMOS'));
        if ((d = f.cats - num(seen.cats)) > 0) items.push(d === 1 ? 'THE CAT FOUND' : 'THE CAT ' + d + ' TIMES');
        if ((d = f.stars - num(seen.stars)) > 0) items.push(many(d, 'A GOLD STAR', 'GOLD STARS'));
        if (f.lv > num(seen.lv)) items.push('LV ' + f.lv);
        return items.length ? fit('', items, 35) : 'NOTHING SINCE THE LAST CHECK.';
      };
      CP.left = function (s) {   // what was left behind in cleared levels: { memos: [refs], memoN, cats: [refs], doors: [refs] }
        var out = { memos: [], memoN: 0, cats: [], doors: [] }, cat = catLevels(), w, i, id, L, j, miss, m = s.memos || {}, fl = s.flags || {};
        for (w = 1; w <= 4; w++) for (i = 1; i <= 3; i++) {
          id = 'w' + w + '-' + i; L = own(Q.LEVEL, id) ? Q.LEVEL[id] : null;
          if (!L || !(s.cleared && s.cleared[id])) continue;
          miss = 0; if (L.memos) for (j = 0; j < L.memos.length; j++) if (L.memos[j] && !m[L.memos[j]]) miss++;
          if (miss) { out.memos.push(ref(id)); out.memoN += miss; }
          if (cat[w] === id && !fl['cat' + w]) out.cats.push(ref(id));
          if (L.secret && own(Q.LEVEL, L.secret) && !fl['bonus-' + L.secret]) out.doors.push(ref(id));
        }
        return out;
      };
      CP.slipped = function (s) {   // at most two lines of 35: the places, or only counts where the places do not fit
        var o = CP.left(s), short = { memos: false, cats: false, doors: false }, txt, i, ORDER = ['memos', 'doors', 'cats'];
        function say() {
          var p = [];
          if (o.memoN) p.push(short.memos ? many(o.memoN, 'A MEMO', 'MEMOS') + ' IN ' + many(o.memos.length, 'A LEVEL.', 'LEVELS.') : (o.memoN === 1 ? 'A MEMO: ' : 'MEMOS: ') + o.memos.join(', ') + '.');
          if (o.cats.length) p.push(short.cats ? 'THE CAT IN ' + many(o.cats.length, 'A WORLD.', 'WORLDS.') : 'THE CAT: ' + o.cats.join(', ') + '.');
          if (o.doors.length) p.push(short.doors ? many(o.doors.length, 'A SECRET DOOR.', 'SECRET DOORS.') : (o.doors.length === 1 ? 'A SECRET DOOR: ' : 'SECRET DOORS: ') + o.doors.join(', ') + '.');
          return p.join(' ');
        }
        if (!o.memoN && !o.cats.length && !o.doors.length) return 'NOTHING LEFT BEHIND.';
        txt = say();
        for (i = 0; i < ORDER.length && wrapN(txt, 35) > 2; i++) { short[ORDER[i]] = true; txt = say(); }   // too long: the memos, then the doors, then the cat go to counts
        return txt;
      };
      function span(sec) { var m = Math.floor(sec / 60); return m < 100 ? m + ' MIN' : Math.floor(m / 60) + ' H'; }
      CP.drifted = function (r, s, f) {   // { text, base, first }: base is the play time it measures from
        var base = f.won ? r && r.newAt : r && r.lvAt, d;
        if (!r || typeof base !== 'number') return { text: 'FIRST CHECK. MEASURING FROM NOW.', first: true };
        d = num(s.time) - base;
        if (d < CP.DRIFT) return { text: 'NOTHING. GOOD.', base: base };
        if (r.warned === base) return { text: span(d) + ' NOW. YOUR CALL.', base: base, drift: true, again: true };
        return { text: span(d) + (f.won ? ', NOTHING NEW. SAID ONCE.' : ', NO NEW LEVEL. SAID ONCE.'), base: base, drift: true };
      };
      CP.drifting = function () {   // for the map's little compass: has the play time passed the mark since anything new? (read from the record, a cheap look)
        var s = Q.SAVE, r = CP.rec(false), base;
        if (!s || !r) return false;
        base = s.won ? r.newAt : r.lvAt;
        return typeof base === 'number' && num(s.time) - base >= CP.DRIFT;
      };
      var BOSS_STAR = { 1: 'c1', 2: 'c2', 3: 'c3', 4: 'shipped' };
      var STAR_AT = { 'clean-level': 2, 'clean-boss': 1, 'no-fall': 3, spam: 1, encore: 'encore', 'encore-clean': 'encore', bowtie: 0, coffee: 0, hold: null, all: null };
      function firstSentence(t) { var i = t.indexOf('. '); return i > 0 ? t.slice(0, i + 1) : t; }
      function fitBar(t, name) {   // B28: a gold star's words for the bar (two lines of 42 after ONE THING NEXT): cut at the first comma, else its name, if too long
        var i;
        if (wrapN('ONE THING NEXT  GOLD STAR: ' + t, 42) > 2 && (i = t.indexOf(', ')) > 0) t = t.slice(0, i) + '.';
        return wrapN('ONE THING NEXT  GOLD STAR: ' + t, 42) > 2 ? String(name || 'A GOLD STAR').toUpperCase() + '.' : t;
      }
      CP.next = function (s) {   // { text, at }: at is a stop (1 to 4, 0 VEND-9's shop, 'encore', 'root'), 'here' (where he stands) or null (no spot: the needle stands up)
        var l = U.parLevels(), i, id, w, m, fl = s.flags || {}, ids, t, cat = catLevels(), k, o, secret = false;
        if (!s.won) {
          for (i = 0; i < l.length; i++) if (!(s.cleared && s.cleared[l[i]])) break;
          if (i < l.length) {
            id = l[i]; w = Math.floor(i / 4) + 1;
            if (i % 4 === 3) { t = Q.STARTEXT[BOSS_STAR[w]]; return { text: t && t.how ? String(t.how).toUpperCase() : 'THE BOSS OF ' + U.worldName(w) + '.', at: w }; }
            return { text: ref(id) + ', ' + lname(id) + '.', at: w };
          }
        }
        for (w = 1; w <= 4; w++) for (i = 1; i <= 3; i++) {   // the story is done: the first secret door not found yet
          id = 'w' + w + '-' + i; m = own(Q.LEVEL, id) ? Q.LEVEL[id] : null;
          if (m && m.secret && own(Q.LEVEL, m.secret) && !fl['bonus-' + m.secret]) return { text: 'THE SECRET DOOR IN ' + ref(id) + ', ' + lname(id) + '.', at: w };
        }
        if (Q.rootOpen() && !U.starWon('root', s)) return { text: 'THE ROOT FOLDER. IT IS OPEN NOW.', at: 'root' };
        ids = U.starIds();
        for (i = 0; i < ids.length; i++) {
          k = ids[i]; if (k === 'all' || U.starWon(k, s)) continue;
          t = U.starText(k); if (t.secret) { secret = true; continue; }
          return { text: 'GOLD STAR: ' + fitBar(firstSentence(t.how || t.name), t.name), at: CP.starAt(k, s, cat) };
        }
        if (secret) return { text: 'ONE SECRET STAR LEFT. THAT ONE IS YOURS TO FIND.', at: null };
        o = U.starWon('all', s) || !own(Q.STAR, 'all');
        return { text: o ? 'NOTHING. THAT IS EVERY STAR.' : 'GOLD STAR: ' + firstSentence(U.starText('all').how || 'STAR EMPLOYEE.'), at: null };
      };
      CP.starAt = function (k, s, cat) {   // where a gold star is won, as a stop
        var m = /^memos-([1-4])$/.exec(k), w, i, L, fl = s.flags || {};
        if (m) return +m[1];
        if (own(STAR_AT, k)) return STAR_AT[k];
        if (k === 'memos-all') for (w = 1; w <= 4; w++) if (U.memoCount(s, w) < 6) return w;
        if (k === 'cat' || k === 'cats') for (w = 1; w <= 4; w++) if (!fl['cat' + w] && cat[w]) return w;
        if (k === 'par' || k === 'par-all') { L = U.parLevels(); for (i = 0; i < L.length; i++) if (!U.underPar(L[i])) return Math.floor(i / 4) + 1; }
        if (k === 'secrets') for (w = 1; w <= 4; w++) for (i = 1; i <= 3; i++) { L = Q.LEVEL['w' + w + '-' + i]; if (L && L.secret && !fl['bonus-' + L.secret]) return w; }
        return 'here';   // anywhere will do: where he stands
      };
    })();
