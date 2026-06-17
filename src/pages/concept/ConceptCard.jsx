// FILE: src/pages/concept/ConceptCard.jsx
// 7-Layer Concept Learning Screen
// Route: /concept/:topicId/:level
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'

// ── MOCK CONCEPTS (shown when Supabase isn't ready yet) ───────────────────
const MOCK_CONCEPTS = {
  'arith_percentage': {
    1: {
      concept_title: 'Percentage — Level 1: What Does % Even Mean?',
      concept_summary: '% means "per hundred" — it compares everything on a scale of 100. Once you understand this one idea, every percentage question becomes easy.',
      level_label: 'Class 1-5 Introduction',
      real_world: 'You see % everywhere in India: 18% GST on your Amazon order, 20% off on Diwali sale, 75% attendance required in college, 45% marks to pass your exam. Every single day you use percentage without even realising it.',
      real_world_examples: [
        { context: 'Shopping', example: '20% off on ₹500 kurta = save ₹100 → pay only ₹400' },
        { context: 'Banking', example: '7% interest on ₹10,000 FD = ₹700 interest in 1 year' },
        { context: 'Exams', example: '75% attendance = you must attend 75 out of every 100 classes' },
      ],
      definition: 'Percent means "per hundred." When we say 30%, we mean 30 out of every 100 parts.',
      formula: 'Percentage = (Part ÷ Whole) × 100',
      formula_breakdown: [
        { symbol: 'Part',  meaning: 'The value you want to express as a percentage', example: '18 students passed' },
        { symbol: 'Whole', meaning: 'The total amount',                               example: '60 total students' },
        { symbol: '×100',  meaning: 'Converts the fraction to per hundred',           example: '(18÷60)×100 = 30%' },
      ],
      key_terms: [
        { term: '%', meaning: 'Symbol for percent (per hundred)', example: '50% = 50 per 100 = half' },
        { term: 'Part', meaning: 'The portion you\'re looking at', example: '15 girls in a class of 60' },
        { term: 'Whole', meaning: 'The total', example: '60 students total' },
      ],
      concept_rules: [
        { rule: '100% = the whole thing', example: '100% of ₹500 = ₹500 itself' },
        { rule: '50% = exactly half', example: '50% of 80 = 40' },
        { rule: 'x% of 100 = x always', example: '37% of 100 = 37' },
      ],
      worked_examples: [
        {
          title: 'Example 1 (Easy)',
          problem: '20 students in a class of 50 are girls. What % are girls?',
          steps: [
            'Step 1: Identify Part = 20 (girls), Whole = 50 (total)',
            'Step 2: Apply formula: (Part ÷ Whole) × 100',
            'Step 3: = (20 ÷ 50) × 100 = 0.4 × 100',
            'Step 4: = 40%',
          ],
          answer: '40% are girls',
          insight: 'Always identify Part and Whole first before applying the formula.',
        },
        {
          title: 'Example 2 (Daily Life)',
          problem: 'A shopkeeper gives 25% discount on a ₹200 shirt. What is the discount amount?',
          steps: [
            'Step 1: Find 25% of ₹200',
            'Step 2: = (25 ÷ 100) × 200',
            'Step 3: = 0.25 × 200 = ₹50',
          ],
          answer: 'Discount = ₹50',
          insight: 'Finding X% of a number = (X÷100) × that number.',
        },
        {
          title: 'Example 3 (Classic)',
          problem: 'A school has 800 students. 35% play cricket. How many students play cricket?',
          steps: [
            'Step 1: Need to find 35% of 800',
            'Step 2: = (35÷100) × 800',
            'Step 3: = 0.35 × 800',
            'Step 4: = 280 students',
          ],
          answer: '280 students play cricket',
          insight: 'Break it: 10% of 800 = 80; so 35% = 3×80 + 5% of 80 = 240 + 40 = 280. Faster!',
        },
      ],
      common_mistakes: [
        {
          mistake: 'Writing the answer without ×100',
          why_wrong: 'You get a decimal like 0.4 instead of 40%',
          correct_approach: 'Always multiply by 100 at the end to get the % form',
        },
        {
          mistake: 'Confusing Part and Whole',
          why_wrong: 'You get the wrong answer entirely',
          correct_approach: 'The Whole is always the TOTAL. The Part is a piece of it.',
        },
      ],
      mnemonic: 'PHW = Part divided by (Hundred times Whole). "Phew, that was easy!"',
      mnemonic_detail: 'Remember PHW: P for Part (goes on top), H for the hundred (multiply by), W for Whole (goes below). Say "Phew" to remember — because once you know this, % questions are easy!',
      shortcuts: [
        { trick: '10% shortcut: just move decimal one place left', condition: 'When finding 10%', example: '10% of 340 = 34.0' },
        { trick: '5% = half of 10%', condition: 'When finding 5%', example: '5% of 200 = half of 20 = 10' },
        { trick: '25% = divide by 4', condition: 'When finding 25%', example: '25% of 80 = 80÷4 = 20' },
        { trick: '50% = divide by 2', condition: 'When finding 50%', example: '50% of 360 = 180' },
      ],
      visual_pattern: '  PART\n ──────  × 100  =  %\n  WHOLE',
      story: 'Ramu bhaiya runs a small kirana shop in Patna. During Diwali, he gave 20% off on all items. Priya came to buy a ₹500 face cream. Ramu bhaiya quickly calculated: 20% of 500 = (20÷100)×500 = ₹100 off. So Priya paid only ₹400. "You remembered the PHW formula!" laughed Priya. Ramu smiled — percentage had made his business honest and fast.',
      story_moral: 'Percentage is just a way to compare fairly — whether in a shop, exam, or election.',
      exam_coverage: {
        school_olympiad: ['IMO Level 1', 'NSO Level 1', 'NTSE Stage 1 MAT'],
        state_competitive: ['TNPSC Group 4', 'UP VDO', 'NTSE Stage 2'],
        ssc_banking: ['SSC CGL Tier 1', 'IBPS PO Prelims', 'SBI Clerk Prelims'],
        upsc_cat: ['UPSC CSAT', 'CAT QA', 'MAT Quant'],
      },
      question_patterns: [
        { pattern: 'Direct % calculation', example: 'Find 15% of 240', frequency: 'Very High' },
        { pattern: 'What % is X of Y', example: '18 is what % of 60?', frequency: 'Very High' },
        { pattern: '% increase/decrease', example: 'Price rose from 400 to 500. % increase?', frequency: 'High' },
        { pattern: 'Find the whole from %', example: '30% of a number is 90. Find the number.', frequency: 'High' },
      ],
      difficulty_note: 'Level 1 covers only direct % calculation. No reverse % or % change yet.',
      checkpoint_questions: [
        {
          question: '15 out of 60 students passed. What % passed?',
          options: ['A) 20%', 'B) 25%', 'C) 30%', 'D) 35%'],
          correct: 1,
          micro_explanation: '(15÷60)×100 = 25%',
        },
        {
          question: 'What is 10% of 450?',
          options: ['A) 40', 'B) 45', 'C) 50', 'D) 55'],
          correct: 1,
          micro_explanation: 'Move decimal left: 450 → 45.0 = 45',
        },
        {
          question: 'A shirt costs ₹800. A 25% discount is given. What is the discount amount?',
          options: ['A) ₹150', 'B) ₹175', 'C) ₹200', 'D) ₹225'],
          correct: 2,
          micro_explanation: '25% of 800 = 800÷4 = ₹200',
        },
      ],
      read_time_mins: 5,
    },
  },
  'arith_profit_loss': {
    1: {
      concept_title: 'Profit & Loss — Level 1: Buy Low, Sell High',
      concept_summary: 'Profit happens when you sell something for more than you bought it. Loss happens when you sell for less. These two simple ideas power all of commerce.',
      level_label: 'Class 6-7 Basics',
      real_world: 'Every kirana shop, vegetable vendor, and mobile phone seller uses profit and loss every single day. When your uncle buys mangoes for ₹50/kg and sells for ₹70/kg, that ₹20 is his profit.',
      real_world_examples: [
        { context: 'Kirana shop', example: 'Buy rice at ₹40/kg, sell at ₹50/kg → Profit ₹10/kg' },
        { context: 'Mobile phones', example: 'Buy old phone for ₹8,000, sell for ₹6,000 → Loss ₹2,000' },
        { context: 'Stocks', example: 'Buy shares at ₹100, sell at ₹130 → 30% profit' },
      ],
      definition: 'Profit = Selling Price (SP) − Cost Price (CP). If SP > CP → Profit. If SP < CP → Loss.',
      formula: 'Profit = SP − CP | Loss = CP − SP | Profit% = (Profit ÷ CP) × 100',
      formula_breakdown: [
        { symbol: 'CP', meaning: 'Cost Price — what you paid to buy', example: 'Bought for ₹500 → CP = 500' },
        { symbol: 'SP', meaning: 'Selling Price — what you got when you sold', example: 'Sold for ₹600 → SP = 600' },
        { symbol: 'Profit%', meaning: 'Profit as a percentage of CP', example: '(100÷500)×100 = 20% profit' },
      ],
      key_terms: [
        { term: 'Cost Price (CP)', meaning: 'Price at which item is purchased', example: 'Bought chair for ₹2,000' },
        { term: 'Selling Price (SP)', meaning: 'Price at which item is sold', example: 'Sold chair for ₹2,500' },
        { term: 'Profit', meaning: 'Extra money earned', example: '2500−2000 = ₹500 profit' },
        { term: 'Loss', meaning: 'Money lost in transaction', example: 'Sold for ₹1,800 → Loss = ₹200' },
      ],
      concept_rules: [
        { rule: 'SP > CP → Profit', example: 'CP=200, SP=250 → Profit=50' },
        { rule: 'SP < CP → Loss', example: 'CP=200, SP=180 → Loss=20' },
        { rule: 'Profit% is always calculated on CP, not SP', example: 'Profit 50 on CP 200 = 25%, NOT on SP 250' },
      ],
      worked_examples: [
        {
          title: 'Example 1 (Basic)',
          problem: 'Ramu bought a pen for ₹15 and sold it for ₹20. Find profit and profit%.',
          steps: ['CP = ₹15, SP = ₹20', 'Profit = SP−CP = 20−15 = ₹5', 'Profit% = (5÷15)×100 = 33.33%'],
          answer: 'Profit = ₹5, Profit% ≈ 33%',
          insight: 'Always remember profit% is on CP, not on SP.',
        },
        {
          title: 'Example 2 (Loss case)',
          problem: 'A bicycle bought for ₹3,000 was sold for ₹2,400. Find loss%.',
          steps: ['CP = 3000, SP = 2400', 'Loss = 3000−2400 = ₹600', 'Loss% = (600÷3000)×100 = 20%'],
          answer: 'Loss% = 20%',
          insight: 'Loss% = (Loss ÷ CP) × 100 — same formula, just called "loss" instead of "profit".',
        },
        {
          title: 'Example 3 (Find SP)',
          problem: 'A shopkeeper wants 15% profit on CP of ₹800. What should the SP be?',
          steps: ['SP = CP × (1 + P%/100)', 'SP = 800 × (1 + 15/100)', 'SP = 800 × 1.15 = ₹920'],
          answer: 'SP = ₹920',
          insight: 'Quick formula: SP = CP × (100+P%) / 100',
        },
      ],
      common_mistakes: [
        { mistake: 'Calculating Profit% on SP instead of CP', why_wrong: 'Gives wrong answer', correct_approach: 'ALWAYS calculate % on CP' },
        { mistake: 'Confusing profit amount with profit%', why_wrong: 'Wrong answer entirely', correct_approach: 'Profit amount = SP−CP; Profit% = amount/CP × 100' },
      ],
      mnemonic: 'SP beats CP → Profit Party! CP beats SP → Loss Laggeya!',
      mnemonic_detail: 'If Selling Price beats Cost Price → Profit Party (you celebrate). If Cost Price beats Selling Price → Loss Laggeya (you\'re sad). Easy Hindi memory!',
      shortcuts: [
        { trick: 'SP = CP × (100+P)/100 for profit', condition: 'When SP is unknown', example: 'CP=500, P%=20 → SP=500×120/100=600' },
        { trick: 'SP = CP × (100−L)/100 for loss', condition: 'When loss SP is unknown', example: 'CP=500, L%=10 → SP=500×90/100=450' },
      ],
      story: 'Priya\'s mother Savita sells vegetables at the Coimbatore market. She buys tomatoes at ₹20/kg from the farm and sells at ₹28/kg. "Amma, what is your profit?" asked Priya. "₹8 per kilo, which is 40% profit on what I paid!" said Savita. Priya quickly checked: (8÷20)×100 = 40%. Correct! The formula SP−CP gives profit, and dividing by CP gives the percentage.',
      story_moral: 'Every transaction has a cost price and selling price — knowing the difference gives you business sense for life.',
      exam_coverage: {
        school_olympiad: ['IMO', 'NTSE MAT'],
        state_competitive: ['TNPSC', 'SSC MTS', 'Bank Clerk'],
        ssc_banking: ['SSC CGL Tier 1', 'IBPS PO Prelims', 'SBI Clerk'],
        upsc_cat: ['UPSC CSAT', 'CAT QA'],
      },
      question_patterns: [
        { pattern: 'Find profit/loss amount', example: 'CP=200, SP=250. Find profit.', frequency: 'Very High' },
        { pattern: 'Find profit/loss %', example: 'CP=400, SP=480. Find profit%.', frequency: 'Very High' },
        { pattern: 'Find SP given CP and P%', example: 'CP=600, P%=25. Find SP.', frequency: 'High' },
      ],
      difficulty_note: 'Level 1: only direct calculations. No MP, discount, or successive discount yet.',
      checkpoint_questions: [
        { question: 'If CP = ₹500 and SP = ₹600, what is the profit?', options: ['A) ₹50','B) ₹100','C) ₹110','D) ₹150'], correct:1, micro_explanation:'SP−CP = 600−500 = ₹100' },
        { question: 'What is the profit% if CP=₹200 and SP=₹250?', options:['A) 20%','B) 25%','C) 30%','D) 35%'], correct:1, micro_explanation:'(50÷200)×100 = 25%' },
        { question: 'CP=₹800, Profit%=25%. Find SP.', options:['A) ₹900','B) ₹950','C) ₹1000','D) ₹1050'], correct:2, micro_explanation:'SP = 800×125/100 = ₹1000' },
      ],
      read_time_mins: 6,
    },
  },
}

