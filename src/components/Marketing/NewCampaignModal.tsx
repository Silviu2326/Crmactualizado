import React, { useState, useEffect } from 'react';
import { X, Mail, Users, Calendar, Send, Eye, TestTube, Copy, Info, Search, Plus, Clock, ChevronRight } from 'lucide-react';
import { Template } from '../types/campaign';
import { emailService } from '../services/mockEmailService';

interface Props {
  onClose: () => void;
  onSubmit: (campaignData: any) => void;
}

export function NewCampaignModal({ onClose, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [searchSegment, setSearchSegment] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    preheader: '',
    template: '',
    segments: [] as string[],
    scheduledDate: '',
    scheduledTime: '',
    enableABTesting: false,
    abTestSubject: '',
    abTestContent: false,
    abTestContentVariant: '',
    personalizedFields: {
      useClientName: false,
      useLastSession: false,
    },
    recurring: {
      enabled: false,
      frequency: 'weekly',
      days: [] as string[],
    },
  });

  const segments = [
    { 
      id: 'active_members', 
      name: 'Miembros Activos',
      description: 'Clientes que han asistido al menos a 3 sesiones en el último mes',
      count: 156,
      avgAge: 32,
      topLocation: 'Madrid Centro'
    },
    { 
      id: 'inactive_members', 
      name: 'Miembros Inactivos',
      description: 'Clientes sin actividad en los últimos 30 días',
      count: 89,
      avgAge: 29,
      topLocation: 'Barcelona'
    },
    { 
      id: 'new_members', 
      name: 'Nuevos Miembros',
      description: 'Clientes que se unieron en los últimos 15 días',
      count: 45,
      avgAge: 27,
      topLocation: 'Valencia'
    },
    { 
      id: 'fitness_enthusiasts', 
      name: 'Entusiastas del Fitness',
      description: 'Clientes que asisten a más de 4 sesiones por semana',
      count: 78,
      avgAge: 28,
      topLocation: 'Madrid Norte'
    },
    { 
      id: 'weight_loss', 
      name: 'Programa Pérdida de Peso',
      description: 'Clientes inscritos en el programa de pérdida de peso',
      count: 120,
      avgAge: 35,
      topLocation: 'Sevilla'
    },
  ];

  const templates = [
    {
      id: 't1',
      name: 'Recordatorio de Sesión',
      type: 'reminder',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
      suggestedSubject: '¡No olvides tu sesión de mañana! 💪',
      suggestedPreheader: 'Te esperamos para una sesión increíble'
    },
    {
      id: 't2',
      name: 'Consejos de Nutrición',
      type: 'newsletter',
      thumbnail: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300',
      suggestedSubject: 'Tips nutricionales para maximizar tus resultados 🥗',
      suggestedPreheader: 'Descubre cómo mejorar tu alimentación'
    },
    {
      id: 't3',
      name: 'Promoción Especial',
      type: 'promotion',
      thumbnail: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=300',
      suggestedSubject: '¡Oferta especial solo para ti! 🎉',
      suggestedPreheader: 'Aprovecha estos descuentos exclusivos'
    },
    {
      id: 't4',
      name: 'Felicitación de Cumpleaños',
      type: 'celebration',
      thumbnail: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300',
      suggestedSubject: '¡Feliz Cumpleaños! 🎂',
      suggestedPreheader: 'Un regalo especial te espera'
    },
    {
      id: 't5',
      name: 'Motivación Personal',
      type: 'motivation',
      thumbnail: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=300',
      suggestedSubject: '¡Sigue adelante con tus objetivos! 🎯',
      suggestedPreheader: 'Inspiración para alcanzar tus metas'
    }
  ];

  const filteredSegments = segments.filter(segment => 
    segment.name.toLowerCase().includes(searchSegment.toLowerCase()) ||
    segment.description.toLowerCase().includes(searchSegment.toLowerCase())
  );

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      updateFormData('template', templateId);
      updateFormData('subject', template.suggestedSubject);
      updateFormData('preheader', template.suggestedPreheader);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSelectedSegmentsInfo = () => {
    const selected = segments.filter(s => formData.segments.includes(s.id));
    const totalCount = selected.reduce((acc, s) => acc + s.count, 0);
    const avgAge = selected.reduce((acc, s) => acc + s.avgAge * s.count, 0) / totalCount;
    return { totalCount, avgAge: Math.round(avgAge) };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="h-6 w-6 text-indigo-600" />
              Nueva Campaña
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-8">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex items-center ${
                    s < 3 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= s
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        step > s ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Campaña
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ej: Campaña de Verano 2024"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Segmentos
                    </label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchSegment}
                          onChange={(e) => setSearchSegment(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Buscar segmentos..."
                        />
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Nuevo Segmento
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {filteredSegments.map((segment) => (
                      <label
                        key={segment.id}
                        className="flex flex-col p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.segments.includes(segment.id)}
                              onChange={(e) => {
                                const newSegments = e.target.checked
                                  ? [...formData.segments, segment.id]
                                  : formData.segments.filter((s) => s !== segment.id);
                                updateFormData('segments', newSegments);
                              }}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 font-medium">{segment.name}</span>
                          </div>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600"
                            title="Más información"
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 ml-7">{segment.description}</p>
                        <div className="mt-2 ml-7 flex gap-4 text-xs text-gray-500">
                          <span>{segment.count} suscriptores</span>
                          <span>Edad promedio: {segment.avgAge}</span>
                          <span>{segment.topLocation}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plantillas
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                          formData.template === template.id
                            ? 'ring-2 ring-indigo-500'
                            : 'hover:border-indigo-500'
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900">
                            {template.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {template.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asunto
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => updateFormData('subject', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Asunto del email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preheader
                    </label>
                    <input
                      type="text"
                      value={formData.preheader}
                      onChange={(e) => updateFormData('preheader', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Texto previo visible en la bandeja de entrada"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.enableABTesting}
                        onChange={(e) =>
                          updateFormData('enableABTesting', e.target.checked)
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Habilitar prueba A/B
                      </span>
                    </label>
                  </div>

                  {formData.enableABTesting && (
                    <div className="ml-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Asunto alternativo
                        </label>
                        <input
                          type="text"
                          value={formData.abTestSubject}
                          onChange={(e) =>
                            updateFormData('abTestSubject', e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Versión alternativa del asunto"
                        />
                      </div>
                      
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.abTestContent}
                            onChange={(e) =>
                              updateFormData('abTestContent', e.target.checked)
                            }
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Probar variante de contenido
                          </span>
                        </label>
                        {formData.abTestContent && (
                          <textarea
                            value={formData.abTestContentVariant}
                            onChange={(e) =>
                              updateFormData('abTestContentVariant', e.target.value)
                            }
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Versión alternativa del contenido"
                            rows={4}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Resumen de la Campaña
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Detalles Básicos</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Nombre:</dt>
                          <dd className="text-sm font-medium">{formData.name}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Asunto:</dt>
                          <dd className="text-sm font-medium">{formData.subject}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Plantilla:</dt>
                          <dd className="text-sm font-medium">
                            {templates.find(t => t.id === formData.template)?.name}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Audiencia</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Total Suscriptores:</dt>
                          <dd className="text-sm font-medium">{getSelectedSegmentsInfo().totalCount}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Edad Promedio:</dt>
                          <dd className="text-sm font-medium">{getSelectedSegmentsInfo().avgAge} años</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Segmentos:</dt>
                          <dd className="text-sm font-medium">{formData.segments.length}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Programación
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de Envío
                        </label>
                        <input
                          type="date"
                          value={formData.scheduledDate}
                          onChange={(e) =>
                            updateFormData('scheduledDate', e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hora de Envío
                        </label>
                        <input
                          type="time"
                          value={formData.scheduledTime}
                          onChange={(e) =>
                            updateFormData('scheduledTime', e.target.value)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.recurring.enabled}
                          onChange={(e) =>
                            updateFormData('recurring', {
                              ...formData.recurring,
                              enabled: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Configurar envío recurrente
                        </span>
                      </label>

                      {formData.recurring.enabled && (
                        <div className="mt-4 ml-6 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Frecuencia
                            </label>
                            <select
                              value={formData.recurring.frequency}
                              onChange={(e) =>
                                updateFormData('recurring', {
                                  ...formData.recurring,
                                  frequency: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="daily">Diario</option>
                              <option value="weekly">Semanal</option>
                              <option value="monthly">Mensual</option>
                            </select>
                          </div>

                          {formData.recurring.frequency === 'weekly' && (
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                Días de envío
                              </label>
                              <div className="flex gap-2">
                                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() => {
                                      const days = formData.recurring.days.includes(day)
                                        ? formData.recurring.days.filter(d => d !== day)
                                        : [...formData.recurring.days, day];
                                      updateFormData('recurring', {
                                        ...formData.recurring,
                                        days,
                                      });
                                    }}
                                    className={`w-8 h-8 rounded-full ${
                                      formData.recurring.days.includes(day)
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {day}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Campos Personalizados
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.personalizedFields.useClientName}
                        onChange={(e) =>
                          updateFormData('personalizedFields', {
                            ...formData.personalizedFields,
                            useClientName: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Incluir nombre del cliente
                      </span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.personalizedFields.useLastSession}
                        onChange={(e) =>
                          updateFormData('personalizedFields', {
                            ...formData.personalizedFields,
                            useLastSession: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Incluir fecha última sesión
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Anterior
                </button>
              )}
              <div className="ml-auto flex gap-3">
                {step === 3 && (
                  <button
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Vista Previa
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Crear Campaña
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {previewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Vista Previa del Email</h3>
                <button
                  onClick={() => setPreviewMode(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">Para: ejemplo@correo.com</p>
                <p className="text-sm font-medium mt-1">Asunto: {formData.subject}</p>
                <p className="text-sm text-gray-500 mt-1">{formData.preheader}</p>
              </div>
              <div className="border rounded-lg p-4">
                {/* Aquí iría el contenido del email renderizado */}
                <p className="text-gray-600">Contenido de la plantilla seleccionada...</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPreviewMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    // Aquí iría la lógica para enviar un email de prueba
                    setPreviewMode(false);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Enviar Prueba
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}