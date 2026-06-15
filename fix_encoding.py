import os, re

# All files that likely have broken emoji encoding
files_to_fix = [
    r"E:\Tatu\src\components\layout\Sidebar.jsx",
    r"E:\Tatu\src\pages\Login.jsx",
    r"E:\Tatu\src\pages\Onboarding.jsx",
    r"E:\Tatu\src\pages\Dashboard.jsx",
    r"E:\Tatu\src\context\AuthContext.jsx",
    r"E:\Tatu\src\pages\family\FamilyHub.jsx",
]

def fix_file(path):
    if not os.path.exists(path):
        print(f"SKIP (not found): {path}")
        return

    # Read as latin-1 to preserve raw bytes
    with open(path, 'r', encoding='latin-1') as f:
        content = f.read()

    # Fix broken emoji sequences (UTF-8 bytes read as latin-1)
    # Each emoji is 4 UTF-8 bytes misread as 4 latin-1 chars
    emoji_map = {
        '\xf0\x9f\x94\xa5': '🔥',  # fire
        '\xf0\x9f\x8e\x93': '🎓',  # graduation cap
        '\xf0\x9f\xa7\x91\xe2\x80\x8d\xf0\x9f\x8f\xab': '🧑‍🏫',  # teacher
        '\xf0\x9f\x8f\xab': '🏫',  # school
        '\xf0\x9f\x91\xa8\xe2\x80\x8d\xf0\x9f\x91\xa9\xe2\x80\x8d\xf0\x9f\x91\xa7': '👨‍👩‍👧',  # family
        '\xf0\x9f\x91\xa8\xe2\x80\x8d\xf0\x9f\x91\xa9': '👨‍👩',
        '\xe2\x9a\xa1': '⚡',
        '\xf0\x9f\x8f\x86': '🏆',
        '\xf0\x9f\x93\x88': '📈',
        '\xe2\x9b\x8f\xef\xb8\x8f': '⛏️',
        '\xf0\x9f\x92\xaa': '💪',
        '\xf0\x9f\xa6\x81': '🦁',
        '\xf0\x9f\x91\x91': '👑',
        '\xf0\x9f\x8c\x9f': '🌟',
        '\xf0\x9f\x8e\xaf': '🎯',
        '\xf0\x9f\x93\x85': '📅',
        '\xf0\x9f\x94\x94': '🔔',
        '\xf0\x9f\x8c\x88': '🌈',
        '\xf0\x9f\x91\xa4': '👤',
        '\xf0\x9f\x9a\xaa': '🚪',
        '\xf0\x9f\x8e\xa8': '🎨',
        '\xf0\x9f\x92\xb3': '💳',
        '\xe2\x9a\x99\xef\xb8\x8f': '⚙️',
        '\xf0\x9f\x94\x92': '🔒',
        '\xf0\x9f\x93\x9d': '📝',
        '\xf0\x9f\xa7\xa0': '🧠',
        '\xf0\x9f\x8c\x8d': '🌍',
        '\xf0\x9f\x93\x90': '📐',
        '\xf0\x9f\x8f\xa0': '🏠',
    }

    changed = False
    for broken, correct in emoji_map.items():
        if broken in content:
            content = content.replace(broken, correct)
            changed = True

    if changed:
        # Write back as UTF-8
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Fixed encoding: {path}")
    else:
        # File might already be UTF-8 but still have broken chars
        # Try reading as UTF-8 and check for garbled sequences
        try:
            with open(path, 'r', encoding='utf-8') as f:
                utf_content = f.read()
            # Check for garbled emoji pattern: ðŸ followed by anything
            if 'ðŸ' in utf_content or 'â€' in utf_content:
                print(f"⚠️  Still has garbled chars: {path}")
            else:
                print(f"OK (no encoding issues): {path}")
        except:
            print(f"⚠️  Could not verify: {path}")

# Fix FamilyHub loading issue separately
family_path = r"E:\Tatu\src\pages\family\FamilyHub.jsx"
if os.path.exists(family_path):
    with open(family_path, 'r', encoding='utf-8', errors='replace') as f:
        fc = f.read()
    if 'const { user }' in fc and 'loading' not in fc:
        fc = fc.replace('const { user }', 'const { user, loading }')
        with open(family_path, 'w', encoding='utf-8') as f:
            f.write(fc)
        print(f"✅ FamilyHub: added loading to useAuth")
    elif 'loading' in fc:
        print("FamilyHub: loading already present")

for path in files_to_fix:
    fix_file(path)

print("\nAll done. Run: npm run dev")
