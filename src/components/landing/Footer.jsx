import Logo from '../Logo'

const LINKS = {
  Platform: ['About Us','How It Works','Pricing','Blog','Careers'],
  Students:  ['All Exams','Test Engine','Brain Games','Guru Hub','Leaderboard'],
  Partners:  ['Become a Mentor','Institute Partner','API Access','Affiliate'],
  Legal:     ['Privacy Policy','Terms of Service','Community Standards','Refund Policy'],
}

export default function Footer() {
  return (
    <footer className="bg-[#0F2140] pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          <div className="md:col-span-1">
            <Logo dark height={44} />
            <p className="text-[#D4AF37] italic text-sm mt-3">Your Exam. Your Rank. Your Success.</p>
            <p className="text-white/40 text-xs mt-3 leading-relaxed">
              India's most complete exam prep platform. 75,000+ pathways. 40+ languages.
            </p>
          </div>
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="text-white font-semibold mb-3 text-sm">{section}</p>
              <ul className="space-y-2">
                {links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-white/50 hover:text-[#D4AF37] text-sm transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-xs">© 2026 TryIT Educations Pvt Ltd. All rights reserved.</p>
          <p className="text-white/40 text-xs italic">"Real platform. Real questions. Real ranks."</p>
        </div>
      </div>
    </footer>
  )
}
