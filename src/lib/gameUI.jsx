// src/lib/gameUI.jsx
// Premium Game UI Engine — Dopamine mechanics, visual hierarchy, micro-rewards
// Apply to ALL games for consistent premium feel

import { useState, useEffect, useRef, useCallback } from 'react'

// ── PARTICLE BURST on correct answer ─────────────────────────────
export function ParticleBurst({ active, color='#FFD700', x=50, y=50 }) {
  if (!active) return null
  const particles = Array.from({length:12}, (_,i) => ({
    angle: (i/12)*360,
    dist: 40 + Math.random()*40,
    size: 4 + Math.random()*6,
  }))
  return (
    <div style={{ position:'fixed', left:0, top:0, width:'100%', height:'100%',
      pointerEvents:'none', zIndex:9999, overflow:'hidden' }}>
      {particles.map((p,i) => (
        <div key={i} style={{
          position:'absolute',
          left:`${x}%`, top:`${y}%`,
          width:p.size, height:p.size,
          borderRadius:'50%',
          background: i%3===0?color:i%3===1?'#fff':'#FF6B35',
          animation:`particle-fly-${i} 0.8s ease-out forwards`,
        }}/>
      ))}
      <style>{`
        ${particles.map((p,i) => `
          @keyframes particle-fly-${i} {
            0%   { transform: translate(0,0) scale(1); opacity:1; }
            100% { transform: translate(
              ${Math.cos(p.angle*Math.PI/180)*p.dist}px,
              ${Math.sin(p.angle*Math.PI/180)*p.dist}px
            ) scale(0); opacity:0; }
          }
        `).join('')}
      `}</style>
    </div>
  )
}

// ── COMBO FIRE DISPLAY ───────────────────────────────────────────
export function ComboFire({ combo }) {
  if (combo < 2) return null
  const colors = ['','','#FF6B35','#FF4500','#FF0000','#FF0000']
  const c = colors[Math.min(combo, 5)] || '#FF0000'
  return (
    <div style={{
      position:'fixed', top:80, right:20, zIndex:1000,
      background:`linear-gradient(135deg,${c}22,${c}11)`,
      border:`2px solid ${c}`,
      borderRadius:20, padding:'8px 16px',
      display:'flex', alignItems:'center', gap:8,
      animation:'combo-pop 0.3s cubic-bezier(0.23,1,0.32,1)',
      boxShadow:`0 0 20px ${c}44`,
    }}>
      <span style={{ fontSize:20 }}>🔥</span>
      <div>
        <p style={{ color:c, fontFamily:'Poppins,sans-serif',
          fontWeight:900, fontSize:18, margin:0 }}>{combo}x COMBO!</p>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:10, margin:0 }}>Keep going!</p>
      </div>
      <style>{`
        @keyframes combo-pop {
          0%  { transform:scale(0.5) rotate(-10deg); opacity:0; }
          60% { transform:scale(1.2) rotate(3deg); }
          100%{ transform:scale(1) rotate(0deg); opacity:1; }
        }
      `}</style>
    </div>
  )
}

// ── SCORE POPUP ──────────────────────────────────────────────────
export function ScorePopup({ points, correct, x=50, y=40 }) {
  if (points === null) return null
  return (
    <div style={{
      position:'fixed', left:`${x}%`, top:`${y}%`,
      transform:'translate(-50%,-50%)',
      zIndex:9998, pointerEvents:'none',
      animation:'score-float 1.2s ease-out forwards',
    }}>
      <p style={{
        fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:28,
        color: correct ? '#4ADE80' : '#F87171',
        textShadow: correct ? '0 0 20px #4ADE8088' : '0 0 20px #F8717188',
        margin:0, whiteSpace:'nowrap',
      }}>
        {correct ? `+${points}` : '✕'}
      </p>
      <style>{`
        @keyframes score-float {
          0%   { transform:translate(-50%,-50%) scale(0.5); opacity:1; }
          50%  { transform:translate(-50%,-80%) scale(1.2); opacity:1; }
          100% { transform:translate(-50%,-120%) scale(0.8); opacity:0; }
        }
      `}</style>
    </div>
  )
}

