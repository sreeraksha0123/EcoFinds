// frontend/assets/js/main.js
import { apiRequest } from "./api.js";

function showMessage(message, isError = false) {
  const msgDiv = document.createElement("div");
  msgDiv.textContent = message;
  msgDiv.style.position = "fixed";
  msgDiv.style.bottom = "20px";
  msgDiv.style.left = "50%";
  msgDiv.style.transform = "translateX(-50%)";
  msgDiv.style.background = isError ? "#e53e3e" : "#2f855a";
  msgDiv.style.color = "white";
  msgDiv.style.padding = "10px 20px";
  msgDiv.style.borderRadius = "8px";
  msgDiv.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  msgDiv.style.zIndex = "1000";
  document.body.appendChild(msgDiv);
  setTimeout(() => msgDiv.remove(), 2200);
}

window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    window.location.href = "./index.html";
    return;
  }

  const productList = document.getElementById("product-list");
  const logoutBtn = document.getElementById("logout-btn");
  const userGreeting = document.getElementById("user-greeting");

  if (userGreeting) userGreeting.textContent = `Hi, ${user.name}!`;

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "./index.html";
    });
  }

  productList.innerHTML = `<p class="loader">Loading products...</p>`;

  try {
    const res = await apiRequest("/products", "GET", null, token);
    const products = res.data || res; // in case your controller returns array directly

    if (!products || products.length === 0) {
      productList.innerHTML = `<p style="text-align:center;">No products available yet.</p>`;
      return;
    }

    productList.innerHTML = products
      .map(
        (p) => `
        <div class="card">
          <img src="${
            p.image || "https://via.placeholder.com/300x180?text=Eco+Product"
          }" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.description || "Eco-friendly product."}</p>
          <p><strong>₹${Number(p.price).toFixed(2)}</strong></p>
          <button class="add-to-cart" data-id="${p.id}">Add to Cart 🛒</button>
        </div>`
      )
      .join("");

    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const productId = e.target.getAttribute("data-id");
        try {
          await apiRequest(
            "/cart",
            "POST",
            { product_id: Number(productId), quantity: 1 },
            token
          );
          showMessage("✅ Added to cart!");
        } catch (err) {
          console.error("Cart error:", err);
          showMessage("❌ Could not add to cart", true);
        }
      });
    });
  } catch (err) {
    console.error("Product fetch error:", err);
    productList.innerHTML =
      `<p style="color:red; text-align:center;">Error loading products. Try again later.</p>`;
  }
});
