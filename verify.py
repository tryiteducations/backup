with open('src/pages/role-select/RoleSelectPage.jsx', 'r', encoding='utf-8') as f:
    rs = f.read()
print('RoleSelect fixed:', "home:'/institution'" in rs)
print('Still has centre:', "home:'/centre'" in rs)

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    app = f.read()
print('CentreDashboard removed:', 'CentreDashboard' not in app)
print('Institution route:', "<Route path=\'/institution\'" in app)
print('Centre redirects:', "Navigate to='/institution'" in app)
