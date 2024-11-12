import React from 'react';
import RoutineList from '../components/Routines/RoutineList';

const RoutinesPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Rutinas de Entrenamiento</h2>
      <RoutineList />
    </div>
  );
};

export default RoutinesPage;