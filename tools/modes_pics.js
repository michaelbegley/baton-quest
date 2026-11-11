// GAME MODES' pictures (version 125, B29): node tools/modes_pics.js [native|wide|phone ...]   (BQ_ROOT=DIR for another copy of the page)
// Each look in its own new browser: native (WIDESCREEN off: the game's own 320 by 200 pixels, read from its canvas), wide (a 1280 by 720 window, the
// page as it shows) and phone (390 by 844, the handheld). Records are made first by real runs (cheats for speed, keys on the menus), then: GAME MODES,
// SPEED RUN's routes (WORLD 1 and ALL 16), a run with its split, its pause, its results (WORLD 1 and ALL 16), RECORDS (WORLD 1 and ALL 16), HIGH SCORE's
// screen, a run at X2, its pause, the initials, the table, TOP 5. In tools/out/modes-LOOK-NAME.png, and four to a sheet in tools/out/modes-sheet-LOOK-N.png.
'use strict';
const fs = require('fs'), path = require('path');
const T = require('./bqtest');
const { kit } = require('./modes_kit');
const LOOKS = {
  native: { context: { viewport: { width: 960, height: 600 } }, wide: 'off' },
  wide: { context: { viewport: { width: 1280, height: 720 } }, wide: 'auto' },
  phone: { context: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }, wide: 'auto' }
};
async function fresh() {   // 'fresh': native, a new browser with no records: each screen's empty state (and SPEED RUN's RECORDS row picked)
  const t = await T.start({ name: 'modes pictures: fresh', context: LOOKS.native.context, init: 'try { if (!localStorage.getItem("bq-settings")) localStorage.setItem("bq-settings", JSON.stringify({ wide: "off" })); } catch (e) {}' });
  const h = kit(t), shots = [];
  const shot = async (id, label) => { const file = path.join(T.OUT, 'modes-fresh-' + id + '.png'), d = await t.eval(() => document.getElementById('screen').toDataURL('image/png'));
    fs.writeFileSync(file, Buffer.from(d.split(',')[1], 'base64')); shots.push({ file, label: label + ' (a new browser)' }); };
  await t.wait(2500); await h.toModes(); await h.pick('speed'); await h.key('a'); await h.at('srun', 1500); await t.wait(600); await shot('srun', 'SPEED RUN, no records');
  await h.key('up'); await t.wait(600); await shot('srun-rec', 'SPEED RUN, RECORDS picked');
  await h.key('a'); await h.at('srec', 1500); await t.wait(600); await shot('srec', 'RECORDS, none yet');
  await h.key('b'); await h.key('b'); await h.pick('score'); await h.key('a'); await h.at('hscore', 1500); await t.wait(600); await shot('hscore', 'HIGH SCORE, no score yet');
  await h.key('down'); await h.key('a'); await h.at('htop', 1500); await t.wait(600); await shot('htop', 'TOP 5, empty');
  await t.cheat('mode', 'start', 'score', 'all'); await t.wait(300); await h.overs(3); await h.at('hres', 4000); await h.until(async () => { const v = await h.ui(); return v.hres && v.hres.counted ? v : null; }, 2500);
  await t.wait(300); await shot('hres-none', 'HIGH SCORE, a run with no points');
  await t.cheat('mode', 'go', 'modes'); await t.wait(300);
  await t.cheat('mode', 'start', 'speed', 'w2'); await t.wait(300); await h.overs(1); await t.wait(400); await shot('speed-over', 'SPEED RUN, after a game over');
  await h.key('start'); await h.at('mpause', 1500); await h.key('down', 2); await h.key('a'); await t.wait(500); await shot('quit-ask', 'SPEED RUN, QUIT asks first');
  await h.key('right'); await h.key('a'); await h.at('modes', 2000);
  const s = await t.state(); t.ok(!s.errors && s.warns === 0, 'fresh: no errors or warnings', { errors: s.errors, warns: s.warns });
  for (let i = 0; i < shots.length; i += 4) {
    const html = '<body style="margin:0;background:#222;font:14px sans-serif;color:#fff"><div style="display:grid;grid-template-columns:repeat(2,auto);gap:6px;padding:6px">' +
      shots.slice(i, i + 4).map((p) => '<div><div>' + p.label + '</div><img style="image-rendering:pixelated;zoom:2" src="data:image/png;base64,' + fs.readFileSync(p.file).toString('base64') + '"></div>').join('') + '</div></body>';
    const pg = await t.ctx.newPage(); await pg.setViewportSize({ width: 1300, height: 900 }); await pg.setContent(html); await pg.waitForTimeout(300);
    await pg.screenshot({ path: path.join(T.OUT, 'modes-sheet-fresh-' + (i / 4 + 1) + '.png'), fullPage: true }); await pg.close();
  }
  console.log('fresh: ' + shots.length + ' pictures');
  return t.done();
}
async function look(name) {
  if (name === 'fresh') return fresh();
  const L = LOOKS[name], shots = [];
  const t = await T.start({ name: 'modes pictures: ' + name, context: L.context, init: 'try { if (!localStorage.getItem("bq-settings")) localStorage.setItem("bq-settings", JSON.stringify({ wide: "' + L.wide + '" })); } catch (e) {}' });
  const h = kit(t);
  const shot = async (id, label) => {
    const file = path.join(T.OUT, 'modes-' + name + '-' + id + '.png');
    if (name === 'native') { const d = await t.eval(() => document.getElementById('screen').toDataURL('image/png')); fs.writeFileSync(file, Buffer.from(d.split(',')[1], 'base64')); }
    else await t.page.screenshot({ path: file });
    shots.push({ file, label: label + ' (' + name + ')' });
  };
  await t.wait(2500);
  const w = await t.eval(() => document.getElementById('screen').width);
  t.ok(name !== 'native' || w === 320, name + ': the game\'s screen is ' + w + ' wide', w);
  // ---- records first: three runs on WORLD 1 (a first, a best, a slower), ALL 16, three HIGH SCORE runs ----
  await h.toModes();
  await h.quickSpeed('w1', 900); await h.quickSpeed('w1', 300); await h.quickSpeed('w1', 500);
  await h.quickSpeed('all', 150); await h.until(async () => (await h.ui()).sres.counted, 2000); await t.wait(1200); await shot('sres-all', 'SPEED RUN results, ALL 16');
  await h.quickSpeed('w1', 200); await h.until(async () => (await h.ui()).sres.counted, 2000); await t.wait(1200); await shot('sres-w1', 'SPEED RUN results, WORLD 1, against the best');
  for (const hits of [2, 4]) {
    await t.cheat('mode', 'start', 'score', 'all'); await t.wait(300);
    for (let k = 0; k < hits; k++) { await t.cheat('mode', 'hit'); await t.wait(80); }
    await h.overs(3); await h.at('hres', 4000); await h.until(async () => { const v = await h.ui(); return v.hres && v.hres.counted ? v : null; }, 2500);
    await h.key('up', hits); await h.key('start'); await t.cheat('mode', 'go', 'modes'); await t.wait(200);
  }
  await t.cheat('mode', 'start', 'score', 'all'); await t.wait(300);
  for (let k = 0; k < 7; k++) { await t.cheat('mode', 'hit'); await t.wait(80); }
  await t.cheat('mode', 'stage'); await t.wait(300); await h.overs(3); await h.at('hres', 4000);
  await h.until(async () => { const v = await h.ui(); return v.hres && v.hres.counted ? v : null; }, 2500);
  await h.key('up'); await h.key('right'); await h.key('up', 2); await h.key('right'); await t.wait(200); await shot('hres-name', 'HIGH SCORE, the initials');
  await h.key('down'); await h.key('start'); await t.wait(500); await shot('hres-table', 'HIGH SCORE, the table');
  // ---- the screens ----
  await h.key('right'); await h.key('a'); await h.at('modes', 1500); await h.pick('score'); await t.wait(600); await shot('modes', 'GAME MODES');
  await h.key('a'); await h.at('hscore', 1500); await t.wait(600); await shot('hscore', 'HIGH SCORE');
  await h.key('down'); await h.key('a'); await h.at('htop', 1500); await t.wait(600); await shot('htop', 'TOP 5');
  await h.key('b'); await h.key('up'); await h.key('a'); await h.running('score'); await t.wait(400);
  await h.hold('right', 900); for (let k = 0; k < 6; k++) { await t.cheat('mode', 'hit'); await t.wait(70); }
  await shot('score-play', 'HIGH SCORE, a run at X2');
  await h.key('start'); await h.at('mpause', 1500); await t.wait(400); await shot('score-pause', 'HIGH SCORE, the run\'s pause');
  await h.key('down', 2); await h.key('a'); await h.key('right'); await h.key('a'); await h.at('modes', 2000);
  await h.pick('speed'); await h.key('a'); await h.at('srun', 1500); await t.wait(600); await shot('srun-w1', 'SPEED RUN, WORLD 1 picked');
  await h.key('up', 2); await t.wait(600); await shot('srun-all', 'SPEED RUN, ALL 16 picked');
  await h.key('down'); await h.key('a'); await h.at('srec', 1500); await t.wait(600); await shot('srec-w1', 'RECORDS, WORLD 1');
  await h.key('left'); await t.wait(600); await shot('srec-all', 'RECORDS, ALL 16');
  await h.key('b'); await h.key('down'); await h.key('a'); await h.running('speed'); await t.wait(300);
  await h.hold('right', 700); await t.cheat('mode', 'stage'); await t.wait(900); await h.hold('right', 500); await shot('speed-play', 'SPEED RUN, a run after its split');
  await h.key('start'); await h.at('mpause', 1500); await t.wait(400); await shot('speed-pause', 'SPEED RUN, the run\'s pause');
  await h.key('down', 2); await h.key('a'); await h.key('right'); await h.key('a'); await h.at('modes', 2000);
  const s = await t.state(); t.ok(!s.errors && s.warns === 0, name + ': no errors or warnings', { errors: s.errors, warns: s.warns });
  for (let i = 0; i < shots.length; i += 4) {   // four to a sheet, each with its name over it
    const part = shots.slice(i, i + 4), k = name === 'native' ? 2 : name === 'wide' ? 0.5 : 0.42;
    const html = '<body style="margin:0;background:#222;font:14px sans-serif;color:#fff"><div style="display:grid;grid-template-columns:repeat(' + (name === 'phone' ? 4 : 2) + ',auto);gap:6px;padding:6px">' +
      part.map((p) => '<div><div>' + p.label + '</div><img style="image-rendering:pixelated;zoom:' + k + '" src="data:image/png;base64,' + fs.readFileSync(p.file).toString('base64') + '"></div>').join('') + '</div></body>';
    const pg = await t.ctx.newPage(); await pg.setViewportSize({ width: 1300, height: 900 }); await pg.setContent(html); await pg.waitForTimeout(300);
    await pg.screenshot({ path: path.join(T.OUT, 'modes-sheet-' + name + '-' + (i / 4 + 1) + '.png'), fullPage: true }); await pg.close();
  }
  console.log(name + ': ' + shots.length + ' pictures; sheets ' + Math.ceil(shots.length / 4));
  return t.done();
}
(async () => {
  const want = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(LOOKS).concat('fresh');
  let bad = 0;
  for (const n of want) bad += await look(n);
  process.exitCode = bad ? 1 : 0;
})().catch((e) => { console.error('modes pictures crashed:', e); process.exitCode = 2; });
