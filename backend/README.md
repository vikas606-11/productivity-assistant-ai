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
