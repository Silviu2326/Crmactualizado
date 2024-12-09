import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useTheme } from '../../contexts/ThemeContext';
import CuentaBancariaWidget from './CuentaBancariaWidget';
import GastoWidget from './GastoWidget';
import AlertasWidget from './AlertasWidget';
import CashflowWidget from './CashflowWidget';
import DocumentosWidget from './DocumentosWidget';
import FacturasWidget from './FacturasWidget';
import ServiciosWidget from './ServiciosWidget';
import BonosWidget from './BonosWidget';
import IncomeChartWidget from './IncomeChartWidget';
import RecentSalesWidget from '../PanelControl/RecentSalesWidget';
import GastoPopup from '../modals/GastoPopup';
import FacturaPopup from '../modals/FacturaPopup';
import EscanearFacturaPopup from '../modals/EscanearFacturaPopup';
import DocumentoPopup from '../modals/DocumentoPopup';
import BonoPopup from '../modals/BonoPopup';
import ReportePopup from '../modals/ReportePopup';
import ReporteActualPopup from '../modals/ReporteActualPopup';
import ClientePopup from '../modals/ClientePopup';
import ServicioPopup from '../modals/ServicioPopup';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface PanelDeControlProps {
  balances: {
    bank: number;
    stripe: number;
    cash: number;
  };
  expenses: Expense[];
  onUpdateBalance: (accountType: string, value: number) => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onRemoveExpense: (id: string) => void;
  expenseCategories: string[];
  theme: 'light' | 'dark';
  editMode: boolean;
  isFacturaPopupOpen: boolean;
  setIsFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFacturaSubmit: (formData: any) => void;
  isEscanearFacturaPopupOpen: boolean;
  setIsEscanearFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEscanearFacturaSubmit: (formData: any) => void;
}

