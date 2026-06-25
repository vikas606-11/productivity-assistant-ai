# Frontend — Productivity Assistant AI

React + Vite frontend with Tailwind CSS.

## Requirements

- Node.js 18+
- npm 9+

## Quick Start

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will open at **http://localhost:5173**.

> Ensure the Flask backend is running on port 5000 before making API calls.

## Scripts

| Command         | Description                        |
|-----------------|------------------------------------|
| `npm run dev`   | Start Vite dev server (HMR)        |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint`  | Lint all JS/JSX files              |

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML entry point
├── src/
│   ├── assets/             # Static assets (images, fonts, icons)
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   │   └── useLocalStorage.js
│   ├── pages/              # Page-level components
│   │   └── Home.jsx        # Initial landing page
│   ├── services/           # API service layer
│   │   └── api.js          # Axios HTTP client
│   ├── utils/              # Utility / helper functions
│   │   └── helpers.js
│   ├── App.jsx             # Root component
│   ├── index.css           # Global styles + Tailwind directives
│   └── main.jsx            # React entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Upcoming (Commit #2+)

- Task dashboard UI
- API integration with Flask backend
- React Router navigation
- Authentication pages
