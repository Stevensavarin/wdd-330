import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

// Add a product to the cart stored in localStorage
function addProductToCart(product) {
  // Gets the current cart items from localStorage (or initialises with an empty array if it doesn't exist)
  const cartItems = getLocalStorage("so-cart") || [];
  
  // Add the product to the array of items in the cart.
  cartItems.push(product);
  
  // Update localStorage with the new array of cart items.
  setLocalStorage("so-cart", cartItems);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
