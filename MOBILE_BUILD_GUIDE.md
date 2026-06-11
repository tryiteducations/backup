# TryIT Educations — Android + iOS Build Guide

## ════════════════════════════════════════
## ANDROID APK — Step by Step
## ════════════════════════════════════════

### Step 1: Build the web app
```bash
npm run build
```
Wait for it to finish. Creates /dist folder.

### Step 2: Sync to Android
```bash
npx cap sync android
```

### Step 3: Open in Android Studio
```bash
npx cap open android
```
Android Studio will open automatically.

### Step 4: Build the APK
In Android Studio:
  1. Click: Build → Build Bundle(s) / APK(s) → Build APK(s)
  2. Wait 3-5 minutes for build
  3. Click "locate" when done
  4. APK is at: android/app/build/outputs/apk/debug/app-debug.apk

### Step 5: Install on phone
```bash
# If phone is connected via USB:
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

Or share the .apk file via WhatsApp/email and install manually.

---

## ════════════════════════════════════════
## IOS APP — Step by Step (Mac only)
## ════════════════════════════════════════

### Step 1 (same): Build web + sync
```bash
npm run build
npx cap sync ios
```

### Step 2: Open Xcode
```bash
npx cap open ios
```

### Step 3: In Xcode
  1. Select your team in Signing & Capabilities
  2. Change bundle identifier to: net.tryiteducations.app
  3. Product → Archive → Distribute (for App Store)
     OR Product → Build → Run (for simulator test)

---

## ════════════════════════════════════════
## CAPACITOR CONFIG (auto-applied)
## ════════════════════════════════════════
