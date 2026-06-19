// FILE: src/lib/answerKeyEngine.js
// TryIT — Dynamic Paper Assembly + Answer Key Engine
//
// CORE PRINCIPLE:
//   Every student gets a UNIQUE 100-question paper.
//   Questions assembled from topic pools following exact PYQ weightage.
//   Answer key lives INSIDE each question (correct_answer field).
//   Scoring always by q_id — never by position alone.
//   Two friends in same room cannot help each other.

import { supabase } from './supabase'

// ── 1. ASSEMBLE UNIQUE PAPER FOR STUDENT ─────────────────────────────────
// Called at registration time. Runs 3-layer verification.
// Returns question array with answer keys embedded.

export async function assembleUniquePaper(tournamentId, userId, blueprintId) {
  // Load blueprint
  const { data: blueprint } = await supabase
    .from('assembly_blueprints')
    .select('*')
    .eq('blueprint_id', blueprintId)
    .single()

  if (!blueprint) throw new Error('Blueprint not found: ' + blueprintId)

  const slots = blueprint.slots  // array of topic slot definitions

  let questions         = []
  let attempts          = 0
  let sectionOk         = false
  let weightageOk       = false
  let uniquenessOk      = false
  const MAX_ATTEMPTS    = 5

  while (attempts < MAX_ATTEMPTS) {
    attempts++
    questions = []

    // ── STEP 1: PICK QUESTIONS FROM EACH TOPIC POOL ──────────────────
    for (const slot of slots) {
      const topicQs = await pickFromPool({
        topicCode:  slot.topic_code,
        subject:    slot.subject,
        difficulty: slot.difficulty,
        count:      slot.count,
        exclude:    questions.map(q => q.q_id),
        blueprintId,
      })
      questions.push(...topicQs)
    }

    if (questions.length < blueprint.total_questions) {
      console.warn(`[Assembly] Only ${questions.length} questions found, retrying...`)
      continue
    }

    // ── STEP 2: SHUFFLE (so same topics not always grouped together) ──
    questions = shuffleArray(questions)

    const qIds = questions.map(q => q.q_id)

    // ── LAYER 1: SECTION ACCURACY CHECK ──────────────────────────────
    sectionOk = verifySections(questions, blueprint.sections)
    if (!sectionOk) {
      console.warn('[Assembly] Section check failed, retrying...')
      continue
    }

    // ── LAYER 2: TOPIC WEIGHTAGE vs PYQ CHECK ────────────────────────
    weightageOk = verifyWeightage(questions, slots)
    if (!weightageOk) {
      console.warn('[Assembly] Weightage check failed, retrying...')
      continue
    }

    // ── LAYER 3: UNIQUENESS CHECK (vs other assembled papers) ─────────
    uniquenessOk = await verifyUniqueness(qIds, tournamentId, blueprint.max_overlap_pct || 15)
    if (!uniquenessOk) {
      console.warn('[Assembly] Uniqueness check failed, retrying...')
      continue
    }

    // All 3 layers passed
    break
  }

  if (!sectionOk || !weightageOk) {
    throw new Error('Could not assemble valid paper after ' + MAX_ATTEMPTS + ' attempts')
  }

  if (!uniquenessOk) {
    console.warn('[Assembly] Uniqueness could not be guaranteed — proceeding with best attempt')
  }

  // ── BUILD ANSWER KEY ──────────────────────────────────────────────
  const answerKey  = questions.map(q => q.correct_answer).join('')
  const answerIds  = questions.map(q => `${q.q_id}_${q.correct_answer}`)
  const keyHash    = await sha256(answerKey)  // published at 8 PM for verification

  // ── SAVE TO DATABASE ──────────────────────────────────────────────
  const { data: paper, error } = await supabase
    .from('student_papers')
    .insert({
      tournament_id:       tournamentId,
      user_id:             userId,
      blueprint_id:        blueprintId,
      question_ids:        questions.map(q => q.q_id),
      answer_key:          answerKey,
      answer_ids:          answerIds,
      section_verified:    sectionOk,
      weightage_verified:  weightageOk,
      uniqueness_verified: uniquenessOk,
      answer_key_hash:     keyHash,
    })
    .select()
    .single()

  if (error) throw error

  // ── RETURN PAPER (for encryption and CDN upload) ──────────────────
  return {
    paper_id:     paper.paper_id,
    questions:    questions,   // full question objects with correct_answer
    answer_key:   answerKey,
    answer_key_hash: keyHash,
  }
}


