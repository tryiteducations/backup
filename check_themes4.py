# Check themeAccess.js
import os
for f in ["src/lib/themeAcess.js","src/lib/themeAccess.js","src/lib/themeUnlocks.js"]:
    if os.path.exists(f):
        print(f"Found: {f}")
        print(open(f, encoding="utf-8").read()[:400])
