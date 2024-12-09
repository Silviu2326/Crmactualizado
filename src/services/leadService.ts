import axios from 'axios';

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api';

class LeadService {
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

  async deleteLead(id: string) {
    try {
      await axios.delete(`${API_URL}/leads/${id}`, this.getAuthConfig());
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  }
}

export const leadService = new LeadService();
