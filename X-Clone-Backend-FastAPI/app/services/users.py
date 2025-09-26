from __future__ import annotations

from typing import List, Optional, Tuple

from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from ..models import User, Follow
from ..schemas.user import UserDTO


class UsersService:
    def __init__(self, db: Session):
        self.db = db

    def _collect_user_lists(self, user_id: int) -> Tuple[List[int], List[int], List[int], List[int], List[int], List[int]]:
        # posts, bookmarkedPosts, likedPosts, followers, following, replies, retweets placeholders
        # Phase 1: return empty arrays for lists we don't implement yet; endpoints requiring them will still shape-match
        posts: List[int] = []
        bookmarked: List[int] = []
        liked: List[int] = []

        following: List[int] = [row.followed_id for row in self.db.query(Follow).filter(Follow.follower_id == user_id).all()]
        followers: List[int] = [row.follower_id for row in self.db.query(Follow).filter(Follow.followed_id == user_id).all()]

        replies: List[int] = []
        retweets: List[int] = []
        return posts, bookmarked, liked, followers, following, replies, retweets

    def to_dto(self, user: User) -> UserDTO:
        posts, bookmarked, liked, followers, following, replies, retweets = self._collect_user_lists(user.id)
        return UserDTO(
            id=user.id,
            username=user.username,
            email=user.email,
            bio=user.bio,
            displayName=user.display_name,
            posts=posts,
            bookmarkedPosts=bookmarked,
            likedPosts=liked,
            followers=followers,
            following=following,
            createdAt=user.created_at,
            replies=replies,
            retweets=retweets,
            profilePictureUrl=user.profile_picture_url,
            bannerImageUrl=user.banner_image_url,
            pinnedPostId=user.pinned_post_id,
            verified=bool(user.verified),
        )

    def get_user(self, user_id: int) -> Optional[UserDTO]:
        user = self.db.get(User, user_id)
        if user is None:
            return None
        return self.to_dto(user)

    def get_users(self, ids: List[int]) -> List[UserDTO]:
        if not ids:
            return []
        users = self.db.execute(select(User).where(User.id.in_(ids))).scalars().all()
        return [self.to_dto(u) for u in users]

    def get_top_five_ids(self) -> List[int]:
        # Parity note: Java returns 4 IDs by default
        rows = self.db.execute(select(User.id).order_by(desc(User.id)).limit(4)).all()
        return [r[0] for r in rows]

    def search_user_ids(self, q: str) -> List[int]:
        if not q:
            return []
        # Simple contains on username or display_name
        rows = self.db.execute(
            select(User.id).where((User.username.ilike(f"%{q}%")) | (User.display_name.ilike(f"%{q}%")))
        ).all()
        return [r[0] for r in rows]

    def get_paginated_top_users(self, cursor: int, limit: int) -> dict:
        # Approximate: order by created_at desc with cursor as timestamp boundary
        query = select(User.id).order_by(desc(User.created_at)).limit(limit)
        if cursor:
            from sqlalchemy import and_
            query = select(User.id).where(User.created_at <= (cursor)).order_by(desc(User.created_at)).limit(limit)
        ids = [r[0] for r in self.db.execute(query).all()]
        next_cursor = None
        if ids and len(ids) == limit:
            last_user = self.db.get(User, ids[-1])
            if last_user and last_user.created_at:
                next_cursor = int(last_user.created_at.timestamp() * 1000)
        return {"users": ids, "nextCursor": next_cursor}


