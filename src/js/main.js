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

document.addEventListener("DOMContentLoaded", () => {
  // Existing search form logic
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

  // Newsletter signup functionality
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const message = document.getElementById("message");

      if (email) {
        message.innerText = `Thank you for subscribing, ${email}!`;
        message.style.color = "green";
      } else {
        message.innerText = "Please enter a valid email.";
        message.style.color = "red";
      }
    });
  }
});

// Call to action for first time users - Sydney Bohl
document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('welcomeModal');
  const closeButton = document.getElementById('closeModal');

  // A check to see if the user has already seen the pop-up
  const hasVisited = localStorage.getItem('hasVisited');

  if (!hasVisited) {
    modal.style.display = 'block';
    localStorage.setItem('hasVisited', 'true');
  }

  // Close the pop-up
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close the pop-up if the user clicks outside of it
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});