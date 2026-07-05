// src/pages/mentor/MentorDashboardRefactored.jsx
// Refactored Mentor Dashboard with unified layout, themes, and interconnected data
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { doubtSystem, paperSystem, notificationSystem } from '../../lib/dataInterconnect'
import { supabase } from '../../lib/supabase'

const NAV = [
  { icon: '🏠', label: 'Dashboard', path: '/mentor-hub' },
  { icon: '👥', label: 'My Students', path: '/mentor-hub/students' },
  { icon: '💬', label: 'Doubts', path: '/mentor-hub/doubts' },
  { icon: '📁', label: 'Materials', path: '/mentor-hub/materials' },
  { icon: '💡', label: 'Concept Videos', path: '/concept-videos' },
  { icon: '🏆', label: 'Leaderboard', path: '/mentor-hub/leaderboard' },
  { icon: '💰', label: 'Earnings', path: '/mentor-hub/cashback' },
  { icon: '📊', label: 'Analytics', path: '/mentor-hub/analytics' },
  { icon: '🎟️', label: 'Coupons', path: '/mentor-hub/coupons' },
  { icon: '👥', label: 'Community', path: '/mentor-hub/community' },
  { icon: '🇮🇳', label: 'Bharat Pulse', path: '/bharat-pulse' },
  { icon: '📋', label: 'Exam Board', path: '/exam-board' },
  { icon: '⚙️', label: 'Settings', path: '/mentor-hub/settings' },
]

const CUSTOMIZABLE_ITEMS = [
  { id: 'stats', label: 'Statistics Cards', visible: true },
  { id: 'pending_doubts', label: 'Pending Doubts', visible: true },
  { id: 'active_students', label: 'Active Students', visible: true },
  { id: 'recent_earnings', label: 'Recent Earnings', visible: true },
  { id: 'student_ratings', label: 'Student Ratings', visible: true },
  { id: 'upload_materials', label: 'Upload Materials', visible: true },
]

