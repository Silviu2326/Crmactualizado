import React from 'react';
import { Gift, Star, TreePine, Bell, Snowflake, Sparkles } from 'lucide-react';
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

  // Animación de nieve
  const snowflakes = Array.from({ length: 50 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute text-[#E61D2B]/10"
      initial={{
        top: -20,
        left: `${Math.random() * 100}%`,
        scale: Math.random() * 0.5 + 0.5,
      }}
      animate={{
        top: '100%',
        left: `${Math.random() * 100}%`,
      }}
      transition={{
        duration: Math.random() * 5 + 5,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <Snowflake className="w-4 h-4" />
    </motion.div>
  ));

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative overflow-hidden"
    >
      {snowflakes}
      
      <motion.div variants={itemVariants} className="flex flex-col gap-2 mb-8 relative">
        <div className="flex items-center gap-3">
          <TreePine className="h-8 w-8 text-[#E61D2B]" />
          <h2 className="text-3xl font-bold text-[#E61D2B]">
            Panel de Control Navideño
          </h2>
          <TreePine className="h-8 w-8 text-[#E61D2B]" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          ¡Gestiona tus campañas navideñas con espíritu festivo! 🎄
        </p>
        <div className="h-1 w-20 bg-[#E61D2B] rounded-full" />
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Gift className="h-7 w-7 text-[#E61D2B]" />}
            label="Campañas Navideñas"
            value={stats.totalCampaigns}
            trend="+12.5%"
            trendUp={true}
            bgGradient="from-red-50 to-green-50"
            iconBg="bg-red-100"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Star className="h-7 w-7 text-[#E61D2B]" />}
            label="Suscriptores Festivos"
            value={stats.activeSubscribers}
            trend="+5.2%"
            trendUp={true}
            bgGradient="from-green-50 to-red-50"
            iconBg="bg-green-100"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Bell className="h-7 w-7 text-[#E61D2B]" />}
            label="Tasa de Alegría"
            value={`${stats.avgOpenRate}%`}
            trend="+2.1%"
            trendUp={true}
            bgGradient="from-red-50 to-green-50"
            iconBg="bg-red-100"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Sparkles className="h-7 w-7 text-[#E61D2B]" />}
            label="Regalos Automáticos"
            value={stats.automationRules}
            trend="+3"
            trendUp={true}
            bgGradient="from-green-50 to-red-50"
            iconBg="bg-green-100"
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-12 gap-8">
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 space-y-8">
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <TreePine className="w-6 h-6 text-[#E61D2B] animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Nueva Campaña Navideña</h3>
              <EmailCampaignForm />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <Star className="w-6 h-6 text-yellow-400 animate-spin-slow" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Campañas Festivas Activas</h3>
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
      <div className="absolute top-2 right-2">
        <Snowflake className="w-4 h-4 text-[#E61D2B]/20 animate-spin-slow" />
      </div>
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
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
              <div
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trendUp ? 'text-[#E61D2B]' : 'text-red-600'
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
