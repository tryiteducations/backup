import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { isValidAPAAR, formatAPAAR, verifyAPAAR } from '../../lib/apaarValidator'
import { useToast } from '../../context/ToastContext'

const REQUIRED_MEMBERS = 10
const CIRCLE_DISCOUNT  = 20

export default function SchoolCircle() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const STORE_KEY = 'my_school_circle'

  const [circle, setCircle] = useState(
    () => JSON.parse(localStorage.getItem(STORE_KEY) || 'null')
  )
  const [step, setStep]       = useState('intro')  // intro|setup|invite|active
  const [apaarInput, setApaarInput] = useState('')
  const [verifying, setVerifying]   = useState(false)
  const [captain, setCaptain]       = useState(null)
  const [members, setMembers]       = useState([])
  const [newApaar, setNewApaar]     = useState('')

  const progress = Math.min((members.length / REQUIRED_MEMBERS) * 100, 100)
  const remaining = REQUIRED_MEMBERS - members.length
  const unlocked = members.length >= REQUIRED_MEMBERS

  const verifyCaptain = async () => {
    if (!isValidAPAAR(apaarInput)) {
      showToast('error', 'Invalid APAAR ID. Must be 12 digits.')
      return
    }
    setVerifying(true)
    const result = await verifyAPAAR(apaarInput)
    setVerifying(false)
    if (result.valid) {
      setCaptain(result)
      setMembers([{ ...result, role: 'captain', joinedAt: new Date().toISOString() }])
      setStep('invite')
    } else {
      showToast('error', result.error)
    }
  }

  const addMember = async () => {
    if (!isValidAPAAR(newApaar)) {
      showToast('error', 'Invalid APAAR ID.')
      return
    }
    if (members.some(m => m.apaarId === newApaar.replace(/\D/g,''))) {
      showToast('error', 'This student is already in the circle.')
      return
    }
    setVerifying(true)
    const result = await verifyAPAAR(newApaar, captain?.institution)
    setVerifying(false)
    if (result.valid) {
      const updated = [...members, { ...result, role: 'member', joinedAt: new Date().toISOString() }]
      setMembers(updated)
      setNewApaar('')
      if (updated.length >= REQUIRED_MEMBERS) {
        const circleData = {
          id: `circle-${Date.now()}`,
          type: 'school', discount: CIRCLE_DISCOUNT,
          captain, members: updated, institution: captain.institution,
          activatedAt: new Date().toISOString(),
        }
        setCircle(circleData)
        localStorage.setItem(STORE_KEY, JSON.stringify(circleData))
        showToast('success', `🎉 Circle complete! ${CIRCLE_DISCOUNT}% off activated for all members!`)
      } else {
        showToast('success', `✅ Member added! ${updated.length}/${REQUIRED_MEMBERS}`)
      }
    } else {
      showToast('error', 'Could not verify this APAAR ID.')
    }
  }

  // Already active circle
  if (circle) {
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#071428,#0F2140)', padding:20 }}>
        <div style={{ maxWidth:540, margin:'0 auto', paddingTop:20 }}>
          <div style={{ background:'linear-gradient(135deg,#D4AF37,#E8C84A)', borderRadius:24, padding:24, textAlign:'center', marginBottom:20 }}>
            <div style={{ fontSize:48, marginBottom:8 }}>🎉</div>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#1E3A5F', fontSize:22 }}>
              Circle Active!
            </h2>
            <p style={{ color:'rgba(30,58,95,0.8)', fontSize:14, marginTop:4 }}>
              {circle.members.length} members · {circle.discount}% OFF for life
            </p>
          </div>
          <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:20, padding:20 }}>
            {circle.members.map((m,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12,
                padding:'10px 0', borderBottom: i<circle.members.length-1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ width:36, height:36, borderRadius:'50%',
                  background: m.role==='captain' ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: m.role==='captain' ? '#1E3A5F' : '#fff', fontWeight:800, fontSize:14 }}>
                  {i+1}
                </div>
                <div>
                  <p style={{ color:'#fff', fontWeight:600, fontSize:14 }}>{m.studentName}</p>
                  <p style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>
                    {m.apaarId?.replace(/(\d{4})(\d{4})(\d{4})/,'$1-$2-$3')} {m.role==='captain'?'· Captain':''}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/dashboard')} style={{
            width:'100%', marginTop:16, padding:14, borderRadius:14, border:'none',
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15,
            color:'#1E3A5F', cursor:'pointer',
          }}>Continue to Dashboard →</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#071428,#0F2140)', padding:20 }}>
      <div style={{ maxWidth:540, margin:'0 auto', paddingTop:20 }}>
        <button onClick={() => navigate(-1)}
          style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)',
            cursor:'pointer', marginBottom:20, fontSize:14 }}>← Back</button>

        {step === 'intro' && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🏫</div>
              <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, color:'#fff', fontSize:26, marginBottom:8 }}>
                Government School / College Circle
              </h1>
              <div style={{ background:'#D4AF37', color:'#1E3A5F', display:'inline-block',
                padding:'5px 18px', borderRadius:20, fontWeight:800, fontSize:13, marginBottom:16 }}>
                20% OFF FOR LIFE
              </div>
              <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.7 }}>
                Form a circle with <strong style={{ color:'#D4AF37' }}>10 students</strong> from your
                government school or college. When your circle is complete, everyone
                gets <strong style={{ color:'#D4AF37' }}>20% off for life</strong> — verified by
                India's APAAR Student ID.
              </p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:24 }}>
              {[['1️⃣','Be the Captain','Enter your APAAR ID to start the circle'],
                ['2️⃣','Invite 9 classmates','Share the circle code with your batch'],
                ['3️⃣','Discount unlocks','All 10 members get 20% off the moment circle is complete'],
              ].map(([n,title,desc])=>(
                <div key={title} style={{ display:'flex', gap:14, alignItems:'flex-start',
                  background:'rgba(255,255,255,0.04)', borderRadius:14, padding:14 }}>
                  <span style={{ fontSize:20, flexShrink:0 }}>{n}</span>
                  <div>
                    <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#fff', fontSize:14 }}>{title}</p>
                    <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:2 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('setup')} style={{
              width:'100%', padding:16, borderRadius:16, border:'none',
              background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
              fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17,
              color:'#1E3A5F', cursor:'pointer',
            }}>Start a Circle →</button>
          </motion.div>
        )}

        {step === 'setup' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#fff', fontSize:20, marginBottom:6 }}>
              Enter Your APAAR ID
            </h2>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13, marginBottom:20 }}>
              Your 12-digit APAAR (Academic Bank of Credits) Student ID — One Nation, One Student ID.
            </p>
            <input value={formatAPAAR(apaarInput)}
              onChange={e => setApaarInput(e.target.value.replace(/\D/g,'').slice(0,12))}
              placeholder="XXXX-XXXX-XXXX"
              style={{ width:'100%', padding:'16px', borderRadius:14,
                border:'2px solid rgba(212,175,55,0.4)', background:'rgba(255,255,255,0.08)',
                color:'#fff', fontSize:22, fontFamily:'monospace', letterSpacing:4,
                textAlign:'center', outline:'none', boxSizing:'border-box', marginBottom:16 }}
            />
            <button onClick={verifyCaptain} disabled={verifying || apaarInput.length < 12}
              style={{ width:'100%', padding:16, borderRadius:14, border:'none',
                background: verifying || apaarInput.length < 12
                  ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg,#D4AF37,#E8C84A)',
                fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:16,
                color: apaarInput.length < 12 ? 'rgba(255,255,255,0.3)' : '#1E3A5F',
                cursor: apaarInput.length < 12 ? 'not-allowed' : 'pointer' }}>
              {verifying ? '🔄 Verifying with DigiLocker...' : 'Verify APAAR ID →'}
            </button>
            <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, textAlign:'center', marginTop:10 }}>
              Your APAAR ID is from digilocker.gov.in → Academic Bank of Credits
            </p>
          </motion.div>
        )}

        {step === 'invite' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            {/* Progress */}
            <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:20, padding:20, marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ color:'#fff', fontWeight:700 }}>Circle Progress</span>
                <span style={{ color:'#D4AF37', fontWeight:800 }}>{members.length}/{REQUIRED_MEMBERS}</span>
              </div>
              <div style={{ height:10, background:'rgba(255,255,255,0.1)', borderRadius:5, overflow:'hidden' }}>
                <motion.div animate={{ width:`${progress}%` }} transition={{ duration:0.6 }}
                  style={{ height:'100%', background: unlocked
                    ? 'linear-gradient(90deg,#22C55E,#16A34A)'
                    : 'linear-gradient(90deg,#D4AF37,#E8C84A)', borderRadius:5 }} />
              </div>
              {unlocked
                ? <p style={{ color:'#22C55E', fontWeight:700, fontSize:13, marginTop:8, textAlign:'center' }}>
                    🎉 Circle complete! Discount activated!
                  </p>
                : <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginTop:8, textAlign:'center' }}>
                    {remaining} more student{remaining!==1?'s':''} needed to unlock the discount
                  </p>
              }
            </div>

            {/* Member list */}
            <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:16, marginBottom:16 }}>
              {members.map((m,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10,
                  padding:'8px 0', borderBottom: i<members.length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%',
                    background: m.role==='captain'?'#D4AF37':'rgba(255,255,255,0.1)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    color: m.role==='captain'?'#1E3A5F':'#fff', fontWeight:700, fontSize:12 }}>
                    {i+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ color:'#fff', fontSize:13, fontWeight:600 }}>
                      {m.studentName} {m.role==='captain'?'(Captain)':''}
                    </p>
                    <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>
                      {m.apaarId?.replace(/(\d{4})(\d{4})(\d{4})/,'$1-$2-$3')}
                    </p>
                  </div>
                  <span style={{ color:'#22C55E', fontSize:16 }}>✓</span>
                </div>
              ))}
            </div>

            {/* Add member */}
            {!unlocked && (
              <div style={{ marginBottom:16 }}>
                <p style={{ color:'rgba(255,255,255,0.7)', fontWeight:600, fontSize:13, marginBottom:8 }}>
                  Add classmate's APAAR ID:
                </p>
                <div style={{ display:'flex', gap:8 }}>
                  <input value={formatAPAAR(newApaar)}
                    onChange={e => setNewApaar(e.target.value.replace(/\D/g,'').slice(0,12))}
                    placeholder="XXXX-XXXX-XXXX"
                    style={{ flex:1, padding:'12px', borderRadius:12,
                      border:'1.5px solid rgba(255,255,255,0.2)',
                      background:'rgba(255,255,255,0.06)', color:'#fff',
                      fontSize:16, fontFamily:'monospace', letterSpacing:3, outline:'none' }}
                  />
                  <button onClick={addMember} disabled={verifying || newApaar.length < 12}
                    style={{ padding:'12px 18px', borderRadius:12, border:'none',
                      background: newApaar.length>=12 ? 'linear-gradient(135deg,#D4AF37,#E8C84A)' : 'rgba(255,255,255,0.1)',
                      color: newApaar.length>=12 ? '#1E3A5F' : 'rgba(255,255,255,0.3)',
                      fontWeight:700, cursor: newApaar.length<12?'not-allowed':'pointer', flexShrink:0 }}>
                    {verifying ? '...' : 'Add'}
                  </button>
                </div>
              </div>
            )}

            {unlocked && (
              <button onClick={() => navigate('/dashboard')} style={{
                width:'100%', padding:16, borderRadius:16, border:'none',
                background:'linear-gradient(135deg,#22C55E,#16A34A)',
                fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:17,
                color:'#fff', cursor:'pointer',
              }}>
                🎉 Continue — 20% OFF Applied →
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
