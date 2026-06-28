import os, re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    app = f.read()

# STEP 1: Remove all old centre imports
centre_imports = [
    "const CentreLogin        = lazy(() => import('./pages/centre/CentreLogin'))\n",
    "const CentreOnboarding   = lazy(() => import('./pages/centre/CentreOnboarding'))\n",
    "const CentreDashboard    = lazy(() => import('./pages/centre/CentreDashboard'))\n",
    "const CentreAnalytics    = lazy(() => import('./pages/centre/CentreAnalytics'))\n",
    "const ConductTest        = lazy(() => import('./pages/centre/ConductTest'))\n",
    "const StudentDetail      = lazy(() => import('./pages/centre/StudentDetail'))\n",
    "const StudentHistory     = lazy(() => import('./pages/centre/StudentHistory'))\n",
]
for imp in centre_imports:
    if imp in app:
        app = app.replace(imp, '')
        print('Removed import:', imp.strip()[:50])

# STEP 2: Remove old centre routes block
centre_routes = [
    '            {/* CENTRE */}\n',
    '            <Route path="/centre/login"        element={<CentreLogin />} />\n',
    '            <Route path="/centre/onboarding"   element={<CentreOnboarding />} />\n',
    '            <Route path="/centre/dashboard"    element={<CentreDashboard />} />\n',
    '            <Route path="/centre/analytics"    element={<CentreAnalytics />} />\n',
    '            <Route path="/centre/conduct-test" element={<ConductTest />} />\n',
    '            <Route path="/centre/students/:id" element={<StudentDetail />} />\n',
    '            <Route path="/centre/students"     element={<StudentHistory />} />\n',
]
for route in centre_routes:
    if route in app:
        app = app.replace(route, '')
        print('Removed route:', route.strip()[:60])

# STEP 3: Add centre redirects pointing to new institution pages
redirect_block = """            {/* CENTRE → INSTITUTION REDIRECTS */}
            <Route path="/centre/dashboard"  element={<Navigate to="/institution" replace/>}/>
            <Route path="/centre/login"      element={<Navigate to="/institution/register" replace/>}/>
            <Route path="/centre/onboarding" element={<Navigate to="/onboarding" replace/>}/>
            <Route path="/centre/analytics"  element={<Navigate to="/institution" replace/>}/>
            <Route path="/centre/conduct-test" element={<Navigate to="/institution/exams" replace/>}/>
            <Route path="/centre/students"   element={<Navigate to="/institution/students" replace/>}/>
            <Route path="/centre"            element={<Navigate to="/institution" replace/>}/>
"""

# Insert before institution routes
if '/centre/dashboard' not in app and redirect_block not in app:
    app = app.replace(
        "            {/* INSTITUTION */}" if "{/* INSTITUTION */}" in app
        else "            <Route path='/institution'",
        redirect_block + "\n            <Route path='/institution'"
    )
    print('OK centre redirects added')
else:
    print('Redirects already present or could not insert')

# STEP 4: Make sure Navigate is imported
if "Navigate" not in app:
    app = app.replace(
        "import { BrowserRouter",
        "import { BrowserRouter, Navigate"
    )
    app = app.replace(
        "} from 'react-router-dom'",
        ", Navigate } from 'react-router-dom'"
    )
    print('OK Navigate imported')

# STEP 5: Verify institution routes exist
has_inst = "<Route path='/institution'" in app
print('Institution route present:', has_inst)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(app)

# STEP 6: Fix RoleSelectPage to use /institution
with open('src/pages/role-select/RoleSelectPage.jsx', 'r', encoding='utf-8') as f:
    rs = f.read()
rs = rs.replace("home:'/centre/dashboard'", "home:'/institution'")
rs = rs.replace("home:'/centre'", "home:'/institution'")
with open('src/pages/role-select/RoleSelectPage.jsx', 'w', encoding='utf-8') as f:
    f.write(rs)
print('OK RoleSelectPage institution home = /institution')

# STEP 7: Verify final App.jsx has no centre imports left
with open('src/App.jsx', 'r', encoding='utf-8') as f:
    final = f.read()
print('\n=== FINAL VERIFICATION ===')
print('Centre imports remaining:', 'CentreDashboard' in final or 'CentreLogin' in final)
print('Centre routes remaining:', 'element={<CentreDashboard' in final)
print('Centre redirects present:', "Navigate to=\"/institution\"" in final or "Navigate to='/institution'" in final)
print('Institution route present:', "<Route path='/institution'" in final)
print('RoleSelect fixed:', "home:'/institution'" in open('src/pages/role-select/RoleSelectPage.jsx').read())
print('\nAll good! Run: npm run build')
