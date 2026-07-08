// src/lib/foundationTopics.js
// Master taxonomy for the Foundation section: subjects -> topics -> 5-level ladder.
// `authoredLevels` tracks which levels (1-5) have real, quality-checked content in
// ConceptCard's MOCK_CONCEPTS / the `concepts` Supabase table. Topics not yet authored
// still appear (so students can see the full map of what's coming) but are shown as
// "Coming soon" rather than linking into an empty page.
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

export const SUBJECTS = [
  {
    id: 'maths', label: 'Mathematics', emoji: '📐', color: '#2563EB',
    topics: [
      { id: 'arith_percentage', label: 'Percentage', authoredLevels: [1,2,3,4,5] },
      { id: 'arith_profit_loss', label: 'Profit & Loss', authoredLevels: [1] },
      { id: 'arith_ratio_proportion', label: 'Ratio & Proportion', authoredLevels: [] },
      { id: 'arith_simple_compound_interest', label: 'Simple & Compound Interest', authoredLevels: [] },
      { id: 'arith_time_work', label: 'Time & Work', authoredLevels: [] },
      { id: 'arith_time_speed_distance', label: 'Time, Speed & Distance', authoredLevels: [] },
      { id: 'algebra_linear_equations', label: 'Linear Equations', authoredLevels: [] },
      { id: 'algebra_quadratic_equations', label: 'Quadratic Equations', authoredLevels: [] },
      { id: 'geometry_triangles', label: 'Triangles & Angles', authoredLevels: [] },
      { id: 'geometry_mensuration', label: 'Mensuration (Area & Volume)', authoredLevels: [] },
      { id: 'stats_average_mean', label: 'Average, Mean & Median', authoredLevels: [] },
      { id: 'trig_basics', label: 'Trigonometry Basics', authoredLevels: [] },
    ],
  },
  {
    id: 'reasoning', label: 'Reasoning & Aptitude', emoji: '🧠', color: '#7C3AED',
    topics: [
      { id: 'reason_blood_relations', label: 'Blood Relations', authoredLevels: [1] },
      { id: 'reason_seating_arrangement', label: 'Seating Arrangement', authoredLevels: [] },
      { id: 'reason_syllogism', label: 'Syllogism', authoredLevels: [] },
      { id: 'reason_coding_decoding', label: 'Coding-Decoding', authoredLevels: [] },
      { id: 'reason_direction_sense', label: 'Direction Sense', authoredLevels: [] },
      { id: 'reason_series_analogy', label: 'Number & Alphabet Series', authoredLevels: [] },
      { id: 'reason_puzzles', label: 'Puzzles', authoredLevels: [] },
    ],
  },
  {
    id: 'science', label: 'General Science', emoji: '🔬', color: '#059669',
    topics: [
      { id: 'physics_newtons_laws', label: "Newton's Laws of Motion", authoredLevels: [1] },
      { id: 'physics_electricity_basics', label: 'Electricity & Circuits', authoredLevels: [] },
      { id: 'chem_periodic_table', label: 'Periodic Table Trends', authoredLevels: [] },
      { id: 'chem_chemical_reactions', label: 'Chemical Reactions & Equations', authoredLevels: [] },
      { id: 'bio_human_digestive_system', label: 'Human Digestive System', authoredLevels: [] },
      { id: 'bio_photosynthesis', label: 'Photosynthesis', authoredLevels: [] },
      { id: 'bio_cell_structure', label: 'Cell Structure & Function', authoredLevels: [] },
    ],
  },
  {
    id: 'social', label: 'History, Polity & Geography', emoji: '🏛️', color: '#B45309',
    topics: [
      { id: 'polity_fundamental_rights', label: 'Fundamental Rights & Duties', authoredLevels: [1] },
      { id: 'polity_indian_parliament', label: 'Parliament & Law-Making', authoredLevels: [] },
      { id: 'history_indian_freedom_struggle', label: 'Indian Freedom Struggle', authoredLevels: [] },
      { id: 'history_ancient_indian_dynasties', label: 'Ancient Indian Dynasties', authoredLevels: [] },
      { id: 'geo_indian_rivers', label: 'Indian Rivers & Drainage', authoredLevels: [] },
      { id: 'geo_climate_monsoons', label: 'Climate & Monsoons', authoredLevels: [] },
      { id: 'economy_basic_concepts', label: 'Basic Economic Concepts (GDP, Inflation)', authoredLevels: [] },
    ],
  },
  {
    id: 'english', label: 'English Language', emoji: '📖', color: '#DB2777',
    topics: [
      { id: 'eng_tenses', label: 'Tenses', authoredLevels: [1] },
      { id: 'eng_active_passive_voice', label: 'Active & Passive Voice', authoredLevels: [] },
      { id: 'eng_direct_indirect_speech', label: 'Direct & Indirect Speech', authoredLevels: [] },
      { id: 'eng_synonyms_antonyms', label: 'Synonyms & Antonyms', authoredLevels: [] },
      { id: 'eng_reading_comprehension', label: 'Reading Comprehension Strategy', authoredLevels: [] },
      { id: 'eng_one_word_substitution', label: 'One-Word Substitution', authoredLevels: [] },
    ],
  },
  {
    id: 'computer', label: 'Computer Science', emoji: '💻', color: '#0891B2',
    topics: [
      { id: 'cs_number_systems', label: 'Number Systems (Binary/Hex)', authoredLevels: [] },
      { id: 'cs_basic_python', label: 'Python Basics', authoredLevels: [] },
      { id: 'cs_data_structures_intro', label: 'Arrays & Data Structures Intro', authoredLevels: [] },
      { id: 'cs_dbms_basics', label: 'Database Basics (SQL)', authoredLevels: [] },
    ],
  },
]

export function getTopicAuthoredCount(topic) {
  return topic.authoredLevels?.length || 0
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
