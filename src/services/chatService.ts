import axios from 'axios';

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api';

export interface Message {
  _id: string;
  conversacion: string;
  emisor: string;
  receptor: string;
  contenido: string;
  tipo: 'texto' | 'imagen' | 'archivo';
  urlArchivo: string | null;
  leido: boolean;
  fechaEnvio: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  _id: string;
  trainer: {
    _id: string;
    nombre: string;
    email: string;
  };
  cliente: {
    _id: string;
    nombre: string;
    email: string;
  };
  participantes: string[];
  estado: string;
  createdAt: string;
  updatedAt: string;
  fechaUltimoMensaje?: string;
  ultimoMensaje?: Message;
}

interface ChatResponse {
  chat: Chat;
  mensajes: Message[];
}

const getHeaders = () => {
  console.log('🔐 ChatService - Obteniendo headers para la petición');
  const token = localStorage.getItem('token') || localStorage.getItem('jwt');
  
  if (!token) {
    console.error('❌ ChatService - No se encontró token de autenticación');
    throw new Error('No se encontró el token de autenticación');
  }
  
  console.log('✅ ChatService - Token encontrado y headers generados');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const chatService = {
  async iniciarChat(clienteId: string): Promise<Chat> {
    console.log('🚀 ChatService - Iniciando chat para cliente:', clienteId);
    try {
      const headers = getHeaders();
      console.log('📤 ChatService - Realizando petición GET para iniciar chat');
      
      const response = await axios.get(`${API_URL}/iniciar/${clienteId}`, { headers });
      console.log('📥 ChatService - Respuesta recibida:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ ChatService - Error al iniciar chat:', error);
      console.error('📝 ChatService - Detalles del error:', {
        mensaje: error.message,
        respuesta: error.response?.data,
        estado: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Error al iniciar el chat');
    }
  },

  async getChatMessages(chatId: string): Promise<ChatResponse> {
    console.log('🔍 ChatService - Obteniendo mensajes para chat:', chatId);
    try {
      const headers = getHeaders();
      console.log('📤 ChatService - Realizando petición GET para obtener mensajes');
      
      const response = await axios.get(`${API_URL}/${chatId}`, { headers });
      console.log('📥 ChatService - Respuesta recibida:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ ChatService - Error al obtener mensajes:', error);
      console.error('📝 ChatService - Detalles del error:', {
        mensaje: error.message,
        respuesta: error.response?.data,
        estado: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Error al obtener los mensajes');
    }
  },

  async sendMessage(chatId: string, contenido: string): Promise<Message> {
    console.log('💬 ChatService - Enviando mensaje:', { chatId, contenido });
    try {
      const headers = getHeaders();
      console.log('📤 ChatService - Realizando petición POST para enviar mensaje');
      
      const response = await axios.post(
        `${API_URL}/chats/${chatId}/mensajes`,
        { contenido },
        { headers }
      );
      console.log('📥 ChatService - Mensaje enviado:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ ChatService - Error al enviar mensaje:', error);
      console.error('📝 ChatService - Detalles del error:', {
        mensaje: error.message,
        respuesta: error.response?.data,
        estado: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Error al enviar el mensaje');
    }
  },

  getChatDescription: (chatId: number | undefined) => {
    if (!chatId) return '';
    
    const descriptions: { [key: number]: string } = {
      1: 'Genera posts virales para tus redes sociales con IA avanzada',
      2: 'Diseña historias cautivadoras que conecten con tu audiencia',
      3: 'Desarrolla estrategias efectivas de contenido',
      4: 'Crea planes de entrenamiento rápidos y efectivos',
      5: 'Analiza y adapta entrenamientos según lesiones',
      6: 'Optimiza tus hábitos diarios para mejor rendimiento',
      7: 'Supera mesetas en tu rendimiento',
      8: 'Define objetivos específicos y alcanzables',
      9: 'Genera contenido atractivo para redes sociales',
      10: 'Diseña retos motivadores para tus clientes',
      11: 'Visualiza diferentes escenarios de progreso',
      12: 'Optimiza tu entrenamiento en casa',
      13: 'Ejercicios y rutinas para el trabajo',
      14: 'Mejora tu presencia profesional',
      15: 'Mantén tu rutina mientras viajas',
      16: 'Organiza y gestiona sesiones grupales',
      17: 'Desarrolla hábitos sostenibles',
      18: 'Analiza y comprende tu audiencia'
    };
    
    return descriptions[chatId] || 'Inicia una conversación con esta herramienta';
  }
};
