# Frontend (React + Vite)

Frontend for Career Momentum Board task management app.

## What This Frontend Handles

- Display task list
- Add, edit, delete tasks
- Mark tasks complete
- Toggle active/inactive state
- Search by task title
- Filter by All, Active, Inactive
- Combine search with filters
- Display API and validation errors in the UI

## Tech Stack

- React 19
- Vite 8
- Fetch API for backend communication

## Setup

```bash
cd frontend
npm install
```

## Run (Development)

```bash
npm run dev
```

Default URL: `http://localhost:5173`

## Build

```bash
npm run build
```

## API Integration

Frontend service layer is in `src/services/api.jsx`.

Expected backend base URL:

`http://127.0.0.1:8000`

Used endpoints:

- `GET /goals`
- `POST /goals`
- `PATCH /goals/{goal_id}`
- `PATCH /goals/{goal_id}/complete`
- `DELETE /goals/{goal_id}`

## Error Handling

- Every request checks HTTP status before returning data
- Backend validation messages are extracted and shown to users
- Connection failures show a friendly message
- Empty 204 responses (delete) are handled without JSON parsing errors

## Key Folder Structure

```text
frontend/
	src/
		components/
			Card.jsx
			Goalform.jsx
			Mainbar.jsx
			Sidebar.jsx
		pages/
			Dashboard.jsx
		services/
			api.jsx
```
