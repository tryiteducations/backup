import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const GAMES = [
  {
    id: 'math-blitz',
    emoji: '⚡',
    title: 'Math Blitz',
    desc: 'Solve 10 questions in 60 seconds',
    coins: '5–50 coins',
    path: '/games/math-blitz',
    badge: 'Most Popular',
    badgeColor: 'var(--color-accent, #D4AF37)',
    accent: 'var(--color-primary, #1E3A5F)',
    bg: 'linear-gradient(135deg, var(--color-primary, #1E3A5F) 0%, var(--color-primary-dark, #0F2140) 100%)',
    tags: ['Maths', 'Speed'],
  },
  {
    id: 'word-rush',
    emoji: '📝',
    title: 'Word Rush',
    desc: 'Spot the correct spelling first',
    coins: '5–30 coins',
    path: '/games/word-rush',
    badge: null,
    accent: '#064E3B',
    bg: 'linear-gradient(135deg, #064E3B 0%, #065f46 100%)',
    tags: ['English', 'Vocab'],
  },
  {
    id: 'gk-blitz',
    emoji: '🌍',
    title: 'GK Burst',
    desc: '10 GK questions, 30 seconds each',
    coins: '10–40 coins',
    path: '/games/gk-blitz',
    badge: 'Daily Reset',
    badgeColor: '#4C1D95',
    accent: '#4C1D95',
    bg: 'linear-gradient(135deg, #4C1D95 0%, #3B2A6B 100%)',
    tags: ['GK', 'Current Affairs'],
  },
  {
    id: 'logic-grid',
    emoji: '🧩',
    title: 'Logic Grid',
    desc: 'Fill the number grid using clues',
    coins: '15–60 coins',
    path: '/games/logic-grid',
    badge: 'Brain Boost',
    badgeColor: '#7C2D12',
    accent: '#7C2D12',
    bg: 'linear-gradient(135deg, #7C2D12 0%, #9a3412 100%)',
    tags: ['Reasoning', 'Logic'],
  },
]

export default function GamesHub() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const gamesPlayed = user.testsCompleted ?? 0 // proxy until games table exists
  const bestStreak = user.streak ?? 0
  const rank = user.rank

  return (
    <AppLayout title="Games">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 26, color: 'var(--color-primary, #1E3A5F)', margin: '0 0 4px' }}>
            🎮 Exam Games
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', color: '#64748b', fontSize: 14, margin: 0 }}>
            Play, earn coins, and sharpen exam skills — all in one place.
          </p>
        </div>

        {/* Stats Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 32,
        }}>
          <StatCard emoji="🪙" label="My Coins" value={user.coins ?? 0} highlight />
          <StatCard
            emoji="🏅"
            label="Games Rank"
            value={rank != null ? `#${rank}` : null}
            emptyMsg="Play to rank up!"
          />
          <StatCard emoji="🎮" label="Games Played" value={gamesPlayed} emptyMsg="0" />
          <StatCard emoji="🔥" label="Best Streak" value={bestStreak > 0 ? `${bestStreak} days` : null} emptyMsg="Start a streak!" />
        </div>

        {/* Game Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(390px, 1fr))',
          gap: 18,
        }}>
          {GAMES.map(game => (
            <GameCard key={game.id} game={game} onPlay={() => navigate(game.path)} />
          ))}
        </div>

        {/* Coins legend */}
        <div style={{
          marginTop: 32,
          background: '#FEF9EC', border: '1px solid var(--color-accent-light, #E8C84A)',
          borderRadius: 12, padding: '12px 18px',
          fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#92400e',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <span>Coins earned in games are added to your wallet instantly. Higher scores = more coins!</span>
        </div>
      </div>
    </AppLayout>
  )
}

function StatCard({ emoji, label, value, highlight, emptyMsg }) {
  const display = value != null && value !== 0 && value !== '' ? value : null
  return (
    <div style={{
      background: highlight ? 'linear-gradient(135deg, var(--color-primary, #1E3A5F), var(--color-primary-dark, #0F2140))' : '#fff',
      borderRadius: 14,
      border: highlight ? 'none' : '1.5px solid #e2e8f0',
      padding: '16px 18px',
      boxShadow: highlight ? '0 4px 18px rgba(30,58,95,0.18)' : 'none',
    }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>
      <div style={{
        fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 22,
        color: highlight ? 'var(--color-accent, #D4AF37)' : (display ? 'var(--color-primary, #1E3A5F)' : '#94a3b8'),
        lineHeight: 1.1, marginBottom: 2,
      }}>
        {display ?? emptyMsg ?? '—'}
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: highlight ? '#94a3b8' : '#64748b', letterSpacing: '0.04em' }}>
        {label.toUpperCase()}
      </div>
    </div>
  )
}

function GameCard({ game, onPlay }) {
  return (
    <div style={{
      background: game.bg,
      borderRadius: 18,
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform 0.18s, box-shadow 0.18s',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'
      }}
    >
      {/* Badge */}
      {game.badge && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: game.badgeColor,
          borderRadius: 8, padding: '3px 12px',
          fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 11, color: '#fff',
        }}>
          {game.badge}
        </div>
      )}

      {/* Decorative circle */}
      <div style={{
        position: 'absolute', right: -20, bottom: -20,
        width: 100, height: 100, borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        pointerEvents: 'none',
      }} />

      <div style={{ fontSize: 40, marginBottom: 12 }}>{game.emoji}</div>

      <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 20, color: '#fff', marginBottom: 6 }}>
        {game.title}
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 16, lineHeight: 1.5 }}>
        {game.desc}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {game.tags.map(t => (
          <span key={t} style={{
            background: 'rgba(255,255,255,0.12)', borderRadius: 6, padding: '2px 10px',
            fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.85)',
          }}>{t}</span>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--color-accent, #D4AF37)',
        }}>
          🪙 {game.coins}
        </span>
        <button
          onClick={onPlay}
          style={{
            background: 'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))',
            border: 'none', borderRadius: 10,
            padding: '9px 22px',
            fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 13,
            color: 'var(--color-primary, #1E3A5F)', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(212,175,55,0.35)',
          }}
        >
          Play Now →
        </button>
      </div>
    </div>
  )
}