export default function MentorDashboardRefactored() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const nav = useNavigate()

  const p = theme?.primary || '#1E3A5F'
  const a = theme?.accent || '#C9A84C'
  const t = theme?.text || '#1E293B'
  const m = theme?.textLight || '#64748B'
  const bg = theme?.background || '#F8FAFC'
  const c = theme?.surface || '#FFFFFF'
  const isDark = theme?.isDark || false
  const b = theme?.border || '#E2E8F0'

  // State
  const [doubts, setDoubts] = useState([])
  const [students, setStudents] = useState([])
  const [earnings, setEarnings] = useState({ thisMonth: 0, total: 0 })
  const [rating, setRating] = useState(0)
  const [pendingCount, setPendingCount] = useState(0)
  const [sessionLogs, setSessionLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [customization, setCustomization] = useState({})

  useEffect(() => {
    loadDashboardData()
    subscribeToUpdates()
    loadCustomization()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load pending doubts
      const pendingDoubts = await doubtSystem.getDoubts(user?.id, 'mentor', { status: 'open' })
      setDoubts(pendingDoubts || [])
      setPendingCount(pendingDoubts?.length || 0)

      // Mock data - replace with actual API calls
      setStudents([
        { id: 1, name: 'Priya R.', exam: 'UPSC', plan: 'Monthly', rating: 5, status: 'active' },
        { id: 2, name: 'Karthik M.', exam: 'SSC CGL', plan: 'Weekly', rating: 4, status: 'active' },
        { id: 3, name: 'Anjali S.', exam: 'TNPSC', plan: 'Monthly', rating: 5, status: 'active' },
        { id: 4, name: 'Rahul V.', exam: 'IBPS', plan: 'Weekly', rating: 4, status: 'active' },
      ])

      setEarnings({ thisMonth: 3840, total: 12540 })
      setRating(4.8)

      // Recent sessions students have started with this mentor
      try {
        const { data: sessions } = await supabase
          .from('session_logs')
          .select('*')
          .eq('mentor_id', user?.id)
          .order('started_at', { ascending: false })
          .limit(10)
        setSessionLogs(sessions || [])
      } catch (e) {
        console.log('Session logs not available yet:', e)
        setSessionLogs([])
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToUpdates = () => {
    const subscription = notificationSystem.subscribeToDoubts(user?.id, (payload) => {
      if (payload.eventType === 'INSERT') {
        setDoubts((prev) => [payload.new, ...prev])
        setPendingCount((prev) => prev + 1)
      }
    })
    return () => subscription?.unsubscribe()
  }

  const loadCustomization = () => {
    try {
      const saved = localStorage.getItem('dashboard_customization_mentor')
      if (saved) setCustomization(JSON.parse(saved))
    } catch {}
  }

  const handleAssignDoubt = async (doubtId) => {
    await doubtSystem.assignDoubt(doubtId, user?.id)
    loadDashboardData()
  }

  async function handleShareAchievement() {
    const nameVal = user?.name || 'Mentor'
    const text = `I'm mentoring ${students.length} students with a ${rating.toFixed(1)}★ rating on TryIT Educations! 🎓 tryiteducations.net`
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 1080; canvas.height = 1080
      const ctx = canvas.getContext('2d')

      const grad = ctx.createLinearGradient(0, 0, 1080, 1080)
      grad.addColorStop(0, isDark?bg:p); grad.addColorStop(1, isDark?c:p)
      ctx.fillStyle = grad; ctx.fillRect(0, 0, 1080, 1080)

      const glow = ctx.createRadialGradient(860, 220, 20, 860, 220, 400)
      glow.addColorStop(0, `${a}55`); glow.addColorStop(1, `${a}00`)
      ctx.fillStyle = glow; ctx.fillRect(0, 0, 1080, 1080)

      ctx.fillStyle = '#fff'; ctx.font = 'bold 46px Poppins, sans-serif'
      ctx.fillText('TryIT Educations', 70, 110)
      ctx.fillStyle = a; ctx.fillRect(70, 130, 90, 6)

      ctx.beginPath(); ctx.arc(150, 300, 70, 0, Math.PI * 2)
      ctx.fillStyle = a; ctx.fill()
      ctx.fillStyle = isDark?bg:p; ctx.font = 'bold 60px Poppins, sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText((nameVal[0] || 'M').toUpperCase(), 150, 305)
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'

      ctx.fillStyle = '#fff'; ctx.font = 'bold 40px Poppins, sans-serif'
      ctx.fillText(nameVal, 250, 290)
      ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = '26px Inter, sans-serif'
      ctx.fillText('MENTOR · TryIT Educations', 250, 330)

      ctx.fillStyle = a; ctx.font = 'bold 110px Poppins, sans-serif'
      ctx.fillText(`${rating.toFixed(1)}★`, 70, 560)
      ctx.fillStyle = '#fff'; ctx.font = '34px Inter, sans-serif'
      ctx.fillText('Average Student Rating', 70, 610)

      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      ctx.fillRect(70, 660, 460, 90)
      ctx.fillStyle = '#fff'; ctx.font = 'bold 32px Poppins, sans-serif'
      ctx.fillText(`👨‍🎓 Mentoring ${students.length} students`, 95, 715)

      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '28px Inter, sans-serif'
      ctx.fillText('tryiteducations.net · Your Exam. Your Rank. Your Success.', 70, 1010)

      canvas.toBlob(async (blob) => {
        if (!blob) { if (navigator.share) { navigator.share({ title: 'My TryIT Mentor Stats', text }) } return }
        const file = new File([blob], 'tryit-mentor-stats.png', { type: 'image/png' })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: 'My TryIT Mentor Stats', text, files: [file] })
        } else if (navigator.share) {
          await navigator.share({ title: 'My TryIT Mentor Stats', text })
        } else {
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob); link.download = 'tryit-mentor-stats.png'
          link.click()
        }
      }, 'image/png')
    } catch (e) {
      console.error('Share image generation failed:', e)
      if (navigator.share) { navigator.share({ title: 'My TryIT Mentor Stats', text }) }
    }
  }

  const StatCard = ({ icon, label, value, color }) => (
    <div style={{
      background: c,
      border: `1px solid ${b}`,
      borderRadius: 12,
      padding: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flex: 1,
      minWidth: 200,
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 12,
        background: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 12, color: m, fontWeight: 500 }}>{label}</p>
        <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 700, color: t }}>{value}</p>
      </div>
    </div>
  )

  const contentInner = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats */}
      {customization['stats'] !== false && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <StatCard icon="👨‍🎓" label="Active Students" value={students.length} color={p} />
          <StatCard icon="💬" label="Doubts Pending" value={pendingCount} color={a} />
          <StatCard icon="⭐" label="Avg Rating" value={rating.toFixed(1)} color="#FBBF24" />
          <StatCard icon="💰" label="This Month" value={`₹${earnings.thisMonth}`} color="#22C55E" />
        </div>
      )}

      <button onClick={handleShareAchievement} style={{
        alignSelf: 'flex-start', background: `linear-gradient(135deg,${p},${a})`,
        border: 'none', borderRadius: 12, padding: '10px 20px', color: '#fff',
        fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: `0 4px 20px ${a}35` }}>
        📤 Share My Achievement
      </button>

      {/* Pending Doubts */}
      {customization['pending_doubts'] !== false && (
        <div style={{
          background: c,
          border: `1px solid ${b}`,
          borderRadius: 12,
          padding: 20,
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: p }}>Pending Doubts</h2>
          {loading ? (
            <p style={{ color: m }}>Loading...</p>
          ) : doubts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {doubts.slice(0, 5).map((doubt) => (
                <div
                  key={doubt.id}
                  style={{
                    background: bg,
                    padding: 12,
                    borderRadius: 8,
                    borderLeft: `3px solid ${a}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: t }}>{doubt.question?.substring(0, 50)}...</p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: m }}>
                      {doubt.topic} • {doubt.exam}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAssignDoubt(doubt.id)}
                    style={{
                      background: a,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Assign to Me
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: m }}>No pending doubts</p>
          )}
        </div>
      )}

      {/* Recent Sessions - students who tapped "Start Session" */}
      <div style={{ background: c, border: `1px solid ${b}`, borderRadius: 12, padding: 20, marginTop: 20 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: p }}>🚀 Recent Sessions</h2>
        {sessionLogs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sessionLogs.map((log) => (
              <div key={log.id} style={{ background: bg, padding: '10px 14px', borderRadius: 10,
                borderLeft: `3px solid ${a}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: t, fontSize: 13, fontWeight: 600 }}>Student session started</span>
                <span style={{ color: m, fontSize: 11 }}>{new Date(log.started_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: m, fontSize: 13 }}>No sessions started yet - this shows the moment a student taps "Start Session" on your profile.</p>
        )}
      </div>

      {/* Active Students */}
      {customization['active_students'] !== false && (
        <div style={{
          background: c,
          border: `1px solid ${b}`,
          borderRadius: 12,
          padding: 20,
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: p }}>My Students</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${b}` }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600, color: m, fontSize: 12 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600, color: m, fontSize: 12 }}>Exam</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600, color: m, fontSize: 12 }}>Plan</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600, color: m, fontSize: 12 }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${b}` }}>
                    <td style={{ padding: '12px 8px', color: t }}>{student.name}</td>
                    <td style={{ padding: '12px 8px', color: t }}>{student.exam}</td>
                    <td style={{ padding: '12px 8px', color: t }}>{student.plan}</td>
                    <td style={{ padding: '12px 8px', color: '#FBBF24' }}>{'⭐'.repeat(student.rating)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <DashboardLayout
      role="mentor"
      navigation={NAV}
      title="Mentor Dashboard"
      customizableItems={CUSTOMIZABLE_ITEMS}
      onCustomizationChange={setCustomization}
    >
      {contentInner}
    </DashboardLayout>
  )
}
