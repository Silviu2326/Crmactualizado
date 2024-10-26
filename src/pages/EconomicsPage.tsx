import React, { useState } from 'react';
import { DollarSign, PieChart, FileText, TrendingUp, ChevronRight, Moon, Sun } from 'lucide-react';
import PanelDeControl from '../components/Economics/PanelDeControl';
import CashflowPage from '../components/Economics/Cashflow/CashflowPage';
import PlanesPage from '../components/Economics/Planes/PlanesPage';
import DocumentosPage from '../components/Economics/Documentos/DocumentosPage';
import FacturasPage from '../components/Economics/Facturas/FacturasPage';
import ReportesPage from '../components/Economics/Reportes/ReportesPage';
import { useTheme } from '../contexts/ThemeContext';

const EconomicsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('panel');
  const { theme, toggleTheme } = useTheme();

  const sections = [
    { id: 'panel', label: 'Panel de Control', icon: TrendingUp, component: PanelDeControl },
    { id: 'cashflow', label: 'Cashflow', icon: DollarSign, component: CashflowPage },
    { id: 'planes', label: 'Planes', icon: PieChart, component: PlanesPage },
    { id: 'documentos', label: 'Documentos', icon: FileText, component: DocumentosPage },
    { id: 'facturas', label: 'Facturas', icon: FileText, component: FacturasPage },
    { id: 'reportes', label: 'Reportes', icon: TrendingUp, component: ReportesPage },
  ];

  const ActiveComponent = sections.find(section => section.id === activeSection)?.component || (() => null);

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md p-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Gestión Económica</h2>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              theme === 'dark'
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } transition-colors duration-200`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <nav className="flex space-x-2 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors duration-200 ${
                activeSection === section.id
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 text-gray-900'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <section.icon className="w-5 h-5 mr-2" />
              {section.label}
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          ))}
        </nav>
      </div>
      <div className={`flex-1 overflow-auto p-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <ActiveComponent />
      </div>
    </div>
  );
};

export default EconomicsPage;