#!/bin/bash
# ══════════════════════════════════════════════════════════════════
# TryIT Educations — install_missing_parts.sh
# Installs ALL missing components in one shot
# Usage: chmod +x install_missing_parts.sh && ./install_missing_parts.sh
# ══════════════════════════════════════════════════════════════════
set -e
ROOT="${1:-/workspaces/tryit-cloud}"
cd "$ROOT" || { echo "❌ Cannot cd to $ROOT"; exit 1; }
echo "📦 Installing missing TryIT components into $ROOT ..."

# ── Create all needed directories ────────────────────────────────
mkdir -p src/mocks
mkdir -p src/utils
mkdir -p src/context
mkdir -p src/lib
mkdir -p src/components/push
mkdir -p src/components/id-card
mkdir -p src/pages/centre
mkdir -p src/pages/admin
mkdir -p src/pages/mentor
mkdir -p src/pages/student
mkdir -p scripts
mkdir -p public/data

# ══════════════════════════════════════════════════════════════════
# SECTION 1 — 7-Layer Explanation + Mock Questions
# ══════════════════════════════════════════════════════════════════
echo "  [1/13] SevenLayerExplanation + mock data..."

cat > src/mocks/questionsWith7Layers.js << 'JSEOF'
// src/mocks/questionsWith7Layers.js
// 5 enriched questions, each with 7-layer explanations in 3 language tones

const Q = [
  {
    id: "q7l-001",
    exam_id: "ssc-cgl",
    topic: "profit-loss",
    difficulty: 3,
    syllabus_weightage: 0.12,
    question_text: "A shopkeeper sells an item for ₹520 and earns 30% profit. What is the cost price?",
    options: { A: "₹400", B: "₹380", C: "₹420", D: "₹350" },
    correct_option: "A",
    explanations: {
      "en": {
        simple_answer:       "CP = SP ÷ (1 + profit%) = 520 ÷ 1.3 = ₹400.",
        deep_concept:        "Profit % is always calculated on COST price, not selling price. SP = CP × (1 + P/100). So CP = SP / (1 + P/100).",
        wrong_option_autopsy:"₹380 → mistake of doing 520 - 30% of 520 = 520 - 156 = 364, wrong formula. ₹420 → adds instead of divides. ₹350 → random subtraction error.",
        memory_trick:        "CP PLUS profit% OF CP = SP. So CP × 1.3 = 520. Think: 'I COST you 400, you SELL for 520, your PROFIT is 120 = 30% of 400.' 🧠",
        cultural_story:      "Like a chai tapri uncle who buys tea leaves for ₹100 and sells chai for ₹130 — his profit is ₹30 on what he paid (₹100), i.e., 30%.",
        exam_tip:            "SSC CGL always asks this from the SELLING PRICE side. Memorise: CP = 100/(100+P%) × SP. In exam, do it in 15 seconds.",
        pyq_relevance:       "This exact type appeared in SSC CGL 2019 Tier 1 (Shift 2, Q.14) and SSC CHSL 2021. Expected in every exam."
      },
      "ta-machan": {
        simple_answer:       "Machan, CP = 520 ÷ 1.3 = ₹400 da. Simple calculation!",
        deep_concept:        "Da, profit percentage ALWAYS cost price mela calculate aagum, selling price mela illa. SP = CP × (1 + P/100) nu formula. Ade reverse pannaa CP kidaikum.",
        wrong_option_autopsy:"₹380 select pannuvaainga — avanga 520 la 30% kazhichu 364 solluvaanga. Adhu WRONG machan. Profit SP mela illa, CP mela.",
        memory_trick:        "Idha try panna: 'Naan 400 ku vaanginen, 520 ku vittaen, profit 120. 120 ÷ 400 = 30%' nu check pannu. Correct!",
        cultural_story:      "Namma sarakku kadai uncle 100 ku vaangi 130 ku vittaa — 30 rupee profit, adhu 30% of cost price. Adhe logic da!",
        exam_tip:            "SSC la idha type question 2 mark. 15 second la panna mudiyum: 520 ÷ 1.3 = 400. Calculator allowed illa, so head calculation practice pannu.",
        pyq_relevance:       "SSC CGL 2019 la neria varuchu machan. Every year 2-3 questions idhe topic la varuchu."
      },
      "hi-bhai": {
        simple_answer:       "Bhai, CP = 520 ÷ 1.3 = ₹400. Simple hai!",
        deep_concept:        "Yaar, profit percentage HAMESHA cost price pe calculate hota hai, selling price pe nahi. SP = CP × (1 + P/100). Iska reverse karo to CP milega.",
        wrong_option_autopsy:"₹380 wale ne SP se 30% ghata diya — ye galat hai bhai. Profit SP ka percentage nahi, CP ka percentage hota hai.",
        memory_trick:        "Aise yaad karo: 'Main 400 mein kharida, 520 mein becha, mujhe 120 ka faayda. 120 ÷ 400 = 30%.' Direct formula: CP = SP ÷ 1.30.",
        cultural_story:      "Jaise sabzi wala uncle 100 mein saman laata hai aur 130 mein bechta hai — 30 rupaye ka munafa, jo uske kharide price ka 30% hai.",
        exam_tip:            "SSC CGL mein har saal 2-3 aise sawaal aate hain. 15 second mein karo: SP ÷ (1 + P%) = CP.",
        pyq_relevance:       "SSC CGL 2019 Tier 1, SSC CHSL 2021 mein exactly aisa hi sawaal aaya tha. Pakka aayega."
      }
    }
  },
  {
    id: "q7l-002",
    exam_id: "upsc-cse",
    topic: "polity-constitution",
    difficulty: 4,
    syllabus_weightage: 0.18,
    question_text: "Which article of the Indian Constitution abolishes untouchability?",
    options: { A: "Article 14", B: "Article 17", C: "Article 21", D: "Article 15" },
    correct_option: "B",
    explanations: {
      "en": {
        simple_answer:       "Article 17 abolishes untouchability in any form and makes its practice a punishable offence.",
        deep_concept:        "Part III (Articles 12-35) deals with Fundamental Rights. Article 17 is unique — it's one of the few Articles that abolishes a social evil by name. It is enforceable against private individuals, not just the state (unlike most FRs).",
        wrong_option_autopsy:"Art 14 = Right to Equality before law. Art 15 = Prohibition of discrimination on grounds of religion, race, sex. Art 21 = Right to Life. None of these specifically abolish untouchability.",
        memory_trick:        "17 = 1+7 = 8. Untouchability has 8 letters? No — easier: '17 se aazaadi' — just like 1947 gave India freedom, Article 17 gives lower castes freedom from untouchability.",
        cultural_story:      "Dr. B.R. Ambedkar, architect of the Constitution, was himself a victim of untouchability. Article 17 was his personal victory embedded in the Constitution.",
        exam_tip:            "UPSC Prelims tests this every 3-4 years. Remember: Art 17 = untouchability; Art 18 = abolishes titles (except military/academic). These are next to each other!",
        pyq_relevance:       "UPSC Prelims 2014, 2018. Also tested in state PSCs. High probability for 2026."
      },
      "ta-machan": {
        simple_answer:       "Machan, Article 17 taan teeyndamai ottukku vasapaattu seiyum.",
        deep_concept:        "Constitution la Part III (Articles 12-35) Fundamental Rights paththi sollum. Article 17 special da — oru social evil-ai specifically address panni abolish pannuchu. Private individual-aium apply aagum, not just government.",
        wrong_option_autopsy:"14 = equality before law; 15 = discrimination against religion/race/sex; 21 = right to life. Ellame important da, but untouchability specifically 17 mattan.",
        memory_trick:        "17 = 1947 la india independence; adhe maadiri 17 number article teeyndamai la irundhu liberation kudukuchu. Memory hook: '17 = freedom from untouchability'.",
        cultural_story:      "Ambedkar sir taan Constitution ezhuthinaranga. Avanga neram untouchability endure pannaaanga. So Article 17 avangalukkae oru personal victory da.",
        exam_tip:            "UPSC la Article 17 & 18 pair ah varum. 17 = untouchability, 18 = titles abolished. Eppavum pair ah padikka.",
        pyq_relevance:       "2014, 2018 UPSC la varuchu. State PSC la ellamaatum varuchu. High priority machan."
      },
      "hi-bhai": {
        simple_answer:       "Bhai, Article 17 chhutachoot (untouchability) ko khatam karta hai.",
        deep_concept:        "Constitution ka Part III (Articles 12-35) Fundamental Rights ke baare mein hai. Article 17 khaas hai — yeh ek social burai ko directly abolish karta hai. Yeh private logon par bhi laagu hota hai, sirf government par nahi.",
        wrong_option_autopsy:"14 = kanoon ke samne baraabari; 15 = dharm/jaati ke aadhar par bhedbhav nahi; 21 = jeene ka adhikaar. Teeno galat hain bhai, chhutachoot ke liye sirf 17 yaad rakho.",
        memory_trick:        "1947 mein azaadi mili, Article 17 se chhutachoot se azaadi mili. 17 = azaadi wala number!",
        cultural_story:      "Dr. Ambedkar khud chhutachoot ke shikaar the. Article 17 unka sapna tha jo unhone Constitution mein likha.",
        exam_tip:            "Article 17 aur 18 sath yaad karo: 17 = chhutachoot khatam, 18 = titles khatam. UPSC mein dono saath poochhe jaate hain.",
        pyq_relevance:       "UPSC Prelims 2014, 2018 mein aaya. 2026 mein bhi aane ki puri sambhavna hai bhai."
      }
    }
  },
  {
    id: "q7l-003",
    exam_id: "neet-ug",
    topic: "biology-genetics",
    difficulty: 4,
    syllabus_weightage: 0.15,
    question_text: "In Mendel's experiment, when he crossed pure tall plants (TT) with pure dwarf plants (tt), all F1 plants were tall. This demonstrates which principle?",
    options: { A: "Law of Independent Assortment", B: "Law of Segregation", C: "Law of Dominance", D: "Incomplete Dominance" },
    correct_option: "C",
    explanations: {
      "en": {
        simple_answer:       "Law of Dominance: when two contrasting alleles are present, only the dominant one (T) expresses itself in F1.",
        deep_concept:        "Mendel's three laws: 1) Dominance — dominant allele masks recessive. 2) Segregation — alleles separate during gamete formation. 3) Independent Assortment — genes on different chromosomes assort independently. TT × tt → all Tt (tall) demonstrating Dominance.",
        wrong_option_autopsy:"Segregation would be shown at F2 (3:1 ratio). Independent Assortment needs 2 traits. Incomplete Dominance would show intermediate phenotype (medium height) — not seen here.",
        memory_trick:        "DomInAnce = D for 'DAD is taller' — tall is DOMINANT. In F1 all are tall = Dominance. F2 has 3:1 = Segregation showing.",
        cultural_story:      "Mendel was a monk in a monastery. He grew peas in his garden and patiently counted 10,000+ peas. Like how you study one topic deeply — he mastered just pea plants.",
        exam_tip:            "NEET tests Mendel in a 5-question cluster. Dominance = F1 all one type. Segregation = F2 ratio 3:1. Independent assortment = dihybrid 9:3:3:1.",
        pyq_relevance:       "NEET 2017, 2019, 2021 had Mendel questions. This type repeats every year — 2 marks guaranteed."
      },
      "ta-machan": {
        simple_answer:       "Da, F1 la ellame tall — adhu Law of Dominance nu solluchu. Dominant allele (T) recessive-a (t) hide pannuduchu.",
        deep_concept:        "Mendel 3 laws: 1) Dominance — oru allele maveru allele-a dominate pannum. 2) Segregation — gamete la allele pirinju pogum. 3) Independent Assortment — vera vera chromosome la ulna genes independently assort aagum.",
        wrong_option_autopsy:"Segregation F2 la (3:1 ratio) theriyum machan. Independent Assortment ku 2 traits venum. Incomplete dominance la intermediate phenotype varum — adhu illai inge.",
        memory_trick:        "'Dominant = D for Daddy' — tall = dominant like dad! F1 all tall = dominance law. F2 la 3:1 varuchu = segregation.",
        cultural_story:      "Mendel oru monk. Avanukku oru garden irundhuchu. 10,000+ pea plants count pannaarange. Patience da! Adhe maadiri nee oru topic la deep ah padikka.",
        exam_tip:            "NEET la Mendel cluster 5 questions. Dominance = F1 all same. Segregation = F2 3:1. Dihybrid = 9:3:3:1. Idu manapaadham.",
        pyq_relevance:       "NEET 2017, 2019, 2021 la vandhuchu machan. Every year varuchu. 2 marks guaranteed."
      },
      "hi-bhai": {
        simple_answer:       "Bhai, F1 mein sab tall hue — yeh Law of Dominance dikhata hai. Dominant allele (T) ne recessive (t) ko chhupa diya.",
        deep_concept:        "Mendel ke 3 niyam: 1) Dominance — ek allele doosre ko dominate karta hai. 2) Segregation — gamete banate waqt allele alag ho jaate hain. 3) Independent Assortment — alag chromosomes ke genes swatantra roop se assort hote hain.",
        wrong_option_autopsy:"Segregation F2 mein dikhai deta hai (3:1 ratio). Independent Assortment ke liye 2 traits chahiye. Incomplete dominance mein intermediate phenotype hota — yahan nahi hai bhai.",
        memory_trick:        "'Dominant = D for Dada (elder brother)' — tall = dominant. F1 sab tall = Dominance. F2 mein 3:1 = Segregation.",
        cultural_story:      "Mendel ek monk the. Unke paas monastery garden tha. 10,000+ peas gine unhone. Patience se kiya — tu bhi ek topic ko depth mein padh.",
        exam_tip:            "NEET mein Mendel cluster mein 5 sawaal aate hain. Dominance = F1 same phenotype. Segregation = F2 3:1. Dihybrid = 9:3:3:1. Ratta maar de bhai.",
        pyq_relevance:       "NEET 2017, 2019, 2021 mein aaya. Har saal 2 aise sawaal pakke aate hain."
      }
    }
  },
  {
    id: "q7l-004",
    exam_id: "ibps-po",
    topic: "reasoning-puzzles",
    difficulty: 3,
    syllabus_weightage: 0.14,
    question_text: "In a row of 5 persons A, B, C, D, E: A is to the right of B; C is to the left of D; E is at the extreme right; B is not at the extreme left. Who is at the extreme left?",
    options: { A: "A", B: "C", C: "B", D: "D" },
    correct_option: "B",
    explanations: {
      "en": {
        simple_answer:       "C is at extreme left. Arrangement: C D A B E (left to right).",
        deep_concept:        "Solve step by step: 1) E is at position 5. 2) A is right of B → B_A pattern. 3) B is NOT at extreme left → B≠1. 4) C is left of D → C_D pattern. 5) Fit C, D, B, A, E = C D B A E doesn't work. Try: C D A B E — C left of D ✓, A right of B ✓, B not extreme left ✓, E at extreme right ✓.",
        wrong_option_autopsy:"A is at position 3, not leftmost. B is at 4. D is at 2. C at 1 is the answer. Common mistake: forgetting B≠extreme left constraint.",
        memory_trick:        "Fix E at 5 first (anchor). Then place CD together (C before D). Then BA together (B before A). Fit them in: C-D, then B-A, fill positions: C D _ B A E? No, only 5 seats: C D A B E.",
        cultural_story:      "Like arranging cricket batting order — some players MUST bat before others. Logic puzzles are just 'who bats where' problems!",
        exam_tip:            "IBPS PO has 5-seat arrangement puzzles in Reasoning section. Spend max 2 min. Always start with the FIXED point (E at extreme right). Eliminate options fast.",
        pyq_relevance:       "IBPS PO 2020, 2022 Prelims had similar 5-person seating. 3-4 questions from seating every exam."
      },
      "ta-machan": {
        simple_answer:       "Machan, C extreme left la irukkan. Order: C D A B E.",
        deep_concept:        "Step by step paakaalam: 1) E = position 5 (fixed). 2) A right of B → ...B...A... 3) B extreme left illa → B≠1. 4) C left of D → ...C...D... 5) Fit pannaa: C D A B E — C<D ✓, A right of B ✓, B not extreme left ✓, E at 5 ✓.",
        wrong_option_autopsy:"A position 3 la, B position 4 la, D position 2 la irukkaanga. C mattum extreme left la irukkaan. B≠extreme left constraint mariandha inga mistake.",
        memory_trick:        "E anchor pannu first (position 5). Then C-D pair fix pannu. Then B-A pair fix pannu. Fit: C D A B E — 5 seats correct!",
        cultural_story:      "Cricket batting order maadiri da — aarambha opener, last la finisher. Logic puzzle = batting order problem!",
        exam_tip:            "IBPS la seating arrangement 3-4 questions varuchu. Max 2 min spend pannu. Fixed point la irundhu start pannu.",
        pyq_relevance:       "IBPS PO 2020, 2022 Prelims la similar vandhuchu. Every exam la guaranteed."
      },
      "hi-bhai": {
        simple_answer:       "Bhai, C sabse baayi taraf (extreme left) hai. Order: C D A B E.",
        deep_concept:        "Step by step: 1) E = position 5 (fixed). 2) A, B ke daaye → B_A. 3) B extreme left nahi → B≠1. 4) C, D ke baaye → C_D. 5) Fit karo: C D A B E — sab conditions poori hoti hain.",
        wrong_option_autopsy:"A position 3 par, B position 4 par, D position 2 par hain. C hi extreme left par hai. Galti aati hai jab B≠extreme left condition bhool jaate hain.",
        memory_trick:        "Pehle E ko anchor karo (position 5). Fir C-D pair fix karo. Fir B-A pair fix karo. C D A B E mein sab fit hota hai!",
        cultural_story:      "Cricket mein opener pehle, finisher baad mein aata hai. Logic puzzle bhi aisa hi hai — kuch log pehle, kuch baad mein!",
        exam_tip:            "IBPS PO mein seating arrangement ke 3-4 sawaal aate hain. Fixed point se shuru karo, baaki fit karo. Max 2 minute.",
        pyq_relevance:       "IBPS PO 2020, 2022 Prelims mein similar sawaal aaya. Har exam mein pakka aata hai bhai."
      }
    }
  },
  {
    id: "q7l-005",
    exam_id: "ssc-cgl",
    topic: "gk-history",
    difficulty: 2,
    syllabus_weightage: 0.08,
    question_text: "The Battle of Plassey (1757) was fought between the British East India Company and whom?",
    options: { A: "Tipu Sultan", B: "Nawab Siraj-ud-Daulah", C: "Mughal Emperor Aurangzeb", D: "Hyder Ali" },
    correct_option: "B",
    explanations: {
      "en": {
        simple_answer:       "Nawab Siraj-ud-Daulah of Bengal lost the Battle of Plassey to Clive in 1757, giving British control over Bengal.",
        deep_concept:        "Plassey 1757 is the turning point of Indian history. Robert Clive led East India Company. Siraj-ud-Daulah was the last independent Nawab of Bengal. Mir Jafar (Siraj's general) betrayed him by not fighting. This betrayal is why Mir Jafar is synonymous with 'traitor' in India.",
        wrong_option_autopsy:"Tipu Sultan — fought in 1790s, Mysore wars. Aurangzeb — died 1707, 50 years before Plassey. Hyder Ali — Tipu's father, also Mysore, not Bengal.",
        memory_trick:        "7-5-7: Battle of Plassey = 1757. Siraj = S for Seven-teen-fifty-seven (17-57). 'Robert Clive CLAIMED Bengal in 1757.'",
        cultural_story:      "Siraj-ud-Daulah locked 146 British prisoners in a small room called 'Black Hole of Calcutta'. This enraged the British. So Clive attacked. Mir Jafar's betrayal decided the outcome — a lesson that internal betrayal is often the real enemy.",
        exam_tip:            "SSC, UPSC, all exams test: 1757 = Plassey, 1764 = Buxar. Don't confuse them! Plassey = first key victory, Buxar = bigger political control.",
        pyq_relevance:       "SSC CGL, CHSL, Railway NTPC — asked at least once every 2 years. Simple but tricky with the options."
      },
      "ta-machan": {
        simple_answer:       "Machan, 1757 la Plassey la Nawab Siraj-ud-Daulah British East India Company kita thotraarange.",
        deep_concept:        "Plassey 1757 = Indian history turning point. Robert Clive EIC-lead pannaarange. Siraj-ud-Daulah Bengal last independent nawab. Mir Jafar (Siraj general) betray pannaarange — so British won.",
        wrong_option_autopsy:"Tipu Sultan = Mysore wars 1790s. Aurangzeb = 1707 la died, 50 years before. Hyder Ali = Tipu appan, Mysore, Bengal illa.",
        memory_trick:        "'Plassey = 57 number year.' 1757. Siraj = S. Robert Clive = Bengal claim pannaarange 1757 la. Yaad varum da.",
        cultural_story:      "Siraj 146 British-a oru small room la poottu vechu — Black Hole of Calcutta. Adhu British-a angry pannuchu. Clive attack pannaarange. Mir Jafar betray pannaarange — internal betrayal biggest enemy da.",
        exam_tip:            "1757 = Plassey, 1764 = Buxar — confuse aagaadhe! Plassey = first key victory. Buxar = political control. SSC la idu always varuchu.",
        pyq_relevance:       "SSC CGL, CHSL, Railway NTPC — every 2 years oru time varuchu. Simple question, wrong options la confuse aagaadhey."
      },
      "hi-bhai": {
        simple_answer:       "Bhai, 1757 mein Plassey ki ladaai mein Nawab Siraj-ud-Daulah British se haare.",
        deep_concept:        "Plassey 1757 = Indian history ka turning point. Robert Clive ne EIC lead kiya. Siraj-ud-Daulah Bengal ke last independent Nawab the. Mir Jafar (Siraj ka general) ne dhokha diya — isliye British jeet gaye.",
        wrong_option_autopsy:"Tipu Sultan = Mysore wars 1790s mein. Aurangzeb = 1707 mein mare, Plassey se 50 saal pehle. Hyder Ali = Tipu ke baap, Mysore mein the, Bengal nahi.",
        memory_trick:        "1-7-5-7 = Plassey. '57 mein bhi azaadi ki laraai' yaad karo (1857 Revolt bhi 57 ata hai!). Siraj = Bengal wale, Clive = Company wala.",
        cultural_story:      "Siraj ne 146 Angrezi qaidiyyon ko ek chhoti si room mein band kar diya — 'Black Hole of Calcutta'. Angrezi gusaa gaye. Clive ne hamla kiya. Mir Jafar ne dhoka diya — anduruni gaddaari hi asli dushman thi.",
        exam_tip:            "1757 = Plassey, 1764 = Buxar — confuse mat karna bhai! Plassey = pehli badi jeet, Buxar = zyada political control. SSC mein hamesha aata hai.",
        pyq_relevance:       "SSC CGL, CHSL, Railway NTPC mein har 2 saal mein ek baar aata hai. Simple sawaal, lekin options mein chakkar dete hain."
      }
    }
  }
];

