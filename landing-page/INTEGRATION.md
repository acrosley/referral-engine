# Integration Guide - Connecting to Backend Systems

This guide explains how to integrate the landing page with database, AI scoring, and routing systems as outlined in the Crosley Referral Engine project plan.

## Overview

The landing page is Phase 1 (c) of the project. The next integration phases are:

- **Phase 2:** Database/CRM setup (Supabase or Airtable)
- **Phase 3:** AI case scoring (FastAPI + ML models)  
- **Phase 4:** Referral routing engine
- **Phase 5:** Analytics and reporting

## Current Architecture

```
[User] → [Landing Page/Form] → [Next.js API Route] → [Console Log]
                                                          ↓
                                                    [To be connected...]
```

## Target Architecture

```
[User] → [Landing Page] → [Next.js API] → [FastAPI Backend]
                                               ├→ [PostgreSQL/Supabase]
                                               ├→ [AI Scoring Engine]
                                               └→ [Routing System]
```

---

## Phase 2: Database Integration

### Option A: Supabase (Recommended)

#### 1. Setup Supabase

```bash
# Install Supabase client
npm install @supabase/supabase-js
```

#### 2. Create Schema

```sql
-- Create case_submissions table
CREATE TABLE case_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id VARCHAR(50) UNIQUE NOT NULL,
  
  -- Contact Info
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  
  -- Incident Details
  incident_type VARCHAR(50) NOT NULL,
  incident_date DATE NOT NULL,
  incident_location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  
  -- Injury Info
  injury_severity VARCHAR(50) NOT NULL,
  medical_treatment BOOLEAN DEFAULT false,
  hospitalized BOOLEAN DEFAULT false,
  
  -- Insurance
  has_insurance BOOLEAN DEFAULT false,
  insurance_provider VARCHAR(255),
  has_attorney BOOLEAN DEFAULT false,
  
  -- Metadata
  submitted_at TIMESTAMP DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'web_form',
  user_agent TEXT,
  ip_address VARCHAR(50),
  
  -- Processing Status
  status VARCHAR(50) DEFAULT 'pending',
  ai_score INTEGER,
  keeper_grade VARCHAR(10),
  assigned_firm_id UUID,
  
  -- Indexes
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_submissions_status ON case_submissions(status);
CREATE INDEX idx_submissions_created ON case_submissions(created_at DESC);
CREATE INDEX idx_submissions_email ON case_submissions(email);
```

#### 3. Update API Route

```typescript
// app/api/intake/route.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
  // ... validation code ...
  
  // Insert into database
  const { data, error } = await supabase
    .from('case_submissions')
    .insert([{
      submission_id: submissionData.submissionId,
      full_name: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      incident_type: validatedData.incidentType,
      incident_date: validatedData.incidentDate,
      incident_location: validatedData.incidentLocation,
      description: validatedData.description,
      injury_severity: validatedData.injurySeverity,
      medical_treatment: validatedData.medicalTreatment,
      hospitalized: validatedData.hospitalized,
      has_insurance: validatedData.hasInsurance,
      insurance_provider: validatedData.insuranceProvider,
      has_attorney: validatedData.hasAttorney,
      submitted_at: submissionData.submittedAt,
      source: submissionData.source,
      user_agent: submissionData.userAgent,
      ip_address: submissionData.ipAddress,
      status: 'pending'
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Database error:', error);
    throw new Error('Failed to save submission');
  }
  
  return NextResponse.json({
    success: true,
    submissionId: data.submission_id
  });
}
```

#### 4. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...
```

### Option B: Airtable

```bash
npm install airtable
```

```typescript
// lib/airtable.ts
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID!);

export async function createSubmission(data: any) {
  return await base('Submissions').create([
    {
      fields: {
        'Submission ID': data.submissionId,
        'Full Name': data.fullName,
        'Email': data.email,
        'Phone': data.phone,
        'Incident Type': data.incidentType,
        'Incident Date': data.incidentDate,
        'Location': data.incidentLocation,
        'Description': data.description,
        'Injury Severity': data.injurySeverity,
        'Status': 'Pending Review'
      }
    }
  ]);
}
```

---

## Phase 3: AI Scoring Integration

### FastAPI Backend Setup

#### 1. Create FastAPI Service

```python
# backend/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai  # or use local model

app = FastAPI()

class CaseSubmission(BaseModel):
    submission_id: str
    description: str
    incident_type: str
    injury_severity: str
    # ... other fields

@app.post("/api/score-case")
async def score_case(submission: CaseSubmission):
    # AI scoring logic here
    score = calculate_keeper_score(submission)
    grade = assign_keeper_grade(score)
    
    return {
        "submission_id": submission.submission_id,
        "ai_score": score,
        "keeper_grade": grade,
        "recommended_action": "refer" if score > 70 else "review"
    }

