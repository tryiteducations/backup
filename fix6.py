src = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').read()

# Fix 1: showUpgradeCTA added in wrong place - add after other useState declarations
# It was added after collapsed but before the component renders
if 'showUpgradeCTA' not in src:
    src = src.replace(
        "const [collapsed,  setCollapsed]  = useState(false)",
        "const [collapsed,  setCollapsed]  = useState(false)\n  const [showUpgradeCTA, setShowUpgradeCTA] = useState(true)"
    )
    print("Added showUpgradeCTA state")
else:
    print("showUpgradeCTA already exists")

# Fix 2: Supabase 400 - mock user usr-mock-001 doesnt exist in DB
# When profile load fails, use authUser data as fallback gracefully
src = src.replace(
    "getProfile(uid).catch(()=>null),",
    "getProfile(uid).catch(()=>({name:authUser?.name||'Student',coins:0,xp:0,level:1,plan:'free',badge:'Newcomer',state:'',avatar_url:null})),"
)
src = src.replace(
    "getStreak(uid).catch(()=>({current_streak:0,longest_streak:0})),",
    "getStreak(uid).catch(()=>({current_streak:0,longest_streak:0,total_study_days:0})),"
)
src = src.replace(
    "getUsage(uid).catch(()=>({tests_today:0,games_today:0,doubts_today:0})),",
    "getUsage(uid).catch(()=>({tests_today:0,games_today:0,doubts_today:0,last_reset:new Date().toISOString().split('T')[0]})),"
)
src = src.replace(
    "getRecentAttempts(uid,6).catch(()=>[]),",
    "getRecentAttempts(uid,6).catch(()=>[]),"
)
src = src.replace(
    "getLaunchpadEnrollment(uid).catch(()=>null),",
    "getLaunchpadEnrollment(uid).catch(()=>null),"
)
src = src.replace(
    "getLeaderboard(8).catch(()=>[]),",
    "getLeaderboard(8).catch(()=>[]),"
)

# Fix 3: updateStreak silently fails - wrap better
src = src.replace(
    "await updateStreak(uid).catch(()=>{})",
    "await updateStreak(uid).catch(()=>console.log('Streak update skipped - mock user'))"
)

open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8').write(src)
print('All fixes applied')
