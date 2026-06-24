// src/lib/questionData.js
// TANGLISH RULE: Native script for address+emotion+connectors ONLY
// ALL technical terms stay in English: Article, Amendment, Fundamental Right,
// Supreme Court, High Court, Legal Right, Constitution, Government

export const Q = {
  text: 'Which of the following is NO LONGER a Fundamental Right under the Indian Constitution?',
  opts: ['Right to Equality','Right to Property','Right to Freedom of Speech','Right to Constitutional Remedies'],
  correct: 1,
  exams: 'UPSC · SSC CGL · IBPS · RRB · All State PSCs · NDA · CTET · CLAT'
}

export const LAYERS_EN = [
  {t:'✅ Why Right to Property is Correct',c:'#4ADE80',
   content:'Right to Property was a Fundamental Right under Articles 19(1)(f) and 31. The 44th Amendment 1978 removed it. Now it exists only as a Legal Right under Article 300A. Citizens cannot approach the Supreme Court directly under Article 32 for property violations. High Court only.'},
  {t:'❌ Why Option A (Right to Equality) is Wrong',c:'#F87171',
   content:'Right to Equality (Articles 14-18) is fully intact as a Fundamental Right. Article 14: equality before law. Article 15: no discrimination. Article 17: abolishes untouchability. Never removed.'},
  {t:'❌ Why Option C (Freedom of Speech) is Wrong',c:'#F87171',
   content:'Freedom of Speech Article 19(1)(a) is the backbone of Indian democracy. Article 19(2) allows reasonable restrictions but the right itself was never removed. Still a Fundamental Right.'},
  {t:'❌ Why Option D (Constitutional Remedies) is Wrong',c:'#F87171',
   content:'Article 32 is the heart and soul of the Constitution per Dr. Ambedkar. Gives citizens direct access to the Supreme Court for Fundamental Rights violations. Never permanently removed.'},
  {t:'🧠 Memory Formula',c:'#C9A84C',
   content:'44th Amendment 1978 = Right to Property REMOVED. Goes to Article 300A. 86th Amendment 2002 = Right to Education ADDED. Goes to Article 21A. One removed, one added. Both appear in every exam every year.'},
  {t:'📖 Story to Remember',c:'#A78BFA',
   content:'1978 Bihar: A farmer had land the government wanted. Before 44th Amendment he could go to the Supreme Court directly as a Fundamental Rights case. After 1978 only High Court under Article 226. Less protection. This downgrade is exactly what examiners test.'},
  {t:'🎯 Cross-Exam Intelligence',c:'#60A5FA',
   content:'Appears in UPSC Prelims GS2, SSC CGL GA, IBPS GK, RRB Group D, all State PSCs, NDA, CTET, CLAT. 5 key facts: (1) 44th Amendment 1978 (2) Article 300A (3) Legal Right not Fundamental Right (4) High Court only not Supreme Court (5) Indira Gandhi government enacted it.'},
]

