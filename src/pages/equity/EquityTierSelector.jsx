// src/pages/equity/EquityTierSelector.jsx
// Accessible from Landing (logged-out) AND from app (logged-in → AppLayout)
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const TIERS = [
  { id: 'hope_scholars',       emoji: '🌱', name: 'Hope Scholars',        desc: 'Students from economically weaker sections (BPL/AAY card holders)',        badge: '100% Free for Life' },
  { id: 'divyang',             emoji: '♿', name: 'Physically Challenged', desc: 'Persons with disabilities (PwD) — Divyang category per Govt of India',     badge: '100% Free for Life' },
  { id: 'swachhta_warriors',   emoji: '🧹', name: 'Swachhta Warriors',    desc: 'Sanitation workers, waste pickers, and their immediate family',             badge: '100% Free for Life' },
  { id: 'martyr_families',     emoji: '🎖️', name: "Martyr's Families",   desc: 'Families of fallen soldiers, paramilitary, or police (Veer Naris)',         badge: '100% Free for Life' },
  { id: 'transgender_youth',   emoji: '🏳️‍⚧️', name: 'Transgender Youth', desc: 'Transgender students (SMILE Portal beneficiaries and applicants)',         badge: '100% Free for Life' },
  { id: 'active_military',     emoji: '🪖', name: 'Active Military',      desc: 'Currently serving defence/paramilitary personnel and their dependents',      badge: '15-30% Discount' },
  { id: 'asha_anganwadi',      emoji: '🏥', name: 'ASHA / Anganwadi',    desc: 'Frontline health workers — ASHA, Anganwadi, and their children',            badge: '15-30% Discount' },
  { id: 'first_generation',    emoji: '🌟', name: 'First-Generation',     desc: 'First in family to pursue higher education (no parent with degree)',        badge: '15-30% Discount' },
]

function Content({ isLoggedIn }) {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      {!isLoggedIn && (
        <div className="bg-[#FDF6E3] rounded-2xl p-4 text-center">
          <p className="font-bold text-[#7C2D12]">🌱 TryIT Equity Access</p>
          <p className="text-sm text-gray-600 mt-1">We believe cost should never be a barrier to education. Select your category to apply for free or discounted access.</p>
        </div>
      )}

      <div className="space-y-3">
        {TIERS.map(tier => (
          <button
            key={tier.id}
            onClick={() => navigate('/equity/verify', { state: { tierId: tier.id, tierName: tier.name } })}
            className="w-full bg-white rounded-2xl border-2 border-gray-100 p-4 text-left flex items-start gap-4 hover:border-[var(--color-accent, #D4AF37)] hover:shadow-md transition group"
          >
            <span className="text-3xl">{tier.emoji}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-[var(--color-primary, #1E3A5F)] group-hover:text-[var(--color-accent, #D4AF37)] transition">{tier.name}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tier.badge.startsWith('100') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {tier.badge}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{tier.desc}</p>
            </div>
            <span className="text-gray-300 group-hover:text-[var(--color-accent, #D4AF37)] transition text-xl self-center">›</span>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 pb-4">
        All applications are reviewed within 3-5 business days. You'll be notified by email upon approval.
      </p>
    </div>
  )
}

export default function EquityTierSelector() {
  const { user } = useAuth()

  if (user) {
    return (
      <AppLayout title="Equity Access">
        <Content isLoggedIn={true} />
      </AppLayout>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[var(--color-primary, #1E3A5F)] px-6 py-4 flex items-center justify-between">
        <span className="text-[var(--color-accent, #D4AF37)] font-black text-xl">TryIT</span>
        <a href="/landing" className="text-white text-sm opacity-70 hover:opacity-100">← Back</a>
      </div>
      <h1 className="text-2xl font-bold text-[var(--color-primary, #1E3A5F)] text-center mt-8 mb-2">Equity Access Program</h1>
      <p className="text-gray-500 text-sm text-center mb-6">Select your category to apply for free or discounted access</p>
      <Content isLoggedIn={false} />
    </div>
  )
}