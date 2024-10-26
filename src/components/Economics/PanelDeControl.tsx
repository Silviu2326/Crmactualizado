import React, { useState } from 'react';
import { Edit, Save, TrendingUp, DollarSign, FileText, Users, PieChart, UserPlus } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import GastoWidget from './GastoWidget';
import AlertasWidget from './AlertasWidget';
import CuentaBancariaWidget from './CuentaBancariaWidget';
import CashflowWidget from './CashflowWidget';
import DocumentosWidget from './DocumentosWidget';
import FacturasWidget from './FacturasWidget';
import ServiciosWidget from './ServiciosWidget';
import BonosWidget from './BonosWidget';
import IncomeChartWidget from './IncomeChartWidget';
import RecentSalesWidget from '../PanelControl/RecentSalesWidget';
import { useEconomicData } from '../../hooks/useEconomicData';
import { useTheme } from '../../contexts/ThemeContext';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const PanelDeControl: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { economicData, updateEconomicData, removeWidget, addWidget } = useEconomicData();
  const [layout, setLayout] = useState(generateInitialLayout());
  const { theme } = useTheme();

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    setIsEditMode(false);
    console.log('Layout guardado:', layout);
  };

  const handleLayoutChange = (newLayout: any) => {
    setLayout(newLayout);
  };

  function generateInitialLayout() {
    return [
      { i: 'proyeccionMes', x: 0, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'gastoMensual', x: 1, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'planesVendidos', x: 2, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'clientesActuales', x: 3, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'ingresoMensual', x: 0, y: 1, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'ingresosTotales', x: 1, y: 1, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'margenGanancia', x: 2, y: 1, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'clientesNuevos', x: 3, y: 1, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'incomeChart', x: 0, y: 2, w: 2, h: 3, minW: 2, minH: 2 },
      { i: 'recentSales', x: 2, y: 2, w: 2, h: 3, minW: 2, minH: 2 },
      { i: 'gastoWidget', x: 0, y: 5, w: 2, h: 2, minW: 1, minH: 1 },
      { i: 'alertasWidget', x: 2, y: 5, w: 2, h: 2, minW: 1, minH: 1 },
      { i: 'cuentaBancariaWidget', x: 0, y: 7, w: 2, h: 2, minW: 1, minH: 1 },
      { i: 'cashflowWidget', x: 2, y: 7, w: 2, h: 2, minW: 1, minH: 1 },
      { i: 'documentosWidget', x: 0, y: 9, w: 2, h: 2, minW: 1, minH: 1 },
      { i: 'facturasWidget', x: 2, y: 9, w: 2, h: 2, minW: 1, minH: 1 },
      { i: 'serviciosWidget', x: 0, y: 11, w: 2, h: 2, minW: 1, minH: 1 },
      { i: 'bonosWidget', x: 2, y: 11, w: 2, h: 2, minW: 1, minH: 1 },
    ];
  }

  const SmallWidget = ({ title, value, icon, subtitle }: { title: string; value: string; icon: React.ElementType; subtitle: string }) => (
    <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md p-4`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{title}</h3>
        {React.createElement(icon, { className: "w-5 h-5 text-blue-500" })}
      </div>
      <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{value}</div>
      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{subtitle}</div>
    </div>
  );

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md p-6 mb-8`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Panel de Control</h2>
        <div className="flex space-x-2">
          <button
            onClick={isEditMode ? handleSave : toggleEditMode}
            className={`flex items-center px-4 py-2 rounded-full transition-colors text-sm shadow-md ${
              isEditMode
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isEditMode ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </>
            )}
          </button>
        </div>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={150}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        onLayoutChange={handleLayoutChange}
        containerPadding={[0, 0]}
      >
        <div key="proyeccionMes">
          <SmallWidget title="Proyección del Mes" value="$0.00" icon={TrendingUp} subtitle="Proyección del mes" />
        </div>
        <div key="gastoMensual">
          <SmallWidget title="Gasto Mensual" value="$0.00" icon={DollarSign} subtitle="Gasto mensual" />
        </div>
        <div key="planesVendidos">
          <SmallWidget title="Planes Vendidos" value="0" icon={FileText} subtitle="Total planes vendidos" />
        </div>
        <div key="clientesActuales">
          <SmallWidget title="Clientes Actuales" value="0" icon={Users} subtitle="Total clientes actuales" />
        </div>
        <div key="ingresoMensual">
          <SmallWidget title="Ingreso Mensual" value="$0.00" icon={DollarSign} subtitle="Ingreso mensual actual" />
        </div>
        <div key="ingresosTotales">
          <SmallWidget title="Ingresos" value="$0.00" icon={DollarSign} subtitle="Ingresos totales" />
        </div>
        <div key="margenGanancia">
          <SmallWidget title="Margen de Ganancia" value="0.00%" icon={PieChart} subtitle="Margen de ganancia" />
        </div>
        <div key="clientesNuevos">
          <SmallWidget title="Clientes Nuevos" value="0" icon={UserPlus} subtitle="Clientes nuevos" />
        </div>

        <div key="gastoWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <GastoWidget
            title="Gastos Totales"
            value={8000}
            isEditMode={isEditMode}
            onUpdate={() => {}}
            onRemove={() => {}}
          />
        </div>
        <div key="alertasWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <AlertasWidget
            alertas={[
              { id: 1, mensaje: "Gasto elevado en marketing este mes", tipo: "warning" },
              { id: 2, mensaje: "Ingresos por debajo del objetivo trimestral", tipo: "error" },
            ]}
            isEditMode={isEditMode}
            onRemove={() => {}}
          />
        </div>
        <div key="cuentaBancariaWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <CuentaBancariaWidget
            saldo={50000}
            isEditMode={isEditMode}
            onUpdate={() => {}}
            onRemove={() => {}}
          />
        </div>
        <div key="cashflowWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <CashflowWidget
            ingresos={20000}
            gastos={15000}
            isEditMode={isEditMode}
            onUpdate={() => {}}
            onRemove={() => {}}
          />
        </div>
        <div key="documentosWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <DocumentosWidget
            documentos={[
              { id: 1, nombre: "Informe Q1", fecha: "2023-03-31" },
              { id: 2, nombre: "Presupuesto Anual", fecha: "2023-01-15" },
            ]}
            isEditMode={isEditMode}
            onRemove={() => {}}
          />
        </div>
        <div key="facturasWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <FacturasWidget
            facturas={[
              { id: 1, numero: "F-001", monto: 1500, estado: "Pagada" },
              { id: 2, numero: "F-002", monto: 2000, estado: "Pendiente" },
            ]}
            isEditMode={isEditMode}
            onRemove={() => {}}
          />
        </div>
        <div key="serviciosWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <ServiciosWidget
            servicios={[
              { id: 1, nombre: "Entrenamiento Personal", ingresos: 5000 },
              { id: 2, nombre: "Clases Grupales", ingresos: 3000 },
            ]}
            isEditMode={isEditMode}
            onRemove={() => {}}
          />
        </div>
        <div key="bonosWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <BonosWidget
            bonos={[
              { id: 1, nombre: "Bono Navidad", valor: 1000, estado: "Activo" },
              { id: 2, nombre: "Bono Rendimiento", valor: 1500, estado: "Inactivo" },
            ]}
            isEditMode={isEditMode}
            onRemove={() => {}}
          />
        </div>
        <div key="incomeChart" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <IncomeChartWidget />
        </div>
        <div key="recentSales" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <RecentSalesWidget />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default PanelDeControl;