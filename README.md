# Career Momentum Board

A full-stack task management app built with React + Vite for the frontend and FastAPI + SQLite for the backend.

## Project structure

- frontend: [first](first)
- backend: [backend](backend)

## Quick start

### Frontend

```bash
cd first
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m pip install -r requirements.txt
python -m app.init_db
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Notes

- The backend uses SQLite and creates a local database file at [backend/tasks.db](backend/tasks.db).
- The API health check is available at http://127.0.0.1:8000/health.
