-- ═══════════════════════════════════════════════════════
-- STEP 4: MAP EVERY EXAM TO TOPICS WITH EXACT WEIGHTAGE
-- This is the INTELLIGENCE LAYER
-- ═══════════════════════════════════════════════════════

-- SSC CGL TIER 1 WEIGHTAGE
INSERT INTO exam_topic_map (exam_id, tier, subject_id, topic_id, weightage_percent, question_count, marks, time_per_question_seconds, pattern_type, negative_marking) VALUES
('ssc_cgl','Tier 1','maths_arithmetic','arith_percentage', 12, 3, 6, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','maths_arithmetic','arith_profit_loss', 12, 3, 6, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','maths_arithmetic','arith_tsd', 12, 3, 6, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','maths_arithmetic','arith_time_work', 8, 2, 4, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','maths_arithmetic','arith_ratio', 8, 2, 4, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','maths_arithmetic','arith_average', 8, 2, 4, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','maths_arithmetic','arith_hcf_lcm', 8, 2, 4, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','maths_arithmetic','arith_number_system', 8, 2, 4, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','maths_arithmetic','arith_si', 4, 1, 2, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','maths_arithmetic','arith_ci', 4, 1, 2, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','maths_arithmetic','arith_mixture', 4, 1, 2, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','maths_arithmetic','arith_age', 4, 1, 2, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','maths_geometry','arith_percentage', 8, 2, 4, 72, 'mcq4', -0.5),

