// src/pages/institution/InstitutionDashboardRefactored.jsx
// Refactored Institution Dashboard with unified layout, themes, and interconnected data
import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { doubtSystem, paperSystem, notificationSystem } from '../../lib/dataInterconnect'
import { supabase } from '../../lib/supabase'

const NAV = [
  { icon: '🏠', label: 'Dashboard', path: '/institution' },
  { icon: '🏛️', label: 'Halls', path: '/institution/halls' },
  { icon: '📋', label: 'Live Tests', path: '/institution/tests' },
  { icon: '👨‍🏫', label: 'Mentors', path: '/institution/mentors' },
  { icon: '📚', label: 'Homework', path: '/institution/homework' },
  { icon: '💡', label: 'Concept Videos', path: '/concept-videos' },
  { icon: '📋', label: 'Exam Board', path: '/exam-board' },
  { icon: '👥', label: 'Students', path: '/institution/students' },
  { icon: '💰', label: 'Revenue', path: '/institution/revenue' },
  { icon: '🇮🇳', label: 'Bharat Pulse', path: '/bharat-pulse' },
  { icon: '⚙️', label: 'Settings', path: '/institution/settings' },
]

const CUSTOMIZABLE_ITEMS = [
  { id: 'stats', label: 'Statistics Cards', visible: true },
  { id: 'active_halls', label: 'Active Halls', visible: true },
  { id: 'student_doubts', label: 'Student Doubts', visible: true },
  { id: 'revenue_chart', label: 'Revenue Chart', visible: true },
  { id: 'recent_activity', label: 'Recent Activity', visible: true },
  { id: 'homework_pending', label: 'Pending Homework', visible: true },
]

