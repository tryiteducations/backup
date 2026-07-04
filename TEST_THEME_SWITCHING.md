# Theme Switching Test Procedure

This document outlines the procedure to test theme switching across all pages to ensure theme color consistency has been properly implemented.

## Test Setup

1. **Start the application** and log in as a student
2. **Navigate to the Dashboard** (should already be theme-aware)
3. **Prepare to test** the following pages:
   - Dashboard (reference implementation)
   - Test Engine
   - Analytics
   - Games Hub

## Test Procedure

### 1. Classic Theme (Default)
- **Apply Classic Theme** (gold/blue)
- **Verify Dashboard** - should show gold/blue theme colors
- **Navigate to Test Engine** - should show theme colors matching Dashboard
- **Navigate to Analytics** - should show theme colors matching Dashboard
- **Navigate to Games Hub** - should show theme colors matching Dashboard
- **Check Sidebar** - should be readable with proper contrast

### 2. Sunrise Theme
- **Apply Sunrise Theme** (orange)
- **Verify Dashboard** - should show orange theme colors
- **Navigate to Test Engine** - should show orange theme colors
- **Navigate to Analytics** - should show orange theme colors
- **Navigate to Games Hub** - should show orange theme colors
- **Check Sidebar** - should be readable with proper contrast

### 3. Ocean Theme
- **Apply Ocean Theme** (blue)
- **Verify Dashboard** - should show blue theme colors
- **Navigate to Test Engine** - should show blue theme colors
- **Navigate to Analytics** - should show blue theme colors
- **Navigate to Games Hub** - should show blue theme colors
- **Check Sidebar** - should be readable with proper contrast

### 4. High Contrast Theme
- **Apply High Contrast Theme**
- **Verify Dashboard** - should show high contrast colors
- **Navigate to Test Engine** - should show high contrast colors
- **Navigate to Analytics** - should show high contrast colors
- **Navigate to Games Hub** - should show high contrast colors
- **Check Sidebar** - should be readable with proper contrast

## Verification Checklist

### ✅ Dashboard Page
- [ ] Header uses theme colors
- [ ] Buttons use theme colors
- [ ] Box outlines use theme colors
- [ ] Glow effects use theme colors
- [ ] Sidebar text is readable

### ✅ Test Engine Page
- [ ] Header uses theme colors
- [ ] Question boxes use theme colors
- [ ] Answer buttons use theme colors
- [ ] Submit button uses theme colors
- [ ] Timer uses theme colors

### ✅ Analytics Page
- [ ] Header uses theme colors
- [ ] Stat boxes use theme colors
- [ ] Charts use theme colors
- [ ] Buttons use theme colors

### ✅ Games Hub Page
- [ ] Header uses theme colors
- [ ] Game cards use theme colors
- [ ] No "??" placeholders visible
- [ ] Coin display uses theme colors
- [ ] Tier badges use theme colors
- [ ] Buttons use theme colors

### ✅ Sidebar Functionality
- [ ] Auto-hide/collapse works smoothly
- [ ] Text is readable in all themes
- [ ] Icons are visible in all themes
- [ ] No glitchy behavior when opening/closing
- [ ] Hover effects work properly

## Expected Results

All pages should consistently reflect the active theme colors. When switching between themes:
- **All UI elements** should update to use the new theme colors
- **No hardcoded colors** should remain visible
- **No "??" placeholders** should appear in Games Hub
- **Sidebar text** should remain readable in all themes
- **Navigation** should work consistently across all pages

## Test Completion

Once all checkboxes are marked and all pages have been verified to work correctly with all themes, the theme consistency fix is complete.