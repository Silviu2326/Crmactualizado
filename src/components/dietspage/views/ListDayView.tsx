import React, { useState } from 'react';
import { Calendar, ChevronRight, Search, Tag, Clock, Filter, Coffee, Apple, Pizza, Cookie, Moon } from 'lucide-react';
import { DayViewProps, MealTime } from './types';

export default function ListDayView({ 
  day, 
  date, 
  isToday, 
  mealTimes, 
  macros, 
  handleAddMeal,
  getMealsForTime 
}: DayViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  const tags = ['Proteína', 'Carbohidratos', 'Grasas Saludables', 'Snack', 'Pre-entreno'];

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

  const filteredMealTimes = mealTimes.filter(mealTime => {
    if (!mealTime.title) return false;
    
    const matchesSearch = mealTime.title.toLowerCase().includes(searchTerm.toLowerCase());
    const meals = getMealsForTime(mealTime.title);
    const mealTime24h = parseInt(mealTime.time.split(':')[0]);
    
    const matchesTime = timeFilter === 'all' ? true : 
      (timeFilter === 'morning' && mealTime24h < 12) ||
      (timeFilter === 'afternoon' && mealTime24h >= 12 && mealTime24h < 18) ||
      (timeFilter === 'evening' && mealTime24h >= 18);
      
    return matchesSearch && matchesTime;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className={`glass-card p-4 rounded-xl transform transition-all duration-300 hover:-translate-x-1 ${
      isToday ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-blue-100' : ''
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-xl ${
            isToday 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-100' 
              : 'bg-blue-100'
          }`}>
            <Calendar className={`w-5 h-5 ${isToday ? 'text-white' : 'text-blue-700'}`} />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="font-bold text-xl text-gray-800">{day}</h3>
              <p className={`${isToday ? 'text-blue-600' : 'text-gray-500'} font-medium`}>{date}</p>
              {isToday && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Hoy
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar comidas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <Tag className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtrar por etiquetas:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtrar por horario:</span>
        </div>
        <div className="flex space-x-2">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'morning', label: 'Mañana' },
            { value: 'afternoon', label: 'Tarde' },
            { value: 'evening', label: 'Noche' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setTimeFilter(option.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === option.value
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredMealTimes.map((mealTime, index) => {
          const Icon = getMealIcon(mealTime.title);
          const meals = getMealsForTime(mealTime.title);
          const hasMeal = meals.length > 0;
          
          return (
            <div
              key={`${day}-${mealTime.title}-${index}`}
              className={`p-4 rounded-xl transition-all ${
                hasMeal ? 'bg-emerald-50' : 'bg-gray-50'
              } hover:shadow-md cursor-pointer`}
              onClick={() => handleAddMeal(mealTime.title)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Icon className={`w-5 h-5 ${hasMeal ? 'text-emerald-600' : 'text-gray-500'}`} />
                  <div>
                    <h4 className={`font-medium ${hasMeal ? 'text-emerald-900' : 'text-gray-800'}`}>
                      {mealTime.title}
                    </h4>
                    <p className="text-sm text-gray-500">{mealTime.time}</p>
                  </div>
                </div>
                {hasMeal && meals[0] && (
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                      {meals[0].calories} kcal
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}