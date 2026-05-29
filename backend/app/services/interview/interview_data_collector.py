from typing import Any

from sqlalchemy.orm import Session

from backend.app.models.resume.resume import Resume
from backend.app.services.privacy.llm_privacy import prepare_data


MAX_ITEMS_PER_CATEGORY = 18
MAX_RESUMES_IN_CONTEXT = 5
MAX_TEXT_LENGTH = 900


def _safe_list(value: Any) -> list:
    """Normalize arbitrary values into a clean list."""
    if isinstance(value, list):
        return [
            item
            for item in value
            if item not in [None, "", [], {}]
        ]

    if isinstance(value, str) and value.strip():
        separators = [",", ";", "\n", "|"]
        items = [value]

        for separator in separators:
            split_items = []

            for item in items:
                split_items.extend(item.split(separator))

            items = split_items

        return [
            item.strip()
            for item in items
            if item.strip()
        ]

    return []


def _safe_text(value: Any) -> str:
    """Convert values into trimmed text with length limits."""
    if value is None:
        return ""

    text = str(value).strip()

    if len(text) > MAX_TEXT_LENGTH:
        return text[:MAX_TEXT_LENGTH].rstrip() + "..."

    return text


def _safe_dict(value: Any) -> dict:
    """Return the value if it is a dictionary, otherwise an empty dict."""
    if isinstance(value, dict):
        return value

    return {}


def _merge_dicts(*values: Any) -> dict:
    """Merge multiple dictionaries into one combined dictionary."""
    merged = {}

    for value in values:
        if isinstance(value, dict):
            merged.update(value)

    return merged


def _normalize_item(value: Any) -> str:
    if isinstance(value, dict):
        for key in [
            "name",
            "title",
            "skill",
            "tool",
            "label",
            "company",
            "role",
            "degree",
            "certification",
            "description",
            "summary",
            "responsibility",
            "task",
            "achievement",
            "outcome",
            "keyword",
        ]:
            text = _safe_text(value.get(key))

            if text:
                return text

        return _safe_text(value)

    return _safe_text(value)


def _unique_strings(values: list[Any]) -> list[str]:
    seen = set()
    result = []

    for value in values:
        text = _normalize_item(value)

        if not text:
            continue

        key = text.lower()

        if key in seen:
            continue

        seen.add(key)
        result.append(text)

    return result[:MAX_ITEMS_PER_CATEGORY]


def _extract_first_available_list(
    source: dict,
    keys: list[str],
) -> list:
    for key in keys:
        value = _safe_list(source.get(key))

        if value:
            return value

    return []


def _extract_nested_lists(
    source: dict,
    paths: list[list[str]],
) -> list:
    values = []

    for path in paths:
        current: Any = source

        for key in path:
            if not isinstance(current, dict):
                current = None
                break

            current = current.get(key)

        values.extend(_safe_list(current))

    return values


def _extract_resume_analysis(
    resume: Resume,
) -> dict:
    latest_analysis = _safe_dict(
        getattr(resume, "latest_resume_analysis", None),
    )

    structured_resume_data = _safe_dict(
        latest_analysis.get("structured_resume_data"),
    )

    return _merge_dicts(
        getattr(resume, "analysis", None),
        getattr(resume, "parsed_resume", None),
        getattr(resume, "resume_data", None),
        latest_analysis,
        structured_resume_data,
    )


def _extract_structured_resume_data(
    resume: Resume,
) -> dict:
    latest_analysis = _safe_dict(
        getattr(resume, "latest_resume_analysis", None),
    )

    return _safe_dict(
        latest_analysis.get("structured_resume_data"),
    )


def _extract_resume_title(
    resume: Resume,
) -> str:
    return (
        _safe_text(getattr(resume, "title", None))
        or _safe_text(getattr(resume, "filename", None))
        or _safe_text(getattr(resume, "name", None))
        or "Resume"
    )


