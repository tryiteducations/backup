// FILE: src/pages/roadmap/PrepPathway.jsx
// Long-Term Preparation Pathway Screen
// Route: /pathway/:pathwayId
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import PathwayEnrollModal from '../../components/PathwayEnrollModal'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'

// -- ALL 24 PATHWAYS (mock data - DB has full data after 11_prep_pathways_schema.sql) --
const ALL_PATHWAYS = {
  jee_7yr: {
    pathway_id: 'jee_7yr', icon_emoji:'🏆', color_primary:'#1E3A5F',
    pathway_name: 'JEE 7-Year Master Journey',
    tagline: 'From Class 6 to IIT - your complete roadmap',
    entry_point: 'Class 6', exit_point: 'Class 12',
    total_stages: 7, total_months: 84, ideal_start_age: 11,
    difficulty: 'hard', category: 'school_to_jee',
    target_exam_ids: ['JEE Main', 'JEE Advanced'],
    stages: [
      { stage_number:1, stage_name:'Class 6 - Foundation', class_or_phase:'class_6', duration_weeks:52,
        stage_icon:'🌱', difficulty_range:'L1', coins_reward:300, badge_name:'Foundation Builder',
        focus_summary:'Build number sense, logical thinking, basic science curiosity. No pressure - just love for learning.',
        milestone_test:'300 questions + Olympiad Mock',
        topics:['Basic Arithmetic','Simple Geometry','Science Curiosity','Reading Habits'] },
      { stage_number:2, stage_name:'Class 7 - Growing Roots', class_or_phase:'class_7', duration_weeks:52,
        stage_icon:'🌿', difficulty_range:'L1-L2', coins_reward:350, badge_name:'Root Grower',
        focus_summary:'Fractions, decimals, algebra basics, motion & forces, simple chemistry. IMO/NSO Level 1.',
        milestone_test:'500 questions + IMO Level 1 mock',
        topics:['Fractions & Decimals','Basic Algebra','Forces & Motion','Chemical Changes'] },
      { stage_number:3, stage_name:'Class 8 - Pre-Foundation', class_or_phase:'class_8', duration_weeks:52,
        stage_icon:'🌳', difficulty_range:'L1-L2', coins_reward:400, badge_name:'Pre-Foundation Star',
        focus_summary:'Algebraic expressions, quadrilaterals, light & sound, atoms & molecules. NTSE foundation.',
        milestone_test:'700 questions + NTSE mock',
        topics:['Algebraic Expressions','Quadrilaterals','Light & Sound','Atoms & Molecules'] },
      { stage_number:4, stage_name:'Class 9 - JEE Foundation', class_or_phase:'class_9', duration_weeks:52,
        stage_icon:'🚀', difficulty_range:'L2', coins_reward:500, badge_name:'JEE Foundation',
        focus_summary:'Coordinate geometry, quadratics, laws of motion, chemical reactions. NTSE Stage 1 target.',
        milestone_test:'1000 questions + NTSE Stage 1 mock',
        topics:['Coordinate Geometry','Quadratic Equations','Laws of Motion','Chemical Reactions'] },
      { stage_number:5, stage_name:'Class 10 - Core Building', class_or_phase:'class_10', duration_weeks:52,
        stage_icon:'⚡', difficulty_range:'L2-L3', coins_reward:600, badge_name:'Core Builder',
        focus_summary:'Trigonometry, circles, electricity, carbon compounds. Board + NTSE Stage 2.',
        milestone_test:'1500 questions + Board Mock + NTSE Stage 2',
        topics:['Trigonometry','Circles & Geometry','Electricity','Carbon Compounds'] },
      { stage_number:6, stage_name:'Class 11 - JEE Main Syllabus', class_or_phase:'class_11', duration_weeks:52,
        stage_icon:'🔥', difficulty_range:'L3-L4', coins_reward:800, badge_name:'JEE Warrior',
        focus_summary:'Full PCM: Mechanics, Electrostatics, Organic, Sets to Calculus. 15+ JEE mock tests.',
        milestone_test:'3000 questions + 15 JEE Main mocks',
        topics:['Physics Mechanics','Electrostatics','Organic Chemistry','Differential Calculus'] },
      { stage_number:7, stage_name:'Class 12 - JEE Advanced Conquest', class_or_phase:'class_12', duration_weeks:52,
        stage_icon:'👑', difficulty_range:'L4-L5', coins_reward:1000, badge_name:'IIT Conqueror',
        focus_summary:'Complete Boards + JEE Main + JEE Advanced. Multi-concept problems. 25 full mocks.',
        milestone_test:'5000 questions + 25 JEE mocks + 10 Advanced mocks',
        topics:['JEE Advanced Physics','JEE Advanced Chemistry','JEE Advanced Maths','PYQ Analysis'] },
    ],
  },
  neet_7yr: {
    pathway_id: 'neet_7yr', icon_emoji:'🩺', color_primary:'#DC2626',
    pathway_name: 'NEET 7-Year Medical Journey',
    tagline: 'From Class 6 to MBBS - complete medical career roadmap',
    entry_point: 'Class 6', exit_point: 'Class 12',
    total_stages: 7, total_months: 84, ideal_start_age: 11,
    difficulty: 'hard', category: 'school_to_neet',
    target_exam_ids: ['NEET UG'],
    stages: [
      { stage_number:1, stage_name:'Class 6 - Life Sciences Foundation', class_or_phase:'class_6', duration_weeks:52,
        stage_icon:'🌱', difficulty_range:'L1', coins_reward:300, badge_name:'Bio Curious',
        focus_summary:'Cell basics, plants & animals, nutrition, body systems intro. Science curiosity building.',
        milestone_test:'300 questions + NSO Level 1 mock',
        topics:['Cell Structure Basics','Plants & Animals','Nutrition','Human Body Intro'] },
      { stage_number:2, stage_name:'Class 7 - Body Systems & Chemistry', class_or_phase:'class_7', duration_weeks:52,
        stage_icon:'🌿', difficulty_range:'L1-L2', coins_reward:350, badge_name:'Body Explorer',
        focus_summary:'Transportation in plants/animals, motion & time, acids & bases.',
        milestone_test:'500 questions + NSO mock',
        topics:['Transportation in Living Things','Motion & Time','Acids & Bases','Body Systems'] },
      { stage_number:3, stage_name:'Class 8 - Pre-NEET Foundation', class_or_phase:'class_8', duration_weeks:52,
        stage_icon:'🔬', difficulty_range:'L1-L2', coins_reward:400, badge_name:'Cell Scientist',
        focus_summary:'Cell structure & function, microorganisms, combustion. NTSE bio+chem foundation.',
        milestone_test:'700 questions + NTSE bio mock',
        topics:['Cell Structure & Function','Microorganisms','Combustion','Reproduction Basics'] },
      { stage_number:4, stage_name:'Class 9 - NEET Foundation', class_or_phase:'class_9', duration_weeks:52,
        stage_icon:'🧬', difficulty_range:'L2', coins_reward:500, badge_name:'NEET Foundation',
        focus_summary:'Tissues, diversity in living organisms, atoms & molecules. NTSE Stage 1.',
        milestone_test:'1000 questions + NTSE S1',
        topics:['Tissues','Diversity in Living Organisms','Atoms & Molecules','Laws of Motion'] },
      { stage_number:5, stage_name:'Class 10 - Complete Life Processes', class_or_phase:'class_10', duration_weeks:52,
        stage_icon:'💉', difficulty_range:'L2-L3', coins_reward:600, badge_name:'Life Processor',
        focus_summary:'Life processes, control & coordination, heredity, carbon compounds. Boards + NTSE S2.',
        milestone_test:'1500 questions + Board + NTSE S2',
        topics:['Life Processes','Control & Coordination','Heredity & Evolution','Carbon Compounds'] },
      { stage_number:6, stage_name:'Class 11 - NEET Syllabus Part 1', class_or_phase:'class_11', duration_weeks:52,
        stage_icon:'🏥', difficulty_range:'L3-L4', coins_reward:800, badge_name:'NEET Warrior',
        focus_summary:'Full Bio (Botany+Zoology Class 11) + Physics Mechanics + Organic Chem. 10 NEET mocks.',
        milestone_test:'3000 questions + 10 NEET mocks',
        topics:['Diversity of Life','Structural Organisation','Cell Biology','Biomolecules'] },
      { stage_number:7, stage_name:'Class 12 - NEET Final Conquest', class_or_phase:'class_12', duration_weeks:52,
        stage_icon:'👨‍⚕️', difficulty_range:'L4-L5', coins_reward:1000, badge_name:'Doctor in Making',
        focus_summary:'Complete Class 12 + full integration. Genetics, Evolution, Ecology. 25 NEET mocks.',
        milestone_test:'5000 questions + 25 NEET mocks + PYQ 15yr',
        topics:['Reproduction','Genetics & Evolution','Biology in Human Welfare','Ecology & Environment'] },
    ],
  },
  upsc_8yr: {
    pathway_id: 'upsc_8yr', icon_emoji:'🇮🇳', color_primary:'#1E3A5F',
    pathway_name: 'UPSC Civil Services 8-Year Journey',
    tagline: "From Class 8 to IAS/IPS/IFS - India's ultimate career roadmap",
    entry_point: 'Class 8', exit_point: 'Post Graduation',
    total_stages: 8, total_months: 96, ideal_start_age: 13,
    difficulty: 'very_hard', category: 'school_to_upsc',
    target_exam_ids: ['UPSC CSE Prelims', 'UPSC CSE Mains'],
    stages: [
      { stage_number:1, stage_name:'Class 8-10 - GK Foundation', class_or_phase:'class_8', duration_weeks:104,
        stage_icon:'📰', difficulty_range:'L1', coins_reward:300, badge_name:'GK Foundation',
        focus_summary:'Build general awareness: current affairs reading habit, basic polity, geography maps, history timelines.',
        milestone_test:'500 GK + CA questions + NTSE mock',
        topics:['Indian History Timeline','World Geography Maps','Basic Polity','Current Affairs Habit'] },
      { stage_number:2, stage_name:'Class 11-12 - Pre-Foundation', class_or_phase:'class_11', duration_weeks:104,
        stage_icon:'📚', difficulty_range:'L2', coins_reward:400, badge_name:'NCERT Master',
        focus_summary:'NCERT mastery (History/Geography/Polity/Economics). Board + competitive awareness.',
        milestone_test:'2000 NCERT-based questions',
        topics:['NCERT History','NCERT Geography','NCERT Polity','NCERT Economics'] },
      { stage_number:3, stage_name:'Graduation Year 1 - GS Fundamentals', class_or_phase:'graduation_1', duration_weeks:52,
        stage_icon:'🌍', difficulty_range:'L3', coins_reward:500, badge_name:'GS Builder',
        focus_summary:'Modern History deep dive, Constitutional Law, Basic Economics, World Geography. 100 CA tests.',
        milestone_test:'3000 GS questions + 5 CSAT mocks',
        topics:['Modern Indian History','Constitution & Polity','Indian Economy','Environment & Ecology'] },
      { stage_number:4, stage_name:'Graduation Year 2 - Optional + GS Depth', class_or_phase:'graduation_2', duration_weeks:52,
        stage_icon:'📝', difficulty_range:'L3-L4', coins_reward:600, badge_name:'Answer Writer',
        focus_summary:'Optional subject start + GS Paper 2 (Polity/IR/Governance) + Paper 3. Answer writing.',
        milestone_test:'3000 questions + answer writing practice',
        topics:['Governance & IR','Science & Technology','Disaster Management','Optional Paper 1'] },
      { stage_number:5, stage_name:'Graduation Year 3 - Full Integration', class_or_phase:'graduation_3', duration_weeks:52,
        stage_icon:'🎯', difficulty_range:'L4', coins_reward:700, badge_name:'Integrator',
        focus_summary:'Complete all 4 GS papers + Optional Paper 1+2 + Essay. Daily CA notes.',
        milestone_test:'4000 questions + 10 Prelims mocks',
        topics:['GS Paper 1 Complete','GS Paper 2 Complete','GS Paper 3 Complete','GS Paper 4 Ethics'] },
      { stage_number:6, stage_name:'Prelims Focused Sprint', class_or_phase:'prelims_prep', duration_weeks:12,
        stage_icon:'🏃', difficulty_range:'L4', coins_reward:800, badge_name:'Prelims Ready',
        focus_summary:'30+ full Prelims mocks. PYQ analysis 10 years. CSAT practice. Current Affairs revision.',
        milestone_test:'30 full Prelims mocks + CA capsules',
        topics:['Prelims Mock Series','Current Affairs Revision','CSAT Practice','PYQ Analysis'] },
      { stage_number:7, stage_name:'Mains + Essay Focus', class_or_phase:'mains_prep', duration_weeks:16,
        stage_icon:'✍️', difficulty_range:'L4-L5', coins_reward:900, badge_name:'Mains Warrior',
        focus_summary:'GS Mains answer writing: 10 mocks each paper. Essay writing: 20 essays.',
        milestone_test:'500 answer writing + 8 mains mocks',
        topics:['Answer Writing Practice','Essay Writing','Optional Mains Revision','GS Mains Strategy'] },
      { stage_number:8, stage_name:'Interview Preparation', class_or_phase:'interview_prep', duration_weeks:8,
        stage_icon:'🎤', difficulty_range:'L5', coins_reward:1000, badge_name:'IAS Ready',
        focus_summary:'DAF analysis, mock interviews, current events, personality development.',
        milestone_test:'50 mock Q&As + 5 mock interviews',
        topics:['DAF Analysis','Current Affairs for Interview','Mock Interviews','Personality Development'] },
    ],
  },
  banking_2yr: {
    pathway_id: 'banking_2yr', icon_emoji:'🏦', color_primary:'#1D4ED8',
    pathway_name: 'Banking 2-Year Journey',
    tagline: 'From Graduation to Bank PO - systematic and fast',
    entry_point: 'Graduation', exit_point: 'Post-Graduation',
    total_stages: 4, total_months: 24, ideal_start_age: 21,
    difficulty: 'medium', category: 'graduation_to_banking',
    target_exam_ids: ['IBPS PO', 'SBI PO'],
    stages: [
      { stage_number:1, stage_name:'Foundation - All 3 Subjects', class_or_phase:'graduation_1', duration_weeks:12,
        stage_icon:'📐', difficulty_range:'L2-L3', coins_reward:400, badge_name:'Bank Foundation',
        focus_summary:'Arithmetic (all chapters), Seating/Puzzles, RC + Error Detection. 10 questions per topic daily.',
        milestone_test:'2000 questions across subjects',
        topics:['Arithmetic Basics','Seating Arrangement','Reading Comprehension','Error Detection'] },
      { stage_number:2, stage_name:'Prelims Ready - Speed + Accuracy', class_or_phase:'graduation_1', duration_weeks:8,
        stage_icon:'⚡', difficulty_range:'L3', coins_reward:500, badge_name:'Prelims Ready',
        focus_summary:'Speed drills. 20 Prelims mocks. Sectional cutoff mastery.',
        milestone_test:'1500 questions + 20 Prelims mocks',
        topics:['Speed Drills','Sectional Practice','Cutoff Strategy','Mock Analysis'] },
      { stage_number:3, stage_name:'Mains - DI + Banking Awareness', class_or_phase:'graduation_2', duration_weeks:8,
        stage_icon:'📊', difficulty_range:'L3-L4', coins_reward:600, badge_name:'Mains Star',
        focus_summary:'Advanced DI (table/graph/caselet), Data Sufficiency, Banking Awareness. 15 mains mocks.',
        milestone_test:'1500 DI/CA questions + 15 mains mocks',
        topics:['Data Interpretation','Data Sufficiency','Banking Awareness','Current Affairs'] },
      { stage_number:4, stage_name:'Interview + GD Preparation', class_or_phase:'interview_prep', duration_weeks:4,
        stage_icon:'🎤', difficulty_range:'L4', coins_reward:700, badge_name:'Bank Officer',
        focus_summary:'Banking current affairs, RBI policy, Why Banking, mock interviews.',
        milestone_test:'Banking CA 500 MCQs + 5 mock interviews',
        topics:['Banking Current Affairs','RBI Monetary Policy','Why Banking Answers','Mock Interviews'] },
    ],
  },
  ssc_2yr: {
    pathway_id: 'ssc_2yr', icon_emoji:'📋', color_primary:'#059669',
    pathway_name: 'SSC CGL 2-Year Journey',
    tagline: 'Crack SSC CGL Tier 1+2+3 - systematic approach',
    entry_point: 'Graduation', exit_point: 'Graduation',
    total_stages: 4, total_months: 24, ideal_start_age: 21,
    difficulty: 'medium', category: 'graduation_to_civil',
    target_exam_ids: ['SSC CGL Tier 1', 'SSC CGL Tier 2'],
    stages: [
      { stage_number:1, stage_name:'Foundation - All 4 Subjects', class_or_phase:'graduation_1', duration_weeks:12,
        stage_icon:'📚', difficulty_range:'L2-L3', coins_reward:400, badge_name:'SSC Foundation',
        focus_summary:'Quantitative Aptitude (all chapters), Reasoning (full), English (grammar+vocab), GK (all static topics).',
        milestone_test:'3000 questions (750 per subject)',
        topics:['Quantitative Aptitude','Logical Reasoning','English Grammar','Static GK'] },
      { stage_number:2, stage_name:'Tier 1 Mock Phase', class_or_phase:'graduation_1', duration_weeks:8,
        stage_icon:'⏱️', difficulty_range:'L3', coins_reward:500, badge_name:'Tier 1 Ready',
        focus_summary:'60-minute Tier 1 pattern. 25 full Tier 1 mocks. Section-wise time analysis.',
        milestone_test:'25 full Tier 1 mocks',
        topics:['Tier 1 Mock Practice','Time Management','Sectional Strategy','Weak Area Focus'] },
      { stage_number:3, stage_name:'Tier 2 - Advanced Maths + English', class_or_phase:'graduation_2', duration_weeks:12,
        stage_icon:'🔢', difficulty_range:'L3-L4', coins_reward:600, badge_name:'Tier 2 Star',
        focus_summary:'Advance Maths (geometry/trig/DI), English (RC+Cloze+Para), 15 Tier 2 mocks.',
        milestone_test:'2000 Maths + 1000 English + 15 Tier 2 mocks',
        topics:['Advanced Mathematics','Advanced English','Data Interpretation','Tier 2 Mocks'] },
      { stage_number:4, stage_name:'Tier 3 - Descriptive Writing', class_or_phase:'graduation_2', duration_weeks:4,
        stage_icon:'✍️', difficulty_range:'L3', coins_reward:700, badge_name:'SSC Complete',
        focus_summary:'Essay (250 words), Letter/Application (150 words). 10 writing exercises.',
        milestone_test:'10 essays + 10 letters graded',
        topics:['Essay Writing','Letter Writing','Formal Writing','Language Accuracy'] },
    ],
  },
  ca_6yr: {
    pathway_id: 'ca_6yr', icon_emoji:'💰', color_primary:'#92400E',
    pathway_name: 'CA 6-Year Professional Journey',
    tagline: 'Class 10 to Chartered Accountant - India\'s prestige professional',
    entry_point: 'Class 10', exit_point: 'Graduation',
    total_stages: 6, total_months: 72, ideal_start_age: 15,
    difficulty: 'very_hard', category: 'class10_to_professional',
    target_exam_ids: ['CA Foundation', 'CA Intermediate', 'CA Final'],
    stages: [
      { stage_number:1, stage_name:'Class 10-12 - Commerce Foundation', class_or_phase:'class_10', duration_weeks:104,
        stage_icon:'📊', difficulty_range:'L1-L2', coins_reward:300, badge_name:'Commerce Foundation',
        focus_summary:'Accountancy, Business Studies, Economics (Class 11-12). Clear concepts before CA Foundation.',
        milestone_test:'1500 Commerce questions',
        topics:['Accountancy','Business Studies','Economics','Maths for Commerce'] },
      { stage_number:2, stage_name:'CA Foundation Preparation', class_or_phase:'foundation_prep', duration_weeks:16,
        stage_icon:'📚', difficulty_range:'L2-L3', coins_reward:400, badge_name:'CA Foundation',
        focus_summary:'Principles of Accounting, Maths/Statistics, Mercantile Law, Economics.',
        milestone_test:'2000 Foundation questions + 10 mocks',
        topics:['Principles of Accounting','Business Mathematics','Mercantile Law','Business Economics'] },
      { stage_number:3, stage_name:'CA Intermediate Group 1', class_or_phase:'inter_g1_prep', duration_weeks:24,
        stage_icon:'⚖️', difficulty_range:'L3', coins_reward:500, badge_name:'Inter G1',
        focus_summary:'Accounting, Corporate/Other Laws, Cost & Management Acc, Taxation (Income Tax + GST).',
        milestone_test:'3000 Inter G1 questions + 15 mocks',
        topics:['Advanced Accounting','Corporate Laws','Cost Accounting','Direct & Indirect Tax'] },
      { stage_number:4, stage_name:'CA Intermediate Group 2', class_or_phase:'inter_g2_prep', duration_weeks:24,
        stage_icon:'📈', difficulty_range:'L3-L4', coins_reward:600, badge_name:'Inter G2',
        focus_summary:'Advanced Accounting, Auditing, Enterprise IT, Strategic Mgmt, Financial Management.',
        milestone_test:'3000 Inter G2 questions + 15 mocks',
        topics:['Advanced Financial Accounting','Auditing & Assurance','Enterprise IT','Financial Management'] },
      { stage_number:5, stage_name:'CA Final Group 1', class_or_phase:'final_g1_prep', duration_weeks:24,
        stage_icon:'🏦', difficulty_range:'L4', coins_reward:800, badge_name:'Final G1',
        focus_summary:'FR (Advanced), SFM, Advanced Auditing, Corporate & Allied Laws.',
        milestone_test:'3000 Final G1 questions + 15 mocks',
        topics:['Financial Reporting','Strategic Financial Management','Advanced Auditing','Corporate Laws'] },
      { stage_number:6, stage_name:'CA Final Group 2 + Articleship', class_or_phase:'final_g2_prep', duration_weeks:24,
        stage_icon:'🏆', difficulty_range:'L4-L5', coins_reward:1000, badge_name:'CA Final',
        focus_summary:'SCMPE, DT (Advanced), IDT (Advanced). Integrate Articleship learnings. 20 Final mocks.',
        milestone_test:'3000 Final G2 + 20 mocks',
        topics:['Cost Management','Advanced Direct Tax','Advanced Indirect Tax','Articleship Integration'] },
    ],
  },
}

