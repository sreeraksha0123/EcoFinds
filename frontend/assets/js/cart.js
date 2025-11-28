// frontend/assets/js/cart.js
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

  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "./index.html";
    });
  }

  async function loadCart() {
    cartItemsEl.innerHTML = `<p class="loader">Loading cart...</p>`;
    cartTotalEl.textContent = "";

    try {
      const res = await apiRequest("/cart", "GET", null, token);
      const items = res.items || res.data || [];

      if (!items.length) {
        cartItemsEl.innerHTML = `<p class="cart-empty">Your cart is empty.</p>`;
        cartTotalEl.textContent = "";
        return;
      }

      let total = 0;

      cartItemsEl.innerHTML = items
        .map((item) => {
          const price = Number(item.price);
          const qty = Number(item.quantity);
          const subtotal = item.total_price
            ? Number(item.total_price)
            : price * qty;

          total += subtotal;

          return `
          <div class="cart-item">
            <div class="cart-info">
              <h4>${item.name}</h4>
              <p>Quantity: ${qty}</p>
              <p>Price: ₹${price.toFixed(2)}</p>
              <p><strong>Subtotal: ₹${subtotal.toFixed(2)}</strong></p>
            </div>
            <button class="remove-btn" data-id="${item.product_id}">
              Remove
            </button>
          </div>`;
        })
        .join("");

      cartTotalEl.textContent = `Total: ₹${total.toFixed(2)}`;

      document.querySelectorAll(".remove-btn").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const productId = e.target.getAttribute("data-id");
          try {
            await apiRequest(`/cart/${productId}`, "DELETE", null, token);
            showMessage("🗑️ Item removed");
            loadCart();
          } catch (err) {
            console.error("Remove error:", err);
            showMessage("❌ Could not remove item", true);
          }
        });
      });
    } catch (err) {
      console.error("Cart fetch error:", err);
      cartItemsEl.innerHTML =
        `<p style="color:red; text-align:center;">Error loading cart.</p>`;
    }
  }

  await loadCart();
});
