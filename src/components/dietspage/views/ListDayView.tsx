import React from 'react';
import { Plus, Edit3 } from 'lucide-react';
import MacroProgress from '../MacroProgress';
import { MealTime } from './types';

interface ListDayViewProps {
  day: string;
  date: string;
  isToday: boolean;
  mealTimes: MealTime[];
  macros: {
    calories: { current: number; target: number };
    protein: { current: number; target: number };
    carbs: { current: number; target: number };
    fats: { current: number; target: number };
  };
  handleAddMeal: (mealTime: string) => void;
  handleEditMeal: (meal: any) => void;
  handleEditMacros: () => void;
  getMealsForTime: (mealTime: string) => any[];
}

export default function ListDayView({
  day,
  date,
  isToday,
  mealTimes,
  macros,
  handleAddMeal,
  handleEditMeal,
  handleEditMacros,
  getMealsForTime
}: ListDayViewProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      {/* Encabezado del día */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold capitalize">{day}</h3>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <button
          onClick={handleEditMacros}
          className="text-blue-600 hover:text-blue-700"
        >
          <Edit3 size={18} />
        </button>
      </div>

      {/* Macros del día */}
      <div className="grid grid-cols-2 gap-2">
        <MacroProgress
          label="Calorías"
          current={macros.calories.current}
          target={macros.calories.target}
          unit="kcal"
        />
        <MacroProgress
          label="Proteínas"
          current={macros.protein.current}
          target={macros.protein.target}
          unit="g"
        />
        <MacroProgress
          label="Carbohidratos"
          current={macros.carbs.current}
          target={macros.carbs.target}
          unit="g"
        />
        <MacroProgress
          label="Grasas"
          current={macros.fats.current}
          target={macros.fats.target}
          unit="g"
        />
      </div>

      {/* Lista de comidas */}
      <div className="space-y-4">
        {mealTimes.map((mealTime) => {
          const meals = getMealsForTime(mealTime.title);
          return (
            <div key={mealTime.title} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{mealTime.title}</h4>
                  <p className="text-sm text-gray-500">{mealTime.time}</p>
                </div>
                <button
                  onClick={() => handleAddMeal(mealTime.title)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <Plus size={18} className="text-blue-600" />
                </button>
              </div>
              {meals.length > 0 ? (
                <div className="pl-4 space-y-2">
                  {meals.map((meal: any) => (
                    <div
                      key={meal.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleEditMeal(meal)}
                    >
                      <div>
                        <p className="font-medium">{meal.nombre}</p>
                        <p className="text-sm text-gray-500">
                          {meal.calorias} kcal | {meal.proteinas}g P | {meal.carbohidratos}g C | {meal.grasas}g G
                        </p>
                      </div>
                      <Edit3 size={16} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 pl-4">No hay comidas agregadas</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}