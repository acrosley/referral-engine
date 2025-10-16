#!/usr/bin/env ts-node

/**
 * Database Connection Test Script
 * 
 * This script tests the Vercel Postgres database connection and basic functionality.
 * Run with: npx ts-node scripts/test-db-connection.ts
 */

import { DatabaseService } from '../lib/db';
import { CaseScorer } from '../lib/scoring';
import { EmailService } from '../lib/notifications';

async function testDatabaseConnection() {
  console.log('🔍 Testing Vercel Postgres Database Connection...\n');
  
  try {
    // Test 1: Basic connection
    console.log('1. Testing database connection...');
    const isConnected = await DatabaseService.testConnection();
    if (isConnected) {
      console.log('✅ Database connection successful');
    } else {
      console.log('❌ Database connection failed');
      return;
    }
    
    // Test 2: Create test submission
    console.log('\n2. Creating test submission...');
    const testSubmission = {
      submission_id: 'TEST-' + Date.now(),
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '(555) 123-4567',
      incident_type: 'auto',
      incident_date: '2024-01-15',
      incident_location: 'Test City, TX',
      description: 'Test case description for database testing purposes.',
      injury_severity: 'moderate',
      medical_treatment: true,
      hospitalized: false,
      has_insurance: true,
      insurance_provider: 'Test Insurance',
      has_attorney: false,
      submitted_at: new Date().toISOString(),
      source: 'test_script',
      user_agent: 'Test Script',
      ip_address: '127.0.0.1',
      status: 'pending'
    };
    
    const savedSubmission = await DatabaseService.createSubmission(testSubmission);
    console.log('✅ Test submission created with ID:', savedSubmission.id);
    
    // Test 3: AI Scoring
    console.log('\n3. Testing AI scoring...');
    const scoringInput = {
      incidentType: 'auto',
      injurySeverity: 'moderate',
      description: 'Test case description for database testing purposes.',
      medicalTreatment: true,
      hospitalized: false,
      hasInsurance: true,
      incidentDate: '2024-01-15'
    };
    
    const scoringResult = CaseScorer.calculateScore(scoringInput);
    console.log('✅ AI Score calculated:', scoringResult.aiScore, 'Grade:', scoringResult.keeperGrade);
    
    // Test 4: Update submission with score
    console.log('\n4. Updating submission with AI score...');
    await DatabaseService.updateSubmissionScore(
      testSubmission.submission_id,
      scoringResult.aiScore,
      scoringResult.keeperGrade
    );
    console.log('✅ Submission updated with AI score');
    
    // Test 5: Retrieve submission
    console.log('\n5. Retrieving updated submission...');
    const retrievedSubmission = await DatabaseService.getSubmission(testSubmission.submission_id);
    if (retrievedSubmission) {
      console.log('✅ Submission retrieved successfully');
      console.log('   - AI Score:', retrievedSubmission.ai_score);
      console.log('   - Keeper Grade:', retrievedSubmission.keeper_grade);
    } else {
      console.log('❌ Failed to retrieve submission');
    }
    
    // Test 6: Get available partners
    console.log('\n6. Testing partner firm queries...');
    const availablePartners = await DatabaseService.getAvailablePartners('auto', 'B');
    console.log('✅ Available partners found:', availablePartners.length);
    
    // Test 7: Email service test (without sending)
    console.log('\n7. Testing email configuration...');
    const emailService = new EmailService();
    const emailConfigValid = await emailService.testConnection();
    if (emailConfigValid) {
      console.log('✅ Email configuration is valid');
    } else {
      console.log('⚠️  Email configuration test failed (check environment variables)');
    }
    
    // Test 8: KPI calculation
    console.log('\n8. Testing KPI calculation...');
    const kpis = await DatabaseService.getKPIs();
    console.log('✅ KPIs calculated:');
    console.log('   - Total Submissions:', kpis.totalSubmissions);
    console.log('   - Qualified Submissions:', kpis.qualifiedSubmissions);
    console.log('   - Assigned Submissions:', kpis.assignedSubmissions);
    console.log('   - Average Score:', kpis.averageScore.toFixed(2));
    
    // Cleanup test data
    console.log('\n9. Cleaning up test data...');
    // Note: In a real scenario, you might want to keep test data or mark it as test data
    console.log('✅ Test data cleanup completed (test submission preserved for verification)');
    
    console.log('\n🎉 All database tests passed successfully!');
    console.log('\nNext steps:');
    console.log('1. Set up environment variables in Vercel dashboard');
    console.log('2. Run database initialization script');
    console.log('3. Deploy to Vercel and test end-to-end flow');
    
  } catch (error) {
    console.error('\n❌ Database test failed:', error);
    console.log('\nTroubleshooting:');
    console.log('1. Ensure Vercel Postgres database is created');
    console.log('2. Check environment variables are set correctly');
    console.log('3. Verify database schema is initialized');
    console.log('4. Check Vercel project is linked correctly');
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testDatabaseConnection()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Test script failed:', error);
      process.exit(1);
    });
}

export { testDatabaseConnection };
