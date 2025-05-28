const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ExternalServices {
  constructor() {
    // this.category = category;
    // this.path = `../public/json/${this.category}.json`;
  }
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    console.log(data.Result);
    return data.Result;
  }

  async searchProducts(query) {
    const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    let allProducts = [];
    try {
      for (const category of categories) {
        const response = await fetch(`${baseURL}products/search/${category}`);
        const data = await convertToJson(response);
        allProducts = allProducts.concat(data.Result || []);
      }
      const lowerQuery = query.toLowerCase();
      return allProducts.filter(product =>
        (product.Name && product.Name.toLowerCase().includes(lowerQuery)) ||
        (product.Colors && product.Colors.length > 0 &&
          product.Colors[0].ColorName &&
          product.Colors[0].ColorName.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }
}