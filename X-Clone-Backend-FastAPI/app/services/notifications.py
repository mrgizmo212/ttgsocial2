from __future__ import annotations

from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models.notification import Notification
from ..schemas.notification import NotificationDTO


class NotificationsService:
    def __init__(self, db: Session):
        self.db = db

    def get_unseen_and_mark_seen(self, user_id: int) -> List[int]:
        unseen = self.db.query(Notification).filter(Notification.receiver_id == user_id, Notification.seen == False).all()
        ids = [n.id for n in unseen]
        for n in unseen:
            n.seen = True
        if unseen:
            self.db.commit()
        return ids

    def get_notifications(self, ids: List[int]) -> List[NotificationDTO]:
        if not ids:
            return []
        rows = self.db.execute(select(Notification).where(Notification.id.in_(ids))).scalars().all()
        return [NotificationDTO(
            id=n.id,
            receiverId=n.receiver_id,
            senderId=n.sender_id,
            type=n.type,
            referenceId=n.reference_id,
            text=n.text,
            seen=bool(n.seen),
            createdAt=n.created_at,
        ) for n in rows]


