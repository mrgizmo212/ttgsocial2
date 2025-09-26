from __future__ import annotations

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Body, UploadFile, Form, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..security.jwt import get_current_user_id
from ..services.posts import PostsService


router = APIRouter(prefix="/api/posts", tags=["posts"])


@router.post("/get-posts")
def get_posts(ids: List[int] = Body(...), db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return [dto.model_dump() for dto in PostsService(db).get_posts(ids)]


@router.get("/get-post/{id}")
def get_post(id: int, db: Session = Depends(get_db)) -> Dict[str, Any]:
    dto = PostsService(db).get_post(id)
    return {} if dto is None else dto.model_dump()


@router.post("/delete")
def delete_post(postId: int = Body(...), user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)) -> Dict[str, Any]:
    PostsService(db).delete_post(postId, user_id)
    return {}


@router.post("/create")
async def create_post(
    text: Optional[str] = Form(None),
    parentId: Optional[int] = Form(None),
    images: Optional[list[UploadFile]] = None,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    try:
        dto = PostsService(db).create_post(user_id=user_id, text=text, parent_id=parentId, images=images)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    return dto.model_dump()


@router.post("/pin")
def pin_post(postId: int, user_id: int = Depends(get_current_user_id)) -> Dict[str, Any]:
    # Phase 2 stub: handled in Phase 3 with users service integration to update pinnedPostId
    return {}


@router.post("/unpin")
def unpin_post(postId: int, user_id: int = Depends(get_current_user_id)) -> Dict[str, Any]:
    # Phase 2 stub: handled in Phase 3
    return {}


