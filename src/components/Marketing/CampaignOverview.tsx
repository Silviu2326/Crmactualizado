import React from 'react';
import { BarChart2, Users, Bell, Settings, LineChart, Activity } from 'lucide-react';
import { CampaignList } from './CampaignList';
import { MetricsPanel } from './MetricsPanel';
import { QuickActions } from './QuickActions';
import { LeadsTable } from './LeadsTable';
import { EmailCampaignForm } from './EmailCampaignForm';
import { motion } from 'framer-motion';

export function CampaignOverview() {
  const stats = {
    totalCampaigns: 24,
    activeSubscribers: 1250,
    avgOpenRate: 32.5,
    automationRules: 8,
  };

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
      className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden"
    >
      <motion.div variants={itemVariants} className="flex flex-col gap-2 mb-8 relative">
        <div className="flex items-center gap-3">
          <BarChart2 className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Panel de Marketing
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona tus campañas y analiza el rendimiento en tiempo real
        </p>
        <div className="h-1 w-20 bg-blue-600 rounded-full" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<BarChart2 className="h-7 w-7 text-blue-600" />}
            label="Campañas Activas"
            value={stats.totalCampaigns}
            trend="+12.5%"
            trendUp={true}
            bgGradient="from-blue-50 to-indigo-50"
            iconBg="bg-blue-100"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Users className="h-7 w-7 text-indigo-600" />}
            label="Suscriptores Activos"
            value={stats.activeSubscribers}
            trend="+5.2%"
            trendUp={true}
            bgGradient="from-indigo-50 to-blue-50"
            iconBg="bg-indigo-100"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Activity className="h-7 w-7 text-blue-600" />}
            label="Tasa de Apertura"
            value={`${stats.avgOpenRate}%`}
            trend="+2.1%"
            trendUp={true}
            bgGradient="from-blue-50 to-indigo-50"
            iconBg="bg-blue-100"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Settings className="h-7 w-7 text-indigo-600" />}
            label="Reglas Automáticas"
            value={stats.automationRules}
            trend="+3"
            trendUp={true}
            bgGradient="from-indigo-50 to-blue-50"
            iconBg="bg-indigo-100"
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-12 gap-8">
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 space-y-8">
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <LineChart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Nueva Campaña</h3>
              <EmailCampaignForm />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Campañas Activas</h3>
              <CampaignList />
            </div>
          </motion.div>
          <LeadsTable />
        </motion.div>

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
      className={`rounded-xl shadow-sm p-6 transition-all duration-300 hover:scale-105 bg-gradient-to-br ${bgGradient} border border-white/50 hover:shadow-lg group relative overflow-hidden`}
    >
      <div className="flex items-center">
        <div
          className={`flex-shrink-0 p-3 rounded-xl ${iconBg} ring-4 ring-white/50 transition-transform duration-300 group-hover:rotate-12`}
        >
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
              {label}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {value}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  trendUp ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend}
              </span>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
