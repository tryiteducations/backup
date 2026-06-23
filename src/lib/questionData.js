// src/lib/questionData.js — Translation data for all 42 languages

export const Q = {
  text: 'Which of the following is NO LONGER a Fundamental Right under the Indian Constitution?',
  opts: ['Right to Equality','Right to Property','Right to Freedom of Speech','Right to Constitutional Remedies'],
  correct: 1,
  exams: 'UPSC · SSC CGL · IBPS · RRB · All State PSCs · NDA · CTET · CLAT'
}

export const LAYERS_EN = [
  {t:'✅ Why Right to Property is Correct',c:'#4ADE80',content:'Right to Property was originally guaranteed under Articles 19(1)(f) and 31. The 44th Constitutional Amendment, 1978 removed it from Fundamental Rights. It now exists only as a Legal Right under Article 300A — citizens cannot approach the Supreme Court directly under Article 32 for property violations.'},
  {t:'❌ Why Option A (Right to Equality) is Wrong',c:'#F87171',content:'Right to Equality (Articles 14–18) is fully intact. Article 14: equality before law. Article 15: no discrimination. Article 17: abolishes untouchability. All five are intact and enforceable. Never removed.'},
  {t:'❌ Why Option C (Freedom of Speech) is Wrong',c:'#F87171',content:'Article 19(1)(a) — Freedom of Speech — is a core Fundamental Right, the backbone of Indian democracy. While Article 19(2) allows reasonable restrictions, the right itself was never removed.'},
  {t:'❌ Why Option D (Constitutional Remedies) is Wrong',c:'#F87171',content:'Article 32 is called the "heart and soul of the Constitution" by Dr. Ambedkar. It gives citizens the right to directly approach the Supreme Court. Never removed permanently.'},
  {t:'🧠 Memory Formula',c:'#C9A84C',content:'44th Amendment (1978) = Right to Property REMOVED → Article 300A. 86th Amendment (2002) = Right to Education ADDED → Article 21A. One removed, one added. Both appear in every exam every year.'},
  {t:'📖 Story to Remember',c:'#A78BFA',content:'1978, Bihar: A farmer's land was being acquired by the government. Before the 44th Amendment — he could approach the Supreme Court directly as a Fundamental Rights violation. After 1978 — only the High Court under Article 226. Less protection. This downgrade is exactly what examiners test.'},
  {t:'🎯 Cross-Exam Intelligence',c:'#60A5FA',content:'Appears in: UPSC Prelims GS2, SSC CGL GA, IBPS GK, RRB Group D, all State PSCs, NDA, CTET, CLAT. Key facts: (1) 44th Amendment 1978 (2) Article 300A (3) Legal Right not Fundamental Right (4) Cannot approach SC under Art 32 (5) Indira Gandhi government enacted it.'},
]

// Full 7-layer translations — Respectful tone (Anna/Akka/Tambi + formal address)
export const FULL_LAYERS = {

  Tamil: [
    {t:'✅ சரியான விடை — சோத்துரிமை ஏன் போச்சு?',c:'#4ADE80',content:'அண்ணா / அக்கா, கேளுங்க! சோத்துரிமை (Right to Property) முன்னாடு Article 19(1)(f) மற்றும் 31-ல் Fundamental Right ஆக இருந்துச்சு. ஆனா 44வது திருத்தம் 1978-ல் Indira Gandhi அரசு அதை நீக்கிட்டாங்க. இப்போ Article 300A-ல மட்டும் Legal Right ஆக இருக்கு. Supreme Court கிட்ட நேரடியா போக முடியாது, High Court-ல மட்டும் போகலாம். TNPSC, SSC எல்லாத்திலயும் இந்த question வருது!'},
    {t:'❌ Option A (சம உரிமை) ஏன் தப்பு?',c:'#F87171',content:'நல்லா கவனியுங்க! சம உரிமை (Articles 14-18) இன்னும் நல்லாவே இருக்கு. Article 14 — சட்டத்துக்கு முன்னாடி எல்லாரும் சமம். Article 17 — தீண்டாமை ஒழிப்பு. இதெல்லாம் யாரும் நீக்கலை, நீக்கவும் மாட்டாங்க!'},
    {t:'❌ Option C (பேச்சுரிமை) ஏன் தப்பு?',c:'#F87171',content:'பேச்சுரிமை Article 19(1)(a) — இது Indian democracy-ஓட தூண்! கவலையே படாதீங்க, இது போகவும் மாட்டாது. Article 19(2)-ல restrictions இருக்கு ஆனா right-ஐ நீக்கலை.'},
    {t:'❌ Option D (Article 32) ஏன் தப்பு?',c:'#F87171',content:'Article 32-ஐ Dr. Ambedkar “Constitution-ஓட ஆன்மா” ங்னு சோன்னாரு. Supreme Court-ல நேரடியா போக right குடுக்குது. இதை எந்த government-உம் நீக்கலை!'},
    {t:'🧠 மனசுல வச்சுக்கங்க — Formula',c:'#C9A84C',content:'அண்ணா/அக்கா, இதை note பண்ணிக்கங்க: 44வது திருத்தம் (1978) = சோத்துரிமை போச்சு. 86வது திருத்தம் (2002) = கல்வி உரிமை Article 21A வந்துச்சு. இரண்டும் TNPSC-ல் கட்டாயம் வரும்!'},
    {t:'📖 கதை — 1978 Thanjavur விவசாயி',c:'#A78BFA',content:'Thanjavur-ல் ஒரு விவசாயிக்கு 2 ஏக்கர் நிலம் இருந்துச்சு. 1978-க்கு முன்னாடு Government அதை எடுக்க வந்தால் — நேரடியா Supreme Court போய் fight பண்ணலாம். 44வது திருத்தத்துக்கு அப்புறம்? High Court மட்டும்தான். இந்த வேறுபாடுதான் examiner கேக்கிறார்!'},
    {t:'🎯 Exam Tip — TNPSC Special',c:'#60A5FA',content:'TNPSC Group 1, 2, 2A, 4, VAO — எல்லாத்திலயும் வருது! Note பண்ணிக்கங்க: (1) 44வது திருத்தம் 1978 (2) Indira Gandhi Government (3) Article 300A (4) Supreme Court போக முடியாது (5) High Court மட்டும். UPSC, SSC CGL, IBPS-லயும் இதே question வேறு format-ல் வரும்!'},
  ],

  Hindi: [
    {t:'✅ सही जवाब — संपत्ति का अधिकार क्यों गया?',c:'#4ADE80',content:'भाई/बहन, ध्यान से सुनो! संपत्ति का अधिकार (Right to Property) पहले Articles 19(1)(f) और 31 में Fundamental Right था। 44वें संविधान संशोधन 1978 में Indira Gandhi सरकार ने इसे हटा दिया। अब Article 300A में सिर्फ Legal Right — Supreme Court नहीं, सिर्फ High Court। SSC CGL, UPSC — हर जगह यही पूछते हैं!'},
    {t:'❌ Option A गलत क्यों?',c:'#F87171',content:'ध्यान से देखो! समानता का अधिकार (Articles 14-18) अभी भी पूरी तरह जिंदा है। Article 17 — छुआछूत खत्म। ये सब कभी नहीं हटे, हटेंगे भी नहीं!'},
    {t:'❌ Option C गलत क्यों?',c:'#F87171',content:'वाक् स्वतंत्रता Article 19(1)(a) — Indian democracy की जड़ है। ये नहीं हटी, नहीं हटेगी।'},
    {t:'❌ Option D गलत क्यों?',c:'#F87171',content:'Article 32 को Ambedkar जी ने “संविधान की आत्मा” बोला — Supreme Court में directly जाओ Fundamental Rights के लिए। कभी नहीं हटा!'},
    {t:'🧠 याद करने का तरीका',c:'#C9A84C',content:'भाई/बहन, नोट कर लो: 44वां संशोधन (1978) = संपत्ति का अधिकार हटा। 86वां संशोधन (2002) = शिक्षा का अधिकार Article 21A आया। दोनों SSC, UPSC में हर साल आते हैं!'},
    {t:'📖 कहानी — 1978 का किसान',c:'#A78BFA',content:'1978 में पटना के पास राम किसान की 5 बीघा जमीन थी। 44वें संशोधन से पहले — Supreme Court सीधे जाता। संशोधन के बाद — सिर्फ High Court। यही फर्क है जो exam में पूछते हैं!'},
    {t:'🎯 Exam Tip — SSC/UPSC Special',c:'#60A5FA',content:'SSC CGL, UPSC Prelims, IBPS, RRB, सभी State PSC — हर जगह। Note करो: (1) 44वां संशोधन 1978 (2) Indira Gandhi govt (3) Article 300A (4) High Court only (5) Legal Right। 5 points, सब cover!'},
  ],

  Telugu: [
    {t:'✅ సరైన జవాబు — ఆస్తి హక్కు ఎందుకు పోయింది?',c:'#4ADE80',content:'అన్నా / అక్కా, వినండి! ఆస్తి హక్కు (Right to Property) ముందు Articles 19(1)(f) మరియు 31 లో మూల హక్కుగా ఉండేది. 44వ సవరణ 1978లో Indira Gandhi ప్రభుత్వం దాన్ని తీసేసింది. ఇప్పుడు Article 300A లో Legal Right మాత్రమే — Supreme Court లో నేరుగా వెళ్ళలేరు, High Court మాత్రమే. APPSC, SSC అన్నింట్లో ఇదే అడుగుతారు!'},
    {t:'❌ Option A తప్పు ఎందుకు?',c:'#F87171',content:'జాగ్రత్తగా చూడండి! సమానత్వ హక్కు (Articles 14-18) ఇంకా పూర్తిగా ఉంది. Article 17 — అంటరానితనం రద్దు. ఎవరూ తీయలేదు, తీయలేరు కూడా!'},
    {t:'❌ Option C తప్పు ఎందుకు?',c:'#F87171',content:'భావప్రకటనా Article 19(1)(a) — Indian democracy స్తంభం! ఇది పోలేదు, పోదు కూడా.'},
    {t:'❌ Option D తప్పు ఎందుకు?',c:'#F87171',content:'Article 32 ని Ambedkar గారు “రాజ్యాంగం ఆత్మ” అన్నారు. ఎప్పుడూ తీయలేదు!'},
    {t:'🧠 గుర్తుపెట్టుకోండి — Formula',c:'#C9A84C',content:'అన్నా/అక్కా, ఇది నోట్ చేసుకోండి: 44వ సవరణ (1978) = ఆస్తి హక్కు పోయింది. 86వ సవరణ (2002) = విద్య హక్కు Article 21A వచ్చింది. రెండూ APPSC, SSC లో వస్తాయి!'},
    {t:'📖 కథ — 1978 Andhra రైతు',c:'#A78BFA',content:'1978 లో Krishna జిల్లాలో ఒక రైతుకి 3 ఎకరాల పొలం ఉండేది. Government తీసుకోవాలని వచ్చింది. 44వ సవరణకి ముందు — Supreme Court. తర్వాత — High Court మాత్రమే. ఈ తేడాయే పరీక్షలో అడుగుతారు!'},
    {t:'🎯 Exam Tip — APPSC Special',c:'#60A5FA',content:'APPSC Group 1,2,3,4 + SSC CGL + IBPS + RRB — అన్నింట్లో. Note: (1) 44వ సవరణ 1978 (2) Indira Gandhi govt (3) Article 300A (4) High Court only (5) Legal Right. 5 points అన్నీ cover!'},
  ],
}

// Layer 1 in native for remaining 31 languages (+ Layers 2-7 fall back to English)
export const LAYER1_NATIVE = {
  Kannada:   {t:'✅ ಸರಿಯಾದ ಉತ್ತರ',c:'#4ADE80',content:'ಅಣ್ಣ / ಅಕ್ಕ, ಕೇಳಿ! ಆಸ್ತಿ ಹಕ್ಕು (Right to Property) ಮೊದಲು Articles 19(1)(f) ಮತ್ತು 31 ರಲ್ಲಿ Fundamental Right ಆಗಿತ್ತು. 44ನೇ ತಿದ್ದುಪಡಿ 1978 ರಲ್ಲಿ ಅದನ್ನು ತೆಗೆದರು. ಈಗ Article 300A ರಲ್ಲಿ Legal Right ಮಾತ್ರ — Supreme Courtಗೆ ನೇರವಾಗಿ ಹೋಗಲ್ಲ, High Court ಮಾತ್ರ. KPSC, SSC ಸಗಳವದರಲ್ಲಿ ಈ question ಬರತ್ತೆ!'},
  Malayalam: {t:'✅ ശരിയായ ഉത്തരം',c:'#4ADE80',content:'ചേട്ടന്‍ / ചേച്ചി, കേള്ക്കൂ! സ്വത്ത് അവകാശം (Right to Property) മുമ്പ്പ് Articles 19(1)(f) ത്തിലും 31ലും Fundamental Right ആയിരുന്നു. 44ാം ഭേദഗതി 1978ല്‍ അത് നീക്കി. ഇപ്പോഴ്‍ Article 300Aല്‍ Legal Right മാത്രം — Supreme Courtല്‍ നേരിട്ട് പോവാന്‍ വയ്യ, High Court മാത്രം. Kerala PSC, SSC എല്ലായിടത്തും ഈ question വരും!'},
  Bengali:   {t:'✅ সঠিক উত্তর',c:'#4ADE80',content:'দাদা/দিদি, মনোযোগ দিয়ে শোনো! সম্পত্তির অধিকার (Right to Property) আগে Articles 19(1)(f) এবং 31-এ Fundamental Right ছিল। 44তম সংশোধনী 1978-তে ইউক সরিয়ে দেওয়া হয়েছে। এখন Article 300A-তে শুধু Legal Right — Supreme Court-এ সরাসরি যাওয়া যাবে না, High Court। WBPSC, SSC হর জায়গায় এই question আসে!'},
  Marathi:   {t:'✅ সরিবা উত্তর',c:'#4ADE80',content:'दादा/ताई, नीट ऐका! मालमत्तेचा हक्क (Right to Property) आधी Articles 19(1)(f) आणि 31 मध्ये Fundamental Right होता। 44व्या घटनादुरुस्ती 1978 मध्ये तो रद्द केला। आता Article 300A मध्ये फक्त Legal Right — Supreme Courtला थेट जाता येत नाही, High Court। MPSC, SSC सगळ्यांत हा प्रश्न येतो!'},
  Gujarati:  {t:'✅ સાचो जवाब',c:'#4ADE80',content:'भाई/बहेन, ध्यानथी सांभळो! संपत्ति अधिकार (Right to Property) पहेलां Articles 19(1)(f) अने 31 मां Fundamental Right हतो। 44मा संशोधन 1978मां ते दूर करायुं। हवे Article 300Aमां Legal Right — Supreme Court नहीं, High Court। GPSC, SSC सगळे आ question आवे!'},
  Punjabi:   {t:'✅ ਸਹੀ ਜਵਾਬ',c:'#4ADE80',content:'ਵੀਰ/ਭੈਣ, ਧਿਆਨ ਨਾਲ ਸੁਣੋ! ਜ਼ਮੀਨ ਦਾ ਹੱਕ (Right to Property) ਪਹਿਲਾਂ Articles 19(1)(f) ਅਤੇ 31 ਵਿੱਚ Fundamental Right ਸੀ। 44ਵੀਂ ਸੰਸ਼ੋਧਨ 1978 ਵਿੱਚ ਇਸ ਹਟਾੇ ਗਿਆ। ਹੁਣ Article 300A ਵਿੱਚ Legal Right — Supreme Court ਨਹੀਂ, High Court। PPSC, SSC ਸੱਭ ਜਗਾਹ ਇਹ question!'},
  Odia:      {t:'✅ ସଠିକ ଉତ୍ତର',c:'#4ADE80',content:'ଭାଇ/ଭଉଣୀ, ଧ୍ଯାନ ଦେଇ ଶୁଣ! ସମ୍ପତ୍ତି ଅଧିକାର (Right to Property) ଆଗରୁ Articles 19(1)(f) ଓ 31ରେ Fundamental Right ଥିଲା। 44ତମ ସଂଶୋଧନ 1978ରେ ଏହାକୁ ବାଦ ଦେଲା ଗଲା। ଏବେ Article 300Aରେ Legal Right ମାତ୍ର — Supreme Courtରେ ଯାଇ ହୁଏ ନାହଁ, High Court। OPSC, SSC ସବଜାଗାରେ ଏହି question!'},
  Assamese:  {t:'✅ সঠিক উত্তর',c:'#4ADE80',content:'দা/বাইদেউ, মন দি শুনক! সম্পত্তিৰ অধিকাৰ (Right to Property) আগতে Articles 19(1)(f) আৰু 31 ত Fundamental Right আছিল। 44তম সংশোধনী 1978 ত ইয়াক আঁতৰাই দিয়া হল। এতিয়া Article 300A ত Legal Right মাত্ৰ — Supreme Court লৈ সোধাসুধি যাব নো঵াৰি, High Court। APSC, SSC সকলতে এই question!'},
  Manipuri:  {t:'✅ Sahi Jawab — Right to Property',c:'#4ADE80',content:'Khurumjari/Khurumjashabi (respected elder/younger), shingna! Right to Property 1978 gi 44th Constitutional Amendment ta thouraktuna Fundamental Rights lista tangba oiretpani. Article 300A ta Legal Right oirolambaga, Supreme Court ta nattaba, High Court matam. MPSC, SSC da henna loishinnani!'},
  Nagamese:  {t:'✅ Sahi Jawab — Property Rights',c:'#4ADE80',content:'Bhai/Bhaini, dhiyan se sunna! Property ka hak (Right to Property) age Articles 19(1)(f) ar 31 mein Fundamental Right tha. 1978 mein 44th Constitutional Amendment se yeh hata gaya. Ab Article 300A mein sirf Legal Right — Supreme Court nahi, sirf High Court. Nagaland PSC, SSC har jagah yahi question aata hai!'},
  Mizo:      {t:'✅ Chhanna Phunlam — Property Right',c:'#4ADE80',content:'Pasal/Hmeichhe upa/nupui, hman rawh! Property right (Right to Property) chuan Articles 19(1)(f) leh 31-ah Fundamental Right a ni a. 44-na Constitutional Amendment 1978-ah a tihchhuk. Tunah Article 300A-ah Legal Right a ni — Supreme Court-ah direct in kal theih loh, High Court chauh. Mizoram PSC, SSC zawng zawng-ah hei question hi a rawn lo!'},
  Khasi:     {t:'✅ Ka Jingkynnoh — Property Right',c:'#4ADE80',content:'Kong/Bah (respected address), shabar! Ka Right ha Property bukhlieh da Articles 19(1)(f) bad 31 da ka Fundamental Right. U 44th Amendment 1978 da u lah ia kine. Mynta Article 300A da ka Legal Right bun — Supreme Court man em noh em, High Court bun. Meghalaya PSC, SSC ki jingim question hi ki wan!'},
  Kokborok:  {t:'✅ Thikthang Nangkham — Property Right',c:'#4ADE80',content:'Anna/Akka (respectful address), boro! Thang-property right (Right to Property) nwkwi Articles 19(1)(f) ba 31 oto Fundamental Right aang. 1978 44th Constitutional Amendment oto ama thabwi. Anik Article 300A oto Legal Right — Supreme Court oto baithainai, High Court bai. Tripura PSC, SSC boro jaga sei question!'},
  Angami:    {t:'✅ Right Answer — Property Right',c:'#4ADE80',content:'Anna/Akka (respected one), listen! Property right (Right to Property) was a Fundamental Right under Articles 19(1)(f) and 31. 44th Constitutional Amendment 1978 removed it. Now Article 300A — Legal Right only, not Fundamental Right. Cannot go to Supreme Court directly, only High Court. Nagaland PSC, SSC — this question comes!'},
  Ao:        {t:'✅ Right Answer — Property Right',c:'#4ADE80',content:'Anna/Akka (respected one), Property right (Right to Property) was a Fundamental Right under Articles 19(1)(f) and 31. 44th Amendment 1978 removed it. Article 300A — Legal Right only. High Court only, not Supreme Court. Nagaland PSC, SSC question!'},
  Maithili:  {t:'✅ सही उत्तर',c:'#4ADE80',content:'भैया/भैनी, ध्यानसंग सुनू! सम्पत्ति अधिकार पहिने Fundamental Right छलैक। 44म संशोधन 1978में हटा देल गेलैक। अखन Article 300Aमें Legal Right — Supreme Court नहि, High Court। BPSC, SSC सभ जगह इ question!'},
  Bhojpuri:  {t:'✅ सही जवाब',c:'#4ADE80',content:'भईया/भहिनी, ध्यान से सुनृ! जमीन के हक पहिले Fundamental Right रहल। 44वाँ 1978में हटावल गईल। Article 300Aमें Legal Right — Supreme Court नहीं, High Court। BPSC, SSC सबही question!'},
  Awadhi:    {t:'✅ सही जवाब',c:'#4ADE80',content:'भईया/भहिनी, सुनौ! जायदाद के हक पहिले Fundamental Right रहा। 44वाँ 1978में हटाय देअ गवा। Article 300Aमें Legal Right — Supreme Court नहीं, High Court। UP PSC, SSC question!'},
  Rajasthani:{t:'✅ सही जवाब',c:'#4ADE80',content:'भाई/बहन, ध्यान राखो! संपत्ति को हक पेलां Fundamental Right हो। 44वाँ 1978में वोकनै हटा। Article 300Aमें Legal Right — Supreme Court नी, High Court। RPSC, SSC question!'},
  Haryanvi:  {t:'✅ सही जवाब',c:'#4ADE80',content:'भाई/बहन, ध्यान से सुण! जायदाद का हक पहले Fundamental Right था। 44वाँ 1978में उसनै हटाया। Article 300Aमें Legal Right — Supreme Court नहीं, High Court। HSSC, SSC question!'},
  Chhattisgarhi:{t:'✅ सही जवाब',c:'#4ADE80',content:'भाई/बहिनी, ध्यान सुनो! सम्पत्ति हक पहिले Fundamental Right रहिस। 44वाँ 1978में हटादे गिस। Article 300Aमें Legal Right — Supreme Court नहीं, High Court। CGPSC, SSC question!'},
  Urdu:      {t:'✅ صحیح جواب',c:'#4ADE80',content:'بھائی/بھائی صاحبہ/بہن، ذرا سنی۔ جائیداد کا حق پہلے Fundamental Right تھا۔ 44ویں ترمیم 1978ع میں ہٹا گیا۔ Article 300A میں Legal Right — Supreme Court نہیں، High Court۔ SSC, UPSC ہر جگہ!'},
  Sanskrit:  {t:'✅ सही उत्तरम्',c:'#4ADE80',content:'आर्य/आर्ये, शृणु! सम्पत्तिहक्कः पूर्वं Fundamental Right आसीत्। 44तमेन संविधानसंशोधनेन 1978 तदपाकृतम्। साम्प्रतं Article 300A अधीनं Legal Right — Supreme Courtमेव गन्तुं न शक्यते, High Court। UPSC, SSC सर्वत्र!'},
  Kashmiri:  {t:'✅ صحیح جواب',c:'#4ADE80',content:'وانہ/با۔کھ صاحب، وچھ۔ مال داری حق پیٹھ ھنے Fundamental Right اوسوں। 44ئیم ترمیم 1978 مَنزہ یہے کڈو। Article 300A Legal Right — Supreme Court نہے، High Court। JKPSC, SSC!'},
  Dogri:     {t:'✅ सही जवाब',c:'#4ADE80',content:'वीर/भैण, ध्यान नाल सुण! जमीन दा हक पहले Fundamental Right था। 44वें 1978त्  इस हटाया। Article 300A त्  Legal Right — Supreme Court नहीं, High Court। JKSSB, SSC!'},
  Bodo:      {t:'✅ নাসেননায় ফিরা',c:'#4ADE80',content:'দা/দিদি, দা শুন! থাখি গাসো (Right to Property) আগতে Articles 19(1)(f) আরো 31ত Fundamental Right রনায় আসিল। 44গ্রাম 1978ত আনাওনো হাফনায়। Article 300Aত Legal Right — Supreme Courtত নাথায়, High Courtহে। APSC, SSC!'},
  Santali:   {t:'✅ Thik Joem — Property Right',c:'#4ADE80',content:'Bhai/Bon (respected), sun! Property right (Right to Property) Articles 19(1)(f) ar 31-re Fundamental Right reabon. 1978-te 44th Amendment-te emadea. Article 300A-re Legal Right bua — Supreme Court-re baisubona, High Court matra. Jharkhand PSC, SSC question!'},
  Konkani:   {t:'✅ सारो जाप',c:'#4ADE80',content:'दादा/ताई, आइक! मालमत्तेचो हक्क आधीं Fundamental Right आसिल्लो। 44व्या 1978त तो काडलो। Article 300A मद्लें Legal Right — Supreme Court नहीं, High Court। Goa PSC, SSC!'},
  Sindhi:    {t:'✅ صحیح جواب',c:'#4ADE80',content:'وہھیر/بھین، دھيان سان سُنو! ملڪیت جو حق اۚھی Fundamental Right ھو। 44ہیں 1978 ع میں ان ڪم ہٹایو। Article 300A میں Legal Right — Supreme Court نہیں، High Court۔ SSC, UPSC!'},
  Nepali:    {t:'✅ सही उत्तर',c:'#4ADE80',content:'दाई/दिदी, ध्यान दिईकन सुन्नुस्! सम्पत्ति अधिकार पहिले Fundamental Right थियो। 44ौं 1978मा यसलाई हटाइयो। Article 300Aमा Legal Right — Supreme Court देखिन High Court। Sikkim PSC, SSC!'},
  Tulu:      {t:'✅ ಸಪ್ಪದ ಜವಾಬು',c:'#4ADE80',content:'ಅಣ್ಣ / ಅಕ್ಕ, ವಿನಿಯೆರಿ! ಆಸ್ತಿ ಅವಕಾಶ (Right to Property) ಬಾಲೆಡ್ Articles 19(1)(f) ಮತ್ತು 31 ಡ್ Fundamental Right ಆತ್. 44ನೇ 1978 ಡ್ ಅದ್ ತೂಬಾವ್ರ್. Article 300A ಡ್ Legal Right — Supreme Court ಡ್ ವಚ್ಚ ಬೊಕ್ಕ ಆಂಡ್, High Court ಮಾತ್ರ. KPSC, SSC!'},
  Ho:        {t:'✅ Right Answer — Property Right',c:'#4ADE80',content:'Dada/Didi (respected), sunna! Property right Articles 19(1)(f) bai 31-re Fundamental Right are. 44th Amendment 1978-re ido hata gela. Article 300A-re Legal Right bano — Supreme Court seedha nahi, High Court. Jharkhand PSC, SSC question!'},
  Gondi:     {t:'✅ Sahi Jawab — Sampati Hak',c:'#4ADE80',content:'Bhai/Bahin (respected), sona! Sampati hak (Right to Property) age Articles 19(1)(f) ar 31 me Fundamental Right raha. 44th Amendment 1978 me oke hataya. Article 300A me Legal Right — Supreme Court seedha nahi, High Court. MP, CG PSC, SSC question!'},
  Garhwali:  {t:'✅ सही जवाब',c:'#4ADE80',content:'भुला/बहनि, ध्यान से सुण! जायदाद को हक पहले Fundamental Right थो। 44वाँ 1978मा वोकू हटाइ दे। Article 300Aमा Legal Right — Supreme Court नहीं, High Court। Uttarakhand PSC, SSC!'},
  Kumaoni:   {t:'✅ सही जवाब',c:'#4ADE80',content:'भैजी/दीदी, ध्यानसे सुण! संपत्ति क हक पहले Fundamental Right छियो। 44वाँ 1978में वैक हटाय दे। Article 300Aमें Legal Right — Supreme Court नहीं, High Court। Uttarakhand PSC, SSC!'},
  Pahari:    {t:'✅ सही जवाब',c:'#4ADE80',content:'वीर/दीदी, ध्यान नाल सुण! जमीन दा हक पहले Fundamental Right था। 44वें 1978 च्  इस हटाया। Article 300A च्  Legal Right — Supreme Court नहीं, High Court। HP PSC, SSC!'},
  Bundeli:   {t:'✅ सही जवाब',c:'#4ADE80',content:'भाई/बहन, ध्यान से सुण! जायदाद को हक पहले Fundamental Right रहो। 44वें 1978में वाको हटाय दयो। Article 300Aमें Legal Right — Supreme Court नहीं, High Court। MP PSC, SSC!'},
  Saurashtra:{t:'✅ સाचो जवाब',c:'#4ADE80',content:'Bhai/Ben (respected), dhyan thi sumbhalo! Sampatti hakk age Fundamental Right hato. 44ma Constitutional Amendment 1978 ma dur karayo. Article 300A ma Legal Right — Supreme Court nahi, High Court. GPSC, SSC question!'},
  Kutchi:    {t:'✅ સाचो उत्तर',c:'#4ADE80',content:'Bhai/Bahin (respected), dhyan thi suno! Mal hakk pehlan Fundamental Right hato. 44ma Constitutional Amendment 1978 ma oto hata. Article 300A ma Legal Right — Supreme Court nahi, High Court. GPSC, SSC question!'},
}

export const ALL_LANGS = ['Tamil','Hindi','Telugu','Kannada','Malayalam','Bengali','Marathi','Gujarati','Punjabi','Odia','Assamese','Manipuri','Nagamese','Mizo','Khasi','Kokborok','Angami','Ao','Maithili','Bhojpuri','Awadhi','Rajasthani','Haryanvi','Chhattisgarhi','Urdu','Sanskrit','Kashmiri','Dogri','Bodo','Santali','Konkani','Sindhi','Nepali','Tulu','Ho','Gondi','Garhwali','Kumaoni','Pahari','Bundeli','Saurashtra','Kutchi']

export const LANG_SCRIPTS = {'Tamil':'தமிழ்','Hindi':'हिंदी','Telugu':'తెలుగు','Kannada':'ಕನ್ನಡ','Malayalam':'മലയാളം','Bengali':'বাংলা','Marathi':'मरাठी','Gujarati':'ગુजराती','Punjabi':'ਪੰਜਾਬੀ','Odia':'ଓଡ़िआ','Assamese':'অসমীয়া','Manipuri':'মৈতৈলোন্','Urdu':'اردو','Sanskrit':'संस्कृत','Maithili':'मैथिली','Dogri':'डोगरी','Bodo':'বড়ো','Nepali':'नेपाली','Kashmiri':'کشمیری','Sindhi':'سنڌي','Konkani':'कोंकणी','Santali':'ᱥᱟᱱᱛᱟᱤᱠ','Tulu':'ತುಳು'}

export const getLayers = (lang) => {
  if (FULL_LAYERS[lang])   return FULL_LAYERS[lang]
  if (LAYER1_NATIVE[lang]) return [LAYER1_NATIVE[lang], ...LAYERS_EN.slice(1)]
  return LAYERS_EN
}
