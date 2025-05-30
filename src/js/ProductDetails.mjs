import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

import { formatPriceEUR } from "./currencyUtils.mjs"; // steven savarin

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    this.selectedColorIdx = 0;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    // Get the selected color (default to first if none)
    const colors = this.product.Colors || [];
    const color = colors[this.selectedColorIdx] || colors[0] || {};

    // Create a unique key for product+color
    const cartKey = `${this.product.Id}_${color.ColorCode || "default"}`;

    // Check if this exact product+color is already in the cart
    let existing = cartItems.find(
      item => item.Id === this.product.Id && item.selectedColor?.ColorCode === color.ColorCode
    );

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      // Always use PrimaryMedium for cart images as per assignment
      let image = this.product.Images && this.product.Images.PrimaryMedium
        ? this.product.Images.PrimaryMedium
        : this.product.Image;

      const cartProduct = {
        ...this.product,
        Image: image,
        quantity: 1,
        selectedColor: {
          ColorCode: color.ColorCode,
          ColorName: color.ColorName,
          ColorPreviewImageSrc: color.ColorPreviewImageSrc,
          ColorChipImageSrc: color.ColorChipImageSrc
        }
      };
      cartItems.push(cartProduct);
    }
    setLocalStorage("so-cart", cartItems);
    updateCartCount();

    // Trigger animation bounce here - Sydney Bohl
    const cartIcon = document.querySelector(".cart-icon");
    if (cartIcon) {
      cartIcon.classList.add("bounce");
      cartIcon.addEventListener("animationend", () => {
        cartIcon.classList.remove("bounce");
      }, { once: true });
    }
  }

  renderProductDetails() {
    productDetailsTemplate(this.product, this);
  }
}

function productDetailsTemplate(product, productDetailsInstance) {
  document.querySelector("#p-brand").textContent = product.Brand.Name;
  document.querySelector("#p-name").textContent = product.NameWithoutBrand;

  // --- COLOR SWATCHES ---
  const swatchContainer = document.getElementById("colorSwatches");
  swatchContainer.innerHTML = "";
  productDetailsInstance.selectedColorIdx = 0;

  //hide by default
  swatchContainer.style.display = "none";

  if (product.Colors && product.Colors.length > 1) {
    swatchContainer.style.display = "flex"; //show only if multiple colors
    product.Colors.forEach((color, idx) => {
      const swatch = document.createElement("button");
      swatch.type = "button";
      swatch.className = "color-swatch" + (idx === 0 ? " selected" : "");
      swatch.title = color.ColorName;

      const img = document.createElement("img");
      img.src = color.ColorPreviewImageSrc;
      img.alt = color.ColorName + " swatch";
      swatch.appendChild(img);

      swatch.addEventListener("click", () => {
        swatchContainer.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("selected"));
        swatch.classList.add("selected");
        productDetailsInstance.selectedColorIdx = idx;
        document.querySelector("#productColor").textContent = color.ColorName;
      });

      swatchContainer.appendChild(swatch);
    });
    //set initial color name
    document.querySelector("#productColor").textContent = product.Colors[0].ColorName;
  } else if (product.Colors && product.Colors.length === 1) {
    //only one color, hide swatches and show its name
    swatchContainer.style.display = "none";
    document.querySelector("#productColor").textContent = product.Colors[0].ColorName;
  } else {
    //no colors, hide swatches and clear color name
    swatchContainer.style.display = "none";
    document.querySelector("#productColor").textContent = "";
  }

  // --- CAROUSEL LOGIC ---
  const carouselContainer = document.querySelector("#productImageCarousel");
  carouselContainer.innerHTML = "";

  //always use the original main image, regardless of color selection
  let mainImgUrl;
  if (product.Images && product.Images.PrimaryExtraLarge) {
    mainImgUrl = product.Images.PrimaryExtraLarge;
  } else {
    mainImgUrl = product.Image;
  }

  //gaather extra images (only for the default color)
  let images = [mainImgUrl];
  if (product.Images && product.Images.ExtraImages && product.Images.ExtraImages.length > 0) {
    images = [mainImgUrl, ...product.Images.ExtraImages.map(img => img.Src)];
  }

  //main image element
  let currentIndex = 0;
  const mainImg = document.createElement("img");
  mainImg.className = "carousel-main-image";
  mainImg.src = mainImgUrl;
  mainImg.alt = product.NameWithoutBrand;
  carouselContainer.appendChild(mainImg);

  //thumbnails if more than one image
  if (images.length > 1) {
    const thumbs = document.createElement("div");
    thumbs.className = "carousel-thumbnails";
    images.forEach((imgUrl, idx) => {
      const thumb = document.createElement("img");
      thumb.className = "carousel-thumb";
      thumb.src = imgUrl;
      thumb.alt = product.NameWithoutBrand + " thumbnail " + (idx + 1);
      thumb.addEventListener("click", () => {
        mainImg.src = thumb.src;
        currentIndex = idx;
      });
      thumbs.appendChild(thumb);
    });
    carouselContainer.appendChild(thumbs);
  }

  // --- PRICES, DESCRIPTION, ETC. (unchanged) ---
  const priceContainer = document.querySelector("#productPrice");
  priceContainer.innerHTML = "";

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

  document.querySelector("#productDesc").innerHTML = product.DescriptionHtmlSimple;
  document.querySelector("#addToCart").dataset.id = product.Id;
}

//Steven Savarin W03

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


