    // ---------- 25-art-root-bg.js: the background 'root' (ART, builder 3; QUEST-API.md part 14.6): the oldest folder of the 9F computer ----------
    // Dark and calm: a deep blue-black, a little lighter at the top left (where the light comes from), faint dotted grid lines every 32 pixels and a fuller
    // one every 128 at half the camera's speed (the grid of the other four rooms, calmer), a small teal cross where two fuller lines meet, and old file icons
    // drifting slowly up, some behind the grid and some in front. The base and the grid are drawn once into two canvases on the first frame; after that a
    // frame is two image draws and fourteen small sprites. Its own clock only runs while the room is drawn, so after the pause nothing jumps.
    // 'a3-oldfile' (12 by 12): 0 a page of text, 1 a folder, 2 a disk, 3 a picture, 4 a file nobody can open.
    (function () {
      Q.art.def('a3-oldfile', 12, 12, Q.art.pal({ p: '#e8e0cc', x: '#b8b0a0', d: '#6a7088', H: '#e2c78e', F: '#c4a05e', f: '#9a7a40', B: '#3f6fb0',
                                                  b: '#2c4f80', m: '#b8c0cc', s: '#8fb4d8', y: '#ffd23f', g: '#4f9a6a' }), [
        [
          '.kkkkkkk.... ............ .kkkkkkkkk.. .kkkkkkk.... .kkkkkkk....',
          '.kpppppxk... .kkkk....... .kBBmmmmBBk. .kpppppxk... .kpppppxk...',
          '.kpppppxxk.. kHHHHk...... .kBBmkmmBBk. .kpppppxxk.. .kpppppxxk..',
          '.kpppppkkkk. kHHHHHkkkkk. .kBBmkmmBBk. .kpppppkkkk. .kpppppkkkk.',
          '.kpddddddpk. kHHHHHHHHHHk .kBBmmmmBBk. .kpsssssspk. .kppdddpppk.',
          '.kppppppppk. kHFFFFFFFFfk .kBBBBBBBBk. .kpsyyssspk. .kpdpppdppk.',
          '.kpddddddpk. kHFFFFFFFFfk .kBppppppBk. .kpsyyssspk. .kppppdpppk.',
          '.kppppppppk. kHFFFFFFFFfk .kBpddddpBk. .kpssssgspk. .kpppdppppk.',
          '.kpdddddppk. kHFFFFFFFFfk .kBppppppBk. .kpsssgggpk. .kppppppppk.',
          '.kppppppppk. kHFFFFFFFFfk .kBppppppBk. .kpsgggggpk. .kpppdppppk.',
          '.kxxxxxxxxk. kffffffffffk .kbbbbbbbbk. .kxxxxxxxxk. .kxxxxxxxxk.',
          '.kkkkkkkkkk. .kkkkkkkkkk. .kkkkkkkkkk. .kkkkkkkkkk. .kkkkkkkkkk.'
        ]
      ]);
      var R = { base: null, grid: null, tried: false, clock: 0, last: -1, icons: null };
      var BAND = ['#191d2c', '#171b29', '#151826', '#131623', '#111420', '#0f121c', '#0d1019', '#0c0e16'];
      var MINOR = 'rgba(160,180,232,0.11)', MAJOR = 'rgba(170,190,240,0.09)', CROSS = 'rgba(46,196,182,0.32)';
      var GRID = 32, BIG = 128, PAR = 0.5;   // as the grid of the other four rooms (85-root-kit.js), so all five read as one old folder
      function rootHash(i) { var v = Math.sin(i * 91.7 + 47.3) * 43758.5453; return v - Math.floor(v); }
      function rootMod(a, n) { return ((a % n) + n) % n; }
      function rootBase(g) {   // the light: diagonal bands, lightest at the top left, one run of a colour at a time
        var y, x, x0, c, last, n = BAND.length;
        for (y = 0; y < 200; y++) {
          x0 = 0; last = '';
          for (x = 0; x <= 320; x++) {
            c = x < 320 ? BAND[Math.min(n - 1, Math.floor((x + y * 1.6) / (320 + 200 * 1.6) * n))] : '';
            if (c !== last) { if (last) { g.fillStyle = last; g.fillRect(x0, y, x - x0, 1); } x0 = x; last = c; }
          }
        }
      }
      function rootGrid(g, w, h) {   // a dotted line every 32 pixels, a fuller one every 128, a small teal cross where two of those meet; it repeats every 128
        var i, j, k;
        g.fillStyle = MINOR;
        for (i = 0; i < w; i += GRID) if (i % BIG) for (k = 0; k < h; k += 2) g.fillRect(i, k, 1, 1);
        for (i = 0; i < h; i += GRID) if (i % BIG) for (k = 0; k < w; k += 2) g.fillRect(k, i, 1, 1);
        g.fillStyle = MAJOR;
        for (i = 0; i < w; i += BIG) g.fillRect(i, 0, 1, h);
        for (i = 0; i < h; i += BIG) g.fillRect(0, i, w, 1);
        g.fillStyle = CROSS;
        for (i = 0; i < w; i += BIG) for (j = 0; j < h; j += BIG) { g.fillRect(i - 2, j, 2, 1); g.fillRect(i + 1, j, 2, 1); g.fillRect(i, j - 2, 1, 2); g.fillRect(i, j + 1, 1, 2); }
      }
      function rootReady() {   // the two canvases, once; false (and the plain way each frame) if a canvas cannot be had
        if (R.tried) return !!R.base;
        R.tried = true;
        try {
          R.base = Q.canvas(320, 200); rootBase(R.base.getContext('2d'));
          R.grid = Q.canvas(320 + BIG, 200 + BIG); rootGrid(R.grid.getContext('2d'), 320 + BIG, 200 + BIG);
        } catch (e) { R.base = R.grid = null; Q.warn('background root: no canvas (' + e.message + '), drawn the plain way'); }
        return !!R.base;
      }
      function rootIcons() {   // fourteen icons, each its own place, depth, speed and sway, worked out once
        var a = [], i, near;
        for (i = 0; i < 14; i++) {
          near = i % 2 === 1;
          a.push({ x: (i + rootHash(i) * 0.8) * 352 / 14, y: rootHash(i + 20) * 232, f: (i * 3) % 5, near: near, par: near ? 0.6 : 0.25,
                   sp: near ? 4 + rootHash(i + 40) * 3 : 1.5 + rootHash(i + 40) * 1.5, sw: 1.5 + rootHash(i + 60) * 2.5, ws: 0.25 + rootHash(i + 80) * 0.3, ph: i * 1.7 });
        }
        return a;
      }
      function rootIconsDraw(g, near, camX, camY) {   // one depth of the drifting icons (Q.spr rounds each to a whole pixel)
        var i, o, x, y;
        g.globalAlpha = near ? 0.5 : 0.3;
        for (i = 0; i < R.icons.length; i++) {
          o = R.icons[i]; if (o.near !== near) continue;
          x = rootMod(o.x - camX * o.par + Math.sin(R.clock * o.ws + o.ph) * o.sw, 352) - 16;
          y = rootMod(o.y - R.clock * o.sp - camY * o.par, 232) - 16;
          Q.spr(g, 'a3-oldfile', o.f, x, y);
        }
        g.globalAlpha = 1;
      }
      Q.defBg('root', function (g, camX, camY, t, Q) {
        var d = t - R.last, i, px, py, ready;
        R.last = t; if (d > 0 && d < 0.25) R.clock += d;   // its own clock: a pause (or the first frame) adds nothing
        if (!R.icons) R.icons = rootIcons();
        px = Math.floor(rootMod(camX * PAR, BIG)); py = Math.floor(rootMod(camY * PAR, BIG)); ready = rootReady();
        if (ready) g.drawImage(R.base, 0, 0); else { g.fillStyle = BAND[4]; g.fillRect(0, 0, 320, 200); }
        rootIconsDraw(g, false, camX, camY);   // the far ones, behind the grid: dimmer and slower
        if (ready) g.drawImage(R.grid, -px, -py);
        else { g.fillStyle = MINOR; for (i = GRID - px % GRID; i < 320; i += GRID) g.fillRect(i, 0, 1, 200); for (i = GRID - py % GRID; i < 200; i += GRID) g.fillRect(0, i, 320, 1); }
        rootIconsDraw(g, true, camX, camY);    // the near ones, in front of it
      });
    })();
