import React, { useState } from 'react';

interface ReporteActualFormData {
  nombre: string;
  frecuencia: string;
  campos: {
    clientes: boolean;
    ingresos: boolean;
    gastos: boolean;
    planes: boolean;
  };
}

interface ReporteActualFormProps {
  onSubmit: (formData: ReporteActualFormData) => void;
}

const ReporteActualForm: React.FC<ReporteActualFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ReporteActualFormData>({
    nombre: '',
    frecuencia: '',
    campos: {
      clientes: false,
      ingresos: false,
      gastos: false,
      planes: false
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (campo: keyof typeof formData.campos) => {
    setFormData(prev => ({
      ...prev,
      campos: {
        ...prev.campos,
        [campo]: !prev.campos[campo]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Reporte
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Ej: Reporte de Ventas Actual"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Periodo del Reporte
        </label>
        <select
          name="frecuencia"
          value={formData.frecuencia}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">Seleccionar periodo</option>
          <option value="hoy">Hoy</option>
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mes</option>
          <option value="trimestre">Este Trimestre</option>
          <option value="año">Este Año</option>
          <option value="personalizado">Periodo Personalizado</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          ¿Qué campos quieres usar para el informe?
        </label>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="clientes-actual"
              checked={formData.campos.clientes}
              onChange={() => handleCheckboxChange('clientes')}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="clientes-actual" className="ml-2 text-sm text-gray-700">
              Clientes
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="ingresos-actual"
              checked={formData.campos.ingresos}
              onChange={() => handleCheckboxChange('ingresos')}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="ingresos-actual" className="ml-2 text-sm text-gray-700">
              Ingresos
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="gastos-actual"
              checked={formData.campos.gastos}
              onChange={() => handleCheckboxChange('gastos')}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="gastos-actual" className="ml-2 text-sm text-gray-700">
              Gastos
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="planes-actual"
              checked={formData.campos.planes}
              onChange={() => handleCheckboxChange('planes')}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="planes-actual" className="ml-2 text-sm text-gray-700">
              Planes
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Generar Reporte
        </button>
      </div>
    </form>
  );
};

export default ReporteActualForm;