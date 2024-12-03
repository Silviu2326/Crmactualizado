import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  Phone, Mail, MapPin, Calendar as CalendarIcon, Activity,
  DollarSign, Clock, Target, ChevronDown,
  Dumbbell, Heart, Scale, User, CreditCard,
  Clipboard, CalendarCheck, Ruler, Brain,
  Wallet, Receipt, TrendingUp, FileText,
  LayoutDashboard, Users, BarChart,
  Apple, Coffee, Utensils, Salad, Plus, Edit2, Pencil, X, Eye,
  AlertCircle
} from 'lucide-react';
import Button from '../Common/Button';
import InfoCard from './InfoCard';
import Notes from './Notes';
import ClientCalendar from './Calendar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PanelPlan from './PanelPlan';
import PanelCheckins from './PanelCheckins';
import PanelFinanzas from './PanelFinanzas';
import PanelDietas from './PanelDietas';

type Section = 'dashboard' | 'plan' | 'checkins' | 'dietas' | 'finances';

interface Nota {
  texto: string;
  fechaCreacion: string;
  version: number;
  categoria: string;
  _id: string;
}

interface Direccion {
  calle: string;
  numero?: string;
  piso?: string;
  codigoPostal?: string;
  ciudad: string;
  provincia: string;
}

interface PlanActivo {
  _id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  meta: string;
  semanas: number;
}

interface DietaActiva {
  _id: string;
  nombre: string;
  objetivo: string;
  restricciones: string;
  estado: string;
  fechaInicio: string;
  fechaComienzo: string;
  semanas: Array<{
    idSemana: number;
    fechaInicio: string;
    dias: Array<{
      restricciones: {
        calorias: number;
        proteinas: number;
        carbohidratos: number;
        grasas: number;
      };
      fecha: string;
      comidas: Array<{
        numero: number;
        peso: number;
        ingredientes: Array<{
          nombre: string;
          calorias: number;
          proteinas: number;
          carbohidratos: number;
          grasas: number;
        }>;
      }>;
    }>;
  }>;
}

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo' | 'Pendiente' | 'Suspendido';
  direccion: Direccion;
  fechaInicio: string;
  objetivo: string;
  ultimaVisita: string;
  proximaCita: string;
  planActual: string;
  progreso: number;
  pagosAlDia: boolean;
  notas: Nota[];
  planesDePago: any[];
  transacciones: any[];
  trainer: string;
  fechaRegistro: string;
  servicios: string[];
  altura?: number;
  peso?: number;
  nivelActividad?: 'Bajo' | 'Moderado' | 'Alto';
  planningActivo?: PlanActivo;
  dietaActiva?: DietaActiva;
}

interface PanelClienteProps {
  clienteId: string;
  onClose: () => void;
}

const API_URL = 'https://fitoffice2-f70b52bef77e.herokuapp.com/api';

