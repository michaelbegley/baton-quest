#!/usr/bin/env python3
# Builds js/game.js from the game's parts in src/ (NN-name.js, joined in name order; x.js before x-b.js). The engine's own test levels
# (src/69-engine-test*.js) stay out of the game people play. Use, from the repo's top folder: python3 tools/build.py
import glob, os, re, sys
here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
files = sorted((f for f in glob.glob(os.path.join(here, 'src', '*.js')) if re.match(r'^\d\d-', os.path.basename(f))), key=lambda f: os.path.basename(f)[:-3])
files = [f for f in files if not os.path.basename(f).startswith('69-engine-test')]
lines = ["  // ---------- Baton Quest: the 9F computer's platforming RPG (built from lab/quest by tools/quest_build.py; edit the parts there, not here) ----------",
         '  (function () {', '    if (!NFX.arcade) return;', '    var Q = {};']
bad = []
for f in files:
    name = os.path.basename(f)
    lines.append('    // ===== ' + name + ' =====')
    for n, s in enumerate(open(f, encoding='utf-8').read().rstrip('\n').split('\n'), 1):
        lines.append(s)
        if '\u2014' in s: bad.append('%s:%d: an em dash' % (name, n))
lines.append('  })();')
if bad:
    print('\n'.join(bad)); sys.exit(1)
out = os.path.join(here, 'js', 'game.js')
open(out, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
print('built js/game.js from %d parts' % len(files))
