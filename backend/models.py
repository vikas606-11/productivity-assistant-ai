from datetime import datetime, timezone
from database import db

class Task(db.Model):
    """
    Database model representing a hackathon Task.
    """
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(100), nullable=True)
    tags = db.Column(db.String(255), nullable=True)  # Store tags as a comma-separated string
    due_date = db.Column(db.String(10), nullable=True)  # Format: YYYY-MM-DD
    due_time = db.Column(db.String(8), nullable=True)   # Format: HH:MM or HH:MM:SS
    priority = db.Column(db.String(20), default='Medium', nullable=False)  # Low, Medium, High
    status = db.Column(db.String(20), default='Pending', nullable=False)    # Pending, Completed
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    def to_dict(self):
        """
        Convert Task model instance to a dictionary for JSON responses.
        """
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'tags': [t.strip() for t in self.tags.split(',')] if self.tags else [],
            'due_date': self.due_date,
            'due_time': self.due_time,
            'priority': self.priority,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Note(db.Model):
    """
    Database model representing a hackathon Note.
    """
    __tablename__ = 'notes'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    def to_dict(self):
        """
        Convert Note model instance to a dictionary for JSON responses.
        """
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
