import axios from 'axios';

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api';

class FoodService {
  private getAuthConfig() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  // Obtener todos los alimentos
  async getAllFoods() {
    try {
      const response = await axios.get(`${API_URL}/foods`, this.getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching foods:', error);
      throw error;
    }
  }

  // Obtener un alimento específico
  async getFoodById(foodId: string) {
    try {
      const response = await axios.get(
        `${API_URL}/foods/${foodId}`,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching food:', error);
      throw error;
    }
  }

  // Crear un nuevo alimento
  async createFood(foodData: any) {
    try {
      const response = await axios.post(
        `${API_URL}/foods`,
        foodData,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating food:', error);
      throw error;
    }
  }

  // Actualizar un alimento existente
  async updateFood(foodId: string, foodData: any) {
    try {
      const response = await axios.put(
        `${API_URL}/foods/${foodId}`,
        foodData,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating food:', error);
      throw error;
    }
  }

  // Eliminar un alimento
  async deleteFood(foodId: string) {
    try {
      await axios.delete(
        `${API_URL}/foods/${foodId}`,
        this.getAuthConfig()
      );
    } catch (error) {
      console.error('Error deleting food:', error);
      throw error;
    }
  }
}

export const foodService = new FoodService();
