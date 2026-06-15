# HOW TO RUN - STEP BY STEP (Kid-friendly)

═══════════════════════════════════════════════
TOTAL TIME TO SETUP: 20 minutes
THEN: Runs automatically, laptop stays cool
═══════════════════════════════════════════════

STEP 1: CREATE FOLDER
─────────────────────
Open File Explorer → E: drive
Right click → New Folder → name: TryIT-Questions

STEP 2: GET 5 FREE GROQ KEYS (10 minutes)
──────────────────────────────────────────
Open browser. For EACH of 5 Gmail accounts:
  1. Go to: console.groq.com
  2. Sign Up with Gmail
  3. Click API Keys → Create Key
  4. Copy key (starts with gsk_...)
  5. Paste into Notepad
Do 5 times = 5 keys = 72,000 requests/day FREE

STEP 3: GET 2 FREE GEMINI KEYS (4 minutes)
────────────────────────────────────────────
  1. Go to: aistudio.google.com
  2. Sign in with Google
  3. Click: Get API Key
  4. Copy key (starts with AIza...)
  Do with 2 Gmail accounts = 2 keys

STEP 4: SETUP SUPABASE (5 minutes)
─────────────────────────────────────
  1. Go to: supabase.com
  2. Sign Up free
  3. New Project → name: tryit-qbank
  4. Region: Southeast Asia
  5. Wait 2 minutes
  6. Settings → API → copy:
     - Project URL
     - anon/public key

STEP 5: CREATE TABLES IN SUPABASE
───────────────────────────────────
  1. In Supabase: SQL Editor → New Query
  2. Open STEP1_ALL_EXAMS_SQL.sql from this folder
  3. Copy ALL content → Paste → Click RUN
  4. You see: "Success"
  5. Repeat for STEP2_ALL_EXAMS_DATA.sql
  6. Repeat for STEP3_SUBJECTS_TOPICS_SQL.sql
  7. Repeat for STEP4_EXAM_TOPIC_WEIGHTAGE.sql

STEP 6: SETUP THE GENERATOR
─────────────────────────────
  1. Open VS Code → Open Folder → E:\TryIT-Questions
  2. Copy STEP5_GENERATOR_SCRIPT.py into this folder
  3. Rename it to: generate.py
  4. Open it in VS Code
  5. Find line: GROQ_KEYS = [
     Replace "gsk_key1_paste_here" with your actual key 1
     Replace "gsk_key2_paste_here" with your actual key 2
     (repeat for all 5)
  6. Find line: SUPABASE_ACCOUNTS = [
     Replace the URL and key with YOUR Supabase URL and key
  7. Save the file (Ctrl+S)

STEP 7: INSTALL PYTHON PACKAGE
────────────────────────────────
  Open terminal in VS Code (Ctrl+`)
  Type: pip install requests
  Press Enter. Wait.

STEP 8: RUN!
─────────────
  In terminal type: python generate.py
  Press Enter.

  You will see:
  ════════════════════════════
  TryIT Question Bank Generator
  Started: 2026-06-15 10:30:00
  Jobs: 28
  Groq keys: 5
  ════════════════════════════
  → ssc_cgl | arith_percentage | L4 | 50Q
    ✓ Generated 50 questions
    ✓ Verified: 47/50 | Diagrams: 3
    ✓ Saved to Supabase: 47
  ...

STEP 9: CHECK RESULTS
──────────────────────
  1. Go to supabase.com → your project
  2. Click Table Editor → questions
  3. You see all questions saved! ✓
  
  First run: ~1,200 questions in 30 minutes
  With 5 keys running: ~50,000 in one day

═══════════════════════════════════════════════
SCALING TO 50,000 QUESTIONS
═══════════════════════════════════════════════

After first run works (1200 Q saved), scale up:

1. Add more jobs to PRIORITY_JOBS list in generate.py
   (each job = one topic + one exam + count)

2. Get 10 Groq keys instead of 5
   = 144,000 requests/day
   = ~50,000 questions per day

3. Add second Supabase account (free)
   For backup + extra storage

4. Schedule auto-run every day:
   Windows Task Scheduler → Create Task
   Program: python
   Arguments: E:\TryIT-Questions\generate.py
   Schedule: Daily 6:00 AM
   → Runs while you sleep!

═══════════════════════════════════════════════
DIAGRAM HANDLING
═══════════════════════════════════════════════

Questions needing diagrams are saved to diagram_queue table.
The question is saved with:
  needs_diagram: true
  diagram_type: "bar_chart" / "pie_chart" / "table" etc
  diagram_description: "Bar chart showing sales of 5 products
                        from 2020-2024. X-axis: years, 
                        Y-axis: sales in crores"

Later you can:
1. Use Chart.js in app to auto-generate from data
2. OR hire a designer to create proper diagrams
3. OR use AI image generation for figures

For now: Questions are still usable even without diagrams
The diagram_description tells exactly what to draw.

═══════════════════════════════════════════════
COPYRIGHT SAFETY
═══════════════════════════════════════════════

Our system is 100% copyright safe because:

1. We generate ORIGINAL questions
   - New numbers, new scenarios
   - Indian cultural context
   - Never copy from books/papers

2. CONCEPTS are not copyrighted
   - "Percentage" concept belongs to no one
   - We create original APPLICATIONS of concepts

3. Previous year papers inspire TOPICS only
   - We know CLAT has 35 Legal Reasoning questions
   - We create NEW legal reasoning questions
   - We don't reproduce CLAT's actual questions

4. All generated content is marked:
   copyright_original: true

If ever challenged:
   "These are AI-generated original questions
    inspired by universal academic concepts"

═══════════════════════════════════════════════
WHAT HAPPENS IN YOUR APP
═══════════════════════════════════════════════

When student selects CLAT exam:

TestLauncher.jsx fetches:
  supabase.from('questions')
    .select('*')
    .contains('exam_tags', ['clat'])
    .eq('verified', true)
    .limit(150)  // CLAT has 150 questions

System builds test:
  28 English passage questions
  35 Legal reasoning questions  
  35 Current affairs questions
  30 Logical reasoning questions
  22 Quantitative questions
  
Student gets: Exact CLAT pattern test ✓
