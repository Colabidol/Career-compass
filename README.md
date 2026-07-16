# Career Momentum Board

Fullstack Task Management Application built for the practical exam requirements.

- Frontend: React + Vite
- Backend: FastAPI + SQLAlchemy
- Database: SQLite

## Objective Coverage

This project demonstrates:

- React fundamentals (component structure, state management, event handling, list rendering)
- REST API design and backend business logic with FastAPI
- Persistent storage with SQLite and CRUD operations
- Frontend to backend integration through HTTP API calls

## Core Features Implemented

1. Add task
2. Mark task complete/incomplete (backend completion endpoint supports both states)
3. Edit task details (title, description, category, priority, due date)
4. Delete task
5. Search task by title/name
6. Filter by All, Active, Inactive
7. Search and filter work together

## Project Structure

```text
React/
	backend/
		app/
			main.py
			models.py
			schemas.py
			database.py
		requirements.txt
		README.md
	frontend/
		src/
			pages/
			components/
			services/
		package.json
		README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- Python 3.10+

## Setup and Run

Run backend and frontend in separate terminals.

### 1. Backend setup

```bash
cd backend
python -m pip install -r requirements.txt
python -m app.init_db
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Backend URL: `http://127.0.0.1:8000`

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL (default): `http://localhost:5173`

## API Endpoints

Base URL: `http://127.0.0.1:8000`

- `GET /health` - health check
- `GET /goals` - list tasks
- `POST /goals` - create task
- `PATCH /goals/{goal_id}` - update task fields
- `PATCH /goals/{goal_id}/complete` - set completion state
- `DELETE /goals/{goal_id}` - delete task

## Data Model

Task (Goal) fields:

- `id` (int)
- `title` (string)
- `description` (string | null)
- `completed` (boolean)
- `filter` (active | inactive)
- `category` (string)
- `priority` (string)
- `due_date` (datetime | null)
- `created_at`, `updated_at` (datetime)

Database file: `backend/goals.db`

## Error Handling and Validation

- Backend uses Pydantic validation for request payloads
- Backend returns 404 when task id is missing
- Frontend checks HTTP status on all API requests
- Frontend displays user-facing error messages for API/validation failures
- Frontend safely handles empty 204 delete responses

## Scripts

Frontend (`frontend/package.json`):

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build

## Notes

- CORS is configured to allow `http://localhost:5173`
- Tasks are sorted by newest first from backend query
