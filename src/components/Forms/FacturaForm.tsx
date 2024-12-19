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

interface TokenPayload {
  id: string;
  rol: string;
  iat: number;
  exp: number;
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
    const fetchLastInvoiceNumber = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/invoice/last-number', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener el último número de factura');
        }

        const data = await response.json();
        const lastNumber = data.lastNumber || '0000';
        const currentYear = new Date().getFullYear().toString();
        const numberPart = lastNumber.slice(-4);
        const yearPart = lastNumber.slice(0, 4);
        
        let nextNumber;
        if (yearPart === currentYear) {
          nextNumber = (parseInt(numberPart) + 1).toString().padStart(4, '0');
        } else {
          nextNumber = '0001';
        }

        setFormData(prev => ({
          ...prev,
          numeroFactura: nextNumber,
        }));
      } catch (error) {
        console.error('Error:', error);
        // Si hay un error, usar el número por defecto
        setFormData(prev => ({
          ...prev,
          numeroFactura: '0001',
        }));
      }
    };

    fetchLastInvoiceNumber();
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Campo modificado: ${name}, Nuevo valor: ${value}`);
    
    if (name === 'numeroFactura' || name === 'fecha') {
      // Asegurarse de que solo se ingresen números y máximo 4 dígitos
      const numeroLimpio = value.replace(/\D/g, '').slice(0, 4);
      console.log('Número de factura procesado:', numeroLimpio);
      
      setFormData(prevData => ({
        ...prevData,
        [name]: numeroLimpio
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
    
    console.log('Nuevo estado del formulario:', formData);
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
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      if (!token) {
        throw new Error('No se encontró el token');
      }

      // Decodificar el token para obtener el trainerId
      const decodedToken = jwt_decode<TokenPayload>(token);
      const trainerId = decodedToken.id;
      console.log('TrainerId decodificado del token:', trainerId);
      
      console.log('Form Data antes de procesar:', formData);

      // Combinar el año y el número de factura
      const numeroFacturaCompleto = `${formData.fecha}${formData.numeroFactura}`;
      console.log('Número de factura generado:', numeroFacturaCompleto);
      
      const formDataToSend = {
        ...formData,
        numeroFactura: numeroFacturaCompleto,
        trainerId: trainerId,
        servicios: JSON.stringify(formData.servicios)
      };

      console.log('Datos que se enviarán al servidor:', formDataToSend);
      console.log('URL de la API:', 'https://fitoffice2-f70b52bef77e.herokuapp.com/api/invoice');

      const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formDataToSend)
      });

      console.log('Respuesta del servidor - status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        throw new Error('Error al crear la factura');
      }

      const data = await response.json();
      console.log('Respuesta exitosa del servidor:', data);
      alert('Factura creada exitosamente');
      
      // Mostrar el estado final del formulario antes de reiniciarlo
      console.log('Estado del formulario antes de reiniciar:', formData);
      
      setFormData({
        numeroFactura: '0001',
        fecha: new Date().getFullYear().toString(),
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
    } catch (error) {
      console.error('Error al crear la factura:', error);
      alert('Error al crear la factura');
    }
  };

  // Función para generar una factura de prueba
  const generarFacturaPrueba = () => {
    // Obtener la fecha actual en formato ISO
    const fechaActual = new Date().getFullYear().toString();

    // Seleccionar un cliente aleatorio
    const clienteSeleccionado = clientes.length > 0 ? clientes[0]._id : '';

    // Datos de prueba
    const datosPrueba: FormData = {
      numeroFactura: '0001',  // Solo el número, se combinará con el año al enviar
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
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800">Información Básica</h2>
        </div>
        
        <div className="flex flex-wrap gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Número de Factura
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                pattern="[0-9]{4}"
                maxLength={4}
                placeholder="YYYY"
                className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <span className="text-xl font-medium text-gray-700">-</span>
              <input
                type="text"
                name="numeroFactura"
                value={formData.numeroFactura}
                onChange={handleChange}
                pattern="[0-9]{4}"
                maxLength={4}
                placeholder="0000"
                className="w-24 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Método de Pago
            </label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              className="w-40 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Seleccionar</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Moneda
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-32 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sección 2: Servicios */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Servicios</h2>
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
            <div key={index} className="relative p-5 bg-gray-50 rounded-lg border border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Código
                  </label>
                  <input
                    type="text"
                    value={servicio.codigo}
                    onChange={(e) => handleServicioChange(index, 'codigo', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Datos de la Empresa</h2>
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
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>
      </div>

      {/* Sección 4: Información Adicional */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Información Adicional</h2>
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
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
