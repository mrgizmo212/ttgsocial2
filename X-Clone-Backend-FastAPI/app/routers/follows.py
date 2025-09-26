from __future__ import annotations

from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from ..security.jwt import get_current_user_id
from ..services.users import UsersService
from ..models import Follow


router = APIRouter(prefix="/api/follows", tags=["follows"])


@router.post("/follow")
def follow(body: Dict[str, int], user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)) -> Dict[str, Any]:
    followed_id = body.get("followedId")
    if followed_id is None:
        return {"error": "followedId required"}
    exists = db.query(Follow).filter(Follow.follower_id == user_id, Follow.followed_id == followed_id).first()
    if not exists:
        db.add(Follow(follower_id=user_id, followed_id=followed_id))
        db.commit()
    return UsersService(db).get_user(followed_id).model_dump()


@router.post("/unfollow")
def unfollow(body: Dict[str, int], user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)) -> Dict[str, Any]:
    followed_id = body.get("followedId")
    if followed_id is None:
        return {"error": "followedId required"}
    row = db.query(Follow).filter(Follow.follower_id == user_id, Follow.followed_id == followed_id).first()
    if row:
        db.delete(row)
        db.commit()
    return UsersService(db).get_user(followed_id).model_dump()


