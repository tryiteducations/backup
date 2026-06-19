// FILE: src/pages/leaderboard/Leaderboard.jsx
// TryIT — Full Leaderboard System
// Section A: Live Activity Ticker (opt-in, NO marks, achievements only)
// Section B: Top 20 pinned profile cards by exam/state/period
// Route: /leaderboard
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }     from '../../context/AuthContext'
import { supabase }    from '../../lib/supabase'
import { formatActivityText, rankEmoji, scoreMedal } from '../../components/EmojiSystem'

const NAVY='#1E3A5F', GOLD='#C9A84C', BG='#F8FAFC', GREEN='#059669'

// ── MOCK DATA ─────────────────────────────────────────────────────────────
const MOCK_FEED=[
  {feed_id:'f1',user_name:'Priya',user_state:'Tamil Nadu',activity_type:'streak_milestone',display_text:'is on a 21-day study streak',created_at:new Date(Date.now()-2*60000).toISOString()},
  {feed_id:'f2',user_name:'Arjun',user_state:'Karnataka',activity_type:'concept_unlocked',display_text:'unlocked Reasoning Level 5 concept',created_at:new Date(Date.now()-5*60000).toISOString()},
  {feed_id:'f3',user_name:'Kavitha',user_state:'Kerala',activity_type:'test_milestone',display_text:'completed their 50th test',created_at:new Date(Date.now()-8*60000).toISOString()},
  {feed_id:'f4',user_name:'Ravi',user_state:'Andhra Pradesh',activity_type:'pathway_stage',display_text:'moved to Stage 3 of UPSC Foundation Pathway',created_at:new Date(Date.now()-12*60000).toISOString()},
  {feed_id:'f5',user_name:'Meena',user_state:'UP',activity_type:'badge_earned',display_text:'earned the "Week Warrior" badge',created_at:new Date(Date.now()-15*60000).toISOString()},
  {feed_id:'f6',user_name:'Suresh',user_state:'Maharashtra',activity_type:'topic_completed',display_text:'completed Number System topic',created_at:new Date(Date.now()-20*60000).toISOString()},
  {feed_id:'f7',user_name:'Anjali',user_state:'Bihar',activity_type:'tournament_done',display_text:'completed SSC CGL All India Tournament',created_at:new Date(Date.now()-25*60000).toISOString()},
  {feed_id:'f8',user_name:'Manikandan',user_state:'Tamil Nadu',activity_type:'streak_milestone',display_text:'is on a 35-day study streak',created_at:new Date(Date.now()-30*60000).toISOString()},
]

