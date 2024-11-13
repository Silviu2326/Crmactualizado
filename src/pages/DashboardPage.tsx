import React, { useState, useEffect } from 'react';
import { Book, Send, PenTool, FileText, Search, TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Calendar
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

const API_URL = 'http://localhost:5005';

const DashboardPage: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [classSearchTerm, setClassSearchTerm] = useState('');
  const [viewType, setViewType] = useState<'weekly' | 'monthly' | 'annual'>('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isGenerateStoryModalOpen, setIsGenerateStoryModalOpen] = useState(false);
  const [isGeneratePostModalOpen, setIsGeneratePostModalOpen] = useState(false);
  const [isCreateGroupClassModalOpen, setIsCreateGroupClassModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/ingresos`).then(response => response.json()).then(data => {
      console.log("Ingresos:", data);
    });
    fetch(`${API_URL}/api/gastos`).then(response => response.json()).then(data => {
      console.log("Gastos:", data);
    });
    fetch(`${API_URL}/api/clientes`).then(response => response.json()).then(data => {
      console.log("Clientes:", data);
    });
    fetch(`${API_URL}/api/clasesGrupales`).then(response => response.json()).then(data => {
      console.log("Clases Grupales:", data);
    });
  }, []);
  const clientData = [
    { Nombre: 'Juan Pérez', Email: 'juan@example.com', 'Última Clase': '2023-05-15', Estado: 'Activo' },
    { Nombre: 'María García', Email: 'maria@example.com', 'Última Clase': '2023-05-16', Estado: 'Inactivo' },
    { Nombre: 'Carlos López', Email: 'carlos@example.com', 'Última Clase': '2023-05-17', Estado: 'Activo' },
  ];

  const classData = [
    { Clase: 'Yoga', Instructor: 'Ana Martínez', Fecha: '2023-05-20', Hora: '10:00', Capacidad: '15/20' },
    { Clase: 'Pilates', Instructor: 'Pedro Sánchez', Fecha: '2023-05-21', Hora: '11:00', Capacidad: '12/15' },
    { Clase: 'Zumba', Instructor: 'Laura Gómez', Fecha: '2023-05-22', Hora: '18:00', Capacidad: '18/25' },
  ];

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case 'weekly':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'annual':
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (viewType) {
      case 'weekly':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'monthly':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'annual':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    switch (viewType) {
      case 'weekly':
        const endOfWeek = new Date(currentDate);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        return `${currentDate.toLocaleDateString('es-ES', options)} - ${endOfWeek.toLocaleDateString('es-ES', options)}`;
      case 'monthly':
        return currentDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
      case 'annual':
        return currentDate.getFullYear().toString();
    }
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>
        <div className="flex space-x-4">
          <Tooltip content="Generar Historia">
            <button 
              onClick={() => setIsGenerateStoryModalOpen(true)}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} transition-colors duration-200`}
            >
              <PenTool className="w-6 h-6" />
            </button>
          </Tooltip>
          <Tooltip content="Generar Publicación">
            <button 
              onClick={() => setIsGeneratePostModalOpen(true)}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} transition-colors duration-200`}
            >
              <FileText className="w-6 h-6" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Alertas"
          value="3"
          description="Alertas pendientes de revisión"
          icon="AlertTriangle"
          trend={-2.5}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Ingresos
            </h2>
          </div>
          <IncomeChart viewType={viewType} currentDate={currentDate} />
        </div>
        <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <TrendingDown className="w-5 h-5 mr-2" />
              Cash Flow
            </h2>
            <div className="flex items-center space-x-2">
              <Dropdown
                options={[
                  { value: 'weekly', label: 'Semanal' },
                  { value: 'monthly', label: 'Mensual' },
                  { value: 'annual', label: 'Anual' },
                ]}
                value={viewType}
                onChange={(value) => setViewType(value as 'weekly' | 'monthly' | 'annual')}
              />
              <button onClick={handlePrevious} className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Anterior
              </button>
              <span className="font-medium">{formatDateRange()}</span>
              <button onClick={handleNext} className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Siguiente
              </button>
            </div>
          </div>
          <CashFlowChart viewType={viewType} currentDate={currentDate} />
        </div>
      </div>

      <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} mb-8`}>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Send className="w-5 h-5 mr-2" />
          Clientes Recientes
        </h2>
        <div className="flex mb-4">
          <div className={`flex-1 relative ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              className={`w-full p-2 pl-10 pr-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <button className={`ml-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors duration-200`}>
            Filtrar
          </button>
        </div>
        <Table
          headers={['Nombre', 'Email', 'Última Clase', 'Estado']}
          data={clientData.filter(client => 
            client.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.Email.toLowerCase().includes(searchTerm.toLowerCase())
          )}
        />
      </div>

      <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Book className="w-5 h-5 mr-2" />
          Próximas Clases
        </h2>
        <div className="flex mb-4">
          <div className={`flex-1 relative ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <input
              type="text"
              placeholder="Buscar por clase o instructor..."
              className={`w-full p-2 pl-10 pr-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={classSearchTerm}
              onChange={(e) => setClassSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <button 
            onClick={() => setIsCreateGroupClassModalOpen(true)}
            className={`ml-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors duration-200`}
          >
            Agregar Clase
          </button>
        </div>
        <Table
          headers={['Clase', 'Instructor', 'Fecha', 'Hora', 'Capacidad']}
          data={classData.filter(classItem => 
            classItem.Clase.toLowerCase().includes(classSearchTerm.toLowerCase()) ||
            classItem.Instructor.toLowerCase().includes(classSearchTerm.toLowerCase())
          )}
        />
      </div>

      <GenerateStoryModal
        isOpen={isGenerateStoryModalOpen}
        onClose={() => setIsGenerateStoryModalOpen(false)}
      />
      <GeneratePostModal
        isOpen={isGeneratePostModalOpen}
        onClose={() => setIsGeneratePostModalOpen(false)}
      />
      <CreateGroupClassModal
        isOpen={isCreateGroupClassModalOpen}
        onClose={() => setIsCreateGroupClassModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;