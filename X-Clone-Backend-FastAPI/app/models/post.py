from __future__ import annotations

from sqlalchemy import Column, Integer, String, TIMESTAMP

from ..db import Base


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=False)
    parent_id = Column(Integer, nullable=True)
    text = Column(String(180), nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)


