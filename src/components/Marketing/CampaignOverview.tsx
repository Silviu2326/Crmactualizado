import React, { useState, useEffect } from 'react';
import { Mail, Users, BarChart3, Zap } from 'lucide-react';
import { CampaignList } from './CampaignList';
import { MetricsPanel } from './MetricsPanel';
import { QuickActions } from './QuickActions';
import { LeadsTable } from './LeadsTable';
import { motion } from 'framer-motion';

export function CampaignOverview() {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeSubscribers: 0,
    subscribersTrend: '+0%',
    subscribersTrendUp: true,
    avgOpenRate: 0,
    openRateTrend: '+0%',
    openRateTrendUp: true,
    automationRules: 0,
    automationTrend: '+0',
    automationTrendUp: true,
    trend: '+0%',
    trendUp: true
  });

  useEffect(() => {
    const getToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
      }
      return token;
    };

    const fetchEmailStats = async () => {
      try {
        const token = getToken();
        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/email-marketing', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener estadísticas de email marketing.');
        }

        const data = await response.json();
        
        setStats(prevStats => ({
          ...prevStats,
          totalCampaigns: data.totalCampaigns || 0,
          trend: data.trend || '+0%',
          trendUp: data.trendDirection === 'up',
          avgOpenRate: data.openRate || 0,
          openRateTrend: data.openRateTrend || '+0%',
          openRateTrendUp: data.openRateTrendDirection === 'up'
        }));
      } catch (error) {
        console.error('Error al obtener estadísticas de email marketing:', error);
      }
    };

    const fetchSubscribers = async () => {
      try {
        const token = getToken();
        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/clientes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener datos de suscriptores.');
        }

        const data = await response.json();
        
        setStats(prevStats => ({
          ...prevStats,
          activeSubscribers: data.activos || 0,
          subscribersTrend: data.tendencia || '+0%',
          subscribersTrendUp: data.tendenciaDirection === 'up'
        }));
      } catch (error) {
        console.error('Error al obtener datos de suscriptores:', error);
      }
    };

    const fetchAutomaticRules = async () => {
      try {
        const token = getToken();
        const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/automatic-rules', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener reglas automáticas.');
        }

        const data = await response.json();
        
        setStats(prevStats => ({
          ...prevStats,
          automationRules: data.total || 0,
          automationTrend: data.tendencia ? `+${data.tendencia}` : '+0',
          automationTrendUp: data.tendenciaDirection === 'up'
        }));
      } catch (error) {
        console.error('Error al obtener reglas automáticas:', error);
      }
    };

    fetchEmailStats();
    fetchSubscribers();
    fetchAutomaticRules();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-2 mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">
          Panel de Control
        </h2>
        <p className="text-gray-600">
          Gestiona y monitoriza tus campañas de email marketing
        </p>
        <div className="h-1 w-20 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Mail className="h-7 w-7 text-indigo-600" />}
            label="Campañas Totales"
            value={stats.totalCampaigns}
            trend={stats.trend || '+0%'}
            trendUp={stats.trendUp}
            bgGradient="from-indigo-50 to-blue-50"
            iconBg="bg-indigo-100"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Users className="h-7 w-7 text-emerald-600" />}
            label="Suscriptores Activos"
            value={stats.activeSubscribers}
            trend={stats.subscribersTrend}
            trendUp={stats.subscribersTrendUp}
            bgGradient="from-emerald-50 to-green-50"
            iconBg="bg-emerald-100"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<BarChart3 className="h-7 w-7 text-violet-600" />}
            label="Tasa de Apertura"
            value={`${stats.avgOpenRate}%`}
            trend={stats.openRateTrend}
            trendUp={stats.openRateTrendUp}
            bgGradient="from-violet-50 to-purple-50"
            iconBg="bg-violet-100"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Zap className="h-7 w-7 text-amber-600" />}
            label="Reglas Automáticas"
            value={stats.automationRules}
            trend={stats.automationTrend}
            trendUp={stats.automationTrendUp}
            bgGradient="from-amber-50 to-yellow-50"
            iconBg="bg-amber-100"
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-12 gap-8">
        {/* Panel Principal - Ocupa 8 columnas */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 space-y-8">
          <CampaignList />
          <LeadsTable />
        </motion.div>

        {/* Panel Lateral - Ocupa 4 columnas */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4 space-y-8">
          <QuickActions />
          <MetricsPanel />
        </motion.div>
      </div>
    </motion.main>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
  trendUp,
  bgGradient,
  iconBg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  bgGradient: string;
  iconBg: string;
}) {
  return (
    <div
      className={`rounded-xl shadow-sm p-6 transition-all duration-300 hover:scale-105 bg-gradient-to-br ${bgGradient} border border-white/50 hover:shadow-lg group`}
    >
      <div className="flex items-center">
        <div
          className={`flex-shrink-0 p-3 rounded-xl ${iconBg} ring-4 ring-white/50 transition-transform duration-300 group-hover:rotate-12`}
        >
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-600 truncate">
              {label}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-bold text-gray-900">{value}</div>
              <div
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trendUp ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {trend}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
