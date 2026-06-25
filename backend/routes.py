import logging
from datetime import datetime
from flask import Blueprint, jsonify, request
from database import db
from models import Task, Note
from services.gemini_service import get_gemini_service
from services.summary_service import get_summary_response_data, mark_summary_dirty

logger = logging.getLogger(__name__)

def auto_generate_tags(title, description=""):
    """
    Helper function to automatically generate tags using Gemini Service,
    falling back to a regex word extractor if config/service is unavailable.
    """
    try:
        service = get_gemini_service()
        tags = service.generate_tags(title, description)
        if tags:
            return tags
    except Exception as e:
        logger.warning(f"AI tagging unavailable, using fallback: {str(e)}")
    
    # Simple regex fallback (alphanumeric words >= 4 chars, filtered by common stop words)
    import re
    words = re.findall(r'\b[a-zA-Z]{4,}\b', f"{title} {description or ''}".lower())
    stop_words = {
        'with', 'your', 'from', 'this', 'that', 'then', 'them', 'they', 'have', 
        'some', 'task', 'todo', 'will', 'about', 'their', 'there', 'here', 'when',
        'what', 'could', 'would', 'should', 'other', 'before', 'after', 'please',
        'for', 'and', 'the', 'meeting', 'discussion'
    }
    fallback_tags = list(set([w for w in words if w not in stop_words]))[:5]
    return fallback_tags

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

@api_bp.route('/api/capture', methods=['POST'])
def capture_productivity_items():
    """
    Endpoint to capture and process natural language input into tasks/reminders/notes.
    Saves extracted items to database.
    """
    data = request.get_json() or {}
    text = data.get('text')
    
    if not text or not str(text).strip():
        return make_response(False, "Input text is required", status_code=400)
    
    # Get current timestamp for relative date resolution context
    current_time_str = datetime.now().isoformat()
    
    try:
        service = get_gemini_service()
        result = service.capture_items(str(text).strip(), current_time=current_time_str)
    except ValueError as ve:
        logger.error(f"Configuration error: {str(ve)}")
        return make_response(False, f"Configuration error: {str(ve)}", status_code=500)
    except Exception as e:
        logger.error(f"AI parsing error: {str(e)}")
        return make_response(False, f"Failed to analyze text: {str(e)}", status_code=500)

    created_tasks = []
    created_notes = []
    
    try:
        items = result.get('items', [])
        for item in items:
            item_type = str(item.get('type', '')).lower()
            
            # Tasks and Reminders both map to the Task table
            if item_type in ('task', 'reminder'):
                tags = item.get('tags', [])
                if not tags or (isinstance(tags, list) and not tags) or (isinstance(tags, str) and not tags.strip()):
                    gen_tags = auto_generate_tags(item.get('title', ''), item.get('description', ''))
                    tags_str = ','.join(gen_tags) if gen_tags else None
                else:
                    if isinstance(tags, list):
                        tags_str = ','.join(map(str, tags))
                    else:
                        tags_str = str(tags) if tags else None
                
                # Truncate strings to fit database schema constraints if necessary
                due_date = item.get('due_date')
                if due_date and len(str(due_date)) > 10:
                    due_date = str(due_date)[:10]
                due_time = item.get('due_time')
                if due_time and len(str(due_time)) > 8:
                    due_time = str(due_time)[:8]
                    
                task = Task(
                    title=str(item.get('title', 'Untitled Task')).strip(),
                    description=item.get('description', ''),
                    category=item.get('category', 'Other'),
                    tags=tags_str,
                    due_date=due_date,
                    due_time=due_time,
                    priority=item.get('priority', 'Medium'),
                    status='Pending'
                )
                db.session.add(task)
                created_tasks.append(task)
                
            elif item_type == 'note':
                note = Note(
                    title=str(item.get('title', 'Untitled Note')).strip(),
                    content=item.get('content', '')
                )
                db.session.add(note)
                created_notes.append(note)
                
        db.session.commit()
        mark_summary_dirty()
        
        # Log database insertion result
        logger.info(f"Successfully saved captured items to database: {len(created_tasks)} tasks, {len(created_notes)} notes.")
        
        # Format response data
        response_data = {
            "tasks": [t.to_dict() for t in created_tasks],
            "notes": [n.to_dict() for n in created_notes]
        }
        return make_response(True, "Productivity items captured and saved successfully", response_data, status_code=201)
        
    except Exception as db_err:
        db.session.rollback()
        logger.error(f"Database operation failed: {str(db_err)}")
        return make_response(False, f"Database saving failed: {str(db_err)}", status_code=500)

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
    
    # Process tags if provided or auto-generate
    tags = data.get('tags')
    if not tags or (isinstance(tags, list) and not tags) or (isinstance(tags, str) and not tags.strip()):
        gen_tags = auto_generate_tags(title, data.get('description', ''))
        tags = ','.join(gen_tags) if gen_tags else None
    else:
        if isinstance(tags, list):
            tags = ','.join(map(str, tags))
        else:
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
    mark_summary_dirty()
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
    mark_summary_dirty()
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
    mark_summary_dirty()
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
    mark_summary_dirty()
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
    mark_summary_dirty()
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
    mark_summary_dirty()
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
    mark_summary_dirty()
    return make_response(True, "Note deleted successfully")