export default Q;
JSEOF

cat > src/components/SevenLayerExplanation.jsx << 'JSEOF'
import { useState, useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'

const LAYERS = [
  { key: 'simple_answer',       icon: '💡', label: 'Simple Answer'       },
  { key: 'deep_concept',        icon: '🧠', label: 'Deep Concept'        },
  { key: 'wrong_option_autopsy',icon: '🔍', label: 'Why Others Are Wrong' },
  { key: 'memory_trick',        icon: '🎯', label: 'Memory Trick'        },
  { key: 'cultural_story',      icon: '📖', label: 'Story / Context'     },
  { key: 'exam_tip',            icon: '⚡', label: 'Exam Strategy Tip'   },
  { key: 'pyq_relevance',       icon: '📅', label: 'PYQ Relevance'       },
]

export default function SevenLayerExplanation({ question, isCorrect }) {
  const { langTone } = useContext(LanguageContext)
  const [expanded, setExpanded]   = useState(false)
  const [openLayer, setOpenLayer] = useState(null)

  // Pick explanation object for current language, fallback to English
  const expl =
    question.explanations?.[langTone] ||
    question.explanations?.['en'] ||
    {}

  return (
    <div style={{ marginTop: 12 }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: expanded
            ? 'linear-gradient(135deg,#1E3A5F,#0F2140)'
            : 'rgba(30,58,95,0.08)',
          border: '1.5px solid rgba(30,58,95,0.2)',
          borderRadius: 12, padding: '10px 16px',
          cursor: 'pointer', width: '100%',
          justifyContent: 'space-between',
          transition: 'all 0.2s',
        }}
      >
        <span style={{
          fontFamily: 'Poppins,sans-serif', fontWeight: 700,
          fontSize: 13, color: expanded ? '#D4AF37' : '#1E3A5F',
        }}>
          📚 Show 7-Layer Explanation
        </span>
        <span style={{ color: expanded ? '#D4AF37' : '#1E3A5F', fontSize: 16 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 8, border: '1.5px solid rgba(30,58,95,0.15)',
              borderRadius: 16, overflow: 'hidden',
            }}>
              {LAYERS.map((layer, i) => (
                <div key={layer.key}>
                  <button
                    onClick={() => setOpenLayer(openLayer === layer.key ? null : layer.key)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', padding: '12px 16px',
                      background: openLayer === layer.key
                        ? 'rgba(212,175,55,0.1)'
                        : i % 2 === 0 ? '#FAFBFC' : '#FFFFFF',
                      border: 'none', borderBottom: '1px solid #F1F5F9',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600,
                      fontSize: 13, color: '#1E3A5F' }}>
                      {layer.icon} {layer.label}
                    </span>
                    <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: 14 }}>
                      {openLayer === layer.key ? '▲' : '▼'}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openLayer === layer.key && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          padding: '14px 18px',
                          background: 'rgba(212,175,55,0.05)',
                          fontFamily: 'Inter,sans-serif', fontSize: 14,
                          color: '#334155', lineHeight: 1.7,
                          borderBottom: '1px solid #F1F5F9',
                          whiteSpace: 'pre-line',
                        }}>
                          {expl[layer.key] || 'Explanation not available in this language yet.'}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
JSEOF

echo "    ✅ Section 1 done"
# ══════════════════════════════════════════════════════════════════
# SECTION 2 — LanguageContext + LanguageSelector
# ══════════════════════════════════════════════════════════════════
echo "  [2/13] LanguageContext + LanguageSelector..."

cat > src/context/LanguageContext.jsx << 'JSEOF'
import { createContext, useContext, useState, useCallback } from 'react'

export const LanguageContext = createContext({
  langTone: 'en', setLangTone: () => {},
})

const LANG_STORAGE_KEY = 'app_lang_tone'

