from collections.abc import Generator

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import SessionLocal, engine

app = FastAPI(title="Career Compass API")

# Create the SQLite schema on startup for the exam demo environment.
models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db() -> Generator[Session, None, None]:
    # Provide a per-request database session and close it reliably afterward.
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/goals", response_model=list[schemas.GoalRead])
def list_goals(db: Session = Depends(get_db)):
    # Return newest goals first so freshly created or updated tasks are easy to spot.
    return db.query(models.Goal).order_by(models.Goal.created_at.desc()).all()


@app.post("/goals", response_model=schemas.GoalRead, status_code=status.HTTP_201_CREATED)
def create_goal(goal_data: schemas.GoalCreate, db: Session = Depends(get_db)):
    # Persist a new goal from the validated request body.
    db_goal = models.Goal(**goal_data.model_dump())
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal


@app.patch("/goals/{goal_id}", response_model=schemas.GoalRead)
def update_goal(goal_id: int, goal_data: schemas.GoalUpdate, db: Session = Depends(get_db)):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if goal is None:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")

        # Apply only the fields the client actually sent.
    for field, value in goal_data.model_dump(exclude_unset=True).items():
        setattr(goal, field, value)

    db.commit()
    db.refresh(goal)
    return goal


@app.patch("/goals/{goal_id}/complete", response_model=schemas.GoalRead)
def mark_goal_complete(
        goal_id: int,
        completion_data: schemas.GoalCompletionUpdate,
        db: Session = Depends(get_db),
):
    # Allow the client to toggle completion state on an existing goal.
        goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
        if goal is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")

        goal.completed = completion_data.completed
        db.commit()
        db.refresh(goal)
        return goal


@app.delete("/goals/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id).first()
    if goal is None:
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")

    db.delete(goal)
    db.commit()
