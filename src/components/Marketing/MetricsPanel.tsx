import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'Lun', openRate: 65, clickRate: 28, target: 45 },
  { name: 'Mar', openRate: 59, clickRate: 25, target: 45 },
  { name: 'Mié', openRate: 80, clickRate: 42, target: 45 },
  { name: 'Jue', openRate: 81, clickRate: 45, target: 45 },
  { name: 'Vie', openRate: 76, clickRate: 35, target: 45 },
  { name: 'Sáb', openRate: 55, clickRate: 20, target: 45 },
  { name: 'Dom', openRate: 66, clickRate: 30, target: 45 },
];

export function MetricsPanel() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Rendimiento</h3>
        <TrendingUp className="h-6 w-6 text-indigo-600" />
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="openRate" 
              stroke="#4F46E5" 
              strokeWidth={3}
              dot={{ fill: '#4F46E5', strokeWidth: 2 }}
              name="Tasa de Apertura"
            />
            <Line 
              type="monotone" 
              dataKey="clickRate" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2 }}
              name="Tasa de Clics"
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#6B7280" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Objetivo"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <MetricCard
          label="Tasa de Apertura"
          value="68.9%"
          trend="+5.2%"
          isPositive={true}
        />
        <MetricCard
          label="Tasa de Clics"
          value="32.1%"
          trend="+2.4%"
          isPositive={true}
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, isPositive }: { 
  label: string; 
  value: string; 
  trend: string; 
  isPositive: boolean;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:bg-gray-100">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      <p className={`mt-1 text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
        {trend}
      </p>
    </div>
  );
}