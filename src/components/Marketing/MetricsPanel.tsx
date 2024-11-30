import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

type MetricData = {
  name: string;
  openRate: number;
  clickRate: number;
  target: number;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function MetricsPanel() {
  const [data, setData] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
      }
      return token;
    };

    const fetchMetrics = async () => {
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
          throw new Error(errorData.message || 'Error al obtener métricas de email marketing.');
        }

        const apiData = await response.json();
        
        // Transform API data into the format we need
        const transformedData = apiData.dailyMetrics.map((metric: any) => ({
          name: metric.day,
          openRate: metric.openRate,
          clickRate: metric.clickRate,
          target: 45 // Mantenemos el objetivo fijo como en los datos de prueba
        }));
        
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        // Usar datos de respaldo en caso de error
        setData([
          { name: 'Lun', openRate: 0, clickRate: 0, target: 45 },
          { name: 'Mar', openRate: 0, clickRate: 0, target: 45 },
          { name: 'Mié', openRate: 0, clickRate: 0, target: 45 },
          { name: 'Jue', openRate: 0, clickRate: 0, target: 45 },
          { name: 'Vie', openRate: 0, clickRate: 0, target: 45 },
          { name: 'Sáb', openRate: 0, clickRate: 0, target: 45 },
          { name: 'Dom', openRate: 0, clickRate: 0, target: 45 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="h-72 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Rendimiento</h3>
            <p className="text-sm text-gray-600 mt-1">Últimos 7 días</p>
          </div>
          <TrendingUp className="h-6 w-6 text-indigo-600" />
        </div>

        <div className="h-72 -mx-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm font-medium text-gray-600">{value}</span>
                )}
              />
              <Line
                type="monotone"
                dataKey="openRate"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={{ fill: '#4F46E5', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
                name="Tasa de Apertura"
              />
              <Line
                type="monotone"
                dataKey="clickRate"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
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
            value={data.reduce((acc, current) => acc + current.openRate, 0) / data.length + '%'}
            trend="+5.2%"
            isPositive={true}
          />
          <MetricCard
            label="Tasa de Clics"
            value={data.reduce((acc, current) => acc + current.clickRate, 0) / data.length + '%'}
            trend="+2.4%"
            isPositive={true}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  trend,
  isPositive,
}: {
  label: string;
  value: string;
  trend: string;
  isPositive: boolean;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:bg-gray-100">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      <div className="mt-1 flex items-center gap-1">
        {isPositive ? (
          <ArrowUp className="h-4 w-4 text-emerald-600" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-600" />
        )}
        <p
          className={`text-sm font-medium ${
            isPositive ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {trend}
        </p>
      </div>
    </div>
  );
}