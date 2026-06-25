// src/pages/student/StudentProfile.jsx
// Redirect to settings profile tab
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function StudentProfile() {
  const navigate = useNavigate()
  useEffect(() => { navigate('/student/settings', { replace: true }) }, [])
  return null
}
