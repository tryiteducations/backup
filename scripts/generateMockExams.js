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
