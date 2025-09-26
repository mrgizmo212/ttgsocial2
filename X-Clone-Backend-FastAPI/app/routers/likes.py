from __future__ import annotations

from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from ..security.jwt import get_current_user_id
from ..services.posts import PostsService
from ..models import Like


router = APIRouter(prefix="/api/likes", tags=["likes"])


@router.post("/create")
def like_create(body: Dict[str, int], user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)) -> Dict[str, Any]:
    liked_post_id = body.get("likedPostId")
    if liked_post_id is None:
        return {"error": "likedPostId required"}
    # Naive conflict check
    exists = db.query(Like).filter(Like.liker_id == user_id, Like.post_id == liked_post_id).first()
    if exists:
        return PostsService(db).get_post(liked_post_id).model_dump()
    db.add(Like(liker_id=user_id, post_id=liked_post_id))
    db.commit()
    return PostsService(db).get_post(liked_post_id).model_dump()


@router.post("/delete")
def like_delete(body: Dict[str, int], user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)) -> Dict[str, Any]:
    liked_post_id = body.get("likedPostId")
    if liked_post_id is None:
        return {"error": "likedPostId required"}
    row = db.query(Like).filter(Like.liker_id == user_id, Like.post_id == liked_post_id).first()
    if row:
        db.delete(row)
        db.commit()
    return PostsService(db).get_post(liked_post_id).model_dump()


