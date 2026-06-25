# Productivity Assistant AI Backend

This is the backend for the Productivity Assistant AI hackathon project.

## Tech Stack
- Python
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- SQLite
- python-dotenv

## Setup Instructions

1. Ensure you have Python installed.
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` (optional, defaults are provided):
   ```bash
   cp .env.example .env
   ```
5. Run the server:
   ```bash
   python app.py
   ```

The backend runs on `http://127.0.0.1:5000/`.
The database `productivity.db` will be created automatically.

## API Endpoints

### AI-Powered Capture

#### `POST /api/capture`

Processes a natural language string to extract multiple tasks, reminders, and notes.

- **Request Body**:
  ```json
  {
    "text": "Call Rahul tomorrow at 10 AM, prepare cloud security presentation before Friday and buy groceries."
  }
  ```

- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Productivity items captured and saved successfully",
    "data": {
      "tasks": [
        {
          "id": 1,
          "title": "Call Rahul",
          "description": "",
          "category": "Work",
          "priority": "Medium",
          "due_date": "Tomorrow",
          "due_time": "10:00 AM",
          "status": "Pending",
          "tags": ["call", "rahul"],
          "created_at": "2026-06-25T12:09:07.123456Z",
          "updated_at": "2026-06-25T12:09:07.123456Z"
        },
        {
          "id": 2,
          "title": "Prepare cloud security presentation",
          "description": "",
          "category": "Work",
          "priority": "High",
          "due_date": "Friday",
          "due_time": null,
          "status": "Pending",
          "tags": ["cloud", "security", "presentation"],
          "created_at": "2026-06-25T12:09:07.124567Z",
          "updated_at": "2026-06-25T12:09:07.124567Z"
        },
        {
          "id": 3,
          "title": "Buy groceries",
          "description": "",
          "category": "Shopping",
          "priority": "Low",
          "due_date": null,
          "due_time": null,
          "status": "Pending",
          "tags": ["shopping", "groceries"],
          "created_at": "2026-06-25T12:09:07.125678Z",
          "updated_at": "2026-06-25T12:09:07.125678Z"
        }
      ],
      "notes": []
    }
  }
  ```
