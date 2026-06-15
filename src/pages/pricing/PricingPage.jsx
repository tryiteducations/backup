// src/pages/pricing/PricingPage.jsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PLANS = [
  { label:'Trial Pass',  price:'Rs.19',  desc:'3-day full access. Try every Pro feature.',  badge:null },
  { label:'Pro Monthly', price:'Rs.99',  desc:'Unlimited tests, all themes, ad-free.',       badge:null },
  { label:'Pro Yearly',  price:'Rs.699', desc:'Best value. Save Rs.489 vs monthly.',         badge:'BEST VALUE' },
]
const COINS = [
  { label:'100 Coins',   price:'Rs.9',   desc:'Boost your wallet for hints and games.' },
  { label:'500 Coins',   price:'Rs.39',  desc:'Great for active daily learners.' },
  { label:'1200 Coins',  price:'Rs.79',  desc:'Power pack - never run low.' },
  { label:'3000 Coins',  price:'Rs.149', desc:'Ultimate stash for serious grinders.' },
]
const BENEFITS = [
  'Unlimited practice and mock tests',
  'All 25 premium themes unlocked',
  '100% ad-free experience',
  'Advanced analytics and weak-area reports',
  'Priority doubt resolution in Guru Hub',
  'Exclusive Pro leaderboard ranking',
  'Mentor eBooks and GuruBooks access',
  'Offline mode - download tests',
]

export default function PricingPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-bg, #F8FAFC)', color:'var(--color-text, #1E3A5F)' }}>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'36px 20px 60px' }}>
        <div style={{ background:'linear-gradient(135deg, var(--color-gold, #D4AF37), var(--color-gold-light, #E8C84A))',
          borderRadius:20, padding:'28px 32px', marginBottom:28, color:'var(--color-navy, #1E3A5F)' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:22, marginBottom:8 }}>
            {user ? 'You are on Pro - free during our launch period!' : 'Explore TryIT Pro plans'}
          </p>
          <p style={{ fontSize:14, opacity:0.9, marginBottom: user ? 0 : 14 }}>
            {user
              ? 'Enjoy all features at no charge. Paid plans activate after our launch window ends.'
              : 'Login to compare plans, unlock themes, and go ad-free.'}
          </p>
          {!user && (
            <button
              onClick={() => navigate('/login')}
              style={{
                marginTop: 16,
                background: 'var(--color-navy, #1E3A5F)',
                color: 'var(--color-gold, #D4AF37)',
                border: 'none',
                borderRadius: 14,
                padding: '12px 24px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Login to continue
            </button>
          )}
        </div>

        <div style={{ background:'var(--color-surface, #FFFFFF)', borderRadius:20,
          border:'1.5px solid rgba(226,232,240,0.9)', padding:24, marginBottom:28, color:'var(--color-text, #1E3A5F)' }}>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
            fontSize:18, marginBottom:16 }}>What is included in Pro</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:10 }}>
            {BENEFITS.map(b => (
              <div key={b} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ color:'var(--color-navy, #1E3A5F)', fontWeight:700 }}>✔</span>
                <span style={{ fontSize:14, color:'var(--color-muted, #64748B)' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
          fontSize:18, marginBottom:16 }}>Subscription Plans</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',
          gap:16, marginBottom:32 }}>
          {PLANS.map(p => (
            <div key={p.label} style={{ background:'var(--color-surface, #FFFFFF)', borderRadius:20, padding:20,
              border: p.badge ? '2px solid var(--color-gold, #D4AF37)' : '1.5px solid rgba(226,232,240,0.9)',
              position:'relative', color:'var(--color-text, #1E3A5F)' }}>
              {p.badge && (
                <span style={{ position:'absolute', top:-10, right:16,
                  background:'var(--color-gold, #D4AF37)', color:'var(--color-navy, #1E3A5F)', fontSize:10,
                  fontWeight:800, padding:'3px 10px', borderRadius:20 }}>{p.badge}</span>
              )}
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                fontSize:15, marginBottom:4 }}>{p.label}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                color:'var(--color-gold, #D4AF37)', fontSize:28, marginBottom:8 }}>{p.price}</p>
              <p style={{ fontSize:13, color:'var(--color-muted, #64748B)', marginBottom:16 }}>{p.desc}</p>
              <button style={{ width:'100%', background:'var(--color-navy, #1E3A5F)', color:'var(--color-gold, #D4AF37)',
                border:'none', borderRadius:12, padding:'10px 0',
                fontFamily:'Poppins,sans-serif', fontWeight:700,
                fontSize:13, cursor:'pointer' }}>Coming Soon</button>
            </div>
          ))}
        </div>

        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
          fontSize:18, marginBottom:16 }}>Coin Packs</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12 }}>
          {COINS.map(c => (
            <div key={c.label} style={{ background:'var(--color-surface, #FFFFFF)', borderRadius:16,
              border:'1.5px solid rgba(226,232,240,0.9)', padding:16, color:'var(--color-text, #1E3A5F)' }}>
              <p style={{ fontSize:24, marginBottom:4 }}>🪙</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                fontSize:14, marginBottom:2 }}>{c.label}</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                color:'var(--color-gold, #D4AF37)', fontSize:20, marginBottom:6 }}>{c.price}</p>
              <p style={{ fontSize:12, color:'var(--color-muted, #64748B)', marginBottom:12 }}>{c.desc}</p>
              <button style={{ width:'100%', background:'var(--color-bg, #F8FAFC)', color:'var(--color-muted, #64748B)',
                border:'1.5px solid rgba(226,232,240,0.9)', borderRadius:10, padding:'8px 0',
                fontSize:12, fontWeight:600, cursor:'not-allowed' }}>Coming Soon</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
