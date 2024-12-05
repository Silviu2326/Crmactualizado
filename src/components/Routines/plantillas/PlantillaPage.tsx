import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../Common/Button';
import { ArrowLeft } from 'lucide-react';
import PlantillaPageCalendario from './PlantillaPageCalendario';
import VistaCompleja from './VistaCompleja';
import VistaClientes from './VistaClientes';

interface PlantillaPageProps {}

const PlantillaPage: React.FC<PlantillaPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [plantilla, setPlantilla] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vistaActual, setVistaActual] = useState<'compleja' | 'clientes'>('compleja');
  const [semanaSeleccionada, setSemanaSeleccionada] = useState<number>(1);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>('Lunes');

  useEffect(() => {
    const fetchPlantilla = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`http://localhost:3000/api/plannings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar la plantilla');
        }

        const data = await response.json();
        setPlantilla(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantilla();
  }, [id]);

  const handleDayClick = (semana: number, dia: string) => {
    setSemanaSeleccionada(semana);
    setDiaSeleccionado(dia);
    // Puedes agregar aquí lógica adicional cuando se selecciona un día
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="mb-6">
        <Button variant="normal" onClick={() => navigate('/plannings')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Planificaciones
        </Button>
        <h1 className="text-3xl font-bold mb-2">{plantilla?.nombre}</h1>
        <p className="text-gray-600 dark:text-gray-400">{plantilla?.descripcion}</p>
      </div>

      {/* Calendario siempre visible */}
      <div className="mb-8">
        <PlantillaPageCalendario 
          plantilla={plantilla} 
          onDayClick={handleDayClick}
        />
      </div>

      {/* Selector de vistas para el contenido inferior */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant={vistaActual === 'compleja' ? 'primary' : 'normal'}
          onClick={() => setVistaActual('compleja')}
        >
          Vista Compleja
        </Button>
        <Button
          variant={vistaActual === 'clientes' ? 'primary' : 'normal'}
          onClick={() => setVistaActual('clientes')}
        >
          Vista Clientes
        </Button>
      </div>

      {/* Información de la selección actual */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Semana {semanaSeleccionada} - {diaSeleccionado}
      </div>

      {/* Contenido según la vista seleccionada */}
      <div className="mt-6">
        {vistaActual === 'compleja' && (
          <VistaCompleja 
            plantilla={plantilla}
            semana={semanaSeleccionada}
            dia={diaSeleccionado}
          />
        )}
        {vistaActual === 'clientes' && (
          <VistaClientes 
            plantilla={plantilla}
            semana={semanaSeleccionada}
            dia={diaSeleccionado}
          />
        )}
      </div>
    </div>
  );
};

export default PlantillaPage;
