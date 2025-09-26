from __future__ import annotations

from sqlalchemy import Column, Integer, String, TIMESTAMP

from ..db import Base


class PostMedia(Base):
    __tablename__ = "post_media"

    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, nullable=False)
    file_name = Column(String(512), nullable=True)
    mime_type = Column(String(128), nullable=True)
    url = Column(String(2048), nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)


