-- Seed script for partner firms
-- This creates initial partner firms for the pilot program

-- Insert sample partner firms matching the pilot framework
INSERT INTO partner_firms (
  name, 
  contact_name, 
  contact_email, 
  contact_phone, 
  specialties, 
  min_keeper_grade, 
  capacity, 
  acceptance_rate, 
  referral_fee_percentage, 
  active
) VALUES 
(
  'Smith & Associates Personal Injury',
  'John Smith',
  'john@smithlaw.com',
  '(555) 123-4567',
  ARRAY['auto', 'trucking', 'catastrophic'],
  'B',
  15,
  85.5,
  25.0,
  true
),
(
  'Johnson Legal Group',
  'Sarah Johnson',
  'sarah@johnsonlegal.com',
  '(555) 234-5678',
  ARRAY['trucking', 'catastrophic', 'workplace'],
  'A',
  10,
  92.0,
  30.0,
  true
),
(
  'Davis & Partners',
  'Michael Davis',
  'mike@davispartners.com',
  '(555) 345-6789',
  ARRAY['auto', 'workplace', 'other'],
  'C',
  20,
  78.0,
  25.0,
  true
);

-- Verify the data was inserted
SELECT 
  id,
  name,
  specialties,
  min_keeper_grade,
  capacity,
  acceptance_rate,
  referral_fee_percentage
FROM partner_firms 
WHERE active = true
ORDER BY acceptance_rate DESC;