export default function InstitutionDashboardRefactored() {
  const { theme } = useTheme()
  const { user } = useAuth()

  const p = theme?.primary || '#1E3A5F'
  const a = theme?.accent || '#C9A84C'
  const t = theme?.text || '#1E293B'
  const m = theme?.textLight || '#64748B'
  const bg = theme?.background || '#F8FAFC'
  const c = theme?.surface || '#FFFFFF'
  const isDark = theme?.isDark || false
  const b = theme?.border || '#E2E8F0'

  // State
  const [halls, setHalls] = useState([])
  const [doubts, setDoubts] = useState([])
  const [stats, setStats] = useState({
    activeHalls: 4,
    totalStudents: 875,
    mentors: 6,
    examsThisMonth: 12,
    homeworkPending: 3,
    revenue: 42500,
  })
  const [loading, setLoading] = useState(true)
  const [customization, setCustomization] = useState({})
  const [sessionLogs, setSessionLogs] = useState([])

  useEffect(() => {
    loadDashboardData()
    subscribeToUpdates()
    loadCustomization()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Load doubts from students
      const studentDoubts = await doubtSystem.getDoubts(user?.id, 'institution')
      setDoubts(studentDoubts || [])

      // Mock data
      setHalls([
        { id: 1, name: 'UPSC Morning Batch', exam: 'UPSC CSE', mentors: 2, students: 240, fee: 500 },
        { id: 2, name: 'SSC CGL Evening', exam: 'SSC CGL', mentors: 1, students: 180, fee: 300 },
        { id: 3, name: 'Class 10 Science', exam: 'School Board', mentors: 1, students: 35, fee: 0 },
        { id: 4, name: 'TNPSC Tamil Nadu', exam: 'TNPSC Group 1', mentors: 2, students: 420, fee: 400 },
      ])

      // Real session-start logs from students
      try {
        const { data: sessions } = await supabase
          .from('session_logs')
          .select('*')
          .eq('mentor_id', user?.id)
          .order('started_at', { ascending: false })
          .limit(5)
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
      }
    })
    return () => subscription?.unsubscribe()
  }

  const loadCustomization = () => {
    try {
      const saved = localStorage.getItem('dashboard_customization_institution')
      if (saved) setCustomization(JSON.parse(saved))
    } catch {}
  }

  async function handleShareAchievement() {
    const nameVal = user?.name || 'Institution'
    const text = `Our institution is teaching ${stats.totalStudents} students across ${stats.activeHalls} halls on TryIT Educations! 🏫 tryiteducations.net`
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
      ctx.fillText('🏫', 150, 305)
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'

      ctx.fillStyle = '#fff'; ctx.font = 'bold 40px Poppins, sans-serif'
      ctx.fillText(nameVal, 250, 290)
      ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = '26px Inter, sans-serif'
      ctx.fillText('INSTITUTION · TryIT Educations', 250, 330)

      ctx.fillStyle = a; ctx.font = 'bold 110px Poppins, sans-serif'
      ctx.fillText(`${stats.totalStudents}`, 70, 560)
      ctx.fillStyle = '#fff'; ctx.font = '34px Inter, sans-serif'
      ctx.fillText('Students Enrolled', 70, 610)

      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      ctx.fillRect(70, 660, 460, 90)
      ctx.fillStyle = '#fff'; ctx.font = 'bold 32px Poppins, sans-serif'
      ctx.fillText(`🏛️ ${stats.activeHalls} active halls`, 95, 715)

      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '28px Inter, sans-serif'
      ctx.fillText('tryiteducations.net · Your Exam. Your Rank. Your Success.', 70, 1010)

      canvas.toBlob(async (blob) => {
        if (!blob) { if (navigator.share) { navigator.share({ title: 'My TryIT Institution Stats', text }) } return }
        const file = new File([blob], 'tryit-institution-stats.png', { type: 'image/png' })
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: 'My TryIT Institution Stats', text, files: [file] })
        } else if (navigator.share) {
          await navigator.share({ title: 'My TryIT Institution Stats', text })
        } else {
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob); link.download = 'tryit-institution-stats.png'
          link.click()
        }
      }, 'image/png')
    } catch (e) {
      console.error('Share image generation failed:', e)
      if (navigator.share) { navigator.share({ title: 'My TryIT Institution Stats', text }) }
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
      {/* Statistics */}
      {customization['stats'] !== false && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}>
          <StatCard icon="🏛️" label="Active Halls" value={stats.activeHalls} color={p} />
          <StatCard icon="👨‍🎓" label="Total Students" value={stats.totalStudents} color="#22C55E" />
          <StatCard icon="👨‍🏫" label="Mentors" value={stats.mentors} color="#8B5CF6" />
          <StatCard icon="📝" label="Exams (Month)" value={stats.examsThisMonth} color={a} />
          <StatCard icon="📚" label="Homework Pending" value={stats.homeworkPending} color="#EF4444" />
          <StatCard icon="💰" label="Revenue (Month)" value={`₹${stats.revenue}`} color="#22C55E" />
        </div>
      )}

      <button onClick={handleShareAchievement} style={{
        alignSelf: 'flex-start', background: `linear-gradient(135deg,${p},${a})`,
        border: 'none', borderRadius: 12, padding: '10px 20px', color: '#fff',
        fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: `0 4px 20px ${a}35` }}>
        📤 Share Our Achievement
      </button>

      {/* Active Halls */}
      {customization['active_halls'] !== false && (
        <div style={{
          background: c,
          border: `1px solid ${b}`,
          borderRadius: 12,
          padding: 20,
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: p }}>Your Halls</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {halls.map((hall) => (
              <div
                key={hall.id}
                style={{
                  background: bg,
                  border: `1px solid ${b}`,
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <p style={{ margin: '0 0 8px', fontWeight: 600, color: t }}>{hall.name}</p>
                <p style={{ margin: '0 0 12px', fontSize: 12, color: m }}>{hall.exam}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span>👨‍🏫 {hall.mentors} mentors</span>
                  <span>👥 {hall.students} students</span>
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: a, fontWeight: 600 }}>
                  ₹{hall.fee} {hall.fee > 0 ? 'per hall' : 'free'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Doubts */}
      {customization['student_doubts'] !== false && (
        <div style={{
          background: c,
          border: `1px solid ${b}`,
          borderRadius: 12,
          padding: 20,
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: p }}>Student Doubts</h2>
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
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 600, color: t }}>{doubt.question?.substring(0, 60)}...</p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: m }}>
                    Student • {doubt.topic} • {doubt.exam}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: m }}>No pending doubts</p>
          )}
        </div>
      )}

      {/* Recent Activity */}
      {customization['recent_activity'] !== false && (
        <div style={{
          background: c,
          border: `1px solid ${b}`,
          borderRadius: 12,
          padding: 20,
        }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: p }}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ...sessionLogs.map(log => ({
                icon: '🚀', text: 'A student started a session', time: new Date(log.started_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
              })),
              { icon: '📝', text: 'Priya R. submitted homework in UPSC Morning Batch', time: '10m ago' },
              { icon: '👤', text: 'New student Karthik M. joined SSC CGL Evening', time: '25m ago' },
              { icon: '📋', text: 'Mentor Suresh posted new assignment in Hall 2', time: '1h ago' },
              { icon: '🎯', text: 'UPSC Mock Test completed - 234 students appeared', time: '3h ago' },
              { icon: '💰', text: '₹15,000 collected from Hall 4 enrollments', time: '5h ago' },
            ].map((activity, idx) => (
              <div key={idx} style={{
                background: bg,
                padding: 12,
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 18 }}>{activity.icon}</span>
                  <p style={{ margin: 0, fontSize: 13, color: t }}>{activity.text}</p>
                </div>
                <span style={{ fontSize: 11, color: m, whiteSpace: 'nowrap' }}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <DashboardLayout
      role="institution"
      navigation={NAV}
      title="Institution Dashboard"
      customizableItems={CUSTOMIZABLE_ITEMS}
      onCustomizationChange={setCustomization}
    >
      {contentInner}
    </DashboardLayout>
  )
}
