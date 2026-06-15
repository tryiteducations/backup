// src/pages/referral/ReferralPage.jsx
import { useState } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

function makeCode(user) {
  const base = (user.userId || user.email || 'tryit').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
  return `TRYIT-${base}`
}

export default function ReferralPage() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  if (!user) return null

  const code = makeCode(user)
  const referralLink = `https://tryiteducations.net/join?ref=${code}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleShare = () => {
    const msg = `🎓 Join TryIT Educations — India's free exam prep platform!\nUse my code ${code} at signup.\n${referralLink}`
    if (navigator.share) {
      navigator.share({ title: 'TryIT Educations', text: msg, url: referralLink }).catch(() => {})
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
    }
  }

  return (
    <AppLayout title="Refer & Earn">
      <div className="max-w-xl mx-auto space-y-6 p-4">

        {/* Hero */}
        <div className="bg-gradient-to-br from-[var(--color-accent, #D4AF37)] to-[var(--color-accent-light, #E8C84A)] rounded-2xl p-6 text-[var(--color-primary-dark, #0F2140)] text-center shadow-lg">
          <p className="text-4xl mb-2">🎁</p>
          <p className="text-2xl font-black">Invite Friends, Earn Coins</p>
          <p className="text-sm mt-1 opacity-75">You earn 50 coins for every friend who joins with your code.</p>
        </div>

        {/* Referral code */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Your Referral Code</p>
          <div className="flex items-center gap-3 bg-[#FDF6E3] rounded-xl px-4 py-3">
            <span className="flex-1 font-black text-[var(--color-accent, #D4AF37)] text-2xl tracking-widest">{code}</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-[var(--color-primary, #1E3A5F)] text-white rounded-lg text-xs font-semibold hover:bg-[var(--color-primary-dark, #0F2140)] transition"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 border-2 border-[var(--color-accent, #D4AF37)] text-[var(--color-accent, #D4AF37)] rounded-xl font-semibold text-sm hover:bg-[#FDF6E3] transition"
            >
              📋 Copy Link
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 bg-[#25D366] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition"
            >
              💬 Share on WhatsApp
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-[var(--color-primary, #1E3A5F)] mb-4">Your Referral Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-[var(--color-primary, #1E3A5F)]">0</p>
              <p className="text-xs text-gray-500 mt-1">Friends Joined</p>
            </div>
            <div className="bg-[#FDF6E3] rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-[var(--color-accent, #D4AF37)]">0 🪙</p>
              <p className="text-xs text-gray-500 mt-1">Coins Earned</p>
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm mt-4">Invite 3 friends to earn your first 150 coins!</p>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-[var(--color-primary, #1E3A5F)] mb-3">How It Works</h2>
          {[
            ['1️⃣', 'Share your code with friends'],
            ['2️⃣', 'Friend signs up using your code'],
            ['3️⃣', 'You both earn 50 coins instantly!'],
          ].map(([num, text]) => (
            <div key={num} className="flex items-center gap-3 py-2">
              <span className="text-xl">{num}</span>
              <p className="text-gray-700 text-sm">{text}</p>
            </div>
          ))}
        </div>

        {/* Referred friends list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-[var(--color-primary, #1E3A5F)] mb-3">Referred Friends</h2>
          <div className="text-center py-6 text-gray-400">
            <p className="text-3xl mb-2">👥</p>
            <p className="text-sm">No referrals yet — share your link to get started!</p>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}