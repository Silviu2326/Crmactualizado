// DietList.tsx
import React, { useState, useEffect } from 'react'; 
import { Search, X, Plus, Filter, Download, Salad, Target, Clock, Users, FileText,
  Snowflake, Gift, TreeDeciduous, CandyCane, Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../Common/Button';
import Table from '../Common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

import CrearDietasPopup from './CrearDietasPopup';
import CrearComidaPopup from './CrearComidaPopup';

const DietList: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFoods, setShowFoods] = useState(false);
  const [showSnow, setShowSnow] = useState(true);

  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    objetivo: '',
    estado: '',
    categoria: '',
    rangoKcal: { min: '', max: '' }
  });

  const handleFilterChange = (key: string, value: string | { min: string, max: string }) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = (data: any[]) => {
    return data.filter(item => {
      if (showFoods) {
        // Filtros para alimentos
        const matchesCategoria = !filters.categoria || item.categoria === filters.categoria;
        const matchesKcal = !filters.rangoKcal.min && !filters.rangoKcal.max || 
          ((!filters.rangoKcal.min || item.calorias >= Number(filters.rangoKcal.min)) &&
           (!filters.rangoKcal.max || item.calorias <= Number(filters.rangoKcal.max)));
        
        return matchesCategoria && matchesKcal;
      } else {
        // Filtros para dietas
        const matchesObjetivo = !filters.objetivo || item.objetivo === filters.objetivo;
        const matchesEstado = !filters.estado || item.estado === filters.estado;
        
        return matchesObjetivo && matchesEstado;
      }
    });
  };

  const [dietData, setDietData] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const christmasStyles = {
    container: `p-6 min-h-screen relative ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-green-900/20 to-red-900/20'
        : 'bg-gradient-to-br from-red-50 via-green-50 to-red-50'
    }`,
    card: `${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} rounded-lg shadow-lg backdrop-blur-sm`,
    title: `text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`,
    snowflake: 'absolute animate-fall pointer-events-none',
  };

  // Generar copos de nieve
  const snowflakes = showSnow ? Array.from({ length: 30 }).map((_, i) => ({
    style: {
      position: 'absolute',
      left: `${Math.random() * 100}%`,
      top: `-20px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
      opacity: Math.random() * 0.5 + 0.5
    }
  })) : [];

  useEffect(() => {
    const styles = `
      @keyframes fall {
        0% {
          transform: translateY(-10vh) rotate(0deg);
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
        }
      }
      
      .animate-fall {
        animation: fall linear infinite;
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const statsCards = [
    { 
      icon: showFoods ? Cookie : TreeDeciduous,
      title: showFoods ? "Total Alimentos" : "Dietas Activas",
      value: showFoods ? "48" : "24",
      color: "bg-green-500"
    },
    {
      icon: showFoods ? CandyCane : Target,
      title: showFoods ? "Categorías" : "Objetivos Cumplidos",
      value: showFoods ? "12" : "85%",
      color: "bg-red-500"
    },
    {
      icon: Clock,
      title: showFoods ? "Tiempo Promedio" : "Duración Media",
      value: showFoods ? "25min" : "45 días",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "Clientes Asignados",
      value: "156",
      color: "bg-red-500"
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
            value === 'activa' ? 'bg-emerald-100 text-emerald-800' :
            value === 'pendiente' ? 'bg-amber-100 text-amber-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {value}
          </span>
        );
      case 'acciones':
        return value; // 'acciones' ya contiene el componente Link
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

      const response = await fetch('http://localhost:3000/api/dietas', {
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
          <Link 
            to={`/edit-diet/${diet._id}`}
            state={{ dietData: diet }} // Pasamos la dieta completa como state
          >
            <button className="text-blue-500 hover:underline">Editar</button>
          </Link>
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

      const response = await fetch('http://localhost:3000/api/alimentos', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        switch (response.status) {
          case 401:
            throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
          case 403:
            throw new Error('No tiene permisos para acceder a esta información.');
          case 404:
            throw new Error('No se encontró el recurso solicitado. Por favor, verifique la URL.');
          case 500:
            throw new Error('Error interno del servidor. Por favor, intente más tarde.');
          default:
            throw new Error(`Error al obtener los alimentos (${response.status})`);
        }
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        throw new Error('El formato de datos recibido no es válido');
      }

      const filteredData = data.map((food: any) => ({
        nombre: food.nombre || 'Sin nombre',
        descripcion: food.descripcion || 'Sin descripción',
        calorias: food.calorias || 0,
        carbohidratos: food.carbohidratos || 0,
        proteinas: food.proteinas || 0,
        grasas: food.grasas || 0,
        categoria: food.categoria || 'Sin categoría',
        acciones: (
          <div className="flex space-x-2">
            <Link to={`/edit-food/${food._id}`}>
              <button className="px-3 py-1 text-sm text-blue-500 hover:text-blue-700 transition-colors">
                Editar
              </button>
            </Link>
          </div>
        ),
      }));

      setFoodData(filteredData);
    } catch (err: any) {
      console.error('Error fetching foods:', err);
      setError(err.message || 'Error al cargar los alimentos');
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

  const filteredData = applyFilters(showFoods ? foodData : dietData);

  return (
    <div className={christmasStyles.container}>
      {showSnow && snowflakes.map((snowflake, i) => (
        <div key={i} className={christmasStyles.snowflake} style={snowflake.style}>
          <Snowflake size={16} className={`${theme === 'dark' ? 'text-gray-300' : 'text-red-200'}`} />
        </div>
      ))}

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-4"
      >
        <TreeDeciduous className="w-8 h-8 text-green-500 animate-bounce" />
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent mb-2">
            {showFoods ? 'Catálogo de Alimentos' : 'Planes Nutricionales'}
          </h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {showFoods 
              ? 'Gestiona y organiza tu biblioteca de alimentos y sus propiedades nutricionales'
              : 'Crea y administra planes nutricionales personalizados para tus clientes'
            }
          </p>
        </div>
        <Gift className="w-8 h-8 text-red-500 animate-bounce" />
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
            className={`${christmasStyles.card} p-4 hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
          >
            <div className="flex items-center space-x-4">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h3 className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{card.title}</h3>
                <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent">{card.value}</p>
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
            <Gift className="w-5 h-5 mr-2" />
            {showFoods ? 'Añadir Alimento' : 'Crear Dieta'}
          </Button>
          <Button variant="normal" onClick={() => setShowFoods(!showFoods)}>
            <Cookie className="w-5 h-5 mr-2" />
            {showFoods ? 'Ver Dietas' : 'Ver Alimentos'}
          </Button>
          <Button variant="normal">
            <Download className="w-5 h-5 mr-2" />
            Exportar
          </Button>
          <button
            onClick={() => setShowSnow(!showSnow)}
            className={`p-2 rounded-full ${
              theme === 'dark'
                ? 'bg-gray-700 text-green-400 hover:bg-gray-600'
                : 'bg-white text-red-500 hover:bg-red-50'
            } transition-colors duration-200`}
          >
            <Snowflake size={20} />
          </button>
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
        <Button 
          variant="filter" 
          onClick={() => setIsFilterModalOpen(true)}
          className={`${filters.objetivo || filters.estado || filters.categoria || filters.rangoKcal.min || filters.rangoKcal.max ? 'bg-green-500 text-white' : ''}`}
        >
          <Filter className="w-5 h-5 mr-2" />
          Filtros {Object.values(filters).flat().filter(Boolean).length > 0 && `(${Object.values(filters).flat().filter(Boolean).length})`}
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
            data={filteredData.map(item => ({
              ...item,
              ...Object.fromEntries(
                Object.entries(item).map(([key, value]) => [key, renderCell(key, value)])
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
        {isFilterModalOpen && (
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
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Filtros</h3>
                <Button variant="normal" onClick={() => setIsFilterModalOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {showFoods ? (
                  <div>
                    <label className="block text-sm font-medium mb-2">Categoría</label>
                    <select
                      className={`w-full p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                      value={filters.categoria}
                      onChange={(e) => handleFilterChange('categoria', e.target.value)}
                    >
                      <option value="">Todas</option>
                      <option value="Proteínas">Proteínas</option>
                      <option value="Carbohidratos">Carbohidratos</option>
                      <option value="Grasas">Grasas</option>
                      <option value="Verduras">Verduras</option>
                      <option value="Frutas">Frutas</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-2">Objetivo</label>
                    <select
                      className={`w-full p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                      value={filters.objetivo}
                      onChange={(e) => handleFilterChange('objetivo', e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="Pérdida de peso">Pérdida de peso</option>
                      <option value="Aumento muscular">Aumento muscular</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                    </select>
                  </div>
                )}
                {showFoods && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Rango de Calorías</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className={`w-1/2 p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                        value={filters.rangoKcal.min}
                        onChange={(e) => handleFilterChange('rangoKcal', { ...filters.rangoKcal, min: e.target.value })}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className={`w-1/2 p-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                        value={filters.rangoKcal.max}
                        onChange={(e) => handleFilterChange('rangoKcal', { ...filters.rangoKcal, max: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                {!showFoods && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Estado</label>
                    <select
                      className={`w-full p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                      value={filters.estado}
                      onChange={(e) => handleFilterChange('estado', e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="activa">Activa</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="completada">Completada</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="normal"
                  onClick={() => {
                    setFilters({
                      objetivo: '',
                      estado: '',
                      categoria: '',
                      rangoKcal: { min: '', max: '' }
                    });
                  }}
                >
                  Limpiar
                </Button>
                <Button
                  variant="create"
                  onClick={() => setIsFilterModalOpen(false)}
                >
                  Aplicar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DietList;
