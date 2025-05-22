import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";

// Wait for header/footer to load, then update cart count
loadHeaderFooter().then(() => {
  updateCartCount();
});
