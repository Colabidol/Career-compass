from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class GoalCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: Optional[str] = None
    completed: bool = False
    category: str = "Career"
    priority: str = "Medium"
    due_date: Optional[datetime] = None


class GoalUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=120)
    description: Optional[str] = None
    completed: Optional[bool] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None


class GoalRead(GoalCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)
