    // ---------- 59-engine-files.js (ENGINE, the director's, 2 Nov): three save files, like the old cartridges (QUEST-API 14.10 item 10) ----------
    // The runtime keeps one stored thing per game (api.save, api.load). Version 116 stores a bundle in it: { files3: 1, cur: 0 to 2, files: [save or null x 3] }.
    // A save from before (one plain save) becomes FILE 1 the first time it loads. Everyone else's Q.api.load() and Q.api.save() keep working: they read and
    // write the current file (engWrapApi in 99-main.js uses engFileLoad and engFileSave). Q.files() describes the three for the file screen (79-ui-files.js);
    // Q.useFile(n) makes FILE n current (its save becomes Q.SAVE); Q.eraseFile(n) empties one. Nothing here touches another game's storage.
    var engFB = null;
    function engFilesGet() {   // the bundle, read once from the runtime (and again after a start)
      var raw = null, b;
      if (engFB) return engFB;
      try { raw = engRaw && engRaw.load ? engRaw.load() : null; } catch (e) { raw = null; }
      if (raw && raw.files3 && raw.files && raw.files.length === 3) b = { files3: 1, cur: Q.clamp(raw.cur | 0, 0, 2), files: [raw.files[0] || null, raw.files[1] || null, raw.files[2] || null] };
      else b = { files3: 1, cur: 0, files: [raw && typeof raw === 'object' ? raw : null, null, null] };   // the one save from before version 116 is FILE 1
      engFB = b; return b;
    }
    function engFilesStore() { try { if (engRaw && engRaw.save) engRaw.save(engFilesGet()); } catch (e) { return false; } return true; }
    function engFileLoad() { var b = engFilesGet(); return b.files[b.cur] || null; }
    function engFileSave(obj) { var b = engFilesGet(); b.files[b.cur] = obj || null; return engFilesStore(); }
    function engFileUsed(s) { return !!(s && typeof s === 'object' && (s.v || s.at || (s.cleared && Object.keys(s.cleared).length) || s.time > 0)); }
    function engFileInfo(s, i, cur) {   // what the file screen shows of one file
      var worlds = 0, stars = 0, n, w, k;
      if (!engFileUsed(s)) return { n: i + 1, cur: i === cur, empty: true };
      for (n = 1; n <= 4; n++) { w = Q.WORLD[n]; if (s.cleared && s.cleared[(w && w.boss) || 'w' + n + '-boss']) worlds++; }
      if (s.stars) for (k in s.stars) if (engOwn(s.stars, k) && s.stars[k]) stars++;
      return { n: i + 1, cur: i === cur, empty: false, lv: s.lv | 0 || 1, hearts: s.maxHp | 0 || Q.HERO.HEARTS, worlds: worlds, stars: stars, time: Math.max(0, +s.time || 0), won: !!s.won, tokens: s.tokens | 0 };
    }
    Q.files = function () { var b = engFilesGet(), out = [], i; for (i = 0; i < 3; i++) out.push(engFileInfo(b.files[i], i, b.cur)); return out; };
    Q.fileNow = function () { return engFilesGet().cur + 1; };
    Q.useFile = function (n) {   // FILE n (1 to 3) becomes the one played and saved; its save (or a fresh one) is Q.SAVE
      var b = engFilesGet(), i = Q.clamp((n | 0) - 1, 0, 2);
      if (Q.SAVE && engFileUsed(Q.SAVE) && Q.level) Q.saveGame();   // leaving a level for the file screen keeps where he was
      b.cur = i; Q.SAVE = engFix(b.files[i]); Q.rand = engSeed('quest'); engCheatPhysics();   // this file's codes (59-engine-cheats.js)
      if (engFileUsed(b.files[i]) && engStarsCatchUp()) Q.saveGame();
      engFilesStore();
      return true;
    };
    Q.eraseFile = function (n) {   // FILE n emptied for good (the file screen asks first); the current one starts fresh
      var b = engFilesGet(), i = Q.clamp((n | 0) - 1, 0, 2);
      b.files[i] = null;
      if (i === b.cur) { Q.SAVE = engFresh(); engCheatPhysics(); }
      engFilesStore();
      return true;
    };
