    // ---------- 96-battle-online-link.js: a ?join= link opens JOIN A GAME (B18; ONLINE.md), added from this file: 72-ui-title.js is not touched ----------
    // A page opened by a link ending ?join=CODE gives the game that code once (api.net.invite). The title scene (the front end's, 72-ui-title.js) is wrapped:
    // its own update runs first; once its boot splash is over, BT.inviteStep opens JOIN A GAME with that code and joins at once. It draws nothing, and
    // without such a link it does nothing. (The front end's owner may instead call Q.battle.inviteStep() from the main menu's update and drop this file.)
    // Also here, as the last battle part (every BATTLE scene exists by now): controllers 2 to 4's presses kept every frame (the end of this file).
    BT.inviteStep = function () {   // true when it opened JOIN A GAME for the link's code (asked for once: the page gives the code only once)
      var n, c;
      if (BT.inviteDone) return false;
      BT.inviteDone = true;
      n = BT.netApi(); c = n && n.ok() ? n.invite() : '';
      if (!c || !Object.prototype.hasOwnProperty.call(Q.SCENE, 'bjoin')) return false;
      if (!BT.codeOk(c)) { Q.go('bjoin', { why: 'link' }); return true; }   // B22: the link's letters are no code of ours (an old 4-letter link): JOIN A GAME says so, plainly
      Q.go('bjoin', { code: c, go: true });
      return true;
    };
    (function () {
      var sc = Object.prototype.hasOwnProperty.call(Q.SCENE, 'title') ? Q.SCENE.title : null, up0;
      if (!sc || !sc.update) return;   // a game with no title has no link to follow
      up0 = sc.update;
      sc.update = function (dt, Qx) {
        var fe = Q.ui && Q.ui.fe;
        up0.call(sc, dt, Qx);
        if (BT.inviteDone || Q.scene !== 'title' || Q.talking() || (fe && (fe.phase === 'boot' || fe.leave))) return;
        BT.inviteStep();
      };
    })();
    // A controller's press shows for one frame only, and a frame may run no step (on a 120 Hz screen every other frame has none), so every BATTLE scene keeps
    // the frame's presses of controllers 2 to 4 before it draws, as the fights did already (BT.padLatch: once a frame; a step reads and clears them; a
    // scene's enter clears them). The main buttons have the engine's own record of presses.
    ['modes', 'bsplash', 'bplayers', 'brules', 'barena', 'bresults', 'bjoin', 'blobby', 'bnote'].forEach(function (id) {
      var sc = Object.prototype.hasOwnProperty.call(Q.SCENE, id) ? Q.SCENE[id] : null, d0;
      if (!sc || typeof sc.draw !== 'function' || sc.padLatched) return;
      d0 = sc.draw; sc.padLatched = true;
      sc.draw = function (g, Qx) { BT.padLatch(); return d0.call(sc, g, Qx); };
    });
