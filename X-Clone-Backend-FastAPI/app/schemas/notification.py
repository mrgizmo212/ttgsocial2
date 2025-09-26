from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class NotificationDTO(BaseModel):
    id: int
    receiverId: int
    senderId: int
    type: str
    referenceId: Optional[int] = None
    text: Optional[str] = None
    seen: bool
    createdAt: Optional[datetime] = None

    class Config:
        from_attributes = True


