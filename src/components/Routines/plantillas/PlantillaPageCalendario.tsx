import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../Common/Button';
import { Plus, Calendar } from 'lucide-react';

interface PlantillaPageCalendarioProps {
  plantilla: any;
  onDayClick: (semana: number, dia: string) => void;
}

const PlantillaPageCalendario: React.FC<PlantillaPageCalendarioProps> = ({ 
  plantilla,
  onDayClick 
}) => {
  const { theme } = useTheme();
  const [numSemanas, setNumSemanas] = useState(4);
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const handleAddWeek = () => {
    setNumSemanas(prev => prev + 1);
  };

  const getDayNumber = (semanaIndex: number, diaIndex: number) => {
    return (semanaIndex * 7) + diaIndex + 1;
  };

  return (
    <div className={`bg-gradient-to-br ${
      theme === 'dark' 
        ? 'from-gray-800 to-gray-700' 
        : 'from-white to-gray-50'
    } rounded-xl shadow-lg p-6`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Calendar className={`w-6 h-6 mr-3 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
          }`} />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Calendario de la Plantilla
          </h2>
        </div>
        <Button 
          variant="normal" 
          onClick={handleAddWeek} 
          className={`flex items-center transform transition-transform hover:scale-105 ${
            theme === 'dark' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white px-4 py-2 rounded-lg shadow-md`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Añadir Semana
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={`p-4 text-left border-b-2 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-blue-50 border-blue-200 text-gray-700'
              } font-semibold transition-colors duration-150`}>
                Semana
              </th>
              {dias.map(dia => (
                <th
                  key={dia}
                  className={`p-4 text-center border-b-2 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-gray-200'
                      : 'bg-blue-50 border-blue-200 text-gray-700'
                  } font-semibold transition-colors duration-150`}
                >
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: numSemanas }).map((_, semanaIndex) => (
              <tr key={semanaIndex} className={
                theme === 'dark' ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
              }>
                <td className={`p-4 border ${
                  theme === 'dark' 
                    ? 'border-gray-600 bg-gray-800' 
                    : 'border-gray-200 bg-white'
                } font-medium transition-colors duration-150`}>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                      theme === 'dark' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {semanaIndex + 1}
                    </span>
                    <span>Semana</span>
                  </div>
                </td>
                {dias.map((dia, diaIndex) => (
                  <td
                    key={diaIndex}
                    onClick={() => onDayClick(semanaIndex + 1, dia)}
                    className={`p-4 border relative group cursor-pointer ${
                      theme === 'dark'
                        ? 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                        : 'border-gray-200 bg-white hover:bg-blue-50'
                    } transition-all duration-200`}
                  >
                    <div className="min-h-[60px] flex flex-col items-center justify-center relative">
                      <span className={`absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full text-sm ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {getDayNumber(semanaIndex, diaIndex)}
                      </span>
                      <div className={`w-full h-full flex items-center justify-center ${
                        theme === 'dark'
                          ? 'group-hover:text-blue-400'
                          : 'group-hover:text-blue-600'
                      } transition-colors duration-200`}>
                        {/* Aquí puedes mostrar las sesiones programadas para este día */}
                        <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          + Añadir sesión
                        </span>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlantillaPageCalendario;
