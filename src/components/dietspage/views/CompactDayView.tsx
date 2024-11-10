import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Sparkles, Coffee, Apple, Pizza, Cookie, Moon } from 'lucide-react';
import { DayViewProps } from './types';

export default function CompactDayView({ day, date, isToday, meals = [], macros, handleAddMeal }: DayViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const recommendations = [
    { title: "Batido de proteínas", calories: 150, time: "Pre-entreno" },
    { title: "Yogur con frutas", calories: 200, time: "Snack" },
    { title: "Ensalada de quinoa", calories: 300, time: "Almuerzo" }
  ];

  const calculateCompletionRate = () => {
    if (!meals.length) return 0;
    const completed = meals.filter(m => m.title === "Desayuno").length;
    return (completed / meals.length) * 100;
  };

  const getMealIcon = (title: string) => {
    switch (title) {
      case "Desayuno": return Coffee;
      case "Almuerzo": return Apple;
      case "Comida": return Pizza;
      case "Merienda": return Cookie;
      case "Cena": return Moon;
      default: return Coffee;
    }
  };

  const completionRate = calculateCompletionRate();
  const remainingCalories = macros.calories.target - macros.calories.current;

  return (
    <div 
      className={`glass-card p-4 rounded-xl transform transition-all duration-300 hover:scale-102 ${
        isToday ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-blue-100' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${
            isToday 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-100' 
              : 'bg-blue-100'
          }`}>
            <Calendar className={`w-5 h-5 ${isToday ? 'text-white' : 'text-blue-700'}`} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{day}</h3>
            <p className={`${isToday ? 'text-blue-600' : 'text-gray-500'} text-sm font-medium`}>{date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isToday && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              Hoy
            </span>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {meals.map((meal, index) => {
          if (!meal || !meal.title) return null;
          const Icon = getMealIcon(meal.title);
          const hasMeal = meal.title === "Desayuno";
          const shortTitle = meal.title.slice(0, 3);
          
          return (
            <button
              key={`${day}-${meal.title}-${index}`}
              onClick={handleAddMeal}
              className={`p-2 rounded-lg flex flex-col items-center justify-center space-y-1 transition-all ${
                hasMeal 
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{shortTitle}</span>
            </button>
          );
        })}
      </div>

      {isExpanded && (
        <>
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-700">Progreso del día</span>
              <span className="text-sm font-bold text-blue-800">{Math.round(completionRate)}%</span>
            </div>
            <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="p-3 bg-amber-50 rounded-xl">
              <p className="text-xs text-amber-600 font-medium mb-1">Calorías restantes</p>
              <p className="text-lg font-bold text-amber-700">{remainingCalories} kcal</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <p className="text-xs text-emerald-600 font-medium mb-1">Proteína total</p>
              <p className="text-lg font-bold text-emerald-700">{macros.protein.current}g</p>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-3"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                {showRecommendations ? 'Ocultar recomendaciones' : 'Ver recomendaciones'}
              </span>
            </button>
            
            {showRecommendations && (
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className="p-2 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{rec.title}</p>
                      <p className="text-xs text-gray-500">{rec.time}</p>
                    </div>
                    <span className="text-xs font-medium text-amber-600">{rec.calories} kcal</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}