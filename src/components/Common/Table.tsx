import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Edit, Trash2, FileText, Download, ChevronDown, ChevronUp } from 'lucide-react';

interface TableProps {
  headers: string[];
  data: any[];
  variant?: 'blue' | 'white' | 'dark' | 'black';
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onDownload?: (id: string) => void;
  onToggleDetails?: (id: string) => void;
  openRowId?: string | null;
}

const Table: React.FC<TableProps> = ({
  headers,
  data,
  variant = 'white',
  onEdit,
  onDelete,
  onViewDetails,
  onDownload,
  onToggleDetails,
  openRowId
}) => {
  const { theme } = useTheme();

  const getHeaderClass = () => {
    const baseClasses = 'px-6 py-4 text-left text-xs font-medium uppercase tracking-wider';
    if (theme === 'dark') {
      return `${baseClasses} bg-gray-800 text-white`;
    }
    switch (variant) {
      case 'blue':
        return `${baseClasses} bg-blue-500 text-white`;
      case 'dark':
        return `${baseClasses} bg-gray-700 text-white`;
      case 'black':
        return `${baseClasses} bg-black text-white`;
      default:
        return `${baseClasses} bg-white text-gray-700 border-b border-gray-200`;
    }
  };

  const getRowClass = (index: number) => {
    const baseClasses = 'hover:bg-gray-50 transition-colors duration-150 ease-in-out';
    if (theme === 'dark') {
      return `${baseClasses} ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}`;
    }
    return `${baseClasses} ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`;
  };

  const getTableClass = () => {
    const baseClasses = 'min-w-full rounded-lg overflow-hidden shadow-sm border';
    if (theme === 'dark') {
      return `${baseClasses} bg-gray-900 divide-y divide-gray-700 border-gray-700`;
    }
    switch (variant) {
      case 'blue':
        return `${baseClasses} bg-blue-50 divide-y divide-blue-200 border-blue-200`;
      case 'dark':
        return `${baseClasses} bg-gray-800 divide-y divide-gray-700 border-gray-700`;
      case 'black':
        return `${baseClasses} bg-gray-900 divide-y divide-gray-800 border-gray-800`;
      default:
        return `${baseClasses} bg-white divide-y divide-gray-200 border-gray-200`;
    }
  };

  const renderActions = (rowId: string) => (
    <div className="flex items-center gap-2">
      {onToggleDetails && (
        <button
          onClick={() => onToggleDetails(rowId)}
          className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 tooltip flex items-center gap-1 transition-colors duration-150"
          title="Ver detalles adicionales"
        >
          {openRowId === rowId ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}
      {onEdit && (
        <button
          onClick={() => onEdit(rowId)}
          className="p-1.5 hover:bg-blue-50 rounded-full text-blue-600 tooltip transition-colors duration-150"
          title="Editar"
        >
          <Edit size={16} />
        </button>
      )}
      {onViewDetails && (
        <button
          onClick={() => onViewDetails(rowId)}
          className="p-1.5 hover:bg-purple-50 rounded-full text-purple-600 tooltip transition-colors duration-150"
          title="Ver detalles"
        >
          <FileText size={16} />
        </button>
      )}
      {onDownload && (
        <button
          onClick={() => onDownload(rowId)}
          className="p-1.5 hover:bg-green-50 rounded-full text-green-600 tooltip transition-colors duration-150"
          title="Descargar"
        >
          <Download size={16} />
        </button>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(rowId)}
          className="p-1.5 hover:bg-red-50 rounded-full text-red-600 tooltip transition-colors duration-150"
          title="Eliminar"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );

  const renderExpandedContent = (row: any) => (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Detalles de la Planificación</h4>
          <p className="text-sm text-gray-600">Creada por: {row.trainer?.nombre || 'No especificado'}</p>
          <p className="text-sm text-gray-600">Cliente: {row.cliente?.nombre || 'No especificado'}</p>
          <p className="text-sm text-gray-600">Última actualización: {new Date(row.updatedAt).toLocaleDateString()}</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Estadísticas</h4>
          <p className="text-sm text-gray-600">Semanas completadas: {row.semanasCompletadas || 0}</p>
          <p className="text-sm text-gray-600">Ejercicios totales: {row.ejerciciosTotales || 0}</p>
          <p className="text-sm text-gray-600">Progreso general: {row.progreso || '0%'}</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Objetivos</h4>
          <p className="text-sm text-gray-600">Meta principal: {row.meta || 'No especificada'}</p>
          <p className="text-sm text-gray-600">Duración total: {row.semanas} semanas</p>
          <p className="text-sm text-gray-600">Estado actual: {row.estado || 'En progreso'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className={getTableClass()}>
        <thead className={getHeaderClass()}>
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className={getHeaderClass()}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} divide-y ${theme === 'dark' ? 'divide-gray-600' : 'divide-gray-200'}`}>
          {data.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <tr className={getRowClass(rowIndex)}>
                {Object.entries(row).map(([key, cell], cellIndex) => {
                  // Ignorar campos que no deben mostrarse como columnas
                  if (['_id', 'trainer', 'cliente', 'updatedAt', 'semanasCompletadas', 'ejerciciosTotales'].includes(key)) {
                    return null;
                  }
                  
                  // Si es la columna de acciones, mostrar los botones
                  if (key === 'acciones') {
                    return (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {renderActions(row._id)}
                      </td>
                    );
                  }
                  
                  // Para el resto de las columnas, mostrar el contenido normal
                  return (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                      {cell}
                    </td>
                  );
                })}
              </tr>
              {openRowId === row._id && (
                <tr>
                  <td colSpan={headers.length} className="p-0">
                    {renderExpandedContent(row)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;