export const FULL_LAYERS = {

  Tamil: [
    {t:'✅ Correct Answer',c:'#4ADE80',
     content:'அண்ணா / அக்கா, கேளுங்க! Right to Property before Fundamental Right-ஆ இருந்துச்சு — Articles 19(1)(f) and 31-ல். 44th Amendment 1978-ல் Indira Gandhi government remove பண்ணிட்டாங்க. இப்போ Article 300A-ல் மட்டும் Legal Right — Supreme Court-ல் நேரடியா போக முடியாது, High Court மட்டும்தான். TNPSC, SSC எல்லாத்திலயும் வரும்!'},
    {t:'❌ Option A Wrong',c:'#F87171',
     content:'நல்லா கவனியுங்க! Right to Equality (Articles 14-18) இன்னும் fully intact-ஆ இருக்கு. Article 17 — Untouchability abolish. யாரும் இதை remove பண்ணலை, பண்ணவும் மாட்டாங்க!'},
    {t:'❌ Option C Wrong',c:'#F87171',
     content:'Freedom of Speech Article 19(1)(a) — Indian democracy-ஓட backbone! இது போகவும் மாட்டாது. Article 19(2)-ல் reasonable restrictions இருக்கு, ஆனா right-ஐ remove பண்ணலை.'},
    {t:'❌ Option D Wrong',c:'#F87171',
     content:'Article 32 — Dr. Ambedkar “heart and soul of the Constitution” ங்னு சோன்னாரு. Fundamental Rights violation ஆனா Supreme Court-ல் நேரடியா போக right குடுக்குது. எந்த government-உம் இதை remove பண்ணலை!'},
    {t:'🧠 Formula',c:'#C9A84C',
     content:'அண்ணா/அக்கா, Note பண்ணிக்கங்க: 44th Amendment 1978 = Right to Property OUT → Article 300A. 86th Amendment 2002 = Right to Education IN → Article 21A. இரண்டும் TNPSC, SSC-ல் கட்டாயம் வரும்!'},
    {t:'📖 Story — 1978',c:'#A78BFA',
     content:'1978-ல் Thanjavur-ல் ஒரு விவசாயிக்கு நிலம் இருந்துச்சு. Government அதை எடுக்க வந்துச்சு. 44th Amendment-କு before — Supreme Court-ல் நேரடியா போய் fight பண்ணலாம். After — High Court மட்டும்தான். இந்த difference-தான் examiner கேக்கிறார்!'},
    {t:'🎯 Exam Tip',c:'#60A5FA',
     content:'TNPSC Group 1,2,2A,4,VAO + SSC CGL + IBPS + RRB — எல்லாத்திலயும்! 5 key points: (1) 44th Amendment 1978 (2) Indira Gandhi government (3) Article 300A (4) High Court only (5) Legal Right not Fundamental Right. இந்த 5 points note பண்ணிக்கங்க!'},
  ],

  Hindi: [
    {t:'✅ Correct Answer',c:'#4ADE80',
     content:'भाई / बहन, ध्यान से सुनो! Right to Property before Fundamental Right था — Articles 19(1)(f) and 31 में. 44th Amendment 1978 में Indira Gandhi government ने remove किया. अब Article 300A में सिर्फ Legal Right — Supreme Court नहीं, सिर्फ High Court. SSC CGL, UPSC हर जगह यही पूछते हैं!'},
    {t:'❌ Option A Wrong',c:'#F87171',
     content:'ध्यान से देखो! Right to Equality (Articles 14-18) अभी भी fully intact है. Article 17 — Untouchability abolish. कभी remove नहीं हुआ, होगा भी नहीं!'},
    {t:'❌ Option C Wrong',c:'#F87171',
     content:'Freedom of Speech Article 19(1)(a) — Indian democracy की backbone! ये कभी remove नहीं हुई. Article 19(2) में reasonable restrictions हैं, लेकिन right remove नहीं हुआ.'},
    {t:'❌ Option D Wrong',c:'#F87171',
     content:'Article 32 — Dr. Ambedkar ने कहा “heart and soul of the Constitution”. Fundamental Rights violation पर Supreme Court जाने का right. कभी permanently remove नहीं हुआ!'},
    {t:'🧠 Formula',c:'#C9A84C',
     content:'भाई/बहन, Note करो: 44th Amendment 1978 = Right to Property OUT → Article 300A. 86th Amendment 2002 = Right to Education IN → Article 21A. दोनों SSC, UPSC में हर साल आते हैं!'},
    {t:'📖 Story — 1978',c:'#A78BFA',
     content:'1978 में Bihar में किसान के पास जमीन थी. Government लेना चाहती थी. 44th Amendment before — Supreme Court सीधे जा सकता था. After — सिर्फ High Court. यही difference examiner पूछते हैं!'},
    {t:'🎯 Exam Tip',c:'#60A5FA',
     content:'SSC CGL, UPSC Prelims, IBPS, RRB, सभी State PSC. 5 key points: (1) 44th Amendment 1978 (2) Indira Gandhi govt (3) Article 300A (4) High Court only (5) Legal Right not Fundamental Right. ये 5 points note करो!'},
  ],

  Telugu: [
    {t:'✅ Correct Answer',c:'#4ADE80',
     content:'అన్నా / అక్కా, వినండి! Right to Property before Fundamental Right-గా ఉండేది — Articles 19(1)(f) and 31 లో. 44th Amendment 1978లో Indira Gandhi government remove చేసింది. ఇప్పుడు Article 300A లో Legal Right మాత్రమే — Supreme Court కి నేరుగా వెళ్ళలేరు, High Court మాత్రమే. APPSC, SSC అన్నింట్లో వస్తుంది!'},
    {t:'❌ Option A Wrong',c:'#F87171',
     content:'జాగ్రత్తగా చూడండి! Right to Equality (Articles 14-18) ఇంకా fully intact-గా ఉంది. Article 17 — Untouchability abolish. ఎవరూ remove చేయలేదు!'},
    {t:'❌ Option C Wrong',c:'#F87171',
     content:'Freedom of Speech Article 19(1)(a) — Indian democracy backbone! ఇది remove కాలేదు. Article 19(2) reasonable restrictions ఉన్నాయి, కానీ right remove కాలేదు.'},
    {t:'❌ Option D Wrong',c:'#F87171',
     content:'Article 32 — Dr. Ambedkar “heart and soul of the Constitution” అన్నారు. Fundamental Rights violationకి Supreme Courtకి నేరుగా వెళ్ళవచ్చు. ఎప్పుడూ remove చేయలేదు!'},
    {t:'🧠 Formula',c:'#C9A84C',
     content:'అన్నా/అక్కా, Note చేసుకోండి: 44th Amendment 1978 = Right to Property OUT → Article 300A. 86th Amendment 2002 = Right to Education IN → Article 21A. రెండూ APPSC, SSC లో వస్తాయి!'},
    {t:'📖 Story — 1978',c:'#A78BFA',
     content:'1978లో Krishna జిల్లాలో ఒక రైతుకి పొలం ఉండేది. Government తీసుకోవాలని వచ్చింది. 44th Amendment before — Supreme Court నేరుగా వెళ్ళవచ్చు. After — High Court మాత్రమే. ఈ difference examiner అడుగుతారు!'},
    {t:'🎯 Exam Tip',c:'#60A5FA',
     content:'APPSC Group 1,2,3,4 + SSC CGL + IBPS + RRB — అన్నింట్లో. 5 key points: (1) 44th Amendment 1978 (2) Indira Gandhi govt (3) Article 300A (4) High Court only (5) Legal Right not Fundamental Right. Note చేసుక౏ండి!'},
  ],
}

