// FILE: src/components/ShareCard.jsx
// TryIT — Social Share Cards for Student / Mentor / Institution
// All cards: TryIT logo + tryiteducations.net branding
// Social sharing OFF by default (admin toggle). Only fires when user chooses.
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const NAVY='#1E3A5F', GOLD='#C9A84C'

// ── CARD RENDERERS ────────────────────────────────────────────────────────

function TryITLogo({size=14}){
  return(
    <span style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:size,letterSpacing:0.5}}>
      <span style={{color:'#fff'}}>Try</span>
      <span style={{color:GOLD}}>IT</span>
      <span style={{color:'rgba(255,255,255,0.6)',fontSize:size*0.65,fontWeight:600}}> Educations</span>
    </span>
  )
}

// STUDENT: Tournament result card
function StudentResultCard({userName,rank,score,exam,total,medal,userState}){
  return(
    <div style={{background:`linear-gradient(145deg,${NAVY},#0F2140)`,borderRadius:20,padding:20,textAlign:'center',border:`2px solid ${GOLD}44`,minWidth:280}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <TryITLogo/>
        <span style={{fontSize:9,color:'rgba(255,255,255,0.4)',letterSpacing:1}}>tryiteducations.net</span>
      </div>
      <p style={{fontSize:40,margin:'0 0 4px'}}>{medal?.emoji||'🏆'}</p>
      <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:36,color:GOLD,margin:'0 0 2px',lineHeight:1}}>#{rank?.toLocaleString('en-IN')}</p>
      <p style={{fontSize:11,color:'rgba(255,255,255,0.7)',margin:'0 0 12px'}}>All India Rank · {exam}</p>
      <div style={{background:'rgba(255,255,255,0.08)',borderRadius:12,padding:'8px 0',marginBottom:12}}>
        <p style={{fontSize:13,fontWeight:700,color:'#fff',margin:'0 0 2px'}}>{userName}</p>
        <p style={{fontSize:10,color:'rgba(255,255,255,0.5)',margin:0}}>{userState||'India'} · Score: {score}</p>
      </div>
      <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',margin:0}}>out of {total?.toLocaleString('en-IN')||'—'} students · tryiteducations.net</p>
    </div>
  )
}

// MENTOR: Daily stats card
function MentorStatsCard({mentorName,solved,state,isMentorOfDay}){
  return(
    <div style={{background:`linear-gradient(145deg,#7C3AED,#5B21B6)`,borderRadius:20,padding:20,border:`2px solid rgba(255,255,255,0.1)`,minWidth:280}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <TryITLogo/>
        <span style={{fontSize:9,color:'rgba(255,255,255,0.4)',letterSpacing:1}}>tryiteducations.net</span>
      </div>
      {isMentorOfDay&&<div style={{background:GOLD,borderRadius:8,padding:'4px 12px',textAlign:'center',marginBottom:12}}><p style={{fontSize:11,fontWeight:800,color:NAVY,margin:0}}>🏅 MENTOR OF THE DAY</p></div>}
      <p style={{fontSize:36,textAlign:'center',margin:'0 0 8px'}}>🧑‍🏫</p>
      <p style={{fontFamily:'Poppins,sans-serif',fontWeight:800,fontSize:18,color:'#fff',textAlign:'center',margin:'0 0 4px'}}>{mentorName}</p>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.7)',textAlign:'center',margin:'0 0 16px'}}>{state||'India'}</p>
      <div style={{background:'rgba(255,255,255,0.1)',borderRadius:12,padding:12,textAlign:'center'}}>
        <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:40,color:GOLD,margin:'0 0 2px',lineHeight:1}}>{solved}</p>
        <p style={{fontSize:12,color:'rgba(255,255,255,0.7)',margin:0}}>students helped today</p>
      </div>
      <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',textAlign:'center',marginTop:10}}>Mentoring on TryIT Educations · tryiteducations.net</p>
    </div>
  )
}

// INSTITUTION: Live test announcement
function InstitutionLiveCard({centreName,examName,testDate,testTime}){
  return(
    <div style={{background:`linear-gradient(145deg,#059669,#047857)`,borderRadius:20,padding:20,border:`2px solid rgba(255,255,255,0.15)`,minWidth:280}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <TryITLogo/>
        <span style={{background:'#DC2626',color:'#fff',fontSize:9,fontWeight:800,padding:'2px 8px',borderRadius:99,letterSpacing:1}}>🔴 LIVE</span>
      </div>
      <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:20,color:'#fff',margin:'0 0 4px'}}>{centreName}</p>
      <p style={{fontSize:13,color:'rgba(255,255,255,0.8)',margin:'0 0 16px'}}>is conducting a LIVE test on TryIT Educations</p>
      <div style={{background:'rgba(255,255,255,0.15)',borderRadius:12,padding:12,marginBottom:12}}>
        <p style={{fontWeight:800,color:'#fff',fontSize:16,margin:'0 0 2px'}}>📋 {examName}</p>
        <p style={{fontSize:11,color:'rgba(255,255,255,0.7)',margin:0}}>{testDate} · {testTime}</p>
      </div>
      <div style={{background:'rgba(255,255,255,0.2)',borderRadius:10,padding:'10px',textAlign:'center'}}>
        <p style={{fontSize:12,fontWeight:700,color:'#fff',margin:0}}>Join at tryiteducations.net</p>
      </div>
    </div>
  )
}

