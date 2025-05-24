import { loadHeaderFooter } from "./utils.mjs";
import { updateCartCount } from "./utils.mjs";

import Alert from './Alert.js';//Steven Savarin W03


// Wait for header/footer to load, then update cart count
loadHeaderFooter().then(() => {
  updateCartCount();
});

const alert = new Alert('/json/alerts.json');
alert.init();//Steven Savarin W03