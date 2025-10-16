import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function testIntakeAPI() {
  try {
    console.log('Testing intake form API endpoint...');
    
    // Sample form data
    const testData = {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      incidentType: "auto",
      incidentDate: "2024-10-01",
      incidentLocation: "Dallas, TX",
      description: "Rear-ended at a red light by a distracted driver. Minor whiplash and back pain.",
      injurySeverity: "moderate",
      medicalTreatment: true,
      hospitalized: false,
      hasInsurance: true,
      insuranceProvider: "State Farm",
      hasAttorney: false,
      consentToContact: true,
      consentToReferral: true,
      acknowledgeDisclaimer: true
    };

    console.log('Submitting test data:', JSON.stringify(testData, null, 2));

    const response = await fetch('http://localhost:3000/api/intake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API request failed:', response.status, errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ API response:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('🎉 Intake form API test successful!');
      console.log(`Submission ID: ${result.submissionId}`);
      console.log(`AI Score: ${result.aiScore}`);
      console.log(`Keeper Grade: ${result.keeperGrade}`);
      console.log(`Assigned to Partner: ${result.assigned ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ API returned error:', result.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.log('Make sure the development server is running on http://localhost:3000');
  }
}

// Wait a moment for the server to start, then run the test
setTimeout(() => {
  testIntakeAPI();
}, 3000);
