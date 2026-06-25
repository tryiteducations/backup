src = open('src/context/AuthContext.jsx', encoding='utf-8').read()

# Remove the duplicate role and plan we added
src = src.replace(
    "id: '4e6fcfaf-4ec5-4fc6-8047-351d8f3c82b0',\n      is_admin: true,\n      role: 'admin',\n      plan: 'ultra',",
    "id: '4e6fcfaf-4ec5-4fc6-8047-351d8f3c82b0',\n      is_admin: true,"
)

# Change existing plan to ultra
src = src.replace(
    "isPro: false, plan: 'free', // ← change 'free' to 'pro' or 'ultra' to test",
    "isPro: true, plan: 'ultra', // admin ultra"
)

# Change existing role to admin
src = src.replace(
    "role: localStorage.getItem('tryit_role') || 'student',",
    "role: 'admin',"
)

open('src/context/AuthContext.jsx', 'w', encoding='utf-8').write(src)
print("Done")
