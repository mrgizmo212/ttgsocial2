from __future__ import annotations

from fastapi import APIRouter


router = APIRouter(prefix="/health", tags=["health"])


@router.get("/ready")
def ready() -> dict[str, str]:
    return {"status": "ready"}


@router.get("/live")
def live() -> dict[str, str]:
    return {"status": "live"}


