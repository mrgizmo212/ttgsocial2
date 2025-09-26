from __future__ import annotations

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment.

    Required env vars:
      - JWT_SECRET
    Optional env vars:
      - DATABASE_URL (default: sqlite:///./dev.db)
      - STORAGE_BASE_PATH (default: ./uploads)
      - STORAGE_PUBLIC_BASE_URL (default: http://localhost:8080/media)
      - CORS_ORIGINS (comma-separated list)
    """

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # Database
    database_url: str = "sqlite:///./dev.db"

    # Security
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24

    # CORS
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:8080",
    ]

    # Storage (media)
    storage_base_path: str = "./uploads"
    storage_public_base_url: str = "http://localhost:8080/media"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]


