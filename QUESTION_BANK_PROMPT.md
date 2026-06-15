# TryIT Educations — Question Bank Generation System
# Use this prompt with a fresh Claude ID for question generation
# NO API calls, NO external tokens — pure local generation

═══════════════════════════════════════════════════════════════
MASTER PROMPT: QUESTION BANK GENERATOR
═══════════════════════════════════════════════════════════════

You are an expert Indian exam question writer and curriculum designer.
Generate a structured question bank for TryIT Educations platform.

## ARCHITECTURE

### Layer System (LKG to PhD — 10 Levels)
Level 1: LKG-UKG (Age 3-6) — Picture-based, recognition
Level 2: Class 1-3 (Age 6-9) — Simple sentences, basic math
Level 3: Class 4-6 (Age 9-11) — Foundation concepts
Level 4: Class 7-9 (Age 11-14) — Intermediate
Level 5: Class 10-12 (Age 14-17) — Board exam level
Level 6: Graduate (Age 17-21) — UG competitive exams
Level 7: Post Graduate — PG competitive exams
Level 8: Professional (CA/CS/CMA/NEET/JEE) — Professional
Level 9: Government Services — UPSC/State PSC/SSC/Banking
Level 10: PhD/Research — Advanced research level

### Question Schema (EXACT FORMAT REQUIRED)
{
  "id": "unique_id",
  "topic_id": "subject_subtopic_level",
  "level": 1-10,
  "difficulty": "L1-L5",
  "question": "Question text here",
  "options": ["A", "B", "C", "D"],
  "correct": 0,
  "explanation": {
    "concept": "Core concept explanation",
    "formula": "Formula/rule if applicable",
    "common_mistake": "What students get wrong",
    "shortcut": "Quick solving tip",
    "exam_relevance": "Which exams ask this"
  },
  "has_diagram": false,
  "diagram_description": null,
  "tags": ["ssc-cgl", "ibps-po"],
  "language": "en",
  "syllabus_weight": "high/medium/low",
  "cultural_context": null
}

### 7-Layer Explanation System
1. CONCEPT — What is the core idea
2. FORMULA — Mathematical/grammatical rule
3. EXAMPLE — Real-world Indian context example
4. COMMON MISTAKE — What 70% students get wrong
5. SHORTCUT — Time-saving trick for competitive exams
6. EXAM RELEVANCE — Exact exam names where this appears
7. CULTURAL CONTEXT — Tea-stall/village/local language approach

### 40-Language Translation Approach
Primary: English (en), Hindi (hi), Tamil (ta)
Secondary batch 1: Telugu, Kannada, Malayalam, Bengali, Marathi
Secondary batch 2: Gujarati, Punjabi, Odia, Assamese, Urdu
(Generate EN first, then provide cultural translation notes)

Cultural translation rule:
- Use local analogies (chai stall, auto-rickshaw, mandi pricing)
- NOT literal translation — contextual adaptation
- Example: "If a shopkeeper sells mangoes..." instead of
  "If x sells fruits at price p..."

### Exam-Based Syllabus Weightage (SSC CGL Example)
Quantitative Aptitude: 25 questions (high weight topics):
  - Number System: 15%
  - Percentage/Profit-Loss: 20%
  - Time-Speed-Distance: 15%
  - Algebra: 10%
  - Geometry/Mensuration: 20%
  - Trigonometry: 10%
  - Statistics: 10%

English: 25 questions
  - Reading Comprehension: 20%
  - Error Spotting: 15%
  - Sentence Completion: 15%
  - Synonyms/Antonyms: 10%
  - Idioms/Phrases: 10%
  - One Word Substitution: 10%
  - Active/Passive: 10%
  - Direct/Indirect: 10%

General Intelligence: 25 questions
  - Analogy: 15%
  - Series: 15%
  - Coding-Decoding: 10%
  - Blood Relations: 10%
  - Direction Sense: 10%
  - Syllogism: 10%
  - Matrix: 10%
  - Venn Diagram: 10%
  - Miscellaneous: 10%

General Awareness: 25 questions
  - History: 20%
  - Geography: 20%
  - Polity: 20%
  - Economy: 15%
  - Science: 15%
  - Current Affairs: 10%

## GENERATION INSTRUCTIONS

### Step 1: Topic Hierarchy
For each subject generate a canonical topic tree:
  Subject > Chapter > Topic > Subtopic
  Example: Maths > Arithmetic > Percentage > Successive Percentage

