import React, { useState, useEffect } from 'react';
import DietInfo from '../components/dietspage/DietInfo';
import WeekSelector from '../components/dietspage/WeekSelector';
import MealModal from '../components/dietspage/MealModal';
import { LayoutGrid, List, Calendar, Clock } from 'lucide-react';
import GridDayView from '../components/dietspage/views/GridDayView';
import ListDayView from '../components/dietspage/views/ListDayView';
import CompactDayView from '../components/dietspage/views/CompactDayView';
import TimelineDayView from '../components/dietspage/views/TimelineDayView';
import { Meal, MealTime } from '../components/dietspage/views/types';

type ViewMode = 'grid' | 'list' | 'compact' | 'timeline';

export default function PageEdicionDieta() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [modalData, setModalData] = useState<{
    isEdit: boolean;
    meal?: Meal;
    mealTime?: string;
  }>({ isEdit: false });

  const [mealTimes] = useState<MealTime[]>([
    { title: "Desayuno", time: "07:00 - 09:00" },
    { title: "Almuerzo", time: "10:30 - 11:30" },
    { title: "Comida", time: "14:00 - 15:00" },
    { title: "Merienda", time: "17:00 - 18:00" },
    { title: "Cena", time: "20:00 - 21:30" }
  ]);

  const [savedMeals, setSavedMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const handleOpenModal = (e: CustomEvent) => {
      setModalData(e.detail);
      setIsModalOpen(true);
    };

    window.addEventListener('openMealModal', handleOpenModal as EventListener);
    return () => {
      window.removeEventListener('openMealModal', handleOpenModal as EventListener);
    };
  }, []);

  const days = [
    { id: 1, day: 'Lunes', date: '1 Mar', isToday: true },
    { id: 2, day: 'Martes', date: '2 Mar' },
    { id: 3, day: 'Miércoles', date: '3 Mar' },
    { id: 4, day: 'Jueves', date: '4 Mar' },
    { id: 5, day: 'Viernes', date: '5 Mar' },
    { id: 6, day: 'Sábado', date: '6 Mar' },
    { id: 7, day: 'Domingo', date: '7 Mar' },
  ];

  const macros = {
    calories: { current: 1800, target: 2200 },
    protein: { current: 140, target: 180 },
    carbs: { current: 180, target: 220 },
    fats: { current: 55, target: 73 }
  };

  const handleAddMeal = (mealTime: string) => {
    const event = new CustomEvent('openMealModal', {
      detail: { isEdit: false, mealTime }
    });
    window.dispatchEvent(event);
  };

  const handleEditMeal = (meal: Meal) => {
    const event = new CustomEvent('openMealModal', {
      detail: { 
        isEdit: true,
        meal
      }
    });
    window.dispatchEvent(event);
  };

  const handleSaveMeal = (meal: Meal) => {
    if (modalData.isEdit) {
      setSavedMeals(prev => prev.map(m => 
        m.id === modalData.meal?.id ? { ...meal, id: m.id } : m
      ));
    } else {
      setSavedMeals(prev => [...prev, { 
        ...meal, 
        id: Date.now().toString(),
        mealTime: modalData.mealTime 
      }]);
    }
  };

  const getMealsForTime = (mealTime: string) => {
    return savedMeals.filter(meal => meal.mealTime === mealTime);
  };

  const getViewClass = () => {
    switch (viewMode) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6';
      case 'compact':
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4';
      default:
        return 'space-y-4';
    }
  };

  const renderDayView = (dayData: typeof days[0]) => {
    const props = {
      day: dayData.day,
      date: dayData.date,
      isToday: dayData.isToday,
      mealTimes,
      macros,
      handleAddMeal,
      handleEditMeal,
      getMealsForTime
    };

    switch (viewMode) {
      case 'grid':
        return <GridDayView key={dayData.id} {...props} />;
      case 'list':
        return <ListDayView key={dayData.id} {...props} />;
      case 'compact':
        return <CompactDayView key={dayData.id} {...props} />;
      case 'timeline':
        return <TimelineDayView key={dayData.id} {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DietInfo />
        <div className="flex justify-between items-center mb-6">
          <WeekSelector />
          <div className="flex items-center space-x-2 bg-white rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Vista Cuadrícula"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Vista Lista"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'compact'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Vista Compacta"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'timeline'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="Vista Línea de Tiempo"
            >
              <Clock className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className={getViewClass()}>
          {days.map((day) => renderDayView(day))}
        </div>
      </div>
      <MealModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEdit={modalData.isEdit}
        initialMeal={modalData.meal}
        onSave={handleSaveMeal}
      />
    </div>
  );
}