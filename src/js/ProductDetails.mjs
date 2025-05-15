import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    console.log("Looking for productId:", this.productId);
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    console.log("Product found:", this.product);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on "this" to understand why.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  if (!product) {
    document.querySelector("h2").textContent = "Product Not Found";
    document.querySelector("h3").textContent = "";
    document.getElementById("productImage").src = "../images/camping-products.jpg";
    document.getElementById("productImage").alt = "No product";
    document.getElementById("productPrice").textContent = "";
    document.getElementById("productColor").textContent = "";
    document.getElementById("productDesc").innerHTML = "Sorry, we couldn't find that product.";
    document.getElementById("addToCart").disabled = true;
    return;
  }

  document.querySelector("h2").textContent = product.Brand?.Name || "Brand";
  document.querySelector("h3").textContent = product.NameWithoutBrand || "Product";

  const productImage = document.getElementById("productImage");
  productImage.src = product.Image || "../images/camping-products.jpg";
  productImage.alt = product.NameWithoutBrand || "Product";

  document.getElementById("productPrice").textContent = product.FinalPrice || "";
  document.getElementById("productColor").textContent = product.Colors?.[0]?.ColorName || "";
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple || "";

  document.getElementById("addToCart").dataset.id = product.Id || "";
}

