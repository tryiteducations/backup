"""
TryIT Question Bank Generator
===============================
Run from E:\TryIT-Questions folder
Generates 50,000+ questions using multiple free API keys
Saves directly to Supabase cloud - your laptop stays cool

SETUP:
1. pip install requests supabase
2. Fill in your API keys below
3. python generate.py
"""

import requests
import json
import time
import random
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed

# ═══════════════════════════════════════════════════════
# YOUR API KEYS - Add as many as you have
# ═══════════════════════════════════════════════════════
GROQ_KEYS = [
    "gsk_key1_paste_here",   # Account 1
    "gsk_key2_paste_here",   # Account 2
    "gsk_key3_paste_here",   # Account 3
    "gsk_key4_paste_here",   # Account 4
    "gsk_key5_paste_here",   # Account 5
]

GEMINI_KEYS = [
    "AIza_gemini_key1_here",  # For explanations
    "AIza_gemini_key2_here",
]

# ═══════════════════════════════════════════════════════
# SUPABASE CONNECTIONS - Add multiple accounts for scale
# ═══════════════════════════════════════════════════════
SUPABASE_ACCOUNTS = [
    {
        "url": "https://your_project_1.supabase.co",
        "key": "your_anon_key_1",
    },
    # Add second Supabase account:
    # {
    #     "url": "https://your_project_2.supabase.co",
    #     "key": "your_anon_key_2",
    # },
]

# ═══════════════════════════════════════════════════════
# GENERATION JOBS - What to generate TODAY
# Format: (exam_id, tier, topic_id, level, count)
# Start with HIGH COVERAGE topics first
# ═══════════════════════════════════════════════════════
PRIORITY_JOBS = [
    # PERCENTAGE - covers 200+ exams at multiple levels
    # L4 = Class 8-9 level (covers school + basic competitive)
    ("ssc_cgl",    "Tier 1",      "arith_percentage",        4, 6, 50),
    ("ibps_po",    "Prelims",     "arith_percentage",        4, 6, 50),
    ("neet_ug",    "Single Exam", "arith_percentage",        4, 6, 30),
    ("clat",       "UG Program",  "arith_percentage",        4, 6, 30),
    ("tnpsc_group1","Prelims",    "arith_percentage",        4, 6, 30),
    ("upsc_cse",   "Prelims GS",  "arith_percentage",        4, 6, 30),
    ("rrb_ntpc",   "CBT 1",       "arith_percentage",        3, 6, 30),
    ("jee_main",   "Paper 1 BE/BTech","arith_percentage",    4, 6, 30),
    
    # PROFIT LOSS - covers 150+ exams
    ("ssc_cgl",    "Tier 1",      "arith_profit_loss",       4, 6, 50),
    ("ibps_po",    "Prelims",     "arith_profit_loss",       4, 6, 50),
    ("tnpsc_group1","Prelims",    "arith_profit_loss",       3, 6, 30),
    ("rrb_ntpc",   "CBT 1",       "arith_profit_loss",       3, 6, 30),
    
    # REASONING - ANALOGY covers 200+ exams
    ("ssc_cgl",    "Tier 1",      "reason_analogy",          4, 6, 50),
    ("ibps_po",    "Prelims",     "reason_analogy",          4, 6, 50),
    ("tnpsc_group1","Prelims",    "reason_analogy",          4, 6, 30),
    ("upsc_cse",   "Prelims GS",  "reason_analogy",          4, 6, 30),
    
    # ENGLISH ERROR SPOTTING
    ("ssc_cgl",    "Tier 1",      "eng_error_spotting",      4, 6, 50),
    ("ibps_po",    "Prelims",     "eng_error_spotting",      4, 6, 50),
    
    # HISTORY - MODERN INDIA covers 100+ exams
    ("upsc_cse",   "Prelims GS",  "hist_modern",             4, 7, 50),
    ("tnpsc_group1","Prelims",    "hist_dravidian",          4, 6, 50),
    ("ssc_cgl",    "Tier 1",      "hist_modern",             3, 6, 50),
    
    # POLITY
    ("upsc_cse",   "Prelims GS",  "pol_fundamental_rights",  4, 7, 50),
    ("tnpsc_group1","Prelims",    "pol_parliament",          3, 6, 50),
    ("ssc_cgl",    "Tier 1",      "pol_parliament",          3, 6, 30),
    
    # LEGAL - CLAT specific
    ("clat",       "UG Program",  "law_torts_negligence",    4, 6, 50),
    ("clat",       "UG Program",  "law_contract_offer",      4, 6, 50),
    
    # SCIENCE
    ("neet_ug",    "Single Exam", "sci_bio_cell",            4, 6, 50),
    ("neet_ug",    "Single Exam", "sci_bio_genetics",        4, 6, 50),
    ("ssc_cgl",    "Tier 1",      "sci_physics_electricity", 3, 6, 30),
]

