// FILE: src/pages/Dashboard.jsx - Smart Role-Based Router
// Routes users to their correct dashboard based on role
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
      return
    }
    const role = user.role || localStorage.getItem('tryit_role') || 'student'
    switch (role) {
      case 'mentor':
        navigate('/mentor-hub', { replace: true })
        break
      case 'institution':
        navigate('/institution', { replace: true })
        break
      case 'family':
        navigate('/family', { replace: true })
        break
      case 'admin':
        navigate('/admin/dashboard', { replace: true })
        break
      case 'student':
      default:
        navigate('/student', { replace: true })
        break
    }
  }, [user, navigate])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-background, #F8FAFC)', fontFamily: 'Poppins,sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔄</div>
        <p style={{ color: 'var(--color-text, #1E293B)', fontSize: 16, fontWeight: 600 }}>
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  )
}