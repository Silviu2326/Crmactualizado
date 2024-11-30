// src/pages/ServiciosPage.tsx
import React from 'react';
import ServiciosLista from '../components/Clients/ServiciosLista';

const ServiciosPage: React.FC = () => {
  return (
    <div>
      {/* Integración del componente ServiciosLista */}
      <ServiciosLista />
    </div>
  );
};

export default ServiciosPage;
