// src/constants/predefinedExercises.ts

export interface Exercise {
    id: string;
    name: string;
    category: string;
    muscleGroup: string;
    defaultSets: {
      reps: number;
      weight?: number;
      rest?: number;
    }[];
    difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
    equipment: string[];
  }
  
  export const predefinedExercises: Exercise[] = [
    {
      id: 'squat',
      name: 'Sentadilla',
      category: 'Compuesto',
      muscleGroup: 'Piernas',
      defaultSets: [
        { reps: 8, weight: 60, rest: 90 },
        { reps: 8, weight: 65, rest: 90 },
        { reps: 8, weight: 70, rest: 90 },
        { reps: 0, weight: 0, rest: 60 }, // Serie adicional para variantes que requieren 4 series
      ],
      difficulty: 'Intermedio',
      equipment: ['Barra', 'Rack'],
    },
    {
      id: 'bench-press',
      name: 'Press de Banca',
      category: 'Compuesto',
      muscleGroup: 'Pecho',
      defaultSets: [
        { reps: 8, weight: 40, rest: 90 },
        { reps: 8, weight: 45, rest: 90 },
        { reps: 8, weight: 50, rest: 90 },
        { reps: 0, weight: 0, rest: 60 }, // Serie adicional
      ],
      difficulty: 'Intermedio',
      equipment: ['Barra', 'Banco'],
    },
    {
      id: 'deadlift',
      name: 'Peso Muerto',
      category: 'Compuesto',
      muscleGroup: 'Espalda',
      defaultSets: [
        { reps: 6, weight: 80, rest: 120 },
        { reps: 6, weight: 85, rest: 120 },
        { reps: 6, weight: 90, rest: 120 },
        { reps: 0, weight: 0, rest: 60 }, // Serie adicional
      ],
      difficulty: 'Avanzado',
      equipment: ['Barra'],
    },
  ];
  