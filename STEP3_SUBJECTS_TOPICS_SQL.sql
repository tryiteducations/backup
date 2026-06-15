-- ═══════════════════════════════════════════════════════
-- STEP 3: SUBJECTS AND TOPICS MASTER TABLE
-- Copyright-safe approach: Topics are universal knowledge
-- We generate ORIGINAL questions inspired by concepts
-- Never copy from textbooks word-for-word
-- ═══════════════════════════════════════════════════════

-- SUBJECTS
INSERT INTO subjects (id, name, category, parent_id) VALUES
('maths', 'Mathematics', 'core', null),
('maths_arithmetic', 'Arithmetic', 'core', 'maths'),
('maths_algebra', 'Algebra', 'core', 'maths'),
('maths_geometry', 'Geometry', 'core', 'maths'),
('maths_mensuration', 'Mensuration', 'core', 'maths'),
('maths_trigonometry', 'Trigonometry', 'core', 'maths'),
('maths_statistics', 'Statistics and Probability', 'core', 'maths'),
('maths_calculus', 'Calculus', 'advanced', 'maths'),
('maths_linear_algebra', 'Linear Algebra', 'advanced', 'maths'),
('maths_discrete', 'Discrete Mathematics', 'advanced', 'maths'),

('english', 'English Language', 'core', null),
('english_grammar', 'Grammar', 'core', 'english'),
('english_vocab', 'Vocabulary', 'core', 'english'),
('english_reading', 'Reading Comprehension', 'core', 'english'),
('english_writing', 'Writing Skills', 'core', 'english'),
('english_verbal', 'Verbal Reasoning', 'core', 'english'),

('reasoning', 'Logical Reasoning', 'core', null),
('reasoning_verbal', 'Verbal Reasoning', 'core', 'reasoning'),
('reasoning_nonverbal', 'Non-Verbal Reasoning', 'core', 'reasoning'),
('reasoning_analytical', 'Analytical Reasoning', 'core', 'reasoning'),
('reasoning_critical', 'Critical Thinking', 'advanced', 'reasoning'),

('gk', 'General Knowledge', 'core', null),
('history', 'History', 'core', 'gk'),
('history_ancient', 'Ancient India', 'core', 'history'),
('history_medieval', 'Medieval India', 'core', 'history'),
('history_modern', 'Modern India', 'core', 'history'),
('history_world', 'World History', 'core', 'history'),

('geography', 'Geography', 'core', 'gk'),
('geo_physical', 'Physical Geography', 'core', 'geography'),
('geo_india', 'Indian Geography', 'core', 'geography'),
('geo_world', 'World Geography', 'core', 'geography'),
('geo_environment', 'Environment and Ecology', 'core', 'geography'),

('polity', 'Indian Polity and Constitution', 'core', 'gk'),
('economy', 'Indian Economy', 'core', 'gk'),
('science_general', 'General Science', 'core', 'gk'),
('current_affairs', 'Current Affairs', 'core', 'gk'),

('physics', 'Physics', 'science', null),
('chemistry', 'Chemistry', 'science', null),
('biology', 'Biology', 'science', null),
('bio_botany', 'Botany', 'science', 'biology'),
('bio_zoology', 'Zoology', 'science', 'biology'),

('legal', 'Legal Knowledge', 'professional', null),
('legal_constitution', 'Constitutional Law', 'professional', 'legal'),
('legal_torts', 'Law of Torts', 'professional', 'legal'),
('legal_contract', 'Contract Law', 'professional', 'legal'),
('legal_criminal', 'Criminal Law', 'professional', 'legal'),
('legal_reasoning', 'Legal Reasoning', 'professional', 'legal'),

('banking_awareness', 'Banking and Finance Awareness', 'professional', null),
('computer_awareness', 'Computer Awareness', 'core', null),

