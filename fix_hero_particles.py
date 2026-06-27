src = open("src/components/landing/Hero.jsx", encoding="utf-8").read()

# Add particles + progress bar + cycle colors to existing section
# Find the style block and add animations
old_style = """      <style>{`
        @keyframes tryit-ring{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.5}50%{transform:translate(-50%,-
        @keyframes tryit-pulse{0%,100%{opacity:0.5}50%{opacity:1}}
      `}</style>"""

new_style = """      <style>{`
        @keyframes tryit-ring{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.5}50%{transform:translate(-50%,-50%) scale(1.04);opacity:0.8}}
        @keyframes tryit-pulse{0%,100%{opacity:0.5}50%{opacity:1}}
        @keyframes float-up{0%{transform:translateY(0) scale(1);opacity:0.7}100%{transform:translateY(-80px) scale(0.3);opacity:0}}
        @keyframes spark{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0}}
        @keyframes ray-expand{0%{transform:scaleX(0);opacity:0.8}100%{transform:scaleX(1.5);opacity:0}}
        @keyframes petal-fall{0%{transform:translateY(-20px) rotate(0deg);opacity:0.8}100%{transform:translateY(120px) rotate(180deg);opacity:0}}
        @keyframes cycle-progress{0%{width:0%}100%{width:100%}}
        @keyframes glitter-burst{0%{transform:scale(0) rotate(0deg);opacity:1}100%{transform:scale(3) rotate(360deg);opacity:0}}
        @keyframes theme-label-in{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ── Cycle Particles ── */}
      {particles.map(p => (
        <div key={p.id} style={{
          position:'absolute', pointerEvents:'none', zIndex:1,
          width: p.size, height: p.size, borderRadius:'50%',
          background: p.color, opacity: p.opacity,
          left: p.x + '%', top: p.y + '%',
          boxShadow: "0 0 " + (p.size*2) + "px " + p.color,
          animation: C.motionType === 'sparks'
            ? "spark 1.5s ease-out " + p.delay + "s infinite"
            : C.motionType === 'rays'
            ? "ray-expand 2s ease-out " + p.delay + "s infinite"
            : C.motionType === 'petals'
            ? "petal-fall 3s ease-in " + p.delay + "s infinite"
            : "float-up " + (2 + p.delay) + "s ease-out " + p.delay + "s infinite",
          '--dx': (Math.random()>0.5?'':'-') + Math.round(20+Math.random()*40) + 'px',
          '--dy': '-' + Math.round(20+Math.random()*40) + 'px',
        }}/>
      ))}

      {/* ── Theme Cycle Label + Progress Bar ── */}
      <div style={{
        position:'absolute', bottom:24, left:'50%',
        transform:'translateX(-50%)',
        display:'flex', flexDirection:'column', alignItems:'center', gap:8,
        zIndex:10, pointerEvents:'none',
      }}>
        <div style={{
          fontSize:11, fontWeight:600, letterSpacing:'0.5px',
          color: C.text === '#111827' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
          animation:'theme-label-in 0.6s ease',
          key: cycleIdx,
        }}>{C.label}</div>
        <div style={{
          width:120, height:3, borderRadius:2,
          background: C.text === '#111827' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)',
          overflow:'hidden',
        }}>
          <div style={{
            height:'100%', borderRadius:2,
            background: C.accent,
            width: progress + '%',
            transition:'width 0.05s linear',
            boxShadow:"0 0 6px " + C.accent,
          }}/>
        </div>
        {/* Cycle dots */}
        <div style={{display:'flex',gap:6}}>
          {CYCLES.map((_,i) => (
            <div key={i} onClick={() => {
              setTextVisible(false)
              setTimeout(() => {
                setCycleIdx(i)
                setHeroText(CYCLES[i].hero)
                setParticles(genParticles(CYCLES[i].motionType, CYCLES[i].particleColor))
                setProgress(0)
                setTimeout(() => setTextVisible(true), 100)
              }, 300)
            }} style={{
              width: i===cycleIdx ? 18 : 6,
              height:6, borderRadius:3,
              background: i===cycleIdx ? C.accent : (C.text === '#111827' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'),
              transition:'all 0.3s ease',
              cursor:'pointer', pointerEvents:'all',
              boxShadow: i===cycleIdx ? "0 0 8px " + C.accent : 'none',
            }}/>
          ))}
        </div>
      </div>"""

if "@keyframes tryit-ring" in src:
    # Replace just the style content
    src = src.replace(
        """      <style>{`
        @keyframes tryit-ring{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.5}50%{transform:translate(-50%,-
        @keyframes tryit-pulse{0%,100%{opacity:0.5}50%{opacity:1}}
      `}</style>""",
        new_style
    )
    print("Hero particles + progress bar added")
else:
    print("Style block not found exactly - trying partial")
    idx = src.find("@keyframes tryit-ring")
    print(repr(src[idx-20:idx+100]))

open("src/components/landing/Hero.jsx", "w", encoding="utf-8").write(src)
print("Done")
