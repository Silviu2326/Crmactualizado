import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Edit, Trash, X } from 'lucide-react';
import TablaClientes from './TablaClientes';
import TablaClienteEnPlanServicio from './TablaClienteEnPlanServicio';
import type { PlanPago } from '../types/servicios';

interface Props {
  planes: PlanPago[]; // Esperando un array de PlanPago
  isDarkMode: boolean;
}

// Datos de ejemplo para clientes
const clientesEjemplo = {
  'plan1': [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '123-456-789', fechaInicio: '2024-01-15', estado: 'Activo' },
    { id: 2, nombre: 'María García', email: 'maria@email.com', telefono: '987-654-321', fechaInicio: '2024-02-01', estado: 'Activo' },
  ],
  'plan2': [
    { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', telefono: '555-555-555', fechaInicio: '2024-01-20', estado: 'Inactivo' },
    { id: 4, nombre: 'Ana Martínez', email: 'ana@email.com', telefono: '666-666-666', fechaInicio: '2024-02-10', estado: 'Activo' },
  ],
};

const TablaPlanesServicio = ({ planes, isDarkMode }: Props) => {
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [clientesExpandidos, setClientesExpandidos] = useState<string | null>(null);
  const [planEditando, setPlanEditando] = useState<PlanPago | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showClientesPopup, setShowClientesPopup] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

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

  const toggleExpand = (planId: string) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleEditClick = (plan: PlanPago) => {
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

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
              Nombre
            </th>
            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
              Descripción
            </th>
            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
              Precio
            </th>
            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
              Periodo
            </th>
            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className={`${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
          {planes.map((plan) => (
            <React.Fragment key={plan._id}>
              <tr className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} cursor-pointer`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {plan.nombre}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {plan.descripcion}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {plan.precio}€
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {plan.periodo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => toggleExpand(plan._id)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                  >
                    {expandedPlanId === plan._id ? <ChevronUp className="inline-block w-5 h-5" /> : <ChevronDown className="inline-block w-5 h-5" />}
                    {' '}Ver Clientes
                  </button>
                  <button
                    onClick={() => handleEditClick(plan)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                  >
                    <Edit className="inline-block w-5 h-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-4"
                  >
                    <Trash className="inline-block w-5 h-5" />
                  </button>
                </td>
              </tr>
              
              {/* Tabla expandible de clientes */}
              {expandedPlanId === plan._id && (
                <tr>
                  <td colSpan={5} className={`px-6 py-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="overflow-x-auto">
                      <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                        <thead className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                          <tr>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                              Nombre
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                              Email
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                              Teléfono
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                              Fecha Inicio
                            </th>
                            <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
                          {clientesEjemplo[plan._id === 'plan1' ? 'plan1' : 'plan2'].map((cliente) => (
                            <tr key={cliente.id}>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                {cliente.nombre}
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                {cliente.email}
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                {cliente.telefono}
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                {formatDate(cliente.fechaInicio)}
                              </td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  cliente.estado === 'Activo'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {cliente.estado}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Modal para editar plan de pago */}
      <AnimatePresence>
        {isModalOpen && planEditando && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-md p-6 relative`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={handleModalClose}
                className="absolute top-3 right-3 text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-white transition-colors duration-150"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mb-4 text-[rgb(23 31 45)] dark:text-gray-100">
                Editar Plan de Pago
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Formulario de edición */}
                <div>
                  <label htmlFor="nombre" className={`block text-sm font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Otros campos del formulario */}
                <div>
                  <label htmlFor="precio" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Precio
                  </label>
                  <input
                    type="number"
                    name="precio"
                    id="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="moneda" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Moneda
                  </label>
                  <input
                    type="text"
                    name="moneda"
                    id="moneda"
                    value={formData.moneda}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="detalles" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Detalles
                  </label>
                  <textarea
                    name="detalles"
                    id="detalles"
                    value={formData.detalles}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-150"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-150"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedPlanId && (
        <TablaClienteEnPlanServicio
          isOpen={showClientesPopup}
          onClose={() => {
            setShowClientesPopup(false);
            setSelectedPlanId(null);
          }}
          planId={selectedPlanId}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default TablaPlanesServicio;