def calculate_keeper_score(submission: CaseSubmission) -> int:
    # Implement scoring algorithm
    # Based on: severity, description quality, incident type, etc.
    score = 0
    
    # Severity scoring
    severity_scores = {
        "catastrophic": 40,
        "severe": 30,
        "moderate": 20,
        "minor": 10
    }
    score += severity_scores.get(submission.injury_severity, 0)
    
    # Incident type scoring
    type_scores = {
        "trucking": 30,
        "catastrophic": 30,
        "auto": 20,
        "workplace": 15,
        "other": 10
    }
    score += type_scores.get(submission.incident_type, 0)
    
    # Description quality (length, detail)
    if len(submission.description) > 100:
        score += 15
    elif len(submission.description) > 50:
        score += 10
    else:
        score += 5
    
    # Use AI for additional scoring
    # sentiment_score = analyze_sentiment(submission.description)
    # score += sentiment_score
    
    return min(score, 100)

def assign_keeper_grade(score: int) -> str:
    if score >= 80:
        return "A"
    elif score >= 60:
        return "B"
    elif score >= 40:
        return "C"
    else:
        return "D"
```

#### 2. Update Next.js API to Call FastAPI

```typescript
// app/api/intake/route.ts
export async function POST(request: NextRequest) {
  // ... validation and database insertion ...
  
  // Send to AI scoring service
  try {
    const scoringResponse = await fetch(
      `${process.env.FASTAPI_URL}/api/score-case`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: submissionData.submissionId,
          description: validatedData.description,
          incident_type: validatedData.incidentType,
          injury_severity: validatedData.injurySeverity,
          medical_treatment: validatedData.medicalTreatment,
          hospitalized: validatedData.hospitalized,
        })
      }
    );
    
    const scoringData = await scoringResponse.json();
    
    // Update database with AI score
    await supabase
      .from('case_submissions')
      .update({
        ai_score: scoringData.ai_score,
        keeper_grade: scoringData.keeper_grade,
        status: scoringData.keeper_grade === 'A' ? 'qualified' : 'pending'
      })
      .eq('submission_id', submissionData.submissionId);
    
  } catch (error) {
    console.error('AI scoring failed:', error);
    // Continue even if scoring fails
  }
  
  return NextResponse.json({ success: true });
}
```

---

## Phase 4: Referral Routing Engine

### Routing Logic

```typescript
// lib/routing.ts
interface PartnerFirm {
  id: string;
  name: string;
  specialties: string[];
  capacity: number;
  acceptance_rate: number;
  min_grade: string;
}

export async function assignToPartner(
  submission: CaseSubmission,
  keeperGrade: string
): Promise<string | null> {
  
  // Get available partner firms
  const partners = await getAvailablePartners(submission.incident_type);
  
  // Filter by grade requirements
  const qualifiedPartners = partners.filter(p => 
    gradeValue(keeperGrade) >= gradeValue(p.min_grade) &&
    p.capacity > 0
  );
  
  if (qualifiedPartners.length === 0) {
    return null;
  }
  
  // Sort by acceptance rate and capacity
  qualifiedPartners.sort((a, b) => 
    b.acceptance_rate - a.acceptance_rate
  );
  
  // Assign to best match
  const assignedFirm = qualifiedPartners[0];
  
  // Update database
  await supabase
    .from('case_submissions')
    .update({
      assigned_firm_id: assignedFirm.id,
      status: 'assigned',
      assigned_at: new Date().toISOString()
    })
    .eq('submission_id', submission.submissionId);
  
  // Notify partner firm
  await notifyPartnerFirm(assignedFirm, submission);
  
  return assignedFirm.id;
}

function gradeValue(grade: string): number {
  const values: { [key: string]: number } = {
    'A': 4, 'B': 3, 'C': 2, 'D': 1
  };
  return values[grade] || 0;
}
```

### Email Notification System

```typescript
// lib/notifications.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function notifyPartnerFirm(
  firm: PartnerFirm,
  submission: CaseSubmission
) {
  await transporter.sendMail({
    from: '"Crosley Referral Engine" <referrals@crosleylawgroup.com>',
    to: firm.contact_email,
    subject: `New Case Referral - ${submission.incident_type} - Grade ${submission.keeper_grade}`,
    html: `
      <h2>New Case Referral</h2>
      <p><strong>Submission ID:</strong> ${submission.submissionId}</p>
      <p><strong>Incident Type:</strong> ${submission.incident_type}</p>
      <p><strong>Keeper Grade:</strong> ${submission.keeper_grade}</p>
      <p><strong>Injury Severity:</strong> ${submission.injury_severity}</p>
      <p><strong>AI Score:</strong> ${submission.ai_score}/100</p>
      
      <h3>Client Information</h3>
      <p><strong>Name:</strong> ${submission.fullName}</p>
      <p><strong>Phone:</strong> ${submission.phone}</p>
      <p><strong>Email:</strong> ${submission.email}</p>
      
      <h3>Case Details</h3>
      <p><strong>Date:</strong> ${submission.incident_date}</p>
      <p><strong>Location:</strong> ${submission.incident_location}</p>
      <p><strong>Description:</strong> ${submission.description}</p>
      
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/cases/${submission.submissionId}">
        View Full Case Details
      </a></p>
    `,
  });
}

