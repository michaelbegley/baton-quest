    // ---------- 75-ui-codex.js: the codex (UI, builder 5) ----------
    // From the pause menu. Its pages, which left and right walk through: MEMOS for worlds 1 to 4, then BESTIARY for worlds 1 to 4, then (version 116,
    // part 14) GOLD STARS, SPRINT REVIEW and, after the ending, HOLD MUSIC (75-ui-codex-stars.js, -sprint.js, -music.js add those sections; they load first).
    // A row of tabs in the header shows the section; a section is { name, col, open, pages, rows, title, count, draw, hint, a, show, leave }.
    // MEMOS: a world's three levels, each with its two memos (mW-La, mW-Lb): found ones show their title, the rest ???; A reads one in full on paper.
    // BESTIARY (QUEST-API.md part 13, 23): Q.story.bestiary's creatures of that world; met ones (Q.SAVE.met) with their picture, name and line, the rest ???.
    // Up and down to choose, B goes back (to the list, then to the pause). Each page shown sends the event 'codex' { page, sub } (part 14.1).
    (function () {
      var U = Q.ui, CO = { from: 'level', page: 0, sel: 0, read: '', t: 0, list: [] }, SEC = U.codexSec || (U.codexSec = {});
      var ORDER = U.codexOrder || (U.codexOrder = ['memos', 'bestiary', 'stars', 'sprint', 'music']);   // a section part may add itself (75-ui-codex-codes.js)
      var LEVELS = { 1: ['THE LOBBY OF UNREAD', 'THE SORTING FLOOR', 'SPAM TOWER'], 2: ['THE COLD AISLE', 'CABLE CANYON', 'THE FAN STACKS'],
                     3: ['UPLOAD MEADOWS', 'THE WINDY BUCKET', 'THE SYNC STORM'], 4: ['THE LATER PILE', 'THE SPRINT STAIRS', 'THE TOWER OF TICKETS'] };
      var BEASTS = { 1: ['spam', 'unsub', 'ooo', 'flag', 'hydra'], 2: ['bug', 'timeout', 'ping', 'spark', 'overheat'], 3: ['spinner', 'limiter', 'miss', 'loop'],
                     4: ['ticket', 'invite', 'nice', 'creep'] };   // only until STORY's bestiary is in
      function memoId(w, i) { return 'm' + w + '-' + (Math.floor(i / 2) + 1) + (i % 2 ? 'b' : 'a'); }
      function found(id) { var m = Q.SAVE && Q.SAVE.memos; return !!(m && m[id] && Q.MEMO[id]); }
      function levelName(w, l) { var d = Q.LEVEL['w' + w + '-' + l]; return d && d.name ? String(d.name) : LEVELS[w][l - 1]; }
      function hidden(w, l) {   // how many memos level w-l still hides: its own memos list, or its two
        var d = Q.LEVEL['w' + w + '-' + l], ids = d && d.memos && d.memos.length ? d.memos : [memoId(w, (l - 1) * 2), memoId(w, (l - 1) * 2 + 1)], m = (Q.SAVE && Q.SAVE.memos) || {}, n = 0;
        for (var i = 0; i < ids.length; i++) if (!m[ids[i]]) n++;
        return n;
      }
      function secrets(w) {   // the secret levels (bonus: true, part 13, 26): how many found of how many there are, and world w's own
        var n = 0, all = 0, mine = null, k, d, f = (Q.SAVE && Q.SAVE.flags) || {};
        for (k in Q.LEVEL) if (Object.prototype.hasOwnProperty.call(Q.LEVEL, k) && (d = Q.LEVEL[k]) && d.bonus && d.world >= 1 && d.world <= 4) {   // worlds 1 to 4 only (not the engine's own test level)
          all++; if (f['bonus-' + k]) n++;
          if (d.world === w) mine = { name: String(d.name || k).toUpperCase(), found: !!f['bonus-' + k] };
        }
        return { n: n, all: all, mine: mine };
      }
      U.secrets = secrets;
      function met(id) { var m = Q.SAVE && Q.SAVE.met; return !!(m && m[id]); }
      function beasts(w) {   // that world's creatures: { id, name, line, boss }, in STORY's order
        var b = Q.story && Q.story.bestiary, out = [], k, e, d, i;
        if (b) { for (k in b) if (Object.prototype.hasOwnProperty.call(b, k) && b[k] && b[k].world === w) { e = b[k]; out.push({ id: k, name: String(e.name || k), line: String(e.line || ''), boss: !!e.boss }); } return out; }
        for (i = 0; i < BEASTS[w].length; i++) { k = BEASTS[w][i]; d = Q.ENEMY[k]; out.push({ id: k, name: d && d.name ? String(d.name) : k.toUpperCase(), line: '', boss: !!(d && d.boss) }); }
        return out;
      }
      function metCount() { var n = 0, all = 0, w, list, i; for (w = 1; w <= 4; w++) { list = beasts(w); all += list.length; for (i = 0; i < list.length; i++) if (met(list[i].id)) n++; } return [n, all]; }
      U.metCount = metCount;   // for checks: [met, of how many] (only the bestiary's own entries count)
      U.icon16 = function (g, b, x, y) {   // a creature's picture in a 14 by 14 cell: a boss by its face, the rest by their own sprite
        var d = Q.ENEMY[b.id], id = b.boss ? (d && d.face) || 'face-' + b.id : (d && d.sprite) || b.id, s, w, h;
        if (b.boss && !Q.SPRITE[id]) id = (d && d.sprite) || b.id;
        s = Q.SPRITE[id]; w = s ? s.w : 8; h = s ? s.h : 8;
        g.save(); g.beginPath(); g.rect(x, y, 14, 14); g.clip();
        U.sprOr(g, id, 0, x + ((14 - w) >> 1), y + (h <= 14 ? (14 - h) >> 1 : 0), function (c, px, py) { U.text('?', px + 1, py, '#8a93a8'); });
        g.restore();
      };
      U.memoPaper = function (g, id) {   // a memo in full: a sheet of paper, its title, up to 11 lines of 46
        var m = Q.MEMO[id] || { title: '?', text: '' }, lines = Q.wrap(String(m.text || ''), 46), i;
        U.box(g, 10, 14, 300, 168, '#c9b48a', '#f6efe2');
        for (i = 0; i < 12; i++) U.fill(g, 16, 44 + i * 11 + 9, 288, 1, '#e4d9c2');   // ruled lines
        Q.spr(g, 'memo', 0, 18, 21);
        U.text(String(m.title || '').toUpperCase(), 32, 23, '#7a4a2a');
        U.fill(g, 16, 34, 288, 1, '#c9b48a');
        for (i = 0; i < Math.min(lines.length, 11); i++) U.text(lines[i], 24, 44 + i * 11, '#1d1d24');
        U.text(id.toUpperCase(), 304, 170, '#b09a70', 1, 'right');
      };
      function worldTitle(sub) { return 'WORLD ' + (sub + 1) + ': ' + U.worldName(sub + 1); }
      SEC.memos = { name: 'MEMOS', pages: function () { return 4; }, rows: function () { return 6; }, col: function (sub) { return U.worldCol(sub + 1); }, title: worldTitle,
        count: function () { return 'FOUND ' + U.memoCount(Q.SAVE) + '/24'; }, hint: function () { return 'LEFT/RIGHT: PAGE   A: READ   B: BACK'; },
        tab: function (g, x, y) { U.sprOr(g, 'memo', 0, x + 3, y + 2); },
        a: function (sub, sel) { var id = memoId(sub + 1, sel); if (found(id)) { CO.read = id; Q.sfx('memo'); } else Q.sfx('nope'); },
        draw: function (g, sub, sel) {
          var w = sub + 1, l, y, i, id, on, k, finder = !!(Q.SAVE && Q.SAVE.shop && Q.SAVE.shop.memofinder);
          for (l = 1; l <= 3; l++) {
            y = 45 + (l - 1) * 40;
            U.text(w + '-' + l + '  ' + levelName(w, l), 18, y, U.worldCol(w));
            if (finder) { k = hidden(w, l); U.text(k ? k + ' HIDDEN' : 'ALL FOUND', 302, y, k ? '#ffd23f' : '#6fd88f', 1, 'right'); }   // the MEMO FINDER's hint
            for (i = 0; i < 2; i++) {
              id = memoId(w, (l - 1) * 2 + i); on = sel === (l - 1) * 2 + i;
              if (on) U.fill(g, 14, y + 10 + i * 13, 292, 12, '#262838');
              if (found(id)) { Q.spr(g, 'memo', 0, 30, y + 11 + i * 13); U.item(String(Q.MEMO[id].title || id).toUpperCase(), 44, y + 13 + i * 13, on); }
              else U.item('???  NOT FOUND YET', 44, y + 13 + i * 13, on, !on);
            }
          }
          k = secrets(w);
          if (k.all) {   // the secret levels: all of them, and this world's own (its name once found)
            U.fill(g, 14, 162, 292, 1, '#2a2c3a');
            U.text('SECRETS ' + k.n + '/' + k.all, 18, 166, '#c9b0ee');
            if (k.mine) U.text(k.mine.found ? k.mine.name : '???', 302, 166, k.mine.found ? '#8ff0e6' : '#5d6378', 1, 'right');
          }
        } };
      SEC.bestiary = { name: 'BESTIARY', pages: function () { return 4; }, rows: function (sub) { return Math.max(1, beasts(sub + 1).length); }, col: SEC.memos.col, title: worldTitle,
        count: function () { var mc = metCount(); return 'MET ' + mc[0] + '/' + mc[1]; },
        tab: function (g, x, y) { U.sprOr(g, 'spam', 0, x, y + 1, function (c, px, py) { U.fill(c, px + 3, py + 3, 8, 7, '#1d1d24'); U.fill(c, px + 4, py + 4, 6, 5, '#e0443a'); U.fill(c, px + 5, py + 5, 1, 1, '#ffffff'); U.fill(c, px + 8, py + 5, 1, 1, '#ffffff'); }); },
        draw: function (g, sub, sel) {
          var list = beasts(sub + 1), i, b, y, on, lines;
          for (i = 0; i < list.length && i < 7; i++) {
            b = list[i]; y = 45 + i * 15; on = sel === i;
            if (on) U.fill(g, 14, y - 1, 292, 15, '#262838');
            U.fill(g, 18, y, 14, 14, '#0b0c10');
            if (met(b.id)) { U.icon16(g, b, 18, y); U.item(b.name, 40, y + 4, on); if (b.boss) U.text('BOSS', 302, y + 4, '#e0443a', 1, 'right'); }
            else { U.text('?', 22, y + 4, '#5d6378'); U.item('???', 40, y + 4, on, !on); }
          }
          b = list[Math.min(sel, list.length - 1)];
          U.fill(g, 14, 151, 292, 1, '#2a2c3a');
          if (b && met(b.id) && b.line) { lines = Q.wrap(b.line, 46); for (i = 0; i < Math.min(2, lines.length); i++) U.text(lines[i], 160, 156 + i * 10, '#c3c7d4', 1, 'center'); }
          else if (b) U.text(met(b.id) ? '' : 'NOT MET YET. BEAT ONE TO LEARN ABOUT IT.', 160, 160, '#5d6378', 1, 'center');
        } };
      function pageList() {   // every page in order: each open section's pages (MEMOS and BESTIARY always; the others say when they are open)
        var out = [], i, j, s, n;
        for (i = 0; i < ORDER.length; i++) {
          s = SEC[ORDER[i]]; if (!s || !s.draw || (s.open && !s.open())) continue;
          n = s.pages ? Math.max(1, s.pages() | 0) : 1;
          for (j = 0; j < n; j++) out.push({ sec: ORDER[i], sub: j });
        }
        return out;
      }
      function find(sec, sub) { for (var i = 0; i < CO.list.length; i++) if (CO.list[i].sec === sec && CO.list[i].sub === sub) return i; return 0; }
      function cur() { return CO.list[CO.page] || CO.list[0] || { sec: 'memos', sub: 0 }; }
      function shown() { var p = cur(), s = SEC[p.sec]; U.emit('codex', { page: p.sec, sub: p.sub }); if (s && s.show) s.show(p.sub); }
      U.codexAt = function () { var p = cur(); return { sec: p.sec, sub: p.sub, sel: CO.sel, read: CO.read, pages: CO.list.length }; };   // for checks
      U.codexGo = function (sec, sub) { CO.list = pageList(); CO.page = find(sec, sub || 0); CO.sel = 0; shown(); };   // for checks: straight to a page
      function tabs(g, on) {   // a tab for each open section, the one showing framed in gold
        var x = 76, i, s, a = g.globalAlpha;
        for (i = 0; i < ORDER.length; i++) {
          s = SEC[ORDER[i]]; if (!s || !s.draw || (s.open && !s.open())) continue;
          if (ORDER[i] === on) U.box(g, x - 2, 3, 18, 18, '#ffd23f', '#262838'); else U.fill(g, x - 1, 4, 16, 16, '#14161f');
          g.globalAlpha = ORDER[i] === on ? a : a * 0.55;
          if (s.tab) s.tab(g, x, 5);
          g.globalAlpha = a; x += 18;
        }
        return x;
      }
      Q.defScene('codex', {
        wide: true,   // like the pause menu: the scene under it at the screen's width, the header band across it, the pages in the centred 320 column
        enter: function (opts) { U.entered();
          opts = opts || {};
          CO.from = opts.from || 'level'; CO.sel = 0; CO.read = ''; CO.t = 0;
          CO.list = pageList(); CO.page = find('memos', Q.clamp((Q.level && Q.level.world) || U.lastWorld || 1, 1, 4) - 1);
          shown();
        },
        update: function (dt) {
          var p = cur(), s = SEC[p.sec], n;
          CO.t += dt;
          if (Q.talking()) return;   // a page's own talk (HOLD MUSIC the first time): its box takes A and B
          if (CO.read) { if (U.press('b') || U.press('a') || U.press('start')) { CO.read = ''; Q.sfx('back'); } return; }
          if (U.press('b') || U.press('start')) { Q.sfx('back'); Q.go('pause', { from: CO.from, back: 'codex' }); return; }
          n = CO.list.length;
          if (U.press('left')) { CO.page = (CO.page + n - 1) % n; CO.sel = 0; Q.sfx('move'); shown(); return; }
          if (U.press('right')) { CO.page = (CO.page + 1) % n; CO.sel = 0; Q.sfx('move'); shown(); return; }
          n = s && s.rows ? s.rows(p.sub) | 0 : 0;
          if (n > 0) CO.sel = U.menuMove(Math.min(CO.sel, n - 1), n);
          if (s && s.a && U.press('a')) s.a(p.sub, CO.sel);
        },
        draw: function (g) {
          U.under(g, CO.from);
          U.fill(g, 0, 0, Q.W, 23, '#0b0c10'); U.fill(g, 0, 23, Q.W, 1, '#2a2c3a');   // a header of its own: the HUD under it never shows through (QA round 2)
          Q.col(g, codexPage);
        },
        leave: function () { for (var i = 0; i < ORDER.length; i++) if (SEC[ORDER[i]] && SEC[ORDER[i]].leave) SEC[ORDER[i]].leave(); }   // HOLD MUSIC puts the scene's song back
      });
      function codexPage(g) {   // the page itself, in the centred 320 column (all of the screen on a 320 one)
          var p = cur(), s = SEC[p.sec] || SEC.memos, x;
          if (CO.read) { U.memoPaper(g, CO.read); U.text('B: BACK', 160, 188, '#8a93a8', 1, 'center'); U.drawTalk(g); return; }
          U.text('CODEX', 10, 6, '#ffffff', 2);
          x = tabs(g, p.sec);
          U.text(s.name, x + 2, 10, '#ffd23f');
          U.text(s.count ? s.count(p.sub) : '', 310, 10, '#c3c7d4', 1, 'right');
          U.box(g, 8, 24, 304, 156, s.col ? s.col(p.sub) : '#2ec4b6', '#12141c');
          U.text(s.title ? s.title(p.sub) : s.name, 160, 31, '#ffffff', 1, 'center');
          if (CO.list.length > 1 && Math.floor(CO.t * 2) % 2) { U.text('<', 18, 31, '#ffd23f'); U.text('>', 297, 31, '#ffd23f'); }
          U.fill(g, 14, 41, 292, 1, '#2a2c3a');
          s.draw(g, p.sub, CO.sel, CO.t);
          U.text(s.hint ? s.hint(p.sub) : 'LEFT/RIGHT: PAGE   B: BACK', 160, 188, '#8a93a8', 1, 'center');
          U.drawTalk(g);
      }
    })();
