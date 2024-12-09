import axios from 'axios';

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api';

class CampaignService {
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

  // Obtener todas las campañas
  async getAllCampaigns() {
    try {
      const response = await axios.get(`${API_URL}/campaigns`, this.getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  // Obtener una campaña específica
  async getCampaignById(campaignId: string) {
    try {
      const response = await axios.get(
        `${API_URL}/campaigns/${campaignId}`,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      throw error;
    }
  }

  // Crear una nueva campaña
  async createCampaign(campaignData: any) {
    try {
      const response = await axios.post(
        `${API_URL}/campaigns`,
        campaignData,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  // Actualizar una campaña existente
  async updateCampaign(campaignId: string, campaignData: any) {
    try {
      const response = await axios.put(
        `${API_URL}/campaigns/${campaignId}`,
        campaignData,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  }

  // Eliminar una campaña
  async deleteCampaign(campaignId: string) {
    try {
      await axios.delete(
        `${API_URL}/campaigns/${campaignId}`,
        this.getAuthConfig()
      );
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  }
}

export const campaignService = new CampaignService();
