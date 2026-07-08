// FILE: src/pages/concept/ConceptCard.jsx
// 7-Layer Concept Learning Screen
// Route: /concept/:topicId/:level
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { openPayment, PAY_AMOUNTS } from '../../lib/payment'
import { findTopic } from '../../lib/foundationTopics'

const NAVY = '#1E3A5F'
const GOLD = '#C9A84C'
const BG   = '#F8FAFC'

// -- MOCK CONCEPTS (shown when Supabase isn't ready yet) -------------------
const MOCK_CONCEPTS = {
  'arith_percentage': {
    1: {
      concept_title: 'Percentage - Level 1: What Does % Even Mean?',
      concept_summary: '% means "per hundred" - it compares everything on a scale of 100. Once you understand this one idea, every percentage question becomes easy.',
      level_label: 'Class 1-5 Introduction',
      real_world: 'You see % everywhere in India: 18% GST on your Amazon order, 20% off on Diwali sale, 75% attendance required in college, 45% marks to pass your exam. Every single day you use percentage without even realising it.',
      real_world_examples: [
        { context: 'Shopping', example: '20% off on ₹500 kurta = save ₹100 → pay only ₹400' },
        { context: 'Banking', example: '7% interest on ₹10,000 FD = ₹700 interest in 1 year' },
        { context: 'Exams', example: '75% attendance = you must attend 75 out of every 100 classes' },
      ],
      definition: 'Percent means "per hundred." When we say 30%, we mean 30 out of every 100 parts.',
      formula: 'Percentage = (Part ÷ Whole) × 100',
      formula_breakdown: [
        { symbol: 'Part',  meaning: 'The value you want to express as a percentage', example: '18 students passed' },
        { symbol: 'Whole', meaning: 'The total amount',                               example: '60 total students' },
        { symbol: '×100',  meaning: 'Converts the fraction to per hundred',           example: '(18÷60)×100 = 30%' },
      ],
      key_terms: [
        { term: '%', meaning: 'Symbol for percent (per hundred)', example: '50% = 50 per 100 = half' },
        { term: 'Part', meaning: 'The portion you\'re looking at', example: '15 girls in a class of 60' },
        { term: 'Whole', meaning: 'The total', example: '60 students total' },
      ],
      concept_rules: [
        { rule: '100% = the whole thing', example: '100% of ₹500 = ₹500 itself' },
        { rule: '50% = exactly half', example: '50% of 80 = 40' },
        { rule: 'x% of 100 = x always', example: '37% of 100 = 37' },
      ],
      worked_examples: [
        {
          title: 'Example 1 (Easy)',
          problem: '20 students in a class of 50 are girls. What % are girls?',
          steps: [
            'Step 1: Identify Part = 20 (girls), Whole = 50 (total)',
            'Step 2: Apply formula: (Part ÷ Whole) × 100',
            'Step 3: = (20 ÷ 50) × 100 = 0.4 × 100',
            'Step 4: = 40%',
          ],
          answer: '40% are girls',
          insight: 'Always identify Part and Whole first before applying the formula.',
        },
        {
          title: 'Example 2 (Daily Life)',
          problem: 'A shopkeeper gives 25% discount on a ₹200 shirt. What is the discount amount?',
          steps: [
            'Step 1: Find 25% of ₹200',
            'Step 2: = (25 ÷ 100) × 200',
            'Step 3: = 0.25 × 200 = ₹50',
          ],
          answer: 'Discount = ₹50',
          insight: 'Finding X% of a number = (X÷100) × that number.',
        },
        {
          title: 'Example 3 (Classic)',
          problem: 'A school has 800 students. 35% play cricket. How many students play cricket?',
          steps: [
            'Step 1: Need to find 35% of 800',
            'Step 2: = (35÷100) × 800',
            'Step 3: = 0.35 × 800',
            'Step 4: = 280 students',
          ],
          answer: '280 students play cricket',
          insight: 'Break it: 10% of 800 = 80; so 35% = 3×80 + 5% of 80 = 240 + 40 = 280. Faster!',
        },
      ],
      common_mistakes: [
        {
          mistake: 'Writing the answer without ×100',
          why_wrong: 'You get a decimal like 0.4 instead of 40%',
          correct_approach: 'Always multiply by 100 at the end to get the % form',
        },
        {
          mistake: 'Confusing Part and Whole',
          why_wrong: 'You get the wrong answer entirely',
          correct_approach: 'The Whole is always the TOTAL. The Part is a piece of it.',
        },
      ],
      mnemonic: 'PHW = Part divided by (Hundred times Whole). "Phew, that was easy!"',
      mnemonic_detail: 'Remember PHW: P for Part (goes on top), H for the hundred (multiply by), W for Whole (goes below). Say "Phew" to remember - because once you know this, % questions are easy!',
      shortcuts: [
        { trick: '10% shortcut: just move decimal one place left', condition: 'When finding 10%', example: '10% of 340 = 34.0' },
        { trick: '5% = half of 10%', condition: 'When finding 5%', example: '5% of 200 = half of 20 = 10' },
        { trick: '25% = divide by 4', condition: 'When finding 25%', example: '25% of 80 = 80÷4 = 20' },
        { trick: '50% = divide by 2', condition: 'When finding 50%', example: '50% of 360 = 180' },
      ],
      visual_pattern: '  PART\n ------  × 100  =  %\n  WHOLE',
      story: 'Ramu bhaiya runs a small kirana shop in Patna. During Diwali, he gave 20% off on all items. Priya came to buy a ₹500 face cream. Ramu bhaiya quickly calculated: 20% of 500 = (20÷100)×500 = ₹100 off. So Priya paid only ₹400. "You remembered the PHW formula!" laughed Priya. Ramu smiled - percentage had made his business honest and fast.',
      story_moral: 'Percentage is just a way to compare fairly - whether in a shop, exam, or election.',
      exam_coverage: {
        school_olympiad: ['IMO Level 1', 'NSO Level 1', 'NTSE Stage 1 MAT'],
        state_competitive: ['TNPSC Group 4', 'UP VDO', 'NTSE Stage 2'],
        ssc_banking: ['SSC CGL Tier 1', 'IBPS PO Prelims', 'SBI Clerk Prelims'],
        upsc_cat: ['UPSC CSAT', 'CAT QA', 'MAT Quant'],
      },
      question_patterns: [
        { pattern: 'Direct % calculation', example: 'Find 15% of 240', frequency: 'Very High' },
        { pattern: 'What % is X of Y', example: '18 is what % of 60?', frequency: 'Very High' },
        { pattern: '% increase/decrease', example: 'Price rose from 400 to 500. % increase?', frequency: 'High' },
        { pattern: 'Find the whole from %', example: '30% of a number is 90. Find the number.', frequency: 'High' },
      ],
      difficulty_note: 'Level 1 covers only direct % calculation. No reverse % or % change yet.',
      checkpoint_questions: [
        {
          question: '15 out of 60 students passed. What % passed?',
          options: ['A) 20%', 'B) 25%', 'C) 30%', 'D) 35%'],
          correct: 1,
          micro_explanation: '(15÷60)×100 = 25%',
        },
        {
          question: 'What is 10% of 450?',
          options: ['A) 40', 'B) 45', 'C) 50', 'D) 55'],
          correct: 1,
          micro_explanation: 'Move decimal left: 450 → 45.0 = 45',
        },
        {
          question: 'A shirt costs ₹800. A 25% discount is given. What is the discount amount?',
          options: ['A) ₹150', 'B) ₹175', 'C) ₹200', 'D) ₹225'],
          correct: 2,
          micro_explanation: '25% of 800 = 800÷4 = ₹200',
        },
      ],
      read_time_mins: 5,
    },
    2: {
      concept_title: 'Percentage - Level 2: Increase, Decrease & Working Backwards',
      concept_summary: 'Now you\'ll learn the two things Level 1 skipped: how to find a % INCREASE or DECREASE between two values, and how to work BACKWARDS - finding the original number when you only know the percentage and the result.',
      level_label: 'Class 6-8 Core Method',
      real_world: 'This is exactly how news reports "prices rose 12%" or "attendance dropped 8%" - they\'re comparing an OLD value to a NEW value. And when your electricity bill says "you used 30% more than last month, that\'s 45 units," you can work backwards to find last month\'s usage.',
      real_world_examples: [
        { context: 'News', example: 'Petrol price rose from ₹90 to ₹99 → (99-90)/90×100 = 10% increase' },
        { context: 'Exams', example: 'If 30% of your class (18 students) is above 90%, total class size = 18÷0.3 = 60' },
      ],
      definition: '% increase or decrease always compares the CHANGE to the ORIGINAL value - never the new value.',
      formula: '% change = ((New − Old) ÷ Old) × 100    |    Reverse: Number = Value ÷ (%÷100)',
      formula_breakdown: [
        { symbol: 'New − Old', meaning: 'The actual change (can be negative for decrease)', example: '500 − 400 = 100' },
        { symbol: 'Old', meaning: 'ALWAYS the original/starting value - this is the #1 mistake spot', example: 'Divide by 400, never by 500' },
      ],
      key_terms: [
        { term: '% increase', meaning: 'New value is bigger than old', example: '400 → 500 is a 25% increase' },
        { term: '% decrease', meaning: 'New value is smaller than old', example: '500 → 400 is a 20% decrease (not 25%!)' },
        { term: 'Reverse percentage', meaning: 'Finding the whole when you know a part and its %', example: '30% of a number is 90 → number is 300' },
      ],
      concept_rules: [
        { rule: 'Always divide by the ORIGINAL value, not the new one', example: '400→500: use 400 on the bottom' },
        { rule: '% increase and % decrease between the same two numbers are NOT equal', example: '400→500 is +25%, but 500→400 is −20%' },
      ],
      worked_examples: [
        {
          title: 'Example 1 (% Increase)',
          problem: 'Price of a book rose from ₹250 to ₹300. What is the % increase?',
          steps: ['Step 1: Change = 300 − 250 = 50', 'Step 2: % change = (50 ÷ 250) × 100', 'Step 3: = 20%'],
          answer: '20% increase',
          insight: 'Notice 250 (the OLD price) is on the bottom, not 300.',
        },
        {
          title: 'Example 2 (Reverse %)',
          problem: '40% of a number is 160. Find the number.',
          steps: ['Step 1: 40% of N = 160', 'Step 2: N = 160 ÷ (40÷100)', 'Step 3: N = 160 ÷ 0.4 = 400'],
          answer: 'The number is 400',
          insight: 'Reverse % questions: just divide the given value by the percentage (as a decimal).',
        },
        {
          title: 'Example 3 (% Decrease)',
          problem: 'Number of students in a class fell from 80 to 60. Find the % decrease.',
          steps: ['Step 1: Change = 80 − 60 = 20', 'Step 2: % change = (20 ÷ 80) × 100', 'Step 3: = 25%'],
          answer: '25% decrease',
          insight: '80 (the ORIGINAL count) goes on the bottom - not 60.',
        },
      ],
      common_mistakes: [
        { mistake: 'Dividing by the NEW value instead of the OLD value', why_wrong: 'Gives a completely different (and wrong) answer', correct_approach: 'The original/starting value always goes in the denominator' },
        { mistake: 'Assuming % increase and % decrease are symmetric', why_wrong: '400→500 (+25%) is not the same size jump as 500→400 (−20%)', correct_approach: 'Always recalculate using the correct original value for each direction' },
      ],
      mnemonic: 'OROB - "Original on Bottom." Whatever value you started with goes in the denominator, always.',
      mnemonic_detail: 'Say "OROB" before every % change question: Original goes On Bottom. This one rule prevents 90% of Level 2 mistakes.',
      shortcuts: [
        { trick: 'Fraction shortcuts for common percentages', condition: 'Recognize these instantly', example: '1/4=25%, 1/5=20%, 1/3≈33.3%, 1/8=12.5%' },
        { trick: 'Reverse % = value ÷ decimal form of %', condition: 'When "X% of a number is Y"', example: '30% of N = 90 → N = 90÷0.3 = 300' },
      ],
      visual_pattern: '  NEW − OLD\n ----------  × 100  =  % change\n     OLD',
      story: 'Meena tracks her shop\'s sales every month. In March she sold ₹40,000 worth of goods; in April, ₹50,000. "That\'s a 25% jump!" she calculated - (50,000−40,000)/40,000×100. Her brother argued it should be compared to April\'s number instead. Meena showed him: if you did that, going back from 50,000 to 40,000 would look like only a 20% drop - which proves you must always anchor to the ORIGINAL number, not whichever one is convenient.',
      story_moral: 'The original value is always the anchor - change the anchor, and your answer silently becomes wrong.',
      exam_coverage: {
        school_olympiad: ['IMO Level 1', 'NSO Level 2'],
        state_competitive: ['TNPSC Group 4', 'NTSE Stage 2'],
        ssc_banking: ['SSC CGL Tier 1', 'IBPS PO Prelims'],
        upsc_cat: ['UPSC CSAT', 'CAT QA'],
      },
      question_patterns: [
        { pattern: '% increase/decrease between two values', example: 'Price rose from 400 to 500. % increase?', frequency: 'Very High' },
        { pattern: 'Reverse percentage', example: '30% of a number is 90. Find the number.', frequency: 'High' },
      ],
      difficulty_note: 'Level 2 adds % change and reverse % - the two most common traps after basic % calculation.',
      checkpoint_questions: [
        { question: 'Price of a pen rose from ₹250 to ₹300. What is the % increase?', options: ['A) 15%', 'B) 20%', 'C) 25%', 'D) 30%'], correct: 1, micro_explanation: '(300-250)/250×100 = 50/250×100 = 20%' },
        { question: '40% of a number is 160. Find the number.', options: ['A) 350', 'B) 380', 'C) 400', 'D) 420'], correct: 2, micro_explanation: '160 ÷ 0.4 = 400' },
        { question: 'Students fell from 80 to 60. Find the % decrease.', options: ['A) 20%', 'B) 25%', 'C) 30%', 'D) 35%'], correct: 1, micro_explanation: '(80-60)/80×100 = 20/80×100 = 25%' },
      ],
      read_time_mins: 6,
    },
    3: {
      concept_title: 'Percentage - Level 3: Successive Percentage Changes',
      concept_summary: 'The biggest exam trap in percentages: when a value changes TWICE (e.g. up 10%, then down 10%), the two changes do NOT cancel out. You\'ll learn the exact formula for combining successive percentage changes.',
      level_label: 'Class 9-10 Advanced',
      real_world: 'This is exactly how a shop can advertise "50% off, then an extra 20% off" - and the total discount is NOT 70%. It\'s also how salary hikes and pay cuts across two years never fully cancel each other out.',
      real_world_examples: [
        { context: 'Shopping', example: '"50% off + extra 20% off" on ₹1000 = 1000×0.5×0.8 = ₹400, i.e. an effective 60% off, not 70%' },
        { context: 'Salary', example: 'A 20% pay cut followed by a 25% raise brings you back to exactly your original salary' },
      ],
      definition: 'When a value undergoes two percentage changes one after another, the net change is found by combining them multiplicatively, not by simple addition.',
      formula: 'Net % change = a + b + (a×b)/100   (use negative values for decreases)',
      formula_breakdown: [
        { symbol: 'a, b', meaning: 'The two percentage changes, with sign (+ for increase, − for decrease)', example: '+10 then −10 → a=10, b=−10' },
        { symbol: '(a×b)/100', meaning: 'The "correction term" that accounts for compounding - this is what people forget', example: '(10×−10)/100 = −1' },
      ],
      key_terms: [
        { term: 'Successive % change', meaning: 'Two or more percentage changes applied one after another', example: 'Price up 10%, then down 10%' },
        { term: 'Percentage point', meaning: 'The plain difference between two percentages (not a % change of a %)', example: 'Interest rate going from 5% to 8% is "3 percentage points," not "3% more"' },
      ],
      concept_rules: [
        { rule: '+x% followed by −x% is always a net DECREASE, never zero', example: '+10% then −10% = −1% net, not 0%' },
        { rule: 'Use the formula a+b+(ab/100) for any two successive % changes', example: '+20% then +25% = 20+25+5 = +50% net' },
      ],
      worked_examples: [
        {
          title: 'Example 1 (The Classic Trap)',
          problem: 'A price is increased by 10% and then decreased by 10%. What is the net % change?',
          steps: ['Step 1: a = +10, b = −10', 'Step 2: Net = 10 + (−10) + (10×−10)/100', 'Step 3: = 0 + (−1) = −1%'],
          answer: 'Net 1% DECREASE (not 0% as most students assume)',
          insight: 'The correction term (ab/100) is always negative when one change is + and the other is −, which is why "up then down by the same %" always ends in a net loss.',
        },
        {
          title: 'Example 2 (Two Increases)',
          problem: 'A number is increased by 20%, then increased again by 25%. Find the net % increase.',
          steps: ['Step 1: a = 20, b = 25', 'Step 2: Net = 20 + 25 + (20×25)/100', 'Step 3: = 45 + 5 = 50%'],
          answer: '50% net increase',
          insight: 'Two increases compound to MORE than their simple sum (45%) - the correction term adds extra here.',
        },
        {
          title: 'Example 3 (Cut then Raise)',
          problem: 'A salary is decreased by 20%, then increased by 25%. Find the net % change.',
          steps: ['Step 1: a = −20, b = 25', 'Step 2: Net = −20 + 25 + (−20×25)/100', 'Step 3: = 5 + (−5) = 0%'],
          answer: '0% - back to exactly the original salary',
          insight: 'A 20% cut needs a 25% raise (not 20%) to fully recover - this pairing appears constantly in exams.',
        },
      ],
      common_mistakes: [
        { mistake: 'Assuming +x% then −x% cancels to 0%', why_wrong: 'It always results in a net decrease of x²/100 percent', correct_approach: 'Always apply the formula a+b+(ab/100), never add and stop' },
        { mistake: 'Confusing "percentage points" with "percent change"', why_wrong: 'Going from 5% to 8% is a 3 percentage-point rise, but a 60% relative increase', correct_approach: 'Read the question carefully to see which one is being asked' },
      ],
      mnemonic: 'Never add straight - multiply the fraction. Or just remember: a + b + ab/100.',
      mnemonic_detail: 'Picture two multipliers stacking: (1+a/100)×(1+b/100). Expanding that product is exactly where the ab/100 correction term comes from.',
      shortcuts: [
        { trick: 'Same magnitude, opposite sign → net is always −(a²/100)%', condition: 'When both % changes have equal size but opposite direction', example: '+15% then −15% → net = −(15²/100) = −2.25%' },
        { trick: 'Two equal increases of r% → net = 2r + r²/100', condition: 'Same % increase applied twice', example: 'r=10% twice → 20 + 1 = 21% net increase' },
      ],
      visual_pattern: 'Net % = a + b + (a × b)/100',
      story: 'A shop owner advertised "Flat 50% off, PLUS an extra 20% off!" A customer assumed that meant 70% off a ₹1000 jacket, expecting to pay ₹300. But the shopkeeper applied 50% first (₹500), then 20% off THAT (₹400) - the real price. The customer felt cheated until the shopkeeper showed the maths: successive discounts never simply add up.',
      story_moral: 'Advertisements that stack percentages almost always sound bigger than the real combined effect.',
      exam_coverage: {
        school_olympiad: ['IMO Level 2', 'NSO Level 2'],
        state_competitive: ['TNPSC Group 2', 'NTSE Stage 2'],
        ssc_banking: ['SSC CGL Tier 2', 'IBPS PO Mains'],
        upsc_cat: ['CAT QA', 'UPSC CSAT'],
      },
      question_patterns: [
        { pattern: 'Successive % change (up then down / up then up)', example: '+10% then −10%, find net change', frequency: 'Very High' },
        { pattern: 'Successive discounts', example: '"50% + 20% off" - find effective discount', frequency: 'High' },
      ],
      difficulty_note: 'Level 3 is where most students plateau - the successive-change formula is the single highest-value formula in percentage questions for competitive exams.',
      checkpoint_questions: [
        { question: 'A number is increased by 10% and then decreased by 10%. What is the net % change?', options: ['A) No change', 'B) 1% increase', 'C) 1% decrease', 'D) 2% decrease'], correct: 2, micro_explanation: '10 + (−10) + (10×−10)/100 = −1%, a 1% decrease' },
        { question: 'Price increased by 25% then decreased by 20%. Net % change?', options: ['A) 0%', 'B) 5% increase', 'C) 5% decrease', 'D) 10% increase'], correct: 0, micro_explanation: '25 + (−20) + (25×−20)/100 = 5 − 5 = 0%' },
        { question: 'A number is increased by 50%, then increased by 50% again. Net % increase?', options: ['A) 100%', 'B) 110%', 'C) 125%', 'D) 150%'], correct: 2, micro_explanation: '50 + 50 + (50×50)/100 = 100 + 25 = 125%' },
      ],
      read_time_mins: 7,
    },
    4: {
      concept_title: 'Percentage - Level 4: Compound Growth, Depreciation & Error %',
      concept_summary: 'Real exam questions rarely stop at one change. This level covers population growth and machine depreciation over MULTIPLE years (the same successive-change idea, repeated), plus percentage error - how far a measured value is from the true value.',
      level_label: 'Class 11-12 / Early Competitive',
      real_world: 'Census population projections, vehicle resale value depreciation, and lab measurement error all use this exact compounding logic - a value growing or shrinking by the same % every year, not by a flat amount.',
      real_world_examples: [
        { context: 'Population', example: 'A town of 10,000 growing at 10%/year has 12,100 people after 2 years - not 12,000' },
        { context: 'Vehicles', example: 'A ₹3,00,000 car depreciating 10%/year is worth ₹2,43,000 after 2 years, not ₹2,40,000' },
      ],
      definition: 'When a value grows or shrinks by the SAME percentage every year, the value after n years is found by multiplying repeatedly - this is compound growth/depreciation, not simple (flat) percentage.',
      formula: 'Growth: Final = P × (1 + r/100)ⁿ    |    Depreciation: Final = P × (1 − r/100)ⁿ    |    % Error = (|True − Measured| ÷ True) × 100',
      formula_breakdown: [
        { symbol: 'P', meaning: 'The starting (present) value', example: '10,000 people or ₹3,00,000' },
        { symbol: 'r', meaning: 'The rate of growth or depreciation per year', example: '10% per year' },
        { symbol: 'n', meaning: 'Number of years the rate is applied', example: '2 years → squared, 3 years → cubed' },
      ],
      key_terms: [
        { term: 'Compound growth', meaning: 'Growing by a % of the CURRENT value each year (not the original)', example: 'Year 2 growth is 10% of the already-grown Year 1 value' },
        { term: '% Error', meaning: 'How far off a measurement is from the true value, as a percentage of the true value', example: 'True 250, measured 240 → error is 4%' },
      ],
      concept_rules: [
        { rule: 'Never use flat/simple percentage (P×r×n/100) for growth or depreciation over multiple years - always compound', example: '10% for 2 years ≠ 20% flat, it\'s 21% compounded' },
        { rule: '% Error always divides by the TRUE value, never the measured one', example: 'True value 250 goes on the bottom, not 240' },
      ],
      worked_examples: [
        {
          title: 'Example 1 (Population Growth)',
          problem: 'A town\'s population is 10,000 and grows at 10% per year. Find the population after 2 years.',
          steps: ['Step 1: Final = 10,000 × (1.10)²', 'Step 2: = 10,000 × 1.21', 'Step 3: = 12,100'],
          answer: '12,100 people',
          insight: 'This connects straight back to Level 3\'s formula: two successive +10% changes give a net +21%, matching 10,000 → 12,100 exactly.',
        },
        {
          title: 'Example 2 (Depreciation)',
          problem: 'A machine worth ₹50,000 depreciates at 10% per year. Find its value after 2 years.',
          steps: ['Step 1: Final = 50,000 × (0.90)²', 'Step 2: = 50,000 × 0.81', 'Step 3: = ₹40,500'],
          answer: '₹40,500',
          insight: 'Depreciation uses (1 − r/100) instead of (1 + r/100) - otherwise identical method.',
        },
        {
          title: 'Example 3 (Percentage Error)',
          problem: 'The true length of a rod is 250 cm, but it was measured as 240 cm. Find the percentage error.',
          steps: ['Step 1: Error = 250 − 240 = 10', 'Step 2: % Error = (10 ÷ 250) × 100', 'Step 3: = 4%'],
          answer: '4% error',
          insight: 'The TRUE value (250) is always the denominator for percentage error questions.',
        },
      ],
      common_mistakes: [
        { mistake: 'Using flat percentage (P×r×n/100) for multi-year growth/depreciation', why_wrong: 'Understates growth and overstates remaining value - compounding matters', correct_approach: 'Always raise (1±r/100) to the power of the number of years' },
        { mistake: 'Dividing by the measured value instead of the true value for % error', why_wrong: 'Gives a slightly wrong error percentage', correct_approach: 'The TRUE/actual value always goes in the denominator' },
      ],
      mnemonic: 'GMDA - "Grow, Multiply, Don\'t Add." Multiply the growth factor for each year; never just add up flat percentages.',
      mnemonic_detail: 'Picture compounding like stacking blocks: each year\'s growth sits ON TOP of last year\'s already-grown value, which is exactly why you multiply repeatedly instead of adding flat amounts.',
      shortcuts: [
        { trick: 'For 2 years at the same rate r%, net % change ≈ 2r + r²/100 (same formula as Level 3!)', condition: 'Quick estimate without a calculator', example: 'r=10 → 20+1=21%, matching the 10,000→12,100 example exactly' },
      ],
      visual_pattern: 'Final = P × (1 ± r/100)ⁿ',
      story: 'A farmer took a loan to buy a tractor worth ₹3,00,000, expecting it to lose 10% of its value flatly each year - so he guessed ₹2,40,000 after 2 years. When he went to resell it, the dealer quoted ₹2,43,000 - MORE than he expected. "Depreciation compounds on the already-reduced value each year," the dealer explained, "so the second year\'s 10% drop is smaller in absolute terms."',
      story_moral: 'Compounding cuts both ways - it can work against you (depreciation feels slower than expected) or for you (growth feels faster than expected).',
      exam_coverage: {
        school_olympiad: ['NSO Level 2'],
        state_competitive: ['TNPSC Group 1', 'NTSE Stage 2'],
        ssc_banking: ['SSC CGL Tier 2', 'IBPS SO'],
        upsc_cat: ['CAT QA', 'UPSC CSAT'],
      },
      question_patterns: [
        { pattern: 'Population/value growth over years', example: 'Population grows at r% for n years, find final value', frequency: 'High' },
        { pattern: 'Depreciation over years', example: 'Machine value depreciates at r% for n years', frequency: 'High' },
        { pattern: 'Percentage error', example: 'True vs measured value, find % error', frequency: 'Medium' },
      ],
      difficulty_note: 'Level 4 bridges percentage into compound interest and scientific measurement - a direct application of Level 3\'s successive-change idea repeated over many years.',
      checkpoint_questions: [
        { question: "A town's population is 8,000, growing at 5% per year. Find the population after 2 years.", options: ['A) 8,600', 'B) 8,700', 'C) 8,820', 'D) 8,900'], correct: 2, micro_explanation: '8,000 × 1.05 × 1.05 = 8,820' },
        { question: 'A car worth ₹3,00,000 depreciates at 10% per year. Find its value after 2 years.', options: ['A) ₹2,40,000', 'B) ₹2,41,000', 'C) ₹2,42,000', 'D) ₹2,43,000'], correct: 3, micro_explanation: '3,00,000 × 0.9 × 0.9 = ₹2,43,000' },
        { question: 'The true value is 500, but the measured value is 480. Find the % error.', options: ['A) 2%', 'B) 4%', 'C) 5%', 'D) 8%'], correct: 1, micro_explanation: '(500-480)/500×100 = 4%' },
      ],
      read_time_mins: 8,
    },
    5: {
      concept_title: 'Percentage - Level 5: Speed Tricks for Competitive Exams',
      concept_summary: 'The final level: mental-math shortcuts to solve percentage questions in seconds, plus the classic "how many passed both subjects" style multi-step questions that show up constantly in SSC and Banking exams.',
      level_label: 'Competitive Exam Speed & Mastery',
      real_world: 'In SSC CGL, IBPS PO, and similar exams, you get roughly 45-60 seconds per question. These tricks are what separate students who finish the quant section from those who run out of time.',
      real_world_examples: [
        { context: 'Exam speed', example: 'Finding 8% of 50 by flipping it to "50% of 8" gives the answer (4) almost instantly' },
        { context: 'Banking exams', example: '"60% passed Maths, 70% passed Science, 50% passed both - find % who failed both" is a recurring pattern' },
      ],
      definition: 'Speed tricks don\'t use new formulas - they use the SAME rules from Levels 1-4, applied in a smarter order to avoid slow calculation.',
      formula: 'Flip trick: x% of y = y% of x   |   Failed-both (union) trick: % failed both = 100 − (A + B − Both)',
      formula_breakdown: [
        { symbol: 'x% of y = y% of x', meaning: 'Percentage is commutative - swap whichever number is easier to work with to the "%" position', example: '8% of 50 = 50% of 8 = 4 (way faster than calculating 8% directly)' },
        { symbol: 'A + B − Both', meaning: 'This is set theory (inclusion-exclusion): the % that passed AT LEAST ONE subject', example: '60 + 70 − 50 = 80% passed at least one' },
      ],
      key_terms: [
        { term: 'Commutative flip', meaning: 'Swapping which number is treated as the "%" for faster mental math', example: '4% of 75 = 75% of 4 = 3' },
        { term: 'Fraction-% table', meaning: 'Memorized instant conversions between common fractions and percentages', example: '1/6 ≈ 16.67%, 1/8 = 12.5%, 1/16 = 6.25%' },
      ],
      concept_rules: [
        { rule: 'Always flip to make the "×" number a round, easy figure', example: '8% of 50 → flip to 50% of 8 (way easier than 0.08×50)' },
        { rule: 'For "passed both" style problems, always find "at least one" first, then subtract from 100', example: 'Never try to directly compute "failed both" - go through the union first' },
      ],
      worked_examples: [
        {
          title: 'Example 1 (Commutative Flip)',
          problem: 'Find 8% of 50 - instantly, without a calculator.',
          steps: ['Step 1: Flip it - 8% of 50 = 50% of 8', 'Step 2: 50% is just half', 'Step 3: Half of 8 = 4'],
          answer: '4',
          insight: 'This trick works because percentage multiplication is commutative: (8/100)×50 = (50/100)×8. Always flip toward the rounder number.',
        },
        {
          title: 'Example 2 (Passed-Both Pattern)',
          problem: 'In an exam, 60% passed Maths, 70% passed Science, and 50% passed both. What % failed BOTH subjects?',
          steps: ['Step 1: % passed at least one = 60 + 70 − 50 = 80%', 'Step 2: % failed both = 100 − 80', 'Step 3: = 20%'],
          answer: '20% failed both subjects',
          insight: 'This is inclusion-exclusion in disguise. Students who try to shortcut past the "at least one" step almost always get this wrong.',
        },
        {
          title: 'Example 3 (Fast Reverse %)',
          problem: 'A number, when increased by 25%, becomes 500. Find the original number.',
          steps: ['Step 1: Original × 1.25 = 500', 'Step 2: Original = 500 ÷ 1.25', 'Step 3: = 400'],
          answer: '400',
          insight: 'Dividing by 1.25 is the same as multiplying by 4 and dividing by 5 - another mental shortcut worth memorizing.',
        },
      ],
      common_mistakes: [
        { mistake: 'Directly trying to compute "% failed both" without going through "at least one" first', why_wrong: 'Leads to double-counting or missing the overlap entirely', correct_approach: 'Always compute A+B−Both first, then subtract from 100' },
        { mistake: 'Not recognizing when the commutative flip trick applies', why_wrong: 'Wastes 20-30 seconds doing decimal multiplication that could take 5 seconds', correct_approach: 'Whenever one number is a "nice" figure (50, 25, 75, 8, 4), consider flipping' },
      ],
      mnemonic: 'PBP - "Pass Both Percent = A + B − Both." Say this before every union-style percentage question.',
      mnemonic_detail: 'For the flip trick, remember: "the harder number becomes the easier position." If 8% of 50 feels hard, flip it - 50% of 8 is always easier because 50% is just half.',
      shortcuts: [
        { trick: 'Memorize the fraction-% table for instant recognition', condition: 'Any time a percentage matches a common fraction', example: '1/3≈33.3%, 1/6≈16.67%, 1/7≈14.28%, 1/9≈11.11%, 1/12≈8.33%, 1/16=6.25%, 1/20=5%' },
        { trick: 'Dividing by 1.25 = multiply by 4, divide by 5', condition: 'Reversing a 25% increase', example: '500 ÷ 1.25 = (500×4)/5 = 2000/5 = 400' },
      ],
      visual_pattern: 'x% of y = y% of x     |     100 − (A + B − Both) = % failed both',
      story: 'During a mock SSC exam, Arjun spent 40 seconds calculating 8% of 50 the "long way" while his friend Divya flipped it instantly to 50% of 8 = 4 in under 5 seconds. Over a 100-question paper, those saved seconds added up to enough extra time for Divya to attempt 6 more questions than Arjun.',
      story_moral: 'In competitive exams, the fastest correct method wins - not the most "formal" one.',
      exam_coverage: {
        school_olympiad: [],
        state_competitive: ['TNPSC Group 1 & 2'],
        ssc_banking: ['SSC CGL Tier 1 & 2', 'IBPS PO/Clerk', 'SBI PO/Clerk'],
        upsc_cat: ['CAT QA', 'UPSC CSAT'],
      },
      question_patterns: [
        { pattern: 'Fast mental % calculation using the flip trick', example: 'Find 4% of 75 instantly', frequency: 'Very High' },
        { pattern: '"Passed both subjects" union-style questions', example: '65% + 55% passed, 40% passed both - find % failed both', frequency: 'High' },
      ],
      difficulty_note: 'Level 5 is pure speed - if you understand Levels 1-4, this level is about applying that understanding faster, not learning new theory.',
      checkpoint_questions: [
        { question: 'Find 4% of 75 using the flip trick (x% of y = y% of x).', options: ['A) 2', 'B) 3', 'C) 4', 'D) 5'], correct: 1, micro_explanation: '4% of 75 = 75% of 4 = 3' },
        { question: 'In a class, 65% passed English and 55% passed Maths, and 40% passed both. What % failed BOTH subjects?', options: ['A) 10%', 'B) 15%', 'C) 20%', 'D) 25%'], correct: 2, micro_explanation: 'Passed at least one = 65+55-40=80%. Failed both = 100-80 = 20%' },
        { question: 'A number increased by 25% becomes 500. Find the original number.', options: ['A) 375', 'B) 380', 'C) 400', 'D) 420'], correct: 2, micro_explanation: '500 ÷ 1.25 = 400' },
      ],
      read_time_mins: 6,
    },
  },
  'arith_profit_loss': {
    1: {
      concept_title: 'Profit & Loss - Level 1: Buy Low, Sell High',
      concept_summary: 'Profit happens when you sell something for more than you bought it. Loss happens when you sell for less. These two simple ideas power all of commerce.',
      level_label: 'Class 6-7 Basics',
      real_world: 'Every kirana shop, vegetable vendor, and mobile phone seller uses profit and loss every single day. When your uncle buys mangoes for ₹50/kg and sells for ₹70/kg, that ₹20 is his profit.',
      real_world_examples: [
        { context: 'Kirana shop', example: 'Buy rice at ₹40/kg, sell at ₹50/kg → Profit ₹10/kg' },
        { context: 'Mobile phones', example: 'Buy old phone for ₹8,000, sell for ₹6,000 → Loss ₹2,000' },
        { context: 'Stocks', example: 'Buy shares at ₹100, sell at ₹130 → 30% profit' },
      ],
      definition: 'Profit = Selling Price (SP) − Cost Price (CP). If SP > CP → Profit. If SP < CP → Loss.',
      formula: 'Profit = SP − CP | Loss = CP − SP | Profit% = (Profit ÷ CP) × 100',
      formula_breakdown: [
        { symbol: 'CP', meaning: 'Cost Price - what you paid to buy', example: 'Bought for ₹500 → CP = 500' },
        { symbol: 'SP', meaning: 'Selling Price - what you got when you sold', example: 'Sold for ₹600 → SP = 600' },
        { symbol: 'Profit%', meaning: 'Profit as a percentage of CP', example: '(100÷500)×100 = 20% profit' },
      ],
      key_terms: [
        { term: 'Cost Price (CP)', meaning: 'Price at which item is purchased', example: 'Bought chair for ₹2,000' },
        { term: 'Selling Price (SP)', meaning: 'Price at which item is sold', example: 'Sold chair for ₹2,500' },
        { term: 'Profit', meaning: 'Extra money earned', example: '2500−2000 = ₹500 profit' },
        { term: 'Loss', meaning: 'Money lost in transaction', example: 'Sold for ₹1,800 → Loss = ₹200' },
      ],
      concept_rules: [
        { rule: 'SP > CP → Profit', example: 'CP=200, SP=250 → Profit=50' },
        { rule: 'SP < CP → Loss', example: 'CP=200, SP=180 → Loss=20' },
        { rule: 'Profit% is always calculated on CP, not SP', example: 'Profit 50 on CP 200 = 25%, NOT on SP 250' },
      ],
      worked_examples: [
        {
          title: 'Example 1 (Basic)',
          problem: 'Ramu bought a pen for ₹15 and sold it for ₹20. Find profit and profit%.',
          steps: ['CP = ₹15, SP = ₹20', 'Profit = SP−CP = 20−15 = ₹5', 'Profit% = (5÷15)×100 = 33.33%'],
          answer: 'Profit = ₹5, Profit% ≈ 33%',
          insight: 'Always remember profit% is on CP, not on SP.',
        },
        {
          title: 'Example 2 (Loss case)',
          problem: 'A bicycle bought for ₹3,000 was sold for ₹2,400. Find loss%.',
          steps: ['CP = 3000, SP = 2400', 'Loss = 3000−2400 = ₹600', 'Loss% = (600÷3000)×100 = 20%'],
          answer: 'Loss% = 20%',
          insight: 'Loss% = (Loss ÷ CP) × 100 - same formula, just called "loss" instead of "profit".',
        },
        {
          title: 'Example 3 (Find SP)',
          problem: 'A shopkeeper wants 15% profit on CP of ₹800. What should the SP be?',
          steps: ['SP = CP × (1 + P%/100)', 'SP = 800 × (1 + 15/100)', 'SP = 800 × 1.15 = ₹920'],
          answer: 'SP = ₹920',
          insight: 'Quick formula: SP = CP × (100+P%) / 100',
        },
      ],
      common_mistakes: [
        { mistake: 'Calculating Profit% on SP instead of CP', why_wrong: 'Gives wrong answer', correct_approach: 'ALWAYS calculate % on CP' },
        { mistake: 'Confusing profit amount with profit%', why_wrong: 'Wrong answer entirely', correct_approach: 'Profit amount = SP−CP; Profit% = amount/CP × 100' },
      ],
      mnemonic: 'SP beats CP → Profit Party! CP beats SP → Loss Laggeya!',
      mnemonic_detail: 'If Selling Price beats Cost Price → Profit Party (you celebrate). If Cost Price beats Selling Price → Loss Laggeya (you\'re sad). Easy Hindi memory!',
      shortcuts: [
        { trick: 'SP = CP × (100+P)/100 for profit', condition: 'When SP is unknown', example: 'CP=500, P%=20 → SP=500×120/100=600' },
        { trick: 'SP = CP × (100−L)/100 for loss', condition: 'When loss SP is unknown', example: 'CP=500, L%=10 → SP=500×90/100=450' },
      ],
      story: 'Priya\'s mother Savita sells vegetables at the Coimbatore market. She buys tomatoes at ₹20/kg from the farm and sells at ₹28/kg. "Amma, what is your profit?" asked Priya. "₹8 per kilo, which is 40% profit on what I paid!" said Savita. Priya quickly checked: (8÷20)×100 = 40%. Correct! The formula SP−CP gives profit, and dividing by CP gives the percentage.',
      story_moral: 'Every transaction has a cost price and selling price - knowing the difference gives you business sense for life.',
      exam_coverage: {
        school_olympiad: ['IMO', 'NTSE MAT'],
        state_competitive: ['TNPSC', 'SSC MTS', 'Bank Clerk'],
        ssc_banking: ['SSC CGL Tier 1', 'IBPS PO Prelims', 'SBI Clerk'],
        upsc_cat: ['UPSC CSAT', 'CAT QA'],
      },
      question_patterns: [
        { pattern: 'Find profit/loss amount', example: 'CP=200, SP=250. Find profit.', frequency: 'Very High' },
        { pattern: 'Find profit/loss %', example: 'CP=400, SP=480. Find profit%.', frequency: 'Very High' },
        { pattern: 'Find SP given CP and P%', example: 'CP=600, P%=25. Find SP.', frequency: 'High' },
      ],
      difficulty_note: 'Level 1: only direct calculations. No MP, discount, or successive discount yet.',
      checkpoint_questions: [
        { question: 'If CP = ₹500 and SP = ₹600, what is the profit?', options: ['A) ₹50','B) ₹100','C) ₹110','D) ₹150'], correct:1, micro_explanation:'SP−CP = 600−500 = ₹100' },
        { question: 'What is the profit% if CP=₹200 and SP=₹250?', options:['A) 20%','B) 25%','C) 30%','D) 35%'], correct:1, micro_explanation:'(50÷200)×100 = 25%' },
        { question: 'CP=₹800, Profit%=25%. Find SP.', options:['A) ₹900','B) ₹950','C) ₹1000','D) ₹1050'], correct:2, micro_explanation:'SP = 800×125/100 = ₹1000' },
      ],
      read_time_mins: 6,
    },
  },
}

