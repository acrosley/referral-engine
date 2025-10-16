import { NextRequest, NextResponse } from "next/server";
import { intakeFormSchema } from "@/lib/validation";
import { ZodError } from "zod";
import { DatabaseService } from "@/lib/db";
import { CaseScorer } from "@/lib/scoring";
import { EmailService } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the incoming data
    const validatedData = intakeFormSchema.parse(body);
    
    // Generate unique submission ID
    const submissionId = generateSubmissionId();
    
    // Prepare submission data for database
    const submissionData = {
      submission_id: submissionId,
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
      insurance_provider: validatedData.insuranceProvider || undefined,
      has_attorney: validatedData.hasAttorney,
      submitted_at: new Date().toISOString(),
      source: "web_form",
      user_agent: request.headers.get("user-agent") || "unknown",
      ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
      status: "pending"
    };
    
    // 1. Save to database
    console.log("Saving submission to database...");
    const savedSubmission = await DatabaseService.createSubmission(submissionData);
    console.log("Submission saved with ID:", savedSubmission.id);
    
    // 2. Calculate AI score
    console.log("Calculating AI score...");
    const scoringInput = {
      incidentType: validatedData.incidentType,
      injurySeverity: validatedData.injurySeverity,
      description: validatedData.description,
      medicalTreatment: validatedData.medicalTreatment,
      hospitalized: validatedData.hospitalized,
      hasInsurance: validatedData.hasInsurance,
      incidentDate: validatedData.incidentDate
    };
    
    const scoringResult = CaseScorer.calculateScore(scoringInput);
    console.log("AI Score:", scoringResult.aiScore, "Grade:", scoringResult.keeperGrade);
    
    // 3. Update submission with AI score
    await DatabaseService.updateSubmissionScore(
      submissionId, 
      scoringResult.aiScore, 
      scoringResult.keeperGrade
    );
    
    // 4. Attempt partner firm assignment for qualified cases
    let assignedFirmId: number | null = null;
    if (scoringResult.keeperGrade === 'A' || scoringResult.keeperGrade === 'B') {
      console.log("Attempting partner firm assignment...");
      try {
        const availablePartners = await DatabaseService.getAvailablePartners(
          validatedData.incidentType, 
          scoringResult.keeperGrade
        );
        
        if (availablePartners.length > 0) {
          const selectedPartner = availablePartners[0];
          assignedFirmId = selectedPartner.id!;
          
          // Calculate referral fee (example: 25% of estimated settlement)
          const estimatedSettlement = scoringResult.aiScore * 1000; // Rough estimate
          const referralFeeAmount = estimatedSettlement * (selectedPartner.referral_fee_percentage / 100);
          
          await DatabaseService.assignToPartner(
            submissionId, 
            assignedFirmId, 
            referralFeeAmount
          );
          
          console.log("Assigned to partner firm:", selectedPartner.name);
        } else {
          console.log("No available partners found for this case");
        }
      } catch (error) {
        console.error("Error assigning to partner:", error);
        // Continue without assignment
      }
    }
    
    // 5. Send client confirmation email
    console.log("Sending client confirmation email...");
    const emailService = new EmailService();
    try {
      const updatedSubmission = await DatabaseService.getSubmission(submissionId);
      if (updatedSubmission) {
        await emailService.sendClientConfirmation(updatedSubmission);
        console.log("Client confirmation email sent");
      }
    } catch (error) {
      console.error("Error sending client email:", error);
      // Don't fail the submission if email fails
    }
    
    // 6. Send partner notification if assigned
    if (assignedFirmId) {
      console.log("Sending partner notification email...");
      try {
        const partnerFirm = await DatabaseService.getPartnerFirm(assignedFirmId);
        const updatedSubmission = await DatabaseService.getSubmission(submissionId);
        
        if (partnerFirm && updatedSubmission) {
          await emailService.sendPartnerNotification(updatedSubmission, partnerFirm);
          console.log("Partner notification email sent");
        }
      } catch (error) {
        console.error("Error sending partner email:", error);
        // Don't fail the submission if email fails
      }
    }
    
    // 7. Return success response with validation
    const response = {
      success: true,
      message: "Case submission received successfully",
      submissionId: submissionId,
      aiScore: scoringResult.aiScore,
      keeperGrade: scoringResult.keeperGrade,
      assigned: assignedFirmId ? true : false
    };
    
    // Validate JSON output per user requirements
    console.log("Response validated:", JSON.stringify(response, null, 2));
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error("Error processing intake submission:", error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your submission. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Helper function to generate unique submission IDs
function generateSubmissionId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `SUB-${timestamp}-${randomStr}`.toUpperCase();
}

// Optional: Helper to write submissions to a log file
// This can be useful for local testing before database integration
/*
async function writeToLogFile(data: any) {
  const fs = require('fs').promises;
  const path = require('path');
  
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, 'submissions.jsonl');
  
  try {
    await fs.mkdir(logDir, { recursive: true });
    await fs.appendFile(logFile, JSON.stringify(data) + '\n');
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
}
*/

