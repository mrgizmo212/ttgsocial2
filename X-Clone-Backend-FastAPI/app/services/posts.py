from __future__ import annotations

from typing import List, Optional

from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from ..models import Post, Like, Bookmark, Retweet
from ..models.post_media import PostMedia
from ..schemas.post import PostDTO, PostMediaDTO
from ..storage.local import LocalStorage
from ..storage.supabase import SupabaseStorage
from ..config import get_settings


class PostsService:
    def __init__(self, db: Session):
        self.db = db

    def _collect_post_lists(self, post_id: int) -> tuple[list[int], list[int], list[int], list[int], list[PostMediaDTO], Optional[int], Optional[int]]:
        liked_by = [row.liker_id for row in self.db.query(Like).filter(Like.post_id == post_id).all()]
        bookmarked_by = [row.bookmarked_by for row in self.db.query(Bookmark).filter(Bookmark.bookmarked_post == post_id).all()]
        # Replies are posts whose parent_id equals this post's id
        replies: list[int] = [r[0] for r in self.db.execute(select(Post.id).where(Post.parent_id == post_id)).all()]
        retweeted_by = [row.retweeter_id for row in self.db.query(Retweet).filter(Retweet.reference_id == post_id).all()]
        # Include persisted media for this post
        media_rows = self.db.query(PostMedia).filter(PostMedia.post_id == post_id).all()
        post_media: list[PostMediaDTO] = [
            PostMediaDTO(
                id=m.id,
                postId=m.post_id,
                fileName=m.file_name,
                mimeType=m.mime_type,
                url=m.url,
                createdAt=m.created_at,
            )
            for m in media_rows
        ]
        poll_id: Optional[int] = None
        poll_expiry: Optional[int] = None
        return liked_by, bookmarked_by, replies, retweeted_by, post_media, poll_id, poll_expiry

    def to_dto(self, post: Post) -> PostDTO:
        liked_by, bookmarked_by, replies, retweeted_by, post_media, poll_id, poll_expiry = self._collect_post_lists(post.id)
        return PostDTO(
            id=post.id,
            userId=post.user_id,
            text=post.text,
            createdAt=post.created_at,
            likedBy=liked_by,
            bookmarkedBy=bookmarked_by,
            replies=replies,
            parentId=post.parent_id,
            retweetedBy=retweeted_by,
            postMedia=post_media,
            pollId=poll_id,
            pollExpiryTimeStamp=None,
        )

    def get_post(self, post_id: int) -> Optional[PostDTO]:
        post = self.db.get(Post, post_id)
        if post is None:
            return None
        return self.to_dto(post)

    def get_posts(self, ids: List[int]) -> List[PostDTO]:
        if not ids:
            return []
        posts = self.db.execute(select(Post).where(Post.id.in_(ids))).scalars().all()
        return [self.to_dto(p) for p in posts]

    def create_post(self, user_id: int, text: Optional[str], parent_id: Optional[int], images: Optional[list] = None) -> PostDTO:
        if (text is None or len(text) < 1) and not images:
            # Parity with Java IllegalStateException when both text and images missing
            raise ValueError("Text or images are mandatory")
        post = Post(user_id=user_id, text=text, parent_id=parent_id)
        self.db.add(post)
        self.db.commit()
        self.db.refresh(post)
        # Save images if present
        media_dtos: list[PostMediaDTO] = []
        if images:
            settings = get_settings()
            storage = (
                SupabaseStorage() if settings.storage_provider == "supabase" else LocalStorage()
            )
            for file in images:
                file_name, url = storage.save(file, user_id=user_id) if isinstance(storage, SupabaseStorage) else storage.save(file)
                media = PostMedia(post_id=post.id, file_name=file_name, mime_type=getattr(file, "content_type", None), url=url)
                self.db.add(media)
                self.db.commit()
                self.db.refresh(media)
                media_dtos.append(PostMediaDTO(id=media.id, postId=post.id, fileName=file_name, mimeType=media.mime_type, url=url))

        # Recompose DTO with media
        dto = self.to_dto(post).model_copy(update={"postMedia": media_dtos})
        return dto

    def delete_post(self, post_id: int, request_user_id: int) -> None:
        post = self.db.get(Post, post_id)
        if post is None:
            return
        if post.user_id != request_user_id:
            raise PermissionError("Forbidden")
        # Phase 2: cascade replies not implemented; parity later in Phase 3
        self.db.delete(post)
        self.db.commit()


