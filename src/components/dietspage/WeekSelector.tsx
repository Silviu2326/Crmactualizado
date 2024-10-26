import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, LayoutGrid, List, Clock, CalendarDays, Trophy } from 'lucide-react';

export default function WeekSelector() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  
  const weeks = [
    { number: 1, range: "1 - 7 Marzo 2024", meals: 32, completed: 28 },
    { number: 2, range: "8 - 14 Marzo 2024", meals: 35, completed: 20 },
    { number: 3, range: "15 - 21 Marzo 2024", meals: 35, completed: 15 },
    { number: 4, range: "22 - 28 Marzo 2024", meals: 35, completed: 0 },
  ];

  const currentWeek = weeks.find(w => w.number === selectedWeek)!;
  const completionRate = Math.round((currentWeek.completed / currentWeek.meals) * 100);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            className="p-2.5 hover:bg-blue-50 rounded-xl transition-all duration-200 text-blue-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed group"
            disabled={selectedWeek === 1}
            onClick={() => setSelectedWeek(prev => Math.max(1, prev - 1))}
          >
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl shadow-sm">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Semana {currentWeek.number}</span>
            </div>
            <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
              {currentWeek.range}
            </span>
          </div>

          <button 
            className="p-2.5 hover:bg-blue-50 rounded-xl transition-all duration-200 text-blue-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed group"
            disabled={selectedWeek === weeks.length}
            onClick={() => setSelectedWeek(prev => Math.min(weeks.length, prev + 1))}
          >
            <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-xl">
              <Trophy className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-sm text-amber-600 font-medium">Progreso</span>
                <div className="font-semibold text-amber-700">
                  {currentWeek.completed}/{currentWeek.meals} comidas
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
            <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
              <LayoutGrid className="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
              <List className="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
              <CalendarDays className="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group">
              <Clock className="w-5 h-5 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative pt-2">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 relative"
            style={{ width: `${completionRate}%` }}
          >
            <div className="absolute inset-0 bg-white/20 background-shine"></div>
          </div>
        </div>
        <style jsx>{`
          @keyframes shine {
            to {
              background-position: 200% center;
            }
          }
          .background-shine {
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.4) 50%,
              rgba(255,255,255,0) 100%
            );
            background-size: 200% 100%;
            animation: shine 2s infinite linear;
          }
        `}</style>
      </div>
    </div>
  );
}