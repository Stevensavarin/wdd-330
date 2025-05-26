import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";

import Alert from "./Alert.js"; //Steven Savarin W03

// Wait for header/footer to load, then update cart count
loadHeaderFooter().then(() => {
  updateCartCount();
});

const alert = new Alert("/json/alerts.json");
alert.init(); //Steven Savarin W03

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const query = document.getElementById("searchInput").value.trim();
      if (query) {
        window.location.href = `/product_listing/index.html?search=${encodeURIComponent(query)}`;
      }
    });
  }
});
