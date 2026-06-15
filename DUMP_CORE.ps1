# Run in PowerShell inside E:\Tatu
# Dumps the exact current content of all core auth flow files

Write-Host "========== src/pages/Login.jsx ==========" -ForegroundColor Cyan
Get-Content "E:\Tatu\src\pages\Login.jsx" | Select-Object -First 160

Write-Host "`n========== src/pages/Onboarding.jsx (lines 460-490) ==========" -ForegroundColor Cyan
$ob = Get-Content "E:\Tatu\src\pages\Onboarding.jsx"
$ob[459..489] | ForEach-Object -Begin {$i=460} -Process {"${i}: $_"; $i++}

Write-Host "`n========== src/context/AuthContext.jsx (lines 1-30 + 130-160) ==========" -ForegroundColor Cyan
$ac = Get-Content "E:\Tatu\src\context\AuthContext.jsx"
$ac[0..29] | ForEach-Object -Begin {$i=1} -Process {"${i}: $_"; $i++}
Write-Host "..."
$ac[129..159] | ForEach-Object -Begin {$i=130} -Process {"${i}: $_"; $i++}

Write-Host "`n========== src/pages/Dashboard.jsx (lines 1-20) ==========" -ForegroundColor Cyan
Get-Content "E:\Tatu\src\pages\Dashboard.jsx" | Select-Object -First 20

Write-Host "`n========== src/pages/family/FamilyHub.jsx (lines 24-40) ==========" -ForegroundColor Cyan
$fh = Get-Content "E:\Tatu\src\pages\family\FamilyHub.jsx"
$fh[23..39] | ForEach-Object -Begin {$i=24} -Process {"${i}: $_"; $i++}

Write-Host "`n========== src/App.jsx (lines 280-300) ==========" -ForegroundColor Cyan
$app = Get-Content "E:\Tatu\src\App.jsx"
$app[279..299] | ForEach-Object -Begin {$i=280} -Process {"${i}: $_"; $i++}