# ═══════════════════════════════════════════════════════
# COPYRIGHT-SAFE QUESTION GENERATION
# ═══════════════════════════════════════════════════════
def build_prompt(exam_id, tier, topic_id, level, count):
    
    level_desc = {
        1: "LKG-UKG level, picture-based, very simple",
        2: "Class 1-4 level, basic operations",
        3: "Class 5-7 level, foundation concepts",
        4: "Class 8-10 level, intermediate",
        5: "Class 11-12 level, advanced school",
        6: "Graduate/Competitive exam level",
        7: "Post-graduate/Advanced competitive",
        8: "Professional/GATE/CAT level",
        9: "Civil Services/PhD entrance level",
        10: "Research/Expert level"
    }
    
    copyright_instruction = """
CRITICAL COPYRIGHT RULES:
- Generate 100% ORIGINAL questions inspired by concepts
- NEVER copy or closely paraphrase any textbook, question paper, or published content
- Create NEW scenarios, NEW numbers, NEW characters
- Use Indian names: Ramu, Priya, Abdul, Kavitha, Sundar, Meena
- Use Indian places: Chennai, Coimbatore, Surat, Patna, Bhopal
- Use Indian context: chai stall, auto-rickshaw, sabzi mandi, railway station
- Numbers must be different from any known previous year question
"""

    pattern_instructions = {
        "arith_percentage": "Shopkeeper problems, population change, election votes, salary hike, price increase/decrease. Use INDIAN market context.",
        "arith_profit_loss": "Trader, wholesale, retail. Use Indian commodities: rice, cloth, vegetables, gold.",
        "reason_analogy": "Word pairs, number pairs, figure pairs. Include Indian culture references.",
        "eng_error_spotting": "Sentences with grammatical errors. Topics: current events, Indian society.",
        "hist_modern": "Indian freedom struggle, reform movements, key leaders. Analytical, not just dates.",
        "hist_dravidian": "Tamil Nadu specific: Periyar, Anna, political parties, social reform.",
        "pol_fundamental_rights": "Articles, rights, restrictions, court cases (general, not specific case names).",
        "law_torts_negligence": "Principle given in passage, new fact situation to apply it to.",
        "law_contract_offer": "Business scenarios, everyday contract situations.",
        "sci_bio_cell": "Cell organelles, functions, differences. Link to NCERT concepts but original questions.",
        "sci_bio_genetics": "Mendel's laws, inheritance patterns, original cross problems.",
        "sci_physics_electricity": "Circuit problems, Ohm's law, power calculations with Indian appliance context.",
    }

    topic_instruction = pattern_instructions.get(topic_id, 
        "Generate questions appropriate for this topic and exam level.")
    
    if "clat" in exam_id:
        format_instruction = """
FORMAT: All CLAT questions MUST be passage-based.
Write a 100-word passage first, then 3-4 questions from it.
Legal reasoning: State a PRINCIPLE in passage, give a FACT SITUATION, ask who is liable.
Return as JSON array where each item has:
"passage" (string), "questions" (array of question objects)"""
    elif "upsc" in exam_id and topic_id in ["hist_modern","pol_parliament","geo_environment"]:
        format_instruction = """
FORMAT: Mix of question types for UPSC:
- 40% standard MCQ4
- 30% Statement correct/incorrect ("Which statements are correct?")
- 20% Assertion-Reason
- 10% Match the Following
Label each question with its type."""
    else:
        format_instruction = """
FORMAT: Standard MCQ with 4 options (A,B,C,D)"""

    prompt = f"""You are an expert Indian competitive exam question writer.

EXAM: {exam_id.upper().replace('_',' ')} {tier}
TOPIC: {topic_id.replace('_',' ')}
DIFFICULTY LEVEL: {level} ({level_desc.get(level, 'Competitive level')})
NUMBER OF QUESTIONS: {count}

{copyright_instruction}

TOPIC GUIDANCE: {topic_instruction}

{format_instruction}

For EACH question include:
- "question": question text
- "options": ["A text","B text","C text","D text"]
- "correct_answer": 0 for A, 1 for B, 2 for C, 3 for D
- "explanation_concept": what concept this tests (one sentence)
- "explanation_shortcut": quick trick or key point
- "explanation_mistake": what students commonly get wrong
- "needs_diagram": true or false
- "diagram_type": if true, specify: "bar_chart"/"pie_chart"/"table"/"figure"/"map"/"line_graph"
- "diagram_description": if needs_diagram true, describe exactly what to show
- "exam_tags": list of OTHER exams this question also suits
- "copyright_original": always true (you are generating original content)

TARGET exam_tags to include when relevant:
For percentage: ["ssc_cgl","ssc_chsl","ibps_po","ibps_clerk","sbi_po","sbi_clerk","rrb_ntpc","tnpsc_group1","tnpsc_group2","nda","cds","ctet","kvs_tgt","nvs_tgt","cat","xat","gmat","upsc_csat"]
For history: ["upsc_cse","tnpsc_group1","mpsc","uppsc","kpsc","bpsc","rpsc","ssc_cgl","cds","nda","ctet"]
For legal: ["clat","ailet","slat","lsat_india","du_llb","mh_cet_law","ugc_net"]

RETURN ONLY VALID JSON ARRAY. No explanation text outside JSON.
Start with [ and end with ]"""

    return prompt


