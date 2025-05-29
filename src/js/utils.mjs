// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get the product id from the query string
export function getParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}


export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if(callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("so-cart")) || [];
  const countIcon = document.querySelector(".item-count");
  if (countIcon) {
      //sum up the quantity of each item in the list
      const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      countIcon.textContent = totalCount;
  }
}

export function alertMessage(message, scroll = true) {
  // create element to hold the alert
  const alert = document.createElement('div');
  alert.classList.add('error-message'); // Use a unique class for styling

  // set the contents: message and an X button
  alert.innerHTML = `<span class="error-text">${message}</span><button class="error-close">X</button>`;

  // add a listener to the X button to remove the alert
  alert.querySelector('.error-close').addEventListener('click', function () {
    alert.remove();
  });

  // add the alert to the top of main
  const main = document.querySelector('main');
  if (main) {
    main.prepend(alert);
    // scroll to top if requested
    if (scroll) window.scrollTo(0, 0);
  }
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".error-message");
  alerts.forEach((alert) => alert.remove());
}

