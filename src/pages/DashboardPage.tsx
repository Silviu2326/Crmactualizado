// DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Book,
  Send,
  PenTool,
  FileText,
  Search,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
} from 'lucide-react';
import Table from '../components/Common/Table';
import IncomeChart from '../components/Economics/IncomeChart';
import CashFlowChart from '../components/Economics/CashFlowChart';
import MetricCard from '../components/Dashboard/MetricCard';
import { useTheme } from '../contexts/ThemeContext';
import Tooltip from '../components/Common/Tooltip';
import Dropdown from '../components/Common/Dropdown';
import GenerateStoryModal from '../components/modals/GenerateStoryModal';
import GeneratePostModal from '../components/modals/GeneratePostModal';
import CreateGroupClassModal from '../components/modals/CreateGroupClassModal';

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api'; // Asegúrate de que coincida con tu backend

const DashboardPage: React.FC = () => {
  const { theme } = useTheme();

  // Estados para manejar términos de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [classSearchTerm, setClassSearchTerm] = useState('');

  // Estado para el tipo de vista del gráfico (diario, mensual, anual)
  const [viewType, setViewType] = useState<'daily' | 'monthly' | 'annual'>('monthly');

  // Estado para manejar la fecha actual en los gráficos
  const [currentDate, setCurrentDate] = useState(new Date());

  // Estados para controlar la apertura de los modales
  const [isGenerateStoryModalOpen, setIsGenerateStoryModalOpen] = useState(false);
  const [isGeneratePostModalOpen, setIsGeneratePostModalOpen] = useState(false);
  const [isCreateGroupClassModalOpen, setIsCreateGroupClassModalOpen] = useState(false);

  // Estados para almacenar datos de la API
  const [clientesData, setClientesData] = useState<any[]>([]);
  const [ingresos, setIngresos] = useState<any[]>([]);
  const [gastos, setGastos] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log('🚀 Iniciando la carga de datos del Dashboard...');

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Función para obtener las alertas
        const fetchAlerts = async () => {
          try {
            const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/economic-alerts', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (!response.ok) {
              throw new Error('Error en la petición de alertas');
            }

            const data = await response.json();
            if (data.status === 'success') {
              setAlerts(data.data.alerts);
              console.log('✅ Alertas obtenidas exitosamente:', data.data.alerts);
            }
          } catch (error) {
            console.error('❗️ Error al obtener las alertas:', error);
          }
        };

        // Función para manejar la petición de clientes
        const fetchClientes = async () => {
          try {
            console.log('🔄 Realizando petición GET a /api/clientes...');
            const response = await axios.get(`${API_URL}/clientes`, {
              withCredentials: true, // Enviar cookies con la solicitud
            });
            setClientesData(response.data);
            console.log('🎉 Datos de Clientes obtenidos exitosamente:', response.data);
          } catch (err: any) {
            console.error('❗️ Error al obtener Clientes:', err);
            if (err.response) {
              console.error('Detalles del error:', err.response.data);
            }
            setError('Error al obtener Clientes');
          }
        };

        // Llamada a la función de fetchClientes
        await fetchClientes();

        // Fetch ingresos
        const ingresosResponse = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/ingresos', { headers });
        const ingresosData = await ingresosResponse.json();
        setIngresos(ingresosData);

        // Fetch gastos
        const gastosResponse = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/gastos', { headers });
        const gastosData = await gastosResponse.json();
        setGastos(gastosData);

        // Fetch alerts
        await fetchAlerts();

        setLoading(false);
        console.log('✅ Finalizó la carga de datos del Dashboard.');
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Datos estáticos para tablas como fallback si la API no ha cargado datos
  const clientData = clientesData.length > 0 ? clientesData : [
  ];

  // Función para manejar la navegación a la fecha anterior
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case 'daily':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'annual':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    setCurrentDate(newDate);
    console.log(`⏮️ Cambió la fecha anterior a: ${newDate}`);
  };

  // Función para manejar la navegación a la fecha siguiente
  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case 'daily':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'annual':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    setCurrentDate(newDate);
    console.log(`⏭️ Cambió la fecha siguiente a: ${newDate}`);
  };

  // Función para formatear el rango de fechas según el tipo de vista
  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    switch (viewType) {
      case 'daily':
        return currentDate.toLocaleDateString('es-ES', options);
      case 'monthly':
        return currentDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
      case 'annual':
        return currentDate.getFullYear().toString();
    }
  };

  // Manejo de filtrado de clientes desde la API
  const filteredClientData = clientesData.length > 0 ? clientesData.filter((client: any) =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(client => ({
    Nombre: client.nombre,
    Email: client.email,
    'Última Clase': client.ultimaClase || 'N/A',
    Estado: client.estado || 'N/A',
  })) : clientData.filter((client) =>
    client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(client => ({
    Nombre: client.nombre,
    Email: client.email,
    'Última Clase': client.ultimaClase || 'N/A',
    Estado: client.estado || 'N/A',
  }));

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Encabezado del Dashboard */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
        <div className="flex space-x-4">
          {/* Botón para abrir el modal de Generar Historia */}
          <Tooltip content="Generar Historia">
            <button
              onClick={() => {
                console.log('🟢 Abrir modal para generar historia');
                setIsGenerateStoryModalOpen(true);
              }}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} transition-colors duration-200`}
            >
              <PenTool className="w-6 h-6" />
            </button>
          </Tooltip>

          {/* Botón para abrir el modal de Generar Publicación */}
          <Tooltip content="Generar Publicación">
            <button
              onClick={() => {
                console.log('🟢 Abrir modal para generar publicación');
                setIsGeneratePostModalOpen(true);
              }}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} transition-colors duration-200`}
            >
              <FileText className="w-6 h-6" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Indicador de carga */}
      {loading && (
        <div className="mb-8">
          <p className="text-center text-gray-500">Cargando datos...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="mb-8">
          <p className="text-center text-red-500">{error}</p>
        </div>
      )}

      {/* Contenido principal del Dashboard */}
      {!loading && !error && (
        <>
          {/* Tarjetas de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
              title="Alertas"
              value={alerts.length.toString()}
              description={`${alerts.length === 1 ? 'Alerta pendiente' : 'Alertas pendientes'} de revisión`}
              icon="AlertTriangle"
            />
            <MetricCard
              title="Próximas Actividades"
              value="8"
              description="Actividades programadas esta semana"
              icon="Calendar"
              trend={1.8}
            />
            <MetricCard
              title="Próximos Eventos"
              value="12"
              description="Eventos especiales este mes"
              icon="Calendar"
              trend={3.2}
            />
          </div>

          {/* Gráficos de Ingresos y Cash Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Gráfico de Ingresos */}
            <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Ingresos
                </h2>
              </div>
              {/* Componente del gráfico de ingresos */}
              <IncomeChart viewType={viewType} currentDate={currentDate} />
            </div>

            {/* Gráfico de Cash Flow */}
            <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  Cash Flow
                </h2>
                <div className="flex items-center space-x-2">
                  {/* Selector de tipo de vista */}
                  <select
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value as 'daily' | 'monthly' | 'annual')}
                    className={`px-3 py-1 rounded ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-800 border-gray-300'
                    }`}
                  >
                    <option value="daily">Diario</option>
                    <option value="monthly">Mensual</option>
                    <option value="annual">Anual</option>
                  </select>
                  {/* Botón para navegar a la fecha anterior */}
                  <button
                    onClick={handlePrevious}
                    className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Anterior
                  </button>
                  {/* Rango de fechas formateado */}
                  <span className="font-medium">{formatDateRange()}</span>
                  {/* Botón para navegar a la fecha siguiente */}
                  <button
                    onClick={handleNext}
                    className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
              {/* Componente del gráfico de Cash Flow */}
              <CashFlowChart 
                viewType={viewType} 
                currentDate={currentDate} 
                ingresos={ingresos}
                gastos={gastos}
              />

            </div>
          </div>

          {/* Tabla de Clientes Recientes */}
          <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} mb-8`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Send className="w-5 h-5 mr-2" />
              Clientes Recientes
            </h2>
            <div className="flex mb-4">
              {/* Campo de búsqueda para clientes */}
              <div className={`flex-1 relative ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  className={`w-full p-2 pl-10 pr-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={searchTerm}
                  onChange={(e) => {
                    console.log(`🔍 Cambió el término de búsqueda de clientes a: ${e.target.value}`);
                    setSearchTerm(e.target.value);
                  }}
                />
                {/* Icono de búsqueda */}
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              {/* Botón para filtrar clientes */}
              <button
                onClick={() => {
                  console.log('🟢 Filtrando clientes con el término:', searchTerm);
                  // Aquí podrías agregar lógica adicional si es necesario
                }}
                className={`ml-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-200`}
              >
                Filtrar
              </button>
            </div>
            {/* Componente de tabla para mostrar clientes filtrados */}
            <Table
              headers={['Nombre', 'Email', 'Última Clase', 'Estado']}
              data={filteredClientData}
            />
          </div>

          {/* Tabla de Próximas Clases (comentada) */}
          {/*
          <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Book className="w-5 h-5 mr-2" />
              Próximas Clases
            </h2>
            <div className="flex mb-4">
              {/* Campo de búsqueda para clases */}
              {/*
              <div className={`flex-1 relative ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <input
                  type="text"
                  placeholder="Buscar por clase o instructor..."
                  className={`w-full p-2 pl-10 pr-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  value={classSearchTerm}
                  onChange={(e) => {
                    console.log(`🔍 Cambió el término de búsqueda de clases a: ${e.target.value}`);
                    setClassSearchTerm(e.target.value);
                  }}
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              */}
              {/* Botón para abrir el modal de Agregar Clase */}
              {/*
              <button
                onClick={() => {
                  console.log('🟢 Abrir modal para agregar una nueva clase grupal');
                  setIsCreateGroupClassModalOpen(true);
                }}
                className={`ml-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors duration-200`}
              >
                Agregar Clase
              </button>
            </div>
            {/* Componente de tabla para mostrar clases filtradas */}
            {/*
            <Table
              headers={['Clase', 'Instructor', 'Fecha', 'Hora', 'Capacidad']}
              data={filteredClassData}
            />
          </div>
          */}
        </>
      )}

      {/* Modales */}
      <GenerateStoryModal
        isOpen={isGenerateStoryModalOpen}
        onClose={() => {
          console.log('🔴 Cerrar modal de generar historia');
          setIsGenerateStoryModalOpen(false);
        }}
      />
      <GeneratePostModal
        isOpen={isGeneratePostModalOpen}
        onClose={() => {
          console.log('🔴 Cerrar modal de generar publicación');
          setIsGeneratePostModalOpen(false);
        }}
      />
      <CreateGroupClassModal
        isOpen={isCreateGroupClassModalOpen}
        onClose={() => {
          console.log('🔴 Cerrar modal de crear clase grupal');
          setIsCreateGroupClassModalOpen(false);
        }}
      />
    </div>
  );
};

export default DashboardPage;
