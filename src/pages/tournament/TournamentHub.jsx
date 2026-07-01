// FILE: src/pages/tournament/TournamentHub.jsx
// TryIT Tournament Hub - Browse, Register, Vote for next exam
// Route: /tournament
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { preDownloadQuestions } from '../../lib/tournamentEngine'

const NAVY='#1E3A5F',GOLD='#C9A84C',BG='#F8FAFC'

const MOCK_T=[
  {tournament_id:'t1',tournament_name:'All India SSC CGL Championship 2026',tournament_type:'national',exam_display_name:'SSC CGL Tier 1',exam_scheme_id:'ssc_cgl_t1',total_questions:100,registration_opens:'2026-06-15T00:00:00Z',registration_closes:'2026-06-22T07:00:00Z',exam_starts_at:'2026-06-22T09:00:00Z',results_at:'2026-06-22T20:00:00Z',status:'registration_open',total_registrations:84230,entry_fee_free_user:5,entry_fee_pro_ultra:0,cdn_question_url:null,question_sets_count:50},
  {tournament_id:'t2',tournament_name:'IBPS PO Match Day - June 2026',tournament_type:'match_day',exam_display_name:'IBPS PO Prelims',exam_scheme_id:'ibps_po_pre',total_questions:100,registration_opens:'2026-06-25T00:00:00Z',registration_closes:'2026-06-26T07:00:00Z',exam_starts_at:'2026-06-26T09:00:00Z',results_at:'2026-06-26T20:00:00Z',status:'upcoming',total_registrations:0,entry_fee_free_user:5,entry_fee_pro_ultra:0,cdn_question_url:null,question_sets_count:50},
]
const MOCK_POLLS=[
  {poll_id:'p1',exam_name:'UPSC CSE Prelims',vote_count:1847,status:'open',description:'National UPSC mock tournament',min_votes_national:2000},
  {poll_id:'p2',exam_name:'JEE Main',vote_count:1234,status:'open',description:'All India JEE championship',min_votes_national:2000},
  {poll_id:'p3',exam_name:'KPSC Group A',vote_count:623,status:'threshold_reached',description:'Karnataka PSC - votes reached!',min_votes_state:500,admin_note:'Scheduling for July 2026'},
  {poll_id:'p4',exam_name:'RRB NTPC',vote_count:412,status:'open',description:'Railway NTPC national test',min_votes_national:2000},
]

