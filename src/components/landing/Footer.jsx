import { useNavigate } from 'react-router-dom'
import LogoAnimated from '../LogoAnimated'

const LINKS = {
  Platform:   ['Features','Pricing','All Exams','Career Compass','Impact'],
  Students:   ['Test Engine','Guru Hub','Brain Games','Leaderboard','Scholarships'],
  Partners:   ['Become a Mentor','Institution Partner','CSR Partnership','API Access'],
  Legal:      ['Privacy Policy','Terms of Service','Refund Policy','Community Standards'],
}

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer style={{
      background:'linear-gradient(180deg, var(--color-primary-dark, #0F2140), var(--color-primary, #1E3A5F))',
      borderTop:'1px solid rgba(212,175,55,0.12)',
      paddingTop:56, paddingBottom:28,
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
        <div style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',
          gap:32, marginBottom:48 }}>

          {/* Brand column — bigger logo */}
          <div>
            <div onClick={() => navigate('/')} style={{ cursor:'pointer', marginBottom:14 }}>
              <LogoAnimated size="xs" mode="auto" dark={true} />
            </div>
            <p style={{ color:'var(--color-accent, #D4AF37)', fontStyle:'italic',
              fontSize:13, margin:'0 0 10px',
              fontFamily:'Inter,sans-serif' }}>
              Your Exam. Your Rank. Your Success.
            </p>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:12,
              lineHeight:1.65, fontFamily:'Inter,sans-serif', marginBottom:16 }}>
              India's most complete exam platform.
              1,10,000+ pathways. 40+ languages.
            </p>

            {/* Live status — just green dot, no fake numbers */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:6,
              background:'rgba(34,197,94,0.08)',
              border:'1px solid rgba(34,197,94,0.25)',
              borderRadius:20, padding:'6px 14px' }}>
              <span style={{ width:8, height:8, borderRadius:'50%',
                background:'var(--color-success, #22C55E)', display:'inline-block',
                animation:'liveDot 1.4s ease-in-out infinite' }}/>
              <span style={{ color:'rgba(255,255,255,0.75)', fontSize:11,
                fontFamily:'Inter,sans-serif' }}>Platform Live</span>
            </div>

            <div style={{ display:'flex', gap:8, marginTop:14, flexWrap:'wrap' }}>
              {['📱 Android','🍎 iOS','💻 Web'].map(b => (
                <span key={b} style={{
                  background:'rgba(255,255,255,0.08)',
                  border:'1px solid rgba(255,255,255,0.16)',
                  color:'rgba(255,255,255,0.78)', fontSize:11,
                  padding:'5px 12px', borderRadius:20,
                  fontFamily:'Inter,sans-serif',
                }}>{b}</span>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <p style={{ color:'rgba(255,255,255,0.85)',
                fontFamily:'Poppins,sans-serif', fontWeight:600,
                fontSize:13, marginBottom:14 }}>{section}</p>
              {items.map(item => (
                <a key={item} href="#" style={{
                  display:'block', color:'rgba(255,255,255,0.35)',
                  fontSize:12, marginBottom:9, textDecoration:'none',
                  fontFamily:'Inter,sans-serif', transition:'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color='var(--color-accent, #D4AF37)'}
                  onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.35)'}>
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(212,175,55,0.25),transparent)', marginBottom:20 }}/>
        <div style={{ display:'flex', justifyContent:'space-between',
          alignItems:'center', flexWrap:'wrap', gap:8 }}>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:11, fontFamily:'Inter,sans-serif' }}>
            © 2026 TryIT Educations Pvt Ltd · All rights reserved
          </p>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11,
            fontFamily:'Inter,sans-serif', fontStyle:'italic' }}>
            "Real platform. Real questions. Real ranks."
          </p>
        </div>
      </div>

      <style>{`
        @keyframes liveDot {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
          70%  { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
      `}</style>
    </footer>
  )
}
