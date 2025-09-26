from __future__ import annotations

from sqlalchemy import Column, Integer, String, TIMESTAMP

from ..db import Base


class Retweet(Base):
    __tablename__ = "retweets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    reference_id = Column(Integer, nullable=False)
    retweeter_id = Column(Integer, nullable=False)
    type = Column(String(32), nullable=False)
    created_at = Column(TIMESTAMP, nullable=True)