const MOCK_TOP=[
  {id:'u1',name:'Priya Krishnamurthy',rank:1, state:'Tamil Nadu',city:'Coimbatore',exam:'SSC CGL', streak:28,accuracy:94,score:98420,profile_photo_url:null},
  {id:'u2',name:'Arjun Selvam',       rank:2, state:'Karnataka',city:'Bengaluru', exam:'UPSC CSE',streak:35,accuracy:91,score:97210,profile_photo_url:null},
  {id:'u3',name:'Kavitha Nair',       rank:3, state:'Kerala',   city:'Kochi',     exam:'IBPS PO', streak:21,accuracy:89,score:96870,profile_photo_url:null},
  {id:'u4',name:'Ravi Shankar',       rank:4, state:'Andhra Pradesh',city:'Vijayawada',exam:'SSC CGL',streak:14,accuracy:88,score:95340,profile_photo_url:null},
  {id:'u5',name:'Meena Kumari',       rank:5, state:'UP',       city:'Lucknow',   exam:'TNPSC',  streak:19,accuracy:87,score:94120,profile_photo_url:null},
  {id:'u6',name:'Suresh Babu',        rank:6, state:'Telangana',city:'Hyderabad', exam:'GATE',   streak:12,accuracy:86,score:93800,profile_photo_url:null},
  {id:'u7',name:'Anjali Singh',       rank:7, state:'Bihar',    city:'Patna',     exam:'NEET',   streak:8, accuracy:85,score:92450,profile_photo_url:null},
  {id:'u8',name:'Manikandan P.',      rank:8, state:'Tamil Nadu',city:'Chennai',  exam:'UPSC CSE',streak:22,accuracy:84,score:91200,profile_photo_url:null},
  {id:'u9',name:'Lakshmi Devi',       rank:9, state:'Maharashtra',city:'Mumbai',  exam:'SSC CHSL',streak:16,accuracy:83,score:90870,profile_photo_url:null},
  {id:'u10',name:'Gopal Krishna',     rank:10,state:'Rajasthan',city:'Jaipur',   exam:'IBPS PO', streak:9, accuracy:82,score:89340,profile_photo_url:null},
  {id:'u11',name:'Sangeetha R.',      rank:11,state:'Karnataka',city:'Mysuru',   exam:'KPSC',    streak:11,accuracy:81,score:88100,profile_photo_url:null},
  {id:'u12',name:'Vikram Nair',       rank:12,state:'Kerala',   city:'Trivandrum',exam:'NDA',    streak:7, accuracy:80,score:87650,profile_photo_url:null},
  {id:'u13',name:'Padmavathi S.',     rank:13,state:'Andhra Pradesh',city:'Guntur',exam:'APPSC', streak:15,accuracy:80,score:86420,profile_photo_url:null},
  {id:'u14',name:'Rohit Verma',       rank:14,state:'UP',       city:'Agra',     exam:'SSC CGL', streak:6, accuracy:79,score:85900,profile_photo_url:null},
  {id:'u15',name:'Arthi Devi',        rank:15,state:'Tamil Nadu',city:'Madurai', exam:'TNPSC',   streak:20,accuracy:79,score:84750,profile_photo_url:null},
]

const STATES=['All India','Tamil Nadu','Karnataka','Kerala','Andhra Pradesh','Telangana','Maharashtra','Gujarat','Rajasthan','UP','Bihar','West Bengal','Delhi','MP','Odisha','Punjab']
const EXAMS=['All Exams','SSC CGL','UPSC CSE','IBPS PO','NEET','JEE','GATE','TNPSC','KPSC','RRB NTPC','NDA']

// ── LIVE ACTIVITY TICKER ──────────────────────────────────────────────────
function ActivityTicker({items}){
  const[idx,setIdx]=useState(0)
  const[fade,setFade]=useState(true)

  useEffect(()=>{
    if(!items.length)return
    const t=setInterval(()=>{
      setFade(false)
      setTimeout(()=>{setIdx(i=>(i+1)%items.length);setFade(true)},400)
    },4000)
    return()=>clearInterval(t)
  },[items.length])

  if(!items.length)return null
  const item=items[idx]
  const{emoji,text}=formatActivityText(item)

  return(
    <div style={{background:`linear-gradient(90deg,${NAVY}ee,#0F2140ee)`,padding:'8px 16px',display:'flex',alignItems:'center',gap:8,overflow:'hidden'}}>
      <span style={{fontSize:14,flexShrink:0}}>{emoji}</span>
      <p style={{fontSize:11,color:'rgba(255,255,255,0.85)',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1,opacity:fade?1:0,transition:'opacity 0.4s'}}>
        <strong>{item.user_name}</strong> from {item.user_state} {text}
      </p>
      <span style={{fontSize:9,color:'rgba(255,255,255,0.3)',flexShrink:0,letterSpacing:0.5}}>LIVE</span>
    </div>
  )
}

