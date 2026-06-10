# TryIT Logo Setup Instructions

## Step 1 — Save your logo to the project

In your Codespace terminal:

```bash
# The logo file you uploaded is already saved at:
# /mnt/user-data/uploads/1000307207.webp

# Copy it to your project's public folder:
cp /mnt/user-data/uploads/1000307207.webp /workspaces/tryit-cloud/public/tryit-logo.webp

# Verify it copied:
ls -lh /workspaces/tryit-cloud/public/tryit-logo.webp
```

## Step 2 — Unpack the animated logo files

```bash
python unpack.py LOGO_ANIMATED_PAYLOAD.md
```

This writes 3 files:
- src/components/LogoAnimated.jsx   ← SVG animation engine
- src/components/Logo.jsx           ← Smart logo (image + fallback)
- src/pages/Splash.jsx              ← Animated splash screen

## Step 3 — Use in your app

```jsx
// Static logo (uses your webp image):
<Logo height={44} />

// Logo on dark background:
<Logo height={44} dark />

// Animated logo (plays once):
<Logo animated size="md" dark />

// Animated + loops:
<Logo animated loop size="lg" dark />

// Splash screen:
// Already set up in src/pages/Splash.jsx
```

## Animation Sequence (matches your actual logo)

```
0.0s  → Blank screen
0.1s  → Sun body appears (golden semicircle) — scale bounce
0.2s  → Sun rays burst outward one by one
0.4s  → Upward arrow draws itself (stroke animation)
0.6s  → "TRY" slides in from left (navy/white)
0.7s  → "IT" slides in from right (gold glow)
0.9s  → "EDUCATIONS" fades up
1.1s  → Gold separator lines draw in from center
1.5s  → Full logo — gentle golden pulse
2.0s  → Tagline appears: "Your Exam. Your Rank. Your Success."
2.8s  → Navigate to /landing
```

## Logo Elements Matched

| Your Logo Element      | SVG Component          |
|------------------------|------------------------|
| TRYIT in navy bold     | text fill="navyGrad"   |
| IT in gold metallic    | text fill="goldGrad"   |
| Sun semicircle         | ellipse fill="goldGrad"|
| Radiating rays         | 11 lines at angles     |
| Upward arrow           | line + polygon arrowhead|
| EDUCATIONS in gold     | text letterSpacing     |
| Two horizontal lines   | rect fill="goldGrad"   |
| White background       | transparent (adapts)   |

## Sizes Available

| Size     | Width  | Use Where                    |
|----------|--------|------------------------------|
| sm       | 80px   | Navbar (mobile)              |
| md       | 130px  | Navbar (desktop), Login      |
| lg       | 200px  | Footer, Thank you pages      |
| xl       | 280px  | About us, Marketing          |
| splash   | 360px  | Splash screen                |
