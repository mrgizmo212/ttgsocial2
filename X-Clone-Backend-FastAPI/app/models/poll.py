from __future__ import annotations

from sqlalchemy import Column, Integer, String, TIMESTAMP

from ..db import Base


class Poll(Base):
    __tablename__ = "polls"
    id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, nullable=False)
    expiry = Column(TIMESTAMP, nullable=True)


class PollChoice(Base):
    __tablename__ = "poll_choices"
    id = Column(Integer, primary_key=True, autoincrement=True)
    poll_id = Column(Integer, nullable=False)
    text = Column(String(255), nullable=False)


class PollVote(Base):
    __tablename__ = "poll_votes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    poll_id = Column(Integer, nullable=False)
    choice_id = Column(Integer, nullable=False)
    voter_id = Column(Integer, nullable=False)


