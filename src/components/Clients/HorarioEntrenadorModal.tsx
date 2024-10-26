import React, { useState } from 'react';
import { X, Clock, Save } from 'lucide-react';

interface HorarioEntrenadorModal {
  onClose: () => void;
}

const diasSemana = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

export default function HorarioEntrenadorModal({ onClose }: HorarioEntrenadorModal) {
  const [horarios, setHorarios] = useState<Record<string, { inicio: string; fin: string }>>({
    Lunes: { inicio: '09:00', fin: '18:00' },
    Martes: { inicio: '09:00', fin: '18:00' },
    Miércoles: { inicio: '09:00', fin: '18:00' },
    Jueves: { inicio: '09:00', fin: '18:00' },
    Viernes: { inicio: '09:00', fin: '18:00' },
    Sábado: { inicio: '10:00', fin: '14:00' },
    Domingo: { inicio: '', fin: '' }
  });

  const handleSave = () => {
    console.log('Horarios guardados:', horarios);
    onClose();
  };

  const handleHorarioChange = (dia: string, tipo: 'inicio' | 'fin', valor: string) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [tipo]: valor
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-xl">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Horario del Entrenador</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid gap-4">
            {diasSemana.map((dia) => (
              <div key={dia} className="grid grid-cols-[1fr,2fr,2fr] gap-4 items-center p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
                <div className="font-medium text-gray-900">{dia}</div>
                <div className="relative">
                  <input
                    type="time"
                    value={horarios[dia].inicio}
                    onChange={(e) => handleHorarioChange(dia, 'inicio', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="relative">
                  <input
                    type="time"
                    value={horarios[dia].fin}
                    onChange={(e) => handleHorarioChange(dia, 'fin', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="w-4 h-4" />
              Guardar Horario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}