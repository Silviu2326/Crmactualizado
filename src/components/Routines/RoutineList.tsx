import React, { useState } from 'react';
import Button from '../Common/Button';
import PlanningList from './PlanningList';
import ExerciseList from './ExerciseList';
import WorkoutList from './WorkoutList';
import { useTheme } from '../../contexts/ThemeContext';

const RoutineList: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('planificaciones');

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
<<<<<<< HEAD
          {activeTab === 'ejercicios' ? 'Ejercicios' : activeTab === 'rutinas' ? 'Ruaatinas' : 'Planificaciones'}
=======
          {activeTab === 'ejercicios' ? 'Ejercicios' : activeTab === 'rutinas' ? 'Rutinas' : 'Planificaciones'}
>>>>>>> 4b66a59ad3142712190e76bb601de772d01654e5
        </h2>
        <div className="flex space-x-2">
          {['Planificaciones', 'Ejercicios', 'Rutinas'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab.toLowerCase() === tab.toLowerCase() ? 'create' : 'normal'}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      {activeTab === 'planificaciones' && <PlanningList />}
      {activeTab === 'ejercicios' && <ExerciseList />}
      {activeTab === 'rutinas' && <WorkoutList />}
    </div>
  );
};

export default RoutineList;