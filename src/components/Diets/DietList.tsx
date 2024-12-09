// DietList.tsx
import React, { useState, useEffect } from 'react'; 
import { Search, X, Plus, Filter, Download, Salad, Target, Clock, Users, FileText, Edit, Trash2 } from 'lucide-react';
import Button from '../Common/Button';
import Table from '../Common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { dietService } from '../../services/dietService';
import { foodService } from '../../services/foodService';

import CrearDietasPopup from './CrearDietasPopup';
import CrearComidaPopup from './CrearComidaPopup';

const DietList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFoods, setShowFoods] = useState(false);

  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

  // Estados para dietas, alimentos, carga y errores
  const [dietData, setDietData] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Datos estáticos para alimentos (puedes reemplazarlos con datos reales)
  // const foodData = [ ... ]; // Elimina esta línea si obtienes los datos del backend

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

  // Función para eliminar una dieta
  const handleDeleteDiet = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta dieta?')) {
      try {
        await dietService.deleteDiet(id);
        fetchDietas();
      } catch (error) {
        console.error('Error al eliminar la dieta:', error);
      }
    }
  };

  // Función para eliminar un alimento
  const handleDeleteFood = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este alimento?')) {
      try {
        await foodService.deleteFood(id);
        fetchFoods();
      } catch (error) {
        console.error('Error al eliminar el alimento:', error);
      }
    }
  };

  const renderCell = (key: string, value: any, item: any) => {
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
            value === 'activa' ? 'bg-emerald-100 text-emerald-800' :
            value === 'pendiente' ? 'bg-amber-100 text-amber-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {value}
          </span>
        );
      case 'acciones':
        return (
          <div className="flex items-center space-x-2">
            <Link 
              to={`/edit-diet/${item._id}`}
              state={{ dietData: item }} // Pasamos la dieta completa como state
            >
              <button className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-gray-600'
              }`}>
                <Edit className="w-4 h-4" />
              </button>
            </Link>
            <button
              onClick={() => handleDeleteDiet(item._id)}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-gray-600'
              } hover:text-red-500`}
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      default:
        return value;
    }
  };

  const fetchDietas = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/dietas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al obtener las dietas');
      }

      const data = await response.json();

      // Guardamos los datos completos de las dietas
      const dietasCompletas = data;

      const filteredData = data.map((diet: any) => ({
        _id: diet._id, // Aseguramos que el ID esté disponible
        nombre: diet.nombre,
        cliente: diet.cliente.nombre,
        fechaInicio: new Date(diet.fechaInicio).toLocaleDateString('es-ES'),
        objetivo: diet.objetivo,
        restricciones: diet.restricciones,
        estado: diet.estado,
        acciones: (
          <div className="flex items-center space-x-2">
            <Link 
              to={`/edit-diet/${diet._id}`}
              state={{ dietData: diet }} // Pasamos la dieta completa como state
            >
              <button className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-gray-600'
              }`}>
                <Edit className="w-4 h-4" />
              </button>
            </Link>
            <button
              onClick={() => handleDeleteDiet(diet._id)}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-gray-600'
              } hover:text-red-500`}
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      }));

      setDietData(filteredData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice2-f70b52bef77e.herokuapp.com/api/foods', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al obtener los alimentos');
      }

      const data = await response.json();

      const filteredData = data.map((food: any) => ({
        nombre: food.nombre,
        descripcion: food.descripcion,
        calorias: food.calorias,
        carbohidratos: food.carbohidratos,
        proteinas: food.proteinas,
        grasas: food.grasas,
        categoria: food.categoria,
        acciones: (
          <div className="flex items-center space-x-2">
            <Link to={`/edit-food/${food._id}`}>
              <button className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-gray-600'
              }`}>
                <Edit className="w-4 h-4" />
              </button>
            </Link>
            <button
              onClick={() => handleDeleteFood(food._id)}
              className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-gray-600'
              } hover:text-red-500`}
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      }));

      setFoodData(filteredData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showFoods) {
      fetchFoods();
    } else {
      fetchDietas();
    }
  }, [showFoods]);

  const handleDietCreated = () => {
    fetchDietas();
  };

  const handleFoodCreated = () => {
    fetchFoods();
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
          <Button variant="create" onClick={() => showFoods ? setIsFoodModalOpen(true) : setIsDietModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            {showFoods ? 'Añadir Alimento' : 'Crear Dieta'}
          </Button>
          <Button variant="normal" onClick={() => setShowFoods(!showFoods)}>
            <FileText className="w-5 h-5 mr-2" />
            {showFoods ? 'Ver Dietas' : 'Ver Alimentos'}
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

      {/* Manejo de estados de carga y error */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <p>Cargando {showFoods ? 'alimentos' : 'dietas'}...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}
        >
          <Table
            headers={showFoods 
              ? ['Nombre', 'Descripción', 'Calorías', 'Carbohidratos', 'Proteínas', 'Grasas', 'Categoría', 'Acciones']
              : ['Nombre', 'Cliente', 'Fecha de Inicio', 'Objetivo', 'Restricciones', 'Estado', 'Acciones']
            }
            data={(showFoods ? foodData : dietData).map(item => ({
              ...item,
              ...Object.fromEntries(
                Object.entries(item).map(([key, value]) => [key, renderCell(key, value, item)])
              )
            }))}
            variant={theme === 'dark' ? 'dark' : 'white'}
          />
        </motion.div>
      )}

      {/* Modales */}
      <AnimatePresence>
        {isDietModalOpen && !showFoods && (
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
                <h3 className="text-2xl font-bold">Crear Nuevo Plan</h3>
                <Button variant="normal" onClick={() => setIsDietModalOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <CrearDietasPopup onClose={() => setIsDietModalOpen(false)} onDietCreated={handleDietCreated} />
            </motion.div>
          </motion.div>
        )}
        {isFoodModalOpen && showFoods && (
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
                <h3 className="text-2xl font-bold">Añadir Nuevo Alimento</h3>
                <Button variant="normal" onClick={() => setIsFoodModalOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <CrearComidaPopup onClose={() => setIsFoodModalOpen(false)} onFoodCreated={handleFoodCreated} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DietList;
