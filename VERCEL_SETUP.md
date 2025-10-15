# Vercel Deployment Setup

## ✅ Your Project is Now Vercel-Ready!

The repository has been configured with proper Vercel settings at the root level.

## What Was Fixed

1. **Root `vercel.json`** - Tells Vercel to build from the `landing-page/` subdirectory
2. **Root `package.json`** - Provides build commands for Vercel to auto-detect Next.js
3. **Updated README** - Clear deployment instructions

## Deploy to Vercel (5 Minutes)

### Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub (or create account)

2. **Import Repository**
   - Click "Add New..." → "Project"
   - Find `acrosley/referral-engine`
   - Click "Import"

3. **Configure (Auto-detected)**
   Vercel will automatically detect:
   - ✅ Framework: Next.js
   - ✅ Build Command: `npm run build`
   - ✅ Output Directory: `landing-page/.next`
   - ✅ Install Command: `npm install`
   
   **No manual configuration needed!**

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! 🎉

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Or deploy to production directly
vercel --prod
```

## Expected Deployment

After deployment, you'll get URLs like:

```
Production:    https://referral-engine.vercel.app
Landing Page:  https://referral-engine.vercel.app/
Intake Form:   https://referral-engine.vercel.app/intake
API Endpoint:  https://referral-engine.vercel.app/api/intake
```

## Vercel Configuration Details

### Root `vercel.json`
```json
{
  "version": 2,
  "buildCommand": "cd landing-page && npm install && npm run build",
  "devCommand": "cd landing-page && npm run dev",
  "installCommand": "cd landing-page && npm install",
  "framework": null,
  "outputDirectory": "landing-page/.next"
}
```

This tells Vercel:
- Build from the `landing-page/` subdirectory
- Install dependencies there
- Output the built files from there

### Root `package.json`
Provides standard npm scripts that Vercel can recognize:
- `npm run build` - Builds the Next.js app
- `npm run dev` - Runs development server
- `npm start` - Runs production server

## Environment Variables (Optional)

If you need environment variables:

1. Go to Project Settings in Vercel
2. Click "Environment Variables"
3. Add variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-url.com
   ```

## Custom Domain (Optional)

After deployment, to add a custom domain:

1. Go to Project Settings → Domains
2. Add your domain (e.g., `cases.crosleylawgroup.com`)
3. Configure DNS records as shown
4. SSL certificate is automatic

### DNS Configuration
Add these records to your DNS provider:

```
Type: CNAME
Name: cases (or www, or @)
Value: cname.vercel-dns.com
```

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure `landing-page/` has all required files
- Verify `package.json` dependencies are correct

### 404 Errors
- Ensure root `vercel.json` is committed
- Check that Vercel is using the root directory
- Redeploy after pushing changes

### TypeScript Errors
- Check `landing-page/tsconfig.json`
- Run `npm run build` locally first
- Fix any type errors before deploying

## Automatic Deployments

Once connected to GitHub:
- **Push to `main`** → Production deployment
- **Open Pull Request** → Preview deployment
- **Every commit** → Automatic build

## Monitoring

After deployment:
- View deployments: Vercel Dashboard → Deployments
- Check logs: Click deployment → Functions tab
- View analytics: Vercel Dashboard → Analytics

## Rollback

If something goes wrong:
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Project Docs:** See `landing-page/README.md`

## Verification Checklist

After deployment:
- [ ] Landing page loads
- [ ] Navigate to `/intake`
- [ ] Submit test form
- [ ] Check form validation
- [ ] Test on mobile device
- [ ] Check all links work
- [ ] Verify disclaimers visible
- [ ] Run Lighthouse audit (target: 90+)

---

## Status: ✅ Ready to Deploy!

Your next step: Go to [vercel.com](https://vercel.com) and import your repository!

**Current Commit:** `cf1d8e7` - "Configure for Vercel deployment"  
**Repository:** https://github.com/acrosley/referral-engine  
**Documentation:** Complete ✅