// -- LAYER CONFIG -----------------------------------------------------------
const LAYERS = [
  { key:'real_world',   icon:'🌍', label:'Real World',      color:'#0891B2' },
  { key:'definition',   icon:'📖', label:'Concept',         color:'#7C3AED' },
  { key:'worked_examples', icon:'📐', label:'Examples',     color:'#059669' },
  { key:'shortcuts',    icon:'⚡', label:'Shortcuts',       color:'#D97706' },
  { key:'story',        icon:'📖', label:'Story',           color:'#DB2777' },
  { key:'mnemonic',     icon:'🧠', label:'Memory Trick',    color:'#DC2626' },
  { key:'exam_coverage',icon:'🎯', label:'Exam Intel',      color:NAVY      },
]

export default function ConceptCard() {
  const { topicId, level }  = useParams()
  const navigate             = useNavigate()
  const { user, canAccess, isTopicUnlocked, unlockTopic, planTier } = useAuth()

  const [concept,      setConcept]      = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [activeLayer,  setActiveLayer]  = useState(0)
  const [readLayers,   setReadLayers]   = useState(new Set([0]))
  const [readSecs,     setReadSecs]     = useState(0)
  const [showGate,     setShowGate]     = useState(false)
  const [paying,       setPaying]       = useState(false)
  const [payError,     setPayError]     = useState('')
  const [justUnlocked, setJustUnlocked] = useState(false)
  const timerRef = useRef(null)
  const lvl = parseInt(level) || 1

  // -- ACCESS CHECK ---------------------------------------------------------
  const hasAccess = planTier === 'ultra' || planTier === 'pro' || isTopicUnlocked(topicId) || justUnlocked

  // -- PAYMENT: unlock this single topic for ₹5 ------------------------------
  const handleUnlockTopic = async () => {
    setPayError('')
    setPaying(true)
    await openPayment({
      amount: PAY_AMOUNTS.day1, // 500 paise = ₹5
      description: `TryIT Foundation - Unlock "${findTopic(topicId)?.topic?.label || topicId}"`,
      prefill: { name: user?.name || '', contact: user?.phone || '' },
      notes: { userId: user?.id, topicId, type: 'foundation_topic_unlock' },
      onSuccess: () => {
        unlockTopic(topicId)
        setJustUnlocked(true)
        setPaying(false)
      },
      onFailure: (err) => {
        setPayError(err?.message || 'Payment failed - please try again.')
        setPaying(false)
      },
      onDismiss: () => setPaying(false),
    })
  }

  // -- LOAD CONCEPT ---------------------------------------------------------
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('concepts')
          .select('*')
          .eq('topic_id', topicId)
          .eq('level', lvl)
          .single()
        if (data && !error) {
          setConcept(data)
        } else {
          // Fallback to mock
          const mock = MOCK_CONCEPTS[topicId]?.[lvl]
          setConcept(mock || null)
        }
      } catch {
        const mock = MOCK_CONCEPTS[topicId]?.[lvl]
        setConcept(mock || null)
      }
      setLoading(false)
    })()
  }, [topicId, lvl])

  // -- READING TIMER ---------------------------------------------------------
  useEffect(() => {
    if (!hasAccess || !concept) return
    timerRef.current = setInterval(() => setReadSecs(s => s + 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [hasAccess, concept])

  // Track layer reads
  const goToLayer = (idx) => {
    setActiveLayer(idx)
    setReadLayers(prev => new Set([...prev, idx]))
  }

  const allLayersRead = readLayers.size >= LAYERS.length

  // -- SAVE READ PROGRESS ----------------------------------------------------
  const markRead = async () => {
    const conceptId = `${topicId}_l${lvl}`
    try {
      await supabase.from('user_concept_progress').upsert({
        user_id:    user.id,
        concept_id: conceptId,
        topic_id:   topicId,
        level:      lvl,
        status:     'completed',
        read_count: 1,
        last_read_at: new Date().toISOString(),
        total_read_secs: readSecs,
      }, { onConflict:'user_id,concept_id' })
    } catch {}
    // Save locally too
    const key = `tryit_concept_read_${user?.id}_${conceptId}`
    localStorage.setItem(key, JSON.stringify({ readAt: new Date().toISOString(), secs: readSecs }))
  }

  const handleStartCheckpoint = async () => {
    await markRead()
    navigate(`/concept/${topicId}/${lvl}/checkpoint`, {
      state: { concept, topicId, level: lvl }
    })
  }

  // -- LAYER CONTENT RENDERER ------------------------------------------------
  const renderLayer = () => {
    if (!concept) return null
    const layer = LAYERS[activeLayer]

    switch (layer.key) {
      case 'real_world':
        return (
          <div>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{concept.real_world}</p>
            {concept.real_world_examples?.map((ex, i) => (
              <div key={i} style={{ background:'#F0F9FF', borderRadius:12, padding:'12px 14px', marginBottom:8, borderLeft:`3px solid #0891B2` }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#0891B2', marginBottom:3 }}>{ex.context}</p>
                <p style={{ fontSize:13, color:'var(--color-text,#1E293B)' }}>{ex.example}</p>
              </div>
            ))}
          </div>
        )

      case 'definition':
        return (
          <div>
            <div style={{ background:'#EDE9FE', borderRadius:12, padding:14, marginBottom:14 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#7C3AED', marginBottom:4 }}>DEFINITION</p>
              <p style={{ fontSize:14, color:'var(--color-text,#1E293B)', lineHeight:1.7 }}>{concept.definition}</p>
            </div>
            {concept.formula && (
              <div style={{ background:'var(--color-primary,#1E3A5F)', borderRadius:12, padding:14, marginBottom:14, textAlign:'center' }}>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:4 }}>FORMULA</p>
                <p style={{ fontSize:16, fontWeight:700, color:'var(--color-accent, #C9A84C)', fontFamily:'monospace' }}>{concept.formula}</p>
              </div>
            )}
            {concept.formula_breakdown?.map((fb, i) => (
              <div key={i} style={{ display:'flex', gap:12, padding:'8px 0', borderBottom:'1px solid #F1F5F9' }}>
                <span style={{ minWidth:70, fontSize:12, fontWeight:700, color:'#7C3AED' }}>{fb.symbol}</span>
                <div>
                  <p style={{ fontSize:12, color:'#475569' }}>{fb.meaning}</p>
                  <p style={{ fontSize:11, color:'#94A3B8' }}>{fb.example}</p>
                </div>
              </div>
            ))}
          </div>
        )

      case 'worked_examples':
        return (
          <div>
            {concept.worked_examples?.map((ex, i) => (
              <div key={i} style={{ marginBottom:16 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#059669', marginBottom:6 }}>{ex.title}</p>
                <div style={{ background:'var(--color-bg,#F8FAFC)', border:'1.5px solid #E2E8F0', borderRadius:12, padding:14 }}>
                  <p style={{ fontSize:13, fontWeight:600, color:'var(--color-text,#1E293B)', marginBottom:10 }}>Q: {ex.problem}</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:10 }}>
                    {ex.steps.map((step, j) => (
                      <div key={j} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                        <span style={{ width:20, height:20, borderRadius:'50%', background:'#059669', color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{j+1}</span>
                        <p style={{ fontSize:13, color:'#374151' }}>{step}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize:13, fontWeight:700, color:'#059669' }}>✅ Answer: {ex.answer}</p>
                  {ex.insight && (
                    <p style={{ fontSize:11, color:'var(--color-text-light,#6B7280)', marginTop:6, fontStyle:'italic', borderTop:'1px solid #E5E7EB', paddingTop:6 }}>
                      💡 {ex.insight}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {concept.common_mistakes?.length > 0 && (
              <div style={{ background:'#FEF2F2', border:'1.5px solid #FECACA', borderRadius:12, padding:12 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#DC2626', marginBottom:8 }}>⚠️ COMMON MISTAKES</p>
                {concept.common_mistakes.map((cm, i) => (
                  <div key={i} style={{ marginBottom:8 }}>
                    <p style={{ fontSize:12, color:'#DC2626' }}>✗ {cm.mistake}</p>
                    <p style={{ fontSize:12, color:'#059669' }}>✓ {cm.correct_approach}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'shortcuts':
        return (
          <div>
            <div style={{ background:'#FFFBEB', border:'1.5px solid #FDE68A', borderRadius:12, padding:14, marginBottom:14 }}>
              <p style={{ fontSize:14, fontWeight:700, color:'#92400E', marginBottom:4 }}>🧠 Memory Trick</p>
              <p style={{ fontSize:14, color:'#78350F', lineHeight:1.7 }}>{concept.mnemonic}</p>
            </div>
            {concept.shortcuts?.map((s, i) => (
              <div key={i} style={{ background:'var(--color-bg,#F8FAFC)', borderRadius:12, padding:12, marginBottom:8, borderLeft:'3px solid #D97706' }}>
                <p style={{ fontSize:13, fontWeight:700, color:'#92400E', marginBottom:4 }}>⚡ {s.trick}</p>
                <p style={{ fontSize:11, color:'#94A3B8', marginBottom:4 }}>When: {s.condition}</p>
                <p style={{ fontSize:12, color:'#059669', fontFamily:'monospace' }}>e.g. {s.example}</p>
              </div>
            ))}
            {concept.visual_pattern && (
              <div style={{ background:'var(--color-primary,#1E3A5F)', borderRadius:12, padding:14, textAlign:'center' }}>
                <pre style={{ color:'var(--color-accent, #C9A84C)', fontFamily:'monospace', fontSize:14, margin:0 }}>
                  {concept.visual_pattern}
                </pre>
              </div>
            )}
          </div>
        )

      case 'story':
        return (
          <div>
            <div style={{ background:'linear-gradient(135deg,#FDF2F8,#FCE7F3)', border:'1.5px solid #F9A8D4', borderRadius:16, padding:16, marginBottom:12 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#BE185D', marginBottom:8 }}>📖 STORY TO REMEMBER</p>
              <p style={{ fontSize:14, color:'var(--color-text,#1E293B)', lineHeight:1.9 }}>{concept.story}</p>
            </div>
            {concept.story_moral && (
              <div style={{ background:'#F0FDF4', border:'1.5px solid #BBF7D0', borderRadius:12, padding:12 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#059669', marginBottom:4 }}>💚 MORAL</p>
                <p style={{ fontSize:13, color:'#065F46' }}>{concept.story_moral}</p>
              </div>
            )}
          </div>
        )

      case 'mnemonic':
        return (
          <div>
            <div style={{ background:'linear-gradient(135deg,#FEF3C7,#FDE68A)', borderRadius:16, padding:20, marginBottom:14, textAlign:'center' }}>
              <p style={{ fontSize:28, marginBottom:8 }}>🧠</p>
              <p style={{ fontSize:18, fontWeight:800, color:'#92400E', lineHeight:1.5 }}>{concept.mnemonic}</p>
            </div>
            <div style={{ background:'#FFFBEB', borderRadius:12, padding:14 }}>
              <p style={{ fontSize:13, color:'#78350F', lineHeight:1.7 }}>{concept.mnemonic_detail}</p>
            </div>
          </div>
        )

      case 'exam_coverage':
        return (
          <div>
            <p style={{ fontSize:13, color:'#475569', marginBottom:14 }}>This concept appears across these exams:</p>
            {Object.entries(concept.exam_coverage || {}).map(([cat, exams]) => (
              <div key={cat} style={{ marginBottom:12 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>
                  {cat.replace(/_/g,' ')}
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {(Array.isArray(exams) ? exams : []).map(e => (
                    <span key={e} style={{ background:'#EFF6FF', color:'#1D4ED8', padding:'4px 10px', borderRadius:99, fontSize:11, fontWeight:600 }}>
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {concept.question_patterns?.length > 0 && (
              <div style={{ marginTop:16 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>
                  QUESTION PATTERNS
                </p>
                {concept.question_patterns.map((p, i) => (
                  <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:'1px solid #F1F5F9', alignItems:'flex-start' }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99,
                      background: p.frequency==='Very High'?'#FEE2E2':p.frequency==='High'?'#FEF3C7':'#F1F5F9',
                      color: p.frequency==='Very High'?'#991B1B':p.frequency==='High'?'#92400E':'#64748B',
                      flexShrink:0, marginTop:2 }}>
                      {p.frequency}
                    </span>
                    <div>
                      <p style={{ fontSize:12, fontWeight:600, color:'var(--color-text,#1E293B)' }}>{p.pattern}</p>
                      <p style={{ fontSize:11, color:'#94A3B8' }}>e.g. {p.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      default: return null
    }
  }

  // -- GATED VIEW ------------------------------------------------------------
  if (!loading && !hasAccess) {
    return (
      <div style={{ minHeight:'100vh', background:BG, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div style={{ background:'#fff', borderRadius:24, padding:28, maxWidth:360, textAlign:'center', border:'1.5px solid #E2E8F0' }}>
          <p style={{ fontSize:40, marginBottom:8 }}>🔒</p>
          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:NAVY, fontSize:18, marginBottom:8 }}>
            Foundation
          </h2>
          <p style={{ fontSize:13, color:'#475569', marginBottom:20, lineHeight:1.7 }}>
            Learn this topic from basics to exam-speed with worked examples, mnemonics, shortcuts and a checkpoint quiz.
          </p>

          <div style={{ background:'#FFF7E6', borderRadius:14, padding:14, marginBottom:14, border:'1px solid #FDE68A' }}>
            <p style={{ fontSize:13, fontWeight:700, color:'#92400E', marginBottom:4 }}>₹5 - This Topic Only</p>
            <p style={{ fontSize:11, color:'#78350F', marginBottom:10 }}>All 5 levels for this topic · Lifetime access</p>
            {payError && <p style={{ fontSize:11, color:'#B91C1C', marginBottom:8 }}>{payError}</p>}
            <button onClick={handleUnlockTopic} disabled={paying}
              style={{ padding:'10px 20px', background:GOLD, color:NAVY, border:'none', borderRadius:10, fontWeight:800, fontSize:13, cursor:paying?'wait':'pointer', width:'100%', opacity:paying?0.7:1 }}>
              {paying ? 'Opening payment...' : 'Unlock This Topic ₹5 →'}
            </button>
          </div>

          <div style={{ background:'#F0FDF4', borderRadius:14, padding:14, marginBottom:16, border:'1px solid #BBF7D0' }}>
            <p style={{ fontSize:13, fontWeight:700, color:'#166534', marginBottom:4 }}>💎 Pro or Ultra members</p>
            <p style={{ fontSize:11, color:'#15803D', marginBottom:10 }}>Get every Foundation topic free for a full year - no per-topic payments, ever.</p>
            <button onClick={() => navigate('/pricing')}
              style={{ width:'100%', padding:'11px', background:NAVY, color:'#fff', border:'none', borderRadius:10, fontWeight:700, fontSize:13, cursor:'pointer' }}>
              See Pro & Ultra Plans
            </button>
          </div>

          <button onClick={() => navigate(-1)} style={{ fontSize:12, color:'#94A3B8', background:'none', border:'none', cursor:'pointer' }}>
            ← Go Back
          </button>
        </div>
      </div>
    )
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:BG }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:48, height:48, border:`3px solid ${GOLD}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
        <p style={{ color:'#94A3B8', fontSize:13 }}>Loading concept...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  if (!concept) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:BG, flexDirection:'column', gap:12 }}>
      <p style={{ fontSize:40 }}>📚</p>
      <p style={{ color:'#475569', fontSize:14 }}>Concept not found for this topic + level.</p>
      <button onClick={() => navigate(-1)} style={{ padding:'10px 20px', background:NAVY, color:'#fff', border:'none', borderRadius:10, cursor:'pointer' }}>
        ← Go Back
      </button>
    </div>
  )

  const currentLayer = LAYERS[activeLayer]
  const progress     = (readLayers.size / LAYERS.length) * 100

  return (
    <div style={{ minHeight:'100vh', background:BG, fontFamily:'Inter,sans-serif', paddingBottom:80 }}>

      {/* -- HEADER -------------------------------------------------------- */}
      <div style={{ background:NAVY, color:'#fff', padding:'14px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.7)', fontSize:20, cursor:'pointer' }}>←</button>
          <div style={{ textAlign:'center' }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:2 }}>
              Level {lvl} · {concept.level_label}
            </p>
            <p style={{ fontWeight:700, fontSize:14 }}>{concept.concept_title}</p>
          </div>
          <span style={{ background:'rgba(201,168,76,0.2)', color:GOLD, padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700 }}>
            L{lvl}
          </span>
        </div>
        {/* Reading progress bar */}
        <div style={{ height:4, background:'rgba(255,255,255,0.15)', borderRadius:99, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:GOLD, borderRadius:99, transition:'width 0.4s ease' }} />
        </div>
        <p style={{ fontSize:10, color:'rgba(255,255,255,0.5)', marginTop:4, textAlign:'right' }}>
          {readLayers.size}/{LAYERS.length} layers read
        </p>
      </div>

      {/* -- SUMMARY CARD ------------------------------------------------- */}
      <div style={{ background:'linear-gradient(135deg,#FFF7E6,#FFFBF0)', padding:'14px 16px', borderBottom:'1px solid #FDE68A' }}>
        <p style={{ fontSize:13, color:'#78350F', lineHeight:1.7 }}>{concept.concept_summary}</p>
        <p style={{ fontSize:11, color:'#B45309', marginTop:4 }}>⏱️ ~{concept.read_time_mins || 5} min read</p>
      </div>

      {/* -- LAYER TABS ---------------------------------------------------- */}
      <div style={{ display:'flex', overflowX:'auto', borderBottom:'1px solid #E2E8F0', background:'#fff', scrollbarWidth:'none' }}>
        {LAYERS.map((layer, idx) => {
          const isRead   = readLayers.has(idx)
          const isActive = activeLayer === idx
          return (
            <button key={layer.key} onClick={() => goToLayer(idx)}
              style={{ flexShrink:0, padding:'10px 14px', border:'none', borderBottom:`2.5px solid ${isActive ? layer.color : 'transparent'}`,
                background: isActive ? `${layer.color}08` : 'transparent',
                cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3, minWidth:64 }}>
              <span style={{ fontSize:16, filter: isRead||isActive?'none':'grayscale(1)', opacity:isRead||isActive?1:0.4 }}>
                {layer.icon}
              </span>
              <span style={{ fontSize:9, fontWeight:700, color:isActive?layer.color:'#94A3B8', lineHeight:1.2, textAlign:'center' }}>
                {layer.label}
              </span>
              {isRead && <span style={{ width:4, height:4, borderRadius:'50%', background:layer.color }} />}
            </button>
          )
        })}
      </div>

      {/* -- ACTIVE LAYER CONTENT ------------------------------------------ */}
      <div style={{ padding:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
          <span style={{ fontSize:22 }}>{currentLayer.icon}</span>
          <div>
            <p style={{ fontSize:14, fontWeight:700, color:currentLayer.color }}>{currentLayer.label}</p>
            <p style={{ fontSize:11, color:'#94A3B8' }}>Layer {activeLayer+1} of {LAYERS.length}</p>
          </div>
        </div>

        <div style={{ background:'#fff', borderRadius:16, padding:16, border:'1.5px solid #E2E8F0', marginBottom:14 }}>
          {renderLayer()}
        </div>

        {/* Layer prev/next */}
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
          <button
            onClick={() => goToLayer(Math.max(0, activeLayer-1))}
            disabled={activeLayer === 0}
            style={{ padding:'10px 18px', border:'1.5px solid #E2E8F0', borderRadius:10, fontSize:13, color:'var(--color-text-light,#64748B)', background:'#fff', cursor:activeLayer===0?'not-allowed':'pointer', opacity:activeLayer===0?0.4:1 }}>
            ← Prev Layer
          </button>
          {activeLayer < LAYERS.length - 1 ? (
            <button
              onClick={() => goToLayer(activeLayer+1)}
              style={{ padding:'10px 18px', background:currentLayer.color, color:'#fff', border:'none', borderRadius:10, fontSize:13, fontWeight:600, cursor:'pointer' }}>
              Next Layer →
            </button>
          ) : (
            <button
              onClick={handleStartCheckpoint}
              style={{ padding:'10px 22px', background:`linear-gradient(135deg,${GOLD},#E8C96A)`, color:NAVY, border:'none', borderRadius:10, fontSize:13, fontWeight:800, cursor:'pointer' }}>
              Start Checkpoint ✅
            </button>
          )}
        </div>

        {/* Quick checkpoint button (always visible after reading 4+ layers) */}
        {readLayers.size >= 4 && activeLayer < LAYERS.length - 1 && (
          <button
            onClick={handleStartCheckpoint}
            style={{ width:'100%', padding:'13px', background:`linear-gradient(135deg,${GOLD},#E8C96A)`, color:NAVY, border:'none', borderRadius:14, fontWeight:800, fontSize:14, cursor:'pointer' }}>
            ✅ I'm Ready - Start Checkpoint
          </button>
        )}
      </div>
    </div>
  )
}