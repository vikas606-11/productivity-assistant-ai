"""
Productivity Assistant AI - Routes Module
Registers all Flask blueprints and defines API endpoints.
"""

from flask import Blueprint, jsonify

# ── Health Blueprint ──────────────────────────────────────────────────────────
health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health_check():
    """
    Health-check endpoint.
    Returns a simple status object to confirm the server is running.
    """
    return jsonify({"status": "running"}), 200


# ── API Blueprint (placeholder) ───────────────────────────────────────────────
api_bp = Blueprint("api", __name__, url_prefix="/api/v1")


@api_bp.route("/", methods=["GET"])
def api_root():
    """API root — provides version and available resource info."""
    return jsonify({
        "version": "1.0.0",
        "message": "Productivity Assistant AI API",
        "endpoints": {
            "health": "/health",
            "api":    "/api/v1/",
        },
    }), 200


# ── Registration helper ───────────────────────────────────────────────────────
def register_routes(app):
    """Register all blueprints with the Flask application instance."""
    app.register_blueprint(health_bp)
    app.register_blueprint(api_bp)
    print("[Routes] All blueprints registered successfully.")
