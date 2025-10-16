// AI Scoring Algorithm for Case Quality Assessment
// Implements keeper score calculation based on multiple factors

export interface ScoringInput {
  incidentType: string;
  injurySeverity: string;
  description: string;
  medicalTreatment: boolean;
  hospitalized: boolean;
  hasInsurance: boolean;
  incidentDate: string;
}

export interface ScoringResult {
  aiScore: number;
  keeperGrade: string;
  scoreBreakdown: {
    severityScore: number;
    typeScore: number;
    descriptionScore: number;
    medicalScore: number;
    insuranceScore: number;
    timelineScore: number;
  };
  recommendations: string[];
}

export class CaseScorer {
  /**
   * Calculate the keeper score for a case submission
   */
  static calculateScore(input: ScoringInput): ScoringResult {
    const breakdown = {
      severityScore: this.calculateSeverityScore(input.injurySeverity),
      typeScore: this.calculateTypeScore(input.incidentType),
      descriptionScore: this.calculateDescriptionScore(input.description),
      medicalScore: this.calculateMedicalScore(input.medicalTreatment, input.hospitalized),
      insuranceScore: this.calculateInsuranceScore(input.hasInsurance),
      timelineScore: this.calculateTimelineScore(input.incidentDate)
    };

    const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
    const keeperGrade = this.assignKeeperGrade(totalScore);
    const recommendations = this.generateRecommendations(totalScore, breakdown, input);

    return {
      aiScore: Math.min(Math.max(totalScore, 0), 100), // Clamp between 0-100
      keeperGrade,
      scoreBreakdown: breakdown,
      recommendations
    };
  }

  /**
   * Calculate score based on injury severity
   */
  private static calculateSeverityScore(severity: string): number {
    const severityScores: Record<string, number> = {
      'catastrophic': 40,
      'severe': 30,
      'moderate': 20,
      'minor': 10
    };
    
    return severityScores[severity.toLowerCase()] || 5;
  }

  /**
   * Calculate score based on incident type
   */
  private static calculateTypeScore(incidentType: string): number {
    const typeScores: Record<string, number> = {
      'trucking': 30,
      'catastrophic': 30,
      'auto': 20,
      'workplace': 15,
      'other': 10
    };
    
    return typeScores[incidentType.toLowerCase()] || 10;
  }

  /**
   * Calculate score based on description quality
   */
  private static calculateDescriptionScore(description: string): number {
    const length = description.trim().length;
    
    // Base score for having a description
    let score = 5;
    
    // Length scoring
    if (length > 200) {
      score += 15;
    } else if (length > 100) {
      score += 10;
    } else if (length > 50) {
      score += 5;
    }
    
    // Quality indicators
    const qualityWords = [
      'hospital', 'ambulance', 'police', 'witness', 'evidence',
      'pain', 'injury', 'damage', 'liability', 'negligence',
      'settlement', 'compensation', 'medical', 'treatment'
    ];
    
    const qualityWordCount = qualityWords.filter(word => 
      description.toLowerCase().includes(word)
    ).length;
    
    score += Math.min(qualityWordCount * 2, 10);
    
    return Math.min(score, 20); // Cap at 20 points
  }

  /**
   * Calculate score based on medical treatment
   */
  private static calculateMedicalScore(medicalTreatment: boolean, hospitalized: boolean): number {
    let score = 0;
    
    if (hospitalized) {
      score += 15; // Hospitalization indicates serious injury
    } else if (medicalTreatment) {
      score += 10; // Medical treatment indicates documented injury
    }
    
    return score;
  }

  /**
   * Calculate score based on insurance coverage
   */
  private static calculateInsuranceScore(hasInsurance: boolean): number {
    return hasInsurance ? 5 : 0; // Insurance coverage is a positive factor
  }

  /**
   * Calculate score based on incident timeline
   */
  private static calculateTimelineScore(incidentDate: string): number {
    const incidentDateObj = new Date(incidentDate);
    const now = new Date();
    const daysSinceIncident = Math.floor((now.getTime() - incidentDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    // Recent incidents score higher
    if (daysSinceIncident <= 30) {
      return 10; // Very recent
    } else if (daysSinceIncident <= 90) {
      return 7; // Recent
    } else if (daysSinceIncident <= 365) {
      return 5; // Within a year
    } else {
      return 2; // Older cases
    }
  }

  /**
   * Assign keeper grade based on total score
   */
  private static assignKeeperGrade(score: number): string {
    if (score >= 80) {
      return 'A'; // High-value keeper
    } else if (score >= 60) {
      return 'B'; // Strong potential
    } else if (score >= 40) {
      return 'C'; // Marginal
    } else {
      return 'D'; // Likely decline
    }
  }

  /**
   * Generate recommendations based on score and factors
   */
  private static generateRecommendations(
    totalScore: number, 
    breakdown: any, 
    input: ScoringInput
  ): string[] {
    const recommendations: string[] = [];
    
    if (totalScore >= 80) {
      recommendations.push('High-priority case - excellent keeper potential');
      recommendations.push('Consider immediate partner assignment');
    } else if (totalScore >= 60) {
      recommendations.push('Strong case - good keeper potential');
      recommendations.push('Review for partner assignment');
    } else if (totalScore >= 40) {
      recommendations.push('Marginal case - requires careful review');
      recommendations.push('Consider additional information gathering');
    } else {
      recommendations.push('Low-priority case - likely decline');
      recommendations.push('Standard rejection process');
    }
    
    // Specific recommendations based on factors
    if (breakdown.severityScore < 20) {
      recommendations.push('Consider severity documentation');
    }
    
    if (breakdown.descriptionScore < 10) {
      recommendations.push('Request more detailed incident description');
    }
    
    if (breakdown.medicalScore === 0) {
      recommendations.push('Verify medical treatment status');
    }
    
    if (breakdown.timelineScore < 5) {
      recommendations.push('Note: Incident occurred over a year ago');
    }
    
    return recommendations;
  }

  /**
   * Get grade value for comparison (A=4, B=3, C=2, D=1)
   */
  static getGradeValue(grade: string): number {
    const gradeValues: Record<string, number> = {
      'A': 4,
      'B': 3,
      'C': 2,
      'D': 1
    };
    
    return gradeValues[grade.toUpperCase()] || 0;
  }

  /**
   * Check if a grade meets minimum requirements
   */
  static meetsMinimumGrade(grade: string, minimumGrade: string): boolean {
    return this.getGradeValue(grade) >= this.getGradeValue(minimumGrade);
  }
}
