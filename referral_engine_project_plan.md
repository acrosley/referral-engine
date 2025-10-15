# Personal Injury Referral Engine – Project File

## 1. Executive Overview

**Project Objective:**  
Develop a licensed-attorney-owned referral engine that sources, qualifies, and refers high-value personal injury (PI) cases to partner law firms while maintaining compliance with bar rules on fee-sharing and client consent.

**Proof-of-Concept (PoC) Duration:** 90 days  
**Initial Market:** Texas (expandable regionally)  
**Business Model:** Fee-sharing under Rule 1.04(f) (attorney-to-attorney referrals)

**Primary Goal:** Validate that the cost per keeper (signed case) can be held below one-third of the average referral fee income, establishing sustainable ROI and scalability.

---

## 2. Project Milestones

| Phase | Duration | Key Deliverables |
|--------|-----------|------------------|
| **Phase 1 – Legal & Structural Setup** | Weeks 1–2 | PLLC formation, EIN, IOLTA trust setup, malpractice coverage, ethics review |
| **Phase 2 – Technical Infrastructure** | Weeks 2–4 | CRM/ETL architecture, intake app (Gradio or FastAPI), AI case scoring module |
| **Phase 3 – Ad & Intake Pipeline** | Weeks 4–8 | Google LSA campaign, intake workflow, lead qualification dashboard |
| **Phase 4 – Referral Network Onboarding** | Weeks 6–9 | Three partner firms onboarded with Rule 1.04(f) referral agreements |
| **Phase 5 – Reporting & Validation** | Weeks 9–12 | KPI dashboard (Power BI), PoC report with ROI and keeper-grade distribution |

---

## 3. Infrastructure Stack

| Function | Stack / Platform |
|-----------|------------------|
| **Landing Pages & Ads** | Google LSA, Google Ads, Meta Ads |
| **Form Capture** | Next.js on Vercel (integrated with backend API) |
| **CRM / Data Store** | PostgreSQL + Supabase (or Airtable during PoC) |
| **AI Case Vetting** | Whisper STT + Gemma or Qwen-7B for text extraction and scoring |
| **ETL / Analytics** | Python (Pandas, SQLAlchemy), Power BI dashboard |
| **Automation & Routing** | FastAPI microservice to assign leads to partner firms |
| **Compliance** | DocuSign client consent, signed referral agreements, trust accounting ledger |

---

## 4. KPIs and Targets

| Metric | Target | Measurement Method |
|---------|---------|--------------------|
| Qualified Leads | 60–100 / month | CRM record count |
| Keeper Conversion | ≥ 20 % | Partner acceptance and signed retainer count |
| Avg Referral Fee | $3,000–$6,000 | Settlement share data |
| CPK (Cost per Keeper) | ≤ $1,000 | Ad spend + ops cost ÷ keepers |
| ROI | ≥ 3× | From financial sensitivity model |
| Partner Satisfaction | 90 %+ | Post-referral survey |

---

## 5. Workflow Diagram

```
[Ads/SEO/Referrals] → [Landing Page / Form / Call] → [AI Intake Summary] → [Human Verification] → [CRM Record w/ Keeper Grade] → [Referral Engine Router] → [Partner Firm] → [Status Updates + Dashboard]
```

---

## 6. Proof-of-Concept Financial Model

**Baseline Scenario (example):**
- Ad spend: $9,000/month  
- Qualified leads: 60  
- Keepers: 5  
- Avg settlement: $36,000  
- Contingency: 33.3%  
- Referral fee: 25%  
- Variable cost/lead: $25  
- Fixed overhead: $1,500  

**Outputs:**
- Avg referral fee per keeper: ~$3,000  
- Gross revenue: ~$15,000  
- Total costs: ~$12,000  
- Net profit: ~$3,000  
- ROI: ~25%  
- CPK: ~$2,400  

**Optimization Targets:**
- Improve keeper yield to 7–8/month  
- Blend in organic and medical referral sources to reduce ad dependency  
- Increase referral fee proportion through specialized case matching  

---

## 7. Compliance & Risk Controls

| Area | Safeguard |
|-------|------------|
| **Fee Sharing** | Written Rule 1.04(f) agreements, client consent letters |
| **Client Contact** | No legal advice given by referral entity; disclosure templates provided |
| **Advertising** | Bar-compliant ad copy; disclaimers in all media |
| **Privacy & Data** | HIPAA-aligned encryption, limited PHI collection |
| **Accounting** | Referral fees through IOLTA; independent CPA reconciliation |

---

## 8. Pilot Partner Framework

**Ideal Partners:**
- 2–3 PI firms with overflow capacity (auto/trucking/catastrophic focus)
- Demonstrated settlement record; open to revenue sharing

**Engagement Terms:**
- Referral fee: 25–33⅓ % of attorney’s contingency
- Case responsibility: joint participation, status updates every 30 days
- Pilot term: 90 days, renewable

---

## 9. Deliverables for PoC Completion

- Functional AI intake and grading pipeline
- Power BI report with 90-day ROI trend
- Signed referral agreements (minimum three firms)
- Compliance audit binder (templates, logs, trust account proof)
- Executive summary: keeper yield, ROI, and scalability potential

---

## 10. Post-PoC Expansion Path

| Objective | Timeframe | Strategy |
|------------|------------|-----------|
| **Regional Expansion** | Months 4–6 | Add bilingual intake, expand to nearby states |
| **Automation Scaling** | Months 6–9 | Integrate Twilio STT + AI auto-grading + routing rules |
| **Network Diversification** | Months 9–12 | Add medical and attorney-referral feeders |
| **Investor or Partner Pitch** | Month 12 | Use metrics and compliance binder as proof of viability |

---

## 11. Supporting Documents (to attach)
- Referral Agreement Template (Rule 1.04(f) compliant)
- Client Consent Template
- AI Intake Summary JSON Schema
- Data Logging & Privacy Policy
- Power BI Dashboard Screenshot / URL
- Ethics Counsel Letter (upon completion)

---

**Project Owner:** Andrew Crosley  
**Entity:** Crosley Referral Law Group, PLLC  
**Revision:** 1.0  
**Date:** 2025-10-14

