import React, { useState } from 'react';
import { Search, Filter, Plus, Copy, Link, X, ChevronDown, ChevronRight, DollarSign } from 'lucide-react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Gasto {
  id: number;
  concepto: string;
  descripcion: string;
  importe: number;
  estado: string;
  fecha: string;
  tipo: 'Directo' | 'Indirecto';
  asociadoA: string;
}

interface Servicio {
  id: number;
  nombre: string;
  planes: Plan[];
}

interface Plan {
  id: number;
  nombre: string;
}

const GastoWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedGastoId, setSelectedGastoId] = useState<number | null>(null);
  const [expandedServices, setExpandedServices] = useState<number[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([
    {
      id: 1,
      concepto: 'Alquiler',
      descripcion: 'Alquiler mensual del local',
      importe: 1500,
      estado: 'Pagado',
      fecha: '2023-08-01',
      tipo: 'Directo',
      asociadoA: 'Servicio General'
    },
    {
      id: 2,
      concepto: 'Suministros',
      descripcion: 'Electricidad y agua',
      importe: 300,
      estado: 'Pendiente',
      fecha: '2023-08-15',
      tipo: 'Indirecto',
      asociadoA: 'N/A'
    },
    {
      id: 3,
      concepto: 'Equipamiento',
      descripcion: 'Nuevas máquinas de ejercicio',
      importe: 5000,
      estado: 'Pagado',
      fecha: '2023-07-20',
      tipo: 'Directo',
      asociadoA: 'Plan Premium'
    },
  ]);
  const { theme } = useTheme();

  const servicios: Servicio[] = [
    {
      id: 1,
      nombre: 'Entrenamiento Personal',
      planes: [
        { id: 1, nombre: 'Plan Básico' },
        { id: 2, nombre: 'Plan Avanzado' },
        { id: 3, nombre: 'Plan Elite' },
      ]
    },
    {
      id: 2,
      nombre: 'Clases Grupales',
      planes: [
        { id: 4, nombre: 'Plan Mensual' },
        { id: 5, nombre: 'Plan Trimestral' },
      ]
    },
    {
      id: 3,
      nombre: 'Nutrición',
      planes: [
        { id: 6, nombre: 'Consulta Individual' },
        { id: 7, nombre: 'Plan Seguimiento' },
      ]
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    console.log('Filtrar gastos');
  };

  const handleAddGasto = () => {
    console.log('Añadir nuevo gasto');
  };

  const handleCopyGasto = (id: number) => {
    console.log(`Copiar gasto con ID: ${id}`);
  };

  const handleAsociarGasto = (id: number) => {
    setSelectedGastoId(id);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedGastoId(null);
    setExpandedServices([]);
  };

  const toggleServiceExpansion = (serviceId: number) => {
    setExpandedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleAddServicio = () => {
    console.log('Añadir nuevo servicio');
  };

  const handleAddPlan = (servicioId: number) => {
    console.log(`Añadir nuevo plan al servicio ${servicioId}`);
  };

  const handleAsociar = (tipo: 'Servicio' | 'Plan', id: number, nombre: string) => {
    setGastos(prevGastos =>
      prevGastos.map(gasto =>
        gasto.id === selectedGastoId
          ? { ...gasto, asociadoA: `${tipo}: ${nombre}` }
          : gasto
      )
    );
    handleClosePopup();
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
          Gestión de Gastos
        </h3>
        <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
          <DollarSign className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
        </div>
      </div>
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar gastos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-4 py-2 pr-10 border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <Button variant="filter" onClick={handleFilter} className="px-4 py-2">
          <Filter className="w-5 h-5 mr-2" />
          Filtrar
        </Button>
        <Button variant="create" onClick={handleAddGasto} className="px-4 py-2">
          <Plus className="w-5 h-5 mr-2" />
          Añadir Gasto
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table
          headers={['Concepto', 'Descripción', 'Importe', 'Estado', 'Fecha', 'Tipo', 'Asociado a', 'Acciones']}
          data={gastos.map(gasto => ({
            Concepto: gasto.concepto,
            Descripción: gasto.descripcion,
            Importe: (
              <span className={gasto.importe > 1000 ? 'text-red-500 font-semibold' : ''}>
                {gasto.importe.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </span>
            ),
            Estado: (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                gasto.estado === 'Pagado' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
              }`}>
                {gasto.estado}
              </span>
            ),
            Fecha: gasto.fecha,
            Tipo: (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                gasto.tipo === 'Directo' ? 'bg-blue-200 text-blue-800' : 'bg-purple-200 text-purple-800'
              }`}>
                {gasto.tipo}
              </span>
            ),
            'Asociado a': gasto.asociadoA,
            Acciones: (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCopyGasto(gasto.id)}
                  className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors duration-200`}
                  title="Copiar gasto"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleAsociarGasto(gasto.id)}
                  className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors duration-200`}
                  title="Asociar gasto"
                >
                  <Link className="w-5 h-5" />
                </button>
              </div>
            ),
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>

      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={handleClosePopup}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-8 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">Asociar Gasto</h3>
                <button onClick={handleClosePopup} className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} transition-colors duration-200`}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold mb-4 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">Servicios</h4>
                  <div className="space-y-4">
                    {servicios.map((servicio) => (
                      <motion.div
                        key={servicio.id}
                        className={`border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-4 transition-all duration-300 hover:shadow-md`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between">
                          <button
                            className="flex items-center w-full text-left"
                            onClick={() => toggleServiceExpansion(servicio.id)}
                          >
                            {expandedServices.includes(servicio.id) ? (
                              <ChevronDown className="w-5 h-5 mr-2" />
                            ) : (
                              <ChevronRight className="w-5 h-5 mr-2" />
                            )}
                            <span className="font-medium">{servicio.nombre}</span>
                          </button>
                          <div className="flex space-x-2">
                            <Button
                              variant="normal"
                              onClick={() => handleAsociar('Servicio', servicio.id, servicio.nombre)}
                              className="text-sm py-1 px-3"
                            >
                              Asociar
                            </Button>
                            <Button
                              variant="create"
                              onClick={() => handleAddPlan(servicio.id)}
                              className="text-sm py-1 px-2"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {expandedServices.includes(servicio.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 ml-6 space-y-2"
                            >
                              {servicio.planes.map((plan) => (
                                <motion.div
                                  key={plan.id}
                                  className="flex items-center justify-between p-2 rounded-md bg-opacity-50 hover:bg-opacity-100 transition-all duration-200"
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <span>{plan.nombre}</span>
                                  <Button
                                    variant="normal"
                                    onClick={() => handleAsociar('Plan', plan.id, `${servicio.nombre} - ${plan.nombre}`)}
                                    className="text-xs py-1 px-2"
                                  >
                                    Asociar
                                  </Button>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                  <Button
                    variant="create"
                    onClick={handleAddServicio}
                    className="mt-4 w-full"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Añadir Servicio
                  </Button>
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-4 bg-gradient-to-r from-yellow-400 to-red-500 text-transparent bg-clip-text">Planes</h4>
                  <div className="space-y-4">
                    {servicios.flatMap((servicio) =>
                      servicio.planes.map((plan) => (
                        <motion.div
                          key={plan.id}
                          className={`border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-4 transition-all duration-300 hover:shadow-md`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{servicio.nombre}</span>
                              <p className="font-medium">{plan.nombre}</p>
                            </div>
                            <Button
                              variant="normal"
                              onClick={() => handleAsociar('Plan', plan.id, `${servicio.nombre} - ${plan.nombre}`)}
                              className="text-sm py-1 px-3"
                            >
                              Asociar
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GastoWidget;