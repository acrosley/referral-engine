# Vercel CLI Reference Guide

## Overview
Complete reference for managing the referral engine deployment at `acrosley-referral-engine.vercel.app` using Vercel CLI.

## Quick Setup (One-time)

### Authentication
```bash
# Add Node.js to PATH (Windows PowerShell)
$env:PATH += ";C:\Program Files\nodejs"

# Login to Vercel (opens browser for authentication)
npx vercel login
```

### Link Project to Deployment
```bash
# Link local codebase to existing Vercel project
npx vercel link --yes
```

## Primary: Monitoring & Logs

### View Real-time Logs
```bash
# Live logs from production deployment
npx vercel logs acrosley-referral-engine.vercel.app --follow

# Recent logs (last hour)
npx vercel logs acrosley-referral-engine.vercel.app
```

### Check Deployment Status
```bash
# List all deployments with URLs and status
npx vercel ls

# Detailed info about specific deployment
npx vercel inspect acrosley-referral-engine.vercel.app
```

### View Build Logs
```bash
# Show build logs for a deployment
npx vercel inspect acrosley-referral-engine.vercel.app --logs
```

## Environment Variables Management

### View Current Variables
```bash
# List all environment variables
npx vercel env ls
```

### Add Environment Variable
```bash
# Add new environment variable (prompts for value and scope)
npx vercel env add NEXT_PUBLIC_API_URL

# Common variables for future use:
npx vercel env add NEXT_PUBLIC_FORM_WEBHOOK_URL
npx vercel env add DATABASE_URL
npx vercel env add SECRET_KEY
```

### Remove Environment Variable
```bash
npx vercel env rm VARIABLE_NAME
```

### Sync Environment Variables
```bash
# Download production env vars to .env.local
npx vercel env pull
```

## Deployment Management

### Redeploy to Production
```bash
# Deploy from local code to production
npx vercel --prod
```

### List All Projects
```bash
# View all Vercel projects
npx vercel project ls
```

### Promote Preview to Production
```bash
# Promote specific deployment URL to production
npx vercel promote [deployment-url]
```

## Common Workflows

### Daily Monitoring
```bash
# Check deployment status
npx vercel ls

# View recent logs
npx vercel logs acrosley-referral-engine.vercel.app

# Check for any issues
npx vercel inspect acrosley-referral-engine.vercel.app
```

### After Code Changes
```bash
# 1. Make changes locally
# 2. Test locally: npm run dev
# 3. Deploy to production
npx vercel --prod

# 4. Verify deployment
npx vercel inspect acrosley-referral-engine.vercel.app
```

### Debugging Issues
```bash
# 1. Check deployment status
npx vercel ls

# 2. View build logs
npx vercel inspect acrosley-referral-engine.vercel.app --logs

# 3. Monitor runtime logs
npx vercel logs acrosley-referral-engine.vercel.app --follow

# 4. Check environment variables
npx vercel env ls
```

## Project Information

### Current Deployment Details
- **Production URL:** https://acrosley-referral-engine.vercel.app
- **Project ID:** dpl_DT7XbH24J8d7V1SuHQUDSffaykBT
- **Status:** ● Ready
- **Region:** iad1 (US East)
- **Framework:** Next.js (auto-detected)
- **Build Command:** cd landing-page && npm run build
- **Output Directory:** landing-page/.next

### API Routes Deployed
- `/api/intake` - Form submission endpoint
- `/api/intake.rsc` - React Server Component version

### Available Aliases
- https://acrosley-referral-engine.vercel.app
- https://acrosley-referral-engine-andrews-projects-71c3f6c1.vercel.app
- https://acrosley-referral-engine-git-main-andrews-projects-71c3f6c1.vercel.app

## Troubleshooting

### Common Issues

#### "vercel command not found"
```bash
# Add Node.js to PATH
$env:PATH += ";C:\Program Files\nodejs"

# Or use npx instead
npx vercel [command]
```

#### "No deployments found"
- Check if you're linked to the correct project
- Use `npx vercel project ls` to see all projects
- Verify the deployment URL is correct

#### "Scope does not exist"
- Use project-specific commands without scope parameter
- Example: `npx vercel env ls` instead of `npx vercel env ls --scope project-name`

#### Build Failures
```bash
# Check build logs
npx vercel inspect acrosley-referral-engine.vercel.app --logs

# Common fixes:
# 1. Ensure all dependencies are in package.json
# 2. Check for TypeScript errors locally first
# 3. Verify vercel.json configuration
```

### Environment Variable Issues
```bash
# After adding/changing env vars, redeploy
npx vercel --prod

# Verify env vars are set
npx vercel env ls
```

## Quick Reference Commands

### Essential Commands
| Command | Purpose |
|---------|---------|
| `npx vercel login` | Authenticate with Vercel |
| `npx vercel link --yes` | Link project to deployment |
| `npx vercel ls` | List deployments |
| `npx vercel logs [url] --follow` | Live logs |
| `npx vercel --prod` | Deploy to production |
| `npx vercel env ls` | List environment variables |
| `npx vercel inspect [url]` | Deployment details |

### Monitoring Commands
| Command | Purpose |
|---------|---------|
| `npx vercel logs acrosley-referral-engine.vercel.app --follow` | Monitor live logs |
| `npx vercel inspect acrosley-referral-engine.vercel.app` | Check deployment status |
| `npx vercel inspect acrosley-referral-engine.vercel.app --logs` | View build logs |
| `npx vercel project ls` | List all projects |

## Integration Notes

### For Phase 2 (Database Integration)
When ready to add database integration:
```bash
# Add database environment variable
npx vercel env add DATABASE_URL

# Add API endpoint for backend
npx vercel env add NEXT_PUBLIC_API_URL

# Redeploy with new environment
npx vercel --prod
```

### For Phase 3 (AI Backend)
When adding AI case scoring:
```bash
# Add AI service endpoints
npx vercel env add AI_API_URL
npx vercel env add AI_API_KEY

# Add form webhook for processing
npx vercel env add FORM_WEBHOOK_URL
```

## Security Notes

- Environment variables are encrypted in Vercel
- Never commit `.env` files to git
- Use `npx vercel env pull` to sync local development
- Production secrets should only be added via CLI or dashboard

## Performance Monitoring

### Check Deployment Performance
```bash
# View deployment details including build time
npx vercel inspect acrosley-referral-engine.vercel.app

# Monitor function performance in logs
npx vercel logs acrosley-referral-engine.vercel.app --follow
```

### Optimization Tips
- Monitor bundle sizes in build logs
- Check function cold start times
- Use `npx vercel --prod` for optimized production builds
- Monitor API response times in logs

---

**Last Updated:** October 15, 2025  
**CLI Version:** 48.3.0  
**Project:** acrosley-referral-engine.vercel.app
