import axios from 'axios';

interface ChatResponse {
  status: string;
  answer: string;  
}

const API_URL = 'http://localhost:3000/api';

const chatDescriptions = {
  chat1: "Experto en creación de posts virales para redes sociales",
  chat2: "Especialista en diseño de historias para redes sociales",
  chat3: "Generador de imágenes por IA",
  chat4: "Analista de audiencia de marketing digital",
  chat5: "Detector de tendencias de mercado",
  chat6: "Experto en marketing de contenidos",
  chat7: "Especialista en SEO",
  chat8: "Experto en email marketing",
  chat9: "Analista de métricas digitales"
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const chatService = {
  sendMessage: async (chatId: number, message: string): Promise<string> => {
    console.log('chatService - sendMessage llamado con:', { chatId, message });
    
    try {
      const token = localStorage.getItem('token');
      console.log('chatService - Token obtenido:', token ? 'Presente' : 'No presente');

      // Validar que el chatId esté entre 1 y 9
      if (!chatId || isNaN(chatId) || chatId < 1 || chatId > 9) {
        throw new Error('Chat number debe estar entre 1 y 9');
      }

      // Formatear el mensaje con el formato exacto requerido
      const payload = {
        query: message,
        chatNumber: chatId  
      };

      console.log('chatService - Enviando payload:', payload);

      const response = await axios.post<ChatResponse>(
        `${API_URL}/chat/chat${chatId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('chatService - Respuesta del servidor:', response.data);
      
      // Extraer la respuesta del campo 'answer'
      if (!response.data.answer) {
        throw new Error('Respuesta del servidor no tiene el formato esperado');
      }

      return response.data.answer;
    } catch (error: any) {
      console.error('chatService - Error en la llamada API:', error);
      throw new Error(error.response?.data?.message || error.message || 'Error en la comunicación con el asistente');
    }
  },

  getChatDescription: (chatId?: number): string => {
    console.log('chatService - getChatDescription llamado con chatId:', chatId);
    
    if (!chatId || isNaN(chatId) || chatId < 1 || chatId > 9) {
      return 'Soy un asistente general. ¿En qué puedo ayudarte?';
    }

    const descriptions: { [key: number]: string } = {
      1: 'Soy tu asistente para crear publicaciones impactantes. Te ayudaré a redactar contenido atractivo y efectivo.',
      2: 'Soy tu analista de audiencia. Te ayudaré a entender mejor a tu público objetivo.',
      3: 'Soy tu experto en tendencias. Te mantendré al día con las últimas tendencias del mercado.',
      4: 'Soy tu asistente de optimización SEO. Te ayudaré a mejorar el posicionamiento de tu contenido.',
      5: 'Soy tu estratega de contenido. Te ayudaré a planificar y organizar tu calendario de contenidos.',
      6: 'Soy tu analista de métricas. Te ayudaré a interpretar y mejorar el rendimiento de tu contenido.',
      7: 'Soy tu asistente de investigación. Te ayudaré a encontrar información relevante para tu contenido.',
      8: 'Soy tu experto en engagement. Te ayudaré a aumentar la interacción con tu audiencia.',
      9: 'Soy tu analista de competencia. Te ayudaré a entender y diferenciarte de tu competencia.',
    };

    return descriptions[chatId] || 'Soy un asistente general. ¿En qué puedo ayudarte?';
  }
};
