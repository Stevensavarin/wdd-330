import { renderListWithTemplate } from "./utils.mjs";

import { formatPriceEUR } from "./currencyUtils.mjs"; //Steven Savarin W03

function productCardTemplate(product) { //Steven Savarin W03
  const hasDiscount = product.SuggestedRetailPrice > product.FinalPrice;
  const finalPrice = formatPriceEUR(product.FinalPrice);
  const originalPrice = hasDiscount ? formatPriceEUR(product.SuggestedRetailPrice) : "";
  const discountPercent = hasDiscount
    ? Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100)
    : null;

  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
        <div class="price-info">
          <span class="product-card__price">${finalPrice}</span>
          ${hasDiscount ? `<span class="product-card__original-price">${originalPrice}</span>` : ""}
        </div>
        ${hasDiscount ? `<div class="product-card__discount">-${discountPercent}% OFF</div>` : ""}
      </a>
      <button class="quick-view-btn" 
        data-id="${product.Id}"
        data-name="${product.Name}"
        data-brand="${product.Brand.Name}"
        data-price="${finalPrice}"
        data-image="${product.Images.PrimaryMedium}">
        Quick View
      </button>
    </li>
  `;
} //Steven Savarin W04

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);
  }

  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderListWithTemplate(productCardTemplate, this.listElement, list);

  }

}

