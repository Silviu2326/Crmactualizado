import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface TableProps {
  headers: string[];
  data: any[];
  variant?: 'blue' | 'white' | 'dark' | 'black';
}

const Table: React.FC<TableProps> = ({ headers, data, variant = 'white' }) => {
  const { theme } = useTheme();

  const getHeaderClass = () => {
    const baseClasses = 'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider';
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
        return `${baseClasses} bg-white text-gray-800 border-b border-gray-200`;
    }
  };

  const getRowClass = (index: number) => {
    if (theme === 'dark') {
      return index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700';
    }
    return index % 2 === 0 ? 'bg-gray-50' : 'bg-white';
  };

  const getTableClass = () => {
    if (theme === 'dark') {
      return 'bg-gray-900 divide-y divide-gray-700';
    }
    switch (variant) {
      case 'blue':
        return 'bg-blue-50 divide-y divide-blue-200';
      case 'dark':
        return 'bg-gray-800 divide-y divide-gray-700';
      case 'black':
        return 'bg-gray-900 divide-y divide-gray-800';
      default:
        return 'bg-white divide-y divide-gray-200';
    }
  };

  return (
    <table className={`min-w-full ${getTableClass()}`}>
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
          <tr key={rowIndex} className={getRowClass(rowIndex)}>
            {Object.values(row).map((cell: any, cellIndex) => (
              <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;