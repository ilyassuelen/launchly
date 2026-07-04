from pydantic import BaseModel
from pydantic import Field


class ImportedBasics(BaseModel):
    fullName: str = ""
    title: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    website: str = ""
    linkedin: str = ""
    github: str = ""


class ImportedExperienceItem(BaseModel):
    company: str = ""
    role: str = ""
    startDate: str = ""
    endDate: str = ""
    location: str = ""
    bullets: list[str] = Field(default_factory=list)


class ImportedEducationItem(BaseModel):
    school: str = ""
    degree: str = ""
    startDate: str = ""
    endDate: str = ""
    bullets: list[str] = Field(default_factory=list)


class ImportedProjectItem(BaseModel):
    title: str = ""
    stack: str = ""
    description: str = ""
    bullets: list[str] = Field(default_factory=list)
    technologies: list[str] = Field(default_factory=list)


class ImportedSkillGroup(BaseModel):
    category: str = ""
    skills: list[str] = Field(default_factory=list)


class ImportedLanguage(BaseModel):
    name: str = ""
    level: str = ""


class ResumeImportResponse(BaseModel):
    basics: ImportedBasics = Field(default_factory=ImportedBasics)
    summary: str = ""
    experience: list[ImportedExperienceItem] = Field(default_factory=list)
    education: list[ImportedEducationItem] = Field(default_factory=list)
    projects: list[ImportedProjectItem] = Field(default_factory=list)
    skills: list[ImportedSkillGroup] = Field(default_factory=list)
    languages: list[ImportedLanguage] = Field(default_factory=list)
    softSkills: list[str] = Field(default_factory=list)
