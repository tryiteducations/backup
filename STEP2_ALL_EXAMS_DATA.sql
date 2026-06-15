-- ═══════════════════════════════════════════════════════
-- STEP 2: INSERT ALL INDIAN EXAMS WITH TIERS
-- This covers LKG to Senior Citizen
-- ═══════════════════════════════════════════════════════

INSERT INTO exams (id, name, short_name, conducting_body, category, subcategory, eligibility_level, tiers, frequency, negative_marking, state_specific) VALUES

-- ══════════════════════════════
-- SCHOOL LEVEL (L1-L5)
-- ══════════════════════════════
('olympiad_nso', 'National Science Olympiad', 'NSO', 'SOF', 'school', 'olympiad', 3,
 '[{"tier":"Level 1","q":50,"marks":50,"time":60},{"tier":"Level 2","q":50,"marks":50,"time":60}]',
 'annual', true, null),

('olympiad_imo', 'International Mathematics Olympiad', 'IMO', 'SOF', 'school', 'olympiad', 3,
 '[{"tier":"Level 1","q":50,"marks":60,"time":60},{"tier":"Level 2","q":50,"marks":60,"time":60}]',
 'annual', true, null),

('olympiad_ieo', 'International English Olympiad', 'IEO', 'SOF', 'school', 'olympiad', 3,
 '[{"tier":"Level 1","q":35,"marks":40,"time":60},{"tier":"Level 2","q":40,"marks":50,"time":60}]',
 'annual', true, null),

('ntse', 'National Talent Search Examination', 'NTSE', 'NCERT', 'school', 'scholarship', 5,
 '[{"tier":"Stage 1","q":200,"marks":200,"time":240},{"tier":"Stage 2","q":200,"marks":200,"time":240}]',
 'annual', false, null),

('kvpy', 'Kishore Vaigyanik Protsahan Yojana', 'KVPY', 'IISc', 'school', 'scholarship', 5,
 '[{"tier":"Aptitude Test","q":80,"marks":100,"time":180},{"tier":"Interview","q":0,"marks":0,"time":0}]',
 'annual', true, null),

('nmms', 'National Means Cum Merit Scholarship', 'NMMS', 'MHRD', 'school', 'scholarship', 4,
 '[{"tier":"SAT+MAT","q":180,"marks":180,"time":180}]',
 'annual', false, null),

-- ══════════════════════════════
-- ENGINEERING ENTRANCE (L6-L7)
-- ══════════════════════════════
('jee_main', 'Joint Entrance Examination Main', 'JEE Main', 'NTA', 'engineering', 'national', 6,
 '[{"tier":"Paper 1 BE/BTech","q":90,"marks":300,"time":180},{"tier":"Paper 2A BArch","q":82,"marks":390,"time":180},{"tier":"Paper 2B BPlanning","q":105,"marks":400,"time":180}]',
 'biannual', true, null),

('jee_advanced', 'Joint Entrance Examination Advanced', 'JEE Adv', 'IITs', 'engineering', 'national', 6,
 '[{"tier":"Paper 1","q":54,"marks":180,"time":180},{"tier":"Paper 2","q":54,"marks":180,"time":180}]',
 'annual', true, null),

('bitsat', 'BITS Admission Test', 'BITSAT', 'BITS Pilani', 'engineering', 'private', 6,
 '[{"tier":"Single Test","q":130,"marks":390,"time":180}]',
 'annual', true, null),

('viteee', 'VIT Engineering Entrance Exam', 'VITEEE', 'VIT', 'engineering', 'private', 6,
 '[{"tier":"Single Test","q":125,"marks":125,"time":150}]',
 'annual', false, null),

('mhtcet_engg', 'Maharashtra CET Engineering', 'MHT CET', 'MAHACET', 'engineering', 'state', 6,
 '[{"tier":"PCM Paper","q":150,"marks":200,"time":180},{"tier":"PCB Paper","q":150,"marks":200,"time":180}]',
 'annual', true, 'Maharashtra'),

('kcet', 'Karnataka CET', 'KCET', 'KEA', 'engineering', 'state', 6,
 '[{"tier":"Biology","q":60,"marks":60,"time":80},{"tier":"Mathematics","q":60,"marks":60,"time":80},{"tier":"Physics+Chemistry","q":120,"marks":120,"time":160}]',
 'annual', false, 'Karnataka'),

