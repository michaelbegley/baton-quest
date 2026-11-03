    // ---------- 85-root-kit.js: THE ROOT FOLDER (version 116, QUEST-API.md part 14.6), the ROOT builder (builder 12): what the five rooms share ----------
    // The rooms: root-1 OLD MAIL (world 1), root-2 OLD RACKS (world 2), root-3 OLD CLOUDS (world 3), root-4 OLD TICKETS (world 4), root-5 README.TXT (world 0).
    // Each of the first four is that world's level in every way (its tiles, its enemies by the room's legend, its mechanics driven the way its own levels drive
    // them), painted on that world's own background with the root folder's faint grid over it, so the four read as one old folder. The backgrounds below call
    // the world's painter at run time (it may load later than this file) and fall back to a plain dark sky when it is not there.
    Q.root = Q.root || {};
    Q.root.ROOMS = ['root-1', 'root-2', 'root-3', 'root-4', 'root-5'];
    Q.root.W = { 1: 'root-1', 2: 'root-2', 3: 'root-3', 4: 'root-4' };

    // the root folder's grid: a dark wash, then faint lines every 32 px that drift at half the camera's speed, brighter at each 128 px
    Q.root.grid = function (g, camX, camY, wash, col) {
      var i, x, y, ox = ((Math.floor(camX * 0.5) % 32) + 32) % 32, oy = ((Math.floor(camY * 0.5) % 32) + 32) % 32, bx = Math.floor(camX * 0.5), by = Math.floor(camY * 0.5);
      if (wash) { g.fillStyle = wash; g.fillRect(0, 0, Q.W, Q.H); }
      for (i = 0; i * 32 - ox <= Q.W; i++) {   // 0 to 10 on a 320 screen, on across a wider one
        x = i * 32 - ox;
        g.fillStyle = (((x + bx) % 128) + 128) % 128 === 0 ? col.hi : col.lo; g.fillRect(x, 0, 1, Q.H);
      }
      for (i = 0; i <= 7; i++) {
        y = i * 32 - oy;
        g.fillStyle = (((y + by) % 128) + 128) % 128 === 0 ? col.hi : col.lo; g.fillRect(0, y, Q.W, 1);
      }
    };
    function rootPlain(g) { g.fillStyle = '#141820'; g.fillRect(0, 0, Q.W, Q.H); }
    function rootOld(world, wash, col) {   // a world's own background, then the root's wash and grid over it
      return function (g, camX, camY, t, Q) {
        var paint = Q.BG[world];
        if (paint) paint(g, camX, camY, t, Q); else rootPlain(g);
        Q.root.grid(g, camX, camY, wash, col);
      };
    }
    Q.defBg('root-inbox', rootOld('inbox', 'rgba(8,10,22,0.16)', { lo: 'rgba(150,170,230,0.05)', hi: 'rgba(170,190,240,0.10)' }));
    Q.defBg('root-server', rootOld('server', 'rgba(4,8,10,0.12)', { lo: 'rgba(120,220,200,0.05)', hi: 'rgba(140,240,220,0.10)' }));
    Q.defBg('root-cloud', rootOld('cloud', 'rgba(30,36,60,0.22)', { lo: 'rgba(255,255,255,0.07)', hi: 'rgba(255,255,255,0.13)' }));
    Q.defBg('root-backlog', rootOld('backlog', 'rgba(10,6,20,0.14)', { lo: 'rgba(200,170,240,0.05)', hi: 'rgba(220,190,250,0.10)' }));
