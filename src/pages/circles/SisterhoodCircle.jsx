// src/pages/circles/SisterhoodCircle.jsx
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const SAMPLE_POSTS = [
  { id: 1, author: 'Anjali R.', initials: 'AR', time: '1 hr ago',   content: 'Just scored 88% in the UPSC Geography mock 🎉 Consistency really is the key — 2 hours daily for 3 weeks made all the difference!' },
  { id: 2, author: 'Deepa M.', initials: 'DM', time: '4 hrs ago',   content: 'Any tips for managing exam prep with household responsibilities? Balancing is tough but we\'re doing it 💪' },
  { id: 3, author: 'Kavitha S.', initials: 'KS', time: '1 day ago', content: 'Sharing a free PDF for NDA Mathematics — helped me a lot. Will upload to GuruBooks shortly 📚' },
]

const RESOURCES = [
  { emoji: '🎓', title: 'Scholarships for Women', desc: 'Pragati Scholarship (AICTE), Ishan Uday, INSPIRE — explore 40+ grants exclusively for female students.', link: '#' },
  { emoji: '👩‍🏫', title: "Women's Mentorship Program", desc: 'Connect with female mentors across UPSC, Engineering, Medical, and Banking on the Guru Hub.', link: '/guru-hub' },
  { emoji: '🛡️', title: 'Safety & Support Resources', desc: 'iCall Helpline: 9152987821 | Women\'s Helpline: 181 | Cybercrime: cybercrime.gov.in', link: null },
]

const GUIDELINES = [
  'Be kind, be real — this is a space of mutual support, not competition.',
  'No hate speech, casteism, body shaming, or discriminatory remarks of any kind.',
  'Respect each other\'s privacy — do not share personal information of other members.',
  'Academic integrity: no cheating tips. Help each other learn, not shortcut.',
  'Violations are reported to our safety team immediately. Zero tolerance applies.',
]

export default function SisterhoodCircle() {
  const { user } = useAuth()
  const [posts, setPosts] = useState(SAMPLE_POSTS)
  const [postText, setPostText] = useState('')

  if (!user) return null

  const handlePost = () => {
    if (!postText.trim()) return
    const newPost = {
      id: Date.now(),
      author: user.name,
      initials: user.initials || user.name.slice(0, 2).toUpperCase(),
      time: 'Just now',
      content: postText.trim(),
    }
    setPosts(prev => [newPost, ...prev])
    setPostText('')
  }

  return (
    <AppLayout title="Sisterhood Circle">
      <div className="max-w-2xl mx-auto space-y-6 p-4">

        {/* Hero */}
        <div className="bg-gradient-to-br from-[#7C2D12] to-[#4C1D95] rounded-2xl p-5 text-white">
          <p className="text-2xl font-bold">🌸 Sisterhood Circle</p>
          <p className="text-sm opacity-75 mt-1">A safe, supportive community space for women & non-binary students. Lift each other, grow together.</p>
        </div>

        {/* Guidelines */}
        <details className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <summary className="p-4 font-bold text-[var(--color-primary, #1E3A5F)] cursor-pointer select-none">🛡️ Community Guidelines (tap to read)</summary>
          <ul className="px-5 pb-4 space-y-2">
            {GUIDELINES.map((g, i) => (
              <li key={i} className="text-sm text-gray-600 flex gap-2">
                <span className="text-[var(--color-accent, #D4AF37)] font-bold shrink-0">{i+1}.</span>{g}
              </li>
            ))}
          </ul>
        </details>

        {/* Post box */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <textarea
            placeholder="Share a thought, tip, or encouragement with the circle..."
            value={postText}
            onChange={e => setPostText(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-accent, #D4AF37)]"
          />
          <div className="flex justify-end">
            <button
              onClick={handlePost}
              disabled={!postText.trim()}
              className="px-5 py-2 bg-[var(--color-accent, #D4AF37)] disabled:bg-gray-200 disabled:text-gray-400 text-[var(--color-primary-dark, #0F2140)] font-bold rounded-xl text-sm hover:bg-[var(--color-accent-light, #E8C84A)] transition"
            >
              Post
            </button>
          </div>
        </div>

        {/* Posts feed */}
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">
              <div className="w-9 h-9 rounded-full bg-[#7C2D12] text-white text-xs font-bold flex items-center justify-center shrink-0">{p.initials}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-[var(--color-primary, #1E3A5F)] text-sm">{p.author}</p>
                  <p className="text-xs text-gray-400">{p.time}</p>
                </div>
                <p className="text-sm text-gray-700 mt-1">{p.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Resources */}
        <div>
          <h2 className="font-bold text-[var(--color-primary, #1E3A5F)] text-lg mb-3">Resources</h2>
          <div className="space-y-3">
            {RESOURCES.map(r => (
              <div key={r.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3 items-start">
                <span className="text-2xl">{r.emoji}</span>
                <div>
                  <p className="font-semibold text-[var(--color-primary, #1E3A5F)] text-sm">{r.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  )
}