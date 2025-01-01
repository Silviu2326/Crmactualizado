import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Edit, Trash, X } from 'lucide-react';
import TablaClientes from './TablaClientes';
import TablaClienteEnPlanServicio from './TablaClienteEnPlanServicio';
import AsociarPlanClientePopup from './AsociarPlanClientePopup';
import type { PlanPago } from '../types/servicios';

interface Props {
  planes: any[];
  isDarkMode: boolean;
  servicioId: string;
}

const TablaPlanesServicio: React.FC<Props> = ({ planes, isDarkMode, servicioId }) => {
  console.log('TablaPlanesServicio - Planes recibidos:', planes);
  console.log('TablaPlanesServicio - ID del servicio:', servicioId);
  console.log('TablaPlanesServicio - Tipo de planes:', typeof planes);
  console.log('TablaPlanesServicio - ¿Es array?:', Array.isArray(planes));

  // Si planes es un string (ID), mostrar mensaje apropiado
  if (typeof planes === 'string') {
    console.log('TablaPlanesServicio - planes es un ID:', planes);
    return (
      <div className="mt-4">
        <p className="text-center py-4">
          Cargando detalles del plan...
        </p>
      </div>
    );
  }

  // Asegurarse de que planes sea un array
  const planesArray = Array.isArray(planes) ? planes : [];
  console.log('TablaPlanesServicio - planesArray:', planesArray);

  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [clientesExpandidos, setClientesExpandidos] = useState<string | null>(null);
  const [planEditando, setPlanEditando] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showClientesPopup, setShowClientesPopup] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showAsociarPopup, setShowAsociarPopup] = useState(false);
  const [selectedPlanForAsociar, setSelectedPlanForAsociar] = useState<any>(null);
  const [clientesDetalles, setClientesDetalles] = useState<{ [key: string]: any }>({});
  const [loadingClientes, setLoadingClientes] = useState<{ [key: string]: boolean }>({});
  const [clientesError, setClientesError] = useState<{ [key: string]: string | null }>({});

  const [formData, setFormData] = useState<{
    nombre: string;
    precio: number;
    moneda: string;
    detalles: string;
  }>({
    nombre: '',
    precio: 0,
    moneda: '',
    detalles: '',
  });

  const fetchClienteDetalles = async (clienteId: string, planId: string) => {
    console.log(`TablaPlanesServicio - Iniciando fetchClienteDetalles para cliente ${clienteId} en plan ${planId}`);
    
    setLoadingClientes(prev => ({ ...prev, [clienteId]: true }));
    setClientesError(prev => ({ ...prev, [clienteId]: null }));

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log(`TablaPlanesServicio - Realizando petición para cliente ${clienteId}`);
      const response = await fetch(`http://localhost:3000/api/clientes/${clienteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.error(`TablaPlanesServicio - Error en la respuesta del cliente ${clienteId}:`, response.status);
        throw new Error('Error al obtener detalles del cliente');
      }

      const data = await response.json();
      console.log(`TablaPlanesServicio - Detalles recibidos para cliente ${clienteId}:`, data);
      
      setClientesDetalles(prev => ({
        ...prev,
        [clienteId]: data
      }));
    } catch (err) {
      console.error(`TablaPlanesServicio - Error al obtener detalles del cliente ${clienteId}:`, err);
      setClientesError(prev => ({
        ...prev,
        [clienteId]: err instanceof Error ? err.message : 'Error desconocido'
      }));
    } finally {
      setLoadingClientes(prev => ({ ...prev, [clienteId]: false }));
    }
  };

  const toggleExpand = async (planId: string) => {
    console.log('TablaPlanesServicio - Toggle expand para plan:', planId);
    if (expandedPlanId === planId) {
      setExpandedPlanId(null);
    } else {
      setExpandedPlanId(planId);
      const plan = planesArray.find(p => p._id === planId);
      if (plan && plan.clientes && plan.clientes.length > 0) {
        console.log(`TablaPlanesServicio - Cargando detalles para ${plan.clientes.length} clientes del plan ${planId}`);
        plan.clientes.forEach(clienteId => {
          if (!clientesDetalles[clienteId]) {
            fetchClienteDetalles(clienteId, planId);
          }
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleEditClick = (plan: any) => {
    setPlanEditando(plan);
    setFormData({
      nombre: plan.nombre,
      precio: plan.precio,
      moneda: plan.moneda,
      detalles: plan.detalles || '',
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPlanEditando(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' ? Number(value) : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica para actualizar el plan de pago
    console.log('Actualizando plan de pago:', planEditando?._id, formData);
    setIsModalOpen(false);
    setPlanEditando(null);
    // Actualizar el estado local o volver a obtener los datos
  };

  const handleAsociarPlan = (planId: string) => {
    setSelectedPlanForAsociar(planId);
    setShowAsociarPopup(true);
  };

  return (
    <div>
      <div className="mt-4 p-6 rounded-xl shadow-lg bg-opacity-60 backdrop-blur-md">
        <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Planes de Pago
        </h3>
        <div className="overflow-hidden rounded-xl border border-opacity-50">
          <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-600 bg-gray-800/95' : 'divide-gray-200 bg-white'}`}>
            <thead className={isDarkMode ? 'bg-gray-900/95' : 'bg-gray-50'}>
              <tr>
                <th className={`px-8 py-5 text-left text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} tracking-wider uppercase`}>
                  Nombre
                </th>
                <th className={`px-8 py-5 text-left text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} tracking-wider uppercase`}>
                  Precio
                </th>
                <th className={`px-8 py-5 text-left text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} tracking-wider uppercase`}>
                  Moneda
                </th>
                <th className={`px-8 py-5 text-left text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} tracking-wider uppercase`}>
                  Frecuencia
                </th>
                <th className={`px-8 py-5 text-left text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} tracking-wider uppercase`}>
                  Detalles
                </th>
                <th className={`px-8 py-5 text-left text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} tracking-wider uppercase`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {planesArray && planesArray.length > 0 ? (
                planesArray.map((plan, index) => (
                  <React.Fragment key={plan._id || index}>
                    <tr className={`${
                      isDarkMode 
                        ? 'hover:bg-gray-700/80 bg-gray-800/95' 
                        : 'hover:bg-blue-50/90 bg-white'
                    } transition-all duration-200 ease-in-out`}>
                      <td className={`px-8 py-5 text-sm font-medium whitespace-nowrap ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {plan.nombre}
                      </td>
                      <td className={`px-8 py-5 text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        <span className="font-semibold">{plan.precio}</span>
                      </td>
                      <td className={`px-8 py-5 text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {plan.moneda}
                      </td>
                      <td className={`px-8 py-5 text-sm whitespace-nowrap ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          isDarkMode 
                            ? 'bg-blue-900/80 text-blue-200' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {plan.frecuencia}
                        </span>
                      </td>
                      <td className={`px-8 py-5 text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {plan.detalles}
                      </td>
                      <td className="px-8 py-5 text-sm whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => toggleExpand(plan._id || index)}
                            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                              isDarkMode
                                ? 'bg-blue-900/90 hover:bg-blue-800 text-blue-100 hover:shadow-md hover:shadow-blue-900/20'
                                : 'bg-blue-100 hover:bg-blue-200 text-blue-900 hover:shadow-md hover:shadow-blue-200/50'
                            }`}
                          >
                            {expandedPlanId === (plan._id || index) ? (
                              <ChevronUp className="w-4 h-4 mr-2" />
                            ) : (
                              <ChevronDown className="w-4 h-4 mr-2" />
                            )}
                            Ver Clientes
                          </button>
                          <button
                            onClick={() => handleEditClick(plan)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              isDarkMode
                                ? 'hover:bg-gray-700/80 text-blue-400 hover:text-blue-300 hover:shadow-md hover:shadow-gray-900/20'
                                : 'hover:bg-gray-100 text-blue-600 hover:text-blue-500 hover:shadow-md hover:shadow-gray-200/50'
                            }`}
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(plan._id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              isDarkMode
                                ? 'hover:bg-gray-700/80 text-red-400 hover:text-red-300 hover:shadow-md hover:shadow-gray-900/20'
                                : 'hover:bg-gray-100 text-red-600 hover:text-red-500 hover:shadow-md hover:shadow-gray-200/50'
                            }`}
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAsociarPlan(plan._id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              isDarkMode
                                ? 'bg-green-900/90 hover:bg-green-800 text-green-100 hover:shadow-md hover:shadow-green-900/20'
                                : 'bg-green-100 hover:bg-green-200 text-green-900 hover:shadow-md hover:shadow-green-200/50'
                            }`}
                          >
                            Asociar Cliente
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Tabla expandible de clientes */}
                    {expandedPlanId === (plan._id || index) && (
                      <tr>
                        <td colSpan={6}>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`p-6 ${isDarkMode ? 'bg-gray-900/95' : 'bg-gray-50/95'}`}
                          >
                            <div className="overflow-hidden rounded-lg border border-opacity-50">
                              <table className={`min-w-full divide-y ${
                                isDarkMode ? 'divide-gray-700 bg-gray-800/95' : 'divide-gray-200 bg-white'
                              }`}>
                                <thead className={isDarkMode ? 'bg-gray-900/95' : 'bg-gray-100'}>
                                  <tr>
                                    <th className={`px-6 py-4 text-left text-xs font-bold ${
                                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    } uppercase tracking-wider`}>
                                      Cliente
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold ${
                                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    } uppercase tracking-wider`}>
                                      Email
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold ${
                                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    } uppercase tracking-wider`}>
                                      Teléfono
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold ${
                                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    } uppercase tracking-wider`}>
                                      Fecha Inicio
                                    </th>
                                    <th className={`px-6 py-4 text-left text-xs font-bold ${
                                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    } uppercase tracking-wider`}>
                                      Estado
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className={`divide-y ${
                                  isDarkMode ? 'divide-gray-700' : 'divide-gray-200'
                                }`}>
                                  {plan.clientes && plan.clientes.length > 0 ? (
                                    plan.clientes.map((clienteId) => {
                                      const clienteDetalle = clientesDetalles[clienteId];
                                      const isLoading = loadingClientes[clienteId];
                                      const error = clientesError[clienteId];

                                      if (error) {
                                        return (
                                          <tr key={clienteId} className={`${
                                            isDarkMode
                                              ? 'bg-red-900/20'
                                              : 'bg-red-50'
                                          }`}>
                                            <td colSpan={5} className="px-6 py-4 text-sm text-red-500">
                                              Error al cargar cliente: {error}
                                            </td>
                                          </tr>
                                        );
                                      }

                                      if (isLoading) {
                                        return (
                                          <tr key={clienteId} className={`${
                                            isDarkMode
                                              ? 'bg-gray-800/95'
                                              : 'bg-white'
                                          }`}>
                                            <td colSpan={5} className="px-6 py-4">
                                              <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                                                <span className="ml-2">Cargando detalles del cliente...</span>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      }

                                      return (
                                        <tr key={clienteId} className={`${
                                          isDarkMode
                                            ? 'hover:bg-gray-700/80 bg-gray-800/95'
                                            : 'hover:bg-blue-50/90 bg-white'
                                          } transition-all duration-200 ease-in-out`}>
                                          <td className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                          }`}>
                                            {clienteDetalle?.nombre || 'Nombre no disponible'}
                                          </td>
                                          <td className={`px-6 py-4 text-sm whitespace-nowrap ${
                                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                          }`}>
                                            {clienteDetalle?.email || 'Email no disponible'}
                                          </td>
                                          <td className={`px-6 py-4 text-sm whitespace-nowrap ${
                                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                          }`}>
                                            {clienteDetalle?.planningActivo?.nombre || 'Sin plan activo'}
                                          </td>
                                          <td className={`px-6 py-4 text-sm whitespace-nowrap ${
                                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                                          }`}>
                                            {clienteDetalle?.planningActivo?.fechaInicio 
                                              ? formatDate(clienteDetalle.planningActivo.fechaInicio)
                                              : 'N/A'}
                                          </td>
                                          <td className={`px-6 py-4 text-sm whitespace-nowrap`}>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                              ${clienteDetalle?.estado === 'Activo'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'}`}>
                                              {clienteDetalle?.estado || 'Estado desconocido'}
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      <td colSpan={5} className={`px-6 py-4 text-sm text-center ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                      }`}>
                                        No hay clientes disponibles
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-5 text-center text-sm text-gray-500">
                    No hay planes de pago disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && planEditando && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative p-6 rounded-xl shadow-xl ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } max-w-lg w-full mx-4`}
            >
              <button
                onClick={handleModalClose}
                className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode
                    ? 'hover:bg-gray-700/80 text-gray-400 hover:text-gray-300'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Editar Plan de Pago
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Precio
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Moneda
                  </label>
                  <input
                    type="text"
                    name="moneda"
                    value={formData.moneda}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Detalles
                  </label>
                  <textarea
                    name="detalles"
                    value={formData.detalles}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      <AsociarPlanClientePopup
        isOpen={showAsociarPopup}
        onClose={() => setShowAsociarPopup(false)}
        paymentPlanId={selectedPlanForAsociar}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default TablaPlanesServicio;
