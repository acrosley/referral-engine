# Architecture Overview - Crosley Referral Landing Page

## Current Architecture (Phase 1c - Completed)

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
│                                                              │
│  ┌────────────────┐         ┌─────────────────┐            │
│  │  Landing Page  │◄────────┤  Hero Section   │            │
│  │  (app/page.tsx)│         └─────────────────┘            │
│  └───────┬────────┘                                         │
│          │                                                  │
│          │ User clicks "Submit Case"                        │
│          ▼                                                  │
│  ┌────────────────────────────────────────┐                │
│  │    Intake Form Page                     │                │
│  │    (app/intake/page.tsx)                │                │
│  │                                         │                │
│  │  ┌──────────────────────────────────┐  │                │
│  │  │  IntakeForm Component            │  │                │
│  │  │  (components/IntakeForm.tsx)     │  │                │
│  │  │                                  │  │                │
│  │  │  • Contact fields                │  │                │
│  │  │  • Incident details              │  │                │
│  │  │  • Injury information            │  │                │
│  │  │  • Consent checkboxes            │  │                │
│  │  │                                  │  │                │
│  │  │  ┌──────────────────────────┐   │  │                │
│  │  │  │ React Hook Form          │   │  │                │
│  │  │  │ + Zod Validation         │   │  │                │
│  │  │  │ (lib/validation.ts)      │   │  │                │
│  │  │  └──────────────────────────┘   │  │                │
│  │  └──────────────┬───────────────────┘  │                │
│  └─────────────────┼──────────────────────┘                │
│                    │ Form Submit (JSON)                     │
└────────────────────┼────────────────────────────────────────┘
                     │
                     │ HTTPS POST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      SERVER SIDE (Next.js)                   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Route: /api/intake                              │   │
│  │  (app/api/intake/route.ts)                           │   │
│  │                                                       │   │
│  │  1. ✅ Receive JSON request                          │   │
│  │  2. ✅ Validate with Zod schema                      │   │
│  │  3. ✅ Generate submission ID                        │   │
│  │  4. ✅ Add metadata (timestamp, IP, user agent)      │   │
│  │  5. ✅ Log to console                                │   │
│  │  6. ✅ Return success/error response                 │   │
│  │                                                       │   │
│  │  ⏳ Future: Send to database                         │   │
│  │  ⏳ Future: Trigger AI scoring                       │   │
│  │  ⏳ Future: Route to partner firm                    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. User Journey
```
Landing Page → Learn About Services → Click CTA → Intake Form → 
Fill Form → Validate → Submit → Success Message
```

### 2. Form Submission Flow
```
Client Browser                Next.js Server
     │                             │
     │ 1. Fill form                │
     │ 2. Click Submit             │
     ├────────[POST]───────────────>
     │    /api/intake              │
     │    (JSON payload)            │ 3. Validate data
     │                              │ 4. Generate ID
     │                              │ 5. Log submission
     │                              │
     <───────[200 OK]───────────────┤
     │ 6. Show success              │
     ▼                              ▼
```

### 3. Validation Flow
```
Form Input
    │
    ▼
Client-Side Validation (React Hook Form + Zod)
    ├─ Valid? ──> Submit to API
    └─ Invalid? ──> Show errors inline
                      │
                      ▼
Server-Side Validation (Zod in API route)
    ├─ Valid? ──> Process & log
    └─ Invalid? ──> Return 400 error
```

---

## Component Architecture

```
app/layout.tsx (Root Layout)
│
├── Header
│   ├── Logo/Title
│   └── Navigation
│       └── "Submit Your Case" button
│
├── Main Content (children)
│   │
│   ├── app/page.tsx (Landing Page)
│   │   ├── <Hero />
│   │   ├── Value Propositions
│   │   ├── Case Types
│   │   └── CTA Section
│   │
│   └── app/intake/page.tsx (Intake Page)
│       ├── <Disclaimer />
│       └── <IntakeForm />
│           ├── Contact Section
│           ├── Incident Section
│           ├── Injury Section
│           ├── Insurance Section
│           └── Consent Section
│
└── Footer
    ├── <Disclaimer />
    └── Copyright notice
```

