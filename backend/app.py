"""
Productivity Assistant AI - Flask Backend
Entry point for the Flask application.
"""

from flask import Flask
from flask_cors import CORS
from config import Config
from routes import register_routes


def create_app(config_class=Config):
    """Application factory pattern."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for all origins (development only)
    CORS(app, resources={r"/api/*": {"origins": "*"}, r"/health": {"origins": "*"}})

    # Register all route blueprints
    register_routes(app)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(
        host=app.config.get("HOST", "0.0.0.0"),
        port=app.config.get("PORT", 5000),
        debug=app.config.get("DEBUG", True),
    )
