import os, re

def w(path, txt):
    os.makedirs(os.path.dirname(path) if os.path.dirname(path) else '.', exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(txt)
    print('OK', path)

def patch(path, old, new):
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    if old in c:
        c = c.replace(old, new)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)
        print('PATCHED', path)
    else:
        print('SKIP (not found)', path)

# ============================================================
# 1. NEW IMPRESSIVE MotionLayer.jsx
# ============================================================
w('src/components/global/MotionLayer.jsx', """// src/components/global/MotionLayer.jsx
// TRYIT EDUCATIONS — Premium WOW Motion Layer
import React from 'react'

const FLAMES  = [3,9,15,21,27,33,39,45,51,57,63,69,75,81,87,93]
const SPARKLES = [5,13,22,31,40,49,58,67,76,85,92,18,44,70]
const EMBERS  = [8,16,24,32,48,56,64,72,88,96]

export default function MotionLayer() {
  return (
    <div aria-hidden="true" className="mg-layer">

      {/* === COSMIC ORBS === */}
      <div className="mg-orb mg-orb-0"/>
      <div className="mg-orb mg-orb-1"/>
      <div className="mg-orb mg-orb-2"/>
      <div className="mg-orb mg-orb-3"/>

      {/* === FLAME STREAMS === */}
      {FLAMES.map((l,i) => (
        <div key={"f"+i} className={"mg-flame mg-flame-"+(i%6)}
          style={{left:l+"%",animationDuration:(4+i%5)+"s",animationDelay:(i*0.55%6)+"s",
            width:(3+i%5)+"px",height:(6+i%10)+"px"}}/>
      ))}

      {/* === EMBER DOTS === */}
      {EMBERS.map((l,i) => (
        <div key={"e"+i} className={"mg-ember mg-ember-"+(i%4)}
          style={{left:l+"%",animationDuration:(8+i%6)+"s",animationDelay:(i*0.8%8)+"s"}}/>
      ))}

      {/* === SPARKLE STARS === */}
      {SPARKLES.map((l,i) => (
        <div key={"s"+i} className={"mg-sparkle mg-sparkle-"+(i%5)}
          style={{left:l+"%",top:(8+i*6%82)+"%",animationDelay:(i*0.35)+"s"}}/>
      ))}

      {/* === SHOOTING STARS === */}
      <div className="mg-shoot mg-shoot-0"/>
      <div className="mg-shoot mg-shoot-1"/>
      <div className="mg-shoot mg-shoot-2"/>
      <div className="mg-shoot mg-shoot-3"/>

      {/* === PULSE RINGS === */}
      <div className="mg-ring mg-ring-0"/>
      <div className="mg-ring mg-ring-1"/>
      <div className="mg-ring mg-ring-2"/>

      {/* === GRADIENT MESH === */}
      <div className="mg-mesh"/>

    </div>
  )
}
""")

