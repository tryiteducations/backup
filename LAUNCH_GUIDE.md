# TryIT Educations — Launch Guide (June 15, 2026)
# ═══════════════════════════════════════════════════════════════════

## ════════════════════════════════════════
## TODAY: SUPABASE SETUP (30 minutes)
## ════════════════════════════════════════

### Step 1: Create projects
Go to: https://supabase.com

Create 4 projects:
1. tryit-core       (auth + profiles + leaderboard)
2. tryit-content    (questions + institution + PDFs)
3. tryit-finance    (payments + coins audit trail)
4. tryit-analytics  (aggregated stats only)

### Step 2: Run schema
In each project → SQL Editor → paste and run:

Project 1 (tryit-core):
→ Copy: supabase/migrations/001_complete_schema.sql
→ Paste in SQL Editor → Run

### Step 3: Fill .env.local
```
cp .env.local.template .env.local
```
Edit .env.local:
```
VITE_SUPABASE_CORE_URL=https://XXXXXXXX.supabase.co
VITE_SUPABASE_CORE_ANON_KEY=eyJhbGci...
VITE_RAZORPAY_KEY=rzp_test_XXXXXXXXXX
```

### Step 4: Test locally
```bash
npm run dev
```
Open: http://localhost:5173
Test these flows:
  □ Landing page loads with animations
  □ Login with email → OTP → Dashboard
  □ New user sees 200 coins, empty state
  □ Take a test → see result with coin earn/deduct
  □ Admin /admin/login → grant Pro to your email
  □ Festival banner (if today is a festival)
  □ Theme selector works
  □ Accessibility bar opens

## ════════════════════════════════════════
## JUNE 12: DEPLOY WEBSITE (20 minutes)
## ════════════════════════════════════════

### Build
```bash
npm run build
```
Creates: /dist folder

### Deploy to Cloudflare Pages
1. Go to: https://pages.cloudflare.com
2. Click: Create application → Pages
3. Connect GitHub: Select your Tatu repo
4. Build settings:
   - Build command: npm run build
   - Build output: dist
5. Environment variables: Add all from .env.local
6. Click: Save and Deploy

OR manual upload:
1. pages.cloudflare.com → Upload assets
2. Upload /dist folder

### Custom domain
1. Cloudflare Pages → Custom domains → tryiteducations.net
2. DNS: CNAME → pages.dev URL
3. Wait 5 minutes → tryiteducations.net is live

## ════════════════════════════════════════
## JUNE 12-13: BETA TESTING WITH USERS
## ════════════════════════════════════════

### Grant 5 test users Pro access
1. Go to: https://tryiteducations.net/admin/login
2. Login: admin@tryit.com / tryit@admin2026
3. Grant Pro Access tab
4. Enter each tester's email → Pro → 30 days

### What testers should test
Give them this list:
  □ Register as student on mobile
  □ Complete onboarding (pick exam, language)
  □ Take one full mock test
  □ Check result screen (coins earned/deducted)
  □ Try Career Compass quiz
  □ Read current affairs (look for +5 coins after 30s)
  □ Play Math Blitz game
  □ Post something in Community Hall
  □ Try different themes in Settings
  □ Test on mobile browser (most important)

### Collect feedback
WhatsApp group: "TryIT Beta Testers"
Ask them to send screenshots of:
  - Any error messages
  - Anything that looks wrong
  - Features they love
  - Features that confused them

## ════════════════════════════════════════
## JUNE 14: ANDROID APK
## ════════════════════════════════════════

### Prerequisites
Install Android Studio: developer.android.com/studio
(Free, takes 30 min to install + configure)

### Build APK
```bash
# In /workspaces/Tatu:
npm run build
npx cap sync android
npx cap open android
```

In Android Studio:
1. Wait for Gradle sync (5 min)
2. Build → Build Bundle(s) / APK(s) → Build APK(s)
3. Wait 3-5 min
4. Click "locate" in notification
5. APK: android/app/build/outputs/apk/debug/app-debug.apk

### Share APK for testing
```bash
# If phone connected via USB:
adb install app-debug.apk

# Or: Share via WhatsApp/Gmail to your phone
```

### SIGNED APK (for Play Store)
In Android Studio:
1. Build → Generate Signed Bundle / APK
2. Create new keystore (save the password!)
3. Choose APK → Release → Finish
4. Upload to Play Store console

## ════════════════════════════════════════
## JUNE 15: LAUNCH DAY CHECKLIST
## ════════════════════════════════════════

Morning (6 AM):
  □ Switch Razorpay from test to LIVE keys
    - dashboard.razorpay.com → Settings → API Keys → Live
    - Update VITE_RAZORPAY_KEY in Cloudflare env vars
    - Redeploy: npm run build → push to GitHub

  □ Test one ₹19 payment with your own card
  □ Confirm money reaches your bank

  □ Final website test on mobile
  □ Final website test on desktop
  □ Check all pages load (no errors)

  □ Announce on social media
    Twitter/X: "TryIT Educations is LIVE! 🚀"
    LinkedIn: Platform launch post
    WhatsApp: Share with exam prep groups

## ════════════════════════════════════════
## AFTER LAUNCH: WEEK 1 PRIORITIES
## ════════════════════════════════════════

Day 1-2: Watch for errors
  - Check browser console on your phone
  - Fix any crashes immediately
  - Be available to respond to user feedback

Day 3-5: User data
  - How many registered?
  - Which pages are most visited?
  - Where are users dropping off?
  - Any payment failures?

Day 5-7: Improve
  - Fix top 3 reported bugs
  - Add missing questions (pipeline running on extra laptop)
  - Consider a WhatsApp bot for support

## ════════════════════════════════════════
## EMERGENCY CONTACTS
## ════════════════════════════════════════

If website is down: Cloudflare status.cloudflare.com
If Supabase is down: status.supabase.com
If Razorpay fails: Call 1800-258-0009 (24/7)
If Play Store issue: support.google.com/googleplay/android-developer

