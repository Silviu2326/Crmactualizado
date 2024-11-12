import React from 'react';
import { X } from 'lucide-react';

interface YouTubeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const YouTubeModal: React.FC<YouTubeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-red-500">Subir Video a YouTube</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Video</label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-500 rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-50">
                <span className="text-sm">Ningún archivo seleccionado</span>
                <input type="file" className="hidden" accept="video/*" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título del Video (max. 100 caracteres)
            </label>
            <input
              type="text"
              maxLength={100}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción del Video
            </label>
            <textarea
              rows={4}
              placeholder="Describe el contenido del video..."
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etiquetas (separadas por comas)
            </label>
            <input
              type="text"
              placeholder="Ejemplo: React, Tutorial, JavaScript"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Configuración de Privacidad
            </label>
            <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
              <option value="public">Público</option>
              <option value="unlisted">No listado</option>
              <option value="private">Privado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subir Miniatura Personalizada
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-500 rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-50">
                <span className="text-sm">Ningún archivo seleccionado</span>
                <input type="file" className="hidden" accept="image/*" />
              </label>
            </div>
          </div>

          <details className="mt-4">
            <summary className="text-red-500 cursor-pointer">Opciones Avanzadas</summary>
            <div className="mt-2 space-y-4 pl-4">
              {/* Add advanced options here */}
            </div>
          </details>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Subir Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default YouTubeModal;