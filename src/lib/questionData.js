// src/lib/questionData.js
// Tanglish style: Native address + emotion, English for all technical terms
// No apostrophes in strings to avoid JS parse errors

export const Q = {
  text: 'Which of the following is NO LONGER a Fundamental Right under the Indian Constitution?',
  opts: ['Right to Equality','Right to Property','Right to Freedom of Speech','Right to Constitutional Remedies'],
  correct: 1,
  exams: 'UPSC · SSC CGL · IBPS · RRB · All State PSCs · NDA · CTET · CLAT'
}

export const LAYERS_EN = [
  {t:'✅ Why Right to Property is Correct',c:'#4ADE80',content:'Right to Property was a Fundamental Right under Articles 19(1)(f) and 31. The 44th Amendment 1978 removed it. Now it exists only as a Legal Right under Article 300A. Citizens cannot approach the Supreme Court directly under Article 32 for property violations. Must go to High Court only.'},
  {t:'❌ Why Option A (Right to Equality) is Wrong',c:'#F87171',content:'Right to Equality (Articles 14-18) is fully intact as a Fundamental Right. Article 14: equality before law. Article 15: no discrimination. Article 17: abolishes untouchability. Never removed.'},
  {t:'❌ Why Option C (Freedom of Speech) is Wrong',c:'#F87171',content:'Freedom of Speech Article 19(1)(a) is the backbone of Indian democracy. While Article 19(2) allows reasonable restrictions, the right itself was never removed. Still a Fundamental Right.'},
  {t:'❌ Why Option D (Constitutional Remedies) is Wrong',c:'#F87171',content:'Article 32 is the heart and soul of the Constitution per Dr. Ambedkar. Gives citizens direct access to the Supreme Court for Fundamental Rights violations. Never permanently removed.'},
  {t:'🧠 Memory Formula',c:'#C9A84C',content:'44th Amendment 1978 = Right to Property REMOVED → Article 300A. 86th Amendment 2002 = Right to Education ADDED → Article 21A. One removed, one added. Both appear in every exam every year.'},
  {t:'📖 Story to Remember',c:'#A78BFA',content:'1978, Bihar: A farmer had land the government wanted to acquire. Before 44th Amendment — he could go to the Supreme Court directly as a Fundamental Rights violation. After 1978 — only High Court under Article 226. Less protection. This downgrade is exactly what examiners test.'},
  {t:'🎯 Cross-Exam Intelligence',c:'#60A5FA',content:'Appears in UPSC Prelims GS2, SSC CGL GA, IBPS GK, RRB Group D, all State PSCs, NDA, CTET, CLAT. Key facts: (1) 44th Amendment 1978 (2) Article 300A (3) Legal Right not Fundamental Right (4) Cannot approach SC under Art 32 (5) Indira Gandhi government enacted it.'},
]

