# Backend (FastAPI + SQLite)

Backend API for Career Momentum Board task management app.

## Requirements

- Python 3.10+

## Dependencies

Installed from `requirements.txt`:

- fastapi
- uvicorn[standard]
- sqlalchemy
- aiosqlite
- pydantic

## Setup

```bash
cd backend
python -m pip install -r requirements.txt
python -m app.init_db
```

## Run

```bash
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Base URL: `http://127.0.0.1:8000`

## Endpoints

- `GET /health` - health status
- `GET /goals` - list goals/tasks
- `POST /goals` - create goal/task
- `PATCH /goals/{goal_id}` - update goal/task fields
- `PATCH /goals/{goal_id}/complete` - set completion state (`true` or `false`)
- `DELETE /goals/{goal_id}` - delete goal/task

## Validation and Errors

- Request payload validation is handled with Pydantic schemas
- Invalid input returns validation errors from FastAPI
- Missing goal/task id returns `404 Goal not found`

## Database

- SQLite database file: `backend/goals.db`
- SQLAlchemy model table: `goals`
