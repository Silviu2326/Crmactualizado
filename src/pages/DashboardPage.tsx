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
  Snowflake,
  Gift,
  Star,
  TreePine,
  Bell
} from 'lucide-react';
import Table from '../components/Common/Table';
import IncomeChart from '../components/Economics/IncomeChart';
import CashFlowChart from '../components/Economics/CashFlowChart';
import MetricCard from '../components/Dashboard/MetricCard';
import Tooltip from '../components/Common/Tooltip';
import Dropdown from '../components/Common/Dropdown';
import GenerateStoryModal from '../components/modals/GenerateStoryModal';
import GeneratePostModal from '../components/modals/GeneratePostModal';
import CreateGroupClassModal from '../components/modals/CreateGroupClassModal';

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api'; // Asegúrate de que coincida con tu backend

const DashboardPage: React.FC = () => {
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
    <div className="p-6 relative bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Decoración navideña */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <style>
          {`
            @keyframes snowfall {
              0% { transform: translateY(-10px) rotate(0deg); }
              100% { transform: translateY(100vh) rotate(360deg); }
            }
            @keyframes twinkle {
              0%, 100% { opacity: 0.3; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.2); }
            }
            .animate-snow {
              animation: snowfall linear infinite;
            }
            .animate-twinkle {
              animation: twinkle ease-in-out infinite;
            }
          `}
        </style>
        {/* Copos de nieve animados */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`snow-${i}`}
            className="absolute text-[#E61D2B]/10 animate-snow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animation: `snowfall ${Math.random() * 3 + 2}s linear infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            <Snowflake size={20} />
          </div>
        ))}
        {/* Estrellas brillantes */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute text-yellow-300/30 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 30}%`,
              animation: `twinkle ${Math.random() * 2 + 1}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            <Star size={16} />
          </div>
        ))}
      </div>

      {/* Contenido del Dashboard */}
      <div className="space-y-6 relative z-10">
        {/* Título con decoración navideña */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
              Dashboard
              <span className="ml-2 text-[#E61D2B]">
                <TreePine className="inline-block w-6 h-6 animate-bounce" />
              </span>
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200 flex items-center gap-1">
              ¡Felices Fiestas!
              <Bell className="w-4 h-4 text-[#E61D2B] animate-bounce" />
            </span>
          </div>
          <div className="flex gap-2">
            {/* Botones existentes con estilo navideño */}
            <button
              onClick={() => setIsGenerateStoryModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#E61D2B] text-white rounded-lg hover:bg-[#E61D2B]/90 transition-colors"
            >
              <PenTool className="w-4 h-4" />
              <span>Generar Historia</span>
              <Gift className="w-4 h-4 animate-bounce" />
            </button>
            <button
              onClick={() => setIsGeneratePostModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#E61D2B] text-white rounded-lg hover:bg-[#E61D2B]/90 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Generar Publicación</span>
              <Gift className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Clientes"
            value={clientesData.length.toString()}
            icon={<Book className="w-6 h-6 text-[#E61D2B]" />}
            trend={10}
            trendIcon={<TrendingUp className="w-4 h-4" />}
            className="relative overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-200 shadow-lg"
            headerDecorator={
              <div className="absolute top-2 right-2">
                <Star className="w-4 h-4 text-yellow-300 animate-pulse" />
              </div>
            }
          />
          <MetricCard
            title="Ingresos Mensuales"
            value="$25,000"
            icon={<TrendingUp className="w-6 h-6 text-[#E61D2B]" />}
            trend={15}
            trendIcon={<TrendingUp className="w-4 h-4" />}
            className="relative overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-200 shadow-lg"
            headerDecorator={
              <div className="absolute top-2 right-2">
                <Gift className="w-4 h-4 text-[#E61D2B] animate-bounce" />
              </div>
            }
          />
          <MetricCard
            title="Alertas Pendientes"
            value={alerts.length.toString()}
            icon={<AlertTriangle className="w-6 h-6 text-[#E61D2B]" />}
            trend={-5}
            trendIcon={<TrendingDown className="w-4 h-4" />}
            className="relative overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-200 shadow-lg"
            headerDecorator={
              <div className="absolute top-2 right-2">
                <Snowflake className="w-4 h-4 text-[#E61D2B]/30 animate-spin" />
              </div>
            }
          />
          <MetricCard
            title="Próximas Actividades"
            value="8"
            icon={<Calendar className="w-6 h-6 text-[#E61D2B]" />}
            trend={2}
            trendIcon={<TrendingUp className="w-4 h-4" />}
            className="relative overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-200 shadow-lg"
            headerDecorator={
              <div className="absolute top-2 right-2">
                <Bell className="w-4 h-4 text-[#E61D2B] animate-bounce" />
              </div>
            }
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 transition-colors duration-200 p-6 rounded-xl shadow-lg border-2 border-[#E61D2B]/20 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Snowflake className="w-5 h-5 text-[#E61D2B]/30 animate-spin" />
            </div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Ingresos
              <Star className="w-4 h-4 text-yellow-300" />
            </h2>
            <IncomeChart data={ingresos} />
          </div>
          <div className="bg-white dark:bg-gray-800 transition-colors duration-200 p-6 rounded-xl shadow-lg border-2 border-[#E61D2B]/20 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Gift className="w-5 h-5 text-[#E61D2B] animate-bounce" />
            </div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Cash Flow
              <TrendingUp className="w-4 h-4 text-[#E61D2B]" />
            </h2>
            <CashFlowChart viewType={viewType} currentDate={currentDate} ingresos={ingresos} gastos={gastos} />
          </div>
        </div>

        {/* Tablas */}
        <div className="bg-white dark:bg-gray-800 transition-colors duration-200 p-6 rounded-xl shadow-lg border-2 border-[#E61D2B]/20 relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Star className="w-4 h-4 text-yellow-300 animate-pulse" />
            <Snowflake className="w-4 h-4 text-[#E61D2B]/30 animate-spin" />
          </div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Clientes Recientes
            <Book className="w-4 h-4 text-[#E61D2B]" />
          </h2>
          <Table
            headers={['Nombre', 'Email', 'Última Clase', 'Estado']}
            data={filteredClientData}
          />
        </div>
      </div>

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
