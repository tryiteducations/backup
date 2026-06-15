// src/pages/mentor/CashbackCenter.jsx
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const HOW_IT_WORKS = [
  { step: '1', text: 'You refer students to TryIT using your referral code.' },
  { step: '2', text: 'When a referred student upgrades to Pro, you earn a cashback percentage of their payment.' },
  { step: '3', text: 'Cashback is held for a 30-day qualification window before payout (to account for refunds).' },
  { step: '4', text: 'Qualified earnings are paid out monthly to your registered UPI ID.' },
]

export default function CashbackCenter() {
  const { user } = useAuth()
  if (!user) return null

  const daysIntoMonth = new Date().getDate()
  const qualProgress = Math.min(daysIntoMonth, 30)

  return (
    <AppLayout title="Cashback Center">
      <div className="max-w-2xl mx-auto space-y-6 p-4">

        {/* Pending cashback */}
        <div className="bg-gradient-to-br from-[var(--color-accent, #D4AF37)] to-[var(--color-accent-light, #E8C84A)] rounded-2xl p-6 text-[var(--color-primary-dark, #0F2140)] shadow-lg">
          <p className="text-sm opacity-75">Pending Cashback</p>
          <p className="text-5xl font-black mt-1">₹0.00</p>
          <p className="text-sm mt-2 opacity-75">Refer students who upgrade to Pro to start earning.</p>
        </div>

        {/* Qualification progress */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="font-bold text-[var(--color-primary, #1E3A5F)]">Monthly Qualification Window</h2>
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Day {qualProgress} of 30</span>
            <span className="font-semibold text-[var(--color-accent, #D4AF37)]">{Math.round((qualProgress/30)*100)}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent, #D4AF37)] rounded-full transition-all"
              style={{ width: `${(qualProgress/30)*100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">
            Referrals from this month qualify for payout after the 30-day window ends.
            Earnings with refunded subscriptions are automatically voided.
          </p>
        </div>

        {/* Payout history */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-[var(--color-primary, #1E3A5F)]">Payout History</h2>
          </div>
          <div className="text-center py-10 text-gray-400 px-6">
            <p className="text-3xl mb-2">💳</p>
            <p className="text-sm font-medium text-gray-500">No payouts yet</p>
            <p className="text-xs mt-1">Your first payout will appear here after the 30-day qualification period.</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="font-bold text-[var(--color-primary, #1E3A5F)]">How Cashback Works</h2>
          {HOW_IT_WORKS.map(h => (
            <div key={h.step} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary-dark, #0F2140)] text-xs font-black flex items-center justify-center shrink-0">{h.step}</span>
              <p className="text-sm text-gray-600">{h.text}</p>
            </div>
          ))}
          <div className="mt-2 bg-[#FDF6E3] rounded-xl p-3">
            <p className="text-xs text-[#7C2D12] font-semibold">💡 Cashback rate: 10% of Pro subscription value per referral. Minimum payout threshold: ₹50.</p>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}s