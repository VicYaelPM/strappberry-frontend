import { baseUrl } from "./apiConfig";

interface Cart {
  id_user: number;
  costo_total: number;
}

const cartEndpoint = `${baseUrl}carritos`;


export async function createCart(newCart: Cart) {
    try {
      const response = await fetch(cartEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCart),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const createdCart = await response.json();
      console.log("Carrito creado:", createdCart);
      return createdCart;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }