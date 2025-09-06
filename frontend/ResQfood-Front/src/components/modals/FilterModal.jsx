import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';

const CATEGORIAS_DISPONIBLES = ["Frutas", "Panadería", "Comida preparada", "Verduras", "Lácteos", "Carnes"];

const FilterModal = ({ isOpen, onClose, currentFilters, onFiltersChange, onResetFilters }) => {
    // Usamos un estado local para no modificar el estado global hasta que el usuario aplique los cambios.
    const [localFilters, setLocalFilters] = useState(currentFilters);

    useEffect(() => {
        // Sincroniza el estado local si los filtros globales cambian mientras el modal está abierto
        setLocalFilters(currentFilters);
    }, [currentFilters]);

    const handleCategoryToggle = (category) => {
        const categories = localFilters.categories || [];
        const newCategories = categories.includes(category)
            ? categories.filter(c => c !== category)
            : [...categories, category];
        setLocalFilters(prev => ({ ...prev, categories: newCategories }));
    };

    const handleApply = () => {
        onFiltersChange(localFilters); // Actualiza el estado global
        onClose(); // Cierra el modal
    };
    
    const handleReset = () => {
        onResetFilters();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-20 p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                <div className="p-4 border-b">
                    <div className="relative flex items-center">
                        <Search size={20} className="absolute left-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar alimento o palabra clave"
                            className="w-full h-10 bg-gray-50 rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={localFilters.searchTerm || ''}
                            onChange={(e) => setLocalFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <div className="flex flex-wrap gap-2 text-sm">
                        <button 
                            className={`px-3 py-1.5 rounded-lg ${localFilters.useUserLocation ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                            onClick={() => setLocalFilters(prev => ({...prev, useUserLocation: !prev.useUserLocation}))}
                        >
                            📍 Usar mi ubicación
                        </button>
                        <button
                            className={`px-3 py-1.5 rounded-lg ${localFilters.dateRange === 'lastWeek' ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                            onClick={() => setLocalFilters(prev => ({...prev, dateRange: prev.dateRange === 'lastWeek' ? 'all' : 'lastWeek'}))}
                        >
                            🗓️ Última semana
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={handleReset}>
                            🔄 Restablecer filtros
                        </button>
                    </div>

                    <div className="border-t pt-4">
                        <p className="font-semibold text-sm mb-2">Categorías</p>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIAS_DISPONIBLES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryToggle(cat)}
                                    className={`px-3 py-1.5 text-sm rounded-full border ${
                                        (localFilters.categories || []).includes(cat)
                                            ? 'bg-primary/20 border-primary text-primary font-semibold'
                                            : 'bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                     <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">
                        Cancelar
                    </button>
                    <button onClick={handleApply} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-brandPrimaryDarker">
                        Aplicar filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;