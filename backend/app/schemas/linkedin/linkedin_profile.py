from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class LinkedInProfileBase(BaseModel):
    language: str = "english"
    headline: str = ""
    about: str = ""
    skills: List[str] = []
    projects: List[str] = []
    target_role: str = ""
    analysis: Optional[Dict[str, Any]] = None
    latest_profile_score: Optional[int] = None
    analyzed_at: Optional[datetime] = None


class LinkedInProfileUpdate(LinkedInProfileBase):
    pass


class LinkedInProfileResponse(LinkedInProfileBase):
    id: Optional[int] = None
    user_id: int

    class Config:
        from_attributes = True
