// src/pages/current-affairs/CurrentAffairs.jsx
import { useState, useEffect } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const IS_DEV =
  !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL.includes('placeholder')

const CATEGORIES = [
  'All',
  'National',
  'International',
  'Economy',
  'Science & Tech',
  'Sports',
  'Awards',
  'Environment',
  'Defence',
]

const FALLBACK_ARTICLES = [
  {
    id: 'ca1',
    title: 'India Launches GSAT-20 Communication Satellite',
    summary:
      'ISRO successfully launched GSAT-20, India\'s heaviest communication satellite, aboard SpaceX\'s Falcon-9 rocket. The satellite will boost in-flight internet and remote broadband across India.',
    source: 'ISRO Press Release',
    date: '2024-11-18',
    category: 'Science & Tech',
    emoji: '🛰️',
  },
  {
    id: 'ca2',
    title: 'India Retains 3rd Largest Economy Status by GDP-PPP',
    summary:
      'IMF\'s World Economic Outlook confirms India is now the third-largest economy in PPP terms, surpassing Japan. GDP growth forecast for FY25 stands at 7%, highest among G20 nations.',
    source: 'IMF World Economic Outlook',
    date: '2024-11-15',
    category: 'Economy',
    emoji: '📈',
  },
  {
    id: 'ca3',
    title: 'COP29 Concludes with $300B Climate Finance Agreement',
    summary:
      'The UN Climate Conference in Baku reached a landmark deal where developed nations committed $300 billion annually by 2035 to help developing nations tackle climate change and fund green transitions.',
    source: 'UNFCCC',
    date: '2024-11-22',
    category: 'Environment',
    emoji: '🌍',
  },
  {
    id: 'ca4',
    title: 'Praveen Kumar Wins Gold at Paris Paralympics',
    summary:
      'India\'s Praveen Kumar won gold in high jump at the Paris 2024 Paralympic Games, setting a new Asian record. India finished with 7 gold medals — its best-ever Paralympic performance.',
    source: 'Sports Authority of India',
    date: '2024-09-05',
    category: 'Sports',
    emoji: '🥇',
  },
  {
    id: 'ca5',
    title: 'PM Modi Visits Kyiv — First Indian PM to Visit Ukraine',
    summary:
      'Prime Minister Narendra Modi visited Kyiv, becoming the first Indian PM to visit Ukraine. He met President Zelensky and reaffirmed India\'s commitment to peace and dialogue to end the Russia-Ukraine conflict.',
    source: 'Ministry of External Affairs',
    date: '2024-08-23',
    category: 'International',
    emoji: '✈️',
  },
  {
    id: 'ca6',
    title: 'Defence Ministry Approves ₹1.44 Lakh Crore Procurement Plan',
    summary:
      'The Defence Acquisition Council approved 10 major capital acquisition proposals worth ₹1.44 lakh crore, including Pinaka rocket systems, advanced torpedoes, and next-gen frigate ships.',
    source: 'Ministry of Defence',
    date: '2024-11-10',
    category: 'Defence',
    emoji: '🛡️',
  },
  {
    id: 'ca7',
    title: 'Nobel Peace Prize 2024 Awarded to Nihon Hidankyo',
    summary:
      'The Norwegian Nobel Committee awarded the 2024 Nobel Peace Prize to Nihon Hidankyo, a Japanese grassroots organisation of atomic bomb survivors (Hibakusha), for their efforts toward a world free of nuclear weapons.',
    source: 'Nobel Foundation',
    date: '2024-10-11',
    category: 'Awards',
    emoji: '🕊️',
  },
  {
    id: 'ca8',
    title: 'Centre Announces Unified Pension Scheme (UPS) for Govt Employees',
    summary:
      'Cabinet approved the Unified Pension Scheme effective April 2025, assuring 50% of average basic pay as pension for central government employees with 25+ years of service — a major departure from NPS.',
    source: 'Press Information Bureau',
    date: '2024-08-24',
    category: 'National',
    emoji: '📋',
  },
  {
    id: 'ca9',
    title: 'OpenAI Launches GPT-4o Realtime API for Live Voice Conversations',
    summary:
      'OpenAI unveiled its Realtime API enabling developers to build low-latency voice and text applications using GPT-4o, marking a leap forward in human-AI conversational interfaces for mobile and web.',
    source: 'OpenAI Blog',
    date: '2024-10-01',
    category: 'Science & Tech',
    emoji: '🤖',
  },
  {
    id: 'ca10',
    title: 'India\'s Unemployment Rate Falls to 7.8% — PLFS Report',
    summary:
      'The Periodic Labour Force Survey (PLFS) annual report showed India\'s unemployment rate declined to 7.8% in FY2023-24, with significant improvement in rural female labour force participation.',
    source: 'Ministry of Statistics & PI',
    date: '2024-09-25',
    category: 'Economy',
    emoji: '💼',
  },
]

export default function CurrentAffairs() {
  const { user, addCoins } = useAuth()
  const [articles, setArticles] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [readArticles, setReadArticles] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tryit_ca_read') || '{}')
      setReadArticles(stored)
    } catch {}
  }, [])

  useEffect(() => {
    async function fetchArticles() {
      if (IS_DEV) {
        setArticles(FALLBACK_ARTICLES)
        setLoading(false)
        return
      }
      try {
        // TODO: replace with Supabase current_affairs table query once populated
        // const { data } = await supabase.from('current_affairs').select('*').order('date', { ascending: false })
        setArticles(FALLBACK_ARTICLES)
      } catch {
        setArticles(FALLBACK_ARTICLES)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  if (!user) return null

  const filtered =
    activeCategory === 'All'
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  function handleExpand(id) {
    if (expanded === id) {
      setExpanded(null)
      return
    }
    setExpanded(id)
    if (!readArticles[id]) {
      const updated = { ...readArticles, [id]: true }
      setReadArticles(updated)
      localStorage.setItem('tryit_ca_read', JSON.stringify(updated))
      addCoins(5)
    }
  }

  return (
    <AppLayout title="Current Affairs">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-primary, #1E3A5F)]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Current Affairs
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">Earn +5 coins for each article you read</p>
          </div>
          <span className="text-3xl">📰</span>
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[var(--color-primary, #1E3A5F)] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[var(--color-primary, #1E3A5F)] hover:text-[var(--color-primary, #1E3A5F)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-16 text-gray-400">Loading articles…</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500 font-semibold">No articles in this category yet.</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon!</p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map((article) => {
            const isRead = readArticles[article.id]
            const isOpen = expanded === article.id
            return (
              <div
                key={article.id}
                className={`bg-white rounded-2xl border transition-all ${
                  isOpen ? 'border-[var(--color-accent, #D4AF37)] shadow-md' : 'border-gray-100 shadow-sm'
                }`}
              >
                <button
                  onClick={() => handleExpand(article.id)}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{article.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-semibold bg-[#F8FAFC] border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                          {article.category}
                        </span>
                        {isRead && (
                          <span className="text-xs font-semibold text-[var(--color-accent, #D4AF37)]">
                            ✓ Read · +5 coins earned
                          </span>
                        )}
                      </div>
                      <h3
                        className="font-bold text-[var(--color-primary, #1E3A5F)] text-base leading-snug"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>{article.source}</span>
                        <span>·</span>
                        <span>{new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <span className="text-gray-300 text-lg flex-shrink-0">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">{article.summary}</p>
                    {!isRead && (
                      <div className="mt-3 text-xs text-[var(--color-accent, #D4AF37)] font-semibold">
                        🪙 +5 coins added to your wallet!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
