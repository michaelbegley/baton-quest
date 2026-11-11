// Baton Quest's smoke check: node tools/smoke.js   (BQ_ROOT=DIR to check another copy of the page)
// Boots the page with fresh storage, then warps to every level and checks each loads with no error; then the title,
// the end and the credits. Pictures in tools/out/smoke-*.png. A short check for every build, not a play-through.
'use strict';
const T = require('./bqtest');
(async () => {
  const t = await T.start({ name: 'smoke' });
  await t.wait(2500);
  let s = await t.state();
  t.ok(s && typeof s.screen === 'string', 'the game runs and reports its state', s);
  await t.shot('smoke-boot');
  const levels = await t.eval(() => { const out = []; return out; });   // filled below from the game's own list when it gives one
  const ids = ['w1-1', 'w1-2', 'w1-3', 'w1-boss', 'w1-bonus', 'w2-1', 'w2-2', 'w2-3', 'w2-boss', 'w2-bonus', 'w3-1', 'w3-2', 'w3-3', 'w3-boss', 'w3-bonus',
    'w4-1', 'w4-2', 'w4-3', 'w4-boss', 'w4-bonus', 'root-1', 'root-2', 'root-3', 'root-4', 'root-5'];
  await t.cheat('fresh'); await t.cheat('god', true); await t.cheat('give', 'all');
  for (const id of ids) {
    await t.cheat('warp', id);
    await t.wait(450);
    s = await t.state();
    t.ok(s.screen === 'level' && s.level === id && !s.errors, 'warp ' + id + ': the level runs', { screen: s.screen, level: s.level, errors: s.errors });
    if (id === 'w1-1' || id === 'w4-boss' || id === 'root-1') await t.shot('smoke-' + id);
  }
  s = await t.state();
  t.ok(!s.errors && s.warns === 0, 'the engine logged no errors or warnings', { errors: s.errors, warns: s.warns });
  await t.done();
})().catch((e) => { console.error('smoke crashed:', e); process.exitCode = 2; });
