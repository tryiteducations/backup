import os, glob

# Find supabase config file
for path in glob.glob("src/**/*.js", recursive=True) + glob.glob("src/**/*.ts", recursive=True):
    content = open(path, encoding="utf-8").read()
    if "placeholder.supabase" in content or "supabaseUrl" in content.lower():
        print(f"Found: {path}")
        idx = content.find("supabase")
        print(repr(content[idx:idx+200]))
        break

# Also check .env files
for f in [".env", ".env.local", ".env.production"]:
    if os.path.exists(f):
        print(f"\n{f}:")
        print(open(f).read()[:300])
