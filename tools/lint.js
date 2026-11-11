// Baton Quest's lint: node tools/lint.js [BUILT.js] [--src=DIR]
// Checks the built game (default js/game.js) and its parts (default src/):
//   1. ES5 in strict mode (acorn, ecmaVersion 5, the whole file under "use strict")
//   2. game code never reaches for the page: no window, document, storage, timers, network, eval (a name after a dot is fine)
//   3. it loads in node with a stand-in NFX.arcade, and adds exactly one game, 'quest', with a start function
//   4. the text rules: no em dash, no real names or company names, no Cloudy, no HTML comment or script tags (the office embeds the game in a <script>)
//   5. each part ends with a newline and has at most 400 lines
// Prints each problem as FILE:LINE problem, then "lint: N problems". Exit code 1 when there are any.
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var acorn = require(path.join(__dirname, 'node_modules', 'acorn'));
var root = path.join(__dirname, '..'), built = path.join(root, 'js', 'game.js'), src = path.join(root, 'src');
process.argv.slice(2).forEach(function (a) { if (a.indexOf('--src=') === 0) src = a.slice(6); else built = path.resolve(a); });
var problems = [];
function bad(file, line, msg) { problems.push(file + ':' + line + ' ' + msg); }

var BANNED = ['window', 'document', 'localStorage', 'sessionStorage', 'indexedDB', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
  'requestAnimationFrame', 'cancelAnimationFrame', 'fetch', 'XMLHttpRequest', 'WebSocket', 'RTCPeerConnection', 'eval', 'Function', 'navigator', 'location',
  'alert', 'confirm', 'prompt', 'importScripts', 'Worker', 'globalThis', 'Date', 'performance', 'console'];   // not top, parent or self: the game uses them as its own names
var NAMES = [/\bmichael\b/i, /\bbrian\b/i, /\bbegley\b/i, /encloud\s*9/i, /\bcloudy\b/i, /\bkristin\b/i, /\bjodie\b/i, /blue\s*stratus/i, /\bpricemds\b/i, /\bclickdimensions\b/i];

var code = fs.readFileSync(built, 'utf8');
// 1. ES5, strict
try { acorn.parse('"use strict";\n' + code, { ecmaVersion: 5, sourceType: 'script', locations: true }); }
catch (e) { bad(path.basename(built), e.loc ? e.loc.line - 1 : 0, 'not ES5 strict: ' + e.message); }
// 2. page access (tokens: a banned name not right after a dot, and not a key in an object literal before a colon)
try {
  var toks = [], t, tk = acorn.tokenizer(code, { ecmaVersion: 5, locations: true });
  while ((t = tk.getToken()).type !== acorn.tokTypes.eof) toks.push(t);
  for (var i = 0; i < toks.length; i++) {
    t = toks[i];
    if (t.type !== acorn.tokTypes.name || BANNED.indexOf(t.value) < 0) continue;
    var prev = toks[i - 1], next = toks[i + 1];
    if (prev && prev.type === acorn.tokTypes.dot) continue;   // q.top, s.parent: a property, not the page
    if (next && next.type === acorn.tokTypes.colon && prev && (prev.type === acorn.tokTypes.braceL || prev.type === acorn.tokTypes.comma)) continue;   // { top: 3 }
    bad(path.basename(built), t.loc.start.line, 'reaches for the page: ' + t.value);
  }
} catch (e) { bad(path.basename(built), 0, 'could not read its tokens: ' + e.message); }
// 3. loads in node
try {
  var added = [], sandbox = { NFX: { arcade: { add: function (g) { added.push(g); return true; } } }, Math: Math, JSON: JSON };
  vm.runInNewContext(code, sandbox, { filename: built, timeout: 5000 });
  if (added.length !== 1 || !added[0] || added[0].id !== 'quest' || typeof added[0].start !== 'function') bad(path.basename(built), 0, 'load: expected one game "quest" with start(), got ' + added.length);
} catch (e) { bad(path.basename(built), 0, 'load in node threw: ' + (e && e.stack ? e.stack.split('\n').slice(0, 2).join(' | ') : e)); }
// 4 and 5. the parts' text
fs.readdirSync(src).filter(function (n) { return /\.js$/.test(n); }).sort().forEach(function (n) {
  var text = fs.readFileSync(path.join(src, n), 'utf8'), lines = text.split('\n');
  if (text.charAt(text.length - 1) !== '\n') bad(n, lines.length, 'does not end with a newline');
  if (lines.length - 1 > 400) bad(n, lines.length - 1, 'over 400 lines (' + (lines.length - 1) + ')');
  lines.forEach(function (l, k) {
    if (l.indexOf('—') >= 0) bad(n, k + 1, 'em dash');
    if (/<!--|-->|<\/?script/i.test(l)) bad(n, k + 1, 'HTML comment or script tag (the office embeds the game in a <script>)');
    NAMES.forEach(function (re) { if (re.test(l)) bad(n, k + 1, 'a real or company name: ' + l.match(re)[0]); });
  });
});
problems.forEach(function (p) { console.log(p); });
console.log('lint: ' + problems.length + ' problem' + (problems.length === 1 ? '' : 's') + ' (' + path.relative(root, built) + ', ' + Math.round(code.length / 1024) + ' KB)');
process.exit(problems.length ? 1 : 0);
