// FILE: src/components/EmojiSystem.js
// TryIT App-Wide Medal & Emoji System — NO negative language ever.
// "Wrong/Failed/Incorrect/Error" NEVER used. Always medals + encouragement.
const GOLD='#C9A84C'

export const MEDALS={
  gold:    {emoji:'🥇',label:'Gold',    minPct:90,color:'#D97706',bg:'#FFF7E6',border:'#FED7AA'},
  silver:  {emoji:'🥈',label:'Silver',  minPct:75,color:'#475569',bg:'#F8FAFC',border:'#CBD5E1'},
  bronze:  {emoji:'🥉',label:'Bronze',  minPct:60,color:'#92400E',bg:'#FEF3C7',border:'#FDE68A'},
  growing: {emoji:'📈',label:'Growing', minPct:45,color:'#0891B2',bg:'#EFF6FF',border:'#BFDBFE'},
  seedling:{emoji:'🌱',label:'Seedling',minPct:0, color:'#059669',bg:'#F0FDF4',border:'#BBF7D0'},
}

export function scoreMedal(pct){
  if(pct>=90)return MEDALS.gold
  if(pct>=75)return MEDALS.silver
  if(pct>=60)return MEDALS.bronze
  if(pct>=45)return MEDALS.growing
  return MEDALS.seedling
}

export function getMedal(score,maxScore){
  if(!maxScore)return MEDALS.seedling
  return scoreMedal((score/maxScore)*100)
}

export const ANSWER_FEEDBACK={
  correct:    {emoji:'✅',label:'Correct!',         color:'#059669',subtext:'Great job!'},
  incorrect:  {emoji:'📚',label:'Learn from this',  color:'#D97706',subtext:'Check the explanation'},
  skipped:    {emoji:'⏭️',label:'Skipped',          color:'#64748B',subtext:'You can come back'},
  unattempted:{emoji:'⬜',label:'Not attempted',    color:'#64748B',subtext:'No marks deducted'},
}

export function getAnswerFeedback(isCorrect,isSkipped=false){
  if(isSkipped)return ANSWER_FEEDBACK.skipped
  return isCorrect?ANSWER_FEEDBACK.correct:ANSWER_FEEDBACK.incorrect
}

export function streakEmoji(days){
  if(days>=365)return{emoji:'👑',label:'Legendary Streak',color:'#7C3AED'}
  if(days>=100)return{emoji:'💎',label:'Diamond Streak',  color:'#0891B2'}
  if(days>=30) return{emoji:'🔥',label:'Fire Streak',     color:'#DC2626'}
  if(days>=14) return{emoji:'⚡',label:'Power Streak',    color:'#D97706'}
  if(days>=7)  return{emoji:'✨',label:'Week Warrior',    color:'#059669'}
  if(days>=3)  return{emoji:'🌟',label:'Building Habit',  color:'#CA8A04'}
  return            {emoji:'🌱',label:'Just Starting',   color:'#059669'}
}

export const LEVEL_TITLES=[
  {level:1,title:'The Curious One',    emoji:'🌱',color:'#059669'},
  {level:2,title:'The Determined One', emoji:'💪',color:'#0891B2'},
  {level:3,title:'The Fierce One',     emoji:'🔥',color:'#DC2626'},
  {level:4,title:'The Relentless One', emoji:'⚡',color:'#D97706'},
  {level:5,title:'The Champion',       emoji:'🏆',color:GOLD},
  {level:6,title:'The Scholar',        emoji:'📚',color:'#7C3AED'},
  {level:7,title:'The Achiever',       emoji:'🎯',color:'#CA8A04'},
  {level:8,title:'The Legend',         emoji:'🌟',color:'#D97706'},
  {level:9,title:'The Guru',           emoji:'🧙',color:'#6D28D9'},
  {level:10,title:'The Elite',         emoji:'👑',color:GOLD},
]

export function levelTitle(level){return LEVEL_TITLES[Math.min(Math.max(level,1),10)-1]||LEVEL_TITLES[0]}