// ── AVATAR ────────────────────────────────────────────────────────────────
function Avatar({name,photoUrl,size=40,isOwner=false}){
  const initials=(name||'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  if(photoUrl&&!isOwner){
    // Anti-screenshot for others' photos
    return(
      <div style={{width:size,height:size,borderRadius:'50%',overflow:'hidden',flexShrink:0,
        WebkitUserSelect:'none',userSelect:'none',pointerEvents:'none'}}>
        <img src={photoUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}
          onContextMenu={e=>e.preventDefault()} draggable={false}/>
      </div>
    )
  }
  return(
    <div style={{width:size,height:size,borderRadius:'50%',background:`${NAVY}20`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Poppins,sans-serif',fontWeight:800,fontSize:size*0.35,color:NAVY,flexShrink:0}}>
      {initials||'?'}
    </div>
  )
}

// ── MAIN LEADERBOARD ──────────────────────────────────────────────────────
export default function Leaderboard(){
  const navigate=useNavigate()
  const{user}=useAuth()
  const[feed,setFeed]=useState(MOCK_FEED)
  const[top,setTop]=useState(MOCK_TOP)
  const[period,setPeriod]=useState('weekly')
  const[stateF,setStateF]=useState('All India')
  const[examF,setExamF]=useState('All Exams')
  const[myRank,setMyRank]=useState({rank:1247,score:42180,accuracy:71,streak:5,state:'Tamil Nadu'})
  const[tab,setTab]=useState('leaderboard')  // 'leaderboard'|'activity'

  useEffect(()=>{
    // Load activity feed
    supabase.from('leaderboard_activity_feed')
      .select('*').eq('opt_in',true)
      .gte('created_at',new Date(Date.now()-86400000).toISOString())
      .order('created_at',{ascending:false}).limit(20)
      .then(({data})=>{if(data?.length)setFeed(data)})
      .catch(()=>{})

    // Load top performers
    supabase.from('leaderboard_snapshots')
      .select('*').order('rank',{ascending:true}).limit(20)
      .then(({data})=>{if(data?.length)setTop(data)})
      .catch(()=>{})
  },[])

  const filtered=top
    .filter(e=>stateF==='All India'||e.state===stateF)
    .filter(e=>examF==='All Exams'||e.exam===examF)

  const podium=filtered.slice(0,3)
  const rest=filtered.slice(3)

  return(
    <div style={{minHeight:'100vh',background:BG,fontFamily:'Inter,sans-serif',paddingBottom:80}}>

      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${NAVY},#0F2140)`,paddingBottom:0}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'20px 16px 12px'}}>
          <button onClick={()=>navigate(-1)} style={{background:'rgba(255,255,255,0.1)',border:'none',color:'rgba(255,255,255,0.7)',width:34,height:34,borderRadius:'50%',fontSize:16,cursor:'pointer'}}>←</button>
          <h1 style={{fontFamily:'Poppins,sans-serif',fontWeight:800,fontSize:18,color:'#fff',margin:0}}>🏆 Leaderboard</h1>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',padding:'0 16px'}}>
          {[{id:'leaderboard',l:'🏆 Rankings'},{id:'activity',l:'⚡ Live Activity'}].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:'10px 8px',border:'none',background:'transparent',cursor:'pointer',fontSize:12,fontWeight:700,color:tab===t.id?GOLD:'rgba(255,255,255,0.5)',borderBottom:tab===t.id?`2px solid ${GOLD}`:'2px solid transparent'}}>
              {t.l}
            </button>
          ))}
        </div>

        {/* Activity Ticker — always visible */}
        <ActivityTicker items={feed}/>
      </div>

      {tab==='leaderboard'&&(
        <>
          {/* Period toggle */}
          <div style={{background:'#fff',padding:'12px 16px',borderBottom:'1px solid #E2E8F0'}}>
            <div style={{display:'flex',background:'#F1F5F9',borderRadius:10,padding:3,marginBottom:10}}>
              {[['weekly','This Week'],['monthly','This Month'],['yearly','This Year'],['alltime','All Time']].map(([id,l])=>(
                <button key={id} onClick={()=>setPeriod(id)} style={{flex:1,padding:'7px 0',borderRadius:8,border:'none',cursor:'pointer',fontSize:11,fontWeight:700,background:period===id?NAVY:'transparent',color:period===id?'#fff':'#64748B'}}>
                  {l}
                </button>
              ))}
            </div>
            <div style={{display:'flex',gap:8}}>
              <select value={stateF} onChange={e=>setStateF(e.target.value)} style={{flex:1,padding:'8px 10px',borderRadius:9,border:'1.5px solid #E2E8F0',fontSize:11,color:'#475569'}}>
                {STATES.map(s=><option key={s}>{s}</option>)}
              </select>
              <select value={examF} onChange={e=>setExamF(e.target.value)} style={{flex:1,padding:'8px 10px',borderRadius:9,border:'1.5px solid #E2E8F0',fontSize:11,color:'#475569'}}>
                {EXAMS.map(e=><option key={e}>{e}</option>)}
              </select>
            </div>
          </div>

          {/* My rank sticky */}
          {myRank&&(
            <div style={{background:'#fff',padding:'8px 16px',borderBottom:'2px solid #E2E8F0'}}>
              <div style={{background:`${NAVY}08`,borderRadius:12,padding:'10px 12px',border:`1.5px solid ${NAVY}22`,display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:13,fontWeight:800,color:NAVY,width:32,textAlign:'center'}}>#{myRank.rank?.toLocaleString('en-IN')}</span>
                <Avatar name={user?.name||'You'} photoUrl={user?.profile_photo_url} size={32} isOwner/>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,fontWeight:700,color:NAVY,margin:0}}>{user?.name||'You'} <span style={{color:'#94A3B8',fontSize:10}}>(your rank)</span></p>
                  <p style={{fontSize:10,color:'#94A3B8',margin:0}}>{myRank.state} · 🔥{myRank.streak}d streak</p>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{fontSize:13,fontWeight:800,color:NAVY,margin:0}}>{myRank.score?.toLocaleString('en-IN')}</p>
                  <p style={{fontSize:10,color:'#94A3B8',margin:0}}>{myRank.accuracy}% accuracy</p>
                </div>
              </div>
            </div>
          )}

          <div style={{padding:16,maxWidth:480,margin:'0 auto'}}>

            {/* PODIUM — Top 3 */}
            {podium.length>=3&&(
              <div style={{display:'flex',alignItems:'flex-end',gap:8,marginBottom:16}}>
                {/* 2nd */}
                <div style={{flex:1,textAlign:'center'}}>
                  <Avatar name={podium[1].name} photoUrl={podium[1].profile_photo_url} size={48} isOwner={false}/>
                  <div style={{background:'linear-gradient(135deg,#94A3B8,#64748B)',borderRadius:'0 0 12px 12px',padding:'6px 4px',marginTop:-4}}>
                    <p style={{fontSize:12,margin:'0 0 1px'}}>🥈</p>
                    <p style={{fontSize:10,color:'#fff',margin:'0 0 1px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{podium[1].name.split(' ')[0]}</p>
                    <p style={{fontSize:10,color:'rgba(255,255,255,0.8)',margin:0}}>{podium[1].score?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                {/* 1st */}
                <div style={{flex:1.2,textAlign:'center'}}>
                  <div style={{position:'relative',display:'inline-block',marginBottom:-4}}>
                    <span style={{position:'absolute',top:-14,left:'50%',transform:'translateX(-50%)',fontSize:20}}>👑</span>
                    <Avatar name={podium[0].name} photoUrl={podium[0].profile_photo_url} size={60} isOwner={false}/>
                  </div>
                  <div style={{background:`linear-gradient(135deg,${GOLD},#E8C96A)`,borderRadius:'0 0 14px 14px',padding:'8px 4px',marginTop:0}}>
                    <p style={{fontSize:13,margin:'0 0 1px'}}>🥇 #1</p>
                    <p style={{fontSize:11,color:NAVY,fontWeight:700,margin:'0 0 1px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{podium[0].name.split(' ')[0]}</p>
                    <p style={{fontSize:11,color:'#92400E',fontWeight:800,margin:0}}>{podium[0].score?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                {/* 3rd */}
                <div style={{flex:1,textAlign:'center'}}>
                  <Avatar name={podium[2].name} photoUrl={podium[2].profile_photo_url} size={44} isOwner={false}/>
                  <div style={{background:'linear-gradient(135deg,#CD7F32,#A0522D)',borderRadius:'0 0 12px 12px',padding:'6px 4px',marginTop:-4}}>
                    <p style={{fontSize:11,margin:'0 0 1px'}}>🥉</p>
                    <p style={{fontSize:10,color:'#fff',margin:'0 0 1px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{podium[2].name.split(' ')[0]}</p>
                    <p style={{fontSize:10,color:'rgba(255,255,255,0.8)',margin:0}}>{podium[2].score?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ranking formula note */}
            <div style={{background:'#F8FAFC',borderRadius:10,padding:'8px 12px',marginBottom:12,border:'1px solid #E2E8F0'}}>
              <p style={{fontSize:10,color:'#94A3B8',margin:0,lineHeight:1.6}}>
                📊 Rank = Accuracy×40% + Speed×25% + Streak×20% + Volume×10% + Recency×5%<br/>
                Tournament rank uses exact exam marking scheme (SSC: +2/-0.5, UPSC: +2/-0.67 etc.)
              </p>
            </div>

            {/* Rest of list: ranks 4-20 */}
            {rest.map((entry,i)=>{
              const isMe=entry.id===user?.id
              const re=rankEmoji(entry.rank)
              return(
                <div key={entry.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',marginBottom:6,background:isMe?`${NAVY}08`:'#fff',borderRadius:12,border:isMe?`2px solid ${NAVY}33`:'1.5px solid #E2E8F0'}}>
                  <span style={{fontSize:13,fontWeight:800,color:'#94A3B8',width:32,textAlign:'center',flexShrink:0}}>{re}</span>
                  <Avatar name={entry.name} photoUrl={entry.profile_photo_url} size={36} isOwner={false}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:12,fontWeight:700,color:isMe?NAVY:'#1E293B',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {entry.name} {isMe&&<span style={{color:NAVY,fontSize:9}}>(You)</span>}
                    </p>
                    <p style={{fontSize:10,color:'#94A3B8',margin:'2px 0 0'}}>{entry.state} · {entry.city} · 🔥{entry.streak}d</p>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <p style={{fontSize:13,fontWeight:800,color:NAVY,margin:0}}>{entry.score?.toLocaleString('en-IN')}</p>
                    <p style={{fontSize:10,color:'#94A3B8',margin:0}}>{entry.accuracy}% acc</p>
                  </div>
                </div>
              )
            })}

            {filtered.length===0&&(
              <div style={{textAlign:'center',padding:32,color:'#94A3B8'}}>
                <p style={{fontSize:24}}>🔍</p>
                <p>No results for this filter. Try a different state or exam.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ACTIVITY FEED TAB */}
      {tab==='activity'&&(
        <div style={{padding:16,maxWidth:480,margin:'0 auto'}}>
          <div style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:12,padding:12,marginBottom:14}}>
            <p style={{fontSize:12,color:'#1D4ED8',margin:0,lineHeight:1.6}}>
              ⚡ <strong>Live Activity Feed</strong> — Achievements only, no marks shown.<br/>
              You see: streaks, concept unlocks, badges, milestones.<br/>
              Opt-in via Profile → Settings to appear here.
            </p>
          </div>
          {feed.map((item,i)=>{
            const{emoji,text}=formatActivityText(item)
            const ago=Math.round((Date.now()-new Date(item.created_at).getTime())/60000)
            return(
              <div key={item.feed_id} style={{background:'#fff',borderRadius:12,padding:'12px 14px',marginBottom:8,border:'1.5px solid #E2E8F0',display:'flex',alignItems:'flex-start',gap:10}}>
                <span style={{fontSize:20,flexShrink:0}}>{emoji}</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:12,color:'#1E293B',margin:'0 0 2px',lineHeight:1.5}}>
                    <strong>{item.user_name}</strong> from <strong>{item.user_state||'India'}</strong> {text}
                  </p>
                  <p style={{fontSize:10,color:'#94A3B8',margin:0}}>{ago<1?'Just now':ago<60?`${ago}m ago`:`${Math.round(ago/60)}h ago`}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}