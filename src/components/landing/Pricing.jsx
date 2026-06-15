// src/pages/pricing/PricingPage.jsx
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const PRICING = [
  { key: 'trial_pass',    label: 'Trial Pass',       price_inr: 19,   description: '3-day full access — try every Pro feature risk-free.' },
  { key: 'pro_monthly',   label: 'Pro Monthly',      price_inr: 99,   description: 'Unlimited tests, all themes, ad-free — billed monthly.' },
  { key: 'pro_yearly',    label: 'Pro Yearly',       price_inr: 699,  description: 'Best value — save ₹489 vs monthly. Everything in Pro.' },
  { key: 'coin_pack_100', label: '100 Coins',        price_inr: 9,    description: 'Boost your wallet for hints, games, and more.' },
  { key: 'coin_pack_500', label: '500 Coins',        price_inr: 39,   description: 'Great for active learners who play daily.' },
  { key: 'coin_pack_1200',label: '1,200 Coins',      price_inr: 79,   description: 'Power pack — never run low mid-session.' },
  { key: 'coin_pack_3000',label: '3,000 Coins',      price_inr: 149,  description: 'Ultimate stash for serious grinders.' },
]

const PRO_BENEFITS = [
  '♾️ Unlimited practice + mock tests',
  '🎨 All 25 premium themes unlocked',
  '🚫 100% ad-free experience',
  '📊 Advanced analytics & weak-area reports',
  '📖 Mentor eBooks & GuruBooks access',
  '🔔 Priority doubt resolution in Guru Hub',
  '🏆 Exclusive Pro leaderboard ranking',
  '📱 Offline mode (download tests)',
]

export default function PricingPage() {
  const { user } = useAuth()
  if (!user) return null

  const plans = PRICING.filter(p => !p.key.startsWith('coin'))
  const coins  = PRICING.filter(p =>  p.key.startsWith('coin'))

  return (
    <AppLayout title="Pro & Pricing">
      <div className="max-w-4xl mx-auto space-y-8 p-4">

        {/* Launch banner */}
        <div style={{
          background: 'linear-gradient(90deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))',
          borderRadius: 16,
          padding: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }}>
          <span style={{ fontSize: '1.25rem' }}>🎉</span>
          <div>
            <p style={{ fontWeight: 700, color: 'var(--color-primary-dark, #0F2140)', fontSize: '1.125rem' }}>You're on Pro — free during our launch period!</p>
            <p style={{ color: 'var(--color-primary, #1E3A5F)', fontSize: '0.875rem', marginTop: 4 }}>Enjoy all features at no charge. Paid plans activate after our launch window ends (we'll give you 30 days' notice).</p>
          </div>
        </div>

        {/* Pro benefits */}
        <div className="rounded-2xl p-6 shadow-sm"
          style={{ background:'var(--color-surface, #FFFFFF)', border:'1px solid var(--color-border, #E6E9F0)' }}>
          <h2 className="text-xl font-bold mb-4" style={{ color:'var(--color-text, #1E3A5F)' }}>What's included in Pro</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRO_BENEFITS.map(b => (
              <div key={b} className="flex items-center gap-2 text-sm" style={{ color:'var(--color-text, #1E3A5F)' }}>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color:'var(--color-text, #1E3A5F)' }}>Subscription Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div key={plan.key} className="relative rounded-2xl p-5 shadow-sm flex flex-col gap-3"
                style={{
                  border: plan.key === 'pro_yearly' ? '2px solid var(--color-accent, #D4AF37)' : '1px solid var(--color-border, #E6E9F0)',
                  background: plan.key === 'pro_yearly' ? 'var(--color-surface-highlight, rgba(212,175,55,0.12))' : 'var(--color-surface, #FFFFFF)'
                }}>
                {plan.key === 'pro_yearly' && (
                  <span style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--color-accent, #D4AF37)', color: 'var(--color-primary-dark, #0F2140)', fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 999 }}>BEST VALUE</span>
                )}
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--color-primary, #1E3A5F)', fontSize: '1rem' }}>{plan.label}</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-accent, #D4AF37)' }}>₹{plan.price_inr}</p>
                  <p style={{ color: 'var(--color-muted, #6B7280)', fontSize: '0.75rem', marginTop: 6 }}>{plan.description}</p>
                </div>
                <button disabled className="mt-auto w-full py-2 rounded-xl font-semibold text-sm cursor-not-allowed"
                  style={{ background: 'var(--color-surface-muted, #F3F4F6)', color: 'var(--color-muted, #9CA3AF)' }}>
                  Coming Soon
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Coin packs */}
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color:'var(--color-text, #1E3A5F)' }}>Coin Packs</h2>
          <p className="text-sm mb-4" style={{ color:'var(--color-muted, #6B7280)' }}>Use coins for hints, brain games, and exclusive rewards.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {coins.map(pack => (
              <div key={pack.key} className="rounded-2xl p-4 shadow-sm flex flex-col gap-2"
                style={{ background: 'var(--color-surface, #FFFFFF)', border: '1px solid var(--color-border, #E6E9F0)' }}>
                <div style={{ fontSize: '1.25rem' }}>🪙</div>
                <p style={{ fontWeight: 700, color: 'var(--color-primary, #1E3A5F)' }}>{pack.label}</p>
                <p style={{ fontSize: '1.125rem', fontWeight: 900, color: 'var(--color-accent, #D4AF37)' }}>₹{pack.price_inr}</p>
                <p style={{ color: 'var(--color-muted, #9CA3AF)', fontSize: '0.75rem' }}>{pack.description}</p>
                <button disabled className="mt-auto w-full py-1.5 rounded-xl font-semibold text-xs cursor-not-allowed"
                  style={{ background: 'var(--color-surface-muted, #F3F4F6)', color: 'var(--color-muted, #9CA3AF)' }}>
                  Coming Soon
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs pb-4" style={{ color:'var(--color-muted, #9CA3AF)' }}>Payments powered by Razorpay · Secure · INR only · No hidden charges</p>
      </div>
    </AppLayout>
  )
}