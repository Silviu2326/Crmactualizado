import { ReactNode } from 'react';

export interface ServicioBase {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface ClaseGrupal extends ServicioBase {
  horario: string;
  instructor: string;
  capacidad: number;
  participantes: number;
}

export interface Cita extends ServicioBase {
  fecha: string;
  hora: string;
  cliente: string;
  estado: 'Pendiente' | 'Confirmada' | 'Cancelada';
}

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  fechaInicio: string;
  estado: 'Activo' | 'Inactivo';
}

export interface PlanPago {
  id: number;
  nombre: string;
  precio: string;
  duracion: string;
  descripcion: string;
  clientes: Cliente[];
}

export interface ServicioAsesoriaSubscripcion extends ServicioBase {
  duracion: string;
  detalles: string;
  planes: PlanPago[];
}

export interface CategoriaServicio {
  id: string;
  titulo: string;
  icono: ReactNode;
  tipo: 'clase' | 'asesoria' | 'suscripcion' | 'cita';
  datos: (ClaseGrupal | ServicioAsesoriaSubscripcion | Cita)[];
}