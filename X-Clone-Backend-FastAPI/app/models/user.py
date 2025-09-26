from __future__ import annotations

from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP

from ..db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    # name -> username per JPA mapping
    username = Column(String(64), nullable=False, unique=True, name="name")
    password = Column(String(255), nullable=True)
    google_id = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    display_name = Column(String(255), nullable=True)
    profile_picture_url = Column(String(1024), nullable=True)
    banner_image_url = Column(String(1024), nullable=True)
    verified = Column(Boolean, nullable=False, default=False)
    bio = Column(String(2048), nullable=True)
    created_at = Column(TIMESTAMP, nullable=True)
    pinned_post_id = Column(Integer, nullable=True)


