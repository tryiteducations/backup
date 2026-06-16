import { useNavigate } from 'react-router-dom'

const CATS = [
  { emoji:'📋', name:'SSC Exams',         count:'312+',  color:'var(--color-primary, #1E3A5F)' },
  { emoji:'🎯', name:'UPSC & Civil',       count:'186+',  color:'var(--color-primary-dark, #0F2140)' },
  { emoji:'🏦', name:'Banking & Finance',  count:'534+',  color:'#065F46' },
  { emoji:'🚂', name:'Railways',           count:'287+',  color:'#7C3AED' },
  { emoji:'🏥', name:'Medical India',      count:'634+',  color:'#991B1B' },
  { emoji:'⚙️', name:'Engineering',        count:'1,247+',color:'#0369A1' },
  { emoji:'⚖️', name:'Law & Legal',        count:'234+',  color:'#92400E' },
  { emoji:'🎖️', name:'Defence Forces',     count:'487+',  color:'var(--color-primary, #1E3A5F)' },
  { emoji:'🎓', name:'Teaching (TET/UGC)', count:'834+',  color:'#065F46' },
  { emoji:'💼', name:'MBA & Management',   count:'312+',  color:'#7C3AED' },
  { emoji:'📚', name:'School Boards',      count:'2,400+',color:'#0369A1' },
  { emoji:'🏛️', name:'State PSC',          count:'4,200+',color:'#065F46' },
  { emoji:'💰', name:'CA/CS/CMA',          count:'1,240+',color:'#92400E' },
  { emoji:'🔧', name:'ITI & Vocational',   count:'2,340+',color:'var(--color-primary-dark, #0F2140)' },
  { emoji:'🌿', name:'AYUSH & Health',     count:'180+',  color:'#0369A1' },
  { emoji:'✈️', name:'Aviation',           count:'120+',  color:'#7C3AED' },
]

export default function ExamCategories() {
  const navigate = useNavigate()
  return (
    <section className="py-16 reveal" style={{ background:'linear-gradient(180deg, var(--color-primary-dark, #0F2140), var(--color-primary, #1E3A5F))' }}>
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-10">
          <h2 className="font-poppins font-bold" style={{ fontSize:'clamp(26px,4vw,40px)', color:'var(--color-on-dark, #FFFFFF)' }}>
            Find Your Exam
          </h2>
          <p className="mt-2" style={{ color:'var(--color-on-dark-muted, rgba(255,255,255,0.72))' }}>75,000+ exam pathways across every category</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {CATS.map(cat => (
            <button key={cat.name} onClick={() => navigate('/login')}
              className="flex flex-col items-center gap-2 rounded-2xl p-4 w-[140px] transition-all hover:-translate-y-1 group"
              style={{
                background:'rgba(var(--color-surface-rgb,255,255,255),0.08)',
                border:'1px solid rgba(var(--color-surface-rgb,255,255,255),0.16)'
              }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: cat.color }}>
                {cat.emoji}
              </div>
              <p className="font-semibold text-xs text-center leading-tight" style={{ color:'var(--color-on-dark, #FFFFFF)' }}>{cat.name}</p>
              <p className="text-xs font-semibold" style={{ color:'var(--color-accent, #D4AF37)' }}>{cat.count} series</p>
              <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color:'var(--color-accent, #D4AF37)' }}>
                Explore →
              </span>
            </button>
          ))}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => navigate('/login')} className="btn-gold px-8 py-3 rounded-2xl font-bold">
            Browse All 75,000+ Exams →
          </button>
        </div>
      </div>
    </section>
  )
}