---

## Technology Stack Detail

### Frontend Framework
```
Next.js 14.2 (App Router)
├── React 18.3
├── TypeScript 5.6
└── CSS via Tailwind 3.4
```

### Form Management
```
React Hook Form 7.53
├── Form state management
├── Field validation
├── Error handling
└── Submission handling

@hookform/resolvers 3.9
└── Zod integration

Zod 3.23
└── Schema validation
```

### Styling
```
Tailwind CSS 3.4
├── Utility-first CSS
├── Responsive design
├── Custom theme (primary colors)
└── PostCSS processing
```

### API Layer
```
Next.js API Routes
├── TypeScript support
├── Server-side validation
├── JSON responses
└── Error handling
```

---

## Future Architecture (Phases 2-5)

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  Landing Page → Intake Form → Submit                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS FRONTEND + API                          │
│  • Landing pages                                             │
│  • Form handling                                             │
│  • API routes (bridge layer)                                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND                             │
│  • Business logic                                            │
│  • AI case scoring                                           │
│  • Routing engine                                            │
│  • Partner matching                                          │
└───────┬─────────────────┬──────────────────┬────────────────┘
        │                 │                  │
        ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ PostgreSQL   │  │ AI Models    │  │ Email/SMS    │
│ (Supabase)   │  │ (Whisper,    │  │ (Twilio,     │
│              │  │  Gemma/Qwen) │  │  Sendgrid)   │
│ • Cases      │  │              │  │              │
│ • Partners   │  │ • Scoring    │  │ • Client     │
│ • Analytics  │  │ • Grading    │  │ • Partner    │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Security Architecture

### Current (Phase 1)
```
Client Security
├── HTTPS (via Vercel)
├── XSS protection (React)
├── Input sanitization
└── Client-side validation

Server Security
├── Server-side validation
├── Type safety (TypeScript)
├── Error handling
└── Rate limiting (Vercel default)
```

### Future (Phases 2+)
```
Additional Security
├── API key authentication
├── Rate limiting (custom)
├── CSRF protection
├── Database encryption
├── PII data handling
└── Audit logging
```

---

## Deployment Architecture

### Current Setup (Vercel)
```
GitHub Repository
     │
     │ (Push to main)
     ▼
Vercel Build Pipeline
     ├── Install dependencies
     ├── TypeScript compilation
     ├── Next.js build
     └── Deploy to CDN
          │
          ▼
Global CDN (Vercel Edge Network)
     ├── Static assets cached
     ├── API routes on serverless
     └── Automatic HTTPS
          │
          ▼
End Users (Worldwide)
```

### Edge Functions
```
User Request → Vercel Edge → API Route (Serverless Function)
                           → Static Page (CDN cache)
```

---

## File Structure Architecture

```
landing-page/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (header/footer)
│   ├── page.tsx                  # Landing page route (/)
│   ├── globals.css               # Global styles
│   │
│   ├── intake/                   # Intake page route
│   │   └── page.tsx              # (/intake)
│   │
│   └── api/                      # API routes
│       └── intake/               # Form submission endpoint
│           └── route.ts          # (/api/intake)
│
├── components/                   # React components
│   ├── Hero.tsx                  # Landing hero section
│   ├── IntakeForm.tsx            # Form component
│   └── Disclaimer.tsx            # Legal disclaimers
│
├── lib/                          # Utility libraries
│   └── validation.ts             # Zod schemas
│
├── public/                       # Static assets
│   └── README.md                 # Asset instructions
│
├── Configuration Files
│   ├── package.json              # Dependencies
│   ├── tsconfig.json             # TypeScript config
│   ├── tailwind.config.ts        # Tailwind config
│   ├── next.config.mjs           # Next.js config
│   ├── postcss.config.mjs        # PostCSS config
│   ├── vercel.json               # Vercel deployment
│   └── .eslintrc.json            # ESLint rules
│
└── Documentation
    ├── README.md                 # Main documentation
    ├── DEPLOYMENT.md             # Deployment guide
    ├── QUICKSTART.md             # Quick start guide
    ├── INTEGRATION.md            # Backend integration
    ├── CHECKLIST.md              # Pre-deployment checklist
    └── ARCHITECTURE.md           # This file
```

