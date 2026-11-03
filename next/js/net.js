// Baton Quest's online play, the page's half (B18, version 118): a room on a transport, who is the host, heartbeats, the ?join= link and SHARE.
// The game never touches the network: it reaches this only through the runtime's api.net (js/runtime.js), as plain JSON text, read once a step.
// Two transports behind one small interface (open a room; send to a peer or to all; leave; told when a peer comes, goes or sends):
//   'trystero': Trystero 0.26.0 on its free public Nostr relays (js/trystero-0.26.0.js, vendored here, loaded only when a player chooses HOST or JOIN);
//   'local': this browser only, tab to tab (a BroadcastChannel), for the checks and for trying it with two tabs: ?net=local (and &lag=MS&jitter=MS&loss=PERCENT).
// Between players go only the game's own messages and three notes of ours (I AM THE HOST, a heartbeat, BYE). Nothing typed.
// B22: a guest's notes to its host also carry its room tag (12 random letters made by this page the first time it joins that code), which the host's page
// gives its game once (a poll event 'tag'), so a host who removed someone knows that browser again after a reload. The one thing stored: a guest's tags,
// in this browser only (localStorage 'bq-net-rooms', the 8 newest codes, none older than a day); a new tag for every room, so no two rooms can link them.
(function () {
  'use strict';
  var A = window.NFX && window.NFX.arcade; if (!A || !A.setNet) return;
  var ALPHA = 'BCDFGHJKLMNPQRSTVWXZ', APP = 'baton-quest-battle', BEAT_MS = 1000, QUIET_MS = 8000, INBOX_MAX = 3000;   // codes: CODE_N of these 20 letters (no vowels, no Y: no words)
  var CODE_N = 6, TAG_N = 12, TAGS_KEY = 'bq-net-rooms', TAGS_MAX = 8, TAGS_AGE = 24 * 3600 * 1000, TAG_RE = new RegExp('^[' + ALPHA + ']{' + TAG_N + '}$');   // B22 (codes were 4 letters)
  var search = String(location.search || ''), kind = /[?&]net=local\b/.test(search) ? 'local' : 'trystero';
  var S = { state: 'off', role: '', code: '', room: null, self: '', host: '', peers: {}, heard: {}, inbox: [], beat: null, invite: '', why: '', gen: 0, tag: '', tags: {} };
  function num(name, def) { var m = search.match(new RegExp('[?&]' + name + '=(\\d+)')); return m ? +m[1] : def; }
  function sim() {   // the local transport's pretend network: window.BQ_NET_SIM (checks) or the link's lag, jitter and loss (ms, ms, percent)
    var o = window.BQ_NET_SIM || {};
    return { lag: +o.lag || num('lag', 0), jitter: +o.jitter || num('jitter', 0), loss: (+o.loss || num('loss', 0)) / 100, mode: o.mode === 'reliable' ? 'reliable' : 'drop', seed: (+o.seed >>> 0) || 0 };
  }
  function rid(n) { var a = new Uint32Array(n), s = '', i; try { crypto.getRandomValues(a); } catch (e) { for (i = 0; i < n; i++) a[i] = Math.floor(Math.random() * 4294967296); } for (i = 0; i < n; i++) s += ALPHA.charAt(a[i] % ALPHA.length); return s; }
  function cleanCode(c) { c = String(c || '').toUpperCase().replace(/[^A-Z]/g, ''); if (c.length !== CODE_N) return ''; for (var i = 0; i < CODE_N; i++) if (ALPHA.indexOf(c.charAt(i)) < 0) return ''; return c; }
  var MEMTAG = {};
  function tagFor(code) {   // B22: this browser's tag for one room it joins as a guest: memory first (this page), then storage (a reload, another tab), else new
    var now = Date.now(), list = [], keep = [], t = MEMTAG[code] || '', i, o;
    try { list = JSON.parse(localStorage.getItem(TAGS_KEY) || '[]'); } catch (e) { list = []; }
    if (!Array.isArray(list)) list = [];
    for (i = 0; i < list.length && i < 64; i++) {
      o = list[i];
      if (!o || typeof o.c !== 'string' || cleanCode(o.c) !== o.c || typeof o.w !== 'string' || !TAG_RE.test(o.w) || !(+o.t > now - TAGS_AGE)) continue;   // a bad or day-old entry is dropped
      if (o.c === code) { if (!t) t = o.w; } else if (keep.length < TAGS_MAX - 1) keep.push({ c: o.c, w: o.w, t: +o.t });
    }
    if (!t) t = rid(TAG_N);
    MEMTAG[code] = t; keep.unshift({ c: code, w: t, t: now });
    try { localStorage.setItem(TAGS_KEY, JSON.stringify(keep)); } catch (e) {}   // storage refused (some private windows): this page still knows it
    return t;
  }
  function push(e) { S.inbox.push(e); if (S.inbox.length > INBOX_MAX) S.inbox.splice(0, S.inbox.length - INBOX_MAX); }
  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function key(id) { return 'p:' + id; }

  // ---------- the link: ?join=CODE opens the game straight into joining that code (given to the game once) ----------
  (function () { var m = search.match(/[?&]join=([A-Za-z]{1,16})\b/); if (m) S.invite = m[1].toUpperCase(); })();   // B22: any letters; the game checks them (an old 4-letter link is told so)
  function linkFor(code) { return String(location.href).split('#')[0].split('?')[0] + '?join=' + code; }

  // ---------- the transports ----------
  function openLocal(room, cb) {   // tab to tab in this browser; data may be held back, shuffled or dropped as sim() says (presence notes are never lost)
    var ch = new BroadcastChannel('bq-local-' + room), self = 'L' + rid(10), known = {}, P = sim(), rs = P.seed || (Math.floor(Math.random() * 4294967295) >>> 0) || 1, lastDue = {}, closed = false;
    function rnd() { rs ^= rs << 13; rs >>>= 0; rs ^= rs >>> 17; rs ^= rs << 5; rs >>>= 0; return rs / 4294967296; }
    function post(m) { if (!closed) { m.from = self; try { ch.postMessage(m); } catch (e) {} } }
    function meet(id) { if (!known[id]) { known[id] = 1; cb.join(id); } }
    ch.onmessage = function (ev) {
      var m = ev.data, d, at;
      if (closed || !m || typeof m.from !== 'string' || m.from === self || (m.to && m.to !== self)) return;
      if (m.t === 'hello') { meet(m.from); post({ t: 'here', to: m.from }); return; }
      if (m.t === 'here') { meet(m.from); return; }
      if (m.t === 'bye') { if (known[m.from]) { delete known[m.from]; cb.leave(m.from); } return; }
      if (m.t !== 'd' || !known[m.from]) return;
      d = P.lag + (P.jitter ? (rnd() * 2 - 1) * P.jitter : 0);
      if (P.mode === 'drop') { if (P.loss && rnd() < P.loss) return; }
      else { if (P.loss && rnd() < P.loss) d += 200; at = Math.max(Date.now() + d, lastDue[m.from] || 0); lastDue[m.from] = at; d = at - Date.now(); }   // reliable: a loss is a late resend, and everything after it waits
      if (d <= 0) cb.data(m.from, m.d); else setTimeout(function () { if (!closed) cb.data(m.from, m.d); }, d);
    };
    post({ t: 'hello' });
    return {
      self: self,
      send: function (to, obj) { post({ t: 'd', to: to || '', d: obj }); },
      leave: function () { post({ t: 'bye' }); closed = true; try { ch.close(); } catch (e) {} },
      cut: function () { closed = true; try { ch.close(); } catch (e) {} },   // for checks: gone without a word (a dead phone)
      relays: function () { return 0; }
    };
  }
  function openTrystero(room, cb) {   // Trystero's own README: joinRoom(config, roomId, callbacks), makeAction, onPeerJoin, onPeerLeave, selfId, getRelaySockets
    var T = window.BQ_TRYSTERO, r, act, gone = false;
    r = T.joinRoom({ appId: APP }, 'room-' + room, { onJoinError: function () { if (!gone) cb.trouble('join'); } });
    act = r.makeAction('bq');
    act.onMessage = function (data, meta) { if (!gone && meta && typeof meta.peerId === 'string') cb.data(meta.peerId, data); };
    r.onPeerJoin = function (id) { if (!gone) cb.join(String(id)); };
    r.onPeerLeave = function (id) { if (!gone) cb.leave(String(id)); };
    return {
      self: String(T.selfId),
      send: function (to, obj) { try { var p = act.send(obj, to ? { target: to } : undefined); if (p && p.catch) p.catch(function () {}); } catch (e) {} },
      leave: function () { gone = true; try { r.leave(); } catch (e) {} },
      cut: function () { gone = true; try { r.leave(); } catch (e) {} },
      relays: function () { var n = 0, s, k; try { s = T.getRelaySockets(); for (k in s) if (own(s, k) && s[k] && s[k].readyState === 1) n++; } catch (e) {} return n; }
    };
  }
  var loading = null;
  function withTrystero(done) {   // loads the vendored file the first time it is needed (a classic script: a page opened from a file can load it too)
    if (window.BQ_TRYSTERO) { done(true); return; }
    if (loading) { loading.push(done); return; }
    loading = [done];
    var s = document.createElement('script'), fin = function (ok) { var l = loading; loading = null; for (var i = 0; i < l.length; i++) l[i](ok && !!window.BQ_TRYSTERO); };
    s.src = 'js/trystero-0.26.0.js'; s.async = true; s.onload = function () { fin(true); }; s.onerror = function () { s.remove(); fin(false); };
    document.head.appendChild(s);
  }

  // ---------- a room: our role, the host's note, heartbeats ----------
  function open(code, role) {
    var gen;
    close(true);
    gen = ++S.gen; S.state = role === 'host' ? 'host' : 'join'; S.role = role; S.code = code; S.host = ''; S.peers = {}; S.heard = {}; S.why = '';
    S.tags = {}; S.tag = role === 'host' ? '' : tagFor(code);   // B22: a guest's tag for this room
    function start() {
      if (gen !== S.gen) return;
      var cb = {
        join: function (id) { if (gen !== S.gen) return; S.peers[key(id)] = id; S.heard[key(id)] = Date.now(); if (S.role === 'host') { S.room.send(id, { n: 'role', host: 1 }); push({ k: 'join', from: id }); } },
        leave: function (id) { if (gen !== S.gen) return; gone(id); },
        data: function (id, m) { if (gen === S.gen) heard(id, m); },
        trouble: function (what) { if (gen === S.gen) push({ k: 'trouble', from: '', data: JSON.stringify({ what: what }) }); }
      };
      try { S.room = kind === 'local' ? openLocal(code, cb) : openTrystero(code, cb); } catch (e) { S.room = null; }
      if (!S.room) { S.why = 'start'; push({ k: 'lost', from: '', data: JSON.stringify({ why: 'start' }) }); S.state = 'off'; return; }
      S.self = S.room.self;
      S.beat = setInterval(beat, BEAT_MS);
    }
    if (kind === 'local') start();
    else withTrystero(function (ok) { if (gen !== S.gen) return; if (ok) start(); else { S.why = 'load'; S.state = 'off'; push({ k: 'lost', from: '', data: JSON.stringify({ why: 'load' }) }); } });
  }
  function close(quiet) {
    if (S.beat) { clearInterval(S.beat); S.beat = null; }
    if (S.room) { try { S.room.leave(); } catch (e) {} S.room = null; }
    S.state = 'off'; S.role = ''; S.code = ''; S.host = ''; S.peers = {}; S.heard = {}; S.gen++; S.tags = {}; S.tag = '';
    if (!quiet) S.inbox = [];
  }
  function gone(id) {   // a peer left (its BYE, the transport, or too long quiet)
    var k = key(id);
    if (!own(S.peers, k)) return;
    delete S.peers[k]; delete S.heard[k]; delete S.tags[k];
    if (S.role === 'host') push({ k: 'leave', from: id });
    else if (id === S.host) { S.host = ''; S.state = 'join'; push({ k: 'lost', from: id, data: JSON.stringify({ why: 'host' }) }); }
  }
  function heard(id, m) {
    var k = key(id);
    if (!m || typeof m !== 'object') return;
    if (!own(S.peers, k)) { S.peers[k] = id; if (S.role === 'host') push({ k: 'join', from: id }); }
    S.heard[k] = Date.now();
    if (S.role === 'host' && typeof m.w === 'string' && TAG_RE.test(m.w) && S.tags[k] !== m.w) { S.tags[k] = m.w; push({ k: 'tag', from: id, data: JSON.stringify({ w: m.w }) }); }   // B22: before his message
    if (m.n === 'role' || (m.n === 'beat' && m.host)) {
      if (S.role === 'host') { push({ k: 'clash', from: id }); return; }   // two hosts with one code: the game opens a new one
      if (!S.host) { S.host = id; S.state = 'guest'; push({ k: 'host', from: id }); }
      return;
    }
    if (m.n === 'bye') { gone(id); return; }
    if (m.n === 'g' && typeof m.d === 'string' && m.d.length <= 16000) {
      if (S.role === 'host' || id === S.host) push({ k: 'msg', from: id, data: m.d });   // a guest hears only its host; other guests are ignored
    }
  }
  function beat() {   // each second: I am here (the host: and I am the host); a peer quiet for QUIET_MS is gone (a closed tab need not say BYE: MDN)
    var now = Date.now(), k;
    if (!S.room) return;
    if (S.role === 'host') S.room.send('', { n: 'beat', host: 1 });
    else if (S.host) S.room.send(S.host, { n: 'beat', w: S.tag });
    for (k in S.heard) if (own(S.heard, k) && now - S.heard[k] > QUIET_MS) gone(S.peers[k]);
  }
  function send(to, text) {
    if (!S.room || typeof text !== 'string') return false;
    if (S.role === 'host') {
      if (to === 'all') { for (var k in S.peers) if (own(S.peers, k)) S.room.send(S.peers[k], { n: 'g', d: text }); return true; }
      if (!own(S.peers, key(to))) return false;
      S.room.send(to, { n: 'g', d: text }); return true;
    }
    if (!S.host || (to !== 'host' && to !== S.host)) return false;
    S.room.send(S.host, { n: 'g', d: text, w: S.tag }); return true;
  }
  function can() {
    if (kind === 'local') return typeof BroadcastChannel === 'function';
    return typeof RTCPeerConnection === 'function' && typeof WebSocket === 'function' && !!(window.crypto && crypto.subtle) && typeof BigInt === 'function';
  }
  window.addEventListener('pagehide', function () { if (S.room) { try { S.room.send('', { n: 'bye' }); } catch (e) {} } });   // a word on the way out, when the browser gives the chance

  // ---------- the runtime's net (api.net is its game side) ----------
  A.setNet({
    ok: function () { return can(); },
    state: function () { return S.state; },
    host: function () { if (!can()) return ''; var c = rid(CODE_N); open(c, 'host'); return c; },
    join: function (code) { var c = cleanCode(code); if (!c || !can()) return false; open(c, 'guest'); return true; },
    leave: function () { if (S.room) { try { S.room.send('', { n: 'bye' }); } catch (e) {} } close(false); },
    code: function () { return S.code; },
    self: function () { return S.self; },
    peers: function () { var l = [], k; if (S.role === 'host') { for (k in S.peers) if (own(S.peers, k)) l.push(S.peers[k]); } else if (S.host) l.push(S.host); return l; },
    send: send,
    poll: function () { var l = S.inbox; S.inbox = []; return l; },
    invite: function () { var c = S.invite; S.invite = ''; if (c) { try { history.replaceState(null, '', String(location.href).replace(/([?&])join=[A-Za-z]{1,16}&?/, '$1').replace(/[?&]$/, '')); } catch (e) {} } return c; },
    share: function () {
      if (S.role !== 'host' || !S.code) return false;
      var url = linkFor(S.code), note = window.POCKET_NOTE || function () {};
      try {
        if (navigator.share && window.matchMedia && matchMedia('(hover: none) and (pointer: coarse)').matches) { navigator.share({ title: 'Baton Quest', text: 'BATTLE MODE: join my game, code ' + S.code, url: url }).catch(function () {}); return true; }   // a phone or tablet, whichever look (as SHARE)
        navigator.clipboard.writeText(url).then(function () { note('LINK COPIED: ' + S.code); }, function () { note(url); });
      } catch (e) { note(url); }
      return true;
    },
    info: function () { var n = 0, k; for (k in S.peers) if (own(S.peers, k)) n++; return { kind: kind, relays: S.room ? S.room.relays() : 0, peers: n, ready: !!S.room }; }
  });
  window.BQ_NET = {   // for the page (SHARE shares the join link while hosting) and for checks
    link: function () { return S.role === 'host' && S.code ? linkFor(S.code) : ''; },
    kind: kind, state: function () { return S.state; }, code: function () { return S.code; }, tag: function () { return S.tag; },   // tag (B22): a guest's room tag, for checks
    cut: function () { if (S.room && S.room.cut) S.room.cut(); if (S.beat) { clearInterval(S.beat); S.beat = null; } S.room = null; }   // checks: this tab goes silent at once
  };
})();
