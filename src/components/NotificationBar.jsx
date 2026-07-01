// FILE: src/components/NotificationBar.jsx
// TryIT - Sticky In-App Notification Banner + Push Setup
// Shows banners for all 17 notification types
// Add <NotificationBar /> once in App.jsx - works everywhere
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }     from '../context/AuthContext'
import { supabase }    from '../lib/supabase'

const NAVY='#1E3A5F', GOLD='#C9A84C'

const NOTIF_CONFIG={
  tournament_registration_open: {emoji:'🏆',color:'#1D4ED8',bg:'#EFF6FF',link:'/tournament',pri:2},
  tournament_reminder_48h:      {emoji:'⏰',color:'#D97706',bg:'#FFF7E6',link:'/tournament',pri:2},
  tournament_reminder_2h:       {emoji:'🚨',color:'#DC2626',bg:'#FEF2F2',link:'/tournament',pri:3},
  tournament_reminder_15m:      {emoji:'🔔',color:'#DC2626',bg:'#FEF2F2',link:'/tournament',pri:3},
  tournament_started:           {emoji:'🔴',color:'#DC2626',bg:'#FEF2F2',link:'/tournament',pri:3},
  tournament_results_computing: {emoji:'⏳',color:'#7C3AED',bg:'#F3E8FF',link:'/tournament',pri:2},
  tournament_results_live:      {emoji:'🏆',color:'#D97706',bg:'#FFF7E6',link:'/tournament',pri:3},
  prize_awarded:                {emoji:'🎉',color:'#059669',bg:'#F0FDF4',link:'/profile',    pri:3},
  daily_bharat_pulse:           {emoji:'🇮🇳',color:'#1D4ED8',bg:'#EFF6FF',link:'/bharat-pulse',pri:1},
  concept_unlocked:             {emoji:'🧠',color:'#7C3AED',bg:'#F3E8FF',link:'/concept',   pri:1},
  streak_reminder:              {emoji:'🔥',color:'#DC2626',bg:'#FEF2F2',link:'/dashboard', pri:1},
  material_posted:              {emoji:'📄',color:'#0891B2',bg:'#EFF6FF',link:'/materials', pri:1},
  community_accepted:           {emoji:'✅',color:'#059669',bg:'#F0FDF4',link:'/community', pri:1},
  exam_alert:                   {emoji:'📋',color:'#1D4ED8',bg:'#EFF6FF',link:'/exams',     pri:2},
  parent_child_result:          {emoji:'👨‍👩‍👦',color:'#D97706',bg:'#FFF7E6',link:'/family',  pri:2},
  mentor_of_day:                {emoji:'🧑‍🏫',color:'#7C3AED',bg:'#F3E8FF',link:'/mentor',  pri:2},
  institution_live_test:        {emoji:'🏫',color:'#059669',bg:'#F0FDF4',link:'/tests',     pri:2},
  daily_challenge_unlock:       {emoji:'📅',color:'#D97706',bg:'#FFF7E6',link:'/games/daily-challenge',pri:2},
  momentum_at_risk:             {emoji:'🔥',color:'#DC2626',bg:'#FEF2F2',link:'/games',      pri:3},
  new_game_unlocked:            {emoji:'🎮',color:'#7C3AED',bg:'#F3E8FF',link:'/games',       pri:1},
  sticker_unlocked:             {emoji:'🏅',color:'#D97706',bg:'#FFF7E6',link:'/profile',     pri:1},
}