export async function notifyClient(submission: CaseSubmission) {
  await transporter.sendMail({
    from: '"Crosley Referral Law Group" <info@crosleylawgroup.com>',
    to: submission.email,
    subject: 'Your Case Submission - Next Steps',
    html: `
      <h2>Thank You for Your Submission</h2>
      <p>Dear ${submission.fullName},</p>
      
      <p>We have received your case information and are currently reviewing it. 
      Your submission ID is: <strong>${submission.submissionId}</strong></p>
      
      <p>Based on the details you provided, we will match you with a qualified 
      attorney from our network within 1-2 business days.</p>
      
      <h3>What Happens Next?</h3>
      <ol>
        <li>Our team will review your case details</li>
        <li>We'll match you with an appropriate partner attorney</li>
        <li>The attorney will contact you directly to discuss your case</li>
        <li>You'll receive updates on your case status</li>
      </ol>
      
      <p>If you have any questions, please don't hesitate to contact us at 
      (555) 123-4567 or reply to this email.</p>
      
      <p>Best regards,<br>
      Crosley Referral Law Group, PLLC</p>
    `,
  });
}
```

---

## Complete Integration Example

### Updated API Route (Full Integration)

```typescript
// app/api/intake/route.ts
import { NextRequest, NextResponse } from "next/server";
import { intakeFormSchema } from "@/lib/validation";
import { createClient } from '@supabase/supabase-js';
import { assignToPartner } from '@/lib/routing';
import { notifyClient, notifyPartnerFirm } from '@/lib/notifications';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // 1. Validate input
    const body = await request.json();
    const validatedData = intakeFormSchema.parse(body);
    
    const submissionId = generateSubmissionId();
    
    // 2. Save to database
    const { data: submission, error: dbError } = await supabase
      .from('case_submissions')
      .insert([{ /* ... submission data ... */ }])
      .select()
      .single();
    
    if (dbError) throw dbError;
    
    // 3. Get AI score
    const scoringResponse = await fetch(
      `${process.env.FASTAPI_URL}/api/score-case`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: submissionId,
          ...validatedData
        })
      }
    );
    
    const { ai_score, keeper_grade } = await scoringResponse.json();
    
    // 4. Update with AI score
    await supabase
      .from('case_submissions')
      .update({ ai_score, keeper_grade })
      .eq('submission_id', submissionId);
    
    // 5. Assign to partner if qualified
    if (keeper_grade === 'A' || keeper_grade === 'B') {
      const firmId = await assignToPartner(submission, keeper_grade);
      
      if (firmId) {
        // 6. Send notifications
        await notifyClient(submission);
        // Partner notification sent in assignToPartner
      }
    }
    
    return NextResponse.json({
      success: true,
      submissionId,
      message: "Your case has been submitted successfully"
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
```

---

## Environment Variables (Complete List)

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=xxxxx

# AI Backend
FASTAPI_URL=https://api.yourdomain.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application
NEXT_PUBLIC_APP_URL=https://cases.crosleylawgroup.com
```

---

## Testing Integration

### 1. Test Database Connection
```bash
curl -X POST http://localhost:3000/api/intake \
  -H "Content-Type: application/json" \
  -d @test-submission.json
```

### 2. Test AI Scoring
```bash
curl -X POST http://localhost:8000/api/score-case \
  -H "Content-Type: application/json" \
  -d '{"submission_id": "TEST-123", ...}'
```

### 3. Test End-to-End
1. Submit form on landing page
2. Check database for new record
3. Verify AI score was added
4. Check partner assignment
5. Confirm emails sent

---

## Next Steps

1. ✅ Landing page deployed
2. 🔄 Set up Supabase/Airtable (Phase 2)
3. 🔄 Build FastAPI scoring service (Phase 3)
4. 🔄 Implement routing engine (Phase 4)
5. 🔄 Add analytics dashboard (Phase 5)

---

**Questions?** Refer to the main project plan in `../referral_engine_project_plan.md`

