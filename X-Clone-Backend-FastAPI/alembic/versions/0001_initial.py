"""initial schema

Revision ID: 0001_initial
Revises: 
Create Date: 2025-09-26

"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=64), nullable=False, unique=True),
        sa.Column("password", sa.String(length=255), nullable=True),
        sa.Column("google_id", sa.String(length=255), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("display_name", sa.String(length=255), nullable=True),
        sa.Column("profile_picture_url", sa.String(length=1024), nullable=True),
        sa.Column("banner_image_url", sa.String(length=1024), nullable=True),
        sa.Column("verified", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("bio", sa.String(length=2048), nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=True),
        sa.Column("pinned_post_id", sa.Integer(), nullable=True),
    )

    op.create_table(
        "follows",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("follower_id", sa.Integer(), nullable=False),
        sa.Column("followed_id", sa.Integer(), nullable=False),
    )

    op.create_table(
        "posts",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("parent_id", sa.Integer(), nullable=True),
        sa.Column("text", sa.String(length=180), nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=True),
    )

    op.create_table(
        "likes",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("liker_id", sa.Integer(), nullable=False),
        sa.Column("post_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=True),
    )

    op.create_table(
        "bookmarks",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("bookmarked_by", sa.Integer(), nullable=False),
        sa.Column("bookmarked_post", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=True),
    )

    op.create_table(
        "retweets",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("reference_id", sa.Integer(), nullable=False),
        sa.Column("retweeter_id", sa.Integer(), nullable=False),
        sa.Column("type", sa.String(length=32), nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=True),
    )

    op.create_table(
        "post_media",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("post_id", sa.Integer(), nullable=False),
        sa.Column("file_name", sa.String(length=512), nullable=True),
        sa.Column("mime_type", sa.String(length=128), nullable=True),
        sa.Column("url", sa.String(length=2048), nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=True),
    )

    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("receiver_id", sa.Integer(), nullable=False),
        sa.Column("sender_id", sa.Integer(), nullable=False),
        sa.Column("type", sa.String(length=64), nullable=False),
        sa.Column("reference_id", sa.Integer(), nullable=True),
        sa.Column("text", sa.String(length=1024), nullable=True),
        sa.Column("seen", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("created_at", sa.TIMESTAMP(), nullable=True),
    )

    op.create_table(
        "polls",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("post_id", sa.Integer(), nullable=False),
        sa.Column("expiry", sa.TIMESTAMP(), nullable=True),
    )

    op.create_table(
        "poll_choices",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("poll_id", sa.Integer(), nullable=False),
        sa.Column("text", sa.String(length=255), nullable=False),
    )

    op.create_table(
        "poll_votes",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("poll_id", sa.Integer(), nullable=False),
        sa.Column("choice_id", sa.Integer(), nullable=False),
        sa.Column("voter_id", sa.Integer(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("poll_votes")
    op.drop_table("poll_choices")
    op.drop_table("polls")
    op.drop_table("notifications")
    op.drop_table("post_media")
    op.drop_table("retweets")
    op.drop_table("bookmarks")
    op.drop_table("likes")
    op.drop_table("posts")
    op.drop_table("follows")
    op.drop_table("users")


