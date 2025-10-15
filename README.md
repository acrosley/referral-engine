# Crosley Referral Engine

An intelligent referral engine for personal injury cases, combining attorney-led ethics with data-driven precision.

## Project Components

### 1. Landing Page & Intake Form (`landing-page/`)
- **Tech Stack:** Next.js 14, TypeScript, Tailwind CSS
- **Features:** Professional landing page, comprehensive case intake form, API routes
- **Status:** ✅ Complete and production-ready
- **Documentation:** See `landing-page/README.md`

### 2. Financial Sensitivity Model
- **Tech Stack:** Python, Gradio, Matplotlib
- **Features:** ROI analysis, keeper-grade analytics, time-based margin tracking
- **Status:** ✅ Complete
- **Run:** `python financial_sensitivity_model.py`

## Quick Start

### Landing Page Deployment (Vercel)

The landing page is configured for automatic deployment to Vercel:

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import this repository
   - Vercel will auto-detect the Next.js configuration

2. **Configuration:**
   - Framework: Next.js (auto-detected via root package.json)
   - Root Directory: Auto-configured to build from `landing-page/`
   - Build Command: Automatically uses `npm run build`
   - Output Directory: `landing-page/.next`

3. **Deploy:**
   - Click "Deploy"
   - Your site will be live in 2-3 minutes!

### Local Development

```bash
# Install dependencies and run landing page
npm run dev
# Opens at http://localhost:3000

# Or run directly from landing-page directory
cd landing-page
npm install
npm run dev
```

### Financial Model

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the financial model
python financial_sensitivity_model.py
# Opens at http://localhost:7860
```

## Project Structure

```
referral-engine/
├── landing-page/              # Next.js landing page & intake form
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # React components
│   ├── lib/                   # Utilities and validation
│   └── [docs & configs]       # Comprehensive documentation
├── financial_sensitivity_model.py    # Gradio financial model
├── referral_engine_project_plan.md  # Complete project plan
├── mission.agent.md           # Mission statement
├── package.json               # Root package.json for Vercel
├── vercel.json               # Vercel deployment config
└── [project documentation]    # Implementation guides
```

## Documentation

- **Landing Page:** `landing-page/README.md` - Complete technical documentation
- **Deployment:** `landing-page/DEPLOYMENT.md` - Multi-platform deployment guide
- **Quick Start:** `landing-page/QUICKSTART.md` - 3-minute setup
- **Integration:** `landing-page/INTEGRATION.md` - Backend integration guide
- **Architecture:** `landing-page/ARCHITECTURE.md` - System design
- **Project Plan:** `referral_engine_project_plan.md` - Complete project roadmap
- **Implementation:** `IMPLEMENTATION_COMPLETE.md` - Build completion report

## Deployment Status

| Component | Status | URL |
|-----------|--------|-----|
| Landing Page | ✅ Ready | Deploy to Vercel |
| Intake Form | ✅ Ready | `/intake` route |
| API Routes | ✅ Ready | `/api/intake` endpoint |
| Financial Model | ✅ Complete | Local/Cloud deployment |

## Technology Stack

### Frontend (Landing Page)
- Next.js 14 (App Router)
- React 18
- TypeScript 5
- Tailwind CSS 3
- React Hook Form + Zod validation
- Vercel deployment

### Backend (Financial Model)
- Python 3.10+
- Gradio 4.0
- Matplotlib 3.7
- Pillow 10.0

## Next Steps

### Phase 1 ✅ Complete
- Landing page with intake form
- Financial sensitivity model
- Vercel deployment ready

### Phase 2 🔄 Next
- Database integration (Supabase/PostgreSQL)
- See `landing-page/INTEGRATION.md` for details

### Phase 3 📋 Planned
- AI case scoring (FastAPI backend)
- Partner firm matching algorithm

### Phase 4 📋 Planned
- Referral routing engine
- Email/SMS notifications

### Phase 5 📋 Planned
- Analytics dashboard (Power BI)
- ROI tracking and reporting

## Compliance

This project implements Texas Bar Rule 1.04(f) compliant referral practices:
- ✅ Licensed attorney-owned referral service
- ✅ Client consent for referrals
- ✅ Fee-sharing disclosure
- ✅ Attorney advertising disclaimers
- ✅ No attorney-client relationship notices

## Support

- **Issues:** GitHub Issues
- **Documentation:** See individual README files in each directory
- **Questions:** Refer to comprehensive documentation suite

## License

Proprietary - Crosley Referral Law Group, PLLC

---

**Version:** 1.0.0  
**Last Updated:** October 2025  
**Status:** Production Ready for Phase 1