export function rankEmoji(rank){
  if(rank===1)return'🥇'
  if(rank===2)return'🥈'
  if(rank===3)return'🥉'
  if(rank<=10)return'🏅'
  if(rank<=50)return'⭐'
  if(rank<=100)return'🎖️'
  if(rank<=500)return'📈'
  if(rank<=1000)return'💪'
  return'🌱'
}

export const ACTIVITY_EMOJIS={
  streak_milestone: {emoji:'🔥',template:(d)=>`is on a ${d.days}-day study streak`},
  concept_unlocked: {emoji:'🧠',template:(d)=>`unlocked ${d.topic} Level ${d.level} concept`},
  topic_completed:  {emoji:'📚',template:(d)=>`completed ${d.topic} topic`},
  pathway_stage:    {emoji:'🗺️', template:(d)=>`moved to Stage ${d.stage} of ${d.pathway}`},
  test_milestone:   {emoji:'🎯',template:(d)=>`completed their ${d.count}th test`},
  rank_milestone:   {emoji:'📈',template:(d)=>`entered All India Top ${d.rank}`},
  tournament_done:  {emoji:'🏆',template:(d)=>`completed ${d.exam} tournament`},
  badge_earned:     {emoji:'🏅',template:(d)=>`earned the "${d.badge}" badge`},
}

export function formatActivityText(activity){
  const c=ACTIVITY_EMOJIS[activity.activity_type]
  return{emoji:c?.emoji||'✨',text:activity.display_text,full:`${c?.emoji||'✨'} ${activity.user_name} from ${activity.user_state||'India'} ${activity.display_text}`}
}

export const DIFFICULTY_EMOJIS={
  easy:  {emoji:'😊',label:'Easy',  color:'#059669',bg:'#F0FDF4'},
  medium:{emoji:'😐',label:'Medium',color:'#D97706',bg:'#FFF7E6'},
  hard:  {emoji:'😤',label:'Hard',  color:'#DC2626',bg:'#FEF2F2'},
}

export function difficultyFromRatings(emojiCounts){
  const total=Object.values(emojiCounts).reduce((a,b)=>a+b,0)
  if(!total)return DIFFICULTY_EMOJIS.medium
  if((emojiCounts['😤']||0)/total>0.5)return DIFFICULTY_EMOJIS.hard
  if((emojiCounts['😊']||0)/total>0.6)return DIFFICULTY_EMOJIS.easy
  return DIFFICULTY_EMOJIS.medium
}

export function encouragement(pct){
  if(pct>=90)return"Outstanding! You're exam-ready. 🌟"
  if(pct>=75)return"Excellent work! Keep this momentum. 💪"
  if(pct>=60)return"Good performance! You're growing stronger. 📈"
  if(pct>=45)return"Great effort! Every test makes you better. 🌱"
  if(pct>=30)return"You showed up — that's what counts. Keep going! 🔥"
  return"This is where champions begin. Review and rise! 💡"
}

export const PLAN_BADGES={
  free: {emoji:'🆓',label:'Free', bg:'#F1F5F9',color:'#64748B'},
  pro:  {emoji:'⭐',label:'Pro',  bg:'#DBEAFE',color:'#1D4ED8'},
  ultra:{emoji:'🏆',label:'Ultra',bg:'#FFF7E6',color:'#92400E'},
}

export function planBadge(tier){return PLAN_BADGES[tier]||PLAN_BADGES.free}

export function cutoffPrediction(userScore,cutoffScore){
  const d=userScore-cutoffScore
  if(d>=15)return{label:'🟢 HIGH CHANCE',   color:'#059669',detail:`${d.toFixed(1)} marks above cutoff`}
  if(d>=5) return{label:'🟢 GOOD CHANCE',   color:'#059669',detail:`${d.toFixed(1)} marks above cutoff`}
  if(d>=0) return{label:'🟡 BORDERLINE',    color:'#D97706',detail:`${d.toFixed(1)} marks above cutoff`}
  if(d>=-5)return{label:'🟠 CLOSE MISS',    color:'#EA580C',detail:`${Math.abs(d).toFixed(1)} below cutoff`}
  return        {label:'📚 KEEP WORKING',  color:'#DC2626',detail:'Focus on weak areas first'}
}