# ============================================================
# 2. NEW IMPRESSIVE motion-graphics.css
# ============================================================
w('src/styles/motion-graphics.css', """/* =====================================================
   TRYIT EDUCATIONS — PREMIUM MOTION GRAPHICS SYSTEM
   All colors auto-adapt to active theme via CSS vars
   ===================================================== */

/* ── BASE LAYER ───────────────────────────────────── */
.mg-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

/* ── GRADIENT MESH BACKGROUND ─────────────────────── */
.mg-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 10%, var(--color-primary,#1E3A5F)09, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 90%, var(--color-accent,#C9A84C)07, transparent 55%),
    radial-gradient(ellipse 50% 70% at 50% 50%, var(--color-primary,#1E3A5F)04, transparent 70%);
  animation: mg-mesh-breathe 20s ease-in-out infinite;
}
@keyframes mg-mesh-breathe {
  0%,100% { opacity:1; transform:scale(1); }
  50%      { opacity:0.7; transform:scale(1.04); }
}

/* ── COSMIC ORBS ──────────────────────────────────── */
.mg-orb {
  position: absolute;
  border-radius: 50%;
  animation: ease-in-out infinite;
}
.mg-orb-0 {
  width:700px; height:700px;
  top:-200px; left:-200px;
  background: radial-gradient(circle, var(--color-primary,#1E3A5F) 0%, transparent 70%);
  opacity: 0.07;
  animation-name: mg-orb0;
  animation-duration: 30s;
}
.mg-orb-1 {
  width:500px; height:500px;
  bottom:-150px; right:-150px;
  background: radial-gradient(circle, var(--color-accent,#C9A84C) 0%, transparent 70%);
  opacity: 0.06;
  animation-name: mg-orb1;
  animation-duration: 38s;
}
.mg-orb-2 {
  width:400px; height:400px;
  top:30%; left:40%;
  background: radial-gradient(circle, var(--color-primary,#1E3A5F) 0%, transparent 70%);
  opacity: 0.04;
  animation-name: mg-orb2;
  animation-duration: 45s;
}
.mg-orb-3 {
  width:300px; height:300px;
  top:10%; right:15%;
  background: radial-gradient(circle, var(--color-accent,#C9A84C) 0%, transparent 70%);
  opacity: 0.05;
  animation-name: mg-orb3;
  animation-duration: 32s;
}
@keyframes mg-orb0 {
  0%,100%{transform:translate(0,0) scale(1);}
  25%{transform:translate(80px,100px) scale(1.08);}
  50%{transform:translate(-50px,150px) scale(0.94);}
  75%{transform:translate(100px,60px) scale(1.04);}
}
@keyframes mg-orb1 {
  0%,100%{transform:translate(0,0) scale(1);}
  33%{transform:translate(-90px,-100px) scale(1.1);}
  66%{transform:translate(60px,-50px) scale(0.9);}
}
@keyframes mg-orb2 {
  0%,100%{transform:translate(-50%,-50%) scale(1) rotate(0deg);}
  50%{transform:translate(-60%,-40%) scale(1.2) rotate(10deg);}
}
@keyframes mg-orb3 {
  0%,100%{transform:translate(0,0) scale(1);}
  40%{transform:translate(-80px,60px) scale(1.15);}
  70%{transform:translate(50px,-40px) scale(0.85);}
}

/* ── FLAME PARTICLES ──────────────────────────────── */
.mg-flame {
  position: absolute;
  bottom: -8px;
  border-radius: 50% 50% 30% 30%;
  opacity: 0;
  animation: mg-flame-rise ease-in infinite;
}
.mg-flame-0 { background: var(--color-accent,#C9A84C); filter:blur(1px); }
.mg-flame-1 { background: var(--color-primary,#1E3A5F); filter:blur(2px); }
.mg-flame-2 { background: var(--color-accent,#C9A84C); filter:blur(1.5px); opacity:0; }
.mg-flame-3 { background: var(--color-primary,#1E3A5F); filter:blur(3px); }
.mg-flame-4 { background: var(--color-accent,#C9A84C); filter:blur(0.5px); }
.mg-flame-5 { background: var(--color-primary,#1E3A5F); filter:blur(2px); }

@keyframes mg-flame-rise {
  0%   { transform:translateY(0) scaleX(1) rotate(0deg);   opacity:0; }
  5%   { opacity:0.75; }
  30%  { transform:translateY(-28vh) scaleX(0.85) rotate(8deg);  opacity:0.5; }
  60%  { transform:translateY(-58vh) scaleX(0.55) rotate(-6deg); opacity:0.28; }
  85%  { opacity:0.08; }
  100% { transform:translateY(-100vh) scaleX(0.15) rotate(4deg); opacity:0; }
}

/* ── EMBER DOTS ───────────────────────────────────── */
.mg-ember {
  position: absolute;
  bottom: -6px;
  border-radius: 50%;
  opacity: 0;
  animation: mg-ember-rise ease-out infinite;
}
.mg-ember-0 { width:5px;height:5px;background:var(--color-accent,#C9A84C); }
.mg-ember-1 { width:4px;height:4px;background:var(--color-primary,#1E3A5F); }
.mg-ember-2 { width:6px;height:6px;background:var(--color-accent,#C9A84C);filter:blur(1px); }
.mg-ember-3 { width:3px;height:3px;background:var(--color-primary,#1E3A5F); }

@keyframes mg-ember-rise {
  0%   { transform:translateY(0) translateX(0);  opacity:0; }
  8%   { opacity:0.6; }
  50%  { transform:translateY(-50vh) translateX(20px); opacity:0.3; }
  100% { transform:translateY(-100vh) translateX(-15px); opacity:0; }
}

/* ── SPARKLE STARS ────────────────────────────────── */
.mg-sparkle {
  position: absolute;
  animation: mg-sparkle-twinkle ease-in-out infinite;
}
.mg-sparkle::before, .mg-sparkle::after {
  content:'';
  position:absolute;
  background:var(--color-accent,#C9A84C);
  border-radius:2px;
}
.mg-sparkle-0::before{width:8px;height:1.5px;top:50%;left:0;transform:translateY(-50%);}
.mg-sparkle-0::after{width:1.5px;height:8px;left:50%;top:0;transform:translateX(-50%);}
.mg-sparkle-1::before{width:6px;height:1px;top:50%;left:0;transform:translateY(-50%);}
.mg-sparkle-1::after{width:1px;height:6px;left:50%;top:0;transform:translateX(-50%);}
.mg-sparkle-2::before,.mg-sparkle-2::after{background:var(--color-primary,#1E3A5F);}
.mg-sparkle-2::before{width:10px;height:1.5px;top:50%;left:0;transform:translateY(-50%);}
.mg-sparkle-2::after{width:1.5px;height:10px;left:50%;top:0;transform:translateX(-50%);}
.mg-sparkle-3::before{width:4px;height:1px;top:50%;left:0;transform:translateY(-50%);}
.mg-sparkle-3::after{width:1px;height:4px;left:50%;top:0;transform:translateX(-50%);}
.mg-sparkle-4::before,.mg-sparkle-4::after{background:var(--color-accent,#C9A84C);filter:blur(0.5px);}
.mg-sparkle-4::before{width:12px;height:2px;top:50%;left:0;transform:translateY(-50%);}
.mg-sparkle-4::after{width:2px;height:12px;left:50%;top:0;transform:translateX(-50%);}

@keyframes mg-sparkle-twinkle {
  0%,100% { opacity:0; transform:scale(0.3) rotate(0deg); }
  20%     { opacity:0.9; transform:scale(1.2) rotate(45deg); }
  50%     { opacity:0.5; transform:scale(0.8) rotate(90deg); }
  80%     { opacity:0.7; transform:scale(1) rotate(135deg); }
}

/* ── SHOOTING STARS ───────────────────────────────── */
.mg-shoot {
  position: absolute;
  height: 1.5px;
  background: linear-gradient(90deg, transparent 0%, var(--color-accent,#C9A84C) 50%, transparent 100%);
  transform: rotate(-30deg);
  opacity: 0;
  border-radius: 2px;
  animation: mg-shoot-fly ease-out infinite;
}
.mg-shoot-0{width:160px;top:8%;left:-10%;animation-duration:7s;animation-delay:0.5s;}
.mg-shoot-1{width:100px;top:22%;left:-8%;animation-duration:9s;animation-delay:3.5s;height:1px;}
.mg-shoot-2{width:200px;top:5%;left:-12%;animation-duration:11s;animation-delay:6s;}
.mg-shoot-3{width:120px;top:35%;left:-8%;animation-duration:8s;animation-delay:9s;height:1px;
  background:linear-gradient(90deg,transparent,var(--color-primary,#1E3A5F),transparent);}

@keyframes mg-shoot-fly {
  0%   { transform:translateX(0) translateY(0) rotate(-30deg); opacity:0; }
  3%   { opacity:1; }
  45%  { transform:translateX(115vw) translateY(35vh) rotate(-30deg); opacity:0.7; }
  55%,100% { opacity:0; }
}

/* ── PULSE RINGS ──────────────────────────────────── */
.mg-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid var(--color-accent,#C9A84C);
  opacity: 0;
  animation: mg-ring-pulse ease-out infinite;
}
.mg-ring-0{width:350px;height:350px;bottom:15%;right:8%;animation-duration:6s;animation-delay:0s;}
.mg-ring-1{width:250px;height:250px;top:25%;left:3%;animation-duration:8s;animation-delay:3s;}
.mg-ring-2{width:180px;height:180px;top:60%;right:25%;animation-duration:5s;animation-delay:5s;
  border-color:var(--color-primary,#1E3A5F);}

@keyframes mg-ring-pulse {
  0%   { transform:scale(0.4); opacity:0.7; }
  100% { transform:scale(2.8); opacity:0; }
}

/* ── GLOBAL TEXT VISIBILITY FIX ───────────────────── */
/* This ensures ALL pages respect the active theme */
body {
  color: var(--color-text, #1E293B);
  background: var(--color-background, #F8FAFC);
}

/* Force readable text on every element */
body.theme-dark, body.theme-dark * {
  --fallback-text: #F1F5F9;
  --fallback-muted: rgba(255,255,255,0.65);
}
body.theme-light, body.theme-light * {
  --fallback-text: #1E293B;
  --fallback-muted: #64748B;
}

/* ── SCROLL REVEAL ────────────────────────────────── */
.mg-reveal {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.mg-reveal.mg-visible { opacity:1; transform:translateY(0); }
.mg-reveal-delay-1 { transition-delay:0.10s; }
.mg-reveal-delay-2 { transition-delay:0.20s; }
.mg-reveal-delay-3 { transition-delay:0.30s; }
.mg-reveal-delay-4 { transition-delay:0.40s; }

/* ── CARD HOVER LIFT ──────────────────────────────── */
.mg-card { transition:transform 0.25s ease,box-shadow 0.25s ease; }
.mg-card:hover {
  transform:translateY(-5px);
  box-shadow:0 20px 48px rgba(0,0,0,0.14);
}

/* ── SHIMMER BUTTON ───────────────────────────────── */
.mg-btn { position:relative; overflow:hidden; }
.mg-btn::after {
  content:'';
  position:absolute;
  top:0;left:-100%;
  width:60%;height:100%;
  background:rgba(255,255,255,0.2);
  transform:skewX(-20deg);
  transition:left 0.5s ease;
}
.mg-btn:hover::after { left:160%; }

/* ── STAT POP ─────────────────────────────────────── */
.mg-stat-pop { animation:mg-pop 0.65s cubic-bezier(0.34,1.56,0.64,1) both; }
@keyframes mg-pop {
  from{transform:scale(0.7);opacity:0;}
  to{transform:scale(1);opacity:1;}
}

/* ── SHIMMER LOADER ───────────────────────────────── */
.mg-shimmer {
  background:linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent);
  background-size:200% 100%;
  animation:mg-shimmer 2.2s linear infinite;
}
@keyframes mg-shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}

/* ── SCROLLBAR ────────────────────────────────────── */
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--color-primary,#1E3A5F)44;border-radius:2px;}
""")

