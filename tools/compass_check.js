// THE COMPASS in a browser: node tools/compass_check.js   (BQ_ROOT=DIR for another copy; on a shared machine run it under the builders' browser lock)
// It runs tools/compass_logic.js first (no browser), then these, each in a fresh Playwright browser with its own storage (tools/bqtest.js; never anyone's own
// browser or save):
//   A. an old file (MID, as 123.1 saved it: no record): CONTINUE opens the map and the first scene plays: 6 lines, the Facilitator first, the Compass in its
//      own name and icon; the record says met and is stored at once; nothing else in the stored file changes.
//   B. the same file after a reload: the map again, and no scene (once per file).
//   C. C on the keyboard: the COMPASS CHECK with MID's four lines; the needle settles on stop 3; tokens picked up since the last save are not stored by it
//      (version 120's lesson: only the record changes in the store); B closes it; L opens it; a second check says NOTHING SINCE; left still walks the map.
//   D. FRESH and DONE: the four lines, the stop the needle settles on, and where the panel docks (away from the spot).
//   E. NEW GAME from the title: the intro and 1-1 start with no Compass in them; the first map after that plays the scene.
//   F. a phone (390 by 844, the handheld): its C button opens the check, its B button closes it.
//   G. a controller: its left, top and both bumper buttons open the check (C on a controller), its B closes it.
//   H. GAME MODES still starts BATTLE. In every one: no page errors, no engine errors or warnings.
'use strict';
const T = require('./bqtest');
const CL = require('./compass_logic');
const KEY = 'nf-arcade-quest', SKIP = ['compass', 'time', 'watch'];   // the store's key (js/saves.js); what a stored file may change on the map
let pass = 0, fail = 0;

function seed(save, settings) {   // once per tab (a reload keeps what the game stored since): this save as FILE 1, and the page's own settings
  return "try{if(!sessionStorage.getItem('cc-seeded')){sessionStorage.setItem('cc-seeded','1');" +
    (save ? 'localStorage.setItem(' + JSON.stringify(KEY) + ',' + JSON.stringify(JSON.stringify(CL.bundle(save))) + ');' : '') +
    (settings ? "localStorage.setItem('bq-settings'," + JSON.stringify(JSON.stringify(settings)) + ');' : '') + '}}catch(e){}';
}
const PAD = "(function(){var b=[],i;for(i=0;i<17;i++)b.push({pressed:false,touched:false,value:0});" +   // a stand-in controller 1, its buttons set by the check
  "window.__pad={id:'stand-in pad',index:0,connected:true,mapping:'standard',timestamp:0,axes:[0,0,0,0],buttons:b};" +
  "Object.defineProperty(navigator,'getGamepads',{configurable:true,value:function(){return [window.__pad,null,null,null];}});})();";
async function open(name, o) { o = o || {}; return T.start({ name, init: { content: seed(o.save, o.settings) + (o.pad ? PAD : '') }, context: o.context }); }   // o: save, settings, context, pad
async function close(t) { const s = await t.state(); t.ok(!s.errors && s.warns === 0, t.name + ': no engine errors or warnings', { errors: s.errors, warns: s.warns }); await t.done(); pass += t.pass; fail += t.fail; }
const info = (t) => t.cheat('compass', 'info');
async function toMap(t) {   // from the boot splash or the title: A until the map is up (CONTINUE is the menu's first line when a save is stored)
  for (let i = 0; i < 16; i++) { if ((await t.state()).screen === 'map') { await t.wait(400); return true; } await t.key('a', 90); await t.wait(350); }
  return (await t.state()).screen === 'map';
}
const stored = (t) => t.eval((k) => { try { const b = JSON.parse(localStorage.getItem(k)); return b && b.files ? b.files[b.cur | 0] : null; } catch (e) { return null; } }, KEY);
function diff(a, b) { const out = []; new Set(Object.keys(a || {}).concat(Object.keys(b || {}))).forEach((k) => { if (SKIP.indexOf(k) < 0 && JSON.stringify((a || {})[k]) !== JSON.stringify((b || {})[k])) out.push(k); }); return out; }
async function scene(t) {   // A through the first scene; each line's speaker, and the name and icon the text box gives a Compass line
  const who = [], shown = [];
  for (let i = 0; i < 8; i++) {
    let c = await info(t); if (!c.talk || c.talk.id !== 'compass-meet') break;
    const at = c.talk.i; who.push(c.talk.who); if (c.talk.who === 'compass') shown.push(c.name + '/' + c.face);
    await t.wait(500); await t.key('a'); c = await info(t);
    if (c.talk && c.talk.id === 'compass-meet' && c.talk.i === at) await t.key('a');   // the first A finished its typing
  }
  await t.wait(300);
  return { who, shown };
}
function settled(c, at) {   // the needle on the spot of ONE THING NEXT: the spot is that stop's (10 above its pad), the aim is from the middle of its glass
  const st = CL.STOPS[at]; if (!st || !c.spot || !c.glass) return false;
  const want = Math.atan2(c.spot.x - c.glass.x, -(c.spot.y - c.glass.y));
  let d = (c.angle - want) % (2 * Math.PI); if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
  return c.spot.x === st[0] && c.spot.y === st[1] - 10 && Math.abs(want - c.want) < 0.002 && Math.abs(d) < 0.06;
}
function four(t, tag, c, e) { ['moved', 'slipped', 'drifted', 'next'].forEach((k) => t.ok(c.lines && c.lines[k] === e[k], tag + ' ' + k.toUpperCase() + ': ' + (c.lines && c.lines[k]), { want: e[k] })); }

