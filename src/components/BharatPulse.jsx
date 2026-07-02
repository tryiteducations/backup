// FILE: src/components/BharatPulse.jsx
// Strictly for India's unknown facts - content upload with images, attribution, and past entries
import { useState, useMemo } from 'react'

const MAX_IMAGES = 7
const MAX_FILE_SIZE_MB = 10

// Sample India unknown facts for demo
const SAMPLE_FACTS = [
  {
    id: 'bp1',
    title: 'The Hidden Stepwell of Chand Baori',
    content: 'Located in Abhaneri, Rajasthan, Chand Baori is one of the deepest and largest stepwells in India. Built in the 9th century, it has 3,500 narrow steps arranged in perfect symmetry across 13 stories, descending 100 feet into the ground. Few Indians know this architectural marvel exists, yet it predates many famous monuments.',
    images: [],
    contributorName: 'Priya Sharma',
    contributorType: 'student',
    contributorCity: 'Jaipur, Rajasthan',
    date: '2026-06-28',
    category: 'Architecture',
    tags: ['Rajasthan', 'Stepwell', 'Ancient India', 'Architecture'],
  },
  {
    id: 'bp2',
    title: 'India\'s Floating Post Office',
    content: 'Dal Lake in Srinagar houses the world\'s only floating post office. Established during the British era, it operates from a beautifully carved wooden houseboat. It offers regular postal services and even has a philately museum inside. Most Indians are unaware that you can send a letter from a post office floating on water.',
    images: [],
    contributorName: 'Dr. Rajesh Kumar',
    contributorType: 'mentor',
    contributorCity: 'Srinagar, J&K',
    date: '2026-06-25',
    category: 'Unique Places',
    tags: ['Kashmir', 'Post Office', 'Dal Lake', 'Unique'],
  },
  {
    id: 'bp3',
    title: 'The Village Without Doors - Shani Shingnapur',
    content: 'In Maharashtra\'s Shani Shingnapur village, houses have no doors or locks. The villagers believe that Lord Shani protects them, and for over 300 years, there has been virtually no theft reported. Even the local bank and police station operate without doors. This unique tradition continues to this day.',
    images: [],
    contributorName: 'Amit Patel',
    contributorType: 'student',
    contributorCity: 'Ahmednagar, Maharashtra',
    date: '2026-06-20',
    category: 'Culture & Tradition',
    tags: ['Maharashtra', 'Tradition', 'Shani', 'Culture'],
  },
  {
    id: 'bp4',
    title: 'Magnetic Hill of Ladakh',
    content: 'On the Leh-Kargil highway, there\'s a stretch of road where vehicles appear to roll uphill against gravity. Known as Magnetic Hill, this optical illusion is caused by the surrounding landscape creating a false horizon. It\'s one of India\'s most fascinating natural phenomena that many Indians don\'t know exists in their own country.',
    images: [],
    contributorName: 'Excel Coaching Institute',
    contributorType: 'institution',
    contributorCity: 'Leh, Ladakh',
    date: '2026-06-15',
    category: 'Natural Wonders',
    tags: ['Ladakh', 'Magnetic Hill', 'Nature', 'Optical Illusion'],
  },
  {
    id: 'bp5',
    title: 'India\'s Living Root Bridges',
    content: 'In Meghalaya\'s dense forests, the Khasi tribe has been growing bridges from living tree roots for over 500 years. These bridges, made by guiding rubber fig tree roots across rivers, can support 50+ people and last for centuries. The most famous, Umshiang Double-Decker Bridge, is a UNESCO World Heritage candidate that few Indians have visited.',
    images: [],
    contributorName: 'Bright Future Academy',
    contributorType: 'institution',
    contributorCity: 'Shillong, Meghalaya',
    date: '2026-06-10',
    category: 'Natural Wonders',
    tags: ['Meghalaya', 'Root Bridge', 'Khasi Tribe', 'Nature'],
  },
]

const CATEGORIES = [
  'All Categories',
  'Architecture',
  'Unique Places',
  'Culture & Tradition',
  'Natural Wonders',
  'History',
  'Science & Innovation',
  'Food & Cuisine',
  'Art & Craft',
  'Festivals',
  'Wildlife',
  'Unsung Heroes',
]