// Generic pathway fallback
const DEFAULT_PATHWAY = {
  pathway_id: 'generic', icon_emoji:'🎯', color_primary:NAVY,
  pathway_name: 'Exam Preparation Journey',
  tagline: 'Step-by-step pathway to your goal',
  entry_point: 'Now', exit_point: 'Exam Day',
  total_stages: 4, total_months: 12, ideal_start_age: 18,
  difficulty: 'medium', category: 'general',
  target_exam_ids: ['Your Target Exam'],
  stages: [
    { stage_number:1, stage_name:'Foundation Phase', class_or_phase:'phase_1', duration_weeks:12,
      stage_icon:'📚', difficulty_range:'L1-L2', coins_reward:300, badge_name:'Foundation',
      focus_summary:'Build strong basics across all subjects. Daily practice.',
      milestone_test:'1000 questions', topics:['Core Subjects'] },
    { stage_number:2, stage_name:'Intermediate Phase', class_or_phase:'phase_2', duration_weeks:12,
      stage_icon:'⚡', difficulty_range:'L2-L3', coins_reward:400, badge_name:'Intermediate',
      focus_summary:'Advanced topics and exam pattern practice.',
      milestone_test:'2000 questions + 10 mocks', topics:['Advanced Topics'] },
    { stage_number:3, stage_name:'Mock Phase', class_or_phase:'phase_3', duration_weeks:8,
      stage_icon:'🎯', difficulty_range:'L3-L4', coins_reward:500, badge_name:'Mock Master',
      focus_summary:'Full exam mocks and weak area targeting.',
      milestone_test:'20 full mocks', topics:['Mock Practice'] },
    { stage_number:4, stage_name:'Final Sprint', class_or_phase:'phase_4', duration_weeks:4,
      stage_icon:'🏆', difficulty_range:'L4', coins_reward:600, badge_name:'Ready!',
      focus_summary:'Revision and confidence building.',
      milestone_test:'Revision + 5 final mocks', topics:['Revision'] },
  ],
}

