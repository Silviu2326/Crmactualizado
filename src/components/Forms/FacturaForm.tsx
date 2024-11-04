import React, { useState } from 'react';
import { PlusCircle, Upload } from 'lucide-react';

interface Servicio {
  codigo: string;
  iva: number;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
}

interface FormData {
  numeroFactura: string;
  fecha: string;
  metodoPago: string;
  servicios: Servicio[];
  tipoFactura: string;
  nombreEmpresa: string;
  nifEmpresa: string;
  emailEmpresa: string;
  comentario: string;
  clienteId: string;
}

interface FacturaFormProps {
  onSubmit: (formData: FormData) => void;
}

const FacturaForm: React.FC<FacturaFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    numeroFactura: '',
    fecha: '',
    metodoPago: '',
    servicios: [{ codigo: '', iva: 21, cantidad: 1, precioUnitario: 0, descuento: 0 }],
    tipoFactura: '',
    nombreEmpresa: '',
    nifEmpresa: '',
    emailEmpresa: '',
    comentario: '',
    clienteId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServicioChange = (index: number, field: keyof Servicio, value: string | number) => {
    const newServicios = [...formData.servicios];
    newServicios[index] = {
      ...newServicios[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      servicios: newServicios
    }));
  };

  const addServicio = () => {
    setFormData(prev => ({
      ...prev,
      servicios: [...prev.servicios, { codigo: '', iva: 21, cantidad: 1, precioUnitario: 0, descuento: 0 }]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos Clave de Factura */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de Factura
          </label>
          <input
            type="text"
            name="numeroFactura"
            value={formData.numeroFactura}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Método de Pago
          </label>
          <select
            name="metodoPago"
            value={formData.metodoPago}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccionar método</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="efectivo">Efectivo</option>
          </select>
        </div>
      </div>

      {/* Servicios */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Servicios</h3>
          <button
            type="button"
            onClick={addServicio}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <PlusCircle size={20} />
            Añadir Servicio
          </button>
        </div>
        
        {formData.servicios.map((servicio, index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código
              </label>
              <input
                type="text"
                value={servicio.codigo}
                onChange={(e) => handleServicioChange(index, 'codigo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IVA (%)
              </label>
              <input
                type="number"
                value={servicio.iva}
                onChange={(e) => handleServicioChange(index, 'iva', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                value={servicio.cantidad}
                onChange={(e) => handleServicioChange(index, 'cantidad', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Unitario
              </label>
              <input
                type="number"
                value={servicio.precioUnitario}
                onChange={(e) => handleServicioChange(index, 'precioUnitario', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descuento (%)
              </label>
              <input
                type="number"
                value={servicio.descuento}
                onChange={(e) => handleServicioChange(index, 'descuento', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tipo de Factura */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Factura
        </label>
        <select
          name="tipoFactura"
          value={formData.tipoFactura}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Seleccionar tipo</option>
          <option value="simple">Factura Simple</option>
          <option value="completa">Factura Completa</option>
          <option value="proforma">Factura Proforma</option>
        </select>
      </div>

      {/* Datos de la Empresa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Empresa
          </label>
          <input
            type="text"
            name="nombreEmpresa"
            value={formData.nombreEmpresa}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NIF de la Empresa
          </label>
          <input
            type="text"
            name="nifEmpresa"
            value={formData.nifEmpresa}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email de la Empresa
          </label>
          <input
            type="email"
            name="emailEmpresa"
            value={formData.emailEmpresa}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      {/* Subir Archivo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Documentos Adicionales
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Subir archivo</span>
                <input type="file" className="sr-only" />
              </label>
              <p className="pl-1">o arrastrar y soltar</p>
            </div>
            <p className="text-xs text-gray-500">PDF, PNG, JPG hasta 10MB</p>
          </div>
        </div>
      </div>

      {/* Comentario */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comentario
        </label>
        <textarea
          name="comentario"
          value={formData.comentario}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Cliente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cliente
        </label>
        <select
          name="clienteId"
          value={formData.clienteId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Seleccionar cliente</option>
          <option value="1">Cliente 1</option>
          <option value="2">Cliente 2</option>
          <option value="3">Cliente 3</option>
        </select>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear Factura
        </button>
      </div>
    </form>
  );
};

export default FacturaForm;