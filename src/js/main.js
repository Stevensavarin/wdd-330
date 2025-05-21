import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

// Wait for header/footer to load, then update cart count
loadHeaderFooter().then(() => {
    updateCartCount();
});

const dataSource = new ProductData("tents");
const element = document.querySelector(".product-list");
const productList = new ProductList("Tents", dataSource, element);
productList.init();