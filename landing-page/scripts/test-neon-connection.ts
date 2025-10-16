import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function testNeonConnection() {
  try {
    console.log('Testing Neon database connection...');
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is not set');
      console.log('Please set your DATABASE_URL in your .env.local file');
      return;
    }

    console.log('✅ DATABASE_URL is set');
    
    // Create connection
    const sql = neon(process.env.DATABASE_URL);
    
    // Test basic connection
    console.log('Testing basic connection...');
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Basic connection successful:', result);
    
    // Test if comments table exists
    console.log('Testing comments table...');
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'comments'
      ) as table_exists
    `;
    console.log('Comments table exists:', tableCheck[0].table_exists);
    
    // Test if case_submissions table exists
    console.log('Testing case_submissions table...');
    const caseTableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'case_submissions'
      ) as table_exists
    `;
    console.log('Case submissions table exists:', caseTableCheck[0].table_exists);
    
    // Test inserting a comment
    console.log('Testing comment insertion...');
    const testComment = `Test comment at ${new Date().toISOString()}`;
    await sql`INSERT INTO comments (comment) VALUES (${testComment})`;
    console.log('✅ Comment insertion successful');
    
    // Test retrieving comments
    console.log('Testing comment retrieval...');
    const comments = await sql`SELECT * FROM comments ORDER BY created_at DESC LIMIT 5`;
    console.log('✅ Recent comments:', comments);
    
    console.log('\n🎉 All tests passed! Your Neon database is working correctly.');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    console.log('\nTroubleshooting steps:');
    console.log('1. Make sure your DATABASE_URL is correct');
    console.log('2. Run the neon-setup.sql script in your Neon SQL Editor');
    console.log('3. Check that your Neon database is active');
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testNeonConnection();
}

export { testNeonConnection };
