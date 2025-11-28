// frontend/assets/js/api.js

// 🌿 Detect backend URL (local vs deployed)
export const API_BASE_URL =
  window.location.hostname.includes("localhost") ||
  window.location.hostname.includes("127.0.0.1")
    ? "http://localhost:5000/api"
    : "http://localhost:5000/api"; // change later if you deploy

/**
 * Generic API request helper
 */
export async function apiRequest(
  endpoint,
  method = "GET",
  data = null,
  token = null
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s

  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = {
    method,
    headers,
    signal: controller.signal,
  };
  if (data) options.body = JSON.stringify(data);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ API Error (${response.status}):`, text);
      throw new Error(text || `Server error ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return { message: await response.text() };
    }
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === "AbortError") {
      throw new Error("Request timeout. Please try again.");
    }
    throw new Error(error.message || "Network error");
  }
}