export default function NotificationBar(){
  const navigate=useNavigate()
  const{user}=useAuth()
  const[current,setCurrent]=useState(null)
  const[queue,setQueue]=useState([])
  const[dismissed,setDismissed]=useState(new Set())
  const[showPushAsk,setShowPushAsk]=useState(false)

  // Load from Supabase
  useEffect(()=>{
    if(!user?.id)return
    const load=async()=>{
      const{data}=await supabase.from('notification_queue')
        .select('*').or(`user_id.eq.${user.id},user_id.is.null`)
        .lte('send_at',new Date().toISOString()).eq('sent',false)
        .order('send_at',{ascending:false}).limit(10)
      if(data?.length)setQueue(data.filter(n=>!dismissed.has(n.notif_id)))
    }
    load()
    const iv=setInterval(load,60000)
    return()=>clearInterval(iv)
  },[user?.id])

  // Show next
  useEffect(()=>{
    if(current||queue.length===0)return
    const sorted=[...queue].sort((a,b)=>(NOTIF_CONFIG[b.notif_type]?.pri||1)-(NOTIF_CONFIG[a.notif_type]?.pri||1))
    setCurrent(sorted[0])
    setQueue(q=>q.filter(n=>n.notif_id!==sorted[0].notif_id))
  },[queue,current])

  // Auto-dismiss
  useEffect(()=>{
    if(!current)return
    const dur=(NOTIF_CONFIG[current.notif_type]?.pri||1)>=3?10000:6000
    const t=setTimeout(dismiss,dur)
    return()=>clearTimeout(t)
  },[current])

  const dismiss=useCallback(()=>{
    if(!current)return
    setDismissed(d=>new Set([...d,current.notif_id]))
    supabase.from('notification_queue').update({sent:true,sent_at:new Date().toISOString()}).eq('notif_id',current.notif_id).then(()=>{}).catch(()=>{})
    setCurrent(null)
  },[current])

  const handleTap=()=>{
    const link=current?.deep_link||NOTIF_CONFIG[current?.notif_type]?.link
    if(link)navigate(link)
    dismiss()
  }

  // Ask push permission after 30s
  useEffect(()=>{
    if(typeof Notification==='undefined')return
    if(Notification.permission==='granted')return
    if(Notification.permission==='denied')return
    if(localStorage.getItem('tryit_push_asked'))return
    const t=setTimeout(()=>setShowPushAsk(true),30000)
    return()=>clearTimeout(t)
  },[])

  const requestPush=async()=>{
    setShowPushAsk(false)
    localStorage.setItem('tryit_push_asked','1')
    if(typeof Notification==='undefined')return
    const p=await Notification.requestPermission()
    if(p==='granted'){
      try{await supabase.functions.invoke('register-push-token',{body:{user_id:user?.id,platform:'web'}})}catch{}
    }
  }

  const cfg=current?NOTIF_CONFIG[current.notif_type]:null

  return(
    <>
      {current&&cfg&&(
        <div onClick={handleTap} style={{position:'fixed',top:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:480,zIndex:9999,background:cfg.bg,borderBottom:`3px solid ${cfg.color}`,padding:'10px 16px',display:'flex',alignItems:'center',gap:10,cursor:'pointer',boxShadow:'0 4px 20px rgba(0,0,0,0.15)',animation:'slideDown 0.3s ease'}}>
          <span style={{fontSize:20,flexShrink:0}}>{cfg.emoji}</span>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontSize:12,fontWeight:700,color:cfg.color,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{current.title}</p>
            <p style={{fontSize:11,color:'#475569',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{current.body}</p>
          </div>
          <button onClick={e=>{e.stopPropagation();dismiss()}} style={{background:'none',border:'none',color:'#94A3B8',fontSize:16,cursor:'pointer',padding:'2px 6px',flexShrink:0}}>✕</button>
        </div>
      )}

      {showPushAsk&&(
        <div style={{position:'fixed',bottom:80,left:'50%',transform:'translateX(-50%)',width:'calc(100% - 32px)',maxWidth:448,zIndex:9998,background:'#fff',borderRadius:16,padding:16,boxShadow:'0 8px 32px rgba(0,0,0,0.2)',border:`1.5px solid ${NAVY}22`}}>
          <p style={{fontSize:14,fontWeight:700,color:NAVY,margin:'0 0 4px'}}>🔔 Get exam alerts & result notifications</p>
          <p style={{fontSize:12,color:'var(--color-text-light,#64748B)',margin:'0 0 12px',lineHeight:1.6}}>Tournament results at 8 PM, Daily Bharat Pulse, streak reminders, prize awards.</p>
          <div style={{display:'flex',gap:8}}>
            <button onClick={requestPush} style={{flex:1,padding:'10px',background:NAVY,color:'#fff',border:'none',borderRadius:10,fontWeight:700,fontSize:13,cursor:'pointer'}}>Allow Notifications</button>
            <button onClick={()=>{setShowPushAsk(false);localStorage.setItem('tryit_push_asked','1')}} style={{padding:'10px 16px',background:'#F1F5F9',color:'var(--color-text-light,#64748B)',border:'none',borderRadius:10,fontSize:12,cursor:'pointer'}}>Not Now</button>
          </div>
        </div>
      )}
      <style>{`@keyframes slideDown{from{transform:translateX(-50%) translateY(-100%);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}`}</style>
    </>
  )
}

// Hook for adding notifications from anywhere
export function useNotification(){
  const{user}=useAuth()
  return{
    notify:async(type,title,body,opts={})=>{
      await supabase.from('notification_queue').insert({
        user_id:opts.userId||user?.id||null,notif_type:type,title,body,
        reference_id:opts.refId,deep_link:opts.link||NOTIF_CONFIG[type]?.link,
        send_at:opts.sendAt||new Date().toISOString()
      })
    }
  }
}