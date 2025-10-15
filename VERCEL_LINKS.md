# Vercel Quick Links

## 🔗 Direct Dashboard Links

### Main Dashboard
https://vercel.com/dashboard

### Your Project
Search for: `acrosley/referral-engine`

### Deployments
https://vercel.com/dashboard/deployments

## 📊 How to Check Build Status

### Method 1: Vercel Dashboard (Easiest)
1. Go to https://vercel.com/dashboard
2. Click on your project `referral-engine`
3. See real-time build status and logs

### Method 2: PowerShell Script (Quick)
```powershell
.\check-vercel-status.ps1
```

### Method 3: Vercel CLI (Most Detailed)
Requires Node.js to be installed first.

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# View logs
vercel logs --follow
```

### Method 4: GitHub Actions
Check the "Actions" tab in your GitHub repository to see when pushes trigger builds.

## 🚀 Current Deployment Info

**Repository:** https://github.com/acrosley/referral-engine  
**Branch:** main  
**Latest Commit:** Check with `git log -1`

## 💡 Pro Tips

### Real-time Monitoring
- Keep Vercel dashboard open in a browser tab
- Refresh after each git push
- Build typically takes 2-3 minutes

### Build Notifications
- Enable Vercel notifications in Settings
- Get email alerts for deployments
- Connect to Slack (optional)

### Debugging Failed Builds
1. Go to failed deployment in Vercel dashboard
2. Click "View Function Logs"
3. Check error messages
4. Fix locally, commit, push
5. Vercel auto-rebuilds

## 🔔 Enable Email Notifications

1. Go to Vercel Settings
2. Navigate to Notifications
3. Enable "Deployment notifications"
4. Get instant alerts on build status

## 📱 Mobile Monitoring

Vercel has a mobile-friendly dashboard:
- Visit vercel.com on your phone
- Login with GitHub
- Check deployments on the go

---

**Quick Status Check:** Run `.\check-vercel-status.ps1` in PowerShell!

