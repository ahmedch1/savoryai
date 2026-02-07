const defaultBaseUrl = "http://localhost:8000";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || defaultBaseUrl;

export async function searchFoods(payload) {
  const response = await fetch(`${API_BASE_URL}/api/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Search request failed");
  }

  return response.json();
}

export async function chatFoods(payload) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Chat request failed");
  }

  return response.json();
}
