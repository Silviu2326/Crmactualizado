import React, { useState, useEffect } from 'react'; 
import { PlusCircle, Upload, Trash2, Receipt, Building2, FileText, Users } from 'lucide-react';
import jwt_decode from 'jwt-decode';

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
  currency: string;
}

interface FacturaFormProps {
  onSubmit: (data: any) => void;
}

// Definir la interfaz Cliente con las propiedades correctas
interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  // otros campos si los necesitas
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
    currency: 'USD',
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No se encontró el token de autenticación.');
          return;
        }

        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/clientes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('Clientes recibidos:', data);
        setClientes(data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClientes();
  }, []);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      alert('No se encontró el token de autenticación.');
      return;
    }

    // Decodificar el token para obtener el trainerId
    interface TokenPayload {
      id: string;
      // otros campos que puedas tener en el token
    }

    const decodedToken = jwt_decode<TokenPayload>(token);
    const trainerId = decodedToken.id; // Ajusta según el campo en tu token

    if (!trainerId) {
      alert('No se pudo obtener el ID del entrenador del token.');
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('numeroFactura', formData.numeroFactura);
      formDataToSend.append('fecha', formData.fecha);
      formDataToSend.append('metodoPago', formData.metodoPago);
      formDataToSend.append('tipoFactura', formData.tipoFactura);
      formDataToSend.append('nombreEmpresa', formData.nombreEmpresa);
      formDataToSend.append('nifEmpresa', formData.nifEmpresa);
      formDataToSend.append('emailEmpresa', formData.emailEmpresa);
      formDataToSend.append('comentario', formData.comentario);
      formDataToSend.append('clienteId', formData.clienteId);
      formDataToSend.append('currency', formData.currency);
      formDataToSend.append('trainerId', trainerId);

      // Agregar servicios como JSON
      formDataToSend.append('servicios', JSON.stringify(formData.servicios));

      // Agregar archivos
      selectedFiles.forEach((file) => {
        formDataToSend.append('documentosAdicionales', file);
      });

      const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/invoice', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error al crear la factura:', data.error);
        alert('Error al crear la factura: ' + data.message);
      } else {
        console.log('Factura creada:', data);
        alert('Factura creada exitosamente');
        setFormData({
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
          currency: 'USD',
        });
        setSelectedFiles([]);
        onSubmit(data);
      }
    } catch (error) {
      console.error('Error al crear la factura:', error);
      alert('Error al crear la factura');
    }
  };

  // Función para generar una factura de prueba
  const generarFacturaPrueba = () => {
    // Obtener la fecha actual en formato ISO
    const fechaActual = new Date().toISOString().split('T')[0];

    // Seleccionar un cliente aleatorio
    const clienteSeleccionado = clientes.length > 0 ? clientes[0]._id : '';

    // Datos de prueba
    const datosPrueba: FormData = {
      numeroFactura: `INV-${Date.now()}`,
      fecha: fechaActual,
      metodoPago: 'tarjeta',
      servicios: [
        { codigo: 'SVC001', iva: 21, cantidad: 2, precioUnitario: 150.00, descuento: 10 },
        { codigo: 'SVC002', iva: 21, cantidad: 1, precioUnitario: 300.00, descuento: 0 }
      ],
      tipoFactura: 'completa',
      nombreEmpresa: 'Empresa de Prueba S.A.',
      nifEmpresa: 'A12345678',
      emailEmpresa: 'contacto@empresa.com',
      comentario: 'Esta es una factura de prueba.',
      clienteId: clienteSeleccionado,
      currency: 'USD',
    };

    setFormData(datosPrueba);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Botón para generar factura de prueba */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={generarFacturaPrueba}
          className="mb-4 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          Generar Factura de Prueba
        </button>
      </div>

      {/* Sección 1: Información Básica */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <Receipt className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Campos de información básica */}
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
          {/* Campo Moneda */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Moneda
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="MXN">MXN</option>
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
          {/* Tipo de Factura */}
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

          {/* Cliente */}
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
              {clientes.map(cliente => (
                <option key={cliente._id} value={cliente._id}>{cliente.nombre}</option>
              ))}
            </select>
          </div>

          {/* Comentario */}
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

          {/* Documentos Adicionales */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documentos Adicionales
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Subir archivo</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">o arrastrar y soltar</p>
                </div>
                <p className="text-xs text-gray-500">PDF, PNG, JPG hasta 10MB</p>
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
