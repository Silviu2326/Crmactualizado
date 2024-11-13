import React from 'react';
import { Dumbbell, Apple, Target, Flame, Calendar, AlertCircle, TrendingUp, Zap } from 'lucide-react';

export default function DietInfo() {
  const dietaryRestrictions = [
    { type: 'Sin Gluten', severity: 'high' },
    { type: 'Lácteos Limitados', severity: 'medium' }
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="diet-info-gradient text-white p-8 rounded-2xl shadow-2xl mb-8 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1932&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-900/90"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
          <Flame className="w-64 h-64 text-white/5" />
        </div>
        <div className="absolute bottom-0 left-0 transform -translate-x-1/3 translate-y-1/3 rotate-45">
          <Target className="w-48 h-48 text-white/5" />
        </div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-center space-x-3 mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Marzo 2024</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-300" />
              <span className="font-medium text-emerald-100">Progreso Excelente</span>
            </div>
          </div>

          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-4 tracking-tight flex items-center gap-3">
                Plan Nutricional Personalizado
                <span className="text-sm font-normal px-3 py-1 bg-blue-500/20 rounded-full">
                  Premium
                </span>
              </h1>
              <p className="text-white/80 max-w-xl">
                Optimizado para tus objetivos de fitness y preferencias alimenticias.
                Ajustado dinámicamente según tu progreso.
              </p>
            </div>
            <div className="flex gap-3">
              {dietaryRestrictions.map((restriction, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md ${
                    restriction.severity === 'high'
                      ? 'bg-red-500/20 text-white'
                      : 'bg-yellow-500/20 text-white'
                  }`}
                >
                  <AlertCircle className={`w-4 h-4 ${
                    restriction.severity === 'high' ? 'text-red-300' : 'text-yellow-300'
                  }`} />
                  <span className="font-medium">{restriction.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-4 bg-white/10 p-6 rounded-xl backdrop-blur-md hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <div className="p-3 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Objetivo</h3>
                <p className="text-white/80">Pérdida de grasa</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/10 p-6 rounded-xl backdrop-blur-md hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <div className="p-3 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                <Apple className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Calorías</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">2,200</p>
                  <p className="text-white/80">kcal/día</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/10 p-6 rounded-xl backdrop-blur-md hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <div className="p-3 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                <Dumbbell className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Actividad</h3>
                <div className="flex items-center gap-2">
                  <p className="text-white/80">Moderado</p>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/10 p-6 rounded-xl backdrop-blur-md hover:bg-white/20 transition-all duration-300 group cursor-pointer">
              <div className="p-3 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Energía</h3>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
                  </div>
                  <span className="text-white/80">80%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}