(async () => {
  const L = CL.run();   // the checks with no browser first
  pass += L.pass; fail += L.fail;
  // A, B, C: MID, an old file
  let t = await open('A-B-C mid', { save: CL.files.MID() }), c, st, pre;
  const seeded = await stored(t);
  t.ok(await toMap(t), 'A. MID (as saved by 123.1, no record): CONTINUE opens the map');
  c = await info(t);
  t.ok(c.meet === 'box' && c.talk && c.talk.id === 'compass-meet' && c.talk.i === 0 && c.talk.who === 'facil', 'A. the first scene starts on the first map visit, the Facilitator first', c);
  const sc = await scene(t);
  t.ok(sc.who.join(',') === 'facil,facil,compass,compass,facil,compass', 'A. its 6 lines: ' + sc.who.join(', '));
  t.ok(sc.shown.length === 3 && sc.shown.every((s) => s === 'THE COMPASS/face-compass'), 'A. each Compass line shows THE COMPASS and its icon in the text box', sc.shown);
  c = await info(t); st = await stored(t);
  t.ok(!c.talk && !c.meet && c.rec && c.rec.met === 1, 'A. the scene is over and the record says met', c.rec);
  t.ok(st && st.compass && st.compass.met === 1, 'A. met is in the stored file at once', st && st.compass);
  t.ok(diff(seeded, st).length === 0, 'A. nothing else in the stored file changed', diff(seeded, st));
  await t.page.reload(); await t.page.waitForFunction(() => window.NFX && NFX.arcade && NFX.arcade.run && NFX.arcade.run());
  t.ok(await toMap(t), 'B. after a reload, CONTINUE opens the map again');
  await t.wait(600); c = await info(t);
  t.ok(!c.talk && !c.meet && c.rec && c.rec.met === 1, 'B. no scene the second time (once per file)', c);
  await t.cheat('tokens', 50);   // 50 tokens picked up since the last save: in play, not stored
  pre = await stored(t);
  await t.press('KeyC'); await t.wait(300); c = await info(t);
  t.ok(c.open, 'C. C on the keyboard opens the COMPASS CHECK', c.open);
  await t.wait(1700); c = await info(t);
  four(t, 'C. MID', c, CL.EXPECT.MID);
  t.ok(c.next && c.next.at === 3 && settled(c, 3), 'C. the needle settles on stop 3 (3-2): ' + c.angle + ' rad', { spot: c.spot, glass: c.glass, angle: c.angle, want: c.want });
  t.ok(c.dock === 'bottom', 'C. the panel docks at the bottom, away from the spot', c.dock);
  st = await stored(t);
  t.ok(st.tokens === pre.tokens && (await t.state()).tokens === pre.tokens + 50, 'C. the 50 tokens in play are not stored by the check (version 120\'s lesson)', [st.tokens, pre.tokens]);
  t.ok(st.compass && st.compass.seen && st.compass.seen.levels === 9 && diff(pre, st).length === 0, 'C. only the record changed in the store', diff(pre, st));
  await t.press('KeyX'); await t.wait(300); c = await info(t);
  t.ok(!c.open, 'C. B (X on the keyboard) closes it', c.open);
  await t.press('KeyL'); await t.wait(1200); c = await info(t);
  t.ok(c.open && c.lines.moved === 'NOTHING SINCE THE LAST CHECK.' && c.lines.drifted === 'NOTHING. GOOD.', 'C. L opens it too; a second check: NOTHING SINCE THE LAST CHECK. / NOTHING. GOOD.', c.lines);
  await t.press('KeyX'); await t.wait(300);
  const at0 = (await info(t)).stopAt.at; await t.key('left', 120); await t.wait(1600);
  t.ok((await info(t)).stopAt.at === at0 - 1, 'C. left still walks the map', [at0, (await info(t)).stopAt]);
  await t.cheat('save'); st = await stored(t);   // the positive control for the tokens check: the game's own save does store them, and the read sees it
  t.ok(st.tokens === pre.tokens + 50 && diff(pre, st).indexOf('tokens') >= 0, 'C. control: the game\'s own save stores the 50 tokens, and the store read sees the change', [st.tokens, diff(pre, st)]);
  await close(t);

  // D: FRESH, W2 and DONE (at 320, WIDESCREEN off, so the canvas's pixels are the map's own)
  for (const [name, at, dock] of [['FRESH', 1, 'top'], ['W2', 2, 'top'], ['DONE', 4, 'bottom']]) {
    t = await open('D ' + name, { save: CL.files[name](), settings: { wide: 'off' } });
    t.ok(await toMap(t), 'D. ' + name + ': the map'); await scene(t);
    await t.press('KeyC'); await t.wait(2000); c = await info(t);
    four(t, 'D. ' + name, c, CL.EXPECT[name]);
    t.ok(c.next && c.next.at === at && settled(c, at), 'D. ' + name + ': the needle settles on stop ' + at + ': ' + c.angle + ' rad', { spot: c.spot, angle: c.angle, want: c.want });
    t.ok(c.dock === dock, 'D. ' + name + ': the panel docks at the ' + dock, c.dock);
    if (dock === 'top') t.ok(c.bottom <= 92 && c.top === Math.max(1, Math.min(17, 92 - (c.bottom - c.top))), 'D. ' + name + ': docked at the top it ends by y 92, above the low stops\' chips (' + c.top + ' to ' + c.bottom + ')', [c.top, c.bottom]);
    const corners = [[c.spot.x - 20, c.spot.y + 7], [c.spot.x + 19, c.spot.y + 7], [c.spot.x - 16, c.spot.y + 7], [c.spot.x + 15, c.spot.y + 7]];   // the brackets' bottom corners (marker(): 40 by 53 from spot.x - 20, spot.y - 45)
    let lit = 0;
    for (let k = 0; k < 12; k++) {
      if (await t.eval((p) => { const g = document.getElementById('screen').getContext('2d'); return p.every((q) => { const d = g.getImageData(q[0], q[1], 1, 1).data; return d[0] === 255 && d[1] === 210 && d[2] === 63; }); }, corners)) lit++;
      await t.wait(100);
    }
    t.ok(lit >= 3 && lit <= 11, 'D. ' + name + ': the spot blinks in yellow brackets (lit in ' + lit + ' of 12 frames)', lit);
    await t.press('KeyX'); await t.wait(300); t.ok(!(await info(t)).open, 'D. ' + name + ': B closes it');
    await close(t);
  }

  // E: NEW GAME from the title
  t = await open('E new game', {});
  await t.wait(3000); await t.key('a'); await t.wait(700);   // the boot splash ends by itself at 1.8 s; PRESS START: the menu (NEW GAME first: no save yet)
  await t.key('a'); await t.wait(1500);
  let s = await t.state(), saw = false;
  t.ok(s.screen === 'intro', 'E. NEW GAME starts the intro, as before', s.screen);
  for (let i = 0; i < 60 && s.screen !== 'level'; i++) { c = await info(t); if (c.meet || (c.talk && /compass/.test(c.talk.id + ' ' + c.talk.who))) saw = true; await t.key('a'); await t.wait(350); s = await t.state(); }
  await t.wait(800); c = await info(t); if (c.meet || (c.talk && /compass/.test(c.talk.id + ' ' + c.talk.who))) saw = true; s = await t.state();
  t.ok(s.screen === 'level' && s.level === 'w1-1', 'E. then 1-1 starts', { screen: s.screen, level: s.level });
  t.ok(!saw, 'E. no Compass in the intro or as 1-1 starts');
  t.ok(c.rec && !c.rec.met && c.rec.lvN === 0, 'E. the new file\'s record: not met yet', c.rec);
  await t.cheat('compass', 'map'); await t.wait(600); c = await info(t);   // as the pause menu's MAP: to the map
  t.ok(c.meet === 'box' && c.talk && c.talk.id === 'compass-meet', 'E. the new file\'s first map plays the scene', c.talk);
  await scene(t); c = await info(t);
  t.ok(c.rec && c.rec.met === 1 && !c.talk, 'E. and then it is met', c.rec);
  await close(t);

  // F: a phone, the handheld's buttons
  t = await open('F phone', { save: Object.assign(CL.files.MID(), { compass: { v: 1, met: 1 } }), context: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } });
  t.ok(await toMap(t), 'F. phone: the map');
  const vis = await t.eval(() => { const b = document.querySelector('#pocket [data-k="c"]'), r = b && b.getBoundingClientRect(); return b ? { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top) } : null; });
  t.ok(vis && vis.w > 20 && vis.h > 20, 'F. the handheld shows its C button', vis);
  await t.page.locator('#pocket [data-k="c"]').tap(); await t.wait(500); c = await info(t);
  t.ok(c.open, 'F. its C button opens the COMPASS CHECK', c.open);
  await t.wait(400); await t.page.locator('#pocket [data-k="b"]').tap(); await t.wait(500); c = await info(t);
  t.ok(!c.open, 'F. its B button closes it', c.open);
  await close(t);

  // G: a controller
  t = await open('G controller', { save: Object.assign(CL.files.MID(), { compass: { v: 1, met: 1 } }), pad: true });
  t.ok(await toMap(t), 'G. controller: the map'); await t.wait(400);
  const btn = async (n) => { await t.eval((k) => { window.__pad.buttons[k].pressed = true; window.__pad.buttons[k].value = 1; }, n); await t.wait(160);
    await t.eval((k) => { window.__pad.buttons[k].pressed = false; window.__pad.buttons[k].value = 0; }, n); await t.wait(300); };
  for (const [n, name] of [[2, 'left'], [3, 'top'], [4, 'left bumper'], [5, 'right bumper']]) {
    await btn(n); c = await info(t); t.ok(c.open, 'G. its ' + name + ' button (' + n + ') opens the COMPASS CHECK', c.open);
    await t.wait(300); await btn(1); c = await info(t); t.ok(!c.open, 'G. its B (1) closes it', c.open);
  }
  await close(t);

  // H: BATTLE from GAME MODES
  t = await open('H battle', {});
  await t.wait(3000); await t.key('a'); await t.wait(700);   // the menu, without a save: NEW GAME, GAME MODES, OPTIONS, EXTRAS
  await t.key('down'); await t.wait(300); await t.key('a'); await t.wait(900);
  s = await t.state(); t.ok(s.screen === 'modes', 'H. GAME MODES opens from the title', s.screen);
  await t.key('a'); await t.wait(800); s = await t.state(); t.ok(s.screen === 'bsplash', 'H. A on BATTLE: its card', s.screen);
  await t.key('a'); await t.wait(800); s = await t.state(); t.ok(s.screen === 'bplayers', 'H. then the players', s.screen);
  await t.key('start'); await t.wait(800); s = await t.state(); t.ok(s.screen === 'barena', 'H. then the arena', s.screen);
  await t.key('a'); await t.wait(2500); s = await t.state(); t.ok(s.screen === 'battle', 'H. and BATTLE starts', s.screen);
  await close(t);

  console.log('\nCOMPASS CHECK RESULT: ' + pass + ' passed, ' + fail + ' failed (' + L.pass + ' of them without a browser)');
  process.exitCode = fail ? 1 : 0;
})().catch((e) => { console.error('compass_check crashed:', e); process.exitCode = 2; });
