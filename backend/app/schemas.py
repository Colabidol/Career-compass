from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


# Request schema for creating a new goal.
class GoalCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: Optional[str] = None
    completed: bool = False
    filter: str = "active"
    category: str = "Career"
    priority: str = "Medium"
    due_date: Optional[datetime] = None


# Partial update schema used by PATCH requests.
class GoalUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=120)
    description: Optional[str] = None
    completed: Optional[bool] = None
    filter: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None


# Request body for the completion toggle endpoint.
class GoalCompletionUpdate(BaseModel):
    completed: bool = True


# Response schema returned to the frontend after CRUD operations.
class GoalRead(GoalCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)
