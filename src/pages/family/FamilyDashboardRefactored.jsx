// src/pages/family/FamilyDashboardRefactored.jsx
// Refactored Family Dashboard with real-time progress tracking and data export
import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { familyTracking, notificationSystem } from '../../lib/dataInterconnect'

const NAV = [
  { icon: '🏠', label: 'Dashboard', path: '/family' },
  { icon: '👨‍👩‍👧‍👦', label: 'Family Members', path: '/family/members' },
  { icon: '📊', label: 'Analytics', path: '/family/analytics' },
  { icon: '📥', label: 'Reports', path: '/family/reports' },
  { icon: '💬', label: 'Messages', path: '/family/messages' },
  { icon: '🇮🇳', label: 'Bharat Pulse', path: '/bharat-pulse' },
  { icon: '⚙️', label: 'Settings', path: '/family/settings' },
]

const CUSTOMIZABLE_ITEMS = [
  { id: 'member_cards', label: 'Family Members', visible: true },
  { id: 'today_stats', label: 'Today\'s Stats', visible: true },
  { id: 'study_streak', label: 'Study Streak', visible: true },
  { id: 'weak_areas', label: 'Weak Areas', visible: true },
  { id: 'exam_readiness', label: 'Exam Readiness', visible: true },
  { id: 'weekly_chart', label: 'Weekly Progress', visible: true },
]

