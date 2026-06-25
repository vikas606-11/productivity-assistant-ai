# System Architecture — Productivity Assistant AI

## Overview

A full-stack AI-powered productivity assistant built for a hackathon.

```
┌─────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                  │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │        React (Vite) + Tailwind CSS          │   │
│   │              http://localhost:5173           │   │
│   └──────────────────┬──────────────────────────┘   │
└──────────────────────│──────────────────────────────┘
                       │ REST API (JSON)
                       │ /api/v1/*  /health
┌──────────────────────▼──────────────────────────────┐
│                 FLASK BACKEND                        │
│              http://localhost:5000                   │
│                                                     │
│   ┌──────────────┐  ┌──────────────────────────┐    │
│   │   Routes /   │  │   Business Logic /        │    │
│   │  Blueprints  │  │   Services (future)       │    │
│   └──────┬───────┘  └──────────────────────────┘    │
│          │                                           │
│   ┌──────▼──────────────────────────────────────┐   │
│   │              SQLite Database                │   │
│   │        productivity_assistant.db            │   │
│   └─────────────────────────────────────────────┘   │
│                                                     │
│   ┌─────────────────────────────────────────────┐   │
│   │           Google Gemini API                 │   │
│   │    (External AI service — future commit)    │   │
│   └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer      | Technology          | Version   |
|------------|---------------------|-----------|
| Frontend   | React               | 18.3.x    |
| Build Tool | Vite                | 5.3.x     |
| CSS        | Tailwind CSS        | 3.4.x     |
| Backend    | Python Flask        | 3.0.x     |
| Database   | SQLite              | Built-in  |
| AI         | Google Gemini API   | 1.5 Pro   |

## Directory Layout

```
productivity-assistant-ai/
├── backend/        # Flask REST API
├── frontend/       # React SPA
├── docs/           # Architecture docs & screenshots
├── .gitignore
├── README.md
└── LICENSE
```

## API Design (planned)

```
GET    /health              # Health check
GET    /api/v1/             # API info

# Tasks (Commit #2)
GET    /api/v1/tasks        # List all tasks
POST   /api/v1/tasks        # Create task
GET    /api/v1/tasks/:id    # Get task
PUT    /api/v1/tasks/:id    # Update task
DELETE /api/v1/tasks/:id    # Delete task

# AI (Commit #3)
POST   /api/v1/ai/suggest   # Get AI task suggestions
POST   /api/v1/ai/summarise # Summarise task list
```

## Data Flow

```
User Input
    │
    ▼
React Component
    │ axios.post("/api/v1/tasks")
    ▼
Flask Route Handler
    │ validates & processes
    ▼
SQLite (via database.py)
    │ optional AI enrichment
    ▼
Gemini API  ◄──────── (Commit #3)
    │
    ▼
JSON Response → React State → UI Update
```

## Commit Roadmap

| Commit | Scope                                  |
|--------|----------------------------------------|
| #1     | Project initialization (this commit)   |
| #2     | Database models + Task CRUD API        |
| #3     | Google Gemini AI integration           |
| #4     | Full dashboard UI                      |
| #5     | Authentication & user management       |
| #6     | Polish, tests & deployment             |
