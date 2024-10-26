import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { StickyNote, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import Button from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: string;
  content: string;
  date: string;
  category: 'general' | 'training' | 'diet' | 'medical';
}

const initialNotes: Note[] = [
  {
    id: '1',
    content: 'Cliente muestra gran progreso en ejercicios de fuerza. Aumentar peso en press de banca.',
    date: '2024-03-10',
    category: 'training'
  },
  {
    id: '2',
    content: 'Reporta molestias leves en rodilla derecha durante sentadillas. Modificar ejercicios.',
    date: '2024-03-08',
    category: 'medical'
  },
  {
    id: '3',
    content: 'Cumpliendo bien con la dieta. Aumentar ingesta de proteínas.',
    date: '2024-03-05',
    category: 'diet'
  }
];

const categoryColors = {
  general: 'bg-gray-500',
  training: 'bg-blue-500',
  diet: 'bg-green-500',
  medical: 'bg-red-500'
};

const categoryLabels = {
  general: 'General',
  training: 'Entrenamiento',
  diet: 'Nutrición',
  medical: 'Médico'
};

const Notes: React.FC = () => {
  const { theme } = useTheme();
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Note['category']>('general');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        date: new Date().toISOString().split('T')[0],
        category: selectedCategory
      };
      setNotes([note, ...notes]);
      setNewNote('');
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content: editContent } : note
    ));
    setEditingNote(null);
  };

  return (
    <div className={`
      p-6 rounded-xl shadow-lg
      ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}
      transition-all duration-300
    `}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <StickyNote className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Notas</h3>
        </div>
        <div className="flex space-x-2">
          {(Object.keys(categoryColors) as Array<keyof typeof categoryColors>).map((category) => (
            <Button
              key={category}
              variant="normal"
              onClick={() => setSelectedCategory(category)}
              className={`
                px-3 py-1 text-xs rounded-full transition-all duration-200
                ${selectedCategory === category
                  ? `${categoryColors[category]} text-white`
                  : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }
              `}
            >
              {categoryLabels[category]}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Escribe una nueva nota..."
            className={`
              flex-1 p-3 rounded-lg resize-none h-20
              ${theme === 'dark'
                ? 'bg-gray-700 text-white'
                : 'bg-gray-50 text-gray-900'}
              border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200
            `}
          />
          <Button
            variant="create"
            onClick={handleAddNote}
            className="self-stretch px-4 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`
                p-4 rounded-lg
                ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
                border-l-4 ${categoryColors[note.category]}
                hover:shadow-md transition-all duration-200
              `}
            >
              {editingNote === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={`
                      w-full p-2 rounded
                      ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}
                      border ${theme === 'dark' ? 'border-gray-500' : 'border-gray-200'}
                    `}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="normal"
                      onClick={() => setEditingNote(null)}
                      className="p-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="create"
                      onClick={() => handleSaveEdit(note.id)}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${categoryColors[note.category]} text-white
                    `}>
                      {categoryLabels[note.category]}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditNote(note)}
                        className={`
                          p-1 rounded-full hover:bg-gray-600/20
                          transition-colors duration-200
                        `}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className={`
                          p-1 rounded-full hover:bg-red-500/20
                          transition-colors duration-200
                        `}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className={`
                    text-sm mb-2
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
                  `}>
                    {note.content}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(note.date).toLocaleDateString()}
                  </span>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notes;