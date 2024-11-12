import React, { useState } from 'react';
import MealCard from '../MealCard';
import DayMacros from '../DayMacros';
import { Calendar, Filter, ArrowUpDown, BarChart2, Plus } from 'lucide-react';
import { DayViewProps } from './types';

export default function GridDayView({ 
  day, 
  date, 
  isToday, 
  mealTimes, 
  macros, 
  handleAddMeal, 
  handleEditMeal,
  getMealsForTime 
}: DayViewProps) {
  const [sortBy, setSortBy] = useState<'time' | 'calories'>('time');
  const [filterType, setFilterType] = useState<string>('all');
  const [showStats, setShowStats] = useState(false);

  const stats = {
    completedMeals: mealTimes.reduce((sum, time) => sum + getMealsForTime(time.title).length, 0),
    totalProtein: macros.protein.current,
    remainingCalories: macros.calories.target - macros.calories.current,
    progress: (macros.calories.current / macros.calories.target) * 100
  };

  const sortedMealTimes = [...mealTimes].sort((a, b) => {
    if (sortBy === 'time') {
      return a.time.localeCompare(b.time);
    }
    const aCalories = getMealsForTime(a.title).reduce((sum, m) => sum + m.calories, 0);
    const bCalories = getMealsForTime(b.title).reduce((sum, m) => sum + m.calories, 0);
    return bCalories - aCalories;
  });

  const filteredMealTimes = sortedMealTimes.filter(time => {
    const meals = getMealsForTime(time.title);
    if (filterType === 'all') return true;
    if (filterType === 'completed') return meals.length > 0;
    return meals.length === 0;
  });

  return (
    <div className={`glass-card p-6 rounded-xl transform transition-all duration-300 hover:-translate-y-1 ${
      isToday ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-blue-100' : ''
    }`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${
            isToday 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-100' 
              : 'bg-blue-100'
          }`}>
            <Calendar className={`w-5 h-5 ${isToday ? 'text-white' : 'text-blue-700'}`} />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800">{day}</h3>
            <p className={`${isToday ? 'text-blue-600' : 'text-gray-500'} font-medium`}>{date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className={`p-2 rounded-lg transition-colors ${
              showStats ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <BarChart2 className="w-5 h-5" />
          </button>
          <div className="relative group">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <Filter className="w-5 h-5" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 hidden group-hover:block z-10">
              <button
                onClick={() => setFilterType('all')}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${filterType === 'all' ? 'text-blue-600' : 'text-gray-700'}`}
              >
                Todas las comidas
              </button>
              <button
                onClick={() => setFilterType('completed')}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${filterType === 'completed' ? 'text-blue-600' : 'text-gray-700'}`}
              >
                Completadas
              </button>
              <button
                onClick={() => setFilterType('pending')}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${filterType === 'pending' ? 'text-blue-600' : 'text-gray-700'}`}
              >
                Pendientes
              </button>
            </div>
          </div>
          <div className="relative group">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 hidden group-hover:block z-10">
              <button
                onClick={() => setSortBy('time')}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${sortBy === 'time' ? 'text-blue-600' : 'text-gray-700'}`}
              >
                Por hora
              </button>
              <button
                onClick={() => setSortBy('calories')}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${sortBy === 'calories' ? 'text-blue-600' : 'text-gray-700'}`}
              >
                Por calorías
              </button>
            </div>
          </div>
        </div>
      </div>

      {showStats && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-amber-50 p-4 rounded-xl">
            <p className="text-amber-600 text-sm font-medium">Comidas Completadas</p>
            <p className="text-2xl font-bold text-amber-700">{stats.completedMeals}/{mealTimes.length}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl">
            <p className="text-red-600 text-sm font-medium">Proteína Total</p>
            <p className="text-2xl font-bold text-red-700">{stats.totalProtein}g</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-blue-600 text-sm font-medium">Calorías Restantes</p>
            <p className="text-2xl font-bold text-blue-700">{stats.remainingCalories}</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl">
            <p className="text-emerald-600 text-sm font-medium">Progreso</p>
            <p className="text-2xl font-bold text-emerald-700">{Math.round(stats.progress)}%</p>
          </div>
        </div>
      )}

      <DayMacros {...macros} />

      <div className="mt-6 space-y-6">
        {filteredMealTimes.map((mealTime, index) => {
          const meals = getMealsForTime(mealTime.title);
          return (
            <div key={`${day}-${mealTime.title}-${index}`} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">{mealTime.title}</h4>
                <span className="text-sm text-gray-500">{mealTime.time}</span>
              </div>
              
              {meals.map((meal, mealIndex) => (
                <MealCard 
                  key={`${day}-${mealTime.title}-meal-${mealIndex}`}
                  meal={meal}
                  onAdd={() => handleAddMeal(mealTime.title)}
                  onEdit={handleEditMeal}
                />
              ))}
              
              <button
                onClick={() => handleAddMeal(mealTime.title)}
                className="w-full p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 group"
              >
                <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                <span className="text-gray-500 group-hover:text-blue-600 font-medium">
                  Añadir comida a {mealTime.title}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}