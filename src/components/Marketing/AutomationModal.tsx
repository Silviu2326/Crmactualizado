import React, { useState } from 'react';
import { X, Zap, Mail, Calendar, Activity, Gift, UserX, BookOpen, ChevronRight, Clock, Users, Send, TestTube } from 'lucide-react';
import { AutomationRule } from '../types/campaign';
import { toast } from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onSubmit: (automationData: Partial<AutomationRule>) => void;
}

const AUTOMATION_TYPES = [
  {
    id: 'welcome',
    name: 'Bienvenida a Nuevos Clientes',
    description: 'Correo de bienvenida automático al registrarse',
    icon: Mail,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    id: 'session_reminder',
    name: 'Recordatorios de Sesión',
    description: 'Recordatorios antes de una sesión de entrenamiento',
    icon: Calendar,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    id: 'post_training',
    name: 'Seguimiento Post-Entrenamiento',
    description: 'Encuestas o mensajes de recuperación después de una sesión',
    icon: Activity,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50'
  },
  {
    id: 'birthday',
    name: 'Cumpleaños y Aniversarios',
    description: 'Correo de felicitación en fechas especiales',
    icon: Gift,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  {
    id: 'inactive',
    name: 'Recuperación de Clientes Inactivos',
    description: 'Incentivo para reactivar a clientes inactivos',
    icon: UserX,
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    id: 'tips',
    name: 'Consejos Periódicos',
    description: 'Envío de contenido de valor en intervalos regulares',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  }
];

const TRIGGER_TYPES = [
  { id: 'subscription', name: 'Evento de Suscripción' },
  { id: 'date', name: 'Evento de Fecha' },
  { id: 'inactivity', name: 'Inactividad' },
  { id: 'interaction', name: 'Evento de Interacción' }
];

export function AutomationModal({ onClose, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    triggerType: '',
    segment: '',
    template: '',
    frequency: 'once',
    scheduledTime: '',
    daysOfWeek: [] as string[],
    inactivityDays: 30,
    conditions: {} as Record<string, any>
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !formData.name || !formData.triggerType) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const automationData: Partial<AutomationRule> = {
      name: formData.name,
      trigger: {
        type: formData.triggerType as any,
        conditions: formData.conditions
      },
      action: {
        type: 'send_email',
        templateId: formData.template,
        delay: formData.frequency === 'once' ? 0 : undefined
      },
      isActive: true
    };

    try {
      await onSubmit(automationData);
      toast.success('Automatización creada exitosamente');
      onClose();
    } catch (error) {
      toast.error('Error al crear la automatización');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="h-6 w-6 text-amber-600" />
              Nueva Automatización
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
                <div key={s} className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      step > s ? 'bg-amber-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Selecciona el tipo de automatización
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {AUTOMATION_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(type.id)}
                          className={`flex items-start p-4 rounded-xl transition-all duration-300 ${
                            selectedType === type.id
                              ? 'ring-2 ring-amber-500'
                              : 'hover:bg-gray-50'
                          } ${type.bgColor}`}
                        >
                          <Icon className={`h-6 w-6 ${type.color} mt-1`} />
                          <div className="ml-4 text-left">
                            <h4 className="font-medium text-gray-900">{type.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Automatización
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Ej: Bienvenida Nuevos Miembros"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Disparador
                  </label>
                  <select
                    value={formData.triggerType}
                    onChange={(e) => setFormData({ ...formData, triggerType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Selecciona un disparador</option>
                    {TRIGGER_TYPES.map((trigger) => (
                      <option key={trigger.id} value={trigger.id}>
                        {trigger.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.triggerType === 'inactivity' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Días de Inactividad
                    </label>
                    <input
                      type="number"
                      value={formData.inactivityDays}
                      onChange={(e) => setFormData({ ...formData, inactivityDays: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      min="1"
                      max="365"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frecuencia de Envío
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="once"
                        checked={formData.frequency === 'once'}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Una vez</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="recurring"
                        checked={formData.frequency === 'recurring'}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Recurrente</span>
                    </label>
                  </div>
                </div>

                {formData.frequency === 'recurring' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Envío
                      </label>
                      <input
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Días de Envío
                      </label>
                      <div className="flex gap-2">
                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const days = formData.daysOfWeek.includes(day)
                                ? formData.daysOfWeek.filter(d => d !== day)
                                : [...formData.daysOfWeek, day];
                              setFormData({ ...formData, daysOfWeek: days });
                            }}
                            className={`w-8 h-8 rounded-full ${
                              formData.daysOfWeek.includes(day)
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-amber-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Resumen de la Automatización
                  </h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Tipo:</dt>
                      <dd className="text-sm font-medium">
                        {AUTOMATION_TYPES.find(t => t.id === selectedType)?.name}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Nombre:</dt>
                      <dd className="text-sm font-medium">{formData.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Disparador:</dt>
                      <dd className="text-sm font-medium">
                        {TRIGGER_TYPES.find(t => t.id === formData.triggerType)?.name}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">Frecuencia:</dt>
                      <dd className="text-sm font-medium">
                        {formData.frequency === 'once' ? 'Una vez' : 'Recurrente'}
                      </dd>
                    </div>
                    {formData.frequency === 'recurring' && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Días:</dt>
                        <dd className="text-sm font-medium">
                          {formData.daysOfWeek.join(', ')}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                    onClick={() => {
                      // Lógica para enviar prueba
                      toast.success('Email de prueba enviado');
                    }}
                  >
                    <TestTube className="h-4 w-4" />
                    Enviar Prueba
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    Activar Automatización
                  </button>
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
              {step < 3 && (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="ml-auto px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}