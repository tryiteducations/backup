src = open('src/pages/student/StudentDashboard.jsx', encoding='utf-8').read()

# Fix 1: Profile card - always stands out with glow border
src = src.replace(
    "background:'rgba(255,255,255,0.08)',borderRadius:14,\n          border:'1px solid rgba(255,255,255,0.15)',\n          backdropFilter:'blur(8px)'",
    "background:'linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))',\n          borderRadius:14,\n          border:'1px solid rgba(255,255,255,0.25)',\n          backdropFilter:'blur(12px)',\n          boxShadow:'0 4px 24px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.15)'"
)

# Fix 2: Streak always fire color - NEVER theme accent
src = src.replace(
    "{icon:'🔥',val:`${curStr}d`,label:'Streak',color:'#F59E0B'},",
    "{icon:'🔥',val:`${curStr}d`,label:'Streak',color:'#FF6B00'},"
)
src = src.replace(
    "background:`${s.color}12`,\n                border:`1px solid ${s.color}22`,borderRadius:10,\n                padding:'7px 8px',textAlign:'center',\n                boxShadow:`0 0 12px ${s.color}11`",
    "background:`${s.color}20`,\n                border:`1px solid ${s.color}50`,borderRadius:10,\n                padding:'7px 8px',textAlign:'center',\n                boxShadow:`0 0 16px ${s.color}33,inset 0 1px 0 rgba(255,255,255,0.1)`"
)

# Fix 3: Coins always gold - distinct from theme
src = src.replace(
    "{icon:'🪙',val:coins,label:'Coins',color:accent,anim:true},",
    "{icon:'🪙',val:coins,label:'Coins',color:'#FFD700',anim:true},"
)

# Fix 4: Stat cards always white glass - pops against any theme bg
src = src.replace(
    "style={{background:isDark?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.9)',\n                  backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',\n                  border:`1px solid ${s.color}35`,borderRadius:18,\n                  padding:'14px',",
    "style={{background:isDark?'rgba(255,255,255,0.10)':'rgba(255,255,255,0.95)',\n                  backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',\n                  border:`1.5px solid ${s.color}50`,borderRadius:18,\n                  padding:'14px',\n                  boxShadow:isDark?`0 8px 32px rgba(0,0,0,0.3),0 0 0 1px ${s.color}20`:`0 4px 20px ${s.color}15,0 1px 0 rgba(255,255,255,0.8)`,"
)

# Fix 5: Action cards - white glass with colored icon glow
src = src.replace(
    "background:atLimit?'rgba(248,113,113,0.05)':isDark?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.92)',\n                        backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',\n                        border:`1.5px solid ${atLimit?'#F87171':a.color}40`,",
    "background:atLimit?'rgba(248,113,113,0.05)':isDark?'rgba(255,255,255,0.10)':'rgba(255,255,255,0.95)',\n                        backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',\n                        border:`1.5px solid ${atLimit?'#F87171':a.color}50`,\n                        boxShadow:isDark?`0 4px 20px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.08)`:`0 2px 12px ${a.color}15,0 1px 0 rgba(255,255,255,0.9)`,"
)

# Fix 6: Action icon box - bright colored background
src = src.replace(
    "background:`${a.color}18`,display:'flex',\n                      alignItems:'center',justifyContent:'center',\n                      fontSize:20,marginBottom:8,\n                      boxShadow:`0 0 12px ${a.color}22`",
    "background:`linear-gradient(135deg,${a.color}35,${a.color}15)`,display:'flex',\n                      alignItems:'center',justifyContent:'center',\n                      fontSize:20,marginBottom:8,\n                      border:`1px solid ${a.color}40`,\n                      boxShadow:`0 0 20px ${a.color}44,inset 0 1px 0 rgba(255,255,255,0.15)`"
)

# Fix 7: Action card text always visible
src = src.replace(
    "color:atLimit?'#F87171':txt,fontWeight:700,fontSize:12,margin:'0 0 2px'",
    "color:atLimit?'#F87171':isDark?'#ffffff':txt,fontWeight:700,fontSize:12,margin:'0 0 2px'"
)
src = src.replace(
    "color:atLimit?'#F87171':muted,fontSize:9,margin:0",
    "color:atLimit?'#F87171':isDark?'rgba(255,255,255,0.65)':muted,fontSize:9,margin:0"
)

# Fix 8: Close button on upgrade CTA
src = src.replace(
    "!isPro&&sideVisible&&(",
    "!isPro&&sideVisible&&showUpgradeCTA&&("
)
src = src.replace(
    "const [collapsed,  setCollapsed]  = useState(false)",
    "const [collapsed,  setCollapsed]  = useState(false)\n  const [showUpgradeCTA, setShowUpgradeCTA] = useState(true)"
)

# Add close button to upgrade CTA
src = src.replace(
    "background:`linear-gradient(135deg,${accent}25,${accent}10)`,\n            border:`1px solid ${accent}45`,borderRadius:14,padding:'12px'",
    "background:`linear-gradient(135deg,${accent}25,${accent}10)`,\n            border:`1px solid ${accent}45`,borderRadius:14,padding:'12px',\n            position:'relative'"
)
src = src.replace(
    "<p style={{color:accent,fontWeight:700,fontSize:11,margin:'0 0 4px'}}>\n              ⚡ Upgrade to Pro\n            </p>",
    "<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>\n              <p style={{color:accent,fontWeight:700,fontSize:11,margin:0}}>⚡ Upgrade to Pro</p>\n              <button onClick={()=>setShowUpgradeCTA(false)} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:'50%',width:18,height:18,cursor:'pointer',color:'rgba(255,255,255,0.6)',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center',padding:0}}>✕</button>\n            </div>"
)

# Fix 9: Wire Upgrade ₹5/day in main content to Razorpay
src = src.replace(
    "background:`linear-gradient(135deg,${accent},${accentL})`,\n                  border:'none',borderRadius:10,padding:'7px 14px',\n                  color:primD,fontWeight:800,fontSize:11,cursor:'pointer',\n                  boxShadow:`0 4px 14px ${accent}33`}}>\n                  Upgrade ₹5/day →",
    "background:`linear-gradient(135deg,${accent},${accentL})`,\n                  border:'none',borderRadius:10,padding:'7px 14px',\n                  color:primD,fontWeight:800,fontSize:11,cursor:'pointer',\n                  boxShadow:`0 4px 14px ${accent}33`}}\n                  onClick={()=>setUpgradeFor('tests')}>\n                  Upgrade ₹5/day →"
)

# Fix 10: Leaderboard card always dark - never loses premium feel
src = src.replace(
    "background:`linear-gradient(135deg,${primD},${primary}88)`,\n              borderRadius:20,overflow:'hidden',marginBottom:20,",
    "background:`linear-gradient(135deg,#060D18,#0F1A2E)`,\n              borderRadius:20,overflow:'hidden',marginBottom:20,"
)

open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8').write(src)
print('Visual hierarchy fixed - cards pop, streak=fire, coins=gold, close button added')
