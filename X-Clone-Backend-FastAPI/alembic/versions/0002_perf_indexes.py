"""performance indexes

Revision ID: 0002_perf_indexes
Revises: 0001_initial
Create Date: 2025-09-26
"""

from alembic import op
import sqlalchemy as sa

revision = "0002_perf_indexes"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_index("ix_posts_created_at", "posts", ["created_at"], unique=False)
    op.create_index("ix_likes_post_id", "likes", ["post_id"], unique=False)
    op.create_index("ix_bookmarks_post", "bookmarks", ["bookmarked_post"], unique=False)
    op.create_index("ix_retweets_ref", "retweets", ["reference_id"], unique=False)
    op.create_index("ix_post_media_post", "post_media", ["post_id"], unique=False)
    op.create_index("ix_follows_follower", "follows", ["follower_id"], unique=False)
    op.create_index("ix_follows_followed", "follows", ["followed_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_follows_followed", table_name="follows")
    op.drop_index("ix_follows_follower", table_name="follows")
    op.drop_index("ix_post_media_post", table_name="post_media")
    op.drop_index("ix_retweets_ref", table_name="retweets")
    op.drop_index("ix_bookmarks_post", table_name="bookmarks")
    op.drop_index("ix_likes_post_id", table_name="likes")
    op.drop_index("ix_posts_created_at", table_name="posts")