# ==============================================================================
# SEARCH & TAG ROUTES (api_bp / tasks_bp)
# ==============================================================================

@api_bp.route('/api/tags', methods=['GET'])
def get_all_tags():
    """
    Retrieve all unique tags across all tasks.
    """
    try:
        tasks = Task.query.all()
        unique_tags = set()
        for task in tasks:
            if task.tags:
                for tag in task.tags.split(','):
                    cleaned_tag = tag.strip().lower()
                    if cleaned_tag:
                        unique_tags.add(cleaned_tag)
        return make_response(True, "Unique tags retrieved successfully", sorted(list(unique_tags)))
    except Exception as e:
        logger.error(f"Failed to retrieve unique tags: {str(e)}")
        return make_response(False, f"Failed to retrieve unique tags: {str(e)}", status_code=500)

@tasks_bp.route('/suggest-tags', methods=['GET'])
def suggest_tags():
    """
    Get AI-suggested tags based on a task title and description.
    """
    title = request.args.get('title', '')
    description = request.args.get('description', '')
    
    if not title.strip():
        return make_response(False, "Task title is required to suggest tags", status_code=400)
        
    tags = auto_generate_tags(title, description)
    return make_response(True, "Tags suggested successfully", tags)

@api_bp.route('/api/search', methods=['GET'])
def search_items():
    """
    Search tasks and notes by query parameter q.
    Optionally filters tasks by category, status, priority, and due_date.
    """
    q = request.args.get('q', '').strip()
    category = request.args.get('category', 'All').strip()
    status = request.args.get('status', 'All').strip()
    priority = request.args.get('priority', 'All').strip()
    due_date = request.args.get('due_date', '').strip()
    
    # Base queries
    task_query = Task.query
    note_query = Note.query
    
    # 1. Search filter
    if q:
        search_pattern = f"%{q}%"
        task_query = task_query.filter(
            db.or_(
                Task.title.like(search_pattern),
                Task.description.like(search_pattern),
                Task.category.like(search_pattern),
                Task.tags.like(search_pattern)
            )
        )
        
        note_query = note_query.filter(
            db.or_(
                Note.title.like(search_pattern),
                Note.content.like(search_pattern)
            )
        )
        
    # 2. Category, Status, Priority, Due Date filters (apply to Tasks only)
    has_task_filters = False
    
    if category and category != 'All':
        task_query = task_query.filter(Task.category == category)
        has_task_filters = True
        
    if status and status != 'All':
        task_query = task_query.filter(Task.status == status)
        has_task_filters = True
        
    if priority and priority != 'All':
        task_query = task_query.filter(Task.priority == priority)
        has_task_filters = True
        
    if due_date:
        task_query = task_query.filter(Task.due_date == due_date)
        has_task_filters = True
        
    try:
        tasks = task_query.all()
        
        # If task-specific filters are active, notes are excluded
        if has_task_filters:
            notes = []
        else:
            notes = note_query.all()
            
        results = {
            "tasks": [t.to_dict() for t in tasks],
            "notes": [n.to_dict() for n in notes]
        }
        
        return make_response(True, "Search results retrieved successfully", results)
    except Exception as e:
        logger.error(f"Search query failed: {str(e)}")
        return make_response(False, f"Search failed: {str(e)}", status_code=500)

@api_bp.route('/api/summary', methods=['GET'])
def get_productivity_summary():
    """
    Get the AI productivity summary, insights, and metrics statistics.
    Supports a 'refresh' query parameter to force Gemini regeneration.
    """
    force_refresh = request.args.get('refresh', 'false').lower() == 'true'
    try:
        data = get_summary_response_data(force_refresh=force_refresh)
        return make_response(True, "Productivity summary retrieved successfully", data)
    except Exception as e:
        logger.error(f"Failed to generate/retrieve summary: {str(e)}")
        return make_response(False, f"Failed to retrieve summary: {str(e)}", status_code=500)
