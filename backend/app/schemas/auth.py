from pydantic import BaseModel, Field


class SignupRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(default="", max_length=120)


class LoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=1, max_length=128)


class AuthUser(BaseModel):
    id: str
    email: str
    full_name: str


class AuthResponse(BaseModel):
    user: AuthUser