('ap_eamcet', 'AP Engineering Agriculture Medical CET', 'AP EAMCET', 'JNTU', 'engineering', 'state', 6,
 '[{"tier":"Engineering","q":160,"marks":160,"time":180},{"tier":"Agriculture","q":160,"marks":160,"time":180}]',
 'annual', false, 'Andhra Pradesh'),

('ts_eamcet', 'Telangana EAMCET', 'TS EAMCET', 'TSCHE', 'engineering', 'state', 6,
 '[{"tier":"Engineering","q":160,"marks":160,"time":180}]',
 'annual', false, 'Telangana'),

('wbjee', 'West Bengal JEE', 'WBJEE', 'WBJEEB', 'engineering', 'state', 6,
 '[{"tier":"Mathematics","q":75,"marks":100,"time":120},{"tier":"Physics+Chemistry","q":80,"marks":100,"time":120}]',
 'annual', true, 'West Bengal'),

('gate', 'Graduate Aptitude Test in Engineering', 'GATE', 'IITs/IISc', 'engineering', 'pg', 7,
 '[{"tier":"Single Paper","q":65,"marks":100,"time":180}]',
 'annual', true, null),

-- ══════════════════════════════
-- MEDICAL ENTRANCE (L6-L8)
-- ══════════════════════════════
('neet_ug', 'National Eligibility Entrance Test UG', 'NEET UG', 'NTA', 'medical', 'ug', 6,
 '[{"tier":"Single Exam","q":200,"marks":720,"time":200}]',
 'annual', true, null),

('neet_pg', 'NEET Postgraduate', 'NEET PG', 'NBE', 'medical', 'pg', 7,
 '[{"tier":"Single Exam","q":200,"marks":800,"time":210}]',
 'annual', true, null),

('ini_cet', 'Institute of National Importance CET', 'INI CET', 'AIIMS', 'medical', 'pg', 7,
 '[{"tier":"Single Exam","q":200,"marks":200,"time":180}]',
 'annual', false, null),

('fmge', 'Foreign Medical Graduate Examination', 'FMGE', 'NBE', 'medical', 'screening', 7,
 '[{"tier":"Single Exam","q":300,"marks":300,"time":300}]',
 'biannual', false, null),

('aiapget', 'All India Ayush PG Entrance Test', 'AIAPGET', 'NTA', 'medical', 'ayush', 7,
 '[{"tier":"Single Exam","q":200,"marks":200,"time":200}]',
 'annual', true, null),

-- ══════════════════════════════
-- LAW ENTRANCE (L6-L8)
-- ══════════════════════════════
('clat', 'Common Law Admission Test', 'CLAT', 'Consortium NLUs', 'law', 'ug_pg', 6,
 '[{"tier":"UG Program","q":150,"marks":150,"time":120},{"tier":"PG Program","q":120,"marks":120,"time":120}]',
 'annual', true, null),

('ailet', 'All India Law Entrance Test', 'AILET', 'NLU Delhi', 'law', 'ug', 6,
 '[{"tier":"UG","q":150,"marks":150,"time":90},{"tier":"PG","q":100,"marks":100,"time":90}]',
 'annual', false, null),

('slat', 'Symbiosis Law Admission Test', 'SLAT', 'Symbiosis', 'law', 'private', 6,
 '[{"tier":"Single Test","q":60,"marks":60,"time":60}]',
 'annual', false, null),

('lsat_india', 'Law School Admission Test India', 'LSAT India', 'LSAC', 'law', 'private', 6,
 '[{"tier":"Single Test","q":92,"marks":92,"time":158}]',
 'annual', false, null),

('mh_cet_law', 'Maharashtra CET Law', 'MH CET Law', 'MAHACET', 'law', 'state', 6,
 '[{"tier":"3 Year LLB","q":150,"marks":150,"time":90},{"tier":"5 Year LLB","q":150,"marks":150,"time":90}]',
 'annual', false, 'Maharashtra'),

-- ══════════════════════════════
-- MANAGEMENT ENTRANCE (L7-L8)
-- ══════════════════════════════
('cat', 'Common Admission Test', 'CAT', 'IIMs', 'management', 'national', 7,
 '[{"tier":"Single Exam","q":66,"marks":198,"time":120}]',
 'annual', true, null),

('xat', 'Xavier Aptitude Test', 'XAT', 'XLRI', 'management', 'national', 7,
 '[{"tier":"Single Exam","q":101,"marks":101,"time":195}]',
 'annual', true, null),

