// FILE: src/pages/games/GameLevelRoadmap.jsx
// Route: /games/levels/:gameId
// Thin wrapper — loads game info from catalog, renders cinematic roadmap,
// passes selected level into the actual game via navigation state.
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import LevelRoadmap from '../../components/LevelRoadmap'
import { getLevelConfig } from '../../lib/levelSystem'

// Maps catalog game_id to actual playable route (same map used in GamesHub)
const GAME_ROUTES = {
  gk_blitz:'/games/gk-blitz', math_blitz:'/games/math-blitz', word_rush:'/games/word-rush',
  daily_challenge:'/games/daily-challenge', logic_grid:'/games/logic-grid', number_series:'/games/number-series',
  speed_reading:'/games/speed-reading', sports_mastery:'/games/sports-mastery', current_affairs:'/games/current-affairs',
  battle:'/games/battle',
}

export default function GameLevelRoadmap(){
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [game,setGame]=useState(null)

  useEffect(()=>{
    supabase.from('games_catalog').select('*').eq('game_id',gameId).single()
      .then(({data})=>setGame(data||{game_id:gameId,name:gameId,emoji:'🎮',question_count:10,duration_secs:60}))
      .catch(()=>setGame({game_id:gameId,name:gameId,emoji:'🎮',question_count:10,duration_secs:60}))
  },[gameId])

  const handlePlayLevel=(level, opts={})=>{
    const route = GAME_ROUTES[gameId] || `/games/visual/${gameId}`
    const levelConfig = getLevelConfig(level, game||{})
    navigate(route, { state: { level, levelConfig, isAdminTest: opts.isAdminTest || false } })
  }

  if(!game) return <div style={{minHeight:'100vh',background:'#0A0A14',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:'Inter,sans-serif'}}>Loading...</div>

  return <LevelRoadmap gameId={gameId} gameName={game.name} gameEmoji={game.emoji} onPlayLevel={handlePlayLevel}/>
}