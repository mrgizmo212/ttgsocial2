from __future__ import annotations

from sqlalchemy import Column, Integer, TIMESTAMP

from ..db import Base


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    bookmarked_by = Column(Integer, nullable=False)
    bookmarked_post = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, nullable=True)


