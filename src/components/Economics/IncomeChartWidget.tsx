import React from 'react';
import IncomeChart from './IncomeChart';

const IncomeChartWidget: React.FC = () => {
  return (
    <div className="h-full flex flex-col p-4">
      <h3 className="text-lg font-semibold mb-4">Gráfico de Ingresos</h3>
      <div className="flex-grow">
        <IncomeChart />
      </div>
    </div>
  );
};

export default IncomeChartWidget;