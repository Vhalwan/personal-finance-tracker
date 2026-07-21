import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createMealPlan, deleteMealPlan, getMealPlans } from "../api/mealPlans";
import { getRecipes } from "../api/recipes";
import { useAuth } from "../context/AuthContext";

export default function MealPlans() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recipeId, setRecipeId] = useState("");
  const [plannedDate, setPlannedDate] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [submitting, setSubmitting] = useState(false);

  async function loadData() {
    setError("");
    try {
      const [mealPlansData, recipesData] = await Promise.all([
        getMealPlans(),
        getRecipes(),
      ]);
      setMealPlans(mealPlansData);
      setRecipes(recipesData);
    } catch {
      setError("Failed to load meal plans.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createMealPlan({
        recipe_id: Number(recipeId),
        planned_date: plannedDate,
        meal_type: mealType,
      });
      setRecipeId("");
      setPlannedDate("");
      setMealType("breakfast");
      await loadData();
    } catch {
      setError("Failed to add meal plan.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteMealPlan(id);
      await loadData();
    } catch {
      setError("Failed to delete meal plan.");
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold text-slate-900">Meal Plans</h1>
            <nav className="flex gap-4 text-sm">
              <Link
                to="/pantry"
                className="text-slate-600 hover:text-slate-900"
              >
                Pantry
              </Link>
              <Link
                to="/recipes"
                className="text-slate-600 hover:text-slate-900"
              >
                Recipes
              </Link>
              <Link
                to="/meal-plans"
                className="font-medium text-slate-900"
              >
                Meal Plans
              </Link>
            </nav>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">
            Add meal plan
          </h2>
          <form
            onSubmit={handleAdd}
            className="grid grid-cols-1 sm:grid-cols-4 gap-3"
          >
            <select
              required
              value={recipeId}
              onChange={(e) => setRecipeId(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="">Select recipe</option>
              {recipes.map((recipe) => (
                <option key={recipe.id} value={recipe.id}>
                  {recipe.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              required
              value={plannedDate}
              onChange={(e) => setPlannedDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
            <select
              required
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-slate-900 text-white py-2 font-medium hover:bg-slate-800 disabled:opacity-60"
            >
              {submitting ? "Adding…" : "Add"}
            </button>
          </form>
        </section>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-900">Meal plans</h2>
          </div>

          {loading ? (
            <p className="px-6 py-8 text-slate-500 text-sm">Loading…</p>
          ) : mealPlans.length === 0 ? (
            <p className="px-6 py-8 text-slate-500 text-sm">
              No meal plans yet. Add one above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Meal</th>
                    <th className="px-6 py-3 font-medium">Recipe</th>
                    <th className="px-6 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mealPlans.map((plan) => (
                    <tr key={plan.id} className="text-slate-800">
                      <td className="px-6 py-3">{plan.planned_date}</td>
                      <td className="px-6 py-3 capitalize">{plan.meal_type}</td>
                      <td className="px-6 py-3">
                        {plan.recipe?.name ?? "—"}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(plan.id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
