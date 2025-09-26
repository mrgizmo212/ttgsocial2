from __future__ import annotations

from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session

from ..db import get_db
from ..security.jwt import get_current_user_id
from ..services.notifications import NotificationsService


router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("/get-unseen")
def get_unseen(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)) -> List[int]:
    return NotificationsService(db).get_unseen_and_mark_seen(user_id)


@router.post("/get-notifications")
def get_notifications(ids: List[int] = Body(...), db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return [dto.model_dump() for dto in NotificationsService(db).get_notifications(ids)]


