    // ---------- 83-w3-art.js: WORLD 3, THE CLOUD (builder 8): the world's tiles, its own tiles and decorations, and their art ----------
    // Plain clouds only: puffs with a dark outline are the ones you stand on; puffs without one are only scenery. Never a face on a cloud.
    Q.w3 = Q.w3 || {};
    Q.w3.C = {
      k: '#1d1d24', w: '#ffffff', c: '#e3f0fb', s: '#bcd6ee', d: '#8fb2d8', b: '#5b7fb0', n: '#2f7de1', t: '#2ec4b6', u: '#1d8f86',
      y: '#ffd23f', o: '#ff8a1e', r: '#e2504c', l: '#a8dcf8', g: '#8a96a8', e: '#4a5670', p: '#c9b6f2', q: '#8f78d8', m: '#f2c14e'
    };
    function w3R(g, c, x, y, w, h) { g.fillStyle = c; g.fillRect(x, y, w || 1, h || 1); }
    function w3Dots(g, c, list) { for (var i = 0; i < list.length; i += 2) w3R(g, c, list[i], list[i + 1], 1, 1); }

    // solid ground: a dense cloud bank (frame 0 open above: a bumpy outlined top; frame 1 under another solid: only the inside)
    var w3BankTop = [2, 1, 1, 0, 0, 0, 1, 1, 2, 2, 1, 0, 0, 0, 1, 2];
    Q.defSprite('t3-solid', { w: 16, h: 16, n: 2, draw: function (g, f) {
      var C = Q.w3.C, x, t;
      for (x = 0; x < 16; x++) {
        t = f ? 0 : w3BankTop[x];
        w3R(g, C.c, x, t, 1, 16 - t);
        if (!f) { w3R(g, C.k, x, t, 1, 1); w3R(g, C.w, x, t + 1, 1, 3); if (x % 2 === 0) w3R(g, C.w, x, t + 4, 1, 1); }
      }
      if (f) w3Dots(g, C.s, [2, 1, 9, 2, 13, 4, 5, 6, 0, 8, 11, 9, 7, 11, 3, 13, 14, 13, 9, 15]);
      else w3Dots(g, C.s, [4, 8, 13, 8, 7, 10, 1, 11, 10, 12, 6, 13, 15, 13, 3, 15, 12, 15]);
    } });

    // a thin cloud puff (=): stand on it, jump up through it
    var w3PuffTop = [2, 1, 1, 0, 0, 1, 1, 2, 2, 1, 0, 0, 0, 1, 1, 2];
    var w3PuffBot = [8, 9, 9, 8, 8, 9, 10, 10, 9, 9, 8, 8, 9, 9, 9, 8];
    Q.defSprite('t3-oneway', { w: 16, h: 16, n: 1, draw: function (g) {
      var C = Q.w3.C;
      for (var x = 0; x < 16; x++) {
        var t = w3PuffTop[x], b = w3PuffBot[x];
        w3R(g, C.c, x, t, 1, b - t); w3R(g, C.w, x, t + 1, 1, 2); w3R(g, C.s, x, b - 2, 1, 2);
        w3R(g, C.k, x, t, 1, 1); w3R(g, C.k, x, b, 1, 1);
      }
    } });

    // spikes: shards of hail standing up (only the bottom half hurts)
    function w3Shard(g, cx, ty, by, hw) {
      var C = Q.w3.C, h = by - ty, y, k;
      for (y = ty; y <= by; y++) { k = Math.round((y - ty) / h * hw); w3R(g, C.k, cx - k - 1, y, 2 * k + 3, 1); }
      w3R(g, C.k, cx, ty - 1, 1, 1);
      for (y = ty + 1; y < by; y++) {
        k = Math.round((y - ty) / h * hw); if (k < 1) { w3R(g, C.w, cx, y, 1, 1); continue; }
        w3R(g, C.l, cx - k, y, 2 * k + 1, 1); w3R(g, C.w, cx - k, y, k, 1); w3R(g, C.d, cx + k, y, 1, 1);
      }
    }
    Q.defSprite('t3-spike', { w: 16, h: 16, n: 1, draw: function (g) { w3Shard(g, 3, 8, 15, 3); w3Shard(g, 12, 8, 15, 3); w3Shard(g, 8, 6, 15, 3); } });

    // a crate: a storage box with tape and an upload arrow on it
    Q.defSprite('t3-crate', { w: 16, h: 16, n: 1, draw: function (g) {
      var C = Q.w3.C;
      w3R(g, C.k, 0, 0, 16, 16); w3R(g, '#b9cbe0', 1, 1, 14, 14); w3R(g, '#dce8f5', 1, 1, 14, 2); w3R(g, '#8fa5c0', 1, 13, 14, 2); w3R(g, '#8fa5c0', 13, 3, 2, 10);
      w3R(g, '#eadfb4', 6, 1, 4, 14); w3R(g, '#cbbd8c', 9, 1, 1, 14);
      w3R(g, C.n, 2, 6, 3, 1); w3R(g, C.n, 3, 5, 1, 1); w3R(g, C.n, 3, 7, 1, 3);
      w3Dots(g, C.k, [1, 1, 14, 1, 1, 14, 14, 14]);
    } });

    // a pound block: a heavy storm block (FIRM HAND breaks it, later)
    Q.defSprite('t3-pound', { w: 16, h: 16, n: 1, draw: function (g) {
      var C = Q.w3.C;
      w3R(g, C.k, 0, 0, 16, 16); w3R(g, C.e, 1, 1, 14, 14); w3R(g, '#6a7a96', 1, 1, 14, 2); w3R(g, '#343d52', 1, 13, 14, 2);
      w3R(g, C.s, 5, 4, 6, 1); w3R(g, C.s, 6, 5, 4, 1); w3R(g, C.s, 7, 6, 2, 1);
      w3R(g, C.s, 5, 8, 6, 1); w3R(g, C.s, 6, 9, 4, 1); w3R(g, C.s, 7, 10, 2, 1);
      w3Dots(g, '#9aa8bf', [3, 3, 12, 3, 3, 12, 12, 12]);
    } });

    // an upload arrow (U): a soft column of light with arrows rising through it; standing in it lifts the conductor
    function w3Chevron(g, y0) {
      var C = Q.w3.C, i, y;
      for (i = 0; i < 4; i++) {
        y = (y0 + i) % 16;
        w3R(g, C.u, 7 - i, (y + 1) % 16, 1, 1); w3R(g, C.u, 8 + i, (y + 1) % 16, 1, 1);
        w3R(g, C.t, 7 - i, y, 1, 1); w3R(g, C.t, 8 + i, y, 1, 1);
        w3R(g, C.w, 7 - i, (y + 15) % 16, 1, 1); w3R(g, C.w, 8 + i, (y + 15) % 16, 1, 1);
      }
    }
    Q.defSprite('w3-up', { w: 16, h: 16, n: 4, draw: function (g, f) {
      g.fillStyle = 'rgba(255,255,255,0.16)'; g.fillRect(0, 0, 16, 16);
      g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(3, 0, 10, 16);
      var y0 = (16 - f * 4) % 16;
      w3Chevron(g, (y0 + 2) % 16); w3Chevron(g, (y0 + 10) % 16);
    } });

    // decorations (no collision): the meadow's sprouts, windsocks, buckets, progress bars, floating files, lightning rods, sync signs, gust signs, wisps
    Q.defSprite('w3-sprout', { w: 16, h: 16, n: 2, draw: function (g, f) {
      var C = Q.w3.C, s = f;
      w3R(g, C.u, 7, 9, 1, 7); w3R(g, C.t, 8, 10, 1, 6);
      w3R(g, C.t, 9 + s, 12, 2, 1); w3R(g, C.u, 10 + s, 13, 2, 1);
      w3R(g, C.k, 6 + s, 4, 4, 1); w3R(g, C.k, 5 + s, 5, 6, 1); w3R(g, C.k, 4 + s, 6, 8, 1); w3R(g, C.k, 6 + s, 7, 4, 2);
      w3R(g, C.y, 7 + s, 5, 2, 1); w3R(g, C.y, 6 + s, 6, 4, 1); w3R(g, C.m, 7 + s, 7, 2, 1); w3R(g, C.w, 7 + s, 5, 1, 1);
    } });
    Q.defSprite('w3-sock', { w: 16, h: 16, n: 2, draw: function (g, f) {
      var C = Q.w3.C, i, dy;
      w3R(g, C.k, 2, 1, 3, 15); w3R(g, C.g, 3, 2, 1, 14); w3R(g, C.w, 3, 2, 1, 1);
      for (i = 0; i < 4; i++) {
        dy = f && i > 1 ? 1 : 0;
        w3R(g, C.k, 5 + i * 3, 2 + Math.floor(i / 2) + dy, 3, 6 - i); w3R(g, i % 2 ? C.w : C.o, 5 + i * 3, 3 + Math.floor(i / 2) + dy, 3, 4 - i);
      }
    } });
    Q.defSprite('w3-bucket', { w: 16, h: 16, n: 1, draw: function (g) {
      var C = Q.w3.C, y;
      w3R(g, C.k, 4, 1, 8, 1); w3R(g, C.k, 3, 2, 1, 4); w3R(g, C.k, 12, 2, 1, 4);
      for (y = 5; y < 16; y++) { var i = Math.floor((y - 5) / 4); w3R(g, C.k, 1 + i, y, 14 - 2 * i, 1); if (y > 5 && y < 15) w3R(g, y < 7 ? C.l : C.n, 2 + i, y, 12 - 2 * i, 1); }
      w3R(g, '#5f9df0', 3, 7, 3, 7); w3R(g, C.w, 6, 9, 4, 3); w3R(g, C.n, 7, 10, 2, 1);
    } });
    Q.defSprite('w3-bar', { w: 16, h: 16, n: 2, draw: function (g, f) {
      var C = Q.w3.C;
      w3R(g, C.k, 7, 8, 2, 8); w3R(g, C.g, 7, 9, 1, 7);
      w3R(g, C.k, 0, 2, 16, 7); w3R(g, C.w, 1, 3, 14, 5); w3R(g, C.k, 2, 4, 12, 3); w3R(g, C.t, 3, 5, 9, 1);
      if (f) w3R(g, C.t, 12, 5, 1, 1);
    } });
    // a file floating up: scenery, not the memo (QA round 4). Unlike the memo (cream, a dark outline, blue lines): no outline, no lines, smaller (6 by 8),
    // cool grey and half see-through, so it reads as far off behind; its corner folded, a faint white arrow beside it
    Q.defSprite('w3-doc', { w: 16, h: 16, n: 2, draw: function (g, f) {
      var y = 5 + f, page = 'rgba(214,224,236,0.62)', fold = 'rgba(160,178,202,0.62)', up = 'rgba(255,255,255,0.45)';
      w3R(g, page, 5, y, 4, 8); w3R(g, page, 9, y + 2, 2, 6); w3R(g, fold, 9, y, 1, 2); w3R(g, fold, 10, y + 1, 1, 1);
      w3R(g, up, 13, y, 1, 5); w3R(g, up, 12, y + 1, 1, 1); w3R(g, up, 14, y + 1, 1, 1);
    } });
    Q.defSprite('w3-rod', { w: 16, h: 16, n: 2, draw: function (g, f) {
      var C = Q.w3.C;
      w3R(g, C.k, 6, 4, 4, 12); w3R(g, C.g, 7, 5, 2, 11); w3R(g, C.w, 7, 5, 1, 11);
      w3R(g, C.k, 7, 0, 2, 4); w3R(g, C.y, 7, 1, 1, 3);
      w3R(g, C.k, 4, 13, 8, 3); w3R(g, C.e, 5, 14, 6, 1);
      if (f) { w3Dots(g, C.y, [5, 1, 10, 2, 4, 4, 11, 0]); }
    } });
    Q.defSprite('w3-sync', { w: 16, h: 16, n: 2, draw: function (g, f) {
      var C = Q.w3.C, a = f ? C.o : C.t, b = f ? C.t : C.o;
      w3R(g, C.k, 7, 11, 2, 5);
      w3R(g, C.k, 2, 0, 12, 12); w3R(g, C.w, 3, 1, 10, 10);
      w3R(g, a, 5, 3, 5, 1); w3R(g, a, 4, 4, 1, 3); w3R(g, a, 9, 2, 1, 3); w3R(g, a, 10, 3, 1, 1);
      w3R(g, b, 6, 8, 5, 1); w3R(g, b, 11, 5, 1, 3); w3R(g, b, 6, 7, 1, 3); w3R(g, b, 5, 8, 1, 1);
    } });
    Q.defSprite('w3-gust', { w: 16, h: 16, n: 2, draw: function (g, f) {
      var C = Q.w3.C, i;
      w3R(g, C.k, 7, 10, 2, 6);
      for (i = 0; i < 6; i++) { w3R(g, C.k, 7 - i - 1, 1 + i, 2 * i + 4, 1); w3R(g, C.k, 7 - i - 1, 11 - i, 2 * i + 4, 1); }
      for (i = 0; i < 5; i++) { w3R(g, f ? C.o : C.y, 7 - i, 2 + i, 2 * i + 2, 1); w3R(g, f ? C.o : C.y, 7 - i, 10 - i, 2 * i + 2, 1); }
      w3R(g, f ? C.o : C.y, 2, 6, 12, 1);
      w3R(g, C.k, 4, 5, 5, 1); w3R(g, C.k, 7, 7, 5, 1); w3R(g, C.k, 9, 6, 1, 1); w3R(g, C.k, 6, 6, 1, 1);
    } });
    function w3Disc(g, c, cx, cy, r) { for (var dy = -r; dy <= r; dy++) { var hw = Math.floor(Math.sqrt(r * r - dy * dy + r * 0.8)); g.fillStyle = c; g.fillRect(cx - hw, cy + dy, hw * 2 + 1, 1); } }
    Q.defSprite('w3-wisp', { w: 16, h: 16, n: 1, draw: function (g) {
      w3Disc(g, 'rgba(255,255,255,0.55)', 5, 10, 3); w3Disc(g, 'rgba(255,255,255,0.55)', 10, 9, 4); w3R(g, 'rgba(255,255,255,0.55)', 2, 11, 12, 3);
    } });
    Q.defSprite('w3-none', { w: 16, h: 16, n: 1, draw: function () {} });

    // world 3's own tiles (QUEST-API.md part 5: capitals, digits and marks not taken by the base set)
    Q.defTile(3, 'U', { solid: false, art: 'w3-up', fps: 12, w3lift: true });    // an upload arrow: lifts him while he stands in it (83-w3-world.js)
    Q.defTile(3, 'H', { solid: false, art: 't3-solid', frame: 1 });               // a cloud you can walk into (a secret)
    Q.defTile(3, '|', { solid: false, art: 'w3-none' });                          // an unseen stop for drifting clouds
    Q.defTile(3, 'Y', { solid: false, art: 'w3-sprout', fps: 2 });
    Q.defTile(3, 'F', { solid: false, art: 'w3-sock', fps: 4 });
    Q.defTile(3, 'B', { solid: false, art: 'w3-bucket' });
    Q.defTile(3, 'N', { solid: false, art: 'w3-bar', fps: 2 });
    Q.defTile(3, 'A', { solid: false, art: 'w3-doc', fps: 2 });   // a file floating up (A: an attachment; D is the base secret door)
    Q.defTile(3, 'T', { solid: false, art: 'w3-rod', fps: 3 });
    Q.defTile(3, 'J', { solid: false, art: 'w3-sync', fps: 2 });
    Q.defTile(3, 'G', { solid: false, art: 'w3-gust', fps: 2 });
    Q.defTile(3, 'W', { solid: false, art: 'w3-wisp' });

    // THE WINDY BUCKET's own walls: the side of a storage bucket the size of a sky (L), and its rolled rim (I)
    Q.defSprite('w3-pail', { w: 16, h: 16, n: 1, draw: function (g) {
      var C = Q.w3.C;
      w3R(g, '#3f7cc4', 0, 0, 16, 16); w3R(g, '#5b97dc', 0, 0, 3, 16); w3R(g, '#2f63a6', 12, 0, 4, 16); w3R(g, '#7fb3ea', 1, 0, 1, 16);
      w3R(g, '#2a568f', 7, 0, 1, 16); w3R(g, '#5b97dc', 8, 0, 1, 16); w3Dots(g, '#9cc7f2', [4, 4, 4, 12, 10, 8]);
    } });
    Q.defSprite('w3-rim', { w: 16, h: 16, n: 1, draw: function (g) {
      var C = Q.w3.C;
      w3R(g, '#3f7cc4', 0, 6, 16, 10); w3R(g, '#5b97dc', 0, 6, 3, 10); w3R(g, '#2f63a6', 12, 6, 4, 10);
      w3R(g, C.k, 0, 0, 16, 7); w3R(g, '#9cc7f2', 0, 1, 16, 4); w3R(g, '#d6ebfb', 0, 1, 16, 1); w3R(g, '#5b97dc', 0, 4, 16, 1);
      w3R(g, '#2a568f', 7, 7, 1, 9); w3R(g, '#5b97dc', 8, 7, 1, 9);
    } });
    Q.defTile(3, 'L', { solid: true, art: 'w3-pail' });
    Q.defTile(3, 'I', { solid: true, art: 'w3-rim' });

    // THE SYNC STORM's dark cloud banks (C on top, with an outlined bumpy edge; V inside): lighter than the storm behind them, so the ground still reads
    Q.defSprite('w3-dark', { w: 16, h: 16, n: 2, draw: function (g, f) {
      var C = Q.w3.C, x, t;
      for (x = 0; x < 16; x++) {
        t = f ? 0 : w3BankTop[x];
        w3R(g, '#6f7f9f', x, t, 1, 16 - t);
        if (!f) { w3R(g, C.k, x, t, 1, 1); w3R(g, '#b4c1da', x, t + 1, 1, 2); w3R(g, '#8e9dbb', x, t + 3, 1, 2); }
      }
      w3Dots(g, '#5a6886', f ? [2, 1, 9, 2, 13, 4, 5, 6, 0, 8, 11, 9, 7, 11, 3, 13, 14, 13, 9, 15] : [4, 8, 13, 8, 7, 10, 1, 11, 10, 12, 6, 13, 15, 13, 3, 15, 12, 15]);
    } });
    Q.defTile(3, 'C', { solid: true, art: 'w3-dark', frame: 0 });
    Q.defTile(3, 'V', { solid: true, art: 'w3-dark', frame: 1 });
