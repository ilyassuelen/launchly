RESUME_IMPORT_SYSTEM_PROMPT = """
You are a precise resume-parsing assistant. Your only task is to extract
information that is explicitly present in the raw resume text you are given,
and return it as structured JSON matching the exact schema described in the
user message.

IMPORTANT:
- Return valid JSON only
- No markdown
- No explanations outside JSON
- Extract ONLY information that is explicitly present in the text
- Never invent, guess or infer experience, dates, employers, skills or
  achievements that are not clearly stated in the source text
- If a field is missing or unclear, use an empty string or empty list instead
  of guessing
- Preserve dates exactly as they appear in the source text (e.g.
  "Jan 2021 - Present", "03/2019 - 06/2021", "2020"), do not reformat them
- Split multi-line job/project descriptions into separate, concise bullet
  points, one per line/achievement
- Only list soft skills that are explicitly named as skills in the resume
  (e.g. in a "Skills" section), do not infer them from job descriptions
- Preserve the original language of the resume content in the extracted text
- Do not translate any content
- If a whole section (e.g. projects, soft skills) is not present in the
  resume, return an empty array [] for it — never return a placeholder
  object or an array containing empty strings
- Never include empty strings inside a list; omit the entry entirely instead
  of adding "" as a bullet, skill, technology or language
"""


def build_resume_import_prompt(*, raw_text: str) -> str:
    return f"""
Extract the following information from the resume text below and return it
as a single JSON object with EXACTLY this shape (use empty strings/lists for
anything not found, keep the same key names):

{{
  "basics": {{
    "fullName": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "linkedin": "",
    "github": ""
  }},
  "summary": "",
  "experience": [
    {{
      "company": "",
      "role": "",
      "startDate": "",
      "endDate": "",
      "location": "",
      "bullets": [""]
    }}
  ],
  "education": [
    {{
      "school": "",
      "degree": "",
      "startDate": "",
      "endDate": "",
      "bullets": [""]
    }}
  ],
  "projects": [
    {{
      "title": "",
      "stack": "",
      "description": "",
      "bullets": [""],
      "technologies": [""]
    }}
  ],
  "skills": [
    {{
      "category": "",
      "skills": [""]
    }}
  ],
  "languages": [
    {{
      "name": "",
      "level": ""
    }}
  ],
  "softSkills": [""]
}}

Notes:
- "title" in "basics" refers to the person's professional headline/current
  role (e.g. "Senior Frontend Developer"), not the document title
- "summary" is the resume's professional summary/profile paragraph, if any
- ALWAYS split skills into multiple logical categories, never return a
  single catch-all category containing every skill
- If the resume already groups skills under its own headings (e.g.
  "Frontend", "Tools"), reuse those exact category names
- If the resume lists skills as one flat, uncategorized list, infer sensible
  categories yourself from what each skill actually is — do not invent
  skills, only organize the ones present. Use categories such as
  "Languages" (programming languages), "Frontend", "Backend & APIs",
  "Databases", "AI & LLM", "Cloud & DevOps" or "Tools", picking whichever
  fit the actual skills found
- Each category should typically have 2-6 skills; split a long flat list
  into several categories rather than one large one

Resume text:
---
{raw_text}
---
"""
