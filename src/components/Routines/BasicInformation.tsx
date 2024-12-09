import React from 'react';

interface BasicInformationProps {
  routineName: string;
  setRoutineName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  notes: string;
  setNotes: (value: string) => void;
  theme?: 'light' | 'dark';
}

const predefinedTags = ['Upper body', 'Lower body', 'Push', 'Pull', 'Legs'];

export const BasicInformation: React.FC<BasicInformationProps> = ({
  routineName,
  setRoutineName,
  description,
  setDescription,
  selectedTags,
  setSelectedTags,
  notes,
  setNotes,
  theme = 'light'
}) => {
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6 mb-8">
      <div>
        <label className="block text-sm font-medium mb-2">
          Nombre de la Rutina
        </label>
        <input
          type="text"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300'
          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Ingrese el nombre de la rutina"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Descripción
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300'
          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Describa la rutina"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Tags/Categorías
        </label>
        <div className="flex flex-wrap gap-2">
          {predefinedTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagToggle(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Notas Adicionales
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg border ${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300'
          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          rows={3}
          placeholder="Añada notas adicionales sobre la rutina"
        />
      </div>
    </div>
  );
};