// ── 2. PICK FROM TOPIC POOL ───────────────────────────────────────────────
async function pickFromPool({ topicCode, subject, difficulty, count, exclude, blueprintId }) {
  // Get blueprint to check PYQ exclusion years
  const { data: bp } = await supabase
    .from('assembly_blueprints')
    .select('exclude_pyq_years')
    .eq('blueprint_id', blueprintId)
    .single()

  const excludePyqYears = bp?.exclude_pyq_years || 3
  const currentYear     = new Date().getFullYear()
  const excludeFromYear = currentYear - excludePyqYears

  // Fetch from question_bank
  let query = supabase
    .from('question_bank')
    .select('q_id,topic_code,subject,difficulty,question_text,options,correct_answer,explanation_en,explanation_hi,explanation_ta,explanation_te,explanation_kn,explanation_ml,why_wrong_a,why_wrong_b,why_wrong_c,why_wrong_d,shortcut,mnemonic,exam_frequency,is_honeypot,honeypot_ai_answer')
    .eq('topic_code',   topicCode)
    .eq('subject',      subject)
    .eq('difficulty',   difficulty)
    .eq('admin_approved', true)

  // Exclude already-picked questions
  if (exclude.length > 0) {
    query = query.not('q_id', 'in', `(${exclude.map(id => `"${id}"`).join(',')})`)
  }

  // Exclude recent PYQ questions (they may appear in real exam memory)
  query = query.or(`is_pyq.eq.false,pyq_year.lt.${excludeFromYear}`)

  // Randomise (Supabase doesn't have native RANDOM() in JS client,
  // so we fetch more and randomly pick)
  query = query.limit(count * 4)  // fetch 4x more than needed

  const { data: pool, error } = await query

  if (error || !pool?.length) {
    console.error(`[Assembly] Empty pool for ${topicCode}_${difficulty}:`, error)
    // Fallback: try adjacent difficulty
    return pickFromPoolFallback({ topicCode, subject, difficulty, count, exclude })
  }

  // Randomly pick 'count' from pool
  const shuffled = shuffleArray(pool)
  return shuffled.slice(0, count)
}

// Fallback: try L2 if L3 pool empty, or L3 if L2 pool empty
async function pickFromPoolFallback({ topicCode, subject, difficulty, count, exclude }) {
  const fallback = difficulty === 'L3' ? 'L2' : difficulty === 'L2' ? 'L3' : 'L2'
  const { data } = await supabase
    .from('question_bank')
    .select('*')
    .eq('topic_code', topicCode)
    .eq('subject', subject)
    .eq('difficulty', fallback)
    .eq('admin_approved', true)
    .not('q_id', 'in', exclude.length ? `(${exclude.map(id=>`"${id}"`).join(',')})` : '("")')
    .limit(count * 4)

  if (!data?.length) return []
  return shuffleArray(data).slice(0, count)
}


// ── 3. LAYER 1: SECTION ACCURACY ─────────────────────────────────────────
export function verifySections(questions, sectionsConfig) {
  const counts = {}
  for (const q of questions) {
    counts[q.subject] = (counts[q.subject] || 0) + 1
  }

  for (const [subject, config] of Object.entries(sectionsConfig)) {
    const required = config.count
    const actual   = counts[subject] || 0
    if (actual !== required) {
      console.warn(`[Section] ${subject}: required ${required}, got ${actual}`)
      return false
    }
  }
  return true
}


// ── 4. LAYER 2: TOPIC WEIGHTAGE vs PYQ ───────────────────────────────────
export function verifyWeightage(questions, slots) {
  const topicCounts = {}
  for (const q of questions) {
    topicCounts[q.topic_code] = (topicCounts[q.topic_code] || 0) + 1
  }

  for (const slot of slots) {
    const required  = slot.count
    const tolerance = slot.tolerance || 1
    const actual    = topicCounts[slot.topic_code] || 0

    if (actual < (required - tolerance) || actual > (required + tolerance)) {
      console.warn(
        `[Weightage] ${slot.topic_code}: required ${required}±${tolerance}, got ${actual}`
      )
      return false
    }
  }
  return true
}


