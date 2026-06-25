src = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').read()

# Fix 1: Add showUpgradeCTA state declaration at top of component
# Find the uploading state and add after it
if "const [showUpgradeCTA, setShowUpgradeCTA] = useState(true)" not in src:
    src = src.replace(
        "const [uploading,  setUploading]  = useState(false)",
        "const [uploading,  setUploading]  = useState(false)\n  const [showUpgradeCTA, setShowUpgradeCTA] = useState(true)"
    )
    print("Added showUpgradeCTA state declaration")
else:
    print("Already exists")

# Fix 2: Remove duplicate position key
src = src.replace(
    "border: `1px solid ${accent}45`, borderRadius: 14, padding: '12px',\n            position: 'relative',\n            position: 'relative' }}",
    "border: `1px solid ${accent}45`, borderRadius: 14, padding: '12px',\n            position: 'relative' }}"
)

# Fix 3: Remove duplicate backdropFilter
src = src.replace(
    "backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',\n            backdropFilter: 'blur(20px)',",
    "backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',"
)

# Fix 4: Remove duplicate onClick - keep only the second one
src = src.replace(
    "boxShadow: `0 4px 14px ${accent}33` }}\n                onClick={() => setUpgradeFor('tests')}>",
    "boxShadow: `0 4px 14px ${accent}33`\n                }} onClick={() => setUpgradeFor('tests')}>"
)

# Fix 5: Remove duplicate boxShadow on action cards
src = src.replace(
    "transition: 'all 0.15s',\n                      boxShadow: isDark ? 'none' : `0 2px 8px ${a.color}10` }}",
    "transition: 'all 0.15s' }}"
)

open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8').write(src)
print('All fixes applied')
