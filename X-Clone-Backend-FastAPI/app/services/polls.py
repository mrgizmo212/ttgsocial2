from __future__ import annotations

from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models.poll import Poll, PollChoice, PollVote


class PollsService:
    def __init__(self, db: Session):
        self.db = db

    def get_choices(self, poll_id: int) -> List[dict]:
        rows = self.db.execute(select(PollChoice).where(PollChoice.poll_id == poll_id)).scalars().all()
        return [{"id": r.id, "pollId": r.poll_id, "text": r.text} for r in rows]

    def submit_vote(self, voter_id: int, poll_id: int, choice_id: int) -> List[dict]:
        # conflict if exists
        exists = self.db.query(PollVote).filter(PollVote.poll_id == poll_id, PollVote.voter_id == voter_id).first()
        if exists:
            raise ValueError("Duplicate vote")
        self.db.add(PollVote(poll_id=poll_id, choice_id=choice_id, voter_id=voter_id))
        self.db.commit()
        return self.get_choices(poll_id)

    def get_poll_vote(self, voter_id: int, poll_id: int) -> int:
        row = self.db.query(PollVote).filter(PollVote.poll_id == poll_id, PollVote.voter_id == voter_id).first()
        return row.choice_id if row else -1