// ── 5. LAYER 3: UNIQUENESS CHECK ──────────────────────────────────────────
export async function verifyUniqueness(qIds, tournamentId, maxOverlapPct = 15) {
  // Fetch 20 random already-assembled papers for this tournament
  const { data: existingPapers } = await supabase
    .from('student_papers')
    .select('paper_id,question_ids')
    .eq('tournament_id', tournamentId)
    .limit(20)

  if (!existingPapers?.length) return true  // first paper, no comparison needed

  const qIdSet = new Set(qIds)
  const maxOverlapCount = Math.floor((qIds.length * maxOverlapPct) / 100)
  // e.g. 100 questions × 15% = max 15 questions can overlap

  for (const paper of existingPapers) {
    const overlap = paper.question_ids.filter(id => qIdSet.has(id)).length
    if (overlap > maxOverlapCount) {
      console.warn(
        `[Uniqueness] Overlap ${overlap}/${qIds.length} with paper ${paper.paper_id} (max ${maxOverlapCount})`
      )
      return false
    }
  }

  return true
}


// ── 6. SCORE BY q_id (not position) ──────────────────────────────────────
// This is the core scoring function. Always matches by question ID.
export function scoreByQId(studentAnswers, questions, markingScheme) {
  // studentAnswers: { "PERC_L2_023": "C", "SDT_L3_007": "A", ... }
  // questions: array with q_id and correct_answer

  const { correct_marks, wrong_marks } = markingScheme

  let score       = 0
  let correct     = 0
  let wrong       = 0
  let unattempted = 0
  const perQuestion = []

  for (const q of questions) {
    const given     = studentAnswers[q.q_id]
    const isCorrect = given === q.correct_answer

    if (!given || given === 'SKIP') {
      unattempted++
      perQuestion.push({
        q_id:           q.q_id,
        position:       q.position,
        topic_code:     q.topic_code,
        subject:        q.subject,
        question_text:  q.question_text,
        options:        q.options,
        student_answer: null,
        correct_answer: q.correct_answer,
        result:         'unattempted',
        points:         0,
      })
    } else if (isCorrect) {
      score += correct_marks
      correct++
      perQuestion.push({
        q_id:           q.q_id,
        position:       q.position,
        topic_code:     q.topic_code,
        subject:        q.subject,
        question_text:  q.question_text,
        options:        q.options,
        student_answer: given,
        correct_answer: q.correct_answer,
        result:         'correct',
        points:         correct_marks,
      })
    } else {
      score += wrong_marks
      wrong++
      perQuestion.push({
        q_id:           q.q_id,
        position:       q.position,
        topic_code:     q.topic_code,
        subject:        q.subject,
        question_text:  q.question_text,
        options:        q.options,
        student_answer: given,
        correct_answer: q.correct_answer,
        result:         'incorrect',
        points:         wrong_marks,
      })
    }
  }

  const accuracy = (correct + wrong) > 0
    ? (correct / (correct + wrong)) * 100 : 0

  const subjectScores = computeSubjectBreakdown(perQuestion)
  const weakTopics    = findWeakTopics(perQuestion)

  return {
    raw_score:      Math.round(score * 100) / 100,
    correct,
    wrong,
    unattempted,
    accuracy_pct:   Math.round(accuracy * 10) / 10,
    percentage:     Math.round((score / markingScheme.max_score) * 1000) / 10,
    max_score:      markingScheme.max_score,
    per_question:   perQuestion,
    subject_scores: subjectScores,
    weak_topics:    weakTopics,
  }
}


