import { 
    Users, Dumbbell, Salad, DollarSign, Megaphone, 
    Settings, PlusCircle, Save, Trash2, Edit,
    Snowflake, Gift, Star, TreePine, Bell, Heart,
    Sparkles, PartyPopper
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
    festiveIcon?: React.ReactNode;
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

  // Función para crear un icono festivo con animación
  const createFestiveIcon = (Icon: any, color: string = 'text-[#E61D2B]', animation: string = 'animate-bounce') => {
    return React.createElement(Icon, { 
      size: 20, 
      className: `${color} ${animation}` 
    });
  };
  
  export const commandOptions: CommandOption[] = [
    {
      id: 'clients',
      title: '🎄 Gestionar Clientes',
      description: '¡Haz felices a tus clientes estas fiestas!',
      icon: React.createElement(Users, { size: 20 }),
      festiveIcon: createFestiveIcon(Gift, 'text-[#E61D2B]', 'animate-bounce'),
      action: (navigate) => navigate('/clients'),
      shortcut: ['f', 'c']
    },
    {
      id: 'routines',
      title: '⭐ Rutinas Navideñas',
      description: 'Entrena con el espíritu de la Navidad',
      icon: React.createElement(Dumbbell, { size: 20 }),
      festiveIcon: createFestiveIcon(Star, 'text-yellow-300', 'animate-pulse'),
      action: (navigate) => navigate('/routines'),
      shortcut: ['f', 'r']
    },
    {
      id: 'diets',
      title: '🎅 Dietas Festivas',
      description: 'Planes nutricionales para las fiestas',
      icon: React.createElement(Salad, { size: 20 }),
      festiveIcon: createFestiveIcon(Sparkles, 'text-yellow-300', 'animate-spin'),
      action: (navigate) => navigate('/diets'),
      shortcut: ['f', 'd']
    },
    {
      id: 'economics',
      title: '🎁 Economía',
      description: 'Gestiona tus finanzas navideñas',
      icon: React.createElement(DollarSign, { size: 20 }),
      festiveIcon: createFestiveIcon(TreePine, 'text-[#E61D2B]', 'animate-bounce'),
      action: (navigate) => navigate('/economics'),
      shortcut: ['f', 'e']
    },
    {
      id: 'marketing',
      title: '❄️ Marketing Festivo',
      description: 'Campañas especiales de temporada',
      icon: React.createElement(Megaphone, { size: 20 }),
      festiveIcon: createFestiveIcon(Snowflake, 'text-blue-300', 'animate-spin'),
      action: (navigate) => navigate('/marketing/campaigns'),
      shortcut: ['f', 'm']
    },
    {
      id: 'settings',
      title: '🔔 Configuración',
      description: 'Personaliza tu experiencia navideña',
      icon: React.createElement(Settings, { size: 20 }),
      festiveIcon: createFestiveIcon(Bell, 'text-[#E61D2B]', 'animate-bounce'),
      action: (navigate) => navigate('/settings'),
      shortcut: ['f', 's']
    },
    {
      id: 'new',
      title: '✨ Crear Nuevo',
      description: 'Añade un toque mágico a tu contenido',
      icon: React.createElement(PlusCircle, { size: 20 }),
      festiveIcon: createFestiveIcon(PartyPopper, 'text-yellow-300', 'animate-bounce'),
      action: () => handleNewItem(),
      shortcut: ['f', 'n'],
      context: ['clients', 'routines', 'diets', 'economics']
    },
    {
      id: 'save',
      title: '🎄 Guardar',
      description: 'Guarda la magia de las fiestas',
      icon: React.createElement(Save, { size: 20 }),
      festiveIcon: createFestiveIcon(Heart, 'text-[#E61D2B]', 'animate-pulse'),
      action: () => handleSave(),
      shortcut: ['f', 'g'],
      context: ['routines', 'diets', 'economics']
    },
    {
      id: 'delete',
      title: '❄️ Eliminar',
      description: 'Hacer espacio para nuevas alegrías',
      icon: React.createElement(Trash2, { size: 20 }),
      festiveIcon: createFestiveIcon(Snowflake, 'text-blue-300', 'animate-spin'),
      action: () => handleDelete(),
      shortcut: ['f', 'x'],
      context: ['clients', 'routines', 'diets']
    },
    {
      id: 'edit',
      title: '🎁 Editar',
      description: 'Dale un toque especial a tu contenido',
      icon: React.createElement(Edit, { size: 20 }),
      festiveIcon: createFestiveIcon(Gift, 'text-[#E61D2B]', 'animate-bounce'),
      action: () => handleEdit(),
      shortcut: ['f', 't'],
      context: ['clients', 'routines', 'diets']
    }
  ];