#!/usr/bin/env python3
"""Join the game's parts in src/ into one file.

  python3 tools/build.py                 -> js/game.js, the ship build (what the page loads)
  python3 tools/build.py OUT.js --expose -> a test build that also has 69-engine-test.js (the engine's test level)
  python3 tools/build.py OUT.js --src=DIR -> build from another copy of the parts

Parts are joined in name order with ".js" left off when sorting (so 20-art-hero.js comes before
20-art-hero-b.js), each under a "// ===== NAME =====" line, inside one function that leaves at once
when the page has no NFX.arcade. The ship build leaves out 69-engine-test.js. Rebuilding an
unchanged src/ gives back js/game.js byte for byte (checked 11 Nov 2026 on version 123.1).
"""
import os
import sys

HEAD = ("  // ---------- Baton Quest: the 9F computer's platforming RPG (built from lab/quest by "
        "tools/quest_build.py; edit the parts there, not here) ----------\n"
        "  (function () {\n    if (!NFX.arcade) return;\n    var Q = {};\n")
FOOT = "  })();\n"
TEST_PART = "69-engine-test.js"


def build(src, expose):
    names = [n for n in os.listdir(src) if n.endswith(".js")]
    if not expose:
        names = [n for n in names if n != TEST_PART]
    names.sort(key=lambda n: n[:-3])
    out = [HEAD]
    for n in names:
        with open(os.path.join(src, n), encoding="utf-8") as f:
            body = f.read()
        if not body.endswith("\n"):
            raise SystemExit("build: %s does not end with a newline" % n)
        out.append("    // ===== %s =====\n" % n)
        out.append(body)
    out.append(FOOT)
    return "".join(out), len(names)


def main(argv):
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_path = os.path.join(root, "js", "game.js")
    src = os.path.join(root, "src")
    expose = False
    for a in argv:
        if a == "--expose":
            expose = True
        elif a == "--ship":
            expose = False
        elif a.startswith("--src="):
            src = a[6:]
        elif a.startswith("-"):
            raise SystemExit("build: unknown option " + a)
        else:
            out_path = a
    text, n = build(src, expose)
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    print("build: %d parts -> %s (%d bytes%s)" % (n, out_path, len(text.encode("utf-8")), ", with the test level" if expose else ""))


if __name__ == "__main__":
    main(sys.argv[1:])
