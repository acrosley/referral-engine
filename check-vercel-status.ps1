# Vercel Deployment Status Checker
# Run this script to check your latest Vercel deployment status

Write-Host "🚀 Checking Vercel Deployment Status..." -ForegroundColor Cyan
Write-Host ""

# Get latest git commit
$latestCommit = git log -1 --pretty=format:"%h - %s (%cr)"
Write-Host "📝 Latest Commit:" -ForegroundColor Yellow
Write-Host "   $latestCommit"
Write-Host ""

# Repository info
$repoUrl = git config --get remote.origin.url
Write-Host "📦 Repository:" -ForegroundColor Yellow
Write-Host "   $repoUrl"
Write-Host ""

# Instructions
Write-Host "🔍 To view your deployment:" -ForegroundColor Green
Write-Host "   1. Go to: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "   2. Find: acrosley/referral-engine" -ForegroundColor White
Write-Host "   3. Click on the latest deployment" -ForegroundColor White
Write-Host ""

Write-Host "📊 Quick Status Check:" -ForegroundColor Green
Write-Host "   Building:  Check 'Deployments' tab on Vercel dashboard" -ForegroundColor White
Write-Host "   Logs:      Click deployment → 'Building' → View logs" -ForegroundColor White
Write-Host "   Live URL:  Shown after successful deployment" -ForegroundColor White
Write-Host ""

# Alternative: Open Vercel dashboard directly
$openDashboard = Read-Host "Open Vercel dashboard in browser? (Y/N)"
if ($openDashboard -eq "Y" -or $openDashboard -eq "y") {
    Start-Process "https://vercel.com/dashboard"
}

Write-Host ""
Write-Host "✅ Done! Your deployment should be live in 2-3 minutes." -ForegroundColor Green

