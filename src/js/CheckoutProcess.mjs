import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  // convert the form data to a JSON object
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  const simplifiedItems = items.map((item) => {
    console.log(item);
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: item.quantity || 1
    };
  });
  console.log(simplifiedItems);
  return simplifiedItems;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // calculate and display the total quantity of items in the cart, and the subtotal
    const itemNumElement = document.querySelector(
      this.outputSelector + " #num-items"
    );
    const summaryElement = document.querySelector(
      this.outputSelector + " #cartTotal"
    );
    // Sum up the quantity of each item
    const totalQuantity = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);
    itemNumElement.innerText = totalQuantity;
    // calculate the total of all the items in the cart
    const amounts = this.list.map((item) => (item.FinalPrice * (item.quantity || 1)));
    this.itemTotal = amounts.reduce((sum, item) => sum + item, 0);
    summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`; // Add $ sign back
  }

  calculateOrderTotal() {
    // Calculate total quantity of all items
    const totalQuantity = this.list.reduce((sum, item) => sum + (item.quantity || 1), 0);

    this.tax = this.itemTotal * 0.06;
    this.shipping = 10 + (totalQuantity > 1 ? (totalQuantity - 1) * 2 : 0);
    this.orderTotal =
      parseFloat(this.itemTotal) +
      parseFloat(this.tax) +
      parseFloat(this.shipping);

    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout() {
    const formElement = document.forms["checkout"];
    const order = formDataToJSON(formElement);

    order.orderDate = new Date().toISOString();
    order.orderTotal = this.orderTotal.toFixed(2); // string
    order.tax = this.tax.toFixed(2);               // string
    order.shipping = Number(this.shipping);         // number
    order.items = packageItems(this.list);

    console.log(order);

    try {
      const response = await services.checkout(order);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
}