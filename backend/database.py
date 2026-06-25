"""
Productivity Assistant AI - Database Module
Handles SQLite database initialization and connection management.
"""

import sqlite3
import os
from flask import g
from config import Config


def get_db():
    """
    Get a database connection from Flask's application context.
    Creates a new connection if one doesn't exist.
    """
    if "db" not in g:
        g.db = sqlite3.connect(
            Config.DATABASE_URI,
            detect_types=sqlite3.PARSE_DECLTYPES,
        )
        g.db.row_factory = sqlite3.Row  # Return rows as dict-like objects

    return g.db


def close_db(error=None):
    """Close the database connection at the end of a request."""
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db(app):
    """
    Initialize the database schema.
    Creates tables if they do not already exist.
    """
    with app.app_context():
        db = get_db()
        # Schema will be applied in future commits
        # Placeholder: ensure the DB file is created
        db.execute("SELECT 1")
        db.commit()
        print(f"[DB] Database initialized at: {Config.DATABASE_URI}")

    app.teardown_appcontext(close_db)