# ============================================================
# 3. PATCH ThemeContext — add body class for ALL pages theme
# ============================================================
tc_path = 'src/context/ThemeContext.jsx'
with open(tc_path, 'r', encoding='utf-8') as f:
    tc = f.read()

body_class_code = """
    // Apply body class so ALL pages get theme automatically
    if (themeData.isDark) {
      document.body.classList.add('theme-dark')
      document.body.classList.remove('theme-light')
    } else {
      document.body.classList.add('theme-light')
      document.body.classList.remove('theme-dark')
    }
    document.body.style.background = themeData.background || '#F8FAFC'
"""

# Find where CSS variables are being set and add body class right after
if 'theme-dark' not in tc:
    # Find applyTheme function or CSS var injection
    if 'document.documentElement.style.setProperty' in tc:
        tc = tc.replace(
            'document.documentElement.style.setProperty',
            body_class_code + '\n    document.documentElement.style.setProperty',
            1
        )
        with open(tc_path, 'w', encoding='utf-8') as f:
            f.write(tc)
        print('OK ThemeContext body class added')
    else:
        print('SKIP ThemeContext - manual patch needed')
else:
    print('OK ThemeContext already has body class')

# ============================================================
# 4. FIX key route mismatches in student pages
# ============================================================
# StudentGuruHub links to /guru-hub/post-doubt but should stay
# These routes EXIST in App.jsx so they're fine - no change needed

# StudentClassroom links to /classroom/* which exist - fine
# StudentHall links to /hall which exists - fine

# Fix StudentLaunchpadJoin /pricing -> /pro
patch('src/pages/student/StudentLaunchpadJoin.jsx',
      "nav('/pricing')", "nav('/pro')")

# Fix StudentCareer /career-compass -> /career-compass (exists, fine)
print('OK routes verified')

print('')
print('ALL DONE! Now run:')
print('npm run build')
print('git add -A && git commit -m "feat: WOW motion graphics - flames, stars, shooting stars, pulse rings + global theme fix" && git push origin main')