('snap', 'Symbiosis National Aptitude Test', 'SNAP', 'SIU', 'management', 'private', 7,
 '[{"tier":"Single Exam","q":60,"marks":60,"time":60}]',
 'annual', true, null),

('iift', 'Indian Institute of Foreign Trade MBA', 'IIFT', 'NTA', 'management', 'national', 7,
 '[{"tier":"Single Exam","q":110,"marks":300,"time":120}]',
 'annual', true, null),

('nmat', 'NMIMS Management Aptitude Test', 'NMAT', 'NMIMS', 'management', 'private', 7,
 '[{"tier":"Single Exam","q":108,"marks":108,"time":120}]',
 'annual', false, null),

('cmat', 'Common Management Admission Test', 'CMAT', 'NTA', 'management', 'national', 7,
 '[{"tier":"Single Exam","q":100,"marks":400,"time":180}]',
 'annual', true, null),

-- ══════════════════════════════
-- SSC EXAMS (L6)
-- ══════════════════════════════
('ssc_cgl', 'SSC Combined Graduate Level', 'SSC CGL', 'SSC', 'government', 'central', 7,
 '[{"tier":"Tier 1","q":100,"marks":200,"time":60,"negative":-0.5},{"tier":"Tier 2 Paper 1","q":130,"marks":390,"time":135,"negative":-1},{"tier":"Tier 2 Paper 2","q":200,"marks":200,"time":120,"negative":-0.25}]',
 'annual', true, null),

('ssc_chsl', 'SSC Combined Higher Secondary Level', 'SSC CHSL', 'SSC', 'government', 'central', 6,
 '[{"tier":"Tier 1","q":100,"marks":200,"time":60,"negative":-0.5},{"tier":"Tier 2","q":100,"marks":200,"time":60}]',
 'annual', true, null),

('ssc_mts', 'SSC Multi Tasking Staff', 'SSC MTS', 'SSC', 'government', 'central', 5,
 '[{"tier":"Paper 1","q":90,"marks":150,"time":90},{"tier":"Paper 2 Descriptive","q":2,"marks":50,"time":30}]',
 'annual', false, null),

('ssc_gd', 'SSC General Duty Constable', 'SSC GD', 'SSC', 'government', 'defence', 5,
 '[{"tier":"CBT","q":80,"marks":160,"time":60},{"tier":"PET/PST","q":0,"marks":0,"time":0},{"tier":"Medical","q":0,"marks":0,"time":0}]',
 'annual', true, null),

('ssc_cpo', 'SSC Central Police Organisation', 'SSC CPO', 'SSC', 'government', 'police', 6,
 '[{"tier":"Paper 1","q":200,"marks":200,"time":120},{"tier":"PET/Medical","q":0,"marks":0,"time":0},{"tier":"Paper 2","q":200,"marks":200,"time":120}]',
 'annual', true, null),

('ssc_je', 'SSC Junior Engineer', 'SSC JE', 'SSC', 'government', 'technical', 7,
 '[{"tier":"Paper 1","q":200,"marks":200,"time":120},{"tier":"Paper 2 Descriptive","q":0,"marks":300,"time":180}]',
 'annual', true, null),

('ssc_steno', 'SSC Stenographer', 'SSC Steno', 'SSC', 'government', 'central', 6,
 '[{"tier":"CBT","q":200,"marks":200,"time":120},{"tier":"Skill Test Typing","q":0,"marks":0,"time":0}]',
 'annual', true, null),

-- ══════════════════════════════
-- BANKING EXAMS (L6-L7)
-- ══════════════════════════════
('ibps_po', 'IBPS Probationary Officer', 'IBPS PO', 'IBPS', 'banking', 'public', 7,
 '[{"tier":"Prelims","q":100,"marks":100,"time":60,"sectional":true},{"tier":"Mains","q":155,"marks":200,"time":180},{"tier":"Interview","q":0,"marks":100,"time":0}]',
 'annual', true, null),

('ibps_clerk', 'IBPS Clerk', 'IBPS Clerk', 'IBPS', 'banking', 'public', 7,
 '[{"tier":"Prelims","q":100,"marks":100,"time":60},{"tier":"Mains","q":190,"marks":200,"time":160}]',
 'annual', true, null),

