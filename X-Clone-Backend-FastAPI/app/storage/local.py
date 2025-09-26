from __future__ import annotations

import os
import uuid
from pathlib import Path
from typing import Tuple

from fastapi import UploadFile

from ..config import get_settings


class LocalStorage:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.base_path = Path(self.settings.storage_base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
        self.public_base = self.settings.storage_public_base_url.rstrip("/")

    def save(self, file: UploadFile) -> Tuple[str, str]:
        """Save file and return (file_name, public_url)."""
        ext = Path(file.filename or "").suffix
        name = f"{uuid.uuid4().hex}{ext}"
        target = self.base_path / name
        with target.open("wb") as f:
            # reading in chunks
            while True:
                chunk = file.file.read(1024 * 1024)
                if not chunk:
                    break
                f.write(chunk)
        url = f"{self.public_base}/{name}"
        return name, url


