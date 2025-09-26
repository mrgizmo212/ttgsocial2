from __future__ import annotations

from dataclasses import dataclass
from math import log
from typing import List, Set, Dict

from sqlalchemy import select, desc, func
from sqlalchemy.orm import Session

from ..models.post import Post
from ..models.like import Like
from ..models.post_media import PostMedia
from ..services.users import UsersService


@dataclass
class PostRank:
    post: Post
    affinity: float = 0.0
    weight: float = 0.0
    time_decay: float = 0.0

    @property
    def total_score(self) -> float:
        return self.affinity + self.weight + self.time_decay


class EdgeRankService:
    def __init__(self, db: Session):
        self.db = db
        self.users_service = UsersService(db)

    def generate_ranked_post_ids(self, user_id: int, limit: int) -> List[int]:
        # Fetch recent top-level posts (cap to reduce work and latency)
        posts: List[Post] = (
            self.db.execute(
                select(Post)
                .where(Post.parent_id.is_(None))
                .order_by(desc(Post.created_at))
                .limit(200)
            )
            .scalars()
            .all()
        )
        post_ranks: List[PostRank] = [PostRank(post=p) for p in posts]

        feed_user = self.users_service.get_user(user_id)
        if feed_user is None:
            # fallback chronological if no user
            posts_sorted = sorted(posts, key=lambda p: (p.created_at or 0), reverse=True)
            return [p.id for p in posts_sorted[:limit]]

        # Build caches to avoid N+1 queries
        post_ids = [p.id for p in posts]
        author_to_posts: Dict[int, Set[int]] = {}
        for p in posts:
            author_to_posts.setdefault(p.user_id, set()).add(p.id)

        # Likes per post
        likes_counts: Dict[int, int] = {
            pid: cnt
            for pid, cnt in self.db.execute(
                select(Like.post_id, func.count(Like.id))
                .where(Like.post_id.in_(post_ids))
                .group_by(Like.post_id)
            ).all()
        }

        # Media existence per post
        media_set: Set[int] = {
            r[0]
            for r in self.db.execute(
                select(PostMedia.post_id).where(PostMedia.post_id.in_(post_ids)).distinct()
            ).all()
        }

        # User liked posts among candidate set
        user_liked_set: Set[int] = {
            r[0]
            for r in self.db.execute(
                select(Like.post_id).where(
                    Like.liker_id == user_id, Like.post_id.in_(post_ids)
                )
            ).all()
        }

        # User replied parent ids among candidate set
        user_replied_parent_set: Set[int] = {
            r[0]
            for r in self.db.execute(
                select(Post.parent_id).where(
                    Post.user_id == user_id, Post.parent_id.in_(post_ids)
                )
            ).all()
            if r[0] is not None
        }

        self._compute_total_scores(
            post_ranks,
            feed_user,
            author_to_posts,
            likes_counts,
            media_set,
            user_liked_set,
            user_replied_parent_set,
        )
        post_ranks.sort(key=lambda pr: pr.total_score, reverse=True)
        return [pr.post.id for pr in post_ranks[:limit]]

    def _compute_total_scores(
        self,
        post_ranks: List[PostRank],
        feed_user,
        author_to_posts: Dict[int, Set[int]],
        likes_counts: Dict[int, int],
        media_set: Set[int],
        user_liked_set: Set[int],
        user_replied_parent_set: Set[int],
    ) -> None:
        # build convenience sets for affinity checks
        following_set: Set[int] = set(feed_user.following)
        for pr in post_ranks:
            # own recent post boost (<= 6 hours)
            if self._is_own_recent_post(pr, feed_user):
                continue
            author_post_ids = author_to_posts.get(pr.post.user_id, set())
            # affinity
            pr.affinity += self._compute_following_affinity(following_set, pr.post.user_id)
            # liked any of author's posts
            if any(pid in user_liked_set for pid in author_post_ids):
                pr.affinity += 0.5
            # replied to any of author's posts
            if any(pid in user_replied_parent_set for pid in author_post_ids):
                pr.affinity += 0.5

            # weights
            if pr.post.id in media_set:
                pr.weight += 0.4
            pr.weight += float(log(likes_counts.get(pr.post.id, 0) + 1))

            # time decay
            pr.time_decay += self._compute_time_decay(pr.post)

    def _is_own_recent_post(self, pr: PostRank, feed_user) -> bool:
        try:
            if pr.post.user_id == feed_user.id and pr.post.created_at is not None:
                hours = self._hours_since(pr.post)
                if hours is not None and hours <= 6:
                    # match Java behavior: strong boost
                    pr.affinity += 2000 + pr.post.id
                    pr.weight += 2000 + pr.post.id
                    return True
        except Exception:
            pass
        return False

    def _compute_following_affinity(self, following_set: Set[int], post_owner_id: int) -> float:
        return 2.0 if post_owner_id in following_set else 1.0

    # helpers removed: affinity now uses precomputed sets

    def _compute_has_media_weight(self, post_id: int) -> float:
        has_media = (
            self.db.query(PostMedia).filter(PostMedia.post_id == post_id).limit(1).first()
            is not None
        )
        return 0.4 if has_media else 0.0

    def _compute_like_weight(self, post_id: int) -> float:
        count = self.db.query(Like).filter(Like.post_id == post_id).count()
        return float(log(count + 1))

    def _compute_time_decay(self, post: Post) -> float:
        if not post.created_at:
            return 0.0
        hours = self._hours_since(post)
        if hours is None:
            return 0.0
        # 1 / (hours+1)^4 per Java
        return 1.0 / pow(hours + 1, 4.0)

    def _hours_since(self, post: Post):
        try:
            from datetime import datetime, timezone

            created = post.created_at
            if hasattr(created, "timestamp"):
                # assume naive UTC for sqlite timestamps
                now = datetime.now(timezone.utc)
                created_dt = created
                if created.tzinfo is None:
                    created_dt = created.replace(tzinfo=timezone.utc)
                delta = now - created_dt
                return delta.total_seconds() / 3600.0
        except Exception:
            return None
        return None