('ibps_so', 'IBPS Specialist Officer', 'IBPS SO', 'IBPS', 'banking', 'specialist', 7,
 '[{"tier":"Prelims","q":150,"marks":125,"time":120},{"tier":"Mains","q":60,"marks":60,"time":45},{"tier":"Interview","q":0,"marks":100,"time":0}]',
 'annual', true, null),

('ibps_rrb_po', 'IBPS RRB Officer Scale 1', 'IBPS RRB PO', 'IBPS', 'banking', 'rural', 7,
 '[{"tier":"Prelims","q":80,"marks":80,"time":45},{"tier":"Mains","q":200,"marks":200,"time":120}]',
 'annual', true, null),

('ibps_rrb_clerk', 'IBPS RRB Office Assistant', 'IBPS RRB Clerk', 'IBPS', 'banking', 'rural', 6,
 '[{"tier":"Prelims","q":80,"marks":80,"time":45},{"tier":"Mains","q":200,"marks":200,"time":120}]',
 'annual', true, null),

('sbi_po', 'SBI Probationary Officer', 'SBI PO', 'SBI', 'banking', 'public', 7,
 '[{"tier":"Prelims","q":100,"marks":100,"time":60},{"tier":"Mains","q":155,"marks":250,"time":180},{"tier":"GD+Interview","q":0,"marks":50,"time":0}]',
 'annual', true, null),

('sbi_clerk', 'SBI Junior Associate', 'SBI Clerk', 'SBI', 'banking', 'public', 6,
 '[{"tier":"Prelims","q":100,"marks":100,"time":60},{"tier":"Mains","q":190,"marks":200,"time":160}]',
 'annual', true, null),

('rbi_grade_b', 'RBI Grade B Officer', 'RBI Grade B', 'RBI', 'banking', 'premium', 7,
 '[{"tier":"Phase 1","q":200,"marks":200,"time":120},{"tier":"Phase 2 Paper 1","q":100,"marks":100,"time":90},{"tier":"Phase 2 Paper 2 Descriptive","q":6,"marks":100,"time":90},{"tier":"Interview","q":0,"marks":50,"time":0}]',
 'annual', true, null),

('rbi_assistant', 'RBI Assistant', 'RBI Asst', 'RBI', 'banking', 'clerical', 6,
 '[{"tier":"Prelims","q":100,"marks":100,"time":60},{"tier":"Mains","q":200,"marks":200,"time":135}]',
 'annual', true, null),

('nabard_grade_a', 'NABARD Grade A', 'NABARD A', 'NABARD', 'banking', 'development', 7,
 '[{"tier":"Phase 1 Online","q":200,"marks":200,"time":120},{"tier":"Phase 2 Descriptive","q":0,"marks":100,"time":90},{"tier":"Interview","q":0,"marks":25,"time":0}]',
 'annual', true, null),

-- ══════════════════════════════
-- RAILWAYS (L5-L7)
-- ══════════════════════════════
('rrb_ntpc', 'RRB Non Technical Popular Categories', 'RRB NTPC', 'RRB', 'railway', 'non_technical', 6,
 '[{"tier":"CBT 1","q":100,"marks":100,"time":90,"negative":-0.33},{"tier":"CBT 2","q":120,"marks":120,"time":90,"negative":-0.33},{"tier":"Skill Test","q":0,"marks":0,"time":0}]',
 'irregular', true, null),

('rrb_group_d', 'RRB Group D', 'RRB Group D', 'RRB', 'railway', 'group_d', 5,
 '[{"tier":"CBT","q":100,"marks":100,"time":90,"negative":-0.33},{"tier":"PET","q":0,"marks":0,"time":0},{"tier":"Medical","q":0,"marks":0,"time":0}]',
 'irregular', true, null),

('rrb_alp', 'RRB Assistant Loco Pilot', 'RRB ALP', 'RRB', 'railway', 'technical', 6,
 '[{"tier":"CBT 1","q":75,"marks":75,"time":60,"negative":-0.33},{"tier":"CBT 2 PartA","q":100,"marks":100,"time":90},{"tier":"CBT 2 PartB","q":75,"marks":75,"time":60},{"tier":"CBAT","q":0,"marks":0,"time":0}]',
 'irregular', true, null),

