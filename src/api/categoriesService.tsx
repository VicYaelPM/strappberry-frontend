import { baseUrl } from "./apiConfig";

const categoryEndpoint = `${baseUrl}categoria_productos`;

export async function getCategories() {
  try {
    const response = await fetch(categoryEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const categories = await response.json();
    console.log("Categorias:", categories);
    return categories;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