('tamil', 'Tamil Language and Literature', 'regional', null),
('tamil_grammar', 'Tamil Grammar', 'regional', 'tamil'),
('tamil_literature', 'Tamil Literature', 'regional', 'tamil'),
('tn_studies', 'Tamil Nadu Studies', 'regional', null);

-- TOPICS (most important - what questions map to)
INSERT INTO topics (id, subject_id, name, parent_topic_id, level_range, copyright_safe_notes) VALUES

-- ARITHMETIC TOPICS
('arith_number_system', 'maths_arithmetic', 'Number System', null, '[3,8]',
 'Generate original word problems using Indian market scenarios. Never copy NCERT examples.'),

('arith_hcf_lcm', 'maths_arithmetic', 'HCF and LCM', null, '[3,7]',
 'Create problems with original numbers. Use Indian context like school schedules, market days.'),

('arith_percentage', 'maths_arithmetic', 'Percentage', null, '[2,8]',
 'Original problems only. Use Indian prices, population data, election results as context.'),

('arith_percentage_basic', 'maths_arithmetic', 'Basic Percentage', 'arith_percentage', '[2,5]', null),
('arith_percentage_change', 'maths_arithmetic', 'Percentage Change', 'arith_percentage', '[4,7]', null),
('arith_percentage_successive', 'maths_arithmetic', 'Successive Percentage', 'arith_percentage', '[5,8]', null),
('arith_percentage_di', 'maths_arithmetic', 'Percentage in DI', 'arith_percentage', '[6,9]', null),

('arith_profit_loss', 'maths_arithmetic', 'Profit Loss and Discount', null, '[3,8]',
 'Use Indian shop names, Indian goods, Indian currency. Original scenarios only.'),

('arith_profit_basic', 'maths_arithmetic', 'Basic Profit and Loss', 'arith_profit_loss', '[3,6]', null),
('arith_profit_discount', 'maths_arithmetic', 'Discount and Marked Price', 'arith_profit_loss', '[5,7]', null),
('arith_profit_dishonest', 'maths_arithmetic', 'Dishonest Dealings', 'arith_profit_loss', '[5,7]', null),
('arith_profit_partnership', 'maths_arithmetic', 'Partnership', 'arith_profit_loss', '[6,8]', null),

('arith_si', 'maths_arithmetic', 'Simple Interest', null, '[4,7]', null),
('arith_ci', 'maths_arithmetic', 'Compound Interest', null, '[5,8]', null),
('arith_ratio', 'maths_arithmetic', 'Ratio and Proportion', null, '[3,7]', null),
('arith_average', 'maths_arithmetic', 'Average', null, '[3,7]', null),
('arith_tsd', 'maths_arithmetic', 'Time Speed Distance', null, '[4,8]', null),
('arith_tsd_trains', 'maths_arithmetic', 'Trains Problems', 'arith_tsd', '[5,7]', null),
('arith_tsd_boats', 'maths_arithmetic', 'Boats and Streams', 'arith_tsd', '[5,7]', null),
('arith_tsd_circular', 'maths_arithmetic', 'Circular Motion', 'arith_tsd', '[6,8]', null),
('arith_time_work', 'maths_arithmetic', 'Time and Work', null, '[4,8]', null),
('arith_pipes', 'maths_arithmetic', 'Pipes and Cisterns', 'arith_time_work', '[5,7]', null),
('arith_mixture', 'maths_arithmetic', 'Mixture and Alligation', null, '[5,8]', null),
('arith_age', 'maths_arithmetic', 'Problems on Ages', null, '[4,7]', null),

-- DATA INTERPRETATION
('di_table', 'maths_statistics', 'Table DI', null, '[5,9]',
 'Create completely original data tables. Never copy published statistics.'),
