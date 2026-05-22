export interface SmartSuggestion {
  title: string;

  description: string;

  type:
    | "warning"
    | "success"
    | "improvement";

  priority:
    | "high"
    | "medium"
    | "low";
}

export interface RecruiterAnalysis {
  strongest_area: string;

  improvement_opportunity: string;

  recruiter_impression: string;
}

export interface ResumeAnalysis {
  smart_suggestions: SmartSuggestion[];

  recruiter_analysis: RecruiterAnalysis;

  ats_score: ATSScore;
}

export interface ATSBreakdown {
  completeness: number;

  keyword_relevance: number;

  experience_quality: number;

  formatting: number;

  readability: number;
}

export interface ATSScore {
  score: number;

  breakdown: ATSBreakdown;
}
