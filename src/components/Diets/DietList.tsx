import React, { useState } from 'react';
import { Search, X, Plus, Filter, Download, Salad, Target, Clock, Users, FileText } from 'lucide-react';
import Button from '../common/Button';
import Table from '../common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const DietList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFoods, setShowFoods] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dietData = [
    { 
      nombre: 'Dieta Mediterránea', 
      cliente: 'Juan Pérez', 
      fechaInicio: '2023-05-01', 
      objetivo: 'Pérdida de peso', 
      restricciones: 'Sin gluten', 
      estado: 'Activo',
      progreso: '75%',
      acciones: 'Editar' 
    },
    { 
      nombre: 'Dieta Cetogénica', 
      cliente: 'María García', 
      fechaInicio: '2023-06-15', 
      objetivo: 'Aumento muscular', 
      restricciones: 'Sin lácteos', 
      estado: 'Pendiente',
      progreso: '30%',
      acciones: 'Editar' 
    },
    { 
      nombre: 'Dieta Vegetariana', 
      cliente: 'Carlos López', 
      fechaInicio: '2023-07-01', 
      objetivo: 'Mantenimiento', 
      restricciones: 'Sin carne', 
      estado: 'Completado',
      progreso: '100%',
      acciones: 'Editar' 
    },
  ];

  const foodData = [
    { 
      nombre: 'Pollo a la plancha', 
      descripcion: 'Pechuga de pollo cocinada a la plancha', 
      calorias: 165, 
      carbohidratos: 0, 
      proteinas: 31, 
      grasas: 3.6, 
      categoria: 'Proteínas',
      acciones: 'Editar' 
    },
    { 
      nombre: 'Ensalada César', 
      descripcion: 'Lechuga romana, crutones, queso parmesano y aderezo César', 
      calorias: 200, 
      carbohidratos: 10, 
      proteinas: 8, 
      grasas: 15, 
      categoria: 'Vegetales',
      acciones: 'Editar' 
    },
    { 
      nombre: 'Salmón al horno', 
      descripcion: 'Filete de salmón cocinado al horno con hierbas', 
      calorias: 280, 
      carbohidratos: 0, 
      proteinas: 39, 
      grasas: 13, 
      categoria: 'Proteínas',
      acciones: 'Editar' 
    },
  ];

  const statsCards = [
    { 
      icon: Salad,
      title: showFoods ? "Total Alimentos" : "Dietas Activas",
      value: showFoods ? "48" : "24",
      color: "bg-green-500"
    },
    {
      icon: Target,
      title: showFoods ? "Categorías" : "Objetivos Cumplidos",
      value: showFoods ? "12" : "85%",
      color: "bg-blue-500"
    },
    {
      icon: Clock,
      title: showFoods ? "Tiempo Promedio" : "Duración Media",
      value: showFoods ? "25min" : "45 días",
      color: "bg-purple-500"
    },
    {
      icon: Users,
      title: "Clientes Asignados",
      value: "156",
      color: "bg-amber-500"
    }
  ];

  const renderCell = (key: string, value: any) => {
    switch (key) {
      case 'objetivo':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Pérdida de peso' ? 'bg-red-100 text-red-800' :
            value === 'Aumento muscular' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {value}
          </span>
        );
      case 'restricciones':
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
            {value}
          </span>
        );
      case 'estado':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Activo' ? 'bg-emerald-100 text-emerald-800' :
            value === 'Pendiente' ? 'bg-amber-100 text-amber-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {value}
          </span>
        );
      case 'progreso':
        return (
          <div className="flex items-center space-x-2">
            <div className="flex-grow bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className={`h-2.5 rounded-full ${
                  parseInt(value) === 100 ? 'bg-green-600' :
                  parseInt(value) > 50 ? 'bg-blue-600' :
                  'bg-amber-600'
                }`}
                style={{ width: value }}
              ></div>
            </div>
            <span className="text-sm font-medium">{value}</span>
          </div>
        );
      case 'categoria':
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            value === 'Proteínas' ? 'bg-purple-100 text-purple-800' :
            value === 'Vegetales' ? 'bg-green-100 text-green-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {value}
          </span>
        );
      case 'calorias':
      case 'carbohidratos':
      case 'proteinas':
      case 'grasas':
        return (
          <span className="font-medium">
            {value}{key === 'calorias' ? ' kcal' : 'g'}
          </span>
        );
      default:
        return value;
    }
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-2">
          {showFoods ? 'Catálogo de Alimentos' : 'Planes Nutricionales'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {showFoods 
            ? 'Gestiona y organiza tu biblioteca de alimentos y sus propiedades nutricionales'
            : 'Crea y administra planes nutricionales personalizados para tus clientes'
          }
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {statsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} p-4 rounded-lg shadow-lg`}
          >
            <div className="flex items-center space-x-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 dark:text-gray-400">{card.title}</h3>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center mb-6"
      >
        <div className="flex space-x-2">
          <Button variant="create" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            {showFoods ? 'Añadir Alimento' : 'Crear Plan'}
          </Button>
          <Button variant="normal" onClick={() => setShowFoods(!showFoods)}>
            <FileText className="w-5 h-5 mr-2" />
            {showFoods ? 'Ver Planes' : 'Ver Alimentos'}
          </Button>
          <Button variant="normal">
            <Download className="w-5 h-5 mr-2" />
            Exportar
          </Button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 flex space-x-4"
      >
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={`Buscar ${showFoods ? 'alimentos' : 'planes'}...`}
            className={`w-full px-4 py-3 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-3 text-gray-400" />
        </div>
        <Button variant="filter">
          <Filter className="w-5 h-5 mr-2" />
          Filtros
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <Table
          headers={showFoods 
            ? ['Nombre', 'Descripción', 'Calorías', 'Carbohidratos', 'Proteínas', 'Grasas', 'Categoría', 'Acciones']
            : ['Nombre', 'Cliente', 'Fecha de Inicio', 'Objetivo', 'Restricciones', 'Estado', 'Progreso', 'Acciones']
          }
          data={(showFoods ? foodData : dietData).map(item => ({
            ...item,
            ...Object.fromEntries(
              Object.entries(item).map(([key, value]) => [key, renderCell(key, value)])
            )
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-2xl`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">
                  {showFoods ? 'Añadir Nuevo Alimento' : 'Crear Nuevo Plan'}
                </h3>
                <Button variant="normal" onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              {/* Aquí iría el formulario */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DietList;