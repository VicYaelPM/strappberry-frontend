import { baseUrl } from "./apiConfig";

interface Product {
  nombre: string;
  precio: number;
  descripcion: string;
  id_categoria: number;
  peso: number;
  imagen: File | null;
}

const productsEndpoint = `${baseUrl}products`;

async function createProduct(productData: FormData): Promise<void> {
  try {
    const response = await fetch(`${productsEndpoint}`, {
      method: "POST",
      body: productData,
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }
  } catch (error) {
    throw new Error("Error creating product");
  }
}

async function getProducts() {
  try {
    const response = await fetch(productsEndpoint);
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

async function getProductsByCategory(id_category: number) {
  try {
    const url = `${productsEndpoint}/category/${id_category}`;
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

async function updateProduct(id: number, product: Product): Promise<void> {
  try {
    const response = await fetch(`${productsEndpoint}/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error("Failed to update product");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

async function deleteProduct(id: number): Promise<void> {
  try {
    console.log("endpoint", `${productsEndpoint}/${id}`);
    const response = await fetch(`${productsEndpoint}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

export { createProduct, getProducts, updateProduct, deleteProduct, getProductsByCategory };
