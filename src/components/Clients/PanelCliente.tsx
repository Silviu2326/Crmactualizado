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
  Apple, Coffee, Utensils, Salad
} from 'lucide-react';
import Button from '../Common/Button';
import InfoCard from './InfoCard';
import Notes from './Notes';
import ClientCalendar from './Calendar';
import axios from 'axios';

type Section = 'dashboard' | 'plan' | 'checkins' | 'personal' | 'finances';

interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  estado: string;
  direccion: string;
  fechaInicio: string;
  objetivo: string;
  peso: string;
  altura: string;
  imc: number;
  ultimaVisita: string;
  proximaCita: string;
  planActual: string;
  progreso: number;
  pagosAlDia: boolean;
}

interface PanelClienteProps {
  clienteId: string;
  onClose: () => void;
}

const API_URL = 'http://localhost:3000/api';

const PanelCliente: React.FC<PanelClienteProps> = ({ clienteId, onClose }) => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await axios.get(`${API_URL}/clientes/${clienteId}`);
        setCliente(response.data);
      } catch (error) {
        console.error('Error al obtener el cliente:', error);
        setError('Error al obtener el cliente');
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [clienteId]);

  const handleViewPlan = () => {
    console.log('Ver plan de entrenamiento');
  };

  const handleNewCheckin = () => {
    console.log('Nuevo check-in');
  };

  const handlePayment = () => {
    console.log('Procesar pago');
  };

  const handleDietPlan = () => {
    console.log('Ver plan nutricional');
  };

  const navigationButtons = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'plan', icon: Dumbbell, label: 'Plan' },
    { id: 'checkins', icon: BarChart, label: 'Check-ins' },
    { id: 'personal', icon: Users, label: 'Personal' },
    { id: 'finances', icon: Wallet, label: 'Finanzas' },
  ];

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
            {/* Planificación Deportiva */}
            <InfoCard
              title="Planificación Deportiva"
              delay={0.6}
              items={[
                { icon: Dumbbell, text: `Plan: ${cliente.planActual}` },
                { icon: Target, text: `Objetivo: ${cliente.objetivo}` },
                { icon: CalendarIcon, text: `Próxima sesión: ${cliente.proximaCita}` },
                { icon: Activity, text: `Progreso semanal: ${cliente.progreso}%` }
              ]}
              actionButton={{
                icon: Dumbbell,
                label: "Ver Plan Completo",
                onClick: handleViewPlan
              }}
            />

            {/* Check-ins */}
            <InfoCard
              title="Check-ins Recientes"
              delay={0.7}
              items={[
                { icon: CalendarCheck, text: `Último check-in: ${cliente.ultimaVisita}` },
                { icon: Scale, text: `Peso actual: ${cliente.peso}` },
                { icon: TrendingUp, text: `Progreso mensual: ${cliente.progreso}%` },
                { icon: Brain, text: "Estado anímico: Excelente" }
              ]}
              actionButton={{
                icon: Clipboard,
                label: "Nuevo Check-in",
                onClick: handleNewCheckin
              }}
            />

            {/* Plan Nutricional */}
            <InfoCard
              title="Plan Nutricional"
              delay={0.8}
              items={[
                { icon: Apple, text: "Calorías diarias: 2200 kcal" },
                { icon: Utensils, text: "Comidas: 5 al día" },
                { icon: Coffee, text: "Último registro: Desayuno" },
                { icon: Salad, text: "Adherencia: 90%" }
              ]}
              actionButton={{
                icon: FileText,
                label: "Ver Plan Nutricional",
                onClick: handleDietPlan
              }}
            />

            {/* Información Personal */}
            <InfoCard
              title="Información Personal"
              delay={0.9}
              items={[
                { icon: MapPin, text: cliente.direccion },
                { icon: CalendarIcon, text: `Cliente desde: ${cliente.fechaInicio}` },
                { icon: Clock, text: `Última visita: ${cliente.ultimaVisita}` },
                { icon: Heart, text: `Estado: ${cliente.estado}` }
              ]}
            />

            {/* Información Física */}
            <InfoCard
              title="Información Física"
              delay={1.0}
              items={[
                { icon: Ruler, text: `Altura: ${cliente.altura}` },
                { icon: Scale, text: `Peso actual: ${cliente.peso}` },
                { icon: Target, text: `IMC: ${cliente.imc}` },
                { icon: Activity, text: "Nivel de actividad: Alto" }
              ]}
            />

            {/* Finanzas y Pagos */}
            <InfoCard
              title="Finanzas y Pagos"
              delay={1.1}
              items={[
                { icon: Wallet, text: `Estado: ${cliente.pagosAlDia ? 'Al día' : 'Pendiente'}` },
                { icon: Receipt, text: "Último pago: 01/03/2024" },
                { icon: CreditCard, text: "Plan: Mensual Premium" },
                { icon: DollarSign, text: "Próximo pago: 01/04/2024" }
              ]}
              actionButton={{
                icon: CreditCard,
                label: "Realizar Pago",
                onClick: handlePayment
              }}
            />
          </div>

          {/* Sección de Calendario y Notas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2">
              <ClientCalendar />
            </div>
            <Notes />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PanelCliente;
