import client from "./client";

export async function getMealPlans() {
  const response = await client.get("/meal-plans/");
  return response.data;
}

export async function createMealPlan(data) {
  const response = await client.post("/meal-plans/", data);
  return response.data;
}

export async function deleteMealPlan(id) {
  const response = await client.delete(`/meal-plans/${id}`);
  return response.data;
}
