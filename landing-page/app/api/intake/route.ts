import { NextRequest, NextResponse } from "next/server";
import { intakeFormSchema } from "@/lib/validation";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the incoming data
    const validatedData = intakeFormSchema.parse(body);
    
    // Add submission metadata
    const submissionData = {
      ...validatedData,
      submittedAt: new Date().toISOString(),
      submissionId: generateSubmissionId(),
      source: "web_form",
      userAgent: request.headers.get("user-agent") || "unknown",
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    };
    
    // Log the submission (in production, this would go to a database)
    console.log("=== NEW CASE SUBMISSION ===");
    console.log(JSON.stringify(submissionData, null, 2));
    console.log("===========================");
    
    // TODO: In Phase 2, send this data to:
    // 1. Database for storage (PostgreSQL/Supabase)
    // 2. FastAPI backend for AI scoring
    // 3. CRM system for tracking
    
    // For now, you could also write to a file for persistence
    // await writeToLogFile(submissionData);
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Case submission received successfully",
        submissionId: submissionData.submissionId,
      },
      { status: 200 }
    );
    
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

