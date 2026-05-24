from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel


class DashboardReviewResponse(BaseModel):
    id: Optional[int] = None
    user_id: int
    status: str
    input_data: Dict[str, Any]
    result: Dict[str, Any]
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
