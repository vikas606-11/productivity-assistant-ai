from flask import Blueprint, jsonify, request
from database import db
from models import Task, Note

# Create Blueprints for modular route management
api_bp = Blueprint('api', __name__)
tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')
notes_bp = Blueprint('notes', __name__, url_prefix='/api/notes')

def make_response(success, message, data=None, status_code=200):
    """
    Helper function to generate standardized JSON responses.
    """
    response = {
        "success": success,
        "message": message
    }
    if data is not None:
        response["data"] = data
    return jsonify(response), status_code

# ==============================================================================
# BASE ROUTES (api_bp)
# ==============================================================================

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

# ==============================================================================
# TASK ROUTES (tasks_bp)
# ==============================================================================

@tasks_bp.route('', methods=['POST'])
def create_task():
    """
    Create a new task. Requires 'title' in request body.
    """
    data = request.get_json() or {}
    title = data.get('title')
    
    if not title or not str(title).strip():
        return make_response(False, "Task title is required", status_code=400)
    
    # Process tags if provided as a list
    tags = data.get('tags')
    if isinstance(tags, list):
        tags = ','.join(map(str, tags))
    elif tags is not None:
        tags = str(tags)
        
    task = Task(
        title=str(title).strip(),
        description=data.get('description'),
        category=data.get('category'),
        tags=tags,
        due_date=data.get('due_date'),
        due_time=data.get('due_time'),
        priority=data.get('priority', 'Medium'),
        status=data.get('status', 'Pending')
    )
    
    db.session.add(task)
    db.session.commit()
    return make_response(True, "Task created successfully", task.to_dict(), 201)

@tasks_bp.route('', methods=['GET'])
def get_tasks():
    """
    Retrieve all tasks.
    """
    tasks = Task.query.all()
    return make_response(True, "Tasks retrieved successfully", [t.to_dict() for t in tasks])

@tasks_bp.route('/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """
    Retrieve a specific task by ID.
    """
    task = db.session.get(Task, task_id)
    if not task:
        return make_response(False, "Task not found", status_code=404)
    return make_response(True, "Task retrieved successfully", task.to_dict())

@tasks_bp.route('/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """
    Update a specific task.
    """
    task = db.session.get(Task, task_id)
    if not task:
        return make_response(False, "Task not found", status_code=404)
    
    data = request.get_json() or {}
    
    # If title is being updated, ensure it is not empty
    if 'title' in data:
        title = data.get('title')
        if not title or not str(title).strip():
            return make_response(False, "Task title is required", status_code=400)
        task.title = str(title).strip()
        
    if 'description' in data:
        task.description = data.get('description')
    if 'category' in data:
        task.category = data.get('category')
    if 'tags' in data:
        tags = data.get('tags')
        if isinstance(tags, list):
            tags = ','.join(map(str, tags))
        task.tags = tags
    if 'due_date' in data:
        task.due_date = data.get('due_date')
    if 'due_time' in data:
        task.due_time = data.get('due_time')
    if 'priority' in data:
        task.priority = data.get('priority')
    if 'status' in data:
        task.status = data.get('status')
        
    db.session.commit()
    return make_response(True, "Task updated successfully", task.to_dict())

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """
    Delete a specific task.
    """
    task = db.session.get(Task, task_id)
    if not task:
        return make_response(False, "Task not found", status_code=404)
    
    db.session.delete(task)
    db.session.commit()
    return make_response(True, "Task deleted successfully")

@tasks_bp.route('/<int:task_id>/complete', methods=['PATCH'])
def complete_task(task_id):
    """
    Mark a specific task as completed.
    """
    task = db.session.get(Task, task_id)
    if not task:
        return make_response(False, "Task not found", status_code=404)
    
    task.status = 'Completed'
    db.session.commit()
    return make_response(True, "Task marked as completed", task.to_dict())

# ==============================================================================
# NOTE ROUTES (notes_bp)
# ==============================================================================

@notes_bp.route('', methods=['POST'])
def create_note():
    """
    Create a new note. Requires 'title' in request body.
    """
    data = request.get_json() or {}
    title = data.get('title')
    
    if not title or not str(title).strip():
        return make_response(False, "Note title is required", status_code=400)
        
    note = Note(
        title=str(title).strip(),
        content=data.get('content')
    )
    
    db.session.add(note)
    db.session.commit()
    return make_response(True, "Note created successfully", note.to_dict(), 201)

@notes_bp.route('', methods=['GET'])
def get_notes():
    """
    Retrieve all notes.
    """
    notes = Note.query.all()
    return make_response(True, "Notes retrieved successfully", [n.to_dict() for n in notes])

@notes_bp.route('/<int:note_id>', methods=['GET'])
def get_note(note_id):
    """
    Retrieve a specific note by ID.
    """
    note = db.session.get(Note, note_id)
    if not note:
        return make_response(False, "Note not found", status_code=404)
    return make_response(True, "Note retrieved successfully", note.to_dict())

@notes_bp.route('/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    """
    Update a specific note.
    """
    note = db.session.get(Note, note_id)
    if not note:
        return make_response(False, "Note not found", status_code=404)
        
    data = request.get_json() or {}
    
    # If title is being updated, ensure it is not empty
    if 'title' in data:
        title = data.get('title')
        if not title or not str(title).strip():
            return make_response(False, "Note title is required", status_code=400)
        note.title = str(title).strip()
        
    if 'content' in data:
        note.content = data.get('content')
        
    db.session.commit()
    return make_response(True, "Note updated successfully", note.to_dict())

@notes_bp.route('/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    """
    Delete a specific note.
    """
    note = db.session.get(Note, note_id)
    if not note:
        return make_response(False, "Note not found", status_code=404)
        
    db.session.delete(note)
    db.session.commit()
    return make_response(True, "Note deleted successfully")
