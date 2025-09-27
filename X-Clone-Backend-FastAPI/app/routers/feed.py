from __future__ import annotations

from typing import Any, Dict, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, desc
from sqlalchemy.orm import Session

from ..db import get_db
from ..models.post import Post
from ..security.jwt import get_current_user_id
from ..services.edge_rank import EdgeRankService


router = APIRouter(prefix="/api/feed", tags=["feed"])


@router.get("/get-feed-page")
def get_feed_page(
    type: str,
    cursor: int = 0,
    userId: Optional[int] = None,
    limit: int = 10,
    db: Session = Depends(get_db),
    maybe_user_id: Optional[int] = Depends(lambda: None),
) -> Dict[str, Any]:
    requires_auth = type.lower() in {"bookmarks", "notifications", "foryou", "following"}

    # Parity quirk: "For You" (with space) isn't enforced in Java due to .toLowerCase() check; we keep same behavior

    ids: list[int]
    if type.lower() == "foryou" and userId:
        # Use EdgeRank for ForYou when a userId is present
        ids = EdgeRankService(db).generate_ranked_post_ids(userId, limit)
    else:
        # Default chronological
        query = select(Post.id).order_by(desc(Post.created_at)).limit(limit)
        if cursor:
            # cursor is milliseconds since epoch; convert to UTC datetime for TIMESTAMP compare
            cursor_dt = datetime.utcfromtimestamp(cursor / 1000.0)
            query = (
                select(Post.id)
                .where(Post.created_at <= cursor_dt)
                .order_by(desc(Post.created_at))
                .limit(limit)
            )
        ids = [r[0] for r in db.execute(query).all()]
    next_cursor = None
    if ids and len(ids) == limit:
        last = db.get(Post, ids[-1])
        if last and last.created_at:
            next_cursor = int(last.created_at.timestamp() * 1000)
    return {"posts": ids, "nextCursor": next_cursor}


