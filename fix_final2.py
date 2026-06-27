# ── FIX 1: Hero particles ──
src = open("src/components/landing/Hero.jsx", encoding="utf-8").read()

# Find exact style block
idx = src.find("@keyframes tryit-ring")
style_start = src.rfind("<style>{`", 0, idx)
style_end = src.find("`}</style>", idx) + 10
old_style = src[style_start:style_end]
print("Old style block found:", style_start, "to", style_end)
print(repr(old_style[:100]))

new_style = """<style>{`
        @keyframes tryit-ring{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.5}50%{transform:translate(-50%,-50%) scale(1.07);opacity:0.12}}
        @keyframes tryit-pulse{0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes float-up{0%{transform:translateY(0) scale(1);opacity:0.8}100%{transform:translateY(-100px) scale(0.2);opacity:0}}
        @keyframes spark{0%{transform:translate(0,0);opacity:1}100%{transform:translate(var(--dx),var(--dy));opacity:0}}
        @keyframes petal-fall{0%{transform:translateY(-10px) rotate(0deg);opacity:0.9}100%{transform:translateY(100px) rotate(200deg);opacity:0}}
        @keyframes ray-out{0%{transform:scale(0);opacity:0.9}100%{transform:scale(2.5);opacity:0}}
        @keyframes theme-label-in{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ── Floating Particles per Cycle ── */}
      {particles && particles.map(p => (
        <div key={p.id} style={{
          position:'absolute', pointerEvents:'none', zIndex:1,
          width:p.size, height:p.size, borderRadius:'50%',
          background:p.color, opacity:p.opacity,
          left:p.x+'%', top:p.y+'%',
          boxShadow:'0 0 '+(p.size*2)+'px '+p.color,
          animation: C && C.motionType==='sparks'
            ? 'spark 1.8s ease-out '+p.delay+'s infinite'
            : C && C.motionType==='rays'
            ? 'ray-out 2.2s ease-out '+p.delay+'s infinite'
            : C && C.motionType==='petals'
            ? 'petal-fall 3s ease-in '+p.delay+'s infinite'
            : 'float-up '+(2+p.delay)+'s ease-out '+p.delay+'s infinite',
          '--dx': (Math.random()>0.5?'':'-')+(20+Math.round(Math.random()*40))+'px',
          '--dy': '-'+(20+Math.round(Math.random()*40))+'px',
        }}/>
      ))}

      {/* ── Progress Bar + Cycle Dots ── */}
      {typeof cycleIdx !== 'undefined' && C && (
        <div style={{
          position:'absolute', bottom:20, left:'50%',
          transform:'translateX(-50%)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:6,
          zIndex:10, pointerEvents:'none',
        }}>
          <div style={{
            fontSize:10, fontWeight:600, letterSpacing:'0.8px',
            color:C.text==='#111827'?'rgba(0,0,0,0.45)':'rgba(255,255,255,0.5)',
            animation:'theme-label-in 0.5s ease',
          }}>{C.label}</div>
          <div style={{
            width:100, height:3, borderRadius:2,
            background:C.text==='#111827'?'rgba(0,0,0,0.1)':'rgba(255,255,255,0.15)',
            overflow:'hidden',
          }}>
            <div style={{
              height:'100%', borderRadius:2,
              background:C.accent,
              width:progress+'%',
              transition:'width 0.05s linear',
              boxShadow:'0 0 6px '+C.accent,
            }}/>
          </div>
          <div style={{display:'flex',gap:5}}>
            {CYCLES.map((_,i) => (
              <div key={i} style={{
                width:i===cycleIdx?16:5, height:5, borderRadius:3,
                background:i===cycleIdx?C.accent:(C.text==='#111827'?'rgba(0,0,0,0.18)':'rgba(255,255,255,0.25)'),
                transition:'all 0.3s ease',
                boxShadow:i===cycleIdx?'0 0 6px '+C.accent:'none',
              }}/>
            ))}
          </div>
        </div>
      )}"""

src = src[:style_start] + new_style + src[style_end:]
open("src/components/landing/Hero.jsx", "w", encoding="utf-8").write(src)
print("Hero particles + progress bar: DONE")

# ── FIX 2: Theme preview mockup ──
src2 = open("src/pages/student/StudentSettings.jsx", encoding="utf-8").read()

