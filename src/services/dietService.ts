import axios from 'axios';

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api';

class DietService {
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

  // Obtener todas las dietas
  async getAllDiets() {
    try {
      const response = await axios.get(`${API_URL}/diets`, this.getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching diets:', error);
      throw error;
    }
  }

  // Obtener una dieta específica
  async getDietById(dietId: string) {
    try {
      const response = await axios.get(
        `${API_URL}/diets/${dietId}`,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching diet:', error);
      throw error;
    }
  }

  // Crear una nueva dieta
  async createDiet(dietData: any) {
    try {
      const response = await axios.post(
        `${API_URL}/diets`,
        dietData,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating diet:', error);
      throw error;
    }
  }

  // Actualizar una dieta existente
  async updateDiet(dietId: string, dietData: any) {
    try {
      const response = await axios.put(
        `${API_URL}/diets/${dietId}`,
        dietData,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating diet:', error);
      throw error;
    }
  }

  // Eliminar una dieta
  async deleteDiet(dietId: string) {
    try {
      await axios.delete(
        `${API_URL}/diets/${dietId}`,
        this.getAuthConfig()
      );
    } catch (error) {
      console.error('Error deleting diet:', error);
      throw error;
    }
  }
}

export const dietService = new DietService();
