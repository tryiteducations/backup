// src/lib/foundationTopics.js
// Master taxonomy for the Foundation section: subjects -> topics -> 5-level ladder.
//
// IMPORTANT: not every topic spans all 5 levels. A topic's `startLevel`/`endLevel`
// defines which levels genuinely apply to it academically - e.g. Algebra doesn't
// exist at Class 1-5 (startLevel=2), Trigonometry doesn't exist before Class 9-10
// (startLevel=3). Levels outside a topic's range are shown as "N/A" (not applicable
// to this topic's curriculum, by design), which is different from "Coming soon"
// (applicable, just not authored yet). This is the fix for: a 6th-grader and a
// 12th-grader both study "Algebra," but at very different depth - the level ladder
// is what encodes that difference, topic by topic.
//
// `authoredLevels` tracks which levels (within the topic's start-end range) have
// real, quality-checked content in ConceptCard's MOCK_CONCEPTS / the `concepts`
// Supabase table.
//
// Level meaning (class-wise progression to competitive exam, per product decision):
//   Level 1 - Class 1-5 foundation (what/why, real-world intuition)
//   Level 2 - Class 6-8 (formal definition, standard method)
//   Level 3 - Class 9-10 (harder variations, multi-step problems)
//   Level 4 - Class 11-12 / early competitive (exam-style questions)
//   Level 5 - Competitive exam speed (shortcuts, mental math, common traps)

export const LEVEL_LABELS = {
  1: 'Foundation',
  2: 'Core Method',
  3: 'Advanced',
  4: 'Exam Application',
  5: 'Speed & Mastery',
}

// What a student sees when they pick their class - directly caps which levels show up.
// A Class 6 student sees Level 1-2 content only; a competitive-exam aspirant sees all 5.
export const CLASS_OPTIONS = [
  { id: 'c1_5',  label: 'Class 1-5',  maxLevel: 1 },
  { id: 'c6',    label: 'Class 6',    maxLevel: 2 },
  { id: 'c7',    label: 'Class 7',    maxLevel: 2 },
  { id: 'c8',    label: 'Class 8',    maxLevel: 2 },
  { id: 'c9',    label: 'Class 9',    maxLevel: 3 },
  { id: 'c10',   label: 'Class 10',   maxLevel: 3 },
  { id: 'c11',   label: 'Class 11',   maxLevel: 4 },
  { id: 'c12',   label: 'Class 12',   maxLevel: 4 },
  { id: 'ug_entrance',  label: 'UG Entrance (JEE/NEET/CUET)',      maxLevel: 5 },
  { id: 'state_psc',    label: 'State PSC / Public Service Exams', maxLevel: 5 },
  { id: 'central_govt', label: 'Central Govt (SSC/Banking/Railways)', maxLevel: 5 },
  { id: 'pg_entrance',  label: 'PG Entrance (GATE/CAT/NET)',       maxLevel: 5 },
  { id: 'phd_research', label: 'PhD / Research Entrance',         maxLevel: 5 },
  { id: 'departmental', label: 'Departmental / Promotion Exams',  maxLevel: 5 },
]

export function getMaxLevelForClass(classId) {
  return CLASS_OPTIONS.find(c => c.id === classId)?.maxLevel ?? 5
}

// Relevance tags - the "why does this topic matter" clarity: which school boards
// examine it, and which scholarship/entrance/competitive exams test it. Filled in
// for topics with real authored content; left blank for others until authored.
const PERCENTAGE_RELEVANCE = {
  boards: ['CBSE', 'ICSE', 'Tamil Nadu State Board', 'Maharashtra State Board', 'Rashtriya Military School', 'Sainik School'],
  exams: ['NTSE', 'Olympiads (IMO/NSO)', 'SSC CGL', 'IBPS PO/Clerk', 'CAT', 'UPSC CSAT'],
}

// Helper - most arithmetic/foundational topics span the full ladder; topics that
// don't exist at younger grades declare a later startLevel explicitly below.
const FULL_RANGE = { startLevel: 1, endLevel: 5 }

