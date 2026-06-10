import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

export default function ReferralPage() {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-5xl">🔧</p>
        <h2 className="text-2xl font-bold text-[#1E3A5F] font-poppins">ReferralPage</h2>
        <p className="text-slate-500 text-sm">This page is being built. Coming soon!</p>
        <button onClick={() => navigate('/dashboard')}
          className="btn-gold px-6 py-3 rounded-2xl font-bold">
          ← Back to Dashboard
        </button>
      </div>
    </AppLayout>
  )
}