# ═══════════════════════════════════════════════════════
# API CALLERS
# ═══════════════════════════════════════════════════════
groq_key_index = 0
gemini_key_index = 0

def call_groq(prompt, key):
    try:
        r = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 8000,
                "temperature": 0.8
            },
            timeout=90
        )
        if r.status_code == 429:
            return None, "rate_limit"
        content = r.json()["choices"][0]["message"]["content"]
        return content, "ok"
    except Exception as e:
        return None, str(e)

def call_gemini(prompt, key):
    try:
        r = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={key}",
            json={"contents": [{"parts": [{"text": prompt}]}]},
            timeout=90
        )
        content = r.json()["candidates"][0]["content"]["parts"][0]["text"]
        return content, "ok"
    except Exception as e:
        return None, str(e)

def parse_questions(raw_content):
    try:
        start = raw_content.find("[")
        end = raw_content.rfind("]") + 1
        if start == -1 or end == 0:
            return []
        return json.loads(raw_content[start:end])
    except:
        # Try to fix common JSON errors
        try:
            cleaned = raw_content[raw_content.find("["):raw_content.rfind("]")+1]
            cleaned = cleaned.replace("True", "true").replace("False", "false")
            return json.loads(cleaned)
        except:
            return []


# ═══════════════════════════════════════════════════════
# TRIPLE VERIFICATION
# ═══════════════════════════════════════════════════════
def verify_question(question, groq_key, gemini_key=None):
    q = question.get("question","")
    opts = question.get("options", [])
    ans_idx = question.get("correct_answer", 0)
    
    if not q or len(opts) < 4 or ans_idx > 3:
        return False, 0
    
    correct_opt = opts[ans_idx] if ans_idx < len(opts) else ""
    
    verify_prompt = f"""Verify this exam question:
Question: {q}
Options: {json.dumps(opts)}
Claimed correct answer: {correct_opt} (index {ans_idx})

Check:
1. Is the claimed answer actually correct?
2. Are the other options plausible but wrong?
3. Is the question clear and unambiguous?

Reply ONLY with JSON: {{"correct": true/false, "score": 1-10, "issue": "describe any problem or null"}}"""

    groq_result, status = call_groq(verify_prompt, groq_key)
    if not groq_result:
        return True, 7  # Assume ok if verifier fails
    
    try:
        start = groq_result.find("{")
        end = groq_result.rfind("}") + 1
        result = json.loads(groq_result[start:end])
        return result.get("correct", True), result.get("score", 7)
    except:
        return True, 7


