from pydantic import BaseModel
from typing import Any, Dict, List, Optional


class LinkedInProfileBase(BaseModel):
    language: str = "english"
    headline: str = ""
    about: str = ""
    skills: List[str] = []
    projects: List[str] = []
    target_role: str = ""
    analysis: Optional[Dict[str, Any]] = None


class LinkedInProfileUpdate(LinkedInProfileBase):
    pass


class LinkedInProfileResponse(LinkedInProfileBase):
    id: Optional[int] = None
    user_id: int

    class Config:
        from_attributes = True