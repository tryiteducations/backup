// src/pages/equity/EquityVerification.jsx
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const TIER_REQUIREMENTS = {
  hope_scholars:     { docs: ['BPL / AAY Ration Card number', 'Income Certificate (below ₹1 lakh/yr)'], portal: null },
  divyang:           { docs: ['UDID Card number (from SWAVLAMBAN Portal)', 'Disability Certificate (40%+ disability)'], portal: 'SWAVLAMBAN Portal (swavlamban.gov.in)' },
  swachhta_warriors: { docs: ['Employer ID / municipality employment letter', 'Aadhaar (for identity verification)'], portal: 'Swachh Bharat Mission portal' },
  martyr_families:   { docs: ['Next-of-kin certificate from unit/district Sainik Board', 'Gallantry/service proof if available'], portal: 'Kendriya Sainik Board (ksb.gov.in)' },
  transgender_youth: { docs: ['Transgender Identity Certificate (issued under Transgender Persons Act 2019)', 'SMILE Portal registration ID (if available)'], portal: 'SMILE Portal (smile.dosje.gov.in)' },
  active_military:   { docs: ['Service ID card number', 'Unit/corps verification if dependent'], portal: null },
  asha_anganwadi:    { docs: ['ASHA/AWW registration ID from State NHM', 'Service letter from Block Health Officer / CDPO'], portal: 'National Health Mission state portal' },
  first_generation:  { docs: ['Self-declaration affidavit', 'School/college enrollment proof', 'Parent\'s highest qualification certificate (or absence thereof)'], portal: null },
}

function Content({ tierId, tierName }) {
  const navigate = useNavigate()
  const req = TIER_REQUIREMENTS[tierId] || { docs: ['Government-issued ID'], portal: null }
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', docNumber: '', file: null })

  const handleSubmit = () => {
    if (!form.name || !form.docNumber) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto p-4 text-center space-y-4 pt-10">
        <div className="text-6xl">✅</div>
        <h2 className="text-2xl font-bold text-[var(--color-primary, #1E3A5F)]">Application Submitted!</h2>
        <div className="bg-emerald-50 rounded-2xl p-5 text-left space-y-2">
          <p className="text-sm text-emerald-800 font-semibold">What happens next:</p>
          <p className="text-sm text-emerald-700">Our team will verify your documents within <strong>3–5 business days</strong>. Your account will be automatically upgraded once approved — no action needed from you.</p>
          <p className="text-sm text-emerald-700">You'll receive a notification at your registered email.</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-[var(--color-accent, #D4AF37)] text-[var(--color-primary-dark, #0F2140)] font-bold rounded-2xl hover:bg-[var(--color-accent-light, #E8C84A)] transition">
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 p-4">
      <div className="bg-[#FDF6E3] rounded-2xl p-4">
        <p className="font-bold text-[#7C2D12]">Applying for: {tierName}</p>
        <p className="text-sm text-gray-600 mt-0.5">Please provide accurate information. False applications may result in account suspension.</p>
      </div>

      {req.portal && (
        <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
          📎 Related govt portal: <span className="font-semibold">{req.portal}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-[var(--color-primary, #1E3A5F)]">Required Documents</h2>
        <ul className="space-y-1.5">
          {req.docs.map(d => (
            <li key={d} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-[var(--color-accent, #D4AF37)] font-bold shrink-0">•</span>{d}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-1">Full Name (as on document)</label>
          <input
            type="text"
            placeholder="e.g. Meena Devi"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent, #D4AF37)]"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-1">Document / ID Number</label>
          <input
            type="text"
            placeholder="Enter your document number"
            value={form.docNumber}
            onChange={e => setForm(f => ({ ...f, docNumber: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent, #D4AF37)]"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-1">Upload Document (PDF / Image)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => setForm(f => ({ ...f, file: e.target.files[0] }))}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FDF6E3] file:text-[var(--color-accent, #D4AF37)]"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!form.name || !form.docNumber}
        className="w-full py-3 bg-[var(--color-accent, #D4AF37)] disabled:bg-gray-200 disabled:text-gray-400 text-[var(--color-primary-dark, #0F2140)] font-bold rounded-2xl hover:bg-[var(--color-accent-light, #E8C84A)] transition"
      >
        Submit for Verification
      </button>
    </div>
  )
}

export default function EquityVerification() {
  const { user } = useAuth()
  const location = useLocation()
  const tierId   = location.state?.tierId   || new URLSearchParams(location.search).get('tier') || ''
  const tierName = location.state?.tierName || tierId

  if (user) {
    return (
      <AppLayout title="Equity Verification">
        <Content tierId={tierId} tierName={tierName} />
      </AppLayout>
    )
  }
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[var(--color-primary, #1E3A5F)] px-6 py-4 flex items-center justify-between">
        <span className="text-[var(--color-accent, #D4AF37)] font-black text-xl">TryIT</span>
        <a href="/equity" className="text-white text-sm opacity-70 hover:opacity-100">← Back</a>
      </div>
      <h1 className="text-2xl font-bold text-[var(--color-primary, #1E3A5F)] text-center mt-8 mb-6">Equity Verification</h1>
      <Content tierId={tierId} tierName={tierName} />
    </div>
  )
}