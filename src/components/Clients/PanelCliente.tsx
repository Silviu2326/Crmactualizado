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
  AlertCircle, MessageCircle
} from 'lucide-react';
import Button from '../Common/Button';
import InfoCard from './InfoCard';
import Notes from './Notes';
import ClientCalendar from './Calendar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PanelPlan from './PanelPlan';
import PanelProgreso from './PanelProgreso';
import PanelFinanzas from './PanelFinanzas';
import PanelDietas from './PanelDietas';
import PanelPersonal from './PanelPersonal';
import PanelChat from './PanelChat';
import PanelAgenda from './PanelAgenda';

type Section = 'dashboard' | 'plan' | 'progreso' | 'dietas' | 'finances' | 'personal' | 'chat' | 'agenda';

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
  const [planningDetails, setPlanningDetails] = useState<{
    nombre: string;
    descripcion: string;
    meta: string;
    semanas: number;
    fechaInicio: string;
  } | null>(null);
  const [dietDetails, setDietDetails] = useState<{
    nombre: string;
    objetivo: string;
    restricciones: string;
    estado: string;
    fechaInicio: string;
    semanas: Array<any>;
  } | null>(null);
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

        // Fetch planning details if plannings array is not empty
        if (response.data.plannings && response.data.plannings.length > 0) {
          const planningId = response.data.plannings[0];
          try {
            const planningResponse = await axios.get(`${API_URL}/plannings/${planningId}`, config);
            setPlanningDetails({
              nombre: planningResponse.data.nombre,
              descripcion: planningResponse.data.descripcion,
              meta: planningResponse.data.meta,
              semanas: planningResponse.data.semanas,
              fechaInicio: planningResponse.data.fechaInicio
            });
          } catch (planningError) {
            console.error('Error al obtener los detalles del planning:', planningError);
          }
        } else {
          setPlanningDetails(null);
        }

        // Fetch diet details if dietas array is not empty
        if (response.data.dietas && response.data.dietas.length > 0) {
          const dietaId = response.data.dietas[0];
          try {
            const dietaResponse = await axios.get(`${API_URL}/dietas/${dietaId}`, config);
            setDietDetails({
              nombre: dietaResponse.data.nombre,
              objetivo: dietaResponse.data.objetivo,
              restricciones: dietaResponse.data.restricciones,
              estado: dietaResponse.data.estado,
              fechaInicio: dietaResponse.data.fechaInicio,
              semanas: dietaResponse.data.semanas
            });
          } catch (dietaError) {
            console.error('Error al obtener los detalles de la dieta:', dietaError);
          }
        } else {
          setDietDetails(null);
        }
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

  // Add this effect outside the render
  React.useEffect(() => {
    // If current section is disabled, switch to dashboard
    const isCurrentSectionDisabled = 
      (activeSection === 'plan' && !planningDetails) || 
      (activeSection === 'dietas' && !dietDetails);

    if (isCurrentSectionDisabled) {
      setActiveSection('dashboard');
    }
  }, [activeSection, planningDetails, dietDetails]);

  // Handlers
  const handleCreatePlan = () => {
    console.log('Crear nuevo plan para el cliente:', cliente?._id);
  };

  const handleViewPlan = () => {
    if (cliente?.plannings && cliente.plannings.length > 0) {
      const planningId = cliente.plannings[0];
      navigate(`/edit-planning/${planningId}`);
    }
  };

  const handleNewCheckin = () => {
    console.log('Nuevo check-in para el cliente:', cliente?._id);
  };

  const handleCreateDiet = () => {
    console.log('Crear nueva dieta para el cliente:', cliente?._id);
  };

  const handleViewDiet = () => {
    if (cliente?.dietas && cliente.dietas.length > 0) {
      const dietaId = cliente.dietas[0];
      navigate(`/edit-diet/${dietaId}`);
    }
  };

  const handleNewPayment = () => {
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
    { id: 'progreso', icon: TrendingUp, label: 'Progreso' },
    { id: 'dietas', icon: Utensils, label: 'Dietas' },
    { id: 'finances', icon: Wallet, label: 'Finanzas' },
    { id: 'personal', icon: User, label: 'Personal' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'agenda', icon: CalendarIcon, label: 'Agenda' },
  ];

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
                  variant="ghost"
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
                // Check if button should be disabled
                const isDisabled = (button.id === 'plan' && !planningDetails) || 
                                 (button.id === 'dietas' && !dietDetails);

                return (
                  <Button
                    key={button.id}
                    variant={activeSection === button.id ? 'default' : 'ghost'}
                    onClick={() => !isDisabled && setActiveSection(button.id as Section)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-full
                      ${activeSection === button.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                      ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'transition-all duration-300'}
                    `}
                    disabled={isDisabled}
                  >
                    <Icon className="w-4 h-4" />
                    <span>
                      {button.label}
                      {isDisabled && ' (Bloqueado)'}
                    </span>
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
                  titleButton={!planningDetails ? {
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
                      text: planningDetails ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <span className="font-semibold">Nombre:</span>
                            <span className="text-green-500">{planningDetails.nombre}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold">Descripción:</span>
                            <span>{planningDetails.descripcion}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold">Meta:</span>
                            <span>{planningDetails.meta}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold">Semanas:</span>
                            <span>{planningDetails.semanas}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold">Fecha inicio:</span>
                            <span>{formatearFecha(planningDetails.fechaInicio)}</span>
                          </div>
                        </div>
                      ) : "Sin plan activo"
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
                  titleButton={!dietDetails ? {
                    icon: Plus,
                    label: "Añadir dieta",
                    onClick: handleCreateDiet,
                    className: "btn-success btn-sm"
                  } : {
                    icon: Eye,
                    label: "Ver dieta",
                    onClick: handleViewDiet,
                    className: "btn-primary btn-sm"
                  }}
                  items={[
                    { 
                      icon: Apple,
                      text: dietDetails ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <span className="font-semibold">Nombre:</span>
                            <span className="text-green-500">{dietDetails.nombre}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold">Objetivo:</span>
                            <span>{dietDetails.objetivo}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold">Restricciones:</span>
                            <span>{dietDetails.restricciones}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold">Estado:</span>
                            <span className={dietDetails.estado === 'activa' ? 'text-green-500' : 'text-yellow-500'}>
                              {dietDetails.estado}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold">Fecha inicio:</span>
                            <span>{formatearFecha(dietDetails.fechaInicio)}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-semibold">Semanas:</span>
                            <span>{dietDetails.semanas.length}</span>
                          </div>
                        </div>
                      ) : "Sin dieta activa"
                    }
                  ]}
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
            ) : activeSection === 'plan' && planningDetails ? (
              <div className="col-span-2">
                <PanelPlan 
                  clienteId={clienteId} 
                  planningDetails={planningDetails}
                />
              </div>
            ) : activeSection === 'progreso' ? (
              <div className="col-span-2">
                <PanelProgreso clienteId={clienteId} />
              </div>
            ) : activeSection === 'finances' ? (
              <div className="col-span-2">
                <PanelFinanzas cliente={cliente} />
              </div>
            ) : activeSection === 'dietas' && dietDetails ? (
              <div className="col-span-2">
                <PanelDietas 
                  clienteId={clienteId} 
                  dietDetails={dietDetails}
                />
              </div>
            ) : activeSection === 'personal' ? (
              <div className="col-span-2">
                <PanelPersonal cliente={cliente} onEdit={() => console.log('Editar información personal')} />
              </div>
            ) : activeSection === 'chat' ? (
              <div className="col-span-2">
                <PanelChat clienteId={clienteId} clienteName={cliente.nombre} />
              </div>
            ) : activeSection === 'agenda' ? (
              <div className="col-span-2">
                <PanelAgenda clienteId={clienteId} />
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
