from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import get_settings
from .routers.health import router as health_router
from .routers.auth import router as auth_router
from .routers.users import router as users_router
from .routers.posts import router as posts_router
from .routers.likes import router as likes_router
from .routers.bookmarks import router as bookmarks_router
from .routers.retweets import router as retweets_router
from .routers.follows import router as follows_router
from .routers.notifications import router as notifications_router
from .routers.feed import router as feed_router
from .routers.polls import router as polls_router


settings = get_settings()

app = FastAPI(title="TTG SOCIAL", version="0.1.0")

# CORS for dev parity (Vite dev server 5173 and same-origin 8080)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Media static mount (for future LocalStorage adapter)
uploads_dir = Path(settings.storage_base_path)
uploads_dir.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=str(uploads_dir), html=False), name="media")


# Routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(posts_router)
app.include_router(likes_router)
app.include_router(bookmarks_router)
app.include_router(retweets_router)
app.include_router(follows_router)
app.include_router(notifications_router)
app.include_router(feed_router)
app.include_router(polls_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"status": "ok"}


