const ACTIVITIES = [
  { dot:'bg-green-500', action:'Completed SSC CGL Mock Test',  detail:'Score: 142/200 · Rank improved ↑47',  time:'2h ago'    },
  { dot:'bg-[#D4AF37]', action:'7-Day Streak Badge Unlocked 🔥',detail:'Congratulations! Keep going',         time:'Yesterday' },
  { dot:'bg-blue-500',  action:'Answered doubt in Guru Hub',   detail:'+5 Guru Points · ⭐4.8 rating',        time:'Yesterday' },
  { dot:'bg-green-500', action:'Completed Daily Quiz',         detail:'4/5 correct · +50 coins',              time:'2 days ago'},
  { dot:'bg-[#D4AF37]', action:'Reached Level 4 — Gold Miner', detail:'6,000 XP milestone reached',           time:'3 days ago'},
  { dot:'bg-blue-500',  action:'Joined Hall: IIT Chasers',     detail:'8 members · 7-day group streak',       time:'4 days ago'},
]

export default function RecentActivityWidget() {
  return (
    <div className="clay rounded-3xl p-6 col-span-full">
      <h3 className="font-bold text-[#1E3A5F] text-lg font-poppins mb-4">🕐 Recent Activity</h3>
      <div className="relative">
        <div className="absolute left-[9px] top-0 bottom-0 w-px bg-slate-200" />
        <div className="flex flex-col">
          {ACTIVITIES.map((a, i) => (
            <div key={i} className="flex gap-4 pb-4">
              <div className="relative z-10 flex-shrink-0 mt-1">
                <div className={`w-5 h-5 rounded-full ${a.dot} ring-2 ring-white`} />
              </div>
              <div className="flex-1 min-w-0 pb-2 border-b border-slate-50 last:border-0">
                <p className="font-semibold text-slate-800 text-sm">{a.action}</p>
                <p className="text-slate-500 text-xs mt-0.5">{a.detail}</p>
                <p className="text-slate-400 text-xs mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