def _extract_summary(
    *,
    resume: Resume,
    analysis: dict,
) -> str:
    return (
        _safe_text(getattr(resume, "summary", None))
        or _safe_text(analysis.get("summary"))
        or _safe_text(analysis.get("candidate_summary"))
        or _safe_text(analysis.get("professional_summary"))
        or _safe_text(analysis.get("profile_summary"))
        or _safe_text(analysis.get("overview"))
        or _safe_text(analysis.get("content_summary"))
        or _safe_text(analysis.get("resume_summary"))
    )


def _extract_skills(
    *,
    resume: Resume,
    analysis: dict,
) -> list:
    """
    Extract normalized skill signals from resume
    model fields and AI analysis payloads.
    """
    return (
        _safe_list(getattr(resume, "skills", None))
        or _extract_first_available_list(
            analysis,
            [
                "skills",
                "detected_skills",
                "core_skills",
                "key_skills",
                "technical_skills",
                "professional_skills",
                "competencies",
                "strengths",
                "soft_skills",
                "hard_skills",
                "transferable_skills",
                "domain_skills",
            ],
        )
        or _extract_nested_lists(
            analysis,
            [
                ["parsed_resume", "skills"],
                ["resume", "skills"],
                ["sections", "skills"],
                ["analysis", "skills"],
                ["analysis", "detected_skills"],
            ],
        )
    )


def _extract_tools(
    *,
    resume: Resume,
    analysis: dict,
) -> list:
    return (
        _safe_list(getattr(resume, "tools", None))
        or _extract_first_available_list(
            analysis,
            [
                "tools",
                "software",
                "platforms",
                "systems",
                "technologies",
                "tech_stack",
                "applications",
                "work_tools",
                "business_tools",
                "office_tools",
                "design_tools",
                "marketing_tools",
                "sales_tools",
            ],
        )
        or _extract_nested_lists(
            analysis,
            [
                ["parsed_resume", "tools"],
                ["resume", "tools"],
                ["sections", "tools"],
                ["sections", "technologies"],
                ["analysis", "tools"],
                ["analysis", "technologies"],
            ],
        )
    )


def _extract_projects(
    *,
    resume: Resume,
    analysis: dict,
) -> list:
    """
    Extract project-related experience from
    resume fields and structured analysis data.
    """
    return (
        _safe_list(getattr(resume, "projects", None))
        or _extract_first_available_list(
            analysis,
            [
                "projects",
                "project_experience",
                "portfolio_projects",
                "case_studies",
                "work_samples",
                "practical_projects",
                "academic_projects",
                "client_projects",
            ],
        )
        or _extract_nested_lists(
            analysis,
            [
                ["parsed_resume", "projects"],
                ["resume", "projects"],
                ["sections", "projects"],
                ["analysis", "projects"],
                ["analysis", "project_experience"],
            ],
        )
    )


def _extract_experience(
    *,
    resume: Resume,
    analysis: dict,
) -> list:
    return (
        _safe_list(getattr(resume, "experience", None))
        or _extract_first_available_list(
            analysis,
            [
                "experience",
                "work_experience",
                "employment_history",
                "professional_experience",
                "career_history",
                "roles",
                "jobs",
                "positions",
                "internships",
                "volunteering",
            ],
        )
        or _extract_nested_lists(
            analysis,
            [
                ["parsed_resume", "experience"],
                ["resume", "experience"],
                ["sections", "experience"],
                ["sections", "work_experience"],
                ["analysis", "experience"],
                ["analysis", "work_experience"],
            ],
        )
    )


def _extract_responsibilities(
    *,
    resume: Resume,
    analysis: dict,
) -> list:
    return (
        _safe_list(getattr(resume, "responsibilities", None))
        or _extract_first_available_list(
            analysis,
            [
                "responsibilities",
                "tasks",
                "duties",
                "role_responsibilities",
                "key_responsibilities",
                "activities",
                "daily_tasks",
                "core_tasks",
                "scope",
                "ownership",
            ],
        )
        or _extract_nested_lists(
            analysis,
            [
                ["parsed_resume", "responsibilities"],
                ["resume", "responsibilities"],
                ["sections", "responsibilities"],
                ["sections", "tasks"],
                ["analysis", "responsibilities"],
                ["analysis", "tasks"],
            ],
        )
    )