export const SUBJECTS = [
  {
    id: 'maths', label: 'Mathematics', emoji: '📐', color: '#2563EB',
    topics: [
      { id: 'arith_percentage', label: 'Percentage', ...FULL_RANGE, authoredLevels: [1,2,3,4,5], relevance: PERCENTAGE_RELEVANCE },
      { id: 'arith_profit_loss', label: 'Profit & Loss', ...FULL_RANGE, authoredLevels: [1] },
      { id: 'arith_ratio_proportion', label: 'Ratio & Proportion', ...FULL_RANGE, authoredLevels: [] },
      { id: 'arith_simple_compound_interest', label: 'Simple & Compound Interest', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'arith_time_work', label: 'Time & Work', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'arith_time_speed_distance', label: 'Time, Speed & Distance', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'algebra_linear_equations', label: 'Linear Equations', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'algebra_quadratic_equations', label: 'Quadratic Equations', startLevel: 3, endLevel: 5, authoredLevels: [] },
      { id: 'geometry_triangles', label: 'Triangles & Angles', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'geometry_mensuration', label: 'Mensuration (Area & Volume)', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'geometry_circles', label: 'Circles & Tangent Properties', startLevel: 3, endLevel: 5, authoredLevels: [] },
      { id: 'stats_average_mean', label: 'Average, Mean & Median', ...FULL_RANGE, authoredLevels: [] },
      { id: 'trig_basics', label: 'Trigonometry Basics', startLevel: 3, endLevel: 5, authoredLevels: [] },
      { id: 'calculus_limits_derivatives', label: 'Limits & Derivatives', startLevel: 4, endLevel: 5, authoredLevels: [] },
    ],
  },
  {
    id: 'reasoning', label: 'Reasoning & Aptitude', emoji: '🧠', color: '#7C3AED',
    topics: [
      { id: 'reason_blood_relations', label: 'Blood Relations', startLevel: 2, endLevel: 5, authoredLevels: [1] },
      { id: 'reason_seating_arrangement', label: 'Seating Arrangement', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'reason_syllogism', label: 'Syllogism', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'reason_coding_decoding', label: 'Coding-Decoding', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'reason_direction_sense', label: 'Direction Sense', startLevel: 1, endLevel: 5, authoredLevels: [] },
      { id: 'reason_series_analogy', label: 'Number & Alphabet Series', startLevel: 1, endLevel: 5, authoredLevels: [] },
      { id: 'reason_puzzles', label: 'Puzzles', startLevel: 2, endLevel: 5, authoredLevels: [] },
    ],
  },
  {
    id: 'science', label: 'General Science', emoji: '🔬', color: '#059669',
    topics: [
      { id: 'physics_newtons_laws', label: "Newton's Laws of Motion", ...FULL_RANGE, authoredLevels: [1] },
      { id: 'physics_electricity_basics', label: 'Electricity & Circuits', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'chem_periodic_table', label: 'Periodic Table Trends', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'chem_chemical_reactions', label: 'Chemical Reactions & Equations', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'bio_human_digestive_system', label: 'Human Digestive System', ...FULL_RANGE, authoredLevels: [] },
      { id: 'bio_photosynthesis', label: 'Photosynthesis', ...FULL_RANGE, authoredLevels: [] },
      { id: 'bio_cell_structure', label: 'Cell Structure & Function', startLevel: 2, endLevel: 5, authoredLevels: [] },
    ],
  },
  {
    id: 'social', label: 'History, Polity & Geography', emoji: '🏛️', color: '#B45309',
    topics: [
      { id: 'polity_fundamental_rights', label: 'Fundamental Rights & Duties', startLevel: 2, endLevel: 5, authoredLevels: [1] },
      { id: 'polity_indian_parliament', label: 'Parliament & Law-Making', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'history_indian_freedom_struggle', label: 'Indian Freedom Struggle', ...FULL_RANGE, authoredLevels: [] },
      { id: 'history_ancient_indian_dynasties', label: 'Ancient Indian Dynasties', ...FULL_RANGE, authoredLevels: [] },
      { id: 'geo_indian_rivers', label: 'Indian Rivers & Drainage', ...FULL_RANGE, authoredLevels: [] },
      { id: 'geo_climate_monsoons', label: 'Climate & Monsoons', ...FULL_RANGE, authoredLevels: [] },
      { id: 'economy_basic_concepts', label: 'Basic Economic Concepts (GDP, Inflation)', startLevel: 3, endLevel: 5, authoredLevels: [] },
    ],
  },
  {
    id: 'english', label: 'English Language', emoji: '📖', color: '#DB2777',
    topics: [
      { id: 'eng_tenses', label: 'Tenses', ...FULL_RANGE, authoredLevels: [1] },
      { id: 'eng_active_passive_voice', label: 'Active & Passive Voice', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'eng_direct_indirect_speech', label: 'Direct & Indirect Speech', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'eng_synonyms_antonyms', label: 'Synonyms & Antonyms', ...FULL_RANGE, authoredLevels: [] },
      { id: 'eng_reading_comprehension', label: 'Reading Comprehension Strategy', ...FULL_RANGE, authoredLevels: [] },
      { id: 'eng_one_word_substitution', label: 'One-Word Substitution', startLevel: 2, endLevel: 5, authoredLevels: [] },
    ],
  },
  {
    id: 'computer', label: 'Computer Science', emoji: '💻', color: '#0891B2',
    topics: [
      { id: 'cs_number_systems', label: 'Number Systems (Binary/Hex)', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'cs_basic_python', label: 'Python Basics', startLevel: 2, endLevel: 5, authoredLevels: [] },
      { id: 'cs_data_structures_intro', label: 'Arrays & Data Structures Intro', startLevel: 3, endLevel: 5, authoredLevels: [] },
      { id: 'cs_dbms_basics', label: 'Database Basics (SQL)', startLevel: 4, endLevel: 5, authoredLevels: [] },
    ],
  },
  {
    id: 'scholarship', label: 'Scholarship & Skill Tests', emoji: '🏅', color: '#CA8A04',
    topics: [
      { id: 'ntse_mat_reasoning', label: 'NTSE - Mental Ability (MAT)', startLevel: 2, endLevel: 3, authoredLevels: [] },
      { id: 'ntse_sat_scholastic', label: 'NTSE - Scholastic Aptitude (SAT)', startLevel: 2, endLevel: 3, authoredLevels: [] },
      { id: 'olympiad_maths_shortcuts', label: 'Maths Olympiad Problem-Solving', startLevel: 1, endLevel: 4, authoredLevels: [] },
      { id: 'olympiad_science_reasoning', label: 'Science Olympiad Reasoning', startLevel: 1, endLevel: 4, authoredLevels: [] },
      { id: 'nmms_aptitude', label: 'NMMS Scholarship Aptitude', startLevel: 2, endLevel: 3, authoredLevels: [] },
    ],
  },
  {
    id: 'global_lang', label: 'Global & Language Exams', emoji: '🌐', color: '#0E7490',
    topics: [
      { id: 'ielts_writing_task2', label: 'IELTS Writing Task 2', startLevel: 4, endLevel: 5, authoredLevels: [] },
      { id: 'ielts_speaking_fluency', label: 'IELTS Speaking Fluency', startLevel: 4, endLevel: 5, authoredLevels: [] },
      { id: 'toefl_reading_strategy', label: 'TOEFL Reading Strategy', startLevel: 4, endLevel: 5, authoredLevels: [] },
      { id: 'gre_verbal_reasoning', label: 'GRE Verbal Reasoning', startLevel: 4, endLevel: 5, authoredLevels: [] },
      { id: 'french_a1_basics', label: 'French A1 - Basics', startLevel: 1, endLevel: 3, authoredLevels: [] },
      { id: 'german_a1_basics', label: 'German A1 - Basics', startLevel: 1, endLevel: 3, authoredLevels: [] },
    ],
  },
]

export function getTopicAuthoredCount(topic) {
  return topic.authoredLevels?.length || 0
}

export function isLevelApplicable(topic, level) {
  const start = topic.startLevel ?? 1
  const end = topic.endLevel ?? 5
  return level >= start && level <= end
}

export function isLevelAuthored(topic, level) {
  return topic.authoredLevels?.includes(level) || false
}

export function findTopic(topicId) {
  for (const subject of SUBJECTS) {
    const topic = subject.topics.find(t => t.id === topicId)
    if (topic) return { subject, topic }
  }
  return null
}
