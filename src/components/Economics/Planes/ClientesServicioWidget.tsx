import React, { useState, useEffect } from 'react'; 
import {
  Link,
  Search,
  Filter,
  Plus,
  Calendar,
  Users,
  BookOpen,
  Clipboard,
  ChevronDown,
  ChevronUp,
  DollarSign,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

type ServiceType = 'all' | 'citas' | 'suscripciones' | 'asesorias' | 'clases';

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  fechaInicio: string;
  estado: 'Activo' | 'Pendiente' | 'Inactivo';
  pagosRealizados: number;
  ultimoPago: string;
}

interface PlanDePago {
  _id: string;
  nombre: string;
  precio: number;
  duracion: string;
  descripcion: string;
  ingresosTotales: number;
  clientes: Cliente[];
}

interface Servicio {
  _id: string;
  nombre: string;
  tipo: string;
  planDePago: PlanDePago[];
  descripcion: string;
}

const ClientesServicioWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ServiceType>('all');
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const fetchServicios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/servicios/services', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Transformar los datos para mantener la estructura existente
      const serviciosTransformados = response.data.map((servicio: Servicio) => ({
        ...servicio,
        _id: servicio._id,
        nombre: servicio.nombre,
        tipo: servicio.tipo.toLowerCase(),
        planDePago: servicio.planDePago.map(plan => ({
          ...plan,
          ingresosTotales: plan.precio * (plan.clientes?.length || 0),
          clientes: plan.clientes || []
        }))
      }));
      
      setServicios(serviciosTransformados);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching servicios:', err);
      setError('Error al cargar los servicios');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const filteredServices =
    selectedType === 'all'
      ? servicios
      : servicios.filter((s) => s.tipo === selectedType);

  const ServiceTypeButton: React.FC<{
    type: ServiceType;
    icon: React.ReactNode;
    label: string;
  }> = ({ type, icon, label }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedType(type)}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 ${
        selectedType === type
          ? theme === 'dark'
            ? 'bg-gradient-to-r from-violet-900 via-purple-900 to-fuchsia-900 text-white shadow-lg shadow-violet-900/30'
            : 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30'
          : theme === 'dark'
          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
          : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
      } font-medium`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </motion.button>
  );

  const FinancialMetric: React.FC<{
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
  }> = ({ label, value, icon, trend }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`flex items-center gap-4 p-6 rounded-2xl ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-gray-700'
          : 'bg-gradient-to-br from-white via-white to-gray-50'
      } shadow-xl border ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
      }`}
    >
      <div
        className={`p-4 rounded-xl ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-700 to-gray-600'
            : 'bg-gradient-to-br from-gray-50 to-white'
        } shadow-inner`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {label}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            {value}
          </p>
          {trend && (
            <span className="text-sm text-green-500 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              {trend}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div
      className={`p-8 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
      } rounded-3xl shadow-2xl`}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3
            className={`text-3xl font-bold mb-2 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400'
                : 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600'
            } bg-clip-text text-transparent`}
          >
            Gestión de Planes y Clientes
          </h3>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Administra tus planes y clientes de manera eficiente
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`${
            theme === 'dark'
              ? 'bg-gradient-to-r from-violet-900 via-purple-900 to-fuchsia-900'
              : 'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500'
          } p-4 rounded-2xl shadow-lg`}
        >
          <Link className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      <div className="flex flex-col space-y-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar planes o clientes..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`w-full px-6 py-4 border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-gray-800'
              } rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-lg placeholder-gray-400`}
            />
            <Search
              className={`absolute right-6 top-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
          </div>
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <Button variant="filter" onClick={toggleFilterDropdown}>
              <Filter className="w-5 h-5" />
            </Button>
            {/* Dropdown de Filtro */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20`}
                >
                  <button
                    onClick={() => { /* Lógica de filtrado */ setIsFilterOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Opción 1
                  </button>
                  <button
                    onClick={() => { /* Lógica de filtrado */ setIsFilterOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Opción 2
                  </button>
                  <button
                    onClick={() => { /* Lógica de filtrado */ setIsFilterOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Opción 3
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          {/* Eliminado el botón "Asignar" */}
        </div>

        <div className="flex flex-wrap gap-4">
          <ServiceTypeButton
            type="all"
            icon={<Link className="w-5 h-5" />}
            label="Todos"
          />
          <ServiceTypeButton
            type="citas"
            icon={<Calendar className="w-5 h-5" />}
            label="Citas"
          />
          <ServiceTypeButton
            type="suscripciones"
            icon={<Clipboard className="w-5 h-5" />}
            label="Suscripciones"
          />
          <ServiceTypeButton
            type="asesorias"
            icon={<BookOpen className="w-5 h-5" />}
            label="Asesorías"
          />
          <ServiceTypeButton
            type="clases"
            icon={<Users className="w-5 h-5" />}
            label="Clases Grupales"
          />
        </div>
      </div>

      <div className="space-y-10">
        {loading ? (
          <div className="text-center py-4">Cargando servicios...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          filteredServices.map((servicio) => (
            <motion.div
              key={servicio._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h4
                className={`font-bold text-2xl ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}
              >
                {servicio.nombre}
              </h4>

              <div className="grid gap-8">
                {servicio.planDePago.map((plan) => {
                  const clientesActivos = plan.clientes?.filter(cliente => cliente.estado === 'Activo').length || 0;
                  return (
                    <motion.div
                      key={plan._id}
                      whileHover={{ y: -5 }}
                      className={`rounded-3xl border ${
                        theme === 'dark'
                          ? 'border-gray-700 bg-gradient-to-br from-gray-800 to-gray-700'
                          : 'border-gray-200 bg-gradient-to-br from-white to-gray-50'
                      } shadow-2xl overflow-hidden`}
                    >
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-8">
                          <div>
                            <h5 className="font-bold text-2xl mb-3">{plan.nombre || `Plan ${plan.duracion}`}</h5>
                            <p
                              className={`text-base ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              {plan.descripcion}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-bold text-3xl ${
                                theme === 'dark'
                                  ? 'bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400'
                                  : 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600'
                              } bg-clip-text text-transparent`}
                            >
                              ${plan.precio}
                            </p>
                            <p
                              className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              por {plan.duracion || 'mes'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <FinancialMetric
                            label="Ingresos Totales"
                            value={`$${plan.ingresosTotales}`}
                            icon={
                              <DollarSign
                                className={`w-7 h-7 ${
                                  theme === 'dark'
                                    ? 'text-violet-400'
                                    : 'text-violet-500'
                                }`}
                              />
                            }
                            trend="+12%"
                          />
                          <FinancialMetric
                            label="Clientes Activos"
                            value={clientesActivos}
                            icon={
                              <Users
                                className={`w-7 h-7 ${
                                  theme === 'dark'
                                    ? 'text-purple-400'
                                    : 'text-purple-500'
                                }`}
                              />
                            }
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setExpandedPlan(
                              expandedPlan === plan._id ? null : plan._id
                            )
                          }
                          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl transition-all duration-300 ${
                            theme === 'dark'
                              ? 'bg-gray-800 hover:bg-gray-700'
                              : 'bg-white hover:bg-gray-50'
                          } shadow-lg border ${
                            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                          }`}
                        >
                          {expandedPlan === plan._id ? (
                            <>
                              <ChevronUp className="w-5 h-5" />
                              <span>Ocultar Clientes</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-5 h-5" />
                              <span>Ver Clientes ({plan.clientes?.length || 0})</span>
                            </>
                          )}
                        </motion.button>

                        <AnimatePresence>
                          {expandedPlan === plan._id && plan.clientes && plan.clientes.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div
                                className={`mt-8 border-t ${
                                  theme === 'dark'
                                    ? 'border-gray-700'
                                    : 'border-gray-200'
                                }`}
                              >
                                <div className="pt-8">
                                  <Table
                                    headers={[
                                      'Cliente',
                                      'Email',
                                      'Teléfono',
                                      'Inicio',
                                      'Estado',
                                      'Pagos',
                                      'Último Pago',
                                    ]}
                                    data={plan.clientes.map((cliente) => ({
                                      Cliente: cliente.nombre,
                                      Email: cliente.email,
                                      Teléfono: cliente.telefono,
                                      Inicio: cliente.fechaInicio,
                                      Estado: (
                                        <span
                                          className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                                            cliente.estado === 'Activo'
                                              ? theme === 'dark'
                                                ? 'bg-gradient-to-r from-green-900 to-emerald-900 text-green-100'
                                                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                              : theme === 'dark'
                                              ? 'bg-gradient-to-r from-yellow-900 to-orange-900 text-yellow-100'
                                              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                                          } shadow-lg`}
                                        >
                                          {cliente.estado}
                                        </span>
                                      ),
                                      Pagos: cliente.pagosRealizados,
                                      'Último Pago': cliente.ultimoPago,
                                    }))}
                                    variant={theme === 'dark' ? 'dark' : 'white'}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientesServicioWidget;