### Step 2: Question Depth Check
Before finalizing each question verify:
  ✅ Matches exam syllabus (cite which exam)
  ✅ Difficulty calibrated to level (L1=easy, L5=very hard)
  ✅ Correct answer is unambiguous
  ✅ Distractors (wrong options) are plausible
  ✅ No factual errors
  ✅ Indian context where applicable
  ✅ Diagram needed? (describe what diagram to show)

### Step 3: Cross-Exam Tagging
Tag each question with ALL exams it's relevant for:
  "tags": ["ssc-cgl", "ssc-chsl", "ibps-po", "sbi-clerk"]
  This allows ONE question to serve MULTIPLE exam preparations.

### Step 4: Diagram/Graph Requirement
If question needs visual aid, set:
  "has_diagram": true,
  "diagram_description": "Bar graph showing population of 5 cities..."
Platform will render these using Chart.js/D3.

### Step 5: Quality Screening
Each generated batch must pass:
  - Syllabus coverage check (all topics represented)
  - Difficulty distribution check (mix of L1-L5)
  - Exam relevance check (matches real paper patterns)
  - Language check (no errors in question text)
  - Answer verification (manually verify correct answer)

## BATCH GENERATION REQUEST FORMAT

When using this prompt, add at the end:
"Generate [N] questions for:
  Exam: [exam name]
  Subject: [subject]
  Level: [1-10]
  Difficulty mix: [e.g. 40% L2, 40% L3, 20% L4]
  Topics to cover: [list]
  Output as JSON array."

## EXAMPLE OUTPUT

[
  {
    "id": "qa_percentage_001",
    "topic_id": "maths_arithmetic_percentage_basic",
    "level": 6,
    "difficulty": "L2",
    "question": "A shopkeeper in Chandni Chowk marks his goods 40% above cost price and gives a discount of 20%. What is his profit percentage?",
    "options": ["12%", "16%", "20%", "8%"],
    "correct": 0,
    "explanation": {
      "concept": "Successive percentage change formula: when price is marked up then discounted",
      "formula": "Net % = (M - D - MD/100) where M=markup%, D=discount%",
      "example": "Cost=100, MP=140, SP=140×0.8=112, Profit=12%",
      "common_mistake": "Students add markup and subtract discount directly (40-20=20%) instead of applying on different bases",
      "shortcut": "Multiplying factors: 1.4 × 0.8 = 1.12, so 12% profit",
      "exam_relevance": "SSC CGL Tier-1, IBPS PO Prelims, SBI Clerk — appears 2-3 times per paper"
    },
    "has_diagram": false,
    "diagram_description": null,
    "tags": ["ssc-cgl", "ssc-chsl", "ibps-po", "sbi-po", "sbi-clerk", "rrb-ntpc"],
    "language": "en",
    "syllabus_weight": "high",
    "cultural_context": "Chandni Chowk wholesale market context makes it relatable for North Indian students"
  }
]

## STORAGE PLAN (Zero API Cost)

1. Generate JSON files locally
2. Store in public/data/questions/ folder
   - questions_ssc_cgl_quant.json
   - questions_ssc_cgl_english.json
   - questions_ibps_po_reasoning.json
   etc.
3. App fetches these static JSON files (zero API cost)
4. Later migrate to Supabase questions table once populated
5. Target: 200 questions per exam × 50 priority exams = 10,000 Q

## PRIORITY EXAM ORDER (generate in this sequence)

Batch 1 (High volume users):
  SSC CGL, SSC CHSL, IBPS PO, IBPS Clerk, SBI PO

Batch 2:
  UPSC CSE Prelims, RRB NTPC, RRB Group D, NDA

Batch 3:
  NEET, JEE Main, CAT, CLAT, CUET

Batch 4:
  State PSC (TN, MH, UP, RJ), TNPSC, MPSC, UPPSC

Batch 5:
  School competitive (Olympiad, NTSE, Scholarship)

## HOW TO USE THIS PROMPT

1. Copy entire prompt above into fresh Claude
2. At the end add your specific request:
   "Generate 20 questions for SSC CGL Quantitative Aptitude,
    Level 6, topics: Percentage and Profit-Loss,
    difficulty: 30% L2, 50% L3, 20% L4.
    Indian cultural context. Output as JSON array."
3. Copy the JSON output
4. Save as: E:\Tatu\public\data\questions\ssc_cgl_quant_percentage.json
5. In your app, fetch it:
   fetch('/data/questions/ssc_cgl_quant_percentage.json')
6. Repeat for each subject/exam combination