export const FULL_LAYERS = {

  Tamil:[
    {t:'Correct Answer - Right to Property',c:'#4ADE80',content:'அண்ணா / அக்கா, கேளுங்க! Right to Property முந்நாடு Fundamental Right-ஆ இருந்துச்சு - Articles 19(1)(f) and 31-ல். 44th Amendment 1978-ல் Indira Gandhi government அதை நீக்கிட்டாங்க. இப்போ Article 300A-ல் மட்டும் Legal Right. Supreme Court-ல் நேரடியா போக முடியாது - High Court மட்டும்தான். TNPSC, SSC எல்லாத்திலயும் வரும்!'},
    {t:'Option A Wrong - Right to Equality',c:'#F87171',content:'நல்லா கவனியுங்க! Right to Equality (Articles 14-18) இன்னும் பூரண்மையாக Fundamental Right-ஆகவே இருக்கு. Article 17 - Untouchability abolish ஆச்சு. யாரும் நீக்கலை, நீக்கவும் மாட்டாங்க!'},
    {t:'Option C Wrong - Freedom of Speech',c:'#F87171',content:'Freedom of Speech Article 19(1)(a) - Indian democracy-ஓட backbone! கவலையே படாதீங்க, இது போகவும் மாட்டாது. Article 19(2)-ல் Reasonable restrictions இருக்கு, ஆனா right நீக்கவில்லை.'},
    {t:'Option D Wrong - Article 32',c:'#F87171',content:'Article 32 - Dr. Ambedkar “heart and soul of the Constitution” ங்னு சோன்னாரு. Fundamental Rights violation ஆனா Supreme Court-ல் நேரடியா போக right குடுக்குது. இதை எந்த government-உம் நீக்கவில்லை!'},
    {t:'Memory Formula',c:'#C9A84C',content:'அண்ணா/அக்கா, Note பண்ணிக்கங்க: 44th Amendment 1978 = Right to Property OUT, Article 300A-ல் போச்சு. 86th Amendment 2002 = Right to Education IN, Article 21A-ல் வந்துச்சு. இரண்டும் TNPSC, SSC-ல் கட்டாயம் வரும்!'},
    {t:'Story - 1978 Thanjavur',c:'#A78BFA',content:'1978-ல் Thanjavur-ல் ஒரு விவசாயிக்கு நிலம் இருந்துச்சு. Government அதை எடுக்க வந்துச்சு. 44th Amendment-க்କு முந்னாடு - Supreme Court-ல் நேரடியா போய் fight பண்ணலாம். அதுக்କு அப்புறம் - High Court மட்டும்தான். இந்த difference-தான் examiner கேக்கிறார்!'},
    {t:'Exam Tip - TNPSC Special',c:'#60A5FA',content:'TNPSC Group 1, 2, 2A, 4, VAO + SSC CGL + IBPS + RRB - எல்லாத்திலயும் வரும்! 5 key points: (1) 44th Amendment 1978 (2) Indira Gandhi government (3) Article 300A (4) High Court only (5) Legal Right - not Fundamental Right. இந்த 5 points மனசுல வச்சிக்கங்க!'},
  ],

  Hindi:[
    {t:'✅ Correct Answer — Right to Property',c:'#4ADE80',content:'भाई/बहन, ध्यान से सुनो! Right to Property पहले Fundamental Right था — Articles 19(1)(f) and 31 में. 44th Amendment 1978 में Indira Gandhi सरकार ने इसे हटा दिया. अब Article 300A में सिर्फ Legal Right — Supreme Court नहीं, सिर्फ High Court. SSC CGL, UPSC हर जगह यही पूछते हैं!'},
    {t:'❌ Option A Wrong — Right to Equality',c:'#F87171',content:'ध्यान से देखो! Right to Equality (Articles 14-18) अभी भी पूरी तरह Fundamental Right है. Article 17 — Untouchability abolish. कभी नहीं हटा, हटेगा भी नहीं!'},
    {t:'❌ Option C Wrong — Freedom of Speech',c:'#F87171',content:'Freedom of Speech Article 19(1)(a) — Indian democracy की जड़! ये नहीं हटी, नहीं हटेगी. Article 19(2) में restrictions हैं, लेकिन right remove नहीं हुआ.'},
    {t:'❌ Option D Wrong — Article 32',c:'#F87171',content:'Article 32 — Dr. Ambedkar ने कहा “heart and soul of the Constitution”. Fundamental Rights violation पर Supreme Court जाने का right. कभी permanently remove नहीं हुआ!'},
    {t:'🧠 Formula — याद करो',c:'#C9A84C',content:'भाई/बहन, Note करो: 44th Amendment 1978 = Right to Property OUT → Article 300A. 86th Amendment 2002 = Right to Education IN → Article 21A. दोनों SSC, UPSC में हर साल आते हैं!'},
    {t:'📖 Story — 1978 का किसान',c:'#A78BFA',content:'1978 में पटना के पास किसान के पास जमीन थी. Government लेना चाहती थी. 44th Amendment से पहले — Supreme Court सीधे जा सकता था. नबाद — सिर्फ High Court. यही difference examiner पूछते हैं!'},
    {t:'🎯 Exam Tip — SSC/UPSC Special',c:'#60A5FA',content:'SSC CGL, UPSC Prelims, IBPS, RRB, सभी State PSC — हर जगह. 5 key points: (1) 44th Amendment 1978 (2) Indira Gandhi govt (3) Article 300A (4) High Court only (5) Legal Right — not Fundamental Right. इन्हें याद रखो!'},
  ],

  Telugu:[
    {t:'✅ Correct Answer — Right to Property',c:'#4ADE80',content:'అన్నా / అక్కా, వినండి! Right to Property ముందు Fundamental Right-గా ఉండేది — Articles 19(1)(f) and 31 లో. 44th Amendment 1978లో Indira Gandhi సర్కారు దాన్ని తీసేసింది. ఇప్పుడు Article 300A లో Legal Right మాత్రమే — Supreme Court కి నేరుగా వెళ్ళలేరు, High Court మాత్రమే. APPSC, SSC అన్నింట్లో వస్తుంది!'},
    {t:'❌ Option A Wrong — Right to Equality',c:'#F87171',content:'జాగ్రత్తగా చూడండి! Right to Equality (Articles 14-18) ఇంకా పూర్తిగా Fundamental Right-గా ఉంది. Article 17 — Untouchability abolish. ఎవరూ తీయలేదు, తీయలేరు కూడా!'},
    {t:'❌ Option C Wrong — Freedom of Speech',c:'#F87171',content:'Freedom of Speech Article 19(1)(a) — Indian democracy స్తంభం! ఇది పోలేదు, పోదు కూడా. Article 19(2) restrictions ఉన్నాయి, కానీ right remove కాలేదు.'},
    {t:'❌ Option D Wrong — Article 32',c:'#F87171',content:'Article 32 — Dr. Ambedkar గారు “heart and soul of the Constitution” అన్నారు. Fundamental Rights violation కి Supreme Court కి నేరుగా వెళ్ళవచ్చు. ఎప్పుడూ remove చేయలేదు!'},
    {t:'🧠 Formula — గుర్తుపెట్టుకోండి',c:'#C9A84C',content:'అన్నా/అక్కా, Note చేసుకోండి: 44th Amendment 1978 = Right to Property OUT → Article 300A. 86th Amendment 2002 = Right to Education IN → Article 21A. రెండూ APPSC, SSC లో వస్తాయి!'},
    {t:'📖 Story — 1978 Andhra రైతు',c:'#A78BFA',content:'1978లో Krishna జిల్లాలో ఒక రైతుకి పొలం ఉండేది. Government తీసుకోవాలని వచ్చింది. 44th Amendment కి ముందు — Supreme Court నేరుగా వెళ్ళవచ్చు. తర్వాత — High Court మాత్రమే. ఈ difference-నే examiner అడుగుతారు!'},
    {t:'🎯 Exam Tip — APPSC Special',c:'#60A5FA',content:'APPSC Group 1,2,3,4 + SSC CGL + IBPS + RRB — అన్నింట్లో. 5 key points: (1) 44th Amendment 1978 (2) Indira Gandhi govt (3) Article 300A (4) High Court only (5) Legal Right — not Fundamental Right. ఇవి note చేసుక౏ండి!'},
  ],
}

