# Productivity Assistant AI 🤖✅

> An AI-powered productivity assistant built with React, Flask, and Google Gemini — hackathon project.

---

## ✨ Features (Planned)

- 📋 **Smart Task Management** — Create, organise, and prioritise tasks
- 🤖 **AI Suggestions** — Gemini-powered task recommendations and summaries
- 🎙️ **Voice Input** — Add tasks hands-free
- 🔐 **Authentication** — Secure user accounts
- 📊 **Dashboard** — Visual productivity insights

---

## 🏗️ Tech Stack

| Layer      | Technology        |
|------------|-------------------|
| Frontend   | React 18 + Vite   |
| Styling    | Tailwind CSS 3    |
| Backend    | Python Flask 3    |
| Database   | SQLite            |
| AI         | Google Gemini API |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- pip

### 1 — Clone & enter the project

```bash
git clone <repo-url>
cd productivity-assistant-ai
```

### 2 — Backend setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS / Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy and edit environment variables
cp .env.example .env
# → Open .env and add your GEMINI_API_KEY

# Start the Flask server
python app.py
```

Flask will run at **http://localhost:5000**

```bash
# Verify:
curl http://localhost:5000/health
# {"status": "running"}
```

### 3 — Frontend setup

```bash
# Open a new terminal tab
cd frontend

# Install npm packages
npm install

# Start the dev server
npm run dev
```

React will run at **http://localhost:5173**

---

## 📁 Project Structure

```
productivity-assistant-ai/
│
├── backend/
│   ├── app.py          # Flask entry point (factory)
│   ├── config.py       # Environment config
│   ├── database.py     # SQLite connection management
│   ├── models.py       # Data models (Commit #2)
│   ├── routes.py       # API blueprints & endpoints
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API layer (axios)
│   │   ├── hooks/      # Custom React hooks
│   │   ├── utils/      # Helper functions
│   │   ├── assets/     # Static assets
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── README.md
│
├── docs/
│   ├── architecture.md
│   └── screenshots/
│
├── .gitignore
├── README.md       ← you are here
└── LICENSE
```

---

## 🗺️ Commit Roadmap

| Commit | Scope                              | Status  |
|--------|------------------------------------|---------|
| #1     | Project initialization             | ✅ Done  |
| #2     | Database models + Task CRUD API    | 🔜 Next  |
| #3     | Google Gemini AI integration       | 🔜 Soon  |
| #4     | Full dashboard UI                  | 🔜 Soon  |
| #5     | Authentication & user management   | 🔜 Soon  |
| #6     | Polish, tests & deployment         | 🔜 Soon  |

---

## 📄 License

[MIT](./LICENSE) © 2024 Productivity Assistant AI Contributors
