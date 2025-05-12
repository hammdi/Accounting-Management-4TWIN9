import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Change selon ton backend

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token"); // Récupérer le token depuis le stockage local
    console.log(token);
    if (!token) return null;

    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l’utilisateur", error);
    return null;
  }
};