// Layer 1 Tanglish for 31 languages: native address + English technical terms
export const LAYER1_NATIVE = {
  Kannada:     {t:'✅ Correct Answer',c:'#4ADE80',content:'ಅಣ್ಣ / ಅಕ್ಕ, ಕೇಳಿ! Right to Property before Fundamental Right-ಆಗಿತ್ತು — Articles 19(1)(f) and 31. 44th Amendment 1978 remove ಮಾಡಲಾಯಿತು. ಈಗ Article 300A-ರಲ್ಲಿ Legal Right ಮಾತ್ರ — Supreme Court direct ಹೋಗಲ್ಲ, High Court ಮಾತ್ರ. KPSC, SSC ಸಗಳವದರಲ್ಲಿ ಈ question ಬರತ್ತೆ!'},
  Malayalam:   {t:'✅ Correct Answer',c:'#4ADE80',content:'ചേട്ടന്‍ / ചേച്ചി, കേള്ക്കൂ! Right to Property before Fundamental Right ആയിരുന്നു — Articles 19(1)(f) and 31. 44th Amendment 1978 remove ചെയ്തു. ഇപ്പോ Article 300A-ല്‍ Legal Right മാത്രം — Supreme Court direct പോവാന്‍ വയ്യ, High Court മാത്രം. Kerala PSC, SSC എല്ലായിടത്തും!'},
  Bengali:     {t:'✅ Correct Answer',c:'#4ADE80',content:'দাদা / দিদি, মনোযোগ দিয়ে শোনো! Right to Property before Fundamental Right ছিল — Articles 19(1)(f) and 31. 44th Amendment 1978 remove হয়েছে. এখন Article 300A Legal Right মাত্র — Supreme Court নয়, High Court. WBPSC, SSC!'},
  Marathi:     {t:'✅ Correct Answer',c:'#4ADE80',content:'दादा / ताई, नीट ऐका! Right to Property before Fundamental Right होते — Articles 19(1)(f) and 31. 44th Amendment 1978 remove केला. आता Article 300A Legal Right फक्त — Supreme Court नाही, High Court. MPSC, SSC!'},
  Gujarati:    {t:'✅ Correct Answer',c:'#4ADE80',content:'भाई / बहेन, ध्यानथी सांभळो! Right to Property before Fundamental Right हतुं — Articles 19(1)(f) and 31. 44th Amendment 1978 remove थयुं. हवे Article 300A Legal Right — Supreme Court नहीं, High Court. GPSC, SSC!'},
  Punjabi:     {t:'✅ Correct Answer',c:'#4ADE80',content:'ਵੀਰ / ਭੈਣ, ਧਿਆਨ ਨਾਲ ਸੁਣੋ! Right to Property before Fundamental Right ਸੀ — Articles 19(1)(f) and 31. 44th Amendment 1978 remove ਹੋ ਗਿਆ. ਹੁਣ Article 300A Legal Right — Supreme Court ਨਹੀਂ, High Court. PPSC, SSC!'},
  Odia:        {t:'✅ Correct Answer',c:'#4ADE80',content:'ଭାଇ / ଭଉଣୀ, ଧ୍ଯାନ ଦେଇ ଶୁଣ! Right to Property before Fundamental Right ଥିଲା — Articles 19(1)(f) and 31. 44th Amendment 1978 remove ହୋଇଗଲା. ଏବେ Article 300A Legal Right — Supreme Court ନୁହଁ, High Court. OPSC, SSC!'},
  Assamese:    {t:'✅ Correct Answer',c:'#4ADE80',content:'দা / দি, মন দি শুনক! Right to Property before Fundamental Right আছিল — Articles 19(1)(f) and 31. 44th Amendment 1978 remove করা হল. এতিয়া Article 300A Legal Right মাত্ৰ — Supreme Court নহি, High Court. APSC, SSC!'},
  Manipuri:    {t:'✅ Correct Answer',c:'#4ADE80',content:'Anna / Akka (respected), shingna! Right to Property before Fundamental Right oiba — Articles 19(1)(f) and 31. 44th Amendment 1978 remove thourakpani. Article 300A Legal Right bana — Supreme Court direct nattai, High Court matam. MPSC, SSC!'},
  Nagamese:    {t:'✅ Correct Answer',c:'#4ADE80',content:'Bhai / Bhaini, dhiyan se sunna! Right to Property before Fundamental Right tha — Articles 19(1)(f) and 31. 44th Amendment 1978 remove howa. Ab Article 300A Legal Right — Supreme Court nahi, High Court. Nagaland PSC, SSC!'},
  Mizo:        {t:'✅ Correct Answer',c:'#4ADE80',content:'Pa / Pi (respected), hman rawh! Right to Property before Fundamental Right a nih — Articles 19(1)(f) and 31. 44th Amendment 1978 remove a ni. Tunah Article 300A Legal Right — Supreme Court direct kal theih loh, High Court chauh. Mizoram PSC, SSC!'},
  Khasi:       {t:'✅ Correct Answer',c:'#4ADE80',content:'Kong / Bah (respected), shabar! Right to Property before Fundamental Right — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court noh, High Court. Meghalaya PSC, SSC!'},
  Kokborok:    {t:'✅ Correct Answer',c:'#4ADE80',content:'Anna / Akka (respected), boro! Right to Property before Fundamental Right — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court direct nai, High Court. Tripura PSC, SSC!'},
  Angami:      {t:'✅ Correct Answer',c:'#4ADE80',content:'Anna / Akka (respected), listen! Right to Property before Fundamental Right — Articles 19(1)(f) and 31. 44th Amendment 1978 removed it. Article 300A Legal Right only — High Court not Supreme Court. Nagaland PSC, SSC!'},
  Ao:          {t:'✅ Correct Answer',c:'#4ADE80',content:'Anna / Akka (respected), listen! Right to Property before Fundamental Right — Articles 19(1)(f) and 31. 44th Amendment 1978 removed it. Article 300A Legal Right only — High Court not Supreme Court. Nagaland PSC, SSC!'},
  Maithili:    {t:'✅ Correct Answer',c:'#4ADE80',content:'भैया / भैनी, ध्यानसंग सुनू! Right to Property before Fundamental Right छल — Articles 19(1)(f) and 31. 44th Amendment 1978 remove केलक. अखन Article 300A Legal Right — Supreme Court नहि, High Court. BPSC, SSC!'},
  Bhojpuri:    {t:'✅ Correct Answer',c:'#4ADE80',content:'भईया / भहिनी, ध्यान से सुना! Right to Property before Fundamental Right रहल — Articles 19(1)(f) and 31. 44th Amendment 1978 remove हो गईल. Article 300A Legal Right — Supreme Court नहीं, High Court. BPSC, SSC!'},
  Awadhi:      {t:'✅ Correct Answer',c:'#4ADE80',content:'भईया / भहिनी, सुनौ! Right to Property before Fundamental Right रहा — Articles 19(1)(f) and 31. 44th Amendment 1978 remove होइ गवा. Article 300A Legal Right — Supreme Court नहीं, High Court. UP PSC, SSC!'},
  Rajasthani:  {t:'✅ Correct Answer',c:'#4ADE80',content:'भाई / बहन, ध्यान राखो! Right to Property before Fundamental Right हो — Articles 19(1)(f) and 31. 44th Amendment 1978 remove होगो. Article 300A Legal Right — Supreme Court नी, High Court. RPSC, SSC!'},
  Haryanvi:    {t:'✅ Correct Answer',c:'#4ADE80',content:'भाई / बहन, ध्यान से सुण! Right to Property before Fundamental Right था — Articles 19(1)(f) and 31. 44th Amendment 1978 remove हो गया. Article 300A Legal Right — Supreme Court नहीं, High Court. HSSC, SSC!'},
  Chhattisgarhi:{t:'✅ Correct Answer',c:'#4ADE80',content:'भाई / बहिनी, सुनो! Right to Property before Fundamental Right रहिस — Articles 19(1)(f) and 31. 44th Amendment 1978 remove हो गिस. Article 300A Legal Right — Supreme Court नहीं, High Court. CGPSC, SSC!'},
  Urdu:        {t:'✅ Correct Answer',c:'#4ADE80',content:'بھائی / بہن, ذرا سنیں! Right to Property before Fundamental Right تھا — Articles 19(1)(f) and 31. 44th Amendment 1978 remove ہوا. Article 300A Legal Right — Supreme Court نہیں, High Court. SSC, UPSC!'},
  Sanskrit:    {t:'✅ Correct Answer',c:'#4ADE80',content:'आर्य / आर्ये, शृणु! Right to Property before Fundamental Right आसीत् — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court न शक्यते, High Court. UPSC, SSC!'},
  Kashmiri:    {t:'✅ Correct Answer',c:'#4ADE80',content:'وانہ / باںکھ, سونہ! Right to Property before Fundamental Right اوسہ — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court نہیں, High Court. JKPSC, SSC!'},
  Dogri:       {t:'✅ Correct Answer',c:'#4ADE80',content:'वीर / दीदी, ध्यान नाल सुण! Right to Property before Fundamental Right था — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court नहीं, High Court. JKSSB, SSC!'},
  Bodo:        {t:'✅ Correct Answer',c:'#4ADE80',content:'দা / দিদি, দা শুন! Right to Property before Fundamental Right আসিল — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court নাথায়, High Court. APSC, SSC!'},
  Santali:     {t:'✅ Correct Answer',c:'#4ADE80',content:'Dada / Didi (respected), sun! Right to Property before Fundamental Right reabon — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court nai, High Court. Jharkhand PSC, SSC!'},
  Konkani:     {t:'✅ Correct Answer',c:'#4ADE80',content:'दादा / ताई, आयक! Right to Property before Fundamental Right आसिल्लो — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court नहीं, High Court. Goa PSC, SSC!'},
  Sindhi:      {t:'✅ Correct Answer',c:'#4ADE80',content:'وہھیر / بھین, سنو! Right to Property before Fundamental Right ھو — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court نہیں, High Court. SSC, UPSC!'},
  Nepali:      {t:'✅ Correct Answer',c:'#4ADE80',content:'दाई / दिदी, ध्यान दिईकन! Right to Property before Fundamental Right थियो — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court नहीं, High Court. Sikkim PSC, SSC!'},
  Tulu:        {t:'✅ Correct Answer',c:'#4ADE80',content:'ಅಣ್ಣ / ಅಕ್క, ವಿನಿಯೆರಿ! Right to Property before Fundamental Right-ಆತ್ — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court direct bokka, High Court. KPSC, SSC!'},
  Ho:          {t:'✅ Correct Answer',c:'#4ADE80',content:'Dada / Didi (respected), sun! Right to Property before Fundamental Right — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — High Court only, not Supreme Court. Jharkhand PSC, SSC!'},
  Gondi:       {t:'✅ Correct Answer',c:'#4ADE80',content:'Bhai / Bahin, sona! Right to Property before Fundamental Right — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court nahi, High Court. MP CG PSC, SSC!'},
  Garhwali:    {t:'✅ Correct Answer',c:'#4ADE80',content:'भुला / बहनि, ध्यान से सुण! Right to Property before Fundamental Right थो — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court नहीं, High Court. Uttarakhand PSC, SSC!'},
  Kumaoni:     {t:'✅ Correct Answer',c:'#4ADE80',content:'भैजी / दीदी, ध्यानसे सुण! Right to Property before Fundamental Right छियो — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court नहीं, High Court. Uttarakhand PSC, SSC!'},
  Pahari:      {t:'✅ Correct Answer',c:'#4ADE80',content:'वीर / दीदी, ध्यान नाल सुण! Right to Property before Fundamental Right था — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court नहीं, High Court. HP PSC, SSC!'},
  Bundeli:     {t:'✅ Correct Answer',c:'#4ADE80',content:'भाई / बहन, ध्यान से सुण! Right to Property before Fundamental Right रहो — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court नहीं, High Court. MP PSC, SSC!'},
  Saurashtra:  {t:'✅ Correct Answer',c:'#4ADE80',content:'Bhai / Ben, dhyan thi samabhalo! Right to Property before Fundamental Right hatu — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court nahi, High Court. GPSC, SSC!'},
  Kutchi:      {t:'✅ Correct Answer',c:'#4ADE80',content:'Bhai / Bahin, dhyan thi suno! Right to Property before Fundamental Right hato — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court nahi, High Court. GPSC, SSC!'},
}

