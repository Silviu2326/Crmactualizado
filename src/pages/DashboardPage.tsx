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
  Users,
  Activity,
  BarChart,
  LineChart
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
    <div className="p-6 relative bg-white">
      {/* Contenido del Dashboard */}
      <div className="space-y-6 relative z-10">
        {/* Título */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard
            </h1>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              Panel de Control
            </span>
          </div>
          <div className="flex gap-2">
            {/* Botones */}
            <button
              onClick={() => setIsGenerateStoryModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PenTool className="w-4 h-4" />
              <span>Generar Historia</span>
            </button>
            <button
              onClick={() => setIsGeneratePostModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Generar Publicación</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Clientes"
            value={clientesData.length.toString()}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            trend={10}
            trendIcon={<TrendingUp className="w-4 h-4" />}
            className="bg-white shadow-lg"
          />
          <MetricCard
            title="Ingresos Mensuales"
            value="$25,000"
            icon={<BarChart className="w-6 h-6 text-blue-600" />}
            trend={15}
            trendIcon={<TrendingUp className="w-4 h-4" />}
            className="bg-white shadow-lg"
          />
          <MetricCard
            title="Alertas Pendientes"
            value={alerts.length.toString()}
            icon={<AlertTriangle className="w-6 h-6 text-blue-600" />}
            trend={-5}
            trendIcon={<TrendingDown className="w-4 h-4" />}
            className="bg-white shadow-lg"
          />
          <MetricCard
            title="Próximas Actividades"
            value="8"
            icon={<Calendar className="w-6 h-6 text-blue-600" />}
            trend={2}
            trendIcon={<TrendingUp className="w-4 h-4" />}
            className="bg-white shadow-lg"
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Ingresos
              <Activity className="w-4 h-4 text-blue-600" />
            </h2>
            <IncomeChart data={ingresos} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Cash Flow
              <LineChart className="w-4 h-4 text-blue-600" />
            </h2>
            <CashFlowChart viewType={viewType} currentDate={currentDate} ingresos={ingresos} gastos={gastos} />
          </div>
        </div>

        {/* Tablas */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Clientes Recientes
            <Users className="w-4 h-4 text-blue-600" />
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
