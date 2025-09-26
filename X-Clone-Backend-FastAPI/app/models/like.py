from __future__ import annotations

from sqlalchemy import Column, Integer, TIMESTAMP

from ..db import Base


class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    liker_id = Column(Integer, nullable=False)
    post_id = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, nullable=True)


