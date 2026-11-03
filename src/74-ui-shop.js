    // ---------- 74-ui-shop.js: VEND-9's shop (UI, builder 5) ----------
    // VEND-9 sells COFFEE (hearts refilled), EXTRA HEART (one more, once), BIGGER BATON (power +1, once), METRONOME (rhythm +1, once), MEMO FINDER (the codex
    // shows which levels still hide memos, once) and GOLD BOW TIE (once; opt.bowtie 'gold', switched in the pause) at Q.PRICE (part 13, 25);
    // the once-only ones show SOLD OUT after (Q.SAVE.shop.heart, .baton, .metronome, .memofinder, .bowtie). Its lines: shop-hello on the way in, shop-buy, shop-poor, shop-bye
    // (one line a time). A buy changes Q.SAVE and Q.P and saves. Up and down to choose, A to buy, B (or LEAVE) back to the map. The 'shop' song.
    (function () {
      var U = Q.ui, SH = { sel: 0, t: 0, drop: null, leaving: false, line: {}, talkT: 0 };
      var ITEMS = [
        { key: 'coffee', name: 'COFFEE', icon: 'mug', desc: 'FILLS YOUR HEARTS UP.' },
        { key: 'heart', name: 'EXTRA HEART', icon: 'heart', desc: 'ONE MORE HEART. ONCE.', once: true },
        { key: 'baton', name: 'BIGGER BATON', icon: 'ic-baton', desc: 'HITS HARDER: POWER +1. ONCE.', once: true },
        { key: 'metronome', name: 'METRONOME', icon: '', desc: 'ONE MORE NOTE OF RHYTHM. ONCE.', once: true },
        { key: 'memofinder', name: 'MEMO FINDER', icon: 'ic-memofinder', desc: 'THE CODEX SHOWS WHERE MEMOS STILL HIDE. ONCE.', once: true },
        { key: 'bowtie', name: 'GOLD BOW TIE', icon: 'ic-bowtie', desc: 'A GOLD BOW TIE FOR THE CONDUCTOR. ONCE.', once: true },
        { key: 'leave', name: 'LEAVE', icon: '', desc: 'BACK TO THE MAP.' }
      ];
      var VX = 6, VY = 38, PX = 110, PY = 12, ROW = 15, PRICES = { memofinder: 120, bowtie: 250 };
      function S() { return Q.SAVE || (Q.SAVE = {}); }
      function shopOf() { var s = S(); if (!s.shop || typeof s.shop !== 'object') s.shop = {}; return s.shop; }
      function price(it) { return Q.PRICE[it.key] || PRICES[it.key] || 0; }
      function words(it) {   // STORY's label and blurb for it (QUEST-API.md part 13, 13), or our own
        var w = Q.story && Q.story.shop && Q.story.shop[it.key];
        return { label: w && w.label ? String(w.label) : it.name, blurb: w && w.blurb ? String(w.blurb) : it.desc };
      }
      function sold(it) { return !!(it.once && shopOf()[it.key]); }
      function say(id, done) {   // one line of VEND-9's script, the next one each time
        var lines = Q.SCRIPT[id];
        if (!lines || !lines.length) { if (done) done(); return; }
        var k = SH.line[id] || 0; SH.line[id] = (k + 1) % lines.length;
        U.talk([lines[k]], done || null, null, id + '#' + k);
      }
      function apply(key) {   // what each buy does, to the save and (in a level) to the conductor himself
        var s = S(), P = Q.P, max = Q.HERO.HEARTS_MAX;
        if (key === 'coffee') { s.hp = s.maxHp; if (P) P.hp = P.maxHp; }
        else if (key === 'heart') { s.maxHp = Math.min(max, (s.maxHp || 3) + 1); s.hp = Math.min(s.maxHp, (s.hp || 0) + 1); if (P) { P.maxHp = s.maxHp; P.hp = Math.min(P.maxHp, P.hp + 1); } }
        else if (key === 'baton') { s.power = (s.power || 1) + 1; if (P) P.power = s.power; }
        else if (key === 'metronome') { s.rhythmMax = (s.rhythmMax || Q.HERO.RHYTHM) + 1; if (P) { P.rhythmMax = s.rhythmMax; P.rhythm = Math.min(P.rhythmMax, (P.rhythm || 0) + 1); } }
        else if (key === 'bowtie') { if (!s.opt || typeof s.opt !== 'object') s.opt = {}; s.opt.bowtie = 'gold'; }
      }
      function leave() { if (SH.leaving) return; SH.leaving = true; Q.sfx('back'); say('shop-bye', function () { Q.go('map', { shop: true }); }); }
      function buy(it) {
        var s = S(), st = U.stat(), p = price(it);
        if (it.key === 'leave') { leave(); return; }
        if (sold(it)) { Q.sfx('nope'); return; }
        if (it.key === 'coffee' && st.hp >= st.maxHp) { Q.sfx('nope'); Q.toast('BZZT! YOUR HEARTS ARE ALREADY FULL!', 2.2); return; }
        if (it.key === 'heart' && st.maxHp >= Q.HERO.HEARTS_MAX) { Q.sfx('nope'); Q.toast('BZZT! YOU HAVE EVERY HEART THERE IS!', 2.2); return; }
        if ((s.tokens || 0) < p) { Q.sfx('nope'); say('shop-poor'); return; }
        s.tokens = (s.tokens || 0) - p;
        apply(it.key);
        if (it.once) shopOf()[it.key] = true;
        U.emit('buy', { item: it.key, price: p });   // part 14.1 (before the save, so its count is kept with the buy)
        Q.saveGame(); Q.sfx('buy');
        SH.drop = { it: it, t: 0, clunk: false };
        say('shop-buy');
      }
      function change(it) {   // what the chosen item would change, as numbers
        var st = U.stat();
        if (it.key === 'coffee') return 'HEARTS ' + st.hp + '/' + st.maxHp + (st.hp < st.maxHp ? ' > ' + st.maxHp + '/' + st.maxHp : '');
        if (it.key === 'heart') return sold(it) ? 'HEARTS ' + st.maxHp : 'HEARTS ' + st.maxHp + ' > ' + Math.min(Q.HERO.HEARTS_MAX, st.maxHp + 1);
        if (it.key === 'baton') return sold(it) ? 'POWER ' + st.power : 'POWER ' + st.power + ' > ' + (st.power + 1);
        if (it.key === 'metronome') return sold(it) ? 'RHYTHM ' + st.rhythmMax : 'RHYTHM ' + st.rhythmMax + ' > ' + (st.rhythmMax + 1);
        if (it.key === 'memofinder') return sold(it) ? 'SEE THE CODEX, IN THE PAUSE MENU' : 'MEMOS FOUND ' + st.memos + '/24';
        if (it.key === 'bowtie') return sold(it) ? 'BOW TIE: ' + (S().opt && S().opt.bowtie === 'white' ? 'WHITE' : 'GOLD') + '. SWITCH IT IN THE PAUSE MENU.' : 'BOW TIE: WHITE > GOLD';
        return '';
      }
      U.metronome = function (g, x, y, t) {   // our own little metronome, 12 by 14, its arm swinging
        var r, w, a = Math.sin(t * 5) * 0.5, i;
        for (r = 0; r < 12; r++) { w = 4 + Math.floor(r * 0.6) * 2; U.fill(g, x + 6 - w / 2 - 1, y + 2 + r, w + 2, 1, '#1d1d24'); U.fill(g, x + 6 - w / 2, y + 2 + r, w, 1, r < 2 ? '#c08552' : '#7a4a2a'); }
        U.fill(g, x, y + 13, 12, 1, '#1d1d24');
        for (i = 0; i < 9; i++) U.fill(g, Math.round(x + 6 + Math.sin(a) * i), Math.round(y + 11 - Math.cos(a) * i), 1, 1, '#f6efe2');
        U.fill(g, Math.round(x + 5 + Math.sin(a) * 6), Math.round(y + 10 - Math.cos(a) * 6), 3, 2, '#ffd23f');
      };
      function icon(g, it, x, y, t) {   // each item's picture, in a 16 by 14 square at x, y (ART's icon, or our own until it is in)
        if (it.key === 'metronome') { U.metronome(g, x + 2, y, t); return; }
        if (it.key === 'leave') { U.arrow(g, x + 5, y + 5, '#9aa3ad'); return; }
        if (it.key === 'bowtie' && !Q.SPRITE[it.icon]) { U.fill(g, x + 2, y + 3, 12, 8, '#1d1d24'); U.fill(g, x + 3, y + 4, 4, 6, '#ffd23f'); U.fill(g, x + 9, y + 4, 4, 6, '#ffd23f'); U.fill(g, x + 7, y + 5, 2, 4, '#c9a020'); U.fill(g, x + 3, y + 4, 4, 1, '#fff1a8'); U.fill(g, x + 9, y + 4, 4, 1, '#fff1a8'); return; }
        if (it.key === 'memofinder' && !Q.SPRITE[it.icon]) { Q.spr(g, 'memo', 0, x + 2, y + 1); U.fill(g, x + 9, y + 6, 6, 1, '#ffd23f'); U.fill(g, x + 9, y + 10, 6, 1, '#ffd23f'); U.fill(g, x + 9, y + 7, 1, 3, '#ffd23f'); U.fill(g, x + 14, y + 7, 1, 3, '#ffd23f'); U.fill(g, x + 14, y + 11, 2, 2, '#ffd23f'); return; }
        var d = Q.SPRITE[it.icon], w = d ? d.w : 8, h = d ? d.h : 8;
        Q.spr(g, it.icon, Math.floor(t * 3) % Math.max(1, U.frames(it.icon)), x + ((16 - w) >> 1), y + ((14 - h) >> 1));
      }
      Q.defScene('shop', {
        enter: function () { U.entered(); SH.sel = 0; SH.t = 0; SH.drop = null; SH.leaving = false; Q.music('shop'); say('shop-hello'); },
        update: function (dt) {
          SH.t += dt;
          if (SH.drop) { SH.drop.t += dt; if (!SH.drop.clunk && SH.drop.t > 0.35) { SH.drop.clunk = true; Q.sfx('clunk'); } if (SH.drop.t > 1.4) SH.drop = null; }
          U.tick();
          if (Q.talking() || SH.leaving) return;
          SH.sel = U.menuMove(SH.sel, ITEMS.length);
          if (U.press('a')) buy(ITEMS[SH.sel]);
          else if (U.press('b')) leave();
        },
        draw: function (g) {
          var t = SH.t, i, it, y, on, s = S(), p, talking = Q.talking(), d, k;
          Q.spr(g, 'u5-board', 0, 0, 0);
          g.globalAlpha = 0.55; U.fill(g, 0, 0, 320, 200, '#05100d'); g.globalAlpha = 1;
          U.fill(g, 0, 134, 320, 66, '#14201c'); U.fill(g, 0, 134, 320, 1, '#2e7a62');
          U.sprite(g, 'vend', talking ? Math.floor(t * 6) % 2 : Math.floor(t * 1.5) % 2, VX, VY, 2);
          U.sprite(g, U.hero(), Math.floor(t * 2) % 2, 72, 94, 2, true);
          if (SH.drop) {   // the item out of the little door at the bottom, onto the floor
            k = Math.min(1, SH.drop.t / 0.35); d = SH.drop.it;
            icon(g, d, Math.round(VX + 26 + k * 18), Math.round(VY + 76 + k * k * 14 - Math.sin(k * Math.PI) * 10), t);
          }
          U.box(g, PX, PY, 204, 17 + ITEMS.length * ROW + 3, '#ff8a1e', '#14171f');
          U.text('VEND-9', PX + 8, PY + 5, '#ff8a1e');
          Q.spr(g, 'token', 0, PX + 204 - 16 - U.width(String(s.tokens || 0)), PY + 4);
          U.text(String(s.tokens || 0), PX + 196, PY + 5, '#ffd23f', 1, 'right');
          U.fill(g, PX + 4, PY + 15, 196, 1, '#3a2a1a');
          for (i = 0; i < ITEMS.length; i++) {
            it = ITEMS[i]; y = PY + 18 + i * ROW; on = i === SH.sel && !talking;
            if (on) U.fill(g, PX + 4, y - 1, 196, ROW, '#2a2230');
            icon(g, it, PX + 8, y - 1, t);
            U.item(words(it).label, PX + 36, y + 3, on, sold(it));
            if (it.key === 'leave') continue;
            if (sold(it)) U.text('SOLD OUT', PX + 196, y + 3, '#5d6378', 1, 'right');
            else { p = price(it); U.text(String(p), PX + 196, y + 3, (s.tokens || 0) >= p ? '#ffd23f' : '#e0443a', 1, 'right'); Q.spr(g, 'token', 0, PX + 196 - U.width(String(p)) - 11, y + 2); }
          }
          if (!talking) {   // under it, while VEND-9 is quiet: what the chosen item is, what it would change, the buttons
            it = ITEMS[SH.sel];
            U.box(g, 4, 146, 312, 32, '#ff8a1e', '#14171f');
            U.text(sold(it) ? 'SOLD OUT! CLUNK! THANK YOU!' : words(it).blurb, 160, 152, '#f6efe2', 1, 'center');
            U.text(change(it), 160, 164, '#8ff0e6', 1, 'center');
            U.text('A: BUY   B: LEAVE', 160, 186, '#7f8a9e', 1, 'center');
          }
          U.drawTalk(g);
        },
        sides: function (g) {   // a wide screen's sides (the engine clips to them): the map's board carried on, dimmed the same, the floor across
          U.boardSides(g);
          g.globalAlpha = 0.55; U.fill(g, 0, 0, Q.W, 200, '#05100d'); g.globalAlpha = 1;
          U.fill(g, 0, 134, Q.W, 66, '#14201c'); U.fill(g, 0, 134, Q.W, 1, '#2e7a62');
        }
      });
    })();