export function LanguageProvider({ children }) {
  const [langTone, setLangToneRaw] = useState(
    () => localStorage.getItem(LANG_STORAGE_KEY) || 'en'
  )
  const setLangTone = useCallback((val) => {
    setLangToneRaw(val)
    localStorage.setItem(LANG_STORAGE_KEY, val)
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { langTone: val } }))
  }, [])
  return (
    <LanguageContext.Provider value={{ langTone, setLangTone }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
JSEOF

cat > src/components/LanguageSelector.jsx << 'JSEOF'
import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'

const LANGUAGE_GROUPS = [
  {
    region: 'Neutral',
    langs: [
      { value: 'en',        label: 'English', tone: 'English (neutral)' },
    ],
  },
  {
    region: 'North India',
    langs: [
      { value: 'hi-bhai',   label: 'Hindi',   tone: 'Hindi (bhai / dost)' },
      { value: 'pa-paaji',  label: 'Punjabi', tone: 'Punjabi (paaji / veer)' },
      { value: 'ur-yaar',   label: 'Urdu',    tone: 'Urdu (yaar / janaab)' },
      { value: 'gu-bhai',   label: 'Gujarati',tone: 'Gujarati (bhai / ben)' },
      { value: 'mr-bhau',   label: 'Marathi', tone: 'Marathi (bhau / tai)' },
      { value: 'raj-bhai',  label: 'Rajasthani', tone: 'Rajasthani (bhai)' },
    ],
  },
  {
    region: 'South India',
    langs: [
      { value: 'ta-machan', label: 'Tamil',    tone: 'Tamil (machan / akka)' },
      { value: 'te-anna',   label: 'Telugu',   tone: 'Telugu (annayya / tammudu)' },
      { value: 'kn-anna',   label: 'Kannada',  tone: 'Kannada (anna / thamma)' },
      { value: 'ml-ikka',   label: 'Malayalam',tone: 'Malayalam (ikka / chetta)' },
    ],
  },
  {
    region: 'East & Northeast',
    langs: [
      { value: 'bn-dada',   label: 'Bengali',  tone: 'Bengali (dada / bhai)' },
      { value: 'or-bhaina', label: 'Odia',     tone: 'Odia (bhaina / bhai)' },
      { value: 'as-koka',   label: 'Assamese', tone: 'Assamese (koka / bhati)' },
      { value: 'mni-bhai',  label: 'Manipuri', tone: 'Manipuri (bhai)' },
      { value: 'mizo-bro',  label: 'Mizo',     tone: 'Mizo (bro / pu)' },
    ],
  },
  {
    region: 'Central & Tribal',
    langs: [
      { value: 'cg-bhai',   label: 'Chhattisgarhi', tone: 'Chhattisgarhi (bhai)' },
      { value: 'maitei',    label: 'Meitei',         tone: 'Meitei (bhai)' },
    ],
  },
]

export default function LanguageSelector({ compact = false }) {
  const { langTone, setLangTone } = useContext(LanguageContext)

  // Find current display label
  const current = LANGUAGE_GROUPS.flatMap(g => g.langs).find(l => l.value === langTone)
  const label = current ? current.tone : 'English (neutral)'

  if (compact) {
    return (
      <select
        value={langTone}
        onChange={e => setLangTone(e.target.value)}
        style={{
          border: '1.5px solid rgba(212,175,55,0.5)',
          borderRadius: 10, padding: '6px 10px',
          background: 'rgba(255,255,255,0.9)',
          fontFamily: 'Poppins,sans-serif', fontWeight: 600,
          fontSize: 12, color: '#1E3A5F', cursor: 'pointer', outline: 'none',
        }}
      >
        {LANGUAGE_GROUPS.map(group => (
          <optgroup key={group.region} label={group.region}>
            {group.langs.map(l => (
              <option key={l.value} value={l.value}>{l.tone}</option>
            ))}
          </optgroup>
        ))}
      </select>
    )
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(255,255,255,0.9)',
        border: '1.5px solid rgba(212,175,55,0.4)',
        borderRadius: 12, padding: '8px 14px',
      }}>
        <span style={{ fontSize: 16 }}>🌐</span>
        <select
          value={langTone}
          onChange={e => setLangTone(e.target.value)}
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'Poppins,sans-serif', fontWeight: 600,
            fontSize: 13, color: '#1E3A5F', cursor: 'pointer', minWidth: 140,
          }}
        >
          {LANGUAGE_GROUPS.map(group => (
            <optgroup key={group.region} label={`── ${group.region} ──`}>
              {group.langs.map(l => (
                <option key={l.value} value={l.value}>{l.tone}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  )
}
JSEOF

echo "    ✅ Section 2 done"
# ══════════════════════════════════════════════════════════════════
# SECTION 3 — Difficulty Mapper + ExamDropRequest
# ══════════════════════════════════════════════════════════════════
echo "  [3/13] difficultyMapper + ExamDropRequest..."

cat > src/utils/difficultyMapper.js << 'JSEOF'
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
  if (d <= 2) return { label: 'Beginner',    color: '#22C55E', emoji: '🟢' }
  if (d <= 4) return { label: 'Easy',        color: '#84CC16', emoji: '🟡' }
  if (d <= 6) return { label: 'Medium',      color: '#F59E0B', emoji: '🟠' }
  if (d <= 8) return { label: 'Hard',        color: '#EF4444', emoji: '🔴' }
  return               { label: 'Expert',    color: '#7C3AED', emoji: '🟣' }
}
JSEOF

cat > src/components/ExamDropRequest.jsx << 'JSEOF'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'examRequests'

export default function ExamDropRequest({ compact = false, onClose }) {
  const [form, setForm] = useState({
    examName: '', conductingBody: '', officialWebsite: '', expectedDate: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(!compact)

  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const submit = () => {
    if (!form.examName.trim()) { setError('Exam name is required.'); return }
    // Dedup check
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const isDup = existing.some(
      e => e.examName.toLowerCase() === form.examName.toLowerCase().trim()
    )
    if (isDup) {
      setError('This exam was already requested! We are reviewing it.')
      return
    }
    const req = {
      id: `req-${Date.now()}`,
      ...form,
      examName: form.examName.trim(),
      requestedAt: new Date().toISOString(),
      status: 'pending',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, req]))
    setSubmitted(true)
    setError('')
    setTimeout(() => { onClose?.(); setSubmitted(false) }, 3500)
  }

  if (compact && !open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none', border: '1.5px dashed #D4AF37', borderRadius: 12,
          padding: '10px 16px', cursor: 'pointer', color: '#D4AF37',
          fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        <span>📬</span> Don't see your exam? Request it here →
      </button>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#fff', borderRadius: 20,
        border: '1.5px solid rgba(212,175,55,0.4)',
        padding: 24, boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        maxWidth: 440, width: '100%',
      }}
    >
      {!submitted ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700,
              color: '#1E3A5F', fontSize: 16 }}>
              📬 Request a New Exam
            </h3>
            {compact && (
              <button onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8',
                  fontSize: 20, cursor: 'pointer' }}>×</button>
            )}
          </div>
          <p style={{ color: '#64748B', fontSize: 13, marginBottom: 16 }}>
            We add requested exams within <strong>24 hours</strong>.
          </p>
          {[
            { key: 'examName', label: 'Exam Name *', placeholder: 'e.g. TSPSC Group 2', required: true },
            { key: 'conductingBody', label: 'Conducting Body', placeholder: 'e.g. TSPSC' },
            { key: 'officialWebsite', label: 'Official Website', placeholder: 'https://tspsc.gov.in' },
            { key: 'expectedDate', label: 'Expected Exam Date', placeholder: 'e.g. August 2026' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#1E3A5F',
                fontSize: 12, marginBottom: 4 }}>{f.label}</label>
              <input value={form[f.key]}
                onChange={e => upd(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10,
                  border: `1.5px solid ${f.key === 'examName' && error ? '#EF4444' : '#E2E8F0'}`,
                  fontSize: 13, fontFamily: 'Inter,sans-serif',
                  outline: 'none', background: '#F8FAFC', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#D4AF37'}
                onBlur={e => e.target.style.borderColor = '#E2E8F0'}
              />
            </div>
          ))}
          {error && <p style={{ color: '#EF4444', fontSize: 12, marginBottom: 10 }}>{error}</p>}
          <button onClick={submit} style={{
            width: '100%', padding: '12px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg,#D4AF37,#E8C84A)',
            fontFamily: 'Poppins,sans-serif', fontWeight: 700,
            fontSize: 14, color: '#1E3A5F', cursor: 'pointer',
          }}>
            Submit Request →
          </button>
        </>
      ) : (
        <motion.div initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <h3 style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, color: '#1E3A5F' }}>
            Request Sent!
          </h3>
          <p style={{ color: '#64748B', fontSize: 14, marginTop: 8 }}>
            <strong>{form.examName}</strong> will be added within <strong>24 hours</strong>.
            We'll notify you when it's live!
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
JSEOF

echo "    ✅ Section 3 done"
# ══════════════════════════════════════════════════════════════════
# SECTION 4 — Centre Hub + Student History + My Test History
# ══════════════════════════════════════════════════════════════════
echo "  [4/13] Centre Dashboard + Student History..."

cat > src/pages/centre/CentreDashboard.jsx << 'JSEOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const MOCK_TESTS = [
  { id:'ct1', name:'SSC CGL Mock 1',   subject:'Full Syllabus', date:'2026-06-08 10:00', students:32, avgScore:68, status:'completed' },
  { id:'ct2', name:'Quant Speed Test', subject:'Maths',         date:'2026-06-07 14:00', students:28, avgScore:72, status:'completed' },
  { id:'ct3', name:'Reasoning Drill',  subject:'Reasoning',     date:'2026-06-10 16:00', students:0,  avgScore:0,  status:'upcoming'  },
  { id:'ct4', name:'English Mastery',  subject:'English',       date:'2026-06-09 09:00', students:35, avgScore:61, status:'completed' },
]
const MOCK_STUDENTS = [
  { id:'s1', name:'Arjun Kumar',    rank:1,  streak:12, avgScore:78, testsCount:6 },
  { id:'s2', name:'Priya Sharma',   rank:2,  streak:8,  avgScore:84, testsCount:6 },
  { id:'s3', name:'Rahul Mehta',    rank:3,  streak:5,  avgScore:71, testsCount:5 },
  { id:'s4', name:'Zainab Ali',     rank:4,  streak:9,  avgScore:76, testsCount:6 },
  { id:'s5', name:'Meera V.',       rank:5,  streak:3,  avgScore:65, testsCount:4 },
]

function CreateTestModal({ onClose, onCreate }) {
  const [f, setF] = useState({ name:'', subject:'', date:'', questions:25, duration:30 })
  const upd = (k,v) => setF(p=>({...p,[k]:v}))
  const save = () => {
    if (!f.name.trim()) return
    const all = JSON.parse(localStorage.getItem('centreTests') || '[]')
    const test = { id:`ct-${Date.now()}`, ...f, students:0, avgScore:0, status:'upcoming' }
    localStorage.setItem('centreTests', JSON.stringify([...all, test]))
    onCreate(test); onClose()
  }
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:100,
      display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
        style={{ background:'#fff', borderRadius:24, padding:28, width:'100%', maxWidth:460 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
          <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:18 }}>
            ➕ Create New Test
          </h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer' }}>×</button>
        </div>
        {[
          { k:'name',     label:'Test Name *',           ph:'e.g. SSC CGL Mock 5',    type:'text'           },
          { k:'subject',  label:'Subject',                ph:'e.g. Full Syllabus',     type:'text'           },
          { k:'date',     label:'Date & Time',            ph:'',                       type:'datetime-local'  },
        ].map(fi => (
          <div key={fi.k} style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:5 }}>
              {fi.label}
            </label>
            <input value={f[fi.k]} type={fi.type} placeholder={fi.ph}
              onChange={e => upd(fi.k, e.target.value)}
              style={{ width:'100%', padding:'10px 12px', borderRadius:10,
                border:'1.5px solid #E2E8F0', fontSize:13, outline:'none', boxSizing:'border-box' }}
              onFocus={e => e.target.style.borderColor='#D4AF37'}
              onBlur={e => e.target.style.borderColor='#E2E8F0'}
            />
          </div>
        ))}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
          {[
            { k:'questions', label:'Questions', min:5, max:200 },
            { k:'duration',  label:'Duration (min)', min:10, max:180 },
          ].map(sl => (
            <div key={sl.k}>
              <label style={{ display:'block', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:5 }}>
                {sl.label}: <span style={{ color:'#D4AF37', fontWeight:800 }}>{f[sl.k]}</span>
              </label>
              <input type='range' min={sl.min} max={sl.max} value={f[sl.k]}
                onChange={e => upd(sl.k, +e.target.value)}
                style={{ width:'100%', accentColor:'#D4AF37' }} />
            </div>
          ))}
        </div>
        <button onClick={save} style={{
          width:'100%', padding:14, borderRadius:12, border:'none',
          background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
          fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15,
          color:'#1E3A5F', cursor:'pointer',
        }}>Create Test →</button>
      </motion.div>
    </div>
  )
}

