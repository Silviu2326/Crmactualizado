import React, { useState } from 'react';
import { Gift, Search, Filter, Plus } from 'lucide-react';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface Bono {
  id: number;
  nombre: string;
  valor: number;
  estado: 'Activo' | 'Inactivo';
}

interface BonosWidgetProps {
  bonos: Bono[];
  isEditMode: boolean;
  onRemove: () => void;
  setIsBonoPopupOpen: React.Dispatch<React.SetStateAction<boolean>>; // Agregamos esta prop
}

const BonosWidget: React.FC<BonosWidgetProps> = ({
  bonos,
  isEditMode,
  onRemove,
  setIsBonoPopupOpen, // La recibimos aquí
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();
  const totalValor = bonos.reduce(
    (sum, bono) => (bono.estado === 'Activo' ? sum + bono.valor : sum),
    0
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    // Implementar lógica de filtrado
    console.log('Filtrar bonos');
  };

  return (
    <div
      className={`p-4 h-full flex flex-col justify-between ${
        theme === 'dark'
          ? 'bg-gray-800 text-white'
          : 'bg-yellow-50 text-gray-800'
      } rounded-lg`}
    >
      {isEditMode && (
        <button
          onClick={onRemove}
          className={`absolute top-2 right-2 ${
            theme === 'dark'
              ? 'text-yellow-400 hover:text-yellow-300'
              : 'text-yellow-500 hover:text-yellow-700'
          } bg-white rounded-full p-1 shadow-md`}
        >
          <Gift className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-center justify-between mb-2">
        <h3
          className={`text-sm font-semibold ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          Bonos
        </h3>
        <div
          className={`${
            theme === 'dark' ? 'bg-yellow-900' : 'bg-yellow-100'
          } p-2 rounded-full`}
        >
          <Gift
            className={`w-5 h-5 ${
              theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
            }`}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar bonos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-3 py-2 border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-800'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500`}
          />
          <Search
            className={`absolute right-3 top-2.5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
        </div>
        <Button variant="filter" onClick={handleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="create" onClick={() => setIsBonoPopupOpen(true)}>
          {/* Usamos setIsBonoPopupOpen aquí */}
          <Plus className="w-4 h-4 mr-1" />
          Crear
        </Button>
      </div>
      <div className="flex-grow overflow-auto custom-scrollbar">
        <Table
          headers={['Nombre', 'Valor', 'Estado']}
          data={bonos.map((bono) => ({
            Nombre: bono.nombre,
            Valor: bono.valor.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            }),
            Estado: bono.estado,
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>
      <div
        className={`text-sm font-semibold mt-2 ${
          theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'
        }`}
      >
        Total bonos activos:{' '}
        {totalValor.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
        })}
      </div>
      <div
        className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        } mt-1`}
      >
        {bonos.length} bonos en total
      </div>
    </div>
  );
};

export default BonosWidget;
