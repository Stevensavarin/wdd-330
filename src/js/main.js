import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

const dataSource = new ProductData("tents");

const element = document.querySelector(".product-list");

const productList = new ProductList("Tents", dataSource, element);

productList.init();

function updatecartCount() {
    const cart = JSON.parse(localStorage.getItem("so-cart")) || [];
    const countIcon = document.querySelector(".item-count");
    if (countIcon) {
        countIcon.textContent = cart.length;
    }
}

updatecartCount();