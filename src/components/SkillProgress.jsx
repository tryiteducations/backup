// FILE: src/components/SkillProgress.jsx
// TryIT - Real Skill Improvement Tracker (for Profile page)
// CRITICAL: This data is computed from ACTUAL question_bank performance.
// Never fabricated, never randomized, never a placeholder number.
// Only shows topics with 2+ real data points (genuine before/after comparison).
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getRealSkillImprovement } from '../lib/levelSystem'

const NAVY = '#1E3A5F'
const GREEN = '#059669'
const GOLD = '#C9A84C'

const SUBJECT_COLORS = { quant:'#1D4ED8', reasoning:'#7C3AED', english:'#059669', gk:'#D97706', general:'#64748B' }

export default function SkillProgress({ compact = false }) {
  const { user } = useAuth()
  const [skills,  setSkills]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getRealSkillImprovement(user.id).then(data => {
      setSkills(data)
      setLoading(false)
    })
  }, [user?.id])

  if (loading) return (
    <div style={{ padding:16, textAlign:'center', color:'#94A3B8', fontSize:12 }}>
      Calculating your real progress...
    </div>
  )

  if (skills.length === 0) return (
    <div style={{ background:'var(--color-bg,#F8FAFC)', borderRadius:14, padding:16, border:'1.5px dashed #E2E8F0', textAlign:'center' }}>
      <p style={{ fontSize:24, marginBottom:6 }}>📊</p>
      <p style={{ fontSize:12, color:'var(--color-text-light,#64748B)', margin:0, lineHeight:1.6 }}>
        Play more tournaments and tests to unlock your real skill improvement chart.<br/>
        We only show genuine before/after comparisons - never fake numbers.
      </p>
    </div>
  )

  const display = compact ? skills.slice(0, 3) : skills

  return (
    <div>
      {!compact && (
        <div style={{ background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:10, padding:'8px 12px', marginBottom:12 }}>
          <p style={{ fontSize:11, color:'#065F46', margin:0, lineHeight:1.6 }}>
            ✅ Computed from your actual question-by-question answers. Real data only - never estimated.
          </p>
        </div>
      )}

      {display.map(skill => {
        const improved = skill.improvement_pct > 0
        const color = SUBJECT_COLORS[skill.subject] || SUBJECT_COLORS.general

        return (
          <div key={skill.topic_code} style={{ background:'#fff', borderRadius:14, padding:'12px 14px',
            marginBottom:8, border:'1.5px solid #E2E8F0' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:'var(--color-text,#1E293B)', margin:'0 0 2px' }}>{skill.topic_code}</p>
                <span style={{ fontSize:9, fontWeight:600, padding:'1px 7px', borderRadius:99, background:`${color}15`, color }}>
                  {skill.subject}
                </span>
              </div>
              <div style={{ textAlign:'right' }}>
                <p style={{ fontSize:16, fontWeight:900, margin:0, color: improved ? GREEN : '#DC2626',
                  fontFamily:'Poppins,sans-serif' }}>
                  {improved ? '+' : ''}{skill.improvement_pct?.toFixed(1)}%
                </p>
                <p style={{ fontSize:9, color:'#94A3B8', margin:0 }}>{skill.first_accuracy}% → {skill.latest_accuracy}%</p>
              </div>
            </div>

            {/* Visual bar: before vs after */}
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ flex:1, height:6, background:'#E2E8F0', borderRadius:99, overflow:'hidden', position:'relative' }}>
                <div style={{ position:'absolute', height:'100%', width:`${skill.first_accuracy}%`,
                  background:'#CBD5E1', borderRadius:99 }} />
                <div style={{ position:'absolute', height:'100%', width:`${skill.latest_accuracy}%`,
                  background:color, borderRadius:99, opacity:0.85 }} />
              </div>
            </div>
            <p style={{ fontSize:9, color:'#94A3B8', margin:'4px 0 0' }}>
              Based on {skill.snapshot_count} real practice sessions
            </p>
          </div>
        )
      })}

      {compact && skills.length > 3 && (
        <p style={{ fontSize:11, color:'#94A3B8', textAlign:'center', marginTop:4 }}>
          +{skills.length - 3} more topics tracked
        </p>
      )}
    </div>
  )
}