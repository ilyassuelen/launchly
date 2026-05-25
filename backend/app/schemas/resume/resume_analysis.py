from typing import Any
from typing import List

from pydantic import BaseModel
from pydantic import Field


class SmartSuggestion(BaseModel):
    title: str
    description: str
    type: str
    priority: str


class RecruiterAnalysis(BaseModel):
    strongest_area: str = ""
    improvement_opportunity: str = ""
    recruiter_impression: str = ""


class ATSBreakdown(BaseModel):
    completeness: int
    keyword_relevance: int
    experience_quality: int
    formatting: int
    readability: int


class ATSScore(BaseModel):
    score: int
    breakdown: ATSBreakdown


class ResumeAnalysisRequest(BaseModel):
    tone: str
    language: str
    resume_content: str
    target_role: str | None = None
    resume_id: int | None = None


class StructuredResumeData(BaseModel):
    summary: str | None = None
    candidate_summary: str | None = None
    professional_summary: str | None = None
    profile_summary: str | None = None
    resume_summary: str | None = None

    skills: List[str] = Field(default_factory=list)
    detected_skills: List[str] = Field(default_factory=list)
    core_skills: List[str] = Field(default_factory=list)
    key_skills: List[str] = Field(default_factory=list)
    technical_skills: List[str] = Field(default_factory=list)
    professional_skills: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    hard_skills: List[str] = Field(default_factory=list)
    transferable_skills: List[str] = Field(default_factory=list)
    domain_skills: List[str] = Field(default_factory=list)

    tools: List[str] = Field(default_factory=list)
    software: List[str] = Field(default_factory=list)
    platforms: List[str] = Field(default_factory=list)
    systems: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    tech_stack: List[str] = Field(default_factory=list)

    projects: List[Any] = Field(default_factory=list)
    project_experience: List[Any] = Field(default_factory=list)
    portfolio_projects: List[Any] = Field(default_factory=list)
    case_studies: List[Any] = Field(default_factory=list)
    work_samples: List[Any] = Field(default_factory=list)

    experience: List[Any] = Field(default_factory=list)
    work_experience: List[Any] = Field(default_factory=list)
    employment_history: List[Any] = Field(default_factory=list)
    professional_experience: List[Any] = Field(default_factory=list)
    career_history: List[Any] = Field(default_factory=list)

    responsibilities: List[str] = Field(default_factory=list)
    tasks: List[str] = Field(default_factory=list)
    duties: List[str] = Field(default_factory=list)
    role_responsibilities: List[str] = Field(default_factory=list)
    key_responsibilities: List[str] = Field(default_factory=list)

    education: List[Any] = Field(default_factory=list)
    studies: List[Any] = Field(default_factory=list)
    academic_background: List[Any] = Field(default_factory=list)

    certifications: List[str] = Field(default_factory=list)
    certificates: List[str] = Field(default_factory=list)
    licenses: List[str] = Field(default_factory=list)
    courses: List[str] = Field(default_factory=list)

    achievements: List[str] = Field(default_factory=list)
    accomplishments: List[str] = Field(default_factory=list)
    impact: List[str] = Field(default_factory=list)
    results: List[str] = Field(default_factory=list)
    outcomes: List[str] = Field(default_factory=list)
    highlights: List[str] = Field(default_factory=list)
    awards: List[str] = Field(default_factory=list)

    industries: List[str] = Field(default_factory=list)
    domains: List[str] = Field(default_factory=list)
    sectors: List[str] = Field(default_factory=list)

    keywords: List[str] = Field(default_factory=list)
    ats_keywords: List[str] = Field(default_factory=list)
    role_keywords: List[str] = Field(default_factory=list)
    resume_keywords: List[str] = Field(default_factory=list)

    target_roles: List[str] = Field(default_factory=list)
    desired_roles: List[str] = Field(default_factory=list)
    job_titles: List[str] = Field(default_factory=list)

    candidate_level: str | None = None
    seniority: str | None = None
    experience_level: str | None = None

    target_role: str | None = None
    language: str | None = None
    tone: str | None = None


class ResumeAnalysisResponse(BaseModel):
    smart_suggestions: List[SmartSuggestion]
    recruiter_analysis: RecruiterAnalysis
    ats_score: ATSScore
    structured_resume_data: StructuredResumeData | None = None
