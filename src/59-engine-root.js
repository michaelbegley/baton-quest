    // ---------- 59-engine-root.js (ENGINE): THE ROOT FOLDER (QUEST-API part 14.6): its five rooms' flow, Q.rootOpen and Q.rootDone ----------
    // Open once the game is won with SECRETS 4/4 (the map's stop starts root-1). Each room (root: true) goes on by its E to its next and clears nothing in
    // the worlds; its song is root unless the room names another. root-start then root-1 as he arrives in the first room, root-2 to root-4 in the others
    // (once a visit, not after a game over). README.TXT on the last room's desk (ROOT's own entity) ends it with Q.rootDone: the event root, the game saved,
    // root-won, the map.
    var engRootEnd = false;
    Q.rootOpen = function () { return !!engSave().won && Q.stat('secrets') >= 4; };
    function engRootArrive(id, opts) {
      var m = /^root-([1-4])$/.exec(id);
      engRootEnd = false;
      if (!m || (opts && opts.retry)) return;
      if (m[1] === '1') engSay('root-start', function () { engSay('root-1'); });
      else engSay('root-' + m[1]);
    }
    function engRootNext() {   // a room's E: its next room; with no next, the map
      var lv = Q.level, s = engSave(), next = lv && lv.next;
      engSyncSave();
      if (next && engOwn(Q.LEVEL, next)) { s.at = next; s.ck = null; Q.saveGame(); return Q.startLevel(next); }
      s.at = 'map'; s.ck = null; Q.saveGame();
      return Q.go('map') || Q.go('title');
    }
    Q.rootDone = function () {   // README.TXT read
      var s = engSave();
      if (engRootEnd) return false;
      engRootEnd = true; s.flags.root = true;
      Q.emit('root');
      s.at = 'map'; s.ck = null; Q.saveGame();
      engSay('root-won', function () { engRootEnd = false; if (!Q.go('map')) Q.go('title'); });
      return true;
    };
