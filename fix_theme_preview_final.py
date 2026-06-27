src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()

# Find exact preview block and replace with mini mockup
OLD = """Theme preview — Mini Mockup */}
                        <div style={{
                          height: 110,
                          background: t.bg || '#F8FAFC',
                          display: 'flex', flexDirection: 'column',
                          overflow: 'hidden', position: 'relative',
  fontSize: 28,
                          position: 'relative',
                        }}>
          {t.emoji}"""

NEW = """Theme preview — Mini Mockup */}
                        <div style={{
                          height: 110,
                          background: t.bg || '#F8FAFC',
                          overflow: 'hidden', position: 'relative',
                          borderRadius: '12px 12px 0 0',
                          fontFamily: 'Inter,sans-serif',
                        }}>
                          {/* Animated shimmer */}
                          <div style={{
                            position:'absolute', inset:0, zIndex:3,
                            background:'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.18) 50%,transparent 60%)',
                            backgroundSize:'200% 100%',
                            animation:'shimmer 2.5s ease-in-out infinite',
                            pointerEvents:'none',
                          }}/>
                          {/* Navbar */}
                          <div style={{
                            height:20, background:t.primary||'#1E3A5F',
                            display:'flex', alignItems:'center',
                            padding:'0 8px', gap:4,
                          }}>
                            <div style={{width:5,height:5,borderRadius:'50%',background:t.accent||'#C9A84C',boxShadow:"0 0 4px " + (t.accent||'#C9A84C')}}/>
                            <div style={{flex:1,height:2,borderRadius:2,background:'rgba(255,255,255,0.2)',maxWidth:35}}/>
                            <div style={{width:5,height:5,borderRadius:'50%',background:'rgba(255,255,255,0.35)',marginLeft:'auto'}}/>
                          </div>
                          {/* Content */}
                          <div style={{padding:'5px 7px',display:'flex',flexDirection:'column',gap:3}}>
                            {/* Card */}
                            <div style={{
                              background:t.surface||'#FFFFFF',
                              borderRadius:5,padding:'4px 6px',
                              boxShadow:'0 1px 4px rgba(0,0,0,0.1)',
                            }}>
                              <div style={{height:3,borderRadius:2,background:t.primary||'#1E3A5F',width:'55%',marginBottom:3,opacity:0.85}}/>
                              <div style={{height:2,borderRadius:2,background:t.isDark?'rgba(255,255,255,0.25)':'rgba(0,0,0,0.12)',width:'75%',marginBottom:2}}/>
                              <div style={{height:2,borderRadius:2,background:t.isDark?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.08)',width:'50%'}}/>
                            </div>
                            {/* Stats row */}
                            <div style={{display:'flex',gap:3}}>
                              <div style={{
                                flex:1,height:22,borderRadius:4,
                                background:t.accent||'#C9A84C',
                                display:'flex',alignItems:'center',justifyContent:'center',
                                boxShadow:"0 2px 6px " + (t.accent||'#C9A84C') + "55",
                                animation:'pulse-btn 2s ease-in-out infinite',
                              }}>
                                <div style={{height:2,width:20,borderRadius:1,background:'rgba(255,255,255,0.95)'}}/>
                              </div>
                              <div style={{
                                width:22,height:22,borderRadius:4,
                                background:t.isDark?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.06)',
                                display:'flex',alignItems:'center',justifyContent:'center',
                                fontSize:10,
                              }}>{t.emoji}</div>
                            </div>
                          </div>
                          {/* Floating particles */}
                          {[...Array(4)].map((_,pi) => (
                            <div key={pi} style={{
                              position:'absolute',
                              width: pi%2===0 ? 3 : 2,
                              height: pi%2===0 ? 3 : 2,
                              borderRadius:'50%',
                              background: t.accent||'#C9A84C',
                              left: (20 + pi*20) + '%',
                              bottom: (10 + pi*8) + '%',
                              opacity:0.6,
                              animation:"float-particle " + (1.5+pi*0.4) + "s ease-in-out " + (pi*0.3) + "s infinite",
                              boxShadow:"0 0 4px " + (t.accent||'#C9A84C'),
                            }}/>
                          ))}
                        </div>
                        {/* ── CSS animations ── */}
                        <style>{`
                          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
                          @keyframes pulse-btn{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.85;transform:scale(0.97)}}
                          @keyframes float-particle{0%,100%{transform:translateY(0);opacity:0.6}50%{transform:translateY(-6px);opacity:1}}
                          @keyframes glitter{0%{transform:scale(0) rotate(0deg);opacity:1}100%{transform:scale(2) rotate(180deg);opacity:0}}
                        `}</style>
                        <div style={{display:'none'}} /* emoji placeholder */>{t.emoji}</div>"""

if OLD in src:
    src = src.replace(OLD, NEW)
    print("Preview replaced with mini mockup")
else:
    print("NOT FOUND - searching")
    idx = src.find("Theme preview")
    print(repr(src[idx:idx+200]))

open("src/pages/student/StudentSettings.jsx", "w", encoding="utf-8").write(src)
print("Done")
