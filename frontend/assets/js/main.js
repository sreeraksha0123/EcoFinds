// frontend/assets/js/main.js
import { apiRequest } from "./api.js";

window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "./index.html"; // redirect to login if not logged in
    return;
  }

  try {
    const products = await apiRequest("/products", "GET", null, token);
    const container = document.getElementById("product-container");

    if (container) {
      container.innerHTML = products
        .map(
          (p) => `
        <div class="product-card">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <span>$${p.price}</span>
        </div>`
        )
        .join("");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to load products");
  }
});