('ssc_cgl','Tier 1','reasoning_verbal','reason_analogy', 16, 4, 8, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','reasoning_verbal','reason_series_number', 12, 3, 6, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','reasoning_verbal','reason_coding', 12, 3, 6, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','reasoning_verbal','reason_blood', 8, 2, 4, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','reasoning_verbal','reason_direction', 8, 2, 4, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','reasoning_verbal','reason_syllogism', 8, 2, 4, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','reasoning_nonverbal','reason_matrix', 16, 4, 8, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','reasoning_analytical','reason_seating', 12, 3, 6, 72, 'mcq4', -0.5),

('ssc_cgl','Tier 1','english_grammar','eng_error_spotting', 16, 4, 8, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','english_vocab','eng_synonyms', 12, 3, 6, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','english_vocab','eng_antonyms', 12, 3, 6, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','english_vocab','eng_one_word', 8, 2, 4, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','english_vocab','eng_idioms', 8, 2, 4, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','english_reading','eng_rc_main_idea', 16, 4, 8, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','english_verbal','eng_para_jumble', 8, 2, 4, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','english_verbal','eng_sentence_imp', 8, 2, 4, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','english_verbal','eng_cloze_test', 8, 2, 4, 72, 'mcq4', -0.5),

('ssc_cgl','Tier 1','history','hist_modern', 20, 5, 10, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','geography','geo_india', 20, 5, 10, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','polity','pol_fundamental_rights', 20, 5, 10, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','economy','eco_indian', 12, 3, 6, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','science_general','sci_physics_electricity', 16, 4, 8, 72, 'mcq4', -0.5),
('ssc_cgl','Tier 1','current_affairs','hist_gandhi', 12, 3, 6, 72, 'mcq4', -0.5);

-- IBPS PO PRELIMS WEIGHTAGE
INSERT INTO exam_topic_map (exam_id, tier, subject_id, topic_id, weightage_percent, question_count, marks, time_per_question_seconds, pattern_type, negative_marking) VALUES
('ibps_po','Prelims','english_reading','eng_rc_main_idea', 33, 10, 10, 40, 'passage_mcq4', -0.25),
('ibps_po','Prelims','english_grammar','eng_error_spotting', 17, 5, 5, 40, 'mcq4', -0.25),
('ibps_po','Prelims','english_grammar','eng_fill_blanks', 17, 5, 5, 40, 'mcq4', -0.25),
('ibps_po','Prelims','english_verbal','eng_para_jumble', 17, 5, 5, 40, 'mcq4', -0.25),
('ibps_po','Prelims','maths_statistics','di_table', 43, 15, 15, 34, 'mcq4', -0.25),
('ibps_po','Prelims','maths_arithmetic','arith_percentage', 8, 3, 3, 34, 'mcq4', -0.25),
('ibps_po','Prelims','maths_arithmetic','arith_profit_loss', 6, 2, 2, 34, 'mcq4', -0.25),
('ibps_po','Prelims','maths_arithmetic','arith_ci', 6, 2, 2, 34, 'mcq4', -0.25),
('ibps_po','Prelims','maths_arithmetic','arith_tsd', 6, 2, 2, 34, 'mcq4', -0.25),
('ibps_po','Prelims','reasoning_analytical','reason_puzzles', 43, 15, 15, 34, 'mcq4', -0.25),
('ibps_po','Prelims','reasoning_verbal','reason_syllogism', 14, 5, 5, 34, 'mcq4', -0.25),
('ibps_po','Prelims','reasoning_analytical','reason_seating', 14, 5, 5, 34, 'mcq4', -0.25),
('ibps_po','Prelims','reasoning_verbal','reason_coding', 14, 5, 5, 34, 'mcq4', -0.25),
('ibps_po','Prelims','reasoning_verbal','reason_blood', 14, 5, 5, 34, 'mcq4', -0.25);

-- CLAT WEIGHTAGE (ALL passage based)
INSERT INTO exam_topic_map (exam_id, tier, subject_id, topic_id, weightage_percent, question_count, marks, time_per_question_seconds, pattern_type, negative_marking) VALUES
('clat','UG Program','english_reading','eng_rc_inference', 100, 28, 28, 48, 'passage_mcq4', -0.25),
('clat','UG Program','legal_reasoning','law_torts_negligence', 30, 10, 10, 48, 'passage_mcq4', -0.25),
('clat','UG Program','legal_reasoning','law_contract_offer', 30, 10, 10, 48, 'passage_mcq4', -0.25),
('clat','UG Program','legal_reasoning','law_constitution_rights', 40, 15, 15, 48, 'passage_mcq4', -0.25),
('clat','UG Program','reasoning_verbal','reason_statement_assumption', 50, 15, 15, 48, 'passage_mcq4', -0.25),
('clat','UG Program','reasoning_verbal','reason_statement_conclusion', 50, 15, 15, 48, 'passage_mcq4', -0.25),
('clat','UG Program','maths_arithmetic','arith_percentage', 25, 5, 5, 65, 'passage_mcq4', -0.25),
('clat','UG Program','maths_statistics','di_bar', 25, 6, 6, 65, 'passage_mcq4', -0.25),
('clat','UG Program','maths_statistics','di_pie', 25, 6, 6, 65, 'passage_mcq4', -0.25),
('clat','UG Program','current_affairs','pol_election', 100, 35, 35, 48, 'passage_mcq4', -0.25);

-- NEET UG WEIGHTAGE
INSERT INTO exam_topic_map (exam_id, tier, subject_id, topic_id, weightage_percent, question_count, marks, time_per_question_seconds, pattern_type, negative_marking) VALUES
('neet_ug','Single Exam','physics','sci_physics_motion', 15, 7, 28, 67, 'mcq4', -1),
('neet_ug','Single Exam','physics','sci_physics_electricity', 20, 10, 40, 67, 'mcq4', -1),
('neet_ug','Single Exam','physics','sci_physics_modern', 15, 8, 32, 67, 'mcq4', -1),
('neet_ug','Single Exam','physics','sci_physics_waves', 10, 5, 20, 67, 'mcq4', -1),
('neet_ug','Single Exam','chemistry','sci_chem_organic', 35, 12, 48, 67, 'mcq4', -1),
('neet_ug','Single Exam','chemistry','sci_chem_elements', 20, 7, 28, 67, 'mcq4', -1),
('neet_ug','Single Exam','chemistry','sci_chem_bonds', 20, 7, 28, 67, 'mcq4', -1),
('neet_ug','Single Exam','chemistry','sci_chem_reactions', 15, 5, 20, 67, 'mcq4', -1),
('neet_ug','Single Exam','bio_botany','sci_bio_plant', 30, 21, 84, 67, 'mcq4', -1),
('neet_ug','Single Exam','biology','sci_bio_cell', 20, 14, 56, 67, 'mcq4', -1),
('neet_ug','Single Exam','biology','sci_bio_genetics', 20, 14, 56, 67, 'mcq4', -1),
('neet_ug','Single Exam','bio_zoology','sci_bio_human', 30, 21, 84, 67, 'mcq4', -1);

-- UPSC CSE PRELIMS WEIGHTAGE
INSERT INTO exam_topic_map (exam_id, tier, subject_id, topic_id, weightage_percent, question_count, marks, time_per_question_seconds, pattern_type, negative_marking) VALUES
('upsc_cse','Prelims GS','history','hist_modern', 14, 14, 28, 72, 'mcq4', -0.66),
('upsc_cse','Prelims GS','history','hist_ancient', 5, 5, 10, 72, 'assertion_reason', -0.66),
('upsc_cse','Prelims GS','history','hist_medieval', 5, 5, 10, 72, 'match', -0.66),
('upsc_cse','Prelims GS','geography','geo_india', 8, 8, 16, 72, 'mcq4', -0.66),
('upsc_cse','Prelims GS','geography','geo_environment', 10, 10, 20, 72, 'statement_correct', -0.66),
('upsc_cse','Prelims GS','polity','pol_parliament', 8, 8, 16, 72, 'statement_correct', -0.66),
('upsc_cse','Prelims GS','polity','pol_fundamental_rights', 8, 8, 16, 72, 'mcq4', -0.66),
('upsc_cse','Prelims GS','economy','eco_indian', 12, 12, 24, 72, 'mcq4', -0.66),
('upsc_cse','Prelims GS','science_general','sci_bio_ecology', 10, 10, 20, 72, 'mcq4', -0.66),
('upsc_cse','Prelims GS','current_affairs','eco_banking', 20, 20, 40, 72, 'mcq4', -0.66);

-- TNPSC GROUP 1 PRELIMS (NO NEGATIVE MARKING!)
INSERT INTO exam_topic_map (exam_id, tier, subject_id, topic_id, weightage_percent, question_count, marks, time_per_question_seconds, pattern_type, negative_marking) VALUES
('tnpsc_group1','Prelims','history','hist_ancient', 8, 16, 16, 54, 'mcq4', 0),
('tnpsc_group1','Prelims','history','hist_dravidian', 8, 16, 16, 54, 'mcq4', 0),
('tnpsc_group1','Prelims','geography','geo_india', 6, 12, 12, 54, 'mcq4', 0),
('tnpsc_group1','Prelims','tn_studies','tn_geography', 8, 16, 16, 54, 'mcq4', 0),
('tnpsc_group1','Prelims','polity','pol_parliament', 7, 14, 14, 54, 'mcq4', 0),
('tnpsc_group1','Prelims','economy','eco_agriculture', 6, 12, 12, 54, 'mcq4', 0),
('tnpsc_group1','Prelims','tn_studies','tn_govt_schemes', 9, 18, 18, 54, 'mcq4', 0),
('tnpsc_group1','Prelims','tamil','tamil_literature_thirukkural', 9, 18, 18, 54, 'mcq4', 0),
('tnpsc_group1','Prelims','science_general','sci_bio_human', 10, 20, 20, 54, 'mcq4', 0),
('tnpsc_group1','Prelims','current_affairs','pol_election', 10, 20, 20, 54, 'mcq4', 0),
('tnpsc_group1','Prelims','maths_arithmetic','arith_percentage', 8, 15, 15, 54, 'mcq4', 0),
('tnpsc_group1','Prelims','reasoning_verbal','reason_analogy', 6, 13, 13, 54, 'mcq4', 0);

SELECT 'Exam topic mappings inserted' as status;
