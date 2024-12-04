import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';
import { ArrowLeft } from 'lucide-react';

interface PlantillaPageProps {}

const PlantillaPage: React.FC<PlantillaPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [plantilla, setPlantilla] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlantilla = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch(`https://fitoffice2-f70b52bef77e.herokuapp.com//api/plannings/${id}`, {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Detalles de la Plantilla</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Meta</label>
              <p className="mt-1">{plantilla?.meta}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Duración</label>
              <p className="mt-1">{plantilla?.semanas} semanas</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Ejercicios y Rutinas</h2>
          {/* Aquí puedes agregar la lista de ejercicios y rutinas */}
          <p className="text-gray-600 dark:text-gray-400">
            Próximamente: Configuración de ejercicios y rutinas
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlantillaPage;
