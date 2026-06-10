import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { GURU_DOUBTS } from '../../data/mockSeeds'

const REACTION_META = { fire:'🔥', bulb:'💡', heart:'❤️', star:'⭐' }
const EXAM_FILTERS = ['All','SSC CGL','UPSC CSE','NEET UG','IBPS PO','JEE Main','GATE CS','NDA']

export default function GuruHub() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [tab, setTab]             = useState('browse')
  const [examFilter, setExamFilter] = useState('All')
  const [reactions, setReactions]  = useState({})
  const [expandedId, setExpanded]  = useState(null)

  const filtered = examFilter === 'All'
    ? GURU_DOUBTS
    : GURU_DOUBTS.filter(d => d.examTag === examFilter)

  const handleReact = (targetId, type) => {
    setReactions(prev => ({
      ...prev,
      [`${targetId}_${type}`]: !prev[`${targetId}_${type}`],
    }))
    showToast('success', `${REACTION_META[type]} Reaction added!`)
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A5F] font-poppins">🎓 Guru Hub</h1>
          <p className="text-slate-500 text-sm mt-1">Ask doubts · Get answers · Earn coins</p>
        </div>
        <button onClick={() => navigate('/guru-hub/post-doubt')}
          className="btn-gold px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2">
          + Post Doubt
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[['👥','50,000+','Students Active'],['🎓','847','Verified Mentors'],['⚡','2 hrs','Avg Answer Time']].map(([e,v,l])=>(
          <div key={l} className="clay rounded-2xl p-4 text-center">
            <p className="text-2xl">{e}</p>
            <p className="font-bold text-[#D4AF37] text-xl font-poppins">{v}</p>
            <p className="text-slate-500 text-xs mt-1">{l}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
        {['browse','my-doubts','top-mentors'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-2xl font-semibold text-sm whitespace-nowrap flex-shrink-0 transition-all
              ${tab === t ? 'bg-[#1E3A5F] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#D4AF37]'}`}>
            {t === 'browse' ? '🔍 Browse Doubts' : t === 'my-doubts' ? '📋 My Doubts' : '🌟 Top Mentors'}
          </button>
        ))}
      </div>

      {/* Exam filter chips */}
      {tab === 'browse' && (
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {EXAM_FILTERS.map(f => (
            <button key={f} onClick={() => setExamFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all
                ${examFilter === f ? 'bg-[#D4AF37] text-[#1E3A5F]' : 'bg-white border border-slate-200 text-slate-600'}`}>
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Doubts feed */}
      {tab === 'browse' && (
        <div className="flex flex-col gap-5">
          {filtered.map(doubt => (
            <div key={doubt.id} className="clay rounded-3xl p-6">
              {/* Doubt header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#1E3A5F] text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {doubt.userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800 text-sm">{doubt.userName}</span>
                    <span className="text-xs text-slate-400">{doubt.userLevel}</span>
                    <span className="bg-[#1E3A5F] text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                      {doubt.examTag}
                    </span>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                      {doubt.subject}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block">{doubt.timeAgo} · 👁 {doubt.views} views</span>
                </div>
              </div>

              {/* Question */}
              <p className="text-[#1E293B] font-medium leading-relaxed mb-4">{doubt.question}</p>

              {/* Doubt reactions */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {Object.entries(doubt.reactions).map(([type, count]) => {
                  const key = `${doubt.id}_${type}`
                  const reacted = reactions[key]
                  return (
                    <button key={type} onClick={() => handleReact(doubt.id, type)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all
                        ${reacted ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#1E3A5F]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {REACTION_META[type]}
                      <span>{count + (reacted ? 1 : 0)}</span>
                    </button>
                  )
                })}
                <span className="text-slate-400 text-sm ml-auto">
                  {doubt.answers.length} answer{doubt.answers.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Answers */}
              <div className="flex flex-col gap-3">
                {(expandedId === doubt.id ? doubt.answers : doubt.answers.slice(0,1)).map(ans => (
                  <div key={ans.id}
                    className={`rounded-2xl p-4 ${ans.isBest ? 'bg-green-50 border-2 border-green-400' : 'bg-slate-50 border border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#1E3A5F] font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {ans.mentorInitials}
                      </div>
                      <span className="font-semibold text-sm text-slate-800">{ans.mentorName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold
                        ${ans.isBest ? 'bg-green-500 text-white' : 'bg-[#D4AF37]/20 text-[#1E3A5F]'}`}>
                        {ans.isBest ? '✅ Best Answer' : `${ans.mentorBadgeEmoji} ${ans.mentorBadge}`}
                      </span>
                      <span className="text-xs text-amber-500 font-semibold ml-auto">⭐ {ans.rating}</span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{ans.text}</p>
                    {/* Answer reactions */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {Object.entries(ans.reactions).map(([type, count]) => {
                        const key = `${ans.id}_${type}`
                        const reacted = reactions[key]
                        return (
                          <button key={type} onClick={() => handleReact(ans.id, type)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all
                              ${reacted ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#1E3A5F]' : 'bg-white border border-slate-200 text-slate-500 hover:border-[#D4AF37]'}`}>
                            {REACTION_META[type]} {count + (reacted ? 1 : 0)}
                          </button>
                        )
                      })}
                      <span className="text-slate-400 text-xs ml-auto self-center">{ans.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>

              {doubt.answers.length > 1 && (
                <button onClick={() => setExpanded(expandedId === doubt.id ? null : doubt.id)}
                  className="text-[#D4AF37] text-sm font-semibold hover:underline mt-3 block">
                  {expandedId === doubt.id ? '▲ Show less' : `▼ See all ${doubt.answers.length} answers`}
                </button>
              )}

              <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                <button onClick={() => navigate(`/guru-hub/${doubt.id}`)}
                  className="btn-gold px-4 py-2 rounded-xl font-bold text-sm">
                  Answer as Mentor
                </button>
                <button onClick={() => showToast('info','Doubt bookmarked!')}
                  className="border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-semibold text-sm hover:border-[#D4AF37] transition-colors">
                  🔖 Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Doubts tab */}
      {tab === 'my-doubts' && (
        <div className="clay rounded-3xl p-8 text-center">
          <p className="text-5xl mb-4">🤔</p>
          <p className="font-bold text-[#1E3A5F] text-xl">No doubts posted yet</p>
          <p className="text-slate-500 text-sm mt-2 mb-6">Post your first doubt and get answers in 2 hours</p>
          <button onClick={() => navigate('/guru-hub/post-doubt')}
            className="btn-gold px-8 py-3 rounded-2xl font-bold">
            Post a Doubt →
          </button>
        </div>
      )}

      {/* Top Mentors tab */}
      {tab === 'top-mentors' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { initials:'VN', name:'Vikram Nair', badge:'Thalavan', badgeEmoji:'👑', answers:234, rating:4.9, exams:'SSC · IBPS · RRB' },
            { initials:'AI', name:'Ananya IAS',  badge:'Baahuveer', badgeEmoji:'🦁', answers:189, rating:5.0, exams:'UPSC · State PSC' },
            { initials:'DK', name:'Dr. Kavitha', badge:'The Fighter',badgeEmoji:'⚔️',answers:156, rating:4.8, exams:'NEET · AIIMS' },
            { initials:'PS', name:'Prof. Srinivas',badge:'The Gold King',badgeEmoji:'🥇',answers:203,rating:5.0, exams:'JEE · GATE · BITS' },
          ].map(m => (
            <div key={m.name} className="clay rounded-2xl p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37] text-[#1E3A5F] font-bold text-lg flex items-center justify-center flex-shrink-0">
                {m.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#1E3A5F]">{m.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{m.exams}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="glass-gold text-[#1E3A5F] text-xs px-2 py-0.5 rounded-full font-bold">
                    {m.badgeEmoji} {m.badge}
                  </span>
                  <span className="text-xs text-slate-500">{m.answers} answers</span>
                  <span className="text-xs text-amber-500 font-bold">⭐ {m.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
