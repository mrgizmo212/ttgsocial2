from __future__ import annotations

import uuid
from pathlib import Path
from typing import Tuple

from fastapi import UploadFile
from supabase import create_client, Client

from ..config import get_settings


class SupabaseStorage:
    def __init__(self) -> None:
        settings = get_settings()
        if not settings.supabase_url or not settings.supabase_service_role:
            raise RuntimeError("Supabase credentials missing")
        self.client: Client = create_client(settings.supabase_url, settings.supabase_service_role)
        self.bucket = settings.supabase_bucket

    def save(self, file: UploadFile, user_id: int | None = None) -> Tuple[str, str]:
        ext = Path(file.filename or "").suffix
        # Per-user namespace to avoid cross-over
        prefix = f"user_{user_id or 'anon'}"
        name = f"{prefix}/{uuid.uuid4().hex}{ext}"
        content = file.file.read()
        self.client.storage.from_(self.bucket).upload(path=name, file=content, file_options={"content-type": file.content_type or "application/octet-stream"})
        url = self.client.storage.from_(self.bucket).get_public_url(name)
        return name, url


