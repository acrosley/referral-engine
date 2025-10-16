-- Neon Database Setup Script
-- Run this in the Neon SQL Editor to set up your database tables

-- Create comments table for the demo
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create case_submissions table (for the referral engine)
CREATE TABLE IF NOT EXISTS case_submissions (
  id SERIAL PRIMARY KEY,
  submission_id VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  incident_type VARCHAR(100) NOT NULL,
  incident_date DATE NOT NULL,
  incident_location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  injury_severity VARCHAR(50) NOT NULL,
  medical_treatment BOOLEAN DEFAULT FALSE,
  hospitalized BOOLEAN DEFAULT FALSE,
  has_insurance BOOLEAN DEFAULT FALSE,
  insurance_provider VARCHAR(255),
  has_attorney BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(100) DEFAULT 'website',
  user_agent TEXT,
  ip_address INET,
  status VARCHAR(50) DEFAULT 'pending',
  ai_score DECIMAL(3,2),
  keeper_grade VARCHAR(1),
  score_calculated_at TIMESTAMP,
  assigned_firm_id INTEGER,
  assigned_at TIMESTAMP,
  referral_fee_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create partner_firms table
CREATE TABLE IF NOT EXISTS partner_firms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  specialties TEXT[] NOT NULL,
  min_keeper_grade VARCHAR(1) NOT NULL,
  capacity INTEGER DEFAULT 0,
  acceptance_rate DECIMAL(3,2) DEFAULT 0.0,
  referral_fee_percentage DECIMAL(5,2) DEFAULT 0.0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_case_submissions_status ON case_submissions(status);
CREATE INDEX IF NOT EXISTS idx_case_submissions_keeper_grade ON case_submissions(keeper_grade);
CREATE INDEX IF NOT EXISTS idx_case_submissions_assigned_firm ON case_submissions(assigned_firm_id);
CREATE INDEX IF NOT EXISTS idx_case_submissions_created_at ON case_submissions(created_at);

CREATE INDEX IF NOT EXISTS idx_partner_firms_active ON partner_firms(active);
CREATE INDEX IF NOT EXISTS idx_partner_firms_specialties ON partner_firms USING GIN(specialties);

-- Insert some sample partner firms
INSERT INTO partner_firms (name, contact_name, contact_email, contact_phone, specialties, min_keeper_grade, capacity, acceptance_rate, referral_fee_percentage) VALUES
('Smith & Associates', 'John Smith', 'john@smithlaw.com', '(555) 123-4567', ARRAY['car_accident', 'slip_fall', 'medical_malpractice'], 'B', 50, 0.85, 15.0),
('Johnson Legal Group', 'Sarah Johnson', 'sarah@johnsonlegal.com', '(555) 234-5678', ARRAY['car_accident', 'workplace_injury'], 'A', 30, 0.90, 20.0),
('Williams Law Firm', 'Mike Williams', 'mike@williamslaw.com', '(555) 345-6789', ARRAY['medical_malpractice', 'product_liability'], 'A', 25, 0.95, 25.0)
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_case_submissions_updated_at 
    BEFORE UPDATE ON case_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_firms_updated_at 
    BEFORE UPDATE ON partner_firms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
