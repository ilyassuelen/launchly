export interface LinkedInAnalyzerRequest {
  language?: string;

  analysis_language?: string;

  headline: string;

  about: string;

  skills: string[];

  projects: string[];

  target_role: string;
}

export interface LinkedInSignals {
  headline: number;

  about: number;

  skills: number;

  search_visibility: number;
}

export interface MissingKeyword {
  keyword: string;

  reason: string;
}

export interface SearchVisibilityItem {
  title: string;

  rank: string;

  description: string;
}

export interface RecruiterMatchBreakdown {
  target_role_match: number;

  keyword_coverage: number;

  search_visibility: number;

  profile_clarity: number;

  missing_proof_points: string[];
}

export interface LinkedInAnalyzerResponse {
  profile_score: number;

  signals: LinkedInSignals;

  missing_keywords: MissingKeyword[];

  headline_rewrite: string;

  about_rewrite: string;

  recruiter_search_visibility: SearchVisibilityItem[];

  match_breakdown: RecruiterMatchBreakdown;

  ai_conclusion: string;
}

export interface LinkedInProfileData {
  id?: number | null;

  user_id?: number;

  language?: string;

  headline: string;

  about: string;

  skills: string[];

  projects: string[];

  target_role: string;

  analysis?: LinkedInAnalyzerResponse | null;

  latest_profile_score?: number | null;

  analyzed_at?: string | null;
}