// ── LAYER CONFIG ───────────────────────────────────────────────────────────
const LAYERS = [
  { key:'real_world',   icon:'🌍', label:'Real World',      color:'#0891B2' },
  { key:'definition',   icon:'📖', label:'Concept',         color:'#7C3AED' },
  { key:'worked_examples', icon:'📐', label:'Examples',     color:'#059669' },
  { key:'shortcuts',    icon:'⚡', label:'Shortcuts',       color:'#D97706' },
  { key:'story',        icon:'📖', label:'Story',           color:'#DB2777' },
  { key:'mnemonic',     icon:'🧠', label:'Memory Trick',    color:'#DC2626' },
  { key:'exam_coverage',icon:'🎯', label:'Exam Intel',      color:NAVY      },
]

export default function ConceptCard() {
  const { topicId, level }  = useParams()
  const navigate             = useNavigate()
  const { user, canAccess, isTopicUnlocked, planTier } = useAuth()

  const [concept,      setConcept]      = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [activeLayer,  setActiveLayer]  = useState(0)
  const [readLayers,   setReadLayers]   = useState(new Set([0]))
  const [readSecs,     setReadSecs]     = useState(0)
  const [showGate,     setShowGate]     = useState(false)
  const timerRef = useRef(null)
  const lvl = parseInt(level) || 1

  // ── ACCESS CHECK ─────────────────────────────────────────────────────────
  const hasAccess = planTier === 'ultra' || isTopicUnlocked(topicId)

  // ── LOAD CONCEPT ─────────────────────────────────────────────────────────
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('concepts')
          .select('*')
          .eq('topic_id', topicId)
          .eq('level', lvl)
          .single()
        if (data && !error) {
          setConcept(data)
        } else {
          // Fallback to mock
          const mock = MOCK_CONCEPTS[topicId]?.[lvl]
          setConcept(mock || null)
        }
      } catch {
        const mock = MOCK_CONCEPTS[topicId]?.[lvl]
        setConcept(mock || null)
      }
      setLoading(false)
    })()
  }, [topicId, lvl])

  // ── READING TIMER ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasAccess || !concept) return
    timerRef.current = setInterval(() => setReadSecs(s => s + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [hasAccess, concept])

  // Track layer reads
  const goToLayer = (idx) => {
    setActiveLayer(idx)
    setReadLayers(prev => new Set([...prev, idx]))
  }

  const allLayersRead = readLayers.size >= LAYERS.length

  // ── SAVE READ PROGRESS ────────────────────────────────────────────────────
  const markRead = async () => {
    const conceptId = `${topicId}_l${lvl}`
    try {
      await supabase.from('user_concept_progress').upsert({
        user_id:    user.id,
        concept_id: conceptId,
        topic_id:   topicId,
        level:      lvl,
        status:     'completed',
        read_count: 1,
        last_read_at: new Date().toISOString(),
        total_read_secs: readSecs,
      }, { onConflict:'user_id,concept_id' })
    } catch {}
    // Save locally too
    const key = `tryit_concept_read_${user?.id}_${conceptId}`
    localStorage.setItem(key, JSON.stringify({ readAt: new Date().toISOString(), secs: readSecs }))
  }

  const handleStartCheckpoint = async () => {
    await markRead()
    navigate(`/concept/${topicId}/${lvl}/checkpoint`, {
      state: { concept, topicId, level: lvl }
    })
  }

  // ── LAYER CONTENT RENDERER ────────────────────────────────────────────────
  const renderLayer = () => {
    if (!concept) return null
    const layer = LAYERS[activeLayer]

    switch (layer.key) {
      case 'real_world':
        return (
          <div>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{concept.real_world}</p>
            {concept.real_world_examples?.map((ex, i) => (
              <div key={i} style={{ background:'#F0F9FF', borderRadius:12, padding:'12px 14px', marginBottom:8, borderLeft:`3px solid #0891B2` }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#0891B2', marginBottom:3 }}>{ex.context}</p>
                <p style={{ fontSize:13, color:'#1E293B' }}>{ex.example}</p>
              </div>
            ))}
          </div>
        )

      case 'definition':
        return (
          <div>
            <div style={{ background:'#EDE9FE', borderRadius:12, padding:14, marginBottom:14 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#7C3AED', marginBottom:4 }}>DEFINITION</p>
              <p style={{ fontSize:14, color:'#1E293B', lineHeight:1.7 }}>{concept.definition}</p>
            </div>
            {concept.formula && (
              <div style={{ background:'#1E3A5F', borderRadius:12, padding:14, marginBottom:14, textAlign:'center' }}>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:4 }}>FORMULA</p>
                <p style={{ fontSize:16, fontWeight:700, color:'#C9A84C', fontFamily:'monospace' }}>{concept.formula}</p>
              </div>
            )}
            {concept.formula_breakdown?.map((fb, i) => (
              <div key={i} style={{ display:'flex', gap:12, padding:'8px 0', borderBottom:'1px solid #F1F5F9' }}>
                <span style={{ minWidth:70, fontSize:12, fontWeight:700, color:'#7C3AED' }}>{fb.symbol}</span>
                <div>
                  <p style={{ fontSize:12, color:'#475569' }}>{fb.meaning}</p>
                  <p style={{ fontSize:11, color:'#94A3B8' }}>{fb.example}</p>
                </div>
              </div>
            ))}
          </div>
        )

      case 'worked_examples':
        return (
          <div>
            {concept.worked_examples?.map((ex, i) => (
              <div key={i} style={{ marginBottom:16 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#059669', marginBottom:6 }}>{ex.title}</p>
                <div style={{ background:'#F8FAFC', border:'1.5px solid #E2E8F0', borderRadius:12, padding:14 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:'#1E293B', marginBottom:10 }}>Q: {ex.problem}</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:10 }}>
                    {ex.steps.map((step, j) => (
                      <div key={j} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                        <span style={{ width:20, height:20, borderRadius:'50%', background:'#059669', color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{j+1}</span>
                        <p style={{ fontSize:13, color:'#374151' }}>{step}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize:13, fontWeight:700, color:'#059669' }}>✅ Answer: {ex.answer}</p>
                  {ex.insight && (
                    <p style={{ fontSize:11, color:'#6B7280', marginTop:6, fontStyle:'italic', borderTop:'1px solid #E5E7EB', paddingTop:6 }}>
                      💡 {ex.insight}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {concept.common_mistakes?.length > 0 && (
              <div style={{ background:'#FEF2F2', border:'1.5px solid #FECACA', borderRadius:12, padding:12 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#DC2626', marginBottom:8 }}>⚠️ COMMON MISTAKES</p>
                {concept.common_mistakes.map((cm, i) => (
                  <div key={i} style={{ marginBottom:8 }}>
                    <p style={{ fontSize:12, color:'#DC2626' }}>✗ {cm.mistake}</p>
                    <p style={{ fontSize:12, color:'#059669' }}>✓ {cm.correct_approach}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'shortcuts':
        return (
          <div>
            <div style={{ background:'#FFFBEB', border:'1.5px solid #FDE68A', borderRadius:12, padding:14, marginBottom:14 }}>
              <p style={{ fontSize:14, fontWeight:700, color:'#92400E', marginBottom:4 }}>🧠 Memory Trick</p>
              <p style={{ fontSize:14, color:'#78350F', lineHeight:1.7 }}>{concept.mnemonic}</p>
            </div>
            {concept.shortcuts?.map((s, i) => (
              <div key={i} style={{ background:'#F8FAFC', borderRadius:12, padding:12, marginBottom:8, borderLeft:'3px solid #D97706' }}>
                <p style={{ fontSize:13, fontWeight:700, color:'#92400E', marginBottom:4 }}>⚡ {s.trick}</p>
                <p style={{ fontSize:11, color:'#94A3B8', marginBottom:4 }}>When: {s.condition}</p>
                <p style={{ fontSize:12, color:'#059669', fontFamily:'monospace' }}>e.g. {s.example}</p>
              </div>
            ))}
            {concept.visual_pattern && (
              <div style={{ background:'#1E3A5F', borderRadius:12, padding:14, textAlign:'center' }}>
                <pre style={{ color:'#C9A84C', fontFamily:'monospace', fontSize:14, margin:0 }}>
                  {concept.visual_pattern}
                </pre>
              </div>
            )}
          </div>
        )

      case 'story':
        return (
          <div>
            <div style={{ background:'linear-gradient(135deg,#FDF2F8,#FCE7F3)', border:'1.5px solid #F9A8D4', borderRadius:16, padding:16, marginBottom:12 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#BE185D', marginBottom:8 }}>📖 STORY TO REMEMBER</p>
              <p style={{ fontSize:14, color:'#1E293B', lineHeight:1.9 }}>{concept.story}</p>
            </div>
            {concept.story_moral && (
              <div style={{ background:'#F0FDF4', border:'1.5px solid #BBF7D0', borderRadius:12, padding:12 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#059669', marginBottom:4 }}>💚 MORAL</p>
                <p style={{ fontSize:13, color:'#065F46' }}>{concept.story_moral}</p>
              </div>
            )}
          </div>
        )

      case 'mnemonic':
        return (
          <div>
            <div style={{ background:'linear-gradient(135deg,#FEF3C7,#FDE68A)', borderRadius:16, padding:20, marginBottom:14, textAlign:'center' }}>
              <p style={{ fontSize:28, marginBottom:8 }}>🧠</p>
              <p style={{ fontSize:18, fontWeight:800, color:'#92400E', lineHeight:1.5 }}>{concept.mnemonic}</p>
            </div>
            <div style={{ background:'#FFFBEB', borderRadius:12, padding:14 }}>
              <p style={{ fontSize:13, color:'#78350F', lineHeight:1.7 }}>{concept.mnemonic_detail}</p>
            </div>
          </div>
        )

      case 'exam_coverage':
        return (
          <div>
            <p style={{ fontSize:13, color:'#475569', marginBottom:14 }}>This concept appears across these exams:</p>
            {Object.entries(concept.exam_coverage || {}).map(([cat, exams]) => (
              <div key={cat} style={{ marginBottom:12 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>
                  {cat.replace(/_/g,' ')}
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {(Array.isArray(exams) ? exams : []).map(e => (
                    <span key={e} style={{ background:'#EFF6FF', color:'#1D4ED8', padding:'4px 10px', borderRadius:99, fontSize:11, fontWeight:600 }}>
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {concept.question_patterns?.length > 0 && (
              <div style={{ marginTop:16 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>
                  QUESTION PATTERNS
                </p>
                {concept.question_patterns.map((p, i) => (
                  <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:'1px solid #F1F5F9', alignItems:'flex-start' }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99,
                      background: p.frequency==='Very High'?'#FEE2E2':p.frequency==='High'?'#FEF3C7':'#F1F5F9',
                      color: p.frequency==='Very High'?'#991B1B':p.frequency==='High'?'#92400E':'#64748B',
                      flexShrink:0, marginTop:2 }}>
                      {p.frequency}
                    </span>
                    <div>
                      <p style={{ fontSize:12, fontWeight:600, color:'#1E293B' }}>{p.pattern}</p>
                      <p style={{ fontSize:11, color:'#94A3B8' }}>e.g. {p.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      default: return null
    }
  }

  // ── GATED VIEW ────────────────────────────────────────────────────────────
  if (!loading && !hasAccess) {
    return (
      <div style={{ minHeight:'100vh', background:BG, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div style={{ background:'#fff', borderRadius:24, padding:28, maxWidth:360, textAlign:'center', border:'1.5px solid #E2E8F0' }}>
          <p style={{ fontSize:40, marginBottom:8 }}>🔒</p>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:18, marginBottom:8 }}>
            Concept Learning
          </h2>
          <p style={{ fontSize:13, color:'#475569', marginBottom:20, lineHeight:1.7 }}>
            Learn any topic from Level 1 to Level 10 with 7-layer explanations, Indian stories, mnemonics and more.
          </p>
          <div style={{ background:'#FFF7E6', borderRadius:14, padding:14, marginBottom:16, border:'1px solid #FDE68A' }}>
            <p style={{ fontSize:13, fontWeight:700, color:'#92400E', marginBottom:4 }}>₹25 — This Topic Only</p>
            <p style={{ fontSize:11, color:'#78350F' }}>All 10 levels for this topic · Lifetime access</p>
            <button onClick={() => navigate('/pro')}
              style={{ marginTop:10, padding:'10px 20px', background:GOLD, color:NAVY, border:'none', borderRadius:10, fontWeight:800, fontSize:13, cursor:'pointer', width:'100%' }}>
              Unlock This Topic ₹25 →
            </button>
          </div>
          <button onClick={() => navigate('/pro')}
            style={{ width:'100%', padding:'12px', background:NAVY, color:'#fff', border:'none', borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer', marginBottom:10 }}>
            Upgrade to Ultra — All Topics
          </button>
          <button onClick={() => navigate(-1)} style={{ fontSize:12, color:'#94A3B8', background:'none', border:'none', cursor:'pointer' }}>
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:BG }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48, height:48, border:`3px solid ${GOLD}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
        <p style={{ color:'#94A3B8', fontSize:13 }}>Loading concept…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  if (!concept) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:BG, flexDirection:'column', gap:12 }}>
      <p style={{ fontSize:40 }}>📚</p>
      <p style={{ color:'#475569', fontSize:14 }}>Concept not found for this topic + level.</p>
      <button onClick={() => navigate(-1)} style={{ padding:'10px 20px', background:NAVY, color:'#fff', border:'none', borderRadius:10, cursor:'pointer' }}>
        ← Go Back
      </button>
    </div>
  )

  const currentLayer = LAYERS[activeLayer]
  const progress     = (readLayers.size / LAYERS.length) * 100

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:80 }}>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{ background:NAVY, color:'#fff', padding:'14px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.7)', fontSize:20, cursor:'pointer' }}>←</button>
          <div style={{ textAlign:'center' }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:2 }}>
              Level {lvl} · {concept.level_label}
            </p>
            <p style={{ fontWeight:700, fontSize:14 }}>{concept.concept_title}</p>
          </div>
          <span style={{ background:'rgba(201,168,76,0.2)', color:GOLD, padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700 }}>
            L{lvl}
          </span>
        </div>
        {/* Reading progress bar */}
        <div style={{ height:4, background:'rgba(255,255,255,0.15)', borderRadius:99, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:GOLD, borderRadius:99, transition:'width 0.4s ease' }} />
        </div>
        <p style={{ fontSize:10, color:'rgba(255,255,255,0.5)', marginTop:4, textAlign:'right' }}>
          {readLayers.size}/{LAYERS.length} layers read
        </p>
      </div>

      {/* ── SUMMARY CARD ───────────────────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,#FFF7E6,#FFFBF0)', padding:'14px 16px', borderBottom:'1px solid #FDE68A' }}>
        <p style={{ fontSize:13, color:'#78350F', lineHeight:1.7 }}>{concept.concept_summary}</p>
        <p style={{ fontSize:11, color:'#B45309', marginTop:4 }}>⏱️ ~{concept.read_time_mins || 5} min read</p>
      </div>

      {/* ── LAYER TABS ──────────────────────────────────────────────────── */}
      <div style={{ display:'flex', overflowX:'auto', borderBottom:'1px solid #E2E8F0', background:'#fff', scrollbarWidth:'none' }}>
        {LAYERS.map((layer, idx) => {
          const isRead   = readLayers.has(idx)
          const isActive = activeLayer === idx
          return (
            <button key={layer.key} onClick={() => goToLayer(idx)}
              style={{ flexShrink:0, padding:'10px 14px', border:'none', borderBottom:`2.5px solid ${isActive ? layer.color : 'transparent'}`,
                background: isActive ? `${layer.color}08` : 'transparent',
                cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3, minWidth:64 }}>
              <span style={{ fontSize:16, filter: isRead||isActive?'none':'grayscale(1)', opacity:isRead||isActive?1:0.4 }}>
                {layer.icon}
              </span>
              <span style={{ fontSize:9, fontWeight:700, color:isActive?layer.color:'#94A3B8', lineHeight:1.2, textAlign:'center' }}>
                {layer.label}
              </span>
              {isRead && <span style={{ width:4, height:4, borderRadius:'50%', background:layer.color }} />}
            </button>
          )
        })}
      </div>

      {/* ── ACTIVE LAYER CONTENT ────────────────────────────────────────── */}
      <div style={{ padding:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
          <span style={{ fontSize:22 }}>{currentLayer.icon}</span>
          <div>
            <p style={{ fontSize:14, fontWeight:700, color:currentLayer.color }}>{currentLayer.label}</p>
            <p style={{ fontSize:11, color:'#94A3B8' }}>Layer {activeLayer+1} of {LAYERS.length}</p>
          </div>
        </div>

        <div style={{ background:'#fff', borderRadius:16, padding:16, border:'1.5px solid #E2E8F0', marginBottom:14 }}>
          {renderLayer()}
        </div>

        {/* Layer prev/next */}
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <button
            onClick={() => goToLayer(Math.max(0, activeLayer-1))}
            disabled={activeLayer === 0}
            style={{ padding:'10px 18px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:13, color:'#64748B', background:'#fff', cursor:activeLayer===0?'not-allowed':'pointer', opacity:activeLayer===0?0.4:1 }}>
            ← Prev Layer
          </button>
          {activeLayer < LAYERS.length - 1 ? (
            <button
              onClick={() => goToLayer(activeLayer+1)}
              style={{ padding:'10px 18px', background:currentLayer.color, color:'#fff', border:'none', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer' }}>
              Next Layer →
            </button>
          ) : (
            <button
              onClick={handleStartCheckpoint}
              style={{ padding:'10px 22px', background:`linear-gradient(135deg,${GOLD},#E8C96A)`, color:NAVY, border:'none', borderRadius:10, fontSize:13, fontWeight:800, cursor:'pointer' }}>
              Start Checkpoint ✅
            </button>
          )}
        </div>

        {/* Quick checkpoint button (always visible after reading 4+ layers) */}
        {readLayers.size >= 4 && activeLayer < LAYERS.length - 1 && (
          <button
            onClick={handleStartCheckpoint}
            style={{ width:'100%', padding:'13px', background:`linear-gradient(135deg,${GOLD},#E8C96A)`, color:NAVY, border:'none', borderRadius:14, fontWeight:800, fontSize:14, cursor:'pointer' }}>
            ✅ I'm Ready — Start Checkpoint
          </button>
        )}
      </div>
    </div>
  )
}