    // ---------- 58-engine-stars.js (ENGINE): GOLD STARS (QUEST-API part 14.2): every event counted into Q.SAVE.stats, each star a rule tested on its event ----------
    // A rule is a defStar with on (its event), test (data and Q, true to win), and stat and need on the ones that count, for the codex's progress (the stat's count of need).
    // Won: Q.SAVE.stars[id] = true, the game saved, the star sound, a toast GOLD STAR: <NAME> (Q.STARTEXT's name, else the id), then the event star. Never taken back.
    var ENG_EV = ['jump', 'dash', 'hover', 'pound', 'kill', 'hurt', 'fall', 'over', 'pickup', 'memo', 'cat', 'save', 'sign', 'level', 'boss', 'secret', 'learn', 'lvup', 'end',
      'idle', 'encore', 'root', 'star', 'buy', 'pause', 'codex', 'track'];   // part 14.1: the engine's, then the UI's
    function engStats() { var s = engSave(); if (!s.stats || typeof s.stats !== 'object') s.stats = {}; return s.stats; }
    function engStars() { var s = engSave(); if (!s.stars || typeof s.stars !== 'object') s.stars = {}; return s.stars; }
    function engAdd(st, k, n) { st[k] = (st[k] || 0) + n; }
    function engCountEvent(name, d) {   // a count for every event, plus kill.<id>, buy.<item>, tokens by value, and the different signs and tracks
      var st = engStats(), k;
      engAdd(st, name, 1);
      if (name === 'kill' && d.id) engAdd(st, 'kill.' + d.id, 1);
      else if (name === 'buy' && d.item) engAdd(st, 'buy.' + d.item, 1);
      else if (name === 'pickup') engAdd(st, 'tokens', d.n | 0);
      else if (name === 'sign' && d.level) { k = 'sign.' + d.level + '.' + d.i; if (!st[k]) engAdd(st, 'signs', 1); engAdd(st, k, 1); }
      else if (name === 'track' && d.id) { k = 'track.' + d.id; if (!st[k]) engAdd(st, 'tracks', 1); engAdd(st, k, 1); }
    }
    function engWorldMemos(n) {   // the memo ids of world n's levels (their memos lists)
      var w = Q.WORLD[n], out = [], i, j, L;
      if (!w || !w.levels) return out;
      for (i = 0; i < w.levels.length; i++) { L = Q.LEVEL[w.levels[i]]; if (L && L.memos) for (j = 0; j < L.memos.length; j++) if (L.memos[j]) out.push(L.memos[j]); }
      return out;
    }
    function engFound(list) { var s = engSave(), n = 0, i; for (i = 0; i < list.length; i++) if (s.memos[list[i]]) n++; return n; }
    function engTrackIds() { var l = Object.keys(Q.TRACK); return l.length ? l : Object.keys(Q.SONG); }   // every song of HOLD MUSIC (its songs until STORY's tracks land)
    Q.stat = function (name) {   // a count from Q.SAVE.stats; these few from the save itself, so a save from before stats shows its progress: memos, memos.<n>, cats, secrets, par, stars
      var s = engSave(), n = 0, k, m = /^memos\.([1-4])$/.exec(String(name));
      if (m) return engFound(engWorldMemos(+m[1]));
      if (name === 'memos') { for (k = 1; k <= 4; k++) n += engFound(engWorldMemos(k)); return n; }
      if (name === 'cats') { for (k = 1; k <= 4; k++) if (s.flags['cat' + k]) n++; return n; }
      if (name === 'secrets') { for (k in Q.LEVEL) if (engOwn(Q.LEVEL, k) && Q.LEVEL[k].bonus && s.flags['bonus-' + k]) n++; return n; }
      if (name === 'par') { for (k in Q.PAR) if (engOwn(Q.PAR, k) && s.best[k] > 0 && s.best[k] <= Q.PAR[k]) n++; return n; }
      if (name === 'stars') { for (k in Q.STAR) if (engOwn(Q.STAR, k) && k !== 'all' && engStars()[k]) n++; return n; }
      return (engStats()[name] || 0) | 0;
    };
    Q.star = function (id) { var s = Q.SAVE; return !!(s && s.stars && s.stars[id]); };
    function engStarName(id) { var t = engOwn(Q.STARTEXT, id) ? Q.STARTEXT[id] : null; return (t && t.name) || String(id).toUpperCase(); }
    var engStarQ = [], engStarBusy = false;
    function engStarWin(id, quiet) {
      var st = engStars();
      if (st[id] || !engOwn(Q.STAR, id) || (!quiet && engCheatBlocks())) return false;   // none with WORK FROM HOME or LIGHT WORKLOAD on, nor in an EARLY FINISH level
      st[id] = true;
      if (quiet) return true;
      Q.saveGame(); Q.sfx('star'); Q.toast('GOLD STAR: ' + engStarName(id), 3);
      engStarQ.push(id);   // the star events go out in the order the stars were won, each after its toast (ALL, won by another's event, comes after it)
      if (!engStarBusy) { engStarBusy = true; try { while (engStarQ.length) Q.emit('star', { id: engStarQ.shift() }); } finally { engStarBusy = false; } }
      return true;
    }
    function engStarsOn(name, d) {   // each star not yet won whose rule is on this event: its test
      var st = engStars(), id, r;
      for (id in Q.STAR) {
        if (!engOwn(Q.STAR, id) || st[id]) continue;
        r = Q.STAR[id];
        if (!r || r.on !== name) continue;
        try { if (!r.test || r.test(d, Q)) engStarWin(id); } catch (er) { Q.warn('ERROR in the star rule ' + id + ': ' + er); }
      }
    }
    (function () {   // one listener for each event, at load (part 14.1): count it, then test the stars that are on it
      var i;
      function hear(name) { Q.on(name, function (d) { engCountEvent(name, d); engStarsOn(name, d); }); }
      for (i = 0; i < ENG_EV.length; i++) hear(ENG_EV[i]);
    })();
    function engStarsCatchUp() {   // a save from before version 116: the stars its past already earned, given quietly at start (no toast, no sound)
      var s = engSave(), n = 0, i, l = ['memos-1', 'memos-2', 'memos-3', 'memos-4', 'memos-all', 'cats', 'secrets'];
      if (s.cleared['w1-1'] && engStarWin('onboarded', true)) n++;
      if (Q.has('dash') && engStarWin('c1', true)) n++;
      if (Q.has('hover') && engStarWin('c2', true)) n++;
      if (Q.has('pound') && engStarWin('c3', true)) n++;
      if (s.won && engStarWin('shipped', true)) n++;
      if (Q.stat('cats') > 0 && engStarWin('cat', true)) n++;
      for (i = 0; i < l.length; i++) { try { if (engOwn(Q.STAR, l[i]) && Q.STAR[l[i]].test({}, Q) && engStarWin(l[i], true)) n++; } catch (er) { Q.warn('ERROR in the star rule ' + l[i] + ': ' + er); } }
      return n;
    }

    // ---------- the 32 rules (part 14.2's table, in its order); a rule with no test is won by its event alone ----------
    function engIsWorld(id, a, b) { var L = engOwn(Q.LEVEL, id) ? Q.LEVEL[id] : null; return !!L && !L.bonus && !L.root && L.world >= a && L.world <= b; }
    function engCountStar(on, stat, need) { return { on: on, stat: stat, need: need, test: function () { return Q.stat(stat) >= need; } }; }
    function engMemoStar(n) { return { on: 'memo', stat: 'memos.' + n, need: 6, test: function () { var l = engWorldMemos(n); return l.length > 0 && engFound(l) >= l.length; } }; }
    Q.defStar('onboarded', { on: 'level', test: function (d) { return d.id === 'w1-1'; } });
    Q.defStar('c1', { on: 'learn', test: function (d) { return d.ability === 'dash'; } });
    Q.defStar('c2', { on: 'learn', test: function (d) { return d.ability === 'hover'; } });
    Q.defStar('c3', { on: 'learn', test: function (d) { return d.ability === 'pound'; } });
    Q.defStar('shipped', { on: 'end' });
    Q.defStar('memos-1', engMemoStar(1)); Q.defStar('memos-2', engMemoStar(2)); Q.defStar('memos-3', engMemoStar(3)); Q.defStar('memos-4', engMemoStar(4));
    Q.defStar('memos-all', { on: 'memo', stat: 'memos', need: 24, test: function () { var l = [], n; for (n = 1; n <= 4; n++) l = l.concat(engWorldMemos(n)); return l.length > 0 && engFound(l) >= l.length; } });
    Q.defStar('cat', { on: 'cat' });
    Q.defStar('cats', engCountStar('cat', 'cats', 4));
    Q.defStar('secrets', engCountStar('secret', 'secrets', 4));
    Q.defStar('clean-level', { on: 'level', test: function (d) { return d.hits === 0 && engIsWorld(d.id, 2, 4); } });
    Q.defStar('clean-boss', { on: 'boss', test: function (d) { return d.hits === 0; } });
    Q.defStar('no-fall', { on: 'level', test: function (d) { return d.id === 'w3-3' && d.falls === 0; } });
    Q.defStar('par', { on: 'level', test: function (d) { var p = engOwn(Q.PAR, d.id) ? Q.PAR[d.id] : 0; return p > 0 && d.t <= p; } });
    Q.defStar('par-all', engCountStar('level', 'par', 16));   // the 12 levels and the 4 boss fights
    Q.defStar('encore', { on: 'encore' });
    Q.defStar('encore-clean', { on: 'encore', test: function (d) { return (d.hits | 0) <= 3; } });
    Q.defStar('spam', engCountStar('kill', 'kill.spam', 25));
    Q.defStar('dashes', engCountStar('dash', 'dash', 200));
    Q.defStar('pounds', engCountStar('pound', 'pound', 50));
    Q.defStar('tokens', engCountStar('pickup', 'tokens', 777));
    Q.defStar('bowtie', { on: 'buy', test: function (d) { return d.item === 'bowtie'; } });
    Q.defStar('coffee', engCountStar('buy', 'buy.coffee', 5));
    Q.defStar('over', { on: 'over' });
    Q.defStar('afk', { on: 'idle' });
    Q.defStar('signs', engCountStar('sign', 'signs', 50));
    Q.defStar('hold', { on: 'track', stat: 'tracks', test: function () { var l = engTrackIds(), i; for (i = 0; i < l.length; i++) if (!(Q.stat('track.' + l[i]) > 0)) return false; return l.length > 0; } });
    Object.defineProperty(Q.STAR.hold, 'need', { enumerable: true, get: function () { return engTrackIds().length || 21; } });   // every song of HOLD MUSIC, as many as there are
    Q.defStar('root', { on: 'root' });
    Q.defStar('all', { on: 'star', stat: 'stars', need: 31, test: function () { var id; for (id in Q.STAR) if (engOwn(Q.STAR, id) && id !== 'all' && !Q.star(id)) return false; return true; } });
