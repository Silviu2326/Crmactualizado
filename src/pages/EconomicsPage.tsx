import React, { useState, useEffect } from 'react';
import { DollarSign, PieChart, FileText, TrendingUp, ChevronRight, Moon, Sun, Snowflake, Gift, TreeDeciduous } from 'lucide-react';
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
  const [showSnow, setShowSnow] = useState(true);

  const sections = [
    { id: 'panel', label: 'Panel de Control', icon: TrendingUp, navIcon: Gift },
    { id: 'cashflow', label: 'Cashflow', icon: DollarSign, navIcon: Snowflake },
    { id: 'planes', label: 'Servicios', icon: PieChart, navIcon: TreeDeciduous },
    { id: 'documentos', label: 'Documentos', icon: FileText, navIcon: Gift },
    { id: 'facturas', label: 'Facturas', icon: FileText, navIcon: Snowflake },
    { id: 'reportes', label: 'Reportes', icon: TrendingUp, navIcon: TreeDeciduous },
  ];

  const christmasStyles = {
    container: `flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-red-50 text-gray-800'}`,
    header: `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md p-4 relative`,
    title: 'text-2xl font-bold flex items-center',
    snowflake: 'absolute animate-fall pointer-events-none',
    button: `p-2 rounded-full ${theme === 'dark' 
      ? 'bg-gray-700 text-green-400 hover:bg-gray-600' 
      : 'bg-red-100 text-green-600 hover:bg-red-200'} 
      transition-colors duration-200`,
    nav: `flex space-x-4 overflow-x-auto pb-4 pt-2 ${theme === 'dark' ? 'text-green-400' : 'text-red-600'}`,
    navButton: `relative flex flex-col items-center px-6 py-3 text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-300 transform hover:scale-105`,
    navIcon: 'w-6 h-6 mb-2',
    navLabel: 'text-center',
    activeIndicator: 'absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-current transform origin-left'
  };

  const snowflakes = showSnow ? Array.from({ length: 20 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 3 + 2}s`,
    animationDelay: `${Math.random() * 2}s`,
    style: {
      position: 'absolute',
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
    }
  })) : [];

  useEffect(() => {
    const styles = `
      @keyframes fall {
        0% {
          transform: translateY(-10vh) rotate(0deg);
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
        }
      }
      
      .animate-fall {
        animation: fall linear infinite;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

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
    <div className={christmasStyles.container}>
      <div className={christmasStyles.header}>
        {showSnow && snowflakes.map((snowflake, i) => (
          <div key={i} className={christmasStyles.snowflake} style={snowflake.style}>
            <Snowflake size={16} className={`${theme === 'dark' ? 'text-gray-300' : 'text-red-200'}`} />
          </div>
        ))}
        <div className="flex justify-between items-center mb-4">
          <h2 className={christmasStyles.title}>
            <TreeDeciduous className="w-6 h-6 mr-2 text-green-500" />
            Gestión Económica
            <Gift className="w-6 h-6 ml-2 text-red-500" />
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSnow(!showSnow)}
              className={christmasStyles.button}
            >
              <Snowflake size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className={christmasStyles.button}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
        <nav className={christmasStyles.nav}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`${christmasStyles.navButton} ${
                activeSection === section.id
                  ? theme === 'dark'
                    ? 'bg-green-900/50 text-green-100 shadow-lg shadow-green-900/50'
                    : 'bg-red-100 text-green-700 shadow-lg shadow-red-200/50'
                  : theme === 'dark'
                  ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  : 'bg-white/80 text-gray-600 hover:bg-red-50'
              }`}
            >
              <div className="relative">
                <section.navIcon className={`${christmasStyles.navIcon} ${
                  activeSection === section.id
                    ? 'animate-bounce'
                    : ''
                }`} />
                {activeSection === section.id && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className={christmasStyles.navLabel}>{section.label}</span>
              {activeSection === section.id && (
                <div className={christmasStyles.activeIndicator} />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div
        className={`flex-1 overflow-auto p-8 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-red-50'
        }`}
      >
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default EconomicsPage;
