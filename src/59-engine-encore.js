    // ---------- 59-engine-encore.js (ENGINE): THE ENCORE (QUEST-API part 14.4): the four bosses again, back to back, once the game is won ----------
    // Full hearts, then w1-boss, w2-boss, w3-boss and w4-boss in a row: no trapped agents, no intro or outro (encore-start before the first fight,
    // encore-next before each of the others, encore-won after the last); a heart back between fights; one clock, the seconds of play while a boss is up,
    // through all four. A game over plays encore-over, then that fight again with full hearts while the clock runs on. After the last: the event encore
    // { t, hits }, Q.SAVE.encore (the best seconds), then the scene encore { t, best, hits } (its own way on to the map). Nothing it does is saved as progress.
    var ENG_ENCORE = ['w1-boss', 'w2-boss', 'w3-boss', 'w4-boss'], engEnc = null;
    Q.encoreOpen = function () { return !!engSave().won; };
    Q.encoreOn = function () { return !!engEnc; };   // true during THE ENCORE, for any part that plays differently in it
    Q.encore = function () {
      var s = engSave();
      if (!Q.encoreOpen() || engEnc) return false;
      engEnc = { i: 0, t: 0, hits: 0, hp: s.maxHp, said: -1, next: -1, at: s.at, ck: s.ck };
      return engEncoreFight();
    };
    function engEncoreIn(id) { return !!engEnc && ENG_ENCORE[engEnc.i] === id; }   // this level is the encore's fight now
    function engEncoreFight(again) {   // again: after a game over, the fight keeps its own clock and hits (as a retry does)
      var id = engEnc ? ENG_ENCORE[engEnc.i] : '';
      if (!id || !engOwn(Q.LEVEL, id)) { engEncoreQuit(); return Q.go('map') || Q.go('title'); }
      return Q.startLevel(id, { retry: !!again });
    }
    function engEncoreArrive() {   // the arena is up: its hearts, then the encore's line (once a fight) and the fight
      var E = engEnc, A = engArena, i = E.i;
      if (Q.P) Q.P.hp = Math.max(1, Math.min(Q.P.maxHp, E.hp));
      if (E.said === i) { if (A) A.st = 'fight'; return; }
      E.said = i;
      engSay(i ? 'encore-next' : 'encore-start', function () { if (engArena === A && A.st === 'intro') A.st = 'fight'; });
    }
    function engEncoreStep(dt) { if (engEnc && engArena && engArena.st === 'fight') engEnc.t += dt; }
    function engEncoreNext() {   // its boss is beaten: a heart back and the next fight, or the end
      var E = engEnc, P = Q.P, s = engSave();
      if (!E || E.next === E.i) return true;
      E.next = E.i; if (engArena) engArena.st = 'gone';
      E.hp = Math.min(P ? P.maxHp : s.maxHp, (P ? P.hp : E.hp) + 1);
      if (E.i < ENG_ENCORE.length - 1) { E.i++; return engEncoreFight(); }
      engSay('encore-won', function () {
        var t = Math.round(E.t * 100) / 100, best = s.encore > 0 && s.encore <= t ? s.encore : t;
        engEnc = null; s.at = E.at; s.ck = E.ck;
        Q.emit('encore', { t: t, hits: E.hits });
        if (!engCheatBlocks()) s.encore = best; Q.saveGame();   // not a time set with WORK FROM HOME or LIGHT WORKLOAD on (14.10 item 11)
        if (!Q.go('encore', { t: t, best: best, hits: E.hits })) { if (!Q.go('map')) Q.go('title'); }
      });
      return true;
    }
    function engEncoreOver() {   // a game over in the encore: its line, then the same fight with full hearts (the clock runs on)
      var E = engEnc;
      engSay('encore-over', function () { if (engEnc !== E) return; E.hp = Q.P ? Q.P.maxHp : engSave().maxHp; E.said = E.i; engEncoreFight(true); });
    }
    function engEncoreQuit() { var E = engEnc, s = engSave(); if (!E) return; engEnc = null; s.at = E.at; s.ck = E.ck; }   // left for the map or the title: none of it stays
    Q.on('hurt', function (d) { if (engEnc) engEnc.hits += d.n | 0; });
    Q.on('fall', function (d) { if (engEnc) engEnc.hits += d.n | 0; });