export default function BharatPulse() {
  const [entries, setEntries] = useState(SAMPLE_FACTS)
  const [showPastEntries, setShowPastEntries] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    images: [],
    contributorName: '',
    contributorType: 'student',
    contributorCity: '',
    category: 'Architecture',
    tags: '',
  })
  const [imagePreviews, setImagePreviews] = useState([])

  const filteredEntries = useMemo(() => {
    let result = [...entries]

    if (selectedCategory !== 'All Categories') {
      result = result.filter(e => e.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        e.contributorCity.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    return result
  }, [entries, selectedCategory, searchQuery])

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + newEntry.images.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed`)
      return
    }

    const validFiles = files.filter(f => {
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`File "${f.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit`)
        return false
      }
      if (!f.type.startsWith('image/')) {
        alert(`File "${f.name}" is not an image`)
        return false
      }
      return true
    })

    setNewEntry(prev => ({ ...prev, images: [...prev.images, ...validFiles] }))

    // Generate previews
    const newPreviews = validFiles.map(f => URL.createObjectURL(f))
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index) => {
    setNewEntry(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = () => {
    if (!newEntry.title.trim()) {
      alert('Please enter a title')
      return
    }
    if (!newEntry.content.trim()) {
      alert('Please enter the fact content')
      return
    }
    if (!newEntry.contributorName.trim()) {
      alert('Please enter your name')
      return
    }
    if (!newEntry.contributorCity.trim()) {
      alert('Please enter your city')
      return
    }

    const entry = {
      id: `bp-${Date.now()}`,
      title: newEntry.title,
      content: newEntry.content,
      images: newEntry.images,
      contributorName: newEntry.contributorName,
      contributorType: newEntry.contributorType,
      contributorCity: newEntry.contributorCity,
      date: new Date().toISOString().split('T')[0],
      category: newEntry.category,
      tags: newEntry.tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    setEntries(prev => [entry, ...prev])
    setNewEntry({
      title: '',
      content: '',
      images: [],
      contributorName: '',
      contributorType: 'student',
      contributorCity: '',
      category: 'Architecture',
      tags: '',
    })
    setImagePreviews([])
    setShowCreateForm(false)
  }

  const getContributorBadge = (type) => {
    switch (type) {
      case 'mentor': return { bg: '#3B82F6', label: 'Mentor' }
      case 'institution': return { bg: '#8B5CF6', label: 'Institution' }
      default: return { bg: '#10B981', label: 'Student' }
    }
  }

  return (
    <div style={{
      maxWidth: 900,
      margin: '0 auto',
      padding: '0 16px',
      fontFamily: 'Poppins,sans-serif',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🇮🇳</div>
        <h1 style={{
          fontSize: 28,
          fontWeight: 800,
          color: 'var(--color-text, #1E293B)',
          marginBottom: 8,
          fontFamily: 'Poppins,sans-serif',
        }}>
          Bharat Pulse
        </h1>
        <p style={{
          fontSize: 14,
          color: 'var(--color-text-secondary, #64748B)',
          fontFamily: 'Poppins,sans-serif',
          maxWidth: 600,
          margin: '0 auto',
        }}>
          Discover India's hidden gems, unknown facts, and untold stories.
          Share fascinating facts about our incredible nation.
        </p>
      </div>

      {/* Action Bar */}
      <div style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        marginBottom: 20,
        alignItems: 'center',
      }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search facts, cities, or tags..."
          style={{
            flex: 1,
            minWidth: 200,
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid var(--color-border, #E2E8F0)',
            background: 'var(--color-surface, #FFFFFF)',
            color: 'var(--color-text, #1E293B)',
            fontSize: 13,
            fontFamily: 'Poppins,sans-serif',
            outline: 'none',
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid var(--color-border, #E2E8F0)',
            background: 'var(--color-surface, #FFFFFF)',
            color: 'var(--color-text, #1E293B)',
            fontSize: 13,
            fontFamily: 'Poppins,sans-serif',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: showCreateForm
              ? 'var(--color-border, #CBD5E1)'
              : 'linear-gradient(135deg, #FF9933, #FF6600)',
            color: showCreateForm ? 'var(--color-text, #1E293B)' : '#FFFFFF',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'Poppins,sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          {showCreateForm ? '✕ Cancel' : '🇮🇳 Share a Fact'}
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div style={{
          background: 'var(--color-surface, #FFFFFF)',
          borderRadius: 14,
          padding: 20,
          marginBottom: 20,
          border: '2px solid #FF9933',
          boxShadow: '0 2px 12px rgba(255,153,51,0.1)',
        }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-text, #1E293B)',
            marginBottom: 16,
            fontFamily: 'Poppins,sans-serif',
          }}>
            🇮🇳 Share an Unknown Fact About India
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="text"
              value={newEntry.title}
              onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Fact Title (e.g., The Hidden Stepwell of Chand Baori)"
              style={inputStyle}
            />

            <textarea
              value={newEntry.content}
              onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Describe this unknown fact in detail..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            {/* Image Upload */}
            <div>
              <label style={{
                display: 'inline-block',
                padding: '10px 16px',
                borderRadius: 8,
                border: '2px dashed var(--color-border, #CBD5E1)',
                cursor: 'pointer',
                fontSize: 13,
                color: 'var(--color-text-secondary, #64748B)',
                fontFamily: 'Poppins,sans-serif',
              }}>
                📸 Upload Images (Max {MAX_IMAGES})
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <span style={{
                fontSize: 12,
                color: 'var(--color-text-secondary, #94A3B8)',
                marginLeft: 10,
                fontFamily: 'Poppins,sans-serif',
              }}>
                {newEntry.images.length}/{MAX_IMAGES} images
              </span>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                        objectFit: 'cover',
                        border: '1px solid var(--color-border, #E2E8F0)',
                      }}
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -6,
                        background: '#EF4444',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '50%',
                        width: 22,
                        height: 22,
                        cursor: 'pointer',
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Contributor Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input
                type="text"
                value={newEntry.contributorName}
                onChange={(e) => setNewEntry(prev => ({ ...prev, contributorName: e.target.value }))}
                placeholder="Your Name"
                style={inputStyle}
              />
              <select
                value={newEntry.contributorType}
                onChange={(e) => setNewEntry(prev => ({ ...prev, contributorType: e.target.value }))}
                style={inputStyle}
              >
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="institution">Institution</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input
                type="text"
                value={newEntry.contributorCity}
                onChange={(e) => setNewEntry(prev => ({ ...prev, contributorCity: e.target.value }))}
                placeholder="Your City (e.g., Jaipur, Rajasthan)"
                style={inputStyle}
              />
              <select
                value={newEntry.category}
                onChange={(e) => setNewEntry(prev => ({ ...prev, category: e.target.value }))}
                style={inputStyle}
              >
                {CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <input
              type="text"
              value={newEntry.tags}
              onChange={(e) => setNewEntry(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Tags (comma separated, e.g., Rajasthan, Architecture, Ancient)"
              style={inputStyle}
            />

            <button
              onClick={handleSubmit}
              style={{
                padding: '12px 24px',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #FF9933, #138808)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'Poppins,sans-serif',
              }}
            >
              🇮🇳 Publish Fact
            </button>
          </div>
        </div>
      )}

      {/* Toggle Past Entries */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <p style={{
          fontSize: 13,
          color: 'var(--color-text-secondary, #94A3B8)',
          margin: 0,
          fontFamily: 'Poppins,sans-serif',
        }}>
          {filteredEntries.length} {filteredEntries.length === 1 ? 'fact' : 'facts'} found
        </p>
        <button
          onClick={() => setShowPastEntries(!showPastEntries)}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid var(--color-border, #E2E8F0)',
            background: 'var(--color-surface, #FFFFFF)',
            color: 'var(--color-text, #1E293B)',
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'Poppins,sans-serif',
          }}
        >
          {showPastEntries ? '📂 Hide Past Entries' : '📂 Show Past Entries'}
        </button>
      </div>

      {/* Entries Grid */}
      {showPastEntries && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredEntries.map((entry) => {
            const badge = getContributorBadge(entry.contributorType)
            return (
              <div
                key={entry.id}
                style={{
                  background: 'var(--color-surface, #FFFFFF)',
                  borderRadius: 14,
                  padding: 20,
                  border: '1px solid var(--color-border, #E2E8F0)',
                  boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                }}
              >
                {/* Category Badge */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span style={{
                    background: '#FFF3E0',
                    color: '#E65100',
                    padding: '3px 10px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: 'Poppins,sans-serif',
                  }}>
                    {entry.category}
                  </span>
                  {entry.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{
                      background: 'var(--color-background, #F1F5F9)',
                      color: 'var(--color-text-secondary, #64748B)',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontFamily: 'Poppins,sans-serif',
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--color-text, #1E293B)',
                  marginBottom: 8,
                  fontFamily: 'Poppins,sans-serif',
                  lineHeight: 1.4,
                }}>
                  {entry.title}
                </h3>

                {/* Content */}
                <p style={{
                  fontSize: 14,
                  color: 'var(--color-text, #334155)',
                  lineHeight: 1.7,
                  marginBottom: 12,
                  fontFamily: 'Poppins,sans-serif',
                }}>
                  {entry.content}
                </p>

                {/* Images */}
                {entry.images && entry.images.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginBottom: 12,
                  }}>
                    {entry.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                        alt={`${entry.title} - ${idx + 1}`}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 8,
                          objectFit: 'cover',
                          border: '1px solid var(--color-border, #E2E8F0)',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Contributor Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  paddingTop: 12,
                  borderTop: '1px solid var(--color-border, #E2E8F0)',
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    background: badge.bg,
                    color: '#FFF',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                    {badge.label}
                  </span>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--color-text, #1E293B)',
                    fontFamily: 'Poppins,sans-serif',
                  }}>
                    {entry.contributorName}
                  </span>
                  <span style={{
                    fontSize: 12,
                    color: 'var(--color-text-secondary, #94A3B8)',
                    fontFamily: 'Poppins,sans-serif',
                  }}>
                    📍 {entry.contributorCity}
                  </span>
                  <span style={{
                    fontSize: 12,
                    color: 'var(--color-text-secondary, #94A3B8)',
                    marginLeft: 'auto',
                    fontFamily: 'Poppins,sans-serif',
                  }}>
                    📅 {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            )
          })}

          {/* Empty State */}
          {filteredEntries.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: 40,
              color: 'var(--color-text-secondary, #94A3B8)',
              fontFamily: 'Poppins,sans-serif',
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p style={{ fontSize: 16, fontWeight: 600 }}>No facts found</p>
              <p style={{ fontSize: 13 }}>Try a different category or search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid var(--color-border, #E2E8F0)',
  background: 'var(--color-background, #F8FAFC)',
  color: 'var(--color-text, #1E293B)',
  fontSize: 13,
  fontFamily: 'Poppins,sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
}