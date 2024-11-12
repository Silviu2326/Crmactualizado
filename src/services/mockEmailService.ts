import { Campaign, NewCampaignData, Template, AutomationRule } from '../types/campaign';
import { addDays, format } from 'date-fns';

class MockEmailService {
  private campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Campaña de Verano 2024',
      status: 'sending',
      subject: '🏋️‍♂️ ¡Únete al Desafío de Verano!',
      content: 'Prepárate para el verano con nuestro desafío de 30 días...',
      scheduledDate: new Date(),
      stats: {
        openRate: 45.2,
        clickRate: 12.8,
        conversionRate: 8.5,
        bounceRate: 1.2
      },
      segments: ['miembros_activos', 'entusiastas_fitness']
    },
    {
      id: '2',
      name: 'Programa Propósitos 2024',
      status: 'scheduled',
      subject: '🎯 Alcanza tus Metas Fitness en 2024',
      content: 'Comienza tu viaje fitness con nuestros programas personalizados...',
      scheduledDate: addDays(new Date(), 5),
      stats: {
        openRate: 52.1,
        clickRate: 18.4,
        conversionRate: 12.3,
        bounceRate: 0.8
      },
      segments: ['nuevos_miembros', 'perdida_peso']
    },
    {
      id: '3',
      name: 'Newsletter Nutrición',
      status: 'draft',
      subject: '🥗 Tips de Nutrición Semanal',
      content: 'Descubre los mejores consejos para una alimentación saludable...',
      scheduledDate: addDays(new Date(), 2),
      stats: {
        openRate: 38.5,
        clickRate: 15.2,
        conversionRate: 7.8,
        bounceRate: 1.5
      },
      segments: ['interesados_nutricion']
    },
    {
      id: '4',
      name: 'Promoción Especial',
      status: 'sent',
      subject: '🎉 Oferta Exclusiva de Primavera',
      content: 'Aprovecha nuestras ofertas especiales...',
      scheduledDate: addDays(new Date(), -1),
      stats: {
        openRate: 62.3,
        clickRate: 25.1,
        conversionRate: 15.4,
        bounceRate: 0.9
      },
      segments: ['todos_miembros']
    }
  ];

  private templates: Template[] = [
    {
      id: 't1',
      name: 'Recordatorio de Sesión',
      type: 'reminder',
      content: 'Te recordamos tu próxima sesión de entrenamiento...',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300'
    },
    {
      id: 't2',
      name: 'Newsletter Mensual',
      type: 'newsletter',
      content: 'Descubre los consejos fitness y casos de éxito de este mes...',
      thumbnail: 'https://images.unsplash.com/photo-1574411676363-9e4590a48c0b?w=300'
    }
  ];

  private automationRules: AutomationRule[] = [
    {
      id: 'a1',
      name: 'Serie de Bienvenida',
      trigger: {
        type: 'welcome',
        conditions: { daysSinceJoined: 0 }
      },
      action: {
        type: 'send_email',
        templateId: 't1'
      },
      isActive: true
    }
  ];

  async getCampaigns(): Promise<Campaign[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.campaigns), 500);
    });
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.campaigns.find(c => c.id === id));
      }, 300);
    });
  }

  async createCampaign(campaignData: NewCampaignData): Promise<Campaign> {
    return new Promise((resolve, reject) => {
      try {
        if (!campaignData.name || !campaignData.subject || !campaignData.template || campaignData.segments.length === 0) {
          throw new Error('Campos requeridos faltantes');
        }

        const template = this.templates.find(t => t.id === campaignData.template);
        if (!template) {
          throw new Error('Plantilla no encontrada');
        }

        const newCampaign: Campaign = {
          id: `c${Date.now()}`,
          name: campaignData.name,
          subject: campaignData.subject,
          preheader: campaignData.preheader,
          content: template.content,
          segments: campaignData.segments,
          scheduledDate: campaignData.scheduledDate,
          status: campaignData.scheduledDate ? 'scheduled' : 'draft',
          stats: {
            openRate: 0,
            clickRate: 0,
            conversionRate: 0,
            bounceRate: 0
          },
          template: template.id,
          abTesting: campaignData.abTesting,
          personalizedFields: campaignData.personalizedFields
        };

        this.campaigns.push(newCampaign);
        setTimeout(() => resolve(newCampaign), 500);
      } catch (error) {
        setTimeout(() => reject(error), 500);
      }
    });
  }

  async getTemplates(): Promise<Template[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.templates), 300);
    });
  }

  async getAutomationRules(): Promise<AutomationRule[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.automationRules), 300);
    });
  }

  async getStats(dateRange: { start: Date; end: Date }) {
    return new Promise(resolve => {
      const days = [];
      let currentDate = dateRange.start;
      
      while (currentDate <= dateRange.end) {
        days.push({
          name: format(currentDate, 'EEE'),
          openRate: 50 + Math.random() * 30,
          clickRate: 20 + Math.random() * 25
        });
        currentDate = addDays(currentDate, 1);
      }
      
      setTimeout(() => resolve(days), 400);
    });
  }
}

export const emailService = new MockEmailService();