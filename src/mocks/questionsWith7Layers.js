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