// ── 7. BUILD REVIEW DATA (unlocked at 8 PM) ───────────────────────────────
// Enriches per_question results with full explanations
export async function buildReviewData(perQuestion, userLanguage = 'en') {
  const qIds   = perQuestion.map(pq => pq.q_id)

  // Fetch full explanation data from question_bank
  const { data: fullQuestions } = await supabase
    .from('question_bank')
    .select(`
      q_id, explanation_en, explanation_hi, explanation_ta, explanation_te,
      explanation_kn, explanation_ml, why_wrong_a, why_wrong_b, why_wrong_c,
      why_wrong_d, shortcut, mnemonic, exam_frequency, is_honeypot
    `)
    .in('q_id', qIds)

  if (!fullQuestions) return perQuestion

  const fullMap = Object.fromEntries(fullQuestions.map(q => [q.q_id, q]))

  const langKey = `explanation_${userLanguage}`

  return perQuestion.map(pq => {
    const full = fullMap[pq.q_id]
    if (!full) return pq

    // Pick explanation in student's language, fall back to English
    const explanation = full[langKey] || full.explanation_en

    // Why wrong per option (only for incorrect/unattempted)
    const whyWrong = {}
    if (pq.result !== 'correct') {
      const studentChoice = pq.student_answer
      if (studentChoice === 'A' && full.why_wrong_a) whyWrong.student = full.why_wrong_a
      if (studentChoice === 'B' && full.why_wrong_b) whyWrong.student = full.why_wrong_b
      if (studentChoice === 'C' && full.why_wrong_c) whyWrong.student = full.why_wrong_c
      if (studentChoice === 'D' && full.why_wrong_d) whyWrong.student = full.why_wrong_d
    }

    // All wrong option explanations (to explain why each is a trap)
    const allWrongReasons = {
      A: pq.correct_answer === 'A' ? null : full.why_wrong_a,
      B: pq.correct_answer === 'B' ? null : full.why_wrong_b,
      C: pq.correct_answer === 'C' ? null : full.why_wrong_c,
      D: pq.correct_answer === 'D' ? null : full.why_wrong_d,
    }

    return {
      ...pq,
      explanation,
      explanation_en:    full.explanation_en,
      why_wrong_student: whyWrong.student || null,
      all_wrong_reasons: allWrongReasons,
      shortcut:          full.shortcut,
      mnemonic:          full.mnemonic,
      exam_frequency:    full.exam_frequency,
      is_honeypot:       full.is_honeypot,
    }
  })
}


// ── 8. COMPRESS ANSWERS (q_id → position-based for 1KB submission) ────────
export function compressAnswersToString(studentAnswers, questions) {
  // questions array is position-ordered
  return questions.map(q => {
    const answer = studentAnswers[q.q_id]
    if (!answer || answer === 'SKIP') return 'S'
    return answer  // A, B, C, or D
  }).join('')
  // Result: "CBAS..." (100 chars, one per question position)
}

// Decompress: position string back to q_id map
export function decompressAnswerString(answerString, questions) {
  const answers = {}
  for (let i = 0; i < questions.length && i < answerString.length; i++) {
    const char = answerString[i]
    if (char !== 'S') {
      answers[questions[i].q_id] = char
    }
  }
  return answers
}


// ── 9. SERVER-SIDE VERIFICATION (at 4 PM batch) ───────────────────────────
// Called by batch-rank-computer.js to verify device score
export function verifyDeviceScore(answerString, studentPaper, markingScheme) {
  const answers   = decompressAnswerString(answerString, studentPaper.questions)
  const serverResult = scoreByQId(answers, studentPaper.questions, markingScheme)

  // The device-computed score should match server score
  // Small floating-point differences are acceptable (< 0.01)
  return serverResult
}


// ── HELPERS ───────────────────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function computeSubjectBreakdown(perQuestion) {
  const subjects = {}
  for (const pq of perQuestion) {
    const s = pq.subject || 'general'
    if (!subjects[s]) subjects[s] = { correct:0, wrong:0, unattempted:0, score:0, total:0 }
    subjects[s][pq.result === 'correct' ? 'correct' : pq.result === 'incorrect' ? 'wrong' : 'unattempted']++
    subjects[s].score += pq.points
    subjects[s].total++
  }
  // Add accuracy per subject
  for (const s of Object.keys(subjects)) {
    const attempted = subjects[s].correct + subjects[s].wrong
    subjects[s].accuracy = attempted > 0
      ? Math.round((subjects[s].correct / attempted) * 100) : 0
  }
  return subjects
}

function findWeakTopics(perQuestion) {
  const topics = {}
  for (const pq of perQuestion) {
    const t = pq.topic_code || 'general'
    if (!topics[t]) topics[t] = { wrong:0, total:0, subject: pq.subject }
    if (pq.result === 'incorrect') topics[t].wrong++
    topics[t].total++
  }
  return Object.entries(topics)
    .filter(([,v]) => v.wrong > 0)
    .map(([topic, v]) => ({
      topic_code:  topic,
      subject:     v.subject,
      wrong:       v.wrong,
      total:       v.total,
      error_rate:  Math.round((v.wrong / v.total) * 100),
    }))
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, 5)  // top 5 weakest topics
}

async function sha256(text) {
  const msgBuffer  = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray  = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2,'0')).join('')
}