from __future__ import annotations

from typing import Any, Dict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from ..security.jwt import get_current_user_id
from ..services.posts import PostsService
from ..models import Retweet


router = APIRouter(prefix="/api/retweets", tags=["retweets"])


@router.post("/create")
def retweet_create(body: Dict[str, Any], user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)) -> Dict[str, Any]:
    reference_id = body.get("referenceId")
    if reference_id is None:
        return {"error": "referenceId required"}
    exists = db.query(Retweet).filter(Retweet.retweeter_id == user_id, Retweet.reference_id == reference_id).first()
    if not exists:
        db.add(Retweet(retweeter_id=user_id, reference_id=reference_id, type=str(body.get("type") or "post")))
        db.commit()
    return PostsService(db).get_post(reference_id).model_dump()


@router.post("/delete")
def retweet_delete(body: Dict[str, Any], user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)) -> Dict[str, Any]:
    reference_id = body.get("referenceId")
    if reference_id is None:
        return {"error": "referenceId required"}
    row = db.query(Retweet).filter(Retweet.retweeter_id == user_id, Retweet.reference_id == reference_id).first()
    if row:
        db.delete(row)
        db.commit()
    return PostsService(db).get_post(reference_id).model_dump()


