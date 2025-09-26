from __future__ import annotations

import random
import string
from typing import Tuple

from sqlalchemy.orm import Session

from ..config import get_settings
from ..models import User
from ..security.jwt import create_token
from .users import UsersService


def _random_username() -> str:
    return "user_" + "".join(random.choices(string.ascii_lowercase + string.digits, k=8))


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.users = UsersService(db)

    def demo_signup(self) -> Tuple[str, dict]:
        """Create a temporary user and return token + UserDTO, matching Java's /demo-signup."""
        user = User(username=_random_username())
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        settings = get_settings()
        token = create_token(user.id, settings)

        dto = self.users.to_dto(user).model_dump()
        return token, dto


