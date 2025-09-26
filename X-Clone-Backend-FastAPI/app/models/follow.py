from __future__ import annotations

from sqlalchemy import Column, Integer

from ..db import Base


class Follow(Base):
    __tablename__ = "follows"

    id = Column(Integer, primary_key=True, autoincrement=True)
    follower_id = Column(Integer, nullable=False)
    followed_id = Column(Integer, nullable=False)


