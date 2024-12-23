import React, { useState, useEffect } from 'react';
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
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import GastoPopup from '../modals/GastoPopup';
import FacturaPopup from '../modals/FacturaPopup';
import EscanearFacturaPopup from '../modals/EscanearFacturaPopup';
import DocumentoPopup from '../modals/DocumentoPopup';
import BonoPopup from '../modals/BonoPopup';
import ReportePopup from '../modals/ReportePopup';
import ReporteActualPopup from '../modals/ReporteActualPopup';
import ClientePopup from '../modals/ClientePopup';
import ServicioPopup from '../modals/ServicioPopup';
import EconomicPage from '../../pages/EconomicsPage';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Definimos el tipo para el tema
type Theme = 'light' | 'dark';

interface PanelDeControlProps {
  theme: Theme;
  editMode: boolean;
  isFacturaPopupOpen: boolean;
  setIsFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFacturaSubmit: (formData: any) => void;
  isEscanearFacturaPopupOpen: boolean;
  setIsEscanearFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEscanearFacturaSubmit: (formData: any) => void;
}

const PanelDeControl: React.FC<PanelDeControlProps> = ({
  theme,
  editMode,
  isFacturaPopupOpen,
  setIsFacturaPopupOpen,
  handleFacturaSubmit,
  isEscanearFacturaPopupOpen,
  setIsEscanearFacturaPopupOpen,
  handleEscanearFacturaSubmit,
 }) => {
  const [isEditMode, setIsEditMode] = useState(editMode);
  const [layout, setLayout] = useState(generateInitialLayout());
  const [isGastoPopupOpen, setIsGastoPopupOpen] = useState(false);
  const [isDocumentoPopupOpen, setIsDocumentoPopupOpen] = useState(false);
  const [isBonoPopupOpen, setIsBonoPopupOpen] = useState(false);
  const [isReportePopupOpen, setIsReportePopupOpen] = useState(false);
  const [isReporteActualPopupOpen, setIsReporteActualPopupOpen] = useState(false);
  const [isClientePopupOpen, setIsClientePopupOpen] = useState(false);
  const [isServicioPopupOpen, setIsServicioPopupOpen] = useState(false);
  const [balances, setBalances] = useState({
    bank: 1250.75,
    stripe: 850.50,
    cash: 325.25
  });
  const [totalClientes, setTotalClientes] = useState(0);
  const [clientesNuevos, setClientesNuevos] = useState(0);
  const [ingresoTotal, setIngresoTotal] = useState(0);
  const [ingresoMensual, setIngresoMensual] = useState(0);
  const [gastoMensual, setGastoMensual] = useState(0);
  const [proyeccionMensual, setProyeccionMensual] = useState(0);

  const handleRemove = () => {
    // In a real app, you might want to show a confirmation dialog
    console.log('Widget removed');
  };

  const handleUpdate = (accountType: string, newValue: number) => {
    setBalances(prev => ({
      ...prev,
      [accountType]: newValue
    }));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    setIsEditMode(false);
    console.log('Layout guardado:', layout);
  };

  const handleLayoutChange = (newLayout: any) => {
    setLayout(newLayout);
    console.log('Nuevo layout:', newLayout);
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No se encontró el token');
          return;
        }

        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/clientes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los clientes');
        }

        const clientes = await response.json();
        
        // Total de clientes
        setTotalClientes(clientes.length);

        // Clientes nuevos del mes actual
        const ahora = new Date();
        const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        const clientesDelMes = clientes.filter((cliente: any) => {
          const fechaRegistro = new Date(cliente.fechaRegistro);
          return fechaRegistro >= primerDiaMes;
        });

        setClientesNuevos(clientesDelMes.length);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No se encontró el token');
          return;
        }

        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/ingresos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los ingresos');
        }

        const ingresos = await response.json();
        
        // Calcular ingreso total
        const total = ingresos.reduce((sum: number, ingreso: any) => {
          return sum + (ingreso.monto || ingreso.importe || 0);
        }, 0);
        setIngresoTotal(total);

        // Calcular ingreso mensual
        const ahora = new Date();
        const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        const ingresosMes = ingresos.filter((ingreso: any) => {
          const fechaIngreso = new Date(ingreso.fecha);
          return fechaIngreso >= primerDiaMes;
        });

        const totalMes = ingresosMes.reduce((sum: number, ingreso: any) => {
          return sum + (ingreso.monto || ingreso.importe || 0);
        }, 0);
        setIngresoMensual(totalMes);

      } catch (error) {
        console.error('Error al obtener los ingresos:', error);
      }
    };

    fetchIngresos();
  }, []);

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No se encontró el token');
          return;
        }

        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/gastos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los gastos');
        }

        const responseData = await response.json();
        const gastos = responseData.data.gastos;
        
        // Verificar que gastos sea un array
        if (!Array.isArray(gastos)) {
          console.error('Los gastos recibidos no son un array:', gastos);
          throw new Error('El formato de los datos recibidos es incorrecto');
        }

        // Calcular gastos del mes actual
        const ahora = new Date();
        const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        const gastosMes = gastos.filter((gasto: any) => {
          const fechaGasto = new Date(gasto.fecha);
          return fechaGasto >= primerDiaMes && fechaGasto <= ahora;
        });

        const totalGastosMes = gastosMes.reduce((sum: number, gasto: any) => {
          return sum + (gasto.monto || gasto.importe || 0);
        }, 0);

        setGastoMensual(totalGastosMes);

      } catch (error) {
        console.error('Error al obtener los gastos:', error);
      }
    };

    fetchGastos();
  }, []);

  useEffect(() => {
    const proyeccion = ingresoMensual - gastoMensual;
    setProyeccionMensual(proyeccion);
  }, [ingresoMensual, gastoMensual]);

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
      { i: 'cashflowWidget', x: 2, y: 7, w: 2, h: 3, minW: 1, minH: 2 },
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

  const handleGastoSubmit = (formData: any) => {
    console.log('Nuevo gasto:', formData);
  };

  const handleDocumentoSubmit = (formData: any) => {
    console.log('Nuevo documento:', formData);
  };

  const handleBonoSubmit = (formData: any) => {
    console.log('Nuevo bono:', formData);
  };

  const handleReporteSubmit = (formData: any) => {
    console.log('Nuevo reporte:', formData);
  };

  const handleReporteActualSubmit = (formData: any) => {
    console.log('Nuevo reporte actual:', formData);
  };

  const handleClienteSubmit = (formData: any) => {
    console.log('Nuevo cliente:', formData);
  };

  const handleServicioSubmit = (tipo: string, formData: any) => {
    console.log('Nuevo servicio:', tipo, formData);
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md p-6 mb-8`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Panel de Control</h2>
        <div className="flex space-x-2">
        </div>
      </div>


      <ResponsiveGridLayout
  className="layout"
  layouts={{ lg: layout }}
  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
  cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
  rowHeight={150} // Mantén un tamaño constante
  isDraggable={isEditMode}
  isResizable={isEditMode}
  onLayoutChange={handleLayoutChange}
  containerPadding={[0, 0]}
  useCSSTransforms={false} // Desactiva las transformaciones visuales
>
        <div key="proyeccionMes">
          <SmallWidget 
            title="Proyección del Mes" 
            value={`$${Math.abs(proyeccionMensual).toFixed(2)}`}
            icon={TrendingUp} 
            subtitle={`${proyeccionMensual >= 0 ? 'Ganancia' : 'Pérdida'} proyectada`}
          />
        </div>
        <div key="gastoMensual">
          <SmallWidget 
            title="Gasto Mensual" 
            value={`$${gastoMensual.toFixed(2)}`} 
            icon={DollarSign} 
            subtitle={`Gastos en ${new Date().toLocaleString('es-ES', { month: 'long' })}`} 
          />
        </div>
        <div key="planesVendidos">
          <SmallWidget title="Planes Vendidos" value="0" icon={FileText} subtitle="Total planes vendidos" />
        </div>
        <div key="clientesActuales">
        <SmallWidget
          title="Clientes Actuales"
          value={totalClientes.toString()}
          icon={Users}
          subtitle="Total clientes actuales"
        />
        </div>
        <div key="ingresoMensual">
          <SmallWidget 
            title="Ingreso Mensual" 
            value={`$${ingresoMensual.toFixed(2)}`} 
            icon={DollarSign} 
            subtitle={`Ingreso en ${new Date().toLocaleString('es-ES', { month: 'long' })}`} 
          />
        </div>
        <div key="ingresosTotales">
          <SmallWidget 
            title="Ingreso Total" 
            value={`$${ingresoTotal.toFixed(2)}`} 
            icon={DollarSign} 
            subtitle="Ingresos históricos en la plataforma" 
          />
        </div>
        <div key="margenGanancia">
          <SmallWidget title="Margen de Ganancia" value="0.00%" icon={PieChart} subtitle="Margen de ganancia" />
        </div>
        <div key="clientesNuevos">
        <SmallWidget
          title="Clientes Nuevos"
          value={clientesNuevos.toString()}
          icon={UserPlus}
          subtitle={`Clientes nuevos en ${new Date().toLocaleString('es-ES', { month: 'long' })}`}
        />
        </div>

        <div key="gastoWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <GastoWidget
            title="Gastos"
            isEditMode={isEditMode}
            onRemove={() => {}}
            onAddGasto={() => setIsGastoPopupOpen(true)} // Pasar función para abrir el popup
          />
        </div>
        <div key="alertasWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <AlertasWidget
              
            isEditMode={isEditMode}
            onRemove={() => {}}
          />
        </div>
        <div key="cuentaBancariaWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <CuentaBancariaWidget
            balances={balances}
            isEditMode={isEditMode}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
          />
        </div>
        <div key="cashflowWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden h-full p-4`}>
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
            setIsDocumentoPopupOpen={setIsDocumentoPopupOpen}
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
            setIsEscanearFacturaPopupOpen={setIsEscanearFacturaPopupOpen}
          />
        </div>
        <div key="serviciosWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <ServiciosWidget
          
            isEditMode={isEditMode}
            onRemove={() => {}}
            setIsServicioPopupOpen={setIsServicioPopupOpen} 
          />
        </div>
        <div key="bonosWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <BonosWidget
           
            isEditMode={isEditMode}
            onRemove={() => {}}
            setIsBonoPopupOpen={setIsBonoPopupOpen} // Pasamos la función aquí
          />
        </div>
        <div key="incomeChart" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <IncomeChartWidget />
        </div>
        <div key="recentSales" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <RecentSalesWidget />
        </div>
      </ResponsiveGridLayout>

      <ClientePopup isOpen={isClientePopupOpen} onClose={() => setIsClientePopupOpen(false)} onSubmit={() => {}} />
      <ServicioPopup isOpen={isServicioPopupOpen} onClose={() => setIsServicioPopupOpen(false)} onSubmit={() => {}} />
      <GastoPopup isOpen={isGastoPopupOpen} onClose={() => setIsGastoPopupOpen(false)} onSubmit={() => {}} />
      <FacturaPopup isOpen={isFacturaPopupOpen} onClose={() => setIsFacturaPopupOpen(false)} onSubmit={() => {}} />
      <EscanearFacturaPopup isOpen={isEscanearFacturaPopupOpen} onClose={() => setIsEscanearFacturaPopupOpen(false)} onSubmit={() => {}} />
      <DocumentoPopup isOpen={isDocumentoPopupOpen} onClose={() => setIsDocumentoPopupOpen(false)} onSubmit={() => {}} />
      <BonoPopup isOpen={isBonoPopupOpen} onClose={() => setIsBonoPopupOpen(false)} onSubmit={() => {}} />
      <ReportePopup isOpen={isReportePopupOpen} onClose={() => setIsReportePopupOpen(false)} onSubmit={() => {}} />
      <ReporteActualPopup isOpen={isReporteActualPopupOpen} onClose={() => setIsReporteActualPopupOpen(false)} onSubmit={() => {}} />
    </div>
  );
};

export default PanelDeControl;