export default function CentreDashboard() {
  const navigate = useNavigate()
  const [tests, setTests]     = useState(MOCK_TESTS)
  const [showModal, setModal] = useState(false)
  const [tab, setTab]         = useState('tests')

  const handleCreate = (t) => setTests(p => [t, ...p])

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', padding:'0 0 40px' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', padding:'20px 28px' }}>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>🏫 Centre Dashboard</p>
        <h1 style={{ color:'#fff', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:24, margin:'4px 0' }}>
          ABC Coaching Centre
        </h1>
        <p style={{ color:'#D4AF37', fontSize:13 }}>47 students · All India Rank #12 Centre</p>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, padding:'16px 20px' }}>
        {[['📝','12','Tests This Month'],['👥','47','Active Students'],['🏆','#12','Centre Rank India'],['📊','72%','Avg Score']].map(([e,v,l])=>(
          <div key={l} style={{ background:'#fff', borderRadius:16, padding:'14px 12px',
            boxShadow:'0 2px 12px rgba(0,0,0,0.05)', textAlign:'center' }}>
            <p style={{ fontSize:24 }}>{e}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:20 }}>{v}</p>
            <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
          </div>
        ))}
      </div>

      <div style={{ padding:'0 20px' }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {[['tests','📝 Tests'],['students','👥 Students']].map(([k,label])=>(
            <button key={k} onClick={()=>setTab(k)} style={{
              padding:'10px 20px', borderRadius:12, border:'none', cursor:'pointer',
              background: tab===k ? '#1E3A5F' : '#fff',
              color: tab===k ? '#fff' : '#64748B',
              fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13,
            }}>{label}</button>
          ))}
          <button onClick={()=>setModal(true)} style={{
            marginLeft:'auto', padding:'10px 20px', borderRadius:12, border:'none',
            background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
            fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:13,
            color:'#1E3A5F', cursor:'pointer',
          }}>+ Create Test</button>
        </div>

        {/* Tests tab */}
        {tab === 'tests' && (
          <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ background:'#1E3A5F', padding:'12px 18px',
              display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:8 }}>
              {['Test Name','Subject','Date','Students','Avg Score'].map(h=>(
                <span key={h} style={{ color:'#D4AF37', fontSize:11, fontWeight:700, letterSpacing:'1px' }}>{h}</span>
              ))}
            </div>
            {tests.map(t => (
              <div key={t.id} style={{ padding:'14px 18px', borderBottom:'1px solid #F1F5F9',
                display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:8,
                alignItems:'center', cursor:'pointer' }}
                onClick={()=>navigate(`/centre/students`)}>
                <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:14 }}>
                  {t.name}
                </span>
                <span style={{ background:'#F1F5F9', color:'#64748B', borderRadius:8,
                  padding:'3px 8px', fontSize:11, fontWeight:600, display:'inline-block' }}>
                  {t.subject}
                </span>
                <span style={{ color:'#64748B', fontSize:12 }}>{t.date?.slice(0,10)}</span>
                <span style={{ fontWeight:700, color:'#1E3A5F', fontSize:14 }}>{t.students || '—'}</span>
                <span style={{ fontWeight:700, color: t.avgScore >= 70 ? '#22C55E' : '#EF4444', fontSize:14 }}>
                  {t.avgScore ? `${t.avgScore}%` : '—'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Students tab */}
        {tab === 'students' && (
          <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
            {MOCK_STUDENTS.map(s => (
              <div key={s.id} onClick={()=>navigate('/centre/students')}
                style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
                  borderBottom:'1px solid #F1F5F9', cursor:'pointer' }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:'#1E3A5F',
                  color:'#D4AF37', fontWeight:800, fontSize:14,
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {s.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F' }}>{s.name}</p>
                  <p style={{ color:'#94A3B8', fontSize:12 }}>🔥 {s.streak} day streak · {s.testsCount} tests</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:16 }}>
                    {s.avgScore}%
                  </p>
                  <p style={{ color:'#94A3B8', fontSize:11 }}>Avg Score</p>
                </div>
                <span style={{ color:'#D4AF37', fontSize:18 }}>›</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <CreateTestModal onClose={()=>setModal(false)} onCreate={handleCreate} />}
    </div>
  )
}
JSEOF

cat > src/pages/centre/StudentHistory.jsx << 'JSEOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STUDENT_RESULTS = {
  's1': [
    { testName:'SSC CGL Mock 1',   date:'2026-06-08', score:78, rank:8,  total:32, subject:'Full' },
    { testName:'Quant Speed Test', date:'2026-06-07', score:82, rank:5,  total:28, subject:'Maths' },
    { testName:'English Mastery',  date:'2026-06-09', score:68, rank:12, total:35, subject:'English' },
    { testName:'Reasoning Drill',  date:'2026-06-05', score:85, rank:3,  total:30, subject:'Reasoning' },
    { testName:'GK Blitz',         date:'2026-06-03', score:72, rank:9,  total:32, subject:'GK' },
    { testName:'SSC Mock Full',    date:'2026-06-01', score:75, rank:7,  total:32, subject:'Full' },
  ]
}
const STUDENTS = [
  { id:'s1', name:'Arjun Kumar',   avg:78, streak:12 },
  { id:'s2', name:'Priya Sharma',  avg:84, streak:8  },
  { id:'s3', name:'Rahul Mehta',   avg:71, streak:5  },
]

export default function StudentHistory() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const results = selected ? (STUDENT_RESULTS[selected.id] || []) : []
  const avg = results.length
    ? Math.round(results.reduce((a,r)=>a+r.score,0)/results.length) : 0

  return (
    <div style={{ minHeight:'100vh', background:'#F8FAFC', padding:20 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
        <button onClick={()=>navigate('/centre/dashboard')}
          style={{ background:'none', border:'none', fontSize:22, cursor:'pointer' }}>←</button>
        <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:22 }}>
          Student History
        </h1>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:20 }}>
        {/* Student list */}
        <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ background:'#1E3A5F', padding:'12px 16px' }}>
            <p style={{ color:'#D4AF37', fontWeight:700, fontFamily:'Poppins,sans-serif', fontSize:13 }}>
              All Students
            </p>
          </div>
          {STUDENTS.map(s => (
            <div key={s.id} onClick={()=>setSelected(s)}
              style={{ padding:'14px 16px', borderBottom:'1px solid #F1F5F9', cursor:'pointer',
                background: selected?.id===s.id ? 'rgba(212,175,55,0.1)' : '#fff',
                borderLeft: selected?.id===s.id ? '4px solid #D4AF37' : 'none' }}>
              <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F' }}>{s.name}</p>
              <p style={{ color:'#94A3B8', fontSize:12 }}>Avg: {s.avg}% · 🔥{s.streak}d</p>
            </div>
          ))}
        </div>

        {/* History */}
        <div>
          {!selected ? (
            <div style={{ background:'#fff', borderRadius:20, padding:40,
              textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize:40 }}>👈</p>
              <p style={{ color:'#94A3B8' }}>Select a student to see their history</p>
            </div>
          ) : (
            <>
              {/* Mini stats */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                {[['📝',results.length,'Tests Taken'],['📊',`${avg}%`,'Avg Score'],['🔥',selected.streak,'Day Streak']].map(([e,v,l])=>(
                  <div key={l} style={{ background:'#fff', borderRadius:16, padding:14,
                    textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize:22 }}>{e}</p>
                    <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:18 }}>{v}</p>
                    <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
                  </div>
                ))}
              </div>

              {/* Score trend */}
              <div style={{ background:'#fff', borderRadius:20, padding:20,
                boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:16 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:12 }}>
                  Score Trend
                </p>
                <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:80 }}>
                  {results.map((r,i) => (
                    <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                      <span style={{ fontSize:10, color:'#94A3B8' }}>{r.score}%</span>
                      <div style={{
                        width:'100%', borderRadius:'6px 6px 0 0',
                        height:`${(r.score/100)*70}px`,
                        background: r.score>=80?'#22C55E':r.score>=70?'#D4AF37':'#EF4444',
                        minHeight:8,
                      }} />
                      <span style={{ fontSize:9, color:'#94A3B8' }}>{r.date.slice(5)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tests table */}
              <div style={{ background:'#fff', borderRadius:20, overflow:'hidden',
                boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
                {results.map((r,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12,
                    padding:'13px 18px', borderBottom:'1px solid #F1F5F9' }}>
                    <div style={{ flex:1 }}>
                      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:14 }}>
                        {r.testName}
                      </p>
                      <p style={{ color:'#94A3B8', fontSize:12 }}>{r.date} · {r.subject}</p>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <p style={{ fontWeight:800, color: r.score>=70?'#22C55E':'#EF4444', fontSize:15 }}>
                        {r.score}%
                      </p>
                      <p style={{ color:'#94A3B8', fontSize:12 }}>Rank #{r.rank}/{r.total}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
JSEOF

cat > src/pages/student/MyTestHistory.jsx << 'JSEOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

const MOCK_HISTORY = [
  { id:'r1', exam:'SSC CGL', testName:'Mock Test 1', date:'2026-06-08', score:78, total:100, rank:1243, time:'26:34', type:'Mock'     },
  { id:'r2', exam:'SSC CGL', testName:'Quant Practice',date:'2026-06-07',score:82,total:50, rank:null,  time:'18:22', type:'Practice' },
  { id:'r3', exam:'IBPS PO', testName:'Mock Test 3', date:'2026-06-06', score:65, total:100, rank:4521, time:'35:12', type:'Mock'     },
  { id:'r4', exam:'SSC CGL', testName:'English Drill', date:'2026-06-05',score:68,total:50, rank:null, time:'12:44', type:'Practice' },
  { id:'r5', exam:'UPSC CSE',testName:'Prelims Mock', date:'2026-06-03', score:71, total:200, rank:8892, time:'48:00', type:'Mock'     },
  { id:'r6', exam:'SSC CGL', testName:'Reasoning',   date:'2026-06-01', score:90, total:50, rank:null,  time:'09:13', type:'Speed'    },
]

const FILTERS = ['All', 'Mock', 'Practice', 'Speed']

export default function MyTestHistory() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? MOCK_HISTORY : MOCK_HISTORY.filter(r => r.type === filter)
  const avg = Math.round(filtered.reduce((a,r) => a + (r.score/r.total)*100, 0) / (filtered.length || 1))

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:26, marginBottom:6 }}>
        📝 My Test History
      </h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>{MOCK_HISTORY.length} tests recorded</p>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
        {[['📝',MOCK_HISTORY.length,'Tests Taken'],['📊',`${avg}%`,'Avg Score'],['🏆','#1,243','Best Rank']].map(([e,v,l])=>(
          <div key={l} style={{ background:'#fff', borderRadius:18, padding:'14px 12px',
            textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize:24 }}>{e}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:20 }}>{v}</p>
            <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:'8px 18px', borderRadius:20, border:'none', cursor:'pointer',
            background: filter===f ? '#1E3A5F' : '#fff',
            color: filter===f ? '#fff' : '#64748B',
            fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13,
            boxShadow:'0 1px 6px rgba(0,0,0,0.06)',
          }}>{f}</button>
        ))}
      </div>

      {/* List */}
      <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
        {filtered.map((r,i) => {
          const pct = Math.round((r.score/r.total)*100)
          return (
            <div key={r.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
              borderBottom: i<filtered.length-1 ? '1px solid #F1F5F9' : 'none' }}>
              <div style={{ width:44, height:44, borderRadius:12,
                background: pct>=80?'#DCFCE7':pct>=60?'#FEF3C7':'#FEE2E2',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'Poppins,sans-serif', fontWeight:800,
                color: pct>=80?'#15803D':pct>=60?'#92400E':'#991B1B', fontSize:14, flexShrink:0 }}>
                {pct}%
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F', fontSize:14 }}>
                  {r.testName}
                </p>
                <p style={{ color:'#94A3B8', fontSize:12 }}>
                  {r.exam} · {r.date} · ⏱ {r.time}
                </p>
              </div>
              <div style={{ textAlign:'right' }}>
                <span style={{ background: r.type==='Mock'?'#EDE9FE':r.type==='Speed'?'#FEF3C7':'#F0FDF4',
                  color: r.type==='Mock'?'#7C3AED':r.type==='Speed'?'#92400E':'#15803D',
                  padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:700 }}>
                  {r.type}
                </span>
                {r.rank && <p style={{ color:'#D4AF37', fontWeight:700, fontSize:12, marginTop:3 }}>Rank #{r.rank.toLocaleString()}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </AppLayout>
  )
}
JSEOF

echo "    ✅ Section 4 done"
# ══════════════════════════════════════════════════════════════════
# SECTION 5 — Admin Panel (Login + Dashboard + UserManager + Queues)
# ══════════════════════════════════════════════════════════════════
echo "  [5/13] Admin Panel..."

cat > src/pages/admin/AdminLogin.jsx << 'JSEOF'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const [err,   setErr]   = useState('')

  const login = () => {
    if (email === 'admin@tryit.com' && pass === 'admin123') {
      localStorage.setItem('tryit_admin', 'true')
      navigate('/admin/dashboard')
    } else {
      setErr('Invalid credentials')
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg,#071428,#0F2140)', padding:20 }}>
      <div style={{ background:'rgba(255,255,255,0.95)', borderRadius:24, padding:36,
        width:'100%', maxWidth:380, boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontFamily:'Poppins,sans-serif', fontWeight:900, fontSize:28 }}>
            <span style={{ color:'#1E3A5F' }}>TRY</span><span style={{ color:'#D4AF37' }}>IT</span>
          </div>
          <p style={{ color:'#DC2626', fontWeight:700, fontSize:14, marginTop:6 }}>🔐 Admin Access Only</p>
        </div>
        {[
          { label:'Email', val:email, set:setEmail, type:'email', ph:'admin@tryit.com' },
          { label:'Password', val:pass, set:setPass, type:'password', ph:'••••••••' },
        ].map(f => (
          <div key={f.label} style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:5 }}>
              {f.label}
            </label>
            <input value={f.val} type={f.type} placeholder={f.ph}
              onChange={e=>f.set(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}
              style={{ width:'100%', padding:'11px 14px', borderRadius:12,
                border:'1.5px solid #E2E8F0', fontSize:14, outline:'none', boxSizing:'border-box' }}
              onFocus={e=>e.target.style.borderColor='#D4AF37'}
              onBlur={e=>e.target.style.borderColor='#E2E8F0'}
            />
          </div>
        ))}
        {err && <p style={{ color:'#EF4444', fontSize:13, marginBottom:10 }}>{err}</p>}
        <button onClick={login} style={{
          width:'100%', padding:14, borderRadius:12, border:'none',
          background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
          fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:15,
          color:'#fff', cursor:'pointer',
        }}>Login to Admin →</button>
        <p style={{ textAlign:'center', color:'#94A3B8', fontSize:11, marginTop:12 }}>
          ⚠️ Dev credentials: admin@tryit.com / admin123
        </p>
      </div>
    </div>
  )
}
JSEOF

cat > src/pages/admin/AdminDashboard.jsx << 'JSEOF'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TABS = ['overview','users','exam-requests','questions','push']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    if (!localStorage.getItem('tryit_admin')) navigate('/admin/login')
  }, [navigate])

  const logout = () => { localStorage.removeItem('tryit_admin'); navigate('/admin/login') }

  const MOCK_STATS = [
    ['👥','1,247','Total Users'],['📝','23,481','Tests Taken'],
    ['💰','₹48,392','Revenue'],['🗃️','5,280','Questions in DB'],
    ['📬','12','Pending Exam Requests'],['🔔','3','Push Sent Today'],
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#F1F5F9' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1E3A5F,#0F2140)', padding:'16px 24px',
        display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>TryIT Admin</p>
          <h1 style={{ color:'#D4AF37', fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:22 }}>
            360° Control Panel
          </h1>
        </div>
        <button onClick={logout} style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
          borderRadius:10, padding:'8px 16px', color:'#fff', cursor:'pointer', fontSize:13 }}>
          Sign Out
        </button>
      </div>

      {/* Nav tabs */}
      <div style={{ display:'flex', gap:4, padding:'12px 20px', background:'#fff',
        boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflowX:'auto' }}>
        {[['overview','📊 Overview'],['users','👥 Users'],['exam-requests','📬 Exam Requests'],
          ['questions','🗃️ Questions'],['push','🔔 Push']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{
            padding:'9px 16px', borderRadius:10, border:'none', cursor:'pointer', whiteSpace:'nowrap',
            background: tab===k ? '#1E3A5F' : 'transparent',
            color: tab===k ? '#fff' : '#64748B',
            fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13,
          }}>{l}</button>
        ))}
      </div>

      <div style={{ padding:20 }}>

        {tab === 'overview' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
            {MOCK_STATS.map(([e,v,l])=>(
              <div key={l} style={{ background:'#fff', borderRadius:18, padding:'18px 16px',
                textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize:28 }}>{e}</p>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:22 }}>{v}</p>
                <p style={{ color:'#94A3B8', fontSize:12, marginTop:2 }}>{l}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'users' && <UserManagerInline />}
        {tab === 'exam-requests' && <ExamRequestQueueInline />}
        {tab === 'questions' && <QuestionManagerInline />}
        {tab === 'push' && <PushTesterInline />}
      </div>
    </div>
  )
}

// ── Inline sub-components ──────────────────────────────────────

function UserManagerInline() {
  const MOCK_USERS = [
    { id:'u1', name:'Arjun Kumar', email:'arjun@ex.com', role:'student', level:4, joined:'Jan 2026' },
    { id:'u2', name:'Vikram Nair', email:'vikram@ex.com', role:'mentor',  level:7, joined:'Feb 2026' },
    { id:'u3', name:'Admin Test',  email:'test@ex.com',  role:'student', level:1, joined:'Jun 2026' },
  ]
  return (
    <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
      <div style={{ background:'#1E3A5F', padding:'12px 18px',
        display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr', gap:8 }}>
        {['Name','Email','Role','Level','Joined'].map(h=>(
          <span key={h} style={{ color:'#D4AF37', fontSize:11, fontWeight:700 }}>{h}</span>
        ))}
      </div>
      {MOCK_USERS.map(u=>(
        <div key={u.id} style={{ padding:'13px 18px', borderBottom:'1px solid #F1F5F9',
          display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr', gap:8, alignItems:'center' }}>
          <span style={{ fontWeight:600, color:'#1E3A5F', fontSize:14 }}>{u.name}</span>
          <span style={{ color:'#64748B', fontSize:13 }}>{u.email}</span>
          <span style={{ background: u.role==='mentor'?'#EDE9FE':'#F0FDF4',
            color: u.role==='mentor'?'#7C3AED':'#15803D',
            padding:'3px 8px', borderRadius:20, fontSize:11, fontWeight:700, display:'inline-block' }}>
            {u.role}
          </span>
          <span style={{ color:'#D4AF37', fontWeight:700 }}>Lv {u.level}</span>
          <span style={{ color:'#94A3B8', fontSize:12 }}>{u.joined}</span>
        </div>
      ))}
    </div>
  )
}

function ExamRequestQueueInline() {
  const [reqs, setReqs] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('examRequests') || '[]')
    return saved.length ? saved : [
      { id:'r1', examName:'TSPSC Group 2', conductingBody:'TSPSC', status:'pending', requestedAt:'2026-06-09T08:00:00Z' },
      { id:'r2', examName:'KPSC FDA',      conductingBody:'KPSC',  status:'pending', requestedAt:'2026-06-08T14:00:00Z' },
    ]
  })

  const mark = (id, status) => {
    const updated = reqs.map(r => r.id===id ? {...r, status} : r)
    setReqs(updated)
    localStorage.setItem('examRequests', JSON.stringify(updated))
  }

  return (
    <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
      {reqs.map((r,i)=>(
        <div key={r.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px',
          borderBottom: i<reqs.length-1?'1px solid #F1F5F9':'none' }}>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, color:'#1E3A5F' }}>{r.examName}</p>
            <p style={{ color:'#94A3B8', fontSize:12 }}>{r.conductingBody} · {r.requestedAt?.slice(0,10)}</p>
          </div>
          <span style={{ padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:700,
            background: r.status==='added'?'#DCFCE7':'#FEF3C7',
            color: r.status==='added'?'#15803D':'#92400E' }}>
            {r.status}
          </span>
          {r.status==='pending' && (
            <button onClick={()=>mark(r.id,'added')} style={{
              background:'linear-gradient(135deg,#22C55E,#16A34A)', border:'none',
              borderRadius:10, padding:'7px 14px', color:'#fff',
              fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12, cursor:'pointer',
            }}>Mark Added ✓</button>
          )}
        </div>
      ))}
      {reqs.length===0 && <p style={{ padding:24, textAlign:'center', color:'#94A3B8' }}>No requests yet</p>}
    </div>
  )
}