// Layer 1 Tanglish for remaining 31 languages
export const LAYER1_NATIVE = {
  Kannada:    {t:'✅ Correct Answer',c:'#4ADE80',content:'ಅಣ್ಣ / ಅಕ್ಕ, ಕೇಳಿ! Right to Property ಮೊದಲು Fundamental Right-ಆಗಿತ್ತು — Articles 19(1)(f) and 31-ರಲ್ಲಿ. 44th Amendment 1978-ರಲ್ಲಿ remove ಮಾಡಲಾಯಿತು. ಈಗ Article 300A-ರಲ್ಲಿ Legal Right ಮಾತ್ರ — Supreme Court ನೇರವಾಗಿ ಹೋಗಲ್ಲ, High Court ಮಾತ್ರ. KPSC, SSC ಸಗಳವದರಲ್ಲಿ ಈ question ಬರತ್ತೆ!'},
  Malayalam:  {t:'✅ Correct Answer',c:'#4ADE80',content:'ചേട്ടന്‍ / ചേച്ചി, കേള്ക്കൂ! Right to Property മുമ്പ്പ് Fundamental Right ആയിരുന്നു — Articles 19(1)(f) and 31-ല്‍. 44th Amendment 1978-ല്‍ remove ചെയ്തു. ഇപ്പോ ആര്ട്ടിക്കിള്‍ 300A-ല്‍ Legal Right മാത്രം — Supreme Court നേരിട്ട് പോവാന്‍ വയ്യ, High Court മാത്രം. Kerala PSC, SSC എല്ലായിടത്തും ഈ question വരും!'},
  Bengali:    {t:'✅ Correct Answer',c:'#4ADE80',content:'দাদা / দিদি, মনোযোগ দিয়ে শোনো! Right to Property আগে Fundamental Right ছিল — Articles 19(1)(f) and 31-এ. 44th Amendment 1978-এ remove করা হয়েছে. এখন Article 300A-তে Legal Right মাত্র — Supreme Court নয়, High Court. WBPSC, SSC সবজায়গায় এই question আসে!'},
  Marathi:    {t:'✅ Correct Answer',c:'#4ADE80',content:'दादा / ताई, नीट ऐका! Right to Property आधी Fundamental Right होते — Articles 19(1)(f) and 31 मध्ये. 44th Amendment 1978 मध्ये तो remove केला. आता Article 300A मध्ये Legal Right फक्त — Supreme Court नाही, High Court. MPSC, SSC सगळ्यांत हा प्रश्न येतो!'},
  Gujarati:   {t:'✅ Correct Answer',c:'#4ADE80',content:'भाई / बहेन, ध्यानथी सांभळो! Right to Property पहेलां Fundamental Right हतुं — Articles 19(1)(f) and 31 मां. 44th Amendment 1978मां remove थयुं. हवे Article 300Aमां Legal Right — Supreme Court नहीं, High Court. GPSC, SSC सगळे आ question आवे!'},
  Punjabi:    {t:'✅ Correct Answer',c:'#4ADE80',content:'ਵੀਰ / ਭੈਣ, ਧਿਆਨ ਨਾਲ ਸੁਣੋ! Right to Property ਪਹਿਲਾਂ Fundamental Right ਸੀ — Articles 19(1)(f) and 31 ਵਿੱਚ. 44th Amendment 1978 ਵਿੱਚ remove ਹੋ ਗਿਆ. ਹੁਣ Article 300A ਵਿੱਚ Legal Right — Supreme Court ਨਹੀਂ, High Court. PPSC, SSC ਸੱਭ ਜਗਾਹ ਇਹ question!'},
  Odia:       {t:'✅ Correct Answer',c:'#4ADE80',content:'ଭାଇ / ଭଉଣୀ, ଧ୍ଯାନ ଦେଇ ଶୁଣ! Right to Property ଆଗରୁ Fundamental Right ଥିଲା — Articles 19(1)(f) and 31ରେ. 44th Amendment 1978ରେ remove ହୋଇଗଲା. ଏବେ Article 300Aରେ Legal Right — Supreme Courtରେ ଯା଒ଇ ହୁଏ ନାହଁ, High Court. OPSC, SSC ସବଜାଗାରେ ଏହି question!'},
  Assamese:   {t:'✅ Correct Answer',c:'#4ADE80',content:'দা / দি, মন দি শুনক! Right to Property আগতে Fundamental Right আছিল — Articles 19(1)(f) and 31ত. 44th Amendment 1978ত remove করা হল. এতিয়া Article 300Aত Legal Right মাত্ৰ — Supreme Courtলৈ সোধাসুধি যাব নো঵াৰি, High Court. APSC, SSC সকলতে এই question!'},
  Manipuri:   {t:'✅ Correct Answer',c:'#4ADE80',content:'Anna/Akka (respected), shingna! Right to Property Fundamental Right oiba Articles 19(1)(f) and 31 da. 44th Amendment 1978 da thourakpani. Article 300A da Legal Right bana — Supreme Court ta nattai, High Court matam. MPSC, SSC da henna loishinnani!'},
  Nagamese:   {t:'✅ Correct Answer',c:'#4ADE80',content:'Bhai / Bhaini, dhiyan se sunna! Right to Property age Fundamental Right tha — Articles 19(1)(f) and 31 mein. 44th Amendment 1978 se remove howa. Ab Article 300A mein sirf Legal Right — Supreme Court nahi, High Court. Nagaland PSC, SSC har jagah yahi question!'},
  Mizo:       {t:'✅ Correct Answer',c:'#4ADE80',content:'Pa/Pi (respected), hman rawh! Right to Property chuan Fundamental Right a nih — Articles 19(1)(f) and 31 ah. 44th Amendment 1978 ah remove a ni. Tunah Article 300A ah Legal Right a ni — Supreme Court ah direct in kal theih loh, High Court chauh. Mizoram PSC, SSC zawng zawng ah hei question hi a lo!'},
  Khasi:      {t:'✅ Correct Answer',c:'#4ADE80',content:'Kong / Bah (respected), shabar! Right to Property da Fundamental Right — Articles 19(1)(f) and 31. 44th Amendment 1978 da remove la. Article 300A da Legal Right — Supreme Court noh em, High Court bun. Meghalaya PSC, SSC ki question!'},
  Kokborok:   {t:'✅ Correct Answer',c:'#4ADE80',content:'Anna / Akka (respected), boro! Right to Property Fundamental Right ason — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court direct nai, High Court. Tripura PSC, SSC question!'},
  Angami:     {t:'✅ Correct Answer',c:'#4ADE80',content:'Anna / Akka (respected), listen! Right to Property Fundamental Right — Articles 19(1)(f) and 31. 44th Amendment 1978 removed it. Article 300A Legal Right only — High Court, not Supreme Court. Nagaland PSC, SSC question!'},
  Ao:         {t:'✅ Correct Answer',c:'#4ADE80',content:'Anna / Akka (respected), listen! Right to Property was Fundamental Right — Articles 19(1)(f) and 31. 44th Amendment 1978 removed it. Now Article 300A Legal Right only — High Court, not Supreme Court. Nagaland PSC, SSC question!'},
  Maithili:   {t:'✅ Correct Answer',c:'#4ADE80',content:'भैया / भैनी, ध्यानसंग सुनू! Right to Property पहिने Fundamental Right छल — Articles 19(1)(f) and 31 में. 44th Amendment 1978 में remove केलक. अखन Article 300A में Legal Right — Supreme Court नहि, High Court. BPSC, SSC सभ जगह इ question!'},
  Bhojpuri:   {t:'✅ Correct Answer',c:'#4ADE80',content:'भईया / भहिनी, ध्यान से सुना! Right to Property पहिले Fundamental Right रहल — Articles 19(1)(f) and 31 में. 44th Amendment 1978 में remove हो गईल. Article 300A में Legal Right — Supreme Court नहीं, High Court. BPSC, SSC सबही question!'},
  Awadhi:     {t:'✅ Correct Answer',c:'#4ADE80',content:'भईया / भहिनी, सुनौ! Right to Property पहिले Fundamental Right रहा — Articles 19(1)(f) and 31 में. 44th Amendment 1978 में remove होइ गवा. Article 300A में Legal Right — Supreme Court नहीं, High Court. UP PSC, SSC question!'},
  Rajasthani: {t:'✅ Correct Answer',c:'#4ADE80',content:'भाई / बहन, ध्यान राखो! Right to Property पेलां Fundamental Right हो — Articles 19(1)(f) and 31 में. 44th Amendment 1978 में remove होगो. Article 300A में Legal Right — Supreme Court नी, High Court. RPSC, SSC question!'},
  Haryanvi:   {t:'✅ Correct Answer',c:'#4ADE80',content:'भाई / बहन, ध्यान से सुण! Right to Property पहले Fundamental Right था — Articles 19(1)(f) and 31 में. 44th Amendment 1978 में remove हो गया. Article 300A में Legal Right — Supreme Court नहीं, High Court. HSSC, SSC question!'},
  Chhattisgarhi:{t:'✅ Correct Answer',c:'#4ADE80',content:'भाई / बहिनी, सुनो! Right to Property पहिले Fundamental Right रहिस — Articles 19(1)(f) and 31 में. 44th Amendment 1978 में remove हो गिस. Article 300A में Legal Right — Supreme Court नहीं, High Court. CGPSC, SSC question!'},
  Urdu:       {t:'✅ Correct Answer',c:'#4ADE80',content:'بھائی / بہن, ذرا سنیں! Right to Property پہلے Fundamental Right تھا — Articles 19(1)(f) and 31 میں. 44th Amendment 1978 میں remove ہوا. Article 300A میں Legal Right — Supreme Court نہیں, High Court. SSC, UPSC ہر جگہ!'},
  Sanskrit:   {t:'✅ Correct Answer',c:'#4ADE80',content:'आर्य / आर्ये, शृणु! Right to Property पूर्वं Fundamental Right आसीत् — Articles 19(1)(f) and 31 अधीनम्. 44th Amendment 1978 तदपाकृतम्. Article 300A अधीनं Legal Right — Supreme Courtमेव गन्तुं न शक्यते, High Court. UPSC, SSC सर्वत्र!'},
  Kashmiri:   {t:'✅ Correct Answer',c:'#4ADE80',content:'وانہ / باںکھ, سونہ! Right to Property پیٹھ Fundamental Right اوسہ — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court نہیں, High Court. JKPSC, SSC!'},
  Dogri:      {t:'✅ Correct Answer',c:'#4ADE80',content:'वीर / दीदी, ध्यान नाल सुण! Right to Property पहले Fundamental Right था — Articles 19(1)(f) and 31. 44th Amendment 1978 विच remove. Article 300A Legal Right — Supreme Court नहीं, High Court. JKSSB, SSC!'},
  Bodo:       {t:'✅ Correct Answer',c:'#4ADE80',content:'দা / দিদি, দা শুন! Right to Property Fundamental Right আসিল — Articles 19(1)(f) and 31. 44th Amendment 1978 কি হাফ. Article 300A Legal Right — Supreme Court নাথায়, High Court. APSC, SSC!'},
  Santali:    {t:'✅ Correct Answer',c:'#4ADE80',content:'Dada / Didi (respected), sun! Right to Property Fundamental Right reabon — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court nai, High Court. Jharkhand PSC, SSC question!'},
  Konkani:    {t:'✅ Correct Answer',c:'#4ADE80',content:'दादा / ताई, आयक! Right to Property आधीं Fundamental Right आसिल्लो — Articles 19(1)(f) and 31. 44th Amendment 1978त remove केलो. Article 300A मद्लें Legal Right — Supreme Court नहीं, High Court. Goa PSC, SSC question!'},
  Sindhi:     {t:'✅ Correct Answer',c:'#4ADE80',content:'وہھیر / بھین, سنو! Right to Property اۚھی Fundamental Right ھو — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court نہیں, High Court. SSC, UPSC!'},
  Nepali:     {t:'✅ Correct Answer',c:'#4ADE80',content:'दाई / दिदी, ध्यान दिईकन सुन्नुस्! Right to Property पहिले Fundamental Right थियो — Articles 19(1)(f) and 31. 44th Amendment 1978 मा remove. Article 300A मा Legal Right — Supreme Court नहीं, High Court. Sikkim PSC, SSC!'},
  Tulu:       {t:'✅ Correct Answer',c:'#4ADE80',content:'ಅಣ್ಣ / ಅಕ್క, ವಿನಿಯೆರಿ! Right to Property Fundamental Right-ಆತ್ — Articles 19(1)(f) and 31. 44th Amendment 1978-ಡ್ remove. Article 300A Legal Right — Supreme Court ನಹಿ, High Court. KPSC, SSC!'},
  Ho:         {t:'✅ Correct Answer',c:'#4ADE80',content:'Dada / Didi (respected), sun! Right to Property Fundamental Right — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — High Court, not Supreme Court. Jharkhand PSC, SSC!'},
  Gondi:      {t:'✅ Correct Answer',c:'#4ADE80',content:'Bhai / Bahin, sona! Right to Property Fundamental Right raha — Articles 19(1)(f) and 31. 44th Amendment 1978 me remove. Article 300A Legal Right — Supreme Court nahi, High Court. MP, CG PSC, SSC!'},
  Garhwali:   {t:'✅ Correct Answer',c:'#4ADE80',content:'भुला / बहनि, ध्यान से सुण! Right to Property पहले Fundamental Right थो — Articles 19(1)(f) and 31. 44th Amendment 1978 मा remove. Article 300A Legal Right — Supreme Court नहीं, High Court. Uttarakhand PSC, SSC!'},
  Kumaoni:    {t:'✅ Correct Answer',c:'#4ADE80',content:'भैजी / दीदी, ध्यानसे सुण! Right to Property पहले Fundamental Right छियो — Articles 19(1)(f) and 31. 44th Amendment 1978 में remove. Article 300A Legal Right — Supreme Court नहीं, High Court. Uttarakhand PSC, SSC!'},
  Pahari:     {t:'✅ Correct Answer',c:'#4ADE80',content:'वीर / दीदी, ध्यान नाल सुण! Right to Property पहले Fundamental Right था — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court नहीं, High Court. HP PSC, SSC!'},
  Bundeli:    {t:'✅ Correct Answer',c:'#4ADE80',content:'भाई / बहन, ध्यान से सुण! Right to Property पहले Fundamental Right रहो — Articles 19(1)(f) and 31. 44th Amendment 1978 remove. Article 300A Legal Right — Supreme Court नहीं, High Court. MP PSC, SSC!'},
  Saurashtra: {t:'✅ Correct Answer',c:'#4ADE80',content:'Bhai / Ben, dhyan thi samabhalo! Right to Property Fundamental Right hatu — Articles 19(1)(f) and 31. 44th Amendment 1978 ma remove. Article 300A ma Legal Right — Supreme Court nahi, High Court. GPSC, SSC!'},
  Kutchi:     {t:'✅ Correct Answer',c:'#4ADE80',content:'Bhai / Bahin, dhyan thi suno! Right to Property pehlan Fundamental Right hato — Articles 19(1)(f) and 31. 44th Amendment 1978 ma remove. Article 300A ma Legal Right — Supreme Court nahi, High Court. GPSC, SSC!'},
}

