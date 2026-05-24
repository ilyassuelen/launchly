from datetime import datetime, timedelta
from statistics import mean


def clamp(value: int) -> int:
    return max(0, min(100, int(value)))


def average(values: list[int | float]) -> int:
    clean_values = [
        float(value)
        for value in values
        if value is not None and value > 0
    ]

    if not clean_values:
        return 0

    return clamp(round(mean(clean_values)))


def score_to_grade(score: int) -> str:
    if score >= 90:
        return "A"
    if score >= 82:
        return "A−"
    if score >= 74:
        return "B+"
    if score >= 66:
        return "B"
    if score >= 58:
        return "C+"
    if score > 0:
        return "C"

    return "—"


def calculate_application_score(
    *,
    applications_this_week: int,
    active_applications: int,
) -> int:
    score = min(70, applications_this_week * 12)

    if active_applications >= 3:
        score += 10

    if active_applications >= 6:
        score += 10

    if active_applications >= 10:
        score += 10

    return clamp(score)


def calculate_core_scores(data: dict) -> dict:
    resume_score = average(
        data.get("resume", {}).get("scores", [])
    )

    recruiter_score = average(
        data.get("recruiter_view", {}).get("scores", [])
    )

    linkedin_score = clamp(
        data.get("linkedin", {}).get("score", 0)
    )

    portfolio_score = clamp(
        data.get("portfolio", {}).get("score", 0)
    )

    applications_score = calculate_application_score(
        applications_this_week=data.get("applications", {}).get("this_week", 0),
        active_applications=data.get("applications", {}).get("active", 0),
    )

    interview_score = 0

    weighted_scores = [
        resume_score * 1.15,
        recruiter_score * 1.2,
        linkedin_score * 1.1,
        portfolio_score,
        applications_score * 0.85,
        interview_score * 0.7,
    ]

    career_score = average(weighted_scores)

    return {
        "career_score": career_score,
        "recruiter_score": recruiter_score,
        "resume_score": resume_score,
        "linkedin_score": linkedin_score,
        "portfolio_score": portfolio_score,
        "applications_score": applications_score,
        "interview_score": interview_score,
    }


def build_profile_strength(scores: dict) -> dict:
    return {
        "Resume": scores["resume_score"],
        "Recruiter View": scores["recruiter_score"],
        "LinkedIn": scores["linkedin_score"],
        "Portfolio": scores["portfolio_score"],
        "Applications": scores["applications_score"],
        "Interviewing": scores["interview_score"],
    }


def build_market_fit(
    *,
    scores: dict,
    data: dict,
) -> dict:
    market_fit_score = average([
        scores["career_score"] * 1.15,
        scores["recruiter_score"] * 1.2,
        scores["linkedin_score"] * 1.1,
        scores["portfolio_score"],
    ])

    if market_fit_score >= 85:
        label = "Excellent Match"
    elif market_fit_score >= 75:
        label = "Strong Match"
    elif market_fit_score >= 65:
        label = "Good Match"
    elif market_fit_score >= 50:
        label = "Needs Improvement"
    elif market_fit_score > 0:
        label = "Weak Positioning"
    else:
        label = "Pending"

    target_role = (
        data.get("linkedin", {}).get("target_role")
        or "AI Engineer"
    )

    recruiter_confidence = average([
        scores["recruiter_score"],
        scores["resume_score"],
    ])

    positioning = average([
        scores["linkedin_score"],
        scores["resume_score"],
    ])

    portfolio_match = average([
        scores["portfolio_score"],
        scores["linkedin_score"],
    ])

    skills = average([
        scores["linkedin_score"],
        scores["portfolio_score"],
        scores["resume_score"],
    ])

    if market_fit_score >= 80:
        demand = "High"
    elif market_fit_score >= 60:
        demand = "Medium"
    else:
        demand = "Low"

    if scores["linkedin_score"] >= 85:
        visibility = "High"
    elif scores["linkedin_score"] >= 65:
        visibility = "Medium"
    else:
        visibility = "Low"

    return {
        "score": market_fit_score,
        "label": label,
        "best_role_match": target_role,
        "recruiter_confidence": recruiter_confidence,
        "positioning": positioning,
        "portfolio_match": portfolio_match,
        "skills": skills,
        "demand": demand,
        "visibility": visibility,
    }


def build_career_growth(
    *,
    current_score: int,
    previous_score: int,
) -> list[dict]:
    labels = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
    ]

    baseline = (
        previous_score
        if previous_score > 0
        else max(35, current_score - 10)
    )

    progression = []

    for index, label in enumerate(labels):
        ratio = index / (len(labels) - 1)

        interpolated = baseline + (
            (current_score - baseline) * ratio
        )

        progression.append({
            "d": label,
            "v": clamp(round(interpolated)),
        })

    return progression


