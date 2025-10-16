import nodemailer from 'nodemailer';
import { CaseSubmission, PartnerFirm } from './db';

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Email service class
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize email transporter with environment variables
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    });
  }

  /**
   * Send client confirmation email
   */
  async sendClientConfirmation(submission: CaseSubmission): Promise<boolean> {
    try {
      const fromAddress = process.env.SMTP_FROM || 'referrals@crosleylawgroup.com';
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://acrosley-referral-engine.vercel.app';
      
      const mailOptions = {
        from: `"Crosley Referral Law Group" <${fromAddress}>`,
        to: submission.email,
        subject: 'Your Case Submission - Next Steps',
        html: this.generateClientEmailHTML(submission, appUrl),
        text: this.generateClientEmailText(submission, appUrl)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Client confirmation email sent:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending client confirmation email:', error);
      return false;
    }
  }

  /**
   * Send partner firm notification email
   */
  async sendPartnerNotification(
    submission: CaseSubmission, 
    partnerFirm: PartnerFirm
  ): Promise<boolean> {
    try {
      const fromAddress = process.env.SMTP_FROM || 'referrals@crosleylawgroup.com';
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://acrosley-referral-engine.vercel.app';
      
      const mailOptions = {
        from: `"Crosley Referral Engine" <${fromAddress}>`,
        to: partnerFirm.contact_email,
        subject: `New Case Referral - ${submission.incident_type} - Grade ${submission.keeper_grade}`,
        html: this.generatePartnerEmailHTML(submission, partnerFirm, appUrl),
        text: this.generatePartnerEmailText(submission, partnerFirm, appUrl)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Partner notification email sent:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending partner notification email:', error);
      return false;
    }
  }

  /**
   * Generate HTML content for client confirmation email
   */
  private generateClientEmailHTML(submission: CaseSubmission, appUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Case Submission Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f8fafc; }
          .highlight { background-color: #dbeafe; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; color: #64748b; }
          .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Crosley Referral Law Group</h1>
          <p>Your Case Submission Has Been Received</p>
        </div>
        
        <div class="content">
          <p>Dear ${submission.full_name},</p>
          
          <p>Thank you for submitting your case information to Crosley Referral Law Group. We have received your submission and are currently reviewing the details you provided.</p>
          
          <div class="highlight">
            <h3>Your Submission Details</h3>
            <p><strong>Submission ID:</strong> ${submission.submission_id}</p>
            <p><strong>Incident Type:</strong> ${submission.incident_type}</p>
            <p><strong>Submission Date:</strong> ${new Date(submission.submitted_at).toLocaleDateString()}</p>
          </div>
          
          <h3>What Happens Next?</h3>
          <p>Our team will carefully review your case details and match you with a qualified attorney from our network of experienced personal injury lawyers. Here's what you can expect:</p>
          
          <ol>
            <li><strong>Case Review:</strong> Our team will analyze your case details and determine the best legal approach</li>
            <li><strong>Attorney Matching:</strong> We'll connect you with an appropriate attorney who specializes in your type of case</li>
            <li><strong>Initial Consultation:</strong> The assigned attorney will contact you directly to discuss your case in detail</li>
            <li><strong>Case Development:</strong> If you choose to proceed, the attorney will guide you through the legal process</li>
          </ol>
          
          <h3>Timeline Expectations</h3>
          <p>You can expect to hear from an attorney within 1-2 business days. If you have an urgent legal matter, please don't hesitate to contact us directly.</p>
          
          <h3>Important Information</h3>
          <p>Please keep your submission ID (${submission.submission_id}) for your records. You may be asked for this number when speaking with your assigned attorney.</p>
          
          <p>If you have any questions about your submission or need to provide additional information, please contact us at (555) 123-4567 or reply to this email.</p>
          
          <p>We appreciate your trust in Crosley Referral Law Group and look forward to helping you with your legal needs.</p>
        </div>
        
        <div class="footer">
          <p><strong>Crosley Referral Law Group, PLLC</strong></p>
          <p>Phone: (555) 123-4567 | Email: referrals@crosleylawgroup.com</p>
          <p>This email was sent regarding your case submission. Please keep this information for your records.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate text content for client confirmation email
   */
  private generateClientEmailText(submission: CaseSubmission, appUrl: string): string {
    return `
Crosley Referral Law Group - Case Submission Confirmation

Dear ${submission.full_name},

Thank you for submitting your case information to Crosley Referral Law Group. We have received your submission and are currently reviewing the details you provided.

YOUR SUBMISSION DETAILS:
- Submission ID: ${submission.submission_id}
- Incident Type: ${submission.incident_type}
- Submission Date: ${new Date(submission.submitted_at).toLocaleDateString()}

WHAT HAPPENS NEXT?
Our team will carefully review your case details and match you with a qualified attorney from our network of experienced personal injury lawyers.

1. Case Review: Our team will analyze your case details and determine the best legal approach
2. Attorney Matching: We'll connect you with an appropriate attorney who specializes in your type of case
3. Initial Consultation: The assigned attorney will contact you directly to discuss your case in detail
4. Case Development: If you choose to proceed, the attorney will guide you through the legal process

TIMELINE EXPECTATIONS:
You can expect to hear from an attorney within 1-2 business days. If you have an urgent legal matter, please don't hesitate to contact us directly.

IMPORTANT INFORMATION:
Please keep your submission ID (${submission.submission_id}) for your records. You may be asked for this number when speaking with your assigned attorney.

If you have any questions about your submission or need to provide additional information, please contact us at (555) 123-4567 or reply to this email.

We appreciate your trust in Crosley Referral Law Group and look forward to helping you with your legal needs.

Best regards,
Crosley Referral Law Group, PLLC
Phone: (555) 123-4567
Email: referrals@crosleylawgroup.com

This email was sent regarding your case submission. Please keep this information for your records.
    `;
  }

  /**
   * Generate HTML content for partner notification email
   */
  private generatePartnerEmailHTML(
    submission: CaseSubmission, 
    partnerFirm: PartnerFirm, 
    appUrl: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Case Referral</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f8fafc; }
          .case-details { background-color: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          .client-info { background-color: #dbeafe; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; }
          .scoring-info { background-color: #dcfce7; padding: 15px; border-left: 4px solid #22c55e; margin: 20px 0; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; color: #64748b; }
          .button { display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>New Case Referral</h1>
          <p>High-Priority Case Assignment</p>
        </div>
        
        <div class="content">
          <p>Dear ${partnerFirm.contact_name || 'Team'},</p>
          
          <p>We have a new case referral that matches your firm's expertise and capacity. This case has been pre-screened and scored by our AI system.</p>
          
          <div class="scoring-info">
            <h3>Case Scoring & Grade</h3>
            <p><strong>AI Score:</strong> ${submission.ai_score}/100</p>
            <p><strong>Keeper Grade:</strong> ${submission.keeper_grade}</p>
            <p><strong>Status:</strong> ${submission.status}</p>
            <p><strong>Referral Fee:</strong> ${submission.referral_fee_amount ? `$${submission.referral_fee_amount}` : 'To be determined'}</p>
          </div>
          
          <div class="case-details">
            <h3>Case Details</h3>
            <p><strong>Submission ID:</strong> ${submission.submission_id}</p>
            <p><strong>Incident Type:</strong> ${submission.incident_type}</p>
            <p><strong>Injury Severity:</strong> ${submission.injury_severity}</p>
            <p><strong>Incident Date:</strong> ${new Date(submission.incident_date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> ${submission.incident_location}</p>
            <p><strong>Medical Treatment:</strong> ${submission.medical_treatment ? 'Yes' : 'No'}</p>
            <p><strong>Hospitalized:</strong> ${submission.hospitalized ? 'Yes' : 'No'}</p>
            <p><strong>Insurance:</strong> ${submission.has_insurance ? 'Yes' : 'No'}</p>
            <p><strong>Current Attorney:</strong> ${submission.has_attorney ? 'Yes' : 'No'}</p>
          </div>
          
          <div class="client-info">
            <h3>Client Information</h3>
            <p><strong>Name:</strong> ${submission.full_name}</p>
            <p><strong>Email:</strong> ${submission.email}</p>
            <p><strong>Phone:</strong> ${submission.phone}</p>
            <p><strong>Submitted:</strong> ${new Date(submission.submitted_at).toLocaleString()}</p>
          </div>
          
          <h3>Case Description</h3>
          <p>${submission.description}</p>
          
          <h3>Next Steps</h3>
          <p>Please contact the client within 24 hours to discuss their case. If you accept this referral, please update the case status in our system.</p>
          
          <p>If you have any questions about this referral or need additional information, please contact our team at referrals@crosleylawgroup.com or (555) 123-4567.</p>
          
          <p>Thank you for being part of our referral network.</p>
        </div>
        
        <div class="footer">
          <p><strong>Crosley Referral Law Group, PLLC</strong></p>
          <p>Phone: (555) 123-4567 | Email: referrals@crosleylawgroup.com</p>
          <p>This referral was generated by our AI-powered case assessment system.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate text content for partner notification email
   */
  private generatePartnerEmailText(
    submission: CaseSubmission, 
    partnerFirm: PartnerFirm, 
    appUrl: string
  ): string {
    return `
NEW CASE REFERRAL - HIGH PRIORITY

Dear ${partnerFirm.contact_name || 'Team'},

We have a new case referral that matches your firm's expertise and capacity. This case has been pre-screened and scored by our AI system.

CASE SCORING & GRADE:
- AI Score: ${submission.ai_score}/100
- Keeper Grade: ${submission.keeper_grade}
- Status: ${submission.status}
- Referral Fee: ${submission.referral_fee_amount ? `$${submission.referral_fee_amount}` : 'To be determined'}

CASE DETAILS:
- Submission ID: ${submission.submission_id}
- Incident Type: ${submission.incident_type}
- Injury Severity: ${submission.injury_severity}
- Incident Date: ${new Date(submission.incident_date).toLocaleDateString()}
- Location: ${submission.incident_location}
- Medical Treatment: ${submission.medical_treatment ? 'Yes' : 'No'}
- Hospitalized: ${submission.hospitalized ? 'Yes' : 'No'}
- Insurance: ${submission.has_insurance ? 'Yes' : 'No'}
- Current Attorney: ${submission.has_attorney ? 'Yes' : 'No'}

CLIENT INFORMATION:
- Name: ${submission.full_name}
- Email: ${submission.email}
- Phone: ${submission.phone}
- Submitted: ${new Date(submission.submitted_at).toLocaleString()}

CASE DESCRIPTION:
${submission.description}

NEXT STEPS:
Please contact the client within 24 hours to discuss their case. If you accept this referral, please update the case status in our system.

If you have any questions about this referral or need additional information, please contact our team at referrals@crosleylawgroup.com or (555) 123-4567.

Thank you for being part of our referral network.

Best regards,
Crosley Referral Law Group, PLLC
Phone: (555) 123-4567
Email: referrals@crosleylawgroup.com

This referral was generated by our AI-powered case assessment system.
    `;
  }

  /**
   * Test email configuration
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email configuration is valid');
      return true;
    } catch (error) {
      console.error('Email configuration test failed:', error);
      return false;
    }
  }
}