('di_bar', 'maths_statistics', 'Bar Chart DI', null, '[5,9]', 'Generate original chart data.'),
('di_pie', 'maths_statistics', 'Pie Chart DI', null, '[5,9]', null),
('di_line', 'maths_statistics', 'Line Graph DI', null, '[6,9]', null),
('di_caselet', 'maths_statistics', 'Caselet DI', null, '[6,9]', null),
('di_mixed', 'maths_statistics', 'Mixed DI', null, '[7,10]', null),

-- REASONING TOPICS
('reason_analogy', 'reasoning_verbal', 'Analogy', null, '[3,8]', null),
('reason_series_number', 'reasoning_verbal', 'Number Series', null, '[3,8]', null),
('reason_series_letter', 'reasoning_verbal', 'Letter Series', null, '[3,7]', null),
('reason_coding', 'reasoning_verbal', 'Coding Decoding', null, '[4,8]', null),
('reason_blood', 'reasoning_verbal', 'Blood Relations', null, '[4,7]', null),
('reason_direction', 'reasoning_verbal', 'Direction and Distance', null, '[4,7]', null),
('reason_syllogism', 'reasoning_verbal', 'Syllogism', null, '[5,8]', null),
('reason_statement_assumption', 'reasoning_verbal', 'Statement and Assumptions', null, '[5,8]', null),
('reason_statement_conclusion', 'reasoning_verbal', 'Statement and Conclusions', null, '[5,8]', null),
('reason_cause_effect', 'reasoning_verbal', 'Cause and Effect', null, '[5,8]', null),
('reason_seating', 'reasoning_analytical', 'Seating Arrangement', null, '[5,8]', null),
('reason_puzzles', 'reasoning_analytical', 'Puzzles', null, '[5,9]', null),
('reason_input_output', 'reasoning_analytical', 'Input Output', null, '[5,8]', null),
('reason_matrix', 'reasoning_nonverbal', 'Matrix and Figure', null, '[4,7]', null),
('reason_mirror', 'reasoning_nonverbal', 'Mirror Image', null, '[4,7]', null),

-- ENGLISH TOPICS
('eng_error_spotting', 'english_grammar', 'Error Spotting', null, '[4,8]', null),
('eng_fill_blanks', 'english_grammar', 'Fill in the Blanks', null, '[4,8]', null),
('eng_active_passive', 'english_grammar', 'Active and Passive Voice', null, '[4,7]', null),
('eng_direct_indirect', 'english_grammar', 'Direct and Indirect Speech', null, '[4,7]', null),
('eng_synonyms', 'english_vocab', 'Synonyms', null, '[4,8]', null),
('eng_antonyms', 'english_vocab', 'Antonyms', null, '[4,8]', null),
('eng_one_word', 'english_vocab', 'One Word Substitution', null, '[5,8]', null),
('eng_idioms', 'english_vocab', 'Idioms and Phrases', null, '[5,8]', null),
('eng_rc_main_idea', 'english_reading', 'Main Idea of Passage', null, '[4,9]',
 'Generate original passages on Indian themes. Never copy published text.'),
('eng_rc_inference', 'english_reading', 'Inference from Passage', null, '[5,9]', null),
('eng_para_jumble', 'english_verbal', 'Para Jumbles', null, '[5,8]', null),
('eng_sentence_imp', 'english_verbal', 'Sentence Improvement', null, '[5,8]', null),
('eng_cloze_test', 'english_verbal', 'Cloze Test', null, '[5,8]', null),

-- HISTORY TOPICS
('hist_indus_valley', 'history_ancient', 'Indus Valley Civilisation', null, '[4,9]',
 'Use archaeological findings as factual basis. Generate original analytical questions.'),
('hist_vedic', 'history_ancient', 'Vedic Period', null, '[4,9]', null),
('hist_maurya', 'history_ancient', 'Mauryan Empire', null, '[4,9]', null),
('hist_gupta', 'history_ancient', 'Gupta Empire', null, '[4,9]', null),
('hist_sangam', 'history_ancient', 'Sangam Period Tamil', null, '[4,9]', null),

