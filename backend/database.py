from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy instance
# We will bind it to the app in app.py
db = SQLAlchemy()

def init_db(app):
    """
    Initialize the database with the Flask app.
    Automatically creates all tables defined in models if they don't exist.
    """
    db.init_app(app)
    
    # We use app.app_context() to ensure we have access to app configuration
    # when creating tables.
    with app.app_context():
        # Import models here to ensure they are registered with SQLAlchemy
        # before creating tables.
        import models
        db.create_all()
        print("Database initialized successfully.")
