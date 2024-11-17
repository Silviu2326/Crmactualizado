import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Table, Command, Save } from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from '@floating-ui/react';
import { predefinedExercises } from './predefinedExercises';

interface Cell {
  id: string;
  value: string;
  isEditing: boolean;
  tempValue?: string;
}

interface Row {
  id: string;
  exerciseId?: string;
  setNumber?: number;
  cells: Cell[];
  isSelected: boolean;
  isSetRow?: boolean;
}

interface VistaExcelProps {
  semanaActual: number;
  planSemanal: any;
  updatePlan: (plan: any) => void;
}

const VistaExcel: React.FC<VistaExcelProps> = ({
  semanaActual,
  planSemanal,
  updatePlan,
}) => {
  const { theme } = useTheme();
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<{ [key: string]: HTMLTableCellElement | null }>({});

  const { refs, floatingStyles, update } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(2), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const dias = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  const columns = [
    'Ejercicio',
    'Series',
    'Repeticiones',
    'Peso (kg)',
    'Descanso (s)',
    'Notas',
  ];

  const filteredExercises = predefinedExercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  const handleExerciseSelect = (
    exercise: (typeof predefinedExercises)[0],
    rowIndex: number
  ) => {
    // Implementación de la selección de ejercicio
  };

  const generateRows = useCallback(() => {
    if (!planSemanal[selectedDay]) return [];

    const exercises = planSemanal[selectedDay].sessions.flatMap(
      (session: any) => session.exercises
    );

    const initialRows: Row[] = [];
    let rowIndex = 0;

    exercises.forEach((exercise: any) => {
      initialRows.push({
        id: `row-${rowIndex}`,
        exerciseId: exercise.id,
        isSelected: false,
        cells: [
          { id: `cell-${rowIndex}-0`, value: exercise.name, isEditing: false },
          {
            id: `cell-${rowIndex}-1`,
            value: exercise.sets.length.toString(),
            isEditing: false,
          },
          { id: `cell-${rowIndex}-2`, value: '-', isEditing: false },
          { id: `cell-${rowIndex}-3`, value: '-', isEditing: false },
          { id: `cell-${rowIndex}-4`, value: '-', isEditing: false },
          {
            id: `cell-${rowIndex}-5`,
            value: exercise.notes || '',
            isEditing: false,
          },
        ],
      });
      rowIndex++;

      exercise.sets.forEach((set: any, setIndex: number) => {
        initialRows.push({
          id: `row-${rowIndex}-set-${setIndex}`,
          exerciseId: exercise.id,
          setNumber: setIndex + 1,
          isSelected: false,
          isSetRow: true,
          cells: [
            {
              id: `cell-${rowIndex}-0`,
              value: `Serie ${setIndex + 1}`,
              isEditing: false,
            },
            { id: `cell-${rowIndex}-1`, value: '', isEditing: false },
            {
              id: `cell-${rowIndex}-2`,
              value: set.reps.toString(),
              isEditing: false,
            },
            {
              id: `cell-${rowIndex}-3`,
              value: set.weight?.toString() || '',
              isEditing: false,
            },
            {
              id: `cell-${rowIndex}-4`,
              value: set.rest?.toString() || '',
              isEditing: false,
            },
            { id: `cell-${rowIndex}-5`, value: '', isEditing: false },
          ],
        });
        rowIndex++;
      });
    });

    const emptyRows = Array(Math.max(0, 20 - initialRows.length))
      .fill(null)
      .map((_, i) => ({
        id: `empty-row-${rowIndex + i}`,
        isSelected: false,
        cells: Array(columns.length)
          .fill(null)
          .map((_, j) => ({
            id: `empty-cell-${rowIndex + i}-${j}`,
            value: '',
            isEditing: false,
          })),
      }));

    return [...initialRows, ...emptyRows];
  }, [planSemanal, selectedDay, columns.length]);

  const [rows, setRows] = useState<Row[]>(generateRows());

  useEffect(() => {
    setRows(generateRows());
  }, [selectedDay, generateRows]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const { row, col } = selectedCell;

      if (e.key === 'ArrowUp' && row > 0) {
        e.preventDefault();
        setSelectedCell({ row: row - 1, col });
      }
      if (e.key === 'ArrowDown' && row < rows.length - 1) {
        e.preventDefault();
        setSelectedCell({ row: row + 1, col });
      }
      if (e.key === 'ArrowLeft' && col > 0) {
        e.preventDefault();
        setSelectedCell({ row, col: col - 1 });
      }
      if (e.key === 'ArrowRight' && col < columns.length - 1) {
        e.preventDefault();
        setSelectedCell({ row, col: col + 1 });
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        toggleCellEdit(row, col);
      }
      if (e.key === 'F2') {
        e.preventDefault();
        toggleCellEdit(row, col);
      }
      if (e.key === 'Delete') {
        e.preventDefault();
        clearCell(row, col);
      }
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        copyCell(row, col);
      }
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        pasteCell(row, col);
      }
      if (e.key === '?' && e.ctrlKey) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, rows.length]);

  useEffect(() => {
    if (selectedCell && selectedCell.col === 0) {
      const { row, col } = selectedCell;
      const cellElement = cellRefs.current[`${row}-${col}`];
      if (cellElement) {
        refs.setReference(cellElement);
      }
    }
  }, [selectedCell, refs]);

  const updateSetsCount = (row: number, newCount: number) => {
    // Implementación existente
  };

  const canEditCell = (row: Row, col: number) => {
    if (row.isSetRow) {
      return !(col === 0 || col === 1 || col === 5);
    }
    return true;
  };

  const toggleCellEdit = (row: number, col: number) => {
    if (!canEditCell(rows[row], col)) return;

    setRows((prev) =>
      prev.map((r, rowIndex) => ({
        ...r,
        cells: r.cells.map((cell, colIndex) => ({
          ...cell,
          isEditing:
            rowIndex === row && colIndex === col ? !cell.isEditing : false,
          tempValue:
            rowIndex === row && colIndex === col ? cell.value : cell.tempValue,
        })),
      }))
    );

    if (col === 0 && !rows[row].isSetRow) {
      setShowExerciseDropdown(true);
      setExerciseSearch(rows[row].cells[0].value);
      update?.();
    }
  };

  const updateCellValue = (
    row: number,
    col: number,
    value: string,
    commit: boolean = true
  ) => {
    if (!commit) {
      // Solo actualizar el valor temporal
      setRows((prev) =>
        prev.map((r, rowIndex) => ({
          ...r,
          cells: r.cells.map((cell, colIndex) => ({
            ...cell,
            tempValue:
              rowIndex === row && colIndex === col ? value : cell.tempValue,
          })),
        }))
      );
      return;
    }

    const updatedRows = [...rows];
    const finalValue = updatedRows[row].cells[col].tempValue || value;
    updatedRows[row].cells[col].value = finalValue;
    updatedRows[row].cells[col].tempValue = undefined;
    setRows(updatedRows);

    // Si estamos actualizando el número de series
    if (col === 1 && !rows[row].isSetRow) {
      const newCount = parseInt(finalValue) || 0;
      updateSetsCount(row, newCount);
    }

    // **Eliminar la llamada a updatePlan aquí**
    /*
    const updatedPlan = { ...planSemanal };
    let exercise: any | undefined;
    let setIndex: number | undefined;

    for (const sess of updatedPlan[selectedDay].sessions) {
      for (const ex of sess.exercises) {
        if (ex.id === rows[row].exerciseId) {
          exercise = ex;
          break;
        }
      }
      if (exercise) break;
    }

    if (exercise) {
      if (rows[row].isSetRow && rows[row].setNumber) {
        setIndex = rows[row].setNumber - 1;
        if (setIndex < exercise.sets.length) {
          switch (col) {
            case 2:
              exercise.sets[setIndex].reps = parseInt(finalValue) || 0;
              break;
            case 3:
              exercise.sets[setIndex].weight = parseFloat(finalValue) || 0;
              break;
            case 4:
              exercise.sets[setIndex].rest = parseInt(finalValue) || 0;
              break;
          }
        }
      } else {
        switch (col) {
          case 0:
            exercise.name = finalValue;
            break;
          case 5:
            exercise.notes = finalValue;
            break;
        }
      }
    }

    updatePlan(updatedPlan);
    */
  };

  const clearCell = (row: number, col: number) => {
    if (!canEditCell(rows[row], col)) return;
    updateCellValue(row, col, '');
  };

  const copyCell = (row: number, col: number) => {
    const value = rows[row].cells[col].value;
    navigator.clipboard.writeText(value);
  };

  const pasteCell = async (row: number, col: number) => {
    if (!canEditCell(rows[row], col)) return;
    try {
      const text = await navigator.clipboard.readText();
      updateCellValue(row, col, text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const shortcuts = [
    { key: '↑/↓/←/→', description: 'Navegar entre celdas' },
    { key: 'Enter/F2', description: 'Editar celda' },
    { key: 'Delete', description: 'Borrar contenido' },
    { key: 'Ctrl + C', description: 'Copiar celda' },
    { key: 'Ctrl + V', description: 'Pegar en celda' },
    { key: 'Ctrl + ?', description: 'Mostrar atajos' },
  ];

  // Función para guardar cambios al padre
  const handleSaveChanges = () => {
    // Convertir las filas editadas de vuelta a la estructura de planSemanal
    const updatedPlanSemanal = { ...planSemanal };
    // Aquí debes mapear las filas (`rows`) de vuelta a la estructura esperada por `planSemanal`
    // Esto dependerá de cómo esté estructurado exactamente `planSemanal`
    // A continuación, se presenta una implementación genérica que deberás ajustar:

    const updatedExercises: any[] = [];
    rows.forEach((row) => {
      if (!row.isSetRow) {
        const exercise: any = {
          id: row.exerciseId,
          name: row.cells[0].value,
          notes: row.cells[5].value,
          sets: [],
        };
        // Recorre las filas de series asociadas
        const setRows = rows.filter(
          (setRow) => setRow.isSetRow && setRow.exerciseId === row.exerciseId
        );
        setRows.forEach((setRow) => {
          if (setRow.isSetRow && setRow.exerciseId === row.exerciseId) {
            exercise.sets.push({
              reps: parseInt(setRow.cells[2].value) || 0,
              weight: parseFloat(setRow.cells[3].value) || 0,
              rest: parseInt(setRow.cells[4].value) || 60,
            });
          }
        });
        updatedExercises.push(exercise);
      }
    });

    // Actualizar el planSemanal para el día seleccionado
    updatedPlanSemanal[selectedDay].sessions = [
      {
        exercises: updatedExercises,
      },
    ];

    // Llamar a updatePlan con el plan actualizado
    updatePlan(updatedPlanSemanal);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              className={`p-6 rounded-xl shadow-2xl max-w-md w-full ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Command className="w-5 h-5 mr-2" />
                Atajos de Teclado
              </h3>
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <kbd className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 font-mono text-sm">
                      {shortcut.key}
                    </kbd>
                    <span className="text-gray-600 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`p-6 rounded-xl shadow-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Table className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Vista Excel</h2>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="normal"
              onClick={() => setShowShortcuts(true)}
              className="flex items-center space-x-2"
            >
              <Command className="w-5 h-5" />
              <span>Atajos</span>
            </Button>
            <Button
              variant="create"
              className="flex items-center space-x-2"
              onClick={handleSaveChanges}
            >
              <Save className="w-5 h-5 mr-2" />
              <span>Guardar Cambios</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {dias.map((dia) => (
            <motion.button
              key={dia}
              onClick={() => setSelectedDay(dia)}
              className={`p-4 rounded-xl transition-all duration-300 ${
                selectedDay === dia
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center space-y-2">
                <span className="text-sm font-medium">{dia}</span>
                <span className="text-xs opacity-75">
                  {planSemanal[dia]?.sessions.length || 0} sesiones
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <div
          ref={gridRef}
          className="overflow-x-auto relative"
          style={{ maxHeight: 'calc(100vh - 300px)' }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`sticky top-0 px-4 py-3 text-left font-semibold ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`border-b ${
                    theme === 'dark'
                      ? 'border-gray-700 hover:bg-gray-750'
                      : 'border-gray-200 hover:bg-gray-50'
                  } ${
                    row.isSetRow
                      ? theme === 'dark'
                        ? 'bg-gray-750'
                        : 'bg-gray-50'
                      : ''
                  }`}
                >
                  {row.cells.map((cell, colIndex) => (
                    <td
                      key={cell.id}
                      ref={(el) => {
                        cellRefs.current[`${rowIndex}-${colIndex}`] = el;
                        // No llamamos a setReference aquí
                      }}
                      className={`px-4 py-3 ${row.isSetRow ? 'pl-8' : ''} ${
                        selectedCell?.row === rowIndex &&
                        selectedCell?.col === colIndex
                          ? theme === 'dark'
                            ? 'bg-blue-500/20 outline outline-2 outline-blue-500'
                            : 'bg-blue-100 outline outline-2 outline-blue-400'
                          : ''
                      }`}
                      onClick={() =>
                        setSelectedCell({ row: rowIndex, col: colIndex })
                      }
                    >
                      {cell.isEditing ? (
                        <input
                          type="text"
                          value={
                            colIndex === 0
                              ? exerciseSearch
                              : cell.tempValue ?? cell.value
                          }
                          onChange={(e) => {
                            if (colIndex === 0) {
                              setExerciseSearch(e.target.value);
                              setShowExerciseDropdown(true);
                            } else {
                              updateCellValue(
                                rowIndex,
                                colIndex,
                                e.target.value,
                                false
                              );
                            }
                          }}
                          onBlur={() => {
                            if (colIndex !== 0) {
                              updateCellValue(
                                rowIndex,
                                colIndex,
                                cell.tempValue || cell.value
                              );
                              toggleCellEdit(rowIndex, colIndex);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateCellValue(
                                rowIndex,
                                colIndex,
                                cell.tempValue || cell.value
                              );
                              toggleCellEdit(rowIndex, colIndex);
                            }
                          }}
                          autoFocus
                          className={`w-full px-2 py-1 rounded border ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600'
                              : 'bg-white border-gray-300'
                          }`}
                        />
                      ) : (
                        <div className="min-h-[24px]">{cell.value}</div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {showExerciseDropdown && selectedCell && (
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className={`z-50 w-64 max-h-60 overflow-y-auto rounded-lg shadow-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              } border ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
              }`}
            >
              {filteredExercises.length > 0 ? (
                filteredExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className={`px-4 py-2 cursor-pointer ${
                      theme === 'dark'
                        ? 'hover:bg-gray-600'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() =>
                      handleExerciseSelect(exercise, selectedCell.row)
                    }
                  >
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-gray-500">
                      {exercise.category} - {exercise.muscleGroup}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  No se encontraron ejercicios
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{rows.length} filas</span>
            <span>·</span>
            <span>{columns.length} columnas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VistaExcel;
