import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
});