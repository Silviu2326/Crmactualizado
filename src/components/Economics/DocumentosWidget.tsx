import React, { useState } from 'react';
import { FileText, Search, Filter, Plus } from 'lucide-react';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface Documento {
  id: number;
  nombre: string;
  fecha: string;
}

interface DocumentosWidgetProps {
  documentos: Documento[];
  isEditMode: boolean;
  onRemove: () => void;
  setIsDocumentoPopupOpen: React.Dispatch<React.SetStateAction<boolean>>; // Agregamos esta prop
}

const DocumentosWidget: React.FC<DocumentosWidgetProps> = ({
  documentos,
  isEditMode,
  onRemove,
  setIsDocumentoPopupOpen, // La recibimos aquí
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { theme } = useTheme();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div
      className={`p-4 h-full flex flex-col justify-between ${
        theme === 'dark'
          ? 'bg-gray-800 text-white'
          : 'bg-purple-50 text-gray-800'
      } rounded-lg`}
    >
      {isEditMode && (
        <button
          onClick={onRemove}
          className={`absolute top-2 right-2 ${
            theme === 'dark'
              ? 'text-purple-400 hover:text-purple-300'
              : 'text-purple-500 hover:text-purple-700'
          } bg-white rounded-full p-1 shadow-md`}
        >
          <FileText className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          Documentos
        </h3>
        <div
          className={`${
            theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'
          } p-2 rounded-full`}
        >
          <FileText
            className={`w-5 h-5 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
            }`}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-3 py-2 border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-800'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <Search
            className={`absolute right-3 top-2.5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          />
        </div>
        <Button variant="filter" onClick={toggleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="create" onClick={() => setIsDocumentoPopupOpen(true)}>
          {/* Usamos setIsDocumentoPopupOpen directamente */}
          <Plus className="w-4 h-4 mr-1" />
          Añadir
        </Button>
      </div>
      {isFilterOpen && (
        <div
          className={`mb-4 p-4 ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600'
              : 'bg-white border-gray-200'
          } border rounded-md shadow-sm`}
        >
          {/* Aquí puedes añadir opciones de filtro */}
          <p>Opciones de filtro (por implementar)</p>
        </div>
      )}
      <div className="flex-grow overflow-auto custom-scrollbar">
        <Table
          headers={['Nombre', 'Fecha']}
          data={documentos.map((doc) => ({
            Nombre: doc.nombre,
            Fecha: doc.fecha,
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>
      <div
        className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        } mt-2`}
      >
        {documentos.length} documentos
      </div>
    </div>
  );
};

export default DocumentosWidget;
