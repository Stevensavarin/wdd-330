import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

import { formatPriceEUR } from "./currencyUtils.mjs"; // steven savarin

import Comments from './Comments.mjs'; // steven savarin W04

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));

      // Inicializa el sistema de comentarios
    this.comments = new Comments(this.productId);
    this.comments.init();
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    const existing = cartItems.find(item => item.Id === this.product.Id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      // Always use PrimaryMedium for cart images as per assignment
      if (this.product.Images && this.product.Images.PrimaryMedium) {
        this.product.Image = this.product.Images.PrimaryMedium;
      }
      this.product.quantity = 1;
      cartItems.push(this.product);
    }
    setLocalStorage("so-cart", cartItems);
    updateCartCount();
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.querySelector("#p-brand").textContent = product.Brand.Name;
  document.querySelector("#p-name").textContent = product.NameWithoutBrand;

  const productImage = document.querySelector("#productImage");
  let imageUrl = product.Images?.PrimaryExtraLarge || product.Image;
  if (imageUrl && !imageUrl.startsWith("http")) {
    imageUrl = import.meta.env.VITE_SERVER_URL + imageUrl;
  }
  productImage.src = imageUrl;
  productImage.alt = product.NameWithoutBrand;

  // Show consistent prices
  const priceContainer = document.querySelector("#productPrice"); //Steven Savarin W03
  priceContainer.innerHTML = ""; // Clean

  const priceWrapper = document.createElement("div");
  priceWrapper.classList.add("price-wrapper");

  const finalPriceEl = document.createElement("span");
  finalPriceEl.classList.add("final-price");
  finalPriceEl.textContent = formatPriceEUR(product.FinalPrice);
  priceWrapper.appendChild(finalPriceEl);

  if (product.SuggestedRetailPrice > product.FinalPrice) {
    const originalPriceEl = document.createElement("span");
    originalPriceEl.classList.add("original-price");
    originalPriceEl.textContent = formatPriceEUR(product.SuggestedRetailPrice);
    priceWrapper.appendChild(originalPriceEl);

    const discount = Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
    const discountEl = document.createElement("div");
    discountEl.classList.add("discount-tag");
    discountEl.textContent = `-${discount}% OFF`;
    priceWrapper.appendChild(discountEl);
  }

  priceContainer.appendChild(priceWrapper);

  document.querySelector("#productColor").textContent = product.Colors?.[0]?.ColorName || "";
  document.querySelector("#productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.querySelector("#addToCart").dataset.id = product.Id;
} //Steven Savarin W03

// ************* Alternative Display Product Details Method *******************
// function productDetailsTemplate(product) {
//   return `<section class="product-detail"> <h3>${product.Brand.Name}</h3>
//     <h2 class="divider">${product.NameWithoutBrand}</h2>
//     <img
//       class="divider"
//       src="${product.Image}"
//       alt="${product.NameWithoutBrand}"
//     />
//     <p class="product-card__price">$${product.FinalPrice}</p>
//     <p class="product__color">${product.Colors[0].ColorName}</p>
//     <p class="product__description">
//     ${product.DescriptionHtmlSimple}
//     </p>
//     <div class="product-detail__add">
//       <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
//     </div></section>`;
// }


