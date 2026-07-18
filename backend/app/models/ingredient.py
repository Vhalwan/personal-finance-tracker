from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db import Base


class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)  # e.g. "g", "ml", "pcs"
    category = Column(String, nullable=True)  # e.g. "dairy", "produce", "spices"
    expiry_date = Column(Date, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # One ingredient can appear in many recipes (via the junction table)
    recipe_links = relationship("RecipeIngredient", back_populates="ingredient")
    user = relationship("User", back_populates="ingredients")
