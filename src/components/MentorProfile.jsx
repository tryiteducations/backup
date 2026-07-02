// FILE: src/components/MentorProfile.jsx
// LinkedIn-style mentor/institution profile with public/private visibility,
// filtering, and detailed stats
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// Sample data - in production this comes from API
const SAMPLE_MENTORS = [
  {
    id: 'm1',
    name: 'Dr. Rajesh Sharma',
    type: 'mentor',
    avatar: '👨‍🏫',
    title: 'UPSC CSE Expert | 12+ Years Experience',
    location: 'Delhi, India',
    languages: ['English', 'Hindi', 'Tamil'],
    exams: ['UPSC CSE', 'State PCS', 'CAPF'],
    topics: ['Polity', 'History', 'Geography', 'Economics'],
    rating: 4.9,
    reviewCount: 234,
    studentsHelped: 15000,
    solvedDoubts: 3200,
    previousPosts: 450,
    testMaterials: 85,
    testsConducted: 120,
    monthlyStudents: 45,
    experience: 12,
    bio: 'Former civil servant turned mentor. Helped 15000+ aspirants crack UPSC and State PCS exams.',
    isNewMember: false,
    isPro: true,
    publicInfo: {
      studentsHelped: true,
      solvedDoubts: true,
      previousPosts: true,
      testMaterials: true,
      testsConducted: true,
      rating: true,
    },
    lockedInfo: {
      monthlyStudents: true,
      contactInfo: true,
      detailedAnalytics: true,
    },
  },
  {
    id: 'm2',
    name: 'Priya Patel',
    type: 'mentor',
    avatar: '👩‍🏫',
    title: 'IIT JEE Mathematics | NIT Alumnus',
    location: 'Mumbai, India',
    languages: ['English', 'Hindi', 'Marathi', 'Gujarati'],
    exams: ['JEE Main', 'JEE Advanced', 'BITSAT'],
    topics: ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry'],
    rating: 4.8,
    reviewCount: 189,
    studentsHelped: 8000,
    solvedDoubts: 2100,
    previousPosts: 320,
    testMaterials: 60,
    testsConducted: 90,
    monthlyStudents: 30,
    experience: 8,
    bio: 'NIT Trichy graduate. Specialized in making complex math concepts simple for JEE aspirants.',
    isNewMember: false,
    isPro: true,
    publicInfo: {
      studentsHelped: true,
      solvedDoubts: true,
      previousPosts: true,
      testMaterials: true,
      testsConducted: true,
      rating: true,
    },
    lockedInfo: {
      monthlyStudents: true,
      contactInfo: true,
      detailedAnalytics: true,
    },
  },
  {
    id: 'm3',
    name: 'Amit Verma',
    type: 'mentor',
    avatar: '🧑‍🏫',
    title: 'NEET Biology Expert | MBBS, AIIMS',
    location: 'Bangalore, India',
    languages: ['English', 'Hindi', 'Kannada'],
    exams: ['NEET UG', 'AIIMS', 'JIPMER'],
    topics: ['Botany', 'Zoology', 'Human Physiology', 'Genetics'],
    rating: 4.7,
    reviewCount: 156,
    studentsHelped: 6000,
    solvedDoubts: 1800,
    previousPosts: 280,
    testMaterials: 45,
    testsConducted: 70,
    monthlyStudents: 25,
    experience: 6,
    bio: 'AIIMS Delhi alumnus. Passionate about making biology interesting and easy to remember.',
    isNewMember: true,
    isPro: false,
    publicInfo: {
      studentsHelped: true,
      solvedDoubts: true,
      previousPosts: true,
      testMaterials: false,
      testsConducted: false,
      rating: true,
    },
    lockedInfo: {
      monthlyStudents: true,
      contactInfo: true,
      detailedAnalytics: true,
    },
  },
  {
    id: 'i1',
    name: 'Excel Coaching Institute',
    type: 'institution',
    avatar: '🏫',
    title: 'Premier UPSC & State PCS Coaching',
    location: 'Delhi, India',
    languages: ['English', 'Hindi'],
    exams: ['UPSC CSE', 'State PCS', 'SSC CGL', 'Banking'],
    topics: ['All Subjects'],
    rating: 4.6,
    reviewCount: 512,
    studentsHelped: 50000,
    solvedDoubts: 12000,
    previousPosts: 1500,
    testMaterials: 300,
    testsConducted: 500,
    monthlyStudents: 200,
    experience: 25,
    bio: 'Established in 1998. One of Delhi\'s most trusted coaching institutes with 50,000+ successful students.',
    isNewMember: false,
    isPro: true,
    publicInfo: {
      studentsHelped: true,
      solvedDoubts: true,
      previousPosts: true,
      testMaterials: true,
      testsConducted: true,
      rating: true,
    },
    lockedInfo: {
      monthlyStudents: true,
      contactInfo: true,
      detailedAnalytics: true,
    },
  },
  {
    id: 'i2',
    name: 'Bright Future Academy',
    type: 'institution',
    avatar: '🏛️',
    title: 'JEE & NEET Coaching Experts',
    location: 'Kota, Rajasthan',
    languages: ['English', 'Hindi'],
    exams: ['JEE Main', 'JEE Advanced', 'NEET UG'],
    topics: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    rating: 4.5,
    reviewCount: 389,
    studentsHelped: 35000,
    solvedDoubts: 9000,
    previousPosts: 1100,
    testMaterials: 250,
    testsConducted: 400,
    monthlyStudents: 150,
    experience: 18,
    bio: 'Kota-based coaching powerhouse. Known for rigorous test series and personalized mentoring.',
    isNewMember: false,
    isPro: true,
    publicInfo: {
      studentsHelped: true,
      solvedDoubts: true,
      previousPosts: true,
      testMaterials: true,
      testsConducted: true,
      rating: true,
    },
    lockedInfo: {
      monthlyStudents: true,
      contactInfo: true,
      detailedAnalytics: true,
    },
  },
]

