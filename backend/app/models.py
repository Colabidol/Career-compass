from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False, nullable=False)
    category = Column(String, default="Career", nullable=False)
    filter = Column(String, default="All", nullable=False)
    priority = Column(String, default="Medium", nullable=False)
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
