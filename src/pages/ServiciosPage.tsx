// src/pages/ServiciosPage.tsx
import React from 'react';
import ServiciosLista from '../components/Clients/ServiciosLista';
import { useAuth } from '../contexts/AuthContext';

const ServiciosPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
          <p>Por favor, inicia sesión para ver los servicios.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Integración del componente ServiciosLista */}
      <ServiciosLista />
    </div>
  );
};

export default ServiciosPage;
