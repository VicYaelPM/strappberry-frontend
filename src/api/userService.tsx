// src/api/userService.ts
import { baseUrl } from "./apiConfig";

interface User {
  name: string;
  email: string;
  password: string;
}

const userEndpoint = `${baseUrl}users`;

// Función para realizar una solicitud GET para obtener todos los usuarios
export async function getUsers() {
  try {
    const response = await fetch(userEndpoint);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const users = await response.json();
    console.log("Usuarios:", users);
    return users;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function createUser(newUser: User) {
  try {
    const response = await fetch(userEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const createdUser = await response.json();
    console.log("Usuario creado:", createdUser);
    return createdUser;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

export async function getUserByEmail(email: string) {
  try {
    const url = `${userEndpoint}/byEmail`; 
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), 
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const userData = await response.json(); // Obtiene los datos del usuario
    console.log("Usuario encontrado:", userData);
    return userData;
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    return null; 
  }
}


// Función para realizar una solicitud PUT para actualizar un usuario existente
export async function updateUser(userId: number, updatedUserData: User) {
  try {
    const url = `${userEndpoint}/${userId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const updatedUser = await response.json();
    console.log("Usuario actualizado:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Función para realizar una solicitud DELETE para eliminar un usuario existente
export async function deleteUser(userId: number) {
  try {
    const url = `${userEndpoint}/${userId}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log("Usuario eliminado exitosamente.");
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
