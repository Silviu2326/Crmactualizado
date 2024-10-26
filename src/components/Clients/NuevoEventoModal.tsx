import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, AlignLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface NuevoEventoModalProps {
  onClose: () => void;
  onSave: (evento: any) => void;
  categorias: Categoria[];
  initialDate?: Date;
  initialEndDate?: Date;
}

// ... (rest of the interfaces remain the same)

export default function NuevoEventoModal({ 
  onClose, 
  onSave, 
  categorias,
  initialDate,
  initialEndDate 
}: NuevoEventoModalProps) {
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState(format(initialDate || new Date(), 'yyyy-MM-dd'));
  const [horaInicio, setHoraInicio] = useState(format(initialDate || new Date(), 'HH:mm'));
  const [horaFin, setHoraFin] = useState(format(initialEndDate || new Date(), 'HH:mm'));
  const [descripcion, setDescripcion] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState('');

  useEffect(() => {
    if (initialDate) {
      setFecha(format(initialDate, 'yyyy-MM-dd'));
      setHoraInicio(format(initialDate, 'HH:mm'));
    }
    if (initialEndDate) {
      setHoraFin(format(initialEndDate, 'HH:mm'));
    }
  }, [initialDate, initialEndDate]);

  // ... (rest of the component remains the same)
}