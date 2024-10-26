import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCircle, Ticket, Calendar } from 'lucide-react';
import TablaClasesGrupales from './TablaClasesGrupales';
import TablaAsesoriaSubscripcion from './TablaAsesoriaSubscripcion';
import TablaCitas from './TablaCitas';
import { categoriasServicios } from '../data/servicios';
import type { CategoriaServicio } from '../types/servicios';

const ServiciosLista = () => {
  const [categoriaActiva, setCategoriaActiva] = useState('clases-grupales');

  const renderTabla = (categoria: CategoriaServicio) => {
    switch (categoria.tipo) {
      case 'clase':
        return <TablaClasesGrupales datos={categoria.datos} />;
      case 'asesoria':
      case 'suscripcion':
        return <TablaAsesoriaSubscripcion datos={categoria.datos} />;
      case 'cita':
        return <TablaCitas datos={categoria.datos} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block animate-float">
            <h1 className="text-5xl font-bold mb-4 text-gradient">
              Gestión de Servicios
            </h1>
          </div>
        </motion.div>

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
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200/50'
                    : 'glass hover:bg-white/90 text-gray-700 shadow-lg hover:shadow-xl'
                }`}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span
                className={`${
                  categoriaActiva === categoria.id
                    ? 'text-white'
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
          className="glass rounded-3xl shadow-xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={categoriaActiva}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
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
