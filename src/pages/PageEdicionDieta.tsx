import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DietInfo from '../components/dietspage/DietInfo';
import WeekSelector from '../components/dietspage/WeekSelector';
import MealModal from '../components/dietspage/MealModal';
import MacrosEditModal from '../components/dietspage/MacrosEditModal';
import { LayoutGrid, List, Calendar, Clock } from 'lucide-react';
import GridDayView from '../components/dietspage/views/GridDayView';
import ListDayView from '../components/dietspage/views/ListDayView';
import CompactDayView from '../components/dietspage/views/CompactDayView';
import TimelineDayView from '../components/dietspage/views/TimelineDayView';
import { Meal, MealTime } from '../components/dietspage/views/types';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

type ViewMode = 'grid' | 'list' | 'compact' | 'timeline';

export default function PageEdicionDieta() {
  const location = useLocation();
  const { id } = useParams();
  const dietData = location.state?.dietData;

  console.log(' ID de la dieta:', id);
  console.log(' Datos recibidos en location.state:', location.state);
  console.log(' DietData completo:', dietData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [modalData, setModalData] = useState<{
    isEdit: boolean;
    meal?: Meal;
    mealTime?: string;
  }>({ isEdit: false });

  // Estado para el modal de edición de macros
  const [macrosModalOpen, setMacrosModalOpen] = useState(false);
  const [selectedDayForMacros, setSelectedDayForMacros] = useState<any>(null);

  // Estado para almacenar los datos de la dieta y la semana seleccionada
  const [diet, setDiet] = useState(dietData);
  const [selectedWeekId, setSelectedWeekId] = useState<number>(1);

  // Estado para el día y comida seleccionados para editar
  const [selectedDayForMeal, setSelectedDayForMeal] = useState<any>(null);
  const [selectedMealForEdit, setSelectedMealForEdit] = useState<any>(null);

  // Obtener los días de la semana seleccionada
  const selectedWeek = diet?.semanas?.find(semana => semana.idSemana === selectedWeekId);
  const days = selectedWeek?.dias || [];

  useEffect(() => {
    if (diet?.semanas?.length > 0) {
      setSelectedWeekId(diet.semanas[0].idSemana);
    }
  }, [diet?.semanas]);

  useEffect(() => {
    const fetchDietData = async () => {
      console.log(' Iniciando fetchDietData...');
      console.log(' Estado actual de dietData:', dietData);
      console.log(' ID actual:', id);

      if (!dietData && id) {
        try {
          console.log(' Obteniendo token...');
          const token = localStorage.getItem('token');
          console.log(' Token obtenido:', token ? 'Token presente' : 'Token no encontrado');

          console.log(' Realizando petición a la API...');
          const response = await fetch(`http://localhost:3000/api/dietas/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('No se pudo obtener la dieta');
          }

          const data = await response.json();
          console.log(' Datos recibidos de la API:', data);
          setDiet(data);
        } catch (error) {
          console.error(' Error al obtener la dieta:', error);
        }
      } else {
        console.log(' Usando datos del state:', dietData);
      }
    };

    fetchDietData();
  }, [id, dietData]);

  useEffect(() => {
    console.log(' Diet ha cambiado:', diet);
    // Si tenemos datos de la dieta, inicializamos los meals
    if (diet?.meals) {
      console.log(' Inicializando meals:', diet.meals);
      setSavedMeals(diet.meals);
    }
  }, [diet]);

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

  const calculateCurrentMacros = (meals: any[]) => {
    console.log('\n📊 CALCULANDO MACROS TOTALES:');
    console.log('Comidas a procesar:', meals);
    
    const totals = meals.reduce((acc, meal) => {
      // Convertir explícitamente a número y validar
      const calorias = Number(meal.calorias);
      const proteinas = Number(meal.proteinas);
      const carbohidratos = Number(meal.carbohidratos);
      const grasas = Number(meal.grasas);

      console.log('\nComida:', meal.nombre || 'Sin nombre');
      console.log('Valores convertidos:');
      console.log('- Calorías:', calorias, typeof calorias);
      console.log('- Proteínas:', proteinas, typeof proteinas);
      console.log('- Carbohidratos:', carbohidratos, typeof carbohidratos);
      console.log('- Grasas:', grasas, typeof grasas);

      return {
        calorias: acc.calorias + (isNaN(calorias) ? 0 : calorias),
        proteinas: acc.proteinas + (isNaN(proteinas) ? 0 : proteinas),
        carbohidratos: acc.carbohidratos + (isNaN(carbohidratos) ? 0 : carbohidratos),
        grasas: acc.grasas + (isNaN(grasas) ? 0 : grasas)
      };
    }, {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0
    });

    console.log('\n✅ TOTALES CALCULADOS:');
    console.log('- Calorías totales:', totals.calorias);
    console.log('- Proteínas totales:', totals.proteinas);
    console.log('- Carbohidratos totales:', totals.carbohidratos);
    console.log('- Grasas totales:', totals.grasas);

    return totals;
  };

  const handleEditMacros = async (dayData: any) => {
    setSelectedDayForMacros(dayData);
    setMacrosModalOpen(true);
  };

  const handleSaveMacros = async (newMacros: any) => {
    if (!selectedDayForMacros || !diet || !id) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/dietas/${id}/dias/${selectedDayForMacros.fecha}/macros`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          restricciones: newMacros
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar los macros');
      }

      const updatedDiet = await response.json();
      console.log('✅ Macros actualizados correctamente:', updatedDiet);
      
      // Actualizar el estado local
      setDiet(prevDiet => {
        if (!prevDiet) return updatedDiet;
        
        const updatedSemanas = prevDiet.semanas.map(semana => ({
          ...semana,
          dias: semana.dias.map(dia => {
            if (dia.fecha === selectedDayForMacros.fecha) {
              return {
                ...dia,
                restricciones: newMacros
              };
            }
            return dia;
          })
        }));

        return {
          ...prevDiet,
          semanas: updatedSemanas
        };
      });

    } catch (error) {
      console.error('❌ Error al actualizar macros:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleAddMeal = (dayData: any) => {
    setSelectedDayForMeal(dayData);
    setSelectedMealForEdit(null);
    const event = new CustomEvent('openMealModal', {
      detail: { isEdit: false }
    });
    window.dispatchEvent(event);
  };
  
  const handleEditMeal = (dayData: any, meal: any) => {
    setSelectedDayForMeal(dayData);
    setSelectedMealForEdit(meal);
    const event = new CustomEvent('openMealModal', {
      detail: {
        isEdit: true,
        meal
      }
    });
    window.dispatchEvent(event);
  };
    const handleSaveMeal = async (meal: any) => {
    if (!selectedDayForMeal || !diet || !id) return;

    try {
      console.log('\n🍽️ GUARDANDO NUEVA COMIDA:');
      console.log('Comida recibida:', meal);

      // Convertir y validar los valores de la comida
      const mealToSave = {
        ...meal,
        calorias: Number(meal.calorias) || 0,
        proteinas: Number(meal.proteinas) || 0,
        carbohidratos: Number(meal.carbohidratos) || 0,
        grasas: Number(meal.grasas) || 0
      };

      console.log('\n✅ Valores convertidos de la comida:');
      console.log('- Calorías:', mealToSave.calorias, typeof mealToSave.calorias);
      console.log('- Proteínas:', mealToSave.proteinas, typeof mealToSave.proteinas);
      console.log('- Carbohidratos:', mealToSave.carbohidratos, typeof mealToSave.carbohidratos);
      console.log('- Grasas:', mealToSave.grasas, typeof mealToSave.grasas);

      // Obtener todas las comidas del día
      const currentMeals = selectedDayForMeal.comidas || [];
      console.log('\n📋 Comidas actuales del día:', currentMeals);

      // Preparar lista actualizada de comidas
      const updatedMeals = selectedMealForEdit
        ? currentMeals.map((c: any) => c.id === selectedMealForEdit.id ? mealToSave : c)
        : [...currentMeals, mealToSave];

      console.log('\n📋 Lista actualizada de comidas:', updatedMeals);

      // Primero guardar la comida
      const token = localStorage.getItem('token');
      const endpoint = `http://localhost:3000/api/dietas/${id}/dias/${selectedDayForMeal.fecha}/comidas`;
      const method = selectedMealForEdit ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint + (selectedMealForEdit ? `/${selectedMealForEdit.id}` : ''), {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(mealToSave)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la comida');
      }

      // Actualizar el estado local con la nueva comida
      setDiet(prevDiet => {
        if (!prevDiet) return prevDiet;

        return {
          ...prevDiet,
          semanas: prevDiet.semanas.map(semana => ({
            ...semana,
            dias: semana.dias.map(dia => {
              if (dia.fecha === selectedDayForMeal.fecha) {
                return {
                  ...dia,
                  comidas: updatedMeals
                };
              }
              return dia;
            })
          }))
        };
      });

      // Calcular y actualizar los macros
      const calculatedMacros = calculateCurrentMacros(updatedMeals);
      const macrosData = {
        calorias: Math.round(calculatedMacros.calorias),
        proteinas: Math.round(calculatedMacros.proteinas),
        carbohidratos: Math.round(calculatedMacros.carbohidratos),
        grasas: Math.round(calculatedMacros.grasas)
      };

      console.log('\n🎯 ACTUALIZANDO MACROS:');
      console.log('URL:', `http://localhost:3000/api/dietas/${id}/dias/${selectedDayForMeal.fecha}/macros`);
      console.log('Macros a enviar:', {
        calorias: `${macrosData.calorias} kcal (${typeof macrosData.calorias})`,
        proteinas: `${macrosData.proteinas} g (${typeof macrosData.proteinas})`,
        carbohidratos: `${macrosData.carbohidratos} g (${typeof macrosData.carbohidratos})`,
        grasas: `${macrosData.grasas} g (${typeof macrosData.grasas})`
      });

      // Validar que no hay valores NaN
      if (Object.values(macrosData).some(value => isNaN(value))) {
        throw new Error('❌ Error: Algunos valores de macros son NaN');
      }

      // Actualizar los macros en la API
      const macrosResponse = await fetch(`http://localhost:3000/api/dietas/${id}/dias/${selectedDayForMeal.fecha}/macros`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(macrosData)
      });

      if (!macrosResponse.ok) {
        const errorText = await macrosResponse.text();
        console.error('\n❌ Error al actualizar macros:', errorText);
        throw new Error(`Error al actualizar macros: ${errorText}`);
      }

      const updatedMacros = await macrosResponse.json();
      console.log('\n✅ Macros actualizados correctamente:', updatedMacros);

      // Actualizar el estado local con los nuevos macros
      setDiet(prevDiet => {
        if (!prevDiet) return prevDiet;

        return {
          ...prevDiet,
          semanas: prevDiet.semanas.map(semana => ({
            ...semana,
            dias: semana.dias.map(dia => {
              if (dia.fecha === selectedDayForMeal.fecha) {
                return {
                  ...dia,
                  restricciones: {
                    ...dia.restricciones,
                    ...macrosData
                  }
                };
              }
              return dia;
            })
          }))
        };
      });

      setIsModalOpen(false);
      setSelectedDayForMeal(null);
      setSelectedMealForEdit(null);

    } catch (error) {
      console.error('\n❌ Error en el proceso:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleAddWeek = async () => {
    if (!diet || !diet.semanas || !diet.semanas.length) return;

    console.log('➕ Iniciando adición de nueva semana...');
    
    try {
      const lastWeek = diet.semanas[diet.semanas.length - 1];
      const lastDay = new Date(lastWeek.dias[lastWeek.dias.length - 1].fecha);
      const newWeekStart = new Date(lastDay);
      newWeekStart.setDate(newWeekStart.getDate() + 1);

      // Crear estructura para la nueva semana
      const newWeek = {
        idSemana: lastWeek.idSemana + 1,
        fechaInicio: newWeekStart.toISOString(),
        dias: Array.from({ length: 7 }, (_, index) => {
          const date = new Date(newWeekStart);
          date.setDate(date.getDate() + index);
          return {
            fecha: date.toISOString(),
            comidas: [],
            restricciones: {
              calorias: lastWeek.dias[0].restricciones.calorias,
              proteinas: lastWeek.dias[0].restricciones.proteinas,
              carbohidratos: lastWeek.dias[0].restricciones.carbohidratos,
              grasas: lastWeek.dias[0].restricciones.grasas
            }
          };
        })
      };

      console.log('📅 Nueva semana creada:', newWeek);

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/dietas/${id}/semanas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newWeek)
      });

      if (!response.ok) {
        throw new Error('Error al añadir la nueva semana');
      }

      // En lugar de reemplazar toda la dieta, solo actualizamos las semanas
      const updatedDietData = await response.json();
      setDiet(prevDiet => {
        if (!prevDiet) return updatedDietData;
        return {
          ...prevDiet,
          semanas: [...prevDiet.semanas, newWeek]
        };
      });

      console.log('✅ Semana añadida exitosamente');
    } catch (error) {
      console.error('❌ Error al añadir semana:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleWeekChange = (weekNumber: number) => {
    console.log('📅 Semana seleccionada:', weekNumber);
    setSelectedWeekId(weekNumber);
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

  const renderDayView = (dayData: any) => {
    console.log('🗓️ Renderizando día:', dayData.fecha);
    console.log('📋 Datos del día:', dayData);
    
    const formattedDate = format(parseISO(dayData.fecha), 'd MMM', { locale: es });
    const dayName = format(parseISO(dayData.fecha), 'EEEE', { locale: es });
    
    // Calcular los macros actuales basados en las comidas del día
    const currentMacros = calculateCurrentMacros(dayData.comidas || []);
    console.log('📊 Macros calculados para el día', dayData.fecha, ':', currentMacros);

    // Crear el objeto macros con valores actuales y objetivo
    const macros = {
      calories: { current: currentMacros.calorias, target: parseFloat(dayData.restricciones.calorias) || 0 },
      protein: { current: currentMacros.proteinas, target: parseFloat(dayData.restricciones.proteinas) || 0 },
      carbs: { current: currentMacros.carbohidratos, target: parseFloat(dayData.restricciones.carbohidratos) || 0 },
      fats: { current: currentMacros.grasas, target: parseFloat(dayData.restricciones.grasas) || 0 }
    };
    
    const props = {
      day: dayName,
      date: formattedDate,
      isToday: false,
      mealTimes,
      macros,
      handleAddMeal: (mealTime: string) => handleAddMeal(dayData, mealTime),
      handleEditMeal: (meal: any) => handleEditMeal(dayData, meal),
      handleEditMacros: () => handleEditMacros(dayData),
      getMealsForTime: () => dayData.comidas || [],
    };

    switch (viewMode) {
      case 'grid':
        return <GridDayView key={dayData.fecha} {...props} />;
      case 'list':
        return <ListDayView key={dayData.fecha} {...props} />;
      case 'compact':
        return <CompactDayView key={dayData.fecha} {...props} />;
      case 'timeline':
        return <TimelineDayView key={dayData.fecha} {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DietInfo
          title={diet?.nombre || 'Cargando...'}
          client={diet?.cliente?.nombre || 'Cliente no disponible'}
          goal={diet?.objetivo || 'Sin objetivo'}
          restrictions={diet?.restricciones || 'Sin restricciones'}
          macros={selectedWeek?.dias[0]?.restricciones ? {
            calories: { current: 0, target: selectedWeek.dias[0].restricciones.calorias },
            protein: { current: 0, target: selectedWeek.dias[0].restricciones.proteinas },
            carbs: { current: 0, target: selectedWeek.dias[0].restricciones.carbohidratos },
            fats: { current: 0, target: selectedWeek.dias[0].restricciones.grasas }
          } : undefined}
        />
        <div className="flex justify-between items-center mb-6">
          {diet?.semanas && diet.semanas.length > 0 && (
            <WeekSelector 
              semanas={diet.semanas}
              onWeekChange={handleWeekChange}
              onAddWeek={handleAddWeek}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          )}
        </div>
        <div className={getViewClass()}>
          {days.map((day) => renderDayView(day))}
        </div>
      </div>

      {/* Modal para editar macros */}
      {macrosModalOpen && selectedDayForMacros && (
        <MacrosEditModal
          isOpen={macrosModalOpen}
          onClose={() => setMacrosModalOpen(false)}
          dietId={id || ''}
          date={selectedDayForMacros.fecha}
          initialMacros={{
            calorias: selectedDayForMacros.restricciones?.calorias || 0,
            proteinas: selectedDayForMacros.restricciones?.proteinas || 0,
            carbohidratos: selectedDayForMacros.restricciones?.carbohidratos || 0,
            grasas: selectedDayForMacros.restricciones?.grasas || 0
          }}
          onMacrosUpdated={(updatedMacros) => {
            setDiet(prevDiet => {
              if (!prevDiet) return prevDiet;
              
              const updatedSemanas = prevDiet.semanas.map(semana => ({
                ...semana,
                dias: semana.dias.map(dia => {
                  if (dia.fecha === selectedDayForMacros.fecha) {
                    return {
                      ...dia,
                      restricciones: updatedMacros
                    };
                  }
                  return dia;
                })
              }));
              
              return {
                ...prevDiet,
                semanas: updatedSemanas
              };
            });
            setMacrosModalOpen(false);
          }}
        />
      )}

      <MealModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDayForMeal(null);
        }}
        onSave={handleSaveMeal}
        isEdit={modalData.isEdit}
        initialMeal={modalData.meal}
        mealTime={modalData.mealTime}
      />
    </div>
  );
}