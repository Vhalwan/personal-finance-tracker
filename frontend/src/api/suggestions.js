import client from "./client";

export async function getSuggestions() {
  const response = await client.get("/recipes/suggest");
  return response.data;
}
