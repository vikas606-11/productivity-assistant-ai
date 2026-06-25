"""
Productivity Assistant AI - Configuration Module
Centralised configuration loaded from environment variables.
"""

import os
from dotenv import load_dotenv

# Load variables from .env (if present)
load_dotenv()


class Config:
    """Base configuration — values are read from environment variables."""

    # ── Server ────────────────────────────────────────────────────────────────
    HOST: str = os.getenv("FLASK_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("FLASK_PORT", 5000))
    DEBUG: bool = os.getenv("FLASK_DEBUG", "true").lower() == "true"

    # ── Security ──────────────────────────────────────────────────────────────
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")

    # ── Database ──────────────────────────────────────────────────────────────
    DATABASE_URI: str = os.getenv(
        "DATABASE_URI",
        os.path.join(os.path.dirname(__file__), "productivity_assistant.db"),
    )

    # ── Google Gemini AI ──────────────────────────────────────────────────────
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")

    # ── CORS ──────────────────────────────────────────────────────────────────
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")


class DevelopmentConfig(Config):
    """Development-specific overrides."""
    DEBUG = True


class ProductionConfig(Config):
    """Production-specific overrides."""
    DEBUG = False
