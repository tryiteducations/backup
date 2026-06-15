// src/pages/mentor/CouponManager.jsx
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

function randomChars(n=4) {
  return Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,n)
}

function addDays(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function CouponManager() {
  const { user } = useAuth()
  const [coupons, setCoupons] = useState([])
  const [discount, setDiscount] = useState(10)
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState(null)

  if (!user) return null

  const handleGenerate = () => {
    const code = `MENTOR-${randomChars(4)}`
    const newCoupon = {
      id: Date.now(),
      code,
      discount,
      uses: 0,
      expiry: addDays(new Date(), 30),
      active: true,
    }
    setCoupons(prev => [newCoupon, ...prev])
    setCreating(false)
  }

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const handleDeactivate = (id) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: false } : c))
  }

  return (
    <AppLayout title="Coupon Manager">
      <div className="max-w-2xl mx-auto space-y-6 p-4">

        <div className="bg-gradient-to-r from-[#4C1D95] to-[#3B2A6B] rounded-2xl p-5 text-white">
          <p className="text-lg font-bold">🎟️ Coupon Manager</p>
          <p className="text-sm opacity-75 mt-1">Create discount codes for your students — they use these at checkout.</p>
        </div>

        {/* Generate button */}
        {!creating ? (
          <button
            onClick={() => setCreating(true)}
            className="w-full py-3 bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary-dark, #0F2140)] font-bold rounded-2xl hover:bg-[var(--color-accent-light, #E8C84A)] transition text-sm"
          >
            + Generate New Coupon
          </button>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h2 className="font-bold text-[var(--color-primary, #1E3A5F)]">Configure Coupon</h2>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="text-gray-600">Discount</label>
                <span className="font-bold text-[var(--color-accent, #D4AF37)]">{discount}%</span>
              </div>
              <input
                type="range" min={5} max={20} step={1}
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
                className="w-full accent-[var(--color-accent, #D4AF37)]"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>5% min</span><span>20% max</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">Expires in 30 days. Students enter this code at checkout to get {discount}% off Pro plans.</p>
            <div className="flex gap-3">
              <button onClick={handleGenerate} className="flex-1 py-2.5 bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary-dark, #0F2140)] font-bold rounded-xl text-sm hover:bg-[var(--color-accent-light, #E8C84A)] transition">
                Generate
              </button>
              <button onClick={() => setCreating(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-500 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Coupon list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-[var(--color-primary, #1E3A5F)]">Your Coupons</h2>
          </div>
          {coupons.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-3xl mb-2">🎟️</p>
              <p className="text-sm">No coupons yet — generate one above!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {coupons.map(c => (
                <li key={c.id} className="flex items-center gap-3 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono font-bold text-[var(--color-accent, #D4AF37)] text-base">{c.code}</p>
                    <p className="text-xs text-gray-400">{c.discount}% off · {c.uses} uses · Expires {c.expiry}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleCopy(c.code)}
                    className="text-xs px-2 py-1 bg-[#FDF6E3] text-[var(--color-accent, #D4AF37)] rounded-lg font-semibold hover:bg-[var(--color-accent-light, #E8C84A)] hover:text-[var(--color-primary-dark, #0F2140)] transition"
                  >
                    {copied === c.code ? '✓' : 'Copy'}
                  </button>
                  {c.active && (
                    <button
                      onClick={() => handleDeactivate(c.id)}
                      className="text-xs px-2 py-1 border border-red-200 text-red-400 rounded-lg font-semibold hover:bg-red-50 transition"
                    >
                      Deactivate
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </AppLayout>
  )
}