from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class UserDTO(BaseModel):
    id: int
    username: str
    email: Optional[str] = None
    bio: Optional[str] = None
    displayName: Optional[str] = None
    posts: List[int]
    bookmarkedPosts: List[int]
    likedPosts: List[int]
    followers: List[int]
    following: List[int]
    createdAt: Optional[datetime] = None
    replies: List[int]
    retweets: List[int]
    profilePictureUrl: Optional[str] = None
    bannerImageUrl: Optional[str] = None
    pinnedPostId: Optional[int] = None
    verified: bool

    class Config:
        from_attributes = True