function Countdown({targetTime,label}){
  const[t,setT]=useState('')
  useEffect(()=>{
    const u=()=>{const d=new Date(targetTime).getTime()-Date.now();if(d<=0){setT('Starting!');return};const h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000),s=Math.floor((d%60000)/1000);setT(h>24?`${Math.floor(h/24)}d ${h%24}h`:`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)}
    u();const i=setInterval(u,1000);return()=>clearInterval(i)
  },[targetTime])
  return <div style={{textAlign:'center'}}><p style={{fontSize:9,color:'rgba(255,255,255,0.5)',margin:'0 0 1px',letterSpacing:1}}>{label}</p><p style={{fontFamily:'monospace',fontWeight:900,fontSize:16,color:GOLD,margin:0}}>{t}</p></div>
}

export default function TournamentHub(){
  const navigate=useNavigate()
  const{user,planTier}=useAuth()
  const[tournaments,setTournaments]=useState(MOCK_T)
  const[polls,setPolls]=useState(MOCK_POLLS)
  const[tab,setTab]=useState('upcoming')
  const[showReg,setShowReg]=useState(null)
  const[myReg,setMyReg]=useState({})
  const[myVotes,setMyVotes]=useState(new Set())
  const[downloading,setDownloading]=useState({})

  useEffect(()=>{
    Promise.all([
      supabase.from('tournaments').select('*').neq('status','draft').order('exam_starts_at'),
      supabase.from('tournament_registrations').select('tournament_id,status,question_set_id,cdn_question_file').eq('user_id',user?.id||''),
      supabase.from('tournament_polls').select('*').order('vote_count',{ascending:false}),
      supabase.from('poll_votes').select('poll_id').eq('user_id',user?.id||''),
    ]).then(([t,r,p,v])=>{
      if(t.data?.length)setTournaments(t.data)
      if(r.data)setMyReg(Object.fromEntries(r.data.map(x=>[x.tournament_id,x])))
      if(p.data?.length)setPolls(p.data)
      if(v.data)setMyVotes(new Set(v.data.map(x=>x.poll_id)))
    }).catch(()=>{})
  },[user?.id])

  const handleDownload=async(t)=>{
    const reg=myReg[t.tournament_id];if(!reg)return
    setDownloading(d=>({...d,[t.tournament_id]:true}))
    const r=await preDownloadQuestions({...reg,exam_starts_at:t.exam_starts_at})
    setDownloading(d=>({...d,[t.tournament_id]:false}))
    alert(r.success?'✅ Questions secured on device! Exam works offline.':('❌ '+r.error))
  }

  const handleVote=async(pollId)=>{
    if(!user){navigate('/login');return}
    if(myVotes.has(pollId))return
    try{await supabase.from('poll_votes').insert({poll_id:pollId,user_id:user.id})
    setMyVotes(v=>new Set([...v,pollId]))
    setPolls(p=>p.map(x=>x.poll_id===pollId?{...x,vote_count:x.vote_count+1}:x))}catch{}
  }

  const upcoming=tournaments.filter(t=>['upcoming','registration_open'].includes(t.status))
  const live=tournaments.filter(t=>t.status==='live')
  const results=tournaments.filter(t=>t.status==='results_live')

  return(
    <div style={{minHeight:'100vh',background:BG,fontFamily:'Inter,sans-serif',paddingBottom:80}}>
      <div style={{background:`linear-gradient(135deg,${NAVY},#0F2140)`,padding:'20px 16px 24px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <button onClick={()=>navigate(-1)} style={{background:'rgba(255,255,255,0.1)',border:'none',color:'rgba(255,255,255,0.7)',width:34,height:34,borderRadius:'50%',fontSize:16,cursor:'pointer'}}>←</button>
          <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:800,fontSize:18,color:'#fff',margin:0}}>🏆 Tournaments</h1>
          <div style={{width:34}}/>
        </div>
        {live.length>0&&<div style={{background:'rgba(220,38,38,0.2)',border:'1.5px solid #EF4444',borderRadius:14,padding:'10px 14px',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <div><p style={{fontSize:11,color:'#FCA5A5',fontWeight:700,margin:0}}>🔴 TOURNAMENT LIVE</p><p style={{fontSize:13,fontWeight:700,color:'#fff',margin:'2px 0 0'}}>{live[0].exam_display_name}</p></div>
          <button onClick={()=>navigate(`/tournament/${live[0].tournament_id}/live`)} style={{padding:'8px 16px',background:'#DC2626',color:'#fff',border:'none',borderRadius:10,fontWeight:800,fontSize:12,cursor:'pointer'}}>Enter →</button>
        </div>}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
          {[{l:'Upcoming',v:upcoming.length,e:'📅'},{l:'Registered',v:(myReg&&Object.keys(myReg).length)||0,e:'✅'},{l:'Results at',v:'8:00 PM',e:'🏆'}].map(s=>(
            <div key={s.l} style={{background:'rgba(255,255,255,0.08)',borderRadius:12,padding:'8px 4px',textAlign:'center'}}>
              <p style={{fontSize:16,margin:'0 0 2px'}}>{s.e}</p>
              <p style={{fontWeight:800,color:'#fff',fontSize:13,margin:'0 0 1px'}}>{s.v}</p>
              <p style={{fontSize:9,color:'rgba(255,255,255,0.5)',margin:0}}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'flex',background:'#fff',borderBottom:'1px solid #E2E8F0'}}>
        {[{id:'upcoming',l:'📅 Upcoming'},{id:'polls',l:'🗳️ Vote'},{id:'results',l:'🏆 Results'}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:'12px 8px',border:'none',background:'transparent',cursor:'pointer',fontSize:12,fontWeight:700,color:tab===t.id?NAVY:'#94A3B8',borderBottom:tab===t.id?`2.5px solid ${GOLD}`:'2.5px solid transparent'}}>{t.l}</button>
        ))}
      </div>

      <div style={{padding:16,maxWidth:480,margin:'0 auto'}}>
        {tab==='upcoming'&&(
          <div>
            {upcoming.map(t=>{
              const reg=myReg[t.tournament_id]
              const isReg=!!reg
              const fee=planTier==='free'?t.entry_fee_free_user:0
              const isOpen=t.status==='registration_open'
              const downloaded=reg?.status==='downloaded'
              return(
                <div key={t.tournament_id} style={{background:'#fff',borderRadius:18,overflow:'hidden',marginBottom:14,boxShadow:'0 4px 16px rgba(0,0,0,0.08)'}}>
                  <div style={{background:`linear-gradient(135deg,${NAVY},#0F2140)`,padding:'14px 16px'}}>
                    <div style={{display:'flex',gap:6,marginBottom:8}}>
                      <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,background:isOpen?'#D1FAE5':'#EFF6FF',color:isOpen?'#065F46':'#1D4ED8'}}>{isOpen?'✅ Register Now':'📅 Upcoming'}</span>
                      <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,background:'rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.8)'}}>{t.tournament_type==='match_day'?'⚡ Match Day':'🇮🇳 All India'}</span>
                    </div>
                    <p style={{fontFamily:'Poppins,sans-serif',fontWeight:800,fontSize:15,color:'#fff',margin:'0 0 4px'}}>{t.tournament_name}</p>
                    <p style={{fontSize:11,color:'rgba(255,255,255,0.6)',margin:'0 0 10px'}}>{t.exam_display_name} · {t.total_questions}Q · Results 8 PM</p>
                    {isOpen&&<div style={{display:'flex',justifyContent:'space-around',background:'rgba(255,255,255,0.08)',borderRadius:10,padding:'8px 0'}}>
                      <Countdown targetTime={t.registration_closes} label="REG CLOSES"/>
                      <div style={{width:1,background:'rgba(255,255,255,0.1)'}}/>
                      <Countdown targetTime={t.exam_starts_at} label="EXAM STARTS"/>
                    </div>}
                  </div>
                  <div style={{padding:'12px 16px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                      <p style={{fontSize:12,color:'var(--color-text-light,#64748B)',margin:0}}>👥 {(t.total_registrations||0).toLocaleString('en-IN')} registered</p>
                      <p style={{fontSize:12,margin:0}}>{fee>0?<span>₹{fee} <span style={{color:'#94A3B8'}}>(Free users)</span></span>:<span style={{color:'#059669',fontWeight:700}}>Free for you ✅</span>}</p>
                    </div>
                    <div style={{display:'flex',gap:5,marginBottom:12,flexWrap:'wrap'}}>
                      <span style={{fontSize:10,fontWeight:600,padding:'3px 8px',borderRadius:99,background:'#FFF7E6',color:'#92400E'}}>🥇 Rank 1 → 1 Year Ultra</span>
                      <span style={{fontSize:10,fontWeight:600,padding:'3px 8px',borderRadius:99,background:'#F0FDF4',color:'#065F46'}}>🎖️ All → Badge + Coins</span>
                    </div>
                    {!isReg&&isOpen?(
                      <button onClick={()=>setShowReg(t)} style={{width:'100%',padding:'13px',background:`linear-gradient(135deg,${NAVY},#0F2140)`,color:'#fff',border:'none',borderRadius:12,fontWeight:800,fontSize:14,cursor:'pointer'}}>
                        {fee>0?`Register ₹${fee} →`:'Register Free →'}
                      </button>
                    ):isReg?(
                      <div>
                        <div style={{background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:10,padding:'8px 12px',marginBottom:8}}>
                          <p style={{fontSize:12,color:'#065F46',fontWeight:700,margin:0}}>✅ Registered! {downloaded?'Questions ready.':'Download questions now.'}</p>
                        </div>
                        {!downloaded&&<button onClick={()=>handleDownload(t)} disabled={downloading[t.tournament_id]} style={{width:'100%',padding:'11px',background:GOLD,color:NAVY,border:'none',borderRadius:12,fontWeight:800,fontSize:13,cursor:'pointer'}}>
                          {downloading[t.tournament_id]?'⏳ Downloading...':'📥 Download Questions (100KB)'}
                        </button>}
                        {downloaded&&<button onClick={()=>navigate(`/tournament/${t.tournament_id}/live`)} style={{width:'100%',padding:'13px',background:'#059669',color:'#fff',border:'none',borderRadius:12,fontWeight:800,fontSize:14,cursor:'pointer'}}>
                          🚀 Enter Tournament →
                        </button>}
                      </div>
                    ):(
                      <p style={{fontSize:12,color:'#94A3B8',textAlign:'center'}}>Opens: {new Date(t.registration_opens).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</p>
                    )}
                    {!isReg&&isOpen&&<p style={{fontSize:10,color:'#94A3B8',textAlign:'center',marginTop:6}}>💡 Group of 5 → ₹{Math.round((fee||5)*0.8)}/each · Refer 3 = YOUR entry free</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab==='polls'&&(
          <div>
            <div style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:12,padding:12,marginBottom:14}}>
              <p style={{fontSize:12,color:'#1D4ED8',margin:0,lineHeight:1.6}}>🗳️ <strong>You decide the next tournament!</strong> Vote for the exam you want. When votes hit the threshold, admin schedules it within 7 days.</p>
            </div>
            <button onClick={()=>navigate('/community')} style={{width:'100%',padding:'12px',background:'#fff',border:'1.5px dashed #94A3B8',borderRadius:12,fontSize:13,color:'var(--color-text-light,#64748B)',cursor:'pointer',marginBottom:14,fontWeight:600}}>
              + Request new exam in Community →
            </button>
            {polls.map(p=>{
              const voted=myVotes.has(p.poll_id)
              const threshold=p.min_votes_national||2000
              const pct=Math.min((p.vote_count/threshold)*100,100)
              return(
                <div key={p.poll_id} style={{background:'#fff',borderRadius:14,padding:14,marginBottom:10,border:'1.5px solid #E2E8F0'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <div>
                      <p style={{fontSize:14,fontWeight:700,color:'var(--color-text,#1E293B)',margin:'0 0 2px'}}>{p.exam_name}</p>
                      <p style={{fontSize:11,color:'var(--color-text-light,#64748B)',margin:0}}>{p.description}</p>
                    </div>
                    {p.status==='threshold_reached'&&<span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,background:'#D1FAE5',color:'#065F46',flexShrink:0}}>✅ Reached!</span>}
                  </div>
                  <div style={{height:6,background:'var(--color-border, #E2E8F0)',borderRadius:99,overflow:'hidden',marginBottom:6}}>
                    <div style={{height:'100%',width:`${pct}%`,background:pct>=100?'#059669':NAVY,borderRadius:99}}/>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <p style={{fontSize:12,color:'var(--color-text-light,#64748B)',margin:0}}>{p.vote_count.toLocaleString('en-IN')}/{threshold.toLocaleString('en-IN')} ({Math.round(pct)}%)</p>
                    <button onClick={()=>handleVote(p.poll_id)} disabled={voted||p.status==='threshold_reached'} style={{padding:'7px 16px',border:'none',borderRadius:10,fontWeight:700,fontSize:12,cursor:voted?'default':'pointer',background:voted?'#F0FDF4':NAVY,color:voted?'#065F46':'#fff',opacity:p.status==='threshold_reached'?0.5:1}}>
                      {voted?'✓ Voted':'▲ Vote'}
                    </button>
                  </div>
                  {p.admin_note&&<div style={{marginTop:8,background:'var(--color-bg,#F8FAFC)',borderRadius:8,padding:'7px 10px'}}><p style={{fontSize:11,color:'#475569',margin:0}}>🛡️ Admin: {p.admin_note}</p></div>}
                </div>
              )
            })}
          </div>
        )}

        {tab==='results'&&(
          <div>
            {results.length===0?(
              <div style={{textAlign:'center',padding:40,color:'#94A3B8'}}>
                <p style={{fontSize:32}}>⏳</p><p>Results announced at exactly 8:00 PM on tournament day.</p>
              </div>
            ):results.map(t=>(
              <button key={t.tournament_id} onClick={()=>navigate(`/tournament/${t.tournament_id}/results`)} style={{width:'100%',background:'#fff',borderRadius:14,padding:14,marginBottom:10,border:'1.5px solid #E2E8F0',textAlign:'left',cursor:'pointer'}}>
                <p style={{fontSize:14,fontWeight:700,color:NAVY,margin:'0 0 4px'}}>{t.tournament_name}</p>
                <p style={{fontSize:12,color:'var(--color-text-light,#64748B)',margin:0}}>🏆 Results live → Tap to see your rank</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {showReg&&<RegModal tournament={showReg} planTier={planTier} user={user} onClose={()=>setShowReg(null)} onDone={(reg)=>{setMyReg(r=>({...r,[showReg.tournament_id]:reg}));setShowReg(null)}}/>}
    </div>
  )
}

function RegModal({tournament,planTier,user,onClose,onDone}){
  const[category,setCategory]=useState('general')
  const[notifyParent,setNotifyParent]=useState(false)
  const[loading,setLoading]=useState(false)
  const fee=planTier==='free'?tournament.entry_fee_free_user:0

  const register=async()=>{
    setLoading(true)
    const setNum=Math.floor(Math.random()*(tournament.question_sets_count||50))+1
    const setId=`set_${String(setNum).padStart(3,'0')}`
    const reg={tournament_id:tournament.tournament_id,user_id:user?.id,category,question_set_id:setId,cdn_question_file:`https://cdn.tryiteducations.net/q/${tournament.tournament_id}/${setId}.enc`,registered_phone:user?.phone||'+91',entry_fee_paid:fee===0,fee_amount:fee,notify_parent:notifyParent,status:'registered'}
    try{const{data}=await supabase.from('tournament_registrations').insert(reg).select().single();onDone(data||reg)}catch{onDone(reg)}
    setLoading(false)
  }

  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:1000}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:'#fff',borderRadius:'20px 20px 0 0',padding:24,width:'100%',maxWidth:460}}>
        <h3 style={{fontFamily:'Poppins,sans-serif',fontWeight:800,color:NAVY,fontSize:16,marginBottom:4}}>Register for Tournament</h3>
        <p style={{fontSize:12,color:'var(--color-text-light,#64748B)',marginBottom:14}}>{tournament.tournament_name}</p>
        <p style={{fontSize:11,fontWeight:700,color:'var(--color-text-light,#64748B)',marginBottom:6}}>Your Category (Private - only you see this)</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:12}}>
          {['general','obc','sc','st','ews','pwd_oh','pwd_vh','ex_servicemen'].map(c=>(
            <button key={c} onClick={()=>setCategory(c)} style={{padding:'6px 10px',borderRadius:8,border:'1.5px solid',fontSize:10,fontWeight:700,cursor:'pointer',borderColor:category===c?NAVY:'#E2E8F0',background:category===c?NAVY:'#fff',color:category===c?'#fff':'#64748B'}}>
              {c.toUpperCase().replace('_',' ')}
            </button>
          ))}
        </div>
        <p style={{fontSize:10,color:'#94A3B8',marginBottom:12}}>🔒 Category rank and cutoff comparison shown only to you</p>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
          <input type="checkbox" checked={notifyParent} onChange={e=>setNotifyParent(e.target.checked)}/>
          <label style={{fontSize:12,color:'#475569'}}>Notify parent at 8 PM with results</label>
        </div>
        <button onClick={register} disabled={loading} style={{width:'100%',padding:'13px',background:`linear-gradient(135deg,${NAVY},#0F2140)`,color:'#fff',border:'none',borderRadius:12,fontWeight:800,fontSize:14,cursor:'pointer'}}>
          {loading?'Registering...':(fee>0?`Register & Pay ₹${fee} →`:'Register Free →')}
        </button>
        <p style={{fontSize:10,color:'#94A3B8',textAlign:'center',marginTop:8}}>You can download questions after registration · Exam works offline</p>
      </div>
    </div>
  )
}