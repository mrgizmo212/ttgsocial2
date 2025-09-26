from __future__ import annotations

from typing import Any, Dict

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..security.jwt import get_current_user_id
from ..services.auth import AuthService
from ..services.users import UsersService


router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/demo-signup")
def demo_signup(db: Session = Depends(get_db)) -> Dict[str, Any]:
    # Java: returns { token, user }
    token, user = AuthService(db).demo_signup()
    return {"token": token, "user": user}


@router.get("/me")
def me(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)) -> Dict[str, Any]:
    dto = UsersService(db).get_user(user_id)
    if dto is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return dto.model_dump()


