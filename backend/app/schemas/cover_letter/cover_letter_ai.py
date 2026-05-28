from pydantic import BaseModel
from typing import List


class CoverLetterGenerateRequest(BaseModel):
    language: str
    tone: str
    sender_name: str
    current_role: str
    skills: List[str] = []
    resume_context: str = ""
    job_posting: str
    hiring_contact: str = ""


class CoverLetterGenerateResponse(BaseModel):
    subject: str
    body: str