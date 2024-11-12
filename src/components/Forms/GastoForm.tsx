import React, { useState } from 'react';
import { Calendar, DollarSign, Tag, FileText, Clock, CheckCircle } from 'lucide-react';

interface GastoFormData {
  concepto: string;
  descripcion: string;
  categoria: string;
  importe: number;
  estado: string;
  fecha: string;
  esRecurrente: boolean;
  frecuencia?: string;
  fechaFin?: string;
}

interface GastoFormProps {
  onSubmit: (formData: GastoFormData) => void;
}

const GastoForm: React.FC<GastoFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<GastoFormData>({
    concepto: '',
    descripcion: '',
    categoria: '',
    importe: 0,
    estado: '',
    fecha: '',
    esRecurrente: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GastoFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GastoFormData, string>> = {};

    if (!formData.concepto.trim()) {
      newErrors.concepto = 'El concepto es requerido';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (formData.importe <= 0) {
      newErrors.importe = 'El importe debe ser mayor a 0';
    }

    if (!formData.estado) {
      newErrors.estado = 'El estado es requerido';
    }

    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    if (formData.esRecurrente) {
      if (!formData.frecuencia) {
        newErrors.frecuencia = 'La frecuencia es requerida para gastos recurrentes';
      }
      if (!formData.fechaFin) {
        newErrors.fechaFin = 'La fecha de fin es requerida para gastos recurrentes';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when field is modified
    if (errors[name as keyof GastoFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClasses = (fieldName: keyof GastoFormData) =>
    `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
    ${errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`;

  const labelClasses = 'flex items-center gap-2 text-sm font-medium text-gray-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Concepto y Descripción */}
      <div className="space-y-4">
        <div>
          <label className={labelClasses}>
            <Tag size={16} />
            Concepto
          </label>
          <input
            type="text"
            name="concepto"
            value={formData.concepto}
            onChange={handleChange}
            className={inputClasses('concepto')}
            placeholder="Ej: Material de oficina"
          />
          {errors.concepto && (
            <p className="mt-1 text-sm text-red-500">{errors.concepto}</p>
          )}
        </div>

        <div>
          <label className={labelClasses}>
            <FileText size={16} />
            Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className={inputClasses('descripcion')}
            rows={3}
            placeholder="Detalles adicionales del gasto..."
          />
        </div>
      </div>

      {/* Categoría e Importe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            <Tag size={16} />
            Categoría
          </label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className={inputClasses('categoria')}
          >
            <option value="">Seleccionar categoría</option>
            <option value="suministros">Suministros</option>
            <option value="equipamiento">Equipamiento</option>
            <option value="marketing">Marketing</option>
            <option value="servicios">Servicios</option>
            <option value="personal">Personal</option>
            <option value="otros">Otros</option>
          </select>
          {errors.categoria && (
            <p className="mt-1 text-sm text-red-500">{errors.categoria}</p>
          )}
        </div>

        <div>
          <label className={labelClasses}>
            <DollarSign size={16} />
            Importe
          </label>
          <div className="relative">
            <input
              type="number"
              name="importe"
              value={formData.importe}
              onChange={handleChange}
              className={inputClasses('importe')}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              €
            </span>
          </div>
          {errors.importe && (
            <p className="mt-1 text-sm text-red-500">{errors.importe}</p>
          )}
        </div>
      </div>

      {/* Estado y Fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            <CheckCircle size={16} />
            Estado
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className={inputClasses('estado')}
          >
            <option value="">Seleccionar estado</option>
            <option value="pendiente">Pendiente</option>
            <option value="pagado">Pagado</option>
            <option value="anulado">Anulado</option>
          </select>
          {errors.estado && (
            <p className="mt-1 text-sm text-red-500">{errors.estado}</p>
          )}
        </div>

        <div>
          <label className={labelClasses}>
            <Calendar size={16} />
            Fecha
          </label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className={inputClasses('fecha')}
          />
          {errors.fecha && (
            <p className="mt-1 text-sm text-red-500">{errors.fecha}</p>
          )}
        </div>
      </div>

      {/* Gasto Recurrente */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="esRecurrente"
            name="esRecurrente"
            checked={formData.esRecurrente}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="esRecurrente" className="flex items-center gap-2 text-sm text-gray-700">
            <Clock size={16} />
            Gasto Recurrente
          </label>
        </div>

        {formData.esRecurrente && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 border-l-2 border-blue-200">
            <div>
              <label className={labelClasses}>
                Frecuencia
              </label>
              <select
                name="frecuencia"
                value={formData.frecuencia}
                onChange={handleChange}
                className={inputClasses('frecuencia')}
              >
                <option value="">Seleccionar frecuencia</option>
                <option value="semanal">Semanal</option>
                <option value="mensual">Mensual</option>
                <option value="trimestral">Trimestral</option>
                <option value="anual">Anual</option>
              </select>
              {errors.frecuencia && (
                <p className="mt-1 text-sm text-red-500">{errors.frecuencia}</p>
              )}
            </div>

            <div>
              <label className={labelClasses}>
                Fecha de Fin
              </label>
              <input
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                className={inputClasses('fechaFin')}
              />
              {errors.fechaFin && (
                <p className="mt-1 text-sm text-red-500">{errors.fechaFin}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Botón de Submit */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg 
                   hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <DollarSign size={20} />
          Registrar Gasto
        </button>
      </div>
    </form>
  );
};

export default GastoForm;