def build_activity_heatmap(
    *,
    applications: dict,
) -> dict:
    today = datetime.utcnow().date()

    heatmap = []
    recent_dates = set()

    for item in applications.get("recent", []):
        date_label = item.get("date_label")

        if not date_label:
            continue

        try:
            recent_dates.add(
                datetime.fromisoformat(date_label).date()
            )
        except Exception:
            continue

    for index in range(13 * 7):
        current_day = today - timedelta(days=(13 * 7 - index - 1))

        if current_day in recent_dates:
            days_ago = (today - current_day).days

            if days_ago <= 2:
                value = 4
            elif days_ago <= 7:
                value = 3
            else:
                value = 2
        else:
            value = 0

        heatmap.append(value)

    streak_days = 0
    cursor = today

    while cursor in recent_dates:
        streak_days += 1
        cursor -= timedelta(days=1)

    return {
        "streak_days": streak_days,
        "heatmap": heatmap,
    }


def build_fallback_insights(
    *,
    scores: dict,
) -> list[dict]:
    insights = []

    if scores["resume_score"] < 75:
        insights.append({
            "title": "Improve your resume ATS score",
            "description": "Your saved resume score has room to improve. Add stronger keywords and measurable impact.",
            "action_label": "Open Resume",
            "target_path": "/resumes",
            "type": "resume",
        })

    if scores["linkedin_score"] < 75:
        insights.append({
            "title": "Optimize your LinkedIn profile",
            "description": "Your LinkedIn profile could use stronger search keywords and clearer positioning.",
            "action_label": "Optimize",
            "target_path": "/linkedin",
            "type": "linkedin",
        })

    if scores["portfolio_score"] < 75:
        insights.append({
            "title": "Strengthen your portfolio proof",
            "description": "Your portfolio score is lower than ideal. Improve project descriptions, READMEs and technical proof.",
            "action_label": "Review",
            "target_path": "/portfolio",
            "type": "portfolio",
        })

    if scores["applications_score"] < 60:
        insights.append({
            "title": "Send more applications this week",
            "description": "Your current application momentum is low. Focus on sending several highly targeted applications this week.",
            "action_label": "Open Board",
            "target_path": "/applications",
            "type": "applications",
        })

    if not insights:
        insights.append({
            "title": "Your career profile is building momentum",
            "description": "Your main signals look solid. Keep improving consistency across resume, LinkedIn and portfolio.",
            "action_label": "View Dashboard",
            "target_path": "/dashboard",
            "type": "success",
        })

    return insights[:4]


def build_missing_skills(
    *,
    scores: dict,
) -> list[dict]:
    skills = []

    if scores["linkedin_score"] < 75:
        skills.append({
            "skill": "LinkedIn SEO",
            "priority": "high",
        })
        skills.append({
            "skill": "Profile keywords",
            "priority": "medium",
        })

    if scores["portfolio_score"] < 75:
        skills.append({
            "skill": "Project proof",
            "priority": "high",
        })
        skills.append({
            "skill": "README clarity",
            "priority": "medium",
        })

    if scores["resume_score"] < 75:
        skills.append({
            "skill": "ATS keywords",
            "priority": "high",
        })

    return skills[:6]


def build_weekly_plan(
    *,
    scores: dict,
) -> list[dict]:
    plan = []

    if scores["resume_score"] < 80:
        plan.append({
            "day": "Mon",
            "title": "Improve your resume",
            "description": "Update weak resume sections and rerun the ATS analysis.",
            "target_path": "/resumes",
        })

    if scores["linkedin_score"] < 80:
        plan.append({
            "day": "Tue",
            "title": "Optimize LinkedIn",
            "description": "Improve your headline, About section and keyword coverage.",
            "target_path": "/linkedin",
        })

    if scores["portfolio_score"] < 80:
        plan.append({
            "day": "Wed",
            "title": "Strengthen portfolio proof",
            "description": "Improve project descriptions, README clarity and visible technical impact.",
            "target_path": "/portfolio",
        })

    if scores["applications_score"] < 70:
        plan.append({
            "day": "Thu",
            "title": "Send focused applications",
            "description": "Apply to at least 3 targeted roles using your improved profile.",
            "target_path": "/applications",
        })

    if not plan:
        plan.append({
            "day": "Fri",
            "title": "Maintain your momentum",
            "description": "Your overall profile looks strong. Focus on consistency and recruiter visibility.",
            "target_path": "/dashboard",
        })
    return plan[:5]