('rrb_je', 'RRB Junior Engineer', 'RRB JE', 'RRB', 'railway', 'technical', 7,
 '[{"tier":"CBT 1","q":100,"marks":100,"time":90,"negative":-0.33},{"tier":"CBT 2","q":150,"marks":150,"time":120,"negative":-0.33},{"tier":"Document Verification","q":0,"marks":0,"time":0}]',
 'irregular', true, null),

('rrb_paramedical', 'RRB Paramedical', 'RRB Para', 'RRB', 'railway', 'medical', 7,
 '[{"tier":"CBT","q":100,"marks":100,"time":90,"negative":-0.33}]',
 'irregular', true, null),

-- ══════════════════════════════
-- DEFENCE (L5-L7)
-- ══════════════════════════════
('nda', 'National Defence Academy', 'NDA', 'UPSC', 'defence', 'armed_forces', 6,
 '[{"tier":"Paper 1 Math","q":120,"marks":300,"time":150,"negative":-0.83},{"tier":"Paper 2 GAT","q":150,"marks":600,"time":150,"negative":-1.33},{"tier":"SSB Interview","q":0,"marks":900,"time":0}]',
 'biannual', true, null),

('cds', 'Combined Defence Services', 'CDS', 'UPSC', 'defence', 'officer', 7,
 '[{"tier":"Written IMA/INA/AFA","q":300,"marks":300,"time":360,"negative":-0.33},{"tier":"Written OTA","q":200,"marks":200,"time":240,"negative":-0.33},{"tier":"SSB","q":0,"marks":300,"time":0}]',
 'biannual', true, null),

('afcat', 'Air Force Common Admission Test', 'AFCAT', 'IAF', 'defence', 'air_force', 7,
 '[{"tier":"Online Test","q":100,"marks":300,"time":120,"negative":-1},{"tier":"AFSB","q":0,"marks":0,"time":0}]',
 'biannual', true, null),

('capf', 'Central Armed Police Forces', 'CAPF AC', 'UPSC', 'defence', 'police', 7,
 '[{"tier":"Paper 1","q":125,"marks":250,"time":120,"negative":-0.83},{"tier":"Paper 2 Descriptive","q":6,"marks":200,"time":180},{"tier":"Interview","q":0,"marks":150,"time":0}]',
 'annual', true, null),

-- ══════════════════════════════
-- CIVIL SERVICES (L7-L9)
-- ══════════════════════════════
('upsc_cse', 'UPSC Civil Services Examination', 'UPSC CSE', 'UPSC', 'civil_services', 'national', 7,
 '[{"tier":"Prelims GS","q":100,"marks":200,"time":120,"negative":-0.66},{"tier":"Prelims CSAT","q":80,"marks":200,"time":120,"qualifying":true},{"tier":"Mains GS1","q":20,"marks":250,"time":180},{"tier":"Mains GS2","q":20,"marks":250,"time":180},{"tier":"Mains GS3","q":20,"marks":250,"time":180},{"tier":"Mains GS4","q":20,"marks":250,"time":180},{"tier":"Mains Essay","q":2,"marks":250,"time":180},{"tier":"Optional Paper 1","q":8,"marks":250,"time":180},{"tier":"Optional Paper 2","q":8,"marks":250,"time":180},{"tier":"Interview","q":0,"marks":275,"time":0}]',
 'annual', true, null),

('upsc_ifs', 'UPSC Indian Forest Service', 'UPSC IFS', 'UPSC', 'civil_services', 'national', 7,
 '[{"tier":"Prelims (shared with CSE)","q":100,"marks":200,"time":120},{"tier":"Mains GS","q":20,"marks":300,"time":180},{"tier":"Optional 1 Paper 1","q":8,"marks":200,"time":180},{"tier":"Optional 1 Paper 2","q":8,"marks":200,"time":180},{"tier":"Optional 2 Paper 1","q":8,"marks":200,"time":180},{"tier":"Optional 2 Paper 2","q":8,"marks":200,"time":180},{"tier":"Interview","q":0,"marks":200,"time":0}]',
 'annual', true, null),

-- STATE PSC EXAMS
('tnpsc_group1', 'TNPSC Group 1', 'TNPSC Gr1', 'TNPSC', 'civil_services', 'state', 7,
 '[{"tier":"Prelims","q":200,"marks":200,"time":180},{"tier":"Mains Paper 1 Essay","q":2,"marks":250,"time":180},{"tier":"Mains Paper 2 GS","q":10,"marks":250,"time":180},{"tier":"Mains Paper 3 Aptitude","q":200,"marks":200,"time":180},{"tier":"Mains Paper 4 Optional","q":8,"marks":250,"time":180},{"tier":"Interview","q":0,"marks":120,"time":0}]',
 'irregular', false, 'Tamil Nadu'),