('hist_delhi_sultanate', 'history_medieval', 'Delhi Sultanate', null, '[4,9]', null),
('hist_mughal', 'history_medieval', 'Mughal Empire', null, '[4,9]', null),
('hist_vijayanagara', 'history_medieval', 'Vijayanagara Empire', null, '[4,9]', null),
('hist_marathas', 'history_medieval', 'Maratha Empire', null, '[4,9]', null),
('hist_bhakti_sufi', 'history_medieval', 'Bhakti and Sufi Movements', null, '[4,9]', null),

('hist_1857', 'history_modern', '1857 Revolt', null, '[4,9]', null),
('hist_socio_religious', 'history_modern', 'Socio-Religious Reform Movements', null, '[5,9]', null),
('hist_congress', 'history_modern', 'Indian National Congress', null, '[5,9]', null),
('hist_gandhi', 'history_modern', 'Gandhian Era and Movements', null, '[5,9]', null),
('hist_quit_india', 'history_modern', 'Quit India and Independence', null, '[5,9]', null),
('hist_partition', 'history_modern', 'Partition and Integration', null, '[5,9]', null),
('hist_dravidian', 'tn_studies', 'Dravidian Movement Tamil Nadu', null, '[5,9]', null),

-- POLITY TOPICS
('pol_preamble', 'polity', 'Preamble of Constitution', null, '[4,9]', null),
('pol_fundamental_rights', 'polity', 'Fundamental Rights', null, '[5,9]', null),
('pol_dpsp', 'polity', 'Directive Principles', null, '[5,9]', null),
('pol_fundamental_duties', 'polity', 'Fundamental Duties', null, '[5,9]', null),
('pol_parliament', 'polity', 'Parliament and Legislature', null, '[5,9]', null),
('pol_executive', 'polity', 'Executive President PM Cabinet', null, '[5,9]', null),
('pol_judiciary', 'polity', 'Judiciary Supreme Court HC', null, '[5,9]', null),
('pol_federalism', 'polity', 'Centre State Relations Federalism', null, '[5,9]', null),
('pol_amendments', 'polity', 'Constitutional Amendments', null, '[6,9]', null),
('pol_emergency', 'polity', 'Emergency Provisions', null, '[5,9]', null),
('pol_local_self', 'polity', 'Local Self Government Panchayati Raj', null, '[5,8]', null),
('pol_election', 'polity', 'Election Commission and Electoral Process', null, '[5,9]', null),

-- ECONOMY TOPICS
('eco_basic', 'economy', 'Basic Economic Concepts', null, '[4,8]', null),
('eco_indian', 'economy', 'Indian Economy Overview', null, '[5,9]', null),
('eco_planning', 'economy', 'Economic Planning and NITI Aayog', null, '[5,9]', null),
('eco_banking', 'economy', 'Banking System RBI', null, '[5,9]', null),
('eco_budget', 'economy', 'Union Budget and Taxation', null, '[5,9]', null),
('eco_trade', 'economy', 'International Trade and WTO', null, '[6,9]', null),
('eco_agriculture', 'economy', 'Agriculture and Rural Economy', null, '[5,9]', null),
('eco_industry', 'economy', 'Industry and Infrastructure', null, '[5,9]', null),

-- SCIENCE TOPICS
('sci_physics_motion', 'physics', 'Laws of Motion', null, '[4,8]', null),
('sci_physics_electricity', 'physics', 'Electricity and Magnetism', null, '[4,8]', null),
('sci_physics_light', 'physics', 'Optics and Light', null, '[4,8]', null),
('sci_physics_waves', 'physics', 'Waves and Sound', null, '[4,8]', null),
('sci_physics_modern', 'physics', 'Modern Physics Atomic Nuclear', null, '[6,10]', null),

