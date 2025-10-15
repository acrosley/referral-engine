# Pre-Deployment Checklist

Use this checklist before deploying to production.

## Development Setup ✅

- [x] Next.js project created
- [x] TypeScript configured
- [x] Tailwind CSS configured
- [x] All dependencies installed
- [x] Landing page built
- [x] Intake form built
- [x] API route implemented
- [x] Form validation working
- [x] No linter errors

## Content Review

- [ ] Review landing page copy for accuracy
- [ ] Verify phone number placeholder is updated (currently shows 555-123-4567)
- [ ] Check all legal disclaimers with attorney
- [ ] Verify Texas Bar Rule 1.04(f) language is correct
- [ ] Review form field labels and descriptions
- [ ] Check email templates (when added)

## Branding & Assets

- [ ] Add company logo to header
- [ ] Add favicon.ico (see `public/README.md`)
- [ ] Add apple-touch-icon.png
- [ ] Add Open Graph image for social sharing
- [ ] Customize color scheme in `tailwind.config.ts` (optional)
- [ ] Add any brand-specific imagery

## Configuration

- [ ] Update metadata in `app/layout.tsx`
  - [ ] Title
  - [ ] Description
  - [ ] Keywords
- [ ] Configure environment variables
  - [ ] `NEXT_PUBLIC_API_URL` (for future backend)
  - [ ] Add `.env.local` for local development
- [ ] Review `vercel.json` settings
- [ ] Update contact information throughout site

## Testing - Local

- [ ] `npm install` runs successfully
- [ ] `npm run dev` starts without errors
- [ ] Landing page loads at `localhost:3000`
- [ ] Navigation works (header links)
- [ ] "Submit Your Case" button navigates to `/intake`
- [ ] Intake form displays correctly
- [ ] Form validation works:
  - [ ] Empty fields show errors
  - [ ] Invalid email format rejected
  - [ ] Phone number validation works
  - [ ] Date picker works
  - [ ] All dropdowns populate
  - [ ] Checkboxes toggle correctly
- [ ] Form submission works:
  - [ ] Valid submission shows success message
  - [ ] Submission logged in console
  - [ ] Can submit multiple times
- [ ] Mobile responsive:
  - [ ] Test at 320px width (small mobile)
  - [ ] Test at 768px width (tablet)
  - [ ] Test at 1024px width (desktop)
- [ ] Footer displays correctly
- [ ] Disclaimers are visible
- [ ] `npm run build` completes successfully
- [ ] `npm run lint` passes with no errors

## Testing - Production (After Deploy)

- [ ] Site loads on production URL
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] All pages accessible
- [ ] Form submission works
- [ ] Check browser console for errors
- [ ] Test on multiple devices:
  - [ ] iPhone/iOS Safari
  - [ ] Android/Chrome
  - [ ] Desktop Chrome
  - [ ] Desktop Firefox
  - [ ] Desktop Safari
  - [ ] Desktop Edge
- [ ] Run Lighthouse audit:
  - [ ] Performance: 90+
  - [ ] Accessibility: 90+
  - [ ] Best Practices: 90+
  - [ ] SEO: 90+

## Deployment

- [ ] Code pushed to GitHub/GitLab
- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Root directory set to `landing-page`
- [ ] Environment variables configured in Vercel
- [ ] Build and deploy successful
- [ ] Production URL working

## Domain Setup (If Using Custom Domain)

- [ ] Domain purchased
- [ ] DNS records configured
- [ ] Domain added in Vercel
- [ ] SSL certificate issued (automatic)
- [ ] www redirect configured (optional)
- [ ] Domain propagation complete (24-48 hours)

## Monitoring & Analytics

- [ ] Vercel Analytics enabled
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Uptime monitoring setup (optional)
- [ ] Google Analytics added (optional)
- [ ] Form submission tracking configured

## Legal & Compliance

- [ ] Attorney reviewed all disclaimers
- [ ] Privacy policy drafted (link in footer)
- [ ] Terms of service drafted (optional)
- [ ] GDPR compliance considered (if applicable)
- [ ] Attorney advertising rules verified
- [ ] Client consent language approved
- [ ] Fee-sharing disclosure language approved

## Documentation

- [x] README.md complete
- [x] DEPLOYMENT.md complete
- [x] QUICKSTART.md complete
- [x] INTEGRATION.md complete
- [ ] Internal runbook created (optional)
- [ ] Training materials for staff (if needed)

## Integration Preparation (Phase 2)

- [ ] Database provider chosen (Supabase/Airtable)
- [ ] Database account created
- [ ] Schema designed (see INTEGRATION.md)
- [ ] API keys secured
- [ ] Connection tested locally

## Partner Communications

- [ ] Partner firms identified
- [ ] Referral agreements drafted
- [ ] Partner onboarding process defined
- [ ] Communication templates prepared
- [ ] Partner portal planned (future)

## Marketing & Launch

- [ ] Google Ads campaign prepared
- [ ] Landing page A/B tests planned (optional)
- [ ] Email templates for client communication
- [ ] Social media graphics created
- [ ] Press release/announcement (if applicable)
- [ ] Internal team briefed

## Post-Launch Tasks

- [ ] Monitor form submissions daily (first week)
- [ ] Check error logs regularly
- [ ] Review analytics weekly
- [ ] Collect user feedback
- [ ] Iterate on conversion optimization
- [ ] Plan Phase 2 implementation

## Emergency Contacts

```
Developer Support: [Your contact]
Hosting Support: support@vercel.com
Domain Support: [Your registrar]
Legal Counsel: [Attorney contact]
```

## Rollback Plan

If critical issues arise:
1. Access Vercel dashboard
2. Go to Deployments
3. Find last working deployment
4. Click "Promote to Production"
5. Notify team of rollback

---

## Quick Launch Path (Minimum Viable)

For fastest path to production, focus on these essentials:

1. [ ] Test locally (`npm run dev`)
2. [ ] Add favicon (basic)
3. [ ] Update contact info
4. [ ] Attorney approval on disclaimers
5. [ ] Deploy to Vercel
6. [ ] Test production form submission
7. [ ] Monitor for first week

Everything else can be added iteratively!

---

**Last Updated:** Ready for production deployment  
**Next Review:** After deployment