('tnpsc_group2', 'TNPSC Group 2', 'TNPSC Gr2', 'TNPSC', 'civil_services', 'state', 6,
 '[{"tier":"Prelims","q":200,"marks":200,"time":180},{"tier":"Mains GS","q":6,"marks":250,"time":180},{"tier":"Mains Aptitude","q":200,"marks":200,"time":180}]',
 'irregular', false, 'Tamil Nadu'),

('tnpsc_group4', 'TNPSC Group 4 VAO', 'TNPSC Gr4', 'TNPSC', 'civil_services', 'state', 6,
 '[{"tier":"Single Exam","q":200,"marks":200,"time":180}]',
 'irregular', false, 'Tamil Nadu'),

('mpsc', 'Maharashtra PSC', 'MPSC', 'MPSC', 'civil_services', 'state', 7,
 '[{"tier":"Prelims","q":200,"marks":400,"time":240,"negative":-1},{"tier":"Mains Paper 1 Marathi","q":6,"marks":100,"time":180},{"tier":"Mains Paper 2 English","q":6,"marks":100,"time":180},{"tier":"Mains Paper 3-6 GS","q":24,"marks":400,"time":720},{"tier":"Interview","q":0,"marks":75,"time":0}]',
 'annual', true, 'Maharashtra'),

('uppsc', 'UP PSC PCS', 'UPPSC', 'UPPSC', 'civil_services', 'state', 7,
 '[{"tier":"Prelims Paper 1","q":150,"marks":200,"time":120,"negative":-0.33},{"tier":"Prelims Paper 2 CSAT","q":100,"marks":200,"time":120,"qualifying":true},{"tier":"Mains GS1-4","q":80,"marks":800,"time":720},{"tier":"Mains Hindi Essay","q":2,"marks":150,"time":180},{"tier":"Mains Optional 1","q":8,"marks":200,"time":180},{"tier":"Mains Optional 2","q":8,"marks":200,"time":180},{"tier":"Interview","q":0,"marks":100,"time":0}]',
 'annual', true, 'Uttar Pradesh'),

('kpsc', 'Karnataka PSC KAS', 'KPSC KAS', 'KPSC', 'civil_services', 'state', 7,
 '[{"tier":"Prelims","q":150,"marks":300,"time":150,"negative":-0.25},{"tier":"Mains Paper 1-6","q":0,"marks":1200,"time":1080},{"tier":"Interview","q":0,"marks":150,"time":0}]',
 'annual', true, 'Karnataka'),

('appsc', 'Andhra Pradesh PSC', 'APPSC', 'APPSC', 'civil_services', 'state', 7,
 '[{"tier":"Prelims","q":150,"marks":150,"time":150},{"tier":"Mains Paper 1-4","q":0,"marks":1200,"time":720},{"tier":"Interview","q":0,"marks":75,"time":0}]',
 'annual', false, 'Andhra Pradesh'),

('tspsc', 'Telangana PSC', 'TSPSC', 'TSPSC', 'civil_services', 'state', 7,
 '[{"tier":"Prelims","q":150,"marks":150,"time":150},{"tier":"Mains Paper 1-4","q":0,"marks":1200,"time":720}]',
 'annual', false, 'Telangana'),

('bpsc', 'Bihar PSC', 'BPSC', 'BPSC', 'civil_services', 'state', 7,
 '[{"tier":"Prelims","q":150,"marks":150,"time":120},{"tier":"Mains GS1-3","q":0,"marks":900,"time":540},{"tier":"Optional","q":0,"marks":300,"time":180},{"tier":"Interview","q":0,"marks":120,"time":0}]',
 'annual', false, 'Bihar'),

('rpsc', 'Rajasthan PSC RAS', 'RPSC RAS', 'RPSC', 'civil_services', 'state', 7,
 '[{"tier":"Prelims","q":200,"marks":200,"time":180,"negative":-0.33},{"tier":"Mains Paper 1-4","q":0,"marks":800,"time":720},{"tier":"Interview","q":0,"marks":100,"time":0}]',
 'annual', true, 'Rajasthan'),

