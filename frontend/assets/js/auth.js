// frontend/assets/js/auth.js
import { apiRequest } from "./api.js";

const authForm = document.getElementById("auth-form");
const formTitle = document.getElementById("form-title");
const toggleText = document.getElementById("toggle-text");
const toggleLink = document.getElementById("toggle-link");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitButton = authForm.querySelector("button");

let isLogin = true;

// 🔁 Toggle login/signup UI
function toggleAuthMode() {
  isLogin = !isLogin;

  if (isLogin) {
    formTitle.textContent = "Login";
    nameInput.classList.add("hidden");
    submitButton.textContent = "Login";
    toggleText.innerHTML = `
      Don’t have an account?
      <a href="#" id="toggle-link">Sign up</a>
    `;
  } else {
    formTitle.textContent = "Sign Up";
    nameInput.classList.remove("hidden");
    submitButton.textContent = "Sign Up";
    toggleText.innerHTML = `
      Already have an account?
      <a href="#" id="toggle-link">Login</a>
    `;
  }

  document
    .getElementById("toggle-link")
    .addEventListener("click", (e) => {
      e.preventDefault();
      toggleAuthMode();
    });
}

toggleLink.addEventListener("click", (e) => {
  e.preventDefault();
  toggleAuthMode();
});

// ✨ Toast helper
function showMessage(message, isError = false) {
  const msgDiv = document.createElement("div");
  msgDiv.textContent = message;
  msgDiv.style.position = "fixed";
  msgDiv.style.top = "20px";
  msgDiv.style.left = "50%";
  msgDiv.style.transform = "translateX(-50%)";
  msgDiv.style.background = isError ? "#e53e3e" : "#2f855a";
  msgDiv.style.color = "white";
  msgDiv.style.padding = "10px 20px";
  msgDiv.style.borderRadius = "8px";
  msgDiv.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
  msgDiv.style.zIndex = "1000";
  document.body.appendChild(msgDiv);
  setTimeout(() => msgDiv.remove(), 2500);
}

function validateInputs() {
  if (!emailInput.value.trim() || !passwordInput.value.trim()) {
    showMessage("Please fill out all required fields.", true);
    return false;
  }
  if (!isLogin && !nameInput.value.trim()) {
    showMessage("Please enter your name.", true);
    return false;
  }
  return true;
}

// 🚀 Handle login/signup
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateInputs()) return;

  submitButton.disabled = true;
  submitButton.textContent = isLogin ? "Logging in..." : "Signing up...";

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();

  try {
    if (isLogin) {
      const res = await apiRequest("/auth/login", "POST", { email, password });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      showMessage("✅ Logged in successfully!");
      setTimeout(() => (window.location.href = "./product.html"), 1000);
    } else {
      await apiRequest("/auth/signup", "POST", { name, email, password });
      showMessage("✅ Account created! Please log in.");
      setTimeout(() => window.location.reload(), 1500);
    }
  } catch (err) {
    showMessage("❌ " + err.message, true);
    console.error("Auth error:", err);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = isLogin ? "Login" : "Sign Up";
  }
});
