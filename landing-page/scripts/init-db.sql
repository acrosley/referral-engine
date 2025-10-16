-- Vercel Postgres Database Schema for Crosley Referral Engine
-- This script initializes the database schema for the referral engine

-- Main case submissions table
CREATE TABLE IF NOT EXISTS case_submissions (
  id SERIAL PRIMARY KEY,
  submission_id VARCHAR(50) UNIQUE NOT NULL,
  
  -- Contact Information
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  
  -- Incident Details
  incident_type VARCHAR(50) NOT NULL,
  incident_date DATE NOT NULL,
  incident_location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  
  -- Injury Information
  injury_severity VARCHAR(50) NOT NULL,
  medical_treatment BOOLEAN DEFAULT false,
  hospitalized BOOLEAN DEFAULT false,
  
  -- Insurance & Legal Status
  has_insurance BOOLEAN DEFAULT false,
  insurance_provider VARCHAR(255),
  has_attorney BOOLEAN DEFAULT false,
  
  -- Submission Metadata
  submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'web_form',
  user_agent TEXT,
  ip_address VARCHAR(50),
  
  -- Processing Status & AI Scoring
  status VARCHAR(50) DEFAULT 'pending',
  ai_score INTEGER,
  keeper_grade VARCHAR(10),
  score_calculated_at TIMESTAMP,
  
  -- Referral Routing
  assigned_firm_id INTEGER REFERENCES partner_firms(id),
  assigned_at TIMESTAMP,
  referral_fee_amount DECIMAL(10, 2),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Partner firms table for referral routing
CREATE TABLE IF NOT EXISTS partner_firms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(100),
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  specialties TEXT[], -- Array of incident types they handle
  min_keeper_grade VARCHAR(10), -- Minimum grade they accept (A, B, C, D)
  capacity INTEGER DEFAULT 10, -- Monthly capacity
  acceptance_rate DECIMAL(5, 2), -- Historical acceptance percentage
  referral_fee_percentage DECIMAL(5, 2), -- 25-33%
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_submissions_status ON case_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON case_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON case_submissions(email);
CREATE INDEX IF NOT EXISTS idx_submissions_keeper_grade ON case_submissions(keeper_grade);
CREATE INDEX IF NOT EXISTS idx_submissions_assigned_firm ON case_submissions(assigned_firm_id);
CREATE INDEX IF NOT EXISTS idx_partner_firms_active ON partner_firms(active);

-- Comments for documentation
COMMENT ON TABLE case_submissions IS 'Stores all case submissions from the intake form';
COMMENT ON TABLE partner_firms IS 'Partner law firms that receive referrals';
COMMENT ON COLUMN case_submissions.submission_id IS 'Unique human-readable identifier (e.g., SUB-L2K3N4-ABC123)';
COMMENT ON COLUMN case_submissions.status IS 'Workflow status: pending → qualified → assigned → contacted → signed/rejected';
COMMENT ON COLUMN case_submissions.ai_score IS 'AI-calculated score (0-100) for case quality';
COMMENT ON COLUMN case_submissions.keeper_grade IS 'Letter grade (A/B/C/D) based on AI score';
COMMENT ON COLUMN partner_firms.specialties IS 'Array of incident types this firm handles';
COMMENT ON COLUMN partner_firms.min_keeper_grade IS 'Minimum grade this firm will accept (A, B, C, D)';
