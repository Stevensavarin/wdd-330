import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam, updateCartCount } from "./utils.mjs";
import { initQuickViewModal } from "./quickViewModal.mjs"; //Steven Savarin W04

loadHeaderFooter().then(() => {
  updateCartCount();
});

const searchQuery = getParam("search");
const category = getParam("category");

const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");
const sortSelect = document.getElementById("sort");

let currentList = []; // will store the default display of products

function sortProducts(products, sortBy) {
  const sorted = products.slice();

  if (sortBy === "name") {
    sorted.sort((a, b) => a.Name.localeCompare(b.Name));
  } else if (sortBy === "price") {
    sorted.sort((a, b) => a.FinalPrice - b.FinalPrice);
  }
  return sorted;
}

// handle for the drop down change
function handleSortChange() {
  const selected = sortSelect.value;
  const sortedList = sortProducts(currentList, selected);
  listElement.innerHTML = "";
  const myList = new ProductList(null, dataSource, listElement);
  myList.renderList(sortedList);
  initQuickViewModal(); //Steven Savarin W04
}

sortSelect.addEventListener("change", handleSortChange);

if (searchQuery) {
  // If searching, fetch search results from API
  dataSource.searchProducts(searchQuery).then((results) => {
    const myList = new ProductList(null, dataSource, listElement);
    myList.renderList(results);
    initQuickViewModal(); //Steven Savarin W04
    document.querySelector(".title.highlight").textContent =
      `Results for "${searchQuery}"`;

    // Show message if no products found
    if (!results || results.length === 0) {
      listElement.innerHTML = `<li style="width:100%;text-align:center;font-size:1.2em;margin:2em 0;">There are no products matching your description.</li>`;
    }
    // Set breadcrumb for search
    setBreadcrumb("Search", results.length);
  });
} else if (category) {
  const displayCategory = category
    ? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";
  document.querySelector(".title.highlight").textContent = displayCategory;

  const myList = new ProductList(category, dataSource, listElement);

  // Get the product data, store it, and render
  dataSource.getData(category).then((results) => {
    currentList = results;
    myList.renderList(results);
    initQuickViewModal(); //Steven Savarin W04

    setBreadcrumb(displayCategory, results.length);
  });

}

function setBreadcrumb(category, count) {
  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    breadcrumb.textContent = `${category} → (${count} items)`;
    breadcrumb.style.display = "block";
  }
}