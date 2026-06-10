# TryIT Educations — Blueprint Pillars Integration Guide
# Run install_blueprint_pillars.sh first. Then read below.

## ════════════════════════════════════════════════════════
## WHAT WAS JUST INSTALLED
## ════════════════════════════════════════════════════════

### Pillar 2 — Accessibility System
  src/context/AccessibilityContext.jsx    ← 3-mode state manager
  src/components/accessibility/
    AccessibilityToggle.jsx              ← ♿ floating toggle button
    AudioCompanionWrapper.jsx            ← Blind/VI screen-reader mode
    VisualSyncWrapper.jsx                ← Deaf/HoH captions + ISL
    MinimalMotionWrapper.jsx             ← Motor-challenged voice control

  HOW TO TEST:
    1. npm run dev
    2. Click ♿ button (bottom-right)
    3. Switch to "Audio Companion" → layout restructures for TalkBack
    4. Switch to "Visual Sync" → ISL panel + caption bar appears
    5. Switch to "Minimal Motion" → voice commands activate

### Pillar 3 — Social Equity Matrix
  src/lib/equityTiers.js                 ← All 9 tier definitions
  src/context/EquityTierContext.jsx       ← Tier state
  src/pages/equity/EquityTierSelector.jsx ← Tier selection UI
  src/pages/equity/EquityVerification.jsx ← Document upload

  HOW TO TEST:
    1. Visit /equity
    2. Select "Hope Scholar" or any tier
    3. Click Apply → see verification form
    4. Upload a test file → Submit
    5. Check localStorage "equity_applications"

### Pillar 4 — Viral Circles
  src/lib/apaarValidator.js              ← APAAR format + mock verify
  src/pages/circles/SchoolCircle.jsx     ← 10-member, 20% OFF
  src/pages/circles/SisterhoodCircle.jsx ← 5-female, 25% OFF

  HOW TO TEST:
    1. Visit /circles/school
    2. Enter any 12-digit number as APAAR ID
    3. Add 10 members → watch discount unlock

### Pillar 5 — Security
  src/lib/deviceBinding.js              ← Hardware fingerprint binding
  src/lib/contentVelocity.js            ← Daily question caps

  HOW TO USE IN TEST ENGINE:
    import { canAccessQuestion, recordQuestionAccess } from '../lib/contentVelocity'
    // Before showing a question:
    const check = canAccessQuestion(user.plan, user.isFreeForLife)
    if (!check.allowed) { showUpgradePrompt(check.message); return }
    recordQuestionAccess(1)

### Pillar 6 — CSR Impact Tracker
  src/pages/impact/LiveImpactTracker.jsx ← Public dashboard

  HOW TO TEST:
    1. Visit /impact (no login required — public page)
    2. Numbers count up as you scroll
    3. Every 3 seconds, study hours increment (live simulation)

## ════════════════════════════════════════════════════════
## ADD TO LANDING PAGE NAV (recommended)
## ════════════════════════════════════════════════════════

In src/components/landing/Navbar.jsx, add:
  <a href="/impact">🌍 Impact</a>
  <a href="/equity">🤝 Free Access</a>

In src/components/landing/Footer.jsx, add:
  Social Impact: Impact Tracker · Free Access · CSR Partners

## ════════════════════════════════════════════════════════
## ADD TO SIDEBAR (for logged-in users)
## ════════════════════════════════════════════════════════

In src/components/layout/Sidebar.jsx NAV array add:
  { path:'/equity',  label:'Free Access', icon:Heart, badge:'9 Tiers' },
  { path:'/impact',  label:'Our Impact',  icon:Globe,  badge:null      },
  { path:'/circles/school',     label:'School Circle',     icon:Users },
  { path:'/circles/sisterhood', label:'Sisterhood Circle', icon:Users },

## ════════════════════════════════════════════════════════
## ADD TO ONBOARDING (highest priority)
## ════════════════════════════════════════════════════════

In src/pages/Onboarding.jsx, after Step 7 (Language) add Step 8:

  STEP 8 — Equity Check
    "Do any of these apply to you? (Optional)"
    Show 6 free tier cards briefly
    "Claim Free Access →" → routes to /equity
    "Skip — I'll pay normally →" → routes to /dashboard

## ════════════════════════════════════════════════════════
## PRODUCTION CHECKLIST
## ════════════════════════════════════════════════════════

Before launch (June 15):
  [ ] Replace mock APAAR verification with real DigiLocker API
      GET https://api.digitallocker.gov.in/public/oauth2/1/token
      Register at: https://partners.digitallocker.gov.in

  [ ] Replace mock UDID check with real UDID database query
      API: https://swavlambancard.gov.in/api (UDID portal)

  [ ] Set up document storage (encrypted) in Supabase Storage
      Replace localStorage saves in EquityVerification.jsx with:
      supabase.storage.from('equity-docs').upload(...)

  [ ] Wire CSR Impact Tracker to real Supabase metrics
      Replace BASE_METRICS with:
      const { data } = await supabase.from('equity_stats').select()

  [ ] Set VITE_QUESTION_ENCRYPTION_KEY in .env.local

  [ ] Enable Content-Security-Policy headers in Cloudflare