const DIFFICULTY_COLORS = {
  L1:'#059669', 'L1-L2':'#0891B2', L2:'#7C3AED',
  'L2-L3':'#D97706', L3:'#DC2626', 'L3-L4':'#1D4ED8',
  L4:'#1E3A5F', 'L4-L5':'#111827', L5:'#000'
}

export default function PrepPathway() {
  const { pathwayId }  = useParams()
  const navigate       = useNavigate()
  const { user, planTier, isUltra } = useAuth()

  const [pathway,    setPathway]    = useState(null)
  const [progress,   setProgress]   = useState({})
  // progress[stageNumber] = { status: 'locked'|'active'|'completed', score: 0-100, completedAt }
  const [loading,    setLoading]    = useState(true)
  const [showEnroll, setShowEnroll] = useState(false)
  const [enrolled,   setEnrolled]   = useState(false)

  // -- LOAD PATHWAY ----------------------------------------------------------
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        // Try Supabase first
        const { data: pw } = await supabase
          .from('prep_pathways').select('*').eq('pathway_id', pathwayId).single()
        const { data: stgs } = await supabase
          .from('prep_stages').select('*').eq('pathway_id', pathwayId).order('stage_number')
        if (pw && stgs?.length) {
          setPathway({ ...pw, stages: stgs })
        } else {
          throw new Error('no data')
        }
      } catch {
        // Use mock data
        setPathway(ALL_PATHWAYS[pathwayId] || DEFAULT_PATHWAY)
      }

      // Load user progress from localStorage
      const localKey = `tryit_pathway_progress_${user?.id}_${pathwayId}`
      const saved    = JSON.parse(localStorage.getItem(localKey) || '{}')
      if (Object.keys(saved).length > 0) {
        setProgress(saved)
        setEnrolled(true)
      } else {
        // Default: stage 1 = active, rest locked
        const init = {}
        const pw   = ALL_PATHWAYS[pathwayId] || DEFAULT_PATHWAY
        pw.stages?.forEach((s, i) => {
          init[s.stage_number] = { status: i===0?'active':'locked', score:0 }
        })
        setProgress(init)
      }
      setLoading(false)
    })()
  }, [pathwayId, user?.id])

  // -- ENROLL ----------------------------------------------------------------
  const handleEnroll = async () => {
    if (!isUltra) { navigate('/pro'); return }
    const init = {}
    pathway.stages?.forEach((s, i) => {
      init[s.stage_number] = { status: i===0?'active':'locked', score:0, enrolledAt: new Date().toISOString() }
    })
    setProgress(init)
    setEnrolled(true)
    localStorage.setItem(`tryit_pathway_progress_${user?.id}_${pathwayId}`, JSON.stringify(init))
    try {
      await supabase.from('user_prep_enrollment').upsert({
        user_id: user?.id, pathway_id: pathwayId,
        current_stage_num: 1, enrolled_at: new Date().toISOString(), is_active: true,
      }, { onConflict:'user_id,pathway_id' })
    } catch {}
    setShowEnroll(false)
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:BG }}>
      <p style={{ color:'#94A3B8' }}>Loading pathway...</p>
    </div>
  )

  if (!pathway) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:BG, gap:12 }}>
      <p style={{ fontSize:40 }}>🗺️</p>
      <p style={{ color:'#475569' }}>Pathway not found</p>
      <button onClick={() => navigate(-1)}
        style={{ padding:'10px 20px', background:NAVY, color:'#fff', border:'none', borderRadius:10, cursor:'pointer' }}>
        ← Go Back
      </button>
    </div>
  )

  const completedStages  = Object.values(progress).filter(p => p.status === 'completed').length
  const totalStages      = pathway.stages?.length || 1
  const overallPct       = Math.round((completedStages / totalStages) * 100)
  const activeStage      = pathway.stages?.find(s => progress[s.stage_number]?.status === 'active')
  const currentStageNum  = activeStage?.stage_number || 1

  const stageStatus = (stageNum) => progress[stageNum]?.status || 'locked'

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:100 }}>

      {/* -- HEADER -------------------------------------------------------- */}
      <div style={{ background:`linear-gradient(135deg,${pathway.color_primary},${pathway.color_primary}CC)`,
        color:'#fff', padding:'20px 16px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
          <button onClick={() => navigate(-1)}
            style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'#fff', width:36, height:36,
              borderRadius:'50%', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            ←
          </button>
          <div style={{ textAlign:'right' }}>
            <span style={{ background:'rgba(255,255,255,0.15)', color:'#fff', padding:'4px 12px',
              borderRadius:99, fontSize:11, fontWeight:700 }}>
              {pathway.difficulty?.toUpperCase().replace('_',' ')} · {pathway.total_months} months
            </span>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
          <span style={{ fontSize:40 }}>{pathway.icon_emoji}</span>
          <div>
            <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:18, margin:0, lineHeight:1.3 }}>
              {pathway.pathway_name}
            </h1>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', margin:'4px 0 0' }}>{pathway.tagline}</p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:14 }}>
          {[
            { label:'Entry', value: pathway.entry_point },
            { label:'Stages', value: `${totalStages} stages` },
            { label:'Target', value: pathway.target_exam_ids?.[0] || '-' },
            { label:'Start Age', value: `${pathway.ideal_start_age}+` },
          ].map(stat => (
            <div key={stat.label} style={{ background:'rgba(255,255,255,0.12)', borderRadius:10, padding:'8px 6px', textAlign:'center' }}>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.6)', marginBottom:2 }}>{stat.label}</p>
              <p style={{ fontSize:11, fontWeight:700, color:'#fff' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {enrolled && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)' }}>Overall Progress</p>
              <p style={{ fontSize:11, color:GOLD, fontWeight:700 }}>{overallPct}%</p>
            </div>
            <div style={{ height:8, background:'rgba(255,255,255,0.2)', borderRadius:99 }}>
              <div style={{ height:'100%', width:`${overallPct}%`, background:GOLD, borderRadius:99, transition:'width 0.5s' }} />
            </div>
            <p style={{ fontSize:10, color:'rgba(255,255,255,0.6)', marginTop:4 }}>
              Stage {currentStageNum} of {totalStages} active
            </p>
          </div>
        )}
      </div>

      {/* -- ENROLL CTA (if not enrolled) ---------------------------------- */}
      {!enrolled && (
        <div style={{ margin:16 }}>
          {!isUltra ? (
            <div style={{ background:'#FFF7E6', border:`2px solid ${GOLD}`, borderRadius:16, padding:16, textAlign:'center' }}>
              <p style={{ fontSize:40, marginBottom:8 }}>🔒</p>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:NAVY, fontSize:15, marginBottom:6 }}>
                Ultra Plan Required
              </p>
              <p style={{ fontSize:13, color:'#92400E', marginBottom:14, lineHeight:1.6 }}>
                Preparation Pathways are available only on Ultra. Upgrade to access all 24 pathways and track your {pathway.total_months}-month journey.
              </p>
              <button onClick={() => navigate('/pro')}
                style={{ width:'100%', padding:'13px', background:`linear-gradient(135deg,${GOLD},#E8C96A)`,
                  color:NAVY, border:'none', borderRadius:12, fontWeight:800, fontSize:14, cursor:'pointer' }}>
                Upgrade to Ultra →
              </button>
            </div>
          ) : (
            <div style={{ background:'#fff', border:'2px solid #E2E8F0', borderRadius:16, padding:16, textAlign:'center' }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:NAVY, fontSize:15, marginBottom:6 }}>
                Enroll in This Pathway
              </p>
              <p style={{ fontSize:13, color:'var(--color-text-light,#64748B)', marginBottom:14 }}>
                Start your {pathway.total_months}-month journey to {pathway.target_exam_ids?.[0]}. Track every stage, earn coins, reach your goal.
              </p>
              <button onClick={handleEnroll}
                style={{ width:'100%', padding:'13px', background:NAVY, color:'#fff',
                  border:'none', borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer' }}>
                🚀 Start This Journey
              </button>
            </div>
          )}
        </div>
      )}
      {showEnroll && (
  <PathwayEnrollModal
    pathway={pathway}
    onClose={() => setShowEnroll(false)}
    onEnrolled={() => { setEnrolled(true); setShowEnroll(false) }}
  />
)}

      {/* -- STAGES LIST ---------------------------------------------------- */}
      <div style={{ padding:'8px 16px' }}>
        <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', letterSpacing:1.2,
          textTransform:'uppercase', marginBottom:12 }}>
          Your Roadmap - {totalStages} Stages
        </p>

        {pathway.stages?.map((stage, idx) => {
          const status     = stageStatus(stage.stage_number)
          const isActive   = status === 'active'
          const isCompleted= status === 'completed'
          const isLocked   = status === 'locked'
          const stageScore = progress[stage.stage_number]?.score || 0

          return (
            <div key={stage.stage_number} style={{ marginBottom:12 }}>
              {/* Connector line */}
              {idx > 0 && (
                <div style={{ width:2, height:16, background: isLocked?'#E2E8F0':'#C9A84C',
                  margin:'0 auto -8px', marginLeft:28 }} />
              )}

              <div style={{
                background: isActive ? '#fff' : isCompleted ? '#F0FDF4' : '#F8FAFC',
                borderRadius:16, padding:14,
                border: isActive ? `2px solid ${pathway.color_primary}`
                      : isCompleted ? '2px solid #6EE7B7'
                      : '1.5px solid #E2E8F0',
                opacity: isLocked && !enrolled ? 0.5 : 1,
                cursor: (isActive || isCompleted) && enrolled ? 'pointer' : 'default',
              }}
              onClick={() => {
                if (!enrolled) return
                if (isActive) {
                  // Go to test or concept for this stage
                  navigate('/test-engine', { state: { stage } })
                }
              }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  {/* Stage icon + number */}
                  <div style={{ position:'relative', flexShrink:0 }}>
                    <div style={{ width:44, height:44, borderRadius:'50%', display:'flex',
                      alignItems:'center', justifyContent:'center', fontSize:20,
                      background: isCompleted ? '#D1FAE5' : isActive ? pathway.color_primary : '#E2E8F0' }}>
                      {isCompleted ? '✅' : isLocked && !enrolled ? '🔒' : stage.stage_icon}
                    </div>
                    {/* Stage number badge */}
                    <div style={{ position:'absolute', bottom:-4, right:-4, width:18, height:18,
                      borderRadius:'50%', background: isActive?GOLD:isCompleted?'#059669':'#94A3B8',
                      color:'#fff', fontSize:9, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {stage.stage_number}
                    </div>
                  </div>

                  {/* Stage info */}
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <p style={{ fontSize:14, fontWeight:700,
                          color: isActive ? pathway.color_primary : isCompleted ? '#059669' : '#94A3B8' }}>
                          {stage.stage_name}
                        </p>
                        <p style={{ fontSize:11, color:'#94A3B8', marginTop:2 }}>
                          {stage.class_or_phase?.replace(/_/g,' ')} · {stage.duration_weeks} weeks
                        </p>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99,
                          background:`${DIFFICULTY_COLORS[stage.difficulty_range] || '#94A3B8'}15`,
                          color: DIFFICULTY_COLORS[stage.difficulty_range] || '#94A3B8' }}>
                          {stage.difficulty_range}
                        </span>
                        {isCompleted && (
                          <p style={{ fontSize:11, color:'#059669', fontWeight:700, marginTop:3 }}>
                            Score: {stageScore}%
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Focus summary */}
                    {(isActive || isCompleted) && (
                      <p style={{ fontSize:12, color:'var(--color-text-light,#64748B)', marginTop:6, lineHeight:1.6 }}>
                        {stage.focus_summary}
                      </p>
                    )}

                    {/* Topics chips (active stage only) */}
                    {isActive && stage.topics?.length > 0 && (
                      <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:8 }}>
                        {stage.topics.map(t => (
                          <span key={t} style={{ background:`${pathway.color_primary}10`,
                            color:pathway.color_primary, padding:'3px 8px', borderRadius:99, fontSize:10, fontWeight:600 }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Milestone test & reward */}
                    {isActive && (
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
                        <p style={{ fontSize:11, color:'#94A3B8' }}>🎯 {stage.milestone_test}</p>
                        <span style={{ fontSize:11, fontWeight:700, color:'#92400E', background:'#FFF7E6',
                          padding:'2px 8px', borderRadius:99 }}>
                          +{stage.coins_reward} 🪙
                        </span>
                      </div>
                    )}

                    {/* Badge earned */}
                    {isCompleted && stage.badge_name && (
                      <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:6 }}>
                        <span style={{ fontSize:14 }}>🏅</span>
                        <span style={{ fontSize:11, fontWeight:600, color:'#059669' }}>{stage.badge_name}</span>
                      </div>
                    )}

                    {/* CTA for active stage */}
                    {isActive && enrolled && (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate('/test-engine') }}
                        style={{ marginTop:10, padding:'9px 18px',
                          background:`linear-gradient(135deg,${pathway.color_primary},${pathway.color_primary}CC)`,
                          color:'#fff', border:'none', borderRadius:10, fontWeight:700, fontSize:12, cursor:'pointer' }}>
                        Continue Stage {stage.stage_number} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Final destination */}
        <div style={{ marginTop:8, textAlign:'center', padding:20, background:'#fff',
          borderRadius:16, border:`2px dashed ${GOLD}` }}>
          <p style={{ fontSize:28, marginBottom:4 }}>🏁</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:14 }}>
            {pathway.target_exam_ids?.[0] || 'Your Goal'}
          </p>
          <p style={{ fontSize:12, color:'#94A3B8' }}>{pathway.exit_point} · Final Destination</p>
        </div>
      </div>

      {/* -- ALL PATHWAYS BUTTON -------------------------------------------- */}
      <div style={{ padding:'16px 16px 0' }}>
        <button onClick={() => navigate(-1)}
          style={{ width:'100%', padding:'12px', background:'#F1F5F9', color:'#475569',
            border:'1.5px solid #E2E8F0', borderRadius:14, fontWeight:600, fontSize:13, cursor:'pointer' }}>
          ← View All 24 Pathways
        </button>
      </div>
    </div>
  )
}