const FILTER_OPTIONS = {
  languages: ['All Languages', 'English', 'Hindi', 'Tamil', 'Marathi', 'Gujarati', 'Kannada', 'Telugu', 'Bengali', 'Malayalam'],
  exams: ['All Exams', 'UPSC CSE', 'JEE Main', 'JEE Advanced', 'NEET UG', 'SSC CGL', 'Banking', 'State PCS', 'CAT', 'GATE'],
  topics: ['All Topics', 'Polity', 'History', 'Geography', 'Economics', 'Calculus', 'Algebra', 'Physics', 'Chemistry', 'Biology'],
  cities: ['All Cities', 'Delhi', 'Mumbai', 'Bangalore', 'Kota', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur'],
  rating: ['All Ratings', '4.5+', '4.0+', '3.5+'],
  sort: ['Highest Rated', 'Most Students', 'Most Experience', 'New Members'],
}

export default function MentorProfile({ mentorData, isStandalone = false }) {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    language: 'All Languages',
    exam: 'All Exams',
    topic: 'All Topics',
    city: 'All Cities',
    rating: 'All Ratings',
    sort: 'Highest Rated',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [showLockedContent, setShowLockedContent] = useState(false)

  // If a single mentor is passed, show that profile
  const profiles = mentorData ? [mentorData] : SAMPLE_MENTORS

  const filteredProfiles = useMemo(() => {
    let result = [...profiles]

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.topics.some(t => t.toLowerCase().includes(q)) ||
        m.exams.some(e => e.toLowerCase().includes(q))
      )
    }

    // Language filter
    if (filters.language !== 'All Languages') {
      result = result.filter(m => m.languages.includes(filters.language))
    }

    // Exam filter
    if (filters.exam !== 'All Exams') {
      result = result.filter(m => m.exams.includes(filters.exam))
    }

    // Topic filter
    if (filters.topic !== 'All Topics') {
      result = result.filter(m => m.topics.includes(filters.topic))
    }

    // City filter
    if (filters.city !== 'All Cities') {
      result = result.filter(m => m.location.includes(filters.city))
    }

    // Rating filter
    if (filters.rating === '4.5+') {
      result = result.filter(m => m.rating >= 4.5)
    } else if (filters.rating === '4.0+') {
      result = result.filter(m => m.rating >= 4.0)
    } else if (filters.rating === '3.5+') {
      result = result.filter(m => m.rating >= 3.5)
    }

    // Sort
    switch (filters.sort) {
      case 'Highest Rated':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'Most Students':
        result.sort((a, b) => b.studentsHelped - a.studentsHelped)
        break
      case 'Most Experience':
        result.sort((a, b) => b.experience - a.experience)
        break
      case 'New Members':
        result.sort((a, b) => (b.isNewMember ? 1 : 0) - (a.isNewMember ? 1 : 0))
        break
      default:
        break
    }

    return result
  }, [profiles, filters, searchQuery])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating - fullStars >= 0.5
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push('⭐')
      else if (i === fullStars && hasHalf) stars.push('✨')
      else stars.push('☆')
    }
    return stars.join('')
  }

  // Single profile view (when mentorData is passed)
  if (mentorData) {
    return (
      <div style={{
        background: 'var(--color-surface, #FFFFFF)',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        border: '1px solid var(--color-border, #E2E8F0)',
        maxWidth: 700,
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--color-background, #F1F5F9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, flexShrink: 0,
          }}>
            {mentorData.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h2 style={{
                fontSize: 22, fontWeight: 700, color: 'var(--color-text, #1E293B)',
                margin: 0, fontFamily: 'Poppins,sans-serif',
              }}>
                {mentorData.name}
              </h2>
              {mentorData.isPro && (
                <span style={{
                  background: 'linear-gradient(135deg, #C9A84C, #E8C84A)',
                  color: '#1E3A5F', padding: '2px 8px', borderRadius: 6,
                  fontSize: 11, fontWeight: 700,
                }}>
                  PRO
                </span>
              )}
              {mentorData.isNewMember && (
                <span style={{
                  background: '#10B981', color: '#FFF', padding: '2px 8px',
                  borderRadius: 6, fontSize: 11, fontWeight: 700,
                }}>
                  NEW
                </span>
              )}
            </div>
            <p style={{
              fontSize: 14, color: 'var(--color-text-secondary, #64748B)',
              margin: '4px 0', fontFamily: 'Poppins,sans-serif',
            }}>
              {mentorData.title}
            </p>
            <p style={{
              fontSize: 13, color: 'var(--color-text-secondary, #94A3B8)',
              margin: 0, fontFamily: 'Poppins,sans-serif',
            }}>
              📍 {mentorData.location} · 🗣️ {mentorData.languages.join(', ')}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 14 }}>{renderStars(mentorData.rating)}</span>
              <span style={{
                fontSize: 13, fontWeight: 600, color: 'var(--color-text, #1E293B)',
                fontFamily: 'Poppins,sans-serif',
              }}>
                {mentorData.rating}
              </span>
              <span style={{
                fontSize: 12, color: 'var(--color-text-secondary, #94A3B8)',
                fontFamily: 'Poppins,sans-serif',
              }}>
                ({mentorData.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p style={{
          fontSize: 14, color: 'var(--color-text, #1E293B)',
          lineHeight: 1.6, marginBottom: 20, fontFamily: 'Poppins,sans-serif',
        }}>
          {mentorData.bio}
        </p>

        {/* Public Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 12, marginBottom: 20,
        }}>
          {mentorData.publicInfo.studentsHelped && (
            <StatCard icon="👨‍🎓" label="Students Helped" value={formatNumber(mentorData.studentsHelped)} />
          )}
          {mentorData.publicInfo.solvedDoubts && (
            <StatCard icon="✅" label="Doubts Solved" value={formatNumber(mentorData.solvedDoubts)} />
          )}
          {mentorData.publicInfo.previousPosts && (
            <StatCard icon="📝" label="Posts" value={formatNumber(mentorData.previousPosts)} />
          )}
          {mentorData.publicInfo.testMaterials && (
            <StatCard icon="📚" label="Materials" value={formatNumber(mentorData.testMaterials)} />
          )}
          {mentorData.publicInfo.testsConducted && (
            <StatCard icon="📋" label="Tests" value={formatNumber(mentorData.testsConducted)} />
          )}
        </div>

        {/* Locked Content (Monthly Students Only) */}
        <div style={{
          background: 'var(--color-background, #F8FAFC)',
          borderRadius: 12,
          padding: 16,
          border: '1px solid var(--color-border, #E2E8F0)',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h4 style={{
              fontSize: 15, fontWeight: 600, color: 'var(--color-text, #1E293B)',
              margin: 0, fontFamily: 'Poppins,sans-serif',
            }}>
              🔒 Premium Content (Monthly Students Only)
            </h4>
            <button
              onClick={() => setShowLockedContent(!showLockedContent)}
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #E8C84A)',
                border: 'none', borderRadius: 8, padding: '6px 14px',
                color: '#1E3A5F', fontWeight: 700, fontSize: 12,
                cursor: 'pointer', fontFamily: 'Poppins,sans-serif',
              }}
            >
              {showLockedContent ? 'Hide' : 'Unlock (Monthly Plan)'}
            </button>
          </div>
          {showLockedContent ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
              <StatCard icon="👥" label="Monthly Students" value={mentorData.monthlyStudents} locked={false} />
              <StatCard icon="📞" label="Contact Info" value="Available" locked={false} />
              <StatCard icon="📊" label="Detailed Analytics" value="Available" locked={false} />
              <StatCard icon="🎯" label="1-on-1 Sessions" value="Available" locked={false} />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
              <StatCard icon="👥" label="Monthly Students" value="???" locked={true} />
              <StatCard icon="📞" label="Contact Info" value="???" locked={true} />
              <StatCard icon="📊" label="Detailed Analytics" value="???" locked={true} />
              <StatCard icon="🎯" label="1-on-1 Sessions" value="???" locked={true} />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/guru-hub/post-doubt')}
            style={{
              flex: 1, minWidth: 140, padding: '12px 20px',
              borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, var(--color-accent, #C9A84C), var(--color-accent-dark, #B8942E))',
              color: 'var(--color-primary, #1E3A5F)', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', fontFamily: 'Poppins,sans-serif',
            }}
          >
            💬 Ask a Doubt
          </button>
          <button
            onClick={() => navigate('/pro')}
            style={{
              flex: 1, minWidth: 140, padding: '12px 20px',
              borderRadius: 10, border: '2px solid var(--color-accent, #C9A84C)',
              background: 'transparent',
              color: 'var(--color-accent, #C9A84C)', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', fontFamily: 'Poppins,sans-serif',
            }}
          >
            🚀 Join Monthly Plan
          </button>
        </div>
      </div>
    )
  }

  // Directory view (standalone page with filters)
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{
          fontSize: 28, fontWeight: 800, color: 'var(--color-text, #1E293B)',
          marginBottom: 8, fontFamily: 'Poppins,sans-serif',
        }}>
          👨‍🏫 Find Your Perfect Mentor
        </h1>
        <p style={{
          fontSize: 14, color: 'var(--color-text-secondary, #64748B)',
          fontFamily: 'Poppins,sans-serif',
        }}>
          Browse mentors and institutions. Filter by language, exam, topic, city, and more.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search by name, subject, exam, or location..."
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 12,
            border: '1px solid var(--color-border, #E2E8F0)',
            background: 'var(--color-surface, #FFFFFF)',
            color: 'var(--color-text, #1E293B)',
            fontSize: 14, fontFamily: 'Poppins,sans-serif',
            outline: 'none',
          }}
        />
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20,
        padding: 12, background: 'var(--color-surface, #FFFFFF)',
        borderRadius: 12, border: '1px solid var(--color-border, #E2E8F0)',
      }}>
        {Object.entries(FILTER_OPTIONS).map(([key, options]) => (
          <select
            key={key}
            value={filters[key] || options[0]}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 8,
              border: '1px solid var(--color-border, #E2E8F0)',
              background: 'var(--color-background, #F8FAFC)',
              color: 'var(--color-text, #1E293B)',
              fontSize: 13, fontFamily: 'Poppins,sans-serif',
              cursor: 'pointer', outline: 'none',
              minWidth: 120,
            }}
          >
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ))}
      </div>

      {/* Results Count */}
      <p style={{
        fontSize: 13, color: 'var(--color-text-secondary, #94A3B8)',
        marginBottom: 16, fontFamily: 'Poppins,sans-serif',
      }}>
        Showing {filteredProfiles.length} {filteredProfiles.length === 1 ? 'result' : 'results'}
      </p>

      {/* Profile Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredProfiles.map((profile) => (
          <div
            key={profile.id}
            onClick={() => setSelectedProfile(profile)}
            style={{
              background: 'var(--color-surface, #FFFFFF)',
              borderRadius: 14,
              padding: 20,
              boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
              border: '1px solid var(--color-border, #E2E8F0)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,0,0,0.05)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              {/* Avatar */}
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'var(--color-background, #F1F5F9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30, flexShrink: 0,
              }}>
                {profile.avatar}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <h3 style={{
                    fontSize: 16, fontWeight: 700, color: 'var(--color-text, #1E293B)',
                    margin: 0, fontFamily: 'Poppins,sans-serif',
                  }}>
                    {profile.name}
                  </h3>
                  <span style={{
                    background: profile.type === 'institution' ? '#8B5CF6' : '#3B82F6',
                    color: '#FFF', padding: '2px 8px', borderRadius: 6,
                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                  }}>
                    {profile.type}
                  </span>
                  {profile.isPro && (
                    <span style={{
                      background: 'linear-gradient(135deg, #C9A84C, #E8C84A)',
                      color: '#1E3A5F', padding: '2px 6px', borderRadius: 4,
                      fontSize: 10, fontWeight: 700,
                    }}>
                      PRO
                    </span>
                  )}
                  {profile.isNewMember && (
                    <span style={{
                      background: '#10B981', color: '#FFF', padding: '2px 6px',
                      borderRadius: 4, fontSize: 10, fontWeight: 700,
                    }}>
                      NEW
                    </span>
                  )}
                </div>
                <p style={{
                  fontSize: 13, color: 'var(--color-text-secondary, #64748B)',
                  margin: '3px 0', fontFamily: 'Poppins,sans-serif',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {profile.title}
                </p>
                <p style={{
                  fontSize: 12, color: 'var(--color-text-secondary, #94A3B8)',
                  margin: 0, fontFamily: 'Poppins,sans-serif',
                }}>
                  📍 {profile.location} · 🗣️ {profile.languages.slice(0, 3).join(', ')}
                  {profile.languages.length > 3 ? ` +${profile.languages.length - 3}` : ''}
                </p>

                {/* Quick Stats */}
                <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary, #64748B)', fontFamily: 'Poppins,sans-serif' }}>
                    ⭐ {profile.rating} ({profile.reviewCount})
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary, #64748B)', fontFamily: 'Poppins,sans-serif' }}>
                    👨‍🎓 {formatNumber(profile.studentsHelped)} students
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary, #64748B)', fontFamily: 'Poppins,sans-serif' }}>
                    ✅ {formatNumber(profile.solvedDoubts)} doubts
                  </span>
                </div>

                {/* Exam Tags */}
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                  {profile.exams.slice(0, 4).map(exam => (
                    <span key={exam} style={{
                      background: 'var(--color-background, #F1F5F9)',
                      color: 'var(--color-text-secondary, #64748B)',
                      padding: '2px 8px', borderRadius: 6,
                      fontSize: 11, fontFamily: 'Poppins,sans-serif',
                    }}>
                      {exam}
                    </span>
                  ))}
                  {profile.exams.length > 4 && (
                    <span style={{
                      color: 'var(--color-accent, #C9A84C)',
                      fontSize: 11, fontFamily: 'Poppins,sans-serif',
                    }}>
                      +{profile.exams.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <span style={{
                fontSize: 20, color: 'var(--color-text-secondary, #94A3B8)',
                alignSelf: 'center',
              }}>
                →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProfiles.length === 0 && (
        <div style={{
          textAlign: 'center', padding: 40,
          color: 'var(--color-text-secondary, #94A3B8)',
          fontFamily: 'Poppins,sans-serif',
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p style={{ fontSize: 16, fontWeight: 600 }}>No mentors found</p>
          <p style={{ fontSize: 13 }}>Try adjusting your filters or search query</p>
        </div>
      )}

      {/* Selected Profile Modal */}
      {selectedProfile && (
        <div
          onClick={() => setSelectedProfile(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-surface, #FFFFFF)',
              borderRadius: 16, padding: 24,
              maxWidth: 650, width: '100%', maxHeight: '85vh',
              overflow: 'auto', position: 'relative',
            }}
          >
            <button
              onClick={() => setSelectedProfile(null)}
              style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(0,0,0,0.5)', color: '#FFF',
                border: 'none', borderRadius: '50%', width: 32, height: 32,
                cursor: 'pointer', fontSize: 16, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              ✕
            </button>
            <MentorProfile mentorData={selectedProfile} />
          </div>
        </div>
      )}
    </div>
  )
}

// Helper Components
function StatCard({ icon, label, value, locked = false }) {
  return (
    <div style={{
      background: locked ? 'var(--color-background, #F1F5F9)' : 'var(--color-surface, #FFFFFF)',
      borderRadius: 10,
      padding: 12,
      textAlign: 'center',
      border: '1px solid var(--color-border, #E2E8F0)',
      opacity: locked ? 0.6 : 1,
    }}>
      <div style={{ fontSize: 24, marginBottom: 4 }}>{locked ? '🔒' : icon}</div>
      <p style={{
        fontSize: 18, fontWeight: 700, color: locked ? 'var(--color-text-secondary, #94A3B8)' : 'var(--color-text, #1E293B)',
        margin: 0, fontFamily: 'Poppins,sans-serif',
      }}>
        {value}
      </p>
      <p style={{
        fontSize: 11, color: 'var(--color-text-secondary, #94A3B8)',
        margin: 0, fontFamily: 'Poppins,sans-serif',
      }}>
        {label}
      </p>
    </div>
  )
}

function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}