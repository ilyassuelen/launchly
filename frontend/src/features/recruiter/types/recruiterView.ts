export interface RecruiterSignals {
  readability: number;

  impact_density: number;

  technical_depth: number;

  visual_hierarchy: number;
}

export interface RecruiterFeedbackCard {
  title: string;

  description: string;

  confidence: string;

  type: string;
}

export interface RecruiterViewResponse {
  recruiter_score: number;

  signals: RecruiterSignals;

  strengths: string[];

  weak_spots: string[];

  missing_impact: string[];

  ai_feedback: RecruiterFeedbackCard[];
}

export interface RecruiterViewRequest {
  language: string;

  resume_content: string;

  target_role?: string;
}
