src = open("src/pages/Landing.jsx", encoding="utf-8").read()

JOURNEY_SECTION = """
      {/* ── LIFELONG JOURNEY SECTION ─────────────────────────── */}
      <section style={{
        background:'linear-gradient(135deg,var(--color-primary-dark,#071428),var(--color-primary,#0F2140))',
        padding:'60px 24px',
      }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{
              background:'var(--color-accent,#C9A84C)22',
              color:'var(--color-accent,#C9A84C)',
              fontSize:12, fontWeight:700, padding:'6px 18px',
              borderRadius:20, letterSpacing:'1px',
              border:'1px solid var(--color-accent,#C9A84C)44',
              display:'inline-block', marginBottom:16,
            }}>ONE PLATFORM · LIFELONG LEARNING</span>
            <h2 style={{
              fontSize:'clamp(24px,4vw,40px)',
              fontFamily:'Poppins,sans-serif', fontWeight:900,
              margin:'0 0 16px',
              background:'linear-gradient(135deg,#fff,var(--color-accent,#C9A84C))',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>
              From Your Child's First Olympiad<br/>
              to Your Retirement Promotion Exam
            </h2>
            <p style={{
              color:'rgba(255,255,255,0.55)', fontSize:16,
              maxWidth:600, margin:'0 auto',
            }}>
              India's only exam platform that stays with you at every stage of life.
              1,10,000+ exams · 42+ languages · Class 1 to SWAYAM.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
            {[
              {
                icon:'🎯', stage:'Primary Foundation',
                range:'Class 1 – 5',
                color:'#F59E0B',
                desc:'Build the learning habit before competition begins.',
                exams:'SOF Olympiads · ASSET Talent Search · Spell Bee · NSTSE · SilverZone · Indian Talent Olympiad · Humming Bird · LogIQids',
              },
              {
                icon:'📚', stage:'Secondary Excellence',
                range:'Class 6 – 10',
                color:'#3B82F6',
                desc:'Win the first big battles — residential schools, scholarships, ranks.',
                exams:'JNVST · AISSEE Sainik School · RMS CET · NMMS · NTSE · VVM · Board Mastery · 36 State Talent Searches',
              },
              {
                icon:'🏫', stage:'Higher Secondary Launchpad',
                range:'Class 11 – 12',
                color:'#EF4444',
                desc:'Your score here defines the next 40 years.',
                exams:'JEE Main · JEE Advanced · NEET UG · CUET · NDA · CLAT · INSPIRE · Board Toppers Programme',
              },
              {
                icon:'🎓', stage:'College & Entrance',
                range:'UG / PG Level',
                color:'#8B5CF6',
                desc:'Entrance exams do not stop at 12th — they just get harder.',
                exams:'UPSC Foundation · CA Foundation · GATE · CAT · CLAT PG · NIFT · NID · Medical PG · Law',
              },
              {
                icon:'⚡', stage:'Competitive Exams',
                range:'All-India Government Jobs',
                color:'var(--color-accent,#C9A84C)',
                desc:'Every government job in India — one platform.',
                exams:'UPSC CSE/IFS · SSC CGL/CHSL/MTS · IBPS PO/Clerk · SBI · RBI · RRB NTPC/Group D · NDA · CDS · CAPF',
              },
              {
                icon:'🌐', stage:'State Government Exams',
                range:'All 36 States & UTs',
                color:'#10B981',
                desc:'Your state, your language, your exam — in your mother tongue.',
                exams:'TNPSC · KPSC · MPPSC · UPPSC · RPSC · WBPSC · OPSC · GPSC · BPSC · APPSC · TSPSC + 22 more',
              },
              {
                icon:'🏛️', stage:'Departmental & Promotion',
                range:'After You Join Government',
                color:'#F97316',
                desc:'Even after joining — we help you climb.',
                exams:'Railway Departmental · Central Secretariat · Defence Promotion · Income Tax Inspector · Police Departmental · Bank Internal',
              },
              {
                icon:'📱', stage:'SWAYAM & Lifelong',
                range:'Forever',
                color:'#06B6D4',
                desc:'Learning never stops — neither do we.',
                exams:'SWAYAM NPTEL · IGNOU Exams · Skill India · Professional Certifications · Digital Literacy · Reskilling',
              },
            ].map((item, i) => (
              <div key={i} style={{
                background:'rgba(255,255,255,0.04)',
                backdropFilter:'blur(12px)',
                border:`1px solid ${item.color}30`,
                borderRadius:20, padding:'20px',
                transition:'all 0.2s',
                borderLeft:`4px solid ${item.color}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${item.color}12`
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 12px 32px ${item.color}22`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                  <div style={{
                    width:44, height:44, borderRadius:12, flexShrink:0,
                    background:`linear-gradient(135deg,${item.color}33,${item.color}11)`,
                    border:`1px solid ${item.color}44`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:22,
                  }}>{item.icon}</div>
                  <div>
                    <p style={{
                      color:'#fff', fontFamily:'Poppins,sans-serif',
                      fontWeight:800, fontSize:14, margin:0,
                    }}>{item.stage}</p>
                    <p style={{
                      color:item.color, fontSize:11,
                      fontWeight:700, margin:0,
                    }}>{item.range}</p>
                  </div>
                </div>
                <p style={{
                  color:'rgba(255,255,255,0.65)', fontSize:12,
                  margin:'0 0 10px', lineHeight:1.6,
                  fontStyle:'italic',
                }}>{item.desc}</p>
                <p style={{
                  color:'rgba(255,255,255,0.4)', fontSize:10,
                  margin:0, lineHeight:1.7,
                }}>{item.exams}</p>
              </div>
            ))}
          </div>

          {/* Bottom tagline */}
          <div style={{ textAlign:'center', marginTop:48 }}>
            <p style={{
              color:'rgba(255,255,255,0.85)',
              fontSize:'clamp(16px,2.5vw,22px)',
              fontFamily:'Poppins,sans-serif', fontWeight:700,
              margin:'0 0 8px',
            }}>
              "From your child's first Olympiad to your retirement promotion exam —
            </p>
            <p style={{
              background:'linear-gradient(135deg,var(--color-accent,#C9A84C),#fff)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              fontSize:'clamp(18px,3vw,28px)',
              fontFamily:'Poppins,sans-serif', fontWeight:900,
              margin:0,
            }}>
              TryIT is India's only lifelong exam companion."
            </p>
          </div>
        </div>
      </section>
"""

# Insert after the stats section (find a good insertion point)
insert_after = "</section>"

# Find the stats section - look for Exam Pathways
idx = src.find("Exams Covered")
if idx > 0:
    # Find the next </section> after stats
    close_idx = src.find("</section>", idx)
    if close_idx > 0:
        src = src[:close_idx+10] + "\n" + JOURNEY_SECTION + src[close_idx+10:]
        print("Journey section inserted after stats")
    else:
        print("Could not find closing section tag")
else:
    print("Could not find stats section - searching for alternate insertion point")
    # Try inserting before the first features section
    feat_idx = src.find("TODAY'S ACTIONS") 
    if feat_idx < 0:
        feat_idx = src.find("Why TryIT")
    if feat_idx < 0:
        feat_idx = src.find("features")
    print(f"Alternate point: {feat_idx}")

open("src/pages/Landing.jsx", "w", encoding="utf-8").write(src)
print("Done")