# Find exact preview block
idx2 = src2.find("Theme preview")
block_start = src2.rfind("<div style={{", 0, idx2+50)

# Find end of the emoji div
emoji_idx = src2.find("{t.emoji}", idx2)
# Find the closing of that block
close_idx = src2.find("</div>", emoji_idx) + 6
old_preview = src2[block_start:close_idx]
print("\nOld preview block:")
print(repr(old_preview[:200]))

new_preview = """<div style={{
                          height:115, overflow:'hidden', position:'relative',
                          borderRadius:'12px 12px 0 0',
                          background:t.bg||'#F8FAFC',
                          fontFamily:'Inter,sans-serif',
                        }}>
                          {/* shimmer */}
                          <div style={{
                            position:'absolute',inset:0,zIndex:3,pointerEvents:'none',
                            background:'linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.2) 50%,transparent 65%)',
                            backgroundSize:'300% 100%',animation:'th-shimmer 2.8s ease-in-out infinite',
                          }}/>
                          {/* navbar */}
                          <div style={{height:20,background:t.primary||'#1E3A5F',display:'flex',alignItems:'center',padding:'0 7px',gap:4}}>
                            <div style={{width:5,height:5,borderRadius:'50%',background:t.accent||'#C9A84C',boxShadow:'0 0 5px '+(t.accent||'#C9A84C')}}/>
                            <div style={{flex:1,height:2,borderRadius:2,background:'rgba(255,255,255,0.22)',maxWidth:32}}/>
                            <div style={{marginLeft:'auto',fontSize:8,opacity:0.7}}>●</div>
                          </div>
                          {/* card */}
                          <div style={{padding:'5px 7px',display:'flex',flexDirection:'column',gap:3}}>
                            <div style={{background:t.surface||'#fff',borderRadius:5,padding:'4px 6px',boxShadow:'0 1px 5px rgba(0,0,0,0.09)'}}>
                              <div style={{height:3,borderRadius:2,background:t.primary||'#1E3A5F',width:'55%',marginBottom:3,opacity:0.8}}/>
                              <div style={{height:2,borderRadius:2,background:t.isDark?'rgba(255,255,255,0.22)':'rgba(0,0,0,0.1)',width:'75%',marginBottom:2}}/>
                              <div style={{height:2,borderRadius:2,background:t.isDark?'rgba(255,255,255,0.13)':'rgba(0,0,0,0.07)',width:'48%'}}/>
                            </div>
                            <div style={{display:'flex',gap:3,alignItems:'center'}}>
                              <div style={{flex:1,height:20,borderRadius:4,background:t.accent||'#C9A84C',display:'flex',alignItems:'center',justifyContent:'center',animation:'th-pulse 2s ease-in-out infinite',boxShadow:'0 2px 8px '+(t.accent||'#C9A84C')+'55'}}>
                                <div style={{height:2,width:18,borderRadius:1,background:'rgba(255,255,255,0.95)'}}/>
                              </div>
                              <div style={{fontSize:12,lineHeight:1}}>{t.emoji}</div>
                            </div>
                          </div>
                          {/* floating dots */}
                          {[0,1,2,3].map(pi => (
                            <div key={pi} style={{
                              position:'absolute',
                              width:pi%2===0?3:2,height:pi%2===0?3:2,
                              borderRadius:'50%',background:t.accent||'#C9A84C',
                              left:(18+pi*19)+'%',bottom:(8+pi*9)+'%',
                              opacity:0.65,
                              animation:'th-float '+(1.6+pi*0.45)+'s ease-in-out '+(pi*0.35)+'s infinite',
                              boxShadow:'0 0 5px '+(t.accent||'#C9A84C'),
                            }}/>
                          ))}
                          <style>{`
                            @keyframes th-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
                            @keyframes th-pulse{0%,100%{opacity:1;transform:scaleX(1)}50%{opacity:0.82;transform:scaleX(0.96)}}
                            @keyframes th-float{0%,100%{transform:translateY(0);opacity:0.65}50%{transform:translateY(-7px);opacity:1}}
                          `}</style>
                        </div>"""

if old_preview:
    src2 = src2[:block_start] + new_preview + src2[close_idx:]
    open("src/pages/student/StudentSettings.jsx", "w", encoding="utf-8").write(src2)
    print("Preview mockup: DONE")
else:
    print("Preview block not found")