('sci_chem_elements', 'chemistry', 'Elements and Periodic Table', null, '[4,9]', null),
('sci_chem_bonds', 'chemistry', 'Chemical Bonding', null, '[5,9]', null),
('sci_chem_reactions', 'chemistry', 'Chemical Reactions', null, '[4,8]', null),
('sci_chem_acids', 'chemistry', 'Acids Bases and Salts', null, '[3,8]', null),
('sci_chem_organic', 'chemistry', 'Organic Chemistry', null, '[6,10]', null),

('sci_bio_cell', 'biology', 'Cell Biology', null, '[4,9]', null),
('sci_bio_genetics', 'biology', 'Genetics and Heredity', null, '[5,9]', null),
('sci_bio_plant', 'bio_botany', 'Plant Physiology', null, '[4,9]', null),
('sci_bio_human', 'bio_zoology', 'Human Physiology', null, '[4,9]', null),
('sci_bio_ecology', 'bio_zoology', 'Ecology and Environment', null, '[4,9]', null),
('sci_bio_evolution', 'biology', 'Evolution and Classification', null, '[5,9]', null),

-- LEGAL TOPICS
('law_torts_negligence', 'legal_torts', 'Negligence in Torts', null, '[6,9]',
 'Generate principle-fact application scenarios. Never copy actual court judgments verbatim.'),
('law_torts_nuisance', 'legal_torts', 'Nuisance', null, '[6,9]', null),
('law_contract_offer', 'legal_contract', 'Offer and Acceptance', null, '[6,9]', null),
('law_contract_consideration', 'legal_contract', 'Consideration', null, '[6,9]', null),
('law_ipc_crimes', 'legal_criminal', 'IPC Crimes and Punishments', null, '[6,9]', null),
('law_constitution_rights', 'legal_constitution', 'Fundamental Rights Legal Aspects', null, '[6,9]', null),
('law_maxims', 'legal', 'Legal Maxims Latin', null, '[6,9]', null),

-- BANKING AWARENESS
('bank_rbi_functions', 'banking_awareness', 'RBI Functions and Policies', null, '[5,9]', null),
('bank_types', 'banking_awareness', 'Types of Banks and NBFCs', null, '[5,8]', null),
('bank_schemes', 'banking_awareness', 'Government Banking Schemes', null, '[5,8]', null),
('bank_digital', 'banking_awareness', 'Digital Banking and Payments', null, '[5,8]', null),
('bank_insurance', 'banking_awareness', 'Insurance Concepts', null, '[5,8]', null),
('bank_capital_market', 'banking_awareness', 'Capital Market SEBI', null, '[6,9]', null),

-- COMPUTER AWARENESS
('comp_basics', 'computer_awareness', 'Computer Fundamentals', null, '[3,8]', null),
('comp_ms_office', 'computer_awareness', 'MS Office Applications', null, '[4,7]', null),
('comp_internet', 'computer_awareness', 'Internet and Networking', null, '[4,8]', null),
('comp_security', 'computer_awareness', 'Cyber Security', null, '[5,8]', null),

-- TAMIL SPECIFIC
('tamil_grammar_sandhi', 'tamil_grammar', 'Tamil Sandhi Punarchi', null, '[3,8]', null),
('tamil_grammar_etthu', 'tamil_grammar', 'Etthu and Vinai', null, '[3,8]', null),
('tamil_literature_sangam', 'tamil_literature', 'Sangam Literature', null, '[4,9]', null),
('tamil_literature_thirukkural', 'tamil_literature', 'Thirukkural', null, '[4,9]', null),
('tn_geography', 'tn_studies', 'Tamil Nadu Geography Districts Rivers', null, '[4,9]', null),
('tn_govt_schemes', 'tn_studies', 'Tamil Nadu Government Schemes', null, '[5,8]', null),
('tn_culture', 'tn_studies', 'Tamil Nadu Culture and Festivals', null, '[4,8]', null);

SELECT COUNT(*) as total_topics FROM topics;
