import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, PieChart, Users } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import MetricCard from '../Planes/MetricCard';
import IngresoGrafico from './IngresoGrafico';
import IngresosTabla from './IngresosTabla';
import GraficoCashflow from './GraficoCashflow';
import GastoWidget from './GastoWidget';

interface Gasto {
  _id: string;
  entrenador: string;
  concepto: string;
  fecha: string;
  estado: string;
  importe: number;
  tipoDeGasto: string;
  descripcion: string;
}

interface Ingreso {
  _id: string;
  entrenador: string;
  monto: number;
  moneda: string;
  fecha: string;
  descripcion: string;
}

const CashflowPage: React.FC = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalGastos, setTotalGastos] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    const fetchGastos = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
        }

        const response = await fetch('http://localhost:3000/api/gastos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener los gastos.');
        }

        const data: any[] = await response.json();
        console.log('Datos crudos de gastos:', data);
        
        data.forEach((gasto, index) => {
          console.log(`Gasto ${index + 1}:`, {
            monto: gasto.monto,
            importe: gasto.importe,
            categoria: gasto.categoria,
            fecha: gasto.fecha,
            descripcion: gasto.descripcion
          });
        });
        
        const total = data.reduce((sum, gasto) => {
          const valor = gasto.monto || gasto.importe || 0;
          console.log('Sumando gasto:', valor);
          return sum + valor;
        }, 0);
        
        console.log('Total gastos calculado:', total);
        setTotalGastos(total);
      } catch (err: any) {
        console.error('Error al obtener gastos:', err);
        setError(err.message || 'Error desconocido.');
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, []);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
        }

        const response = await fetch('http://localhost:3000/api/ingresos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los ingresos.');
        }

        const data: Ingreso[] = await response.json();
        console.log('Datos crudos de ingresos:', data);

        const total = data.reduce((sum, ingreso) => {
          console.log('Sumando ingreso:', ingreso.monto);
          return sum + (ingreso.monto || 0);
        }, 0);

        console.log('Total ingresos calculado:', total);
        setTotalIngresos(total);
      } catch (err: any) {
        console.error('Error al obtener ingresos:', err);
      }
    };

    fetchIngresos();
  }, []);

  const calcularMargenGanancia = () => {
    if (totalIngresos === 0) return 0;
    return ((totalIngresos - totalGastos) / totalIngresos) * 100;
  };

  const metricData = [
    { 
      title: "Proyección del mes", 
      value: loading ? "Cargando..." : `$${(totalIngresos * 1.1).toLocaleString()}`, 
      icon: <TrendingUp className="w-6 h-6 text-green-500" />, 
      change: "↑ 10%" 
    },
    { 
      title: "Gasto Mensual", 
      value: loading ? "Cargando..." : error ? "Error" : `$${totalGastos.toLocaleString()}`, 
      icon: <DollarSign className="w-6 h-6 text-red-500" />, 
      change: totalGastos > 0 ? "↑" : "↓" 
    },
    { 
      title: "Beneficio neto", 
      value: loading ? "Cargando..." : `$${(totalIngresos - totalGastos).toLocaleString()}`, 
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />, 
      change: totalIngresos - totalGastos > 0 ? "↑" : "↓" 
    },
    { 
      title: "Ingresos", 
      value: loading ? "Cargando..." : `$${totalIngresos.toLocaleString()}`, 
      icon: <DollarSign className="w-6 h-6 text-green-500" />, 
      change: totalIngresos > 0 ? "↑" : "↓" 
    },
    { 
      title: "Margen de ganancia", 
      value: loading ? "Cargando..." : `${calcularMargenGanancia().toFixed(2)}%`, 
      icon: <PieChart className="w-6 h-6 text-purple-500" />, 
      change: calcularMargenGanancia() > 0 ? "↑" : "↓" 
    },
    { 
      title: "Clientes Nuevos (este mes)", 
      value: "25", 
      icon: <Users className="w-6 h-6 text-yellow-500" />, 
      change: "↑ 5" 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
        Cashflow
      </h2>
      
      {/* MetricCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metricData.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            change={metric.change}
          />
        ))}
      </div>

      {/* Gráficos y Tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4">
            <IngresoGrafico />
          </div>
        </motion.div>
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">Tabla de Ingreso</h3>
            <IngresosTabla />
          </div>
        </motion.div>
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden lg:col-span-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-green-400 to-teal-500 text-transparent bg-clip-text">Gráfico de Cashflow</h3>
            <GraficoCashflow />
          </div>
        </motion.div>
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden lg:col-span-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-red-400 to-orange-500 text-transparent bg-clip-text">Gastos</h3>
            <GastoWidget />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CashflowPage;