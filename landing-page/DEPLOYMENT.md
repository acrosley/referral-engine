# Deployment Guide - Crosley Referral Landing Page

## Quick Deploy to Vercel (Recommended)

### Prerequisites
1. A Vercel account (free tier is sufficient)
2. Git repository with your code
3. Node.js installed locally (for testing)

### Step-by-Step Deployment

#### Method 1: GitHub + Vercel (Easiest)

1. **Push to GitHub**
   ```bash
   # From the project root
   git add .
   git commit -m "Add landing page"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `landing-page`
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)

4. **Environment Variables (Optional)**
   Add these in the Vercel dashboard if needed:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-url.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Your site will be live at `https://your-project.vercel.app`

6. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `cases.crosleyreferral.com`)
   - Follow DNS configuration instructions

#### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd landing-page
   vercel
   ```

4. **Production Deploy**
   ```bash
   vercel --prod
   ```

## Alternative: Deploy to Netlify

1. **Push to GitHub** (if not already done)

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Connect to your GitHub repository

3. **Configure Build**
   - **Base directory:** `landing-page`
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Framework:** Next.js

4. **Environment Variables**
   Add in Site Settings → Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-url.com
   ```

5. **Deploy**
   - Click "Deploy site"
   - Site will be live at `https://random-name.netlify.app`

## Alternative: Deploy to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)

2. **New Project from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure**
   - Railway auto-detects Next.js
   - Set root directory: `landing-page`
   - Add environment variables if needed

4. **Deploy**
   - Railway will automatically deploy
   - Get your public URL from the dashboard

## Alternative: Traditional VPS Hosting

### On DigitalOcean, AWS EC2, or Similar

1. **Server Setup**
   ```bash
   # SSH into your server
   ssh user@your-server-ip
   
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Clone and Install**
   ```bash
   git clone your-repo-url
   cd your-repo/landing-page
   npm install
   npm run build
   ```

3. **Run with PM2**
   ```bash
   pm2 start npm --name "crosley-landing" -- start
   pm2 save
   pm2 startup
   ```

4. **Set up Nginx Reverse Proxy**
   ```nginx
   # /etc/nginx/sites-available/crosley-landing
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable Site and SSL**
   ```bash
   sudo ln -s /etc/nginx/sites-available/crosley-landing /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   
   # Install SSL with Let's Encrypt
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Post-Deployment Checklist

### Immediate Testing
- [ ] Visit the deployed URL
- [ ] Test landing page loads correctly
- [ ] Navigate to `/intake` page
- [ ] Submit a test form with valid data
- [ ] Submit a form with invalid data (test validation)
- [ ] Check mobile responsiveness
- [ ] Test on multiple browsers

### Verify Functionality
- [ ] All images and assets load
- [ ] Form validation works
- [ ] Success message appears after submission
- [ ] Error handling works properly
- [ ] Navigation links work
- [ ] Disclaimers are visible

### Check Monitoring
- [ ] Set up Vercel Analytics (if using Vercel)
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up uptime monitoring
- [ ] Check submission logs are working

### Performance
- [ ] Run Lighthouse audit (target: 90+ scores)
- [ ] Test page load speed
- [ ] Verify mobile performance
- [ ] Check Core Web Vitals

### SEO & Compliance
- [ ] Verify meta tags are correct
- [ ] Check robots.txt
- [ ] Ensure disclaimers are prominent
- [ ] Verify consent checkboxes work
- [ ] Test with screen reader (accessibility)

## Domain Configuration

### Custom Domain Setup

1. **Purchase Domain** (if needed)
   - Recommended: Namecheap, Google Domains, Cloudflare

2. **DNS Configuration for Vercel**
   Add these records in your DNS provider:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Add to Vercel**
   - Project Settings → Domains
   - Add your domain
   - Wait for SSL certificate (automatic)

### Subdomain Setup
For `cases.yourdomain.com`:
```
Type: CNAME
Name: cases
Value: cname.vercel-dns.com
```

## Environment Variables Reference

### For Production
```env
# Backend API (Phase 2 integration)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Monitoring (Optional)
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Setting in Vercel
1. Go to Project Settings
2. Click "Environment Variables"
3. Add each variable
4. Select environments (Production, Preview, Development)
5. Click "Save"
6. Redeploy for changes to take effect

## Continuous Deployment

### Automatic Deploys
Once connected to GitHub/GitLab:
- Every push to `main` → Production deploy
- Every PR → Preview deploy (temporary URL)
- Commit history maintained in Vercel dashboard

### Manual Deploys
```bash
# Redeploy current version
vercel --prod

# Deploy specific branch
git checkout feature-branch
vercel
```

## Rollback

### Vercel Rollback
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." menu
4. Select "Promote to Production"

### Manual Rollback
```bash
git revert HEAD
git push origin main
# Vercel auto-deploys the revert
```

## Monitoring & Logs

### View Logs in Vercel
1. Go to your project dashboard
2. Click on deployment
3. View "Functions" tab for API logs
4. View "Build Logs" for build issues

### Real-time Logs (CLI)
```bash
vercel logs your-project-url.vercel.app
```

## Troubleshooting

### Build Fails
```bash
# Test build locally first
npm run build

# Check Node version
node --version  # Should be 18+

# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Form Not Submitting
- Check browser console for errors
- Verify API route is accessible: `/api/intake`
- Check Vercel function logs
- Verify environment variables

### Styles Not Loading
- Clear browser cache
- Check Tailwind config
- Verify `globals.css` import in layout
- Check build output for CSS files

### 404 Errors
- Verify Next.js App Router structure
- Check file names and paths
- Ensure `page.tsx` files exist in routes
- Review Next.js routing documentation

## Performance Optimization

### Image Optimization
Use Next.js Image component:
```tsx
import Image from 'next/image';

<Image 
  src="/logo.png" 
  width={200} 
  height={100}
  alt="Logo"
/>
```

### Font Optimization
Already configured with `next/font/google`:
```tsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```

### Caching
Vercel automatically configures:
- Static assets cached at edge
- API routes cached based on headers
- ISR (Incremental Static Regeneration) available

## Security Checklist

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables secured
- [ ] No API keys in client code
- [ ] Form validation on server-side
- [ ] Rate limiting considered (add later)
- [ ] CORS configured properly
- [ ] Headers security configured

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Deployment Issues:** Check Vercel Status page
- **Community:** Vercel Discord, Next.js GitHub

## Cost Estimates

### Vercel (Recommended)
- **Free Tier:** 
  - 100 GB bandwidth/month
  - Unlimited projects
  - Automatic SSL
  - ✅ Sufficient for MVP/PoC

- **Pro Tier ($20/month):**
  - 1 TB bandwidth
  - Better performance
  - Priority support
  - Only needed at scale

### Estimated Traffic Costs
- 1,000 visitors/month: **FREE**
- 10,000 visitors/month: **FREE**
- 100,000 visitors/month: **~$20/month**

---

**Need Help?** 
- Check Vercel deployment logs
- Review Next.js documentation
- Contact Vercel support (Pro plan)

**Ready to Deploy?** Follow Method 1 above for fastest results!

