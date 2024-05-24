// src/api/authService.ts
import { baseUrl } from "./apiConfig";

interface LoginData {
  email: string;
  password: string;
}

export async function loginUser(loginData: LoginData) {
  try {
    const response = await fetch(`${baseUrl}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    if (!response.ok) {
      const errorDetail = await response.text(); // Obtener detalles del error
      throw new Error(
        `HTTP error! Status: ${response.status} - ${errorDetail}`
      );
    }
    const userData = await response.json();
    console.log("Usuario autenticado:", userData);
    return userData;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Fetch error:", error);
      throw error; // Re-lanzar el error para que pueda ser capturado por el componente
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Unexpected error occurred");
    }
  }
}

export async function logoutUser() {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${baseUrl}logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
    });
    if (!response.ok) {
      localStorage.removeItem('accessToken');
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log("Sesión cerrada exitosamente.");
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
