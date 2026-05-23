from typing import Any, Dict, Optional

from pydantic import BaseModel


class PortfolioProfileBase(BaseModel):
    github_username: str = ""
    language: str = "english"
    analysis: Optional[Dict[str, Any]] = None


class PortfolioProfileUpdate(PortfolioProfileBase):
    pass


class PortfolioProfileResponse(PortfolioProfileBase):
    id: Optional[int] = None
    user_id: int

    class Config:
        from_attributes = True
