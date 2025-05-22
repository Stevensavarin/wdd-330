import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";
import { getLocalStorage } from "./utils.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
});

//Empty Card Error: cart.html - steven savarin

/*function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}*/

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];

  if (cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML =
      "<p>Your cart is empty.</p>";
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  let imageUrl = item.Image;
  if (imageUrl && !imageUrl.startsWith("http")) {
    imageUrl = import.meta.env.VITE_SERVER_URL + imageUrl;
  }
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${imageUrl}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0]?.ColorName || ""}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function showCartTotal() {
  const cart = getLocalStorage("so-cart") || [];
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");

  if (cart.length > 0) {
    // Calculate total
    const total = cart.reduce(
      (sum, item) => sum + Number(item.FinalPrice || 0),
      0,
    );
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartFooter.classList.remove("hide");
  } else {
    cartFooter.classList.add("hide");
  }
}

renderCartContents();
showCartTotal();