// ── TIMER RING ───────────────────────────────────────────────────
export function TimerRing({ timeLeft, totalTime, size=80, accent='#C9A84C' }) {
  const pct = totalTime > 0 ? timeLeft/totalTime : 0
  const r   = (size-6)/2
  const c   = 2*Math.PI*r
  const color = pct > 0.5 ? '#4ADE80' : pct > 0.25 ? accent : '#F87171'
  const pulse = pct < 0.25
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0,
      animation: pulse ? 'timer-pulse 0.5s ease-in-out infinite alternate' : 'none' }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6}/>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${pct*c} ${(1-pct)*c}`}
          strokeLinecap="round"
          style={{ transition:'stroke-dasharray 1s linear, stroke 0.5s' }}/>
      </svg>
      <div style={{ position:'absolute', inset:0,
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center' }}>
        <p style={{ color, fontFamily:'Poppins,sans-serif',
          fontWeight:900, fontSize:size/4, margin:0,
          textShadow:`0 0 10px ${color}66` }}>{timeLeft}</p>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:8, margin:0 }}>SEC</p>
      </div>
      <style>{`
        @keyframes timer-pulse {
          from { filter:drop-shadow(0 0 4px #F87171); }
          to   { filter:drop-shadow(0 0 12px #F87171); }
        }
      `}</style>
    </div>
  )
}

// ── ANSWER OPTION ─────────────────────────────────────────────────
export function AnswerOption({ option, index, selected, correct, wrong, revealed, onClick, disabled }) {
  const letter = String.fromCharCode(65+index)
  const isCorrect = revealed && correct
  const isWrong   = revealed && wrong && selected
  const isSelected= selected && !revealed

  let bg = 'rgba(255,255,255,0.08)'
  let border = 'rgba(255,255,255,0.20)'
  let color = '#ffffff'
  let glow = 'none'

  if (isCorrect) { bg='rgba(74,222,128,0.2)'; border='#4ADE80'; glow='0 0 20px #4ADE8044'; color='#4ADE80' }
  else if (isWrong) { bg='rgba(248,113,113,0.2)'; border='#F87171'; glow='0 0 20px #F8717144'; color='#F87171' }
  else if (isSelected) { bg='rgba(201,168,76,0.2)'; border='#C9A84C'; color='#C9A84C' }

  return (
    <button onClick={disabled ? null : onClick}
      style={{
        display:'flex', alignItems:'center', gap:14,
        width:'100%', padding:'14px 18px', borderRadius:16,
        border:`2px solid ${border}`,
        background:bg, cursor:disabled?'default':'pointer',
        textAlign:'left', transition:'all 0.15s',
        boxShadow:glow,
        animation: isWrong ? 'wrong-shake 0.4s ease' : isCorrect ? 'correct-expand 0.3s ease' : 'none',
      }}
      onMouseEnter={e => { if(!disabled && !revealed) {
        e.currentTarget.style.border='2px solid rgba(201,168,76,0.5)'
        e.currentTarget.style.transform='translateX(4px)'
      }}}
      onMouseLeave={e => { if(!disabled && !revealed) {
        e.currentTarget.style.border=`2px solid ${border}`
        e.currentTarget.style.transform='translateX(0)'
      }}}>
      <div style={{
        width:36, height:36, borderRadius:'50%', flexShrink:0,
        background: isCorrect?'#4ADE80':isWrong?'#F87171':isSelected?'#C9A84C':'rgba(255,255,255,0.1)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontWeight:900, fontSize:14,
        color: (isCorrect||isWrong||isSelected)?'#000':'rgba(255,255,255,0.6)',
        transition:'all 0.15s',
      }}>{isCorrect?'✓':isWrong?'✕':letter}</div>
      <span style={{ color, fontSize:14, fontWeight:isSelected||isCorrect?700:400,
        lineHeight:1.4, transition:'color 0.15s' }}>{option}</span>
      {isCorrect && <span style={{ marginLeft:'auto', fontSize:18 }}>⭐</span>}
      <style>{`
        @keyframes wrong-shake {
          0%,100%{ transform:translateX(0); }
          25%    { transform:translateX(-8px); }
          75%    { transform:translateX(8px); }
        }
        @keyframes correct-expand {
          0%  { transform:scale(0.98); }
          50% { transform:scale(1.02); }
          100%{ transform:scale(1); }
        }
      `}</style>
    </button>
  )
}

// ── XP BAR ────────────────────────────────────────────────────────
export function XPBar({ current, max, color='#C9A84C', label='' }) {
  const pct = Math.min(100, (current/max)*100)
  return (
    <div>
      {label && (
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
          <span style={{ color:'rgba(255,255,255,0.5)', fontSize:9 }}>{label}</span>
          <span style={{ color, fontSize:9, fontWeight:700 }}>{current}/{max}</span>
        </div>
      )}
      <div style={{ height:5, background:'rgba(255,255,255,0.08)',
        borderRadius:3, overflow:'hidden' }}>
        <div style={{
          height:'100%', borderRadius:3, width:`${pct}%`,
          background:`linear-gradient(90deg,${color},${color}88)`,
          boxShadow:`0 0 8px ${color}66`,
          transition:'width 0.8s cubic-bezier(0.23,1,0.32,1)',
        }}/>
      </div>
    </div>
  )
}

// ── GAME HEADER ───────────────────────────────────────────────────
export function GameHeader({ title, emoji, score, combo, timeLeft, totalTime,
  questNum, totalQuest, accent='#C9A84C', onExit }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'12px 16px',
      background:'rgba(0,0,0,0.35)',
      backdropFilter:'blur(20px)',
      borderBottom:'1px solid rgba(255,255,255,0.08)',
      position:'sticky', top:0, zIndex:100,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={onExit} style={{
          background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)',
          borderRadius:10, width:36, height:36, cursor:'pointer', color:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>←</button>
        <div>
          <p style={{ color:'#fff', fontFamily:'Poppins,sans-serif',
            fontWeight:700, fontSize:15, margin:0 }}>{emoji} {title}</p>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:10, margin:0 }}>
            Q{questNum}/{totalQuest}
          </p>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ textAlign:'center' }}>
          <p style={{ color:accent, fontFamily:'Poppins,sans-serif',
            fontWeight:900, fontSize:18, margin:0 }}>{score}</p>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:8, margin:0 }}>SCORE</p>
        </div>
        {timeLeft !== undefined && (
          <TimerRing timeLeft={timeLeft} totalTime={totalTime}
            size={56} accent={accent}/>
        )}
      </div>
    </div>
  )
}
