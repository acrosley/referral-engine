# Referral Engine

A referral engine for personal injury cases with AI-powered case scoring.

## Components

### Landing Page (`landing-page/`)
- Next.js 14 application with intake form
- Deploy to Vercel: `npm run dev`

### Financial Model
- Python Gradio application for case scoring
- Run: `python financial_sensitivity_model.py`

## Quick Start

```bash
# Install and run landing page
npm install
npm run dev

# Install and run financial model
pip install -r requirements.txt
python financial_sensitivity_model.py
```

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Python, Gradio, Matplotlib
- **Deployment:** Vercel

## License

Proprietary
