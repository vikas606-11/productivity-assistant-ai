from flask import Flask
from flask_cors import CORS

from config import Config
from database import init_db
from routes import api_bp, tasks_bp, notes_bp

def create_app():
    """
    Application factory function to create and configure the Flask app.
    """
    # 1. Configure Flask application
    app = Flask(__name__)
    
    # 6. Load configuration using python-dotenv (handled in config.py)
    # 7. Use Config class
    app.config.from_object(Config)
    
    # 2. Configure Flask-CORS
    # Enable CORS for all routes by default
    CORS(app)
    
    # 3 & 4 & 5. Configure SQLAlchemy, SQLite, and initialize DB
    init_db(app)
    
    # 8. Register blueprints
    app.register_blueprint(api_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(notes_bp)
    
    return app

if __name__ == '__main__':
    # Entry point for the application
    app = create_app()
    # Run the application
    app.run(debug=app.config['DEBUG'], host='0.0.0.0', port=5000)