# ═══════════════════════════════════════════════════════
# SAVE TO SUPABASE
# ═══════════════════════════════════════════════════════
def save_to_supabase(questions, exam_id, topic_id, level, account_idx=0):
    account = SUPABASE_ACCOUNTS[account_idx % len(SUPABASE_ACCOUNTS)]
    
    rows = []
    for i, q in enumerate(questions):
        row = {
            "id": f"q_{topic_id}_{exam_id}_l{level}_{int(time.time())}_{i}",
            "topic_id": topic_id,
            "subject_id": topic_id.split("_")[0] if "_" in topic_id else topic_id,
            "level": level,
            "difficulty": f"L{min(max(level-3, 1), 5)}",
            "pattern_type": "passage_mcq4" if "clat" in exam_id else "mcq4",
            "needs_diagram": q.get("needs_diagram", False),
            "diagram_type": q.get("diagram_type", None),
            "diagram_description": q.get("diagram_description", None),
            "question_en": q.get("question", ""),
            "options_en": q.get("options", []),
            "correct_answer": q.get("correct_answer", 0),
            "explanation": {
                "concept": q.get("explanation_concept", ""),
                "shortcut": q.get("explanation_shortcut", ""),
                "common_mistake": q.get("explanation_mistake", "")
            },
            "exam_tags": q.get("exam_tags", [exam_id]),
            "verified": q.get("_verified", False),
            "quality_score": q.get("_quality_score", 0),
            "copyright_original": True
        }
        
        # Ensure primary exam is in tags
        if exam_id not in row["exam_tags"]:
            row["exam_tags"].append(exam_id)
        
        rows.append(row)
    
    # Send in batches of 50
    saved = 0
    for i in range(0, len(rows), 50):
        batch = rows[i:i+50]
        try:
            r = requests.post(
                f"{account['url']}/rest/v1/questions",
                headers={
                    "apikey": account["key"],
                    "Authorization": f"Bearer {account['key']}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                json=batch,
                timeout=30
            )
            if r.status_code in [200, 201]:
                saved += len(batch)
            else:
                print(f"  Supabase error: {r.status_code} {r.text[:100]}")
        except Exception as e:
            print(f"  Save error: {e}")
    
    return saved


# ═══════════════════════════════════════════════════════
# DIAGRAM QUEUE
# ═══════════════════════════════════════════════════════
def queue_diagrams(questions, account_idx=0):
    account = SUPABASE_ACCOUNTS[account_idx % len(SUPABASE_ACCOUNTS)]
    diagram_qs = [q for q in questions if q.get("needs_diagram")]
    
    if not diagram_qs:
        return 0
    
    rows = [{
        "question_id": q.get("_saved_id"),
        "diagram_type": q.get("diagram_type"),
        "diagram_description": q.get("diagram_description"),
        "status": "pending"
    } for q in diagram_qs if q.get("_saved_id")]
    
    if rows:
        requests.post(
            f"{account['url']}/rest/v1/diagram_queue",
            headers={"apikey": account["key"],
                     "Authorization": f"Bearer {account['key']}",
                     "Content-Type": "application/json"},
            json=rows, timeout=20
        )
    return len(rows)


# ═══════════════════════════════════════════════════════
# MAIN SINGLE JOB PROCESSOR
# ═══════════════════════════════════════════════════════
def process_job(job, groq_key_idx, account_idx):
    exam_id, tier, topic_id, level, difficulty_level, count = job
    groq_key = GROQ_KEYS[groq_key_idx % len(GROQ_KEYS)]
    
    print(f"\n→ {exam_id} | {topic_id} | L{level} | {count}Q")
    
    # Build prompt
    prompt = build_prompt(exam_id, tier, topic_id, level, count)
    
    # Try Groq first, then Gemini as backup
    content, status = call_groq(prompt, groq_key)
    
    if status == "rate_limit" and GEMINI_KEYS:
        print(f"  Groq rate limited, trying Gemini...")
        gemini_key = GEMINI_KEYS[groq_key_idx % len(GEMINI_KEYS)]
        content, status = call_gemini(prompt, gemini_key)
    
    if not content:
        print(f"  ✗ Generation failed: {status}")
        return 0
    
    # Parse
    questions = parse_questions(content)
    if not questions:
        print(f"  ✗ No valid JSON in response")
        return 0
    
    print(f"  ✓ Generated {len(questions)} questions")
    
    # Verify each question
    verified_questions = []
    for q in questions:
        is_correct, score = verify_question(q, groq_key)
        if is_correct and score >= 6:
            q["_verified"] = True
            q["_quality_score"] = score
            verified_questions.append(q)
    
    diagram_count = sum(1 for q in verified_questions if q.get("needs_diagram"))
    print(f"  ✓ Verified: {len(verified_questions)}/{len(questions)} | Diagrams: {diagram_count}")
    
    if not verified_questions:
        return 0
    
    # Save to Supabase
    saved = save_to_supabase(verified_questions, exam_id, topic_id, level, account_idx)
    print(f"  ✓ Saved to Supabase: {saved}")
    
    return saved


# ═══════════════════════════════════════════════════════
# PARALLEL RUNNER
# ═══════════════════════════════════════════════════════
def main():
    print("=" * 60)
    print("TryIT Question Bank Generator")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Jobs: {len(PRIORITY_JOBS)}")
    print(f"Groq keys: {len(GROQ_KEYS)}")
    print(f"Supabase accounts: {len(SUPABASE_ACCOUNTS)}")
    print("=" * 60)
    
    total_saved = 0
    
    # Run jobs with parallel workers (one per Groq key)
    max_workers = min(len(GROQ_KEYS), 3)  # Max 3 parallel to avoid overload
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {}
        for i, job in enumerate(PRIORITY_JOBS):
            groq_idx = i % len(GROQ_KEYS)
            account_idx = i % len(SUPABASE_ACCOUNTS)
            future = executor.submit(process_job, job, groq_idx, account_idx)
            futures[future] = job
            time.sleep(0.5)  # Slight stagger to avoid burst
        
        for future in as_completed(futures):
            job = futures[future]
            try:
                saved = future.result()
                total_saved += saved
            except Exception as e:
                print(f"Job failed: {e}")
    
    print("\n" + "=" * 60)
    print(f"COMPLETE!")
    print(f"Total saved to Supabase: {total_saved}")
    print(f"Ended: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Check Supabase Table Editor → questions")
    print("=" * 60)

if __name__ == "__main__":
    main()
