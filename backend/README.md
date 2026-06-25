# Backend — Productivity Assistant AI

Python/Flask REST API backend for the Productivity Assistant AI project.

## Requirements

- Python 3.10+
- pip

## Quick Start

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Edit .env and fill in your actual values

# 5. Run the development server
python app.py
```

The server will start at **http://localhost:5000**.

## Endpoints (Commit #1)

| Method | Path        | Description               |
|--------|-------------|---------------------------|
| GET    | `/health`   | Health-check — `{"status": "running"}` |
| GET    | `/api/v1/`  | API root info             |

## Project Structure

```
backend/
├── app.py          # Application factory & entry point
├── config.py       # Environment-driven configuration
├── database.py     # SQLite connection management
├── models.py       # Data models (placeholder)
├── routes.py       # Blueprint registration & endpoints
├── requirements.txt
├── .env.example    # Environment variable template
└── README.md
```

## Upcoming (Commit #2+)

- Database schema & migrations
- Task CRUD endpoints
- Google Gemini AI integration
- User authentication