def _extract_education(
    *,
    resume: Resume,
    analysis: dict,
) -> list:
    return (
        _safe_list(getattr(resume, "education", None))
        or _extract_first_available_list(
            analysis,
            [
                "education",
                "studies",
                "academic_background",
                "degrees",
                "training",
            ],
        )
        or _extract_nested_lists(
            analysis,
            [
                ["parsed_resume", "education"],
                ["resume", "education"],
                ["sections", "education"],
                ["analysis", "education"],
                ["analysis", "studies"],
            ],
        )
    )


def _extract_certifications(
    *,
    resume: Resume,
    analysis: dict,
) -> list:
    return (
        _safe_list(getattr(resume, "certifications", None))
        or _extract_first_available_list(
            analysis,
            [
                "certifications",
                "certificates",
                "licenses",
                "courses",
                "training_certificates",
            ],
        )
        or _extract_nested_lists(
            analysis,
            [
                ["parsed_resume", "certifications"],
                ["resume", "certifications"],
                ["sections", "certifications"],
                ["sections", "courses"],
                ["analysis", "certifications"],
                ["analysis", "courses"],
            ],
        )
    )


def _extract_achievements(
    *,
    resume: Resume,
    analysis: dict,
) -> list:
    return (
        _safe_list(getattr(resume, "achievements", None))
        or _extract_first_available_list(
            analysis,
            [
                "achievements",
                "accomplishments",
                "impact",
                "results",
                "outcomes",
                "highlights",
                "awards",
            ],
        )
        or _extract_nested_lists(
            analysis,
            [
                ["parsed_resume", "achievements"],
                ["resume", "achievements"],
                ["sections", "achievements"],
                ["sections", "awards"],
                ["analysis", "achievements"],
                ["analysis", "results"],
            ],
        )
    )


def _extract_industries(
    *,
    resume: Resume,
    analysis: dict,
) -> list:
    return (
        _safe_list(getattr(resume, "industries", None))
        or _extract_first_available_list(
            analysis,
            [
                "industries",
                "domains",
                "sectors",
                "field",
                "fields",
                "professional_domains",
                "business_domains",
                "target_industries",
            ],
        )
    )


def _extract_keywords(
    *,
    analysis: dict,
) -> list:
    return _extract_first_available_list(
        analysis,
        [
            "keywords",
            "ats_keywords",
            "search_keywords",
            "detected_keywords",
            "relevant_keywords",
            "role_keywords",
            "resume_keywords",
            "professional_keywords",
        ],
    )


def _extract_target_roles(
    *,
    resume: Resume,
    analysis: dict,
) -> list:
    return (
        _safe_list(getattr(resume, "target_roles", None))
        or _extract_first_available_list(
            analysis,
            [
                "target_roles",
                "desired_roles",
                "job_titles",
                "role_targets",
                "career_targets",
            ],
        )
        or _extract_nested_lists(
            analysis,
            [
                ["analysis", "target_roles"],
                ["sections", "target_roles"],
            ],
        )
    )


def _extract_candidate_level(
    *,
    analysis: dict,
) -> str:
    """
    Extract the detected candidate seniority
    level from structured resume analysis data.
    """
    return (
        _safe_text(analysis.get("candidate_level"))
        or _safe_text(analysis.get("seniority"))
        or _safe_text(analysis.get("experience_level"))
        or _safe_text(analysis.get("level"))
    )


