import React from 'react';
import { Plus, Edit3, Coffee } from 'lucide-react';
import MacroProgress from '../MacroProgress';
import { MealTime } from './types';

interface GridDayViewProps {
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

export default function GridDayView({
  day,
  date,
  mealTimes,
  macros,
  handleAddMeal,
  handleEditMeal,
  handleEditMacros,
  getMealsForTime
}: GridDayViewProps) {
  
  const calculateMealTotals = (meals: any[]) => {
    return meals.reduce((acc, meal) => {
      let mealCalorias = 0;
      let mealProteinas = 0;
      let mealCarbohidratos = 0;
      let mealGrasas = 0;

      meal.ingredientes?.forEach((ingrediente: any) => {
        mealCalorias += Number(ingrediente.calorias) || 0;
        mealProteinas += Number(ingrediente.proteinas) || 0;
        mealCarbohidratos += Number(ingrediente.carbohidratos) || 0;
        mealGrasas += Number(ingrediente.grasas) || 0;
      });

      return {
        calorias: acc.calorias + mealCalorias,
        proteinas: acc.proteinas + mealProteinas,
        carbohidratos: acc.carbohidratos + mealCarbohidratos,
        grasas: acc.grasas + mealGrasas
      };
    }, {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0
    });
  };

  // Obtener todas las comidas del día
  const allMeals = getMealsForTime();


  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Encabezado del día */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold capitalize">{day}</h3>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleAddMeal("Comida")}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Plus size={18} className="text-blue-600" />
            </button>
            <button
              onClick={handleEditMacros}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit3 size={18} />
            </button>
          </div>
        </div>

        {/* Macros del día */}
        <div className="grid grid-cols-2 gap-2 mt-4">
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
      </div>

      {/* Comidas del día */}
      <div className="p-4">
        {allMeals.length > 0 ? (
          <div className="space-y-4">
            {allMeals.map((meal: any) => {
              const mealTotals = calculateMealTotals([meal]);
              return (
                <div
                  key={meal.numero}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleEditMeal(meal)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Coffee className="w-5 h-5 text-gray-500" />
                        <h4 className="font-medium text-gray-900">Comida #{meal.numero}</h4>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Peso total: {meal.peso}g</p>
                    </div>
                    <Edit3 size={16} className="text-gray-400" />
                  </div>

                  {/* Ingredientes */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700">Ingredientes:</h5>
                    <div className="pl-4 space-y-2">
                      {meal.ingredientes?.map((ingrediente: any, index: number) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium text-gray-700">{ingrediente.nombre}</p>
                          <p className="text-gray-500">
                            {ingrediente.calorias} kcal | {ingrediente.proteinas}g P | {ingrediente.carbohidratos}g C | {ingrediente.grasas}g G
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totales de la comida */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-700">Totales de la comida:</p>
                      <p className="text-sm text-gray-600">
                        {mealTotals.calorias} kcal | {mealTotals.proteinas}g P | {mealTotals.carbohidratos}g C | {mealTotals.grasas}g G
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No hay comidas agregadas para este día</p>
            <button
              onClick={() => handleAddMeal("Comida")}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Agregar comida
            </button>
          </div>
        )}
      </div>
    </div>
  );
}