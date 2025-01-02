import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  PieChart, 
  FileText, 
  TrendingUp, 
  ChevronRight, 
  Moon, 
  Sun, 
  BarChart2, 
  Wallet, 
  ClipboardList 
} from 'lucide-react';
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
  const [layout, setLayout] = useState('default');
  const [editMode, setEditMode] = useState(false);
  const [isFacturaPopupOpen, setIsFacturaPopupOpen] = useState(false);
  const [isEscanearFacturaPopupOpen, setIsEscanearFacturaPopupOpen] = useState(false);

  const sections = [
    { id: 'panel', label: 'Panel de Control', icon: TrendingUp, navIcon: BarChart2 },
    { id: 'cashflow', label: 'Cashflow', icon: DollarSign, navIcon: Wallet },
    { id: 'planes', label: 'Servicios', icon: PieChart, navIcon: ClipboardList },
    { id: 'documentos', label: 'Documentos', icon: FileText, navIcon: FileText },
    { id: 'facturas', label: 'Facturas', icon: FileText, navIcon: DollarSign },
    { id: 'reportes', label: 'Reportes', icon: TrendingUp, navIcon: PieChart },
  ];

  const styles = {
    container: `flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`,
    header: `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md p-4 relative`,
    title: 'text-2xl font-bold flex items-center',
    button: `p-2 rounded-full ${theme === 'dark' 
      ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' 
      : 'bg-gray-100 text-blue-600 hover:bg-gray-200'} 
      transition-colors duration-200`,
    nav: `flex space-x-4 overflow-x-auto pb-4 pt-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`,
    navButton: `relative flex flex-col items-center px-6 py-3 text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-300`,
    navIcon: 'w-6 h-6 mb-2',
    navLabel: 'text-center',
    activeIndicator: 'absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-current transform origin-left'
  };

  const handleFacturaSubmit = (formData: any) => {
    console.log('Nueva factura:', formData);
    setIsFacturaPopupOpen(false);
  };

  const handleEscanearFacturaSubmit = (formData: any) => {
    console.log('Archivos para escanear:', formData);
    setIsEscanearFacturaPopupOpen(false);
  };

  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'panel':
        return (
          <PanelDeControl
            theme={theme}
            editMode={editMode}
            isFacturaPopupOpen={isFacturaPopupOpen}
            setIsFacturaPopupOpen={setIsFacturaPopupOpen}
            handleFacturaSubmit={handleFacturaSubmit}
            isEscanearFacturaPopupOpen={isEscanearFacturaPopupOpen}
            setIsEscanearFacturaPopupOpen={setIsEscanearFacturaPopupOpen}
            handleEscanearFacturaSubmit={handleEscanearFacturaSubmit}
          />
        );
      case 'cashflow':
        return <CashflowPage />;
      case 'planes':
        return <PlanesPage />;
      case 'documentos':
        return <DocumentosPage />;
      case 'facturas':
        return (
          <FacturasPage
            isFacturaPopupOpen={isFacturaPopupOpen}
            setIsFacturaPopupOpen={setIsFacturaPopupOpen}
            handleFacturaSubmit={handleFacturaSubmit}
            isEscanearFacturaPopupOpen={isEscanearFacturaPopupOpen}
            setIsEscanearFacturaPopupOpen={setIsEscanearFacturaPopupOpen}
            handleEscanearFacturaSubmit={handleEscanearFacturaSubmit}
          />
        );
      case 'reportes':
        return <ReportesPage />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={styles.title}>
            <BarChart2 className="w-6 h-6 mr-2 text-blue-500" />
            Gestión Económica
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={styles.button}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
        <nav className={styles.nav}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`${styles.navButton} ${
                activeSection === section.id
                  ? theme === 'dark'
                    ? 'bg-blue-900/50 text-blue-100 shadow-lg shadow-blue-900/50'
                    : 'bg-blue-100 text-blue-700 shadow-lg shadow-blue-200/50'
                  : theme === 'dark'
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  : 'bg-white/80 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <section.navIcon className={styles.navIcon} />
                {activeSection === section.id && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              <span className={styles.navLabel}>{section.label}</span>
              {activeSection === section.id && (
                <div className={styles.activeIndicator} />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div
        className={`flex-1 overflow-auto p-8 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default EconomicsPage;