-- ══════════════════════════════
-- TEACHING EXAMS (L6-L7)
-- ══════════════════════════════
('ctet', 'Central Teacher Eligibility Test', 'CTET', 'CBSE', 'teaching', 'central', 7,
 '[{"tier":"Paper 1 Primary","q":150,"marks":150,"time":150},{"tier":"Paper 2 Upper Primary","q":150,"marks":150,"time":150}]',
 'biannual', false, null),

('tet_tn', 'Tamil Nadu TET', 'TN TET', 'TRBT', 'teaching', 'state', 7,
 '[{"tier":"Paper 1","q":150,"marks":150,"time":150},{"tier":"Paper 2","q":150,"marks":150,"time":150}]',
 'annual', false, 'Tamil Nadu'),

('dsssb_tgt', 'DSSSB Trained Graduate Teacher', 'DSSSB TGT', 'DSSSB', 'teaching', 'central', 7,
 '[{"tier":"Tier 1","q":200,"marks":200,"time":120,"negative":-0.25},{"tier":"Tier 2","q":200,"marks":200,"time":120,"negative":-0.25}]',
 'irregular', true, 'Delhi'),

('kvs_tgt', 'KVS Trained Graduate Teacher', 'KVS TGT', 'KVS', 'teaching', 'central', 7,
 '[{"tier":"Written Test","q":180,"marks":180,"time":180,"negative":-0.25},{"tier":"Interview","q":0,"marks":60,"time":0}]',
 'annual', true, null),

('nvs_tgt', 'NVS Trained Graduate Teacher', 'NVS TGT', 'NVS', 'teaching', 'central', 7,
 '[{"tier":"CBT","q":100,"marks":100,"time":120},{"tier":"Demo+Interview","q":0,"marks":0,"time":0}]',
 'annual', false, null),

-- ══════════════════════════════
-- INSURANCE (L6-L7)
-- ══════════════════════════════
('lic_aao', 'LIC Assistant Administrative Officer', 'LIC AAO', 'LIC', 'insurance', 'public', 7,
 '[{"tier":"Prelims","q":105,"marks":105,"time":60},{"tier":"Mains","q":120,"marks":300,"time":120},{"tier":"Interview","q":0,"marks":60,"time":0}]',
 'annual', true, null),

('lic_ado', 'LIC Apprentice Development Officer', 'LIC ADO', 'LIC', 'insurance', 'public', 6,
 '[{"tier":"Prelims","q":100,"marks":100,"time":60},{"tier":"Mains","q":100,"marks":100,"time":120}]',
 'annual', true, null),

('niacl_ao', 'New India Assurance Company AO', 'NIACL AO', 'NIACL', 'insurance', 'public', 7,
 '[{"tier":"Prelims","q":100,"marks":100,"time":60},{"tier":"Mains","q":150,"marks":150,"time":120},{"tier":"Interview","q":0,"marks":35,"time":0}]',
 'irregular', true, null),

-- ══════════════════════════════
-- NET/JRF (L8-L9)
-- ══════════════════════════════
('ugc_net', 'UGC National Eligibility Test', 'UGC NET', 'NTA', 'academic', 'teaching_research', 8,
 '[{"tier":"Paper 1","q":50,"marks":100,"time":60},{"tier":"Paper 2 Subject","q":100,"marks":200,"time":120}]',
 'biannual', false, null),

('csir_net', 'CSIR UGC NET Science', 'CSIR NET', 'NTA', 'academic', 'research', 8,
 '[{"tier":"Single Paper 3hrs","q":200,"marks":200,"time":180}]',
 'biannual', true, null),

-- ══════════════════════════════
-- SENIOR CITIZEN / MATURE AGE
-- ══════════════════════════════
('reet', 'Rajasthan Eligibility Examination Teaching', 'REET', 'RBSE', 'teaching', 'state', 6,
 '[{"tier":"Level 1","q":150,"marks":150,"time":150},{"tier":"Level 2","q":150,"marks":150,"time":150}]',
 'irregular', false, 'Rajasthan'),

('up_tgt_pgt', 'UP TGT PGT', 'UP TGT/PGT', 'UPSESSB', 'teaching', 'state', 7,
 '[{"tier":"TGT Written","q":125,"marks":500,"time":120},{"tier":"PGT Written","q":125,"marks":500,"time":120}]',
 'annual', true, 'Uttar Pradesh');

-- COUNT VERIFICATION
SELECT COUNT(*) as total_exams FROM exams;
