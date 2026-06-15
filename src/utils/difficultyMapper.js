/**
 * computeDifficulty — Dynamic 1-10 difficulty based on:
 *   examName           : string  (e.g. "SSC CGL")
 *   topic              : string  (e.g. "profit-loss")
 *   syllabusWeightage  : number  0-1 (how important is this topic in the exam)
 *   studentPerformance : object  { [topic]: accuracy 0-100 }
 * Returns integer 1-10.
 */

// Base difficulty per exam tier
const EXAM_TIER = {
  'upsc-cse': 5, 'upsc-ifs': 5, 'upsc-capf': 4,
  'gate-cs': 4, 'gate-ec': 4, 'gate-me': 4,
  'jee-advanced': 5, 'jee-main-jan': 4, 'neet-ug': 4,
  'clat': 3, 'ca-final': 5, 'ca-inter': 4, 'ca-foundation': 3,
  'ssc-cgl-tier1': 3, 'ssc-cgl-tier2': 4, 'ssc-chsl': 2, 'ssc-mts': 2,
  'ibps-po-prelims': 3, 'ibps-po-mains': 4,
  'sbi-po-prelims': 3, 'rbi-grade-b': 4,
  'rrb-ntpc-cbt1': 2, 'rrb-group-d': 1,
  'nda': 3, 'cds': 3, 'agniveer-army-gd': 2,
  'ctet-paper1': 2, 'ctet-paper2': 3,
}

// Per-topic base difficulty modifier
const TOPIC_MODIFIER = {
  'profit-loss': 0, 'percentage': 0, 'time-work': 0.5,
  'time-distance': 0.5, 'simple-interest': -0.5,
  'compound-interest': 1, 'mixtures': 1.5, 'mensuration': 1,
  'trigonometry': 2, 'geometry': 1.5, 'algebra': 1,
  'number-system': 0, 'data-interpretation': 1,
  'reasoning-analogy': -0.5, 'reasoning-series': 0,
  'reasoning-puzzles': 1, 'reasoning-syllogism': 0.5,
  'english-grammar': 0, 'english-vocabulary': 0, 'english-rc': 1,
  'gk-history': 0, 'gk-polity': 0, 'gk-economy': 0.5,
  'gk-science': 0, 'gk-current-affairs': 0.5,
  'biology-cell': 1, 'biology-genetics': 1.5, 'biology-ecology': 1,
  'chemistry-organic': 2, 'chemistry-physical': 1.5, 'chemistry-inorganic': 1,
  'physics-mechanics': 1.5, 'physics-optics': 2, 'physics-modern': 2,
  'polity-constitution': 1, 'history-modern': 0.5, 'geography-india': 0.5,
}

export function computeDifficulty(examId, topic, syllabusWeightage = 0.1, studentPerformance = {}) {
  // 1. Base from exam tier (default 3)
  let base = EXAM_TIER[examId] ?? 3

  // 2. Topic modifier
  const topicMod = TOPIC_MODIFIER[topic] ?? 0
  base += topicMod

  // 3. Syllabus weightage: high weightage topics get a slight boost (they matter more)
  // weightage 0.2+ → +0.5, weightage 0.05- → -0.5
  if (syllabusWeightage >= 0.2) base += 0.5
  else if (syllabusWeightage <= 0.05) base -= 0.5

  // 4. Student performance adjustment:
  // If student is weak in this topic (accuracy < 50), make it easier to practice
  // If student is strong (accuracy > 80), give harder questions
  const acc = studentPerformance[topic]
  if (acc !== undefined) {
    if (acc < 40)      base -= 1.5  // very weak → easier
    else if (acc < 60) base -= 0.5  // weak → slightly easier
    else if (acc > 80) base += 1    // strong → harder
    else if (acc > 90) base += 2    // very strong → much harder
  }

  // Clamp to 1-10
  return Math.max(1, Math.min(10, Math.round(base)))
}

/**
 * filterByDifficulty — Select questions matching a target difficulty (±1 range)
 */
export function filterByDifficulty(questions, targetDifficulty, examId, studentPerf = {}, range = 1) {
  return questions.filter(q => {
    const d = computeDifficulty(examId, q.topic_id, q.syllabus_weightage ?? 0.1, studentPerf)
    return Math.abs(d - targetDifficulty) <= range
  })
}

/**
 * getDifficultyLabel — human readable
 */
export function getDifficultyLabel(d) {
  if (d <= 2) return { label: 'Beginner',    color: 'var(--color-success, #22C55E)', emoji: '🟢' }
  if (d <= 4) return { label: 'Easy',        color: '#84CC16', emoji: '🟡' }
  if (d <= 6) return { label: 'Medium',      color: '#F59E0B', emoji: '🟠' }
  if (d <= 8) return { label: 'Hard',        color: 'var(--color-error, #EF4444)', emoji: '🔴' }
  return               { label: 'Expert',    color: '#7C3AED', emoji: '🟣' }
}
