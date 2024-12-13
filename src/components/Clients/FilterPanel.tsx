import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';

interface Filters {
  estado: string;
  tag: string;
  tipoPlan: string;
  clase: string;
  servicio: string;
}

interface FilterPanelProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters }) => {
  const { theme } = useTheme();

  const filterOptions = {
    estado: ['Activo', 'Inactivo', 'Pendiente'],
    tag: ['Premium', 'Básico', 'VIP', 'Sin etiqueta'],
    tipoPlan: ['Mensual', 'Trimestral', 'Anual'],
    clase: ['CrossFit', 'Yoga', 'Pilates', 'Funcional'],
    servicio: ['Personal', 'Grupal', 'Online'],
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters({ ...filters, [key]: value === filters[key] ? '' : value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`p-4 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(filterOptions).map(([key, options]) => (
          <div key={key} className="space-y-2">
            <h3 className="text-sm font-medium capitalize">{key}</h3>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() =>
                    handleFilterChange(key as keyof Filters, option)
                  }
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filters[key as keyof Filters] === option
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FilterPanel;
