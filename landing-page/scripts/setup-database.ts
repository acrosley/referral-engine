import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function setupDatabase() {
  try {
    console.log('Setting up Neon database tables...');
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set');
      return;
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Create comments table for the demo
    console.log('Creating comments table...');
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Comments table created');

    // Create case_submissions table
    console.log('Creating case_submissions table...');
    await sql`
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
      )
    `;
    console.log('✅ Case submissions table created');

    // Create partner_firms table
    console.log('Creating partner_firms table...');
    await sql`
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
      )
    `;
    console.log('✅ Partner firms table created');

    // Create indexes
    console.log('Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_case_submissions_status ON case_submissions(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_case_submissions_keeper_grade ON case_submissions(keeper_grade)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_case_submissions_assigned_firm ON case_submissions(assigned_firm_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_case_submissions_created_at ON case_submissions(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_partner_firms_active ON partner_firms(active)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_partner_firms_specialties ON partner_firms USING GIN(specialties)`;
    console.log('✅ Indexes created');

    // Insert sample partner firms
    console.log('Inserting sample partner firms...');
    await sql`
      INSERT INTO partner_firms (name, contact_name, contact_email, contact_phone, specialties, min_keeper_grade, capacity, acceptance_rate, referral_fee_percentage) VALUES
      ('Smith & Associates', 'John Smith', 'john@smithlaw.com', '(555) 123-4567', ARRAY['auto', 'trucking', 'workplace'], 'B', 50, 0.85, 15.0),
      ('Johnson Legal Group', 'Sarah Johnson', 'sarah@johnsonlegal.com', '(555) 234-5678', ARRAY['auto', 'catastrophic'], 'A', 30, 0.90, 20.0),
      ('Williams Law Firm', 'Mike Williams', 'mike@williamslaw.com', '(555) 345-6789', ARRAY['catastrophic', 'workplace'], 'A', 25, 0.95, 25.0)
      ON CONFLICT DO NOTHING
    `;
    console.log('✅ Sample partner firms inserted');

    // Create triggers for updated_at
    console.log('Creating triggers...');
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    await sql`
      CREATE TRIGGER update_case_submissions_updated_at 
          BEFORE UPDATE ON case_submissions 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;

    await sql`
      CREATE TRIGGER update_partner_firms_updated_at 
          BEFORE UPDATE ON partner_firms 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `;
    console.log('✅ Triggers created');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('Your intake form is now ready to use with the Neon database.');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  }
}

// Run the setup
setupDatabase();
