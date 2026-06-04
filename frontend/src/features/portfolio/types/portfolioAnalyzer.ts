export interface PortfolioAnalyzerRequest {
  github_username: string;

  language?: string;
}

export interface GitHubProfile {
  username: string;

  name: string | null;

  bio: string | null;

  avatar_url: string;

  html_url: string;

  followers: number;

  following: number;
}

export interface PortfolioSignals {
  technical_depth: number;

  architecture: number;

  readme_quality: number;

  business_impact: number;

  github_activity: number;
}

export interface GitHubActivity {
  recent_commits_30d: number;

  recent_commits_90d: number;

  active_repositories_90d: number;

  last_activity_at: string | null;

  consistency_score: number;

  activity_level: "high" | "medium" | "low";
}

export type RecruiterAttention =
  | "high"
  | "medium"
  | "low";

export interface RepoReview {
  name: string;

  description: string | null;

  html_url: string;

  language: string | null;

  topics: string[];

  stars: number;

  forks: number;

  commits_90d: number;

  last_commit_at: string | null;

  score: number;

  tag: string;

  recruiter_attention: RecruiterAttention;

  attention_reason: string;

  summary: string;

  strengths: string[];

  risks: string[];

  improvements: string[];
}

export interface PortfolioAnalyzerResponse {
  github_username: string;

  github_profile: GitHubProfile;

  portfolio_score: number;

  signals: PortfolioSignals;

  github_activity: GitHubActivity;

  top_wins: string[];

  red_flags: string[];

  repos: RepoReview[];

  ai_conclusion: string;
}

export interface PortfolioProfileData {
  id?: number | null;

  user_id?: number;

  github_username: string;

  language?: string;

  analysis: PortfolioAnalyzerResponse | null;
}
