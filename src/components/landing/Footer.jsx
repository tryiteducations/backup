// src/components/landing/Footer.jsx
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

function Flag({ s = 20 }) {
  const h = Math.round(s * 0.65)
  return (
    <div style={{ display:'flex', flexDirection:'column', width:s, height:h,
      borderRadius:2, overflow:'hidden', flexShrink:0, border:'1px solid rgba(255,255,255,0.2)' }}>
      <div style={{ flex:1, background:'#FF9933' }}/>
      <div style={{ flex:1, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:h*0.38, height:h*0.38, borderRadius:'50%', border:'1.5px solid #000080' }}/>
      </div>
      <div style={{ flex:1, background:'#138808' }}/>
    </div>
  )
}

const LINKS = {
  Platform: ['Features','Pricing','All Exams','Career Compass','Impact Dashboard','2G Mode'],
  Students: ['Test Engine','Guru Hub','Brain Games','Leaderboard','Scholarships','Bharat Pulse'],
  Partners: ['Become a Mentor','Institution Partner','CSR Partnership','API Access','TryIT Fellowship'],
  Legal:    ['Privacy Policy','Terms of Service','Refund Policy','Community Standards','Section 80G'],
}

const LANG_TICKER = [
  'தமிழ்','हिंदी','తెలుగు','ಕನ್ನಡ','മലയാളം','বাংলা','मराठी','ગુજરાતી',
  'ਪੰਜਾਬੀ','ଓଡ଼ିଆ','অসমীয়া','মৈতৈলোন্','اردو','संस्कृत','मैथिली',
  'डोगरी','বড়ো','ᱥᱟᱱᱛᱟᱲᱤ','कोंकणी','नेपाली','भोजपुरी','अवधी',
  'राजस्थानी','Mizo','Khasi','Nagamese','ತುಳು','कच्छी',
]

export default function Footer() {
  const navigate  = useNavigate()
  const { theme } = useTheme()

  const accent   = theme?.accent      ?? '#C9A84C'
  const accentL  = theme?.accentLight ?? '#E8C44A'
  const primary  = theme?.primary     ?? '#1E3A5F'
  const primDark = theme?.primaryDark ?? '#0F2140'

  // Footer always uses a deep dark background derived from the theme's
  // own primary colours — so it shifts with every theme change.
  const footerBg = `linear-gradient(160deg, ${primDark} 0%, ${primary}cc 100%)`
  const borderTop = `1px solid ${accent}22`

  return (
    <footer style={{ background:footerBg, borderTop, paddingTop:52, paddingBottom:24,
      transition:'background 0.4s' }}>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 clamp(16px,3vw,28px)' }}>

        {/* ── Main grid ── */}
        <div style={{ display:'grid',
          gridTemplateColumns:'1.6fr repeat(4,1fr)',
          gap:28, marginBottom:40,
          '@media(max-width:768px)': { gridTemplateColumns:'1fr' },
        }}>

          {/* Brand column */}
          <div>
            {/* Text logo — LogoAnimated reserved for Splash only */}
            <div onClick={() => navigate('/landing')}
              style={{ display:'flex', alignItems:'center', gap:8,
                cursor:'pointer', marginBottom:14 }}>
              <div style={{ width:34, height:34, borderRadius:10, flexShrink:0,
                background:`linear-gradient(135deg,${accent},${accentL})`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'Poppins,sans-serif', fontWeight:900,
                fontSize:13, color:primDark }}>TI</div>
              <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                fontSize:17, color:'#fff' }}>
                Try<span style={{ color:accent }}>IT</span> Educations
              </span>
            </div>

            <p style={{ color:accent, fontStyle:'italic', fontSize:13,
              margin:'0 0 8px', fontFamily:'Inter,sans-serif' }}>
              Your Exam. Your Rank. Your Success.
            </p>
            <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12,
              lineHeight:1.7, fontFamily:'Inter,sans-serif', margin:'0 0 16px' }}>
              One subscription. Two futures.<br/>
              140 crore dreams. Works on 2G.
            </p>

            {/* Live status */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:6,
              background:'rgba(34,197,94,0.08)',
              border:'1px solid rgba(34,197,94,0.25)',
              borderRadius:20, padding:'5px 13px', marginBottom:14 }}>
              <span style={{ width:7, height:7, borderRadius:'50%',
                background:'#22C55E', display:'inline-block',
                animation:'footerLiveDot 1.4s ease-in-out infinite' }}/>
              <span style={{ color:'rgba(255,255,255,0.75)', fontSize:11,
                fontFamily:'Inter,sans-serif' }}>Platform Live · 2G Ready</span>
            </div>

            {/* App badges */}
            <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:16 }}>
              {[['📱','Android'],['🍎','iOS'],['💻','Web']].map(([e,l]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:5,
                  background:'rgba(255,255,255,0.08)',
                  border:'1px solid rgba(255,255,255,0.14)',
                  borderRadius:9, padding:'5px 10px' }}>
                  <span style={{ fontSize:12 }}>{e}</span>
                  <span style={{ color:'rgba(255,255,255,0.7)', fontSize:11,
                    fontWeight:600, fontFamily:'Inter,sans-serif' }}>{l}</span>
                </div>
              ))}
            </div>

            {/* Proudly built in Bharat */}
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <Flag s={22}/>
              <span style={{ color:'rgba(255,255,255,0.4)', fontSize:11,
                fontFamily:'Inter,sans-serif' }}>Proudly Built in Bharat</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <p style={{ color:'rgba(255,255,255,0.28)', fontFamily:'Poppins,sans-serif',
                fontWeight:700, fontSize:10, letterSpacing:'1.5px',
                marginBottom:12, textTransform:'uppercase' }}>
                {section}
              </p>
              {items.map(item => (
                <a key={item} href="#"
                  style={{ display:'block', color:'rgba(255,255,255,0.48)',
                    fontSize:12, marginBottom:9, textDecoration:'none',
                    fontFamily:'Inter,sans-serif', transition:'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = accent}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.48)'}>
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* ── Language ticker ── */}
        <div style={{ overflow:'hidden', marginBottom:20,
          borderTop:'1px solid rgba(255,255,255,0.06)',
          borderBottom:'1px solid rgba(255,255,255,0.06)',
          padding:'10px 0' }}>
          <div style={{ display:'flex', gap:28,
            animation:'footerTicker 28s linear infinite',
            width:'max-content' }}>
            {[...LANG_TICKER, ...LANG_TICKER].map((l, i) => (
              <span key={i} style={{ color:'rgba(255,255,255,0.28)',
                fontSize:13, fontWeight:600, whiteSpace:'nowrap',
                fontFamily:'Inter,sans-serif' }}>{l}</span>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ display:'flex', justifyContent:'space-between',
          alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <p style={{ color:'rgba(255,255,255,0.28)', fontSize:11,
            fontFamily:'Inter,sans-serif', margin:0 }}>
            © 2026 TryIT Educations · Every Indian student deserves a fair shot.
          </p>
          <a href="mailto:tryiteducations@gmail.com"
            style={{ color:accent, fontSize:11, fontWeight:600,
              textDecoration:'none', fontFamily:'Inter,sans-serif' }}>
            ✉️ tryiteducations@gmail.com
          </a>
        </div>
      </div>

      <style>{`
        @keyframes footerLiveDot {
          0%   { box-shadow: 0 0 0 0   rgba(34,197,94,0.6); }
          70%  { box-shadow: 0 0 0 7px rgba(34,197,94,0);   }
          100% { box-shadow: 0 0 0 0   rgba(34,197,94,0);   }
        }
        @keyframes footerTicker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  )
}