export default function FamilyDashboardRefactored() {
  const { theme } = useTheme()
  const { user } = useAuth()

  const p = theme?.primary || '#1E3A5F'
  const a = theme?.accent || '#C9A84C'
  const t = theme?.text || '#1E293B'
  const m = theme?.textLight || '#64748B'
  const bg = theme?.background || '#F8FAFC'
  const c = theme?.surface || '#FFFFFF'
  const b = theme?.border || '#E2E8F0'

  // State
  const [children, setChildren] = useState([
    {
      id: 'child-001',
      name: 'Arjun',
      age: 15,
      class: 'Class 10',
      avatar: '🎓',
      exam: 'NTSE',
      plan: 'pro',
      streak: 12,
      coins: 840,
      today: { tests: 2, questions: 48, minutes: 62, topics: ['Percentage', 'Syllogism'] },
      weekly: [72, 65, 80, 58, 74, 68, 75],
      subjects: [
        { name: 'Mathematics', accuracy: 74, trend: 'up' },
        { name: 'Reasoning', accuracy: 88, trend: 'up' },
        { name: 'English', accuracy: 61, trend: 'down' },
      ],
      weakTopics: [
        { topic: 'Reading Comprehension', wrong: 8, total: 15 },
        { topic: 'Profit & Loss', wrong: 6, total: 12 },
      ],
      examReadiness: 68,
      rank: 1420,
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'child-002',
      name: 'Meera',
      age: 17,
      class: 'Class 12',
      avatar: '📚',
      exam: 'NEET',
      plan: 'ultra',
      streak: 28,
      coins: 2140,
      today: { tests: 3, questions: 85, minutes: 110, topics: ['Cell Biology', 'Chemistry'] },
      weekly: [82, 78, 85, 80, 88, 82, 90],
      subjects: [
        { name: 'Biology', accuracy: 88, trend: 'up' },
        { name: 'Chemistry', accuracy: 79, trend: 'up' },
        { name: 'Physics', accuracy: 72, trend: 'stable' },
      ],
      weakTopics: [
        { topic: 'Electrostatics', wrong: 6, total: 12 },
      ],
      examReadiness: 84,
      rank: 234,
      lastActive: new Date(Date.now() - 30 * 60 * 1000),
    },
  ])
  const [selectedChild, setSelectedChild] = useState(children[0])
  const [customization, setCustomization] = useState({})
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    subscribeToUpdates()
    loadCustomization()
  }, [])

  const subscribeToUpdates = () => {
    if (children[0]?.id) {
      const subscription = notificationSystem.subscribeToChildProgress(children[0].id, (payload) => {
        console.log('Child progress updated:', payload)
      })
      return () => subscription?.unsubscribe()
    }
  }

  const loadCustomization = () => {
    try {
      const saved = localStorage.getItem('dashboard_customization_family')
      if (saved) setCustomization(JSON.parse(saved))
    } catch {}
  }

  const handleExportData = async (childId, format = 'json') => {
    setExporting(true)
    try {
      const data = await familyTracking.exportChildData(childId, format)
      
      if (format === 'json') {
        const element = document.createElement('a')
        element.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(data)}`)
        element.setAttribute('download', `tryit-export-${new Date().toISOString().split('T')[0]}.json`)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      }
      alert('Data exported successfully!')
    } catch (err) {
      console.error('Export error:', err)
      alert('Error exporting data')
    } finally {
      setExporting(false)
    }
  }

  const MemberCard = ({ child, isSelected }) => (
    <div
      onClick={() => setSelectedChild(child)}
      style={{
        background: isSelected ? a : c,
        border: `2px solid ${isSelected ? a : b}`,
        borderRadius: 12,
        padding: 16,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'rgba(0,0,0,0.02)'
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = c
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>{child.avatar}</span>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: isSelected ? '#fff' : t }}>{child.name}</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: isSelected ? 'rgba(255,255,255,0.8)' : m }}>
            {child.class} • {child.exam}
          </p>
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        fontSize: 12,
        color: isSelected ? 'rgba(255,255,255,0.8)' : m,
      }}>
        <div>🔥 Streak: {child.streak}</div>
        <div>🪙 Coins: {child.coins}</div>
        <div>🏆 Rank: {child.rank}</div>
        <div>✅ Active: {Math.round((Date.now() - child.lastActive) / (1000 * 60))}m ago</div>
      </div>
    </div>
  )

  const contentInner = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Family Members */}
      {customization['member_cards'] !== false && (
        <div>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: p }}>Family Members</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 12,
          }}>
            {children.map((child) => (
              <MemberCard
                key={child.id}
                child={child}
                isSelected={selectedChild.id === child.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Selected Child's Data */}
      {selectedChild && (
        <>
          {/* Today's Stats */}
          {customization['today_stats'] !== false && (
            <div style={{
              background: c,
              border: `1px solid ${b}`,
              borderRadius: 12,
              padding: 20,
            }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: p }}>
                Today's Activity - {selectedChild.name}
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 16,
              }}>
                <div style={{
                  background: bg,
                  padding: 16,
                  borderRadius: 10,
                  textAlign: 'center',
                }}>
                  <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: a }}>
                    {selectedChild.today.tests}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: m }}>Tests Taken</p>
                </div>
                <div style={{
                  background: bg,
                  padding: 16,
                  borderRadius: 10,
                  textAlign: 'center',
                }}>
                  <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: p }}>
                    {selectedChild.today.questions}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: m }}>Questions</p>
                </div>
                <div style={{
                  background: bg,
                  padding: 16,
                  borderRadius: 10,
                  textAlign: 'center',
                }}>
                  <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#22C55E' }}>
                    {selectedChild.today.minutes}m
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: m }}>Study Time</p>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <p style={{ margin: 0, fontSize: 12, color: m }}>
                  Topics covered: {selectedChild.today.topics.join(', ')}
                </p>
              </div>
            </div>
          )}

          {/* Study Streak */}
          {customization['study_streak'] !== false && (
            <div style={{
              background: c,
              border: `1px solid ${b}`,
              borderRadius: 12,
              padding: 20,
            }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: p }}>Study Streak</h2>
              <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                <div style={{
                  background: `linear-gradient(135deg, ${a}, ${a}dd)`,
                  color: '#fff',
                  borderRadius: 12,
                  padding: '24px',
                  textAlign: 'center',
                  minWidth: 150,
                }}>
                  <p style={{ margin: 0, fontSize: 32, fontWeight: 900 }}>🔥</p>
                  <p style={{ margin: '8px 0 0', fontSize: 24, fontWeight: 700 }}>
                    {selectedChild.streak}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.9 }}>Current Streak</p>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                  <p style={{ margin: 0, color: t, fontWeight: 600 }}>
                    Keep it going! {selectedChild.streak > 7 ? '🎉' : '💪'}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: m }}>
                    {selectedChild.streak > 7
                      ? `Amazing dedication! ${selectedChild.streak} days of consistent learning.`
                      : `Almost there! ${7 - selectedChild.streak} more days to reach 1 week.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Subject Accuracy */}
          {customization['weak_areas'] !== false && (
            <div style={{
              background: c,
              border: `1px solid ${b}`,
              borderRadius: 12,
              padding: 20,
            }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: p }}>Subject Performance</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selectedChild.subjects.map((subject, idx) => (
                  <div key={idx}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                      alignItems: 'center',
                    }}>
                      <p style={{ margin: 0, fontWeight: 600, color: t }}>{subject.name}</p>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 16 }}>
                          {subject.trend === 'up' ? '📈' : subject.trend === 'down' ? '📉' : '➡️'}
                        </span>
                        <span style={{ fontWeight: 700, color: subject.accuracy > 75 ? '#22C55E' : a }}>
                          {subject.accuracy}%
                        </span>
                      </div>
                    </div>
                    <div style={{
                      height: 8,
                      background: bg,
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${subject.accuracy}%`,
                        background: subject.accuracy > 75 ? '#22C55E' : a,
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
              {selectedChild.weakTopics.length > 0 && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${b}` }}>
                  <p style={{ margin: '0 0 12px', fontWeight: 600, color: t }}>Areas to Focus</p>
                  {selectedChild.weakTopics.map((topic, idx) => (
                    <div key={idx} style={{
                      background: '#FEE2E2',
                      border: '1px solid #FCA5A5',
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 8,
                      fontSize: 12,
                    }}>
                      <p style={{ margin: 0, fontWeight: 600, color: '#DC2626' }}>
                        {topic.topic}
                      </p>
                      <p style={{ margin: '4px 0 0', color: '#991B1B' }}>
                        {topic.wrong}/{topic.total} questions wrong
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Exam Readiness */}
          {customization['exam_readiness'] !== false && (
            <div style={{
              background: c,
              border: `1px solid ${b}`,
              borderRadius: 12,
              padding: 20,
            }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: p }}>Exam Readiness</h2>
              <div style={{
                background: bg,
                borderRadius: 10,
                padding: 20,
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 48,
                  fontWeight: 900,
                  color: selectedChild.examReadiness > 70 ? '#22C55E' : a,
                  marginBottom: 8,
                }}>
                  {selectedChild.examReadiness}%
                </div>
                <div style={{
                  height: 12,
                  background: 'rgba(0,0,0,0.05)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  marginBottom: 12,
                }}>
                  <div style={{
                    height: '100%',
                    width: `${selectedChild.examReadiness}%`,
                    background: selectedChild.examReadiness > 70 ? '#22C55E' : a,
                  }} />
                </div>
                <p style={{
                  margin: 0,
                  color: t,
                  fontWeight: 600,
                }}>
                  {selectedChild.examReadiness > 80
                    ? 'Excellent! Ready for exam'
                    : selectedChild.examReadiness > 60
                    ? 'Good progress, needs more preparation'
                    : 'More practice needed'}
                </p>
              </div>
            </div>
          )}

          {/* Data Export */}
          <div style={{
            background: c,
            border: `1px solid ${b}`,
            borderRadius: 12,
            padding: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: p }}>Download Data</h2>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: m }}>
                Export all progress data from joining to present
              </p>
            </div>
            <button
              onClick={() => handleExportData(selectedChild.id, 'json')}
              disabled={exporting}
              style={{
                background: a,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 20px',
                fontWeight: 600,
                cursor: exporting ? 'not-allowed' : 'pointer',
                opacity: exporting ? 0.6 : 1,
              }}
            >
              {exporting ? '⏳ Exporting...' : '📥 Export Data'}
            </button>
          </div>
        </>
      )}
    </div>
  )

  return (
    <DashboardLayout
      role="family"
      navigation={NAV}
      title="Family Dashboard"
      customizableItems={CUSTOMIZABLE_ITEMS}
      onCustomizationChange={setCustomization}
    >
      {contentInner}
    </DashboardLayout>
  )
}