export const ALL_LANGS = ['Tamil','Hindi','Telugu','Kannada','Malayalam','Bengali','Marathi','Gujarati','Punjabi','Odia','Assamese','Manipuri','Nagamese','Mizo','Khasi','Kokborok','Angami','Ao','Maithili','Bhojpuri','Awadhi','Rajasthani','Haryanvi','Chhattisgarhi','Urdu','Sanskrit','Kashmiri','Dogri','Bodo','Santali','Konkani','Sindhi','Nepali','Tulu','Ho','Gondi','Garhwali','Kumaoni','Pahari','Bundeli','Saurashtra','Kutchi']

export const LANG_SCRIPTS = {'Tamil':'தமிழ்','Hindi':'हिंदी','Telugu':'తెలుగు','Kannada':'ಕನ್ನಡ','Malayalam':'മലയാളം','Bengali':'বাংলা','Marathi':'मराठी','Gujarati':'ગુजराती','Punjabi':'ਪੰਜਾਬੀ','Odia':'ଓଡ़िआ','Assamese':'অসমীয়া','Manipuri':'মৈতৈলোন্','Urdu':'اردو','Sanskrit':'संस्कृत','Maithili':'मैथिली','Dogri':'डोगरी','Bodo':'বড়ো','Nepali':'नेपाली','Kashmiri':'کشمیری','Sindhi':'سنڌي','Konkani':'कोंकणी','Tulu':'ತುಳು'}

export const getLayers = (lang) => {
  if (FULL_LAYERS[lang])   return FULL_LAYERS[lang]
  if (LAYER1_NATIVE[lang]) return [LAYER1_NATIVE[lang], ...LAYERS_EN.slice(1)]
  return LAYERS_EN
}
