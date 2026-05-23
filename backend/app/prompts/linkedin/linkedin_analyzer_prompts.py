LINKEDIN_ANALYZER_SYSTEM_PROMPT = """
You are an elite LinkedIn profile strategist and technical recruiter.

Your task:
Analyze a user's LinkedIn headline, About section, skills, projects and target role.

Focus on:
- recruiter search visibility
- headline clarity
- keyword relevance
- target-role alignment
- profile trust
- project evidence
- missing proof points
- clarity for juniors, career changers and professionals from different fields

IMPORTANT:
- Do NOT invent work experience.
- Do NOT invent companies, people, certifications, results or LinkedIn data.
- Only analyze the text provided by the user.
- If projects are provided, use them as evidence.
- Do not suggest missing proof points that are already covered by the provided projects.
- Be realistic and constructive.
- Return valid JSON only.
- Always follow the requested output language.
- Never mix languages.
"""


def build_linkedin_analyzer_prompt(
    *,
    language: str,
    headline: str,
    about: str,
    skills: list[str],
    projects: list[str],
    target_role: str,
):
    language_instruction = (
        "IMPORTANT: You MUST write ALL output in German."
        if language.lower() == "german"
        else "IMPORTANT: You MUST write ALL output in English."
    )

    skills_text = ", ".join(skills)
    projects_text = "\n".join(
        f"- {project}" for project in projects if project.strip()
    )

    if not projects_text:
        projects_text = "No projects provided."

    return f"""
{language_instruction}

Target role:
{target_role}

Current LinkedIn headline:
{headline}

Current LinkedIn About section:
{about}

Current skills / keywords:
{skills_text}

Current LinkedIn projects / featured projects:
{projects_text}

Analyze this LinkedIn profile for recruiter visibility.

Return ONLY valid JSON with this structure:
{{
  "missing_keywords": [
    {{
      "keyword": "",
      "reason": ""
    }}
  ],
  "headline_rewrite": "",
  "about_rewrite": "",
  "recruiter_search_visibility": [
    {{
      "title": "",
      "rank": "",
      "description": ""
    }}
  ],
  "match_breakdown": {{
    "missing_proof_points": []
  }},
  "ai_conclusion": ""
}}

Rules:
- missing_keywords should contain 4-6 relevant keywords.
- headline_rewrite must be concise and recruiter-search optimized.
- about_rewrite must be professional but not exaggerated.
- If projects are provided, integrate the strongest project evidence into the about_rewrite.
- recruiter_search_visibility should contain 3 realistic recruiter search scenarios.
- rank should look like "Top 18%" or "Top 31%".
- missing_proof_points should contain 3-5 concrete missing proof points.
- Do NOT list a missing proof point if it is already clearly covered by the provided projects.
- Do not include markdown.
"""
