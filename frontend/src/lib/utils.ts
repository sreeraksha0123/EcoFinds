// src/lib/utils.ts

// Utility to notify all components that the cart has been updated
export const notifyCartUpdate = () => {
  window.dispatchEvent(new Event("cart-updated"));
};
