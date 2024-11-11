import React, { useState } from 'react';
import { PlusCircle, Upload, Trash2, Receipt, Building2, FileText, Users } from 'lucide-react';

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

  const removeServicio = (index: number) => {
    if (formData.servicios.length > 1) {
      setFormData(prev => ({
        ...prev,
        servicios: prev.servicios.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Secciones con iconos y diseño mejorado */}
      <div className="space-y-8">
        {/* Sección 1: Información Básica */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Receipt className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Número de Factura
              </label>
              <input
                type="text"
                name="numeroFactura"
                value={formData.numeroFactura}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Fecha
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Método de Pago
              </label>
              <select
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Seleccionar método</option>
                <option value="transferencia">Transferencia Bancaria</option>
                <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sección 2: Servicios */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Servicios</h3>
            </div>
            <button
              type="button"
              onClick={addServicio}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <PlusCircle size={18} />
              Añadir Servicio
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.servicios.map((servicio, index) => (
              <div key={index} className="relative p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Código
                    </label>
                    <input
                      type="text"
                      value={servicio.codigo}
                      onChange={(e) => handleServicioChange(index, 'codigo', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      IVA (%)
                    </label>
                    <input
                      type="number"
                      value={servicio.iva}
                      onChange={(e) => handleServicioChange(index, 'iva', Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Cantidad
                    </label>
                    <input
                      type="number"
                      value={servicio.cantidad}
                      onChange={(e) => handleServicioChange(index, 'cantidad', Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Precio Unitario
                    </label>
                    <input
                      type="number"
                      value={servicio.precioUnitario}
                      onChange={(e) => handleServicioChange(index, 'precioUnitario', Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Descuento (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={servicio.descuento}
                        onChange={(e) => handleServicioChange(index, 'descuento', Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        min="0"
                        max="100"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeServicio(index)}
                          className="absolute -right-4 top-1/2 -translate-y-1/2 p-1 text-red-500 hover:text-red-700"
                          title="Eliminar servicio"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección 3: Datos de la Empresa */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Datos de la Empresa</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                name="nombreEmpresa"
                value={formData.nombreEmpresa}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                NIF de la Empresa
              </label>
              <input
                type="text"
                name="nifEmpresa"
                value={formData.nifEmpresa}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email de la Empresa
              </label>
              <input
                type="email"
                name="emailEmpresa"
                value={formData.emailEmpresa}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {/* Sección 4: Información Adicional */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Información Adicional</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Factura
              </label>
              <select
                name="tipoFactura"
                value={formData.tipoFactura}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="simple">Factura Simple</option>
                <option value="completa">Factura Completa</option>
                <option value="proforma">Factura Proforma</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cliente
              </label>
              <select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="">Seleccionar cliente</option>
                <option value="1">Cliente 1</option>
                <option value="2">Cliente 2</option>
                <option value="3">Cliente 3</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Comentario
              </label>
              <textarea
                name="comentario"
                value={formData.comentario}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Añade cualquier nota o comentario relevante..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documentos Adicionales
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                <div className="space-y-2 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Subir archivo</span>
                      <input type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">o arrastrar y soltar</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG hasta 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de Envío */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Crear Factura
        </button>
      </div>
    </form>
  );
};

export default FacturaForm;