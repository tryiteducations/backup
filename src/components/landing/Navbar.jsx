import { useNavigate } from 'react-router-dom'
import Logo from '../Logo'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="sticky top-0 z-50 h-[68px] flex items-center justify-between px-6 md:px-10"
      style={{ background: 'rgba(30,58,95,0.94)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
      <Logo dark height={40} />
      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-1.5 text-white/70 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" /> 1,247 studying now
        </span>
        <button onClick={() => navigate('/login')} className="btn-gold px-6 py-2.5 rounded-xl font-bold text-sm">
          Login →
        </button>
      </div>
    </nav>
  )
}