def collect_interview_resume_context(
    *,
    db: Session,
    user_id: int,
) -> dict:
    """
    Collect and normalize resume-derived interview
    context across the user's saved resumes.

    The returned context is used to personalize
    interview questions and evaluation prompts
    with relevant skills, projects, experience,
    achievements, education and career signals.
    """
    resumes = (
        db.query(Resume)
        .filter(Resume.user_id == user_id)
        .all()
    )

    resume_items = []

    all_skills = []
    all_tools = []
    all_projects = []
    all_experience = []
    all_responsibilities = []
    all_education = []
    all_certifications = []
    all_achievements = []
    all_industries = []
    all_keywords = []
    all_target_roles = []
    candidate_levels = []

    for resume in resumes[:MAX_RESUMES_IN_CONTEXT]:
        raw_analysis = _extract_resume_analysis(resume)
        structured_resume_data = _extract_structured_resume_data(resume)

        analysis = prepare_data(raw_analysis)

        skills = _extract_skills(
            resume=resume,
            analysis=analysis,
        )
        tools = _extract_tools(
            resume=resume,
            analysis=analysis,
        )
        projects = _extract_projects(
            resume=resume,
            analysis=analysis,
        )
        experience = _extract_experience(
            resume=resume,
            analysis=analysis,
        )
        responsibilities = _extract_responsibilities(
            resume=resume,
            analysis=analysis,
        )
        education = _extract_education(
            resume=resume,
            analysis=analysis,
        )
        certifications = _extract_certifications(
            resume=resume,
            analysis=analysis,
        )
        achievements = _extract_achievements(
            resume=resume,
            analysis=analysis,
        )
        industries = _extract_industries(
            resume=resume,
            analysis=analysis,
        )
        keywords = _extract_keywords(
            analysis=analysis,
        )
        target_roles = _extract_target_roles(
            resume=resume,
            analysis=analysis,
        )
        candidate_level = _extract_candidate_level(
            analysis=analysis,
        )
        summary = _extract_summary(
            resume=resume,
            analysis=analysis,
        )

        resume_items.append({
            "id": getattr(resume, "id", None),
            "title": prepare_data(_extract_resume_title(resume)),
            "ats_score": getattr(resume, "latest_ats_score", None),
            "latest_analysis": prepare_data(
                getattr(resume, "latest_resume_analysis", None),
            ),
            "structured_resume_data": prepare_data(structured_resume_data),
            "summary": prepare_data(summary),
            "skills": prepare_data(_unique_strings(skills)),
            "tools": prepare_data(_unique_strings(tools)),
            "projects": prepare_data(_unique_strings(projects)),
            "experience": prepare_data(_unique_strings(experience)),
            "responsibilities": prepare_data(_unique_strings(responsibilities)),
            "education": prepare_data(_unique_strings(education)),
            "certifications": prepare_data(_unique_strings(certifications)),
            "achievements": prepare_data(_unique_strings(achievements)),
            "industries": prepare_data(_unique_strings(industries)),
            "keywords": prepare_data(_unique_strings(keywords)),
            "target_roles": prepare_data(_unique_strings(target_roles)),
            "candidate_level": prepare_data(candidate_level),
        })

        all_skills.extend(skills)
        all_tools.extend(tools)
        all_projects.extend(projects)
        all_experience.extend(experience)
        all_responsibilities.extend(responsibilities)
        all_education.extend(education)
        all_certifications.extend(certifications)
        all_achievements.extend(achievements)
        all_industries.extend(industries)
        all_keywords.extend(keywords)
        all_target_roles.extend(target_roles)

        if candidate_level:
            candidate_levels.append(candidate_level)

    return {
        "resume_count": len(resumes),
        "used_resume_count": min(len(resumes), MAX_RESUMES_IN_CONTEXT),
        "resumes": resume_items,
        "skills": prepare_data(_unique_strings(all_skills)),
        "tools": prepare_data(_unique_strings(all_tools)),
        "projects": prepare_data(_unique_strings(all_projects)),
        "experience": prepare_data(_unique_strings(all_experience)),
        "responsibilities": prepare_data(_unique_strings(all_responsibilities)),
        "education": prepare_data(_unique_strings(all_education)),
        "certifications": prepare_data(_unique_strings(all_certifications)),
        "achievements": prepare_data(_unique_strings(all_achievements)),
        "industries": prepare_data(_unique_strings(all_industries)),
        "keywords": prepare_data(_unique_strings(all_keywords)),
        "target_roles": prepare_data(_unique_strings(all_target_roles)),
        "candidate_levels": prepare_data(_unique_strings(candidate_levels)),
    }
