#!/bin/bash
# TryIT — File Verification Script
# Checks every file built in today's session and reports missing ones only

FILES=(
  "src/pages/centre/CentreOnboarding.jsx"
  "src/pages/parent/ParentOnboarding.jsx"
  "src/pages/tournament/TournamentHub.jsx"
  "src/pages/tournament/TournamentLive.jsx"
  "src/pages/tournament/TournamentResults.jsx"
  "src/pages/tournament/TournamentReview.jsx"
  "src/pages/games/GKBlitz.jsx"
  "src/pages/games/MathBlitz.jsx"
  "src/pages/games/WordRush.jsx"
  "src/pages/games/LogicGrid.jsx"
  "src/pages/games/Battle.jsx"
  "src/pages/games/MemoryMatch.jsx"
  "src/pages/games/VisualIdentify.jsx"
  "src/pages/games/NumberSeries.jsx"
  "src/pages/games/SpeedReading.jsx"
  "src/pages/games/DailyChallenge.jsx"
  "src/pages/games/CurrentAffairsRapid.jsx"
  "src/pages/games/SportsMastery.jsx"
  "src/pages/games/GamesHub.jsx"
  "src/pages/games/GameResultScreen.jsx"
  "src/pages/games/GameLevelRoadmap.jsx"
  "src/pages/admin/AdminDashboard.jsx"
  "src/pages/admin/AdminLogin.jsx"
  "src/pages/admin/CurrentAffairsManager.jsx"
  "src/pages/centre/CentreDashboard.jsx"
  "src/pages/centre/CentreLogin.jsx"
  "src/pages/wallet/WalletPage.jsx"
  "src/pages/leaderboard/Leaderboard.jsx"
  "src/pages/referral/ReferralPage.jsx"
  "src/pages/settings/Settings.jsx"
  "src/pages/legal/Terms.jsx"
  "src/pages/legal/Privacy.jsx"
  "src/pages/Login.jsx"
  "src/pages/Onboarding.jsx"
  "src/pages/Profile.jsx"
  "src/pages/role-select/RoleSelect.jsx"
  "src/pages/parent/ParentLogin.jsx"
  "src/pages/mentor/MentorHub.jsx"
  "src/pages/family/FamilyHub.jsx"
  "src/pages/community/CommunityPage.jsx"
  "src/pages/bharat-pulse/BharatPulse.jsx"
  "src/pages/concept/ConceptCard.jsx"
  "src/pages/concept/ConceptCheckpoint.jsx"
  "src/pages/roadmap/PrepPathway.jsx"
  "src/pages/pricing/PricingPage.jsx"
  "src/pages/test-engine/ActiveTest.jsx"
  "src/pages/test-engine/ResultScreen.jsx"
  "src/pages/test-engine/TestLauncher.jsx"
  "src/components/QuestionFlag.jsx"
  "src/components/ShareCard.jsx"
  "src/components/NotificationBar.jsx"
  "src/components/SkillProgress.jsx"
  "src/components/LevelRoadmap.jsx"
  "src/components/EmojiSystem.js"
  "src/components/ProfilePhoto.jsx"
  "src/components/SmartExamSearch.jsx"
  "src/components/PathwayEnrollModal.jsx"
  "src/lib/tournamentEngine.js"
  "src/lib/answerKeyEngine.js"
  "src/lib/gameEngine.js"
  "src/lib/gameJuice.js"
  "src/lib/levelSystem.js"
  "src/context/AuthContext.jsx"
)

echo "═══════════════════════════════════════"
echo "  TRYIT FILE CHECK — $(date +%H:%M)"
echo "═══════════════════════════════════════"
echo ""

MISSING=0
FOUND=0

for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    FOUND=$((FOUND+1))
  else
    echo "❌ MISSING: $f"
    MISSING=$((MISSING+1))
  fi
done

echo ""
echo "═══════════════════════════════════════"
echo "✅ Found:   $FOUND files"
echo "❌ Missing: $MISSING files"
echo "═══════════════════════════════════════"

if [ $MISSING -eq 0 ]; then
  echo ""
  echo "🎉 Everything from today's session is present!"
fi