export const ALL_LANGS = ['Tamil','Hindi','Telugu','Kannada','Malayalam','Bengali','Marathi','Gujarati','Punjabi','Odia','Assamese','Manipuri','Nagamese','Mizo','Khasi','Kokborok','Angami','Ao','Maithili','Bhojpuri','Awadhi','Rajasthani','Haryanvi','Chhattisgarhi','Urdu','Sanskrit','Kashmiri','Dogri','Bodo','Santali','Konkani','Sindhi','Nepali','Tulu','Ho','Gondi','Garhwali','Kumaoni','Pahari','Bundeli','Saurashtra','Kutchi']

export const LANG_SCRIPTS = {'Tamil':'தமிழ்','Hindi':'हिंदी','Telugu':'తెలుగు','Kannada':'ಕನ್ನಡ','Malayalam':'മലയാളം','Bengali':'বাংলা','Marathi':'मराठी','Gujarati':'ગુजराती','Punjabi':'ਪੰਜਾਬੀ','Odia':'ଓଡ़िआ','Assamese':'অসমীয়া','Manipuri':'মৈতৈলোন্','Urdu':'اردو','Sanskrit':'संस्कृत','Maithili':'मैथिली','Dogri':'डोगरी','Bodo':'বড়ো','Nepali':'नेपाली','Kashmiri':'کشمیری','Sindhi':'سنڌي','Konkani':'कोंकणी','Santali':'ᱥᱟᱱᱛᱟᱤᱠ','Tulu':'ತುಳು'}

export const getLayers = (lang) => {
  if (FULL_LAYERS[lang])   return FULL_LAYERS[lang]
  if (LAYER1_NATIVE[lang]) return [LAYER1_NATIVE[lang], ...LAYERS_EN.slice(1)]
  return LAYERS_EN
}
