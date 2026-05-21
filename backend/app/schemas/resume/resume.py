from typing import Any, Dict

from pydantic import BaseModel


class ResumeCreate(BaseModel):
    title: str

    template: str

    data: Dict[str, Any]