function QuestionManagerInline() {
  return (
    <div style={{ background:'#fff', borderRadius:20, padding:24, boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:16, marginBottom:14 }}>
        🗃️ Question Bank (Mock)
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
        {[['SSC CGL','1,240'],['UPSC CSE','890'],['NEET UG','1,560'],['IBPS PO','720'],['JEE Main','1,100'],['GATE CS','640']].map(([exam,count])=>(
          <div key={exam} style={{ background:'#F8FAFC', borderRadius:14, padding:'12px 14px',
            border:'1.5px solid #E2E8F0' }}>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:14 }}>{exam}</p>
            <p style={{ color:'#D4AF37', fontWeight:800, fontSize:20, fontFamily:'Poppins,sans-serif' }}>{count}</p>
            <p style={{ color:'#94A3B8', fontSize:11 }}>questions</p>
          </div>
        ))}
      </div>
      <p style={{ color:'#94A3B8', fontSize:13 }}>
        Full question editing UI coming in Admin Phase 2. For now use Supabase Table Editor.
      </p>
    </div>
  )
}

function PushTesterInline() {
  const [role, setRole]     = useState('student')
  const [lang, setLang]     = useState('en')
  const [sent, setSent]     = useState(false)
  const [message, setMessage] = useState('')

  const MESSAGES = {
    student: { en:"📚 Time to study! Your SSC CGL exam is 30 days away. Study 2 hours today.",
               ta:"📚 படிக்க நேரம்! உங்கள் SSC CGL தேர்வு 30 நாட்களில் உள்ளது." },
    mentor:  { en:"💰 3 doubts waiting! Answer now and earn ₹15.",
               hi:"💰 3 doubts इंतजार कर रहे! अभी जवाब दें और ₹15 कमाएं।" },
    institution: { en:"📊 Your centre has 47 students active today!" },
    family: { en:"👨‍👩‍👧 Your family is on a 7-day streak! Keep it up! 🔥" },
  }

  const simulate = () => {
    const msg = MESSAGES[role]?.[lang] || MESSAGES[role]?.['en'] || 'Test push notification'
    setMessage(msg)
    setSent(true)
    // Browser Notification API
    if (Notification.permission === 'granted') {
      new Notification('TryIT Educations', { body: msg, icon: '/tryit-logo.webp' })
    }
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div style={{ background:'#fff', borderRadius:20, padding:24, boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
      <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', fontSize:16, marginBottom:16 }}>
        🔔 Push Notification Tester
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        <div>
          <label style={{ display:'block', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:5 }}>Role</label>
          <select value={role} onChange={e=>setRole(e.target.value)}
            style={{ width:'100%', padding:'10px', borderRadius:10, border:'1.5px solid #E2E8F0',
              fontFamily:'Poppins,sans-serif', fontSize:13, outline:'none' }}>
            {['student','mentor','institution','family'].map(r=>(
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display:'block', fontWeight:600, color:'#1E3A5F', fontSize:13, marginBottom:5 }}>Language</label>
          <select value={lang} onChange={e=>setLang(e.target.value)}
            style={{ width:'100%', padding:'10px', borderRadius:10, border:'1.5px solid #E2E8F0',
              fontFamily:'Poppins,sans-serif', fontSize:13, outline:'none' }}>
            {[['en','English'],['hi','Hindi'],['ta','Tamil'],['te','Telugu']].map(([v,l])=>(
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
      </div>
      {sent && message && (
        <div style={{ background:'#DCFCE7', borderRadius:12, padding:'12px 16px', marginBottom:12 }}>
          <p style={{ color:'#15803D', fontWeight:600, fontSize:13 }}>✅ Notification simulated:</p>
          <p style={{ color:'#15803D', fontSize:13, marginTop:4 }}>{message}</p>
        </div>
      )}
      <button onClick={simulate} style={{
        background:'linear-gradient(135deg,#1E3A5F,#0F2140)', border:'none',
        borderRadius:12, padding:'12px 24px', color:'#D4AF37',
        fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14, cursor:'pointer',
      }}>
        🔔 Simulate Push
      </button>
    </div>
  )
}
JSEOF

echo "    ✅ Section 5 done"
# ══════════════════════════════════════════════════════════════════
# SECTION 6 — IndexedDB, PushManager, JourneyPassport, CouponManager
# ══════════════════════════════════════════════════════════════════
echo "  [6/13] LocalDb + PushManager + JourneyPassport + CouponManager..."

cat > src/lib/localDb.js << 'JSEOF'
// src/lib/localDb.js
// IndexedDB wrapper for TryIT local-first architecture
// Mirrors WhatsApp/Telegram pattern: device = primary DB

const DB_NAME    = 'TryITDB'
const DB_VERSION = 1
const STORES     = ['questions', 'exams', 'userProgress', 'testResults', 'outbox', 'syncMeta']

let _db = null

function openDB() {
  if (_db) return Promise.resolve(_db)
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      STORES.forEach(store => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id' })
        }
      })
    }
    req.onsuccess = (e) => { _db = e.target.result; resolve(_db) }
    req.onerror   = (e) => reject(e.target.error)
  })
}

function tx(store, mode = 'readonly') {
  return openDB().then(db => db.transaction(store, mode).objectStore(store))
}

export async function saveQuestions(questions) {
  const s = await tx('questions', 'readwrite')
  return Promise.all(questions.map(q => new Promise((res, rej) => {
    const r = s.put(q); r.onsuccess = res; r.onerror = rej
  })))
}

export async function getQuestionsByExam(examId, limit = 25) {
  const s = await tx('questions')
  return new Promise((res, rej) => {
    const results = []; const req = s.openCursor()
    req.onsuccess = (e) => {
      const cur = e.target.result
      if (cur && results.length < limit) {
        if (!examId || cur.value.exam_id === examId) results.push(cur.value)
        cur.continue()
      } else res(results)
    }
    req.onerror = rej
  })
}

export async function saveTestResult(result) {
  // TODO: replace with Supabase sync
  const r = { ...result, id: result.id || `tr-${Date.now()}`, synced: false, savedAt: Date.now() }
  const s = await tx('testResults', 'readwrite')
  return new Promise((res, rej) => {
    const req = s.put(r); req.onsuccess = res; req.onerror = rej
  })
}

export async function getOfflineTestResults() {
  // Returns results not yet synced to Supabase
  // TODO: replace with Supabase sync
  const s = await tx('testResults')
  return new Promise((res, rej) => {
    const results = []; const req = s.openCursor()
    req.onsuccess = (e) => {
      const cur = e.target.result
      if (cur) { if (!cur.value.synced) results.push(cur.value); cur.continue() }
      else res(results)
    }
    req.onerror = rej
  })
}

export async function markResultSynced(id) {
  const s = await tx('testResults', 'readwrite')
  return new Promise((res, rej) => {
    const get = s.get(id)
    get.onsuccess = (e) => {
      if (!e.target.result) { res(); return }
      const put = s.put({ ...e.target.result, synced: true })
      put.onsuccess = res; put.onerror = rej
    }
    get.onerror = rej
  })
}

export async function saveExams(exams) {
  const s = await tx('exams', 'readwrite')
  return Promise.all(exams.map(e => new Promise((res, rej) => {
    const r = s.put(e); r.onsuccess = res; r.onerror = rej
  })))
}

export async function addToOutbox(eventType, payload) {
  const s = await tx('outbox', 'readwrite')
  const item = { id: `ev-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    event_type: eventType, payload, created_at: Date.now(), attempts: 0 }
  return new Promise((res, rej) => {
    const r = s.put(item); r.onsuccess = () => res(item); r.onerror = rej
  })
}

export async function getOutbox() {
  const s = await tx('outbox')
  return new Promise((res, rej) => {
    const req = s.getAll(); req.onsuccess = (e) => res(e.target.result); req.onerror = rej
  })
}

export async function removeFromOutbox(id) {
  const s = await tx('outbox', 'readwrite')
  return new Promise((res, rej) => {
    const r = s.delete(id); r.onsuccess = res; r.onerror = rej
  })
}

// Fallback: if IndexedDB unavailable (SSR / private browsing), use localStorage
export const idbAvailable = typeof indexedDB !== 'undefined'

export default { saveQuestions, getQuestionsByExam, saveTestResult, getOfflineTestResults,
  markResultSynced, saveExams, addToOutbox, getOutbox, removeFromOutbox }
JSEOF

cat > src/components/push/PushManager.jsx << 'JSEOF'
import { useState, useEffect } from 'react'

export default function PushManager({ compact = false }) {
  const [perm, setPerm]   = useState(Notification.permission)
  const [token, setToken] = useState(localStorage.getItem('fcm_token_mock') || '')
  const [sent, setSent]   = useState(false)

  useEffect(() => {
    const handleChange = () => setPerm(Notification.permission)
    // Notification.permission doesn't fire events, we poll on mount
    setPerm(Notification.permission)
  }, [])

  const requestPerm = async () => {
    const result = await Notification.requestPermission()
    setPerm(result)
    if (result === 'granted') {
      // In production: call Firebase getToken() here
      const mockToken = `mock-fcm-${Date.now()}`
      setToken(mockToken)
      localStorage.setItem('fcm_token_mock', mockToken)
    }
  }

  const testPush = () => {
    if (Notification.permission === 'granted') {
      new Notification('TryIT Educations 🎓', {
        body: '📚 Your SSC CGL exam is 30 days away. Study 2 hours today!',
        icon: '/tryit-logo.webp',
      })
      setSent(true)
      setTimeout(() => setSent(false), 2500)
    }
  }

  if (compact) {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{
          width:8, height:8, borderRadius:'50%',
          background: perm==='granted'?'#22C55E':perm==='denied'?'#EF4444':'#F59E0B',
        }} />
        <span style={{ fontSize:11, color:'#64748B', fontFamily:'Inter,sans-serif' }}>
          Push: {perm}
        </span>
        {perm !== 'granted' && (
          <button onClick={requestPerm} style={{ background:'none', border:'1px solid #D4AF37',
            borderRadius:6, padding:'3px 8px', fontSize:11, color:'#D4AF37', cursor:'pointer' }}>
            Enable
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{ background:'#fff', borderRadius:20, padding:20,
      boxShadow:'0 2px 12px rgba(0,0,0,0.05)', maxWidth:400 }}>
      <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:16 }}>
        🔔 Push Notifications
      </h3>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ width:12, height:12, borderRadius:'50%',
          background: perm==='granted'?'#22C55E':perm==='denied'?'#EF4444':'#F59E0B' }} />
        <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:14, color:'#1E3A5F',
          textTransform:'capitalize' }}>
          Status: {perm}
        </span>
      </div>

      {perm !== 'granted' ? (
        <button onClick={requestPerm} style={{
          width:'100%', padding:'12px', borderRadius:12, border:'none',
          background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
          fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14,
          color:'#1E3A5F', cursor:'pointer', marginBottom:12,
        }}>
          🔔 Enable Notifications
        </button>
      ) : (
        <>
          <div style={{ background:'#F0FDF4', borderRadius:12, padding:'10px 14px', marginBottom:12 }}>
            <p style={{ color:'#15803D', fontSize:12, fontFamily:'monospace' }}>
              Token: {token.slice(0, 24)}...
            </p>
          </div>
          <button onClick={testPush} style={{
            width:'100%', padding:'11px', borderRadius:12, border:'none',
            background:'linear-gradient(135deg,#1E3A5F,#0F2140)',
            fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:14,
            color: sent ? '#D4AF37' : '#fff', cursor:'pointer',
          }}>
            {sent ? '✅ Notification Sent!' : '🧪 Send Test Notification'}
          </button>
        </>
      )}
      <p style={{ color:'#94A3B8', fontSize:11, marginTop:12 }}>
        Exam alerts are sent only for YOUR enrolled exams.
      </p>
    </div>
  )
}
JSEOF

cat > src/pages/JourneyPassport.jsx << 'JSEOF'
import { useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import StudentIDCard from '../components/profile/StudentIDCard'

const JOURNEY_MILESTONES = [
  { year: 2018, label:'Class 6', event:'Started learning journey',    badge:'🌱', completed:true  },
  { year: 2020, label:'Class 8', event:'NMMS Scholarship — ₹12,000/yr',badge:'🏅', completed:true  },
  { year: 2022, label:'Class 10',event:'NTSE Stage 1 Qualified',       badge:'⭐', completed:true  },
  { year: 2023, label:'Class 11',event:'INSPIRE Scholarship Applied',  badge:'💡', completed:true  },
  { year: 2024, label:'Class 12',event:'JEE Mains attempted',          badge:'📝', completed:true  },
  { year: 2025, label:'College', event:'Joined TryIT · SSC CGL focus', badge:'🎓', completed:true  },
  { year: 2026, label:'NOW',     event:'Level 4 · Rank #1,243 · 67%',  badge:'👊', completed:true, isNow:true },
  { year: 2026, label:'Aug 2026',event:'SSC CGL Exam Day',             badge:'🎯', completed:false },
  { year: 2027, label:'Future',  event:'Government Service begins?',   badge:'🏆', completed:false },
]

const STRENGTH_BARS = [
  { name:'Reasoning', value:90, color:'#22C55E' },
  { name:'Quant',     value:82, color:'#22C55E' },
  { name:'GK',        value:75, color:'#D4AF37' },
  { name:'English',   value:68, color:'#F59E0B' },
  { name:'Science',   value:55, color:'#EF4444' },
]

const SCHOLARSHIPS = [
  { name:'INSPIRE SHE Scholarship', amount:'₹80,000/year', match:'87%', deadline:'Sep 2026' },
  { name:'PM Scholarship Scheme',   amount:'₹25,000/year', match:'92%', deadline:'Aug 2026' },
  { name:'State Merit Scholarship', amount:'₹15,000/year', match:'95%', deadline:'Jul 2026' },
]

export default function JourneyPassport() {
  const { user } = useAuth()
  const [tab, setTab] = useState('timeline')

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:26, marginBottom:4 }}>
        🪪 My Journey Passport
      </h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:20 }}>
        Your complete learning journey — Class 6 to today and beyond
      </p>

      {/* ID Card */}
      <div style={{ marginBottom:24, display:'flex', justifyContent:'center' }}>
        <StudentIDCard user={user} />
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {[['timeline','📅 Timeline'],['strengths','💪 Strengths'],['scholarships','🎓 Scholarships']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{
            padding:'9px 18px', borderRadius:20, border:'none', cursor:'pointer',
            background: tab===k?'#1E3A5F':'#fff',
            color: tab===k?'#fff':'#64748B',
            fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13,
            boxShadow:'0 1px 6px rgba(0,0,0,0.06)',
          }}>{l}</button>
        ))}
      </div>

      {/* Timeline */}
      {tab === 'timeline' && (
        <div style={{ background:'#fff', borderRadius:20, padding:'8px 20px 20px',
          boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ position:'relative', paddingLeft:28 }}>
            <div style={{ position:'absolute', left:11, top:0, bottom:0,
              width:2, background:'linear-gradient(to bottom,#1E3A5F,#D4AF37)' }} />
            {JOURNEY_MILESTONES.map((m,i) => (
              <div key={i} style={{ position:'relative', marginBottom:20, paddingTop:4 }}>
                <div style={{
                  position:'absolute', left:-28, width:22, height:22, borderRadius:'50%',
                  background: m.isNow ? '#D4AF37' : m.completed ? '#1E3A5F' : '#E2E8F0',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:11, border:`2px solid ${m.isNow?'#D4AF37':m.completed?'#1E3A5F':'#CBD5E1'}`,
                }}>
                  {m.completed ? '✓' : '○'}
                </div>
                <div style={{ marginLeft:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:18 }}>{m.badge}</span>
                    <span style={{ fontFamily:'Poppins,sans-serif', fontWeight:700,
                      color: m.isNow ? '#D4AF37' : m.completed ? '#1E3A5F' : '#94A3B8', fontSize:15 }}>
                      {m.label}
                    </span>
                    <span style={{ color:'#94A3B8', fontSize:12 }}>{m.year}</span>
                    {m.isNow && (
                      <span style={{ background:'#D4AF37', color:'#1E3A5F',
                        fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:20 }}>
                        YOU ARE HERE
                      </span>
                    )}
                  </div>
                  <p style={{ color: m.completed?'#475569':'#CBD5E1', fontSize:13, marginTop:3 }}>
                    {m.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths */}
      {tab === 'strengths' && (
        <div style={{ background:'#fff', borderRadius:20, padding:20,
          boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:16 }}>
            Subject Performance
          </h3>
          {STRENGTH_BARS.map(s => (
            <div key={s.name} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontWeight:600, color:'#1E3A5F', fontSize:14 }}>{s.name}</span>
                <span style={{ fontWeight:800, color:s.color, fontSize:14 }}>{s.value}%</span>
              </div>
              <div style={{ width:'100%', height:10, background:'#F1F5F9', borderRadius:5 }}>
                <div style={{ width:`${s.value}%`, height:10, borderRadius:5, background:s.color,
                  transition:'width 1s ease' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop:20, background:'#FEF3C7', borderRadius:14, padding:'12px 16px' }}>
            <p style={{ color:'#92400E', fontWeight:700, fontSize:13 }}>💡 AI Suggestion</p>
            <p style={{ color:'#92400E', fontSize:13, marginTop:4 }}>
              Focus on English (68%) — 10% improvement here adds +142 rank positions based on your current profile.
            </p>
          </div>
        </div>
      )}

      {/* Scholarships */}
      {tab === 'scholarships' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {SCHOLARSHIPS.map(s => (
            <div key={s.name} style={{ background:'#fff', borderRadius:20, padding:18,
              boxShadow:'0 2px 12px rgba(0,0,0,0.05)', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ fontSize:32 }}>🎓</div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F' }}>{s.name}</p>
                <p style={{ color:'#D4AF37', fontWeight:800, fontSize:16 }}>{s.amount}</p>
                <p style={{ color:'#94A3B8', fontSize:12 }}>Deadline: {s.deadline}</p>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ background:'#DCFCE7', color:'#15803D',
                  borderRadius:20, padding:'5px 14px', fontWeight:800, fontSize:14 }}>
                  {s.match} match
                </div>
                <button style={{ marginTop:8, background:'none', border:'1px solid #D4AF37',
                  borderRadius:10, padding:'5px 12px', color:'#D4AF37', cursor:'pointer',
                  fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:12 }}>
                  Apply →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
JSEOF

cat > src/pages/mentor/CouponManager.jsx << 'JSEOF'
import { useState, useEffect } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

function generateCouponCode(name) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const digits = Math.floor(1000 + Math.random() * 9000)
  return `GURU-${initials}-${digits}`
}

export default function CouponManager() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const STORE_KEY = `mentor_coupons_${user?.id}`

  const [coupons, setCoupons] = useState(() =>
    JSON.parse(localStorage.getItem(STORE_KEY) || '[]')
  )
  const [earnings] = useState({
    total: 3, totalRupees: 150, pending: 47, withdrawn: 103,
  })

  const generate = () => {
    const code = generateCouponCode(user?.name || 'Mentor')
    const expiry = new Date(); expiry.setMonth(expiry.getMonth() + 3)
    const c = { id: `cp-${Date.now()}`, code, used: 0, cashback: 0,
      createdAt: new Date().toISOString(), expiresAt: expiry.toISOString(), active: true }
    const updated = [c, ...coupons]
    setCoupons(updated)
    localStorage.setItem(STORE_KEY, JSON.stringify(updated))
    navigator.clipboard?.writeText(code)
    showToast('success', `🎉 Coupon ${code} generated & copied!`)
  }

  const share = (code) => {
    const msg = `Use my TryIT mentor code ${code} to get ₹50 off your first subscription! tryiteducations.net`
    if (navigator.share) navigator.share({ text: msg })
    else { navigator.clipboard?.writeText(msg); showToast('success', 'Share message copied!') }
  }

  return (
    <AppLayout>
      <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#1E3A5F', fontSize:26, marginBottom:6 }}>
        🎟️ Coupon Manager
      </h1>
      <p style={{ color:'#94A3B8', fontSize:14, marginBottom:24 }}>
        Generate referral coupons. Earn ₹50 per new user, ₹200 per institution.
      </p>

      {/* Earnings stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
        {[['💰',`₹${earnings.totalRupees}`,'Total Earned'],
          ['⏳',`₹${earnings.pending}`,'Pending'],
          ['✅',`₹${earnings.withdrawn}`,'Withdrawn']].map(([e,v,l])=>(
          <div key={l} style={{ background:'#fff', borderRadius:18, padding:'14px 12px',
            textAlign:'center', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize:24 }}>{e}</p>
            <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, color:'#D4AF37', fontSize:20 }}>{v}</p>
            <p style={{ color:'#94A3B8', fontSize:11 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ background:'linear-gradient(135deg,rgba(30,58,95,0.06),rgba(212,175,55,0.06))',
        borderRadius:18, padding:'14px 18px', marginBottom:20,
        border:'1.5px solid rgba(212,175,55,0.25)' }}>
        <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, color:'#1E3A5F', marginBottom:8 }}>
          💡 How Cashback Works
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {[['New user signs up via your coupon','₹50 cashback'],
            ['User upgrades to Pro via coupon','₹100 cashback'],
            ['Institution joins via coupon','₹200 cashback'],
            ['Minimum to withdraw','₹100'],
            ['Payment via UPI within 7 days','after 30-day quality check']].map(([label,val])=>(
            <div key={label} style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:'#475569', fontSize:13 }}>• {label}</span>
              <span style={{ color:'#D4AF37', fontWeight:700, fontSize:13 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button onClick={generate} style={{
        width:'100%', padding:16, borderRadius:16, border:'none',
        background:'linear-gradient(135deg,#D4AF37,#E8C84A)',
        fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:16,
        color:'#1E3A5F', cursor:'pointer', marginBottom:20,
        boxShadow:'0 4px 20px rgba(212,175,55,0.4)',
      }}>
        ✨ Generate New Coupon
      </button>

      {/* Coupon list */}
      {coupons.length === 0 ? (
        <div style={{ textAlign:'center', padding:32, color:'#94A3B8' }}>
          <p style={{ fontSize:36 }}>🎟️</p>
          <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:600, marginTop:8 }}>
            No coupons yet. Generate your first one!
          </p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {coupons.map(c => (
            <div key={c.id} style={{ background:'#fff', borderRadius:18, padding:'16px 18px',
              boxShadow:'0 2px 10px rgba(0,0,0,0.05)',
              border: c.active ? '1.5px solid rgba(212,175,55,0.3)' : '1.5px solid #E2E8F0' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                    color:'#1E3A5F', fontSize:20, letterSpacing:1 }}>{c.code}</p>
                  <p style={{ color:'#94A3B8', fontSize:12, marginTop:3 }}>
                    Created: {c.createdAt.slice(0,10)} · Expires: {c.expiresAt.slice(0,10)}
                  </p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontFamily:'Poppins,sans-serif', fontWeight:800,
                    color:'#D4AF37', fontSize:18 }}>{c.used} uses</p>
                  <p style={{ color:'#22C55E', fontWeight:700, fontSize:14 }}>₹{c.cashback} earned</p>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, marginTop:12 }}>
                <button onClick={() => share(c.code)} style={{
                  flex:1, padding:'9px', borderRadius:10, border:'none',
                  background:'#1E3A5F', color:'#fff',
                  fontFamily:'Poppins,sans-serif', fontWeight:600, fontSize:13, cursor:'pointer',
                }}>📤 Share</button>
                <button onClick={() => { navigator.clipboard?.writeText(c.code); showToast('success','Code copied!') }}
                  style={{ flex:1, padding:'9px', borderRadius:10,
                    border:'1.5px solid #D4AF37', background:'transparent',
                    color:'#D4AF37', fontFamily:'Poppins,sans-serif',
                    fontWeight:600, fontSize:13, cursor:'pointer' }}>
                  📋 Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
JSEOF

echo "    ✅ Section 6 done"
# ══════════════════════════════════════════════════════════════════
# SECTION 7 — Exam generator script + FCM v1 push script
# ══════════════════════════════════════════════════════════════════
echo "  [7/13] Exam generator + FCM v1 push script..."

cat > scripts/generateMockExams.js << 'JSEOF'
#!/usr/bin/env node
/**
 * TryIT — generateMockExams.js
 * Generates a realistic mock exam catalog for the search index.
 * Run: node scripts/generateMockExams.js
 * Output: public/data/exams.json
 */
const fs = require('fs')
const path = require('path')

const STATE_PSCS = [
  'TNPSC','KPSC','APPSC','TSPSC','MPPSC','UPPSC','BPSC','RPSC','MPSC',
  'UKPSC','HPSC','PPSC','GPSC','JPSC','CGPSC','WBPSC','OPSC','APSC',
  'Goa PSC','Manipur PSC','Meghalaya PSC','Mizoram PSC','Nagaland PSC',
  'Sikkim PSC','Tripura PSC','Arunachal PSC','Assam PSC','Kerala PSC',
]
const STATE_NAMES = [
  'Tamil Nadu','Karnataka','Andhra Pradesh','Telangana','Madhya Pradesh',
  'Uttar Pradesh','Bihar','Rajasthan','Maharashtra','Uttarakhand',
  'Himachal Pradesh','Punjab','Gujarat','Jharkhand','Chhattisgarh',
  'West Bengal','Odisha','Assam','Goa','Manipur','Meghalaya','Mizoram',
  'Nagaland','Sikkim','Tripura','Arunachal Pradesh','Kerala',
]
const BANKING_BODIES = ['IBPS','SBI','RBI','NABARD','SIDBI','SEBI','IRDAI']
const BANK_TYPES = ['PO','Clerk','SO','RRB Officer','RRB Assistant','Grade B','AM','AFO']
const SSC_EXAMS = [
  'SSC CGL Tier 1','SSC CGL Tier 2','SSC CHSL Tier 1','SSC CHSL Tier 2',
  'SSC MTS Paper 1','SSC GD Constable','SSC CPO SI','SSC JE Civil',
  'SSC JE Electrical','SSC JE Mechanical','SSC Stenographer Grade C',
  'SSC Stenographer Grade D','SSC Selection Post Phase',
]
const RAILWAYS = [
  'RRB NTPC CBT 1','RRB NTPC CBT 2','RRB Group D CBT','RRB ALP CBT 1',
  'RRB ALP CBT 2','RRB JE CBT 1','RRB JE CBT 2','RPF Constable',
  'RPF Sub Inspector','RDSO JE','RITES Engineer',
]
const DEFENCE = [
  'NDA Paper 1','NDA Paper 2','CDS I','CDS II','AFCAT Flying','AFCAT Ground',
  'Agniveer Army GD','Agniveer Army Technical','Agniveer Army Clerk',
  'Agniveer Navy SSR','Agniveer Navy AA','Agniveer Vayu X','Agniveer Vayu Y',
  'BSF Head Constable','CISF ASI','CRPF Constable','ITBP Constable','SSB SI',
]
const MEDICAL = [
  'NEET UG','NEET PG','NEET MDS','INI-CET','FMGE','NExT Paper 1','NExT Paper 2',
  'AIIMS Nursing','JIPMER PG','PGIMER','CMC Vellore Entrance',
]
const ENGINEERING = [
  'JEE Main Jan','JEE Main Apr','JEE Advanced','BITSAT','VITEEE','SRMJEEE',
  'MET Manipal','KIITEE','AMU Engineering','Jamia Millia Tech',
]
const GATE_PAPERS = [
  'CS','EC','ME','CE','EE','IN','CH','BT','AE','GE','MN','MT','PE','PI',
  'XE','XH','XL','AG','AR','CY','EY','MA','PH','ST','TF',
]
const TEACHING = [
  'CTET Paper 1','CTET Paper 2','KVS PGT','KVS TGT','KVS Primary',
  'NVS TGT','NVS PGT','DSSSB Primary Teacher','DSSSB TGT English',
  'DSSSB TGT Maths','DSSSB TGT Science','UP TET Paper 1','UP TET Paper 2',
]
const LAW = ['CLAT UG','CLAT PG','AILET UG','AILET PG','SLAT','MHCET Law','AP LAWCET','TS LAWCET']
const PROFESSIONAL = [
  'CA Foundation','CA Inter Group 1','CA Inter Group 2','CA Final Group 1','CA Final Group 2',
  'CS Foundation','CS Executive Module 1','CS Executive Module 2','CS Professional',
  'CMA Foundation','CMA Inter','CMA Final',
  'ICSI Registration','ICAI Articleship Test',
]
const SCHOLARSHIP = [
  'NTSE Stage 1','NTSE Stage 2','NMMS','INSPIRE SHE','KVPY Stream SA',
  'KVPY Stream SX','KVPY Stream SB','NSO Junior','NSO Senior',
  'IMO Junior','IMO Senior','NCO',
]
const MBA = [
  'CAT','MAT Feb','MAT May','MAT Sep','CMAT','NMAT','SNAP','XAT','IIFT',
  'TISS MAT','MH-CET MBA','KMAT Karnataka','TANCET MBA','APICET',
]

let exams = []
let idCounter = 1

function addExam(name, body, category, stream, tags = [], popular = false) {
  exams.push({
    id: `exam-${String(idCounter++).padStart(5,'0')}`,
    name, short_name: name.slice(0,12).trim(),
    body, category, stream: stream || 'Any',
    is_popular: popular,
    tags: [...tags, name.toLowerCase(), body.toLowerCase(), category.toLowerCase()],
  })
}

// ── Central Government ──────────────────────────────────────────
addExam('UPSC CSE Prelims','UPSC','Civil Services','Any',['upsc','ias','ips','civil services','prelims'],true)
addExam('UPSC CSE Mains','UPSC','Civil Services','Any',['upsc','ias','mains'],true)
addExam('UPSC IFS','UPSC','Civil Services','Science',[],false)
addExam('UPSC CDS I','UPSC','Defence','Any',[],false)
addExam('UPSC CDS II','UPSC','Defence','Any',[],false)
addExam('UPSC NDA I','UPSC','Defence','Any',['nda','defence'],true)
addExam('UPSC NDA II','UPSC','Defence','Any',['nda','defence'],false)
addExam('UPSC CAPF','UPSC','Civil Services','Any',[],false)
addExam('UPSC EPFO','UPSC','Civil Services','Any',[],false)
addExam('UPSC LDCE','UPSC','Civil Services','Any',[],false)

// ── SSC ─────────────────────────────────────────────────────────
SSC_EXAMS.forEach(e => addExam(e,'SSC','SSC','Any',['ssc'],e.includes('CGL')||e.includes('CHSL')))

// ── Railways ────────────────────────────────────────────────────
RAILWAYS.forEach(e => addExam(e,'RRB','Railways','Any',['rrb','railway'],e.includes('NTPC')||e.includes('Group D')))

// ── Banking ─────────────────────────────────────────────────────
BANKING_BODIES.forEach(b => {
  BANK_TYPES.forEach(t => {
    addExam(`${b} ${t}`,b,'Banking','Any',[b.toLowerCase(),'bank'],
      (b==='IBPS'||b==='SBI')&&(t==='PO'||t==='Clerk'))
  })
})

// ── Defence ─────────────────────────────────────────────────────
DEFENCE.forEach(e => addExam(e,'Ministry of Defence','Defence','Any',['defence','army','navy','airforce'],e.includes('Agniveer')))

// ── Medical ─────────────────────────────────────────────────────
MEDICAL.forEach(e => addExam(e,'NTA / NBE','Medical India','Science',['medical','neet'],e.includes('NEET')))

// ── Engineering ─────────────────────────────────────────────────
ENGINEERING.forEach(e => addExam(e,'NTA / University','Engineering','Science',['engineering'],e.includes('JEE')))
GATE_PAPERS.forEach(p => addExam(`GATE ${p}`,`IIT/NIT GATE`,'Engineering','Science',['gate'],p==='CS'||p==='EC'))

// ── Teaching ────────────────────────────────────────────────────
TEACHING.forEach(e => addExam(e,'CBSE / KVS','Teaching','Any',['teacher','ctet'],e.includes('CTET')))

// ── State PSC (each PSC × 5 post types) ─────────────────────────
const pscTypes = ['Group 1','Group 2','Group 3','Group 4','Junior Assistant']
STATE_PSCS.forEach((psc,i) => {
  pscTypes.forEach(type => {
    addExam(`${psc} ${type}`,psc,'State PSC','Any',[psc.toLowerCase(),'state psc'])
  })
})

// ── State TET ───────────────────────────────────────────────────
STATE_NAMES.forEach(s => {
  addExam(`${s} TET Paper 1`,`${s} Education Dept`,'Teaching','Any',['tet','teacher'])
  addExam(`${s} TET Paper 2`,`${s} Education Dept`,'Teaching','Any',['tet','teacher'])
})

// ── Law ─────────────────────────────────────────────────────────
LAW.forEach(e => addExam(e,'NLU / Universities','Law','Any',['law','clat'],e.includes('CLAT')))

// ── Professional ────────────────────────────────────────────────
PROFESSIONAL.forEach(e => addExam(e,'ICAI / ICSI / ICoAI','Professional','Commerce',['ca','cs','cma'],e.includes('Foundation')))

// ── Scholarship ─────────────────────────────────────────────────
SCHOLARSHIP.forEach(e => addExam(e,'NCERT / DST','Scholarship','Any',['scholarship'],e.includes('NTSE')||e.includes('NMMS')))

// ── MBA Entrance ────────────────────────────────────────────────
MBA.forEach(e => addExam(e,'IIM / Universities','Management','Any',['mba','management'],e==='CAT'))

// ── ITI ─────────────────────────────────────────────────────────
const itiTrades = ['Electrician','Fitter','Turner','Welder','Mechanic MV','COPA',
  'Draughtsman Civil','Draughtsman Mechanical','Plumber','Carpenter',
  'Sheet Metal Worker','Wireman','Electronic Mechanic','Refrigeration AC']
itiTrades.forEach(t => addExam(`AITT ${t}`,`NCVT`,'ITI & Vocational','Vocational',['iti','ncvt']))

// ── Judiciary / Law Services ────────────────────────────────────
STATE_NAMES.slice(0,15).forEach(s => addExam(`${s} Judicial Service Exam`,`${s} High Court`,'Law','Any',['judiciary','judge']))

console.log(`Generated ${exams.length} exams`)
const outPath = path.join(__dirname,'..','public','data','exams.json')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, JSON.stringify(exams, null, 2))
console.log(`✅ Written to ${outPath}`)
console.log(`To use: import the JSON and pass to Fuse.js in SmartSearch.jsx`)
JSEOF

cat > pipeline/push_notifications_v1.py << 'PYEOF'
#!/usr/bin/env python3
"""
TryIT Educations — FCM HTTP v1 Push Notifications
Uses OAuth2 service account (not the deprecated legacy API key).
Run: python pipeline/push_notifications_v1.py --role student --lang ta
"""
import os, json, time, schedule, argparse, random
import google.auth
import google.auth.transport.requests
from google.oauth2 import service_account
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL','')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY','')
PROJECT_ID   = os.getenv('FIREBASE_PROJECT_ID','')
SA_FILE      = os.getenv('FIREBASE_SA_FILE','firebase-service-account.json')

sb = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL else None

SCOPES = ['https://www.googleapis.com/auth/firebase.messaging']

def get_access_token():
    """Obtain a short-lived OAuth2 access token using the service account."""
    try:
        creds = service_account.Credentials.from_service_account_file(SA_FILE, scopes=SCOPES)
        request = google.auth.transport.requests.Request()
        creds.refresh(request)
        return creds.token
    except Exception as e:
        print(f'[TOKEN] Error: {e}. Using mock mode.')
        return None

def send_fcm_v1(token, title, body, data=None):
    """Send a single notification via FCM HTTP v1 API."""
    access_token = get_access_token()
    if not access_token or not PROJECT_ID:
        print(f'  [MOCK] Would send to {token[:20]}...: {title}')
        return True
    import urllib.request
    url = f'https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send'
    payload = json.dumps({
        'message': {
            'token': token,
            'notification': {'title': title, 'body': body},
            'data': {k: str(v) for k, v in (data or {}).items()},
            'android': {'notification': {'icon': 'tryit_logo', 'color': '#D4AF37'}},
            'apns': {'payload': {'aps': {'badge': 1}}},
        }
    }).encode()
    req = urllib.request.Request(url, data=payload, method='POST')
    req.add_header('Authorization', f'Bearer {access_token}')
    req.add_header('Content-Type', 'application/json; UTF-8')
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status == 200
    except Exception as e:
        print(f'  [FCM] Error: {e}')
        return False

# ── MULTILINGUAL MESSAGES ─────────────────────────────────────────
MESSAGES = {
    'student': {
        'en': [
            ('📚 Time to Study!', 'Your SSC CGL exam is 30 days away. Study 2 hours today. Rank: #1,243 🔥'),
            ('🧠 Daily Quiz Ready!', 'Today\'s 5-question Current Affairs quiz is live. +50 coins waiting!'),
            ('⭐ Level Up Waiting!', 'You are 760 XP away from Level 5 — Baahuveer 🦁. Take a test now!'),
            ('🎯 Streak Alert!', 'Day 12 — Don\'t break your streak! Study at least 30 minutes today.'),
        ],
        'ta': [
            ('📚 படிக்க நேரம்!', 'உங்கள் SSC CGL தேர்வு 30 நாட்களில் உள்ளது. இன்று 2 மணி நேரம் படியுங்கள் machan! 🔥'),
            ('🧠 Daily Quiz Ready!', 'இன்றைய 5 கேள்விகள் தயாராக உள்ளன. +50 coins உங்களுக்காக காத்திருக்கிறது da!'),
            ('⭐ Level up கிட்டே வந்துடீங்க!', 'Level 5 Baahuveer 🦁 ஆக 760 XP மட்டும் தேவை. ஒரு test எடு machan!'),
        ],
        'hi': [
            ('📚 पढ़ाई का समय!', 'आपका SSC CGL exam 30 दिन में है। आज 2 घंटे पढ़ें bhai! 🔥'),
            ('🧠 Daily Quiz तैयार!', 'आज के 5 Current Affairs sawaal live हैं। +50 coins का इंतजार कर रहा है!'),
            ('⭐ Level Up करो!', 'Level 5 — Baahuveer 🦁 के लिए सिर्फ 760 XP चाहिए। अभी test दो yaar!'),
        ],
        'te': [
            ('📚 చదివే సమయం!', 'మీ SSC CGL పరీక్ష 30 రోజులలో ఉంది. ఈరోజు 2 గంటలు చదవండి annayya!'),
        ],
        'kn': [
            ('📚 ಓದುವ ಸಮಯ!', 'ನಿಮ್ಮ SSC CGL ಪರೀಕ್ಷೆ 30 ದಿನಗಳಲ್ಲಿ ಇದೆ. ಇಂದು 2 ಗಂಟೆ ಓದಿ anna!'),
        ],
        'ml': [
            ('📚 പഠിക്കേണ്ട സമയം!', 'നിങ്ങളുടെ SSC CGL പരീക്ഷ 30 ദിവസത്തിൽ ഉണ്ട്. ഇന്ന് 2 മണിക്കൂർ പഠിക്കൂ ikka!'),
        ],
        'bn': [
            ('📚 পড়ার সময়!', 'তোমার SSC CGL পরীক্ষা ৩০ দিনে। আজ ২ ঘণ্টা পড়ো dada!'),
        ],
        'mr': [
            ('📚 अभ्यासाची वेळ!', 'तुमची SSC CGL परीक्षा ३० दिवसांमध्ये आहे. आज २ तास अभ्यास करा bhau!'),
        ],
    },
    'mentor': {
        'en': [
            ('💰 3 Doubts Waiting!', 'Students need your help. Answer now and earn ₹15. Top mentor earned ₹2,340 this week!'),
            ('🌟 Pan India Guru!', 'You\'ve answered 47 doubts! 3 more to unlock Thalavan 👑 badge. Keep going!'),
            ('📚 Publish Your Notes!', 'Upload your notes as a Guru Book. Earn 85% of every sale. Students are waiting!'),
        ],
        'ta': [
            ('💰 3 சந்தேகங்கள் காத்திருக்கின்றன!', 'மாணவர்களுக்கு உங்கள் உதவி தேவை. இப்போது பதில் சொல்லி ₹15 சம்பாதியுங்கள்!'),
            ('🌟 அகில இந்திய Guru ஆகுங்கள்!', 'நீங்கள் 47 சந்தேகங்களுக்கு பதில் சொன்னீர்கள். Thalavan badge க்கு 3 மேலும் தேவை machan!'),
        ],
        'hi': [
            ('💰 3 doubts इंतजार कर रहे!', 'छात्रों को आपकी जरूरत है। अभी जवाब दें और ₹15 कमाएं!'),
            ('🌟 Pan India Guru बनें!', 'आपने 47 doubts solve किए! Thalavan 👑 badge के लिए 3 और चाहिए bhai!'),
        ],
    },
    'institution': {
        'en': [
            ('📊 47 Students Active Today', 'Your centre has 12 tests conducted this week. Share leaderboard to attract more!'),
            ('🏆 You are Ranked #12 in India!', 'Your institution\'s performance is in top 15% nationally. Showcase your results!'),
        ],
        'ta': [
            ('📊 இன்று 47 மாணவர்கள் active', 'உங்கள் centre இந்த வாரம் 12 tests முடித்துள்ளது. மேலும் மாணவர்களை attract செய்ய leaderboard share செய்யுங்கள்!'),
        ],
    },
    'family': {
        'en': [
            ('👨‍👩‍👧 Family Streak: 7 Days! 🔥', 'Your whole family is studying together. Teamwork wins! Priya studied 2 hours today.'),
            ('⭐ Priya scored 82% today!', 'Celebrate together and keep the momentum going. Family that studies together succeeds together!'),
        ],
        'ta': [
            ('👨‍👩‍👧 Family Streak: 7 நாட்கள்! 🔥', 'உங்கள் குடும்பம் சேர்ந்து படிக்கிறது. Teamwork வெல்கிறது! Priya இன்று 2 மணி நேரம் படித்தார்.'),
        ],
    },
}

def get_users_by_role(role):
    if not sb: return []
    try:
        res = sb.table('profiles').select('id,fcm_token,languages,exam_ids,streak,rank').eq('role', role).not_.is_('fcm_token', 'null').execute()
        return res.data or []
    except: return []

def notify_role(role, lang_filter=None):
    print(f'\n[PUSH v1] Notifying role: {role.upper()}')
    users = get_users_by_role(role)
    if not users:
        print(f'  No users found in DB. Using mock: 5 simulated users.')
        users = [{'id':f'mock-{i}','fcm_token':f'mock-token-{i}','languages':['en']} for i in range(5)]

    role_msgs = MESSAGES.get(role, {})
    total = 0
    for u in users:
        langs = u.get('languages') or ['en']
        lang = langs[0][:2].lower() if langs else 'en'
        if lang_filter and lang != lang_filter: lang = lang_filter
        msgs = role_msgs.get(lang) or role_msgs.get('en') or []
        if not msgs: continue
        title, body = random.choice(msgs)
        token = u.get('fcm_token','')
        ok = send_fcm_v1(token, title, body, {'role': role, 'lang': lang})
        if ok: total += 1

    print(f'  ✅ Sent to {total} users')
    return total

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--role', default=None, help='student|mentor|institution|family')
    parser.add_argument('--lang', default=None, help='en|hi|ta|te|kn|ml|bn|mr')
    parser.add_argument('--schedule', action='store_true', help='Run on schedule (7AM, 2PM, 7PM)')
    args = parser.parse_args()

    if args.schedule:
        roles = ['student','mentor','institution','family']
        def morning(): [notify_role(r, args.lang) for r in roles]
        def afternoon(): notify_role('student', args.lang); notify_role('mentor', args.lang)
        def evening(): notify_role('student', args.lang); notify_role('family', args.lang)
        schedule.every().day.at('07:00').do(morning)
        schedule.every().day.at('14:00').do(afternoon)
        schedule.every().day.at('19:00').do(evening)
        print('[PUSH v1] Scheduled: 7AM (all roles), 2PM (student+mentor), 7PM (student+family)')
        morning()
        while True: schedule.run_pending(); time.sleep(60)
    else:
        roles = [args.role] if args.role else ['student','mentor','institution','family']
        for role in roles: notify_role(role, args.lang)

if __name__ == '__main__':
    main()
PYEOF

echo "    ✅ Section 7 done"
# ══════════════════════════════════════════════════════════════════
# SECTION 8 — AllExams stub + route additions + PATCH_GUIDE
# ══════════════════════════════════════════════════════════════════
echo "  [8/13] AllExams page + remaining stubs..."

cat > src/pages/exams/AllExams.jsx << 'JSEOF'
import { useState, useEffect, useCallback } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import { useNavigate } from 'react-router-dom'
import ExamDropRequest from '../../components/ExamDropRequest'

export default function AllExams() {
  const navigate  = useNavigate()
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [exams, setExams]       = useState([])
  const [fuseReady, setFuse]    = useState(null)
  const [showDrop, setShowDrop] = useState(false)

  // Load exams + Fuse on mount
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res  = await fetch('/data/exams.json')
        const data = await res.json()
        if (!mounted) return
        setExams(data)
        const { default: Fuse } = await import('fuse.js')
        const f = new Fuse(data, {
          keys: [{ name:'name', weight:0.5 }, { name:'tags', weight:0.35 }, { name:'body', weight:0.15 }],
          threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2, includeScore: true,
        })
        if (mounted) setFuse(f)
      } catch {
        // File not generated yet — use small inline set
        if (mounted) setExams([])
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const search = useCallback((q) => {
    if (!q.trim() || q.length < 2) { setResults([]); return }
    setLoading(true)
    if (fuseReady) setResults(fuseReady.search(q, { limit: 10 }).map(r => r.item))
    else setResults(exams.filter(e => e.name.toLowerCase().includes(q.toLowerCase())).slice(0,10))
    setLoading(false)
  }, [fuseReady, exams])

  useEffect(() => {
    const t = setTimeout(() => search(query), 200)
    return () => clearTimeout(t)
  }, [query, search])

  const list = query.length >= 2 ? results : exams.filter(e => e.is_popular).slice(0, 20)

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold text-[#1E3A5F] font-poppins mb-2">🎯 All Exams</h1>
      <p className="text-slate-500 text-sm mb-5">
        {exams.length > 0 ? `${exams.length.toLocaleString()}+ exam pathways` : 'Loading exam database...'} ·
        India's most complete exam search
      </p>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search 1,10,000+ exams... (try 'UPCS' for UPSC, 'ssc cg' for SSC CGL)"
          className="clay-input pl-12 py-4 text-base"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin-slow" />
        )}
      </div>

      {/* No results → show drop request */}
      {query.length >= 2 && results.length === 0 && !loading && (
        <div className="mb-5 space-y-3">
          <p className="text-slate-500 text-sm">No results for "{query}"</p>
          <ExamDropRequest compact />
        </div>
      )}

      {/* Results / Popular list */}
      <div className="clay rounded-3xl overflow-hidden">
        <div className="bg-[#1E3A5F] px-5 py-3 flex justify-between items-center">
          <span className="text-[#D4AF37] font-bold font-poppins text-sm">
            {query.length >= 2 ? `Results for "${query}"` : 'Popular Exams'}
          </span>
          <span className="text-white/40 text-xs">{list.length} shown</span>
        </div>
        {list.length === 0 && !query && (
          <div className="p-8 text-center text-slate-400">
            <p className="text-2xl mb-2">⏳</p>
            <p className="text-sm">Loading exam database...<br/>Run <code>node scripts/generateMockExams.js</code> to generate it.</p>
          </div>
        )}
        {list.map((exam, i) => (
          <div key={exam.id} onClick={() => navigate(`/exams/${exam.id}/universe`)}
            className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#1E3A5F] flex items-center justify-center
              text-[#D4AF37] font-bold text-xs font-poppins flex-shrink-0">
              {exam.name.slice(0,3).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1E3A5F] text-sm font-poppins truncate">{exam.name}</p>
              <p className="text-slate-400 text-xs mt-0.5">{exam.body} · {exam.category}</p>
            </div>
            {exam.is_popular && (
              <span className="text-[10px] bg-[#D4AF37]/20 text-[#1E3A5F] px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                Popular
              </span>
            )}
            <span className="text-[#D4AF37] text-lg flex-shrink-0">›</span>
          </div>
        ))}
      </div>

      {/* Always show drop request at bottom */}
      <div className="mt-6 flex justify-center">
        {showDrop
          ? <ExamDropRequest onClose={() => setShowDrop(false)} />
          : <button onClick={() => setShowDrop(true)}
              className="flex items-center gap-2 border-2 border-dashed border-[#D4AF37]/50 text-[#D4AF37]
                rounded-2xl px-6 py-3 font-semibold text-sm hover:border-[#D4AF37] transition-colors">
              📬 Don't see your exam? Request it →
            </button>
        }
      </div>
    </AppLayout>
  )
}
JSEOF

# Remaining simple stubs needed by App.jsx
for FILE_PATH in \
  "src/pages/exams/ExamDetail.jsx" \
  "src/pages/exams/ExamUniverse.jsx" \
  "src/pages/career-compass/CareerCompass.jsx" \
  "src/pages/roadmap/Roadmap.jsx" \
  "src/pages/exam-alerts/ExamAlerts.jsx" \
  "src/pages/hall/HallHub.jsx" \
  "src/pages/hall/CreateHall.jsx" \
  "src/pages/hall/HallHome.jsx" \
  "src/pages/hall/BattleArena.jsx" \
  "src/pages/hall/HallLeaderboard.jsx" \
  "src/pages/games/GamesHub.jsx" \
  "src/pages/games/MathBlitz.jsx" \
  "src/pages/brain-teaser/BrainTeaser.jsx" \
  "src/pages/focus-mode/FocusMode.jsx" \
  "src/pages/tournaments/TournamentHub.jsx" \
  "src/pages/classroom/ClassroomHub.jsx" \
  "src/pages/classroom/PDFLibrary.jsx" \
  "src/pages/classroom/StudyPlanner.jsx" \
  "src/pages/current-affairs/CurrentAffairs.jsx" \
  "src/pages/scholarships/ScholarshipHub.jsx" \
  "src/pages/guru/PostDoubt.jsx" \
  "src/pages/guru/DoubtThread.jsx" \
  "src/pages/mentor/MentorHub.jsx" \
  "src/pages/mentor/CashbackCenter.jsx" \
  "src/pages/pricing/PricingPage.jsx" \
  "src/pages/family/FamilyHub.jsx" \
  "src/pages/wallet/WalletPage.jsx" \
  "src/pages/referral/ReferralPage.jsx" \
  "src/pages/analytics/Analytics.jsx" \
  "src/pages/achievements/Achievements.jsx" \
  "src/pages/leaderboard/Leaderboard.jsx" \
  "src/pages/parent/ParentLogin.jsx" \
  "src/pages/parent/ParentDashboard.jsx" \
  "src/pages/tryit-lab/TryITLab.jsx" \
  "src/pages/legal/Privacy.jsx" \
  "src/pages/legal/Terms.jsx"
do
  # Only create if file is empty or doesn't exist
  if [ ! -s "$FILE_PATH" ]; then
    NAME=$(basename "$FILE_PATH" .jsx)
    DIR=$(dirname "$FILE_PATH")
    mkdir -p "$DIR"
    cat > "$FILE_PATH" << STUBEOF
import { useNavigate } from 'react-router-dom'
import AppLayout from '$(python3 -c "
import os.path
rel = os.path.relpath('src/components/layout/AppLayout', '$(dirname $FILE_PATH)')
print(rel)" 2>/dev/null || echo '../../components/layout/AppLayout')'

export default function ${NAME}() {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-5xl">🔧</p>
        <h2 className="text-2xl font-bold text-[#1E3A5F] font-poppins">${NAME}</h2>
        <p className="text-slate-500 text-sm">This page is being built. Coming soon!</p>
        <button onClick={() => navigate('/dashboard')}
          className="btn-gold px-6 py-3 rounded-2xl font-bold">
          ← Back to Dashboard
        </button>
      </div>
    </AppLayout>
  )
}
STUBEOF
  fi
done

echo "    ✅ Section 8 done"
# ══════════════════════════════════════════════════════════════════
# SECTION 9 — PATCH_GUIDE.md + App.jsx routes update
# ══════════════════════════════════════════════════════════════════
echo "  [9/13] Writing PATCH_GUIDE.md..."

cat > PATCH_GUIDE.md << 'MDEOF'
# TryIT Educations — Integration Patch Guide
# Run install_missing_parts.sh first, then follow steps below.

## ════════════════════════════════════════════
## 1. Wrap app with LanguageProvider in main.jsx
## ════════════════════════════════════════════

Open: src/main.jsx
Find:  <React.StrictMode>
Change to:

```jsx
import { LanguageProvider } from './context/LanguageContext'

// In ReactDOM.createRoot(...)render():
<React.StrictMode>
  <LanguageProvider>
    <App />
  </LanguageProvider>
</React.StrictMode>
```

## ════════════════════════════════════════════
## 2. Add new routes to App.jsx
## ════════════════════════════════════════════

Open: src/App.jsx
Add these lazy imports near the top (after existing ones):

```jsx
const AllExams         = lazy(() => import('./pages/exams/AllExams'))
const CentreDashboard  = lazy(() => import('./pages/centre/CentreDashboard'))
const StudentHistory   = lazy(() => import('./pages/centre/StudentHistory'))
const MyTestHistory    = lazy(() => import('./pages/student/MyTestHistory'))
const AdminLogin       = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'))
const JourneyPassport  = lazy(() => import('./pages/JourneyPassport'))
const CouponManager    = lazy(() => import('./pages/mentor/CouponManager'))
const EbookStore       = lazy(() => import('./pages/ebooks/EbookStore'))
```

Add these <Route> entries inside your <Routes> block:

```jsx
{/* ── Exams (real page, not stub) ── */}
<Route path="/exams"                       element={<AllExams />} />

{/* ── Centre Hub ── */}
<Route path="/centre/dashboard"            element={<CentreDashboard />} />
<Route path="/centre/students"             element={<StudentHistory />} />
<Route path="/student/test-history"        element={<MyTestHistory />} />

{/* ── Admin ── */}
<Route path="/admin/login"                 element={<AdminLogin />} />
<Route path="/admin/dashboard"             element={<AdminDashboard />} />

{/* ── Journey + Mentor ── */}
<Route path="/journey"                     element={<JourneyPassport />} />
<Route path="/mentor-hub/coupons"          element={<CouponManager />} />
<Route path="/ebooks"                      element={<EbookStore />} />
```

## ════════════════════════════════════════════
## 3. Add LanguageSelector to Topbar
## ════════════════════════════════════════════

Open: src/components/layout/Topbar.jsx
Find the Globe import/button and replace with:

```jsx
import LanguageSelector from '../LanguageSelector'

// In JSX, replace the <Globe> button with:
<LanguageSelector compact />
```

## ════════════════════════════════════════════
## 4. Add DevMenu to AppLayout
## ════════════════════════════════════════════

Open: src/components/layout/AppLayout.jsx
Add at the very bottom inside the return, after </main>:

```jsx
import DevMenu from './DevMenu'
// Add inside return, before the closing </div>:
<DevMenu />
```

## ════════════════════════════════════════════
## 5. Add sidebar links for new pages
## ════════════════════════════════════════════

Open: src/components/layout/Sidebar.jsx
In the NAV array, add:

```js
{ path: '/journey',           label: 'My Journey',    icon: Map,          badge: null  },
{ path: '/ebooks',            label: 'Guru Books',    icon: BookOpen,     badge: 'New' },
{ path: '/student/test-history', label: 'Test History', icon: History,   badge: null  },
// Add to partner section:
{ path: '/mentor-hub/coupons',label: 'My Coupons',    icon: Tag,          badge: null  },
```

## ════════════════════════════════════════════
## 6. Generate the 10,000 exam JSON file
## ════════════════════════════════════════════

Run once from project root:
  node scripts/generateMockExams.js

This creates: public/data/exams.json
After this, AllExams.jsx search will work with real exam names.

## ════════════════════════════════════════════
## 7. Security.js — remove plaintext key fallback
## ════════════════════════════════════════════

Open: src/lib/security.js
Find: const MASTER_KEY = import.meta.env.VITE_QUESTION_ENCRYPTION_KEY || 'tryit-dev-key-change-before-launch'
Replace with:
```js
const MASTER_KEY = import.meta.env.VITE_QUESTION_ENCRYPTION_KEY
if (!MASTER_KEY && import.meta.env.PROD) {
  throw new Error('[Security] VITE_QUESTION_ENCRYPTION_KEY not set in production!')
}
const KEY = MASTER_KEY || 'tryit-dev-key-UNSAFE-local-only'
```
Then use KEY instead of MASTER_KEY everywhere in that file.

## ════════════════════════════════════════════
## 8. Add coupon field to Login.jsx signup
## ════════════════════════════════════════════

Open: src/pages/Login.jsx
In the OTP step, after the verify button, add:

```jsx
{/* Coupon field — shown during first-time signup */}
<div style={{ marginTop: 12 }}>
  <input placeholder="Have a mentor coupon? Enter code (optional)"
    id="coupon_input"
    style={{ width:'100%', padding:'10px 14px', borderRadius:12,
      border:'1.5px solid #E2E8F0', fontSize:13, outline:'none',
      fontFamily:'Inter,sans-serif', boxSizing:'border-box' }}
    onFocus={e => e.target.style.borderColor='#D4AF37'}
    onBlur={e => e.target.style.borderColor='#E2E8F0'}
  />
  <p style={{ color:'#94A3B8', fontSize:11, marginTop:4 }}>
    New users get ₹50 discount. Mentors earn cashback.
  </p>
</div>
```

Then in goIn() function, before navigate():
```js
const couponInput = document.getElementById('coupon_input')
if (couponInput?.value) {
  localStorage.setItem('applied_coupon', couponInput.value.toUpperCase().trim())
}
```

## ════════════════════════════════════════════
## 9. Push notifications — Python requirements
## ════════════════════════════════════════════

Add to pipeline/requirements.txt:
  google-auth>=2.20.0
  google-auth-httplib2>=0.1.0

Run: pip install -r pipeline/requirements.txt --break-system-packages

For FCM v1, place your Firebase service account JSON file at:
  pipeline/firebase-service-account.json
Set in pipeline/.env: FIREBASE_SA_FILE=firebase-service-account.json
Set in pipeline/.env: FIREBASE_PROJECT_ID=your-firebase-project-id

## ════════════════════════════════════════════
## 10. Test everything
## ════════════════════════════════════════════

1. npm run dev
2. Go to /admin/login → admin@tryit.com / admin123
3. Go to /ebooks → see Guru Books store
4. Go to /journey → see ID card + timeline + scholarships
5. Go to /exams → search "UPCS" → sees "UPSC CSE" (fuzzy)
6. Go to /centre/dashboard → create a test
7. Go to /mentor-hub/coupons → generate a coupon
8. Press 🔧 (bottom-left, dev mode only) → enter PIN 000000 → quick navigation

MDEOF

echo "    ✅ PATCH_GUIDE.md written"

# ══════════════════════════════════════════════════════════════════
# DONE
# ══════════════════════════════════════════════════════════════════
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ All missing components installed!                    ║"
echo "║                                                          ║"
echo "║  Next steps:                                             ║"
echo "║  1. Read PATCH_GUIDE.md for manual integration steps     ║"
echo "║  2. Run: node scripts/generateMockExams.js               ║"
echo "║  3. Run: npm run dev                                      ║"
echo "║                                                          ║"
echo "║  New routes available:                                   ║"
echo "║    /exams             → AllExams with fuzzy search       ║"
echo "║    /admin/login       → Admin (admin@tryit.com/admin123) ║"
echo "║    /journey           → Life Journey Passport            ║"
echo "║    /ebooks            → Mentor Guru Books Store          ║"
echo "║    /centre/dashboard  → Centre Hub (unlimited tests)     ║"
echo "║    /centre/students   → Student History                  ║"
echo "║    /mentor-hub/coupons→ Coupon Cashback Manager          ║"
echo "║    /admin/dashboard   → 360° Admin Control               ║"
echo "║    🔧 bottom-left     → Dev Menu (PIN: 000000)           ║"
echo "╚══════════════════════════════════════════════════════════╝"
