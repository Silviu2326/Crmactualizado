import React, { useState } from 'react';
import { Filter, Tag, X, Plus, ChevronDown, ChevronRight, Search, Settings, BarChart2 } from 'lucide-react';

interface Subcategoria {
  id: string;
  nombre: string;
}

interface Categoria {
  id: string;
  nombre: string;
  color: string;
  subcategorias?: Subcategoria[];
}

interface CalendarioSidebarProps {
  categorias: Categoria[];
  filtrosActivos: {
    categorias: string[];
    subcategorias: string[];
  };
  onToggleFiltro: (categoriaId: string, subcategoriaId?: string) => void;
}

export default function CalendarioSidebar({
  categorias,
  filtrosActivos,
  onToggleFiltro
}: CalendarioSidebarProps) {
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<string[]>(
    categorias.map(cat => cat.id)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showStats, setShowStats] = useState(false);

  const toggleExpansion = (categoriaId: string) => {
    setCategoriasExpandidas(prev =>
      prev.includes(categoriaId)
        ? prev.filter(id => id !== categoriaId)
        : [...prev, categoriaId]
    );
  };

  const filteredCategorias = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.subcategorias?.some(sub =>
      sub.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getEventosCount = (categoriaId: string) => {
    // Simulamos un conteo de eventos por categoría
    const counts: Record<string, number> = {
      'entrenamiento': 15,
      'nutricion': 8
    };
    return counts[categoriaId] || 0;
  };

  return (
    <div className="w-80 sidebar-gradient border-r border-gray-200/60 shadow-lg shadow-gray-100/50 flex flex-col">
      <div className="p-6 space-y-4 border-b border-gray-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Filter className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowStats(!showStats)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Mostrar estadísticas"
            >
              <BarChart2 className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Configuración"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          <Plus className="w-4 h-4" />
          Nueva categoría
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-6">
          {showStats && (
            <div className="mb-6 p-4 bg-white/50 rounded-xl border border-gray-200/60">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Resumen de eventos</h3>
              <div className="space-y-2">
                {categorias.map(categoria => (
                  <div key={`stat-${categoria.id}`} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{categoria.nombre}</span>
                    <span className="text-sm font-medium text-gray-900">{getEventosCount(categoria.id)} eventos</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-700">Categorías</h3>
              </div>
              <span className="text-xs text-gray-500">{filteredCategorias.length} categorías</span>
            </div>
            
            <div className="space-y-2">
              {filteredCategorias.map((categoria) => (
                <div key={categoria.id} className="space-y-1">
                  <div
                    className="category-item flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <button
                      onClick={() => toggleExpansion(categoria.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                    >
                      {categoriasExpandidas.includes(categoria.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      type="checkbox"
                      checked={filtrosActivos.categorias.includes(categoria.id)}
                      onChange={() => onToggleFiltro(categoria.id)}
                      className="custom-checkbox"
                    />
                    <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {categoria.nombre}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{getEventosCount(categoria.id)}</span>
                      <span
                        className="w-3 h-3 rounded-full ring-2 ring-offset-2 transition-all duration-200"
                        style={{ 
                          backgroundColor: categoria.color,
                          ringColor: categoria.color 
                        }}
                      />
                    </div>
                  </div>
                  {categoriasExpandidas.includes(categoria.id) && categoria.subcategorias && (
                    <div className="ml-12 space-y-1">
                      {categoria.subcategorias.map((subcategoria) => (
                        <label
                          key={subcategoria.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition-all duration-200 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={filtrosActivos.subcategorias.includes(subcategoria.id)}
                            onChange={() => onToggleFiltro(categoria.id, subcategoria.id)}
                            className="custom-checkbox"
                          />
                          <span className="flex-1 text-sm text-gray-600 group-hover:text-gray-800">
                            {subcategoria.nombre}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200/60 bg-white/50">
        <button 
          onClick={() => {
            const allCategories = categorias.map(cat => cat.id);
            const allSubcategories = categorias.flatMap(cat => cat.subcategorias?.map(sub => sub.id) || []);
            onToggleFiltro('reset');
          }}
          className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 border border-gray-200/60"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}