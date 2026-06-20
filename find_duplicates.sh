#!/bin/bash
# TryIT — Duplicate File Detector
# Finds files that likely conflict due to multiple Claude sessions

echo "═══════════════════════════════════════════"
echo "  DUPLICATE / CONFLICTING FILE DETECTOR"
echo "═══════════════════════════════════════════"
echo ""

# Group files by their "base name" (stripped of Page/Screen suffixes)
# to find likely duplicates
echo "── Files with similar names (possible duplicates) ──"
echo ""

find src/pages src/components -name "*.jsx" 2>/dev/null | \
  sed 's/.*\///' | \
  sed 's/Page\.jsx$/.jsx/; s/Screen\.jsx$/.jsx/' | \
  sort | uniq -d

echo ""
echo "── Full file list grouped by folder (for manual review) ──"
echo ""

for dir in $(find src/pages -maxdepth 1 -type d 2>/dev/null | sort); do
  count=$(find "$dir" -maxdepth 1 -name "*.jsx" 2>/dev/null | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "📁 $dir ($count files):"
    find "$dir" -maxdepth 1 -name "*.jsx" 2>/dev/null | sed 's/.*\//   - /'
  fi
done

echo ""
echo "── App.jsx size check (sanity check for merge issues) ──"
if [ -f "src/App.jsx" ]; then
  wc -l src/App.jsx
  echo "(A healthy App.jsx for this project should be roughly 300-450 lines)"
else
  echo "❌ src/App.jsx NOT FOUND — this is critical, nothing will work without it"
fi

echo ""
echo "── Checking for backup/duplicate App files ──"
find src -maxdepth 1 -iname "App*.jsx" 2>/dev/null
