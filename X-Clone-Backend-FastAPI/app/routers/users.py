from __future__ import annotations

from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session

from ..db import get_db
from ..services.users import UsersService


router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/get-user")
def get_user(id: int = Query(...), db: Session = Depends(get_db)) -> Dict[str, Any]:
    dto = UsersService(db).get_user(id)
    return {} if dto is None else dto.model_dump()


@router.post("/get-users")
def get_users(ids: List[int] = Body(...), db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    return [dto.model_dump() for dto in UsersService(db).get_users(ids)]


@router.get("/get-top-five")
def get_top_five(db: Session = Depends(get_db)) -> List[int]:
    return UsersService(db).get_top_five_ids()


@router.get("/search")
def search(q: str, db: Session = Depends(get_db)) -> List[int]:
    return UsersService(db).search_user_ids(q)


@router.get("/get-discover")
def get_discover(cursor: int = 0, limit: int = 10, db: Session = Depends(get_db)) -> Dict[str, Any]:
    return UsersService(db).get_paginated_top_users(cursor, limit)