---

## Performance Considerations

### Build Time
- TypeScript compilation: ~10s
- Next.js build: ~20s
- Total build: ~30s

### Runtime Performance
- First Contentful Paint: < 1.5s (target)
- Time to Interactive: < 3.5s (target)
- Lighthouse Score: 95+ (target)

### Optimization Strategies
- Static page generation (landing page)
- Server-side rendering (intake form)
- API route caching (future)
- Image optimization (Next.js Image)
- Font optimization (next/font/google)
- Code splitting (automatic)

---

## Scalability

### Current Capacity (Vercel Free Tier)
- Requests: ~100,000/month
- Bandwidth: 100 GB/month
- Build minutes: 6,000/month
- Sufficient for: ~10,000 visitors/month

### Scaling Path
1. **Phase 1 (MVP):** Vercel Free Tier
2. **Phase 2 (Growth):** Vercel Pro ($20/mo)
3. **Phase 3 (Scale):** Enterprise plan or self-hosted

---

## Monitoring & Observability

### Current
- Console logging
- Vercel build logs
- Browser dev tools

### Planned (Phase 2+)
- Vercel Analytics
- Error tracking (Sentry)
- Performance monitoring
- Custom dashboard (Power BI)
- Real-time alerts

---

## Integration Points

### Current External Services
- None (fully self-contained)

### Future Integration Points
1. **Database:** Supabase/PostgreSQL
2. **AI Backend:** FastAPI service
3. **Email:** SendGrid/Twilio
4. **SMS:** Twilio
5. **Analytics:** Google Analytics
6. **CRM:** Custom or third-party
7. **Payment:** Stripe (if needed)

---

## Development Workflow

```
Local Development
     │
     │ npm run dev (localhost:3000)
     │ Make changes
     │ Test locally
     ▼
Git Commit & Push
     │
     │ Push to GitHub
     ▼
Automatic Build (Vercel)
     │
     │ Build Next.js app
     │ Run TypeScript checks
     │ Deploy to preview URL
     ▼
Preview Deployment
     │
     │ Test preview
     │ Merge to main
     ▼
Production Deployment
     │
     │ Automatic deploy
     ▼
Live Site
```

---

## Key Design Decisions

### Why Next.js 14 App Router?
- Modern React features
- Server components
- Built-in API routes
- Excellent Vercel integration
- Type-safe routing

### Why Tailwind CSS?
- Rapid development
- Consistent styling
- Mobile-first responsive
- Small bundle size
- Easy customization

### Why Zod?
- TypeScript-first validation
- Client and server reuse
- Excellent error messages
- Type inference
- Schema composition

### Why Vercel?
- Zero-config deployment
- Automatic scaling
- Built-in CDN
- Serverless functions
- Excellent DX

---

## Compliance Architecture

### Texas Bar Rule 1.04(f) Implementation
```
User Journey
     │
     ▼
Disclaimer Visible (Footer + Intake Page)
     │
     ▼
Explicit Consent Checkboxes
     ├── Contact consent
     ├── Referral consent (Rule 1.04(f))
     └── Disclaimer acknowledgment
     │
     ▼
Validation (all must be checked)
     │
     ▼
Submission with consent logged
     │
     ▼
Timestamp + audit trail
```

### Data Handling
- Minimal PII collection
- Secure transmission (HTTPS)
- Structured logging
- Future: Encryption at rest

---

## Maintenance & Updates

### Regular Updates
- Dependencies: Monthly security updates
- Node.js: Follow LTS schedule
- Next.js: Upgrade quarterly
- Vercel platform: Automatic

### Content Updates
- Landing page copy: Edit `app/page.tsx`
- Form fields: Edit `components/IntakeForm.tsx`
- Validation: Edit `lib/validation.ts`
- Disclaimers: Edit `components/Disclaimer.tsx`

---

**Document Version:** 1.0  
**Last Updated:** October 15, 2025  
**Status:** Production Ready