// INSTITUTION: Result card after test
function InstitutionResultCard({centreName,examName,avgScore,topPerformer,totalStudents,emojiCounts}){
  const total=Object.values(emojiCounts||{}).reduce((a,b)=>a+b,0)||1
  return(
    <div style={{background:`linear-gradient(145deg,${NAVY},#0F2140)`,borderRadius:20,padding:20,border:`2px solid ${GOLD}44`,minWidth:280}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <TryITLogo/>
        <span style={{fontSize:9,color:'rgba(255,255,255,0.4)'}}>tryiteducations.net</span>
      </div>
      <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:16,color:'#fff',margin:'0 0 2px'}}>{centreName}</p>
      <p style={{fontSize:12,color:'rgba(255,255,255,0.6)',margin:'0 0 12px'}}>{examName} · {totalStudents} students</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
        <div style={{background:'rgba(255,255,255,0.08)',borderRadius:10,padding:10,textAlign:'center'}}>
          <p style={{fontWeight:900,color:GOLD,fontSize:24,margin:'0 0 2px'}}>{avgScore}%</p>
          <p style={{fontSize:9,color:'rgba(255,255,255,0.4)',margin:0}}>Average Score</p>
        </div>
        <div style={{background:'rgba(255,255,255,0.08)',borderRadius:10,padding:10,textAlign:'center'}}>
          <p style={{fontWeight:900,color:'#fff',fontSize:13,margin:'0 0 2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{topPerformer}</p>
          <p style={{fontSize:9,color:'rgba(255,255,255,0.4)',margin:0}}>🥇 Top Performer</p>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-around',background:'rgba(255,255,255,0.06)',borderRadius:10,padding:8}}>
        {[['😊','Easy'],['😐','Medium'],['😤','Hard']].map(([e,l])=>(
          <div key={l} style={{textAlign:'center'}}>
            <p style={{fontSize:18,margin:'0 0 1px'}}>{e}</p>
            <p style={{fontSize:9,color:'rgba(255,255,255,0.5)',margin:0}}>{Math.round(((emojiCounts?.[e]||0)/total)*100)}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// PARENT: Child result card (emotional, shareable to family)
function ParentChildCard({childName,rank,exam,score,medal,total}){
  return(
    <div style={{background:`linear-gradient(145deg,#7C3AED,#5B21B6)`,borderRadius:20,padding:20,textAlign:'center',minWidth:280}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <TryITLogo/>
        <span style={{fontSize:9,color:'rgba(255,255,255,0.4)'}}>tryiteducations.net</span>
      </div>
      <p style={{fontSize:14,color:'rgba(255,255,255,0.8)',margin:'0 0 4px'}}>🇮🇳 My child</p>
      <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:22,color:'#fff',margin:'0 0 12px'}}>{childName}</p>
      <p style={{fontSize:36,margin:'0 0 4px'}}>{medal?.emoji||'🏆'}</p>
      <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:40,color:GOLD,margin:'0 0 2px',lineHeight:1}}>
        #{rank?.toLocaleString('en-IN')}
      </p>
      <p style={{fontSize:12,color:'rgba(255,255,255,0.7)',margin:'0 0 12px'}}>All India · {exam}</p>
      <p style={{fontSize:11,color:'rgba(255,255,255,0.5)',margin:0}}>Prepared on TryIT Educations · tryiteducations.net</p>
    </div>
  )
}

// GAME: Mini-game result card (sticker flex, not exam result)
function GameResultCard({userName,gameName,gameEmoji,score,medal,bestStreak}){
  return(
    <div style={{background:`linear-gradient(145deg,#7C3AED,#4C1D95)`,borderRadius:20,padding:20,textAlign:'center',border:`2px solid ${GOLD}44`,minWidth:280}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <TryITLogo/>
        <span style={{fontSize:9,color:'rgba(255,255,255,0.4)'}}>tryiteducations.net</span>
      </div>
      <p style={{fontSize:40,margin:'0 0 4px'}}>{medal?.emoji||'🎮'}</p>
      <p style={{fontFamily:'Poppins,sans-serif',fontWeight:900,fontSize:32,color:GOLD,margin:'0 0 2px',lineHeight:1}}>{score}</p>
      <p style={{fontSize:11,color:'rgba(255,255,255,0.7)',margin:'0 0 12px'}}>{gameEmoji} {gameName} · {medal?.label}</p>
      <div style={{background:'rgba(255,255,255,0.1)',borderRadius:12,padding:'8px 0',marginBottom:8}}>
        <p style={{fontSize:13,fontWeight:700,color:'#fff',margin:'0 0 2px'}}>{userName}</p>
        {bestStreak>0 && <p style={{fontSize:10,color:'rgba(255,255,255,0.5)',margin:0}}>🔥 {bestStreak}x best combo</p>}
      </div>
      <p style={{fontSize:10,color:'rgba(255,255,255,0.4)',margin:0}}>Training my mind on TryIT Educations 🧠</p>
    </div>
  )
}

// ── MAIN ShareCard COMPONENT ──────────────────────────────────────────────
export default function ShareCard({type,data,onClose}){
  const[sharing,setSharing]=useState(false)

  const getText=()=>{
    switch(type){
      case 'student_result': return `🏆 I ranked #${data.rank?.toLocaleString('en-IN')} All India in ${data.exam} on TryIT Educations!\n📊 Score: ${data.score} | ${data.medal?.label}\n🌐 tryiteducations.net`
      case 'mentor_stats':   return `🧑‍🏫 I helped ${data.solved} students today on TryIT Educations${data.isMentorOfDay?' — and I am Mentor of the Day! 🏅':'!'}\n🌐 tryiteducations.net`
      case 'institution_live':return `🔴 LIVE NOW: ${data.centreName} is conducting ${data.examName} on TryIT Educations!\nJoin now: tryiteducations.net`
      case 'institution_result':return `📊 ${data.centreName} — ${data.examName} Results\nAvg Score: ${data.avgScore}% | ${data.totalStudents} students\n🌐 tryiteducations.net`
      case 'parent_child':   return `🎉 My child ${data.childName} ranked #${data.rank?.toLocaleString('en-IN')} All India in ${data.exam}!\nPrepared on TryIT Educations 🇮🇳\n🌐 tryiteducations.net`
      case 'game_result':    return `🎮 Scored ${data.score} pts in ${data.gameName} on TryIT Educations!\n${data.medal?.emoji} ${data.medal?.label}${data.bestStreak?` · 🔥${data.bestStreak}x combo`:''}\nSharpening my mind for exams — join me! 🧠\n🌐 tryiteducations.net`
      default:               return 'Check out TryIT Educations — tryiteducations.net'
    }
  }

  const handleShare=async(platform)=>{
    setSharing(true)
    const text=getText()

    // Log share
    try{
      await supabase.from('social_share_logs').insert({
        share_role:data.role||'student',
        share_type:type,
        platform,
        reference_id:data.referenceId,
      })
    }catch{}

    if(platform==='native'&&navigator.share){
      try{await navigator.share({title:'TryIT Educations',text,url:'https://tryiteducations.net'})}catch{}
    }else{
      navigator.clipboard.writeText(text)
      alert('✅ Copied! Paste anywhere to share.')
    }
    setSharing(false)
    onClose?.()
  }

  const renderCard=()=>{
    switch(type){
      case 'student_result':    return <StudentResultCard {...data}/>
      case 'mentor_stats':      return <MentorStatsCard {...data}/>
      case 'institution_live':  return <InstitutionLiveCard {...data}/>
      case 'institution_result':return <InstitutionResultCard {...data}/>
      case 'parent_child':      return <ParentChildCard {...data}/>
      case 'game_result':       return <GameResultCard {...data}/>
      default:                  return null
    }
  }

  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:1000,fontFamily:'Inter,sans-serif'}}
      onClick={e=>e.target===e.currentTarget&&onClose?.()}>
      <div style={{background:'#1a1a2e',borderRadius:'20px 20px 0 0',padding:24,width:'100%',maxWidth:460,maxHeight:'90vh',overflowY:'auto'}}>
        <p style={{fontSize:13,fontWeight:700,color:'rgba(255,255,255,0.6)',marginBottom:14,textAlign:'center'}}>Share your result</p>

        {/* Card preview */}
        <div style={{display:'flex',justifyContent:'center',marginBottom:16}}>
          {renderCard()}
        </div>

        {/* Share buttons */}
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <button onClick={()=>handleShare('native')} disabled={sharing}
            style={{padding:'13px',background:GOLD,color:NAVY,border:'none',borderRadius:12,fontWeight:800,fontSize:14,cursor:'pointer'}}>
            📤 Share Now
          </button>
          <button onClick={()=>handleShare('copy')} disabled={sharing}
            style={{padding:'11px',background:'rgba(255,255,255,0.08)',color:'#fff',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,fontWeight:600,fontSize:13,cursor:'pointer'}}>
            📋 Copy Text
          </button>
          <button onClick={()=>handleShare('whatsapp')} disabled={sharing}
            style={{padding:'11px',background:'#25D366',color:'#fff',border:'none',borderRadius:12,fontWeight:700,fontSize:13,cursor:'pointer'}}
            onClick={()=>{window.open(`https://wa.me/?text=${encodeURIComponent(getText())}`,'_blank');handleShare('whatsapp')}}>
            💬 WhatsApp
          </button>
          <button onClick={onClose}
            style={{padding:'10px',background:'none',color:'rgba(255,255,255,0.4)',border:'none',fontSize:12,cursor:'pointer'}}>
            Cancel
          </button>
        </div>
        <p style={{fontSize:10,color:'rgba(255,255,255,0.2)',textAlign:'center',marginTop:8}}>
          All shares include TryIT Educations branding · Social sharing is user-controlled
        </p>
      </div>
    </div>
  )
}