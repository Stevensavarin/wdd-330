import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam, updateCartCount } from "./utils.mjs";

loadHeaderFooter().then(() => {
  updateCartCount();
});

const searchQuery = getParam("search");
const category = getParam("category");

const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

if (searchQuery) {
  // If searching, fetch search results from API
  dataSource.searchProducts(searchQuery).then((results) => {
    // Render results using your existing template
    const myList = new ProductList(null, dataSource, listElement);
    myList.renderList(results);
    document.querySelector(".title.highlight").textContent =
      `Results for "${searchQuery}"`;
  });
} else if (category) {
  // Existing category logic
  const displayCategory = category
    ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";
  document.querySelector(".title.highlight").textContent = displayCategory;
  const myList = new ProductList(category, dataSource, listElement);
  myList.init();
}
