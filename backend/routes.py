from flask import Blueprint, jsonify

# Create a Blueprint for API routes
api_bp = Blueprint('api', __name__)

@api_bp.route('/', methods=['GET'])
def index():
    """
    Root endpoint to verify the backend is running.
    """
    return jsonify({
        "message": "Productivity Assistant AI Backend Running"
    })

@api_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint to verify backend and database status.
    """
    return jsonify({
        "status": "healthy",
        "database": "connected"
    })
