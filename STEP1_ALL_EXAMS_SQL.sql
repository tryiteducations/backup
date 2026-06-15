-- ═══════════════════════════════════════════════════════
-- STEP 1: CREATE ALL TABLES IN SUPABASE
-- Copy this ENTIRE SQL into Supabase SQL Editor → Run
-- ═══════════════════════════════════════════════════════

-- TABLE 1: ALL EXAMS WITH TIERS
CREATE TABLE IF NOT EXISTS exams (
  id text PRIMARY KEY,
  name text NOT NULL,
  short_name text,
  conducting_body text,
  category text,
  subcategory text,
  eligibility_level integer, -- 1=LKG, 5=10th, 6=12th, 7=Graduate, 8=PG, 9=PhD
  tiers jsonb, -- array of tier objects
  total_vacancies integer,
  frequency text, -- annual, biannual, etc
  official_website text,
  negative_marking boolean DEFAULT true,
  state_specific text, -- null if national
  language_medium text[],
  created_at timestamptz DEFAULT now()
);

-- TABLE 2: SUBJECTS MASTER
CREATE TABLE IF NOT EXISTS subjects (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text, -- science, arts, commerce, law, etc
  parent_id text REFERENCES subjects(id)
);

-- TABLE 3: TOPICS MASTER  
CREATE TABLE IF NOT EXISTS topics (
  id text PRIMARY KEY,
  subject_id text REFERENCES subjects(id),
  name text NOT NULL,
  parent_topic_id text REFERENCES topics(id),
  level_range int4range, -- which levels cover this topic
  copyright_safe_notes text
);

-- TABLE 4: EXAM-TOPIC MAPPING WITH WEIGHTAGE
CREATE TABLE IF NOT EXISTS exam_topic_map (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_id text REFERENCES exams(id),
  tier text,
  subject_id text REFERENCES subjects(id),
  topic_id text REFERENCES topics(id),
  weightage_percent numeric,
  question_count integer,
  marks integer,
  time_per_question_seconds integer,
  pattern_type text, -- mcq4, passage, descriptive, assertion_reason, match, numerical
  negative_marking numeric DEFAULT 0
);

-- TABLE 5: QUESTIONS (final verified)
CREATE TABLE IF NOT EXISTS questions (
  id text PRIMARY KEY,
  topic_id text REFERENCES topics(id),
  subject_id text REFERENCES subjects(id),
  level integer CHECK (level BETWEEN 1 AND 10),
  difficulty text CHECK (difficulty IN ('L1','L2','L3','L4','L5')),
  pattern_type text,
  needs_diagram boolean DEFAULT false,
  diagram_type text, -- bar_chart, pie_chart, line_graph, table, figure, map, etc
  diagram_description text,
  question_en text NOT NULL,
  options_en jsonb,
  correct_answer integer,
  explanation jsonb,
  translations jsonb DEFAULT '{}',
  exam_tags text[],
  verified boolean DEFAULT false,
  quality_score numeric DEFAULT 0,
  times_attempted integer DEFAULT 0,
  accuracy_rate numeric,
  copyright_original boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- TABLE 6: DIAGRAM QUEUE (questions needing visual)
CREATE TABLE IF NOT EXISTS diagram_queue (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id text REFERENCES questions(id),
  diagram_type text,
  diagram_description text,
  data_json jsonb, -- actual chart data
  status text DEFAULT 'pending', -- pending, generated, approved
  created_at timestamptz DEFAULT now()
);

-- TABLE 7: GENERATION JOBS (track progress)
CREATE TABLE IF NOT EXISTS generation_jobs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id text,
  exam_id text,
  level integer,
  target_count integer,
  generated_count integer DEFAULT 0,
  verified_count integer DEFAULT 0,
  status text DEFAULT 'pending',
  api_key_used text,
  started_at timestamptz,
  completed_at timestamptz
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_topic_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS
CREATE POLICY "Public read exams" ON exams FOR SELECT USING (true);
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Public read topics" ON topics FOR SELECT USING (true);
CREATE POLICY "Public read exam_topic_map" ON exam_topic_map FOR SELECT USING (true);
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (verified = true);

-- SERVICE ROLE WRITE ACCESS  
CREATE POLICY "Service write exams" ON exams FOR INSERT WITH CHECK (true);
CREATE POLICY "Service write questions" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Service write jobs" ON generation_jobs FOR ALL USING (true);

-- INDEXES FOR SPEED
CREATE INDEX idx_questions_topic ON questions(topic_id);
CREATE INDEX idx_questions_level ON questions(level);
CREATE INDEX idx_questions_exam_tags ON questions USING GIN(exam_tags);
CREATE INDEX idx_exam_topic_exam ON exam_topic_map(exam_id);
CREATE INDEX idx_exam_topic_topic ON exam_topic_map(topic_id);
