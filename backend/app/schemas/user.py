from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserBase(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr


class UpdateUserRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
