src = open('src/context/AuthContext.jsx', encoding='utf-8').read()

# Add is_admin to mock user
src = src.replace(
    "id: '4e6fcfaf-4ec5-4fc6-8047-351d8f3c82b0',",
    "id: '4e6fcfaf-4ec5-4fc6-8047-351d8f3c82b0',\n      is_admin: true,\n      role: 'admin',\n      plan: 'ultra',"
)

open('src/context/AuthContext.jsx', 'w', encoding='utf-8').write(src)
print("Admin user set")
