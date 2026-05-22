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

export interface CoverLetterAnalysis {
  smart_suggestions: SmartSuggestion[];

  recruiter_analysis: RecruiterAnalysis;
}
