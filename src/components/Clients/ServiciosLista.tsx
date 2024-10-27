import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCircle, Ticket, Calendar, Moon, Sun, Plus } from 'lucide-react';
import TablaClasesGrupales from './TablaClasesGrupales';
import TablaAsesoriaSubscripcion from './TablaAsesoriaSubscripcion';
import TablaCitas from './TablaCitas';
import { categoriasServicios } from '../data/servicios';
import type { CategoriaServicio } from '../types/servicios';
import { useTheme } from '../../contexts/ThemeContext';

const ServiciosLista = () => {
  const [categoriaActiva, setCategoriaActiva] = useState('clases-grupales');
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const getActionButtonText = () => {
    switch (categoriaActiva) {
      case 'clases-grupales':
        return 'Nueva Clase';
      case 'asesorias':
        return 'Nueva Asesoría';
      case 'suscripciones':
        return 'Nueva Suscripción';
      case 'citas':
        return 'Nueva Cita';
      default:
        return 'Nuevo';
    }
  };

  const renderTabla = (categoria: CategoriaServicio) => {
    switch (categoria.tipo) {
      case 'clase':
        return <TablaClasesGrupales datos={categoria.datos} isDarkMode={isDarkMode} />;
      case 'asesoria':
      case 'suscripcion':
        return <TablaAsesoriaSubscripcion datos={categoria.datos} isDarkMode={isDarkMode} />;
      case 'cita':
        return <TablaCitas datos={categoria.datos} isDarkMode={isDarkMode} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50'
      } py-12 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1
              className={`text-5xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gradient'
              }`}
            >
              Gestión de Servicios
            </h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-xl flex items-center space-x-2 font-medium shadow-lg transition-all duration-300 ${
                isDarkMode
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/30'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>{getActionButtonText()}</span>
            </motion.button>

          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categoriasServicios.map((categoria, index) => (
            <motion.button
              key={categoria.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setCategoriaActiva(categoria.id)}
              className={`flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 
                ${
                  categoriaActiva === categoria.id
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/50'
                    : isDarkMode
                    ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 shadow-lg hover:shadow-xl'
                    : 'glass hover:bg-white/90 text-gray-700 shadow-lg hover:shadow-xl'
                }`}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className={`${
                  categoriaActiva === categoria.id
                    ? 'text-white'
                    : isDarkMode
                    ? 'text-purple-400'
                    : 'text-indigo-600'
                }`}
              >
                {categoria.icono}
              </span>
              <span className="font-medium text-lg">{categoria.titulo}</span>
            </motion.button>
          ))}
        </div>

        <motion.div
          layout
          className={`${
            isDarkMode ? 'bg-gray-800/50 shadow-xl' : 'glass'
          } rounded-3xl shadow-xl overflow-hidden`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={categoriaActiva}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={isDarkMode ? 'text-gray-200' : ''}
            >
              {renderTabla(
                categoriasServicios.find((c) => c.id === categoriaActiva)!
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ServiciosLista;
