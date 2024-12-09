import React, { useState, useEffect } from 'react';
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
  const [editMode, setEditMode] = useState(false);
  const [isFacturaPopupOpen, setIsFacturaPopupOpen] = useState(false);
  const [isEscanearFacturaPopupOpen, setIsEscanearFacturaPopupOpen] = useState(false);

  // Mock data for testing
  const [balances, setBalances] = useState({
    bank: 1250.75,
    stripe: 850.50,
    cash: 325.25
  });

  const [expenses, setExpenses] = useState([
    {
      id: '1',
      description: 'Alquiler',
      amount: 1200,
      date: '2024-01-01',
      category: 'Fijo'
    },
    {
      id: '2',
      description: 'Luz',
      amount: 150,
      date: '2024-01-05',
      category: 'Variable'
    }
  ]);

  const expenseCategories = ['Fijo', 'Variable', 'Marketing', 'Equipamiento', 'Otros'];

  const handleUpdateBalance = (accountType: string, value: number) => {
    setBalances(prev => ({
      ...prev,
      [accountType]: value
    }));
  };

  const handleAddExpense = (expense: Omit<typeof expenses[0], 'id'>) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9)
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const sections = [
    { id: 'panel', label: 'Panel de Control', icon: TrendingUp },
    { id: 'cashflow', label: 'Cashflow', icon: DollarSign },
    { id: 'planes', label: 'Servicios', icon: PieChart },
    { id: 'documentos', label: 'Documentos', icon: FileText },
    { id: 'facturas', label: 'Facturas', icon: FileText },
    { id: 'reportes', label: 'Reportes', icon: TrendingUp },
  ];

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
            balances={balances}
            expenses={expenses}
            onUpdateBalance={handleUpdateBalance}
            onAddExpense={handleAddExpense}
            onRemoveExpense={handleRemoveExpense}
            expenseCategories={expenseCategories}
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
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeSection === section.id
                  ? theme === 'dark'
                    ? 'bg-gray-700 text-white'
                    : 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <section.icon className="w-5 h-5 mr-2" />
              {section.label}
              <ChevronRight className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                activeSection === section.id ? 'rotate-90' : ''
              }`} />
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-auto p-6">{renderActiveComponent()}</div>
    </div>
  );
};

export default EconomicsPage;
