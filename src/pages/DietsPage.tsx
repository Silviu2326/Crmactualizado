import React from 'react';
import DietList from '../components/Diets/DietList';

const DietsPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Planes de Dieta</h2>
      <DietList />
    </div>
  );
};

export default DietsPage;