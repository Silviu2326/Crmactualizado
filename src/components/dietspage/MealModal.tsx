import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Apple, Scale, Beef, Wheat, Droplet, Search, ChevronDown, Sparkles } from 'lucide-react';
import { Meal } from './views/types';

interface MealModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMeal?: Meal;
  isEdit?: boolean;
  onSave: (meal: Meal) => void;
}

// Common foods database with nutritional values per 100g
const commonFoods = [
  { name: 'Pollo a la plancha', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  { name: 'Arroz blanco cocido', calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
  { name: 'Huevo entero', calories: 155, protein: 13, carbs: 1.1, fats: 11 },
  { name: 'Atún en agua', calories: 116, protein: 26, carbs: 0, fats: 0.8 },
  { name: 'Pan integral', calories: 247, protein: 13, carbs: 41, fats: 3.4 },
  { name: 'Plátano', calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
  { name: 'Yogur natural', calories: 59, protein: 3.5, carbs: 4.7, fats: 3.3 },
  { name: 'Avena', calories: 389, protein: 16.9, carbs: 66, fats: 6.9 },
  { name: 'Almendras', calories: 579, protein: 21, carbs: 22, fats: 49 },
  { name: 'Salmón', calories: 208, protein: 22, carbs: 0, fats: 13 }
];

export default function MealModal({ isOpen, onClose, initialMeal, isEdit = false, onSave }: MealModalProps) {
  const [meal, setMeal] = useState<Meal>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    time: ''
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof commonFoods>([]);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialMeal) {
      setMeal(initialMeal);
    }
  }, [initialMeal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMeal({ ...meal, name: value });
    
    if (value.length > 1) {
      const filtered = commonFoods.filter(food => 
        food.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (food: typeof commonFoods[0]) => {
    setMeal({
      ...meal,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats
    });
    setShowSuggestions(false);
  };

  const handleSearchFood = () => {
    const matchingFood = commonFoods.find(
      food => food.name.toLowerCase() === meal.name.toLowerCase()
    );

    if (matchingFood) {
      setMeal({
        ...meal,
        calories: matchingFood.calories,
        protein: matchingFood.protein,
        carbs: matchingFood.carbs,
        fats: matchingFood.fats
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(meal);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                {isEdit ? 'Editar Comida' : 'Añadir Nueva Comida'}
                <Sparkles className="w-5 h-5 text-amber-500" />
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Completa los detalles de tu comida
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Apple className="w-4 h-4 text-amber-600" />
                  <span>Nombre de la comida</span>
                </div>
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={meal.name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Ej: Pollo a la plancha"
                    required
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div 
                      ref={suggestionRef}
                      className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-60 overflow-auto"
                    >
                      {suggestions.map((food, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group transition-all duration-200"
                          onClick={() => handleSuggestionClick(food)}
                        >
                          <span className="font-medium text-gray-700 group-hover:text-blue-600">
                            {food.name}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium px-2 py-1 rounded-lg bg-amber-100 text-amber-700">
                              {food.calories} kcal
                            </span>
                            <span className="text-sm font-medium px-2 py-1 rounded-lg bg-red-100 text-red-700">
                              {food.protein}g prot
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSearchFood}
                  className="px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-200 flex items-center space-x-2 group"
                >
                  <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Buscar</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Hora</span>
                </div>
              </label>
              <input
                type="time"
                value={meal.time}
                onChange={(e) => setMeal({ ...meal, time: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-amber-600" />
                    <span>Calorías</span>
                  </div>
                </label>
                <input
                  type="number"
                  value={meal.calories}
                  onChange={(e) => setMeal({ ...meal, calories: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  placeholder="kcal"
                  required
                  min="0"
                />
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-red-800 mb-2">
                  <div className="flex items-center space-x-2">
                    <Beef className="w-4 h-4 text-red-600" />
                    <span>Proteínas</span>
                  </div>
                </label>
                <input
                  type="number"
                  value={meal.protein}
                  onChange={(e) => setMeal({ ...meal, protein: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder="gramos"
                  required
                  min="0"
                />
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-blue-800 mb-2">
                  <div className="flex items-center space-x-2">
                    <Wheat className="w-4 h-4 text-blue-600" />
                    <span>Carbohidratos</span>
                  </div>
                </label>
                <input
                  type="number"
                  value={meal.carbs}
                  onChange={(e) => setMeal({ ...meal, carbs: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="gramos"
                  required
                  min="0"
                />
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-xl">
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  <div className="flex items-center space-x-2">
                    <Droplet className="w-4 h-4 text-purple-600" />
                    <span>Grasas</span>
                  </div>
                </label>
                <input
                  type="number"
                  value={meal.fats}
                  onChange={(e) => setMeal({ ...meal, fats: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="gramos"
                  required
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 group"
            >
              <span className="flex items-center justify-center gap-2">
                {isEdit ? 'Guardar Cambios' : 'Añadir Comida'}
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}