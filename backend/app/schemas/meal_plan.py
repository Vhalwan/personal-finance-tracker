from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.meal_plan import MealType
from app.schemas.recipe import RecipeResponse


class MealPlanCreate(BaseModel):
    planned_date: date
    meal_type: MealType
    recipe_id: int


class MealPlanUpdate(BaseModel):
    planned_date: Optional[date] = None
    meal_type: Optional[MealType] = None
    recipe_id: Optional[int] = None


class MealPlanResponse(BaseModel):
    id: int
    planned_date: date
    meal_type: MealType
    recipe_id: int
    created_at: datetime
    recipe: RecipeResponse

    model_config = ConfigDict(from_attributes=True)