const PanelDeControl: React.FC<PanelDeControlProps> = ({
  balances,
  expenses,
  onUpdateBalance,
  onAddExpense,
  onRemoveExpense,
  expenseCategories,
  theme,
  editMode,
  isFacturaPopupOpen,
  setIsFacturaPopupOpen,
  handleFacturaSubmit,
  isEscanearFacturaPopupOpen,
  setIsEscanearFacturaPopupOpen,
  handleEscanearFacturaSubmit,
}) => {
  const { isDark } = useTheme();

  const layouts = {
    lg: [
      { i: 'cuentaBancaria', x: 0, y: 0, w: 4, h: 2 },
      { i: 'cashflow', x: 4, y: 0, w: 8, h: 2 },
      { i: 'gastos', x: 0, y: 2, w: 6, h: 2 },
      { i: 'alertas', x: 6, y: 2, w: 6, h: 2 },
      { i: 'documentos', x: 0, y: 4, w: 4, h: 2 },
      { i: 'facturas', x: 4, y: 4, w: 4, h: 2 },
      { i: 'servicios', x: 8, y: 4, w: 4, h: 2 },
      { i: 'bonos', x: 0, y: 6, w: 12, h: 2 }
    ],
    md: [
      { i: 'cuentaBancaria', x: 0, y: 0, w: 6, h: 2 },
      { i: 'cashflow', x: 6, y: 0, w: 6, h: 2 },
      { i: 'gastos', x: 0, y: 2, w: 6, h: 2 },
      { i: 'alertas', x: 6, y: 2, w: 6, h: 2 },
      { i: 'documentos', x: 0, y: 4, w: 4, h: 2 },
      { i: 'facturas', x: 4, y: 4, w: 4, h: 2 },
      { i: 'servicios', x: 8, y: 4, w: 4, h: 2 },
      { i: 'bonos', x: 0, y: 6, w: 12, h: 2 }
    ],
    sm: [
      { i: 'cuentaBancaria', x: 0, y: 0, w: 6, h: 2 },
      { i: 'cashflow', x: 0, y: 2, w: 6, h: 2 },
      { i: 'gastos', x: 0, y: 4, w: 6, h: 2 },
      { i: 'alertas', x: 0, y: 6, w: 6, h: 2 },
      { i: 'documentos', x: 0, y: 8, w: 4, h: 2 },
      { i: 'facturas', x: 4, y: 8, w: 4, h: 2 },
      { i: 'servicios', x: 8, y: 8, w: 4, h: 2 },
      { i: 'bonos', x: 0, y: 10, w: 12, h: 2 }
    ],
    xs: [
      { i: 'cuentaBancaria', x: 0, y: 0, w: 4, h: 2 },
      { i: 'cashflow', x: 0, y: 2, w: 4, h: 2 },
      { i: 'gastos', x: 0, y: 4, w: 4, h: 2 },
      { i: 'alertas', x: 0, y: 6, w: 4, h: 2 },
      { i: 'documentos', x: 0, y: 8, w: 4, h: 2 },
      { i: 'facturas', x: 0, y: 10, w: 4, h: 2 },
      { i: 'servicios', x: 0, y: 12, w: 4, h: 2 },
      { i: 'bonos', x: 0, y: 14, w: 4, h: 2 }
    ],
    xxs: [
      { i: 'cuentaBancaria', x: 0, y: 0, w: 2, h: 2 },
      { i: 'cashflow', x: 0, y: 2, w: 2, h: 2 },
      { i: 'gastos', x: 0, y: 4, w: 2, h: 2 },
      { i: 'alertas', x: 0, y: 6, w: 2, h: 2 },
      { i: 'documentos', x: 0, y: 8, w: 2, h: 2 },
      { i: 'facturas', x: 0, y: 10, w: 2, h: 2 },
      { i: 'servicios', x: 0, y: 12, w: 2, h: 2 },
      { i: 'bonos', x: 0, y: 14, w: 2, h: 2 }
    ],
  };

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 };

  const handleRemove = () => {
    // In a real app, you might want to show a confirmation dialog
    console.log('Widget removed');
  };

  const handleUpdate = (accountType: string, newValue: number) => {
    onUpdateBalance(accountType, newValue);
  };

  const toggleEditMode = () => {
    // setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    // setIsEditMode(false);
    console.log('Layout guardado:');
  };

  const handleLayoutChange = (newLayout: any) => {
    console.log('Nuevo layout:', newLayout);
  };

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={300}
        margin={[20, 20]}
        containerPadding={[0, 0]}
        isResizable={editMode}
        isDraggable={editMode}
        onLayoutChange={handleLayoutChange}
      >
        <div key="cuentaBancaria">
          <CuentaBancariaWidget
            balances={balances}
            isEditMode={editMode}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
          />
        </div>
        <div key="cashflow">
          <CashflowWidget theme={theme} />
        </div>
        <div key="gastos">
          <GastoWidget
            expenses={expenses}
            onAddExpense={onAddExpense}
            onRemoveExpense={onRemoveExpense}
            categories={expenseCategories}
          />
        </div>
        <div key="alertas">
          <AlertasWidget theme={theme} isEditMode={editMode} />
        </div>
        <div key="documentos">
          <DocumentosWidget theme={theme} isEditMode={editMode} />
        </div>
        <div key="facturas">
          <FacturasWidget theme={theme} isEditMode={editMode} />
        </div>
        <div key="servicios">
          <ServiciosWidget theme={theme} isEditMode={editMode} />
        </div>
        <div key="bonos">
          <BonosWidget theme={theme} isEditMode={editMode} />
        </div>
      </ResponsiveGridLayout>

      {/* Modales */}
      {isFacturaPopupOpen && (
        <FacturaPopup onClose={() => setIsFacturaPopupOpen(false)} onSubmit={handleFacturaSubmit} />
      )}
      {isEscanearFacturaPopupOpen && (
        <EscanearFacturaPopup onClose={() => setIsEscanearFacturaPopupOpen(false)} onSubmit={handleEscanearFacturaSubmit} />
      )}
    </div>
  );
};

export default PanelDeControl;
