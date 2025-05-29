import { loadHeaderFooter, updateCartCount, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
});

const dataSource = new ExternalServices();
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init().then(() => {
  const categoryRaw = product.product.Category || "Category";
  const category =
    categoryRaw.charAt(0).toUpperCase() + categoryRaw.slice(1);
  setBreadcrumb(category);
});

function setBreadcrumb(category) {
  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    breadcrumb.textContent = category;
    breadcrumb.style.display = "block";
  }
}

// // add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   addProductToCart(product);
// }

// // add listener to Add to Cart button
// document
//   .getElementById("addToCart")
//   .addEventListener("click", addToCartHandler);
