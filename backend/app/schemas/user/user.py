from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    ai_response_language: str = "english"


class UpdateUserRequest(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=80)
    last_name: str = Field(..., min_length=1, max_length=80)
    username: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    ai_response_language: str = Field(default="english", max_length=20)


class UpdatePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=128)


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
