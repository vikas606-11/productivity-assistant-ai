import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """
    Base configuration class for the Flask application.
    Loads settings from environment variables or uses default values.
    """
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    DEBUG = os.environ.get('FLASK_DEBUG', '1') == '1'
    
    # SQLAlchemy settings
    # Default to sqlite:///productivity.db if not specified
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI', 'sqlite:///productivity.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
