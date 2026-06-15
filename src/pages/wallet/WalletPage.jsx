// src/pages/wallet/WalletPage.jsx
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const SAMPLE_TRANSACTIONS = [
  { id: 1, date: '2025-01-15', description: 'Signup Bonus 🎉',     amount: +200, type: 'credit' },
  { id: 2, date: '2025-01-16', description: 'Daily Quiz',          amount: +50,  type: 'credit' },
  { id: 3, date: '2025-01-17', description: 'Math Blitz 🧮',       amount: +15,  type: 'credit' },
  { id: 4, date: '2025-01-17', description: 'Memory Matrix 🧠',    amount: +25,  type: 'credit' },
  { id: 5, date: '2025-01-18', description: 'Guru Hub Answer ✍️',  amount: +5,   type: 'credit' },
  { id: 6, date: '2025-01-18', description: 'Current Affairs Read',amount: +5,   type: 'credit' },
]

const COIN_PACKS = [
  { label: '100 Coins',  price: '₹9',   coins: 100 },
  { label: '500 Coins',  price: '₹39',  coins: 500 },
  { label: '1,200 Coins',price: '₹79',  coins: 1200 },
  { label: '3,000 Coins',price: '₹149', coins: 3000 },
]

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function WalletPage() {
  const { user } = useAuth()
  if (!user) return null

  const total = SAMPLE_TRANSACTIONS.reduce((s, t) => s + t.amount, 0)

  return (
    <AppLayout title="My Wallet">
      <div className="max-w-2xl mx-auto space-y-6 p-4">

        {/* Coins card */}
        <div className="rounded-2xl p-6 shadow-lg" style={{ background:'linear-gradient(135deg, var(--color-accent, #D4AF37), var(--color-accent-light, #E8C84A))', color:'var(--color-primary, #1E3A5F)' }}>
          <p className="text-sm font-semibold opacity-75 mb-1">Your TryIT Coins</p>
          <p className="text-6xl font-black">{(user.coins ?? 0).toLocaleString('en-IN')}</p>
          <p className="text-sm mt-2 opacity-75">🪙 Coins earned through learning — never expire</p>
        </div>

        {/* Transaction history */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-lg" style={{ color:'var(--color-primary, #1E3A5F)' }}>Transaction History</h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {SAMPLE_TRANSACTIONS.map(tx => (
              <li key={tx.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                  <p className="text-xs text-gray-400">{fmt(tx.date)}</p>
                </div>
                <span className={`text-base font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`} style={{ color: tx.type === 'credit' ? 'var(--color-success, #22C55E)' : 'var(--color-error, #EF4444)' }}>
                  {tx.type === 'credit' ? '+' : ''}{tx.amount} 🪙
                </span>
              </li>
            ))}
          </ul>
          <div className="px-5 py-4 bg-gray-50 rounded-b-2xl flex justify-between">
            <span className="text-sm text-gray-500">Lifetime earned</span>
            <span className="font-bold" style={{ color:'var(--color-accent, #D4AF37)' }}>+{total} 🪙</span>
          </div>
        </div>

        {/* Coin packs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-lg mb-1" style={{ color:'var(--color-primary, #1E3A5F)' }}>Buy Coin Packs</h2>
          <p className="text-gray-400 text-sm mb-4">Payments launching soon — payments via Razorpay.</p>
          <div className="grid grid-cols-2 gap-3">
            {COIN_PACKS.map(p => (
              <div key={p.label} className="border border-gray-200 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-xl">🪙</span>
                <p className="font-bold text-sm" style={{ color:'var(--color-primary, #1E3A5F)' }}>{p.label}</p>
                <p className="font-black" style={{ color:'var(--color-accent, #D4AF37)' }}>{p.price}</p>
                <button disabled className="mt-1 py-1 rounded-lg bg-gray-200 text-gray-400 text-xs font-semibold cursor-not-allowed">Coming Soon</button>
              </div>
            ))}
          </div>
        </div>

        {/* Redeem */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-lg mb-1" style={{ color:'var(--color-primary, #1E3A5F)' }}>Redeem Coins</h2>
          <p className="text-gray-500 text-sm mb-3">Exchange coins for Pro days, merchandise, and exclusive rewards.</p>
          <div className="flex gap-3">
            <div className="flex-1 border border-dashed border-gray-300 rounded-xl p-3 text-center text-gray-400 text-sm">
              Pro Extension<br /><span className="font-bold" style={{ color:'var(--color-accent, #D4AF37)' }}>500 🪙 = 7 days Pro</span>
            </div>
            <div className="flex-1 border border-dashed border-gray-300 rounded-xl p-3 text-center text-gray-400 text-sm">
              TryIT Merch<br /><span className="font-bold" style={{ color:'var(--color-accent, #D4AF37)' }}>2,000 🪙</span>
            </div>
          </div>
          <button disabled className="mt-3 w-full py-2 rounded-xl bg-gray-200 text-gray-400 font-semibold text-sm cursor-not-allowed">Redemptions Coming Soon</button>
        </div>

      </div>
    </AppLayout>
  )
}