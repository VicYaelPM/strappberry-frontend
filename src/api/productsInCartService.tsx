import { baseUrl } from "./apiConfig";

interface ProductInCart {
  id_carrito: number | null;
  id_producto: number;
  cantidad_producto: number;
}

const productsInCartEndpoint = `${baseUrl}productsInCart`;


export async function createProductInCart(newProductInCart: ProductInCart) {
    try {
      const response = await fetch(productsInCartEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProductInCart),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const createdCart = await response.json();
      console.log("Producto agregado:", createdCart);
      return createdCart;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  export async function getProductsByIdCart(id_cart: number) {
    try {
      const url = `${productsInCartEndpoint}/${id_cart}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
  