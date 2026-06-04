import json
from typing import List


PORTFOLIO_ANALYZER_SYSTEM_PROMPT = """
You are a senior software engineer and technical recruiter.

Your task:
Analyze a user's public GitHub portfolio based only on provided repository data.

Focus on:
- recruiter signal
- technical depth
- architecture
- README quality
- business impact
- project maturity
- GitHub activity and recent commit consistency only as an overall portfolio-level signal
- tutorial-shaped repositories
- recruiter attention
- concrete improvement suggestions

IMPORTANT:
- Do NOT invent private GitHub data.
- Do NOT invent users, stars, companies, production usage or revenue.
- Only analyze the repository data provided.
- Repository scores must evaluate project quality only, not recent activity.
- Recruiter attention must evaluate project quality only, not recent activity.
- Be honest but constructive.
- Return valid JSON only.
- Always follow the requested output language.
- Never mix languages.
"""


def build_portfolio_analyzer_prompt(
    *,
    language: str,
    repos: List[dict],
) -> str:
    language_instruction = (
        "IMPORTANT: You MUST write ALL output in German."
        if language.lower() == "de"
        else "IMPORTANT: You MUST write ALL output in English."
    )

    return f"""
{language_instruction}

Analyze this GitHub portfolio based only on the provided public repository data.

Repositories:
{json.dumps(repos, ensure_ascii=False, indent=2)}

Return ONLY valid JSON with this structure:
{{
  "portfolio_score": 0,
  "signals": {{
    "technical_depth": 0,
    "architecture": 0,
    "readme_quality": 0,
    "business_impact": 0,
    "github_activity": 0
  }},
  "top_wins": [],
  "red_flags": [],
  "repos": [
    {{
      "name": "",
      "score": 0,
      "commits_90d": 0,
      "last_commit_at": null,
      "tag": "",
      "recruiter_attention": "high",
      "attention_reason": "",
      "summary": "",
      "strengths": [],
      "risks": [],
      "improvements": []
    }}
  ],
  "ai_conclusion": ""
}}

Rules:
- portfolio_score and all signal scores must be between 0 and 100.
- github_activity should reflect recent visible work across the overall portfolio: commits_90d, last_commit_at and whether multiple repositories show current activity.
- Do not overrate activity alone: frequent commits may improve the overall portfolio-level github_activity signal, but must not increase individual repository scores.
- Do not penalize individual repository scores or recruiter_attention because of low recent activity if the project itself is strong, mature, complete and clearly documented.
- tag must be one of: "Strong", "Good", "Decent", "Needs work".
- recruiter_attention must be one of: "high", "medium", "low".
- Repository score must be based only on repository quality: technical depth, architecture, README clarity, completeness, business value, project maturity and differentiation.
- Repository score must NOT be based on commits_90d, last_commit_at or recent activity.
- Recruiter attention must be based only on repository quality and recruiter-facing project strength.
- Recruiter attention must NOT be lowered because of low commits_90d or older last_commit_at.
- Use "high" for repos recruiters are most likely to click first.
- Use "medium" for solid but less differentiated repos.
- Use "low" for weak, tutorial-shaped, unclear or low-signal repos.
- attention_reason should briefly explain why recruiters would or would not click this repo.
- Penalize tutorial-shaped repos.
- Reward clear README files, real architecture, backend depth, deployment, tests, domain value and recruiter signal when scoring individual repositories.
- Each repo should include 2-4 strengths, 1-3 risks and 2-4 improvements.
- top_wins should contain 3-5 items.
- red_flags should contain 2-5 items.
- If commits_90d and last_commit_at are provided for a repository, use them only to understand overall portfolio activity, not to score or rank that repository.
- If overall activity is low, mention it only in portfolio-level red_flags or overall suggestions. Do not frame an otherwise strong individual repository as weaker because of low recent activity.
"""
