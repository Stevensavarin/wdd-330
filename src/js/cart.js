import { loadHeaderFooter } from "./utils.mjs";
import { setLocalStorage, getLocalStorage, updateCartCount } from "./utils.mjs";

import { formatPriceEUR } from "./currencyUtils.mjs"; // steven savarin

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

  //remove listener
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", function () {
      removeFromCart(this.dataset.id, this.dataset.color);
    });
  });

  //increase/decrease listeners
  document.querySelectorAll(".increment").forEach((btn) => {
    btn.addEventListener("click", function () {
      changeQuantity(this.dataset.id, this.dataset.color, 1);
    });
  });
  document.querySelectorAll(".decrement").forEach((btn) => {
    btn.addEventListener("click", function () {
      changeQuantity(this.dataset.id, this.dataset.color, -1);
    });
  });
}

function cartItemTemplate(item) {
  //Steven Savarin W03
  let imageUrl = item.Image;
  if (imageUrl && !imageUrl.startsWith("http")) {
    imageUrl = import.meta.env.VITE_SERVER_URL + imageUrl;
  }

  const finalPrice = Number(item.FinalPrice) * (item.quantity || 1);
  const suggestedPrice =
    Number(item.SuggestedRetailPrice) * (item.quantity || 1);

  const formattedFinalPrice = formatPriceEUR(finalPrice);
  const formattedSuggestedPrice = formatPriceEUR(suggestedPrice);

  const isDiscounted =
    Number(item.SuggestedRetailPrice) > Number(item.FinalPrice);
  const discountPercent = isDiscounted
    ? Math.round(
        ((Number(item.SuggestedRetailPrice) - Number(item.FinalPrice)) /
          Number(item.SuggestedRetailPrice)) *
          100,
      )
    : 0;

  return `
    <li class="cart-card divider" data-id="${item.Id}" data-color="${item.selectedColor?.ColorCode || ''}">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <h2 class="card__name">${item.Name}</h2>
      <p class="cart-card__color">
        ${item.selectedColor?.ColorName 
          ? `<img src="${item.selectedColor.ColorChipImageSrc}" alt="${item.selectedColor.ColorName}" style="width:20px;height:20px;border-radius:50%;vertical-align:middle;margin-right:6px;">${item.selectedColor.ColorName}` 
          : ""}
      </p>
      <p class="cart-card__quantity">
        qty: <span class="quantity" data-id="${item.Id}">${item.quantity || 1}</span>
        <button class="decrement" data-id="${item.Id}" data-color="${item.selectedColor?.ColorCode || ''}">-</button>
        <button class="increment" data-id="${item.Id}" data-color="${item.selectedColor?.ColorCode || ''}">+</button>
      </p>
      <p class="cart-card__price">
        <span class="final-price">${formattedFinalPrice}</span>
        ${
          isDiscounted
            ? `<span class="original-price">${formattedSuggestedPrice}</span>
               <span class="discount-tag">-${discountPercent}% OFF</span>`
            : ""
        }
      </p>
      <span class="remove-item" data-id="${item.Id}" data-color="${item.selectedColor?.ColorCode || ''}" style="cursor:pointer;">❌</span>
    </li>
  `;
} //Steven Savarin W03 + Tymur Pushnoy W04

// Show cart total in EUR and formatted
function showCartTotal() {
  //Steven Savarin W03
  const cart = getLocalStorage("so-cart") || [];
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");

  if (cart.length > 0) {
    //multiplying price by quantity for each item
    const total = cart.reduce(
      (sum, item) => sum + Number(item.FinalPrice) * (item.quantity || 1),
      0,
    );
    cartTotal.textContent = `Total: ${formatPriceEUR(total)}`;
    cartFooter.classList.remove("hide");
  } else {
    cartFooter.classList.add("hide");
  }
} //Steven Savarin W03

renderCartContents();
showCartTotal();

function removeFromCart(id, colorCode) {
  let cart = getLocalStorage("so-cart") || [];
  cart = cart.filter(
    (item) =>
      !(item.Id === id && (item.selectedColor?.ColorCode || "") === (colorCode || ""))
  );
  setLocalStorage("so-cart", cart);
  renderCartContents();
  showCartTotal();
  updateCartCount();
}

function changeQuantity(id, colorCode, quantityChange) {
  let cart = getLocalStorage("so-cart") || [];
  cart = cart.map((item) => {
    if (
      item.Id === id &&
      (item.selectedColor?.ColorCode || "") === (colorCode || "")
    ) {
      let newQty = (item.quantity || 1) + quantityChange;
      if (newQty < 1) newQty = 1;
      return { ...item, quantity: newQty };
    }
    return item;
  });
  setLocalStorage("so-cart", cart);
  renderCartContents();
  showCartTotal();
  updateCartCount();
}
