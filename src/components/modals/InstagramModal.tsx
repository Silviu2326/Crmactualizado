import React from 'react';
import { X, Image, MapPin, Smile } from 'lucide-react';

interface InstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstagramModal: React.FC<InstagramModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#E1306C]">Crear Publicación</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contenido</label>
            <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
              <option value="image">Imagen</option>
              <option value="video">Video</option>
              <option value="carousel">Carrusel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subir Archivo(s)</label>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-500 rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-50">
                <Image size={24} className="mb-2" />
                <span className="text-sm">Ningún archivo seleccionado</span>
                <input type="file" className="hidden" multiple accept="image/*,video/*" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">O Ingresar URL</label>
            <input
              type="url"
              placeholder="https://ejemplo.com/media"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leyenda</label>
            <div className="relative">
              <textarea
                rows={4}
                placeholder="Escribe una leyenda..."
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent pr-8"
              />
              <button
                type="button"
                className="absolute right-2 bottom-2 text-gray-400 hover:text-gray-600"
              >
                <Smile size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">2200 caracteres restantes</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Agregar ubicación"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent pl-8"
              />
              <MapPin size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

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
              className="px-4 py-2 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:from-pink-600 hover:to-purple-600"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstagramModal;