import { 
    Users, Dumbbell, Salad, DollarSign, Megaphone, 
    Settings, PlusCircle, Save, Trash2, Edit 
  } from 'lucide-react';
  import { NavigateFunction } from 'react-router-dom';
  import React from 'react';
  
  interface CommandOption {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    action: (navigate: NavigateFunction) => void;
    shortcut?: string[];
    context?: string[];
  }
  
  const handleNewItem = () => {
    console.log('Creating new item');
  };
  
  const handleSave = () => {
    console.log('Saving changes');
  };
  
  const handleDelete = () => {
    console.log('Deleting item');
  };
  
  const handleEdit = () => {
    console.log('Editing item');
  };
  
  export const commandOptions: CommandOption[] = [
    {
      id: 'clients',
      title: 'Gestionar Clientes',
      description: 'Ver y administrar clientes',
      icon: React.createElement(Users, { size: 20 }),
      action: (navigate) => navigate('/clients'),
      shortcut: ['f', 'c']
    },
    {
      id: 'routines',
      title: 'Rutinas',
      description: 'Gestionar rutinas de entrenamiento',
      icon: React.createElement(Dumbbell, { size: 20 }),
      action: (navigate) => navigate('/routines'),
      shortcut: ['f', 'r']
    },
    {
      id: 'diets',
      title: 'Dietas',
      description: 'Gestionar planes nutricionales',
      icon: React.createElement(Salad, { size: 20 }),
      action: (navigate) => navigate('/diets'),
      shortcut: ['f', 'd']
    },
    {
      id: 'economics',
      title: 'Economía',
      description: 'Gestionar finanzas y pagos',
      icon: React.createElement(DollarSign, { size: 20 }),
      action: (navigate) => navigate('/economics'),
      shortcut: ['f', 'e']
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Gestionar campañas y análisis',
      icon: React.createElement(Megaphone, { size: 20 }),
      action: (navigate) => navigate('/marketing/campaigns'),
      shortcut: ['f', 'm']
    },
    {
      id: 'settings',
      title: 'Configuración',
      description: 'Ajustes del sistema',
      icon: React.createElement(Settings, { size: 20 }),
      action: (navigate) => navigate('/settings'),
      shortcut: ['f', 's']
    },
    {
      id: 'new',
      title: 'Crear Nuevo',
      description: 'Crear nuevo elemento en la sección actual',
      icon: React.createElement(PlusCircle, { size: 20 }),
      action: () => handleNewItem(),
      shortcut: ['f', 'n'],
      context: ['clients', 'routines', 'diets', 'economics']
    },
    {
      id: 'save',
      title: 'Guardar',
      description: 'Guardar cambios actuales',
      icon: React.createElement(Save, { size: 20 }),
      action: () => handleSave(),
      shortcut: ['f', 'g'],
      context: ['routines', 'diets', 'economics']
    },
    {
      id: 'delete',
      title: 'Eliminar',
      description: 'Eliminar elemento seleccionado',
      icon: React.createElement(Trash2, { size: 20 }),
      action: () => handleDelete(),
      shortcut: ['f', 'x'],
      context: ['clients', 'routines', 'diets']
    },
    {
      id: 'edit',
      title: 'Editar',
      description: 'Editar elemento seleccionado',
      icon: React.createElement(Edit, { size: 20 }),
      action: () => handleEdit(),
      shortcut: ['f', 't'],
      context: ['clients', 'routines', 'diets']
    }
  ];