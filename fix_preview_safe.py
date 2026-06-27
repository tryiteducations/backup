src = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()

# Find EXACT old preview - from the working version
old = """                        {/* Theme preview */}
                        <div style={{
                          height: 70,
                          background: t.isDark
                            ? `linear-gradient(135deg,${t.primaryDark||t.primary||'#0F2140'},${t.accent||'#C9A84C'}88)`
                            : `linear-gradient(135deg,${t.bg||'#F8FAFC'},${t.accent||'#2563EB'}44)`,
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 28,
                          position: 'relative',
                        }}>
                          {t.emoji}"""

new = """                        {/* Theme preview — Mini Mockup */}
                        <div style={{
                          height:115, overflow:'hidden', position:'relative',
                          borderRadius:'12px 12px 0 0',
                          background:t.bg||'#F8FAFC',
                        }}>
                          <style>{`
                            @keyframes th-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
                            @keyframes th-pulse{0%,100%{opacity:1}50%{opacity:0.8}}
                            @keyframes th-float{0%,100%{transform:translateY(0);opacity:0.6}50%{transform:translateY(-6px);opacity:1}}
                          `}</style>
                          <div style={{position:'absolute',inset:0,zIndex:3,pointerEvents:'none',background:'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.18) 50%,transparent 65%)',backgroundSize:'300% 100%',animation:'th-shimmer 2.8s ease-in-out infinite'}}/>
                          <div style={{height:20,background:t.primary||'#1E3A5F',display:'flex',alignItems:'center',padding:'0 7px',gap:4}}>
                            <div style={{width:5,height:5,borderRadius:'50%',background:t.accent||'#C9A84C',boxShadow:'0 0 5px '+(t.accent||'#C9A84C')}}/>
                            <div style={{flex:1,height:2,borderRadius:2,background:'rgba(255,255,255,0.2)',maxWidth:32}}/>
                            <div style={{marginLeft:'auto',fontSize:8,color:'rgba(255,255,255,0.5)'}}>●</div>
                          </div>
                          <div style={{padding:'5px 7px',display:'flex',flexDirection:'column',gap:3}}>
                            <div style={{background:t.surface||'#fff',borderRadius:5,padding:'4px 6px',boxShadow:'0 1px 4px rgba(0,0,0,0.08)'}}>
                              <div style={{height:3,borderRadius:2,background:t.primary||'#1E3A5F',width:'55%',marginBottom:3,opacity:0.8}}/>
                              <div style={{height:2,borderRadius:2,background:t.isDark?'rgba(255,255,255,0.2)':'rgba(0,0,0,0.1)',width:'75%',marginBottom:2}}/>
                              <div style={{height:2,borderRadius:2,background:t.isDark?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.07)',width:'48%'}}/>
                            </div>
                            <div style={{display:'flex',gap:3,alignItems:'center'}}>
                              <div style={{flex:1,height:20,borderRadius:4,background:t.accent||'#C9A84C',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 6px '+(t.accent||'#C9A84C')+'44',animation:'th-pulse 2s ease-in-out infinite'}}>
                                <div style={{height:2,width:18,borderRadius:1,background:'rgba(255,255,255,0.95)'}}/>
                              </div>
                              <div style={{fontSize:12}}>{t.emoji}</div>
                            </div>
                          </div>
                          {[0,1,2,3].map(pi => (
                            <div key={pi} style={{position:'absolute',width:pi%2===0?3:2,height:pi%2===0?3:2,borderRadius:'50%',background:t.accent||'#C9A84C',left:(18+pi*19)+'%',bottom:(8+pi*9)+'%',opacity:0.6,animation:'th-float '+(1.6+pi*0.4)+'s ease-in-out '+(pi*0.3)+'s infinite',boxShadow:'0 0 4px '+(t.accent||'#C9A84C')}}/>
                          ))}
                          <div style={{display:'none'}}>{t.emoji}</div>"""

if old in src:
    src = src.replace(old, new)
    print("Preview replaced safely")
else:
    print("NOT FOUND")
    idx = src.find("Theme preview")
    print(repr(src[idx:idx+300]))

open("src/pages/student/StudentSettings.jsx", "w", encoding="utf-8").write(src)
