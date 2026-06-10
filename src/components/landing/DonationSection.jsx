import { useState } from 'react'

const PRESET_AMOUNTS = [199, 499, 999, 2499, 4999, 9999]

const IMPACT = [
  { amount:199,  label:'1 month free for a Hope Scholar' },
  { amount:499,  label:'3 months free for a Swachhta Warrior child' },
  { amount:999,  label:'Full year for a Veer Nari family member' },
  { amount:2499, label:'Support 3 students for a full year' },
  { amount:4999, label:'Support 7 students — one full circle' },
  { amount:9999, label:'Sponsor an entire classroom (10 students)' },
]

export default function DonationSection() {
  const [amount, setAmount]     = useState(499)
  const [custom, setCustom]     = useState('')
  const [name,   setName]       = useState('')
  const [email,  setEmail]      = useState('')
  const [pan,    setPan]        = useState('')
  const [step,   setStep]       = useState('amount') // amount | details | done
  const [loading,setLoading]    = useState(false)

  const finalAmount = custom ? parseInt(custom) : amount
  const impactLabel = IMPACT.find(i=>i.amount<=finalAmount)?.label || 'Help a student'

  const proceed = () => {
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    // Razorpay integration stub — replace key with live key
    const options = {
      key:         import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_placeholder',
      amount:      finalAmount * 100,
      currency:    'INR',
      name:        'TryIT Educations',
      description: `Donation — ${impactLabel}`,
      image:       '/tryit-logo.webp',
      prefill:     { name, email },
      notes:       { pan: pan || 'Not provided', purpose:'TryIT Student Sponsorship' },
      theme:       { color:'#D4AF37' },
      handler:     (res) => { setLoading(false); setStep('done') },
      modal:       { ondismiss:()=>setLoading(false) },
    }
    if (window.Razorpay) {
      new window.Razorpay(options).open()
    } else {
      // Razorpay script not loaded
      setTimeout(()=>{ setLoading(false); setStep('done') }, 1500)
    }
  }

  return (
    <section style={{
      padding:'72px 20px',
      background:'linear-gradient(135deg,#071428,#0F2140)',
    }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <div style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,400px),1fr))',
          gap:40, alignItems:'center' }}>

          {/* Left — mission */}
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8,
              background:'rgba(212,175,55,0.12)', border:'1px solid rgba(212,175,55,0.3)',
              borderRadius:20, padding:'6px 16px', marginBottom:20 }}>
              <span>💛</span>
              <span style={{ color:'#D4AF37', fontSize:12, fontWeight:700,
                fontFamily:'Poppins,sans-serif', letterSpacing:'1px' }}>
                SPONSOR A STUDENT
              </span>
            </div>
            <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
              fontSize:'clamp(24px,4vw,38px)', color:'#fff', marginBottom:12 }}>
              Help a Student<br/>
              <span style={{ color:'#D4AF37' }}>Change Their Future</span>
            </h2>
            <p style={{ fontFamily:'Inter,sans-serif', color:'rgba(255,255,255,0.65)',
              fontSize:'clamp(14px,2vw,16px)', lineHeight:1.75, marginBottom:20 }}>
              Every rupee you donate directly funds free exam preparation
              for orphans, sanitation workers' children, Veer Nari families,
              and transgender youth across India.
            </p>

            {/* Impact stats */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
              {[
                ['3,641','Students currently sponsored'],
                ['₹0','Platform fee on donations'],
                ['80 Paise','of every ₹1 reaches students'],
                ['Section 80G','Tax deduction eligible*'],
              ].map(([v,l])=>(
                <div key={l} style={{ background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:14, padding:'12px 14px' }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:900,
                    color:'#D4AF37', fontSize:18 }}>{v}</p>
                  <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11,
                    marginTop:2 }}>{l}</p>
                </div>
              ))}
            </div>
            <p style={{ color:'rgba(255,255,255,0.25)', fontSize:11,
              fontFamily:'Inter,sans-serif' }}>
              * 80G certificate provided after verification. TryIT Educations
              is applying for Section 80G status.
            </p>
          </div>

          {/* Right — donation form */}
          <div style={{ background:'rgba(255,255,255,0.06)',
            border:'1.5px solid rgba(212,175,55,0.25)',
            borderRadius:24, padding:24 }}>

            {step === 'done' ? (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:56, marginBottom:16 }}>🙏</div>
                <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                  color:'#D4AF37', fontSize:22, marginBottom:10 }}>
                  Thank You, {name}!
                </h3>
                <p style={{ color:'rgba(255,255,255,0.7)', fontSize:14, lineHeight:1.7 }}>
                  Your ₹{finalAmount.toLocaleString()} donation will help fund
                  free education for students who need it most.
                </p>
                <p style={{ color:'rgba(255,255,255,0.45)', fontSize:12, marginTop:12 }}>
                  Receipt sent to {email} · 80G certificate will follow
                </p>
                <button onClick={()=>setStep('amount')}
                  style={{ marginTop:20, background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
                    border:'none', borderRadius:12, padding:'11px 28px',
                    fontFamily:'Poppins,sans-serif', fontWeight:700,
                    fontSize:14, color:'#1E3A5F', cursor:'pointer' }}>
                  Donate Again
                </button>
              </div>
            ) : step === 'amount' ? (
              <>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                  color:'#fff', fontSize:16, marginBottom:16 }}>
                  Choose Amount
                </p>

                {/* Preset buttons */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
                  gap:8, marginBottom:12 }}>
                  {PRESET_AMOUNTS.map(a=>(
                    <button key={a} onClick={()=>{ setAmount(a); setCustom('') }}
                      style={{
                        padding:'11px 8px', borderRadius:12, border:'none',
                        cursor:'pointer', textAlign:'center',
                        background: amount===a && !custom
                          ? 'linear-gradient(135deg,#D4AF37,#E8C84A)'
                          : 'rgba(255,255,255,0.08)',
                        color: amount===a && !custom ? '#1E3A5F' : 'rgba(255,255,255,0.7)',
                        fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14,
                        transition:'all 0.15s',
                      }}>
                      ₹{a.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div style={{ position:'relative', marginBottom:12 }}>
                  <span style={{ position:'absolute', left:14, top:'50%',
                    transform:'translateY(-50%)', color:'rgba(255,255,255,0.5)',
                    fontWeight:700, fontSize:16 }}>₹</span>
                  <input value={custom} type="number" placeholder="Enter custom amount"
                    onChange={e=>{ setCustom(e.target.value); setAmount(0) }}
                    style={{ width:'100%', padding:'12px 12px 12px 32px',
                      background:'rgba(255,255,255,0.08)',
                      border:'1.5px solid rgba(255,255,255,0.15)',
                      borderRadius:12, color:'#fff', fontSize:15,
                      outline:'none', boxSizing:'border-box',
                      fontFamily:'Poppins,sans-serif' }}
                    onFocus={e=>e.target.style.borderColor='#D4AF37'}
                    onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.15)'}
                  />
                </div>

                {/* Impact label */}
                <div style={{ background:'rgba(212,175,55,0.1)',
                  border:'1px solid rgba(212,175,55,0.2)',
                  borderRadius:12, padding:'10px 14px', marginBottom:16 }}>
                  <p style={{ color:'#D4AF37', fontSize:13, fontWeight:600 }}>
                    💛 Your ₹{finalAmount.toLocaleString()} will: {impactLabel}
                  </p>
                </div>

                <button onClick={()=>setStep('details')}
                  disabled={!finalAmount || finalAmount < 1}
                  style={{
                    width:'100%', padding:'14px', borderRadius:14, border:'none',
                    background: finalAmount >= 1
                      ? 'linear-gradient(135deg,#D4AF37,#E8C84A)'
                      : 'rgba(255,255,255,0.1)',
                    fontFamily:'Poppins,sans-serif', fontWeight:800,
                    fontSize:16, cursor: finalAmount>=1 ? 'pointer' : 'not-allowed',
                    color: finalAmount>=1 ? '#1E3A5F' : 'rgba(255,255,255,0.3)',
                  }}>
                  Donate ₹{finalAmount.toLocaleString()} →
                </button>
              </>
            ) : (
              <>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                  <button onClick={()=>setStep('amount')}
                    style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)',
                      cursor:'pointer', fontSize:18 }}>←</button>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                    color:'#fff', fontSize:15 }}>
                    Donating ₹{finalAmount.toLocaleString()}
                  </p>
                </div>
                {[
                  { label:'Full Name *',    val:name,  set:setName,  ph:'Your name',        type:'text'  },
                  { label:'Email *',        val:email, set:setEmail, ph:'your@email.com',    type:'email' },
                  { label:'PAN (for 80G)',  val:pan,   set:setPan,   ph:'ABCDE1234F (optional)', type:'text' },
                ].map(f=>(
                  <div key={f.label} style={{ marginBottom:14 }}>
                    <label style={{ display:'block', color:'rgba(255,255,255,0.7)',
                      fontSize:12, fontWeight:600, marginBottom:6,
                      fontFamily:'Poppins,sans-serif' }}>{f.label}</label>
                    <input value={f.val} type={f.type} placeholder={f.ph}
                      onChange={e=>f.set(e.target.value)}
                      style={{ width:'100%', padding:'11px 14px',
                        background:'rgba(255,255,255,0.08)',
                        border:'1.5px solid rgba(255,255,255,0.15)',
                        borderRadius:12, color:'#fff', fontSize:14,
                        outline:'none', boxSizing:'border-box',
                        fontFamily:'Inter,sans-serif' }}
                      onFocus={e=>e.target.style.borderColor='#D4AF37'}
                      onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.15)'}
                    />
                  </div>
                ))}
                <button onClick={proceed} disabled={loading||!name||!email}
                  style={{
                    width:'100%', padding:'14px', borderRadius:14, border:'none',
                    background: !loading&&name&&email
                      ? 'linear-gradient(135deg,#D4AF37,#E8C84A)'
                      : 'rgba(255,255,255,0.1)',
                    fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:16,
                    color: !loading&&name&&email ? '#1E3A5F' : 'rgba(255,255,255,0.3)',
                    cursor: !loading&&name&&email ? 'pointer' : 'not-allowed',
                  }}>
                  {loading ? '⏳ Opening payment...' : `🔒 Pay ₹${finalAmount.toLocaleString()} Securely`}
                </button>
                <p style={{ color:'rgba(255,255,255,0.25)', fontSize:11,
                  textAlign:'center', marginTop:10 }}>
                  Powered by Razorpay · UPI · Cards · Net Banking accepted
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
