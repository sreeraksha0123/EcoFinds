// frontend/assets/js/auth.js
import { apiRequest } from "./api.js";

const authForm = document.getElementById("auth-form");
const formTitle = document.getElementById("form-title");
const toggleText = document.getElementById("toggle-text");
const toggleLink = document.getElementById("toggle-link");
const nameInput = document.getElementById("name");

let isLogin = true; // Start with login mode

// Toggle between login/signup mode
toggleLink.addEventListener("click", (e) => {
  e.preventDefault();
  isLogin = !isLogin;

  if (isLogin) {
    formTitle.textContent = "Login";
    toggleText.innerHTML = `Don’t have an account? <a href="#" id="toggle-link">Sign up</a>`;
    nameInput.classList.add("hidden");
    authForm.querySelector("button").textContent = "Login";
  } else {
    formTitle.textContent = "Sign Up";
    toggleText.innerHTML = `Already have an account? <a href="#" id="toggle-link">Login</a>`;
    nameInput.classList.remove("hidden");
    authForm.querySelector("button").textContent = "Sign Up";
  }
});

// Handle form submission
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const name = document.getElementById("name").value.trim();

  try {
    if (isLogin) {
      // Login
      const res = await apiRequest("/auth/login", "POST", { email, password });
      localStorage.setItem("token", res.token);
      alert("✅ Logged in successfully!");
      window.location.href = "./product.html";
    } else {
      // Signup
      const res = await apiRequest("/auth/signup", "POST", { name, email, password });
      alert("✅ Account created successfully! Please log in.");
      window.location.reload();
    }
  } catch (err) {
    alert("❌ " + err.message);
  }
});
