from __future__ import annotations

from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP

from ..db import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    receiver_id = Column(Integer, nullable=False)
    sender_id = Column(Integer, nullable=False)
    type = Column(String(64), nullable=False)
    reference_id = Column(Integer, nullable=True)
    text = Column(String(1024), nullable=True)
    seen = Column(Boolean, nullable=False, default=False)
    created_at = Column(TIMESTAMP, nullable=True)


