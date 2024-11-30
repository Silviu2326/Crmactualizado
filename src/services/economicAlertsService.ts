import axios from 'axios';

export interface EconomicAlert {
  id: number;
  mensaje: string;
  tipo: 'warning' | 'error' | 'info' | 'success';
  fecha?: string;
}

const BASE_URL = '/api/economic-alerts';

export const getEconomicAlerts = async (): Promise<EconomicAlert[]> => {
  try {
    const response = await axios.get<EconomicAlert[]>(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching economic alerts:', error);
    return [];
  }
};
