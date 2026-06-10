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
