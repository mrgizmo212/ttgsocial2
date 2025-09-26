from __future__ import annotations

from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from ..security.jwt import get_current_user_id
from ..services.posts import PostsService
from ..models import Bookmark


router = APIRouter(prefix="/api/bookmarks", tags=["bookmarks"])


@router.post("/create")
def bookmark_create(body: Dict[str, int], user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)) -> Dict[str, Any]:
    bookmarked_post = body.get("bookmarkedPost")
    if bookmarked_post is None:
        return {"error": "bookmarkedPost required"}
    exists = db.query(Bookmark).filter(Bookmark.bookmarked_by == user_id, Bookmark.bookmarked_post == bookmarked_post).first()
    if not exists:
        db.add(Bookmark(bookmarked_by=user_id, bookmarked_post=bookmarked_post))
        db.commit()
    return PostsService(db).get_post(bookmarked_post).model_dump()


@router.post("/delete")
def bookmark_delete(body: Dict[str, int], user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)) -> Dict[str, Any]:
    bookmarked_post = body.get("bookmarkedPost")
    if bookmarked_post is None:
        return {"error": "bookmarkedPost required"}
    row = db.query(Bookmark).filter(Bookmark.bookmarked_by == user_id, Bookmark.bookmarked_post == bookmarked_post).first()
    if row:
        db.delete(row)
        db.commit()
    return PostsService(db).get_post(bookmarked_post).model_dump()


