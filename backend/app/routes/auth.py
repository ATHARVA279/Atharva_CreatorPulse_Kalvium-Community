from fastapi import APIRouter, HTTPException, status

from backend.app.schemas.auth import AuthResponse, LoginRequest, SignupRequest
from backend.app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest):
    try:
        user = auth_service.signup(
            email=payload.email,
            password=payload.password,
            full_name=payload.full_name,
        )
    except ValueError as exc:
        message = str(exc)
        status_code = (
            status.HTTP_409_CONFLICT
            if "already exists" in message
            else status.HTTP_400_BAD_REQUEST
        )
        raise HTTPException(status_code=status_code, detail=message) from exc
    return {"user": user}


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest):
    try:
        user = auth_service.login(email=payload.email, password=payload.password)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
    return {"user": user}
