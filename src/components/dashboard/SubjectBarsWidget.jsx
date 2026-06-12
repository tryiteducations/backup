import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function SubjectBarsWidget() {
  const { user } = useAuth()
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { 
      if (e.isIntersecting) { 
        setAnimated(true); 
        obs.disconnect() 
      } 
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  // Safety: if subjects is missing or not an array, use empty array
  const subjects = Array.isArray(user?.subjects) ? user.subjects : []

  const weakest = subjects.length > 0 
    ? [...subjects].sort((a, b) => a.accuracy - b.accuracy)[0] 
    : null

  return (
    <div ref={ref} className="clay rounded-3xl p-6 sm:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1E3A5F] text-lg font-poppins">📊 Subject Accuracy</h3>
        <span className="text-xs text-slate-500">This month</span>
      </div>
      <div className="flex flex-col gap-3">
        {subjects.map(sub => {
          const color = sub.accuracy >= 80 ? 'bg-green-500' : sub.accuracy >= 70 ? 'bg-[#D4AF37]' : 'bg-amber-500'
          return (
            <div key={sub.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-700">{sub.emoji} {sub.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${sub.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {sub.trend === 'up' ? '↑' : '↓'}
                  </span>
                  <span className="text-sm font-bold text-[#1E3A5F]">{sub.accuracy}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div className={`h-3 rounded-full ${color} transition-all duration-1000 ease-out`}
                  style={{ width: animated ? `${sub.accuracy}%` : '0%' }} />
              </div>
            </div>
          )
        })}
      </div>
      {weakest && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Weakest: <span className="font-semibold text-red-500">{weakest.name}</span></p>
          <button className="text-[#D4AF37] text-sm font-semibold hover:underline">Practice {weakest.name} →</button>
        </div>
      )}
    </div>
  )
}