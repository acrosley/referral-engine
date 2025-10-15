# Quick Start Guide

Get the Crosley Referral landing page running in 3 minutes!

## Prerequisites
- Node.js 18+ installed ([download here](https://nodejs.org/))
- Basic command line knowledge

## Setup Steps

### 1. Install Dependencies
```bash
cd landing-page
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: [http://localhost:3000](http://localhost:3000)

## Test the Application

### Landing Page
- Should see hero section with "Connect Your Case to Trusted Legal Partners"
- Three value proposition cards
- Case types grid
- Call-to-action buttons

### Intake Form
1. Click "Submit Your Case" or navigate to `/intake`
2. Fill out the form with test data
3. Check all required consent boxes
4. Click "Submit Case Information"
5. Should see success message

### View Submissions
Form submissions are logged to the console. Check your terminal where `npm run dev` is running.

## Common Issues

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Dependencies Failed to Install
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check TypeScript
npm run build
```

## Next Steps

1. ✅ Application running locally
2. 📝 Customize content in `app/page.tsx`
3. 🎨 Adjust styling in `tailwind.config.ts`
4. 🚀 Deploy to Vercel (see `DEPLOYMENT.md`)
5. 🔗 Integrate with backend (Phase 2)

## File Structure Quick Reference

```
landing-page/
├── app/
│   ├── page.tsx          # 👈 Edit landing page here
│   ├── intake/page.tsx   # 👈 Edit intake page here
│   └── api/intake/       # 👈 API endpoint
├── components/
│   ├── Hero.tsx          # 👈 Edit hero section
│   ├── IntakeForm.tsx    # 👈 Edit form fields
│   └── Disclaimer.tsx    # 👈 Edit disclaimers
└── lib/
    └── validation.ts     # 👈 Edit form validation
```

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Run linter
npm run lint
```

## Get Help

- 📖 Full documentation: See `README.md`
- 🚀 Deployment guide: See `DEPLOYMENT.md`
- 🔧 Troubleshooting: Check console for errors

---

**Ready to customize?** Start editing `app/page.tsx` and see changes in real-time!

