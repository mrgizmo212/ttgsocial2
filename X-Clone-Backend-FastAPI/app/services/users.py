from __future__ import annotations

from typing import List, Optional, Tuple

from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from ..models import User, Follow
from ..schemas.user import UserDTO
from ..storage.local import LocalStorage
from fastapi import UploadFile


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
        """Return discover users with simple, robust pagination.

        Use descending ID order (newest first). If a cursor is provided, it is
        treated as the last seen user ID and we fetch IDs strictly less than it.
        This avoids issues when created_at is NULL for demo users.
        """
        base = select(User.id)
        if cursor and cursor > 0:
            base = base.where(User.id < cursor)
        query = base.order_by(desc(User.id)).limit(limit)

        ids = [r[0] for r in self.db.execute(query).all()]
        next_cursor = ids[-1] if ids and len(ids) == limit else None
        return {"users": ids, "nextCursor": next_cursor}

    def update_user_profile(
        self,
        user_id: int,
        display_name: Optional[str],
        username: Optional[str],
        bio: Optional[str],
        profile_picture: Optional[UploadFile] = None,
        banner_image: Optional[UploadFile] = None,
    ) -> UserDTO:
        user = self.db.get(User, user_id)
        if not user:
            raise ValueError("User not found")

        # Username uniqueness check (if changed)
        if username and username != user.username:
            existing = (
                self.db.execute(select(User).where(User.username == username)).scalars().first()
            )
            if existing and existing.id != user_id:
                raise ValueError("Username already exists")

        if username:
            user.username = username

        if display_name is not None:
            user.display_name = display_name

        if bio is not None:
            user.bio = bio

        storage = LocalStorage()
        if profile_picture is not None and getattr(profile_picture, "filename", None):
            _, url = storage.save(profile_picture)
            user.profile_picture_url = url

        if banner_image is not None and getattr(banner_image, "filename", None):
            _, url = storage.save(banner_image)
            user.banner_image_url = url

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return self.to_dto(user)


