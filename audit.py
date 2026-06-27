import os, re

pages_dir = 'src/pages'
print("=== APPLAYOUT PAGES (show old sidebar) ===")
for root, dirs, files in os.walk(pages_dir):
    for f in files:
        if not f.endswith('.jsx'): continue
        path = os.path.join(root, f)
        with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
            c = fp.read()
        rel = path.replace('src\\pages\\','').replace('src/pages/','')
        if 'AppLayout' in c:
            print('  LAYOUT: ' + rel)

print("")
print("=== STUDENT PAGES WITHOUT THEME ===")
for root, dirs, files in os.walk('src/pages/student'):
    for f in files:
        if not f.endswith('.jsx'): continue
        path = os.path.join(root, f)
        with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
            c = fp.read()
        if 'useTheme' not in c:
            print('  NO_THEME: ' + f)

print("")
print("=== KEY PAGES WITHOUT THEME ===")
key = ['src/pages/pricing/PricingPage.jsx','src/pages/referral/ReferralPage.jsx',
       'src/pages/wallet/WalletPage.jsx','src/pages/analytics/Analytics.jsx',
       'src/pages/achievements/Achievements.jsx','src/pages/leaderboard/Leaderboard.jsx',
       'src/pages/tournament/TournamentHub.jsx','src/pages/tournament/Tournaments.jsx',
       'src/pages/hall/BattleArena.jsx','src/pages/hall/HallHome.jsx',
       'src/pages/hall/HallLeaderboard.jsx','src/pages/mentor/MentorHub.jsx',
       'src/pages/community/CommunityPage.jsx','src/pages/exams/AllExams.jsx',
       'src/pages/current-affairs/CurrentAffairs.jsx']
for p in key:
    try:
        with open(p,'r',encoding='utf-8',errors='ignore') as fp:
            c = fp.read()
        themed = 'YES' if 'useTheme' in c else 'NO '
        layout = ' +APPLAYOUT' if 'AppLayout' in c else ''
        print('  '+themed+layout+': '+p.split('/')[-1])
    except:
        print('  MISSING: '+p.split('/')[-1])
