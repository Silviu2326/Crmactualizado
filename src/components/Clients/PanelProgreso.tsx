import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  Camera,
  Scale,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  Image as ImageIcon,
  BarChart2
} from 'lucide-react';
import Button from '../Common/Button';

interface Checkin {
  fecha: string;
  peso: number;
  fotos: string[];
  medidas: {
    pecho: number;
    cintura: number;
    cadera: number;
    brazos: number;
    piernas: number;
  };
  notas: string;
}

interface ProgresoEjercicio {
  nombre: string;
  datos: {
    fecha: string;
    peso: number;
    repeticiones: number;
  }[];
}

interface PanelProgresoProps {
  clienteId: string;
}

const PanelProgreso: React.FC<PanelProgresoProps> = ({ clienteId }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'checkins' | 'fotos' | 'graficos'>('checkins');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Datos de ejemplo
  const checkins: Checkin[] = [
    {
      fecha: '2024-01-01',
      peso: 75,
      fotos: ['/foto1.jpg', '/foto2.jpg'],
      medidas: {
        pecho: 95,
        cintura: 80,
        cadera: 100,
        brazos: 35,
        piernas: 55
      },
      notas: 'Buena progresión este mes'
    },
    // Más datos de ejemplo...
  ];

  const progresoEjercicios: ProgresoEjercicio[] = [
    {
      nombre: 'Press de Banca',
      datos: [
        { fecha: '2024-01-01', peso: 60, repeticiones: 10 },
        { fecha: '2024-01-15', peso: 65, repeticiones: 10 },
        { fecha: '2024-02-01', peso: 70, repeticiones: 10 },
      ]
    },
    {
      nombre: 'Sentadilla',
      datos: [
        { fecha: '2024-01-01', peso: 80, repeticiones: 8 },
        { fecha: '2024-01-15', peso: 85, repeticiones: 8 },
        { fecha: '2024-02-01', peso: 90, repeticiones: 8 },
      ]
    },
    // Más ejercicios...
  ];

  const todasLasFotos = checkins.flatMap(checkin => checkin.fotos);

  const renderCheckins = () => (
    <div className="space-y-6">
      {checkins.map((checkin, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            isDark ? 'bg-gray-700' : 'bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">{new Date(checkin.fecha).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5" />
              <span>{checkin.peso} kg</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {Object.entries(checkin.medidas).map(([parte, medida]) => (
              <div key={parte} className="flex items-center space-x-2">
                <span className="text-sm capitalize">{parte}:</span>
                <span className="font-medium">{medida} cm</span>
              </div>
            ))}
          </div>

          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {checkin.notas}
          </p>
        </div>
      ))}
    </div>
  );

  const renderFotos = () => (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {todasLasFotos.map((foto, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => {
              setSelectedImage(foto);
              setCurrentImageIndex(index);
            }}
          >
            <img
              src={foto}
              alt={`Progreso ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg" />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full">
            <img
              src={selectedImage}
              alt="Progreso"
              className="w-full h-auto"
            />
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
              onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : todasLasFotos.length - 1))}
            >
              <ChevronLeft size={40} />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
              onClick={() => setCurrentImageIndex((prev) => (prev < todasLasFotos.length - 1 ? prev + 1 : 0))}
            >
              <ChevronRight size={40} />
            </button>
            <button
              className="absolute top-4 right-4 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderGraficos = () => (
    <div className="space-y-8">
      {/* Gráfico de Peso */}
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-4">Evolución del Peso</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={checkins}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="fecha"
                tickFormatter={(fecha) => new Date(fecha).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(fecha) => new Date(fecha).toLocaleDateString()}
                formatter={(value) => [`${value} kg`, 'Peso']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="peso"
                stroke="#8884d8"
                name="Peso (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráficos de Ejercicios */}
      {progresoEjercicios.map((ejercicio, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
        >
          <h3 className="text-lg font-semibold mb-4">
            Progreso en {ejercicio.nombre}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ejercicio.datos}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="fecha"
                  tickFormatter={(fecha) => new Date(fecha).toLocaleDateString()}
                />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip
                  labelFormatter={(fecha) => new Date(fecha).toLocaleDateString()}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="peso"
                  fill="#8884d8"
                  name="Peso (kg)"
                />
                <Bar
                  yAxisId="right"
                  dataKey="repeticiones"
                  fill="#82ca9d"
                  name="Repeticiones"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg p-6`}>
      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'checkins' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('checkins')}
        >
          <Scale className="w-4 h-4 mr-2" />
          Check-ins
        </Button>
        <Button
          variant={activeTab === 'fotos' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('fotos')}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Fotos
        </Button>
        <Button
          variant={activeTab === 'graficos' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('graficos')}
        >
          <BarChart2 className="w-4 h-4 mr-2" />
          Gráficos
        </Button>
      </div>

      {activeTab === 'checkins' && renderCheckins()}
      {activeTab === 'fotos' && renderFotos()}
      {activeTab === 'graficos' && renderGraficos()}
    </div>
  );
};

export default PanelProgreso;