const PanelCliente: React.FC<PanelClienteProps> = ({ clienteId, onClose }) => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editandoDireccion, setEditandoDireccion] = useState(false);
  const [direccionForm, setDireccionForm] = useState<Direccion>({
    calle: cliente?.direccion?.calle || '',
    numero: cliente?.direccion?.numero || '',
    piso: cliente?.direccion?.piso || '',
    codigoPostal: cliente?.direccion?.codigoPostal || '',
    ciudad: cliente?.direccion?.ciudad || '',
    provincia: cliente?.direccion?.provincia || ''
  });
  const [editandoEstado, setEditandoEstado] = useState(false);
  const estadosPosibles: ('Activo' | 'Inactivo' | 'Pendiente' | 'Suspendido')[] = ['Activo', 'Inactivo', 'Pendiente', 'Suspendido'];
  const [editandoFisica, setEditandoFisica] = useState(false);
  const [datosForm, setDatosForm] = useState({
    altura: cliente?.altura || '',
    peso: cliente?.peso || '',
    nivelActividad: cliente?.nivelActividad || 'Moderado'
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCliente = async () => {
      console.log('Iniciando fetchCliente con clienteId:', clienteId);
      try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        console.log('Token obtenido:', token ? 'Token presente' : 'Token no encontrado');

        if (!clienteId) {
          console.error('ClienteId es undefined');
          setError('ID de cliente no válido');
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        console.log('Realizando petición a:', `${API_URL}/clientes/${clienteId}`);
        const response = await axios.get(`${API_URL}/clientes/${clienteId}`, config);
        console.log('Respuesta recibida:', response.data);
        setCliente(response.data);
      } catch (error: any) {
        console.error('Error detallado al obtener el cliente:', {
          mensaje: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        setError('Error al obtener el cliente');
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [clienteId]);

  // Handlers
  const handleCreatePlan = () => {
    // Aquí implementaremos la lógica para crear un nuevo plan
    console.log('Crear nuevo plan para el cliente:', cliente?._id);
  };

  const handleViewPlan = () => {
    // Aquí implementaremos la lógica para ver un plan
    console.log('Ver plan para el cliente:', cliente?._id);
  };

  const handleNewCheckin = () => {
    // Aquí implementaremos la lógica para un nuevo check-in
    console.log('Nuevo check-in para el cliente:', cliente?._id);
  };

  const handleCreateDiet = () => {
    // Aquí implementaremos la lógica para crear una nueva dieta
    console.log('Crear nueva dieta para el cliente:', cliente?._id);
  };

  const handleViewDiet = () => {
    // Aquí implementaremos la lógica para ver una dieta
    console.log('Ver dieta para el cliente:', cliente?._id);
  };

  const handleNewPayment = () => {
    // Aquí implementaremos la lógica para un nuevo pago
    console.log('Nuevo pago para el cliente:', cliente?._id);
  };

  const handleAddNote = async (note: Omit<Nota, '_id'>) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(`${API_URL}/clientes/${clienteId}/notas`, note, config);
      // Usar directamente la nota del backend
      const nuevaNota = response.data.data;
      
      setCliente(prevCliente => ({
        ...prevCliente!,
        notas: [nuevaNota, ...prevCliente!.notas]
      }));
    } catch (error) {
      console.error('Error al agregar nota:', error);
    }
  };

  const handleEditNote = async (id: string, note: Partial<Nota>) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.put(`${API_URL}/clientes/${clienteId}/notas/${id}`, note, config);
      setCliente(prevCliente => ({
        ...prevCliente!,
        notas: prevCliente!.notas.map(n => n._id === id ? { ...n, ...note } : n)
      }));
    } catch (error) {
      console.error('Error al editar nota:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.delete(`${API_URL}/clientes/${clienteId}/notas/${id}`, config);
      setCliente(prevCliente => ({
        ...prevCliente!,
        notas: prevCliente!.notas.filter(n => n._id !== id)
      }));
    } catch (error) {
      console.error('Error al eliminar nota:', error);
    }
  };

  const handleUpdateFisica = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_URL}/clientes/${cliente?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          altura: Number(datosForm.altura),
          peso: Number(datosForm.peso),
          nivelActividad: datosForm.nivelActividad
        })
      });

      if (!response.ok) throw new Error('Error al actualizar los datos físicos');

      setCliente(cliente => cliente ? {
        ...cliente,
        altura: Number(datosForm.altura),
        peso: Number(datosForm.peso),
        nivelActividad: datosForm.nivelActividad
      } : null);
      
      setEditandoFisica(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateDireccion = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_URL}/clientes/${cliente?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ direccion: direccionForm })
      });

      if (!response.ok) throw new Error('Error al actualizar la dirección');

      setCliente(cliente => cliente ? { ...cliente, direccion: direccionForm } : null);
      setEditandoDireccion(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateEstado = async (nuevoEstado: 'Activo' | 'Inactivo' | 'Pendiente' | 'Suspendido') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch(`${API_URL}/clientes/${cliente?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) throw new Error('Error al actualizar el estado');

      setCliente(cliente => cliente ? { ...cliente, estado: nuevoEstado } : null);
      setEditandoEstado(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const navigationButtons = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'plan', icon: Dumbbell, label: 'Plan' },
    { id: 'checkins', icon: BarChart, label: 'Check-ins' },
    { id: 'dietas', icon: Utensils, label: 'Dietas' },
    { id: 'finances', icon: Wallet, label: 'Finanzas' },
  ];

  // Función para formatear la fecha en español
  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) {
        console.error('Fecha inválida:', fecha);
        return 'Fecha inválida';
      }
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return <div>Cargando datos del cliente...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!cliente) {
    return <div>No se encontró el cliente.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`
        w-full overflow-hidden rounded-3xl
        ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
        shadow-2xl
        border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
      `}
    >
      <div className="h-[85vh] overflow-y-auto custom-scrollbar">
        <div className="p-8">
          {/* Encabezado */}
          <div className={`sticky top-0 z-10 backdrop-blur-md bg-opacity-90 mb-8 pb-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                <div className={`
                  p-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105
                  ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
                `}>
                  <User className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-gray-800 dark:text-white"
                  >
                    {cliente.nombre}
                  </motion.h3>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2"
                  >
                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      {cliente.email}
                    </span>
                    <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4 mr-2 text-green-500" />
                      {cliente.telefono}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Button
                  variant="normal"
                  onClick={onClose}
                  className="hover:rotate-180 transition-transform duration-300"
                >
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>

            {/* Navegación */}
            <div className="flex flex-wrap gap-2 mt-6">
              {navigationButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <Button
                    key={button.id}
                    variant="normal"
                    onClick={() => setActiveSection(button.id as Section)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-full
                      ${activeSection === button.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                      transition-all duration-300
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{button.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeSection === 'dashboard' ? (
              <>
                {/* Planificación Deportiva */}
                <InfoCard
                  title="Planificación Deportiva"
                  delay={0.8}
                  titleButton={!cliente.planningActivo ? {
                    icon: Plus,
                    label: "Añadir planificación",
                    onClick: handleCreatePlan,
                    className: "btn-success btn-sm"
                  } : {
                    icon: Eye,
                    label: "Ver planificación",
                    onClick: handleViewPlan,
                    className: "btn-primary btn-sm"
                  }}
                  items={[
                    { 
                      icon: Target,
                      text: cliente.planningActivo ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-2">
                            <span className="font-semibold">Plan actual:</span>
                            <span>{cliente.planningActivo.nombre}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold">Meta:</span>
                            <span>{cliente.planningActivo.meta}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold">Duración:</span>
                            <span>{cliente.planningActivo.semanas} {cliente.planningActivo.semanas === 1 ? 'semana' : 'semanas'}</span>
                          </div>
                        </div>
                      ) : 'Sin plan activo'
                    }
                  ]}
                />

                {/* Check-ins */}
                <InfoCard
                  title="Check-ins Recientes"
                  delay={0.7}
                  items={
                    cliente.planActual ? [
                      { icon: CalendarCheck, text: `Último check-in: ${cliente.ultimaVisita}` },
                      { icon: Scale, text: `Peso actual: ${cliente.peso}` },
                      { icon: TrendingUp, text: `Progreso mensual: ${cliente.progreso}%` },
                      { icon: Brain, text: "Estado anímico: Excelente" }
                    ] : [
                      { icon: Dumbbell, text: "Antes de registrar check-ins," },
                      { icon: Target, text: "necesitas crear una planificación" },
                      { icon: Activity, text: "deportiva para este cliente." }
                    ]
                  }
                  actionButton={cliente.planActual ? {
                    icon: Clipboard,
                    label: "Nuevo Check-in",
                    onClick: handleNewCheckin
                  } : undefined}
                />

                {/* Plan Nutricional */}
                <InfoCard
                  title="Plan Nutricional"
                  delay={0.6}
                  items={
                    cliente.dietaActiva ? [
                      { icon: Apple, text: `Objetivo: ${cliente.dietaActiva.objetivo}` },
                      { icon: Coffee, text: `Restricciones: ${cliente.dietaActiva.restricciones}` },
                      { icon: Utensils, text: `Estado: ${cliente.dietaActiva.estado}` },
                      { icon: Salad, text: `Inicio: ${formatearFecha(cliente.dietaActiva.fechaInicio)}` }
                    ] : [
                      { icon: Apple, text: "No hay plan nutricional activo." },
                      { icon: Utensils, text: "Crea uno nuevo para comenzar" },
                      { icon: Salad, text: "el seguimiento nutricional." }
                    ]
                  }
                  titleButton={!cliente.dietaActiva ? {
                    icon: Plus,
                    label: "Añadir plan",
                    onClick: handleCreateDiet,
                    className: "btn-success btn-sm"
                  } : {
                    icon: Eye,
                    label: "Ver plan",
                    onClick: handleViewDiet,
                    className: "btn-primary btn-sm"
                  }}
                />

                {/* Pagos */}
                <InfoCard
                  title="Estado de Pagos"
                  delay={0.5}
                  items={[
                    { icon: Receipt, text: `Último pago: ${cliente.ultimoPago || 'No hay pagos registrados'}` },
                    { icon: CreditCard, text: `Plan actual: ${cliente.planActual || 'Sin plan'}` },
                    { icon: Clock, text: `Próximo pago: ${cliente.proximoPago || 'No programado'}` },
                    { icon: AlertCircle, text: cliente.pagosAlDia ? 'Pagos al día' : 'Pagos pendientes' }
                  ]}
                  actionButton={{
                    icon: DollarSign,
                    label: "Registrar Pago",
                    onClick: handleNewPayment
                  }}
                />
              </>
            ) : activeSection === 'plan' ? (
              <div className="col-span-2">
                <PanelPlan clienteId={clienteId} />
              </div>
            ) : activeSection === 'checkins' ? (
              <div className="col-span-2">
                <PanelCheckins clienteId={clienteId} />
              </div>
            ) : activeSection === 'finances' ? (
              <div className="col-span-2">
                <PanelFinanzas clienteId={clienteId} />
              </div>
            ) : activeSection === 'dietas' ? (
              <div className="col-span-2">
                <PanelDietas clienteId={clienteId} />
              </div>
            ) : null}
          </div>

          {/* Notas */}
          {activeSection === 'dashboard' && (
            <Notes
              notas={cliente.notas}
              onAddNote={handleAddNote}
              onUpdateNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {/* Calendario */}
          {activeSection === 'dashboard' && (
            <ClientCalendar clientId={clienteId} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PanelCliente;
