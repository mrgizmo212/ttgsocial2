from __future__ import annotations

from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session

from ..db import get_db
from ..security.jwt import get_current_user_id
from ..services.polls import PollsService


router = APIRouter(prefix="/api/polls", tags=["polls"])


@router.get("/{pollId}/choices")
def get_choices(pollId: int, db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return PollsService(db).get_choices(pollId)


@router.post("/submit-vote")
def submit_vote(body: Dict[str, int] = Body(...), user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    try:
        return PollsService(db).submit_vote(voter_id=user_id, poll_id=body["pollId"], choice_id=body["choiceId"])
    except ValueError:
        # parity: 409 on duplicate
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Duplicate vote")


@router.get("/{pollId}/getPollVote")
def get_poll_vote(pollId: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)) -> int:
    return PollsService(db).get_poll_vote(voter_id=user_id, poll_id=pollId)


