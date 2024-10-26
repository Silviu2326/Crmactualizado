import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { 
  Phone, Mail, MapPin, Calendar as CalendarIcon, Activity, 
  DollarSign, Clock, Target, Award, ChevronDown,
  Dumbbell, Heart, Scale, User, CreditCard,
  Clipboard, CalendarCheck, Ruler, Brain,
  Wallet, Receipt, TrendingUp, FileText,
  StickyNote, LayoutDashboard, Users, BarChart,
  Apple, Coffee, Utensils, Salad
} from 'lucide-react';
import Button from '../common/Button';
import StatCard from './StatCard';
import InfoCard from './InfoCard';
import Notes from './Notes';
import ClientCalendar from './Calendar';

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
  cliente: Cliente;
  onClose: () => void;
}

const PanelCliente: React.FC<PanelClienteProps> = ({ cliente, onClose }) => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  const handleViewPlan = () => {
    console.log('View training plan');
  };

  const handleNewCheckin = () => {
    console.log('New check-in');
  };

  const handlePayment = () => {
    console.log('Process payment');
  };

  const handleDietPlan = () => {
    console.log('View diet plan');
  };

  const navigationButtons = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'plan', icon: Dumbbell, label: 'Plan' },
    { id: 'checkins', icon: BarChart, label: 'Check-ins' },
    { id: 'personal', icon: Users, label: 'Personal' },
    { id: 'finances', icon: Wallet, label: 'Finanzas' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`
        w-full overflow-hidden rounded-2xl
        ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-gray-50/95'}
        backdrop-blur-lg shadow-2xl
        border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}
      `}
    >
      <div className="h-[85vh] overflow-y-auto custom-scrollbar">
        <div className="p-8">
          {/* Header Section */}
          <div className="sticky top-0 z-10 backdrop-blur-md bg-opacity-90 mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-start">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                <div className={`
                  p-4 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-110
                  ${theme === 'dark' ? 'bg-gray-800 shadow-gray-900/50' : 'bg-white shadow-gray-200/50'}
                  bg-gradient-shine
                `}>
                  <User className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
                  >
                    {cliente.nombre}
                  </motion.h3>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2"
                  >
                    <span className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-blue-500" />
                      {cliente.email}
                    </span>
                    <span className="flex items-center text-sm">
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

            {/* Navigation Buttons */}
            <div className="flex flex-wrap gap-2 mt-6">
              {navigationButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <Button
                    key={button.id}
                    variant="normal"
                    onClick={() => setActiveSection(button.id as Section)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg
                      ${activeSection === button.id
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/25'
                        : theme === 'dark'
                        ? 'bg-gray-800 hover:bg-gray-700'
                        : 'bg-white hover:bg-gray-100'
                      }
                      transition-all duration-300 hover:scale-105
                      shadow-lg hover:shadow-xl
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{button.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Ruler}
              title="Altura"
              value={cliente.altura}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              delay={0.2}
            />
            <StatCard
              icon={Scale}
              title="Peso Actual"
              value={cliente.peso}
              color="bg-gradient-to-br from-green-500 to-green-600"
              delay={0.3}
            />
            <StatCard
              icon={Target}
              title="Progreso General"
              value={`${cliente.progreso}%`}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
              delay={0.4}
            />
            <StatCard
              icon={CalendarCheck}
              title="Check-ins"
              value="8/12"
              color="bg-gradient-to-br from-orange-500 to-orange-600"
              delay={0.5}
            />
          </div>

          {/* Calendar and Notes Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <ClientCalendar />
            <div className="lg:col-span-2">
              <Notes />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Planificación Deportiva */}
            <InfoCard
              title="Planificación Deportiva"
              delay={0.6}
              items={[
                { icon: Dumbbell, text: `Plan: ${cliente.planActual}` },
                { icon: Target, text: `Objetivo: ${cliente.objetivo}` },
                { icon: CalendarIcon, text: `Próxima sesión: ${cliente.proximaCita}` },
                { icon: Activity, text: "Progreso semanal: 85%" }
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
                { icon: CalendarCheck, text: "Último check-in: 05/03/2024" },
                { icon: Scale, text: "Peso actual vs anterior: -0.5kg" },
                { icon: TrendingUp, text: "Progreso mensual: +12%" },
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
                { icon: Scale, text: `Peso inicial: 68kg` },
                { icon: Target, text: "Peso objetivo: 62kg" },
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
        </div>
      </div>
    </motion.div>
  );
};

export default PanelCliente;