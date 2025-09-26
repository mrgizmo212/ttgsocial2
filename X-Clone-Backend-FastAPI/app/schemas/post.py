from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class PostMediaDTO(BaseModel):
    id: Optional[int] = None
    postId: Optional[int] = None
    fileName: Optional[str] = None
    mimeType: Optional[str] = None
    url: Optional[str] = None
    createdAt: Optional[datetime] = None


class PostDTO(BaseModel):
    id: int
    userId: int
    text: Optional[str] = None
    createdAt: Optional[datetime] = None
    likedBy: List[int]
    bookmarkedBy: List[int]
    replies: List[int]
    parentId: Optional[int] = None
    retweetedBy: List[int]
    postMedia: List[PostMediaDTO]
    pollId: Optional[int] = None
    pollExpiryTimeStamp: Optional[datetime] = None

    class Config:
        from_attributes = True


