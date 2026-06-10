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

