import { neon } from '@neondatabase/serverless';

// TypeScript types matching the database schema
export interface CaseSubmission {
  id?: number;
  submission_id: string;
  full_name: string;
  email: string;
  phone: string;
  incident_type: string;
  incident_date: string;
  incident_location: string;
  description: string;
  injury_severity: string;
  medical_treatment: boolean;
  hospitalized: boolean;
  has_insurance: boolean;
  insurance_provider?: string;
  has_attorney: boolean;
  submitted_at: string;
  source: string;
  user_agent?: string;
  ip_address?: string;
  status: string;
  ai_score?: number;
  keeper_grade?: string;
  score_calculated_at?: string;
  assigned_firm_id?: number;
  assigned_at?: string;
  referral_fee_amount?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PartnerFirm {
  id?: number;
  name: string;
  contact_name?: string;
  contact_email: string;
  contact_phone?: string;
  specialties: string[];
  min_keeper_grade: string;
  capacity: number;
  acceptance_rate: number;
  referral_fee_percentage: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Database connection and query utilities
export class DatabaseService {
  private static getSql() {
    return neon(process.env.DATABASE_URL!);
  }

  /**
   * Create a new case submission
   */
  static async createSubmission(submission: Omit<CaseSubmission, 'id' | 'created_at' | 'updated_at'>): Promise<CaseSubmission> {
    try {
      const sql = this.getSql();
      const result = await sql`
        INSERT INTO case_submissions (
          submission_id, full_name, email, phone, incident_type, incident_date,
          incident_location, description, injury_severity, medical_treatment,
          hospitalized, has_insurance, insurance_provider, has_attorney,
          submitted_at, source, user_agent, ip_address, status
        ) VALUES (
          ${submission.submission_id}, ${submission.full_name}, ${submission.email},
          ${submission.phone}, ${submission.incident_type}, ${submission.incident_date},
          ${submission.incident_location}, ${submission.description}, ${submission.injury_severity},
          ${submission.medical_treatment}, ${submission.hospitalized}, ${submission.has_insurance},
          ${submission.insurance_provider || null}, ${submission.has_attorney},
          ${submission.submitted_at}, ${submission.source}, ${submission.user_agent || null},
          ${submission.ip_address || null}, ${submission.status}
        )
        RETURNING *
      `;
      
      return result[0] as CaseSubmission;
    } catch (error) {
      console.error('Error creating submission:', error);
      throw new Error('Failed to create case submission');
    }
  }

  /**
   * Update submission with AI score and keeper grade
   */
  static async updateSubmissionScore(
    submissionId: string, 
    aiScore: number, 
    keeperGrade: string
  ): Promise<void> {
    try {
      const sql = this.getSql();
      await sql`
        UPDATE case_submissions 
        SET ai_score = ${aiScore}, 
            keeper_grade = ${keeperGrade}, 
            score_calculated_at = NOW(),
            updated_at = NOW()
        WHERE submission_id = ${submissionId}
      `;
    } catch (error) {
      console.error('Error updating submission score:', error);
      throw new Error('Failed to update submission score');
    }
  }

  /**
   * Assign submission to a partner firm
   */
  static async assignToPartner(
    submissionId: string, 
    firmId: number, 
    referralFeeAmount?: number
  ): Promise<void> {
    try {
      const sql = this.getSql();
      await sql`
        UPDATE case_submissions 
        SET assigned_firm_id = ${firmId}, 
            assigned_at = NOW(),
            referral_fee_amount = ${referralFeeAmount || null},
            status = 'assigned',
            updated_at = NOW()
        WHERE submission_id = ${submissionId}
      `;
    } catch (error) {
      console.error('Error assigning to partner:', error);
      throw new Error('Failed to assign submission to partner');
    }
  }

  /**
   * Get submission by ID
   */
  static async getSubmission(submissionId: string): Promise<CaseSubmission | null> {
    try {
      const sql = this.getSql();
      const result = await sql`
        SELECT * FROM case_submissions 
        WHERE submission_id = ${submissionId}
      `;
      
      return result[0] as CaseSubmission || null;
    } catch (error) {
      console.error('Error getting submission:', error);
      throw new Error('Failed to retrieve submission');
    }
  }

  /**
   * Get available partner firms for assignment
   */
  static async getAvailablePartners(
    incidentType: string, 
    minGrade: string
  ): Promise<PartnerFirm[]> {
    try {
      const sql = this.getSql();
      const result = await sql`
        SELECT * FROM partner_firms 
        WHERE active = true 
        AND ${incidentType} = ANY(specialties)
        AND min_keeper_grade <= ${minGrade}
        AND capacity > 0
        ORDER BY acceptance_rate DESC, capacity DESC
      `;
      
      return result as PartnerFirm[];
    } catch (error) {
      console.error('Error getting available partners:', error);
      throw new Error('Failed to retrieve available partners');
    }
  }

  /**
   * Get partner firm by ID
   */
  static async getPartnerFirm(firmId: number): Promise<PartnerFirm | null> {
    try {
      const sql = this.getSql();
      const result = await sql`
        SELECT * FROM partner_firms 
        WHERE id = ${firmId} AND active = true
      `;
      
      return result[0] as PartnerFirm || null;
    } catch (error) {
      console.error('Error getting partner firm:', error);
      throw new Error('Failed to retrieve partner firm');
    }
  }

  /**
   * Get recent submissions for admin dashboard
   */
  static async getRecentSubmissions(limit: number = 50): Promise<CaseSubmission[]> {
    try {
      const sql = this.getSql();
      const result = await sql`
        SELECT * FROM case_submissions 
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `;
      
      return result as CaseSubmission[];
    } catch (error) {
      console.error('Error getting recent submissions:', error);
      throw new Error('Failed to retrieve recent submissions');
    }
  }

  /**
   * Get submissions by status
   */
  static async getSubmissionsByStatus(status: string): Promise<CaseSubmission[]> {
    try {
      const sql = this.getSql();
      const result = await sql`
        SELECT * FROM case_submissions 
        WHERE status = ${status}
        ORDER BY created_at DESC
      `;
      
      return result as CaseSubmission[];
    } catch (error) {
      console.error('Error getting submissions by status:', error);
      throw new Error('Failed to retrieve submissions by status');
    }
  }

  /**
   * Get submissions by keeper grade
   */
  static async getSubmissionsByGrade(grade: string): Promise<CaseSubmission[]> {
    try {
      const sql = this.getSql();
      const result = await sql`
        SELECT * FROM case_submissions 
        WHERE keeper_grade = ${grade}
        ORDER BY created_at DESC
      `;
      
      return result as CaseSubmission[];
    } catch (error) {
      console.error('Error getting submissions by grade:', error);
      throw new Error('Failed to retrieve submissions by grade');
    }
  }

  /**
   * Calculate KPIs for analytics
   */
  static async getKPIs(): Promise<{
    totalSubmissions: number;
    qualifiedSubmissions: number;
    assignedSubmissions: number;
    averageScore: number;
    gradeDistribution: Record<string, number>;
  }> {
    try {
      const sql = this.getSql();
      
      // Total submissions
      const totalResult = await sql`SELECT COUNT(*) as count FROM case_submissions`;
      const totalSubmissions = parseInt(totalResult[0].count);

      // Qualified submissions (A or B grade)
      const qualifiedResult = await sql`
        SELECT COUNT(*) as count FROM case_submissions 
        WHERE keeper_grade IN ('A', 'B')
      `;
      const qualifiedSubmissions = parseInt(qualifiedResult[0].count);

      // Assigned submissions
      const assignedResult = await sql`
        SELECT COUNT(*) as count FROM case_submissions 
        WHERE assigned_firm_id IS NOT NULL
      `;
      const assignedSubmissions = parseInt(assignedResult[0].count);

      // Average score
      const avgResult = await sql`
        SELECT AVG(ai_score) as avg_score FROM case_submissions 
        WHERE ai_score IS NOT NULL
      `;
      const averageScore = parseFloat(avgResult[0].avg_score) || 0;

      // Grade distribution
      const gradeResult = await sql`
        SELECT keeper_grade, COUNT(*) as count 
        FROM case_submissions 
        WHERE keeper_grade IS NOT NULL 
        GROUP BY keeper_grade
      `;
      const gradeDistribution = gradeResult.reduce((acc: Record<string, number>, row: any) => {
        acc[row.keeper_grade] = parseInt(row.count);
        return acc;
      }, {} as Record<string, number>);

      return {
        totalSubmissions,
        qualifiedSubmissions,
        assignedSubmissions,
        averageScore,
        gradeDistribution
      };
    } catch (error) {
      console.error('Error calculating KPIs:', error);
      throw new Error('Failed to calculate KPIs');
    }
  }

  /**
   * Test database connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      const sql = this.getSql();
      await sql`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}
